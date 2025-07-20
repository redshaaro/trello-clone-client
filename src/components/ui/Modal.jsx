import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import CLOUDS from 'vanta/dist/vanta.clouds.min';

const Modal = ({ isOpen, onClose, children }) => {
    const vantaRef = useRef(null);
    const [vantaEffect, setVantaEffect] = useState(null);

    useEffect(() => {
        if (isOpen && !vantaEffect) {
            setVantaEffect(
                CLOUDS({
                    el: vantaRef.current,
                    THREE,
                    mouseControls: true,
                    touchControls: true,
                    minHeight: 200.0,
                    minWidth: 200.0,
                    speed: 1.5,
                    skyColor: 0x0C66E4,      // Trello primary blue
                    cloudColor: 0xffffff,    // Classic white clouds
                    sunColor: 0xFDB813,      // Soft orange sun (for warmth)
                })
            );
        }

        return () => {
            if (vantaEffect) {
                vantaEffect.destroy();
                setVantaEffect(null);
            }
        };
    }, [isOpen, vantaEffect]);

    if (!isOpen) return null;

    return (
        <div
            ref={vantaRef}
            className="fixed inset-0 z-50 flex justify-center items-center"
        >
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative z-10">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                    ✖
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
