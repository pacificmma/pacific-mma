// src/hooks/useBrowser.ts
import { useEffect, useState } from 'react';

export const useBrowser = () => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(typeof window !== 'undefined');
  }, []);

  return {
    isBrowser,
    window: isBrowser ? window : undefined,
    document: isBrowser ? document : undefined,
  };
};

// Usage example:
// const { isBrowser, window, document } = useBrowser();
// if (isBrowser && window) {
//   window.scrollTo(0, 0);
// }