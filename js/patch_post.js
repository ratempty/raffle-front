const shoeId = localStorage.getItem("shoeId");
const access_token = getAccessTokenFromCookie();
const marketId = localStorage.getItem("marketId");

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

function postLogin() {
  if (getAccessTokenFromCookie() === null) {
    window.location.href = "/html/login.html";
  }
}

window.onload = async () => {
  try {
    // 서버에서 해당 게시글 정보 가져오기
    const response = await fetch(
      `https://www.backraffles.shop/markets/shoes/${marketId}`
    );
    const data = await response.json();

    // 게시글 정보를 폼에 채우기
    document.getElementById("title").value = data.title;
    document.getElementById("content").value = data.content;
    document.getElementById("size").value = data.size;
    document.getElementById("price").value = data.price;
    console.log(data);

    const saleStatusRadioButtons = document.getElementsByName("saleStatus");
    for (let i = 0; i < saleStatusRadioButtons.length; i++) {
      if (saleStatusRadioButtons[i].value === data.saleStatus.toString()) {
        saleStatusRadioButtons[i].checked = true;
      }
    }

    const useStatusRadioButton = document.getElementById("useStatus");
    useStatusRadioButton.checked = data.useStatus === 0;
  } catch (error) {
    console.error("Error:", error);
    // 오류 처리
  }
};

async function postButton() {
  const main = document.querySelector("#main");
  const button = document.createElement("button");
  button.id = "postBtn";
  button.textContent = "수정하기";

  button.addEventListener("click", async () => {
    try {
      const form = document.getElementById("uploadForm");
      const formData = new FormData(form);

      // FormData 객체를 JSON 형식으로 변환
      const jsonData = {};
      formData.forEach((value, key) => {
        jsonData[key] = value;
      });

      const url = `https://www.backraffles.shop/markets/shoes/${marketId}`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 데이터 전송을 명시
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(jsonData), // JSON 형식으로 데이터 전송
      });

      if (!response.ok) {
        throw new Error("API 요청 실패");
      }

      alert("데이터가 성공적으로 전송되었습니다.");
      window.location.href = `/html/detail_market.html?shoeId=${shoeId}`;
    } catch (err) {
      console.log(err);
    }
  });

  main.appendChild(button);
}

postButton();
