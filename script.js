// ============================================
// EXPENSE TRACKER
// VEDA TECHNOLOGY
// ============================================


// ============================================
// VARIABLES
// ============================================

// Get saved expenses from LocalStorage
let expenses =
    JSON.parse(localStorage.getItem("expenses")) || [];


// ============================================
// HTML ELEMENTS
// ============================================

const expenseForm =
    document.getElementById("expenseForm");

const expenseTitle =
    document.getElementById("expenseTitle");

const expenseAmount =
    document.getElementById("expenseAmount");

const expenseCategory =
    document.getElementById("expenseCategory");

const expenseDate =
    document.getElementById("expenseDate");

const editId =
    document.getElementById("editId");

const expenseList =
    document.getElementById("expenseList");

const totalExpense =
    document.getElementById("totalExpense");

const totalEntries =
    document.getElementById("totalEntries");

const filterCategory =
    document.getElementById("filterCategory");

const filterDate =
    document.getElementById("filterDate");

const sortExpenses =
    document.getElementById("sortExpenses");

const clearFilters =
    document.getElementById("clearFilters");

const submitButton =
    document.getElementById("submitButton");

const cancelEdit =
    document.getElementById("cancelEdit");

const resultText =
    document.getElementById("resultText");


// ============================================
// SET TODAY'S DATE
// ============================================

if (!expenseDate.value) {

    const today =
        new Date().toISOString().split("T")[0];

    expenseDate.value = today;
}


// ============================================
// SAVE TO LOCAL STORAGE
// ============================================

function saveExpenses() {

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

}


// ============================================
// ADD / EDIT EXPENSE
// ============================================

expenseForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        // Get values
        const title =
            expenseTitle.value.trim();

        const amount =
            Number(expenseAmount.value);

        const category =
            expenseCategory.value;

        const date =
            expenseDate.value;


        // Validation
        if (
            !title ||
            !amount ||
            amount <= 0 ||
            !category ||
            !date
        ) {

            alert(
                "Please enter valid details."
            );

            return;
        }


        // Check edit mode
        if (editId.value) {

            // Find expense
            const index =
                expenses.findIndex(
                    expense =>
                        expense.id ===
                        Number(editId.value)
                );


            if (index !== -1) {

                expenses[index] = {

                    id:
                        Number(editId.value),

                    title: title,

                    amount: amount,

                    category: category,

                    date: date

                };

            }


            // Reset edit mode
            cancelEditMode();

        }

        else {

            // Create new expense
            const expense = {

                id: Date.now(),

                title: title,

                amount: amount,

                category: category,

                date: date

            };


            // Add to array
            expenses.push(expense);

        }


        // Save
        saveExpenses();


        // Refresh display
        displayExpenses();


        // Update summary
        updateSummary();


        // Clear form
        expenseForm.reset();


        // Set today's date again
        setTodayDate();

    }
);


// ============================================
// DISPLAY EXPENSES
// ============================================

