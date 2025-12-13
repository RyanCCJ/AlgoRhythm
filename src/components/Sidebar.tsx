import React from 'react';
import { useAppStore, Difficulty } from '../store/useAppStore';
import { Circle } from 'lucide-react';
import { clsx } from 'clsx';

export const Sidebar: React.FC = () => {
    const {
        currentDifficulty,
        setDifficulty,
        getProblemsByDifficulty,
        currentProblemId,
        selectProblem,
        userProgress
    } = useAppStore();

    const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
    const problems = getProblemsByDifficulty(currentDifficulty);

    return (
        <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
            <div className="p-4 border-b border-gray-800">
                <h1 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-emerald-500">Algo</span>Rhythm
                </h1>
                <div className="flex bg-gray-800 rounded-lg p-1">
                    {difficulties.map((diff) => (
                        <button
                            key={diff}
                            onClick={() => setDifficulty(diff)}
                            className={clsx(
                                "flex-1 py-1.5 text-sm font-medium rounded-md capitalize transition-colors",
                                currentDifficulty === diff
                                    ? "bg-gray-700 text-white shadow-sm"
                                    : "text-gray-400 hover:text-gray-200"
                            )}
                        >
                            {diff}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {problems.length === 0 ? (
                    <div className="text-center text-gray-500 py-8 text-sm">
                        No problems available yet.
                    </div>
                ) : (
                    problems.map((problem) => {
                        const stats = userProgress.problemStats[problem.id];
                        const isCompleted = userProgress.completedProblems.includes(problem.id);
                        const isSelected = currentProblemId === problem.id;
                        const accuracy = stats?.accuracy || 0;

                        let accuracyColor = 'text-gray-600';
                        if (isCompleted) {
                            if (accuracy === 100) accuracyColor = 'text-emerald-500';
                            else if (accuracy >= 60) accuracyColor = 'text-yellow-500';
                            else accuracyColor = 'text-red-500';
                        }

                        return (
                            <button
                                key={problem.id}
                                onClick={() => selectProblem(problem.id)}
                                className={clsx(
                                    "w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all",
                                    isSelected
                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                        : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                                )}
                            >
                                {isCompleted ? (
                                    <span className={clsx("text-xs font-bold w-8 text-right shrink-0", accuracyColor)}>
                                        {accuracy}%
                                    </span>
                                ) : (
                                    <Circle size={18} className="text-gray-600 shrink-0 ml-auto w-8" />
                                )}
                                <div className="truncate flex-1">
                                    <div className="font-medium text-sm truncate">{problem.title}</div>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>

            <div className="p-4 border-t border-gray-800 text-xs text-gray-500 text-center">
                v1.0.0 • Blind Coding Practice
            </div>
        </div>
    );
};
