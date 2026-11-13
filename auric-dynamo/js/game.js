const k = {
  cabinetL: "assets/art/raster/cabinet-landscape.webp",
  cabinetP: "assets/art/raster/cabinet-portrait.webp",
  logo: "assets/art/raster/logo.webp",
  pointer: "assets/art/raster/wheel-pointer.webp",
  reelCell: "assets/art/raster/reel-cell.webp",
  spin: "assets/art/raster/spin-idle.webp",
  spinPressed: "assets/art/raster/spin-pressed.webp",
  spinDisabled: "assets/art/raster/spin-disabled.webp",
  plus: "assets/art/raster/btn-plus-normal.webp",
  plusPressed: "assets/art/raster/btn-plus-pressed.webp",
  minus: "assets/art/raster/btn-minus-normal.webp",
  minusPressed: "assets/art/raster/btn-minus-pressed.webp",
  turbo: "assets/art/raster/btn-turbo-normal.webp",
  turboPressed: "assets/art/raster/btn-turbo-pressed.webp",
  auto: "assets/art/raster/btn-auto-normal.webp",
  autoPressed: "assets/art/raster/btn-auto-pressed.webp",
  sound: "assets/art/raster/btn-sound-normal.webp",
  soundPressed: "assets/art/raster/btn-sound-pressed.webp",
  music: "assets/art/raster/btn-music-normal.webp",
  musicPressed: "assets/art/raster/btn-music-pressed.webp",
  gear: "assets/art/raster/btn-gear-normal.webp",
  gearPressed: "assets/art/raster/btn-gear-pressed.webp",
  skip: "assets/art/raster/btn-skip-normal.webp",
  skipPressed: "assets/art/raster/btn-skip-pressed.webp",
  skipDisabled: "assets/art/raster/btn-skip-disabled.webp",
  stop: "assets/art/raster/btn-stop-normal.webp",
  stopPressed: "assets/art/raster/btn-stop-pressed.webp",
  help: "assets/art/raster/btn-help-normal.webp",
  helpPressed: "assets/art/raster/btn-help-pressed.webp",
  star: "assets/art/standings/btn-star-normal.webp",
  starPressed: "assets/art/standings/btn-star-pressed.webp",
  starIcon: "assets/art/standings/star-icon@2x.webp",
  plaque: "assets/art/raster/plaque.webp",
  wheelFace: "assets/art/raster/wheel-face.webp",
  coinSheet: "assets/art/raster/coin-sheet-12x128.webp",
  bulbOn: "assets/art/raster/bulb-on.webp",
  bulbOff: "assets/art/raster/bulb-off.webp",
  glowEmerald: "assets/art/raster/glow-emerald-128.webp",
  spark: "assets/art/raster/spark-star4-128.webp",
  sparkSmall: "assets/art/raster/spark-star4-64.webp",
  streak: "assets/art/raster/spark-streak-256x32.webp",
  splashL: "assets/art/splash/splash-landscape.webp",
  splashP: "assets/art/splash/splash-portrait.webp",
  plates: {
    big: "assets/art/raster/win-big.webp",
    mega: "assets/art/raster/win-mega.webp",
    super: "assets/art/raster/win-super.webp",
    epic: "assets/art/raster/win-epic.webp"
  },
  numerals: {
    0: "assets/art/raster/numeral-0.webp",
    1: "assets/art/raster/numeral-1.webp",
    5: "assets/art/raster/numeral-5.webp",
    "00": "assets/art/raster/numeral-00.webp"
  },
  modifiers: {
    x1: "assets/art/raster/mod-1x.webp",
    x2: "assets/art/raster/mod-2x.webp",
    x5: "assets/art/raster/mod-5x.webp",
    x10: "assets/art/raster/mod-10x.webp",
    replace: "assets/art/raster/mod-replace.webp",
    bank: "assets/art/raster/mod-bank-add.webp",
    wheel: "assets/art/raster/mod-wheel.webp"
  }
};
function H(s) {
  const e = globalThis.__auricAsset;
  return typeof e == "function" ? e(s) : new URL(s, window.location.href).href;
}
function vt() {
  try {
    return new URLSearchParams(location.search).has("fx");
  } catch {
    return !1;
  }
}
function kt(s, e = "#2fd0ff") {
  if (!vt() || document.getElementById("fx-panel")) return;
  const t = document.createElement("style");
  t.textContent = `
#fx-panel { position: fixed; left: 10px; top: 10px; z-index: 2147483000; font: 600 13px/1.3 system-ui, -apple-system, sans-serif; }
#fx-toggle { font: inherit; font-weight: 700; cursor: pointer; background: rgba(8,12,30,.92); color: ${e};
  border: 2px solid ${e}; border-radius: 8px; padding: 6px 12px; }
#fx-list { display: none; flex-direction: column; gap: 4px; margin-top: 6px; max-height: 72vh; overflow-y: auto;
  background: rgba(6,10,26,.95); border: 1px solid ${e}; border-radius: 8px; padding: 6px; }
#fx-list.open { display: flex; }
#fx-list button { font: inherit; cursor: pointer; text-align: left; white-space: nowrap;
  background: rgba(255,255,255,.07); color: #e8f1ff; border: 1px solid rgba(255,255,255,.18);
  border-radius: 6px; padding: 5px 10px; }
#fx-list button:hover { background: rgba(255,255,255,.17); }
#fx-panel button:focus-visible { outline: 2px solid #ffd54a; outline-offset: 2px; }`, document.head.appendChild(t);
  const r = document.createElement("div");
  r.id = "fx-panel";
  const i = document.createElement("button");
  i.type = "button", i.id = "fx-toggle", i.textContent = "FX";
  const a = document.createElement("div");
  a.id = "fx-list", r.append(i, a), document.body.appendChild(r);
  let u = !1;
  i.onclick = () => {
    if (!u) {
      const d = At(s);
      if (u = d.length > 0, a.textContent = "", !u) {
        const c = document.createElement("div");
        c.style.cssText = "max-width:220px;white-space:normal;padding:4px 6px;color:#9fb0cc;font-weight:500", c.textContent = "The game has not finished starting. Some games need a lobby (open with ?brand=). Reopen this panel once it has.", a.appendChild(c);
      }
      for (const c of d) {
        const m = document.createElement("button");
        m.type = "button", m.textContent = c.label, m.onclick = () => {
          try {
            Promise.resolve(c.run()).catch((b) => console.error("[fx]", c.label, b));
          } catch (b) {
            console.error("[fx]", c.label, b);
          }
        }, a.appendChild(m);
      }
    }
    a.classList.toggle("open");
  };
}
function At(s) {
  try {
    return s();
  } catch (e) {
    return console.error("[fx] building the case list failed", e), [];
  }
}
const Ie = {
  reelStops: [480, 630, 780],
  assemble: 220,
  inhale: 120,
  modifier: 280,
  feature: { replace: 900, bank: 1800, wheel: 2400, none: 0 },
  count: [0, 1700, 3300, 4500, 6e3],
  resolve: 350,
  collection: 400,
  cap: 9e3,
  turboScale: 0.6,
  superScale: 0.35,
  reduced: 150,
  fadeMs: 80,
  cycleFloorMs: 3e3,
  holdMs: 600
}, xe = 2e3 / 2400, it = 2, St = Ie.holdMs, xt = Ie.cycleFloorMs, Mt = [10, 25, 50];
function De(s) {
  return Mt.includes(s);
}
function ot() {
  return { phase: "idle", downAt: 0 };
}
function Tt(s) {
  return { phase: "pressing", downAt: s };
}
function Et(s, e) {
  return s.phase === "pressing" && e - s.downAt >= St ? { ...s, phase: "armed" } : s;
}
function be(s) {
  return s.phase === "idle" ? s : { ...s, phase: "cancelled" };
}
function It(s, e) {
  const t = ot();
  return s.phase === "idle" || s.phase === "cancelled" || !e ? { hold: t, action: "none" } : s.phase === "armed" ? { hold: t, action: "autoplay" } : { hold: t, action: "spin" };
}
function Lt(s, e) {
  return s !== null ? s : "spin";
}
function Pt(s, e) {
  return Math.max(e, s + xt);
}
function Ct(s, e) {
  return s ? s.modifier === "replace" || s.modifier === "bank" || s.modifier === "wheel" ? s.modifier : s.collectionFlourish ? "collection" : e.remaining <= 0 ? "count" : null : null;
}
var ce = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Ce = {};
var Ze;
function Nt() {
  return Ze || (Ze = 1, (function(s) {
    (function() {
      var e = function() {
        this.init();
      };
      e.prototype = {
        /**
         * Initialize the global Howler object.
         * @return {Howler}
         */
        init: function() {
          var n = this || t;
          return n._counter = 1e3, n._html5AudioPool = [], n.html5PoolSize = 10, n._codecs = {}, n._howls = [], n._muted = !1, n._volume = 1, n._canPlayEvent = "canplaythrough", n._navigator = typeof window < "u" && window.navigator ? window.navigator : null, n.masterGain = null, n.noAudio = !1, n.usingWebAudio = !0, n.autoSuspend = !0, n.ctx = null, n.autoUnlock = !0, n._setup(), n;
        },
        /**
         * Get/set the global volume for all sounds.
         * @param  {Float} vol Volume from 0.0 to 1.0.
         * @return {Howler/Float}     Returns self or current volume.
         */
        volume: function(n) {
          var o = this || t;
          if (n = parseFloat(n), o.ctx || b(), typeof n < "u" && n >= 0 && n <= 1) {
            if (o._volume = n, o._muted)
              return o;
            o.usingWebAudio && o.masterGain.gain.setValueAtTime(n, t.ctx.currentTime);
            for (var l = 0; l < o._howls.length; l++)
              if (!o._howls[l]._webAudio)
                for (var h = o._howls[l]._getSoundIds(), p = 0; p < h.length; p++) {
                  var g = o._howls[l]._soundById(h[p]);
                  g && g._node && (g._node.volume = g._volume * n);
                }
            return o;
          }
          return o._volume;
        },
        /**
         * Handle muting and unmuting globally.
         * @param  {Boolean} muted Is muted or not.
         */
        mute: function(n) {
          var o = this || t;
          o.ctx || b(), o._muted = n, o.usingWebAudio && o.masterGain.gain.setValueAtTime(n ? 0 : o._volume, t.ctx.currentTime);
          for (var l = 0; l < o._howls.length; l++)
            if (!o._howls[l]._webAudio)
              for (var h = o._howls[l]._getSoundIds(), p = 0; p < h.length; p++) {
                var g = o._howls[l]._soundById(h[p]);
                g && g._node && (g._node.muted = n ? !0 : g._muted);
              }
          return o;
        },
        /**
         * Handle stopping all sounds globally.
         */
        stop: function() {
          for (var n = this || t, o = 0; o < n._howls.length; o++)
            n._howls[o].stop();
          return n;
        },
        /**
         * Unload and destroy all currently loaded Howl objects.
         * @return {Howler}
         */
        unload: function() {
          for (var n = this || t, o = n._howls.length - 1; o >= 0; o--)
            n._howls[o].unload();
          return n.usingWebAudio && n.ctx && typeof n.ctx.close < "u" && (n.ctx.close(), n.ctx = null, b()), n;
        },
        /**
         * Check for codec support of specific extension.
         * @param  {String} ext Audio file extention.
         * @return {Boolean}
         */
        codecs: function(n) {
          return (this || t)._codecs[n.replace(/^x-/, "")];
        },
        /**
         * Setup various state values for global tracking.
         * @return {Howler}
         */
        _setup: function() {
          var n = this || t;
          if (n.state = n.ctx && n.ctx.state || "suspended", n._autoSuspend(), !n.usingWebAudio)
            if (typeof Audio < "u")
              try {
                var o = new Audio();
                typeof o.oncanplaythrough > "u" && (n._canPlayEvent = "canplay");
              } catch {
                n.noAudio = !0;
              }
            else
              n.noAudio = !0;
          try {
            var o = new Audio();
            o.muted && (n.noAudio = !0);
          } catch {
          }
          return n.noAudio || n._setupCodecs(), n;
        },
        /**
         * Check for browser support for various codecs and cache the results.
         * @return {Howler}
         */
        _setupCodecs: function() {
          var n = this || t, o = null;
          try {
            o = typeof Audio < "u" ? new Audio() : null;
          } catch {
            return n;
          }
          if (!o || typeof o.canPlayType != "function")
            return n;
          var l = o.canPlayType("audio/mpeg;").replace(/^no$/, ""), h = n._navigator ? n._navigator.userAgent : "", p = h.match(/OPR\/(\d+)/g), g = p && parseInt(p[0].split("/")[1], 10) < 33, f = h.indexOf("Safari") !== -1 && h.indexOf("Chrome") === -1, w = h.match(/Version\/(.*?) /), v = f && w && parseInt(w[1], 10) < 15;
          return n._codecs = {
            mp3: !!(!g && (l || o.canPlayType("audio/mp3;").replace(/^no$/, ""))),
            mpeg: !!l,
            opus: !!o.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
            ogg: !!o.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
            oga: !!o.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
            wav: !!(o.canPlayType('audio/wav; codecs="1"') || o.canPlayType("audio/wav")).replace(/^no$/, ""),
            aac: !!o.canPlayType("audio/aac;").replace(/^no$/, ""),
            caf: !!o.canPlayType("audio/x-caf;").replace(/^no$/, ""),
            m4a: !!(o.canPlayType("audio/x-m4a;") || o.canPlayType("audio/m4a;") || o.canPlayType("audio/aac;")).replace(/^no$/, ""),
            m4b: !!(o.canPlayType("audio/x-m4b;") || o.canPlayType("audio/m4b;") || o.canPlayType("audio/aac;")).replace(/^no$/, ""),
            mp4: !!(o.canPlayType("audio/x-mp4;") || o.canPlayType("audio/mp4;") || o.canPlayType("audio/aac;")).replace(/^no$/, ""),
            weba: !!(!v && o.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")),
            webm: !!(!v && o.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")),
            dolby: !!o.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ""),
            flac: !!(o.canPlayType("audio/x-flac;") || o.canPlayType("audio/flac;")).replace(/^no$/, "")
          }, n;
        },
        /**
         * Some browsers/devices will only allow audio to be played after a user interaction.
         * Attempt to automatically unlock audio on the first user interaction.
         * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
         * @return {Howler}
         */
        _unlockAudio: function() {
          var n = this || t;
          if (!(n._audioUnlocked || !n.ctx)) {
            n._audioUnlocked = !1, n.autoUnlock = !1, !n._mobileUnloaded && n.ctx.sampleRate !== 44100 && (n._mobileUnloaded = !0, n.unload()), n._scratchBuffer = n.ctx.createBuffer(1, 1, 22050);
            var o = function(l) {
              for (; n._html5AudioPool.length < n.html5PoolSize; )
                try {
                  var h = new Audio();
                  h._unlocked = !0, n._releaseHtml5Audio(h);
                } catch {
                  n.noAudio = !0;
                  break;
                }
              for (var p = 0; p < n._howls.length; p++)
                if (!n._howls[p]._webAudio)
                  for (var g = n._howls[p]._getSoundIds(), f = 0; f < g.length; f++) {
                    var w = n._howls[p]._soundById(g[f]);
                    w && w._node && !w._node._unlocked && (w._node._unlocked = !0, w._node.load());
                  }
              n._autoResume();
              var v = n.ctx.createBufferSource();
              v.buffer = n._scratchBuffer, v.connect(n.ctx.destination), typeof v.start > "u" ? v.noteOn(0) : v.start(0), typeof n.ctx.resume == "function" && n.ctx.resume(), v.onended = function() {
                v.disconnect(0), n._audioUnlocked = !0, document.removeEventListener("touchstart", o, !0), document.removeEventListener("touchend", o, !0), document.removeEventListener("click", o, !0), document.removeEventListener("keydown", o, !0);
                for (var A = 0; A < n._howls.length; A++)
                  n._howls[A]._emit("unlock");
              };
            };
            return document.addEventListener("touchstart", o, !0), document.addEventListener("touchend", o, !0), document.addEventListener("click", o, !0), document.addEventListener("keydown", o, !0), n;
          }
        },
        /**
         * Get an unlocked HTML5 Audio object from the pool. If none are left,
         * return a new Audio object and throw a warning.
         * @return {Audio} HTML5 Audio object.
         */
        _obtainHtml5Audio: function() {
          var n = this || t;
          if (n._html5AudioPool.length)
            return n._html5AudioPool.pop();
          var o = new Audio().play();
          return o && typeof Promise < "u" && (o instanceof Promise || typeof o.then == "function") && o.catch(function() {
            console.warn("HTML5 Audio pool exhausted, returning potentially locked audio object.");
          }), new Audio();
        },
        /**
         * Return an activated HTML5 Audio object to the pool.
         * @return {Howler}
         */
        _releaseHtml5Audio: function(n) {
          var o = this || t;
          return n._unlocked && o._html5AudioPool.push(n), o;
        },
        /**
         * Automatically suspend the Web Audio AudioContext after no sound has played for 30 seconds.
         * This saves processing/energy and fixes various browser-specific bugs with audio getting stuck.
         * @return {Howler}
         */
        _autoSuspend: function() {
          var n = this;
          if (!(!n.autoSuspend || !n.ctx || typeof n.ctx.suspend > "u" || !t.usingWebAudio)) {
            for (var o = 0; o < n._howls.length; o++)
              if (n._howls[o]._webAudio) {
                for (var l = 0; l < n._howls[o]._sounds.length; l++)
                  if (!n._howls[o]._sounds[l]._paused)
                    return n;
              }
            return n._suspendTimer && clearTimeout(n._suspendTimer), n._suspendTimer = setTimeout(function() {
              if (n.autoSuspend) {
                n._suspendTimer = null, n.state = "suspending";
                var h = function() {
                  n.state = "suspended", n._resumeAfterSuspend && (delete n._resumeAfterSuspend, n._autoResume());
                };
                n.ctx.suspend().then(h, h);
              }
            }, 3e4), n;
          }
        },
        /**
         * Automatically resume the Web Audio AudioContext when a new sound is played.
         * @return {Howler}
         */
        _autoResume: function() {
          var n = this;
          if (!(!n.ctx || typeof n.ctx.resume > "u" || !t.usingWebAudio))
            return n.state === "running" && n.ctx.state !== "interrupted" && n._suspendTimer ? (clearTimeout(n._suspendTimer), n._suspendTimer = null) : n.state === "suspended" || n.state === "running" && n.ctx.state === "interrupted" ? (n.ctx.resume().then(function() {
              n.state = "running";
              for (var o = 0; o < n._howls.length; o++)
                n._howls[o]._emit("resume");
            }), n._suspendTimer && (clearTimeout(n._suspendTimer), n._suspendTimer = null)) : n.state === "suspending" && (n._resumeAfterSuspend = !0), n;
        }
      };
      var t = new e(), r = function(n) {
        var o = this;
        if (!n.src || n.src.length === 0) {
          console.error("An array of source files must be passed with any new Howl.");
          return;
        }
        o.init(n);
      };
      r.prototype = {
        /**
         * Initialize a new Howl group object.
         * @param  {Object} o Passed in properties for this group.
         * @return {Howl}
         */
        init: function(n) {
          var o = this;
          return t.ctx || b(), o._autoplay = n.autoplay || !1, o._format = typeof n.format != "string" ? n.format : [n.format], o._html5 = n.html5 || !1, o._muted = n.mute || !1, o._loop = n.loop || !1, o._pool = n.pool || 5, o._preload = typeof n.preload == "boolean" || n.preload === "metadata" ? n.preload : !0, o._rate = n.rate || 1, o._sprite = n.sprite || {}, o._src = typeof n.src != "string" ? n.src : [n.src], o._volume = n.volume !== void 0 ? n.volume : 1, o._xhr = {
            method: n.xhr && n.xhr.method ? n.xhr.method : "GET",
            headers: n.xhr && n.xhr.headers ? n.xhr.headers : null,
            withCredentials: n.xhr && n.xhr.withCredentials ? n.xhr.withCredentials : !1
          }, o._duration = 0, o._state = "unloaded", o._sounds = [], o._endTimers = {}, o._queue = [], o._playLock = !1, o._onend = n.onend ? [{ fn: n.onend }] : [], o._onfade = n.onfade ? [{ fn: n.onfade }] : [], o._onload = n.onload ? [{ fn: n.onload }] : [], o._onloaderror = n.onloaderror ? [{ fn: n.onloaderror }] : [], o._onplayerror = n.onplayerror ? [{ fn: n.onplayerror }] : [], o._onpause = n.onpause ? [{ fn: n.onpause }] : [], o._onplay = n.onplay ? [{ fn: n.onplay }] : [], o._onstop = n.onstop ? [{ fn: n.onstop }] : [], o._onmute = n.onmute ? [{ fn: n.onmute }] : [], o._onvolume = n.onvolume ? [{ fn: n.onvolume }] : [], o._onrate = n.onrate ? [{ fn: n.onrate }] : [], o._onseek = n.onseek ? [{ fn: n.onseek }] : [], o._onunlock = n.onunlock ? [{ fn: n.onunlock }] : [], o._onresume = [], o._webAudio = t.usingWebAudio && !o._html5, typeof t.ctx < "u" && t.ctx && t.autoUnlock && t._unlockAudio(), t._howls.push(o), o._autoplay && o._queue.push({
            event: "play",
            action: function() {
              o.play();
            }
          }), o._preload && o._preload !== "none" && o.load(), o;
        },
        /**
         * Load the audio file.
         * @return {Howler}
         */
        load: function() {
          var n = this, o = null;
          if (t.noAudio) {
            n._emit("loaderror", null, "No audio support.");
            return;
          }
          typeof n._src == "string" && (n._src = [n._src]);
          for (var l = 0; l < n._src.length; l++) {
            var h, p;
            if (n._format && n._format[l])
              h = n._format[l];
            else {
              if (p = n._src[l], typeof p != "string") {
                n._emit("loaderror", null, "Non-string found in selected audio sources - ignoring.");
                continue;
              }
              h = /^data:audio\/([^;,]+);/i.exec(p), h || (h = /\.([^.]+)$/.exec(p.split("?", 1)[0])), h && (h = h[1].toLowerCase());
            }
            if (h || console.warn('No file extension was found. Consider using the "format" property or specify an extension.'), h && t.codecs(h)) {
              o = n._src[l];
              break;
            }
          }
          if (!o) {
            n._emit("loaderror", null, "No codec support for selected audio sources.");
            return;
          }
          return n._src = o, n._state = "loading", window.location.protocol === "https:" && o.slice(0, 5) === "http:" && (n._html5 = !0, n._webAudio = !1), new i(n), n._webAudio && u(n), n;
        },
        /**
         * Play a sound or resume previous playback.
         * @param  {String/Number} sprite   Sprite name for sprite playback or sound id to continue previous.
         * @param  {Boolean} internal Internal Use: true prevents event firing.
         * @return {Number}          Sound ID.
         */
        play: function(n, o) {
          var l = this, h = null;
          if (typeof n == "number")
            h = n, n = null;
          else {
            if (typeof n == "string" && l._state === "loaded" && !l._sprite[n])
              return null;
            if (typeof n > "u" && (n = "__default", !l._playLock)) {
              for (var p = 0, g = 0; g < l._sounds.length; g++)
                l._sounds[g]._paused && !l._sounds[g]._ended && (p++, h = l._sounds[g]._id);
              p === 1 ? n = null : h = null;
            }
          }
          var f = h ? l._soundById(h) : l._inactiveSound();
          if (!f)
            return null;
          if (h && !n && (n = f._sprite || "__default"), l._state !== "loaded") {
            f._sprite = n, f._ended = !1;
            var w = f._id;
            return l._queue.push({
              event: "play",
              action: function() {
                l.play(w);
              }
            }), w;
          }
          if (h && !f._paused)
            return o || l._loadQueue("play"), f._id;
          l._webAudio && t._autoResume();
          var v = Math.max(0, f._seek > 0 ? f._seek : l._sprite[n][0] / 1e3), A = Math.max(0, (l._sprite[n][0] + l._sprite[n][1]) / 1e3 - v), M = A * 1e3 / Math.abs(f._rate), E = l._sprite[n][0] / 1e3, F = (l._sprite[n][0] + l._sprite[n][1]) / 1e3;
          f._sprite = n, f._ended = !1;
          var R = function() {
            f._paused = !1, f._seek = v, f._start = E, f._stop = F, f._loop = !!(f._loop || l._sprite[n][2]);
          };
          if (v >= F) {
            l._ended(f);
            return;
          }
          var x = f._node;
          if (l._webAudio) {
            var Q = function() {
              l._playLock = !1, R(), l._refreshBuffer(f);
              var C = f._muted || l._muted ? 0 : f._volume;
              x.gain.setValueAtTime(C, t.ctx.currentTime), f._playStart = t.ctx.currentTime, typeof x.bufferSource.start > "u" ? f._loop ? x.bufferSource.noteGrainOn(0, v, 86400) : x.bufferSource.noteGrainOn(0, v, A) : f._loop ? x.bufferSource.start(0, v, 86400) : x.bufferSource.start(0, v, A), M !== 1 / 0 && (l._endTimers[f._id] = setTimeout(l._ended.bind(l, f), M)), o || setTimeout(function() {
                l._emit("play", f._id), l._loadQueue();
              }, 0);
            };
            t.state === "running" && t.ctx.state !== "interrupted" ? Q() : (l._playLock = !0, l.once("resume", Q), l._clearTimer(f._id));
          } else {
            var Y = function() {
              x.currentTime = v, x.muted = f._muted || l._muted || t._muted || x.muted, x.volume = f._volume * t.volume(), x.playbackRate = f._rate;
              try {
                var C = x.play();
                if (C && typeof Promise < "u" && (C instanceof Promise || typeof C.then == "function") ? (l._playLock = !0, R(), C.then(function() {
                  l._playLock = !1, x._unlocked = !0, o ? l._loadQueue() : l._emit("play", f._id);
                }).catch(function() {
                  l._playLock = !1, l._emit("playerror", f._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction."), f._ended = !0, f._paused = !0;
                })) : o || (l._playLock = !1, R(), l._emit("play", f._id)), x.playbackRate = f._rate, x.paused) {
                  l._emit("playerror", f._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
                  return;
                }
                n !== "__default" || f._loop ? l._endTimers[f._id] = setTimeout(l._ended.bind(l, f), M) : (l._endTimers[f._id] = function() {
                  l._ended(f), x.removeEventListener("ended", l._endTimers[f._id], !1);
                }, x.addEventListener("ended", l._endTimers[f._id], !1));
              } catch (L) {
                l._emit("playerror", f._id, L);
              }
            };
            x.src === "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA" && (x.src = l._src, x.load());
            var K = window && window.ejecta || !x.readyState && t._navigator.isCocoonJS;
            if (x.readyState >= 3 || K)
              Y();
            else {
              l._playLock = !0, l._state = "loading";
              var J = function() {
                l._state = "loaded", Y(), x.removeEventListener(t._canPlayEvent, J, !1);
              };
              x.addEventListener(t._canPlayEvent, J, !1), l._clearTimer(f._id);
            }
          }
          return f._id;
        },
        /**
         * Pause playback and save current position.
         * @param  {Number} id The sound ID (empty to pause all in group).
         * @return {Howl}
         */
        pause: function(n) {
          var o = this;
          if (o._state !== "loaded" || o._playLock)
            return o._queue.push({
              event: "pause",
              action: function() {
                o.pause(n);
              }
            }), o;
          for (var l = o._getSoundIds(n), h = 0; h < l.length; h++) {
            o._clearTimer(l[h]);
            var p = o._soundById(l[h]);
            if (p && !p._paused && (p._seek = o.seek(l[h]), p._rateSeek = 0, p._paused = !0, o._stopFade(l[h]), p._node))
              if (o._webAudio) {
                if (!p._node.bufferSource)
                  continue;
                typeof p._node.bufferSource.stop > "u" ? p._node.bufferSource.noteOff(0) : p._node.bufferSource.stop(0), o._cleanBuffer(p._node);
              } else (!isNaN(p._node.duration) || p._node.duration === 1 / 0) && p._node.pause();
            arguments[1] || o._emit("pause", p ? p._id : null);
          }
          return o;
        },
        /**
         * Stop playback and reset to start.
         * @param  {Number} id The sound ID (empty to stop all in group).
         * @param  {Boolean} internal Internal Use: true prevents event firing.
         * @return {Howl}
         */
        stop: function(n, o) {
          var l = this;
          if (l._state !== "loaded" || l._playLock)
            return l._queue.push({
              event: "stop",
              action: function() {
                l.stop(n);
              }
            }), l;
          for (var h = l._getSoundIds(n), p = 0; p < h.length; p++) {
            l._clearTimer(h[p]);
            var g = l._soundById(h[p]);
            g && (g._seek = g._start || 0, g._rateSeek = 0, g._paused = !0, g._ended = !0, l._stopFade(h[p]), g._node && (l._webAudio ? g._node.bufferSource && (typeof g._node.bufferSource.stop > "u" ? g._node.bufferSource.noteOff(0) : g._node.bufferSource.stop(0), l._cleanBuffer(g._node)) : (!isNaN(g._node.duration) || g._node.duration === 1 / 0) && (g._node.currentTime = g._start || 0, g._node.pause(), g._node.duration === 1 / 0 && l._clearSound(g._node))), o || l._emit("stop", g._id));
          }
          return l;
        },
        /**
         * Mute/unmute a single sound or all sounds in this Howl group.
         * @param  {Boolean} muted Set to true to mute and false to unmute.
         * @param  {Number} id    The sound ID to update (omit to mute/unmute all).
         * @return {Howl}
         */
        mute: function(n, o) {
          var l = this;
          if (l._state !== "loaded" || l._playLock)
            return l._queue.push({
              event: "mute",
              action: function() {
                l.mute(n, o);
              }
            }), l;
          if (typeof o > "u")
            if (typeof n == "boolean")
              l._muted = n;
            else
              return l._muted;
          for (var h = l._getSoundIds(o), p = 0; p < h.length; p++) {
            var g = l._soundById(h[p]);
            g && (g._muted = n, g._interval && l._stopFade(g._id), l._webAudio && g._node ? g._node.gain.setValueAtTime(n ? 0 : g._volume, t.ctx.currentTime) : g._node && (g._node.muted = t._muted ? !0 : n), l._emit("mute", g._id));
          }
          return l;
        },
        /**
         * Get/set the volume of this sound or of the Howl group. This method can optionally take 0, 1 or 2 arguments.
         *   volume() -> Returns the group's volume value.
         *   volume(id) -> Returns the sound id's current volume.
         *   volume(vol) -> Sets the volume of all sounds in this Howl group.
         *   volume(vol, id) -> Sets the volume of passed sound id.
         * @return {Howl/Number} Returns self or current volume.
         */
        volume: function() {
          var n = this, o = arguments, l, h;
          if (o.length === 0)
            return n._volume;
          if (o.length === 1 || o.length === 2 && typeof o[1] > "u") {
            var p = n._getSoundIds(), g = p.indexOf(o[0]);
            g >= 0 ? h = parseInt(o[0], 10) : l = parseFloat(o[0]);
          } else o.length >= 2 && (l = parseFloat(o[0]), h = parseInt(o[1], 10));
          var f;
          if (typeof l < "u" && l >= 0 && l <= 1) {
            if (n._state !== "loaded" || n._playLock)
              return n._queue.push({
                event: "volume",
                action: function() {
                  n.volume.apply(n, o);
                }
              }), n;
            typeof h > "u" && (n._volume = l), h = n._getSoundIds(h);
            for (var w = 0; w < h.length; w++)
              f = n._soundById(h[w]), f && (f._volume = l, o[2] || n._stopFade(h[w]), n._webAudio && f._node && !f._muted ? f._node.gain.setValueAtTime(l, t.ctx.currentTime) : f._node && !f._muted && (f._node.volume = l * t.volume()), n._emit("volume", f._id));
          } else
            return f = h ? n._soundById(h) : n._sounds[0], f ? f._volume : 0;
          return n;
        },
        /**
         * Fade a currently playing sound between two volumes (if no id is passed, all sounds will fade).
         * @param  {Number} from The value to fade from (0.0 to 1.0).
         * @param  {Number} to   The volume to fade to (0.0 to 1.0).
         * @param  {Number} len  Time in milliseconds to fade.
         * @param  {Number} id   The sound id (omit to fade all sounds).
         * @return {Howl}
         */
        fade: function(n, o, l, h) {
          var p = this;
          if (p._state !== "loaded" || p._playLock)
            return p._queue.push({
              event: "fade",
              action: function() {
                p.fade(n, o, l, h);
              }
            }), p;
          n = Math.min(Math.max(0, parseFloat(n)), 1), o = Math.min(Math.max(0, parseFloat(o)), 1), l = parseFloat(l), p.volume(n, h);
          for (var g = p._getSoundIds(h), f = 0; f < g.length; f++) {
            var w = p._soundById(g[f]);
            if (w) {
              if (h || p._stopFade(g[f]), p._webAudio && !w._muted) {
                var v = t.ctx.currentTime, A = v + l / 1e3;
                w._volume = n, w._node.gain.setValueAtTime(n, v), w._node.gain.linearRampToValueAtTime(o, A);
              }
              p._startFadeInterval(w, n, o, l, g[f], typeof h > "u");
            }
          }
          return p;
        },
        /**
         * Starts the internal interval to fade a sound.
         * @param  {Object} sound Reference to sound to fade.
         * @param  {Number} from The value to fade from (0.0 to 1.0).
         * @param  {Number} to   The volume to fade to (0.0 to 1.0).
         * @param  {Number} len  Time in milliseconds to fade.
         * @param  {Number} id   The sound id to fade.
         * @param  {Boolean} isGroup   If true, set the volume on the group.
         */
        _startFadeInterval: function(n, o, l, h, p, g) {
          var f = this, w = o, v = l - o, A = Math.abs(v / 0.01), M = Math.max(4, A > 0 ? h / A : h), E = Date.now();
          n._fadeTo = l, n._interval = setInterval(function() {
            var F = (Date.now() - E) / h;
            E = Date.now(), w += v * F, w = Math.round(w * 100) / 100, v < 0 ? w = Math.max(l, w) : w = Math.min(l, w), f._webAudio ? n._volume = w : f.volume(w, n._id, !0), g && (f._volume = w), (l < o && w <= l || l > o && w >= l) && (clearInterval(n._interval), n._interval = null, n._fadeTo = null, f.volume(l, n._id), f._emit("fade", n._id));
          }, M);
        },
        /**
         * Internal method that stops the currently playing fade when
         * a new fade starts, volume is changed or the sound is stopped.
         * @param  {Number} id The sound id.
         * @return {Howl}
         */
        _stopFade: function(n) {
          var o = this, l = o._soundById(n);
          return l && l._interval && (o._webAudio && l._node.gain.cancelScheduledValues(t.ctx.currentTime), clearInterval(l._interval), l._interval = null, o.volume(l._fadeTo, n), l._fadeTo = null, o._emit("fade", n)), o;
        },
        /**
         * Get/set the loop parameter on a sound. This method can optionally take 0, 1 or 2 arguments.
         *   loop() -> Returns the group's loop value.
         *   loop(id) -> Returns the sound id's loop value.
         *   loop(loop) -> Sets the loop value for all sounds in this Howl group.
         *   loop(loop, id) -> Sets the loop value of passed sound id.
         * @return {Howl/Boolean} Returns self or current loop value.
         */
        loop: function() {
          var n = this, o = arguments, l, h, p;
          if (o.length === 0)
            return n._loop;
          if (o.length === 1)
            if (typeof o[0] == "boolean")
              l = o[0], n._loop = l;
            else
              return p = n._soundById(parseInt(o[0], 10)), p ? p._loop : !1;
          else o.length === 2 && (l = o[0], h = parseInt(o[1], 10));
          for (var g = n._getSoundIds(h), f = 0; f < g.length; f++)
            p = n._soundById(g[f]), p && (p._loop = l, n._webAudio && p._node && p._node.bufferSource && (p._node.bufferSource.loop = l, l && (p._node.bufferSource.loopStart = p._start || 0, p._node.bufferSource.loopEnd = p._stop, n.playing(g[f]) && (n.pause(g[f], !0), n.play(g[f], !0)))));
          return n;
        },
        /**
         * Get/set the playback rate of a sound. This method can optionally take 0, 1 or 2 arguments.
         *   rate() -> Returns the first sound node's current playback rate.
         *   rate(id) -> Returns the sound id's current playback rate.
         *   rate(rate) -> Sets the playback rate of all sounds in this Howl group.
         *   rate(rate, id) -> Sets the playback rate of passed sound id.
         * @return {Howl/Number} Returns self or the current playback rate.
         */
        rate: function() {
          var n = this, o = arguments, l, h;
          if (o.length === 0)
            h = n._sounds[0]._id;
          else if (o.length === 1) {
            var p = n._getSoundIds(), g = p.indexOf(o[0]);
            g >= 0 ? h = parseInt(o[0], 10) : l = parseFloat(o[0]);
          } else o.length === 2 && (l = parseFloat(o[0]), h = parseInt(o[1], 10));
          var f;
          if (typeof l == "number") {
            if (n._state !== "loaded" || n._playLock)
              return n._queue.push({
                event: "rate",
                action: function() {
                  n.rate.apply(n, o);
                }
              }), n;
            typeof h > "u" && (n._rate = l), h = n._getSoundIds(h);
            for (var w = 0; w < h.length; w++)
              if (f = n._soundById(h[w]), f) {
                n.playing(h[w]) && (f._rateSeek = n.seek(h[w]), f._playStart = n._webAudio ? t.ctx.currentTime : f._playStart), f._rate = l, n._webAudio && f._node && f._node.bufferSource ? f._node.bufferSource.playbackRate.setValueAtTime(l, t.ctx.currentTime) : f._node && (f._node.playbackRate = l);
                var v = n.seek(h[w]), A = (n._sprite[f._sprite][0] + n._sprite[f._sprite][1]) / 1e3 - v, M = A * 1e3 / Math.abs(f._rate);
                (n._endTimers[h[w]] || !f._paused) && (n._clearTimer(h[w]), n._endTimers[h[w]] = setTimeout(n._ended.bind(n, f), M)), n._emit("rate", f._id);
              }
          } else
            return f = n._soundById(h), f ? f._rate : n._rate;
          return n;
        },
        /**
         * Get/set the seek position of a sound. This method can optionally take 0, 1 or 2 arguments.
         *   seek() -> Returns the first sound node's current seek position.
         *   seek(id) -> Returns the sound id's current seek position.
         *   seek(seek) -> Sets the seek position of the first sound node.
         *   seek(seek, id) -> Sets the seek position of passed sound id.
         * @return {Howl/Number} Returns self or the current seek position.
         */
        seek: function() {
          var n = this, o = arguments, l, h;
          if (o.length === 0)
            n._sounds.length && (h = n._sounds[0]._id);
          else if (o.length === 1) {
            var p = n._getSoundIds(), g = p.indexOf(o[0]);
            g >= 0 ? h = parseInt(o[0], 10) : n._sounds.length && (h = n._sounds[0]._id, l = parseFloat(o[0]));
          } else o.length === 2 && (l = parseFloat(o[0]), h = parseInt(o[1], 10));
          if (typeof h > "u")
            return 0;
          if (typeof l == "number" && (n._state !== "loaded" || n._playLock))
            return n._queue.push({
              event: "seek",
              action: function() {
                n.seek.apply(n, o);
              }
            }), n;
          var f = n._soundById(h);
          if (f)
            if (typeof l == "number" && l >= 0) {
              var w = n.playing(h);
              w && n.pause(h, !0), f._seek = l, f._ended = !1, n._clearTimer(h), !n._webAudio && f._node && !isNaN(f._node.duration) && (f._node.currentTime = l);
              var v = function() {
                w && n.play(h, !0), n._emit("seek", h);
              };
              if (w && !n._webAudio) {
                var A = function() {
                  n._playLock ? setTimeout(A, 0) : v();
                };
                setTimeout(A, 0);
              } else
                v();
            } else if (n._webAudio) {
              var M = n.playing(h) ? t.ctx.currentTime - f._playStart : 0, E = f._rateSeek ? f._rateSeek - f._seek : 0;
              return f._seek + (E + M * Math.abs(f._rate));
            } else
              return f._node.currentTime;
          return n;
        },
        /**
         * Check if a specific sound is currently playing or not (if id is provided), or check if at least one of the sounds in the group is playing or not.
         * @param  {Number}  id The sound id to check. If none is passed, the whole sound group is checked.
         * @return {Boolean} True if playing and false if not.
         */
        playing: function(n) {
          var o = this;
          if (typeof n == "number") {
            var l = o._soundById(n);
            return l ? !l._paused : !1;
          }
          for (var h = 0; h < o._sounds.length; h++)
            if (!o._sounds[h]._paused)
              return !0;
          return !1;
        },
        /**
         * Get the duration of this sound. Passing a sound id will return the sprite duration.
         * @param  {Number} id The sound id to check. If none is passed, return full source duration.
         * @return {Number} Audio duration in seconds.
         */
        duration: function(n) {
          var o = this, l = o._duration, h = o._soundById(n);
          return h && (l = o._sprite[h._sprite][1] / 1e3), l;
        },
        /**
         * Returns the current loaded state of this Howl.
         * @return {String} 'unloaded', 'loading', 'loaded'
         */
        state: function() {
          return this._state;
        },
        /**
         * Unload and destroy the current Howl object.
         * This will immediately stop all sound instances attached to this group.
         */
        unload: function() {
          for (var n = this, o = n._sounds, l = 0; l < o.length; l++)
            o[l]._paused || n.stop(o[l]._id), n._webAudio || (n._clearSound(o[l]._node), o[l]._node.removeEventListener("error", o[l]._errorFn, !1), o[l]._node.removeEventListener(t._canPlayEvent, o[l]._loadFn, !1), o[l]._node.removeEventListener("ended", o[l]._endFn, !1), t._releaseHtml5Audio(o[l]._node)), delete o[l]._node, n._clearTimer(o[l]._id);
          var h = t._howls.indexOf(n);
          h >= 0 && t._howls.splice(h, 1);
          var p = !0;
          for (l = 0; l < t._howls.length; l++)
            if (t._howls[l]._src === n._src || n._src.indexOf(t._howls[l]._src) >= 0) {
              p = !1;
              break;
            }
          return a && p && delete a[n._src], t.noAudio = !1, n._state = "unloaded", n._sounds = [], n = null, null;
        },
        /**
         * Listen to a custom event.
         * @param  {String}   event Event name.
         * @param  {Function} fn    Listener to call.
         * @param  {Number}   id    (optional) Only listen to events for this sound.
         * @param  {Number}   once  (INTERNAL) Marks event to fire only once.
         * @return {Howl}
         */
        on: function(n, o, l, h) {
          var p = this, g = p["_on" + n];
          return typeof o == "function" && g.push(h ? { id: l, fn: o, once: h } : { id: l, fn: o }), p;
        },
        /**
         * Remove a custom event. Call without parameters to remove all events.
         * @param  {String}   event Event name.
         * @param  {Function} fn    Listener to remove. Leave empty to remove all.
         * @param  {Number}   id    (optional) Only remove events for this sound.
         * @return {Howl}
         */
        off: function(n, o, l) {
          var h = this, p = h["_on" + n], g = 0;
          if (typeof o == "number" && (l = o, o = null), o || l)
            for (g = 0; g < p.length; g++) {
              var f = l === p[g].id;
              if (o === p[g].fn && f || !o && f) {
                p.splice(g, 1);
                break;
              }
            }
          else if (n)
            h["_on" + n] = [];
          else {
            var w = Object.keys(h);
            for (g = 0; g < w.length; g++)
              w[g].indexOf("_on") === 0 && Array.isArray(h[w[g]]) && (h[w[g]] = []);
          }
          return h;
        },
        /**
         * Listen to a custom event and remove it once fired.
         * @param  {String}   event Event name.
         * @param  {Function} fn    Listener to call.
         * @param  {Number}   id    (optional) Only listen to events for this sound.
         * @return {Howl}
         */
        once: function(n, o, l) {
          var h = this;
          return h.on(n, o, l, 1), h;
        },
        /**
         * Emit all events of a specific type and pass the sound id.
         * @param  {String} event Event name.
         * @param  {Number} id    Sound ID.
         * @param  {Number} msg   Message to go with event.
         * @return {Howl}
         */
        _emit: function(n, o, l) {
          for (var h = this, p = h["_on" + n], g = p.length - 1; g >= 0; g--)
            (!p[g].id || p[g].id === o || n === "load") && (setTimeout(function(f) {
              f.call(this, o, l);
            }.bind(h, p[g].fn), 0), p[g].once && h.off(n, p[g].fn, p[g].id));
          return h._loadQueue(n), h;
        },
        /**
         * Queue of actions initiated before the sound has loaded.
         * These will be called in sequence, with the next only firing
         * after the previous has finished executing (even if async like play).
         * @return {Howl}
         */
        _loadQueue: function(n) {
          var o = this;
          if (o._queue.length > 0) {
            var l = o._queue[0];
            l.event === n && (o._queue.shift(), o._loadQueue()), n || l.action();
          }
          return o;
        },
        /**
         * Fired when playback ends at the end of the duration.
         * @param  {Sound} sound The sound object to work with.
         * @return {Howl}
         */
        _ended: function(n) {
          var o = this, l = n._sprite;
          if (!o._webAudio && n._node && !n._node.paused && !n._node.ended && n._node.currentTime < n._stop)
            return setTimeout(o._ended.bind(o, n), 100), o;
          var h = !!(n._loop || o._sprite[l][2]);
          if (o._emit("end", n._id), !o._webAudio && h && o.stop(n._id, !0).play(n._id), o._webAudio && h) {
            o._emit("play", n._id), n._seek = n._start || 0, n._rateSeek = 0, n._playStart = t.ctx.currentTime;
            var p = (n._stop - n._start) * 1e3 / Math.abs(n._rate);
            o._endTimers[n._id] = setTimeout(o._ended.bind(o, n), p);
          }
          return o._webAudio && !h && (n._paused = !0, n._ended = !0, n._seek = n._start || 0, n._rateSeek = 0, o._clearTimer(n._id), o._cleanBuffer(n._node), t._autoSuspend()), !o._webAudio && !h && o.stop(n._id, !0), o;
        },
        /**
         * Clear the end timer for a sound playback.
         * @param  {Number} id The sound ID.
         * @return {Howl}
         */
        _clearTimer: function(n) {
          var o = this;
          if (o._endTimers[n]) {
            if (typeof o._endTimers[n] != "function")
              clearTimeout(o._endTimers[n]);
            else {
              var l = o._soundById(n);
              l && l._node && l._node.removeEventListener("ended", o._endTimers[n], !1);
            }
            delete o._endTimers[n];
          }
          return o;
        },
        /**
         * Return the sound identified by this ID, or return null.
         * @param  {Number} id Sound ID
         * @return {Object}    Sound object or null.
         */
        _soundById: function(n) {
          for (var o = this, l = 0; l < o._sounds.length; l++)
            if (n === o._sounds[l]._id)
              return o._sounds[l];
          return null;
        },
        /**
         * Return an inactive sound from the pool or create a new one.
         * @return {Sound} Sound playback object.
         */
        _inactiveSound: function() {
          var n = this;
          n._drain();
          for (var o = 0; o < n._sounds.length; o++)
            if (n._sounds[o]._ended)
              return n._sounds[o].reset();
          return new i(n);
        },
        /**
         * Drain excess inactive sounds from the pool.
         */
        _drain: function() {
          var n = this, o = n._pool, l = 0, h = 0;
          if (!(n._sounds.length < o)) {
            for (h = 0; h < n._sounds.length; h++)
              n._sounds[h]._ended && l++;
            for (h = n._sounds.length - 1; h >= 0; h--) {
              if (l <= o)
                return;
              n._sounds[h]._ended && (n._webAudio && n._sounds[h]._node && n._sounds[h]._node.disconnect(0), n._sounds.splice(h, 1), l--);
            }
          }
        },
        /**
         * Get all ID's from the sounds pool.
         * @param  {Number} id Only return one ID if one is passed.
         * @return {Array}    Array of IDs.
         */
        _getSoundIds: function(n) {
          var o = this;
          if (typeof n > "u") {
            for (var l = [], h = 0; h < o._sounds.length; h++)
              l.push(o._sounds[h]._id);
            return l;
          } else
            return [n];
        },
        /**
         * Load the sound back into the buffer source.
         * @param  {Sound} sound The sound object to work with.
         * @return {Howl}
         */
        _refreshBuffer: function(n) {
          var o = this;
          return n._node.bufferSource = t.ctx.createBufferSource(), n._node.bufferSource.buffer = a[o._src], n._panner ? n._node.bufferSource.connect(n._panner) : n._node.bufferSource.connect(n._node), n._node.bufferSource.loop = n._loop, n._loop && (n._node.bufferSource.loopStart = n._start || 0, n._node.bufferSource.loopEnd = n._stop || 0), n._node.bufferSource.playbackRate.setValueAtTime(n._rate, t.ctx.currentTime), o;
        },
        /**
         * Prevent memory leaks by cleaning up the buffer source after playback.
         * @param  {Object} node Sound's audio node containing the buffer source.
         * @return {Howl}
         */
        _cleanBuffer: function(n) {
          var o = this, l = t._navigator && t._navigator.vendor.indexOf("Apple") >= 0;
          if (!n.bufferSource)
            return o;
          if (t._scratchBuffer && n.bufferSource && (n.bufferSource.onended = null, n.bufferSource.disconnect(0), l))
            try {
              n.bufferSource.buffer = t._scratchBuffer;
            } catch {
            }
          return n.bufferSource = null, o;
        },
        /**
         * Set the source to a 0-second silence to stop any downloading (except in IE).
         * @param  {Object} node Audio node to clear.
         */
        _clearSound: function(n) {
          var o = /MSIE |Trident\//.test(t._navigator && t._navigator.userAgent);
          o || (n.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
        }
      };
      var i = function(n) {
        this._parent = n, this.init();
      };
      i.prototype = {
        /**
         * Initialize a new Sound object.
         * @return {Sound}
         */
        init: function() {
          var n = this, o = n._parent;
          return n._muted = o._muted, n._loop = o._loop, n._volume = o._volume, n._rate = o._rate, n._seek = 0, n._paused = !0, n._ended = !0, n._sprite = "__default", n._id = ++t._counter, o._sounds.push(n), n.create(), n;
        },
        /**
         * Create and setup a new sound object, whether HTML5 Audio or Web Audio.
         * @return {Sound}
         */
        create: function() {
          var n = this, o = n._parent, l = t._muted || n._muted || n._parent._muted ? 0 : n._volume;
          return o._webAudio ? (n._node = typeof t.ctx.createGain > "u" ? t.ctx.createGainNode() : t.ctx.createGain(), n._node.gain.setValueAtTime(l, t.ctx.currentTime), n._node.paused = !0, n._node.connect(t.masterGain)) : t.noAudio || (n._node = t._obtainHtml5Audio(), n._errorFn = n._errorListener.bind(n), n._node.addEventListener("error", n._errorFn, !1), n._loadFn = n._loadListener.bind(n), n._node.addEventListener(t._canPlayEvent, n._loadFn, !1), n._endFn = n._endListener.bind(n), n._node.addEventListener("ended", n._endFn, !1), n._node.src = o._src, n._node.preload = o._preload === !0 ? "auto" : o._preload, n._node.volume = l * t.volume(), n._node.load()), n;
        },
        /**
         * Reset the parameters of this sound to the original state (for recycle).
         * @return {Sound}
         */
        reset: function() {
          var n = this, o = n._parent;
          return n._muted = o._muted, n._loop = o._loop, n._volume = o._volume, n._rate = o._rate, n._seek = 0, n._rateSeek = 0, n._paused = !0, n._ended = !0, n._sprite = "__default", n._id = ++t._counter, n;
        },
        /**
         * HTML5 Audio error listener callback.
         */
        _errorListener: function() {
          var n = this;
          n._parent._emit("loaderror", n._id, n._node.error ? n._node.error.code : 0), n._node.removeEventListener("error", n._errorFn, !1);
        },
        /**
         * HTML5 Audio canplaythrough listener callback.
         */
        _loadListener: function() {
          var n = this, o = n._parent;
          o._duration = Math.ceil(n._node.duration * 10) / 10, Object.keys(o._sprite).length === 0 && (o._sprite = { __default: [0, o._duration * 1e3] }), o._state !== "loaded" && (o._state = "loaded", o._emit("load"), o._loadQueue()), n._node.removeEventListener(t._canPlayEvent, n._loadFn, !1);
        },
        /**
         * HTML5 Audio ended listener callback.
         */
        _endListener: function() {
          var n = this, o = n._parent;
          o._duration === 1 / 0 && (o._duration = Math.ceil(n._node.duration * 10) / 10, o._sprite.__default[1] === 1 / 0 && (o._sprite.__default[1] = o._duration * 1e3), o._ended(n)), n._node.removeEventListener("ended", n._endFn, !1);
        }
      };
      var a = {}, u = function(n) {
        var o = n._src;
        if (a[o]) {
          n._duration = a[o].duration, m(n);
          return;
        }
        if (/^data:[^;]+;base64,/.test(o)) {
          for (var l = atob(o.split(",")[1]), h = new Uint8Array(l.length), p = 0; p < l.length; ++p)
            h[p] = l.charCodeAt(p);
          c(h.buffer, n);
        } else {
          var g = new XMLHttpRequest();
          g.open(n._xhr.method, o, !0), g.withCredentials = n._xhr.withCredentials, g.responseType = "arraybuffer", n._xhr.headers && Object.keys(n._xhr.headers).forEach(function(f) {
            g.setRequestHeader(f, n._xhr.headers[f]);
          }), g.onload = function() {
            var f = (g.status + "")[0];
            if (f !== "0" && f !== "2" && f !== "3") {
              n._emit("loaderror", null, "Failed loading audio file with status: " + g.status + ".");
              return;
            }
            c(g.response, n);
          }, g.onerror = function() {
            n._webAudio && (n._html5 = !0, n._webAudio = !1, n._sounds = [], delete a[o], n.load());
          }, d(g);
        }
      }, d = function(n) {
        try {
          n.send();
        } catch {
          n.onerror();
        }
      }, c = function(n, o) {
        var l = function() {
          o._emit("loaderror", null, "Decoding audio data failed.");
        }, h = function(p) {
          p && o._sounds.length > 0 ? (a[o._src] = p, m(o, p)) : l();
        };
        typeof Promise < "u" && t.ctx.decodeAudioData.length === 1 ? t.ctx.decodeAudioData(n).then(h).catch(l) : t.ctx.decodeAudioData(n, h, l);
      }, m = function(n, o) {
        o && !n._duration && (n._duration = o.duration), Object.keys(n._sprite).length === 0 && (n._sprite = { __default: [0, n._duration * 1e3] }), n._state !== "loaded" && (n._state = "loaded", n._emit("load"), n._loadQueue());
      }, b = function() {
        if (t.usingWebAudio) {
          try {
            typeof AudioContext < "u" ? t.ctx = new AudioContext() : typeof webkitAudioContext < "u" ? t.ctx = new webkitAudioContext() : t.usingWebAudio = !1;
          } catch {
            t.usingWebAudio = !1;
          }
          t.ctx || (t.usingWebAudio = !1);
          var n = /iP(hone|od|ad)/.test(t._navigator && t._navigator.platform), o = t._navigator && t._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/), l = o ? parseInt(o[1], 10) : null;
          if (n && l && l < 9) {
            var h = /safari/.test(t._navigator && t._navigator.userAgent.toLowerCase());
            t._navigator && !h && (t.usingWebAudio = !1);
          }
          t.usingWebAudio && (t.masterGain = typeof t.ctx.createGain > "u" ? t.ctx.createGainNode() : t.ctx.createGain(), t.masterGain.gain.setValueAtTime(t._muted ? 0 : t._volume, t.ctx.currentTime), t.masterGain.connect(t.ctx.destination)), t._setup();
        }
      };
      s.Howler = t, s.Howl = r, typeof ce < "u" ? (ce.HowlerGlobal = e, ce.Howler = t, ce.Howl = r, ce.Sound = i) : typeof window < "u" && (window.HowlerGlobal = e, window.Howler = t, window.Howl = r, window.Sound = i);
    })();
    (function() {
      HowlerGlobal.prototype._pos = [0, 0, 0], HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0], HowlerGlobal.prototype.stereo = function(t) {
        var r = this;
        if (!r.ctx || !r.ctx.listener)
          return r;
        for (var i = r._howls.length - 1; i >= 0; i--)
          r._howls[i].stereo(t);
        return r;
      }, HowlerGlobal.prototype.pos = function(t, r, i) {
        var a = this;
        if (!a.ctx || !a.ctx.listener)
          return a;
        if (r = typeof r != "number" ? a._pos[1] : r, i = typeof i != "number" ? a._pos[2] : i, typeof t == "number")
          a._pos = [t, r, i], typeof a.ctx.listener.positionX < "u" ? (a.ctx.listener.positionX.setTargetAtTime(a._pos[0], Howler.ctx.currentTime, 0.1), a.ctx.listener.positionY.setTargetAtTime(a._pos[1], Howler.ctx.currentTime, 0.1), a.ctx.listener.positionZ.setTargetAtTime(a._pos[2], Howler.ctx.currentTime, 0.1)) : a.ctx.listener.setPosition(a._pos[0], a._pos[1], a._pos[2]);
        else
          return a._pos;
        return a;
      }, HowlerGlobal.prototype.orientation = function(t, r, i, a, u, d) {
        var c = this;
        if (!c.ctx || !c.ctx.listener)
          return c;
        var m = c._orientation;
        if (r = typeof r != "number" ? m[1] : r, i = typeof i != "number" ? m[2] : i, a = typeof a != "number" ? m[3] : a, u = typeof u != "number" ? m[4] : u, d = typeof d != "number" ? m[5] : d, typeof t == "number")
          c._orientation = [t, r, i, a, u, d], typeof c.ctx.listener.forwardX < "u" ? (c.ctx.listener.forwardX.setTargetAtTime(t, Howler.ctx.currentTime, 0.1), c.ctx.listener.forwardY.setTargetAtTime(r, Howler.ctx.currentTime, 0.1), c.ctx.listener.forwardZ.setTargetAtTime(i, Howler.ctx.currentTime, 0.1), c.ctx.listener.upX.setTargetAtTime(a, Howler.ctx.currentTime, 0.1), c.ctx.listener.upY.setTargetAtTime(u, Howler.ctx.currentTime, 0.1), c.ctx.listener.upZ.setTargetAtTime(d, Howler.ctx.currentTime, 0.1)) : c.ctx.listener.setOrientation(t, r, i, a, u, d);
        else
          return m;
        return c;
      }, Howl.prototype.init = /* @__PURE__ */ (function(t) {
        return function(r) {
          var i = this;
          return i._orientation = r.orientation || [1, 0, 0], i._stereo = r.stereo || null, i._pos = r.pos || null, i._pannerAttr = {
            coneInnerAngle: typeof r.coneInnerAngle < "u" ? r.coneInnerAngle : 360,
            coneOuterAngle: typeof r.coneOuterAngle < "u" ? r.coneOuterAngle : 360,
            coneOuterGain: typeof r.coneOuterGain < "u" ? r.coneOuterGain : 0,
            distanceModel: typeof r.distanceModel < "u" ? r.distanceModel : "inverse",
            maxDistance: typeof r.maxDistance < "u" ? r.maxDistance : 1e4,
            panningModel: typeof r.panningModel < "u" ? r.panningModel : "HRTF",
            refDistance: typeof r.refDistance < "u" ? r.refDistance : 1,
            rolloffFactor: typeof r.rolloffFactor < "u" ? r.rolloffFactor : 1
          }, i._onstereo = r.onstereo ? [{ fn: r.onstereo }] : [], i._onpos = r.onpos ? [{ fn: r.onpos }] : [], i._onorientation = r.onorientation ? [{ fn: r.onorientation }] : [], t.call(this, r);
        };
      })(Howl.prototype.init), Howl.prototype.stereo = function(t, r) {
        var i = this;
        if (!i._webAudio)
          return i;
        if (i._state !== "loaded")
          return i._queue.push({
            event: "stereo",
            action: function() {
              i.stereo(t, r);
            }
          }), i;
        var a = typeof Howler.ctx.createStereoPanner > "u" ? "spatial" : "stereo";
        if (typeof r > "u")
          if (typeof t == "number")
            i._stereo = t, i._pos = [t, 0, 0];
          else
            return i._stereo;
        for (var u = i._getSoundIds(r), d = 0; d < u.length; d++) {
          var c = i._soundById(u[d]);
          if (c)
            if (typeof t == "number")
              c._stereo = t, c._pos = [t, 0, 0], c._node && (c._pannerAttr.panningModel = "equalpower", (!c._panner || !c._panner.pan) && e(c, a), a === "spatial" ? typeof c._panner.positionX < "u" ? (c._panner.positionX.setValueAtTime(t, Howler.ctx.currentTime), c._panner.positionY.setValueAtTime(0, Howler.ctx.currentTime), c._panner.positionZ.setValueAtTime(0, Howler.ctx.currentTime)) : c._panner.setPosition(t, 0, 0) : c._panner.pan.setValueAtTime(t, Howler.ctx.currentTime)), i._emit("stereo", c._id);
            else
              return c._stereo;
        }
        return i;
      }, Howl.prototype.pos = function(t, r, i, a) {
        var u = this;
        if (!u._webAudio)
          return u;
        if (u._state !== "loaded")
          return u._queue.push({
            event: "pos",
            action: function() {
              u.pos(t, r, i, a);
            }
          }), u;
        if (r = typeof r != "number" ? 0 : r, i = typeof i != "number" ? -0.5 : i, typeof a > "u")
          if (typeof t == "number")
            u._pos = [t, r, i];
          else
            return u._pos;
        for (var d = u._getSoundIds(a), c = 0; c < d.length; c++) {
          var m = u._soundById(d[c]);
          if (m)
            if (typeof t == "number")
              m._pos = [t, r, i], m._node && ((!m._panner || m._panner.pan) && e(m, "spatial"), typeof m._panner.positionX < "u" ? (m._panner.positionX.setValueAtTime(t, Howler.ctx.currentTime), m._panner.positionY.setValueAtTime(r, Howler.ctx.currentTime), m._panner.positionZ.setValueAtTime(i, Howler.ctx.currentTime)) : m._panner.setPosition(t, r, i)), u._emit("pos", m._id);
            else
              return m._pos;
        }
        return u;
      }, Howl.prototype.orientation = function(t, r, i, a) {
        var u = this;
        if (!u._webAudio)
          return u;
        if (u._state !== "loaded")
          return u._queue.push({
            event: "orientation",
            action: function() {
              u.orientation(t, r, i, a);
            }
          }), u;
        if (r = typeof r != "number" ? u._orientation[1] : r, i = typeof i != "number" ? u._orientation[2] : i, typeof a > "u")
          if (typeof t == "number")
            u._orientation = [t, r, i];
          else
            return u._orientation;
        for (var d = u._getSoundIds(a), c = 0; c < d.length; c++) {
          var m = u._soundById(d[c]);
          if (m)
            if (typeof t == "number")
              m._orientation = [t, r, i], m._node && (m._panner || (m._pos || (m._pos = u._pos || [0, 0, -0.5]), e(m, "spatial")), typeof m._panner.orientationX < "u" ? (m._panner.orientationX.setValueAtTime(t, Howler.ctx.currentTime), m._panner.orientationY.setValueAtTime(r, Howler.ctx.currentTime), m._panner.orientationZ.setValueAtTime(i, Howler.ctx.currentTime)) : m._panner.setOrientation(t, r, i)), u._emit("orientation", m._id);
            else
              return m._orientation;
        }
        return u;
      }, Howl.prototype.pannerAttr = function() {
        var t = this, r = arguments, i, a, u;
        if (!t._webAudio)
          return t;
        if (r.length === 0)
          return t._pannerAttr;
        if (r.length === 1)
          if (typeof r[0] == "object")
            i = r[0], typeof a > "u" && (i.pannerAttr || (i.pannerAttr = {
              coneInnerAngle: i.coneInnerAngle,
              coneOuterAngle: i.coneOuterAngle,
              coneOuterGain: i.coneOuterGain,
              distanceModel: i.distanceModel,
              maxDistance: i.maxDistance,
              refDistance: i.refDistance,
              rolloffFactor: i.rolloffFactor,
              panningModel: i.panningModel
            }), t._pannerAttr = {
              coneInnerAngle: typeof i.pannerAttr.coneInnerAngle < "u" ? i.pannerAttr.coneInnerAngle : t._coneInnerAngle,
              coneOuterAngle: typeof i.pannerAttr.coneOuterAngle < "u" ? i.pannerAttr.coneOuterAngle : t._coneOuterAngle,
              coneOuterGain: typeof i.pannerAttr.coneOuterGain < "u" ? i.pannerAttr.coneOuterGain : t._coneOuterGain,
              distanceModel: typeof i.pannerAttr.distanceModel < "u" ? i.pannerAttr.distanceModel : t._distanceModel,
              maxDistance: typeof i.pannerAttr.maxDistance < "u" ? i.pannerAttr.maxDistance : t._maxDistance,
              refDistance: typeof i.pannerAttr.refDistance < "u" ? i.pannerAttr.refDistance : t._refDistance,
              rolloffFactor: typeof i.pannerAttr.rolloffFactor < "u" ? i.pannerAttr.rolloffFactor : t._rolloffFactor,
              panningModel: typeof i.pannerAttr.panningModel < "u" ? i.pannerAttr.panningModel : t._panningModel
            });
          else
            return u = t._soundById(parseInt(r[0], 10)), u ? u._pannerAttr : t._pannerAttr;
        else r.length === 2 && (i = r[0], a = parseInt(r[1], 10));
        for (var d = t._getSoundIds(a), c = 0; c < d.length; c++)
          if (u = t._soundById(d[c]), u) {
            var m = u._pannerAttr;
            m = {
              coneInnerAngle: typeof i.coneInnerAngle < "u" ? i.coneInnerAngle : m.coneInnerAngle,
              coneOuterAngle: typeof i.coneOuterAngle < "u" ? i.coneOuterAngle : m.coneOuterAngle,
              coneOuterGain: typeof i.coneOuterGain < "u" ? i.coneOuterGain : m.coneOuterGain,
              distanceModel: typeof i.distanceModel < "u" ? i.distanceModel : m.distanceModel,
              maxDistance: typeof i.maxDistance < "u" ? i.maxDistance : m.maxDistance,
              refDistance: typeof i.refDistance < "u" ? i.refDistance : m.refDistance,
              rolloffFactor: typeof i.rolloffFactor < "u" ? i.rolloffFactor : m.rolloffFactor,
              panningModel: typeof i.panningModel < "u" ? i.panningModel : m.panningModel
            };
            var b = u._panner;
            b || (u._pos || (u._pos = t._pos || [0, 0, -0.5]), e(u, "spatial"), b = u._panner), b.coneInnerAngle = m.coneInnerAngle, b.coneOuterAngle = m.coneOuterAngle, b.coneOuterGain = m.coneOuterGain, b.distanceModel = m.distanceModel, b.maxDistance = m.maxDistance, b.refDistance = m.refDistance, b.rolloffFactor = m.rolloffFactor, b.panningModel = m.panningModel;
          }
        return t;
      }, Sound.prototype.init = /* @__PURE__ */ (function(t) {
        return function() {
          var r = this, i = r._parent;
          r._orientation = i._orientation, r._stereo = i._stereo, r._pos = i._pos, r._pannerAttr = i._pannerAttr, t.call(this), r._stereo ? i.stereo(r._stereo) : r._pos && i.pos(r._pos[0], r._pos[1], r._pos[2], r._id);
        };
      })(Sound.prototype.init), Sound.prototype.reset = /* @__PURE__ */ (function(t) {
        return function() {
          var r = this, i = r._parent;
          return r._orientation = i._orientation, r._stereo = i._stereo, r._pos = i._pos, r._pannerAttr = i._pannerAttr, r._stereo ? i.stereo(r._stereo) : r._pos ? i.pos(r._pos[0], r._pos[1], r._pos[2], r._id) : r._panner && (r._panner.disconnect(0), r._panner = void 0, i._refreshBuffer(r)), t.call(this);
        };
      })(Sound.prototype.reset);
      var e = function(t, r) {
        r = r || "spatial", r === "spatial" ? (t._panner = Howler.ctx.createPanner(), t._panner.coneInnerAngle = t._pannerAttr.coneInnerAngle, t._panner.coneOuterAngle = t._pannerAttr.coneOuterAngle, t._panner.coneOuterGain = t._pannerAttr.coneOuterGain, t._panner.distanceModel = t._pannerAttr.distanceModel, t._panner.maxDistance = t._pannerAttr.maxDistance, t._panner.refDistance = t._pannerAttr.refDistance, t._panner.rolloffFactor = t._pannerAttr.rolloffFactor, t._panner.panningModel = t._pannerAttr.panningModel, typeof t._panner.positionX < "u" ? (t._panner.positionX.setValueAtTime(t._pos[0], Howler.ctx.currentTime), t._panner.positionY.setValueAtTime(t._pos[1], Howler.ctx.currentTime), t._panner.positionZ.setValueAtTime(t._pos[2], Howler.ctx.currentTime)) : t._panner.setPosition(t._pos[0], t._pos[1], t._pos[2]), typeof t._panner.orientationX < "u" ? (t._panner.orientationX.setValueAtTime(t._orientation[0], Howler.ctx.currentTime), t._panner.orientationY.setValueAtTime(t._orientation[1], Howler.ctx.currentTime), t._panner.orientationZ.setValueAtTime(t._orientation[2], Howler.ctx.currentTime)) : t._panner.setOrientation(t._orientation[0], t._orientation[1], t._orientation[2])) : (t._panner = Howler.ctx.createStereoPanner(), t._panner.pan.setValueAtTime(t._stereo, Howler.ctx.currentTime)), t._panner.connect(t._node), t._paused || t._parent.pause(t._id, !0).play(t._id, !0);
      };
    })();
  })(Ce)), Ce;
}
var se = Nt();
const at = [
  "ambience",
  "click",
  "latch",
  "brass",
  "teal-lift",
  "turbine",
  "tick",
  "chord-2",
  "chord-3",
  "chord-full",
  "fanfare",
  "collect",
  "spin",
  "stop",
  "land",
  "riser",
  "coin"
], Bt = new Set(at.filter((s) => s !== "ambience"));
function Ft(s, e, t) {
  return e === s && t < 1;
}
function Ot(s, e, t) {
  return t || !e ? 0 : s ? 0.16 : 0.38;
}
class Ht {
  howls = /* @__PURE__ */ new Map();
  retries = /* @__PURE__ */ new Map();
  lastRequested = null;
  unlocked = !1;
  muted = !1;
  music = !0;
  effects = !0;
  presenting = !1;
  hidden = !1;
  generation = 0;
  timers = [];
  reelOn = !1;
  busReady = !1;
  ambGain = 0;
  degraded = !1;
  onDegraded;
  constructor(e = () => {
  }) {
    this.onDegraded = e, se.Howler.autoSuspend = !0;
  }
  load() {
    for (const e of at) {
      const t = new se.Howl({
        src: [`assets/audio/${e}.ogg`, `assets/audio/${e}.mp3`],
        preload: !0,
        loop: e === "ambience",
        volume: e === "ambience" ? 0.38 : 0.8,
        html5: !1,
        onloaderror: () => {
          this.degraded = !0, this.onDegraded("Sound could not be loaded. Play continues without sound.");
        },
        onplayerror: () => {
          const r = this.retries.get(e) ?? 0;
          Ft(e, this.lastRequested, r) && (this.retries.set(e, r + 1), t.once("unlock", () => {
            this.lastRequested === e && this.effects && !this.muted && t.play();
          }));
        }
      });
      this.howls.set(e, t);
    }
  }
  unlock() {
    this.unlocked = !0;
    const e = se.Howler.ctx;
    e && e.state !== "running" && e.resume(), this.installBus(), this.syncAmbience();
  }
  /** Master compressor in front of the speakers, the same bus shape as a two-bus cabinet mix. */
  installBus() {
    if (this.busReady) return;
    const e = se.Howler.ctx, t = se.Howler.masterGain;
    if (!e || !t) return;
    const r = e.createDynamicsCompressor();
    r.threshold.value = -8, r.knee.value = 6, r.ratio.value = 8, r.attack.value = 4e-3, r.release.value = 0.18;
    try {
      t.disconnect();
    } catch {
    }
    t.connect(r), r.connect(e.destination), this.busReady = !0;
  }
  setPrefs(e, t, r) {
    this.muted = e, this.music = t, this.effects = r, se.Howler.mute(e), this.syncAmbience();
  }
  setPresenting(e) {
    this.presenting = e, this.syncAmbience();
  }
  setHidden(e) {
    if (this.hidden = e, e) {
      for (const t of this.howls.values()) t.pause();
      return;
    }
    this.syncAmbience();
  }
  play(e, t = 1) {
    if (!this.unlocked || this.muted || this.hidden || !this.effects || !Bt.has(e)) return;
    const r = this.generation, i = this.howls.get(e);
    if (!i) return;
    this.lastRequested = e, this.installBus();
    const a = i.play();
    t !== 1 && i.rate(t, a), r !== this.generation && i.stop(a);
  }
  /** Mechanical reel bed. It follows the visible spin and stops when the reels do. */
  setReelLoop(e) {
    const t = this.howls.get("spin");
    if (!t) return;
    if (!(e && this.unlocked && !this.muted && !this.hidden && this.effects)) {
      if (!this.reelOn) return;
      this.reelOn = !1, t.loop(!1), t.stop();
      return;
    }
    this.reelOn || (this.reelOn = !0, t.loop(!0), t.play());
  }
  cancelPending() {
    this.generation += 1, this.lastRequested = null;
  }
  fadePresentation(e) {
    this.cancelPending();
    for (const [t, r] of this.howls)
      t !== "ambience" && (r.fade(r.volume(), 0, e), this.timers.push(window.setTimeout(() => r.stop(), e)));
  }
  syncAmbience() {
    const e = this.howls.get("ambience");
    if (!e || !this.unlocked) return;
    const t = Ot(this.presenting, this.music, this.muted);
    if (this.hidden || t === 0) {
      this.ambGain = 0, e.pause();
      return;
    }
    const r = this.ambGain;
    this.ambGain = t, e.playing() && r !== t ? e.fade(r, t, 180) : e.volume(t), e.playing() || e.play();
  }
  destroy() {
    for (const e of this.timers) window.clearTimeout(e);
    this.timers = [], this.cancelPending();
    for (const e of this.howls.values()) e.unload();
    this.howls.clear();
  }
}
const Ke = "auric-dynamo.board.v1", Rt = [
  { id: "first-win", label: "First net gain" },
  { id: "feature", label: "Feature landed" },
  { id: "wheel", label: "Wheel opened" },
  { id: "flourish", label: "Energy flourish" },
  { id: "big", label: "Big net" },
  { id: "mega", label: "Mega net" },
  { id: "epic", label: "Epic net" },
  { id: "session", label: "Session ahead" }
], Je = ["Spark", "Ember", "Brass", "Glow", "Dynamo", "Charge", "Crown", "Auric"];
function he() {
  return { handle: "Player", rows: [], seen: [], achievements: [] };
}
function lt(s) {
  const e = s.replace(/[^A-Za-z0-9 ]/g, "").trim().slice(0, 16);
  return e.length > 0 ? e : "Player";
}
function Dt(s) {
  return new Date(s).toISOString().slice(0, 10);
}
function $t(s) {
  const e = Math.min(Je.length, 1 + Math.floor(Math.max(0, s) / 5));
  return { level: e, name: Je[e - 1] ?? "Spark" };
}
function Wt(s) {
  if (!s) return he();
  try {
    const e = JSON.parse(s);
    return !e || !Array.isArray(e.rows) || !Array.isArray(e.seen) ? he() : {
      handle: lt(typeof e.handle == "string" ? e.handle : "Player"),
      rows: e.rows.filter((t) => t && typeof t.handle == "string"),
      seen: e.seen.filter((t) => typeof t == "string").slice(-80),
      achievements: Array.isArray(e.achievements) ? e.achievements.filter((t) => typeof t == "string") : []
    };
  } catch {
    return he();
  }
}
function Gt(s) {
  return JSON.stringify(s);
}
function qt(s, e) {
  const t = s.cost > 0 ? s.net / s.cost : 0, r = [];
  return e.wins >= 1 && r.push("first-win"), (s.modifier === "replace" || s.modifier === "bank" || s.modifier === "wheel") && r.push("feature"), s.modifier === "wheel" && r.push("wheel"), s.flourish && r.push("flourish"), t >= 5 && r.push("big"), t >= 25 && r.push("mega"), t >= 100 && r.push("epic"), e.highestSession > 0 && r.push("session"), r;
}
function Vt(s, e) {
  if (s.seen.includes(e.id)) return s;
  const t = Dt(e.at), r = s.rows.map((u) => ({ ...u }));
  let i = r.find((u) => u.handle === s.handle);
  i || (i = {
    handle: s.handle,
    biggestWin: 0,
    highestSession: e.sessionNet,
    wins: 0,
    day: t,
    dayBest: e.net,
    dayPlays: 0
  }, r.push(i)), i.day !== t && (i.day = t, i.dayBest = e.net, i.dayPlays = 0), i.dayPlays += 1, e.net > i.dayBest && (i.dayBest = e.net), e.net > i.biggestWin && (i.biggestWin = e.net), e.sessionNet > i.highestSession && (i.highestSession = e.sessionNet), e.net > 0 && (i.wins += 1);
  const a = [...s.achievements];
  for (const u of qt(e, i))
    a.includes(u) || a.push(u);
  return {
    handle: s.handle,
    rows: r,
    seen: [...s.seen, e.id].slice(-80),
    achievements: a
  };
}
function Xt(s) {
  return s.rows.find((e) => e.handle === s.handle) ?? null;
}
function Qt(s, e) {
  return [...s].sort((t, r) => r[e] - t[e] || t.handle.localeCompare(r.handle));
}
class j extends Error {
  constructor(e) {
    super(e), this.name = "EconomyError";
  }
}
const Yt = 1, jt = 1e5, Ut = [10, 20, 50, 100], Zt = 10, oe = 1e4, qe = {
  blank: 0,
  0: 0,
  1: 1,
  5: 3,
  10: 12,
  "00": 40
}, Ve = [
  { token: "blank", from: 0, to: 2200, weight: 2200 },
  { token: "0", from: 2200, to: 7269, weight: 5069 },
  { token: "1", from: 7269, to: 8e3, weight: 731 },
  { token: "5", from: 8e3, to: 9200, weight: 1200 },
  { token: "10", from: 9200, to: 9700, weight: 500 },
  { token: "00", from: 9700, to: 1e4, weight: 300 }
], Xe = [
  { id: "x1", from: 0, to: 6200, weight: 6200, multiplier: 1 },
  { id: "x2", from: 6200, to: 8e3, weight: 1800, multiplier: 2 },
  { id: "x5", from: 8e3, to: 8700, weight: 700, multiplier: 5 },
  { id: "x10", from: 8700, to: 9100, weight: 400, multiplier: 10 },
  { id: "replace", from: 9100, to: 9500, weight: 400, multiplier: null },
  { id: "bank", from: 9500, to: 9920, weight: 420, multiplier: null },
  { id: "wheel", from: 9920, to: 1e4, weight: 80, multiplier: null }
], Me = [1, 2, 4, 6, 10, 16, 40, 110];
function G(s, e) {
  if (!Number.isSafeInteger(s)) throw new j(`unsafe ${e}`);
  return s;
}
function $e(s, e, t) {
  return G(s, t), G(e, t), G(s * e, t);
}
function re(s, e, t) {
  return G(s, t), G(e, t), G(s + e, t);
}
function Qe(s) {
  return Ut.includes(s);
}
function Ne(s) {
  if (!Number.isInteger(s) || s < 0 || s >= oe) throw new j("token draw");
  const e = Ve.find((t) => s >= t.from && s < t.to);
  if (!e) throw new j("token draw");
  return e.token;
}
function Kt(s) {
  if (!Number.isInteger(s) || s < 0 || s >= oe) throw new j("modifier draw");
  const e = Xe.find((t) => s >= t.from && s < t.to);
  if (!e) throw new j("modifier draw");
  return e.id;
}
function B(s) {
  return Ve.find((e) => e.token === s).from;
}
function ie(s) {
  return Xe.find((e) => e.id === s).from;
}
function dt(s) {
  if (s.some((t) => t === "blank")) return 0;
  const e = s.reduce((t, r) => t + qe[r], 0);
  return G(e, "raw number");
}
function Jt(s) {
  return s === "blank" ? "blank" : s;
}
function ct(s) {
  return s === "x1" ? "1x" : s === "x2" ? "2x" : s === "x5" ? "5x" : s === "x10" ? "10x" : s === "replace" ? "Replace" : s === "bank" ? "Bank + Add" : "Wheel";
}
function we(s, e) {
  const t = [
    Ne(s.nextInt(oe)),
    Ne(s.nextInt(oe)),
    Ne(s.nextInt(oe))
  ], r = dt(t), i = $e(r, e, "base");
  return { tokens: t, raw: r, base: i };
}
function ut(s, e, t) {
  if (!Qe(e)) throw new j("cost");
  if (!Number.isSafeInteger(t) || t < 0 || t > 9) throw new j("meter");
  const r = e / 10, i = we(s, r), a = Kt(s.nextInt(oe)), u = [];
  let d = null, c = null, m = 0, b = null, n = 0, o = [], l = 0;
  if (a === "x1" || a === "x2" || a === "x5" || a === "x10")
    d = a === "x1" ? 1 : a === "x2" ? 2 : a === "x5" ? 5 : 10, n = $e(d - 1, i.base, "modifier addition"), l = re(i.base, n, "gross"), o = [i.base, n];
  else if (a === "replace") {
    const w = we(s, r);
    u.push(w), b = i.base, l = w.base, o = [w.base];
  } else if (a === "bank") {
    const w = we(s, r), v = we(s, r);
    u.push(w, v), l = re(re(i.base, w.base, "bank"), v.base, "gross"), o = [i.base, w.base, v.base];
  } else
    c = s.nextInt(Me.length), m = $e(e, Me[c], "wheel"), l = re(i.base, m, "gross"), o = [i.base, m];
  if (o.reduce((w, v) => re(w, v, "contributors"), 0) !== l) throw new j("contributor sum");
  const p = re(l, -e, "net"), g = t + 1 >= Zt, f = g ? 0 : t + 1;
  return {
    cost: e,
    unit: r,
    initial: i,
    modifier: a,
    multiplier: d,
    steps: u,
    wheelIndex: c,
    wheelPrize: m,
    discarded: b,
    modifierAdd: n,
    contributors: o,
    gross: l,
    net: p,
    collectionBefore: t,
    collectionAfter: f,
    collectionFlourish: g
  };
}
function X(s, e) {
  if (G(s, "net"), G(e, "cost"), e <= 0) throw new j("cost");
  return s <= 0 ? 0 : s < 5 * e ? 1 : s < 25 * e ? 2 : s < 100 * e ? 3 : 4;
}
function zt(s, e, t) {
  if (s <= 0 || t === null || t <= 0) return 0;
  const r = X(t, e), i = X(s, e);
  return r < i ? r : i;
}
function P(s) {
  const e = s < 0 ? "-" : "", t = Math.abs(s).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return e + t;
}
function en(s) {
  return s.net > 0 ? "Net gain" : s.gross === 0 ? "No return" : s.net === 0 ? "No net change" : `Returned ${P(s.gross)}`;
}
function tn(s) {
  return s.gross === 0 ? `No return. Net change -${P(s.cost)}.` : s.net === 0 ? "No net change." : s.net < 0 ? `Returned ${P(s.gross)}. Net change -${P(-s.net)}.` : `Returned ${P(s.gross)}. Net change +${P(s.net)}.`;
}
function W(s) {
  return String(dt(s));
}
function nn() {
  const s = Ve.map((r) => `${Jt(r.token)}: ${r.weight} out of 10000, worth ${qe[r.token]}`).join(`
`), e = Xe.map((r) => `${ct(r.id)}: ${r.weight} out of 10000`).join(`
`), t = Me.map((r, i) => `Wedge ${i + 1}: cost x ${r} (1 out of 8)`).join(`
`);
  return [
    {
      heading: "How a result is decided",
      body: "The server draws every result and pays the gross return. These probabilities do not reproduce another game's odds. The published return is 96.50 percent of the stake, measured from these weights. The largest return is 122 times the stake."
    },
    {
      heading: "Play cost",
      body: "Opened from the lobby, a play spends the balance on the site, in Gold Coins or Sweeps Coins. Costs are 10, 20, 50, and 100 cents. The default is 10. The cost locks for the whole result. Unit scale u equals cost divided by 10."
    },
    {
      heading: "Number tokens",
      body: `Each of three number reels draws one token. The glyphs stay on the reels. The number they build is the sum of their point values.
${s}
Any blank makes the whole number zero. Otherwise the three values are added. Examples: 1, 00 and 5 add to 44. 0, 10 and 1 add to 13. 00, 00 and 00 add to 120. Three zeros add to 0. Base credits B equal that sum times u.`
    },
    {
      heading: "Modifier",
      body: `The modifier reel is a separate draw.
${e}
1x pays B. 2x pays 2B, shown as B plus one extra B. 5x pays 5B. 10x pays 10B. Replace discards B and pays exactly one new number result. Bank + Add locks B, draws exactly two new number results, and pays the three base amounts added. Wheel pays B plus one wheel prize. Feature steps never draw a modifier and never start another feature. A zero still uses the step.`
    },
    {
      heading: "Wheel",
      body: `Only the Wheel modifier opens the wheel, even when B is zero. There is no scatter symbol.
${t}
The wedge is chosen before the wheel moves. The pointer lands on that wedge. Changing the cost while idle updates the preview labels.`
    },
    {
      heading: "Collection",
      body: "10 plays: energy flourish, no credit reward. One charge is added for each settled paid play, including a zero. Feature steps do not charge the meter. At 10 of 10 the meter plays a cosmetic flourish and returns to 0. Collection adds zero credits."
    },
    {
      heading: "Accounting",
      body: "One debit at the start and one credit of the full payout at settlement. Cost, base, modifier or feature parts, gross payout, and signed net change are shown separately. Net change equals gross payout minus cost. A gain is celebrated only when the gross payout is greater than the cost. An equal payout says No net change. A smaller return names the return and the negative net change. A zero says No return."
    },
    {
      heading: "Presentation",
      body: "Reels stop left to right, then the base number is assembled, then the modifier is revealed, then any feature, then one count-up, then the final gross and net. Those stages explain one result. They do not grant extra credits. Reveal result shows that result immediately and does not start another play. Count-up length follows the net gain compared with the cost: under 5 costs, from 5 up to but not including 25, from 25 up to but not including 100, and 100 or more. Those bands are presentation choices, not odds. A full presentation is bounded to 9 seconds."
    },
    {
      heading: "Autoplay",
      body: "Autoplay counts are 10, 25, or 50. Hold Spin for 600 milliseconds, then release inside the button, or press Start autoplay. A short press plays once. Leaving the button, canceling the pointer, Escape, or blur cancels a hold and does not spend credits. Autoplay waits until the current result is finished and also waits at least 3 seconds from the start of one play to the start of the next. Turbo and Reveal result do not shorten that wait. Autoplay stops after Replace, Bank + Add, the wheel, a full collection flourish, blur, Help, too few credits, an error, Stop, or the chosen count. It does not restart itself and it does not reset your credits."
    },
    {
      heading: "After a reload",
      body: "The last result is saved in this browser so a reload can show it again. A reload does not draw again and does not spend again. The balance on screen is the server balance. Standings on this device are a record of results, not a balance you can spend."
    }
  ];
}
const me = Math.PI * 2, Se = 8, fe = me / Se;
function Te(s) {
  return -((s + 0.5) * fe);
}
function ht(s) {
  let e = -s % me;
  return e < 0 && (e += me), (Math.floor((e + 1e-9) / fe) % Se + Se) % Se;
}
function sn(s) {
  return 1 - (1 - Math.min(1, Math.max(0, s))) ** 3;
}
function rn(s, e, t = it) {
  const r = Te(s), i = r - t * me;
  return i + (r - i) * sn(e);
}
function on(s, e = it) {
  const t = Te(s), r = t - e * me, i = t - r, a = Math.floor(-r / fe - 1e-9), u = Math.ceil(-t / fe + 1e-9), d = [];
  for (let c = a; c >= u; c--) {
    const m = -c * fe;
    if (m <= r + 1e-8 || m > t + 1e-8) continue;
    const b = (m - r) / i;
    if (b <= 0 || b > 1) continue;
    const n = 1 - Math.cbrt(1 - b);
    n > 0 && n <= 1 && d.push(n);
  }
  return d.sort((c, m) => c - m), d;
}
function ye() {
  return {
    reading: null,
    discarded: null,
    base: null,
    modifierAdd: null,
    bankLocked: null,
    bankAdds: [],
    wheel: null,
    gross: null,
    net: null,
    guaranteedNet: null
  };
}
function ft(s) {
  return s === 1 ? "chord-2" : s === 2 ? "chord-3" : s === 3 ? "chord-full" : s === 4 ? "fanfare" : null;
}
function an(s, e, t) {
  if (t <= 0) return s;
  if (t >= 1) return e;
  const r = e - s;
  let i;
  if (t <= 0.6) i = t / 0.6 * 0.85;
  else {
    const u = (t - 0.6) / 0.4;
    i = 0.85 + u * u * (3 - 2 * u) * 0.15;
  }
  const a = Math.floor(s + r * i);
  return Math.min(e, Math.max(s, a));
}
function ln(s) {
  return { ...s, bankAdds: [...s.bankAdds] };
}
function Z(s) {
  const e = s.net, t = s.gross;
  return s.modifier === "replace" ? {
    reading: W(s.steps[0].tokens),
    discarded: s.discarded,
    base: s.steps[0].base,
    modifierAdd: null,
    bankLocked: null,
    bankAdds: [],
    wheel: null,
    gross: t,
    net: e,
    guaranteedNet: e
  } : s.modifier === "bank" ? {
    reading: W(s.initial.tokens),
    discarded: null,
    base: null,
    modifierAdd: null,
    bankLocked: s.initial.base,
    bankAdds: s.steps.map((r) => r.base),
    wheel: null,
    gross: t,
    net: e,
    guaranteedNet: e
  } : s.modifier === "wheel" ? {
    reading: W(s.initial.tokens),
    discarded: null,
    base: s.initial.base,
    modifierAdd: null,
    bankLocked: null,
    bankAdds: [],
    wheel: s.wheelPrize,
    gross: t,
    net: e,
    guaranteedNet: e
  } : {
    reading: W(s.initial.tokens),
    discarded: null,
    base: s.initial.base,
    modifierAdd: s.modifierAdd,
    bankLocked: null,
    bankAdds: [],
    wheel: null,
    gross: t,
    net: e,
    guaranteedNet: e
  };
}
function dn(s, e, t) {
  for (let r = e + 1; r < s.length; r++) s[r].startMs += t;
}
function cn(s, e) {
  let t = s.length ? s[s.length - 1].startMs + s[s.length - 1].durationMs : 0;
  if (t <= e) return !1;
  for (const r of ["inhale", "countup", "collection", "resolve"]) {
    const i = s.findIndex((d) => d.kind === r);
    if (i < 0) continue;
    const a = t - e;
    if (a <= 0) return !1;
    const u = Math.min(s[i].durationMs, a);
    s[i].durationMs -= u, dn(s, i, -u), t -= u;
  }
  return t > e;
}
function We(s, e, t, r = Ie) {
  if (e === "reduced") {
    const v = Z(s), A = s.net > 0 ? X(s.net, s.cost) : 0, M = ft(A);
    return {
      receiptId: t,
      mode: e,
      capped: !1,
      totalMs: r.reduced,
      stages: [
        {
          kind: "reduced-final",
          receiptId: t,
          startMs: 0,
          durationMs: r.reduced,
          cueTier: A,
          parts: v
        }
      ],
      cues: [{ at: 0, sound: M ?? "latch", presentation: !0 }]
    };
  }
  const i = e === "super" ? r.superScale : e === "turbo" ? r.turboScale : 1, a = (v) => Math.max(0, Math.round(v * i)), u = [];
  let d = 0;
  const c = (v, A, M, E) => {
    const F = zt(s.net, s.cost, M.guaranteedNet);
    u.push({
      kind: v,
      receiptId: t,
      startMs: d,
      durationMs: A,
      cueTier: F,
      parts: ln(M),
      ...E
    }), d += A;
  }, m = [
    a(r.reelStops[0]),
    a(r.reelStops[1]),
    a(r.reelStops[2])
  ];
  let b = ye();
  const n = s.net > 0 && (X(s.net, s.cost) >= 2 || s.modifier === "wheel" || s.modifier === "replace" || s.modifier === "bank");
  if (c("reels", m[2] + a(n ? 900 : 150), b, { reelStops: m }), b = { ...b, reading: W(s.initial.tokens) }, c("assemble", a(r.assemble), b), c("inhale", a(r.inhale), b), s.multiplier !== null)
    b = Z(s);
  else if (s.modifier === "replace")
    b = {
      ...ye(),
      reading: W(s.initial.tokens),
      discarded: s.discarded,
      guaranteedNet: null
    };
  else if (s.modifier === "bank") {
    const v = s.initial.base > s.cost ? s.initial.base - s.cost : null;
    b = {
      ...ye(),
      reading: W(s.initial.tokens),
      bankLocked: s.initial.base,
      guaranteedNet: v
    };
  } else {
    const v = s.initial.base > 0 ? s.initial.base : null;
    b = {
      ...ye(),
      reading: W(s.initial.tokens),
      base: s.initial.base,
      guaranteedNet: v
    };
  }
  c("modifier", a(r.modifier), b), s.modifier === "replace" && c("replace", a(r.feature.replace), Z(s)), s.modifier === "bank" && c("bank", a(r.feature.bank), Z(s)), s.modifier === "wheel" && c("wheel", a(r.feature.wheel), Z(s));
  const o = X(s.net, s.cost), l = o === 3 && s.net >= 50 * s.cost ? 5600 : r.count[o], h = a(l);
  h > 0 && c("countup", h, Z(s)), c("resolve", a(r.resolve), Z(s)), c("collection", a(r.collection), Z(s));
  const p = cn(u, r.cap), g = u.length ? u[u.length - 1].startMs + u[u.length - 1].durationMs : 0, f = p ? r.cap : g, w = un(s, u);
  return { receiptId: t, mode: e, stages: u, cues: w, totalMs: f, capped: p };
}
function un(s, e, t) {
  const r = [], i = e.find((h) => h.kind === "reels");
  if (i?.reelStops) {
    r.push({ at: i.startMs, sound: "spin", presentation: !0 });
    const h = s.net > 0 && (s.modifier === "replace" || s.modifier === "bank" || s.modifier === "wheel" || X(s.net, s.cost) >= 2), p = i.reelStops[i.reelStops.length - 1];
    i.reelStops.forEach((g, f) => {
      r.push({ at: g, sound: "click", presentation: !0 }), r.push({ at: g, sound: "stop", presentation: !0 }), r.push({ at: g + 36, sound: "land", presentation: !0, rate: 1 + f * 0.18 });
    }), h && p !== void 0 && r.push({ at: Math.max(i.startMs, p - 220), sound: "riser", presentation: !0 });
  }
  const a = (h) => e.find((p) => p.kind === h), u = a("assemble");
  u && r.push({ at: u.startMs, sound: "latch", presentation: !0 });
  const d = a("modifier");
  d && (r.push({ at: d.startMs, sound: "brass", presentation: !0 }), d.cueTier > 0 && r.push({ at: d.startMs, sound: "teal-lift", presentation: !0 }));
  const c = a("replace");
  c && r.push({ at: c.startMs, sound: "latch", presentation: !0 });
  const m = a("bank");
  m && (r.push({ at: m.startMs, sound: "latch", presentation: !0 }), r.push({ at: m.startMs + Math.round(m.durationMs * 0.5), sound: "latch", presentation: !0 }), r.push({ at: m.startMs + Math.round(m.durationMs * (5 / 6)), sound: "latch", presentation: !0 }));
  const b = a("wheel");
  if (b && s.wheelIndex !== null) {
    r.push({ at: b.startMs, sound: "turbine", presentation: !0 });
    const h = b.durationMs * xe;
    for (const p of on(s.wheelIndex))
      r.push({ at: b.startMs + p * h, sound: "tick", presentation: !0 });
  }
  const n = a("countup"), o = ft(X(s.net, s.cost));
  if (n && o && s.net > 0) {
    r.push({ at: n.startMs, sound: o, presentation: !0 }), r.push({ at: n.startMs, sound: "coin", presentation: !0 });
    for (let h = 1; h <= 6; h += 1) {
      const p = h / 7, g = 1 - (1 - p) * (1 - p);
      r.push({ at: n.startMs + Math.round(n.durationMs * g), sound: "coin", presentation: !0 });
    }
  }
  const l = a("collection");
  return l && r.push({ at: l.startMs, sound: "collect", presentation: !0 }), r.sort((h, p) => h.at - p.at);
}
const hn = [0, 8, 14, 20, 24];
function fn(s, e) {
  const t = X(s, e);
  return t < 2 || e <= 0 ? null : t === 2 ? "big" : t >= 4 ? "epic" : s >= 50 * e ? "super" : "mega";
}
function V(s, e) {
  return e <= s.startMs ? 0 : s.durationMs <= 0 ? 1 : Math.min(1, (e - s.startMs) / s.durationMs);
}
function pt(s, e) {
  let t = null;
  for (const r of s.stages)
    r.startMs <= e && (t = r);
  return t;
}
function pn(s, e, t) {
  const r = pt(e, t);
  return r ? r.kind === "replace" ? mn(s, V(r, t)) : r.kind === "bank" ? gn(s, V(r, t)) : r.kind === "wheel" ? _n(s, V(r, t)) : r.parts : e.stages[0]?.parts ?? {
    reading: null,
    discarded: null,
    base: null,
    modifierAdd: null,
    bankLocked: null,
    bankAdds: [],
    wheel: null,
    gross: null,
    net: null,
    guaranteedNet: null
  };
}
function mn(s, e) {
  const t = e >= 0.78;
  return {
    reading: W(t ? s.steps[0].tokens : s.initial.tokens),
    discarded: s.discarded,
    base: t ? s.steps[0].base : null,
    modifierAdd: null,
    bankLocked: null,
    bankAdds: [],
    wheel: null,
    gross: t ? s.gross : null,
    net: t ? s.net : null,
    guaranteedNet: t ? s.net : null
  };
}
function gn(s, e) {
  const t = e >= 0.5, r = e >= 5 / 6, i = [];
  t && i.push(s.steps[0].base), r && i.push(s.steps[1].base);
  const a = s.initial.base + i.reduce((d, c) => d + c, 0), u = a > s.cost ? a - s.cost : null;
  return {
    reading: W(s.initial.tokens),
    discarded: null,
    base: null,
    modifierAdd: null,
    bankLocked: e > 0 ? s.initial.base : null,
    bankAdds: i,
    wheel: null,
    gross: r ? s.gross : null,
    net: r ? s.net : null,
    guaranteedNet: r ? s.net : u
  };
}
function _n(s, e) {
  const t = e >= xe;
  return {
    reading: W(s.initial.tokens),
    discarded: null,
    base: s.initial.base,
    modifierAdd: null,
    bankLocked: null,
    bankAdds: [],
    wheel: t ? s.wheelPrize : null,
    gross: t ? s.gross : null,
    net: t ? s.net : null,
    guaranteedNet: t ? s.net : s.initial.base > 0 ? s.initial.base : null
  };
}
function bn(s, e) {
  const t = [{ label: "Cost", amount: s.cost, text: P(s.cost), strike: !1 }];
  if (e.discarded !== null && t.push({ label: "Discarded base", amount: e.discarded, text: P(e.discarded), strike: !0 }), e.base !== null && t.push({ label: "Base", amount: e.base, text: P(e.base), strike: !1 }), e.modifierAdd !== null && t.push({
    label: s.multiplier ? `${ct(s.modifier)} addition` : "Modifier addition",
    amount: e.modifierAdd,
    text: P(e.modifierAdd),
    strike: !1
  }), e.bankLocked !== null && t.push({ label: "Locked base", amount: e.bankLocked, text: P(e.bankLocked), strike: !1 }), e.bankAdds.forEach((r, i) => {
    t.push({ label: `Added result ${i + 1}`, amount: r, text: P(r), strike: !1 });
  }), e.wheel !== null && t.push({ label: "Wheel prize", amount: e.wheel, text: P(e.wheel), strike: !1 }), e.gross !== null && t.push({ label: "Gross", amount: e.gross, text: P(e.gross), strike: !1 }), e.net !== null) {
    const r = e.net > 0 ? `+${P(e.net)}` : P(e.net);
    t.push({ label: "Net", amount: null, text: r, strike: !1 });
  }
  return t;
}
function wn(s, e) {
  return e.error ? "error" : e.idle && !e.onboarded ? "onboarding" : e.idle ? "idle" : !s || s.kind === "reels" ? "spinning" : s.kind === "replace" ? "replace" : s.kind === "bank" ? "bank" : s.kind === "wheel" ? "wheel" : s.kind === "collection" ? "collection" : s.kind === "countup" && s.cueTier > 0 ? "celebrating" : "resolving";
}
function Ee(s) {
  const { outcome: e, schedule: t, balanceAfter: r } = s, i = Math.max(0, s.elapsed), a = pn(e, t, i), u = pt(t, i), d = e.net > 0 ? X(e.net, e.cost) : 0, c = t.stages.find((C) => C.kind === "countup");
  let m = null, b = 0;
  a.gross !== null && d === 0 && (m = a.gross), a.gross !== null && d > 0 && (c && i < c.startMs ? m = null : c && i < c.startMs + c.durationMs ? (m = an(0, e.gross, V(c, i)), b = d >= 3 ? V(c, i) : 0) : a.gross !== null && (m = e.gross, b = d >= 3 ? 1 : 0)), t.mode === "reduced" && (m = e.gross, b = 0);
  const n = m ?? 0, o = a.gross === null && t.mode !== "reduced" ? r - e.gross : r - e.gross + (d > 0 && c && i < c.startMs + c.durationMs && t.mode !== "reduced" ? n : e.gross), l = t.mode === "reduced" ? e.net > 0 ? d : 0 : a.guaranteedNet === null ? 0 : e.net > 0 ? X(Math.min(a.guaranteedNet, e.net), e.cost) : 0, h = c && i >= c.startMs && i < c.startMs + c.durationMs, p = t.mode === "reduced" || !h || d === 0 ? 0 : hn[d], g = t.stages.find((C) => C.kind === "modifier"), f = g && i >= g.startMs ? (g.cueTier > 0 ? 0.85 : 0.4) * Math.min(1, V(g, i) || 1) : 0;
  let w = null;
  if (e.modifier === "wheel" && e.wheelIndex !== null) {
    const C = t.stages.find((L) => L.kind === "wheel");
    if (t.mode === "reduced")
      w = { rotation: Te(e.wheelIndex), lit: e.wheelIndex, spinning: !1 };
    else if (C && i >= C.startMs) {
      const L = V(C, i), ee = L < xe, ge = ee ? L / xe : 1, D = rn(e.wheelIndex, ge), le = ee ? null : e.wheelIndex;
      !ee && (ht(D), e.wheelIndex), w = { rotation: D, lit: le, spinning: ee };
    } else
      w = { rotation: Te(0), lit: null, spinning: !1 };
  }
  const v = t.mode === "reduced" ? e.modifier === "replace" ? e.steps[0].tokens : e.initial.tokens : yn(e, t, i), A = vn(t, i), M = t.mode !== "reduced" && d > 0 && m !== null && c !== void 0 && i < c.startMs + c.durationMs, E = m === null || M ? "Total" : "Gross", F = a.net === null ? "Net pending" : a.net > 0 ? `Net +${P(a.net)}` : `Net ${P(a.net)}`, R = t.stages.find((C) => C.kind === "collection"), x = t.mode === "reduced" || (R ? i >= R.startMs : !1), Q = x ? e.collectionFlourish ? 10 : e.collectionBefore + 1 : e.collectionBefore, Y = x && e.collectionFlourish, K = s.sessionNetAfter ?? e.net, J = t.mode === "reduced" || a.net !== null;
  return {
    receiptId: t.receiptId,
    phase: wn(u, { onboarded: s.onboarded ?? !0, error: s.error ?? !1, idle: s.idle ?? !1 }),
    cost: e.cost,
    balanceShown: o,
    tokens: v,
    spinning: A,
    modifier: g && i >= g.startMs || t.mode === "reduced" ? e.modifier : null,
    reading: a.reading,
    discarded: a.discarded,
    lines: bn(e, a),
    hero: m,
    totalLabel: E,
    netText: F,
    cueTier: e.net <= 0 ? 0 : l,
    plate: t.mode === "reduced" || e.net <= 0 ? null : fn(e.net, e.cost),
    particles: p,
    bloom: e.net <= 0 || t.mode === "reduced" ? 0 : b,
    modifierGlow: t.mode === "reduced" ? 0 : f,
    anticipation: t.mode !== "reduced" && e.net > 0 && (e.modifier === "replace" || e.modifier === "bank" || e.modifier === "wheel" || d >= 2) && A.some(Boolean),
    wheel: w,
    meterFilled: Math.min(10, Q),
    meterFlourish: Y,
    reduced: t.mode === "reduced",
    sessionNetShown: J ? K : K - e.net
  };
}
function yn(s, e, t) {
  const i = e.stages.find((d) => d.kind === "reels")?.reelStops ?? [0, 0, 0], a = e.stages.find((d) => d.kind === "replace"), u = e.stages.find((d) => d.kind === "bank");
  if (a && t >= a.startMs)
    return V(a, t) < 0.78 ? [null, null, null] : s.steps[0].tokens;
  if (u && t >= u.startMs) {
    const d = V(u, t);
    return d >= 1 / 6 && d < 0.5 || d >= 0.62 && d < 5 / 6 ? [null, null, null] : d >= 5 / 6 ? s.steps[1].tokens : d >= 0.5 ? s.steps[0].tokens : s.initial.tokens;
  }
  return [
    t >= i[0] ? s.initial.tokens[0] : null,
    t >= i[1] ? s.initial.tokens[1] : null,
    t >= i[2] ? s.initial.tokens[2] : null
  ];
}
function vn(s, e) {
  if (s.mode === "reduced") return [!1, !1, !1, !1];
  const r = s.stages.find((c) => c.kind === "reels")?.reelStops ?? [0, 0, 0], i = s.stages.find((c) => c.kind === "modifier"), a = s.stages.find((c) => c.kind === "replace"), u = s.stages.find((c) => c.kind === "bank");
  let d = !1;
  if (a && e >= a.startMs && V(a, e) < 0.78 && (d = !0), u && e >= u.startMs) {
    const c = V(u, e);
    (c >= 1 / 6 && c < 0.5 || c >= 0.62 && c < 5 / 6) && (d = !0);
  }
  return [
    d || e < r[0],
    d || e < r[1],
    d || e < r[2],
    e < (i?.startMs ?? r[2])
  ];
}
function mt(s) {
  return [
    `Cost ${P(s.cost)}.`,
    s.discarded !== null ? `Discarded base ${P(s.discarded)} is excluded.` : "",
    `Gross ${P(s.gross)}.`,
    en(s) + ".",
    tn(s),
    s.collectionFlourish ? "Energy flourish, no credit reward." : ""
  ].filter(Boolean).join(" ");
}
class gt extends Error {
  constructor() {
    super("economic draw aborted"), this.name = "RngAbortError";
  }
}
const Ge = 2 ** 32;
function _t(s) {
  if (!Number.isInteger(s) || s < 1 || s > Ge) throw new Error("invalid bound");
  return Math.floor(Ge / s) * s;
}
function kn(s, e) {
  if (!Number.isInteger(s) || s < 0 || s >= Ge) throw new Error("invalid sample");
  const t = _t(e);
  return s >= t ? { ok: !1 } : { ok: !0, value: s % e };
}
class An {
  constructor(e = (r) => crypto.getRandomValues(r), t = 32) {
    this.source = e, this.maxRejects = t;
  }
  source;
  maxRejects;
  nextInt(e) {
    _t(e);
    const t = new Uint32Array(1);
    for (let r = 0; r < this.maxRejects; r++) {
      this.source(t);
      const i = kn(t[0], e);
      if (i.ok) return i.value;
    }
    throw new gt();
  }
}
class Sn {
  constructor(e) {
    this.inner = e;
  }
  inner;
  queue = [];
  nextInt(e) {
    return this.inner.nextInt(e);
  }
}
const Le = "auric-dynamo.snapshot.v1", xn = "auric-dynamo";
function bt() {
  return {
    muted: !1,
    music: !0,
    effects: !0,
    reducedMotion: null,
    turbo: !1,
    autoplayCount: 10,
    onboarded: !1,
    cost: 10
  };
}
function Ye(s, e = "durable") {
  return {
    schemaVersion: Yt,
    revision: 1,
    balance: jt,
    meter: 0,
    sessionNet: 0,
    activeMs: 0,
    sessionStartedAt: s,
    prefs: bt(),
    receipt: null,
    storage: e,
    economy: "local"
  };
}
function pe(s) {
  return typeof s == "object" && s !== null && !Array.isArray(s);
}
function Mn(s) {
  return pe(s) ? typeof s.gross == "number" && typeof s.net == "number" && typeof s.cost == "number" && typeof s.modifier == "string" && Array.isArray(s.contributors) && Array.isArray(s.steps) && pe(s.initial) : !1;
}
function je(s) {
  if (s === null || s === "") return { ok: !1, reason: "empty" };
  let e;
  try {
    e = JSON.parse(s);
  } catch {
    return { ok: !1, reason: "corrupt" };
  }
  if (!pe(e)) return { ok: !1, reason: "corrupt" };
  if (e.schemaVersion !== 1) return { ok: !1, reason: "version" };
  if (!Number.isSafeInteger(e.balance) || e.balance < 0) return { ok: !1, reason: "balance" };
  if (!Number.isSafeInteger(e.meter) || e.meter < 0 || e.meter > 9) return { ok: !1, reason: "meter" };
  if (!Number.isSafeInteger(e.sessionNet)) return { ok: !1, reason: "net" };
  if (!Number.isSafeInteger(e.revision) || e.revision < 1) return { ok: !1, reason: "revision" };
  if (typeof e.activeMs != "number" || !Number.isFinite(e.activeMs) || e.activeMs < 0) return { ok: !1, reason: "time" };
  if (typeof e.sessionStartedAt != "number" || !Number.isFinite(e.sessionStartedAt)) return { ok: !1, reason: "time" };
  if (!pe(e.prefs) || !Qe(e.prefs.cost) || !De(e.prefs.autoplayCount))
    return { ok: !1, reason: "prefs" };
  const t = e.prefs;
  if (typeof t.muted != "boolean" || typeof t.music != "boolean" || typeof t.effects != "boolean")
    return { ok: !1, reason: "prefs" };
  if (typeof t.turbo != "boolean" || typeof t.onboarded != "boolean") return { ok: !1, reason: "prefs" };
  if (!(t.reducedMotion === null || typeof t.reducedMotion == "boolean")) return { ok: !1, reason: "prefs" };
  let r = null;
  if (e.receipt !== null && e.receipt !== void 0) {
    if (!pe(e.receipt) || !Mn(e.receipt.outcome)) return { ok: !1, reason: "receipt" };
    if (typeof e.receipt.id != "string" || !e.receipt.id) return { ok: !1, reason: "receipt" };
    if (e.receipt.revision !== e.revision) return { ok: !1, reason: "receipt" };
    if (e.receipt.balanceAfter !== e.balance) return { ok: !1, reason: "receipt" };
    if (typeof e.receipt.acknowledged != "boolean") return { ok: !1, reason: "receipt" };
    r = e.receipt;
  }
  const i = e.storage === "tab" || e.storage === "memory" || e.storage === "durable" ? e.storage : "durable";
  return {
    ok: !0,
    snapshot: {
      schemaVersion: 1,
      revision: e.revision,
      balance: e.balance,
      meter: e.meter,
      sessionNet: e.sessionNet,
      activeMs: Math.floor(e.activeMs),
      sessionStartedAt: Math.floor(e.sessionStartedAt),
      prefs: {
        muted: t.muted,
        music: t.music,
        effects: t.effects,
        reducedMotion: t.reducedMotion,
        turbo: t.turbo,
        autoplayCount: t.autoplayCount,
        onboarded: t.onboarded,
        cost: t.cost
      },
      receipt: r,
      storage: i,
      economy: e.economy === "wallet" ? "wallet" : "local"
    }
  };
}
function wt(s, e, t) {
  const r = je(s.get(Le));
  return r.ok ? { snapshot: { ...r.snapshot, storage: t }, resetReason: null } : { snapshot: Ye(e, t), resetReason: r.reason === "empty" ? null : r.reason };
}
function ae(s, e) {
  s.set(Le, JSON.stringify(e));
}
async function Tn(s) {
  return s.locker.exclusive(() => {
    const e = s.memory ?? wt(s.kv, s.now, "durable").snapshot;
    if (!s.settled && e.balance < s.cost)
      return { result: { kind: "insufficient", snapshot: e }, memory: s.memory, warning: null };
    let t;
    if (s.settled)
      t = s.settled.outcome;
    else
      try {
        t = ut(s.rng, s.cost, e.meter);
      } catch (c) {
        if (c instanceof gt)
          return { result: { kind: "rng-abort", snapshot: e }, memory: s.memory, warning: null };
        throw c;
      }
    let r;
    try {
      if (r = s.settled ? G(s.settled.balanceAfter, "balance") : G(e.balance + t.net, "balance"), r < 0) throw new Error("negative");
    } catch {
      return { result: { kind: "overflow", snapshot: e }, memory: s.memory, warning: null };
    }
    const i = e.revision + 1, a = G(e.sessionNet + t.net, "session net"), u = {
      id: s.newId(),
      revision: i,
      acknowledged: !1,
      outcome: t,
      balanceAfter: r,
      meterAfter: t.collectionAfter,
      sessionNetAfter: a
    }, d = {
      ...e,
      revision: i,
      balance: r,
      meter: t.collectionAfter,
      sessionNet: a,
      activeMs: Math.max(e.activeMs, s.activeMs),
      receipt: u,
      economy: s.settled ? "wallet" : e.economy
    };
    if (s.memory)
      return { result: { kind: "committed", snapshot: d, storage: "memory" }, memory: d, warning: null };
    try {
      return ae(s.kv, d), { result: { kind: "committed", snapshot: d, storage: d.storage }, memory: null, warning: null };
    } catch {
      const c = { ...d, storage: "memory" };
      return {
        result: { kind: "committed", snapshot: c, storage: "memory" },
        memory: c,
        warning: "This browser could not save the demo. Play continues in this tab only. A reload will not restore it."
      };
    }
  });
}
async function En(s) {
  return s.locker.exclusive(() => {
    const e = s.memory ?? In(s.kv), t = e.receipt;
    if (!t || t.id !== s.id || t.revision !== s.revision || e.revision !== s.revision)
      return { snapshot: e, memory: s.memory, applied: !1 };
    if (t.acknowledged) return { snapshot: e, memory: s.memory, applied: !1 };
    const r = {
      ...e,
      activeMs: Math.max(e.activeMs, s.activeMs),
      receipt: { ...t, acknowledged: !0 }
    };
    if (s.memory) return { snapshot: r, memory: r, applied: !0 };
    try {
      ae(s.kv, r);
    } catch {
      const i = { ...r, storage: "memory" };
      return { snapshot: i, memory: i, applied: !0 };
    }
    return { snapshot: r, memory: null, applied: !0 };
  });
}
function In(s) {
  const e = je(s.get(Le));
  return e.ok ? e.snapshot : Ye(Date.now(), "durable");
}
async function Ln(s) {
  return s.locker.exclusive(() => {
    const e = je(s.kv.get(Le)), t = e.ok ? { ...e.snapshot.prefs, onboarded: !0 } : bt(), r = Ye(s.now, s.storage);
    r.prefs = t, r.revision = e.ok ? e.snapshot.revision + 1 : 1;
    try {
      ae(s.kv, r);
    } catch {
      r.storage = "memory";
    }
    return r;
  });
}
function Pn() {
  return { exclusive: (s) => Promise.resolve(s()) };
}
function Cn() {
  return new An();
}
class Nn {
  constructor(e, t, r, i, a, u, d) {
    this.outcome = e, this.schedule = t, this.balanceAfter = r, this.meterAfter = i, this.sessionNetAfter = a, this.audio = u, this.hooks = d, this.finished = new Promise((c) => {
      this.resolveDone = c;
    });
  }
  outcome;
  schedule;
  balanceAfter;
  meterAfter;
  sessionNetAfter;
  audio;
  hooks;
  elapsed = 0;
  done = !1;
  fired = 0;
  summarySent = !1;
  finished;
  resolveDone;
  start() {
    this.emit();
  }
  /** Advance active presentation time. Hidden time does not elapse and does not fire cues. */
  advance(e, t) {
    this.done || t || e <= 0 || (this.elapsed = Math.min(this.schedule.totalMs, this.elapsed + e), this.fireCues(), this.elapsed >= this.schedule.totalMs ? this.finish() : this.hooks.onFrame(this.frame()));
  }
  skip() {
    this.done || (this.audio.cancelPending(), this.audio.fadePresentation(Ie.fadeMs), this.fired = this.schedule.cues.length, this.elapsed = this.schedule.totalMs, this.finish());
  }
  emit() {
    this.fireCues(), this.elapsed >= this.schedule.totalMs ? this.finish() : this.hooks.onFrame(this.frame());
  }
  fireCues() {
    const e = this.schedule.cues;
    for (; this.fired < e.length && e[this.fired].at <= this.elapsed; )
      this.audio.play(e[this.fired].sound, e[this.fired].rate), this.fired += 1;
  }
  frame() {
    return Ee({
      outcome: this.outcome,
      schedule: this.schedule,
      elapsed: this.elapsed,
      balanceAfter: this.balanceAfter,
      meterAfter: this.meterAfter,
      sessionNetAfter: this.sessionNetAfter
    });
  }
  finish() {
    if (this.done) return;
    this.done = !0;
    const e = Ee({
      outcome: this.outcome,
      schedule: this.schedule,
      elapsed: Math.max(this.schedule.totalMs, 1),
      balanceAfter: this.balanceAfter,
      meterAfter: this.meterAfter,
      sessionNetAfter: this.sessionNetAfter
    });
    this.hooks.onFrame(e), this.summarySent || (this.summarySent = !0, this.hooks.onSummary(mt(this.outcome))), this.hooks.onDone(), this.resolveDone();
  }
}
class Bn {
  constructor(e, t, r, i, a, u, d, c, m = !1, b = () => crypto.randomUUID()) {
    this.kv = e, this.locker = t, this.rng = r, this.audio = i, this.onFrame = a, this.onSummary = u, this.newId = b, this.osReduced = m, this.now = d;
    const n = wt(e, d, c);
    if (this.snapshot = n.snapshot, this.resetReason = n.resetReason, this.activeMs = this.snapshot.activeMs, n.resetReason)
      try {
        ae(e, this.snapshot);
      } catch {
        this.enterMemory("This browser could not save the demo. Play continues in this tab only. A reload will not restore it.");
      }
    this.speed = this.snapshot.prefs.turbo ? 1 : 0, this.snapshot.receipt && this.restoreReceipt();
  }
  kv;
  locker;
  rng;
  audio;
  onFrame;
  onSummary;
  newId;
  snapshot;
  memory = null;
  locked = !1;
  now;
  activeMs;
  presentation = null;
  runP = Promise.resolve();
  lastOutcome = null;
  acceptedAt = 0;
  auto = null;
  hidden = !1;
  destroyed = !1;
  message = null;
  warning = null;
  summary = "";
  summaries = 0;
  framePhase = "idle";
  bootP = Promise.resolve();
  mode = "practice";
  speed = 0;
  walletPlay = null;
  resetReason;
  osReduced;
  get prefs() {
    return this.snapshot.prefs;
  }
  status() {
    return {
      phase: this.phase(),
      balance: this.snapshot.balance,
      sessionNet: this.snapshot.sessionNet,
      activeMs: this.activeMs,
      meter: this.snapshot.meter,
      cost: this.snapshot.prefs.cost,
      locked: this.locked,
      reveal: this.presentation !== null,
      warning: this.warning,
      message: this.message,
      autoRemaining: this.auto && !this.auto.stopped ? this.auto.remaining : null,
      autoplayCount: this.snapshot.prefs.autoplayCount,
      turbo: this.snapshot.prefs.turbo,
      speed: this.speed,
      muted: this.snapshot.prefs.muted,
      music: this.snapshot.prefs.music,
      effects: this.snapshot.prefs.effects,
      reducedMotion: this.snapshot.prefs.reducedMotion,
      onboarded: this.snapshot.prefs.onboarded,
      storage: this.memory ? "memory" : this.snapshot.storage,
      resetReason: this.resetReason,
      summary: this.summary
    };
  }
  summaryCount() {
    return this.summaries;
  }
  /** True while this cabinet spends a server balance rather than a practice balance. */
  usesWallet() {
    return this.mode === "wallet" || this.mode === "pending";
  }
  /** Practice is the only mode with a balance that can be restored in this browser. */
  allowsReset() {
    return this.mode === "practice";
  }
  /** Block plays until the server balance is known. */
  armWallet() {
    this.mode = "pending", this.message = "Connecting…";
  }
  /** Refuse plays. A direct open of the built page has no balance to spend. */
  closeMachine(e) {
    this.mode = "closed", this.walletPlay = null, this.message = e, this.snapshot = { ...this.snapshot, balance: 0, receipt: null, economy: "local" }, this.lastOutcome = null;
  }
  /** The server is the source of the outcome from here on. `cents` is its balance. */
  enableWallet(e, t) {
    this.mode = "wallet", this.walletPlay = e, this.message = null, this.adoptBalance(t);
  }
  /** Replace the shown balance with the server's, without posting a play. */
  adoptBalance(e) {
    if (!Number.isSafeInteger(e) || e < 0) return;
    const t = this.snapshot.economy === "wallet" ? this.snapshot.receipt : null, r = this.snapshot.revision + 1, i = t ? { ...t, balanceAfter: e, revision: r } : null;
    if (this.snapshot = {
      ...this.snapshot,
      revision: r,
      balance: e,
      economy: "wallet",
      receipt: i,
      meter: t ? this.snapshot.meter : this.snapshot.economy === "wallet" ? this.snapshot.meter : 0,
      sessionNet: t || this.snapshot.economy === "wallet" ? this.snapshot.sessionNet : 0
    }, this.memory) this.memory = this.snapshot;
    else
      try {
        ae(this.kv, this.snapshot);
      } catch {
        this.enterMemory("This browser could not save the last result. Play continues in this tab only.");
      }
    i && this.showRestoredFrame(i);
  }
  /** The committed receipt, for tests and the dev probe. Presentation does not change it. */
  receiptView() {
    const e = this.snapshot.receipt;
    if (!e) return null;
    const t = e.outcome;
    return {
      id: e.id,
      balance: e.balanceAfter,
      sessionNet: e.sessionNetAfter,
      gross: t.gross,
      net: t.net,
      cost: t.cost,
      modifier: t.modifier,
      wheelIndex: t.wheelIndex,
      wheelPrize: t.wheelPrize,
      tokens: [...t.initial.tokens],
      stepCount: t.steps.length,
      meterAfter: e.meterAfter,
      flourish: t.collectionFlourish
    };
  }
  /** Game clock used by the autoplay floor. Exposed for the development harness. */
  clock() {
    return { now: this.now, acceptedAt: this.acceptedAt };
  }
  motion() {
    const e = this.snapshot.prefs.reducedMotion;
    return (e === null ? this.osReduced : e) ? "reduced" : this.speed === 2 ? "super" : this.speed === 1 || this.snapshot.prefs.turbo ? "turbo" : "normal";
  }
  /** 0 off, 1 turbo, 2 super turbo. Super turbo lasts for this visit. */
  setSpeed(e) {
    this.locked || (this.speed = e, this.setTurbo(e > 0));
  }
  /** Manual play. Cancels autoplay and never spends on a rejected press. */
  spin() {
    return this.auto = null, this.beginSpin();
  }
  startAuto(e) {
    if (!De(e) || this.locked || this.auto) return !1;
    this.auto = { remaining: e, stopped: null, nextAt: Number.POSITIVE_INFINITY };
    const t = this.beginSpin();
    return t || (this.auto = null), t;
  }
  stopAutoplay() {
    this.auto && (this.auto.stopped = "stop");
  }
  reveal() {
    this.presentation?.skip();
  }
  setHidden(e) {
    this.hidden = e, e && this.stopAutoplay();
  }
  noteHelp(e) {
    e && this.stopAutoplay();
  }
  advance(e) {
    e > 0 && !this.hidden && (this.activeMs += e), e > 0 && (this.now += e), this.presentation?.advance(e, this.hidden), this.auto && !this.auto.stopped && !this.locked && this.now >= this.auto.nextAt && this.beginSpin();
  }
  async whenIdle() {
    await this.bootP, await this.runP;
  }
  setCost(e) {
    return this.locked || !Qe(e) ? !1 : (this.snapshot = { ...this.snapshot, prefs: { ...this.snapshot.prefs, cost: e } }, this.persistPrefs(), !0);
  }
  setTurbo(e) {
    this.locked || (this.snapshot = { ...this.snapshot, prefs: { ...this.snapshot.prefs, turbo: e } }, this.persistPrefs());
  }
  setReduced(e) {
    this.snapshot = { ...this.snapshot, prefs: { ...this.snapshot.prefs, reducedMotion: e } }, this.persistPrefs();
  }
  setAudioPrefs(e) {
    this.snapshot = { ...this.snapshot, prefs: { ...this.snapshot.prefs, ...e } }, this.persistPrefs();
  }
  setAutoCount(e) {
    return this.locked || !De(e) ? !1 : (this.snapshot = { ...this.snapshot, prefs: { ...this.snapshot.prefs, autoplayCount: e } }, this.persistPrefs(), !0);
  }
  finishOnboarding() {
    this.snapshot = { ...this.snapshot, prefs: { ...this.snapshot.prefs, onboarded: !0 } }, this.persistPrefs();
  }
  async reset() {
    if (this.locked || this.mode !== "practice") return !1;
    this.auto = null;
    const e = this.memory ? "memory" : this.snapshot.storage, t = await Ln({ kv: this.kv, locker: this.locker, now: this.now, storage: e });
    return this.snapshot = t, this.memory = t.storage === "memory" ? t : null, this.activeMs = 0, this.summary = "", this.lastOutcome = null, this.message = null, !0;
  }
  /** Inert in production builds. Development uses it for scripted screenshots. */
  applyDevSetup(e) {
    return null;
  }
  async destroy() {
    this.destroyed = !0, this.auto = null, this.presentation?.skip(), await this.runP;
  }
  beginSpin() {
    return this.locked || this.destroyed || !this.snapshot.prefs.onboarded ? !1 : this.mode === "pending" ? (this.message = "Connecting…", !1) : this.mode === "closed" ? !1 : this.snapshot.balance < this.snapshot.prefs.cost ? (this.message = this.mode === "wallet" ? "Not enough for this cost." : "Not enough demo credits. Reset demo credits to continue.", this.auto && (this.auto.stopped = "credits"), !1) : (this.locked = !0, this.message = null, this.acceptedAt = this.now, this.auto && !this.auto.stopped && (this.auto.remaining -= 1), this.runP = this.execute(), !0);
  }
  async execute() {
    let e = !1;
    try {
      let t;
      if (this.walletPlay)
        try {
          t = await this.walletPlay(this.snapshot.prefs.cost, this.snapshot.meter);
        } catch (d) {
          const c = d instanceof Error ? d.message : "";
          /insufficient/i.test(c) ? (this.message = "Not enough for this cost.", this.auto && (this.auto.stopped = "credits")) : /rules/i.test(c) ? (this.message = "Accept the rules to continue.", this.auto && (this.auto.stopped = "error")) : (this.message = c || "The draw could not be completed. Nothing was taken. Try again.", this.auto && (this.auto.stopped = "error"));
          return;
        }
      const r = await Tn({
        kv: this.kv,
        locker: this.locker,
        rng: this.rng,
        cost: this.snapshot.prefs.cost,
        now: this.now,
        activeMs: this.activeMs,
        newId: this.newId,
        memory: this.memory,
        settled: t
      });
      if (r.warning && (this.warning = r.warning), this.memory = r.memory, r.result.kind !== "committed") {
        r.result.kind === "insufficient" && (this.message = "Not enough demo credits. Reset demo credits to continue."), r.result.kind === "rng-abort" && (this.message = "The draw could not be completed. Nothing was taken. Try again."), r.result.kind === "overflow" && (this.message = "That result cannot be stored as a whole number. Nothing was taken."), this.auto && (this.auto.stopped = r.result.kind);
        return;
      }
      e = !0, this.snapshot = r.result.snapshot;
      const i = this.snapshot.receipt;
      if (!i) return;
      if (this.lastOutcome = i.outcome, this.destroyed) {
        await this.ack(i.id, i.revision);
        return;
      }
      const a = We(i.outcome, this.motion(), i.id), u = new Nn(i.outcome, a, i.balanceAfter, i.meterAfter, i.sessionNetAfter, this.audio, {
        onFrame: (d) => this.show(d),
        onSummary: (d) => this.postSummary(d),
        onDone: () => {
        }
      });
      this.presentation = u;
      try {
        u.start(), await u.finished;
      } catch {
        u.skip(), await u.finished;
      }
      await this.ack(i.id, i.revision);
    } catch {
      this.auto && (this.auto.stopped = "error"), e ? this.snapshot.receipt && this.showRestoredFrame(this.snapshot.receipt) : this.message = "The draw could not be completed. Nothing was taken. Try again.";
    } finally {
      this.presentation = null, this.locked = !1, this.scheduleNextAuto();
    }
  }
  scheduleNextAuto() {
    if (!this.auto) return;
    if (this.auto.stopped || this.destroyed) {
      this.auto = null;
      return;
    }
    if (Ct(this.lastOutcome, {
      remaining: this.auto.remaining
    })) {
      this.auto = null;
      return;
    }
    const t = Pt(this.acceptedAt, this.now);
    t <= this.now ? this.beginSpin() : this.auto.nextAt = t;
  }
  async ack(e, t) {
    const r = await En({
      kv: this.kv,
      locker: this.locker,
      memory: this.memory,
      id: e,
      revision: t,
      activeMs: this.activeMs
    });
    this.memory = r.memory, r.snapshot.receipt?.id === e && (this.snapshot = r.snapshot);
  }
  postSummary(e) {
    this.summary = e, this.summaries += 1, this.onSummary(e);
  }
  restoreReceipt() {
    const e = this.snapshot.receipt;
    e && (this.showRestoredFrame(e), this.postSummary(mt(e.outcome)), this.lastOutcome = e.outcome, e.acknowledged || (this.bootP = this.ack(e.id, e.revision)));
  }
  showRestoredFrame(e) {
    const t = We(e.outcome, "reduced", e.id);
    this.show(Ee({
      outcome: e.outcome,
      schedule: t,
      elapsed: t.totalMs,
      balanceAfter: e.balanceAfter,
      meterAfter: e.meterAfter,
      sessionNetAfter: e.sessionNetAfter
    }));
  }
  show(e) {
    this.framePhase = e.phase, this.onFrame(e);
  }
  persistPrefs() {
    if (this.memory) {
      this.memory = { ...this.memory, prefs: this.snapshot.prefs }, this.snapshot = this.memory;
      return;
    }
    try {
      ae(this.kv, this.snapshot);
    } catch {
      this.enterMemory("This browser could not save the demo. Play continues in this tab only. A reload will not restore it.");
    }
  }
  enterMemory(e) {
    this.warning = e, this.snapshot = { ...this.snapshot, storage: "memory" }, this.memory = this.snapshot;
  }
  phase() {
    return !this.snapshot.prefs.onboarded && !this.locked ? "onboarding" : this.message && !this.locked && this.message.startsWith("The draw") ? "error" : this.locked ? this.framePhase === "idle" ? "spinning" : this.framePhase : "idle";
  }
}
const ze = {
  symbolById: {},
  paylines: []
}, Be = {}, Fn = 240, On = 5, Hn = 3, Fe = { outQuad: (s) => 1 - (1 - s) * (1 - s), inOutQuad: (s) => s < 0.5 ? 2 * s * s : 1 - Math.pow(-2 * s + 2, 2) / 2, outBack: (s) => 1 + 2.2 * Math.pow(s - 1, 3) + 1.2 * Math.pow(s - 1, 2) }, Oe = (s, e) => (s % e + e) % e;
class Rn {
  /**
   * opts is optional. Lucky Pots calls this with the canvas, the payline svg and the two marker
   * columns, and gets the 5 by 3 view it has always had. Another game can pass
   * { reels, rows, cell, paylines, symbolArt } and use the same spin, blur and bounce.
   */
  constructor(e, t, r, i, a = {}) {
    this.c = e, this.ctx = e.getContext("2d"), this.svg = t, this.reelsN = a.reels ?? On, this.rowsN = a.rows ?? Hn, this.cell = a.cell ?? Fn, this.pitch = a.cellH ?? this.cell, this.w = this.reelsN * this.cell, this.h = this.rowsN * this.pitch, this.symbolArt = a.symbolArt ?? null, this.well = a.well ?? ["#1b4a2f", "#0a2217"], this.symbolFill = a.symbolFill === !0, this.plain = a.plain === !0, this.cellArt = a.cellArt ?? null, this.glowSprite = a.glowSprite ?? null, this.winSpark = a.winSpark ?? null, this.pulseWins = !1, this.landSeconds = a.landSeconds ?? 0.42, this.paylines = a.paylines ?? ze.paylines, this.paused = !1, a.reels && (e.width = this.w, e.height = this.h), this.strips = null, this.pos = new Array(this.reelsN).fill(0), this.reel = Array.from({ length: this.reelsN }, () => ({ phase: "idle", speed: 0 })), this.highlight = null, this.labels = /* @__PURE__ */ new Map(), this.wildReels = [], this.wildAnim = /* @__PURE__ */ new Map(), this.onReelStop = () => {
    }, this.glowReels = /* @__PURE__ */ new Set(), this.markers = { l: [], r: [] }, r && i && this.paylines.forEach((u, d) => {
      const c = document.createElement("div");
      c.className = "marker", c.textContent = d + 1, c.style.top = (u[0] + 0.5) * this.pitch + "px", r.appendChild(c);
      const m = document.createElement("div");
      m.className = "marker", m.textContent = d + 1, m.style.top = (u[this.reelsN - 1] + 0.5) * this.pitch + "px", i.appendChild(m), this.markers.l.push(c), this.markers.r.push(m);
    }), this.last = performance.now(), requestAnimationFrame((u) => this.frame(u));
  }
  /** Install strips and sit the reels on the given stops. */
  setStrips(e, t) {
    this.strips = e.map((r) => r.slice()), t && t.forEach((r, i) => {
      this.pos[i] = r;
    }), this.reel.forEach((r) => {
      r.phase = "idle", r.speed = 0;
    });
  }
  symAt(e, t) {
    const r = this.strips[e];
    return r[Oe(t, r.length)];
  }
  /** Start all reels spinning. Resolves immediately; stopAt lands them. */
  spin({ stagger: e = 0.12 } = {}) {
    const t = performance.now() / 1e3;
    this.clearHighlights(), this.wildReels = [], this.wildAnim.clear(), this.glowReels.clear(), this.reel.forEach((r, i) => {
      r.phase = "wait", r.t0 = t + i * e, r.speed = 0, r.startedAt = r.t0, r.pendingStop = !1, r.stopAt = 0, r.onLand = null;
    });
  }
  /** Land one reel on a column. Lucky Pots lands every reel together through stopAt. */
  landReel(e, t, r) {
    return new Promise((i) => {
      const a = this.strips && this.strips[e];
      if (!a) {
        i();
        return;
      }
      for (let c = 0; c < this.rowsN; c++) a[Oe(t + c, a.length)] = r[c];
      const u = this.reel[e], d = performance.now() / 1e3;
      u.stopAt = Math.max(d, (u.startedAt || d) + 0.12), u.target = t, u.pendingStop = !0, u.onLand = () => {
        this.onReelStop(e, r.slice()), i();
      };
    });
  }
  /**
   * Land the reels on `stops`, showing `grid` (the server's grid; the strip is patched so the
   * landing symbols are exactly it). delays[i] adds extra spin time to reel i (anticipation).
   * Resolves when the last reel has settled.
   */
  stopAt(e, t, { stagger: r = 0.22, minSpin: i = 0.6, delays: a = [] } = {}) {
    return new Promise((u) => {
      const d = performance.now() / 1e3;
      let c = this.reelsN;
      e.forEach((m, b) => {
        const n = this.strips[b];
        for (let h = 0; h < this.rowsN; h++) n[Oe(m + h, n.length)] = t[b][h];
        const o = this.reel[b], l = a[b] || 0;
        o.stopAt = Math.max(d, o.startedAt + i) + b * r + l, o.target = m, o.landed = !1, o.pendingStop = !0, o.onLand = () => {
          c--, this.onReelStop(b, t[b].slice()), c === 0 && u();
        };
      });
    });
  }
  /** Ask every spinning reel to land as soon as possible (turbo stop). */
  quickStop() {
    const e = performance.now() / 1e3;
    this.reel.forEach((t, r) => {
      t.pendingStop && t.phase !== "land" && t.phase !== "idle" && (t.stopAt = Math.min(t.stopAt, e + r * 0.06));
    });
  }
  isSpinning() {
    return this.reel.some((e) => e.phase !== "idle");
  }
  frame(e) {
    if (this.paused) {
      requestAnimationFrame((i) => this.frame(i));
      return;
    }
    const t = e / 1e3, r = Math.min(0.05, (e - this.last) / 1e3);
    this.last = e, this.reel.forEach((i, a) => {
      if (i.phase === "wait")
        if (t >= i.t0)
          i.phase = "pull", i.pullFrom = this.pos[a];
        else return;
      if (i.phase === "pull") {
        const u = Math.min(1, (t - i.t0) / 0.14);
        this.pos[a] = i.pullFrom + 0.35 * Math.sin(u * Math.PI / 2), u >= 1 && (i.phase = "spin", i.speed = 4);
      } else if (i.phase === "spin") {
        if (i.speed = Math.min(26, i.speed + 90 * r), this.pos[a] -= i.speed * r, i.pendingStop && t >= i.stopAt) {
          i.phase = "land", i.landT0 = t, i.pendingStop = !1;
          const u = this.pos[a] - Math.floor(this.pos[a]);
          i.landFrom = i.target + 2.6 + u, this.pos[a] = i.landFrom;
        }
      } else if (i.phase === "land") {
        const u = this.landSeconds, d = Math.min(1, (t - i.landT0) / u), c = 0.26;
        if (d < 0.62) {
          const m = Fe.outQuad(d / 0.62);
          this.pos[a] = i.landFrom + (i.target - c - i.landFrom) * m;
        } else {
          const m = Fe.inOutQuad((d - 0.62) / 0.38);
          this.pos[a] = i.target - c + c * m;
        }
        d >= 1 && (this.pos[a] = i.target, i.phase = "idle", i.speed = 0, i.onLand && i.onLand(), i.onLand = null);
      }
    });
    for (const [, i] of this.wildAnim)
      i.p = Math.min(1, i.p + r / 0.45);
    this.draw(t), requestAnimationFrame((i) => this.frame(i));
  }
  draw(e) {
    const t = this.ctx;
    if (t.clearRect(0, 0, this.w, this.h), !!this.strips) {
      if (this.plain) this.drawDrum(t);
      else for (let r = 0; r < this.reelsN; r++) for (let i = 0; i < this.rowsN; i++) this.drawCell(t, r, i, e);
      for (let r = 0; r < this.reelsN; r++) {
        const i = this.reel[r], a = this.pos[r], u = Math.floor(a), d = a - u, c = i.phase === "spin" ? Math.min(1, i.speed / 20) : 0;
        t.save(), t.beginPath(), t.rect(r * this.cell, 0, this.cell, this.h), t.clip();
        const m = this.wildReels.find((b) => b.reel === r);
        if (m && i.phase === "idle")
          this.drawWildReel(t, r, m, e);
        else
          for (let b = -1; b <= this.rowsN; b++) {
            const n = this.symAt(r, u + b), o = (b - d) * this.pitch;
            this.drawSymbol(t, n, r * this.cell, o, c, i.phase === "idle" ? [r, b] : null, e);
          }
        if (t.restore(), this.glowReels.has(r) && i.phase !== "idle") {
          const b = this.glowSprite;
          if (t.save(), b && b.complete && b.naturalWidth) {
            const n = this.winSpark;
            n && n.complete && n.naturalWidth && (t.globalAlpha = 0.5 + 0.35 * Math.sin(e * 9), t.drawImage(n, r * this.cell - 8, 0, this.cell + 16, this.h));
            const o = 0.6 + 0.4 * Math.sin(e * 14);
            t.globalAlpha = o, t.drawImage(b, r * this.cell - 12, this.h * 0.1, 44, 44), t.drawImage(b, r * this.cell + this.cell - 32, this.h * 0.36, 40, 40), t.drawImage(b, r * this.cell + this.cell * 0.22, this.h * 0.62, 36, 36), t.drawImage(b, r * this.cell - 6, -6, this.cell + 12, 36), t.drawImage(b, r * this.cell - 6, this.h - 30, this.cell + 12, 36);
          } else
            t.strokeStyle = `rgba(255,216,74,${0.6 + 0.4 * Math.sin(e * 10)})`, t.lineWidth = 8, t.shadowColor = "#ffd84a", t.shadowBlur = 30, t.strokeRect(r * this.cell + 6, 6, this.cell - 12, this.h - 12);
          t.restore();
        }
      }
      if (this.highlight) {
        const r = Be.frame_win_cell;
        for (const i of this.highlight) {
          const [a, u] = i.split(",").map(Number), d = 0.75 + 0.25 * Math.sin(e * 8);
          t.save();
          const c = this.winSpark;
          if (c && c.complete && c.naturalWidth)
            t.globalAlpha = 0.55 + 0.45 * Math.sin(e * 8), t.drawImage(c, a * this.cell, u * this.pitch, this.cell, this.pitch);
          else if (r) {
            const m = this.cell * (0.06 + 0.025 * Math.sin(e * 6));
            t.globalAlpha = 0.85 + 0.15 * Math.sin(e * 6), t.drawImage(r, a * this.cell - m / 2, u * this.cell - m / 2, this.cell + m, this.cell + m);
          } else
            t.strokeStyle = `rgba(255,220,90,${d})`, t.lineWidth = 7, t.shadowColor = "#ffd84a", t.shadowBlur = 24, t.strokeRect(a * this.cell + 7, u * this.cell + 7, this.cell - 14, this.cell - 14);
          t.restore();
        }
      }
      for (const [r, i] of this.labels) {
        const [a, u] = r.split(",").map(Number), d = a * this.cell + this.cell / 2, c = u * this.cell + this.cell / 2;
        t.save(), t.font = "700 34px Cinzel";
        const m = t.measureText(i).width + 36;
        t.fillStyle = "rgba(70,0,60,.85)", t.strokeStyle = "#ff3fd6", t.lineWidth = 4, Dn(t, d - m / 2, c - 28, m, 56, 14), t.fill(), t.stroke(), t.fillStyle = "#fff", t.textAlign = "center", t.textBaseline = "middle", t.fillText(i, d, c + 2), t.restore();
      }
    }
  }
  /** One shaded well per reel, so a window can clip the strip like a drum. */
  drawDrum(e) {
    for (let t = 0; t < this.reelsN; t++) {
      const r = t * this.cell, i = this.cellArt ? this.cellArt(t) : null;
      if (i && i.complete && i.naturalWidth) {
        e.drawImage(i, r, 0, this.cell, this.h);
        continue;
      }
      const a = e.createLinearGradient(0, 0, 0, this.h);
      a.addColorStop(0, "#020807"), a.addColorStop(0.18, this.well[1]), a.addColorStop(0.5, this.well[0]), a.addColorStop(0.82, this.well[1]), a.addColorStop(1, "#020807"), e.fillStyle = a, e.fillRect(r, 0, this.cell, this.h);
    }
  }
  drawCell(e, t, r, i) {
    const a = t * this.cell, u = r * this.pitch, d = this.cell, c = this.pitch, m = e.createRadialGradient(a + d / 2, u + c / 2, 20, a + d / 2, u + c / 2, Math.max(d, c) * 0.8);
    m.addColorStop(0, this.well[0]), m.addColorStop(1, this.well[1]), e.fillStyle = m, e.fillRect(a, u, d, c), e.save(), e.beginPath(), e.rect(a, u, d, c), e.clip(), e.strokeStyle = "rgba(120,200,140,.07)", e.lineWidth = 2;
    for (let b = -this.cell; b < this.cell * 2; b += 30)
      e.beginPath(), e.moveTo(a + b, u), e.lineTo(a + b + this.cell, u + this.cell), e.stroke(), e.beginPath(), e.moveTo(a + b + this.cell, u), e.lineTo(a + b, u + this.cell), e.stroke();
    e.restore(), e.strokeStyle = "#a67c2e", e.lineWidth = 3, e.strokeRect(a + 4, u + 4, d - 8, c - 8), e.strokeStyle = "rgba(0,0,0,.5)", e.lineWidth = 2, e.strokeRect(a + 1, u + 1, d - 2, c - 2), this.highlight && !this.highlight.has(`${t},${r}`) && !this.wildReels.some((b) => b.reel === t) && (e.fillStyle = "rgba(0,0,0,.55)", e.fillRect(a, u, d, c));
  }
  drawSymbol(e, t, r, i, a, u) {
    const d = this.symbolArt ? null : ze.symbolById[t], c = this.symbolArt ? this.symbolArt(t) : d && Be[d.art];
    if (!c) return;
    const m = this.pitch;
    if (this.symbolFill) {
      const p = c.naturalWidth || c.width || 1, g = c.naturalHeight || c.height || 1, f = this.cell * 0.8, w = m * 0.8;
      let v = f, A = v * (g / p);
      A > w && (A = w, v = A * (p / g));
      const M = (this.cell - v) / 2, E = (m - A) / 2;
      e.save(), e.beginPath(), e.rect(r, i, this.cell, m), e.clip();
      const F = !!(u && this.highlight && this.highlight.has(`${u[0]},${u[1]}`)), R = u && this.highlight && !F, x = Math.abs(i + m / 2 - this.h / 2), Q = Math.min(1, Math.max(0, (x - this.pitch * 0.42) / (this.pitch * 0.55)));
      if (e.save(), e.globalAlpha = R ? 0.45 : 1 - Q * 0.5, a > 0.05 && (e.globalAlpha *= 0.82), this.pulseWins && F) {
        const Y = 0.5 + 0.5 * Math.sin(performance.now() / 70);
        e.filter = `brightness(${1.15 + Y})`;
      }
      e.drawImage(c, r + M, i + E, v, A), e.restore(), e.restore();
      return;
    }
    const n = Math.min(this.cell, m) - 14 * 2, o = (this.cell - n) / 2, l = (m - n) / 2, h = u && this.highlight && !this.highlight.has(`${u[0]},${u[1]}`);
    if (e.save(), h && (e.globalAlpha = 0.45), a > 0.05) {
      e.globalAlpha = 0.55;
      const p = 1 + a * 0.6, g = n * p, f = (g - n) / 2;
      e.drawImage(c, r + o, i + l - f, n, g), e.globalAlpha = 0.35, e.drawImage(c, r + o, i + l - f - a * 40, n, g);
    } else
      e.drawImage(c, r + o, i + l, n, n), d && d.label && this.drawLabel(e, d.label, r + this.cell / 2, i + this.cell - 22);
    e.restore();
  }
  drawLabel(e, t, r, i, a = 34) {
    e.save(), e.font = `400 ${a}px "Luckiest Guy", "Lilita One", Impact`, e.textAlign = "center", e.textBaseline = "middle", e.lineJoin = "round", e.lineWidth = 8, e.strokeStyle = "#4a2a00", e.strokeText(t, r, i);
    const u = e.createLinearGradient(0, i - a / 2, 0, i + a / 2);
    u.addColorStop(0, "#fff2a8"), u.addColorStop(0.5, "#ffd84a"), u.addColorStop(1, "#d08a00"), e.fillStyle = u, e.fillText(t, r, i), e.restore();
  }
  drawWildReel(e, t, r, i) {
    const a = this.wildAnim.get(t), u = a ? Fe.outBack(a.p) : 1, d = Be.lep_full;
    if (!d) return;
    const c = t * this.cell, m = c + this.cell / 2, b = this.h / 2;
    e.save();
    const n = e.createLinearGradient(c, 0, c, this.h);
    n.addColorStop(0, "#2a7a3a"), n.addColorStop(1, "#0d3a1c"), e.fillStyle = n, e.fillRect(c + 4, 4, this.cell - 8, this.h - 8), e.strokeStyle = "#ffd84a", e.lineWidth = 6, e.shadowColor = "#ffd84a", e.shadowBlur = 20 + 10 * Math.sin(i * 6), e.strokeRect(c + 6, 6, this.cell - 12, this.h - 12), e.shadowBlur = 0, e.translate(m, b), e.scale(u, u), e.translate(-m, -b);
    const o = this.h - 60, l = o * d.width / d.height, h = Math.min(l, this.cell * 1.25), p = h * d.height / d.width;
    if (e.drawImage(d, m - h / 2, this.h - 20 - p, h, p), this.drawLabel(e, "WILD", m, this.h - 30, 44), r.mult > 1) {
      const g = "x" + r.mult;
      e.font = '400 72px "Luckiest Guy", Impact', e.textAlign = "center", e.textBaseline = "middle", e.lineJoin = "round", e.lineWidth = 12, e.strokeStyle = "#0b3a12", e.strokeText(g, m, this.h * 0.62), e.fillStyle = "#7dff6a", e.fillText(g, m, this.h * 0.62);
    }
    e.restore();
  }
  /** Reveal wild reels with a pop; resolves after the animation. */
  showWildReels(e) {
    return this.wildReels = e.slice(), this.wildAnim.clear(), e.forEach((t) => this.wildAnim.set(t.reel, { p: 0 })), new Promise((t) => setTimeout(t, e.length ? 500 : 0));
  }
  clearHighlights() {
    this.highlight = null, this.labels.clear(), this.svg && (this.svg.innerHTML = ""), this.markers.l.forEach((e) => e.classList.remove("on")), this.markers.r.forEach((e) => e.classList.remove("on"));
  }
  highlightCells(e) {
    this.highlight = new Set(e.map(([t, r]) => `${t},${r}`));
  }
  setLabel(e, t) {
    this.labels.set(`${e[0]},${e[1]}`, t);
  }
  showLine(e, t = "") {
    const r = this.paylines[e], i = [[-40, (r[0] + 0.5) * this.pitch]];
    r.forEach((u, d) => i.push([(d + 0.5) * this.cell, (u + 0.5) * this.pitch])), i.push([this.w + 40, (r[this.reelsN - 1] + 0.5) * this.pitch]);
    const a = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    a.setAttribute("points", i.map((u) => u.join(",")).join(" ")), t && a.setAttribute("class", t), this.svg.appendChild(a), this.markers.l[e].classList.add("on"), this.markers.r[e].classList.add("on");
  }
}
function Dn(s, e, t, r, i, a) {
  s.beginPath(), s.moveTo(e + a, t), s.arcTo(e + r, t, e + r, t + i, a), s.arcTo(e + r, t + i, e, t + i, a), s.arcTo(e, t + i, e, t, a), s.arcTo(e, t, e + r, t, a), s.closePath();
}
const ue = ["blank", "0", "1", "5", "10", "00"], He = ["x1", "x2", "x5", "x10", "replace", "bank", "wheel"];
function et(s, e) {
  const t = Math.max(0, e.indexOf(s)), r = e[(t + e.length - 1) % e.length] ?? s, i = e[(t + 1) % e.length] ?? s;
  return [r, s, i];
}
function ve(s, e) {
  const t = [];
  for (let r = 0; r < e; r++) t.push(...s);
  return t;
}
function N(s) {
  const e = new Image();
  return e.src = H(s), e;
}
class tt {
  constructor(e, t) {
    this.canvas = e, this.sheet = t;
  }
  canvas;
  sheet;
  coins = [];
  active = !1;
  raf = 0;
  last = 0;
  rate = 4;
  acc = 0;
  start(e) {
    this.rate = e, this.active = !0, this.raf || (this.last = performance.now(), this.raf = requestAnimationFrame((t) => this.frame(t)));
  }
  stop() {
    this.active = !1;
  }
  /** A short pop from the bottom. The coins finish falling on their own. */
  burst() {
    const e = this.canvas.width || 960, t = this.canvas.height || 540;
    for (let r = 0; r < 16; r += 1)
      this.coins.push({
        x: e * (0.16 + Math.random() * 0.68),
        y: t * (0.78 + Math.random() * 0.16),
        vy: -(220 + Math.random() * 180),
        s: 18 + Math.random() * 16,
        frame: Math.floor(Math.random() * 12),
        spin: 10 + Math.random() * 10
      });
    this.active = !1, this.raf || (this.last = performance.now(), this.raf = requestAnimationFrame((r) => this.frame(r)));
  }
  clear() {
    this.active = !1, this.coins = [], this.canvas.getContext("2d")?.clearRect(0, 0, this.canvas.width, this.canvas.height), this.raf && cancelAnimationFrame(this.raf), this.raf = 0;
  }
  frame(e) {
    const t = this.canvas.getContext("2d");
    if (!t) return;
    const r = Math.min(0.05, (e - this.last) / 1e3);
    this.last = e;
    const i = this.canvas.width, a = this.canvas.height;
    for (this.acc += this.active ? this.rate : 0; this.acc >= 1; )
      this.acc -= 1, this.coins.push({
        x: i * (0.18 + Math.random() * 0.64),
        y: a * (0.08 + Math.random() * 0.2),
        vy: 40 + Math.random() * 80,
        s: 18 + Math.random() * 10,
        frame: Math.floor(Math.random() * 12),
        spin: 8 + Math.random() * 10
      });
    t.clearRect(0, 0, i, a);
    const u = this.sheet, d = u.complete && u.naturalWidth >= 128;
    this.coins = this.coins.filter((c) => c.y < a + 80 && c.s < 160);
    for (const c of this.coins) {
      if (c.vy += 280 * r, c.y += c.vy * r, c.s += 70 * r, c.frame = (c.frame + c.spin * r) % 12, !d) continue;
      const m = Math.floor(c.frame) * 128;
      t.drawImage(u, m, 0, 128, 128, c.x - c.s / 2, c.y - c.s / 2, c.s, c.s);
    }
    this.active || this.coins.length ? this.raf = requestAnimationFrame((c) => this.frame(c)) : this.raf = 0;
  }
}
class $n {
  view = null;
  rain = null;
  pop = null;
  burstFor = "";
  wheelSpinning = !1;
  wheelFlashAt = 0;
  wheelLandAt = 0;
  reels = null;
  wheel = null;
  big = null;
  bigArt = null;
  frame = null;
  cost = 10;
  wasSpinning = !1;
  armed = !1;
  held = [null, null, null, null];
  wheelFace = null;
  pointerArt = null;
  bulbOn = null;
  bulbOff = null;
  glow = null;
  spark = null;
  money = !1;
  symbols = /* @__PURE__ */ new Map();
  async mount(e) {
    e.replaceChildren(), e.classList.add("lp-stage");
    const t = document.createElement("canvas");
    t.id = "reels";
    const r = document.createElement("canvas");
    r.id = "wheel-view", r.width = 420, r.height = 420;
    const i = document.createElement("div");
    i.id = "bigwin", i.hidden = !0;
    const a = document.createElement("canvas");
    a.id = "coins", a.width = 960, a.height = 540;
    const u = document.createElement("canvas");
    u.id = "coin-burst", u.width = 960, u.height = 540;
    const d = document.createElement("img");
    d.id = "bigwin-art", d.alt = "";
    const c = document.createElement("p");
    c.id = "plate-amount";
    const m = document.createElement("button");
    m.id = "bigwin-skip", m.type = "button", m.textContent = "Skip", m.addEventListener("click", () => {
      document.getElementById("reveal")?.dispatchEvent(new MouseEvent("click", { bubbles: !0 }));
    }), i.append(a, d, c, m);
    const b = document.getElementById("overlay") ?? e, n = document.getElementById("wheel-host");
    e.append(t), (n ?? e).append(r), b.append(i, u), this.reels = t, this.wheel = r, this.big = i, this.bigArt = d, this.wheelFace = N(k.wheelFace), this.pointerArt = N(k.pointer);
    const o = N(k.coinSheet);
    this.pop = new tt(u, o);
    const l = N(k.reelCell), h = document.createElement("canvas");
    h.width = 720, h.height = 512;
    const p = N(k.numerals[1]), g = N(k.numerals[0]), f = () => {
      if (!p.complete || !g.complete || !p.naturalWidth || !g.naturalWidth) return;
      const w = h.getContext("2d");
      w && (w.clearRect(0, 0, h.width, h.height), w.drawImage(p, 40, 40, 300, 430), w.drawImage(g, 340, 40, 340, 430));
    };
    p.addEventListener("load", f), g.addEventListener("load", f), f(), this.symbols.set("0", N(k.numerals[0])), this.symbols.set("1", p), this.symbols.set("5", N(k.numerals[5])), this.symbols.set("00", N(k.numerals["00"])), this.symbols.set("10", h), this.symbols.set("x1", N(k.modifiers.x1)), this.symbols.set("x2", N(k.modifiers.x2)), this.symbols.set("x5", N(k.modifiers.x5)), this.symbols.set("x10", N(k.modifiers.x10)), this.symbols.set("replace", N(k.modifiers.replace)), this.symbols.set("bank", N(k.modifiers.bank)), this.symbols.set("wheel", N(k.modifiers.wheel)), this.bulbOn = N(k.bulbOn), this.bulbOff = N(k.bulbOff), this.glow = N(k.glowEmerald), this.spark = N(k.spark), this.view = new Rn(t, null, null, null, {
      reels: 4,
      rows: 3,
      cell: 104,
      cellH: 132,
      paylines: [],
      well: ["#123832", "#071614"],
      plain: !0,
      symbolFill: !0,
      landSeconds: 0.22,
      cellArt: (w) => w < 3 && l.complete && l.naturalWidth ? l : null,
      glowSprite: this.spark,
      winSpark: this.glow,
      symbolArt: (w) => {
        if (w === "blank") return null;
        const v = this.symbols.get(w);
        return v ? v instanceof HTMLCanvasElement ? v.width ? v : null : v.complete && v.naturalWidth > 0 ? v : null : null;
      }
    }), this.view.setStrips(
      [ve(ue, 4), ve(ue, 4), ve(ue, 4), ve(He, 3)],
      [1, 2, 3, 0]
    ), this.view.onReelStop = () => {
      e.dispatchEvent(new CustomEvent("auric-land", { bubbles: !0 }));
    }, this.rain = new tt(a, o), this.resize();
  }
  setHidden(e) {
    this.view && (this.view.paused = e), e && this.rain?.stop();
  }
  render(e, t) {
    this.frame = e, this.cost = t;
    const r = this.view;
    if (!r) return;
    const i = e.spinning.some(Boolean), a = [e.tokens[0], e.tokens[1], e.tokens[2], e.modifier], u = a.every((d) => d !== null);
    if (i && !this.wasSpinning && this.pop?.clear(), i && !this.wasSpinning && !e.reduced) {
      const d = document.getElementById("turbo")?.checked === !0;
      r.spin({ stagger: d ? 0.02 : 0.04 }), this.armed = !0, this.held.fill(null);
      const c = document.getElementById("reel-sweep");
      c && (c.classList.remove("go"), c.offsetWidth, c.classList.add("go"));
    }
    this.armed && !e.reduced ? (a.forEach((d, c) => {
      if (d !== null && !e.spinning[c] && this.held[c] !== d) {
        this.held[c] = d;
        const m = c < 3 ? ue : He;
        r.landReel(c, [3, 5, 7, 2][c] ?? 0, et(d, m));
      }
    }), !i && u && (this.armed = !1)) : u && !r.isSpinning() && a.join("|") !== this.held.join("|") && (r.setStrips(a.map((d, c) => et(d, c < 3 ? ue : He)), [0, 0, 0, 0]), a.forEach((d, c) => {
      this.held[c] = d;
    })), this.wasSpinning = i, r.glowReels.clear(), r.highlight = null, e.anticipation && !e.reduced && e.spinning.slice(0, 3).every((c) => !c) && e.spinning[3] && r.glowReels.add(3), r.pulseWins = !1, !e.reduced && !i && e.cueTier > 0 && (r.highlight = /* @__PURE__ */ new Set(["0,1", "1,1", "2,1"]), r.pulseWins = e.cueTier === 1), this.paintWheel(e), this.paintWin(e);
  }
  /** Wallet amounts are cents. Practice amounts are shown as whole numbers. */
  setMoney(e) {
    this.money = e;
  }
  pointerWedge() {
    return this.frame?.wheel ? ht(this.frame.wheel.rotation) : null;
  }
  /** Keeps the idle lamp chase moving between receipts. */
  tick(e) {
    this.paintWheel(e);
  }
  resize() {
    const e = Math.max(320, window.innerWidth), t = Math.max(180, window.innerHeight), r = this.big?.querySelector("canvas");
    r && (r.width = e, r.height = t);
    const i = document.getElementById("coin-burst");
    i instanceof HTMLCanvasElement && (i.width = e, i.height = t);
    const a = this.wheel, u = document.getElementById("wheel-host");
    if (a && u) {
      const d = Math.max(160, Math.floor(Math.min(u.clientWidth, u.clientHeight)));
      a.width !== d && (a.width = d, a.height = d);
    }
  }
  destroy() {
    this.rain?.clear(), this.pop?.clear(), document.getElementById("coin-burst")?.remove(), this.view && (this.view.paused = !0), this.view = null, this.big?.remove(), this.wheel?.remove(), this.reels?.parentElement?.replaceChildren();
  }
  paintWheel(e) {
    const t = this.wheel, r = t?.getContext("2d"), i = this.wheelFace;
    if (!t || !r || !i) return;
    const a = t.width, u = a / 2, d = e?.wheel ?? null, c = e?.reduced ?? !1, m = !!d?.spinning;
    m && !this.wheelSpinning && (this.wheelFlashAt = performance.now()), !m && this.wheelSpinning && d && d.lit !== null && (this.wheelLandAt = performance.now()), this.wheelSpinning = m;
    const b = d?.rotation ?? 0;
    r.clearRect(0, 0, a, a), r.save(), r.translate(u, u), r.rotate(b), i.complete && i.naturalWidth && r.drawImage(i, -a / 2, -a / 2, a, a), r.fillStyle = "#fff6d8", r.strokeStyle = "#3a2200", r.lineWidth = Math.max(3, a * 0.013), r.lineJoin = "round", r.miterLimit = 2, r.textBaseline = "middle", r.shadowColor = "rgba(12, 8, 2, 0.9)", Me.forEach((p, g) => {
      const f = -Math.PI / 2 + (22.5 + g * 45) * Math.PI / 180, w = this.money ? (this.cost * p / 100).toFixed(2) : String(this.cost * p), v = a * 0.16;
      let A = Math.round(a * 0.07);
      for (r.font = `700 ${A}px Auric Serif, serif`; A > Math.round(a * 0.045) && r.measureText(w).width > v; )
        A -= 1, r.font = `700 ${A}px Auric Serif, serif`;
      const M = Math.cos(f) >= 0, E = a * 0.33;
      r.save(), r.translate(Math.cos(f) * E, Math.sin(f) * E), r.rotate(M ? f : f + Math.PI), r.textAlign = "center", r.shadowBlur = Math.max(2, a * 0.01), r.strokeText(w, 0, 0), r.shadowBlur = 0, r.fillText(w, 0, 0), r.restore();
    }), r.restore();
    const n = performance.now() - this.wheelFlashAt;
    if (m && n < 280 && !c && (r.save(), r.globalAlpha = 1 - n / 280, r.fillStyle = "#fff6d8", r.beginPath(), r.arc(u, u, a * 0.46, 0, Math.PI * 2), r.fill(), r.restore()), d?.lit !== null && d?.lit !== void 0 && !d.spinning && this.glow?.complete) {
      const p = performance.now() - this.wheelLandAt, g = !c && p < 720 ? 0.35 + 0.65 * Math.abs(Math.sin(p / 60)) : 0.9;
      r.globalAlpha = g, r.drawImage(this.glow, u - a * 0.18, a * 0.01, a * 0.36, a * 0.26), r.globalAlpha = 1;
    }
    if (d?.spinning && this.spark?.complete && !c) {
      const p = this.spark, g = performance.now() / 40;
      for (let f = 0; f < 6; f++) {
        const w = -Math.PI / 2 - (g + f * 7) * Math.PI / 180;
        r.globalAlpha = 0.25 + f * 0.1, r.drawImage(p, u + Math.cos(w) * a * 0.42 - 12, u + Math.sin(w) * a * 0.42 - 12, 24, 24);
      }
      r.globalAlpha = 1;
    }
    const o = this.pointerArt;
    if (o && o.complete && o.naturalWidth) {
      const p = a * 0.2, g = p * (o.naturalWidth / o.naturalHeight), f = !c && d && d.lit !== null && !d.spinning ? Math.sin(performance.now() / 90) * a * 0.012 : 0;
      r.drawImage(o, u - g / 2, a * 0.015 + f, g, p);
    }
    const l = this.bulbOn, h = this.bulbOff;
    if (l?.complete && h?.complete) {
      const p = !c && (!d || d.spinning || d.lit === null), g = Math.floor(performance.now() / (d?.spinning ? 70 : 180));
      for (let f = 0; f < 16; f++) {
        const w = p && (f === g % 16 || f === (g + 1) % 16), v = d !== null && d.lit !== null && f % 2 === d.lit % 2, A = w || v ? l : h, M = f / 16 * Math.PI * 2 - Math.PI / 2, E = a * 0.045;
        r.drawImage(A, u + Math.cos(M) * a * 0.46 - E / 2, u + Math.sin(M) * a * 0.46 - E / 2, E, E);
      }
    }
  }
  paintWin(e) {
    const t = e.reduced ? null : e.plate, r = e.phase === "celebrating" || e.phase === "resolving", i = t !== null && e.hero !== null && e.hero > 0 && r, a = t === null && !e.reduced && e.cueTier === 1 && r && (e.hero ?? 0) > 0, u = e.receiptId ?? "";
    if (a && u !== "" && this.burstFor !== u && (this.burstFor = u, this.pop?.burst()), !this.big || !this.bigArt) return;
    if (this.big.hidden = !i, !i) {
      this.rain?.stop();
      return;
    }
    const d = k.plates[t];
    this.bigArt.dataset.tier !== t && (this.bigArt.dataset.tier = t, this.bigArt.src = H(d));
    const c = t === "epic" ? 7 : t === "super" ? 6 : t === "mega" ? 5 : 3;
    this.rain?.start(c);
  }
}
const ke = window.matchMedia("(prefers-reduced-motion: reduce)");
function Wn() {
  const s = "locks" in navigator, e = s ? localStorage : sessionStorage, t = {
    get: (i) => {
      try {
        return e.getItem(i);
      } catch {
        return null;
      }
    },
    set: (i, a) => {
      e.setItem(i, a);
    }
  };
  return s ? { kv: t, locker: {
    exclusive(i) {
      return Promise.resolve(navigator.locks.request(xn, () => i()));
    }
  }, storage: "durable", notice: null } : {
    kv: t,
    locker: Pn(),
    storage: "tab",
    notice: "This browser keeps a separate demo balance in each tab."
  };
}
function y(s) {
  const e = document.getElementById(s);
  if (!e) throw new Error(`missing ${s}`);
  return e;
}
function Gn() {
  const s = Array.from(document.querySelectorAll("dialog")).filter((e) => e.open);
  return s[s.length - 1] ?? null;
}
function qn(s) {
  return Array.from(s.querySelectorAll("button, a[href], input, select, textarea")).filter((e) => e.hasAttribute("disabled") || e.getAttribute("aria-hidden") === "true" ? !1 : e.tabIndex >= 0);
}
function $(s) {
  return P(s);
}
function nt(s, e) {
  if (e === null) {
    s.dataset.value !== "" && s.replaceChildren(), s.dataset.value = "";
    return;
  }
  const t = $(e);
  if (s.dataset.value !== t) {
    s.dataset.value = t, s.replaceChildren();
    for (const r of t) {
      const i = document.createElement("span");
      i.className = /\d/.test(r) ? "digit" : "mark", i.textContent = r, s.append(i);
    }
  }
}
function O(s, e) {
  y(s).style.backgroundImage = `url("${H(e)}")`;
}
function st() {
  const s = window.innerHeight > window.innerWidth, e = y("cabinet");
  e.dataset.orient = s ? "portrait" : "landscape";
  const t = s ? 720 : 1280, r = s ? 1280 : 720;
  e.style.width = `${t}px`, e.style.height = `${r}px`, e.style.backgroundImage = `url("${H(s ? k.cabinetP : k.cabinetL)}")`;
  const i = Math.min(window.innerWidth / t, window.innerHeight / r), a = (window.innerWidth - t * i) / 2, u = (window.innerHeight - r * i) / 2;
  e.style.transform = `translate(${a}px, ${u}px) scale(${i})`, O("cost-up", k.plus), O("cost-down", k.minus), O("turbo-btn", k.turbo), O("start-auto", k.auto), O("sound-btn", k.sound), O("music-btn", k.music), O("settings-open", k.gear), O("reveal", k.skip), O("stop-auto", k.stop), O("help-open", k.help), O("board-open", k.star);
  const d = document.getElementById("reel-sweep");
  d && (d.style.backgroundImage = `url("${H(k.streak)}")`);
  const c = document.getElementById("shock");
  c instanceof HTMLImageElement && (c.src = H(k.glowEmerald));
  for (const l of Array.from(document.querySelectorAll("#sparks img"))) l.src = H(k.sparkSmall);
  const m = document.getElementById("splash-art");
  m instanceof HTMLImageElement && (m.src = H(s ? k.splashP : k.splashL));
  const b = `url("${H(k.plaque)}")`, n = s ? "11px 12px" : "16px 18px";
  for (const l of Array.from(document.querySelectorAll(".led, #auto-status, #short, #banner")))
    l.style.borderStyle = "solid", l.style.borderWidth = n, l.style.borderImage = `${b} 78 90 fill / ${n} / 0 stretch`, l.style.background = "transparent";
  const o = s ? "10px 12px" : "12px 16px";
  for (const l of Array.from(document.querySelectorAll("#currency button")))
    l.style.borderStyle = "solid", l.style.borderWidth = o, l.style.borderImage = `${b} 78 90 fill / ${o} / 0 stretch`, l.style.background = "transparent";
  for (const l of Array.from(document.querySelectorAll("dialog")))
    l.style.borderImage = `${b} 70 84 fill / 22px 26px / 0 stretch`;
}
function rt() {
  const s = y("bulb-rim"), e = 36;
  if (s.childElementCount !== e) {
    s.replaceChildren();
    for (let i = 0; i < e; i += 1) {
      const a = document.createElement("span");
      a.className = "bulb", a.style.setProperty("--i", String(i));
      const u = document.createElement("img");
      u.alt = "", u.src = H(k.bulbOff);
      const d = document.createElement("img");
      d.alt = "", d.className = "on", d.src = H(k.bulbOn), a.append(u, d), s.append(a);
    }
  }
  const t = y("cabinet").dataset.orient === "portrait", r = [];
  if (t) {
    for (let i = 0; i < 20; i += 1) {
      const a = Math.PI * (1.08 + 0.84 * i / 19);
      r.push([360 + Math.cos(a) * 320, 250 + Math.sin(a) * 190]);
    }
    for (let i = 0; i < 16; i += 1) {
      const a = i / 16 * Math.PI * 2 - Math.PI / 2;
      r.push([360 + Math.cos(a) * 148, 806 + Math.sin(a) * 148]);
    }
  } else {
    for (let i = 0; i < 22; i += 1) {
      const a = Math.PI * (1.06 + 0.88 * i / 21);
      r.push([640 + Math.cos(a) * 590, 310 + Math.sin(a) * 260]);
    }
    for (let i = 0; i < 14; i += 1) {
      const a = i / 14 * Math.PI * 2 - Math.PI / 2;
      r.push([923 + Math.cos(a) * 158, 378 + Math.sin(a) * 158]);
    }
  }
  Array.from(s.children).forEach((i, a) => {
    const u = i, d = r[a] ?? r[0];
    u.style.left = `${d[0]}px`, u.style.top = `${d[1]}px`;
  });
}
function Vn(s) {
  const e = s.filter((t) => t !== null);
  return e.length === 0 ? "" : e.some((t) => t === "blank") ? "0" : String(e.reduce((t, r) => t + qe[r], 0));
}
let Re = "";
function Xn(s, e) {
  const t = y("fly"), r = !!(s && s.wheel && s.wheel.lit !== null && !s.wheel.spinning && !s.reduced), i = s?.lines.find((u) => u.label === "Wheel prize");
  if (r && i && i.amount !== null && t.dataset.value !== String(i.amount)) {
    t.dataset.value = String(i.amount), t.textContent = $(i.amount), t.hidden = !1;
    const u = document.getElementById("wheel-host"), d = t.offsetParent instanceof HTMLElement ? t.offsetParent : null, c = new DOMMatrix(getComputedStyle(e).transform).a || 1;
    if (u && d) {
      const b = u.getBoundingClientRect(), n = d.getBoundingClientRect();
      t.style.right = "auto", t.style.left = `${(b.left + b.width / 2 - n.left) / c - 36}px`, t.style.top = `${(b.top + b.height * 0.22 - n.top) / c}px`;
    }
    const m = document.getElementById("hero");
    if (m) {
      const b = t.getBoundingClientRect(), n = m.getBoundingClientRect();
      t.style.setProperty("--dx", `${(n.left + n.width / 2 - (b.left + b.width / 2)) / c}px`), t.style.setProperty("--dy", `${(n.top + n.height / 2 - (b.top + b.height / 2)) / c}px`);
    }
    t.classList.remove("go"), t.offsetWidth, t.classList.add("go");
    return;
  }
  r || s?.phase === "celebrating" || s?.phase === "resolving" || (t.dataset.value = "", t.hidden = !0, t.classList.remove("go"));
}
function Qn(s) {
  const e = y("cabinet"), t = s?.spinning.some(Boolean) ?? !1, r = !!(s && s.cueTier >= 2 && (s.phase === "celebrating" || s.phase === "resolving")), i = !!(s && !s.reduced && (s.plate === "super" || s.plate === "epic") && s.hero !== null && s.hero > 0 && (s.phase === "celebrating" || s.phase === "resolving"));
  e.dataset.energy = s?.reduced ? "idle" : r ? "win" : t ? "spin" : "idle", e.dataset.phase = s?.phase ?? "idle", e.dataset.shake = i ? "heavy" : "", Xn(s, e);
  const a = y("feature-banner"), u = y("build-digits"), d = y("build"), c = y("fly");
  if (!s || s.phase === "idle" || s.phase === "onboarding") {
    a.textContent = "", u.textContent = "", u.dataset.len = "", d.classList.remove("slam", "shock", "sparks"), Re = "", c.hidden = !0;
    return;
  }
  if (s.phase === "celebrating" || s.phase === "resolving") {
    a.textContent = "", u.textContent = "", d.classList.remove("slam", "shock", "sparks");
    return;
  }
  a.textContent = s.phase === "replace" ? "Replace" : s.phase === "bank" ? "Bank + Add" : s.phase === "wheel" ? "Wheel" : "";
  const m = Vn(s.tokens), b = m.length > (u.dataset.len?.length ?? 0);
  u.dataset.len = m;
  const n = s.modifier === "x2" ? 2 : s.modifier === "x5" ? 5 : s.modifier === "x10" ? 10 : 0, o = `${s.receiptId}:${s.modifier ?? ""}`;
  if (n > 1 && s.cueTier > 0 && s.reading !== null && !s.reduced)
    u.textContent = String(Number(s.reading) * n), b && u.classList.add("flash"), Re !== o && (Re = o, d.classList.remove("slam", "shock"), d.offsetWidth, d.classList.add("slam", "shock"));
  else if (s.phase === "bank") {
    const h = s.lines.find((g) => g.label === "Locked base")?.amount ?? 0, p = s.lines.filter((g) => g.label.startsWith("Added")).reduce((g, f) => g + (f.amount ?? 0), 0);
    u.textContent = h || p ? $(h + p) : m, b && u.classList.add("flash");
  } else {
    const h = s.spinning.some(Boolean) || s.tokens.some((p) => p === null);
    u.textContent = h ? m : "", b && h && u.classList.add("flash");
  }
  const l = s.tokens.every((h) => h !== null) && !!s.reading;
  d.classList.toggle("sparks", l && !s.reduced);
}
function Yn(s) {
  const e = Math.floor(s / 1e3), t = Math.floor(e / 60), r = e % 60;
  return `${t}:${r.toString().padStart(2, "0")}`;
}
async function jn() {
  const s = [
    new FontFace("Auric Serif", "url(assets/fonts/NotoSerif-Bold.ttf)", { weight: "700" }),
    new FontFace("Auric Sans", "url(assets/fonts/NotoSansDisplay-Bold.ttf)", { weight: "700" }),
    new FontFace("Auric Sans", "url(assets/fonts/NotoSansDisplay-Regular.ttf)", { weight: "400" })
  ];
  await Promise.all(s.map(async (e) => {
    try {
      await e.load(), document.fonts.add(e);
    } catch {
    }
  }));
}
function Ae(s, e) {
  const t = y("lines");
  t.replaceChildren();
  const r = s?.lines ?? [{ label: "Cost", amount: e, text: $(e), strike: !1 }], i = r.length === 1 && r[0]?.label === "Cost" ? [] : r;
  for (const d of i) {
    const c = document.createElement("div");
    c.className = d.strike ? "line strike" : "line";
    const m = document.createElement("span");
    m.textContent = d.label;
    const b = document.createElement("span");
    b.textContent = d.text, c.append(m, b), t.append(c);
  }
  const a = s == null || s.netText === "Net pending";
  nt(y("hero"), s?.hero ?? (a ? 0 : null));
  const u = document.getElementById("plate-amount");
  u && nt(u, s?.hero ?? null), y("total-label").textContent = s?.totalLabel ?? "Total", y("net").textContent = s?.netText ?? "Net pending", y("meter").textContent = s?.meterFlourish ? "10/10 energy flourish, no credit reward" : `${s?.meterFilled ?? 0}/10`;
}
function Un(s) {
  let e = he();
  try {
    e = Wt(s.get(Ke));
  } catch {
    e = he();
  }
  const t = y("handle");
  t.value = e.handle;
  const r = document.getElementById("board-star");
  r instanceof HTMLImageElement && (r.src = H(k.starIcon));
  const i = y("wordmark");
  i.src = H(k.logo);
  const a = document.getElementById("onboard-logo");
  a instanceof HTMLImageElement && (a.src = H(k.logo));
  const u = document.getElementById("help-logo");
  u instanceof HTMLImageElement && (u.src = H(k.logo));
  const d = document.getElementById("help-wheel");
  d instanceof HTMLImageElement && (d.src = H(k.wheelFace));
  const c = () => {
    const b = Xt(e), n = $t(b?.wins ?? 0);
    y("board-level").textContent = b ? `Level ${n.level} ${n.name}. Wins ${b.wins}. Biggest net ${$(b.biggestWin)}. Today's best net ${$(b.dayBest)}.` : `Level ${n.level} ${n.name}. No scored play yet.`;
    const o = y("board-body");
    o.replaceChildren();
    const l = [
      ["Biggest net", "biggestWin"],
      ["Highest session net", "highestSession"],
      ["Wins", "wins"],
      ["Today's best net", "dayBest"]
    ];
    for (const [g, f] of l) {
      const w = document.createElement("h3");
      w.textContent = g;
      const v = document.createElement("table");
      Qt(e.rows, f).forEach((A, M) => {
        const E = document.createElement("tr");
        for (const F of [String(M + 1), A.handle, f === "wins" ? String(A.wins) : $(A[f])]) {
          const R = document.createElement("td");
          R.textContent = F, E.append(R);
        }
        v.append(E);
      }), o.append(w, v);
    }
    const h = document.createElement("p"), p = Rt.filter((g) => e.achievements.includes(g.id)).map((g) => g.label);
    h.textContent = p.length ? p.join(", ") : "No achievements yet.", o.append(h);
  }, m = () => {
    try {
      s.set(Ke, Gt(e));
    } catch {
    }
  };
  return t.addEventListener("change", () => {
    e = { ...e, handle: lt(t.value) }, t.value = e.handle, m(), c();
  }), y("board-open").addEventListener("click", () => {
    c();
    const b = y("board-dialog");
    b.open || b.showModal(), queueMicrotask(() => y("board-close").focus());
  }), y("board-close").addEventListener("click", () => y("board-dialog").close()), c(), {
    note(b, n) {
      if (!b || n) return;
      const o = Vt(e, {
        id: b.id,
        net: b.net,
        cost: b.cost,
        sessionNet: b.sessionNet,
        modifier: b.modifier,
        flourish: b.flourish,
        at: Date.now()
      });
      o !== e && (e = o, m(), c());
    }
  };
}
function Zn() {
  const s = Wn(), e = Un(s.kv), t = new Ht((_) => {
    y("banner").hidden = !1, y("banner").textContent = _;
  });
  t.load();
  const r = new $n(), i = new Sn(Cn());
  let a = null, u = !1, d;
  d = new Bn(
    s.kv,
    s.locker,
    i,
    t,
    (_) => {
      a = _, r.render(_, _.cost), Ae(_, _.cost), y("balance").textContent = $(_.balanceShown), y("session").textContent = $(_.sessionNetShown), u && L();
    },
    (_) => {
      y("live").textContent = _;
    },
    performance.now(),
    s.storage,
    ke.matches
  ), u = !0, s.notice && K(s.notice), d.resetReason && K("Saved demo data could not be read, so the demo credits were reset.");
  const c = y("spin");
  let m = !1, b = !1, n = !1, o = "", l = 0, h = 0;
  function p(_) {
    const S = y("state-overlay");
    S.textContent = _, S.hidden = !1, S.classList.remove("show", "bye"), S.offsetWidth, S.classList.add("show"), window.clearTimeout(l), window.clearTimeout(h), l = window.setTimeout(() => {
      S.classList.add("bye"), h = window.setTimeout(() => {
        S.classList.contains("bye") && (S.hidden = !0, S.classList.remove("show", "bye"));
      }, 1e3);
    }, 1e3);
  }
  function g() {
    const _ = y("splash");
    _.hidden = !1, _.classList.remove("out"), queueMicrotask(() => y("splash-start").focus());
  }
  function f() {
    const _ = y("splash");
    _.classList.add("out"), window.setTimeout(() => {
      _.hidden = !0;
    }, 1e3);
  }
  let w = ot(), v = null, A = 0;
  c.addEventListener("pointerdown", (_) => {
    if (_.button === 0) {
      if (d.status().reveal) {
        n = !0, d.reveal(), L();
        return;
      }
      n = !1, m = !0, O("spin", k.spinPressed), w = Tt(performance.now()), v = null, window.clearInterval(A), A = window.setInterval(() => {
        w = Et(w, performance.now());
      }, 40);
    }
  }), c.addEventListener("pointerup", (_) => {
    window.clearInterval(A);
    const S = _.target === c || c.contains(_.target);
    m = !1;
    const I = It(w, S);
    w = I.hold, v = I.action, window.setTimeout(() => {
      v = null;
    }, 0);
  }), c.addEventListener("pointercancel", () => {
    window.clearInterval(A), w = be(w), v = "none";
  }), c.addEventListener("pointerleave", () => {
    w.phase !== "idle" && (w = be(w), v = "none");
  }), c.addEventListener("blur", () => {
    window.clearInterval(A), w = be(w);
  }), c.addEventListener("click", () => {
    if (n || d.status().reveal) {
      n = !1, d.status().reveal && d.reveal(), L();
      return;
    }
    const _ = Lt(v);
    v = null, _ === "spin" && d.spin(), _ === "autoplay" && (d.startAuto(d.status().autoplayCount), p("Auto Spin Enabled")), L();
  }), c.addEventListener("keydown", (_) => {
    _.key === "Escape" && (w = be(w), v = "none");
  }), y("reveal").addEventListener("click", () => {
    d.reveal(), L();
  }), document.addEventListener("pointerdown", (_) => {
    if (!d.status().reveal) return;
    const S = _.target;
    S instanceof Element && (S.closest("dialog, #fx-panel, #fx-toggle, #reveal, #spin") || (d.reveal(), L()));
  }), y("start-auto").addEventListener("click", () => {
    d.startAuto(d.status().autoplayCount), p("Auto Spin Enabled"), L();
  }), y("stop-auto").addEventListener("click", () => {
    d.stopAutoplay(), p("Auto Spin Disabled"), L();
  });
  const M = () => {
    if (d.status().locked) return;
    y("reset-dialog").showModal(), queueMicrotask(() => y("reset-cancel").focus());
  };
  y("reset").addEventListener("click", M), y("short-reset").addEventListener("click", M), y("reset-confirm").addEventListener("click", () => {
    d.reset().then(() => {
      y("reset-dialog").close(), a = null, Ae(null, d.status().cost), L();
    });
  }), y("reset-cancel").addEventListener("click", () => y("reset-dialog").close());
  let E = null;
  y("help-open").addEventListener("click", () => {
    E = y("help-open"), J();
  }), y("help-close").addEventListener("click", () => y("help-dialog").close()), y("help-dialog").addEventListener("close", () => {
    if (d.noteHelp(!1), !d.status().onboarded) {
      g();
      return;
    }
    (E ?? c).focus();
  }), y("onboard-help").addEventListener("click", () => {
    E = y("onboard-start"), J();
  }), y("onboard-start").addEventListener("click", () => {
    d.finishOnboarding(), y("onboard-dialog").close(), f(), L(), c.focus();
  }), y("splash-start").addEventListener("click", () => {
    d.finishOnboarding(), f(), L(), c.focus();
  });
  const F = (_) => {
    const S = Array.from(document.querySelectorAll('input[name="cost"]')), I = S.findIndex((q) => q.checked), T = S[I + _];
    !T || T.disabled || (T.checked = !0, T.dispatchEvent(new Event("change", { bubbles: !0 })));
  };
  y("cost-down").addEventListener("click", () => F(-1)), y("cost-up").addEventListener("click", () => F(1)), y("exit").addEventListener("click", () => {
  });
  for (const _ of Array.from(document.querySelectorAll('input[name="cost"]')))
    _.addEventListener("change", () => {
      _.checked && (d.setCost(Number(_.value)), L());
    });
  y("turbo").addEventListener("change", (_) => {
    d.setSpeed(_.target.checked ? 1 : 0);
  }), y("muted").addEventListener("change", (_) => {
    d.setAudioPrefs({ muted: _.target.checked }), C();
  }), y("music").addEventListener("change", (_) => {
    d.setAudioPrefs({ music: _.target.checked }), C();
  }), y("effects").addEventListener("change", (_) => {
    d.setAudioPrefs({ effects: _.target.checked }), C();
  }), y("reduced").addEventListener("change", (_) => {
    const S = _.target.value;
    d.setReduced(S === "device" ? null : S === "reduce"), L();
  }), y("auto-count").addEventListener("change", (_) => {
    d.setAutoCount(Number(_.target.value));
  }), document.addEventListener("keydown", (_) => {
    const S = Gn();
    if (S) {
      if (_.key === "Escape") {
        _.preventDefault(), S.close();
        return;
      }
      if (_.key === "Tab") {
        const T = qn(S);
        if (T.length > 0) {
          _.preventDefault();
          const q = T.indexOf(document.activeElement), U = _.shiftKey ? -1 : 1;
          T[(q + U + T.length) % T.length].focus();
        }
      }
      return;
    }
    if (_.key !== " " && _.key !== "Enter") return;
    const I = _.target;
    !I || I.closest("dialog, input, select, textarea, button, a") || I.closest("#play-surface") && (_.preventDefault(), d.spin(), L());
  });
  const R = () => t.unlock();
  window.addEventListener("pointerdown", R, { once: !1 }), window.addEventListener("keydown", R), document.addEventListener("visibilitychange", () => {
    const _ = document.hidden;
    d.setHidden(_), t.setHidden(_), r.setHidden(_);
  }), window.addEventListener("blur", () => {
    d.setHidden(!0), t.setHidden(!0);
  }), window.addEventListener("focus", () => {
    document.hidden || (d.setHidden(!1), t.setHidden(!1));
  }), ke.addEventListener("change", () => {
    d.osReduced = ke.matches;
  });
  let x = performance.now(), Q = -1;
  const Y = (_) => {
    const S = Math.min(100, _ - x);
    x = _, d.advance(S);
    const I = Math.floor(d.status().activeMs / 1e3);
    I !== Q && (Q = I, y("time").textContent = Yn(d.status().activeMs)), r.tick(a), L(), requestAnimationFrame(Y);
  };
  function K(_) {
    const S = y("banner");
    S.hidden = !1, S.textContent = _;
  }
  function J() {
    d.noteHelp(!0);
    const _ = y("onboard-dialog");
    _.open && _.close();
    const S = y("help-dialog");
    S.open || S.showModal(), S.scrollTop = 0, queueMicrotask(() => y("help-title").focus());
  }
  function C() {
    const _ = d.status();
    t.setPrefs(_.muted, _.music, _.effects), t.setPresenting(_.locked);
  }
  function L() {
    const _ = d.status();
    y("session").textContent = $(a?.sessionNetShown ?? _.sessionNet), y("balance").textContent = $(a?.balanceShown ?? _.balance);
    const S = _.reveal;
    c.disabled = !_.onboarded || _.locked && !S;
    const I = m ? k.spinPressed : c.disabled ? k.spinDisabled : k.spin;
    O("spin", I);
    const T = y("reveal");
    T.disabled = !S, O("reveal", b ? k.skipPressed : S ? k.skip : k.skipDisabled), y("start-auto").disabled = _.locked || !_.onboarded, y("reset").disabled = _.locked, y("stop-auto").disabled = _.autoRemaining === null;
    for (const Pe of Array.from(document.querySelectorAll('input[name="cost"]')))
      Pe.disabled = _.locked, Pe.checked = Number(Pe.value) === _.cost;
    y("turbo").checked = _.turbo, y("turbo").disabled = _.locked, y("turbo-btn").setAttribute("aria-pressed", String(_.turbo)), y("turbo-btn").disabled = _.locked, y("sound-btn").setAttribute("aria-pressed", String(!_.muted)), y("music-btn").setAttribute("aria-pressed", String(_.music)), y("muted").checked = _.muted, y("music").checked = _.music, y("effects").checked = _.effects;
    const q = y("reduced");
    q.value = _.reducedMotion === null ? "device" : _.reducedMotion ? "reduce" : "allow", y("auto-count").value = String(_.autoplayCount), y("auto-count").disabled = _.locked;
    const U = y("auto-status");
    U.textContent = _.autoRemaining === null ? "Autoplay off" : `Autoplay ${_.autoRemaining} left`;
    const ne = _.message ?? _.warning ?? "", z = !_.locked && _.balance < _.cost || ne.includes("Not enough");
    U.hidden = z;
    const de = y("note");
    de.textContent = z ? "" : ne, de.hidden = z || ne === "", y("short").hidden = !z, y("short-text").textContent = ne || "Insufficient balance", z ? o !== "low" && (o = "low", p("Insufficient balance")) : o === "low" && (o = ""), y("short-reset").hidden = !d.allowsReset(), y("reset").hidden = !d.allowsReset(), C(), e.note(d.receiptView(), _.locked), y("cost-read").textContent = $(_.cost), y("cost-down").disabled = _.locked || _.cost <= 10, y("cost-up").disabled = _.locked || _.cost >= 100;
    const yt = _.reducedMotion === !0 || _.reducedMotion === null && ke.matches;
    y("cabinet").dataset.motion = (_.locked ? a?.reduced : yt) ? "reduce" : "allow", t.setReelLoop(!!(a && a.spinning.some(Boolean) && !a.reduced)), Qn(a);
  }
  function ee() {
    const _ = y("help-body");
    for (const S of nn()) {
      const I = document.createElement("h3");
      I.textContent = S.heading;
      const T = document.createElement("p");
      T.textContent = S.body, _.append(I, T);
    }
  }
  ee(), st(), rt(), window.addEventListener("resize", () => {
    st(), rt(), r.resize();
  }), Ae(null, d.status().cost), y("stage").addEventListener("auric-land", () => {
    const _ = y("build-digits");
    _.classList.remove("flash"), _.offsetWidth, _.classList.add("flash");
  });
  const ge = (_, S) => {
    y(S).addEventListener("click", () => {
      const I = y(_);
      I.disabled || (I.checked = !I.checked, I.dispatchEvent(new Event("change", { bubbles: !0 })));
    });
  };
  y("turbo-btn").addEventListener("click", () => {
    if (d.status().locked) return;
    const _ = (d.status().speed + 1) % 3;
    d.setSpeed(_), p(_ === 2 ? "Super Turbo Spin Enabled" : _ === 1 ? "Turbo Spin Enabled" : "Turbo Spin Disabled"), L();
  }), ge("muted", "sound-btn"), ge("music", "music-btn");
  const D = (_, S, I) => {
    const T = y(_);
    T.addEventListener("pointerdown", () => O(_, I));
    const q = () => O(_, S);
    T.addEventListener("pointerup", q), T.addEventListener("pointercancel", q);
  };
  D("cost-down", k.minus, k.minusPressed), D("cost-up", k.plus, k.plusPressed), D("turbo-btn", k.turbo, k.turboPressed), D("start-auto", k.auto, k.autoPressed), D("stop-auto", k.stop, k.stopPressed), D("sound-btn", k.sound, k.soundPressed), D("music-btn", k.music, k.musicPressed), D("settings-open", k.gear, k.gearPressed), D("help-open", k.help, k.helpPressed), D("board-open", k.star, k.starPressed);
  const le = y("reveal");
  le.addEventListener("pointerdown", () => {
    b = !0;
  });
  const Ue = () => {
    b = !1;
  };
  le.addEventListener("pointerup", Ue), le.addEventListener("pointercancel", Ue), y("settings-open").addEventListener("click", () => {
    const _ = y("settings-dialog");
    _.open || _.showModal(), queueMicrotask(() => y("settings-close").focus());
  }), y("settings-close").addEventListener("click", () => y("settings-dialog").close()), jn().then(() => r.mount(y("stage"))).then(() => {
    document.getElementById("boot")?.remove(), r.resize(), r.tick(a), a && r.render(a, a.cost);
  });
  const te = (_, S) => ({
    label: _,
    run: () => {
      let I = 0;
      const T = ut({
        nextInt(z) {
          const de = S[I++] ?? 0;
          return de >= z ? 0 : de;
        }
      }, 10, 0), q = We(T, "normal", "fx"), U = Ee({
        outcome: T,
        schedule: q,
        elapsed: q.totalMs,
        balanceAfter: 0,
        sessionNetAfter: 0
      }), ne = X(T.net, T.cost), _e = {
        ...U,
        phase: T.modifier === "wheel" ? "wheel" : U.plate ? "celebrating" : U.phase,
        hero: T.gross,
        cueTier: ne
      };
      a = _e, r.render(_e, T.cost), Ae(_e, T.cost);
    }
  });
  kt(() => [
    te("Small", [B("10"), B("10"), B("0"), ie("x1")]),
    te("Big", [B("00"), B("00"), B("0"), ie("x1")]),
    te("Mega", [B("00"), B("10"), B("10"), ie("x5")]),
    te("Super", [B("00"), B("00"), B("00"), ie("x5")]),
    te("Epic", [B("00"), B("00"), B("00"), ie("x10")]),
    te("Wheel", [B("0"), B("1"), B("0"), ie("wheel"), 7]),
    { label: "Low balance", run: () => p("Insufficient balance") }
  ], "#e0b15a"), L(), new URLSearchParams(location.search).get("brand") || (y("exit").hidden = !0), d.status().onboarded || g(), requestAnimationFrame(Y), window.addEventListener("pagehide", () => {
    d.destroy().then(() => {
      t.destroy(), r.destroy();
    });
  });
}
Zn();
