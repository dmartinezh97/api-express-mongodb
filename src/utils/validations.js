function getCollectionName(req) {
    return str.replace(/[^a-zA-Z-]/g, '');
}

module.exports = {
    getCollectionName,
}