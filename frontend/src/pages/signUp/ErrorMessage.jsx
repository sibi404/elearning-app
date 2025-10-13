import { TriangleAlert } from "lucide-react";

const ErrorMessage = ({ message }) => {
    return (
        <p className='text-xs px-2 font-medium text-red-500 flex items-center gap-1'>
            <TriangleAlert className='w-3' />
            {message}
        </p>
    );
};


export default ErrorMessage;