import Grid from "@mui/material/Grid";
import Box from '@mui/material/Box';
import { useStyles } from '../../theme/styles';
import ThemedButton from "../../common/ThemedButton";
import ThemedAutocomplete from "../../common/ThemedAutocomplete";
import * as XLSX from 'xlsx-js-style';
import { SchoolTableColumns, StudentTableColumns, UserTableColumns } from "../../utils/columns";
import { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, type MRT_RowSelectionState, } from 'material-react-table';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { GetTableOptions } from '../../common/tableStyles';
import NoDataImage from '../../assets/images/NoData.svg';
import { IconButton } from "@mui/material";
import type { SchoolModel } from "../../models/SchoolModel";
import type { StudentModel, GetStudentModel } from "../../models/StudentModel";
import type { UserModel } from "../../models/UserModel";
import masterServices from "../../services/masterSerices";
import studentServices from "../../services/studentsServices";


const EditPage = () => {
    const { pageDetailsTitle, noDataImageDivStyle, noDataImageStyle, noDataImageStyleText } = useStyles();

    // Edit type selection
    const [editType, setEditType] = useState<string | null>(null);

    // Schools and classes state
    const [schools, setSchools] = useState<SchoolModel[]>([]);
    const [schoolsLoading, setSchoolsLoading] = useState<boolean>(true);
    const [selectedSchool, setSelectedSchool] = useState<SchoolModel | null>(null);

    const [classes, setClasses] = useState<Array<{ ClassID: number; ClassCode: string }>>([]);
    const [classesLoading, setClassesLoading] = useState<boolean>(true);
    const [selectedClass, setSelectedClass] = useState<{ ClassID: number; ClassCode: string } | null>(null);

    // Data state
    const [users, setUsers] = useState<UserModel[]>([]);
    const [usersLoading, setUsersLoading] = useState<boolean>(true);

    const [schoolList, setSchoolList] = useState<SchoolModel[]>([]);
    const [schoolListLoading, setSchoolListLoading] = useState<boolean>(true);

    const [students, setStudents] = useState<StudentModel[]>([]);
    const [studentsLoading, setStudentsLoading] = useState<boolean>(true);

    // Dialog and selection state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRows, setSelectedRows] = useState<any | null>(null);
    const [uploadedData, setUploadedData] = useState<any[] | null>(null);
    const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

    const editTypeOptions = [
        { value: 'user', label: 'Users' },
        { value: 'school', label: 'Schools' },
        { value: 'student', label: 'Students' }
    ];

    // Fetch schools on mount
    useEffect(() => {
        if (schools.length === 0) {
            getSchoolsAPI();
        }
    }, [schools.length]);

    // Fetch data based on edit type
    useEffect(() => {
        if (!editType) return;

        if (editType === 'user' && users.length === 0) {
            getUsersAPI();
        } else if (editType === 'school' && schoolList.length === 0) {
            getSchoolListAPI();
        } else if (editType === 'student' && students.length === 0) {
            getStudentsAPI();
            if (classes.length === 0) {
                getClassesAPI(0);
            }
        }
    }, [editType, users.length, schoolList.length, students.length, classes.length]);

    // Fetch data based on selected school (for students)
    useEffect(() => {
        if (editType === 'student' && selectedSchool && classes.length === 0) {
            getClassesAPI(selectedSchool.SchoolID);
        }
    }, [selectedSchool, editType, classes.length]);

    // Update selected rows when row selection changes
    useEffect(() => {
        let data: any[] = [];
        if (editType === 'user') data = users;
        else if (editType === 'school') data = schoolList;
        else if (editType === 'student') data = students;

        const selectedData = data.filter((_, index) => rowSelection[index]);
        setSelectedRows(selectedData.length > 0 ? selectedData : null);
    }, [rowSelection, editType, users, schoolList, students]);

    const getSchoolsAPI = async () => {
        if (schools.length > 0) return;
        try {
            const res: any = await masterServices.getSchoolsByAccountID(2);
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

    const getSchoolListAPI = async () => {
        if (schoolList.length > 0) return;
        try {
            const res: any = await masterServices.getSchoolsByAccountID(2);
            setTimeout(() => {
                setSchoolListLoading(false);
                const data = res?.data?.Result ?? [];
                setSchoolList(data);
            }, 1000);
        } catch (err: any) {
            console.error(err?.message ?? err);
            setSchoolListLoading(false);
            alert(err?.message ?? 'Failed to fetch schools');
        }
    };

    const getUsersAPI = async () => {
        if (users.length > 0) return;
        try {
            const res: any = await masterServices.getUsersByAccountID(2);
            setTimeout(() => {
                setUsersLoading(false);
                const data = res?.data?.Result ?? [];
                setUsers(data);
            }, 1000);
        } catch (err: any) {
            console.error(err?.message ?? err);
            setUsersLoading(false);
            alert(err?.message ?? 'Failed to fetch users');
        }
    };

    const getStudentsAPI = async () => {
        if (students.length > 0) return;
        const payload: GetStudentModel = {
            Prefix: '',
            StudentID: 0,
            ClassID: 0,
            SchoolID: selectedSchool?.SchoolID ?? 0,
            AccountID: 2,
            IsDropdown: false,
            LoginUserID: 2,
        };
        try {
            const res: any = await studentServices.getStudentsList(payload);
            setTimeout(() => {
                setStudentsLoading(false);
                setStudents(res?.data?.Result ?? []);
            }, 1000);
        } catch (err: any) {
            console.error(err?.message ?? err);
            setStudentsLoading(false);
            alert(err?.message ?? 'Failed to fetch students');
        }
    };

    const getClassesAPI = async (schoolID: number) => {
        setClassesLoading(true);
        try {
            const res: any = await masterServices.getClassesBySchoolID(2, schoolID);
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

    const handleUploadFileClick = (files?: FileList | null) => {
        if (!files || files.length === 0) {
            console.warn('No file selected');
            return;
        }
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                if (!data) {
                    console.error('Failed to read file data');
                    return;
                }
                const wb = XLSX.read(data, { type: 'array' });
                const firstSheetName = wb.SheetNames[0];
                let expectedSheetName = 'Template';
                if (editType === 'user') expectedSheetName = 'Users';
                else if (editType === 'school') expectedSheetName = 'Schools';
                else if (editType === 'student') expectedSheetName = 'Students';
                if (firstSheetName !== expectedSheetName) {
                    alert(`Please upload an Excel file where the first sheet is named: ${expectedSheetName}`);
                    return;
                }
                const ws = wb.Sheets[firstSheetName];
                const json = XLSX.utils.sheet_to_json(ws, { defval: null });
                console.log('Uploaded Excel parsed JSON:', json);
                setUploadedData(json as any[]);
            } catch (err) {
                console.error('Error parsing Excel file', err);
            }
        };
        reader.onerror = (err) => {
            console.error('FileReader error', err);
        };
        reader.readAsArrayBuffer(file);
    };

    const handleDownload = () => {
        if (selectedRows === null) {
            alert("Please select at least one row to download.");
            return;
        }
        let schema: any[] = [];
        let sheetName = 'Template';
        if (editType === 'user') {
            schema = UserTableColumns;
            sheetName = 'Users';
        } else if (editType === 'school') {
            schema = SchoolTableColumns;
            sheetName = 'Schools';
        } else if (editType === 'student') {
            schema = StudentTableColumns;
            sheetName = 'Students';
        }
        const columns = schema.map(c => c.field);
        const headers = schema.map(c => c.field);
        const wsData = [headers, ...selectedRows.map((row: any) => columns.map(col => row[col] ?? ''))];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        XLSX.writeFile(wb, `${sheetName}_Template.xlsx`);
        setDialogOpen(false);
        setSelectedRows(null);
        setRowSelection({});
    };

    const UploadedDataTable = ({ data, type, loading }: { readonly data: any[]; readonly type: string | null; readonly loading?: boolean; }) => {
        let schema: any[] = [];
        if (type === 'user') schema = UserTableColumns;
        else if (type === 'school') schema = SchoolTableColumns;
        else if (type === 'student') schema = StudentTableColumns;
        const columns = useMemo<MRT_ColumnDef<any>[]>(() => schema.map((c: any) => ({ accessorKey: c.field, header: c.headerName, size: c.width })), [schema]);

        const table = useMaterialReactTable({
            columns,
            data,
            state: {
                isLoading: loading ?? false,
                showLoadingOverlay: false,
            },
            mrtTheme: () => ({
                selectedRowBackgroundColor: '#cf5757ff',
            }),
            ...(GetTableOptions() as any),
        });

        return <MaterialReactTable table={table} />;
    };

    const ModelTable = ({ data, type, loading }: { readonly data: any[]; readonly type: string | null; readonly loading?: boolean; }) => {
        let columns: any[] = [];
        if (type === 'user') columns = UserTableColumns;
        else if (type === 'school') columns = SchoolTableColumns;
        else if (type === 'student') columns = StudentTableColumns;

        const table = useMaterialReactTable({
            columns,
            data,
            enableRowSelection: true,
            getRowId: (row) => row.userId || row.schoolId || row.studentId,
            onRowSelectionChange: setRowSelection,
            state: {
                rowSelection,
                isLoading: loading ?? false,
                showLoadingOverlay: false,
            },
            // renderTopToolbarCustomActions: () => (
            //     type === 'student' ?
            //         (<Grid container spacing={2} sx={{ width: '100%', paddingBottom: 2 }} >
            //             <Grid size={3}>
            //                 <ThemedAutocomplete
            //                     options={schools}
            //                     getOptionLabel={(option: SchoolModel) => option.SchoolName}
            //                     loading={schoolsLoading}
            //                     value={selectedSchool}
            //                     onChange={(_: any, newValue: SchoolModel | null) => {
            //                         setSelectedSchool(newValue);
            //                         setSelectedClass(null);
            //                     }}
            //                     id="school-select"
            //                     label="School"
            //                 />
            //             </Grid>
            //             <Grid size={3}>
            //                 <ThemedAutocomplete
            //                     options={classes}
            //                     getOptionLabel={(option: { ClassID: number; ClassCode: string }) => option.ClassCode}
            //                     loading={classesLoading}
            //                     value={selectedClass}
            //                     onChange={(_: any, newValue: { ClassID: number; ClassCode: string } | null) => {
            //                         setSelectedClass(newValue);
            //                     }}
            //                     id="class-select"
            //                     label="Class"
            //                 />
            //             </Grid>
            //         </Grid >) : null
            // ),
            ...(GetTableOptions() as any),
        });

        return <MaterialReactTable table={table} />;
    };


    return (
        <>
            <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid size={12}>
                    <Typography variant="h5" sx={pageDetailsTitle}>
                        Edit Records
                    </Typography>
                </Grid>
                <Grid size={4}>
                    <ThemedAutocomplete
                        options={editTypeOptions}
                        getOptionLabel={(option: any) => option.label}
                        value={editTypeOptions.find(opt => opt.value === editType) || null}
                        onChange={(_: any, newValue: any) => {
                            setEditType(newValue?.value ?? null);
                            setRowSelection({});
                            setSelectedSchool(null);
                            setSelectedClass(null);
                        }}
                        id="edit-type-select"
                        label="Select Edit Type"
                    />
                </Grid>
                {editType && editType !== 'user' && editType !== 'school' && (
                    <>
                        <Grid size={4}>
                            <ThemedAutocomplete
                                options={schools}
                                getOptionLabel={(option: SchoolModel) => option.SchoolName}
                                loading={schoolsLoading}
                                value={selectedSchool}
                                onChange={(_: any, newValue: SchoolModel | null) => {
                                    setSelectedSchool(newValue);
                                    setSelectedClass(null);
                                }}
                                id="school-select"
                                label="School"
                            />
                        </Grid>
                        <Grid size={4}>
                            <ThemedAutocomplete
                                options={classes}
                                getOptionLabel={(option: { ClassID: number; ClassCode: string }) => option.ClassCode}
                                loading={classesLoading}
                                value={selectedClass}
                                onChange={(_: any, newValue: { ClassID: number; ClassCode: string } | null) => {
                                    setSelectedClass(newValue);
                                }}
                                id="class-select"
                                label="Class"
                            />
                        </Grid>
                    </>
                )}
                <Grid size={12}>
                    {editType ? (
                        <>
                            <>
                                <ModelTable
                                    data={
                                        editType === 'user' ? users :
                                            editType === 'school' ? schoolList :
                                                students
                                    }
                                    type={editType}
                                    loading={
                                        editType === 'user' ? usersLoading :
                                            editType === 'school' ? schoolListLoading :
                                                studentsLoading
                                    }
                                />
                                <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'end', gap: 1 }}>
                                    <ThemedButton
                                        text={selectedRows ? `Download (${selectedRows.length} rows)` : 'Download'}
                                        variant="contained"
                                        handleClick={() => {
                                            if (selectedRows) {
                                                handleDownload();
                                            }
                                        }}
                                        disabled={!selectedRows}
                                    />
                                    {/* <ThemedButton text="Upload File" variant="contained" handleClick={handleUploadFileClick} isFile={true} /> */}
                                </Box>
                                {/* {uploadedData && uploadedData.length > 0 && (
                                    <Box sx={{ marginTop: 2 }}>
                                        <Typography variant="body2">Uploaded Data Preview</Typography>
                                        <UploadedDataTable data={uploadedData} type={editType} loading={false} />
                                    </Box>
                                )} */}
                            </>
                        </>
                    ) :
                        <Box sx={noDataImageDivStyle}>
                            <img src={NoDataImage} alt="No Data" style={noDataImageStyle} />
                            <Typography sx={noDataImageStyleText}>Select Edit Type</Typography>
                        </Box>
                    }
                </Grid>
            </Grid>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {editType === 'user' && 'Select Users to Edit'}
                        {editType === 'school' && 'Select Schools to Edit'}
                        {editType === 'student' && 'Select Students to Edit'}
                    </Box>
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => setDialogOpen(false)}
                    sx={(theme: any) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <ModelTable
                        data={
                            editType === 'user' ? users :
                                editType === 'school' ? schoolList :
                                    students
                        }
                        type={editType}
                        loading={
                            editType === 'user' ? usersLoading :
                                editType === 'school' ? schoolListLoading :
                                    studentsLoading
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Close</Button>
                    <ThemedButton text="Download" variant="contained" handleClick={handleDownload} />
                </DialogActions>
            </Dialog>
        </>
    );
};


export default EditPage;