let maxPages;
let page = 1
let infiniteScroll;

searchFormBtn.addEventListener('click', () => {
    location.hash = '#search=' + searchFormInput.value.trim()
})

trendingBtn.addEventListener('click', () => {
    location.hash = '#trends'
})

arrowBtn.addEventListener('click', () => {
    history.back()
})

window.addEventListener('load', navigation, false)
window.addEventListener('hashchange', navigation, false)
window.addEventListener('scroll', infiniteScroll, false)

function navigation() {
    if (infiniteScroll) {
        window.removeEventListener('scroll', infiniteScroll,{passive: false})
        infiniteScroll = undefined
    }

    if (location.hash.startsWith('#trends')) {
        trendsPage()
    } else if (location.hash.startsWith('#search=')) {
        searchPage()
    } else if (location.hash.startsWith('#movie=')) {
        moviePage()
    } else if (location.hash.startsWith('#category=')) {
        categoryPage()
    } else {
        homePage()
    }

    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0

    if (infiniteScroll) {
        window.addEventListener('scroll', infiniteScroll, {passive: false})
    }
}

function homePage() {
    headerSection.classList.remove('header-container--long')
    headerSection.style.background = ''
    arrowBtn.classList.add('inactive')
    arrowBtn.classList.remove('header-arrow--white')
    headerTitle.classList.remove('inactive')
    headerCategoryTitle.classList.add('inactive')
    searchForm.classList.remove('inactive')

    trendingPreviewSection.classList.remove('inactive')
    likedMoviesSection.classList.remove('inactive')
    categoriesPreviewSection.classList.remove('inactive')
    genericSection.classList.add('inactive')
    movieDetailSection.classList.add('inactive')
    
    getTrendingMoviesPreview()
    getCategoriesPreview()
    getLikedMovies()
}

function categoryPage() {
    headerSection.classList.remove('header-container--long')
    headerSection.style.background = ''
    arrowBtn.classList.remove('inactive')
    arrowBtn.classList.remove('header-arrow--white')
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.remove('inactive')
    searchForm.classList.add('inactive')

    trendingPreviewSection.classList.add('inactive')
    likedMoviesSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    const [ ,urlInfo ] = location.hash.split('=')
    const [ categogyId, categogyName ] = urlInfo.split('-')

    headerCategoryTitle.innerText = decodeURI(categogyName)

    getMoviesByCategory(categogyId)

    infiniteScroll = getPaginatedMoviesByCategory(categogyId)

}

function moviePage() {
    headerSection.classList.add('header-container--long')
    // headerSection.style.background = ''
    arrowBtn.classList.remove('inactive')
    arrowBtn.classList.add('header-arrow--white')
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.add('inactive')
    searchForm.classList.add('inactive')

    trendingPreviewSection.classList.add('inactive')
    likedMoviesSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.add('inactive')
    movieDetailSection.classList.remove('inactive')

    const [ ,movieId ] = location.hash.split('=')

    getMovieById(movieId)
}

function searchPage() {
    headerSection.classList.remove('header-container--long')
    headerSection.style.background = ''
    arrowBtn.classList.remove('inactive')
    arrowBtn.classList.remove('header-arrow--white')
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.add('inactive')
    searchForm.classList.remove('inactive')

    trendingPreviewSection.classList.add('inactive')
    likedMoviesSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    const [ , query] = location.hash.split('=')

    getMoviesBySearch(decodeURI(query))

    infiniteScroll = getPaginatedMoviesBySearch(query)
}

function trendsPage() {
    headerSection.classList.remove('header-container--long')
    headerSection.style.background = ''
    arrowBtn.classList.remove('inactive')
    arrowBtn.classList.remove('header-arrow--white')
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.remove('inactive')
    searchForm.classList.add('inactive')

    trendingPreviewSection.classList.add('inactive')
    likedMoviesSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    headerCategoryTitle.innerText = 'Tendencias'

    getTrendingMovies()

    infiniteScroll = getPaginatedTrendingMovies
}