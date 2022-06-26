import axios from 'axios';
const baseUrl = 'http://localhost:5000/api/houseTours';

const getAll = page => {
    const queryString = `?page=${page}`;
    const request = axios.get(baseUrl + queryString);

    return request.then(response => response.data);
};

const bookHouseTour = payload => {
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    const request = axios.post(baseUrl, payload, config);
    return request.then(response => response.data);
}

const houseTourService = {
    getAll,
    bookHouseTour
}

export default houseTourService;