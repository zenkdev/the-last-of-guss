import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RoundDetailsActive } from './round-details-active';

describe('RoundDetailsActive', () => {
  it('отображает сообщение о том, что раунд активен', () => {
    render(<RoundDetailsActive timeString="01:30:00" myScore={10} />);
    expect(screen.getByText('Раунд активен!')).toBeInTheDocument();
  });

  it('отображает оставшееся время', () => {
    render(<RoundDetailsActive timeString="01:30:00" myScore={10} />);
    expect(screen.getByText(/До конца осталось: 01:30:00/i)).toBeInTheDocument();
  });

  it('отображает очки пользователя', () => {
    render(<RoundDetailsActive timeString="01:30:00" myScore={10} />);
    expect(screen.getByText(/Мои очки - 10/i)).toBeInTheDocument();
  });
});

