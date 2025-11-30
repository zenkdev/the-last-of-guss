import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RoundDetailsHeader } from './round-details-header';

describe('RoundDetailsHeader', () => {
  it('отображает "Раунды" для активного статуса', () => {
    render(<RoundDetailsHeader status="active" />);
    expect(screen.getByText('Раунды')).toBeInTheDocument();
  });

  it('отображает "Раунд завершен" для завершенного статуса', () => {
    render(<RoundDetailsHeader status="completed" />);
    expect(screen.getByText('Раунд завершен')).toBeInTheDocument();
  });

  it('отображает "Cooldown" для статуса cooldown', () => {
    render(<RoundDetailsHeader status="cooldown" />);
    expect(screen.getByText('Cooldown')).toBeInTheDocument();
  });

  it('отображает "Раунды" для null статуса', () => {
    render(<RoundDetailsHeader status={null} />);
    expect(screen.getByText('Раунды')).toBeInTheDocument();
  });

  it('отображает имя пользователя', () => {
    render(<RoundDetailsHeader status="active" />);
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('имеет ссылку на главную страницу', () => {
    render(<RoundDetailsHeader status="active" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });
});

