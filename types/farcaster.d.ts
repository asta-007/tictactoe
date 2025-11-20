// types/farcaster.d.ts
export {}; // make this file a module

declare global {
  interface Window {
    sdk?: {
      actions: {
        ready: () => Promise<void>;
      };
      // Extend with other SDK members you use, e.g.:
      // connect?: () => Promise<void>;
      // on?: (event: string, cb: (...args: any[]) => void) => void;
    };
  }
}

