
import { NextResponse, type NextRequest } from 'next/server';
import type { SeoAnalysis } from '@/types';

// This is a simplified SEO check. A real-world tool would be much more comprehensive.
async function fetchAndAnalyze(url: string): Promise<SeoAnalysis> {
  try {
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'K6-Commander-SEO-Checker/1.0'
        }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    
    // Basic JSDOM/Cheerio-like parsing with regex for simplicity in this environment
    const getTitle = (h: string) => h.match(/<title>([^<]*)<\/title>/i)?.[1] || null;
    const getDescription = (h: string) => h.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] || null;
    const getH1 = (h: string) => h.match(/<h1[^>]*>([^<]*)<\/h1>/i)?.[1] || null;
    const getCanonical = (h: string) => h.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i)?.[1] || null;

    const title = getTitle(html);
    const description = getDescription(html);
    const h1 = getH1(html);
    const canonical = getCanonical(html);

    return {
      title: {
        text: title,
        length: title?.length || 0,
        status: title && title.length >= 10 && title.length <= 60 ? 'pass' : 'fail',
      },
      description: {
        text: description,
        length: description?.length || 0,
        status: description && description.length >= 50 && description.length <= 160 ? 'pass' : 'fail',
      },
      h1: {
        text: h1,
        status: h1 ? 'pass' : 'fail',
      },
      canonical: {
        url: canonical,
        status: canonical === url ? 'pass' : (canonical ? 'warning' : 'fail'),
      },
      imageAlts: {
        // A real implementation would parse all <img> tags
        status: 'not_checked',
      },
    };
  } catch (error) {
    console.error('Error during SEO analysis:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const analysis = await fetchAndAnalyze(url);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in /api/run-seo:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to run SEO analysis', details: errorMessage }, { status: 500 });
  }
}
