export const CONST = {
  BASE_URL_API: `${import.meta.env.VITE_APP_BASE_URL}`,
};

export const imageUrl = (filename) =>
  filename ? `${CONST.BASE_URL_API}/images/${filename}` : undefined;
