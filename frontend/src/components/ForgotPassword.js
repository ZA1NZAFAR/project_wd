import React, { useState } from "react";
import Axios from "axios";
import { Routes, Route, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const baseUrl = "http://localhost:5000/authentication/forgotPassword";
    const navigate = useNavigate();
    const [email_login, setemail_login] = useState('');
    const [password_login, setpassword_login] = useState('');

    const sendEmail = () => {
        Axios.post(baseUrl, { email: email_login, password: password_login })
            .then((response) => {
                if (response.data.message) {
                    alert(response.data.message);
                } else {
                    alert("Something went wrong... Please try later.");
                }
            });
    }

    const redirectLogin = () => {
        navigate('/LoginUser');
    }

    return (
        <div className="container padding-bottom-3x mb-2 mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10">
                    <div className="forgot">
                        <h2>Forgot your password?</h2>
                        <p>
                            Change your password in three easy steps. This will help you to
                            secure your password!
                        </p>
                        <ol className="list-unstyled">
                            <li>
                                <span className="text-primary text-medium">1. </span>Enter your
                                email address below.
                            </li>
                            <li>
                                <span className="text-primary text-medium">2. </span>Our system will
                                send you a temporary link
                            </li>
                            <li>
                                <span className="text-primary text-medium">3. </span>Use the link to
                                reset your password
                            </li>
                        </ol>
                    </div>

                    <div className="card-body">
                        <div className="form-group">
                            <label htmlFor="email_recover">Enter your email address</label>
                            <input
                                className="form-control"
                                type="text"
                                id="email_recover"
                                required=""
                                onChange={(event) => { setemail_login(event.target.value); }} />
                            <small className="form-text text-muted">
                                Enter the email address you used during the registration on
                                our website. Then we'll email a link to this address.
                            </small>
                        </div>
                    </div>
                    <div className="card-footer">
                        <button id="success btn" className="btn btn-success" type="submit" onClick={sendEmail}>
                            Get New Password
                        </button>
                        <button id="no btn" className="btn btn-danger" type="submit" onClick={redirectLogin}>
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;