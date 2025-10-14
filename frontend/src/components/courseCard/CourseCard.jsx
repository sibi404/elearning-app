import './courseCard.css';

// import thumbnail from '../../assets/images/thumbnail.png';
import star from '../../assets/images/star.png';

import { Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';


const CourseCard = ({ title, teacher, description, duration, thumbnail }) => {
    return (
        <div className="course-card mt-3 container-border max-h-[430px] w-full lg:w-[32%] overflow-hidden transition-all duration-100">
            <div className='relative'>
                <div className='card-overlay opacity-0 absolute w-full h-full bg-gray-600/50 flex items-center justify-center transition-all duration-500'>
                    <Link to="courses/1" className='continue-button py-3 px-6 rounded-lg text-white cursor-pointer'>Continue Learning</Link>
                </div>
                <img src={thumbnail} alt="" className='' />
            </div>
            <div className='px-5 py-4'>
                <h2 className='font-semibold text-lg text-text-black'>{title}</h2>
                <p className='text-faded-text text-sm py-2'>by {teacher}</p>
                <p className='text-faded-text text-sm line-clamp-3'>
                    {description}
                </p>

                <div className='py-3 text-faded-text text-sm flex justify-start gap-5'>
                    <p className='flex items-center gap-1'><Clock size={14} />{duration} hours</p>
                    <p className='flex items-center gap-1'><Users size={14} />120</p>
                    <p className='flex items-center gap-1'><img src={star} alt="" className='w-4' /> 4.4</p>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;