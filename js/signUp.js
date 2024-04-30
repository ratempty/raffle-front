const signUpBtn = document.querySelector("#signUpBtn");

signUpBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  const inputValues = {
    email: document.querySelector("#email").value,
    password: document.querySelector("#password").value,
    passwordConfirm: document.querySelector("#pwConfirm").value,
    nickName: document.querySelector("#nickName").value,
    name: document.querySelector("#name").value,
  };

  const url = "https://www.backraffles.shop/user/register";
  const requestData = {
    method: "POST",
    body: JSON.stringify(inputValues),
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url, requestData);
    if (!response.ok) {
      throw new Error("API 요청 실패");
    }
    window.location.href = "/html/login.html";
  } catch (error) {
    console.error(error);
  }
});
