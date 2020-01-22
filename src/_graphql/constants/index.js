import moment from 'moment';

const dateFormat = 'MM-DD-YYYYTHH:mm:ss';
const delayMinutes = -25;

export const defaultFilter = {
  published: {
    equalTo: true,
  },
  publishedAt: {
    // Exclude posts which were published {delayMinutes} minutes ago
    // it is average time for updating the server
    lessThanOrEqualTo: moment(new Date(), dateFormat)
      .add(delayMinutes, 'minute')
      .toISOString(),
  },
};
