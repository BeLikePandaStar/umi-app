import React, { Component } from 'react';
import { Link } from 'umi';
import style from './link.css';

// 链接组件
export default class LinkComponent extends Component {
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
