import React, { useMemo, useState } from "react";
import {
    Box,
    IconButton,
    Typography,
    Button,
    Stack,
} from "@mui/material";
import {
    ChevronLeft,
    ChevronRight,
} from "@mui/icons-material";

interface WeeklyCalendarProps {
    defaultValue?: Date;
    value?: Date;
    onChange?: (date: Date) => void;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
    defaultValue = new Date(),
    value,
    onChange,
}) => {
    const [internalDate, setInternalDate] = useState<Date>(defaultValue);

    // Supports both controlled and uncontrolled usage
    const selectedDate = value ?? internalDate;

    const startOfWeek = (date: Date): Date => {
        const result = new Date(date);
        const day = result.getDay();

        // Monday = 0
        const diff = day === 0 ? -6 : 1 - day;

        result.setDate(result.getDate() + diff);
        result.setHours(0, 0, 0, 0);

        return result;
    };

    const weekStart = useMemo(
        () => startOfWeek(selectedDate),
        [selectedDate]
    );

    const weekDates = useMemo(() => {
        return Array.from({ length: 7 }, (_, index) => {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + index);
            return date;
        });
    }, [weekStart]);

    const isSameDay = (date1: Date, date2: Date) => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    };

    const changeDate = (date: Date) => {
        if (value === undefined) {
            setInternalDate(date);
        }

        onChange?.(date);
    };

    const changeWeek = (direction: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + direction * 7);

        changeDate(newDate);
    };

    const goToToday = () => {
        changeDate(new Date());
    };

    const formatMonthYear = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });
    };

    return (
        <Box width="100%">

            {/* Header */}
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
            >
                <IconButton onClick={() => changeWeek(-1)}>
                    <ChevronLeft />
                </IconButton>

                <Typography variant="h6" fontWeight={600}>
                    {formatMonthYear(weekStart)}
                </Typography>

                <Stack direction="row" alignItems="center">
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={goToToday}
                        sx={{ mr: 1 }}
                    >
                        Today
                    </Button>

                    <IconButton onClick={() => changeWeek(1)}>
                        <ChevronRight />
                    </IconButton>
                </Stack>
            </Stack>

            {/* Week */}
            <Box
                display="grid"
                gridTemplateColumns="repeat(7, 1fr)"
                gap={1}
            >
                {weekDates.map((date) => {
                    const selected = isSameDay(date, selectedDate);
                    const today = isSameDay(date, new Date());

                    return (
                        <Box
                            key={date.toISOString()}
                            onClick={() => changeDate(date)}
                            sx={{
                                cursor: "pointer",
                                textAlign: "center",
                                borderRadius: 2,
                                padding: 1.5,
                                border: "1px solid",
                                borderColor: selected
                                    ? "primary.main"
                                    : "divider",
                                backgroundColor: selected
                                    ? "primary.main"
                                    : "background.paper",
                                color: selected
                                    ? "primary.contrastText"
                                    : "text.primary",

                                "&:hover": {
                                    backgroundColor: selected
                                        ? "primary.dark"
                                        : "action.hover",
                                },
                            }}
                        >
                            {/* Day */}
                            <Typography
                                variant="caption"
                                fontWeight={600}
                                display="block"
                            >
                                {date.toLocaleDateString("en-US", {
                                    weekday: "short",
                                })}
                            </Typography>

                            {/* Date */}
                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                {date.getDate()}
                            </Typography>

                            {/* Today indicator */}
                            {today && (
                                <Typography
                                    variant="caption"
                                    fontWeight={600}
                                    sx={{
                                        color: selected
                                            ? "inherit"
                                            : "primary.main",
                                    }}
                                >
                                    Today
                                </Typography>
                            )}
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default WeeklyCalendar;