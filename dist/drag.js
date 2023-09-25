/*!
 * @description drag function which compatible with IE and mobile and boundary enable
 * reference：https://www.zhangxinxu.com/wordpress/?p=683
 **/

/**
 * @param {Element} eleBar drag element
 * @param {Object} options optional params
 * @returns
 */
 var zxxDrag = function (eleBar, options) {
  if (!eleBar) {
    return;
  }
  // default data
  var defaults = {
    target: eleBar,
    bounding: window,
    edgeLock: true,
    onMove: function () {},
    onEnd: function () {},
  };

  options = options || {};

  var params = {};
  for (var key in defaults) {
    if (typeof options[key] != "undefined") {
      params[key] = options[key];
    } else {
      params[key] = defaults[key];
    }
  }

  // drag element
  var eleTarget = params.target;
  // drag boundary
  var bounding = params.bounding;
  var objBounding = bounding;

  // event for PC
  var objEventType = {
    start: "mousedown",
    move: "mousemove",
    end: "mouseup",
  };

  // event for mobile
  if ("ontouchstart" in document) {
    objEventType = {
      start: "touchstart",
      move: "touchmove",
      end: "touchend",
    };
  }

  // data for coordinate
  var store = {};
  var handleStart = function (event) {
    // IE 拖拽可能拖不动的处理
    if (!window.WeakMap || typeof document.msHidden != "undefined") {
      event.preventDefault();
    }
    // 兼顾移动端
    if (event.touches && event.touches.length) {
      event = event.touches[0];
    }
    store.y = event.pageY;
    store.x = event.pageX;
    store.isMoving = true;
    store.top = parseFloat(getComputedStyle(eleTarget).top) || 0;
    store.left = parseFloat(getComputedStyle(eleTarget).left) || 0;

    if (params.edgeLock === true && bounding) {
      if (bounding === window) {
        objBounding = {
          left: 0,
          top: 0,
          bottom: innerHeight,
          right: Math.min(innerWidth, document.documentElement.clientWidth),
        };
      } else if (bounding.tagName) {
        objBounding = bounding.getBoundingClientRect();
      }

      // 拖拽元素的 bounding 位置
      var objBoundingTarget = eleTarget.getBoundingClientRect();

      // 可移动范围
      store.range = {
        y: [
          objBounding.top - objBoundingTarget.top,
          objBounding.bottom - objBoundingTarget.bottom,
        ],
        x: [
          objBounding.left - objBoundingTarget.left,
          objBounding.right - objBoundingTarget.right,
        ],
      };
    }
  };
  var handleMoving = function (event) {
    if (store.isMoving) {
      event.preventDefault();
      // 兼顾移动端
      if (event.touches && event.touches.length) {
        event = event.touches[0];
      }

      var distanceY = event.pageY - store.y;
      var distanceX = event.pageX - store.x;

      // 边界的判断与chuli
      if (params.edgeLock === true && bounding) {
        var minX = Math.min.apply(null, store.range.x);
        var maxX = Math.max.apply(null, store.range.x);
        var minY = Math.min.apply(null, store.range.y);
        var maxY = Math.max.apply(null, store.range.y);

        if (distanceX < minX) {
          distanceX = minX;
        } else if (distanceX > maxX) {
          distanceX = maxX;
        }

        if (distanceY < minY) {
          distanceY = minY;
        } else if (distanceY > maxY) {
          distanceY = maxY;
        }
      }

      var top = store.top + distanceY;
      var left = store.left + distanceX;

      eleTarget.style.top = top + "px";
      eleTarget.style.left = left + "px";

      // 回调
      params.onMove(left, top);
    }
  };
  var handleEnd = function () {
    if (store.isMoving) {
      store.isMoving = false;

      params.onEnd();
    }
  };
  eleBar.addEventListener(objEventType.start, handleStart);
  document.addEventListener(objEventType.move, handleMoving, {
    passive: false,
  });
  document.addEventListener(objEventType.end, handleEnd);

  // remove event binding
  return () => {
    eleBar && eleBar.removeEventListener(objEventType.start, handleStart);
    document.removeEventListener(objEventType.move, handleMoving, {
      passive: false,
    });
    document.removeEventListener(objEventType.end, handleEnd);
  };
};
