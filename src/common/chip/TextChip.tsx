import React from 'react';
import { baseStyle, textChipStyles } from './chipStyles';

type Props = {
    text?: string;
};

const TextChip: React.FC<Props> = ({ text }) => {
    const normalized = text?.toLowerCase() ?? '';

    const style = {
        ...baseStyle,
        ...(textChipStyles[normalized] || {
            color: '#41464b',
        }),
    };

    return (
        <div style={style}>
            <span>{text}</span>
        </div>
    );
};

export default React.memo(TextChip);