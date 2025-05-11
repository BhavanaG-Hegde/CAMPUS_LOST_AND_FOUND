document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");

  if (!signupForm) {
    console.error("Signup form not found!");
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

    const container = document.querySelector(".container");
    if (container) {
      container.insertBefore(alertDiv, container.firstChild);
      // Auto remove after 5 seconds
      setTimeout(() => {
        alertDiv.remove();
      }, 5000);
    } else {
      console.warn("Container element not found. Alert not displayed.");
    }
  }

  signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get form values
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const college = document.getElementById("college").value.trim();

    // Basic validation
    if (!validateEmail(email)) {
      showAlert("Please enter a valid email address.", "danger");
      return;
    }

    if (password.length < 6) {
      showAlert("Password must be at least 6 characters long.", "danger");
      return;
    }

    if (!college) {
      showAlert("Please select your college.", "danger");
      return;
    }

    // Show loading state
    const submitButton = signupForm.querySelector("button[type='submit']");
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Signing up...';

    try {
      // Send signup request to backend
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, college }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed. Please try again.");
      }

      // Show success alert
      showAlert("Signup successful! Redirecting to login page...", "success");

      // Reset form
      signupForm.reset();

      // Redirect after delay
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    } catch (error) {
      console.error("Signup error:", error);
      showAlert(
        error.message || "An error occurred. Please try again later.",
        "danger"
      );
    } finally {
      // Restore button
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  });

  // Note: Helper functions should also be available in common.js
});
