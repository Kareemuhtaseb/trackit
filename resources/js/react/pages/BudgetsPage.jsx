import Card from "../components/ui/Card.jsx";

const BudgetsPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Budgets</h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Craft monthly allocations and track how spending compares to your plan.
                </p>
            </div>
            <Card>
                <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
                    <p>
                        Budget workflows and category breakdowns are on the roadmap. For now, jot
                        down the envelopes or categories you want to monitor so you are ready to
                        plug them in when the feature ships.
                    </p>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        You will also be able to export budget vs. actuals once the automation is
                        connected.
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default BudgetsPage;
