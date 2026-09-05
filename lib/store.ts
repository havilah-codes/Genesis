import { create } from "zustand";

type StoryState = { currentEra: number; activeWindow: boolean; setCurrentEra: (currentEra: number) => void; setActiveWindow: (activeWindow: boolean) => void };

export const useStoryStore = create<StoryState>((set) => ({ currentEra: 0, activeWindow: true, setCurrentEra: (currentEra) => set({ currentEra }), setActiveWindow: (activeWindow) => set({ activeWindow }) }));