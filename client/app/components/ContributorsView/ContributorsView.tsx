'use client';

import { Box, Card, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';

import useContributors from '@/app/hooks/useContributors';
import BackButton from '@/app/components/BackButton/BackButton';
import ContributorList from '@/app/components/ContributorList/ContributorList';
import EmptyState from '@/app/components/EmptyState/EmptyState';
import Loader from '@/app/components/Loader/Loader';

import styles from '../../styles/ContributorsView.module.scss';

const ContributorsView = () => {
  const { contributors, loading, error } = useContributors();

  const showEmptyState = !loading && (contributors.length === 0 || !!error);

  return (
    <div>
      <BackButton />
      <Grid container spacing={2} className={styles.view_container}>
        <Card className={styles.view_card}>
          <Box className={styles.header_box}>
            <Grid container className={styles.header_row}>
              <Typography className={styles.title} variant="h3">
                Contributors
              </Typography>
            </Grid>
          </Box>
          {loading ? (
            <Loader />
          ) : showEmptyState ? (
            <EmptyState message="No contributors found." />
          ) : (
            <ContributorList contributors={contributors} />
          )}
        </Card>
      </Grid>
    </div>
  );
};

export default ContributorsView;
