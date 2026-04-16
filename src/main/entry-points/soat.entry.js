import { SoatController } from '../../features/soat/controllers/soat.controller.js';

const init = () => {
  const soatController = new SoatController();
  soatController.init();
};

document.addEventListener('DOMContentLoaded', init);