import { useEffect, useReducer } from "react";
import { Board, BoardRow } from "./Board";
import {
  countDisplayedCards,
  getTwoMostRecentlyDisplayedCardsInRound,
} from "./gameFunctions";
import {
  memoryGameReducer,
  Card,
  GuessStatus,
  initialState,
  PlayerNumber,
  Row,
} from "./gameReducer";

function buildRows(squares: Card[]): Row[] {
  let rows: Row[] = [];
  for (let i = 0; i < squares.length; i = i + 4) {
    const cellsInRow = squares.slice(i, i + 4);
    rows.push({ id: i, cards: cellsInRow });
  }
  return rows;
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

type PlayerProps = {
  playerNumber: PlayerNumber;
  currentPlayer: PlayerNumber;
  score: number;
  children?: React.ReactChild | React.ReactChild[];
};

function Player(props: PlayerProps) {
  const isActive = props.playerNumber === props.currentPlayer;
  const pingClass = `${
    isActive ? "animate-ping rounded-full bg-sky-400 opacity-70 " : ""
  } inline-flex h-3 w-3`;

  return (
    <div className="bg-mint text-sailor-blue">
      <span className={pingClass}></span>
      <div className="p-4">
        Player <span className="font-bold">{props.playerNumber}</span>
      </div>
      <div>
        Score: <span className="font-bold">{props.score}</span>
      </div>
      {props.children}
    </div>
  );
}

type StatusProps = {
  currentRound: number;
  isGameOver: boolean;
  guessStatus: GuessStatus;
};

function Status(props: StatusProps) {
  let content: any;
  if (props.isGameOver) {
    content = <span className="font-bold">Game Over!</span>;
  } else if (props.guessStatus === GuessStatus.Incorrect) {
    content = <span className="font-bold text-red-500">No match!</span>;
  } else {
    content = (
      <span>
        Round: <span className="font-bold">{props.currentRound}</span>
      </span>
    );
  }

  return (
    <div className="bg-mint text-sailor-blue font-semibold p-4">
      <h2>{content}</h2>
    </div>
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

  const rows = buildRows(state.cards);

  const count = countDisplayedCards(state.cards);
  const isGameOver = count === state.cards.length;

  return (
    <div className="grid place-items-center m-4">
      <div className="grid grid-flow-row auto-cols-max text-center font-semibold ">
        <div className="bg-sailor-blue text-mint font-bold p-4">
          <h1>😂 Emoji Memory Game 😂</h1>
        </div>
        <div className="grid grid-flow-col gap-1 p-2">
          <Player
            playerNumber={1}
            score={correctGuessesPlayer1}
            currentPlayer={state.currentPlayer}
          ></Player>
          <Board>
            {rows.map((r) => (
              <BoardRow
                key={r.id}
                row={r}
                dispatch={dispatch}
                guessStatus={guessStatus}
              />
            ))}
          </Board>
          <Player
            playerNumber={2}
            score={correctGuessesPlayer2}
            currentPlayer={state.currentPlayer}
          ></Player>
        </div>
        <div className="grid grid-flow-col">
          <div className="m-1">
            <Status
              currentRound={state.round}
              isGameOver={isGameOver}
              guessStatus={guessStatus}
            ></Status>
          </div>
          <div className="m-1">
            <button
              className="bg-sailor-blue text-mint rounded-full h-full w-full transition ease-in-out delay-70 hover:-translate-y-1 hover:scale-105 duration-100"
              onClick={() => dispatch({ type: "reset" })}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
