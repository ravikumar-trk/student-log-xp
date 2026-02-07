import { useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ThemedAutocomplete from '../../common/ThemedAutocomplete';
import ThemedButton from '../../common/ThemedButton';
import { useStyles } from '../../theme/styles';
import masterServices from '../../services/masterSerices';
import type { SchoolModel } from '../../models/SchoolModel';
import NoDataImage from '../../assets/images/NoData.svg';

const ACCOUNT_ID = 2; // TODO: replace with dynamic account id if available

const ConfigureClasses = () => {
    const { pageDetailsTitle, configureClassesBox, configureSchoolGrid, configureControlContainer, groupCard, parentTitle, parentCode, childListItem, configureClassActionButton, noDataImageDivStyle, noDataImageStyle, noDataImageStyleText } = useStyles();

    const [schools, setSchools] = useState<SchoolModel[]>([]);
    const [schoolsLoading, setSchoolsLoading] = useState<boolean>(true);

    const [classes, setClasses] = useState<Array<{ ClassID: number; ClassCode: string;[k: string]: any }>>([]);
    const [classesLoading, setClassesLoading] = useState<boolean>(false);

    const [selectedSchool, setSelectedSchool] = useState<SchoolModel | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [saving, setSaving] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            await loadSchools();
        })();
    }, []);

    const loadSchools = async () => {
        setSchoolsLoading(true);
        try {
            const res: any = await masterServices.getSchoolsByAccountID(ACCOUNT_ID);
            const data: SchoolModel[] = res?.data?.Result ?? [];
            setSchools(data);
        } catch (err: any) {
            console.error(err?.message ?? err);
            alert('Failed to fetch schools');
        } finally {
            setSchoolsLoading(false);
        }
    };

    const loadClasses = async (schoolID: number) => {
        setClasses([]);
        setSelectedIds(new Set());
        if (!schoolID) return;
        setClassesLoading(true);
        try {
            const res: any = await masterServices.getClassesBySchoolID(ACCOUNT_ID, schoolID);
            const raw = res?.data?.Result ?? [];
            // Map to known shape if backend differs
            const mapped = raw.map((c: any) => ({
                ClassID: c.ClassID ?? c.ID ?? 0,
                ClassCode: c.ClassCode ?? c.ClassName ?? c.Name ?? String(c.ClassID ?? c.ID ?? ''),
                ClassName: c.ClassName ?? c.ClassCode ?? c.Name ?? '',
                ParentID: c.ParentID ?? 0,
                ...c,
            }));
            setClasses(mapped);

            // Initialize selected checkboxes from API 'IsActive' flag (if present)
            const initialSelected = new Set<number>();
            mapped.forEach((c: any) => {
                if (c.IsActive) initialSelected.add(c.ClassID);
            });
            setSelectedIds(initialSelected);
        } catch (err: any) {
            console.error(err?.message ?? err);
            alert('Failed to fetch classes');
        } finally {
            setClassesLoading(false);
        }
    };

    const toggle = (id: number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleSelectAll = () => setSelectedIds(new Set(classes.map((c) => c.ClassID)));
    const handleClearAll = () => {
        // Clear the selected school, classes and selected checkboxes
        setSelectedSchool(null);
        setClasses([]);
        setSelectedIds(new Set());
    };

    const handleSave = async () => {
        if (!selectedSchool) {
            alert('Please select a school first');
            return;
        }
        setSaving(true);
        try {
            debugger
            // Exclude parent entries from payload (ParentID === 0)
            const classesPayload = classes
                .filter((c) => c.ParentID && c.ParentID !== 0)
                .map((c) => ({
                    classID: c.ClassID,
                    accountID: ACCOUNT_ID,
                    schoolID: selectedSchool.SchoolID,
                    isActive: selectedIds.has(c.ClassID),
                }));
            const payload = {
                loginUserID: 2,
                classes: classesPayload,
            };
            const res: any = await masterServices.upsertClasses(payload);
            // Check response if needed
            alert('Classes updated successfully');
            console.log('Upsert response', res);
        } catch (err: any) {
            console.error(err?.message ?? err);
            alert(err?.message ?? 'Failed to save configured classes');
        } finally {
            setSaving(false);
        }
    };

    // Group classes by parent for display
    const groups = useMemo(() => {
        const parents = classes.filter((c) => c.ParentID === 0);
        const children = classes.filter((c) => c.ParentID && c.ParentID !== 0);
        const map = new Map<number, { parent: any; children: any[] }>();
        parents.forEach((p) => map.set(p.ClassID, { parent: p, children: [] }));
        children.forEach((ch) => {
            if (map.has(ch.ParentID)) map.get(ch.ParentID)!.children.push(ch);
            else map.set(ch.ClassID, { parent: ch, children: [] });
        });
        // include parents that may have no children
        return Array.from(map.values());
    }, [classes]);

    const isGroupAllSelected = (g: any) => {
        const ids = [g.parent.ClassID, ...g.children.map((c: any) => c.ClassID)];
        return ids.every((id) => selectedIds.has(id));
    };

    const isGroupSomeSelected = (g: any) => {
        const ids = [g.parent.ClassID, ...g.children.map((c: any) => c.ClassID)];
        const any = ids.some((id) => selectedIds.has(id));
        return any && !isGroupAllSelected(g);
    };

    const toggleGroup = (g: any) => {
        const ids = [g.parent.ClassID, ...g.children.map((c: any) => c.ClassID)];
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (ids.every((id) => next.has(id))) {
                ids.forEach((id) => next.delete(id));
            } else {
                ids.forEach((id) => next.add(id));
            }
            return next;
        });
    };

    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={12}>
                <h3 style={pageDetailsTitle}>Configure Classes</h3>
            </Grid>

            <Grid size={12}>
                <Box sx={configureClassesBox}>
                    <Grid container spacing={2}>
                        <Grid size={4} sx={configureSchoolGrid}>
                            <ThemedAutocomplete
                                fullWidth
                                options={schools}
                                getOptionLabel={(o: SchoolModel) => o.SchoolName}
                                loading={schoolsLoading}
                                value={selectedSchool}
                                onChange={(_: any, newValue: SchoolModel | null) => {
                                    setSelectedSchool(newValue);
                                    loadClasses(newValue?.SchoolID ?? 0);
                                }}
                                id="configure-classes-school"
                                label="Select School"
                            />
                        </Grid>

                        <Grid size={8} sx={configureControlContainer}>
                            {/* <Button onClick={handleSelectAll} disabled={!selectedSchool || classes.length === 0 || classesLoading} sx={{ ...(configureClassActionButton as any), mr: 1 }}>
                                Select All
                            </Button> */}
                            {/* <Button onClick={handleClearAll} disabled={!selectedSchool || classes.length === 0 || classesLoading} sx={{ ...(configureClassActionButton as any), mr: 1 }}>
                                Clear
                            </Button> */}
                            <ThemedButton text="Select All" variant="outlined" onClick={handleSelectAll} disabled={!selectedSchool || classes.length === 0 || classesLoading} /> &nbsp;&nbsp;
                            <ThemedButton text="Clear" variant="outlined" onClick={handleClearAll} disabled={!selectedSchool || classes.length === 0 || classesLoading} /> &nbsp;&nbsp;
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {saving && <CircularProgress size={20} style={{ marginRight: 8 }} />}
                                <ThemedButton text={saving ? 'Saving...' : 'Save'} variant="contained" handleClick={handleSave} disabled={saving || !selectedSchool} />
                            </div>
                        </Grid>

                        <Grid size={12}>
                            {classesLoading ? (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
                                    <CircularProgress />
                                </div>
                            ) : classes.length === 0 ? (
                                <Box sx={noDataImageDivStyle}>
                                    <img src={NoDataImage} alt="No Data" style={noDataImageStyle} />
                                    <Typography sx={noDataImageStyleText}>Please select school to see the data here.</Typography>
                                </Box>
                            ) : (
                                <Grid container spacing={2}>
                                    {groups.map((g: any) => (
                                        <Grid size={4} key={g.parent.ClassID}>
                                            <Box sx={groupCard}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Checkbox
                                                            checked={isGroupAllSelected(g)}
                                                            indeterminate={isGroupSomeSelected(g)}
                                                            onChange={() => toggleGroup(g)}
                                                        />
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Typography variant="subtitle1" sx={{ ...parentTitle, marginRight: 1 }}>{g.parent.ClassName}</Typography>
                                                            <Typography variant="body2" sx={parentCode}>({g.parent.ClassCode})</Typography>
                                                        </Box>
                                                    </Box>
                                                    <Button size="small" onClick={() => toggleGroup(g)}>
                                                        {isGroupAllSelected(g) ? 'Unselect All' : 'Select All'}
                                                    </Button>
                                                </Box>
                                                <hr />
                                                <List dense>
                                                    {g.children.map((c: any) => (
                                                        <ListItem key={c.ClassID} onClick={() => toggle(c.ClassID)} sx={childListItem}>
                                                            <ListItemIcon>
                                                                <Checkbox edge="start" checked={selectedIds.has(c.ClassID)} tabIndex={-1} disableRipple />
                                                            </ListItemIcon>
                                                            <ListItemText primary={`${c.ClassName} (${c.ClassCode})`} />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    );
};

export default ConfigureClasses;
