// app/api/frame/route.ts
import { NextResponse } from 'next/server';

const IMAGE_URL = https://tictactoe-three-peach.vercel.app/frame.png';


export async function GET() {
  const html = `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <!-- Farcaster Frame metadata -->
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${IMAGE_URL}" />
      <meta property="fc:frame:button:1" content="Play Now" />
      <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL || 'https://tictactoe-three-peach.vercel.app'}/api/frame" />
      <!-- Open Graph -->
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Tic Tac Toe" />
      <meta property="og:description" content="Play Tic Tac Toe" />
      <meta property="og:image" content="${IMAGE_URL}" />
      <title>Tic Tac Toe Frame</title>
    </head>
    <body>
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://tictactoe-three-peach.vercel.app'}" style="text-decoration:none;font-family:Inter,system-ui,Arial,sans-serif;">
          <div style="background:#fff;border-radius:12px;padding:24px;box-shadow:0 6px 24px rgba(0,0,0,0.12)">
            <h1 style="margin:0 0 8px 0">Tic Tac Toe</h1>
            <p style="margin:0;color:#666">Open in the app to play</p>
          </div>
        </a>
      </div>
    </body>
  </html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
    },
  });
}

export async function POST(req: Request) {
  // Accepts the POST from Farcaster and returns a small JSON payload
  let payload = null;
  try {
    payload = await req.json();
  } catch (err) {
    // ignore parse errors — payload optional
  }

  const response = {
    ok: true,
    message: 'Frame POST received',
    received: payload,
    // this is the image path your tooling will transform into a real https URL
    imageUrl: IMAGE_URL,
    // Where the Frame should open / play
    play_url: process.env.NEXT_PUBLIC_BASE_URL || 'https://tictactoe-three-peach.vercel.app',
  };

  return NextResponse.json(response);
}

