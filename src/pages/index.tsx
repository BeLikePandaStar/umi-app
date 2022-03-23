import { useEffect } from 'react';
import { history } from 'umi';
import { useCookies } from 'react-cookie';

export default function Index() {
  const [cookie] = useCookies();

  useEffect(() => {
    if (cookie && cookie.account) {
      history.replace('/drag');
    } else {
      history.replace('/login');
    }
  });

  return null;
}
