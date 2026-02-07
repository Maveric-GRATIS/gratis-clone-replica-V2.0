// src/lib/export/report-generator.ts
// Scheduled report generation engine (Client-side for Vite/React)

import { db } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { ReportDefinition, ReportResult, ChartData, ExportScope } from '@/types/export';

const SCOPE_TO_COLLECTION: Record<ExportScope, string> = {
  donations: 'donations',
  users: 'users',
  projects: 'projects',
  events: 'events',
  bottles: 'bottle_submissions',
  partners: 'partners',
  subscriptions: 'subscriptions',
  audit_logs: 'audit_logs',
};

export class ReportGenerator {
  /**
   * Generate a report from definition
   */
  static async generate(
    definition: ReportDefinition,
    dateRange: { start: string; end: string }
  ): Promise<ReportResult> {
    const summary: Record<string, number | string> = {};
    const data: Record<string, unknown>[] = [];
    const charts: ChartData[] = [];

    for (const scope of definition.scope) {
      const collectionName = SCOPE_TO_COLLECTION[scope];

      // Build query
      let q = query(collection(db, collectionName));

      // Apply date range filter
      if (dateRange) {
        q = query(
          q,
          where('createdAt', '>=', dateRange.start),
          where('createdAt', '<=', dateRange.end)
        );
      }

      const snapshot = await getDocs(q);
      const records = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Calculate metrics
      for (const metric of definition.metrics) {
        const key = `${scope}_${metric.field}_${metric.aggregation}`;
        const values = records
          .map((r) => Number(r[metric.field] || 0))
          .filter((v) => !isNaN(v));

        switch (metric.aggregation) {
          case 'sum':
            summary[key] = values.reduce((a, b) => a + b, 0);
            break;
          case 'avg':
            summary[key] =
              values.length > 0
                ? values.reduce((a, b) => a + b, 0) / values.length
                : 0;
            break;
          case 'count':
            summary[key] = records.length;
            break;
          case 'min':
            summary[key] = values.length > 0 ? Math.min(...values) : 0;
            break;
          case 'max':
            summary[key] = values.length > 0 ? Math.max(...values) : 0;
            break;
          case 'distinct':
            summary[key] = new Set(records.map((r) => r[metric.field])).size;
            break;
        }
      }

      // Group data if specified
      if (definition.groupBy?.length) {
        const grouped = this.groupData(records, definition.groupBy[0]);
        for (const [group, items] of Object.entries(grouped)) {
          const row: Record<string, unknown> = { group };
          for (const metric of definition.metrics) {
            const vals = (items as Record<string, unknown>[])
              .map((r) => Number(r[metric.field] || 0))
              .filter((v) => !isNaN(v));

            switch (metric.aggregation) {
              case 'sum':
                row[metric.label] = vals.reduce((a, b) => a + b, 0);
                break;
              case 'avg':
                row[metric.label] =
                  vals.length > 0
                    ? vals.reduce((a, b) => a + b, 0) / vals.length
                    : 0;
                break;
              case 'count':
                row[metric.label] = (items as unknown[]).length;
                break;
              default:
                row[metric.label] = vals.length;
            }
          }
          data.push(row);
        }

        // Generate chart data (limit to 20 groups for readability)
        if (data.length > 0 && data.length <= 20) {
          const metric = definition.metrics[0];
          charts.push({
            type: 'bar',
            title: `${metric.label} by ${definition.groupBy[0]}`,
            labels: data.map((d) => String(d.group)),
            datasets: [
              {
                label: metric.label,
                data: data.map((d) => Number(d[metric.label] || 0)),
                color: '#10b981',
              },
            ],
          });
        }
      } else {
        // No grouping - add raw records (limit 1000)
        data.push(...records.slice(0, 1000));
      }
    }

    return {
      reportId: definition.id,
      title: definition.name,
      generatedAt: new Date().toISOString(),
      dateRange,
      summary,
      data,
      charts,
    };
  }

  /**
   * Group records by a field
   */
  private static groupData(
    records: Record<string, unknown>[],
    field: string
  ): Record<string, Record<string, unknown>[]> {
    const groups: Record<string, Record<string, unknown>[]> = {};
    for (const record of records) {
      const key = String(record[field] || 'Unknown');
      if (!groups[key]) groups[key] = [];
      groups[key].push(record);
    }
    return groups;
  }

  /**
   * Generate time-series chart data
   */
  static generateTimeSeriesChart(
    data: Record<string, unknown>[],
    dateField: string,
    valueField: string,
    title: string
  ): ChartData {
    // Group by date
    const grouped: Record<string, number[]> = {};

    for (const record of data) {
      const dateValue = record[dateField];
      if (!dateValue) continue;

      // Convert to date string (YYYY-MM-DD)
      const date = new Date(dateValue as string).toISOString().split('T')[0];
      const value = Number(record[valueField] || 0);

      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(value);
    }

    // Sort dates and calculate sums
    const sortedDates = Object.keys(grouped).sort();
    const sums = sortedDates.map((date) =>
      grouped[date].reduce((a, b) => a + b, 0)
    );

    return {
      type: 'line',
      title,
      labels: sortedDates,
      datasets: [
        {
          label: title,
          data: sums,
          color: '#10b981',
        },
      ],
    };
  }

  /**
   * Generate pie chart data for categorical distribution
   */
  static generatePieChart(
    data: Record<string, unknown>[],
    categoryField: string,
    title: string
  ): ChartData {
    const counts: Record<string, number> = {};

    for (const record of data) {
      const category = String(record[categoryField] || 'Unknown');
      counts[category] = (counts[category] || 0) + 1;
    }

    // Sort by count and take top 10
    const sorted = Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    return {
      type: 'pie',
      title,
      labels: sorted.map(([label]) => label),
      datasets: [
        {
          label: title,
          data: sorted.map(([, count]) => count),
          color: '#10b981',
        },
      ],
    };
  }
}
