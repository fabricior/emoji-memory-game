import { useReducer } from "react";


type Card = {
  id: number;
  emoji: string;
  displayedBy: number | null;
};

type BoardState = {
  currentPlayer: number;
  previousCards: Array<Card>;
  cards: Card[];
  IsIncorrectGuess: boolean;
};

type Row = {
  id: number;
  cards: Card[];
};

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
  IsIncorrectGuess: false,
};

type Action =
  | { type: "reset" }
  | { type: "display_one"; selectedCard: Card };

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
      
      const previousCard = state.previousCards.slice(-1)[0];

      return {
        ...state,
        cards: state.cards.map((card) =>
          card.id === action.selectedCard.id
            ? { ...card, displayedBy: state.currentPlayer }
            : card
        ),
        currentPlayer: newCurrentPlayer,
        previousCards: [...state.previousCards, action.selectedCard],
        IsIncorrectGuess: mustSwitchPlayers && previousCard != null && (previousCard.emoji !== action.selectedCard.emoji),
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
  IsIncorrectGuess: boolean;
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
              !card.displayedBy && !props.IsIncorrectGuess ? (e) => handleClick({ ...e, card }) : undefined
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
            <RowView key={r.id} row={r} dispatch={dispatch} IsIncorrectGuess={state.IsIncorrectGuess} />
          ))}
        </tbody>
      </table>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
      {isGameOver ? "Game over" : null}
      <label hidden={!state.IsIncorrectGuess}>Incorrect Guess</label>
    </div>
  );
}
