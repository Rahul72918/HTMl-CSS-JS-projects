const api_key = API_KEY; // from your config.js
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const trendingMovieContainer = document.getElementById("trending");
const popularMovieContainer = document.getElementById("popular");
const latestMovieContainer = document.getElementById("latest");
const searchedMovie = document.querySelector(".searched");
const searchinput = document.querySelector(".input");
const searchBtn = document.getElementById("searchBtn");
const navBtn = document.getElementById("navBtn");
const navDropdown = document.querySelector(".navDropdown");

// Hide searched container initially
searchedMovie.style.display = "none";

// Nav dropdown toggle
navBtn.addEventListener("click", () => {
    navDropdown.style.display = navDropdown.style.display === "grid" ? "none" : "grid";
});

// Hide dropdown if click outside
document.addEventListener("click", (e) => {
    if (!navBtn.contains(e.target) && !navDropdown.contains(e.target)) {
        navDropdown.style.display = "none";
    }
});

// Nav dropdown navigation
document.getElementById("navTrending").addEventListener("click", () => {
    window.location.href = "categoryPage/index.html?category=trending";
});
document.getElementById("navPopular").addEventListener("click", () => {
    window.location.href = "categoryPage/index.html?category=popular";
});
document.getElementById("navLatest").addEventListener("click", () => {
    window.location.href = "categoryPage/index.html?category=latest";
});

// See All button functionality
const seeAllButtons = document.querySelectorAll(".seeAllBtn");
seeAllButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const category = btn.getAttribute("data-category");
        window.location.href = `categoryPage/index.html?category=${category}`;
    });
});

// Search functionality
async function getSearchedMovies(query) {
    try {
        const res = await fetch(`${BASE_URL}/search/movie?api_key=${api_key}&query=${encodeURIComponent(query)}`);
        const data = await res.json();

        trendingMovieContainer.style.display = "none";
        popularMovieContainer.style.display = "none";
        latestMovieContainer.style.display = "none";

        searchedMovie.style.display = "grid";

        if (!data.results || data.results.length === 0) {
            searchedMovie.innerHTML = "<p>No movies found!</p>";
            return;
        }

        showMovies(data.results, searchedMovie);
    } catch (error) {
        console.error("Error fetching searched movies:", error);
    }
}

searchBtn.addEventListener("click", () => {
    const query = searchinput.value.trim();
    if (query) getSearchedMovies(query);
});

searchinput.addEventListener("keyup", (e) => {
    const query = searchinput.value.trim();
    if (e.key === "Enter" && query) getSearchedMovies(query);
    if (query === "") {
        searchedMovie.style.display = "none";
        trendingMovieContainer.style.display = "grid";
        popularMovieContainer.style.display = "grid";
        latestMovieContainer.style.display = "grid";
    }
});

// Fetch and display movies
async function getTrendingMovies() {
    const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${api_key}`);
    const data = await res.json();
    showMovies(data.results, trendingMovieContainer);
}

async function getPopularMovies() {
    const res = await fetch(`${BASE_URL}/movie/popular?api_key=${api_key}&language=en-US&page=1`);
    const data = await res.json();
    showMovies(data.results, popularMovieContainer);
}

async function getLatestMovies() {
    const res = await fetch(`${BASE_URL}/discover/movie?api_key=${api_key}&language=en-US&sort_by=release_date.desc&page=1`);
    const data = await res.json();
    showMovies(data.results, latestMovieContainer);
}

function showMovies(movies, container) {
    container.innerHTML = "";
    movies.forEach(movie => {
        if (!movie.poster_path) return;
        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");

        movieEl.innerHTML = `
            <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average || "N/A"}</p>
        `;

        movieEl.addEventListener("click", () => {
            window.location.href = `moviedetail/movie.html?id=${movie.id}`;
        });

        container.appendChild(movieEl);
    });
}

// Initialize home sections
getTrendingMovies();
getPopularMovies();
getLatestMovies();
