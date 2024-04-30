const loginBtn = document.querySelector("#loginBtn");
const signUpBtn = document.querySelector("#signUpBtn");
const kakaoBtn = document.querySelector("#kakaoBtn");

signUpBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  window.location.href = "/html/signUp.html";
});

loginBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  const inputValues = {
    email: document.querySelector("#email").value,
    password: document.querySelector("#password").value,
  };

  const url = "https://www.backraffles.shop/user/login";
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
    const data = await response.json();
    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;
    const userId = data.userId;
    if (accessToken && refreshToken) {
      // localStorage.setItem("accessToken", accessToken);
      // localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", userId);
      document.cookie = `access_token=${accessToken}; Path=/; Secure; SameSite=None`;
      document.cookie = `refresh_token=${refreshToken}; Path=/; Secure; SameSite=None`;
    }
    window.location.href = "/index.html";
  } catch (error) {
    console.error(error);
  }
});

// 로그인 버튼 클릭 시 이벤트 처리
kakaoBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  const url = "https://www.backraffles.shop/kakao/oauth";
  const requestData = {
    method: "GET",
    headers: {
      "Content-Type": "text/html",
    },
  };

  try {
    // const response = await fetch(url, requestData);
    // if (!response.ok) {
    //   throw new Error("API 요청 실패");
    // }
    // const data = await response.json();
    // const accessToken = data.access_token;
    // const refreshToken = data.refresh_token;
    // const userId = data.userId;
    // if (accessToken && refreshToken) {
    //   // localStorage.setItem("accessToken", accessToken);
    //   // localStorage.setItem("refreshToken", refreshToken);
    //   localStorage.setItem("userId", userId);
    //   document.cookie = `access_token=${accessToken}; Path=/; Secure; SameSite=None`;
    //   document.cookie = `refresh_token=${refreshToken}; Path=/; Secure; SameSite=None`;
    // }
    // window.location.href = "/index.html";
    window.location.href = "https://www.backraffles.shop/kakao/oauth";
  } catch (error) {
    console.error(error);
  }
});
