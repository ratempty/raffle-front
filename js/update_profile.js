const userId = localStorage.getItem("userId");
const access_token = getAccessTokenFromCookie();

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

const getProfile = async () => {
  const url = `https://www.backraffles.shop/user/profile/${userId}`;
  const requestData = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url, requestData);

    if (!response.ok) {
      throw new Error("API 요청 실패");
    }
    const data = await response.json();
    console.log(data);
    // 게시글 정보를 폼에 채우기
    document.getElementById("email").value = data.email;
    document.getElementById("nickName").value = data.nickName;
    document.getElementById("name").value = data.name;
  } catch (error) {
    console.log(error);
  }
};

getProfile();

async function postButton() {
  const main = document.querySelector("#main");
  const button = document.createElement("button");
  button.id = "profileBtn";
  button.textContent = "수정하기";

  button.addEventListener("click", async () => {
    try {
      const form = document.getElementById("updateprofile-form");
      const formData = new FormData(form);

      // FormData 객체를 JSON 형식으로 변환
      const jsonData = {};
      formData.forEach((value, key) => {
        jsonData[key] = value;
      });

      const url = `https://www.backraffles.shop/user/profile/${userId}`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) {
        throw new Error("API 요청 실패");
      }

      alert("데이터가 성공적으로 전송되었습니다.");
      window.location.href = `/html/myPage.html`;
    } catch (err) {
      console.log(err);
    }
  });
  main.appendChild(button);
}
postButton();
