import { Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { usePrivateApi } from '../../../../hooks/usePrivateApi';

const AnnoucementModal = ({ onClose }) => {
    const textInputStye = "container-border px-4 py-2 placeholder:text-sm placeholder:font-light outline-none";
    const inputGroupStyle = "flex flex-col mt-5";
    const [courses, setCourses] = useState([]);
    const [announcement, setAnnouncement] = useState({ course: "", title: "", content: "" });
    const [partialData, setPartialData] = useState(false);

    const api = usePrivateApi();

    const modalRef = useRef();

    const closeModal = (e) => {
        if (e.type !== "click") return;
        if (modalRef.current === e.target) {
            onClose();
        }
    }

    const submitData = async () => {
        try {
            const { status } = await api.post("course/add-course-announcement/", announcement);
            if (status === 201) {
                setAnnouncement({ course: "", title: "", content: "" });
                onClose();
            }
        } catch (err) {
            console.log(err)
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!announcement.course || !announcement.title || !announcement.content) {
            setPartialData(true);
            return;
        } else {
            setPartialData(false);
        }
        submitData();
        console.log(announcement);
    }

    useEffect(() => {
        const getCourses = async () => {
            try {
                const { data } = await api.get("course/teaching-courses/");
                setCourses(data);
            } catch (err) {
                console.log(err);
            }
        }
        getCourses();
        setPartialData(false);
    }, []);

    return (
        <div ref={modalRef} onClick={closeModal} className="fixed inset-0 h-screen w-full bg-black/50 bg-opacity-50 z-50 flex items-center justify-center">
            <div onClick={(e) => e.stopPropagation()} className="bg-white p-10 w-[90%] md:w-1/2 rounded-md">
                <div className='flex items-center justify-between'>
                    <h2 className="text-sm md:text-md lg:text-lg text-text-black font-medium">Send Announcement</h2>
                    <button className="cursor-pointer" onClick={onClose}>
                        <X />
                    </button>
                </div>
                <p className="text-xs md:text-sm text-faded-text font-light">Send announcement to all students in course</p>
                <form
                    onSubmit={handleSubmit}
                    className="mt-5">
                    <SelectInput label="Course" options={courses} announcement={announcement} setAnnouncement={setAnnouncement} />
                    <div className={inputGroupStyle}>
                        <label htmlFor="title">Title</label>
                        <input
                            onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
                            value={announcement.title}
                            type="text"
                            name="title"
                            className={textInputStye}
                            placeholder="eg: New notes added" />
                    </div>
                    <div className={inputGroupStyle}>
                        <label htmlFor="message">Message</label>
                        <input
                            onChange={(e) => setAnnouncement({ ...announcement, content: e.target.value })}
                            value={announcement.content}
                            type="text"
                            name="message"
                            className={textInputStye}
                            placeholder="Write you announcement message here..." />
                    </div>
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-3 mt-10 text-sm">
                        <button
                            type='button'
                            className="order-2 lg:order-1 w-full px-5 py-3 rounded-md border cursor-pointer"
                            onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type='submit'
                            // onClick={(e) => handleSubmit(e)}
                            className="order-1 lg:order-2 w-full px-5 py-3 rounded-md bg-primary text-white cursor-pointer flex items-center justify-center gap-5">
                            <Send size={20} /> Send Announcement
                        </button>
                    </div>
                </form>
                {partialData &&
                    <p className='text-center mt-4 text-xs text-red-500'>Please fill all fields!</p>
                }
            </div>
        </div>
    );
};

export default AnnoucementModal;


const SelectInput = ({ label, options, announcement, setAnnouncement }) => {
    return (
        <div className="flex flex-col">
            <label htmlFor={label} className="text-text-black text-sm">{label}</label>
            <select
                onChange={(e) => setAnnouncement({ ...announcement, course: parseInt(e.target.value) })}
                value={announcement.course}
                name={label}
                className="w-full px-4 py-2 container-border rounded-md text-sm font-light ">
                <option value="" disabled>Select a course</option>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>{option.title}</option>
                ))}
            </select>
        </div>
    )
};