import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await request.json();
  // Update project logic here
  return NextResponse.json({ success: true, project: { id: params.id, ...data } });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Delete project logic here
  return NextResponse.json({ success: true, id: params.id });
}