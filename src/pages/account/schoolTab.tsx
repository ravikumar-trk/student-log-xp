import { useMemo } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table';
import { getTableOptions } from '../../common/tableStyles';
import Chip from '../../common/chip';

// School data type
type School = {
    name: string;
    code: string;
    location: string;
    createdDate: string;
    status: 'Active' | 'Inactive';
};

const data: School[] = [
    {
        name: 'Greenwood High School',
        code: 'GHS001',
        location: 'New York',
        createdDate: '2022-01-15',
        status: 'Active',
    },
    {
        name: 'Sunrise Academy',
        code: 'SRA002',
        location: 'Los Angeles',
        createdDate: '2021-09-10',
        status: 'Active',
    },
    {
        name: 'Riverdale School',
        code: 'RDS003',
        location: 'Chicago',
        createdDate: '2020-05-22',
        status: 'Inactive',
    },
    {
        name: 'Hilltop Institute',
        code: 'HTI004',
        location: 'Houston',
        createdDate: '2023-03-01',
        status: 'Active',
    },
    {
        name: 'Lakeside Prep',
        code: 'LSP005',
        location: 'Seattle',
        createdDate: '2019-11-30',
        status: 'Inactive',
    },
];

const SchoolTab = () => {
    // const { tablePaperStyles, tableHeaderCellStyle, tableBodyCellStyle, tableToolBarStyles, muiTableBodyRowProps } = useStyles();
    //should be memoized or stable
    const columns = useMemo<MRT_ColumnDef<School>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                size: 200,
            },
            {
                accessorKey: 'code',
                header: 'Code',
                size: 120,
            },
            {
                accessorKey: 'location',
                header: 'Location',
                size: 180,
            },
            {
                accessorKey: 'createdDate',
                header: 'Created Date',
                size: 160,
            },
            {
                accessorKey: 'status',
                header: 'Status',
                size: 120,
                Cell: ({ cell }) => (
                    <div >
                        <Chip status={cell.getValue<string>()} />
                    </div>),
            },
        ],
        [],
    );


    const table = useMaterialReactTable({
        columns,
        data,
        ...getTableOptions(),
    });


    return <MaterialReactTable table={table} />;
};

export default SchoolTab;
