import React, {Component} from "react";
import * as echarts from 'echarts';

// 图表
export default class Chart extends Component {
  render() {
    const {id} = this.props;
    return <div style={{width: '100%', height: '100%'}} id={id}/>
  }

  componentDidMount() {
    this.getChart(false)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {option, w, h} = this.props;
    if (option !== prevProps.option || w !== prevProps.w || h !== prevProps.h) {
      this.getChart(true)
    }
  }

  getChart = (isReload) => {
    const {id, option} = this.props;
    const myChart = echarts.getInstanceByDom(document.getElementById(id)) || echarts.init(document.getElementById(id));
    myChart.setOption(option);
    if (isReload) {
      myChart.resize()
    }
  }
}
