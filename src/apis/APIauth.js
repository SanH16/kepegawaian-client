import { AxiosError } from "axios";
import { axiosInstance } from "@/configs/axiosInstance";
import { authService } from "@/configs/auth";

export const APIauth = {
  login: async (data) => {
    try {
      const result = await axiosInstance.post("/login", data);
      console.log("Login response:", result);

      // if (!result.data.token) {
      //   throw new Error("Token is missing in response");
      // }
      // // simpan token ke cookie setelah login berhasil
      const { token } = result.data.response;
      authService.storeTokenToCookie({ token });

      return result.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        const { message } = err.response.data.msg;
        throw new AxiosError(message);
      }
      throw new Error(err);
    }
  },

  getUserLogin: async () => {
    try {
      const result = await axiosInstance.get("/get-user-login");
      console.log("data user login: ", result.data);
      return result.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        const { message } = err.response.data.msg;
        throw new AxiosError(message);
      }
      throw new Error(err);
    }
  },
  logout: async () => {
    try {
      const result = await axiosInstance.delete("/logout");
      console.log("Logout response:", result);

      // 🔥 Hapus token dari cookie saat logout
      authService.clearSessionIdFromCookie();

      return result.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        const { message } = err.response.data.msg;
        throw new AxiosError(message);
      }
      throw new Error(err);
    }
  },
};
