import React from 'react';

export default function Dashboard({ history, onBack }) {
    return (
        <div>
            <button onClick={onBack} className="text-blue-600 hover:underline mb-4">&larr; Back to Home</button>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Quiz History</h1>
            {history.length === 0 ? (
                <p className="text-center text-gray-500 p-8 bg-gray-50 rounded-lg">
                    You haven't completed any quizzes yet. Take a quiz to see your progress here!
                </p>
            ) : (
                <ul className="space-y-4">
                    {history.slice().reverse().map((h, i) => (
                        <li key={i} className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-lg text-gray-800">{h.topic}</p>
                                    <p className="text-sm text-gray-500">Taken on: {new Date(h.date).toLocaleString()}</p>
                                </div>
                                <p className={`font-bold text-xl px-3 py-1 rounded-md ${h.score / h.total >= 0.5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {h.score} / {h.total}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
