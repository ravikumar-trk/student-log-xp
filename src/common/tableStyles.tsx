import { useStyles } from "../theme/styles";

export const GetTableOptions = () => {
    const {
        tablePaperStyles,
        tableHeaderCellStyle,
        tableBodyCellStyle,
        tableToolBarStyles,
        tableTopToolBarStyles,
        muiTableBodyRowProps,
    } = useStyles();
    return {
        // density: "comfortable" as const,
        initialState: { density: 'compact' },
        muiTablePaperProps: {
            sx: { ...tablePaperStyles },
        },
        muiTableHeadCellProps: {
            sx: { ...tableHeaderCellStyle },
        },
        muiTableBodyCellProps: {
            sx: { ...tableBodyCellStyle },
        },
        muiTableBodyRowProps: ({ row }: any) => ({
            sx: { ...muiTableBodyRowProps(row) },
        }),
        muiTopToolbarProps: {
            sx: { ...tableToolBarStyles, ...tableTopToolBarStyles }
        },
        muiBottomToolbarProps: {
            sx: { ...tableToolBarStyles }
        },
        muiSkeletonProps: {
            animation: 'pulse',
            height: 28,
        },
    };
};
