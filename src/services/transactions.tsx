import { Transaction } from "@/models/transaction";
import axiosInstance from "./axiosInstance";

export const categorizeTransactions = async(transactions: Transaction[]): Promise<Transaction[]> => {
  return await axiosInstance()
    .post("/categorize", transactions)
    .then((res) => {
      return res.data.data; 
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
}