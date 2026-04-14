const API_URL = import.meta.env.VITE_API_URL;
export const addSystemConfig = async (
  system_domain,
  system_name,
  system_port,
  id,
  is_default
) => {
  const data = { system_domain, system_name, system_port, id, is_default };
  try {
    const csrfToken = sessionStorage.getItem("csrfToken");
    const response = await fetch(`${API_URL}/admin/system`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken || "",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.log(err);
  }
};

export const getSystems = async () => {
  try {
    const csrfToken = sessionStorage.getItem("csrfToken");
    const response = await fetch(`${API_URL}/admin/system`, {
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

export const addHeaders = async (Fields, Type) => {
  try {
    const csrfToken = sessionStorage.getItem("csrfToken");
    const response = await fetch(`${API_URL}/admin/Fields`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken || "",
      },
      credentials: "include",
      body: JSON.stringify({ Fields, Type }),
    });
    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.log(err);
  }
};

export const getFields = async (type) => {
  try {
    const csrfToken = sessionStorage.getItem("csrfToken");
    const response = await fetch(`${API_URL}/admin/Fields/${type}`, {
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

export const addDocType = async (documents, size) => {
  try {
    const csrfToken = sessionStorage.getItem("csrfToken");
    const response = await fetch(`${API_URL}/admin/doctype`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken || "",
      },
      credentials: "include",
      body: JSON.stringify({ documents, size }),
    });
    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.log(err);
  }
};

export const getDocType = async (documents) => {
  try {
    const csrfToken = sessionStorage.getItem("csrfToken");
    const response = await fetch(`${API_URL}/admin/doctype`, {
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

export const testConnection = async (id) => {
  try {
    const csrfToken = sessionStorage.getItem("csrfToken");
    const response = await fetch(`${API_URL}/connection/check`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken || "",
      },
      body: JSON.stringify({ id }),
    });
    const responseData = await response.json();
    if (responseData?.messageType === "S") {
    } else {
      return { messageType: "E", message: "Connection failed" };
    }
    return responseData;
  } catch (err) {
    console.log(err);
    return { messageType: "E", message: "Connection failed" };
  }
};

export const delete_systemconfig = async(id)=>{
  try{
    const csrfToken = sessionStorage.getItem("csrfToken");
    const response = await fetch(`${API_URL}/admin/system/delete`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken || "",
      },
      body: JSON.stringify({ id }),
    });
    const responseData = await response.json();
    if (responseData?.messageType === "S") {
      return {messageType:'S', message:'Data deleted successfully'}
    } else {
      return { messageType: "E", message: "Connection failed" };
    }
  }catch(err){
    console.log(err);
    return { messageType: "E", message: "Unable to delete system config, Please check with administrator" };
  }
}

export const update_other_config = async (data) => {
  try {
    const csrfToken = sessionStorage.getItem("csrfToken");
    const response = await fetch(`${API_URL}/admin/otherconfig`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken || "",
      },
      credentials: "include",
      body: JSON.stringify({ data }),
    });
    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.log(err);
  }
};

export const get_other_config = async () => {
  try {
    const csrfToken = sessionStorage.getItem("csrfToken");
    const response = await fetch(`${API_URL}/admin/otherconfig`, {
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
