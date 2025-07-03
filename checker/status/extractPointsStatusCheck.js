const extractPointsSuccess = 200;

function extractPointsSuccessCheck(response) {
    expect(response.status).toBe(extractPointsSuccess);
}


module.exports = {
    extractPointsSuccessCheck
};