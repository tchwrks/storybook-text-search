import React from "react";


const __MOBILE_BREAKPOINT__: number = 500;

export interface ModalShortcutsProps {
    screenWidth: number;
}


const ModalShortcuts = ({ screenWidth }: ModalShortcutsProps) => {
    const isMobile: boolean = screenWidth < __MOBILE_BREAKPOINT__;

    return (
        <>
            {isMobile ? (
                undefined
            ) : (
                <ul
                    style={{
                        padding: 0,
                        margin: 0,
                        listStyle: "none",
                        fontSize: 12,
                        color: "#666",
                        display: "flex",
                        gap: 6
                    }}
                >
                    <li style={{ fontWeight: "bold" }}>Shortcuts:</li>
                    <li>ESC to close</li>
                    <li>|</li>
                    <li>↑↓ or Tab to navigate</li>
                    <li>|</li>
                    <li>↵ to open page</li>
                </ul>
            )}
        </>
    )
}

export default ModalShortcuts;