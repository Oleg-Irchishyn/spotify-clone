'use client';

import { Container } from '@mui/material';
import { FC, ReactNode } from 'react';

import { useTypedSelector } from '@/app/hooks/useTypedSelector';

import styles from '../../styles/Layout.module.scss';

interface ContentAreaProps {
  children: ReactNode;
}

const ContentArea: FC<ContentAreaProps> = ({ children }) => {
  const active = useTypedSelector((state) => state.player.active);

  return (
    <Container
      className={`${styles.content_container} ${active ? styles.content_container_with_player : ''}`}
    >
      {children}
    </Container>
  );
};

export default ContentArea;
