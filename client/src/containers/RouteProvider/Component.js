import React, { useEffect, useCallback } from 'react';
import ReactGoogleAnalytics from 'react-ga';
import { useHistory } from 'react-router-dom';
import ReactFacebookPixel from 'react-facebook-pixel';

let lastLocation = '/';

const transitionDelay = 300;

const fbPixelId = '557862558318761';
const googleAnalyticsTrackId = 'UA-43195883-2';

ReactFacebookPixel.init(fbPixelId);
ReactGoogleAnalytics.initialize(googleAnalyticsTrackId);

function RouteProvider(props) {
  const history = useHistory();

  const registerPageEnter = useCallback((pathname = window.location.pathname) => {
    ReactGoogleAnalytics.pageview(pathname); // Record a page view for the given page
    ReactGoogleAnalytics.set({ page: pathname }); // Update the user's current page
    ReactFacebookPixel.pageView();
  }, []);

  useEffect(() => registerPageEnter(), [registerPageEnter]);

  useEffect(() => {
    history.listen(({ pathname }) => {
      const isNewLocation = lastLocation !== pathname;
      lastLocation = pathname;

      if (isNewLocation) {
        registerPageEnter(pathname);

        // Scroll the view to the top if the route was changed
        if (window.scrollY > 0) {
          window.setTimeout(() => window.scrollTo({
            top: 0,
            behavior: 'smooth',
          }), transitionDelay);
        }
      }

      return lastLocation;
    });
  }, [history, registerPageEnter]);

  return (
    <>
      {props.children}
    </>
  );
}

export default RouteProvider;
export {
  ReactFacebookPixel,
  ReactGoogleAnalytics,
}
