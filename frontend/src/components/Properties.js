import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import Property from './Property';
import NewProperty from './NewProperty';
import propertyService from '../services/properties';
import PageButton from "./PageButton";
import Navbar from './Navbar';
import Footer from './Footer';

const Properties = ({ role, id }) => {
    const [properties, setProperties] = useState([]);
    const [page, setPage] = useState(Number(1));
    const lastPage = useRef(0);     // used to persist last page number for total number of properties between renders
    const [user, setUser] = useState('Guest');    // Used to grand the admin right to perform CUD operations

    // Runs once (upon first loading of webpage). Sets total number of real estate properties
    // Used to get the rightmost value for pagination
    useEffect(() => {
        propertyService
            .getCount()
            .then(nbProperties => lastPage.current = Math.ceil(nbProperties.count / 10));
        setUser(role);
    }, []);

    // Runs when the component is initally rendered,
    // and also anytime when the next or prev page is loaded (dependant on page value)
    useEffect(() => {
        propertyService
            .getAll(page)
            .then(initialProperties => {
                setProperties(initialProperties.data);
                setPage(Number(initialProperties.meta.page));
            })
    }, [page]);

    const refresh = () => {
        propertyService
            .getAll(page)
            .then(properties => {
                setProperties(properties.data);
                setPage(Number(properties.meta.page));
            })
    }

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

    return (
        <div className="App">
            <Navbar alternativeStyling={true} />
            <NewProperty user={user} />
            <ul>
                {properties.map(property => <li key={property.id}><Property property={property} user={user} reflectChanges={refresh} clientID={id} /></li>)}
            </ul>
            <div id="pagination-bar">
                {(page > 2 && lastPage.current > 3) && <PageButton page={1} loadPage={() => setPage(1)} />}
                {(page > 3 && lastPage.current > 4) && <PageButton page={'...'} />}
                {/* Conditional rendering, if it's the first page, the previous button (0) won't be rendered */}
                {page > 1 && <PageButton page={page - 1} loadPage={() => loadPrevPage()} />}
                {<PageButton page={page} active={true} />}
                {(page + 1) < lastPage.current && <PageButton page={page + 1} loadPage={() => loadNextPage()} />}
                {(lastPage.current > 3 && (page + 2) < lastPage.current) && <PageButton page={'...'} />}
                {(lastPage.current > 2 && page < lastPage.current) && <PageButton page={lastPage.current} loadPage={() => setPage(lastPage.current)} />}
            </div>
            <Footer />
        </div>
    )
}

export default Properties;