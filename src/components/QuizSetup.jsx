import React from 'react';
import Button from './Button';

export default function QuizSetup({ selectedTopic, numQuestions, setNumQuestions, onBack, onStart }) {
    return (
        <div>
            <button onClick={onBack} className="text-blue-600 hover:underline mb-4">&larr; Back to Topics</button>
            <h1 className="text-2xl font-bold text-gray-800">{selectedTopic}</h1>
            <p className="text-gray-500 mb-6">How many questions would you like to attempt?</p>

            <div className="mb-6">
                <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 mb-2">Number of Questions:</label>
                <input
                    type="number"
                    id="numQuestions"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Math.max(1, Math.min(20, parseInt(e.target.value, 10))))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    max="20"
                />
            </div>
            <Button onClick={onStart}>Start Quiz</Button>
        </div>
    );
}
