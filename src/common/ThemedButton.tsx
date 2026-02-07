import React from 'react';
import Button from '@mui/material/Button';
import type { ButtonProps } from '@mui/material/Button';
import { useAppSelector } from '../hooks/reduxHooks';
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
    invert?: boolean;
    text: string;
    icon?: React.ReactNode | string;
    isFile?: boolean;
    iconPosition?: 'start' | 'end';
    handleClick?: (files?: FileList | null) => void;
    accept?: string;
};

const ThemedButton: React.FC<ThemedButtonProps> = ({
    style,
    text,
    variant,
    icon,
    iconPosition = 'start',
    children,
    isFile,
    handleClick,
    accept = '.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
    ...rest
}) => {

    const primaryColor = useAppSelector((s) => s.theme.primaryColor);
    const mode = useAppSelector((s) => s.theme.mode);
    const isDark = mode === 'dark';
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const containedBtnStyle: React.CSSProperties = {
        backgroundColor: primaryColor.color,
        color: '#fff',
        border: `1px solid ${primaryColor.color}`,
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
        textTransform: 'none',
        padding: '6px 24px',
        borderRadius: 6,
        height: '45px',
        fontSize: '16px',
        letterSpacing: '.5px',
        ...(style || {}),
    };

    const resolveIcon = (ik: React.ReactNode | string | undefined) => {
        if (!ik) return null;
        if (typeof ik !== 'string') return ik;
        const key = ik.trim();
        const map: Record<string, React.ElementType> = {
            Active: CheckIcon,
            Open: AccessTimeIcon,
            Inactive: FiberManualRecordIcon,
            Resolved: CheckCircleOutlineIcon,
            Reviewed: CheckCircleOutlineIcon,
            Approved: CheckCircleOutlineIcon,
            Completed: CheckCircleOutlineIcon,
            'In Progress': AccessTimeIcon,
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
        <Button
            sx={{
                ...(variant === 'contained' ? containedBtnStyle : outlinedBtnStyle),

                transition: 'all 0.2s ease',

                '&:hover': {
                    backgroundColor:
                        variant === 'contained'
                            ? `${primaryColor.color}E6`
                            : `${primaryColor.color}15`,
                    borderColor: primaryColor.color,
                },
                '&.Mui-disabled': {
                    pointerEvents: 'unset',
                    cursor: 'not-allowed !important',
                    color: isDark ? '#555 !important' : '#000 !important',
                    // opacity: 0.6,
                },
            }}
            onClick={onButtonClick}
            {...rest}
        >
            {IconNodeBefore && (
                <span style={{ display: 'inline-flex', marginRight: 8, alignItems: 'center' }}>
                    {IconNodeBefore}
                </span>
            )}

            {text}

            {IconNodeAfter && (
                <span style={{ display: 'inline-flex', marginLeft: 8, alignItems: 'center' }}>
                    {IconNodeAfter}
                </span>
            )}

            {isFile && (
                <VisuallyHiddenInput
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={onInputChange}
                />
            )}
        </Button>
    );
};

export default ThemedButton;
