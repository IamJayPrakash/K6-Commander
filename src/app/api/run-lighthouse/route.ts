
import { NextResponse, type NextRequest } from 'next/server';
import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

// Increase the timeout for this route
export const maxDuration = 300; // 5 minutes

// This is a simplified, non-production-ready example.
// A robust solution would use a proper task queue and manage a pool of Chrome instances.
export async function POST(req: NextRequest) {
  try {
    const { url, testId } = await req.json();

    if (!url || !testId) {
      return NextResponse.json({ error: 'URL and Test ID are required' }, { status: 400 });
    }

    // Use /tmp for writable directory in serverless environments
    const resultsDir = path.resolve('/tmp/results');
    await fs.mkdir(resultsDir, { recursive: true });
    const reportPath = path.join(resultsDir, `lighthouse-${testId}`);

    const lighthouseArgs = [
      'lighthouse',
      url,
      '--output=json',
      '--output=html',
      `--output-path=${reportPath}`,
      '--only-categories=performance,accessibility,best-practices,seo',
      '--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage',
      '--quiet',
    ];

    console.log('Spawning Lighthouse process with command:', `npx ${lighthouseArgs.join(' ')}`);

    // In serverless environments, the home directory might not be writable.
    // We force npm/npx to use a writable temporary directory for its cache.
    const env = { ...process.env, NPM_CONFIG_CACHE: '/tmp/npm-cache' };

    const lighthouseProcess = spawn('npx', lighthouseArgs, { env });

    let stdout = '';
    let stderr = '';

    lighthouseProcess.stdout.on('data', (data) => {
      stdout += data.toString();
      console.log(`lighthouse stdout (${testId}): ${data}`);
    });

    lighthouseProcess.stderr.on('data', (data) => {
      stderr += data.toString();
      console.error(`lighthouse stderr (${testId}): ${data}`);
    });

    const lighthousePromise = new Promise((resolve, reject) => {
      lighthouseProcess.on('close', (code) => {
        if (code === 0) {
          console.log(`Lighthouse process for test ${testId} exited with code ${code}`);
          resolve(code);
        } else {
          console.error(`Lighthouse process for test ${testId} exited with code ${code}`);
          reject(new Error(`Lighthouse failed with code ${code}. Stderr: ${stderr}`));
        }
      });
      lighthouseProcess.on('error', (err) => {
        console.error(`Failed to start Lighthouse process for test ${testId}:`, err);
        reject(err);
      });
    });

    await lighthousePromise;

    const jsonReportContent = await fs.readFile(`${reportPath}.report.json`, 'utf-8');

    return NextResponse.json(JSON.parse(jsonReportContent));
  } catch (error) {
    console.error('Error in /api/run-lighthouse:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to run Lighthouse audit', details: errorMessage },
      { status: 500 }
    );
  }
}
