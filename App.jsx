import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./react/components/layout/MainLayout.jsx";
import AccountsPage from "./react/pages/AccountsPage.jsx";
import BudgetsPage from "./react/pages/BudgetsPage.jsx";
import DashboardPage from "./react/pages/DashboardPage.jsx";
import ReportsPage from "./react/pages/ReportsPage.jsx";
import SettingsPage from "./react/pages/SettingsPage.jsx";
import TransactionsPage from "./react/pages/TransactionsPage.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="accounts" element={<AccountsPage />} />
                    <Route path="budgets" element={<BudgetsPage />} />
                    <Route path="transactions" element={<TransactionsPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
