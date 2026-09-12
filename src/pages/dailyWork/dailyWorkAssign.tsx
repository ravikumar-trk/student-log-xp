import { useEffect, useState } from "react";
import {
    Box,
    Checkbox,
    FormControlLabel,
    Grid,
    Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import masterServices from "../../services/masterSerices";
import dailyWorkServices from "../../services/dailyWorkServices";
import ThemedAutocomplete from "../../common/ThemedAutocomplete";
import ThemedButton from "../../common/ThemedButton";
import ThemedTextField from "../../common/ThemedTextField";
import configurationsServices from "../../services/configurationsServices";
import {
    showError,
    showSuccess,
    showWarning,
} from "../../features/common/commonSlice";

const today = new Date().toISOString().slice(0, 10);

const DailyWorkAssign = () => {
    const dispatch = useAppDispatch();
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
    const [form, setForm] = useState({
        WorkType: "Homework",
        Title: "",
        Description: "",
    });

    useEffect(() => {
        masterServices
            .getSchoolsByAccountID(user?.AccountID || 0)
            .then((response: any) => {
                const data = response.data?.Result ?? [];
                setSchools(data);
                if (data[0]) chooseSchool(data[0].SchoolID);
            })
            .catch((error: unknown) => {
                dispatch(showError(error instanceof Error ? error.message : "Failed to fetch schools"));
            });
    }, [user?.AccountID]);

    const chooseSchool = async (id: number) => {
        setSchoolID(id);
        setClassID(0);
        setSubjectID(0);
        setStudents([]);
        setSelected([]);
        if (!id) {
            setClasses([]);
            setSubjects([]);
            return;
        }
        setSubjects([]);
        try {
            const [classesResponse, subjectsResponse] = await Promise.all([
                masterServices.getClassesBySchoolID(user?.AccountID || 0, id),
                configurationsServices.getSubjectsBySchool(id),
            ]);
            setClasses(classesResponse.data?.Result ?? []);
            setSubjects(subjectsResponse.data?.Result ?? []);
        } catch (error: unknown) {
            dispatch(showError(error instanceof Error ? error.message : "Failed to load school configuration"));
        }
    };

    const chooseClass = async (id: number) => {
        setClassID(id);
        setSelected([]);
        if (!id) {
            setStudents([]);
            return;
        }
        try {
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
        } catch (error: unknown) {
            dispatch(showError(error instanceof Error ? error.message : "Failed to fetch students"));
        }
    };

    const assign = async () => {
        if (
            !schoolID ||
            !classID ||
            !subjectID ||
            !form.Title.trim() ||
            (!entireClass && selected.length === 0)
        ) {
            dispatch(showWarning("School, class, subject, title, date, and recipients are required."));
            return;
        }
        try {
            await dailyWorkServices.assign({
                ...form,
                SchoolID: schoolID,
                ClassID: classID,
                SubjectID: subjectID,
                WorkDate: date,
                EntireClass: entireClass,
                StudentIDs: selected,
            });
            dispatch(showSuccess("Work assigned successfully"));
            setForm({
                WorkType: "Homework",
                Title: "",
                Description: "",
            });
        } catch (error: unknown) {
            dispatch(showError(error instanceof Error ? error.message : "Failed to assign work"));
        }
    };

    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={12}>
                <Typography variant="h5">Assign Daily Work</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <ThemedAutocomplete
                    options={schools}
                    getOptionLabel={(school) => school.SchoolName}
                    value={schools.find((school) => school.SchoolID === schoolID) ?? null}
                    onChange={(_event, school) => chooseSchool(school?.SchoolID ?? 0)}
                    label="School"
                />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <ThemedAutocomplete
                    options={classes}
                    getOptionLabel={(item) => item.ClassName || item.ClassCode || ""}
                    value={classes.find((item) => item.ClassID === classID) ?? null}
                    onChange={(_event, item) => chooseClass(item?.ClassID ?? 0)}
                    label="Class"
                    disabled={!schoolID}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <ThemedAutocomplete
                    options={subjects}
                    getOptionLabel={(item) => item.SubjectName}
                    value={subjects.find((item) => item.SubjectID === subjectID) ?? null}
                    onChange={(_event, item) => setSubjectID(item?.SubjectID ?? 0)}
                    label="Subject"
                    disabled={!schoolID}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Work date"
                        value={date ? dayjs(date) : null}
                        onChange={(newValue) => setDate(newValue?.format("YYYY-MM-DD") ?? "")}
                        enableAccessibleFieldDOMStructure={false}
                        slots={{ textField: ThemedTextField }}
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                </LocalizationProvider>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <ThemedTextField
                    fullWidth
                    label="Title"
                    value={form.Title}
                    onChange={(event) => setForm({ ...form, Title: event.target.value })}
                    required
                />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <ThemedAutocomplete
                    options={["Homework", "Classwork", "Task", "Other"]}
                    value={form.WorkType}
                    onChange={(_event, workType) =>
                        setForm({ ...form, WorkType: workType ?? "Homework" })
                    }
                    label="Work type"
                />
            </Grid>
            <Grid size={12}>
                <ThemedTextField
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
