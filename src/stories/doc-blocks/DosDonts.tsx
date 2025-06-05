import React from 'react';

interface Example {
    title: string;
    description: string;
    code?: string;
    image?: string;
}

interface DosDontsProps {
    dos: Example[];
    donts: Example[];
}

export const DosDonts: React.FC<DosDontsProps> = ({ dos, donts }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            width: '100%'
        }}>
            <div>
                <h3 style={{ color: '#22C55E', marginBottom: '16px' }}>✓ Do</h3>
                {dos.map((example, index) => (
                    <div key={index} style={{
                        border: '1px solid #22C55E',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '16px',
                    }}>
                        <h4 style={{ margin: '0 0 8px 0' }}>{example.title}</h4>
                        <p style={{ margin: '0 0 12px 0' }}>{example.description}</p>
                        {example.image && (
                            <img
                                src={example.image}
                                alt={example.title}
                                style={{ maxWidth: '100%', marginBottom: '12px' }}
                            />
                        )}
                        {example.code && (
                            <div style={{
                                background: '#f5f5f5',
                                borderRadius: '4px',
                                padding: '12px',
                            }}>
                                <pre style={{
                                    margin: 0,
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-all',
                                    fontSize: '14px',
                                    fontFamily: 'monospace',
                                }}>
                                    <code>{example.code}</code>
                                </pre>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div>
                <h3 style={{ color: '#EF4444', marginBottom: '16px' }}>✗ Don't</h3>
                {donts.map((example, index) => (
                    <div key={index} style={{
                        border: '1px solid #EF4444',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '16px',
                    }}>
                        <h4 style={{ margin: '0 0 8px 0' }}>{example.title}</h4>
                        <p style={{ margin: '0 0 12px 0' }}>{example.description}</p>
                        {example.image && (
                            <img
                                src={example.image}
                                alt={example.title}
                                style={{ maxWidth: '100%', marginBottom: '12px' }}
                            />
                        )}
                        {example.code && (
                            <div style={{
                                background: '#f5f5f5',
                                borderRadius: '4px',
                                padding: '12px',
                            }}>
                                <pre style={{
                                    margin: 0,
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-all',
                                    fontSize: '14px',
                                    fontFamily: 'monospace',
                                }}>
                                    <code>{example.code}</code>
                                </pre>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}; 