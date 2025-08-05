import React from 'react';
import Button from './Button';

// InstructionsScreen.jsx
const InstructionsScreen = ({ selectedTopic, questions, timeLeft, onStart, onCancel }) => {
    if (!questions || questions.length === 0) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Test Instructions</h1>

            <div className="bg-gray-50 p-6 rounded-lg border space-y-4">
                <p><strong>Test Name:</strong> {selectedTopic}</p>
                <p><strong>Number of Questions:</strong> {questions.length}</p>
                <p><strong>Time Allotted:</strong> {Math.floor(timeLeft / 60)} minutes</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Each question has only one correct answer.</li>
                    <li>The timer will begin as soon as you click "Start Test".</li>
                    <li>You can use the Question Palette to navigate between questions.</li>
                    <li>Do not refresh the page during the test.</li>
                </ul>
            </div>

            <div className="mt-8 flex justify-between">
                <button
                    onClick={onCancel}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                    Cancel Test
                </button>
                <button
                    onClick={onStart}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                    Start Test
                </button>
            </div>
        </div>
    );
};

export default InstructionsScreen;

