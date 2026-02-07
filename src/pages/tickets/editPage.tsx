import Grid from "@mui/material/Grid";
import Box from '@mui/material/Box';
import { useStyles } from '../../theme/styles';
import { useLocation, useNavigate } from "react-router-dom";
import ThemedButton from "../../common/ThemedButton";
import * as XLSX from 'xlsx-js-style';
import RoutePaths from "../../utils/routes";
import { SchoolTableColumns, StudentTableColumns, UserTableColumns, sampleUserData, sampleSchoolData, sampleStudentData } from "../../utils/columns";
import { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, type MRT_RowSelectionState, } from 'material-react-table';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { getTableOptions } from '../../common/tableStyles';
import NoDataImage from '../../assets/images/NoData.svg';
import { IconButton } from "@mui/material";
import ThemedAutocomplete from "../../common/ThemedAutocomplete";
import ThemedTextField from "../../common/ThemedTextField";


const EditPage = () => {
    const { pageDetailsTitle, dialogStyles, noDataImageDivStyle, noDataImageStyle, noDataImageStyleText } = useStyles();
    const location = useLocation();
    const navigate = useNavigate();
    const isEditUser = location.pathname.includes("editUser");
    const isEditSchool = location.pathname.includes("editSchool");
    const isEditStudent = location.pathname.includes("editStudent");

    const data = isEditUser ? sampleUserData : isEditSchool ? sampleSchoolData : isEditStudent ? sampleStudentData : [];

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState<any[]>([]);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [dialogError, setDialogError] = useState<string | null>(null);
    const [selectedRows, setSelectedRows] = useState<any | null>(null);
    const [uploadedData, setUploadedData] = useState<any[] | null>(null);
    const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

    const defaultProps = {
        options: top100Films,
        getOptionLabel: (option: FilmOptionType) => option.title,
    };

    const renderTitle = () => {
        if (isEditUser) return "Edit Users";
        if (isEditSchool) return "Edit Schools";
        if (isEditStudent) return "Edit Students";
        return "Edit";
    };

    const renderDialogTitle = () => {
        if (isEditUser) return "Select Users to Edit";
        if (isEditSchool) return "Select Schools to Edit";
        if (isEditStudent) return "Select Students to Edit";
        return "Select";
    }

    useEffect(() => {
        const selectedData = data.filter((row, index) => rowSelection[index]);
        setSelectedRows(selectedData.length > 0 ? selectedData : null);
    }, [rowSelection]);

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
                if (isEditUser) expectedSheetName = 'Users';
                else if (isEditSchool) expectedSheetName = 'Schools';
                else if (isEditStudent) expectedSheetName = 'Students';
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

    const handleDownload = () => {
        if (selectedRows === null) {
            alert("Please select at least one row to download the template.");
            return;
        }
        let schema: any[] = [];
        let dataToExport: any[] = [];
        let sheetName = 'Template';
        if (isEditUser) {
            schema = UserTableColumns;
            dataToExport = selectedRows;
            sheetName = 'Users';
        } else if (isEditSchool) {
            schema = SchoolTableColumns;
            dataToExport = selectedRows;
            sheetName = 'Schools';
        } else if (isEditStudent) {
            schema = StudentTableColumns;
            dataToExport = selectedRows;
            sheetName = 'Students';
        }
        const columns = schema.map(c => c.field);
        const headers = schema.map(c => c.field);
        const wsData = [headers, ...dataToExport.map(row => columns.map(col => row[col] ?? ''))];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        XLSX.writeFile(wb, `${sheetName}_Template.xlsx`);
        setDialogOpen(false);
        setSelectedRows(null);
        setRowSelection({});
    }

    const UploadedDataTable = ({ data, isUser, isSchool, isStudent }: { readonly data: any[]; readonly isUser: boolean; readonly isSchool: boolean; readonly isStudent: boolean; }) => {
        let schema: any[] = [];
        if (isUser) schema = UserTableColumns;
        else if (isSchool) schema = SchoolTableColumns;
        else if (isStudent) schema = StudentTableColumns;
        const columns = useMemo<MRT_ColumnDef<any>[]>(() => schema.map((c: any) => ({ accessorKey: c.field, header: c.headerName, size: c.width })), [schema]);

        const table = useMaterialReactTable({
            columns,
            data,
            mrtTheme: () => ({
                selectedRowBackgroundColor: '#cf5757ff',
            }),
            // enableRowSelection: true,
            ...(getTableOptions() as any),
        });

        return <MaterialReactTable table={table} />;
    }


    const ModelTable = ({ data, isUser, isSchool, isStudent }: { readonly data: any[]; readonly isUser: boolean; readonly isSchool: boolean; readonly isStudent: boolean; }) => {
        let columns: any[] = [];
        if (isUser) columns = UserTableColumns;
        else if (isSchool) columns = SchoolTableColumns;
        else if (isStudent) columns = StudentTableColumns;
        //const columns =  useMemo<MRT_ColumnDef<any>[]>(() => schema.map((c: any) => ({ accessorKey: c.field, header: c.headerName, size: c.width })), [schema]);

        const table = useMaterialReactTable({
            columns,
            data,
            enableRowSelection: true,
            getRowId: (row) => row.userId,
            onRowSelectionChange: setRowSelection,
            state: { rowSelection },
            renderTopToolbarCustomActions: ({ table }) => (
                isEditStudent ?
                    (<Grid container spacing={2} sx={{ width: '100%', paddingBottom: 2 }} >
                        <Grid size={2}>
                            <ThemedAutocomplete
                                {...defaultProps}
                                id="disable-close-on-select"
                                disableCloseOnSelect
                                label="School"
                            />
                        </Grid>
                        <Grid size={2}>
                            <ThemedAutocomplete
                                {...defaultProps}
                                id="disable-close-on-select"
                                disableCloseOnSelect
                                label="Class"
                            />
                        </Grid>
                        <Grid size={2}>
                            <ThemedTextField id="standard-basic" label="Admission No." variant="standard" fullWidth={true} />
                        </Grid>
                        <Grid size={2}>
                            <ThemedTextField
                                id="standard-basic"
                                label="Student Name"
                                variant="standard"
                                fullWidth={true}
                            />
                        </Grid>
                    </Grid >) : null


            ),
            ...(getTableOptions() as any),
        });

        return <MaterialReactTable table={table} />;
    }


    return (
        <>
            <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid size={8} style={{ display: 'flex', alignItems: 'center' }}>
                    <h3 style={pageDetailsTitle}>{renderTitle()}</h3>
                </Grid>
                <Grid size={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                    <ThemedButton text="Back" variant="outlined" handleClick={navigateToNewTicket} /> &nbsp;&nbsp;
                    <ThemedButton text="Select" variant="contained" handleClick={() => setDialogOpen(true)} /> &nbsp;&nbsp;
                    <ThemedButton text="Upload File" variant="contained" iconPosition="end" icon="upload" isFile={true} handleClick={handleUploadFileClick} /> &nbsp;&nbsp;
                    <ThemedButton text="Submit" variant="contained" />
                </Grid>
            </Grid>
            {uploadedData ? (
                <div style={{ marginTop: 16 }}>
                    <UploadedDataTable data={uploadedData} isUser={isEditUser} isSchool={isEditSchool} isStudent={isEditStudent} />
                </div>
            ) : (
                <Box sx={noDataImageDivStyle}>
                    <img src={NoDataImage} alt="No Data" style={noDataImageStyle} />
                    <Typography sx={noDataImageStyleText}>No data uploaded. Please upload an Excel file to see the data here.</Typography>
                </Box>
            )}

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullScreen fullWidth maxWidth="lg" sx={dialogStyles}>
                <DialogTitle>{renderDialogTitle()}</DialogTitle>
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
                    <ModelTable data={data} isUser={isEditUser} isSchool={isEditSchool} isStudent={isEditStudent} />
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


interface FilmOptionType {
    title: string;
    year: number;
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
    {
        title: 'The Lord of the Rings: The Return of the King',
        year: 2003,
    },
    { title: 'The Good, the Bad and the Ugly', year: 1966 },
    { title: 'Fight Club', year: 1999 },
    {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        year: 2001,
    },
    {
        title: 'Star Wars: Episode V - The Empire Strikes Back',
        year: 1980,
    },
    { title: 'Forrest Gump', year: 1994 },
    { title: 'Inception', year: 2010 },
    {
        title: 'The Lord of the Rings: The Two Towers',
        year: 2002,
    },
    { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { title: 'Goodfellas', year: 1990 },
    { title: 'The Matrix', year: 1999 },
    { title: 'Seven Samurai', year: 1954 },
    {
        title: 'Star Wars: Episode IV - A New Hope',
        year: 1977,
    },
    { title: 'City of God', year: 2002 },
    { title: 'Se7en', year: 1995 },
    { title: 'The Silence of the Lambs', year: 1991 },
    { title: "It's a Wonderful Life", year: 1946 },
    { title: 'Life Is Beautiful', year: 1997 },
    { title: 'The Usual Suspects', year: 1995 },
    { title: 'Léon: The Professional', year: 1994 },
    { title: 'Spirited Away', year: 2001 },
    { title: 'Saving Private Ryan', year: 1998 },
    { title: 'Once Upon a Time in the West', year: 1968 },
    { title: 'American History X', year: 1998 },
    { title: 'Interstellar', year: 2014 },
    { title: 'Casablanca', year: 1942 },
    { title: 'City Lights', year: 1931 },
    { title: 'Psycho', year: 1960 },
    { title: 'The Green Mile', year: 1999 },
    { title: 'The Intouchables', year: 2011 },
    { title: 'Modern Times', year: 1936 },
    { title: 'Raiders of the Lost Ark', year: 1981 },
    { title: 'Rear Window', year: 1954 },
    { title: 'The Pianist', year: 2002 },
    { title: 'The Departed', year: 2006 },
    { title: 'Terminator 2: Judgment Day', year: 1991 },
    { title: 'Back to the Future', year: 1985 },
    { title: 'Whiplash', year: 2014 },
    { title: 'Gladiator', year: 2000 },
    { title: 'Memento', year: 2000 },
    { title: 'The Prestige', year: 2006 },
    { title: 'The Lion King', year: 1994 },
    { title: 'Apocalypse Now', year: 1979 },
    { title: 'Alien', year: 1979 },
    { title: 'Sunset Boulevard', year: 1950 },
    {
        title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
        year: 1964,
    },
    { title: 'The Great Dictator', year: 1940 },
    { title: 'Cinema Paradiso', year: 1988 },
    { title: 'The Lives of Others', year: 2006 },
    { title: 'Grave of the Fireflies', year: 1988 },
    { title: 'Paths of Glory', year: 1957 },
    { title: 'Django Unchained', year: 2012 },
    { title: 'The Shining', year: 1980 },
    { title: 'WALL·E', year: 2008 },
    { title: 'American Beauty', year: 1999 },
    { title: 'The Dark Knight Rises', year: 2012 },
    { title: 'Princess Mononoke', year: 1997 },
    { title: 'Aliens', year: 1986 },
    { title: 'Oldboy', year: 2003 },
    { title: 'Once Upon a Time in America', year: 1984 },
    { title: 'Witness for the Prosecution', year: 1957 },
    { title: 'Das Boot', year: 1981 },
    { title: 'Citizen Kane', year: 1941 },
    { title: 'North by Northwest', year: 1959 },
    { title: 'Vertigo', year: 1958 },
    {
        title: 'Star Wars: Episode VI - Return of the Jedi',
        year: 1983,
    },
    { title: 'Reservoir Dogs', year: 1992 },
    { title: 'Braveheart', year: 1995 },
    { title: 'M', year: 1931 },
    { title: 'Requiem for a Dream', year: 2000 },
    { title: 'Amélie', year: 2001 },
    { title: 'A Clockwork Orange', year: 1971 },
    { title: 'Like Stars on Earth', year: 2007 },
    { title: 'Taxi Driver', year: 1976 },
    { title: 'Lawrence of Arabia', year: 1962 },
    { title: 'Double Indemnity', year: 1944 },
    {
        title: 'Eternal Sunshine of the Spotless Mind',
        year: 2004,
    },
    { title: 'Amadeus', year: 1984 },
    { title: 'To Kill a Mockingbird', year: 1962 },
    { title: 'Toy Story 3', year: 2010 },
    { title: 'Logan', year: 2017 },
    { title: 'Full Metal Jacket', year: 1987 },
    { title: 'Dangal', year: 2016 },
    { title: 'The Sting', year: 1973 },
    { title: '2001: A Space Odyssey', year: 1968 },
    { title: "Singin' in the Rain", year: 1952 },
    { title: 'Toy Story', year: 1995 },
    { title: 'Bicycle Thieves', year: 1948 },
    { title: 'The Kid', year: 1921 },
    { title: 'Inglourious Basterds', year: 2009 },
    { title: 'Snatch', year: 2000 },
    { title: '3 Idiots', year: 2009 },
    { title: 'Monty Python and the Holy Grail', year: 1975 },
];