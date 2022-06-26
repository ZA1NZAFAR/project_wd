const db = require('./db');
const helper = require('../helper');
const config = require('../config');

const getMultiple = async (page = 1) => {
    const offset = helper.getOffset(page, config.listPerPage);
    
    const rows = await db.query(
        `SELECT HouseTours.id, HouseTours.id_visitor, HouseTours.id_property, HouseTours.date, Users.email, Users.prenom, Users.nom, 
        Properties.adresse, Properties.proprietaire, Properties.type, Properties.nbPieces, Properties.superficie, Properties.etat, Properties.prix, Properties.date_disponibilite, Properties.ville, Properties.nbGarages, Properties.image, Properties.taux
        FROM 
            (SELECT id, id_visitor, id_property, date FROM Visites LIMIT ${offset}, ${config.listPerPage}) HouseTours
        LEFT JOIN
            (SELECT id, adresse, proprietaire, type, nbPieces, superficie, etat, prix, date AS date_disponibilite, ville, nbGarages, image, taux FROM properties) Properties
        ON (HouseTours.id_property = Properties.id)
        LEFT JOIN
            (SELECT id, email, prenom, nom FROM Users) Users
        ON (HouseTours.id_visitor = Users.id)
        GROUP BY HouseTours.id`
    );

    const data = helper.emptyOrRows(rows);
    const meta = { page };

    return {
        data,
        meta
    }
}

const create = async houseTour => {
    // Unable to use now, since remoteSQL limits number of connections per user
    // db.query triggers a connection on each call. To use later when more sophisticated approach will be implemented, performing only one connection.
    // const rows = await db.query(`SELECT * FROM Visites WHERE id_visitor='${houseTour.clientId}' AND id_property='${houseTour.propertyId}' AND date='${houseTour.date}'`);
    
    // let message = 'An attempt to book a house tour has failed';

    // if (rows[0]) {
    //     return { message };
    // }
    
    const result = await db.query(
        `INSERT INTO Visites (id_visitor, id_property, date) VALUES('${houseTour.clientId}', '${houseTour.propertyId}', '${houseTour.date}');`
    );

    if (result.affectedRows) {
        message = 'House tour has been booked successfully!';
    }

    return { message };
}

module.exports = {
    getMultiple,
    create
}