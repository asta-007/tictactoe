"use client";

import { useEffect } from 'react';
import TicTacToe from './app';

export default function Page() {
  useEffect(() => {
    // Call SDK ready at page level too
    if (typeof window !== 'undefined' && window.sdk) {
      window.sdk.actions.ready().catch(() => {});
    }
  }, []);

  return <TicTacToe />;
}
