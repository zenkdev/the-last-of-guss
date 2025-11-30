import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RoundDetailsBoard } from './round-details-board';

describe('RoundDetailsBoard', () => {
  it('отображает игровое поле', () => {
    const handleClick = vi.fn();
    const { container } = render(<RoundDetailsBoard onClick={handleClick} />);
    const board = container.querySelector('.grid');
    expect(board).toBeInTheDocument();
  });

  it('вызывает onClick при клике на кликабельный элемент', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const { container } = render(<RoundDetailsBoard onClick={handleClick} />);
    
    // Находим элемент с data-clickable
    const clickableElement = container.querySelector('[data-clickable]');
    expect(clickableElement).toBeInTheDocument();
    
    if (clickableElement) {
      await user.click(clickableElement);
      expect(handleClick).toHaveBeenCalledTimes(1);
    }
  });

  it('не вызывает onClick при клике на пустое место', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const { container } = render(<RoundDetailsBoard onClick={handleClick} />);
    
    // Находим элемент без data-clickable (пустое место)
    const emptyElement = container.querySelector('.col-span-2:not([data-clickable])');
    
    if (emptyElement) {
      await user.click(emptyElement);
      expect(handleClick).not.toHaveBeenCalled();
    }
  });

  it('содержит элементы с data-clickable атрибутом', () => {
    const handleClick = vi.fn();
    const { container } = render(<RoundDetailsBoard onClick={handleClick} />);
    const clickableElements = container.querySelectorAll('[data-clickable]');
    expect(clickableElements.length).toBeGreaterThan(0);
  });
});

