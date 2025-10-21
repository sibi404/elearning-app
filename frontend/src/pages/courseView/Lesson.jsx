import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import YouTube from "react-youtube";
import { Toast } from "primereact/toast";

import { CircleCheckBig, UserPen } from "lucide-react";

import NavTabs from "../../components/NavTabs/NavTabs";
import CourseOverview from './CourseOverview';
import CourseMaterials from './CourseMaterials';
import CourseAssignments from './CourseAssignments';
import Notes from './Notes';
import Discussion from './Discussion';
import Question from './question/Question';
import { useParams } from "react-router-dom";
import { usePrivateApi } from "../../hooks/usePrivateApi";

const Lesson = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [showQuestion, setShowQuestion] = useState(false);
    const [canProceed, setCanProceed] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [lessonDetails, setLessonDetails] = useState();

    const playerRef = useRef(null);
    const containerRef = useRef(null);
    const lastTimeRef = useRef(0);
    const maxWatchedTimeRef = useRef(0);
    const totalWatchedRef = useRef(0);
    const animationRef = useRef(null);
    const toast = useRef(null);

    const { lessonSlug } = useParams();
    const api = usePrivateApi();

    const [questions, setQuestions] = useState();

    const questionMap = useMemo(() => {
        const map = new Map();
        questions?.forEach(q => map.set(q.time, q));
        return map;
    }, [questions]);

    const onReady = (event) => {
        playerRef.current = event.target;
    };

    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Network Error', detail: 'Check your inernet connection', life: 3000 });
    };

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Correct', detail: 'Answer saved', life: 3000 });
    }

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
        const watchedPercent = (Math.min(totalWatchedRef.current, duration) / duration) * 100;
        // console.log("Watched:", watchedPercent.toFixed(2) + "%");

        if (watchedPercent >= 90 && !canProceed) {
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
            } catch (err) {
                console.log(err);
            }
        };

        getLessonDetails();
    }, [lessonSlug]);

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
                        showError={showError}
                        showSuccess={showSuccess}
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