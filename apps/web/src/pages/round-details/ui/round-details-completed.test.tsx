import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RoundDetailsCompleted } from './round-details-completed';

describe('RoundDetailsCompleted', () => {
  it('отображает общий счет', () => {
    render(<RoundDetailsCompleted totalScore={100} myScore={50} />);
    expect(screen.getByText('Всего')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('отображает очки пользователя', () => {
    render(<RoundDetailsCompleted totalScore={100} myScore={50} />);
    expect(screen.getByText('Мои очки')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('отображает победителя когда он есть', () => {
    render(<RoundDetailsCompleted totalScore={100} myScore={50} winner="user1" winnerScore={75} />);
    expect(screen.getByText(/Победитель - user1/i)).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('не отображает победителя когда его нет', () => {
    render(<RoundDetailsCompleted totalScore={100} myScore={50} />);
    expect(screen.queryByText(/Победитель/i)).not.toBeInTheDocument();
  });
});

