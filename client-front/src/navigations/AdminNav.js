export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'fa fa-home',
    },
    {
      name: 'Danh sách bài học',
      url: '/lesson-list',
      icon: 'icon-list',
    },
    {
      name: 'Khóa học',
      icon: 'fa fa-book',
      children: [
        {
          name: 'Thêm khóa học',
          url: '/add-course',
          icon: 'fa fa-plus',
        },
        {
          name: 'Khóa học của tôi',
          url: '/courses',
          icon: 'fa fa-book',
        },
        {
          name: 'Danh sách khóa học',
          url: '/view-courses',
          icon: 'fa fa-list',
        },
        {
          name: 'Quản lý khóa học',
          url: '/manage-courses',
          icon: 'fa fa-wrench',
        }
      ]
    },    
    {
      name: 'Điểm danh',
      icon: 'fa fa-clock-o',
      children: [
        {
          name: 'Điểm danh học viên',
          url: '/check-attendance',
          icon: 'fa fa-check',
        },
        {
          name: 'Lịch sử điểm danh',
          url: '/list-attendance',
          icon: 'fa fa-history',
        },
      ]
    },
    {
      name: 'Thời khóa biểu',
      icon: 'fa fa-calendar',
      children: [
        {
          name: 'Sửa thời khóa biểu',
          url: '/add-schedule',
          icon: 'icon-calendar',
        },
        {
          name: 'Xem thời khóa biểu',
          url: '/schedule',
          icon: 'fa fa-calendar',
        },
      ]
    },
    {
      name: 'Kiểm tra trắc nghiệm',
      icon: 'fa fa-question-circle',
      children: [
        {
          name: 'Danh sách',
          url: '/quiz',
          icon: 'icon-list',
        },
        {
          name: 'Thêm bài kiểm tra',
          url: '/quiz/add',
          icon: 'icon-plus',
        },
      ]
    },
    {
      name: 'Quản lý cột điểm',
      url: '/point-list',
      icon: 'fa fa-bars',
    },
    {
      name: 'Tạo tài khoản',
      url: '/create-account',
      icon: 'fa fa-user-plus',
    }
  ],
};
