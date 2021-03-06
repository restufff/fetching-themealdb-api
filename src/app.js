import "./styles/style.css";
import "./component/app-bar.js";
import Swal from "sweetalert2";

const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  mealsEl = document.getElementById("meals"),
  resultheading = document.getElementById("result-heading"),
  single_mealEl = document.getElementById("single-meal"),
  baseUrl = "https://www.themealdb.com/api/json/v1/1";

// Search meal and fetch from API
function searchMeal(e) {
  e.preventDefault();

  // Clear singel meal
  single_mealEl.innerHTML = "";

  // Get search term
  const term = search.value;

  // Check for empty
  if (term.trim()) {
    fetch(`${baseUrl}/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        resultheading.innerHTML = `<h2>Search results for '${term}':</h2>`;

        if (data.meals === null) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Can't find what you want, let's try 'Steak'",
          });
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
                    <div class="meal">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>${meal.strMeal}</h3>
                        </div>                    
                    </div>    
                    `
            )
            .join("");
        }
      });
    // Clear search text
    search.value = "";
  } else {
    Swal.fire({
      icon: "warning",
      title: "It's empty!",
      text: "Please enter a meal!",
    });
  }
}

// Fetch meal by ID
function getMealById(mealID) {
  fetch(`${baseUrl}/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

// Fetch random meal from API
function getRandomMeal() {
  // Clear meals and heading
  mealsEl.innerHTML = "";
  resultheading.innerHTML = "";

  fetch(`${baseUrl}/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

// Add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
                </ul>
            </div >
        </div >
        `;
}

// Event listeners
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", getRandomMeal);

mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealById(mealID);
  }
});
