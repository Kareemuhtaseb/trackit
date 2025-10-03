import Card from '../ui/Card.jsx';
import { cn } from '../../utils/cn.js';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const palette = [
    { fill: 'var(--color-primary-500)', indicator: 'bg-primary-500' },
    { fill: 'var(--color-accent-500)', indicator: 'bg-accent-500' },
    { fill: 'var(--color-warning-500)', indicator: 'bg-warning-500' },
    { fill: 'var(--color-success-500)', indicator: 'bg-success-500' },
    { fill: 'var(--color-danger-500)', indicator: 'bg-danger-500' },
];

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) {
        return null;
    }

    const { name, value, percent } = payload[0];

    return (
        <div className="rounded-lg border border-neutral-200/70 bg-surface px-4 py-3 text-sm shadow-lg dark:border-neutral-700 dark:bg-surface-dark">
            <p className="font-semibold text-neutral-700 dark:text-neutral-100">{name}</p>
            <p className="mt-1 text-neutral-500 dark:text-neutral-400">${value.toLocaleString()}</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">{(percent * 100).toFixed(1)}% of spending</p>
        </div>
    );
};

const ExpenseBreakdownChart = ({ data = [], className = '' }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <Card className={cn('col-span-1', className)}>
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Expense Categories</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">How your monthly spending is distributed</p>
                </div>
                <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-neutral-400 dark:text-neutral-500">Total Monthly Spend</p>
                    <p className="mt-1 text-xl font-semibold text-neutral-900 dark:text-neutral-100">${total.toLocaleString()}</p>
                </div>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_240px]">
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={70}
                                outerRadius={110}
                                paddingAngle={6}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={entry.name} fill={palette[index % palette.length].fill} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <ul className="space-y-4">
                    {data.map((item, index) => {
                        const paletteEntry = palette[index % palette.length];
                        const percentage = total ? ((item.value / total) * 100).toFixed(1) : '0.0';
                        return (
                            <li key={item.name} className="flex items-center justify-between gap-3 text-sm">
                                <div className="flex items-center gap-3">
                                    <span className={`h-3 w-3 rounded-full ${paletteEntry.indicator}`} aria-hidden />
                                    <div>
                                        <p className="font-medium text-neutral-700 dark:text-neutral-100">{item.name}</p>
                                        <p className="text-xs text-neutral-400 dark:text-neutral-500">
                                            ${item.value.toLocaleString()} • {percentage}%
                                        </p>
                                    </div>
                                </div>
                                <span className="font-semibold text-neutral-600 dark:text-neutral-200">${item.value.toLocaleString()}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </Card>
    );
};

export default ExpenseBreakdownChart;
