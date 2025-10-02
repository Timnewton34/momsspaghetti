// A mapping of ingredients to their grocery store sections
const grocerySections = {
    "Produce": ["Onion", "Broccoli", "Asparagus", "Basil", "Lemon"],
    "Meats": ["Ground Beef", "Chicken Breast", "Salmon Fillet", "Pepperoni"],
    "Dairy": ["Mozzarella Cheese", "Cheese Sauce"],
    "Pantry": ["Spaghetti", "Tomato Sauce", "Pizza Dough", "Macaroni", "Buns"]
};

// Master list of all available meals
const meals = [
    {
        name: "Spaghetti and Meatballs",
        image: "https://via.placeholder.com/150/ff7f7f",
        ingredients: ["Spaghetti", "Ground Beef", "Tomato Sauce", "Onion"],
        recipe: "Boil spaghetti. Cook meatballs in sauce. Combine and serve."
    },
    {
        name: "Basil Grilled Chicken with Broccoli",
        image: "https://via.placeholder.com/150/7fffd4",
        ingredients: ["Chicken Breast", "Basil", "Broccoli"],
        recipe: "Season chicken with basil. Grill until cooked through. Steam broccoli and serve."
    },
    {
        name: "Grilled Salmon with Asparagus",
        image: "https://via.placeholder.com/150/add8e6",
        ingredients: ["Salmon Fillet", "Asparagus", "Lemon"],
        recipe: "Preheat grill. Season salmon and asparagus with salt, pepper, and lemon. Grill until cooked."
    },
    {
        name: "Leftovers",
        image: "https://via.placeholder.com/150/c2c2c2",
        ingredients: [],
        recipe: "Heat up your favorite leftovers and enjoy."
    },
    {
        name: "Pepperoni Pizza",
        image: "https://via.placeholder.com/150/ffb6c1",
        ingredients: ["Pizza Dough", "Pepperoni", "Mozzarella Cheese", "Tomato Sauce"],
        recipe: "Top pizza dough with sauce, cheese, and pepperoni. Bake until crust is golden."
    },
    {
        name: "Hamburgers with Mac & Cheese",
        image: "https://via.placeholder.com/150/ffd700",
        ingredients: ["Ground Beef", "Buns", "Macaroni", "Cheese Sauce"],
        recipe: "Form patties and cook hamburgers. Prepare mac & cheese according to package directions. Serve together."
    }
];

// Global variables for app state
let editingDay = null;
let favoriteMeals = [];
let currentWeekIndex = 0; // The new variable to track the current week

// User's weekly meal plan (now an array of weeks)
const weeklyPlan = [
    {
        "monday": 0,
        "tuesday": 1,
        "wednesday": 2,
        "thursday": 3,
        "friday": 4,
        "saturday": 5,
        "sunday": 3
    },
    {
        "monday": 5,
        "tuesday": 2,
        "wednesday": 0,
        "thursday": 3,
        "friday": 1,
        "saturday": 4,
        "sunday": 3
    }
];

// --- Script to generate and manage content ---

// Function to generate the HTML for a single meal row
function createMealRowHTML(day, meal) {
    const dayName = day.charAt(0).toUpperCase() + day.slice(1);
    const mealIndex = meals.findIndex(m => m.name === meal.name);
    const isFavorited = favoriteMeals.includes(mealIndex) ? " is-favorited" : "";

    return `
        <div class="meal-row">
            <p class="day-of-week">${dayName}</p>
            <div class="meal-content" data-meal-index="${mealIndex}">
                <img src="${meal.image}" alt="${meal.name}">
                <p class="meal-name">${meal.name}</p>
            </div>
            <div class="buttons-container">
                <span class="favorite-btn${isFavorited}" data-meal-index="${mealIndex}">&hearts;</span>
                <button class="edit-btn" data-day="${day}">Edit</button>
            </div>
        </div>
    `;
}

// Function to generate and display the weekly meal plan
function displayWeeklyPlan() {
    const container = document.getElementById('this-weeks-meals');
    const button = document.getElementById('create-grocery-list');
    
    // Get the correct week's plan using the currentWeekIndex
    const currentWeek = weeklyPlan[currentWeekIndex];

    container.innerHTML = '<h1>What\'s For Dinner</h1>';
    
    for (const day in currentWeek) {
        const mealIndex = currentWeek[day];
        const meal = meals[mealIndex];
        if (meal) {
            const mealRowHTML = createMealRowHTML(day, meal);
            container.insertAdjacentHTML('beforeend', mealRowHTML);
        }
    }
    
    container.appendChild(button);
    enableEditButtons();
    addRecipeClickListeners();
    addFavoriteClickListeners();
}

