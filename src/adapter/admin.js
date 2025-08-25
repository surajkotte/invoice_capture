export const addSystemConfig = async (
  system_domain,
  system_name,
  system_port
) => {
  const data = { system_domain, system_name, system_port };
  try {
    const response = await fetch("http://localhost:3000/admin/system", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
    });
    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.log(err);
  }
};
