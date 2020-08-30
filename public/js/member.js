$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then((data) => {
    $(".member-name").text(data.email);
    $(".member-id").val(data.id);
  });

  $("#searchButton").on("click", (e) => {
    e.preventDefault();
    searchedIngredients();
  });

  $(".searchedIngredients").on("click", ".recipe", function () {
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
            <button class="instruction btn btn-primary btn-sm" data-id="${item.id}" data-toggle="modal" data-target="#recipeCard">View Instructions!</button>
            <button class="recipeID btn btn-success btn-sm ml-3" data-id="${item.id}" data-title="${item.title}" data-toggle="modal" data-target="#recipeCard">Save Recipe!</button>
          </div>
        </div>
      </div>
    `);
      });
      $(".recipe-card").html(templates);
    });
  });

  $(".searchedIngredients").on("click", ".ingredient", function () {
    const name = $(this).data("name");
    const userId = $(".member-id").val();
    $.post("/api/ingredients", {
      name: name,
      UserId: userId,
    }).then(() => {
      const templates = [];
      templates.push(`
    <div class="alert alert-success alert-dismissible fade show" role="alert">
      ${name} has successfully saved!
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span arira-hidden="true">&times;</span>
      </button>
    </div>
    `);
      $(".insertedIngredients").html(templates);
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
      <button class="recipe btn btn-primary btn-sm" data-name="${searchedIngredients}">Search Recipes!</button>
      <button class="ingredient btn btn-success btn-sm" data-name="${searchedIngredients}">Save Ingredient!</button>
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

  $(".recipe-card").on("click", ".recipeID", function () {
    const id = $(this).data("id");
    const title = $(this).data("title");
    const userId = $(".member-id").val();
    $.post("/api/recipes", {
      recipeId: id,
      title: title,
      UserId: userId,
    }).then(() => {
      const templates = [];
      templates.push(`
      <div class="alert alert-success" role="alert">${title} has successfully saved!</div>
    `);
      $(".modal-body").html(templates);
    });
  });

  function renderIngredients() {
    $.get("/api/ingredients").then((data) => {
      console.log(data);
      const templates = [];
      data.forEach((item) => {
        templates.push(`
      <div class="list-group">
        <button class="saved my-1 btn btn-orange" data-name="${item.name}"> ${item.name} </button>
      </div>
    `);
      });
      $(".searchedIngredients").html(templates);
    });
  }
  renderIngredients();
  $(".searchedIngredients").on("click", ".saved", function () {
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
          <button class="instruction btn btn-primary btn-sm" data-id="${item.id}" data-toggle="modal" data-target="#recipeCard">View Instructions!</button>
          <button class="recipeID btn btn-success btn-sm ml-3" data-id="${item.id}" data-title="${item.title}" data-toggle="modal" data-target="#recipeCard">Save Recipe!</button>
        </div>
      </div>
    </div>
  `);
      });
      $(".recipe-card").html(templates);
    });
  });

  function renderRecipes() {
    $.get("/api/recipes").then((data) => {
      console.log(data);
      const templates = [];
      data.forEach((item) => {
        templates.push(`
      <div class="list-group">
        <button class="pulled my-1 btn btn-orange" data-id="${item.recipeId}" data-toggle="modal" data-target="#recipeCard"> ${item.title} </button>
      </div>
    `);
      });
      $(".recipe-card").html(templates);
    });
  }
  renderRecipes();
  $(".recipe-card").on("click", ".pulled", function () {
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
