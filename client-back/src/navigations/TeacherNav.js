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
          name: 'Ngân hàng câu hỏi',
          url: '/quiz-bank',
          icon: 'fa fa-bank',
        },
        {
          name: 'Các bài kiểm tra',
          url: '/quiz',
          icon: 'fa fa-question-circle',
        }
      ]
    },
    {
      name: 'Quản lý cột điểm',
      url: '/point-list',
      icon: 'fa fa-tasks',
    }
  ],
};
