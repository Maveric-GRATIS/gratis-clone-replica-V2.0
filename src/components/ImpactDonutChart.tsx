import { useTranslation } from "react-i18next";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ImpactDonutChartProps {
  waterAmount: number;
  artsAmount: number;
  educationAmount: number;
}

export const ImpactDonutChart = ({
  waterAmount,
  artsAmount,
  educationAmount,
}: ImpactDonutChartProps) => {
  const { t } = useTranslation();

  const data = [
    {
      name: t("impactPage.allocation.water"),
      value: waterAmount,
      color: "#3B82F6",
    },
    {
      name: t("impactPage.allocation.arts"),
      value: artsAmount,
      color: "#8B5CF6",
    },
    {
      name: t("impactPage.allocation.education"),
      value: educationAmount,
      color: "#10B981",
    },
  ];

  const total = waterAmount + artsAmount + educationAmount;

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string }>;
  }) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <Card className="p-3 shadow-lg">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-lg font-bold text-primary">
            €{payload[0].value.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">{percentage}%</p>
        </Card>
      );
    }
    return null;
  };

  const renderLegend = (props: {
    payload: Array<{ value: string; color: string }>;
  }) => {
    const { payload } = props;
    return (
      <div className="flex flex-col gap-3 mt-6">
        {payload.map(
          (entry: { value: string; color: string }, index: number) => {
            const percentage = ((entry.value / total) * 100).toFixed(1);
            return (
              <div
                key={`legend-${index}`}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm font-medium">{entry.value}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">
                    €{data[index].value.toLocaleString()}
                  </span>
                  <Badge variant="secondary">{percentage}%</Badge>
                </div>
              </div>
            );
          },
        )}
      </div>
    );
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center">
        <h3 className="text-2xl font-bold mb-2">
          {t("impactPage.allocation.title")}
        </h3>
        <p className="text-muted-foreground mb-6 text-center">
          {t("impactPage.allocation.subtitle")}
        </p>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {t("impactPage.allocation.total")}
          </p>
          <p className="text-3xl font-bold text-primary">
            €{total.toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
};
