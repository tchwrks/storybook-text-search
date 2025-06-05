import React from "react";

type Column<T> = {
    key: keyof T;
    header: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
};

type Props<T> = {
    columns: Column<T>[];
    data: T[];
    className?: string;
};

export function Table<T extends Record<string, any>>({ columns, data, className }: Props<T>) {
    return (
        <table className={className} style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
                <tr>
                    {columns.map((col, i) => (
                        <th
                            key={i}
                            style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: "8px" }}
                        >
                            {col.header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map((col, colIndex) => (
                            <td
                                key={colIndex}
                                style={{ borderBottom: "1px solid #f0f0f0", padding: "8px" }}
                            >
                                {col.render ? col.render(row[col.key], row) : row[col.key]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}