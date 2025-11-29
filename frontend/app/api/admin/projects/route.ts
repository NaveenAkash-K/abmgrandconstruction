import { NextRequest, NextResponse } from 'next/server';
import { Project } from '@/types/admin';

// Mock database
const projects: Project[] = [
  {
    id: '1',
    title: 'Luxury Residential Complex',
    location: 'Downtown District',
    description: 'A premium residential development',
    image: '/images/project1.jpg',
    status: 'Completed',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  }
];

export async function GET() {
  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const newProject: Project = {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  projects.push(newProject);
  return NextResponse.json({ project: newProject });
}