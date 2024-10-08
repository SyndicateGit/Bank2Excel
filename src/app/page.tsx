"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Download, FileText, Trash } from "lucide-react"
import Papa from "papaparse";
import { v4 as uuidv4 } from 'uuid';

import { Transaction } from "@/models/transaction"
import { categorizeTransactions } from "@/services/transactions"
import TransactionTable from "@/components/Home/TransactionTable"
import ToggleTheme from "@/components/shared/ToggleTheme"
import SelectBankOptions from "@/components/Home/SelectBankOptions"
import React from "react"

const categories = ["Groceries", "Transportation", "Dining", "Shopping", "Income", "Utilities", "Entertainment", "Rent", "Other"]

const banks = ["RBC"]

const fileTypes = ["text/csv"]


export default function BankStatementCategorizer() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<string | null>(null);
  const [transactions, setTransactions] = useState([] as Transaction[]);
  const [categorizedTransactions, setCategorizedTransactions] = useState([] as Transaction[]);
  const [fetching, setFetching] = useState(false);
  const fileInputref = React.createRef<HTMLInputElement>();
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if(!uploadedFile){
      handleClearFile();
      alert("Error uploading file.");
      return
    }
    // Check file type matches selected file type
    if(uploadedFile.type !== selectedFileType) {
      handleClearFile();
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
    handleClearFile();
  }

  const handleFileTypeChange = (fileType: string) => {
    setSelectedFileType(fileType)
    handleClearFile();
  }

  const handleCategorizeTransactions = async() => {
    setFetching(true);
    const categorizedTransactions = await categorizeTransactions(transactions);
    setCategorizedTransactions(categorizedTransactions);
    setFetching(false);
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

  const handleClearFile = () => {
    setFile(null);
    if(fileInputref.current){
      fileInputref.current.value = "";
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
        <SelectBankOptions 
          banks={banks}
          fileTypes={fileTypes}
          handleBankChange={handleBankChange}
          handleFileTypeChange={handleFileTypeChange}
        />

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
              <div className="flex gap-6 self-stretch justify-center items-center">
                <Input
                  ref={fileInputref}
                  type="file"
                  accept=".pdf,.csv,.xlsx"
                  onChange={handleFileUpload}
                  className="max-w-xs"
                  disabled={!selectedBank || !selectedFileType}
                />
                <Trash className="w-6 h-6 cursor-pointer" onClick={handleClearFile} />
              </div>
              
              {(!selectedBank || !selectedFileType) && <p className="mt-2 text-sm text-red-600">*Please select bank and file type</p>}
              {file && <p className="mt-2 text-sm">{file.name} uploaded</p>}
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={handleCategorizeTransactions}
              disabled={!file || !selectedBank || !selectedFileType || fetching}
            >
              <FileText className="mr-2 h-4 w-4" />{fetching? "...loading" : "Categorize Transactions"}
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