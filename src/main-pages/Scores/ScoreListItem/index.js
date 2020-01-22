import React from 'react';
import PropTypes from 'prop-types';
import lodashGet from 'lodash.get';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Link from 'components/Link';

import './styles.sass';

function ScoreListItem(props) {
  const {
    title,
    scoreUrl,
    description,
    composition,
  } = props;

  const musiciansList = lodashGet(composition, 'musiciansList', []);
  const musicians = musiciansList.map(m => `${m.firstName} ${m.lastName}`).join(',');

  return (
    <Link to={scoreUrl}>
      <ListItem
        className="anm-music-score-list-item"
      >
        <ListItemText
          primary={`${musicians} - ${title}`}
          secondary={description}
        />
      </ListItem>
    </Link>
  );
}

ScoreListItem.defaultProps = {};

ScoreListItem.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  scoreUrl: PropTypes.string.isRequired,
};

export default ScoreListItem;
