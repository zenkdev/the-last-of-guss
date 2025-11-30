import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CreateRoundButton } from './create-round-button';

// Мок для useAuth с админом
vi.mock('@/shared/lib', async () => {
  const actual = await vi.importActual('@/shared/lib');
  return {
    ...actual,
    useAuth: () => ({
      user: { id: '1', username: 'admin', role: 'admin' },
      isLoading: false,
      refetch: vi.fn(),
    }),
  };
});

describe('CreateRoundButton', () => {
  it('отображается для администратора', () => {
    const handleCreate = vi.fn();
    render(<CreateRoundButton isPending={false} onCreateRound={handleCreate} />);
    expect(screen.getByRole('button', { name: /Создать раунд/i })).toBeInTheDocument();
  });

  it('вызывает onCreateRound при клике', async () => {
    const user = userEvent.setup();
    const handleCreate = vi.fn();
    render(<CreateRoundButton isPending={false} onCreateRound={handleCreate} />);
    const button = screen.getByRole('button', { name: /Создать раунд/i });
    await user.click(button);
    expect(handleCreate).toHaveBeenCalledTimes(1);
  });

  it('отображает "Создание..." когда isPending=true', () => {
    const handleCreate = vi.fn();
    render(<CreateRoundButton isPending={true} onCreateRound={handleCreate} />);
    expect(screen.getByText('Создание...')).toBeInTheDocument();
  });

  it('кнопка отключена когда isPending=true', () => {
    const handleCreate = vi.fn();
    render(<CreateRoundButton isPending={true} onCreateRound={handleCreate} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});

