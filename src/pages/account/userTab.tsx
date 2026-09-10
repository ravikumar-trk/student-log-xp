import { useEffect, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { GetTableOptions } from '../../common/tableStyles';
import type { UserModel } from '../../models/UserModel';
// import { UserTableColumns } from '../../utils/columns.ts'
import { getUserTableColumns } from "../../utils/configColumns";
import masterServices from '../../services/masterSerices';
import { useAppSelector } from '../../hooks/reduxHooks';
import { Grid } from '@mui/material';
import ThemedButton from '../../common/ThemedButton';
import ConfirmationDialog from '../../common/ConfirmationDialog';
import UserDialog from './components/userDialog';
import type { SchoolModel } from '../../models/SchoolModel';

const UserTab = () => {
    const [users, setUsers] = useState<UserModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] =
        useState<"add" | "edit">("add");

    const [selectedUser, setSelectedUser] =
        useState<UserModel | null>(null);
    const [schools, setSchools] = useState<SchoolModel[]>([]);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const userLoginInfo = useAppSelector((state) => state.common.userLoginInfo);

    const getUsersByAccountIDAPI = async () => {
        try {
            const res: any = await masterServices.getUsersByAccountID(userLoginInfo.AccountID, -1);
            setTimeout(() => {
                setLoading(false);
                setUsers(res?.data?.Result ?? []);
            }, 1000);
        } catch (err: any) {
            console.error(err?.message ?? err);
            setLoading(false);
            alert(err?.message ?? 'Failed to fetch account details');
        }
    }

    const getSchoolsByAccountIDAPI = async () => {
        try {
            setLoading(true);
            // -1 to fetch active & inactive schools
            const res: any =
                await masterServices.getSchoolsByAccountID(userLoginInfo.AccountID, -1);

            setSchools(res?.data?.Result ?? []);
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUsersByAccountIDAPI();
    }, []);

    const handleAdd = () => {
        getSchoolsByAccountIDAPI();
        setSelectedUser(null);
        setDialogMode("add");
        setDialogOpen(true);
    };

    const handleEdit = (user: UserModel) => {
        getSchoolsByAccountIDAPI();
        setSelectedUser(user);
        setDialogMode("edit");
        setDialogOpen(true);
    };

    const handleDelete = (user: UserModel) => {
        setSelectedUser(user);
        setDeleteOpen(true);
    };

    const handleSave = async (data: any) => {
        try {
            if (dialogMode === "add") {
                const response = await masterServices.addUser(data);
                if (response.status === 200) {
                    alert(response.data.Message);
                    setDialogOpen(false);
                    setSelectedUser(null);
                    getUsersByAccountIDAPI();
                }
                else if (response.status === 202) {
                    alert(response.data.Warnings[0]);
                }
            } else {
                const response = await masterServices.updateUser(data);
                if (response.status === 200) {
                    alert(response.data.Message);
                    setDialogOpen(false);
                    setSelectedUser(null);
                    getUsersByAccountIDAPI();
                }
                else if (response.status === 202) {
                    alert(response.data.Warnings[0]);
                }

            }
        } catch (error) {
            console.error(error);
        }
    };

    const confirmDelete = async () => {
        try {
            if (!selectedUser) return;

            // await masterServices.deleteUser(
            //     selectedUser.UserID
            // );

            console.log(
                "Delete User",
                selectedUser
            );

            setDeleteOpen(false);

            getUsersByAccountIDAPI();
        } catch (error) {
            console.error(error);
        }
    };

    const table = useMaterialReactTable({
        columns: getUserTableColumns(handleEdit, handleDelete),
        data: users,
        state: {
            isLoading: loading,
            showLoadingOverlay: false,
        },
        ...GetTableOptions(),
    });

    return (
        <>
            <Grid container justifyContent="flex-end" sx={{ p: 2 }}>
                <ThemedButton text="Add User" variant="contained" onClick={handleAdd} autoFocus />
            </Grid>
            <MaterialReactTable table={table} />
            <UserDialog
                open={dialogOpen}
                mode={dialogMode}
                schools={schools}
                user={selectedUser}
                onClose={() =>
                    setDialogOpen(false)
                }
                onSave={handleSave}
            />

            <ConfirmationDialog
                open={deleteOpen}
                title="Delete User"
                message={`Are you sure you want to delete ${selectedUser?.UserName ?? ""
                    }?`}
                onClose={() =>
                    setDeleteOpen(false)
                }
                onConfirm={confirmDelete}
            />
        </>
    );
};

export default UserTab;
