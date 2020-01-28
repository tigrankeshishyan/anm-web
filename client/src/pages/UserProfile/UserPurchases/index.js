import React from 'react';
import lodashGet from 'lodash.get';
import List from '@material-ui/core/List';

import NoData from 'components/NoData';

import withUser from 'hoc/withUser';

import ScoreRow from '../ScoreRow';

function UserPurchases(props) {
  const purchases = lodashGet(props, 'user.purchases', []).map(el => el.score);

  return (
    <div>
      {purchases.length
        ? (
          <List>
            {purchases.map(item => item && (
              <ScoreRow
                {...item}
                key={item.url}
              />
            ))}
          </List>
        ) : <NoData />
      }
    </div>
  );
}

export default withUser(UserPurchases);
