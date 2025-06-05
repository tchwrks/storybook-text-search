import React from 'react';

interface VoiceExampleProps {
    tone: string;
    description: string;
    original: string;
    branded: string;
}

interface VoiceComparisonProps {
    title: string;
    description: string;
    examples: VoiceExampleProps[];
}

export const VoiceExample: React.FC<VoiceComparisonProps> = ({
    title,
    description,
    examples
}) => {
    return (
        <div style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>{title}</h3>
            <p style={{ marginBottom: '24px' }}>{description}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
                            backgroundColor: '#f5f5f5',
                            padding: '12px 16px',
                            borderBottom: '1px solid #e0e0e0'
                        }}>
                            <h4 style={{ margin: 0, color: '#333' }}>{example.tone}</h4>
                            <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
                                {example.description}
                            </p>
                        </div>
                        <div style={{ padding: '16px', display: 'grid', gap: '16px' }}>
                            <div>
                                <div style={{
                                    fontSize: '14px',
                                    color: '#666',
                                    marginBottom: '4px'
                                }}>
                                    Original
                                </div>
                                <div style={{
                                    padding: '12px',
                                    backgroundColor: '#f8f8f8',
                                    borderRadius: '4px',
                                    fontFamily: 'monospace'
                                }}>
                                    {example.original}
                                </div>
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '14px',
                                    color: '#666',
                                    marginBottom: '4px'
                                }}>
                                    Our Voice
                                </div>
                                <div style={{
                                    padding: '12px',
                                    backgroundColor: '#f0f7ff',
                                    borderRadius: '4px',
                                    fontFamily: 'monospace',
                                    color: '#0066cc'
                                }}>
                                    {example.branded}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 