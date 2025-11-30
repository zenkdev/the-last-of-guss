import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LoginButton } from './login-button';

describe('LoginButton', () => {
  it('отображает текст "Войти" когда не загружается', () => {
    render(<LoginButton isLoading={false} />);
    expect(screen.getByText('Войти')).toBeInTheDocument();
  });

  it('отображает текст "Вход..." когда загружается', () => {
    render(<LoginButton isLoading={true} />);
    expect(screen.getByText('Вход...')).toBeInTheDocument();
  });

  it('кнопка отключена когда загружается', () => {
    render(<LoginButton isLoading={true} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('кнопка включена когда не загружается', () => {
    render(<LoginButton isLoading={false} />);
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('имеет правильный тип submit', () => {
    render(<LoginButton isLoading={false} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });
});

