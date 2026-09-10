import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Switch,
    TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import ThemedButton from "../../../common/ThemedButton";

export type Subject = {
    SubjectID: number;
    SchoolID: number;
    SubjectName: string;
    SubjectCode: string;
    IsActive: boolean;
};

interface UpsertSubjectDialogProps {
    open: boolean;
    mode: "add" | "edit";
    subject: Subject | null;
    onClose: () => void;
    onSave: (subject: Subject) => void;
}

const defaultSubject: Subject = {
    SubjectID: 0,
    SchoolID: 0,
    SubjectName: "",
    SubjectCode: "",
    IsActive: true,
};

const UpsertSubjectDialog = ({
    open,
    mode,
    subject,
    onClose,
    onSave,
}: UpsertSubjectDialogProps) => {
    const [form, setForm] = useState<Subject>(defaultSubject);

    useEffect(() => {
        setForm(subject ?? defaultSubject);
    }, [subject, open]);

    const handleSubmit = () => {
        if (!form.SubjectName.trim()) return;
        onSave({ ...form, SubjectName: form.SubjectName.trim() });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{mode === "add" ? "Add Subject" : "Edit Subject"}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    fullWidth
                    margin="normal"
                    label="Subject name"
                    value={form.SubjectName}
                    onChange={(event) => setForm((current) => ({ ...current, SubjectName: event.target.value }))}
                    required
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Subject code"
                    value={form.SubjectCode}
                    onChange={(event) => setForm((current) => ({ ...current, SubjectCode: event.target.value }))}
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={form.IsActive}
                            onChange={(event) => setForm((current) => ({ ...current, IsActive: event.target.checked }))}
                        />
                    }
                    label={form.IsActive ? "Active" : "Inactive"}
                />
            </DialogContent>
            <DialogActions>
                <ThemedButton
                    text={mode === "add" ? "Close" : "Cancel"}
                    variant="outlined"
                    onClick={onClose}
                />
                <ThemedButton
                    text={mode === "add" ? "Save" : "Update"}
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!form.SubjectName.trim()}
                />
            </DialogActions>
        </Dialog>
    );
};

export default UpsertSubjectDialog;
