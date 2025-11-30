import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RoundDetailsCooldown } from './round-details-cooldown';

describe('RoundDetailsCooldown', () => {
  it('отображает заголовок Cooldown', () => {
    render(<RoundDetailsCooldown timeString="00:30:00" />);
    expect(screen.getByText('Cooldown')).toBeInTheDocument();
  });

  it('отображает время до начала раунда', () => {
    render(<RoundDetailsCooldown timeString="00:30:00" />);
    expect(screen.getByText(/до начала раунда 00:30:00/i)).toBeInTheDocument();
  });
});

