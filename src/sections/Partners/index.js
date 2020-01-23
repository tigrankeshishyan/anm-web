import { lazy } from 'react';
import AsyncComponentLoader from 'components/AsyncComponentLoader';

export default AsyncComponentLoader(lazy(() => import('./Component')));
