import React from "react";

export interface ModalTriggerProps {
    text?: string;
    onClick: () => void;
}

const ModalTrigger = ({ text = "Find MDX text", onClick }: ModalTriggerProps) => {
    return (
        <button
            onClick={onClick}
            style={{
                position: "relative",
                display: "inline-block",
                fontFamily: "inherit",
                cursor: "pointer",
                borderRadius: 4,
                border: "1px solid #ccc",
                padding: "4px 8px",
                paddingRight: "48px",
                fontSize: 12,
                height: 28,
                background: "#fff",
                color: "#999",
            }}
        >
            <span
                style={{
                    fontSize: 12,
                }}
            >
                {text}
            </span>
            <span
                style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 11,
                    background: "transparent",
                    color: "#999",
                    fontFamily: "monospace",
                    pointerEvents: "none",
                }}
            >
                ⇧⌘K
            </span>
        </button>
    )
}

export default ModalTrigger;