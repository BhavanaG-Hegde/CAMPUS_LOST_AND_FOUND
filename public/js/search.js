document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.querySelector("#searchForm");
  const resultsDiv = document.querySelector("#results");

  if (!searchForm || !resultsDiv) {
    console.error("Search form or results container not found in the DOM.");
    return;
  }

  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission

    const query = searchForm.querySelector("input[name='query']").value.trim();
    // const category = searchForm.querySelector("select[name='category']").value;

    if (!query) {
      alert("Please enter a keyword to search.");
      return;
    }

    // Get the JWT token from localStorage or wherever you have stored it
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

    if (!token) {
      alert("You need to be logged in to search.");
      return;
    }

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify({ keyword: query }),
      });

      if (response.ok) {
        const items = await response.json();
        resultsDiv.innerHTML = ""; // Clear previous results

        if (items.length > 0) {
          items.forEach((item) => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("item");

            itemDiv.innerHTML = `
              <div class="card">
                <figure class="card-banner">
                  ${
                    item.image
                      ? `<img src="${item.image}" alt="${item.name}" style="width: 100%; border-radius: 8px;" />`
                      : ""
                  }
                </figure>
                <div>
                  <h3>${item.name}</h3>
                  <p style="text-align: center; font-weight: bold;">${
                    item.description
                  }</p>
                  <br>
                  <p><strong>Category:</strong> ${item.category}</p>
                  <p><strong>Status:</strong> ${item.status}</p>
                  <p><strong>Location:</strong> ${item.location}</p>
                  <p><strong>Contact:</strong> ${item.contact}</p>
                </div>
              </div>
            `;

            resultsDiv.appendChild(itemDiv);
          });
        } else {
          resultsDiv.innerHTML =
            "<p style='font-size: 2rem;'>No matching items found.</p>";
          for (let i = 0; i < 15; i++) {
            resultsDiv.innerHTML += "<br>";
          }
        }
      } else {
        throw new Error("Failed to fetch search results.");
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      alert(
        "An error occurred while fetching results. Please try again later."
      );
    }
  });
});
