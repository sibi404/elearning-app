import sampleProfile from '../../../assets/images/sample-profile.jpg';

import ProgressBar from '../../../components/progressBar/ProgressBar';

const StudentOverViewCard = ({ name, email, progress, totalAssignment, assignmentSubmitted }) => {
    const assignmentProgressRate = totalAssignment > 0
        ? ((assignmentSubmitted / totalAssignment) * 100).toFixed(1) : 0

    return (
        <div className="container-border p-6 mt-3">
            <div className='flex items-center gap-5'>
                <div>
                    <img src={sampleProfile} alt="" className='aspect-square object-cover rounded-full w-12' />
                </div>
                <div>
                    <h5 className=' font-semibold'>{name}</h5>
                    <p className='text-sm text-faded-text'>{email}</p>
                    <p className='text-xs text-faded-text'>Last active : 2 hours ago</p>
                </div>
            </div>

            <div className='mt-3 flex items-center justify-between'>
                <ProgressItem label={"Progress"} value={`${progress}%`} progressRate={progress} />
                <ProgressItem label={"Assignment"} value={`${assignmentSubmitted}/${totalAssignment}`} progressRate={assignmentProgressRate} />
            </div>

        </div>
    );
};


const ProgressItem = ({ label, value, progressRate }) => {
    return (
        <div className='w-[49%]'>
            <div className='flex items-center justify-between'>
                <span className='text-xs uppercase'>{label}</span>
                <span className='text-xs uppercase font-bold'>{value}</span>
            </div>
            <ProgressBar progressRate={progressRate} />
        </div>
    )
};

export default StudentOverViewCard;