export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'fa fa-home',
    },
    {
      name: 'Khóa học của tôi',
      url: '/courses',
      icon: 'fa fa-book',
    },
    {
      name: 'Điểm danh học viên',
      url: '/check-attendance',
      icon: 'fa fa-check',
    },
    {
      name: 'Xem thời khóa biểu',
      url: '/schedule',
      icon: 'fa fa-calendar',
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
    }
  ],
};
