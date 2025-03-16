import { AxiosError } from "axios";
import { axiosInstance } from "@/configs/axiosInstance";
import { showSuccessToast } from "@/components/shared-components/Toast";

// Helper function untuk membuat FormData
const createFormDataFromObject = (data) => {
  const formData = new FormData();

  // Handle file khusus untuk image_rekrutmen
  if (data.image_rekrutmen) {
    if (data.image_rekrutmen instanceof File) {
      formData.append("image_rekrutmen", data.image_rekrutmen);
    } else if (
      typeof data.image_rekrutmen === "string" &&
      data.image_rekrutmen.startsWith("data:image")
    ) {
      // Skip if it's a base64 image and no new file was uploaded
      return null;
    }
  }

  // Handle data lainnya
  Object.keys(data).forEach((key) => {
    if (key !== "image_rekrutmen") {
      formData.append(key, data[key]);
    }
  });

  return formData;
};

export const APIrekrutmen = {
  getAllRekrutmens: async () => {
    try {
      const result = await axiosInstance.get("/rekrutmens");
      console.log("data rekrutmen", result);
      return result.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        const { message } = err;
        throw new AxiosError(message);
      }
      throw new Error(err);
    }
  },

  getRekrutmenById: async (id) => {
    try {
      const result = await axiosInstance.get(`/rekrutmens/${id}`);
      console.log("detail rekrutmen", result);
      return result.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        const { message } = err;
        throw new AxiosError(message);
      }
      throw new Error(err);
    }
  },

  updateRekrutmen: async (id, data) => {
    try {
      const formData = createFormDataFromObject(data);
      const result = await axiosInstance.patch(`/rekrutmens/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("update rekrutmen", result);
      return result.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        const { message } = err;
        throw new AxiosError(message);
      }
      throw new Error(err);
    }
  },

  createRekrutmen: async (data) => {
    try {
      const formData = createFormDataFromObject(data);
      const result = await axiosInstance.post("/rekrutmens", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("rekrutmen dibuat", result);
      return result.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        const { message } = err;
        throw new AxiosError(message);
      }
      throw new Error(err);
    }
  },

  deleteRekrutmen: async (id) => {
    try {
      const result = await axiosInstance.delete(`/rekrutmens/${id}`);
      showSuccessToast("Lowongan berhasil dihapus", "top-center", "large");
      return result.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const { response } = error;
        throw new AxiosError(response);
      }
      throw new Error(error);
    }
  },
};
