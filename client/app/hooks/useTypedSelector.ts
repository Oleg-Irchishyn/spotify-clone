import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';

export const useTypedSelector = useSelector.withTypes<RootState>();
