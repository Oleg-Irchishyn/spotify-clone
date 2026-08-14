import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Navbar from './components/Navbar/Navbar';
import Player from './components/Player/Player';
import GlobalAlert from './components/GlobalAlert/GlobalAlert';
import StoreProvider from './store/StoreProvider';
import './globals.css';
import { Container } from '@mui/material';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Spotify Clone Application',
  description: 'A Spotify clone built with Next.js and Material UI',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning>
        <StoreProvider>
          <AppRouterCacheProvider options={{ key: 'mui' }}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Navbar />
              <Container style={{ margin: '90px auto' }}>{children}</Container>
              <Player />
              <GlobalAlert />
            </ThemeProvider>
          </AppRouterCacheProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
