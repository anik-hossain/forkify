import axios from 'axios';
import { baseUrl } from '../config';

export default class {
  constructor(query) {
    this.query = query;
  }
  async getResult() {
    try {
      const result = await axios(`${baseUrl}/search?q=${this.query}`);
      this.recipes = result.data.recipes;
    } catch (e) {
      console.log(e);
      alert('No results were found');
    }
  }
}
