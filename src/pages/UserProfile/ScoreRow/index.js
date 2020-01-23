import React from 'react';
import PropTypes from 'prop-types';
import lodashGet from 'lodash.get';
import ListItem from '@material-ui/core/ListItem';

import Link from 'components/Link';

import './styles.sass';

function ScoreRow(props) {
  const {
    id,
    path,
    title,
    description,
    composition,
  } = props;

  const scoreUrl = `/music-sheet-score/${path}/${id}`;
  const musicians = lodashGet(composition, 'musiciansList', []);

  return (
    <Link to={scoreUrl} className="anm-user-purchase-row">
      <ListItem>
        <div className="pad-10 flex-row grow align-center justify-between">
          <div>
            <p className="font-bold truncate">
              {musicians.map(m => `${m.firstName} ${m.lastName}`).join(',')} - {title}
            </p>
            <span className="secondary-text-color truncate-3-lines">
            {description}
          </span>
          </div>
        </div>
      </ListItem>
    </Link>
  );
}

ScoreRow.defaultProps = {
  musiciansList: [],
};

ScoreRow.propTypes = {
  onDownload: PropTypes.func.isRequired,
};

export default ScoreRow;
