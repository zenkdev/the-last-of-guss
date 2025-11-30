import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LoginInput } from './login-input';

describe('LoginInput', () => {
  it('отображает label', () => {
    render(
      <LoginInput
        id="username"
        label="Имя пользователя"
        type="text"
        value=""
        onChange={() => {}}
        required={false}
        disabled={false}
      />,
    );
    expect(screen.getByLabelText('Имя пользователя')).toBeInTheDocument();
  });

  it('отображает значение', () => {
    render(
      <LoginInput
        id="username"
        label="Имя пользователя"
        type="text"
        value="testuser"
        onChange={() => {}}
        required={false}
        disabled={false}
      />,
    );
    const input = screen.getByLabelText('Имя пользователя');
    expect(input).toHaveValue('testuser');
  });

  it('вызывает onChange при вводе', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <LoginInput
        id="username"
        label="Имя пользователя"
        type="text"
        value=""
        onChange={handleChange}
        required={false}
        disabled={false}
      />,
    );
    const input = screen.getByLabelText('Имя пользователя');
    await user.type(input, 'test');
    expect(handleChange).toHaveBeenCalled();
  });

  it('имеет правильный тип', () => {
    render(
      <LoginInput
        id="password"
        label="Пароль"
        type="password"
        value=""
        onChange={() => {}}
        required={false}
        disabled={false}
      />,
    );
    const input = screen.getByLabelText('Пароль');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('отключен когда disabled=true', () => {
    render(
      <LoginInput
        id="username"
        label="Имя пользователя"
        type="text"
        value=""
        onChange={() => {}}
        required={false}
        disabled={true}
      />,
    );
    const input = screen.getByLabelText('Имя пользователя');
    expect(input).toBeDisabled();
  });

  it('имеет required атрибут когда required=true', () => {
    render(
      <LoginInput
        id="username"
        label="Имя пользователя"
        type="text"
        value=""
        onChange={() => {}}
        required={true}
        disabled={false}
      />,
    );
    const input = screen.getByLabelText('Имя пользователя');
    expect(input).toBeRequired();
  });
});

