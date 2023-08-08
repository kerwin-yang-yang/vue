
function getDaysInMonth(month, year) {
  const date = new Date(year, month, 1)
  const days = []
  let idx = 0
  while (date.getMonth() === month && idx < 16) {
    const d = new Date(date)
    days.push(d.getDate() + ' ' + d.toLocaleString('en-us', { month: 'short' }))
    date.setDate(date.getDate() + 1)
    idx += 1
  }
  return days
}
const now = new Date()
const labels = getDaysInMonth(now.getMonth(), now.getFullYear())
const revenueAreaChart = {
  chartOptions: {
    chart: {
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      theme: 'dark',
      x: { show: false },
    },
    stroke: {
      curve: 'smooth',
      width: 4,
    },
    zoom: {
      enabled: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    colors: ['#43d39e'],
    xaxis: {
      type: 'datetime',
      // categories:100,
      tooltip: {
        enabled: true,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter(val) {
          return val + '条'
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        type: 'vertical',
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [45, 100],
      },
    },
  },

}

const targetsBarChart = {
  chartOptions: {
    chart: {
      toolbar: {
        show: false,
      },
    },
    
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: 'rounded',
        columnWidth: '5%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 3,
      colors: ['transparent'],
    },
    colors: [ '#ff5c75', '#ffbe0b','#43d39e' ],
    xaxis: {
      type: 'datetime',
      axisBorder: {
        color: '#d6ddea',
      },
      tooltip: {
        enabled: true,
      },
      axisTicks: {
        color: '#d6ddea',
      },
    },
    legend: {
      offsetY: -10,
    },
    yaxis: {
      title: {
        text: '风险记录条数',
      },
    },
    fill: {
      opacity: 1,
    },
    grid: {
      row: {
        colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.2,
      },
      borderColor: '#f1f3fa',
    },
    tooltip: {
      y: {
        formatter(val) {
          return  + val + ' 条'
        },
      },
      theme: 'dark',
      x: { show: false },
    },
  },
  series: [
    {
      name: '高风险',
      data: null,
    },
    {
      name: '中风险',
      data: null,
    },
    {
      name: '低风险',
      data: null,
    },
  ],
}

const salesDonutChart = {
  chartOptions: {
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
        },
        expandOnClick: false,
      },
    },
    colors: [ '#43d39e', '#ffbe0b', '#ff5c75'],
    legend: {
      show: true,
      position: 'right',
      horizontalAlign: 'left',
      itemMargin: {
        horizontal: 6,
        vertical: 3,
      },
    },
    labels: ['低风险记录', '中风险记录 ', '高风险记录', ],
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
    tooltip: {
      y: {
        formatter: (value) => {
          return value + '条'
        },
      },
    },
  },
  series: [44, 55, 41, 17],
}



export { revenueAreaChart, targetsBarChart, salesDonutChart}
