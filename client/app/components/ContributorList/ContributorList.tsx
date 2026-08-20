import { Box, Grid } from '@mui/material';
import { FC } from 'react';

import { ContributorListProps } from '@/app/types/contributorList';

import ContributorItem from '../ContributorItem/ContributorItem';
import styles from '../../styles/ContributorList.module.scss';

const ContributorList: FC<Readonly<ContributorListProps>> = ({
  contributors,
}) => {
  return (
    <Grid container className={styles.list_container}>
      <Box className={styles.list_box}>
        {contributors.map((contributor) => (
          <ContributorItem key={contributor._id} contributor={contributor} />
        ))}
      </Box>
    </Grid>
  );
};

export default ContributorList;
