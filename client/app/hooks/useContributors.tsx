import { useEffect, useState } from 'react';

import $api from '../lib/http';
import { IContributor } from '../types/contributor';

const useContributors = () => {
  const [contributors, setContributors] = useState<IContributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    $api
      .get<IContributor[]>('/users')
      .then((response) => {
        setContributors(response.data.filter((user) => user.isActivated));
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Server error';
        setError(message);
      })
      .finally(() => setLoading(false));
  }, []);

  return { contributors, loading, error };
};

export default useContributors;
