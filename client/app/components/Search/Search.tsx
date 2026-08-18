import SearchIcon from '@mui/icons-material/Search';
import { Grid, InputAdornment, TextField } from '@mui/material';
import { FC } from 'react';

import { SearchProps } from '@/app/types/search';

import styles from '../../styles/Search.module.scss';

const Search: FC<Readonly<SearchProps>> = ({ query, onChange }) => {
  return (
    <Grid className={styles.search_wrapper}>
      <TextField
        fullWidth
        value={query}
        onChange={onChange}
        placeholder="Search Tracks..."
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />
    </Grid>
  );
};

export default Search;
