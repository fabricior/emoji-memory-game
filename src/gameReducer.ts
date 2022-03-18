import {
  countDisplayedCards,
  getTwoMostRecentlyDisplayedCardsInRound,
} from "./gameFunctions";
import { shuffle } from "./utils";

export type Card = {
  id: number;
  emoji: string;
  displayedBy: PlayerNumber | null;
  displayedOnRound: number | null;
};

export type PlayerNumber = 1 | 2;

type BoardState = {
  currentPlayer: PlayerNumber;
  round: number;
  cards: Card[];
};

export type Row = {
  id: number;
  cards: Card[];
};

export enum GuessStatus {
  Unknown = "Unknown",
  Correct = "Correct",
  Incorrect = "Incorrect",
}

const emojis = ["❤", "🌹", "😍", "🏠", "👍", "🎂", "🐱‍🐉", "😂"];
emojis.push(...emojis);

const createCardsToStartGame = (): Array<Card> => {
  const emojisCopy = [...emojis];
  shuffle(emojisCopy);
  return emojisCopy.map((emoji, index) => ({
    id: index,
    emoji,
    displayedBy: null,
    displayedOnRound: null,
  }));
};

export const initialState: BoardState = {
  currentPlayer: 1,
  round: 1,
  cards: createCardsToStartGame(),
};

export type Action =
  | { type: "reset" }
  | { type: "display_one"; selectedCard: Card }
  | { type: "revert_incorrect_guess" };

export function memoryGameReducer(
  state: BoardState,
  action: Action
): BoardState {
  switch (action.type) {
    case "reset":
      return {
        ...initialState,
        cards: createCardsToStartGame(),
      };
    case "display_one":
      const displayedCardsCountSoFar = countDisplayedCards(state.cards);
      const displayedCardsCountAfterThisAction = displayedCardsCountSoFar + 1;
      const mustSwitchPlayers = displayedCardsCountAfterThisAction % 2 === 0;

      let newCurrentPlayer: PlayerNumber;
      let newRound: number;
      if (mustSwitchPlayers) {
        newCurrentPlayer = state.currentPlayer === 1 ? 2 : 1;
        newRound = state.round + 1;
      } else {
        newCurrentPlayer = state.currentPlayer;
        newRound = state.round;
      }

      return {
        ...state,
        cards: state.cards.map((card) =>
          card.id === action.selectedCard.id
            ? {
                ...card,
                displayedBy: state.currentPlayer,
                displayedOnRound: state.round,
              }
            : card
        ),
        currentPlayer: newCurrentPlayer,
        round: newRound,
      };
    case "revert_incorrect_guess":
      const lastTwoCards = getTwoMostRecentlyDisplayedCardsInRound(
        state.cards,
        state.round - 1
      );
      return {
        ...state,
        cards: state.cards.map((c) =>
          lastTwoCards.find((q) => q.id === c.id)
            ? { ...c, displayedBy: null, displayedOnRound: null }
            : { ...c }
        ),
      };
    default:
      throw new Error("Unhandled action type");
  }
}
