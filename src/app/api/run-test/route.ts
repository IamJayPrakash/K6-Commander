
import { NextResponse, type NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { spawn } from 'child_process';
import path from 'path';
import type { TestConfiguration } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const config: TestConfiguration = await req.json();
    const testId = uuidv4();

    // The script is inside the container at /k6/script.js
    const scriptPath = '/k6/script.js';
    
    // The results are written to /results inside the container
    const outputPath = `/results/summary-${testId}.json`;

    const dockerArgs = [
      'run',
      '--rm',
      `--name=k6-run-${testId}`,
      '--network=k6-commander_k6-network', // Assumes docker-compose default network name
      `-v=${path.resolve('./results')}:/results`,
      `-v=${path.resolve('./k6')}:/k6`,
      '-e', `K6_OUT=influxdb=http://influxdb:8086/k6,json=${outputPath}`,
      '-e', `TARGET_URL=${config.url}`,
      '-e', `HTTP_METHOD=${config.method}`,
      '-e', `HEADERS_JSON=${JSON.stringify(config.headers || {})}`,
      '-e', `BODY=${config.body || ''}`,
      '-e', `STAGES_JSON=${JSON.stringify(config.stages || [])}`,
      '-e', `VUS=${config.vus || ''}`,
      '-e', `DURATION=${config.duration || ''}`,
      '-e', `K6_INFLUXDB_TAGS_AS_FIELDS=testid`, // Custom tag for filtering in Grafana
      'grafana/k6',
      'run',
      '--tag', `testid=${testId}`,
      scriptPath
    ];

    console.log('Spawning k6 container with command:', `docker ${dockerArgs.join(' ')}`);

    const k6Process = spawn('docker', dockerArgs);

    let stdout = '';
    let stderr = '';

    k6Process.stdout.on('data', (data) => {
        stdout += data.toString();
        console.log(`k6 stdout (${testId}): ${data}`);
    });

    k6Process.stderr.on('data', (data) => {
        stderr += data.toString();
        console.error(`k6 stderr (${testId}): ${data}`);
    });

    const k6Promise = new Promise((resolve, reject) => {
        k6Process.on('close', (code) => {
            if (code === 0) {
              console.log(`k6 process for test ${testId} exited with code ${code}`);
              resolve(code);
            } else {
              console.error(`k6 process for test ${testId} exited with code ${code}`);
              reject(new Error(`k6 process exited with code ${code}. Stderr: ${stderr}`));
            }
        });
        
        k6Process.on('error', (err) => {
            console.error(`Failed to start k6 container for test ${testId}:`, err);
            reject(err);
        });
    });

    // We don't await the promise here. We let the frontend poll for the result.
    // This immediately returns the testId so the UI can update.
    // The promise is used to handle logging and potential race conditions if needed later.

    return NextResponse.json({ testId });

  } catch (error) {
    console.error('Error in /api/run-test:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to start test', details: errorMessage }, { status: 500 });
  }
}

