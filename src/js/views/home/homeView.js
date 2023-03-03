import View from '../View.js'
import minimalAccInfo from './minimalAccView.js';
import fundAndReferralView from './fundAndReferralView.js';
import statisticsView from './statisticsView.js';
import chartView from './chartView.js';

class DashboardView extends View {
  _parentElem = document.querySelector('main');

  _generateMarkup() {
    const sections = `
      ${minimalAccInfo.renderData(this._data, false, false)}
      ${chartView.renderChartMarkup()}
      ${statisticsView.renderData(this._data, false, false)}
      ${fundAndReferralView.renderData(this._data, false, false)}`;
    return sections;
  }

  init(copyRefHanfler) {
    this.setTitle('Dashboard || Slack');
    fundAndReferralView.init();
    chartView.createChart(this._data);
  }
}

export default new DashboardView();