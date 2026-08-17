import useSearch from '@/app/hooks/useSearch';
import { Grid, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { FC } from 'react';

const Search: FC = () => {
  const { query, handleSearch } = useSearch();
  return (
    <Grid sx={{ mx: '36px' }}>
      <TextField
        fullWidth
        value={query}
        onChange={handleSearch}
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
