import {observable} from "mobx";
import axios from 'axios'
import * as constants from '../util/Constants'

/**
 * @author mskyschally@communicode.de
 */
class KeyStore {
  @observable keys = [];

  constructor() {
    this.fetchKeys();
  }

  addKey(key) {
    this.keys.push(key);
  }

  fetchKeys() {
    axios.get(constants.API_KEYS_GET_ALL, {
      params: {
        access_token: localStorage.getItem('access_token')
      }
    }).then(response => {
      response.data.map(key => this.addKey(key));
    }).catch(function (error) {
      console.log(error);
    });
  }
}

export let keyStore = new KeyStore();
export default KeyStore;
