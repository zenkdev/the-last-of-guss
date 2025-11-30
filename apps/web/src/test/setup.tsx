import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Очистка после каждого теста
afterEach(() => {
  cleanup();
});

// Моки для react-router
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    Link: ({ to, children, ...props }: { to: string; children: React.ReactNode }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
    useNavigate: () => vi.fn(),
    useParams: () => ({}),
  };
});

// Мок для useAuth
vi.mock('@/shared/lib', async () => {
  const actual = await vi.importActual('@/shared/lib');
  return {
    ...actual,
    useAuth: () => ({
      user: { id: '1', username: 'testuser', role: 'user' },
      isLoading: false,
      refetch: vi.fn(),
    }),
  };
});
