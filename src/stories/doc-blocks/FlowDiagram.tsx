import React from 'react';

interface FlowStep {
    id: string;
    title: string;
    description: string;
    code?: string;
}

interface FlowDiagramProps {
    title: string;
    description?: string;
    steps: FlowStep[];
}

export const FlowDiagram: React.FC<FlowDiagramProps> = ({ title, description, steps }) => {
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
                padding: '16px'
            }}>
                {steps.map((step, index) => (
                    <div key={step.id} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        padding: '16px',
                        marginBottom: index < steps.length - 1 ? '16px' : 0,
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        position: 'relative'
                    }}>
                        {index < steps.length - 1 && (
                            <div style={{
                                position: 'absolute',
                                left: '50%',
                                bottom: '-24px',
                                transform: 'translateX(-50%)',
                                color: '#9CA3AF',
                                fontSize: '20px'
                            }}>
                                ↓
                            </div>
                        )}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: '#3B82F6',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>
                                {index + 1}
                            </div>
                            <h4 style={{ margin: 0, color: '#111827' }}>{step.title}</h4>
                        </div>
                        <p style={{ margin: 0, color: '#4B5563' }}>{step.description}</p>
                        {step.code && (
                            <pre style={{
                                margin: 0,
                                padding: '12px',
                                background: '#1F2937',
                                borderRadius: '6px',
                                color: '#F9FAFB',
                                fontSize: '14px',
                                fontFamily: 'monospace',
                                lineHeight: '1.5',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                overflowX: 'auto'
                            }}>
                                <code>{step.code}</code>
                            </pre>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}; 