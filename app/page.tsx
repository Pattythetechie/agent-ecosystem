import Link from "next/link"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect("/dashboard")

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-bold text-xl text-foreground">Agent Pride</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Empowering 33M+ Smallholder Farmers
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight text-balance">
              Financial Dignity Through
              <span className="text-primary"> Intelligent Agents</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Agent Pride is a multi-agent AI ecosystem that provides accessible, dignified financial services 
              to African farmers. Our Scout, Guardian, and Hunter agents work together to triage loans, 
              manage approvals, and handle recovery with empathy.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/sign-up"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
              >
                View Live Demo
              </Link>
              <Link
                href="#how-it-works"
                className="px-8 py-4 bg-card border border-border text-foreground rounded-xl text-lg font-medium hover:bg-accent transition-colors"
              >
                How It Works
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "33M+", label: "Target Farmers" },
              { value: "$1.2B", label: "Financing Gap" },
              { value: "92%", label: "Repayment Rate" },
              { value: "3", label: "AI Agents" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-2xl bg-card border border-border">
                <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">The Agent Ecosystem</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Three specialized AI agents work in harmony to provide end-to-end financial services
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Scout Agent */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20">
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="w-4 h-4 rounded-full bg-amber-500 mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Scout Agent</h3>
              <p className="text-sm text-amber-600 font-medium mb-4">Loan Triage & Initial Assessment</p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Receives loan applications via SMS/USSD
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Performs rapid eligibility screening
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Routes to Guardian or provides instant feedback
                </li>
              </ul>
            </div>

            {/* Guardian Agent */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="w-4 h-4 rounded-full bg-emerald-500 mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Guardian Agent</h3>
              <p className="text-sm text-emerald-600 font-medium mb-4">Deep Analysis & Approval</p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Analyzes credit history and repayment patterns
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Considers harvest cycles for timing
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Triggers M-Pesa disbursement on approval
                </li>
              </ul>
            </div>

            {/* Hunter Agent */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="w-4 h-4 rounded-full bg-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Hunter Agent</h3>
              <p className="text-sm text-blue-600 font-medium mb-4">Empathetic Recovery</p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Handles at-risk loans with dignity
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Creates flexible repayment plans
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Preserves relationships and future lending
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                The $1.2B Agricultural Financing Gap
              </h2>
              <p className="text-muted-foreground mb-6">
                In Kenya alone, 33 million smallholder farmers face a massive financing gap. Traditional banks 
                require collateral most farmers don&apos;t have. Mobile lenders charge predatory rates. The result? 
                Farmers can&apos;t invest in seeds, fertilizer, or equipment when they need it most.
              </p>
              <ul className="space-y-4">
                {[
                  "75% of farmers lack access to formal credit",
                  "Average mobile lending rates exceed 100% APR",
                  "Seasonal income creates repayment challenges",
                  "Language barriers limit financial literacy",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-foreground">
                    <div className="w-2 h-2 rounded-full bg-destructive" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-emerald-500/10 to-blue-500/20 border border-border p-8 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-6xl font-bold text-primary">$1.2B</p>
                  <p className="text-xl text-muted-foreground mt-2">Annual Financing Gap</p>
                  <p className="text-sm text-muted-foreground mt-1">Kenya Smallholder Agriculture</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-emerald-500/5 to-blue-500/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to See Agent Pride in Action?
          </h2>
          <p className="text-muted-foreground mb-8">
            Explore our live prototype and see how Scout, Guardian, and Hunter agents work together 
            to provide dignified financial services.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
          >
            Launch Demo Dashboard
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-semibold text-foreground">Agent Pride</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Financial Inclusion for African Farmers
          </p>
        </div>
      </footer>
    </div>
  )
}
