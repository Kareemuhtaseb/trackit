import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';
import { cn } from '../../utils/cn.js';

const statusVariantMap = {
    cleared: 'success',
    pending: 'warning',
    failed: 'danger',
};

const TransactionsTable = ({ transactions = [], className = '' }) => {
    return (
        <Card className={cn('overflow-hidden', className)} padding="p-0">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200/70 px-6 py-4 dark:border-neutral-800">
                <div>
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Recent Transactions</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Latest account activity synced from connected institutions</p>
                </div>
                <button
                    type="button"
                    className="rounded-lg border border-neutral-200/70 px-3 py-2 text-sm font-medium text-neutral-600 transition hover:border-primary-200 hover:text-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-600"
                >
                    View all
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200/70 text-left text-sm dark:divide-neutral-800">
                    <thead className="bg-surface-muted text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:bg-surface-dark-muted dark:text-neutral-500">
                        <tr>
                            <th scope="col" className="px-6 py-4">Date</th>
                            <th scope="col" className="px-6 py-4">Category</th>
                            <th scope="col" className="px-6 py-4">Description</th>
                            <th scope="col" className="px-6 py-4 text-right">Amount</th>
                            <th scope="col" className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200/70 text-sm text-neutral-600 dark:divide-neutral-800 dark:text-neutral-200">
                        {transactions.map((transaction) => (
                            <tr key={`${transaction.date}-${transaction.description}`} className="hover:bg-primary-50/50 dark:hover:bg-neutral-800/40">
                                <td className="whitespace-nowrap px-6 py-4 font-medium text-neutral-700 dark:text-neutral-200">
                                    {transaction.date}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">{transaction.category}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-neutral-700 dark:text-neutral-100">{transaction.description}</span>
                                        <span className="text-xs text-neutral-400 dark:text-neutral-500">{transaction.account}</span>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right font-semibold text-neutral-800 dark:text-neutral-50">
                                    {transaction.amount}
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={statusVariantMap[transaction.status] ?? 'default'}>
                                        {transaction.status}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default TransactionsTable;
