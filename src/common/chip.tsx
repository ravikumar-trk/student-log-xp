import React from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckIcon from '@mui/icons-material/Check';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

type ChipProps = { status: string };

const baseStyle: React.CSSProperties = {
    padding: '4px 8px',
    borderRadius: '6px',
    fontWeight: 'bold',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    minWidth: '80px',
    textAlign: 'center',
    fontSize: '0.9rem',
};

const iconStyle: React.CSSProperties = {
    width: 14,
    height: 14,
    flex: '0 0 14px',
};

const Chip: React.FC<ChipProps> = ({ status }) => {
    let style: React.CSSProperties = { ...baseStyle };
    let IconComponent: React.FC<React.SVGProps<SVGSVGElement>> | null = null;
    // Normalize status for case-insensitive comparisons
    const normalized = status ? status.toLowerCase().trim() : '';

    // Plan-specific colors (case-insensitive): lite, silver, gold, platinum
    if (normalized === 'lite') {
        style = { ...style, backgroundColor: '#e6f7ff', color: '#05668d' }; // light blue
        IconComponent = FiberManualRecordIcon as any;
    } else if (normalized === 'silver') {
        style = { ...style, backgroundColor: '#f5f7fa', color: '#6c6f73' }; // silver/gray
        IconComponent = FiberManualRecordIcon as any;
    } else if (normalized === 'gold' || normalized === 'glod') {
        // Accept common typo 'glod' as well
        style = { ...style, backgroundColor: '#fff7e0', color: '#a67c00' }; // gold
        IconComponent = CheckCircleOutlineIcon as any;
    } else if (normalized === 'platinum') {
        style = { ...style, backgroundColor: '#f0f5f9', color: '#23324a' }; // subtle cool tint
        IconComponent = CheckIcon as any;
    } else {
        switch (status) {
            case 'Active':
                // Active - green filled check
                style = { ...style, backgroundColor: '#d4f7e6', color: '#0b6b2f' };
                IconComponent = CheckIcon as any; // Type assertion to bypass type issue
                break;
            case 'Open':
                // Open - blue outline/time icon to indicate waiting
                style = { ...style, backgroundColor: '#e7f3ff', color: '#0b5fc6' };
                IconComponent = AccessTimeIcon as any;
                break;
            case 'Inactive':
                // Inactive - muted gray
                style = { ...style, backgroundColor: '#f1f3f5', color: '#6b7177' };
                IconComponent = FiberManualRecordIcon as any;
                break;
            case 'Resolved':
                // Resolved - purple/teal to differentiate from Inactive
                style = { ...style, backgroundColor: '#eef6fb', color: '#0f5b66' };
                IconComponent = CheckCircleOutlineIcon as any;
                break;
            case 'In Progress':
                style = { ...style, backgroundColor: '#fff3cd', color: '#856404' };
                IconComponent = AccessTimeIcon as any;
                break;
            default:
                style = { ...style, backgroundColor: '#e2e3e5', color: '#41464b' };
                IconComponent = FiberManualRecordIcon as any;
                break;
        }
    }

    // Ensure the icon and text use the same color as the computed style.color
    const textStyle: React.CSSProperties = { color: style.color };

    // Use a loosely-typed local variable for safe rendering in JSX
    const LooseIcon: any = IconComponent;

    return (
        <div style={style} aria-label={`status-${status}`}>
            {LooseIcon ? <LooseIcon style={{ ...iconStyle, color: style.color }} /> : null}
            <span style={textStyle}>{status}</span>
        </div>
    );
};

export default Chip;