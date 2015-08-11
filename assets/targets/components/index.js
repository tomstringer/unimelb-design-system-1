// Deps
require("../../shared/shims");
require("../../shared/smoothscroll");
require("../../shared/findup");
require("../../shared/loadscript");

// Also need one to find non-text nodes in a list of children

// Simple sniff
if (typeof window.MSIE_version === "undefined")
  window.MSIE_version = /MSIE\s(\d)/g.exec(navigator.userAgent) === null ? 100 : /MSIE\s(\d)/g.exec(navigator.userAgent)[1];

require("../injection/gtm");

// Async load fonts from google
var WebFont = require("webfontloader");
WebFont.load({
  google: { families: [
    'Roboto:400,300,100,700,100italic,300italic,400italic,700italic:latin'
  ] }
});

// replace with viewloader eventually
window.UOMloadComponents = function() {
  "use strict";

  var recs, i, g, Accordion, Modal, Tabs, SidebarTabs, InpageNavigation,
    JumpNav, CheckboxHelper, UnlockChecklist, FancySelect, ValidateForm,
    ListFilter, MobileTableHelper, IconHelper, ImageGallery, imagesLoaded,
    slingshot, LMaps, style, script;

  recs = document.querySelectorAll('.accordion__title');
  if (recs.length > 0) {
    Accordion = require("./accordion");
    for (i=recs.length - 1; i >= 0; i--)
      new Accordion(recs[i], {});
  }

  recs = document.querySelectorAll('[data-modal-target]');
  if (recs.length > 0) {
    Modal = require("./modal");
    for (i=recs.length - 1; i >= 0; i--)
      new Modal(recs[i], {});
  }

  // IE10+
  if (MSIE_version > 9) {
    recs = document.querySelectorAll('select');
    if (recs.length > 0) {
      FancySelect = require("./forms/fancyselect");
      for (i=recs.length - 1; i >= 0; i--)
        new FancySelect(recs[i], {});
    }
  }

  recs = document.querySelectorAll('[data-tabbed]');
  if (recs.length > 0) {
    Tabs = require("./tabs");
    for (i=recs.length - 1; i >= 0; i--)
      new Tabs(recs[i], {});
  }

  recs = document.querySelectorAll('.sidebar-tab-nav');
  if (recs.length > 0) {
    SidebarTabs = require("./tabs/sidebartabs");
    for (i=recs.length - 1; i >= 0; i--)
      new SidebarTabs(recs[i], {'selector': '.sidebar-tab'});
  }

  // Should combine with above
  recs = document.querySelectorAll('.inner-nav-tab');
  if (recs.length > 0) {
    SidebarTabs = require("./tabs/sidebartabs");
    for (i=recs.length - 1; i >= 0; i--)
      new SidebarTabs(recs[i], {'selector': '.inner-nav-page'});
  }

  recs = document.querySelectorAll('a[href^="#"]');
  if (recs.length > 0) {
    InpageNavigation = require("./inpage-navigation");
    for (i=recs.length - 1; i >= 0; i--)
      new InpageNavigation(recs[i], {});
  }

  recs = document.querySelectorAll('input[type="radio"],input[type="checkbox"]');
  if (recs.length > 0) {
    CheckboxHelper = require("./checklist/checkboxhelper");
    for (i=recs.length - 1; i >= 0; i--)
      new CheckboxHelper(recs[i], {});
  }

  recs = document.querySelectorAll('ul.checklist[data-unlock-target]');
  if (recs.length > 0) {
    UnlockChecklist = require("./checklist");
    for (i=recs.length - 1; i >= 0; i--)
      new UnlockChecklist(recs[i], {});
  }

  recs = document.querySelectorAll('form[data-validate]');
  if (recs.length > 0) {
    ValidateForm = require("./forms");
    for (i=recs.length - 1; i >= 0; i--)
      new ValidateForm(recs[i], {});
  }

  recs = document.querySelectorAll('form.filtered-listing-select');
  if (recs.length > 0) {
    ListFilter = require("./filtered-listings");
    for (i=recs.length - 1; i >= 0; i--)
      new ListFilter(recs[i], {});
  }

  if (document.countSelector('h2[id]') > 0 && document.countSelector('.jumpnav, .indexnav') == 1) {
    JumpNav = require("./inpage-navigation/jumpnav");
    new JumpNav({});
  }

  // IE9+
  if (MSIE_version > 8) {
    recs = document.querySelectorAll('[data-icon]');
    if (recs.length > 0) {
      IconHelper = require("./icons");
      for (i=recs.length - 1; i >= 0; i--)
        new IconHelper(recs[i], {});
    }

    recs = document.querySelectorAll('table');
    if (recs.length > 0) {
      MobileTableHelper = require("./tables");
      for (i=recs.length - 1; i >= 0; i--)
        new MobileTableHelper(recs[i], {});
    }

    recs = document.querySelectorAll('ul.image-gallery');
    if (recs.length > 0) {
      imagesLoaded = require('imagesloaded');
      ImageGallery = require("./gallery");

      slingshot = function() {
        new ImageGallery(g, {});
      };

      for (i=recs.length - 1; i >= 0; i--) {
        g = recs[i];
        imagesLoaded(g, slingshot);
      }
    }

    recs = document.querySelectorAll('[data-leaflet-latlng]');
    if (recs.length > 0) {
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.js', function() {
        style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = 'http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css';
        document.body.appendChild(style);

        LMaps = require("./maps/lmaps");
        for (i=recs.length - 1; i >= 0; i--) {
          new LMaps(recs[i], {});
        }
      });
    }
  }

  // GMaps will load via callback
  if (document.countSelector('[data-latlng],[data-address]') > 0) {
    script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://maps.googleapis.com/maps/api/js?callback=maps_loaded_go";
    document.body.appendChild(script);
  }
};

// GMaps callback
window.maps_loaded_go = function() {
  var GMaps = require("./maps/gmaps");
  for (var recs = document.querySelectorAll('[data-latlng],[data-address]'), i=recs.length - 1; i >= 0; i--)
    new GMaps(recs[i], {});
};

// Execute when ready
if (window.attachEvent) {
  window.attachEvent('onload', window.UOMloadComponents);
} else {
  document.addEventListener('DOMContentLoaded', window.UOMloadComponents, false);
  document.addEventListener('page:load', window.UOMloadComponents, false);
}
