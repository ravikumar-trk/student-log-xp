import { useEffect, useMemo, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table';
import { getTableOptions } from '../../common/tableStyles';
import Chip from '../../common/chip';
import masterServices from '../../services/masterSerices';
import type { SchoolModel } from '../../models/SchoolModel';
import { SchoolTableColumns } from './utils'

const SchoolTab = () => {
    const [schools, setSchools] = useState<SchoolModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const columns = useMemo<MRT_ColumnDef<SchoolModel>[]>(
        () =>
            SchoolTableColumns.map(column => {
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

    const getSchoolsByAccountIDAPI = async () => {
        try {
            const res: any = await masterServices.getSchoolsByAccountID(2);
            setTimeout(() => {
                setLoading(false);
                setSchools(res?.data?.Data ?? []);
            }, 1000);
        } catch (err: any) {
            console.error(err?.message ?? err);
            setLoading(false);
            alert(err?.message ?? 'Failed to fetch account details');
        }
    }

    useEffect(() => {
        getSchoolsByAccountIDAPI();
    }, []);


    const table = useMaterialReactTable({
        columns,
        data: schools,
        state: {
            isLoading: loading,
            showLoadingOverlay: false,
        },
        ...getTableOptions(),
    });


    return <MaterialReactTable table={table} />;
};

export default SchoolTab;
