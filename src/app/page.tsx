"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Download, FileText } from "lucide-react"
import Papa from "papaparse";
import { v4 as uuidv4 } from 'uuid';

import { Transaction } from "@/models/transaction"
import { categorizeTransactions } from "@/services/transactions"
import TransactionTable from "@/components/TransactionTable"
import ToggleTheme from "@/components/shared/ToggleTheme"

const categories = ["Groceries", "Transportation", "Dining", "Shopping", "Income", "Utilities", "Entertainment", "Rent", "Other"]

const banks = ["RBC"]

const fileTypes = ["text/csv"]


export default function BankStatementCategorizer() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<string | null>(null);
  const [transactions, setTransactions] = useState([] as Transaction[]);
  const [categorizedTransactions, setCategorizedTransactions] = useState([] as Transaction[]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if(!uploadedFile){
      alert("Error uploading file.");
      return
    }
    // Check file type matches selected file type
    if(uploadedFile.type !== selectedFileType) {
      alert("Invalid file type")
      return
    }
    setFile(uploadedFile)
    if(uploadedFile.type === "text/csv"){
    // Parse the file and set transactions
      Papa.parse(uploadedFile, {
        header: true, // Skip header row in CSV
        skipEmptyLines: true, // Skips last empty row
        complete: function(results){
          // Expenses should only be from credit account
          const creditRows = (results.data as any[]).filter((row:any) => {
            if(row['Account Type'] == "Chequing" || row['Account Type'] == 'Savings'){
              return false;
            }
            return true;
          });
          console.log(creditRows);

          const creditTransactions = creditRows.map((row:any) => {
            return {
              id: uuidv4(),
              date: row['Transaction Date'],
              description: row['Description 1'] + ' ' + row['Description 2'],
              amount: parseFloat(row['CAD$']),
              category: undefined
            } 
          })

          setTransactions(creditTransactions);
        }
      })
    }
  }

  const handleBankChange = (bank: string) => {
    setSelectedBank(bank)
    setFile(null);
  }

  const handleFileTypeChange = (fileType: string) => {
    setSelectedFileType(fileType)
    setFile(null);
  }

  const handleCategorizeTransactions = async() => {
    console.log(transactions);
    const categorizedTransactions = await categorizeTransactions(transactions);
    setCategorizedTransactions(categorizedTransactions);
    alert("Transactions categorized!")
  }

  const handleCategoryChange = (transactionId: string, newCategory: string) => {
    setTransactions(transactions.map(t => 
      t.id === transactionId ? { ...t, category: newCategory } : t
    ))
  }

  const handleExport = () => {
    const headers = ["Date", "Description", "Amount", "Category"]
    const csvContent = [
      headers.join(","),
      ...categorizedTransactions.map(t => `${t.date},${t.description},${t.amount},${t.category}`)
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

  return (
    <div className="container mx-auto px-4 py-8 bg-background text-foreground">
      <header className="flex justify-center items-center mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Bank Statement Categorizer</h1>
          <p className="text-muted-foreground">
            Upload your bank statement, and we'll categorize your transactions using AI.
          </p>
        </div>
        <ToggleTheme />
      </header>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Select Your Bank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
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
              <Select onValueChange={handleFileTypeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select supported file type" />
                </SelectTrigger>
                <SelectContent>
                  {fileTypes.map((filetype) => (
                    <SelectItem key={filetype} value={filetype}>
                      {filetype}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload Bank Statement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg border-border">
              <Upload className="w-12 h-12  mb-4" />
              <p className="text-sm mb-4 text-center">
                Drag and drop your bank statement file here, or click to select
              </p>
              <Input
                type="file"
                accept=".pdf,.csv,.xlsx"
                onChange={handleFileUpload}
                className="max-w-xs"
                disabled={!selectedBank || !selectedFileType}
              />
              {(!selectedBank || !selectedFileType) && <p className="mt-2 text-sm text-red-600">*Please select bank and file type</p>}
              {file && <p className="mt-2 text-sm">{file.name} uploaded</p>}
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={handleCategorizeTransactions}
              disabled={!file || !selectedBank || !selectedFileType}
            >
              <FileText className="mr-2 h-4 w-4" /> Categorize Transactions
            </Button>
          </CardContent>
        </Card>
      </div>

      <TransactionTable 
        categorizedTransactions={categorizedTransactions}
        handleCategoryChange={handleCategoryChange}
      />

      <div className="mt-8 flex justify-center">
        <Button onClick={handleExport} className="w-full max-w-md">
          <Download className="mr-2 h-4 w-4" /> Export Categorized Transactions
        </Button>
      </div>
    </div>
  )
}