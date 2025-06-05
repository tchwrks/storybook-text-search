import React, { useEffect, useState } from "react";
import { CloseIcon } from "src/ui/icons/CloseIcon";

/**
 * Props for the IndexNotFound component
 */
export interface IndexNotFoundProps {
    /**
     * Function to call when the component is closed
     */
    onClose: () => void;
    /**
     * Duration of the progress bar animation
     */
    duration?: number;
    /**
     * Duration of the fade animation
     */
    fadeDuration?: number;
    /**
     * Header text (all caps)
     */
    header?: string;
    /**
     * Message text
     */
    message?: string;
}

/**
 * Component to display when the index is not found. Message can be overridden for general use
 * @param props - The props for the component
 * @param props.onClose - Function to call when the component is closed
 * @param props.duration - Duration of the progress bar animation
 * @param props.fadeDuration - Duration of the fade animation
 * @param props.header - Header text (all caps)
 * @param props.message - Message text
 * @returns The component
 */
const IndexNotFound = ({ onClose, duration = 5000, fadeDuration = 200, header = "storybook-search", message = "Index not found. Please try re-loading Storybook." }: IndexNotFoundProps) => {
    const progressDuration: number = duration / 1000;
    const [visible, setVisible] = useState<boolean>(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, fadeDuration);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, fadeDuration, onClose])

    return (
        <>
            <style>
                {`
                    @keyframes shrink-progress {
                        from {
                        transform: scaleX(1);
                        }
                        to {
                        transform: scaleX(0);
                        }
                    }

                    .fade-enter {
                        opacity: 0;
                        transform: translateY(-8px);
                    }

                    .fade-enter-active {
                        opacity: 1;
                        transform: translateY(0);
                        transition: opacity 0.2s ease-out, transform 0.2s ease-out;
                    }

                    .fade-exit {
                        opacity: 1;
                        transform: translateY(0);
                    }

                    .fade-exit-active {
                        opacity: 0;
                        transform: translateY(-8px);
                        transition: opacity 0.2s ease-in, transform 0.2s ease-in;
                    }
                `}
            </style>
            <div
                className={
                    visible
                        ? "fade-enter fade-enter-active"
                        : "fade-exit fade-exit-active"
                }
                style={{
                    position: "fixed",
                    zIndex: 9999,
                    top: 16,
                    right: 16,
                    background: "#220E05",
                    borderRadius: 4,
                    padding: 16,
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start",
                    fontSize: 14,
                    color: "#8C2C00",
                    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
                    transition: "all 0.2s ease-in-out",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        alignItems: "flex-start",
                    }}
                >
                    <span
                        style={{
                            textTransform: "uppercase",
                            fontSize: 10,
                            fontWeight: "bold",
                            color: "#D48663"
                        }}
                    >
                        {header}
                    </span>
                    <span
                        style={{
                            color: "#FF7130"
                        }}
                    >
                        {message}
                    </span>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        margin: 0,
                    }}
                >
                    <CloseIcon
                        style={{
                            width: 16,
                            height: 16,
                            color: "#FF7130"
                        }}
                    />
                </button>
                {/* Progress bar */}
                <div
                    style={{
                        height: 3,
                        background: "#FF7130",
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        transformOrigin: "left",
                        animation: `shrink-progress ${progressDuration}s linear forwards`,
                    }}
                />
            </div>
        </>
    )
}

export default IndexNotFound;