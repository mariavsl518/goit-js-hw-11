import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const load = document.querySelector('.load-more');
form.addEventListener('submit', handleSubmit);
load.addEventListener('click', handleClick);

const baseURL = 'https://pixabay.com/api/';

const params = new URLSearchParams({
    key : "40689731-12a87d22ac6b1cbae7ac2a055",
    q: '',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
})

let page;
load.hidden = true;

async function getImages(params) {

    const resp = await axios.get(`${baseURL}?${params}&page=${page}`);
    return resp.data
}


async function handleSubmit(evt) {
    evt.preventDefault();
    page = 1;
    const request = form.elements.searchQuery.value.trim();

    params.set('q', request);

    if (!request) {
       return Notify.failure('Sorry, there are no images matching your search query. Please try again.')
    }

    getImages(params)
            .then(resp => {
                gallery.innerHTML = createMarkup(resp.hits);
                Notify.success(`${resp.totalHits} images found`);
                if (resp.hits.length < params.get('per_page')) {
                    load.hidden = true
                }
                else { load.hidden = false }
            })
    
    form.reset();
}

function handleClick() { 
    load.hidden = true;
    page += 1;
    getImages(params)
        .then(resp => {
            gallery.insertAdjacentHTML('beforeend', createMarkup(resp.hits));
                if (resp.hits.length === params.get('per_page')) {
                    load.hidden = true
                }
                else { load.hidden = false }
        })
        .catch(Notify.info("We're sorry, but you've reached the end of search results."))
}

function createMarkup(obj) {

     return obj.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `

        <div class="photo-card" style="margin:30px">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" width="500px"/>
        <div class="info">
            <p class="info-item">
            <b>Likes:${likes}</b>
            </p>
            <p class="info-item">
            <b>Views:${views}</b>
            </p>
            <p class="info-item">
            <b>Comments:${comments}</b>
            </p>
            <p class="info-item">
            <b>Downloads:${downloads}</b>
            </p>
        </div>
        </div>`).join('');
};