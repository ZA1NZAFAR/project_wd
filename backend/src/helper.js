// Use to display some number of wathces in the page :

const getOffset = (currentPage = 1, listPerPage) => (currentPage - 1) * [listPerPage];

const emptyOrRows = rows => (!rows) ? [] : rows;

module.exports = {
    getOffset,
    emptyOrRows
}