import { useState } from 'react';
import { useDebounce } from 'use-debounce';

export const useCustomDebounce = (initialValue: string = '', delay = 600) => {
  const [value, setValue] = useState<string>(initialValue);
  const [keyword] = useDebounce(value.trim() !== '' ? value : null, delay);

  return { keyword, value, setValue };
};
