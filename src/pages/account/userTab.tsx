import { useMemo } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table';
import { getTableOptions } from '../../common/tableStyles';
import Chip from '../../common/chip';

// User data type
type User = {
    name: string;
    email: string;
    school: string;
    status: 'Active' | 'Inactive';
    createdOn: string;
};

const data: User[] = [
    {
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        school: 'Greenwood High School',
        status: 'Active',
        createdOn: '2022-01-15',
    },
    {
        name: 'Bob Smith',
        email: 'bob.smith@example.com',
        school: 'Sunrise Academy',
        status: 'Inactive',
        createdOn: '2021-09-10',
    },
    {
        name: 'Carol Lee',
        email: 'carol.lee@example.com',
        school: 'Riverdale School',
        status: 'Active',
        createdOn: '2020-05-22',
    },
    {
        name: 'David Kim',
        email: 'david.kim@example.com',
        school: 'Hilltop Institute',
        status: 'Active',
        createdOn: '2023-03-01',
    },
    {
        name: 'Eva Brown',
        email: 'eva.brown@example.com',
        school: 'Lakeside Prep',
        status: 'Inactive',
        createdOn: '2019-11-30',
    },
];

const UserTab = () => {
    // const { tablePaperStyles, tableHeaderCellStyle, tableBodyCellStyle, tableToolBarStyles, muiTableBodyRowProps } = useStyles();
    //should be memoized or stable
    const columns = useMemo<MRT_ColumnDef<User>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                size: 200,
            },
            {
                accessorKey: 'email',
                header: 'Email',
                size: 220,
            },
            {
                accessorKey: 'school',
                header: 'School',
                size: 180,
            },
            {
                accessorKey: 'createdOn',
                header: 'Created Date',
                size: 160,
            },
            {
                accessorKey: 'status',
                header: 'Status',
                size: 120,
                Cell: ({ cell }) => (
                    <div>
                        <Chip status={cell.getValue<string>()} />
                    </div>
                ),
            },
        ],
        [],
    );


    const table = useMaterialReactTable({
        columns,
        data,
        ...getTableOptions(),
    });


    return <MaterialReactTable table={table}

    />;
};

export default UserTab;
