import { useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ThemedButton from "../../common/ThemedButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ClearIcon from "@mui/icons-material/Clear";
import SendIcon from "@mui/icons-material/Send";
import * as XLSX from "xlsx";

import { useStyles } from "../../theme/styles";
import ticketsSerices from "../../services/ticketsSerices";

const UploadPage = () => {
    const { pageDetailsTitle } = useStyles();

    const [template, setTemplate] = useState("");
    const [issueType, setIssueType] = useState("aattendance");
    const [priority, setPriority] = useState("alow");
    const [excelData, setExcelData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [excelFile, setExcelFile] = useState(null);

    /* -------- Template Download -------- */
    const handleTemplateDownload = (value: any) => {
        // You can replace URLs with actual API/file paths
        const urls: any = {
            student: "/templates/student-template.xlsx",
            user: "/templates/user-template.xlsx",
            school: "/templates/school-template.xlsx"
        };

        if (urls[value]) {
            window.open(urls[value], "_blank");
        }
    };

    /* -------- Excel Upload -------- */
    const handleExcelUpload = (files: FileList | null) => {
        const file: any = files?.[0];
        if (!file) return;

        setExcelFile(file); // ⭐ store file for API

        const reader = new FileReader();
        reader.onload = (evt: ProgressEvent<FileReader>) => {
            const data = evt.target?.result;
            const workbook = XLSX.read(data as any, { type: "binary" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json: any = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            setHeaders(json[0]);
            setExcelData(json.slice(1));
        };
        reader.readAsBinaryString(file);
    };

    /* -------- Clear -------- */
    const handleClear = () => {
        setExcelData([]);
        setHeaders([]);
        setIssueType("");
        setPriority("");
    };

    /* -------- Submit -------- */
    const handleSubmit = async () => {
        if (!excelFile) {
            alert("Please upload an Excel file");
            return;
        }
        debugger

        try {
            const formData = new FormData();
            formData.append("excelFile", excelFile);
            formData.append("issueType", issueType);
            formData.append("priority", priority);
            formData.append("requestedBy", "admin");

            const response: any = await ticketsSerices.uploadExcel(formData);


            console.log("Upload success:", response.data);
            alert("Excel uploaded successfully!");
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed");
        }
    };

    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            {/* Header Row */}
            <Grid size={12} display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={2}>
                    <h3 style={pageDetailsTitle}>Upload Excel</h3>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                    <FormControl size="small" sx={{ minWidth: 220 }}>
                        <InputLabel>Download Template</InputLabel>
                        <Select
                            label="Download Template"
                            value={template}
                            onChange={(e) => {
                                setTemplate(e.target.value);
                                handleTemplateDownload(e.target.value);
                            }}
                        >
                            <MenuItem value="student">
                                <CloudDownloadIcon fontSize="small" sx={{ mr: 1 }} />
                                Student Template
                            </MenuItem>
                            <MenuItem value="user">
                                <CloudDownloadIcon fontSize="small" sx={{ mr: 1 }} />
                                User Template
                            </MenuItem>
                            <MenuItem value="school">
                                <CloudDownloadIcon fontSize="small" sx={{ mr: 1 }} />
                                School Template
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Grid>
            <Grid size={3}>
                <FormControl fullWidth>
                    <InputLabel>Issue Type</InputLabel>
                    <Select value={issueType} label="Issue Type" onChange={(e) => setIssueType(e.target.value)}>
                        <MenuItem value="attendance">Attendance</MenuItem>
                        <MenuItem value="marks">Marks</MenuItem>
                        <MenuItem value="profile">Profile</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid size={3}>
                <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select value={priority} label="Priority" onChange={(e) => setPriority(e.target.value)}>
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            {/* Excel Picker */}
            <Grid size={6} display="flex" justifyContent="flex-end">
                {/* <Grid size={4}> */}
                <ThemedButton
                    variant="outlined"
                    text="Upload Excel"
                    icon={<UploadFileIcon />}
                    isFile
                    accept=".xlsx,.xls"
                // handleClick={handleExcelUpload}
                /> &nbsp;&nbsp;
                <ThemedButton
                    variant="outlined"
                    text="Clear"
                    icon={<ClearIcon />}
                    handleClick={() => handleClear()}
                    style={{ color: '#d32f2f', borderColor: '#d32f2f' }}
                /> &nbsp;&nbsp;
                <ThemedButton
                    variant="contained"
                    text="Submit"
                    icon={<SendIcon />}
                    handleClick={handleSubmit}
                    disabled={!excelData.length}
                />
            </Grid>

            {/* Excel Table Preview */}
            {excelData.length > 0 && (
                <Grid size={12}>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    {headers.map((h, i) => (
                                        <TableCell key={i}><b>{h}</b></TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {excelData.map((row: any, rIdx: number) => (
                                    <TableRow key={rIdx}>
                                        {row.map((cell: any, cIdx: any) => (
                                            <TableCell key={cIdx}>{cell}</TableCell>
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
