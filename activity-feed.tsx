interface Activity {
  id: number
  agentType: string | null
  action: string | null
  details: string | null
  confidenceScore: string | null
  createdAt: Date
}

interface ActivityFeedProps {
  activities: Activity[]
}

const agentColors: Record<string, { bg: string; text: string; border: string }> = {
  scout: { bg: "bg-amber-500/10", text: "text-amber-600", border: "border-amber-500/30" },
  guardian: { bg: "bg-emerald-500/10", text: "text-emerald-600", border: "border-emerald-500/30" },
  hunter: { bg: "bg-blue-500/10", text: "text-blue-600", border: "border-blue-500/30" },
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Agent Activity Feed</h2>
        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
          Live
        </span>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {activities.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No agent activities yet. Submit a loan to see agents in action.
          </p>
        ) : (
          activities.map((activity) => {
            const colors = agentColors[activity.agentType ?? "scout"] ?? agentColors.scout
            return (
              <div
                key={activity.id}
                className={`p-4 rounded-lg border ${colors.border} ${colors.bg}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold uppercase px-2 py-0.5 rounded ${colors.text} bg-background`}
                    >
                      {activity.agentType}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {activity.action?.replace(/_/g, " ")}
                    </span>
                  </div>
                  {activity.confidenceScore && parseFloat(activity.confidenceScore) > 0 && (
                    <span className="text-xs font-mono text-muted-foreground">
                      Confidence: {parseFloat(activity.confidenceScore).toFixed(0)}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground">{activity.details}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(activity.createdAt).toLocaleString()}
                </p>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
