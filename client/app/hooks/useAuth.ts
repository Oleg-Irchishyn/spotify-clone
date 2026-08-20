import { useTypedSelector } from './useTypedSelector';

const useAuth = () => {
  const { user, loading } = useTypedSelector((state) => state.auth);

  return { user, loading, isActivated: !!user?.isActivated };
};

export default useAuth;
