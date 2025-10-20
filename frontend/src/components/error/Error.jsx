const Error = ({ message }) => {
    return (
        <div className="h-full w-full flex flex-col justify-center items-center">
            <h1 className="text-2xl font-semibold">Error!!</h1>
            <p>{message}</p>
        </div>
    );
};

export default Error;