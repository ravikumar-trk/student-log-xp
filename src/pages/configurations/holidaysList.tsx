import { useMemo } from 'react';
import {
    Grid,
    Paper,
    Box,
    Typography,
    Tooltip,
    Chip,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useStyles } from '../../theme/styles';
import { useAppSelector } from '../../hooks/reduxHooks';

interface Holiday {
    date: string;
    name: string;
    description: string;
}

const DUMMY_HOLIDAYS: Holiday[] = [
    { date: '2026-01-26', name: 'Republic Day', description: 'National holiday celebrating the Indian Constitution' },
    { date: '2026-03-17', name: 'Maha Shivaratri', description: 'Hindu festival dedicated to Lord Shiva' },
    { date: '2026-03-25', name: 'Holi', description: 'Festival of colors and joy' },
    { date: '2026-04-14', name: 'Ambedkar Jayanti', description: 'Birth anniversary of B.R. Ambedkar' },
    { date: '2026-04-02', name: 'Good Friday', description: 'Christian festival' },
    { date: '2026-05-01', name: 'Labor Day', description: 'International Workers Day' },
    { date: '2026-06-21', name: 'Summer Solstice', description: 'Longest day of the year' },
    { date: '2026-08-15', name: 'Independence Day', description: 'National holiday celebrating India independence' },
    { date: '2026-09-20', name: 'Ganesh Chaturthi', description: 'Festival celebrating Lord Ganesha' },
    { date: '2026-10-02', name: 'Gandhi Jayanti', description: 'Birth anniversary of Mahatma Gandhi' },
    { date: '2026-10-24', name: 'Diwali', description: 'Festival of lights' },
    { date: '2026-11-01', name: 'Diwali (Lakshmi Puja)', description: 'Lakshmi Puja celebration' },
    { date: '2026-11-20', name: 'Thanksgiving', description: 'Thanksgiving holiday' },
    { date: '2026-12-25', name: 'Christmas', description: 'Christmas festival' },
];

