'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    window.location.replace('./site/');
  }, []);

  return <div>Loading InstaFitCore…</div>;
}
