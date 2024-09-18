"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Download, FileText, Moon, Sun } from "lucide-react"

const initialTransactions = [
  { id: 1, date: "2023-06-01", description: "Grocery Store", amount: -50.00, category: "Groceries" },
  { id: 2, date: "2023-06-02", description: "Gas Station", amount: -30.00, category: "Transportation" },
  { id: 3, date: "2023-06-03", description: "Restaurant", amount: -25.00, category: "Dining" },
  { id: 4, date: "2023-06-04", description: "Online Store", amount: -100.00, category: "Shopping" },
  { id: 5, date: "2023-06-05", description: "Salary Deposit", amount: 2000.00, category: "Income" },
]

const categories = ["Groceries", "Transportation", "Dining", "Shopping", "Income", "Utilities", "Entertainment", "Other"]

const banks = ["RBC"]

export default function BankStatementCategorizer() {
  const [file, setFile] = useState<File | null>(null)
  const [transactions, setTransactions] = useState(initialTransactions)
  const [selectedBank, setSelectedBank] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      // In a real application, you would process the file here
    }
  }

  const handleBankChange = (bank: string) => {
    setSelectedBank(bank)
    // In a real application, you might adjust file handling or processing based on the selected bank
  }

  const handleCategorize = () => {
    // In a real application, you would process the file and categorize transactions here
    alert("Transactions categorized!")
  }

  const handleCategoryChange = (transactionId: number, newCategory: string) => {
    setTransactions(transactions.map(t => 
      t.id === transactionId ? { ...t, category: newCategory } : t
    ))
  }

  const handleExport = () => {
    // In a real application, you would generate an Excel file here
    // For this example, we'll just create a CSV string
    const headers = ["Date", "Description", "Amount", "Category"]
    const csvContent = [
      headers.join(","),
      ...transactions.map(t => `${t.date},${t.description},${t.amount},${t.category}`)
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "categorized_transactions.csv")
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-background text-foreground">
      <header className="flex justify-center items-center mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Bank Statement Categorizer</h1>
          <p className="text-muted-foreground">
            Upload your bank statement, and we'll categorize your transactions using AI.
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={toggleTheme} className="absolute top-6 right-6">
          {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
      </header>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Select Your Bank</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={handleBankChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose your bank" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank} value={bank}>
                    {bank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload Bank Statement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg border-border">
              <Upload className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4 text-center">
                Drag and drop your bank statement file here, or click to select
              </p>
              <Input
                type="file"
                accept=".pdf,.csv,.xlsx"
                onChange={handleFileUpload}
                className="max-w-xs"
              />
              {file && <p className="mt-2 text-sm">{file.name} uploaded</p>}
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={handleCategorize}
              disabled={!file || !selectedBank}
            >
              <FileText className="mr-2 h-4 w-4" /> Categorize Transactions
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Categorized Transactions</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Select
                      value={transaction.category}
                      onValueChange={(value) => handleCategoryChange(transaction.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button onClick={handleExport} className="w-full max-w-md">
          <Download className="mr-2 h-4 w-4" /> Export Categorized Transactions
        </Button>
      </div>
    </div>
  )
}