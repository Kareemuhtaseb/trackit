import Card from "../components/ui/Card.jsx";

const SettingsPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Settings</h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Configure notifications, security, and workspace preferences.
                </p>
            </div>
            <Card>
                <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
                    <p>
                        Settings controls will land soon, including MFA management, budgeting
                        defaults, and team permissions.
                    </p>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        Let us know which toggles matter most so we can prioritize them for the next
                        release.
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default SettingsPage;
