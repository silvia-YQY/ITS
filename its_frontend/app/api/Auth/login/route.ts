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
    console.log(externalRes.token);
    const res = NextResponse.json(externalRes);
    res.cookies.set('token', `externalRes.token`);
    return res;
  } catch (error) {
    console.log('error', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