const HolidaysList = () => {
    const styles = useStyles();
    const mode = useAppSelector((state) => state.theme.mode);
    const primaryColor = useAppSelector((state) => state.theme.primaryColor);

    const holidayMap = useMemo(() => {
        const map = new Map<string, Holiday>();
        DUMMY_HOLIDAYS.forEach((holiday) => {
            map.set(holiday.date, holiday);
        });
        return map;
    }, []);

    const generateCalendarDays = (month: number, year: number) => {
        const firstDay = dayjs(`${year}-${String(month).padStart(2, '0')}-01`);
        const daysInMonth = firstDay.daysInMonth();
        const startDayOfWeek = firstDay.day();

        const days: (Dayjs | null)[] = [];
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(firstDay.date(i));
        }
        return days;
    };

    const currentYear = dayjs().year();
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const isDark = mode === 'dark';

    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            {/* <Box sx={styles.bodySubMainDiv}> */}
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        marginBottom: '24px',
                        color: isDark ? '#e0e0e0' : '#000',
                    }}
                >
                    {currentYear} Holidays Calendar
                </Typography>

                <Grid container spacing={3}>
                    {Array.from({ length: 12 }).map((_, monthIndex) => {
                        const month = monthIndex + 1;
                        const calendarDays = generateCalendarDays(month, currentYear);

                        return (
                            <Grid key={month}>
                                <Paper
                                    sx={{
                                        padding: '16px',
                                        backgroundColor: isDark ? '#1e1e1e' : '#f9f9f9',
                                        border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
                                        borderRadius: '8px',
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 600,
                                            marginBottom: '12px',
                                            textAlign: 'center',
                                            color: primaryColor.color,
                                        }}
                                    >
                                        {monthNames[monthIndex]}
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(7, 1fr)',
                                            gap: '4px',
                                            marginBottom: '12px',
                                        }}
                                    >
                                        {dayNames.map((day) => (
                                            <Box
                                                key={day}
                                                sx={{
                                                    textAlign: 'center',
                                                    fontWeight: 600,
                                                    fontSize: '12px',
                                                    color: isDark ? '#888' : '#999',
                                                    padding: '4px',
                                                }}
                                            >
                                                {day}
                                            </Box>
                                        ))}

                                        {calendarDays.map((day, index) => {
                                            const dateStr = day ? day.format('YYYY-MM-DD') : null;
                                            const holiday = dateStr ? holidayMap.get(dateStr) : null;
                                            const isToday = day && day.isSame(dayjs(), 'day');

                                            return (
                                                <Tooltip
                                                    key={index}
                                                    title={
                                                        holiday
                                                            ? `${holiday.name} - ${holiday.description}`
                                                            : ''
                                                    }
                                                    arrow
                                                    disableHoverListener={!holiday}
                                                >
                                                    <Box
                                                        sx={{
                                                            padding: '6px',
                                                            textAlign: 'center',
                                                            fontSize: '13px',
                                                            fontWeight: holiday ? 600 : 400,
                                                            border: isToday
                                                                ? `2px solid ${primaryColor.color}`
                                                                : '1px solid transparent',
                                                            borderRadius: '6px',
                                                            backgroundColor: holiday
                                                                ? primaryColor.lightColor
                                                                : isToday
                                                                    ? isDark
                                                                        ? '#333'
                                                                        : '#f0f0f0'
                                                                    : 'transparent',
                                                            color: holiday
                                                                ? primaryColor.color
                                                                : isDark
                                                                    ? '#e0e0e0'
                                                                    : '#000',
                                                            cursor: holiday ? 'pointer' : 'default',
                                                            transition:
                                                                'all 0.2s ease, box-shadow 0.2s ease',
                                                            '&:hover': {
                                                                boxShadow: holiday
                                                                    ? `0 0 8px ${primaryColor.color}33`
                                                                    : 'none',
                                                                transform: holiday ? 'scale(1.05)' : 'none',
                                                            },
                                                            minHeight: '32px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        {day ? day.date() : ''}
                                                    </Box>
                                                </Tooltip>
                                            );
                                        })}
                                    </Box>

                                    {/* Holiday indicators for the month */}
                                    <Box sx={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${isDark ? '#333' : '#e0e0e0'}` }}>
                                        {DUMMY_HOLIDAYS.filter(
                                            (h) =>
                                                dayjs(h.date).month() === monthIndex &&
                                                dayjs(h.date).year() === currentYear
                                        ).length > 0 && (
                                                <Box>
                                                    {/* <Typography
                                                        variant="caption"
                                                        sx={{
                                                            fontSize: '11px',
                                                            color: isDark ? '#999' : '#666',
                                                            display: 'block',
                                                            marginBottom: '6px',
                                                        }}
                                                    >
                                                        Holidays:
                                                    </Typography> */}
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                        {DUMMY_HOLIDAYS.filter(
                                                            (h) =>
                                                                dayjs(h.date).month() === monthIndex &&
                                                                dayjs(h.date).year() === currentYear
                                                        ).map((holiday) => (
                                                            <Chip
                                                                key={holiday.date}
                                                                label={`${dayjs(holiday.date).date()} ${holiday.name}`}
                                                                size="small"
                                                                sx={{
                                                                    height: '24px',
                                                                    fontSize: '11px',
                                                                    backgroundColor: primaryColor.lightColor,
                                                                    color: primaryColor.color,
                                                                    fontWeight: 500,
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )}
                                    </Box>
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>

                {/* Legend */}
                <Box
                    sx={{
                        marginTop: '32px',
                        padding: '16px',
                        backgroundColor: isDark ? '#1e1e1e' : '#f9f9f9',
                        borderRadius: '8px',
                        border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
                    }}
                >
                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: 600,
                            marginBottom: '12px',
                            color: isDark ? '#e0e0e0' : '#000',
                        }}
                    >
                        Legend:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Box
                                sx={{
                                    width: '24px',
                                    height: '24px',
                                    backgroundColor: primaryColor.lightColor,
                                    borderRadius: '4px',
                                    border: `2px solid ${primaryColor.color}`,
                                }}
                            />
                            <Typography variant="body2" sx={{ color: isDark ? '#e0e0e0' : '#000' }}>
                                Holiday
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Box
                                sx={{
                                    width: '24px',
                                    height: '24px',
                                    border: `2px solid ${primaryColor.color}`,
                                    borderRadius: '4px',
                                    backgroundColor: isDark ? '#333' : '#f0f0f0',
                                }}
                            />
                            <Typography variant="body2" sx={{ color: isDark ? '#e0e0e0' : '#000' }}>
                                Today
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
            {/* </Box> */}
        </Grid>
    );
};

export default HolidaysList;