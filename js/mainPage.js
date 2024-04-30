fetch("https://www.backraffles.shop/raffles")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    console.log(data[0], data[1]);
    mainPageTodayRaffle(data[0]);
    mainPageWillRaffle(data[1]);
  })
  .catch((error) => console.error("Error:", error));

const mainPageTodayRaffle = (raffles) => {
  const main = document.querySelector("#main");
  const todayRaffle = main.querySelector(".today_raffle");
  const raffleProduct = todayRaffle.querySelector(".raffle_product");

  const filterShoeCodes = [
    ...new Set(raffles.map((raffle) => raffle.shoeCode)),
  ];

  filterShoeCodes.forEach((shoeCode) => {
    const raffle = raffles.find((raffle) => raffle.shoeCode === shoeCode);

    const li = document.createElement("li");
    li.innerHTML = `
        <img src="${raffle.imgUrl}" alt="${raffle.subName}" data_shoeCode="${raffle.shoeCode}" />
        <p class='brand'>${raffle.brand}</p>
        <p class='subName'>${raffle.subName}</p>
      `;
    raffleProduct.appendChild(li);
  });

  const raffleImgs = raffleProduct.querySelectorAll("img");

  raffleImgs.forEach((raffle) => {
    raffle.addEventListener("click", () => {
      const shoeCode = raffle.getAttribute("data_shoeCode");
      window.location.href = `/html/detail_raffle.html?shoeCode=${shoeCode}`;
    });
  });
};

const mainPageWillRaffle = (raffles) => {
  const main = document.querySelector("#main");
  const comingRaffle = main.querySelector(".coming_raffle");
  const raffleProduct = comingRaffle.querySelector(".raffle_product");

  const filterShoeCodes = [
    ...new Set(raffles.map((raffle) => raffle.shoeCode)),
  ];

  filterShoeCodes.forEach((shoeCode) => {
    const raffle = raffles.find((raffle) => raffle.shoeCode === shoeCode);

    const li = document.createElement("li");
    li.innerHTML = `
        <img src="${raffle.imgUrl}" alt="${raffle.subName}" data_shoeCode="${raffle.shoeCode}" />
        <p class='brand'>${raffle.brand}</p>
        <p class='subName'>${raffle.subName}</p>
      `;
    raffleProduct.appendChild(li);
  });

  const raffleImgs = raffleProduct.querySelectorAll("img");

  raffleImgs.forEach((raffle) => {
    raffle.addEventListener("click", () => {
      const shoeCode = raffle.getAttribute("data_shoeCode");
      window.location.href = `/html/detail_raffle.html?shoeCode=${shoeCode}`;
    });
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

const searchBtn = document.querySelector("#searchBtn");

searchBtn.addEventListener("click", () => {
  const input = document.querySelector("#searchInput");

  window.location.href = `/html/search.html?value=${input.value}`;
});
