const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY,
    }
})

async function getTrendingMoviesPreview() {
    const { data } = await api('/trending/movie/day')

    const movies = data.results

    movies.forEach(movie => {
        const trendingPreviewMoviesContainer = document.querySelector('#trendingPreview .trendingPreview-movieList')

        const movieContainer = document.createElement('div')
        movieContainer.classList.add('movie-container')

        const movieImg = document.createElement('img')
        movieImg.classList.add('movie-img')
        movieImg.setAttribute('alt', movie.title)
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path)

        movieContainer.appendChild(movieImg)
        trendingPreviewMoviesContainer.appendChild(movieContainer)
    });
}

async function getCategoriesPreview() {
    const { data } = await api('/genre/movie/list')

    const categories = data.genres

    categories.forEach(category => {
        const previewCategoriesContainer = document.querySelector('#categoriesPreview .categoriesPreview-list')

        const categoryContainer = document.createElement('div')
        categoryContainer.classList.add('category-container')

        const categoryTiltle = document.createElement('h3')
        categoryTiltle.classList.add('category-title')
        categoryTiltle.setAttribute('id', 'id' + category.id)
        const categoryTitleText = document.createTextNode(category.name) 

        categoryTiltle.appendChild(categoryTitleText)
        categoryContainer.appendChild(categoryTiltle)
        previewCategoriesContainer.appendChild(categoryContainer)
    });
}

getTrendingMoviesPreview()
getCategoriesPreview()