export const Login = async (email, password) => {
  const urlval = "http://localhost:3000/login";
  try {
    const response = await fetch(urlval, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.log(err.message);
  }
};

export const SignUp = async (data) => {
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
    credentials: "include",
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

export const Logout = async () => {
  const urlval = "http://localhost:3000/logout";
  try {
    const response = await fetch(urlval, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.log(err.message);
  }
};
