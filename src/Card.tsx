import { CardData } from "./gameReducer";

type CardProps = {
  cardData: CardData;
  canClickCard: boolean;
  onClick: (e: React.MouseEvent<HTMLSpanElement>) => void;
};
export function Card(props: CardProps) {
  const oneBasedId = props.cardData.id + 1;

  return (
    <div className="transition ease-in-out delay-70 hover:-translate-y-1 hover:scale-105 duration-100 hover:bg-mint text-lg border border-slate-300">
      <button
        aria-label={`card-${oneBasedId}`}
        title={`Card ${oneBasedId}`}
        className={`${props.canClickCard ? "cursor-pointer" : "cursor-not-allowed"}`}
        disabled={!props.canClickCard}
        onClick={props.onClick}
      >
        {props.cardData.displayedBy ? props.cardData.emoji : "⬜"}
      </button>
    </div>
  );
}
