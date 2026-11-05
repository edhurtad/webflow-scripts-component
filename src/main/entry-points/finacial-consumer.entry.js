import {
  FinancialConsumerController,
} from "../features/financial-consumer/controllers/financial-consumer.controller.js";

const initFinancialConsumer = async () => {
  const controller =
    new FinancialConsumerController();

  await controller.init();
};

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initFinancialConsumer
  );
} else {
  void initFinancialConsumer();
}