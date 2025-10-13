import Grid from "@mui/material/Grid";
import { useStyles } from '../../theme/styles';
import { useLocation, useNavigate } from "react-router-dom";
import ThemedButton from "../../common/ThemedButton";
import * as XLSX from 'xlsx-js-style';
import { NewTicket } from "../../utils/routes";


const AddPage = () => {
    const { ticketDetailsTitle } = useStyles();
    const location = useLocation();
    const navigate = useNavigate();
    const isAddUser = location.pathname.includes("addUser");
    const isAddSchool = location.pathname.includes("addSchool");
    const isAddStudent = location.pathname.includes("addStudent");

    const renderTitle = () => {
        if (isAddUser) return "Add Users";
        if (isAddSchool) return "Add Schools";
        if (isAddStudent) return "Add Students";
        return "Add";
    };

    const handleTemplateClick = () => {
        // generate and download an XLSX template based on the type of entity
        const getColumns = () => {
            if (isAddUser) return [
                'FirstName', 'LastName', 'Email', 'Role', 'Phone'
            ];
            if (isAddSchool) return [
                'SchoolName', 'Address', 'City', 'State', 'Zip', 'Phone', 'Principal'
            ];
            if (isAddStudent) return [
                'FirstName', 'LastName', 'DOB', 'SchoolID', 'Grade', 'ParentName', 'ParentEmail'
            ];
            return ['col1', 'col2'];
        };

        const cols = getColumns();

        // Build worksheet data: header row only
        const data = [cols];
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
        ws['!cols'] = cols.map((h) => ({ wch: Math.max(10, h.length + 6) }));

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
        navigate(NewTicket);
    }

    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={8}>
                <h3 style={ticketDetailsTitle}>{renderTitle()}</h3>
            </Grid>
            <Grid size={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                <ThemedButton text="Template" variant="contained" iconPosition="end" icon="download" handleClick={handleTemplateClick} /> &nbsp;&nbsp;
                <ThemedButton text="Upload File" variant="contained" iconPosition="end" icon="upload" isFile={true} handleClick={handleUploadFileClick} /> &nbsp;&nbsp;
                <ThemedButton text="Back" variant="contained" handleClick={navigateToNewTicket} />
            </Grid>
        </Grid>
    );
};

export default AddPage;