function displayExpenses() {

    // Get filtered expenses
    let filteredExpenses =
        getFilteredExpenses();


    // Sort expenses
    filteredExpenses =
        sortExpenseData(filteredExpenses);


    // Clear list
    expenseList.innerHTML = "";


    // Result count
    resultText.textContent =
        `${filteredExpenses.length} expense${
            filteredExpenses.length !== 1
                ? "s"
                : ""
        } found`;


    // Empty state
    if (filteredExpenses.length === 0) {

        expenseList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📝
                </div>

                <h3>
                    No expenses found
                </h3>

                <p>
                    Try changing your filters
                    or add a new expense.
                </p>

            </div>

        `;

        return;
    }


    // Display expenses
    filteredExpenses.forEach(
        function (expense) {

            const expenseElement =
                document.createElement("div");


            expenseElement.className =
                "expense-item";


            expenseElement.innerHTML = `

                <div class="expense-header">

                    <span class="expense-title">
                        ${escapeHTML(expense.title)}
                    </span>

                    <span class="expense-amount">
                        ₹${expense.amount.toFixed(2)}
                    </span>

                </div>


                <div class="expense-details">

                    <span class="badge">
                        ${escapeHTML(expense.category)}
                    </span>

                    <span class="date-badge">
                        📅 ${expense.date}
                    </span>

                </div>


                <div class="action-buttons">

                    <button
                        class="edit-btn"
                        onclick="editExpense(${expense.id})"
                    >
                        ✏️ Edit
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteExpense(${expense.id})"
                    >
                        🗑️ Delete
                    </button>

                </div>

            `;


            expenseList.appendChild(
                expenseElement
            );

        }
    );

}


// ============================================
// FILTER EXPENSES
// ============================================

function getFilteredExpenses() {

    let filtered =
        [...expenses];


    // Category filter
    if (
        filterCategory.value !== "All"
    ) {

        filtered =
            filtered.filter(
                expense =>
                    expense.category ===
                    filterCategory.value
            );

    }


    // Date filter
    if (filterDate.value) {

        filtered =
            filtered.filter(
                expense =>
                    expense.date ===
                    filterDate.value
            );

    }


    return filtered;

}


// ============================================
// SORT EXPENSES
// ============================================

function sortExpenseData(data) {

    const sorted =
        [...data];


    switch (sortExpenses.value) {

        case "newest":

            sorted.sort(
                (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
            );

            break;


        case "oldest":

            sorted.sort(
                (a, b) =>
                    new Date(a.date) -
                    new Date(b.date)
            );

            break;


        case "high":

            sorted.sort(
                (a, b) =>
                    b.amount -
                    a.amount
            );

            break;


        case "low":

            sorted.sort(
                (a, b) =>
                    a.amount -
                    b.amount
            );

            break;

    }


    return sorted;

}


// ============================================
// UPDATE SUMMARY
// ============================================

function updateSummary() {

    // Calculate total
    const total =
        expenses.reduce(
            function (sum, expense) {

                return (
                    sum +
                    Number(expense.amount)
                );

            },
            0
        );


    // Display total
    totalExpense.textContent =
        `₹${total.toFixed(2)}`;


    // Display entries
    totalEntries.textContent =
        expenses.length;

}


// ============================================
// EDIT EXPENSE
// ============================================

function editExpense(id) {

    const expense =
        expenses.find(
            item =>
                item.id === id
        );


    if (!expense) {

        return;

    }


    // Put values into form
    expenseTitle.value =
        expense.title;

    expenseAmount.value =
        expense.amount;

    expenseCategory.value =
        expense.category;

    expenseDate.value =
        expense.date;


    // Store ID
    editId.value =
        expense.id;


    // Change button
    submitButton.textContent =
        "💾 Update Expense";


    // Show cancel button
    cancelEdit.style.display =
        "inline-block";


    // Scroll to form
    expenseForm.scrollIntoView({
        behavior: "smooth"
    });

}


// ============================================
// CANCEL EDIT
// ============================================

cancelEdit.addEventListener(
    "click",
    function () {

        cancelEditMode();

        expenseForm.reset();

        setTodayDate();

    }
);


function cancelEditMode() {

    editId.value = "";

    submitButton.textContent =
        "➕ Add Expense";

    cancelEdit.style.display =
        "none";

}


// ============================================
// DELETE EXPENSE
// ============================================

function deleteExpense(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this expense?"
        );


    if (!confirmed) {

        return;

    }


    // Remove expense
    expenses =
        expenses.filter(
            expense =>
                expense.id !== id
        );


    // Save changes
    saveExpenses();


    // Refresh
    displayExpenses();

    updateSummary();

}


// ============================================
// FILTER EVENT LISTENERS
// ============================================

filterCategory.addEventListener(
    "change",
    displayExpenses
);


filterDate.addEventListener(
    "change",
    displayExpenses
);


sortExpenses.addEventListener(
    "change",
    displayExpenses
);


// ============================================
// CLEAR FILTERS
// ============================================

clearFilters.addEventListener(
    "click",
    function () {

        filterCategory.value =
            "All";

        filterDate.value =
            "";

        sortExpenses.value =
            "newest";


        displayExpenses();

    }
);


// ============================================
// SET TODAY'S DATE
// ============================================

function setTodayDate() {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    expenseDate.value =
        today;

}


// ============================================
// SECURITY
// Prevent HTML injection
// ============================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value;

    return div.innerHTML;

}


// ============================================
// INITIAL DISPLAY
// ============================================

displayExpenses();

updateSummary();