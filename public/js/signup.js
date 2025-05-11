document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");

  if (!signupForm) {
    console.error("Signup form not found!");
    return;
  }

  // Helper functions
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePassword(password) {
    return password.length >= 6;
  }

  function showAlert(message, type) {
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    `;
    const container = document.querySelector(".container"); // Or any appropriate container
    container.insertBefore(alertDiv, signupForm); // Insert before the form
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

    if (!validatePassword(password)) {
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
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing up...';

    try {
      // Send signup request to the backend
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, college }),
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message
        showAlert("Signup successful! Redirecting to the login page...", "success");
        
        // Reset form
        signupForm.reset();
        
        // Redirect to login page after delay
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      } else {
        throw new Error(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      showAlert(error.message || "An error occurred. Please try again later.", "danger");
    } finally {
      // Restore button state
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  });

  // Helper functions are now in common.js
});