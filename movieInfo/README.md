# MovieInfo Project

This is a movie information application that fetches data from a movie API.

## Setup Instructions

### API Key Configuration

To run this application, you need to add your own API key:

1. Create a `config.js` file in the movieInfo directory
2. Add your API key in the following format:

```javascript
const API_KEY = "your_api_key_here";
export { API_KEY };
```

**Note:** The `config.js` file is ignored by git for security reasons. Never commit your actual API key to the repository.

### Getting an API Key

You can obtain a free API key from [The Movie Database (TMDb)](https://www.themoviedb.org/settings/api) or similar movie API services.

### Running the Application

1. Ensure you have set up your `config.js` file with your API key
2. Open `index.html` in your web browser
3. Start exploring movie information!

## Project Structure

- `index.html` - Main HTML file
- `script.js` - JavaScript functionality
- `style.css` - Styling
- `config.js` - API configuration (create this file)
- `categorypage/` - Category browsing functionality
- `moviedetail/` - Individual movie details functionality
