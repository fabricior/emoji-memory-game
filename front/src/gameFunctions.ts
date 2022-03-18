import { Card } from "./gameReducer";

export function countDisplayedCards(cards: Card[]): number {
  return cards.filter((card) => card.displayedBy).length;
}

export function getTwoMostRecentlyDisplayedCardsInRound(
  cards: Card[],
  round: number
): Card[] {
  return [...cards]
    .sort((a, b) => {
      if (a.displayedOnRound === null && b.displayedOnRound === null) {
        return 0;
      } else if (a.displayedOnRound == null) {
        return 1; // sort a after b
      } else if (b.displayedOnRound == null) {
        return -1; // sort b after a
      } else {
        return a.displayedOnRound - b.displayedOnRound; // desc
      }
    })
    .filter((card) => card.displayedOnRound === round)
    .splice(-2);
}
