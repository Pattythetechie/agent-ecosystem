"use client"

import { useTransition } from "react"
import { processLoanWithAgent } from "@/app/actions/agent-pride"

interface AgentVisualizerProps {
  loans: {
    loan: {
      id: number
      amount: string | null
      purpose: string | null
      status: string | null
      currentAgent: string | null
      scoutDecision: string | null
      guardianDecision: string | null
      hunterAssigned: boolean | null
    }
    farmer: {
      name: string
    }
  }[]
}

const agents = [
  {
    id: "scout",
    name: "Scout",
    role: "Loan Triage",
    description: "First contact: evaluates eligibility, performs quick risk assessment",
    color: "bg-amber-500",
    textColor: "text-amber-500",
    bgLight: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
  },
  {
    id: "guardian",
    name: "Guardian",
    role: "Deep Analysis",
    description: "Analyzes credit history, repayment patterns, and approves loans",
    color: "bg-emerald-500",
    textColor: "text-emerald-500",
    bgLight: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
  },
  {
    id: "hunter",
    name: "Hunter",
    role: "Recovery Agent",
    description: "Empathetic follow-up for at-risk loans, creates flexible repayment plans",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    bgLight: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
]

export function AgentVisualizer({ loans }: AgentVisualizerProps) {
  const [isPending, startTransition] = useTransition()

  const handleProcess = (loanId: number, agentType: "scout" | "guardian" | "hunter") => {
    startTransition(async () => {
      await processLoanWithAgent(loanId, agentType)
    })
  }

  const getLoansForAgent = (agentId: string) => {
    return loans.filter((l) => l.loan.currentAgent === agentId && l.loan.status !== "rejected")
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Agent Pipeline</h2>
        <span className="text-sm text-muted-foreground">Real-time loan processing</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const agentLoans = getLoansForAgent(agent.id)
          return (
            <div
              key={agent.id}
              className={`rounded-xl border ${agent.borderColor} ${agent.bgLight} p-4`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-3 h-3 rounded-full ${agent.color} animate-pulse`} />
                <div>
                  <h3 className={`font-semibold ${agent.textColor}`}>{agent.name}</h3>
                  <p className="text-xs text-muted-foreground">{agent.role}</p>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mb-4">{agent.description}</p>
              
              <div className="space-y-2">
                {agentLoans.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No active loans</p>
                ) : (
                  agentLoans.slice(0, 3).map(({ loan, farmer }) => (
                    <div
                      key={loan.id}
                      className="bg-background/50 rounded-lg p-3 border border-border/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground truncate">
                          {farmer.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          KES {parseInt(loan.amount ?? "0").toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 truncate">
                        {loan.purpose}
                      </p>
                      <button
                        onClick={() => handleProcess(loan.id, agent.id as "scout" | "guardian" | "hunter")}
                        disabled={isPending}
                        className={`w-full text-xs py-1.5 rounded-md ${agent.color} text-white hover:opacity-90 transition-opacity disabled:opacity-50`}
                      >
                        {isPending ? "Processing..." : `Process with ${agent.name}`}
                      </button>
                    </div>
                  ))
                )}
              </div>
              
              {agentLoans.length > 3 && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  +{agentLoans.length - 3} more
                </p>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Flow arrows on desktop */}
      <div className="hidden md:flex justify-center items-center mt-6 gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-600">Scout</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-600">Guardian</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-600">Hunter (if needed)</span>
        </div>
      </div>
    </div>
  )
}
