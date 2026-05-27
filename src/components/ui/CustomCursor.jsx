import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device — check both pointer type and touch support
    const isTouchDevice =
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
      setIsTouch(true);
      return; // Don't attach any listeners or run animation
    }

    // Restore default cursor for non-touch
    document.documentElement.style.cursor = 'none';

    const move = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px';
        dotRef.current.style.top = e.clientY + 'px';
      }
    };

    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + 'px';
        ringRef.current.style.top = ring.current.y + 'px';
      }
      raf.current = requestAnimationFrame(animate);
    };

    const onDown = () => {
      if (ringRef.current) ringRef.current.style.transform = 'translate(-50%,-50%) scale(0.7)';
    };
    const onUp = () => {
      if (ringRef.current) ringRef.current.style.transform = 'translate(-50%,-50%) scale(1)';
    };
    const onEnterLink = () => {
      if (ringRef.current) {
        ringRef.current.style.width = '56px';
        ringRef.current.style.height = '56px';
        ringRef.current.style.borderColor = 'rgba(201,168,76,1)';
      }
    };
    const onLeaveLink = () => {
      if (ringRef.current) {
        ringRef.current.style.width = '36px';
        ringRef.current.style.height = '36px';
        ringRef.current.style.borderColor = 'rgba(201,168,76,0.7)';
      }
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);

    const interactables = document.querySelectorAll('a,button,[role="button"]');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', onEnterLink);
      el.addEventListener('mouseleave', onLeaveLink);
    });

    raf.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', onEnterLink);
        el.removeEventListener('mouseleave', onLeaveLink);
      });
      cancelAnimationFrame(raf.current);
      document.documentElement.style.cursor = '';
    };
  }, []);

  // On touch devices, render nothing — default browser cursor/touch behavior applies
  if (isTouch) return null;

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 99999,
          width: 6,
          height: 6,
          background: '#C9A84C',
          borderRadius: '50%',
          transform: 'translate(-50%,-50%)',
          transition: 'width 0.2s, height 0.2s',
          left: '-100px',
          top: '-100px',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 99998,
          width: 36,
          height: 36,
          border: '1px solid rgba(201,168,76,0.7)',
          borderRadius: '50%',
          transform: 'translate(-50%,-50%)',
          transition: 'width 0.3s, height 0.3s, border-color 0.3s, transform 0.1s',
          left: '-100px',
          top: '-100px',
        }}
      />
    </>
  );
}