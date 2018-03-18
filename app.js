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
        items: [{
            id: 0,
            category: 'Housing',
            name: 'Rent',
            amount: 650
        }, {
            id: 1,
            category: 'Restaurant',
            name: 'Monelli',
            amount: 100
        }, {
            id: 2,
            category: 'Gas',
            name: 'Gas March',
            amount: 100
        }],
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
            const newExpense = new Expense(id, category, name, amount);

            // Add expense to list
            data.items.push(newExpense);

            return newExpense;

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
        expenseNameInput: '#item-name',
        expenseAmountInput: '#item-amount',
        expenseCategory: '.optgroup-option.active.selected span'
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
    }

    // Add item on submit
    const addItemOnSubmit = function (e) {

        // Get form input from UI Controller
        const input = UIController.getExpenseInput();

        // Check for name and amount
        if (input.name !== '' && input.amount !== '') {
            // Add expense
            const newExpense = ItemController.addExpense(input.category, input.name, input.amount);
        }

        e.preventDefault();
    }

    // Public methods
    return {
        init: function () {
            // fetch items from data structure
            const items = ItemController.getItems();

            // populate list with fetched items
            UIController.populateItemList(items);

            // Load event listeners
            loadEventListeners();
        }
    }

})(ItemController, UIController);

// Initialize App
App.init();