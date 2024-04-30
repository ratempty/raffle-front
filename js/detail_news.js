const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const newsId = urlParams.get("newsId");

fetch(`https://www.backraffles.shop/news/${newsId}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
    newsRender(data);
  })
  .catch((error) => console.error("Error:", error));

const newsRender = (data) => {
  const { newsImg, content, title, subTitle, views, createdAt } = data;

  const main = document.querySelector("#main");

  const div = document.createElement("div");
  div.classList.add("newsWrap");
  div.innerHTML = `
    <p class="views">조회수 : ${views}</p>
    <h2 class="newsTitle">${title}</h2>
    <h5 class="newsSubTitle">${subTitle}</h5>
    <img src="${newsImg}" alt="" />
    <p class="content">${content}</p>
  `;

  main.appendChild(div);
};

function getAccessTokenFromCookie() {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  const accessTokenCookie = cookies.find((cookie) =>
    cookie.startsWith("access_token=")
  );
  if (accessTokenCookie) {
    return accessTokenCookie.split("=")[1];
  }
  return null;
}

const goMyPage = () => {
  const myPageBtn = document.querySelector(".tnb img");
  myPageBtn.addEventListener("click", () => {
    if (getAccessTokenFromCookie() === null) {
      window.location.href = "/html/login.html";
    } else {
      window.location.href = "/html/myPage.html";
    }
  });
};

goMyPage();
