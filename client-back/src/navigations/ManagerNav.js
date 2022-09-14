export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'fa fa-home',
    },
    {
      name: 'Danh sách khóa học',
      url: '/view-courses',
      icon: 'icon-book-open',
    },
    {
      name: 'Tài khoản',
      icon: 'fa fa-user',
      children: [
        {
          name: 'Tạo tài khoản',
          url: '/create-account',
          icon: 'fa fa-user-plus',
        },
        {
          name: 'Tài khoản cán bộ',
          url: '/accounts',
          icon: 'fa fa-users',
        },
        {
          name: 'Tài khoản học viên',
          url: '/student-accounts',
          icon: 'fa fa-users',
        }
      ]
    },
    {
      name: 'Quản lý trung tâm',
      icon: 'fa fa-info-circle',
      children: [
        {
          name: 'Thông tin trung tâm',
          url: '/school-info',
          icon: 'fa fa-info-circle',
        },
        {
          name: 'Danh sách cơ sở',
          url: '/infrastructure',
          icon: 'fa fa-map-marker',
        },
      ]
    }
  ]
};
