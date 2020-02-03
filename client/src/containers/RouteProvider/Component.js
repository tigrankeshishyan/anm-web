import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ReactGoogleAnalytics from 'react-ga';
import ReactFacebookPixel from 'react-facebook-pixel';

let lastLocation = '/';

const transitionDelay = 300;

const googleAnalyticsTrackId = 'UA-43195883-2';
const fbPixelId = '557862558318761';

ReactGoogleAnalytics.initialize(googleAnalyticsTrackId);
ReactFacebookPixel.init(fbPixelId);

function RouteProvider(props) {
  const history = useHistory();

  useEffect(() => {
    history.listen(({ pathname }) => {
      const isNewLocation = lastLocation !== pathname;
      lastLocation = pathname;

      // Scroll the view to the top if the route was changed
      if (isNewLocation && window.scrollY > 0) {
        window.setTimeout(() => window.scrollTo({
          top: 0,
          behavior: 'smooth',
        }), transitionDelay);

        ReactGoogleAnalytics.set({ page: pathname }); // Update the user's current page
        ReactGoogleAnalytics.pageview(pathname); // Record a page view for the given page
        ReactFacebookPixel.pageView();
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
