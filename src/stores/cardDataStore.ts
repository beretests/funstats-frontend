import { create } from "zustand";

type CardDataMap = Record<string, any>;

interface CardDataState {
  cardData: CardDataMap;
  setCardData: (label: string, data: any) => void;
  getCardData: (label: string) => any;
}

export const useCardDataStore = create<CardDataState>((set, get) => ({
  cardData: {},
  setCardData: (label, data) =>
    set((state) => ({
      cardData: {
        ...state.cardData,
        [label]: data,
      },
    })),
  getCardData: (label) => get().cardData[label],
}));
