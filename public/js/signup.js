document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm");

    if (!signupForm) {
        console.error("Signup form not found!");
        return; // Stop further execution if the form is not found
    }

    // Get the signup button
    const signupButton = document.querySelector(".btn");

    if (!signupButton) {
        console.error("Signup button not found!");
        return;
    }

    // Add event listener for form submission
    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Get form input values
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const college = document.getElementById("college").value.trim();

        // Basic validation
        if (!validateEmail(email)) {
            showAlert("Please enter a valid email address.", "error");
            return;
        }

        if (!validatePassword(password)) {
            showAlert("Password must be at least 6 characters long.", "error");
            return;
        }

        if (!college) {
            showAlert("Please select your college.", "error");
            return;
        }

        // Disable the signup button
        signupButton.disabled = true;
        signupButton.textContent = "Signing up...";

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
                showAlert("Signup successful! Redirecting to the login page...", "success");

                // Reset form inputs
                signupForm.reset();

                // Redirect to login page after delay
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
            } else {
                showAlert(data.message || "Signup failed. Please try again.", "error");
            }
        } catch (error) {
            console.error("Signup error:", error);
            showAlert("An error occurred. Please try again later.", "error");
        } finally {
            signupButton.disabled = false;
            signupButton.textContent = "Sign Up";
        }
    });

    // Function to validate email format
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Function to validate password strength
    function validatePassword(password) {
        return password.length >= 6;
    }

    // Function to display alerts
    function showAlert(message, type) {
        // You can use custom modal or alert UI instead of default alert
        alert(message);  // Replace with custom UI alerts for better UX
    }
});
