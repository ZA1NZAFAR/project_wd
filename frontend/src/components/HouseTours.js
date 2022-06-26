import React, { useState, useEffect, useRef } from 'react';
import houseTourService from '../services/houseTours';
import PageButton from "./PageButton";
import Property from './Property';
import Navbar from './Navbar';
import Footer from './Footer';
import { BiTime } from 'react-icons/bi';
import { BsFillCalendarDateFill, BsPersonCircle } from 'react-icons/bs';
import { HiOutlineMail } from 'react-icons/hi';

const HouseTours = ({ role }) => {
  const [houseTours, setHouseTours] = useState([]);
  const [page, setPage] = useState(Number(1));
  const lastPage = useRef(0);
  
  useEffect(() => {
      houseTourService
        .getAll(page)
          .then(houseTours => {
            setHouseTours(houseTours.data);
            setPage(Number(houseTours.meta.page));
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

  // Destructures houseTour object to retrieve only subset of object properties, related to real estate properties
  // Used to render property components within an unordered list
  const getProperty = houseTour => {
    const property = (({ adresse, proprietaire, type, nbPieces, superficie, etat, prix, ville, nbGarages, image, taux }) => 
              ({ adresse, proprietaire, type, nbPieces, superficie, etat, prix, ville, nbGarages, image, taux }))(houseTour);
    property.date = houseTour.date_disponibilite;
    return property;
  }

  return (
    <div className="house-tour">
      <Navbar alternativeStyling={true} />
      {role === 'Admin'
        ? <>
          <ul>
            {houseTours.map(houseTour => 
              <li key={houseTour.id}>
                <div className="house-tour-card">
                  <div>
                    <Property property={getProperty(houseTour)} user={"Guest"} />
                  </div>
                  <div className="house-tour-card-right">
                    <div className="house-tours-card-time">Date et l'heure de visite :
                      <p><BsFillCalendarDateFill /> {houseTour.date.substring(0, houseTour.date.indexOf('T'))}<br></br> 
                      <BiTime /> {houseTour.date.substring(houseTour.date.indexOf('T') + 1, houseTour.date.indexOf('.'))}</p>
                    </div>
                    <div className="house-tours-card-client">Client :
                      <p><BsPersonCircle /> {houseTour.prenom} {houseTour.nom}</p>
                      <p><HiOutlineMail /> {houseTour.email}</p>
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
        : <div className="house-tour-no-rights">You Don't have Authorization to View this Page<br></br>Please Log In</div>
      }
      <Footer />
    </div>
  )
}

export default HouseTours;