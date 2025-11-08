import { ChevronLeft } from "lucide-react"

const BackButton = ({ text }) => {
    return (
        <button className="px-2 py-1 text-xs text-primary border-1 border-primary rounded-sm flex items-center cursor-pointer">
            <ChevronLeft className="text-primary w-4" />
            {text}
        </button>
    );
};

export default BackButton;