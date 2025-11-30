import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LoginPage } from './login-page';

// Мок для useLogin
vi.mock('../model/use-login', () => ({
  useLogin: () => ({
    username: '',
    setUsername: vi.fn(),
    password: '',
    setPassword: vi.fn(),
    error: null,
    isLoading: false,
    handleSubmit: vi.fn((e) => e.preventDefault()),
  }),
}));

describe('LoginPage', () => {
  it('отображает заголовок формы', () => {
    render(<LoginPage />);
    const heading = screen.getByRole('heading', { name: /Войти/i });
    expect(heading).toBeInTheDocument();
  });

  it('отображает поля ввода', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/Имя пользователя/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Пароль/i)).toBeInTheDocument();
  });

  it('отображает кнопку входа', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: /Войти/i })).toBeInTheDocument();
  });
});

