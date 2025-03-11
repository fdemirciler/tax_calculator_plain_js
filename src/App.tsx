import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';

function App() {
  const [grossIncome, setGrossIncome] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [netIncome, setNetIncome] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [formattedIncome, setFormattedIncome] = useState<string>('');

  const TAX_BRACKETS = [
    { rate: 0.10, low: 0, high: 20550 },
    { rate: 0.12, low: 20551, high: 83550 },
    { rate: 0.22, low: 83551, high: 178150 },
    { rate: 0.24, low: 178151, high: 340100 },
    { rate: 0.32, low: 340101, high: 431900 },
    { rate: 0.35, low: 431901, high: 647850 },
    { rate: 0.37, low: 647851, high: Infinity }
  ];

  useEffect(() => {
    calculateTax();
  }, [grossIncome]);

  const calculateTax = () => {
    let tax = 0;
    for (const bracket of TAX_BRACKETS) {
      if (grossIncome > bracket.low) {
        tax += bracket.rate * (Math.min(grossIncome, bracket.high) - bracket.low);
      }
      if (grossIncome <= bracket.high) {
        break;
      }
    }

    const effectiveTaxRate = grossIncome > 0 
      ? Number(((tax / grossIncome) * 100).toFixed(2))
      : 0;

    setTaxRate(effectiveTaxRate);
    setTaxAmount(tax);
    setNetIncome(grossIncome - tax);
  };

  const handleIncomeChange = (value: string) => {
    const cleanValue = value.replace(/,/g, '');
    const numericValue = parseFloat(cleanValue);
    setGrossIncome(isNaN(numericValue) ? 0 : numericValue);
    setFormattedIncome(new Intl.NumberFormat().format(cleanValue));
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('de-DE').format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <Calculator className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">Tax Calculator</h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gross Income (Annual)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
              <input
                type="text"
                value={formattedIncome}
                onChange={(e) => handleIncomeChange(e.target.value)}
                className="block w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Enter your gross income"
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Effective Tax Rate:</span>
              <span className="font-semibold text-gray-800">{taxRate}%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tax Amount:</span>
              <span className="font-semibold text-gray-800">{formatCurrency(taxAmount)}</span>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-medium">Net Income:</span>
                <span className="text-lg font-bold text-indigo-600">{formatCurrency(netIncome)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-700 p-4 border-b border-gray-100">
              Tax Brackets
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left font-medium text-gray-600">From</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">To</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-600">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {TAX_BRACKETS.map((bracket, index) => (
                    <tr key={index} className="border-t border-gray-100">
                      <td className="px-4 py-2 text-gray-600">€{formatNumber(bracket.low)}</td>
                      <td className="px-4 py-2 text-gray-600">
                        {bracket.high === Infinity ? 'Above' : `€${formatNumber(bracket.high)}`}
                      </td>
                      <td className="px-4 py-2 text-right font-medium text-gray-800">
                        {(bracket.rate * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;