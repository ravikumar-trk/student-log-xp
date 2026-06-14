import React from 'react';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import {
    baseStyle,
    iconStyle,
    statusChipStyles,
} from './chipStyles';

type Props = {
    status?: string;
};

const StatusChip: React.FC<Props> = ({ status }) => {
    const config =
        statusChipStyles[status as keyof typeof statusChipStyles];

    const style = {
        ...baseStyle,
        ...(config?.style || {
            backgroundColor: '#e2e3e5',
            color: '#41464b',
        }),
    };

    const Icon = config?.Icon || FiberManualRecordIcon;

    return (
        <div style={style}>
            <Icon
                style={{
                    ...iconStyle,
                    color: style.color,
                }}
            />
            <span>{status}</span>
        </div>
    );
};

export default React.memo(StatusChip);