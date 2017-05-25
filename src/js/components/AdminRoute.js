import React from 'react';
import axios from 'axios'
import { authStore }  from '../stores/AuthStore';
import * as constants from '../util/Constants'

class AdminRoute extends React.Component {
  constructor(props) {
    super(props);
  }

  static willTransitionTo(nextState, replace, callback) {
    let oAuthToken = localStorage.getItem('access_token');
    axios.get(constants.API_ME, {
       params: {
          access_token: oAuthToken
        }
      })
      .then(response => {
        if(response.status === 200 && response.data.privileged === true) {
          authStore.loggedIn = true;
          authStore.isAdmin = true;
          authStore.oAuthToken = oAuthToken;
        } else if(response.status === 200 && response.data.privileged === false){
          authStore.setLoggedIn = true;
          authStore.setIsAdmin = false;
          replace(constants.API_HOME);
        }
        callback();
      })
      .catch(error => {
        //TODO: implement error-handling
        console.log(error);
        authStore.loggedIn = false;
        authStore.isAdmin = false;
        replace(constants.API_LOGIN);
        callback();
      });
  }
}

export default AdminRoute;
