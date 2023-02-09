import {useSelector} from 'react-redux';

export const sub_menu_spl = [
  {
    Engineer: [
      {
        key: 0,
        title: 'Overtime Orders',
        icon: 'md-list-outline',
        nav: 'ListSPL',
      },
      {
        key: 1,
        title: 'History',
        icon: 'md-calendar-outline',
        nav: 'HistorySPL',
      },
    ],
    Supervisor: [
      {
        key: 0,
        title: 'Submit SPL',
        icon: 'md-push-outline',
        nav: 'RequestSPL',
      },
      {
        key: 1,
        title: 'History',
        icon: 'md-calendar-outline',
        nav: 'HistorySPL',
      },
      {
        key: 2,
        title: 'Approval SPL',
        icon: 'md-checkmark-outline',
        nav: 'ListApprovalSPL',
      },
    ],
  },
];

export const sub_menu_assignment = [
  {
    Engineer: [
      {
        key: 0,
        title: 'PREVENTIF MAINTENANCE',
        icon: 'ios-clipboard-outline',
        nav: 'AdminPreventif',
      },
      {
        key: 1,
        title: 'CORRECTIVE MAINTENANCE',
        icon: 'ios-build-outline',
        nav: 'AdminHelpdeskDashboard',
      },
    ],
    Supervisor: [
      {
        key: 0,
        title: 'PREVENTIF MAINTENANCE',
        icon: 'ios-clipboard-outline',
        nav: 'AdminSPVPreventifDashboard',
      },
      {
        key: 1,
        title: 'CORRECTIVE MAINTENANCE',
        icon: 'ios-clipboard-outline',
        nav: 'AdminHelpdeskDashboard',
      },
    ],
  },
];
