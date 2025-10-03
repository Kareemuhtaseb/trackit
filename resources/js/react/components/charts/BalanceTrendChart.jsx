import Card from '../ui/Card.jsx';
import { cn } from '../../utils/cn.js';
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
});

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) {
        return null;
    }

    return (
        <div className="rounded-lg border border-neutral-200/70 bg-surface px-4 py-3 text-sm shadow-lg dark:border-neutral-700 dark:bg-surface-dark">
            <p className="font-semibold text-neutral-600 dark:text-neutral-200">{label}</p>
            <p className="mt-1 text-neutral-500 dark:text-neutral-400">Balance</p>
            <p className="mt-1 text-lg font-semibold text-primary-600 dark:text-primary-400">
                {currencyFormatter.format(payload[0].value)}
            </p>
        </div>
    );
};

const BalanceTrendChart = ({ data = [], className = '' }) => {
    return (
        <Card className={cn('col-span-2', className)}>
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Balance Over Time</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Track total balance changes for the last 12 months</p>
                </div>
                <select
                    className="rounded-lg border border-neutral-200/70 bg-surface px-3 py-2 text-sm font-medium text-neutral-600 shadow-sm transition focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-neutral-700 dark:bg-surface-dark dark:text-neutral-200 dark:focus:border-primary-500 dark:focus:ring-primary-500/30"
                    defaultValue="12m"
                    aria-label="Select time range"
                >
                    <option value="3m">Last 3 months</option>
                    <option value="6m">Last 6 months</option>
                    <option value="12m">Last 12 months</option>
                </select>
            </div>
            <div className="mt-6 h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 16, right: 24, bottom: 8, left: 8 }}>
                        <defs>
                            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--color-primary-500)" stopOpacity="0.3" />
                                <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="4 8" stroke="var(--color-neutral-200)" vertical={false} />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--color-neutral-500)', fontSize: 12 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                            tick={{ fill: 'var(--color-neutral-500)', fontSize: 12 }}
                            width={60}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-primary-500)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Line
                            type="monotone"
                            dataKey="balance"
                            stroke="var(--color-primary-500)"
                            strokeWidth={2.5}
                            dot={{ r: 4, strokeWidth: 2, stroke: 'var(--color-primary-500)', fill: 'var(--color-surface)' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            fill="url(#balanceGradient)"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default BalanceTrendChart;
