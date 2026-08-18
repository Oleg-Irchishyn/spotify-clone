import { Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import GlobalAlert from './components/GlobalAlert/GlobalAlert';
import Navbar from './components/Navbar/Navbar';
import Player from './components/Player/Player';
import styles from './styles/Layout.module.scss';
import StoreProvider from './store/StoreProvider';
import theme from './theme';
import './globals.css';

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<LayoutProps<'/'>>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning>
        <StoreProvider>
          <AppRouterCacheProvider options={{ key: 'mui' }}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Navbar />
              <Container className={styles.content_container}>
                {children}
              </Container>
              <Player />
              <GlobalAlert />
            </ThemeProvider>
          </AppRouterCacheProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
