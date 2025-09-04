const api_key = API_KEY; // from config.js
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const movieId = new URLSearchParams(window.location.search).get("id");

// Fetch movie details, trailer, and cast
async function getMovieDetails(id) {
    try {
        const [resMovie, resVideos, resCredits] = await Promise.all([
            fetch(`${BASE_URL}/movie/${id}?api_key=${api_key}&language=en-US`),
            fetch(`${BASE_URL}/movie/${id}/videos?api_key=${api_key}&language=en-US`),
            fetch(`${BASE_URL}/movie/${id}/credits?api_key=${api_key}`)
        ]);

        const movie = await resMovie.json();
        const videos = await resVideos.json();
        const credits = await resCredits.json();

        const trailer = videos.results.find(v => v.type === "Trailer" && v.site === "YouTube");
        const cast = credits.cast.slice(0, 6); // Top 6 cast

        displayMovieDetails(movie, trailer, cast);

    } catch (error) {
        console.error("Error fetching movie details:", error);
        document.getElementById("movie-details").innerHTML = "<p>Error loading movie details.</p>";
    }
}

// Populate movie details
function displayMovieDetails(movie, trailer, cast) {
    document.getElementById("movie-poster").src = movie.poster_path ? IMG_URL + movie.poster_path : "placeholder.jpg";
    document.getElementById("movie-title").textContent = movie.title;
    document.getElementById("movie-release").textContent = movie.release_date || "N/A";
    document.getElementById("movie-genres").textContent = movie.genres.map(g => g.name).join(', ');
    document.getElementById("movie-rating").textContent = `⭐ ${movie.vote_average || "N/A"}`;
    document.getElementById("movie-overview").textContent = movie.overview || "No synopsis available.";

    const trailerIframe = document.getElementById("movie-trailer");
    if (trailer) {
        trailerIframe.src = `https://www.youtube.com/embed/${trailer.key}`;
    } else {
        trailerIframe.style.display = "none";
    }

    displayCast(cast);
}

// Display cast dynamically
async function displayCast(cast) {
    const castContainer = document.getElementById("cast-container");
    castContainer.innerHTML = '<h2>Cast:</h2>'; // reset

    for (let actor of cast) {
        const castImage = actor.profile_path ? IMG_URL + actor.profile_path : 'placeholder_cast.jpg';
        const actorEl = document.createElement("div");
        actorEl.classList.add("cast-member");
        actorEl.innerHTML = `
            <img src="${castImage}" alt="${actor.name}">
            <p>${actor.name}</p>
            <p>as ${actor.character}</p>
        `;
        castContainer.appendChild(actorEl);
    }
}

getMovieDetails(movieId);
