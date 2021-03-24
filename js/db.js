const RECIPES_COLLECTION = "recipes";
const CHANGE_TYPE_ADDED = "added";
const CHANGE_TYPE_REMOVED = "removed";

// -> Set up realtime listener on recipes collection
db.collection(RECIPES_COLLECTION).onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    // - DEV NOTE -> Firebase snapshot items have an overall object they hang out in,
    //               and then a doc property with an id sub-property and data() function
    //               which can pull out the information involved with the DB change.
    // console.log(change, change.doc.data(), change.doc.id);
    if (change.type === CHANGE_TYPE_ADDED) {
      // -> Add the document data to the web page's local database
    }
    if (change.type === CHANGE_TYPE_REMOVED) {
      // -> Remove the document from the web page's local database
    }
  });
});