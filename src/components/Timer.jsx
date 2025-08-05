export default function Timer({ seconds }) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return (
        <div className="text-lg font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">
            Time Left: {String(minutes).padStart(2, '0')}:{String(remainingSeconds).padStart(2, '0')}
        </div>
    );
}
