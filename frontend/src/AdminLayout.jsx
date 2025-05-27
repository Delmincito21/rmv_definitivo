import AdminDashboard from './AdminDashboard';
import { Outlet, useLocation } from 'react-router-dom';

const AdminLayout = () => {
    const location = useLocation();
    const isProductPage = location.pathname.includes('/productos');
    const isInicioPage = location.pathname === '/admin' || location.pathname === '/admin/inicio';

    return (
        <div className="admin-layout">
            {(isInicioPage || !isProductPage) && <AdminDashboard />}
            <div className="main-content-with-sidebar">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
