import React from 'react';
import axios from 'axios'
import { authStore }  from '../stores/AuthStore';
import * as constants from '../util/Constants'

class AuthenticatedRoute extends React.Component {
  constructor(props) {
    super(props);
  }

  static willTransitionTo(nextState, replace, callback) {
    axios.get(constants.API_CHECK_PRIVILEGE, {
       params: {
          access_token: localStorage.getItem('access_token')
        }
      })
      .then(response => {
        if(response.status == 200 && response.data.privileged == true) {
          authStore.loggedIn = true;
          authStore.isAdmin = true;
          callback();
        } else if(response.status == 200 && response.data.privileged == false){
          authStore.setLoggedIn = true;
          authStore.setIsAdmin = false;
          callback();
        }
        callback();
      })
      .catch(error => {
        authStore.loggedIn = false;
        authStore.isAdmin = false;
        replace('/login');
        callback();
      });
  }
}

export default AuthenticatedRoute;
