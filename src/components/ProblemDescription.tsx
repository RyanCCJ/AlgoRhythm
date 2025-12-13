import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useAppStore } from '../store/useAppStore';

export const ProblemDescription: React.FC = () => {
    const { getCurrentProblem } = useAppStore();
    const problem = getCurrentProblem();

    if (!problem) {
        return null;
    }

    // Transform headings: # -> ##, ## -> ###, etc.
    const transformedDescription = problem.description.replace(
        /^(#+)/gm,
        (match) => match + '#'
    );

    return (
        <div className="h-full flex flex-col bg-gray-900 border-l border-gray-800">
            <div className="p-6 overflow-y-auto">
                <div className="prose prose-invert prose-emerald max-w-none">
                    <ReactMarkdown>{transformedDescription}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
};
