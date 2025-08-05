export default function Card({ children, className = '' }) {
    return (
        <div className={`bg-white rounded-xl shadow-lg p-6 sm:p-8 ${className}`}>
            {children}
        </div>
    );
}
