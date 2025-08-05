import React from 'react';
import { syllabus } from '../data/syllabus';

export default function ModuleSelection({ onBack, onSelectModule, quizMode, error }) {
    return (
        <div>
            <button onClick={onBack} className="text-blue-600 hover:underline mb-4">&larr; Back to Home</button>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">UPSC Polity Quiz</h1>
            <p className="text-center text-gray-500 mb-8">Select a module to begin your {quizMode} session.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {syllabus.map((mod) => (
                    <div key={mod.module} onClick={() => onSelectModule(mod)}
                        className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl hover:bg-blue-50 transition-all cursor-pointer border border-gray-200">
                        <p className="font-semibold text-blue-700">Module {mod.module}</p>
                        <h2 className="text-lg font-bold text-gray-800">{mod.title}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}
