'use client';

import { FC, ReactNode, useState } from 'react';
import { Provider } from 'react-redux';
import { AppStore, makeStore } from './index';

const StoreProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [store] = useState<AppStore>(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
