import { ReactNode } from 'react';

import BrightnessLowTwoToneIcon from '@mui/icons-material/BrightnessLowTwoTone';
import TableChartTwoToneIcon from '@mui/icons-material/TableChartTwoTone';
import SupervisedUserCircleTwoTone from '@mui/icons-material/SupervisedUserCircleTwoTone';
import SearchTwoTone from '@mui/icons-material/SearchTwoTone';
import SettingsTwoTone from '@mui/icons-material/SettingsTwoTone';
export interface MenuItem {
  link?: string;
  icon?: ReactNode;
  badge?: string;
  items?: MenuItem[];
  name: string;
}

export interface MenuItems {
  items: MenuItem[];
  heading: string;
}

const menuItems: MenuItems[] = [
  {
    heading: 'Dashboards',
    items: [
      {
        name: 'Agrupamiento',
        link: '/dashboards/groups',
        icon: BrightnessLowTwoToneIcon
      },
      {
        name: 'Usuarios',
        link: '/dashboards/users',
        icon: SupervisedUserCircleTwoTone
      },
      {
        name: 'Lista de términos',
        icon: TableChartTwoToneIcon,
        link: '/dashboards/wordlist'
      },
      {
        name: 'Búsqueda avanzada',
        icon: SearchTwoTone,
        link: '/dashboards/advanced'
      }
    ]
  },
  {
    heading: 'Configuración',
    items: [
      {
        name: 'Parámetros',
        icon: SettingsTwoTone,
        link: '/settings/app'
      }
    ]
  }
];

export default menuItems;
