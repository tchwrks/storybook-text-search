import React from 'react';

interface SpacingToken {
    name: string;
    value: string;
    pixels: number;
}

interface SpacingScaleProps {
    tokens: SpacingToken[];
}

export const SpacingScale: React.FC<SpacingScaleProps> = ({ tokens }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {tokens.map((token, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ minWidth: '100px' }}>
                        <div style={{ fontWeight: 'bold' }}>{token.name}</div>
                        <code style={{ fontSize: '14px' }}>{token.value}</code>
                    </div>
                    <div style={{
                        width: `${token.pixels}px`,
                        height: '24px',
                        backgroundColor: '#0066CC',
                        borderRadius: '4px'
                    }} />
                    <div style={{ color: '#666' }}>{token.pixels}px</div>
                </div>
            ))}
        </div>
    );
}; 