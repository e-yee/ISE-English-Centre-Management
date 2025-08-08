import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "Learning Advisor" | "Manager" | "Teacher";

const MODULES = [
  { key: "courses", title: "Courses", to: "/dashboard/courses", roles: ["Learning Advisor", "Manager"] as Role[] },
  { key: "students", title: "Students", to: "/dashboard/students", roles: ["Learning Advisor", "Manager"] as Role[] },
  { key: "staff", title: "Staff", to: "/dashboard/staff", roles: ["Manager"] as Role[] },
  { key: "stats", title: "Statistics", to: "/dashboard/statistics", roles: ["Manager"] as Role[] },
];

function LoadingGrid() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-1/2" />
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-9 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

type DashboardCardProps = {
  title?: string;
  description?: string;
  href?: string;
  accentFrom?: string;
  accentTo?: string;
  badge?: string;
  className?: string;
};

function DashboardCard({
  title = "Section",
  description = "Manage and track everything in one place.",
  href = "#",
  accentFrom = "from-emerald-500",
  accentTo = "to-amber-500",
  badge,
  className,
}: DashboardCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden border shadow-sm transition-all hover:shadow-md focus-within:shadow-md",
        "focus-within:ring-2 focus-within:ring-foreground/20",
        className
      )}
    >
      <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", accentFrom, accentTo)} />
      <CardHeader className="flex flex-row items-start gap-4">
        <div
          className={cn(
            "rounded-lg p-2 text-white shadow-sm",
            "bg-gradient-to-br",
            accentFrom,
            accentTo
          )}
          aria-hidden="true"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl">{title}</CardTitle>
            {badge ? <Badge variant="secondary">{badge}</Badge> : null}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <ul className="mt-2 grid gap-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-foreground/30" aria-hidden="true" />
            {"Quick access, search, and filters"}
          </li>
          <li className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-foreground/30" aria-hidden="true" />
            {"Recent activity at a glance"}
          </li>
        </ul>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{"Tip: Press Enter to open"}</div>
        <div className="flex items-center gap-2">
          <Button asChild className="group/btn">
            <Link to={href} aria-label={`Open ${title}`}>
              {"Open"}
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </CardFooter>

      <Link
        to={href}
        aria-label={`Open ${title}`}
        className="absolute inset-0 rounded-md outline-none"
        tabIndex={-1}
      />
    </Card>
  );
}

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const role = (user?.role || "Teacher") as Role;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="h-8 w-56 mb-6">
          <Skeleton className="h-8 w-full" />
        </div>
        <LoadingGrid />
      </div>
    );
  }

  const visible = MODULES.filter((m) => m.roles.includes(role));

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((m) => (
          <DashboardCard
            key={m.key}
            title={m.title}
            href={m.to}
            description={
              m.key === "courses"
                ? "Browse and manage courses"
                : m.key === "students"
                ? "Search and manage students"
                : m.key === "staff"
                ? "Manage staff"
                : "KPIs and reports"
            }
            accentFrom={
              m.key === "courses"
                ? "from-emerald-500"
                : m.key === "students"
                ? "from-sky-500"
                : m.key === "staff"
                ? "from-rose-500"
                : "from-indigo-500"
            }
            accentTo={
              m.key === "courses"
                ? "to-amber-500"
                : m.key === "students"
                ? "to-violet-500"
                : m.key === "staff"
                ? "to-orange-500"
                : "to-cyan-500"
            }
          />
        ))}
      </div>
    </div>
  );
}


