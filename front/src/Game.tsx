import { type } from "@testing-library/user-event/dist/type";
import { useReducer } from "react";


type Card = {
  id: number;
  emoji: string;
  displayedBy: number | null;
};

type BoardState = {
  currentPlayer: number;
  cards: Card[];
};

type Row = {
  id: number;
  cards: Card[];
};

const initialState: BoardState = {
  currentPlayer: 1,
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
  | { type: "display_one"; selectedCardId: number };

function memoryGameReducer(state: BoardState, action: Action): BoardState {
  switch (action.type) {
    case "reset":
      return {
        ...initialState
      };
    case "display_one":
      const numberOfCardsSoFar = countDisplayedCards(state.cards);
      const numberOfCardsAfterThisAction = numberOfCardsSoFar + 1;
      const mustSwitchPlayers = numberOfCardsAfterThisAction % 2 === 0;
      let newCurrentPlayer
    
      if (mustSwitchPlayers) {
        newCurrentPlayer = state.currentPlayer === 1 ? 2 : 1
      } else {
        newCurrentPlayer = state.currentPlayer
      }

      return {
        ...state,
        cards: state.cards.map((card) =>
          card.id === action.selectedCardId
            ? { ...card, displayedBy: state.currentPlayer }
            : card
        ),
        currentPlayer: newCurrentPlayer,        
      };
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

type RowViewProps = {
  row: Row;
  dispatch: React.Dispatch<Action>;
};

interface CardClickedEvent extends React.MouseEvent<HTMLSpanElement> {
  card: Card;
}

function RowView(props: RowViewProps) {
  const handleClick = (e: CardClickedEvent): void =>
    props.dispatch({ type: "display_one", selectedCardId: e.card.id });

  return (
    <tr>
      {props.row.cards.map((card) => (
        <td key={card.id}>
          <span
            onClick={
              !card.displayedBy ? (e) => handleClick({ ...e, card }) : undefined
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

  const rows = getRows(state.cards);

  const count = countDisplayedCards(state.cards);
  const isGameOver = count === state.cards.length;

  return (
    <div>
      <h1>Memory Game</h1>
      <h2>Current Player: {state.currentPlayer}</h2>
      <table style={{ border: "solid", marginLeft: "auto", marginRight: "auto" }}>
        <tbody>
          {rows.map((r) => (
            <RowView key={r.id} row={r} dispatch={dispatch} />
          ))}
        </tbody>
      </table>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
      {isGameOver ? "Game over" : null}
    </div>
  );
}
