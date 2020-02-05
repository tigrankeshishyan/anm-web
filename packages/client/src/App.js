import React from 'react';
import PropTypes from 'prop-types';

import Layout from 'sections/Layout';
import MaterialThemeProvider from 'theme/MaterialThemeProvider';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
});

function App({ children }) {
  return (
    <MaterialThemeProvider>
      <Layout>
        {children}
      </Layout>
    </MaterialThemeProvider>
  );
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
