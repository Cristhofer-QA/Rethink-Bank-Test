const supertest = require('supertest');

function createClient(bearerToken = null, token = null) {
    const client = supertest(process.env.API_BASE_URL);
    const appendTokenToUrl = (path) => {
        if (token) {
            const separator = path.includes('?') ? '&' : '?';
            return `${path}${separator}token=${token}`;
        }
        return path;
    };

    const applyBearerToken = (req) => {
        if (bearerToken) {
            req.set('Authorization', `Bearer ${bearerToken}`);
        }
        return req;
    };

    return {
        get: (path) => applyBearerToken(client.get(appendTokenToUrl(path))),
        post: (path) => applyBearerToken(client.post(appendTokenToUrl(path))),
        delete: (path) => applyBearerToken(client.delete(appendTokenToUrl(path)))
    };
}

module.exports = createClient;
