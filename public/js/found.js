document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#foundForm");
  const feedback = document.querySelector("#feedback");

  if (!form || !feedback) {
    console.error("Form or feedback element not found");
    return;
  }

  // Check if user is logged in
  const token = localStorage.getItem("token");
  if (!token) {
    form.innerHTML = `
      <div class="alert alert-warning">
        <i class="fas fa-exclamation-triangle"></i> You need to be logged in to report a found item.
        <div class="mt-3">
          <a href="login.html" class="btn btn-primary">Login</a>
          <a href="signup.html" class="btn btn-outline">Sign Up</a>
        </div>
      </div>
    `;
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Show loading state
    const submitButton = form.querySelector("button[type='submit']");
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    // Hide previous feedback
    feedback.style.display = "none";
    
    // Collect form data
    const formData = new FormData(form);

    try {
      // Send data to the backend API with the Authorization token
      const response = await fetch("/api/found", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        // Show success message
        feedback.className = "alert alert-success";
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Found item reported successfully!';
        feedback.style.display = "block";
        
        // Reset the form
        form.reset();
        
        // Redirect after a delay
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to report found item.");
      }
    } catch (error) {
      console.error(error.message);
      
      // Show error message
      feedback.className = "alert alert-danger";
      feedback.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${error.message || "An error occurred. Please try again later."}`;
      feedback.style.display = "block";
    } finally {
      // Restore button state
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
      
      // Scroll to feedback
      feedback.scrollIntoView({ behavior: 'smooth' });
    }
  });
});