var tabs = require("sdk/tabs");
var data = require("sdk/self").data;


var panel = require("sdk/panel").Panel({
  contentURL: data.url("panel.html"),
  contentScriptFile: [
	data.url("panel.js"),
	data.url("jquery-2.1.3.min.js")
	],
  onHide: handleHide
});

var button = require('sdk/ui/button/toggle').ToggleButton({
  id: "reddit-submission-finder-panel",
  label: "Reddit Submission Finder",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onChange: handleChange
});

panel.on("show", function() {
  panel.port.emit("show", tabs.activeTab.url);
});

panel.on("hide", function() {
  panel.port.emit("hide");
});

panel.port.on("open-link", function (url) {
  tabs.open(url);
  panel.hide();
});

function handleChange(state) {
  if (state.checked) {
    panel.show({
      position: button,
	  width: 400,
	  height: 400
    });
  }
}

function handleHide() {
  button.state('window', {checked: false});
}