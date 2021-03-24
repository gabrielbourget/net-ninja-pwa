const RECIPES_COLLECTION = "recipes";
const CHANGE_TYPE_ADDED = "added";
const CHANGE_TYPE_REMOVED = "removed";

// -> Enable offline data persistence
db.enablePersistence()
  .catch((err) => {
    if (err.code === "failed-precondition") {
      // - DEV NOTE -> Most likely has to do with multiple tabs being open at a time
      console.log("[db.js] Offline data persistence setup failed.");
    } else if (err.code === "unimplemented") {
      // - DEV NOTE -> Lack of underlying browser support for IndexedDB
      console.log("[db.js] IndexedDB is not properly supported on this browser.");
    }
  });

// -> Set up realtime listener on recipes collection
db.collection(RECIPES_COLLECTION).onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    // - DEV NOTE -> Firebase snapshot items have an overall object they hang out in,
    //               and then a doc property with an id sub-property and data() function
    //               which can pull out the information involved with the DB change.
    // console.log(change, change.doc.data(), change.doc.id);
    if (change.type === CHANGE_TYPE_ADDED) {
      // -> Add the document data to the web page's local database
      createRecipe(change.doc.data(), change.doc.id);
    }
    if (change.type === CHANGE_TYPE_REMOVED) {
      // -> Remove the document from the web page's local database
      deleteRecipe(change.doc.id);
    }
  });
});

// -> Add a new recipe to your collection
const form = document.querySelector("form");
form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const recipe = {
    title: form.title.value,
    ingredients: form.ingredients.value,
  };

  db.collection(RECIPES_COLLECTION).add(recipe).catch((err) => console.log(err));

  form.title.value = "";
  form.ingredients.value = "";
});

// -> Delete a recipe from your collection
const recipesContainer = document.querySelector(".recipes");
recipesContainer.addEventListener("click", (evt) => {
  if (evt.target.tagName === "I") {
    const id = evt.target.getAttribute("data-id");
    db.collection(RECIPES_COLLECTION).doc(id).delete();
  }
});
