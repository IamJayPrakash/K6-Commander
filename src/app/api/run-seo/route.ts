import { NextResponse, type NextRequest } from 'next/server';
import { analyzeSeo } from '@/ai/flows/seo-analyzer-flow';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const analysis = await analyzeSeo({ url });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in /api/run-seo:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to run AI SEO analysis', details: errorMessage },
      { status: 500 }
    );
  }
}
