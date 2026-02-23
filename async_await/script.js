async function GetAllPosts() {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts&#39",
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

async function GetPostById(id) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

async function CreatePost() {
  try {
    const response = fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        title: "foo",
        body: "bar",
        userId: 1,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

async function UpdatePost(id) {
  try {
    const response = fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        id: 1,
        title: "foo",
        body: "bar",
        userId: 1,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}
function PatchPost(id) {
  fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      title: "foo",
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
}

function DeletePost(id) {
  fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: "DELETE",
  });
}
