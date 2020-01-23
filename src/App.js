import React from 'react';
import PropTypes from 'prop-types';

import Layout from 'sections/Layout';

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
    <Layout>
      {children}
    </Layout>
  );
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
