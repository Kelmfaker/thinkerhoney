// login.js

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form from refreshing the page

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      // Send a POST request to the backend
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Login failed");
        return;
      }

      const data = await response.json();

      // Store JWT token securely
      localStorage.setItem("token", data.token);

      // Redirect based on role
      if (data.role === "admin") {
        window.location.href = "/public/confirm.html";
      } else if (data.role === "client") {
        window.location.href = "/public/cart.html";
      } else {
        alert("Unknown role: " + data.role);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred. Please try again.");
    }
  });
});
