const v = {
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
  skip: "assets/art/raster/btn-skip.webp",
  stop: "assets/art/raster/btn-stop-normal.webp",
  stopPressed: "assets/art/raster/btn-stop-pressed.webp",
  help: "assets/art/raster/btn-help-normal.webp",
  helpPressed: "assets/art/raster/btn-help-pressed.webp",
  star: "assets/art/raster/btn-star.webp",
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
function R(s) {
  const e = globalThis.__auricAsset;
  return typeof e == "function" ? e(s) : new URL(s, window.location.href).href;
}
function ft() {
  try {
    return new URLSearchParams(location.search).has("fx");
  } catch {
    return !1;
  }
}
function pt(s, e = "#2fd0ff") {
  if (!ft() || document.getElementById("fx-panel")) return;
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
      const c = mt(s);
      if (h = c.length > 0, a.textContent = "", !h) {
        const d = document.createElement("div");
        d.style.cssText = "max-width:220px;white-space:normal;padding:4px 6px;color:#9fb0cc;font-weight:500", d.textContent = "The game has not finished starting. Some games need a lobby (open with ?brand=). Reopen this panel once it has.", a.appendChild(d);
      }
      for (const d of c) {
        const p = document.createElement("button");
        p.type = "button", p.textContent = d.label, p.onclick = () => {
          try {
            Promise.resolve(d.run()).catch((b) => console.error("[fx]", d.label, b));
          } catch (b) {
            console.error("[fx]", d.label, b);
          }
        }, a.appendChild(p);
      }
    }
    a.classList.toggle("open");
  };
}
function mt(s) {
  try {
    return s();
  } catch (e) {
    return console.error("[fx] building the case list failed", e), [];
  }
}
const Se = {
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
}, ye = 2e3 / 2400, Je = 2, _t = Se.holdMs, gt = Se.cycleFloorMs, bt = [10, 25, 50];
function Be(s) {
  return bt.includes(s);
}
function ze() {
  return { phase: "idle", downAt: 0 };
}
function wt(s) {
  return { phase: "pressing", downAt: s };
}
function yt(s, e) {
  return s.phase === "pressing" && e - s.downAt >= _t ? { ...s, phase: "armed" } : s;
}
function fe(s) {
  return s.phase === "idle" ? s : { ...s, phase: "cancelled" };
}
function vt(s, e) {
  const t = ze();
  return s.phase === "idle" || s.phase === "cancelled" || !e ? { hold: t, action: "none" } : s.phase === "armed" ? { hold: t, action: "autoplay" } : { hold: t, action: "spin" };
}
function kt(s, e) {
  return s !== null ? s : "spin";
}
function At(s, e) {
  return Math.max(e, s + gt);
}
function St(s, e) {
  return s ? s.modifier === "replace" || s.modifier === "bank" || s.modifier === "wheel" ? s.modifier : s.collectionFlourish ? "collection" : e.remaining <= 0 ? "count" : null : null;
}
var ae = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Te = {};
var Ve;
function xt() {
  return Ve || (Ve = 1, (function(s) {
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
                for (var u = o._howls[l]._getSoundIds(), f = 0; f < u.length; f++) {
                  var _ = o._howls[l]._soundById(u[f]);
                  _ && _._node && (_._node.volume = _._volume * n);
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
              for (var u = o._howls[l]._getSoundIds(), f = 0; f < u.length; f++) {
                var _ = o._howls[l]._soundById(u[f]);
                _ && _._node && (_._node.muted = n ? !0 : _._muted);
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
          var l = o.canPlayType("audio/mpeg;").replace(/^no$/, ""), u = n._navigator ? n._navigator.userAgent : "", f = u.match(/OPR\/(\d+)/g), _ = f && parseInt(f[0].split("/")[1], 10) < 33, m = u.indexOf("Safari") !== -1 && u.indexOf("Chrome") === -1, y = u.match(/Version\/(.*?) /), k = m && y && parseInt(y[1], 10) < 15;
          return n._codecs = {
            mp3: !!(!_ && (l || o.canPlayType("audio/mp3;").replace(/^no$/, ""))),
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
            weba: !!(!k && o.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")),
            webm: !!(!k && o.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")),
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
              for (var f = 0; f < n._howls.length; f++)
                if (!n._howls[f]._webAudio)
                  for (var _ = n._howls[f]._getSoundIds(), m = 0; m < _.length; m++) {
                    var y = n._howls[f]._soundById(_[m]);
                    y && y._node && !y._node._unlocked && (y._node._unlocked = !0, y._node.load());
                  }
              n._autoResume();
              var k = n.ctx.createBufferSource();
              k.buffer = n._scratchBuffer, k.connect(n.ctx.destination), typeof k.start > "u" ? k.noteOn(0) : k.start(0), typeof n.ctx.resume == "function" && n.ctx.resume(), k.onended = function() {
                k.disconnect(0), n._audioUnlocked = !0, document.removeEventListener("touchstart", o, !0), document.removeEventListener("touchend", o, !0), document.removeEventListener("click", o, !0), document.removeEventListener("keydown", o, !0);
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
            var u, f;
            if (n._format && n._format[l])
              u = n._format[l];
            else {
              if (f = n._src[l], typeof f != "string") {
                n._emit("loaderror", null, "Non-string found in selected audio sources - ignoring.");
                continue;
              }
              u = /^data:audio\/([^;,]+);/i.exec(f), u || (u = /\.([^.]+)$/.exec(f.split("?", 1)[0])), u && (u = u[1].toLowerCase());
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
              for (var f = 0, _ = 0; _ < l._sounds.length; _++)
                l._sounds[_]._paused && !l._sounds[_]._ended && (f++, u = l._sounds[_]._id);
              f === 1 ? n = null : u = null;
            }
          }
          var m = u ? l._soundById(u) : l._inactiveSound();
          if (!m)
            return null;
          if (u && !n && (n = m._sprite || "__default"), l._state !== "loaded") {
            m._sprite = n, m._ended = !1;
            var y = m._id;
            return l._queue.push({
              event: "play",
              action: function() {
                l.play(y);
              }
            }), y;
          }
          if (u && !m._paused)
            return o || l._loadQueue("play"), m._id;
          l._webAudio && t._autoResume();
          var k = Math.max(0, m._seek > 0 ? m._seek : l._sprite[n][0] / 1e3), A = Math.max(0, (l._sprite[n][0] + l._sprite[n][1]) / 1e3 - k), E = A * 1e3 / Math.abs(m._rate), B = l._sprite[n][0] / 1e3, O = (l._sprite[n][0] + l._sprite[n][1]) / 1e3;
          m._sprite = n, m._ended = !1;
          var q = function() {
            m._paused = !1, m._seek = k, m._start = B, m._stop = O, m._loop = !!(m._loop || l._sprite[n][2]);
          };
          if (k >= O) {
            l._ended(m);
            return;
          }
          var x = m._node;
          if (l._webAudio) {
            var Z = function() {
              l._playLock = !1, q(), l._refreshBuffer(m);
              var C = m._muted || l._muted ? 0 : m._volume;
              x.gain.setValueAtTime(C, t.ctx.currentTime), m._playStart = t.ctx.currentTime, typeof x.bufferSource.start > "u" ? m._loop ? x.bufferSource.noteGrainOn(0, k, 86400) : x.bufferSource.noteGrainOn(0, k, A) : m._loop ? x.bufferSource.start(0, k, 86400) : x.bufferSource.start(0, k, A), E !== 1 / 0 && (l._endTimers[m._id] = setTimeout(l._ended.bind(l, m), E)), o || setTimeout(function() {
                l._emit("play", m._id), l._loadQueue();
              }, 0);
            };
            t.state === "running" && t.ctx.state !== "interrupted" ? Z() : (l._playLock = !0, l.once("resume", Z), l._clearTimer(m._id));
          } else {
            var Y = function() {
              x.currentTime = k, x.muted = m._muted || l._muted || t._muted || x.muted, x.volume = m._volume * t.volume(), x.playbackRate = m._rate;
              try {
                var C = x.play();
                if (C && typeof Promise < "u" && (C instanceof Promise || typeof C.then == "function") ? (l._playLock = !0, q(), C.then(function() {
                  l._playLock = !1, x._unlocked = !0, o ? l._loadQueue() : l._emit("play", m._id);
                }).catch(function() {
                  l._playLock = !1, l._emit("playerror", m._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction."), m._ended = !0, m._paused = !0;
                })) : o || (l._playLock = !1, q(), l._emit("play", m._id)), x.playbackRate = m._rate, x.paused) {
                  l._emit("playerror", m._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
                  return;
                }
                n !== "__default" || m._loop ? l._endTimers[m._id] = setTimeout(l._ended.bind(l, m), E) : (l._endTimers[m._id] = function() {
                  l._ended(m), x.removeEventListener("ended", l._endTimers[m._id], !1);
                }, x.addEventListener("ended", l._endTimers[m._id], !1));
              } catch (F) {
                l._emit("playerror", m._id, F);
              }
            };
            x.src === "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA" && (x.src = l._src, x.load());
            var P = window && window.ejecta || !x.readyState && t._navigator.isCocoonJS;
            if (x.readyState >= 3 || P)
              Y();
            else {
              l._playLock = !0, l._state = "loading";
              var J = function() {
                l._state = "loaded", Y(), x.removeEventListener(t._canPlayEvent, J, !1);
              };
              x.addEventListener(t._canPlayEvent, J, !1), l._clearTimer(m._id);
            }
          }
          return m._id;
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
            var f = o._soundById(l[u]);
            if (f && !f._paused && (f._seek = o.seek(l[u]), f._rateSeek = 0, f._paused = !0, o._stopFade(l[u]), f._node))
              if (o._webAudio) {
                if (!f._node.bufferSource)
                  continue;
                typeof f._node.bufferSource.stop > "u" ? f._node.bufferSource.noteOff(0) : f._node.bufferSource.stop(0), o._cleanBuffer(f._node);
              } else (!isNaN(f._node.duration) || f._node.duration === 1 / 0) && f._node.pause();
            arguments[1] || o._emit("pause", f ? f._id : null);
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
          for (var u = l._getSoundIds(n), f = 0; f < u.length; f++) {
            l._clearTimer(u[f]);
            var _ = l._soundById(u[f]);
            _ && (_._seek = _._start || 0, _._rateSeek = 0, _._paused = !0, _._ended = !0, l._stopFade(u[f]), _._node && (l._webAudio ? _._node.bufferSource && (typeof _._node.bufferSource.stop > "u" ? _._node.bufferSource.noteOff(0) : _._node.bufferSource.stop(0), l._cleanBuffer(_._node)) : (!isNaN(_._node.duration) || _._node.duration === 1 / 0) && (_._node.currentTime = _._start || 0, _._node.pause(), _._node.duration === 1 / 0 && l._clearSound(_._node))), o || l._emit("stop", _._id));
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
          for (var u = l._getSoundIds(o), f = 0; f < u.length; f++) {
            var _ = l._soundById(u[f]);
            _ && (_._muted = n, _._interval && l._stopFade(_._id), l._webAudio && _._node ? _._node.gain.setValueAtTime(n ? 0 : _._volume, t.ctx.currentTime) : _._node && (_._node.muted = t._muted ? !0 : n), l._emit("mute", _._id));
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
            var f = n._getSoundIds(), _ = f.indexOf(o[0]);
            _ >= 0 ? u = parseInt(o[0], 10) : l = parseFloat(o[0]);
          } else o.length >= 2 && (l = parseFloat(o[0]), u = parseInt(o[1], 10));
          var m;
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
              m = n._soundById(u[y]), m && (m._volume = l, o[2] || n._stopFade(u[y]), n._webAudio && m._node && !m._muted ? m._node.gain.setValueAtTime(l, t.ctx.currentTime) : m._node && !m._muted && (m._node.volume = l * t.volume()), n._emit("volume", m._id));
          } else
            return m = u ? n._soundById(u) : n._sounds[0], m ? m._volume : 0;
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
          var f = this;
          if (f._state !== "loaded" || f._playLock)
            return f._queue.push({
              event: "fade",
              action: function() {
                f.fade(n, o, l, u);
              }
            }), f;
          n = Math.min(Math.max(0, parseFloat(n)), 1), o = Math.min(Math.max(0, parseFloat(o)), 1), l = parseFloat(l), f.volume(n, u);
          for (var _ = f._getSoundIds(u), m = 0; m < _.length; m++) {
            var y = f._soundById(_[m]);
            if (y) {
              if (u || f._stopFade(_[m]), f._webAudio && !y._muted) {
                var k = t.ctx.currentTime, A = k + l / 1e3;
                y._volume = n, y._node.gain.setValueAtTime(n, k), y._node.gain.linearRampToValueAtTime(o, A);
              }
              f._startFadeInterval(y, n, o, l, _[m], typeof u > "u");
            }
          }
          return f;
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
        _startFadeInterval: function(n, o, l, u, f, _) {
          var m = this, y = o, k = l - o, A = Math.abs(k / 0.01), E = Math.max(4, A > 0 ? u / A : u), B = Date.now();
          n._fadeTo = l, n._interval = setInterval(function() {
            var O = (Date.now() - B) / u;
            B = Date.now(), y += k * O, y = Math.round(y * 100) / 100, k < 0 ? y = Math.max(l, y) : y = Math.min(l, y), m._webAudio ? n._volume = y : m.volume(y, n._id, !0), _ && (m._volume = y), (l < o && y <= l || l > o && y >= l) && (clearInterval(n._interval), n._interval = null, n._fadeTo = null, m.volume(l, n._id), m._emit("fade", n._id));
          }, E);
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
          var n = this, o = arguments, l, u, f;
          if (o.length === 0)
            return n._loop;
          if (o.length === 1)
            if (typeof o[0] == "boolean")
              l = o[0], n._loop = l;
            else
              return f = n._soundById(parseInt(o[0], 10)), f ? f._loop : !1;
          else o.length === 2 && (l = o[0], u = parseInt(o[1], 10));
          for (var _ = n._getSoundIds(u), m = 0; m < _.length; m++)
            f = n._soundById(_[m]), f && (f._loop = l, n._webAudio && f._node && f._node.bufferSource && (f._node.bufferSource.loop = l, l && (f._node.bufferSource.loopStart = f._start || 0, f._node.bufferSource.loopEnd = f._stop, n.playing(_[m]) && (n.pause(_[m], !0), n.play(_[m], !0)))));
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
            var f = n._getSoundIds(), _ = f.indexOf(o[0]);
            _ >= 0 ? u = parseInt(o[0], 10) : l = parseFloat(o[0]);
          } else o.length === 2 && (l = parseFloat(o[0]), u = parseInt(o[1], 10));
          var m;
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
              if (m = n._soundById(u[y]), m) {
                n.playing(u[y]) && (m._rateSeek = n.seek(u[y]), m._playStart = n._webAudio ? t.ctx.currentTime : m._playStart), m._rate = l, n._webAudio && m._node && m._node.bufferSource ? m._node.bufferSource.playbackRate.setValueAtTime(l, t.ctx.currentTime) : m._node && (m._node.playbackRate = l);
                var k = n.seek(u[y]), A = (n._sprite[m._sprite][0] + n._sprite[m._sprite][1]) / 1e3 - k, E = A * 1e3 / Math.abs(m._rate);
                (n._endTimers[u[y]] || !m._paused) && (n._clearTimer(u[y]), n._endTimers[u[y]] = setTimeout(n._ended.bind(n, m), E)), n._emit("rate", m._id);
              }
          } else
            return m = n._soundById(u), m ? m._rate : n._rate;
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
            var f = n._getSoundIds(), _ = f.indexOf(o[0]);
            _ >= 0 ? u = parseInt(o[0], 10) : n._sounds.length && (u = n._sounds[0]._id, l = parseFloat(o[0]));
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
          var m = n._soundById(u);
          if (m)
            if (typeof l == "number" && l >= 0) {
              var y = n.playing(u);
              y && n.pause(u, !0), m._seek = l, m._ended = !1, n._clearTimer(u), !n._webAudio && m._node && !isNaN(m._node.duration) && (m._node.currentTime = l);
              var k = function() {
                y && n.play(u, !0), n._emit("seek", u);
              };
              if (y && !n._webAudio) {
                var A = function() {
                  n._playLock ? setTimeout(A, 0) : k();
                };
                setTimeout(A, 0);
              } else
                k();
            } else if (n._webAudio) {
              var E = n.playing(u) ? t.ctx.currentTime - m._playStart : 0, B = m._rateSeek ? m._rateSeek - m._seek : 0;
              return m._seek + (B + E * Math.abs(m._rate));
            } else
              return m._node.currentTime;
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
          var f = !0;
          for (l = 0; l < t._howls.length; l++)
            if (t._howls[l]._src === n._src || n._src.indexOf(t._howls[l]._src) >= 0) {
              f = !1;
              break;
            }
          return a && f && delete a[n._src], t.noAudio = !1, n._state = "unloaded", n._sounds = [], n = null, null;
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
          var f = this, _ = f["_on" + n];
          return typeof o == "function" && _.push(u ? { id: l, fn: o, once: u } : { id: l, fn: o }), f;
        },
        /**
         * Remove a custom event. Call without parameters to remove all events.
         * @param  {String}   event Event name.
         * @param  {Function} fn    Listener to remove. Leave empty to remove all.
         * @param  {Number}   id    (optional) Only remove events for this sound.
         * @return {Howl}
         */
        off: function(n, o, l) {
          var u = this, f = u["_on" + n], _ = 0;
          if (typeof o == "number" && (l = o, o = null), o || l)
            for (_ = 0; _ < f.length; _++) {
              var m = l === f[_].id;
              if (o === f[_].fn && m || !o && m) {
                f.splice(_, 1);
                break;
              }
            }
          else if (n)
            u["_on" + n] = [];
          else {
            var y = Object.keys(u);
            for (_ = 0; _ < y.length; _++)
              y[_].indexOf("_on") === 0 && Array.isArray(u[y[_]]) && (u[y[_]] = []);
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
          for (var u = this, f = u["_on" + n], _ = f.length - 1; _ >= 0; _--)
            (!f[_].id || f[_].id === o || n === "load") && (setTimeout(function(m) {
              m.call(this, o, l);
            }.bind(u, f[_].fn), 0), f[_].once && u.off(n, f[_].fn, f[_].id));
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
            var f = (n._stop - n._start) * 1e3 / Math.abs(n._rate);
            o._endTimers[n._id] = setTimeout(o._ended.bind(o, n), f);
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
          n._duration = a[o].duration, p(n);
          return;
        }
        if (/^data:[^;]+;base64,/.test(o)) {
          for (var l = atob(o.split(",")[1]), u = new Uint8Array(l.length), f = 0; f < l.length; ++f)
            u[f] = l.charCodeAt(f);
          d(u.buffer, n);
        } else {
          var _ = new XMLHttpRequest();
          _.open(n._xhr.method, o, !0), _.withCredentials = n._xhr.withCredentials, _.responseType = "arraybuffer", n._xhr.headers && Object.keys(n._xhr.headers).forEach(function(m) {
            _.setRequestHeader(m, n._xhr.headers[m]);
          }), _.onload = function() {
            var m = (_.status + "")[0];
            if (m !== "0" && m !== "2" && m !== "3") {
              n._emit("loaderror", null, "Failed loading audio file with status: " + _.status + ".");
              return;
            }
            d(_.response, n);
          }, _.onerror = function() {
            n._webAudio && (n._html5 = !0, n._webAudio = !1, n._sounds = [], delete a[o], n.load());
          }, c(_);
        }
      }, c = function(n) {
        try {
          n.send();
        } catch {
          n.onerror();
        }
      }, d = function(n, o) {
        var l = function() {
          o._emit("loaderror", null, "Decoding audio data failed.");
        }, u = function(f) {
          f && o._sounds.length > 0 ? (a[o._src] = f, p(o, f)) : l();
        };
        typeof Promise < "u" && t.ctx.decodeAudioData.length === 1 ? t.ctx.decodeAudioData(n).then(u).catch(l) : t.ctx.decodeAudioData(n, u, l);
      }, p = function(n, o) {
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
            var u = /safari/.test(t._navigator && t._navigator.userAgent.toLowerCase());
            t._navigator && !u && (t.usingWebAudio = !1);
          }
          t.usingWebAudio && (t.masterGain = typeof t.ctx.createGain > "u" ? t.ctx.createGainNode() : t.ctx.createGain(), t.masterGain.gain.setValueAtTime(t._muted ? 0 : t._volume, t.ctx.currentTime), t.masterGain.connect(t.ctx.destination)), t._setup();
        }
      };
      s.Howler = t, s.Howl = r, typeof ae < "u" ? (ae.HowlerGlobal = e, ae.Howler = t, ae.Howl = r, ae.Sound = i) : typeof window < "u" && (window.HowlerGlobal = e, window.Howler = t, window.Howl = r, window.Sound = i);
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
      }, HowlerGlobal.prototype.orientation = function(t, r, i, a, h, c) {
        var d = this;
        if (!d.ctx || !d.ctx.listener)
          return d;
        var p = d._orientation;
        if (r = typeof r != "number" ? p[1] : r, i = typeof i != "number" ? p[2] : i, a = typeof a != "number" ? p[3] : a, h = typeof h != "number" ? p[4] : h, c = typeof c != "number" ? p[5] : c, typeof t == "number")
          d._orientation = [t, r, i, a, h, c], typeof d.ctx.listener.forwardX < "u" ? (d.ctx.listener.forwardX.setTargetAtTime(t, Howler.ctx.currentTime, 0.1), d.ctx.listener.forwardY.setTargetAtTime(r, Howler.ctx.currentTime, 0.1), d.ctx.listener.forwardZ.setTargetAtTime(i, Howler.ctx.currentTime, 0.1), d.ctx.listener.upX.setTargetAtTime(a, Howler.ctx.currentTime, 0.1), d.ctx.listener.upY.setTargetAtTime(h, Howler.ctx.currentTime, 0.1), d.ctx.listener.upZ.setTargetAtTime(c, Howler.ctx.currentTime, 0.1)) : d.ctx.listener.setOrientation(t, r, i, a, h, c);
        else
          return p;
        return d;
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
        for (var h = i._getSoundIds(r), c = 0; c < h.length; c++) {
          var d = i._soundById(h[c]);
          if (d)
            if (typeof t == "number")
              d._stereo = t, d._pos = [t, 0, 0], d._node && (d._pannerAttr.panningModel = "equalpower", (!d._panner || !d._panner.pan) && e(d, a), a === "spatial" ? typeof d._panner.positionX < "u" ? (d._panner.positionX.setValueAtTime(t, Howler.ctx.currentTime), d._panner.positionY.setValueAtTime(0, Howler.ctx.currentTime), d._panner.positionZ.setValueAtTime(0, Howler.ctx.currentTime)) : d._panner.setPosition(t, 0, 0) : d._panner.pan.setValueAtTime(t, Howler.ctx.currentTime)), i._emit("stereo", d._id);
            else
              return d._stereo;
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
        for (var c = h._getSoundIds(a), d = 0; d < c.length; d++) {
          var p = h._soundById(c[d]);
          if (p)
            if (typeof t == "number")
              p._pos = [t, r, i], p._node && ((!p._panner || p._panner.pan) && e(p, "spatial"), typeof p._panner.positionX < "u" ? (p._panner.positionX.setValueAtTime(t, Howler.ctx.currentTime), p._panner.positionY.setValueAtTime(r, Howler.ctx.currentTime), p._panner.positionZ.setValueAtTime(i, Howler.ctx.currentTime)) : p._panner.setPosition(t, r, i)), h._emit("pos", p._id);
            else
              return p._pos;
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
        for (var c = h._getSoundIds(a), d = 0; d < c.length; d++) {
          var p = h._soundById(c[d]);
          if (p)
            if (typeof t == "number")
              p._orientation = [t, r, i], p._node && (p._panner || (p._pos || (p._pos = h._pos || [0, 0, -0.5]), e(p, "spatial")), typeof p._panner.orientationX < "u" ? (p._panner.orientationX.setValueAtTime(t, Howler.ctx.currentTime), p._panner.orientationY.setValueAtTime(r, Howler.ctx.currentTime), p._panner.orientationZ.setValueAtTime(i, Howler.ctx.currentTime)) : p._panner.setOrientation(t, r, i)), h._emit("orientation", p._id);
            else
              return p._orientation;
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
        for (var c = t._getSoundIds(a), d = 0; d < c.length; d++)
          if (h = t._soundById(c[d]), h) {
            var p = h._pannerAttr;
            p = {
              coneInnerAngle: typeof i.coneInnerAngle < "u" ? i.coneInnerAngle : p.coneInnerAngle,
              coneOuterAngle: typeof i.coneOuterAngle < "u" ? i.coneOuterAngle : p.coneOuterAngle,
              coneOuterGain: typeof i.coneOuterGain < "u" ? i.coneOuterGain : p.coneOuterGain,
              distanceModel: typeof i.distanceModel < "u" ? i.distanceModel : p.distanceModel,
              maxDistance: typeof i.maxDistance < "u" ? i.maxDistance : p.maxDistance,
              refDistance: typeof i.refDistance < "u" ? i.refDistance : p.refDistance,
              rolloffFactor: typeof i.rolloffFactor < "u" ? i.rolloffFactor : p.rolloffFactor,
              panningModel: typeof i.panningModel < "u" ? i.panningModel : p.panningModel
            };
            var b = h._panner;
            b || (h._pos || (h._pos = t._pos || [0, 0, -0.5]), e(h, "spatial"), b = h._panner), b.coneInnerAngle = p.coneInnerAngle, b.coneOuterAngle = p.coneOuterAngle, b.coneOuterGain = p.coneOuterGain, b.distanceModel = p.distanceModel, b.maxDistance = p.maxDistance, b.refDistance = p.refDistance, b.rolloffFactor = p.rolloffFactor, b.panningModel = p.panningModel;
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
  })(Te)), Te;
}
var ne = xt();
const et = [
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
], Mt = new Set(et.filter((s) => s !== "ambience"));
function Tt(s, e, t) {
  return e === s && t < 1;
}
function Et(s, e, t) {
  return t || !e ? 0 : s ? 0.16 : 0.38;
}
class It {
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
    this.onDegraded = e, ne.Howler.autoSuspend = !0;
  }
  load() {
    for (const e of et) {
      const t = new ne.Howl({
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
          Tt(e, this.lastRequested, r) && (this.retries.set(e, r + 1), t.once("unlock", () => {
            this.lastRequested === e && this.effects && !this.muted && t.play();
          }));
        }
      });
      this.howls.set(e, t);
    }
  }
  unlock() {
    this.unlocked = !0;
    const e = ne.Howler.ctx;
    e && e.state !== "running" && e.resume(), this.installBus(), this.syncAmbience();
  }
  /** Master compressor in front of the speakers, the same bus shape as a two-bus cabinet mix. */
  installBus() {
    if (this.busReady) return;
    const e = ne.Howler.ctx, t = ne.Howler.masterGain;
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
    this.muted = e, this.music = t, this.effects = r, ne.Howler.mute(e), this.syncAmbience();
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
    if (!this.unlocked || this.muted || this.hidden || !this.effects || !Mt.has(e)) return;
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
    const t = Et(this.presenting, this.music, this.muted);
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
const Xe = "auric-dynamo.board.v1", Lt = [
  { id: "first-win", label: "First net gain" },
  { id: "feature", label: "Feature landed" },
  { id: "wheel", label: "Wheel opened" },
  { id: "flourish", label: "Energy flourish" },
  { id: "big", label: "Big net" },
  { id: "mega", label: "Mega net" },
  { id: "epic", label: "Epic net" },
  { id: "session", label: "Session ahead" }
], Qe = ["Spark", "Ember", "Brass", "Glow", "Dynamo", "Charge", "Crown", "Auric"];
function de() {
  return { handle: "Player", rows: [], seen: [], achievements: [] };
}
function tt(s) {
  const e = s.replace(/[^A-Za-z0-9 ]/g, "").trim().slice(0, 16);
  return e.length > 0 ? e : "Player";
}
function Pt(s) {
  return new Date(s).toISOString().slice(0, 10);
}
function Ct(s) {
  const e = Math.min(Qe.length, 1 + Math.floor(Math.max(0, s) / 5));
  return { level: e, name: Qe[e - 1] ?? "Spark" };
}
function Nt(s) {
  if (!s) return de();
  try {
    const e = JSON.parse(s);
    return !e || !Array.isArray(e.rows) || !Array.isArray(e.seen) ? de() : {
      handle: tt(typeof e.handle == "string" ? e.handle : "Player"),
      rows: e.rows.filter((t) => t && typeof t.handle == "string"),
      seen: e.seen.filter((t) => typeof t == "string").slice(-80),
      achievements: Array.isArray(e.achievements) ? e.achievements.filter((t) => typeof t == "string") : []
    };
  } catch {
    return de();
  }
}
function Bt(s) {
  return JSON.stringify(s);
}
function Ot(s, e) {
  const t = s.cost > 0 ? s.net / s.cost : 0, r = [];
  return e.wins >= 1 && r.push("first-win"), (s.modifier === "replace" || s.modifier === "bank" || s.modifier === "wheel") && r.push("feature"), s.modifier === "wheel" && r.push("wheel"), s.flourish && r.push("flourish"), t >= 5 && r.push("big"), t >= 25 && r.push("mega"), t >= 100 && r.push("epic"), e.highestSession > 0 && r.push("session"), r;
}
function Ft(s, e) {
  if (s.seen.includes(e.id)) return s;
  const t = Pt(e.at), r = s.rows.map((h) => ({ ...h }));
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
  for (const h of Ot(e, i))
    a.includes(h) || a.push(h);
  return {
    handle: s.handle,
    rows: r,
    seen: [...s.seen, e.id].slice(-80),
    achievements: a
  };
}
function Ht(s) {
  return s.rows.find((e) => e.handle === s.handle) ?? null;
}
function Rt(s, e) {
  return [...s].sort((t, r) => r[e] - t[e] || t.handle.localeCompare(r.handle));
}
class j extends Error {
  constructor(e) {
    super(e), this.name = "EconomyError";
  }
}
const Dt = 1, $t = 1e5, Wt = [10, 20, 50, 100], Gt = 10, ie = 1e4, Re = {
  blank: 0,
  0: 0,
  1: 1,
  5: 3,
  10: 12,
  "00": 40
}, De = [
  { token: "blank", from: 0, to: 2200, weight: 2200 },
  { token: "0", from: 2200, to: 7269, weight: 5069 },
  { token: "1", from: 7269, to: 8e3, weight: 731 },
  { token: "5", from: 8e3, to: 9200, weight: 1200 },
  { token: "10", from: 9200, to: 9700, weight: 500 },
  { token: "00", from: 9700, to: 1e4, weight: 300 }
], $e = [
  { id: "x1", from: 0, to: 6200, weight: 6200, multiplier: 1 },
  { id: "x2", from: 6200, to: 8e3, weight: 1800, multiplier: 2 },
  { id: "x5", from: 8e3, to: 8700, weight: 700, multiplier: 5 },
  { id: "x10", from: 8700, to: 9100, weight: 400, multiplier: 10 },
  { id: "replace", from: 9100, to: 9500, weight: 400, multiplier: null },
  { id: "bank", from: 9500, to: 9920, weight: 420, multiplier: null },
  { id: "wheel", from: 9920, to: 1e4, weight: 80, multiplier: null }
], ve = [1, 2, 4, 6, 10, 16, 40, 110];
function G(s, e) {
  if (!Number.isSafeInteger(s)) throw new j(`unsafe ${e}`);
  return s;
}
function Oe(s, e, t) {
  return G(s, t), G(e, t), G(s * e, t);
}
function se(s, e, t) {
  return G(s, t), G(e, t), G(s + e, t);
}
function We(s) {
  return Wt.includes(s);
}
function Ee(s) {
  if (!Number.isInteger(s) || s < 0 || s >= ie) throw new j("token draw");
  const e = De.find((t) => s >= t.from && s < t.to);
  if (!e) throw new j("token draw");
  return e.token;
}
function qt(s) {
  if (!Number.isInteger(s) || s < 0 || s >= ie) throw new j("modifier draw");
  const e = $e.find((t) => s >= t.from && s < t.to);
  if (!e) throw new j("modifier draw");
  return e.id;
}
function N(s) {
  return De.find((e) => e.token === s).from;
}
function re(s) {
  return $e.find((e) => e.id === s).from;
}
function nt(s) {
  if (s.some((t) => t === "blank")) return 0;
  const e = s.reduce((t, r) => t + Re[r], 0);
  return G(e, "raw number");
}
function Vt(s) {
  return s === "blank" ? "blank" : s;
}
function st(s) {
  return s === "x1" ? "1x" : s === "x2" ? "2x" : s === "x5" ? "5x" : s === "x10" ? "10x" : s === "replace" ? "Replace" : s === "bank" ? "Bank + Add" : "Wheel";
}
function pe(s, e) {
  const t = [
    Ee(s.nextInt(ie)),
    Ee(s.nextInt(ie)),
    Ee(s.nextInt(ie))
  ], r = nt(t), i = Oe(r, e, "base");
  return { tokens: t, raw: r, base: i };
}
function rt(s, e, t) {
  if (!We(e)) throw new j("cost");
  if (!Number.isSafeInteger(t) || t < 0 || t > 9) throw new j("meter");
  const r = e / 10, i = pe(s, r), a = qt(s.nextInt(ie)), h = [];
  let c = null, d = null, p = 0, b = null, n = 0, o = [], l = 0;
  if (a === "x1" || a === "x2" || a === "x5" || a === "x10")
    c = a === "x1" ? 1 : a === "x2" ? 2 : a === "x5" ? 5 : 10, n = Oe(c - 1, i.base, "modifier addition"), l = se(i.base, n, "gross"), o = [i.base, n];
  else if (a === "replace") {
    const y = pe(s, r);
    h.push(y), b = i.base, l = y.base, o = [y.base];
  } else if (a === "bank") {
    const y = pe(s, r), k = pe(s, r);
    h.push(y, k), l = se(se(i.base, y.base, "bank"), k.base, "gross"), o = [i.base, y.base, k.base];
  } else
    d = s.nextInt(ve.length), p = Oe(e, ve[d], "wheel"), l = se(i.base, p, "gross"), o = [i.base, p];
  if (o.reduce((y, k) => se(y, k, "contributors"), 0) !== l) throw new j("contributor sum");
  const f = se(l, -e, "net"), _ = t + 1 >= Gt, m = _ ? 0 : t + 1;
  return {
    cost: e,
    unit: r,
    initial: i,
    modifier: a,
    multiplier: c,
    steps: h,
    wheelIndex: d,
    wheelPrize: p,
    discarded: b,
    modifierAdd: n,
    contributors: o,
    gross: l,
    net: f,
    collectionBefore: t,
    collectionAfter: m,
    collectionFlourish: _
  };
}
function Q(s, e) {
  if (G(s, "net"), G(e, "cost"), e <= 0) throw new j("cost");
  return s <= 0 ? 0 : s < 5 * e ? 1 : s < 25 * e ? 2 : s < 100 * e ? 3 : 4;
}
function Xt(s, e, t) {
  if (s <= 0 || t === null || t <= 0) return 0;
  const r = Q(t, e), i = Q(s, e);
  return r < i ? r : i;
}
function I(s) {
  const e = s < 0 ? "-" : "", t = Math.abs(s).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return e + t;
}
function Qt(s) {
  return s.net > 0 ? "Net gain" : s.gross === 0 ? "No return" : s.net === 0 ? "No net change" : `Returned ${I(s.gross)}`;
}
function Yt(s) {
  return s.gross === 0 ? `No return. Net change -${I(s.cost)}.` : s.net === 0 ? "No net change." : s.net < 0 ? `Returned ${I(s.gross)}. Net change -${I(-s.net)}.` : `Returned ${I(s.gross)}. Net change +${I(s.net)}.`;
}
function W(s) {
  return String(nt(s));
}
function jt() {
  const s = De.map((r) => `${Vt(r.token)}: ${r.weight} out of 10000, worth ${Re[r.token]}`).join(`
`), e = $e.map((r) => `${st(r.id)}: ${r.weight} out of 10000`).join(`
`), t = ve.map((r, i) => `Wedge ${i + 1}: cost x ${r} (1 out of 8)`).join(`
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
const he = Math.PI * 2, we = 8, ce = he / we;
function ke(s) {
  return -((s + 0.5) * ce);
}
function it(s) {
  let e = -s % he;
  return e < 0 && (e += he), (Math.floor((e + 1e-9) / ce) % we + we) % we;
}
function Ut(s) {
  return 1 - (1 - Math.min(1, Math.max(0, s))) ** 3;
}
function Zt(s, e, t = Je) {
  const r = ke(s), i = r - t * he;
  return i + (r - i) * Ut(e);
}
function Kt(s, e = Je) {
  const t = ke(s), r = t - e * he, i = t - r, a = Math.floor(-r / ce - 1e-9), h = Math.ceil(-t / ce + 1e-9), c = [];
  for (let d = a; d >= h; d--) {
    const p = -d * ce;
    if (p <= r + 1e-8 || p > t + 1e-8) continue;
    const b = (p - r) / i;
    if (b <= 0 || b > 1) continue;
    const n = 1 - Math.cbrt(1 - b);
    n > 0 && n <= 1 && c.push(n);
  }
  return c.sort((d, p) => d - p), c;
}
function me() {
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
function ot(s) {
  return s === 1 ? "chord-2" : s === 2 ? "chord-3" : s === 3 ? "chord-full" : s === 4 ? "fanfare" : null;
}
function Jt(s, e, t) {
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
function zt(s) {
  return { ...s, bankAdds: [...s.bankAdds] };
}
function U(s) {
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
function en(s, e, t) {
  for (let r = e + 1; r < s.length; r++) s[r].startMs += t;
}
function tn(s, e) {
  let t = s.length ? s[s.length - 1].startMs + s[s.length - 1].durationMs : 0;
  if (t <= e) return !1;
  for (const r of ["inhale", "countup", "collection", "resolve"]) {
    const i = s.findIndex((c) => c.kind === r);
    if (i < 0) continue;
    const a = t - e;
    if (a <= 0) return !1;
    const h = Math.min(s[i].durationMs, a);
    s[i].durationMs -= h, en(s, i, -h), t -= h;
  }
  return t > e;
}
function Fe(s, e, t, r = Se) {
  if (e === "reduced") {
    const k = U(s), A = s.net > 0 ? Q(s.net, s.cost) : 0, E = ot(A);
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
          parts: k
        }
      ],
      cues: [{ at: 0, sound: E ?? "latch", presentation: !0 }]
    };
  }
  const i = e === "super" ? r.superScale : e === "turbo" ? r.turboScale : 1, a = (k) => Math.max(0, Math.round(k * i)), h = [];
  let c = 0;
  const d = (k, A, E, B) => {
    const O = Xt(s.net, s.cost, E.guaranteedNet);
    h.push({
      kind: k,
      receiptId: t,
      startMs: c,
      durationMs: A,
      cueTier: O,
      parts: zt(E),
      ...B
    }), c += A;
  }, p = [
    a(r.reelStops[0]),
    a(r.reelStops[1]),
    a(r.reelStops[2])
  ];
  let b = me();
  const n = s.net > 0 && (Q(s.net, s.cost) >= 2 || s.modifier === "wheel" || s.modifier === "replace" || s.modifier === "bank");
  if (d("reels", p[2] + a(n ? 900 : 150), b, { reelStops: p }), b = { ...b, reading: W(s.initial.tokens) }, d("assemble", a(r.assemble), b), d("inhale", a(r.inhale), b), s.multiplier !== null)
    b = U(s);
  else if (s.modifier === "replace")
    b = {
      ...me(),
      reading: W(s.initial.tokens),
      discarded: s.discarded,
      guaranteedNet: null
    };
  else if (s.modifier === "bank") {
    const k = s.initial.base > s.cost ? s.initial.base - s.cost : null;
    b = {
      ...me(),
      reading: W(s.initial.tokens),
      bankLocked: s.initial.base,
      guaranteedNet: k
    };
  } else {
    const k = s.initial.base > 0 ? s.initial.base : null;
    b = {
      ...me(),
      reading: W(s.initial.tokens),
      base: s.initial.base,
      guaranteedNet: k
    };
  }
  d("modifier", a(r.modifier), b), s.modifier === "replace" && d("replace", a(r.feature.replace), U(s)), s.modifier === "bank" && d("bank", a(r.feature.bank), U(s)), s.modifier === "wheel" && d("wheel", a(r.feature.wheel), U(s));
  const o = Q(s.net, s.cost), l = o === 3 && s.net >= 50 * s.cost ? 5600 : r.count[o], u = a(l);
  u > 0 && d("countup", u, U(s)), d("resolve", a(r.resolve), U(s)), d("collection", a(r.collection), U(s));
  const f = tn(h, r.cap), _ = h.length ? h[h.length - 1].startMs + h[h.length - 1].durationMs : 0, m = f ? r.cap : _, y = nn(s, h);
  return { receiptId: t, mode: e, stages: h, cues: y, totalMs: m, capped: f };
}
function nn(s, e, t) {
  const r = [], i = e.find((u) => u.kind === "reels");
  if (i?.reelStops) {
    r.push({ at: i.startMs, sound: "spin", presentation: !0 });
    const u = s.net > 0 && (s.modifier === "replace" || s.modifier === "bank" || s.modifier === "wheel" || Q(s.net, s.cost) >= 2), f = i.reelStops[i.reelStops.length - 1];
    i.reelStops.forEach((_, m) => {
      r.push({ at: _, sound: "click", presentation: !0 }), r.push({ at: _, sound: "stop", presentation: !0 }), r.push({ at: _ + 36, sound: "land", presentation: !0, rate: 1 + m * 0.18 });
    }), u && f !== void 0 && r.push({ at: Math.max(i.startMs, f - 220), sound: "riser", presentation: !0 });
  }
  const a = (u) => e.find((f) => f.kind === u), h = a("assemble");
  h && r.push({ at: h.startMs, sound: "latch", presentation: !0 });
  const c = a("modifier");
  c && (r.push({ at: c.startMs, sound: "brass", presentation: !0 }), c.cueTier > 0 && r.push({ at: c.startMs, sound: "teal-lift", presentation: !0 }));
  const d = a("replace");
  d && r.push({ at: d.startMs, sound: "latch", presentation: !0 });
  const p = a("bank");
  p && (r.push({ at: p.startMs, sound: "latch", presentation: !0 }), r.push({ at: p.startMs + Math.round(p.durationMs * 0.5), sound: "latch", presentation: !0 }), r.push({ at: p.startMs + Math.round(p.durationMs * (5 / 6)), sound: "latch", presentation: !0 }));
  const b = a("wheel");
  if (b && s.wheelIndex !== null) {
    r.push({ at: b.startMs, sound: "turbine", presentation: !0 });
    const u = b.durationMs * ye;
    for (const f of Kt(s.wheelIndex))
      r.push({ at: b.startMs + f * u, sound: "tick", presentation: !0 });
  }
  const n = a("countup"), o = ot(Q(s.net, s.cost));
  if (n && o && s.net > 0) {
    r.push({ at: n.startMs, sound: o, presentation: !0 }), r.push({ at: n.startMs, sound: "coin", presentation: !0 });
    for (let u = 1; u <= 6; u += 1) {
      const f = u / 7, _ = 1 - (1 - f) * (1 - f);
      r.push({ at: n.startMs + Math.round(n.durationMs * _), sound: "coin", presentation: !0 });
    }
  }
  const l = a("collection");
  return l && r.push({ at: l.startMs, sound: "collect", presentation: !0 }), r.sort((u, f) => u.at - f.at);
}
const sn = [0, 8, 14, 20, 24];
function rn(s, e) {
  const t = Q(s, e);
  return t < 2 || e <= 0 ? null : t === 2 ? "big" : t >= 4 ? "epic" : s >= 50 * e ? "super" : "mega";
}
function X(s, e) {
  return e <= s.startMs ? 0 : s.durationMs <= 0 ? 1 : Math.min(1, (e - s.startMs) / s.durationMs);
}
function at(s, e) {
  let t = null;
  for (const r of s.stages)
    r.startMs <= e && (t = r);
  return t;
}
function on(s, e, t) {
  const r = at(e, t);
  return r ? r.kind === "replace" ? an(s, X(r, t)) : r.kind === "bank" ? ln(s, X(r, t)) : r.kind === "wheel" ? dn(s, X(r, t)) : r.parts : e.stages[0]?.parts ?? {
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
function an(s, e) {
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
function ln(s, e) {
  const t = e >= 0.5, r = e >= 5 / 6, i = [];
  t && i.push(s.steps[0].base), r && i.push(s.steps[1].base);
  const a = s.initial.base + i.reduce((c, d) => c + d, 0), h = a > s.cost ? a - s.cost : null;
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
    guaranteedNet: r ? s.net : h
  };
}
function dn(s, e) {
  const t = e >= ye;
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
function cn(s, e) {
  const t = [{ label: "Cost", amount: s.cost, text: I(s.cost), strike: !1 }];
  if (e.discarded !== null && t.push({ label: "Discarded base", amount: e.discarded, text: I(e.discarded), strike: !0 }), e.base !== null && t.push({ label: "Base", amount: e.base, text: I(e.base), strike: !1 }), e.modifierAdd !== null && t.push({
    label: s.multiplier ? `${st(s.modifier)} addition` : "Modifier addition",
    amount: e.modifierAdd,
    text: I(e.modifierAdd),
    strike: !1
  }), e.bankLocked !== null && t.push({ label: "Locked base", amount: e.bankLocked, text: I(e.bankLocked), strike: !1 }), e.bankAdds.forEach((r, i) => {
    t.push({ label: `Added result ${i + 1}`, amount: r, text: I(r), strike: !1 });
  }), e.wheel !== null && t.push({ label: "Wheel prize", amount: e.wheel, text: I(e.wheel), strike: !1 }), e.gross !== null && t.push({ label: "Gross", amount: e.gross, text: I(e.gross), strike: !1 }), e.net !== null) {
    const r = e.net > 0 ? `+${I(e.net)}` : I(e.net);
    t.push({ label: "Net", amount: null, text: r, strike: !1 });
  }
  return t;
}
function un(s, e) {
  return e.error ? "error" : e.idle && !e.onboarded ? "onboarding" : e.idle ? "idle" : !s || s.kind === "reels" ? "spinning" : s.kind === "replace" ? "replace" : s.kind === "bank" ? "bank" : s.kind === "wheel" ? "wheel" : s.kind === "collection" ? "collection" : s.kind === "countup" && s.cueTier > 0 ? "celebrating" : "resolving";
}
function Ae(s) {
  const { outcome: e, schedule: t, balanceAfter: r } = s, i = Math.max(0, s.elapsed), a = on(e, t, i), h = at(t, i), c = e.net > 0 ? Q(e.net, e.cost) : 0, d = t.stages.find((C) => C.kind === "countup");
  let p = null, b = 0;
  a.gross !== null && c === 0 && (p = a.gross), a.gross !== null && c > 0 && (d && i < d.startMs ? p = null : d && i < d.startMs + d.durationMs ? (p = Jt(0, e.gross, X(d, i)), b = c >= 3 ? X(d, i) : 0) : a.gross !== null && (p = e.gross, b = c >= 3 ? 1 : 0)), t.mode === "reduced" && (p = e.gross, b = 0);
  const n = p ?? 0, o = a.gross === null && t.mode !== "reduced" ? r - e.gross : r - e.gross + (c > 0 && d && i < d.startMs + d.durationMs && t.mode !== "reduced" ? n : e.gross), l = t.mode === "reduced" ? e.net > 0 ? c : 0 : a.guaranteedNet === null ? 0 : e.net > 0 ? Q(Math.min(a.guaranteedNet, e.net), e.cost) : 0, u = d && i >= d.startMs && i < d.startMs + d.durationMs, f = t.mode === "reduced" || !u || c === 0 ? 0 : sn[c], _ = t.stages.find((C) => C.kind === "modifier"), m = _ && i >= _.startMs ? (_.cueTier > 0 ? 0.85 : 0.4) * Math.min(1, X(_, i) || 1) : 0;
  let y = null;
  if (e.modifier === "wheel" && e.wheelIndex !== null) {
    const C = t.stages.find((F) => F.kind === "wheel");
    if (t.mode === "reduced")
      y = { rotation: ke(e.wheelIndex), lit: e.wheelIndex, spinning: !1 };
    else if (C && i >= C.startMs) {
      const F = X(C, i), V = F < ye, g = V ? F / ye : 1, S = Zt(e.wheelIndex, g), T = V ? null : e.wheelIndex;
      !V && (it(S), e.wheelIndex), y = { rotation: S, lit: T, spinning: V };
    } else
      y = { rotation: ke(0), lit: null, spinning: !1 };
  }
  const k = t.mode === "reduced" ? e.modifier === "replace" ? e.steps[0].tokens : e.initial.tokens : hn(e, t, i), A = fn(t, i), E = t.mode !== "reduced" && c > 0 && p !== null && d !== void 0 && i < d.startMs + d.durationMs, B = p === null || E ? "Total" : "Gross", O = a.net === null ? "Net pending" : a.net > 0 ? `Net +${I(a.net)}` : `Net ${I(a.net)}`, q = t.stages.find((C) => C.kind === "collection"), x = t.mode === "reduced" || (q ? i >= q.startMs : !1), Z = x ? e.collectionFlourish ? 10 : e.collectionBefore + 1 : e.collectionBefore, Y = x && e.collectionFlourish, P = s.sessionNetAfter ?? e.net, J = t.mode === "reduced" || a.net !== null;
  return {
    receiptId: t.receiptId,
    phase: un(h, { onboarded: s.onboarded ?? !0, error: s.error ?? !1, idle: s.idle ?? !1 }),
    cost: e.cost,
    balanceShown: o,
    tokens: k,
    spinning: A,
    modifier: _ && i >= _.startMs || t.mode === "reduced" ? e.modifier : null,
    reading: a.reading,
    discarded: a.discarded,
    lines: cn(e, a),
    hero: p,
    totalLabel: B,
    netText: O,
    cueTier: e.net <= 0 ? 0 : l,
    plate: t.mode === "reduced" || e.net <= 0 ? null : rn(e.net, e.cost),
    particles: f,
    bloom: e.net <= 0 || t.mode === "reduced" ? 0 : b,
    modifierGlow: t.mode === "reduced" ? 0 : m,
    anticipation: t.mode !== "reduced" && e.net > 0 && (e.modifier === "replace" || e.modifier === "bank" || e.modifier === "wheel" || c >= 2) && A.some(Boolean),
    wheel: y,
    meterFilled: Math.min(10, Z),
    meterFlourish: Y,
    reduced: t.mode === "reduced",
    sessionNetShown: J ? P : P - e.net
  };
}
function hn(s, e, t) {
  const i = e.stages.find((c) => c.kind === "reels")?.reelStops ?? [0, 0, 0], a = e.stages.find((c) => c.kind === "replace"), h = e.stages.find((c) => c.kind === "bank");
  if (a && t >= a.startMs)
    return X(a, t) < 0.78 ? [null, null, null] : s.steps[0].tokens;
  if (h && t >= h.startMs) {
    const c = X(h, t);
    return c >= 1 / 6 && c < 0.5 || c >= 0.62 && c < 5 / 6 ? [null, null, null] : c >= 5 / 6 ? s.steps[1].tokens : c >= 0.5 ? s.steps[0].tokens : s.initial.tokens;
  }
  return [
    t >= i[0] ? s.initial.tokens[0] : null,
    t >= i[1] ? s.initial.tokens[1] : null,
    t >= i[2] ? s.initial.tokens[2] : null
  ];
}
function fn(s, e) {
  if (s.mode === "reduced") return [!1, !1, !1, !1];
  const r = s.stages.find((d) => d.kind === "reels")?.reelStops ?? [0, 0, 0], i = s.stages.find((d) => d.kind === "modifier"), a = s.stages.find((d) => d.kind === "replace"), h = s.stages.find((d) => d.kind === "bank");
  let c = !1;
  if (a && e >= a.startMs && X(a, e) < 0.78 && (c = !0), h && e >= h.startMs) {
    const d = X(h, e);
    (d >= 1 / 6 && d < 0.5 || d >= 0.62 && d < 5 / 6) && (c = !0);
  }
  return [
    c || e < r[0],
    c || e < r[1],
    c || e < r[2],
    e < (i?.startMs ?? r[2])
  ];
}
function lt(s) {
  return [
    `Cost ${I(s.cost)}.`,
    s.discarded !== null ? `Discarded base ${I(s.discarded)} is excluded.` : "",
    `Gross ${I(s.gross)}.`,
    Qt(s) + ".",
    Yt(s),
    s.collectionFlourish ? "Energy flourish, no credit reward." : ""
  ].filter(Boolean).join(" ");
}
class dt extends Error {
  constructor() {
    super("economic draw aborted"), this.name = "RngAbortError";
  }
}
const He = 2 ** 32;
function ct(s) {
  if (!Number.isInteger(s) || s < 1 || s > He) throw new Error("invalid bound");
  return Math.floor(He / s) * s;
}
function pn(s, e) {
  if (!Number.isInteger(s) || s < 0 || s >= He) throw new Error("invalid sample");
  const t = ct(e);
  return s >= t ? { ok: !1 } : { ok: !0, value: s % e };
}
class mn {
  constructor(e = (r) => crypto.getRandomValues(r), t = 32) {
    this.source = e, this.maxRejects = t;
  }
  source;
  maxRejects;
  nextInt(e) {
    ct(e);
    const t = new Uint32Array(1);
    for (let r = 0; r < this.maxRejects; r++) {
      this.source(t);
      const i = pn(t[0], e);
      if (i.ok) return i.value;
    }
    throw new dt();
  }
}
class _n {
  constructor(e) {
    this.inner = e;
  }
  inner;
  queue = [];
  nextInt(e) {
    return this.inner.nextInt(e);
  }
}
const xe = "auric-dynamo.snapshot.v1", gn = "auric-dynamo";
function ut() {
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
function Ge(s, e = "durable") {
  return {
    schemaVersion: Dt,
    revision: 1,
    balance: $t,
    meter: 0,
    sessionNet: 0,
    activeMs: 0,
    sessionStartedAt: s,
    prefs: ut(),
    receipt: null,
    storage: e,
    economy: "local"
  };
}
function ue(s) {
  return typeof s == "object" && s !== null && !Array.isArray(s);
}
function bn(s) {
  return ue(s) ? typeof s.gross == "number" && typeof s.net == "number" && typeof s.cost == "number" && typeof s.modifier == "string" && Array.isArray(s.contributors) && Array.isArray(s.steps) && ue(s.initial) : !1;
}
function qe(s) {
  if (s === null || s === "") return { ok: !1, reason: "empty" };
  let e;
  try {
    e = JSON.parse(s);
  } catch {
    return { ok: !1, reason: "corrupt" };
  }
  if (!ue(e)) return { ok: !1, reason: "corrupt" };
  if (e.schemaVersion !== 1) return { ok: !1, reason: "version" };
  if (!Number.isSafeInteger(e.balance) || e.balance < 0) return { ok: !1, reason: "balance" };
  if (!Number.isSafeInteger(e.meter) || e.meter < 0 || e.meter > 9) return { ok: !1, reason: "meter" };
  if (!Number.isSafeInteger(e.sessionNet)) return { ok: !1, reason: "net" };
  if (!Number.isSafeInteger(e.revision) || e.revision < 1) return { ok: !1, reason: "revision" };
  if (typeof e.activeMs != "number" || !Number.isFinite(e.activeMs) || e.activeMs < 0) return { ok: !1, reason: "time" };
  if (typeof e.sessionStartedAt != "number" || !Number.isFinite(e.sessionStartedAt)) return { ok: !1, reason: "time" };
  if (!ue(e.prefs) || !We(e.prefs.cost) || !Be(e.prefs.autoplayCount))
    return { ok: !1, reason: "prefs" };
  const t = e.prefs;
  if (typeof t.muted != "boolean" || typeof t.music != "boolean" || typeof t.effects != "boolean")
    return { ok: !1, reason: "prefs" };
  if (typeof t.turbo != "boolean" || typeof t.onboarded != "boolean") return { ok: !1, reason: "prefs" };
  if (!(t.reducedMotion === null || typeof t.reducedMotion == "boolean")) return { ok: !1, reason: "prefs" };
  let r = null;
  if (e.receipt !== null && e.receipt !== void 0) {
    if (!ue(e.receipt) || !bn(e.receipt.outcome)) return { ok: !1, reason: "receipt" };
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
function ht(s, e, t) {
  const r = qe(s.get(xe));
  return r.ok ? { snapshot: { ...r.snapshot, storage: t }, resetReason: null } : { snapshot: Ge(e, t), resetReason: r.reason === "empty" ? null : r.reason };
}
function oe(s, e) {
  s.set(xe, JSON.stringify(e));
}
async function wn(s) {
  return s.locker.exclusive(() => {
    const e = s.memory ?? ht(s.kv, s.now, "durable").snapshot;
    if (!s.settled && e.balance < s.cost)
      return { result: { kind: "insufficient", snapshot: e }, memory: s.memory, warning: null };
    let t;
    if (s.settled)
      t = s.settled.outcome;
    else
      try {
        t = rt(s.rng, s.cost, e.meter);
      } catch (d) {
        if (d instanceof dt)
          return { result: { kind: "rng-abort", snapshot: e }, memory: s.memory, warning: null };
        throw d;
      }
    let r;
    try {
      if (r = s.settled ? G(s.settled.balanceAfter, "balance") : G(e.balance + t.net, "balance"), r < 0) throw new Error("negative");
    } catch {
      return { result: { kind: "overflow", snapshot: e }, memory: s.memory, warning: null };
    }
    const i = e.revision + 1, a = G(e.sessionNet + t.net, "session net"), h = {
      id: s.newId(),
      revision: i,
      acknowledged: !1,
      outcome: t,
      balanceAfter: r,
      meterAfter: t.collectionAfter,
      sessionNetAfter: a
    }, c = {
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
      return { result: { kind: "committed", snapshot: c, storage: "memory" }, memory: c, warning: null };
    try {
      return oe(s.kv, c), { result: { kind: "committed", snapshot: c, storage: c.storage }, memory: null, warning: null };
    } catch {
      const d = { ...c, storage: "memory" };
      return {
        result: { kind: "committed", snapshot: d, storage: "memory" },
        memory: d,
        warning: "This browser could not save the demo. Play continues in this tab only. A reload will not restore it."
      };
    }
  });
}
async function yn(s) {
  return s.locker.exclusive(() => {
    const e = s.memory ?? vn(s.kv), t = e.receipt;
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
      oe(s.kv, r);
    } catch {
      const i = { ...r, storage: "memory" };
      return { snapshot: i, memory: i, applied: !0 };
    }
    return { snapshot: r, memory: null, applied: !0 };
  });
}
function vn(s) {
  const e = qe(s.get(xe));
  return e.ok ? e.snapshot : Ge(Date.now(), "durable");
}
async function kn(s) {
  return s.locker.exclusive(() => {
    const e = qe(s.kv.get(xe)), t = e.ok ? { ...e.snapshot.prefs, onboarded: !0 } : ut(), r = Ge(s.now, s.storage);
    r.prefs = t, r.revision = e.ok ? e.snapshot.revision + 1 : 1;
    try {
      oe(s.kv, r);
    } catch {
      r.storage = "memory";
    }
    return r;
  });
}
function An() {
  return { exclusive: (s) => Promise.resolve(s()) };
}
function Sn() {
  return new mn();
}
class xn {
  constructor(e, t, r, i, a, h, c) {
    this.outcome = e, this.schedule = t, this.balanceAfter = r, this.meterAfter = i, this.sessionNetAfter = a, this.audio = h, this.hooks = c, this.finished = new Promise((d) => {
      this.resolveDone = d;
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
    this.done || (this.audio.cancelPending(), this.audio.fadePresentation(Se.fadeMs), this.fired = this.schedule.cues.length, this.elapsed = this.schedule.totalMs, this.finish());
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
    return Ae({
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
    const e = Ae({
      outcome: this.outcome,
      schedule: this.schedule,
      elapsed: Math.max(this.schedule.totalMs, 1),
      balanceAfter: this.balanceAfter,
      meterAfter: this.meterAfter,
      sessionNetAfter: this.sessionNetAfter
    });
    this.hooks.onFrame(e), this.summarySent || (this.summarySent = !0, this.hooks.onSummary(lt(this.outcome))), this.hooks.onDone(), this.resolveDone();
  }
}
class Mn {
  constructor(e, t, r, i, a, h, c, d, p = !1, b = () => crypto.randomUUID()) {
    this.kv = e, this.locker = t, this.rng = r, this.audio = i, this.onFrame = a, this.onSummary = h, this.newId = b, this.osReduced = p, this.now = c;
    const n = ht(e, c, d);
    if (this.snapshot = n.snapshot, this.resetReason = n.resetReason, this.activeMs = this.snapshot.activeMs, n.resetReason)
      try {
        oe(e, this.snapshot);
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
        oe(this.kv, this.snapshot);
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
    if (!Be(e) || this.locked || this.auto) return !1;
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
    return this.locked || !We(e) ? !1 : (this.snapshot = { ...this.snapshot, prefs: { ...this.snapshot.prefs, cost: e } }, this.persistPrefs(), !0);
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
    return this.locked || !Be(e) ? !1 : (this.snapshot = { ...this.snapshot, prefs: { ...this.snapshot.prefs, autoplayCount: e } }, this.persistPrefs(), !0);
  }
  finishOnboarding() {
    this.snapshot = { ...this.snapshot, prefs: { ...this.snapshot.prefs, onboarded: !0 } }, this.persistPrefs();
  }
  async reset() {
    if (this.locked || this.mode !== "practice") return !1;
    this.auto = null;
    const e = this.memory ? "memory" : this.snapshot.storage, t = await kn({ kv: this.kv, locker: this.locker, now: this.now, storage: e });
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
        } catch (c) {
          const d = c instanceof Error ? c.message : "";
          /insufficient/i.test(d) ? (this.message = "Not enough for this cost.", this.auto && (this.auto.stopped = "credits")) : /rules/i.test(d) ? (this.message = "Accept the rules to continue.", this.auto && (this.auto.stopped = "error")) : (this.message = d || "The draw could not be completed. Nothing was taken. Try again.", this.auto && (this.auto.stopped = "error"));
          return;
        }
      const r = await wn({
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
      const a = Fe(i.outcome, this.motion(), i.id), h = new xn(i.outcome, a, i.balanceAfter, i.meterAfter, i.sessionNetAfter, this.audio, {
        onFrame: (c) => this.show(c),
        onSummary: (c) => this.postSummary(c),
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
    if (St(this.lastOutcome, {
      remaining: this.auto.remaining
    })) {
      this.auto = null;
      return;
    }
    const t = At(this.acceptedAt, this.now);
    t <= this.now ? this.beginSpin() : this.auto.nextAt = t;
  }
  async ack(e, t) {
    const r = await yn({
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
    e && (this.showRestoredFrame(e), this.postSummary(lt(e.outcome)), this.lastOutcome = e.outcome, e.acknowledged || (this.bootP = this.ack(e.id, e.revision)));
  }
  showRestoredFrame(e) {
    const t = Fe(e.outcome, "reduced", e.id);
    this.show(Ae({
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
      oe(this.kv, this.snapshot);
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
const Ye = {
  symbolById: {},
  paylines: []
}, Ie = {}, Tn = 240, En = 5, In = 3, Le = { outQuad: (s) => 1 - (1 - s) * (1 - s), inOutQuad: (s) => s < 0.5 ? 2 * s * s : 1 - Math.pow(-2 * s + 2, 2) / 2, outBack: (s) => 1 + 2.2 * Math.pow(s - 1, 3) + 1.2 * Math.pow(s - 1, 2) }, Pe = (s, e) => (s % e + e) % e;
class Ln {
  /**
   * opts is optional. Lucky Pots calls this with the canvas, the payline svg and the two marker
   * columns, and gets the 5 by 3 view it has always had. Another game can pass
   * { reels, rows, cell, paylines, symbolArt } and use the same spin, blur and bounce.
   */
  constructor(e, t, r, i, a = {}) {
    this.c = e, this.ctx = e.getContext("2d"), this.svg = t, this.reelsN = a.reels ?? En, this.rowsN = a.rows ?? In, this.cell = a.cell ?? Tn, this.pitch = a.cellH ?? this.cell, this.w = this.reelsN * this.cell, this.h = this.rowsN * this.pitch, this.symbolArt = a.symbolArt ?? null, this.well = a.well ?? ["#1b4a2f", "#0a2217"], this.symbolFill = a.symbolFill === !0, this.plain = a.plain === !0, this.cellArt = a.cellArt ?? null, this.glowSprite = a.glowSprite ?? null, this.winSpark = a.winSpark ?? null, this.landSeconds = a.landSeconds ?? 0.42, this.paylines = a.paylines ?? Ye.paylines, this.paused = !1, a.reels && (e.width = this.w, e.height = this.h), this.strips = null, this.pos = new Array(this.reelsN).fill(0), this.reel = Array.from({ length: this.reelsN }, () => ({ phase: "idle", speed: 0 })), this.highlight = null, this.labels = /* @__PURE__ */ new Map(), this.wildReels = [], this.wildAnim = /* @__PURE__ */ new Map(), this.onReelStop = () => {
    }, this.glowReels = /* @__PURE__ */ new Set(), this.markers = { l: [], r: [] }, r && i && this.paylines.forEach((h, c) => {
      const d = document.createElement("div");
      d.className = "marker", d.textContent = c + 1, d.style.top = (h[0] + 0.5) * this.pitch + "px", r.appendChild(d);
      const p = document.createElement("div");
      p.className = "marker", p.textContent = c + 1, p.style.top = (h[this.reelsN - 1] + 0.5) * this.pitch + "px", i.appendChild(p), this.markers.l.push(d), this.markers.r.push(p);
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
    return r[Pe(t, r.length)];
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
      for (let d = 0; d < this.rowsN; d++) a[Pe(t + d, a.length)] = r[d];
      const h = this.reel[e], c = performance.now() / 1e3;
      h.stopAt = Math.max(c, (h.startedAt || c) + 0.12), h.target = t, h.pendingStop = !0, h.onLand = () => {
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
      const c = performance.now() / 1e3;
      let d = this.reelsN;
      e.forEach((p, b) => {
        const n = this.strips[b];
        for (let u = 0; u < this.rowsN; u++) n[Pe(p + u, n.length)] = t[b][u];
        const o = this.reel[b], l = a[b] || 0;
        o.stopAt = Math.max(c, o.startedAt + i) + b * r + l, o.target = p, o.landed = !1, o.pendingStop = !0, o.onLand = () => {
          d--, this.onReelStop(b, t[b].slice()), d === 0 && h();
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
        const h = this.landSeconds, c = Math.min(1, (t - i.landT0) / h), d = 0.26;
        if (c < 0.62) {
          const p = Le.outQuad(c / 0.62);
          this.pos[a] = i.landFrom + (i.target - d - i.landFrom) * p;
        } else {
          const p = Le.inOutQuad((c - 0.62) / 0.38);
          this.pos[a] = i.target - d + d * p;
        }
        c >= 1 && (this.pos[a] = i.target, i.phase = "idle", i.speed = 0, i.onLand && i.onLand(), i.onLand = null);
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
        const i = this.reel[r], a = this.pos[r], h = Math.floor(a), c = a - h, d = i.phase === "spin" ? Math.min(1, i.speed / 20) : 0;
        t.save(), t.beginPath(), t.rect(r * this.cell, 0, this.cell, this.h), t.clip();
        const p = this.wildReels.find((b) => b.reel === r);
        if (p && i.phase === "idle")
          this.drawWildReel(t, r, p, e);
        else
          for (let b = -1; b <= this.rowsN; b++) {
            const n = this.symAt(r, h + b), o = (b - c) * this.pitch;
            this.drawSymbol(t, n, r * this.cell, o, d, i.phase === "idle" ? [r, b] : null, e);
          }
        if (t.restore(), this.glowReels.has(r) && i.phase !== "idle") {
          const b = this.glowSprite;
          if (t.save(), b && b.complete && b.naturalWidth) {
            const n = 0.55 + 0.45 * Math.sin(e * 14);
            t.globalAlpha = n, t.drawImage(b, r * this.cell - 4, -4, this.cell + 8, 28), t.drawImage(b, r * this.cell - 4, this.h - 24, this.cell + 8, 28), t.drawImage(b, r * this.cell - 6, this.h * 0.35, 22, this.h * 0.3), t.drawImage(b, r * this.cell + this.cell - 16, this.h * 0.2, 22, this.h * 0.3);
          } else
            t.strokeStyle = `rgba(255,216,74,${0.6 + 0.4 * Math.sin(e * 10)})`, t.lineWidth = 8, t.shadowColor = "#ffd84a", t.shadowBlur = 30, t.strokeRect(r * this.cell + 6, 6, this.cell - 12, this.h - 12);
          t.restore();
        }
      }
      if (this.highlight) {
        const r = Ie.frame_win_cell;
        for (const i of this.highlight) {
          const [a, h] = i.split(",").map(Number), c = 0.75 + 0.25 * Math.sin(e * 8);
          t.save();
          const d = this.winSpark;
          if (d && d.complete && d.naturalWidth)
            t.globalAlpha = 0.55 + 0.45 * Math.sin(e * 8), t.drawImage(d, a * this.cell, h * this.pitch, this.cell, this.pitch);
          else if (r) {
            const p = this.cell * (0.06 + 0.025 * Math.sin(e * 6));
            t.globalAlpha = 0.85 + 0.15 * Math.sin(e * 6), t.drawImage(r, a * this.cell - p / 2, h * this.cell - p / 2, this.cell + p, this.cell + p);
          } else
            t.strokeStyle = `rgba(255,220,90,${c})`, t.lineWidth = 7, t.shadowColor = "#ffd84a", t.shadowBlur = 24, t.strokeRect(a * this.cell + 7, h * this.cell + 7, this.cell - 14, this.cell - 14);
          t.restore();
        }
      }
      for (const [r, i] of this.labels) {
        const [a, h] = r.split(",").map(Number), c = a * this.cell + this.cell / 2, d = h * this.cell + this.cell / 2;
        t.save(), t.font = "700 34px Cinzel";
        const p = t.measureText(i).width + 36;
        t.fillStyle = "rgba(70,0,60,.85)", t.strokeStyle = "#ff3fd6", t.lineWidth = 4, Pn(t, c - p / 2, d - 28, p, 56, 14), t.fill(), t.stroke(), t.fillStyle = "#fff", t.textAlign = "center", t.textBaseline = "middle", t.fillText(i, c, d + 2), t.restore();
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
    const a = t * this.cell, h = r * this.pitch, c = this.cell, d = this.pitch, p = e.createRadialGradient(a + c / 2, h + d / 2, 20, a + c / 2, h + d / 2, Math.max(c, d) * 0.8);
    p.addColorStop(0, this.well[0]), p.addColorStop(1, this.well[1]), e.fillStyle = p, e.fillRect(a, h, c, d), e.save(), e.beginPath(), e.rect(a, h, c, d), e.clip(), e.strokeStyle = "rgba(120,200,140,.07)", e.lineWidth = 2;
    for (let b = -this.cell; b < this.cell * 2; b += 30)
      e.beginPath(), e.moveTo(a + b, h), e.lineTo(a + b + this.cell, h + this.cell), e.stroke(), e.beginPath(), e.moveTo(a + b + this.cell, h), e.lineTo(a + b, h + this.cell), e.stroke();
    e.restore(), e.strokeStyle = "#a67c2e", e.lineWidth = 3, e.strokeRect(a + 4, h + 4, c - 8, d - 8), e.strokeStyle = "rgba(0,0,0,.5)", e.lineWidth = 2, e.strokeRect(a + 1, h + 1, c - 2, d - 2), this.highlight && !this.highlight.has(`${t},${r}`) && !this.wildReels.some((b) => b.reel === t) && (e.fillStyle = "rgba(0,0,0,.55)", e.fillRect(a, h, c, d));
  }
  drawSymbol(e, t, r, i, a, h) {
    const c = this.symbolArt ? null : Ye.symbolById[t], d = this.symbolArt ? this.symbolArt(t) : c && Ie[c.art];
    if (!d) return;
    const p = this.pitch;
    if (this.symbolFill) {
      const f = d.naturalWidth || d.width || 1, _ = d.naturalHeight || d.height || 1, m = this.cell * 0.8, y = p * 0.8;
      let k = m, A = k * (_ / f);
      A > y && (A = y, k = A * (f / _));
      const E = (this.cell - k) / 2, B = (p - A) / 2;
      e.save(), e.beginPath(), e.rect(r, i, this.cell, p), e.clip();
      const O = h && this.highlight && !this.highlight.has(`${h[0]},${h[1]}`), q = Math.abs(i + p / 2 - this.h / 2), x = Math.min(1, Math.max(0, (q - this.pitch * 0.42) / (this.pitch * 0.55)));
      e.save(), e.globalAlpha = O ? 0.45 : 1 - x * 0.5, a > 0.05 && (e.globalAlpha *= 0.82), e.drawImage(d, r + E, i + B, k, A), e.restore(), e.restore();
      return;
    }
    const n = Math.min(this.cell, p) - 14 * 2, o = (this.cell - n) / 2, l = (p - n) / 2, u = h && this.highlight && !this.highlight.has(`${h[0]},${h[1]}`);
    if (e.save(), u && (e.globalAlpha = 0.45), a > 0.05) {
      e.globalAlpha = 0.55;
      const f = 1 + a * 0.6, _ = n * f, m = (_ - n) / 2;
      e.drawImage(d, r + o, i + l - m, n, _), e.globalAlpha = 0.35, e.drawImage(d, r + o, i + l - m - a * 40, n, _);
    } else
      e.drawImage(d, r + o, i + l, n, n), c && c.label && this.drawLabel(e, c.label, r + this.cell / 2, i + this.cell - 22);
    e.restore();
  }
  drawLabel(e, t, r, i, a = 34) {
    e.save(), e.font = `400 ${a}px "Luckiest Guy", "Lilita One", Impact`, e.textAlign = "center", e.textBaseline = "middle", e.lineJoin = "round", e.lineWidth = 8, e.strokeStyle = "#4a2a00", e.strokeText(t, r, i);
    const h = e.createLinearGradient(0, i - a / 2, 0, i + a / 2);
    h.addColorStop(0, "#fff2a8"), h.addColorStop(0.5, "#ffd84a"), h.addColorStop(1, "#d08a00"), e.fillStyle = h, e.fillText(t, r, i), e.restore();
  }
  drawWildReel(e, t, r, i) {
    const a = this.wildAnim.get(t), h = a ? Le.outBack(a.p) : 1, c = Ie.lep_full;
    if (!c) return;
    const d = t * this.cell, p = d + this.cell / 2, b = this.h / 2;
    e.save();
    const n = e.createLinearGradient(d, 0, d, this.h);
    n.addColorStop(0, "#2a7a3a"), n.addColorStop(1, "#0d3a1c"), e.fillStyle = n, e.fillRect(d + 4, 4, this.cell - 8, this.h - 8), e.strokeStyle = "#ffd84a", e.lineWidth = 6, e.shadowColor = "#ffd84a", e.shadowBlur = 20 + 10 * Math.sin(i * 6), e.strokeRect(d + 6, 6, this.cell - 12, this.h - 12), e.shadowBlur = 0, e.translate(p, b), e.scale(h, h), e.translate(-p, -b);
    const o = this.h - 60, l = o * c.width / c.height, u = Math.min(l, this.cell * 1.25), f = u * c.height / c.width;
    if (e.drawImage(c, p - u / 2, this.h - 20 - f, u, f), this.drawLabel(e, "WILD", p, this.h - 30, 44), r.mult > 1) {
      const _ = "x" + r.mult;
      e.font = '400 72px "Luckiest Guy", Impact', e.textAlign = "center", e.textBaseline = "middle", e.lineJoin = "round", e.lineWidth = 12, e.strokeStyle = "#0b3a12", e.strokeText(_, p, this.h * 0.62), e.fillStyle = "#7dff6a", e.fillText(_, p, this.h * 0.62);
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
    r.forEach((h, c) => i.push([(c + 0.5) * this.cell, (h + 0.5) * this.pitch])), i.push([this.w + 40, (r[this.reelsN - 1] + 0.5) * this.pitch]);
    const a = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    a.setAttribute("points", i.map((h) => h.join(",")).join(" ")), t && a.setAttribute("class", t), this.svg.appendChild(a), this.markers.l[e].classList.add("on"), this.markers.r[e].classList.add("on");
  }
}
function Pn(s, e, t, r, i, a) {
  s.beginPath(), s.moveTo(e + a, t), s.arcTo(e + r, t, e + r, t + i, a), s.arcTo(e + r, t + i, e, t + i, a), s.arcTo(e, t + i, e, t, a), s.arcTo(e, t, e + r, t, a), s.closePath();
}
const le = ["blank", "0", "1", "5", "10", "00"], Ce = ["x1", "x2", "x5", "x10", "replace", "bank", "wheel"];
function je(s, e) {
  const t = Math.max(0, e.indexOf(s)), r = e[(t + e.length - 1) % e.length] ?? s, i = e[(t + 1) % e.length] ?? s;
  return [r, s, i];
}
function _e(s, e) {
  const t = [];
  for (let r = 0; r < e; r++) t.push(...s);
  return t;
}
function L(s) {
  const e = new Image();
  return e.src = R(s), e;
}
class Cn {
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
    const h = this.sheet, c = h.complete && h.naturalWidth >= 128;
    this.coins = this.coins.filter((d) => d.y < a + 80 && d.s < 160);
    for (const d of this.coins) {
      if (d.vy += 280 * r, d.y += d.vy * r, d.s += 70 * r, d.frame = (d.frame + d.spin * r) % 12, !c) continue;
      const p = Math.floor(d.frame) * 128;
      t.drawImage(h, p, 0, 128, 128, d.x - d.s / 2, d.y - d.s / 2, d.s, d.s);
    }
    this.active || this.coins.length ? this.raf = requestAnimationFrame((d) => this.frame(d)) : this.raf = 0;
  }
}
class Nn {
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
    a.id = "coins", a.id = "coins", a.width = 960, a.height = 540;
    const h = document.createElement("img");
    h.id = "bigwin-art", h.alt = "";
    const c = document.createElement("p");
    c.id = "plate-amount";
    const d = document.createElement("button");
    d.id = "bigwin-skip", d.type = "button", d.textContent = "Skip", d.addEventListener("click", () => {
      document.getElementById("reveal")?.dispatchEvent(new MouseEvent("click", { bubbles: !0 }));
    }), i.append(a, h, c, d);
    const p = document.getElementById("overlay") ?? e, b = document.getElementById("wheel-host");
    e.append(t), (b ?? e).append(r), p.append(i), this.reels = t, this.wheel = r, this.big = i, this.bigArt = h, this.wheelFace = L(v.wheelFace), this.pointerArt = L(v.pointer);
    const n = L(v.coinSheet), o = L(v.reelCell), l = document.createElement("canvas");
    l.width = 720, l.height = 512;
    const u = L(v.numerals[1]), f = L(v.numerals[0]), _ = () => {
      if (!u.complete || !f.complete || !u.naturalWidth || !f.naturalWidth) return;
      const m = l.getContext("2d");
      m && (m.clearRect(0, 0, l.width, l.height), m.drawImage(u, 40, 40, 300, 430), m.drawImage(f, 340, 40, 340, 430));
    };
    u.addEventListener("load", _), f.addEventListener("load", _), _(), this.symbols.set("0", L(v.numerals[0])), this.symbols.set("1", u), this.symbols.set("5", L(v.numerals[5])), this.symbols.set("00", L(v.numerals["00"])), this.symbols.set("10", l), this.symbols.set("x1", L(v.modifiers.x1)), this.symbols.set("x2", L(v.modifiers.x2)), this.symbols.set("x5", L(v.modifiers.x5)), this.symbols.set("x10", L(v.modifiers.x10)), this.symbols.set("replace", L(v.modifiers.replace)), this.symbols.set("bank", L(v.modifiers.bank)), this.symbols.set("wheel", L(v.modifiers.wheel)), this.bulbOn = L(v.bulbOn), this.bulbOff = L(v.bulbOff), this.glow = L(v.glowEmerald), this.spark = L(v.spark), this.view = new Ln(t, null, null, null, {
      reels: 4,
      rows: 3,
      cell: 104,
      cellH: 132,
      paylines: [],
      well: ["#123832", "#071614"],
      plain: !0,
      symbolFill: !0,
      landSeconds: 0.22,
      cellArt: (m) => m < 3 && o.complete && o.naturalWidth ? o : null,
      glowSprite: this.spark,
      winSpark: this.glow,
      symbolArt: (m) => {
        if (m === "blank") return null;
        const y = this.symbols.get(m);
        return y ? y instanceof HTMLCanvasElement ? y.width ? y : null : y.complete && y.naturalWidth > 0 ? y : null : null;
      }
    }), this.view.setStrips(
      [_e(le, 4), _e(le, 4), _e(le, 4), _e(Ce, 3)],
      [1, 2, 3, 0]
    ), this.view.onReelStop = () => {
      e.dispatchEvent(new CustomEvent("auric-land", { bubbles: !0 }));
    }, this.rain = new Cn(a, n), this.resize();
  }
  setHidden(e) {
    this.view && (this.view.paused = e), e && this.rain?.stop();
  }
  render(e, t) {
    this.frame = e, this.cost = t;
    const r = this.view;
    if (!r) return;
    const i = e.spinning.some(Boolean), a = [e.tokens[0], e.tokens[1], e.tokens[2], e.modifier], h = a.every((c) => c !== null);
    if (i && !this.wasSpinning && !e.reduced) {
      const c = document.getElementById("turbo")?.checked === !0;
      r.spin({ stagger: c ? 0.02 : 0.04 }), this.armed = !0, this.held.fill(null);
      const d = document.getElementById("reel-sweep");
      d && (d.classList.remove("go"), d.offsetWidth, d.classList.add("go"));
    }
    this.armed && !e.reduced ? (a.forEach((c, d) => {
      if (c !== null && !e.spinning[d] && this.held[d] !== c) {
        this.held[d] = c;
        const p = d < 3 ? le : Ce;
        r.landReel(d, [3, 5, 7, 2][d] ?? 0, je(c, p));
      }
    }), !i && h && (this.armed = !1)) : h && !r.isSpinning() && a.join("|") !== this.held.join("|") && (r.setStrips(a.map((c, d) => je(c, d < 3 ? le : Ce)), [0, 0, 0, 0]), a.forEach((c, d) => {
      this.held[d] = c;
    })), this.wasSpinning = i, r.glowReels.clear(), r.highlight = null, e.anticipation && !e.reduced && e.spinning.slice(0, 3).every((d) => !d) && e.spinning[3] && r.glowReels.add(3), !e.reduced && !i && e.cueTier > 0 && (r.highlight = /* @__PURE__ */ new Set(["0,1", "1,1", "2,1"])), this.paintWheel(e), this.paintWin(e);
  }
  /** Wallet amounts are cents. Practice amounts are shown as whole numbers. */
  setMoney(e) {
    this.money = e;
  }
  pointerWedge() {
    return this.frame?.wheel ? it(this.frame.wheel.rotation) : null;
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
    const t = this.wheel, r = t?.getContext("2d"), i = this.wheelFace;
    if (!t || !r || !i) return;
    const a = t.width, h = a / 2, c = e?.wheel ?? null, d = e?.reduced ?? !1, p = c?.rotation ?? 0;
    if (r.clearRect(0, 0, a, a), r.save(), r.translate(h, h), r.rotate(p), i.complete && i.naturalWidth && r.drawImage(i, -a / 2, -a / 2, a, a), r.fillStyle = "#fff6d8", r.strokeStyle = "#3a2200", r.lineWidth = Math.max(3, a * 0.013), r.lineJoin = "round", r.miterLimit = 2, r.textBaseline = "middle", r.shadowColor = "rgba(12, 8, 2, 0.9)", ve.forEach((l, u) => {
      const f = -Math.PI / 2 + (22.5 + u * 45) * Math.PI / 180, _ = this.money ? (this.cost * l / 100).toFixed(2) : String(this.cost * l), m = a * 0.16;
      let y = Math.round(a * 0.07);
      for (r.font = `700 ${y}px Auric Serif, serif`; y > Math.round(a * 0.045) && r.measureText(_).width > m; )
        y -= 1, r.font = `700 ${y}px Auric Serif, serif`;
      const k = Math.cos(f) >= 0, A = a * 0.33;
      r.save(), r.translate(Math.cos(f) * A, Math.sin(f) * A), r.rotate(k ? f : f + Math.PI), r.textAlign = "center", r.shadowBlur = Math.max(2, a * 0.01), r.strokeText(_, 0, 0), r.shadowBlur = 0, r.fillText(_, 0, 0), r.restore();
    }), r.restore(), c?.lit !== null && c?.lit !== void 0 && !c.spinning && this.glow?.complete && (r.globalAlpha = 0.9, r.drawImage(this.glow, h - a * 0.16, a * 0.02, a * 0.32, a * 0.22), r.globalAlpha = 1), c?.spinning && this.spark?.complete && !d) {
      const l = this.spark, u = performance.now() / 40;
      for (let f = 0; f < 6; f++) {
        const _ = -Math.PI / 2 - (u + f * 7) * Math.PI / 180;
        r.globalAlpha = 0.25 + f * 0.1, r.drawImage(l, h + Math.cos(_) * a * 0.42 - 12, h + Math.sin(_) * a * 0.42 - 12, 24, 24);
      }
      r.globalAlpha = 1;
    }
    const b = this.pointerArt;
    if (b && b.complete && b.naturalWidth) {
      const l = a * 0.2, u = l * (b.naturalWidth / b.naturalHeight), f = !d && c && c.lit !== null && !c.spinning ? Math.sin(performance.now() / 90) * a * 0.012 : 0;
      r.drawImage(b, h - u / 2, a * 0.015 + f, u, l);
    }
    const n = this.bulbOn, o = this.bulbOff;
    if (n?.complete && o?.complete) {
      const l = !d && (!c || c.spinning || c.lit === null), u = Math.floor(performance.now() / (c?.spinning ? 70 : 180));
      for (let f = 0; f < 16; f++) {
        const _ = l && (f === u % 16 || f === (u + 1) % 16), m = c !== null && c.lit !== null && f % 2 === c.lit % 2, y = _ || m ? n : o, k = f / 16 * Math.PI * 2 - Math.PI / 2, A = a * 0.045;
        r.drawImage(y, h + Math.cos(k) * a * 0.46 - A / 2, h + Math.sin(k) * a * 0.46 - A / 2, A, A);
      }
    }
  }
  paintWin(e) {
    const t = e.reduced ? null : e.plate, r = e.phase === "celebrating" || e.phase === "resolving", i = t !== null && e.hero !== null && e.hero > 0 && r;
    if (!this.big || !this.bigArt) return;
    if (this.big.hidden = !i, !i) {
      this.rain?.stop();
      return;
    }
    const a = v.plates[t];
    this.bigArt.dataset.tier !== t && (this.bigArt.dataset.tier = t, this.bigArt.src = R(a));
    const h = t === "epic" ? 7 : t === "super" ? 6 : t === "mega" ? 5 : 3;
    this.rain?.start(h);
  }
}
const ge = window.matchMedia("(prefers-reduced-motion: reduce)");
function Bn() {
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
      return Promise.resolve(navigator.locks.request(gn, () => i()));
    }
  }, storage: "durable", notice: null } : {
    kv: t,
    locker: An(),
    storage: "tab",
    notice: "This browser keeps a separate demo balance in each tab."
  };
}
function w(s) {
  const e = document.getElementById(s);
  if (!e) throw new Error(`missing ${s}`);
  return e;
}
function On() {
  const s = Array.from(document.querySelectorAll("dialog")).filter((e) => e.open);
  return s[s.length - 1] ?? null;
}
function Fn(s) {
  return Array.from(s.querySelectorAll("button, a[href], input, select, textarea")).filter((e) => e.hasAttribute("disabled") || e.getAttribute("aria-hidden") === "true" ? !1 : e.tabIndex >= 0);
}
function $(s) {
  return I(s);
}
function Ue(s, e) {
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
function H(s, e) {
  w(s).style.backgroundImage = `url("${R(e)}")`;
}
function Ze() {
  const s = window.innerHeight > window.innerWidth, e = w("cabinet");
  e.dataset.orient = s ? "portrait" : "landscape";
  const t = s ? 720 : 1280, r = s ? 1280 : 720;
  e.style.width = `${t}px`, e.style.height = `${r}px`, e.style.backgroundImage = `url("${R(s ? v.cabinetP : v.cabinetL)}")`;
  const i = Math.min(window.innerWidth / t, window.innerHeight / r), a = (window.innerWidth - t * i) / 2, h = (window.innerHeight - r * i) / 2;
  e.style.transform = `translate(${a}px, ${h}px) scale(${i})`, H("cost-up", v.plus), H("cost-down", v.minus), H("turbo-btn", v.turbo), H("start-auto", v.auto), H("sound-btn", v.sound), H("music-btn", v.music), H("settings-open", v.gear), H("reveal", v.skip), H("stop-auto", v.stop), H("help-open", v.help), H("board-open", v.star);
  const c = document.getElementById("reel-sweep");
  c && (c.style.backgroundImage = `url("${R(v.streak)}")`);
  const d = document.getElementById("shock");
  d instanceof HTMLImageElement && (d.src = R(v.glowEmerald));
  for (const l of Array.from(document.querySelectorAll("#sparks img"))) l.src = R(v.sparkSmall);
  const p = document.getElementById("splash-art");
  p instanceof HTMLImageElement && (p.src = R(s ? v.splashP : v.splashL));
  const b = `url("${R(v.plaque)}")`, n = s ? "11px 12px" : "16px 18px";
  for (const l of Array.from(document.querySelectorAll(".led, #auto-status, #short, #banner")))
    l.style.borderStyle = "solid", l.style.borderWidth = n, l.style.borderImage = `${b} 78 90 fill / ${n} / 0 stretch`, l.style.background = "transparent";
  const o = s ? "10px 12px" : "12px 16px";
  for (const l of Array.from(document.querySelectorAll("#currency button")))
    l.style.borderStyle = "solid", l.style.borderWidth = o, l.style.borderImage = `${b} 78 90 fill / ${o} / 0 stretch`, l.style.background = "transparent";
  for (const l of Array.from(document.querySelectorAll("dialog")))
    l.style.borderImage = `${b} 70 84 fill / 22px 26px / 0 stretch`;
}
function Ke() {
  const s = w("bulb-rim"), e = 36;
  if (s.childElementCount !== e) {
    s.replaceChildren();
    for (let i = 0; i < e; i += 1) {
      const a = document.createElement("span");
      a.className = "bulb", a.style.setProperty("--i", String(i));
      const h = document.createElement("img");
      h.alt = "", h.src = R(v.bulbOff);
      const c = document.createElement("img");
      c.alt = "", c.className = "on", c.src = R(v.bulbOn), a.append(h, c), s.append(a);
    }
  }
  const t = w("cabinet").dataset.orient === "portrait", r = [];
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
    const h = i, c = r[a] ?? r[0];
    h.style.left = `${c[0]}px`, h.style.top = `${c[1]}px`;
  });
}
function Hn(s) {
  const e = s.filter((t) => t !== null);
  return e.length === 0 ? "" : e.some((t) => t === "blank") ? "0" : String(e.reduce((t, r) => t + Re[r], 0));
}
let Ne = "";
function Rn(s) {
  const e = w("cabinet"), t = s?.spinning.some(Boolean) ?? !1, r = !!(s && s.cueTier >= 2 && (s.phase === "celebrating" || s.phase === "resolving"));
  e.dataset.energy = s?.reduced ? "idle" : r ? "win" : t ? "spin" : "idle", e.dataset.phase = s?.phase ?? "idle";
  const i = w("feature-banner"), a = w("build-digits"), h = w("build"), c = w("fly");
  if (!s || s.phase === "idle" || s.phase === "onboarding") {
    i.textContent = "", a.textContent = "", a.dataset.len = "", h.classList.remove("slam", "shock", "sparks"), Ne = "", c.hidden = !0;
    return;
  }
  if (s.phase === "celebrating" || s.phase === "resolving") {
    i.textContent = "", a.textContent = "", h.classList.remove("slam", "shock", "sparks");
    return;
  }
  i.textContent = s.phase === "replace" ? "Replace" : s.phase === "bank" ? "Bank + Add" : s.phase === "wheel" ? "Wheel" : "";
  const d = Hn(s.tokens), p = d.length > (a.dataset.len?.length ?? 0);
  a.dataset.len = d;
  const b = s.modifier === "x2" ? 2 : s.modifier === "x5" ? 5 : s.modifier === "x10" ? 10 : 0, n = `${s.receiptId}:${s.modifier ?? ""}`;
  if (b > 1 && s.cueTier > 0 && s.reading !== null && !s.reduced)
    a.textContent = String(Number(s.reading) * b), p && a.classList.add("flash"), Ne !== n && (Ne = n, h.classList.remove("slam", "shock"), h.offsetWidth, h.classList.add("slam", "shock"));
  else if (s.phase === "bank") {
    const u = s.lines.find((_) => _.label === "Locked base")?.amount ?? 0, f = s.lines.filter((_) => _.label.startsWith("Added")).reduce((_, m) => _ + (m.amount ?? 0), 0);
    a.textContent = u || f ? $(u + f) : d, p && a.classList.add("flash");
  } else {
    const u = s.spinning.some(Boolean) || s.tokens.some((f) => f === null);
    a.textContent = u ? d : "", p && u && a.classList.add("flash");
  }
  const o = s.tokens.every((u) => u !== null) && !!s.reading;
  h.classList.toggle("sparks", o && !s.reduced);
  const l = s.lines.find((u) => u.label === "Wheel prize");
  l && l.amount !== null && !s.reduced && c.dataset.value !== String(l.amount) && (c.dataset.value = String(l.amount), c.hidden = !1, c.textContent = $(l.amount), c.classList.remove("go"), c.offsetWidth, c.classList.add("go")), l || (c.dataset.value = "", c.hidden = !0, c.classList.remove("go"));
}
function Dn(s) {
  const e = Math.floor(s / 1e3), t = Math.floor(e / 60), r = e % 60;
  return `${t}:${r.toString().padStart(2, "0")}`;
}
async function $n() {
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
function be(s, e) {
  const t = w("lines");
  t.replaceChildren();
  const r = s?.lines ?? [{ label: "Cost", amount: e, text: $(e), strike: !1 }], i = r.length === 1 && r[0]?.label === "Cost" ? [] : r;
  for (const c of i) {
    const d = document.createElement("div");
    d.className = c.strike ? "line strike" : "line";
    const p = document.createElement("span");
    p.textContent = c.label;
    const b = document.createElement("span");
    b.textContent = c.text, d.append(p, b), t.append(d);
  }
  const a = s == null || s.netText === "Net pending";
  Ue(w("hero"), s?.hero ?? (a ? 0 : null));
  const h = document.getElementById("plate-amount");
  h && Ue(h, s?.hero ?? null), w("total-label").textContent = s?.totalLabel ?? "Total", w("net").textContent = s?.netText ?? "Net pending", w("meter").textContent = s?.meterFlourish ? "10/10 energy flourish, no credit reward" : `${s?.meterFilled ?? 0}/10`;
}
function Wn(s) {
  let e = de();
  try {
    e = Nt(s.get(Xe));
  } catch {
    e = de();
  }
  const t = w("handle");
  t.value = e.handle;
  const r = w("wordmark");
  r.src = R(v.logo);
  const i = document.getElementById("onboard-logo");
  i instanceof HTMLImageElement && (i.src = R(v.logo));
  const a = document.getElementById("help-logo");
  a instanceof HTMLImageElement && (a.src = R(v.logo));
  const h = document.getElementById("help-wheel");
  h instanceof HTMLImageElement && (h.src = R(v.wheelFace));
  const c = () => {
    const p = Ht(e), b = Ct(p?.wins ?? 0);
    w("board-level").textContent = p ? `Level ${b.level} ${b.name}. Wins ${p.wins}. Biggest net ${$(p.biggestWin)}. Today's best net ${$(p.dayBest)}.` : `Level ${b.level} ${b.name}. No scored play yet.`;
    const n = w("board-body");
    n.replaceChildren();
    const o = [
      ["Biggest net", "biggestWin"],
      ["Highest session net", "highestSession"],
      ["Wins", "wins"],
      ["Today's best net", "dayBest"]
    ];
    for (const [f, _] of o) {
      const m = document.createElement("h3");
      m.textContent = f;
      const y = document.createElement("table");
      Rt(e.rows, _).forEach((k, A) => {
        const E = document.createElement("tr");
        for (const B of [String(A + 1), k.handle, _ === "wins" ? String(k.wins) : $(k[_])]) {
          const O = document.createElement("td");
          O.textContent = B, E.append(O);
        }
        y.append(E);
      }), n.append(m, y);
    }
    const l = document.createElement("p"), u = Lt.filter((f) => e.achievements.includes(f.id)).map((f) => f.label);
    l.textContent = u.length ? u.join(", ") : "No achievements yet.", n.append(l);
  }, d = () => {
    try {
      s.set(Xe, Bt(e));
    } catch {
    }
  };
  return t.addEventListener("change", () => {
    e = { ...e, handle: tt(t.value) }, t.value = e.handle, d(), c();
  }), w("board-open").addEventListener("click", () => {
    c();
    const p = w("board-dialog");
    p.open || p.showModal(), queueMicrotask(() => w("board-close").focus());
  }), w("board-close").addEventListener("click", () => w("board-dialog").close()), c(), {
    note(p, b) {
      if (!p || b) return;
      const n = Ft(e, {
        id: p.id,
        net: p.net,
        cost: p.cost,
        sessionNet: p.sessionNet,
        modifier: p.modifier,
        flourish: p.flourish,
        at: Date.now()
      });
      n !== e && (e = n, d(), c());
    }
  };
}
function Gn() {
  const s = Bn(), e = Wn(s.kv), t = new It((g) => {
    w("banner").hidden = !1, w("banner").textContent = g;
  });
  t.load();
  const r = new Nn(), i = new _n(Sn());
  let a = null, h = !1, c;
  c = new Mn(
    s.kv,
    s.locker,
    i,
    t,
    (g) => {
      a = g, r.render(g, g.cost), be(g, g.cost), w("balance").textContent = $(g.balanceShown), w("session").textContent = $(g.sessionNetShown), h && P();
    },
    (g) => {
      w("live").textContent = g;
    },
    performance.now(),
    s.storage,
    ge.matches
  ), h = !0, s.notice && x(s.notice), c.resetReason && x("Saved demo data could not be read, so the demo credits were reset.");
  const d = w("spin");
  let p = !1, b = "", n = 0;
  function o(g) {
    const S = w("state-overlay");
    S.textContent = g, S.hidden = !1, S.classList.remove("show"), S.offsetWidth, S.classList.add("show"), window.clearTimeout(n), n = window.setTimeout(() => {
      S.classList.remove("show"), window.setTimeout(() => {
        S.classList.contains("show") || (S.hidden = !0);
      }, 1e3);
    }, 1600);
  }
  function l() {
    const g = w("splash");
    g.hidden = !1, g.classList.remove("out"), queueMicrotask(() => w("splash-start").focus());
  }
  function u() {
    const g = w("splash");
    g.classList.add("out"), window.setTimeout(() => {
      g.hidden = !0;
    }, 1e3);
  }
  let f = ze(), _ = null, m = 0;
  d.addEventListener("pointerdown", (g) => {
    g.button === 0 && (p = !0, H("spin", v.spinPressed), f = wt(performance.now()), _ = null, window.clearInterval(m), m = window.setInterval(() => {
      f = yt(f, performance.now());
    }, 40));
  }), d.addEventListener("pointerup", (g) => {
    window.clearInterval(m);
    const S = g.target === d || d.contains(g.target);
    p = !1;
    const T = vt(f, S);
    f = T.hold, _ = T.action, window.setTimeout(() => {
      _ = null;
    }, 0);
  }), d.addEventListener("pointercancel", () => {
    window.clearInterval(m), f = fe(f), _ = "none";
  }), d.addEventListener("pointerleave", () => {
    f.phase !== "idle" && (f = fe(f), _ = "none");
  }), d.addEventListener("blur", () => {
    window.clearInterval(m), f = fe(f);
  }), d.addEventListener("click", () => {
    const g = kt(_);
    _ = null, g === "spin" && c.spin(), g === "autoplay" && (c.startAuto(c.status().autoplayCount), o("Auto Spin Enabled")), P();
  }), d.addEventListener("keydown", (g) => {
    g.key === "Escape" && (f = fe(f), _ = "none");
  }), w("reveal").addEventListener("click", () => {
    c.reveal(), P();
  }), w("start-auto").addEventListener("click", () => {
    c.startAuto(c.status().autoplayCount), o("Auto Spin Enabled"), P();
  }), w("stop-auto").addEventListener("click", () => {
    c.stopAutoplay(), o("Auto Spin Disabled"), P();
  });
  const y = () => {
    if (c.status().locked) return;
    w("reset-dialog").showModal(), queueMicrotask(() => w("reset-cancel").focus());
  };
  w("reset").addEventListener("click", y), w("short-reset").addEventListener("click", y), w("reset-confirm").addEventListener("click", () => {
    c.reset().then(() => {
      w("reset-dialog").close(), a = null, be(null, c.status().cost), P();
    });
  }), w("reset-cancel").addEventListener("click", () => w("reset-dialog").close());
  let k = null;
  w("help-open").addEventListener("click", () => {
    k = w("help-open"), Z();
  }), w("help-close").addEventListener("click", () => w("help-dialog").close()), w("help-dialog").addEventListener("close", () => {
    if (c.noteHelp(!1), !c.status().onboarded) {
      l();
      return;
    }
    (k ?? d).focus();
  }), w("onboard-help").addEventListener("click", () => {
    k = w("onboard-start"), Z();
  }), w("onboard-start").addEventListener("click", () => {
    c.finishOnboarding(), w("onboard-dialog").close(), u(), P(), d.focus();
  }), w("splash-start").addEventListener("click", () => {
    c.finishOnboarding(), u(), P(), d.focus();
  });
  const A = (g) => {
    const S = Array.from(document.querySelectorAll('input[name="cost"]')), T = S.findIndex((D) => D.checked), M = S[T + g];
    !M || M.disabled || (M.checked = !0, M.dispatchEvent(new Event("change", { bubbles: !0 })));
  };
  w("cost-down").addEventListener("click", () => A(-1)), w("cost-up").addEventListener("click", () => A(1)), w("exit").addEventListener("click", () => {
  });
  for (const g of Array.from(document.querySelectorAll('input[name="cost"]')))
    g.addEventListener("change", () => {
      g.checked && (c.setCost(Number(g.value)), P());
    });
  w("turbo").addEventListener("change", (g) => {
    c.setSpeed(g.target.checked ? 1 : 0);
  }), w("muted").addEventListener("change", (g) => {
    c.setAudioPrefs({ muted: g.target.checked }), Y();
  }), w("music").addEventListener("change", (g) => {
    c.setAudioPrefs({ music: g.target.checked }), Y();
  }), w("effects").addEventListener("change", (g) => {
    c.setAudioPrefs({ effects: g.target.checked }), Y();
  }), w("reduced").addEventListener("change", (g) => {
    const S = g.target.value;
    c.setReduced(S === "device" ? null : S === "reduce"), P();
  }), w("auto-count").addEventListener("change", (g) => {
    c.setAutoCount(Number(g.target.value));
  }), document.addEventListener("keydown", (g) => {
    const S = On();
    if (S) {
      if (g.key === "Escape") {
        g.preventDefault(), S.close();
        return;
      }
      if (g.key === "Tab") {
        const M = Fn(S);
        if (M.length > 0) {
          g.preventDefault();
          const D = M.indexOf(document.activeElement), z = g.shiftKey ? -1 : 1;
          M[(D + z + M.length) % M.length].focus();
        }
      }
      return;
    }
    if (g.key !== " " && g.key !== "Enter") return;
    const T = g.target;
    !T || T.closest("dialog, input, select, textarea, button, a") || T.closest("#play-surface") && (g.preventDefault(), c.spin(), P());
  });
  const E = () => t.unlock();
  window.addEventListener("pointerdown", E, { once: !1 }), window.addEventListener("keydown", E), document.addEventListener("visibilitychange", () => {
    const g = document.hidden;
    c.setHidden(g), t.setHidden(g), r.setHidden(g);
  }), window.addEventListener("blur", () => {
    c.setHidden(!0), t.setHidden(!0);
  }), window.addEventListener("focus", () => {
    document.hidden || (c.setHidden(!1), t.setHidden(!1));
  }), ge.addEventListener("change", () => {
    c.osReduced = ge.matches;
  });
  let B = performance.now(), O = -1;
  const q = (g) => {
    const S = Math.min(100, g - B);
    B = g, c.advance(S);
    const T = Math.floor(c.status().activeMs / 1e3);
    T !== O && (O = T, w("time").textContent = Dn(c.status().activeMs)), r.tick(a), P(), requestAnimationFrame(q);
  };
  function x(g) {
    const S = w("banner");
    S.hidden = !1, S.textContent = g;
  }
  function Z() {
    c.noteHelp(!0);
    const g = w("onboard-dialog");
    g.open && g.close();
    const S = w("help-dialog");
    S.open || S.showModal(), S.scrollTop = 0, queueMicrotask(() => w("help-title").focus());
  }
  function Y() {
    const g = c.status();
    t.setPrefs(g.muted, g.music, g.effects), t.setPresenting(g.locked);
  }
  function P() {
    const g = c.status();
    w("session").textContent = $(a?.sessionNetShown ?? g.sessionNet), w("balance").textContent = $(a?.balanceShown ?? g.balance), d.disabled = g.locked || !g.onboarded;
    const S = p ? v.spinPressed : d.disabled ? v.spinDisabled : v.spin;
    H("spin", S), w("reveal").disabled = !g.reveal, w("start-auto").disabled = g.locked || !g.onboarded, w("reset").disabled = g.locked, w("stop-auto").disabled = g.autoRemaining === null;
    for (const te of Array.from(document.querySelectorAll('input[name="cost"]')))
      te.disabled = g.locked, te.checked = Number(te.value) === g.cost;
    w("turbo").checked = g.turbo, w("turbo").disabled = g.locked, w("turbo-btn").setAttribute("aria-pressed", String(g.turbo)), w("turbo-btn").disabled = g.locked, w("sound-btn").setAttribute("aria-pressed", String(!g.muted)), w("music-btn").setAttribute("aria-pressed", String(g.music)), w("muted").checked = g.muted, w("music").checked = g.music, w("effects").checked = g.effects;
    const T = w("reduced");
    T.value = g.reducedMotion === null ? "device" : g.reducedMotion ? "reduce" : "allow", w("auto-count").value = String(g.autoplayCount), w("auto-count").disabled = g.locked;
    const M = w("auto-status");
    M.textContent = g.autoRemaining === null ? "Autoplay off" : `Autoplay ${g.autoRemaining} left`;
    const D = g.message ?? g.warning ?? "", K = !g.locked && g.balance < g.cost || D.includes("Not enough");
    M.hidden = K;
    const ee = w("note");
    ee.textContent = K ? "" : D, ee.hidden = K || D === "", w("short").hidden = !K, w("short-text").textContent = D || "Insufficient balance", K ? b !== "low" && (b = "low", o("Insufficient balance")) : b === "low" && (b = ""), w("short-reset").hidden = !c.allowsReset(), w("reset").hidden = !c.allowsReset(), Y(), e.note(c.receiptView(), g.locked), w("cost-read").textContent = $(g.cost), w("cost-down").disabled = g.locked || g.cost <= 10, w("cost-up").disabled = g.locked || g.cost >= 100;
    const Me = g.reducedMotion === !0 || g.reducedMotion === null && ge.matches;
    w("cabinet").dataset.motion = (g.locked ? a?.reduced : Me) ? "reduce" : "allow", t.setReelLoop(!!(a && a.spinning.some(Boolean) && !a.reduced)), Rn(a);
  }
  function J() {
    const g = w("help-body");
    for (const S of jt()) {
      const T = document.createElement("h3");
      T.textContent = S.heading;
      const M = document.createElement("p");
      M.textContent = S.body, g.append(T, M);
    }
  }
  J(), Ze(), Ke(), window.addEventListener("resize", () => {
    Ze(), Ke(), r.resize();
  }), be(null, c.status().cost), w("stage").addEventListener("auric-land", () => {
    const g = w("build-digits");
    g.classList.remove("flash"), g.offsetWidth, g.classList.add("flash");
  });
  const C = (g, S) => {
    w(S).addEventListener("click", () => {
      const T = w(g);
      T.disabled || (T.checked = !T.checked, T.dispatchEvent(new Event("change", { bubbles: !0 })));
    });
  };
  w("turbo-btn").addEventListener("click", () => {
    if (c.status().locked) return;
    const g = (c.status().speed + 1) % 3;
    c.setSpeed(g), o(g === 2 ? "Super Turbo Spin Enabled" : g === 1 ? "Turbo Spin Enabled" : "Turbo Spin Disabled"), P();
  }), C("muted", "sound-btn"), C("music", "music-btn");
  const F = (g, S, T) => {
    const M = w(g);
    M.addEventListener("pointerdown", () => H(g, T));
    const D = () => H(g, S);
    M.addEventListener("pointerup", D), M.addEventListener("pointercancel", D);
  };
  F("cost-down", v.minus, v.minusPressed), F("cost-up", v.plus, v.plusPressed), F("turbo-btn", v.turbo, v.turboPressed), F("start-auto", v.auto, v.autoPressed), F("stop-auto", v.stop, v.stopPressed), F("sound-btn", v.sound, v.soundPressed), F("music-btn", v.music, v.musicPressed), F("settings-open", v.gear, v.gearPressed), F("help-open", v.help, v.helpPressed), w("settings-open").addEventListener("click", () => {
    const g = w("settings-dialog");
    g.open || g.showModal(), queueMicrotask(() => w("settings-close").focus());
  }), w("settings-close").addEventListener("click", () => w("settings-dialog").close()), $n().then(() => r.mount(w("stage"))).then(() => {
    document.getElementById("boot")?.remove(), r.resize(), r.tick(a), a && r.render(a, a.cost);
  });
  const V = (g, S) => ({
    label: g,
    run: () => {
      let T = 0;
      const M = rt({
        nextInt(Me) {
          const te = S[T++] ?? 0;
          return te >= Me ? 0 : te;
        }
      }, 10, 0), D = Fe(M, "normal", "fx"), z = Ae({
        outcome: M,
        schedule: D,
        elapsed: D.totalMs,
        balanceAfter: 0,
        sessionNetAfter: 0
      }), K = Q(M.net, M.cost), ee = {
        ...z,
        phase: M.modifier === "wheel" ? "wheel" : z.plate ? "celebrating" : z.phase,
        hero: M.gross,
        cueTier: K
      };
      a = ee, r.render(ee, M.cost), be(ee, M.cost);
    }
  });
  pt(() => [
    V("Small", [N("10"), N("10"), N("0"), re("x1")]),
    V("Big", [N("00"), N("00"), N("0"), re("x1")]),
    V("Mega", [N("00"), N("10"), N("10"), re("x5")]),
    V("Super", [N("00"), N("00"), N("00"), re("x5")]),
    V("Epic", [N("00"), N("00"), N("00"), re("x10")]),
    V("Wheel", [N("0"), N("1"), N("0"), re("wheel"), 7]),
    { label: "Low balance", run: () => o("Insufficient balance") }
  ], "#e0b15a"), P(), new URLSearchParams(location.search).get("brand") || (w("exit").hidden = !0), c.status().onboarded || l(), requestAnimationFrame(q), window.addEventListener("pagehide", () => {
    c.destroy().then(() => {
      t.destroy(), r.destroy();
    });
  });
}
Gn();
