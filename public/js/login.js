document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const loginButton = document.querySelector("button[type='submit']");

    if (!loginForm) {
        console.error("Login form not found!");
        return; // Stop further execution if the form is not found
    }

    if (!loginButton) {
        console.error("Login button not found!");
        return; // Stop further execution if the button is not found
    }

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Basic validation
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!validateEmail(email)) {
            showAlert("Please enter a valid email address.", "error");
            return;
        }

        if (password === "") {
            showAlert("Please enter your password.", "error");
            return;
        }

        // Disable form/submit button to prevent double submission
        loginButton.disabled = true;
        loginButton.textContent = "Logging in...";

        try {
            // Send login request to the backend
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            

            // Check if the response is not OK (status code other than 2xx)
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Login error:", errorData.message);
                alert("Login failed: " + errorData.message);
                return;
            }

            const data = await response.json();
            // If login is successful, handle redirection
            // Save the JWT token to localStorage
            localStorage.setItem("token", data.token); // Store the token

            localStorage.setItem("college", data.college);  // Optionally store the college
            // Redirect to the main page (index.html)
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000);
        } catch (error) {
            console.error("Login error:", error);
            showAlert("An error occurred. Please try again later.", "error");
        } finally {
            // Re-enable the submit button after the request
            loginButton.disabled = false;
            loginButton.textContent = "Login";
        }
    });

    // Function to validate email format
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Function to display alerts
    function showAlert(message, type) {
        // You can replace this with a custom alert modal or UI element
        alert(message); // Replace with a better UI alert for improved user experience
    }
});
