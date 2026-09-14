import { Suspense, lazy } from 'react';
import { useStyles } from '../theme/styles';
import { Routes, Route } from 'react-router-dom';

const Login = lazy(() => import('../pages/auth/Login'));
const AccountDashboard = lazy(() => import('../pages/account/accountDashboard'));
const StudentsList = lazy(() => import('../pages/students/students'));
const StudentUpload = lazy(() => import('../pages/students/studentsUpload'));
const TicketsList = lazy(() => import('../pages/tickets/ticketsList'));
const TicketDetails = lazy(() => import('../pages/tickets/ticketDetails'));
const NewTicket = lazy(() => import('../pages/tickets/newTicket'));
const AddPage = lazy(() => import('../pages/tickets/addPage'));
const EditPage = lazy(() => import('../pages/tickets/editPage'));
const UploadPage = lazy(() => import('../pages/tickets/uploadPage'));
const HolidaysList = lazy(() => import('../pages/configurations/holidaysList'));
const ConfigureClasses = lazy(() => import('../pages/configurations/configureClasses'));
const ConfigurationsDashboard = lazy(() => import('../pages/configurations/configurationsDashboard'));
const DailyWork = lazy(() => import('../pages/dailyWork/dailyWork'));
const DailyWorkAssign = lazy(() => import('../pages/dailyWork/dailyWorkAssign'));
const DailyWorkSubmissions = lazy(() => import('../pages/dailyWork/dailyWorkSubmissions'));
const Subjects = lazy(() => import('../pages/configurations/subjects'));
const StudentGateDashboard = lazy(() => import('../pages/studentGate/StudentGateDashboard'));
const StudentGateHistory = lazy(() => import('../pages/studentGate/StudentGateHistory'));
const ManualStudentGate = lazy(() => import('../pages/studentGate/ManualStudentGate'));

const RouterPage = () => {
    const { bodyMainDiv, bodySubMainDiv } = useStyles();

    return (
        <div style={bodyMainDiv as React.CSSProperties}>
            <div style={bodySubMainDiv as React.CSSProperties}>
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/account" element={<AccountDashboard />} />
                        <Route path="/students" element={<StudentsList />} />
                        <Route path="/students/upload" element={<StudentUpload />} />
                        <Route path="/tickets" element={<TicketsList />} />
                        <Route path="/ticket-details" element={<TicketDetails />} />
                        <Route path="/tickets/new" element={<NewTicket />} />
                        <Route path="/tickets/addUser" element={<AddPage />} />
                        <Route path="/tickets/addSchool" element={<AddPage />} />
                        <Route path="/tickets/addStudent" element={<AddPage />} />
                        <Route path="/tickets/editUser" element={<EditPage />} />
                        <Route path="/tickets/editSchool" element={<EditPage />} />
                        <Route path="/tickets/editStudent" element={<EditPage />} />
                        <Route path="/tickets/uploadExcel" element={<UploadPage />} />
                        <Route path="/configurations" element={<ConfigurationsDashboard />} />
                        <Route path="/configurations/configureClasses" element={<ConfigureClasses />} />
                        <Route path="/configurations/holidays" element={<HolidaysList />} />
                        <Route path="/configurations/subjects" element={<Subjects />} />
                        <Route path="/daily-work" element={<DailyWork />} />
                        <Route path="/daily-work/assign" element={<DailyWorkAssign />} />
                        <Route path="/daily-work/submissions" element={<DailyWorkSubmissions />} />
                        <Route path="/attendance" element={<StudentGateDashboard />} />
                        <Route path="/attendance/history" element={<StudentGateHistory />} />
                        <Route path="/attendance/manual" element={<ManualStudentGate />} />
                        <Route path="/dashboard" element={<div style={{ padding: 24 }}>Dashboard</div>} />
                        <Route path="/" element={<div style={{ padding: 24 }}>Dashboard</div>} />
                        <Route path="*" element={<div style={{ padding: 24 }}>Page not found</div>} />
                    </Routes>
                </Suspense>
            </div>
        </div>
    );
}

export default RouterPage;