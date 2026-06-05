interface SmsLog {
  id: number
  direction: string | null
  message: string | null
  agentType: string | null
  status: string | null
  createdAt: Date
}

interface SmsSimulatorProps {
  logs: SmsLog[]
}

export function SmsSimulator({ logs }: SmsSimulatorProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">SMS Communication Log</h2>
        <span className="text-xs text-muted-foreground">M-Pesa & SMS Integration</span>
      </div>

      {/* Phone mockup */}
      <div className="max-w-xs mx-auto">
        <div className="bg-neutral-900 rounded-[2rem] p-3 shadow-xl">
          {/* Phone notch */}
          <div className="bg-neutral-900 h-6 rounded-t-[1.5rem] flex justify-center items-end pb-1">
            <div className="w-20 h-4 bg-neutral-800 rounded-full" />
          </div>
          
          {/* Screen */}
          <div className="bg-neutral-800 rounded-2xl p-4 min-h-[350px]">
            {/* Header */}
            <div className="text-center mb-4">
              <p className="text-xs text-neutral-400">Agent Pride</p>
              <p className="text-[10px] text-neutral-500">Financial Inclusion Messages</p>
            </div>

            {/* Messages */}
            <div className="space-y-3 max-h-[270px] overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-neutral-500">
                    No messages yet
                  </p>
                  <p className="text-[10px] text-neutral-600 mt-1">
                    Process a loan to see SMS notifications
                  </p>
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className={`rounded-2xl p-3 max-w-[85%] ${
                      log.direction === "outbound"
                        ? "ml-auto bg-emerald-600 text-white rounded-br-sm"
                        : "bg-neutral-700 text-neutral-100 rounded-bl-sm"
                    }`}
                  >
                    <p className="text-xs leading-relaxed">{log.message}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] opacity-70 capitalize">
                        {log.agentType ?? "System"}
                      </span>
                      <span className="text-[10px] opacity-70">
                        {new Date(log.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Home indicator */}
          <div className="flex justify-center pt-2">
            <div className="w-28 h-1 bg-neutral-600 rounded-full" />
          </div>
        </div>
      </div>

      <p className="text-xs text-center text-muted-foreground mt-4">
        Simulated SMS messages sent via Safaricom M-Pesa integration
      </p>
    </div>
  )
}
