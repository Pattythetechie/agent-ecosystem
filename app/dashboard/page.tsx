import { StatsCards } from "@/components/stats-cards"
import { AgentVisualizer } from "@/components/agent-visualizer"
import { LoanManagement } from "@/components/loan-management"
import { ActivityFeed } from "@/components/activity-feed"
import { SmsSimulator } from "@/components/sms-simulator"
import {
  getDashboardStats,
  getFarmers,
  getLoansWithFarmers,
  getAgentActivities,
  getSmsLogs,
} from "@/app/actions/agent-pride"

export default async function DashboardPage() {
  const [stats, farmers, loansWithFarmers, activities, smsLogs] = await Promise.all([
    getDashboardStats(),
    getFarmers(),
    getLoansWithFarmers(),
    getAgentActivities(),
    getSmsLogs(),
  ])

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-emerald-500/10 to-blue-500/10 border border-primary/20 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Multi-Agent Financial Ecosystem
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Watch Scout, Guardian, and Hunter agents work together to provide dignified, accessible financial services to African farmers through intelligent loan triage, approval, and empathetic recovery.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-background flex items-center justify-center text-white text-xs font-bold">S</div>
              <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center text-white text-xs font-bold">G</div>
              <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-background flex items-center justify-center text-white text-xs font-bold">H</div>
            </div>
            <span className="text-sm text-muted-foreground">3 Agents Active</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Agent Pipeline */}
      <AgentVisualizer loans={loansWithFarmers} />

      {/* Two column layout for activity and SMS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed activities={activities} />
        </div>
        <div>
          <SmsSimulator logs={smsLogs} />
        </div>
      </div>

      {/* Loan Management */}
      <LoanManagement farmers={farmers} />
    </div>
  )
}
