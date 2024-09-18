export interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  category?: string
}

export const defaultTransactions: Transaction[] = [
    { id: '1', date: "2023-06-01", description: "Grocery Store", amount: -50.00, category: "Groceries" },
    { id: '2', date: "2023-06-02", description: "Gas Station", amount: -30.00, category: "Transportation" },
    { id: '3', date: "2023-06-03", description: "Restaurant", amount: -25.00, category: "Dining" },
    { id: '4', date: "2023-06-04", description: "Online Store", amount: -100.00, category: "Shopping" },
    { id: '5', date: "2023-06-05", description: "Salary Deposit", amount: 2000.00, category: "Income" },
  ]