import { useEffect, useMemo, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table';
import { getTableOptions } from '../../common/tableStyles';
import Grid from '@mui/material/Grid';
// ...existing code...
import ThemedTextField from '../../common/ThemedTextField';
import ThemedAutocomplete from '../../common/ThemedAutocomplete';
import ThemedButton from '../../common/ThemedButton';
import studentServices from '../../services/studentsServices';
import masterServices from '../../services/masterSerices';
import type { SchoolModel } from '../../models/SchoolModel';
import type { StudentModel, GetStudentModel } from '../../models/StudentModel';
import { StudentTableColumns } from '../../utils/columns';



export default function StudentsList() {
    const [students, setStudents] = useState<StudentModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [schools, setSchools] = useState<SchoolModel[]>([]);
    const [schoolsLoading, setSchoolsLoading] = useState<boolean>(true);

    const [classes, setClasses] = useState<Array<{ ClassID: number; ClassCode: string }>>([]);
    const [classesLoading, setClassesLoading] = useState<boolean>(true);

    const [selectedSchool, setSelectedSchool] = useState<SchoolModel | null>(null);
    const [selectedClass, setSelectedClass] = useState<{ ClassID: number; ClassCode: string } | null>(null);

    const getStudentsListAPI = async () => {
        const payload: GetStudentModel = {
            Prefix: '',
            StudentID: 0,
            ClassID: 0,
            SchoolID: 0,
            AccountID: 2,
            IsDropdown: false,
            LoginUserID: 2,
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

    const getClassesAPI = async (schoolID: number) => {
        setClassesLoading(true);
        try {
            const res: any = await masterServices.getClassesBySchoolID(2, schoolID);
            setTimeout(() => {
                const studentsForDropdown: StudentModel[] = res?.data?.Result ?? [];
                const map = new Map<number, { ClassID: number; ClassCode: string; IsActive: boolean }>();
                debugger
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

    const movieProps = {
        options: top100Films,
        getOptionLabel: (option: FilmOptionType) => option.title,
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
        state: {
            isLoading: loading,
            showLoadingOverlay: false,
        },
        ...(getTableOptions() as any),
    });


    return <>
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={2}>
                <ThemedAutocomplete
                    {...schoolProps}
                    id="school-select"
                    disableCloseOnSelect
                    label="School"
                />
            </Grid>
            <Grid size={2}>
                <ThemedAutocomplete
                    {...classProps}
                    id="class-select"
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
            <Grid size={4} style={{ textAlign: 'right' }}>
                <ThemedButton text="Clear" variant="outlined" /> &nbsp;&nbsp;
                <ThemedButton text="Search" variant="contained" />
            </Grid>
        </Grid>
        <MaterialReactTable table={table} />
    </>;
}

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