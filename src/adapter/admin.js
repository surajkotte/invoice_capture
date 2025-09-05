export const addSystemConfig = async (
  system_domain,
  system_name,
  system_port,
  id
) => {
  const data = { system_domain, system_name, system_port, id };
  try {
    const response = await fetch("http://localhost:3000/admin/system", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    const response = await fetch("http://localhost:3000/admin/system", {
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

export const addHeaders = async (Fields, Type) => {
  try {
    const response = await fetch("http://localhost:3000/admin/Fields", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    const response = await fetch(`http://localhost:3000/admin/Fields/${type}`, {
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

export const addDocType = async (documents, size) => {
  try {
    const response = await fetch("http://localhost:3000/admin/doctype", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    const response = await fetch("http://localhost:3000/admin/doctype", {
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

export const testConnection = async (domain, port) => {
  try {
    const response = await fetch(`http://localhost:3000/connection/check`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ domain, port }),
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
