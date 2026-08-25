import { useEffect, useState } from 'react';

import { extractErrorMessage } from '../utils/extractErrorMessage';
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
        setContributors(response.data);
      })
      .catch((err: unknown) => {
        setError(extractErrorMessage(err));
      })
      .finally(() => setLoading(false));
  }, []);

  return { contributors, loading, error };
};

export default useContributors;
