import { SoatController } from '../src/features/soat/soat.controller.js';

const init = () => {
  const soatController = new SoatController();
  soatController.init();
};

document.addEventListener('DOMContentLoaded', init);



