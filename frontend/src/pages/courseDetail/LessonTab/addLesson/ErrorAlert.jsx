import { X } from "lucide-react";

const ErrorAlert = ({ colseFunction, error }) => {
    return (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3 shadow-md animate-shake">
            <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-sm font-bold">!</span>
            </div>
            <div className="flex-1">
                <p className="text-red-800 font-semibold mb-1">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button
                type="button"
                onClick={colseFunction}
                className="text-red-400 hover:text-red-600 transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    )
};

export default ErrorAlert;