import React, { Component } from 'react';
import Loadable from 'react-loadable';
import setAuthToken from './utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import store from './store/store';
import { setCurrentUser, logoutUser } from './actions/authActions';
import './App.scss';
import { Switch, Route , withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Auth from './store/auth';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = Loadable({
  loader: () => import('./containers/DefaultLayout'),
  loading
});

// Pages
const Login = Loadable({
  loader: () => import('./views/Pages/Login'),
  loading
});

const ForgetCP = Loadable({
  loader: () => import('./views/ForgetCP/ForgetCP'),
  loading
});

const ResetPassword = Loadable({
  loader: () => import('./views/ForgetCP/ResetPassword'),
  loading
});

const Start = Loadable({
  loader: () => import('./views/Start/Start'),
  loading
});

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = '/login';
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    Auth.isUserAuthenticated() ? (
      <Component {...props} />
    ) : (
        <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }} />
      )
  )} />
);

class App extends Component {

  render() {
    const { location, auth } = this.props;

    return (
      <div>
        { auth.isAuthenticated === true
          ? <PrivateRoute path="/" component={DefaultLayout} />
          : <div className="main">
              <Switch location={location}>
                <Route path="/login" component={Login} />
                <Route path="/forget" component={ForgetCP} />
                <Route path="/start" component={Start} />
                <Route path="/reset-password/:userId" component={ResetPassword} />
                <Route component={Login} />
              </Switch>
            </div>
        }
        </div>
    );
  }
}

App.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(connect(mapStateToProps)(App));
