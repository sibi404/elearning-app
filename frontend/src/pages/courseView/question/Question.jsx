import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Question = ({ question, setCurrentQuestion, setShowQuestion, setQuestions, playerRef }) => {
    const [isWrong, setIsWrong] = useState(false);

    const handleCorrectAnswer = useCallback(() => {
        setQuestions(prev =>
            prev.map(q => q.time === question.time ? { ...q, answered: true } : q)
        );
        setCurrentQuestion(null);
        setShowQuestion(false);
        playerRef.current?.playVideo();
    }, [setQuestions, question.time, setCurrentQuestion, setShowQuestion, playerRef]);

    const handleAnswer = useCallback((option) => {
        if (option === question.answer) handleCorrectAnswer();
        else setIsWrong(true);
    }, [handleCorrectAnswer, question.answer]);

    const handleRewatch = useCallback(() => {
        setShowQuestion(false);
        const seekTime = Math.max(question.time - 10, 0);
        playerRef.current?.seekTo(seekTime, true);
    }, [setShowQuestion, question.time, playerRef]);

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50">
            <AnimatePresence mode="wait">
                <motion.div
                    key={isWrong ? "wrong" : "question"}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="relative w-[80%] md:w-[60%] bg-gradient-to-br from-white to-gray-100 
                     rounded-2xl shadow-2xl border border-gray-200 p-2 md:p-8 text-center"
                >
                    <h2 className="text-md md:text-2xl font-semibold mb-1 md:mb-4 text-gray-800 ">
                        {isWrong ? "Incorrect Answer" : "Quiz Question"}
                    </h2>

                    {isWrong ? (
                        <>
                            <p className="text-gray-600 mb-6 text-xs md:text-base">
                                Oops! That’s not right. Please rewatch the video before trying again.
                            </p>
                            <button
                                onClick={handleRewatch}
                                className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-xl 
                           font-semibold text-xs  md:text-sm hover:opacity-90 transition-opacity cursor-pointer"
                            >
                                Rewatch
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-sm md:text-lg font-medium text-gray-700 mb-3 md:mb-6">
                                {question.question}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {question.options.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleAnswer(option)}
                                        className="py-1 md:py-3 px-5 border border-gray-300  rounded-xl text-gray-700
                               bg-white/70 hover:bg-blue-100
                               transition-all duration-200 font-medium shadow-sm hover:shadow-md text-xs md:text-base"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Question;
