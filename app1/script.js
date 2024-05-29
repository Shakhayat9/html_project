document.addEventListener("DOMContentLoaded", () => {
    const transactionForm = document.getElementById("transaction-form");
    const transactionList = document.getElementById("transaction-list");
    const totalIncomeEl = document.getElementById("total-income");
    const totalExpensesEl = document.getElementById("total-expenses");
    const balanceEl = document.getElementById("balance");
    const printBtn = document.getElementById("print-btn");

    let transactions = [];
    let editTransactionId = null;

    transactionForm.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const type = document.getElementById("type").value;
        const description = document.getElementById("description").value;
        const amount = parseFloat(document.getElementById("amount").value);

        if (description && amount && !isNaN(amount)) {
            if (editTransactionId) {
                transactions = transactions.map(transaction => 
                    transaction.id === editTransactionId ? { id: editTransactionId, type, description, amount } : transaction
                );
                editTransactionId = null;
            } else {
                const transaction = {
                    id: generateID(),
                    type,
                    description,
                    amount
                };
                transactions.push(transaction);
            }
            init();
            transactionForm.reset();
        }
    });

    printBtn.addEventListener("click", () => {
        const printWindow = window.open("", "", "width=800,height=600");
        printWindow.document.write(`
            <html>
            <head>
                <title>Budget Report</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { text-align: center; }
                    .summary, .transactions { margin-bottom: 20px; }
                    .transactions table { width: 100%; border-collapse: collapse; }
                    .transactions th, .transactions td { padding: 10px; border: 1px solid #ddd; text-align: left; }
                    .transactions th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <h1>Budget Report</h1>
                <div class="summary">
                    <h2>Summary</h2>
                    <p>Total Income: ৳${totalIncomeEl.textContent}</p>
                    <p>Total Expenses: ৳${totalExpensesEl.textContent}</p>
                    <p>Balance: ৳${balanceEl.textContent}</p>
                </div>
                <div class="transactions">
                    <h2>Transactions</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Type</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${transactions.map(transaction => `
                                <tr class="${transaction.type}">
                                    <td>${transaction.description}</td>
                                    <td>${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</td>
                                    <td>${transaction.type === "income" ? "+" : "-"}৳${transaction.amount.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    });

    function generateID() {
        return Math.floor(Math.random() * 1000000);
    }

    function addTransactionDOM(transaction) {
        const listItem = document.createElement("li");
        listItem.classList.add(transaction.type === "income" ? "income" : "expense");

        listItem.innerHTML = `
            ${transaction.description} <span>${transaction.type === "income" ? "+" : "-"}৳${transaction.amount.toFixed(2)}</span>
            <button class="edit-btn" onclick="editTransaction(${transaction.id})">Edit</button>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        `;

        transactionList.appendChild(listItem);
    }

    function updateSummary() {
        const totalIncome = transactions
            .filter(transaction => transaction.type === "income")
            .reduce((acc, transaction) => acc + transaction.amount, 0);
        
        const totalExpenses = transactions
            .filter(transaction => transaction.type === "expense")
            .reduce((acc, transaction) => acc + transaction.amount, 0);

        const balance = totalIncome - totalExpenses;

        totalIncomeEl.textContent = totalIncome.toFixed(2);
        totalExpensesEl.textContent = totalExpenses.toFixed(2);
        balanceEl.textContent = balance.toFixed(2);
    }

    window.removeTransaction = (id) => {
        transactions = transactions.filter(transaction => transaction.id !== id);
        init();
    };

    window.editTransaction = (id) => {
        const transaction = transactions.find(transaction => transaction.id === id);
        document.getElementById("type").value = transaction.type;
        document.getElementById("description").value = transaction.description;
        document.getElementById("amount").value = transaction.amount;
        editTransactionId = id;
    };

    function init() {
        transactionList.innerHTML = "";
        transactions.forEach(addTransactionDOM);
        updateSummary();
    }

    init();
});
