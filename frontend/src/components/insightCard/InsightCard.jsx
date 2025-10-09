import './insightCard.css';

const InsightCard = ({ title, value, background, img }) => {
    return (
        <div className={`insight-card ${background} rounded-xl mb-3 lg:mb-0 w-full  md:w-[49%] lg:w-[32%] text-white p-10`}>
            <div className='flex items-center justify-between mb-6'>
                <h3 className='font-medium'>{title}</h3>
                <img src={img} alt="" className='w-5' />
            </div>
            <span className='text-3xl font-semibold'>{value}</span>
        </div>
    );
};

export default InsightCard;