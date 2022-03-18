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
        <td className="hover:bg-mint cursor-pointer text-lg" key={card.id}>
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

type BoardProps = {
  children?: React.ReactChild | React.ReactChild[];
};

export function Board(props: BoardProps) {
  return (
    <table className="bg-sailor-blue border-separate">
      <tbody>{props.children}</tbody>
    </table>
  );
}
