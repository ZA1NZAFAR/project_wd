import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import propertyService from '../services/properties';
import { registerLocale, setDefaultLocale } from "react-datepicker";
import fr from 'date-fns/locale/fr';

import "react-datepicker/dist/react-datepicker.css";

const NewProperty = ({ user, id }) => {
  const baseUrl = "http://localhost:5000/api/properties";
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState('Type');
  const [date, setDate] = useState(new Date());
  const [message, setMessage] = useState('');

  registerLocale('fr', fr);
  setDefaultLocale('fr');

  useEffect(() => {
    if (user === 'Edit')
      setShowForm(true);
  }, []);

  const displayPropertyForm = () => {
    if (user === 'Admin' || user === 'Edit') {
      setShowForm(!showForm);
    }
  };

  const changeType = event => {
    setType(event.target.value);
  }

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

  // Event handler for form submit
  const handleSubmit = e => {
    e.preventDefault();

    if (user !== 'Edit') {
      const data = new URLSearchParams();
      for (const pair of new FormData(document.querySelector('.new-property-form'))) {
        if (!pair[1]) {
          setMessage('Veuillez remplir les champs correctement !');
          setTimeout(() => setMessage(''), 3000);
          return;
        }
        data.append(pair[0], pair[1]);
      }

      propertyService.addProperty(data)
        .then(response => {
          setMessage(response.message);
          setTimeout(() => setMessage(''), 3000);
        })
    } else {
      if (!e.target.adresse.value || !e.target.type.value || !e.target.nbPieces.value || !e.target.date.value || !e.target.prix.value || 
        !e.target.proprietaire.value || !e.target.ville.value || !e.target.superficie.value || !e.target.nbGarages.value || 
        !e.target.etat.value || !e.target.image.value) {
          setMessage('Veuillez remplir les champs correctement !');
          setTimeout(() => setMessage(''), 3000);
          return;
        }

      const data = {
        adresse: e.target.adresse.value,
        type: e.target.type.value,
        nbPieces: e.target.nbPieces.value,
        date: e.target.date.value,
        prix: e.target.prix.value,
        proprietaire: e.target.proprietaire.value,
        ville: e.target.ville.value,
        superficie: e.target.superficie.value,
        nbGarages: e.target.nbGarages.value,
        etat: e.target.etat.value,
        image: e.target.image.value
      }

      propertyService.updateProperty(id, data)
        .then(response => {
          setMessage(response.message);
          setTimeout(() => setMessage(''), 3000);
        })
    }

    displayPropertyForm();
  };

  return (
    <>
      {(message !== '') &&
        <h2 className={"status-message " + (message !== "Veuillez remplir les champs correctement !" ? "success" : "error")}>{message}</h2>}
      {!showForm && user === 'Admin' && <button onClick={displayPropertyForm} className="new-property-btn"></button>}
      {showForm &&
        <form action={baseUrl} method="POST" className="new-property-form" onSubmit={handleSubmit}>
          <div className="new-property-form-column">
            <div className="new-property-form-column-item">
              <label htmlFor="adresse"><span className="icon"><i className="fa-solid fa-location-dot"></i></span></label>
              <input name="adresse" id="adresse" defaultValue="adresse"></input>
            </div>
            <div className="new-property-form-column-item">
              <label htmlFor="type">
                {/* Change icons depending on option value */}
                {type === 'Maison' && <span className="icon"><i className='fa-solid fa-house'></i></span>}
                {type === 'Appartement' && <span className="icon"><i className='fa-solid fa-building'></i></span>}
              </label>
              <select name="type" id="type" defaultValue={"type"} onChange={changeType}>
                <option value="type" disabled hidden>type</option>
                <option value="Maison">Maison</option>
                <option value="Appartement">Appartement</option>
              </select>
            </div>
            <div className="new-property-form-column-item">
              <label htmlFor="nbPieces"><span className="icon"><i className="fa-solid fa-bed"></i></span></label>
              <input name="nbPieces" id="nbPieces" defaultValue="nombre de pièces" type="number" min="0"></input>
            </div>
            <div className="new-property-form-column-item">
              <label htmlFor="date"><span className="icon"><i className="fa-solid fa-calendar-days"></i></span></label>
              <DatePicker className="calendar" selected={date} minDate={date} onChange={(date) => setDate(date)} showTimeSelect dateFormat="Pp" locale="fr" />
              <input name="date" id="date" type="hidden" defaultValue={formatDate(date)}>
              </input>
            </div>
            <div className="new-property-form-column-item">
              <label htmlFor="prix"><span className="icon"><i className="fa-solid fa-dollar-sign"></i></span></label>
              <input name="prix" id="prix" defaultValue="prix" type="number" min="0"></input>
            </div>
            <div className="new-property-form-column-item">
              <label htmlFor="proprietaire"><span className="icon"><i className="fa-solid fa-user"></i></span></label>
              <input name="proprietaire" id="proprietaire" defaultValue="proprietaire"></input>
            </div>
          </div>
          <div className="new-property-form-column">
            <div className="new-property-form-column-item">
              <label htmlFor="ville"><span className="icon"><i className="fa-solid fa-city"></i></span></label>
              <input name="ville" id="ville" defaultValue="ville"></input>
            </div>
            <div className="new-property-form-column-item">
              <label htmlFor="superficie"><span className="icon"><i className="fa-solid fa-square-full"></i></span></label>
              <input name="superficie" id="superficie" defaultValue="superficie"></input>
            </div>
            <div className="new-property-form-column-item">
              <label htmlFor="nbGarages"><span className="icon"><i className="fa-solid fa-warehouse"></i></span></label>
              <input name="nbGarages" id="nbGarages" defaultValue="nombre de garages" type="number" min="0"></input>
            </div>
            <div className="new-property-form-column-item">
              <label htmlFor="etat"><span className="icon"><i className="fa-solid fa-circle-check"></i></span></label>
              <select name="etat" id="etat" defaultValue={"etat"}>
                <option value="etat" disabled hidden>etat</option>
                <option value="Neuf">Neuf</option>
                <option value="Tres bon etat">Très bon état</option>
                <option value="Bon etat">Bon état</option>
                <option value="Mauvais etat">Mauvais état</option>
              </select>
            </div>
            <div className="new-property-form-column-item">
              <label htmlFor="image"><span className="icon"><i className="fa-solid fa-image"></i></span></label>
              <input name="image" id="image" defaultValue="image URL"></input>
            </div>
            <div>
              <button className="new-property-form-btn">{user === 'Admin' ? "Créer" : "Mettre à jour"}</button>
            </div>
            {user !== 'Edit' && <div>
              <button className="new-property-cancel-btn" type="button" onClick={displayPropertyForm}></button>
            </div>}
          </div>
        </form>}
    </>
  );
};

export default NewProperty;