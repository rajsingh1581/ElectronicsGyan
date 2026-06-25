import { NextRequest, NextResponse } from 'next/server';
import { getTopics, createTopic } from '@/lib/tutorialDb';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stack = searchParams.get('stack') || undefined;
    
    const topics = getTopics(stack);
    return NextResponse.json({ success: true, topics });
  } catch (error: any) {
    console.error('Error fetching tutorials:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Basic RBAC verification via request headers
    const userRole = req.headers.get('x-user-role');
    if (userRole !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Admin / Contributor privileges required.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, stack, content, youtubeUrl } = body;

    if (!name || !stack || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, stack, and content.' },
        { status: 400 }
      );
    }

    if (!['rtos', 'stm32', 'arduino', 'raspberry-pi'].includes(stack)) {
      return NextResponse.json(
        { success: false, error: 'Invalid tech stack specified.' },
        { status: 400 }
      );
    }

    const newTopic = createTopic({
      name,
      stack,
      content,
      youtubeUrl: youtubeUrl || undefined,
      isBuiltIn: false,
      order: 99 // Created custom topics are ordered after standard ones
    });

    return NextResponse.json({ success: true, topic: newTopic });
  } catch (error: any) {
    console.error('Error creating tutorial topic:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
