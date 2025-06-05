import React from 'react';

interface CodeExample {
    language: string;
    code: string;
    description: string;
}

interface CodeComparisonProps {
    title: string;
    description?: string;
    examples: CodeExample[];
}

export const CodeComparison: React.FC<CodeComparisonProps> = ({ title, description, examples }) => {
    return (
        <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            overflow: 'hidden'
        }}>
            <div style={{
                padding: '16px',
                background: '#f9fafb',
                borderBottom: '1px solid #e5e7eb'
            }}>
                <h3 style={{ margin: 0 }}>{title}</h3>
                {description && (
                    <p style={{ margin: '8px 0 0 0', color: '#6b7280' }}>{description}</p>
                )}
            </div>
            <div style={{
                display: 'grid',
                // Stack vertically on mobile, grid on larger screens
                gridTemplateColumns: 'minmax(0, 1fr)',
                gap: '16px',
                padding: '16px',
                background: 'white'
            }}>
                {examples.map((example, index) => (
                    <div key={index} style={{
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            padding: '12px',
                            background: '#f3f4f6',
                            borderBottom: '1px solid #e5e7eb'
                        }}>
                            <span style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                background: '#e5e7eb',
                                borderRadius: '4px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#374151'
                            }}>
                                {example.language}
                            </span>
                        </div>
                        <div style={{
                            padding: '16px'
                        }}>
                            <pre style={{
                                margin: 0,
                                padding: '16px',
                                background: '#1f2937',
                                borderRadius: '6px',
                                color: '#f9fafb',
                                fontSize: '14px',
                                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                                lineHeight: '1.5',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                overflowX: 'auto',
                                maxWidth: '100%'
                            }}>
                                <code>{example.code}</code>
                            </pre>
                            <p style={{
                                margin: '12px 0 0 0',
                                fontSize: '14px',
                                lineHeight: '1.5',
                                color: '#6b7280'
                            }}>
                                {example.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 