import React, {Component} from "react";
import * as echarts from 'echarts';

interface Props {
  id: string,
  option: any,
  w: string | number,
  h: string | number,
}

// 图表
export default class Chart extends Component<Props, any> {
  render() {
    const {id} = this.props;
    return <div style={{width: '100%', height: '100%'}} id={id}/>
  }

  componentDidMount() {
    this.getChart()
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<any>, snapshot?: any) {
    const {option, w, h} = this.props;
    if (option !== prevProps.option || w !== prevProps.w || h !== prevProps.h) {
      console.log('reload')
      this.getChart(true)
    }
  }

  getChart = (isReload?: boolean) => {
    const {id, option} = this.props;
    const myChart = echarts.init(document.getElementById(id) as HTMLElement);
    myChart.setOption(option);
    if (isReload) {
      myChart.resize()
    }
  }
}
