const API_URL = import.meta.env.VITE_API_URL;

export const getusermanagement = async () => {
  try {
    const csrfToken = sessionStorage.getItem("csrfToken");
    const response = await fetch(`${API_URL}/administration/user_management`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken || "",
      },
      credentials: "include",
    });
    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.log(err);
  }
};
