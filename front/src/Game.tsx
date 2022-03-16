import { useReducer } from "react";

type Card = {
  id: number;
  emoji: string;
  isDisplayed: boolean;
};

type BoardState = {
  cards: Card[];
};

type Row = {
  id: number;
  cards: Card[];
};

const initialState: BoardState = {
  cards: [
    { id: 0, emoji: "❤", isDisplayed: false },
    { id: 1, emoji: "🌹", isDisplayed: false },
    { id: 2, emoji: "❤", isDisplayed: false },
    { id: 3, emoji: "😍", isDisplayed: false },
    { id: 4, emoji: "😍", isDisplayed: false },
    { id: 5, emoji: "🏠", isDisplayed: false },
    { id: 6, emoji: "👍", isDisplayed: false },
    { id: 7, emoji: "😂", isDisplayed: false },
    { id: 8, emoji: "😂", isDisplayed: false },
    { id: 9, emoji: "🏠", isDisplayed: false },
    { id: 10, emoji: "🌹", isDisplayed: false },
    { id: 11, emoji: "👍", isDisplayed: false },
    { id: 12, emoji: "🎂", isDisplayed: false },
    { id: 13, emoji: "🐱‍🐉", isDisplayed: false },
    { id: 14, emoji: "🐱‍🐉", isDisplayed: false },
    { id: 15, emoji: "🎂", isDisplayed: false },
  ],
};

type Action =
  | { type: "hide_all" }
  | { type: "display_one"; selectedCardId: number };

function memoryGameReducer(state: BoardState, action: Action): BoardState {
  switch (action.type) {
    case "hide_all":
      return {
        ...state,
        cards: state.cards.map((card) => ({ ...card, isDisplayed: false })),
      };
    case "display_one":
      return {
        ...state,
        cards: state.cards.map((card) =>
          card.id === action.selectedCardId
            ? { ...card, isDisplayed: true }
            : card
        ),
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
          <span onClick={(e) => handleClick({ ...e, card })}>
            {card.isDisplayed ? card.emoji : "⬜"}
          </span>
        </td>
      ))}
    </tr>
  );
}

export function Game() {
  const [state, dispatch] = useReducer(memoryGameReducer, initialState);

  const rows = getRows(state.cards);

  return (
    <div>
      <table style={{ border: "solid" }}>
        <tbody>
          {rows.map((r) => (
            <RowView key={r.id} row={r} dispatch={dispatch} />
          ))}
        </tbody>
      </table>
      <button onClick={() => dispatch({ type: "hide_all" })}>Hide All</button>
    </div>
  );
}

// <>

//               {/* <tr key={x.id}>{x.emoji}</tr>
//               { index % 2 === 0 ? 3 : null }  */}
//             </>
