import Card from "../components/ui/Card.jsx";

const AccountsPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Accounts</h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Review balances, sync statuses, and manage financial institutions.
                </p>
            </div>
            <Card>
                <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
                    <p>
                        We are wiring up live account connections next. In the meantime, use this
                        area to plan which banks, credit cards, and investment portfolios you want
                        to connect.
                    </p>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        Tip: keeping login credentials handy will speed through the onboarding
                        flow once integrations are enabled.
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default AccountsPage;
