 // State management with localStorage
        let appData = {
            budget: 0,
            days: 0,
            dailyLimit: 0,
            transactions: [],
            startDate: null
        };

        let pendingTransaction = null;
        let currentTab = 'all';

        // Save to localStorage
        function saveToLocalStorage() {
            localStorage.setItem('expenseManagerData', JSON.stringify(appData));
        }

        // Load from localStorage
        function loadFromLocalStorage() {
            const saved = localStorage.getItem('expenseManagerData');
            if (saved) {
                appData = JSON.parse(saved);
                return true;
            }
            return false;
        }

        // Initialize app
        function init() {
            document.getElementById('setupForm').addEventListener('submit', handleSetup);
            
            // Set today's date as default
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('dailyDateFilter').value = today;
            
            // Set current month as default
            const currentMonth = new Date().toISOString().slice(0, 7);
            document.getElementById('monthlyFilter').value = currentMonth;
            
            // Populate year dropdown
            populateYearDropdown();
            
            // Load saved data if exists
            if (loadFromLocalStorage()) {
                document.getElementById('setupSection').classList.add('hidden');
                document.getElementById('appSection').classList.remove('hidden');
                updateUI();
            }
        }

        // Populate year dropdown
        function populateYearDropdown() {
            const yearSelect = document.getElementById('yearlyFilter');
            const currentYear = new Date().getFullYear();
            for (let i = currentYear; i >= currentYear - 10; i--) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                yearSelect.appendChild(option);
            }
        }

        // Handle budget setup
        function handleSetup(e) {
            e.preventDefault();
            
            appData.budget = parseFloat(document.getElementById('budgetAmount').value);
            appData.days = parseInt(document.getElementById('daysCount').value);
            appData.dailyLimit = parseFloat(document.getElementById('dailyLimit').value);
            appData.startDate = new Date().toISOString();
            appData.transactions = [{
                id: Date.now(),
                type: 'income',
                amount: appData.budget,
                note: 'Initial Budget',
                date: new Date().toISOString()
            }];

            saveToLocalStorage();

            document.getElementById('setupSection').classList.add('hidden');
            document.getElementById('appSection').classList.remove('hidden');
            
            updateUI();
        }

        // Open modals
        function openAddMoneyModal() {
            document.getElementById('addMoneyModal').classList.add('active');
        }

        function openAddExpenseModal() {
            document.getElementById('addExpenseModal').classList.add('active');
        }

        // Close modal
        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
            pendingTransaction = null;
        }

        // Add money
        function addMoney() {
            const amount = parseFloat(document.getElementById('moneyAmount').value);
            const note = document.getElementById('moneyNote').value.trim();

            if (!amount || amount <= 0 || !note) {
                alert('Please enter valid amount and note!');
                return;
            }

            const transaction = {
                id: Date.now(),
                type: 'income',
                amount: amount,
                note: note,
                date: new Date().toISOString()
            };

            appData.transactions.unshift(transaction);
            saveToLocalStorage();
            
            document.getElementById('moneyAmount').value = '';
            document.getElementById('moneyNote').value = '';
            
            closeModal('addMoneyModal');
            updateUI();
        }

       // Add expense logic
function addExpense() {
    const amountInput = document.getElementById('expenseAmount');
    const noteInput = document.getElementById('expenseNote');
    const amount = parseFloat(amountInput.value);
    const note = noteInput.value.trim();

    if (!amount || amount <= 0 || !note) {
        alert('Please enter valid amount and note!');
        return;
    }

    const todayExpenses = getTodayExpenses();
    
    // Check if adding this will cross the daily limit
    if (todayExpenses + amount > appData.dailyLimit) {
        // STORE data in the global pendingTransaction variable
        pendingTransaction = { amount, note }; 
        document.getElementById('limitAmount').textContent = `$${appData.dailyLimit.toFixed(2)}`;
        
        // Hide the input modal and show the warning modal
        document.getElementById('alertModal').classList.add('active');
        return;
    }

    // If under limit, add it directly
    confirmAddExpense({ amount, note });
}

