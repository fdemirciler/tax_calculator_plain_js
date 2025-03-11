const TAX_BRACKETS = [
  { rate: 0.10, low: 0, high: 20550 },
  { rate: 0.12, low: 20551, high: 83550 },
  { rate: 0.22, low: 83551, high: 178150 },
  { rate: 0.24, low: 178151, high: 340100 },
  { rate: 0.32, low: 340101, high: 431900 },
  { rate: 0.35, low: 431901, high: 647850 },
  { rate: 0.37, low: 647851, high: Infinity }
];

// DOM Elements
const incomeInput = document.getElementById('income');
const taxRateElement = document.getElementById('taxRate');
const taxAmountElement = document.getElementById('taxAmount');
const netIncomeElement = document.getElementById('netIncome');
const taxBracketsBody = document.getElementById('taxBracketsBody');

// Format numbers with international format (Euro currency)
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Calculate tax based on income
const calculateTax = (income) => {
  let tax = 0;
  for (const bracket of TAX_BRACKETS) {
    if (income > bracket.low) {
      tax += bracket.rate * (Math.min(income, bracket.high) - bracket.low);
    }
    if (income <= bracket.high) {
      break;
    }
  }
  return tax;
};

// Update the results display
const updateResults = (income) => {
  const tax = calculateTax(income);
  const effectiveTaxRate = income > 0 ? ((tax / income) * 100).toFixed(2) : 0;
  const netIncome = income - tax;

  taxRateElement.textContent = `${effectiveTaxRate}%`;
  taxAmountElement.textContent = formatCurrency(tax);
  netIncomeElement.textContent = formatCurrency(netIncome);
};

// Handle income input changes
incomeInput.addEventListener('input', (e) => {
  // Store cursor position
  const cursorPosition = e.target.selectionStart;

  // Remove all non-digit characters except decimal point
  const value = e.target.value.replace(/[^\d.]/g, '');

  // Parse the number directly since it's already in standard format
  const numericValue = parseFloat(value);

  if (!isNaN(numericValue)) {
    // Format and update the input value
    const formattedValue = formatNumber(numericValue);
    e.target.value = formattedValue;

    // Adjust cursor position based on the difference in string length
    const newPosition = cursorPosition + (formattedValue.length - value.length);
    e.target.setSelectionRange(newPosition, newPosition);

    updateResults(numericValue);
  } else {
    e.target.value = '';
    updateResults(0);
  }
});

// Populate tax brackets table
const populateTaxBrackets = () => {
  taxBracketsBody.innerHTML = TAX_BRACKETS.map(bracket => `
    <tr>
      <td>${formatNumber(bracket.low)}</td>
      <td>${bracket.high === Infinity ? 'Above' : formatNumber(bracket.high) }</td>
      <td>${(bracket.rate * 100)}%</td>
    </tr>
  `).join('');
};

// Initialize the page
populateTaxBrackets();
updateResults(0);