import React from 'react';

interface APIParam {
    name: string;
    type: string;
    required: boolean;
    description: string;
}

interface APIResponse {
    status: number;
    description: string;
    example: string;
}

interface APIEndpointProps {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
    description: string;
    parameters?: APIParam[];
    responses: APIResponse[];
}

export const APIEndpoint: React.FC<APIEndpointProps> = ({
    method,
    path,
    description,
    parameters,
    responses
}) => {
    const methodColors = {
        GET: '#22C55E',
        POST: '#3B82F6',
        PUT: '#F59E0B',
        DELETE: '#EF4444',
        PATCH: '#8B5CF6'
    };

    return (
        <div style={{ marginBottom: '32px' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
            }}>
                <span style={{
                    backgroundColor: methodColors[method],
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    fontSize: '14px'
                }}>
                    {method}
                </span>
                <code style={{
                    fontSize: '16px',
                    backgroundColor: '#f5f5f5',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    flex: 1
                }}>
                    {path}
                </code>
            </div>
            <p style={{ marginBottom: '16px' }}>{description}</p>

            {parameters && parameters.length > 0 && (
                <>
                    <h4>Parameters</h4>
                    <table style={{ width: '100%', marginBottom: '16px', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #eee' }}>Name</th>
                                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #eee' }}>Type</th>
                                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #eee' }}>Required</th>
                                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #eee' }}>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parameters.map((param, index) => (
                                <tr key={index}>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{param.name}</td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}><code>{param.type}</code></td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{param.required ? '✓' : ''}</td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{param.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            <h4>Responses</h4>
            {responses.map((response, index) => (
                <div key={index} style={{ marginBottom: '16px' }}>
                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        marginBottom: '8px'
                    }}>
                        <code style={{
                            backgroundColor: response.status < 400 ? '#22C55E' : '#EF4444',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '4px'
                        }}>
                            {response.status}
                        </code>
                        <span>{response.description}</span>
                    </div>
                    <pre style={{
                        backgroundColor: '#f5f5f5',
                        padding: '12px',
                        borderRadius: '4px',
                        margin: 0
                    }}>
                        <code>{response.example}</code>
                    </pre>
                </div>
            ))}
        </div>
    );
}; 