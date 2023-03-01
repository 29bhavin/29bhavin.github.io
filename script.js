//Getting divs, buttons to add event and event listeners to handle events
const mainSection = document.querySelector("#main-section");
const home = document.querySelector("#home");
const searchBar = document.querySelector("input");
const mealsCards = document.querySelector("#meals-cards");
const popUp = document.querySelector(".pop-up");
const favSection = document.querySelector("#fav-section");
const favourits = document.querySelector("#favs");
const favMealsCards = document.querySelector("#fav-meals");
//List conatining list of favourite meals
const favsList = [];
//Function to show user the their favourite meals
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
    //Fetching URL by hitting API to get meal deatils based on meal id
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
  //Adding Event Listener to buttons associated with each fav meal.
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

//Function to show details of the particular selected meal
async function showMealDetails(mealid) {
  //Fetching URL by hitting API to get meal deatils based on meal id
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
  //Add Event Listener for close button
  const close = document.querySelector("#close");
  close.addEventListener("click", function (e) {
    popUp.style.display = "none";
  });
  //Add Event Listener for video button
  const videoInstruction = document.querySelector("#video");
  videoInstruction.addEventListener("click", function (e) {
    window.open(`${meals[0].strYoutube}`);
  });
}

//Function to show meals based on the search parameter
async function displayMeals(dishName) {
  //Fetching URL by hitting API to get meal deatils based on meal name
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
  //Add Event Listener on get details button to show details of meals
  const getDetails = document.querySelectorAll(".get-details");
  for (let btn of getDetails) {
    btn.addEventListener("click", function (e) {
      showMealDetails(e.target.getAttribute("data-id"));
      popUp.style.display = "block";
    });
  }
  //Add Event Listener to add the meals to favourite section
  const addToFav = document.querySelectorAll(".add-to-favs");
  for (let btn of addToFav) {
    btn.addEventListener("click", function (e) {
      favsList.push(e.target.getAttribute("data-id"));
      displayMeals(e.target.value);
    });
  }

  //Add Event Listener to remove the meals to favourite section
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

//Add Event Listener to get back to homepage from favourits page
home.addEventListener("click", function (e) {
  favSection.style.display = "none";
  mainSection.style.display = "block";
});

//Add Event Listener to go to favourits page from homepage page
favourits.addEventListener("click", function (e) {
  mainSection.style.display = "none";
  favSection.style.display = "block";
  showFavMeals();
});

//Add Event Listener on search input to display meals based on search parameter
searchBar.addEventListener("keyup", (e) => {
  displayMeals(e.target.value);
});
