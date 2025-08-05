import React from 'react';
import Button from './Button';

export default function QuizHome({ onModeSelect, onFullTest, onDashboard }) {
    return (
        <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">UPSC Polity Prep</h1>
            <p className="text-lg text-gray-500 mb-10">Choose your preparation mode.</p>
            <div className="max-w-md mx-auto space-y-4">
                <Button onClick={() => onModeSelect('test')} className="bg-blue-600 hover:bg-blue-700">
                    Start Topic-wise Timed Test
                </Button>
                <Button onClick={() => onModeSelect('practice')} className="bg-teal-600 hover:bg-teal-700">
                    Start Topic-wise Practice
                </Button>
                <Button onClick={onFullTest} className="bg-red-600 hover:bg-red-700">
                    Take Full Length Test (150 Qs)
                </Button>
                <div className="mt-8">
                    <Button onClick={onDashboard} className="bg-green-600 hover:bg-green-700 focus:ring-green-400">
                        View My Progress
                    </Button>
                </div>
            </div>
        </div>
    );
}
