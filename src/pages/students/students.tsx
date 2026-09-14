import { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx-js-style';
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
    type MRT_RowSelectionState,
} from 'material-react-table';
import { GetTableOptions } from '../../common/tableStyles';
import Grid from '@mui/material/Grid';
// ...existing code...
import ThemedTextField from '../../common/ThemedTextField';
import ThemedAutocomplete from '../../common/ThemedAutocomplete';
import ThemedButton from '../../common/ThemedButton';
import { useNavigate } from 'react-router-dom';
import studentServices from '../../services/studentsServices';
import masterServices from '../../services/masterSerices';
import type { SchoolModel } from '../../models/SchoolModel';
import type { StudentModel, GetStudentModel } from '../../models/StudentModel';
import { StudentTableColumns } from '../../utils/columns.ts';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { setSelectedStudents } from '../../features/dataSlice';



export default function StudentsList() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const selectedStudents = useAppSelector((state) => state.data.selectedStudents);
    const userLoginInfo = useAppSelector((state) => state.common.userLoginInfo);
    const [students, setStudents] = useState<StudentModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [schools, setSchools] = useState<SchoolModel[]>([]);
    const [schoolsLoading, setSchoolsLoading] = useState<boolean>(true);

    const [classes, setClasses] = useState<Array<{ ClassID: number; ClassCode: string }>>([]);
    const [classesLoading, setClassesLoading] = useState<boolean>(true);

    const [selectedSchool, setSelectedSchool] = useState<SchoolModel | null>(null);
    const [selectedClass, setSelectedClass] = useState<{ ClassID: number; ClassCode: string } | null>(null);
    const [admissionNo, setAdmissionNo] = useState('');
    const [studentName, setStudentName] = useState('');

    const getStudentsListAPI = async () => {
        const payload: GetStudentModel = {
            Prefix: '',
            StudentID: 0,
            ClassID: 0,
            SchoolID: 0,
            AccountID: userLoginInfo.AccountID,
            IsDropdown: false,
            LoginUserID: userLoginInfo.UserID,
        };
        try {
            const res: any = await studentServices.getStudentsList(payload);
            setTimeout(() => {
                setLoading(false);
                setStudents(res?.data?.Result ?? []);
            }, 1000);
        } catch (err: any) {
            console.error(err?.message ?? err);
            setLoading(false);
            alert(err?.message ?? 'Failed to fetch account details');
        }
    }

    useEffect(() => {
        getStudentsListAPI();
        getSchoolsAPI();
        getClassesAPI(0); // load all classes initially
    }, []);

    const getSchoolsAPI = async () => {
        try {
            const res: any = await masterServices.getSchoolsByAccountID(userLoginInfo.AccountID);
            setTimeout(() => {
                setSchoolsLoading(false);
                const data = res?.data?.Result ?? [];
                setSchools(data);
            }, 1000);
        } catch (err: any) {
            console.error(err?.message ?? err);
            setSchoolsLoading(false);
            alert(err?.message ?? 'Failed to fetch schools');
        }
    };

    const getClassesAPI = async (schoolID: number) => {
        setClassesLoading(true);
        try {
            const res: any = await masterServices.getClassesBySchoolID(userLoginInfo.AccountID, schoolID);
            setTimeout(() => {
                const studentsForDropdown: StudentModel[] = res?.data?.Result ?? [];
                const map = new Map<number, { ClassID: number; ClassCode: string; IsActive: boolean }>();

                studentsForDropdown.forEach((s) => {
                    if (s.ClassID && s.ClassCode && !map.has(s.ClassID) && s.IsActive) {
                        map.set(s.ClassID, { ClassID: s.ClassID, ClassCode: s.ClassCode, IsActive: s.IsActive });
                    }
                });
                setClasses(Array.from(map.values()));
                setClassesLoading(false);
            }, 500);
        } catch (err: any) {
            console.error(err?.message ?? err);
            setClassesLoading(false);
            alert(err?.message ?? 'Failed to fetch classes');
        }
    };

    const schoolProps = {
        options: schools,
        getOptionLabel: (option: SchoolModel) => option.SchoolName,
        loading: schoolsLoading,
        value: selectedSchool,
        onChange: (_: any, newValue: SchoolModel | null) => {
            setSelectedSchool(newValue);
            setSelectedClass(null);
            getClassesAPI(newValue?.SchoolID ?? 0);
        },
    };

    const classProps = {
        options: classes,
        getOptionLabel: (option: { ClassID: number; ClassCode: string }) => option.ClassCode,
        loading: classesLoading,
        value: selectedClass,
        onChange: (_: any, newValue: { ClassID: number; ClassCode: string } | null) => {
            setSelectedClass(newValue);
        },
    };

    const rowSelection: MRT_RowSelectionState = selectedStudents.reduce<MRT_RowSelectionState>(
        (selection, student) => {
            selection[String(student.StudentID)] = true;
            return selection;
        },
        {},
    );

    const handleRowSelectionChange = (
        updater: MRT_RowSelectionState | ((previous: MRT_RowSelectionState) => MRT_RowSelectionState),
    ) => {
        const nextSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
        const selectedById = new Map(
            selectedStudents.map((student) => [String(student.StudentID), student]),
        );

        students.forEach((student) => {
            const studentId = String(student.StudentID);
            if (nextSelection[studentId]) {
                selectedById.set(studentId, student);
            } else {
                selectedById.delete(studentId);
            }
        });

        dispatch(setSelectedStudents(Array.from(selectedById.values())));
    };

    const handleDownload = () => {
        if (selectedStudents.length === 0) {
            alert('Please select at least one student to download.');
            return;
        }

        const headers = StudentTableColumns.map((column) => column.header);
        const fields = StudentTableColumns.map((column) => column.accessorKey);
        const worksheetData = [
            headers,
            ...selectedStudents.map((student) => fields.map((field) => student[field as keyof StudentModel] ?? '')),
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
        XLSX.writeFile(workbook, 'Students.xlsx');
        dispatch(setSelectedStudents([]));
    };

    const handleClear = () => {
        setSelectedSchool(null);
        setSelectedClass(null);
        setAdmissionNo('');
        setStudentName('');
        dispatch(setSelectedStudents([]));
    };
    // local state for future enhancements (filters) - currently unused


    const columns = useMemo<MRT_ColumnDef<StudentModel>[]>(
        () =>
            StudentTableColumns.map(column => {
                return column;
            }),
        [],
    );


    const table = useMaterialReactTable({
        columns,
        data: students,
        enableRowSelection: true,
        getRowId: (row) => String(row.StudentID),
        onRowSelectionChange: handleRowSelectionChange,
        state: {
            rowSelection,
            isLoading: loading,
            showLoadingOverlay: false,
        },
        ...(GetTableOptions() as any),
    });


    return <>
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <ThemedAutocomplete
                    {...schoolProps}
                    id="school-select"
                    disableCloseOnSelect
                    label="School"
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <ThemedAutocomplete
                    {...classProps}
                    id="class-select"
                    disableCloseOnSelect
                    label="Class"
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <ThemedTextField
                    id="standard-basic"
                    label="Admission No."
                    variant="standard"
                    fullWidth={true}
                    value={admissionNo}
                    onChange={(event) => setAdmissionNo(event.target.value)}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <ThemedTextField
                    id="standard-basic"
                    label="Student Name"
                    variant="standard"
                    fullWidth={true}
                    value={studentName}
                    onChange={(event) => setStudentName(event.target.value)}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }} style={{ textAlign: 'right' }}>
                <ThemedButton text="Clear" variant="outlined" handleClick={handleClear} /> &nbsp;&nbsp;
                <ThemedButton text="Search" variant="contained" /> &nbsp;&nbsp;
                <ThemedButton
                    text="Upload"
                    variant="contained"
                    handleClick={() => navigate('/students/upload')}
                /> &nbsp;&nbsp;
                <ThemedButton
                    text={selectedStudents.length > 0 ? `Download (${selectedStudents.length})` : 'Download'}
                    variant="contained"
                    handleClick={handleDownload}
                    disabled={selectedStudents.length === 0}
                />
            </Grid>
        </Grid>
        <MaterialReactTable table={table} />
    </>;
}
