import { Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';

import GlobalAlert from './components/GlobalAlert/GlobalAlert';
import Navbar from './components/Navbar/Navbar';
import Player from './components/Player/Player';
import styles from './styles/Layout.module.scss';
import StoreProvider from './store/StoreProvider';
import theme from './theme';
import './globals.css';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
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
    <html lang="en" className={montserrat.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <InitColorSchemeScript attribute="data" defaultMode="dark" />
        <StoreProvider>
          <AppRouterCacheProvider options={{ key: 'mui' }}>
            <ThemeProvider theme={theme} defaultMode="dark">
              <CssBaseline enableColorScheme />
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
