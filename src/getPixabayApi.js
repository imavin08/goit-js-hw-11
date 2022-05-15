import axios from 'axios';
import Notiflix from 'notiflix';
const API_KEY = '27281986-59f4397e165b177c7084776c9';
const url = 'https://pixabay.com/api/';

export default class GetPixabayApi {
  constructor() {
    this.searchInfo = '';
    this.page = 1;
    this.totalHitsImage = '';
  }

  async fetchApi() {
    const options = {
      params: {
        key: API_KEY,
        q: `${this.searchInfo}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: `${this.page}`,
      },
    };
    try {
      const responce = await axios.get(url, options);
      const hits = await responce.data.hits;
      this.totalHitsImage = responce.data.totalHits;
      this.incrementPage();
      return hits;
    } catch (error) {
      console.log(error.message);
    }
  }

  showTotalHits() {
    return Notiflix.Notify.success(`Hooray! We found ${this.totalHitsImage} images.`);
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
