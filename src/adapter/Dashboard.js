const API_URL = import.meta.env.VITE_API_URL;
export const getFields = async () => {
  try {
    const csrfToken = sessionStorage.getItem("csrfToken");
    const response = await fetch(`${API_URL}/admin/Fields`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken || "",
      },
    });
    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.log(err);
  }
};

export const submitData = async (data, backendSystem, sceTemplate) => {
  try {
    const csrfToken = sessionStorage.getItem("csrfToken");
    const response = await fetch(`${API_URL}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken || "",
      },
      body: JSON.stringify({
        data: { ...data },
        domain: backendSystem?.system_domain,
        port: backendSystem?.system_port,
        sceTemplate: sceTemplate,
      }),
      credentials: "include",
    });
    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.log(err);
  }
};

// export const getData = async (currentPage, filters = {}) => {
//   try {
//     const csrfToken = sessionStorage?.getItem("csrfToken") || "";
//     console.log("csrfToken:", csrfToken);
//     const response = await fetch(`${API_URL}/data?page=${currentPage}&filters=${JSON.stringify(filters)}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "X-CSRF-Token": csrfToken,
//       },
//       credentials: "include",
//     });
//     const responseData = await response.json();
//     return responseData;
//   } catch (err) {
//     console.log(err);
//   }
// };
export const getData = async (currentPage, filters = {}) => {
  try {
    const csrfToken = sessionStorage?.getItem("csrfToken") || "";
    const params = new URLSearchParams({
      page: currentPage,
      filters: JSON.stringify(filters),
    });
    const url = `${API_URL}/data?${params.toString()}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      credentials: "include",
    });

    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.log(err);
  }
};
export const uploadInvoicePrompt = async (formData) => {
  const csrfToken = sessionStorage.getItem("csrfToken");
  const response = await fetch(`${API_URL}/prompt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken || "",
    },
    body: JSON.stringify({ ...formData }),
    credentials: "include",
  });
  const responseData = await response.json();
  return responseData;
};

export const postMessages = async (filename, message, session_id) => {
  try {
    const csrfToken = sessionStorage.getItem("csrfToken");
    const response = await fetch(`${API_URL}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken || "",
      },
      body: JSON.stringify({
        filename: filename,
        message: message,
        session_doc_id: session_id,
      }),
      credentials: "include",
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
  }
};

export const savePrompt = async (prompt, filename) => {
  try {
    const csrfToken = sessionStorage.getItem("csrfToken");
    const response = await fetch(`${API_URL}/save/prompt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken || "",
      },
      body: JSON.stringify({
        prompt: prompt,
        filename: filename,
      }),
      credentials: "include",
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
  }
};

export const getLogs = async () => {
  try {
    const csrfToken = sessionStorage.getItem("csrfToken");
    const response = await fetch(`${API_URL}/analytics/logs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken || "",
      },
      credentials: "include",
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    return { messageType: "E", message: error.message };
  }
};

export const setUserSettings = async (settings) => {
  try {
    const csrfToken = sessionStorage.getItem("csrfToken");
    const response = await fetch(`${API_URL}/user/settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken || "",
      },
      body: JSON.stringify(settings),
      credentials: "include",
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    return { messageType: "E", message: error.message };
  }
};
