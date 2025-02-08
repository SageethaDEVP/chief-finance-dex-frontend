import { AreaStyleOptions, Background, ChartOptions, DeepPartial, SeriesOptionsCommon } from 'lightweight-charts';

export const chartOptions: DeepPartial<ChartOptions> = {
  rightPriceScale: {
    visible: false,
  },
  watermark: {
    visible: false,
  },
  timeScale: {
    visible: false,
  },
  layout: {
    background: { type: 'solid', color: 'transparent' } as Background,
    textColor: '#333',
  },
  grid: {
    horzLines: {
      visible: false,
    },
    vertLines: {
      visible: false,
    },
  },
  crosshair: {
    vertLine: {
      visible: false,
    },
    horzLine: {
      visible: false,
    },
  },
  handleScroll: false,
  handleScale: false,
};

export const setAreaOptions = (hasGrown: boolean): DeepPartial<AreaStyleOptions & SeriesOptionsCommon> => {
  return {
    topColor: hasGrown ? 'rgba(35, 187, 160, 0.56)' : 'rgba(231,52,73,0.56)',
    bottomColor: hasGrown ? 'rgba(35, 187, 160, 0.04)' : 'rgba(231,52,73,0.04)',
    lineColor: hasGrown ? 'rgba(35, 187, 160, 1)' : 'rgba(231,52,73,1)',
    lineWidth: 2,
  };
};
