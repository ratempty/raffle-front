let pageNum = 1;
const marketRender = async () => {
  const url = `https://www.backraffles.shop/markets?page=${pageNum}`;
  try {
    const response = await fetch(url);
    const datas = await response.json();
    console.log(datas);
    datas.forEach((data) => {
      const marketContainer = document.querySelector(".market_container");

      const div = document.createElement("div");
      div.classList.add("item");
      div.innerHTML = `
        <img
        src="${data.thumbUrl}"
        alt="${data.name}"
        data-id = "${data.id}"
        class= "shoeImgs"
        />
        <p class="brand">${data.brand}</p>
        <p class="name">${data.name}</p>
      `;

      marketContainer.appendChild(div);
    });
    imgEvent();
  } catch (error) {
    console.log(error);
  }
};

marketRender();

const nextBtn = document.querySelector(".nextBtn");
const prevBtn = document.querySelector(".prevBtn");

nextBtn.addEventListener("click", () => {
  const marketContainer = document.querySelector(".market_container");
  marketContainer.innerHTML = "";
  pageNum++;
  marketRender();
});

prevBtn.addEventListener("click", () => {
  const marketContainer = document.querySelector(".market_container");
  marketContainer.innerHTML = "";
  pageNum--;
  marketRender();
});

const imgEvent = () => {
  const shoeImgs = document.querySelectorAll(".shoeImgs");

  shoeImgs.forEach((shoeImg) => {
    shoeImg.addEventListener("click", (e) => {
      const dataId = shoeImg.getAttribute("data-id");
      window.location.href = `/html/detail_market.html?shoeId=${dataId}`;
    });
  });
};
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

goMyPage();
