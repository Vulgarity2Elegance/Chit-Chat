$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then((data) => {
    $(".member-name").text(data.email);
  });

  $("#searchButton").on("click", (e) => {
    e.preventDefault();
    searchRecipe();
  });

  function searchRecipe() {
    const searchedIngredients = $("#ingredients").val();
    $("#button1").text(searchedIngredients);
  }
});

$("#button1").on("click", (e) => {
  e.preventDefault();
  $.ajax({
    url:
      "https://api.spoonacular.com/recipes/findByIngredients?" +
      "ingredients=" +
      $("#button1").text() +
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
            <a href="#" class="btn btn-primary">View Instructions!</a>
          </div>
        </div>
      </div>
    `);
    });
    $(".recipe-card").html(templates);
  });
});
