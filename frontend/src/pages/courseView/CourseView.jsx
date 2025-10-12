import './courseView.css';

import YouTube from "react-youtube";
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';

import { CircleCheckBig, ChevronLeft, Download, MessageSquare, Star } from "lucide-react";

import { Link } from "react-router-dom";

import LessonCard from "./LessonCard";
import ActionCard from "./ActionCard";
import NavTabs from '../../components/NavTabs/NavTabs';
import CourseOverview from './CourseOverview';
import CourseMaterials from './CourseMaterials';
import CourseAssignments from './CourseAssignments';
import Notes from './Notes';
import Discussion from './Discussion';
import Question from './question/Question';

const CourseView = () => {

    const [activeTab, setActiveTab] = useState(0);
    const playerRef = useRef(null);
    const containerRef = useRef(null);

    const lastTimeRef = useRef(0);
    const maxWatchedTimeRef = useRef(0);
    const totalWatchedRef = useRef(0);
    const animationRef = useRef(null);

    const [canProceed, setCanProceed] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [showQuestion, setShowQuestion] = useState(false);
    const [questions, setQuestions] = useState([
        { time: 10, question: "What is 2 + 2?", options: ["3", "4", "5"], answer: "4", answered: false },
        { time: 25, question: "Which planet is red?", options: ["Earth", "Mars", "Venus"], answer: "Mars", answered: false },
    ]);


    const questionMap = useMemo(() => {
        const map = new Map();
        questions.forEach(q => map.set(q.time, q));
        return map;
    }, [questions]);


    const checkForQuestion = useCallback((second) => {
        const q = questionMap.get(second);
        if (q && !q.answered) {
            playerRef.current.pauseVideo();
            playerRef.current.seekTo(second - 1);
            setCurrentQuestion(q);
            setShowQuestion(true);
        }
    }, [questions]);

    const onReady = (event) => {
        playerRef.current = event.target;
    };

    const onStateChange = (event) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
            trackProgress();
        } else {
            cancelAnimationFrame(animationRef.current);
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


    return (
        <div className="course-view flex">
            <div className="w-full lg:w-[75%] p-1 lg:p-5 lg:pr-0">
                <div className="video-wrapper w-full aspect-video relative">
                    <YouTube
                        videoId="I7DZP4rVQOU"
                        opts={{
                            width: "100%",
                            height: "100%",
                            playerVars: { autoplay: 0 }
                        }}
                        onReady={onReady}
                        onStateChange={onStateChange}
                        className="absolute top-0 left-0 w-full h-full "
                    />

                    {
                        showQuestion &&
                        <Question
                            question={currentQuestion}
                            setCurrentQuestion={setCurrentQuestion}
                            setShowQuestion={setShowQuestion}
                            setQuestions={setQuestions}
                            playerRef={playerRef}
                        />
                    }

                </div>
                <div className='px-2'>
                    <div className="flex items-center justify-between flex-col sm:flex-row mt-5">
                        <div className='w-full sm:w-auto'>
                            <h3 className="font-semibold text-text-black sm:text-xl">Lesson 1 <span className="font-normal">|</span> Fundamentals of Linux</h3>
                            <p className="text-faded-text text-xs lg:text-sm">by Sara Johnson</p>
                        </div>
                        <button
                            className="px-4 py-2 w-full sm:w-auto mt-2 sm:mt-0 rounded-md bg-primary text-sm font-medium text-white flex items-center justify-center gap-2 cursor-pointer">
                            Mark as complete
                            <CircleCheckBig className="w-4 font-medium" color="#ffffff" />
                        </button>
                    </div>
                </div>

                {/* NAVIGATION TABS */}
                <NavTabs
                    tabs={["Overview", "Materials", "Assignments", "Notes", "Discussion"]}
                    setActiveTab={setActiveTab}
                />
                <div className='px-5'>
                    {activeTab === 0 && (
                        <CourseOverview />
                    )}
                    {activeTab === 1 && (
                        <CourseMaterials />
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

            {/* SIDE PANEL */}
            <div className="ml-3 border-l border-l-gray-300 bg-white w-[25%] fixed lg:static right-0 translate-x-full  lg:translate-x-0 z-30">
                <div className="px-6 py-5 border-b border-b-gray-300">
                    <Link to="/student/courses">
                        <button className="px-2 py-1 text-xs text-primary border-1 border-primary rounded-sm flex items-center cursor-pointer">
                            <ChevronLeft className="text-primary w-4" />
                            Back to Course
                        </button>
                    </Link>
                    <h2 className="font-semibold text-md md:text-lg mt-4 ">Linux for Beginners</h2>
                    <div className="progress-bar w-full bg-gray-400 h-3 rounded-full mt-3 relative">
                        <div className="progress absolute bg-primary w-[20%] h-3 rounded-l-full"></div>
                    </div>
                    <p className="text-xs font-medium mt-2">20% Completed</p>
                </div>

                <div className="overflow-y-scroll h-[50vh]">
                    <LessonCard title={"Lesson 1 | Fundamentals of Linux"} activeLesson={true} completed={true} />
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} completed={true} />
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} completed={true} />
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} />
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} locked={true} />
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} locked={true} />
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} locked={true} />
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} locked={true} />
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} locked={true} />
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} locked={true} />
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} locked={true} />
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} locked={true} />
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} locked={true} />
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} locked={true} />
                </div>

                <div className="p-4 mt-5">
                    <h3 className="font-medium">Quick Actions</h3>
                    <ActionCard text="Download All Materials" icon={Download} />
                    <ActionCard text="Ask Instructor" icon={MessageSquare} />
                    <ActionCard text="Rate Course" icon={Star} />
                </div>
            </div>
        </div>
    );
};

export default CourseView;