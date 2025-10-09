const ActionCard = ({ text, icon: Icon }) => {
    return (
        <div className="flex items-center gap-2 font-medium mt-3 container-border p-2 hover:bg-primary hover:text-white group cursor-pointer transition-all duration-100">
            <Icon className="text-[#333] group-hover:text-white w-4" />
            <h3 className="text-sm">{text}</h3>
        </div>
    );
};

export default ActionCard;