'use client';

import { Button, Grid, Link, TextField, Typography } from '@mui/material';
import { FC } from 'react';

import useAuthForm from '@/app/hooks/useAuthForm';
import { AuthFormProps } from '@/app/types/authForm';

import styles from '../../styles/AuthForm.module.scss';

const AuthForm: FC<Readonly<AuthFormProps>> = ({
  mode,
  onModeChange,
  onClose,
}) => {
  const { email, name, password, isValid, submitting, handleSubmit } =
    useAuthForm(mode, onClose);

  return (
    <Grid
      container
      component="form"
      onSubmit={handleSubmit}
      className={styles.form}
    >
      <TextField
        type="email"
        label="Email"
        value={email.value}
        onChange={email.onChange}
      />
      {mode === 'registration' && (
        <TextField label="Name" value={name.value} onChange={name.onChange} />
      )}
      <TextField
        type="password"
        label="Password"
        value={password.value}
        onChange={password.onChange}
      />
      <Grid container className={styles.form_actions}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!isValid || submitting}
        >
          {mode === 'login' ? 'Login' : 'Register'}
        </Button>
      </Grid>
      <Typography variant="body2" className={styles.switch_mode}>
        {mode === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <Link
              component="button"
              type="button"
              onClick={() => onModeChange('registration')}
            >
              Register
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link
              component="button"
              type="button"
              onClick={() => onModeChange('login')}
            >
              Login
            </Link>
          </>
        )}
      </Typography>
    </Grid>
  );
};

export default AuthForm;
