document.addEventListener("DOMContentLoaded", () => {
    const mealContent = document.getElementById("meal-content");
    const mealDisplay = document.getElementById("meal-display");
    const myMealsList = document.getElementById("my-meals-list");
    const shoppingList = document.getElementById("shopping-list");

    let selectedMeals = {
        breakfast: null,
        lunch: null,
        dinner: null
    };

    let meals; // Declare meals as a global variable

    // Fetch meals from the server
    async function fetchMeals() {
        try {
            const response = await fetch('/api/meals');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            meals = await response.json();
            displayMeals(meals);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    function displayMeals(meals) {
        mealDisplay.innerHTML = ''; // Clear previous meals
        const mealRow = document.createElement("div");
        mealRow.classList.add("row"); // Create a row to hold meal items
    
        for (const [mealType, mealArray] of Object.entries(meals)) {
            mealArray.forEach(meal => {
                const mealCol = document.createElement("div");
                mealCol.classList.add("col-md-4"); // Each meal will take up 1/3 of the row in medium and larger screens
                mealCol.innerHTML = `
                    <div class="meal-item mb-3">
                        <img src="${meal.image}" alt="${meal.name}" class="img-fluid">
                        <h2>${meal.name}</h2>
                        <div class="row">
                            <div class="col-6">
                                <button class="btn btn-success w-100" onclick="addToMyMeals('${mealType}', '${meal.name}')">Add to My Meals</button>
                            </div>
                            <div class="col-6">
                                <button class="btn btn-info w-100" onclick="showRecipe('${meal.name}')">Show Recipe</button>
                            </div>
                        </div>
                    </div>
                `;
                mealRow.appendChild(mealCol); // Append the column to the row
            });
        }
    
        mealDisplay.appendChild(mealRow); // Append the row to the mealDisplay
    }

    window.addToMyMeals = function(mealType, mealName) {
        if (!selectedMeals[mealType]) {
            selectedMeals[mealType] = mealName;
            updateMyMealsList(); // Update the my meals list
            updateShoppingList(); // Update the shopping list
        } else {
            alert(`You can only add one ${mealType}.`);
        }
    };

    // Update the showRecipe function to navigate to recipe.html
    window.showRecipe = function(mealName) {
        localStorage.setItem('meals', JSON.stringify(meals)); // Store meals in local storage
        window.location.href = `recipe.html?name=${mealName}`; // Redirect to recipe page
    };

    function updateMyMealsList() {
        myMealsList.innerHTML = ''; // Clear previous meals
        let hasMeals = false; // Flag to check if there are meals

        for (const mealType in selectedMeals) {
            const mealName = selectedMeals[mealType];
            if (mealName) {
                hasMeals = true; // Set flag to true if there are meals
                const mealElement = document.createElement("div");
                mealElement.textContent = mealName;
                myMealsList.appendChild(mealElement);
            }
        }

        // Check if there are no meals selected
        if (!hasMeals) {
            const noMealsElement = document.createElement("p");
            noMealsElement.textContent = "No meals selected.";
            myMealsList.appendChild(noMealsElement);
        }
    }

    function updateShoppingList() {
        shoppingList.innerHTML = ''; // Clear previous items
        let hasItems = false; // Flag to check if there are items
        const uniqueIngredients = new Set(); // Use a Set to store unique ingredients
    
        for (const mealType in selectedMeals) {
            const mealName = selectedMeals[mealType];
            if (mealName) {
                const meal = meals[mealType].find(m => m.name === mealName);
                if (meal) {
                    hasItems = true; // Set flag to true if there are items
                    const ingredients = meal.recipe.split('. ')[0].split(',').map( ingredient => ingredient.trim()); // Adjust as necessary
                    ingredients.forEach(ingredient => uniqueIngredients.add(ingredient)); // Add each ingredient to the Set
                } else {
                    console.error(`Meal not found: ${mealName}`);
                }
            }
        }
    
        // Create a shopping list container
        const shoppingListContainer = document.createElement("div");
        shoppingListContainer.classList.add("shopping-list-container");
    
        // Create a title for the shopping list
        const shoppingListTitle = document.createElement("h3");
        shoppingListTitle.textContent = "Shopping List";
        shoppingListContainer.appendChild(shoppingListTitle);
    
        // Create an unordered list to hold the ingredients
        const ingredientList = document.createElement("ul");
        ingredientList.classList.add("ingredient-list"); // Add a class for styling
    
        // Create list items for each unique ingredient
        uniqueIngredients.forEach(ingredient => {
            const listItem = document.createElement("li");
            listItem.textContent = ingredient;
            ingredientList.appendChild(listItem);
        });
    
        shoppingListContainer.appendChild(ingredientList); // Append the ingredient list to the shopping list container
        shoppingList.appendChild(shoppingListContainer); // Append the shopping list container to the shopping list section
    
        // Check if there are no items in the shopping list
        if (!hasItems) {
            const noItemsElement = document.createElement("p");
            noItemsElement.textContent = "No items in shopping list.";
            shoppingList.appendChild(noItemsElement);
        }
    }

    // Fetch meals when the page loads
    fetchMeals();

    // Function to show meals when the carousel button is clicked
    window.showMeals = function() {
        fetchMeals(); // Fetch meals again when "Meals" button is clicked
    };
});