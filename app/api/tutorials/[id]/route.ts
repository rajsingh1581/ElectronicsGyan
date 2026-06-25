import { NextRequest, NextResponse } from 'next/server';
import { updateTopic, deleteTopic } from '@/lib/tutorialDb';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Basic RBAC verification via request headers
    const userRole = req.headers.get('x-user-role');
    if (userRole !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Admin / Contributor privileges required.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, content, youtubeUrl, stack } = body;

    const updated = updateTopic(id, {
      ...(name && { name }),
      ...(content && { content }),
      ...(youtubeUrl !== undefined && { youtubeUrl }),
      ...(stack && { stack })
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Topic not found or could not be updated.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, topic: updated });
  } catch (error: any) {
    console.error('Error updating tutorial topic:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Basic RBAC verification via request headers
    const userRole = req.headers.get('x-user-role');
    if (userRole !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Admin / Contributor privileges required.' },
        { status: 403 }
      );
    }

    const deleted = deleteTopic(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Topic not found or could not be deleted.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Topic deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting tutorial topic:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
