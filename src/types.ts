export interface IHistory {
  text: string;
  color?: HistoryColor;
}

export type HistoryColor = "green" | "red";

export interface ICard {
  label: string;
  suit: string;
}
