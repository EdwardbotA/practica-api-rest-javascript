let lang = navigator.language || 'es'

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY,
        'language': lang,
    }
})

function likedMoviesList() {
    const item = JSON.parse(localStorage.getItem('liked_movies'))
    let movies

    if (item) {
        movies = item
    } else {
        movies = {}
    }
    
    return movies
}

function likeMovie(movie) {
    const likedMovies = likedMoviesList()

    if (likedMovies[movie.id]) {
        likedMovies[movie.id] = undefined
    } else {
        likedMovies[movie.id] = movie
    }

    localStorage.setItem('liked_movies', JSON.stringify(likedMovies))
}

const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img')
            entry.target.setAttribute('src', url)
        }
    })
})

function createMovies(
    movies, 
    container, 
    { 
        lazyLoad = false, 
        clean = true 
    } = {},
) {
    if (clean) {
        container.innerHTML = ''
    }

    movies.forEach(movie => {
        const movieContainer = document.createElement('div')
        movieContainer.classList.add('movie-container')
        
        const movieImg = document.createElement('img')
        movieImg.classList.add('movie-img')
        movieImg.setAttribute('alt', movie.title)
        movieImg.setAttribute(
            lazyLoad ? 'data-img' : 'src', 
            'https://image.tmdb.org/t/p/w300' + movie.poster_path
        )
        
        movieImg.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id
        })
        movieImg.addEventListener('error', () => {
            movieImg.setAttribute(
                'src', 
                'https://img.freepik.com/vector-gratis/fondo-error-404-diseno-divertido_1167-219.jpg'
            )
        })

        const movieBtn = document.createElement('button')
        movieBtn.classList.add('movie-btn')

        likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked')
        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked')
            likeMovie(movie)
            getLikedMovies()
        })

        if (lazyLoad) {
            lazyLoader.observe(movieImg)
        }

        movieContainer.appendChild(movieImg)
        movieContainer.appendChild(movieBtn)
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

    createMovies(movies, trendingMoviesPreviewList, true)
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
    maxPages = data.total_pages

    createMovies(
        movies, 
        genericSection, 
        {lazyLoad: true}
    )
}

function getPaginatedMoviesByCategory(id) {
    return async function () {
        const { 
            scrollTop, 
            clientHeight, 
            scrollHeight 
        } = document.documentElement
    
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
    
        const pageIsNotMax = page < maxPages
    
        if (scrollIsBottom && pageIsNotMax) {
            page++
        
            const { data } = await api('/discover/movie', {
                params: {
                    with_genres: id,
                    page,
                }
            })
        
            const movies = data.results
        
            createMovies(
                movies, 
                genericSection, 
                {
                    lazyLoad: true, 
                    clean: false
                }
            )
        }
    }
}

async function getMoviesBySearch(query) {
    const { data } = await api('/search/movie', {
        params: {
            query
        }
    })

    const movies = data.results
    maxPages = data.total_pages

    createMovies(movies, genericSection)
}

function getPaginatedMoviesBySearch(query) {
    return async function () {
        const { 
            scrollTop, 
            clientHeight, 
            scrollHeight 
        } = document.documentElement
    
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
    
        const pageIsNotMax = page < maxPages
    
        if (scrollIsBottom && pageIsNotMax) {
            page++
        
            const { data } = await api('/search/movie', {
                params: {
                    query,
                    page,
                }
            })
        
            const movies = data.results
        
            createMovies(
                movies, 
                genericSection, 
                {
                    lazyLoad: true, 
                    clean: false
                }
            )
        }
    }
}

async function getTrendingMovies() {
    const { data } = await api('/trending/movie/day')

    const movies = data.results
    
    maxPages = data.total_pages

    createMovies(movies, genericSection, {lazyLoad: true, clean: true})
}

async function getPaginatedTrendingMovies() {
    const { 
        scrollTop, 
        clientHeight, 
        scrollHeight 
    } = document.documentElement

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)

    const pageIsNotMax = page < maxPages

    if (scrollIsBottom && pageIsNotMax) {
        page++
    
        const { data } = await api('/trending/movie/day', {
            params: {
                page
            }
        })
    
        const movies = data.results
    
        createMovies(movies, genericSection, {lazyLoad: true, clean: false})
    }
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

function getLikedMovies() {
    const likedMovies = likedMoviesList()
    const moviesArray =  Object.values(likedMovies)

    createMovies(moviesArray, likedMoviesListArticle, {lazyLoad: true, clean: true})
}