import { useEffect, useReducer } from "react";
import { RowView } from "./RowView";
import { shuffle } from "./utils";

export type Card = {
  id: number;
  emoji: string;
  displayedBy: PlayerNumber | null;
  displayedOnRound: number | null;
};

type PlayerNumber = 1 | 2;

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

const initialState: BoardState = {
  currentPlayer: 1,
  round: 1,
  cards: createCardsToStartGame(),
};

export type Action =
  | { type: "reset" }
  | { type: "display_one"; selectedCard: Card }
  | { type: "revert_incorrect_guess" };

function memoryGameReducer(state: BoardState, action: Action): BoardState {
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

function getRows(squares: Card[]): Row[] {
  let rows: Row[] = [];
  for (let i = 0; i < squares.length; i = i + 4) {
    const cellsInRow = squares.slice(i, i + 4);
    rows.push({ id: i, cards: cellsInRow });
  }
  return rows;
}

function countDisplayedCards(cards: Card[]): number {
  return cards.filter((card) => card.displayedBy).length;
}

function getTwoMostRecentlyDisplayedCardsInRound(
  cards: Card[],
  round: number
): Card[] {
  return [...cards]
    .sort((a, b) => {
      if (a.displayedOnRound === null && b.displayedOnRound === null) {
        return 0;
      } else if (a.displayedOnRound == null) {
        return 1; // sort a after b
      } else if (b.displayedOnRound == null) {
        return -1; // sort b after a
      } else {
        return a.displayedOnRound - b.displayedOnRound; // desc
      }
    })
    .filter((card) => card.displayedOnRound === round)
    .splice(-2);
}

function computeGuessResult(cards: Array<Card>, round: number): GuessStatus {
  const previousRound = round - 1;
  const lastTwoCards = getTwoMostRecentlyDisplayedCardsInRound(
    cards,
    previousRound
  );
  const count = lastTwoCards.length;
  const canComputeGuess = count > 0 && count % 2 === 0;

  if (!canComputeGuess) {
    return GuessStatus.Unknown;
  }

  const [previousCard1, previousCard2] = lastTwoCards;
  if (previousCard1.emoji === previousCard2.emoji) {
    return GuessStatus.Correct;
  }

  return GuessStatus.Incorrect;
}

function computeScores(
  cards: Card[],
  currentRound: number,
  guessStatus: GuessStatus
): { correctGuessesPlayer1: number; correctGuessesPlayer2: number } {
  const upToRound =
    currentRound - (guessStatus === GuessStatus.Correct ? 1 : 2);

  let initialValue = { correctGuessesPlayer1: 0, correctGuessesPlayer2: 0 };

  const isCorrectScoreForPlayer = (card: Card, player: PlayerNumber) => {
    return (
      card.displayedOnRound !== null &&
      card.displayedOnRound <= upToRound &&
      card.displayedBy === player
    );
  };

  return cards.reduce(
    (previousValue, currentItem) => ({
      ...previousValue,
      correctGuessesPlayer1: isCorrectScoreForPlayer(currentItem, 1)
        ? previousValue.correctGuessesPlayer1 + 0.5
        : previousValue.correctGuessesPlayer1,
      correctGuessesPlayer2: isCorrectScoreForPlayer(currentItem, 2)
        ? previousValue.correctGuessesPlayer2 + 0.5
        : previousValue.correctGuessesPlayer2,
    }),
    initialValue
  );
}

export function Game() {
  const [state, dispatch] = useReducer(memoryGameReducer, initialState);

  const guessStatus = computeGuessResult(state.cards, state.round);

  const { correctGuessesPlayer1, correctGuessesPlayer2 } = computeScores(
    state.cards,
    state.round,
    guessStatus
  );

  useEffect(() => {
    if (guessStatus === GuessStatus.Incorrect) {
      const timer = setTimeout(() => {
        dispatch({ type: "revert_incorrect_guess" });
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [guessStatus]);

  const rows = getRows(state.cards);

  const count = countDisplayedCards(state.cards);
  const isGameOver = count === state.cards.length;

  return (
    <div>
      <h1>Memory Game</h1>
      <h2>Current Player: {state.currentPlayer}</h2>
      <h2>Round: {state.round}</h2>
      <table
        style={{ border: "solid", marginLeft: "auto", marginRight: "auto" }}
      >
        <tbody className="bg-amber-400">
          {rows.map((r) => (
            <RowView
              key={r.id}
              row={r}
              dispatch={dispatch}
              guessStatus={guessStatus}
            />
          ))}
        </tbody>
      </table>
      <div>Score Player 1: {correctGuessesPlayer1} </div>
      <div>Score Player 2: {correctGuessesPlayer2} </div>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
      {isGameOver ? "Game over" : null}
      <label hidden={guessStatus !== GuessStatus.Incorrect}>
        Incorrect Guess
      </label>
    </div>
  );
}
