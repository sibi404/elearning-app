const EmptyMessage = ({ title, description }) => {
    return (
        <div className='flex items-center justify-center flex-col h-[55vh] mt-3'>
            <p className="text-gray-500 text-lg">
                {title}
            </p>
            <p className="text-gray-400 text-sm mt-2">
                {description}
            </p>
        </div>
    );
};

export default EmptyMessage;