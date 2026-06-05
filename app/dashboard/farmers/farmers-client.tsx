"use client"

import { useState, useTransition } from "react"
import { createFarmer } from "@/app/actions/agent-pride"
import { useRouter } from "next/navigation"

type Farmer = {
  id: number
  name: string
  phone: string
  region: string
  cropType: string
  landSizeHectares: string | null
  creditScore: number | null
  totalLoans: number | null
  repaymentRate: string | null
  status: string | null
  createdAt: Date
}

export function FarmersClient({ initialFarmers }: { initialFarmers: Farmer[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    region: "",
    cropType: "",
    landSizeHectares: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      await createFarmer(formData)
      setFormData({ name: "", phone: "", region: "", cropType: "", landSizeHectares: "" })
      setShowForm(false)
      router.refresh()
    })
  }

  const getCreditScoreColor = (score: number | null) => {
    if (!score) return "text-muted-foreground"
    if (score >= 700) return "text-emerald-600"
    if (score >= 550) return "text-amber-600"
    return "text-red-600"
  }

  const getCreditScoreBg = (score: number | null) => {
    if (!score) return "bg-muted"
    if (score >= 700) return "bg-emerald-100"
    if (score >= 550) return "bg-amber-100"
    return "bg-red-100"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Farmers Registry</h1>
          <p className="text-muted-foreground">Manage registered smallholder farmers</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          {showForm ? "Cancel" : "+ Register Farmer"}
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Register New Farmer</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter farmer name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="+254..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Region</label>
              <select
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                required
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select region</option>
                <option value="Nyeri">Nyeri</option>
                <option value="Kisumu">Kisumu</option>
                <option value="Meru">Meru</option>
                <option value="Nakuru">Nakuru</option>
                <option value="Machakos">Machakos</option>
                <option value="Kakamega">Kakamega</option>
                <option value="Eldoret">Eldoret</option>
                <option value="Mombasa">Mombasa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Primary Crop</label>
              <select
                value={formData.cropType}
                onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                required
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select crop</option>
                <option value="Coffee">Coffee</option>
                <option value="Tea">Tea</option>
                <option value="Maize">Maize</option>
                <option value="Rice">Rice</option>
                <option value="Beans">Beans</option>
                <option value="Wheat">Wheat</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Land Size (Hectares)</label>
              <input
                type="number"
                step="0.1"
                value={formData.landSizeHectares}
                onChange={(e) => setFormData({ ...formData, landSizeHectares: e.target.value })}
                required
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., 2.5"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isPending}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
              >
                {isPending ? "Registering..." : "Register Farmer"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Farmer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Region</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Crop</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Land Size</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Credit Score</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Repayment</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {initialFarmers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-12 h-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p>No farmers registered yet</p>
                      <p className="text-sm">Click &quot;Register Farmer&quot; to add your first farmer</p>
                    </div>
                  </td>
                </tr>
              ) : (
                initialFarmers.map((farmer) => (
                  <tr key={farmer.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-semibold">
                            {farmer.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <span className="font-medium text-foreground">{farmer.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{farmer.phone}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{farmer.region}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-secondary rounded-md text-sm text-secondary-foreground">
                        {farmer.cropType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{farmer.landSizeHectares} ha</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-md text-sm font-semibold ${getCreditScoreBg(farmer.creditScore)} ${getCreditScoreColor(farmer.creditScore)}`}>
                        {farmer.creditScore ?? "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {farmer.repaymentRate ? `${farmer.repaymentRate}%` : "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        farmer.status === "active" 
                          ? "bg-emerald-100 text-emerald-700" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {farmer.status ?? "Active"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
