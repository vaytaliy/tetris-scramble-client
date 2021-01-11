const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashPassword = async (password) => {
    const hashed = await bcrypt.hash(password, saltRounds)
    return hashed;
}

const comparePassword = async (password, hash) => {
    const isValidated = await bcrypt.compare(password, hash);
    return isValidated;
}

module.exports = {hashPassword, comparePassword};