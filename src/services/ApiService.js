import axios from "axios";

const apiService = axios.create({timeout: 5000});

export default apiService;