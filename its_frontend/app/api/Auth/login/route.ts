import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  try {
    // Forward the login request to the external API
    const externalApiResponse = await fetch(`${process.env.API_URL}/api/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!externalApiResponse.ok) {
      const errorBody = await externalApiResponse.json();
      console.log('error', errorBody);
      return NextResponse.json({ error: errorBody.message }, { status: externalApiResponse.status });
    }

    const externalRes = await externalApiResponse.json();
    const res = NextResponse.json(externalRes);
    res.cookies.set('token', externalRes.Token, {
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
      path: '/', // Accessible anywhere in the app
    });
    return res;
  } catch (error) {
    console.error('error', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
