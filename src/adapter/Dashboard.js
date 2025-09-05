export const getFields = async () => {
  try {
    const response = await fetch("http://localhost:3000/admin/Fields", {
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
    const response = await fetch("http://localhost:3000/submit", {
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

export const getData = async () => {
  try {
    const response = await fetch("http://localhost:3000/data", {
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
