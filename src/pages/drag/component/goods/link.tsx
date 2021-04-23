import React, { Component } from 'react';
import { Link } from 'umi';
import style from './link.css';

interface LinkData {
  title: string;
  url: string;
  imgSrc: string;
}

interface Props {
  data: LinkData;
}

interface State {}

// 链接组件
export default class LinkComponent extends Component<Props, State> {
  render() {
    const { data } = this.props;
    return (
      <Link className={style['link__wrap']} to={data.url}>
        <img src={data.imgSrc} alt="" />
        <span>{data.title}</span>
      </Link>
    );
  }
}
