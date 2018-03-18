// Initialize Materialize Select

$(document).ready(function () {
    $('select').material_select();
});

// Storage Controller

// Item Controller
const ItemController = (function () {

    // Item (expense) constructor
    const Item = function (id, category, name, amount) {
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
            id: 0,
            category: 'Restaurant',
            name: 'Monelli',
            amount: 100
        }, {
            id: 0,
            category: 'Gas',
            name: 'Gas March',
            amount: 100
        }],
        currentItem: null,
        totalExpenses: 0
    }

    // Public methods
    return {
        logData: function () {
            return data;
        }
    }

})();

// UI Controller
const UIController = (function () {

    // Public methods
    return {

    }

})();

// App Controller
const App = (function (ItemController, UIController) {

    // Public methods
    return {
        init: function () {
            console.log('Initializing app!');
        }
    }

})(ItemController, UIController);

// Initialize App
App.init();