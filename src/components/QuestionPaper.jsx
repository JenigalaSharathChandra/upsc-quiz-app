import React from 'react';

export default function QuestionPaper({ questions, onBackToQuiz }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Question Paper</h1>
                <button
                    onClick={onBackToQuiz}
                    className="font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2"
                >
                    &larr; Back to Quiz
                </button>
            </div>

            <div className="space-y-8">
                {questions.map((q, index) => (
                    <div key={index} className="border-b pb-4">
                        <p className="font-bold mb-2">Question {index + 1}:</p>
                        <p className="whitespace-pre-wrap mb-3">{q.question}</p>
                        <div className="space-y-2 pl-4">
                            {q.options.map((opt, optIndex) => (
                                <p key={optIndex} className="text-gray-700">
                                    {String.fromCharCode(65 + optIndex)}. {opt}
                                </p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
