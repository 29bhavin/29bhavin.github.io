const mainSection = document.querySelector("#main-section");
const home = document.querySelector("#home");
const searchBar = document.querySelector("input");
const mealsCards = document.querySelector("#meals-cards");
const popUp = document.querySelector(".pop-up");
const favSection = document.querySelector("#fav-section");
const favourits = document.querySelector("#favs");
const favMealsCards = document.querySelector("#fav-meals");
const favsList = [];
async function showFavMeals() {
  let htmlCode = "";
  if (favsList.length < 1) {
    htmlCode += `<div id = favs-heading>
		<h1>Ohh! You haven't Added any Favourit Meals </h1></div>`;
  } else {
    htmlCode += `<div id = favs-heading>
		<h1>Here are your Favourit Meals </h1></div>`;
  }
  for (x of favsList) {
    const url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + x;
    const response = await fetch(url);
    const data = await response.json();
    const meals = data.meals;
    htmlCode += `
  	<div class = "meal-image">
  		<img src = "${meals[0].strMealThumb}" alt = "${meals[0].strMeal}">
  		<h3>"${meals[0].strMeal}"</h3> 
  		<button class = "remove-from-favs2 btn-cls" data-id =${meals[0].idMeal} > Remove from Favs</button>
  	</div>`;
  }
  favMealsCards.innerHTML = htmlCode;
  const removeFromFav2 = document.querySelectorAll(".remove-from-favs2");
  for (let btn of removeFromFav2) {
    btn.addEventListener("click", function (e) {
      console.log("Inside event :" + e.target.getAttribute("data-id"));
      let idx = favsList.indexOf(e.target.getAttribute("data-id"));
      if (idx > -1) {
        favsList.splice(idx, 1);
      }
      showFavMeals();
    });
  }
}
async function showMealDetails(mealid) {
  const url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealid;
  const response = await fetch(url);
  const data = await response.json();
  const meals = data.meals;
  let htmlCode = "";
  htmlCode += `<div class = "detail-meal-image">
  		<img src = "${meals[0].strMealThumb}" alt = "${meals[0].strMeal}">
  		<h3>"${meals[0].strMeal}"</h3>
  		<h4>Instructions to Follow:</h4>
  		<p>"${meals[0].strInstructions}"
  		<div class = "detail-button">
  		<button  class = "btn-cls" id = "video">Instruction Video</button>
  		<button  class = "btn-cls" id ="close">Close</button>
  		</div>
  		</div>`;
  popUp.innerHTML = htmlCode;
  const close = document.querySelector("#close");
  close.addEventListener("click", function (e) {
    popUp.style.display = "none";
  });
  const videoInstruction = document.querySelector("#video");
  videoInstruction.addEventListener("click", function (e) {
    window.open(`${meals[0].strYoutube}`);
  });
}
async function displayMeals(dishName) {
  const url =
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + dishName;
  const response = await fetch(url);
  const data = await response.json();
  const meals = data.meals;
  let htmlCode = "";
  for (m of meals) {
    //console.log("Meal Name : "+m.strMeal);
    htmlCode += `
  	<div class = "meal-image">
  		<img src = "${m.strMealThumb}" alt = "${m.strMeal}">
  		<h3>"${m.strMeal}"</h3>
  		<button class = "get-details btn-cls" id = "get-details" data-id =${m.idMeal} > Get Meal Details</button>
  	`;
    if (favsList.includes(m.idMeal)) {
      htmlCode += `<button class = "remove-from-favs btn-cls" data-id =${m.idMeal}> Remove from Favs</button> </div>`;
    } else {
      htmlCode += `<button class = "add-to-favs btn-cls" data-id =${m.idMeal}> Add to Favs</button> </div>`;
    }
  }
  mealsCards.innerHTML = htmlCode;
  const getDetails = document.querySelectorAll(".get-details");
  for (let btn of getDetails) {
    btn.addEventListener("click", function (e) {
      showMealDetails(e.target.getAttribute("data-id"));
      popUp.style.display = "block";
    });
  }
  const addToFav = document.querySelectorAll(".add-to-favs");
  for (let btn of addToFav) {
    btn.addEventListener("click", function (e) {
      favsList.push(e.target.getAttribute("data-id"));
      displayMeals(e.target.value);
    });
  }

  const removeFromFav = document.querySelectorAll(".remove-from-favs");
  for (let btn of removeFromFav) {
    btn.addEventListener("click", function (e) {
      let idx = favsList.indexOf(e.target.getAttribute("data-id"));
      if (idx > -1) {
        favsList.splice(idx, 1);
      }
      displayMeals(e.target.value);
    });
  }
}
home.addEventListener("click", function (e) {
  favSection.style.display = "none";
  mainSection.style.display = "block";
});
favourits.addEventListener("click", function (e) {
  mainSection.style.display = "none";
  favSection.style.display = "block";
  showFavMeals();
});
searchBar.addEventListener("keyup", (e) => {
  displayMeals(e.target.value);
});
