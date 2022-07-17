import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import type { AppProps } from 'next/app';
import { QueryClientProvider } from 'react-query';
import { AuthProvider } from '../contexts/auth-context';
import { queryClient } from '../services/react-query';
import { theme } from '../theme';
import ConfirmDialog from '../components/confirm-dialog';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ConfirmDialog />
          <Component {...pageProps} />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default MyApp;
