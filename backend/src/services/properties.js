const db = require('./db');
const helper = require('../helper');
const config = require('../config');

const getAll = async () => {
    const rows = await db.query(
        `SELECT COUNT(*) AS count FROM properties`
    );

    return rows[0];
}

const getMultiple = async (page = 1) => {
    const offset = helper.getOffset(page, config.listPerPage);
    // returns listPerPage number of records after the offset. For example : LIMIT 5, 10 will return records from 6 to 15
    const rows = await db.query(
        `SELECT id, adresse, proprietaire, type, nbPieces, superficie, etat, prix, date, ville, nbGarages, image, taux 
        FROM properties LIMIT ${offset}, ${config.listPerPage}`
    );

    const data = helper.emptyOrRows(rows);
    const meta = { page };

    return {
        data,
        meta
    }
}

const create = async property => {
    const result = await db.query(
        `INSERT INTO properties (adresse, proprietaire, type, nbPieces, superficie, etat, prix, date, ville, nbGarages, image) 
        VALUES('${property.adresse}', '${property.proprietaire}', '${property.type}', '${property.nbPieces}', '${property.superficie}', 
            '${property.etat}', '${property.prix}', '${property.date}', '${property.ville}', '${property.nbGarages}', '${property.image}');`
    );

    let message = 'An attempt to create a property has failed';

    if (result.affectedRows) {
        message = 'Property has been created successfully!';
    }

    return { message };
}

const update = async (id, property) => {
    const result = await db.query(
        `UPDATE properties SET adresse="${property.adresse}", proprietaire="${property.proprietaire}", type="${property.type}", 
        nbPieces=${property.nbPieces}, superficie="${property.superficie}", etat="${property.etat}", prix=${property.prix}, 
        date="${property.date}", ville="${property.ville}", nbGarages=${property.nbGarages}, image="${property.image}" WHERE id=${id}`
    );

    let message = 'Error while updating a property';

    if (result.affectedRows) {
        message = 'Property has been updated successfully';
    }

    return { message };
}

const remove = async id => {
    const result = await db.query(
        `DELETE FROM properties WHERE id=${id}`
    );

    let message = 'Error while deleting a property';

    if (result.affectedRows) {
        message = 'Property has been deleted successfully';
    }

    return { message };
}

module.exports = {
    getAll,
    getMultiple,
    create,
    update,
    remove
}