import Typography from '@mui/material/Typography';

export default function Home() {
  return (
    <main>
      <div className="center">
        <Typography sx={{ fontWeight: 'bold' }} variant="h1" component="h1">
          Welcome!
        </Typography>
        <Typography sx={{ fontWeight: 'bold' }} variant="h3" component="h3">
          Best tracks are gathered here!
        </Typography>
      </div>
    </main>
  );
}
