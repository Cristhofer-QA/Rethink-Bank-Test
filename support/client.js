const supertest = require('supertest');

function createClient(token = null) {
    const client = supertest(process.env.API_BASE_URL);

    const appendTokenToUrl = (path) => {
        if (token) {
            const separator = path.includes('?') ? '&' : '?';
            return `${path}${separator}token=${token}`;
        }
        return path;
    };

    return {
        get: (path) => client.get(appendTokenToUrl(path)),
        post: (path) => client.post(appendTokenToUrl(path)),
        delete: (path) => client.delete(appendTokenToUrl(path))
    };
}

module.exports = createClient;
