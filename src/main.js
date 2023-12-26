const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY,
    }
})

function createMovies(movies, container) {
    container.innerHTML = ''

    movies.forEach(movie => {
        const movieContainer = document.createElement('div')
        movieContainer.classList.add('movie-container')
        movieContainer.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id
        })

        const movieImg = document.createElement('img')
        movieImg.classList.add('movie-img')
        movieImg.setAttribute('alt', movie.title)
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path)

        movieContainer.appendChild(movieImg)
        container.appendChild(movieContainer)
    });
}

function createCategories(categories, container) {
    container.innerHTML = ''

    categories.forEach(category => {

        const categoryContainer = document.createElement('div')
        categoryContainer.classList.add('category-container')

        const categoryTiltle = document.createElement('h3')
        categoryTiltle.classList.add('category-title')
        categoryTiltle.setAttribute('id', 'id' + category.id)

        categoryTiltle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`
        })

        const categoryTitleText = document.createTextNode(category.name) 

        categoryTiltle.appendChild(categoryTitleText)
        categoryContainer.appendChild(categoryTiltle)
        container.appendChild(categoryContainer)
    });
}

async function getTrendingMoviesPreview() {
    const { data } = await api('/trending/movie/day')

    const movies = data.results

    createMovies(movies, trendingMoviesPreviewList)
}

async function getCategoriesPreview() {
    const { data } = await api('/genre/movie/list')

    const categories = data.genres

    createCategories(categories, catergoriesPreviewList)
}

async function getMoviesByCategory(id) {
    const { data } = await api('/discover/movie', {
        params: {
            with_genres: id
        }
    })

    const movies = data.results

    createMovies(movies, genericSection)
}

async function getMoviesBySearch(query) {
    const { data } = await api('/search/movie', {
        params: {
            query
        }
    })

    console.log(data);
    const movies = data.results

    createMovies(movies, genericSection)
}

async function getTrendingMovies() {
    const { data } = await api('/trending/movie/day')

    const movies = data.results

    createMovies(movies, genericSection)
}

async function getMovieById(id) {
    const { data: movie } = await api('/movie/' + id)

    const movieImgURL = 'https://image.tmdb.org/t/p/w500' + movie.poster_path

    headerSection.style.background = `
        linear-gradient(
            180deg, 
            rgba(0, 0, 0, 0.35) 19.27%, 
            rgba(0, 0, 0, 0) 29.17%
        ),
        url(${movieImgURL})
    `

    movieDetailTitle.textContent = movie.title
    movieDetailDescription.textContent = movie.overview
    movieDetailScore.textContent = movie.vote_average

    createCategories(movie.genres, movieDetailCatergoriesList)

    getRelatedMoviesById(id)
}

async function getRelatedMoviesById(id) {
    const { data } = await api('/movie/' + id + '/recommendations')
    const relatedMovies = data.results
    
    createMovies(relatedMovies, relatedMoviesContainer)
}