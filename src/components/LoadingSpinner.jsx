export default function LoadingSpinner({ text = "Generating your UPSC-style quiz..." }) {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 my-10">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <p className="text-lg font-semibold text-gray-700">{text}</p>
            <p className="text-sm text-gray-500">This may take a moment. Please wait.</p>
        </div>
    );
}
