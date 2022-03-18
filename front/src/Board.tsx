import { Row, GuessStatus, Action, Card } from "./gameReducer";

type BoardRowProps = {
  row: Row;
  guessStatus: GuessStatus;
  dispatch: React.Dispatch<Action>;
};

interface CardClickedEvent extends React.MouseEvent<HTMLSpanElement> {
  card: Card;
}

export function BoardRow(props: BoardRowProps) {
  const handleClick = (e: CardClickedEvent): void =>
    props.dispatch({ type: "display_one", selectedCard: e.card });

  return (
    <tr>
      {props.row.cards.map((card) => (
        <td className="transition ease-in-out delay-70 hover:-translate-y-1 hover:scale-105 duration-100 hover:bg-mint cursor-pointer text-lg border border-slate-300" key={card.id}>
          <button
            onClick={
              !card.displayedBy && props.guessStatus !== GuessStatus.Incorrect
                ? (e) => handleClick({ ...e, card })
                    : undefined
            }
          >
            {card.displayedBy ? card.emoji : "⬜"}
          </button>
        </td>
      ))}
    </tr>
  );  
}

type BoardProps = {
  children?: React.ReactChild | React.ReactChild[];
};

export function Board(props: BoardProps) {
  return (
    <table className="border-separate border border-slate-400">
      <tbody>{props.children}</tbody>
    </table>
  );
}
