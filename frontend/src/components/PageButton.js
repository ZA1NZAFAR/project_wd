import React from 'react';

const PageButton = ({ page, active, loadPage }) => {
    return(
        <button type="button" onClick={loadPage} className={ (active) ? 'page-button active' : 'page-button'}>{ page }</button>
    );
};

export default PageButton;