import { Suspense, lazy } from 'react';
import { useStyles } from '../theme/styles';
import { Routes, Route } from 'react-router-dom';

const AccountDashboard = lazy(() => import('../pages/account/accountDashboard'));
const StudentsList = lazy(() => import('../pages/students/students'));
const TicketsList = lazy(() => import('../pages/tickets/ticketsList'));
const TicketDetails = lazy(() => import('../pages/tickets/ticketDetails'));
const NewTicket = lazy(() => import('../pages/tickets/newTicket'));
const AddPage = lazy(() => import('../pages/tickets/addPage'));

const RouterPage = () => {
    const { bodyMainDiv, bodySubMainDiv } = useStyles();

    return (
        <div style={bodyMainDiv as React.CSSProperties}>
            <div style={bodySubMainDiv as React.CSSProperties}>
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/account" element={<AccountDashboard />} />
                        <Route path="/students" element={<StudentsList />} />
                        <Route path="/tickets" element={<TicketsList />} />
                        <Route path="/tickets/:id" element={<TicketDetails />} />
                        <Route path="/tickets/new" element={<NewTicket />} />
                        <Route path="/tickets/addUser" element={<AddPage />} />
                        <Route path="/tickets/addSchool" element={<AddPage />} />
                        <Route path="/tickets/addStudent" element={<AddPage />} />
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