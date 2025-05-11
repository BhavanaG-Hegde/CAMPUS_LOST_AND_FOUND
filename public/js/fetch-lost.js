function fetchLostItems(container) {
  const token = localStorage.getItem("token");
  
  if (!token) {
    container.innerHTML = `
      <div class="items-empty">
        <i class="fas fa-exclamation-triangle items-empty-icon"></i>
        <h3 class="items-empty-text">You must be logged in to view lost items.</h3>
        <div>
          <a href="login.html" class="btn btn-primary">Login</a>
          <a href="signup.html" class="btn btn-outline">Sign Up</a>
        </div>
      </div>
    `;
    return;
  }

  fetch("/api/lost", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error(`Failed to load lost items (Status: ${response.status})`);
      return response.json();
    })
    .then((data) => {
      if (data.length === 0) {
        container.innerHTML = `
          <div class="items-empty">
            <i class="fas fa-search items-empty-icon"></i>
            <h3 class="items-empty-text">No lost items found.</h3>
            <a href="report-lost.html" class="btn btn-primary">Report a Lost Item</a>
          </div>
        `;
        return;
      }

      // Clear the container
      container.innerHTML = "";
      
      // Create a grid for the items
      data.forEach((item) => {
        const imageUrl = item.image.startsWith("/uploads")
          ? item.image.replace("/uploads", "")
          : item.image;

        const itemCard = document.createElement("div");
        itemCard.className = "item-card";
        
        itemCard.innerHTML = `
          <div class="item-image">
            <img src="${imageUrl}" alt="${item.title}" loading="lazy">
          </div>
          <div class="item-body">
            <h3 class="item-title">${item.title}</h3>
            <span class="item-status item-status-lost">Lost</span>
            <p class="item-description">${item.description}</p>
            <div class="item-details">
              <div class="item-location">
                <i class="fas fa-map-marker-alt item-icon"></i>
                <span>${item.location}</span>
              </div>
              <div class="item-contact">
                <i class="fas fa-phone item-icon"></i>
                <span>${item.contact}</span>
              </div>
            </div>
          </div>
        `;
        
        container.appendChild(itemCard);
      });
    })
    .catch((error) => {
      console.error("Fetch Error:", error.message);
      container.innerHTML = `
        <div class="items-empty">
          <i class="fas fa-exclamation-circle items-empty-icon"></i>
          <h3 class="items-empty-text">Error: ${error.message}</h3>
          <button class="btn btn-primary" onclick="fetchLostItems(document.getElementById('items-list'))">
            Try Again
          </button>
        </div>
      `;
    });
}