export default class ImagesApiService {
  constructor() {
    this.searchQuery = ' ';
    this.page = 1;
    this.per_page = 40;
    this.numberOfImages = null;
  }
  async fetchImages() {
    const API_KEY = `28719024-dfd1ea369e11fcf1315c36358`;
    const baseUrl = 'https://pixabay.com/api/';

    let requestName = this.searchQuery.split(' ').join('+');
    const url = `${baseUrl}?key=${API_KEY}&q=${requestName}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.per_page}&page=${this.page}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(response.status);
    }
    await this.incrementPage();

    const result = await response.json();
    this.totalImages = result.totalHits;

    return result;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  get totalImages() {
    return this.numberOfImages;
  }

  set totalImages(number) {
    this.numberOfImages = number;
  }

  resetPage() {
    this.page = 1;
    this.totalImages = null;
  }

  incrementPage() {
    this.page += 1;
  }
}
