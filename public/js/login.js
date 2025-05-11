document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  
  if (!loginForm) {
    console.error("Login form not found!");
    return;
  }

  // Helper function to validate email format
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  // Helper function to display alerts
  function showAlert(message, type) {
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
      <span>${message}</span>
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    `;

    const container = document.querySelector(".container"); // Or any appropriate container
    if (container) {
      container.insertBefore(alertDiv, container.firstChild);
      // Remove the alert after 5 seconds
      setTimeout(() => {
        alertDiv.remove();
      }, 5000);
    } else {
      console.warn("Container element not found. Alert not displayed.");
    }
  }

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get form values
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Basic validation
    if (!validateEmail(email)) {
      showAlert("Please enter a valid email address.", "danger");
      return;
    }

    if (password === "") {
      showAlert("Please enter your password.", "danger");
      return;
    }

    // Show loading state
    const submitButton = loginForm.querySelector("button[type='submit']");
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

    try {
      // Send login request to the backend
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if the response is not OK
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      
      // Save the JWT token to localStorage
      localStorage.setItem("token", data.token);
      
      if (data.college) {
        localStorage.setItem("college", data.college);
      }
      
      // Show success message
      showAlert("Login successful! Redirecting to homepage...", "success");
      
      // Redirect to the main page
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      showAlert(error.message || "An error occurred during login. Please try again.", "danger");
    } finally {
      // Restore button state
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  });

  // Helper functions are now in common.js
});