import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import Card from '../ui/Card.jsx';
import { cn } from '../../utils/cn.js';

const MetricCard = ({ title, value, change, period = 'vs last month', trend = 'up', icon: Icon }) => {
    const isPositive = trend === 'up';

    return (
        <Card className="relative overflow-hidden" padding="p-6">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
                    <h3 className="mt-3 text-2xl font-semibold text-neutral-900 dark:text-neutral-50">{value}</h3>
                </div>
                {Icon ? (
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-neutral-800/70 dark:text-neutral-100">
                        <Icon className="h-5 w-5" />
                    </span>
                ) : null}
            </div>
            {change ? (
                <div className="mt-6 flex items-center gap-2 text-sm">
                    <span
                        className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
                            isPositive
                                ? 'bg-success-100 text-success-700 dark:bg-success-700/30 dark:text-success-100'
                                : 'bg-danger-100 text-danger-600 dark:bg-danger-700/30 dark:text-danger-100',
                        )}
                    >
                        {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        {change}
                    </span>
                    <span className="text-neutral-400">{period}</span>
                </div>
            ) : null}
            <div className="pointer-events-none absolute inset-0 rounded-xl border border-transparent opacity-0 transition dark:border-neutral-800" />
        </Card>
    );
};

export default MetricCard;
