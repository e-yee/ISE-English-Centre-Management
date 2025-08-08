import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import KPI from "@/components/charts/KPI";
import HorizontalBar from "@/components/charts/HorizontalBar";
import StackedBar100 from "@/components/charts/StackedBar100";
import ColumnBars from "@/components/charts/ColumnBars";

type LabeledValue = { label: string; value: number };

export default function StatisticsPage() {
  const navigate = useNavigate();

  // Mock data for prototyping UI only
  const overview = useMemo(
    () => ({
      totalEmployees: 120,
      totalTeachers: 45,
      totalLearningAdvisors: 18,
      totalStudents: 820,
      totalRevenue: 1_200_000,
    }),
    []
  );

  const studentStats = useMemo(
    () => ({
      ageBuckets: [
        { label: "Elementary (<12)", value: 310 },
        { label: "Middle (12–14)", value: 210 },
        { label: "High (15–17)", value: 150 },
        { label: "Other (>=18)", value: 80 },
      ] as LabeledValue[],
      subjectBuckets: [
        { label: "Math", value: 520 },
        { label: "English", value: 300 },
      ] as LabeledValue[],
      totalStudents: 820,
    }),
    []
  );

  // reserved for wiring API later; keep minimal now

  const teacherDetail = useMemo(
    () => ({
      lateCounts: 12,
      onTimeCounts: 68,
      totalMathHours: 45,
      totalEnglishHours: 27,
      leaveCounts: 6,
    }),
    []
  );

  const revenueByYear = useMemo(
    () => [
      { year: 2023, revenue: 400_000 },
      { year: 2024, revenue: 650_000 },
      { year: 2025, revenue: 1_050_000 },
      { year: 2026, revenue: 1_200_000 },
    ],
    []
  );

  // Precompute if needed later

  const latePct = teacherDetail.lateCounts + teacherDetail.onTimeCounts > 0
    ? Math.round(
        (teacherDetail.lateCounts /
          (teacherDetail.lateCounts + teacherDetail.onTimeCounts)) *
          100
      )
    : 0;
  const onTimePct = 100 - latePct;

  return (
    <div className="p-6 h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-white border border-black/20 rounded-[10px] shadow-[2px_2px_3px_0px_rgba(0,0,0,0.15)] px-4 py-2 transition-all duration-200 ease-in-out hover:shadow-[3px_3px_4px_0px_rgba(0,0,0,0.2)] hover:scale-105 focus:outline-none focus:ring-1 focus:ring-black focus:ring-offset-1 min-w-[90px]"
        >
          <span className="text-[16px] font-semibold text-black leading-[1em] font-comfortaa whitespace-nowrap">Back</span>
        </button>
        <h1 className="text-2xl font-semibold">Statistics</h1>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4 mb-8">
        <KPI title="Total Employees" value={overview.totalEmployees} />
        <KPI title="Teachers" value={overview.totalTeachers} />
        <KPI title="Learning Advisors" value={overview.totalLearningAdvisors} />
        <KPI title="Students" value={overview.totalStudents} />
        <KPI title="Revenue" value={`$${(overview.totalRevenue / 1_000_000).toFixed(1)}M`} />
        <KPI title="Approved Leaves" value={teacherDetail.leaveCounts} />
      </div>

      {/* Workforce mix small comparison */}
      <Section title="Workforce Mix">
        <HorizontalBar
          data={[
            { label: "Teachers", value: overview.totalTeachers },
            { label: "Learning Advisors", value: overview.totalLearningAdvisors },
          ]}
          height={120}
        />
      </Section>

      {/* Students distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-8">
        <Section title="Students by Age Group">
          <HorizontalBar data={studentStats.ageBuckets} height={200} />
          <div className="text-xs text-black/60 mt-3">Total Students: {studentStats.totalStudents}</div>
        </Section>

        <Section title="Students by Subject">
          <HorizontalBar data={studentStats.subjectBuckets} height={140} />
        </Section>
      </div>

      {/* Revenue by year (discrete time series) */}
      <Section title="Annual Revenue">
        <ColumnBars
          data={revenueByYear.map((r) => ({ x: r.year, y: r.revenue }))}
          yTickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`}
          highlightIndex={revenueByYear.length - 1}
        />
      </Section>

      {/* Teacher details (example) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Section title="Punctuality (100%)">
          <StackedBar100
            data={{ late: latePct, onTime: onTimePct }}
            parts={[
              { key: "late", label: "Late", color: "#EF4444" },
              { key: "onTime", label: "On-time", color: "#2563EB" },
            ]}
          />
          <div className="text-xs text-black/60 mt-2">{`${latePct}% Late, ${onTimePct}% On-time (Late: ${teacherDetail.lateCounts} | On-time: ${teacherDetail.onTimeCounts})`}</div>
        </Section>

        <Section title="Teaching Hours by Subject">
          <HorizontalBar
            data={[
              { label: "Math", value: teacherDetail.totalMathHours },
              { label: "English", value: teacherDetail.totalEnglishHours },
            ]}
            height={120}
          />
        </Section>

        {/* Leaves KPI moved to top tiles */}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm">
      <div className="text-sm font-semibold mb-4">{title}</div>
      {children}
    </div>
  );
}
 
