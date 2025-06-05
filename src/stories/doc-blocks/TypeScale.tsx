import React from 'react';

interface TypeToken {
    name: string;
    size: string;
    weight: string;
    lineHeight: string;
    sampleText?: string;
}

interface TypeScaleProps {
    tokens: TypeToken[];
}

export const TypeScale: React.FC<TypeScaleProps> = ({ tokens }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {tokens.map((token, index) => (
                <div key={index}>
                    <div style={{
                        fontSize: token.size,
                        fontWeight: token.weight,
                        lineHeight: token.lineHeight,
                        marginBottom: '8px'
                    }}>
                        {token.sampleText || "The quick brown fox jumps over the lazy dog"}
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: '24px',
                        fontSize: '14px',
                        color: '#666'
                    }}>
                        <code>{token.name}</code>
                        <span>{token.size} / {token.lineHeight}</span>
                        <span>Weight: {token.weight}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}; 