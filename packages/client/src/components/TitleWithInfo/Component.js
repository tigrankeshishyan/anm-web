import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { elementType } from 'types';

import './styles.sass';

function TitleWithInfo(props) {
  const {
    title,
    infos,
    className,
  } = props;

  return (
    <div
      className={clsx('title-with-info-block', className)}
    >
      <b className="font-bold">
        {title}
      </b>
      {
        Array.isArray(infos)
          ? infos.map((info, index) => <p key={index}>{info}</p>)
          : <p>{infos}</p>
      }
    </div>
  );
}

TitleWithInfo.defaultProps = {
  title: '',
  infos: '',
  className: '',
};

TitleWithInfo.propTypes = {
  title: elementType,
  className: PropTypes.string,
  infos: PropTypes.oneOfType([elementType, PropTypes.arrayOf(elementType)]),
};

export default TitleWithInfo;
