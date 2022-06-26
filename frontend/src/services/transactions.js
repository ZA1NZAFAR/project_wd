import axios from 'axios';
const baseUrl = 'http://localhost:5000/api/transactions';

const getAll = page => {
    const queryString = `?page=${page}`;
    const request = axios.get(baseUrl + queryString);

    return request.then(response => response.data);
};

const makeTransaction = payload => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const request = axios.post(baseUrl, JSON.stringify(payload), config);
    return request.then(response => response.data);
}

const transactionService = {
    getAll,
    makeTransaction
};

export default transactionService;