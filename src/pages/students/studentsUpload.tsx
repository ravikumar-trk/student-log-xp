import { useMemo, useState } from 'react';
import * as XLSX from 'xlsx-js-style';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ThemedButton from '../../common/ThemedButton';
import StatusChip from '../../common/chip/statusChip';
import { GetTableOptions } from '../../common/tableStyles';
import studentServices from '../../services/studentsServices';
import { useAppSelector } from '../../hooks/reduxHooks';
import { useNavigate } from 'react-router-dom';
import { StudentTableColumns } from '../../utils/columns.ts';
import { fileNameWithTimestamp } from '../../utils/function';

type UploadedStudent = Record<string, unknown>;

type StudentUploadResult = UploadedStudent & {
    RowNo: number;
    StudentID: number;
    Status: string;
    ErrorMessage?: string | null;
};

const resultColumns = [
    { accessorKey: 'RowNo', header: 'Row No.' },
    {
        accessorKey: 'Status',
        header: 'Status',
        Cell: ({ cell }: any) => <StatusChip status={String(cell.getValue() ?? '')} />,
    },
    { accessorKey: 'ErrorMessage', header: 'Error Message' },
    { accessorKey: 'StudentID', header: 'Student ID' },
    { accessorKey: 'FirstName', header: 'First Name' },
    { accessorKey: 'LastName', header: 'Last Name' },
    { accessorKey: 'SchoolCode', header: 'School Code' },
    { accessorKey: 'ClassCode', header: 'Class Code' },
    { accessorKey: 'AdmissionNo', header: 'Admission No.' },
];

