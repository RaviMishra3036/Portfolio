import { useEffect } from 'react';

const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;

  if (target.isContentEditable) return true;
  const tag = target.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select';
};

export default function ContentProtection() {
  useEffect(() => {
    const preventDefault = (event: Event) => {
      if (!isEditableTarget(event.target)) {
        event.preventDefault();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const ctrlOrMeta = event.ctrlKey || event.metaKey;
      const shouldBlock =
        key === 'f12' ||
        (ctrlOrMeta && ['c', 's', 'u', 'p'].includes(key)) ||
        (ctrlOrMeta && event.shiftKey && ['i', 'j', 'c'].includes(key));

      if (shouldBlock && !isEditableTarget(event.target)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    document.addEventListener('contextmenu', preventDefault);
    document.addEventListener('copy', preventDefault);
    document.addEventListener('cut', preventDefault);
    document.addEventListener('dragstart', preventDefault);
    document.addEventListener('selectstart', preventDefault);
    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      document.removeEventListener('contextmenu', preventDefault);
      document.removeEventListener('copy', preventDefault);
      document.removeEventListener('cut', preventDefault);
      document.removeEventListener('dragstart', preventDefault);
      document.removeEventListener('selectstart', preventDefault);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, []);

  return null;
}
