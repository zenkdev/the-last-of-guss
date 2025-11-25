import { AuthProvider } from '@/shared/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Routes from './routes';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </QueryClientProvider>
  );
}
