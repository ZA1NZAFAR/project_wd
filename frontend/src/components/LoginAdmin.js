import React, { useState } from 'react';
import styled from 'styled-components';
import login_bg from '../resources/images/login_bg_admin.jpg';
import Navbar from './Navbar';
import "../styles/LoginAdmin.css";
import Axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';

const LoginAdmin = ({ setRole }) => {
    const baseUrl = "http://localhost:5000/authentication/adminLogin";
    const [Id_admin, set_Id_admin] = useState('');
    const [password_admin, setpassword_admin] = useState('');

    const location = useLocation();
    const navigate = useNavigate();
    const fromWhere = location.state?.fromWhere?.pathname || "/properties";

    const loginAdmin = () => {
        Axios.post(baseUrl, { Id_Admin: Id_admin, password: password_admin })
            .then((response) => {
                if (response.data.message) {
                    alert(response.data.message);

                    if (response.data.message === 'Admin has been logged successfully') {
                        setRole('Admin');
                        setTimeout(() => navigate(fromWhere, { replace: true }), 2000);
                    }
                } else {
                    alert("Something went wrong... Please try later.");
                }
            });
    };

    return (
        <div>
            <div>
                <Navbar alternativeStyling={false} />
                <Body>
                    <BigContainer>
                        <Welcome>Welcome agent.</Welcome>
                        <InputContainer>
                            <InputStyle type="text" placeholder='Enter admin Id...' onChange={(event) => { set_Id_admin(event.target.value); }} />
                            <InputStyle type="password" placeholder='Enter password...' onChange={(event) => { setpassword_admin(event.target.value); }} />
                        </InputContainer>
                        <ButtonContainer>
                            <button onClick={loginAdmin} type="button" className="button">Login</button>
                        </ButtonContainer>
                    </BigContainer>
                </Body>
            </div>
        </div>
    )
}

const InputContainer = styled.div`
    display:flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    margin-left: 5px;
    height: 40%;
    width: 100%;
    `;

const ButtonContainer = styled.div`
    margin: 1rem 0 2 rem 0;
    width: 100%;
    display : flex;
    align-items: center;
    justify-content: center;
    `;

const BigContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    height: 50vh;
    width: 30vw;
    background: #f5f2f226;
    box-shadow: 0 8px 32px 0 #7788885e;
    backdrop-filter: blur(8.5px);
    border-radius: 10px;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.4rem;
    `;

const Welcome = styled.h2`
    margin: 3rem 0 2rem 0;
    `;

const Body = styled.div`
          font-family: 'Roboto';
          background: url(${login_bg});
          background-size:cover;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100vw
    `;

const InputStyle = styled.input`
    background: #ffffff85;
    box-shadow : 0 8px 32px 0 #4577765e;
    margin-bottom: 20px;
    border-radius : 2rem;
    width: 95%;
    height: 3rem;
    padding: 1rem;
    border: none;
    outline: none;
    color: #2a525d;
    font-size: 1rem;
    font-weight: bold;
    &:focus{
        display : inline-block;
        box-shadow: 0 0 0 0.2rem #c4c8c8;
        backdrop-filter: blur(12rem);
        border-radius: 2rem;
    }
    &::placeholder{
        color: white;
        font-weight: 100;
        font-size: 1rem;
    }
    `;

export default LoginAdmin;