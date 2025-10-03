import MetricCard from './MetricCard.jsx';

const StatsGrid = ({ metrics = [] }) => (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
        ))}
    </div>
);

export default StatsGrid;
