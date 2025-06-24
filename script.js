const apiKey = "VUSPCMH4NQTGGERYDL6BQXVLV";
const apiUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
let lastLocation = ""; // Save the last location

async function fetchData(location) {
    const response = await fetch(`${apiUrl}${location}?unitGroup=metric&key=${apiKey}&contentType=json`);
    const data = await response.json();
    return data;
}

function displayData(data) {
    if (!data || !data.address) {
        document.getElementById("weatherDisplay").innerHTML = "<p>Error fetching weather data. Please try again.</p>";
        return;
    }

    const conditions = data.currentConditions;
    const hours = data.days[0].hours;
    lastLocation = data.address; // Save for refresh

    const display = `
        <h2><i class="fa-solid fa-location-dot"></i> Weather in ${data.address}</h2>
        <p><i class="fas fa-file-lines"></i> Description: ${data.description}</p>
        <p><i class="fa-solid fa-temperature-half"></i> Temperature: ${conditions.temp}°C</p>
        <p><i class="fa-solid fa-wind"></i> Wind Speed: ${conditions.windspeed} km/h</p>
        <p>Condition: ${conditions.conditions}</p>
        <h3><i class="fa-solid fa-clock"></i> Hourly Forecast (Prev and Future 24 hours)</h3>
        <ul>
            ${hours.map(hour => `
                <li>${hour.datetime} - ${hour.temp}°C, ${hour.conditions}</li>
            `).join('')}
        </ul>
        <button class="btn btn-primary" id="refresh-btn"><i class="fa-solid fa-rotate-right"></i> Refresh</button>
    `;

    document.getElementById("weatherDisplay").innerHTML = display;

    // Attach event listener after button is added
    document.getElementById("refresh-btn").addEventListener("click", async () => {
        const data = await fetchData(lastLocation);
        displayData(data);
    });
}

// User city input
document.getElementById("weatherForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const location = document.getElementById("cityInput").value;
    const data = await fetchData(location);
    displayData(data);
});

// Default: Geolocation-based weather
document.addEventListener("DOMContentLoaded", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const data = await fetchData(`${lat},${lon}`);
            displayData(data);
        }, (error) => {
            console.warn("Geolocation failed or denied.");
        });
    }
});
