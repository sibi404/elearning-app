import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import YouTube from "react-youtube";
import { Toast } from "primereact/toast";
import { ClipboardList, BookText, MessagesSquare, NotebookPen, BrainCircuit, CircleCheckBig } from "lucide-react";

import NavTabs from "../../components/NavTabs/NavTabs";
import CourseOverview from './CourseOverview';
import CourseMaterials from './CourseMaterials';
import CourseAssignments from './CourseAssignments';
import Notes from './Notes';
import Discussion from './Discussion';
import Question from './question/Question';

import { usePrivateApi } from "../../hooks/usePrivateApi";
import { showNetworkError } from "../../utils/toast/toastFunctions";

const Lesson = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [showQuestion, setShowQuestion] = useState(false);
    const [canProceed, setCanProceed] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [lessonDetails, setLessonDetails] = useState();

    const playerRef = useRef(null);
    const lastTimeRef = useRef(0);
    const maxWatchedTimeRef = useRef(0);
    const totalWatchedRef = useRef(0);
    const animationRef = useRef(null);
    const watchedPercentRef = useRef(0);
    const lastSentPercentRef = useRef(0);
    const playerReadyRef = useRef(false);
    const toast = useRef(null);

    const { lessonSlug } = useParams();
    const api = usePrivateApi();

    const [questions, setQuestions] = useState();

    const questionMap = useMemo(() => {
        const map = new Map();
        questions?.forEach(q => map.set(q.time, q));
        return map;
    }, [questions]);


    const updateProgress = async () => {
        if (!lessonDetails?.id) return false;
        try {
            const response = await api.post(`course/update-progress/${lessonDetails.id}/`, {
                time: maxWatchedTimeRef.current.toFixed(1)
            });
            console.log(response.data.message);
            return true;
        } catch (err) {
            console.log(err);
            if (err.request && !err.response) {
                showNetworkError(toast);
            }
            return false;
        }
    };

    const seekToLastWatched = () => {
        if (!playerRef.current || !playerReadyRef.current || !lessonDetails?.progress?.time) return;

        const startTime = lessonDetails.progress.time;
        const duration = playerRef.current.getDuration();

        if (startTime > 0 && startTime < duration - 5) {
            playerRef.current.seekTo(startTime, true);
        }
    };

    const onReady = (event) => {
        playerRef.current = event.target;
        playerReadyRef.current = true;
        seekToLastWatched();

    };

    const checkForQuestion = useCallback((second) => {
        const q = questionMap.get(second);
        if (q && !q.answered) {
            playerRef.current.pauseVideo();
            playerRef.current.seekTo(second - 1);
            setCurrentQuestion(q);
            setShowQuestion(true);
        }
    }, [questionMap]);

    const onStateChange = (event) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
            if (!animationRef.current) {
                trackProgress();
            }
        } else {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
    };

    const trackProgress = () => {
        if (!playerRef.current) return;

        const player = playerRef.current;
        const current = player.getCurrentTime();
        const duration = player.getDuration();
        const last = lastTimeRef.current;

        const second = Math.floor(current);
        checkForQuestion(second);

        // Check if the last time is greater than 0 to prevent false positives at the start.
        if (last > 0 && current > last + 2 && current > maxWatchedTimeRef.current + 5) {
            console.log("Manual skip detected → rewinding to", maxWatchedTimeRef.current);
            player.seekTo(maxWatchedTimeRef.current, true);
            return;
        }

        // Update max watched time in the ref
        if (current > maxWatchedTimeRef.current) {
            maxWatchedTimeRef.current = current;
            totalWatchedRef.current += current - last;
        }

        // Update the last time
        lastTimeRef.current = current;

        // Calculate progress and update state for the UI
        watchedPercentRef.current = (Math.min(totalWatchedRef.current, duration) / duration) * 100;

        if (watchedPercentRef.current - lastSentPercentRef.current >= 5 ||
            watchedPercentRef.current >= 95) {

            updateProgress();
            lastSentPercentRef.current = watchedPercentRef.current;
        }


        if (watchedPercentRef >= 90 && !canProceed) {
            setCanProceed(true);
        }
        animationRef.current = requestAnimationFrame(trackProgress);
    };

    //for getting lesson details
    useEffect(() => {
        const getLessonDetails = async () => {
            try {
                const response = await api.get(`course/lesson-details/${lessonSlug}/`);
                setLessonDetails(response.data.lessonDetails);
                setQuestions(response.data.lessonQuestions);
                const progress = response.data.lessonDetails.progress?.time || 0;
                maxWatchedTimeRef.current = progress;
                totalWatchedRef.current = progress;
            } catch (err) {
                console.log(err);
            }
        };

        getLessonDetails();
    }, [lessonSlug]);

    useEffect(() => {
        if (playerReadyRef.current && lessonDetails?.progress?.time) {
            seekToLastWatched();
        }
    }, [lessonDetails]);

    useEffect(() => {
        return () => cancelAnimationFrame(animationRef.current);
    }, []);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && playerRef.current) {
                playerRef.current.pauseVideo();
            }
        };

        const handleBlur = () => {
            if (playerRef.current) playerRef.current.pauseVideo();
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);

        return () => {
            window.removeEventListener("blur", handleBlur);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);


    if (!lessonDetails) return <div className="w-full h-full flex items-center justify-center"><h1 className="text-2xl">Loading...</h1></div>


    return (
        <div className="w-full lg:w-[75%] p-1 lg:p-5 lg:pr-0">
            <Toast ref={toast} />
            <div className="video-wrapper w-full aspect-video relative rounded-lg overflow-hidden">
                <YouTube
                    key={lessonDetails.video_id}
                    videoId={lessonDetails.video_id}
                    opts={{
                        width: "100%",
                        height: "100%",
                        playerVars: {
                            autoplay: 0,
                            modestbranding: 1,
                            rel: 0,
                        }
                    }}
                    onReady={onReady}
                    onStateChange={onStateChange}
                    className="absolute top-0 left-0 w-full h-full"
                />

                {
                    showQuestion &&
                    <Question
                        question={currentQuestion}
                        setCurrentQuestion={setCurrentQuestion}
                        setShowQuestion={setShowQuestion}
                        setQuestions={setQuestions}
                        playerRef={playerRef}
                        toast={toast}
                    />
                }

            </div>
            <div className='px-2'>
                <div className="flex items-center justify-between flex-col sm:flex-row gap-2 mt-5">
                    <div className='w-full sm:w-auto'>
                        <h3 className="font-semibold text-text-black sm:text-base lg:text-xl">{lessonDetails.title}</h3>
                        <p className="text-faded-text text-xs lg:text-sm">by teacher name here</p>
                    </div>
                    <button
                        className="px-4 py-2 w-full sm:w-auto mt-2 sm:mt-0 rounded-md bg-primary text-sm font-medium text-white flex items-center justify-center gap-2 cursor-pointer">
                        Mark as complete
                        <CircleCheckBig className="w-4 font-medium" color="#ffffff" />
                    </button>
                </div>
            </div>


            <NavTabs
                tabs={["Overview", "Materials", "Assignments", "Notes", "Discussion"]}
                icons={[ClipboardList, BookText, MessagesSquare, NotebookPen, BrainCircuit]}
                setActiveTab={setActiveTab}
            />
            <div className='px-5'>
                {activeTab === 0 && (
                    <CourseOverview about={lessonDetails.about} />
                )}
                {activeTab === 1 && (
                    <CourseMaterials lessonId={lessonDetails.id} />
                )}

                {activeTab === 2 && (
                    <CourseAssignments />
                )}

                {activeTab === 3 && (
                    <Notes />
                )}

                {activeTab === 4 && (
                    <Discussion />
                )}
            </div>

        </div>
    );
};

export default Lesson;