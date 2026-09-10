import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { useAppSelector } from "../../hooks/reduxHooks";
import masterServices from "../../services/masterSerices";
import dailyWorkServices from "../../services/dailyWorkServices";
import ThemedButton from "../../common/ThemedButton";
import configurationsServices from "../../services/configurationsServices";

const today = new Date().toISOString().slice(0, 10);

const DailyWorkAssign = () => {
    const user = useAppSelector((state) => state.common.userLoginInfo);
    const [schools, setSchools] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [schoolID, setSchoolID] = useState(0);
    const [classID, setClassID] = useState(0);
    const [subjectID, setSubjectID] = useState(0);
    const [date, setDate] = useState(today);
    const [selected, setSelected] = useState<number[]>([]);
    const [entireClass, setEntireClass] = useState(true);
    const [message, setMessage] = useState("");
    const [form, setForm] = useState({
        WorkType: "Homework",
        Title: "",
        Description: "",
        DueDate: "",
        DueTime: "",
    });

    useEffect(() => {
        masterServices
            .getSchoolsByAccountID(user?.AccountID || 0)
            .then((response: any) => {
                const data = response.data?.Result ?? [];
                setSchools(data);
                if (data[0]) chooseSchool(data[0].SchoolID);
            });
    }, [user?.AccountID]);

    const chooseSchool = async (id: number) => {
        setSchoolID(id);
        setClassID(0);
        setSubjects([]);
        const [classesResponse, subjectsResponse] = await Promise.all([
            masterServices.getClassesBySchoolID(user?.AccountID || 0, id),
            configurationsServices.getSubjectsBySchool(id),
        ]);
        setClasses(classesResponse.data?.Result ?? []);
        setSubjects(subjectsResponse.data?.Result ?? []);
    };

    const chooseClass = async (id: number) => {
        setClassID(id);
        const response: any = await (
            await import("../../services/studentsServices")
        ).default.getStudentsList({
            Prefix: "",
            StudentID: 0,
            SchoolID: schoolID,
            ClassID: id,
            AccountID: user?.AccountID || 0,
            LoginUserID: user?.UserID || 0,
            IsDropdown: true,
        });
        setStudents(response.data?.Result ?? []);
    };

    const assign = async () => {
        if (
            !schoolID ||
            !classID ||
            !subjectID ||
            !form.Title.trim() ||
            (!entireClass && selected.length === 0)
        ) {
            setMessage(
                "School, class, subject, title, date, and recipients are required.",
            );
            return;
        }
        await dailyWorkServices.assign({
            ...form,
            SchoolID: schoolID,
            ClassID: classID,
            SubjectID: subjectID,
            WorkDate: date,
            DueDate: form.DueDate || null,
            DueTime: form.DueTime || null,
            EntireClass: entireClass,
            StudentIDs: selected,
        });
        setMessage("Work assigned successfully.");
        setForm({
            WorkType: "Homework",
            Title: "",
            Description: "",
            DueDate: "",
            DueTime: "",
        });
    };

    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={12}>
                <Typography variant="h5">Assign Daily Work</Typography>
            </Grid>
            {message && (
                <Grid size={12}>
                    <Alert>{message}</Alert>
                </Grid>
            )}
            <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                    <InputLabel>School</InputLabel>
                    <Select
                        value={schoolID}
                        label="School"
                        onChange={(event) => chooseSchool(Number(event.target.value))}
                    >
                        {schools.map((school) => (
                            <MenuItem key={school.SchoolID} value={school.SchoolID}>
                                {school.SchoolName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                    <InputLabel>Class</InputLabel>
                    <Select
                        value={classID}
                        label="Class"
                        onChange={(event) => chooseClass(Number(event.target.value))}
                    >
                        {classes.map((item) => (
                            <MenuItem key={item.ClassID} value={item.ClassID}>
                                {item.ClassName || item.ClassCode}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                    <InputLabel>Subject</InputLabel>
                    <Select
                        value={subjectID}
                        label="Subject"
                        onChange={(event) => setSubjectID(Number(event.target.value))}
                    >
                        {subjects.map((item) => (
                            <MenuItem key={item.SubjectID} value={item.SubjectID}>
                                {item.SubjectName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                    fullWidth
                    type="date"
                    label="Work date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                    fullWidth
                    label="Title"
                    value={form.Title}
                    onChange={(event) => setForm({ ...form, Title: event.target.value })}
                    required
                />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                    fullWidth
                    select
                    label="Work type"
                    value={form.WorkType}
                    onChange={(event) =>
                        setForm({ ...form, WorkType: event.target.value })
                    }
                >
                    <MenuItem value="Homework">Homework</MenuItem>
                    <MenuItem value="Classwork">Classwork</MenuItem>
                    <MenuItem value="Task">Task</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                </TextField>
            </Grid>
            <Grid size={12}>
                <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label="Description / instructions"
                    value={form.Description}
                    onChange={(event) =>
                        setForm({ ...form, Description: event.target.value })
                    }
                    required
                />
            </Grid>
            <Grid size={12}>
                <TextField
                    type="date"
                    label="Due date"
                    value={form.DueDate}
                    onChange={(event) =>
                        setForm({ ...form, DueDate: event.target.value })
                    }
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={{ mr: 2 }}
                />
                <TextField
                    type="time"
                    label="Due time"
                    value={form.DueTime}
                    onChange={(event) =>
                        setForm({ ...form, DueTime: event.target.value })
                    }
                    slotProps={{ inputLabel: { shrink: true } }}
                />
            </Grid>
            <Grid size={12}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={entireClass}
                            onChange={(event) => setEntireClass(event.target.checked)}
                        />
                    }
                    label="Assign to entire class"
                />
                {!entireClass && (
                    <Box sx={{ maxHeight: 180, overflow: "auto" }}>
                        {students.map((student) => (
                            <FormControlLabel
                                key={student.StudentID}
                                control={
                                    <Checkbox
                                        checked={selected.includes(student.StudentID)}
                                        onChange={() =>
                                            setSelected((old) =>
                                                old.includes(student.StudentID)
                                                    ? old.filter((id) => id !== student.StudentID)
                                                    : [...old, student.StudentID],
                                            )
                                        }
                                    />
                                }
                                label={student.StudentName}
                            />
                        ))}
                    </Box>
                )}
            </Grid>
            <Grid size={12}>
                <ThemedButton
                    text="Assign Work"
                    variant="contained"
                    handleClick={assign}
                />
            </Grid>
        </Grid>
    );
};

export default DailyWorkAssign;
