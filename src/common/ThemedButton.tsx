import React from 'react';
import Button from '@mui/material/Button';
import type { ButtonProps } from '@mui/material/Button';
import { useAppSelector } from '../hooks/reduxHooks';
// icons reused from chip component for consistent behavior
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckIcon from '@mui/icons-material/Check';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

type ThemedButtonProps = ButtonProps & {
    // allow an optional invert prop to invert colors (outline-like)
    invert?: boolean;
    text: string;
    // optional icon (React node) or a string key that will be resolved to a predefined icon
    icon?: React.ReactNode | string;
    isFile?: boolean
    // optional position of the icon
    iconPosition?: 'start' | 'end';
    // handleClick can optionally receive files when isFile=true
    handleClick?: (files?: FileList | null) => void;
    // optional accept string for file input (e.g. '.xlsx,.xls')
    accept?: string;
};

const ThemedButton: React.FC<ThemedButtonProps> = ({ style, text, variant, icon, iconPosition = 'start', children, isFile, handleClick, accept = '.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel', ...rest }) => {
    const primaryColor = useAppSelector((s) => s.theme.primaryColor);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const containedBtnStyle: React.CSSProperties = {
        backgroundColor: primaryColor.color,
        color: '#fff',
        border: `1px solid ${primaryColor.color}`,
        // boxShadow: 'none',
        textTransform: 'none',
        padding: '6px 24px',
        borderRadius: 6,
        height: '45px',
        fontSize: '16px',
        letterSpacing: '.5px',
        ...(style || {}),
    };
    const outlinedBtnStyle: React.CSSProperties = {
        backgroundColor: 'transparent',
        color: primaryColor.color,
        border: `1px solid ${primaryColor.color}`,
        // boxShadow: 'none',
        textTransform: 'none',
        padding: '6px 24px',
        borderRadius: 6,
        height: '45px',
        fontSize: '16px',
        letterSpacing: '.5px',
        ...(style || {}),
    };

    // resolve icon if user provided a string key
    const resolveIcon = (ik: React.ReactNode | string | undefined) => {
        if (!ik) return null;
        if (typeof ik !== 'string') return ik;
        const key = ik.trim();
        const map: Record<string, React.ElementType> = {
            // status-like keys (similar to chip)
            Active: CheckIcon,
            Open: AccessTimeIcon,
            Inactive: FiberManualRecordIcon,
            Resolved: CheckCircleOutlineIcon,
            Reviewed: CheckCircleOutlineIcon,
            Approved: CheckCircleOutlineIcon,
            Completed: CheckCircleOutlineIcon,
            'In Progress': AccessTimeIcon,
            // simple aliases
            check: CheckIcon,
            checkCircle: CheckCircleOutlineIcon,
            time: AccessTimeIcon,
            download: FileDownloadIcon,
            dot: FiberManualRecordIcon,
        };
        const IconComp = map[key] || map[key.charAt(0).toUpperCase() + key.slice(1)];
        return IconComp ? <IconComp /> : null;
    };

    const ResolvedIcon = resolveIcon(icon);

    const IconNodeBefore = iconPosition === 'start' ? ResolvedIcon : null;
    const IconNodeAfter = iconPosition === 'end' ? ResolvedIcon : null;

    const onButtonClick = () => {
        if (isFile) {
            // trigger hidden input click
            inputRef.current?.click();
        } else {
            handleClick?.();
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (handleClick) handleClick(files);
    };

    return (
        <Button style={variant === 'contained' ? containedBtnStyle : outlinedBtnStyle} onClick={onButtonClick} {...rest}>
            {IconNodeBefore && <span style={{ display: 'inline-flex', marginRight: 8, alignItems: 'center' }}>{IconNodeBefore}</span>}
            {text}
            {IconNodeAfter && <span style={{ display: 'inline-flex', marginLeft: 8, alignItems: 'center' }}>{IconNodeAfter}</span>}
            {isFile && <VisuallyHiddenInput
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={onInputChange}
            />}
        </Button>
    );
};

export default ThemedButton;
