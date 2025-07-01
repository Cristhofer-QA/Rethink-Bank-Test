const supertest = require('supertest');

function createClient(token = null) {
    const client = supertest(process.env.API_BASE_URL);

    const applyToken = (req) => {
        if (token !== null) {
            req.set('Authorization', `Bearer ${token}`);
        }
        return req;
    };

    return {
        get: (path) => applyToken(client.get(path)),
        post: (path) => applyToken(client.post(path)),
        delete: (path) => applyToken(client.delete(path))
    };
};

module.exports = createClient;