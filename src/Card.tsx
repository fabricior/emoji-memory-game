import ReactCardFlip from "react-card-flip";
import { CardData } from "./gameReducer";

type CardProps = {
  cardData: CardData;
  canClickCard: boolean;
  onClick: (e: React.MouseEvent<HTMLSpanElement>) => void;
};
export function Card(props: CardProps) {
  const oneBasedId = props.cardData.id + 1;
  const isFlipped = props.cardData.displayedBy !== null;

  return (
    <div className="transition ease-in-out delay-70 hover:-translate-y-1 hover:scale-105 duration-100 hover:bg-mint text-lg border border-slate-300">
      <ReactCardFlip isFlipped={isFlipped}>
        <div>
          <button
            aria-label={`card-${oneBasedId}`}
            title={`Card ${oneBasedId}`}
            className={`${
              props.canClickCard ? "cursor-pointer" : "cursor-not-allowed"
            }`}
            disabled={!props.canClickCard}
            onClick={props.onClick}
          >
            ⬜
          </button>
        </div>
        <div>{props.cardData.emoji}</div>
      </ReactCardFlip>
    </div>
  );
}
