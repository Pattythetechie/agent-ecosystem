import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getLoansWithFarmers, getFarmers, getAgentActivities } from "@/app/actions/agent-pride"
import { LoansClient } from "./loans-client"

export default async function LoansPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  const [loansWithFarmers, farmers, activities] = await Promise.all([
    getLoansWithFarmers(),
    getFarmers(),
    getAgentActivities(),
  ])

  return (
    <LoansClient 
      initialLoans={loansWithFarmers} 
      farmers={farmers}
      activities={activities}
    />
  )
}
