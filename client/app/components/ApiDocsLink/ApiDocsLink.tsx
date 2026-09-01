'use client';

import { Api } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import styles from '../../styles/ApiDocsLink.module.scss';

const API_DOCS_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/docs`;

const ApiDocsLink = () => {
  return (
    <Tooltip title="API Docs">
      <IconButton
        component="a"
        href={API_DOCS_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="API docs"
        color="inherit"
        className={styles.docs_button}
      >
        <Api />
      </IconButton>
    </Tooltip>
  );
};

export default ApiDocsLink;
