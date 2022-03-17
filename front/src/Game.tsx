import { useEffect, useReducer } from "react";

type Card = {
  id: number;
  emoji: string;
  displayedBy: PlayerNumber | null;
};

type PlayerNumber = 1 | 2

type BoardState = {
  currentPlayer: PlayerNumber;
  previousCards: Array<Card>;
  cards: Card[];
};

type Row = {
  id: number;
  cards: Card[];
};

enum GuessStatus {
  Unknown = "Unknown",
  Correct = "Correct",
  Incorrect = "Incorrect",  
}

const initialState: BoardState = {
  currentPlayer: 1,
  previousCards: [],
  cards: [
    { id: 0, emoji: "❤", displayedBy: null },
    { id: 1, emoji: "🌹", displayedBy: null },
    { id: 2, emoji: "❤", displayedBy: null },
    { id: 3, emoji: "😍", displayedBy: null },
    { id: 4, emoji: "😍", displayedBy: null },
    { id: 5, emoji: "🏠", displayedBy: null },
    { id: 6, emoji: "👍", displayedBy: null },
    { id: 7, emoji: "😂", displayedBy: null },
    { id: 8, emoji: "😂", displayedBy: null },
    { id: 9, emoji: "🏠", displayedBy: null },
    { id: 10, emoji: "🌹", displayedBy: null },
    { id: 11, emoji: "👍", displayedBy: null },
    { id: 12, emoji: "🎂", displayedBy: null },
    { id: 13, emoji: "🐱‍🐉", displayedBy: null },
    { id: 14, emoji: "🐱‍🐉", displayedBy: null },
    { id: 15, emoji: "🎂", displayedBy: null },
  ],
};

type Action =
  | { type: "reset" }
  | { type: "display_one"; selectedCard: Card }
  | { type: "revert_incorrect_guess" };

function memoryGameReducer(state: BoardState, action: Action): BoardState {
  switch (action.type) {
    case "reset":
      return {
        ...initialState,
      };
    case "display_one":
      const newPreviousCards = [...state.previousCards, action.selectedCard]
      const mustSwitchPlayers = newPreviousCards.length % 2 === 0;

      let newCurrentPlayer: PlayerNumber;      
      if (mustSwitchPlayers) {
        newCurrentPlayer = state.currentPlayer === 1 ? 2 : 1;
      } else {
        newCurrentPlayer = state.currentPlayer;
      }

      return {
        ...state,
        cards: state.cards.map((card) =>
          card.id === action.selectedCard.id
            ? { ...card, displayedBy: state.currentPlayer }
            : card
        ),
        currentPlayer: newCurrentPlayer,
        previousCards: newPreviousCards,        
      };
    case "revert_incorrect_guess":
      const lastTwoCards = state.previousCards.slice(-2);
      return {
        ...state,
        cards: state.cards.map((c) =>
          lastTwoCards.find((q) => q.id === c.id)
            ? { ...c, displayedBy: null }
            : { ...c }            
        ),
        previousCards: state.previousCards.slice(0, state.previousCards.length - 2)
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

function computeGuessResult(previousCards: Array<Card>) : GuessStatus {
  const count = previousCards.length;
  const canComputeGuess = count > 0 && count % 2 === 0;

  if (!canComputeGuess) {
    return GuessStatus.Unknown;
  }
  
  const [previousCard1, previousCard2] = previousCards.slice(-2);
  if (previousCard1.emoji === previousCard2.emoji) {
    return GuessStatus.Correct;
  }

  return GuessStatus.Incorrect;
}

type RowViewProps = {
  row: Row;
  guessStatus: GuessStatus;
  dispatch: React.Dispatch<Action>;
};

interface CardClickedEvent extends React.MouseEvent<HTMLSpanElement> {
  card: Card;
}

function RowView(props: RowViewProps) {
  const handleClick = (e: CardClickedEvent): void =>
    props.dispatch({ type: "display_one", selectedCard: e.card });

  return (
    <tr>
      {props.row.cards.map((card) => (
        <td key={card.id}>
          <span
            onClick={
              !card.displayedBy && props.guessStatus !== GuessStatus.Incorrect
                ? (e) => handleClick({ ...e, card })
                : undefined
            }
          >
            {card.displayedBy ? card.emoji : "⬜"}
          </span>
        </td>
      ))}
    </tr>
  );
}


export function Game() {
  const [state, dispatch] = useReducer(memoryGameReducer, initialState);

  const guessStatus = computeGuessResult(state.previousCards);

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
      <table
        style={{ border: "solid", marginLeft: "auto", marginRight: "auto" }}
      >
        <tbody>
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
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
      {isGameOver ? "Game over" : null}
      <label hidden={guessStatus !== GuessStatus.Incorrect}>Incorrect Guess</label>
    </div>
  );
}
