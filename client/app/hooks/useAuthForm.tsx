import { SyntheticEvent, useState } from 'react';

import { useActions } from './useActions';
import useInput from './useInput';
import { AuthMode } from '../types/auth';

const useAuthForm = (mode: AuthMode, onSuccess: () => void) => {
  const { login, register } = useActions();

  const email = useInput('');
  const name = useInput('');
  const password = useInput('');
  const [submitting, setSubmitting] = useState(false);

  const isValid =
    email.value.trim() !== '' &&
    password.value.trim() !== '' &&
    (mode === 'login' || name.value.trim() !== '');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email.value, password.value);
      } else {
        await register(email.value, name.value, password.value);
      }
      onSuccess();
    } catch {
      // The thunk already dispatched an alert; keep the form open to retry.
    } finally {
      setSubmitting(false);
    }
  };

  return { email, name, password, isValid, submitting, handleSubmit };
};

export default useAuthForm;
