import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RoundsListItem } from './rounds-list-item';

const mockRound = {
  id: '123',
  startAt: '2024-01-01T00:00:00Z',
  endAt: '2024-01-01T23:59:59Z',
  status: 'active' as const,
};

describe('RoundsListItem', () => {
  it('отображает ID раунда', () => {
    render(<RoundsListItem data={mockRound} />);
    expect(screen.getByText(/Round ID: 123/i)).toBeInTheDocument();
  });

  it('отображает статус раунда', () => {
    render(<RoundsListItem data={mockRound} />);
    expect(screen.getByText(/Статус: Активен/i)).toBeInTheDocument();
  });

  it('отображает даты начала и окончания', () => {
    render(<RoundsListItem data={mockRound} />);
    expect(screen.getByText(/Start:/i)).toBeInTheDocument();
    expect(screen.getByText(/End:/i)).toBeInTheDocument();
  });

  it('имеет правильную ссылку', () => {
    render(<RoundsListItem data={mockRound} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/rounds/123');
  });

  it('отображает правильный статус для completed', () => {
    const completedRound = { ...mockRound, status: 'completed' as const };
    render(<RoundsListItem data={completedRound} />);
    expect(screen.getByText(/Статус: Завершен/i)).toBeInTheDocument();
  });

  it('отображает правильный статус для cooldown', () => {
    const cooldownRound = { ...mockRound, status: 'cooldown' as const };
    render(<RoundsListItem data={cooldownRound} />);
    expect(screen.getByText(/Статус: Cooldown/i)).toBeInTheDocument();
  });
});

