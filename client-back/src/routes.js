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
  { path: '/', exact: true, name: 'Trang chủ', component: DefaultLayout },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/edit-profile', exact: true, name: 'Thay đổi thông tin', component: EditProfile },
  { path: '/edit-profile-teacher', exact: true, name: 'Thay đổi thông tin giáo viên', component: EditProfileTeacher },
  { path: '/add-course', exact: true, name: 'Thêm khóa học', component: AddCourse },
  { path: '/courses', exact: true, name: 'Khóa học của tôi', component: CourseList },
  { path: '/view-courses', exact: true, name: 'Danh sách khóa học', component: ViewCourseList },
  { path: '/view-courses/:id', exact: true, name: 'Nội dung khóa học', component: CourseDetail },
  { path: '/courses/:id', exact: true, name: 'Nội dung khóa học', component: CourseDetail },
  { path: '/quiz', exact: true, name: 'Danh sách bài trắc nghiệm', component: QuizList },
  { path: '/quiz/test/:id', exact: true, name: 'Nội dung trắc nghiệm', component: QuizTest },
  { path: '/quiz/test-result/:id', exact: true, name: 'Kết quả kiểm tra trắc nghiệm', component: QuizTestResult },
  { path: '/quiz/excercise/:id', exact: true, name: 'Nội dung bài bài tập trắc nghiệm', component: QuizExercise },
  { path: '/quiz/add', exact: true, name: 'Thêm bài kiểm tra trắc nghiệm', component: QuizAdd },
  { path: '/check-attendance', exact: true, name: 'Điểm danh', component: CheckAttendance },
  { path: '/list-attendance', exact: true, name: 'Lịch sử điểm danh', component: ListAttendance },
  { path: '/add-schedule', exact: true, name: 'Chỉnh sửa thời khóa biểu', component: AddSchedule },
  { path: '/schedule', exact: true, name: 'Xem thời khóa biểu', component: Schedule },
  { path: '/student-info/:id', exact: true, name: 'Thông tin học viên', component: StudentInfo },
  { path: '/course-info/:id', exact: true, name: 'Thông tin khóa học', component: CourseInfo },
  { path: '/manage-courses', exact: true, name: 'Quản lý khóa học', component: ManageCourses },
  { path: '/score/:courseId/:exerciseId', exact: true, name: 'Chấm điểm', component: ScoreExercise },
  { path: '/manage-courses/approve/student/:courseId', exact: true, name: 'Quản lý học viên', component: ApproveStudent },
  { path: '/manage-courses/approve/student/:courseId/add-student', exact: true, name: 'Thêm học viên mới', component: AddStudent },
  { path: '/manage-courses/approve/student/:courseId/add-joined-student', exact: true, name: 'Thêm học viên cũ', component: AddJoinedStudent },
  { path: '/manage-courses/edit-course/:courseId', exact: true, name: 'Chỉnh sửa khóa học', component: EditCourse },
  { path: '/manage-courses/approve/teacher/:courseId', exact: true, name: 'Quản lý giáo viên', component: ApproveTeacher },
  { path: '/point-list', exact: true, name: 'Quản lý cột điểm', component: PointList },
  { path: '/courses/:id/add-in-lesson/:lessonId', exact: true, name: 'Nội dung bài học', component: InLesson },
  { path: '/courses/:id/add-in-lesson/:lessonId/add-quiz', exact: true, name: 'Chọn quiz cho bài học', component: ChooseQuiz },
  { path: '/courses/:id/lesson/:lessonId', exact: true, name: 'Nội dung bài học', component: Lesson },
  { path: '/view-courses/:id/lesson/:lessonId', exact: true, name: 'Nội dung bài học', component: Lesson },
  { path: '/courses/:id/lesson/:lessonId/:quizId', exact: true, name: 'Bài trắc nghiệm', component: QuizLesson },
  { path: '/quiz/quiz-detail/:id', exact: true, name: 'Nội dung bài trắc nghiệm', component: QuizDetail },
  { path: '/lesson-list', exact: true, name: 'Danh sách bài học', component: LessonList },
  { path: '/lesson-list/:listId', exact: true, name: 'Nội dung danh sách bài học', component: EditLessonList },
  { path: '/lesson-list/:listId/edit-lesson/:lessonId', exact: true, name: 'Chỉnh sửa nội dung bài học', component: EditLesson },
  { path: '/my-info', exact: true, name: 'Thông tin cá nhân', component: MyInfo },
  { path: '/quiz/add/csv', exact: true, name: 'Thêm bằng tập tin csv', component: AddQuizCSV },
  { path: '/create-account', exact: true, name: 'Tạo tài khoản', component: CreateAccount },
  { path: '/accounts', exact: true, name: 'Danh sách tài khoản', component: AccountList },
  { path: '/accounts/:id', exact: true, name: 'Chỉnh sửa tài khoản', component: EditAccount },
  { path: '/school-info', exact: true, name: 'Thông tin trung tâm', component: SchoolInfo },
  { path: '/infrastructure', exact: true, name: 'Danh sách cơ sở', component: ListInfrastructure },
  { path: '/infrastructure/add', exact: true, name: 'Thêm cơ sở', component: AddInfrastructure },
  { path: '/infrastructure/edit/:id', exact: true, name: 'Chỉnh sửa cơ sở', component: EditInfrastructure },
  { path: '/choose-option/:userId/:courseId', exact: true, name: 'Chọn phương án không thể mở lớp', component: ReplyMail },
  { path: '/choose-option/:userId/:courseId/change-course', exact: true, name: 'Chuyển sang khóa học khác', component: ChangeCourse },
  { path: '/choose-option/:userId/:courseId/change-course/:id', exact: true, name: 'Thông tin khóa học', component: ChangeCourseInfo },
  { path: '/quiz/quiz-detail/:id/quiz-bank', exact: true, name: 'Chọn danh mục', component: AddFromQuizBank },
  { path: '/quiz/quiz-detail/:id/quiz-bank/:catId', exact: true, name: 'Chọn câu hỏi', component: AddFromCategory },
  { path: '/quiz/quiz-detail/:id/add-quiz-csv', exact: true, name: 'Import CSV câu hỏi mới', component: AddMoreQuizCSV },
  { path: '/print-info/:courseId/:studentId', exact: true, name: 'In thông tin học viên trong khóa học', component: PrintInfo },
  { path: '/print-certificate/:courseId/:studentId', exact: true, name: 'In chứng chỉ cho học viên', component: PrintCertificate },
  { path: '/quiz-bank', exact: true, name: 'Ngân hàng câu hỏi', component: QuizBank },
  { path: '/quiz-bank/:id', exact: true, name: 'Danh mục', component: Category },
  { path: '/quiz-bank/:id/add-quiz', exact: true, name: 'Nhập câu hỏi mới', component: AddMoreQuizBank },
  { path: '/quiz-bank/:id/add-quiz-csv', exact: true, name: 'Import CSV câu hỏi mới', component: AddMoreQuizCSVBank },
  { path: '/student-accounts', exact: true, name: 'Danh sách tài khoản học viên', component: StudentAccountList },
  { path: '/student-accounts/edit/:id', exact: true, name: 'Chỉnh sửa tài khoản học viên', component: EditStudentAccount },
  { path: '/student-accounts/out-course/:id', exact: true, name: 'Khóa học của học viên', component: StudentCourse },

];

export default routes;