// Function to generate and display all meal ideas
function displayAllMealIdeas() {
    const container = document.getElementById('all-meal-ideas');
    container.innerHTML = '<h1>All Meal Ideas</h1>';

    meals.forEach((meal, index) => {
        if (meal.name !== "Leftovers") {
            const isFavorited = favoriteMeals.includes(index) ? " is-favorited" : "";
            const mealIdeaHTML = `
                <div class="meal-row">
                    <div class="meal-content" data-meal-index="${index}">
                        <img src="${meal.image}" alt="${meal.name}">
                        <p class="meal-name">${meal.name}</p>
                    </div>
                    <div class="buttons-container">
                        <span class="favorite-btn${isFavorited}" data-meal-index="${index}">&hearts;</span>
                        <button class="select-btn" data-meal-index="${index}">Select</button>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', mealIdeaHTML);
        }
    });
    enableSelectButtons();
    addRecipeClickListeners();
    addFavoriteClickListeners();
}

// Function to generate and display the grocery list
function generateGroceryList() {
    const weeklyIngredients = new Set();
    // Get the current week's plan
    const currentWeek = weeklyPlan[currentWeekIndex];

    for (const day in currentWeek) {
        const mealIndex = currentWeek[day];
        const meal = meals[mealIndex];
        if (meal && meal.ingredients.length > 0) {
            meal.ingredients.forEach(ingredient => {
                weeklyIngredients.add(ingredient);
            });
        }
    }

    const container = document.getElementById('grocery-list-container');
    container.innerHTML = '';

    for (const section in grocerySections) {
        const sectionItems = [];
        weeklyIngredients.forEach(ingredient => {
            if (grocerySections[section].includes(ingredient)) {
                sectionItems.push(ingredient);
            }
        });

        if (sectionItems.length > 0) {
            let sectionHTML = `<h3>${section}</h3><ul>`;
            sectionItems.forEach(item => {
                sectionHTML += `<li>${item}</li>`;
            });
            sectionHTML += `</ul>`;
            container.insertAdjacentHTML('beforeend', sectionHTML);
        }
    }
}

// Function to show a single content section and hide others
function showSection(sectionId) {
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.style.display = 'block';
    }
}

// Function to enable the edit buttons on the weekly plan page
function enableEditButtons() {
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const dayToEdit = event.target.dataset.day;
            editingDay = dayToEdit;
            showSection('all-meal-ideas');
        });
    });
}

// Function to enable the select buttons on the meal ideas page
function enableSelectButtons() {
    const selectButtons = document.querySelectorAll('.select-btn');
    selectButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const mealIndex = event.target.dataset.mealIndex;
            // Get the current week's plan from the array
            const currentWeek = weeklyPlan[currentWeekIndex];
            currentWeek[editingDay] = parseInt(mealIndex);
            displayWeeklyPlan();
            showSection('this-weeks-meals');
        });
    });
}

// Function to add click listeners to all meal images and names
function addRecipeClickListeners() {
    const mealContent = document.querySelectorAll('.meal-content');
    const modal = document.getElementById('recipe-modal');
    const closeBtn = document.querySelector('.close-btn');

    mealContent.forEach(content => {
        content.addEventListener('click', (event) => {
            let targetDiv = event.target.closest('.meal-content');
            if (targetDiv) {
                const mealIndex = targetDiv.dataset.mealIndex;
                showRecipe(mealIndex);
            }
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
}

// Function to show the recipe modal
function showRecipe(mealIndex) {
    const modal = document.getElementById('recipe-modal');
    const title = document.getElementById('recipe-title');
    const text = document.getElementById('recipe-text');

    const meal = meals[mealIndex];
    if (meal) {
        title.textContent = meal.name;
        text.textContent = meal.recipe;
        modal.style.display = "block";
    }
}

// Add click event listeners to the navigation links
document.getElementById('nav-this-week').addEventListener('click', (e) => {
    e.preventDefault();
    displayWeeklyPlan();
    showSection('this-weeks-meals');
});

document.getElementById('nav-all-ideas').addEventListener('click', (e) => {
    e.preventDefault();
    displayAllMealIdeas();
    showSection('all-meal-ideas');
});

document.getElementById('nav-grocery-list').addEventListener('click', (e) => {
    e.preventDefault();
    generateGroceryList();
    showSection('grocery-list');
});

// Add a click listener to the "Create Grocery List" button
document.getElementById('create-grocery-list').addEventListener('click', () => {
    generateGroceryList();
    showSection('grocery-list');
});


// Initial page setup on load
displayWeeklyPlan();
displayAllMealIdeas();
showSection('this-weeks-meals');