import React from 'react';
import TextField from '@mui/material/TextField';
import type { TextFieldProps } from '@mui/material/TextField';
import { useAppSelector } from '../hooks/reduxHooks';

const ThemedTextField: React.FC<TextFieldProps> = (props) => {
    const { sx, ...rest } = props;
    const mode = useAppSelector((s) => s.theme.mode);
    const isDark = mode === 'dark';

    const sxOverride = {
        // outlined input
        '& .MuiOutlinedInput-root': {
            // adjust the border color based on theme
            '& fieldset': { borderColor: isDark ? '#fff' : '#000' },
            '&:hover fieldset': { borderColor: isDark ? '#fff' : '#000' },
            '&.Mui-focused fieldset': { borderColor: isDark ? '#fff' : '#000' },
        },
        '& .MuiInputLabel-root': {
            color: isDark ? '#fff' : '#000',
        },
        '& .MuiInput-input': {
            color: isDark ? '#fff' : '#000',
        },
        // standard input underline
        '& .MuiInput-underline': {
            border: 'unset !important',
        },
        '& .MuiInput-underline:hover': {
            borderBottom: isDark ? '1px solid #fff' : '1px solid #000',
        },
        '& .MuiInput-underline:before': {
            borderBottomColor: isDark ? '#fff' : '#000',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: isDark ? '#fff' : '#000',
        },
    } as any;

    return (
        <TextField
            {...rest}
            sx={{ ...(sx as any), ...sxOverride }}
        />
    );
};

export default ThemedTextField;
