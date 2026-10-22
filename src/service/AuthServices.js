import Cookies from "js-cookie";

const TOKEN_KEY = "auth_token";
const isHttps = window.location.protocol === "https:";
export class AuthService {
  isAuthorized() {
    return !!Cookies.get(TOKEN_KEY);
  }

  validateToken() {
    return !!Cookies.get(TOKEN_KEY);
  }

  storeTokenToCookie({ token, data }) {
    if (!token) {
      console.error("Token is undefined or null!");
      return;
    }

    Cookies.set(TOKEN_KEY, token, {
      secure: isHttps,
      sameSite: isHttps ? "None" : "Lax",
      expires: 1, // exp 1 hari
    });
    localStorage.setItem("data", JSON.stringify(data));
  }

  clearSessionIdFromCookie() {
    Cookies.remove(TOKEN_KEY);
  }

  getToken() {
    return Cookies.get(TOKEN_KEY) || false;
  }
}
