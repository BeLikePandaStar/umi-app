import React, { Component } from 'react';
import { List } from 'antd';
import style from './list.css';

const ListItem = List.Item;

// 列表组件
export default class ListComponent extends Component {
  render() {
    const { data } = this.props;
    return (
      <List
        style={{ overflow: 'auto', height: '100%' }}
        header={
          <div className={style['list__header']}>
            <h2>{data.title}</h2>
          </div>
        }
        size={'small'}
        bordered={false}
        dataSource={data.list}
        renderItem={(item, index) => (
          <ListItem>
            {index + 1}、{item}
          </ListItem>
        )}
      />
    );
  }
}
