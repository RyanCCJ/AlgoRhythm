import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TypingArea } from './TypingArea';
import { ProblemDescription } from './ProblemDescription';
import { ChevronRight, ChevronLeft, FileText } from 'lucide-react';

export const Layout: React.FC = () => {
    const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex min-w-0">
                <div className="flex-1 flex flex-col min-w-0 border-r border-gray-800">
                    <TypingArea />
                </div>

                {/* Collapsible Problem Description Panel */}
                <div className={`hidden xl:flex shrink-0 transition-all duration-300 ${isDescriptionCollapsed ? 'w-12' : 'w-[400px]'}`}>
                    {isDescriptionCollapsed ? (
                        <button
                            onClick={() => setIsDescriptionCollapsed(false)}
                            className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gray-900 border-l border-gray-800 hover:bg-gray-800 transition-colors"
                            title="Show Description"
                        >
                            <FileText size={20} className="text-gray-400" />
                            <ChevronLeft size={16} className="text-gray-500" />
                        </button>
                    ) : (
                        <div className="w-full h-full flex flex-col bg-gray-900 border-l border-gray-800">
                            <div className="flex items-center justify-between p-2 border-b border-gray-800">
                                <span className="text-sm text-gray-400 ml-2">Description</span>
                                <button
                                    onClick={() => setIsDescriptionCollapsed(true)}
                                    className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-md transition-colors"
                                    title="Hide Description"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <ProblemDescription />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
