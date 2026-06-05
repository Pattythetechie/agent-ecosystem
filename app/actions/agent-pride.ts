"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { farmers, loans, agentActivities, smsLogs } from "@/lib/db/schema"
import { and, desc, eq, sql } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

// Farmer actions
export async function getFarmers() {
  const userId = await getUserId()
  return db.select().from(farmers).where(eq(farmers.userId, userId)).orderBy(desc(farmers.createdAt))
}

export async function createFarmer(data: {
  name: string
  phone: string
  region: string
  cropType: string
  landSizeHectares: string
}) {
  const userId = await getUserId()
  const [farmer] = await db
    .insert(farmers)
    .values({
      userId,
      name: data.name,
      phone: data.phone,
      region: data.region,
      cropType: data.cropType,
      landSizeHectares: data.landSizeHectares,
    })
    .returning()
  revalidatePath("/dashboard")
  return farmer
}

// Loan actions
export async function getLoans() {
  const userId = await getUserId()
  return db.select().from(loans).where(eq(loans.userId, userId)).orderBy(desc(loans.createdAt))
}

export async function getLoansWithFarmers() {
  const userId = await getUserId()
  const result = await db
    .select({
      loan: loans,
      farmer: farmers,
    })
    .from(loans)
    .innerJoin(farmers, eq(loans.farmerId, farmers.id))
    .where(eq(loans.userId, userId))
    .orderBy(desc(loans.createdAt))
  return result
}

export async function createLoan(data: {
  farmerId: number
  amount: string
  purpose: string
  termMonths: number
  interestRate: string
}) {
  const userId = await getUserId()
  
  const [loan] = await db
    .insert(loans)
    .values({
      userId,
      farmerId: data.farmerId,
      amount: data.amount,
      purpose: data.purpose,
      termMonths: data.termMonths,
      interestRate: data.interestRate,
    })
    .returning()

  // Create initial Scout activity
  await db.insert(agentActivities).values({
    userId,
    loanId: loan.id,
    agentType: "scout",
    action: "loan_received",
    details: `New loan application received: KES ${data.amount} for ${data.purpose}`,
    confidenceScore: "0",
  })

  revalidatePath("/dashboard")
  return loan
}

// Agent processing simulation
export async function processLoanWithAgent(loanId: number, agentType: "scout" | "guardian" | "hunter") {
  const userId = await getUserId()
  
  const [loan] = await db
    .select()
    .from(loans)
    .where(and(eq(loans.id, loanId), eq(loans.userId, userId)))

  if (!loan) throw new Error("Loan not found")

  const [farmer] = await db
    .select()
    .from(farmers)
    .where(eq(farmers.id, loan.farmerId))

  if (!farmer) throw new Error("Farmer not found")

  // Simulate AI agent processing with realistic logic
  const creditScore = farmer.creditScore ?? 500
  const landSize = parseFloat(farmer.landSizeHectares?.toString() ?? "0")
  const loanAmount = parseFloat(loan.amount?.toString() ?? "0")

  if (agentType === "scout") {
    // Scout evaluates initial eligibility
    const riskScore = Math.min(100, Math.max(0, 
      (creditScore / 10) + 
      (landSize * 5) - 
      (loanAmount / 50000)
    ))
    
    const decision = riskScore > 50 ? "approved" : riskScore > 30 ? "review" : "rejected"
    
    await db.update(loans)
      .set({ 
        scoutDecision: decision,
        currentAgent: decision === "approved" ? "guardian" : decision === "review" ? "guardian" : "scout",
        status: decision === "rejected" ? "rejected" : "processing"
      })
      .where(eq(loans.id, loanId))

    await db.insert(agentActivities).values({
      userId,
      loanId,
      agentType: "scout",
      action: `triage_${decision}`,
      details: `Scout analyzed: Credit score ${creditScore}, Land ${landSize}ha. Risk score: ${riskScore.toFixed(1)}. Decision: ${decision.toUpperCase()}`,
      confidenceScore: riskScore.toFixed(2),
    })

    // Send SMS notification
    await db.insert(smsLogs).values({
      userId,
      loanId,
      farmerId: farmer.id,
      direction: "outbound",
      message: decision === "rejected" 
        ? `Habari ${farmer.name}, your loan application has been reviewed. Please contact us to discuss other options.`
        : `Habari ${farmer.name}, your loan application is being processed. We will update you shortly.`,
      agentType: "scout",
    })

  } else if (agentType === "guardian") {
    // Guardian does deeper analysis
    const repaymentHistory = parseFloat(farmer.repaymentRate?.toString() ?? "0")
    const confidenceScore = Math.min(100, (creditScore / 8) + (repaymentHistory * 0.3) + (landSize * 3))
    
    const decision = confidenceScore > 60 ? "approved" : "needs_review"
    
    await db.update(loans)
      .set({ 
        guardianDecision: decision,
        currentAgent: decision === "approved" ? "disbursement" : "hunter",
        status: decision === "approved" ? "approved" : "under_review"
      })
      .where(eq(loans.id, loanId))

    await db.insert(agentActivities).values({
      userId,
      loanId,
      agentType: "guardian",
      action: `analysis_${decision}`,
      details: `Guardian deep analysis complete. Repayment history: ${repaymentHistory}%. Confidence: ${confidenceScore.toFixed(1)}%. ${decision === "approved" ? "Ready for disbursement." : "Flagged for Hunter review."}`,
      confidenceScore: confidenceScore.toFixed(2),
    })

    if (decision === "approved") {
      await db.insert(smsLogs).values({
        userId,
        loanId,
        farmerId: farmer.id,
        direction: "outbound",
        message: `Hongera ${farmer.name}! Your loan of KES ${loan.amount} has been approved. Funds will be disbursed to your M-Pesa shortly.`,
        agentType: "guardian",
      })
    }

  } else if (agentType === "hunter") {
    // Hunter handles recovery with empathy
    await db.update(loans)
      .set({ 
        hunterAssigned: true,
        currentAgent: "hunter"
      })
      .where(eq(loans.id, loanId))

    await db.insert(agentActivities).values({
      userId,
      loanId,
      agentType: "hunter",
      action: "assigned",
      details: `Hunter assigned for empathetic follow-up. Creating personalized repayment plan based on harvest cycles.`,
      confidenceScore: "75",
    })

    await db.insert(smsLogs).values({
      userId,
      loanId,
      farmerId: farmer.id,
      direction: "outbound",
      message: `Habari ${farmer.name}, tunakuelewa changamoto za kilimo. Tunataka kukusaidia. Tafadhali wasiliana nasi kujadili mpango wa malipo unaofaa kwako. - Agent Pride`,
      agentType: "hunter",
    })
  }

  revalidatePath("/dashboard")
}

