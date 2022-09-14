import React from 'react';
import DefaultLayout from './containers/DefaultLayout';
import Vnpay from './views/Vnpay';

const Login = React.lazy(() => import('./views/Login'));
const Register = React.lazy(() => import('./views/Register'));
const Home = React.lazy(() => import('./views/Home'));
const Confirm = React.lazy(() => import('./views/Confirm'));
const EditProfile = React.lazy(() => import('./views/EditProfile'));
const CourseInfo = React.lazy(() => import('./views/CourseInfo'));
const AllCourse = React.lazy(() => import('./views/AllCourse'));
const AboutUs = React.lazy(() => import('./views/AboutUs'));
const ChangeCourse = React.lazy(() => import('./views/ChangeCourse'));
const OutCourse = React.lazy(() => import('./views/OutCourse'));
const WaitCourse = React.lazy(() => import('./views/WaitCourse'));


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, component: DefaultLayout },
  { path: '/home', component: Home },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/confirm/:id', component: Confirm },
  { path: '/edit-profile', component: EditProfile },
  { path: '/course-info/:courseId', component: CourseInfo },
  { path: '/all-course', component: AllCourse },
  { path: '/about-us', component: AboutUs },
  { path: '/vnpay_return', component: Vnpay },
  { path: '/wait-course/:userId/:courseId', component: WaitCourse },
  { path: '/out-course/:userId/:courseId', component: OutCourse },
  { path: '/change-course/:userId/:courseId', component: ChangeCourse }

];

export default routes;

