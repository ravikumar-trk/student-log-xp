import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ThemedTextField from './ThemedTextField';
import { useAppSelector } from '../hooks/reduxHooks';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface ThemedAutocompleteProps {
    isMultiSelect?: boolean;
    label?: string;
    options: any[];
    value?: any;
    onChange?: (
        event: React.SyntheticEvent,
        value: any | any[]
    ) => void;
    getOptionLabel?: (option: any) => string;
    sx?: any;
    [key: string]: any;
}

function ThemedAutocomplete({
    isMultiSelect = false,
    label,
    sx,
    ...rest
}: ThemedAutocompleteProps) {
    const mode = useAppSelector((s) => s.theme.mode);
    const isDark = mode === 'dark';

    const sxOverride = {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: isDark ? '#fff' : '#000',
            },
            '&:hover fieldset': {
                borderColor: isDark ? '#fff' : '#000',
            },
            '&.Mui-focused fieldset': {
                borderColor: isDark ? '#fff' : '#000',
            },
        },
        '& .MuiInput-input': {
            color: isDark ? '#fff' : '#000',
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: isDark ? '#fff !important' : '#000 !important',
        },
        '& .MuiInput-underline:hover': {
            borderBottom: isDark
                ? '1px solid #fff'
                : '1px solid #000',
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
    };

    return (
        <Autocomplete
            {...rest}
            multiple={isMultiSelect}
            disableCloseOnSelect={isMultiSelect}
            sx={{
                ...(sx || {}),
                ...sxOverride,
            }}
            renderOption={
                isMultiSelect
                    ? (props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                checked={selected}
                                sx={{ mr: 1 }}
                            />
                            {rest.getOptionLabel
                                ? rest.getOptionLabel(option)
                                : option.label}
                        </li>
                    )
                    : undefined
            }
            renderInput={(params) => (
                <ThemedTextField
                    {...params}
                    variant="standard"
                    label={label}
                />
            )}
        />
    );
}

export default ThemedAutocomplete;