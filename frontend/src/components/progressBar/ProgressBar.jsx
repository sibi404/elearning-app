const ProgressBar = ({ progressRate, height = 2 }) => {
    return (
        <div className={`progress-bar w-full bg-gray-400 h-${height} rounded-full mt-1 relative`}>
            <div
                className="progress absolute bg-primary h-full rounded-full"
                style={{ width: `${Math.round(progressRate)}%` }}>
            </div>
        </div>
    );
};

export default ProgressBar;