import { useEffect, useMemo, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table';
import { getTableOptions } from '../../common/tableStyles';
import Chip from '../../common/chip';
import type { UserModel } from '../../models/UserModel';
import { UserTableColumns } from './utils'
import masterServices from '../../services/masterSerices';

const UserTab = () => {
    const [users, setUsers] = useState<UserModel[]>([]);
    const columns = useMemo<MRT_ColumnDef<UserModel>[]>(
        () =>
            UserTableColumns.map(column => {
                if (column.accessorKey === 'Status') {
                    return {
                        ...column,
                        Cell: ({ cell }) => (
                            <div >
                                <Chip status={cell.getValue<string>()} />
                            </div>),
                    };
                }
                return column;
            }),
        [],
    );

    const getUsersByAccountIDAPI = async () => {
        try {
            const res: any = await masterServices.getUsersByAccountID(2);
            setUsers(res?.data?.Data ?? []);
        } catch (err: any) {
            console.error(err?.message ?? err);
            alert(err?.message ?? 'Failed to fetch account details');
        }
    }

    useEffect(() => {
        getUsersByAccountIDAPI();
    }, []);

    const table = useMaterialReactTable({
        columns,
        data: users,
        ...getTableOptions(),
    });

    return <MaterialReactTable table={table}

    />;
};

export default UserTab;