// Get agent activities
export async function getAgentActivities(loanId?: number) {
  const userId = await getUserId()
  
  if (loanId) {
    return db
      .select()
      .from(agentActivities)
      .where(and(eq(agentActivities.userId, userId), eq(agentActivities.loanId, loanId)))
      .orderBy(desc(agentActivities.createdAt))
  }
  
  return db
    .select()
    .from(agentActivities)
    .where(eq(agentActivities.userId, userId))
    .orderBy(desc(agentActivities.createdAt))
    .limit(50)
}

// Get SMS logs
export async function getSmsLogs(farmerId?: number) {
  const userId = await getUserId()
  
  if (farmerId) {
    return db
      .select()
      .from(smsLogs)
      .where(and(eq(smsLogs.userId, userId), eq(smsLogs.farmerId, farmerId)))
      .orderBy(desc(smsLogs.createdAt))
  }
  
  return db
    .select()
    .from(smsLogs)
    .where(eq(smsLogs.userId, userId))
    .orderBy(desc(smsLogs.createdAt))
    .limit(50)
}

// Dashboard stats
export async function getDashboardStats() {
  const userId = await getUserId()
  
  const [farmerCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(farmers)
    .where(eq(farmers.userId, userId))

  const [loanStats] = await db
    .select({
      total: sql<number>`count(*)`,
      pending: sql<number>`count(*) filter (where status = 'pending')`,
      approved: sql<number>`count(*) filter (where status = 'approved')`,
      rejected: sql<number>`count(*) filter (where status = 'rejected')`,
      totalAmount: sql<string>`coalesce(sum(amount), 0)`,
    })
    .from(loans)
    .where(eq(loans.userId, userId))

  const [activityCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(agentActivities)
    .where(eq(agentActivities.userId, userId))

  return {
    farmers: Number(farmerCount?.count ?? 0),
    loans: {
      total: Number(loanStats?.total ?? 0),
      pending: Number(loanStats?.pending ?? 0),
      approved: Number(loanStats?.approved ?? 0),
      rejected: Number(loanStats?.rejected ?? 0),
      totalAmount: parseFloat(loanStats?.totalAmount ?? "0"),
    },
    activities: Number(activityCount?.count ?? 0),
  }
}

// Seed demo data
export async function seedDemoData() {
  const userId = await getUserId()
  
  // Check if already seeded
  const existingFarmers = await db.select().from(farmers).where(eq(farmers.userId, userId)).limit(1)
  if (existingFarmers.length > 0) return { message: "Demo data already exists" }

  // Create demo farmers
  const demoFarmers = [
    { name: "Amina Wanjiku", phone: "+254712345678", region: "Nyeri", cropType: "Coffee", landSizeHectares: "2.5", creditScore: 720, repaymentRate: "95" },
    { name: "John Ochieng", phone: "+254723456789", region: "Kisumu", cropType: "Rice", landSizeHectares: "4.0", creditScore: 580, repaymentRate: "78" },
    { name: "Grace Muthoni", phone: "+254734567890", region: "Meru", cropType: "Tea", landSizeHectares: "1.8", creditScore: 650, repaymentRate: "88" },
    { name: "Peter Kimani", phone: "+254745678901", region: "Nakuru", cropType: "Maize", landSizeHectares: "6.0", creditScore: 450, repaymentRate: "45" },
    { name: "Fatuma Hassan", phone: "+254756789012", region: "Machakos", cropType: "Beans", landSizeHectares: "3.2", creditScore: 690, repaymentRate: "92" },
  ]

  const createdFarmers = await db.insert(farmers).values(
    demoFarmers.map(f => ({ ...f, userId }))
  ).returning()

  // Create demo loans
  const demoLoans = [
    { farmerId: createdFarmers[0].id, amount: "50000", purpose: "Fertilizer and seeds", termMonths: 6, interestRate: "12" },
    { farmerId: createdFarmers[1].id, amount: "120000", purpose: "Irrigation equipment", termMonths: 12, interestRate: "15" },
    { farmerId: createdFarmers[2].id, amount: "35000", purpose: "Pesticides", termMonths: 4, interestRate: "10" },
    { farmerId: createdFarmers[3].id, amount: "80000", purpose: "Tractor rental", termMonths: 8, interestRate: "18" },
  ]

  for (const loan of demoLoans) {
    await createLoan({ ...loan, farmerId: loan.farmerId })
  }

  revalidatePath("/dashboard")
  return { message: "Demo data created successfully" }
}
