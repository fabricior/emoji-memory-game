import { Card } from "./Card";
import { Row, GuessStatus, Action, CardData } from "./gameReducer";

type BoardRowProps = {
  row: Row;
  guessStatus: GuessStatus;
  dispatch: React.Dispatch<Action>;
};

interface CardClickedEvent extends React.MouseEvent<HTMLSpanElement> {
  cardData: CardData;
}

export function BoardRow(props: BoardRowProps) {
  const handleClick = (e: CardClickedEvent): void =>
    props.dispatch({ type: "display_one", selectedCard: e.cardData });

  const canClick = (card: CardData) =>
    !card.displayedBy && props.guessStatus !== GuessStatus.Incorrect;

  return (
    <>
      {props.row.cards.map((cardData) => {
        const canClickCard = canClick(cardData);
        return (
          <Card
            key={cardData.id}
            cardData={cardData}
            canClickCard={canClickCard}
            onClick={(e) => handleClick({ ...e, cardData: cardData })}
          />
        );
      })}
    </>
  );
}

type BoardProps = {
  children?: React.ReactChild | React.ReactChild[];
};

export function Board(props: BoardProps) {
  return (
    <div className="grid grid-cols-4 grid-rows-4 gap-2">{props.children}</div>
  );
}
