import React, { useState, useEffect, useRef } from 'react';
import transactionService from '../services/transactions';
import PageButton from "./PageButton";
import Property from './Property';
import Navbar from './Navbar';
import Footer from './Footer';
import { BiTime } from 'react-icons/bi';
import { BsFillCalendarDateFill, BsPersonCircle, BsPercent } from 'react-icons/bs';
import { HiOutlineMail } from 'react-icons/hi';
import { AiOutlineEuroCircle } from 'react-icons/ai';

const Transactions = ({ role }) => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(Number(1));
  const lastPage = useRef(0);

  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  });
  
  useEffect(() => {
      transactionService
        .getAll(page)
          .then(transactions => {
            setTransactions(transactions.data);
            setPage(Number(transactions.meta.page));
          });
  }, [page]);

  const loadPrevPage = () => {
    if (page <= 1)
        return;

    setPage(page - 1);
  }

  const loadNextPage = () => {
    if (page >= lastPage.current)
        return;

    setPage(page + 1);
  };

  // Destructures transaction object to retrieve the subset of object properties, related to real estate properties and clients
  // Used to render property components within an unordered list
  const getProperty = transaction => {
    const property = (({ adresse, proprietaire, type, nbPieces, superficie, etat, prix, ville, nbGarages, image, taux }) => 
              ({ adresse, proprietaire, type, nbPieces, superficie, etat, prix, ville, nbGarages, image, taux }))(transaction);
    property.date = transaction.date_disponibilite;
    return property;
  }

  return (
    <div className="transactions">
      <Navbar alternativeStyling={true} />
      {role === 'Admin'
        ? <>
          <ul>
            {transactions.map(transaction => 
              <li key={transaction.id}>
                <div className="transactions-card">
                  <div>
                    <Property property={getProperty(transaction)} user={"Guest"} />
                  </div>
                  <div className="transactions-card-bottom">
                    <div className="transactions-card-bottom-transaction">
                      <span className="transactions-card-bottom-transaction-header">Transaction</span>
                      <div className="transactions-card-bottom-transaction-container">
                        <p><b>Total payé :</b><br></br><AiOutlineEuroCircle /> {formatter.format(transaction.prix_reel)}</p>
                        <p><b>Frais d'agence :</b><br></br><BsPercent /> {formatter.format(transaction.commission)}</p>
                        <p><b>Date et l'heure de l'achat :</b><br></br><BsFillCalendarDateFill /> {transaction.date.substring(0, transaction.date.indexOf('T'))}<br></br> 
                          <BiTime /> {transaction.date.substring(transaction.date.indexOf('T') + 1, transaction.date.indexOf('.'))}</p>
                      </div>
                    </div>
                    <div className="transactions-card-bottom-client">
                      <div className="transactions-card-bottom-client-info">
                        <span className="transactions-card-bottom-client-info-header">Client</span>
                        <div className="transactions-card-bottom-client-info-container">
                          <p><BsPersonCircle /> {transaction.prenom} {transaction.nom}</p>
                          <p><HiOutlineMail /> {transaction.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>)}
          </ul>
          <div id="pagination-bar">
            {page > 1 && <PageButton page={page - 1} loadPage={() => loadPrevPage()} />}
            {<PageButton page={page} active={true} />}
            {(page + 1) < lastPage.current && <PageButton page={page + 1} loadPage={() => loadNextPage()} />}
          </div>
        </>
        : <div className="transactions-no-rights">You Don't have Authorization to View this Page<br></br>Please Log In</div>
      }
      <Footer />
    </div>
  )
}

export default Transactions;