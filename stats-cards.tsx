interface StatsCardsProps {
  stats: {
    farmers: number
    loans: {
      total: number
      pending: number
      approved: number
      rejected: number
      totalAmount: number
    }
    activities: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Registered Farmers",
      value: stats.farmers,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Total Loan Volume",
      value: `KES ${stats.loans.totalAmount.toLocaleString()}`,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Pending Review",
      value: stats.loans.pending,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Agent Actions",
      value: stats.activities,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${card.bgColor} ${card.color}`}>
              {card.icon}
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{card.value}</p>
          <p className="text-sm text-muted-foreground">{card.title}</p>
        </div>
      ))}
    </div>
  )
}
