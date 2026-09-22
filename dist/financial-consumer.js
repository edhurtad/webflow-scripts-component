import { FinancialConsumerController } from '../src/features/financial-consumer/controllers/financial-consumer.controller.js';

const init = () => {
  const financialConsumerController =
    new FinancialConsumerController();

  financialConsumerController.init();
};


document.addEventListener(
  'DOMContentLoaded',
  init
);