function fetchLostItems(container) {
  container.innerHTML = "<p>Loading lost items...</p>";

  const token = localStorage.getItem("token");  // Get token from localStorage

  if (!token) {
    container.innerHTML = "<p>Error: You must be logged in to view lost items.</p>";
    return;
  }

  fetch("/api/lost", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,  // Send the token in the Authorization header
    },
  })
    .then((response) => {
      console.log("Response Status:", response.status); // Log status
      if (!response.ok) throw new Error(`Failed to load lost items (Status: ${response.status})`);
      return response.json();
    })
    .then((data) => {
      container.innerHTML = "";

      if (data.length === 0) {
        container.innerHTML = "<p>No lost items found.</p>";
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
      console.error("Fetch Error:", error.message); // Log detailed error
    container.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}