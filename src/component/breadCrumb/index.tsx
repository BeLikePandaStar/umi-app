import {Layout, Breadcrumb, Button} from 'antd';
import {RollbackOutlined} from '@ant-design/icons';
import {history} from "umi";
import style from './index.css';

export default function BreadCrumb(props: any) {
  return (
    <Layout className={style['wrap']}>
      {props.isBack ? <Button size={"small"} type={'link'} onClick={() => history.goBack()}><RollbackOutlined/></Button> : null}
      <Breadcrumb routes={props.routes} separator={'>'}/>
    </Layout>
  )
}
