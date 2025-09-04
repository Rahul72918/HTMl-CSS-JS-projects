const api_key = API_KEY; // from your config.js
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const moviesContainer = document.getElementById("moviesContainer");
const categoryTitle = document.getElementById("categoryTitle");

// Read category from query string
const params = new URLSearchParams(window.location.search);
const category = params.get("category") || "trending";

// Determine endpoint based on category
let endpoint = "";
if(category === "trending") endpoint = `/trending/movie/week?api_key=${api_key}`;
if(category === "popular") endpoint = `/movie/popular?api_key=${api_key}&language=en-US`;
if(category === "latest") endpoint = `/discover/movie?api_key=${api_key}&language=en-US&sort_by=release_date.desc`;

categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1) + " Movies";

// Fetch multiple pages
async function fetchMultiplePages(endpoint, totalPages = 20){
    let allMovies = [];
    for(let page = 1; page <= totalPages; page++){
        const res = await fetch(`${BASE_URL}${endpoint}&page=${page}`);
        const data = await res.json();
        allMovies = allMovies.concat(data.results);
    }
    return allMovies;
}

// Display movies
function showMovies(movies, container){
    container.innerHTML = "";
    movies.forEach(movie => {
        if(!movie.poster_path) return;

        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");

        movieEl.innerHTML = `
            <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average || "N/A"}</p>
        `;

        // Open movie detail page in sibling folder
        movieEl.addEventListener("click", () => {
            const detailPageUrl = new URL('../moviedetail/movie.html', window.location.href);
            detailPageUrl.searchParams.set('id', movie.id);
            window.location.href = detailPageUrl.href;
        });

        container.appendChild(movieEl);
    });
}

// Load all movies
async function loadCategoryMovies() {
    moviesContainer.innerHTML = "<p>Loading...</p>";
    try {
        const movies = await fetchMultiplePages(endpoint);
        showMovies(movies, moviesContainer);
    } catch (error) {
        console.error("Error fetching movies:", error);
        moviesContainer.innerHTML = "<p>Failed to load movies.</p>";
    }
}

// Initialize
loadCategoryMovies();
