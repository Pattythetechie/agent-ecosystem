"use client"

import { useState, useTransition } from "react"
import { createFarmer, createLoan, seedDemoData } from "@/app/actions/agent-pride"
import { Button } from "@/components/ui/button"

interface Farmer {
  id: number
  name: string
  phone: string
  region: string
  cropType: string
  landSizeHectares: string | null
  creditScore: number | null
}

interface LoanManagementProps {
  farmers: Farmer[]
}

export function LoanManagement({ farmers }: LoanManagementProps) {
  const [isPending, startTransition] = useTransition()
  const [showFarmerForm, setShowFarmerForm] = useState(false)
  const [showLoanForm, setShowLoanForm] = useState(false)

  // Farmer form state
  const [farmerName, setFarmerName] = useState("")
  const [farmerPhone, setFarmerPhone] = useState("")
  const [farmerRegion, setFarmerRegion] = useState("")
  const [farmerCrop, setFarmerCrop] = useState("")
  const [farmerLand, setFarmerLand] = useState("")

  // Loan form state
  const [selectedFarmer, setSelectedFarmer] = useState<number | null>(null)
  const [loanAmount, setLoanAmount] = useState("")
  const [loanPurpose, setLoanPurpose] = useState("")
  const [loanTerm, setLoanTerm] = useState(6)

  const handleSeedDemo = () => {
    startTransition(async () => {
      await seedDemoData()
    })
  }

  const handleCreateFarmer = () => {
    if (!farmerName || !farmerPhone || !farmerRegion || !farmerCrop || !farmerLand) return
    startTransition(async () => {
      await createFarmer({
        name: farmerName,
        phone: farmerPhone,
        region: farmerRegion,
        cropType: farmerCrop,
        landSizeHectares: farmerLand,
      })
      setFarmerName("")
      setFarmerPhone("")
      setFarmerRegion("")
      setFarmerCrop("")
      setFarmerLand("")
      setShowFarmerForm(false)
    })
  }

  const handleCreateLoan = () => {
    if (!selectedFarmer || !loanAmount || !loanPurpose) return
    startTransition(async () => {
      await createLoan({
        farmerId: selectedFarmer,
        amount: loanAmount,
        purpose: loanPurpose,
        termMonths: loanTerm,
        interestRate: "12",
      })
      setSelectedFarmer(null)
      setLoanAmount("")
      setLoanPurpose("")
      setLoanTerm(6)
      setShowLoanForm(false)
    })
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Loan Management</h2>
        <div className="flex gap-2">
          {farmers.length === 0 && (
            <Button
              onClick={handleSeedDemo}
              disabled={isPending}
              variant="outline"
              size="sm"
            >
              Load Demo Data
            </Button>
          )}
          <Button
            onClick={() => setShowFarmerForm(!showFarmerForm)}
            variant="outline"
            size="sm"
          >
            + Add Farmer
          </Button>
          <Button
            onClick={() => setShowLoanForm(!showLoanForm)}
            disabled={farmers.length === 0}
            size="sm"
          >
            + New Loan
          </Button>
        </div>
      </div>

      {/* Add Farmer Form */}
      {showFarmerForm && (
        <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border">
          <h3 className="font-medium text-foreground mb-4">Register New Farmer</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Full Name"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
            />
            <input
              type="text"
              placeholder="Phone (+254...)"
              value={farmerPhone}
              onChange={(e) => setFarmerPhone(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
            />
            <input
              type="text"
              placeholder="Region (e.g., Nyeri)"
              value={farmerRegion}
              onChange={(e) => setFarmerRegion(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
            />
            <input
              type="text"
              placeholder="Crop Type"
              value={farmerCrop}
              onChange={(e) => setFarmerCrop(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
            />
            <input
              type="number"
              placeholder="Land Size (hectares)"
              value={farmerLand}
              onChange={(e) => setFarmerLand(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
            />
            <Button onClick={handleCreateFarmer} disabled={isPending} size="sm">
              {isPending ? "Saving..." : "Save Farmer"}
            </Button>
          </div>
        </div>
      )}

      {/* New Loan Form */}
      {showLoanForm && (
        <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border">
          <h3 className="font-medium text-foreground mb-4">New Loan Application</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <select
              value={selectedFarmer ?? ""}
              onChange={(e) => setSelectedFarmer(Number(e.target.value))}
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
            >
              <option value="">Select Farmer</option>
              {farmers.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} - {f.region}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount (KES)"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
            />
            <input
              type="text"
              placeholder="Purpose"
              value={loanPurpose}
              onChange={(e) => setLoanPurpose(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
            />
            <select
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
            >
              <option value={3}>3 months</option>
              <option value={6}>6 months</option>
              <option value={9}>9 months</option>
              <option value={12}>12 months</option>
            </select>
          </div>
          <div className="mt-3">
            <Button onClick={handleCreateLoan} disabled={isPending || !selectedFarmer}>
              {isPending ? "Submitting..." : "Submit to Scout Agent"}
            </Button>
          </div>
        </div>
      )}

      {/* Farmers Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-muted-foreground font-medium">Farmer</th>
              <th className="text-left py-3 px-2 text-muted-foreground font-medium">Region</th>
              <th className="text-left py-3 px-2 text-muted-foreground font-medium">Crop</th>
              <th className="text-left py-3 px-2 text-muted-foreground font-medium">Land</th>
              <th className="text-left py-3 px-2 text-muted-foreground font-medium">Credit Score</th>
            </tr>
          </thead>
          <tbody>
            {farmers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  No farmers registered yet. Click &quot;Load Demo Data&quot; to get started.
                </td>
              </tr>
            ) : (
              farmers.map((farmer) => (
                <tr key={farmer.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 px-2">
                    <div>
                      <p className="font-medium text-foreground">{farmer.name}</p>
                      <p className="text-xs text-muted-foreground">{farmer.phone}</p>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-foreground">{farmer.region}</td>
                  <td className="py-3 px-2 text-foreground">{farmer.cropType}</td>
                  <td className="py-3 px-2 text-foreground">{farmer.landSizeHectares}ha</td>
                  <td className="py-3 px-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        (farmer.creditScore ?? 0) >= 650
                          ? "bg-emerald-500/20 text-emerald-600"
                          : (farmer.creditScore ?? 0) >= 500
                          ? "bg-amber-500/20 text-amber-600"
                          : "bg-red-500/20 text-red-600"
                      }`}
                    >
                      {farmer.creditScore}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
