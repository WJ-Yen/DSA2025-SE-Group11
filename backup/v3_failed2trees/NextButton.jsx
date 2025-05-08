export default function NextButton({ imgSrc, isActive, onClick }) {
    return (
        <div className="h-full w-full flex items-center justify-center p-2">
            {isActive ? (
                <button 
                    onClick={onClick} 
                    className="transition-transform transform hover:scale-110"
                >
                    <img 
                        src={imgSrc} 
                        alt="Next Icon" 
                        className="w-16 h-16 cursor-pointer" 
                    />
                </button>
            ) : (
                <img 
                    src={imgSrc} 
                    alt="Next Icon (disabled)" 
                    className="w-16 h-16 opacity-50" 
                />
            )}
        </div>
    );
}
