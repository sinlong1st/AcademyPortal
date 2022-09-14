import React, { Component, Fragment } from 'react';
import {withRouter, Link } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { AppHeaderDropdown, AppNavbarBrand } from '@coreui/react';
import logo from '../../assets/img/Ai-Edu.png'
import Auth from '../../store/auth';
import { getCurrentProfile } from '../../actions/profileActions';
import isEmptyObj from '../../validation/is-empty';

class DefaultHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: '',
      user: '',
      name: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile.profile) {
      const { profile } = nextProps.profile
      this.setState({ profile })
    }

    if (nextProps.auth) {
      const { user } = nextProps.auth
      this.setState({ user })
    }

    const { school } = nextProps.school;
    if(!isEmptyObj(school))
    {
      this.setState({ 
        name: school.name
      });
    }
  }

  render() {
    const { profile, user, name } = this.state;
    return (
      <Fragment>
        <AppNavbarBrand className='changeCursor' onClick={()=>this.props.history.push('/')}>
          <img src={logo} style={{width: 50, height: 50, marginLeft: 100}} alt="logo" />
          <b style={{ marginLeft: 20}}>{name}</b>
        </AppNavbarBrand>
        {
          Auth.isUserAuthenticated()
          ?
          <div>
            {
              !isEmptyObj(profile)
              ?
              <Nav className="d-md-down-none" navbar style={{marginRight: 10}}>
                <NavItem className="px-3">
                  <Link to="/">Trang chủ</Link>
                </NavItem>
                <NavItem className="px-3">
                  <Link to="/all-course">Khóa học hiện có</Link>
                </NavItem>
                <NavItem className="px-3">
                  <Link to="/about-us">Giới thiệu</Link>
                </NavItem>
                <AppHeaderDropdown direction="down">
                  <DropdownToggle nav>
                    <img src={profile.photo} className="img-avatar" alt="ava" />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header tag="div" className="text-center"><strong>Tài khoản</strong></DropdownItem>
                    <DropdownItem tag="div" className="text-center">
                      <b>{profile.name}</b><br/> 
                      <small style={{color:'grey'}}>{profile.email} </small>
                    </DropdownItem>
                    <DropdownItem onClick={()=>this.props.history.push('/edit-profile')}><i className="fa fa-user"></i> Thay đổi thông tin </DropdownItem>
                    <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-lock"></i> Đăng Xuất</DropdownItem>
                  </DropdownMenu>
                </AppHeaderDropdown>
              </Nav>
              :
              <Nav className="d-md-down-none" navbar style={{marginRight: 10}}>
                <NavItem className="px-3">
                  <Link to="/">Trang chủ</Link>
                </NavItem>
                <NavItem className="px-3">
                  <Link to="/all-course">Khóa học hiện có</Link>
                </NavItem>
                <NavItem className="px-3">
                  <Link to="/about-us">Giới thiệu</Link>
                </NavItem>
                <AppHeaderDropdown direction="down">
                  <DropdownToggle nav>
                    <img src={user.photo} className="img-avatar" alt="ava" />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header tag="div" className="text-center"><strong>Tài khoản</strong></DropdownItem>
                    <DropdownItem tag="div" className="text-center">
                      <b>{user.name}</b><br/> 
                      <small style={{color:'grey'}}>{user.email} </small>
                    </DropdownItem>
                    <DropdownItem onClick={()=>this.props.history.push('/edit-profile')}><i className="fa fa-user"></i> Thay đổi thông tin </DropdownItem>
                    <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-lock"></i> Đăng Xuất</DropdownItem>
                  </DropdownMenu>
                </AppHeaderDropdown>
              </Nav>
            }
          </div>
          :
          <Nav className="d-md-down-none" navbar style={{marginRight: 10}}>
            <NavItem className="px-3">
              <Link to="/">Trang chủ</Link>
            </NavItem>
            <NavItem className="px-3">
              <Link to="/all-course">Khóa học hiện có</Link>
            </NavItem>
            <NavItem className="px-3">
              <Link to="/about-us">Giới thiệu</Link>
            </NavItem>
            <Button color='primary' onClick={() => this.props.history.push('/login')}><b>Đăng nhập</b></Button>
          </Nav>
        }
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth,
  school: state.school
});

export default connect(mapStateToProps, { getCurrentProfile })(withRouter(DefaultHeader));