import { AxiosError } from "axios";
import { axiosInstance } from "@/configs/axiosInstance";
import { authService } from "@/configs/auth";

const toError = (err) => {
  if (err instanceof AxiosError) {
    return new Error(err.response?.data?.msg || err.message);
  }
  return err instanceof Error ? err : new Error(String(err));
};

export const APIauth = {
  login: async (data) => {
    try {
      const result = await axiosInstance.post("/login", data);
      // console.log("Login response:", result);
      const { token } = result.data;
      authService.storeTokenToCookie({ token, data: result.data });
      return result.data;
    } catch (err) {
      throw toError(err);
    }
  },

  getUserLogin: async () => {
    try {
      const result = await axiosInstance.get("/get-user-login");
      return result.data;
    } catch (err) {
      throw toError(err);
    }
  },

  logout: async () => {
    try {
      const result = await axiosInstance.delete("/logout");
      return result.data;
    } catch (err) {
      throw toError(err);
    } finally {
      // cookie tetap dihapus walau request logout gagal
      authService.clearSessionIdFromCookie();
    }
  },
};
