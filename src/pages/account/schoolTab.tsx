import { useEffect, useState } from "react";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from "material-react-table";

import {
    Grid
} from "@mui/material";
import { GetTableOptions } from "../../common/tableStyles";
import masterServices from "../../services/masterSerices";
import type { SchoolModel } from "../../models/SchoolModel";

import SchoolDialog from "./components/SchoolDialog";
import ConfirmationDialog from "../../common/ConfirmationDialog";
import { getSchoolTableColumns } from "../../utils/configColumns";
import ThemedButton from "../../common/ThemedButton";
import { useAppSelector } from "../../hooks/reduxHooks";

const SchoolTab = () => {
    const [schools, setSchools] = useState<SchoolModel[]>([]);
    const [loading, setLoading] = useState(true);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] =
        useState<"add" | "edit">("add");

    const [selectedSchool, setSelectedSchool] =
        useState<SchoolModel | null>(null);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const userLoginInfo = useAppSelector((state) => state.common.userLoginInfo);

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
        getSchoolsByAccountIDAPI();
    }, []);

    const handleAdd = () => {
        setSelectedSchool(null);
        setDialogMode("add");
        setDialogOpen(true);
    };

    const handleEdit = (school: SchoolModel) => {
        setSelectedSchool(school);
        setDialogMode("edit");
        setDialogOpen(true);
    };

    const handleDelete = (school: SchoolModel) => {
        setSelectedSchool(school);
        setDeleteOpen(true);
    };

    const handleSave = async (data: any) => {
        try {
            if (dialogMode === "add") {
                const response = await masterServices.addSchool(data);
                if (response.status === 200) {
                    alert(response.data.Message);
                    setDialogOpen(false);
                    setSelectedSchool(null);
                    getSchoolsByAccountIDAPI();
                }
                else if (response.status === 202) {
                    alert(response.data.Warnings[0]);
                }
            } else {
                const response = await masterServices.updateSchool(data);
                if (response.status === 200) {
                    alert(response.data.Message);
                    setDialogOpen(false);
                    setSelectedSchool(null);
                    getSchoolsByAccountIDAPI();
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
            if (!selectedSchool) return;

            // await masterServices.deleteSchool(
            //     selectedSchool.SchoolID
            // );

            console.log(
                "Delete School",
                selectedSchool
            );

            setDeleteOpen(false);

            getSchoolsByAccountIDAPI();
        } catch (error) {
            console.error(error);
        }
    };

    const table = useMaterialReactTable({
        columns: getSchoolTableColumns(handleEdit, handleDelete),
        data: schools,
        state: {
            isLoading: loading,
            showLoadingOverlay: false,
        },
        ...GetTableOptions(),
    });

    return (
        <>
            <Grid container justifyContent="flex-end" sx={{ p: 2 }}>
                <ThemedButton text="Add School" variant="contained" onClick={handleAdd} autoFocus />
            </Grid>

            <MaterialReactTable table={table} />

            <SchoolDialog
                open={dialogOpen}
                mode={dialogMode}
                school={selectedSchool}
                onClose={() =>
                    setDialogOpen(false)
                }
                onSave={handleSave}
            />

            <ConfirmationDialog
                open={deleteOpen}
                title="Delete School"
                message={`Are you sure you want to delete ${selectedSchool?.SchoolName ?? ""
                    }?`}
                onClose={() =>
                    setDeleteOpen(false)
                }
                onConfirm={confirmDelete}
            />
        </>
    );
};

export default SchoolTab;