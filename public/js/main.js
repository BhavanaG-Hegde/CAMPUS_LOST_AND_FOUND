import { fetchLostItems } from "./fetch-lost.js";
import { fetchFoundItems } from "./fetch-found.js";

document.addEventListener("DOMContentLoaded", () => {
  const lostButton = document.getElementById("lost-button");
  const foundButton = document.getElementById("found-button");
  const searchButton = document.getElementById("search-button");
  const itemsList = document.getElementById("items-list");
  const recentItemsContainer = document.getElementById("recent-items-container");

  /**
   * Function to handle lost items button click
   */
  function loadLostItems() {
    lostButton.classList.add("active");
    foundButton.classList.remove("active");
    itemsList.innerHTML = ""; // Clear previous content
    fetchLostItems(itemsList);
  }

  /**
   * Function to handle found items button click
   */
  function loadFoundItems() {
    foundButton.classList.add("active");
    lostButton.classList.remove("active");
    itemsList.innerHTML = ""; // Clear previous content
    fetchFoundItems(itemsList);
  }

  /**
   * Function to fetch and display recent items
   */
  function loadRecentItems() {
    fetch("/api/recent")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch recent items");
        }
        return response.json();
      })
      .then((items) => {
        recentItemsContainer.innerHTML = ""; // Clear the container

        if (items.length === 0) {
          recentItemsContainer.innerHTML = "<p>No recent items found.</p>";
          return;
        }

        // Populate recent items
        items.forEach((item) => {
          const itemDiv = document.createElement("div");
          itemDiv.classList.add("recent-item");

          itemDiv.innerHTML = `
            <div>
              <img 
                src="${item.image || '/uploads/default-image.jpg'}" 
                alt="${item.title || 'No Title'}" 
                onerror="this.src='/uploads/default-image.jpg'" 
                style="width: 100%; border-radius: 8px;">
              <p><strong>Title:</strong> ${item.title || "No Title"}</p>
              <p><strong>Location:</strong> ${item.location || "Unknown"}</p>
            </div>
          `;
          recentItemsContainer.appendChild(itemDiv);
        });
      })
      .catch((error) => {
        console.error("Error fetching recent items:", error);
        recentItemsContainer.innerHTML = "<p>Error loading recent items.</p>";
      });
  }

  /**
   * Event listeners for navigation buttons
   */
  lostButton.addEventListener("click", loadLostItems);
  foundButton.addEventListener("click", loadFoundItems);
  searchButton.addEventListener("click", () => {
    window.location.href = "search.html";
  });

  // Load lost items and recent items by default on page load
  loadLostItems();
  loadRecentItems();
});
