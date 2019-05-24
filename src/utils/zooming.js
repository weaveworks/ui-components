const ZOOM_SENSITIVITY = 0.0025;
const DOM_DELTA_LINE = 1;

// See https://github.com/d3/d3-zoom/blob/807f02c7a5fe496fbd08cc3417b62905a8ce95fa/src/zoom.js
function wheelDelta(ev) {
  // Only Firefox seems to use the line unit (which we assume to
  // be 25px), otherwise the delta is already measured in pixels.
  const unitInPixels = ev.deltaMode === DOM_DELTA_LINE ? 25 : 1;
  return -ev.deltaY * unitInPixels * ZOOM_SENSITIVITY;
}

export function zoomFactor(ev) {
  return Math.exp(wheelDelta(ev));
}

// This hack was directly taken from https://github.com/facebook/react/issues/14856#issuecomment-478144231
// It defaults document level events back to active. Defaulting them to passive was introduced in Chrome 73
// (https://www.chromestatus.com/features/6662647093133312) and since then, our React onWheel event broke
// timeline scrolling - see https://github.com/weaveworks/service-ui/issues/3750.
// TODO: Remove this code once https://github.com/facebook/react/issues/14856 gets resolved.
let madeReactEventsActive = false;
if (!madeReactEventsActive) {
  const EVENTS_TO_MODIFY = [
    'touchstart',
    'touchmove',
    'touchend',
    'touchcancel',
    'wheel',
  ];

  const originalAddEventListener = document.addEventListener.bind();
  document.addEventListener = (type, listener, options, wantsUntrusted) => {
    let modOptions = options;
    if (EVENTS_TO_MODIFY.includes(type)) {
      if (typeof options === 'boolean') {
        modOptions = {
          capture: options,
          passive: false,
        };
      } else if (typeof options === 'object') {
        modOptions = {
          ...options,
          passive: false,
        };
      }
    }

    return originalAddEventListener(type, listener, modOptions, wantsUntrusted);
  };

  const originalRemoveEventListener = document.removeEventListener.bind();
  document.removeEventListener = (type, listener, options) => {
    let modOptions = options;
    if (EVENTS_TO_MODIFY.includes(type)) {
      if (typeof options === 'boolean') {
        modOptions = {
          capture: options,
          passive: false,
        };
      } else if (typeof options === 'object') {
        modOptions = {
          ...options,
          passive: false,
        };
      }
    }
    return originalRemoveEventListener(type, listener, modOptions);
  };

  madeReactEventsActive = true;
}
