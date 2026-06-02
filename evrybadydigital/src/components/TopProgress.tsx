'use client';

import { useEffect, useState } from 'react';

export default function TopProgress() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: any = null;

    const show = () => {
      setVisible(true);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setVisible(false), 1200);
    };

    const patchHistory = (type: 'pushState' | 'replaceState') => {
      const orig = (history as any)[type];
      (history as any)[type] = function () {
        const ret = orig.apply(this, arguments);
        show();
        return ret;
      };
    };

    patchHistory('pushState');
    patchHistory('replaceState');
    window.addEventListener('popstate', show);

    return () => {
      window.removeEventListener('popstate', show);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div aria-hidden className={`fixed left-0 top-0 z-50 h-1 w-full transition-opacity ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="h-1 w-full overflow-hidden">
        <div className="h-1 bg-linear-to-r from-yellow-300 via-white to-yellow-300 animate-[progress_1.2s_ease-in-out]" style={{ width: visible ? '100%' : '0%' }} />
      </div>
      <style>{`@keyframes progress { 0% { transform: translateX(-100%);} 100% { transform: translateX(0%);} }`}</style>
    </div>
  );
}
