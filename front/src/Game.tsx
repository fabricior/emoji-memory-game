import { useReducer } from "react";

type Square = {
  id: number;
  emoji: string;
  isDisplayed: boolean;
};

const initialState: BoardState = {
  squares: [
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
  ],
};

type BoardState = {
  squares: Square[];
};

type Action = { type: "hide_all" } | { type: "display_one" };

function memoryGameReducer(state: BoardState, action: Action): BoardState {
  throw new Error("Function not implemented.");
}

export function Game() {
  const [state, dispatch] = useReducer(memoryGameReducer, initialState);

  return (
    <div>
      {state.squares.map((x) => (
        <span key={x.id}>{x.emoji}</span>
      ))}
    </div>
  );
}
