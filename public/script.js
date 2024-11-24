document.addEventListener('DOMContentLoaded', async () => {
    const breakfastContainer = document.getElementById('breakfast-items');
    const lunchContainer = document.getElementById('lunch-items');
    const dinnerContainer = document.getElementById('dinner-items');
    const myMealsList = document.getElementById('my-meals');
    const shoppingListButton = document.getElementById('shopping-list-button');
    const shoppingListContainer = document.getElementById('shopping-list');
    const shoppingListItems = document.getElementById('shopping-list-items');

    let selectedMeals = {
        breakfast: null,
        lunch: null,
        dinner: null,
   
    };

// Fetch meal data from the server
const response = await fetch('/api/meals');
const meals = await response.json();

// Function to create meal item elements
function createMealItem(meal, category) {
    const mealDiv = document.createElement('div');
    mealDiv.className = 'meal-item';
    mealDiv.innerHTML = `
        <h3>${meal.name}</h3>
        <button onclick="addToMyMeals('${category}', '${meal.name}')">Add to My Meal</button>
    `;
    return mealDiv;
}

// Populate the meal categories
meals.breakfast.forEach(meal => {
    breakfastContainer.appendChild(createMealItem(meal, 'breakfast'));
});

meals.lunch.forEach(meal => {
    lunchContainer.appendChild(createMealItem(meal, 'lunch'));
});

meals.dinner.forEach(meal => {
    dinnerContainer.appendChild(createMealItem(meal, 'dinner'));
});

// Function to add selected meal to My Meals
window.addToMyMeals = function(category, mealName) {
    if (selectedMeals[category]) {
        alert(`You have already selected a ${category} item.`);
        return;
    }

    selectedMeals[category] = mealName;

    const listItem = document.createElement('li');
    listItem.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)}: ${mealName}`;
    myMealsList.appendChild(listItem);

    // Update shopping list
    updateShoppingList();
};

// Function to update the shopping list
function updateShoppingList() {
    shoppingListItems.innerHTML = ''; // Clear previous items

    Object.keys(selectedMeals).forEach(category => {
        if (selectedMeals[category]) {
            const meal = meals[category].find(m => m.name === selectedMeals[category]);
            meal.ingredients.forEach(ingredient => {
                const listItem = document.createElement('li');
                listItem.textContent = ingredient;
                shoppingListItems.appendChild(listItem);
            });
        }
    });
}

// Show or hide the shopping list
shoppingListButton.addEventListener('click', () => {
    shoppingListContainer.style.display = shoppingListContainer.style.display === 'none' ? 'block' : 'none';
});
});