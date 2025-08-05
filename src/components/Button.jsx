export default function Button({ children, onClick, className = '', disabled = false }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${className} ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-400'}`}
        >
            {children}
        </button>
    );
}
