import "./globals.css";

export const metadata = {
  title: "Tic Tac Toe",
  description: "Play Tic Tac Toe on Farcaster",
  openGraph: {
    images: ["https://tictactoe-three-peach.vercel.app/frame.png"],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://tictactoe-three-peach.vercel.app/frame.png",
    "fc:frame:button:1": "Play Now",
    "fc:frame:post_url": "https://tictactoe-three-peach.vercel.app/api/frame",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

