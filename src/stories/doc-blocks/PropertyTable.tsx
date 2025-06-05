import React from 'react';

interface Property {
    name: string;
    type: string;
    default?: string;
    description: string;
    required?: boolean;
}

interface PropertyTableProps {
    properties: Property[];
}

export const PropertyTable: React.FC<PropertyTableProps> = ({ properties }) => {
    return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #eee' }}>Property</th>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #eee' }}>Type</th>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #eee' }}>Default</th>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #eee' }}>Description</th>
                </tr>
            </thead>
            <tbody>
                {properties.map((prop, index) => (
                    <tr key={index}>
                        <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                            {prop.name}
                            {prop.required && <span style={{ color: 'red' }}>*</span>}
                        </td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}><code>{prop.type}</code></td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{prop.default || '-'}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{prop.description}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}; 