import defaultUser from '../../../assets/images/default-user.jpg';

import { Mail, Phone, CalendarDays, MapPin } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

import ProfileInfoCard from '../../../components/profileInfoCard/ProfileInfoCard';

const Profile = () => {
    const { userData } = useOutletContext();
    return (
        <div className="bg-white m-3 md:m-10 h-[70vh] p-2 sm:p-5 container-border">
            <div className='p-5 flex items-center justify-start gap-5 sm:gap-8 md:gap-16'>
                <div><img src={defaultUser} alt="" className='rounded-full aspect-square w-32 sm:w-52 md:w-60' /></div>
                <div><h3 className='text-sm sm:text-xl md:text-3xl font-semibold'>{`${userData.first_name} ${userData.last_name}`}</h3>
                    <p className='mt-1 text-xs sm:text-base'>ID: IN2024-001</p>
                </div>
            </div>
            <div className="container-border p-3 sm:p-5">
                <h3 className='font-semibold'>Personal Information</h3>
                <div className='flex items-center justify-between flex-wrap'>
                    <ProfileInfoCard icon={Mail} title={"Email"} detail={userData.email} />
                    <ProfileInfoCard icon={Phone} title={"Phone"} detail={`${userData.phone_number ? userData.phone_number : "-"}`} />
                    <ProfileInfoCard icon={CalendarDays} title={"Enrollment Date"} detail={userData.dateJoined} />
                    <ProfileInfoCard icon={MapPin} title={"Address"} detail={"Kozhikode, Kerala"} />

                </div>
            </div>
        </div>
    );
};

export default Profile;