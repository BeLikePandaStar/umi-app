import React, { Component } from 'react';
import style from './text.css';

// 文本组件
export default class TextComponent extends Component {
  render() {
    const { data } = this.props;
    return (
      <div className={style['text__wrap']}>
        <h2>{data.title}</h2>
        <pre>{data.content}</pre>
      </div>
    );
  }
}
