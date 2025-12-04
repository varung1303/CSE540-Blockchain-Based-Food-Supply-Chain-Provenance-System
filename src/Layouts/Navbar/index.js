import { useContext, useState } from "react";
import { Collapse, Nav, Navbar, NavbarBrand, NavbarText, NavbarToggler, NavItem } from "reactstrap";
import { NavLink } from 'react-router-dom';

import { AuthContext } from "../../Services/Contexts/AuthContext";

const Header = () => {
  const {authState, connectWallet, logout}  = useContext(AuthContext);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isAuthenticated = authState.isAuthenticated;
  const role = authState.stakeholder.role;
  const style = {
    authButton: {
      fontWeight: '500',
      color: '#fff',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      padding: '8px 16px',
      borderRadius: '8px',
      background: 'rgba(255,255,255,0.1)',
    },
    authText: {
      color: '#fff',
      fontWeight: '400',
    },
    navbar: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      padding: '1rem 0',
      backdropFilter: 'blur(10px)',
    },
    brandText: {
      fontSize: '1.5rem',
      fontWeight: '700',
      letterSpacing: '0.5px',
      background: 'linear-gradient(90deg, #fff 0%, #f0f0f0 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
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
      case 'retailer':
      case 'distributor':
      case 'consumer':
        return (
          <>
          <NavItem>
            <NavLink to="/profile" className="nav-link">Profile</NavLink>
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