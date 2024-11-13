// utils/getFinancialAdvice.js
import axios from 'axios';

// Function to generate personalized financial advice
const getFinancialAdvice = async (totalBudget, totalIncome, totalSpend) => {
  console.log(totalBudget, totalIncome, totalSpend);
  try {
    const userPrompt = `
      Based on the following financial data:
      - Total Budget: ${totalBudget} USD 
      - Expenses: ${totalSpend} USD 
      - Incomes: ${totalIncome} USD
      Provide detailed financial advice in 2 sentences to help the user manage their finances more effectively.
    `;

    // Send the prompt to the Groq AI API
    const response = await axios.post('https://api.groq.com/v1/generate', {
      prompt: userPrompt,
      model: 'llama3-8b-8192',  // Replace with the correct model name
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`, // Ensure this environment variable is set
        'Content-Type': 'application/json',
      },
    });

    // Process and return the response
    const advice = response.data.choices[0].text;

    console.log(advice);
    return advice;
  } catch (error) {
    console.error("Error fetching financial advice:", error);
    return "Sorry, I couldn't fetch the financial advice at this moment. Please try again later.";
  }
};

export default getFinancialAdvice;
