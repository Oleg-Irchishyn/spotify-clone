import { useLayoutEffect, useRef, useState } from 'react';

const useTextOverflow = <T extends HTMLElement>(dependency: string) => {
  const ref = useRef<T>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const checkOverflow = () => {
      setIsOverflowing(element.scrollWidth > element.clientWidth);
    };

    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(element);

    return () => observer.disconnect();
  }, [dependency]);

  return { ref, isOverflowing };
};

export default useTextOverflow;
