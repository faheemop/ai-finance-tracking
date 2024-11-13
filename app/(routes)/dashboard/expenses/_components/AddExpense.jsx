"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { Loader } from "lucide-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { sql, eq, getTableColumns, desc } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";

function AddExpense({ refreshData }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [budgetId, setBudgetId] = useState(""); // Store selected budget ID
  const [budgetList, setBudgetList] = useState([]); // List of budgets for dropdown
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  // Fetch budgets on component mount, similar to BudgetList
  useEffect(() => {
    console.log('user', user)
    user && getBudgetList();
  }, [user]);

  /**
   * Fetch budget list using the existing function logic
   */
  const getBudgetList = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));

    setBudgetList(result); // Set fetched budgets for dropdown
    // console.log('result')

  };

  /**
   * Add new expense with the selected budget ID
   */
  const addNewExpense = async () => {
    setLoading(true);
    const result = await db
      .insert(Expenses)
      .values({
        name: name,
        amount: parseFloat(amount),
        budgetId: budgetId, // Pass selected budget ID
        createdAt: moment().format("DD/MM/yyyy"),
      })
      .returning();

    setAmount("");
    setName("");
    setBudgetId(""); // Reset after adding expense
    if (result) {
      setLoading(false);
      refreshData();
      toast("New Expense Added!");
    }
    setLoading(false);
  };

  return (
    <div className="border p-5 rounded-2xl">
      <h2 className="font-bold text-lg">Add Expense</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Select Budget</h2>
        <select
          className="w-full p-2 border rounded"
          value={budgetId}
          onChange={(e) => setBudgetId(e.target.value)}
        >
          <option value="">Choose a Budget</option>
          {budgetList.map((budget) => (
            <option key={budget.id} value={budget.id}>
              {budget.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Name</h2>
        <Input
          placeholder="e.g. Bedroom Decor"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Amount</h2>
        <Input
          placeholder="e.g. 1000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button
        disabled={!(name && amount && budgetId) || loading}
        onClick={addNewExpense}
        className="mt-3 w-full rounded-full"
      >
        {loading ? <Loader className="animate-spin" /> : "Add New Expense"}
      </Button>
    </div>
  );
}

export default AddExpense;
