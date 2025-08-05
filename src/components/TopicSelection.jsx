import React from 'react';
import Button from './Button';

export default function TopicSelection({ module, onBack, onSelectTopic }) {
    return (
        <div>
            <button onClick={onBack} className="text-blue-600 hover:underline mb-4">&larr; Back to Modules</button>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Module {module.module}: {module.title}</h1>
            <p className="text-gray-500 mb-6">Select a specific topic or test the entire module.</p>

            <div className="mb-6">
                <Button 
                    onClick={() => onSelectTopic(`Module ${module.module} Test: ${module.title}`)}
                    className="bg-indigo-600 hover:bg-indigo-700"
                >
                    Start Module-wise Test
                </Button>
            </div>

            <ul className="space-y-3">
                {module.topics.map((topic, index) => (
                    <li key={index} onClick={() => onSelectTopic(topic)}
                        className="bg-gray-100 p-4 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer text-gray-700 font-medium">
                        {topic}
                    </li>
                ))}
            </ul>
        </div>
    );
}
