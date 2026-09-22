import { config } from "../shared/config/config.js";

import {
  FinancialConsumerController,
} from "../features/financial-consumer/controllers/financial-consumer.controller.js";

const initFinancialConsumer = async () => {
  const controller =
    new FinancialConsumerController({
      apiUrlCities: config.apiUrlCities,
    });

  await controller.init();
};

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initFinancialConsumer
  );
} else {
  initFinancialConsumer();
}