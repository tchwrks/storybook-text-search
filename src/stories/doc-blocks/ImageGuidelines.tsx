import React from 'react';

interface ImageExample {
    url: string;
    caption: string;
    usage: string;
    principles: string[];
}

interface ImageGuidelinesProps {
    category: string;
    description: string;
    examples: ImageExample[];
}

export const ImageGuidelines: React.FC<ImageGuidelinesProps> = ({
    category,
    description,
    examples
}) => {
    return (
        <div style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>{category}</h3>
            <p style={{ marginBottom: '24px' }}>{description}</p>
            <div style={{ display: 'grid', gap: '32px' }}>
                {examples.map((example, index) => (
                    <div
                        key={index}
                        style={{
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            aspectRatio: '16/9',
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                            <img
                                src={example.url}
                                alt={example.caption}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                        <div style={{ padding: '16px' }}>
                            <h4 style={{
                                margin: '0 0 8px 0',
                                color: '#333'
                            }}>
                                {example.caption}
                            </h4>
                            <p style={{
                                margin: '0 0 12px 0',
                                color: '#666'
                            }}>
                                {example.usage}
                            </p>
                            <ul style={{
                                margin: 0,
                                paddingLeft: '20px',
                                color: '#444'
                            }}>
                                {example.principles.map((principle, i) => (
                                    <li key={i} style={{ marginBottom: '4px' }}>
                                        {principle}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 