import { useStyles } from "../theme/styles";

export const getTableOptions = () => {
    const {
        tablePaperStyles,
        tableHeaderCellStyle,
        tableBodyCellStyle,
        tableToolBarStyles,
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
            sx: { ...tableToolBarStyles }
        },
        muiBottomToolbarProps: {
            sx: { ...tableToolBarStyles }
        },
    };
};
