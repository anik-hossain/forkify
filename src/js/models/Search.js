import axios from 'axios';

export default class {
  constructor(query) {
    this.query = query;
  }
  async getResult() {
    try {
      const result = await axios(
        `https://forkify-api.herokuapp.com/api/search?q=${this.query}`
      );
      this.recipes = result.data.recipes;
    } catch (e) {
      console.log(e);
    }
  }
}
