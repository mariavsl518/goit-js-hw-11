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
let page = 1;
load.hidden = true;
const galleryBox = new SimpleLightbox('.gallery .photo-card a');

async function getImages(params) {
    if (!form.elements.searchQuery.value) {
        gallery.innerHTML = '';
        Notify.failure('Sorry, there are no images matching your search query. Please try again.')
    }
    else {
        return await axios.get(`${baseURL}?${params}&page=${page}`)
            .then((resp) => {
                load.hidden = false;
                return resp.data.hits;
            })
    }
}

async function getNewImages(params) {
    page +=1;
    return await axios.get(`${baseURL}?${params}&page=${page}`)
        .then((resp) => { return resp.data.hits });
}

function handleSubmit(evt) {
    evt.preventDefault();
    page = 1;

    const request = form.elements.searchQuery.value;
    params.set('q', request);
    getImages(params)
        .then(resp => gallery.innerHTML = createMarkup(resp))
        .catch(new Error("Sorry, there are no images matching your search query. Please try again."));
    form.reset();
}

function handleClick() { 
    load.hidden = true;
    getNewImages(params)
        .then(resp => {
            load.hidden = false
            return gallery.insertAdjacentHTML('beforeend', createMarkup(resp));
        })
        .catch(new Error("Sorry, there are no images matching your search query. Please try again."));
    galleryBox.refresh();
}

// function 

function createMarkup(obj) {

     return obj.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `
        <div class="photo-card" style="margin:30px">
        <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" width="500px"/>
        </a>
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