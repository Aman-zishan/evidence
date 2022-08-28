import React, { Component } from 'react';
import Identicon from 'identicon.js';
import RegisterUser from './RegisterUser';
import { Link } from 'react-router-dom'
import './navbar.css';
class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark fixed-top flex-md-nowrap shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://localhost:3000/"
          target="_blank"
          rel="noopener noreferrer"
        >
          EMS
        </a>
        <ul className="navbar-nav px-3 ">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block na rightContent">
            <div className="account">
              <div className="navBarFlexBox"><Link to="/register">Register User</Link>
                <Link to="/registerCase">Register Case</Link>
                <Link to="/registerEvidence">Register Evidence</Link>
                <Link to="/showEvidence">Show Evidence</Link>

                {this.props.account
                  ? <img

                    width='30'
                    height='30'
                    src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                  />
                  : <span></span>
                }
              </div>
              <small className="text-secondary addressThing">
                <small id="account">{this.props.account}</small>
              </small>
            </div>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;