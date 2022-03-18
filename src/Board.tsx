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

  const canClick = (card: Card) =>
    !card.displayedBy && props.guessStatus !== GuessStatus.Incorrect;

  return (
    <tr>
      {props.row.cards.map((card) => {
        const canClickCard = canClick(card);
        return (
          <td
            className="transition ease-in-out delay-70 hover:-translate-y-1 hover:scale-105 duration-100 hover:bg-mint text-lg border border-slate-300"
            key={card.id}
          >
            <button
              className={`${
                canClickCard ? "cursor-pointer" : "cursor-not-allowed"
              }`}
              disabled={!canClickCard}
              onClick={(e) => handleClick({ ...e, card })}
            >
              {card.displayedBy ? card.emoji : "⬜"}
            </button>
          </td>
        );
      })}
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