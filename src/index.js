import './css/styles.css';
import GetPixabayApi from './getPixabayApi';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-formid'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

const getPixabayApi = new GetPixabayApi();

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSubmit(e) {
  e.preventDefault();
  refs.loadMoreBtn.classList.add('load-more__js');
  clearGallery();

  getPixabayApi.searchInfo = e.currentTarget.elements.searchQuery.value;
  if (getPixabayApi.searchInfo === '') {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  } else {
    getPixabayApi.resetPage();
    getPixabayApi
      .fetchApi()
      .then(hits => {
        console.log(hits);
        if (hits.length === 0) {
          return Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.',
          );
        } else if (hits.length < 40) {
          Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
          refs.loadMoreBtn.classList.add('load-more__js');
          renderPixabaiApi(hits);
        } else {
          getPixabayApi.showTotalHits();
          renderPixabaiApi(hits);
          refs.loadMoreBtn.classList.remove('load-more__js');
        }
      })
      .finally();
  }
}

function onLoadMore() {
  getPixabayApi.fetchApi().then(hits => {
    console.log(hits);
    if (hits.length < 40) {
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      refs.loadMoreBtn.classList.add('load-more__js');
    }
    renderPixabaiApi(hits);
  });
}

function renderPixabaiApi(items) {
  const renderCard = items
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `
    <div class="photo-card">
      <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags} loading="lazy" width="300" height="200"/>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${likes}
          </p>
          <p class="info-item">
            <b>Views</b>${views}
          </p>
          <p class="info-item">
            <b>Comments</b>${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>${downloads}
          </p>
        </div>
      </a>
    </div>`;
    })
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', renderCard);
  createSimpleLightbox();
}

function createSimpleLightbox() {
  const gallery = new SimpleLightbox('.gallery a');
  gallery.refresh();
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}
