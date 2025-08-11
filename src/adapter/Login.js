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
    console.log(console.error);
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
