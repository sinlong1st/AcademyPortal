import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import ScrollUpButton from "react-scroll-up-button";
import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import TeacherNavigation from '../../navigations/TeacherNav';
import StudentNavigation from '../../navigations/StudentNav';
import AdminNavigation from '../../navigations/AdminNav';
import MinistryNavigation from '../../navigations/MinistryNav';
import EducatorNavigation from '../../navigations/EducatorNav';
import ManagerNavigation from '../../navigations/ManagerNav';

// routes config
import routes from '../../routes';

import { logoutUser } from '../../actions/authActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const DefaultAside = React.lazy(() => import('./DefaultAside'));
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
    const { role } = this.props.auth.user
    let AppSidebarNavRole;

    switch (role.toString()) {
      case 'student': AppSidebarNavRole = <AppSidebarNav navConfig={StudentNavigation} {...this.props} />;break;
      case 'teacher': AppSidebarNavRole = <AppSidebarNav navConfig={TeacherNavigation} {...this.props} />;break;
      case 'educator': AppSidebarNavRole = <AppSidebarNav navConfig={EducatorNavigation} {...this.props} />;break;
      case 'ministry': AppSidebarNavRole = <AppSidebarNav navConfig={MinistryNavigation} {...this.props} />;break;  
      case 'manager': AppSidebarNavRole = <AppSidebarNav navConfig={ManagerNavigation} {...this.props} />;break;     
      case 'admin': AppSidebarNavRole = <AppSidebarNav navConfig={AdminNavigation} {...this.props} />;break;   
      default: break;
    }

    return (
      <div className="app">
        <ScrollUpButton />
        <AppHeader fixed>
          <Suspense  fallback={this.loading()}>
            <DefaultHeader onLogout={e=>this.signOut(e)}/>
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              {AppSidebarNavRole}
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes}/>
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        render={props => (
                          <route.component {...props} />
                        )} />
                      ) : (null);
                  })}
                  
                  <Redirect from="/" to="/dashboard" />
                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside>
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

DefaultLayout.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(DefaultLayout);