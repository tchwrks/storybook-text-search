import { FocusTrap } from "focus-trap-react";
import React from "react";

export interface ModalBackdropProps {
    isOpen: boolean;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    children: React.ReactNode;
}

const ModalBackdrop = ({ isOpen, onClick, children }: ModalBackdropProps) => {
    return (
        <FocusTrap active={isOpen}>
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    background: `rgba(0,0,0,${isOpen ? 0.4 : 0})`,
                    backdropFilter: `blur(${isOpen ? 8 : 0}px)`,
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "start",
                    justifyContent: "center",
                    padding: 24,
                    transition: "all 0.15s ease-in-out",
                    opacity: isOpen ? 1 : 0,
                    transform: `translateY(${isOpen ? 0 : -8}px)`,
                }}
                onClick={onClick}
            >
                {children}
            </div>
        </FocusTrap>
    )
}

export default ModalBackdrop;