export default function StudentsUpload() {
    const navigate = useNavigate();
    const userLoginInfo = useAppSelector((state) => state.common.userLoginInfo);
    const [uploadedData, setUploadedData] = useState<UploadedStudent[]>([]);
    const [results, setResults] = useState<StudentUploadResult[]>([]);
    const [message, setMessage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [submitOpen, setSubmitOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [uploadInputKey, setUploadInputKey] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState('');

    const uploadedColumns = useMemo<MRT_ColumnDef<UploadedStudent>[]>(() => {
        const fields = uploadedData.length > 0 ? Object.keys(uploadedData[0]) : [];
        return fields.map((field) => ({ accessorKey: field, header: field }));
    }, [uploadedData]);

    const responseColumns = useMemo<MRT_ColumnDef<StudentUploadResult>[]>(
        () => resultColumns.map((column) => ({
            accessorKey: column.accessorKey,
            header: column.header,
            Cell: column.Cell,
        })),
        [],
    );

    const handleUpload = async (files?: FileList | null) => {
        if (!files || files.length === 0) return;
        if (files.length > 1) {
            alert('Please select only one Excel file.');
            return;
        }

        setUploading(true);
        try {
            const file = files[0];
            const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            if (sheetName !== 'Students') {
                alert('Please upload an Excel file where the first sheet is named: Students');
                return;
            }

            const rows = XLSX.utils.sheet_to_json<UploadedStudent>(workbook.Sheets[sheetName], { defval: null });
            setUploadedData(rows);
            setResults([]);
            setMessage('');
            setSelectedFileName(file.name);
        } catch (error) {
            console.error('Error parsing Excel file', error);
            alert('Unable to read the Excel file.');
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragActive(false);
        void handleUpload(event.dataTransfer.files);
    };

    const handleTemplateDownload = () => {
        const headers = StudentTableColumns.map((column) => column.header);
        const worksheet = XLSX.utils.aoa_to_sheet([headers]);
        const headerFill = { patternType: 'solid', fgColor: { rgb: 'FFB8CCE4' } };
        const headerFont = { bold: true };
        const headerAlignment = { vertical: 'center', horizontal: 'center' };

        headers.forEach((_, columnIndex) => {
            const cell = worksheet[XLSX.utils.encode_cell({ c: columnIndex, r: 0 })];
            if (cell) {
                cell.s = {
                    fill: headerFill,
                    font: headerFont,
                    alignment: headerAlignment,
                };
            }
        });

        worksheet['!cols'] = headers.map((header) => ({ wch: Math.max(10, header.length + 6) }));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
        XLSX.writeFile(workbook, fileNameWithTimestamp('students-template', 'xlsx'), {
            bookType: 'xlsx',
            cellStyles: true,
        });
    };

    const handleSubmit = async () => {
        if (uploadedData.length === 0 || submitting) return;

        setSubmitting(true);
        try {
            const response = await studentServices.postStudentsBulk({
                Students: uploadedData,
                AccountID: userLoginInfo.AccountID,
                LoginUserID: userLoginInfo.UserID,
            });
            const responseData = response?.data ?? {};
            setResults(responseData.Result ?? []);
            setMessage(responseData.Message ?? 'Students processed.');
            setSubmitOpen(false);
            setUploadedData([]);
            setSelectedFileName('');
            setUploadInputKey((key) => key + 1);
        } catch (error: any) {
            console.error(error?.message ?? error);
            setMessage(error?.response?.data?.Message ?? error?.message ?? 'Failed to submit students.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleClear = () => {
        setUploadedData([]);
        setResults([]);
        setMessage('');
        setSelectedFileName('');
        setPreviewOpen(false);
        setSubmitOpen(false);
        setUploadInputKey((key) => key + 1);
    };

    const handleClearFile = () => {
        setUploadedData([]);
        setResults([]);
        setMessage('');
        setSelectedFileName('');
        setUploadInputKey((key) => key + 1);
    };

    const uploadedTable = useMaterialReactTable({
        columns: uploadedColumns,
        data: uploadedData,
        ...(GetTableOptions() as any),
    });

    const resultTable = useMaterialReactTable({
        columns: responseColumns,
        data: results,
        ...(GetTableOptions() as any),
    });

    const uploadedCount = uploadedData.length + results.length;
    const createdCount = results.filter((row) => row.Status?.toUpperCase() === 'CREATED').length;
    const updatedCount = results.filter((row) => row.Status?.toUpperCase() === 'UPDATED').length;
    const failedCount = results.filter((row) => ['ERROR', 'FAILED'].includes(row.Status?.toUpperCase())).length;

    let uploadContent: React.ReactNode;
    if (uploading) {
        uploadContent = (
            <>
                <CircularProgress size={42} />
                <Typography variant="h6">Reading Excel file...</Typography>
            </>
        );
    } else if (selectedFileName) {
        uploadContent = (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, maxWidth: '100%' }}>
                <InsertDriveFileOutlinedIcon color="primary" />
                <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedFileName}
                </Typography>
                <Tooltip title="Clear file">
                    <IconButton aria-label="Clear uploaded file" onClick={handleClearFile} size="small">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        );
    } else {
        uploadContent = (
            <>
                <CloudUploadIcon sx={{ fontSize: 44, color: 'primary.main' }} />
                <Typography variant="h6">Drop your Excel file here</Typography>
                <Typography variant="body2" color="text.secondary">Supported formats: .xlsx and .xls</Typography>
            </>
        );
    }

    return (
        <>
            <Grid container spacing={2} sx={{ p: { xs: 2, md: 3 } }}>
                <Grid size={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h5">Student Upload</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ThemedButton
                            text="Download Template"
                            variant="contained"
                            icon={<FileDownloadIcon />}
                            handleClick={handleTemplateDownload}
                        />
                        <ThemedButton text="Back" variant="outlined" handleClick={() => navigate('/students')} />
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 9 }}>
                    <Box
                        onDragEnter={(event) => { event.preventDefault(); setDragActive(true); }}
                        onDragOver={(event) => event.preventDefault()}
                        onDragLeave={(event) => {
                            if (event.currentTarget === event.target) setDragActive(false);
                        }}
                        onDrop={handleDrop}
                        aria-busy={uploading}
                        sx={{
                            minHeight: 220,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            p: 3,
                            border: '1.5px dashed',
                            borderColor: dragActive ? 'primary.main' : '#b8c4c8',
                            backgroundColor: dragActive ? 'rgba(25, 190, 175, 0.08)' : '#fafcfc',
                            transition: 'border-color 0.2s ease, background-color 0.2s ease',
                        }}
                    >
                        {uploadContent}
                        {!uploading && !selectedFileName && (
                            <ThemedButton
                                key={uploadInputKey}
                                text="Choose Excel File"
                                variant="contained"
                                icon={<InsertDriveFileOutlinedIcon />}
                                isFile={true}
                                handleClick={handleUpload}
                            />
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'end', gap: 1, mt: 2 }}>
                        <ThemedButton text="Clear Excel" variant="outlined" handleClick={handleClear} disabled={uploadedData.length === 0 && results.length === 0} />
                        <ThemedButton text="Preview" variant="outlined" handleClick={() => setPreviewOpen(true)} disabled={uploadedData.length === 0} />
                        <ThemedButton text="Submit" variant="contained" handleClick={() => setSubmitOpen(true)} disabled={uploadedData.length === 0 || submitting} />
                    </Box>

                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <Box sx={{ border: '1px solid #d5dfe1', p: 2.5, height: '100%', minHeight: 220 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Upload Summary</Typography>
                        <Box sx={{ display: 'grid', gap: 1.5 }}>
                            {[
                                ['Uploaded', uploadedCount, '#1b6f78'],
                                ['Created', createdCount, '#2e7d32'],
                                ['Updated', updatedCount, '#1976d2'],
                                ['Failed', failedCount, '#c62828'],
                            ].map(([label, value, color]) => (
                                <Box key={label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #edf1f2', pb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">{label}</Typography>
                                    <Typography variant="h5" sx={{ color, fontWeight: 600 }}>{value}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            {message && <Typography sx={{ px: { xs: 2, md: 3 }, pb: 1 }}>{message}</Typography>}
            {results.length > 0 && (
                <Box sx={{ px: { xs: 1, md: 2 }, pb: 2, width: '100%' }}>
                    <MaterialReactTable table={resultTable} />
                </Box>
            )}

            <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="lg" fullWidth>
                <DialogTitle>Uploaded Students Preview</DialogTitle>
                <DialogContent dividers><MaterialReactTable table={uploadedTable} /></DialogContent>
                <DialogActions><Button onClick={() => setPreviewOpen(false)}>Close</Button></DialogActions>
            </Dialog>

            <Dialog open={submitOpen} onClose={() => !submitting && setSubmitOpen(false)} maxWidth="lg" fullWidth>
                <DialogTitle>Submit Students</DialogTitle>
                <DialogContent dividers>
                    <Typography sx={{ mb: 2 }}>Submit {uploadedData.length} uploaded student records?</Typography>
                    <MaterialReactTable table={uploadedTable} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSubmitOpen(false)} disabled={submitting}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={submitting}>{submitting ? 'Submitting...' : 'Confirm Submit'}</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
