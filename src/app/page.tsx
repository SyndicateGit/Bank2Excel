"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Download, FileText } from "lucide-react"

// Simulated transaction data
const initialTransactions = [
  { id: 1, date: "2023-06-01", description: "Grocery Store", amount: -50.00, category: "Groceries" },
  { id: 2, date: "2023-06-02", description: "Gas Station", amount: -30.00, category: "Transportation" },
  { id: 3, date: "2023-06-03", description: "Restaurant", amount: -25.00, category: "Dining" },
  { id: 4, date: "2023-06-04", description: "Online Store", amount: -100.00, category: "Shopping" },
  { id: 5, date: "2023-06-05", description: "Salary Deposit", amount: 2000.00, category: "Income" },
]

const categories = ["Groceries", "Transportation", "Dining", "Shopping", "Income", "Utilities", "Entertainment", "Other"]

export default function BankStatementConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [transactions, setTransactions] = useState(initialTransactions)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      // In a real application, you would process the file here
    }
  }

  const handleDownload = () => {
    // In a real application, you would generate and download the Excel file here
    alert("Excel file download simulated!")
  }

  const handleCategoryChange = (transactionId: number, newCategory: string) => {
    setTransactions(transactions.map(t => 
      t.id === transactionId ? { ...t, category: newCategory } : t
    ))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Bank Statement to Excel Converter</h1>
        <p className="text-muted-foreground">
          Upload your bank statement, and we'll convert it to an Excel spreadsheet with AI-categorized transactions.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
          <Upload className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Upload Bank Statement</h2>
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

        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
          <Download className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Download Excel Sheet</h2>
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Your converted Excel sheet will be available here
          </p>
          <Button onClick={handleDownload} disabled={!file}>
            <FileText className="mr-2 h-4 w-4" /> Download Excel
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
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
    </div>
  )
}