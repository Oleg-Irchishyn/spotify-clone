import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

const useMounted = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

export default useMounted;
