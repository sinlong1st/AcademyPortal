import React from 'react';
import DefaultLayout from './containers/DefaultLayout';


const Dashboard = React.lazy(() => import('./views/Dashboard'));
const EditProfile = React.lazy(() => import('./views/EditProfile/EditProfile'));
const EditProfileTeacher = React.lazy(() => import('./views/EditProfile/EditProfileTeacher'));
const AddCourse = React.lazy(() => import('./views/Courses/AddCourse'));
const CourseList = React.lazy(() => import('./views/Courses/CourseList'));
const CourseDetail = React.lazy(() => import('./views/Courses/CourseDetail'));
const QuizAdd = React.lazy(() => import('./views/Quiz/AddQuiz'));
const QuizList = React.lazy(() => import('./views/Quiz/QuizList'));
const QuizExercise = React.lazy(() => import('./views/Quiz/QuizExcercise'));
const QuizTest = React.lazy(() => import('./views/Quiz/QuizTest'));
const QuizTestResult = React.lazy(() => import('./views/Quiz/QuizTestResult'));
const CheckAttendance = React.lazy(() => import('./views/Attendance/CheckAttendance'));
const ListAttendance = React.lazy(() => import('./views/Attendance/ListAttendance'));
const AddSchedule = React.lazy(() => import('./views/Schedule/AddSchedule'));
const Schedule = React.lazy(() => import('./views/Schedule/Schedule'));
const StudentInfo = React.lazy(() => import('./views/StudentInfo/StudentInfo'));
const CourseInfo = React.lazy(() => import('./views/Courses/CourseInfo'));
const ManageCourses = React.lazy(() => import('./views/Courses/ManageCourses'));
const ApproveStudent = React.lazy(() => import('./views/Courses/ApproveStudent'));
const AddStudent = React.lazy(() => import('./views/Courses/AddStudent'));
const AddJoinedStudent = React.lazy(() => import('./views/Courses/AddJoinedStudent'));
const ApproveTeacher = React.lazy(() => import('./views/Courses/ApproveTeacher'));
const EditCourse = React.lazy(() => import('./views/Courses/EditCourse'));
const PointList = React.lazy(() => import('./views/PointList/PointList'));
const ScoreExercise = React.lazy(() => import('./views/ScoreExercise/ScoreExercise'));
const InLesson = React.lazy(() => import('./views/Lesson/InLesson'));
const Lesson = React.lazy(() => import('./views/Lesson/Lesson'));
const QuizLesson = React.lazy(() => import('./views/Lesson/Quiz/QuizLesson'));
const QuizDetail= React.lazy(() => import('./views/Quiz/QuizDetail'));
const LessonList= React.lazy(() => import('./views/LessonList/LessonList'));
const EditLessonList= React.lazy(() => import('./views/LessonList/EditLessonList'));
const EditLesson= React.lazy(() => import('./views/LessonList/EditLesson'));
const MyInfo = React.lazy(() => import('./views/MyInfo/MyInfo'));
const AddQuizCSV = React.lazy(() => import('./views/Quiz/AddQuizCSV'));
const CreateAccount = React.lazy(() => import('./views/Accounts/CreateAccount'));
const AccountList = React.lazy(() => import('./views/Accounts/AccountList'));
const EditAccount = React.lazy(() => import('./views/Accounts/EditAccount'));
const ViewCourseList = React.lazy(() => import('./views/Courses/ViewCourseList'));
const SchoolInfo = React.lazy(() => import('./views/SchoolInfo/SchoolInfo'));
const ListInfrastructure = React.lazy(() => import('./views/SchoolInfo/Infrastructure'));
const AddInfrastructure = React.lazy(() => import('./views/SchoolInfo/AddInfrastructure'));
const EditInfrastructure = React.lazy(() => import('./views/SchoolInfo/EditInfrastructure'));
const ReplyMail = React.lazy(() => import('./views/ReplyMail/ReplyMail'));
const ChangeCourse = React.lazy(() => import('./views/ReplyMail/ChangeCourse'));
const ChangeCourseInfo = React.lazy(() => import('./views/ReplyMail/ChangeCourseInfo'));
const AddFromQuizBank = React.lazy(() => import('./views/Quiz/AddFromQuizBank'));
const AddFromCategory = React.lazy(() => import('./views/Quiz/AddFromCategory'));
const AddMoreQuizCSV = React.lazy(() => import('./views/Quiz/AddMoreQuizCSV'));
const PrintInfo = React.lazy(() => import('./views/PrintInfo/PrintInfo'));
const PrintCertificate = React.lazy(() => import('./views/PrintInfo/PrintCertificate'));
const ChooseQuiz = React.lazy(() => import('./views/Lesson/Quiz/ChooseQuiz'));
const QuizBank = React.lazy(() => import('./views/QuizBank/QuizBank'));
const Category = React.lazy(() => import('./views/QuizBank/Category'));
const AddMoreQuizBank = React.lazy(() => import('./views/QuizBank/AddMoreQuiz'));
const AddMoreQuizCSVBank = React.lazy(() => import('./views/QuizBank/AddMoreQuizCSV'));
const StudentAccountList = React.lazy(() => import('./views/Accounts/StudentAccountList'));
const EditStudentAccount = React.lazy(() => import('./views/Accounts/EditStudentAccount'));
const StudentCourse = React.lazy(() => import('./views/Accounts/StudentCourse'));


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Trang ch???', component: DefaultLayout },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/edit-profile', exact: true, name: 'Thay ?????i th??ng tin', component: EditProfile },
  { path: '/edit-profile-teacher', exact: true, name: 'Thay ?????i th??ng tin gi??o vi??n', component: EditProfileTeacher },
  { path: '/add-course', exact: true, name: 'Th??m kh??a h???c', component: AddCourse },
  { path: '/courses', exact: true, name: 'Kh??a h???c c???a t??i', component: CourseList },
  { path: '/view-courses', exact: true, name: 'Danh s??ch kh??a h???c', component: ViewCourseList },
  { path: '/view-courses/:id', exact: true, name: 'N???i dung kh??a h???c', component: CourseDetail },
  { path: '/courses/:id', exact: true, name: 'N???i dung kh??a h???c', component: CourseDetail },
  { path: '/quiz', exact: true, name: 'Danh s??ch b??i tr???c nghi???m', component: QuizList },
  { path: '/quiz/test/:id', exact: true, name: 'N???i dung tr???c nghi???m', component: QuizTest },
  { path: '/quiz/test-result/:id', exact: true, name: 'K???t qu??? ki???m tra tr???c nghi???m', component: QuizTestResult },
  { path: '/quiz/excercise/:id', exact: true, name: 'N???i dung b??i b??i t???p tr???c nghi???m', component: QuizExercise },
  { path: '/quiz/add', exact: true, name: 'Th??m b??i ki???m tra tr???c nghi???m', component: QuizAdd },
  { path: '/check-attendance', exact: true, name: '??i???m danh', component: CheckAttendance },
  { path: '/list-attendance', exact: true, name: 'L???ch s??? ??i???m danh', component: ListAttendance },
  { path: '/add-schedule', exact: true, name: 'Ch???nh s???a th???i kh??a bi???u', component: AddSchedule },
  { path: '/schedule', exact: true, name: 'Xem th???i kh??a bi???u', component: Schedule },
  { path: '/student-info/:id', exact: true, name: 'Th??ng tin h???c vi??n', component: StudentInfo },
  { path: '/course-info/:id', exact: true, name: 'Th??ng tin kh??a h???c', component: CourseInfo },
  { path: '/manage-courses', exact: true, name: 'Qu???n l?? kh??a h???c', component: ManageCourses },
  { path: '/score/:courseId/:exerciseId', exact: true, name: 'Ch???m ??i???m', component: ScoreExercise },
  { path: '/manage-courses/approve/student/:courseId', exact: true, name: 'Qu???n l?? h???c vi??n', component: ApproveStudent },
  { path: '/manage-courses/approve/student/:courseId/add-student', exact: true, name: 'Th??m h???c vi??n m???i', component: AddStudent },
  { path: '/manage-courses/approve/student/:courseId/add-joined-student', exact: true, name: 'Th??m h???c vi??n c??', component: AddJoinedStudent },
  { path: '/manage-courses/edit-course/:courseId', exact: true, name: 'Ch???nh s???a kh??a h???c', component: EditCourse },
  { path: '/manage-courses/approve/teacher/:courseId', exact: true, name: 'Qu???n l?? gi??o vi??n', component: ApproveTeacher },
  { path: '/point-list', exact: true, name: 'Qu???n l?? c???t ??i???m', component: PointList },
  { path: '/courses/:id/add-in-lesson/:lessonId', exact: true, name: 'N???i dung b??i h???c', component: InLesson },
  { path: '/courses/:id/add-in-lesson/:lessonId/add-quiz', exact: true, name: 'Ch???n quiz cho b??i h???c', component: ChooseQuiz },
  { path: '/courses/:id/lesson/:lessonId', exact: true, name: 'N???i dung b??i h???c', component: Lesson },
  { path: '/view-courses/:id/lesson/:lessonId', exact: true, name: 'N???i dung b??i h???c', component: Lesson },
  { path: '/courses/:id/lesson/:lessonId/:quizId', exact: true, name: 'B??i tr???c nghi???m', component: QuizLesson },
  { path: '/quiz/quiz-detail/:id', exact: true, name: 'N???i dung b??i tr???c nghi???m', component: QuizDetail },
  { path: '/lesson-list', exact: true, name: 'Danh s??ch b??i h???c', component: LessonList },
  { path: '/lesson-list/:listId', exact: true, name: 'N???i dung danh s??ch b??i h???c', component: EditLessonList },
  { path: '/lesson-list/:listId/edit-lesson/:lessonId', exact: true, name: 'Ch???nh s???a n???i dung b??i h???c', component: EditLesson },
  { path: '/my-info', exact: true, name: 'Th??ng tin c?? nh??n', component: MyInfo },
  { path: '/quiz/add/csv', exact: true, name: 'Th??m b???ng t???p tin csv', component: AddQuizCSV },
  { path: '/create-account', exact: true, name: 'T???o t??i kho???n', component: CreateAccount },
  { path: '/accounts', exact: true, name: 'Danh s??ch t??i kho???n', component: AccountList },
  { path: '/accounts/:id', exact: true, name: 'Ch???nh s???a t??i kho???n', component: EditAccount },
  { path: '/school-info', exact: true, name: 'Th??ng tin trung t??m', component: SchoolInfo },
  { path: '/infrastructure', exact: true, name: 'Danh s??ch c?? s???', component: ListInfrastructure },
  { path: '/infrastructure/add', exact: true, name: 'Th??m c?? s???', component: AddInfrastructure },
  { path: '/infrastructure/edit/:id', exact: true, name: 'Ch???nh s???a c?? s???', component: EditInfrastructure },
  { path: '/choose-option/:userId/:courseId', exact: true, name: 'Ch???n ph????ng ??n kh??ng th??? m??? l???p', component: ReplyMail },
  { path: '/choose-option/:userId/:courseId/change-course', exact: true, name: 'Chuy???n sang kh??a h???c kh??c', component: ChangeCourse },
  { path: '/choose-option/:userId/:courseId/change-course/:id', exact: true, name: 'Th??ng tin kh??a h???c', component: ChangeCourseInfo },
  { path: '/quiz/quiz-detail/:id/quiz-bank', exact: true, name: 'Ch???n danh m???c', component: AddFromQuizBank },
  { path: '/quiz/quiz-detail/:id/quiz-bank/:catId', exact: true, name: 'Ch???n c??u h???i', component: AddFromCategory },
  { path: '/quiz/quiz-detail/:id/add-quiz-csv', exact: true, name: 'Import CSV c??u h???i m???i', component: AddMoreQuizCSV },
  { path: '/print-info/:courseId/:studentId', exact: true, name: 'In th??ng tin h???c vi??n trong kh??a h???c', component: PrintInfo },
  { path: '/print-certificate/:courseId/:studentId', exact: true, name: 'In ch???ng ch??? cho h???c vi??n', component: PrintCertificate },
  { path: '/quiz-bank', exact: true, name: 'Ng??n h??ng c??u h???i', component: QuizBank },
  { path: '/quiz-bank/:id', exact: true, name: 'Danh m???c', component: Category },
  { path: '/quiz-bank/:id/add-quiz', exact: true, name: 'Nh???p c??u h???i m???i', component: AddMoreQuizBank },
  { path: '/quiz-bank/:id/add-quiz-csv', exact: true, name: 'Import CSV c??u h???i m???i', component: AddMoreQuizCSVBank },
  { path: '/student-accounts', exact: true, name: 'Danh s??ch t??i kho???n h???c vi??n', component: StudentAccountList },
  { path: '/student-accounts/edit/:id', exact: true, name: 'Ch???nh s???a t??i kho???n h???c vi??n', component: EditStudentAccount },
  { path: '/student-accounts/out-course/:id', exact: true, name: 'Kh??a h???c c???a h???c vi??n', component: StudentCourse },

];

export default routes;

