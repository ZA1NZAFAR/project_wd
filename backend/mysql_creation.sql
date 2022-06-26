USE real_estate_lsi;

CREATE TABLE `properties` (
  `id`            INT NOT NULL auto_increment,
  `adresse`       VARCHAR(125) NOT NULL,
  `proprietaire`  VARCHAR(75) NOT NULL,
  `type`   		  VARCHAR(25) NOT NULL,
  `NbPieces`      INT NOT NULL,
  `superficie`    VARCHAR(50) NOT NULL,
  `etat`		  VARCHAR(25) NOT NULL,
  `prix`		  FLOAT NOT NULL,
  `date`    	  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ville` 		  VARCHAR(50),
  `nbGarages`     INT NOT NULL,
  PRIMARY KEY(`id`)
)

engine = innodb charset=utf8mb4 COLLATE utf8mb4_general_ci;

/*******************************************************************************************************************************************/
INSERT INTO properties(adresse, proprietaire, type, nbPieces, superficie, etat, prix, date, ville, nbGarages) VALUES
('123 rue de Machin, Villejuif', 'Jessy VY', 'Maison', 5, '110 m2', 'Neuf', 399000, '2022-07-15 10:10:10', 'Villejuif', 2),
('457 boulevard de Bidul, Paris 75016', 'Meryem KOSE', 'Appartement', 3, '80 m2', 'Neuf', 599000, '2022-09-22 13:15:00', 'Paris 16eme', 1),
('987 avenue de tristesse, Rouen', 'Ratiba KADI', 'Maison', 8, '180 m2', 'Bon etat', 250000, '2022-05-03 08:00:00', 'Rouen', 2),
('Rue de le test, Saint-Malo', 'Emmanuel Macron', 'Appartement', 5, '90 m2', 'Tres bon etat', 600000, '2022-12-10 19:25:30', 'Saint-Malo', 1)