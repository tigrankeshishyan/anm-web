import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { isWindowExists } from 'helpers';

let lastLocation = '/';

const transitionDelay = 300;

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
