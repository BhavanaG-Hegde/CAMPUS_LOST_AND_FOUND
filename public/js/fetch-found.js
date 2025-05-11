function fetchFoundItems(container) {
  const token = localStorage.getItem("token");
  
  if (!token) {
    container.innerHTML = `
  <div style="display: flex; flex-direction: column; align-items: center; width: 100%; margin-top: 2rem;">
    <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Recent Items</h2>
    <div class="items-empty" style="text-align: center; background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      <i class="fas fa-search items-empty-icon" style="font-size: 2rem; color: gray;"></i>
      <h3 class="items-empty-text" style="margin-top: 1rem;">No lost items found.</h3>
      <div style="margin-top: 1.5rem;">
        <a href="report-lost.html" class="btn btn-primary" style="padding: 0.5rem 1rem; background: #6200ea; color: white; border-radius: 6px; text-decoration: none;">Report a Lost Item</a>
      </div>
    </div>
  </div>
`;




    return;
  }

  fetch("/api/found", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load found items");
      return response.json();
    })
    .then((data) => {
      if (data.length === 0) {
        container.innerHTML = `
          <div class="items-empty">
            <i class="fas fa-search items-empty-icon"></i>
            <h3 class="items-empty-text">No found items found.</h3>
            <a href="report-found.html" class="btn btn-primary">Report a Found Item</a>
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
            <span class="item-status item-status-found">Found</span>
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
          <button class="btn btn-primary" onclick="fetchFoundItems(document.getElementById('items-list'))">
            Try Again
          </button>
        </div>
      `;
    });
}