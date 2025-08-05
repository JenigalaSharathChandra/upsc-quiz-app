import React from 'react';
import Button from './Button';

export default function ResultScreen({ selectedTopic, questions, questionStates, timeLeft, restartQuiz, setScreen }) {
  const score = questionStates.filter((state, i) => state.answer === questions[i].answer).length;
  const totalTime = questions.length * 60;
  const timeTaken = totalTime - timeLeft;
  const minutesTaken = Math.floor(timeTaken / 60);
  const secondsTaken = timeTaken % 60;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Quiz Results</h1>
      <p className="text-center text-lg text-gray-600 mb-1">Topic: {selectedTopic}</p>
      <p className="text-center text-sm text-gray-500 mb-6">
        Time Taken: {String(minutesTaken).padStart(2, '0')}:{String(secondsTaken).padStart(2, '0')}
      </p>

      <div className="text-center bg-blue-100 p-6 rounded-xl mb-8 shadow">
        <p className="text-xl text-blue-800">You Scored</p>
        <p className="text-6xl font-bold text-blue-600">{score} / {questions.length}</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Review Answers</h2>

      <div className="space-y-6">
        {questions.map((q, index) => {
          const userAnswerIndex = questionStates[index].answer;
          const correctAnswerIndex = q.answer;
          const isCorrect = userAnswerIndex === correctAnswerIndex;

          return (
            <div key={index} className="border border-gray-300 rounded-lg p-4 shadow-sm">
              <p className="font-semibold text-gray-800 mb-2 whitespace-pre-wrap">
                Q{index + 1}: {q.question}
              </p>

              <div className="space-y-2 mb-3">
                {q.options.map((opt, optIndex) => {
                  const isUserAnswer = optIndex === userAnswerIndex;
                  const isCorrectAnswer = optIndex === correctAnswerIndex;

                  let bgColor = 'bg-gray-100';
                  if (isCorrectAnswer) bgColor = 'bg-green-100 border-green-400';
                  else if (isUserAnswer && !isCorrectAnswer) bgColor = 'bg-red-100 border-red-400';

                  return (
                    <div
                      key={optIndex}
                      className={`p-2 rounded border ${bgColor} flex justify-between items-center`}
                    >
                      <span>{opt}</span>
                      <div>
                        {isCorrectAnswer && <span className="text-green-600 font-bold ml-2">✓ Correct</span>}
                        {isUserAnswer && !isCorrectAnswer && (
                          <span className="text-red-600 font-bold ml-2">✗ Your Answer</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r">
                <p className="font-bold text-yellow-800 mb-1">Explanation:</p>
                <p className="text-yellow-900">{q.explanation}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 space-y-4 text-center">
        <Button onClick={restartQuiz} className="bg-blue-600 hover:bg-blue-700">
          🔁 Take Another Quiz
        </Button>
        <Button onClick={() => setScreen('dashboard')} className="bg-green-600 hover:bg-green-700">
          📊 View My Progress
        </Button>
      </div>
    </div>
  );
}
