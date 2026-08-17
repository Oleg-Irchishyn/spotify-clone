import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

import type { AppDispatch } from '@/app/store';
import actionCreators from '@/app/store/action-creators';

export const useActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useMemo(
    () => bindActionCreators(actionCreators, dispatch),
    [dispatch],
  );
};
