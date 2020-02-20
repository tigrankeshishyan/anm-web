import { lazy, memo } from 'react';
import AsyncComponentLoader from 'components/AsyncComponentLoader';

export default memo(AsyncComponentLoader(lazy(() => import('./Component'))));
