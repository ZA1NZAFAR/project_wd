const db = require('./db');
const helper = require('../helper');
const config = require('../config');

const getMultiple = async (page = 1) => {
    const offset = helper.getOffset(page, config.listPerPage);
    
    const rows = await db.query(
        `SELECT Transactions.id, Transactions.prix_reel, Transactions.commission, Transactions.date, 
        Properties.adresse, Properties.proprietaire, Properties.type, Properties.nbPieces, Properties.superficie, Properties.etat, Properties.prix, Properties.date_disponibilite, Properties.ville, Properties.nbGarages, Properties.image, Properties.taux, 
        Users.email, Users.prenom, Users.nom 
        FROM 
            (SELECT id, prix_reel, property_id, client_id, commission, date FROM Achats LIMIT ${offset}, ${config.listPerPage}) Transactions,
            (SELECT id, adresse, proprietaire, type, nbPieces, superficie, etat, prix, date AS date_disponibilite, ville, nbGarages, image, taux FROM properties) Properties, 
            (SELECT id, email, prenom, nom FROM Users) Users 
        WHERE
            Transactions.property_id = Properties.id
        AND 
            Transactions.client_id = Users.id`
    );

    const data = helper.emptyOrRows(rows);
    const meta = { page };

    return {
        data,
        meta
    }
}

const create = async transaction => {
    const result = await db.query(
        `INSERT INTO Achats (prix_reel, property_id, client_id, commission, date) VALUES('${transaction.prix}', '${transaction.propertyId}', '${transaction.clientId}', '${transaction.commission}', '${transaction.date}');`
    );

    if (result.affectedRows) {
        message = 'Transaction has been made successfully!';
    }

    return { message };
}

module.exports = {
    getMultiple,
    create
}