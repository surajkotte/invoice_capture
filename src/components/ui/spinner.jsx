const Spinner = () => {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // Takes up the full viewport height to center it perfectly
    width: "100%",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid #f3f3f3", // Light grey background border
    borderTop: "5px solid #3498db", // Blue spinning border (change to your brand color)
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default Spinner;