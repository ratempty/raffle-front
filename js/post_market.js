const MAX_FILE_INPUTS = 5; // 최대 파일 입력 요소 수
const access_token = getAccessTokenFromCookie();
const shoeId = localStorage.getItem("shoeId");

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

postLogin();

document
  .getElementById("addFileButton")
  .addEventListener("click", function (event) {
    event.preventDefault(); // 기본 동작인 form의 submit 막기

    const fileInputsContainer = document.getElementById("fileInputs");
    const fileInputs =
      fileInputsContainer.querySelectorAll('input[type="file"]');

    // 파일 입력 요소 수가 최대값보다 작을 때만 새로운 파일 입력 요소를 추가
    if (fileInputs.length < MAX_FILE_INPUTS) {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.name = "imgUrl";
      fileInputsContainer.appendChild(fileInput);
    } else {
      alert("업로드 가능한 이미지 개수는 최대 5개입니다.");
    }
  });

async function postButton() {
  const main = document.querySelector("#main");
  const button = document.createElement("button");
  button.id = "postBtn";
  button.textContent = "업로드";

  button.addEventListener("click", async () => {
    try {
      const form = document.getElementById("uploadForm");
      const formData = new FormData(form);

      const url = `https://www.backraffles.shop/markets/${shoeId}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        body: formData, // FormData 객체를 그대로 전달
      });

      if (!response.ok) {
        throw new Error("API 요청 실패");
      }

      alert("데이터가 성공적으로 전송되었습니다.");
      window.location.href = `/html/detail_market.html?shoeId=${shoeId}`;
    } catch (err) {
      alert("제목, 사이즈, 가격, 이미지, 내용을 빠짐없이 입력해주세요.");
    }
  });

  main.appendChild(button);
}

postButton();
