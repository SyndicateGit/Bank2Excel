'use client'
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Input } from './ui/input'
import { Transaction } from '@/models/transaction'

interface TransactionTableProps{
  categorizedTransactions: Transaction[]
  handleCategoryChange: (id: string, category: string) => void
}
const TransactionTable = ({categorizedTransactions, handleCategoryChange}:TransactionTableProps) => {
  return (
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
              {categorizedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    {/** TODO: Change to text input and update category */}
                    <Input
                      type="text"
                      value={transaction.category}
                      onChange={(e) => handleCategoryChange(transaction.id, e.target.value)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
  )
}

export default TransactionTable
