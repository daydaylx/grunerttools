import { useEffect, useRef } from 'react';

export const useAutoResize = (value: string, maxHeight: number = 120) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = scrollHeight + 'px';
    }
  }, [value, maxHeight]);

  return textareaRef;
};
