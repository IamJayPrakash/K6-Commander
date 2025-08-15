import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { testId: string } }
) {
  const { testId } = params;
  if (!testId) {
    return NextResponse.json({ error: 'Test ID is required' }, { status: 400 });
  }

  const resultsDir = path.resolve('./results');
  const summaryFilePath = path.join(resultsDir, `summary-${testId}.json`);

  try {
    // Ensure results directory exists
    await fs.mkdir(resultsDir, { recursive: true });

    // Check if summary file exists
    await fs.access(summaryFilePath);

    // Read the file content
    const summaryContent = await fs.readFile(summaryFilePath, 'utf-8');
    const summaryJson = JSON.parse(summaryContent);
    
    // Delete the file after reading
    await fs.unlink(summaryFilePath);

    return NextResponse.json(summaryJson);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File not found, which is an expected state during polling
      return NextResponse.json({ message: 'Test summary not yet available.' }, { status: 404 });
    }
    
    // Other errors
    console.error(`Error checking summary for test ${testId}:`, error);
    return NextResponse.json({ error: 'Failed to check test summary', details: error.message }, { status: 500 });
  }
}
