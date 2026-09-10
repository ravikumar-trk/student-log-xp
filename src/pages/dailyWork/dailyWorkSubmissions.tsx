import { useEffect, useState } from "react";
import { Alert, Box, Button, Grid, Typography } from "@mui/material";
import dailyWorkServices from "../../services/dailyWorkServices";

const DailyWorkSubmissions = () => {
    const [items, setItems] = useState<any[]>([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        dailyWorkServices.getTeacherWork().then((response: any) => setItems(response.data?.Result ?? []));
    }, []);

    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={12}><Typography variant="h5">My Assigned Work</Typography></Grid>
            {message && <Grid size={12}><Alert>{message}</Alert></Grid>}
            {items.map((item) => (
                <Grid size={12} key={item.WorkID}>
                    <Box sx={{ p: 2, border: "1px solid #ddd" }}>
                        <Typography variant="h6">{item.Title}</Typography>
                        <Typography>{item.SubjectName} · {item.WorkType} · {item.WorkDate}</Typography>
                        <Button onClick={async () => {
                            const response: any = await dailyWorkServices.getSubmissions(item.WorkID);
                            setMessage(`${(response.data?.Result ?? []).length} student submissions loaded.`);
                        }}>View submissions</Button>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
};

export default DailyWorkSubmissions;