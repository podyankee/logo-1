window.jQuery = $;
window.$ = $;
window.$ = window.jQuery = require('jquery');

// import 'slick-slider/slick/slick.css';
// import 'fullpage.js/dist/fullpage.css';
// import 'slick-slider/slick/slick';
// import 'fullpage.js/dist/fullpage';

import './assets/scripts/common';

// Styles
import 'normalize.css';
import "styles/_index.sass";

window.onload = function () {
	require("scripts/data");
};
