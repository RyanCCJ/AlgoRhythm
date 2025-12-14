import React, { useEffect, useRef, useState, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { useAppStore } from '../store/useAppStore';
import * as monaco from 'monaco-editor';
import confetti from 'canvas-confetti';

export const TypingArea: React.FC = () => {
    const { getCurrentProblem, completeProblem, selectProblem, getProblemsByDifficulty, currentDifficulty } = useAppStore();
    const problem = getCurrentProblem();

    const [userInput, setUserInput] = useState('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [isFinished, setIsFinished] = useState(false);
    const [finalAccuracy, setFinalAccuracy] = useState(0);
    const [mistakeIndices, setMistakeIndices] = useState<Set<number>>(new Set());

    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setUserInput('');
        setStartTime(null);
        setIsFinished(false);
        setMistakeIndices(new Set());
        setFinalAccuracy(0);
        if (editorRef.current) {
            editorRef.current.setScrollTop(0);
            editorRef.current.setPosition({ lineNumber: 1, column: 1 });
        }
        setTimeout(() => containerRef.current?.focus(), 50);
    }, [problem?.id]);

    useEffect(() => {
        setTimeout(() => containerRef.current?.focus(), 100);

        // Inject strong CSS to override syntax highlighting
        const style = document.createElement('style');
        style.id = 'typing-area-override';
        style.textContent = `
            .char-untyped,
            .char-untyped * {
                color: #666666 !important;
                opacity: 1 !important;
            }
        `;
        if (!document.getElementById('typing-area-override')) {
            document.head.appendChild(style);
        }

        return () => {
            const existingStyle = document.getElementById('typing-area-override');
            if (existingStyle) {
                existingStyle.remove();
            }
        };
    }, []);

    const handleNextProblem = () => {
        if (!problem) return;
        const problems = getProblemsByDifficulty(currentDifficulty);
        const currentIndex = problems.findIndex(p => p.id === problem.id);
        if (currentIndex !== -1 && currentIndex < problems.length - 1) {
            selectProblem(problems[currentIndex + 1].id);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!problem) return;

        if (isFinished) {
            if (e.key === 'Enter') {
                handleNextProblem();
            } else if (e.key === 'Escape') {
                setUserInput('');
                setStartTime(null);
                setIsFinished(false);
                containerRef.current?.focus();
            }
            return;
        }

        if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) return;

        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
            e.preventDefault();
        }

        if (e.key === 'Backspace') {
            setUserInput(prev => prev.slice(0, -1));
            return;
        }

        let charToAppend = '';

        if (e.key === 'Enter') {
            const code = problem.code;
            const currentLength = userInput.length;
            charToAppend = '\n';
            let targetPos = currentLength + 1;
            if (code[currentLength] === '\n') {
                while (targetPos < code.length && (code[targetPos] === ' ' || code[targetPos] === '\t')) {
                    charToAppend += code[targetPos];
                    targetPos++;
                }
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            charToAppend = '    ';
        } else if (e.key.length === 1) {
            charToAppend = e.key;
        } else {
            return;
        }

        if (startTime === null) setStartTime(Date.now());

        const currentLength = userInput.length;

        for (let i = 0; i < charToAppend.length; i++) {
            const targetChar = problem.code[currentLength + i];
            const inputChar = charToAppend[i];

            if (targetChar !== inputChar) {
                setMistakeIndices(prev => {
                    const newSet = new Set(prev);
                    newSet.add(currentLength + i);
                    return newSet;
                });
            }
        }

        setUserInput(prev => {
            const nextInput = prev + charToAppend;

            if (nextInput.length >= problem.code.length) {
                const endTime = Date.now();
                const timeInMinutes = (endTime - (startTime || Date.now())) / 60000;
                const words = nextInput.length / 5;
                const wpm = Math.round(words / timeInMinutes) || 0;

                const currentMistakes = new Set(mistakeIndices);
                for (let i = 0; i < charToAppend.length; i++) {
                    if (problem.code[currentLength + i] !== charToAppend[i]) {
                        currentMistakes.add(currentLength + i);
                    }
                }

                let denominator = 0;
                for (let i = 0; i < problem.code.length; i++) {
                    const isWhitespace = /\s/.test(problem.code[i]);
                    if (!isWhitespace) {
                        denominator++;
                    } else if (currentMistakes.has(i)) {
                        denominator++;
                    }
                }

                const numerator = currentMistakes.size;
                const accuracy = denominator === 0 ? 100 : Math.max(0, Math.round((1 - numerator / denominator) * 100));

                setIsFinished(true);
                setFinalAccuracy(accuracy);
                completeProblem(problem.id, wpm, accuracy);
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
            return nextInput;
        });
    };

    const displayCode = useMemo(() => {
        if (!problem) return '';
        return userInput + problem.code.slice(userInput.length);
    }, [userInput, problem]);

    useEffect(() => {
        if (!editorRef.current || !problem) return;

        const model = editorRef.current.getModel();
        if (!model) return;

        const decorations: monaco.editor.IModelDeltaDecoration[] = [];
        const code = problem.code;

        const currentPos = model.getPositionAt(userInput.length);
        const endPos = model.getPositionAt(code.length);

        if (userInput.length < code.length) {
            decorations.push({
                range: new monaco.Range(
                    currentPos.lineNumber, currentPos.column,
                    endPos.lineNumber, endPos.column
                ),
                options: {
                    inlineClassName: 'char-untyped'
                }
            });
        }

        for (let i = 0; i < userInput.length; i++) {
            if (userInput[i] !== code[i]) {
                const start = model.getPositionAt(i);
                const end = model.getPositionAt(i + 1);
                decorations.push({
                    range: new monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column),
                    options: {
                        inlineClassName: 'char-error',
                        stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
                    }
                });
            }
        }

        if (!isFinished) {
            decorations.push({
                range: new monaco.Range(currentPos.lineNumber, currentPos.column, currentPos.lineNumber, currentPos.column),
                options: {
                    className: 'custom-cursor',
                    stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
                }
            });

            editorRef.current.revealPosition(currentPos);
        }

        const decorationIds = editorRef.current.deltaDecorations(
            (editorRef.current as any)._oldDecorations || [],
            decorations
        );
        (editorRef.current as any)._oldDecorations = decorationIds;

    }, [userInput, problem, isFinished, displayCode]);

    if (!problem) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a problem to start practicing
            </div>
        );
    }

    const problems = getProblemsByDifficulty(currentDifficulty);
    const currentIndex = problems.findIndex(p => p.id === problem.id);
    const hasNextProblem = currentIndex !== -1 && currentIndex < problems.length - 1;

    return (
        <div
            className="flex-1 flex flex-col h-full relative outline-none"
            ref={containerRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onClick={() => containerRef.current?.focus()}
        >
            <div className="flex-1 relative">
                <div
                    className="absolute inset-0 z-10 cursor-text"
                    onClick={() => containerRef.current?.focus()}
                />
                <Editor
                    height="100%"
                    language="python"
                    theme="vs-dark"
                    value={displayCode}
                    options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        fontSize: 16,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        renderLineHighlight: 'none',
                        contextmenu: false,
                        scrollbar: {
                            vertical: 'hidden',
                            horizontal: 'hidden'
                        },
                        domReadOnly: true,
                        tabIndex: -1,
                    }}
                    onMount={(editor) => {
                        editorRef.current = editor;
                        (editor as any)._oldDecorations = [];

                        // Apply initial decorations immediately
                        setTimeout(() => {
                            if (problem) {
                                const model = editor.getModel();
                                if (model) {
                                    const endPos = model.getPositionAt(problem.code.length);
                                    const decorations = [{
                                        range: new monaco.Range(1, 1, endPos.lineNumber, endPos.column),
                                        options: {
                                            inlineClassName: 'char-untyped'
                                        }
                                    }];
                                    (editor as any)._oldDecorations = editor.deltaDecorations([], decorations);
                                }
                            }
                            editor.layout();
                            containerRef.current?.focus();
                        }, 50);
                    }}
                />

                {isFinished && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-30">
                        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 text-center max-w-md animate-in fade-in zoom-in duration-300">
                            <h2 className="text-3xl font-bold text-white mb-2">Great Job!</h2>
                            <p className="text-gray-400 mb-6">You completed {problem.title}</p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-gray-900 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-emerald-400">
                                        {Math.round((userInput.length / 5) / ((Date.now() - (startTime || Date.now())) / 60000)) || 0}
                                    </div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">WPM</div>
                                </div>
                                <div className="bg-gray-900 p-4 rounded-lg">
                                    <div className={`text-2xl font-bold ${finalAccuracy === 100 ? 'text-emerald-400' :
                                        finalAccuracy >= 60 ? 'text-yellow-400' :
                                            'text-red-400'
                                        }`}>
                                        {finalAccuracy}%
                                    </div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Accuracy</div>
                                </div>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => {
                                        setUserInput('');
                                        setStartTime(null);
                                        setIsFinished(false);
                                        containerRef.current?.focus();
                                    }}
                                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2"
                                >
                                    Try Again <span className="text-xs opacity-75">(Esc)</span>
                                </button>
                                {hasNextProblem && (
                                    <button
                                        onClick={handleNextProblem}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2"
                                    >
                                        Next <span className="text-xs opacity-75">(Enter)</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};