// app.js

document.addEventListener("DOMContentLoaded", function () {
    // Initialize the map
    const map = L.map('map').setView([20, 80], 5); // Centered over India with a zoom level of 5

    // Add a tile layer from OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Function to fetch heatmap data
    const fetchHeatmapData = async () => {
        try {
            const response = await fetch('/api/heatmap'); // Fetch data from your API
            const data = await response.json();

            // Prepare data for the heatmap
            const heatmapData = data.map(item => {
                return [item.lat, item.lon, item.rape + item.murder + item.kidnapping]; // Combine values for heat intensity
            });

            // Create a heatmap layer
            const heat = L.heatLayer(heatmapData, { radius: 25 }).addTo(map); // Add heatmap to the map
        } catch (error) {
            console.error('Error fetching heatmap data:', error); // Handle errors
        }
    };

    // Call the function to fetch and display the heatmap data
    fetchHeatmapData();
});
