import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';
axios.get('/users').then(res => {
  console.log(res.data);
});

import ImagesApiService from './fetchImages';

const imagesApiService = new ImagesApiService();
const DEBOUNCE_DELAY = 300;

const refs = {
  form: document.querySelector('#search-form'),
  submitBtn: document.querySelector('button[type="submit"]'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const onSearch = async event => {
  event.preventDefault();
  imagesApiService.query = refs.form.elements.searchQuery.value;
  if (imagesApiService.query === '') {
    return;
  }

  refs.loadMoreBtn.classList.add('is-hidden');

  clearGalleryMarkup();
  imagesApiService.resetPage();

  try {
    const result = await imagesApiService.fetchImages();

    if (imagesApiService.totalImages === 0) {
      return Notiflix.Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
    } else {
      Notiflix.Notify.success(
        `Hooray! We found ${imagesApiService.totalImages} images.`
      );
    }

    const imagesArray = result.hits;
    createGalleryMarkup(imagesArray);

    refs.loadMoreBtn.classList.remove('is-hidden');
    refs.loadMoreBtn.disabled = false;
    refs.loadMoreBtn.textContent = 'Load more';

    let availablePages = Math.ceil(
      imagesApiService.totalImages / imagesApiService.per_page
    );
    if (imagesApiService.page > availablePages) {
      refs.loadMoreBtn.disabled = true;
      refs.loadMoreBtn.textContent =
        "We're sorry, but you've reached the end of search results.";
    }
  } catch (error) {
    Notiflix.Notify.failure(`Sorry, something went wrong (${error.name}).`);
  }
};

const onLoadMore = async event => {
  event.preventDefault();

  refs.loadMoreBtn.classList.add('is-hidden');

  try {
    const result = await imagesApiService.fetchImages();
    const imagesArray = result.hits;
    createGalleryMarkup(imagesArray);

    refs.loadMoreBtn.classList.remove('is-hidden');
    let availablePages = Math.ceil(
      imagesApiService.totalImages / imagesApiService.per_page
    );
    if (imagesApiService.page > availablePages) {
      refs.loadMoreBtn.disabled = true;
      refs.loadMoreBtn.textContent =
        "We're sorry, but you've reached the end of search results.";
    }
  } catch (error) {
    Notiflix.Notify.failure(`Sorry, something went wrong (${error.name}).`);
  }
};

const createGalleryMarkup = imagesArray => {
  const galleryMarkup = imagesArray
    .map(image => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;

      return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b><span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b><span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b><span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b><span>${downloads}</span>
    </p>
  </div>
</div>`;
    })
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', galleryMarkup);
};

const clearGalleryMarkup = () => {
  refs.gallery.innerHTML = '';
  refs.gallery.innerHTML = '';
};

refs.submitBtn.addEventListener('click', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
