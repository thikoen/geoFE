import axios from 'axios';

export default class HttpClient {

    checkResponse() {
        if (response.status === 401) {
            throw new Error('Please login!');
        }
        if (response.statue === 403) {
            throw new Error('Unauthorized!');
        }
        if (response.status === 404) {
            throw new Error('Unknown route!');
        }
    }

    httpGet(path) {
        return new Promise((resolve, reject) => {
            axios.get(path)

                .then(response => {
                    this.checkResponse(response);

                    resolve(JSON.parse(response.data));

                }).catch(err => {
                    console.log(`Failed GET-Request to ${path}: ${err}`);
                    reject(err);
                });
        });
    }

    httpPost(path, data) {
        return new Promise((resolve, reject) => {
            axios.post(path, data)
                .then(response => {
                    this.checkResponse(response);

                    resolve(JSON.parse(response.data));
                })
                .catch(err => {
                    console.log(`Failed POST-Request to ${path}: ${err}`);
                    reject(err);
                })
        });
    }
}