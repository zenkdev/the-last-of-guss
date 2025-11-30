import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RoundsListHeader } from './rounds-list-header';

describe('RoundsListHeader', () => {
  it('отображает заголовок', () => {
    render(<RoundsListHeader />);
    expect(screen.getByText('Список РАУНДОВ')).toBeInTheDocument();
  });

  it('отображает имя пользователя', () => {
    render(<RoundsListHeader />);
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });
});

