/**
 * This file will contain all common data types in the app.
 */
import PropTypes from 'prop-types';

export const elementType = PropTypes.oneOfType([
  PropTypes.node,
  PropTypes.func,
  PropTypes.object,
  PropTypes.number,
  PropTypes.element,
]);
