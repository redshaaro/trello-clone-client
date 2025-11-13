 

const SimpleModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            {/* Subtle blur overlay (no grayscale) */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-[2px]"
                onClick={onClose}
            />

            {/* Modal card */}
            <div className="relative z-10 bg-white rounded-lg shadow-md p-4 sm:p-6 w-full max-w-[95vw] sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
                {children}
            </div>
        </div>
    );
};

export default SimpleModal;