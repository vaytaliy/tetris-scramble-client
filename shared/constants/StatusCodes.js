// See https://http.cat/ for an easy/fun point of reference.

const { stat } = require("fs");

// These are meant to be more fault-tolerant in our routes instead of typing some number ourselves.
const StatusCodes = {
    Ok: 200,
    Created: 201,
    Accepted: 202,
    BadRequest: 400, 
    UnAuthorized: 401,
    InternalServerError: 500
}

module.exports = StatusCodes;