// The final confirmation logic (called by both the main button and "Add Anyway")
function confirmAddExpense(transactionData = null) {
    // If no data is passed (from 'Add Anyway'), use the stored pendingTransaction
    const data = transactionData || pendingTransaction;
    
    if (!data) {
        console.error("No transaction data found!");
        return;
    }

    const transaction = {
        id: Date.now(),
        type: 'expense',
        amount: data.amount,
        note: data.note,
        date: new Date().toISOString()
    };
        // Update state
    appData.transactions.unshift(transaction);
    saveToLocalStorage();
    
    // Reset UI fields
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseNote').value = '';
    
    // Cleanup: Close all modals and clear the pending state
    document.getElementById('addExpenseModal').classList.remove('active');
    document.getElementById('alertModal').classList.remove('active');
    pendingTransaction = null;
    
    updateUI();
}

        // Get today's expenses
        function getTodayExpenses() {
            const today = new Date().toDateString();
            return appData.transactions
                .filter(t => t.type === 'expense' && new Date(t.date).toDateString() === today)
                .reduce((sum, t) => sum + t.amount, 0);
        }

        // Calculate balance
        function calculateBalance() {
            return appData.transactions.reduce((balance, t) => {
                return t.type === 'income' ? balance + t.amount : balance - t.amount;
            }, 0);
        }

        // Calculate total income
        function calculateTotalIncome() {
            return appData.transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
        }

        // Calculate total expenses
        function calculateTotalExpenses() {
            return appData.transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
        }

        // Update UI
        function updateUI() {
            const balance = calculateBalance();
            const totalIncome = calculateTotalIncome();
            const totalExpenses = calculateTotalExpenses();
            const todayExpenses = getTodayExpenses();

            document.getElementById('currentBalance').textContent = `$${balance.toFixed(2)}`;
            document.getElementById('totalIncome').textContent = `$${totalIncome.toFixed(2)}`;
            document.getElementById('totalExpenses').textContent = `$${totalExpenses.toFixed(2)}`;
            document.getElementById('todayExpenses').textContent = `$${todayExpenses.toFixed(2)}`;

            // Update daily progress bar
            const dailyPercentage = (todayExpenses / appData.dailyLimit) * 100;
            const progressBar = document.getElementById('dailyProgressBar');
            progressBar.style.width = `${Math.min(100, dailyPercentage)}%`;
            
            if (dailyPercentage >= 100) {
                progressBar.classList.add('warning');
            } else {
                progressBar.classList.remove('warning');
            }

            // Update current tab
            switch(currentTab) {
                case 'all':
                    updateAllTransactions();
                    break;
                case 'daily':
                    filterDaily();
                    break;
                case 'monthly':
                    filterMonthly();
                    break;
                case 'yearly':
                    filterYearly();
                    break;
            }
        }

        // Switch tabs
        function switchTab(tab) {
            currentTab = tab;
            
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
            
            event.target.classList.add('active');
            document.getElementById(`${tab}Tab`).classList.remove('hidden');
            
            updateUI();
        }

        // Update all transactions
        function updateAllTransactions() {
            const list = document.getElementById('allTransactionsList');
            
            if (appData.transactions.length === 0) {
                list.innerHTML = '<p style="text-align: center; color: #888;">No transactions yet</p>';
                return;
            }

            list.innerHTML = appData.transactions.map(t => createTransactionHTML(t)).join('');
        }

        // Filter daily transactions
        function filterDaily() {
            const selectedDate = document.getElementById('dailyDateFilter').value;
            const date = new Date(selectedDate);
            const dateStr = date.toDateString();
            
            const filtered = appData.transactions.filter(t => 
                new Date(t.date).toDateString() === dateStr
            );
            
            const income = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const expenses = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
            const net = income - expenses;
            
            document.getElementById('dailySummary').innerHTML = `
                <div class="summary-row">
                    <span>Income:</span>
                    <span style="color: #28a745;">+$${income.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Expenses:</span>
                    <span style="color: #dc3545;">-$${expenses.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Net:</span>
                    <span style="color: ${net >= 0 ? '#28a745' : '#dc3545'};">${net >= 0 ? '+' : ''}$${net.toFixed(2)}</span>
                </div>
            `;
            
            const list = document.getElementById('dailyTransactionsList');
            if (filtered.length === 0) {
                list.innerHTML = '<p style="text-align: center; color: #888;">No transactions for this day</p>';
            } else {
                list.innerHTML = filtered.map(t => createTransactionHTML(t)).join('');
            }
        }

        // Filter monthly transactions
     // ... (existing code)

        // Filter monthly transactions
        function filterMonthly() {
            const selectedMonth = document.getElementById('monthlyFilter').value; // YYYY-MM
            if (!selectedMonth) return;

            const filtered = appData.transactions.filter(t => 
                t.date.startsWith(selectedMonth)
            );
            
            renderSummaryAndList(filtered, 'monthlySummary', 'monthlyTransactionsList');
        }

        // Filter yearly transactions
        function filterYearly() {
            const selectedYear = document.getElementById('yearlyFilter').value;
            
            const filtered = appData.transactions.filter(t => 
                new Date(t.date).getFullYear().toString() === selectedYear
            );

            // Monthly breakdown for the year
            const monthlyBreakdown = Array(12).fill(0).map((_, i) => ({
                month: new Date(2000, i).toLocaleString('default', { month: 'long' }),
                amount: 0
            }));

            filtered.forEach(t => {
                if (t.type === 'expense') {
                    const m = new Date(t.date).getMonth();
                    monthlyBreakdown[m].amount += t.amount;
                }
            });

            const yearlySummaryList = document.getElementById('yearlyMonthlySummary');
            yearlySummaryList.innerHTML = monthlyBreakdown
                .filter(m => m.amount > 0)
                .map(m => `
                    <div class="month-card">
                        <div class="month-name">${m.month}</div>
                        <div class="month-amount">$${m.amount.toFixed(2)}</div>
                        <div class="stat-label">Total Spent</div>
                    </div>
                `).join('');

            renderSummaryAndList(filtered, 'yearlySummary', 'yearlyTransactionsList');
        }

        // Helper to render summaries
        function renderSummaryAndList(filtered, summaryId, listId) {
            const income = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const expenses = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
            const net = income - expenses;

            document.getElementById(summaryId).innerHTML = `
                <div class="summary-row"><span>Total Income:</span><span style="color: #28a745;">+$${income.toFixed(2)}</span></div>
                <div class="summary-row"><span>Total Expenses:</span><span style="color: #dc3545;">-$${expenses.toFixed(2)}</span></div>
                <div class="summary-row"><span>Net Cash Flow:</span><span style="color: ${net >= 0 ? '#28a745' : '#dc3545'};">${net >= 0 ? '+' : ''}$${net.toFixed(2)}</span></div>
            `;

            const list = document.getElementById(listId);
            list.innerHTML = filtered.length ? filtered.map(t => createTransactionHTML(t)).join('') : '<p style="text-align: center; color: #888; padding: 20px;">No transactions found</p>';
        }

        // Create HTML for a single transaction row
        function createTransactionHTML(t) {
            const date = new Date(t.date).toLocaleDateString('en-US', { 
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
            });
            return `
                <div class="expense-item ${t.type}">
                    <div class="expense-info">
                        <div class="expense-note">${t.note}</div>
                        <div class="expense-date">${date}</div>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <span class="expense-amount ${t.type === 'income' ? 'positive' : 'negative'}">
                            ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
                        </span>
                        <button class="delete-btn" onclick="deleteTransaction(${t.id})">✕</button>
                    </div>
                </div>
            `;
        }

        // Delete a transaction
        function deleteTransaction(id) {
            if (confirm('Are you sure you want to delete this transaction?')) {
                appData.transactions = appData.transactions.filter(t => t.id !== id);
                saveToLocalStorage();
                updateUI();
            }
        }

        // Reset App
        document.getElementById('resetBtn').addEventListener('click', () => {
            if (confirm('DANGER: This will delete ALL data. Proceed?')) {
                localStorage.removeItem('expenseManagerData');
                location.reload();
            }
        });

        // Run Init on Load
        window.onload = init;