import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import contentData from '../data/content.json';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Problem {
    id: string;
    title: string;
    description: string;
    code: string;
    difficulty: Difficulty;
}

interface UserProgress {
    completedProblems: string[]; // Array of problem IDs
    problemStats: {
        [problemId: string]: {
            bestWpm: number;
            accuracy: number;
            attempts: number;
            lastPlayed: string;
        };
    };
}

interface AppState {
    currentDifficulty: Difficulty;
    currentProblemId: string | null;
    userProgress: UserProgress;

    setDifficulty: (difficulty: Difficulty) => void;
    selectProblem: (problemId: string) => void;
    completeProblem: (problemId: string, wpm: number, accuracy: number) => void;
    resetProgress: () => void;

    // Computed
    getProblemsByDifficulty: (difficulty: Difficulty) => Problem[];
    getCurrentProblem: () => Problem | null;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            currentDifficulty: 'easy',
            currentProblemId: null,
            userProgress: {
                completedProblems: [],
                problemStats: {},
            },

            setDifficulty: (difficulty) => set({ currentDifficulty: difficulty }),

            selectProblem: (problemId) => set({ currentProblemId: problemId }),

            resetProgress: () => set({
                userProgress: {
                    completedProblems: [],
                    problemStats: {},
                }
            }),

            completeProblem: (problemId, wpm, accuracy) => set((state) => {
                const stats = state.userProgress.problemStats[problemId] || { bestWpm: 0, accuracy: 0, attempts: 0, lastPlayed: '' };

                return {
                    userProgress: {
                        completedProblems: state.userProgress.completedProblems.includes(problemId)
                            ? state.userProgress.completedProblems
                            : [...state.userProgress.completedProblems, problemId],
                        problemStats: {
                            ...state.userProgress.problemStats,
                            [problemId]: {
                                bestWpm: Math.max(stats.bestWpm, wpm),
                                accuracy: accuracy, // Always update to latest accuracy
                                attempts: stats.attempts + 1,
                                lastPlayed: new Date().toISOString(),
                            }
                        }
                    }
                };
            }),

            getProblemsByDifficulty: (difficulty) => {
                return (contentData as any)[difficulty] || [];
            },

            getCurrentProblem: () => {
                const { currentDifficulty, currentProblemId } = get();
                if (!currentProblemId) return null;
                const problems = (contentData as any)[currentDifficulty] || [];
                return problems.find((p: Problem) => p.id === currentProblemId) || null;
            }
        }),
        {
            name: 'algorhythm-storage',
        }
    )
);
