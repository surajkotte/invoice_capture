export const Login = async (domain, port, username, password) => {
  domain = "mu2r3d53.otxlab.net";
  port = "44300";
  username = "ap_processor";
  password = "Otvim1234!";
  const urlval = "http://localhost:3000/login";
  try {
    const response = await fetch(urlval, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password, domain, port }),
    });
    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.log(err.message);
  }
};

export const signUp = async (data) => {
  const urlval = "http://localhost:3000/signup";
  try {
    const response = await fetch(urlval, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ data }),
    });
    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.log(err.message);
  }
};

export const uploadInvoice = async (formData) => {
  const response = await fetch("http://localhost:3000/upload", {
    method: "POST",
    body: formData,
  });
  const responseData = await response.json();
  return responseData;
};

export const AuthCheck = async () => {
  const urlval = "http://localhost:3000/check";
  try {
    const responsse = await fetch(urlval, {
      method: "GET",
      credentials: "include",
    });
    const responseData = await responsse.json();
    return responseData;
  } catch (err) {}
};
