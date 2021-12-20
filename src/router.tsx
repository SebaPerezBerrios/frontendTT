import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { PartialRouteObject } from 'react-router';

import SidebarLayout from 'src/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';
import Advanced from './content/dashboards/Advanced';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Pages

// Dashboards

const KMeans = Loader(lazy(() => import('src/content/dashboards/KMeans')));

const KMeansUsers = Loader(
  lazy(() => import('src/content/dashboards/KMeansUsers'))
);

const WordList = Loader(lazy(() => import('src/content/dashboards/WordList')));

// Applications

const UserProfile = Loader(
  lazy(() => import('src/content/applications/Users/profile'))
);
const UserSettings = Loader(
  lazy(() => import('src/content/applications/Users/settings'))
);

const routes: PartialRouteObject[] = [
  {
    path: '*',
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: <SidebarLayout />
      }
    ]
  },
  {
    path: 'dashboards',
    element: <SidebarLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboards/groups" replace />
      },
      {
        path: 'groups',
        element: <KMeans />
      },
      {
        path: 'users',
        element: <KMeansUsers />
      },
      {
        path: 'wordlist',
        element: <WordList />
      },
      {
        path: 'advanced',
        element: <Advanced />
      }
    ]
  },
  {
    path: 'settings',
    element: <SidebarLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/settings/app" replace />
      },
      {
        path: 'app',
        element: <UserSettings />
      },
      {
        path: 'profile',
        children: [
          {
            path: '/',
            element: <Navigate to="details" replace />
          },
          {
            path: 'details',
            element: <UserProfile />
          },
          {
            path: 'settings',
            element: <UserSettings />
          }
        ]
      }
    ]
  }
];

export default routes;
