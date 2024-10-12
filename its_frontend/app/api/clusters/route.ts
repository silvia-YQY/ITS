// app/api/clusters/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const clusters = [
    { id: 1, name: 'Cluster 1', status: 'Running' },
    { id: 2, name: 'Cluster 2', status: 'Stopped' },
    { id: 3, name: 'Cluster 3', status: 'Pending' },
  ];

  return NextResponse.json(clusters);
}
