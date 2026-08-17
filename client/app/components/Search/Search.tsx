import SearchIcon from '@mui/icons-material/Search';
import { Grid, InputAdornment, TextField } from '@mui/material';
import { ChangeEvent, FC } from 'react';

interface SearchProps {
  query: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Search: FC<Readonly<SearchProps>> = ({ query, onChange }) => {
  return (
    <Grid sx={{ mx: '36px' }}>
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
