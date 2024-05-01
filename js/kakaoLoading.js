const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const code = urlParams.get("code");

fetch(`https://www.backraffles.shop/kakao/oauth/kakao-auth?code=${code}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
    document.cookie = `access_token=${data.kakaoReturn.access_token}; Path=/; Secure; SameSite=None`;
  })
  .then(
    setTimeout(() => {
      window.location.href = "/";
    }, 1000)
  );
