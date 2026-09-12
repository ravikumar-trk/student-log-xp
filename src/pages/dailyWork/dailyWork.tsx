import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Grid,
    Typography,
} from "@mui/material";
import dailyWorkServices from "../../services/dailyWorkServices";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import ThemedAutocomplete from "../../common/ThemedAutocomplete";
import ThemedButton from "../../common/ThemedButton";
import masterServices from "../../services/masterSerices";
import studentServices from "../../services/studentsServices";
import type { SchoolModel } from "../../models/SchoolModel";
import type { StudentModel, GetStudentModel } from "../../models/StudentModel";
import RoutePaths from "../../utils/routes";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
    showError,
    showSuccess,
    showWarning,
} from "../../features/common/commonSlice";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

type DailyWorkClass = {
    ClassID: number;
    ClassCode?: string;
    ClassName?: string;
};

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
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const userLoginInfo = useAppSelector((state) => state.common.userLoginInfo);
    const [items, setItems] = useState<DailyWorkItem[]>([]);
    const [value, onChange] = useState<Value>(new Date());
    const [schools, setSchools] = useState<SchoolModel[]>([]);
    const [classes, setClasses] = useState<DailyWorkClass[]>([]);
    const [students, setStudents] = useState<StudentModel[]>([]);
    const [selectedSchool, setSelectedSchool] = useState<SchoolModel | null>(null);
    const [selectedClass, setSelectedClass] = useState<DailyWorkClass | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<StudentModel | null>(null);
    const [schoolsLoading, setSchoolsLoading] = useState(true);
    const [classesLoading, setClassesLoading] = useState(false);
    const [studentsLoading, setStudentsLoading] = useState(false);

    useEffect(() => {
        const loadSchools = async () => {
            try {
                const response = await masterServices.getSchoolsByAccountID(userLoginInfo.AccountID);
                setSchools(response.data?.Result ?? []);
            } catch (error: unknown) {
                dispatch(showError(error instanceof Error ? error.message : "Failed to fetch schools"));
            } finally {
                setSchoolsLoading(false);
            }
        };

        if (userLoginInfo.AccountID) {
            loadSchools();
        }
    }, [dispatch, userLoginInfo.AccountID]);

    const loadClasses = async (schoolID: number) => {
        setClassesLoading(true);
        try {
            const response = await masterServices.getClassesBySchoolID(
                userLoginInfo.AccountID,
                schoolID,
            );
            setClasses(response.data?.Result ?? []);
        } catch (error: unknown) {
            dispatch(showError(error instanceof Error ? error.message : "Failed to fetch classes"));
        } finally {
            setClassesLoading(false);
        }
    };

    const loadStudents = async (schoolID: number, classID: number) => {
        setStudentsLoading(true);
        try {
            const payload: GetStudentModel = {
                Prefix: "",
                StudentID: 0,
                SchoolID: schoolID,
                ClassID: classID,
                AccountID: userLoginInfo.AccountID,
                IsDropdown: true,
                LoginUserID: userLoginInfo.UserID,
            };
            const response = await studentServices.getStudentsList(payload);
            setStudents(response.data?.Result ?? []);
        } catch (error: unknown) {
            dispatch(showError(error instanceof Error ? error.message : "Failed to fetch students"));
        } finally {
            setStudentsLoading(false);
        }
    };

    const loadStudent = async () => {
        if (!selectedSchool || !selectedClass || !selectedStudent) {
            dispatch(showWarning("Select a school, class, and student before searching"));
            return;
        }

        if (!(value instanceof Date)) {
            dispatch(showWarning("Select a work date before searching"));
            return;
        }

        try {

            const response = await dailyWorkServices.getStudentWork(
                selectedSchool.SchoolID,
                selectedClass.ClassID,
                selectedStudent?.StudentID ?? null,
                // Convert the date to ISO string format for the API request yyyy-mm-dd
                value.toISOString().split("T")[0]
            );
            setItems(response.data?.Result ?? []);
        } catch (error: unknown) {
            dispatch(showError(error instanceof Error ? error.message : "Failed to fetch daily work"));
        }
    };

    const submitWork = async (assignmentID: number) => {
        const answerText = window.prompt("Enter your answer");
        if (!answerText?.trim()) {
            dispatch(showWarning("Enter an answer before submitting work"));
            return;
        }

        try {
            await dailyWorkServices.submit({
                AssignmentID: assignmentID,
                AnswerText: answerText,
            });
            dispatch(showSuccess("Work submitted successfully"));
            await loadStudent();
        } catch (error: unknown) {
            dispatch(showError(error instanceof Error ? error.message : "Failed to submit work"));
        }
    };

    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={12}>
                <Typography variant="h5">Daily Work</Typography>
            </Grid>
            <Grid size={12}>
                <Calendar onChange={onChange} value={value} />
            </Grid>
            <Grid container size={12} spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <ThemedAutocomplete
                        options={schools}
                        getOptionLabel={(option: SchoolModel) => option.SchoolName}
                        loading={schoolsLoading}
                        value={selectedSchool}
                        onChange={(_event, newValue: SchoolModel | null) => {
                            setSelectedSchool(newValue);
                            setSelectedClass(null);
                            setSelectedStudent(null);
                            setStudents([]);
                            setClasses([]);
                            if (newValue) {
                                loadClasses(newValue.SchoolID);
                            }
                        }}
                        label="School"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <ThemedAutocomplete
                        options={classes}
                        getOptionLabel={(option: DailyWorkClass) => option.ClassName || option.ClassCode || ""}
                        loading={classesLoading}
                        value={selectedClass}
                        onChange={(_event, newValue: DailyWorkClass | null) => {
                            setSelectedClass(newValue);
                            setSelectedStudent(null);
                            setStudents([]);
                            if (newValue && selectedSchool) {
                                loadStudents(selectedSchool.SchoolID, newValue.ClassID);
                            }
                        }}
                        label="Class"
                        disabled={!selectedSchool}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <ThemedAutocomplete
                        options={students}
                        getOptionLabel={(option: StudentModel) => option.StudentName}
                        loading={studentsLoading}
                        value={selectedStudent}
                        onChange={(_event, newValue: StudentModel | null) => setSelectedStudent(newValue)}
                        label="Student"
                        disabled={!selectedClass}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: "flex", gap: 1 }}>
                    <Button variant="contained" onClick={loadStudent} disabled={!selectedStudent}>
                        Search
                    </Button>
                    <ThemedButton
                        text="Add Work"
                        variant="outlined"
                        handleClick={() => navigate(RoutePaths.AssignWork)}
                    />
                </Grid>
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
