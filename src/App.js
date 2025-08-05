import React, { useState, useEffect, useCallback } from 'react';
import Card from './components/Card';
import Button from './components/Button';
import LoadingSpinner from './components/LoadingSpinner';
import Timer from './components/Timer';
import QuestionPalette from './components/QuestionPalette';

import QuizHome from './components/QuizHome';
import ModuleSelection from './components/ModuleSelection';
import TopicSelection from './components/TopicSelection';
import QuizSetup from './components/QuizSetup';
import Dashboard from './components/Dashboard';
import InstructionsScreen from './components/InstructionsScreen';
import QuestionPaper from './components/QuestionPaper';
import ResultScreen from './components/ResultScreen';
import QuizScreen from './components/QuizScreen';


import { syllabus } from './data/syllabus';
import './App.css';

export default function App() {
    const [screen, setScreen] = useState('home'); // home, moduleSelection, topics, quizSetup, quiz, results, dashboard
    const [quizMode, setQuizMode] = useState('test'); // test or practice
    const [selectedModule, setSelectedModule] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [numQuestions, setNumQuestions] = useState(5);
    const [questions, setQuestions] = useState([]);
    const [questionStates, setQuestionStates] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("Generating your UPSC-style quiz...");
    const [error, setError] = useState(null);
    const [quizHistory, setQuizHistory] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    // For practice mode immediate feedback
    const [practiceAnswered, setPracticeAnswered] = useState(false);

    // For Gemini-powered answer analysis (e.g. explanation, concepts, etc.)
    const [analysisResults, setAnalysisResults] = useState({});
    const [isAnalyzing, setIsAnalyzing] = useState({});

    // --- Load History from localStorage ---
    useEffect(() => {
        try {
            const storedHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]');
            setQuizHistory(storedHistory);
        } catch (e) {
            console.error("Failed to parse quiz history from localStorage", e);
            setQuizHistory([]);
        }
    }, []);

    // --- Timer logic ---
    useEffect(() => {
        let timer;
        if (screen === 'quiz' && isTimerRunning && quizMode === 'test') {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setScreen('results');
                        setIsTimerRunning(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [screen, isTimerRunning, quizMode]);

    // --- Navigation handlers ---
    const handleModeSelect = (mode) => {
        setQuizMode(mode);
        setScreen('moduleSelection');
    };

    const handleModuleSelect = (mod) => {
        setSelectedModule(mod);
        setScreen('topics');
    };

    const handleTopicSelect = (topic) => {
        setSelectedTopic(topic);
        setNumQuestions(5);
        setScreen('quizSetup');
    };

    const handleStartFullTest = () => {
        const topic = "Full Length Polity Test";
        const count = 150;
        setQuizMode('test');
        setSelectedTopic(topic);
        setNumQuestions(count);
        generateQuiz(count, topic);
    };

    const handleBack = () => {
        switch (screen) {
            case 'moduleSelection':
                setScreen('home');
                break;
            case 'topics':
                setScreen('moduleSelection');
                break;
            case 'quizSetup':
                setScreen('topics');
                break;
            case 'instructions':
                setScreen('quizSetup');
                break;
            case 'questionPaper':
                setScreen('quiz');
                break;
            case 'results':
            case 'dashboard':
            default:
                setScreen('home');
                break;
        }
    };

    const restartQuiz = () => {
        setScreen('home');
        setSelectedModule(null);
        setSelectedTopic(null);
        setNumQuestions(5);
        setQuestions([]);
        setQuestionStates([]);
        setCurrentQuestionIndex(0);
        setTimeLeft(0);
        setIsTimerRunning(false);
        setError(null);
        setAnalysisResults({});
        setIsAnalyzing({});
    };

    // --- Generate Quiz (stub) ---
    const generateQuiz = useCallback(async (questionCount, quizTopic) => {
    setIsLoading(true);
    setError(null);

    const BATCH_SIZE = 10;
    const isLargeTest = questionCount > 20;
    const numBatches = isLargeTest ? Math.ceil(questionCount / BATCH_SIZE) : 1;
    let allQuestions = [];

    const generationConfig = {
        responseMimeType: "application/json",
        responseSchema: {
            type: "OBJECT",
            properties: {
                quiz: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            question: { type: "STRING" },
                            options: { type: "ARRAY", items: { type: "STRING" } },
                            answer: { type: "INTEGER" },
                            explanation: { type: "STRING" }
                        },
                        required: ["question", "options", "answer", "explanation"]
                    }
                }
            }
        }
    };

    try {
        const apiKey = "REMOVED_GOOGLE_API_KEY";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        for (let i = 0; i < numBatches; i++) {
            const currentBatchSize = isLargeTest
                ? (i === numBatches - 1 ? questionCount - i * BATCH_SIZE : BATCH_SIZE)
                : questionCount;

            setLoadingText(`Generating questions... (${i * BATCH_SIZE}/${questionCount})`);

            const prompt = `You are an expert quiz generator for the UPSC Civil Services (Indian Polity) exam. Create ${currentBatchSize} UPSC-style multiple choice questions on: "${quizTopic}".
Each question must include:
- A challenging UPSC-type question
- 4 options
- Correct option index (0-based)
- A detailed explanation

Mix question types: Statement-based, Assertion-Reasoning, Match-the-Following.
Output should be in strict JSON: { quiz: [{question, options, answer, explanation}] }`;

            const payload = {
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`API request failed for batch ${i + 1}`);

            const result = await response.json();
            const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (rawText) {
                const quizData = JSON.parse(rawText);
                if (quizData.quiz && quizData.quiz.length > 0) {
                    allQuestions.push(...quizData.quiz);
                }
            }
        }

        if (allQuestions.length === 0) throw new Error("No questions returned by API.");

        // Shuffle
        allQuestions.sort(() => Math.random() - 0.5);
        setQuestions(allQuestions);
        setQuestionStates(allQuestions.map(() => ({ answer: null, status: 'unseen', marked: false })));

        if (quizMode === 'test') {
            const timeInSeconds = allQuestions.length * 60;
            setTimeLeft(timeInSeconds);
            setScreen('instructions');
        }else 
            {
            setScreen('quiz'); // ✅ For practice mode, go directly to quiz
        }
        
    } catch (err) {
        console.error("Quiz generation failed:", err);
        setError("Failed to generate quiz. Please try again later.");
        setScreen(questionCount === 150 ? 'home' : 'quizSetup');
    } finally {
        setIsLoading(false);
    }
}, [quizMode]);

    // --- ✨ New Gemini API call for analysis and simplification ---
    const generateAnalysis = useCallback(async (index, question, explanation, userAnswerText, correctAnswer) => {
        setIsAnalyzing(prev => ({ ...prev, [index]: true }));
        setAnalysisResults(prev => ({ ...prev, [index]: null })); // Clear previous result
        
        const isCorrect = userAnswerText === correctAnswer.text;
        const analysisType = isCorrect ? "SIMPLIFY" : "ANALYZE_MISTAKE";
        
        let prompt = "";
        if(analysisType === "SIMPLIFY") {
            prompt = `Explain the following concept from Indian Polity as if you are teaching a 10-year-old. Be simple, clear, and use an analogy if possible.\n\nConcept from this explanation: "${explanation}"`;
        } else {
            prompt = `A UPSC aspirant made a mistake on a polity quiz. Your task is to analyze their error and provide a clear, encouraging explanation.\n\n**Question:**\n${question}\n\n**Student's Incorrect Answer:**\n"${userAnswerText}"\n\n**Correct Answer:**\n"${correctAnswer.text}"\n\n**Analysis Task:**\n1. Identify the core misunderstanding that led the student to choose the wrong option.\n2. Gently explain why their choice is incorrect.\n3. Clearly explain why the correct answer is right, linking it back to the core concept.\n4. Keep the tone supportive and educational.`;
        }

        try {
            const apiKey = "REMOVED_GOOGLE_API_KEY";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("API request for analysis failed.");

            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (text) {
                setAnalysisResults(prev => ({ ...prev, [index]: text }));
            } else {
                throw new Error("Could not get analysis from API.");
            }

        } catch (error) {
            console.error("Error generating analysis:", error);
            setAnalysisResults(prev => ({ ...prev, [index]: "Sorry, couldn't generate analysis at this time." }));
        } finally {
            setIsAnalyzing(prev => ({ ...prev, [index]: false }));
        }
    }, []);
    // --- Quiz Logic Handlers ---

    const updateQuestionState = (index, updates) => {
        const newStates = [...questionStates];
        newStates[index] = { ...newStates[index], ...updates };
        setQuestionStates(newStates);
    };

    const handleAnswerSelect = (optionIndex) => {
        if (quizMode === 'practice' && practiceAnswered) return; // Don't allow changing answer in practice mode

        updateQuestionState(currentQuestionIndex, { answer: optionIndex, status: 'answered' });
        if (quizMode === 'practice') {
            setPracticeAnswered(true);
        }
    };

    const handleToggleMark = () => {
        const currentState = questionStates[currentQuestionIndex];
        updateQuestionState(currentQuestionIndex, { marked: !currentState.marked });
        goToNextQuestion();
    };
    
    const handleClearResponse = () => {
        updateQuestionState(currentQuestionIndex, { answer: null, status: 'unanswered' });
    };

    const goToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setPracticeAnswered(false);
        }
    };
    
    const handleSaveAndNext = () => {
        if (questionStates[currentQuestionIndex]?.answer === null) {
            updateQuestionState(currentQuestionIndex, { status: 'unanswered' });
        }
        goToNextQuestion();
    };

    const calculateScore = useCallback(() => {
        return questionStates.reduce((score, state, index) => {
            if (questions[index] && state.answer === questions[index].answer) {
                return score + 1;
            }
            return score;
        }, 0);
    }, [questionStates, questions]);

    // --- Save results to localStorage ---
    useEffect(() => {
        if (screen === 'results' && questions.length > 0) {
            const score = calculateScore();
            const newHistoryEntry = {
                topic: selectedTopic,
                score,
                total: questions.length,
                date: new Date().toISOString(),
            };
            const updatedHistory = [...quizHistory, newHistoryEntry];
            setQuizHistory(updatedHistory);
            localStorage.setItem('quizHistory', JSON.stringify(updatedHistory));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [screen]);

    const renderContent = () => {
        if (isLoading) return <LoadingSpinner text={loadingText} />;

        switch (screen) {
            case 'home':
                return (
                    <QuizHome
                        onModeSelect={handleModeSelect}
                        onFullTest={handleStartFullTest}
                        onDashboard={() => setScreen('dashboard')}
                    />
                );

            case 'moduleSelection':
                return (
                    <ModuleSelection
                        onBack={handleBack}
                        onSelectModule={handleModuleSelect}
                        quizMode={quizMode}
                        error={error}
                    />
                );

            case 'topics':
                return (
                    <TopicSelection
                        module={selectedModule}
                        onBack={handleBack}
                        onSelectTopic={handleTopicSelect}
                    />
                );

            case 'quizSetup':
                return (
                    <QuizSetup
                        selectedTopic={selectedTopic}
                        numQuestions={numQuestions}
                        setNumQuestions={setNumQuestions}
                        onBack={handleBack}
                        onStart={() => generateQuiz(numQuestions, selectedTopic)}
                    />
                );
            
            case 'instructions':
                return (
                    <InstructionsScreen
                        selectedTopic={selectedTopic}
                        questions={questions}
                        timeLeft={timeLeft}
                        onStart={() => {
                            setIsTimerRunning(true);
                            setScreen('quiz');
                        }}
                        onCancel={() => {
                            // Optional: clear current quiz state or just go back
                            setScreen('quizSetup');  // or 'topics' or 'home' as you prefer
                            setQuestions([]);        // reset questions
                            setQuestionStates([]);
                        }}
                    />
                );
            
            case 'questionPaper':
                return (
                    <QuestionPaper
                        questions={questions}
                        onBackToQuiz={() => setScreen('quiz')}
                    />
                );
                
            case 'dashboard':
                return (
                    <Dashboard
                        history={quizHistory}
                        onBack={handleBack}
                    />
                );

            case 'quiz':
                return (
                    <QuizScreen
                    questions={questions}
                    questionStates={questionStates}
                    currentQuestionIndex={currentQuestionIndex}
                    setCurrentQuestionIndex={setCurrentQuestionIndex}
                    quizMode={quizMode}
                    timeLeft={timeLeft}
                    handleAnswerSelect={handleAnswerSelect}
                    handleSaveAndNext={handleSaveAndNext}
                    handleToggleMark={handleToggleMark}
                    handleClearResponse={handleClearResponse}
                    setScreen={setScreen}
                    isAnalyzing={isAnalyzing}
                    analysisResults={analysisResults}
                    generateAnalysis={generateAnalysis}
                    practiceAnswered={practiceAnswered}
                    setPracticeAnswered={setPracticeAnswered}
                    goToNextQuestion={goToNextQuestion}
                    restartQuiz={restartQuiz}
                    />
                );
                
            case 'results':
                return (
                    <ResultScreen
                        selectedTopic={selectedTopic}
                        questions={questions}
                        questionStates={questionStates}
                        timeLeft={timeLeft}
                        restartQuiz={restartQuiz}
                        setScreen={setScreen}
                    />
                );

            default:
                return <p>Invalid screen</p>;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <Card>
                    {renderContent()}
                </Card>
                <footer className="text-center text-xs text-gray-400 mt-8">
                    UPSC Polity Quiz Generator | Powered by Gemini
                </footer>
            </div>
        </div>
    );
}