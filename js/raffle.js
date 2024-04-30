fetch("https://www.backraffles.shop/raffles")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    todayRaffle(data[0]);
    willRaffle(data[1]);
    addEvent();
  })
  .catch((error) => console.error("Error:", error));

const todayRaffle = (raffles) => {
  const main = document.querySelector("#main");
  const container = main.querySelector(".container");

  const filterShoeCodes = [
    ...new Set(raffles.map((raffle) => raffle.shoeCode)),
  ];

  filterShoeCodes.forEach((shoeCode) => {
    const raffle = raffles.find((raffle) => raffle.shoeCode === shoeCode);

    const div = document.createElement("div");
    div.classList.add("canRaffle");
    div.innerHTML = `
      <img src="${raffle.imgUrl}" alt="${raffle.subName}" data_shoeCode="${raffle.shoeCode}" />
      <p class="brand">${raffle.brand}</p>
      <p class="subName">${raffle.subName}</p>
    `;
    container.appendChild(div);
  });

  const raffleImgs = container.querySelectorAll("img");

  raffleImgs.forEach((raffle) => {
    raffle.addEventListener("click", () => {
      const shoeCode = raffle.getAttribute("data_shoeCode");
      window.location.href = `/html/detail_raffle.html?shoeCode=${shoeCode}`;
    });
  });
};

const willRaffle = (raffles) => {
  const main = document.querySelector("#main");
  const container = main.querySelector(".container");

  const filterShoeCodes = [
    ...new Set(raffles.map((raffle) => raffle.shoeCode)),
  ];

  filterShoeCodes.forEach((shoeCode) => {
    const raffle = raffles.find((raffle) => raffle.shoeCode === shoeCode);

    const div = document.createElement("div");
    div.classList.add("willRaffle", "sr_only");
    div.innerHTML = `
      <img src="${raffle.imgUrl}" alt="${raffle.subName}" data_shoeCode="${raffle.shoeCode}" />
      <p class="brand">${raffle.brand}</p>
      <p class="subName">${raffle.subName}</p>
    `;
    container.appendChild(div);
  });

  const raffleImgs = container.querySelectorAll("img");

  raffleImgs.forEach((raffle) => {
    raffle.addEventListener("click", () => {
      const shoeCode = raffle.getAttribute("data_shoeCode");
      window.location.href = `/html/detail_raffle.html?shoeCode=${shoeCode}`;
    });
  });
};

const addEvent = () => {
  const main = document.querySelector("#main");
  const canRaffle = main.querySelector("#canRaffle");
  const willRaffle = main.querySelector("#willRaffle");

  canRaffle.addEventListener("click", () => {
    main.querySelectorAll(".canRaffle").forEach((div) => {
      div.classList.remove("sr_only");
    });
    main.querySelectorAll(".willRaffle").forEach((div) => {
      div.classList.add("sr_only");
    });
  });
  willRaffle.addEventListener("click", () => {
    main.querySelectorAll(".canRaffle").forEach((div) => {
      div.classList.add("sr_only");
    });
    main.querySelectorAll(".willRaffle").forEach((div) => {
      div.classList.remove("sr_only");
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
