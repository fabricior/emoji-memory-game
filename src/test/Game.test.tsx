import React from 'react';
import { render, screen } from '@testing-library/react';
import { Game } from '../Game';
import userEvent from '@testing-library/user-event';

test('clicking on card flips it', async () => {
  render(<Game />);
  const card = screen.getByRole('button',{ name:  /card-11/i});

  expect(card).toHaveTextContent('⬜');

  userEvent.click(card);

  /* Because of the way react-card-flip handles button visibilty
     once clicked we cannot test the elemenet being removed (waitForElementToBeRemoved) 
     or expect(card).not.toVisible() in this case.
     Falling back to using the disable atribute although it is not ideal.
  */   
  expect(card).toHaveAttribute('disabled');
});
