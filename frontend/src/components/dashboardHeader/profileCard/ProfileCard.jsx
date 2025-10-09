import defaultUser from '../../../assets/images/default-user.jpg';

const ProfileCard = ({ name }) => {
    return (
        <div className='flex items-center justify-between gap-3 bg-white px-3 py-1 rounded-lg text-sm border-1 border-border-gray'
            title='profile'
        >
            <img src={defaultUser} alt="" className='aspect-square w-6 md:w-10 rounded-full' />
            <span className='text-sm'>{name.firstName + " " + name.lastName}</span>
        </div>
    );
};


export default ProfileCard;