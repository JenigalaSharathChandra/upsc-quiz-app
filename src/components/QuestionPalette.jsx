const QuestionPalette = ({
  questions,
  currentQuestionIndex,
  questionStates,
  onSelectQuestion,
  goToNextQuestion,
  goToPreviousQuestion,
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="font-bold text-center text-lg mb-4">Question Palette</h3>
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Question Number Buttons */}
        <div className="flex flex-wrap gap-2">
          {questions.map((_, index) => {
            const state = questionStates[index];
            const isSelected = index === currentQuestionIndex;

            let bgColor = 'bg-gray-200';
            if (state.marked) bgColor = 'bg-purple-500';
            else if (state.answer !== null) bgColor = 'bg-green-500';
            else if (state.status === 'unanswered') bgColor = 'bg-red-500';

            return (
              <button
                key={index}
                onClick={() => onSelectQuestion(index)}
                className={`text-sm font-semibold text-gray-800 w-8 h-8 rounded border ${
                  isSelected ? 'border-2 border-blue-500' : 'border-gray-300'
                } ${bgColor}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        {/* Previous / Next Buttons */}
        <div className="flex gap-2">
          {goToPreviousQuestion && (
            <button
              onClick={goToPreviousQuestion}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
            >
              ← Prev
            </button>
          )}
          {goToNextQuestion && (
            <button
              onClick={goToNextQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionPalette;
