import { useState, useRef } from 'react';

type SetStateRefAction<T> = T | ((prevState: T) => T);

const useStateRef = <T>(initialValue: T): [T, (value: SetStateRefAction<T>) => void, () => T] => {
  const [state, setState] = useState<T>(initialValue);
  const ref = useRef<T>(initialValue);
  
  const setStateRef = (value: SetStateRefAction<T>) => {
    const newValue = typeof value === 'function' ? (value as (prevState: T) => T)(ref.current) : value;
    ref.current = newValue;
    setState(newValue);
  };
  
  const getCurrent = () => ref.current;
  
  return [state, setStateRef, getCurrent];
};

export { useStateRef };