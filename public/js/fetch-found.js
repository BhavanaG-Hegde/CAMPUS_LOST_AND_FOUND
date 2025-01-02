function fetchFoundItems(container) {
  container.innerHTML = "<p>Loading found items...</p>";

  const token = localStorage.getItem("token");  // Get token from localStorage
  
  if (!token) {
    container.innerHTML = "<p>Error: You must be logged in to view found items.</p>";
    return;
  }

  fetch("/api/found", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,  // Send the token in the Authorization header
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load found items");
      return response.json();
    })
    .then((data) => {
      container.innerHTML = "";

      if (data.length === 0) {
        container.innerHTML = "<p>No found items found.</p>";
        return;
      }

      data.forEach((item) => {
        const itemCard = document.createElement("li");
        itemCard.classList.add("menu-card");

        const imageUrl = item.image.startsWith("/uploads")
          ? item.image.replace("/uploads", "")
          : item.image;

        itemCard.innerHTML = `
          <div class="card">
            <figure class="card-banner">
              <img src="${imageUrl}" alt="${item.title}" style="width: 100%; border-radius: 8px;">
            </figure>
            <div>
              <h3>${item.title}</h3>
              <p><strong>Contact:</strong> ${item.contact}</p>
              <p><strong>Location:</strong> ${item.location}</p>
              <p>${item.description}</p>
            </div>
          </div>
        `;
        container.appendChild(itemCard);
      });
    })
    .catch((error) => {
      container.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}