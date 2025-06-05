import React from 'react';

interface CodePreviewProps {
    code: string;
    language?: string;
    showLineNumbers?: boolean;
}

export const CodePreview: React.FC<CodePreviewProps> = ({
    code,
    language = "jsx",
    showLineNumbers = true
}) => {
    return (
        <div style={{
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            padding: '16px',
            margin: '16px 0'
        }}>
            <pre style={{ margin: 0 }}>
                <code>{code}</code>
            </pre>
        </div>
    );
}; 