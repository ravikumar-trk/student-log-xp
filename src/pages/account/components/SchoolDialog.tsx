import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    FormControlLabel,
    Switch,
} from "@mui/material";
import { useEffect, useState } from "react";
import ThemedButton from "../../../common/ThemedButton";

interface SchoolDialogProps {
    open: boolean;
    mode: "add" | "edit";
    school?: any;
    onClose: () => void;
    onSave: (data: any) => void;
}

const defaultForm = {
    SchoolID: 0,
    SchoolName: "",
    SchoolCode: "",
    City: "",
    Status: "Active",
};

const SchoolDialog = ({
    open,
    mode,
    school,
    onClose,
    onSave,
}: SchoolDialogProps) => {
    const [form, setForm] = useState(defaultForm);

    useEffect(() => {
        if (mode === "edit" && school) {
            setForm({
                SchoolID: school.SchoolID,
                SchoolName: school.SchoolName ?? "",
                SchoolCode: school.SchoolCode ?? "",
                City: school.City ?? "",
                Status: school.Status ?? "Active",
            });
        } else {
            setForm(defaultForm);
        }
    }, [school, mode, open]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
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
        onSave(form);
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
                    ? "Add School"
                    : "Edit School"}
            </DialogTitle>

            <DialogContent>
                <Grid
                    container
                    spacing={2}
                    sx={{ mt: 1 }}
                >
                    <Grid size={12}>
                        <TextField
                            fullWidth
                            label="School Name"
                            name="SchoolName"
                            value={form.SchoolName}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            fullWidth
                            label="School Code"
                            name="SchoolCode"
                            value={form.SchoolCode}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            fullWidth
                            label="City"
                            name="City"
                            value={form.City}
                            onChange={handleChange}
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
                            label={
                                form.Status === "Active"
                                    ? "Active"
                                    : "Inactive"
                            }
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
                    text={mode === "add" ? "Close" : "Cancel"}
                    variant="outlined"
                    onClick={onClose}
                />
                <ThemedButton
                    text={mode === "add" ? "Save" : "Update"}
                    variant="contained"
                    onClick={handleSubmit}
                />
            </DialogActions>
        </Dialog>
    );
};

export default SchoolDialog;