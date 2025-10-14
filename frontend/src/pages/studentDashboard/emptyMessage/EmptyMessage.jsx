const EmptyMessage = () => {
    return (
        <div className='flex items-center justify-center flex-col h-[55vh] mt-3'>
            <p className="text-gray-500 text-lg">
                You haven’t enrolled in any courses yet.
            </p>
            <p className="text-gray-400 text-sm mt-2">
                Browse available courses and start learning today!
            </p>
        </div>
    );
};

export default EmptyMessage;