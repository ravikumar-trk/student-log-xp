import { Suspense, lazy } from 'react';
import { useStyles } from '../theme/styles';
import { Routes, Route } from 'react-router-dom';

const AccountDashboard = lazy(() => import('../pages/account/accountDashboard'));
const StudentsList = lazy(() => import('../pages/students/students'));
const TicketsList = lazy(() => import('../pages/tickets/ticketsList'));

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