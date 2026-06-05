import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  decimal,
  integer,
} from "drizzle-orm/pg-core"

// Better Auth required tables
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Agent Pride application tables
export const farmers = pgTable("farmers", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  region: text("region").notNull(),
  cropType: text("crop_type").notNull(),
  landSizeHectares: decimal("land_size_hectares", { precision: 10, scale: 2 }).notNull(),
  creditScore: integer("credit_score").default(500),
  totalLoans: integer("total_loans").default(0),
  repaymentRate: decimal("repayment_rate", { precision: 5, scale: 2 }).default("0"),
  status: text("status").default("active"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const loans = pgTable("loans", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  farmerId: integer("farmer_id").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  purpose: text("purpose").notNull(),
  termMonths: integer("term_months").notNull(),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  status: text("status").default("pending"),
  currentAgent: text("current_agent").default("scout"),
  scoutDecision: text("scout_decision"),
  guardianDecision: text("guardian_decision"),
  hunterAssigned: boolean("hunter_assigned").default(false),
  disbursedAt: timestamp("disbursed_at"),
  dueDate: timestamp("due_date"),
  paidAmount: decimal("paid_amount", { precision: 12, scale: 2 }).default("0"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const agentActivities = pgTable("agent_activities", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  loanId: integer("loan_id").notNull(),
  agentType: text("agent_type").notNull(),
  action: text("action").notNull(),
  details: text("details"),
  confidenceScore: decimal("confidence_score", { precision: 5, scale: 2 }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const smsLogs = pgTable("sms_logs", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  loanId: integer("loan_id"),
  farmerId: integer("farmer_id").notNull(),
  direction: text("direction").notNull(),
  message: text("message").notNull(),
  agentType: text("agent_type"),
  status: text("status").default("sent"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})
