import Grid from "@mui/material/Grid";
import Box from '@mui/material/Box';
import { useStyles } from '../../theme/styles';
import { useLocation, useNavigate } from "react-router-dom";
import ThemedButton from "../../common/ThemedButton";
import * as XLSX from 'xlsx-js-style';
import RoutePaths from "../../utils/routes";
import { SchoolTableColumns, StudentTableColumns, UserTableColumns } from "../../utils/columns";
import { useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { getTableOptions } from '../../common/tableStyles';
import NoDataImage from '../../assets/images/NoData.svg';
import Typography from '@mui/material/Typography';


const AddPage = () => {
    const { pageDetailsTitle, noDataImageDivStyle, noDataImageStyle, noDataImageStyleText } = useStyles();
    const location = useLocation();
    const navigate = useNavigate();
    const isAddUser = location.pathname.includes("addUser");
    const isAddSchool = location.pathname.includes("addSchool");
    const isAddStudent = location.pathname.includes("addStudent");
    const [uploadedData, setUploadedData] = useState<any[] | null>(null);

    const renderTitle = () => {
        if (isAddUser) return "Add Users";
        if (isAddSchool) return "Add Schools";
        if (isAddStudent) return "Add Students";
        return "Add";
    };

    const handleTemplateClick = () => {
        // generate and download an XLSX template based on the type of entity
        const getColumns = () => {
            if (isAddUser) return UserTableColumns.filter((a: any) => !a.excelIgnore).map(c => c.header)
            else if (isAddSchool) return SchoolTableColumns.filter((a: any) => !a.excelIgnore).map(c => c.header);
            else if (isAddStudent) return StudentTableColumns.filter((a: any) => !a.excelIgnore).map(c => c.header);
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
        if (isAddUser) sheetName = 'Users';
        else if (isAddSchool) sheetName = 'Schools';
        else if (isAddStudent) sheetName = 'Students';
        XLSX.utils.book_append_sheet(wb, ws, sheetName);

        // use writeFile from xlsx-js-style to trigger download with styles preserved
        let filename = `${sheetName.toLowerCase()}-template_${Date.now()}.xlsx`;
        XLSX.writeFile(wb, filename, { bookType: 'xlsx', cellStyles: true });
    };

    const handleUploadFileClick = (files?: FileList | null) => {
        // files comes from ThemedButton when user selects a file
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
                // Read workbook
                const wb = XLSX.read(data as ArrayBuffer, { type: 'array' });
                const firstSheetName = wb.SheetNames[0];
                let expectedSheetName = 'Template';
                if (isAddUser) expectedSheetName = 'Users';
                else if (isAddSchool) expectedSheetName = 'Schools';
                else if (isAddStudent) expectedSheetName = 'Students';
                if (firstSheetName !== expectedSheetName) {
                    console.error(`Uploaded sheet name "${firstSheetName}" does not match expected "${expectedSheetName}".`);
                    alert(`Please upload an Excel file where the first sheet is named: ${expectedSheetName}`);
                    return;
                }
                const ws = wb.Sheets[firstSheetName];
                // Convert sheet to JSON (array of objects using header row)
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

    const navigateToNewTicket = () => {
        navigate(RoutePaths.NewTicket);
    }

    return (
        <>
            <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid size={8} style={{ display: 'flex', alignItems: 'center' }}>
                    <h3 style={pageDetailsTitle}>{renderTitle()}</h3>
                </Grid>
                <Grid size={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                    <ThemedButton text="Back" variant="outlined" handleClick={navigateToNewTicket} /> &nbsp;&nbsp;
                    <ThemedButton text="Template" variant="contained" iconPosition="end" icon="download" handleClick={handleTemplateClick} /> &nbsp;&nbsp;
                    <ThemedButton text="Upload File" variant="contained" iconPosition="end" icon="upload" isFile={true} handleClick={handleUploadFileClick} />
                </Grid>
            </Grid>
            {uploadedData ? (
                <div style={{ marginTop: 16 }}>
                    <UploadedDataTable data={uploadedData} isUser={isAddUser} isSchool={isAddSchool} isStudent={isAddStudent} />
                </div>
            ) : (
                <Box sx={noDataImageDivStyle}>
                    <img src={NoDataImage} alt="No Data" style={noDataImageStyle} />
                    <Typography sx={noDataImageStyleText}>No data uploaded. Please upload an Excel file to see the data here.</Typography>
                </Box>
            )}
        </>
    );
};

function UploadedDataTable({ data, isUser, isSchool, isStudent }: { readonly data: any[]; readonly isUser: boolean; readonly isSchool: boolean; readonly isStudent: boolean; }) {
    let schema: any[] = [];
    if (isUser) schema = UserTableColumns;
    else if (isSchool) schema = SchoolTableColumns;
    else if (isStudent) schema = StudentTableColumns;
    const columns = useMemo<MRT_ColumnDef<any>[]>(() =>
        schema.map((c: any) => (
            {
                accessorKey: c.header,
                header: c.header,
                size: c.width
            }
        )), [schema]);

    const table = useMaterialReactTable({
        columns,
        data,
        ...(getTableOptions() as any),
    });

    return <MaterialReactTable table={table} />;
}

export default AddPage;