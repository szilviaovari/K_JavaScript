const myPromise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve("Operation was successful!");
  } else {
    reject("Something went wrong.");
  }
});

myPromise
  .then((result) => console.log(result))
  .catch((error) => console.error(error))
  .finally(() => console.log("Done."));

//három állapota van: Pending, Fulfilled, Rejected
//három kezelése van az eredménynek: .then(), .catch(), és .finally() metódusok.
//forrás:https://nodejs.org/learn/asynchronous-work/discover-promises-in-nodejs
//forrás:https://www.w3schools.com/js/js_promise.asp