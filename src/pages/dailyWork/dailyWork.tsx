import { useEffect, useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import dailyWorkServices from "../../services/dailyWorkServices";

const today = new Date().toISOString().slice(0, 10);

type DailyWorkItem = {
    AssignmentID: number;
    Title: string;
    SubjectName: string;
    WorkType: string;
    Status: string;
    Description: string;
    TeacherName?: string;
    DueDate?: string;
};

const DailyWork = () => {
    const [items, setItems] = useState<DailyWorkItem[]>([]);
    const [date, setDate] = useState(today);
    const [studentID, setStudentID] = useState(0);

    const loadStudent = async () => {
        if (!studentID) return;
        const response: any = await dailyWorkServices.getStudentWork(studentID, date);
        setItems(response.data?.Result ?? []);
    };

    useEffect(() => {
        if (studentID) loadStudent();
    }, [date, studentID]);

    const submitWork = async (assignmentID: number) => {
        await dailyWorkServices.submit({
            AssignmentID: assignmentID,
            AnswerText: window.prompt("Enter your answer") || "",
        });
        await loadStudent();
    };

    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={12}>
                <Typography variant="h5">Daily Work</Typography>
            </Grid>
            <Grid size={12}>
                <TextField
                    type="date"
                    label="Work date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }}
                />
                <TextField
                    type="number"
                    label="Student ID"
                    value={studentID || ""}
                    onChange={(event) => setStudentID(Number(event.target.value))}
                    sx={{ ml: 2 }}
                />
                <Button onClick={loadStudent}>Load work</Button>
            </Grid>
            {items.map((item) => (
                <Grid size={{ xs: 12, md: 6 }} key={item.AssignmentID}>
                    <Box sx={{ p: 2, border: "1px solid #ddd" }}>
                        <Typography variant="h6">{item.Title}</Typography>
                        <Typography>
                            {item.SubjectName} · {item.WorkType} · {item.Status}
                        </Typography>
                        <Typography sx={{ my: 1 }}>{item.Description}</Typography>
                        <Typography>
                            Teacher: {item.TeacherName || "Teacher"}
                            {item.DueDate ? ` · Due ${item.DueDate}` : ""}
                        </Typography>
                        {(item.Status === "Pending" || item.Status === "Returned") && (
                            <Button onClick={() => submitWork(item.AssignmentID)}>
                                Submit work
                            </Button>
                        )}
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
};

export default DailyWork;
