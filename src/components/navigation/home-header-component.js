import React from "react";
import { connect } from "react-redux";
import LoginButton from "./login-logout/login-button";
import LogoutButton from "./login-logout/logout-button";

const Header = (props) => {
    let loggingButton = props.isLoggedIn ? <LogoutButton/> : <LoginButton/>;
    
    return (
    <div id="nav">
        <nav className="navbar navbar-expand-md bg-warning fixed-top">
            <a className="navbar-brand" href="/"><img src="jerklogo.png" alt="logo" width="140" height="50"></img></a>
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  {loggingButton}
                </li>
            </ul>
        </nav>
    </div>
    );
};

function mapStateToProps(store) {
    return {
        isLoggedIn : store.isLoggedIn,
    };
}

export default connect(mapStateToProps)(Header);
