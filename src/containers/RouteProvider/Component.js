import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ReactGA from 'react-ga';

import { isWindowExists } from 'helpers';

let lastLocation = '/';

const transitionDelay = 300;

const googleAnalyticsTrackId = 'UA-43195883-2';

ReactGA.initialize(googleAnalyticsTrackId);

function RouteProvider(props) {
  const history = useHistory();

  useEffect(() => {
    history.listen(({ pathname }) => {
      const isNewLocation = lastLocation !== pathname;
      lastLocation = pathname;

      // Scroll the view to the top if the route was changed
      if (isWindowExists() && isNewLocation && window.scrollY > 0) {
        window.setTimeout(() => window.scrollTo({
          top: 0,
          behavior: 'smooth',
        }), transitionDelay);

        ReactGA.set({ page: pathname }); // Update the user's current page
        ReactGA.pageview(pathname); // Record a page view for the given page
      }

      return lastLocation;
    });
  }, [history]);

  return (
    <>
      {props.children}
    </>
  );
}

export default RouteProvider;
