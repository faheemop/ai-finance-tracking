import React, { useState } from "react";
import { db } from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import AddExpense from "../_components/AddExpense"; // Import AddExpense component
import { eq } from "drizzle-orm";
import { Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ExpenseListTable({ expensesList, refreshData, budgetId, user }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
  });

  const deleteExpense = async (expense) => {
    const result = await db
      .delete(Expenses)
      .where(eq(Expenses.id, expense.id))
      .returning();

    if (result) {
      toast("Expense Deleted!");
      refreshData();
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      name: expense.name,
      amount: expense.amount,
    });
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await db
        .update(Expenses)
        .set({
          name: formData.name,
          amount: Number(formData.amount),
        })
        .where(eq(Expenses.id, editingExpense.id))
        .returning();

      if (result) {
        toast("Expense Updated Successfully!");
        setIsEditModalOpen(false);
        refreshData();
      }
    } catch (error) {
      toast("Error updating expense");
      console.error(error);
    }
  };

  return (
    <div className="mt-3">
      <h2 className="font-bold text-lg">Latest Expenses</h2>
      <AddExpense
        budgetId={budgetId}
        user={user}
        refreshData={refreshData} // Include AddExpense component here
      />
      <div className="grid grid-cols-5 rounded-tl-xl rounded-tr-xl bg-slate-200 p-2 mt-3">
        <h2 className="font-bold">Name</h2>
        <h2 className="font-bold">Amount</h2>
        <h2 className="font-bold">Date</h2>
        <h2 className="font-bold">Edit</h2>
        <h2 className="font-bold">Delete</h2>
      </div>
      {expensesList.map((expense) => (
        <div key={expense.id} className="grid grid-cols-5 bg-slate-50 p-2">
          <h2>{expense.name}</h2>
          <h2>{expense.amount}</h2>
          <h2>{expense.createdAt}</h2>
          <div>
            <Pencil
              className="text-blue-500 cursor-pointer w-5 h-5"
              onClick={() => handleEdit(expense)}
            />
          </div>
          <div>
            <Trash
              className="text-red-500 cursor-pointer w-5 h-5"
              onClick={() => deleteExpense(expense)}
            />
          </div>
        </div>
      ))}

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Update Expense
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ExpenseListTable;
