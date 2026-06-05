"use client"

import { useState, useTransition } from "react"
import { createLoan, processLoanWithAgent } from "@/app/actions/agent-pride"
import { useRouter } from "next/navigation"

type Farmer = {
  id: number
  name: string
  phone: string
  region: string
  cropType: string
  landSizeHectares: string | null
  creditScore: number | null
  totalLoans: number | null
  repaymentRate: string | null
  status: string | null
  createdAt: Date
}

type Loan = {
  id: number
  farmerId: number
  amount: string | null
  purpose: string | null
  termMonths: number | null
  interestRate: string | null
  status: string | null
  currentAgent: string | null
  scoutDecision: string | null
  guardianDecision: string | null
  hunterAssigned: boolean | null
  createdAt: Date
}

type Activity = {
  id: number
  loanId: number
  agentType: string
  action: string
  details: string | null
  confidenceScore: string | null
  createdAt: Date
}

type LoanWithFarmer = {
  loan: Loan
  farmer: Farmer
}

export function LoansClient({ 
  initialLoans, 
  farmers,
  activities 
}: { 
  initialLoans: LoanWithFarmer[]
  farmers: Farmer[]
  activities: Activity[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showForm, setShowForm] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    farmerId: "",
    amount: "",
    purpose: "",
    termMonths: "6",
    interestRate: "12",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      await createLoan({
        farmerId: parseInt(formData.farmerId),
        amount: formData.amount,
        purpose: formData.purpose,
        termMonths: parseInt(formData.termMonths),
        interestRate: formData.interestRate,
      })
      setFormData({ farmerId: "", amount: "", purpose: "", termMonths: "6", interestRate: "12" })
      setShowForm(false)
      router.refresh()
    })
  }

  const handleProcess = async (loanId: number, agent: "scout" | "guardian" | "hunter") => {
    startTransition(async () => {
      await processLoanWithAgent(loanId, agent)
      router.refresh()
    })
  }

  const getStatusBadge = (status: string | null) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: "bg-amber-100", text: "text-amber-700", label: "Pending" },
      processing: { bg: "bg-blue-100", text: "text-blue-700", label: "Processing" },
      approved: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Approved" },
      rejected: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
      under_review: { bg: "bg-purple-100", text: "text-purple-700", label: "Under Review" },
    }
    const s = statusMap[status ?? "pending"] ?? statusMap.pending
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
        {s.label}
      </span>
    )
  }

  const getAgentBadge = (agent: string | null) => {
    const agentMap: Record<string, { bg: string; text: string; icon: string }> = {
      scout: { bg: "bg-blue-100", text: "text-blue-700", icon: "🔍" },
      guardian: { bg: "bg-emerald-100", text: "text-emerald-700", icon: "🛡️" },
      hunter: { bg: "bg-amber-100", text: "text-amber-700", icon: "🎯" },
      disbursement: { bg: "bg-green-100", text: "text-green-700", icon: "✅" },
    }
    const a = agentMap[agent ?? "scout"] ?? agentMap.scout
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${a.bg} ${a.text}`}>
        {a.icon} {agent?.charAt(0).toUpperCase()}{agent?.slice(1)}
      </span>
    )
  }

  const loanActivities = selectedLoan 
    ? activities.filter(a => a.loanId === selectedLoan)
    : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Loan Applications</h1>
          <p className="text-muted-foreground">Manage and process loan applications through AI agents</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          disabled={farmers.length === 0}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {showForm ? "Cancel" : "+ New Loan Application"}
        </button>
      </div>

      {farmers.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-800 text-sm">
            No farmers registered yet. Please register farmers first before creating loan applications.
          </p>
        </div>
      )}

      {showForm && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">New Loan Application</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Select Farmer</label>
              <select
                value={formData.farmerId}
                onChange={(e) => setFormData({ ...formData, farmerId: e.target.value })}
                required
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Choose a farmer</option>
                {farmers.map((farmer) => (
                  <option key={farmer.id} value={farmer.id}>
                    {farmer.name} - {farmer.region} ({farmer.cropType})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Loan Amount (KES)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., 50000"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1">Purpose</label>
              <input
                type="text"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                required
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., Fertilizer and seeds for planting season"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Term (Months)</label>
              <select
                value={formData.termMonths}
                onChange={(e) => setFormData({ ...formData, termMonths: e.target.value })}
                required
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="3">3 months</option>
                <option value="6">6 months</option>
                <option value="9">9 months</option>
                <option value="12">12 months</option>
                <option value="18">18 months</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Interest Rate (%)</label>
              <input
                type="number"
                step="0.5"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                required
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., 12"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
              >
                {isPending ? "Creating..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold text-foreground">All Loan Applications</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Farmer</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Purpose</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Agent</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {initialLoans.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                        <p>No loan applications yet</p>
                      </td>
                    </tr>
                  ) : (
                    initialLoans.map(({ loan, farmer }) => (
                      <tr 
                        key={loan.id} 
                        className={`hover:bg-muted/30 transition-colors cursor-pointer ${selectedLoan === loan.id ? "bg-muted/50" : ""}`}
                        onClick={() => setSelectedLoan(loan.id)}
                      >
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-foreground">{farmer.name}</p>
                            <p className="text-xs text-muted-foreground">{farmer.region}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-foreground">
                          KES {parseInt(loan.amount ?? "0").toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground max-w-[200px] truncate">
                          {loan.purpose}
                        </td>
                        <td className="px-4 py-3">{getStatusBadge(loan.status)}</td>
                        <td className="px-4 py-3">{getAgentBadge(loan.currentAgent)}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {loan.currentAgent === "scout" && loan.status === "pending" && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleProcess(loan.id, "scout"); }}
                                disabled={isPending}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200 disabled:opacity-50"
                              >
                                Scout
                              </button>
                            )}
                            {loan.currentAgent === "guardian" && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleProcess(loan.id, "guardian"); }}
                                disabled={isPending}
                                className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium hover:bg-emerald-200 disabled:opacity-50"
                              >
                                Guardian
                              </button>
                            )}
                            {loan.currentAgent === "hunter" && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleProcess(loan.id, "hunter"); }}
                                disabled={isPending}
                                className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium hover:bg-amber-200 disabled:opacity-50"
                              >
                                Hunter
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="font-semibold text-foreground mb-3">
              {selectedLoan ? `Loan #${selectedLoan} Timeline` : "Select a Loan"}
            </h3>
            {selectedLoan ? (
              loanActivities.length > 0 ? (
                <div className="space-y-3">
                  {loanActivities.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.agentType === "scout" ? "bg-blue-100" :
                        activity.agentType === "guardian" ? "bg-emerald-100" :
                        "bg-amber-100"
                      }`}>
                        {activity.agentType === "scout" ? "🔍" :
                         activity.agentType === "guardian" ? "🛡️" : "🎯"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground capitalize">
                          {activity.action.replace(/_/g, " ")}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {activity.details}
                        </p>
                        {activity.confidenceScore && (
                          <p className="text-xs text-primary mt-1">
                            Confidence: {activity.confidenceScore}%
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No activity yet for this loan.</p>
              )
            ) : (
              <p className="text-sm text-muted-foreground">
                Click on a loan to view its processing timeline and agent activities.
              </p>
            )}
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-emerald-500/10 rounded-xl border border-primary/20 p-4">
            <h3 className="font-semibold text-foreground mb-2">Agent Pipeline</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-xs">🔍</span>
                <span className="text-foreground">Scout</span>
                <span className="text-muted-foreground">→ Initial triage</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center text-xs">🛡️</span>
                <span className="text-foreground">Guardian</span>
                <span className="text-muted-foreground">→ Deep analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-amber-100 flex items-center justify-center text-xs">🎯</span>
                <span className="text-foreground">Hunter</span>
                <span className="text-muted-foreground">→ Recovery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
