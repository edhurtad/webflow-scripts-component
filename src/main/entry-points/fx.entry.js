import {
  FxController
} from '../../features/fx/controllers/fx.controller.js';

const init = () => {
  const fxController =
    new FxController();

  fxController.init();
};

document.addEventListener(
  'DOMContentLoaded',
  init
);