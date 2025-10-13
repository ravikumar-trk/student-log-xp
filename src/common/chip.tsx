import React, { useMemo } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckIcon from '@mui/icons-material/Check';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

type ChipProps = { status: string };

const baseStyle: React.CSSProperties = {

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

type StyleAndIcon = {
    style: React.CSSProperties;
    Icon: React.ElementType | null;
};

const planStyles: Record<string, StyleAndIcon> = {
    // keys should be lowercase
    // Plan chips intentionally have no icon (visual label only)
    lite: { style: { color: '#05668d' }, Icon: null },
    silver: { style: { color: '#6c6f73' }, Icon: null },
    gold: { style: { color: '#a67c00' }, Icon: null },
    platinum: { style: { color: '#23324a' }, Icon: null },
    Critical: { style: { color: '#c62828', fontSize: '16px' }, Icon: null },
    High: { style: { color: '#ef6c00', fontSize: '16px' }, Icon: null },
    Medium: { style: { color: '#f9a825', fontSize: '16px' }, Icon: null },
    Low: { style: { color: '#2e7d32', fontSize: '16px' }, Icon: null },
};

const statusStyles: Record<string, StyleAndIcon> = {
    Active: { style: { backgroundColor: '#d4f7e6', color: '#0b6b2f', padding: '4px 8px' }, Icon: CheckIcon },
    Open: { style: { backgroundColor: '#e7f3ff', color: '#0b5fc6', padding: '4px 8px' }, Icon: AccessTimeIcon },
    Inactive: { style: { backgroundColor: '#f1f3f5', color: '#6b7177', padding: '4px 8px' }, Icon: FiberManualRecordIcon },
    Resolved: { style: { backgroundColor: '#eef6fb', color: '#0f5b66', padding: '4px 8px' }, Icon: CheckCircleOutlineIcon },
    Reviewed: { style: { backgroundColor: '#d1ecf1', color: '#0c5460', padding: '4px 8px' }, Icon: CheckCircleOutlineIcon },
    Approved: { style: { backgroundColor: '#d4edda', color: '#155724', padding: '4px 8px' }, Icon: CheckCircleOutlineIcon },
    Completed: { style: { backgroundColor: '#c3e6cb', color: '#155724', padding: '4px 8px' }, Icon: CheckCircleOutlineIcon },
    'In Progress': { style: { backgroundColor: '#fff3cd', color: '#856404', padding: '4px 8px' }, Icon: AccessTimeIcon },
};

function pickPlanStyle(normalized: string): StyleAndIcon | null {
    // exact match
    if (planStyles[normalized]) return planStyles[normalized];
    // handle common typo 'glod' -> gold
    if (normalized === 'glod') return planStyles['gold'];
    // partial match (e.g., 'gold plan')
    for (const key of Object.keys(planStyles)) {
        if (normalized.includes(key)) return planStyles[key];
    }
    return null;
}

function pickStatusStyle(status: string): StyleAndIcon | null {
    if (statusStyles[status]) return statusStyles[status];
    return null;
}

const Chip: React.FC<ChipProps> = ({ status }) => {
    const normalized = status;

    const computed = useMemo<StyleAndIcon>(() => {
        // Try plan-first matching (case-insensitive / partial)
        const plan = pickPlanStyle(normalized);
        if (plan) return { style: { ...baseStyle, ...plan.style }, Icon: plan.Icon };

        // Then try exact status mapping (case-sensitive for keys defined)
        const statusExact = pickStatusStyle(status);
        if (statusExact) return { style: { ...baseStyle, ...statusExact.style }, Icon: statusExact.Icon };

        // Fallback default
        return { style: { ...baseStyle, backgroundColor: '#e2e3e5', color: '#41464b' }, Icon: FiberManualRecordIcon };
    }, [normalized, status]);

    const { style, Icon } = computed;

    const textStyle: React.CSSProperties = { color: style.color };

    return (
        <div style={style} aria-label={`status-${status}`}>
            {Icon ? <Icon style={{ ...iconStyle, color: style.color }} /> : null}
            <span style={textStyle}>{status}</span>
        </div>
    );
};

export default React.memo(Chip);