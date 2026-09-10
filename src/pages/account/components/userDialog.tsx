import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    FormControlLabel,
    Switch,
} from "@mui/material";
import { useEffect, useState } from "react";

import ThemedButton from "../../../common/ThemedButton";
import ThemedAutocomplete from "../../../common/ThemedAutocomplete";
import ThemedTextField from "../../../common/ThemedTextField";

interface UserDialogProps {
    open: boolean;
    mode: "add" | "edit";
    schools: any[];
    user?: any;
    onClose: () => void;
    onSave: (data: any) => void;
}

interface School {
    SchoolID: number;
    SchoolName: string;
}

interface UserForm {
    UserID: number;
    UserName: string;
    Email: string;
    SelectedSchools: School[];
    Status: string;
}

const defaultForm: UserForm = {
    UserID: 0,
    UserName: "",
    Email: "",
    SelectedSchools: [],
    Status: "Active"
};

const UserDialog = ({
    open,
    mode,
    schools = [],
    user,
    onClose,
    onSave,
}: UserDialogProps) => {
    const [form, setForm] = useState<UserForm>(defaultForm);

    useEffect(() => {
        if (mode === "edit" && user) {
            var _selectedSchools = [];

            if (Array.isArray(user.SchoolIDs)) {
                _selectedSchools = schools.filter((school) =>
                    user.SchoolIDs.includes(school.SchoolID)
                );
            } else if (typeof user.SchoolIDs === "string") {
                const schoolIds = user.SchoolIDs.split(",").map(Number);

                _selectedSchools = schools.filter((school) =>
                    schoolIds.includes(school.SchoolID)
                );
            }

            setForm({
                UserID: user.UserID ?? 0,
                UserName: user.UserName ?? "",
                Email: user.Email ?? "",
                SelectedSchools: _selectedSchools,
                Status: user.Status ?? "Active",
            });
        } else {
            setForm(defaultForm);
        }
    }, [user, mode, open, schools]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSchoolChange = (
        _: any,
        selectedSchools: any[]
    ) => {
        setForm((prev) => ({
            ...prev,
            SelectedSchools: selectedSchools,
        }));
    };

    const handleStatusChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setForm((prev) => ({
            ...prev,
            Status: event.target.checked
                ? "Active"
                : "Inactive",
        }));
    };

    const handleClear = () => {
        setForm(defaultForm);
    };

    const handleSubmit = () => {
        const payload = {
            UserID: form.UserID,
            UserName: form.UserName,
            Email: form.Email,
            SchoolIDs: form.SelectedSchools.map(
                (school: any) => school.SchoolID
            ).join(","),
            SchoolNames: form.SelectedSchools.map(
                (school: any) => school.SchoolName
            ).join(","),
            Status: form.Status,
        };

        onSave(payload);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                {mode === "add"
                    ? "Add User"
                    : "Edit User"}
            </DialogTitle>

            <DialogContent>
                <Grid
                    container
                    spacing={2}
                    sx={{ mt: 1 }}
                >
                    <Grid size={12}>
                        <ThemedTextField
                            id="username-input"
                            variant="standard"
                            fullWidth
                            label="User Name"
                            name="UserName"
                            value={form.UserName}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid size={12}>
                        <ThemedTextField
                            id="email-input"
                            variant="standard"
                            fullWidth
                            label="Email"
                            name="Email"
                            value={form.Email}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid size={12}>
                        <ThemedAutocomplete
                            isMultiSelect
                            label="Schools"
                            options={schools}
                            value={form.SelectedSchools}
                            getOptionLabel={(option: any) =>
                                option?.SchoolName ?? ""
                            }
                            isOptionEqualToValue={(
                                option: any,
                                value: any
                            ) =>
                                option.SchoolID ===
                                value.SchoolID
                            }
                            onChange={handleSchoolChange}
                        />
                    </Grid>

                    <Grid size={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={
                                        form.Status ===
                                        "Active"
                                    }
                                    onChange={
                                        handleStatusChange
                                    }
                                />
                            }
                            label={form.Status}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                {mode === "add" && (
                    <Button
                        color="secondary"
                        onClick={handleClear}
                    >
                        Clear
                    </Button>
                )}

                <ThemedButton
                    text={
                        mode === "add"
                            ? "Close"
                            : "Cancel"
                    }
                    variant="outlined"
                    onClick={onClose}
                />

                <ThemedButton
                    text={
                        mode === "add"
                            ? "Save"
                            : "Update"
                    }
                    variant="contained"
                    onClick={handleSubmit}
                />
            </DialogActions>
        </Dialog>
    );
};

export default UserDialog;