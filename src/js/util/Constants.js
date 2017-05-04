export const PROTOCOL = 'http://'
export const FRONTEND = 'localhost:8081'
export const BACKEND = 'localhost:8081'

export const FRONTEND_LOGIN = 'login'
export const FRONTEND_LOGINCONFIRMATION = 'loginConfirmation'
export const FRONTEND_LOGOUT = 'logout'
export const FRONTEND_HOME = 'home'
export const FRONTEND_CATEGORIES = 'categories'
export const FRONTEND_SETTINGS = 'settings'
export const FRONTEND_ABOUT = 'about'
export const FRONTEND_ADMIN = 'admin'

export const API = PROTOCOL + BACKEND + '/api'

export const API_VALIDATE_USER = API + '?validate_user'
export const API_CHECK_PRIVILEGE = API + '?privileged'

export const API_USERS = API + '/users'
export const API_USERS_GET_ALL = API_USERS
export const API_USERS_GET_ACTIVATION = API_USERS + '/activate'
export const API_USERS_GET_ONE = API_USERS + '/'
export const API_USERS_GET_RESET_KEY = API_USERS + '/reset_password'
export const API_USERS_DELETE_ONE = API_USERS + '/'
export const API_USERS_POST_ONE = API_USERS + '/register'
export const API_USERS_POST_RESET = API_USERS + '/reset_password'
export const API_USERS_PUT_AUTHORITIES = API_USERS + '/admin/authorities'
export const API_USERS_PUT_ONE = API_USERS + '/admin'

export const API_LOGIN = "/" + FRONTEND_LOGIN
export const API_HOME = "/" + FRONTEND_HOME

export const API_OAUTH = BACKEND + '/oauth'
export const API_OAUTH_AUTHORIZE = API_OAUTH + '/authorize'
export const API_OAUTH_TOKEN = API_OAUTH + '/token'
export const API_OAUTH_SUCCESS_REDIRECT_URI = PROTOCOL + FRONTEND + '/loginConfirmation'

export const API_KEYS = API + '/keys'
export const API_KEYS_GET_ALL = API_KEYS
export const API_KEYS_GET_ONE = API_KEYS + '/'
export const API_KEYS_DELETE_ALL = API_KEYS + '/'
export const API_KEYS_DELETE_ONE = API_KEYS + '/'
export const API_KEYS_POST_ONE = API_KEYS
export const API_KEYS_PUT_ONE = API_KEYS + '/'

export const API_GROUPS = API + '/groups'
export const API_GROUPS_ADD_USER = API_GROUPS + '/'
export const API_GROUPS_GET_ALL = API_GROUPS
export const API_GROUPS_GET_ONE = API_GROUPS + '/'
export const API_GROUPS_DELETE_ALL = API_GROUPS
export const API_GROUPS_DELETE_ONE = API_GROUPS + '/'
export const API_GROUPS_DELETE_USER = API_GROUPS + '/'
export const API_GROUPS_POST_ONE = API_GROUPS
export const API_GROUPS_PUT_ONE = API_GROUPS + '/'

export const API_CATEGORIES = API + '/categories'
export const API_CATEGORIES_ADD_CHILD = API_CATEGORIES + '/'
export const API_CATEGORIES_ADD_KEY = API_CATEGORIES + '/'
export const API_CATEGORIES_ADD_GROUP= API_CATEGORIES + '/'
export const API_CATEGORIES_GET_ALL = API_CATEGORIES
export const API_CATEGORIES_GET_ONE = API_CATEGORIES + '/'
export const API_CATEGORIES_DELETE_ALL = API_CATEGORIES
export const API_CATEGORIES_DELETE_ONE = API_CATEGORIES + '/'
export const API_CATEGORIES_DELETE_KEY = API_CATEGORIES + '/'
export const API_CATEGORIES_POST_ONE = API_CATEGORIES
export const API_CATEGORIES_PUT_RESPONSIBLE = API_CATEGORIES + '/'

export const API_AUTHORITIES = API + '/authorities'
export const API_AUTHORITIES_GET_ALL = API_AUTHORITIES
export const API_AUTHORITIES_GET_ONE = API_AUTHORITIES + '/'
