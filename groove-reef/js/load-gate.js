/**
 * Runs before a game module. Retries a dropped transfer and caps how many
 * files are in flight, so one closed connection cannot stall the boot.
 * Audio uses XMLHttpRequest; pictures and JSON use fetch. The two queues
 * are separate so a sound cannot sit on a picture's slot.
 */
(function () {
  if (window.__biabLoadGate) return;
  window.__biabLoadGate = true;

  var themeQuery = new URLSearchParams(window.location.search);
  function paintTheme(name, param) {
    var v = themeQuery.get(param);
    if (v && /^[0-9a-fA-F]{6}$/.test(v)) document.documentElement.style.setProperty(name, "#" + v);
  }
  paintTheme("--biab-shell", "shell");
  paintTheme("--biab-ink", "ink");
  paintTheme("--biab-cta", "cta");
  paintTheme("--biab-cta-ink", "ctaInk");

  var FETCH_LIMIT = 4;
  var XHR_LIMIT = 2;
  var TIMEOUT_MS = 30000;

  function delay(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  function makeQueue(limit) {
    var active = 0;
    var waiters = [];
    function acquire() {
      if (active < limit) {
        active += 1;
        return Promise.resolve();
      }
      return new Promise(function (resolve) {
        waiters.push(function () {
          active += 1;
          resolve();
        });
      });
    }
    function release() {
      active -= 1;
      var next = waiters.shift();
      if (next) next();
    }
    return { acquire: acquire, release: release };
  }

  var fetchQueue = makeQueue(FETCH_LIMIT);
  var xhrQueue = makeQueue(XHR_LIMIT);

  function labelOf(input) {
    if (typeof input === "string") return input;
    if (input && typeof input.url === "string") return input.url;
    return "request";
  }

  function transientStatus(status) {
    return status === 502 || status === 503 || status === 504;
  }

  var origFetch = window.fetch ? window.fetch.bind(window) : null;
  if (origFetch) {
    window.fetch = function (input, init) {
      var parent = init && init.signal;
      return fetchQueue.acquire().then(function () {
        var attempt = 0;
        function run() {
          attempt += 1;
          var ctrl = new AbortController();
          var timedOut = false;
          var timer = setTimeout(function () {
            timedOut = true;
            ctrl.abort();
          }, TIMEOUT_MS);
          if (parent) {
            if (parent.aborted) ctrl.abort();
            else parent.addEventListener("abort", function () { ctrl.abort(); });
          }
          var nextInit = Object.assign({}, init || {}, { signal: ctrl.signal });
          return origFetch(input, nextInit).then(function (res) {
            clearTimeout(timer);
            if (transientStatus(res.status) && attempt < 3) return delay(400 * attempt).then(run);
            return res;
          }, function (err) {
            clearTimeout(timer);
            var callerAborted = parent && parent.aborted && !timedOut;
            if (!callerAborted && attempt < 3) return delay(400 * attempt).then(run);
            throw err;
          });
        }
        return run().then(
          function (res) { fetchQueue.release(); return res; },
          function (err) { fetchQueue.release(); throw err; },
        );
      });
    };
  }

  var OrigXHR = window.XMLHttpRequest;
  if (!OrigXHR) return;

  function GateXHR() {
    var xhr = new OrigXHR();
    var origOpen = xhr.open;
    var origSend = xhr.send;
    var opened = false;
    var openArgs = [];
    xhr.open = function () {
      opened = true;
      openArgs = Array.prototype.slice.call(arguments);
      return origOpen.apply(xhr, openArgs);
    };
    xhr.send = function (body) {
      if (!opened) return origSend.call(xhr, body);
      var released = false;
      function finish() {
        if (released) return;
        released = true;
        xhrQueue.release();
      }
      xhrQueue.acquire().then(function () {
        var timer = setTimeout(function () {
          try { xhr.abort(); } catch (e) { /* already finished */ }
        }, TIMEOUT_MS);
        xhr.addEventListener("loadend", function () {
          clearTimeout(timer);
          finish();
        });
        try {
          origSend.call(xhr, body);
        } catch (e) {
          clearTimeout(timer);
          finish();
        }
      });
    };
    return xhr;
  }
  GateXHR.prototype = OrigXHR.prototype;
  window.XMLHttpRequest = GateXHR;

  function revealOwnLoader() {
    var own = document.getElementById("loading");
    var boot = document.getElementById("biab-boot");
    if (own && boot) boot.setAttribute("hidden", "");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", revealOwnLoader);
  else revealOwnLoader();
})();
