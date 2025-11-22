"use client";

import TicTacToe from './app';

export default function Page() {
  // Call SDK ready immediately
  if (typeof window !== 'undefined' && (window as any).sdk) {
    (window as any).sdk.actions.ready().catch(() => {});
  }

  return <TicTacToe />;
}
