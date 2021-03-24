const recipesDiv = document.querySelector(".recipes");

document.addEventListener('DOMContentLoaded', function() {
  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, {edge: 'right'});
  // add recipe form
  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, {edge: 'left'});
});

const createRecipe = (recipeData, id) => {
  const templateHTML = `
    <div class="card-panel recipe white row" data-id=${id}>
      <img src="/img/dish.png" alt="recipe thumb">
      <div class="recipe-details">
        <div class="recipe-title">${recipeData.title}</div>
        <div class="recipe-ingredients">${recipeData.ingredients}</div>
      </div>
      <div class="recipe-delete">
        <i class="material-icons" data-id=${id}>delete_outline</i>
      </div>
    </div>
  `;

  recipesDiv.innerHTML += templateHTML;
}
