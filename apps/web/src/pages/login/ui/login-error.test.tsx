import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LoginError } from './login-error';

describe('LoginError', () => {
  it('не отображается когда error равен null', () => {
    const { container } = render(<LoginError error={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('не отображается когда error пустая строка', () => {
    const { container } = render(<LoginError error="" />);
    expect(container.firstChild).toBeNull();
  });

  it('отображает сообщение об ошибке', () => {
    render(<LoginError error="Неверные учетные данные" />);
    expect(screen.getByText('Неверные учетные данные')).toBeInTheDocument();
  });

  it('имеет правильные стили для ошибки', () => {
    render(<LoginError error="Ошибка" />);
    const errorElement = screen.getByText('Ошибка');
    expect(errorElement).toHaveClass('text-red-400');
  });
});

