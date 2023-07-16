const path = require('path');
const dotenv = require('dotenv')
dotenv.config();

const getRootPath = (relativePath) => {
    return path.join(process.cwd(), relativePath);
};

const getUserPath = (user_id) => {
    return createUserPath(user_id)
};

const getUserPathWithCollection = (user_id, collection_name) => {
    const pathUser = createUserPath(user_id)
    const pathCollection = `${pathUser}/${collection_name}`
    return pathCollection
};

function createUserPath(user_id) {
    const pathUploads = process.env.DIRECTORY_UPLOADS
    const pathUser = `${pathUploads}/${user_id}`
    const absolutePathUser = getRootPath(pathUser);
    return absolutePathUser
}

const getUserIndexPath = (user_id) => {
    return createUserIndexPath(user_id)
};

const getUserIndexPathWithCollection = (user_id, collection_name) => {
    const pathUser = createUserIndexPath(user_id)
    const pathCollection = `${pathUser}/${collection_name}`
    return pathCollection
};

function createUserIndexPath(user_id) {
    const pathIndexes = process.env.DIRECTORY_INDEX
    const pathUser = `${pathIndexes}/${user_id}`
    const absolutePathUserIndex = getRootPath(pathUser);
    return absolutePathUserIndex
}

module.exports = {
    getUserPath,
    getUserPathWithCollection,
    getUserIndexPath,
    getUserIndexPathWithCollection
}