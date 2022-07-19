const chartContainer = document.querySelector('.spending-chart');

/**
 * Get the current day of the week as idexed from 0 to 6
 * @returns {Number} current day of week index
 */
const getCurrentDayOfWeekIndex = () => {
  const date = new Date();
  const dayOfWeek = date.getDay();
  return dayOfWeek - 1;
};

/**
 * Fetch the expenses data from the local json file
 * @returns {Promise<{day: String, amount: Number}[]>} expenses data
 */
const fetchExpensesData = async () => {
  // set path to the local json file which working on local live server and GitHub Pages
  const { origin, href, pathname } = window.location;
  const path = 'static/data/data.json';
  const url =
    pathname === '/index.html' ? `${origin}/${path}` : `${href}${path}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error('Expenses data is not available.');
  }
};

/**
 * Populate the expenses chart label from the expenses data
 * @param {{ day: String, amount: Number }[]} expensesData
 */
const populateChartLabel = expensesData => {
  const chartLabelsContainer = chartContainer.querySelector('.chart-label');
  const chartLabels = expensesData.map(expense => {
    const label = document.createElement('li');
    label.innerHTML = expense.day;
    return label;
  });

  chartLabels.forEach(label => {
    chartLabelsContainer.appendChild(label);
  });
};

/**
 * Populate the expenses chart data from the expenses data
 * @param {{ day: String, amount: Number }[]} expensesData
 */
const populateChart = expensesData => {
  const chartDataContainer = chartContainer.querySelector('.chart-data');
  const maxAmount = Math.max(...expensesData.map(expense => expense.amount));
  const currentDayOfWeekIndex = getCurrentDayOfWeekIndex();

  const chartData = expensesData.map(expense => {
    const chartColumn = document.createElement('div');
    const chartColumnHeight = (expense.amount / maxAmount) * 100;

    chartColumn.setAttribute('data-amount', `$${expense.amount}`);
    chartColumn.classList.add('chart-column');
    chartColumn.style.height = `${chartColumnHeight}%`;

    return chartColumn;
  });

  chartData[currentDayOfWeekIndex].classList.add('same-day');

  chartData.forEach(data => {
    chartDataContainer.appendChild(data);
  });
};

/**
 * Populate the error message if the expenses data is not available
 * @param {String} message message to display
 */
const populateErrorMessage = message => {
  const chartDataContainer = chartContainer.querySelector('.chart-data');
  const errorMessage = document.createElement('div');
  errorMessage.classList.add('error-message');
  errorMessage.innerHTML = message;

  chartDataContainer.classList.add('error');
  chartDataContainer.appendChild(errorMessage);
};

/**
 * Manipulate the expenses chart data and label based on the expenses data
 */
const manipulateExpenseData = async () => {
  try {
    const expensesData = await fetchExpensesData();

    // populate the chart label and data
    populateChartLabel(expensesData);
    populateChart(expensesData);
  } catch (error) {
    // populate the error message if the expenses data is not available
    populateErrorMessage(error.message);
  }
};

window.onload = manipulateExpenseData();
