import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@mui/material";

interface Props {
    open: boolean;
    title?: string;
    message?: string;
    onConfirm: () => void;
    onClose: () => void;
}

const ConfirmationDialog = ({
    open,
    title = "Confirm",
    message = "Are you sure?",
    onConfirm,
    onClose,
}: Props) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>

            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={onConfirm}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;