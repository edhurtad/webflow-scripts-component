import {
  initBusinessFeeCalculator
} from '../../features/business-fee-calculator/controllers/business-fee-calculator.controller.js';

const startBusinessFeeCalculator = () => {
  const root =
    document.getElementById('fee-calc');

  if (root) {
    initBusinessFeeCalculator(root);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    startBusinessFeeCalculator,
    { once: true }
  );
} else {
  startBusinessFeeCalculator();
}