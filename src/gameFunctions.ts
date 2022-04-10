import { CardData } from "./gameReducer";

export function countDisplayedCards(cards: CardData[]): number {
  return cards.filter((cardData) => cardData.displayedBy).length;
}

export function getTwoMostRecentlyDisplayedCardsInRound(
  cards: CardData[],
  round: number
): CardData[] {
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
    .filter((cardData) => cardData.displayedOnRound === round)
    .splice(-2);
}
