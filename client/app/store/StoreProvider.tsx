'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import { Provider } from 'react-redux';

import { fetchCurrentUser } from './action-creators/auth';
import { AppStore, makeStore } from './index';

const StoreProvider: FC<Readonly<{ children: ReactNode }>> = ({ children }) => {
  const [store] = useState<AppStore>(() => makeStore());

  useEffect(() => {
    void store.dispatch(fetchCurrentUser());
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
