import React, { Component } from 'react';
import {withRouter, Link } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/Ai-Edu.png'
import { getCurrentProfile } from '../../actions/profileActions';

const defaultProps = {};

class DefaultHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: ''
    };
  }

  toEditProfile = e => {
    if(this.props.auth.user.role === 'teacher')
      this.props.history.push('/edit-profile-teacher');
    else
      this.props.history.push('/edit-profile');    
  }

  componentDidMount = () => {
    this.props.getCurrentProfile();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile.profile) {
      const { profile } = nextProps.profile
      this.setState({ profile })
    }
  }

  render() {
    const { role } = this.props.auth.user;
    const { profile } = this.state;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand full={{ src: logo, width: 50, height: 50, alt: 'Logo' }} />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <Link to="/">Dashboard</Link>
          </NavItem>
          {
            role === 'student'
            ?
            <NavItem className="px-3">
              <Link to="/my-info">Thông tin cá nhân</Link>
            </NavItem>
            :
            <React.Fragment>
              {
                role === 'teacher'
                ?
                <NavItem className="px-3">
                  <Link to="/edit-profile-teacher">Thông tin cá nhân</Link>
                </NavItem>
                :
                <NavItem className="px-3">
                  <Link to="/edit-profile">Thông tin cá nhân</Link>
                </NavItem>
              }
            </React.Fragment>
          }
        </Nav>
        <Nav className="ml-auto" navbar style={{marginRight: 10}}>
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              <img src={profile.photo} className="img-avatar" alt="ava" />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header tag="div" className="text-center"><strong>Tài khoản</strong></DropdownItem>
              <DropdownItem tag="div" style={{textAlign: 'center'}}>
                <b>{profile.name}</b><br/> 
                <small style={{color:'grey'}}>{profile.email} </small>
              </DropdownItem>
              <DropdownItem onClick={this.toEditProfile}><i className="fa fa-user"></i> Thay đổi thông tin </DropdownItem>
              <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-lock"></i> Đăng Xuất</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = {
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
};

DefaultHeader.defaultProps = defaultProps;

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});


export default connect(mapStateToProps, { getCurrentProfile })(withRouter(DefaultHeader));
