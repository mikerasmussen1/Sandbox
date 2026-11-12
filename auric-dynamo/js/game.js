const I = {
  cabinetL: "assets/art/raster/cabinet-landscape.webp",
  cabinetP: "assets/art/raster/cabinet-portrait.webp",
  logo: "assets/art/raster/logo.webp",
  wheel: "assets/art/raster/wheel.webp",
  pointer: "assets/art/raster/wheel-pointer.webp",
  coin: "assets/art/raster/coin.webp",
  spin: "assets/art/raster/btn-spin.webp",
  plus: "assets/art/raster/btn-plus.webp",
  minus: "assets/art/raster/btn-minus.webp",
  turbo: "assets/art/raster/btn-turbo.webp",
  auto: "assets/art/raster/btn-auto.webp",
  sound: "assets/art/raster/btn-sound.webp",
  music: "assets/art/raster/btn-music.webp",
  gear: "assets/art/raster/btn-gear.webp",
  skip: "assets/art/raster/btn-skip.webp",
  stop: "assets/art/raster/btn-stop.webp",
  help: "assets/art/raster/btn-help.webp",
  star: "assets/art/raster/btn-star.webp",
  plaque: "assets/art/raster/plaque.webp",
  wheelFace: "assets/art/raster/wheel-face.webp",
  plates: {
    2: "assets/art/raster/plate-big.webp",
    3: "assets/art/raster/plate-mega.webp",
    4: "assets/art/raster/plate-epic.webp"
  },
  symbols: {
    blank: "assets/art/raster/sym-blank.webp",
    0: "assets/art/raster/sym-0.webp",
    1: "assets/art/raster/sym-1.webp",
    5: "assets/art/raster/sym-5.webp",
    10: "assets/art/raster/sym-10.webp",
    "00": "assets/art/raster/sym-00.webp",
    x1: "assets/art/raster/sym-1x.webp",
    x2: "assets/art/raster/sym-2x.webp",
    x5: "assets/art/raster/sym-5x.webp",
    x10: "assets/art/raster/sym-10x.webp",
    replace: "assets/art/raster/sym-replace.webp",
    bank: "assets/art/raster/sym-bank.webp",
    wheel: "assets/art/raster/sym-wheel.webp"
  }
};
function D(s) {
  const e = globalThis.__auricAsset;
  return typeof e == "function" ? e(s) : new URL(s, window.location.href).href;
}
function it() {
  try {
    return new URLSearchParams(location.search).has("fx");
  } catch {
    return !1;
  }
}
function ot(s, e = "#2fd0ff") {
  if (!it() || document.getElementById("fx-panel")) return;
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
  let h = !1;
  i.onclick = () => {
    if (!h) {
      const d = at(s);
      if (h = d.length > 0, a.textContent = "", !h) {
        const c = document.createElement("div");
        c.style.cssText = "max-width:220px;white-space:normal;padding:4px 6px;color:#9fb0cc;font-weight:500", c.textContent = "The game has not finished starting. Some games need a lobby (open with ?brand=). Reopen this panel once it has.", a.appendChild(c);
      }
      for (const c of d) {
        const f = document.createElement("button");
        f.type = "button", f.textContent = c.label, f.onclick = () => {
          try {
            Promise.resolve(c.run()).catch((w) => console.error("[fx]", c.label, w));
          } catch (w) {
            console.error("[fx]", c.label, w);
          }
        }, a.appendChild(f);
      }
    }
    a.classList.toggle("open");
  };
}
function at(s) {
  try {
    return s();
  } catch (e) {
    return console.error("[fx] building the case list failed", e), [];
  }
}
const pe = {
  reelStops: [650, 800, 950],
  assemble: 250,
  inhale: 150,
  modifier: 300,
  feature: { replace: 900, bank: 1800, wheel: 2400, none: 0 },
  count: [0, 400, 750, 1100, 1500],
  resolve: 350,
  collection: 400,
  cap: 9e3,
  turboScale: 0.4,
  reduced: 150,
  fadeMs: 80,
  cycleFloorMs: 3e3,
  holdMs: 600
}, ce = 2e3 / 2400, We = 2, lt = pe.holdMs, dt = pe.cycleFloorMs, ct = [10, 25, 50];
function Ae(s) {
  return ct.includes(s);
}
function Ge() {
  return { phase: "idle", downAt: 0 };
}
function ut(s) {
  return { phase: "pressing", downAt: s };
}
function ht(s, e) {
  return s.phase === "pressing" && e - s.downAt >= lt ? { ...s, phase: "armed" } : s;
}
function se(s) {
  return s.phase === "idle" ? s : { ...s, phase: "cancelled" };
}
function ft(s, e) {
  const t = Ge();
  return s.phase === "idle" || s.phase === "cancelled" || !e ? { hold: t, action: "none" } : s.phase === "armed" ? { hold: t, action: "autoplay" } : { hold: t, action: "spin" };
}
function pt(s, e) {
  return s !== null ? s : "spin";
}
function mt(s, e) {
  return Math.max(e, s + dt);
}
function _t(s, e) {
  return s ? s.modifier === "replace" || s.modifier === "bank" || s.modifier === "wheel" ? s.modifier : s.collectionFlourish ? "collection" : e.remaining <= 0 ? "count" : null : null;
}
var Z = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, _e = {};
var Ne;
function gt() {
  return Ne || (Ne = 1, (function(s) {
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
          if (n = parseFloat(n), o.ctx || w(), typeof n < "u" && n >= 0 && n <= 1) {
            if (o._volume = n, o._muted)
              return o;
            o.usingWebAudio && o.masterGain.gain.setValueAtTime(n, t.ctx.currentTime);
            for (var l = 0; l < o._howls.length; l++)
              if (!o._howls[l]._webAudio)
                for (var u = o._howls[l]._getSoundIds(), _ = 0; _ < u.length; _++) {
                  var m = o._howls[l]._soundById(u[_]);
                  m && m._node && (m._node.volume = m._volume * n);
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
          o.ctx || w(), o._muted = n, o.usingWebAudio && o.masterGain.gain.setValueAtTime(n ? 0 : o._volume, t.ctx.currentTime);
          for (var l = 0; l < o._howls.length; l++)
            if (!o._howls[l]._webAudio)
              for (var u = o._howls[l]._getSoundIds(), _ = 0; _ < u.length; _++) {
                var m = o._howls[l]._soundById(u[_]);
                m && m._node && (m._node.muted = n ? !0 : m._muted);
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
          return n.usingWebAudio && n.ctx && typeof n.ctx.close < "u" && (n.ctx.close(), n.ctx = null, w()), n;
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
          var l = o.canPlayType("audio/mpeg;").replace(/^no$/, ""), u = n._navigator ? n._navigator.userAgent : "", _ = u.match(/OPR\/(\d+)/g), m = _ && parseInt(_[0].split("/")[1], 10) < 33, p = u.indexOf("Safari") !== -1 && u.indexOf("Chrome") === -1, y = u.match(/Version\/(.*?) /), v = p && y && parseInt(y[1], 10) < 15;
          return n._codecs = {
            mp3: !!(!m && (l || o.canPlayType("audio/mp3;").replace(/^no$/, ""))),
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
                  var u = new Audio();
                  u._unlocked = !0, n._releaseHtml5Audio(u);
                } catch {
                  n.noAudio = !0;
                  break;
                }
              for (var _ = 0; _ < n._howls.length; _++)
                if (!n._howls[_]._webAudio)
                  for (var m = n._howls[_]._getSoundIds(), p = 0; p < m.length; p++) {
                    var y = n._howls[_]._soundById(m[p]);
                    y && y._node && !y._node._unlocked && (y._node._unlocked = !0, y._node.load());
                  }
              n._autoResume();
              var v = n.ctx.createBufferSource();
              v.buffer = n._scratchBuffer, v.connect(n.ctx.destination), typeof v.start > "u" ? v.noteOn(0) : v.start(0), typeof n.ctx.resume == "function" && n.ctx.resume(), v.onended = function() {
                v.disconnect(0), n._audioUnlocked = !0, document.removeEventListener("touchstart", o, !0), document.removeEventListener("touchend", o, !0), document.removeEventListener("click", o, !0), document.removeEventListener("keydown", o, !0);
                for (var k = 0; k < n._howls.length; k++)
                  n._howls[k]._emit("unlock");
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
                var u = function() {
                  n.state = "suspended", n._resumeAfterSuspend && (delete n._resumeAfterSuspend, n._autoResume());
                };
                n.ctx.suspend().then(u, u);
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
          return t.ctx || w(), o._autoplay = n.autoplay || !1, o._format = typeof n.format != "string" ? n.format : [n.format], o._html5 = n.html5 || !1, o._muted = n.mute || !1, o._loop = n.loop || !1, o._pool = n.pool || 5, o._preload = typeof n.preload == "boolean" || n.preload === "metadata" ? n.preload : !0, o._rate = n.rate || 1, o._sprite = n.sprite || {}, o._src = typeof n.src != "string" ? n.src : [n.src], o._volume = n.volume !== void 0 ? n.volume : 1, o._xhr = {
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
            var u, _;
            if (n._format && n._format[l])
              u = n._format[l];
            else {
              if (_ = n._src[l], typeof _ != "string") {
                n._emit("loaderror", null, "Non-string found in selected audio sources - ignoring.");
                continue;
              }
              u = /^data:audio\/([^;,]+);/i.exec(_), u || (u = /\.([^.]+)$/.exec(_.split("?", 1)[0])), u && (u = u[1].toLowerCase());
            }
            if (u || console.warn('No file extension was found. Consider using the "format" property or specify an extension.'), u && t.codecs(u)) {
              o = n._src[l];
              break;
            }
          }
          if (!o) {
            n._emit("loaderror", null, "No codec support for selected audio sources.");
            return;
          }
          return n._src = o, n._state = "loading", window.location.protocol === "https:" && o.slice(0, 5) === "http:" && (n._html5 = !0, n._webAudio = !1), new i(n), n._webAudio && h(n), n;
        },
        /**
         * Play a sound or resume previous playback.
         * @param  {String/Number} sprite   Sprite name for sprite playback or sound id to continue previous.
         * @param  {Boolean} internal Internal Use: true prevents event firing.
         * @return {Number}          Sound ID.
         */
        play: function(n, o) {
          var l = this, u = null;
          if (typeof n == "number")
            u = n, n = null;
          else {
            if (typeof n == "string" && l._state === "loaded" && !l._sprite[n])
              return null;
            if (typeof n > "u" && (n = "__default", !l._playLock)) {
              for (var _ = 0, m = 0; m < l._sounds.length; m++)
                l._sounds[m]._paused && !l._sounds[m]._ended && (_++, u = l._sounds[m]._id);
              _ === 1 ? n = null : u = null;
            }
          }
          var p = u ? l._soundById(u) : l._inactiveSound();
          if (!p)
            return null;
          if (u && !n && (n = p._sprite || "__default"), l._state !== "loaded") {
            p._sprite = n, p._ended = !1;
            var y = p._id;
            return l._queue.push({
              event: "play",
              action: function() {
                l.play(y);
              }
            }), y;
          }
          if (u && !p._paused)
            return o || l._loadQueue("play"), p._id;
          l._webAudio && t._autoResume();
          var v = Math.max(0, p._seek > 0 ? p._seek : l._sprite[n][0] / 1e3), k = Math.max(0, (l._sprite[n][0] + l._sprite[n][1]) / 1e3 - v), M = k * 1e3 / Math.abs(p._rate), T = l._sprite[n][0] / 1e3, P = (l._sprite[n][0] + l._sprite[n][1]) / 1e3;
          p._sprite = n, p._ended = !1;
          var C = function() {
            p._paused = !1, p._seek = v, p._start = T, p._stop = P, p._loop = !!(p._loop || l._sprite[n][2]);
          };
          if (v >= P) {
            l._ended(p);
            return;
          }
          var g = p._node;
          if (l._webAudio) {
            var A = function() {
              l._playLock = !1, C(), l._refreshBuffer(p);
              var E = p._muted || l._muted ? 0 : p._volume;
              g.gain.setValueAtTime(E, t.ctx.currentTime), p._playStart = t.ctx.currentTime, typeof g.bufferSource.start > "u" ? p._loop ? g.bufferSource.noteGrainOn(0, v, 86400) : g.bufferSource.noteGrainOn(0, v, k) : p._loop ? g.bufferSource.start(0, v, 86400) : g.bufferSource.start(0, v, k), M !== 1 / 0 && (l._endTimers[p._id] = setTimeout(l._ended.bind(l, p), M)), o || setTimeout(function() {
                l._emit("play", p._id), l._loadQueue();
              }, 0);
            };
            t.state === "running" && t.ctx.state !== "interrupted" ? A() : (l._playLock = !0, l.once("resume", A), l._clearTimer(p._id));
          } else {
            var S = function() {
              g.currentTime = v, g.muted = p._muted || l._muted || t._muted || g.muted, g.volume = p._volume * t.volume(), g.playbackRate = p._rate;
              try {
                var E = g.play();
                if (E && typeof Promise < "u" && (E instanceof Promise || typeof E.then == "function") ? (l._playLock = !0, C(), E.then(function() {
                  l._playLock = !1, g._unlocked = !0, o ? l._loadQueue() : l._emit("play", p._id);
                }).catch(function() {
                  l._playLock = !1, l._emit("playerror", p._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction."), p._ended = !0, p._paused = !0;
                })) : o || (l._playLock = !1, C(), l._emit("play", p._id)), g.playbackRate = p._rate, g.paused) {
                  l._emit("playerror", p._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
                  return;
                }
                n !== "__default" || p._loop ? l._endTimers[p._id] = setTimeout(l._ended.bind(l, p), M) : (l._endTimers[p._id] = function() {
                  l._ended(p), g.removeEventListener("ended", l._endTimers[p._id], !1);
                }, g.addEventListener("ended", l._endTimers[p._id], !1));
              } catch (B) {
                l._emit("playerror", p._id, B);
              }
            };
            g.src === "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA" && (g.src = l._src, g.load());
            var x = window && window.ejecta || !g.readyState && t._navigator.isCocoonJS;
            if (g.readyState >= 3 || x)
              S();
            else {
              l._playLock = !0, l._state = "loading";
              var N = function() {
                l._state = "loaded", S(), g.removeEventListener(t._canPlayEvent, N, !1);
              };
              g.addEventListener(t._canPlayEvent, N, !1), l._clearTimer(p._id);
            }
          }
          return p._id;
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
          for (var l = o._getSoundIds(n), u = 0; u < l.length; u++) {
            o._clearTimer(l[u]);
            var _ = o._soundById(l[u]);
            if (_ && !_._paused && (_._seek = o.seek(l[u]), _._rateSeek = 0, _._paused = !0, o._stopFade(l[u]), _._node))
              if (o._webAudio) {
                if (!_._node.bufferSource)
                  continue;
                typeof _._node.bufferSource.stop > "u" ? _._node.bufferSource.noteOff(0) : _._node.bufferSource.stop(0), o._cleanBuffer(_._node);
              } else (!isNaN(_._node.duration) || _._node.duration === 1 / 0) && _._node.pause();
            arguments[1] || o._emit("pause", _ ? _._id : null);
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
          for (var u = l._getSoundIds(n), _ = 0; _ < u.length; _++) {
            l._clearTimer(u[_]);
            var m = l._soundById(u[_]);
            m && (m._seek = m._start || 0, m._rateSeek = 0, m._paused = !0, m._ended = !0, l._stopFade(u[_]), m._node && (l._webAudio ? m._node.bufferSource && (typeof m._node.bufferSource.stop > "u" ? m._node.bufferSource.noteOff(0) : m._node.bufferSource.stop(0), l._cleanBuffer(m._node)) : (!isNaN(m._node.duration) || m._node.duration === 1 / 0) && (m._node.currentTime = m._start || 0, m._node.pause(), m._node.duration === 1 / 0 && l._clearSound(m._node))), o || l._emit("stop", m._id));
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
          for (var u = l._getSoundIds(o), _ = 0; _ < u.length; _++) {
            var m = l._soundById(u[_]);
            m && (m._muted = n, m._interval && l._stopFade(m._id), l._webAudio && m._node ? m._node.gain.setValueAtTime(n ? 0 : m._volume, t.ctx.currentTime) : m._node && (m._node.muted = t._muted ? !0 : n), l._emit("mute", m._id));
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
          var n = this, o = arguments, l, u;
          if (o.length === 0)
            return n._volume;
          if (o.length === 1 || o.length === 2 && typeof o[1] > "u") {
            var _ = n._getSoundIds(), m = _.indexOf(o[0]);
            m >= 0 ? u = parseInt(o[0], 10) : l = parseFloat(o[0]);
          } else o.length >= 2 && (l = parseFloat(o[0]), u = parseInt(o[1], 10));
          var p;
          if (typeof l < "u" && l >= 0 && l <= 1) {
            if (n._state !== "loaded" || n._playLock)
              return n._queue.push({
                event: "volume",
                action: function() {
                  n.volume.apply(n, o);
                }
              }), n;
            typeof u > "u" && (n._volume = l), u = n._getSoundIds(u);
            for (var y = 0; y < u.length; y++)
              p = n._soundById(u[y]), p && (p._volume = l, o[2] || n._stopFade(u[y]), n._webAudio && p._node && !p._muted ? p._node.gain.setValueAtTime(l, t.ctx.currentTime) : p._node && !p._muted && (p._node.volume = l * t.volume()), n._emit("volume", p._id));
          } else
            return p = u ? n._soundById(u) : n._sounds[0], p ? p._volume : 0;
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
        fade: function(n, o, l, u) {
          var _ = this;
          if (_._state !== "loaded" || _._playLock)
            return _._queue.push({
              event: "fade",
              action: function() {
                _.fade(n, o, l, u);
              }
            }), _;
          n = Math.min(Math.max(0, parseFloat(n)), 1), o = Math.min(Math.max(0, parseFloat(o)), 1), l = parseFloat(l), _.volume(n, u);
          for (var m = _._getSoundIds(u), p = 0; p < m.length; p++) {
            var y = _._soundById(m[p]);
            if (y) {
              if (u || _._stopFade(m[p]), _._webAudio && !y._muted) {
                var v = t.ctx.currentTime, k = v + l / 1e3;
                y._volume = n, y._node.gain.setValueAtTime(n, v), y._node.gain.linearRampToValueAtTime(o, k);
              }
              _._startFadeInterval(y, n, o, l, m[p], typeof u > "u");
            }
          }
          return _;
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
        _startFadeInterval: function(n, o, l, u, _, m) {
          var p = this, y = o, v = l - o, k = Math.abs(v / 0.01), M = Math.max(4, k > 0 ? u / k : u), T = Date.now();
          n._fadeTo = l, n._interval = setInterval(function() {
            var P = (Date.now() - T) / u;
            T = Date.now(), y += v * P, y = Math.round(y * 100) / 100, v < 0 ? y = Math.max(l, y) : y = Math.min(l, y), p._webAudio ? n._volume = y : p.volume(y, n._id, !0), m && (p._volume = y), (l < o && y <= l || l > o && y >= l) && (clearInterval(n._interval), n._interval = null, n._fadeTo = null, p.volume(l, n._id), p._emit("fade", n._id));
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
          var n = this, o = arguments, l, u, _;
          if (o.length === 0)
            return n._loop;
          if (o.length === 1)
            if (typeof o[0] == "boolean")
              l = o[0], n._loop = l;
            else
              return _ = n._soundById(parseInt(o[0], 10)), _ ? _._loop : !1;
          else o.length === 2 && (l = o[0], u = parseInt(o[1], 10));
          for (var m = n._getSoundIds(u), p = 0; p < m.length; p++)
            _ = n._soundById(m[p]), _ && (_._loop = l, n._webAudio && _._node && _._node.bufferSource && (_._node.bufferSource.loop = l, l && (_._node.bufferSource.loopStart = _._start || 0, _._node.bufferSource.loopEnd = _._stop, n.playing(m[p]) && (n.pause(m[p], !0), n.play(m[p], !0)))));
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
          var n = this, o = arguments, l, u;
          if (o.length === 0)
            u = n._sounds[0]._id;
          else if (o.length === 1) {
            var _ = n._getSoundIds(), m = _.indexOf(o[0]);
            m >= 0 ? u = parseInt(o[0], 10) : l = parseFloat(o[0]);
          } else o.length === 2 && (l = parseFloat(o[0]), u = parseInt(o[1], 10));
          var p;
          if (typeof l == "number") {
            if (n._state !== "loaded" || n._playLock)
              return n._queue.push({
                event: "rate",
                action: function() {
                  n.rate.apply(n, o);
                }
              }), n;
            typeof u > "u" && (n._rate = l), u = n._getSoundIds(u);
            for (var y = 0; y < u.length; y++)
              if (p = n._soundById(u[y]), p) {
                n.playing(u[y]) && (p._rateSeek = n.seek(u[y]), p._playStart = n._webAudio ? t.ctx.currentTime : p._playStart), p._rate = l, n._webAudio && p._node && p._node.bufferSource ? p._node.bufferSource.playbackRate.setValueAtTime(l, t.ctx.currentTime) : p._node && (p._node.playbackRate = l);
                var v = n.seek(u[y]), k = (n._sprite[p._sprite][0] + n._sprite[p._sprite][1]) / 1e3 - v, M = k * 1e3 / Math.abs(p._rate);
                (n._endTimers[u[y]] || !p._paused) && (n._clearTimer(u[y]), n._endTimers[u[y]] = setTimeout(n._ended.bind(n, p), M)), n._emit("rate", p._id);
              }
          } else
            return p = n._soundById(u), p ? p._rate : n._rate;
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
          var n = this, o = arguments, l, u;
          if (o.length === 0)
            n._sounds.length && (u = n._sounds[0]._id);
          else if (o.length === 1) {
            var _ = n._getSoundIds(), m = _.indexOf(o[0]);
            m >= 0 ? u = parseInt(o[0], 10) : n._sounds.length && (u = n._sounds[0]._id, l = parseFloat(o[0]));
          } else o.length === 2 && (l = parseFloat(o[0]), u = parseInt(o[1], 10));
          if (typeof u > "u")
            return 0;
          if (typeof l == "number" && (n._state !== "loaded" || n._playLock))
            return n._queue.push({
              event: "seek",
              action: function() {
                n.seek.apply(n, o);
              }
            }), n;
          var p = n._soundById(u);
          if (p)
            if (typeof l == "number" && l >= 0) {
              var y = n.playing(u);
              y && n.pause(u, !0), p._seek = l, p._ended = !1, n._clearTimer(u), !n._webAudio && p._node && !isNaN(p._node.duration) && (p._node.currentTime = l);
              var v = function() {
                y && n.play(u, !0), n._emit("seek", u);
              };
              if (y && !n._webAudio) {
                var k = function() {
                  n._playLock ? setTimeout(k, 0) : v();
                };
                setTimeout(k, 0);
              } else
                v();
            } else if (n._webAudio) {
              var M = n.playing(u) ? t.ctx.currentTime - p._playStart : 0, T = p._rateSeek ? p._rateSeek - p._seek : 0;
              return p._seek + (T + M * Math.abs(p._rate));
            } else
              return p._node.currentTime;
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
          for (var u = 0; u < o._sounds.length; u++)
            if (!o._sounds[u]._paused)
              return !0;
          return !1;
        },
        /**
         * Get the duration of this sound. Passing a sound id will return the sprite duration.
         * @param  {Number} id The sound id to check. If none is passed, return full source duration.
         * @return {Number} Audio duration in seconds.
         */
        duration: function(n) {
          var o = this, l = o._duration, u = o._soundById(n);
          return u && (l = o._sprite[u._sprite][1] / 1e3), l;
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
          var u = t._howls.indexOf(n);
          u >= 0 && t._howls.splice(u, 1);
          var _ = !0;
          for (l = 0; l < t._howls.length; l++)
            if (t._howls[l]._src === n._src || n._src.indexOf(t._howls[l]._src) >= 0) {
              _ = !1;
              break;
            }
          return a && _ && delete a[n._src], t.noAudio = !1, n._state = "unloaded", n._sounds = [], n = null, null;
        },
        /**
         * Listen to a custom event.
         * @param  {String}   event Event name.
         * @param  {Function} fn    Listener to call.
         * @param  {Number}   id    (optional) Only listen to events for this sound.
         * @param  {Number}   once  (INTERNAL) Marks event to fire only once.
         * @return {Howl}
         */
        on: function(n, o, l, u) {
          var _ = this, m = _["_on" + n];
          return typeof o == "function" && m.push(u ? { id: l, fn: o, once: u } : { id: l, fn: o }), _;
        },
        /**
         * Remove a custom event. Call without parameters to remove all events.
         * @param  {String}   event Event name.
         * @param  {Function} fn    Listener to remove. Leave empty to remove all.
         * @param  {Number}   id    (optional) Only remove events for this sound.
         * @return {Howl}
         */
        off: function(n, o, l) {
          var u = this, _ = u["_on" + n], m = 0;
          if (typeof o == "number" && (l = o, o = null), o || l)
            for (m = 0; m < _.length; m++) {
              var p = l === _[m].id;
              if (o === _[m].fn && p || !o && p) {
                _.splice(m, 1);
                break;
              }
            }
          else if (n)
            u["_on" + n] = [];
          else {
            var y = Object.keys(u);
            for (m = 0; m < y.length; m++)
              y[m].indexOf("_on") === 0 && Array.isArray(u[y[m]]) && (u[y[m]] = []);
          }
          return u;
        },
        /**
         * Listen to a custom event and remove it once fired.
         * @param  {String}   event Event name.
         * @param  {Function} fn    Listener to call.
         * @param  {Number}   id    (optional) Only listen to events for this sound.
         * @return {Howl}
         */
        once: function(n, o, l) {
          var u = this;
          return u.on(n, o, l, 1), u;
        },
        /**
         * Emit all events of a specific type and pass the sound id.
         * @param  {String} event Event name.
         * @param  {Number} id    Sound ID.
         * @param  {Number} msg   Message to go with event.
         * @return {Howl}
         */
        _emit: function(n, o, l) {
          for (var u = this, _ = u["_on" + n], m = _.length - 1; m >= 0; m--)
            (!_[m].id || _[m].id === o || n === "load") && (setTimeout(function(p) {
              p.call(this, o, l);
            }.bind(u, _[m].fn), 0), _[m].once && u.off(n, _[m].fn, _[m].id));
          return u._loadQueue(n), u;
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
          var u = !!(n._loop || o._sprite[l][2]);
          if (o._emit("end", n._id), !o._webAudio && u && o.stop(n._id, !0).play(n._id), o._webAudio && u) {
            o._emit("play", n._id), n._seek = n._start || 0, n._rateSeek = 0, n._playStart = t.ctx.currentTime;
            var _ = (n._stop - n._start) * 1e3 / Math.abs(n._rate);
            o._endTimers[n._id] = setTimeout(o._ended.bind(o, n), _);
          }
          return o._webAudio && !u && (n._paused = !0, n._ended = !0, n._seek = n._start || 0, n._rateSeek = 0, o._clearTimer(n._id), o._cleanBuffer(n._node), t._autoSuspend()), !o._webAudio && !u && o.stop(n._id, !0), o;
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
          var n = this, o = n._pool, l = 0, u = 0;
          if (!(n._sounds.length < o)) {
            for (u = 0; u < n._sounds.length; u++)
              n._sounds[u]._ended && l++;
            for (u = n._sounds.length - 1; u >= 0; u--) {
              if (l <= o)
                return;
              n._sounds[u]._ended && (n._webAudio && n._sounds[u]._node && n._sounds[u]._node.disconnect(0), n._sounds.splice(u, 1), l--);
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
            for (var l = [], u = 0; u < o._sounds.length; u++)
              l.push(o._sounds[u]._id);
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
      var a = {}, h = function(n) {
        var o = n._src;
        if (a[o]) {
          n._duration = a[o].duration, f(n);
          return;
        }
        if (/^data:[^;]+;base64,/.test(o)) {
          for (var l = atob(o.split(",")[1]), u = new Uint8Array(l.length), _ = 0; _ < l.length; ++_)
            u[_] = l.charCodeAt(_);
          c(u.buffer, n);
        } else {
          var m = new XMLHttpRequest();
          m.open(n._xhr.method, o, !0), m.withCredentials = n._xhr.withCredentials, m.responseType = "arraybuffer", n._xhr.headers && Object.keys(n._xhr.headers).forEach(function(p) {
            m.setRequestHeader(p, n._xhr.headers[p]);
          }), m.onload = function() {
            var p = (m.status + "")[0];
            if (p !== "0" && p !== "2" && p !== "3") {
              n._emit("loaderror", null, "Failed loading audio file with status: " + m.status + ".");
              return;
            }
            c(m.response, n);
          }, m.onerror = function() {
            n._webAudio && (n._html5 = !0, n._webAudio = !1, n._sounds = [], delete a[o], n.load());
          }, d(m);
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
        }, u = function(_) {
          _ && o._sounds.length > 0 ? (a[o._src] = _, f(o, _)) : l();
        };
        typeof Promise < "u" && t.ctx.decodeAudioData.length === 1 ? t.ctx.decodeAudioData(n).then(u).catch(l) : t.ctx.decodeAudioData(n, u, l);
      }, f = function(n, o) {
        o && !n._duration && (n._duration = o.duration), Object.keys(n._sprite).length === 0 && (n._sprite = { __default: [0, n._duration * 1e3] }), n._state !== "loaded" && (n._state = "loaded", n._emit("load"), n._loadQueue());
      }, w = function() {
        if (t.usingWebAudio) {
          try {
            typeof AudioContext < "u" ? t.ctx = new AudioContext() : typeof webkitAudioContext < "u" ? t.ctx = new webkitAudioContext() : t.usingWebAudio = !1;
          } catch {
            t.usingWebAudio = !1;
          }
          t.ctx || (t.usingWebAudio = !1);
          var n = /iP(hone|od|ad)/.test(t._navigator && t._navigator.platform), o = t._navigator && t._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/), l = o ? parseInt(o[1], 10) : null;
          if (n && l && l < 9) {
            var u = /safari/.test(t._navigator && t._navigator.userAgent.toLowerCase());
            t._navigator && !u && (t.usingWebAudio = !1);
          }
          t.usingWebAudio && (t.masterGain = typeof t.ctx.createGain > "u" ? t.ctx.createGainNode() : t.ctx.createGain(), t.masterGain.gain.setValueAtTime(t._muted ? 0 : t._volume, t.ctx.currentTime), t.masterGain.connect(t.ctx.destination)), t._setup();
        }
      };
      s.Howler = t, s.Howl = r, typeof Z < "u" ? (Z.HowlerGlobal = e, Z.Howler = t, Z.Howl = r, Z.Sound = i) : typeof window < "u" && (window.HowlerGlobal = e, window.Howler = t, window.Howl = r, window.Sound = i);
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
      }, HowlerGlobal.prototype.orientation = function(t, r, i, a, h, d) {
        var c = this;
        if (!c.ctx || !c.ctx.listener)
          return c;
        var f = c._orientation;
        if (r = typeof r != "number" ? f[1] : r, i = typeof i != "number" ? f[2] : i, a = typeof a != "number" ? f[3] : a, h = typeof h != "number" ? f[4] : h, d = typeof d != "number" ? f[5] : d, typeof t == "number")
          c._orientation = [t, r, i, a, h, d], typeof c.ctx.listener.forwardX < "u" ? (c.ctx.listener.forwardX.setTargetAtTime(t, Howler.ctx.currentTime, 0.1), c.ctx.listener.forwardY.setTargetAtTime(r, Howler.ctx.currentTime, 0.1), c.ctx.listener.forwardZ.setTargetAtTime(i, Howler.ctx.currentTime, 0.1), c.ctx.listener.upX.setTargetAtTime(a, Howler.ctx.currentTime, 0.1), c.ctx.listener.upY.setTargetAtTime(h, Howler.ctx.currentTime, 0.1), c.ctx.listener.upZ.setTargetAtTime(d, Howler.ctx.currentTime, 0.1)) : c.ctx.listener.setOrientation(t, r, i, a, h, d);
        else
          return f;
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
        for (var h = i._getSoundIds(r), d = 0; d < h.length; d++) {
          var c = i._soundById(h[d]);
          if (c)
            if (typeof t == "number")
              c._stereo = t, c._pos = [t, 0, 0], c._node && (c._pannerAttr.panningModel = "equalpower", (!c._panner || !c._panner.pan) && e(c, a), a === "spatial" ? typeof c._panner.positionX < "u" ? (c._panner.positionX.setValueAtTime(t, Howler.ctx.currentTime), c._panner.positionY.setValueAtTime(0, Howler.ctx.currentTime), c._panner.positionZ.setValueAtTime(0, Howler.ctx.currentTime)) : c._panner.setPosition(t, 0, 0) : c._panner.pan.setValueAtTime(t, Howler.ctx.currentTime)), i._emit("stereo", c._id);
            else
              return c._stereo;
        }
        return i;
      }, Howl.prototype.pos = function(t, r, i, a) {
        var h = this;
        if (!h._webAudio)
          return h;
        if (h._state !== "loaded")
          return h._queue.push({
            event: "pos",
            action: function() {
              h.pos(t, r, i, a);
            }
          }), h;
        if (r = typeof r != "number" ? 0 : r, i = typeof i != "number" ? -0.5 : i, typeof a > "u")
          if (typeof t == "number")
            h._pos = [t, r, i];
          else
            return h._pos;
        for (var d = h._getSoundIds(a), c = 0; c < d.length; c++) {
          var f = h._soundById(d[c]);
          if (f)
            if (typeof t == "number")
              f._pos = [t, r, i], f._node && ((!f._panner || f._panner.pan) && e(f, "spatial"), typeof f._panner.positionX < "u" ? (f._panner.positionX.setValueAtTime(t, Howler.ctx.currentTime), f._panner.positionY.setValueAtTime(r, Howler.ctx.currentTime), f._panner.positionZ.setValueAtTime(i, Howler.ctx.currentTime)) : f._panner.setPosition(t, r, i)), h._emit("pos", f._id);
            else
              return f._pos;
        }
        return h;
      }, Howl.prototype.orientation = function(t, r, i, a) {
        var h = this;
        if (!h._webAudio)
          return h;
        if (h._state !== "loaded")
          return h._queue.push({
            event: "orientation",
            action: function() {
              h.orientation(t, r, i, a);
            }
          }), h;
        if (r = typeof r != "number" ? h._orientation[1] : r, i = typeof i != "number" ? h._orientation[2] : i, typeof a > "u")
          if (typeof t == "number")
            h._orientation = [t, r, i];
          else
            return h._orientation;
        for (var d = h._getSoundIds(a), c = 0; c < d.length; c++) {
          var f = h._soundById(d[c]);
          if (f)
            if (typeof t == "number")
              f._orientation = [t, r, i], f._node && (f._panner || (f._pos || (f._pos = h._pos || [0, 0, -0.5]), e(f, "spatial")), typeof f._panner.orientationX < "u" ? (f._panner.orientationX.setValueAtTime(t, Howler.ctx.currentTime), f._panner.orientationY.setValueAtTime(r, Howler.ctx.currentTime), f._panner.orientationZ.setValueAtTime(i, Howler.ctx.currentTime)) : f._panner.setOrientation(t, r, i)), h._emit("orientation", f._id);
            else
              return f._orientation;
        }
        return h;
      }, Howl.prototype.pannerAttr = function() {
        var t = this, r = arguments, i, a, h;
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
            return h = t._soundById(parseInt(r[0], 10)), h ? h._pannerAttr : t._pannerAttr;
        else r.length === 2 && (i = r[0], a = parseInt(r[1], 10));
        for (var d = t._getSoundIds(a), c = 0; c < d.length; c++)
          if (h = t._soundById(d[c]), h) {
            var f = h._pannerAttr;
            f = {
              coneInnerAngle: typeof i.coneInnerAngle < "u" ? i.coneInnerAngle : f.coneInnerAngle,
              coneOuterAngle: typeof i.coneOuterAngle < "u" ? i.coneOuterAngle : f.coneOuterAngle,
              coneOuterGain: typeof i.coneOuterGain < "u" ? i.coneOuterGain : f.coneOuterGain,
              distanceModel: typeof i.distanceModel < "u" ? i.distanceModel : f.distanceModel,
              maxDistance: typeof i.maxDistance < "u" ? i.maxDistance : f.maxDistance,
              refDistance: typeof i.refDistance < "u" ? i.refDistance : f.refDistance,
              rolloffFactor: typeof i.rolloffFactor < "u" ? i.rolloffFactor : f.rolloffFactor,
              panningModel: typeof i.panningModel < "u" ? i.panningModel : f.panningModel
            };
            var w = h._panner;
            w || (h._pos || (h._pos = t._pos || [0, 0, -0.5]), e(h, "spatial"), w = h._panner), w.coneInnerAngle = f.coneInnerAngle, w.coneOuterAngle = f.coneOuterAngle, w.coneOuterGain = f.coneOuterGain, w.distanceModel = f.distanceModel, w.maxDistance = f.maxDistance, w.refDistance = f.refDistance, w.rolloffFactor = f.rolloffFactor, w.panningModel = f.panningModel;
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
  })(_e)), _e;
}
var Q = gt();
const qe = [
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
], wt = new Set(qe.filter((s) => s !== "ambience"));
function bt(s, e, t) {
  return e === s && t < 1;
}
function yt(s, e, t) {
  return t || !e ? 0 : s ? 0.16 : 0.38;
}
class vt {
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
    this.onDegraded = e, Q.Howler.autoSuspend = !0;
  }
  load() {
    for (const e of qe) {
      const t = new Q.Howl({
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
          bt(e, this.lastRequested, r) && (this.retries.set(e, r + 1), t.once("unlock", () => {
            this.lastRequested === e && this.effects && !this.muted && t.play();
          }));
        }
      });
      this.howls.set(e, t);
    }
  }
  unlock() {
    this.unlocked = !0;
    const e = Q.Howler.ctx;
    e && e.state !== "running" && e.resume(), this.installBus(), this.syncAmbience();
  }
  /** Master compressor in front of the speakers, the same bus shape as a two-bus cabinet mix. */
  installBus() {
    if (this.busReady) return;
    const e = Q.Howler.ctx, t = Q.Howler.masterGain;
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
    this.muted = e, this.music = t, this.effects = r, Q.Howler.mute(e), this.syncAmbience();
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
    if (!this.unlocked || this.muted || this.hidden || !this.effects || !wt.has(e)) return;
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
    const t = yt(this.presenting, this.music, this.muted);
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
const Be = "auric-dynamo.board.v1", kt = [
  { id: "first-win", label: "First net gain" },
  { id: "feature", label: "Feature landed" },
  { id: "wheel", label: "Wheel opened" },
  { id: "flourish", label: "Energy flourish" },
  { id: "big", label: "Big net" },
  { id: "mega", label: "Mega net" },
  { id: "epic", label: "Epic net" },
  { id: "session", label: "Session ahead" }
], Fe = ["Spark", "Ember", "Brass", "Glow", "Dynamo", "Charge", "Crown", "Auric"];
function z() {
  return { handle: "Player", rows: [], seen: [], achievements: [] };
}
function Ve(s) {
  const e = s.replace(/[^A-Za-z0-9 ]/g, "").trim().slice(0, 16);
  return e.length > 0 ? e : "Player";
}
function At(s) {
  return new Date(s).toISOString().slice(0, 10);
}
function xt(s) {
  const e = Math.min(Fe.length, 1 + Math.floor(Math.max(0, s) / 5));
  return { level: e, name: Fe[e - 1] ?? "Spark" };
}
function St(s) {
  if (!s) return z();
  try {
    const e = JSON.parse(s);
    return !e || !Array.isArray(e.rows) || !Array.isArray(e.seen) ? z() : {
      handle: Ve(typeof e.handle == "string" ? e.handle : "Player"),
      rows: e.rows.filter((t) => t && typeof t.handle == "string"),
      seen: e.seen.filter((t) => typeof t == "string").slice(-80),
      achievements: Array.isArray(e.achievements) ? e.achievements.filter((t) => typeof t == "string") : []
    };
  } catch {
    return z();
  }
}
function Mt(s) {
  return JSON.stringify(s);
}
function Tt(s, e) {
  const t = s.cost > 0 ? s.net / s.cost : 0, r = [];
  return e.wins >= 1 && r.push("first-win"), (s.modifier === "replace" || s.modifier === "bank" || s.modifier === "wheel") && r.push("feature"), s.modifier === "wheel" && r.push("wheel"), s.flourish && r.push("flourish"), t >= 5 && r.push("big"), t >= 25 && r.push("mega"), t >= 100 && r.push("epic"), e.highestSession > 0 && r.push("session"), r;
}
function Et(s, e) {
  if (s.seen.includes(e.id)) return s;
  const t = At(e.at), r = s.rows.map((h) => ({ ...h }));
  let i = r.find((h) => h.handle === s.handle);
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
  for (const h of Tt(e, i))
    a.includes(h) || a.push(h);
  return {
    handle: s.handle,
    rows: r,
    seen: [...s.seen, e.id].slice(-80),
    achievements: a
  };
}
function It(s) {
  return s.rows.find((e) => e.handle === s.handle) ?? null;
}
function Lt(s, e) {
  return [...s].sort((t, r) => r[e] - t[e] || t.handle.localeCompare(r.handle));
}
class W extends Error {
  constructor(e) {
    super(e), this.name = "EconomyError";
  }
}
const Pt = 1, Ct = 1e5, Nt = [10, 20, 50, 100], Bt = 10, Y = 1e4, Te = {
  blank: 0,
  0: 0,
  1: 1,
  5: 3,
  10: 12,
  "00": 40
}, Xe = [
  { token: "blank", from: 0, to: 2200, weight: 2200 },
  { token: "0", from: 2200, to: 7269, weight: 5069 },
  { token: "1", from: 7269, to: 8e3, weight: 731 },
  { token: "5", from: 8e3, to: 9200, weight: 1200 },
  { token: "10", from: 9200, to: 9700, weight: 500 },
  { token: "00", from: 9700, to: 1e4, weight: 300 }
], Qe = [
  { id: "x1", from: 0, to: 6200, weight: 6200, multiplier: 1 },
  { id: "x2", from: 6200, to: 8e3, weight: 1800, multiplier: 2 },
  { id: "x5", from: 8e3, to: 8700, weight: 700, multiplier: 5 },
  { id: "x10", from: 8700, to: 9100, weight: 400, multiplier: 10 },
  { id: "replace", from: 9100, to: 9500, weight: 400, multiplier: null },
  { id: "bank", from: 9500, to: 9920, weight: 420, multiplier: null },
  { id: "wheel", from: 9920, to: 1e4, weight: 80, multiplier: null }
], ue = [1, 2, 4, 6, 10, 16, 40, 110];
function R(s, e) {
  if (!Number.isSafeInteger(s)) throw new W(`unsafe ${e}`);
  return s;
}
function xe(s, e, t) {
  return R(s, t), R(e, t), R(s * e, t);
}
function j(s, e, t) {
  return R(s, t), R(e, t), R(s + e, t);
}
function Ee(s) {
  return Nt.includes(s);
}
function ge(s) {
  if (!Number.isInteger(s) || s < 0 || s >= Y) throw new W("token draw");
  const e = Xe.find((t) => s >= t.from && s < t.to);
  if (!e) throw new W("token draw");
  return e.token;
}
function Ft(s) {
  if (!Number.isInteger(s) || s < 0 || s >= Y) throw new W("modifier draw");
  const e = Qe.find((t) => s >= t.from && s < t.to);
  if (!e) throw new W("modifier draw");
  return e.id;
}
function je(s) {
  if (s.some((t) => t === "blank")) return 0;
  const e = s.reduce((t, r) => t + Te[r], 0);
  return R(e, "raw number");
}
function Ot(s) {
  return s === "blank" ? "blank" : s;
}
function Ye(s) {
  return s === "x1" ? "1x" : s === "x2" ? "2x" : s === "x5" ? "5x" : s === "x10" ? "10x" : s === "replace" ? "Replace" : s === "bank" ? "Bank + Add" : "Wheel";
}
function re(s, e) {
  const t = [
    ge(s.nextInt(Y)),
    ge(s.nextInt(Y)),
    ge(s.nextInt(Y))
  ], r = je(t), i = xe(r, e, "base");
  return { tokens: t, raw: r, base: i };
}
function Ue(s, e, t) {
  if (!Ee(e)) throw new W("cost");
  if (!Number.isSafeInteger(t) || t < 0 || t > 9) throw new W("meter");
  const r = e / 10, i = re(s, r), a = Ft(s.nextInt(Y)), h = [];
  let d = null, c = null, f = 0, w = null, n = 0, o = [], l = 0;
  if (a === "x1" || a === "x2" || a === "x5" || a === "x10")
    d = a === "x1" ? 1 : a === "x2" ? 2 : a === "x5" ? 5 : 10, n = xe(d - 1, i.base, "modifier addition"), l = j(i.base, n, "gross"), o = [i.base, n];
  else if (a === "replace") {
    const y = re(s, r);
    h.push(y), w = i.base, l = y.base, o = [y.base];
  } else if (a === "bank") {
    const y = re(s, r), v = re(s, r);
    h.push(y, v), l = j(j(i.base, y.base, "bank"), v.base, "gross"), o = [i.base, y.base, v.base];
  } else
    c = s.nextInt(ue.length), f = xe(e, ue[c], "wheel"), l = j(i.base, f, "gross"), o = [i.base, f];
  if (o.reduce((y, v) => j(y, v, "contributors"), 0) !== l) throw new W("contributor sum");
  const _ = j(l, -e, "net"), m = t + 1 >= Bt, p = m ? 0 : t + 1;
  return {
    cost: e,
    unit: r,
    initial: i,
    modifier: a,
    multiplier: d,
    steps: h,
    wheelIndex: c,
    wheelPrize: f,
    discarded: w,
    modifierAdd: n,
    contributors: o,
    gross: l,
    net: _,
    collectionBefore: t,
    collectionAfter: p,
    collectionFlourish: m
  };
}
function G(s, e) {
  if (R(s, "net"), R(e, "cost"), e <= 0) throw new W("cost");
  return s <= 0 ? 0 : s < 5 * e ? 1 : s < 25 * e ? 2 : s < 100 * e ? 3 : 4;
}
function Ht(s, e, t) {
  if (s <= 0 || t === null || t <= 0) return 0;
  const r = G(t, e), i = G(s, e);
  return r < i ? r : i;
}
function L(s) {
  const e = s < 0 ? "-" : "", t = Math.abs(s).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return e + t;
}
function Rt(s) {
  return s.net > 0 ? "Net gain" : s.gross === 0 ? "No return" : s.net === 0 ? "No net change" : `Returned ${L(s.gross)}`;
}
function $t(s) {
  return s.gross === 0 ? `No return. Net change -${L(s.cost)}.` : s.net === 0 ? "No net change." : s.net < 0 ? `Returned ${L(s.gross)}. Net change -${L(-s.net)}.` : `Returned ${L(s.gross)}. Net change +${L(s.net)}.`;
}
function H(s) {
  return String(je(s));
}
function Dt() {
  const s = Xe.map((r) => `${Ot(r.token)}: ${r.weight} out of 10000, worth ${Te[r.token]}`).join(`
`), e = Qe.map((r) => `${Ye(r.id)}: ${r.weight} out of 10000`).join(`
`), t = ue.map((r, i) => `Wedge ${i + 1}: cost x ${r} (1 out of 8)`).join(`
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
const ne = Math.PI * 2, le = 8, ee = ne / le;
function he(s) {
  return -((s + 0.5) * ee);
}
function Ze(s) {
  let e = -s % ne;
  return e < 0 && (e += ne), (Math.floor((e + 1e-9) / ee) % le + le) % le;
}
function Wt(s) {
  return 1 - (1 - Math.min(1, Math.max(0, s))) ** 3;
}
function Gt(s, e, t = We) {
  const r = he(s), i = r - t * ne;
  return i + (r - i) * Wt(e);
}
function qt(s, e = We) {
  const t = he(s), r = t - e * ne, i = t - r, a = Math.floor(-r / ee - 1e-9), h = Math.ceil(-t / ee + 1e-9), d = [];
  for (let c = a; c >= h; c--) {
    const f = -c * ee;
    if (f <= r + 1e-8 || f > t + 1e-8) continue;
    const w = (f - r) / i;
    if (w <= 0 || w > 1) continue;
    const n = 1 - Math.cbrt(1 - w);
    n > 0 && n <= 1 && d.push(n);
  }
  return d.sort((c, f) => c - f), d;
}
function ie() {
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
function Ke(s) {
  return s === 1 ? "chord-2" : s === 2 ? "chord-3" : s === 3 ? "chord-full" : s === 4 ? "fanfare" : null;
}
function Vt(s, e, t) {
  if (t <= 0) return s;
  if (t >= 1) return e;
  const r = e - s;
  let i;
  if (t <= 0.6) i = t / 0.6 * 0.85;
  else {
    const h = (t - 0.6) / 0.4;
    i = 0.85 + h * h * (3 - 2 * h) * 0.15;
  }
  const a = Math.floor(s + r * i);
  return Math.min(e, Math.max(s, a));
}
function Xt(s) {
  return { ...s, bankAdds: [...s.bankAdds] };
}
function X(s) {
  const e = s.net, t = s.gross;
  return s.modifier === "replace" ? {
    reading: H(s.steps[0].tokens),
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
    reading: H(s.initial.tokens),
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
    reading: H(s.initial.tokens),
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
    reading: H(s.initial.tokens),
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
function Qt(s, e, t) {
  for (let r = e + 1; r < s.length; r++) s[r].startMs += t;
}
function jt(s, e) {
  let t = s.length ? s[s.length - 1].startMs + s[s.length - 1].durationMs : 0;
  if (t <= e) return !1;
  for (const r of ["inhale", "countup", "collection", "resolve"]) {
    const i = s.findIndex((d) => d.kind === r);
    if (i < 0) continue;
    const a = t - e;
    if (a <= 0) return !1;
    const h = Math.min(s[i].durationMs, a);
    s[i].durationMs -= h, Qt(s, i, -h), t -= h;
  }
  return t > e;
}
function Se(s, e, t, r = pe) {
  if (e === "reduced") {
    const p = X(s), y = s.net > 0 ? G(s.net, s.cost) : 0, v = Ke(y);
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
          cueTier: y,
          parts: p
        }
      ],
      cues: [{ at: 0, sound: v ?? "latch", presentation: !0 }]
    };
  }
  const i = e === "turbo" ? r.turboScale : 1, a = (p) => Math.max(0, Math.round(p * i)), h = [];
  let d = 0;
  const c = (p, y, v, k) => {
    const M = Ht(s.net, s.cost, v.guaranteedNet);
    h.push({
      kind: p,
      receiptId: t,
      startMs: d,
      durationMs: y,
      cueTier: M,
      parts: Xt(v),
      ...k
    }), d += y;
  }, f = [
    a(r.reelStops[0]),
    a(r.reelStops[1]),
    a(r.reelStops[2])
  ];
  let w = ie();
  if (c("reels", f[2], w, { reelStops: f }), w = { ...w, reading: H(s.initial.tokens) }, c("assemble", a(r.assemble), w), c("inhale", a(r.inhale), w), s.multiplier !== null)
    w = X(s);
  else if (s.modifier === "replace")
    w = {
      ...ie(),
      reading: H(s.initial.tokens),
      discarded: s.discarded,
      guaranteedNet: null
    };
  else if (s.modifier === "bank") {
    const p = s.initial.base > s.cost ? s.initial.base - s.cost : null;
    w = {
      ...ie(),
      reading: H(s.initial.tokens),
      bankLocked: s.initial.base,
      guaranteedNet: p
    };
  } else {
    const p = s.initial.base > 0 ? s.initial.base : null;
    w = {
      ...ie(),
      reading: H(s.initial.tokens),
      base: s.initial.base,
      guaranteedNet: p
    };
  }
  c("modifier", a(r.modifier), w), s.modifier === "replace" && c("replace", a(r.feature.replace), X(s)), s.modifier === "bank" && c("bank", a(r.feature.bank), X(s)), s.modifier === "wheel" && c("wheel", a(r.feature.wheel), X(s));
  const n = G(s.net, s.cost), o = a(r.count[n]);
  o > 0 && c("countup", o, X(s)), c("resolve", a(r.resolve), X(s)), c("collection", a(r.collection), X(s));
  const l = jt(h, r.cap), u = h.length ? h[h.length - 1].startMs + h[h.length - 1].durationMs : 0, _ = l ? r.cap : u, m = Yt(s, h);
  return { receiptId: t, mode: e, stages: h, cues: m, totalMs: _, capped: l };
}
function Yt(s, e, t) {
  const r = [], i = e.find((u) => u.kind === "reels");
  if (i?.reelStops) {
    r.push({ at: i.startMs, sound: "spin", presentation: !0 });
    const u = s.net > 0 && (s.modifier === "replace" || s.modifier === "bank" || s.modifier === "wheel" || G(s.net, s.cost) >= 2), _ = i.reelStops[i.reelStops.length - 1];
    i.reelStops.forEach((m, p) => {
      r.push({ at: m, sound: "click", presentation: !0 }), r.push({ at: m, sound: "stop", presentation: !0 }), r.push({ at: m + 36, sound: "land", presentation: !0, rate: 1 + p * 0.18 });
    }), u && _ !== void 0 && r.push({ at: Math.max(i.startMs, _ - 220), sound: "riser", presentation: !0 });
  }
  const a = (u) => e.find((_) => _.kind === u), h = a("assemble");
  h && r.push({ at: h.startMs, sound: "latch", presentation: !0 });
  const d = a("modifier");
  d && (r.push({ at: d.startMs, sound: "brass", presentation: !0 }), d.cueTier > 0 && r.push({ at: d.startMs, sound: "teal-lift", presentation: !0 }));
  const c = a("replace");
  c && r.push({ at: c.startMs, sound: "latch", presentation: !0 });
  const f = a("bank");
  f && (r.push({ at: f.startMs, sound: "latch", presentation: !0 }), r.push({ at: f.startMs + Math.round(f.durationMs * 0.5), sound: "latch", presentation: !0 }), r.push({ at: f.startMs + Math.round(f.durationMs * (5 / 6)), sound: "latch", presentation: !0 }));
  const w = a("wheel");
  if (w && s.wheelIndex !== null) {
    r.push({ at: w.startMs, sound: "turbine", presentation: !0 });
    const u = w.durationMs * ce;
    for (const _ of qt(s.wheelIndex))
      r.push({ at: w.startMs + _ * u, sound: "tick", presentation: !0 });
  }
  const n = a("countup"), o = Ke(G(s.net, s.cost));
  if (n && o && s.net > 0) {
    r.push({ at: n.startMs, sound: o, presentation: !0 }), r.push({ at: n.startMs, sound: "coin", presentation: !0 });
    for (let u = 1; u <= 6; u += 1) {
      const _ = u / 7, m = 1 - (1 - _) * (1 - _);
      r.push({ at: n.startMs + Math.round(n.durationMs * m), sound: "coin", presentation: !0 });
    }
  }
  const l = a("collection");
  return l && r.push({ at: l.startMs, sound: "collect", presentation: !0 }), r.sort((u, _) => u.at - _.at);
}
const Ut = [0, 8, 14, 20, 24];
function Zt(s) {
  return s === 2 ? "Big" : s === 3 ? "Mega" : s >= 4 ? "Epic" : null;
}
function $(s, e) {
  return e <= s.startMs ? 0 : s.durationMs <= 0 ? 1 : Math.min(1, (e - s.startMs) / s.durationMs);
}
function Je(s, e) {
  let t = null;
  for (const r of s.stages)
    r.startMs <= e && (t = r);
  return t;
}
function Kt(s, e, t) {
  const r = Je(e, t);
  return r ? r.kind === "replace" ? Jt(s, $(r, t)) : r.kind === "bank" ? zt(s, $(r, t)) : r.kind === "wheel" ? en(s, $(r, t)) : r.parts : e.stages[0]?.parts ?? {
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
function Jt(s, e) {
  const t = e >= 0.78;
  return {
    reading: H(t ? s.steps[0].tokens : s.initial.tokens),
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
function zt(s, e) {
  const t = e >= 0.5, r = e >= 5 / 6, i = [];
  t && i.push(s.steps[0].base), r && i.push(s.steps[1].base);
  const a = s.initial.base + i.reduce((d, c) => d + c, 0), h = a > s.cost ? a - s.cost : null;
  return {
    reading: H(s.initial.tokens),
    discarded: null,
    base: null,
    modifierAdd: null,
    bankLocked: e > 0 ? s.initial.base : null,
    bankAdds: i,
    wheel: null,
    gross: r ? s.gross : null,
    net: r ? s.net : null,
    guaranteedNet: r ? s.net : h
  };
}
function en(s, e) {
  const t = e >= ce;
  return {
    reading: H(s.initial.tokens),
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
function tn(s, e) {
  const t = [{ label: "Cost", amount: s.cost, text: L(s.cost), strike: !1 }];
  if (e.discarded !== null && t.push({ label: "Discarded base", amount: e.discarded, text: L(e.discarded), strike: !0 }), e.base !== null && t.push({ label: "Base", amount: e.base, text: L(e.base), strike: !1 }), e.modifierAdd !== null && t.push({
    label: s.multiplier ? `${Ye(s.modifier)} addition` : "Modifier addition",
    amount: e.modifierAdd,
    text: L(e.modifierAdd),
    strike: !1
  }), e.bankLocked !== null && t.push({ label: "Locked base", amount: e.bankLocked, text: L(e.bankLocked), strike: !1 }), e.bankAdds.forEach((r, i) => {
    t.push({ label: `Added result ${i + 1}`, amount: r, text: L(r), strike: !1 });
  }), e.wheel !== null && t.push({ label: "Wheel prize", amount: e.wheel, text: L(e.wheel), strike: !1 }), e.gross !== null && t.push({ label: "Gross", amount: e.gross, text: L(e.gross), strike: !1 }), e.net !== null) {
    const r = e.net > 0 ? `+${L(e.net)}` : L(e.net);
    t.push({ label: "Net", amount: null, text: r, strike: !1 });
  }
  return t;
}
function nn(s, e) {
  return e.error ? "error" : e.idle && !e.onboarded ? "onboarding" : e.idle ? "idle" : !s || s.kind === "reels" ? "spinning" : s.kind === "replace" ? "replace" : s.kind === "bank" ? "bank" : s.kind === "wheel" ? "wheel" : s.kind === "collection" ? "collection" : s.kind === "countup" && s.cueTier > 0 ? "celebrating" : "resolving";
}
function fe(s) {
  const { outcome: e, schedule: t, balanceAfter: r } = s, i = Math.max(0, s.elapsed), a = Kt(e, t, i), h = Je(t, i), d = e.net > 0 ? G(e.net, e.cost) : 0, c = t.stages.find((E) => E.kind === "countup");
  let f = null, w = 0;
  a.gross !== null && d === 0 && (f = a.gross), a.gross !== null && d > 0 && (c && i < c.startMs ? f = null : c && i < c.startMs + c.durationMs ? (f = Vt(0, e.gross, $(c, i)), w = d >= 3 ? $(c, i) : 0) : a.gross !== null && (f = e.gross, w = d >= 3 ? 1 : 0)), t.mode === "reduced" && (f = e.gross, w = 0);
  const n = f ?? 0, o = a.gross === null && t.mode !== "reduced" ? r - e.gross : r - e.gross + (d > 0 && c && i < c.startMs + c.durationMs && t.mode !== "reduced" ? n : e.gross), l = t.mode === "reduced" ? e.net > 0 ? d : 0 : a.guaranteedNet === null ? 0 : e.net > 0 ? G(Math.min(a.guaranteedNet, e.net), e.cost) : 0, u = c && i >= c.startMs && i < c.startMs + c.durationMs, _ = t.mode === "reduced" || !u || d === 0 ? 0 : Ut[d], m = t.stages.find((E) => E.kind === "modifier"), p = m && i >= m.startMs ? (m.cueTier > 0 ? 0.85 : 0.4) * Math.min(1, $(m, i) || 1) : 0;
  let y = null;
  if (e.modifier === "wheel" && e.wheelIndex !== null) {
    const E = t.stages.find((B) => B.kind === "wheel");
    if (t.mode === "reduced")
      y = { rotation: he(e.wheelIndex), lit: e.wheelIndex, spinning: !1 };
    else if (E && i >= E.startMs) {
      const B = $(E, i), q = B < ce, V = q ? B / ce : 1, Ce = Gt(e.wheelIndex, V), rt = q ? null : e.wheelIndex;
      !q && (Ze(Ce), e.wheelIndex), y = { rotation: Ce, lit: rt, spinning: q };
    } else
      y = { rotation: he(0), lit: null, spinning: !1 };
  }
  const v = t.mode === "reduced" ? e.modifier === "replace" ? e.steps[0].tokens : e.initial.tokens : sn(e, t, i), k = rn(t, i), M = t.mode !== "reduced" && d > 0 && f !== null && c !== void 0 && i < c.startMs + c.durationMs, T = f === null || M ? "Total" : "Gross", P = a.net === null ? "Net pending" : a.net > 0 ? `Net +${L(a.net)}` : `Net ${L(a.net)}`, C = t.stages.find((E) => E.kind === "collection"), g = t.mode === "reduced" || (C ? i >= C.startMs : !1), A = g ? e.collectionFlourish ? 10 : e.collectionBefore + 1 : e.collectionBefore, S = g && e.collectionFlourish, x = s.sessionNetAfter ?? e.net, N = t.mode === "reduced" || a.net !== null;
  return {
    receiptId: t.receiptId,
    phase: nn(h, { onboarded: s.onboarded ?? !0, error: s.error ?? !1, idle: s.idle ?? !1 }),
    cost: e.cost,
    balanceShown: o,
    tokens: v,
    spinning: k,
    modifier: m && i >= m.startMs || t.mode === "reduced" ? e.modifier : null,
    reading: a.reading,
    discarded: a.discarded,
    lines: tn(e, a),
    hero: f,
    totalLabel: T,
    netText: P,
    cueTier: e.net <= 0 ? 0 : l,
    particles: _,
    bloom: e.net <= 0 || t.mode === "reduced" ? 0 : w,
    modifierGlow: t.mode === "reduced" ? 0 : p,
    anticipation: t.mode !== "reduced" && e.net > 0 && (e.modifier === "replace" || e.modifier === "bank" || e.modifier === "wheel" || d >= 2) && k.some(Boolean),
    wheel: y,
    meterFilled: Math.min(10, A),
    meterFlourish: S,
    reduced: t.mode === "reduced",
    sessionNetShown: N ? x : x - e.net
  };
}
function sn(s, e, t) {
  const i = e.stages.find((d) => d.kind === "reels")?.reelStops ?? [0, 0, 0], a = e.stages.find((d) => d.kind === "replace"), h = e.stages.find((d) => d.kind === "bank");
  if (a && t >= a.startMs)
    return $(a, t) < 0.78 ? [null, null, null] : s.steps[0].tokens;
  if (h && t >= h.startMs) {
    const d = $(h, t);
    return d >= 1 / 6 && d < 0.5 || d >= 0.62 && d < 5 / 6 ? [null, null, null] : d >= 5 / 6 ? s.steps[1].tokens : d >= 0.5 ? s.steps[0].tokens : s.initial.tokens;
  }
  return [
    t >= i[0] ? s.initial.tokens[0] : null,
    t >= i[1] ? s.initial.tokens[1] : null,
    t >= i[2] ? s.initial.tokens[2] : null
  ];
}
function rn(s, e) {
  if (s.mode === "reduced") return [!1, !1, !1, !1];
  const r = s.stages.find((c) => c.kind === "reels")?.reelStops ?? [0, 0, 0], i = s.stages.find((c) => c.kind === "modifier"), a = s.stages.find((c) => c.kind === "replace"), h = s.stages.find((c) => c.kind === "bank");
  let d = !1;
  if (a && e >= a.startMs && $(a, e) < 0.78 && (d = !0), h && e >= h.startMs) {
    const c = $(h, e);
    (c >= 1 / 6 && c < 0.5 || c >= 0.62 && c < 5 / 6) && (d = !0);
  }
  return [
    d || e < r[0],
    d || e < r[1],
    d || e < r[2],
    e < (i?.startMs ?? r[2])
  ];
}
function ze(s) {
  return [
    `Cost ${L(s.cost)}.`,
    s.discarded !== null ? `Discarded base ${L(s.discarded)} is excluded.` : "",
    `Gross ${L(s.gross)}.`,
    Rt(s) + ".",
    $t(s),
    s.collectionFlourish ? "Energy flourish, no credit reward." : ""
  ].filter(Boolean).join(" ");
}
class et extends Error {
  constructor() {
    super("economic draw aborted"), this.name = "RngAbortError";
  }
}
const Me = 2 ** 32;
function tt(s) {
  if (!Number.isInteger(s) || s < 1 || s > Me) throw new Error("invalid bound");
  return Math.floor(Me / s) * s;
}
function on(s, e) {
  if (!Number.isInteger(s) || s < 0 || s >= Me) throw new Error("invalid sample");
  const t = tt(e);
  return s >= t ? { ok: !1 } : { ok: !0, value: s % e };
}
class an {
  constructor(e = (r) => crypto.getRandomValues(r), t = 32) {
    this.source = e, this.maxRejects = t;
  }
  source;
  maxRejects;
  nextInt(e) {
    tt(e);
    const t = new Uint32Array(1);
    for (let r = 0; r < this.maxRejects; r++) {
      this.source(t);
      const i = on(t[0], e);
      if (i.ok) return i.value;
    }
    throw new et();
  }
}
class ln {
  constructor(e) {
    this.inner = e;
  }
  inner;
  queue = [];
  nextInt(e) {
    return this.inner.nextInt(e);
  }
}
const me = "auric-dynamo.snapshot.v1", dn = "auric-dynamo";
function nt() {
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
function Ie(s, e = "durable") {
  return {
    schemaVersion: Pt,
    revision: 1,
    balance: Ct,
    meter: 0,
    sessionNet: 0,
    activeMs: 0,
    sessionStartedAt: s,
    prefs: nt(),
    receipt: null,
    storage: e,
    economy: "local"
  };
}
function te(s) {
  return typeof s == "object" && s !== null && !Array.isArray(s);
}
function cn(s) {
  return te(s) ? typeof s.gross == "number" && typeof s.net == "number" && typeof s.cost == "number" && typeof s.modifier == "string" && Array.isArray(s.contributors) && Array.isArray(s.steps) && te(s.initial) : !1;
}
function Le(s) {
  if (s === null || s === "") return { ok: !1, reason: "empty" };
  let e;
  try {
    e = JSON.parse(s);
  } catch {
    return { ok: !1, reason: "corrupt" };
  }
  if (!te(e)) return { ok: !1, reason: "corrupt" };
  if (e.schemaVersion !== 1) return { ok: !1, reason: "version" };
  if (!Number.isSafeInteger(e.balance) || e.balance < 0) return { ok: !1, reason: "balance" };
  if (!Number.isSafeInteger(e.meter) || e.meter < 0 || e.meter > 9) return { ok: !1, reason: "meter" };
  if (!Number.isSafeInteger(e.sessionNet)) return { ok: !1, reason: "net" };
  if (!Number.isSafeInteger(e.revision) || e.revision < 1) return { ok: !1, reason: "revision" };
  if (typeof e.activeMs != "number" || !Number.isFinite(e.activeMs) || e.activeMs < 0) return { ok: !1, reason: "time" };
  if (typeof e.sessionStartedAt != "number" || !Number.isFinite(e.sessionStartedAt)) return { ok: !1, reason: "time" };
  if (!te(e.prefs) || !Ee(e.prefs.cost) || !Ae(e.prefs.autoplayCount))
    return { ok: !1, reason: "prefs" };
  const t = e.prefs;
  if (typeof t.muted != "boolean" || typeof t.music != "boolean" || typeof t.effects != "boolean")
    return { ok: !1, reason: "prefs" };
  if (typeof t.turbo != "boolean" || typeof t.onboarded != "boolean") return { ok: !1, reason: "prefs" };
  if (!(t.reducedMotion === null || typeof t.reducedMotion == "boolean")) return { ok: !1, reason: "prefs" };
  let r = null;
  if (e.receipt !== null && e.receipt !== void 0) {
    if (!te(e.receipt) || !cn(e.receipt.outcome)) return { ok: !1, reason: "receipt" };
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
function st(s, e, t) {
  const r = Le(s.get(me));
  return r.ok ? { snapshot: { ...r.snapshot, storage: t }, resetReason: null } : { snapshot: Ie(e, t), resetReason: r.reason === "empty" ? null : r.reason };
}
function U(s, e) {
  s.set(me, JSON.stringify(e));
}
async function un(s) {
  return s.locker.exclusive(() => {
    const e = s.memory ?? st(s.kv, s.now, "durable").snapshot;
    if (!s.settled && e.balance < s.cost)
      return { result: { kind: "insufficient", snapshot: e }, memory: s.memory, warning: null };
    let t;
    if (s.settled)
      t = s.settled.outcome;
    else
      try {
        t = Ue(s.rng, s.cost, e.meter);
      } catch (c) {
        if (c instanceof et)
          return { result: { kind: "rng-abort", snapshot: e }, memory: s.memory, warning: null };
        throw c;
      }
    let r;
    try {
      if (r = s.settled ? R(s.settled.balanceAfter, "balance") : R(e.balance + t.net, "balance"), r < 0) throw new Error("negative");
    } catch {
      return { result: { kind: "overflow", snapshot: e }, memory: s.memory, warning: null };
    }
    const i = e.revision + 1, a = R(e.sessionNet + t.net, "session net"), h = {
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
      receipt: h,
      economy: s.settled ? "wallet" : e.economy
    };
    if (s.memory)
      return { result: { kind: "committed", snapshot: d, storage: "memory" }, memory: d, warning: null };
    try {
      return U(s.kv, d), { result: { kind: "committed", snapshot: d, storage: d.storage }, memory: null, warning: null };
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
async function hn(s) {
  return s.locker.exclusive(() => {
    const e = s.memory ?? fn(s.kv), t = e.receipt;
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
      U(s.kv, r);
    } catch {
      const i = { ...r, storage: "memory" };
      return { snapshot: i, memory: i, applied: !0 };
    }
    return { snapshot: r, memory: null, applied: !0 };
  });
}
function fn(s) {
  const e = Le(s.get(me));
  return e.ok ? e.snapshot : Ie(Date.now(), "durable");
}
async function pn(s) {
  return s.locker.exclusive(() => {
    const e = Le(s.kv.get(me)), t = e.ok ? { ...e.snapshot.prefs, onboarded: !0 } : nt(), r = Ie(s.now, s.storage);
    r.prefs = t, r.revision = e.ok ? e.snapshot.revision + 1 : 1;
    try {
      U(s.kv, r);
    } catch {
      r.storage = "memory";
    }
    return r;
  });
}
function mn() {
  return { exclusive: (s) => Promise.resolve(s()) };
}
function _n() {
  return new an();
}
class gn {
  constructor(e, t, r, i, a, h, d) {
    this.outcome = e, this.schedule = t, this.balanceAfter = r, this.meterAfter = i, this.sessionNetAfter = a, this.audio = h, this.hooks = d, this.finished = new Promise((c) => {
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
    this.done || (this.audio.cancelPending(), this.audio.fadePresentation(pe.fadeMs), this.fired = this.schedule.cues.length, this.elapsed = this.schedule.totalMs, this.finish());
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
    return fe({
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
    const e = fe({
      outcome: this.outcome,
      schedule: this.schedule,
      elapsed: Math.max(this.schedule.totalMs, 1),
      balanceAfter: this.balanceAfter,
      meterAfter: this.meterAfter,
      sessionNetAfter: this.sessionNetAfter
    });
    this.hooks.onFrame(e), this.summarySent || (this.summarySent = !0, this.hooks.onSummary(ze(this.outcome))), this.hooks.onDone(), this.resolveDone();
  }
}
class wn {
  constructor(e, t, r, i, a, h, d, c, f = !1, w = () => crypto.randomUUID()) {
    this.kv = e, this.locker = t, this.rng = r, this.audio = i, this.onFrame = a, this.onSummary = h, this.newId = w, this.osReduced = f, this.now = d;
    const n = st(e, d, c);
    if (this.snapshot = n.snapshot, this.resetReason = n.resetReason, this.activeMs = this.snapshot.activeMs, n.resetReason)
      try {
        U(e, this.snapshot);
      } catch {
        this.enterMemory("This browser could not save the demo. Play continues in this tab only. A reload will not restore it.");
      }
    this.snapshot.receipt && this.restoreReceipt();
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
        U(this.kv, this.snapshot);
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
    return (e === null ? this.osReduced : e) ? "reduced" : this.snapshot.prefs.turbo ? "turbo" : "normal";
  }
  /** Manual play. Cancels autoplay and never spends on a rejected press. */
  spin() {
    return this.auto = null, this.beginSpin();
  }
  startAuto(e) {
    if (!Ae(e) || this.locked || this.auto) return !1;
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
    return this.locked || !Ee(e) ? !1 : (this.snapshot = { ...this.snapshot, prefs: { ...this.snapshot.prefs, cost: e } }, this.persistPrefs(), !0);
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
    return this.locked || !Ae(e) ? !1 : (this.snapshot = { ...this.snapshot, prefs: { ...this.snapshot.prefs, autoplayCount: e } }, this.persistPrefs(), !0);
  }
  finishOnboarding() {
    this.snapshot = { ...this.snapshot, prefs: { ...this.snapshot.prefs, onboarded: !0 } }, this.persistPrefs();
  }
  async reset() {
    if (this.locked || this.mode !== "practice") return !1;
    this.auto = null;
    const e = this.memory ? "memory" : this.snapshot.storage, t = await pn({ kv: this.kv, locker: this.locker, now: this.now, storage: e });
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
      const r = await un({
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
      const a = Se(i.outcome, this.motion(), i.id), h = new gn(i.outcome, a, i.balanceAfter, i.meterAfter, i.sessionNetAfter, this.audio, {
        onFrame: (d) => this.show(d),
        onSummary: (d) => this.postSummary(d),
        onDone: () => {
        }
      });
      this.presentation = h;
      try {
        h.start(), await h.finished;
      } catch {
        h.skip(), await h.finished;
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
    if (_t(this.lastOutcome, {
      remaining: this.auto.remaining
    })) {
      this.auto = null;
      return;
    }
    const t = mt(this.acceptedAt, this.now);
    t <= this.now ? this.beginSpin() : this.auto.nextAt = t;
  }
  async ack(e, t) {
    const r = await hn({
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
    e && (this.showRestoredFrame(e), this.postSummary(ze(e.outcome)), this.lastOutcome = e.outcome, e.acknowledged || (this.bootP = this.ack(e.id, e.revision)));
  }
  showRestoredFrame(e) {
    const t = Se(e.outcome, "reduced", e.id);
    this.show(fe({
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
      U(this.kv, this.snapshot);
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
const Pe = new URLSearchParams(location.search), bn = location.hostname === "localhost" || location.hostname === "127.0.0.1";
bn && (Pe.get("api") || "").replace(/\/$/, "");
Pe.get("geo");
Pe.get("brand");
function yn(s) {
  return window.parent === window ? !1 : (window.parent.postMessage({ source: "biab-game", ...s }, location.origin), !0);
}
const Oe = {
  symbolById: {},
  paylines: []
}, de = {}, vn = 240, kn = 5, An = 3, we = { outQuad: (s) => 1 - (1 - s) * (1 - s), inOutQuad: (s) => s < 0.5 ? 2 * s * s : 1 - Math.pow(-2 * s + 2, 2) / 2, outBack: (s) => 1 + 2.2 * Math.pow(s - 1, 3) + 1.2 * Math.pow(s - 1, 2) }, be = (s, e) => (s % e + e) % e;
class xn {
  /**
   * opts is optional. Lucky Pots calls this with the canvas, the payline svg and the two marker
   * columns, and gets the 5 by 3 view it has always had. Another game can pass
   * { reels, rows, cell, paylines, symbolArt } and use the same spin, blur and bounce.
   */
  constructor(e, t, r, i, a = {}) {
    this.c = e, this.ctx = e.getContext("2d"), this.svg = t, this.reelsN = a.reels ?? kn, this.rowsN = a.rows ?? An, this.cell = a.cell ?? vn, this.pitch = a.cellH ?? this.cell, this.w = this.reelsN * this.cell, this.h = this.rowsN * this.pitch, this.symbolArt = a.symbolArt ?? null, this.well = a.well ?? ["#1b4a2f", "#0a2217"], this.symbolFill = a.symbolFill === !0, this.plain = a.plain === !0, this.paylines = a.paylines ?? Oe.paylines, this.paused = !1, a.reels && (e.width = this.w, e.height = this.h), this.strips = null, this.pos = new Array(this.reelsN).fill(0), this.reel = Array.from({ length: this.reelsN }, () => ({ phase: "idle", speed: 0 })), this.highlight = null, this.labels = /* @__PURE__ */ new Map(), this.wildReels = [], this.wildAnim = /* @__PURE__ */ new Map(), this.onReelStop = () => {
    }, this.glowReels = /* @__PURE__ */ new Set(), this.markers = { l: [], r: [] }, r && i && this.paylines.forEach((h, d) => {
      const c = document.createElement("div");
      c.className = "marker", c.textContent = d + 1, c.style.top = (h[0] + 0.5) * this.pitch + "px", r.appendChild(c);
      const f = document.createElement("div");
      f.className = "marker", f.textContent = d + 1, f.style.top = (h[this.reelsN - 1] + 0.5) * this.pitch + "px", i.appendChild(f), this.markers.l.push(c), this.markers.r.push(f);
    }), this.last = performance.now(), requestAnimationFrame((h) => this.frame(h));
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
    return r[be(t, r.length)];
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
      for (let c = 0; c < this.rowsN; c++) a[be(t + c, a.length)] = r[c];
      const h = this.reel[e], d = performance.now() / 1e3;
      h.stopAt = Math.max(d, (h.startedAt || d) + 0.12), h.target = t, h.pendingStop = !0, h.onLand = () => {
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
    return new Promise((h) => {
      const d = performance.now() / 1e3;
      let c = this.reelsN;
      e.forEach((f, w) => {
        const n = this.strips[w];
        for (let u = 0; u < this.rowsN; u++) n[be(f + u, n.length)] = t[w][u];
        const o = this.reel[w], l = a[w] || 0;
        o.stopAt = Math.max(d, o.startedAt + i) + w * r + l, o.target = f, o.landed = !1, o.pendingStop = !0, o.onLand = () => {
          c--, this.onReelStop(w, t[w].slice()), c === 0 && h();
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
        const h = Math.min(1, (t - i.t0) / 0.14);
        this.pos[a] = i.pullFrom + 0.35 * Math.sin(h * Math.PI / 2), h >= 1 && (i.phase = "spin", i.speed = 4);
      } else if (i.phase === "spin") {
        if (i.speed = Math.min(26, i.speed + 90 * r), this.pos[a] -= i.speed * r, i.pendingStop && t >= i.stopAt) {
          i.phase = "land", i.landT0 = t, i.pendingStop = !1;
          const h = this.pos[a] - Math.floor(this.pos[a]);
          i.landFrom = i.target + 2.6 + h, this.pos[a] = i.landFrom;
        }
      } else if (i.phase === "land") {
        const d = Math.min(1, (t - i.landT0) / 0.42), c = 0.26;
        if (d < 0.62) {
          const f = we.outQuad(d / 0.62);
          this.pos[a] = i.landFrom + (i.target - c - i.landFrom) * f;
        } else {
          const f = we.inOutQuad((d - 0.62) / 0.38);
          this.pos[a] = i.target - c + c * f;
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
        const i = this.reel[r], a = this.pos[r], h = Math.floor(a), d = a - h, c = i.phase === "spin" ? Math.min(1, i.speed / 20) : 0;
        t.save(), t.beginPath(), t.rect(r * this.cell, 0, this.cell, this.h), t.clip();
        const f = this.wildReels.find((w) => w.reel === r);
        if (f && i.phase === "idle")
          this.drawWildReel(t, r, f, e);
        else
          for (let w = -1; w <= this.rowsN; w++) {
            const n = this.symAt(r, h + w), o = (w - d) * this.pitch;
            this.drawSymbol(t, n, r * this.cell, o, c, i.phase === "idle" ? [r, w] : null, e);
          }
        t.restore(), this.glowReels.has(r) && i.phase !== "idle" && (t.save(), t.strokeStyle = `rgba(255,216,74,${0.6 + 0.4 * Math.sin(e * 10)})`, t.lineWidth = 8, t.shadowColor = "#ffd84a", t.shadowBlur = 30, t.strokeRect(r * this.cell + 6, 6, this.cell - 12, this.h - 12), t.restore());
      }
      if (this.highlight) {
        const r = de.frame_win_cell;
        for (const i of this.highlight) {
          const [a, h] = i.split(",").map(Number), d = 0.75 + 0.25 * Math.sin(e * 8);
          if (t.save(), r) {
            const c = this.cell * (0.06 + 0.025 * Math.sin(e * 6));
            t.globalAlpha = 0.85 + 0.15 * Math.sin(e * 6), t.drawImage(r, a * this.cell - c / 2, h * this.cell - c / 2, this.cell + c, this.cell + c);
          } else
            t.strokeStyle = `rgba(255,220,90,${d})`, t.lineWidth = 7, t.shadowColor = "#ffd84a", t.shadowBlur = 24, t.strokeRect(a * this.cell + 7, h * this.cell + 7, this.cell - 14, this.cell - 14);
          t.restore();
        }
      }
      for (const [r, i] of this.labels) {
        const [a, h] = r.split(",").map(Number), d = a * this.cell + this.cell / 2, c = h * this.cell + this.cell / 2;
        t.save(), t.font = "700 34px Cinzel";
        const f = t.measureText(i).width + 36;
        t.fillStyle = "rgba(70,0,60,.85)", t.strokeStyle = "#ff3fd6", t.lineWidth = 4, Sn(t, d - f / 2, c - 28, f, 56, 14), t.fill(), t.stroke(), t.fillStyle = "#fff", t.textAlign = "center", t.textBaseline = "middle", t.fillText(i, d, c + 2), t.restore();
      }
    }
  }
  /** One shaded well per reel, so a window can clip the strip like a drum. */
  drawDrum(e) {
    for (let t = 0; t < this.reelsN; t++) {
      const r = t * this.cell, i = e.createLinearGradient(0, 0, 0, this.h);
      i.addColorStop(0, "#020807"), i.addColorStop(0.18, this.well[1]), i.addColorStop(0.5, this.well[0]), i.addColorStop(0.82, this.well[1]), i.addColorStop(1, "#020807"), e.fillStyle = i, e.fillRect(r, 0, this.cell, this.h);
    }
  }
  drawCell(e, t, r, i) {
    const a = t * this.cell, h = r * this.pitch, d = this.cell, c = this.pitch, f = e.createRadialGradient(a + d / 2, h + c / 2, 20, a + d / 2, h + c / 2, Math.max(d, c) * 0.8);
    f.addColorStop(0, this.well[0]), f.addColorStop(1, this.well[1]), e.fillStyle = f, e.fillRect(a, h, d, c), e.save(), e.beginPath(), e.rect(a, h, d, c), e.clip(), e.strokeStyle = "rgba(120,200,140,.07)", e.lineWidth = 2;
    for (let w = -this.cell; w < this.cell * 2; w += 30)
      e.beginPath(), e.moveTo(a + w, h), e.lineTo(a + w + this.cell, h + this.cell), e.stroke(), e.beginPath(), e.moveTo(a + w + this.cell, h), e.lineTo(a + w, h + this.cell), e.stroke();
    e.restore(), e.strokeStyle = "#a67c2e", e.lineWidth = 3, e.strokeRect(a + 4, h + 4, d - 8, c - 8), e.strokeStyle = "rgba(0,0,0,.5)", e.lineWidth = 2, e.strokeRect(a + 1, h + 1, d - 2, c - 2), this.highlight && !this.highlight.has(`${t},${r}`) && !this.wildReels.some((w) => w.reel === t) && (e.fillStyle = "rgba(0,0,0,.55)", e.fillRect(a, h, d, c));
  }
  drawSymbol(e, t, r, i, a, h) {
    const d = this.symbolArt ? null : Oe.symbolById[t], c = this.symbolArt ? this.symbolArt(t) : d && de[d.art];
    if (!c) return;
    const f = this.pitch;
    if (this.symbolFill) {
      const _ = c.naturalWidth || c.width || 1, m = c.naturalHeight || c.height || 1, p = this.cell * 0.8, y = f * 0.8;
      let v = p, k = v * (m / _);
      k > y && (k = y, v = k * (_ / m));
      const M = (this.cell - v) / 2, T = (f - k) / 2;
      e.save(), e.beginPath(), e.rect(r, i, this.cell, f), e.clip();
      const P = h && this.highlight && !this.highlight.has(`${h[0]},${h[1]}`), C = Math.abs(i + f / 2 - this.h / 2), g = Math.min(1, Math.max(0, (C - this.pitch * 0.42) / (this.pitch * 0.55)));
      e.save(), e.globalAlpha = P ? 0.45 : 1 - g * 0.5, a > 0.05 && (e.globalAlpha *= 0.82), e.drawImage(c, r + M, i + T, v, k), e.restore(), e.restore();
      return;
    }
    const n = Math.min(this.cell, f) - 14 * 2, o = (this.cell - n) / 2, l = (f - n) / 2, u = h && this.highlight && !this.highlight.has(`${h[0]},${h[1]}`);
    if (e.save(), u && (e.globalAlpha = 0.45), a > 0.05) {
      e.globalAlpha = 0.55;
      const _ = 1 + a * 0.6, m = n * _, p = (m - n) / 2;
      e.drawImage(c, r + o, i + l - p, n, m), e.globalAlpha = 0.35, e.drawImage(c, r + o, i + l - p - a * 40, n, m);
    } else
      e.drawImage(c, r + o, i + l, n, n), d && d.label && this.drawLabel(e, d.label, r + this.cell / 2, i + this.cell - 22);
    e.restore();
  }
  drawLabel(e, t, r, i, a = 34) {
    e.save(), e.font = `400 ${a}px "Luckiest Guy", "Lilita One", Impact`, e.textAlign = "center", e.textBaseline = "middle", e.lineJoin = "round", e.lineWidth = 8, e.strokeStyle = "#4a2a00", e.strokeText(t, r, i);
    const h = e.createLinearGradient(0, i - a / 2, 0, i + a / 2);
    h.addColorStop(0, "#fff2a8"), h.addColorStop(0.5, "#ffd84a"), h.addColorStop(1, "#d08a00"), e.fillStyle = h, e.fillText(t, r, i), e.restore();
  }
  drawWildReel(e, t, r, i) {
    const a = this.wildAnim.get(t), h = a ? we.outBack(a.p) : 1, d = de.lep_full;
    if (!d) return;
    const c = t * this.cell, f = c + this.cell / 2, w = this.h / 2;
    e.save();
    const n = e.createLinearGradient(c, 0, c, this.h);
    n.addColorStop(0, "#2a7a3a"), n.addColorStop(1, "#0d3a1c"), e.fillStyle = n, e.fillRect(c + 4, 4, this.cell - 8, this.h - 8), e.strokeStyle = "#ffd84a", e.lineWidth = 6, e.shadowColor = "#ffd84a", e.shadowBlur = 20 + 10 * Math.sin(i * 6), e.strokeRect(c + 6, 6, this.cell - 12, this.h - 12), e.shadowBlur = 0, e.translate(f, w), e.scale(h, h), e.translate(-f, -w);
    const o = this.h - 60, l = o * d.width / d.height, u = Math.min(l, this.cell * 1.25), _ = u * d.height / d.width;
    if (e.drawImage(d, f - u / 2, this.h - 20 - _, u, _), this.drawLabel(e, "WILD", f, this.h - 30, 44), r.mult > 1) {
      const m = "x" + r.mult;
      e.font = '400 72px "Luckiest Guy", Impact', e.textAlign = "center", e.textBaseline = "middle", e.lineJoin = "round", e.lineWidth = 12, e.strokeStyle = "#0b3a12", e.strokeText(m, f, this.h * 0.62), e.fillStyle = "#7dff6a", e.fillText(m, f, this.h * 0.62);
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
    r.forEach((h, d) => i.push([(d + 0.5) * this.cell, (h + 0.5) * this.pitch])), i.push([this.w + 40, (r[this.reelsN - 1] + 0.5) * this.pitch]);
    const a = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    a.setAttribute("points", i.map((h) => h.join(",")).join(" ")), t && a.setAttribute("class", t), this.svg.appendChild(a), this.markers.l[e].classList.add("on"), this.markers.r[e].classList.add("on");
  }
}
function Sn(s, e, t, r, i, a) {
  s.beginPath(), s.moveTo(e + a, t), s.arcTo(e + r, t, e + r, t + i, a), s.arcTo(e + r, t + i, e, t + i, a), s.arcTo(e, t + i, e, t, a), s.arcTo(e, t, e + r, t, a), s.closePath();
}
class Mn {
  constructor(e, t = null) {
    this.c = e, this.ctx = e.getContext("2d"), this.image = t, this.coins = [], this.active = !1, this.raf = 0, this.rate = 3;
  }
  start(e = 3) {
    this.rate = e, this.active = !0, this.raf || (this.last = performance.now(), this.raf = requestAnimationFrame((t) => this.frame(t)));
  }
  stop() {
    this.active = !1;
  }
  clear() {
    this.active = !1, this.coins = [], this.ctx.clearRect(0, 0, this.c.width, this.c.height), this.raf && cancelAnimationFrame(this.raf), this.raf = 0;
  }
  frame(e) {
    const t = Math.min(0.05, (e - this.last) / 1e3);
    this.last = e;
    const r = this.image || de.sym_coin;
    for (this.acc = (this.acc || 0) + (this.active ? this.rate : 0); this.acc >= 1; )
      this.acc -= 1, this.coins.push({ x: Math.random() * this.c.width, y: -100, vx: (Math.random() - 0.5) * 200, vy: 100 + Math.random() * 300, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 8, s: 44 + Math.random() * 50 });
    const i = this.ctx;
    i.clearRect(0, 0, this.c.width, this.c.height), this.coins = this.coins.filter((a) => a.y < this.c.height + 100);
    for (const a of this.coins)
      a.vy += 900 * t, a.x += a.vx * t, a.y += a.vy * t, a.r += a.vr * t, i.save(), i.translate(a.x, a.y), i.rotate(a.r), i.scale(Math.cos(a.r * 1.7), 1), r && r.complete !== !1 && (r.naturalWidth || r.width) && i.drawImage(r, -a.s / 2, -a.s / 2, a.s, a.s), i.restore();
    this.active || this.coins.length ? this.raf = requestAnimationFrame((a) => this.frame(a)) : this.raf = 0;
  }
}
const K = ["blank", "0", "1", "5", "10", "00"], ye = ["x1", "x2", "x5", "x10", "replace", "bank", "wheel"];
function He(s, e) {
  const t = Math.max(0, e.indexOf(s)), r = e[(t + e.length - 1) % e.length] ?? s, i = e[(t + 1) % e.length] ?? s;
  return [r, s, i];
}
function oe(s, e) {
  const t = [];
  for (let r = 0; r < e; r++) t.push(...s);
  return t;
}
function J(s) {
  const e = new Image();
  return e.src = D(s), e;
}
class Tn {
  view = null;
  rain = null;
  reels = null;
  wheel = null;
  big = null;
  bigArt = null;
  frame = null;
  cost = 10;
  wasSpinning = !1;
  armed = !1;
  held = [null, null, null, null];
  wheelArt = null;
  wheelFace = null;
  pointerArt = null;
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
    const a = document.createElement("div");
    a.id = "rays";
    const h = document.createElement("canvas");
    h.id = "coins", h.width = 960, h.height = 540;
    const d = document.createElement("img");
    d.id = "bigwin-art", d.alt = "";
    const c = document.createElement("p");
    c.id = "plate-amount";
    const f = document.createElement("button");
    f.id = "bigwin-skip", f.type = "button", f.textContent = "Skip", f.addEventListener("click", () => {
      document.getElementById("reveal")?.dispatchEvent(new MouseEvent("click", { bubbles: !0 }));
    }), i.append(a, h, d, c, f);
    const w = document.getElementById("overlay") ?? e, n = document.getElementById("wheel-host");
    e.append(t), (n ?? e).append(r), w.append(i), this.reels = t, this.wheel = r, this.big = i, this.bigArt = d;
    for (const [l, u] of Object.entries(I.symbols)) this.symbols.set(l, J(u));
    this.wheelArt = J(I.wheel), this.wheelFace = J(I.wheelFace), this.pointerArt = J(I.pointer);
    const o = J(I.coin);
    this.view = new xn(t, null, null, null, {
      reels: 4,
      rows: 3,
      cell: 104,
      cellH: 132,
      paylines: [],
      well: ["#123832", "#071614"],
      plain: !0,
      symbolFill: !0,
      symbolArt: (l) => {
        const u = this.symbols.get(l);
        return u && u.complete && u.naturalWidth > 0 ? u : null;
      }
    }), this.view.setStrips(
      [oe(K, 4), oe(K, 4), oe(K, 4), oe(ye, 3)],
      [1, 2, 3, 0]
    ), this.view.onReelStop = () => {
      e.dispatchEvent(new CustomEvent("auric-land", { bubbles: !0 }));
    }, this.rain = new Mn(h, o), this.resize();
  }
  setHidden(e) {
    this.view && (this.view.paused = e), e && this.rain?.stop();
  }
  render(e, t) {
    this.frame = e, this.cost = t;
    const r = this.view;
    if (!r) return;
    const i = e.spinning.some(Boolean), a = [e.tokens[0], e.tokens[1], e.tokens[2], e.modifier], h = a.every((d) => d !== null);
    if (i && !this.wasSpinning && !e.reduced) {
      const d = document.getElementById("turbo")?.checked === !0;
      r.spin({ stagger: d ? 0.05 : 0.1 }), this.armed = !0, this.held.fill(null);
      const c = document.getElementById("reel-sweep");
      c && (c.classList.remove("go"), c.offsetWidth, c.classList.add("go"));
    }
    this.armed && !e.reduced ? (a.forEach((d, c) => {
      if (d !== null && !e.spinning[c] && this.held[c] !== d) {
        this.held[c] = d;
        const f = c < 3 ? K : ye;
        r.landReel(c, [3, 5, 7, 2][c] ?? 0, He(d, f));
      }
    }), !i && h && (this.armed = !1)) : h && !r.isSpinning() && a.join("|") !== this.held.join("|") && (r.setStrips(a.map((d, c) => He(d, c < 3 ? K : ye)), [0, 0, 0, 0]), a.forEach((d, c) => {
      this.held[c] = d;
    })), this.wasSpinning = i, r.glowReels.clear(), e.anticipation && !e.reduced && e.spinning.forEach((d, c) => {
      d && r.glowReels.add(c);
    }), this.paintWheel(e), this.paintWin(e);
  }
  /** Wallet amounts are cents. Practice amounts are shown as whole numbers. */
  setMoney(e) {
    this.money = e;
  }
  pointerWedge() {
    return this.frame?.wheel ? Ze(this.frame.wheel.rotation) : null;
  }
  /** Keeps the idle lamp chase moving between receipts. */
  tick(e) {
    this.paintWheel(e);
  }
  resize() {
    const e = this.big?.querySelector("canvas");
    e && (e.width = Math.max(320, window.innerWidth), e.height = Math.max(180, window.innerHeight));
    const t = this.wheel, r = document.getElementById("wheel-host");
    if (t && r) {
      const i = Math.max(160, Math.floor(Math.min(r.clientWidth, r.clientHeight)));
      t.width !== i && (t.width = i, t.height = i);
    }
  }
  destroy() {
    this.rain?.clear(), this.view && (this.view.paused = !0), this.view = null, this.big?.remove(), this.wheel?.remove(), this.reels?.parentElement?.replaceChildren();
  }
  paintWheel(e) {
    const t = this.wheel, r = t?.getContext("2d"), i = this.wheelArt;
    if (!t || !r || !i) return;
    const a = t.width, h = a / 2, d = e?.wheel ?? null, c = e?.reduced ?? !1, f = d?.rotation ?? 0;
    r.clearRect(0, 0, a, a), r.save(), r.translate(h, h), r.rotate(f);
    const w = this.wheelFace, n = a * 0.9;
    w && w.complete && w.naturalWidth && r.drawImage(w, -n / 2, -n / 2, n, n);
    const o = a * 0.98;
    i.complete && i.naturalWidth && r.drawImage(i, -o / 2, -o / 2, o, o), r.fillStyle = "#fff6d8", r.strokeStyle = "#3a2200", r.lineWidth = Math.max(3, a * 0.013), r.lineJoin = "round", r.miterLimit = 2, r.textBaseline = "middle", r.shadowColor = "rgba(12, 8, 2, 0.9)", ue.forEach((m, p) => {
      const y = (p + 0.5) * (Math.PI * 2 / 8) - Math.PI / 2, v = this.money ? (this.cost * m / 100).toFixed(2) : String(this.cost * m), k = a * 0.16;
      let M = Math.round(a * 0.082);
      for (r.font = `700 ${M}px Auric Serif, serif`; M > Math.round(a * 0.05) && r.measureText(v).width > k; )
        M -= 1, r.font = `700 ${M}px Auric Serif, serif`;
      const T = Math.cos(y) >= 0, P = T ? a * 0.225 : Math.min(a * 0.4, a * 0.225 + r.measureText(v).width);
      r.save(), r.translate(Math.cos(y) * P, Math.sin(y) * P), r.rotate(T ? y : y + Math.PI), r.textAlign = "left", r.shadowBlur = Math.max(2, a * 0.01), r.strokeText(v, 0, 0), r.shadowBlur = 0, r.fillText(v, 0, 0), r.restore();
    }), r.shadowBlur = 0, r.restore();
    const l = this.pointerArt;
    if (l && l.complete && l.naturalWidth) {
      const m = a * 0.24, p = m * (l.naturalHeight / l.naturalWidth);
      r.drawImage(l, h - m / 2, a * 5e-3, m, p);
    }
    const u = !c && (!d || d.spinning || d.lit === null), _ = Math.floor(performance.now() / (d?.spinning ? 70 : 180));
    for (let m = 0; m < 16; m++) {
      const p = u && (m === _ % 16 || m === (_ + 1) % 16), y = d !== null && d.lit !== null && m % 2 === d.lit % 2;
      if (!p && !y) continue;
      const v = m / 16 * Math.PI * 2 - Math.PI / 2;
      r.beginPath(), r.arc(h + Math.cos(v) * a * 0.455, h + Math.sin(v) * a * 0.455, a * 0.018, 0, Math.PI * 2), r.fillStyle = "rgba(255, 246, 216, 0.95)", r.shadowColor = "#e0b15a", r.shadowBlur = 14, r.fill();
    }
    r.shadowBlur = 0;
  }
  paintWin(e) {
    const t = e.reduced ? null : Zt(e.cueTier), r = e.phase === "celebrating" || e.phase === "resolving", i = t !== null && e.hero !== null && e.hero > 0 && r;
    if (!this.big || !this.bigArt) return;
    if (this.big.hidden = !i, !i) {
      this.rain?.stop();
      return;
    }
    const a = I.plates[e.cueTier];
    a && this.bigArt.dataset.tier !== String(e.cueTier) && (this.bigArt.dataset.tier = String(e.cueTier), this.bigArt.src = D(a)), this.rain?.start(e.cueTier >= 4 ? 8 : e.cueTier === 3 ? 5 : 3);
  }
}
const ae = window.matchMedia("(prefers-reduced-motion: reduce)");
function En() {
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
      return Promise.resolve(navigator.locks.request(dn, () => i()));
    }
  }, storage: "durable", notice: null } : {
    kv: t,
    locker: mn(),
    storage: "tab",
    notice: "This browser keeps a separate demo balance in each tab."
  };
}
function b(s) {
  const e = document.getElementById(s);
  if (!e) throw new Error(`missing ${s}`);
  return e;
}
function In() {
  const s = Array.from(document.querySelectorAll("dialog")).filter((e) => e.open);
  return s[s.length - 1] ?? null;
}
function Ln(s) {
  return Array.from(s.querySelectorAll("button, a[href], input, select, textarea")).filter((e) => e.hasAttribute("disabled") || e.getAttribute("aria-hidden") === "true" ? !1 : e.tabIndex >= 0);
}
function O(s) {
  return L(s);
}
function Re(s, e) {
  if (e === null) {
    s.dataset.value !== "" && s.replaceChildren(), s.dataset.value = "";
    return;
  }
  const t = O(e);
  if (s.dataset.value !== t) {
    s.dataset.value = t, s.replaceChildren();
    for (const r of t) {
      const i = document.createElement("span");
      i.className = /\d/.test(r) ? "digit" : "mark", i.textContent = r, s.append(i);
    }
  }
}
function F(s, e) {
  b(s).style.backgroundImage = `url("${D(e)}")`;
}
function $e() {
  const s = window.innerHeight > window.innerWidth, e = b("cabinet");
  e.dataset.orient = s ? "portrait" : "landscape";
  const t = s ? 720 : 1280, r = s ? 1280 : 720;
  e.style.width = `${t}px`, e.style.height = `${r}px`, e.style.backgroundImage = `url("${D(s ? I.cabinetP : I.cabinetL)}")`;
  const i = Math.min(window.innerWidth / t, window.innerHeight / r), a = (window.innerWidth - t * i) / 2, h = (window.innerHeight - r * i) / 2;
  e.style.transform = `translate(${a}px, ${h}px) scale(${i})`, F("spin", I.spin), F("cost-up", I.plus), F("cost-down", I.minus), F("turbo-btn", I.turbo), F("start-auto", I.auto), F("sound-btn", I.sound), F("music-btn", I.music), F("settings-open", I.gear), F("reveal", I.skip), F("stop-auto", I.stop), F("help-open", I.help), F("board-open", I.star);
  const d = `url("${D(I.plaque)}")`, c = s ? "11px 12px" : "16px 18px";
  for (const w of Array.from(document.querySelectorAll(".led, #auto-status, #short, #banner")))
    w.style.borderStyle = "solid", w.style.borderWidth = c, w.style.borderImage = `${d} 78 90 fill / ${c} / 0 stretch`, w.style.background = "transparent";
  const f = s ? "10px 12px" : "12px 16px";
  for (const w of Array.from(document.querySelectorAll("#currency button")))
    w.style.borderStyle = "solid", w.style.borderWidth = f, w.style.borderImage = `${d} 78 90 fill / ${f} / 0 stretch`, w.style.background = "transparent";
  for (const w of Array.from(document.querySelectorAll("dialog")))
    w.style.borderImage = `${d} 70 84 fill / 22px 26px / 0 stretch`;
}
function De() {
  const s = b("bulb-rim"), e = 36;
  if (s.childElementCount !== e) {
    s.replaceChildren();
    for (let i = 0; i < e; i += 1) {
      const a = document.createElement("i");
      a.style.setProperty("--i", String(i)), s.append(a);
    }
  }
  const t = b("cabinet").dataset.orient === "portrait", r = [];
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
    const h = i, d = r[a] ?? r[0];
    h.style.left = `${d[0]}px`, h.style.top = `${d[1]}px`;
  });
}
function Pn(s) {
  const e = s.filter((t) => t !== null);
  return e.length === 0 ? "" : e.some((t) => t === "blank") ? "0" : String(e.reduce((t, r) => t + Te[r], 0));
}
let ve = "";
function Cn(s) {
  const e = b("cabinet"), t = s?.spinning.some(Boolean) ?? !1, r = !!(s && s.cueTier >= 2 && (s.phase === "celebrating" || s.phase === "resolving"));
  e.dataset.energy = s?.reduced ? "idle" : r ? "win" : t ? "spin" : "idle", e.dataset.phase = s?.phase ?? "idle";
  const i = b("feature-banner"), a = b("build-digits"), h = b("build"), d = b("fly");
  if (!s || s.phase === "idle" || s.phase === "onboarding") {
    i.textContent = "", a.textContent = "", a.dataset.len = "", h.classList.remove("slam", "shock", "sparks"), ve = "", d.hidden = !0;
    return;
  }
  if (s.phase === "celebrating" || s.phase === "resolving") {
    i.textContent = "", a.textContent = "", h.classList.remove("slam", "shock", "sparks");
    return;
  }
  i.textContent = s.phase === "replace" ? "Replace" : s.phase === "bank" ? "Bank + Add" : s.phase === "wheel" ? "Wheel" : "";
  const c = Pn(s.tokens), f = c.length > (a.dataset.len?.length ?? 0);
  a.dataset.len = c;
  const w = s.modifier === "x2" ? 2 : s.modifier === "x5" ? 5 : s.modifier === "x10" ? 10 : 0, n = `${s.receiptId}:${s.modifier ?? ""}`;
  if (w > 1 && s.cueTier > 0 && s.reading !== null && !s.reduced)
    a.textContent = String(Number(s.reading) * w), f && a.classList.add("flash"), ve !== n && (ve = n, h.classList.remove("slam", "shock"), h.offsetWidth, h.classList.add("slam", "shock"));
  else if (s.phase === "bank") {
    const u = s.lines.find((m) => m.label === "Locked base")?.amount ?? 0, _ = s.lines.filter((m) => m.label.startsWith("Added")).reduce((m, p) => m + (p.amount ?? 0), 0);
    a.textContent = u || _ ? O(u + _) : c, f && a.classList.add("flash");
  } else {
    const u = s.spinning.some(Boolean) || s.tokens.some((_) => _ === null);
    a.textContent = u ? c : "", f && u && a.classList.add("flash");
  }
  const o = s.tokens.every((u) => u !== null) && !!s.reading;
  h.classList.toggle("sparks", o && !s.reduced);
  const l = s.lines.find((u) => u.label === "Wheel prize");
  l && l.amount !== null && !s.reduced && d.dataset.value !== String(l.amount) && (d.dataset.value = String(l.amount), d.hidden = !1, d.textContent = O(l.amount), d.classList.remove("go"), d.offsetWidth, d.classList.add("go")), l || (d.dataset.value = "", d.hidden = !0, d.classList.remove("go"));
}
function Nn(s) {
  const e = Math.floor(s / 1e3), t = Math.floor(e / 60), r = e % 60;
  return `${t}:${r.toString().padStart(2, "0")}`;
}
async function Bn() {
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
function ke(s, e) {
  const t = b("lines");
  t.replaceChildren();
  const r = s?.lines ?? [{ label: "Cost", amount: e, text: O(e), strike: !1 }], i = r.length === 1 && r[0]?.label === "Cost" ? [] : r;
  for (const d of i) {
    const c = document.createElement("div");
    c.className = d.strike ? "line strike" : "line";
    const f = document.createElement("span");
    f.textContent = d.label;
    const w = document.createElement("span");
    w.textContent = d.text, c.append(f, w), t.append(c);
  }
  const a = s == null || s.netText === "Net pending";
  Re(b("hero"), s?.hero ?? (a ? 0 : null));
  const h = document.getElementById("plate-amount");
  h && Re(h, s?.hero ?? null), b("total-label").textContent = s?.totalLabel ?? "Total", b("net").textContent = s?.netText ?? "Net pending", b("meter").textContent = s?.meterFlourish ? "10/10 energy flourish, no credit reward" : `${s?.meterFilled ?? 0}/10`;
}
function Fn(s) {
  let e = z();
  try {
    e = St(s.get(Be));
  } catch {
    e = z();
  }
  const t = b("handle");
  t.value = e.handle;
  const r = b("wordmark");
  r.src = D(I.logo);
  const i = document.getElementById("onboard-logo");
  i instanceof HTMLImageElement && (i.src = D(I.logo));
  const a = document.getElementById("help-logo");
  a instanceof HTMLImageElement && (a.src = D(I.logo));
  const h = document.getElementById("help-wheel");
  h instanceof HTMLImageElement && (h.src = D(I.wheel));
  const d = () => {
    const f = It(e), w = xt(f?.wins ?? 0);
    b("board-level").textContent = f ? `Level ${w.level} ${w.name}. Wins ${f.wins}. Biggest net ${O(f.biggestWin)}. Today's best net ${O(f.dayBest)}.` : `Level ${w.level} ${w.name}. No scored play yet.`;
    const n = b("board-body");
    n.replaceChildren();
    const o = [
      ["Biggest net", "biggestWin"],
      ["Highest session net", "highestSession"],
      ["Wins", "wins"],
      ["Today's best net", "dayBest"]
    ];
    for (const [_, m] of o) {
      const p = document.createElement("h3");
      p.textContent = _;
      const y = document.createElement("table");
      Lt(e.rows, m).forEach((v, k) => {
        const M = document.createElement("tr");
        for (const T of [String(k + 1), v.handle, m === "wins" ? String(v.wins) : O(v[m])]) {
          const P = document.createElement("td");
          P.textContent = T, M.append(P);
        }
        y.append(M);
      }), n.append(p, y);
    }
    const l = document.createElement("p"), u = kt.filter((_) => e.achievements.includes(_.id)).map((_) => _.label);
    l.textContent = u.length ? u.join(", ") : "No achievements yet.", n.append(l);
  }, c = () => {
    try {
      s.set(Be, Mt(e));
    } catch {
    }
  };
  return t.addEventListener("change", () => {
    e = { ...e, handle: Ve(t.value) }, t.value = e.handle, c(), d();
  }), b("board-open").addEventListener("click", () => {
    d();
    const f = b("board-dialog");
    f.open || f.showModal(), queueMicrotask(() => b("board-close").focus());
  }), b("board-close").addEventListener("click", () => b("board-dialog").close()), d(), {
    note(f, w) {
      if (!f || w) return;
      const n = Et(e, {
        id: f.id,
        net: f.net,
        cost: f.cost,
        sessionNet: f.sessionNet,
        modifier: f.modifier,
        flourish: f.flourish,
        at: Date.now()
      });
      n !== e && (e = n, c(), d());
    }
  };
}
function On() {
  const s = En(), e = Fn(s.kv), t = new vt((g) => {
    b("banner").hidden = !1, b("banner").textContent = g;
  });
  t.load();
  const r = new Tn(), i = new ln(_n());
  let a = null, h = !1, d;
  d = new wn(
    s.kv,
    s.locker,
    i,
    t,
    (g) => {
      a = g, r.render(g, g.cost), ke(g, g.cost), b("balance").textContent = O(g.balanceShown), b("session").textContent = O(g.sessionNetShown), h && T();
    },
    (g) => {
      b("live").textContent = g;
    },
    performance.now(),
    s.storage,
    ae.matches
  ), h = !0, s.notice && v(s.notice), d.resetReason && v("Saved demo data could not be read, so the demo credits were reset.");
  const c = b("spin");
  let f = Ge(), w = null, n = 0;
  c.addEventListener("pointerdown", (g) => {
    g.button === 0 && (f = ut(performance.now()), w = null, window.clearInterval(n), n = window.setInterval(() => {
      f = ht(f, performance.now());
    }, 40));
  }), c.addEventListener("pointerup", (g) => {
    window.clearInterval(n);
    const A = g.target === c || c.contains(g.target), S = ft(f, A);
    f = S.hold, w = S.action, window.setTimeout(() => {
      w = null;
    }, 0);
  }), c.addEventListener("pointercancel", () => {
    window.clearInterval(n), f = se(f), w = "none";
  }), c.addEventListener("pointerleave", () => {
    f.phase !== "idle" && (f = se(f), w = "none");
  }), c.addEventListener("blur", () => {
    window.clearInterval(n), f = se(f);
  }), c.addEventListener("click", () => {
    const g = pt(w);
    w = null, g === "spin" && d.spin(), g === "autoplay" && d.startAuto(d.status().autoplayCount), T();
  }), c.addEventListener("keydown", (g) => {
    g.key === "Escape" && (f = se(f), w = "none");
  }), b("reveal").addEventListener("click", () => {
    d.reveal(), T();
  }), b("start-auto").addEventListener("click", () => {
    d.startAuto(d.status().autoplayCount), T();
  }), b("stop-auto").addEventListener("click", () => {
    d.stopAutoplay(), T();
  });
  const o = () => {
    if (d.status().locked) return;
    b("reset-dialog").showModal(), queueMicrotask(() => b("reset-cancel").focus());
  };
  b("reset").addEventListener("click", o), b("short-reset").addEventListener("click", o), b("reset-confirm").addEventListener("click", () => {
    d.reset().then(() => {
      b("reset-dialog").close(), a = null, ke(null, d.status().cost), T();
    });
  }), b("reset-cancel").addEventListener("click", () => b("reset-dialog").close());
  let l = null;
  b("help-open").addEventListener("click", () => {
    l = b("help-open"), k();
  }), b("help-close").addEventListener("click", () => b("help-dialog").close()), b("help-dialog").addEventListener("close", () => {
    d.noteHelp(!1);
    const g = b("onboard-dialog");
    if (!d.status().onboarded) {
      g.open || g.showModal(), queueMicrotask(() => b("onboard-start").focus());
      return;
    }
    (l ?? c).focus();
  }), b("onboard-help").addEventListener("click", () => {
    l = b("onboard-start"), k();
  }), b("onboard-start").addEventListener("click", () => {
    d.finishOnboarding(), b("onboard-dialog").close(), T(), c.focus();
  });
  const u = (g) => {
    const A = Array.from(document.querySelectorAll('input[name="cost"]')), S = A.findIndex((N) => N.checked), x = A[S + g];
    !x || x.disabled || (x.checked = !0, x.dispatchEvent(new Event("change", { bubbles: !0 })));
  };
  b("cost-down").addEventListener("click", () => u(-1)), b("cost-up").addEventListener("click", () => u(1)), b("exit").addEventListener("click", () => {
    yn({ type: "close" });
  });
  for (const g of Array.from(document.querySelectorAll('input[name="cost"]')))
    g.addEventListener("change", () => {
      g.checked && (d.setCost(Number(g.value)), T());
    });
  b("turbo").addEventListener("change", (g) => {
    d.setTurbo(g.target.checked);
  }), b("muted").addEventListener("change", (g) => {
    d.setAudioPrefs({ muted: g.target.checked }), M();
  }), b("music").addEventListener("change", (g) => {
    d.setAudioPrefs({ music: g.target.checked }), M();
  }), b("effects").addEventListener("change", (g) => {
    d.setAudioPrefs({ effects: g.target.checked }), M();
  }), b("reduced").addEventListener("change", (g) => {
    const A = g.target.value;
    d.setReduced(A === "device" ? null : A === "reduce"), T();
  }), b("auto-count").addEventListener("change", (g) => {
    d.setAutoCount(Number(g.target.value));
  }), document.addEventListener("keydown", (g) => {
    const A = In();
    if (A) {
      if (g.key === "Escape") {
        g.preventDefault(), A.close();
        return;
      }
      if (g.key === "Tab") {
        const x = Ln(A);
        if (x.length > 0) {
          g.preventDefault();
          const N = x.indexOf(document.activeElement), E = g.shiftKey ? -1 : 1;
          x[(N + E + x.length) % x.length].focus();
        }
      }
      return;
    }
    if (g.key !== " " && g.key !== "Enter") return;
    const S = g.target;
    !S || S.closest("dialog, input, select, textarea, button, a") || S.closest("#play-surface") && (g.preventDefault(), d.spin(), T());
  });
  const _ = () => t.unlock();
  window.addEventListener("pointerdown", _, { once: !1 }), window.addEventListener("keydown", _), document.addEventListener("visibilitychange", () => {
    const g = document.hidden;
    d.setHidden(g), t.setHidden(g), r.setHidden(g);
  }), window.addEventListener("blur", () => {
    d.setHidden(!0), t.setHidden(!0);
  }), window.addEventListener("focus", () => {
    document.hidden || (d.setHidden(!1), t.setHidden(!1));
  }), ae.addEventListener("change", () => {
    d.osReduced = ae.matches;
  });
  let m = performance.now(), p = -1;
  const y = (g) => {
    const A = Math.min(100, g - m);
    m = g, d.advance(A);
    const S = Math.floor(d.status().activeMs / 1e3);
    S !== p && (p = S, b("time").textContent = Nn(d.status().activeMs)), r.tick(a), T(), requestAnimationFrame(y);
  };
  function v(g) {
    const A = b("banner");
    A.hidden = !1, A.textContent = g;
  }
  function k() {
    d.noteHelp(!0);
    const g = b("onboard-dialog");
    g.open && g.close();
    const A = b("help-dialog");
    A.open || A.showModal(), A.scrollTop = 0, queueMicrotask(() => b("help-title").focus());
  }
  function M() {
    const g = d.status();
    t.setPrefs(g.muted, g.music, g.effects), t.setPresenting(g.locked);
  }
  function T() {
    const g = d.status();
    b("session").textContent = O(a?.sessionNetShown ?? g.sessionNet), b("balance").textContent = O(a?.balanceShown ?? g.balance), c.disabled = g.locked || !g.onboarded, b("reveal").disabled = !g.reveal, b("start-auto").disabled = g.locked || !g.onboarded, b("reset").disabled = g.locked, b("stop-auto").disabled = g.autoRemaining === null;
    for (const V of Array.from(document.querySelectorAll('input[name="cost"]')))
      V.disabled = g.locked, V.checked = Number(V.value) === g.cost;
    b("turbo").checked = g.turbo, b("turbo").disabled = g.locked, b("turbo-btn").setAttribute("aria-pressed", String(g.turbo)), b("turbo-btn").disabled = g.locked, b("sound-btn").setAttribute("aria-pressed", String(!g.muted)), b("music-btn").setAttribute("aria-pressed", String(g.music)), b("muted").checked = g.muted, b("music").checked = g.music, b("effects").checked = g.effects;
    const A = b("reduced");
    A.value = g.reducedMotion === null ? "device" : g.reducedMotion ? "reduce" : "allow", b("auto-count").value = String(g.autoplayCount), b("auto-count").disabled = g.locked;
    const S = b("auto-status");
    S.textContent = g.autoRemaining === null ? "Autoplay off" : `Autoplay ${g.autoRemaining} left`;
    const x = g.message ?? g.warning ?? "", E = !g.locked && g.balance < g.cost || x.includes("Not enough");
    S.hidden = E;
    const B = b("note");
    B.textContent = E ? "" : x, B.hidden = E || x === "", b("short").hidden = !E, b("short-text").textContent = x || "Not enough for this cost.", b("short-reset").hidden = !d.allowsReset(), b("reset").hidden = !d.allowsReset(), M(), e.note(d.receiptView(), g.locked), b("cost-read").textContent = O(g.cost), b("cost-down").disabled = g.locked || g.cost <= 10, b("cost-up").disabled = g.locked || g.cost >= 100;
    const q = g.reducedMotion === !0 || g.reducedMotion === null && ae.matches;
    b("cabinet").dataset.motion = (g.locked ? a?.reduced : q) ? "reduce" : "allow", t.setReelLoop(!!(a && a.spinning.some(Boolean) && !a.reduced)), Cn(a);
  }
  function P() {
    const g = b("help-body");
    for (const A of Dt()) {
      const S = document.createElement("h3");
      S.textContent = A.heading;
      const x = document.createElement("p");
      x.textContent = A.body, g.append(S, x);
    }
  }
  P(), $e(), De(), window.addEventListener("resize", () => {
    $e(), De(), r.resize();
  }), ke(null, d.status().cost), b("stage").addEventListener("auric-land", () => {
    const g = b("build-digits");
    g.classList.remove("flash"), g.offsetWidth, g.classList.add("flash");
  });
  const C = (g, A) => {
    b(A).addEventListener("click", () => {
      const S = b(g);
      S.disabled || (S.checked = !S.checked, S.dispatchEvent(new Event("change", { bubbles: !0 })));
    });
  };
  C("turbo", "turbo-btn"), C("muted", "sound-btn"), C("music", "music-btn"), b("settings-open").addEventListener("click", () => {
    const g = b("settings-dialog");
    g.open || g.showModal(), queueMicrotask(() => b("settings-close").focus());
  }), b("settings-close").addEventListener("click", () => b("settings-dialog").close()), Bn().then(() => r.mount(b("stage"))).then(() => {
    document.getElementById("boot")?.remove(), r.resize(), r.tick(a), a && r.render(a, a.cost);
  }), ot(() => [
    ["Big", [9700, 9700, 2200, 0]],
    ["Mega", [9700, 9200, 9200, 8e3]],
    ["Epic", [9700, 9700, 9700, 8700]],
    ["Wheel", [2200, 7269, 2200, 9920, 7]]
  ].map(([g, A]) => ({
    label: g,
    run: () => {
      let S = 0;
      const x = Ue({
        nextInt(q) {
          const V = A[S++] ?? 0;
          return V >= q ? 0 : V;
        }
      }, 10, 0), N = Se(x, "normal", "fx"), E = fe({
        outcome: x,
        schedule: N,
        elapsed: N.totalMs,
        balanceAfter: 0,
        sessionNetAfter: 0
      }), B = G(x.net, x.cost);
      r.render({
        ...E,
        phase: x.modifier === "wheel" ? "wheel" : B >= 2 ? "celebrating" : E.phase,
        hero: x.gross,
        cueTier: B
      }, x.cost);
    }
  })), "#e0b15a"), d.status().onboarded || d.finishOnboarding(), b("exit").hidden = !0, b("currency").hidden = !0, T(), requestAnimationFrame(y), window.addEventListener("pagehide", () => {
    d.destroy().then(() => {
      t.destroy(), r.destroy();
    });
  });
}
On();
