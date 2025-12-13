import React from 'react';
import { Sidebar } from './Sidebar';
import { TypingArea } from './TypingArea';
import { ProblemDescription } from './ProblemDescription';

export const Layout: React.FC = () => {
    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex min-w-0">
                <div className="flex-1 flex flex-col min-w-0 border-r border-gray-800">
                    <TypingArea />
                </div>
                <div className="w-[400px] shrink-0 hidden xl:block">
                    <ProblemDescription />
                </div>
            </main>
        </div>
    );
};
