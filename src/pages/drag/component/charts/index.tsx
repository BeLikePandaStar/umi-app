import React, { Component } from 'react';
import * as echarts from 'echarts';
import { EChartsCoreOption } from 'echarts';

interface Props {
  id: string;
  option: EChartsCoreOption;
  w: number;
  h: number;
}

interface State {}

// 图表
export default class Chart extends Component<Props, State> {
  render() {
    const { id } = this.props;
    return <div style={{ width: '100%', height: '100%' }} id={id} />;
  }

  componentDidMount() {
    this.getChart(false);
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any,
  ) {
    const { option, w, h } = this.props;
    if (option !== prevProps.option || w !== prevProps.w || h !== prevProps.h) {
      this.getChart(true);
    }
  }

  getChart = (isReload: boolean) => {
    const { id, option } = this.props;
    const myChart =
      echarts.getInstanceByDom(document.getElementById(id)!) ||
      echarts.init(document.getElementById(id)!);
    myChart.setOption(option);
    if (isReload) {
      myChart.resize();
    }
  };
}
