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
