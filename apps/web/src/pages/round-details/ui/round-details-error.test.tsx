import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RoundDetailsError } from './round-details-error';

describe('RoundDetailsError', () => {
  it('отображает сообщение об ошибке', () => {
    render(<RoundDetailsError message="Раунд не найден" />);
    expect(screen.getByText('Раунд не найден')).toBeInTheDocument();
  });

  it('отображает ссылку для возврата к списку', () => {
    render(<RoundDetailsError message="Ошибка" />);
    const link = screen.getByRole('link', { name: /Вернуться к списку/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});

