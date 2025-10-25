const API_URL = import.meta.env.VITE_API_URL;
export const getFields = async () => {
  try {
    const response = await fetch(`${API_URL}/admin/Fields`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.log(err);
  }
};

export const submitData = async (data, backendSystem) => {
  try {
    const response = await fetch(`${API_URL}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: { ...data },
        domain: backendSystem?.system_domain,
        port: backendSystem?.system_port,
      }),
      credentials: "include",
    });
    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.log(err);
  }
};

export const getData = async (currentPage) => {
  try {
    const response = await fetch(`${API_URL}/data?page=${currentPage}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
  const response = await fetch(`${API_URL}/prompt`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  const responseData = await response.json();
  return responseData;
};

export const postMessages = async (filename, message) => {
  try {
    const response = await fetch(`${API_URL}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: filename,
        message: message,
      }),
      credentials: "include",
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
