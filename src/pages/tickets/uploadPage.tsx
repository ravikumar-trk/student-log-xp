import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ThemedButton from "../../common/ThemedButton";
import ThemedAutocomplete from "../../common/ThemedAutocomplete";
import ThemedTextField from "../../common/ThemedTextField";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ClearIcon from "@mui/icons-material/Clear";
import SendIcon from "@mui/icons-material/Send";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import * as XLSX from "xlsx";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useNavigate } from "react-router-dom";
import { useStyles } from "../../theme/styles";
import RoutePaths from "../../utils/routes";
import type { SchoolModel } from "../../models/SchoolModel";
import masterServices from "../../services/masterSerices";
import ticketsSerices from "../../services/ticketsSerices";
import { StudentTableColumns, SchoolTableColumns, UserTableColumns } from "../../utils/columns";
import { fileNameWithTimestamp } from "../../utils/function";

const UploadPage = () => {
    const { pageDetailsTitle } = useStyles();
    const navigate = useNavigate();

    // School dropdown state
    const [schools, setSchools] = useState<SchoolModel[]>([]);
    const [schoolsLoading, setSchoolsLoading] = useState<boolean>(true);
    const [selectedSchool, setSelectedSchool] = useState<SchoolModel | null>(null);

    // Ticket form state
    const [ticketType, setTicketType] = useState<string | null>(null);
    const [priority, setPriority] = useState<string | null>(null);
    const [ticketDescription, setTicketDescription] = useState<string>("");

    // Excel upload state
    const [excelData, setExcelData] = useState<any[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [showPreview, setShowPreview] = useState<boolean>(false);

    // Template download menu state
    const id = React.useId();
    const buttonId = `${id}-button`;
    const menuId = `${id}-menu`;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    // Ticket type and priority options
    const ticketTypeOptions = [
        { value: 'attendance', label: 'Attendance' },
        { value: 'student_create', label: 'Student Create' },
        { value: 'user_create', label: 'User Create' },
        { value: 'school_create', label: 'School Create' }
    ];

    const priorityOptions = [
        { value: 'Low', label: 'Low' },
        { value: 'Medium', label: 'Medium' },
        { value: 'High', label: 'High' }
    ];

    // Fetch schools on component mount
    useEffect(() => {
        getSchoolsAPI();
    }, []);

    const getSchoolsAPI = async () => {
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

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const navigateBack = () => {
        navigate(RoutePaths.NewTicket);
    };

    /* -------- Template Download -------- */
    const handleTemplateDownload = (templateType: string) => {
        setAnchorEl(null);

        // generate and download an XLSX template based on the type of entity
        const getColumns = () => {
            if (templateType === 'user') return UserTableColumns.filter((a: any) => !a.excelIgnore).map(c => c.header)
            else if (templateType === 'school') return SchoolTableColumns.filter((a: any) => !a.excelIgnore).map(c => c.header);
            else if (templateType === 'student') return StudentTableColumns.filter((a: any) => !a.excelIgnore).map(c => c.header);
        };

        const cols: any = getColumns();

        // Build worksheet data: header row only
        const data: any = [cols];
        const ws = XLSX.utils.aoa_to_sheet(data);

        // Style header cells and set widths
        // SheetJS requires patternType:'solid' for fills to take effect
        const headerFill = { patternType: 'solid', fgColor: { rgb: 'FFB8CCE4' } }; // light blue
        const headerFont = { bold: true };
        const headerAlignment = { vertical: 'center', horizontal: 'center' } as any;

        // set styles per header cell using xlsx-js-style
        for (let c = 0; c < cols.length; c++) {
            const cellAddress = XLSX.utils.encode_cell({ c, r: 0 });
            const cell = ws[cellAddress];
            if (cell) {
                cell.s = {
                    fill: headerFill,
                    font: headerFont,
                    alignment: headerAlignment,
                } as any;
            }
        }

        // set column widths based on header text length
        ws['!cols'] = cols.map((h: any) => ({ wch: Math.max(10, h.length + 6) }));

        const wb = XLSX.utils.book_new();
        // determine sheet name based on type
        let sheetName = 'Template';
        if (templateType === 'user') sheetName = 'Users';
        else if (templateType === 'school') sheetName = 'Schools';
        else if (templateType === 'student') sheetName = 'Students';
        XLSX.utils.book_append_sheet(wb, ws, sheetName);

        // use writeFile from xlsx-js-style to trigger download with styles preserved
        let filename = fileNameWithTimestamp(sheetName.toLowerCase() + '-template', 'xlsx');
        XLSX.writeFile(wb, filename, { bookType: 'xlsx', cellStyles: true });
    };

    const processExcelData = (json: any[], keys: string[]) => {
        const tableData: any[] = [];
        json.forEach((row: any) => {
            tableData.push(keys.map((key: string) => row[key]));
        });
        return tableData;
    };

    /* -------- Excel Upload -------- */
    const handleExcelUpload = (files: FileList | null) => {
        const file: any = files?.[0];
        if (!file) return;

        setExcelFile(file);

        const reader = new FileReader();
        reader.onload = (evt: ProgressEvent<FileReader>) => {
            try {
                const data = evt.target?.result;
                const workbook = XLSX.read(data, { type: "binary" });
                const sheetName = workbook.SheetNames[0];

                const sheet = workbook.Sheets[sheetName];
                const json: any = XLSX.utils.sheet_to_json(sheet);

                if (json.length > 0) {
                    const keys = Object.keys(json[0]);
                    const tableData = processExcelData(json, keys);
                    setHeaders(keys);
                    setExcelData(tableData);
                }
            } catch (err) {
                console.error('Error parsing Excel file', err);
                alert('Error parsing Excel file');
                setExcelFile(null);
            }
        };
        reader.onerror = () => {
            alert('Error reading file');
            setExcelFile(null);
        };
        reader.readAsBinaryString(file);
    };

    /* -------- Clear -------- */
    const handleClear = () => {
        setSelectedSchool(null);
        setTicketType(null);
        setPriority(null);
        setTicketDescription("");
        setExcelData([]);
        setHeaders([]);
        setExcelFile(null);
        setShowPreview(false);
    };

    /* -------- Submit -------- */
    const handleSubmit = async () => {
        // Validate form fields
        if (!selectedSchool || !ticketType || !priority || !ticketDescription.trim()) {
            alert("Please fill in all required fields (School, Ticket Type, Priority, Description)");
            return;
        }

        if (!excelFile) {
            alert("Please upload an Excel file");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("IssueType", ticketType);
            formData.append("Description", ticketDescription);
            formData.append("Priority", priority);
            formData.append("SchoolID", selectedSchool.SchoolID.toString());
            formData.append("ExcelFile", excelFile);

            const res: any = await ticketsSerices.uploadExcel(formData);






            // Submit ticket data to backend API
            console.log("Submit data:", { selectedSchool, ticketType, priority, ticketDescription, excelFile });
            alert("Ticket submitted successfully!");
            handleClear();
        } catch (error) {
            console.error("Submit failed:", error);
            alert("Submit failed");
        }
    };

    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            {/* Header Row with Back and Download Template */}
            <Grid size={12} display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={2}>
                    <h3 style={pageDetailsTitle}>Create Ticket</h3>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                    <ThemedButton text="Back" variant="outlined" handleClick={navigateBack} />
                    <Button
                        id={buttonId}
                        aria-controls={open ? menuId : undefined}
                        aria-haspopup="true"
                        aria-expanded={open}
                        onClick={handleClick}
                    >
                        Download Template <ArrowDropDownIcon />
                    </Button>
                    <Menu
                        id={menuId}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        slotProps={{
                            list: {
                                'aria-labelledby': buttonId,
                            },
                        }}
                    >
                        <MenuItem onClick={() => handleTemplateDownload('school')}>
                            <FileDownloadIcon fontSize="small" sx={{ mr: 1 }} />
                            School Template
                        </MenuItem>
                        <MenuItem onClick={() => handleTemplateDownload('student')}>
                            <FileDownloadIcon fontSize="small" sx={{ mr: 1 }} />
                            Student Template
                        </MenuItem>
                        <MenuItem onClick={() => handleTemplateDownload('user')}>
                            <FileDownloadIcon fontSize="small" sx={{ mr: 1 }} />
                            User Template
                        </MenuItem>
                    </Menu>
                </Box>
            </Grid>

            {/* Ticket Form Section */}
            <Grid size={12}>
                <h4>Ticket Details</h4>
            </Grid>

            {/* School Name */}
            <Grid size={4}>
                <ThemedAutocomplete
                    options={schools}
                    getOptionLabel={(option: SchoolModel) => option.SchoolName}
                    loading={schoolsLoading}
                    value={selectedSchool}
                    onChange={(_: any, newValue: SchoolModel | null) => setSelectedSchool(newValue)}
                    id="school-select"
                    label="School Name *"
                />
            </Grid>

            {/* Issue Type */}
            <Grid size={4}>
                <ThemedAutocomplete
                    options={ticketTypeOptions}
                    getOptionLabel={(option: any) => option.label}
                    value={ticketTypeOptions.find(opt => opt.value === ticketType) || null}
                    onChange={(_: any, newValue: any) => setTicketType(newValue?.value || null)}
                    id="ticket-type-select"
                    label="Issue Type *"
                />
            </Grid>

            {/* Priority */}
            <Grid size={4}>
                <ThemedAutocomplete
                    options={priorityOptions}
                    getOptionLabel={(option: any) => option.label}
                    value={priorityOptions.find(opt => opt.value === priority) || null}
                    onChange={(_: any, newValue: any) => setPriority(newValue?.value || null)}
                    id="priority-select"
                    label="Priority *"
                />
            </Grid>

            {/* Ticket Description */}
            <Grid size={12}>
                <ThemedTextField
                    id="ticket-description"
                    label="Ticket Description *"
                    variant="standard"
                    fullWidth={true}
                    multiline
                    rows={4}
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                />
            </Grid>

            {/* Bulk Upload Section */}
            <Grid size={12} style={{ marginTop: 24 }}>
                <h4>Bulk Upload</h4>
            </Grid>

            {/* Upload Buttons */}
            <Grid size={12} display="flex" justifyContent="flex-end" gap={1}>
                <ThemedButton
                    variant="outlined"
                    text="Upload Excel"
                    icon={<UploadFileIcon />}
                    isFile
                    accept=".xlsx,.xls"
                    handleClick={(e: any) => handleExcelUpload(e)}
                /> &nbsp;&nbsp;
                {excelData.length > 0 && (
                    <>
                        <ThemedButton
                            variant="outlined"
                            text="Preview"
                            icon={showPreview ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            handleClick={() => setShowPreview(!showPreview)}
                        /> &nbsp;&nbsp;
                    </>
                )}
                <ThemedButton
                    variant="outlined"
                    text="Clear All"
                    icon={<ClearIcon />}
                    handleClick={() => handleClear()}
                    style={{ color: '#d32f2f', borderColor: '#d32f2f' }}
                /> &nbsp;&nbsp;
                <ThemedButton
                    variant="contained"
                    text="Submit"
                    icon={<SendIcon />}
                    handleClick={handleSubmit}
                />
            </Grid>

            {/* Excel Table Preview */}
            {excelData.length > 0 && showPreview && (
                <Grid size={12} style={{ marginTop: 24 }}>
                    <h4>Preview</h4>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    {headers.map((h) => (
                                        <TableCell key={`header-${h}`}><b>{h}</b></TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {excelData.map((row: any[], dataIndex: number) => (
                                    <TableRow key={`row-${dataIndex}-${row[0]}`}>
                                        {row.map((cell: any, cellIndex: number) => (
                                            <TableCell key={`cell-${dataIndex}-${cellIndex}`}>{cell}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            )}
        </Grid>
    );
};

export default UploadPage;
