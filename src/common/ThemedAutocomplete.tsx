import Autocomplete from '@mui/material/Autocomplete';
import ThemedTextField from './ThemedTextField';
import { useAppSelector } from '../hooks/reduxHooks';

function ThemedAutocomplete(props: any) {
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
        // '& .MuiInputLabel-root': {
        //     color: isDark ? '#fff' : '#000',
        // },
        '& .MuiInput-input': {
            color: isDark ? '#fff' : '#000',
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: isDark ? '#fff !important' : '#000 !important',
        },
        // standard input underline
        '& .MuiInput-underline:hover': {
            borderBottom: isDark ? '1px solid #fff' : '1px solid #000',
        },
        '& .MuiInput-underline:before': {
            borderBottomColor: isDark ? '#fff' : '#000',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: isDark ? '#fff' : '#000',
        },
        '& .MuiInput-underline svg': {
            color: isDark ? '#fff' : '#000',
        },
    } as any;
    return (
        <Autocomplete
            {...props}
            sx={{ ...(sx as any), ...sxOverride }}
            renderInput={(params) =>
                <ThemedTextField {...params} variant="standard" label={props.label} />
            }
        />
    );
}

export default ThemedAutocomplete;
