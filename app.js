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
        updateExpense: function (name, amount, category) {
            // Amount to number
            amount = parseInt(amount);

            let found = null;
            data.items.forEach(function (item) {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.amount = amount;
                    item.category = category;
                    found = item;
                }
            });
            return found;
        },
        deleteExpense: function (id) {
            // Get all ids
            const ids = data.items.map(function (item) {
                return item.id;
            });
            // Get index
            const index = ids.indexOf(id);
            // Remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function () {
            data.items = [];
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
        listItems: '#expense-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
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
        getExpenseInputWhenUpdating: function () {
            return {
                name: document.querySelector(UISelectors.expenseNameInput).value,
                amount: document.querySelector(UISelectors.expenseAmountInput).value,
                category: $('select').find(":selected").text()
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
        updateListItem: function (item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            listItems = Array.from(listItems);
            listItems.forEach(function (listItem) {
                const itemId = listItem.getAttribute('id');
                if (itemId === `item-${item.id}`) {
                    document.querySelector(`#${itemId}`).innerHTML = `<span class="title green-text text-darken-2">${item.category} | </span>
                    <strong>${item.name}: </strong>
                    <em>${item.amount} euros</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>`
                }
            });
        },
        deleteListItem: function (id) {
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
            // hide list after removing the last item
            let listItems = document.querySelectorAll(UISelectors.listItems);
            if (listItems.length === 0) {
                UIController.hideList();
            }
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
        removeItems: function () {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            listItems = Array.from(listItems);
            listItems.forEach(function (item) {
                item.remove();
            });
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
        backBtnClick: function (e) {
            UIController.clearEditState();
            e.preventDefault();
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
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // Back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UIController.backBtnClick);

        // Clear items event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
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

    // Update item submit
    const itemUpdateSubmit = function (e) {

        const input = UIController.getExpenseInputWhenUpdating();

        // Update expense
        const updatedExpense = ItemController.updateExpense(input.name, input.amount, input.category);

        // Update UI
        UIController.updateListItem(updatedExpense);

        // Get total expenses
        const totalExpenses = ItemController.getTotalExpenses();

        // Add total expenses to the UI
        UIController.showTotalExpenses(totalExpenses);

        UIController.clearEditState();

        e.preventDefault();
    }

    // Delete expense event
    const itemDeleteSubmit = function (e) {

        // Get current expense
        const currentExpense = ItemController.getCurrentExpense();

        // Delete expense from data structure
        ItemController.deleteExpense(currentExpense.id);

        // Delete from UI
        UIController.deleteListItem(currentExpense.id);

        // Get total expenses
        const totalExpenses = ItemController.getTotalExpenses();

        // Add total expenses to the UI
        UIController.showTotalExpenses(totalExpenses);

        UIController.clearEditState();

        e.preventDefault();
    }

    // Clear expenses event
    const clearAllItemsClick = function (e) {

        // Delete all items from data structure
        ItemController.clearAllItems();

        // Get total expenses
        const totalExpenses = ItemController.getTotalExpenses();

        // Add total expenses to the UI
        UIController.showTotalExpenses(totalExpenses);

        // Remove all expenses from UI
        UIController.removeItems();

        // Hide the list
        UIController.hideList();

        e.preventDefault();

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