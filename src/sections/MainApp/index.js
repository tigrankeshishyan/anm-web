import React from 'react';

function MainApp(props) {
  const {
    children,
  } = props;

  return (
    <main className="main-app">
      {children}
    </main>
  );
}

MainApp.defaultProps = {};

MainApp.propTypes = {};

export default MainApp;
