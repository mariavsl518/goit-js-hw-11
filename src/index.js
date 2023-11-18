import axios from "axios";

const form = document.querySelector('.search-form');
form.addEventListener('submit', handleSubmit)
const baseURL = 'https://pixabay.com/api/';

const params = new URLSearchParams({
    key : "40689731-12a87d22ac6b1cbae7ac2a055",
    q: '',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true'
})

async function getImages(params) {
    // if (params.q === '') {
    //     throw new Error('')
    //  }
    return axios.get(`${baseURL}?${params}`)
        .then((resp) => {return resp.data.hits })
        // .catch(() => { })
}

function handleSubmit(evt) { 
    evt.preventDefault();
    const request = form.elements.searchQuery.value;
    params.set('q', request);
    console.log(getImages(params));
}

// `<div class="photo-card">
//   <img src="" alt="" loading="lazy" />
//   <div class="info">
//     <p class="info-item">
//       <b>Likes</b>
//     </p>
//     <p class="info-item">
//       <b>Views</b>
//     </p>
//     <p class="info-item">
//       <b>Comments</b>
//     </p>
//     <p class="info-item">
//       <b>Downloads</b>
//     </p>
//   </div>
// </div>`

