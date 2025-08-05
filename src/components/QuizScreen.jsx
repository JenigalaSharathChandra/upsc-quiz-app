import React from 'react';
import Timer from './Timer';
import Button from './Button';
import QuestionPalette from './QuestionPalette';

export default function QuizScreen({
  questions,
  questionStates,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  quizMode,
  timeLeft,
  handleAnswerSelect,
  handleSaveAndNext,
  handleToggleMark,
  handleClearResponse,
  setScreen,
  isAnalyzing,
  analysisResults,
  generateAnalysis,
  practiceAnswered,
  setPracticeAnswered,
  goToNextQuestion,
  restartQuiz
}) {
  if (questions.length === 0) return <p>No questions available.</p>;

  const currentQuestion = questions[currentQuestionIndex];
  const currentState = questionStates[currentQuestionIndex];
  const correctAnswerIndex = currentQuestion.answer;
  const isCorrect = currentState?.answer === correctAnswerIndex;

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setPracticeAnswered(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {quizMode === 'test' ? 'Quiz in Progress' : 'Practice Session'}
        </h2>
        {quizMode === 'test' ? (
          <>
            <button onClick={() => setScreen('questionPaper')} className="text-sm font-semibold text-blue-600 hover:underline">
              View Question Paper
            </button>
            <Timer seconds={timeLeft} />
          </>
        ) : (
          <p className="font-bold text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        )}
      </div>

      <QuestionPalette
        questions={questions}
        currentQuestionIndex={currentQuestionIndex}
        questionStates={questionStates}
        onSelectQuestion={setCurrentQuestionIndex}
        goToNextQuestion={() =>
          setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1))
        }
        goToPreviousQuestion={() =>
          setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
        }
      />

      <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
        <h3 className="font-bold text-lg mb-2">Question {currentQuestionIndex + 1}</h3>
        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
          {currentQuestion.question}
        </p>
      </div>

      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => {
          let optionClass = 'border-gray-300 hover:bg-gray-100';
          if (quizMode === 'practice') {
            if (practiceAnswered) {
              if (index === correctAnswerIndex) optionClass = 'bg-green-100 border-green-400';
              else if (index === currentState.answer) optionClass = 'bg-red-100 border-red-400';
            } else if (currentState.answer === index) {
              optionClass = 'border-blue-500 bg-blue-50';
            }
          }

          return (
            <div
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`flex items-center p-4 border-2 rounded-lg transition-colors ${
                quizMode === 'practice' && !practiceAnswered ? 'cursor-pointer' : ''
              } ${currentState.answer === index ? 'bg-blue-50 border-blue-500' : optionClass}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${
                currentState.answer === index ? 'bg-blue-500 text-white' : 'bg-gray-300'
              }`}>
                {String.fromCharCode(65 + index)}
              </span>
              <p className="text-gray-700">{option}</p>
            </div>
          );
        })}
      </div>

      {quizMode === 'test' ? (
        <>
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-3">
            <Button onClick={handleSaveAndNext} className="bg-blue-600 hover:bg-blue-700 lg:col-span-1">Save & Next</Button>
            <Button onClick={handleToggleMark} className="bg-purple-600 hover:bg-purple-700 lg:col-span-1">Mark for Review & Next</Button>
            <Button onClick={handleClearResponse} className="bg-gray-500 hover:bg-gray-600 lg:col-span-1">Clear Response</Button>
          </div>
          <div className="mt-4">
            <Button onClick={() => setScreen('results')} className="bg-red-600 hover:bg-red-700">Submit Quiz</Button>
          </div>
        </>
      ) : (
        <>
          {practiceAnswered && (
            <div className="mt-6">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <p className="font-bold text-yellow-800">Explanation:</p>
                <p className="text-yellow-900">{currentQuestion.explanation}</p>
              </div>

              <div className="mt-4">
                <button
                  onClick={() =>
                    generateAnalysis(
                      currentQuestionIndex,
                      currentQuestion.question,
                      currentQuestion.explanation,
                      currentQuestion.options[currentState.answer],
                      { text: currentQuestion.options[correctAnswerIndex] }
                    )
                  }
                  disabled={isAnalyzing[currentQuestionIndex]}
                  className="text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg px-3 py-1 disabled:bg-purple-300"
                >
                  {isAnalyzing[currentQuestionIndex]
                    ? 'Analyzing...'
                    : isCorrect
                    ? '✨ Simplify Explanation'
                    : '✨ Analyze My Mistake'}
                </button>

                {analysisResults[currentQuestionIndex] && (
                  <div className="mt-3 p-3 bg-purple-50 border-l-4 border-purple-400 rounded-r-lg">
                    <p className="font-bold text-purple-800">
                      {isCorrect ? 'Simplified Version:' : 'Personalized Analysis:'}
                    </p>
                    <p className="text-purple-900 whitespace-pre-wrap">
                      {analysisResults[currentQuestionIndex]}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="mt-8">
            {currentQuestionIndex < questions.length - 1 ? (
              <Button onClick={goToNextQuestion} disabled={!practiceAnswered}>
                Next Question
              </Button>
            ) : (
              <Button onClick={restartQuiz} disabled={!practiceAnswered} className="bg-green-600 hover:bg-green-700">
                Finish Practice
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
