$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then((data) => {
    $(".member-name").text(data.email);
  });

  $("#searchButton").on("click", (e) => {
    e.preventDefault();
    searchedIngredients();
  });

  $(".searchedIngredients").on("click", ".ingredient", function () {
    // Search related recipe for searched ingredient.
    const query = $(this).data("name");
    $.ajax({
      url:
        "https://api.spoonacular.com/recipes/findByIngredients?ingredients=" +
        query +
        "&apiKey=27eccb2b8d6b4c8d99d5512e94ae0884",
      method: "GET",
    }).then((data) => {
      console.log(data);

      const templates = [];
      data.forEach((item) => {
        templates.push(`
      <div class="card-deck">
        <div class="card">
          <img class="card-img-top" src="${item.image}" alt="Card image cap" />
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            <p class="card-text">
              ${item.id}
            </p>
            <button class="instruction btn btn-primary btn-sm" data-id="${item.id}" data-toggle="modal" data-target="#exampleModalCenter">View Instructions!</button>
            <button class="recipeID btn btn-success btn-sm ml-3">Save Recipe!</button>
          </div>
        </div>
      </div>
    `);
      });
      $(".recipe-card").html(templates);
    });
  });

  function searchedIngredients() {
    // Rendering a card for an ingredient in order to search recipe or save the ingredient.
    const searchedIngredients = $("#ingredients").val();
    const templates = [];
    templates.push(`
  <div class="card text-white bg-warning mb-3">
    <div class="card-body">
      <h5 class="card-title text-center">${searchedIngredients}</h5>
      <button class="ingredient btn btn-primary btn-sm" data-name="${searchedIngredients}">Search Recipes!</button>
      <button class="btn btn-success btn-sm">Save Ingredient!</button>
    </div>
  </div>
  `);
    $(".searchedIngredients").html(templates);
  }

  $(".recipe-card").on("click", ".instruction", function () {
    // Redering instructions for the selected recipe
    const id = $(this).data("id");
    $.ajax({
      url:
        "https://api.spoonacular.com/recipes/" +
        id +
        "/analyzedInstructions?&apiKey=27eccb2b8d6b4c8d99d5512e94ae0884",
      method: "GET",
    }).then((response) => {
      console.log(response[0].steps);
      const data = response[0].steps;
      const templates = [];
      data.forEach((item) => {
        templates.push(`
      <ul class="list-group">
        <li class="list-group-item">${item.number}.${item.step}</li>
      </ul>
      `);
      });
      $(".modal-body").html(templates);
    });
  });
});
