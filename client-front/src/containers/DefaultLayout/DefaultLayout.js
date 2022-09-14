import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import ScrollUpButton from "react-scroll-up-button";

import {
  AppFooter,
  AppHeader
} from '@coreui/react';
// routes config
import routes from '../../routes';

import { logoutUser } from '../../actions/authActions';
import { connect } from 'react-redux';

const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  signOut(e) {
    e.preventDefault();
    this.props.logoutUser();
    this.props.history.push('/login');
  }
  
  render() {
    return (
      <div className="app">
        <ScrollUpButton />
        <AppHeader fixed>
          <Suspense  fallback={this.loading()}>
            <DefaultHeader onLogout={e=>this.signOut(e)}/>
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <main className="main">
            <Suspense fallback={this.loading()}>
              <Switch>
                {
                  routes.map((route, idx) => {
                  return route.component ? (
                    <Route
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      render={props => (
                        <route.component {...props} />
                      )} />
                    ) : (null);
                  })
                }
                <Redirect from="/" to="/home" />
              </Switch>
            </Suspense>
          </main>
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, { logoutUser })(DefaultLayout);