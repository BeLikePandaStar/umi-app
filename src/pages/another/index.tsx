import moment from 'moment';

export default () => {
  console.log('date:', moment().date());
  console.log('month', moment().month());
  return <p>another-page</p>;
};
