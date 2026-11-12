import {
  initBusinessFeeCalculator
} from '../src/features/business-fee-calculator/controllers/business-fee-calculator.controller.js';

const init = () => {
  const root =
    document.getElementById(
      'fee-calc'
    );

  if (!root) return;

  initBusinessFeeCalculator(root);
};

document.addEventListener(
  'DOMContentLoaded',
  init
);