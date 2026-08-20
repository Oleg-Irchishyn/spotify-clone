import { Person } from '@mui/icons-material';
import { Avatar, Card } from '@mui/material';
import { FC } from 'react';

import { ContributorItemProps } from '@/app/types/contributorItem';

import styles from '../../styles/ContributorItem.module.scss';

const ContributorItem: FC<Readonly<ContributorItemProps>> = ({
  contributor,
}) => {
  return (
    <Card className={styles.contributor}>
      <Avatar className={styles.contributor_avatar}>
        <Person />
      </Avatar>
      <div className={styles.contributor_name}>{contributor.name}</div>
    </Card>
  );
};

export default ContributorItem;
