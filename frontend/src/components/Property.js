import React, { useState, useRef, useEffect } from 'react';
import propertyService from '../services/properties';
import houseTourService from '../services/houseTours';
import transactionService from '../services/transactions';
import NewProperty from './NewProperty';
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import fr from 'date-fns/locale/fr';

const Property = ({ property, user, reflectChanges, clientID }) => {
  const [edit, setEdit] = useState(false);
  const [propertyId, setPropertyId] = useState(property.id);
  const [message, setMessage] = useState('');
  const [bookTour, setBookTour] = useState(false);
  const [transactionFees, setTransactionFees] = useState(false);
  const [date, setDate] = useState(new Date());
  const [minDate, setMinDate] = useState(new Date());
  const btnRef = useRef();

  registerLocale('fr', fr);
  setDefaultLocale('fr');

  useEffect(() => {
    setMinDate(minDate.setDate(minDate.getDate() + 1));
  }, []);

  // Formats price to the given currency and region. Used to nicely format price of real estates
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  });

  const formatDate = date => {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear(),
      hour = '' + d.getHours(),
      minute = '' + d.getMinutes(),
      second = '' + d.getSeconds();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
    if (hour.length < 2)
      hour = '0' + hour;
    if (minute.length < 2)
      minute = '0' + minute;
    if (second.length < 2)
      second = '0' + second;

    return [year, month, day].join('-') + ' ' + [hour, minute, second].join(':');
  }

  const editHandler = () => {
    setPropertyId(property.id);
    setEdit(!edit);
  }

  const deleteHandler = () => {
    if (btnRef.current) {
      btnRef.current.setAttribute("disabled", "disabled");
    }

    setPropertyId(property.id);
    propertyService.removeProperty(propertyId)
      .then(response => {
        setMessage(response.message);
        setTimeout(() => {
          setMessage('');
          reflectChanges();
          btnRef.current.removeAttribute("disabled");
        }, 3000);
      })
  }

  const showBookingFormHandler = () => {
    setBookTour(!bookTour);
  }

  const bookTourHandler = () => {
    setPropertyId(property.id);

    if (!date || !propertyId || !clientID) {
      setMessage("Veuillez remplir les champs correctement !");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const data = new URLSearchParams();
    data.append("clientId", clientID);
    data.append("propertyId", propertyId);
    data.append("date", formatDate(date));

    setBookTour(!bookTour);

    houseTourService.bookHouseTour(data)
      .then(response => {
        setMessage(response.message);
        setTimeout(() => setMessage(""), 3000);
      })
  };

  const showTransactionPopupHandler = () => {
    setTransactionFees(!transactionFees);
  }

  const transactionHandler = () => {
    setPropertyId(property.id);

    if (!property.prix || !property.taux || !propertyId || !clientID) {
      setMessage("Veuillez remplir les champs correctement !");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const data = {
      prix: property.prix,
      propertyId: propertyId,
      clientId: clientID,
      commission: Math.round((1000 + (property.prix * property.taux)) * 100) / 100,
      date: formatDate(new Date())
    }

    setTransactionFees(!transactionFees);

    transactionService.makeTransaction(data)
      .then(response => {
        setMessage(response.message);
        setTimeout(() => setMessage(""), 3000);
      })
  };

  return (
    <>
      {(message !== '') && <h2 className="status-message success">{message}</h2>}
      <div className="property-card">
        <div className="property">
          <img src={property.image} alt="Property"></img>
          <br></br>
          <div className="property-info">
            <div className="item">
              <div><span className="icon"><i className="fa-solid fa-location-dot"></i></span><span className="icon-text">{property.adresse}</span></div>
              <div><span className="icon"><i className={'fa-solid ' + (property.type === 'Maison' ? 'fa-house' : 'fa-building')}></i></span><span className="icon-text">{property.type}</span></div>
              <div><span className="icon"><i className="fa-solid fa-bed"></i></span><span className="icon-text">{property.nbPieces} pièces</span></div>
              <div><span className="icon"><i className="fa-solid fa-calendar-days"></i></span><span className="icon-text">{property.date.substring(0, property.date.indexOf('T'))}</span></div>
              <div><span className="icon"><i className="fa-solid fa-dollar-sign"></i></span><span className="icon-text">{formatter.format(property.prix)}</span></div>
              <div><span className="icon"><i className="fa-solid fa-user"></i></span><span className="icon-text">{property.proprietaire}</span></div>
            </div>
            <div className="item">
              <div><span className="icon"><i className="fa-solid fa-city"></i></span><span className="icon-text">{property.ville}</span></div>
              <div><span className="icon"><i className="fa-solid fa-square-full"></i></span><span className="icon-text">{property.superficie}</span></div>
              <div><span className="icon"><i className="fa-solid fa-warehouse"></i></span><span className="icon-text">{property.nbGarages} garages</span></div>
              <div><span className="icon"><i className="fa-solid fa-clock"></i></span><span className="icon-text">{property.date.substring(property.date.indexOf('T') + 1, property.date.indexOf('.'))}</span></div>
              <button className="property-more-btn">
                <span className="circle" aria-hidden="true">
                  <span className="icon plus"></span>
                </span>
                <span className="button-text">En savoir</span>
              </button>
              <div><span className="icon"><i className="fa-solid fa-circle-check"></i></span><span className="icon-text">{property.etat}</span></div>
            </div>
          </div>
        </div>
        {user === 'Admin' && <div>
          <button className="property-edit-btn" onClick={editHandler}><span className="icon edit"><i className="fa-solid fa-pen"></i></span><span className="icon-text">Modifier</span></button>
          <button className="property-delete-btn" ref={btnRef} onClick={deleteHandler}><span className="icon delete"><i className="fa-solid fa-trash"></i></span><span className="icon-text">Supprimer</span></button>
        </div>}
        {user === 'Client' && <div>
          <button className="property-transaction-btn" onClick={showTransactionPopupHandler}><span className="icon transaction"><i className="fa-solid fa-money-check-dollar"></i></span><span className="icon-text">Faire une proposition</span></button>
          <button className="property-book-tour-btn" onClick={showBookingFormHandler}><span className="icon tour"><i className="fa-solid fa-calendar-days"></i></span><span className="icon-text">Planifier un RDV pour la visite</span></button>
        </div>}
      </div>
      {edit && <NewProperty user = {'Edit'} id = {propertyId} />}
      {transactionFees && <div className="property-transaction-fees">
        <div className="property-transaction-fees-header">
          <span className="property-transaction-fees-header-price">Prix</span>
          <span className="property-transaction-fees-header-fees">Commission</span>
        </div>
        <div className="property-transaction-fees-details">
          <span className="property-transaction-fees-details-price">{formatter.format(property.prix)}</span>
          <span className="property-transaction-fees-details-fees">{formatter.format(1000 + (property.prix * property.taux))}</span>
        </div>
        <button className="new-transaction-btn" onClick={transactionHandler}>Faire l'offre d'achat</button>
      </div>}
      {bookTour && <div className="property-tour-booking">
        <h2 className="status-message success">Veuillez choisir la date :</h2>
        <span><DatePicker className="calendar" selected={date} minDate={minDate} onChange={(date) => setDate(date)} showTimeSelect dateFormat="Pp" locale="fr" /></span>
        <button className="new-property-form-btn" onClick={bookTourHandler}>Confirmer</button>
      </div>}
    </>
  );
};

export default Property;