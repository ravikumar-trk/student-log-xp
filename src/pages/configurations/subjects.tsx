import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Grid,
    Typography,
} from "@mui/material";
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from "material-react-table";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import ThemedButton from "../../common/ThemedButton";
import { GetTableOptions } from "../../common/tableStyles";
import StatusChip from "../../common/chip/statusChip";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ConfirmationDialog from "../../common/ConfirmationDialog";
import UpsertSubjectDialog, { type Subject } from "./components/UpsertSubjectDialog";
import configurationsServices from "../../services/configurationsServices";
import { showError, showSuccess } from "../../features/common/commonSlice";

const Subjects = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.common.userLoginInfo);
    const [items, setItems] = useState<Subject[]>([]);
    const [edit, setEdit] = useState<Subject | null>(null);
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
    const [loading, setLoading] = useState(false);
    const [deleteSubject, setDeleteSubject] = useState<Subject | null>(null);
    const load = async () => {
        if (!user?.AccountID) return;
        setLoading(true);
        try {
            const response: any = await configurationsServices.getSubjects(user.AccountID, true);
            setItems(response.data?.Result ?? []);
        } catch (error: unknown) {
            dispatch(showError(error instanceof Error ? error.message : "Failed to load subjects"));
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        load();
    }, [user?.AccountID]);
    const handleAdd = () => {
        setDialogMode("add");
        setEdit({
            SubjectID: 0,
            SchoolID: 0,
            SubjectName: "",
            SubjectCode: "",
            IsActive: true,
        });
    };

    const handleEdit = (subject: Subject) => {
        setDialogMode("edit");
        setEdit(subject);
    };
    const deactivate = async (id: number) => {
        try {
            await configurationsServices.deactivateSubject(id);
            dispatch(showSuccess("Subject deactivated"));
            await load();
        } catch (error: unknown) {
            dispatch(showError(error instanceof Error ? error.message : "Failed to deactivate subject"));
        }
    };

    const confirmDeactivate = async () => {
        if (!deleteSubject) return;
        await deactivate(deleteSubject.SubjectID);
        setDeleteSubject(null);
    };

    const columns = useMemo<MRT_ColumnDef<Subject>[]>(
        () => [
            { accessorKey: "SubjectName", header: "Name", size: 240 },
            { accessorKey: "SubjectCode", header: "Code", size: 160 },
            {
                accessorKey: "IsActive",
                header: "Status",
                size: 140,
                Cell: ({ cell }) => (
                    <StatusChip status={cell.getValue<boolean>() ? "Active" : "Inactive"} />
                ),
            },
            {
                id: "actions",
                header: "Actions",
                size: 180,
                Cell: ({ row }) => (
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="Edit subject">
                            <IconButton onClick={() => handleEdit(row.original)} size="small">
                                <EditIcon color="primary" fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        {row.original.IsActive && (
                            <Tooltip title="Deactivate subject">
                                <IconButton onClick={() => setDeleteSubject(row.original)} size="small">
                                    <DeleteOutlineIcon color="error" fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                ),
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data: items,
        state: {
            isLoading: loading,
            showLoadingOverlay: false,
        },
        ...GetTableOptions(),
    });
    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={6}>
                <Typography variant="h5">Subjects</Typography>
            </Grid>
            <Grid size={6} style={{ textAlign: "end" }}>
                <ThemedButton
                    text="Add Subject"
                    icon={<AddIcon />}
                    variant="contained"
                    handleClick={handleAdd}
                />
            </Grid>
            <Grid size={12}>
                <MaterialReactTable table={table} />
            </Grid>
            <UpsertSubjectDialog
                open={!!edit}
                mode={dialogMode}
                subject={edit}
                onClose={() => setEdit(null)}
                onSave={async (subject) => {
                    if (!user?.AccountID) return;
                    try {
                        await configurationsServices.saveSubject({ ...subject, AccountID: user.AccountID });
                        dispatch(showSuccess("Subject saved"));
                        setEdit(null);
                        await load();
                    } catch (error: unknown) {
                        dispatch(showError(error instanceof Error ? error.message : "Failed to save subject"));
                    }
                }}
            />
            <ConfirmationDialog
                open={!!deleteSubject}
                title="Deactivate Subject"
                message={`Are you sure you want to deactivate ${deleteSubject?.SubjectName ?? "this subject"}?`}
                onClose={() => setDeleteSubject(null)}
                onConfirm={confirmDeactivate}
            />
        </Grid>
    );
};
export default Subjects;
