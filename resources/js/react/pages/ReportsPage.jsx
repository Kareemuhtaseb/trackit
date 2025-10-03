import Card from "../components/ui/Card.jsx";

const ReportsPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Reports</h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Generate insights and export polished summaries for stakeholders.
                </p>
            </div>
            <Card>
                <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
                    <p>
                        Reporting widgets and PDF exports are under construction. Expect automated
                        drill-downs, variance analysis, and goal tracking once the data layer locks
                        in.
                    </p>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        In the meantime, keep using the dashboard view to monitor trends at a
                        glance.
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default ReportsPage;
