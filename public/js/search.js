document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.querySelector("#searchForm");
  const resultsDiv = document.querySelector("#results");

  if (!searchForm || !resultsDiv) {
    console.error("Search form or results container not found in the DOM.");
    return;
  }

  // Function to display alerts
  function showAlert(message, type) {
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
      <i class="fas fa-exclamation-triangle"></i> ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    resultsDiv.prepend(alertDiv); // Or append, depending on desired placement
  }

  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = searchForm.querySelector("input[name='query']").value.trim();

    if (!query) {
      showAlert("Please enter a keyword to search.", "warning");
      return;
    }

    // Get the JWT token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      showAlert("You need to be logged in to search.", "warning");
      
      // Show login/signup buttons
      resultsDiv.innerHTML = `
        <div class="col-12 text-center">
          <div class="alert alert-warning">
            <i class="fas fa-exclamation-triangle"></i> You must be logged in to search for items.
            <div class="mt-3">
              <a href="login.html" class="btn btn-primary">Login</a>
              <a href="signup.html" class="btn btn-outline">Sign Up</a>
            </div>
          </div>
        </div>
      `;
      return;
    }

    // Show loading state
    resultsDiv.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="spinner"></div>
        <p class="mt-3">Searching for "${query}"...</p>
      </div>
    `;

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ keyword: query }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch search results.");
      }

      const items = await response.json();

      if (items.length === 0) {
        resultsDiv.innerHTML = `
          <div class="col-12 text-center py-5">
            <i class="fas fa-search fa-3x text-muted mb-3"></i>
            <h3>No Results Found</h3>
            <p class="text-muted">No items match your search for "${query}"</p>
            <div class="mt-4">
              <a href="report-lost.html" class="btn btn-primary">Report a Lost Item</a>
              <a href="report-found.html" class="btn btn-outline">Report a Found Item</a>
            </div>
          </div>
        `;
        return;
      }

      // Clear previous results
      resultsDiv.innerHTML = "";
      
      // Display search results count
      const resultsHeader = document.createElement("div");
      resultsHeader.className = "col-12 mb-4";
      resultsHeader.innerHTML = `
        <h3>Search Results for "${query}"</h3>
        <p>${items.length} item${items.length !== 1 ? 's' : ''} found</p>
      `;
      resultsDiv.appendChild(resultsHeader);
      
      // Create a grid for the items
      const resultsGrid = document.createElement("div");
      resultsGrid.className = "items-grid";
      
      items.forEach((item) => {
        const itemCard = document.createElement("div");
        itemCard.className = "card h-100";
        
        const statusClass = item.status.toLowerCase() === "lost" ? "bg-danger" : "bg-success";
        
        itemCard.innerHTML = `
          <div class="card-img-container">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" class="card-img">` : 
            `<div class="card-img bg-light d-flex justify-content-center align-items-center">
              <i class="fas fa-image fa-3x text-muted"></i>
            </div>`}
          </div>
          <div class="card-body">
            <h3 class="card-title">${item.name}</h3>
            <div class="mb-3">
              <span class="badge ${statusClass}">${item.status}</span>
              ${item.category ? `<span class="badge bg-secondary">${item.category}</span>` : ''}
            </div>
            <p class="card-text">${item.description}</p>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <div><i class="fas fa-map-marker-alt text-primary"></i> ${item.location}</div>
              <div><i class="fas fa-phone text-primary"></i> ${item.contact}</div>
            </div>
          </div>
        `;
        
        resultsGrid.appendChild(itemCard);
      });
      
      resultsDiv.appendChild(resultsGrid);
    } catch (error) {
      console.error("Error fetching search results:", error);
      resultsDiv.innerHTML = `
        <div class="col-12 text-center">
          <div class="alert alert-danger">
            <i class="fas fa-exclamation-circle"></i> Error: ${error.message}
            <div class="mt-3">
              <button class="btn btn-primary" onclick="document.getElementById('search-button').click()">
                Try Again
              </button>
            </div>
          </div>
        </div>
      `;
    }
  });
});