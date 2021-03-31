export const getBarOption = () => {
  return {
    dataset: {
      source: [
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
        ['e', 5],
      ]
    },
    xAxis: {
      type: 'category',

    },
    yAxis: {},
    series: [{
      type: 'bar'
    }]
  }
}
