import { ArrowDownCircle, ArrowUpCircle, CalendarClock, PiggyBank, Target, Wallet } from "lucide-react";
import BalanceTrendChart from "../components/charts/BalanceTrendChart.jsx";
import ExpenseBreakdownChart from "../components/charts/ExpenseBreakdownChart.jsx";
import StatsGrid from "../components/dashboard/StatsGrid.jsx";
import TransactionsTable from "../components/table/TransactionsTable.jsx";
import Card from "../components/ui/Card.jsx";

const metricCards = [
    {
        title: "Total Balance",
        value: "$48,350",
        change: "+3.4%",
        trend: "up",
        icon: Wallet,
    },
    {
        title: "Monthly Income",
        value: "$9,850",
        change: "+1.8%",
        trend: "up",
        icon: ArrowUpCircle,
    },
    {
        title: "Monthly Expenses",
        value: "$6,420",
        change: "-2.1%",
        trend: "down",
        icon: ArrowDownCircle,
    },
    {
        title: "Savings Rate",
        value: "34%",
        change: "+4.3%",
        trend: "up",
        icon: PiggyBank,
    },
];

const balanceTrend = [
    { month: "Nov", balance: 36100 },
    { month: "Dec", balance: 37420 },
    { month: "Jan", balance: 36240 },
    { month: "Feb", balance: 37210 },
    { month: "Mar", balance: 38950 },
    { month: "Apr", balance: 40120 },
    { month: "May", balance: 41290 },
    { month: "Jun", balance: 42780 },
    { month: "Jul", balance: 43860 },
    { month: "Aug", balance: 45210 },
    { month: "Sep", balance: 47080 },
    { month: "Oct", balance: 48350 },
];

const expenseBreakdown = [
    { name: "Housing", value: 2200 },
    { name: "Transportation", value: 420 },
    { name: "Groceries", value: 680 },
    { name: "Lifestyle", value: 540 },
    { name: "Healthcare", value: 320 },
];

const transactions = [
    {
        date: "Oct 02",
        category: "Income",
        description: "Salary deposit",
        account: "Checking **** 2841",
        amount: "+$4,850.00",
        status: "cleared",
    },
    {
        date: "Oct 02",
        category: "Savings",
        description: "Automatic transfer to savings",
        account: "High-Yield Savings",
        amount: "-$1,250.00",
        status: "cleared",
    },
    {
        date: "Oct 01",
        category: "Housing",
        description: "Mortgage payment",
        account: "Checking **** 2841",
        amount: "-$2,145.00",
        status: "cleared",
    },
    {
        date: "Sep 30",
        category: "Lifestyle",
        description: "Gym membership",
        account: "Platinum Card **** 9012",
        amount: "-$89.00",
        status: "pending",
    },
    {
        date: "Sep 29",
        category: "Transportation",
        description: "Ride sharing",
        account: "Platinum Card **** 9012",
        amount: "-$26.50",
        status: "cleared",
    },
    {
        date: "Sep 28",
        category: "Investment",
        description: "ETF purchase",
        account: "Brokerage **** 4765",
        amount: "-$500.00",
        status: "failed",
    },
];

const goals = [
    {
        title: "Emergency fund",
        target: "$10,000",
        progress: 82,
        timeframe: "Oct 2025",
    },
    {
        title: "Vacation getaway",
        target: "$5,000",
        progress: 56,
        timeframe: "Jun 2025",
    },
    {
        title: "Home renovation",
        target: "$18,000",
        progress: 38,
        timeframe: "Dec 2025",
    },
];

const scheduledPayments = [
    {
        title: "Student loan payment",
        amount: "$320.00",
        due: "Due Oct 05",
        category: "Education",
    },
    {
        title: "Car insurance",
        amount: "$145.00",
        due: "Due Oct 08",
        category: "Insurance",
    },
    {
        title: "Internet and streaming bundle",
        amount: "$92.00",
        due: "Due Oct 11",
        category: "Utilities",
    },
];

const DashboardPage = () => {
    return (
        <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Welcome back, Kareem</h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Here is a consolidated view of your finances for October 2025.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        className="rounded-lg border border-neutral-200/70 px-4 py-2 text-sm font-semibold text-neutral-600 transition hover:border-primary-200 hover:text-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-500"
                    >
                        Generate report
                    </button>
                    <button
                        type="button"
                        className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    >
                        Add transaction
                    </button>
                </div>
            </div>

            <StatsGrid metrics={metricCards} />

            <div className="grid gap-6 xl:grid-cols-3">
                <BalanceTrendChart data={balanceTrend} className="xl:col-span-2" />
                <ExpenseBreakdownChart data={expenseBreakdown} className="xl:col-span-1" />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <TransactionsTable transactions={transactions} className="lg:col-span-2" />
                <div className="space-y-6">
                    <Card>
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Savings goals</h2>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">Track progress across active goals</p>
                            </div>
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-neutral-800/70 dark:text-neutral-100">
                                <Target className="h-5 w-5" />
                            </span>
                        </div>
                        <div className="mt-5 space-y-5">
                            {goals.map((goal) => (
                                <div key={goal.title}>
                                    <div className="flex items-center justify-between text-sm font-medium text-neutral-600 dark:text-neutral-200">
                                        <span className="text-neutral-700 dark:text-neutral-100">{goal.title}</span>
                                        <span>{goal.target}</span>
                                    </div>
                                    <div className="mt-3 flex items-center gap-3">
                                        <progress
                                            className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 accent-primary-500 dark:bg-neutral-800 dark:accent-primary-400"
                                            value={goal.progress}
                                            max={100}
                                        />
                                        <span className="w-12 text-right text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                                            {goal.progress}%
                                        </span>
                                    </div>
                                    <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">Target {goal.timeframe}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Scheduled payments</h2>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">Keep your upcoming bills organized</p>
                            </div>
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-50 text-accent-600 dark:bg-neutral-800/70 dark:text-neutral-100">
                                <CalendarClock className="h-5 w-5" />
                            </span>
                        </div>
                        <ul className="mt-5 space-y-4">
                            {scheduledPayments.map((payment) => (
                                <li
                                    key={payment.title}
                                    className="rounded-lg border border-neutral-200/70 px-4 py-3 text-sm transition hover:border-primary-200 dark:border-neutral-700 dark:hover:border-neutral-600"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-neutral-700 dark:text-neutral-100">{payment.title}</p>
                                            <p className="text-xs text-neutral-400 dark:text-neutral-500">{payment.category}</p>
                                        </div>
                                        <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">{payment.amount}</span>
                                    </div>
                                    <p className="mt-2 text-xs font-medium uppercase tracking-wide text-primary-600 dark:text-primary-400">{payment.due}</p>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default DashboardPage;
