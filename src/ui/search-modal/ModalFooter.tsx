import React from "react";
import { TechworksComboMark } from "src/ui/icons/TechworksComboMark";

export interface ModalFooterProps {
    screenWidth: number;
}

const __MOBILE_BREAKPOINT__: number = 500;

const ModalFooter = ({ screenWidth }: ModalFooterProps) => {
    const isMobile: boolean = screenWidth < __MOBILE_BREAKPOINT__;

    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center",
                justifyContent: isMobile ? "center" : "flex-start",
                fontSize: isMobile ? 10 : 12,
                color: "#888",
                gap: 8,
                marginTop: 16,
            }}
        >
            <a href="https://techworks.studio" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <span
                    style={{
                        display: "flex",
                        color: "#888",
                        alignItems: "center",
                        gap: 4,
                        cursor: "pointer"
                    }}
                >
                    Brought to you by
                    <TechworksComboMark height={isMobile ? 12 : 14} />
                </span>
            </a>
            {!isMobile && <span>|</span>}
            <a href="https://github.com/nextapps-de/flexsearch" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <span style={{ color: "#888" }}>Powered by FlexSearch</span>
            </a>
        </div>
    )
}

export default ModalFooter;