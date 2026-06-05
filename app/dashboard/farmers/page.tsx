import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getFarmers } from "@/app/actions/agent-pride"
import { FarmersClient } from "./farmers-client"

export default async function FarmersPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  const farmers = await getFarmers()

  return <FarmersClient initialFarmers={farmers} />
}
