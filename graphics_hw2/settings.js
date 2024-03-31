// event-listening 변수 초기화
const settings = {
  isPointRightOn: true,
  isSpotRightOn: true,
  cutoffAngle: 10,
  longitude: 60,
  latitude: 30,
  angle: 30,
  height: 15,
};

// htmlElement
const pointLightCheckbox = document.getElementById("light-point");

const spotLightCheckbox = document.getElementById("light-spot");

const cutoffAngleRange = document.getElementById("cutoff-angle");
const cutoffAngleValue = document.getElementById("cutoff-angle-val");

const latitudeRange = document.getElementById("latitude");
const latitudeValue = document.getElementById("latitude-val");

const longitudeRange = document.getElementById("longitude");
const longitudeValue = document.getElementById("longitude-val");

const angleRange = document.getElementById("angle");
const angleValue = document.getElementById("angle-val");

const heightRange = document.getElementById("height");
const heightValue = document.getElementById("height-val");

// ui 및 settings 업데이트
function updateSetting(params) {
  Object.assign(settings, params);

  settings.latitude = Math.min(settings.latitude, latitudeRange.max);
  settings.latitude = Math.max(settings.latitude, latitudeRange.min);
  latitudeRange.value = settings.latitude;
  latitudeValue.textContent = `${latitudeRange.value}°`;

  settings.longitude = Math.min(settings.longitude, longitudeRange.max);
  settings.longitude = Math.max(settings.longitude, longitudeRange.min);
  longitudeRange.value = settings.longitude;
  longitudeValue.textContent = `${longitudeRange.value}°`;

  settings.angle = Math.min(settings.angle, angleRange.max);
  settings.angle = Math.max(settings.angle, angleRange.min);
  angleRange.value = settings.angle;
  angleValue.textContent = `${angleRange.value}°`;

  settings.height = Math.min(settings.height, heightRange.max);
  settings.height = Math.max(settings.height, heightRange.min);
  heightRange.value = settings.height;
  heightValue.textContent = `${heightRange.value}°`;

  settings.cutoffAngle = Math.min(settings.cutoffAngle, cutoffAngleRange.max);
  settings.cutoffAngle = Math.max(settings.cutoffAngle, cutoffAngleRange.min);
  cutoffAngleRange.value = settings.cutoffAngle;
  cutoffAngleValue.textContent = `${cutoffAngleRange.value}°`;
}

// range, checkbox eventListener
pointLightCheckbox.addEventListener("change", (e) => {
  updateSetting({ isPointRightOn: pointLightCheckbox.checked });
});
spotLightCheckbox.addEventListener("change", (e) => {
  updateSetting({ isSpotRightOn: spotLightCheckbox.checked });
});
cutoffAngleRange.addEventListener("input", (e) => {
  updateSetting({ cutoffAngle: e.target.value });
});
longitudeRange.addEventListener("input", (e) => {
  updateSetting({ longitude: e.target.value });
});
latitudeRange.addEventListener("input", (e) => {
  updateSetting({ latitude: e.target.value });
});
angleRange.addEventListener("input", (e) => {
  updateSetting({ angle: e.target.value });
});
heightRange.addEventListener("input", (e) => {
  updateSetting({ height: e.target.value });
});

// keyboard eventListener
const messageSpan = document.getElementById("message");
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowRight":
      messageSpan.textContent = "Right arrow is pressed";
      updateSetting({ longitude: settings.longitude + 1 });
      break;
    case "ArrowLeft":
      messageSpan.textContent = "Left arrow is pressed";
      updateSetting({ longitude: settings.longitude - 1 });
      break;
    case "ArrowUp":
      messageSpan.textContent = "Up arrow is pressed";
      updateSetting({ latitude: settings.latitude + 1 });
      break;
    case "ArrowDown":
      messageSpan.textContent = "Down arrow is pressed";
      updateSetting({ latitude: settings.latitude - 1 });
      break;
  }
});
document.addEventListener("keyup", () => {
  messageSpan.textContent = "";
});

export { settings };
