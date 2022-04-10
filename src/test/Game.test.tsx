import React from 'react';
import { render, screen } from '@testing-library/react';
import { Game } from '../Game';
import userEvent from '@testing-library/user-event';

test('clicking on card flips it', () => {
  render(<Game />);
  const card = screen.getByRole('button',{ name:  /card-11/i});

  expect(card).toHaveTextContent('⬜');

  userEvent.click(card);  

  expect(card).not.toHaveTextContent('⬜');
});
