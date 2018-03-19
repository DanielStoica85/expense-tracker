// Initialize Materialize Select

$(document).ready(function () {
    $('select').material_select();
});

// Storage Controller

// Item Controller
const ItemController = (function () {

    // Item (expense) constructor
    const Expense = function (id, category, name, amount) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.amount = amount;
    }

    // Data Structure / State
    const data = {
        items: [
            //     {
            //     id: 0,
            //     category: 'Housing',
            //     name: 'Rent',
            //     amount: 650
            // }, {
            //     id: 1,
            //     category: 'Restaurant',
            //     name: 'Monelli',
            //     amount: 100
            // }, {
            //     id: 2,
            //     category: 'Gas',
            //     name: 'Gas March',
            //     amount: 100
            // }
        ],
        currentItem: null,
        totalExpenses: 0
    }

    // Public methods
    return {
        getItems: function () {
            return data.items;
        },
        addExpense: function (category, name, amount) {
            let id;
            // Create id
            if (data.items.length > 0) {
                id = data.items[data.items.length - 1].id + 1;
            } else {
                id = 0;
            }

            // Amount --> Number
            amount = parseInt(amount);

            // Create new expense
            newExpense = new Expense(id, category, name, amount);

            // Add expense to list
            data.items.push(newExpense);

            return newExpense;

        },
        getExpenseById: function (id) {
            let found = data.items.find(function (item) {
                return item.id === id;
            });
            return found;
        },
        getCurrentExpense: function () {
            return data.currentItem;
        },
        setCurrentExpense: function (item) {
            data.currentItem = item;
        },
        getTotalExpenses: function () {
            let total = 0;
            data.items.forEach(function (item) {
                total += item.amount;
            });
            // Set total expenses in data structure
            data.totalExpenses = total;
            return data.totalExpenses;
        },
        logData: function () {
            return data;
        }
    }

})();

// UI Controller
const UIController = (function () {

    const UISelectors = {
        itemList: '#expense-list',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        expenseNameInput: '#item-name',
        expenseAmountInput: '#item-amount',
        expenseCategory: '.optgroup-option.active.selected span',
        totalExpenses: '.total-expenses',
        categoriesDropdown: '#categories'
    }

    // Public methods
    return {
        populateItemList: function (items) {
            let html = '';
            items.forEach(function (item) {
                html += `<li class="collection-item" id="item-${item.id}">
                            <span class="title green-text text-darken-2">${item.category} | </span>
                            <strong>${item.name}: </strong>
                            <em>${item.amount} euros</em>
                            <a href="#" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>
                        </li>`;
            });

            // Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getExpenseInput: function () {
            return {
                name: document.querySelector(UISelectors.expenseNameInput).value,
                amount: document.querySelector(UISelectors.expenseAmountInput).value,
                category: document.querySelector(UISelectors.expenseCategory).textContent
            }
        },
        addListItem: function (item) {
            // Show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // Create li element
            const li = document.createElement('li');
            // Add class
            li.className = 'collection-item';
            // Add id
            li.id = `item-${item.id}`;
            // Add html
            li.innerHTML = `<span class="title green-text text-darken-2">${item.category} | </span>
                            <strong>${item.name}: </strong>
                            <em>${item.amount} euros</em>
                            <a href="#" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>`
            // Insert item in UI list
            document.querySelector(UISelectors.itemList).appendChild(li);
        },
        clearInput: function () {
            document.querySelector(UISelectors.expenseNameInput).value = '';
            document.querySelector(UISelectors.expenseAmountInput).value = '';
            UIController.resetDropdown();
        },
        resetDropdown: function () {
            $('select').prop('selectedIndex', 0); // Sets the first option as selected
            $('select').material_select(); // Update material select
        },
        addExpenseToForm: function () {
            document.querySelector(UISelectors.expenseNameInput).value = ItemController.getCurrentExpense().name;
            document.querySelector(UISelectors.expenseAmountInput).value = ItemController.getCurrentExpense().amount;
            // update dropdown
            UIController.updateDropdownSelection(ItemController.getCurrentExpense().category);
            UIController.showEditState();
        },
        updateDropdownSelection: function (category) {
            $('select').val(category); // Sets the category as selected
            $('select').material_select(); // Update material select
        },
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalExpenses: function (totalExpenses) {
            document.querySelector(UISelectors.totalExpenses).textContent = totalExpenses;
        },
        clearEditState: function () {
            UIController.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function () {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function () {
            return UISelectors;
        }
    }

})();

// App Controller
const App = (function (ItemController, UIController) {

    // Load event listeners
    const loadEventListeners = function () {

        // Get UI Selectors
        const UISelectors = UIController.getSelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', addItemOnSubmit);

        // Disable submit on enter
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });

        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Update item event
        // document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
    }

    // Add item on submit
    const addItemOnSubmit = function (e) {

        // Get form input from UI Controller
        const input = UIController.getExpenseInput();

        // Check for name and amount
        if (input.name !== '' && input.amount !== '') {

            // Add expense
            const newExpense = ItemController.addExpense(input.category, input.name, input.amount);

            // Add expense to UI list
            UIController.addListItem(newExpense);

            // Get total expenses
            const totalExpenses = ItemController.getTotalExpenses();

            // Add total expenses to the UI
            UIController.showTotalExpenses(totalExpenses);

            // Clear fields
            UIController.clearInput();
        }

        e.preventDefault();
    }

    const itemEditClick = function (e) {

        if (e.target.classList.contains('edit-item')) {

            // Get list item id
            const listId = e.target.parentNode.parentNode.id;
            // Get actual id
            const id = parseInt(listId.split('-')[1]);
            // Get item
            const itemToEdit = ItemController.getExpenseById(id);
            // Set current item
            ItemController.setCurrentExpense(itemToEdit);
            // Add item to form
            UIController.addExpenseToForm();
        }
    }

    // Public methods
    return {
        init: function () {

            // Clear edit state / set initial state
            UIController.clearEditState();

            // fetch items from data structure
            const items = ItemController.getItems();

            // Check if any items
            if (items.length === 0) {
                // hide list if no items
                UIController.hideList();
            } else {
                // populate list with fetched items
                UIController.populateItemList(items);
            }

            // Get total expenses
            const totalExpenses = ItemController.getTotalExpenses();

            // Add total expenses to the UI
            UIController.showTotalExpenses(totalExpenses);

            // Load event listeners
            loadEventListeners();
        }
    }

})(ItemController, UIController);

// Initialize App
App.init();