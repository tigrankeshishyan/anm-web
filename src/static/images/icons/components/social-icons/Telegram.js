import React from 'react';

const SvgTelegram = (props) => (
  <svg width={42} height={42} {...props}>
    <g fill="none" fillRule="evenodd">
      <circle cx={21} cy={21} r={21} fill="#0064F8" />
      <path
        d="M27.946 15.457l-2.867 13.577c-.217.958-.78 1.197-1.582.746l-4.37-3.233-2.107 2.036c-.233.234-.429.43-.878.43l.314-4.468 8.097-7.347c.352-.315-.077-.49-.547-.174l-10.01 6.329-4.31-1.355c-.937-.294-.954-.94.195-1.392l16.856-6.52c.78-.295 1.463.174 1.209 1.37z"
        fill="#FFF"
        fillRule="nonzero"
      />
    </g>
  </svg>
);

export default SvgTelegram;
