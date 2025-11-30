import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RoundsListEmpty } from './rounds-list-empty';

describe('RoundsListEmpty', () => {
  it('отображает сообщение о пустом списке', () => {
    render(<RoundsListEmpty />);
    expect(screen.getByText('Раунды не найдены')).toBeInTheDocument();
  });

  it('имеет правильные стили', () => {
    render(<RoundsListEmpty />);
    const element = screen.getByText('Раунды не найдены');
    expect(element).toHaveClass('text-center', 'text-console-green');
  });
});

