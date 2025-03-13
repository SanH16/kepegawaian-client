import Cookies from "js-cookie";

export class AuthService {
  isAuthorized() {
    try {
      const token = Cookies.get("token");
      if (!token) {
        return false;
      }
      return true;
    } catch (error) {
      console.error(error);
    }
  }

  validateToken() {
    try {
      const token = Cookies.get("token");
      return !!token; // biar return true kalau token ada
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  storeTokenToCookie(token) {
    Cookies.set("token", token, {
      secure: true, // Harus true karena pakai SameSite=None
      sameSite: "None",
      expires: 7, // Token bertahan 7 hari
    });
    console.log("Token stored in cookie:", token);
  }

  clearSessionIdFromCookie() {
    Cookies.remove("token");
  }

  getToken() {
    if (this.validateToken()) {
      return Cookies.get("token");
    }
    return false;
  }
}
