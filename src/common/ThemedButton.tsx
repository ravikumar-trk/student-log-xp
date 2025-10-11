import React from 'react';
import Button from '@mui/material/Button';
import type { ButtonProps } from '@mui/material/Button';
import { useAppSelector } from '../hooks/reduxHooks';

type ThemedButtonProps = ButtonProps & {
    // allow an optional invert prop to invert colors (outline-like)
    invert?: boolean;
    text: string;
};

const ThemedButton: React.FC<ThemedButtonProps> = ({ style, text, variant, children, ...rest }) => {
    const primaryColor = useAppSelector((s) => s.theme.primaryColor);

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

    return (
        <Button style={variant === 'contained' ? containedBtnStyle : outlinedBtnStyle} {...rest}>
            {text}
        </Button>
    );
};

export default ThemedButton;
