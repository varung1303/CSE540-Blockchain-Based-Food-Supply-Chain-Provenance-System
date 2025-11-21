import { useContext, useState } from "react";
import { Collapse, Nav, Navbar, NavbarBrand, NavbarText, NavbarToggler, NavItem } from "reactstrap";
import { NavLink } from 'react-router-dom';

import logo from '../../Assests/Images/logo_mini.png';
import { AuthContext } from "../../Services/Contexts/AuthContext";

const Header = () => {
  const {authState, connectWallet, logout}  = useContext(AuthContext);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isAuthenticated = authState.isAuthenticated;
  const role = authState.stakeholder.role;
  const style = {
    authButton: {
      fontWeight: '600',
      color: '#fff',
      cursor: 'pointer',
      transition: 'opacity 0.2s',
    },
    authText: {
      color: '#fff',
    },
    navbar: {
      backgroundColor: '#2C3E50',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '0.8rem 0',
    },
    brandText: {
      fontSize: '1.3rem',
      fontWeight: '600',
      letterSpacing: '-0.5px',
    }
  }

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  }

  const roleNavLinks = () => {
    switch(role) {
      case 'admin':
        return (
          <>
          <NavItem>
            <NavLink to="/admin/verify/farmer" className="nav-link">Verify Farmer</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/verify/manufacturer" className="nav-link">Verify Manufacturer</NavLink>
          </NavItem>
          </>
        )
      case 'farmer':
        return (
          <>
          <NavItem>
            <NavLink to={`/farmers/${authState.stakeholder.id}`} className="nav-link">Profile</NavLink>
          </NavItem>
          </>
        )
      case 'manufacturer':
        return (
          <>
          <NavItem>
            <NavLink to={`/manufacturers/${authState.stakeholder.id}`} className="nav-link">Profile</NavLink>
          </NavItem>
          </>
        )
      case 'new': 
        return (
          <>
          <NavItem>
            <NavLink to="register" className="nav-link">Register</NavLink>
          </NavItem>
          </>
        )
      default:
        return (
          <>
          <NavItem>
            <NavLink to="profile" className="nav-link">Profile</NavLink>
          </NavItem>
          </>
        )
    }
  }

  return (
    <div className="container-fluid">
      <Navbar
        expand='md'
        dark
        style={style.navbar}
        className="px-4"
      >
        <NavbarBrand style={style.brandText}>
          <img src={logo} style={{marginRight: '10px'}} />
          Supply Chain Tracker
        </NavbarBrand>
        <NavbarToggler onClick={toggleNav} >
          {isNavOpen?
            <i className="fa fa-times"></i>
          :
            <i className="fa fa-bars"></i>
          }
        </NavbarToggler>
        <Collapse navbar isOpen={isNavOpen}>
          <Nav className="me-auto" navbar >
            { isAuthenticated?
              <>
              <NavItem>
                <NavLink className="nav-link" to="/">
                  Dashboard
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-link" to="/products">
                  Products
                </NavLink>
              </NavItem>
              { roleNavLinks() }
              </>
            :
              ""
            }
          </Nav>
          <Nav className="ms-auto" navbar>
            { isAuthenticated?
              <>
              <NavbarText style={style.authText}>
                {authState.formattedAddress} &nbsp;
              </NavbarText>
              <NavItem>
                <NavbarText type="button" onClick={logout} style={style.authButton}>
                  <i className="fa fa-sign-out fa-lg"/>Logout
                </NavbarText>
              </NavItem>
              </>
            :
              <>
              <NavItem>
                <NavbarText type="button" onClick={connectWallet} style={style.authButton}>
                <i className="fa fa-sign-in fa-lg"/> Login
                </NavbarText>
              </NavItem>
              </>
            }
          </Nav>
        </Collapse>
      </Navbar>
      
    </div>
  )
}
export default Header;