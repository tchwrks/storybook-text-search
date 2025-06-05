import React from 'react';

interface ColorToken {
    name: string;
    value: string;
    description?: string;
}

interface ColorPaletteProps {
    colors: ColorToken[];
    groupName: string;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ colors, groupName }) => {
    return (
        <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>{groupName}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {colors.map((color, index) => (
                    <div key={index} style={{
                        border: '1px solid #eee',
                        borderRadius: '8px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            height: '100px',
                            backgroundColor: color.value,
                            marginBottom: '8px'
                        }} />
                        <div style={{ padding: '12px' }}>
                            <div style={{ fontWeight: 'bold' }}>{color.name}</div>
                            <code style={{ fontSize: '14px' }}>{color.value}</code>
                            {color.description && (
                                <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                                    {color.description}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 