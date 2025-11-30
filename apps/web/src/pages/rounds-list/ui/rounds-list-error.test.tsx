import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RoundsListError } from './rounds-list-error';

// Мок для window.location.reload
const reloadMock = vi.fn();
Object.defineProperty(window, 'location', {
  value: {
    reload: reloadMock,
  },
  writable: true,
});

describe('RoundsListError', () => {
  it('отображает сообщение об ошибке', () => {
    render(<RoundsListError />);
    expect(screen.getByText('Ошибка при загрузке раундов')).toBeInTheDocument();
  });

  it('отображает кнопку обновления', () => {
    render(<RoundsListError />);
    expect(screen.getByRole('button', { name: /Обновить/i })).toBeInTheDocument();
  });

  it('вызывает reload при клике на кнопку обновления', async () => {
    const user = userEvent.setup();
    render(<RoundsListError />);
    const button = screen.getByRole('button', { name: /Обновить/i });
    await user.click(button);
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });
});

