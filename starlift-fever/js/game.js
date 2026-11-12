// \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t, n) => () => {
	if (n) throw n[0];
	try {
		return e && (t = e(e = 0)), t;
	} catch (e) {
		throw n = [e], e;
	}
}, s = (e, t) => () => (t || (e((t = { exports: {} }).exports, t, t.exports), e = null), t.exports), c = (e, n) => {
	let r = {};
	for (var i in e) t(r, i, {
		get: e[i],
		enumerable: !0
	});
	return n || t(r, Symbol.toStringTag, { value: "Module" }), r;
}, l = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, u = (n, r, o) => (o = n == null ? {} : e(i(n)), l(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)), d, f, p, m, h = o((() => {
	d = /* @__PURE__ */ ((e) => (e.Application = "application", e.WebGLPipes = "webgl-pipes", e.WebGLPipesAdaptor = "webgl-pipes-adaptor", e.WebGLSystem = "webgl-system", e.WebGLLoader = "webgl-loader", e.WebGPUPipes = "webgpu-pipes", e.WebGPUPipesAdaptor = "webgpu-pipes-adaptor", e.WebGPUSystem = "webgpu-system", e.WebGPULoader = "webgpu-loader", e.CanvasSystem = "canvas-system", e.CanvasPipesAdaptor = "canvas-pipes-adaptor", e.CanvasPipes = "canvas-pipes", e.CanvasLoader = "canvas-loader", e.Asset = "asset", e.LoadParser = "load-parser", e.ResolveParser = "resolve-parser", e.CacheParser = "cache-parser", e.DetectionParser = "detection-parser", e.MaskEffect = "mask-effect", e.BlendMode = "blend-mode", e.TextureSource = "texture-source", e.TextureUploaderWebGL = "texture-uploader-webgl", e.TextureUploaderWebGPU = "texture-uploader-webgpu", e.Environment = "environment", e.ShapeBuilder = "shape-builder", e.Batcher = "batcher", e))(d || {}), f = (e) => {
		if (typeof e == "function" || typeof e == "object" && e.extension) {
			if (!e.extension) throw Error("Extension class must have an extension object");
			e = {
				...typeof e.extension == "object" ? e.extension : { type: e.extension },
				ref: e
			};
		}
		if (typeof e == "object") e = { ...e };
		else throw Error("Invalid extension type");
		return typeof e.type == "string" && (e.type = [e.type]), e;
	}, p = (e, t) => f(e).priority ?? t, m = {
		_addHandlers: {},
		_removeHandlers: {},
		_queue: {},
		remove(...e) {
			return e.map(f).forEach((e) => {
				e.type.forEach((t) => this._removeHandlers[t]?.(e));
			}), this;
		},
		add(...e) {
			return e.map(f).forEach((e) => {
				e.type.forEach((t) => {
					let n = this._addHandlers, r = this._queue;
					n[t] ? n[t]?.(e) : (r[t] = r[t] || [], r[t]?.push(e));
				});
			}), this;
		},
		handle(e, t, n) {
			let r = this._addHandlers, i = this._removeHandlers;
			if (r[e] || i[e]) throw Error(`Extension type ${e} already has a handler`);
			r[e] = t, i[e] = n;
			let a = this._queue;
			return a[e] && (a[e]?.forEach((e) => t(e)), delete a[e]), this;
		},
		handleByMap(e, t) {
			return this.handle(e, (e) => {
				e.name && (t[e.name] = e.ref);
			}, (e) => {
				e.name && delete t[e.name];
			});
		},
		handleByNamedList(e, t, n = -1) {
			return this.handle(e, (e) => {
				t.findIndex((t) => t.name === e.name) >= 0 || (t.push({
					name: e.name,
					value: e.ref
				}), t.sort((e, t) => p(t.value, n) - p(e.value, n)));
			}, (e) => {
				let n = t.findIndex((t) => t.name === e.name);
				n !== -1 && t.splice(n, 1);
			});
		},
		handleByList(e, t, n = -1) {
			return this.handle(e, (e) => {
				t.includes(e.ref) || (t.push(e.ref), t.sort((e, t) => p(t, n) - p(e, n)));
			}, (e) => {
				let n = t.indexOf(e.ref);
				n !== -1 && t.splice(n, 1);
			});
		},
		mixin(e, ...t) {
			for (let n of t) Object.defineProperties(e.prototype, Object.getOwnPropertyDescriptors(n));
		}
	};
})), g = /* @__PURE__ */ s(((e, t) => {
	var n = Object.prototype.hasOwnProperty, r = "~";
	function i() {}
	Object.create && (i.prototype = Object.create(null), new i().__proto__ || (r = !1));
	function a(e, t, n) {
		this.fn = e, this.context = t, this.once = n || !1;
	}
	function o(e, t, n, i, o) {
		if (typeof n != "function") throw TypeError("The listener must be a function");
		var s = new a(n, i || e, o), c = r ? r + t : t;
		return e._events[c] ? e._events[c].fn ? e._events[c] = [e._events[c], s] : e._events[c].push(s) : (e._events[c] = s, e._eventsCount++), e;
	}
	function s(e, t) {
		--e._eventsCount === 0 ? e._events = new i() : delete e._events[t];
	}
	function c() {
		this._events = new i(), this._eventsCount = 0;
	}
	c.prototype.eventNames = function() {
		var e = [], t, i;
		if (this._eventsCount === 0) return e;
		for (i in t = this._events) n.call(t, i) && e.push(r ? i.slice(1) : i);
		return Object.getOwnPropertySymbols ? e.concat(Object.getOwnPropertySymbols(t)) : e;
	}, c.prototype.listeners = function(e) {
		var t = r ? r + e : e, n = this._events[t];
		if (!n) return [];
		if (n.fn) return [n.fn];
		for (var i = 0, a = n.length, o = Array(a); i < a; i++) o[i] = n[i].fn;
		return o;
	}, c.prototype.listenerCount = function(e) {
		var t = r ? r + e : e, n = this._events[t];
		return n ? n.fn ? 1 : n.length : 0;
	}, c.prototype.emit = function(e, t, n, i, a, o) {
		var s = r ? r + e : e;
		if (!this._events[s]) return !1;
		var c = this._events[s], l = arguments.length, u, d;
		if (c.fn) {
			switch (c.once && this.removeListener(e, c.fn, void 0, !0), l) {
				case 1: return c.fn.call(c.context), !0;
				case 2: return c.fn.call(c.context, t), !0;
				case 3: return c.fn.call(c.context, t, n), !0;
				case 4: return c.fn.call(c.context, t, n, i), !0;
				case 5: return c.fn.call(c.context, t, n, i, a), !0;
				case 6: return c.fn.call(c.context, t, n, i, a, o), !0;
			}
			for (d = 1, u = Array(l - 1); d < l; d++) u[d - 1] = arguments[d];
			c.fn.apply(c.context, u);
		} else {
			var f = c.length, p;
			for (d = 0; d < f; d++) switch (c[d].once && this.removeListener(e, c[d].fn, void 0, !0), l) {
				case 1:
					c[d].fn.call(c[d].context);
					break;
				case 2:
					c[d].fn.call(c[d].context, t);
					break;
				case 3:
					c[d].fn.call(c[d].context, t, n);
					break;
				case 4:
					c[d].fn.call(c[d].context, t, n, i);
					break;
				default:
					if (!u) for (p = 1, u = Array(l - 1); p < l; p++) u[p - 1] = arguments[p];
					c[d].fn.apply(c[d].context, u);
			}
		}
		return !0;
	}, c.prototype.on = function(e, t, n) {
		return o(this, e, t, n, !1);
	}, c.prototype.once = function(e, t, n) {
		return o(this, e, t, n, !0);
	}, c.prototype.removeListener = function(e, t, n, i) {
		var a = r ? r + e : e;
		if (!this._events[a]) return this;
		if (!t) return s(this, a), this;
		var o = this._events[a];
		if (o.fn) o.fn !== t || i && !o.once || n && o.context !== n || s(this, a);
		else {
			for (var c = 0, l = [], u = o.length; c < u; c++) (o[c].fn !== t || i && !o[c].once || n && o[c].context !== n) && l.push(o[c]);
			l.length ? this._events[a] = l.length === 1 ? l[0] : l : s(this, a);
		}
		return this;
	}, c.prototype.removeAllListeners = function(e) {
		var t;
		return e ? (t = r ? r + e : e, this._events[t] && s(this, t)) : (this._events = new i(), this._eventsCount = 0), this;
	}, c.prototype.off = c.prototype.removeListener, c.prototype.addListener = c.prototype.on, c.prefixed = r, c.EventEmitter = c, t !== void 0 && (t.exports = c);
})), _, v, y = o((() => {
	_ = /* @__PURE__ */ u(g(), 1), v = _.default;
})), b, x, S, C, w, ee, T, E, te, ne, re, ie, D, O, ae, oe, se, ce, le, k, ue, de, fe, pe, me, he, ge, _e, ve, ye, be, xe, Se, Ce, we, Te = o((() => {
	for (b = {
		grad: .9,
		turn: 360,
		rad: 360 / (2 * Math.PI)
	}, x = function(e) {
		return typeof e == "string" ? e.length > 0 : typeof e == "number";
	}, S = function(e, t, n) {
		return t === void 0 && (t = 0), n === void 0 && (n = 10 ** t), Math.round(n * e) / n + 0;
	}, C = function(e) {
		var t = Math.round(100 * e) / 100;
		return Math.round(255 * t) === 255 * e ? t : Math.round(1e3 * e) / 1e3;
	}, w = function(e, t, n) {
		return t === void 0 && (t = 0), n === void 0 && (n = 1), e > n ? n : e > t ? e : t;
	}, ee = function(e) {
		return (e = isFinite(e) ? e % 360 : 0) < 0 ? e + 360 : e;
	}, T = function(e, t) {
		return t === void 0 && (t = 0), S(e, t) % 360;
	}, E = function(e) {
		return {
			r: w(e.r, 0, 255),
			g: w(e.g, 0, 255),
			b: w(e.b, 0, 255),
			a: w(e.a)
		};
	}, te = function(e) {
		return {
			r: S(e.r),
			g: S(e.g),
			b: S(e.b),
			a: C(e.a)
		};
	}, ne = /^#([0-9a-f]{3,8})$/i, re = function(e, t) {
		var n = e.charCodeAt(t);
		return (15 & n) + 9 * (n >> 6);
	}, ie = function(e, t) {
		return re(e, t) << 4 | re(e, t + 1);
	}, D = [], O = 0; O < 256; O++) D.push((O < 16 ? "0" : "") + O.toString(16));
	ae = function(e) {
		return D[w(e, 0, 255)];
	}, oe = function(e) {
		var t = e.r, n = e.g, r = e.b, i = e.a, a = Math.max(t, n, r), o = a - Math.min(t, n, r), s = o ? a === t ? (n - r) / o : a === n ? 2 + (r - t) / o : 4 + (t - n) / o : 0;
		return {
			h: 60 * (s < 0 ? s + 6 : s),
			s: a ? o / a * 100 : 0,
			v: a / 255 * 100,
			a: i
		};
	}, se = function(e) {
		var t = e.h, n = e.s, r = e.v, i = e.a;
		t = t / 360 * 6, n /= 100, r /= 100;
		var a = Math.floor(t), o = r * (1 - n), s = r * (1 - (t - a) * n), c = r * (1 - (1 - t + a) * n), l = a % 6;
		return {
			r: 255 * [
				r,
				s,
				o,
				o,
				c,
				r
			][l],
			g: 255 * [
				c,
				r,
				r,
				s,
				o,
				o
			][l],
			b: 255 * [
				o,
				o,
				c,
				r,
				r,
				s
			][l],
			a: i
		};
	}, ce = function(e) {
		return {
			h: ee(e.h),
			s: w(e.s, 0, 100),
			l: w(e.l, 0, 100),
			a: w(e.a)
		};
	}, le = function(e) {
		return {
			h: T(e.h),
			s: S(e.s),
			l: S(e.l),
			a: C(e.a)
		};
	}, k = function(e) {
		return se((n = (t = e).s, {
			h: t.h,
			s: (n *= ((r = t.l) < 50 ? r : 100 - r) / 100) > 0 ? 2 * n / (r + n) * 100 : 0,
			v: r + n,
			a: t.a
		}));
		var t, n, r;
	}, ue = function(e) {
		return {
			h: (t = oe(e)).h,
			s: (i = (200 - (n = t.s)) * (r = t.v) / 100) > 0 && i < 200 ? n * r / 100 / (i <= 100 ? i : 200 - i) * 100 : 0,
			l: i / 2,
			a: t.a
		};
		var t, n, r, i;
	}, de = /^hsla?\(\s*([+-]?(?:\d*\.\d+|\d+)(?:e[+-]?\d+)?)(deg|rad|grad|turn)?\s*,\s*([+-]?(?:\d*\.\d+|\d+)(?:e[+-]?\d+)?)%\s*,\s*([+-]?(?:\d*\.\d+|\d+)(?:e[+-]?\d+)?)%\s*(?:,\s*([+-]?(?:\d*\.\d+|\d+)(?:e[+-]?\d+)?)(%)?\s*)?\)$/i, fe = /^hsla?\(\s*([+-]?(?:\d*\.\d+|\d+)(?:e[+-]?\d+)?)(deg|rad|grad|turn)?\s+([+-]?(?:\d*\.\d+|\d+)(?:e[+-]?\d+)?)%\s+([+-]?(?:\d*\.\d+|\d+)(?:e[+-]?\d+)?)%\s*(?:\/\s*([+-]?(?:\d*\.\d+|\d+)(?:e[+-]?\d+)?)(%)?\s*)?\)$/i, pe = /^rgba?\(\s*([+-]?(?:\d*\.\d+|\d+)(?:e[+-]?\d+)?)(%)?\s*,\s*([+-]?(?:\d*\.\d+|\d+)(?:e[+-]?\d+)?)(%)?\s*,\s*([+-]?(?:\d*\.\d+|\d+)(?:e[+-]?\d+)?)(%)?\s*(?:,\s*([+-]?(?:\d*\.\d+|\d+)(?:e[+-]?\d+)?)(%)?\s*)?\)$/i, me = /^rgba?\(\s*([+-]?(?:\d*\.\d+|\d+)(?:e[+-]?\d+)?)(%)?\s+([+-]?(?:\d*\.\d+|\d+)(?:e[+-]?\d+)?)(%)?\s+([+-]?(?:\d*\.\d+|\d+)(?:e[+-]?\d+)?)(%)?\s*(?:\/\s*([+-]?(?:\d*\.\d+|\d+)(?:e[+-]?\d+)?)(%)?\s*)?\)$/i, he = {
		string: [
			[function(e) {
				if (!ne.test(e)) return null;
				var t = e.length;
				return t <= 5 ? {
					r: 17 * re(e, 1),
					g: 17 * re(e, 2),
					b: 17 * re(e, 3),
					a: t === 5 ? 17 * re(e, 4) / 255 : 1
				} : t === 7 || t === 9 ? {
					r: ie(e, 1),
					g: ie(e, 3),
					b: ie(e, 5),
					a: t === 9 ? ie(e, 7) / 255 : 1
				} : null;
			}, "hex"],
			[function(e) {
				var t = pe.exec(e) || me.exec(e);
				return t ? t[2] !== t[4] || t[4] !== t[6] ? null : E({
					r: Number(t[1]) / (t[2] ? 100 / 255 : 1),
					g: Number(t[3]) / (t[4] ? 100 / 255 : 1),
					b: Number(t[5]) / (t[6] ? 100 / 255 : 1),
					a: t[7] === void 0 ? 1 : Number(t[7]) / (t[8] ? 100 : 1)
				}) : null;
			}, "rgb"],
			[function(e) {
				var t = de.exec(e) || fe.exec(e);
				if (!t) return null;
				var n, r;
				return k(ce({
					h: (n = t[1], r = t[2], r === void 0 && (r = "deg"), Number(n) * (b[r.toLowerCase()] || 1)),
					s: Number(t[3]),
					l: Number(t[4]),
					a: t[5] === void 0 ? 1 : Number(t[5]) / (t[6] ? 100 : 1)
				}));
			}, "hsl"]
		],
		object: [
			[function(e) {
				var t = e.r, n = e.g, r = e.b, i = e.a, a = i === void 0 ? 1 : i;
				return x(t) && x(n) && x(r) ? E({
					r: Number(t),
					g: Number(n),
					b: Number(r),
					a: Number(a)
				}) : null;
			}, "rgb"],
			[function(e) {
				var t = e.h, n = e.s, r = e.l, i = e.a, a = i === void 0 ? 1 : i;
				return !x(t) || !x(n) || !x(r) ? null : k(ce({
					h: Number(t),
					s: Number(n),
					l: Number(r),
					a: Number(a)
				}));
			}, "hsl"],
			[function(e) {
				var t = e.h, n = e.s, r = e.v, i = e.a, a = i === void 0 ? 1 : i;
				return !x(t) || !x(n) || !x(r) ? null : se(function(e) {
					return {
						h: ee(e.h),
						s: w(e.s, 0, 100),
						v: w(e.v, 0, 100),
						a: w(e.a)
					};
				}({
					h: Number(t),
					s: Number(n),
					v: Number(r),
					a: Number(a)
				}));
			}, "hsv"]
		]
	}, ge = function(e, t) {
		for (var n = 0; n < t.length; n++) {
			var r = t[n][0](e);
			if (r) return [r, t[n][1]];
		}
		return [null, void 0];
	}, _e = function(e) {
		return typeof e == "string" ? ge(e.trim(), he.string) : typeof e == "object" && e ? ge(e, he.object) : [null, void 0];
	}, ve = function(e, t) {
		var n = ue(e);
		return {
			h: n.h,
			s: w(n.s + 100 * t, 0, 100),
			l: n.l,
			a: n.a
		};
	}, ye = function(e) {
		return (299 * e.r + 587 * e.g + 114 * e.b) / 1e3 / 255;
	}, be = function(e, t) {
		var n = ue(e);
		return {
			h: n.h,
			s: n.s,
			l: w(n.l + 100 * t, 0, 100),
			a: n.a
		};
	}, xe = function() {
		function e(e) {
			this.parsed = _e(e)[0], this.rgba = this.parsed || {
				r: 0,
				g: 0,
				b: 0,
				a: 1
			};
		}
		return e.prototype.isValid = function() {
			return this.parsed !== null;
		}, e.prototype.brightness = function() {
			return S(ye(this.rgba), 2);
		}, e.prototype.isDark = function() {
			return ye(this.rgba) < .5;
		}, e.prototype.isLight = function() {
			return ye(this.rgba) >= .5;
		}, e.prototype.toHex = function() {
			return e = te(this.rgba), t = e.r, n = e.g, r = e.b, a = (i = e.a) < 1 ? ae(S(255 * i)) : "", "#" + ae(t) + ae(n) + ae(r) + a;
			var e, t, n, r, i, a;
		}, e.prototype.toRgb = function() {
			return te(this.rgba);
		}, e.prototype.toRgbString = function() {
			return e = te(this.rgba), t = e.r, n = e.g, r = e.b, (i = e.a) < 1 ? "rgba(" + t + ", " + n + ", " + r + ", " + i + ")" : "rgb(" + t + ", " + n + ", " + r + ")";
			var e, t, n, r, i;
		}, e.prototype.toHsl = function() {
			return le(ue(this.rgba));
		}, e.prototype.toHslString = function() {
			return e = le(ue(this.rgba)), t = e.h, n = e.s, r = e.l, (i = e.a) < 1 ? "hsla(" + t + ", " + n + "%, " + r + "%, " + i + ")" : "hsl(" + t + ", " + n + "%, " + r + "%)";
			var e, t, n, r, i;
		}, e.prototype.toHsv = function() {
			return e = oe(this.rgba), {
				h: T(e.h),
				s: S(e.s),
				v: S(e.v),
				a: C(e.a)
			};
			var e;
		}, e.prototype.invert = function() {
			return Se({
				r: 255 - (e = this.rgba).r,
				g: 255 - e.g,
				b: 255 - e.b,
				a: e.a
			});
			var e;
		}, e.prototype.saturate = function(e) {
			return e === void 0 && (e = .1), Se(ve(this.rgba, e));
		}, e.prototype.desaturate = function(e) {
			return e === void 0 && (e = .1), Se(ve(this.rgba, -e));
		}, e.prototype.grayscale = function() {
			return Se(ve(this.rgba, -1));
		}, e.prototype.lighten = function(e) {
			return e === void 0 && (e = .1), Se(be(this.rgba, e));
		}, e.prototype.darken = function(e) {
			return e === void 0 && (e = .1), Se(be(this.rgba, -e));
		}, e.prototype.rotate = function(e) {
			return e === void 0 && (e = 15), this.hue(ue(this.rgba).h + e);
		}, e.prototype.alpha = function(e) {
			return typeof e == "number" ? Se({
				r: (t = this.rgba).r,
				g: t.g,
				b: t.b,
				a: e
			}) : C(this.rgba.a);
			var t;
		}, e.prototype.hue = function(e) {
			var t = ue(this.rgba);
			return typeof e == "number" ? Se({
				h: e,
				s: t.s,
				l: t.l,
				a: t.a
			}) : T(t.h);
		}, e.prototype.isEqual = function(e) {
			return this.toHex() === Se(e).toHex();
		}, e;
	}(), Se = function(e) {
		return e instanceof xe ? e : new xe(e);
	}, Ce = [], we = function(e) {
		e.forEach(function(e) {
			Ce.indexOf(e) < 0 && (e(xe, he), Ce.push(e));
		});
	};
})), Ee, De = o((() => {
	Ee = function(e, t) {
		var n = {
			white: "#ffffff",
			bisque: "#ffe4c4",
			blue: "#0000ff",
			cadetblue: "#5f9ea0",
			chartreuse: "#7fff00",
			chocolate: "#d2691e",
			coral: "#ff7f50",
			antiquewhite: "#faebd7",
			aqua: "#00ffff",
			azure: "#f0ffff",
			whitesmoke: "#f5f5f5",
			papayawhip: "#ffefd5",
			plum: "#dda0dd",
			blanchedalmond: "#ffebcd",
			black: "#000000",
			gold: "#ffd700",
			goldenrod: "#daa520",
			gainsboro: "#dcdcdc",
			cornsilk: "#fff8dc",
			cornflowerblue: "#6495ed",
			burlywood: "#deb887",
			aquamarine: "#7fffd4",
			beige: "#f5f5dc",
			crimson: "#dc143c",
			cyan: "#00ffff",
			darkblue: "#00008b",
			darkcyan: "#008b8b",
			darkgoldenrod: "#b8860b",
			darkkhaki: "#bdb76b",
			darkgray: "#a9a9a9",
			darkgreen: "#006400",
			darkgrey: "#a9a9a9",
			peachpuff: "#ffdab9",
			darkmagenta: "#8b008b",
			darkred: "#8b0000",
			darkorchid: "#9932cc",
			darkorange: "#ff8c00",
			darkslateblue: "#483d8b",
			gray: "#808080",
			darkslategray: "#2f4f4f",
			darkslategrey: "#2f4f4f",
			deeppink: "#ff1493",
			deepskyblue: "#00bfff",
			wheat: "#f5deb3",
			firebrick: "#b22222",
			floralwhite: "#fffaf0",
			ghostwhite: "#f8f8ff",
			darkviolet: "#9400d3",
			magenta: "#ff00ff",
			green: "#008000",
			dodgerblue: "#1e90ff",
			grey: "#808080",
			honeydew: "#f0fff0",
			hotpink: "#ff69b4",
			blueviolet: "#8a2be2",
			forestgreen: "#228b22",
			lawngreen: "#7cfc00",
			indianred: "#cd5c5c",
			indigo: "#4b0082",
			fuchsia: "#ff00ff",
			brown: "#a52a2a",
			maroon: "#800000",
			mediumblue: "#0000cd",
			lightcoral: "#f08080",
			darkturquoise: "#00ced1",
			lightcyan: "#e0ffff",
			ivory: "#fffff0",
			lightyellow: "#ffffe0",
			lightsalmon: "#ffa07a",
			lightseagreen: "#20b2aa",
			linen: "#faf0e6",
			mediumaquamarine: "#66cdaa",
			lemonchiffon: "#fffacd",
			lime: "#00ff00",
			khaki: "#f0e68c",
			mediumseagreen: "#3cb371",
			limegreen: "#32cd32",
			mediumspringgreen: "#00fa9a",
			lightskyblue: "#87cefa",
			lightblue: "#add8e6",
			midnightblue: "#191970",
			lightpink: "#ffb6c1",
			mistyrose: "#ffe4e1",
			moccasin: "#ffe4b5",
			mintcream: "#f5fffa",
			lightslategray: "#778899",
			lightslategrey: "#778899",
			navajowhite: "#ffdead",
			navy: "#000080",
			mediumvioletred: "#c71585",
			powderblue: "#b0e0e6",
			palegoldenrod: "#eee8aa",
			oldlace: "#fdf5e6",
			paleturquoise: "#afeeee",
			mediumturquoise: "#48d1cc",
			mediumorchid: "#ba55d3",
			rebeccapurple: "#663399",
			lightsteelblue: "#b0c4de",
			mediumslateblue: "#7b68ee",
			thistle: "#d8bfd8",
			tan: "#d2b48c",
			orchid: "#da70d6",
			mediumpurple: "#9370db",
			purple: "#800080",
			pink: "#ffc0cb",
			skyblue: "#87ceeb",
			springgreen: "#00ff7f",
			palegreen: "#98fb98",
			red: "#ff0000",
			yellow: "#ffff00",
			slateblue: "#6a5acd",
			lavenderblush: "#fff0f5",
			peru: "#cd853f",
			palevioletred: "#db7093",
			violet: "#ee82ee",
			teal: "#008080",
			slategray: "#708090",
			slategrey: "#708090",
			aliceblue: "#f0f8ff",
			darkseagreen: "#8fbc8f",
			darkolivegreen: "#556b2f",
			greenyellow: "#adff2f",
			seagreen: "#2e8b57",
			seashell: "#fff5ee",
			tomato: "#ff6347",
			silver: "#c0c0c0",
			sienna: "#a0522d",
			lavender: "#e6e6fa",
			lightgreen: "#90ee90",
			orange: "#ffa500",
			orangered: "#ff4500",
			steelblue: "#4682b4",
			royalblue: "#4169e1",
			turquoise: "#40e0d0",
			yellowgreen: "#9acd32",
			salmon: "#fa8072",
			saddlebrown: "#8b4513",
			sandybrown: "#f4a460",
			rosybrown: "#bc8f8f",
			darksalmon: "#e9967a",
			lightgoldenrodyellow: "#fafad2",
			snow: "#fffafa",
			lightgrey: "#d3d3d3",
			lightgray: "#d3d3d3",
			dimgray: "#696969",
			dimgrey: "#696969",
			olivedrab: "#6b8e23",
			olive: "#808000"
		}, r = {};
		for (var i in n) r[n[i]] = i;
		var a = {};
		e.prototype.toName = function(t) {
			if (!(this.rgba.a || this.rgba.r || this.rgba.g || this.rgba.b)) return "transparent";
			var i, o, s = r[this.toHex()];
			if (s) return s;
			if (t?.closest) {
				var c = this.toRgb(), l = 1 / 0, u = "black";
				if (!a.length) for (var d in n) a[d] = new e(n[d]).toRgb();
				for (var f in n) {
					var p = (i = c, o = a[f], (i.r - o.r) ** 2 + (i.g - o.g) ** 2 + (i.b - o.b) ** 2);
					p < l && (l = p, u = f);
				}
				return u;
			}
		}, t.string.push([function(t) {
			var r = t.toLowerCase(), i = r === "transparent" ? "#0000" : n[r];
			return i ? new e(i).toRgb() : null;
		}, "name"]);
	};
})), Oe, A, ke = o((() => {
	Te(), De(), we([Ee]), Oe = class e {
		constructor(e = 16777215) {
			this._value = null, this._components = /* @__PURE__ */ new Float32Array(4), this._components.fill(1), this._int = 16777215, this.value = e;
		}
		get red() {
			return this._components[0];
		}
		get green() {
			return this._components[1];
		}
		get blue() {
			return this._components[2];
		}
		get alpha() {
			return this._components[3];
		}
		setValue(e) {
			return this.value = e, this;
		}
		set value(t) {
			if (t instanceof e) this._value = this._cloneSource(t._value), this._int = t._int, this._components.set(t._components);
			else if (t === null) throw Error("Cannot set Color#value to null");
			else this._value !== null && this._isSourceEqual(this._value, t) || (this._value = this._cloneSource(t), this._normalize(this._value));
		}
		get value() {
			return this._value;
		}
		_cloneSource(e) {
			return typeof e == "string" || typeof e == "number" || e instanceof Number || e === null ? e : Array.isArray(e) || ArrayBuffer.isView(e) ? e.slice(0) : typeof e == "object" && e ? { ...e } : e;
		}
		_isSourceEqual(e, t) {
			let n = typeof e;
			if (n !== typeof t) return !1;
			if (n === "number" || n === "string" || e instanceof Number) return e === t;
			if (Array.isArray(e) && Array.isArray(t) || ArrayBuffer.isView(e) && ArrayBuffer.isView(t)) return e.length === t.length && e.every((e, n) => e === t[n]);
			if (e !== null && t !== null) {
				let n = Object.keys(e), r = Object.keys(t);
				return n.length === r.length && n.every((n) => e[n] === t[n]);
			}
			return e === t;
		}
		toRgba() {
			let [e, t, n, r] = this._components;
			return {
				r: e,
				g: t,
				b: n,
				a: r
			};
		}
		toRgb() {
			let [e, t, n] = this._components;
			return {
				r: e,
				g: t,
				b: n
			};
		}
		toRgbaString() {
			let [e, t, n] = this.toUint8RgbArray();
			return `rgba(${e},${t},${n},${this.alpha})`;
		}
		toUint8RgbArray(e) {
			let [t, n, r] = this._components;
			return this._arrayRgb ||= [], e ||= this._arrayRgb, e[0] = Math.round(t * 255), e[1] = Math.round(n * 255), e[2] = Math.round(r * 255), e;
		}
		toArray(e) {
			this._arrayRgba ||= [], e ||= this._arrayRgba;
			let [t, n, r, i] = this._components;
			return e[0] = t, e[1] = n, e[2] = r, e[3] = i, e;
		}
		toRgbArray(e) {
			this._arrayRgb ||= [], e ||= this._arrayRgb;
			let [t, n, r] = this._components;
			return e[0] = t, e[1] = n, e[2] = r, e;
		}
		toNumber() {
			return this._int;
		}
		toBgrNumber() {
			let [e, t, n] = this.toUint8RgbArray();
			return (n << 16) + (t << 8) + e;
		}
		toLittleEndianNumber() {
			let e = this._int;
			return (e >> 16) + (e & 65280) + ((e & 255) << 16);
		}
		multiply(t) {
			let [n, r, i, a] = e._temp.setValue(t)._components;
			return this._components[0] *= n, this._components[1] *= r, this._components[2] *= i, this._components[3] *= a, this._refreshInt(), this._value = null, this;
		}
		premultiply(e, t = !0) {
			return t && (this._components[0] *= e, this._components[1] *= e, this._components[2] *= e), this._components[3] = e, this._refreshInt(), this._value = null, this;
		}
		toPremultiplied(e, t = !0) {
			if (e === 1) return (255 << 24) + this._int;
			if (e === 0) return t ? 0 : this._int;
			let n = this._int >> 16 & 255, r = this._int >> 8 & 255, i = this._int & 255;
			return t && (n = n * e + .5 | 0, r = r * e + .5 | 0, i = i * e + .5 | 0), (e * 255 << 24) + (n << 16) + (r << 8) + i;
		}
		toHex() {
			let e = this._int.toString(16);
			return `#${"000000".substring(0, 6 - e.length) + e}`;
		}
		toHexa() {
			let e = Math.round(this._components[3] * 255).toString(16);
			return this.toHex() + "00".substring(0, 2 - e.length) + e;
		}
		setAlpha(e) {
			return this._components[3] = this._clamp(e), this._value = null, this;
		}
		_normalize(t) {
			let n, r, i, a;
			if ((typeof t == "number" || t instanceof Number) && t >= 0 && t <= 16777215) {
				let e = t;
				n = (e >> 16 & 255) / 255, r = (e >> 8 & 255) / 255, i = (e & 255) / 255, a = 1;
			} else if ((Array.isArray(t) || t instanceof Float32Array) && t.length >= 3 && t.length <= 4) t = this._clamp(t), [n, r, i, a = 1] = t;
			else if ((t instanceof Uint8Array || t instanceof Uint8ClampedArray) && t.length >= 3 && t.length <= 4) t = this._clamp(t, 0, 255), [n, r, i, a = 255] = t, n /= 255, r /= 255, i /= 255, a /= 255;
			else if (typeof t == "string" || typeof t == "object") {
				if (typeof t == "string") {
					let n = e.HEX_PATTERN.exec(t);
					n && (t = `#${n[2]}`);
				}
				let o = Se(t);
				o.isValid() && ({r: n, g: r, b: i, a} = o.rgba, n /= 255, r /= 255, i /= 255);
			}
			if (n !== void 0) this._components[0] = n, this._components[1] = r, this._components[2] = i, this._components[3] = a, this._refreshInt();
			else throw Error(`Unable to convert color ${t}`);
		}
		_refreshInt() {
			this._clamp(this._components);
			let [e, t, n] = this._components;
			this._int = (e * 255 << 16) + (t * 255 << 8) + (n * 255 | 0);
		}
		_clamp(e, t = 0, n = 1) {
			return typeof e == "number" ? Math.min(Math.max(e, t), n) : (e.forEach((r, i) => {
				e[i] = Math.min(Math.max(r, t), n);
			}), e);
		}
		static isColorLike(t) {
			return t == null ? !1 : typeof t == "number" || typeof t == "string" || t instanceof Number || t instanceof e || Array.isArray(t) || t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Float32Array || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 && t.a !== void 0;
		}
	}, Oe.shared = new Oe(), Oe._temp = new Oe(), Oe.HEX_PATTERN = /^(#|0x)?(([a-f0-9]{3}){1,2}([a-f0-9]{2})?)$/i, A = Oe;
})), Ae, je = o((() => {
	Ae = {
		cullArea: null,
		cullable: !1,
		cullableChildren: !0
	};
})), Me, Ne, Pe, Fe = o((() => {
	Me = Math.PI * 2, Ne = 180 / Math.PI, Pe = Math.PI / 180;
})), Ie, Le, Re = o((() => {
	Ie = class e {
		constructor(e = 0, t = 0) {
			this.x = 0, this.y = 0, this.x = e, this.y = t;
		}
		clone() {
			return new e(this.x, this.y);
		}
		copyFrom(e) {
			return this.set(e.x, e.y), this;
		}
		copyTo(e) {
			return e.set(this.x, this.y), e;
		}
		equals(e) {
			return e.x === this.x && e.y === this.y;
		}
		set(e = 0, t = e) {
			return this.x = e, this.y = t, this;
		}
		toString() {
			return `[pixi.js/math:Point x=${this.x} y=${this.y}]`;
		}
		static get shared() {
			return Le.x = 0, Le.y = 0, Le;
		}
	}, Le = new Ie();
})), j, ze, Be, M = o((() => {
	Fe(), Re(), j = class e {
		constructor(e = 1, t = 0, n = 0, r = 1, i = 0, a = 0) {
			this.array = null, this.a = e, this.b = t, this.c = n, this.d = r, this.tx = i, this.ty = a;
		}
		fromArray(e) {
			this.a = e[0], this.b = e[1], this.c = e[3], this.d = e[4], this.tx = e[2], this.ty = e[5];
		}
		set(e, t, n, r, i, a) {
			return this.a = e, this.b = t, this.c = n, this.d = r, this.tx = i, this.ty = a, this;
		}
		toArray(e, t) {
			this.array ||= /* @__PURE__ */ new Float32Array(9);
			let n = t || this.array;
			return e ? (n[0] = this.a, n[1] = this.b, n[2] = 0, n[3] = this.c, n[4] = this.d, n[5] = 0, n[6] = this.tx, n[7] = this.ty, n[8] = 1) : (n[0] = this.a, n[1] = this.c, n[2] = this.tx, n[3] = this.b, n[4] = this.d, n[5] = this.ty, n[6] = 0, n[7] = 0, n[8] = 1), n;
		}
		apply(e, t) {
			t ||= new Ie();
			let n = e.x, r = e.y;
			return t.x = this.a * n + this.c * r + this.tx, t.y = this.b * n + this.d * r + this.ty, t;
		}
		applyInverse(e, t) {
			t ||= new Ie();
			let n = this.a, r = this.b, i = this.c, a = this.d, o = this.tx, s = this.ty, c = 1 / (n * a + i * -r), l = e.x, u = e.y;
			return t.x = a * c * l + -i * c * u + (s * i - o * a) * c, t.y = n * c * u + -r * c * l + (-s * n + o * r) * c, t;
		}
		translate(e, t) {
			return this.tx += e, this.ty += t, this;
		}
		scale(e, t) {
			return this.a *= e, this.d *= t, this.c *= e, this.b *= t, this.tx *= e, this.ty *= t, this;
		}
		rotate(e) {
			let t = Math.cos(e), n = Math.sin(e), r = this.a, i = this.c, a = this.tx;
			return this.a = r * t - this.b * n, this.b = r * n + this.b * t, this.c = i * t - this.d * n, this.d = i * n + this.d * t, this.tx = a * t - this.ty * n, this.ty = a * n + this.ty * t, this;
		}
		append(e) {
			let t = this.a, n = this.b, r = this.c, i = this.d;
			return this.a = e.a * t + e.b * r, this.b = e.a * n + e.b * i, this.c = e.c * t + e.d * r, this.d = e.c * n + e.d * i, this.tx = e.tx * t + e.ty * r + this.tx, this.ty = e.tx * n + e.ty * i + this.ty, this;
		}
		appendFrom(e, t) {
			let n = e.a, r = e.b, i = e.c, a = e.d, o = e.tx, s = e.ty, c = t.a, l = t.b, u = t.c, d = t.d;
			return this.a = n * c + r * u, this.b = n * l + r * d, this.c = i * c + a * u, this.d = i * l + a * d, this.tx = o * c + s * u + t.tx, this.ty = o * l + s * d + t.ty, this;
		}
		setTransform(e, t, n, r, i, a, o, s, c) {
			return this.a = Math.cos(o + c) * i, this.b = Math.sin(o + c) * i, this.c = -Math.sin(o - s) * a, this.d = Math.cos(o - s) * a, this.tx = e - (n * this.a + r * this.c), this.ty = t - (n * this.b + r * this.d), this;
		}
		prepend(e) {
			let t = this.tx;
			if (e.a !== 1 || e.b !== 0 || e.c !== 0 || e.d !== 1) {
				let t = this.a, n = this.c;
				this.a = t * e.a + this.b * e.c, this.b = t * e.b + this.b * e.d, this.c = n * e.a + this.d * e.c, this.d = n * e.b + this.d * e.d;
			}
			return this.tx = t * e.a + this.ty * e.c + e.tx, this.ty = t * e.b + this.ty * e.d + e.ty, this;
		}
		decompose(e) {
			let t = this.a, n = this.b, r = this.c, i = this.d, a = e.pivot, o = -Math.atan2(-r, i), s = Math.atan2(n, t), c = Math.abs(o + s), l = Math.sqrt(t * t + n * n);
			return c < 1e-5 || Math.abs(Me - c) < 1e-5 ? (e.rotation = s, e.skew.x = e.skew.y = 0) : Math.abs(Math.PI - c) < 1e-5 ? (e.rotation = s - Math.PI, e.skew.x = e.skew.y = 0, l = -l) : (e.rotation = 0, e.skew.x = o, e.skew.y = s), e.scale.x = l, e.scale.y = Math.sqrt(r * r + i * i), e.position.x = this.tx + (a.x * t + a.y * r), e.position.y = this.ty + (a.x * n + a.y * i), e;
		}
		invert() {
			let e = this.a, t = this.b, n = this.c, r = this.d, i = this.tx, a = e * r - t * n;
			return this.a = r / a, this.b = -t / a, this.c = -n / a, this.d = e / a, this.tx = (n * this.ty - r * i) / a, this.ty = -(e * this.ty - t * i) / a, this;
		}
		isIdentity() {
			return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.tx === 0 && this.ty === 0;
		}
		identity() {
			return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.tx = 0, this.ty = 0, this;
		}
		clone() {
			let t = new e();
			return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t;
		}
		copyTo(e) {
			return e.a = this.a, e.b = this.b, e.c = this.c, e.d = this.d, e.tx = this.tx, e.ty = this.ty, e;
		}
		copyFrom(e) {
			return this.a = e.a, this.b = e.b, this.c = e.c, this.d = e.d, this.tx = e.tx, this.ty = e.ty, this;
		}
		equals(e) {
			return e.a === this.a && e.b === this.b && e.c === this.c && e.d === this.d && e.tx === this.tx && e.ty === this.ty;
		}
		toString() {
			return `[pixi.js:Matrix a=${this.a} b=${this.b} c=${this.c} d=${this.d} tx=${this.tx} ty=${this.ty}]`;
		}
		static get IDENTITY() {
			return Be.identity();
		}
		static get shared() {
			return ze.identity();
		}
	}, ze = new j(), Be = new j();
})), Ve, He = o((() => {
	Ve = class e {
		constructor(e, t, n) {
			this._x = t || 0, this._y = n || 0, this._observer = e;
		}
		clone(t) {
			return new e(t ?? this._observer, this._x, this._y);
		}
		set(e = 0, t = e) {
			return (this._x !== e || this._y !== t) && (this._x = e, this._y = t, this._observer._onUpdate(this)), this;
		}
		copyFrom(e) {
			return (this._x !== e.x || this._y !== e.y) && (this._x = e.x, this._y = e.y, this._observer._onUpdate(this)), this;
		}
		copyTo(e) {
			return e.set(this._x, this._y), e;
		}
		equals(e) {
			return e.x === this._x && e.y === this._y;
		}
		toString() {
			return `[pixi.js/math:ObservablePoint x=${this._x} y=${this._y} scope=${this._observer}]`;
		}
		get x() {
			return this._x;
		}
		set x(e) {
			this._x !== e && (this._x = e, this._observer._onUpdate(this));
		}
		get y() {
			return this._y;
		}
		set y(e) {
			this._y !== e && (this._y = e, this._observer._onUpdate(this));
		}
	};
}));
// node_modules/pixi.js/lib/utils/data/uid.mjs
function N(e = "default") {
	return Ue[e] === void 0 && (Ue[e] = -1), ++Ue[e];
}
var Ue, We = o((() => {
	Ue = { default: -1 };
})), Ge, P, Ke, qe, Je, Ye, F, Xe = o((() => {
	Ge = /* @__PURE__ */ new Set(), P = "8.0.0", Ke = "8.3.4", qe = "8.21.0", Je = "8.22.0", Ye = {
		quiet: !1,
		noColor: !1
	}, F = ((e, t, n = 3) => {
		if (Ye.quiet || Ge.has(t)) return;
		let r = (/* @__PURE__ */ Error()).stack, i = `${t}
Deprecated since v${e}`, a = typeof console.groupCollapsed == "function" && !Ye.noColor;
		r === void 0 ? console.warn("PixiJS Deprecation Warning: ", i) : (r = r.split("\n").splice(n).join("\n"), a ? (console.groupCollapsed("%cPixiJS Deprecation Warning: %c%s", "color:#614108;background:#fffbe6", "font-weight:normal;color:#614108;background:#fffbe6", i), console.warn(r), console.groupEnd()) : (console.warn("PixiJS Deprecation Warning: ", i), console.warn(r))), Ge.add(t);
	}), Object.defineProperties(F, {
		quiet: {
			get: () => Ye.quiet,
			set: (e) => {
				Ye.quiet = e;
			},
			enumerable: !0,
			configurable: !1
		},
		noColor: {
			get: () => Ye.noColor,
			set: (e) => {
				Ye.noColor = e;
			},
			enumerable: !0,
			configurable: !1
		}
	});
}));
// node_modules/pixi.js/lib/utils/logging/warn.mjs
function I(...e) {
	Ze !== Qe && (Ze++, Ze === Qe ? console.warn("PixiJS Warning: too many warnings, no more warnings will be reported to the console by PixiJS.") : console.warn("PixiJS Warning: ", ...e));
}
var Ze, Qe, L = o((() => {
	Ze = 0, Qe = 500;
})), $e, et = o((() => {
	$e = {
		_registeredResources: /* @__PURE__ */ new Set(),
		register(e) {
			this._registeredResources.add(e);
		},
		unregister(e) {
			this._registeredResources.delete(e);
		},
		release() {
			this._registeredResources.forEach((e) => e.clear());
		},
		get registeredCount() {
			return this._registeredResources.size;
		},
		isRegistered(e) {
			return this._registeredResources.has(e);
		},
		reset() {
			this._registeredResources.clear();
		}
	};
})), tt, nt = o((() => {
	tt = class {
		constructor(e, t) {
			this._pool = [], this._count = 0, this._index = 0, this._classType = e, t && this.prepopulate(t);
		}
		prepopulate(e) {
			for (let t = 0; t < e; t++) this._pool[this._index++] = new this._classType();
			this._count += e;
		}
		get(e) {
			let t;
			return this._index > 0 ? t = this._pool[--this._index] : (t = new this._classType(), this._count++), t.init?.(e), t;
		}
		return(e) {
			e.reset?.(), this._pool[this._index++] = e;
		}
		get totalSize() {
			return this._count;
		}
		get totalFree() {
			return this._index;
		}
		get totalUsed() {
			return this._count - this._index;
		}
		clear() {
			if (this._pool.length > 0 && this._pool[0].destroy) for (let e = 0; e < this._index; e++) this._pool[e].destroy();
			this._pool.length = 0, this._count = 0, this._index = 0;
		}
	};
})), rt, it, at = o((() => {
	et(), nt(), rt = class {
		constructor() {
			this._poolsByClass = /* @__PURE__ */ new Map();
		}
		prepopulate(e, t) {
			this.getPool(e).prepopulate(t);
		}
		get(e, t) {
			return this.getPool(e).get(t);
		}
		return(e) {
			this.getPool(e.constructor).return(e);
		}
		getPool(e) {
			return this._poolsByClass.has(e) || this._poolsByClass.set(e, new tt(e)), this._poolsByClass.get(e);
		}
		stats() {
			let e = {};
			return this._poolsByClass.forEach((t) => {
				let n = e[t._classType.name] ? t._classType.name + t._classType.ID : t._classType.name;
				e[n] = {
					free: t.totalFree,
					used: t.totalUsed,
					size: t.totalSize
				};
			}), e;
		}
		clear() {
			this._poolsByClass.forEach((e) => e.clear()), this._poolsByClass.clear();
		}
	}, it = new rt(), $e.register(it);
})), ot, st = o((() => {
	Xe(), ot = {
		get isCachedAsTexture() {
			return !!this.renderGroup?.isCachedAsTexture;
		},
		cacheAsTexture(e) {
			typeof e == "boolean" && e === !1 ? this.disableRenderGroup() : (this.enableRenderGroup(), this.renderGroup.enableCacheAsTexture(e === !0 ? {} : e));
		},
		updateCacheTexture() {
			this.renderGroup?.updateCacheTexture();
		},
		get cacheAsBitmap() {
			return this.isCachedAsTexture;
		},
		set cacheAsBitmap(e) {
			F("v8.6.0", "cacheAsBitmap is deprecated, use cacheAsTexture instead."), this.cacheAsTexture(e);
		}
	};
}));
// node_modules/pixi.js/lib/utils/data/removeItems.mjs
function ct(e, t, n) {
	let r = e.length, i;
	if (t >= r || n === 0) return;
	n = t + n > r ? r - t : n;
	let a = r - n;
	for (i = t; i < a; ++i) e[i] = e[i + n];
	e.length = a;
}
var lt = o((() => {})), ut, dt = o((() => {
	lt(), Xe(), ut = {
		allowChildren: !0,
		removeChildren(e = 0, t) {
			let n = t ?? this.children.length, r = n - e, i = [];
			if (r > 0 && r <= n) {
				for (let t = n - 1; t >= e; t--) {
					let e = this.children[t];
					e && (i.push(e), e.parent = null);
				}
				ct(this.children, e, r);
				let t = this.renderGroup || this.parentRenderGroup;
				t && t.removeChildren(i);
				for (let e = 0; e < i.length; ++e) {
					let t = i[e];
					t.parentRenderLayer?.detach(t), this.emit("childRemoved", t, this, e), i[e].emit("removed", this);
				}
				return i.length > 0 && this._didViewChangeTick++, i;
			}
			if (r === 0 && this.children.length === 0) return i;
			throw RangeError("removeChildren: numeric values are outside the acceptable range.");
		},
		removeChildAt(e) {
			let t = this.getChildAt(e);
			return this.removeChild(t);
		},
		getChildAt(e) {
			if (e < 0 || e >= this.children.length) throw Error(`getChildAt: Index (${e}) does not exist.`);
			return this.children[e];
		},
		setChildIndex(e, t) {
			if (t < 0 || t >= this.children.length) throw Error(`The index ${t} supplied is out of bounds ${this.children.length}`);
			this.getChildIndex(e), this.addChildAt(e, t);
		},
		getChildIndex(e) {
			let t = this.children.indexOf(e);
			if (t === -1) throw Error("The supplied Container must be a child of the caller");
			return t;
		},
		addChildAt(e, t) {
			this.allowChildren || F(P, "addChildAt: Only Containers will be allowed to add children in v8.0.0");
			let { children: n } = this;
			if (t < 0 || t > n.length) throw Error(`${e}addChildAt: The index ${t} supplied is out of bounds ${n.length}`);
			let r = e.parent === this;
			if (e.parent) {
				let n = e.parent.children.indexOf(e);
				if (r) {
					if (n === t) return e;
					e.parent.children.splice(n, 1);
				} else e.removeFromParent();
			}
			t === n.length ? n.push(e) : n.splice(t, 0, e);
			let i = this.renderGroup || this.parentRenderGroup;
			return this.sortableChildren && (this.sortDirty = !0), r ? (i && (i.structureDidChange = !0), e) : (e.parent = this, e.didChange = !0, e._updateFlags = 15, i && i.addChild(e), this.emit("childAdded", e, this, t), e.emit("added", this), e);
		},
		swapChildren(e, t) {
			if (e === t) return;
			let n = this.getChildIndex(e), r = this.getChildIndex(t);
			this.children[n] = t, this.children[r] = e;
			let i = this.renderGroup || this.parentRenderGroup;
			i && (i.structureDidChange = !0), this._didContainerChangeTick++;
		},
		removeFromParent() {
			this.parent?.removeChild(this);
		},
		reparentChild(...e) {
			return e.length === 1 ? this.reparentChildAt(e[0], this.children.length) : (e.forEach((e) => this.reparentChildAt(e, this.children.length)), e[0]);
		},
		reparentChildAt(e, t) {
			if (e.parent === this) return this.setChildIndex(e, t), e;
			let n = e.worldTransform.clone();
			e.removeFromParent(), this.addChildAt(e, t);
			let r = this.worldTransform.clone();
			return r.invert(), n.prepend(r), e.setFromMatrix(n), e;
		},
		replaceChild(e, t) {
			e.updateLocalTransform(), this.addChildAt(t, this.getChildIndex(e)), t.setFromMatrix(e.localTransform), t.updateLocalTransform(), this.removeChild(e);
		}
	};
})), ft, pt = o((() => {
	ft = {
		collectRenderables(e, t, n) {
			this.parentRenderLayer && this.parentRenderLayer !== n || this.globalDisplayStatus < 7 || !this.includeInBuild || (this.sortableChildren && this.sortChildren(), this.isSimple ? this.collectRenderablesSimple(e, t, n) : this.renderGroup ? t.renderPipes.renderGroup.addRenderGroup(this.renderGroup, e) : this.collectRenderablesWithEffects(e, t, n));
		},
		collectRenderablesSimple(e, t, n) {
			let r = this.children, i = r.length;
			for (let a = 0; a < i; a++) r[a].collectRenderables(e, t, n);
		},
		collectRenderablesWithEffects(e, t, n) {
			let { renderPipes: r } = t;
			for (let t = 0; t < this.effects.length; t++) {
				let n = this.effects[t];
				r[n.pipe].push(n, this, e);
			}
			this.collectRenderablesSimple(e, t, n);
			for (let t = this.effects.length - 1; t >= 0; t--) {
				let n = this.effects[t];
				r[n.pipe].pop(n, this, e);
			}
		}
	};
})), mt, ht = o((() => {
	mt = class {
		constructor() {
			this.pipe = "filter", this.priority = 1;
		}
		destroy() {
			for (let e = 0; e < this.filters.length; e++) this.filters[e].destroy();
			this.filters = null, this.filterArea = null;
		}
	};
})), gt, _t, vt = o((() => {
	h(), at(), gt = class {
		constructor() {
			this._effectClasses = [], this._tests = [], this._initialized = !1;
		}
		init() {
			this._initialized || (this._initialized = !0, this._effectClasses.forEach((e) => {
				this.add({
					test: e.test,
					maskClass: e
				});
			}));
		}
		add(e) {
			this._tests.push(e);
		}
		getMaskEffect(e) {
			this._initialized || this.init();
			for (let t = 0; t < this._tests.length; t++) {
				let n = this._tests[t];
				if (n.test(e)) return it.get(n.maskClass, e);
			}
			return e;
		}
		returnMaskEffect(e) {
			it.return(e);
		}
	}, _t = new gt(), m.handleByList(d.MaskEffect, _t._effectClasses);
})), yt, bt = o((() => {
	ht(), vt(), yt = {
		_maskEffect: null,
		_maskOptions: {
			inverse: !1,
			channel: "red"
		},
		_filterEffect: null,
		effects: [],
		_markStructureAsChanged() {
			let e = this.renderGroup || this.parentRenderGroup;
			e && (e.structureDidChange = !0);
		},
		addEffect(e) {
			this.effects.indexOf(e) === -1 && (this.effects.push(e), this.effects.sort((e, t) => e.priority - t.priority), this._markStructureAsChanged(), this._updateIsSimple());
		},
		removeEffect(e) {
			let t = this.effects.indexOf(e);
			t !== -1 && (this.effects.splice(t, 1), this._markStructureAsChanged(), this._updateIsSimple());
		},
		set mask(e) {
			let t = this._maskEffect;
			t?.mask !== e && (t && (this.removeEffect(t), _t.returnMaskEffect(t), this._maskEffect = null), e != null && (this._maskEffect = _t.getMaskEffect(e), this.addEffect(this._maskEffect)));
		},
		get mask() {
			return this._maskEffect?.mask;
		},
		setMask(e) {
			this._maskOptions = {
				...this._maskOptions,
				...e
			}, e.mask && (this.mask = e.mask), this._markStructureAsChanged();
		},
		set filters(e) {
			!Array.isArray(e) && e && (e = [e]);
			let t = this._filterEffect ||= new mt();
			e = e;
			let n = e?.length > 0, r = n !== t.filters?.length > 0;
			e = Array.isArray(e) ? e.slice(0) : e, t.filters = Object.freeze(e), r && (n ? this.addEffect(t) : (this.removeEffect(t), t.filters = e ?? null));
		},
		get filters() {
			return this._filterEffect?.filters;
		},
		set filterArea(e) {
			this._filterEffect ||= new mt(), this._filterEffect.filterArea = e;
		},
		get filterArea() {
			return this._filterEffect?.filterArea;
		}
	};
})), xt, St = o((() => {
	Xe(), xt = {
		label: null,
		get name() {
			return F(P, "Container.name property has been removed, use Container.label instead"), this.label;
		},
		set name(e) {
			F(P, "Container.name property has been removed, use Container.label instead"), this.label = e;
		},
		getChildByName(e, t = !1) {
			return this.getChildByLabel(e, t);
		},
		getChildByLabel(e, t = !1) {
			let n = this.children;
			for (let t = 0; t < n.length; t++) {
				let r = n[t];
				if (r.label === e || e instanceof RegExp && e.test(r.label)) return r;
			}
			if (t) for (let t = 0; t < n.length; t++) {
				let r = n[t].getChildByLabel(e, !0);
				if (r) return r;
			}
			return null;
		},
		getChildrenByLabel(e, t = !1, n = []) {
			let r = this.children;
			for (let t = 0; t < r.length; t++) {
				let i = r[t];
				(i.label === e || e instanceof RegExp && e.test(i.label)) && n.push(i);
			}
			if (t) for (let t = 0; t < r.length; t++) r[t].getChildrenByLabel(e, !0, n);
			return n;
		}
	};
})), Ct, R, wt = o((() => {
	Re(), Ct = [
		new Ie(),
		new Ie(),
		new Ie(),
		new Ie()
	], R = class e {
		constructor(e = 0, t = 0, n = 0, r = 0) {
			this.type = "rectangle", this.x = Number(e), this.y = Number(t), this.width = Number(n), this.height = Number(r);
		}
		get left() {
			return this.x;
		}
		get right() {
			return this.x + this.width;
		}
		get top() {
			return this.y;
		}
		get bottom() {
			return this.y + this.height;
		}
		isEmpty() {
			return this.left === this.right || this.top === this.bottom;
		}
		static get EMPTY() {
			return new e(0, 0, 0, 0);
		}
		clone() {
			return new e(this.x, this.y, this.width, this.height);
		}
		copyFromBounds(e) {
			return this.x = e.minX, this.y = e.minY, this.width = e.maxX - e.minX, this.height = e.maxY - e.minY, this;
		}
		copyFrom(e) {
			return this.x = e.x, this.y = e.y, this.width = e.width, this.height = e.height, this;
		}
		copyTo(e) {
			return e.copyFrom(this), e;
		}
		contains(e, t) {
			return this.width <= 0 || this.height <= 0 ? !1 : e >= this.x && e < this.x + this.width && t >= this.y && t < this.y + this.height;
		}
		strokeContains(e, t, n, r = .5) {
			let { width: i, height: a } = this;
			if (i <= 0 || a <= 0) return !1;
			let o = this.x, s = this.y, c = n * (1 - r), l = n - c, u = o - c, d = o + i + c, f = s - c, p = s + a + c, m = o + l, h = o + i - l, g = s + l, _ = s + a - l;
			return e >= u && e <= d && t >= f && t <= p && !(e > m && e < h && t > g && t < _);
		}
		intersects(e, t) {
			if (!t) {
				let t = this.x < e.x ? e.x : this.x;
				if ((this.right > e.right ? e.right : this.right) <= t) return !1;
				let n = this.y < e.y ? e.y : this.y;
				return (this.bottom > e.bottom ? e.bottom : this.bottom) > n;
			}
			let n = this.left, r = this.right, i = this.top, a = this.bottom;
			if (r <= n || a <= i) return !1;
			let o = Ct[0].set(e.left, e.top), s = Ct[1].set(e.left, e.bottom), c = Ct[2].set(e.right, e.top), l = Ct[3].set(e.right, e.bottom);
			if (c.x <= o.x || s.y <= o.y) return !1;
			let u = Math.sign(t.a * t.d - t.b * t.c);
			if (u === 0 || (t.apply(o, o), t.apply(s, s), t.apply(c, c), t.apply(l, l), Math.max(o.x, s.x, c.x, l.x) <= n || Math.min(o.x, s.x, c.x, l.x) >= r || Math.max(o.y, s.y, c.y, l.y) <= i || Math.min(o.y, s.y, c.y, l.y) >= a)) return !1;
			let d = u * (s.y - o.y), f = u * (o.x - s.x), p = d * n + f * i, m = d * r + f * i, h = d * n + f * a, g = d * r + f * a;
			if (Math.max(p, m, h, g) <= d * o.x + f * o.y || Math.min(p, m, h, g) >= d * l.x + f * l.y) return !1;
			let _ = u * (o.y - c.y), v = u * (c.x - o.x), y = _ * n + v * i, b = _ * r + v * i, x = _ * n + v * a, S = _ * r + v * a;
			return !(Math.max(y, b, x, S) <= _ * o.x + v * o.y || Math.min(y, b, x, S) >= _ * l.x + v * l.y);
		}
		pad(e = 0, t = e) {
			return this.x -= e, this.y -= t, this.width += e * 2, this.height += t * 2, this;
		}
		fit(e) {
			let t = Math.max(this.x, e.x), n = Math.min(this.x + this.width, e.x + e.width), r = Math.max(this.y, e.y), i = Math.min(this.y + this.height, e.y + e.height);
			return this.x = t, this.width = Math.max(n - t, 0), this.y = r, this.height = Math.max(i - r, 0), this;
		}
		ceil(e = 1, t = .001) {
			let n = Math.ceil((this.x + this.width - t) * e) / e, r = Math.ceil((this.y + this.height - t) * e) / e;
			return this.x = Math.floor((this.x + t) * e) / e, this.y = Math.floor((this.y + t) * e) / e, this.width = n - this.x, this.height = r - this.y, this;
		}
		scale(e, t = e) {
			return this.x *= e, this.y *= t, this.width *= e, this.height *= t, this;
		}
		enlarge(e) {
			let t = Math.min(this.x, e.x), n = Math.max(this.x + this.width, e.x + e.width), r = Math.min(this.y, e.y), i = Math.max(this.y + this.height, e.y + e.height);
			return this.x = t, this.width = n - t, this.y = r, this.height = i - r, this;
		}
		getBounds(t) {
			return t ||= new e(), t.copyFrom(this), t;
		}
		containsRect(e) {
			if (this.width <= 0 || this.height <= 0) return !1;
			let t = e.x, n = e.y, r = e.x + e.width, i = e.y + e.height;
			return t >= this.x && t < this.x + this.width && n >= this.y && n < this.y + this.height && r >= this.x && r <= this.x + this.width && i >= this.y && i <= this.y + this.height;
		}
		set(e, t, n, r) {
			return this.x = e, this.y = t, this.width = n, this.height = r, this;
		}
		toString() {
			return `[pixi.js/math:Rectangle x=${this.x} y=${this.y} width=${this.width} height=${this.height}]`;
		}
	};
})), Tt, Et, Dt = o((() => {
	M(), wt(), Tt = new j(), Et = class e {
		constructor(e = Infinity, t = Infinity, n = -Infinity, r = -Infinity) {
			this.minX = Infinity, this.minY = Infinity, this.maxX = -Infinity, this.maxY = -Infinity, this.matrix = Tt, this.minX = e, this.minY = t, this.maxX = n, this.maxY = r;
		}
		isEmpty() {
			return this.minX > this.maxX || this.minY > this.maxY;
		}
		get rectangle() {
			this._rectangle ||= new R();
			let e = this._rectangle;
			return this.minX > this.maxX || this.minY > this.maxY ? (e.x = 0, e.y = 0, e.width = 0, e.height = 0) : e.copyFromBounds(this), e;
		}
		clear() {
			return this.minX = Infinity, this.minY = Infinity, this.maxX = -Infinity, this.maxY = -Infinity, this.matrix = Tt, this;
		}
		set(e, t, n, r) {
			this.minX = e, this.minY = t, this.maxX = n, this.maxY = r;
		}
		addFrame(e, t, n, r, i) {
			i ||= this.matrix;
			let a = i.a, o = i.b, s = i.c, c = i.d, l = i.tx, u = i.ty, d = this.minX, f = this.minY, p = this.maxX, m = this.maxY, h = a * e + s * t + l, g = o * e + c * t + u;
			h < d && (d = h), g < f && (f = g), h > p && (p = h), g > m && (m = g), h = a * n + s * t + l, g = o * n + c * t + u, h < d && (d = h), g < f && (f = g), h > p && (p = h), g > m && (m = g), h = a * e + s * r + l, g = o * e + c * r + u, h < d && (d = h), g < f && (f = g), h > p && (p = h), g > m && (m = g), h = a * n + s * r + l, g = o * n + c * r + u, h < d && (d = h), g < f && (f = g), h > p && (p = h), g > m && (m = g), this.minX = d, this.minY = f, this.maxX = p, this.maxY = m;
		}
		addRect(e, t) {
			this.addFrame(e.x, e.y, e.x + e.width, e.y + e.height, t);
		}
		addBounds(e, t) {
			this.addFrame(e.minX, e.minY, e.maxX, e.maxY, t);
		}
		addBoundsMask(e) {
			this.minX = this.minX > e.minX ? this.minX : e.minX, this.minY = this.minY > e.minY ? this.minY : e.minY, this.maxX = this.maxX < e.maxX ? this.maxX : e.maxX, this.maxY = this.maxY < e.maxY ? this.maxY : e.maxY;
		}
		applyMatrix(e) {
			let t = this.minX, n = this.minY, r = this.maxX, i = this.maxY, { a, b: o, c: s, d: c, tx: l, ty: u } = e, d = a * t + s * n + l, f = o * t + c * n + u;
			this.minX = d, this.minY = f, this.maxX = d, this.maxY = f, d = a * r + s * n + l, f = o * r + c * n + u, this.minX = d < this.minX ? d : this.minX, this.minY = f < this.minY ? f : this.minY, this.maxX = d > this.maxX ? d : this.maxX, this.maxY = f > this.maxY ? f : this.maxY, d = a * t + s * i + l, f = o * t + c * i + u, this.minX = d < this.minX ? d : this.minX, this.minY = f < this.minY ? f : this.minY, this.maxX = d > this.maxX ? d : this.maxX, this.maxY = f > this.maxY ? f : this.maxY, d = a * r + s * i + l, f = o * r + c * i + u, this.minX = d < this.minX ? d : this.minX, this.minY = f < this.minY ? f : this.minY, this.maxX = d > this.maxX ? d : this.maxX, this.maxY = f > this.maxY ? f : this.maxY;
		}
		fit(e) {
			return this.minX < e.left && (this.minX = e.left), this.maxX > e.right && (this.maxX = e.right), this.minY < e.top && (this.minY = e.top), this.maxY > e.bottom && (this.maxY = e.bottom), this;
		}
		fitBounds(e, t, n, r) {
			return this.minX < e && (this.minX = e), this.maxX > t && (this.maxX = t), this.minY < n && (this.minY = n), this.maxY > r && (this.maxY = r), this;
		}
		pad(e, t = e) {
			return this.minX -= e, this.maxX += e, this.minY -= t, this.maxY += t, this;
		}
		ceil() {
			return this.minX = Math.floor(this.minX), this.minY = Math.floor(this.minY), this.maxX = Math.ceil(this.maxX), this.maxY = Math.ceil(this.maxY), this;
		}
		clone() {
			return new e(this.minX, this.minY, this.maxX, this.maxY);
		}
		scale(e, t = e) {
			return this.minX *= e, this.minY *= t, this.maxX *= e, this.maxY *= t, this;
		}
		get x() {
			return this.minX;
		}
		set x(e) {
			let t = this.maxX - this.minX;
			this.minX = e, this.maxX = e + t;
		}
		get y() {
			return this.minY;
		}
		set y(e) {
			let t = this.maxY - this.minY;
			this.minY = e, this.maxY = e + t;
		}
		get width() {
			return this.maxX - this.minX;
		}
		set width(e) {
			this.maxX = this.minX + e;
		}
		get height() {
			return this.maxY - this.minY;
		}
		set height(e) {
			this.maxY = this.minY + e;
		}
		get left() {
			return this.minX;
		}
		get right() {
			return this.maxX;
		}
		get top() {
			return this.minY;
		}
		get bottom() {
			return this.maxY;
		}
		get isPositive() {
			return this.maxX - this.minX > 0 && this.maxY - this.minY > 0;
		}
		get isValid() {
			return this.minX + this.minY !== Infinity;
		}
		addVertexData(e, t, n, r) {
			let i = this.minX, a = this.minY, o = this.maxX, s = this.maxY;
			r ||= this.matrix;
			let c = r.a, l = r.b, u = r.c, d = r.d, f = r.tx, p = r.ty;
			for (let r = t; r < n; r += 2) {
				let t = e[r], n = e[r + 1], m = c * t + u * n + f, h = l * t + d * n + p;
				i = m < i ? m : i, a = h < a ? h : a, o = m > o ? m : o, s = h > s ? h : s;
			}
			this.minX = i, this.minY = a, this.maxX = o, this.maxY = s;
		}
		containsPoint(e, t) {
			return this.minX <= e && this.minY <= t && this.maxX >= e && this.maxY >= t;
		}
		toString() {
			return `[pixi.js:Bounds minX=${this.minX} minY=${this.minY} maxX=${this.maxX} maxY=${this.maxY} width=${this.width} height=${this.height}]`;
		}
		copyFrom(e) {
			return this.minX = e.minX, this.minY = e.minY, this.maxX = e.maxX, this.maxY = e.maxY, this;
		}
	};
})), Ot, kt, At = o((() => {
	M(), at(), Dt(), Ot = it.getPool(j), kt = it.getPool(Et);
})), jt, Mt, Nt = o((() => {
	M(), Dt(), At(), jt = new j(), Mt = {
		getFastGlobalBounds(e, t) {
			t ||= new Et(), t.clear(), this._getGlobalBoundsRecursive(!!e, t, this.parentRenderLayer), t.isValid || t.set(0, 0, 0, 0);
			let n = this.renderGroup || this.parentRenderGroup;
			return t.applyMatrix(n.worldTransform), t;
		},
		_getGlobalBoundsRecursive(e, t, n) {
			let r = t;
			if (e && this.parentRenderLayer && this.parentRenderLayer !== n || this.localDisplayStatus !== 7 || !this.measurable) return;
			let i = !!this.effects.length;
			if ((this.renderGroup || i) && (r = kt.get().clear()), this.boundsArea) t.addRect(this.boundsArea, this.worldTransform);
			else {
				if (this.renderPipeId) {
					let e = this.bounds;
					r.addFrame(e.minX, e.minY, e.maxX, e.maxY, this.groupTransform);
				}
				let t = this.children;
				for (let i = 0; i < t.length; i++) t[i]._getGlobalBoundsRecursive(e, r, n);
			}
			if (i) {
				let e = !1, n = this.renderGroup || this.parentRenderGroup;
				for (let t = 0; t < this.effects.length; t++) this.effects[t].addBounds && (e || (e = !0, r.applyMatrix(n.worldTransform)), this.effects[t].addBounds(r, !0));
				e && r.applyMatrix(n.worldTransform.copyTo(jt).invert()), t.addBounds(r), kt.return(r);
			} else this.renderGroup && (t.addBounds(r, this.relativeGroupTransform), kt.return(r));
		}
	};
}));
// node_modules/pixi.js/lib/scene/container/bounds/getGlobalBounds.mjs
function Pt(e, t, n) {
	n.clear();
	let r, i;
	return e.parent ? t ? r = e.parent.worldTransform : (i = Ot.get().identity(), r = It(e, i)) : r = j.IDENTITY, Ft(e, n, r, t), i && Ot.return(i), n.isValid || n.set(0, 0, 0, 0), n;
}
function Ft(e, t, n, r) {
	if (!e.visible || !e.measurable) return;
	let i;
	r ? i = e.worldTransform : (e.updateLocalTransform(), i = Ot.get(), i.appendFrom(e.localTransform, n));
	let a = t, o = !!e.effects.length;
	if (o && (t = kt.get().clear()), e.boundsArea) t.addRect(e.boundsArea, i);
	else {
		let n = e.bounds;
		n && !n.isEmpty() && (t.matrix = i, t.addBounds(n));
		for (let n = 0; n < e.children.length; n++) Ft(e.children[n], t, i, r);
	}
	if (o) {
		for (let n = 0; n < e.effects.length; n++) e.effects[n].addBounds?.(t);
		a.addBounds(t, j.IDENTITY), kt.return(t);
	}
	r || Ot.return(i);
}
function It(e, t) {
	let n = e.parent;
	return n && (It(n, t), n.updateLocalTransform(), t.append(n.localTransform)), t;
}
var Lt = o((() => {
	M(), At();
}));
// node_modules/pixi.js/lib/scene/container/utils/multiplyHexColors.mjs
function Rt(e, t) {
	if (e === 16777215 || !t) return t;
	if (t === 16777215 || !e) return e;
	let n = e >> 16 & 255, r = e >> 8 & 255, i = e & 255, a = t >> 16 & 255, o = t >> 8 & 255, s = t & 255, c = n * a / 255 | 0, l = r * o / 255 | 0, u = i * s / 255 | 0;
	return (c << 16) + (l << 8) + u;
}
var zt = o((() => {}));
// node_modules/pixi.js/lib/scene/container/utils/multiplyColors.mjs
function Bt(e, t) {
	return e === Vt ? t : t === Vt ? e : Rt(e, t);
}
var Vt, Ht = o((() => {
	zt(), Vt = 16777215;
}));
// node_modules/pixi.js/lib/scene/container/container-mixins/getGlobalMixin.mjs
function Ut(e) {
	return ((e & 255) << 16) + (e & 65280) + (e >> 16 & 255);
}
var Wt, Gt = o((() => {
	M(), Lt(), At(), Ht(), Wt = {
		getGlobalAlpha(e) {
			if (e) return this.renderGroup ? this.renderGroup.worldAlpha : this.parentRenderGroup ? this.parentRenderGroup.worldAlpha * this.alpha : this.alpha;
			let t = this.alpha, n = this.parent;
			for (; n;) t *= n.alpha, n = n.parent;
			return t;
		},
		getGlobalTransform(e = new j(), t) {
			if (t) return e.copyFrom(this.worldTransform);
			this.updateLocalTransform();
			let n = It(this, Ot.get().identity());
			return e.appendFrom(this.localTransform, n), Ot.return(n), e;
		},
		getGlobalTint(e) {
			if (e) return this.renderGroup ? Ut(this.renderGroup.worldColor) : this.parentRenderGroup ? Ut(Bt(this.localColor, this.parentRenderGroup.worldColor)) : this.tint;
			let t = this.localColor, n = this.parent;
			for (; n;) t = Bt(t, n.localColor), n = n.parent;
			return Ut(t);
		}
	};
}));
// node_modules/pixi.js/lib/scene/container/bounds/getLocalBounds.mjs
function Kt(e, t, n) {
	return t.clear(), n ||= j.IDENTITY, qt(e, t, n, e, !0), t.isValid || t.set(0, 0, 0, 0), t;
}
function qt(e, t, n, r, i) {
	let a;
	if (i) a = Ot.get(), a = n.copyTo(a);
	else {
		if (!e.visible || !e.measurable) return;
		e.updateLocalTransform();
		let t = e.localTransform;
		a = Ot.get(), a.appendFrom(t, n);
	}
	let o = t, s = !!e.effects.length;
	if (s && (t = kt.get().clear()), e.boundsArea) t.addRect(e.boundsArea, a);
	else {
		e.renderPipeId && (t.matrix = a, t.addBounds(e.bounds));
		let n = e.children;
		for (let e = 0; e < n.length; e++) qt(n[e], t, a, r, !1);
	}
	if (s) {
		for (let n = 0; n < e.effects.length; n++) e.effects[n].addLocalBounds?.(t, r);
		o.addBounds(t, j.IDENTITY), kt.return(t);
	}
	Ot.return(a);
}
var Jt = o((() => {
	M(), At();
}));
// node_modules/pixi.js/lib/scene/container/utils/checkChildrenDidChange.mjs
function Yt(e, t) {
	let n = e.children;
	for (let e = 0; e < n.length; e++) {
		let r = n[e], i = r.uid, a = (r._didViewChangeTick & 65535) << 16 | r._didContainerChangeTick & 65535, o = t.index;
		(t.data[o] !== i || t.data[o + 1] !== a) && (t.data[t.index] = i, t.data[t.index + 1] = a, t.didChange = !0), t.index = o + 2, r.children.length && Yt(r, t);
	}
	return t.didChange;
}
var Xt = o((() => {})), Zt, Qt, $t = o((() => {
	M(), Dt(), Lt(), Jt(), Xt(), Zt = new j(), Qt = {
		_localBoundsCacheId: -1,
		_localBoundsCacheData: null,
		_setWidth(e, t) {
			let n = Math.sign(this.scale.x) || 1;
			t === 0 ? this.scale.x = n : this.scale.x = e / t * n;
		},
		_setHeight(e, t) {
			let n = Math.sign(this.scale.y) || 1;
			t === 0 ? this.scale.y = n : this.scale.y = e / t * n;
		},
		getLocalBounds() {
			this._localBoundsCacheData ||= {
				data: [],
				index: 1,
				didChange: !1,
				localBounds: new Et()
			};
			let e = this._localBoundsCacheData;
			return e.index = 1, e.didChange = !1, e.data[0] !== this._didViewChangeTick && (e.didChange = !0, e.data[0] = this._didViewChangeTick), Yt(this, e), e.didChange && Kt(this, e.localBounds, Zt), e.localBounds;
		},
		getBounds(e, t) {
			return Pt(this, e, t || new Et());
		}
	};
})), en, tn = o((() => {
	en = {
		_onRender: null,
		set onRender(e) {
			let t = this.renderGroup || this.parentRenderGroup;
			e ? (this._onRender || t?.addOnRender(this), this._onRender = e) : (this._onRender && t?.removeOnRender(this), this._onRender = null);
		},
		get onRender() {
			return this._onRender;
		}
	};
}));
// node_modules/pixi.js/lib/scene/container/container-mixins/sortMixin.mjs
function nn(e, t) {
	return e._zIndex - t._zIndex;
}
var rn, an = o((() => {
	rn = {
		_zIndex: 0,
		sortDirty: !1,
		sortableChildren: !1,
		get zIndex() {
			return this._zIndex;
		},
		set zIndex(e) {
			this._zIndex !== e && (this._zIndex = e, this.depthOfChildModified());
		},
		depthOfChildModified() {
			this.parent && (this.parent.sortableChildren = !0, this.parent.sortDirty = !0), this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0);
		},
		sortChildren() {
			this.sortDirty && (this.sortDirty = !1, this.children.sort(nn));
		}
	};
})), on, sn = o((() => {
	Re(), At(), on = {
		getGlobalPosition(e = new Ie(), t = !1) {
			return this.parent ? this.parent.toGlobal(this._position, e, t) : (e.x = this._position.x, e.y = this._position.y), e;
		},
		toGlobal(e, t, n = !1) {
			let r = this.getGlobalTransform(Ot.get(), n);
			return t = r.apply(e, t), Ot.return(r), t;
		},
		toLocal(e, t, n, r) {
			t && (e = t.toGlobal(e, n, r));
			let i = this.getGlobalTransform(Ot.get(), r);
			return n = i.applyInverse(e, n), Ot.return(i), n;
		}
	};
})), cn, ln = o((() => {
	We(), cn = class {
		constructor() {
			this.uid = N("instructionSet"), this.instructions = [], this.instructionSize = 0, this.renderables = [], this.gcTick = 0;
		}
		reset() {
			this.instructionSize = 0;
		}
		destroy() {
			if (this.renderPipes) for (let e in this.renderPipes) this.renderPipes[e].destroyInstructionSet?.(this);
			this.instructions.length = 0, this.renderables.length = 0, this.renderPipes = null, this.gcTick = 0;
		}
		add(e) {
			this.instructions[this.instructionSize++] = e;
		}
		log() {
			this.instructions.length = this.instructionSize, console.table(this.instructions, ["type", "action"]);
		}
	};
}));
// node_modules/pixi.js/lib/maths/misc/pow2.mjs
function un(e) {
	return e += +(e === 0), --e, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e + 1;
}
function dn(e) {
	return !(e & e - 1) && !!e;
}
var fn = o((() => {}));
// node_modules/pixi.js/lib/scene/container/utils/definedProps.mjs
function pn(e) {
	let t = {};
	for (let n in e) e[n] !== void 0 && (t[n] = e[n]);
	return t;
}
var mn = o((() => {}));
// node_modules/pixi.js/lib/rendering/renderers/shared/texture/TextureStyle.mjs
function hn(e) {
	let t = gn[e];
	return t === void 0 && (gn[e] = N("resource")), t;
}
var gn, _n, vn, yn = o((() => {
	y(), We(), Xe(), gn = /* @__PURE__ */ Object.create(null), _n = class e extends v {
		constructor(t = {}) {
			super(), this._resourceType = "textureSampler", this._maxAnisotropy = 1, this.destroyed = !1, t = {
				...e.defaultOptions,
				...t
			}, this.addressMode = t.addressMode, this.addressModeU = t.addressModeU ?? this.addressModeU, this.addressModeV = t.addressModeV ?? this.addressModeV, this.addressModeW = t.addressModeW ?? this.addressModeW, this.scaleMode = t.scaleMode, this.magFilter = t.magFilter ?? this.magFilter, this.minFilter = t.minFilter ?? this.minFilter, this.mipmapFilter = t.mipmapFilter ?? this.mipmapFilter, this.lodMinClamp = t.lodMinClamp, this.lodMaxClamp = t.lodMaxClamp, this.compare = t.compare, this.maxAnisotropy = t.maxAnisotropy ?? 1;
		}
		set addressMode(e) {
			this.addressModeU = e, this.addressModeV = e, this.addressModeW = e;
		}
		get addressMode() {
			return this.addressModeU;
		}
		set wrapMode(e) {
			F(P, "TextureStyle.wrapMode is now TextureStyle.addressMode"), this.addressMode = e;
		}
		get wrapMode() {
			return this.addressMode;
		}
		set scaleMode(e) {
			this.magFilter = e, this.minFilter = e, this.mipmapFilter = e;
		}
		get scaleMode() {
			return this.magFilter;
		}
		set maxAnisotropy(e) {
			this._maxAnisotropy = Math.min(e, 16), this._maxAnisotropy > 1 && (this.scaleMode = "linear");
		}
		get maxAnisotropy() {
			return this._maxAnisotropy;
		}
		get _resourceId() {
			return this._sharedResourceId || this._generateResourceId();
		}
		update() {
			this._sharedResourceId = null, this.emit("change", this);
		}
		_generateResourceId() {
			let e = `${this.addressModeU}-${this.addressModeV}-${this.addressModeW}-${this.magFilter}-${this.minFilter}-${this.mipmapFilter}-${this.lodMinClamp}-${this.lodMaxClamp}-${this.compare}-${this._maxAnisotropy}`;
			return this._sharedResourceId = hn(e), this._resourceId;
		}
		destroy() {
			this.destroyed = !0, this.emit("destroy", this), this.emit("change", this), this.removeAllListeners();
		}
	}, _n.defaultOptions = {
		addressMode: "clamp-to-edge",
		scaleMode: "linear"
	}, vn = _n;
}));
// node_modules/pixi.js/lib/rendering/renderers/shared/texture/sources/TextureSource.mjs
function bn(e) {
	return e.viewDimension ? e.viewDimension : e.depth ? "3d" : e.arrayLayerCount > 1 ? "2d-array" : "2d";
}
function xn(e, t, n) {
	if (e.depth !== void 0 && typeof e.depth != "number") throw Error(`[TextureSource] depth is a 3D texture's depth in texels, but got ${e.depth}. For a depth buffer, use the depth option of a RenderTarget or the renderer.`);
	if (e.depth && e.arrayLayerCount > 1) throw Error("[TextureSource] depth and arrayLayerCount can't be combined: use depth for a 3D texture or arrayLayerCount for a 2D array.");
	if (e.depth && t !== "3d") throw Error(`[TextureSource] depth makes a 3D texture, but viewDimension is '${t}'. Use arrayLayerCount for layered textures.`);
	if (t === "3d" && e.arrayLayerCount > 1) throw Error("[TextureSource] a 3D texture takes depth, not arrayLayerCount.");
	if (e.dimensions && e.dimensions !== n) throw Error(`[TextureSource] dimensions '${e.dimensions}' doesn't match viewDimension '${t}'. Leave dimensions out; it is derived from the view.`);
	if (e.dimensions && F(Je, "TextureSource dimensions is derived from viewDimension and depth; leave it out."), n === "3d" && e.antialias) throw Error("[TextureSource] a 3D texture can't be antialiased: WebGPU has no multisampled 3D textures.");
}
var Sn, Cn, wn = o((() => {
	y(), fn(), mn(), We(), Xe(), yn(), Sn = class e extends v {
		constructor(t = {}) {
			super(), this.options = t, this._gpuData = /* @__PURE__ */ Object.create(null), this._gcLastUsed = -1, this.uid = N("textureSource"), this._resourceType = "textureSource", this._resourceId = N("resource"), this.uploadMethodId = "unknown", this._resolution = 1, this.pixelWidth = 1, this.pixelHeight = 1, this.width = 1, this.height = 1, this.sampleCount = 1, this.mipLevelCount = 1, this.autoGenerateMipmaps = !1, this.format = "rgba8unorm", this.dimension = "2d", this.viewDimension = "2d", this.arrayLayerCount = 1, this.depth = 1, this._ownsStyle = !1, this.antialias = !1, this.transient = !1, this.storage = !1, this._batchTick = -1, this._textureBindLocation = -1;
			let n = t;
			t = {
				...e.defaultOptions,
				...t
			};
			let r = bn(t), i = r === "3d" || r === "1d" ? r : "2d";
			xn(n, r, i), this.label = t.label ?? "", this.resource = t.resource, this.autoGarbageCollect = t.autoGarbageCollect, this._resolution = t.resolution, this.pixelWidth = t.width ? t.width * this._resolution : this.resource ? this.resourceWidth ?? 1 : 1, this.pixelHeight = t.height ? t.height * this._resolution : this.resource ? this.resourceHeight ?? 1 : 1, this.width = this.pixelWidth / this._resolution, this.height = this.pixelHeight / this._resolution, this.format = t.format, this.dimension = i, this.viewDimension = r, this.arrayLayerCount = t.arrayLayerCount, this.depth = i === "3d" ? t.depth ?? 1 : 1, this.mipLevelCount = t.mipLevelCount, this.autoGenerateMipmaps = t.autoGenerateMipmaps, this.sampleCount = t.sampleCount, this.antialias = i !== "3d" && t.antialias, this.transient = t.transient ?? !1, this.storage = t.storage ?? !1, this.alphaMode = t.alphaMode, this.style = new vn(pn(t)), this._ownsStyle = !0, this.destroyed = !1, this._refreshPOT();
		}
		get depthOrArrayLayers() {
			return this.dimension === "3d" ? this.depth : this.arrayLayerCount || 1;
		}
		get source() {
			return this;
		}
		get style() {
			return this._style;
		}
		set style(e) {
			this.style !== e && (this._ownsStyle = !1, this._style?.off("change", this._onStyleChange, this), this._style = e, this._style?.on("change", this._onStyleChange, this), this._onStyleChange());
		}
		set maxAnisotropy(e) {
			this._style.maxAnisotropy = e;
		}
		get maxAnisotropy() {
			return this._style.maxAnisotropy;
		}
		get addressMode() {
			return this._style.addressMode;
		}
		set addressMode(e) {
			this._style.addressMode = e;
		}
		get repeatMode() {
			return this._style.addressMode;
		}
		set repeatMode(e) {
			this._style.addressMode = e;
		}
		get magFilter() {
			return this._style.magFilter;
		}
		set magFilter(e) {
			this._style.magFilter = e;
		}
		get minFilter() {
			return this._style.minFilter;
		}
		set minFilter(e) {
			this._style.minFilter = e;
		}
		get mipmapFilter() {
			return this._style.mipmapFilter;
		}
		set mipmapFilter(e) {
			this._style.mipmapFilter = e;
		}
		get lodMinClamp() {
			return this._style.lodMinClamp;
		}
		set lodMinClamp(e) {
			this._style.lodMinClamp = e;
		}
		get lodMaxClamp() {
			return this._style.lodMaxClamp;
		}
		set lodMaxClamp(e) {
			this._style.lodMaxClamp = e;
		}
		_onStyleChange() {
			this.emit("styleChange", this);
		}
		update() {
			if (this.resource) {
				let e = this._resolution;
				if (this.resize(this.resourceWidth / e, this.resourceHeight / e)) return;
			}
			this.emit("update", this);
		}
		destroy() {
			this.destroyed = !0, this.unload(), this.emit("destroy", this), this._style &&= (this._ownsStyle && this._style.destroy(), null), this.uploadMethodId = null, this.resource = null, this.removeAllListeners();
		}
		unload() {
			this._resourceId = N("resource"), this.emit("change", this), this.emit("unload", this);
			for (let e in this._gpuData) this._gpuData[e]?.destroy?.();
			this._gpuData = /* @__PURE__ */ Object.create(null);
		}
		get resourceWidth() {
			let { resource: e } = this;
			return e.naturalWidth || e.videoWidth || e.displayWidth || e.width;
		}
		get resourceHeight() {
			let { resource: e } = this;
			return e.naturalHeight || e.videoHeight || e.displayHeight || e.height;
		}
		get resolution() {
			return this._resolution;
		}
		set resolution(e) {
			this._resolution !== e && (this._resolution = e, this.width = this.pixelWidth / e, this.height = this.pixelHeight / e);
		}
		resize(e, t, n) {
			n ||= this._resolution, e ||= this.width, t ||= this.height;
			let r = Math.round(e * n), i = Math.round(t * n);
			return this.width = r / n, this.height = i / n, this._resolution = n, this.pixelWidth === r && this.pixelHeight === i ? !1 : (this._refreshPOT(), this.pixelWidth = r, this.pixelHeight = i, this.emit("resize", this), this._resourceId = N("resource"), this.emit("change", this), !0);
		}
		updateMipmaps() {
			this.autoGenerateMipmaps && this.mipLevelCount > 1 && this.emit("updateMipmaps", this);
		}
		set wrapMode(e) {
			this._style.wrapMode = e;
		}
		get wrapMode() {
			return this._style.wrapMode;
		}
		set scaleMode(e) {
			this._style.scaleMode = e;
		}
		get scaleMode() {
			return this._style.scaleMode;
		}
		_refreshPOT() {
			this.isPowerOfTwo = dn(this.pixelWidth) && dn(this.pixelHeight);
		}
		static test(e) {
			throw Error("Unimplemented");
		}
	}, Sn.defaultOptions = {
		resolution: 1,
		format: "bgra8unorm",
		alphaMode: "premultiply-alpha-on-upload",
		arrayLayerCount: 1,
		mipLevelCount: 1,
		autoGenerateMipmaps: !1,
		sampleCount: 1,
		antialias: !1,
		autoGarbageCollect: !1
	}, Cn = Sn;
}));
// node_modules/pixi.js/lib/maths/matrix/groupD8.mjs
function Tn() {
	for (let e = 0; e < 16; e++) {
		let t = [];
		An.push(t);
		for (let n = 0; n < 16; n++) {
			let r = Mn(En[e] * En[n] + On[e] * Dn[n]), i = Mn(Dn[e] * En[n] + kn[e] * Dn[n]), a = Mn(En[e] * On[n] + On[e] * kn[n]), o = Mn(Dn[e] * On[n] + kn[e] * kn[n]);
			for (let e = 0; e < 16; e++) if (En[e] === r && Dn[e] === i && On[e] === a && kn[e] === o) {
				t.push(e);
				break;
			}
		}
	}
	for (let e = 0; e < 16; e++) {
		let t = new j();
		t.set(En[e], Dn[e], On[e], kn[e], 0, 0), jn.push(t);
	}
}
var En, Dn, On, kn, An, jn, Mn, z, Nn = o((() => {
	M(), En = [
		1,
		1,
		0,
		-1,
		-1,
		-1,
		0,
		1,
		1,
		1,
		0,
		-1,
		-1,
		-1,
		0,
		1
	], Dn = [
		0,
		1,
		1,
		1,
		0,
		-1,
		-1,
		-1,
		0,
		1,
		1,
		1,
		0,
		-1,
		-1,
		-1
	], On = [
		0,
		-1,
		-1,
		-1,
		0,
		1,
		1,
		1,
		0,
		1,
		1,
		1,
		0,
		-1,
		-1,
		-1
	], kn = [
		1,
		1,
		0,
		-1,
		-1,
		-1,
		0,
		1,
		-1,
		-1,
		0,
		1,
		1,
		1,
		0,
		-1
	], An = [], jn = [], Mn = Math.sign, Tn(), z = {
		E: 0,
		SE: 1,
		S: 2,
		SW: 3,
		W: 4,
		NW: 5,
		N: 6,
		NE: 7,
		MIRROR_VERTICAL: 8,
		MAIN_DIAGONAL: 10,
		MIRROR_HORIZONTAL: 12,
		REVERSE_DIAGONAL: 14,
		uX: (e) => En[e],
		uY: (e) => Dn[e],
		vX: (e) => On[e],
		vY: (e) => kn[e],
		inv: (e) => e & 8 ? e & 15 : -e & 7,
		add: (e, t) => An[e][t],
		sub: (e, t) => An[e][z.inv(t)],
		rotate180: (e) => e ^ 4,
		isVertical: (e) => (e & 3) == 2,
		byDirection: (e, t) => Math.abs(e) * 2 <= Math.abs(t) ? t >= 0 ? z.S : z.N : Math.abs(t) * 2 <= Math.abs(e) ? e > 0 ? z.E : z.W : t > 0 ? e > 0 ? z.SE : z.SW : e > 0 ? z.NE : z.NW,
		matrixAppendRotationInv: (e, t, n = 0, r = 0, i = 0, a = 0) => {
			let o = jn[z.inv(t)], s = o.a, c = o.b, l = o.c, u = o.d, d = n - Math.min(0, s * i, l * a, s * i + l * a), f = r - Math.min(0, c * i, u * a, c * i + u * a), p = e.a, m = e.b, h = e.c, g = e.d;
			e.a = s * p + c * h, e.b = s * m + c * g, e.c = l * p + u * h, e.d = l * m + u * g, e.tx = d * p + f * h + e.tx, e.ty = d * m + f * g + e.ty;
		},
		transformRectCoords: (e, t, n, r) => {
			let { x: i, y: a, width: o, height: s } = e, { x: c, y: l, width: u, height: d } = t;
			return n === z.E ? (r.set(i + c, a + l, o, s), r) : n === z.S ? r.set(u - a - s + c, i + l, s, o) : n === z.W ? r.set(u - i - o + c, d - a - s + l, o, s) : n === z.N ? r.set(a + c, d - i - o + l, s, o) : r.set(i + c, a + l, o, s);
		}
	};
})), Pn, Fn = o((() => {
	Pn = () => {};
}));
// node_modules/pixi.js/lib/rendering/renderers/shared/texture/utils/isIntegerFormat.mjs
function In(e) {
	return e.endsWith("int");
}
var Ln = o((() => {})), Rn, zn = o((() => {
	h(), Ln(), wn(), Rn = class extends Cn {
		constructor(e) {
			let t = e.depth ?? e.arrayLayerCount ?? 1, n = e.resource || new Float32Array(e.width * e.height * t * 4), r = e.format;
			r ||= n instanceof Float32Array ? "rgba32float" : n instanceof Int32Array || n instanceof Uint32Array ? "rgba32uint" : n instanceof Int16Array || n instanceof Uint16Array ? "rgba16uint" : (n instanceof Int8Array, "bgra8unorm");
			let i = In(r) || t > 1;
			super({
				...i && { alphaMode: "no-premultiply-alpha" },
				...e,
				resource: n,
				format: r
			}), this.uploadMethodId = "buffer", this._updateStart = 0, this._updateEnd = Infinity;
		}
		update(e = 0, t = Infinity) {
			if ((e > 0 || t < Infinity) && this.depthOrArrayLayers > 1) throw Error("[BufferImageSource] a 3D texture or 2D array uploads whole: call update() with no range.");
			this._updateStart = e, this._updateEnd = t, super.update(), this._updateStart = 0, this._updateEnd = Infinity;
		}
		static test(e) {
			return e instanceof Int8Array || e instanceof Uint8Array || e instanceof Uint8ClampedArray || e instanceof Int16Array || e instanceof Uint16Array || e instanceof Int32Array || e instanceof Uint32Array || e instanceof Float32Array;
		}
	}, Rn.extension = d.TextureSource;
})), Bn, Vn, Hn = o((() => {
	M(), Bn = new j(), Vn = class {
		constructor(e, t) {
			this.mapCoord = new j(), this.uClampFrame = /* @__PURE__ */ new Float32Array(4), this.uClampOffset = /* @__PURE__ */ new Float32Array(2), this._updateID = 0, this.clampOffset = 0, this.clampMargin = t === void 0 ? e.width < 10 ? 0 : .5 : t, this.isSimple = !1, this.texture = e;
		}
		get texture() {
			return this._texture;
		}
		set texture(e) {
			this._texture !== e && (this._texture?.removeListener("update", this.update, this), this._texture = e, this._texture.addListener("update", this.update, this)), this.update();
		}
		destroy() {
			this._texture?.removeListener("update", this.update, this), this._texture = null;
		}
		multiplyUvs(e, t) {
			t === void 0 && (t = e);
			let n = this.mapCoord;
			for (let r = 0; r < e.length; r += 2) {
				let i = e[r], a = e[r + 1];
				t[r] = i * n.a + a * n.c + n.tx, t[r + 1] = i * n.b + a * n.d + n.ty;
			}
			return t;
		}
		update() {
			let e = this._texture;
			this._updateID++;
			let t = e.uvs;
			this.mapCoord.set(t.x1 - t.x0, t.y1 - t.y0, t.x3 - t.x0, t.y3 - t.y0, t.x0, t.y0);
			let n = e.orig, r = e.trim;
			r && (Bn.set(n.width / r.width, 0, 0, n.height / r.height, -r.x / r.width, -r.y / r.height), this.mapCoord.append(Bn));
			let i = e.source, a = this.uClampFrame, o = this.clampMargin / i._resolution, s = this.clampOffset / i._resolution;
			return a[0] = (e.frame.x + o + s) / i.width, a[1] = (e.frame.y + o + s) / i.height, a[2] = (e.frame.x + e.frame.width - o + s) / i.width, a[3] = (e.frame.y + e.frame.height - o + s) / i.height, this.uClampOffset[0] = this.clampOffset / i.pixelWidth, this.uClampOffset[1] = this.clampOffset / i.pixelHeight, this.isSimple = e.frame.width === i.width && e.frame.height === i.height && e.rotate === 0, !0;
		}
	};
})), B, V = o((() => {
	y(), Nn(), wt(), We(), Xe(), Fn(), zn(), wn(), Hn(), B = class extends v {
		constructor({ source: e, label: t, frame: n, orig: r, trim: i, defaultAnchor: a, defaultBorders: o, rotate: s, dynamic: c } = {}) {
			if (super(), this.uid = N("texture"), this.uvs = {
				x0: 0,
				y0: 0,
				x1: 0,
				y1: 0,
				x2: 0,
				y2: 0,
				x3: 0,
				y3: 0
			}, this.frame = new R(), this.noFrame = !1, this.dynamic = !1, this.isTexture = !0, this.label = t, this.source = e?.source ?? new Cn(), this.noFrame = !n, n) this.frame.copyFrom(n);
			else {
				let { width: e, height: t } = this._source;
				this.frame.width = e, this.frame.height = t;
			}
			this.orig = r || this.frame, this.trim = i, this.rotate = s ?? 0, this.defaultAnchor = a, this.defaultBorders = o, this.destroyed = !1, this.dynamic = c || !1, this.updateUvs();
		}
		set source(e) {
			this._source && this._source.off("resize", this.update, this), this._source = e, e.on("resize", this.update, this), this.emit("update", this);
		}
		get source() {
			return this._source;
		}
		get textureMatrix() {
			return this._textureMatrix ||= new Vn(this), this._textureMatrix;
		}
		get width() {
			return this.orig.width;
		}
		get height() {
			return this.orig.height;
		}
		updateUvs() {
			let { uvs: e, frame: t } = this, { width: n, height: r } = this._source, i = t.x / n, a = t.y / r, o = t.width / n, s = t.height / r, c = this.rotate;
			if (c) {
				let t = o / 2, n = s / 2, r = i + t, l = a + n;
				c = z.add(c, z.NW), e.x0 = r + t * z.uX(c), e.y0 = l + n * z.uY(c), c = z.add(c, 2), e.x1 = r + t * z.uX(c), e.y1 = l + n * z.uY(c), c = z.add(c, 2), e.x2 = r + t * z.uX(c), e.y2 = l + n * z.uY(c), c = z.add(c, 2), e.x3 = r + t * z.uX(c), e.y3 = l + n * z.uY(c);
			} else e.x0 = i, e.y0 = a, e.x1 = i + o, e.y1 = a, e.x2 = i + o, e.y2 = a + s, e.x3 = i, e.y3 = a + s;
		}
		destroy(e = !1) {
			this._source && (this._source.off("resize", this.update, this), e && (this._source.destroy(), this._source = null)), this._textureMatrix = null, this.destroyed = !0, this.emit("destroy", this), this.removeAllListeners();
		}
		update() {
			this.noFrame && (this.frame.width = this._source.width, this.frame.height = this._source.height), this.updateUvs(), this.emit("update", this);
		}
		get baseTexture() {
			return F(P, "Texture.baseTexture is now Texture.source"), this._source;
		}
	}, B.EMPTY = new B({
		label: "EMPTY",
		source: new Cn({ label: "EMPTY" })
	}), B.EMPTY.destroy = Pn, B.WHITE = new B({
		source: new Rn({
			resource: new Uint8Array([
				255,
				255,
				255,
				255
			]),
			width: 1,
			height: 1,
			alphaMode: "premultiply-alpha-on-upload",
			label: "WHITE"
		}),
		label: "WHITE"
	}), B.WHITE.destroy = Pn;
}));
// node_modules/pixi.js/lib/rendering/renderers/shared/texture/utils/ScreenSizeRegistry.mjs
function Un(e) {
	return e.filter((t, n) => e.indexOf(t) === n).sort((e, t) => e - t);
}
var Wn, Gn = o((() => {
	Wn = class {
		constructor() {
			this._screenSizes = /* @__PURE__ */ new Map(), this._widths = [], this._heights = [], this._logicalWidths = [], this._logicalHeights = [];
		}
		get size() {
			return this._screenSizes.size;
		}
		set(e, t, n, r = 1) {
			let i = this._screenSizes.get(e);
			return i && i.pixelWidth === t && i.pixelHeight === n && i.resolution === r ? !1 : (this._screenSizes.set(e, {
				pixelWidth: t,
				pixelHeight: n,
				resolution: r
			}), this._update(), !0);
		}
		remove(e) {
			return this._screenSizes.delete(e) ? (this._update(), !0) : !1;
		}
		getFittingWidth(e, t = 1) {
			return this._getFittingAxis(e, t, this._widths, this._logicalWidths);
		}
		getFittingHeight(e, t = 1) {
			return this._getFittingAxis(e, t, this._heights, this._logicalHeights);
		}
		hasWidth(e) {
			return this._widths.includes(e);
		}
		hasHeight(e) {
			return this._heights.includes(e);
		}
		_getFittingAxis(e, t, n, r) {
			let i;
			for (let t = 0; t < n.length; t++) if (n[t] >= e) {
				i = n[t];
				break;
			}
			for (let n = 0; n < r.length; n++) {
				let a = Math.ceil(r[n] * t - 1e-6);
				if (a >= e) return i === void 0 ? a : Math.min(i, a);
			}
			return i;
		}
		_update() {
			let e = [...this._screenSizes.values()];
			this._widths = Un(e.map((e) => e.pixelWidth)), this._heights = Un(e.map((e) => e.pixelHeight)), this._logicalWidths = Un(e.map((e) => e.pixelWidth / e.resolution)), this._logicalHeights = Un(e.map((e) => e.pixelHeight / e.resolution));
		}
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/shared/texture/TexturePool.mjs
function Kn(e) {
	let t = Qn[e];
	return t === void 0 ? Qn[e] = $n++ : t;
}
function qn(e, t, n, r, i, a) {
	return (e << 17) + (t << 2) + (!!r << 1) + +!!n + +(a === "nearest") * Xn + Kn(i) * Zn;
}
var Jn, Yn, Xn, Zn, Qn, $n, er, tr, nr = o((() => {
	y(), fn(), Xe(), L(), et(), wn(), V(), yn(), Gn(), Jn = 0, Yn = 32767, Xn = 4294967296, Zn = 8589934592, Qn = /* @__PURE__ */ Object.create(null), $n = 0, er = class extends v {
		constructor(e) {
			super(), this._buckets = /* @__PURE__ */ new Map(), this._poolKey = /* @__PURE__ */ Object.create(null), this._poolStyle = /* @__PURE__ */ Object.create(null), this._screens = new Wn(), this._enableFullScreen = !1, this.textureOptions = e || {};
		}
		get textureStyle() {
			return F(qe, "TexturePool.textureStyle is no longer used, pooled textures carry their own style. Pass scaleMode in the request instead."), this._textureStyle ||= new vn(this.textureOptions), this._textureStyle;
		}
		set textureStyle(e) {
			F(qe, "TexturePool.textureStyle is no longer used, pooled textures carry their own style. Pass scaleMode in the request instead."), this._textureStyle = e;
		}
		get enableFullScreen() {
			return F(qe, "TexturePool.enableFullScreen is no longer used, the pool sizes textures to the screens registered with setScreenSize."), this._enableFullScreen;
		}
		set enableFullScreen(e) {
			F(qe, "TexturePool.enableFullScreen is no longer used, the pool sizes textures to the screens registered with setScreenSize."), this._enableFullScreen = e;
		}
		createTexture(...e) {
			let t = e[0];
			typeof t == "number" && (F(qe, "TexturePool.createTexture params are now an options object. See params: { width, height, antialias, autoGenerateMipmaps }"), t = {
				width: t,
				height: e[1],
				antialias: e[2] ?? !1,
				autoGenerateMipmaps: e[3] ?? !1
			});
			let n = t.format ?? this.textureOptions.format ?? Cn.defaultOptions.format, r = t.scaleMode ?? this.textureOptions.scaleMode ?? vn.defaultOptions.scaleMode, i = new Cn({
				...this.textureOptions,
				width: t.width,
				height: t.height,
				resolution: 1,
				antialias: t.antialias ?? !1,
				autoGarbageCollect: !1,
				autoGenerateMipmaps: t.autoGenerateMipmaps ?? !1,
				format: n,
				scaleMode: r
			});
			return new B({
				source: i,
				label: `texturePool_${Jn++}`
			});
		}
		getOptimalTexture(...e) {
			let t = e[0];
			typeof t == "number" && (F(qe, "TexturePool.getOptimalTexture params are now an options object. See params: { width, height, resolution, antialias, autoGenerateMipmaps }"), t = {
				width: t,
				height: e[1],
				resolution: e[2] ?? 1,
				antialias: e[3] ?? !1,
				autoGenerateMipmaps: e[4] ?? !1
			});
			let { width: n, height: r } = this.getOptimalSize(t.width, t.height, t.resolution ?? 1);
			return this._getTexture(n, r, t);
		}
		getAlignedTexture(e, t, n) {
			let r = e.source, i = t / r._resolution;
			return this._getTexture(Math.ceil(r.pixelWidth * i - 1e-6), Math.ceil(r.pixelHeight * i - 1e-6), {
				width: e.frame.width,
				height: e.frame.height,
				resolution: t,
				format: n
			});
		}
		_getTexture(e, t, n) {
			let r = n.width, i = n.height, a = n.resolution ?? 1, o = n.antialias ?? !1, s = n.autoGenerateMipmaps ?? !1, c = n.format ?? this.textureOptions.format ?? Cn.defaultOptions.format, l = n.scaleMode ?? this.textureOptions.scaleMode ?? vn.defaultOptions.scaleMode;
			(e > Yn || t > Yn) && I(`TexturePool: ${e}x${t} is larger than the ${Yn}px pool key limit, textures of this size may be pooled together`);
			let u = qn(e, t, o, s, c, l), d = this._buckets.get(u);
			d || (d = [], this._buckets.set(u, d));
			let f = d.pop();
			return f || (f = this.createTexture({
				width: e,
				height: t,
				antialias: o,
				autoGenerateMipmaps: s,
				format: c,
				scaleMode: l
			}), this._poolStyle[f.uid] = f.source.style), f.source._resolution = a, f.source.width = e / a, f.source.height = t / a, f.source.pixelWidth = e, f.source.pixelHeight = t, f.frame.x = 0, f.frame.y = 0, f.frame.width = r, f.frame.height = i, f.updateUvs(), this._poolKey[f.uid] = u, f;
		}
		getOptimalSize(e, t, n = 1) {
			let r = Math.ceil(e * n - 1e-6), i = Math.ceil(t * n - 1e-6), a = un(r), o = this._screens.getFittingWidth(r, n), s = un(i), c = this._screens.getFittingHeight(i, n);
			return {
				width: o === void 0 ? a : Math.min(o, a),
				height: c === void 0 ? s : Math.min(c, s)
			};
		}
		getSameSizeTexture(e, t = !1) {
			let n = e.source;
			return this.getOptimalTexture({
				width: e.width,
				height: e.height,
				resolution: n._resolution,
				antialias: t
			});
		}
		returnTexture(e, t = !1) {
			let n = e.uid, r = this._poolKey[n];
			if (r === void 0) {
				I("TexturePool: returnTexture was passed a texture that did not come from this pool, ignoring it");
				return;
			}
			let i = this._poolStyle[n];
			t && e.source.style !== i && (e.source.style = i);
			let a = this._buckets.get(r);
			a ? a.push(e) : this._dropTextures([e], !0);
		}
		setScreenSize(e, t, n, r = 1) {
			this._screens.set(e, t, n, r) && this._pruneScreenTextures();
		}
		removeScreen(e) {
			this._screens.remove(e) && this._pruneScreenTextures();
		}
		_pruneScreenTextures() {
			for (let [e, t] of this._buckets) {
				let n = e >>> 0, r = n >>> 17, i = n >>> 2 & 32767;
				(!dn(r) && !this._screens.hasWidth(r) || !dn(i) && !this._screens.hasHeight(i)) && (this._dropTextures(t, !0), this._buckets.delete(e));
			}
		}
		_dropTextures(e, t) {
			t && e.length > 0 && this.emit("evict");
			for (let n = 0; n < e.length; n++) {
				let r = e[n];
				delete this._poolKey[r.uid], delete this._poolStyle[r.uid], t && r.destroy(!0);
			}
		}
		clear(e) {
			for (let t of this._buckets.values()) this._dropTextures(t, e !== !1);
			this._buckets.clear();
		}
	}, tr = new er(), $e.register(tr);
})), rr, ir = o((() => {
	M(), ln(), nr(), rr = class {
		constructor() {
			this.renderPipeId = "renderGroup", this.root = null, this.canBundle = !1, this.renderGroupParent = null, this.renderGroupChildren = [], this.worldTransform = new j(), this.worldColorAlpha = 4294967295, this.worldColor = 16777215, this.worldAlpha = 1, this.childrenToUpdate = /* @__PURE__ */ Object.create(null), this.updateTick = 0, this.gcTick = 0, this.childrenRenderablesToUpdate = {
				list: [],
				index: 0
			}, this.structureDidChange = !0, this.instructionSet = new cn(), this._onRenderContainers = [], this.textureNeedsUpdate = !0, this.isCachedAsTexture = !1, this._matrixDirty = 7;
		}
		init(e) {
			this.root = e, e._onRender && this.addOnRender(e), e.didChange = !0;
			let t = e.children;
			for (let e = 0; e < t.length; e++) {
				let n = t[e];
				n._updateFlags = 15, this.addChild(n);
			}
		}
		enableCacheAsTexture(e = {}) {
			this.textureOptions = e, this.isCachedAsTexture = !0, this.textureNeedsUpdate = !0;
		}
		disableCacheAsTexture() {
			this.isCachedAsTexture = !1, this.texture &&= (tr.returnTexture(this.texture), null);
		}
		updateCacheTexture() {
			this.textureNeedsUpdate = !0;
			let e = this._parentCacheAsTextureRenderGroup;
			e && !e.textureNeedsUpdate && e.updateCacheTexture();
		}
		reset() {
			this.renderGroupChildren.length = 0;
			for (let e in this.childrenToUpdate) {
				let t = this.childrenToUpdate[e];
				t.list.fill(null), t.index = 0;
			}
			this.childrenRenderablesToUpdate.index = 0, this.childrenRenderablesToUpdate.list.fill(null), this.root = null, this.updateTick = 0, this.structureDidChange = !0, this._onRenderContainers.length = 0, this.renderGroupParent = null, this.disableCacheAsTexture();
		}
		get localTransform() {
			return this.root.localTransform;
		}
		addRenderGroupChild(e) {
			e.renderGroupParent && e.renderGroupParent._removeRenderGroupChild(e), e.renderGroupParent = this, this.renderGroupChildren.push(e);
		}
		_removeRenderGroupChild(e) {
			let t = this.renderGroupChildren.indexOf(e);
			t > -1 && this.renderGroupChildren.splice(t, 1), e.renderGroupParent = null;
		}
		addChild(e) {
			if (this.structureDidChange = !0, e.parentRenderGroup = this, e.updateTick = -1, e.relativeRenderGroupDepth = e.parent === this.root ? 1 : e.parent.relativeRenderGroupDepth + 1, e.didChange = !0, this.onChildUpdate(e), e.renderGroup) {
				this.addRenderGroupChild(e.renderGroup);
				return;
			}
			e._onRender && this.addOnRender(e);
			let t = e.children;
			for (let e = 0; e < t.length; e++) this.addChild(t[e]);
		}
		removeChild(e) {
			if (this.structureDidChange = !0, e._onRender && (e.renderGroup || this.removeOnRender(e)), e.parentRenderGroup = null, e.renderGroup) {
				this._removeRenderGroupChild(e.renderGroup);
				return;
			}
			let t = e.children;
			for (let e = 0; e < t.length; e++) this.removeChild(t[e]);
		}
		removeChildren(e) {
			for (let t = 0; t < e.length; t++) this.removeChild(e[t]);
		}
		onChildUpdate(e) {
			let t = this.childrenToUpdate[e.relativeRenderGroupDepth];
			t ||= this.childrenToUpdate[e.relativeRenderGroupDepth] = {
				index: 0,
				list: []
			}, t.list[t.index++] = e;
		}
		updateRenderable(e) {
			e.globalDisplayStatus < 7 || (this.instructionSet.renderPipes[e.renderPipeId].updateRenderable(e), e.didViewUpdate = !1);
		}
		onChildViewUpdate(e) {
			this.childrenRenderablesToUpdate.list[this.childrenRenderablesToUpdate.index++] = e;
		}
		get isRenderable() {
			return this.root.localDisplayStatus === 7 && this.worldAlpha > 0;
		}
		addOnRender(e) {
			this._onRenderContainers.indexOf(e) === -1 && this._onRenderContainers.push(e);
		}
		removeOnRender(e) {
			let t = this._onRenderContainers.indexOf(e);
			t !== -1 && this._onRenderContainers.splice(t, 1);
		}
		runOnRender(e) {
			for (let t = 0; t < this._onRenderContainers.length; t++) this._onRenderContainers[t]._onRender(e);
		}
		destroy() {
			this.disableCacheAsTexture(), this.renderGroupParent = null, this.root = null, this.childrenRenderablesToUpdate = null, this.childrenToUpdate = null, this.renderGroupChildren = null, this._onRenderContainers = null, this.instructionSet?.destroy(), this.instructionSet = null;
		}
		getChildren(e = []) {
			let t = this.root.children;
			for (let n = 0; n < t.length; n++) this._getChildren(t[n], e);
			return e;
		}
		_getChildren(e, t = []) {
			if (t.push(e), e.renderGroup) return t;
			let n = e.children;
			for (let e = 0; e < n.length; e++) this._getChildren(n[e], t);
			return t;
		}
		invalidateMatrices() {
			this._matrixDirty = 7;
		}
		get inverseWorldTransform() {
			return this._matrixDirty & 1 ? (this._matrixDirty &= -2, this._inverseWorldTransform ||= new j(), this._inverseWorldTransform.copyFrom(this.worldTransform).invert()) : this._inverseWorldTransform;
		}
		get textureOffsetInverseTransform() {
			return this._matrixDirty & 2 ? (this._matrixDirty &= -3, this._textureOffsetInverseTransform ||= new j(), this._textureOffsetInverseTransform.copyFrom(this.inverseWorldTransform).translate(-this._textureBounds.x, -this._textureBounds.y)) : this._textureOffsetInverseTransform;
		}
		get inverseParentTextureTransform() {
			if (!(this._matrixDirty & 4)) return this._inverseParentTextureTransform;
			this._matrixDirty &= -5;
			let e = this._parentCacheAsTextureRenderGroup;
			return e ? (this._inverseParentTextureTransform ||= new j(), this._inverseParentTextureTransform.copyFrom(this.worldTransform).prepend(e.inverseWorldTransform).translate(-e._textureBounds.x, -e._textureBounds.y)) : this.worldTransform;
		}
		get cacheToLocalTransform() {
			return this.isCachedAsTexture ? this.textureOffsetInverseTransform : this._parentCacheAsTextureRenderGroup ? this._parentCacheAsTextureRenderGroup.textureOffsetInverseTransform : null;
		}
	};
}));
// node_modules/pixi.js/lib/scene/container/utils/assignWithIgnore.mjs
function ar(e, t, n = {}) {
	for (let r in t) !n[r] && t[r] !== void 0 && (e[r] = t[r]);
}
var or = o((() => {})), sr, cr, lr, ur, H, dr = o((() => {
	y(), ke(), je(), h(), M(), Fe(), He(), We(), Xe(), L(), at(), st(), dt(), pt(), bt(), St(), Nt(), Gt(), $t(), tn(), an(), sn(), ir(), or(), sr = new Ve(null), cr = new Ve(null), lr = new Ve(null, 1, 1), ur = new Ve(null), H = class e extends v {
		constructor(e = {}) {
			super(), this.uid = N("renderable"), this._updateFlags = 15, this.renderGroup = null, this.parentRenderGroup = null, this.parentRenderGroupIndex = 0, this.didChange = !1, this.didViewUpdate = !1, this.relativeRenderGroupDepth = 0, this.children = [], this.parent = null, this.includeInBuild = !0, this.measurable = !0, this.isSimple = !0, this.parentRenderLayer = null, this.updateTick = -1, this.localTransform = new j(), this.relativeGroupTransform = new j(), this.groupTransform = this.relativeGroupTransform, this.destroyed = !1, this._position = new Ve(this, 0, 0), this._scale = lr, this._pivot = cr, this._origin = ur, this._skew = sr, this._cx = 1, this._sx = 0, this._cy = 0, this._sy = 1, this._rotation = 0, this.localColor = 16777215, this.localAlpha = 1, this.groupAlpha = 1, this.groupColor = 16777215, this.groupColorAlpha = 4294967295, this.localBlendMode = "inherit", this.groupBlendMode = "normal", this.localDisplayStatus = 7, this.globalDisplayStatus = 7, this._didContainerChangeTick = 0, this._didViewChangeTick = 0, this._didLocalTransformChangeId = -1, this.effects = [], ar(this, e, {
				children: !0,
				parent: !0,
				effects: !0
			}), e.children?.forEach((e) => this.addChild(e)), e.parent?.addChild(this);
		}
		static mixin(t) {
			F("8.8.0", "Container.mixin is deprecated, please use extensions.mixin instead."), m.mixin(e, t);
		}
		set _didChangeId(e) {
			this._didViewChangeTick = e >> 12 & 4095, this._didContainerChangeTick = e & 4095;
		}
		get _didChangeId() {
			return this._didContainerChangeTick & 4095 | (this._didViewChangeTick & 4095) << 12;
		}
		addChild(...e) {
			if (this.allowChildren || F(P, "addChild: Only Containers will be allowed to add children in v8.0.0"), e.length > 1) {
				for (let t = 0; t < e.length; t++) this.addChild(e[t]);
				return e[0];
			}
			let t = e[0], n = this.renderGroup || this.parentRenderGroup;
			return t.parent === this ? (this.children.splice(this.children.indexOf(t), 1), this.children.push(t), n && (n.structureDidChange = !0), t) : (t.parent && t.parent.removeChild(t), this.children.push(t), this.sortableChildren && (this.sortDirty = !0), t.parent = this, t.didChange = !0, t._updateFlags = 15, n && n.addChild(t), this.emit("childAdded", t, this, this.children.length - 1), t.emit("added", this), this._didViewChangeTick++, t._zIndex !== 0 && t.depthOfChildModified(), t);
		}
		removeChild(...e) {
			if (e.length > 1) {
				for (let t = 0; t < e.length; t++) this.removeChild(e[t]);
				return e[0];
			}
			let t = e[0], n = this.children.indexOf(t);
			return n > -1 && (this._didViewChangeTick++, this.children.splice(n, 1), this.renderGroup ? this.renderGroup.removeChild(t) : this.parentRenderGroup && this.parentRenderGroup.removeChild(t), t.parentRenderLayer && t.parentRenderLayer.detach(t), t.parent = null, this.emit("childRemoved", t, this, n), t.emit("removed", this)), t;
		}
		_onUpdate(e) {
			e && e === this._skew && this._updateSkew(), this._didContainerChangeTick++, this.didChange || (this.didChange = !0, this.parentRenderGroup && this.parentRenderGroup.onChildUpdate(this));
		}
		set isRenderGroup(e) {
			!!this.renderGroup !== e && (e ? this.enableRenderGroup() : this.disableRenderGroup());
		}
		get isRenderGroup() {
			return !!this.renderGroup;
		}
		enableRenderGroup() {
			if (this.renderGroup) return;
			let e = this.parentRenderGroup;
			e?.removeChild(this), this.renderGroup = it.get(rr, this), this.groupTransform = j.IDENTITY, e?.addChild(this), this._updateIsSimple();
		}
		disableRenderGroup() {
			if (!this.renderGroup) return;
			let e = this.parentRenderGroup;
			e?.removeChild(this), it.return(this.renderGroup), this.renderGroup = null, this.groupTransform = this.relativeGroupTransform, e?.addChild(this), this._updateIsSimple();
		}
		_updateIsSimple() {
			this.isSimple = !this.renderGroup && this.effects.length === 0;
		}
		get worldTransform() {
			return this._worldTransform ||= new j(), this.renderGroup ? this._worldTransform.copyFrom(this.renderGroup.worldTransform) : this.parentRenderGroup && this._worldTransform.appendFrom(this.relativeGroupTransform, this.parentRenderGroup.worldTransform), this._worldTransform;
		}
		get x() {
			return this._position.x;
		}
		set x(e) {
			this._position.x = e;
		}
		get y() {
			return this._position.y;
		}
		set y(e) {
			this._position.y = e;
		}
		get position() {
			return this._position;
		}
		set position(e) {
			this._position.copyFrom(e);
		}
		get rotation() {
			return this._rotation;
		}
		set rotation(e) {
			this._rotation !== e && (this._rotation = e, this._onUpdate(this._skew));
		}
		get angle() {
			return this.rotation * Ne;
		}
		set angle(e) {
			this.rotation = e * Pe;
		}
		get pivot() {
			return this._pivot === cr && (this._pivot = new Ve(this, 0, 0)), this._pivot;
		}
		set pivot(e) {
			this._pivot === cr && (this._pivot = new Ve(this, 0, 0), this._origin !== ur && I("Setting both a pivot and origin on a Container is not recommended. This can lead to unexpected behavior if not handled carefully.")), typeof e == "number" ? this._pivot.set(e) : this._pivot.copyFrom(e);
		}
		get skew() {
			return this._skew === sr && (this._skew = new Ve(this, 0, 0)), this._skew;
		}
		set skew(e) {
			this._skew === sr && (this._skew = new Ve(this, 0, 0)), this._skew.copyFrom(e);
		}
		get scale() {
			return this._scale === lr && (this._scale = new Ve(this, 1, 1)), this._scale;
		}
		set scale(e) {
			this._scale === lr && (this._scale = new Ve(this, 0, 0)), typeof e == "string" && (e = parseFloat(e)), typeof e == "number" ? this._scale.set(e) : this._scale.copyFrom(e);
		}
		get origin() {
			return this._origin === ur && (this._origin = new Ve(this, 0, 0)), this._origin;
		}
		set origin(e) {
			this._origin === ur && (this._origin = new Ve(this, 0, 0), this._pivot !== cr && I("Setting both a pivot and origin on a Container is not recommended. This can lead to unexpected behavior if not handled carefully.")), typeof e == "number" ? this._origin.set(e) : this._origin.copyFrom(e);
		}
		get width() {
			return Math.abs(this.scale.x * this.getLocalBounds().width);
		}
		set width(e) {
			let t = this.getLocalBounds().width;
			this._setWidth(e, t);
		}
		get height() {
			return Math.abs(this.scale.y * this.getLocalBounds().height);
		}
		set height(e) {
			let t = this.getLocalBounds().height;
			this._setHeight(e, t);
		}
		getSize(e) {
			e ||= {};
			let t = this.getLocalBounds();
			return e.width = Math.abs(this.scale.x * t.width), e.height = Math.abs(this.scale.y * t.height), e;
		}
		setSize(e, t) {
			let n = this.getLocalBounds();
			typeof e == "object" ? (t = e.height ?? e.width, e = e.width) : t ??= e, e !== void 0 && this._setWidth(e, n.width), t !== void 0 && this._setHeight(t, n.height);
		}
		_updateSkew() {
			let e = this._rotation, t = this._skew;
			this._cx = Math.cos(e + t._y), this._sx = Math.sin(e + t._y), this._cy = -Math.sin(e - t._x), this._sy = Math.cos(e - t._x);
		}
		updateTransform(e) {
			return this.position.set(typeof e.x == "number" ? e.x : this.position.x, typeof e.y == "number" ? e.y : this.position.y), this.scale.set(typeof e.scaleX == "number" ? e.scaleX : this.scale.x, typeof e.scaleY == "number" ? e.scaleY : this.scale.y), this.rotation = typeof e.rotation == "number" ? e.rotation : this.rotation, this.skew.set(typeof e.skewX == "number" ? e.skewX : this.skew.x, typeof e.skewY == "number" ? e.skewY : this.skew.y), this.pivot.set(typeof e.pivotX == "number" ? e.pivotX : this.pivot.x, typeof e.pivotY == "number" ? e.pivotY : this.pivot.y), this.origin.set(typeof e.originX == "number" ? e.originX : this.origin.x, typeof e.originY == "number" ? e.originY : this.origin.y), this;
		}
		setFromMatrix(e) {
			e.decompose(this);
		}
		updateLocalTransform() {
			let e = this._didContainerChangeTick;
			if (this._didLocalTransformChangeId === e) return;
			this._didLocalTransformChangeId = e;
			let t = this.localTransform, n = this._scale, r = this._pivot, i = this._origin, a = this._position, o = n._x, s = n._y, c = r._x, l = r._y, u = -i._x, d = -i._y;
			t.a = this._cx * o, t.b = this._sx * o, t.c = this._cy * s, t.d = this._sy * s, t.tx = a._x - (c * t.a + l * t.c) + (u * t.a + d * t.c) - u, t.ty = a._y - (c * t.b + l * t.d) + (u * t.b + d * t.d) - d;
		}
		set alpha(e) {
			e !== this.localAlpha && (this.localAlpha = e, this._updateFlags |= 1, this._onUpdate());
		}
		get alpha() {
			return this.localAlpha;
		}
		set tint(e) {
			let t = typeof e == "number" ? Ut(e) : A.shared.setValue(e ?? 16777215).toBgrNumber();
			t !== this.localColor && (this.localColor = t, this._updateFlags |= 1, this._onUpdate());
		}
		get tint() {
			return Ut(this.localColor);
		}
		set blendMode(e) {
			this.localBlendMode !== e && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= 2, this.localBlendMode = e, this._onUpdate());
		}
		get blendMode() {
			return this.localBlendMode;
		}
		get visible() {
			return !!(this.localDisplayStatus & 2);
		}
		set visible(e) {
			let t = e ? 2 : 0;
			(this.localDisplayStatus & 2) !== t && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= 4, this.localDisplayStatus ^= 2, this._onUpdate(), this.emit("visibleChanged", e));
		}
		get culled() {
			return !(this.localDisplayStatus & 4);
		}
		set culled(e) {
			let t = e ? 0 : 4;
			(this.localDisplayStatus & 4) !== t && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= 4, this.localDisplayStatus ^= 4, this._onUpdate());
		}
		get renderable() {
			return !!(this.localDisplayStatus & 1);
		}
		set renderable(e) {
			let t = +!!e;
			(this.localDisplayStatus & 1) !== t && (this._updateFlags |= 4, this.localDisplayStatus ^= 1, this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._onUpdate());
		}
		get isRenderable() {
			return this.localDisplayStatus === 7 && this.groupAlpha > 0;
		}
		destroy(e = !1) {
			if (this.destroyed) return;
			this.destroyed = !0;
			let t;
			if (this.children.length && (t = this.removeChildren(0, this.children.length)), this.removeFromParent(), this.parent = null, this._maskEffect = null, this._filterEffect = null, this.effects = null, this._position = null, this._scale = null, this._pivot = null, this._origin = null, this._skew = null, this.emit("destroyed", this), this.removeAllListeners(), (typeof e == "boolean" ? e : e?.children) && t) for (let n = 0; n < t.length; ++n) t[n].destroy(e);
			this.renderGroup?.destroy(), this.renderGroup = null;
		}
	}, m.mixin(H, ut, Mt, on, en, Qt, yt, xt, rn, Ae, ot, Wt, ft);
})), fr, pr = o((() => {
	fr = /* @__PURE__ */ ((e) => (e[e.INTERACTION = 50] = "INTERACTION", e[e.HIGH = 25] = "HIGH", e[e.NORMAL = 0] = "NORMAL", e[e.LOW = -25] = "LOW", e[e.UTILITY = -50] = "UTILITY", e))(fr || {});
})), mr, hr = o((() => {
	mr = class {
		constructor(e, t = null, n = 0, r = !1) {
			this.next = null, this.previous = null, this._destroyed = !1, this._fn = e, this._context = t, this.priority = n, this._once = r;
		}
		match(e, t = null) {
			return this._fn === e && this._context === t;
		}
		emit(e) {
			this._fn && (this._context ? this._fn.call(this._context, e) : this._fn(e));
			let t = this.next;
			return this._once && this.destroy(!0), this._destroyed && (this.next = null), t;
		}
		connect(e) {
			this.previous = e, e.next && (e.next.previous = this), this.next = e.next, e.next = this;
		}
		destroy(e = !1) {
			this._destroyed = !0, this._fn = null, this._context = null, this.previous && (this.previous.next = this.next), this.next && (this.next.previous = this.previous);
			let t = this.next;
			return this.next = e ? null : t, this.previous = null, t;
		}
	};
})), gr, _r, vr = o((() => {
	pr(), hr(), gr = class e {
		constructor() {
			this.autoStart = !1, this.deltaTime = 1, this.lastTime = -1, this.speed = 1, this.started = !1, this._requestId = null, this._maxElapsedMS = 100, this._minElapsedMS = 0, this._protected = !1, this._lastFrame = -1, this._head = new mr(null, null, Infinity), this.deltaMS = 1 / e.targetFPMS, this.elapsedMS = 1 / e.targetFPMS, this._tick = (e) => {
				this._requestId = null, this.started && (this.update(e), this.started && this._requestId === null && this._head.next && (this._requestId = requestAnimationFrame(this._tick)));
			};
		}
		_requestIfNeeded() {
			this._requestId === null && this._head.next && (this.lastTime = performance.now(), this._lastFrame = this.lastTime, this._requestId = requestAnimationFrame(this._tick));
		}
		_cancelIfNeeded() {
			this._requestId !== null && (cancelAnimationFrame(this._requestId), this._requestId = null);
		}
		_startIfPossible() {
			this.started ? this._requestIfNeeded() : this.autoStart && this.start();
		}
		add(e, t, n = fr.NORMAL) {
			return this._addListener(new mr(e, t, n));
		}
		addOnce(e, t, n = fr.NORMAL) {
			return this._addListener(new mr(e, t, n, !0));
		}
		_addListener(e) {
			let t = this._head.next, n = this._head;
			if (!t) e.connect(n);
			else {
				for (; t;) {
					if (e.priority > t.priority) {
						e.connect(n);
						break;
					}
					n = t, t = t.next;
				}
				e.previous || e.connect(n);
			}
			return this._startIfPossible(), this;
		}
		remove(e, t) {
			let n = this._head.next;
			for (; n;) n = n.match(e, t) ? n.destroy() : n.next;
			return this._head.next || this._cancelIfNeeded(), this;
		}
		get count() {
			if (!this._head) return 0;
			let e = 0, t = this._head;
			for (; t = t.next;) e++;
			return e;
		}
		start() {
			this.started || (this.started = !0, this._requestIfNeeded());
		}
		stop() {
			this.started && (this.started = !1, this._cancelIfNeeded());
		}
		destroy() {
			if (!this._protected) {
				this.stop();
				let e = this._head.next;
				for (; e;) e = e.destroy(!0);
				this._head.destroy(), this._head = null;
			}
		}
		update(t = performance.now()) {
			let n;
			if (t > this.lastTime) {
				if (n = this.elapsedMS = t - this.lastTime, n > this._maxElapsedMS && (n = this._maxElapsedMS), n *= this.speed, this._minElapsedMS) {
					let e = t - this._lastFrame | 0;
					if (e < this._minElapsedMS) return;
					this._lastFrame = t - e % this._minElapsedMS;
				}
				this.deltaMS = n, this.deltaTime = this.deltaMS * e.targetFPMS;
				let r = this._head, i = r.next;
				for (; i;) i = i.emit(this);
				r.next || this._cancelIfNeeded();
			} else this.deltaTime = this.deltaMS = this.elapsedMS = 0;
			this.lastTime = t;
		}
		get FPS() {
			return 1e3 / this.elapsedMS;
		}
		get minFPS() {
			return 1e3 / this._maxElapsedMS;
		}
		set minFPS(t) {
			let n = Math.min(Math.max(0, t) / 1e3, e.targetFPMS);
			this._maxElapsedMS = 1 / n, this._minElapsedMS && t > this.maxFPS && (this.maxFPS = t);
		}
		get maxFPS() {
			return this._minElapsedMS ? Math.round(1e3 / this._minElapsedMS) : 0;
		}
		set maxFPS(e) {
			e === 0 ? this._minElapsedMS = 0 : (e < this.minFPS && (this.minFPS = e), this._minElapsedMS = 1 / (e / 1e3));
		}
		static get shared() {
			if (!e._shared) {
				let t = e._shared = new e();
				t.autoStart = !0, t._protected = !0;
			}
			return e._shared;
		}
		static get system() {
			if (!e._system) {
				let t = e._system = new e();
				t.autoStart = !0, t._protected = !0;
			}
			return e._system;
		}
	}, gr.targetFPMS = .06, _r = gr;
})), yr, br = o((() => {
	pr(), vr(), yr = class {
		constructor(e) {
			this._lastTransform = "", this._observer = null, this._tickerAttached = !1, this.updateTranslation = () => {
				if (!this._canvas) return;
				let e = this._canvas.getBoundingClientRect(), t = this._canvas.width, n = this._canvas.height, r = e.width / t * this._renderer.resolution, i = e.height / n * this._renderer.resolution, a = `translate(${e.left}px, ${e.top}px) scale(${r}, ${i})`;
				a !== this._lastTransform && (this._domElement.style.transform = a, this._lastTransform = a);
			}, this._domElement = e.domElement, this._renderer = e.renderer, globalThis.OffscreenCanvas && this._renderer.canvas instanceof OffscreenCanvas || (this._canvas = this._renderer.canvas, this._attachObserver());
		}
		get canvas() {
			return this._canvas;
		}
		ensureAttached() {
			!this._domElement.parentNode && this._canvas.parentNode && (this._canvas.parentNode.appendChild(this._domElement), this.updateTranslation());
		}
		_attachObserver() {
			"ResizeObserver" in globalThis ? (this._observer &&= (this._observer.disconnect(), null), this._observer = new ResizeObserver((e) => {
				for (let t of e) {
					if (t.target !== this._canvas) continue;
					let e = this.canvas.width, n = this.canvas.height, r = t.contentRect.width / e * this._renderer.resolution, i = t.contentRect.height / n * this._renderer.resolution;
					(this._lastScaleX !== r || this._lastScaleY !== i) && (this.updateTranslation(), this._lastScaleX = r, this._lastScaleY = i);
				}
			}), this._observer.observe(this._canvas)) : this._tickerAttached ||= (_r.shared.add(this.updateTranslation, this, fr.HIGH), !0);
		}
		destroy() {
			this._observer ? (this._observer.disconnect(), this._observer = null) : this._tickerAttached && _r.shared.remove(this.updateTranslation, this), this._domElement = null, this._renderer = null, this._canvas = null, this._tickerAttached = !1, this._lastTransform = "", this._lastScaleX = null, this._lastScaleY = null;
		}
	};
})), xr, Sr = o((() => {
	Re(), xr = class e {
		constructor(t) {
			this.bubbles = !0, this.cancelBubble = !0, this.cancelable = !1, this.composed = !1, this.defaultPrevented = !1, this.eventPhase = e.prototype.NONE, this.propagationStopped = !1, this.propagationImmediatelyStopped = !1, this.layer = new Ie(), this.page = new Ie(), this.NONE = 0, this.CAPTURING_PHASE = 1, this.AT_TARGET = 2, this.BUBBLING_PHASE = 3, this.manager = t;
		}
		get layerX() {
			return this.layer.x;
		}
		get layerY() {
			return this.layer.y;
		}
		get pageX() {
			return this.page.x;
		}
		get pageY() {
			return this.page.y;
		}
		get data() {
			return this;
		}
		composedPath() {
			return this.manager && (!this.path || this.path[this.path.length - 1] !== this.target) && (this.path = this.target ? this.manager.propagationPath(this.target) : []), this.path;
		}
		initEvent(e, t, n) {
			throw Error("initEvent() is a legacy DOM API. It is not implemented in the Federated Events API.");
		}
		initUIEvent(e, t, n, r, i) {
			throw Error("initUIEvent() is a legacy DOM API. It is not implemented in the Federated Events API.");
		}
		preventDefault() {
			this.nativeEvent instanceof Event && this.nativeEvent.cancelable && this.nativeEvent.preventDefault(), this.defaultPrevented = !0;
		}
		stopImmediatePropagation() {
			this.propagationImmediatelyStopped = !0;
		}
		stopPropagation() {
			this.propagationStopped = !0;
		}
	};
}));
// node_modules/ismobilejs/esm/isMobile.js
function Cr(e) {
	return function(t) {
		return t.test(e);
	};
}
function wr(e) {
	var t = {
		userAgent: "",
		platform: "",
		maxTouchPoints: 0
	};
	!e && typeof navigator < "u" ? t = {
		userAgent: navigator.userAgent,
		platform: navigator.platform,
		maxTouchPoints: navigator.maxTouchPoints || 0
	} : typeof e == "string" ? t.userAgent = e : e && e.userAgent && (t = {
		userAgent: e.userAgent,
		platform: e.platform,
		maxTouchPoints: e.maxTouchPoints || 0
	});
	var n = t.userAgent, r = n.split("[FBAN");
	r[1] !== void 0 && (n = r[0]), r = n.split("Twitter"), r[1] !== void 0 && (n = r[0]);
	var i = Cr(n), a = {
		apple: {
			phone: i(Tr) && !i(Nr),
			ipod: i(Er),
			tablet: !i(Tr) && (i(Dr) || Br(t)) && !i(Nr),
			universal: i(Or),
			device: (i(Tr) || i(Er) || i(Dr) || i(Or) || Br(t)) && !i(Nr)
		},
		amazon: {
			phone: i(jr),
			tablet: !i(jr) && i(Mr),
			device: i(jr) || i(Mr)
		},
		android: {
			phone: !i(Nr) && i(jr) || !i(Nr) && i(kr),
			tablet: !i(Nr) && !i(jr) && !i(kr) && (i(Mr) || i(Ar)),
			device: !i(Nr) && (i(jr) || i(Mr) || i(kr) || i(Ar)) || i(/\bokhttp\b/i)
		},
		windows: {
			phone: i(Nr),
			tablet: i(Pr),
			device: i(Nr) || i(Pr)
		},
		other: {
			blackberry: i(Fr),
			blackberry10: i(Ir),
			opera: i(Lr),
			firefox: i(zr),
			chrome: i(Rr),
			device: i(Fr) || i(Ir) || i(Lr) || i(zr) || i(Rr)
		},
		any: !1,
		phone: !1,
		tablet: !1
	};
	return a.any = a.apple.device || a.android.device || a.windows.device || a.other.device, a.phone = a.apple.phone || a.android.phone || a.windows.phone, a.tablet = a.apple.tablet || a.android.tablet || a.windows.tablet, a;
}
var Tr, Er, Dr, Or, kr, Ar, jr, Mr, Nr, Pr, Fr, Ir, Lr, Rr, zr, Br, Vr = o((() => {
	Tr = /iPhone/i, Er = /iPod/i, Dr = /iPad/i, Or = /\biOS-universal(?:.+)Mac\b/i, kr = /\bAndroid(?:.+)Mobile\b/i, Ar = /Android/i, jr = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i, Mr = /Silk/i, Nr = /Windows Phone/i, Pr = /\bWindows(?:.+)ARM\b/i, Fr = /BlackBerry/i, Ir = /BB10/i, Lr = /Opera Mini/i, Rr = /\b(CriOS|Chrome)(?:.+)Mobile/i, zr = /Mobile(?:.+)Firefox\b/i, Br = function(e) {
		return e !== void 0 && e.platform === "MacIntel" && typeof e.maxTouchPoints == "number" && e.maxTouchPoints > 1 && typeof MSStream > "u";
	};
})), Hr = o((() => {
	Vr(), Vr();
})), Ur, Wr = o((() => {
	Hr(), Ur = (wr.default ?? wr)(globalThis.navigator);
})), Gr, Kr, qr, Jr, Yr, Xr, Zr, Qr, $r, ei, ti, ni = o((() => {
	br(), Sr(), h(), Wr(), lt(), Gr = 9, Kr = 100, qr = 0, Jr = 0, Yr = 2, Xr = 1, Zr = -1e3, Qr = -1e3, $r = 2, ei = class e {
		constructor(e, t = Ur) {
			this._mobileInfo = t, this.debug = !1, this._activateOnTab = !0, this._deactivateOnMouseMove = !0, this._isActive = !1, this._isMobileAccessibility = !1, this._div = null, this._pools = {}, this._renderId = 0, this._children = [], this._androidUpdateCount = 0, this._androidUpdateFrequency = 500, this._isRunningTests = !1, this._boundOnKeyDown = this._onKeyDown.bind(this), this._boundOnMouseMove = this._onMouseMove.bind(this), this._hookDiv = null, (t.tablet || t.phone) && this._createTouchHook(), this._renderer = e;
		}
		get isActive() {
			return this._isActive;
		}
		get isMobileAccessibility() {
			return this._isMobileAccessibility;
		}
		get hookDiv() {
			return this._hookDiv;
		}
		get div() {
			return this._div;
		}
		_createTouchHook() {
			let e = document.createElement("button");
			e.style.width = `${Xr}px`, e.style.height = `${Xr}px`, e.style.position = "absolute", e.style.top = `${Zr}px`, e.style.left = `${Qr}px`, e.style.zIndex = $r.toString(), e.style.backgroundColor = "#FF0000", e.title = "select to enable accessibility for this content", e.addEventListener("focus", () => {
				this._isMobileAccessibility = !0, this._activate(), this._destroyTouchHook();
			}), document.body.appendChild(e), this._hookDiv = e;
		}
		_destroyTouchHook() {
			this._hookDiv &&= (document.body.removeChild(this._hookDiv), null);
		}
		_activate() {
			if (this._isActive) return;
			this._isActive = !0, this._div || (this._div = document.createElement("div"), this._div.style.position = "absolute", this._div.style.top = `${qr}px`, this._div.style.left = `${Jr}px`, this._div.style.pointerEvents = "none", this._div.style.zIndex = Yr.toString(), this._canvasObserver = new yr({
				domElement: this._div,
				renderer: this._renderer
			})), this._deactivateOnMouseMove && globalThis.document.addEventListener("mousemove", this._boundOnMouseMove, !0);
			let e = this._renderer.view.canvas;
			if (e.parentNode) this._canvasObserver.ensureAttached(), this._initAccessibilitySetup();
			else {
				let t = new MutationObserver(() => {
					e.parentNode && (t.disconnect(), this._canvasObserver.ensureAttached(), this._initAccessibilitySetup());
				});
				t.observe(document.body, {
					childList: !0,
					subtree: !0
				});
			}
		}
		_initAccessibilitySetup() {
			this._renderer.runners.postrender.add(this), this._renderer.lastObjectRendered && this._updateAccessibleObjects(this._renderer.lastObjectRendered);
		}
		_deactivate() {
			if (this._isActive && !this._isMobileAccessibility) {
				this._isActive = !1, globalThis.document.removeEventListener("mousemove", this._boundOnMouseMove, !0), this._renderer.runners.postrender.remove(this);
				for (let e of this._children) e._accessibleDiv?.parentNode && (e._accessibleDiv.parentNode.removeChild(e._accessibleDiv), e._accessibleDiv = null), e._accessibleActive = !1;
				for (let e in this._pools) this._pools[e].forEach((e) => {
					e.parentNode && e.parentNode.removeChild(e);
				}), delete this._pools[e];
				this._div?.parentNode && this._div.parentNode.removeChild(this._div), this._pools = {}, this._children = [];
			}
		}
		_updateAccessibleObjects(e) {
			if (!e.visible || !e.accessibleChildren) return;
			e.accessible && (e._accessibleActive || this._addChild(e), e._renderId = this._renderId);
			let t = e.children;
			if (t) for (let e = 0; e < t.length; e++) this._updateAccessibleObjects(t[e]);
		}
		init(t) {
			let n = { accessibilityOptions: {
				...e.defaultOptions,
				...t?.accessibilityOptions || {}
			} };
			this.debug = n.accessibilityOptions.debug, this._activateOnTab = n.accessibilityOptions.activateOnTab, this._deactivateOnMouseMove = n.accessibilityOptions.deactivateOnMouseMove, this._activateOnTab && globalThis.addEventListener("keydown", this._boundOnKeyDown, !1), n.accessibilityOptions.enabledByDefault && this._activate(), this._renderer.runners.postrender.remove(this);
		}
		postrender() {
			let e = performance.now();
			if (this._mobileInfo.android.device && e < this._androidUpdateCount || (this._androidUpdateCount = e + this._androidUpdateFrequency, (!this._renderer.renderingToScreen || !this._renderer.view.canvas) && !this._isRunningTests)) return;
			let t = /* @__PURE__ */ new Set();
			if (this._renderer.lastObjectRendered) {
				this._updateAccessibleObjects(this._renderer.lastObjectRendered);
				for (let e of this._children) e._renderId === this._renderId && t.add(this._children.indexOf(e));
			}
			for (let e = this._children.length - 1; e >= 0; e--) {
				let n = this._children[e];
				t.has(e) || (n._accessibleDiv && n._accessibleDiv.parentNode && (n._accessibleDiv.parentNode.removeChild(n._accessibleDiv), this._getPool(n.accessibleType).push(n._accessibleDiv), n._accessibleDiv = null), n._accessibleActive = !1, ct(this._children, e, 1));
			}
			this._renderer.renderingToScreen && this._canvasObserver.ensureAttached();
			for (let e = 0; e < this._children.length; e++) {
				let t = this._children[e];
				if (!t._accessibleActive || !t._accessibleDiv) continue;
				let n = t._accessibleDiv, r = t.hitArea || t.getBounds().rectangle;
				if (t.hitArea) {
					let e = t.worldTransform;
					n.style.left = `${e.tx + r.x * e.a}px`, n.style.top = `${e.ty + r.y * e.d}px`, n.style.width = `${r.width * e.a}px`, n.style.height = `${r.height * e.d}px`;
				} else this._capHitArea(r), n.style.left = `${r.x}px`, n.style.top = `${r.y}px`, n.style.width = `${r.width}px`, n.style.height = `${r.height}px`;
			}
			this._renderId++;
		}
		_updateDebugHTML(e) {
			e.innerHTML = `type: ${e.type}</br> title : ${e.title}</br> tabIndex: ${e.tabIndex}`;
		}
		_capHitArea(e) {
			e.x < 0 && (e.width += e.x, e.x = 0), e.y < 0 && (e.height += e.y, e.y = 0);
			let { width: t, height: n } = this._renderer;
			e.x + e.width > t && (e.width = t - e.x), e.y + e.height > n && (e.height = n - e.y);
		}
		_addChild(e) {
			let t = this._getPool(e.accessibleType).pop();
			t ? (t.innerHTML = "", t.removeAttribute("title"), t.removeAttribute("aria-label"), t.tabIndex = 0) : (e.accessibleType === "button" ? (t = document.createElement("button"), this.debug || (t.style.color = "transparent")) : (t = document.createElement(e.accessibleType), t.style.cssText = "\n                        color: transparent;\n                        pointer-events: none;\n                        padding: 0;\n                        margin: 0;\n                        border: 0;\n                        outline: 0;\n                        background: transparent;\n                        box-sizing: border-box;\n                        user-select: none;\n                        -webkit-user-select: none;\n                        -moz-user-select: none;\n                        -ms-user-select: none;\n                    "), t.style.width = `${Kr}px`, t.style.height = `${Kr}px`, t.style.backgroundColor = this.debug ? "rgba(255,255,255,0.5)" : "transparent", t.style.position = "absolute", t.style.zIndex = Yr.toString(), t.style.borderStyle = "none", navigator.userAgent.toLowerCase().includes("chrome") ? t.setAttribute("aria-live", "off") : t.setAttribute("aria-live", "polite"), navigator.userAgent.match(/rv:.*Gecko\//) ? t.setAttribute("aria-relevant", "additions") : t.setAttribute("aria-relevant", "text"), t.addEventListener("click", this._onClick.bind(this)), t.addEventListener("focus", this._onFocus.bind(this)), t.addEventListener("focusout", this._onFocusOut.bind(this))), t.style.pointerEvents = e.accessiblePointerEvents, t.type = e.accessibleType, e.accessibleText && (t.innerText = e.accessibleText), e.accessibleTitle && e.accessibleTitle !== null ? t.title = e.accessibleTitle : e.accessibleHint && e.accessibleHint !== null || (t.title = `container ${e.tabIndex}`), e.accessibleHint && e.accessibleHint !== null && t.setAttribute("aria-label", e.accessibleHint), e.interactive ? t.tabIndex = e.tabIndex : t.tabIndex = 0, this.debug && this._updateDebugHTML(t), e._accessibleActive = !0, e._accessibleDiv = t, t.container = e, this._children.push(e), this._div.appendChild(e._accessibleDiv);
		}
		_dispatchEvent(e, t) {
			let { container: n } = e.target, r = this._renderer.events.rootBoundary, i = Object.assign(new xr(r), { target: n });
			r.rootTarget = this._renderer.lastObjectRendered, t.forEach((e) => r.dispatchEvent(i, e));
		}
		_onClick(e) {
			this._dispatchEvent(e, [
				"click",
				"pointertap",
				"tap"
			]);
		}
		_onFocus(e) {
			e.target.getAttribute("aria-live") || e.target.setAttribute("aria-live", "assertive"), this._dispatchEvent(e, ["mouseover"]);
		}
		_onFocusOut(e) {
			e.target.getAttribute("aria-live") || e.target.setAttribute("aria-live", "polite"), this._dispatchEvent(e, ["mouseout"]);
		}
		_onKeyDown(e) {
			e.keyCode === Gr && this._activateOnTab && this._activate();
		}
		_onMouseMove(e) {
			(e.movementX !== 0 || e.movementY !== 0) && this._deactivate();
		}
		destroy() {
			this._deactivate(), this._destroyTouchHook(), this._canvasObserver?.destroy(), this._canvasObserver = null, this._div = null, this._pools = null, this._children = null, this._renderer = null, this._hookDiv = null, globalThis.removeEventListener("keydown", this._boundOnKeyDown), this._boundOnKeyDown = null, globalThis.document.removeEventListener("mousemove", this._boundOnMouseMove, !0), this._boundOnMouseMove = null;
		}
		setAccessibilityEnabled(e) {
			e ? this._activate() : this._deactivate();
		}
		_getPool(e) {
			return this._pools[e] || (this._pools[e] = []), this._pools[e];
		}
	}, ei.extension = {
		type: [d.WebGLSystem, d.WebGPUSystem],
		name: "accessibility"
	}, ei.defaultOptions = {
		enabledByDefault: !1,
		debug: !1,
		activateOnTab: !0,
		deactivateOnMouseMove: !0
	}, ti = ei;
})), ri, ii = o((() => {
	ri = {
		accessible: !1,
		accessibleTitle: null,
		accessibleHint: null,
		tabIndex: 0,
		accessibleType: "button",
		accessibleText: null,
		accessiblePointerEvents: "auto",
		accessibleChildren: !0,
		_accessibleActive: !1,
		_accessibleDiv: null,
		_renderId: -1
	};
})), ai = o((() => {
	h(), dr(), ni(), ii(), m.add(ti), m.mixin(H, ri);
})), oi, si = o((() => {
	h(), br(), oi = class {
		constructor(e) {
			this._attachedDomElements = [], this._renderer = e, this._renderer.runners.postrender.add(this), this._renderer.runners.init.add(this), this._domElement = document.createElement("div"), this._domElement.style.position = "absolute", this._domElement.style.top = "0", this._domElement.style.left = "0", this._domElement.style.pointerEvents = "none", this._domElement.style.zIndex = "1000";
		}
		init() {
			this._canvasObserver = new yr({
				domElement: this._domElement,
				renderer: this._renderer
			});
		}
		addRenderable(e, t) {
			this._attachedDomElements.includes(e) || this._attachedDomElements.push(e);
		}
		updateRenderable(e) {}
		validateRenderable(e) {
			return !0;
		}
		postrender() {
			let e = this._attachedDomElements;
			if (e.length === 0) this._domElement.remove();
			else {
				this._canvasObserver.ensureAttached();
				for (let t = 0; t < e.length; t++) {
					let n = e[t], r = n.element;
					if (!n.parent || n.globalDisplayStatus < 7) r?.remove(), e.splice(t, 1), t--;
					else {
						this._domElement.contains(r) || (r.style.position = "absolute", r.style.pointerEvents = "auto", this._domElement.appendChild(r));
						let e = n.worldTransform, t = n._anchor, i = n.width * t.x, a = n.height * t.y;
						r.style.transformOrigin = `${i}px ${a}px`, r.style.transform = `matrix(${e.a}, ${e.b}, ${e.c}, ${e.d}, ${e.tx - i}, ${e.ty - a})`, r.style.opacity = n.groupAlpha.toString();
					}
				}
			}
		}
		destroy() {
			this._renderer.runners.postrender.remove(this);
			for (let e = 0; e < this._attachedDomElements.length; e++) this._attachedDomElements[e].element?.remove();
			this._attachedDomElements.length = 0, this._domElement.remove(), this._canvasObserver.destroy(), this._renderer = null;
		}
	}, oi.extension = {
		type: [
			d.WebGLPipes,
			d.WebGPUPipes,
			d.CanvasPipes
		],
		name: "dom"
	};
})), ci, li = o((() => {
	Dt(), dr(), ci = class extends H {
		constructor(e) {
			super(e), this.canBundle = !0, this.allowChildren = !1, this._roundPixels = 0, this._lastUsed = -1, this._gpuData = /* @__PURE__ */ Object.create(null), this.autoGarbageCollect = !0, this._gcLastUsed = -1, this._bounds = new Et(0, 1, 0, 0), this._boundsDirty = !0, this.autoGarbageCollect = e.autoGarbageCollect ?? !0;
		}
		get bounds() {
			return this._boundsDirty &&= (this.updateBounds(), !1), this._bounds;
		}
		get roundPixels() {
			return !!this._roundPixels;
		}
		set roundPixels(e) {
			this._roundPixels = +!!e;
		}
		containsPoint(e) {
			let t = this.bounds, { x: n, y: r } = e;
			return n >= t.minX && n <= t.maxX && r >= t.minY && r <= t.maxY;
		}
		onViewUpdate() {
			if (this._didViewChangeTick++, this._boundsDirty = !0, this.didViewUpdate) return;
			this.didViewUpdate = !0;
			let e = this.renderGroup || this.parentRenderGroup;
			e && e.onChildViewUpdate(this);
		}
		unload() {
			this.emit("unload", this);
			for (let e in this._gpuData) this._gpuData[e]?.destroy();
			this._gpuData = /* @__PURE__ */ Object.create(null), this.onViewUpdate();
		}
		destroy(e) {
			this.unload(), super.destroy(e), this._bounds = null;
		}
		collectRenderablesSimple(e, t, n) {
			let { renderPipes: r } = t;
			r.blendMode.pushBlendMode(this, this.groupBlendMode, e);
			let i = r[this.renderPipeId];
			i?.addRenderable && i.addRenderable(this, e), this.didViewUpdate = !1;
			let a = this.children, o = a.length;
			for (let r = 0; r < o; r++) a[r].collectRenderables(e, t, n);
			r.blendMode.popBlendMode(e);
		}
	};
})), ui = o((() => {
	h(), si(), br(), Re(), li(), m.add(oi);
})), di, fi, pi = o((() => {
	pr(), vr(), di = class {
		constructor() {
			this.interactionFrequency = 10, this._deltaTime = 0, this._didMove = !1, this._tickerAdded = !1, this._pauseUpdate = !0;
		}
		init(e) {
			this.removeTickerListener(), this.events = e, this.interactionFrequency = 10, this._deltaTime = 0, this._didMove = !1, this._tickerAdded = !1, this._pauseUpdate = !0;
		}
		get pauseUpdate() {
			return this._pauseUpdate;
		}
		set pauseUpdate(e) {
			this._pauseUpdate = e;
		}
		addTickerListener() {
			!this._tickerAdded && this.domElement && (_r.system.add(this._tickerUpdate, this, fr.INTERACTION), this._tickerAdded = !0);
		}
		removeTickerListener() {
			this._tickerAdded &&= (_r.system.remove(this._tickerUpdate, this), !1);
		}
		pointerMoved() {
			this._didMove = !0;
		}
		_update() {
			if (!this.domElement || this._pauseUpdate) return;
			if (this._didMove) {
				this._didMove = !1;
				return;
			}
			let e = this.events._rootPointerEvent;
			this.events.supportsTouchEvents && e.pointerType === "touch" || globalThis.document.dispatchEvent(this.events.supportsPointerEvents ? new PointerEvent("pointermove", {
				clientX: e.clientX,
				clientY: e.clientY,
				pointerType: e.pointerType,
				pointerId: e.pointerId
			}) : new MouseEvent("mousemove", {
				clientX: e.clientX,
				clientY: e.clientY
			}));
		}
		_tickerUpdate(e) {
			this._deltaTime += e.deltaTime, this._deltaTime < this.interactionFrequency || (this._deltaTime = 0, this._update());
		}
		destroy() {
			this.removeTickerListener(), this.events = null, this.domElement = null, this._deltaTime = 0, this._didMove = !1, this._tickerAdded = !1, this._pauseUpdate = !0;
		}
	}, fi = new di();
})), mi, hi = o((() => {
	Re(), Sr(), mi = class extends xr {
		constructor() {
			super(...arguments), this.client = new Ie(), this.movement = new Ie(), this.offset = new Ie(), this.global = new Ie(), this.screen = new Ie();
		}
		get clientX() {
			return this.client.x;
		}
		get clientY() {
			return this.client.y;
		}
		get x() {
			return this.clientX;
		}
		get y() {
			return this.clientY;
		}
		get movementX() {
			return this.movement.x;
		}
		get movementY() {
			return this.movement.y;
		}
		get offsetX() {
			return this.offset.x;
		}
		get offsetY() {
			return this.offset.y;
		}
		get globalX() {
			return this.global.x;
		}
		get globalY() {
			return this.global.y;
		}
		get screenX() {
			return this.screen.x;
		}
		get screenY() {
			return this.screen.y;
		}
		getLocalPosition(e, t, n) {
			return e.worldTransform.applyInverse(n || this.global, t);
		}
		getModifierState(e) {
			return "getModifierState" in this.nativeEvent && this.nativeEvent.getModifierState(e);
		}
		initMouseEvent(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m) {
			throw Error("Method not implemented.");
		}
	};
})), gi, _i = o((() => {
	hi(), gi = class extends mi {
		constructor() {
			super(...arguments), this.width = 0, this.height = 0, this.isPrimary = !1, this.persistentDeviceId = 0;
		}
		getCoalescedEvents() {
			return this.type === "pointermove" || this.type === "mousemove" || this.type === "touchmove" ? [this] : [];
		}
		getPredictedEvents() {
			throw Error("getPredictedEvents is not supported!");
		}
	};
})), vi, yi = o((() => {
	hi(), vi = class extends mi {
		constructor() {
			super(...arguments), this.DOM_DELTA_PIXEL = 0, this.DOM_DELTA_LINE = 1, this.DOM_DELTA_PAGE = 2;
		}
	}, vi.DOM_DELTA_PIXEL = 0, vi.DOM_DELTA_LINE = 1, vi.DOM_DELTA_PAGE = 2;
})), bi, xi, Si, Ci, wi, Ti, Ei = o((() => {
	y(), Re(), L(), pi(), hi(), _i(), yi(), bi = 2048, xi = new Ie(), Si = new Ie(), Ci = /* @__PURE__ */ Object.create(null), wi = /* @__PURE__ */ Object.create(null), Ti = class {
		constructor(e) {
			this.dispatch = new v(), this.moveOnAll = !1, this.enableGlobalMoveEvents = !0, this.mappingState = { trackingData: {} }, this.eventPool = /* @__PURE__ */ new Map(), this._allInteractiveElements = [], this._hitElements = [], this._isPointerMoveEvent = !1, this.rootTarget = e, this.hitPruneFn = this.hitPruneFn.bind(this), this.hitTestFn = this.hitTestFn.bind(this), this.mapPointerDown = this.mapPointerDown.bind(this), this.mapPointerMove = this.mapPointerMove.bind(this), this.mapPointerOut = this.mapPointerOut.bind(this), this.mapPointerOver = this.mapPointerOver.bind(this), this.mapPointerUp = this.mapPointerUp.bind(this), this.mapPointerUpOutside = this.mapPointerUpOutside.bind(this), this.mapWheel = this.mapWheel.bind(this), this.mapContextMenu = this.mapContextMenu.bind(this), this.mappingTable = {}, this.addEventMapping("pointerdown", this.mapPointerDown), this.addEventMapping("pointermove", this.mapPointerMove), this.addEventMapping("pointerout", this.mapPointerOut), this.addEventMapping("pointerleave", this.mapPointerOut), this.addEventMapping("pointerover", this.mapPointerOver), this.addEventMapping("pointerup", this.mapPointerUp), this.addEventMapping("pointerupoutside", this.mapPointerUpOutside), this.addEventMapping("wheel", this.mapWheel), this.addEventMapping("contextmenu", this.mapContextMenu);
		}
		addEventMapping(e, t) {
			this.mappingTable[e] || (this.mappingTable[e] = []), this.mappingTable[e].push({
				fn: t,
				priority: 0
			}), this.mappingTable[e].sort((e, t) => e.priority - t.priority);
		}
		dispatchEvent(e, t) {
			e.propagationStopped = !1, e.propagationImmediatelyStopped = !1, this.propagate(e, t), this.dispatch.emit(t || e.type, e);
		}
		mapEvent(e) {
			if (!this.rootTarget) return;
			let t = this.mappingTable[e.type];
			if (t) for (let n = 0, r = t.length; n < r; n++) t[n].fn(e);
			else I(`[EventBoundary]: Event mapping not defined for ${e.type}`);
		}
		hitTest(e, t) {
			fi.pauseUpdate = !0;
			let n = this._isPointerMoveEvent && this.enableGlobalMoveEvents ? "hitTestMoveRecursive" : "hitTestRecursive", r = this[n](this.rootTarget, this.rootTarget.eventMode, xi.set(e, t), this.hitTestFn, this.hitPruneFn);
			return r && r[0];
		}
		propagate(e, t) {
			if (!e.target) return;
			let n = e.composedPath();
			e.eventPhase = e.CAPTURING_PHASE;
			for (let r = 0, i = n.length - 1; r < i; r++) if (e.currentTarget = n[r], this.notifyTarget(e, t), e.propagationStopped || e.propagationImmediatelyStopped) return;
			if (e.eventPhase = e.AT_TARGET, e.currentTarget = e.target, this.notifyTarget(e, t), !(e.propagationStopped || e.propagationImmediatelyStopped)) {
				e.eventPhase = e.BUBBLING_PHASE;
				for (let r = n.length - 2; r >= 0; r--) if (e.currentTarget = n[r], this.notifyTarget(e, t), e.propagationStopped || e.propagationImmediatelyStopped) return;
			}
		}
		all(e, t, n = this._allInteractiveElements) {
			if (n.length === 0) return;
			e.eventPhase = e.BUBBLING_PHASE;
			let r = Array.isArray(t) ? t : [t];
			for (let t = n.length - 1; t >= 0; t--) for (let i = 0; i < r.length; i++) e.currentTarget = n[t], this.notifyTarget(e, r[i]);
		}
		propagationPath(e) {
			let t = [e];
			for (let n = 0; n < bi && e !== this.rootTarget && e.parent; n++) {
				if (!e.parent) throw Error("Cannot find propagation path to disconnected target");
				t.push(e.parent), e = e.parent;
			}
			return t.reverse(), t;
		}
		hitTestMoveRecursive(e, t, n, r, i, a = !1) {
			let o = !1;
			if (this._interactivePrune(e)) return null;
			if ((e.eventMode === "dynamic" || t === "dynamic") && (fi.pauseUpdate = !1), e.interactiveChildren && e.children && e.children.length > 0) {
				let s = e.children, c = a || i(e, n);
				for (let a = s.length - 1; a >= 0; a--) {
					let l = s[a], u = this.hitTestMoveRecursive(l, this._isInteractive(t) ? t : l.eventMode, n, r, i, c);
					if (u) {
						if (u.length > 0 && !u[u.length - 1].parent) continue;
						(u.length > 0 || e.isInteractive()) && u.push(e), this._hitElements.length === 0 && (this._hitElements = u), o = !0;
					}
				}
			}
			let s = this._isInteractive(t), c = e.isInteractive();
			return c && this._allInteractiveElements.push(e), a || this._hitElements.length > 0 ? null : o ? this._hitElements : s && !i(e, n) && r(e, n) ? c ? [e] : [] : null;
		}
		hitTestRecursive(e, t, n, r, i) {
			if (this._interactivePrune(e) || i(e, n)) return null;
			if ((e.eventMode === "dynamic" || t === "dynamic") && (fi.pauseUpdate = !1), e.interactiveChildren && e.children) {
				let a = e.children, o = n;
				for (let n = a.length - 1; n >= 0; n--) {
					let s = a[n], c = this.hitTestRecursive(s, this._isInteractive(t) ? t : s.eventMode, o, r, i);
					if (c) {
						if (c.length > 0 && !c[c.length - 1].parent) continue;
						let t = e.isInteractive();
						return (c.length > 0 || t) && c.push(e), c;
					}
				}
			}
			let a = this._isInteractive(t), o = e.isInteractive();
			return a && r(e, n) ? o ? [e] : [] : null;
		}
		_isInteractive(e) {
			return e === "static" || e === "dynamic";
		}
		_interactivePrune(e) {
			return !e || !e.visible || !e.renderable || !e.measurable || e.eventMode === "none" || e.eventMode === "passive" && !e.interactiveChildren;
		}
		hitPruneFn(e, t) {
			if (e.hitArea && (e.worldTransform.applyInverse(t, Si), !e.hitArea.contains(Si.x, Si.y))) return !0;
			if (e.effects && e.effects.length) for (let n = 0; n < e.effects.length; n++) {
				let r = e.effects[n];
				if (r.containsPoint && !r.containsPoint(t, this.hitTestFn)) return !0;
			}
			return !1;
		}
		hitTestFn(e, t) {
			return e.hitArea ? !0 : e?.containsPoint ? (e.worldTransform.applyInverse(t, Si), e.containsPoint(Si)) : !1;
		}
		notifyTarget(e, t) {
			if (!e.currentTarget.isInteractive()) return;
			t ??= e.type;
			let n = Ci[t] ?? (Ci[t] = `on${t}`);
			e.currentTarget[n]?.(e);
			let r = e.eventPhase === e.CAPTURING_PHASE || e.eventPhase === e.AT_TARGET ? wi[t] ?? (wi[t] = `${t}capture`) : t;
			this._notifyListeners(e, r), e.eventPhase === e.AT_TARGET && this._notifyListeners(e, t);
		}
		mapPointerDown(e) {
			if (!(e instanceof gi)) {
				I("EventBoundary cannot map a non-pointer event as a pointer event");
				return;
			}
			let t = this.createPointerEvent(e);
			if (this.dispatchEvent(t, "pointerdown"), t.pointerType === "touch") this.dispatchEvent(t, "touchstart");
			else if (t.pointerType === "mouse" || t.pointerType === "pen") {
				let e = t.button === 2;
				this.dispatchEvent(t, e ? "rightdown" : "mousedown");
			}
			let n = this.trackingData(e.pointerId);
			n.pressTargetsByButton[e.button] = t.composedPath(), this.freeEvent(t);
		}
		mapPointerMove(e) {
			if (!(e instanceof gi)) {
				I("EventBoundary cannot map a non-pointer event as a pointer event");
				return;
			}
			this._allInteractiveElements.length = 0, this._hitElements.length = 0, this._isPointerMoveEvent = !0;
			let t = this.createPointerEvent(e);
			this._isPointerMoveEvent = !1;
			let n = t.pointerType === "mouse" || t.pointerType === "pen", r = this.trackingData(e.pointerId), i = this.findMountedTarget(r.overTargets);
			if (r.overTargets?.length > 0 && i !== t.target) {
				let r = e.type === "mousemove" ? "mouseout" : "pointerout", a = this.createPointerEvent(e, r, i);
				if (this.dispatchEvent(a, "pointerout"), n && this.dispatchEvent(a, "mouseout"), !t.composedPath().includes(i)) {
					let r = this.createPointerEvent(e, "pointerleave", i);
					for (r.eventPhase = r.AT_TARGET; r.target && !t.composedPath().includes(r.target);) r.currentTarget = r.target, this.notifyTarget(r), n && this.notifyTarget(r, "mouseleave"), r.target = r.target.parent;
					this.freeEvent(r);
				}
				this.freeEvent(a);
			}
			if (i !== t.target) {
				let r = e.type === "mousemove" ? "mouseover" : "pointerover", a = this.clonePointerEvent(t, r);
				this.dispatchEvent(a, "pointerover"), n && this.dispatchEvent(a, "mouseover");
				let o = i?.parent;
				for (; o && o !== this.rootTarget.parent && o !== t.target;) o = o.parent;
				if (!o || o === this.rootTarget.parent) {
					let e = this.clonePointerEvent(t, "pointerenter");
					for (e.eventPhase = e.AT_TARGET; e.target && e.target !== i && e.target !== this.rootTarget.parent;) e.currentTarget = e.target, this.notifyTarget(e), n && this.notifyTarget(e, "mouseenter"), e.target = e.target.parent;
					this.freeEvent(e);
				}
				this.freeEvent(a);
			}
			let a = [], o = this.enableGlobalMoveEvents ?? !0;
			this.moveOnAll ? a.push("pointermove") : this.dispatchEvent(t, "pointermove"), o && a.push("globalpointermove"), t.pointerType === "touch" && (this.moveOnAll ? a.splice(1, 0, "touchmove") : this.dispatchEvent(t, "touchmove"), o && a.push("globaltouchmove")), n && (this.moveOnAll ? a.splice(1, 0, "mousemove") : this.dispatchEvent(t, "mousemove"), o && a.push("globalmousemove"), this.cursor = t.target?.cursor), a.length > 0 && this.all(t, a), this._allInteractiveElements.length = 0, this._hitElements.length = 0, r.overTargets = t.composedPath(), this.freeEvent(t);
		}
		mapPointerOver(e) {
			if (!(e instanceof gi)) {
				I("EventBoundary cannot map a non-pointer event as a pointer event");
				return;
			}
			let t = this.trackingData(e.pointerId), n = this.createPointerEvent(e), r = n.pointerType === "mouse" || n.pointerType === "pen";
			this.dispatchEvent(n, "pointerover"), r && this.dispatchEvent(n, "mouseover"), n.pointerType === "mouse" && (this.cursor = n.target?.cursor);
			let i = this.clonePointerEvent(n, "pointerenter");
			for (i.eventPhase = i.AT_TARGET; i.target && i.target !== this.rootTarget.parent;) i.currentTarget = i.target, this.notifyTarget(i), r && this.notifyTarget(i, "mouseenter"), i.target = i.target.parent;
			t.overTargets = n.composedPath(), this.freeEvent(n), this.freeEvent(i);
		}
		mapPointerOut(e) {
			if (!(e instanceof gi)) {
				I("EventBoundary cannot map a non-pointer event as a pointer event");
				return;
			}
			let t = this.trackingData(e.pointerId);
			if (t.overTargets) {
				let n = e.pointerType === "mouse" || e.pointerType === "pen", r = this.findMountedTarget(t.overTargets), i = this.createPointerEvent(e, "pointerout", r);
				this.dispatchEvent(i), n && this.dispatchEvent(i, "mouseout");
				let a = this.createPointerEvent(e, "pointerleave", r);
				for (a.eventPhase = a.AT_TARGET; a.target && a.target !== this.rootTarget.parent;) a.currentTarget = a.target, this.notifyTarget(a), n && this.notifyTarget(a, "mouseleave"), a.target = a.target.parent;
				t.overTargets = null, this.freeEvent(i), this.freeEvent(a);
			}
			this.cursor = null;
		}
		mapPointerUp(e) {
			if (!(e instanceof gi)) {
				I("EventBoundary cannot map a non-pointer event as a pointer event");
				return;
			}
			let t = performance.now(), n = this.createPointerEvent(e);
			if (this.dispatchEvent(n, "pointerup"), n.pointerType === "touch") this.dispatchEvent(n, "touchend");
			else if (n.pointerType === "mouse" || n.pointerType === "pen") {
				let e = n.button === 2;
				this.dispatchEvent(n, e ? "rightup" : "mouseup");
			}
			let r = this.trackingData(e.pointerId), i = this.findMountedTarget(r.pressTargetsByButton[e.button]), a = i;
			if (i && !n.composedPath().includes(i)) {
				let t = i;
				for (; t && !n.composedPath().includes(t);) {
					if (n.currentTarget = t, this.notifyTarget(n, "pointerupoutside"), n.pointerType === "touch") this.notifyTarget(n, "touchendoutside");
					else if (n.pointerType === "mouse" || n.pointerType === "pen") {
						let e = n.button === 2;
						this.notifyTarget(n, e ? "rightupoutside" : "mouseupoutside");
					}
					t = t.parent;
				}
				delete r.pressTargetsByButton[e.button], a = t;
			}
			if (a) {
				let i = this.clonePointerEvent(n, "click");
				i.target = a, i.path = null, r.clicksByButton[e.button] || (r.clicksByButton[e.button] = {
					clickCount: 0,
					target: i.target,
					timeStamp: t
				});
				let o = r.clicksByButton[e.button];
				if (o.target === i.target && t - o.timeStamp < 200 ? ++o.clickCount : o.clickCount = 1, o.target = i.target, o.timeStamp = t, i.detail = o.clickCount, i.pointerType === "mouse") {
					let e = i.button === 2;
					this.dispatchEvent(i, e ? "rightclick" : "click");
				} else i.pointerType === "touch" && this.dispatchEvent(i, "tap");
				this.dispatchEvent(i, "pointertap"), this.freeEvent(i);
			}
			this.freeEvent(n);
		}
		mapPointerUpOutside(e) {
			if (!(e instanceof gi)) {
				I("EventBoundary cannot map a non-pointer event as a pointer event");
				return;
			}
			let t = this.trackingData(e.pointerId), n = this.findMountedTarget(t.pressTargetsByButton[e.button]), r = this.createPointerEvent(e);
			if (n) {
				let i = n;
				for (; i;) r.currentTarget = i, this.notifyTarget(r, "pointerupoutside"), r.pointerType === "touch" ? this.notifyTarget(r, "touchendoutside") : (r.pointerType === "mouse" || r.pointerType === "pen") && this.notifyTarget(r, r.button === 2 ? "rightupoutside" : "mouseupoutside"), i = i.parent;
				delete t.pressTargetsByButton[e.button];
			}
			this.freeEvent(r);
		}
		mapWheel(e) {
			if (!(e instanceof vi)) {
				I("EventBoundary cannot map a non-wheel event as a wheel event");
				return;
			}
			let t = this.createWheelEvent(e);
			this.dispatchEvent(t), this.freeEvent(t);
		}
		mapContextMenu(e) {
			if (!(e instanceof gi)) {
				I("EventBoundary cannot map a non-pointer event as a pointer event");
				return;
			}
			let t = this.createPointerEvent(e);
			this.dispatchEvent(t, "contextmenu"), this.freeEvent(t);
		}
		findMountedTarget(e) {
			if (!e) return null;
			let t = e[0];
			for (let n = 1; n < e.length && e[n].parent === t; n++) t = e[n];
			return t;
		}
		createPointerEvent(e, t, n) {
			let r = this.allocateEvent(gi);
			return this.copyPointerData(e, r), this.copyMouseData(e, r), this.copyData(e, r), r.nativeEvent = e.nativeEvent, r.originalEvent = e, r.target = n ?? this.hitTest(r.global.x, r.global.y) ?? this._hitElements[0], typeof t == "string" && (r.type = t), r;
		}
		createWheelEvent(e) {
			let t = this.allocateEvent(vi);
			return this.copyWheelData(e, t), this.copyMouseData(e, t), this.copyData(e, t), t.nativeEvent = e.nativeEvent, t.originalEvent = e, t.target = this.hitTest(t.global.x, t.global.y), t;
		}
		clonePointerEvent(e, t) {
			let n = this.allocateEvent(gi);
			return n.nativeEvent = e.nativeEvent, n.originalEvent = e.originalEvent, this.copyPointerData(e, n), this.copyMouseData(e, n), this.copyData(e, n), n.target = e.target, n.path = e.composedPath().slice(), n.type = t ?? n.type, n;
		}
		copyWheelData(e, t) {
			t.deltaMode = e.deltaMode, t.deltaX = e.deltaX, t.deltaY = e.deltaY, t.deltaZ = e.deltaZ;
		}
		copyPointerData(e, t) {
			e instanceof gi && t instanceof gi && (t.pointerId = e.pointerId, t.width = e.width, t.height = e.height, t.isPrimary = e.isPrimary, t.pointerType = e.pointerType, t.pressure = e.pressure, t.tangentialPressure = e.tangentialPressure, t.tiltX = e.tiltX, t.tiltY = e.tiltY, t.twist = e.twist, t.persistentDeviceId = e.persistentDeviceId);
		}
		copyMouseData(e, t) {
			e instanceof mi && t instanceof mi && (t.altKey = e.altKey, t.button = e.button, t.buttons = e.buttons, t.client.copyFrom(e.client), t.ctrlKey = e.ctrlKey, t.metaKey = e.metaKey, t.movement.copyFrom(e.movement), t.screen.copyFrom(e.screen), t.shiftKey = e.shiftKey, t.global.copyFrom(e.global));
		}
		copyData(e, t) {
			t.isTrusted = e.isTrusted, t.srcElement = e.srcElement, t.timeStamp = performance.now(), t.type = e.type, t.detail = e.detail, t.view = e.view, t.which = e.which, t.layer.copyFrom(e.layer), t.page.copyFrom(e.page);
		}
		trackingData(e) {
			return this.mappingState.trackingData[e] || (this.mappingState.trackingData[e] = {
				pressTargetsByButton: {},
				clicksByButton: {},
				overTarget: null
			}), this.mappingState.trackingData[e];
		}
		allocateEvent(e) {
			this.eventPool.has(e) || this.eventPool.set(e, []);
			let t = this.eventPool.get(e).pop() || new e(this);
			return t.eventPhase = t.NONE, t.currentTarget = null, t.defaultPrevented = !1, t.path = null, t.target = null, t;
		}
		freeEvent(e) {
			if (e.manager !== this) throw Error("It is illegal to free an event not managed by this EventBoundary!");
			let t = e.constructor;
			this.eventPool.has(t) || this.eventPool.set(t, []), this.eventPool.get(t).push(e);
		}
		_notifyListeners(e, t) {
			let n = e.currentTarget._events[t];
			if (n) {
				if ("fn" in n) n.once && e.currentTarget.removeListener(t, n.fn, void 0, !0), n.fn.call(n.context, e);
				else for (let r = 0, i = n.length; r < i && !e.propagationImmediatelyStopped; r++) n[r].once && e.currentTarget.removeListener(t, n[r].fn, void 0, !0), n[r].fn.call(n[r].context, e);
			}
		}
	};
})), Di, Oi, ki, Ai, ji = o((() => {
	h(), Ei(), pi(), _i(), yi(), Di = 1, Oi = {
		touchstart: "pointerdown",
		touchend: "pointerup",
		touchendoutside: "pointerupoutside",
		touchmove: "pointermove",
		touchcancel: "pointercancel"
	}, ki = class e {
		constructor(t) {
			this.supportsTouchEvents = "ontouchstart" in globalThis, this.supportsPointerEvents = !!globalThis.PointerEvent, this.domElement = null, this.resolution = 1, this.renderer = t, this.rootBoundary = new Ti(null), fi.init(this), this.autoPreventDefault = !0, this._eventsAdded = !1, this._rootPointerEvent = new gi(null), this._rootWheelEvent = new vi(null), this._rootContextMenuEvent = new gi(null), this.cursorStyles = {
				default: "inherit",
				pointer: "pointer"
			}, this.features = new Proxy({ ...e.defaultEventFeatures }, { set: (e, t, n) => (t === "globalMove" && (this.rootBoundary.enableGlobalMoveEvents = n), e[t] = n, !0) }), this._onPointerDown = this._onPointerDown.bind(this), this._onPointerMove = this._onPointerMove.bind(this), this._onPointerUp = this._onPointerUp.bind(this), this._onPointerOverOut = this._onPointerOverOut.bind(this), this._onContextMenu = this._onContextMenu.bind(this), this.onWheel = this.onWheel.bind(this);
		}
		static get defaultEventMode() {
			return this._defaultEventMode;
		}
		init(t) {
			let { canvas: n, resolution: r } = this.renderer;
			this.setTargetElement(n), this.resolution = r, e._defaultEventMode = t.eventMode ?? "passive", Object.assign(this.features, t.eventFeatures ?? {}), this.rootBoundary.enableGlobalMoveEvents = this.features.globalMove;
		}
		resolutionChange(e) {
			this.resolution = e;
		}
		destroy() {
			fi.destroy(), this.setTargetElement(null), this.renderer = null, this._currentCursor = null;
		}
		setCursor(e) {
			e ||= "default";
			let t = !0;
			if (globalThis.OffscreenCanvas && this.domElement instanceof OffscreenCanvas && (t = !1), this._currentCursor === e) return;
			this._currentCursor = e;
			let n = this.cursorStyles[e];
			if (n) switch (typeof n) {
				case "string":
					t && (this.domElement.style.cursor = n);
					break;
				case "function":
					n(e);
					break;
				case "object": t && Object.assign(this.domElement.style, n);
			}
			else t && typeof e == "string" && !Object.prototype.hasOwnProperty.call(this.cursorStyles, e) && (this.domElement.style.cursor = e);
		}
		get pointer() {
			return this._rootPointerEvent;
		}
		_onPointerDown(e) {
			if (!this.features.click) return;
			this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
			let t = this._normalizeToPointerData(e);
			this.autoPreventDefault && t[0].isNormalized && (e.cancelable || !("cancelable" in e)) && e.preventDefault();
			for (let e = 0, n = t.length; e < n; e++) {
				let n = t[e], r = this._bootstrapEvent(this._rootPointerEvent, n);
				this.rootBoundary.mapEvent(r);
			}
			this.setCursor(this.rootBoundary.cursor);
		}
		_onPointerMove(e) {
			if (!this.features.move) return;
			this.rootBoundary.rootTarget = this.renderer.lastObjectRendered, fi.pointerMoved();
			let t = this._normalizeToPointerData(e);
			for (let e = 0, n = t.length; e < n; e++) {
				let n = this._bootstrapEvent(this._rootPointerEvent, t[e]);
				this.rootBoundary.mapEvent(n);
			}
			this.setCursor(this.rootBoundary.cursor);
		}
		_onPointerUp(e) {
			if (!this.features.click) return;
			this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
			let t = e.target;
			e.composedPath && e.composedPath().length > 0 && (t = e.composedPath()[0]);
			let n = t === this.domElement ? "" : "outside", r = this._normalizeToPointerData(e);
			for (let e = 0, t = r.length; e < t; e++) {
				let t = this._bootstrapEvent(this._rootPointerEvent, r[e]);
				t.type += n, this.rootBoundary.mapEvent(t);
			}
			this.setCursor(this.rootBoundary.cursor);
		}
		_onPointerOverOut(e) {
			if (!this.features.click) return;
			this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
			let t = this._normalizeToPointerData(e);
			for (let e = 0, n = t.length; e < n; e++) {
				let n = this._bootstrapEvent(this._rootPointerEvent, t[e]);
				this.rootBoundary.mapEvent(n);
			}
			this.setCursor(this.rootBoundary.cursor);
		}
		_onContextMenu(e) {
			if (!this.features.click) return;
			this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
			let t = this._normalizeToPointerData(e);
			for (let e = 0, n = t.length; e < n; e++) {
				let n = this._bootstrapEvent(this._rootContextMenuEvent, t[e]);
				this.rootBoundary.mapEvent(n);
			}
			this.setCursor(this.rootBoundary.cursor);
		}
		onWheel(e) {
			if (!this.features.wheel) return;
			let t = this.normalizeWheelEvent(e);
			this.rootBoundary.rootTarget = this.renderer.lastObjectRendered, this.rootBoundary.mapEvent(t);
		}
		setTargetElement(e) {
			this._removeEvents(), this.domElement = e, fi.domElement = e, this._addEvents();
		}
		_addEvents() {
			if (this._eventsAdded || !this.domElement) return;
			fi.addTickerListener();
			let e = this.domElement.style;
			e && (globalThis.navigator.msPointerEnabled ? (e.msContentZooming = "none", e.msTouchAction = "none") : this.supportsPointerEvents && (e.touchAction = "none")), this.supportsPointerEvents ? (globalThis.document.addEventListener("pointermove", this._onPointerMove, !0), this.domElement.addEventListener("pointerdown", this._onPointerDown, !0), this.domElement.addEventListener("pointerleave", this._onPointerOverOut, !0), this.domElement.addEventListener("pointerover", this._onPointerOverOut, !0), globalThis.addEventListener("pointerup", this._onPointerUp, !0)) : (globalThis.document.addEventListener("mousemove", this._onPointerMove, !0), this.domElement.addEventListener("mousedown", this._onPointerDown, !0), this.domElement.addEventListener("mouseout", this._onPointerOverOut, !0), this.domElement.addEventListener("mouseover", this._onPointerOverOut, !0), globalThis.addEventListener("mouseup", this._onPointerUp, !0), this.supportsTouchEvents && (this.domElement.addEventListener("touchstart", this._onPointerDown, !0), this.domElement.addEventListener("touchend", this._onPointerUp, !0), this.domElement.addEventListener("touchmove", this._onPointerMove, !0))), this.domElement.addEventListener("wheel", this.onWheel, {
				passive: !0,
				capture: !0
			}), this.domElement.addEventListener("contextmenu", this._onContextMenu, !0), this._eventsAdded = !0;
		}
		_removeEvents() {
			if (!this._eventsAdded || !this.domElement) return;
			fi.removeTickerListener();
			let e = this.domElement.style;
			e && (globalThis.navigator.msPointerEnabled ? (e.msContentZooming = "", e.msTouchAction = "") : this.supportsPointerEvents && (e.touchAction = "")), this.supportsPointerEvents ? (globalThis.document.removeEventListener("pointermove", this._onPointerMove, !0), this.domElement.removeEventListener("pointerdown", this._onPointerDown, !0), this.domElement.removeEventListener("pointerleave", this._onPointerOverOut, !0), this.domElement.removeEventListener("pointerover", this._onPointerOverOut, !0), globalThis.removeEventListener("pointerup", this._onPointerUp, !0)) : (globalThis.document.removeEventListener("mousemove", this._onPointerMove, !0), this.domElement.removeEventListener("mousedown", this._onPointerDown, !0), this.domElement.removeEventListener("mouseout", this._onPointerOverOut, !0), this.domElement.removeEventListener("mouseover", this._onPointerOverOut, !0), globalThis.removeEventListener("mouseup", this._onPointerUp, !0), this.supportsTouchEvents && (this.domElement.removeEventListener("touchstart", this._onPointerDown, !0), this.domElement.removeEventListener("touchend", this._onPointerUp, !0), this.domElement.removeEventListener("touchmove", this._onPointerMove, !0))), this.domElement.removeEventListener("wheel", this.onWheel, !0), this.domElement.removeEventListener("contextmenu", this._onContextMenu, !0), this.domElement = null, this._eventsAdded = !1;
		}
		mapPositionToPoint(e, t, n) {
			let r = this.domElement.isConnected ? this.domElement.getBoundingClientRect() : {
				x: 0,
				y: 0,
				width: this.domElement.width,
				height: this.domElement.height,
				left: 0,
				top: 0
			}, i = 1 / this.resolution;
			e.x = (t - r.left) * (this.domElement.width / r.width) * i, e.y = (n - r.top) * (this.domElement.height / r.height) * i;
		}
		_normalizeToPointerData(e) {
			let t = [];
			if (this.supportsTouchEvents && e instanceof TouchEvent) for (let n = 0, r = e.changedTouches.length; n < r; n++) {
				let r = e.changedTouches[n];
				r.button === void 0 && (r.button = 0), r.buttons === void 0 && (r.buttons = 1), r.isPrimary === void 0 && (r.isPrimary = e.touches.length === 1 && e.type === "touchstart"), r.width === void 0 && (r.width = r.radiusX || 1), r.height === void 0 && (r.height = r.radiusY || 1), r.tiltX === void 0 && (r.tiltX = 0), r.tiltY === void 0 && (r.tiltY = 0), r.pointerType === void 0 && (r.pointerType = "touch"), r.pointerId === void 0 && (r.pointerId = r.identifier || 0), r.pressure === void 0 && (r.pressure = r.force || .5), r.twist === void 0 && (r.twist = 0), r.tangentialPressure === void 0 && (r.tangentialPressure = 0), r.layerX === void 0 && (r.layerX = r.offsetX = r.clientX), r.layerY === void 0 && (r.layerY = r.offsetY = r.clientY), r.isNormalized = !0, r.type = e.type, r.altKey ??= e.altKey, r.ctrlKey ??= e.ctrlKey, r.metaKey ??= e.metaKey, r.shiftKey ??= e.shiftKey, t.push(r);
			}
			else if (!globalThis.MouseEvent || e instanceof MouseEvent && (!this.supportsPointerEvents || !(e instanceof globalThis.PointerEvent))) {
				let n = e;
				n.isPrimary === void 0 && (n.isPrimary = !0), n.width === void 0 && (n.width = 1), n.height === void 0 && (n.height = 1), n.tiltX === void 0 && (n.tiltX = 0), n.tiltY === void 0 && (n.tiltY = 0), n.pointerType === void 0 && (n.pointerType = "mouse"), n.pointerId === void 0 && (n.pointerId = Di), n.pressure === void 0 && (n.pressure = .5), n.twist === void 0 && (n.twist = 0), n.tangentialPressure === void 0 && (n.tangentialPressure = 0), n.isNormalized = !0, t.push(n);
			} else t.push(e);
			return t;
		}
		normalizeWheelEvent(e) {
			let t = this._rootWheelEvent;
			return this._transferMouseData(t, e), t.deltaX = e.deltaX, t.deltaY = e.deltaY, t.deltaZ = e.deltaZ, t.deltaMode = e.deltaMode, this.mapPositionToPoint(t.screen, e.clientX, e.clientY), t.global.copyFrom(t.screen), t.offset.copyFrom(t.screen), t.nativeEvent = e, t.type = e.type, t;
		}
		_bootstrapEvent(e, t) {
			return e.originalEvent = null, e.nativeEvent = t, e.pointerId = t.pointerId, e.width = t.width, e.height = t.height, e.isPrimary = t.isPrimary, e.pointerType = t.pointerType, e.pressure = t.pressure, e.tangentialPressure = t.tangentialPressure, e.tiltX = t.tiltX, e.tiltY = t.tiltY, e.twist = t.twist, this._transferMouseData(e, t), this.mapPositionToPoint(e.screen, t.clientX, t.clientY), e.global.copyFrom(e.screen), e.offset.copyFrom(e.screen), e.isTrusted = t.isTrusted, e.type === "pointerleave" && (e.type = "pointerout"), e.type.startsWith("mouse") && (e.type = e.type.replace("mouse", "pointer")), e.type.startsWith("touch") && (e.type = Oi[e.type] || e.type), e;
		}
		_transferMouseData(e, t) {
			e.isTrusted = t.isTrusted, e.srcElement = t.srcElement, e.timeStamp = performance.now(), e.type = t.type, e.altKey = t.altKey, e.button = t.button, e.buttons = t.buttons, e.client.x = t.clientX, e.client.y = t.clientY, e.ctrlKey = t.ctrlKey, e.metaKey = t.metaKey, e.movement.x = t.movementX, e.movement.y = t.movementY, e.page.x = t.pageX, e.page.y = t.pageY, e.relatedTarget = null, e.shiftKey = t.shiftKey;
		}
	}, ki.extension = {
		name: "events",
		type: [
			d.WebGLSystem,
			d.CanvasSystem,
			d.WebGPUSystem
		],
		priority: -1
	}, ki.defaultEventFeatures = {
		move: !0,
		globalMove: !0,
		click: !0,
		wheel: !0
	}, Ai = ki;
})), Mi, Ni = o((() => {
	ji(), Sr(), Mi = {
		onclick: null,
		oncontextmenu: null,
		onmousedown: null,
		onmouseenter: null,
		onmouseleave: null,
		onmousemove: null,
		onglobalmousemove: null,
		onmouseout: null,
		onmouseover: null,
		onmouseup: null,
		onmouseupoutside: null,
		onpointercancel: null,
		onpointerdown: null,
		onpointerenter: null,
		onpointerleave: null,
		onpointermove: null,
		onglobalpointermove: null,
		onpointerout: null,
		onpointerover: null,
		onpointertap: null,
		onpointerup: null,
		onpointerupoutside: null,
		onrightclick: null,
		onrightdown: null,
		onrightup: null,
		onrightupoutside: null,
		ontap: null,
		ontouchcancel: null,
		ontouchend: null,
		ontouchendoutside: null,
		ontouchmove: null,
		onglobaltouchmove: null,
		ontouchstart: null,
		onwheel: null,
		get interactive() {
			return this.eventMode === "dynamic" || this.eventMode === "static";
		},
		set interactive(e) {
			this.eventMode = e ? "static" : "passive";
		},
		_internalEventMode: void 0,
		get eventMode() {
			return this._internalEventMode ?? Ai.defaultEventMode;
		},
		set eventMode(e) {
			this._internalEventMode = e;
		},
		isInteractive() {
			return this.eventMode === "static" || this.eventMode === "dynamic";
		},
		interactiveChildren: !0,
		hitArea: null,
		addEventListener(e, t, n) {
			let r = typeof n == "boolean" && n || typeof n == "object" && n.capture, i = typeof n == "object" ? n.signal : void 0, a = typeof n == "object" && n.once === !0, o = typeof t == "function" ? void 0 : t;
			e = r ? `${e}capture` : e;
			let s = typeof t == "function" ? t : t.handleEvent, c = this;
			i && i.addEventListener("abort", () => {
				c.off(e, s, o);
			}), a ? c.once(e, s, o) : c.on(e, s, o);
		},
		removeEventListener(e, t, n) {
			let r = typeof n == "boolean" && n || typeof n == "object" && n.capture, i = typeof t == "function" ? void 0 : t;
			e = r ? `${e}capture` : e, t = typeof t == "function" ? t : t.handleEvent, this.off(e, t, i);
		},
		dispatchEvent(e) {
			if (!(e instanceof xr)) throw Error("Container cannot propagate events outside of the Federated Events API");
			return e.defaultPrevented = !1, e.path = null, e.target = this, e.manager.dispatchEvent(e), !e.defaultPrevented;
		}
	};
})), Pi = o((() => {
	h(), dr(), ji(), Ni(), m.add(Ai), m.mixin(H, Mi);
})), Fi, Ii = o((() => {
	Fi = /* @__PURE__ */ ((e) => (e[e.Low = 0] = "Low", e[e.Normal = 1] = "Normal", e[e.High = 2] = "High", e))(Fi || {});
})), Li, Ri = o((() => {
	Li = {
		createCanvas: (e, t) => {
			let n = document.createElement("canvas");
			return n.width = e, n.height = t, n;
		},
		createImage: () => new Image(),
		getCanvasRenderingContext2D: () => CanvasRenderingContext2D,
		getWebGLRenderingContext: () => WebGLRenderingContext,
		getNavigator: () => navigator,
		getBaseUrl: () => document.baseURI ?? window.location.href,
		getFontFaceSet: () => document.fonts,
		fetch: (e, t) => fetch(e, t),
		parseXML: (e) => new DOMParser().parseFromString(e, "text/xml")
	};
})), zi, U, W = o((() => {
	Ri(), zi = Li, U = {
		get() {
			return zi;
		},
		set(e) {
			zi = e;
		}
	};
}));
// node_modules/pixi.js/lib/utils/path.mjs
function Bi(e) {
	if (typeof e != "string") throw TypeError(`Path must be a string. Received ${JSON.stringify(e)}`);
}
function Vi(e) {
	return e.split("?")[0].split("#")[0];
}
function Hi(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Ui(e, t, n) {
	return e.replace(new RegExp(Hi(t), "g"), n);
}
function Wi(e, t) {
	let n = "", r = 0, i = -1, a = 0, o = -1;
	for (let s = 0; s <= e.length; ++s) {
		if (s < e.length) o = e.charCodeAt(s);
		else if (o === 47) break;
		else o = 47;
		if (o === 47) {
			if (i !== s - 1 && a !== 1) {
				if (i !== s - 1 && a === 2) {
					if (n.length < 2 || r !== 2 || n.charCodeAt(n.length - 1) !== 46 || n.charCodeAt(n.length - 2) !== 46) {
						if (n.length > 2) {
							let e = n.lastIndexOf("/");
							if (e !== n.length - 1) {
								e === -1 ? (n = "", r = 0) : (n = n.slice(0, e), r = n.length - 1 - n.lastIndexOf("/")), i = s, a = 0;
								continue;
							}
						} else if (n.length === 2 || n.length === 1) {
							n = "", r = 0, i = s, a = 0;
							continue;
						}
					}
					t && (n.length > 0 ? n += "/.." : n = "..", r = 2);
				} else n.length > 0 ? n += `/${e.slice(i + 1, s)}` : n = e.slice(i + 1, s), r = s - i - 1;
			}
			i = s, a = 0;
		} else o === 46 && a !== -1 ? ++a : a = -1;
	}
	return n;
}
var Gi, Ki = o((() => {
	W(), Gi = {
		toPosix(e) {
			return Ui(e, "\\", "/");
		},
		isUrl(e) {
			return /^https?:/.test(this.toPosix(e));
		},
		isDataUrl(e) {
			return /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z0-9-.!#$%*+.{}|~`]+=[a-z0-9-.!#$%*+.{}()_|~`]+)*)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s<>]*?)$/i.test(e);
		},
		isBlobUrl(e) {
			return e.startsWith("blob:");
		},
		hasProtocol(e) {
			return /^[^/:]+:/.test(this.toPosix(e));
		},
		getProtocol(e) {
			Bi(e), e = this.toPosix(e);
			let t = /^file:\/\/\//.exec(e);
			if (t) return t[0];
			let n = /^[^/:]+:\/{0,2}/.exec(e);
			return n ? n[0] : "";
		},
		toAbsolute(e, t, n) {
			if (Bi(e), this.isDataUrl(e) || this.isBlobUrl(e)) return e;
			let r = Vi(this.toPosix(t ?? U.get().getBaseUrl())), i = Vi(this.toPosix(n ?? this.rootname(r)));
			return e = this.toPosix(e), e.startsWith("/") ? Gi.join(i, e.slice(1)) : this.isAbsolute(e) ? e : this.join(r, e);
		},
		normalize(e) {
			if (Bi(e), e.length === 0) return ".";
			if (this.isDataUrl(e) || this.isBlobUrl(e)) return e;
			e = this.toPosix(e);
			let t = "", n = e.startsWith("/");
			this.hasProtocol(e) && (t = this.rootname(e), e = e.slice(t.length));
			let r = e.endsWith("/");
			return e = Wi(e, !1), e.length > 0 && r && (e += "/"), n ? `/${e}` : t + e;
		},
		isAbsolute(e) {
			return Bi(e), e = this.toPosix(e), this.hasProtocol(e) ? !0 : e.startsWith("/");
		},
		join(...e) {
			if (e.length === 0) return ".";
			let t;
			for (let n = 0; n < e.length; ++n) {
				let r = e[n];
				if (Bi(r), r.length > 0) {
					if (t === void 0) t = r;
					else {
						let i = e[n - 1] ?? "";
						this.joinExtensions.includes(this.extname(i).toLowerCase()) ? t += `/../${r}` : t += `/${r}`;
					}
				}
			}
			return t === void 0 ? "." : this.normalize(t);
		},
		dirname(e) {
			if (Bi(e), e.length === 0) return ".";
			e = this.toPosix(e);
			let t = e.charCodeAt(0), n = t === 47, r = -1, i = !0, a = this.getProtocol(e), o = e;
			e = e.slice(a.length);
			for (let n = e.length - 1; n >= 1; --n) if (t = e.charCodeAt(n), t === 47) {
				if (!i) {
					r = n;
					break;
				}
			} else i = !1;
			return r === -1 ? n ? "/" : this.isUrl(o) ? a + e : a : n && r === 1 ? "//" : a + e.slice(0, r);
		},
		rootname(e) {
			Bi(e), e = this.toPosix(e);
			let t = "";
			if (t = e.startsWith("/") ? "/" : this.getProtocol(e), this.isUrl(e)) {
				let n = e.indexOf("/", t.length);
				t = n === -1 ? e : e.slice(0, n), t.endsWith("/") || (t += "/");
			}
			return t;
		},
		basename(e, t) {
			Bi(e), t && Bi(t), e = Vi(this.toPosix(e));
			let n = 0, r = -1, i = !0, a;
			if (t !== void 0 && t.length > 0 && t.length <= e.length) {
				if (t.length === e.length && t === e) return "";
				let o = t.length - 1, s = -1;
				for (a = e.length - 1; a >= 0; --a) {
					let c = e.charCodeAt(a);
					if (c === 47) {
						if (!i) {
							n = a + 1;
							break;
						}
					} else s === -1 && (i = !1, s = a + 1), o >= 0 && (c === t.charCodeAt(o) ? --o === -1 && (r = a) : (o = -1, r = s));
				}
				return n === r ? r = s : r === -1 && (r = e.length), e.slice(n, r);
			}
			for (a = e.length - 1; a >= 0; --a) if (e.charCodeAt(a) === 47) {
				if (!i) {
					n = a + 1;
					break;
				}
			} else r === -1 && (i = !1, r = a + 1);
			return r === -1 ? "" : e.slice(n, r);
		},
		extname(e) {
			Bi(e), e = Vi(this.toPosix(e));
			let t = -1, n = 0, r = -1, i = !0, a = 0;
			for (let o = e.length - 1; o >= 0; --o) {
				let s = e.charCodeAt(o);
				if (s === 47) {
					if (!i) {
						n = o + 1;
						break;
					}
				} else r === -1 && (i = !1, r = o + 1), s === 46 ? t === -1 ? t = o : a !== 1 && (a = 1) : t !== -1 && (a = -1);
			}
			return t === -1 || r === -1 || a === 0 || a === 1 && t === r - 1 && t === n + 1 ? "" : e.slice(t, r);
		},
		parse(e) {
			Bi(e);
			let t = {
				root: "",
				dir: "",
				base: "",
				ext: "",
				name: ""
			};
			if (e.length === 0) return t;
			e = Vi(this.toPosix(e));
			let n = e.charCodeAt(0), r = this.isAbsolute(e), i;
			t.root = this.rootname(e), i = r || this.hasProtocol(e) ? 1 : 0;
			let a = -1, o = 0, s = -1, c = !0, l = e.length - 1, u = 0;
			for (; l >= i; --l) if (n = e.charCodeAt(l), n === 47) {
				if (!c) {
					o = l + 1;
					break;
				}
			} else s === -1 && (c = !1, s = l + 1), n === 46 ? a === -1 ? a = l : u !== 1 && (u = 1) : a !== -1 && (u = -1);
			return a === -1 || s === -1 || u === 0 || u === 1 && a === s - 1 && a === o + 1 ? s !== -1 && (t.base = t.name = o === 0 && r ? e.slice(1, s) : e.slice(o, s)) : (o === 0 && r ? (t.name = e.slice(1, a), t.base = e.slice(1, s)) : (t.name = e.slice(o, a), t.base = e.slice(o, s)), t.ext = e.slice(a, s)), t.dir = this.dirname(e), t;
		},
		sep: "/",
		delimiter: ":",
		joinExtensions: [".html"]
	};
})), qi, Ji = o((() => {
	qi = (e, t, n = !1) => (Array.isArray(e) || (e = [e]), t ? e.map((e) => typeof e == "string" || n ? t(e) : e) : e);
}));
// node_modules/pixi.js/lib/assets/utils/createStringVariations.mjs
function Yi(e, t, n, r, i) {
	let a = t[n];
	for (let o = 0; o < a.length; o++) {
		let s = a[o];
		n < t.length - 1 ? Yi(e.replace(r[n], s), t, n + 1, r, i) : i.push(e.replace(r[n], s));
	}
}
function Xi(e) {
	let t = e.match(/\{(.*?)\}/g), n = [];
	if (t) {
		let r = [];
		t.forEach((e) => {
			let t = e.substring(1, e.length - 1).split(",");
			r.push(t);
		}), Yi(e, r, 0, t, n);
	} else n.push(e);
	return n;
}
var Zi = o((() => {})), Qi, $i = o((() => {
	Qi = (e) => !Array.isArray(e);
}));
// node_modules/pixi.js/lib/assets/resolver/Resolver.mjs
function ea(e) {
	return e.split(".").pop().split("?").shift().split("#").shift();
}
var ta, na = o((() => {
	L(), Ki(), Ji(), Zi(), $i(), ta = class {
		constructor() {
			this._defaultBundleIdentifierOptions = {
				connector: "-",
				createBundleAssetId: (e, t) => `${e}${this._bundleIdConnector}${t}`,
				extractAssetIdFromBundle: (e, t) => t.replace(`${e}${this._bundleIdConnector}`, "")
			}, this._bundleIdConnector = this._defaultBundleIdentifierOptions.connector, this._createBundleAssetId = this._defaultBundleIdentifierOptions.createBundleAssetId, this._extractAssetIdFromBundle = this._defaultBundleIdentifierOptions.extractAssetIdFromBundle, this._assetMap = {}, this._preferredOrder = [], this._parsers = [], this._resolverHash = {}, this._bundles = {};
		}
		setBundleIdentifier(e) {
			if (this._bundleIdConnector = e.connector ?? this._bundleIdConnector, this._createBundleAssetId = e.createBundleAssetId ?? this._createBundleAssetId, this._extractAssetIdFromBundle = e.extractAssetIdFromBundle ?? this._extractAssetIdFromBundle, this._extractAssetIdFromBundle("foo", this._createBundleAssetId("foo", "bar")) !== "bar") throw Error("[Resolver] GenerateBundleAssetId are not working correctly");
		}
		prefer(...e) {
			e.forEach((e) => {
				this._preferredOrder.push(e), e.priority ||= Object.keys(e.params);
			}), this._resolverHash = {};
		}
		set basePath(e) {
			this._basePath = e;
		}
		get basePath() {
			return this._basePath;
		}
		set rootPath(e) {
			this._rootPath = e;
		}
		get rootPath() {
			return this._rootPath;
		}
		get parsers() {
			return this._parsers;
		}
		reset() {
			this.setBundleIdentifier(this._defaultBundleIdentifierOptions), this._assetMap = {}, this._preferredOrder = [], this._resolverHash = {}, this._rootPath = null, this._basePath = null, this._manifest = null, this._bundles = {}, this._defaultSearchParams = null;
		}
		setDefaultSearchParams(e) {
			if (typeof e == "string") this._defaultSearchParams = e;
			else {
				let t = e;
				this._defaultSearchParams = Object.keys(t).map((e) => `${encodeURIComponent(e)}=${encodeURIComponent(t[e])}`).join("&");
			}
		}
		getAlias(e) {
			let { alias: t, src: n } = e;
			return qi(t || n, (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => e?.src ?? e) : e?.src ? e.src : e, !0);
		}
		removeAlias(e, t) {
			this._assetMap[e] && (t && t !== this._resolverHash[e] || (delete this._resolverHash[e], delete this._assetMap[e]));
		}
		addManifest(e) {
			this._manifest && I("[Resolver] Manifest already exists, this will be overwritten"), this._manifest = e, e.bundles.forEach((e) => {
				this.addBundle(e.name, e.assets);
			});
		}
		addBundle(e, t) {
			let n = [], r = t;
			Array.isArray(t) || (r = Object.entries(t).map(([e, t]) => typeof t == "string" || Array.isArray(t) ? {
				alias: e,
				src: t
			} : {
				alias: e,
				...t
			})), r.forEach((t) => {
				let r = t.src, i = t.alias, a;
				if (typeof i == "string") {
					let t = this._createBundleAssetId(e, i);
					n.push(t), a = [i, t];
				} else {
					let t = i.map((t) => this._createBundleAssetId(e, t));
					n.push(...t), a = [...i, ...t];
				}
				this.add({
					...t,
					alias: a,
					src: r
				});
			}), this._bundles[e] = n;
		}
		add(e) {
			let t = [];
			Array.isArray(e) ? t.push(...e) : t.push(e);
			let n = (e) => {
				this.hasKey(e) && I(`[Resolver] already has key: ${e} overwriting`);
			};
			qi(t).forEach((e) => {
				let { src: t } = e, { data: r, format: i, loadParser: a, parser: o } = e, s = qi(t).map((e) => typeof e == "string" ? Xi(e) : Array.isArray(e) ? e : [e]), c = this.getAlias(e);
				Array.isArray(c) ? c.forEach(n) : n(c);
				let l = [], u = (e) => ({
					src: e,
					...this._parsers.find((t) => t.test(e))?.parse(e)
				});
				s.forEach((t) => {
					t.forEach((t) => {
						let n = {};
						if (typeof t == "object" ? (r = t.data ?? r, i = t.format ?? i, (t.loadParser || t.parser) && (a = t.loadParser ?? a, o = t.parser ?? o), n = {
							...u(t.src),
							...t
						}) : n = u(t), !c) throw Error(`[Resolver] alias is undefined for this asset: ${n.src}`);
						n = this._buildResolvedAsset(n, {
							aliases: c,
							data: r,
							format: i,
							loadParser: a,
							parser: o,
							progressSize: e.progressSize
						}), l.push(n);
					});
				}), c.forEach((e) => {
					this._assetMap[e] = l;
				});
			});
		}
		resolveBundle(e) {
			let t = Qi(e);
			e = qi(e);
			let n = {};
			return e.forEach((e) => {
				let t = this._bundles[e];
				if (t) {
					let r = this.resolve(t), i = {};
					for (let t in r) {
						let n = r[t];
						i[this._extractAssetIdFromBundle(e, t)] = n;
					}
					n[e] = i;
				}
			}), t ? n[e[0]] : n;
		}
		resolveUrl(e) {
			let t = this.resolve(e);
			if (typeof e != "string") {
				let e = {};
				for (let n in t) e[n] = t[n].src;
				return e;
			}
			return t.src;
		}
		resolve(e) {
			let t = Qi(e);
			e = qi(e);
			let n = {};
			return e.forEach((e) => {
				if (!this._resolverHash[e]) {
					if (this._assetMap[e]) {
						let t = this._assetMap[e], n = this._getPreferredOrder(t);
						n?.priority.forEach((e) => {
							n.params[e].forEach((n) => {
								let r = t.filter((t) => t[e] ? t[e] === n : !1);
								r.length && (t = r);
							});
						}), this._resolverHash[e] = t[0];
					} else this._resolverHash[e] = this._buildResolvedAsset({
						alias: [e],
						src: e
					}, {});
				}
				n[e] = this._resolverHash[e];
			}), t ? n[e[0]] : n;
		}
		hasKey(e) {
			return !!this._assetMap[e];
		}
		hasBundle(e) {
			return !!this._bundles[e];
		}
		_getPreferredOrder(e) {
			for (let t = 0; t < e.length; t++) {
				let n = e[t], r = this._preferredOrder.find((e) => e.params.format.includes(n.format));
				if (r) return r;
			}
			return this._preferredOrder[0];
		}
		_appendDefaultSearchParams(e) {
			return this._defaultSearchParams ? `${e}${/\?/.test(e) ? "&" : "?"}${this._defaultSearchParams}` : e;
		}
		_buildResolvedAsset(e, t) {
			let { aliases: n, data: r, loadParser: i, parser: a, format: o, progressSize: s } = t;
			return (this._basePath || this._rootPath) && (e.src = Gi.toAbsolute(e.src, this._basePath, this._rootPath)), e.alias = n ?? e.alias ?? [e.src], e.src = this._appendDefaultSearchParams(e.src), e.data = {
				...r || {},
				...e.data
			}, e.loadParser = i ?? e.loadParser, e.parser = a ?? e.parser, e.format = o ?? e.format ?? ea(e.src), s !== void 0 && (e.progressSize = s), e;
		}
	}, ta.RETINA_PREFIX = /@([0-9\.]+)x/;
})), ra, ia = o((() => {
	ra = (e, t) => {
		let n = t.split("?")[1];
		return n && (e += `?${n}`), e;
	};
})), aa, oa, sa = o((() => {
	wt(), wn(), V(), aa = class e {
		constructor(e, t) {
			this.linkedSheets = [];
			let n = e;
			e?.source instanceof Cn && (n = {
				texture: e,
				data: t
			});
			let { texture: r, data: i, cachePrefix: a = "" } = n;
			this.cachePrefix = a, this._texture = r instanceof B ? r : null, this.textureSource = r.source, this.textures = {}, this.animations = {}, this.data = i;
			let o = parseFloat(i.meta.scale);
			o ? (this.resolution = o, r.source.resolution = this.resolution) : this.resolution = r.source._resolution, this._frames = this.data.frames, this._frameKeys = Object.keys(this._frames), this._batchIndex = 0, this._callback = null;
		}
		parse() {
			return new Promise((t) => {
				this._callback = t, this._batchIndex = 0, this._frameKeys.length <= e.BATCH_SIZE ? (this._processFrames(0), this._processAnimations(), this._parseComplete()) : this._nextBatch();
			});
		}
		parseSync() {
			return this._processFrames(0, !0), this._processAnimations(), this.textures;
		}
		_processFrames(t, n = !1) {
			let r = t, i = n ? Infinity : e.BATCH_SIZE;
			for (; r - t < i && r < this._frameKeys.length;) {
				let e = this._frameKeys[r], t = this._frames[e], n = t.frame;
				if (n) {
					let r = null, i = null, a = t.trimmed !== !1 && t.sourceSize ? t.sourceSize : t.frame, o = new R(0, 0, Math.floor(a.w) / this.resolution, Math.floor(a.h) / this.resolution);
					r = t.rotated ? new R(Math.floor(n.x) / this.resolution, Math.floor(n.y) / this.resolution, Math.floor(n.h) / this.resolution, Math.floor(n.w) / this.resolution) : new R(Math.floor(n.x) / this.resolution, Math.floor(n.y) / this.resolution, Math.floor(n.w) / this.resolution, Math.floor(n.h) / this.resolution), t.trimmed !== !1 && t.spriteSourceSize && (i = new R(Math.floor(t.spriteSourceSize.x) / this.resolution, Math.floor(t.spriteSourceSize.y) / this.resolution, Math.floor(n.w) / this.resolution, Math.floor(n.h) / this.resolution)), this.textures[e] = new B({
						source: this.textureSource,
						frame: r,
						orig: o,
						trim: i,
						rotate: t.rotated ? 2 : 0,
						defaultAnchor: t.anchor,
						defaultBorders: t.borders,
						label: e.toString()
					});
				}
				r++;
			}
		}
		_processAnimations() {
			let e = this.data.animations || {};
			for (let t in e) {
				this.animations[t] = [];
				for (let n = 0; n < e[t].length; n++) {
					let r = e[t][n];
					this.animations[t].push(this.textures[r]);
				}
			}
		}
		_parseComplete() {
			let e = this._callback;
			this._callback = null, this._batchIndex = 0, e.call(this, this.textures);
		}
		_nextBatch() {
			this._processFrames(this._batchIndex * e.BATCH_SIZE), this._batchIndex++, setTimeout(() => {
				this._batchIndex * e.BATCH_SIZE < this._frameKeys.length ? this._nextBatch() : (this._processAnimations(), this._parseComplete());
			}, 0);
		}
		destroy(e = !1) {
			for (let e in this.textures) this.textures[e].destroy();
			this._frames = null, this._frameKeys = null, this.data = null, this.textures = null, e && (this._texture?.destroy(), this.textureSource.destroy()), this._texture = null, this.textureSource = null, this.linkedSheets = [];
		}
	}, aa.BATCH_SIZE = 1e3, oa = aa;
}));
// node_modules/pixi.js/lib/spritesheet/spritesheetAsset.mjs
function ca(e, t, n) {
	let r = {};
	if (e.forEach((e) => {
		r[e] = t;
	}), Object.keys(t.textures).forEach((e) => {
		r[`${t.cachePrefix}${e}`] = t.textures[e];
	}), !n) {
		let n = Gi.dirname(e[0]);
		t.linkedSheets.forEach((e, i) => {
			let a = ca([`${n}/${t.data.meta.related_multi_packs[i]}`], e, !0);
			Object.assign(r, a);
		});
	}
	return r;
}
var la, ua, da = o((() => {
	Ii(), na(), ia(), h(), V(), Ki(), sa(), la = [
		"jpg",
		"png",
		"jpeg",
		"avif",
		"webp",
		"basis",
		"etc2",
		"bc7",
		"bc6h",
		"bc5",
		"bc4",
		"bc3",
		"bc2",
		"bc1",
		"eac",
		"astc"
	], ua = {
		extension: d.Asset,
		cache: {
			test: (e) => e instanceof oa,
			getCacheableAssets: (e, t) => ca(e, t, !1)
		},
		resolver: {
			extension: {
				type: d.ResolveParser,
				name: "resolveSpritesheet"
			},
			test: (e) => {
				let t = e.split("?")[0].split("."), n = t.pop(), r = t.pop();
				return n === "json" && la.includes(r);
			},
			parse: (e) => {
				let t = e.split(".");
				return {
					resolution: parseFloat(ta.RETINA_PREFIX.exec(e)?.[1] ?? "1"),
					format: t[t.length - 2],
					src: e
				};
			}
		},
		loader: {
			name: "spritesheetLoader",
			id: "spritesheet",
			extension: {
				type: d.LoadParser,
				priority: Fi.Normal,
				name: "spritesheetLoader"
			},
			async testParse(e, t) {
				return Gi.extname(t.src).toLowerCase() === ".json" && !!e.frames;
			},
			async parse(e, t, n) {
				let { texture: r, imageFilename: i, textureOptions: a, cachePrefix: o } = t?.data ?? {}, s = Gi.dirname(t.src);
				s && s.lastIndexOf("/") !== s.length - 1 && (s += "/");
				let c;
				if (r instanceof B) c = r;
				else {
					let r = ra(s + (i ?? e.meta.image), t.src);
					c = (await n.load([{
						src: r,
						data: a
					}]))[r];
				}
				let l = new oa({
					texture: c.source,
					data: e,
					cachePrefix: o
				});
				await l.parse();
				let u = e?.meta?.related_multi_packs;
				if (Array.isArray(u)) {
					let e = [];
					for (let r of u) {
						if (typeof r != "string") continue;
						let i = s + r;
						t.data?.ignoreMultiPack || (i = ra(i, t.src), e.push(n.load({
							src: i,
							data: {
								textureOptions: a,
								ignoreMultiPack: !0
							}
						})));
					}
					let r = await Promise.all(e);
					l.linkedSheets = r, r.forEach((e) => {
						e.linkedSheets = [l].concat(l.linkedSheets.filter((t) => t !== e));
					});
				}
				return l;
			},
			async unload(e, t, n) {
				await n.unload(e.textureSource._sourceOrigin), e.destroy(!1);
			}
		}
	};
})), fa = o((() => {
	h(), da(), m.add(ua);
}));
// node_modules/pixi.js/lib/utils/data/updateQuadBounds.mjs
function pa(e, t, n) {
	let { width: r, height: i } = n.orig, a = n.trim;
	if (a) {
		let n = a.width, o = a.height;
		e.minX = a.x - t._x * r, e.maxX = e.minX + n, e.minY = a.y - t._y * i, e.maxY = e.minY + o;
	} else e.minX = -t._x * r, e.maxX = e.minX + r, e.minY = -t._y * i, e.maxY = e.minY + i;
}
var ma = o((() => {})), ha, ga = o((() => {
	He(), V(), ma(), Xe(), li(), ha = class e extends ci {
		constructor(e = B.EMPTY) {
			e instanceof B && (e = { texture: e });
			let { texture: t = B.EMPTY, anchor: n, roundPixels: r, width: i, height: a, ...o } = e;
			super({
				label: "Sprite",
				...o
			}), this.renderPipeId = "sprite", this.batched = !0, this._visualBounds = {
				minX: 0,
				maxX: 1,
				minY: 0,
				maxY: 0
			}, this._anchor = new Ve({ _onUpdate: () => {
				this.onViewUpdate();
			} }), n ? this.anchor = n : t.defaultAnchor && (this.anchor = t.defaultAnchor), this.texture = t, this.allowChildren = !1, this.roundPixels = r ?? !1, i !== void 0 && (this.width = i), a !== void 0 && (this.height = a);
		}
		static from(t, n = !1) {
			return t instanceof B ? new e(t) : new e(B.from(t, n));
		}
		set texture(e) {
			e ||= B.EMPTY;
			let t = this._texture;
			t !== e && (t && t.dynamic && t.off("update", this.onViewUpdate, this), e.dynamic && e.on("update", this.onViewUpdate, this), this._texture = e, this._width && this._setWidth(this._width, this._texture.orig.width), this._height && this._setHeight(this._height, this._texture.orig.height), this.onViewUpdate());
		}
		get texture() {
			return this._texture;
		}
		get visualBounds() {
			return pa(this._visualBounds, this._anchor, this._texture), this._visualBounds;
		}
		get sourceBounds() {
			return F("8.6.1", "Sprite.sourceBounds is deprecated, use visualBounds instead."), this.visualBounds;
		}
		updateBounds() {
			let e = this._anchor, t = this._texture, n = this._bounds, { width: r, height: i } = t.orig;
			n.minX = -e._x * r, n.maxX = n.minX + r, n.minY = -e._y * i, n.maxY = n.minY + i;
		}
		destroy(e = !1) {
			if (super.destroy(e), typeof e == "boolean" ? e : e?.texture) {
				let t = typeof e == "boolean" ? e : e?.textureSource;
				this._texture.destroy(t);
			}
			this._texture = null, this._visualBounds = null, this._bounds = null, this._anchor = null;
		}
		get anchor() {
			return this._anchor;
		}
		set anchor(e) {
			typeof e == "number" ? this._anchor.set(e) : this._anchor.copyFrom(e);
		}
		get width() {
			return Math.abs(this.scale.x) * this._texture.orig.width;
		}
		set width(e) {
			this._setWidth(e, this._texture.orig.width), this._width = e;
		}
		get height() {
			return Math.abs(this.scale.y) * this._texture.orig.height;
		}
		set height(e) {
			this._setHeight(e, this._texture.orig.height), this._height = e;
		}
		getSize(e) {
			return e ||= {}, e.width = Math.abs(this.scale.x) * this._texture.orig.width, e.height = Math.abs(this.scale.y) * this._texture.orig.height, e;
		}
		setSize(e, t) {
			typeof e == "object" ? (t = e.height ?? e.width, e = e.width) : t ??= e, e !== void 0 && this._setWidth(e, this._texture.orig.width), t !== void 0 && this._setHeight(t, this._texture.orig.height);
		}
	};
}));
// node_modules/pixi.js/lib/rendering/mask/utils/addMaskBounds.mjs
function _a(e, t, n) {
	let r = va;
	e.measurable = !0, Pt(e, n, r), t.addBoundsMask(r), e.measurable = !1;
}
var va, ya = o((() => {
	Dt(), Lt(), va = new Et();
}));
// node_modules/pixi.js/lib/rendering/mask/utils/addMaskLocalBounds.mjs
function ba(e, t, n) {
	let r = kt.get();
	e.measurable = !0;
	let i = Ot.get().identity();
	Kt(e, r, xa(e, n, i)), e.measurable = !1, t.addBoundsMask(r), Ot.return(i), kt.return(r);
}
function xa(e, t, n) {
	return e ? (e !== t && (xa(e.parent, t, n), e.updateLocalTransform(), n.append(e.localTransform)), n) : (I("Mask bounds, renderable is not inside the root container"), n);
}
var Sa = o((() => {
	Jt(), At(), L();
})), Ca, wa = o((() => {
	h(), ga(), ya(), Sa(), Ca = class {
		constructor(e) {
			this.priority = 0, this.inverse = !1, this.channel = "red", this.pipe = "alphaMask", e?.mask && this.init(e.mask);
		}
		init(e) {
			this.mask = e, this.renderMaskToTexture = !(e instanceof ha), this.mask.renderable = this.renderMaskToTexture, this.mask.includeInBuild = !this.renderMaskToTexture, this.mask.measurable = !1;
		}
		reset() {
			this.mask !== null && (this.mask.measurable = !0, this.mask = null);
		}
		addBounds(e, t) {
			this.inverse || _a(this.mask, e, t);
		}
		addLocalBounds(e, t) {
			ba(this.mask, e, t);
		}
		containsPoint(e, t) {
			let n = this.mask;
			return t(n, e);
		}
		destroy() {
			this.reset();
		}
		static test(e) {
			return e instanceof ha;
		}
	}, Ca.extension = d.MaskEffect;
})), Ta, Ea = o((() => {
	h(), Ta = class {
		constructor(e) {
			this.priority = 0, this.pipe = "colorMask", e?.mask && this.init(e.mask);
		}
		init(e) {
			this.mask = e;
		}
		destroy() {}
		static test(e) {
			return typeof e == "number";
		}
	}, Ta.extension = d.MaskEffect;
})), Da, Oa = o((() => {
	h(), dr(), ya(), Sa(), Da = class {
		constructor(e) {
			this.priority = 0, this.pipe = "stencilMask", e?.mask && this.init(e.mask);
		}
		init(e) {
			this.mask = e, this.mask.includeInBuild = !1, this.mask.measurable = !1;
		}
		reset() {
			this.mask !== null && (this.mask.measurable = !0, this.mask.includeInBuild = !0, this.mask = null);
		}
		addBounds(e, t) {
			_a(this.mask, e, t);
		}
		addLocalBounds(e, t) {
			ba(this.mask, e, t);
		}
		containsPoint(e, t) {
			let n = this.mask;
			return t(n, e);
		}
		destroy() {
			this.reset();
		}
		static test(e) {
			return e instanceof H;
		}
	}, Da.extension = d.MaskEffect;
})), ka, Aa = o((() => {
	W(), h(), wn(), ka = class extends Cn {
		constructor(e) {
			e.resource ||= U.get().createCanvas(), e.width || (e.width = e.resource.width, e.autoDensity || (e.width /= e.resolution)), e.height || (e.height = e.resource.height, e.autoDensity || (e.height /= e.resolution)), super(e), this.uploadMethodId = "image", this.autoDensity = e.autoDensity, this.resizeCanvas(), this.transparent = !!e.transparent;
		}
		resizeCanvas() {
			this.autoDensity && "style" in this.resource && (this.resource.style.width = `${this.width}px`, this.resource.style.height = `${this.height}px`), (this.resource.width !== this.pixelWidth || this.resource.height !== this.pixelHeight) && (this.resource.width = this.pixelWidth, this.resource.height = this.pixelHeight);
		}
		resize(e = this.width, t = this.height, n = this._resolution) {
			let r = super.resize(e, t, n);
			return r && this.resizeCanvas(), r;
		}
		static test(e) {
			return globalThis.HTMLCanvasElement && e instanceof HTMLCanvasElement || globalThis.OffscreenCanvas && e instanceof OffscreenCanvas;
		}
		get context2D() {
			return this._context2D ||= this.resource.getContext("2d");
		}
	}, ka.extension = d.TextureSource;
})), ja, Ma = o((() => {
	h(), wn(), ja = class extends Cn {
		constructor(e) {
			super(e), this.uploadMethodId = "image", this.autoGarbageCollect = !0;
		}
		static test(e) {
			return globalThis.HTMLImageElement && e instanceof HTMLImageElement || typeof ImageBitmap < "u" && e instanceof ImageBitmap || globalThis.VideoFrame && e instanceof VideoFrame;
		}
	}, ja.extension = d.TextureSource;
}));
// node_modules/pixi.js/lib/utils/browser/detectVideoAlphaMode.mjs
async function Na() {
	return Pa ??= (async () => {
		let e = U.get().createCanvas(1, 1).getContext("webgl");
		if (!e) return "premultiply-alpha-on-upload";
		let t = await new Promise((e) => {
			let t = document.createElement("video");
			t.onloadeddata = () => e(t), t.onerror = () => e(null), t.autoplay = !1, t.crossOrigin = "anonymous", t.preload = "auto", t.src = "data:video/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQJChYECGFOAZwEAAAAAAAHTEU2bdLpNu4tTq4QVSalmU6yBoU27i1OrhBZUrmtTrIHGTbuMU6uEElTDZ1OsggEXTbuMU6uEHFO7a1OsggG97AEAAAAAAABZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmoCrXsYMPQkBNgIRMYXZmV0GETGF2ZkSJiEBEAAAAAAAAFlSua8yuAQAAAAAAAEPXgQFzxYgAAAAAAAAAAZyBACK1nIN1bmSIgQCGhVZfVlA5g4EBI+ODhAJiWgDglLCBArqBApqBAlPAgQFVsIRVuYEBElTDZ9Vzc9JjwItjxYgAAAAAAAAAAWfInEWjh0VOQ09ERVJEh49MYXZjIGxpYnZweC12cDlnyKJFo4hEVVJBVElPTkSHlDAwOjAwOjAwLjA0MDAwMDAwMAAAH0O2dcfngQCgwqGggQAAAIJJg0IAABAAFgA4JBwYSgAAICAAEb///4r+AAB1oZ2mm+6BAaWWgkmDQgAAEAAWADgkHBhKAAAgIABIQBxTu2uRu4+zgQC3iveBAfGCAXHwgQM=", t.load();
		});
		if (!t) return "premultiply-alpha-on-upload";
		let n = e.createTexture();
		e.bindTexture(e.TEXTURE_2D, n);
		let r = e.createFramebuffer();
		e.bindFramebuffer(e.FRAMEBUFFER, r), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, n, 0), e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL, e.NONE), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, t);
		let i = /* @__PURE__ */ new Uint8Array(4);
		return e.readPixels(0, 0, 1, 1, e.RGBA, e.UNSIGNED_BYTE, i), e.deleteFramebuffer(r), e.deleteTexture(n), e.getExtension("WEBGL_lose_context")?.loseContext(), i[0] <= i[3] ? "premultiplied-alpha" : "premultiply-alpha-on-upload";
	})(), Pa;
}
var Pa, Fa = o((() => {
	W();
})), Ia, La, Ra = o((() => {
	h(), vr(), Fa(), wn(), Ia = class e extends Cn {
		constructor(t) {
			super(t), this.isReady = !1, this.uploadMethodId = "video", t = {
				...e.defaultOptions,
				...t
			}, this._autoUpdate = !0, this._isConnectedToTicker = !1, this._updateFPS = t.updateFPS || 0, this._msToNextUpdate = 0, this.autoPlay = t.autoPlay !== !1, this.alphaMode = t.alphaMode ?? "premultiply-alpha-on-upload", this._videoFrameRequestCallback = this._videoFrameRequestCallback.bind(this), this._videoFrameRequestCallbackHandle = null, this._load = null, this._resolve = null, this._reject = null, this._onCanPlay = this._onCanPlay.bind(this), this._onCanPlayThrough = this._onCanPlayThrough.bind(this), this._onError = this._onError.bind(this), this._onPlayStart = this._onPlayStart.bind(this), this._onPlayStop = this._onPlayStop.bind(this), this._onSeeked = this._onSeeked.bind(this), this._onLoadedMetadata = this._onLoadedMetadata.bind(this), t.autoLoad !== !1 && this.load();
		}
		updateFrame() {
			if (!this.destroyed) {
				if (this._updateFPS) {
					let e = _r.shared.elapsedMS * this.resource.playbackRate;
					this._msToNextUpdate = Math.floor(this._msToNextUpdate - e);
				}
				(!this._updateFPS || this._msToNextUpdate <= 0) && (this._msToNextUpdate = this._updateFPS ? Math.floor(1e3 / this._updateFPS) : 0), this.isValid && this.update();
			}
		}
		_videoFrameRequestCallback() {
			this.updateFrame(), this._videoFrameRequestCallbackHandle = this.destroyed ? null : this.resource.requestVideoFrameCallback(this._videoFrameRequestCallback);
		}
		get isValid() {
			return !!this.resource.videoWidth && !!this.resource.videoHeight;
		}
		async load() {
			if (this._load) return this._load;
			let e = this.resource, t = this.options;
			return (e.readyState === e.HAVE_ENOUGH_DATA || e.readyState === e.HAVE_FUTURE_DATA) && e.width && e.height && (e.complete = !0), e.addEventListener("play", this._onPlayStart), e.addEventListener("pause", this._onPlayStop), e.addEventListener("seeked", this._onSeeked), this._isSourceReady() ? this._mediaReady() : (t.preload || e.addEventListener("canplay", this._onCanPlay), e.addEventListener("canplaythrough", this._onCanPlayThrough), e.addEventListener("error", this._onError, !0)), this.isValid || e.addEventListener("loadedmetadata", this._onLoadedMetadata), this.alphaMode = await Na(), this._load = new Promise((n, r) => {
				this.isValid ? n(this) : (this._resolve = n, this._reject = r, t.preloadTimeoutMs !== void 0 && (this._preloadTimeout = setTimeout(() => {
					this._onError(new ErrorEvent(`Preload exceeded timeout of ${t.preloadTimeoutMs}ms`));
				})), e.load());
			}), this._load;
		}
		_onError(e) {
			this.resource.removeEventListener("error", this._onError, !0), this.emit("error", e), this._reject && (this._reject(e), this._reject = null, this._resolve = null);
		}
		_isSourcePlaying() {
			let e = this.resource;
			return !e.paused && !e.ended;
		}
		_isSourceReady() {
			return this.resource.readyState > 2;
		}
		_onPlayStart() {
			this._configureAutoUpdate();
		}
		_onPlayStop() {
			this._configureAutoUpdate();
		}
		_onSeeked() {
			this._autoUpdate && !this._isSourcePlaying() && (this._msToNextUpdate = 0, this.updateFrame(), this._msToNextUpdate = 0);
		}
		_onLoadedMetadata() {
			this.isValid && this._mediaReady();
		}
		_onCanPlay() {
			this.resource.removeEventListener("canplay", this._onCanPlay), this._mediaReady();
		}
		_onCanPlayThrough() {
			this.resource.removeEventListener("canplaythrough", this._onCanPlayThrough), this._preloadTimeout &&= (clearTimeout(this._preloadTimeout), void 0), this._mediaReady();
		}
		_mediaReady() {
			let e = this.resource;
			this.isValid && (this.isReady = !0, this.resize(e.videoWidth, e.videoHeight)), this._msToNextUpdate = 0, this.updateFrame(), this._msToNextUpdate = 0, this._resolve && this.isValid && (this._resolve(this), this._resolve = null, this._reject = null), this._isSourcePlaying() ? this._onPlayStart() : this.autoPlay && this.resource.play();
		}
		destroy() {
			this._configureAutoUpdate();
			let e = this.resource;
			e && (e.removeEventListener("play", this._onPlayStart), e.removeEventListener("pause", this._onPlayStop), e.removeEventListener("seeked", this._onSeeked), e.removeEventListener("canplay", this._onCanPlay), e.removeEventListener("canplaythrough", this._onCanPlayThrough), e.removeEventListener("loadedmetadata", this._onLoadedMetadata), e.removeEventListener("error", this._onError, !0), e.pause(), e.src = "", e.load()), super.destroy();
		}
		get autoUpdate() {
			return this._autoUpdate;
		}
		set autoUpdate(e) {
			e !== this._autoUpdate && (this._autoUpdate = e, this._configureAutoUpdate());
		}
		get updateFPS() {
			return this._updateFPS;
		}
		set updateFPS(e) {
			e !== this._updateFPS && (this._updateFPS = e, this._configureAutoUpdate());
		}
		_configureAutoUpdate() {
			this._autoUpdate && this._isSourcePlaying() ? !this._updateFPS && this.resource.requestVideoFrameCallback ? (this._isConnectedToTicker && (_r.shared.remove(this.updateFrame, this), this._isConnectedToTicker = !1, this._msToNextUpdate = 0), this._videoFrameRequestCallbackHandle === null && (this._videoFrameRequestCallbackHandle = this.resource.requestVideoFrameCallback(this._videoFrameRequestCallback))) : (this._videoFrameRequestCallbackHandle !== null && (this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker || (_r.shared.add(this.updateFrame, this), this._isConnectedToTicker = !0, this._msToNextUpdate = 0)) : (this._videoFrameRequestCallbackHandle !== null && (this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker && (_r.shared.remove(this.updateFrame, this), this._isConnectedToTicker = !1, this._msToNextUpdate = 0));
		}
		static test(e) {
			return globalThis.HTMLVideoElement && e instanceof HTMLVideoElement;
		}
	}, Ia.extension = d.TextureSource, Ia.defaultOptions = {
		...Cn.defaultOptions,
		autoLoad: !0,
		autoPlay: !0,
		updateFPS: 0,
		crossorigin: !0,
		loop: !1,
		muted: !0,
		playsinline: !0,
		preload: !1
	}, Ia.MIME_TYPES = {
		ogv: "video/ogg",
		mov: "video/quicktime",
		m4v: "video/mp4"
	}, La = Ia;
})), za, Ba, Va = o((() => {
	L(), Ji(), za = class {
		constructor() {
			this._parsers = [], this._cache = /* @__PURE__ */ new Map(), this._cacheMap = /* @__PURE__ */ new Map();
		}
		reset() {
			this._cacheMap.clear(), this._cache.clear();
		}
		has(e) {
			return this._cache.has(e);
		}
		get(e) {
			let t = this._cache.get(e);
			return t || I(`[Assets] Asset id ${e} was not found in the Cache`), t;
		}
		set(e, t) {
			let n = qi(e), r;
			for (let e = 0; e < this.parsers.length; e++) {
				let i = this.parsers[e];
				if (i.test(t)) {
					r = i.getCacheableAssets(n, t);
					break;
				}
			}
			let i = new Map(Object.entries(r || {}));
			r || n.forEach((e) => {
				i.set(e, t);
			});
			let a = [...i.keys()], o = {
				cacheKeys: a,
				keys: n
			};
			n.forEach((e) => {
				this._cacheMap.set(e, o);
			}), a.forEach((e) => {
				let n = r ? r[e] : t;
				this._cache.has(e) && this._cache.get(e) !== n && I("[Cache] already has key:", e), this._cache.set(e, i.get(e));
			});
		}
		remove(e) {
			if (!this._cacheMap.has(e)) {
				I(`[Assets] Asset id ${e} was not found in the Cache`);
				return;
			}
			let t = this._cacheMap.get(e);
			t.cacheKeys.forEach((e) => {
				this._cache.delete(e);
			}), t.keys.forEach((e) => {
				this._cacheMap.delete(e);
			});
		}
		get parsers() {
			return this._parsers;
		}
	}, Ba = new za();
}));
// node_modules/pixi.js/lib/rendering/renderers/shared/texture/utils/textureFrom.mjs
function Ha(e = {}) {
	let t = e && e.resource, n = t ? e.resource : e, r = t ? e : { resource: e };
	for (let e = 0; e < Ga.length; e++) {
		let t = Ga[e];
		if (t.test(n)) return new t(r);
	}
	throw Error(`Could not find a source type for resource: ${r.resource}`);
}
function Ua(e = {}, t = !1) {
	let n = e && e.resource, r = n ? e.resource : e, i = n ? e : { resource: e };
	if (!t && Ba.has(r)) return Ba.get(r);
	let a = new B({ source: Ha(i) });
	return a.on("destroy", () => {
		Ba.has(r) && Ba.remove(r);
	}), t || Ba.set(r, a), a;
}
function Wa(e, t = !1) {
	return typeof e == "string" ? Ba.get(e) : e instanceof Cn ? new B({ source: e }) : Ua(e, t);
}
var Ga, Ka = o((() => {
	Va(), h(), wn(), V(), Ga = [], m.handleByList(d.TextureSource, Ga), B.from = Wa, Cn.from = Ha;
})), qa = o((() => {
	h(), wa(), Ea(), Oa(), zn(), Aa(), Ma(), Ra(), Ka(), m.add(Ca, Ta, Da, La, ja, ka, Rn);
}));
// node_modules/pixi.js/lib/rendering/renderers/canvas/utils/canUseNewCanvasBlendModes.mjs
function Ja(e) {
	let t = U.get().createCanvas(6, 1), n = t.getContext("2d");
	return n.fillStyle = e, n.fillRect(0, 0, 6, 1), t;
}
function Ya() {
	if (Xa !== void 0) return Xa;
	try {
		let e = Ja("#ff00ff"), t = Ja("#ffff00"), n = U.get().createCanvas(6, 1).getContext("2d");
		n.globalCompositeOperation = "multiply", n.drawImage(e, 0, 0), n.drawImage(t, 2, 0);
		let r = n.getImageData(2, 0, 1, 1);
		if (!r) Xa = !1;
		else {
			let e = r.data;
			Xa = e[0] === 255 && e[1] === 0 && e[2] === 0;
		}
	} catch {
		Xa = !1;
	}
	return Xa;
}
var Xa, Za = o((() => {
	W();
})), G, Qa = o((() => {
	ke(), W(), Nn(), Za(), G = {
		canvas: null,
		convertTintToImage: !1,
		cacheStepsPerColorChannel: 8,
		_canUseMultiply: void 0,
		get canUseMultiply() {
			return this._canUseMultiply ??= Ya();
		},
		set canUseMultiply(e) {
			this._canUseMultiply = e;
		},
		_tintMethod: null,
		get tintMethod() {
			return this._tintMethod ??= this.canUseMultiply ? this.tintWithMultiply : this.tintWithPerPixel;
		},
		set tintMethod(e) {
			this._tintMethod = e;
		},
		_canvasSourceCache: /* @__PURE__ */ new WeakMap(),
		_unpremultipliedCache: /* @__PURE__ */ new WeakMap(),
		getCanvasSource: (e) => {
			let t = e.source, n = t?.resource;
			if (!n) return null;
			let r = t.alphaMode === "premultiplied-alpha", i = t.resourceWidth ?? t.pixelWidth, a = t.resourceHeight ?? t.pixelHeight, o = i !== t.pixelWidth || a !== t.pixelHeight;
			if (r) {
				if ((n instanceof HTMLCanvasElement || typeof OffscreenCanvas < "u" && n instanceof OffscreenCanvas) && !o) return n;
				let e = G._unpremultipliedCache.get(t);
				if (e?.resourceId === t._resourceId) return e.canvas;
			}
			if (n instanceof Uint8Array || n instanceof Uint8ClampedArray || n instanceof Int8Array || n instanceof Uint16Array || n instanceof Int16Array || n instanceof Uint32Array || n instanceof Int32Array || n instanceof Float32Array || n instanceof ArrayBuffer) {
				let e = G._canvasSourceCache.get(t);
				if (e?.resourceId === t._resourceId) return e.canvas;
				let r = U.get().createCanvas(t.pixelWidth, t.pixelHeight), i = r.getContext("2d"), a = i.createImageData(t.pixelWidth, t.pixelHeight), o = a.data, s = n instanceof ArrayBuffer ? new Uint8Array(n) : new Uint8Array(n.buffer, n.byteOffset, n.byteLength);
				if (t.format === "bgra8unorm") for (let e = 0; e < o.length && e + 3 < s.length; e += 4) o[e] = s[e + 2], o[e + 1] = s[e + 1], o[e + 2] = s[e], o[e + 3] = s[e + 3];
				else o.set(s.subarray(0, o.length));
				return i.putImageData(a, 0, 0), G._canvasSourceCache.set(t, {
					canvas: r,
					resourceId: t._resourceId
				}), r;
			}
			if (r) {
				let e = U.get().createCanvas(t.pixelWidth, t.pixelHeight), r = e.getContext("2d", { willReadFrequently: !0 });
				e.width = t.pixelWidth, e.height = t.pixelHeight, r.drawImage(n, 0, 0);
				let i = r.getImageData(0, 0, e.width, e.height), a = i.data;
				for (let e = 0; e < a.length; e += 4) {
					let t = a[e + 3];
					if (t > 0) {
						let n = 255 / t;
						a[e] = Math.min(255, a[e] * n + .5), a[e + 1] = Math.min(255, a[e + 1] * n + .5), a[e + 2] = Math.min(255, a[e + 2] * n + .5);
					}
				}
				return r.putImageData(i, 0, 0), G._unpremultipliedCache.set(t, {
					canvas: e,
					resourceId: t._resourceId
				}), e;
			}
			if (o) {
				let e = G._canvasSourceCache.get(t);
				if (e?.resourceId === t._resourceId) return e.canvas;
				let r = U.get().createCanvas(t.pixelWidth, t.pixelHeight), i = r.getContext("2d");
				return r.width = t.pixelWidth, r.height = t.pixelHeight, i.drawImage(n, 0, 0), G._canvasSourceCache.set(t, {
					canvas: r,
					resourceId: t._resourceId
				}), r;
			}
			return n;
		},
		getTintedCanvas: (e, t) => {
			let n = e.texture, r = A.shared.setValue(t).toHex(), i = n.tintCache ||= {}, a = i[r], o = n.source._resourceId;
			if (a?.tintId === o) return a;
			let s = a && "getContext" in a ? a : U.get().createCanvas();
			if (G.tintMethod(n, t, s), s.tintId = o, G.convertTintToImage && s.toDataURL !== void 0) {
				let e = U.get().createImage();
				e.src = s.toDataURL(), e.tintId = o, i[r] = e;
			} else i[r] = s;
			return i[r];
		},
		getTintedPattern: (e, t) => {
			let n = A.shared.setValue(t).toHex(), r = e.patternCache ||= {}, i = e.source._resourceId, a = r[n];
			return a?.tintId === i || (G.canvas || (G.canvas = U.get().createCanvas()), G.tintMethod(e, t, G.canvas), a = G.canvas.getContext("2d").createPattern(G.canvas, "repeat"), a.tintId = i, r[n] = a), a;
		},
		applyPatternTransform: (e, t, n = !0) => {
			if (!t) return;
			let r = e;
			if (!r.setTransform) return;
			let i = globalThis.DOMMatrix;
			if (!i) return;
			let a = new i([
				t.a,
				t.b,
				t.c,
				t.d,
				t.tx,
				t.ty
			]);
			r.setTransform(n ? a.inverse() : a);
		},
		tintWithMultiply: (e, t, n) => {
			let r = n.getContext("2d"), i = e.frame.clone(), a = e.source._resolution ?? e.source.resolution ?? 1, o = e.rotate;
			i.x *= a, i.y *= a, i.width *= a, i.height *= a;
			let s = z.isVertical(o), c = s ? i.height : i.width, l = s ? i.width : i.height;
			n.width = Math.ceil(c), n.height = Math.ceil(l), r.save(), t !== 16777215 && (r.fillStyle = A.shared.setValue(t).toHex(), r.fillRect(0, 0, c, l), r.globalCompositeOperation = "multiply");
			let u = G.getCanvasSource(e);
			u && (o && G._applyInverseRotation(r, o, i.width, i.height), r.drawImage(u, i.x, i.y, i.width, i.height, 0, 0, i.width, i.height), t !== 16777215 && (r.globalCompositeOperation = "destination-atop", r.drawImage(u, i.x, i.y, i.width, i.height, 0, 0, i.width, i.height))), r.restore();
		},
		tintWithOverlay: (e, t, n) => {
			let r = n.getContext("2d"), i = e.frame.clone(), a = e.source._resolution ?? e.source.resolution ?? 1, o = e.rotate;
			i.x *= a, i.y *= a, i.width *= a, i.height *= a;
			let s = z.isVertical(o), c = s ? i.height : i.width, l = s ? i.width : i.height;
			n.width = Math.ceil(c), n.height = Math.ceil(l), r.save(), r.globalCompositeOperation = "copy", r.fillStyle = A.shared.setValue(t).toHex(), r.fillRect(0, 0, c, l), r.globalCompositeOperation = "destination-atop";
			let u = G.getCanvasSource(e);
			u && (o && G._applyInverseRotation(r, o, i.width, i.height), r.drawImage(u, i.x, i.y, i.width, i.height, 0, 0, i.width, i.height)), r.restore();
		},
		tintWithPerPixel: (e, t, n) => {
			let r = n.getContext("2d"), i = e.frame.clone(), a = e.source._resolution ?? e.source.resolution ?? 1, o = e.rotate;
			i.x *= a, i.y *= a, i.width *= a, i.height *= a;
			let s = z.isVertical(o), c = s ? i.height : i.width, l = s ? i.width : i.height;
			n.width = Math.ceil(c), n.height = Math.ceil(l), r.save(), r.globalCompositeOperation = "copy";
			let u = G.getCanvasSource(e);
			if (!u) {
				r.restore();
				return;
			}
			o && G._applyInverseRotation(r, o, i.width, i.height), r.drawImage(u, i.x, i.y, i.width, i.height, 0, 0, i.width, i.height), r.restore();
			let d = t >> 16 & 255, f = t >> 8 & 255, p = t & 255, m = r.getImageData(0, 0, c, l), h = m.data;
			for (let e = 0; e < h.length; e += 4) h[e] = h[e] * d / 255, h[e + 1] = h[e + 1] * f / 255, h[e + 2] = h[e + 2] * p / 255;
			r.putImageData(m, 0, 0);
		},
		_applyInverseRotation: (e, t, n, r) => {
			let i = z.inv(t), a = z.uX(i), o = z.uY(i), s = z.vX(i), c = z.vY(i), l = -Math.min(0, a * n, s * r, a * n + s * r), u = -Math.min(0, o * n, c * r, o * n + c * r);
			e.transform(a, o, s, c, l, u);
		}
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/shared/texture/CanvasPool.mjs
function $a(e, t) {
	return (e << 17) + (t << 2);
}
var eo, to, no, ro = o((() => {
	W(), fn(), Xe(), L(), et(), Gn(), eo = 32767, to = class {
		constructor(e) {
			this._buckets = /* @__PURE__ */ new Map(), this._screens = new Wn(), this._enableFullScreen = !1, this.canvasOptions = e || {};
		}
		get enableFullScreen() {
			return F(qe, "CanvasPool.enableFullScreen is no longer used, the pool sizes canvases to the screens registered with setScreenSize."), this._enableFullScreen;
		}
		set enableFullScreen(e) {
			F(qe, "CanvasPool.enableFullScreen is no longer used, the pool sizes canvases to the screens registered with setScreenSize."), this._enableFullScreen = e;
		}
		_createCanvasAndContext(e, t) {
			let n = U.get().createCanvas();
			return n.width = e, n.height = t, {
				canvas: n,
				context: n.getContext("2d")
			};
		}
		getOptimalCanvasAndContext(e, t, n = 1) {
			let { width: r, height: i } = this.getOptimalSize(e, t, n);
			(r > eo || i > eo) && I(`CanvasPool: ${r}x${i} is larger than the ${eo}px pool key limit, canvases of this size may be pooled together`);
			let a = $a(r, i), o = this._buckets.get(a);
			o || (o = [], this._buckets.set(a, o));
			let s = o.pop();
			return s ||= this._createCanvasAndContext(r, i), s;
		}
		getOptimalSize(e, t, n = 1) {
			let r = Math.ceil(e * n - 1e-6), i = Math.ceil(t * n - 1e-6), a = un(r), o = this._screens.getFittingWidth(r), s = un(i), c = this._screens.getFittingHeight(i);
			return {
				width: o === void 0 ? a : Math.min(o, a),
				height: c === void 0 ? s : Math.min(c, s)
			};
		}
		returnCanvasAndContext(e) {
			let { width: t, height: n } = e.canvas, r = this._buckets.get($a(t, n));
			r && (e.context.resetTransform(), e.context.clearRect(0, 0, t, n), r.push(e));
		}
		setScreenSize(e, t, n) {
			this._screens.set(e, t, n) && this._pruneScreenCanvases();
		}
		removeScreen(e) {
			this._screens.remove(e) && this._pruneScreenCanvases();
		}
		clear() {
			this._buckets.clear();
		}
		_pruneScreenCanvases() {
			for (let [e] of this._buckets) {
				let t = e >>> 17, n = e >>> 2 & 32767;
				(!dn(t) && !this._screens.hasWidth(t) || !dn(n) && !this._screens.hasHeight(n)) && this._buckets.delete(e);
			}
		}
	}, no = new to(), $e.register(no);
}));
// node_modules/pixi.js/lib/maths/misc/getOrientationOfPoints.mjs
function io(e) {
	let t = e.length;
	if (t < 6) return 1;
	let n = 0;
	for (let r = 0, i = e[t - 2], a = e[t - 1]; r < t; r += 2) {
		let t = e[r], o = e[r + 1];
		n += (t - i) * (o + a), i = t, a = o;
	}
	return n < 0 ? -1 : 1;
}
var ao = o((() => {}));
// node_modules/pixi.js/lib/maths/misc/squaredDistanceToLineSegment.mjs
function oo(e, t, n, r, i, a) {
	let o = e - n, s = t - r, c = i - n, l = a - r, u = o * c + s * l, d = c * c + l * l, f = -1;
	d !== 0 && (f = u / d);
	let p, m;
	f < 0 ? (p = n, m = r) : f > 1 ? (p = i, m = a) : (p = n + f * c, m = r + f * l);
	let h = e - p, g = t - m;
	return h * h + g * g;
}
var so = o((() => {})), co, lo = o((() => {
	wt(), co = class e {
		constructor(e = 0, t = 0, n = 0) {
			this.type = "circle", this.x = e, this.y = t, this.radius = n;
		}
		clone() {
			return new e(this.x, this.y, this.radius);
		}
		contains(e, t) {
			if (this.radius <= 0) return !1;
			let n = this.radius * this.radius, r = this.x - e, i = this.y - t;
			return r *= r, i *= i, r + i <= n;
		}
		strokeContains(e, t, n, r = .5) {
			if (this.radius === 0) return !1;
			let i = this.x - e, a = this.y - t, o = this.radius, s = (1 - r) * n, c = Math.sqrt(i * i + a * a);
			return c <= o + s && c > o - (n - s);
		}
		getBounds(e) {
			return e ||= new R(), e.x = this.x - this.radius, e.y = this.y - this.radius, e.width = this.radius * 2, e.height = this.radius * 2, e;
		}
		copyFrom(e) {
			return this.x = e.x, this.y = e.y, this.radius = e.radius, this;
		}
		copyTo(e) {
			return e.copyFrom(this), e;
		}
		toString() {
			return `[pixi.js/math:Circle x=${this.x} y=${this.y} radius=${this.radius}]`;
		}
	};
})), uo, fo = o((() => {
	wt(), uo = class e {
		constructor(e = 0, t = 0, n = 0, r = 0) {
			this.type = "ellipse", this.x = e, this.y = t, this.halfWidth = n, this.halfHeight = r;
		}
		clone() {
			return new e(this.x, this.y, this.halfWidth, this.halfHeight);
		}
		contains(e, t) {
			if (this.halfWidth <= 0 || this.halfHeight <= 0) return !1;
			let n = (e - this.x) / this.halfWidth, r = (t - this.y) / this.halfHeight;
			return n *= n, r *= r, n + r <= 1;
		}
		strokeContains(e, t, n, r = .5) {
			let { halfWidth: i, halfHeight: a } = this;
			if (i <= 0 || a <= 0) return !1;
			let o = n * (1 - r), s = n - o, c = i - s, l = a - s, u = i + o, d = a + o, f = e - this.x, p = t - this.y;
			return f * f / (u * u) + p * p / (d * d) > 1 ? !1 : c <= 0 || l <= 0 || f * f / (c * c) + p * p / (l * l) > 1;
		}
		getBounds(e) {
			return e ||= new R(), e.x = this.x - this.halfWidth, e.y = this.y - this.halfHeight, e.width = this.halfWidth * 2, e.height = this.halfHeight * 2, e;
		}
		copyFrom(e) {
			return this.x = e.x, this.y = e.y, this.halfWidth = e.halfWidth, this.halfHeight = e.halfHeight, this;
		}
		copyTo(e) {
			return e.copyFrom(this), e;
		}
		toString() {
			return `[pixi.js/math:Ellipse x=${this.x} y=${this.y} halfWidth=${this.halfWidth} halfHeight=${this.halfHeight}]`;
		}
	};
})), po, mo, ho, go = o((() => {
	Xe(), ao(), so(), wt(), ho = class e {
		constructor(...e) {
			this.type = "polygon";
			let t = Array.isArray(e[0]) ? e[0] : e;
			if (typeof t[0] != "number") {
				let e = [];
				for (let n = 0, r = t.length; n < r; n++) e.push(t[n].x, t[n].y);
				t = e;
			}
			this.points = t, this.closePath = !0;
		}
		isClockwise() {
			let e = 0, t = this.points, n = t.length;
			for (let r = 0; r < n; r += 2) {
				let i = t[r], a = t[r + 1], o = t[(r + 2) % n], s = t[(r + 3) % n];
				e += (o - i) * (s + a);
			}
			return e < 0;
		}
		containsPolygon(e) {
			let t = this.getBounds(po), n = e.getBounds(mo);
			if (!t.containsRect(n)) return !1;
			let r = e.points;
			for (let e = 0; e < r.length; e += 2) {
				let t = r[e], n = r[e + 1];
				if (!this.contains(t, n)) return !1;
			}
			return !0;
		}
		clone() {
			let t = this.points.slice(), n = new e(t);
			return n.closePath = this.closePath, n;
		}
		contains(e, t) {
			let n = !1, r = this.points.length / 2;
			for (let i = 0, a = r - 1; i < r; a = i++) {
				let r = this.points[i * 2], o = this.points[i * 2 + 1], s = this.points[a * 2], c = this.points[a * 2 + 1];
				o > t != c > t && e < (s - r) * ((t - o) / (c - o)) + r && (n = !n);
			}
			return n;
		}
		strokeContains(e, t, n, r = .5) {
			let { points: i } = this, a = n * (r === .5 ? r : (r - .5) * io(i) + .5), o = n - a, s = a * a, c = o * o, l = i.length - (this.closePath ? 0 : 2);
			for (let n = 0; n < l; n += 2) {
				let r = i[n], a = i[n + 1], o = i[(n + 2) % i.length], l = i[(n + 3) % i.length];
				if (oo(e, t, r, a, o, l) <= (Math.sign((o - r) * (t - a) - (l - a) * (e - r)) < 0 ? s : c)) return !0;
			}
			return !1;
		}
		getBounds(e) {
			e ||= new R();
			let t = this.points, n = Infinity, r = -Infinity, i = Infinity, a = -Infinity;
			for (let e = 0, o = t.length; e < o; e += 2) {
				let o = t[e], s = t[e + 1];
				n = o < n ? o : n, r = o > r ? o : r, i = s < i ? s : i, a = s > a ? s : a;
			}
			return e.x = n, e.width = r - n, e.y = i, e.height = a - i, e;
		}
		copyFrom(e) {
			return this.points = e.points.slice(), this.closePath = e.closePath, this;
		}
		copyTo(e) {
			return e.copyFrom(this), e;
		}
		toString() {
			return `[pixi.js/math:PolygoncloseStroke=${this.closePath}points=${this.points.reduce((e, t) => `${e}, ${t}`, "")}]`;
		}
		get lastX() {
			return this.points[this.points.length - 2];
		}
		get lastY() {
			return this.points[this.points.length - 1];
		}
		get x() {
			return F("8.11.0", "Polygon.lastX is deprecated, please use Polygon.lastX instead."), this.points[this.points.length - 2];
		}
		get y() {
			return F("8.11.0", "Polygon.y is deprecated, please use Polygon.lastY instead."), this.points[this.points.length - 1];
		}
		get startX() {
			return this.points[0];
		}
		get startY() {
			return this.points[1];
		}
	};
})), _o, vo, yo = o((() => {
	wt(), _o = (e, t, n, r, i, a, o) => {
		let s = e - n, c = t - r, l = Math.sqrt(s * s + c * c);
		return l >= i - a && l <= i + o;
	}, vo = class e {
		constructor(e = 0, t = 0, n = 0, r = 0, i = 20) {
			this.type = "roundedRectangle", this.x = e, this.y = t, this.width = n, this.height = r, this.radius = i;
		}
		getBounds(e) {
			return e ||= new R(), e.x = this.x, e.y = this.y, e.width = this.width, e.height = this.height, e;
		}
		clone() {
			return new e(this.x, this.y, this.width, this.height, this.radius);
		}
		copyFrom(e) {
			return this.x = e.x, this.y = e.y, this.width = e.width, this.height = e.height, this.radius = e.radius, this;
		}
		copyTo(e) {
			return e.copyFrom(this), e;
		}
		contains(e, t) {
			if (this.width <= 0 || this.height <= 0) return !1;
			if (e >= this.x && e <= this.x + this.width && t >= this.y && t <= this.y + this.height) {
				let n = Math.max(0, Math.min(this.radius, Math.min(this.width, this.height) / 2));
				if (t >= this.y + n && t <= this.y + this.height - n || e >= this.x + n && e <= this.x + this.width - n) return !0;
				let r = e - (this.x + n), i = t - (this.y + n), a = n * n;
				if (r * r + i * i <= a || (r = e - (this.x + this.width - n), r * r + i * i <= a) || (i = t - (this.y + this.height - n), r * r + i * i <= a) || (r = e - (this.x + n), r * r + i * i <= a)) return !0;
			}
			return !1;
		}
		strokeContains(e, t, n, r = .5) {
			let { x: i, y: a, width: o, height: s } = this, c = Math.max(0, Math.min(this.radius, Math.min(o, s) / 2)), l = n * (1 - r), u = n - l, d = i + c, f = a + c, p = o - c * 2, m = s - c * 2, h = i + o, g = a + s;
			return (e >= i - l && e <= i + u || e >= h - u && e <= h + l) && t >= f && t <= f + m || (t >= a - l && t <= a + u || t >= g - u && t <= g + l) && e >= d && e <= d + p || e < d && t < f && _o(e, t, d, f, c, u, l) || e > h - c && t < f && _o(e, t, h - c, f, c, u, l) || e > h - c && t > g - c && _o(e, t, h - c, g - c, c, u, l) || e < d && t > g - c && _o(e, t, d, g - c, c, u, l);
		}
		toString() {
			return `[pixi.js/math:RoundedRectangle x=${this.x} y=${this.y}width=${this.width} height=${this.height} radius=${this.radius}]`;
		}
	};
}));
// node_modules/pixi.js/lib/scene/container/bounds/getRenderableBounds.mjs
function bo(e, t) {
	t.clear();
	let n = t.matrix;
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		if (r.globalDisplayStatus < 7) continue;
		let i = r.renderGroup ?? r.parentRenderGroup;
		t.matrix = i?.isCachedAsTexture ? xo.copyFrom(i.textureOffsetInverseTransform).append(r.worldTransform) : i?._parentCacheAsTextureRenderGroup ? xo.copyFrom(i._parentCacheAsTextureRenderGroup.inverseWorldTransform).append(r.groupTransform) : r.worldTransform, t.addBounds(r.bounds);
	}
	return t.matrix = n, t;
}
var xo, So = o((() => {
	M(), xo = new j();
}));
// node_modules/pixi.js/lib/scene/text/utils/getPo2TextureFromSource.mjs
function Co(e, t, n, r, i = !1, a) {
	let o = wo;
	o.minX = 0, o.minY = 0, o.maxX = e.width / r | 0, o.maxY = e.height / r | 0;
	let s = tr.getOptimalTexture({
		width: o.width,
		height: o.height,
		resolution: r,
		autoGenerateMipmaps: i,
		scaleMode: a
	});
	return s.source.uploadMethodId = "image", s.source.resource = e, s.source.alphaMode = "premultiply-alpha-on-upload", s.frame.width = t / r, s.frame.height = n / r, s.source.emit("update", s.source), s.updateUvs(), s;
}
var wo, To = o((() => {
	nr(), Dt(), wo = new Et();
}));
// node_modules/pixi.js/lib/filters/CanvasFilterSystem.mjs
function Eo(e) {
	return typeof e.getCanvasFilterString == "function";
}
var Do, Oo, ko = o((() => {
	h(), Qa(), ro(), Dt(), So(), To(), Do = class {
		constructor() {
			this.skip = !1, this.useClip = !1, this.filters = null, this.container = null, this.bounds = new Et(), this.cssFilterString = "";
		}
	}, Oo = class {
		constructor(e) {
			this._filterStack = [], this._filterStackIndex = 0, this._savedStates = [], this._alphaMultiplier = 1, this._warnedFilterTypes = /* @__PURE__ */ new Set(), this.renderer = e;
		}
		push(e) {
			let t = this._pushFilterFrame(), n = e.filterEffect.filters;
			if (t.skip = !1, t.useClip = !1, t.filters = n, t.container = e.container, t.cssFilterString = "", n.every((e) => !e.enabled)) {
				t.skip = !0;
				return;
			}
			let r = [];
			for (let e of n) {
				if (!e.enabled) continue;
				if (!Eo(e)) {
					this._warnUnsupportedFilter(e);
					continue;
				}
				let t = e.getCanvasFilterString();
				t === null ? this._warnUnsupportedFilter(e) : t && r.push(t);
			}
			if (r.length === 0) {
				t.skip = !0;
				return;
			}
			t.cssFilterString = r.join(" "), this._calculateFilterArea(e, t.bounds), t.useClip = !!e.filterEffect.filterArea;
			let i = this.renderer.canvasContext.activeContext, a = i.filter || "none";
			if (this._savedStates.push({
				filter: a,
				alphaMultiplier: this._alphaMultiplier
			}), t.useClip && Number.isFinite(t.bounds.width) && Number.isFinite(t.bounds.height) && t.bounds.width > 0 && t.bounds.height > 0) {
				let e = this.renderer.canvasContext.activeResolution || 1;
				i.save(), i.setTransform(1, 0, 0, 1, 0, 0), i.beginPath(), i.rect(t.bounds.x * e, t.bounds.y * e, t.bounds.width * e, t.bounds.height * e), i.clip();
			} else t.useClip = !1;
			t.cssFilterString && (i.filter = a === "none" ? t.cssFilterString : `${a} ${t.cssFilterString}`);
		}
		pop() {
			let e = this._popFilterFrame();
			if (e.skip) return;
			let t = this._savedStates.pop();
			if (!t) return;
			let n = this.renderer.canvasContext.activeContext;
			e.useClip ? n.restore() : n.filter = t.filter, this._alphaMultiplier = t.alphaMultiplier;
		}
		generateFilteredTexture({ texture: e, filters: t }) {
			if (!t?.length || t.every((e) => !e.enabled)) return e;
			let n = [];
			for (let e of t) {
				if (!e.enabled) continue;
				if (!Eo(e)) {
					this._warnUnsupportedFilter(e);
					continue;
				}
				let t = e.getCanvasFilterString();
				t === null ? this._warnUnsupportedFilter(e) : t && n.push(t);
			}
			if (n.length === 0) return e;
			let r = G.getCanvasSource(e);
			if (!r) return e;
			let i = e.frame, a = e.source._resolution ?? e.source.resolution ?? 1, o = i.width, s = i.height, { canvas: c, context: l } = no.getOptimalCanvasAndContext(o, s, a);
			l.setTransform(1, 0, 0, 1, 0, 0), l.clearRect(0, 0, c.width, c.height), n.length && (l.filter = n.join(" "));
			let u = i.x * a, d = i.y * a, f = o * a, p = s * a;
			return l.drawImage(r, u, d, f, p, 0, 0, f, p), l.filter = "none", l.globalAlpha = 1, Co(c, o, s, a);
		}
		_calculateFilterArea(e, t) {
			if (e.renderables ? bo(e.renderables, t) : e.filterEffect.filterArea ? (t.clear(), t.addRect(e.filterEffect.filterArea), t.applyMatrix(e.container.worldTransform)) : e.container.getFastGlobalBounds(!0, t), e.container) {
				let n = (e.container.renderGroup || e.container.parentRenderGroup)?.cacheToLocalTransform;
				n && t.applyMatrix(n);
			}
		}
		_warnUnsupportedFilter(e) {
			let t = e?.constructor?.name || "Filter";
			this._warnedFilterTypes.has(t) || (this._warnedFilterTypes.add(t), console.warn(`CanvasRenderer: filter "${t}" is not supported in Canvas2D and will be skipped.`));
		}
		get alphaMultiplier() {
			return this._alphaMultiplier;
		}
		_pushFilterFrame() {
			let e = this._filterStack[this._filterStackIndex];
			return e ||= this._filterStack[this._filterStackIndex] = new Do(), this._filterStackIndex++, e;
		}
		_popFilterFrame() {
			return this._filterStackIndex <= 0 ? this._filterStack[0] : (this._filterStackIndex--, this._filterStack[this._filterStackIndex]);
		}
		destroy() {
			this._filterStack = null, this._savedStates = null, this._warnedFilterTypes = null, this._alphaMultiplier = 1;
		}
	}, Oo.extension = {
		type: [d.CanvasSystem],
		name: "filter"
	};
})), Ao, jo = o((() => {
	h(), Ao = class {
		constructor(e) {
			this._renderer = e;
		}
		push(e, t, n) {
			this._renderer.renderPipes.batch.break(n), n.add({
				renderPipeId: "filter",
				canBundle: !1,
				action: "pushFilter",
				container: t,
				filterEffect: e
			});
		}
		pop(e, t, n) {
			this._renderer.renderPipes.batch.break(n), n.add({
				renderPipeId: "filter",
				action: "popFilter",
				canBundle: !1
			});
		}
		execute(e) {
			e.action === "pushFilter" ? this._renderer.filter.push(e) : e.action === "popFilter" && this._renderer.filter.pop();
		}
		destroy() {
			this._renderer = null;
		}
	}, Ao.extension = {
		type: [
			d.WebGLPipes,
			d.WebGPUPipes,
			d.CanvasPipes
		],
		name: "filter"
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/shared/utils/createIdFromString.mjs
function Mo(e, t) {
	let n = Po[e];
	return n === void 0 && (No[t] === void 0 && (No[t] = 1), Po[e] = n = No[t]++), n;
}
var No, Po, Fo = o((() => {
	No = /* @__PURE__ */ Object.create(null), Po = /* @__PURE__ */ Object.create(null);
}));
// node_modules/pixi.js/lib/rendering/renderers/shared/shader/utils/stripShaderComments.mjs
function Io(e) {
	return e.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
}
var Lo = o((() => {}));
// node_modules/pixi.js/lib/rendering/renderers/gl/shader/program/extractFragmentOutputMaskFromGlProgram.mjs
function Ro(e) {
	if (!e.includes("#version 300 es")) return e.includes("gl_FragData") ? null : 1;
	let t = Io(e), n = 0, r;
	for (; (r = zo.exec(t)) !== null;) {
		let e = r[1] === void 0 ? 0 : parseInt(r[1], 10), t = r[2] === void 0 ? 1 : parseInt(r[2], 10);
		n |= (1 << t) - 1 << e;
	}
	return zo.lastIndex = 0, n || (/\bout\b/.test(t) ? null : 0);
}
var zo, Bo = o((() => {
	Lo(), zo = /* @__PURE__ */ RegExp("(?:layout\\s*\\(\\s*location\\s*=\\s*(\\d+)\\s*\\)\\s*)?\\bout\\s+(?:(?:highp|mediump|lowp)\\s+)?\\w+\\s+\\w+\\s*(?:\\[\\s*(\\d+)\\s*\\])?\\s*;", "g");
}));
// node_modules/pixi.js/lib/rendering/renderers/gl/shader/program/getTestContext.mjs
function Vo() {
	return (!Ho || Ho?.isContextLost()) && (Ho = U.get().createCanvas().getContext("webgl", {})), Ho;
}
var Ho, Uo = o((() => {
	W();
}));
// node_modules/pixi.js/lib/rendering/renderers/gl/shader/program/getMaxFragmentPrecision.mjs
function Wo() {
	if (!Go) {
		Go = "mediump";
		let e = Vo();
		e && e.getShaderPrecisionFormat && (Go = e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_FLOAT).precision ? "highp" : "mediump");
	}
	return Go;
}
var Go, Ko = o((() => {
	Uo();
}));
// node_modules/pixi.js/lib/rendering/renderers/gl/shader/program/preprocessors/addProgramDefines.mjs
function qo(e, t, n) {
	return t ? e : n ? (e = e.replace("out vec4 finalColor;", ""), `

        #ifdef GL_ES // This checks if it is WebGL1
        #define in varying
        #define finalColor gl_FragColor
        #define texture texture2D
        #endif
        ${e}
        `) : `

        #ifdef GL_ES // This checks if it is WebGL1
        #define in attribute
        #define out varying
        #endif
        ${e}
        `;
}
var Jo = o((() => {}));
// node_modules/pixi.js/lib/rendering/renderers/gl/shader/program/preprocessors/ensurePrecision.mjs
function Yo(e, t, n) {
	let r = n ? t.maxSupportedFragmentPrecision : t.maxSupportedVertexPrecision;
	if (e.substring(0, 9) !== "precision") {
		let i = n ? t.requestedFragmentPrecision : t.requestedVertexPrecision;
		i === "highp" && r !== "highp" && (i = "mediump"), e = `precision ${i} float;
${e}`;
	} else r !== "highp" && e.substring(0, 15) === "precision highp" && (e = e.replace("precision highp", "precision mediump"));
	let i = t.maxSupportedFragmentPrecision === "highp" ? "highp" : "mediump";
	return Xo(e, i);
}
function Xo(e, t) {
	let n = /* @__PURE__ */ new Set(), r = "";
	for (let [, t] of e.matchAll(Qo)) n.add(t);
	for (let [, i] of e.matchAll(Zo)) n.has(i) || (n.add(i), r += `precision ${$o[i] ?? t} ${i};
`);
	return r + e;
}
var Zo, Qo, $o, es = o((() => {
	Zo = /\buniform\s+([iu]?sampler\w+)/g, Qo = /\bprecision\s+\w+\s+([iu]?sampler\w+)\s*;/g, $o = {
		sampler2D: "lowp",
		samplerCube: "lowp"
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/gl/shader/program/preprocessors/insertVersion.mjs
function ts(e, t) {
	return t ? `#version 300 es
${e}` : e;
}
var ns = o((() => {}));
// node_modules/pixi.js/lib/rendering/renderers/gl/shader/program/preprocessors/setProgramName.mjs
function rs(e, { name: t = "pixi-program" }, n = !0) {
	t = t.replace(/\s+/g, "-"), t += n ? "-fragment" : "-vertex";
	let r = n ? is : as;
	return r[t] ? (r[t]++, t += `-${r[t]}`) : r[t] = 1, e.indexOf("#define SHADER_NAME") === -1 ? `${`#define SHADER_NAME ${t}`}
${e}` : e;
}
var is, as, os = o((() => {
	is = {}, as = {};
}));
// node_modules/pixi.js/lib/rendering/renderers/gl/shader/program/preprocessors/stripVersion.mjs
function ss(e, t) {
	return t ? e.replace("#version 300 es", "") : e;
}
var cs = o((() => {})), ls, us, ds, fs, ps = o((() => {
	Fo(), Bo(), Ko(), Jo(), es(), ns(), os(), cs(), ls = {
		stripVersion: ss,
		ensurePrecision: Yo,
		addProgramDefines: qo,
		setProgramName: rs,
		insertVersion: ts
	}, us = /* @__PURE__ */ Object.create(null), ds = class e {
		constructor(t) {
			t = {
				...e.defaultOptions,
				...t
			};
			let n = t.fragment.indexOf("#version 300 es") !== -1, r = {
				stripVersion: n,
				ensurePrecision: {
					requestedFragmentPrecision: t.preferredFragmentPrecision,
					requestedVertexPrecision: t.preferredVertexPrecision,
					maxSupportedVertexPrecision: "highp",
					maxSupportedFragmentPrecision: Wo()
				},
				setProgramName: { name: t.name },
				addProgramDefines: n,
				insertVersion: n
			}, i = t.fragment, a = t.vertex;
			Object.keys(ls).forEach((e) => {
				let t = r[e];
				i = ls[e](i, t, !0), a = ls[e](a, t, !1);
			}), this.fragment = i, this.vertex = a, this.transformFeedbackVaryings = t.transformFeedbackVaryings, this._key = Mo(`${this.vertex}:${this.fragment}`, "gl-program");
		}
		get fragmentOutputMask() {
			return this._fragmentOutputMask === void 0 && (this._fragmentOutputMask = Ro(this.fragment)), this._fragmentOutputMask;
		}
		destroy() {
			this.fragment = null, this.vertex = null, this._attributeData = null, this._uniformData = null, this._uniformBlockData = null, this.transformFeedbackVaryings = null, us[this._cacheKey] = null;
		}
		static from(t) {
			let n = `${t.vertex}:${t.fragment}`;
			return us[n] || (us[n] = new e(t), us[n]._cacheKey = n), us[n];
		}
	}, ds.defaultOptions = {
		preferredVertexPrecision: "highp",
		preferredFragmentPrecision: "mediump"
	}, fs = ds;
}));
// node_modules/pixi.js/lib/rendering/renderers/shared/geometry/utils/getAttributeInfoFromFormat.mjs
function ms(e) {
	return hs[e] ?? hs.float32;
}
var hs, gs = o((() => {
	hs = {
		uint8x2: {
			size: 2,
			stride: 2,
			normalised: !1
		},
		uint8x4: {
			size: 4,
			stride: 4,
			normalised: !1
		},
		sint8x2: {
			size: 2,
			stride: 2,
			normalised: !1
		},
		sint8x4: {
			size: 4,
			stride: 4,
			normalised: !1
		},
		unorm8x2: {
			size: 2,
			stride: 2,
			normalised: !0
		},
		unorm8x4: {
			size: 4,
			stride: 4,
			normalised: !0
		},
		snorm8x2: {
			size: 2,
			stride: 2,
			normalised: !0
		},
		snorm8x4: {
			size: 4,
			stride: 4,
			normalised: !0
		},
		uint16x2: {
			size: 2,
			stride: 4,
			normalised: !1
		},
		uint16x4: {
			size: 4,
			stride: 8,
			normalised: !1
		},
		sint16x2: {
			size: 2,
			stride: 4,
			normalised: !1
		},
		sint16x4: {
			size: 4,
			stride: 8,
			normalised: !1
		},
		unorm16x2: {
			size: 2,
			stride: 4,
			normalised: !0
		},
		unorm16x4: {
			size: 4,
			stride: 8,
			normalised: !0
		},
		snorm16x2: {
			size: 2,
			stride: 4,
			normalised: !0
		},
		snorm16x4: {
			size: 4,
			stride: 8,
			normalised: !0
		},
		float16x2: {
			size: 2,
			stride: 4,
			normalised: !1
		},
		float16x4: {
			size: 4,
			stride: 8,
			normalised: !1
		},
		float32: {
			size: 1,
			stride: 4,
			normalised: !1
		},
		float32x2: {
			size: 2,
			stride: 8,
			normalised: !1
		},
		float32x3: {
			size: 3,
			stride: 12,
			normalised: !1
		},
		float32x4: {
			size: 4,
			stride: 16,
			normalised: !1
		},
		uint32: {
			size: 1,
			stride: 4,
			normalised: !1
		},
		uint32x2: {
			size: 2,
			stride: 8,
			normalised: !1
		},
		uint32x3: {
			size: 3,
			stride: 12,
			normalised: !1
		},
		uint32x4: {
			size: 4,
			stride: 16,
			normalised: !1
		},
		sint32: {
			size: 1,
			stride: 4,
			normalised: !1
		},
		sint32x2: {
			size: 2,
			stride: 8,
			normalised: !1
		},
		sint32x3: {
			size: 3,
			stride: 12,
			normalised: !1
		},
		sint32x4: {
			size: 4,
			stride: 16,
			normalised: !1
		}
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/gpu/shader/utils/extractAttributesFromGpuProgram.mjs
function _s(e, t) {
	let n;
	for (; (n = bs.exec(e)) !== null;) {
		let e = ys[n[3]] ?? "float32";
		t[n[2]] = {
			location: parseInt(n[1], 10),
			format: e,
			stride: ms(e).stride,
			offset: 0,
			instance: !1,
			start: 0
		};
	}
	bs.lastIndex = 0;
}
function vs({ source: e, entryPoint: t }) {
	let n = {}, r = Io(e), i = r.indexOf(`fn ${t}(`);
	if (i === -1) return n;
	let a = r.indexOf("->", i);
	if (a === -1) return n;
	let o = r.substring(i, a);
	if (_s(o, n), Object.keys(n).length === 0) {
		let e = o.match(/\(\s*\w+\s*:\s*(\w+)/);
		if (e) {
			let t = e[1], i = RegExp(`struct\\s+${t}\\s*\\{([^}]+)\\}`, "s"), a = r.match(i);
			a && _s(a[1], n);
		}
	}
	return n;
}
var ys, bs, xs = o((() => {
	gs(), Lo(), ys = {
		f32: "float32",
		"vec2<f32>": "float32x2",
		"vec3<f32>": "float32x3",
		"vec4<f32>": "float32x4",
		vec2f: "float32x2",
		vec3f: "float32x3",
		vec4f: "float32x4",
		i32: "sint32",
		"vec2<i32>": "sint32x2",
		"vec3<i32>": "sint32x3",
		"vec4<i32>": "sint32x4",
		vec2i: "sint32x2",
		vec3i: "sint32x3",
		vec4i: "sint32x4",
		u32: "uint32",
		"vec2<u32>": "uint32x2",
		"vec3<u32>": "uint32x3",
		"vec4<u32>": "uint32x4",
		vec2u: "uint32x2",
		vec3u: "uint32x3",
		vec4u: "uint32x4",
		bool: "uint32",
		"vec2<bool>": "uint32x2",
		"vec3<bool>": "uint32x3",
		"vec4<bool>": "uint32x4"
	}, bs = /@location\((\d+)\)\s+([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_<>]+)(?:,|\s|\)|$)/g;
}));
// node_modules/pixi.js/lib/rendering/renderers/gpu/shader/utils/extractFragmentOutputMaskFromGpuProgram.mjs
function Ss(e) {
	let t = 0, n;
	for (; (n = ws.exec(e)) !== null;) t |= 1 << parseInt(n[1], 10);
	return ws.lastIndex = 0, t;
}
function Cs({ source: e, entryPoint: t }) {
	if (!t) return null;
	let n = Io(e), r = RegExp(`fn\\s+${t}\\s*\\(`).exec(n);
	if (!r) return null;
	let i = 1, a = r.index + r[0].length;
	for (; a < n.length && i > 0;) {
		let e = n[a++];
		e === "(" ? i++ : e === ")" && i--;
	}
	let o = n.indexOf("{", a);
	if (o === -1) return null;
	let s = n.substring(a, o).trim();
	if (!s.startsWith("->")) return 0;
	let c = s.substring(2).trim();
	if (c.startsWith("@builtin")) return 0;
	if (c.startsWith("@location")) return Ss(c);
	if (!/^\w+$/.test(c)) return null;
	let l = RegExp(`struct\\s+${c}\\s*\\{([^}]*)\\}`).exec(n);
	return l ? Ss(l[1]) : null;
}
var ws, Ts = o((() => {
	Lo(), ws = /@location\(\s*(\d+)\s*\)/g;
}));
// node_modules/pixi.js/lib/rendering/renderers/gpu/shader/utils/extractStructAndGroups.mjs
function Es(e) {
	let t = /(^|[^/])@(group|binding)\(\d+\)[^;]+;/g, n = /@group\((\d+)\)/, r = /@binding\((\d+)\)/, i = /var(<[^>]+>)? (\w+)/, a = /:\s*([\w<>]+)/, o = /struct\s+(\w+)\s*{([^}]+)}/g, s = /(\w+)\s*:\s*([\w\<\>]+)/g, c = /struct\s+(\w+)/, l = e.match(t)?.map((e) => {
		let t = e.match(i), o = t?.[1] ?? "", s;
		return o === "<uniform>" ? s = "uniform" : o.startsWith("<storage") && (s = "storage"), {
			group: parseInt(e.match(n)[1], 10),
			binding: parseInt(e.match(r)[1], 10),
			name: t[2],
			accessMode: s,
			type: e.match(a)[1]
		};
	});
	return l ? {
		groups: l,
		structs: e.match(o)?.map((e) => {
			let t = e.match(c)[1], n = e.match(s).reduce((e, t) => {
				let [n, r] = t.split(":");
				return e[n.trim()] = r.trim(), e;
			}, {});
			return n ? {
				name: t,
				members: n
			} : null;
		}).filter(({ name: e }) => l.some((t) => t.type === e || t.type.includes(`<${e}>`))) ?? []
	} : {
		groups: [],
		structs: []
	};
}
var Ds = o((() => {})), Os, ks = o((() => {
	Os = /* @__PURE__ */ ((e) => (e[e.VERTEX = 1] = "VERTEX", e[e.FRAGMENT = 2] = "FRAGMENT", e[e.COMPUTE = 4] = "COMPUTE", e))(Os || {});
}));
// node_modules/pixi.js/lib/rendering/renderers/gpu/shader/utils/generateGpuLayoutGroups.mjs
function As(e) {
	return e.endsWith("<u32>") ? "uint" : e.endsWith("<i32>") ? "sint" : "float";
}
function js({ groups: e }) {
	let t = [];
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		t[r.group] || (t[r.group] = []), r.accessMode === "uniform" ? t[r.group].push({
			binding: r.binding,
			visibility: Os.VERTEX | Os.FRAGMENT,
			buffer: { type: "uniform" }
		}) : r.accessMode === "storage" ? t[r.group].push({
			binding: r.binding,
			visibility: Os.VERTEX | Os.FRAGMENT,
			buffer: { type: "read-only-storage" }
		}) : r.type === "sampler" ? t[r.group].push({
			binding: r.binding,
			visibility: Os.VERTEX | Os.FRAGMENT,
			sampler: { type: "filtering" }
		}) : r.type === "sampler_comparison" ? t[r.group].push({
			binding: r.binding,
			visibility: Os.VERTEX | Os.FRAGMENT,
			sampler: { type: "comparison" }
		}) : r.type === "texture_2d" || r.type.startsWith("texture_2d<") ? t[r.group].push({
			binding: r.binding,
			visibility: Os.VERTEX | Os.FRAGMENT,
			texture: {
				sampleType: As(r.type),
				viewDimension: "2d",
				multisampled: !1
			}
		}) : r.type === "texture_depth_2d" ? t[r.group].push({
			binding: r.binding,
			visibility: Os.VERTEX | Os.FRAGMENT,
			texture: {
				sampleType: "depth",
				viewDimension: "2d",
				multisampled: !1
			}
		}) : r.type === "texture_depth_2d_array" ? t[r.group].push({
			binding: r.binding,
			visibility: Os.VERTEX | Os.FRAGMENT,
			texture: {
				sampleType: "depth",
				viewDimension: "2d-array",
				multisampled: !1
			}
		}) : r.type === "texture_2d_array" || r.type.startsWith("texture_2d_array<") ? t[r.group].push({
			binding: r.binding,
			visibility: Os.VERTEX | Os.FRAGMENT,
			texture: {
				sampleType: As(r.type),
				viewDimension: "2d-array",
				multisampled: !1
			}
		}) : r.type === "texture_3d" || r.type.startsWith("texture_3d<") ? t[r.group].push({
			binding: r.binding,
			visibility: Os.VERTEX | Os.FRAGMENT,
			texture: {
				sampleType: As(r.type),
				viewDimension: "3d",
				multisampled: !1
			}
		}) : (r.type === "texture_cube" || r.type.startsWith("texture_cube<")) && t[r.group].push({
			binding: r.binding,
			visibility: Os.VERTEX | Os.FRAGMENT,
			texture: {
				sampleType: As(r.type),
				viewDimension: "cube",
				multisampled: !1
			}
		});
	}
	for (let e = 0; e < t.length; e++) t[e] || (t[e] = []);
	return t;
}
var Ms = o((() => {
	ks();
}));
// node_modules/pixi.js/lib/rendering/renderers/gpu/shader/utils/generateLayoutHash.mjs
function Ns({ groups: e }) {
	let t = [];
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		t[r.group] || (t[r.group] = {}), t[r.group][r.name] = r.binding;
	}
	return t;
}
var Ps = o((() => {}));
// node_modules/pixi.js/lib/rendering/renderers/gpu/shader/utils/removeStructAndGroupDuplicates.mjs
function Fs(e, t) {
	let n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
	return {
		structs: [...e.structs, ...t.structs].filter((e) => !n.has(e.name) && (n.add(e.name), !0)),
		groups: [...e.groups, ...t.groups].filter((e) => {
			let t = `${e.name}-${e.binding}`;
			return !r.has(t) && (r.add(t), !0);
		})
	};
}
var Is = o((() => {})), Ls, Rs, zs = o((() => {
	Fo(), xs(), Ts(), Ds(), Ms(), Ps(), Is(), Ls = /* @__PURE__ */ Object.create(null), Rs = class e {
		constructor(e) {
			this._layoutKey = 0, this._attributeLocationsKey = 0;
			let { fragment: t, vertex: n, layout: r, gpuLayout: i, name: a } = e;
			if (this.name = a, this.fragment = t, this.vertex = n, t.source === n.source) {
				let e = Es(t.source);
				this.structsAndGroups = e;
			} else {
				let e = Es(n.source), r = Es(t.source);
				this.structsAndGroups = Fs(e, r);
			}
			this.layout = r ?? Ns(this.structsAndGroups), this.gpuLayout = i ?? js(this.structsAndGroups), this.autoAssignGlobalUniforms = this.layout[0]?.globalUniforms !== void 0, this.autoAssignLocalUniforms = this.layout[1]?.localUniforms !== void 0, this._generateProgramKey();
		}
		_generateProgramKey() {
			let { vertex: e, fragment: t } = this, n = e.source + t.source + e.entryPoint + t.entryPoint;
			this._layoutKey = Mo(n, "program");
		}
		get attributeData() {
			return this._attributeData ??= vs(this.vertex), this._attributeData;
		}
		get fragmentOutputMask() {
			return this._fragmentOutputMask === void 0 && (this._fragmentOutputMask = Cs(this.fragment)), this._fragmentOutputMask;
		}
		destroy() {
			this.gpuLayout = null, this.layout = null, this.structsAndGroups = null, this.fragment = null, this.vertex = null, Ls[this._cacheKey] = null;
		}
		static from(t) {
			let n = `${t.vertex.source}:${t.fragment.source}:${t.fragment.entryPoint}:${t.vertex.entryPoint}`;
			return Ls[n] || (Ls[n] = new e(t), Ls[n]._cacheKey = n), Ls[n];
		}
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/gpu/shader/BindGroup.mjs
function Bs(e, t) {
	let n = Math.imul(t + 2654435769, 2246822507) ^ Math.imul(e + 1, 3266489909);
	return n ^= n >>> 16, n = Math.imul(n, 2146121005), n ^= n >>> 15, n = Math.imul(n, 2221713035), n ^ n >>> 16;
}
function Vs(e, t) {
	let n = Math.imul(t + 2135587861, 668265263) ^ Math.imul(e + 374761393, 2654435761);
	return n ^= n >>> 15, n = Math.imul(n, 739982445), n ^= n >>> 12, n = Math.imul(n, 695872825), n ^ n >>> 15;
}
var Hs, Us = o((() => {
	L(), Hs = class {
		constructor(e) {
			this.resources = /* @__PURE__ */ Object.create(null), this._resourceKeysValue = null, this._touchKeysValue = null, this._keyLow = 0, this._keyHigh = 0, this._gpuEntry = null, this._gpuEntryLayoutKey = -1, this._keyedIds = [], this.layout = null;
			let t = 0;
			for (let n in e) {
				t === 0 && !/^\d/.test(n) && (this.layout = {}), this.layout && (this.layout[n] = t);
				let r = e[n];
				r && this.setResource(r, t), t++;
			}
		}
		get _resourceKeys() {
			return this._resourceKeysValue ??= Object.keys(this.resources).map(Number), this._resourceKeysValue;
		}
		setResource(e, t) {
			typeof t == "string" && (t = this._bindingOf(t));
			let n = this.resources[t];
			e !== n && (n && n.off?.("change", this.onResourceChange, this), e.on?.("change", this.onResourceChange, this), this.setResourceUnwatched(e, t));
		}
		setResourceUnwatched(e, t) {
			let n = this.resources[t];
			if (e === n) return;
			let r = e._resourceId;
			n?._resourceType !== e._resourceType && (this._touchKeysValue = null), n === void 0 ? (this._resourceKeysValue = null, this._keyLow ^= Bs(t, r), this._keyHigh ^= Vs(t, r), this._keyedIds[t] = r, this._gpuEntry = null) : this._keyedIds[t] !== r && this._rekey(t, r), this.resources[t] = e;
		}
		_rekey(e, t) {
			let n = this._keyedIds[e];
			this._keyLow ^= Bs(e, n) ^ Bs(e, t), this._keyHigh ^= Vs(e, n) ^ Vs(e, t), this._keyedIds[e] = t, this._gpuEntry = null;
		}
		getResource(e) {
			return this.resources[typeof e == "string" ? this._bindingOf(e) : e];
		}
		_bindingOf(e) {
			let t = this.layout?.[e];
			if (t === void 0) throw Error(`[BindGroup] no binding named '${e}' in this group`);
			return t;
		}
		_touch(e) {
			let t = this.resources, n = this._touchKeys;
			for (let r = 0; r < n.length; r++) {
				let i = t[n[r]];
				i && (i._gcLastUsed = e);
			}
		}
		get _touchKeys() {
			return this._touchKeysValue ??= this._resourceKeys.filter((e) => this.resources[e]?._resourceType !== "textureSampler"), this._touchKeysValue;
		}
		destroy() {
			let e = this.resources;
			for (let t in e) e[t]?.off?.("change", this.onResourceChange, this);
			this.resources = null, this._resourceKeysValue = null, this._touchKeysValue = null, this._gpuEntry = null;
		}
		onResourceChange(e) {
			let t = this.resources;
			if (!t) return;
			let n = this._resourceKeys, r = e.destroyed;
			for (let i = 0; i < n.length; i++) {
				let a = n[i];
				t[a] === e && (r && (t[a] = null), this._rekey(a, r ? -1 : e._resourceId));
			}
			r && I(`[BindGroup] a '${e._resourceType}' was destroyed while still bound to a shader. Remove it from the shader before destroying it.`);
		}
	};
})), Ws, Gs = o((() => {
	Ws = /* @__PURE__ */ ((e) => (e[e.WEBGL = 1] = "WEBGL", e[e.WEBGPU = 2] = "WEBGPU", e[e.CANVAS = 4] = "CANVAS", e[e.BOTH = 3] = "BOTH", e))(Ws || {});
})), Ks, qs = o((() => {
	Fo(), Ks = class e {
		constructor(e) {
			this.data = { ...e };
			let t = Object.keys(e).sort().map((t) => `${t}:${e[t]}`).join("|");
			this.id = Mo(t, "shader-overrides");
		}
		static from(t) {
			return t instanceof e ? t : new e(t);
		}
	};
})), Js, Ys, Xs = o((() => {
	Js = [
		"f32",
		"i32",
		"u32",
		"vec2<f32>",
		"vec3<f32>",
		"vec4<f32>",
		"mat2x2<f32>",
		"mat3x3<f32>",
		"mat4x4<f32>",
		"mat3x2<f32>",
		"mat4x2<f32>",
		"mat2x3<f32>",
		"mat4x3<f32>",
		"mat2x4<f32>",
		"mat3x4<f32>",
		"vec2<i32>",
		"vec3<i32>",
		"vec4<i32>",
		"vec2<u32>",
		"vec3<u32>",
		"vec4<u32>"
	], Ys = Js.reduce((e, t) => (e[t] = !0, e), {});
}));
// node_modules/pixi.js/lib/rendering/renderers/shared/shader/utils/getDefaultUniformValue.mjs
function Zs(e, t) {
	switch (e) {
		case "f32": return 0;
		case "vec2<f32>": return new Float32Array(2 * t);
		case "vec3<f32>": return new Float32Array(3 * t);
		case "vec4<f32>": return new Float32Array(4 * t);
		case "mat2x2<f32>": return new Float32Array([
			1,
			0,
			0,
			1
		]);
		case "mat3x3<f32>": return new Float32Array([
			1,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			1
		]);
		case "mat4x4<f32>": return new Float32Array([
			1,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			1
		]);
	}
	return null;
}
var Qs = o((() => {})), $s, ec, tc = o((() => {
	y(), We(), Fo(), Xs(), Qs(), $s = class e extends v {
		constructor(t, n) {
			super(), this.uid = N("uniform"), this._resourceType = "uniformGroup", this._resourceId = N("resource"), this.isUniformGroup = !0, this._dirtyId = 0, this.destroyed = !1, n = {
				...e.defaultOptions,
				...n
			}, this.uniformStructures = t;
			let r = {};
			for (let e in t) {
				let n = t[e];
				if (n.name = e, n.size = n.size ?? 1, !Ys[n.type]) {
					let e = n.type.match(/^array<(\w+(?:<\w+>)?),\s*(\d+)>$/);
					if (e) {
						let [, t, r] = e;
						throw Error(`Uniform type ${n.type} is not supported. Use type: '${t}', size: ${r} instead.`);
					}
					throw Error(`Uniform type ${n.type} is not supported. Supported uniform types are: ${Js.join(", ")}`);
				}
				n.value ??= Zs(n.type, n.size), r[e] = n.value;
			}
			this.uniforms = r, this._dirtyId = 1, this.ubo = n.ubo, this.isStatic = n.isStatic, this._signature = Mo(Object.keys(r).map((e) => `${e}-${t[e].type}`).join("-"), "uniform-group");
		}
		get buffer() {
			return this._buffer;
		}
		set buffer(e) {
			this._buffer !== e && (this._buffer?.off("change", this.onBufferChange, this), this._buffer = e, e?.on("change", this.onBufferChange, this));
		}
		get _gcLastUsed() {
			return this._buffer?._gcLastUsed ?? -1;
		}
		set _gcLastUsed(e) {
			this._buffer && (this._buffer._gcLastUsed = e);
		}
		onBufferChange() {
			this._resourceId = N("resource"), this.emit("change", this);
		}
		update() {
			this._dirtyId++;
		}
	}, $s.defaultOptions = {
		ubo: !1,
		isStatic: !1
	}, ec = $s;
})), nc, rc = o((() => {
	y(), We(), L(), ps(), Us(), zs(), Gs(), qs(), tc(), nc = class e extends v {
		constructor(e) {
			super(), this.uid = N("shader"), this._uniformBindMap = /* @__PURE__ */ Object.create(null), this._ownedBindGroups = [], this._destroyed = !1;
			let { gpuProgram: t, glProgram: n, groups: r, resources: i, compatibleRenderers: a, groupMap: o, overrides: s } = e;
			this._overrides = s ? Ks.from(s) : null, this.gpuProgram = t, this.glProgram = n, a === void 0 && (a = 0, t && (a |= Ws.WEBGPU), n && (a |= Ws.WEBGL)), this.compatibleRenderers = a;
			let c = {};
			if (o) for (let e in o) for (let t in o[e]) {
				let n = o[e][t];
				c[n] = {
					group: Number(e),
					binding: Number(t),
					name: n
				};
			}
			if (!i && !r && (i = {}), i && r) throw Error("[Shader] Cannot have both resources and groups");
			if (!t && r && !o) throw Error("[Shader] No group map or WebGPU shader provided - consider using resources instead.");
			if (t && r && !o) {
				let e = t.structsAndGroups.groups;
				o = {}, e.forEach((e) => {
					o[e.group] = o[e.group] || {}, o[e.group][e.binding] = e.name, c[e.name] = e;
				});
			} else if (i) {
				r = {}, o ||= {}, t && t.structsAndGroups.groups.forEach((e) => {
					o[e.group] = o[e.group] || {}, o[e.group][e.binding] = e.name, c[e.name] = e;
				});
				let e = 0;
				for (let a in i) c[a] || (t && !n && I(`[Shader] the resource '${a}' matches no binding in the WGSL source \u2014 is the name correct?`), r[99] || (r[99] = new Hs(), this._ownedBindGroups.push(r[99])), c[a] = {
					group: 99,
					binding: e,
					name: a
				}, o[99] = o[99] || {}, o[99][e] = a, e++);
				for (let e in i) {
					let t = e, n = i[e];
					!n.source && !n._resourceType && (n = new ec(n));
					let a = c[t];
					a && (r[a.group] || (r[a.group] = new Hs(), this._ownedBindGroups.push(r[a.group])), r[a.group].setResource(n, a.binding));
				}
			}
			this.groups = r, this._uniformBindMap = o, this.resources = this._buildResourceAccessor(r, c);
		}
		addResource(e, t, n) {
			var r, i;
			(r = this._uniformBindMap)[t] || (r[t] = {}), (i = this._uniformBindMap[t])[n] || (i[n] = e), this.groups[t] || (this.groups[t] = new Hs(), this._ownedBindGroups.push(this.groups[t]));
		}
		_buildResourceAccessor(e, t) {
			let n = {};
			for (let r in t) {
				let i = t[r];
				Object.defineProperty(n, i.name, {
					get() {
						let t = e[i.group];
						return t.getResource(t.layout ? t.layout[i.name] : i.binding);
					},
					set(t) {
						let n = e[i.group];
						n.setResource(t, n.layout ? n.layout[i.name] : i.binding);
					}
				});
			}
			return n;
		}
		destroy(e = !1) {
			this._destroyed || (this._destroyed = !0, this.emit("destroy", this), e && (this.gpuProgram?.destroy(), this.glProgram?.destroy()), this.gpuProgram = null, this.glProgram = null, this.removeAllListeners(), this._uniformBindMap = null, this._ownedBindGroups.forEach((e) => {
				e.destroy();
			}), this._ownedBindGroups = null, this.resources = null, this.groups = null, this._overrides = null);
		}
		static from(t) {
			let { gpu: n, gl: r, ...i } = t, a, o;
			return n && (a = Rs.from(n)), r && (o = fs.from(r)), new e({
				gpuProgram: a,
				glProgram: o,
				...i
			});
		}
	};
})), ic, ac, oc, sc, cc, lc, uc, dc, fc, pc, mc = o((() => {
	ic = {
		normal: 0,
		add: 1,
		multiply: 2,
		screen: 3,
		overlay: 4,
		erase: 5,
		"normal-npm": 6,
		"add-npm": 7,
		"screen-npm": 8,
		min: 9,
		max: 10
	}, ac = {
		BLEND: 0,
		OFFSET: 1,
		CULLING: 2,
		DEPTH_TEST: 3,
		WINDING: 4,
		DEPTH_MASK: 5
	}, {BLEND: oc, OFFSET: sc, CULLING: cc, DEPTH_TEST: lc, WINDING: uc, DEPTH_MASK: dc} = ac, fc = class e {
		constructor() {
			this.data = 0, this.blendMode = "normal", this.polygonOffset = 0, this.blend = !0, this.depthMask = !0;
		}
		get blend() {
			return !!(this.data & 1 << oc);
		}
		set blend(e) {
			!!(this.data & 1 << oc) !== e && (this.data ^= 1 << oc);
		}
		get offsets() {
			return !!(this.data & 1 << sc);
		}
		set offsets(e) {
			!!(this.data & 1 << sc) !== e && (this.data ^= 1 << sc);
		}
		set cullMode(e) {
			e === "none" ? this.culling = !1 : (this.culling = !0, this.clockwiseFrontFace = e === "front");
		}
		get cullMode() {
			return this.culling ? this.clockwiseFrontFace ? "front" : "back" : "none";
		}
		get culling() {
			return !!(this.data & 1 << cc);
		}
		set culling(e) {
			!!(this.data & 1 << cc) !== e && (this.data ^= 1 << cc);
		}
		get depthTest() {
			return !!(this.data & 1 << lc);
		}
		set depthTest(e) {
			!!(this.data & 1 << lc) !== e && (this.data ^= 1 << lc);
		}
		get depthMask() {
			return !!(this.data & 1 << dc);
		}
		set depthMask(e) {
			!!(this.data & 1 << dc) !== e && (this.data ^= 1 << dc);
		}
		get clockwiseFrontFace() {
			return !!(this.data & 1 << uc);
		}
		set clockwiseFrontFace(e) {
			!!(this.data & 1 << uc) !== e && (this.data ^= 1 << uc);
		}
		get blendMode() {
			return this._blendMode;
		}
		set blendMode(e) {
			this.blend = e !== "none", this._blendMode = e, this._blendModeId = ic[e] || 0;
		}
		get polygonOffset() {
			return this._polygonOffset;
		}
		set polygonOffset(e) {
			this.offsets = !!e, this._polygonOffset = e;
		}
		toString() {
			return `[pixi.js/core:State blendMode=${this.blendMode} clockwiseFrontFace=${this.clockwiseFrontFace} culling=${this.culling} depthMask=${this.depthMask} polygonOffset=${this.polygonOffset}]`;
		}
		static for2d() {
			let t = new e();
			return t.depthTest = !1, t.depthMask = !1, t.blend = !0, t;
		}
	}, fc.default2d = fc.for2d(), pc = fc;
})), hc, gc, _c = o((() => {
	ps(), zs(), rc(), mc(), hc = class e extends nc {
		constructor(t) {
			t = {
				...e.defaultOptions,
				...t
			}, super(t), this.enabled = !0, this._state = pc.for2d(), this.blendMode = t.blendMode, this.padding = t.padding, this.antialias = typeof t.antialias == "boolean" ? t.antialias ? "on" : "off" : t.antialias, this.resolution = t.resolution, this.blendRequired = t.blendRequired, this.clipToViewport = t.clipToViewport, this.addResource("uTexture", 0, 1), t.blendRequired && this.addResource("uBackTexture", 0, 3);
		}
		apply(e, t, n, r) {
			e.applyFilter(this, t, n, r);
		}
		get blendMode() {
			return this._state.blendMode;
		}
		set blendMode(e) {
			this._state.blendMode = e;
		}
		static from(t) {
			let { gpu: n, gl: r, ...i } = t, a, o;
			return n && (a = Rs.from(n)), r && (o = fs.from(r)), new e({
				gpuProgram: a,
				glProgram: o,
				...i
			});
		}
	}, hc.defaultOptions = {
		blendMode: "normal",
		resolution: 1,
		padding: 0,
		antialias: "off",
		blendRequired: !1,
		clipToViewport: !0
	}, gc = hc;
})), vc, yc = o((() => {
	vc = "in vec2 aPosition;\nout vec2 vTextureCoord;\n\nuniform vec4 uInputSize;\nuniform vec4 uOutputFrame;\nuniform vec4 uOutputTexture;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;\n    \n    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;\n    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;\n\n    return vec4(position, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aPosition * (uOutputFrame.zw * uInputSize.zw);\n}\n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition();\n    vTextureCoord = filterTextureCoord();\n}\n";
})), bc, xc = o((() => {
	bc = "in vec2 vTextureCoord;\nout vec4 finalColor;\nuniform sampler2D uTexture;\nvoid main() {\n    finalColor = texture(uTexture, vTextureCoord);\n}\n";
})), Sc, Cc = o((() => {
	Sc = "struct GlobalFilterUniforms {\n  uInputSize: vec4<f32>,\n  uInputPixel: vec4<f32>,\n  uInputClamp: vec4<f32>,\n  uOutputFrame: vec4<f32>,\n  uGlobalFrame: vec4<f32>,\n  uOutputTexture: vec4<f32>,\n};\n\n@group(0) @binding(0) var <uniform> gfu: GlobalFilterUniforms;\n@group(0) @binding(1) var uTexture: texture_2d<f32>;\n@group(0) @binding(2) var uSampler: sampler;\n\nstruct VSOutput {\n  @builtin(position) position: vec4<f32>,\n  @location(0) uv: vec2<f32>\n};\n\nfn filterVertexPosition(aPosition: vec2<f32>) -> vec4<f32>\n{\n    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;\n\n    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;\n    position.y = position.y * (2.0 * gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;\n\n    return vec4(position, 0.0, 1.0);\n}\n\nfn filterTextureCoord(aPosition: vec2<f32>) -> vec2<f32>\n{\n    return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);\n}\n\n@vertex\nfn mainVertex(\n  @location(0) aPosition: vec2<f32>,\n) -> VSOutput {\n  return VSOutput(\n   filterVertexPosition(aPosition),\n   filterTextureCoord(aPosition)\n  );\n}\n\n@fragment\nfn mainFragment(\n  @location(0) uv: vec2<f32>,\n) -> @location(0) vec4<f32> {\n    return textureSample(uTexture, uSampler, uv);\n}\n";
})), wc, Tc = o((() => {
	ps(), zs(), _c(), yc(), xc(), Cc(), wc = class extends gc {
		constructor() {
			let e = Rs.from({
				vertex: {
					source: Sc,
					entryPoint: "mainVertex"
				},
				fragment: {
					source: Sc,
					entryPoint: "mainFragment"
				},
				name: "passthrough-filter"
			}), t = fs.from({
				vertex: vc,
				fragment: bc,
				name: "passthrough-filter"
			});
			super({
				gpuProgram: e,
				glProgram: t
			});
		}
	};
})), Ec, Dc = o((() => {
	Ec = /* @__PURE__ */ ((e) => (e[e.MAP_READ = 1] = "MAP_READ", e[e.MAP_WRITE = 2] = "MAP_WRITE", e[e.COPY_SRC = 4] = "COPY_SRC", e[e.COPY_DST = 8] = "COPY_DST", e[e.INDEX = 16] = "INDEX", e[e.VERTEX = 32] = "VERTEX", e[e.UNIFORM = 64] = "UNIFORM", e[e.STORAGE = 128] = "STORAGE", e[e.INDIRECT = 256] = "INDIRECT", e[e.QUERY_RESOLVE = 512] = "QUERY_RESOLVE", e[e.STATIC = 1024] = "STATIC", e))(Ec || {});
})), Oc, kc = o((() => {
	y(), We(), Dc(), Oc = class extends v {
		constructor(e) {
			let { data: t, size: n } = e, { usage: r, label: i, shrinkToFit: a } = e;
			super(), this._gpuData = /* @__PURE__ */ Object.create(null), this._gcLastUsed = -1, this.autoGarbageCollect = !0, this.uid = N("buffer"), this._resourceType = "buffer", this._resourceId = N("resource"), this._updateID = 1, this._updateOffset = 0, this._dataInt32 = null, this.shrinkToFit = !0, this.destroyed = !1, t instanceof Array && (t = new Float32Array(t)), this._data = t, n ??= t?.byteLength;
			let o = !!t;
			this.descriptor = {
				size: n,
				usage: r,
				mappedAtCreation: o,
				label: i
			}, this.shrinkToFit = a ?? !0;
		}
		get data() {
			return this._data;
		}
		set data(e) {
			this.setDataWithSize(e, e.length, !0);
		}
		get dataInt32() {
			return this._dataInt32 ||= new Int32Array(this.data.buffer), this._dataInt32;
		}
		get static() {
			return !!(this.descriptor.usage & Ec.STATIC);
		}
		set static(e) {
			e ? this.descriptor.usage |= Ec.STATIC : this.descriptor.usage &= ~Ec.STATIC;
		}
		setDataWithSize(e, t, n) {
			if (this._updateID++, this._updateSize = t * e.BYTES_PER_ELEMENT, this._updateOffset = 0, this._data === e) {
				n && this.emit("update", this);
				return;
			}
			let r = this._data;
			this._data = e, this._dataInt32 = null, !r || r.length !== e.length ? !this.shrinkToFit && r && e.byteLength < r.byteLength ? n && this.emit("update", this) : (this.descriptor.size = e.byteLength, this._resourceId = N("resource"), this.emit("change", this)) : n && this.emit("update", this);
		}
		update(e, t) {
			this._updateSize = e, this._updateOffset = t || 0, this._updateID++, this.emit("update", this);
		}
		unload() {
			this.emit("unload", this);
			for (let e in this._gpuData) this._gpuData[e]?.destroy();
			this._gpuData = /* @__PURE__ */ Object.create(null), this.destroyed || (this._resourceId = N("resource"), this.emit("change", this));
		}
		destroy() {
			this.destroyed = !0, this.unload(), this.emit("destroy", this), this.emit("change", this), this._data = null, this.descriptor = null, this.removeAllListeners();
		}
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/shared/geometry/utils/ensureIsBuffer.mjs
function Ac(e, t) {
	if (!(e instanceof Oc)) {
		let n = t ? Ec.INDEX : Ec.VERTEX;
		e instanceof Array && (t ? (e = new Uint32Array(e), n = Ec.INDEX | Ec.COPY_DST) : (e = new Float32Array(e), n = Ec.VERTEX | Ec.COPY_DST)), e = new Oc({
			data: e,
			label: t ? "index-mesh-buffer" : "vertex-mesh-buffer",
			usage: n
		});
	}
	return e;
}
var jc = o((() => {
	kc(), Dc();
}));
// node_modules/pixi.js/lib/rendering/renderers/shared/geometry/utils/getGeometryBounds.mjs
function Mc(e, t, n) {
	let r = e.getAttribute(t);
	if (!r) return n.minX = 0, n.minY = 0, n.maxX = 0, n.maxY = 0, n;
	let i = r.buffer.data, a = Infinity, o = Infinity, s = -Infinity, c = -Infinity, l = i.BYTES_PER_ELEMENT, u = (r.offset || 0) / l, d = (r.stride || 8) / l;
	for (let e = u; e < i.length; e += d) {
		let t = i[e], n = i[e + 1];
		t > s && (s = t), n > c && (c = n), t < a && (a = t), n < o && (o = n);
	}
	return n.minX = a, n.minY = o, n.maxX = s, n.maxY = c, n;
}
var Nc = o((() => {}));
// node_modules/pixi.js/lib/rendering/renderers/shared/geometry/Geometry.mjs
function Pc(e) {
	return (e instanceof Oc || Array.isArray(e) || e.BYTES_PER_ELEMENT) && (e = { buffer: e }), e.buffer = Ac(e.buffer, !1), e;
}
var Fc, Ic = o((() => {
	y(), Dt(), We(), Xe(), kc(), jc(), Nc(), Fc = class extends v {
		constructor(e = {}) {
			super(), this._gpuData = /* @__PURE__ */ Object.create(null), this.autoGarbageCollect = !0, this._gcLastUsed = -1, this.uid = N("geometry"), this._layoutKey = 0, this.instanceCount = 1, this.indexCount = 0, this._bounds = new Et(), this._boundsDirty = !0, this._vertexCount = 0, this._vertexCountDirty = !0;
			let { attributes: t, indexBuffer: n, topology: r } = e;
			if (this.buffers = [], this.attributes = {}, t) for (let e in t) this.addAttribute(e, t[e]);
			this.instanceCount = e.instanceCount ?? 1, this.indexCount = e.indexCount ?? 0, n && this.addIndex(n), this.topology = r || "triangle-list";
		}
		onBufferUpdate() {
			this._boundsDirty = !0, this._vertexCountDirty = !0, this.emit("update", this);
		}
		getAttribute(e) {
			return this.attributes[e];
		}
		getIndex() {
			return this.indexBuffer;
		}
		getBuffer(e) {
			return this.getAttribute(e).buffer;
		}
		get vertexCount() {
			if (!this._vertexCountDirty) return this._vertexCount;
			this._vertexCountDirty = !1;
			let e = this.attributes;
			for (let t in e) {
				let n = e[t];
				if (n.instance) continue;
				let r = n.buffer;
				return this._vertexCount = r.data.length / (n.stride / 4 || n.size), this._vertexCount;
			}
			return this._vertexCount = 0, 0;
		}
		getSize() {
			return F("8.20.0", "Geometry.getSize is deprecated, please use Geometry.vertexCount instead."), this.vertexCount;
		}
		addAttribute(e, t) {
			let n = Pc(t);
			this.buffers.indexOf(n.buffer) === -1 && (this.buffers.push(n.buffer), n.buffer.on("update", this.onBufferUpdate, this), n.buffer.on("change", this.onBufferUpdate, this)), this.attributes[e] = n, this._vertexCountDirty = !0;
		}
		addIndex(e) {
			this.indexBuffer = Ac(e, !0), this.buffers.push(this.indexBuffer);
		}
		get bounds() {
			return this._boundsDirty ? (this._boundsDirty = !1, Mc(this, "aPosition", this._bounds)) : this._bounds;
		}
		unload() {
			this.emit("unload", this);
			for (let e in this._gpuData) this._gpuData[e]?.destroy();
			this._gpuData = /* @__PURE__ */ Object.create(null);
		}
		destroy(e = !1) {
			this.emit("destroy", this);
			for (let t of this.buffers) t.off("update", this.onBufferUpdate, this), t.off("change", this.onBufferUpdate, this), e && t.destroy();
			this.unload(), this.removeAllListeners(), this.attributes = null, this.buffers = null, this.indexBuffer = null, this._bounds = null;
		}
	};
})), Lc, Rc, zc, Bc = o((() => {
	h(), Tc(), M(), Us(), Ic(), tc(), V(), nr(), Gs(), Dt(), So(), L(), Lc = new Fc({
		attributes: { aPosition: {
			buffer: new Float32Array([
				0,
				0,
				1,
				0,
				1,
				1,
				0,
				1
			]),
			format: "float32x2",
			stride: 8,
			offset: 0
		} },
		indexBuffer: new Uint32Array([
			0,
			1,
			2,
			0,
			2,
			3
		])
	}), Rc = class {
		constructor() {
			this.skip = !1, this.inputTexture = null, this.backTexture = null, this.filters = null, this.bounds = new Et(), this.container = null, this.blendRequired = !1, this.outputRenderSurface = null, this.firstEnabledIndex = -1, this.lastEnabledIndex = -1;
		}
	}, zc = class {
		constructor(e) {
			this._filterStackIndex = 0, this._filterStack = [], this._filterGlobalUniforms = new ec({
				uInputSize: {
					value: /* @__PURE__ */ new Float32Array(4),
					type: "vec4<f32>"
				},
				uInputPixel: {
					value: /* @__PURE__ */ new Float32Array(4),
					type: "vec4<f32>"
				},
				uInputClamp: {
					value: /* @__PURE__ */ new Float32Array(4),
					type: "vec4<f32>"
				},
				uOutputFrame: {
					value: /* @__PURE__ */ new Float32Array(4),
					type: "vec4<f32>"
				},
				uGlobalFrame: {
					value: /* @__PURE__ */ new Float32Array(4),
					type: "vec4<f32>"
				},
				uOutputTexture: {
					value: /* @__PURE__ */ new Float32Array(4),
					type: "vec4<f32>"
				}
			}), this._globalFilterBindGroup = new Hs({}), this.renderer = e;
		}
		init() {
			tr.on("evict", this._unbindPassTextures, this);
		}
		get activeBackTexture() {
			return this._activeFilterData?.backTexture;
		}
		push(e) {
			let t = this.renderer, n = e.filterEffect.filters, r = this._pushFilterData();
			r.skip = !1, r.filters = n, r.container = e.container, r.outputRenderSurface = t.renderTarget.renderSurface;
			let i = t.renderTarget.renderTarget.colorTexture.source, a = i.resolution, o = i.antialias;
			if (n.every((e) => !e.enabled)) {
				r.skip = !0;
				return;
			}
			let s = r.bounds;
			if (this._calculateFilterArea(e, s), this._calculateFilterBounds(r, t.renderTarget.rootViewPort, o, a, 1), r.skip) return;
			let c = this._getPreviousFilterData();
			this._setupFilterTextures(r, s, t, c);
		}
		generateFilteredTexture({ texture: e, filters: t }) {
			if (t.every((e) => !e.enabled)) return e;
			let n = this._pushFilterData();
			this._activeFilterData = n, n.skip = !1, n.filters = t;
			let r = e.source, i = r.resolution, a = r.antialias, o = n.bounds;
			if (o.clear(), o.addRect(e.frame), this._calculateFilterBounds(n, o.rectangle, a, i, 0), n.skip) return this._popFilterData(), e;
			n.outputRenderSurface = tr.getOptimalTexture({
				width: o.width,
				height: o.height,
				resolution: n.resolution,
				antialias: n.antialias
			}), n.backTexture = B.EMPTY, n.inputTexture = e, this.renderer.renderTarget.finishRenderPass(), this._applyFiltersToTexture(n, !0);
			let s = n.outputRenderSurface;
			return s.source.alphaMode = "premultiplied-alpha", this._popFilterData(), s;
		}
		pop() {
			let e = this.renderer, t = this._popFilterData();
			t.skip || (e.globalUniforms.pop(), e.renderTarget.finishRenderPass(), this._activeFilterData = t, this._applyFiltersToTexture(t, !1), t.blendRequired && tr.returnTexture(t.backTexture), tr.returnTexture(t.inputTexture));
		}
		getBackTexture(e, t, n) {
			let { _resolution: r, format: i } = e.colorTexture.source, a = tr.getOptimalTexture({
				width: t.width,
				height: t.height,
				resolution: r,
				format: i
			});
			return this._copyBackTexture(e, a, t, n);
		}
		_copyBackTexture(e, t, n, r) {
			let i = t.source._resolution, a = n.minX, o = n.minY;
			r && (a -= r.minX, o -= r.minY), a = Math.floor(a * i + 1e-6), o = Math.floor(o * i + 1e-6);
			let s = Math.min(Math.ceil(n.width * i), t.source.pixelWidth), c = Math.min(Math.ceil(n.height * i), t.source.pixelHeight);
			return this.renderer.renderTarget.copyToTexture(e, t, {
				x: a,
				y: o
			}, {
				width: s,
				height: c
			}, {
				x: 0,
				y: 0
			}), t;
		}
		applyFilter(e, t, n, r) {
			let i = this.renderer, a = this._activeFilterData, o = a.outputRenderSurface === n, s = this._findClosestFilterData(), c = s ? s.inputTexture.source._resolution : i.renderTarget.rootRenderTarget.colorTexture.source._resolution, l = 0, u = 0;
			o && s && (l = s.bounds.minX, u = s.bounds.minY), this._updateFilterUniforms(t, n, a, l, u, c, o, r);
			let d = e.enabled ? e : this._getPassthroughFilter();
			this._setupBindGroupsAndRender(d, t, i);
		}
		calculateSpriteMatrix(e, t) {
			let n = this._activeFilterData, r = e.set(n.inputTexture._source.width, 0, 0, n.inputTexture._source.height, n.bounds.minX, n.bounds.minY), i = t.worldTransform.copyTo(j.shared), a = t.renderGroup || t.parentRenderGroup;
			return a && a.cacheToLocalTransform && i.prepend(a.cacheToLocalTransform), i.invert(), r.prepend(i), r.scale(1 / t.texture.orig.width, 1 / t.texture.orig.height), r.translate(t.anchor.x, t.anchor.y), r;
		}
		destroy() {
			this._passthroughFilter?.destroy(!0), this._passthroughFilter = null, tr.off("evict", this._unbindPassTextures, this), this._globalFilterBindGroup.destroy();
		}
		_unbindPassTextures() {
			let e = this._globalFilterBindGroup;
			e.setResource(B.EMPTY.source, 1), e.setResource(B.EMPTY.source.style, 2), e.setResource(B.EMPTY.source, 3);
		}
		_getPassthroughFilter() {
			return this._passthroughFilter ??= new wc(), this._passthroughFilter;
		}
		_setupBindGroupsAndRender(e, t, n) {
			if (n.renderPipes.uniformBatch) {
				let e = n.renderPipes.uniformBatch.getUboResource(this._filterGlobalUniforms);
				this._globalFilterBindGroup.setResource(e, 0);
			} else this._globalFilterBindGroup.setResource(this._filterGlobalUniforms, 0);
			this._globalFilterBindGroup.setResource(t.source, 1), this._globalFilterBindGroup.setResource(t.source.style, 2), e.groups[0] = this._globalFilterBindGroup, n.encoder.draw({
				geometry: Lc,
				shader: e,
				state: e._state,
				topology: "triangle-list"
			}), n.type === Ws.WEBGL && n.renderTarget.finishRenderPass();
		}
		_setupFilterTextures(e, t, n, r) {
			if (e.backTexture = B.EMPTY, e.inputTexture = tr.getOptimalTexture({
				width: t.width,
				height: t.height,
				resolution: e.resolution,
				antialias: e.antialias
			}), e.blendRequired) {
				n.renderTarget.finishRenderPass();
				let i = n.renderTarget.getRenderTarget(e.outputRenderSurface), a = i.colorTexture.source, o = tr.getAlignedTexture(e.inputTexture, a._resolution, a.format);
				e.backTexture = this._copyBackTexture(i, o, t, r?.bounds);
			}
			n.renderTarget.bind({
				target: e.inputTexture,
				clear: !0
			}), n.globalUniforms.push({ offset: t });
		}
		_updateFilterUniforms(e, t, n, r, i, a, o, s) {
			let c = this._filterGlobalUniforms.uniforms, l = c.uOutputFrame, u = c.uInputSize, d = c.uInputPixel, f = c.uInputClamp, p = c.uGlobalFrame, m = c.uOutputTexture;
			o ? (l[0] = n.bounds.minX - r, l[1] = n.bounds.minY - i) : (l[0] = 0, l[1] = 0), l[2] = e.frame.width, l[3] = e.frame.height, u[0] = e.source.width, u[1] = e.source.height, u[2] = 1 / u[0], u[3] = 1 / u[1], d[0] = e.source.pixelWidth, d[1] = e.source.pixelHeight, d[2] = 1 / d[0], d[3] = 1 / d[1], f[0] = .5 * d[2], f[1] = .5 * d[3], f[2] = e.frame.width * u[2] - .5 * d[2], f[3] = e.frame.height * u[3] - .5 * d[3];
			let h = this.renderer.renderTarget.rootRenderTarget.colorTexture;
			p[0] = r * a, p[1] = i * a, p[2] = h.source.width * a, p[3] = h.source.height * a, t instanceof B && (t.source.resource = null);
			let g = this.renderer.renderTarget.getRenderTarget(t);
			this.renderer.renderTarget.bind({
				target: t,
				clear: !!s
			}), t instanceof B ? (m[0] = t.frame.width, m[1] = t.frame.height) : (m[0] = g.width, m[1] = g.height), m[2] = g.isRoot ? -1 : 1, this._filterGlobalUniforms.update();
		}
		_findClosestFilterData() {
			for (let e = this._filterStackIndex - 1; e >= 0; e--) {
				let t = this._filterStack[e];
				if (!t.skip) return t;
			}
			return null;
		}
		_calculateFilterArea(e, t) {
			if (e.renderables ? bo(e.renderables, t) : e.filterEffect.filterArea ? (t.clear(), t.addRect(e.filterEffect.filterArea), t.applyMatrix(e.container.worldTransform)) : e.container.getFastGlobalBounds(!0, t), e.container) {
				let n = (e.container.renderGroup || e.container.parentRenderGroup).cacheToLocalTransform;
				n && t.applyMatrix(n);
			}
		}
		_applyFiltersToTexture(e, t) {
			let n = e.inputTexture, r = e.bounds, i = e.filters, a = e.firstEnabledIndex, o = e.lastEnabledIndex;
			if (this._globalFilterBindGroup.setResource(n.source.style, 2), this._globalFilterBindGroup.setResource(e.backTexture.source, 3), a === o) i[a].apply(this, n, e.outputRenderSurface, t);
			else {
				let n = e.inputTexture, s = tr.getOptimalTexture({
					width: r.width,
					height: r.height,
					resolution: n.source._resolution
				}), c = s;
				for (let e = a; e < o; e++) {
					let t = i[e];
					if (!t.enabled) continue;
					t.apply(this, n, c, !0);
					let r = n;
					n = c, c = r;
				}
				i[o].apply(this, n, e.outputRenderSurface, t), tr.returnTexture(s);
			}
		}
		_calculateFilterBounds(e, t, n, r, i) {
			let a = this.renderer, o = e.bounds, s = e.filters, c = Infinity, l = 0, u = !0, d = !1, f = !1, p = !0, m = -1, h = -1;
			for (let e = 0; e < s.length; e++) {
				let t = s[e];
				if (t.enabled) {
					if (m === -1 && (m = e), h = e, c = Math.min(c, t.resolution === "inherit" ? r : t.resolution), l += t.padding, t.antialias === "off" ? u = !1 : t.antialias === "inherit" && (u &&= n), t.clipToViewport || (p = !1), !(t.compatibleRenderers & a.type)) {
						f = !1;
						break;
					}
					if (t.blendRequired && !(a.backBuffer?.useBackBuffer ?? !0)) {
						I("Blend filter requires backBuffer on WebGL renderer to be enabled. Set `useBackBuffer: true` in the renderer options."), f = !1;
						break;
					}
					f = !0, d ||= t.blendRequired;
				}
			}
			f ? (p && o.fitBounds(0, t.width / r, 0, t.height / r), o.scale(c).ceil().scale(1 / c).pad((l | 0) * i), o.isPositive ? (e.antialias = u, e.resolution = c, e.blendRequired = d, e.firstEnabledIndex = m, e.lastEnabledIndex = h) : e.skip = !0) : e.skip = !0;
		}
		_popFilterData() {
			return this._filterStackIndex--, this._filterStack[this._filterStackIndex];
		}
		_getPreviousFilterData() {
			for (let e = this._filterStackIndex - 2; e >= 0; e--) {
				let t = this._filterStack[e];
				if (!t.skip) return t;
			}
			return null;
		}
		_pushFilterData() {
			let e = this._filterStack[this._filterStackIndex];
			return e ||= this._filterStack[this._filterStackIndex] = new Rc(), this._filterStackIndex++, e;
		}
	}, zc.extension = {
		type: [d.WebGLSystem, d.WebGPUSystem],
		name: "filter"
	};
})), Vc = o((() => {
	h(), ko(), jo(), Bc(), m.add(zc, Oo), m.add(Ao);
})), Hc = /* @__PURE__ */ c({}), Uc = o((() => {
	ai(), ui(), Pi(), fa(), qa(), Vc();
}));
// node_modules/pixi.js/lib/environment-browser/browserExt.mjs
h();
var Wc = {
	extension: {
		type: d.Environment,
		name: "browser",
		priority: -1
	},
	test: () => !0,
	load: async () => {
		await Promise.resolve().then(() => (Uc(), Hc));
	}
}, Gc = /* @__PURE__ */ c({}), Kc = o((() => {
	fa(), qa(), Vc();
}));
// node_modules/pixi.js/lib/environment-webworker/webworkerExt.mjs
h();
var qc = {
	extension: {
		type: d.Environment,
		name: "webworker",
		priority: 0
	},
	test: () => typeof self < "u" && self.WorkerGlobalScope !== void 0,
	load: async () => {
		await Promise.resolve().then(() => (Kc(), Gc));
	}
};
// node_modules/pixi.js/lib/environment/autoDetectEnvironment.mjs
async function Jc(e) {
	if (!e) for (let e = 0; e < Yc.length; e++) {
		let t = Yc[e];
		if (t.value.test()) {
			await t.value.load();
			return;
		}
	}
}
var Yc, Xc = o((() => {
	h(), Yc = [], m.handleByNamedList(d.Environment, Yc);
}));
// node_modules/pixi.js/lib/utils/browser/unsafeEvalSupported.mjs
function Zc() {
	if (typeof Qc == "boolean") return Qc;
	try {
		Qc = Function("param1", "param2", "param3", "return param1[param2] === param3;")({ a: "b" }, "a", "b") === !0;
	} catch {
		Qc = !1;
	}
	return Qc;
}
var Qc, $c = o((() => {}));
// node_modules/earcut/src/earcut.js
function el(e, t, n = 2) {
	let r = t && t.length, i = r ? t[0] * n : e.length;
	Ll.size && Ll.clear();
	let a = tl(e, 0, i, n, !0), o = [];
	if (!a || a.next === a.prev) return o;
	let s = 0, c = 0, l = 0;
	if (r && (a = cl(e, t, a, n)), e.length > 80 * n) {
		s = e[0], c = e[1];
		let t = s, r = c;
		for (let a = n; a < i; a += n) {
			let n = e[a], i = e[a + 1];
			n < s && (s = n), i < c && (c = i), n > t && (t = n), i > r && (r = i);
		}
		l = Math.max(t - s, r - c), l = l === 0 ? 0 : 32767 / l;
	}
	return rl(a, o, s, c, l), o;
}
function tl(e, t, n, r, i) {
	let a = null;
	if (i === Il(e, t, n, r) > 0) for (let i = t; i < n; i += r) a = Nl(i / r | 0, e[i], e[i + 1], a);
	else for (let i = n - r; i >= t; i -= r) a = Nl(i / r | 0, e[i], e[i + 1], a);
	return a && El(a, a.next) && (Pl(a), a = a.next), a;
}
function nl(e, t = e) {
	let n = t === e, r = e, i;
	do
		i = !1, r !== r.next && (Ll.size === 0 || !Ll.has(r)) && (El(r, r.next) || Tl(r.prev, r, r.next) === 0) ? ((n || r === t) && (t = r.prev), Rl = !0, Pl(r), r = r.prev, i = !0) : (n || r !== t) && (r = r.next, i = !n);
	while (i || r !== t);
	return t;
}
function rl(e, t, n, r, i) {
	i && vl(e, n, r, i);
	let a = e, o = !1;
	for (; e.prev !== e.next;) {
		let s = e.prev, c = e.next;
		if (Tl(s, e, c) < 0 && (i ? al(e, n, r, i) : il(e))) t.push(s.i, e.i, c.i), Pl(e), e = c, a = c;
		else if (e = c, e === a) {
			if (Rl = !1, e = nl(e), Rl) {
				a = e;
				continue;
			}
			if (!o) {
				e = ol(e, t), a = e, o = !0;
				continue;
			}
			sl(e, t, n, r, i);
			break;
		}
	}
}
function il(e) {
	let t = e.prev, n = e, r = e.next, i = t.x, a = n.x, o = r.x, s = t.y, c = n.y, l = r.y, u = Math.min(i, a, o), d = Math.min(s, c, l), f = Math.max(i, a, o), p = Math.max(s, c, l), m = r.next;
	for (; m !== t;) {
		if (m.x >= u && m.x <= f && m.y >= d && m.y <= p && (i !== m.x || s !== m.y) && Cl(i, s, a, c, o, l, m.x, m.y) && Tl(m.prev, m, m.next) >= 0) return !1;
		m = m.next;
	}
	return !0;
}
function al(e, t, n, r) {
	let i = e.prev, a = e, o = e.next, s = i.x, c = a.x, l = o.x, u = i.y, d = a.y, f = o.y, p = Math.min(s, c, l), m = Math.min(u, d, f), h = Math.max(s, c, l), g = Math.max(u, d, f), _ = xl(p, m, t, n, r), v = xl(h, g, t, n, r), y = e.prevZ;
	for (; y && y.z >= _;) {
		if (y.x >= p && y.x <= h && y.y >= m && y.y <= g && y !== o && (s !== y.x || u !== y.y) && Cl(s, u, c, d, l, f, y.x, y.y) && Tl(y.prev, y, y.next) >= 0) return !1;
		y = y.prevZ;
	}
	let b = e.nextZ;
	for (; b && b.z <= v;) {
		if (b.x >= p && b.x <= h && b.y >= m && b.y <= g && b !== o && (s !== b.x || u !== b.y) && Cl(s, u, c, d, l, f, b.x, b.y) && Tl(b.prev, b, b.next) >= 0) return !1;
		b = b.nextZ;
	}
	return !0;
}
function ol(e, t) {
	let n = e, r = !1;
	do {
		let i = n.prev, a = n.next.next;
		Dl(i, n, n.next, a, !1) && Al(i, a) && Al(a, i) && (t.push(i.i, n.i, a.i), Pl(n), Pl(n.next), n = e = a, r = !0), n = n.next;
	} while (n !== e);
	return r ? nl(n) : n;
}
function sl(e, t, n, r, i) {
	let a = e;
	do {
		let e = a.next.next;
		for (; e !== a.prev;) {
			if (a.i !== e.i && wl(a, e)) {
				let o = Ml(a, e);
				a = nl(a, a.next), o = nl(o, o.next), rl(a, t, n, r, i), rl(o, t, n, r, i);
				return;
			}
			e = e.next;
		}
		a = a.next;
	} while (a !== e);
}
function cl(e, t, n, r) {
	let i = [];
	for (let n = 0, a = t.length; n < a; n++) {
		let o = tl(e, t[n] * r, n < a - 1 ? t[n + 1] * r : e.length, r, !1);
		o === o.next && Ll.add(o), i.push(Sl(o));
	}
	i.sort(ll), dl(e.length / r, t.length), fl(n, n), zl = !0;
	for (let e = 0; e < i.length; e++) n = ul(i[e], n);
	return zl = !1, nl(n);
}
function ll(e, t) {
	return e.x - t.x || e.y - t.y || (e.next.y - e.y) / (e.next.x - e.x) - (t.next.y - t.y) / (t.next.x - t.x);
}
function ul(e, t) {
	let n = gl(e, t);
	if (!n) return t;
	let r = Ml(n, e), i = r.next;
	return fl(n, i.next), nl(r, r.next), nl(n, n.next);
}
function dl(e, t) {
	let n = Math.ceil((e + 2 * t) / Bl) + t + 2;
	Vl.length < n * 4 && (Vl = new Float64Array(n * 4)), Hl = 0;
}
function fl(e, t) {
	let n = e;
	do {
		let e = Hl++;
		Ul[e] = n;
		let r = n.x, i = n.y, a = n.x, o = n.y, s = 0;
		do {
			let t = n.next;
			n.z = e, t.x < r && (r = t.x), t.x > a && (a = t.x), t.y < i && (i = t.y), t.y > o && (o = t.y), n = t;
		} while (++s < Bl && n !== t);
		Wl[e] = n;
		let c = e * 4;
		Vl[c] = r, Vl[c + 1] = i, Vl[c + 2] = a, Vl[c + 3] = o;
	} while (n !== t);
}
function pl(e, t) {
	let n = e.z * 4;
	t.x < Vl[n] && (Vl[n] = t.x), t.y < Vl[n + 1] && (Vl[n + 1] = t.y), t.x > Vl[n + 2] && (Vl[n + 2] = t.x), t.y > Vl[n + 3] && (Vl[n + 3] = t.y);
}
function ml(e) {
	let t = Wl[e];
	for (; t.prev.next !== t;) t = t.next;
	return Wl[e] = t, t;
}
function hl(e) {
	let t = Ul[e];
	for (; t.prev.next !== t;) t = t.next;
	return Ul[e] = t, t;
}
function gl(e, t) {
	let n = t, r = e.x, i = e.y, a = -Infinity, o;
	if (El(e, n)) return n;
	for (let t = 0, s = 0; t < Hl; t++, s += 4) {
		if (i < Vl[s + 1] || i > Vl[s + 3] || Vl[s] > r || Vl[s + 2] <= a) continue;
		let c = ml(t);
		n = hl(t);
		do {
			if (n.prev.next === n) {
				if (El(e, n.next)) return n.next;
				if (i <= n.y && i >= n.next.y && n.next.y !== n.y) {
					let e = n.x + (i - n.y) * (n.next.x - n.x) / (n.next.y - n.y);
					if (e <= r && e > a && (a = e, o = n.x < n.next.x ? n : n.next, e === r)) return o;
				}
			}
			n = n.next;
		} while (n !== c);
	}
	if (!o) return null;
	let s = o.x, c = o.y, l = Math.min(i, c), u = Math.max(i, c), d = Infinity;
	for (let t = 0, f = 0; t < Hl; t++, f += 4) {
		if (Vl[f + 2] < s || Vl[f] > r || Vl[f + 3] < l || Vl[f + 1] > u) continue;
		let p = ml(t);
		n = hl(t);
		do {
			if (n.prev.next === n && r >= n.x && n.x >= s && r !== n.x && Cl(i < c ? r : a, i, s, c, i < c ? a : r, i, n.x, n.y)) {
				let t = Math.abs(i - n.y) / (r - n.x);
				(Al(n, e) || n.y === i && n.next.y === i && n.next.x > r) && (t < d || t === d && (n.x > o.x || n.x === o.x && _l(o, n))) && (o = n, d = t);
			}
			n = n.next;
		} while (n !== p);
	}
	return o;
}
function _l(e, t) {
	return Tl(e.prev, e, t.prev) < 0 && Tl(t.next, e, e.next) < 0;
}
function vl(e, t, n, r) {
	let i = e, a = 0;
	do
		i.z = xl(i.x, i.y, t, n, r), Gl[a++] = i, i = i.next;
	while (i !== e);
	yl(a);
	let o = null;
	for (let e = 0; e < a; e++) {
		let t = Gl[e];
		t.prevZ = o, o && (o.nextZ = t), o = t;
	}
	o.nextZ = null, Gl.fill(null, 0, a), Kl.fill(null, 0, a);
}
function yl(e) {
	if (e <= 32) for (let t = 1; t < e; t++) {
		let e = Gl[t], n = e.z, r = t - 1;
		for (; r >= 0 && Gl[r].z > n;) Gl[r + 1] = Gl[r], r--;
		Gl[r + 1] = e;
	}
	else {
		ql.length < e && (ql = new Uint32Array(e), Jl = new Uint32Array(e), Kl = Array(e));
		for (let t = 0; t < e; t++) ql[t] = Gl[t].z;
		bl(e, Gl, ql, Kl, Jl, 0), bl(e, Kl, Jl, Gl, ql, 8), bl(e, Gl, ql, Kl, Jl, 16), bl(e, Kl, Jl, Gl, ql, 24);
	}
}
function bl(e, t, n, r, i, a) {
	Yl.fill(0);
	for (let t = 0; t < e; t++) Yl[n[t] >>> a & 255]++;
	let o = 0;
	for (let e = 0; e < 256; e++) {
		let t = Yl[e];
		Yl[e] = o, o += t;
	}
	for (let o = 0; o < e; o++) {
		let e = n[o], s = Yl[e >>> a & 255]++;
		r[s] = t[o], i[s] = e;
	}
}
function xl(e, t, n, r, i) {
	return e = (e - n) * i | 0, t = (t - r) * i | 0, e = (e | e << 8) & 16711935, e = (e | e << 4) & 252645135, e = (e | e << 2) & 858993459, e = (e | e << 1) & 1431655765, t = (t | t << 8) & 16711935, t = (t | t << 4) & 252645135, t = (t | t << 2) & 858993459, t = (t | t << 1) & 1431655765, e | t << 1;
}
function Sl(e) {
	let t = e, n = e;
	do
		(t.x < n.x || t.x === n.x && t.y < n.y) && (n = t), t = t.next;
	while (t !== e);
	return n;
}
function Cl(e, t, n, r, i, a, o, s) {
	return (i - o) * (t - s) >= (e - o) * (a - s) && (e - o) * (r - s) >= (n - o) * (t - s) && (n - o) * (a - s) >= (i - o) * (r - s);
}
function wl(e, t) {
	let n = El(e, t) && Tl(e.prev, e, e.next) > 0 && Tl(t.prev, t, t.next) > 0;
	return e.next.i !== t.i && (n || Al(e, t) && Al(t, e) && (Tl(e.prev, e, t.prev) !== 0 || Tl(e, t.prev, t) !== 0)) && !kl(e, t) && (n || jl(e, t));
}
function Tl(e, t, n) {
	return (t.y - e.y) * (n.x - t.x) - (t.x - e.x) * (n.y - t.y);
}
function El(e, t) {
	return e.x === t.x && e.y === t.y;
}
function Dl(e, t, n, r, i = !0) {
	let a = Tl(e, t, n), o = Tl(e, t, r), s = Tl(n, r, e), c = Tl(n, r, t);
	return (a > 0 && o < 0 || a < 0 && o > 0) && (s > 0 && c < 0 || s < 0 && c > 0) ? !0 : i ? !!(a === 0 && Ol(e, n, t) || o === 0 && Ol(e, r, t) || s === 0 && Ol(n, e, r) || c === 0 && Ol(n, t, r)) : !1;
}
function Ol(e, t, n) {
	return t.x <= Math.max(e.x, n.x) && t.x >= Math.min(e.x, n.x) && t.y <= Math.max(e.y, n.y) && t.y >= Math.min(e.y, n.y);
}
function kl(e, t) {
	let n = Math.min(e.x, t.x), r = Math.max(e.x, t.x), i = Math.min(e.y, t.y), a = Math.max(e.y, t.y), o = e;
	do {
		let s = o.next;
		if (o.x > r && s.x > r || o.x < n && s.x < n || o.y > a && s.y > a || o.y < i && s.y < i) o = s;
		else {
			if (o.i !== e.i && s.i !== e.i && o.i !== t.i && s.i !== t.i && Dl(o, s, e, t)) return !0;
			o = s;
		}
	} while (o !== e);
	return !1;
}
function Al(e, t) {
	return Tl(e.prev, e, e.next) < 0 ? Tl(e, t, e.next) >= 0 && Tl(e, e.prev, t) >= 0 : Tl(e, t, e.prev) < 0 || Tl(e, e.next, t) < 0;
}
function jl(e, t) {
	let n = e, r = !1, i = (e.x + t.x) / 2, a = (e.y + t.y) / 2;
	do {
		let e = n.next;
		n.y > a != e.y > a && i < (e.x - n.x) * (a - n.y) / (e.y - n.y) + n.x && (r = !r), n = e;
	} while (n !== e);
	return r;
}
function Ml(e, t) {
	let n = Fl(e.i, e.x, e.y), r = Fl(t.i, t.x, t.y), i = e.next, a = t.prev;
	return e.next = t, t.prev = e, n.next = i, i.prev = n, r.next = n, n.prev = r, a.next = r, r.prev = a, r;
}
function Nl(e, t, n, r) {
	let i = Fl(e, t, n);
	return r ? (i.next = r.next, i.prev = r, r.next.prev = i, r.next = i) : (i.prev = i, i.next = i), i;
}
function Pl(e) {
	e.next.prev = e.prev, e.prev.next = e.next, e.prevZ && (e.prevZ.nextZ = e.nextZ), e.nextZ && (e.nextZ.prevZ = e.prevZ), zl && pl(e.prev, e.next);
}
function Fl(e, t, n) {
	return {
		i: e,
		x: t,
		y: n,
		prev: null,
		next: null,
		z: 0,
		prevZ: null,
		nextZ: null
	};
}
function Il(e, t, n, r) {
	let i = 0;
	for (let a = t, o = n - r; a < n; a += r) i += (e[o] - e[a]) * (e[a + 1] + e[o + 1]), o = a;
	return i;
}
var Ll, Rl, zl, Bl, Vl, Hl, Ul, Wl, Gl, Kl, ql, Jl, Yl, Xl = o((() => {
	Ll = /* @__PURE__ */ new Set(), Rl = !1, zl = !1, Bl = 16, Vl = /* @__PURE__ */ new Float64Array(), Hl = 0, Ul = [], Wl = [], Gl = [], Kl = [], ql = /* @__PURE__ */ new Uint32Array(), Jl = /* @__PURE__ */ new Uint32Array(), Yl = /* @__PURE__ */ new Uint32Array(256);
})), Zl, Ql = o((() => {
	Xl(), y(), Zl = el.default || el;
})), $l, eu = o((() => {
	$l = /* @__PURE__ */ ((e) => (e[e.NONE = 0] = "NONE", e[e.COLOR = 16384] = "COLOR", e[e.STENCIL = 1024] = "STENCIL", e[e.DEPTH = 256] = "DEPTH", e[e.COLOR_DEPTH = 16640] = "COLOR_DEPTH", e[e.COLOR_STENCIL = 17408] = "COLOR_STENCIL", e[e.DEPTH_STENCIL = 1280] = "DEPTH_STENCIL", e[e.ALL = 17664] = "ALL", e))($l || {});
})), tu, nu = o((() => {
	tu = class {
		constructor(e) {
			this.items = [], this._name = e;
		}
		emit(e, t, n, r, i, a, o, s) {
			let { name: c, items: l } = this;
			for (let u = 0, d = l.length; u < d; u++) l[u][c](e, t, n, r, i, a, o, s);
			return this;
		}
		add(e) {
			return e[this._name] && (this.remove(e), this.items.push(e)), this;
		}
		remove(e) {
			let t = this.items.indexOf(e);
			return t !== -1 && this.items.splice(t, 1), this;
		}
		contains(e) {
			return this.items.indexOf(e) !== -1;
		}
		removeAll() {
			return this.items.length = 0, this;
		}
		destroy() {
			this.removeAll(), this.items = null, this._name = null;
		}
		get empty() {
			return this.items.length === 0;
		}
		get name() {
			return this._name;
		}
	};
})), ru, iu, au, ou = o((() => {
	ke(), Xc(), dr(), $c(), We(), Xe(), et(), eu(), nu(), y(), ru = [
		"init",
		"destroy",
		"contextChange",
		"resolutionChange",
		"resetState",
		"renderEnd",
		"renderStart",
		"render",
		"update",
		"postrender",
		"prerender"
	], iu = class e extends v {
		constructor(e) {
			super(), this.tick = 0, this.uid = N("renderer"), this.runners = /* @__PURE__ */ Object.create(null), this.renderPipes = /* @__PURE__ */ Object.create(null), this._initOptions = {}, this._systemsHash = /* @__PURE__ */ Object.create(null), this.type = e.type, this.name = e.name, this.config = e;
			let t = [...ru, ...this.config.runners ?? []];
			this._addRunners(...t), this._unsafeEvalCheck();
		}
		async init(t = {}) {
			let n = t.skipExtensionImports === !0 || t.manageImports === !1;
			await Jc(n), !n && this.config.loaders && await Promise.all(this.config.loaders.map((e) => e.value.load())), this._addSystems(this.config.systems), this._addPipes(this.config.renderPipes, this.config.renderPipeAdaptors);
			for (let e in this._systemsHash) t = {
				...this._systemsHash[e].constructor.defaultOptions,
				...t
			};
			t = {
				...e.defaultOptions,
				...t
			}, this._roundPixels = +!!t.roundPixels;
			for (let e = 0; e < this.runners.init.items.length; e++) await this.runners.init.items[e].init(t);
			this._initOptions = t;
		}
		render(e, t) {
			this.tick++;
			let n = e;
			if (n instanceof H && (n = { container: n }, t && (F(P, "passing a second argument is deprecated, please use render options instead"), n.target = t.renderTexture)), n.target || (n.target = this.view.renderTarget), n.target === this.view.renderTarget && (this._lastObjectRendered = n.container, n.clearColor ?? (n.clearColor = this.background.colorRgba), n.clear ?? (n.clear = this.background.clearBeforeRender)), n.clearColor) {
				let e = Array.isArray(n.clearColor) && n.clearColor.length === 4;
				n.clearColor = e ? n.clearColor : A.shared.setValue(n.clearColor).toArray();
			}
			n.transform || (n.container.updateLocalTransform(), n.transform = n.container.localTransform), n.container.visible && (n.container.enableRenderGroup(), this.runners.prerender.emit(n), this.runners.renderStart.emit(n), this.runners.render.emit(n), this.runners.renderEnd.emit(n), this.runners.postrender.emit(n));
		}
		resize(e, t, n) {
			let r = this.view.resolution;
			this.view.resize(e, t, n), this.emit("resize", this.view.screen.width, this.view.screen.height, this.view.resolution), n !== void 0 && n !== r && this.runners.resolutionChange.emit(n);
		}
		clear(e = {}) {
			let t = this;
			e.target ||= t.renderTarget.renderTarget, e.clearColor ||= this.background.colorRgba, e.clear ??= $l.ALL;
			let { clear: n, clearColor: r, target: i, mipLevel: a, layer: o } = e;
			A.shared.setValue(r ?? this.background.colorRgba), t.renderTarget.clear(i, n, A.shared.toArray(), a ?? 0, o ?? 0);
		}
		get resolution() {
			return this.view.resolution;
		}
		set resolution(e) {
			this.view.resolution = e, this.runners.resolutionChange.emit(e);
		}
		get width() {
			return this.view.texture.frame.width;
		}
		get height() {
			return this.view.texture.frame.height;
		}
		get canvas() {
			return this.view.canvas;
		}
		get lastObjectRendered() {
			return this._lastObjectRendered;
		}
		get renderingToScreen() {
			return this.renderTarget.renderingToScreen;
		}
		get screen() {
			return this.view.screen;
		}
		_addRunners(...e) {
			e.forEach((e) => {
				this.runners[e] = new tu(e);
			});
		}
		_addSystems(e) {
			let t;
			for (t in e) {
				let n = e[t];
				this._addSystem(n.value, n.name);
			}
		}
		_addSystem(e, t) {
			let n = new e(this);
			if (this[t]) throw Error(`Whoops! The name "${t}" is already in use`);
			this[t] = n, this._systemsHash[t] = n;
			for (let e in this.runners) this.runners[e].add(n);
			return this;
		}
		_addPipes(e, t) {
			let n = t.reduce((e, t) => (e[t.name] = t.value, e), {});
			e.forEach((e) => {
				let t = e.value, r = e.name, i = n[r];
				this.renderPipes[r] = new t(this, i ? new i() : null), this.runners.destroy.add(this.renderPipes[r]);
			});
		}
		destroy(e = !1) {
			this.runners.destroy.items.reverse(), this.runners.destroy.emit(e), (e === !0 || typeof e == "object" && e.releaseGlobalResources) && $e.release(), Object.values(this.runners).forEach((e) => {
				e.destroy();
			}), this._systemsHash = null, this.renderPipes = null, this.removeAllListeners();
		}
		generateTexture(e) {
			return this.textureGenerator.generateTexture(e);
		}
		get roundPixels() {
			return !!this._roundPixels;
		}
		_unsafeEvalCheck() {
			if (!Zc()) throw Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.");
		}
		resetState() {
			this.runners.resetState.emit();
		}
	}, iu.defaultOptions = {
		resolution: 1,
		failIfMajorPerformanceCaveat: !1,
		roundPixels: !1
	}, au = iu;
}));
W(), ou();
var su;
function cu(e) {
	return su === void 0 && (su = (() => {
		let t = {
			stencil: !0,
			failIfMajorPerformanceCaveat: e ?? au.defaultOptions.failIfMajorPerformanceCaveat
		};
		try {
			if (!U.get().getWebGLRenderingContext()) return !1;
			let e = U.get().createCanvas().getContext("webgl", t), n = !!e?.getContextAttributes()?.stencil;
			if (e) {
				let t = e.getExtension("WEBGL_lose_context");
				t && t.loseContext();
			}
			return e = null, n;
		} catch {
			return !1;
		}
	})()), su;
}
// node_modules/pixi.js/lib/utils/browser/isWebGPUSupported.mjs
W();
var lu;
async function uu(e = {}) {
	return lu === void 0 && (lu = await (async () => {
		let t = U.get().getNavigator().gpu;
		if (!t) return !1;
		try {
			return await (await t.requestAdapter(e)).requestDevice(), !0;
		} catch {
			return !1;
		}
	})()), lu;
}
// node_modules/pixi.js/lib/rendering/high-shader/compiler/utils/addBits.mjs
function du(e, t, n) {
	if (e) for (let r in e) {
		let i = t[r.toLocaleLowerCase()];
		if (i) {
			let t = e[r];
			r === "header" && (t = t.replace(/@in\s+[^;]+;\s*/g, "").replace(/@out\s+[^;]+;\s*/g, "")), n && i.push(`//----${n}----//`), i.push(t);
		} else I(`${r} placement hook does not exist in shader`);
	}
}
var fu = o((() => {
	L();
}));
// node_modules/pixi.js/lib/rendering/high-shader/compiler/utils/compileHooks.mjs
function pu(e) {
	let t = {};
	return (e.match(mu)?.map((e) => e.replace(/[{()}]/g, "")) ?? []).forEach((e) => {
		t[e] = [];
	}), t;
}
var mu, hu = o((() => {
	mu = /\{\{(.*?)\}\}/g;
}));
// node_modules/pixi.js/lib/rendering/high-shader/compiler/utils/compileInputs.mjs
function gu(e, t) {
	let n, r = /@in\s+([^;]+);/g;
	for (; (n = r.exec(e)) !== null;) t.push(n[1]);
}
function _u(e, t, n = !1) {
	let r = [];
	gu(t, r), e.forEach((e) => {
		e.header && gu(e.header, r);
	});
	let i = r;
	n && i.sort();
	let a = i.map((e, t) => `       @location(${t}) ${e},`).join("\n"), o = t.replace(/@in\s+[^;]+;\s*/g, "");
	return o = o.replace("{{in}}", `
${a}
`), o;
}
var vu = o((() => {}));
// node_modules/pixi.js/lib/rendering/high-shader/compiler/utils/compileOutputs.mjs
function yu(e, t) {
	let n, r = /@out\s+([^;]+);/g;
	for (; (n = r.exec(e)) !== null;) t.push(n[1]);
}
function bu(e) {
	let t = /\b(\w+)\s*:/g.exec(e);
	return t ? t[1] : "";
}
function xu(e) {
	return e.replace(/@.*?\s+/g, "");
}
function Su(e, t) {
	let n = [];
	yu(t, n), e.forEach((e) => {
		e.header && yu(e.header, n);
	});
	let r = 0, i = n.sort().map((e) => e.indexOf("builtin") > -1 ? e : `@location(${r++}) ${e}`).join(",\n"), a = n.sort().map((e) => `       var ${xu(e)};`).join("\n"), o = `return VSOutput(
            ${n.sort().map((e) => ` ${bu(e)}`).join(",\n")});`, s = t.replace(/@out\s+[^;]+;\s*/g, "");
	return s = s.replace("{{struct}}", `
${i}
`), s = s.replace("{{start}}", `
${a}
`), s = s.replace("{{return}}", `
${o}
`), s;
}
var Cu = o((() => {}));
// node_modules/pixi.js/lib/rendering/high-shader/compiler/utils/injectBits.mjs
function wu(e, t) {
	let n = e;
	for (let e in t) {
		let r = t[e];
		n = r.join("\n").length ? n.replace(`{{${e}}}`, `//-----${e} START-----//
${r.join("\n")}
//----${e} FINISH----//`) : n.replace(`{{${e}}}`, "");
	}
	return n;
}
var Tu = o((() => {}));
// node_modules/pixi.js/lib/rendering/high-shader/compiler/compileHighShader.mjs
function Eu({ template: e, bits: t }) {
	let n = ku(e, t);
	if (ju[n]) return ju[n];
	let { vertex: r, fragment: i } = Ou(e, t);
	return ju[n] = Au(r, i, t), ju[n];
}
function Du({ template: e, bits: t }) {
	let n = ku(e, t);
	return ju[n] || (ju[n] = Au(e.vertex, e.fragment, t)), ju[n];
}
function Ou(e, t) {
	let n = t.map((e) => e.vertex).filter((e) => !!e), r = t.map((e) => e.fragment).filter((e) => !!e), i = _u(n, e.vertex, !0);
	i = Su(n, i);
	let a = _u(r, e.fragment, !0);
	return {
		vertex: i,
		fragment: a
	};
}
function ku(e, t) {
	return t.map((e) => (Mu.has(e) || Mu.set(e, Nu++), Mu.get(e))).sort((e, t) => e - t).join("-") + e.vertex + e.fragment;
}
function Au(e, t, n) {
	let r = pu(e), i = pu(t);
	return n.forEach((e) => {
		du(e.vertex, r, e.name), du(e.fragment, i, e.name);
	}), {
		vertex: wu(e, r),
		fragment: wu(t, i)
	};
}
var ju, Mu, Nu, Pu = o((() => {
	fu(), hu(), vu(), Cu(), Tu(), ju = /* @__PURE__ */ Object.create(null), Mu = /* @__PURE__ */ new Map(), Nu = 0;
})), Fu, Iu, Lu, Ru, zu = o((() => {
	Fu = "\n    @in aPosition: vec2<f32>;\n    @in aUV: vec2<f32>;\n\n    @out @builtin(position) vPosition: vec4<f32>;\n    @out vUV : vec2<f32>;\n    @out vColor : vec4<f32>;\n\n    {{header}}\n\n    struct VSOutput {\n        {{struct}}\n    };\n\n    @vertex\n    fn main( {{in}} ) -> VSOutput {\n\n        var worldTransformMatrix = globalUniforms.uWorldTransformMatrix;\n        var modelMatrix = mat3x3<f32>(\n            1.0, 0.0, 0.0,\n            0.0, 1.0, 0.0,\n            0.0, 0.0, 1.0\n          );\n        var position = aPosition;\n        var uv = aUV;\n\n        {{start}}\n\n        vColor = vec4<f32>(1., 1., 1., 1.);\n\n        {{main}}\n\n        vUV = uv;\n\n        var modelViewProjectionMatrix = globalUniforms.uProjectionMatrix * worldTransformMatrix * modelMatrix;\n\n        vPosition =  vec4<f32>((modelViewProjectionMatrix *  vec3<f32>(position, 1.0)).xy, 0.0, 1.0);\n\n        vColor *= globalUniforms.uWorldColorAlpha;\n\n        {{end}}\n\n        {{return}}\n    };\n", Iu = "\n    @in vUV : vec2<f32>;\n    @in vColor : vec4<f32>;\n\n    {{header}}\n\n    @fragment\n    fn main(\n        {{in}}\n      ) -> @location(0) vec4<f32> {\n\n        {{start}}\n\n        var outColor:vec4<f32>;\n\n        {{main}}\n\n        var finalColor:vec4<f32> = outColor * vColor;\n\n        {{end}}\n\n        return finalColor;\n      };\n", Lu = "\n    in vec2 aPosition;\n    in vec2 aUV;\n\n    out vec4 vColor;\n    out vec2 vUV;\n\n    {{header}}\n\n    void main(void){\n\n        mat3 worldTransformMatrix = uWorldTransformMatrix;\n        mat3 modelMatrix = mat3(\n            1.0, 0.0, 0.0,\n            0.0, 1.0, 0.0,\n            0.0, 0.0, 1.0\n          );\n        vec2 position = aPosition;\n        vec2 uv = aUV;\n\n        {{start}}\n\n        vColor = vec4(1.);\n\n        {{main}}\n\n        vUV = uv;\n\n        mat3 modelViewProjectionMatrix = uProjectionMatrix * worldTransformMatrix * modelMatrix;\n\n        gl_Position = vec4((modelViewProjectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n\n        vColor *= uWorldColorAlpha;\n\n        {{end}}\n    }\n", Ru = "\n\n    in vec4 vColor;\n    in vec2 vUV;\n\n    out vec4 finalColor;\n\n    {{header}}\n\n    void main(void) {\n\n        {{start}}\n\n        vec4 outColor;\n\n        {{main}}\n\n        finalColor = outColor * vColor;\n\n        {{end}}\n    }\n";
})), Bu, Vu, Hu = o((() => {
	Bu = {
		name: "global-uniforms-bit",
		vertex: { header: "\n        struct GlobalUniforms {\n            uProjectionMatrix:mat3x3<f32>,\n            uWorldTransformMatrix:mat3x3<f32>,\n            uWorldColorAlpha: vec4<f32>,\n            uResolution: vec2<f32>,\n        }\n\n        @group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;\n        " }
	}, Vu = {
		name: "global-uniforms-bit",
		vertex: { header: "\n          uniform mat3 uProjectionMatrix;\n          uniform mat3 uWorldTransformMatrix;\n          uniform vec4 uWorldColorAlpha;\n          uniform vec2 uResolution;\n        " }
	};
}));
// node_modules/pixi.js/lib/rendering/high-shader/compileHighShaderToProgram.mjs
function Uu({ bits: e, name: t }) {
	let n = Eu({
		template: {
			fragment: Iu,
			vertex: Fu
		},
		bits: [Bu, ...e]
	});
	return Rs.from({
		name: t,
		vertex: {
			source: n.vertex,
			entryPoint: "main"
		},
		fragment: {
			source: n.fragment,
			entryPoint: "main"
		}
	});
}
function Wu({ bits: e, name: t }) {
	return new fs({
		name: t,
		...Du({
			template: {
				vertex: Lu,
				fragment: Ru
			},
			bits: [Vu, ...e]
		})
	});
}
var Gu = o((() => {
	ps(), zs(), Pu(), zu(), Hu();
})), Ku, qu, Ju = o((() => {
	Ku = {
		name: "color-bit",
		vertex: {
			header: "\n            @in aColor: vec4<f32>;\n        ",
			main: "\n            vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);\n        "
		}
	}, qu = {
		name: "color-bit",
		vertex: {
			header: "\n            in vec4 aColor;\n        ",
			main: "\n            vColor *= vec4(aColor.rgb * aColor.a, aColor.a);\n        "
		}
	};
}));
// node_modules/pixi.js/lib/rendering/high-shader/shader-bits/generateTextureBatchBit.mjs
function Yu(e) {
	let t = [];
	if (e === 1) t.push("@group(1) @binding(0) var textureSource1: texture_2d<f32>;"), t.push("@group(1) @binding(1) var textureSampler1: sampler;");
	else {
		let n = 0;
		for (let r = 0; r < e; r++) t.push(`@group(1) @binding(${n++}) var textureSource${r + 1}: texture_2d<f32>;`), t.push(`@group(1) @binding(${n++}) var textureSampler${r + 1}: sampler;`);
	}
	return t.join("\n");
}
function Xu(e) {
	let t = [];
	if (e === 1) t.push("outColor = textureSampleGrad(textureSource1, textureSampler1, vUV, uvDx, uvDy);");
	else {
		t.push("switch vTextureId {");
		for (let n = 0; n < e; n++) n === e - 1 ? t.push("  default:{") : t.push(`  case ${n}:{`), t.push(`      outColor = textureSampleGrad(textureSource${n + 1}, textureSampler${n + 1}, vUV, uvDx, uvDy);`), t.push("      break;}");
		t.push("}");
	}
	return t.join("\n");
}
function Zu(e) {
	return ed[e] || (ed[e] = {
		name: "texture-batch-bit",
		vertex: {
			header: "\n                @in aTextureIdAndRound: vec2<u32>;\n                @out @interpolate(flat) vTextureId : u32;\n            ",
			main: "\n                vTextureId = aTextureIdAndRound.y;\n            ",
			end: "\n                if(aTextureIdAndRound.x == 1)\n                {\n                    vPosition = vec4<f32>(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);\n                }\n            "
		},
		fragment: {
			header: `
                @in @interpolate(flat) vTextureId: u32;

                ${Yu(e)}
            `,
			main: `
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);

                ${Xu(e)}
            `
		}
	}), ed[e];
}
function Qu(e) {
	let t = [];
	for (let n = 0; n < e; n++) n > 0 && t.push("else"), n < e - 1 && t.push(`if(vTextureId < ${n}.5)`), t.push("{"), t.push(`	outColor = texture(uTextures[${n}], vUV);`), t.push("}");
	return t.join("\n");
}
function $u(e) {
	return td[e] || (td[e] = {
		name: "texture-batch-bit",
		vertex: {
			header: "\n                in vec2 aTextureIdAndRound;\n                out float vTextureId;\n\n            ",
			main: "\n                vTextureId = aTextureIdAndRound.y;\n            ",
			end: "\n                if(aTextureIdAndRound.x == 1.)\n                {\n                    gl_Position.xy = roundPixels(gl_Position.xy, uResolution);\n                }\n            "
		},
		fragment: {
			header: `
                in float vTextureId;

                uniform sampler2D uTextures[${e}];

            `,
			main: `

                ${Qu(e)}
            `
		}
	}), td[e];
}
var ed, td, nd = o((() => {
	ed = {}, td = {};
})), rd, id, ad, od = o((() => {
	rd = {
		name: "local-uniform-bit",
		vertex: {
			header: "\n\n            struct LocalUniforms {\n                uTransformMatrix:mat3x3<f32>,\n                uColor:vec4<f32>,\n                uRound:f32,\n            }\n\n            @group(1) @binding(0) var<uniform> localUniforms : LocalUniforms;\n        ",
			main: "\n            vColor *= localUniforms.uColor;\n            modelMatrix *= localUniforms.uTransformMatrix;\n        ",
			end: "\n            if(localUniforms.uRound == 1)\n            {\n                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);\n            }\n        "
		}
	}, id = {
		...rd,
		vertex: {
			...rd.vertex,
			header: rd.vertex.header.replace("group(1)", "group(2)")
		}
	}, ad = {
		name: "local-uniform-bit",
		vertex: {
			header: "\n\n            uniform mat3 uTransformMatrix;\n            uniform vec4 uColor;\n            uniform float uRound;\n        ",
			main: "\n            vColor *= uColor;\n            modelMatrix = uTransformMatrix;\n        ",
			end: "\n            if(uRound == 1.)\n            {\n                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);\n            }\n        "
		}
	};
})), sd, cd, ld = o((() => {
	sd = {
		name: "round-pixels-bit",
		vertex: { header: "\n            fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32>\n            {\n                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;\n            }\n        " }
	}, cd = {
		name: "round-pixels-bit",
		vertex: { header: "\n            vec2 roundPixels(vec2 position, vec2 targetSize)\n            {\n                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;\n            }\n        " }
	};
}));
// node_modules/pixi.js/lib/rendering/batcher/gpu/getTextureBatchBindGroup.mjs
function ud(e, t, n) {
	let r = 2166136261;
	for (let n = 0; n < t; n++) r ^= e[n].uid, r = Math.imul(r, 16777619), r >>>= 0;
	return fd[r] || dd(e, t, r, n);
}
function dd(e, t, n, r) {
	let i = {}, a = 0;
	for (let n = 0; n < r; n++) {
		let r = n < t ? e[n] : B.EMPTY.source;
		i[a++] = r.source, i[a++] = r.style;
	}
	let o = new Hs(i);
	return fd[n] = o, o;
}
var fd, pd = o((() => {
	Us(), V(), fd = {};
})), md, hd = o((() => {
	pd(), md = class {
		constructor() {
			this._maxTextures = 0;
		}
		_getShader(e) {
			return this.shader;
		}
		execute(e, t) {
			let n = t.context, r = e.renderer, i = this._getRenderData(r, n), { batcher: a, instructions: o } = i, s = n.customShader || this._getShader(i), c = r.encoder;
			c.setGeometry(a.geometry, s.gpuProgram);
			let l = r.globalUniforms.bindGroup;
			c.setBindGroup(0, l, s.gpuProgram);
			let u = r.renderPipes.uniformBatch.getUniformBindGroup(s.resources.localUniforms, !0);
			c.setBindGroup(2, u, s.gpuProgram);
			let d = s.gpuProgram.layout;
			for (let e = 3; e < d.length; e++) {
				let t = s.groups[e];
				if (d[e] && t) {
					for (let e in t.resources) {
						let n = t.resources[e];
						n?.isUniformGroup && r.ubo.updateUniformGroup(n);
					}
					c.setBindGroup(e, t, s.gpuProgram);
				}
			}
			let f = o.instructions, p = null;
			for (let t = 0; t < o.instructionSize; t++) {
				let n = f[t];
				if (n.topology !== p && (p = n.topology, c.setPipelineFromGeometryProgramAndState(a.geometry, s.gpuProgram, e.state, n.topology, s._overrides)), s.groups[1] = n.bindGroup, !n.gpuBindGroup) {
					let e = n.textures;
					n.bindGroup = ud(e.textures, e.count, this._maxTextures), n.gpuBindGroup = r.bindGroup.getBindGroup(n.bindGroup, s.gpuProgram, 1);
				}
				c.setBindGroup(1, n.bindGroup, s.gpuProgram), c.renderPassEncoder.drawIndexed(n.size, 1, n.start);
			}
		}
		destroy() {
			this.shader.destroy(), this.shader = null;
		}
	};
})), gd, _d = o((() => {
	h(), M(), Gu(), Ju(), nd(), od(), ld(), rc(), tc(), hd(), gd = class extends md {
		contextChange(e) {
			let t = new ec({
				uTransformMatrix: {
					value: new j(),
					type: "mat3x3<f32>"
				},
				uColor: {
					value: new Float32Array([
						1,
						1,
						1,
						1
					]),
					type: "vec4<f32>"
				},
				uRound: {
					value: 0,
					type: "f32"
				}
			});
			this._maxTextures = e.limits.maxBatchableTextures;
			let n = Uu({
				name: "graphics",
				bits: [
					Ku,
					Zu(this._maxTextures),
					id,
					sd
				]
			});
			this.shader = new nc({
				gpuProgram: n,
				resources: { localUniforms: t }
			});
		}
		_getRenderData(e, t) {
			return e.graphicsContext.getContextRenderData(t);
		}
	}, gd.extension = {
		type: [d.WebGPUPipesAdaptor],
		name: "graphics"
	};
})), vd, yd, bd = o((() => {
	vd = {
		name: "texture-bit",
		vertex: {
			header: "\n\n        struct TextureUniforms {\n            uTextureMatrix:mat3x3<f32>,\n        }\n\n        @group(2) @binding(2) var<uniform> textureUniforms : TextureUniforms;\n        ",
			main: "\n            uv = (textureUniforms.uTextureMatrix * vec3(uv, 1.0)).xy;\n        "
		},
		fragment: {
			header: "\n            @group(2) @binding(0) var uTexture: texture_2d<f32>;\n            @group(2) @binding(1) var uSampler: sampler;\n\n\n        ",
			main: "\n            outColor = textureSample(uTexture, uSampler, vUV);\n        "
		}
	}, yd = {
		name: "texture-bit",
		vertex: {
			header: "\n            uniform mat3 uTextureMatrix;\n        ",
			main: "\n            uv = (uTextureMatrix * vec3(uv, 1.0)).xy;\n        "
		},
		fragment: {
			header: "\n        uniform sampler2D uTexture;\n\n\n        ",
			main: "\n            outColor = texture(uTexture, vUV);\n        "
		}
	};
})), xd, Sd = o((() => {
	h(), M(), Gu(), od(), ld(), bd(), rc(), V(), L(), xd = class {
		init() {
			let e = Uu({
				name: "mesh",
				bits: [
					rd,
					vd,
					sd
				]
			});
			this._shader = new nc({
				gpuProgram: e,
				resources: {
					uTexture: B.EMPTY._source,
					uSampler: B.EMPTY._source.style,
					textureUniforms: { uTextureMatrix: {
						type: "mat3x3<f32>",
						value: new j()
					} }
				}
			});
		}
		execute(e, t) {
			let n = e.renderer, r = t._shader;
			if (!r) r = this._shader, r.groups[2] = n.texture.getTextureBindGroup(t.texture);
			else if (!r.gpuProgram) {
				I("Mesh shader has no gpuProgram", t.shader);
				return;
			}
			let i = r.gpuProgram;
			if (i.autoAssignGlobalUniforms && (r.groups[0] = n.globalUniforms.bindGroup), i.autoAssignLocalUniforms) {
				let t = e.localUniforms;
				r.groups[1] = n.renderPipes.uniformBatch.getUniformBindGroup(t, !0);
			}
			n.encoder.draw({
				geometry: t._geometry,
				shader: r,
				state: t.state
			});
		}
		destroy() {
			this._shader.destroy(), this._shader = null;
		}
	}, xd.extension = {
		type: [d.WebGPUPipesAdaptor],
		name: "mesh"
	};
})), Cd, wd, Td = o((() => {
	h(), mc(), pd(), Cd = pc.for2d(), wd = class {
		start(e, t, n) {
			let r = e.renderer, i = r.encoder, a = n.gpuProgram;
			this._shader = n, this._geometry = t, i.setGeometry(t, a), Cd.blendMode = "normal", r.pipeline.getPipeline(t, a, Cd, void 0, n._overrides);
			let o = r.globalUniforms.bindGroup;
			i.resetBindGroup(1), i.setBindGroup(0, o, a);
		}
		execute(e, t) {
			let n = this._shader.gpuProgram, r = e.renderer, i = r.encoder;
			if (!t.bindGroup) {
				let e = t.textures;
				t.bindGroup = ud(e.textures, e.count, r.limits.maxBatchableTextures);
			}
			Cd.blendMode = t.blendMode;
			let a = r.bindGroup.getBindGroup(t.bindGroup, n, 1), o = r.pipeline.getPipeline(this._geometry, n, Cd, t.topology, this._shader._overrides);
			t.bindGroup._touch(r.gc.now), i.setPipeline(o), i.renderPassEncoder.setBindGroup(1, a), i.renderPassEncoder.drawIndexed(t.size, 1, t.start);
		}
	}, wd.extension = {
		type: [d.WebGPUPipesAdaptor],
		name: "batch"
	};
})), Ed, Dd = o((() => {
	h(), Ed = class {
		constructor(e) {
			this._renderer = e;
		}
		updateRenderable() {}
		destroyRenderable() {}
		validateRenderable() {
			return !1;
		}
		addRenderable(e, t) {
			this._renderer.renderPipes.batch.break(t), t.add(e);
		}
		execute(e) {
			e.isRenderable && e.render(this._renderer);
		}
		destroy() {
			this._renderer = null;
		}
	}, Ed.extension = {
		type: [
			d.WebGLPipes,
			d.WebGPUPipes,
			d.CanvasPipes
		],
		name: "customRender"
	};
})), Od, kd = o((() => {
	Od = class {
		constructor() {
			this.batcherName = "default", this.topology = "triangle-list", this.attributeSize = 4, this.indexSize = 6, this.packAsQuad = !0, this.roundPixels = 0, this._attributeStart = 0, this._batcher = null, this._batch = null;
		}
		get blendMode() {
			return this.renderable.groupBlendMode;
		}
		get color() {
			return this.renderable.groupColorAlpha;
		}
		reset() {
			this.renderable = null, this.texture = null, this._batcher = null, this._batch = null, this.bounds = null;
		}
		destroy() {
			this.reset();
		}
	};
}));
// node_modules/pixi.js/lib/scene/container/utils/executeInstructions.mjs
function Ad(e, t) {
	let n = e.instructionSet, r = n.instructions;
	for (let e = 0; e < n.instructionSize; e++) {
		let n = r[e];
		t[n.renderPipeId].execute(n);
	}
}
var jd = o((() => {})), Md, Nd = o((() => {
	h(), M(), at(), kd(), jd(), Md = class {
		constructor(e) {
			this._renderer = e;
		}
		addRenderGroup(e, t) {
			e.isCachedAsTexture ? this._addRenderableCacheAsTexture(e, t) : this._addRenderableDirect(e, t);
		}
		execute(e) {
			e.isRenderable && (e.isCachedAsTexture ? this._executeCacheAsTexture(e) : this._executeDirect(e));
		}
		destroy() {
			this._renderer = null;
		}
		_addRenderableDirect(e, t) {
			this._renderer.renderPipes.batch.break(t), e._batchableRenderGroup &&= (it.return(e._batchableRenderGroup), null), t.add(e);
		}
		_addRenderableCacheAsTexture(e, t) {
			let n = e._batchableRenderGroup ??= it.get(Od);
			n.renderable = e.root, n.transform = e.root.relativeGroupTransform, n.texture = e.texture, n.bounds = e._textureBounds, t.add(e), this._renderer.renderPipes.blendMode.pushBlendMode(e, e.root.groupBlendMode, t), this._renderer.renderPipes.batch.addToBatch(n, t), this._renderer.renderPipes.blendMode.popBlendMode(t);
		}
		_executeCacheAsTexture(e) {
			if (e.textureNeedsUpdate) {
				e.textureNeedsUpdate = !1;
				let t = new j().translate(-e._textureBounds.x, -e._textureBounds.y);
				this._renderer.renderTarget.push({
					target: e.texture,
					clear: !0,
					frame: e.texture.frame
				}), this._renderer.globalUniforms.push({
					worldTransformMatrix: t,
					worldColor: 4294967295,
					offset: {
						x: 0,
						y: 0
					}
				}), Ad(e, this._renderer.renderPipes), this._renderer.renderTarget.finishRenderPass(), this._renderer.renderTarget.pop(), this._renderer.globalUniforms.pop();
			}
			let t = e._batchableRenderGroup, n = t._batcher;
			n.updateElement(t), n.geometry.buffers[0].update(t.attributeSize * n.vertexSize * 4, t._attributeStart * 4);
		}
		_executeDirect(e) {
			this._renderer.globalUniforms.push({
				worldTransformMatrix: e.inverseParentTextureTransform,
				worldColor: e.worldColorAlpha
			}), Ad(e, this._renderer.renderPipes), this._renderer.globalUniforms.pop();
		}
	}, Md.extension = {
		type: [
			d.WebGLPipes,
			d.WebGPUPipes,
			d.CanvasPipes
		],
		name: "renderGroup"
	};
}));
// node_modules/pixi.js/lib/scene/container/utils/clearList.mjs
function Pd(e, t) {
	t ||= 0;
	for (let n = t; n < e.length && e[n]; n++) e[n] = null;
}
var Fd = o((() => {}));
// node_modules/pixi.js/lib/scene/container/utils/updateRenderGroupTransforms.mjs
function Id(e, t = !1) {
	Ld(e);
	let n = e.childrenToUpdate, r = e.updateTick++;
	for (let t in n) {
		let i = Number(t), a = n[t], o = a.list, s = a.index;
		for (let t = 0; t < s; t++) {
			let n = o[t];
			n.parentRenderGroup === e && n.relativeRenderGroupDepth === i && Rd(n, r, 0);
		}
		Pd(o, s), a.index = 0;
	}
	if (t) for (let n = 0; n < e.renderGroupChildren.length; n++) Id(e.renderGroupChildren[n], t);
}
function Ld(e) {
	let t = e.root, n;
	if (e.renderGroupParent) {
		let r = e.renderGroupParent;
		e.worldTransform.appendFrom(t.relativeGroupTransform, r.worldTransform), e.worldColor = Bt(t.groupColor, r.worldColor), n = t.groupAlpha * r.worldAlpha;
	} else e.worldTransform.copyFrom(t.localTransform), e.worldColor = t.localColor, n = t.localAlpha;
	n = n < 0 ? 0 : n > 1 ? 1 : n, e.worldAlpha = n, e.worldColorAlpha = e.worldColor + ((n * 255 | 0) << 24);
}
function Rd(e, t, n) {
	if (t === e.updateTick) return;
	e.updateTick = t, e.didChange = !1;
	let r = e.localTransform;
	e.updateLocalTransform();
	let i = e.parent;
	if (i && !i.renderGroup ? (n |= e._updateFlags, e.relativeGroupTransform.appendFrom(r, i.relativeGroupTransform), n & Vd && zd(e, i, n)) : (n = e._updateFlags, e.relativeGroupTransform.copyFrom(r), n & Vd && zd(e, Bd, n)), !e.renderGroup) {
		let r = e.children, i = r.length;
		for (let e = 0; e < i; e++) Rd(r[e], t, n);
		let a = e.parentRenderGroup, o = e;
		o.renderPipeId && !a.structureDidChange && a.updateRenderable(o);
	}
}
function zd(e, t, n) {
	if (n & 1) {
		e.groupColor = Bt(e.localColor, t.groupColor);
		let n = e.localAlpha * t.groupAlpha;
		n = n < 0 ? 0 : n > 1 ? 1 : n, e.groupAlpha = n, e.groupColorAlpha = e.groupColor + ((n * 255 | 0) << 24);
	}
	n & 2 && (e.groupBlendMode = e.localBlendMode === "inherit" ? t.groupBlendMode : e.localBlendMode), n & 4 && (e.globalDisplayStatus = e.localDisplayStatus & t.globalDisplayStatus), e._updateFlags = 0;
}
var Bd, Vd, Hd = o((() => {
	dr(), Fd(), Ht(), Bd = new H(), Vd = 7;
}));
// node_modules/pixi.js/lib/scene/container/utils/validateRenderables.mjs
function Ud(e, t) {
	let { list: n } = e.childrenRenderablesToUpdate, r = !1;
	for (let i = 0; i < e.childrenRenderablesToUpdate.index; i++) {
		let e = n[i];
		if (r = t[e.renderPipeId].validateRenderable(e), r) break;
	}
	return e.structureDidChange = r, r;
}
var Wd = o((() => {})), Gd, Kd, qd = o((() => {
	h(), M(), nr(), Dt(), Fd(), jd(), Hd(), Wd(), Gd = new j(), Kd = class {
		constructor(e) {
			this._renderer = e;
		}
		render({ container: e, transform: t }) {
			let n = e.parent, r = e.renderGroup.renderGroupParent;
			e.parent = null, e.renderGroup.renderGroupParent = null;
			let i = this._renderer, a = Gd;
			t && (a.copyFrom(e.renderGroup.localTransform), e.renderGroup.localTransform.copyFrom(t));
			let o = i.renderPipes;
			this._updateCachedRenderGroups(e.renderGroup, null), this._updateRenderGroups(e.renderGroup), i.globalUniforms.start({
				worldTransformMatrix: t ? e.renderGroup.localTransform : e.renderGroup.worldTransform,
				worldColor: e.renderGroup.worldColorAlpha
			}), Ad(e.renderGroup, o), o.uniformBatch && o.uniformBatch.renderEnd(), t && e.renderGroup.localTransform.copyFrom(a), e.parent = n, e.renderGroup.renderGroupParent = r;
		}
		destroy() {
			this._renderer = null;
		}
		_updateCachedRenderGroups(e, t) {
			if (e._parentCacheAsTextureRenderGroup = t, e.isCachedAsTexture) {
				if (!e.textureNeedsUpdate) return;
				t = e;
			}
			for (let n = e.renderGroupChildren.length - 1; n >= 0; n--) this._updateCachedRenderGroups(e.renderGroupChildren[n], t);
			if (e.invalidateMatrices(), e.isCachedAsTexture) {
				if (e.textureNeedsUpdate) {
					let t = e.root.getLocalBounds(), n = this._renderer, r = e.textureOptions.resolution || n.view.resolution, i = e.textureOptions.antialias ?? n.view.antialias, a = e.textureOptions.scaleMode ?? "linear", o = e.texture;
					t.ceil(), e.texture && tr.returnTexture(e.texture), e.texture = tr.getOptimalTexture({
						width: t.width,
						height: t.height,
						resolution: r,
						antialias: i,
						scaleMode: a
					}), e._textureBounds ||= new Et(), e._textureBounds.copyFrom(t), o !== e.texture && e.renderGroupParent && (e.renderGroupParent.structureDidChange = !0);
				}
			} else e.texture &&= (tr.returnTexture(e.texture), null);
		}
		_updateRenderGroups(e) {
			let t = this._renderer, n = t.renderPipes;
			if (e.runOnRender(t), e.instructionSet.renderPipes = n, e.structureDidChange ? Pd(e.childrenRenderablesToUpdate.list, 0) : Ud(e, n), Id(e), e.structureDidChange ? (e.structureDidChange = !1, this._buildInstructions(e, t)) : this._updateRenderables(e), e.childrenRenderablesToUpdate.index = 0, t.renderPipes.batch.upload(e.instructionSet), !e.isCachedAsTexture || e.textureNeedsUpdate) for (let t = 0; t < e.renderGroupChildren.length; t++) this._updateRenderGroups(e.renderGroupChildren[t]);
		}
		_updateRenderables(e) {
			let { list: t, index: n } = e.childrenRenderablesToUpdate;
			for (let r = 0; r < n; r++) {
				let n = t[r];
				n.didViewUpdate && e.updateRenderable(n);
			}
			Pd(t, n);
		}
		_buildInstructions(e, t) {
			let n = e.root, r = e.instructionSet;
			r.reset();
			let i = t.renderPipes ? t : t.batch.renderer, a = i.renderPipes;
			a.batch.buildStart(r), a.blendMode.buildStart(), a.colorMask.buildStart(), n.sortableChildren && n.sortChildren(), n.collectRenderablesWithEffects(r, i, null), a.batch.buildEnd(r), a.blendMode.buildEnd(r);
		}
	}, Kd.extension = {
		type: [
			d.WebGLSystem,
			d.WebGPUSystem,
			d.CanvasSystem
		],
		name: "renderGroup"
	};
})), Jd, Yd = o((() => {
	h(), kd(), Jd = class {
		constructor(e) {
			this._renderer = e;
		}
		addRenderable(e, t) {
			let n = this._getGpuSprite(e);
			e.didViewUpdate && this._updateBatchableSprite(e, n), this._renderer.renderPipes.batch.addToBatch(n, t);
		}
		updateRenderable(e) {
			let t = this._getGpuSprite(e);
			e.didViewUpdate && this._updateBatchableSprite(e, t), t._batcher.updateElement(t);
		}
		validateRenderable(e) {
			let t = this._getGpuSprite(e);
			return !t._batcher.checkAndUpdateTexture(t, e._texture);
		}
		_updateBatchableSprite(e, t) {
			t.bounds = e.visualBounds, t.texture = e._texture;
		}
		_getGpuSprite(e) {
			return e._gpuData[this._renderer.uid] || this._initGPUSprite(e);
		}
		_initGPUSprite(e) {
			let t = new Od();
			return t.renderable = e, t.transform = e.groupTransform, t.texture = e._texture, t.bounds = e.visualBounds, t.roundPixels = this._renderer._roundPixels | e._roundPixels, e._gpuData[this._renderer.uid] = t, t;
		}
		destroy() {
			this._renderer = null;
		}
	}, Jd.extension = {
		type: [
			d.WebGLPipes,
			d.WebGPUPipes,
			d.CanvasPipes
		],
		name: "sprite"
	};
})), Xd, Zd = o((() => {
	y(), Xd = "8.23.0";
})), Qd, $d, ef = o((() => {
	h(), Zd(), Qd = class {
		static init() {
			globalThis.__PIXI_APP_INIT__?.(this, Xd);
		}
		static destroy() {}
	}, Qd.extension = d.Application, $d = class {
		constructor(e) {
			this._renderer = e;
		}
		init() {
			globalThis.__PIXI_RENDERER_INIT__?.(this._renderer, Xd);
		}
		destroy() {
			this._renderer = null;
		}
	}, $d.extension = {
		type: [d.WebGLSystem, d.WebGPUSystem],
		name: "initHook",
		priority: -10
	};
})), tf, nf = o((() => {
	tf = class {
		constructor(e) {
			this.rawBinaryData = typeof e == "number" ? new ArrayBuffer(e) : e instanceof Uint8Array ? e.buffer : e, this.uint32View = new Uint32Array(this.rawBinaryData), this.float32View = new Float32Array(this.rawBinaryData), this.size = this.rawBinaryData.byteLength;
		}
		get int8View() {
			return this._int8View ||= new Int8Array(this.rawBinaryData), this._int8View;
		}
		get uint8View() {
			return this._uint8View ||= new Uint8Array(this.rawBinaryData), this._uint8View;
		}
		get int16View() {
			return this._int16View ||= new Int16Array(this.rawBinaryData), this._int16View;
		}
		get int32View() {
			return this._int32View ||= new Int32Array(this.rawBinaryData), this._int32View;
		}
		get float64View() {
			return this._float64Array ||= new Float64Array(this.rawBinaryData), this._float64Array;
		}
		get bigUint64View() {
			return this._bigUint64Array ||= new BigUint64Array(this.rawBinaryData), this._bigUint64Array;
		}
		view(e) {
			return this[`${e}View`];
		}
		destroy() {
			this.rawBinaryData = null, this.uint32View = null, this.float32View = null, this.uint16View = null, this._int8View = null, this._uint8View = null, this._int16View = null, this._int32View = null, this._float64Array = null, this._bigUint64Array = null;
		}
		static sizeOf(e) {
			switch (e) {
				case "int8":
				case "uint8": return 1;
				case "int16":
				case "uint16": return 2;
				case "int32":
				case "uint32":
				case "float32": return 4;
				default: throw Error(`${e} isn't a valid view type`);
			}
		}
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/shared/buffer/utils/fastCopy.mjs
function rf(e, t, n, r) {
	if (n ??= 0, r ??= Math.min(e.byteLength - n, t.byteLength), !(n & 7) && !(r & 7)) {
		let i = r / 8;
		new Float64Array(t, 0, i).set(new Float64Array(e, n, i));
	} else if (!(n & 3) && !(r & 3)) {
		let i = r / 4;
		new Float32Array(t, 0, i).set(new Float32Array(e, n, i));
	} else new Uint8Array(t).set(new Uint8Array(e, n, r));
}
var af = o((() => {})), of, sf, cf = o((() => {
	of = {
		normal: "normal-npm",
		add: "add-npm",
		screen: "screen-npm"
	}, sf = /* @__PURE__ */ ((e) => (e[e.DISABLED = 0] = "DISABLED", e[e.RENDERING_MASK_ADD = 1] = "RENDERING_MASK_ADD", e[e.MASK_ACTIVE = 2] = "MASK_ACTIVE", e[e.INVERSE_MASK_ACTIVE = 3] = "INVERSE_MASK_ACTIVE", e[e.RENDERING_MASK_REMOVE = 4] = "RENDERING_MASK_REMOVE", e[e.NONE = 5] = "NONE", e))(sf || {});
}));
// node_modules/pixi.js/lib/rendering/renderers/shared/state/getAdjustedBlendModeBlend.mjs
function lf(e, t) {
	return t.alphaMode === "no-premultiply-alpha" && of[e] || e;
}
var uf = o((() => {
	cf();
}));
// node_modules/pixi.js/lib/rendering/batcher/gl/utils/checkMaxIfStatementsInShader.mjs
function df(e) {
	let t = "";
	for (let n = 0; n < e; ++n) n > 0 && (t += "\nelse "), n < e - 1 && (t += `if(test == ${n}.0){}`);
	return t;
}
function ff(e, t) {
	if (e === 0) throw Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");
	let n = t.createShader(t.FRAGMENT_SHADER);
	try {
		for (;;) {
			let r = pf.replace(/%forloop%/gi, df(e));
			if (t.shaderSource(n, r), t.compileShader(n), !t.getShaderParameter(n, t.COMPILE_STATUS)) e = e / 2 | 0;
			else break;
		}
	} finally {
		t.deleteShader(n);
	}
	return e;
}
var pf, mf = o((() => {
	pf = "precision mediump float;\nvoid main(void){\nfloat test = 0.1;\n%forloop%\ngl_FragColor = vec4(0.0);\n}";
}));
// node_modules/pixi.js/lib/rendering/batcher/gl/utils/maxRecommendedTextures.mjs
function hf() {
	if (gf) return gf;
	let e = Vo();
	return gf = e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS), gf = ff(gf, e), e.getExtension("WEBGL_lose_context")?.loseContext(), gf;
}
var gf, _f = o((() => {
	Uo(), mf(), gf = null;
})), vf, yf = o((() => {
	vf = class {
		constructor() {
			this.ids = /* @__PURE__ */ Object.create(null), this.textures = [], this.count = 0;
		}
		clear() {
			for (let e = 0; e < this.count; e++) {
				let t = this.textures[e];
				this.textures[e] = null, this.ids[t.uid] = null;
			}
			this.count = 0;
		}
	};
}));
// node_modules/pixi.js/lib/rendering/batcher/shared/Batcher.mjs
function bf() {
	return wf > 0 ? Cf[--wf] : new Sf();
}
function xf(e) {
	e.elements = null, Cf[wf++] = e;
}
var Sf, Cf, wf, Tf, Ef, Df, Of = o((() => {
	We(), nf(), Xe(), et(), af(), uf(), _f(), yf(), Sf = class {
		constructor() {
			this.renderPipeId = "batch", this.action = "startBatch", this.start = 0, this.size = 0, this.textures = new vf(), this.blendMode = "normal", this.topology = "triangle-strip", this.canBundle = !0;
		}
		destroy() {
			this.textures = null, this.gpuBindGroup = null, this.bindGroup = null, this.batcher = null, this.elements = null;
		}
	}, Cf = [], wf = 0, $e.register({ clear: () => {
		if (Cf.length > 0) for (let e of Cf) e && e.destroy();
		Cf.length = 0, wf = 0;
	} }), Tf = 0, Ef = class e {
		constructor(t) {
			this.uid = N("batcher"), this.dirty = !0, this.batchIndex = 0, this.batches = [], this._elements = [], t = {
				...e.defaultOptions,
				...t
			}, t.maxTextures || (F("v8.8.0", "maxTextures is a required option for Batcher now, please pass it in the options"), t.maxTextures = hf());
			let { maxTextures: n, attributesInitialSize: r, indicesInitialSize: i } = t;
			this.attributeBuffer = new tf(r * 4), this.indexBuffer = new Uint16Array(i), this.maxTextures = n;
		}
		begin() {
			this.elementSize = 0, this.elementStart = 0, this.indexSize = 0, this.attributeSize = 0;
			for (let e = 0; e < this.batchIndex; e++) xf(this.batches[e]);
			this.batchIndex = 0, this._batchIndexStart = 0, this._batchIndexSize = 0, this.dirty = !0;
		}
		add(e) {
			this._elements[this.elementSize++] = e, e._indexStart = this.indexSize, e._attributeStart = this.attributeSize, e._batcher = this, this.indexSize += e.indexSize, this.attributeSize += e.attributeSize * this.vertexSize;
		}
		checkAndUpdateTexture(e, t) {
			let n = e._batch.textures.ids[t._source.uid];
			return !n && n !== 0 ? !1 : (e._textureId = n, e.texture = t, !0);
		}
		updateElement(e) {
			this.dirty = !0;
			let t = this.attributeBuffer;
			e.packAsQuad ? this.packQuadAttributes(e, t.float32View, t.uint32View, e._attributeStart, e._textureId) : this.packAttributes(e, t.float32View, t.uint32View, e._attributeStart, e._textureId);
		}
		break(e) {
			let t = this._elements;
			if (!t[this.elementStart]) return;
			let n = bf(), r = n.textures;
			r.clear();
			let i = t[this.elementStart], a = lf(i.blendMode, i.texture._source), o = i.topology;
			this.attributeSize * 4 > this.attributeBuffer.size && this._resizeAttributeBuffer(this.attributeSize * 4), this.indexSize > this.indexBuffer.length && this._resizeIndexBuffer(this.indexSize);
			let s = this.attributeBuffer.float32View, c = this.attributeBuffer.uint32View, l = this.indexBuffer, u = this._batchIndexSize, d = this._batchIndexStart, f = "startBatch", p = [], m = this.maxTextures;
			for (let i = this.elementStart; i < this.elementSize; ++i) {
				let h = t[i];
				t[i] = null;
				let g = h.texture._source, _ = lf(h.blendMode, g), v = a !== _ || o !== h.topology;
				g._batchTick === Tf && !v ? (h._textureId = g._textureBindLocation, u += h.indexSize, h.packAsQuad ? (this.packQuadAttributes(h, s, c, h._attributeStart, h._textureId), this.packQuadIndex(l, h._indexStart, h._attributeStart / this.vertexSize)) : (this.packAttributes(h, s, c, h._attributeStart, h._textureId), this.packIndex(h, l, h._indexStart, h._attributeStart / this.vertexSize)), h._batch = n, p.push(h)) : ((r.count >= m || v) && (this._finishBatch(n, d, u - d, r, a, o, e, f, p), f = "renderBatch", d = u, a = _, o = h.topology, n = bf(), r = n.textures, r.clear(), p = [], ++Tf), g._batchTick = Tf, h._textureId = g._textureBindLocation = r.count, r.ids[g.uid] = r.count, r.textures[r.count++] = g, h._batch = n, p.push(h), u += h.indexSize, h.packAsQuad ? (this.packQuadAttributes(h, s, c, h._attributeStart, h._textureId), this.packQuadIndex(l, h._indexStart, h._attributeStart / this.vertexSize)) : (this.packAttributes(h, s, c, h._attributeStart, h._textureId), this.packIndex(h, l, h._indexStart, h._attributeStart / this.vertexSize)));
			}
			r.count > 0 && (this._finishBatch(n, d, u - d, r, a, o, e, f, p), d = u, ++Tf), this.elementStart = this.elementSize, this._batchIndexStart = d, this._batchIndexSize = u;
		}
		_finishBatch(e, t, n, r, i, a, o, s, c) {
			e.gpuBindGroup = null, e.bindGroup = null, e.action = s, e.batcher = this, e.textures = r, e.blendMode = i, e.topology = a, e.start = t, e.size = n, e.elements = c, ++Tf, this.batches[this.batchIndex++] = e, o.add(e);
		}
		finish(e) {
			this.break(e);
		}
		ensureAttributeBuffer(e) {
			e * 4 <= this.attributeBuffer.size || this._resizeAttributeBuffer(e * 4);
		}
		ensureIndexBuffer(e) {
			e <= this.indexBuffer.length || this._resizeIndexBuffer(e);
		}
		_resizeAttributeBuffer(e) {
			let t = Math.max(e, this.attributeBuffer.size * 2), n = new tf(t);
			rf(this.attributeBuffer.rawBinaryData, n.rawBinaryData), this.attributeBuffer = n;
		}
		_resizeIndexBuffer(e) {
			let t = this.indexBuffer, n = Math.max(e, t.length * 1.5);
			n += n % 2;
			let r = n > 65535 ? new Uint32Array(n) : new Uint16Array(n);
			if (r.BYTES_PER_ELEMENT !== t.BYTES_PER_ELEMENT) for (let e = 0; e < t.length; e++) r[e] = t[e];
			else rf(t.buffer, r.buffer);
			this.indexBuffer = r;
		}
		packQuadIndex(e, t, n) {
			e[t] = n + 0, e[t + 1] = n + 1, e[t + 2] = n + 2, e[t + 3] = n + 0, e[t + 4] = n + 2, e[t + 5] = n + 3;
		}
		packIndex(e, t, n, r) {
			let i = e.indices, a = e.indexSize, o = e.indexOffset, s = e.attributeOffset;
			for (let e = 0; e < a; e++) t[n++] = r + i[e + o] - s;
		}
		destroy(e = {}) {
			if (this.batches !== null) {
				for (let e = 0; e < this.batchIndex; e++) xf(this.batches[e]);
				this.batches = null, this.geometry.destroy(!0), this.geometry = null, e.shader && (this.shader?.destroy(), this.shader = null);
				for (let e = 0; e < this._elements.length; e++) this._elements[e] && (this._elements[e]._batch = null);
				this._elements = null, this.indexBuffer = null, this.attributeBuffer.destroy(), this.attributeBuffer = null;
			}
		}
	}, Ef.defaultOptions = {
		maxTextures: null,
		attributesInitialSize: 4,
		indicesInitialSize: 6
	}, Df = Ef;
})), kf, Af, jf, Mf = o((() => {
	kc(), Dc(), Ic(), kf = /* @__PURE__ */ new Float32Array(1), Af = /* @__PURE__ */ new Uint32Array(1), jf = class extends Fc {
		constructor() {
			let e = new Oc({
				data: kf,
				label: "attribute-batch-buffer",
				usage: Ec.VERTEX | Ec.COPY_DST,
				shrinkToFit: !1
			}), t = new Oc({
				data: Af,
				label: "index-batch-buffer",
				usage: Ec.INDEX | Ec.COPY_DST,
				shrinkToFit: !1
			});
			super({
				attributes: {
					aPosition: {
						buffer: e,
						format: "float32x2",
						stride: 24,
						offset: 0
					},
					aUV: {
						buffer: e,
						format: "float32x2",
						stride: 24,
						offset: 8
					},
					aColor: {
						buffer: e,
						format: "unorm8x4",
						stride: 24,
						offset: 16
					},
					aTextureIdAndRound: {
						buffer: e,
						format: "uint16x2",
						stride: 24,
						offset: 20
					}
				},
				indexBuffer: t
			});
		}
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/gl/shader/getBatchSamplersUniformGroup.mjs
function Nf(e) {
	let t = Pf[e];
	if (t) return t;
	let n = new Int32Array(e);
	for (let t = 0; t < e; t++) n[t] = t;
	return t = Pf[e] = new ec({ uTextures: {
		value: n,
		type: "i32",
		size: e
	} }, { isStatic: !0 }), t;
}
var Pf, Ff = o((() => {
	tc(), Pf = {};
})), If, Lf = o((() => {
	Gu(), Ju(), nd(), ld(), Ff(), rc(), If = class extends nc {
		constructor(e) {
			let t = Wu({
				name: "batch",
				bits: [
					qu,
					$u(e),
					cd
				]
			}), n = Uu({
				name: "batch",
				bits: [
					Ku,
					Zu(e),
					sd
				]
			});
			super({
				glProgram: t,
				gpuProgram: n,
				resources: { batchSamplers: Nf(e) }
			}), this.maxTextures = e;
		}
	};
})), Rf, zf, Bf, Vf = o((() => {
	h(), Of(), Mf(), Lf(), Rf = null, zf = class e extends Df {
		constructor(t) {
			super(t), this.geometry = new jf(), this.name = e.extension.name, this.vertexSize = 6, Rf ??= new If(t.maxTextures), this.shader = Rf;
		}
		packAttributes(e, t, n, r, i) {
			let a = i << 16 | e.roundPixels & 65535, o = e.transform, s = o.a, c = o.b, l = o.c, u = o.d, d = o.tx, f = o.ty, { positions: p, uvs: m } = e, h = e.color, g = e.attributeOffset, _ = g + e.attributeSize;
			for (let e = g; e < _; e++) {
				let i = e * 2, o = p[i], g = p[i + 1];
				t[r++] = s * o + l * g + d, t[r++] = u * g + c * o + f, t[r++] = m[i], t[r++] = m[i + 1], n[r++] = h, n[r++] = a;
			}
		}
		packQuadAttributes(e, t, n, r, i) {
			let a = e.texture, o = e.transform, s = o.a, c = o.b, l = o.c, u = o.d, d = o.tx, f = o.ty, p = e.bounds, m = p.maxX, h = p.minX, g = p.maxY, _ = p.minY, v = a.uvs, y = e.color, b = i << 16 | e.roundPixels & 65535;
			t[r + 0] = s * h + l * _ + d, t[r + 1] = u * _ + c * h + f, t[r + 2] = v.x0, t[r + 3] = v.y0, n[r + 4] = y, n[r + 5] = b, t[r + 6] = s * m + l * _ + d, t[r + 7] = u * _ + c * m + f, t[r + 8] = v.x1, t[r + 9] = v.y1, n[r + 10] = y, n[r + 11] = b, t[r + 12] = s * m + l * g + d, t[r + 13] = u * g + c * m + f, t[r + 14] = v.x2, t[r + 15] = v.y2, n[r + 16] = y, n[r + 17] = b, t[r + 18] = s * h + l * g + d, t[r + 19] = u * g + c * h + f, t[r + 20] = v.x3, t[r + 21] = v.y3, n[r + 22] = y, n[r + 23] = b;
		}
		_updateMaxTextures(e) {
			this.shader.maxTextures !== e && (Rf = new If(e), this.shader = Rf);
		}
		destroy() {
			this.shader = null, super.destroy();
		}
	}, zf.extension = {
		type: [d.Batcher],
		name: "default"
	}, Bf = zf;
})), Hf, Uf, Wf = o((() => {
	h(), mc(), Vf(), Hf = class e {
		constructor(e, t) {
			this.state = pc.for2d(), this._batchersByInstructionSet = /* @__PURE__ */ Object.create(null), this._activeBatches = /* @__PURE__ */ Object.create(null), this.renderer = e, this._adaptor = t, this._adaptor.init?.(this);
		}
		static getBatcher(e, t) {
			return new this._availableBatchers[e]({ maxTextures: t });
		}
		buildStart(e) {
			let t = this._batchersByInstructionSet[e.uid];
			t || (t = this._batchersByInstructionSet[e.uid] = /* @__PURE__ */ Object.create(null), t.default || (t.default = new Bf({ maxTextures: this.renderer.limits.maxBatchableTextures }))), this._activeBatches = t, this._activeBatch = this._activeBatches.default;
			for (let e in this._activeBatches) this._activeBatches[e].begin();
		}
		addToBatch(t, n) {
			if (this._activeBatch.name !== t.batcherName) {
				this._activeBatch.break(n);
				let r = this._activeBatches[t.batcherName];
				r || (r = this._activeBatches[t.batcherName] = e.getBatcher(t.batcherName, this.renderer.limits.maxBatchableTextures), r.begin()), this._activeBatch = r;
			}
			this._activeBatch.add(t);
		}
		break(e) {
			this._activeBatch.break(e);
		}
		buildEnd(e) {
			this._activeBatch.break(e);
			let t = this._activeBatches;
			for (let e in t) {
				let n = t[e], r = n.geometry;
				r.indexBuffer.setDataWithSize(n.indexBuffer, n.indexSize, !0), r.buffers[0].setDataWithSize(n.attributeBuffer.float32View, n.attributeSize, !1);
			}
		}
		upload(e) {
			let t = this._batchersByInstructionSet[e.uid];
			for (let e in t) {
				let n = t[e], r = n.geometry;
				n.dirty && (n.dirty = !1, r.buffers[0].update(n.attributeSize * 4));
			}
		}
		execute(e) {
			if (e.action === "startBatch") {
				let t = e.batcher, n = t.geometry, r = t.shader;
				this._adaptor.start(this, n, r);
			}
			this._adaptor.execute(this, e);
		}
		destroyInstructionSet(e) {
			let t = this._batchersByInstructionSet[e.uid];
			if (t) {
				for (let e in t) t[e].destroy();
				delete this._batchersByInstructionSet[e.uid], this._activeBatches === t && (this._activeBatches = /* @__PURE__ */ Object.create(null), this._activeBatch = null);
			}
		}
		destroy() {
			this.state = null, this.renderer = null, this._adaptor = null;
			for (let e in this._activeBatches) this._activeBatches[e].destroy();
			this._activeBatches = null;
		}
	}, Hf.extension = {
		type: [
			d.WebGLPipes,
			d.WebGPUPipes,
			d.CanvasPipes
		],
		name: "batch"
	}, Hf._availableBatchers = /* @__PURE__ */ Object.create(null), Uf = Hf, m.handleByMap(d.Batcher, Uf._availableBatchers), m.add(Bf);
})), Gf, Kf = o((() => {
	Gf = "in vec2 vMaskCoord;\nin vec2 vTextureCoord;\n\nuniform sampler2D uTexture;\nuniform sampler2D uMaskTexture;\n\nuniform float uAlpha;\nuniform vec4 uMaskClamp;\nuniform float uInverse;\nuniform float uChannel;\n\nout vec4 finalColor;\n\nvoid main(void)\n{\n    float clip = step(3.5,\n        step(uMaskClamp.x, vMaskCoord.x) +\n        step(uMaskClamp.y, vMaskCoord.y) +\n        step(vMaskCoord.x, uMaskClamp.z) +\n        step(vMaskCoord.y, uMaskClamp.w));\n\n    // TODO look into why this is needed\n    float npmAlpha = uAlpha;\n    vec4 original = texture(uTexture, vTextureCoord);\n    vec4 masky = texture(uMaskTexture, vMaskCoord);\n\n    float a;\n    if (uChannel == 1.0) {\n        a = masky.a * npmAlpha * clip;\n    } else {\n        float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);\n        a = alphaMul * masky.r * npmAlpha * clip;\n    }\n\n    if (uInverse == 1.0) {\n        a = 1.0 - a;\n    }\n\n    finalColor = original * a;\n}\n";
})), qf, Jf = o((() => {
	qf = "in vec2 aPosition;\n\nout vec2 vTextureCoord;\nout vec2 vMaskCoord;\n\n\nuniform vec4 uInputSize;\nuniform vec4 uOutputFrame;\nuniform vec4 uOutputTexture;\nuniform mat3 uFilterMatrix;\n\nvec4 filterVertexPosition(  vec2 aPosition )\n{\n    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;\n       \n    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;\n    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;\n\n    return vec4(position, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord(  vec2 aPosition )\n{\n    return aPosition * (uOutputFrame.zw * uInputSize.zw);\n}\n\nvec2 getFilterCoord( vec2 aPosition )\n{\n    return  ( uFilterMatrix * vec3( filterTextureCoord(aPosition), 1.0)  ).xy;\n}   \n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition(aPosition);\n    vTextureCoord = filterTextureCoord(aPosition);\n    vMaskCoord = getFilterCoord(aPosition);\n}\n";
})), Yf, Xf = o((() => {
	Yf = "struct GlobalFilterUniforms {\n  uInputSize:vec4<f32>,\n  uInputPixel:vec4<f32>,\n  uInputClamp:vec4<f32>,\n  uOutputFrame:vec4<f32>,\n  uGlobalFrame:vec4<f32>,\n  uOutputTexture:vec4<f32>,\n};\n\nstruct MaskUniforms {\n  uFilterMatrix:mat3x3<f32>,\n  uMaskClamp:vec4<f32>,\n  uAlpha:f32,\n  uInverse:f32,\n  uChannel:f32,\n};\n\n@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;\n@group(0) @binding(1) var uTexture: texture_2d<f32>;\n@group(0) @binding(2) var uSampler : sampler;\n\n@group(1) @binding(0) var<uniform> filterUniforms : MaskUniforms;\n@group(1) @binding(1) var uMaskTexture: texture_2d<f32>;\n\nstruct VSOutput {\n    @builtin(position) position: vec4<f32>,\n    @location(0) uv : vec2<f32>,\n    @location(1) filterUv : vec2<f32>,\n};\n\nfn filterVertexPosition(aPosition:vec2<f32>) -> vec4<f32>\n{\n    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;\n\n    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;\n    position.y = position.y * (2.0*gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;\n\n    return vec4(position, 0.0, 1.0);\n}\n\nfn filterTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>\n{\n    return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);\n}\n\nfn globalTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>\n{\n  return  (aPosition.xy / gfu.uGlobalFrame.zw) + (gfu.uGlobalFrame.xy / gfu.uGlobalFrame.zw);\n}\n\nfn getFilterCoord(aPosition:vec2<f32> ) -> vec2<f32>\n{\n  return ( filterUniforms.uFilterMatrix * vec3( filterTextureCoord(aPosition), 1.0)  ).xy;\n}\n\nfn getSize() -> vec2<f32>\n{\n  return gfu.uGlobalFrame.zw;\n}\n\n@vertex\nfn mainVertex(\n  @location(0) aPosition : vec2<f32>,\n) -> VSOutput {\n  return VSOutput(\n   filterVertexPosition(aPosition),\n   filterTextureCoord(aPosition),\n   getFilterCoord(aPosition)\n  );\n}\n\n@fragment\nfn mainFragment(\n  @location(0) uv: vec2<f32>,\n  @location(1) filterUv: vec2<f32>,\n  @builtin(position) position: vec4<f32>\n) -> @location(0) vec4<f32> {\n\n    var maskClamp = filterUniforms.uMaskClamp;\n    var uAlpha = filterUniforms.uAlpha;\n\n    var clip = step(3.5,\n      step(maskClamp.x, filterUv.x) +\n      step(maskClamp.y, filterUv.y) +\n      step(filterUv.x, maskClamp.z) +\n      step(filterUv.y, maskClamp.w));\n\n    var mask = textureSample(uMaskTexture, uSampler, filterUv);\n    var source = textureSample(uTexture, uSampler, uv);\n\n    var a: f32;\n    if (filterUniforms.uChannel == 1.0) {\n        a = mask.a * uAlpha * clip;\n    } else {\n        var alphaMul = 1.0 - uAlpha * (1.0 - mask.a);\n        a = alphaMul * mask.r * uAlpha * clip;\n    }\n\n    if (filterUniforms.uInverse == 1.0) {\n        a = 1.0 - a;\n    }\n\n    return source * a;\n}\n";
})), Zf, Qf = o((() => {
	M(), ps(), zs(), tc(), V(), Hn(), L(), _c(), Kf(), Jf(), Xf(), Zf = class extends gc {
		constructor(e) {
			let { sprite: t, ...n } = e, r = new Vn(t.texture), i = new ec({
				uFilterMatrix: {
					value: new j(),
					type: "mat3x3<f32>"
				},
				uMaskClamp: {
					value: r.uClampFrame,
					type: "vec4<f32>"
				},
				uAlpha: {
					value: 1,
					type: "f32"
				},
				uInverse: {
					value: +!!e.inverse,
					type: "f32"
				},
				uChannel: {
					value: +(e.channel === "alpha"),
					type: "f32"
				}
			}), a = Rs.from({
				vertex: {
					source: Yf,
					entryPoint: "mainVertex"
				},
				fragment: {
					source: Yf,
					entryPoint: "mainFragment"
				}
			}), o = fs.from({
				vertex: qf,
				fragment: Gf,
				name: "mask-filter"
			});
			super({
				...n,
				gpuProgram: a,
				glProgram: o,
				clipToViewport: !1,
				resources: {
					filterUniforms: i,
					uMaskTexture: t.texture.source
				}
			}), this.sprite = t, this._textureMatrix = r;
		}
		setSprite(e) {
			this.sprite = e;
			let t = this._getSafeTexture();
			this._textureMatrix.texture = t, this.resources.uMaskTexture = t.source;
		}
		set inverse(e) {
			this.resources.filterUniforms.uniforms.uInverse = +!!e;
		}
		get inverse() {
			return this.resources.filterUniforms.uniforms.uInverse === 1;
		}
		set channel(e) {
			this.resources.filterUniforms.uniforms.uChannel = +(e === "alpha");
		}
		get channel() {
			return this.resources.filterUniforms.uniforms.uChannel === 1 ? "alpha" : "red";
		}
		apply(e, t, n, r) {
			let i = this._getSafeTexture();
			this._textureMatrix.texture = i, e.calculateSpriteMatrix(this.resources.filterUniforms.uniforms.uFilterMatrix, this.sprite).prepend(this._textureMatrix.mapCoord), this.resources.uMaskTexture = i.source, e.applyFilter(this, t, n, r);
		}
		_getSafeTexture() {
			let e = this.sprite.texture;
			return e.destroyed || !e.source || e.source.destroyed ? (I("[MaskFilter] The mask texture was destroyed while the mask is still in use. Remove the mask before destroying its texture."), B.EMPTY) : e;
		}
		destroy(e = !1) {
			this._textureMatrix.destroy(), super.destroy(e);
		}
	};
})), $f, ep, tp, np = o((() => {
	h(), ht(), Qf(), Dt(), Lt(), ga(), at(), V(), nr(), Gs(), $f = new Et(), ep = class extends mt {
		constructor() {
			super(), this._placeholderSprite = new ha(B.EMPTY), this.filters = [new Zf({
				sprite: this._placeholderSprite,
				inverse: !1,
				resolution: "inherit",
				antialias: "inherit"
			})];
		}
		get sprite() {
			return this.filters[0].sprite;
		}
		set sprite(e) {
			this.filters[0].setSprite(e);
		}
		get inverse() {
			return this.filters[0].inverse;
		}
		set inverse(e) {
			this.filters[0].inverse = e;
		}
		get channel() {
			return this.filters[0].channel;
		}
		set channel(e) {
			this.filters[0].channel = e;
		}
		reset() {
			this._placeholderSprite.texture = B.EMPTY, this.sprite = this._placeholderSprite;
		}
	}, tp = class {
		constructor(e) {
			this._activeMaskStage = [], this._usedEffects = [], this._renderer = e, e.runners.postrender.add(this);
		}
		push(e, t, n) {
			let r = this._renderer;
			if (r.renderPipes.batch.break(n), n.add({
				renderPipeId: "alphaMask",
				action: "pushMaskBegin",
				mask: e,
				inverse: t._maskOptions.inverse,
				canBundle: !1,
				maskedContainer: t
			}), e.inverse = t._maskOptions.inverse, e.channel = t._maskOptions.channel ?? "red", e.renderMaskToTexture) {
				let t = e.mask;
				t.includeInBuild = !0, t.collectRenderables(n, r, null), t.includeInBuild = !1;
			}
			r.renderPipes.batch.break(n), n.add({
				renderPipeId: "alphaMask",
				action: "pushMaskEnd",
				mask: e,
				maskedContainer: t,
				inverse: t._maskOptions.inverse,
				canBundle: !1
			});
		}
		pop(e, t, n) {
			this._renderer.renderPipes.batch.break(n), n.add({
				renderPipeId: "alphaMask",
				action: "popMaskEnd",
				mask: e,
				inverse: t._maskOptions.inverse,
				canBundle: !1
			});
		}
		execute(e) {
			let t = this._renderer, n = e.mask.renderMaskToTexture;
			if (e.action === "pushMaskBegin") {
				let r = it.get(ep);
				if (r.inverse = e.inverse, r.channel = e.mask.channel, n) {
					e.mask.mask.measurable = !0;
					let n = Pt(e.mask.mask, !0, $f);
					e.mask.mask.measurable = !1, n.ceil();
					let i = t.renderTarget.renderTarget.colorTexture.source, a = tr.getOptimalTexture({
						width: n.width,
						height: n.height,
						resolution: i._resolution,
						antialias: i.antialias
					});
					t.renderTarget.push({
						target: a,
						clear: !0
					}), t.globalUniforms.push({
						offset: n,
						worldColor: 4294967295
					});
					let o = r.sprite;
					o.texture = a, o.worldTransform.tx = n.minX, o.worldTransform.ty = n.minY, this._activeMaskStage.push({
						filterEffect: r,
						maskedContainer: e.maskedContainer,
						filterTexture: a
					});
				} else r.sprite = e.mask.mask, this._activeMaskStage.push({
					filterEffect: r,
					maskedContainer: e.maskedContainer
				});
			} else if (e.action === "pushMaskEnd") {
				let e = this._activeMaskStage[this._activeMaskStage.length - 1];
				n && (t.type === Ws.WEBGL && t.renderTarget.finishRenderPass(), t.renderTarget.pop(), t.globalUniforms.pop()), t.filter.push({
					renderPipeId: "filter",
					action: "pushFilter",
					container: e.maskedContainer,
					filterEffect: e.filterEffect,
					canBundle: !1
				});
			} else if (e.action === "popMaskEnd") {
				t.filter.pop();
				let e = this._activeMaskStage.pop();
				n && tr.returnTexture(e.filterTexture), this._usedEffects.push(e.filterEffect);
			}
		}
		postrender() {
			let e = this._usedEffects;
			for (let t = 0; t < e.length; t++) it.return(e[t]);
			e.length = 0;
		}
		destroy() {
			this.postrender(), this._renderer.runners.postrender.remove(this), this._renderer = null, this._activeMaskStage = null, this._usedEffects = null;
		}
	}, tp.extension = {
		type: [
			d.WebGLPipes,
			d.WebGPUPipes,
			d.CanvasPipes
		],
		name: "alphaMask"
	};
})), rp, ip = o((() => {
	h(), rp = class {
		constructor(e) {
			this._colorStack = [], this._colorStackIndex = 0, this._currentColor = 0, this._renderer = e;
		}
		buildStart() {
			this._colorStack[0] = 15, this._colorStackIndex = 1, this._currentColor = 15;
		}
		push(e, t, n) {
			this._renderer.renderPipes.batch.break(n);
			let r = this._colorStack;
			r[this._colorStackIndex] = r[this._colorStackIndex - 1] & e.mask;
			let i = this._colorStack[this._colorStackIndex];
			i !== this._currentColor && (this._currentColor = i, n.add({
				renderPipeId: "colorMask",
				colorMask: i,
				canBundle: !1
			})), this._colorStackIndex++;
		}
		pop(e, t, n) {
			this._renderer.renderPipes.batch.break(n);
			let r = this._colorStack;
			this._colorStackIndex--;
			let i = r[this._colorStackIndex - 1];
			i !== this._currentColor && (this._currentColor = i, n.add({
				renderPipeId: "colorMask",
				colorMask: i,
				canBundle: !1
			}));
		}
		execute(e) {
			this._renderer.colorMask.setMask(e.colorMask);
		}
		destroy() {
			this._renderer = null, this._colorStack = null;
		}
	}, rp.extension = {
		type: [d.WebGLPipes, d.WebGPUPipes],
		name: "colorMask"
	};
})), ap, op = o((() => {
	h(), eu(), cf(), ap = class {
		constructor(e) {
			this._maskHash = /* @__PURE__ */ new WeakMap(), this._renderer = e;
		}
		push(e, t, n) {
			let r = e, i = this._renderer;
			i.renderPipes.batch.break(n), i.renderPipes.blendMode.setBlendMode(r.mask, "none", n), n.add({
				renderPipeId: "stencilMask",
				action: "pushMaskBegin",
				mask: e,
				inverse: t._maskOptions.inverse,
				canBundle: !1
			});
			let a = r.mask;
			a.includeInBuild = !0, this._maskHash.has(r) || this._maskHash.set(r, {
				instructionsStart: 0,
				instructionsLength: 0
			});
			let o = this._maskHash.get(r);
			o.instructionsStart = n.instructionSize, a.collectRenderables(n, i, null), a.includeInBuild = !1, i.renderPipes.batch.break(n), n.add({
				renderPipeId: "stencilMask",
				action: "pushMaskEnd",
				mask: e,
				inverse: t._maskOptions.inverse,
				canBundle: !1
			}), o.instructionsLength = n.instructionSize - o.instructionsStart - 1;
		}
		pop(e, t, n) {
			let r = e, i = this._renderer;
			i.renderPipes.batch.break(n), i.renderPipes.blendMode.setBlendMode(r.mask, "none", n), n.add({
				renderPipeId: "stencilMask",
				action: "popMaskBegin",
				inverse: t._maskOptions.inverse,
				canBundle: !1
			});
			let a = this._maskHash.get(e);
			for (let e = 0; e < a.instructionsLength; e++) n.instructions[n.instructionSize++] = n.instructions[a.instructionsStart++];
			n.add({
				renderPipeId: "stencilMask",
				action: "popMaskEnd",
				canBundle: !1
			});
		}
		execute(e) {
			let t = this._renderer, n = t.renderTarget.getGpuRenderTarget(t.renderTarget.renderTarget), r = n.maskStackIndex;
			e.action === "pushMaskBegin" ? (t.renderTarget.ensureDepthStencil(), t.stencil.setStencilMode(sf.RENDERING_MASK_ADD, r), r++, t.colorMask.setMask(0)) : e.action === "pushMaskEnd" ? (e.inverse ? t.stencil.setStencilMode(sf.INVERSE_MASK_ACTIVE, r) : t.stencil.setStencilMode(sf.MASK_ACTIVE, r), t.colorMask.setMask(15)) : e.action === "popMaskBegin" ? (t.colorMask.setMask(0), r === 0 ? (t.renderTarget.clear(null, $l.STENCIL), t.stencil.setStencilMode(sf.DISABLED, r)) : t.stencil.setStencilMode(sf.RENDERING_MASK_REMOVE, r), r--) : e.action === "popMaskEnd" && (e.inverse ? t.stencil.setStencilMode(sf.INVERSE_MASK_ACTIVE, r) : t.stencil.setStencilMode(sf.MASK_ACTIVE, r), t.colorMask.setMask(15)), n.maskStackIndex = r;
		}
		destroy() {
			this._renderer = null, this._maskHash = null;
		}
	}, ap.extension = {
		type: [d.WebGLPipes, d.WebGPUPipes],
		name: "stencilMask"
	};
})), sp, cp, lp = o((() => {
	ke(), h(), L(), sp = class e {
		constructor() {
			this.clearBeforeRender = !0, this._backgroundColor = new A(0), this.color = this._backgroundColor, this.alpha = 1;
		}
		init(t) {
			t = {
				...e.defaultOptions,
				...t
			}, this.clearBeforeRender = t.clearBeforeRender, this.color = t.background || t.backgroundColor || this._backgroundColor, this.alpha = t.backgroundAlpha, this._backgroundColor.setAlpha(t.backgroundAlpha);
		}
		get color() {
			return this._backgroundColor;
		}
		set color(e) {
			A.shared.setValue(e).alpha < 1 && this._backgroundColor.alpha === 1 && I("Cannot set a transparent background on an opaque canvas. To enable transparency, set backgroundAlpha < 1 when initializing your Application."), this._backgroundColor.setValue(e);
		}
		get alpha() {
			return this._backgroundColor.alpha;
		}
		set alpha(e) {
			this._backgroundColor.setAlpha(e);
		}
		get colorRgba() {
			return this._backgroundColor.toArray();
		}
		destroy() {}
	}, sp.extension = {
		type: [
			d.WebGLSystem,
			d.WebGPUSystem,
			d.CanvasSystem
		],
		name: "background",
		priority: 0
	}, sp.defaultOptions = {
		backgroundAlpha: 1,
		backgroundColor: 0,
		clearBeforeRender: !0
	}, cp = sp;
})), up, dp, fp = o((() => {
	h(), ht(), ir(), L(), up = {}, m.handle(d.BlendMode, (e) => {
		if (!e.name) throw Error("BlendMode extension must have a name property");
		up[e.name] = e.ref;
	}, (e) => {
		delete up[e.name];
	}), dp = class {
		constructor(e) {
			this._blendModeStack = [], this._isAdvanced = !1, this._filterHash = /* @__PURE__ */ Object.create(null), this._renderer = e, this._renderer.runners.prerender.add(this);
		}
		prerender() {
			this._activeBlendMode = "normal", this._isAdvanced = !1;
		}
		pushBlendMode(e, t, n) {
			this._blendModeStack.push(t), this.setBlendMode(e, t, n);
		}
		popBlendMode(e) {
			this._blendModeStack.pop();
			let t = this._blendModeStack[this._activeBlendMode.length - 1] ?? "normal";
			this.setBlendMode(null, t, e);
		}
		setBlendMode(e, t, n) {
			let r = e instanceof rr;
			this._activeBlendMode === t ? this._isAdvanced && e && !r && this._renderableList?.push(e) : (this._isAdvanced && this._endAdvancedBlendMode(n), this._activeBlendMode = t, e && (this._isAdvanced = !!up[t], this._isAdvanced && this._beginAdvancedBlendMode(e, n)));
		}
		_beginAdvancedBlendMode(e, t) {
			this._renderer.renderPipes.batch.break(t);
			let n = this._activeBlendMode;
			if (!up[n]) {
				I(`Unable to assign BlendMode: '${n}'. You may want to include: import 'pixi.js/advanced-blend-modes'`);
				return;
			}
			let r = this._ensureFilterEffect(n), i = e instanceof rr, a = {
				renderPipeId: "filter",
				action: "pushFilter",
				filterEffect: r,
				renderables: i ? null : [e],
				container: i ? e.root : null,
				canBundle: !1
			};
			this._renderableList = a.renderables, t.add(a);
		}
		_ensureFilterEffect(e) {
			let t = this._filterHash[e];
			return t || (t = this._filterHash[e] = new mt(), t.filters = [new up[e]()]), t;
		}
		_endAdvancedBlendMode(e) {
			this._isAdvanced = !1, this._renderableList = null, this._renderer.renderPipes.batch.break(e), e.add({
				renderPipeId: "filter",
				action: "popFilter",
				canBundle: !1
			});
		}
		buildStart() {
			this._isAdvanced = !1;
		}
		buildEnd(e) {
			this._isAdvanced && this._endAdvancedBlendMode(e);
		}
		destroy() {
			this._renderer = null, this._renderableList = null;
			for (let e in this._filterHash) this._filterHash[e].destroy();
			this._filterHash = null;
		}
	}, dp.extension = {
		type: [
			d.WebGLPipes,
			d.WebGPUPipes,
			d.CanvasPipes
		],
		name: "blendMode"
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/shared/extract/ExtractSystem.mjs
function pp(e, t = !1) {
	let n = e.source.format;
	if (n.endsWith("float") || In(n) || n.startsWith("depth") || n === "stencil8") throw t && e.destroy(!0), Error(`[ExtractSystem] can't read ${n} textures: extract reads 8-bit color only. Extract a Mesh whose shader reads the texture and outputs color instead.`);
}
var mp, hp, gp, _p = o((() => {
	W(), h(), dr(), V(), Ln(), mp = {
		png: "image/png",
		jpg: "image/jpeg",
		webp: "image/webp"
	}, hp = class e {
		constructor(e) {
			this._renderer = e;
		}
		_normalizeOptions(e, t = {}) {
			return e instanceof H || e instanceof B ? {
				target: e,
				...t
			} : {
				...t,
				...e
			};
		}
		async image(e) {
			let t = U.get().createImage();
			return t.src = await this.base64(e), t;
		}
		async base64(t) {
			t = this._normalizeOptions(t, e.defaultImageOptions);
			let { format: n, quality: r } = t, i = this.canvas(t);
			if (i.toBlob !== void 0) return new Promise((e, t) => {
				i.toBlob((n) => {
					if (!n) {
						t(/* @__PURE__ */ Error("ICanvas.toBlob failed!"));
						return;
					}
					let r = new FileReader();
					r.onload = () => e(r.result), r.onerror = t, r.readAsDataURL(n);
				}, mp[n], r);
			});
			if (i.toDataURL !== void 0) return i.toDataURL(mp[n], r);
			if (i.convertToBlob !== void 0) {
				let e = await i.convertToBlob({
					type: mp[n],
					quality: r
				});
				return new Promise((t, n) => {
					let r = new FileReader();
					r.onload = () => t(r.result), r.onerror = n, r.readAsDataURL(e);
				});
			}
			throw Error("Extract.base64() requires ICanvas.toDataURL, ICanvas.toBlob, or ICanvas.convertToBlob to be implemented");
		}
		canvas(e) {
			e = this._normalizeOptions(e);
			let t = e.target, n = this._renderer;
			if (t instanceof B) return pp(t), n.texture.generateCanvas(t);
			let r = n.textureGenerator.generateTexture(e);
			pp(r, !0);
			let i = n.texture.generateCanvas(r);
			return r.destroy(!0), i;
		}
		pixels(e) {
			e = this._normalizeOptions(e);
			let t = e.target, n = this._renderer, r = t instanceof B ? t : n.textureGenerator.generateTexture(e);
			pp(r, !(t instanceof B));
			let i = n.texture.getPixels(r);
			return t instanceof H && r.destroy(!0), i;
		}
		texture(e) {
			return e = this._normalizeOptions(e), e.target instanceof B ? e.target : this._renderer.textureGenerator.generateTexture(e);
		}
		download(e) {
			e = this._normalizeOptions(e);
			let t = this.canvas(e), n = document.createElement("a");
			n.download = e.filename ?? "image.png", n.href = t.toDataURL("image/png"), document.body.appendChild(n), n.click(), document.body.removeChild(n);
		}
		log(e) {
			let t = e.width ?? 200;
			e = this._normalizeOptions(e);
			let n = this.canvas(e), r = n.toDataURL();
			console.log(`[Pixi Texture] ${n.width}px ${n.height}px`);
			let i = [
				"font-size: 1px;",
				`padding: ${t}px 300px;`,
				`background: url(${r}) no-repeat;`,
				"background-size: contain;"
			].join(" ");
			console.log("%c ", i);
		}
		destroy() {
			this._renderer = null;
		}
	}, hp.extension = {
		type: [
			d.WebGLSystem,
			d.WebGPUSystem,
			d.CanvasSystem
		],
		name: "extract"
	}, hp.defaultImageOptions = {
		format: "png",
		quality: 1
	}, gp = hp;
})), vp, yp = o((() => {
	wn(), V(), vp = class e extends B {
		static create(t) {
			let { dynamic: n, textureOptions: r, ...i } = t;
			return new e({
				...r,
				source: new Cn(i),
				dynamic: n ?? !1
			});
		}
		resize(e, t, n) {
			return this.source.resize(e, t, n), this;
		}
	};
})), bp, xp, Sp, Cp, wp = o((() => {
	ke(), h(), M(), wt(), Dt(), Jt(), dr(), yp(), bp = new R(), xp = new Et(), Sp = [
		0,
		0,
		0,
		0
	], Cp = class {
		constructor(e) {
			this._renderer = e;
		}
		generateTexture(e) {
			e instanceof H && (e = {
				target: e,
				frame: void 0,
				textureSourceOptions: {},
				resolution: void 0
			});
			let t = e.resolution || this._renderer.resolution, n = e.antialias || this._renderer.view.antialias, r = e.target, i = e.clearColor;
			i = i ? Array.isArray(i) && i.length === 4 ? i : A.shared.setValue(i).toArray() : Sp;
			let a = e.frame?.copyTo(bp) || Kt(r, xp).rectangle, o = e.defaultAnchor && { defaultAnchor: e.defaultAnchor };
			a.width = Math.max(a.width, 1 / t) | 0, a.height = Math.max(a.height, 1 / t) | 0;
			let s = vp.create({
				...e.textureSourceOptions,
				width: a.width,
				height: a.height,
				resolution: t,
				antialias: n,
				textureOptions: o
			}), c = j.shared.translate(-a.x, -a.y);
			return this._renderer.render({
				container: r,
				transform: c,
				target: s,
				clearColor: i
			}), s.source.updateMipmaps(), s;
		}
		destroy() {
			this._renderer = null;
		}
	}, Cp.extension = {
		type: [
			d.WebGLSystem,
			d.WebGPUSystem,
			d.CanvasSystem
		],
		name: "textureGenerator"
	};
}));
// node_modules/pixi.js/lib/utils/data/clean.mjs
function Tp(e) {
	let t = !1;
	for (let n in e) if (e[n] == null) {
		t = !0;
		break;
	}
	if (!t) return e;
	let n = /* @__PURE__ */ Object.create(null);
	for (let t in e) {
		let r = e[t];
		r && (n[t] = r);
	}
	return n;
}
function Ep(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n] == null ? t++ : e[n - t] = e[n];
	return e.length -= t, e;
}
var Dp = o((() => {})), Op, kp, Ap = o((() => {
	h(), Dp(), Op = class e {
		constructor(e) {
			this._managedResources = [], this._managedResourceHashes = [], this._managedCollections = [], this._ready = !1, this._running = !1, this._renderer = e;
		}
		init(t) {
			t = {
				...e.defaultOptions,
				...t
			}, this.maxUnusedTime = t.gcMaxUnusedTime, this._frequency = t.gcFrequency, this.enabled = t.gcActive, this.now = performance.now();
		}
		get enabled() {
			return !!this._handler;
		}
		set enabled(e) {
			this.enabled !== e && (e ? (this._handler = this._renderer.scheduler.repeat(() => {
				this._ready = !0;
			}, this._frequency, !1), this._collectionsHandler = this._renderer.scheduler.repeat(() => {
				for (let e of this._managedCollections) {
					let { context: t, collection: n, type: r } = e;
					t[n] = r === "hash" ? Tp(t[n]) : Ep(t[n]);
				}
			}, this._frequency)) : (this._renderer.scheduler.cancel(this._handler), this._renderer.scheduler.cancel(this._collectionsHandler), this._handler = 0, this._collectionsHandler = 0));
		}
		prerender({ container: e }) {
			this.now = performance.now(), e.renderGroup.gcTick = this._renderer.tick++, this._updateInstructionGCTick(e.renderGroup, e.renderGroup.gcTick);
		}
		postrender() {
			this._ready && this.enabled && (this.run(), this._ready = !1);
		}
		_updateInstructionGCTick(e, t) {
			e.instructionSet.gcTick = t, e.gcTick = t;
			for (let n of e.renderGroupChildren) this._updateInstructionGCTick(n, t);
		}
		addCollection(e, t, n) {
			this._managedCollections.push({
				context: e,
				collection: t,
				type: n
			});
		}
		addResource(e, t) {
			e._gcLastUsed === -1 ? (e._gcData = {
				index: this._managedResources.length,
				type: t
			}, e._gcLastUsed = this.now, e._onTouch?.(this.now), e.once("unload", this.removeResource, this), this._managedResources.push(e)) : (e._gcLastUsed = this.now, e._onTouch?.(this.now));
		}
		removeResource(e) {
			let t = e._gcData;
			if (!t) return;
			let n = t.index, r = this._managedResources.length - 1;
			if (this._running) this._managedResources[n] = null;
			else {
				if (n !== r) {
					let e = this._managedResources[r];
					this._managedResources[n] = e, e._gcData.index = n;
				}
				this._managedResources.length--;
			}
			e._gcData = null, e._gcLastUsed = -1;
		}
		addResourceHash(e, t, n, r = 0) {
			this._managedResourceHashes.push({
				context: e,
				hash: t,
				type: n,
				priority: r
			}), this._managedResourceHashes.sort((e, t) => e.priority - t.priority);
		}
		run() {
			if (this._running) return;
			let e = performance.now(), t = this._managedResourceHashes, n = this._managedResources;
			this._running = !0;
			try {
				for (let n of t) this.runOnHash(n, e);
				let r = n.length;
				for (let t = 0; t < r; t++) {
					let r = n[t];
					r && this.runOnResource(r, e);
				}
			} finally {
				let e = 0;
				for (let t = 0; t < n.length; t++) {
					let r = n[t];
					r && (e !== t && (n[e] = r, r._gcData.index = e), e++);
				}
				n.length = e, this._running = !1;
			}
		}
		updateRenderableGCTick(e, t) {
			let n = e.renderGroup ?? e.parentRenderGroup, r = n?.instructionSet?.gcTick ?? -1;
			(n?.gcTick ?? 0) === r && (e._gcLastUsed = t, e._onTouch?.(t));
		}
		runOnResource(e, t) {
			e._gcData.type === "renderable" && this.updateRenderableGCTick(e, t), t - e._gcLastUsed < this.maxUnusedTime || !e.autoGarbageCollect || (e.off("unload", this.removeResource, this), e.unload(), this.removeResource(e));
		}
		_createHashClone(e, t) {
			let n = /* @__PURE__ */ Object.create(null);
			for (let r in e) {
				if (r === t) break;
				e[r] !== null && (n[r] = e[r]);
			}
			return n;
		}
		runOnHash(e, t) {
			let { context: n, hash: r, type: i } = e, a = n[r], o = null, s = 0;
			for (let e in a) {
				let n = a[e];
				if (n === null) s++, s === 1e4 && !o && (o = this._createHashClone(a, e));
				else if (n._gcLastUsed === -1) n._gcLastUsed = t, n._onTouch?.(t), o && (o[e] = n);
				else if (i === "renderable" && this.updateRenderableGCTick(n, t), !(t - n._gcLastUsed < this.maxUnusedTime) && n.autoGarbageCollect) {
					if (i === "renderable") {
						let e = n, t = e.renderGroup ?? e.parentRenderGroup;
						t && (t.structureDidChange = !0);
					}
					n.unload(), n._gcData = null, n._gcLastUsed = -1, o || (s + 1 === 1e4 ? o = this._createHashClone(a, e) : (a[e] = null, s++));
				} else o && (o[e] = n);
			}
			o && (n[r] = o);
		}
		destroy() {
			this.enabled = !1, this._managedResources.forEach((e) => {
				e?.off("unload", this.removeResource, this);
			}), this._managedResources.length = 0, this._managedResourceHashes.length = 0, this._managedCollections.length = 0, this._renderer = null;
		}
	}, Op.extension = {
		type: [
			d.WebGLSystem,
			d.WebGPUSystem,
			d.CanvasSystem
		],
		name: "gc",
		priority: 0
	}, Op.defaultOptions = {
		gcActive: !0,
		gcMaxUnusedTime: 6e4,
		gcFrequency: 3e4
	}, kp = Op;
}));
// node_modules/pixi.js/lib/scene/graphics/gpu/colorToUniform.mjs
function jp(e, t, n) {
	let r = (e >> 24 & 255) / 255;
	t[n++] = (e & 255) / 255 * r, t[n++] = (e >> 8 & 255) / 255 * r, t[n++] = (e >> 16 & 255) / 255 * r, t[n++] = r;
}
var Mp = o((() => {})), Np, Pp = o((() => {
	h(), M(), Re(), Mp(), Us(), Gs(), tc(), Np = class {
		constructor(e) {
			this._stackIndex = 0, this._globalUniformDataStack = [], this._uniformsPool = [], this._activeUniforms = [], this._bindGroupPool = [], this._activeBindGroups = [], this._renderer = e;
		}
		reset() {
			this._stackIndex = 0;
			for (let e = 0; e < this._activeUniforms.length; e++) this._uniformsPool.push(this._activeUniforms[e]);
			for (let e = 0; e < this._activeBindGroups.length; e++) this._bindGroupPool.push(this._activeBindGroups[e]);
			this._activeUniforms.length = 0, this._activeBindGroups.length = 0;
		}
		start(e) {
			this.reset(), this.push(e);
		}
		bind({ size: e, projectionMatrix: t, worldTransformMatrix: n, worldColor: r, offset: i }) {
			let a = this._renderer.renderTarget.renderTarget, o = this._stackIndex ? this._globalUniformDataStack[this._stackIndex - 1] : {
				projectionData: a,
				worldTransformMatrix: new j(),
				worldColor: 4294967295,
				offset: new Ie()
			}, s = {
				projectionMatrix: t || this._renderer.renderTarget.projectionMatrix,
				resolution: e || a.size,
				worldTransformMatrix: n || o.worldTransformMatrix,
				worldColor: r || o.worldColor,
				offset: i || o.offset,
				bindGroup: null
			}, c = this._uniformsPool.pop() || this._createUniforms();
			this._activeUniforms.push(c);
			let l = c.uniforms;
			l.uProjectionMatrix = s.projectionMatrix, l.uResolution = s.resolution, l.uWorldTransformMatrix.copyFrom(s.worldTransformMatrix), l.uWorldTransformMatrix.tx -= s.offset.x, l.uWorldTransformMatrix.ty -= s.offset.y, jp(s.worldColor, l.uWorldColorAlpha, 0), c.update();
			let u;
			this._renderer.renderPipes.uniformBatch ? u = this._renderer.renderPipes.uniformBatch.getUniformBindGroup(c, !1) : (u = this._bindGroupPool.pop() || new Hs(), this._activeBindGroups.push(u), u.setResource(c, 0)), s.bindGroup = u, this._currentGlobalUniformData = s;
		}
		push(e) {
			this.bind(e), this._globalUniformDataStack[this._stackIndex++] = this._currentGlobalUniformData;
		}
		pop() {
			this._currentGlobalUniformData = this._globalUniformDataStack[--this._stackIndex - 1], this._renderer.type === Ws.WEBGL && this._currentGlobalUniformData.bindGroup.resources[0].update();
		}
		get bindGroup() {
			return this._currentGlobalUniformData.bindGroup;
		}
		get globalUniformData() {
			return this._currentGlobalUniformData;
		}
		get uniformGroup() {
			return this._currentGlobalUniformData.bindGroup.resources[0];
		}
		_createUniforms() {
			return new ec({
				uProjectionMatrix: {
					value: new j(),
					type: "mat3x3<f32>"
				},
				uWorldTransformMatrix: {
					value: new j(),
					type: "mat3x3<f32>"
				},
				uWorldColorAlpha: {
					value: /* @__PURE__ */ new Float32Array(4),
					type: "vec4<f32>"
				},
				uResolution: {
					value: [0, 0],
					type: "vec2<f32>"
				}
			}, { isStatic: !0 });
		}
		destroy() {
			this._renderer = null, this._globalUniformDataStack.length = 0, this._uniformsPool.length = 0, this._activeUniforms.length = 0, this._bindGroupPool.length = 0, this._activeBindGroups.length = 0, this._currentGlobalUniformData = null;
		}
	}, Np.extension = {
		type: [
			d.WebGLSystem,
			d.WebGPUSystem,
			d.CanvasSystem
		],
		name: "globalUniforms"
	};
})), Fp, Ip, Lp = o((() => {
	h(), vr(), Fp = 1, Ip = class {
		constructor() {
			this._tasks = [], this._offset = 0;
		}
		init() {
			_r.system.add(this._update, this);
		}
		repeat(e, t, n = !0) {
			let r = Fp++, i = 0;
			return n && (this._offset += 1e3, i = this._offset), this._tasks.push({
				func: e,
				duration: t,
				start: performance.now(),
				offset: i,
				last: performance.now(),
				repeat: !0,
				id: r
			}), r;
		}
		cancel(e) {
			for (let t = 0; t < this._tasks.length; t++) if (this._tasks[t].id === e) {
				this._tasks.splice(t, 1);
				return;
			}
		}
		_update() {
			let e = performance.now();
			for (let t = 0; t < this._tasks.length; t++) {
				let n = this._tasks[t];
				if (e - n.offset - n.last >= n.duration) {
					let t = e - n.start;
					n.func(t), n.last = e;
				}
			}
		}
		destroy() {
			_r.system.remove(this._update, this), this._tasks.length = 0;
		}
	}, Ip.extension = {
		type: [
			d.WebGLSystem,
			d.WebGPUSystem,
			d.CanvasSystem
		],
		name: "scheduler",
		priority: 0
	};
}));
// node_modules/pixi.js/lib/utils/sayHello.mjs
function Rp(e) {
	if (!zp) {
		if (U.get().getNavigator().userAgent.toLowerCase().indexOf("chrome") > -1) {
			let t = [
				`%c  %c  %c  %c  %c PixiJS %c v${Xd} (${e}) http://www.pixijs.com/

`,
				"background: #E72264; padding:5px 0;",
				"background: #6CA2EA; padding:5px 0;",
				"background: #B5D33D; padding:5px 0;",
				"background: #FED23F; padding:5px 0;",
				"color: #FFFFFF; background: #E72264; padding:5px 0;",
				"color: #E72264; background: #FFFFFF; padding:5px 0;"
			];
			globalThis.console.log(...t);
		} else globalThis.console && globalThis.console.log(`PixiJS ${Xd} - ${e} - http://www.pixijs.com/`);
		zp = !0;
	}
}
var zp, Bp = o((() => {
	W(), Zd(), zp = !1;
})), Vp, Hp = o((() => {
	h(), Bp(), Gs(), Vp = class {
		constructor(e) {
			this._renderer = e;
		}
		init(e) {
			if (e.hello) {
				let e = this._renderer.name;
				this._renderer.type === Ws.WEBGL && (e += ` ${this._renderer.context.webGLVersion}`), Rp(e);
			}
		}
	}, Vp.extension = {
		type: [
			d.WebGLSystem,
			d.WebGPUSystem,
			d.CanvasSystem
		],
		name: "hello",
		priority: -2
	}, Vp.defaultOptions = { hello: !1 };
})), Up, Wp, Gp = o((() => {
	h(), Xe(), Up = class e {
		constructor(e) {
			this._renderer = e;
		}
		init(t) {
			t = {
				...e.defaultOptions,
				...t
			}, this.maxUnusedTime = t.renderableGCMaxUnusedTime;
		}
		get enabled() {
			return F("8.15.0", "RenderableGCSystem.enabled is deprecated, please use the GCSystem.enabled instead."), this._renderer.gc.enabled;
		}
		set enabled(e) {
			F("8.15.0", "RenderableGCSystem.enabled is deprecated, please use the GCSystem.enabled instead."), this._renderer.gc.enabled = e;
		}
		addManagedHash(e, t) {
			F("8.15.0", "RenderableGCSystem.addManagedHash is deprecated, please use the GCSystem.addCollection instead."), this._renderer.gc.addCollection(e, t, "hash");
		}
		addManagedArray(e, t) {
			F("8.15.0", "RenderableGCSystem.addManagedArray is deprecated, please use the GCSystem.addCollection instead."), this._renderer.gc.addCollection(e, t, "array");
		}
		addRenderable(e) {
			F("8.15.0", "RenderableGCSystem.addRenderable is deprecated, please use the GCSystem instead."), this._renderer.gc.addResource(e, "renderable");
		}
		run() {
			F("8.15.0", "RenderableGCSystem.run is deprecated, please use the GCSystem instead."), this._renderer.gc.run();
		}
		destroy() {
			this._renderer = null;
		}
	}, Up.extension = {
		type: [
			d.WebGLSystem,
			d.WebGPUSystem,
			d.CanvasSystem
		],
		name: "renderableGC",
		priority: 0
	}, Up.defaultOptions = {
		renderableGCActive: !0,
		renderableGCMaxUnusedTime: 6e4,
		renderableGCFrequency: 3e4
	}, Wp = Up;
})), Kp, qp, Jp = o((() => {
	h(), Xe(), Kp = class e {
		get count() {
			return this._renderer.tick;
		}
		get checkCount() {
			return this._checkCount;
		}
		set checkCount(e) {
			F("8.15.0", "TextureGCSystem.run is deprecated, please use the GCSystem instead."), this._checkCount = e;
		}
		get maxIdle() {
			return this._renderer.gc.maxUnusedTime / 1e3 * 60;
		}
		set maxIdle(e) {
			F("8.15.0", "TextureGCSystem.run is deprecated, please use the GCSystem instead."), this._renderer.gc.maxUnusedTime = e / 60 * 1e3;
		}
		get checkCountMax() {
			return Math.floor(this._renderer.gc._frequency / 1e3);
		}
		set checkCountMax(e) {
			F("8.15.0", "TextureGCSystem.run is deprecated, please use the GCSystem instead.");
		}
		get active() {
			return this._renderer.gc.enabled;
		}
		set active(e) {
			F("8.15.0", "TextureGCSystem.run is deprecated, please use the GCSystem instead."), this._renderer.gc.enabled = e;
		}
		constructor(e) {
			this._renderer = e, this._checkCount = 0;
		}
		init(t) {
			t.textureGCActive !== e.defaultOptions.textureGCActive && (this.active = t.textureGCActive), t.textureGCMaxIdle !== e.defaultOptions.textureGCMaxIdle && (this.maxIdle = t.textureGCMaxIdle), t.textureGCCheckCountMax !== e.defaultOptions.textureGCCheckCountMax && (this.checkCountMax = t.textureGCCheckCountMax);
		}
		run() {
			F("8.15.0", "TextureGCSystem.run is deprecated, please use the GCSystem instead."), this._renderer.gc.run();
		}
		destroy() {
			this._renderer = null;
		}
	}, Kp.extension = {
		type: [d.WebGLSystem, d.WebGPUSystem],
		name: "textureGC"
	}, Kp.defaultOptions = {
		textureGCActive: !0,
		textureGCAMaxIdle: null,
		textureGCMaxIdle: 3600,
		textureGCCheckCountMax: 600
	}, qp = Kp;
})), Yp, Xp, Zp = o((() => {
	y(), We(), wn(), V(), Yp = class e extends v {
		constructor(e = {}) {
			super(), this.uid = N("renderTarget"), this.colorAttachments = [], this.dirtyId = 0, this.isRoot = !1, this._size = /* @__PURE__ */ new Float32Array(2), this._managedColorTextures = !1, this._managedDepthStencilTexture = !1, this._depth = !1, this._stencil = !1, this._colorTextures = null;
			let t = "colorAttachments" in e ? e : this._normalizeOptions(e);
			if (this.isRoot = t.isRoot ?? !1, this.label = t.label, this.colorAttachments = t.colorAttachments, this.depthStencilAttachment = t.depthStencilAttachment, this.depthStencilAttachment) {
				let e = this.depthStencilAttachment.texture.format;
				this._depth ||= e.includes("depth"), this._stencil ||= e.includes("stencil");
			}
			if (this.colorAttachments.length === 0 && !this.depthStencilAttachment) throw Error("[RenderTarget] no color textures or depth textures were provided. Provide a depthStencilTexture or set depth/stencil to true when using colorTextures: 0.");
			if (this.colorAttachments.length > 0) {
				let e = this.colorTexture;
				this.resize(e.width, e.height, e._resolution);
			}
			this.sizeSource && this.sizeSource.on("resize", this.onSourceResize, this);
		}
		_normalizeOptions(t) {
			let n = {
				...e.defaultOptions,
				...t
			}, r = [], i;
			if (typeof n.colorTextures == "number") {
				if (n.colorTextures > 0) {
					this._managedColorTextures = !0;
					for (let e = 0; e < n.colorTextures; e++) r.push({
						texture: new Cn({
							width: n.width,
							height: n.height,
							resolution: n.resolution,
							antialias: n.antialias
						}),
						storeOp: "store"
					});
				}
			} else n.colorTextures.forEach((e) => {
				r.push({
					texture: e.source,
					storeOp: "store"
				});
			});
			let a = n.depthStencilTexture === !0;
			if (this._depth = !!(n.depth || a), this._stencil = !!(n.stencil || a), n.depthStencilTexture instanceof B || n.depthStencilTexture instanceof Cn) {
				if (n.isRoot) throw Error("[RenderTarget] cannot attach a depth-stencil texture to the screen — the canvas owns its own depth/stencil buffers. Render to a texture target instead.");
				i = { texture: n.depthStencilTexture.source };
			} else (a && !n.isRoot || (n.stencil || n.depth) && r.length === 0) && (i = this._createDepthStencilTexture(n.width, n.height, n.resolution));
			return {
				colorAttachments: r,
				depthStencilAttachment: i,
				isRoot: n.isRoot,
				label: n.label
			};
		}
		get size() {
			let e = this._size;
			return e[0] = this.pixelWidth, e[1] = this.pixelHeight, e;
		}
		get width() {
			return this.sizeSource.width;
		}
		get height() {
			return this.sizeSource.height;
		}
		get pixelWidth() {
			return this.sizeSource.pixelWidth;
		}
		get pixelHeight() {
			return this.sizeSource.pixelHeight;
		}
		get resolution() {
			return this.sizeSource._resolution;
		}
		get colorTextures() {
			return this._colorTextures ||= this.colorAttachments.map((e) => e.texture), this._colorTextures;
		}
		get depthStencilTexture() {
			return this.depthStencilAttachment?.texture ?? null;
		}
		get depth() {
			return this._depth;
		}
		get stencil() {
			return this._stencil;
		}
		get colorTexture() {
			return this.colorAttachments[0]?.texture;
		}
		get sizeSource() {
			return this.colorAttachments[0]?.texture ?? this.depthStencilAttachment?.texture;
		}
		onSourceResize(e) {
			this.resize(e.width, e.height, e._resolution, !0);
		}
		ensureDepthStencilTexture() {
			this._createDepthStencilTexture(this.sizeSource.width, this.sizeSource.height, this.sizeSource._resolution), this._depth = !0, this._stencil = !0;
		}
		resize(e, t, n = this.resolution, r = !1) {
			if (this.dirtyId++, this.colorAttachments.forEach((i, a) => {
				r && a === 0 || i.texture.resize(e, t, n);
			}), this.depthStencilAttachment) {
				if (r && this.colorAttachments.length === 0) return;
				this.depthStencilAttachment.texture.resize(e, t, n);
			}
		}
		destroy() {
			(this.colorAttachments || this.depthStencilAttachment) && (this.emit("destroy", this), this.sizeSource.off("resize", this.onSourceResize, this), this._managedColorTextures && this.colorAttachments.forEach((e) => {
				e.texture.destroy();
			}), this.depthStencilAttachment && (this._managedDepthStencilTexture && this.depthStencilAttachment.texture.destroy(), delete this.depthStencilAttachment), this.colorAttachments = null, this._colorTextures = null, this.removeAllListeners());
		}
		_createDepthStencilTexture(e, t, n) {
			if (this.depthStencilAttachment) return this.depthStencilAttachment;
			let r = new Cn({
				width: e,
				height: t,
				resolution: n,
				format: "depth24plus-stencil8",
				autoGenerateMipmaps: !1,
				antialias: !1,
				mipLevelCount: 1
			});
			return r.resize(e, t, n), this._managedDepthStencilTexture = !0, this.depthStencilAttachment = { texture: r }, this.depthStencilAttachment;
		}
	}, Yp.defaultOptions = {
		width: 0,
		height: 0,
		resolution: 1,
		colorTextures: 1,
		stencil: !1,
		depth: !1,
		antialias: !1,
		isRoot: !1
	}, Xp = Yp;
}));
// node_modules/pixi.js/lib/rendering/renderers/shared/texture/utils/getCanvasTexture.mjs
function Qp(e, t) {
	if (!$p.has(e)) {
		let n = new B({ source: new ka({
			resource: e,
			...t
		}) }), r = () => {
			$p.get(e) === n && $p.delete(e);
		};
		n.once("destroy", r), n.source.once("destroy", r), $p.set(e, n);
	}
	return $p.get(e);
}
var $p, em = o((() => {
	et(), Aa(), V(), $p = /* @__PURE__ */ new Map(), $e.register($p);
})), tm, nm, rm = o((() => {
	W(), h(), wt(), Xe(), Gs(), Zp(), ro(), nr(), em(), tm = class e {
		get autoDensity() {
			return this.texture.source.autoDensity;
		}
		set autoDensity(e) {
			this.texture.source.autoDensity = e;
		}
		get resolution() {
			return this.texture.source._resolution;
		}
		set resolution(e) {
			this.texture.source.resize(this.texture.source.width, this.texture.source.height, e);
		}
		constructor(e) {
			this._renderer = e;
		}
		init(t) {
			t = {
				...e.defaultOptions,
				...t
			}, t.view && (F(P, "ViewSystem.view has been renamed to ViewSystem.canvas"), t.canvas = t.view), this.screen = new R(0, 0, t.width, t.height), this.canvas = t.canvas || U.get().createCanvas(), this.antialias = !!t.antialias;
			let { depth: n, ...r } = t;
			!r.format && this._renderer.type === Ws.WEBGPU && (r.format = U.get().getNavigator().gpu.getPreferredCanvasFormat()), this.texture = Qp(this.canvas, r), this.renderTarget = new Xp({
				colorTextures: [this.texture],
				depth: !!n,
				isRoot: !0
			}), this.texture.source.transparent = t.backgroundAlpha < 1, this.texture.source.on("resize", this._updateScreenSize, this), this.resolution = t.resolution, this._updateScreenSize();
		}
		resize(e, t, n) {
			this.texture.source.resize(e, t, n), this._updateScreenSize(), this.screen.width = this.texture.frame.width, this.screen.height = this.texture.frame.height;
		}
		destroy(e = !1) {
			(typeof e == "boolean" ? e : e?.removeView) && this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas), this.texture.source.off("resize", this._updateScreenSize, this), tr.removeScreen(this._renderer.uid), no.removeScreen(this._renderer.uid), this.texture.destroy();
		}
		_updateScreenSize() {
			let { pixelWidth: e, pixelHeight: t } = this.texture.source, n = this._renderer.uid;
			tr.setScreenSize(n, e, t, this.resolution), no.setScreenSize(n, e, t);
		}
	}, tm.extension = {
		type: [
			d.WebGLSystem,
			d.WebGPUSystem,
			d.CanvasSystem
		],
		name: "view",
		priority: 0
	}, tm.defaultOptions = {
		width: 800,
		height: 600,
		autoDensity: !1,
		antialias: !1
	}, nm = tm;
})), im, am, om = o((() => {
	Dd(), Nd(), qd(), Yd(), ef(), Wf(), np(), ip(), op(), lp(), fp(), _p(), wp(), Ap(), Pp(), Lp(), Hp(), Gp(), Jp(), rm(), im = [
		cp,
		Np,
		Vp,
		nm,
		Kd,
		kp,
		qp,
		Cp,
		gp,
		$d,
		Wp,
		Ip
	], am = [
		dp,
		Uf,
		Jd,
		Md,
		tp,
		ap,
		rp,
		Ed
	];
})), sm, cm, lm, um = o((() => {
	h(), sm = 0, cm = class {
		constructor(e, t, n, r, i, a) {
			this.autoGarbageCollect = !0, this._gpuData = null, this.gpuBindGroup = e, this._gcLastUsed = t, this.keyLow = n, this.keyHigh = r, this.layoutKey = i, this.cacheId = a;
		}
		unload() {
			this.gpuBindGroup = null;
		}
	}, lm = class {
		constructor(e) {
			this._hash = /* @__PURE__ */ Object.create(null), this._cacheId = 0, this._renderer = e, e.gc.addResourceHash(this, "_hash", "resource"), e.gc.addCollection(this, "_hash", "hash");
		}
		contextChange(e) {
			this._gpu = e, this._cacheId = ++sm, this._hash = /* @__PURE__ */ Object.create(null);
		}
		getBindGroup(e, t, n) {
			let r = t._layoutKey << 4 | n, i = e._gpuEntry;
			if (i !== null && e._gpuEntryLayoutKey === r && i.gpuBindGroup !== null && i.cacheId === this._cacheId) return i._gcLastUsed = this._renderer.gc.now, i.gpuBindGroup;
			let a = e._keyLow, o = e._keyHigh, s = (a ^ Math.imul(r + 1, 2654435761)) & 1073741823;
			if (i = this._hash[s], i && i.keyLow === a && i.keyHigh === o && i.layoutKey === r) i._gcLastUsed = this._renderer.gc.now;
			else {
				let c = this._createBindGroup(e, t, n);
				i = new cm(c, this._renderer.gc.now, a, o, r, this._cacheId), this._hash[s] = i;
			}
			return e._gpuEntry = i, e._gpuEntryLayoutKey = r, i.gpuBindGroup;
		}
		_createBindGroup(e, t, n) {
			let r = this._gpu.device, i = t.layout[n], a = e.layout, o = [], s = this._renderer;
			for (let t in i) {
				let n = e.resources[a ? a[t] : i[t]];
				if (!n || n.destroyed) throw Error(`[BindGroup] no usable resource for the shader's '${t}' binding: it was never set, was destroyed while a shader still uses it, or is missing from the bind group's layout.`);
				let r;
				if (n._resourceType === "uniformGroup") {
					let e = n;
					s.ubo.updateUniformGroup(e);
					let t = e.buffer;
					r = {
						buffer: s.buffer.getGPUBuffer(t),
						offset: 0,
						size: t.descriptor.size
					};
				} else if (n._resourceType === "buffer") {
					let e = n;
					r = {
						buffer: s.buffer.getGPUBuffer(e),
						offset: 0,
						size: e.descriptor.size
					};
				} else if (n._resourceType === "bufferResource") {
					let e = n;
					r = {
						buffer: s.buffer.getGPUBuffer(e.buffer),
						offset: e.offset,
						size: e.size
					};
				} else if (n._resourceType === "textureSampler") {
					let e = n;
					r = s.texture.getGpuSampler(e);
				} else if (n._resourceType === "textureSource") {
					let e = n;
					r = s.texture.getTextureView(e);
				} else if (n._resourceType === "textureView") {
					let e = n;
					r = s.texture.getTextureView(e.source, e.viewDescriptor);
				}
				o.push({
					binding: i[t],
					resource: r
				});
			}
			let c = s.shader.getProgramData(t).bindGroups[n];
			return r.createBindGroup({
				layout: c,
				entries: o
			});
		}
		destroy() {
			this._hash = null, this._renderer = null;
		}
	}, lm.extension = {
		type: [d.WebGPUSystem],
		name: "bindGroup"
	};
})), dm, fm = o((() => {
	dm = class {
		constructor(e) {
			this.items = /* @__PURE__ */ Object.create(null);
			let { renderer: t, type: n, onUnload: r, priority: i, name: a } = e;
			this._renderer = t, t.gc.addResourceHash(this, "items", n, i ?? 0), this._onUnload = r, this.name = a;
		}
		add(e) {
			return !this.items[e.uid] && (this.items[e.uid] = e, e.once("unload", this.remove, this), e._gcLastUsed = this._renderer.gc.now, !0);
		}
		remove(e, ...t) {
			if (!this.items[e.uid]) return;
			let n = e._gpuData[this._renderer.uid];
			n && (this._onUnload?.(e, ...t), e.off("unload", this.remove, this), n.destroy(), e._gpuData[this._renderer.uid] = null, this.items[e.uid] = null);
		}
		removeAll(...e) {
			Object.values(this.items).forEach((t) => t && this.remove(t, ...e));
		}
		destroy(...e) {
			this.removeAll(...e), this.items = /* @__PURE__ */ Object.create(null), this._renderer = null, this._onUnload = null;
		}
	};
})), pm, mm, hm = o((() => {
	h(), fm(), af(), pm = class {
		constructor(e) {
			this.gpuBuffer = e;
		}
		destroy() {
			this.gpuBuffer.destroy(), this.gpuBuffer = null;
		}
	}, mm = class {
		constructor(e) {
			this._renderer = e, this._managedBuffers = new dm({
				renderer: e,
				type: "resource",
				onUnload: this.onBufferUnload.bind(this),
				name: "gpuBuffer"
			});
		}
		contextChange(e) {
			this._gpu = e, this.destroyAll();
		}
		getGPUBuffer(e) {
			return e._gcLastUsed = this._renderer.gc.now, e._gpuData[this._renderer.uid]?.gpuBuffer || this.createGPUBuffer(e);
		}
		updateBuffer(e) {
			let t = this.getGPUBuffer(e), n = e.data;
			return e._updateID && n && (e._updateID = 0, this._gpu.device.queue.writeBuffer(t, e._updateOffset, n.buffer, n.byteOffset + e._updateOffset, (e._updateSize || n.byteLength) + 3 & -4)), t;
		}
		destroyAll() {
			this._managedBuffers.removeAll();
		}
		onBufferUnload(e) {
			e.off("update", this.updateBuffer, this), e.off("change", this.onBufferChange, this);
		}
		createGPUBuffer(e) {
			let t = this._gpu.device.createBuffer(e.descriptor);
			return e._updateID = 0, e.data && (rf(e.data.buffer, t.getMappedRange(), e.data.byteOffset, e.data.byteLength), t.unmap()), e._gpuData[this._renderer.uid] = new pm(t), this._managedBuffers.add(e) && (e.on("update", this.updateBuffer, this), e.on("change", this.onBufferChange, this)), t;
		}
		onBufferChange(e) {
			this._managedBuffers.remove(e), e._updateID = 0, this.createGPUBuffer(e);
		}
		destroy() {
			this._managedBuffers.destroy(), this._renderer = null, this._gpu = null;
		}
	}, mm.extension = {
		type: [d.WebGPUSystem],
		name: "buffer"
	};
})), gm, _m = o((() => {
	h(), gm = class {
		constructor(e) {
			this._colorMaskCache = 15, this._renderer = e;
		}
		setMask(e) {
			this._colorMaskCache !== e && (this._colorMaskCache = e, this._renderer.pipeline.setColorMask(e));
		}
		destroy() {
			this._renderer = null, this._colorMaskCache = null;
		}
	}, gm.extension = {
		type: [d.WebGPUSystem],
		name: "colorMask"
	};
}));
// node_modules/pixi.js/lib/utils/browser/isWebKit.mjs
function vm(e) {
	let { userAgent: t } = U.get().getNavigator();
	if (!/AppleWebKit\//.test(t) || /Chrome\/|Chromium\//.test(t)) return !1;
	if (!e) return !0;
	let n = /Version\/([\d.]+)/.exec(t)?.[1];
	return !n || !(e.from && ym(n, e.from) < 0 || e.before && ym(n, e.before) >= 0);
}
function ym(e, t) {
	let n = e.split("."), r = t.split(".");
	for (let e = 0; e < Math.max(n.length, r.length); e++) {
		let t = (parseInt(n[e], 10) || 0) - (parseInt(r[e], 10) || 0);
		if (t) return t;
	}
	return 0;
}
var bm = o((() => {
	W();
})), xm, Sm, Cm = o((() => {
	W(), h(), bm(), L(), xm = /* @__PURE__ */ new Set([
		"apple",
		"arm",
		"qualcomm",
		"img-tec"
	]), Sm = class {
		constructor(e) {
			this._renderer = e;
		}
		async init(e) {
			return this._initPromise ||= (this._options = e, (e.gpu ? Promise.resolve(e.gpu) : this._createDeviceAndAdaptor(e)).then((e) => this._setGpu(e))), this._initPromise;
		}
		_setGpu(e) {
			this.gpu = e, this.extensions = {
				transientAttachment: typeof GPUTextureUsage.TRANSIENT_ATTACHMENT == "number" && !vm({
					from: "27.1",
					before: "28"
				}),
				tileBased: xm.has(e.adapter?.info?.vendor)
			}, this._options.gpu || e.device.lost.then(() => this._restoreDevice()).catch((e) => I("WebGPU device was lost and could not be restored", e)), this._renderer.runners.contextChange.emit(this.gpu);
		}
		async _restoreDevice() {
			if (!this._renderer) return;
			let e = await this._createDeviceAndAdaptor(this._options);
			this._renderer ? this._setGpu(e) : e.device.destroy();
		}
		contextChange(e) {
			this._renderer.gpu = e;
		}
		async _createDeviceAndAdaptor(e) {
			let t = await U.get().getNavigator().gpu.requestAdapter({
				powerPreference: e.powerPreference,
				forceFallbackAdapter: e.forceFallbackAdapter
			});
			if (!t) throw Error("WebGPU not supported. No GPU adapter was returned by navigator.gpu.requestAdapter().");
			let n = [
				"texture-compression-bc",
				"texture-compression-astc",
				"texture-compression-etc2",
				"indirect-first-instance",
				"bgra8unorm-storage",
				"texture-formats-tier1"
			].filter((e) => t.features.has(e));
			return {
				adapter: t,
				device: await t.requestDevice({
					requiredFeatures: n,
					requiredLimits: {
						maxSampledTexturesPerShaderStage: t.limits.maxSampledTexturesPerShaderStage,
						maxSamplersPerShaderStage: t.limits.maxSamplersPerShaderStage,
						minUniformBufferOffsetAlignment: t.limits.minUniformBufferOffsetAlignment
					}
				})
			};
		}
		destroy() {
			this._options?.gpu || this.gpu?.device.destroy(), this.gpu = null, this.extensions = null, this._renderer = null;
		}
	}, Sm.extension = {
		type: [d.WebGPUSystem],
		name: "device"
	}, Sm.defaultOptions = {
		powerPreference: void 0,
		forceFallbackAdapter: !1
	};
})), wm, Tm = o((() => {
	wm = class {
		constructor(e, t, n, r) {
			this.gpuBundle = e, this.stateKey = t, this.device = n, this.label = r;
		}
	};
})), Em, Dm = o((() => {
	h(), L(), Tm(), Em = class {
		constructor(e) {
			this._boundBindGroup = /* @__PURE__ */ Object.create(null), this._boundVertexBuffer = /* @__PURE__ */ Object.create(null), this._renderer = e;
			for (let e = 0; e < 16; e++) this._boundBindGroup[e] = {
				bindGroup: null,
				program: null,
				entry: null
			};
		}
		renderStart() {
			this.commandFinished = new Promise((e) => {
				this._resolveCommandFinished = e;
			}), this.commandEncoder = this._renderer.gpu.device.createCommandEncoder();
		}
		beginRenderPass(e) {
			return this.endRenderPass(), this._clearCache(), this._passEncoder = this.commandEncoder.beginRenderPass(e.descriptor), this.renderPassEncoder = this._passEncoder, this._passEncoder;
		}
		endRenderPass() {
			this._passEncoder && this._passEncoder.end(), this.renderPassEncoder = null, this._passEncoder = null;
		}
		beginBundle(e) {
			if (this._passEncoder !== this.renderPassEncoder) throw Error("Cannot begin a new render bundle while one is already being recorded.");
			this._clearCache();
			let t = this._renderer.pipeline, n = t.getBundleDescriptor();
			n.label = e, this._bundleStateKey = t.bundleStateKey, this._bundleLabel = e, this.renderPassEncoder = this._gpu.device.createRenderBundleEncoder(n);
		}
		endBundle() {
			let e = this.renderPassEncoder;
			if (!e || !("finish" in e)) throw Error("endBundle called without an active render bundle.");
			let t = e.finish({ label: this._bundleLabel });
			return this.renderPassEncoder = this._passEncoder, this._clearCache(), new wm(t, this._bundleStateKey, this._gpu.device, this._bundleLabel);
		}
		isBundleValid(e) {
			return e?.stateKey === this._renderer.pipeline.bundleStateKey && e.device === this._gpu.device;
		}
		executeBundle(e) {
			let t = [];
			if (Array.isArray(e)) for (let n = 0; n < e.length; n++) t[n] = this._getGpuBundle(e[n]);
			else t[0] = this._getGpuBundle(e);
			this._clearCache(), this._passEncoder.executeBundles(t);
		}
		_getGpuBundle(e) {
			return this.isBundleValid(e) || I(`Render bundle ${e?.label ?? "(unlabeled)"} was recorded against a different render target state or on a lost device. Re-record it \u2014 replaying it will either be rejected by WebGPU or draw with the wrong winding. Check encoder.isBundleValid(bundle) before executing.`), e.gpuBundle;
		}
		setViewport(e) {
			this._passEncoder.setViewport(e.x, e.y, e.width, e.height, 0, 1);
		}
		setStencilReference(e) {
			this._passEncoder.setStencilReference(e);
		}
		setPipelineFromGeometryProgramAndState(e, t, n, r, i) {
			let a = this._renderer.pipeline.getPipeline(e, t, n, r, i);
			this.setPipeline(a);
		}
		setPipeline(e) {
			this._boundPipeline !== e && (this._boundPipeline = e, this.renderPassEncoder.setPipeline(e));
		}
		_setVertexBuffer(e, t) {
			this._boundVertexBuffer[e] !== t && (this._boundVertexBuffer[e] = t, this.renderPassEncoder.setVertexBuffer(e, this._renderer.buffer.updateBuffer(t)));
		}
		_setIndexBuffer(e) {
			if (this._boundIndexBuffer === e) return;
			this._boundIndexBuffer = e;
			let t = e.data.BYTES_PER_ELEMENT === 2 ? "uint16" : "uint32";
			this.renderPassEncoder.setIndexBuffer(this._renderer.buffer.updateBuffer(e), t);
		}
		resetBindGroup(e) {
			let t = this._boundBindGroup[e];
			t.bindGroup = null, t.program = null, t.entry = null;
		}
		setBindGroup(e, t, n) {
			let r = this._boundBindGroup[e];
			if (r.bindGroup === t && r.program === n && r.entry === t._gpuEntry) return;
			r.bindGroup = t, r.program = n, t._touch(this._renderer.gc.now);
			let i = this._renderer.bindGroup.getBindGroup(t, n, e);
			r.entry = t._gpuEntry, this.renderPassEncoder.setBindGroup(e, i);
		}
		setGeometry(e, t) {
			let n = this._renderer.pipeline.getBufferNamesToBind(e, t);
			for (let t = 0; t < n.length; t++) this._setVertexBuffer(t, e.attributes[n[t]].buffer);
			e.indexBuffer && this._setIndexBuffer(e.indexBuffer);
		}
		_setShaderBindGroups(e, t) {
			let n = e.gpuProgram, r = n.layout;
			for (let i = 0; i < r.length; i++) {
				let a = e.groups[i];
				r[i] && a && (t || this._syncBindGroup(a), this.setBindGroup(i, a, n));
			}
		}
		_syncBindGroup(e) {
			let t = e.resources, n = e._resourceKeys;
			for (let e = 0; e < n.length; e++) {
				let r = t[n[e]];
				r && r.isUniformGroup && this._renderer.ubo.updateUniformGroup(r);
			}
		}
		draw(e) {
			let { geometry: t, shader: n, state: r, topology: i, size: a, start: o, baseVertex: s, instanceCount: c, skipSync: l, firstInstance: u } = e;
			this.setPipelineFromGeometryProgramAndState(t, n.gpuProgram, r, i, n._overrides), this.setGeometry(t, n.gpuProgram), this._setShaderBindGroups(n, l), t.indexBuffer ? this.renderPassEncoder.drawIndexed(a || t.indexCount || t.indexBuffer.data.length, c ?? t.instanceCount, o || 0, s || 0, u || 0) : this.renderPassEncoder.draw(a || t.vertexCount, c ?? t.instanceCount, o || 0, u || 0);
		}
		drawIndirect(e) {
			let { geometry: t, shader: n, state: r, topology: i, skipSync: a, indirectBuffer: o, indirectOffset: s } = e;
			this.setPipelineFromGeometryProgramAndState(t, n.gpuProgram, r, i, n._overrides), this.setGeometry(t, n.gpuProgram), this._setShaderBindGroups(n, a), t.indexBuffer ? this.renderPassEncoder.drawIndexedIndirect(o, s) : this.renderPassEncoder.drawIndirect(o, s);
		}
		finishRenderPass() {
			this._passEncoder &&= (this._passEncoder.end(), this.renderPassEncoder = null, null);
		}
		postrender() {
			this.finishRenderPass(), this._gpu.device.queue.submit([this.commandEncoder.finish()]), this._resolveCommandFinished(), this.commandEncoder = null;
		}
		_clearCache() {
			for (let e = 0; e < 16; e++) {
				let t = this._boundBindGroup[e];
				t.bindGroup = null, t.program = null, t.entry = null, this._boundVertexBuffer[e] = null;
			}
			this._boundIndexBuffer = null, this._boundPipeline = null;
		}
		destroy() {
			this._renderer = null, this._gpu = null, this._boundBindGroup = null, this._boundVertexBuffer = null, this._boundIndexBuffer = null, this._boundPipeline = null, this.renderPassEncoder = null, this._passEncoder = null;
		}
		contextChange(e) {
			this._gpu = e;
		}
	}, Em.extension = {
		type: [d.WebGPUSystem],
		name: "encoder",
		priority: 1
	};
})), Om, km = o((() => {
	h(), Om = class {
		constructor(e) {
			this.supportsOverrideConstants = !1, this._renderer = e;
		}
		contextChange() {
			let e = this._renderer.device.gpu.device;
			this.maxTextures = Math.min(e.limits.maxSampledTexturesPerShaderStage, e.limits.maxSamplersPerShaderStage), this.maxBatchableTextures = this.maxTextures, this.minUniformBufferOffsetAlignment = e.limits.minUniformBufferOffsetAlignment, this._detectOverrideConstantsSupport(e);
		}
		_detectOverrideConstantsSupport(e) {
			e.pushErrorScope("validation");
			let t = e.createShaderModule({ code: "override TEST_VALUE: f32 = 0.0;\n@compute @workgroup_size(1) fn main() {}" });
			e.createComputePipeline({
				layout: "auto",
				compute: {
					module: t,
					entryPoint: "main",
					constants: { TEST_VALUE: 1 }
				}
			}), e.popErrorScope().then((e) => {
				this.supportsOverrideConstants = !e;
			});
		}
		destroy() {}
	}, Om.extension = {
		type: [d.WebGPUSystem],
		name: "limits"
	};
})), Am, jm = o((() => {
	h(), Am = class {
		constructor(e) {
			this._renderer = e, e.renderTarget.onRenderTargetChange.add(this);
		}
		contextChange() {
			this._activeGpuRenderTarget = null;
		}
		onRenderTargetChange(e) {
			let t = this._renderer.renderTarget.getGpuRenderTarget(e);
			this._activeRenderTarget = e, this._activeGpuRenderTarget = t, this.setStencilMode(t.stencilMode, t.stencilReference);
		}
		setStencilMode(e, t) {
			let n = this._activeGpuRenderTarget ??= this._renderer.renderTarget.getGpuRenderTarget(this._activeRenderTarget);
			n.stencilMode = e, n.stencilReference = t;
			let r = this._renderer;
			r.pipeline.setStencilMode(e), r.encoder.setStencilReference(t);
		}
		destroy() {
			this._renderer.renderTarget.onRenderTargetChange.remove(this), this._renderer = null, this._activeRenderTarget = null, this._activeGpuRenderTarget = null;
		}
	}, Am.extension = {
		type: [d.WebGPUSystem],
		name: "stencil"
	};
})), Mm, Nm = o((() => {
	$c(), kc(), Dc(), Mm = class {
		constructor(e) {
			this._syncFunctionHash = /* @__PURE__ */ Object.create(null), this._adaptor = e, this._systemCheck();
		}
		_systemCheck() {
			if (!Zc()) throw Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.");
		}
		ensureUniformGroup(e) {
			let t = this.getUniformGroupData(e);
			e.buffer ||= new Oc({
				data: new Float32Array(t.layout.size / 4),
				usage: Ec.UNIFORM | Ec.COPY_DST
			});
		}
		getUniformGroupData(e) {
			return this._syncFunctionHash[e._signature] || this._initUniformGroup(e);
		}
		_initUniformGroup(e) {
			let t = e._signature, n = this._syncFunctionHash[t];
			if (!n) {
				let r = Object.keys(e.uniformStructures).map((t) => e.uniformStructures[t]), i = this._adaptor.createUboElements(r), a = this._generateUboSync(i.uboElements);
				n = this._syncFunctionHash[t] = {
					layout: i,
					syncFunction: a
				};
			}
			return this._syncFunctionHash[t];
		}
		_generateUboSync(e) {
			return this._adaptor.generateUboSync(e);
		}
		syncUniformGroup(e, t, n) {
			let r = this.getUniformGroupData(e);
			e.buffer ||= new Oc({
				data: new Float32Array(r.layout.size / 4),
				usage: Ec.UNIFORM | Ec.COPY_DST
			});
			let i = null;
			return t || (t = e.buffer.data, i = e.buffer.dataInt32), n ||= 0, r.syncFunction(e.uniforms, t, i, n), !0;
		}
		updateUniformGroup(e) {
			if (e.isStatic && !e._dirtyId) return !1;
			e._dirtyId = 0;
			let t = this.syncUniformGroup(e);
			return e.buffer.update(), t;
		}
		destroy() {
			this._syncFunctionHash = null;
		}
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/gpu/shader/utils/createUboElementsWGSL.mjs
function Pm(e) {
	let t = e.map((e) => ({
		data: e,
		offset: 0,
		size: 0
	})), n = 0;
	for (let e = 0; e < t.length; e++) {
		let r = t[e], i = Fm[r.data.type].size, a = Fm[r.data.type].align;
		if (!Fm[r.data.type]) throw Error(`[Pixi.js] WebGPU UniformBuffer: Unknown type ${r.data.type}`);
		r.data.size > 1 && (i = Math.max(i, a) * r.data.size), n = Math.ceil(n / a) * a, r.size = i, r.offset = n, n += i;
	}
	return n = Math.ceil(n / 16) * 16, {
		uboElements: t,
		size: n
	};
}
var Fm, Im = o((() => {
	Fm = {
		i32: {
			align: 4,
			size: 4
		},
		u32: {
			align: 4,
			size: 4
		},
		f32: {
			align: 4,
			size: 4
		},
		f16: {
			align: 2,
			size: 2
		},
		"vec2<i32>": {
			align: 8,
			size: 8
		},
		"vec2<u32>": {
			align: 8,
			size: 8
		},
		"vec2<f32>": {
			align: 8,
			size: 8
		},
		"vec2<f16>": {
			align: 4,
			size: 4
		},
		"vec3<i32>": {
			align: 16,
			size: 12
		},
		"vec3<u32>": {
			align: 16,
			size: 12
		},
		"vec3<f32>": {
			align: 16,
			size: 12
		},
		"vec3<f16>": {
			align: 8,
			size: 6
		},
		"vec4<i32>": {
			align: 16,
			size: 16
		},
		"vec4<u32>": {
			align: 16,
			size: 16
		},
		"vec4<f32>": {
			align: 16,
			size: 16
		},
		"vec4<f16>": {
			align: 8,
			size: 8
		},
		"mat2x2<f32>": {
			align: 8,
			size: 16
		},
		"mat2x2<f16>": {
			align: 4,
			size: 8
		},
		"mat3x2<f32>": {
			align: 8,
			size: 24
		},
		"mat3x2<f16>": {
			align: 4,
			size: 12
		},
		"mat4x2<f32>": {
			align: 8,
			size: 32
		},
		"mat4x2<f16>": {
			align: 4,
			size: 16
		},
		"mat2x3<f32>": {
			align: 16,
			size: 32
		},
		"mat2x3<f16>": {
			align: 8,
			size: 16
		},
		"mat3x3<f32>": {
			align: 16,
			size: 48
		},
		"mat3x3<f16>": {
			align: 8,
			size: 24
		},
		"mat4x3<f32>": {
			align: 16,
			size: 64
		},
		"mat4x3<f16>": {
			align: 8,
			size: 32
		},
		"mat2x4<f32>": {
			align: 16,
			size: 32
		},
		"mat2x4<f16>": {
			align: 8,
			size: 16
		},
		"mat3x4<f32>": {
			align: 16,
			size: 48
		},
		"mat3x4<f16>": {
			align: 8,
			size: 24
		},
		"mat4x4<f32>": {
			align: 16,
			size: 64
		},
		"mat4x4<f16>": {
			align: 8,
			size: 32
		}
	};
})), Lm, Rm = o((() => {
	Lm = [
		{
			type: "mat3x3<f32>",
			test: (e) => e.value.a !== void 0,
			ubo: "\n            var matrix = uv[name].toArray(true);\n            data[offset] = matrix[0];\n            data[offset + 1] = matrix[1];\n            data[offset + 2] = matrix[2];\n            data[offset + 4] = matrix[3];\n            data[offset + 5] = matrix[4];\n            data[offset + 6] = matrix[5];\n            data[offset + 8] = matrix[6];\n            data[offset + 9] = matrix[7];\n            data[offset + 10] = matrix[8];\n        ",
			uniform: "\n            gl.uniformMatrix3fv(ud[name].location, false, uv[name].toArray(true));\n        "
		},
		{
			type: "vec4<f32>",
			test: (e) => e.type === "vec4<f32>" && e.size === 1 && e.value.width !== void 0,
			ubo: "\n            v = uv[name];\n            data[offset] = v.x;\n            data[offset + 1] = v.y;\n            data[offset + 2] = v.width;\n            data[offset + 3] = v.height;\n        ",
			uniform: "\n            cv = ud[name].value;\n            v = uv[name];\n            if (cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height) {\n                cv[0] = v.x;\n                cv[1] = v.y;\n                cv[2] = v.width;\n                cv[3] = v.height;\n                gl.uniform4f(ud[name].location, v.x, v.y, v.width, v.height);\n            }\n        "
		},
		{
			type: "vec2<f32>",
			test: (e) => e.type === "vec2<f32>" && e.size === 1 && e.value.x !== void 0,
			ubo: "\n            v = uv[name];\n            data[offset] = v.x;\n            data[offset + 1] = v.y;\n        ",
			uniform: "\n            cv = ud[name].value;\n            v = uv[name];\n            if (cv[0] !== v.x || cv[1] !== v.y) {\n                cv[0] = v.x;\n                cv[1] = v.y;\n                gl.uniform2f(ud[name].location, v.x, v.y);\n            }\n        "
		},
		{
			type: "vec4<f32>",
			test: (e) => e.type === "vec4<f32>" && e.size === 1 && e.value.red !== void 0,
			ubo: "\n            v = uv[name];\n            data[offset] = v.red;\n            data[offset + 1] = v.green;\n            data[offset + 2] = v.blue;\n            data[offset + 3] = v.alpha;\n        ",
			uniform: "\n            cv = ud[name].value;\n            v = uv[name];\n            if (cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue || cv[3] !== v.alpha) {\n                cv[0] = v.red;\n                cv[1] = v.green;\n                cv[2] = v.blue;\n                cv[3] = v.alpha;\n                gl.uniform4f(ud[name].location, v.red, v.green, v.blue, v.alpha);\n            }\n        "
		},
		{
			type: "vec3<f32>",
			test: (e) => e.type === "vec3<f32>" && e.size === 1 && e.value.red !== void 0,
			ubo: "\n            v = uv[name];\n            data[offset] = v.red;\n            data[offset + 1] = v.green;\n            data[offset + 2] = v.blue;\n        ",
			uniform: "\n            cv = ud[name].value;\n            v = uv[name];\n            if (cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue) {\n                cv[0] = v.red;\n                cv[1] = v.green;\n                cv[2] = v.blue;\n                gl.uniform3f(ud[name].location, v.red, v.green, v.blue);\n            }\n        "
		}
	];
}));
// node_modules/pixi.js/lib/rendering/renderers/shared/shader/utils/compileBufferSync.mjs
function zm(e, t, n) {
	let r = ["\n        var v = null;\n        var v2 = null;\n        var t = 0;\n        var index = 0;\n        var name = null;\n        var arrayOffset = null;\n    "], i = 0;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = o.data.name, c = !1, l = 0;
		for (let e = 0; e < Lm.length; e++) if (Lm[e].test(o.data)) {
			l = o.offset / 4, r.push(`name = "${s}";`, `offset += ${l - i};`, Lm[e].ubo), c = !0;
			break;
		}
		if (!c) {
			if (o.data.size > 1) l = o.offset / 4, r.push(n(o, l - i));
			else {
				let e = t[o.data.type];
				l = o.offset / 4, r.push(`
                    v = uv.${s};
                    offset += ${l - i};
                    ${e};
                `);
			}
		}
		i = l;
	}
	let a = r.join("\n");
	return Function("uv", "data", "dataInt32", "offset", a);
}
var Bm = o((() => {
	Rm();
}));
// node_modules/pixi.js/lib/rendering/renderers/shared/shader/utils/uboSyncFunctions.mjs
function Vm(e, t) {
	return `
        for (let i = 0; i < ${e * t}; i++) {
            data[offset + (((i / ${e})|0) * 4) + (i % ${e})] = v[i];
        }
    `;
}
var Hm, Um, Wm = o((() => {
	Hm = {
		f32: "\n        data[offset] = v;",
		i32: "\n        dataInt32[offset] = v;",
		u32: "\n        dataInt32[offset] = v;",
		"vec2<f32>": "\n        data[offset] = v[0];\n        data[offset + 1] = v[1];",
		"vec3<f32>": "\n        data[offset] = v[0];\n        data[offset + 1] = v[1];\n        data[offset + 2] = v[2];",
		"vec4<f32>": "\n        data[offset] = v[0];\n        data[offset + 1] = v[1];\n        data[offset + 2] = v[2];\n        data[offset + 3] = v[3];",
		"vec2<i32>": "\n        dataInt32[offset] = v[0];\n        dataInt32[offset + 1] = v[1];",
		"vec3<i32>": "\n        dataInt32[offset] = v[0];\n        dataInt32[offset + 1] = v[1];\n        dataInt32[offset + 2] = v[2];",
		"vec4<i32>": "\n        dataInt32[offset] = v[0];\n        dataInt32[offset + 1] = v[1];\n        dataInt32[offset + 2] = v[2];\n        dataInt32[offset + 3] = v[3];",
		"vec2<u32>": "\n        dataInt32[offset] = v[0];\n        dataInt32[offset + 1] = v[1];",
		"vec3<u32>": "\n        dataInt32[offset] = v[0];\n        dataInt32[offset + 1] = v[1];\n        dataInt32[offset + 2] = v[2];",
		"vec4<u32>": "\n        dataInt32[offset] = v[0];\n        dataInt32[offset + 1] = v[1];\n        dataInt32[offset + 2] = v[2];\n        dataInt32[offset + 3] = v[3];",
		"mat2x2<f32>": "\n        data[offset] = v[0];\n        data[offset + 1] = v[1];\n        data[offset + 4] = v[2];\n        data[offset + 5] = v[3];",
		"mat3x3<f32>": "\n        data[offset] = v[0];\n        data[offset + 1] = v[1];\n        data[offset + 2] = v[2];\n        data[offset + 4] = v[3];\n        data[offset + 5] = v[4];\n        data[offset + 6] = v[5];\n        data[offset + 8] = v[6];\n        data[offset + 9] = v[7];\n        data[offset + 10] = v[8];",
		"mat4x4<f32>": "\n        for (let i = 0; i < 16; i++) {\n            data[offset + i] = v[i];\n        }",
		"mat3x2<f32>": Vm(3, 2),
		"mat4x2<f32>": Vm(4, 2),
		"mat2x3<f32>": Vm(2, 3),
		"mat4x3<f32>": Vm(4, 3),
		"mat2x4<f32>": Vm(2, 4),
		"mat3x4<f32>": Vm(3, 4)
	}, Um = {
		...Hm,
		"mat2x2<f32>": "\n        data[offset] = v[0];\n        data[offset + 1] = v[1];\n        data[offset + 2] = v[2];\n        data[offset + 3] = v[3];\n    "
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/gpu/shader/utils/generateArraySyncWGSL.mjs
function Gm(e, t) {
	let { size: n, align: r } = Fm[e.data.type], i = (Math.max(n, r) - n) / 4, a = e.data.type.indexOf("i32") >= 0 ? "dataInt32" : "data";
	return `
         v = uv.${e.data.name};
         ${t === 0 ? "" : `offset += ${t};`}

         arrayOffset = offset;

         t = 0;

         for(var i=0; i < ${e.data.size}; i++)
         {
             for(var j = 0; j < ${n / 4}; j++)
             {
                 ${a}[arrayOffset++] = v[t++];
             }
             ${i === 0 ? "" : `arrayOffset += ${i};`}
         }
     `;
}
var Km = o((() => {
	Im();
}));
// node_modules/pixi.js/lib/rendering/renderers/gpu/shader/utils/createUboSyncFunctionWGSL.mjs
function qm(e) {
	return zm(e, Um, Gm);
}
var Jm = o((() => {
	Bm(), Wm(), Km();
})), Ym, Xm = o((() => {
	h(), Nm(), Im(), Jm(), Ym = class extends Mm {
		constructor() {
			super({
				createUboElements: Pm,
				generateUboSync: qm
			});
		}
	}, Ym.extension = {
		type: [d.WebGPUSystem],
		name: "ubo"
	};
})), Zm, Qm = o((() => {
	y(), We(), Zm = class extends v {
		constructor({ buffer: e, offset: t, size: n, watch: r = !0 }) {
			super(), this.uid = N("buffer"), this._resourceType = "bufferResource", this._resourceId = N("resource"), this._bufferResource = !0, this.destroyed = !1, this.buffer = e, this.offset = t | 0, this.size = n, this.watch = r, r && this.buffer.on("change", this.onBufferChange, this);
		}
		get _gcLastUsed() {
			return this.buffer?._gcLastUsed ?? -1;
		}
		set _gcLastUsed(e) {
			this.buffer && (this.buffer._gcLastUsed = e);
		}
		onBufferChange() {
			this._resourceId = N("resource"), this.emit("change", this);
		}
		destroy(e = !1) {
			this.destroyed = !0, e && this.buffer.destroy(), this.emit("change", this), this.watch && this.buffer.off("change", this.onBufferChange, this), this.buffer = null, this.removeAllListeners();
		}
	};
})), $m, eh = o((() => {
	$m = class {
		constructor({ minUniformOffsetAlignment: e }) {
			this._minUniformOffsetAlignment = 256, this.byteIndex = 0, this._minUniformOffsetAlignment = e, this.data = /* @__PURE__ */ new Float32Array(65535);
		}
		clear() {
			this.byteIndex = 0;
		}
		addEmptyGroup(e) {
			if (e > this._minUniformOffsetAlignment / 4) throw Error(`UniformBufferBatch: array is too large: ${e * 4}`);
			let t = this.byteIndex, n = t + e * 4;
			if (n = Math.ceil(n / this._minUniformOffsetAlignment) * this._minUniformOffsetAlignment, n > this.data.length * 4) throw Error("UniformBufferBatch: ubo batch got too big");
			return this.byteIndex = n, t;
		}
		addGroup(e) {
			let t = this.addEmptyGroup(e.length);
			for (let n = 0; n < e.length; n++) this.data[t / 4 + n] = e[n];
			return t;
		}
		destroy() {
			this.data = null;
		}
	};
})), th, nh, rh = o((() => {
	h(), kc(), Qm(), Dc(), eh(), Us(), th = 128, nh = class {
		constructor(e) {
			this._bindGroupHash = /* @__PURE__ */ Object.create(null), this._buffers = [], this._bindGroups = [], this._bufferResources = [], this._renderer = e, this._batchBuffer = new $m({ minUniformOffsetAlignment: th });
			let t = 256 / th;
			for (let e = 0; e < t; e++) this._buffers.push(new Oc({
				data: this._batchBuffer.data,
				usage: Ec.UNIFORM | Ec.COPY_DST
			}));
		}
		renderEnd() {
			this._uploadBindGroups(), this._resetBindGroups();
		}
		_resetBindGroups() {
			this._bindGroupHash = /* @__PURE__ */ Object.create(null), this._batchBuffer.clear();
		}
		getUniformBindGroup(e, t) {
			if (!t && this._bindGroupHash[e.uid]) return this._bindGroupHash[e.uid];
			this._renderer.ubo.ensureUniformGroup(e);
			let n = e.buffer.data, r = this._batchBuffer.addEmptyGroup(n.length);
			return this._renderer.ubo.syncUniformGroup(e, this._batchBuffer.data, r / 4), this._bindGroupHash[e.uid] = this._getBindGroup(r / th), this._bindGroupHash[e.uid];
		}
		getUboResource(e) {
			this._renderer.ubo.updateUniformGroup(e);
			let t = e.buffer.data, n = this._batchBuffer.addGroup(t);
			return this._getBufferResource(n / th);
		}
		getArrayBindGroup(e) {
			let t = this._batchBuffer.addGroup(e);
			return this._getBindGroup(t / th);
		}
		getArrayBufferResource(e) {
			let t = this._batchBuffer.addGroup(e) / th;
			return this._getBufferResource(t);
		}
		_getBufferResource(e) {
			if (!this._bufferResources[e]) {
				let t = this._buffers[e % 2];
				this._bufferResources[e] = new Zm({
					buffer: t,
					offset: (e / 2 | 0) * 256,
					size: th
				});
			}
			return this._bufferResources[e];
		}
		_getBindGroup(e) {
			if (!this._bindGroups[e]) {
				let t = new Hs({ 0: this._getBufferResource(e) });
				this._bindGroups[e] = t;
			}
			return this._bindGroups[e];
		}
		_uploadBindGroups() {
			let e = this._renderer.buffer, t = this._buffers[0];
			t.update(this._batchBuffer.byteIndex), e.updateBuffer(t);
			let n = this._batchBuffer.data, r = this._batchBuffer.byteIndex - th;
			if (!(r <= 0)) for (let t = 1; t < this._buffers.length; t++) this._renderer.gpu.device.queue.writeBuffer(e.getGPUBuffer(this._buffers[t]), 0, n.buffer, n.byteOffset + th, r);
		}
		destroy() {
			for (let e = 0; e < this._bindGroups.length; e++) this._bindGroups[e]?.destroy();
			this._bindGroups = null, this._bindGroupHash = null;
			for (let e = 0; e < this._buffers.length; e++) this._buffers[e].destroy();
			this._buffers = null;
			for (let e = 0; e < this._bufferResources.length; e++) this._bufferResources[e].destroy();
			this._bufferResources = null, this._batchBuffer.destroy(), this._renderer = null;
		}
	}, nh.extension = {
		type: [d.WebGPUPipes],
		name: "uniformBatch"
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/gl/shader/program/ensureAttributes.mjs
function ih(e, t) {
	for (let n in e.attributes) {
		let r = e.attributes[n], i = t[n];
		i ? (r.format ??= i.format, r.offset ??= i.offset, r.instance ??= i.instance) : r.format || I(`Attribute ${n} is not present in the shader, but is present in the geometry. Unable to infer attribute details.`);
	}
	ah(e);
}
function ah(e) {
	let { buffers: t, attributes: n } = e, r = {}, i = {};
	for (let e in t) {
		let n = t[e];
		r[n.uid] = 0, i[n.uid] = 0;
	}
	for (let e in n) {
		let t = n[e];
		r[t.buffer.uid] += ms(t.format).stride;
	}
	for (let e in n) {
		let t = n[e];
		t.stride ??= r[t.buffer.uid], t.start ??= i[t.buffer.uid], i[t.buffer.uid] += ms(t.format).stride;
	}
}
var oh = o((() => {
	L(), gs();
})), sh, ch = o((() => {
	cf(), sh = [], sh[sf.NONE] = void 0, sh[sf.DISABLED] = {
		stencilWriteMask: 0,
		stencilReadMask: 0
	}, sh[sf.RENDERING_MASK_ADD] = {
		stencilFront: {
			compare: "equal",
			passOp: "increment-clamp"
		},
		stencilBack: {
			compare: "equal",
			passOp: "increment-clamp"
		}
	}, sh[sf.RENDERING_MASK_REMOVE] = {
		stencilFront: {
			compare: "equal",
			passOp: "decrement-clamp"
		},
		stencilBack: {
			compare: "equal",
			passOp: "decrement-clamp"
		}
	}, sh[sf.MASK_ACTIVE] = {
		stencilWriteMask: 0,
		stencilFront: {
			compare: "equal",
			passOp: "keep"
		},
		stencilBack: {
			compare: "equal",
			passOp: "keep"
		}
	}, sh[sf.INVERSE_MASK_ACTIVE] = {
		stencilWriteMask: 0,
		stencilFront: {
			compare: "not-equal",
			passOp: "keep"
		},
		stencilBack: {
			compare: "not-equal",
			passOp: "keep"
		}
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/gpu/pipeline/PipelineSystem.mjs
function lh(e, t) {
	for (let [n, r] of Object.entries(t)) {
		let t = RegExp(`override\\s+${n}\\s*:\\s*(\\w+)\\s*(?:=[^;]*)?;`);
		e = e.replace(t, (e, t) => {
			let i;
			return i = t === "u32" ? `${Math.trunc(r)}u` : t === "i32" ? `${Math.trunc(r)}` : Number.isInteger(r) ? `${r}.0` : `${r}`, `const ${n}: ${t} = ${i};`;
		});
	}
	return e;
}
function uh(e, t, n, r, i, a) {
	return e * 35184372088832 + t * 536870912 + a * 16384 + (n << 8) + (r << 3) + i;
}
function dh(e) {
	let t = vh[e];
	return t === void 0 && (t = vh[e] = yh++), t;
}
function fh(e, t, n, r, i, a, o) {
	return i << 13 | o << 12 | r << 9 | n << 5 | e << 2 | a << 1 | t;
}
function ph(e, t, n, r, i, a) {
	return a << 7 | i << 6 | r << 5 | n << 4 | t << 1 | e;
}
var mh, hh, gh, _h, vh, yh, bh, xh = o((() => {
	h(), L(), oh(), qs(), cf(), Fo(), ch(), mh = {
		"point-list": 0,
		"line-list": 1,
		"line-strip": 2,
		"triangle-list": 3,
		"triangle-strip": 4
	}, hh = new Ks({}), gh = {
		"depth24plus-stencil8": {
			depth: !0,
			stencil: !0,
			index: 1
		},
		depth24plus: {
			depth: !0,
			stencil: !1,
			index: 2
		},
		depth32float: {
			depth: !0,
			stencil: !1,
			index: 3
		},
		"depth32float-stencil8": {
			depth: !0,
			stencil: !0,
			index: 4
		},
		depth16unorm: {
			depth: !0,
			stencil: !1,
			index: 5
		},
		stencil8: {
			depth: !1,
			stencil: !0,
			index: 6
		}
	}, _h = {
		depth: !1,
		stencil: !1,
		index: 0
	}, vh = /* @__PURE__ */ Object.create(null), yh = 0, bh = class {
		constructor(e) {
			this._moduleCache = /* @__PURE__ */ Object.create(null), this._bufferLayoutsCache = /* @__PURE__ */ Object.create(null), this._bindingNamesCache = /* @__PURE__ */ Object.create(null), this._pipeCache = /* @__PURE__ */ new Map(), this._pipeStateCaches = /* @__PURE__ */ Object.create(null), this._colorMask = 15, this._multisampleCount = 1, this._colorFormats = ["bgra8unorm"], this._colorFormatId = dh("bgra8unorm"), this._depthStencilFormat = "depth24plus-stencil8", this._depthStencilFormatData = _h, this._depthReadOnly = !1, this._stencilReadOnly = !1, this._invertFrontFace = !1, this._renderer = e;
		}
		contextChange(e) {
			this._gpu = e, this._moduleCache = /* @__PURE__ */ Object.create(null), this._pipeStateCaches = /* @__PURE__ */ Object.create(null), this.setStencilMode(sf.DISABLED), this._updatePipeHash();
		}
		setMultisampleCount(e) {
			this._multisampleCount !== e && (this._multisampleCount = e, this._updatePipeHash());
		}
		setRenderTarget(e) {
			let t = e.colorAttachments[0]?.texture;
			this._multisampleCount = t?.source.antialias ? 4 : 1, this._setColorFormats(e), this._depthStencilFormat = e.depthStencilAttachment?.texture.format, this._depthStencilFormatData = gh[this._depthStencilFormat] || _h, this._depthReadOnly = e.depthStencilAttachment?.depthReadOnly ?? !1, this._stencilReadOnly = e.depthStencilAttachment?.stencilReadOnly ?? this._depthReadOnly, this._invertFrontFace = this._renderer.renderTarget.isFrontFaceInverted(e, e.flipY), this._updatePipeHash();
		}
		setColorMask(e) {
			this._colorMask !== e && (this._colorMask = e, this._updatePipeHash());
		}
		setStencilMode(e) {
			this._stencilMode !== e && (this._stencilMode = e, this._stencilState = sh[e], this._updatePipeHash());
		}
		get bundleStateKey() {
			let e = this._depthStencilFormatData;
			return ph(this._multisampleCount === 1 ? 0 : 1, e.index, e.depth && this._depthReadOnly ? 1 : 0, e.stencil && this._stencilReadOnly ? 1 : 0, +!!this._invertFrontFace, this._colorFormatId);
		}
		getBundleDescriptor() {
			let e = {
				colorFormats: this._colorFormats.slice(),
				sampleCount: this._multisampleCount
			}, t = this._depthStencilFormatData;
			return (t.depth || t.stencil) && (e.depthStencilFormat = this._depthStencilFormat, t.depth && this._depthReadOnly && (e.depthReadOnly = !0), t.stencil && this._stencilReadOnly && (e.stencilReadOnly = !0)), e;
		}
		setPipeline(e, t, n, r) {
			let i = this.getPipeline(e, t, n);
			r.setPipeline(i);
		}
		getPipelineKey(e, t, n, r, i) {
			return e._layoutKey || (ih(e, t.attributeData), this._generateBufferKey(e)), uh(e._layoutKey, t._layoutKey, n.data, n._blendModeId, mh[r], i.id);
		}
		getPipeline(e, t, n, r, i) {
			e._layoutKey || (ih(e, t.attributeData), this._generateBufferKey(e)), r ||= e.topology, i ||= hh;
			let a = uh(e._layoutKey, t._layoutKey, n.data, n._blendModeId, mh[r], i.id), o = this._pipeCache.get(a);
			return o || (o = this._createPipeline(e, t, n, r, i), this._pipeCache.set(a, o)), o;
		}
		_createPipeline(e, t, n, r, i) {
			let a = this._gpu.device, o = this._createVertexBufferLayouts(e, t), s = this._renderer.state.getColorTargets(n, this._colorFormats), c = this._stencilMode === sf.RENDERING_MASK_ADD ? 0 : this._colorMask;
			this._applyFragmentOutputs(s, t, c);
			let l = this._renderer.shader.getProgramData(t).pipeline, u = Object.keys(i.data).length > 0, d = t.vertex.source, f = t.fragment.source, p;
			u && (this._renderer.limits.supportsOverrideConstants ? p = i.data : (d = lh(d, i.data), f = lh(f, i.data)));
			let m = {
				vertex: {
					module: this._getModule(d),
					entryPoint: t.vertex.entryPoint,
					constants: p,
					buffers: o
				},
				fragment: {
					module: this._getModule(f),
					entryPoint: t.fragment.entryPoint,
					targets: s,
					constants: p
				},
				primitive: {
					topology: r,
					cullMode: n.culling ? "back" : "none",
					frontFace: n.clockwiseFrontFace === this._invertFrontFace ? "ccw" : "cw"
				},
				layout: l,
				multisample: { count: this._multisampleCount },
				label: t.name ? `PIXI Pipeline (${t.name})` : "PIXI Pipeline"
			};
			if (this._depthStencilFormatData.depth || this._depthStencilFormatData.stencil) {
				let e = this._depthStencilFormatData;
				m.depthStencil = {
					...this._stencilState,
					format: this._depthStencilFormat,
					depthWriteEnabled: e.depth ? n.depthMask && !this._depthReadOnly : !1,
					depthCompare: e.depth && n.depthTest ? "less" : "always"
				};
			}
			return a.createRenderPipeline(m);
		}
		_getModule(e) {
			return this._moduleCache[e] || this._createModule(e);
		}
		_createModule(e) {
			let t = this._gpu.device;
			return this._moduleCache[e] = t.createShaderModule({ code: e }), this._moduleCache[e];
		}
		_generateBufferKey(e) {
			let t = [], n = 0, r = Object.keys(e.attributes).sort();
			for (let i = 0; i < r.length; i++) {
				let a = e.attributes[r[i]];
				t[n++] = a.offset, t[n++] = a.format, t[n++] = a.stride, t[n++] = a.instance;
			}
			return e._layoutKey = Mo(t.join("|"), "geometry"), e._layoutKey;
		}
		_generateAttributeLocationsKey(e) {
			let t = [], n = 0, r = Object.keys(e.attributeData).sort();
			for (let i = 0; i < r.length; i++) {
				let a = e.attributeData[r[i]];
				t[n++] = a.location;
			}
			return e._attributeLocationsKey = Mo(t.join("|"), "programAttributes"), e._attributeLocationsKey;
		}
		getBufferNamesToBind(e, t) {
			e._layoutKey || (ih(e, t.attributeData), this._generateBufferKey(e)), t._attributeLocationsKey || this._generateAttributeLocationsKey(t);
			let n = e._layoutKey << 16 | t._attributeLocationsKey;
			if (this._bindingNamesCache[n]) return this._bindingNamesCache[n];
			let r = this._createVertexBufferLayouts(e, t), i = [], a = t.attributeData;
			for (let e = 0; e < r.length; e++) {
				let t = Object.values(r[e].attributes)[0].shaderLocation;
				for (let n in a) if (a[n].location === t) {
					i[e] = n;
					break;
				}
			}
			return this._bindingNamesCache[n] = i, i;
		}
		_createVertexBufferLayouts(e, t) {
			t._attributeLocationsKey || this._generateAttributeLocationsKey(t);
			let n = e._layoutKey << 16 | t._attributeLocationsKey;
			if (this._bufferLayoutsCache[n]) return this._bufferLayoutsCache[n];
			let r = [];
			return e.buffers.forEach((n) => {
				let i = {
					arrayStride: 0,
					stepMode: "vertex",
					attributes: []
				}, a = i.attributes;
				for (let r in t.attributeData) {
					let o = e.attributes[r];
					(o.divisor ?? 1) !== 1 && I(`Attribute ${r} has an invalid divisor value of '${o.divisor}'. WebGPU only supports a divisor value of 1`), o.buffer === n && (i.arrayStride = o.stride, i.stepMode = o.instance ? "instance" : "vertex", a.push({
						shaderLocation: t.attributeData[r].location,
						offset: o.offset,
						format: o.format
					}));
				}
				a.length && r.push(i);
			}), this._bufferLayoutsCache[n] = r, r;
		}
		_setColorFormats(e) {
			let t = e.colorAttachments, n = this._colorFormats;
			n.length = t.length;
			for (let e = 0; e < t.length; e++) n[e] = t[e].texture.format;
			this._colorFormatId = dh(n.join("|"));
		}
		_applyFragmentOutputs(e, t, n) {
			let r = t.fragmentOutputMask ?? -1;
			for (let t = 0; t < e.length; t++) {
				let i = !!(r & 1 << t);
				e[t].writeMask = i ? n : 0, i || (e[t].blend = void 0);
			}
		}
		_updatePipeHash() {
			var e;
			let t = fh(this._stencilMode, this._multisampleCount === 1 ? 0 : 1, this._colorMask, this._depthStencilFormatData.index, this._colorFormatId, +!!this._depthReadOnly, +!!this._invertFrontFace);
			this._pipeCache = (e = this._pipeStateCaches)[t] ?? (e[t] = /* @__PURE__ */ new Map());
		}
		destroy() {
			this._bufferLayoutsCache = null, this._pipeCache = null, this._gpu = null, this._renderer = null, this._bindingNamesCache = null, this._pipeStateCaches = null, this._moduleCache = null;
		}
	}, bh.extension = {
		type: [d.WebGPUSystem],
		name: "pipeline"
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/gpu/renderTarget/calculateProjection.mjs
function Sh(e, t, n, r, i, a) {
	let o = a ? 1 : -1;
	return e.identity(), e.a = 1 / r * 2, e.d = o * (1 / i * 2), e.tx = -1 - t * e.a, e.ty = -o - n * e.d, e;
}
var Ch = o((() => {}));
// node_modules/pixi.js/lib/rendering/renderers/shared/renderTarget/isRenderingToScreen.mjs
function wh(e) {
	if (e.colorAttachments.length === 0) return !1;
	let t = e.colorTexture.resource;
	return globalThis.HTMLCanvasElement && t instanceof HTMLCanvasElement && document.body.contains(t);
}
var Th = o((() => {})), Eh, Dh = o((() => {
	M(), wt(), Xe(), L(), eu(), Ch(), Gs(), nu(), Aa(), wn(), V(), em(), Ln(), Th(), Zp(), Eh = class {
		constructor(e) {
			this.rootViewPort = new R(), this.viewport = new R(), this.onRenderTargetChange = new tu("onRenderTargetChange"), this.projectionMatrix = new j(), this.defaultClearColor = [
				0,
				0,
				0,
				0
			], this._renderSurfaceToRenderTargetHash = /* @__PURE__ */ new Map(), this._gpuRenderTargetHash = /* @__PURE__ */ Object.create(null), this._renderTargetStack = [], this._bindState = {
				target: null,
				frame: void 0,
				mipLevel: 0,
				layer: 0,
				flipY: !1
			}, this._bindFrame = new R(), this._renderer = e, e.gc.addCollection(this, "_gpuRenderTargetHash", "hash");
		}
		get renderSurface() {
			return this._bindState.target;
		}
		get mipLevel() {
			return this._bindState.mipLevel;
		}
		get layer() {
			return this._bindState.layer;
		}
		finishRenderPass() {
			this.adaptor.finishRenderPass(this.renderTarget);
		}
		renderStart(e) {
			this._renderTargetStack.length = 0, this.push(e), this.rootViewPort.copyFrom(this.viewport), this.rootRenderTarget = this.renderTarget, this.renderingToScreen = wh(this.rootRenderTarget), this.adaptor.prerender?.(this.rootRenderTarget);
		}
		postrender() {
			this.adaptor.postrender?.(this.rootRenderTarget);
		}
		bind(e, t = !0, n, r, i = 0, a = 0, o) {
			let s;
			"target" in e ? s = e : (F("8.20.0", "RenderTargetSystem.bind: positional arguments are deprecated, please use an options object instead: bind({ target, clear, clearColor, frame, mipLevel, layer, flipY })"), s = {
				target: e,
				clear: t,
				clearColor: n,
				frame: r,
				mipLevel: i,
				layer: a,
				flipY: o
			});
			let c = s.target;
			t = s.clear ?? !0, n = s.clearColor, i = (s.mipLevel ?? 0) | 0, a = (s.layer ?? 0) | 0, o = s.flipY, r = s.frame;
			let l = this.getRenderTarget(c), u = this.renderTarget !== l || !!l.flipY != !!o;
			this.renderTarget = l;
			let d = this.getGpuRenderTarget(l);
			(l.pixelWidth !== d.width || l.pixelHeight !== d.height) && (this.adaptor.resizeGpuRenderTarget(l), d.width = l.pixelWidth, d.height = l.pixelHeight);
			let f = l.colorAttachments[0]?.texture || l.depthStencilAttachment?.texture, p = this.viewport, m = f.dimension === "3d" ? Math.max(f.depth >> i, 1) : f.depthOrArrayLayers;
			if (a < 0 || a >= m) throw Error(`[RenderTargetSystem] layer ${a} is out of bounds (layer count=${m}).`);
			let h = this._bindState;
			h.target = c, h.frame = r ? this._bindFrame.copyFrom(r) : void 0, h.mipLevel = i, h.layer = a, h.flipY = o;
			let g = Math.max(f.pixelWidth >> i, 1), _ = Math.max(f.pixelHeight >> i, 1);
			if (!r && c instanceof B && (r = c.frame), r) {
				let e = f._resolution, t = 1 << Math.max(i, 0), n = r.x * e + .5 | 0, a = r.y * e + .5 | 0, o = r.width * e + .5 | 0, s = r.height * e + .5 | 0, c = Math.floor(n / t), l = Math.floor(a / t), u = Math.ceil(o / t), d = Math.ceil(s / t);
				c < 0 && (u += c, c = 0), l < 0 && (d += l, l = 0), c = Math.min(c, g - 1), l = Math.min(l, _ - 1), u = Math.min(u, g - c), d = Math.min(d, _ - l), u = Math.max(u, 1), d = Math.max(d, 1), p.x = c, p.y = l, p.width = u, p.height = d;
			} else p.x = 0, p.y = 0, p.width = g, p.height = _;
			return l.flipY = o, Sh(this.projectionMatrix, 0, 0, p.width / f.resolution, p.height / f.resolution, !l.isRoot != !!l.flipY), this.adaptor.startRenderPass(l, t, n, p, i, a), u && this.onRenderTargetChange.emit(l), l;
		}
		getBindState(e) {
			if (!this.renderTarget) throw Error("[RenderTargetSystem] getBindState is only valid while a render surface is bound");
			let t = this._bindState;
			return e ??= {}, e.target = t.target, e.clear = $l.NONE, e.clearColor = void 0, t.frame ? e.frame ? e.frame.copyFrom(t.frame) : e.frame = t.frame.clone() : e.frame = void 0, e.mipLevel = t.mipLevel, e.layer = t.layer, e.flipY = !!t.flipY, e;
		}
		isFrontFaceInverted(e, t) {
			if (!e) {
				if (e = this.renderTarget, !e) return !1;
				t = e.flipY;
			}
			return !!t != (this._renderer.type === Ws.WEBGL && !e.isRoot);
		}
		get frontFaceInverted() {
			return F(qe, "RenderTargetSystem.frontFaceInverted is deprecated, use isFrontFaceInverted() instead"), this.isFrontFaceInverted();
		}
		clear(e, t = $l.ALL, n, r = this.mipLevel, i = this.layer) {
			t && (e &&= this.getRenderTarget(e), this.adaptor.clear(e || this.renderTarget, t, n, this.viewport, r, i));
		}
		contextChange() {
			this._gpuRenderTargetHash = /* @__PURE__ */ Object.create(null);
		}
		push(e, t = $l.ALL, n, r, i = 0, a = 0, o) {
			let s;
			"target" in e ? s = e : (F("8.20.0", "RenderTargetSystem.push: positional arguments are deprecated, please use an options object instead: push({ target, clear, clearColor, frame, mipLevel, layer, flipY })"), s = {
				target: e,
				clear: t,
				clearColor: n,
				frame: r,
				mipLevel: i,
				layer: a,
				flipY: o
			});
			let c = this.bind(s);
			return this._renderTargetStack.push({
				target: s.target,
				clear: !1,
				clearColor: void 0,
				frame: s.frame ? s.frame.clone() : void 0,
				mipLevel: s.mipLevel,
				layer: s.layer,
				flipY: s.flipY
			}), c;
		}
		pop() {
			this._renderTargetStack.pop();
			let e = this._renderTargetStack[this._renderTargetStack.length - 1];
			if (!e) throw Error("[RenderTargetSystem] pop: no previous binding to restore (unbalanced pop)");
			return this.bind(e);
		}
		getRenderTarget(e) {
			return e.isTexture && (e = e.source), this._renderSurfaceToRenderTargetHash.get(e) ?? this._initRenderTarget(e);
		}
		copyToTexture(e, t, n, r, i) {
			let a = this.getRenderTarget(e);
			n.x < 0 && (r.width += n.x, i.x -= n.x, n.x = 0), n.y < 0 && (r.height += n.y, i.y -= n.y, n.y = 0);
			let { pixelWidth: o, pixelHeight: s } = a;
			return r.width = Math.min(r.width, o - n.x), r.height = Math.min(r.height, s - n.y), this.adaptor.copyToTexture(a, t, n, r, i);
		}
		copyDepthTexture(e, t, n, r, i = {
			x: 0,
			y: 0
		}) {
			let a = this.getRenderTarget(e);
			if (!a.depthStencilAttachment) {
				I("[RenderTargetSystem] copyDepthTexture: the source render target has no depth attachment to copy from");
				return;
			}
			let o = t.source;
			if (!o.format.includes("depth") && !o.format.includes("stencil")) {
				I(`[RenderTargetSystem] copyDepthTexture: the destination texture must have a depth/stencil format (got '${o.format}')`);
				return;
			}
			let s = n.x, c = n.y, l = i.x, u = i.y, d = r.width, f = r.height;
			s < 0 && (d += s, l -= s, s = 0), c < 0 && (f += c, u -= c, c = 0), d = Math.min(d, a.pixelWidth - s), f = Math.min(f, a.pixelHeight - c), d = Math.min(d, o.pixelWidth - l), f = Math.min(f, o.pixelHeight - u), d <= 0 || f <= 0 || this.adaptor.copyDepthTexture(a, t, {
				x: s,
				y: c
			}, {
				width: d,
				height: f
			}, {
				x: l,
				y: u
			});
		}
		ensureDepthStencil() {
			if (!this.renderTarget.stencil) {
				if (this.renderTarget.depthStencilTexture) {
					I(`[RenderTargetSystem] a stencil mask is being used, but the render target's depthStencilTexture format '${this.renderTarget.depthStencilTexture.format}' has no stencil aspect, so masking cannot work here. Use a 'depth24plus-stencil8' texture instead.`);
					return;
				}
				this.renderTarget._depth = !0, this.renderTarget._stencil = !0, this.adaptor.startRenderPass(this.renderTarget, !1, null, this.viewport, 0, this.layer);
			}
		}
		destroy() {
			this._renderer = null, this._renderSurfaceToRenderTargetHash.forEach((e, t) => {
				e === t ? e.off("destroy", this._onRenderTargetDestroy, this) : this._releaseRenderTarget(t, e);
			}), this._renderSurfaceToRenderTargetHash.clear();
			for (let e of Object.values(this._gpuRenderTargetHash)) e && this.adaptor.destroyGpuRenderTarget(e);
			this._gpuRenderTargetHash = /* @__PURE__ */ Object.create(null);
		}
		_initRenderTarget(e) {
			let t = null;
			if (ka.test(e) && (e = Qp(e).source), e instanceof Xp) t = e, e.once("destroy", this._onRenderTargetDestroy, this);
			else if (e instanceof Cn) {
				let n = e.format;
				t = n.includes("depth") || n.includes("stencil") ? new Xp({
					colorTextures: 0,
					depthStencilTexture: e
				}) : new Xp({ colorTextures: [e] }), e.source instanceof ka && (t.isRoot = !0), e.once("destroy", this._onRenderSurfaceDestroy, this);
			}
			return this._renderSurfaceToRenderTargetHash.set(e, t), t;
		}
		_onRenderSurfaceDestroy(e) {
			let t = this._renderSurfaceToRenderTargetHash.get(e);
			t && this._releaseRenderTarget(e, t);
		}
		_onRenderTargetDestroy(e) {
			this._renderSurfaceToRenderTargetHash.delete(e), this._releaseGpuRenderTarget(e);
		}
		_releaseRenderTarget(e, t) {
			t.destroy(), this._renderSurfaceToRenderTargetHash.delete(e), e.off("destroy", this._onRenderSurfaceDestroy, this), this._releaseGpuRenderTarget(t);
		}
		_releaseGpuRenderTarget(e) {
			let t = this._gpuRenderTargetHash[e.uid];
			t && (this._gpuRenderTargetHash[e.uid] = null, this.adaptor.destroyGpuRenderTarget(t));
		}
		getGpuRenderTarget(e) {
			return this._gpuRenderTargetHash[e.uid] || (this._gpuRenderTargetHash[e.uid] = this._initGpuRenderTarget(e));
		}
		_initGpuRenderTarget(e) {
			let t = e.colorAttachments;
			if (t.some((e) => e.texture.antialias)) {
				let e = t.findIndex((e) => In(e.texture.format));
				if (e !== -1) throw Error(`[RenderTargetSystem] color attachment ${e} is ${t[e].texture.format}, an integer format, and integer formats can't be antialiased. Create the render target's textures without antialias.`);
			}
			return this.adaptor.initGpuRenderTarget(e);
		}
		resetState() {
			this.renderTarget = null, this._bindState.target = null;
		}
	};
})), Oh, kh = o((() => {
	Oh = class {
		constructor(e, t) {
			let { tileBased: n, transientAttachment: r } = e.device.extensions;
			this.transient = n || t.transient;
			let i = GPUTextureUsage.RENDER_ATTACHMENT;
			this.transient && r && (i |= GPUTextureUsage.TRANSIENT_ATTACHMENT), this.texture = e.gpu.device.createTexture({
				label: t.label,
				size: {
					width: t.pixelWidth,
					height: t.pixelHeight,
					depthOrArrayLayers: t.depthOrArrayLayers
				},
				format: t.format,
				sampleCount: 4,
				mipLevelCount: 1,
				usage: i
			}), this.view = this.texture.createView();
		}
		destroy() {
			this.texture.destroy(), this.texture = null, this.view = null;
		}
	};
})), Ah, jh = o((() => {
	Ah = class {
		constructor(e) {
			this._variants = /* @__PURE__ */ Object.create(null), this._bindGroups = /* @__PURE__ */ new WeakMap(), this._depthStencilAttachment = {
				view: null,
				depthLoadOp: "load",
				depthStoreOp: "store"
			}, this._passDescriptor = {
				label: "depth-copy",
				colorAttachments: [],
				depthStencilAttachment: this._depthStencilAttachment
			}, this._renderer = e, this._device = e.gpu.device;
		}
		copy(e, t, n, r, i, a) {
			var o, s;
			let c = this._renderer.texture.getGpuSource(t), l = c.sampleCount, u = (o = this._variants)[l] ?? (o[l] = this._createVariant(l)), d = this._bindGroups.get(c);
			d || (d = this._device.createBindGroup({
				layout: u.layout,
				entries: [{
					binding: 0,
					resource: c.createView({ aspect: "depth-only" })
				}]
			}), this._bindGroups.set(c, d));
			let f = n.format, p = this._depthStencilAttachment, m = f.includes("stencil");
			p.view = this._renderer.texture.getTextureView(n), p.stencilLoadOp = m ? "load" : void 0, p.stencilStoreOp = m ? "store" : void 0;
			let h = e.beginRenderPass(this._passDescriptor);
			p.view = null;
			let g = (r.x - a.x + 32768 | r.y - a.y + 32768 << 16) >>> 0;
			h.setViewport(a.x, a.y, i.width, i.height, 0, 1), h.setPipeline((s = u.pipelines)[f] ?? (s[f] = this._createPipeline(f, u))), h.setBindGroup(0, d), h.draw(3, 1, 0, g), h.end();
		}
		_createVariant(e) {
			let t = e > 1, n = this._device.createBindGroupLayout({ entries: [{
				binding: 0,
				visibility: GPUShaderStage.FRAGMENT,
				texture: {
					sampleType: "depth",
					multisampled: t
				}
			}] }), r = this._device.createShaderModule({
				label: "depth-copy",
				code: `
                @group(0) @binding(0) var source: ${t ? "texture_depth_multisampled_2d" : "texture_depth_2d"};

                struct Varyings {
                    @builtin(position) position: vec4<f32>,
                    @location(0) @interpolate(flat) offset: vec2<i32>,
                };

                @vertex
                fn vertexMain(@builtin(vertex_index) i: u32, @builtin(instance_index) packed: u32) -> Varyings {
                    let pos = array<vec2<f32>, 3>(vec2<f32>(-1.0, -1.0), vec2<f32>(3.0, -1.0), vec2<f32>(-1.0, 3.0));
                    let offset = vec2<i32>(i32(packed & 0xffffu), i32(packed >> 16u)) - vec2<i32>(32768);

                    return Varyings(vec4<f32>(pos[i], 0.0, 1.0), offset);
                }

                @fragment
                fn fragmentMain(varyings: Varyings) -> @builtin(frag_depth) f32 {
                    return textureLoad(source, vec2<i32>(varyings.position.xy) + varyings.offset, 0);
                }
            `
			});
			return {
				layout: n,
				pipelineLayout: this._device.createPipelineLayout({ bindGroupLayouts: [n] }),
				module: r,
				pipelines: /* @__PURE__ */ Object.create(null)
			};
		}
		_createPipeline(e, t) {
			return this._device.createRenderPipeline({
				label: "depth-copy",
				layout: t.pipelineLayout,
				vertex: {
					module: t.module,
					entryPoint: "vertexMain"
				},
				fragment: {
					module: t.module,
					entryPoint: "fragmentMain",
					targets: []
				},
				depthStencil: {
					format: e,
					depthWriteEnabled: !0,
					depthCompare: "always"
				}
			});
		}
	};
})), Mh, Nh = o((() => {
	wn(), Mh = class {
		constructor(e) {
			this._pipelines = /* @__PURE__ */ Object.create(null), this._modules = /* @__PURE__ */ Object.create(null), this._bindGroups = /* @__PURE__ */ new WeakMap(), this._renderer = e, this._device = e.gpu.device, this._layout = this._device.createBindGroupLayout({ entries: [{
				binding: 0,
				visibility: GPUShaderStage.FRAGMENT,
				texture: { sampleType: "unfilterable-float" }
			}] }), this._pipelineLayout = this._device.createPipelineLayout({ bindGroupLayouts: [this._layout] });
		}
		copy(e, t, n, r) {
			var i;
			let a = this._renderer.renderTarget.getGpuRenderTarget(t), o = t.colorAttachments[n].texture;
			(i = a.msaaBackTextures)[n] ?? (i[n] = new Cn({
				label: "msaa-back-texture",
				width: o.width,
				height: o.height,
				resolution: o._resolution,
				format: o.format,
				autoGenerateMipmaps: !1,
				autoGarbageCollect: !0
			}));
			let s = this._renderer.texture.getGpuSource(a.msaaBackTextures[n]);
			e.copyTextureToTexture({ texture: r }, { texture: s }, {
				width: Math.min(r.width, s.width),
				height: Math.min(r.height, s.height)
			});
		}
		draw(e, t, n) {
			var r;
			let i = this._renderer.renderTarget.getGpuRenderTarget(t), a = this._renderer.texture.getGpuSource(i.msaaBackTextures[n]), o = t.depthStencilAttachment?.texture.format ?? "";
			for (let e of t.colorAttachments) o += `|${e.texture.format}`;
			let s = (r = this._pipelines)[o] ?? (r[o] = []), c = this._bindGroups.get(a);
			c || (c = this._device.createBindGroup({
				layout: this._layout,
				entries: [{
					binding: 0,
					resource: a.createView()
				}]
			}), this._bindGroups.set(a, c)), e.setPipeline(s[n] ?? (s[n] = this._createPipeline(t, n))), e.setBindGroup(0, c), e.draw(3);
		}
		_getModule(e) {
			var t;
			return (t = this._modules)[e] ?? (t[e] = this._device.createShaderModule({
				label: "msaa-restore",
				code: `
                @group(0) @binding(0) var resolved: texture_2d<f32>;

                @vertex
                fn vertexMain(@builtin(vertex_index) i: u32) -> @builtin(position) vec4<f32> {
                    let pos = array<vec2<f32>, 3>(vec2<f32>(-1.0, -1.0), vec2<f32>(3.0, -1.0), vec2<f32>(-1.0, 3.0));

                    return vec4<f32>(pos[i], 0.0, 1.0);
                }

                @fragment
                fn fragmentMain(@builtin(position) position: vec4<f32>) -> @location(${e}) vec4<f32> {
                    return textureLoad(resolved, vec2<i32>(position.xy), 0);
                }
            `
			})), this._modules[e];
		}
		_createPipeline(e, t) {
			let n = e.depthStencilAttachment?.texture.format, r;
			n && (r = { format: n }, n.includes("depth") && (r.depthWriteEnabled = !1, r.depthCompare = "always"));
			let i = this._getModule(t);
			return this._device.createRenderPipeline({
				label: "msaa-restore",
				layout: this._pipelineLayout,
				vertex: {
					module: i,
					entryPoint: "vertexMain"
				},
				fragment: {
					module: i,
					entryPoint: "fragmentMain",
					targets: e.colorAttachments.map((e, n) => ({
						format: e.texture.format,
						writeMask: n === t ? GPUColorWrite.ALL : 0
					}))
				},
				depthStencil: r,
				multisample: { count: 4 }
			});
		}
	};
})), Ph, Fh = o((() => {
	cf(), Ph = class {
		constructor() {
			this.contexts = [], this.canvasTextures = [], this.canvasMsaaTextures = [], this.transient = !1, this.msaaSamples = 1, this.msaaBackTextures = [], this.stencilMode = sf.DISABLED, this.stencilReference = 0, this.maskStackIndex = 0;
		}
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/gpu/renderTarget/GpuRenderTargetAdaptor.mjs
function Ih(e) {
	if (Lh[e]) return e;
	let t = navigator.gpu.getPreferredCanvasFormat();
	return I(`[WebGPU] CanvasSource format '${e}' is not a valid GPUCanvasContext format. Falling back to '${t}'. Allowed formats are: bgra8unorm, rgba8unorm, rgba16float.`), t;
}
var Lh, Rh, zh = o((() => {
	L(), eu(), Aa(), kh(), jh(), Nh(), Fh(), Lh = {
		bgra8unorm: !0,
		rgba8unorm: !0,
		rgba16float: !0
	}, Rh = class {
		constructor() {
			this._activePass = null;
		}
		init(e, t) {
			this._renderer = e, this._renderTargetSystem = t, e.runners.contextChange.add(this), e.runners.destroy.add(this);
		}
		contextChange() {
			this._msaaRestore = null, this._depthCopy = null;
		}
		destroy() {
			this._msaaRestore = null, this._depthCopy = null;
		}
		copyToTexture(e, t, n, r, i) {
			let a = this._renderer;
			this.finishRenderPass();
			let o = this._getGpuColorTexture(e), s = a.texture.getGpuSource(t.source);
			return a.encoder.commandEncoder.copyTextureToTexture({
				texture: o,
				origin: n
			}, {
				texture: s,
				origin: i
			}, r), t;
		}
		copyDepthTexture(e, t, n, r, i) {
			let a = this._renderer;
			this.finishRenderPass();
			let o = e.depthStencilAttachment.texture, s = t.source, c = a.texture.getGpuSource(o), l = a.texture.getGpuSource(s), u = c.sampleCount > 1 || n.x !== 0 || n.y !== 0 || i.x !== 0 || i.y !== 0 || r.width !== c.width || r.height !== c.height || r.width !== l.width || r.height !== l.height;
			if (u) {
				if (o.transient) {
					I("[RenderTargetSystem] copyDepthTexture: the source target is transient, so its multisampled depth is discarded at the end of each pass and there is nothing to copy");
					return;
				}
				if (!o.format.includes("depth") || !s.format.includes("depth")) {
					I(`[RenderTargetSystem] copyDepthTexture: copying from an antialiased target or a region copies depth only, so both textures need a depth aspect (got '${o.format}' to '${s.format}')`);
					return;
				}
			}
			let d = a.encoder.commandEncoder === null, f = d ? a.gpu.device.createCommandEncoder() : a.encoder.commandEncoder;
			u ? (this._depthCopy ??= new Ah(a), this._depthCopy.copy(f, o, s, n, r, i)) : f.copyTextureToTexture({ texture: c }, { texture: l }, r), d && a.gpu.device.queue.submit([f.finish()]);
		}
		startRenderPass(e, t = !0, n, r, i = 0, a = 0) {
			let o = this._renderTargetSystem.getGpuRenderTarget(e);
			if (a !== 0 && o.msaa) throw Error("[RenderTargetSystem] Rendering to array layers is not supported with MSAA render targets.");
			if (i > 0 && o.msaa) throw Error("[RenderTargetSystem] Rendering to mip levels is not supported with MSAA render targets.");
			let s = t;
			typeof t == "boolean" && (s = t ? $l.ALL : $l.NONE), (e.stencil || e.depth) && !e.depthStencilAttachment && e.ensureDepthStencilTexture();
			let c = !!e.depthStencilAttachment, l = this._activePass, u = l !== null && l.renderTarget === e && l.mipLevel === i && l.layer === a && l.depthStencil === c && this._renderer.encoder.renderPassEncoder !== null && s === $l.NONE;
			if (this._renderer.pipeline.setRenderTarget(e), u) {
				this._renderer.encoder.setViewport(r);
				return;
			}
			let { descriptor: d, restore: f } = this._buildDescriptor(e, s, n, i, a);
			o.descriptor = d;
			let p = this._renderer.encoder;
			f ? (p.endRenderPass(), this._beginRestoredPass(e, f, p.commandEncoder, () => p.beginRenderPass(o))) : p.beginRenderPass(o), p.setViewport(r), this._activePass = {
				renderTarget: e,
				mipLevel: i,
				layer: a,
				depthStencil: c
			};
		}
		finishRenderPass() {
			this._renderer.encoder.endRenderPass(), this._activePass = null;
		}
		_beginRestoredPass(e, t, n, r) {
			let i = this._msaaRestore ??= new Mh(this._renderer);
			for (let r of t) i.copy(n, e, r, this._getGpuColorTexture(e, r));
			let a = r();
			for (let n of t) i.draw(a, e, n);
			return a;
		}
		_getGpuColorTexture(e, t = 0) {
			if (e.colorAttachments.length === 0) throw Error("[GpuRenderTargetAdaptor] cannot get gpu color texture from a depth-only render target");
			let n = e.colorAttachments[t].texture;
			return n instanceof ka && n._gpuContext ? n._gpuContext.getCurrentTexture() : this._renderer.texture.getGpuSource(n);
		}
		getDescriptor(e, t, n, r = 0, i = 0) {
			return this._buildDescriptor(e, t, n, r, i).descriptor;
		}
		_buildDescriptor(e, t, n, r = 0, i = 0) {
			let a = null;
			typeof t == "boolean" && (t = t ? $l.ALL : $l.NONE);
			let o = this._renderTargetSystem, s = o.getGpuRenderTarget(e), c = e.colorAttachments.map((e, c) => {
				var l;
				let u = e.texture, d = u instanceof ka ? u._gpuContext : null, f, p, m = !1;
				if (d) {
					if (i !== 0) throw Error("[RenderTargetSystem] Rendering to array layers is not supported for canvas targets.");
					let t = d.getCurrentTexture();
					m = s.canvasTextures[c] !== t, s.canvasTextures[c] = t, f = t.createView(e.viewDescriptor);
				} else f = this._renderer.texture.getTextureRenderTargetView(e.texture, r, i, e.viewDescriptor);
				let h = null;
				u.antialias && (h = d ? (l = s.canvasMsaaTextures)[c] ?? (l[c] = new Oh(this._renderer, u)) : this._renderer.texture.getMsaaTexture(u), p = f, f = h.view);
				let g = (t & $l.COLOR) !== 0 && e.loadOp !== "load" ? "clear" : "load", _ = !!h?.transient, v = _ && g !== "clear", y = v && !m;
				v && (g = "clear", y && (a ??= []).push(c));
				let b = {
					view: f,
					resolveTarget: p,
					storeOp: _ ? "discard" : e.storeOp ?? "store",
					loadOp: g
				};
				u.dimension === "3d" && (b.depthSlice = i), v ? b.clearValue = [
					0,
					0,
					0,
					0
				] : g === "clear" && (b.clearValue = e.clearValue ?? n ?? o.defaultClearColor);
				for (let t in e) t !== "texture" && t !== "viewDescriptor" && t !== "clearValue" && t !== "loadOp" && t !== "storeOp" && (b[t] = e[t]);
				return b;
			}), l;
			if (e.depthStencilAttachment) {
				this._prepareDepthStencil(e, s);
				let n = e.depthStencilAttachment, a = n.texture.format.includes("stencil"), o = n.texture.format.includes("depth"), c = s.transient ? "discard" : "store", u = s.transient ? "clear" : "load";
				l = { view: this._renderer.texture.getTextureRenderTargetView(n.texture, r, i, n.viewDescriptor) };
				let d = n.depthReadOnly ?? !1, f = n.stencilReadOnly ?? d;
				a && !f ? (l.stencilLoadOp = t & $l.STENCIL ? "clear" : n.stencilLoadOp ?? u, l.stencilStoreOp = n.stencilStoreOp ?? c, l.stencilLoadOp === "clear" && (l.stencilClearValue = n.stencilClearValue ?? 0)) : a && f && (l.stencilReadOnly = !0), o && !d ? (l.depthLoadOp = t & $l.DEPTH ? "clear" : n.depthLoadOp ?? u, l.depthStoreOp = n.depthStoreOp ?? c, l.depthLoadOp === "clear" && (l.depthClearValue = n.depthClearValue ?? 1)) : o && d && (l.depthReadOnly = !0);
				for (let e in n) e !== "texture" && e !== "viewDescriptor" && e !== "stencilLoadOp" && e !== "stencilStoreOp" && e !== "stencilClearValue" && e !== "stencilReadOnly" && e !== "depthLoadOp" && e !== "depthStoreOp" && e !== "depthClearValue" && e !== "depthReadOnly" && (l[e] = n[e]);
			}
			return {
				descriptor: {
					colorAttachments: c,
					depthStencilAttachment: l,
					label: e.label
				},
				restore: a
			};
		}
		clear(e, t = !0, n, r, i = 0, a = 0) {
			if (!t) return;
			let { gpu: o, encoder: s } = this._renderer, c = o.device;
			if (s.commandEncoder === null) {
				let o = c.createCommandEncoder(), { descriptor: s, restore: l } = this._buildDescriptor(e, t, n, i, a), u = () => o.beginRenderPass(s), d = l ? this._beginRestoredPass(e, l, o, u) : u();
				d.setViewport(r.x, r.y, r.width, r.height, 0, 1), d.end();
				let f = o.finish();
				c.queue.submit([f]);
			} else this.startRenderPass(e, t, n, r, i, a);
		}
		initGpuRenderTarget(e) {
			e.isRoot = !0;
			let t = new Ph();
			return t.transient = !!e.colorTexture?.antialias && !!e.colorTexture.transient, e.colorAttachments.forEach((e, n) => {
				let r = e.texture;
				if (r instanceof ka) {
					let e = r._gpuContext ??= r.resource.getContext("webgpu"), i = r.transparent ? "premultiplied" : "opaque", a = Ih(r.format);
					try {
						e.configure({
							device: this._renderer.gpu.device,
							usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
							format: a,
							alphaMode: i,
							...a === "rgba16float" ? { toneMapping: { mode: "extended" } } : {}
						});
					} catch (e) {
						console.error(e);
					}
					t.contexts[n] = e;
				}
				t.msaa ||= r.source.antialias;
			}), t.msaa && (t.msaaSamples = 4), t;
		}
		_prepareDepthStencil(e, t) {
			let n = e.depthStencilAttachment?.texture;
			n && t.msaa && (n.sampleCount = 4, n.transient = t.transient);
		}
		destroyGpuRenderTarget(e) {
			e.contexts.forEach((e) => {
				e.unconfigure();
			}), e.canvasMsaaTextures.forEach((e) => {
				e.destroy();
			}), e.msaaBackTextures.forEach((e) => {
				e?.destroy();
			}), e.canvasMsaaTextures.length = 0, e.msaaBackTextures.length = 0, e.contexts.length = 0;
		}
		ensureDepthStencilTexture(e) {
			this._prepareDepthStencil(e, this._renderTargetSystem.getGpuRenderTarget(e));
		}
		resizeGpuRenderTarget(e) {
			let t = this._renderTargetSystem.getGpuRenderTarget(e);
			t.width = e.width, t.height = e.height, t.msaa && e.colorAttachments.forEach((e, n) => {
				let r = e.texture;
				r instanceof ka && r.antialias && (t.canvasMsaaTextures[n]?.destroy(), t.canvasMsaaTextures[n] = null), t.msaaBackTextures[n]?.resize(r.width, r.height, r._resolution);
			});
		}
	};
})), Bh, Vh = o((() => {
	h(), Dh(), zh(), Bh = class extends Eh {
		constructor(e) {
			super(e), this.adaptor = new Rh(), this.adaptor.init(e, this);
		}
	}, Bh.extension = {
		type: [d.WebGPUSystem],
		name: "renderTarget"
	};
})), Hh, Uh = o((() => {
	h(), Hh = class {
		constructor() {
			this._gpuProgramData = /* @__PURE__ */ Object.create(null);
		}
		contextChange(e) {
			this._gpu = e, this._gpuProgramData = /* @__PURE__ */ Object.create(null);
		}
		getProgramData(e) {
			return this._gpuProgramData[e._layoutKey] || this._createGPUProgramData(e);
		}
		_createGPUProgramData(e) {
			let t = this._gpu.device, n = e.gpuLayout.map((e) => t.createBindGroupLayout({ entries: e })), r = { bindGroupLayouts: n };
			return this._gpuProgramData[e._layoutKey] = {
				bindGroups: n,
				pipeline: t.createPipelineLayout(r)
			}, this._gpuProgramData[e._layoutKey];
		}
		destroy() {
			this._gpu = null, this._gpuProgramData = null;
		}
	}, Hh.extension = {
		type: [d.WebGPUSystem],
		name: "shader"
	};
})), Wh, Gh = o((() => {
	Wh = {}, Wh.normal = {
		alpha: {
			srcFactor: "one",
			dstFactor: "one-minus-src-alpha",
			operation: "add"
		},
		color: {
			srcFactor: "one",
			dstFactor: "one-minus-src-alpha",
			operation: "add"
		}
	}, Wh.add = {
		alpha: {
			srcFactor: "one",
			dstFactor: "one",
			operation: "add"
		},
		color: {
			srcFactor: "one",
			dstFactor: "one",
			operation: "add"
		}
	}, Wh.multiply = {
		alpha: {
			srcFactor: "one",
			dstFactor: "one-minus-src-alpha",
			operation: "add"
		},
		color: {
			srcFactor: "dst",
			dstFactor: "one-minus-src-alpha",
			operation: "add"
		}
	}, Wh.screen = {
		alpha: {
			srcFactor: "one",
			dstFactor: "one-minus-src-alpha",
			operation: "add"
		},
		color: {
			srcFactor: "one",
			dstFactor: "one-minus-src",
			operation: "add"
		}
	}, Wh.overlay = {
		alpha: {
			srcFactor: "one",
			dstFactor: "one-minus-src-alpha",
			operation: "add"
		},
		color: {
			srcFactor: "one",
			dstFactor: "one-minus-src",
			operation: "add"
		}
	}, Wh.none = {
		alpha: {
			srcFactor: "one",
			dstFactor: "one-minus-src-alpha",
			operation: "add"
		},
		color: {
			srcFactor: "zero",
			dstFactor: "zero",
			operation: "add"
		}
	}, Wh["normal-npm"] = {
		alpha: {
			srcFactor: "one",
			dstFactor: "one-minus-src-alpha",
			operation: "add"
		},
		color: {
			srcFactor: "src-alpha",
			dstFactor: "one-minus-src-alpha",
			operation: "add"
		}
	}, Wh["add-npm"] = {
		alpha: {
			srcFactor: "one",
			dstFactor: "one",
			operation: "add"
		},
		color: {
			srcFactor: "src-alpha",
			dstFactor: "one",
			operation: "add"
		}
	}, Wh["screen-npm"] = {
		alpha: {
			srcFactor: "one",
			dstFactor: "one-minus-src-alpha",
			operation: "add"
		},
		color: {
			srcFactor: "src-alpha",
			dstFactor: "one-minus-src",
			operation: "add"
		}
	}, Wh.erase = {
		alpha: {
			srcFactor: "zero",
			dstFactor: "one-minus-src-alpha",
			operation: "add"
		},
		color: {
			srcFactor: "zero",
			dstFactor: "one-minus-src-alpha",
			operation: "add"
		}
	}, Wh.min = {
		alpha: {
			srcFactor: "one",
			dstFactor: "one",
			operation: "min"
		},
		color: {
			srcFactor: "one",
			dstFactor: "one",
			operation: "min"
		}
	}, Wh.max = {
		alpha: {
			srcFactor: "one",
			dstFactor: "one",
			operation: "max"
		},
		color: {
			srcFactor: "one",
			dstFactor: "one",
			operation: "max"
		}
	};
})), Kh, qh = o((() => {
	h(), mc(), Ln(), Gh(), Kh = class {
		constructor() {
			this.defaultState = new pc(), this.defaultState.blend = !0;
		}
		contextChange(e) {
			this.gpu = e;
		}
		getColorTargets(e, t) {
			let n = e.blend ? Wh[e.blendMode] || Wh.normal : void 0, r = [];
			for (let e = 0; e < t.length; e++) {
				let i = t[e];
				r[e] = {
					format: i,
					writeMask: 0,
					blend: In(i) ? void 0 : n
				};
			}
			return r;
		}
		destroy() {
			this.gpu = null;
		}
	}, Kh.extension = {
		type: [d.WebGPUSystem],
		name: "state"
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/shared/texture/utils/getTexelRangeRects.mjs
function Jh(e, t, n, r, i) {
	if (e = Math.max(0, e), t = Math.min(t, n * r), e >= t) return 0;
	let a = Math.floor(e / n), o = e - a * n, s = Math.floor(t / n), c = t - s * n;
	if (a === s) return i[0].set(o, a, c - o, 1), 1;
	let l = 0, u = a;
	return o > 0 && (i[l++].set(o, a, n - o, 1), u++), s > u && i[l++].set(0, u, n, s - u), c > 0 && i[l++].set(0, s, c, 1), l;
}
var Yh = o((() => {})), Xh, Zh, Qh = o((() => {
	wt(), Yh(), Xh = [
		new R(),
		new R(),
		new R()
	], Zh = {
		type: "image",
		upload(e, t, n, r = 0) {
			let i = e.resource, a = e.pixelWidth | 0, o = e.pixelHeight | 0, s = e.depthOrArrayLayers, c = i.byteLength / (a * o * s);
			if (s > 1) {
				n.device.queue.writeTexture({
					texture: t,
					origin: {
						x: 0,
						y: 0,
						z: r
					}
				}, i, {
					offset: 0,
					rowsPerImage: o,
					bytesPerRow: a * c
				}, {
					width: a,
					height: o,
					depthOrArrayLayers: s
				});
				return;
			}
			let l = Jh(e._updateStart, e._updateEnd, a, o, Xh);
			for (let e = 0; e < l; e++) {
				let o = Xh[e];
				n.device.queue.writeTexture({
					texture: t,
					origin: {
						x: o.x,
						y: o.y,
						z: r
					}
				}, i, {
					offset: (o.y * a + o.x) * c,
					rowsPerImage: o.height,
					bytesPerRow: a * c
				}, {
					width: o.width,
					height: o.height,
					depthOrArrayLayers: 1
				});
			}
		}
	};
})), $h, eg, tg, ng = o((() => {
	$h = {
		"bc1-rgba-unorm": {
			blockBytes: 8,
			blockWidth: 4,
			blockHeight: 4
		},
		"bc2-rgba-unorm": {
			blockBytes: 16,
			blockWidth: 4,
			blockHeight: 4
		},
		"bc3-rgba-unorm": {
			blockBytes: 16,
			blockWidth: 4,
			blockHeight: 4
		},
		"bc7-rgba-unorm": {
			blockBytes: 16,
			blockWidth: 4,
			blockHeight: 4
		},
		"etc1-rgb-unorm": {
			blockBytes: 8,
			blockWidth: 4,
			blockHeight: 4
		},
		"etc2-rgba8unorm": {
			blockBytes: 16,
			blockWidth: 4,
			blockHeight: 4
		},
		"astc-4x4-unorm": {
			blockBytes: 16,
			blockWidth: 4,
			blockHeight: 4
		}
	}, eg = {
		blockBytes: 4,
		blockWidth: 1,
		blockHeight: 1
	}, tg = {
		type: "compressed",
		upload(e, t, n, r = 0) {
			let i = e.pixelWidth, a = e.pixelHeight, o = $h[e.format] || eg;
			for (let s = 0; s < e.resource.length; s++) {
				let c = e.resource[s], l = Math.ceil(i / o.blockWidth) * o.blockBytes;
				n.device.queue.writeTexture({
					texture: t,
					mipLevel: s,
					origin: {
						x: 0,
						y: 0,
						z: r
					}
				}, c, {
					offset: 0,
					bytesPerRow: l
				}, {
					width: Math.ceil(i / o.blockWidth) * o.blockWidth,
					height: Math.ceil(a / o.blockHeight) * o.blockHeight,
					depthOrArrayLayers: 1
				}), i = Math.max(i >> 1, 1), a = Math.max(a >> 1, 1);
			}
		}
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/gpu/texture/uploaders/gpuUploadCubeTextureResource.mjs
function rg(e) {
	return {
		type: "cube",
		upload(t, n, r) {
			let i = t.faces;
			for (let t = 0; t < ig.length; t++) {
				let a = i[ig[t]];
				(e[a.uploadMethodId] || e.image).upload(a, n, r, t);
			}
		}
	};
}
var ig, ag = o((() => {
	ig = [
		"right",
		"left",
		"top",
		"bottom",
		"front",
		"back"
	];
})), og, sg = o((() => {
	W(), L(), og = {
		type: "image",
		upload(e, t, n, r = 0) {
			let i = e.resource;
			if (!i) return;
			if (globalThis.HTMLImageElement && i instanceof HTMLImageElement) {
				let t = U.get().createCanvas(i.width, i.height);
				t.getContext("2d").drawImage(i, 0, 0, i.width, i.height), e.resource = t, I("ImageSource: Image element passed, converting to canvas and replacing resource.");
			}
			let a = Math.min(t.width, e.resourceWidth || e.pixelWidth), o = Math.min(t.height, e.resourceHeight || e.pixelHeight), s = e.alphaMode === "premultiply-alpha-on-upload";
			n.device.queue.copyExternalImageToTexture({ source: i }, {
				texture: t,
				origin: {
					x: 0,
					y: 0,
					z: r
				},
				premultipliedAlpha: s
			}, {
				width: a,
				height: o
			});
		}
	};
})), cg, lg = o((() => {
	sg(), cg = {
		type: "video",
		upload(e, t, n, r) {
			og.upload(e, t, n, r);
		}
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/gpu/texture/utils/Gpu3dMipmapGenerator.mjs
function ug(e, t) {
	if (!t) throw Error("[Gpu3dMipmapGenerator] generating mipmaps for a 3D texture needs storage: true.");
	if (!dg.includes(e)) throw Error(`[Gpu3dMipmapGenerator] format '${e}' can't be downsampled. Use ${dg.join(", ")}.`);
}
var dg, fg, pg, mg = o((() => {
	dg = ["rgba8unorm", "rgba16float"], fg = 4, pg = class {
		constructor(e) {
			this._pipelines = {}, this._device = e, this._sampler = e.createSampler({
				magFilter: "linear",
				minFilter: "linear"
			});
		}
		_getMipmapPipeline(e) {
			var t;
			return (t = this._pipelines)[e] ?? (t[e] = this._device.createComputePipeline({
				layout: "auto",
				compute: {
					module: this._device.createShaderModule({ code: `
                        @group(0) @binding(0) var srcSampler : sampler;
                        @group(0) @binding(1) var src : texture_3d<f32>;
                        @group(0) @binding(2) var dst : texture_storage_3d<${e}, write>;

                        @compute @workgroup_size(${fg}, ${fg}, ${fg})
                        fn main(@builtin(global_invocation_id) gid : vec3<u32>) {
                            let dstSize = textureDimensions(dst);

                            if (gid.x >= dstSize.x || gid.y >= dstSize.y || gid.z >= dstSize.z) {
                                return;
                            }

                            // centre of the 2x2x2 footprint in the previous mip. When a dimension is
                            // odd its last texel, row or slice is never sampled, as in the 2D generator
                            let uv = (vec3<f32>(gid) * 2.0 + 1.0) / vec3<f32>(textureDimensions(src));

                            textureStore(dst, gid, textureSampleLevel(src, srcSampler, uv, 0.0));
                        }
                    ` }),
					entryPoint: "main"
				}
			})), this._pipelines[e];
		}
		generateMipmap(e) {
			if (e.dimension !== "3d") throw Error("[Gpu3dMipmapGenerator] generateMipmap expects a 3D texture.");
			if (e.mipLevelCount < 2) return;
			ug(e.format, (e.usage & GPUTextureUsage.STORAGE_BINDING) !== 0);
			let t = this._getMipmapPipeline(e.format), n = t.getBindGroupLayout(0), r = this._device.createCommandEncoder({ label: "Gpu3dMipmapGenerator" }), i = r.beginComputePass();
			i.setPipeline(t);
			let a = e.width, o = e.height, s = e.depthOrArrayLayers, c = e.createView({
				dimension: "3d",
				baseMipLevel: 0,
				mipLevelCount: 1
			});
			for (let t = 1; t < e.mipLevelCount; t++) {
				a = Math.max(1, a >> 1), o = Math.max(1, o >> 1), s = Math.max(1, s >> 1);
				let r = e.createView({
					dimension: "3d",
					baseMipLevel: t,
					mipLevelCount: 1
				});
				i.setBindGroup(0, this._device.createBindGroup({
					layout: n,
					entries: [
						{
							binding: 0,
							resource: this._sampler
						},
						{
							binding: 1,
							resource: c
						},
						{
							binding: 2,
							resource: r
						}
					]
				})), i.dispatchWorkgroups(Math.ceil(a / fg), Math.ceil(o / fg), Math.ceil(s / fg)), c = r;
			}
			i.end(), this._device.queue.submit([r.finish()]);
		}
	};
})), hg, gg = o((() => {
	hg = class {
		constructor(e) {
			this._pipelines = {}, this._device = e, this._sampler = e.createSampler({ minFilter: "linear" });
		}
		_getMipmapPipeline(e) {
			let t = this._pipelines[e];
			return t || (this._mipmapShaderModule ||= this._device.createShaderModule({ code: "\n                        var<private> pos : array<vec2<f32>, 3> = array<vec2<f32>, 3>(\n                        vec2<f32>(-1.0, -1.0), vec2<f32>(-1.0, 3.0), vec2<f32>(3.0, -1.0));\n\n                        struct VertexOutput {\n                        @builtin(position) position : vec4<f32>,\n                        @location(0) texCoord : vec2<f32>,\n                        };\n\n                        @vertex\n                        fn vertexMain(@builtin(vertex_index) vertexIndex : u32) -> VertexOutput {\n                        var output : VertexOutput;\n                        output.texCoord = pos[vertexIndex] * vec2<f32>(0.5, -0.5) + vec2<f32>(0.5);\n                        output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);\n                        return output;\n                        }\n\n                        @group(0) @binding(0) var imgSampler : sampler;\n                        @group(0) @binding(1) var img : texture_2d<f32>;\n\n                        @fragment\n                        fn fragmentMain(@location(0) texCoord : vec2<f32>) -> @location(0) vec4<f32> {\n                        return textureSample(img, imgSampler, texCoord);\n                        }\n                    " }), t = this._device.createRenderPipeline({
				layout: "auto",
				vertex: {
					module: this._mipmapShaderModule,
					entryPoint: "vertexMain"
				},
				fragment: {
					module: this._mipmapShaderModule,
					entryPoint: "fragmentMain",
					targets: [{ format: e }]
				}
			}), this._pipelines[e] = t), t;
		}
		generateMipmap(e) {
			if (e.dimension === "3d") throw Error("[GpuMipmapGenerator] a 3D texture uses Gpu3dMipmapGenerator.");
			if (e.dimension === "1d") throw Error("Generating mipmaps for 1d textures is currently unsupported!");
			let t = this._getMipmapPipeline(e.format), n = e, r = e.depthOrArrayLayers || 1, i = e.usage & GPUTextureUsage.RENDER_ATTACHMENT;
			if (!i) {
				let t = {
					size: {
						width: Math.ceil(e.width / 2),
						height: Math.ceil(e.height / 2),
						depthOrArrayLayers: r
					},
					format: e.format,
					usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT,
					mipLevelCount: e.mipLevelCount - 1
				};
				n = this._device.createTexture(t);
			}
			let a = this._device.createCommandEncoder({}), o = t.getBindGroupLayout(0);
			for (let s = 0; s < r; ++s) {
				let r = e.createView({
					baseMipLevel: 0,
					mipLevelCount: 1,
					dimension: "2d",
					baseArrayLayer: s,
					arrayLayerCount: 1
				}), c = +!!i;
				for (let i = 1; i < e.mipLevelCount; ++i) {
					let e = n.createView({
						baseMipLevel: c++,
						mipLevelCount: 1,
						dimension: "2d",
						baseArrayLayer: s,
						arrayLayerCount: 1
					}), i = a.beginRenderPass({ colorAttachments: [{
						view: e,
						storeOp: "store",
						loadOp: "clear",
						clearValue: {
							r: 0,
							g: 0,
							b: 0,
							a: 0
						}
					}] }), l = this._device.createBindGroup({
						layout: o,
						entries: [{
							binding: 0,
							resource: this._sampler
						}, {
							binding: 1,
							resource: r
						}]
					});
					i.setPipeline(t), i.setBindGroup(0, l), i.draw(3, 1, 0, 0), i.end(), r = e;
				}
			}
			if (!i) {
				let t = {
					width: Math.ceil(e.width / 2),
					height: Math.ceil(e.height / 2),
					depthOrArrayLayers: r
				};
				for (let r = 1; r < e.mipLevelCount; ++r) a.copyTextureToTexture({
					texture: n,
					mipLevel: r - 1
				}, {
					texture: e,
					mipLevel: r
				}, t), t.width = Math.ceil(t.width / 2), t.height = Math.ceil(t.height / 2);
			}
			return this._device.queue.submit([a.finish()]), i || n.destroy(), e;
		}
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/gpu/texture/GpuTextureSystem.mjs
function _g(e) {
	return bg.test(e) ? [`${e}-srgb`] : void 0;
}
function vg(e) {
	return `${e.format || ""}.${e.dimension || ""}.${e.aspect || ""}.${e.baseMipLevel || 0}.${e.mipLevelCount || ""}.${e.baseArrayLayer || 0}.${e.arrayLayerCount || ""}`;
}
var yg, bg, xg, Sg, Cg = o((() => {
	W(), h(), fm(), tc(), ro(), zh(), Us(), kh(), Qh(), ng(), ag(), sg(), lg(), mg(), gg(), yg = class {
		constructor(e) {
			this.textureView = null, this.textureViews = /* @__PURE__ */ Object.create(null), this.msaa = null, this.gpuTexture = e;
		}
		destroy() {
			this.gpuTexture.destroy(), this.msaa?.destroy(), this.textureView = null, this.textureViews = null, this.gpuTexture = null, this.msaa = null;
		}
	}, bg = /^(rgba8|bgra8|bc[1237]-rgba-|etc2-rgb8|etc2-rgb8a1|etc2-rgba8|astc-\d+x\d+-)unorm$/, xg = class e {
		constructor(t) {
			this._gpuSamplers = /* @__PURE__ */ Object.create(null), this._bindGroupHash = /* @__PURE__ */ Object.create(null), this._renderer = t, t.gc.addCollection(this, "_bindGroupHash", "hash"), this._managedTextures = new dm({
				renderer: t,
				type: "resource",
				onUnload: this.onSourceUnload.bind(this),
				name: "gpuTextureSource"
			});
			let n = {
				image: og,
				buffer: Zh,
				video: cg,
				compressed: tg,
				...e.uploadExtensions
			};
			this._uploads = {
				...n,
				cube: rg(n)
			};
		}
		get managedTextures() {
			return Object.values(this._managedTextures.items);
		}
		contextChange(e) {
			this._gpu = e, this._managedTextures.removeAll(), this._gpuSamplers = /* @__PURE__ */ Object.create(null), this._mipmapGenerator = null, this._mipmap3dGenerator = null;
		}
		initSource(e) {
			return e._gpuData[this._renderer.uid]?.gpuTexture || this._initSource(e);
		}
		_initSource(e) {
			if (e.autoGenerateMipmaps) {
				e.dimension === "3d" && ug(e.format, e.storage);
				let t = Math.max(e.pixelWidth, e.pixelHeight, e.depth);
				e.mipLevelCount = Math.floor(Math.log2(t)) + 1;
			}
			let t, n;
			e.sampleCount > 1 ? (t = GPUTextureUsage.RENDER_ATTACHMENT, e.transient ? this._renderer.device.extensions.transientAttachment && (t |= GPUTextureUsage.TRANSIENT_ATTACHMENT) : e.format.includes("depth") && (t |= GPUTextureUsage.TEXTURE_BINDING)) : (t = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST, e.uploadMethodId !== "compressed" && (t |= GPUTextureUsage.RENDER_ATTACHMENT, t |= GPUTextureUsage.COPY_SRC), e.storage && (t |= GPUTextureUsage.STORAGE_BINDING), n = _g(e.format));
			let r = $h[e.format] || {
				blockBytes: 4,
				blockWidth: 1,
				blockHeight: 1
			}, i = Math.ceil(e.pixelWidth / r.blockWidth) * r.blockWidth, a = Math.ceil(e.pixelHeight / r.blockHeight) * r.blockHeight, o = {
				label: e.label,
				size: {
					width: i,
					height: a,
					depthOrArrayLayers: e.depthOrArrayLayers
				},
				format: e.format,
				viewFormats: n,
				sampleCount: e.sampleCount,
				mipLevelCount: e.mipLevelCount,
				dimension: e.dimension,
				usage: t
			}, s = this._gpu.device.createTexture(o);
			return e._gpuData[this._renderer.uid] = new yg(s), this._managedTextures.add(e) && (e.on("update", this.onSourceUpdate, this), e.on("resize", this.onSourceResize, this), e.on("updateMipmaps", this.onUpdateMipmaps, this)), this.onSourceUpdate(e), s;
		}
		onSourceUpdate(e) {
			let t = this.getGpuSource(e);
			t && (this._uploads[e.uploadMethodId] && this._uploads[e.uploadMethodId].upload(e, t, this._gpu), e.autoGenerateMipmaps && e.mipLevelCount > 1 && this.onUpdateMipmaps(e));
		}
		onUpdateMipmaps(e) {
			let t = this.getGpuSource(e);
			e.dimension === "3d" ? (this._mipmap3dGenerator ??= new pg(this._gpu.device), this._mipmap3dGenerator.generateMipmap(t)) : (this._mipmapGenerator ??= new hg(this._gpu.device), this._mipmapGenerator.generateMipmap(t));
		}
		onSourceUnload(e) {
			e.off("update", this.onSourceUpdate, this), e.off("resize", this.onSourceResize, this), e.off("updateMipmaps", this.onUpdateMipmaps, this);
		}
		onSourceResize(e) {
			e._gcLastUsed = this._renderer.gc.now;
			let t = e._gpuData[this._renderer.uid], n = t?.gpuTexture;
			n ? (n.width !== e.pixelWidth || n.height !== e.pixelHeight) && (t.destroy(), this._bindGroupHash[e.uid] = null, e._gpuData[this._renderer.uid] = null, this.initSource(e)) : this.initSource(e);
		}
		_initSampler(e) {
			return this._gpuSamplers[e._resourceId] = this._gpu.device.createSampler(e), this._gpuSamplers[e._resourceId];
		}
		getGpuSampler(e) {
			return this._gpuSamplers[e._resourceId] || this._initSampler(e);
		}
		getGpuSource(e) {
			return e._gcLastUsed = this._renderer.gc.now, e._gpuData[this._renderer.uid]?.gpuTexture || this.initSource(e);
		}
		getMsaaTexture(e) {
			this.getGpuSource(e);
			let t = e._gpuData[this._renderer.uid];
			return t.msaa ??= new Oh(this._renderer, e), t.msaa;
		}
		getTextureBindGroup(e) {
			return this._bindGroupHash[e.uid] || this._createTextureBindGroup(e);
		}
		_createTextureBindGroup(e) {
			let t = e.source;
			return this._bindGroupHash[e.uid] = new Hs({
				0: t,
				1: t.style,
				2: new ec({ uTextureMatrix: {
					type: "mat3x3<f32>",
					value: e.textureMatrix.mapCoord
				} })
			}), this._bindGroupHash[e.uid];
		}
		getTextureView(e, t) {
			var n;
			let r = e.source;
			r._gcLastUsed = this._renderer.gc.now;
			let i = r._gpuData[this._renderer.uid];
			i ||= (this.initSource(r), r._gpuData[this._renderer.uid]);
			let a = t ? vg(t) : 0;
			return (n = i.textureViews)[a] || (n[a] = i.gpuTexture.createView({
				dimension: r.viewDimension,
				...t
			})), i.textureViews[a];
		}
		getTextureRenderTargetView(e, t = 0, n = 0, r) {
			var i;
			let a = e.source;
			a._gcLastUsed = this._renderer.gc.now;
			let o = a._gpuData[this._renderer.uid];
			o ||= (this.initSource(a), a._gpuData[this._renderer.uid]);
			let s = a.dimension === "3d";
			s && (n = 0);
			let c = n * (a.mipLevelCount || 1) + t + 1;
			return r && (c = `${c}.${vg(r)}`), (i = o.textureViews)[c] || (i[c] = o.gpuTexture.createView({
				dimension: s ? "3d" : "2d",
				baseMipLevel: t,
				mipLevelCount: 1,
				baseArrayLayer: n,
				arrayLayerCount: 1,
				...r
			})), o.textureViews[c];
		}
		generateCanvas(e) {
			let t = this._renderer, n = t.gpu.device.createCommandEncoder(), r = U.get().createCanvas();
			r.width = e.source.pixelWidth, r.height = e.source.pixelHeight;
			let i = r.getContext("webgpu"), a = e.source.format.replace("-srgb", ""), o = Lh[a] ? a : U.get().getNavigator().gpu.getPreferredCanvasFormat();
			return i.configure({
				device: t.gpu.device,
				usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC,
				format: o,
				alphaMode: "premultiplied"
			}), n.copyTextureToTexture({
				texture: t.texture.getGpuSource(e.source),
				origin: {
					x: 0,
					y: 0
				}
			}, { texture: i.getCurrentTexture() }, {
				width: r.width,
				height: r.height
			}), t.gpu.device.queue.submit([n.finish()]), r;
		}
		getPixels(e) {
			let t = this.generateCanvas(e), n = no.getOptimalCanvasAndContext(t.width, t.height), r = n.context;
			r.drawImage(t, 0, 0);
			let { width: i, height: a } = t, o = r.getImageData(0, 0, i, a), s = new Uint8ClampedArray(o.data.buffer);
			return no.returnCanvasAndContext(n), {
				pixels: s,
				width: i,
				height: a
			};
		}
		destroy() {
			this._managedTextures.destroy();
			for (let e of Object.keys(this._bindGroupHash)) {
				let t = Number(e);
				this._bindGroupHash[t]?.destroy();
			}
			this._renderer = null, this._gpu = null, this._mipmapGenerator = null, this._mipmap3dGenerator = null, this._gpuSamplers = null, this._bindGroupHash = null;
		}
	}, xg.extension = {
		type: [d.WebGPUSystem],
		name: "texture"
	}, xg.uploadExtensions = /* @__PURE__ */ Object.create(null), Sg = xg, m.handleByMap(d.TextureUploaderWebGPU, Sg.uploadExtensions);
})), wg = /* @__PURE__ */ c({ WebGPURenderer: () => Mg }), Tg, Eg, Dg, Og, kg, Ag, jg, Mg, Ng = o((() => {
	h(), _d(), Sd(), Td(), ou(), om(), Gs(), um(), hm(), _m(), Cm(), Dm(), km(), jm(), Xm(), rh(), xh(), Vh(), Uh(), qh(), Cg(), Tg = [
		...im,
		Ym,
		Em,
		Sm,
		Om,
		mm,
		Sg,
		Bh,
		Hh,
		Kh,
		bh,
		gm,
		Am,
		lm
	], Eg = [...am, nh], Dg = [
		wd,
		xd,
		gd
	], Og = [], kg = [], Ag = [], jg = [], m.handleByNamedList(d.WebGPUSystem, Og), m.handleByNamedList(d.WebGPUPipes, kg), m.handleByNamedList(d.WebGPUPipesAdaptor, Ag), m.handleByNamedList(d.WebGPULoader, jg), m.add(...Tg, ...Eg, ...Dg), Mg = class extends au {
		constructor() {
			let e = {
				name: "webgpu",
				type: Ws.WEBGPU,
				systems: Og,
				renderPipes: kg,
				renderPipeAdaptors: Ag,
				loaders: jg
			};
			super(e);
		}
	};
})), Pg, Fg = o((() => {
	Pg = class {
		_getShader(e) {
			return this.shader;
		}
		execute(e, t) {
			let n = t.context, r = e.renderer, i = this._getRenderData(r, n), { batcher: a, instructions: o } = i, s = n.customShader || this._getShader(i);
			s.groups[0] = r.globalUniforms.bindGroup, r.state.set(e.state), r.shader.bind(s), r.geometry.bind(a.geometry, s.glProgram);
			let c = o.instructions;
			for (let e = 0; e < o.instructionSize; e++) {
				let t = c[e];
				if (t.size) {
					for (let e = 0; e < t.textures.count; e++) r.texture.bind(t.textures.textures[e], e);
					r.texture.unbindIntegerTextures(t.textures.count), r.geometry.draw(t.topology, t.size, t.start);
				}
			}
		}
		destroy() {
			this.shader.destroy(!0), this.shader = null;
		}
	};
})), Ig, Lg = o((() => {
	h(), M(), Gu(), Ju(), nd(), od(), ld(), Ff(), rc(), tc(), Fg(), Ig = class extends Pg {
		contextChange(e) {
			let t = new ec({
				uColor: {
					value: new Float32Array([
						1,
						1,
						1,
						1
					]),
					type: "vec4<f32>"
				},
				uTransformMatrix: {
					value: new j(),
					type: "mat3x3<f32>"
				},
				uRound: {
					value: 0,
					type: "f32"
				}
			}), n = e.limits.maxBatchableTextures, r = Wu({
				name: "graphics",
				bits: [
					qu,
					$u(n),
					ad,
					cd
				]
			});
			this.shader = new nc({
				glProgram: r,
				resources: {
					localUniforms: t,
					batchSamplers: Nf(n)
				}
			});
		}
		_getRenderData(e, t) {
			return e.graphicsContext.getContextRenderData(t);
		}
	}, Ig.extension = {
		type: [d.WebGLPipesAdaptor],
		name: "graphics"
	};
})), Rg, zg = o((() => {
	h(), M(), Gu(), od(), ld(), bd(), rc(), V(), L(), Rg = class {
		init() {
			let e = Wu({
				name: "mesh",
				bits: [
					ad,
					yd,
					cd
				]
			});
			this._shader = new nc({
				glProgram: e,
				resources: {
					uTexture: B.EMPTY.source,
					textureUniforms: { uTextureMatrix: {
						type: "mat3x3<f32>",
						value: new j()
					} }
				}
			});
		}
		execute(e, t) {
			let n = e.renderer, r = t._shader;
			if (!r) {
				r = this._shader;
				let e = t.texture, n = e.source;
				r.resources.uTexture = n, r.resources.uSampler = n.style, r.resources.textureUniforms.uniforms.uTextureMatrix = e.textureMatrix.mapCoord;
			} else if (!r.glProgram) {
				I("Mesh shader has no glProgram", t.shader);
				return;
			}
			r.groups[100] = n.globalUniforms.bindGroup, r.groups[101] = e.localUniformsBindGroup, n.encoder.draw({
				geometry: t._geometry,
				shader: r,
				state: t.state
			});
		}
		destroy() {
			this._shader.destroy(!0), this._shader = null;
		}
	}, Rg.extension = {
		type: [d.WebGLPipesAdaptor],
		name: "mesh"
	};
})), Bg, Vg = o((() => {
	h(), mc(), Bg = class {
		constructor() {
			this._tempState = pc.for2d(), this._didUploadHash = {};
		}
		init(e) {
			e.renderer.runners.contextChange.add(this);
		}
		contextChange() {
			this._didUploadHash = {};
		}
		start(e, t, n) {
			let r = e.renderer, i = this._didUploadHash[n.uid];
			r.shader.bind(n, i), i || (this._didUploadHash[n.uid] = !0), r.shader.updateUniformGroup(r.globalUniforms.uniformGroup), r.geometry.bind(t, n.glProgram);
		}
		execute(e, t) {
			let n = e.renderer;
			this._tempState.blendMode = t.blendMode, n.state.set(this._tempState);
			let r = t.textures.textures;
			for (let e = 0; e < t.textures.count; e++) n.texture.bind(r[e], e);
			n.texture.unbindIntegerTextures(t.textures.count), n.geometry.draw(t.topology, t.size, t.start);
		}
	}, Bg.extension = {
		type: [d.WebGLPipesAdaptor],
		name: "batch"
	};
})), Hg, Ug = o((() => {
	Hg = /* @__PURE__ */ ((e) => (e[e.ELEMENT_ARRAY_BUFFER = 34963] = "ELEMENT_ARRAY_BUFFER", e[e.ARRAY_BUFFER = 34962] = "ARRAY_BUFFER", e[e.UNIFORM_BUFFER = 35345] = "UNIFORM_BUFFER", e))(Hg || {});
})), Wg, Gg = o((() => {
	Wg = class {
		constructor(e, t) {
			this.buffer = e || null, this.updateID = -1, this.byteLength = -1, this.type = t;
		}
		destroy() {
			this.buffer = null, this.updateID = -1, this.byteLength = -1, this.type = -1;
		}
	};
})), Kg, qg = o((() => {
	h(), fm(), Dc(), Ug(), Gg(), Kg = class {
		constructor(e) {
			this._boundBuffers = [], this._boundOffsets = [], this._boundSizes = [], this._renderer = e, this._managedBuffers = new dm({
				renderer: e,
				type: "resource",
				onUnload: this.onBufferUnload.bind(this),
				name: "glBuffer"
			});
		}
		destroy() {
			this._managedBuffers.destroy(), this._renderer = null, this._gl = null, this._boundBuffers.length = 0;
		}
		contextChange() {
			this._gl = this._renderer.gl, this.destroyAll(!0), this._boundBuffers.length = 0;
		}
		getGlBuffer(e) {
			return e._gcLastUsed = this._renderer.gc.now, e._gpuData[this._renderer.uid] || this.createGLBuffer(e);
		}
		bind(e) {
			let { _gl: t } = this, n = this.getGlBuffer(e);
			t.bindBuffer(n.type, n.buffer);
		}
		bindBufferBase(e, t) {
			(this._boundBuffers[t] !== e || this._boundSizes[t] !== -1) && (this._boundBuffers[t] = e, this._boundOffsets[t] = 0, this._boundSizes[t] = -1, this._gl.bindBufferBase(this._gl.UNIFORM_BUFFER, t, e.buffer));
		}
		bindBufferRange(e, t = 0, n = 0, r) {
			r ??= e.byteLength - n, (this._boundBuffers[t] !== e || this._boundOffsets[t] !== n || this._boundSizes[t] !== r) && (this._boundBuffers[t] = e, this._boundOffsets[t] = n, this._boundSizes[t] = r, this._gl.bindBufferRange(this._gl.UNIFORM_BUFFER, t, e.buffer, n, r));
		}
		updateBuffer(e) {
			let t = this.getGlBuffer(e);
			return this._upload(e, t, t.type), t;
		}
		_upload(e, t, n) {
			let { _gl: r } = this;
			if (e._updateID === t.updateID) return;
			t.updateID = e._updateID, r.bindBuffer(n, t.buffer);
			let i = e.data, a = e.descriptor.usage & Ec.STATIC ? r.STATIC_DRAW : r.DYNAMIC_DRAW;
			if (i) {
				if (t.byteLength >= i.byteLength) {
					let t = e._updateOffset / i.BYTES_PER_ELEMENT, a = (e._updateSize || i.byteLength) / i.BYTES_PER_ELEMENT;
					this._renderer.context.webGLVersion === 2 ? r.bufferSubData(n, e._updateOffset, i, t, a) : r.bufferSubData(n, e._updateOffset, a === i.length ? i : i.subarray(t, t + a));
				} else t.byteLength = i.byteLength, r.bufferData(n, i, a);
			} else t.byteLength = e.descriptor.size, r.bufferData(n, t.byteLength, a);
		}
		destroyAll(e = !1) {
			this._managedBuffers.removeAll(e);
		}
		onBufferUnload(e, t = !1) {
			e.off("update", this.updateBuffer, this), e.off("update", this._updateIndexBuffer, this);
			let n = e._gpuData[this._renderer.uid];
			n && (t || this._gl.deleteBuffer(n.buffer));
		}
		createGLBuffer(e) {
			let { _gl: t } = this, n = Hg.ARRAY_BUFFER;
			e.descriptor.usage & Ec.INDEX ? n = Hg.ELEMENT_ARRAY_BUFFER : e.descriptor.usage & Ec.UNIFORM && (n = Hg.UNIFORM_BUFFER);
			let r = new Wg(t.createBuffer(), n);
			return e._gpuData[this._renderer.uid] = r, this._managedBuffers.add(e) && (n === Hg.ELEMENT_ARRAY_BUFFER ? e.on("update", this._updateIndexBuffer, this) : e.on("update", this.updateBuffer, this)), r;
		}
		_updateIndexBuffer(e) {
			let t = this.getGlBuffer(e);
			t.byteLength < 0 || (this._renderer.context.webGLVersion === 2 ? this._upload(e, t, this._gl.COPY_WRITE_BUFFER) : (this._renderer.geometry._activeVao && this._renderer.geometry.resetState(), this._upload(e, t, t.type)));
		}
		resetState() {
			this._boundBuffers.length = 0;
		}
	}, Kg.extension = {
		type: [d.WebGLSystem],
		name: "buffer"
	};
})), Jg, Yg, Xg = o((() => {
	W(), h(), L(), Jg = class e {
		constructor(e) {
			this.supports = {
				uint32Indices: !0,
				uniformBufferObject: !0,
				vertexArrayObject: !0,
				srgbTextures: !0,
				nonPowOf2wrapping: !0,
				msaa: !0,
				nonPowOf2mipmaps: !0
			}, this._renderer = e, this.extensions = /* @__PURE__ */ Object.create(null), this.handleContextLost = this.handleContextLost.bind(this), this.handleContextRestored = this.handleContextRestored.bind(this);
		}
		get isLost() {
			return !this.gl || this.gl.isContextLost();
		}
		contextChange(e) {
			this.gl = e, this._renderer.gl = e;
		}
		init(t) {
			t = {
				...e.defaultOptions,
				...t
			};
			let n = this.multiView = t.multiView;
			if (t.context && n && (I("Renderer created with both a context and multiview enabled. Disabling multiView as both cannot work together."), n = !1), this.canvas = n ? U.get().createCanvas(this._renderer.canvas.width, this._renderer.canvas.height) : this._renderer.view.canvas, t.context) this.initFromContext(t.context);
			else {
				let e = this._renderer.background.alpha < 1, n = t.premultipliedAlpha ?? !0, r = t.antialias && !this._renderer.backBuffer.useBackBuffer;
				this.createContext(t.preferWebGLVersion, {
					alpha: e,
					premultipliedAlpha: n,
					antialias: r,
					stencil: !0,
					preserveDrawingBuffer: t.preserveDrawingBuffer,
					powerPreference: t.powerPreference ?? "default"
				});
			}
		}
		ensureCanvasSize(e) {
			if (!this.multiView) {
				e !== this.canvas && I("multiView is disabled, but targetCanvas is not the main canvas");
				return;
			}
			let { canvas: t } = this;
			(t.width < e.width || t.height < e.height) && (t.width = Math.max(e.width, e.width), t.height = Math.max(e.height, e.height));
		}
		initFromContext(e) {
			this.gl = e, this.webGLVersion = e instanceof U.get().getWebGLRenderingContext() ? 1 : 2, this.getExtensions(), this.validateContext(e), this._renderer.runners.contextChange.emit(e);
			let t = this._renderer.view.canvas;
			t.addEventListener("webglcontextlost", this.handleContextLost, !1), t.addEventListener("webglcontextrestored", this.handleContextRestored, !1);
		}
		createContext(e, t) {
			let n, r = this.canvas;
			if (e === 2 && (n = r.getContext("webgl2", t)), !n && (n = r.getContext("webgl", t), !n)) throw Error("This browser does not support WebGL. Try using the canvas renderer");
			this.gl = n, this.initFromContext(this.gl);
		}
		getExtensions() {
			let { gl: e } = this, t = {
				anisotropicFiltering: e.getExtension("EXT_texture_filter_anisotropic"),
				floatTextureLinear: e.getExtension("OES_texture_float_linear"),
				s3tc: e.getExtension("WEBGL_compressed_texture_s3tc"),
				s3tc_sRGB: e.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
				etc: e.getExtension("WEBGL_compressed_texture_etc"),
				etc1: e.getExtension("WEBGL_compressed_texture_etc1"),
				pvrtc: e.getExtension("WEBGL_compressed_texture_pvrtc") || e.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
				atc: e.getExtension("WEBGL_compressed_texture_atc"),
				astc: e.getExtension("WEBGL_compressed_texture_astc"),
				bptc: e.getExtension("EXT_texture_compression_bptc"),
				rgtc: e.getExtension("EXT_texture_compression_rgtc"),
				loseContext: e.getExtension("WEBGL_lose_context")
			};
			if (this.webGLVersion === 1) this.extensions = {
				...t,
				drawBuffers: e.getExtension("WEBGL_draw_buffers"),
				depthTexture: e.getExtension("WEBGL_depth_texture"),
				vertexArrayObject: e.getExtension("OES_vertex_array_object") || e.getExtension("MOZ_OES_vertex_array_object") || e.getExtension("WEBKIT_OES_vertex_array_object"),
				uint32ElementIndex: e.getExtension("OES_element_index_uint"),
				floatTexture: e.getExtension("OES_texture_float"),
				floatTextureLinear: e.getExtension("OES_texture_float_linear"),
				textureHalfFloat: e.getExtension("OES_texture_half_float"),
				textureHalfFloatLinear: e.getExtension("OES_texture_half_float_linear"),
				vertexAttribDivisorANGLE: e.getExtension("ANGLE_instanced_arrays"),
				srgb: e.getExtension("EXT_sRGB")
			};
			else {
				this.extensions = {
					...t,
					colorBufferFloat: e.getExtension("EXT_color_buffer_float")
				};
				let n = e.getExtension("WEBGL_provoking_vertex");
				n && n.provokingVertexWEBGL(n.FIRST_VERTEX_CONVENTION_WEBGL);
			}
		}
		handleContextLost(e) {
			e.preventDefault(), this._contextLossForced && (this._contextLossForced = !1, setTimeout(() => {
				this.gl.isContextLost() && this.extensions.loseContext?.restoreContext();
			}, 0));
		}
		handleContextRestored() {
			this.getExtensions(), this._renderer.runners.contextChange.emit(this.gl);
		}
		destroy() {
			let e = this._renderer.view.canvas;
			this._renderer = null, e.removeEventListener("webglcontextlost", this.handleContextLost), e.removeEventListener("webglcontextrestored", this.handleContextRestored), this.gl.useProgram(null), this.extensions.loseContext?.loseContext();
		}
		forceContextLoss() {
			this.extensions.loseContext?.loseContext(), this._contextLossForced = !0;
		}
		validateContext(e) {
			let t = e.getContextAttributes();
			t && !t.stencil && I("Provided WebGL context does not have a stencil buffer, masks may not render correctly");
			let n = this.supports, r = this.webGLVersion === 2, i = this.extensions;
			n.uint32Indices = r || !!i.uint32ElementIndex, n.uniformBufferObject = r, n.vertexArrayObject = r || !!i.vertexArrayObject, n.srgbTextures = r || !!i.srgb, n.nonPowOf2wrapping = r, n.nonPowOf2mipmaps = r, n.msaa = r, n.uint32Indices || I("Provided WebGL context does not support 32 index buffer, large scenes may not render correctly");
		}
	}, Jg.extension = {
		type: [d.WebGLSystem],
		name: "context"
	}, Jg.defaultOptions = {
		context: null,
		premultipliedAlpha: !0,
		preserveDrawingBuffer: !1,
		powerPreference: void 0,
		preferWebGLVersion: 2,
		multiView: !1
	}, Yg = Jg;
})), Zg, Qg, K, $g = o((() => {
	Zg = /* @__PURE__ */ ((e) => (e[e.RGBA = 6408] = "RGBA", e[e.RGB = 6407] = "RGB", e[e.RG = 33319] = "RG", e[e.RED = 6403] = "RED", e[e.RGBA_INTEGER = 36249] = "RGBA_INTEGER", e[e.RGB_INTEGER = 36248] = "RGB_INTEGER", e[e.RG_INTEGER = 33320] = "RG_INTEGER", e[e.RED_INTEGER = 36244] = "RED_INTEGER", e[e.ALPHA = 6406] = "ALPHA", e[e.LUMINANCE = 6409] = "LUMINANCE", e[e.LUMINANCE_ALPHA = 6410] = "LUMINANCE_ALPHA", e[e.DEPTH_COMPONENT = 6402] = "DEPTH_COMPONENT", e[e.DEPTH_STENCIL = 34041] = "DEPTH_STENCIL", e))(Zg || {}), Qg = /* @__PURE__ */ ((e) => (e[e.TEXTURE_2D = 3553] = "TEXTURE_2D", e[e.TEXTURE_CUBE_MAP = 34067] = "TEXTURE_CUBE_MAP", e[e.TEXTURE_2D_ARRAY = 35866] = "TEXTURE_2D_ARRAY", e[e.TEXTURE_3D = 32879] = "TEXTURE_3D", e[e.TEXTURE_CUBE_MAP_POSITIVE_X = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X", e[e.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X", e[e.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y", e[e.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y", e[e.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z", e[e.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z", e))(Qg || {}), K = /* @__PURE__ */ ((e) => (e[e.UNSIGNED_BYTE = 5121] = "UNSIGNED_BYTE", e[e.UNSIGNED_SHORT = 5123] = "UNSIGNED_SHORT", e[e.UNSIGNED_SHORT_5_6_5 = 33635] = "UNSIGNED_SHORT_5_6_5", e[e.UNSIGNED_SHORT_4_4_4_4 = 32819] = "UNSIGNED_SHORT_4_4_4_4", e[e.UNSIGNED_SHORT_5_5_5_1 = 32820] = "UNSIGNED_SHORT_5_5_5_1", e[e.UNSIGNED_INT = 5125] = "UNSIGNED_INT", e[e.UNSIGNED_INT_10F_11F_11F_REV = 35899] = "UNSIGNED_INT_10F_11F_11F_REV", e[e.UNSIGNED_INT_2_10_10_10_REV = 33640] = "UNSIGNED_INT_2_10_10_10_REV", e[e.UNSIGNED_INT_24_8 = 34042] = "UNSIGNED_INT_24_8", e[e.UNSIGNED_INT_5_9_9_9_REV = 35902] = "UNSIGNED_INT_5_9_9_9_REV", e[e.BYTE = 5120] = "BYTE", e[e.SHORT = 5122] = "SHORT", e[e.INT = 5124] = "INT", e[e.FLOAT = 5126] = "FLOAT", e[e.FLOAT_32_UNSIGNED_INT_24_8_REV = 36269] = "FLOAT_32_UNSIGNED_INT_24_8_REV", e[e.HALF_FLOAT = 36193] = "HALF_FLOAT", e))(K || {});
}));
// node_modules/pixi.js/lib/rendering/renderers/gl/geometry/utils/getGlTypeFromFormat.mjs
function e_(e) {
	return t_[e] ?? t_.float32;
}
var t_, n_ = o((() => {
	$g(), t_ = {
		uint8x2: K.UNSIGNED_BYTE,
		uint8x4: K.UNSIGNED_BYTE,
		sint8x2: K.BYTE,
		sint8x4: K.BYTE,
		unorm8x2: K.UNSIGNED_BYTE,
		unorm8x4: K.UNSIGNED_BYTE,
		snorm8x2: K.BYTE,
		snorm8x4: K.BYTE,
		uint16x2: K.UNSIGNED_SHORT,
		uint16x4: K.UNSIGNED_SHORT,
		sint16x2: K.SHORT,
		sint16x4: K.SHORT,
		unorm16x2: K.UNSIGNED_SHORT,
		unorm16x4: K.UNSIGNED_SHORT,
		snorm16x2: K.SHORT,
		snorm16x4: K.SHORT,
		float16x2: K.HALF_FLOAT,
		float16x4: K.HALF_FLOAT,
		float32: K.FLOAT,
		float32x2: K.FLOAT,
		float32x3: K.FLOAT,
		float32x4: K.FLOAT,
		uint32: K.UNSIGNED_INT,
		uint32x2: K.UNSIGNED_INT,
		uint32x3: K.UNSIGNED_INT,
		uint32x4: K.UNSIGNED_INT,
		sint32: K.INT,
		sint32x2: K.INT,
		sint32x3: K.INT,
		sint32x4: K.INT
	};
})), r_, i_, a_, o_ = o((() => {
	h(), fm(), gs(), oh(), n_(), r_ = {
		"point-list": 0,
		"line-list": 1,
		"line-strip": 3,
		"triangle-list": 4,
		"triangle-strip": 5
	}, i_ = class {
		constructor() {
			this.vaoCache = /* @__PURE__ */ Object.create(null);
		}
		destroy() {
			this.vaoCache = /* @__PURE__ */ Object.create(null);
		}
	}, a_ = class {
		constructor(e) {
			this._renderer = e, this._activeGeometry = null, this._activeVao = null, this.hasVao = !0, this.hasInstance = !0, this._managedGeometries = new dm({
				renderer: e,
				type: "resource",
				onUnload: this.onGeometryUnload.bind(this),
				name: "glGeometry"
			});
		}
		contextChange() {
			let e = this.gl = this._renderer.gl;
			if (!this._renderer.context.supports.vertexArrayObject) throw Error("[PixiJS] Vertex Array Objects are not supported on this device");
			this.destroyAll(!0);
			let t = this._renderer.context.extensions.vertexArrayObject;
			t && (e.createVertexArray = () => t.createVertexArrayOES(), e.bindVertexArray = (e) => t.bindVertexArrayOES(e), e.deleteVertexArray = (e) => t.deleteVertexArrayOES(e));
			let n = this._renderer.context.extensions.vertexAttribDivisorANGLE;
			n && (e.drawArraysInstanced = (e, t, r, i) => {
				n.drawArraysInstancedANGLE(e, t, r, i);
			}, e.drawElementsInstanced = (e, t, r, i, a) => {
				n.drawElementsInstancedANGLE(e, t, r, i, a);
			}, e.vertexAttribDivisor = (e, t) => n.vertexAttribDivisorANGLE(e, t)), this._activeGeometry = null, this._activeVao = null;
		}
		bind(e, t) {
			let n = this.gl;
			this._activeGeometry = e;
			let r = this.getVao(e, t);
			this._activeVao !== r && (this._activeVao = r, n.bindVertexArray(r)), this.updateBuffers();
		}
		resetState() {
			this.unbind();
		}
		updateBuffers() {
			let e = this._activeGeometry, t = this._renderer.buffer;
			for (let n = 0; n < e.buffers.length; n++) {
				let r = e.buffers[n];
				t.updateBuffer(r);
			}
			e._gcLastUsed = this._renderer.gc.now;
		}
		checkCompatibility(e, t) {
			let n = e.attributes, r = t._attributeData;
			for (let e in r) if (!n[e]) throw Error(`shader and geometry incompatible, geometry missing the "${e}" attribute`);
		}
		getSignature(e, t) {
			let n = e.attributes, r = t._attributeData, i = ["g", e.uid];
			for (let e in n) r[e] && i.push(e, r[e].location);
			return i.join("-");
		}
		getVao(e, t) {
			return e._gpuData[this._renderer.uid]?.vaoCache[t._key] || this.initGeometryVao(e, t);
		}
		initGeometryVao(e, t, n = !0) {
			let r = this._renderer.gl, i = this._renderer.buffer;
			this._renderer.shader._getProgramData(t), this.checkCompatibility(e, t);
			let a = this.getSignature(e, t), o = e._gpuData[this._renderer.uid];
			o || (o = new i_(), e._gpuData[this._renderer.uid] = o, this._managedGeometries.add(e));
			let s = o.vaoCache, c = s[a];
			if (c) return s[t._key] = c, c;
			ih(e, t._attributeData);
			let l = e.buffers;
			c = r.createVertexArray(), r.bindVertexArray(c);
			for (let e = 0; e < l.length; e++) {
				let t = l[e];
				i.bind(t);
			}
			return this.activateVao(e, t), s[t._key] = c, s[a] = c, r.bindVertexArray(null), c;
		}
		onGeometryUnload(e, t = !1) {
			let n = e._gpuData[this._renderer.uid];
			if (!n) return;
			let r = n.vaoCache;
			if (!t) for (let e in r) this._activeVao === r[e] && this.resetState(), this.gl.deleteVertexArray(r[e]);
		}
		destroyAll(e = !1) {
			this._managedGeometries.removeAll(e);
		}
		activateVao(e, t) {
			let n = this._renderer.gl, r = this._renderer.buffer, i = e.attributes;
			e.indexBuffer && r.bind(e.indexBuffer);
			let a = null;
			for (let e in i) {
				let o = i[e], s = o.buffer, c = r.getGlBuffer(s), l = t._attributeData[e];
				if (l) {
					a !== c && (r.bind(s), a = c);
					let e = l.location;
					n.enableVertexAttribArray(e);
					let t = ms(o.format), i = e_(o.format);
					if (l.format?.substring(1, 4) === "int" ? n.vertexAttribIPointer(e, t.size, i, o.stride, o.offset) : n.vertexAttribPointer(e, t.size, i, t.normalised, o.stride, o.offset), o.instance) {
						if (this.hasInstance) {
							let t = o.divisor ?? 1;
							n.vertexAttribDivisor(e, t);
						} else throw Error("geometry error, GPU Instancing is not supported on this device");
					}
				}
			}
		}
		draw(e, t, n, r) {
			let { gl: i } = this._renderer, a = this._activeGeometry, o = r_[e || a.topology];
			if (r ??= a.instanceCount, a.indexBuffer) {
				let e = a.indexBuffer.data.BYTES_PER_ELEMENT, s = e === 2 ? i.UNSIGNED_SHORT : i.UNSIGNED_INT, c = t || a.indexCount || a.indexBuffer.data.length, l = (n || 0) * e;
				r === 1 ? i.drawElements(o, c, s, l) : i.drawElementsInstanced(o, c, s, l, r);
			} else r === 1 ? i.drawArrays(o, n || 0, t || a.vertexCount) : i.drawArraysInstanced(o, n || 0, t || a.vertexCount, r);
			return this;
		}
		unbind() {
			this.gl.bindVertexArray(null), this._activeVao = null, this._activeGeometry = null;
		}
		destroy() {
			this._managedGeometries.destroy(), this._renderer = null, this.gl = null, this._activeVao = null, this._activeGeometry = null;
		}
	}, a_.extension = {
		type: [d.WebGLSystem],
		name: "geometry"
	};
})), s_, c_, l_, u_ = o((() => {
	h(), L(), Ic(), rc(), mc(), wn(), V(), ps(), s_ = new Fc({ attributes: { aPosition: [
		-1,
		-1,
		3,
		-1,
		-1,
		3
	] } }), c_ = class e {
		constructor(e) {
			this.useBackBuffer = !1, this._useBackBufferThisRender = !1, this._renderer = e;
		}
		init(t = {}) {
			let { useBackBuffer: n, antialias: r } = {
				...e.defaultOptions,
				...t
			};
			this.useBackBuffer = n, this._antialias = r, this._renderer.context.supports.msaa || (I("antialiasing, is not supported on when using the back buffer"), this._antialias = !1), this._state = pc.for2d();
			let i = new fs({
				vertex: "\n                attribute vec2 aPosition;\n                out vec2 vUv;\n\n                void main() {\n                    gl_Position = vec4(aPosition, 0.0, 1.0);\n\n                    vUv = (aPosition + 1.0) / 2.0;\n\n                    // flip dem UVs\n                    vUv.y = 1.0 - vUv.y;\n                }",
				fragment: "\n                in vec2 vUv;\n                out vec4 finalColor;\n\n                uniform sampler2D uTexture;\n\n                void main() {\n                    finalColor = texture(uTexture, vUv);\n                }",
				name: "big-triangle"
			});
			this._bigTriangleShader = new nc({
				glProgram: i,
				resources: { uTexture: B.WHITE.source }
			});
		}
		renderStart(e) {
			let t = this._renderer.renderTarget.getRenderTarget(e.target);
			if (this._useBackBufferThisRender = this.useBackBuffer && !!t.isRoot, this._useBackBufferThisRender) {
				let t = this._renderer.renderTarget.getRenderTarget(e.target);
				this._targetTexture = t.colorTexture, e.target = this._getBackBufferTexture(t.colorTexture);
			}
		}
		renderEnd() {
			this._presentBackBuffer();
		}
		_presentBackBuffer() {
			let e = this._renderer;
			e.renderTarget.finishRenderPass(), this._useBackBufferThisRender && (e.renderTarget.bind({
				target: this._targetTexture,
				clear: !1
			}), this._bigTriangleShader.resources.uTexture = this._backBufferTexture.source, e.encoder.draw({
				geometry: s_,
				shader: this._bigTriangleShader,
				state: this._state
			}));
		}
		_getBackBufferTexture(e) {
			return this._backBufferTexture = this._backBufferTexture || new B({ source: new Cn({
				width: e.width,
				height: e.height,
				resolution: e._resolution,
				antialias: this._antialias
			}) }), this._backBufferTexture.source.resize(e.width, e.height, e._resolution), this._backBufferTexture;
		}
		destroy() {
			this._backBufferTexture &&= (this._backBufferTexture.destroy(), null);
		}
	}, c_.extension = {
		type: [d.WebGLSystem],
		name: "backBuffer",
		priority: 1
	}, c_.defaultOptions = { useBackBuffer: !1 }, l_ = c_;
})), d_, f_ = o((() => {
	h(), d_ = class {
		constructor(e) {
			this._colorMaskCache = 15, this._renderer = e;
		}
		setMask(e) {
			this._colorMaskCache !== e && (this._colorMaskCache = e, this._renderer.gl.colorMask(!!(e & 8), !!(e & 4), !!(e & 2), !!(e & 1)));
		}
	}, d_.extension = {
		type: [d.WebGLSystem],
		name: "colorMask"
	};
})), p_, m_ = o((() => {
	h(), p_ = class {
		constructor(e) {
			this.commandFinished = Promise.resolve(), this._renderer = e;
		}
		setGeometry(e, t) {
			this._renderer.geometry.bind(e, t.glProgram);
		}
		finishRenderPass() {}
		draw(e) {
			let t = this._renderer, { geometry: n, shader: r, state: i, skipSync: a, topology: o, size: s, start: c, instanceCount: l } = e;
			t.shader.bind(r, a), t.geometry.bind(n, t.shader._activeProgram), i && t.state.set(i), t.geometry.draw(o, s, c, l ?? n.instanceCount);
		}
		destroy() {
			this._renderer = null;
		}
	}, p_.extension = {
		type: [d.WebGLSystem],
		name: "encoder"
	};
})), h_, g_ = o((() => {
	h(), mf(), h_ = class {
		constructor(e) {
			this._renderer = e;
		}
		contextChange() {
			let e = this._renderer.gl;
			this.maxTextures = e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS), this.maxBatchableTextures = ff(this.maxTextures, e);
			let t = this._renderer.context.webGLVersion === 2;
			this.maxUniformBindings = t ? e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS) : 0, this.minUniformBufferOffsetAlignment = t ? e.getParameter(e.UNIFORM_BUFFER_OFFSET_ALIGNMENT) : 0;
		}
		destroy() {}
	}, h_.extension = {
		type: [d.WebGLSystem],
		name: "limits"
	};
})), __, v_ = o((() => {
	h(), ch(), cf(), __ = class {
		constructor(e) {
			this._stencilCache = {
				enabled: !1,
				stencilReference: 0,
				stencilMode: sf.NONE
			}, this._renderer = e, e.renderTarget.onRenderTargetChange.add(this);
		}
		contextChange(e) {
			this._gl = e, this._comparisonFuncMapping = {
				always: e.ALWAYS,
				never: e.NEVER,
				equal: e.EQUAL,
				"not-equal": e.NOTEQUAL,
				less: e.LESS,
				"less-equal": e.LEQUAL,
				greater: e.GREATER,
				"greater-equal": e.GEQUAL
			}, this._stencilOpsMapping = {
				keep: e.KEEP,
				zero: e.ZERO,
				replace: e.REPLACE,
				invert: e.INVERT,
				"increment-clamp": e.INCR,
				"decrement-clamp": e.DECR,
				"increment-wrap": e.INCR_WRAP,
				"decrement-wrap": e.DECR_WRAP
			}, this._activeGpuRenderTarget = null, this.resetState();
		}
		onRenderTargetChange(e) {
			if (this._activeRenderTarget === e) return;
			this._activeRenderTarget = e;
			let t = this._renderer.renderTarget.getGpuRenderTarget(e);
			this._activeGpuRenderTarget = t, this.setStencilMode(t.stencilMode, t.stencilReference);
		}
		resetState() {
			this._stencilCache.enabled = !1, this._stencilCache.stencilMode = sf.NONE, this._stencilCache.stencilReference = 0;
		}
		setStencilMode(e, t) {
			let n = this._activeGpuRenderTarget ??= this._renderer.renderTarget.getGpuRenderTarget(this._activeRenderTarget), r = this._gl, i = sh[e], a = this._stencilCache;
			n.stencilMode = e, n.stencilReference = t, e === sf.DISABLED ? this._stencilCache.enabled && (this._stencilCache.enabled = !1, r.disable(r.STENCIL_TEST)) : (this._stencilCache.enabled || (this._stencilCache.enabled = !0, r.enable(r.STENCIL_TEST)), (e !== a.stencilMode || a.stencilReference !== t) && (a.stencilMode = e, a.stencilReference = t, r.stencilFunc(this._comparisonFuncMapping[i.stencilBack.compare], t, 255), r.stencilOp(r.KEEP, r.KEEP, this._stencilOpsMapping[i.stencilBack.passOp])));
		}
		destroy() {
			this._renderer.renderTarget.onRenderTargetChange.remove(this), this._renderer = null, this._gl = null, this._activeRenderTarget = null, this._activeGpuRenderTarget = null;
		}
	}, __.extension = {
		type: [d.WebGLSystem],
		name: "stencil"
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/gl/shader/utils/createUboElementsSTD40.mjs
function y_(e) {
	let t = e.map((e) => ({
		data: e,
		offset: 0,
		size: 0
	})), n = 0, r = 0;
	for (let e = 0; e < t.length; e++) {
		let i = t[e];
		if (n = b_[i.data.type], !n) throw Error(`Unknown type ${i.data.type}`);
		i.data.size > 1 && (n = Math.max(n, 16) * i.data.size);
		let a = n === 12 ? 16 : n;
		i.size = n;
		let o = r % 16;
		o > 0 && 16 - o < a ? r += (16 - o) % 16 : r += (n - o % n) % n, i.offset = r, r += n;
	}
	return r = Math.ceil(r / 16) * 16, {
		uboElements: t,
		size: r
	};
}
var b_, x_ = o((() => {
	b_ = {
		f32: 4,
		i32: 4,
		"vec2<f32>": 8,
		"vec3<f32>": 12,
		"vec4<f32>": 16,
		"vec2<i32>": 8,
		"vec3<i32>": 12,
		"vec4<i32>": 16,
		u32: 4,
		"vec2<u32>": 8,
		"vec3<u32>": 12,
		"vec4<u32>": 16,
		"mat2x2<f32>": 32,
		"mat3x3<f32>": 48,
		"mat4x4<f32>": 64
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/gl/shader/utils/generateArraySyncSTD40.mjs
function S_(e, t) {
	let n = Math.max(b_[e.data.type] / 16, 1), r = e.data.value.length / e.data.size, i = (4 - r % 4) % 4, a = e.data.type.indexOf("i32") >= 0 ? "dataInt32" : "data";
	return `
        v = uv.${e.data.name};
        offset += ${t};

        arrayOffset = offset;

        t = 0;

        for(var i=0; i < ${e.data.size * n}; i++)
        {
            for(var j = 0; j < ${r}; j++)
            {
                ${a}[arrayOffset++] = v[t++];
            }
            ${i === 0 ? "" : `arrayOffset += ${i};`}
        }
    `;
}
var C_ = o((() => {
	x_();
}));
// node_modules/pixi.js/lib/rendering/renderers/gl/shader/utils/createUboSyncSTD40.mjs
function w_(e) {
	return zm(e, Hm, S_);
}
var T_ = o((() => {
	Bm(), Wm(), C_();
})), E_, D_ = o((() => {
	h(), Nm(), x_(), T_(), E_ = class extends Mm {
		constructor() {
			super({
				createUboElements: y_,
				generateUboSync: w_
			});
		}
	}, E_.extension = {
		type: [d.WebGLSystem],
		name: "ubo"
	};
})), O_, k_ = o((() => {
	cf(), O_ = class {
		constructor() {
			this.width = -1, this.height = -1, this.msaa = !1, this._attachedMipLevel = 0, this._attachedLayer = 0, this._drawBuffersMask = -1, this._attachedDepthStencilRenderBuffer = null, this.stencilMode = sf.DISABLED, this.stencilReference = 0, this.maskStackIndex = 0;
		}
	};
})), A_, j_ = o((() => {
	wt(), L(), Aa(), Ln(), eu(), k_(), A_ = class {
		constructor() {
			this._clearColorCache = [
				0,
				0,
				0,
				0
			], this._viewPortCache = new R(), this._boundFramebuffer = void 0, this._canvasMultisampled = !1, this._clearUint = /* @__PURE__ */ new Uint32Array(4), this._clearInt = /* @__PURE__ */ new Int32Array(4);
		}
		init(e, t) {
			this._renderer = e, this._renderTargetSystem = t, e.runners.contextChange.add(this);
		}
		contextChange() {
			this._clearColorCache = [
				0,
				0,
				0,
				0
			], this._viewPortCache = new R(), this._boundFramebuffer = void 0;
			let e = this._renderer.gl;
			this._canvasMultisampled = !!e.getContextAttributes()?.antialias, this._drawBuffersCache = [];
		}
		copyToTexture(e, t, n, r, i) {
			let a = this._renderTargetSystem, o = this._renderer, s = a.getGpuRenderTarget(e), c = o.gl;
			return this.finishRenderPass(e), c.bindFramebuffer(c.FRAMEBUFFER, s.resolveTargetFramebuffer), this._boundFramebuffer = s.resolveTargetFramebuffer, o.texture.bind(t, 0), c.copyTexSubImage2D(c.TEXTURE_2D, 0, i.x, i.y, n.x, n.y, r.width, r.height), t;
		}
		copyDepthTexture(e, t, n, r, i) {
			let a = this._renderTargetSystem, o = this._renderer.gl;
			this.finishRenderPass(e);
			let s = a.getRenderTarget(t), c = a.getGpuRenderTarget(e), l = a.getGpuRenderTarget(s), u = c.framebuffer;
			(c.msaa || e.isRoot && this._canvasMultisampled) && (n.x !== i.x || n.y !== i.y) && (c.resolveTargetFramebuffer ??= o.createFramebuffer(), o.bindFramebuffer(o.FRAMEBUFFER, c.resolveTargetFramebuffer), this._attachDepthStencilTexture(e, 0, 0), o.bindFramebuffer(o.READ_FRAMEBUFFER, c.framebuffer), o.blitFramebuffer(n.x, n.y, n.x + r.width, n.y + r.height, n.x, n.y, n.x + r.width, n.y + r.height, o.DEPTH_BUFFER_BIT, o.NEAREST), u = c.resolveTargetFramebuffer), o.bindFramebuffer(o.READ_FRAMEBUFFER, u), o.bindFramebuffer(o.DRAW_FRAMEBUFFER, l.framebuffer), this._boundFramebuffer = void 0, o.blitFramebuffer(n.x, n.y, n.x + r.width, n.y + r.height, i.x, i.y, i.x + r.width, i.y + r.height, o.DEPTH_BUFFER_BIT, o.NEAREST);
		}
		startRenderPass(e, t = !0, n, r, i = 0, a = 0) {
			let o = this._renderTargetSystem.getGpuRenderTarget(e);
			if (a !== 0 && this._renderer.context.webGLVersion < 2) throw Error("[RenderTargetSystem] Rendering to array layers requires WebGL2.");
			if (i > 0) {
				if (o.msaa) throw Error("[RenderTargetSystem] Rendering to mip levels is not supported with MSAA render targets.");
				if (this._renderer.context.webGLVersion < 2) throw Error("[RenderTargetSystem] Rendering to mip levels requires WebGL2.");
			}
			e.colorAttachments.forEach((e) => {
				this._renderer.texture.unbind(e.texture);
			});
			let s = this._renderer.gl;
			this.bindFramebuffer(o.framebuffer), !e.isRoot && e.colorAttachments.length > 0 && (o._attachedMipLevel !== i || o._attachedLayer !== a) && (e.colorAttachments.forEach((e, t) => {
				let n = e.texture, r = this._renderer.texture.getGlSource(n);
				if (r.target === s.TEXTURE_2D) {
					if (a !== 0) throw Error("[RenderTargetSystem] layer must be 0 when rendering to 2D textures in WebGL.");
					s.framebufferTexture2D(s.FRAMEBUFFER, s.COLOR_ATTACHMENT0 + t, s.TEXTURE_2D, r.texture, i);
				} else if (r.target === s.TEXTURE_2D_ARRAY || r.target === s.TEXTURE_3D) s.framebufferTextureLayer(s.FRAMEBUFFER, s.COLOR_ATTACHMENT0 + t, r.texture, i, a);
				else if (r.target === s.TEXTURE_CUBE_MAP) {
					if (a < 0 || a > 5) throw Error("[RenderTargetSystem] Cube map layer must be between 0 and 5.");
					s.framebufferTexture2D(s.FRAMEBUFFER, s.COLOR_ATTACHMENT0 + t, s.TEXTURE_CUBE_MAP_POSITIVE_X + a, r.texture, i);
				} else throw Error("[RenderTargetSystem] Unsupported texture target for render-to-layer in WebGL.");
			}), o._attachedMipLevel = i, o._attachedLayer = a), o.framebuffer && (e.depthStencilAttachment ? o.msaa ? this._attachMsaaDepthStencil(e, o) : this._attachDepthStencilTexture(e, i, a) : !o.depthStencilRenderBuffer && (e.stencil || e.depth) && this._initStencil(o));
			let c = e.colorAttachments.length;
			c > 1 && o._drawBuffersMask === -1 && this._setDrawBuffers(e, (1 << c) - 1);
			let l = r.y;
			e.isRoot && (l = e.pixelHeight - r.height - r.y);
			let u = this._viewPortCache;
			(u.x !== r.x || u.y !== l || u.width !== r.width || u.height !== r.height) && (u.x = r.x, u.y = l, u.width = r.width, u.height = r.height, s.viewport(r.x, l, r.width, r.height)), this.clear(e, t, n);
			let d = this._renderer.shader._activeProgram;
			c > 1 && d && this.setFragmentOutputs(d);
		}
		setFragmentOutputs(e) {
			let t = this._renderTargetSystem.renderTarget, n = t?.colorAttachments.length ?? 0;
			if (n < 2 || this._renderer.context.webGLVersion === 1) return;
			let r = (1 << n) - 1;
			this._setDrawBuffers(t, (e.fragmentOutputMask ?? r) & r);
		}
		_setDrawBuffers(e, t) {
			if (e.colorAttachments.length < 2) return;
			let n = this._renderTargetSystem.getGpuRenderTarget(e);
			if (n.framebuffer !== this._boundFramebuffer || n._drawBuffersMask === t) return;
			n._drawBuffersMask = t;
			let r = this._getDrawBuffers(t);
			if (this._renderer.context.webGLVersion === 1) {
				let e = this._renderer.context.extensions.drawBuffers;
				e ? e.drawBuffersWEBGL(r) : I("[RenderTexture] This WebGL1 context does not support rendering to multiple targets");
			} else this._renderer.gl.drawBuffers(r);
		}
		_getDrawBuffers(e) {
			let t = this._drawBuffersCache[e];
			if (!t) {
				let n = this._renderer.gl;
				t = this._drawBuffersCache[e] = [];
				for (let r = 0; e >> r > 0; r++) t[r] = e & 1 << r ? n.COLOR_ATTACHMENT0 + r : n.NONE;
				t.length === 0 && (t[0] = n.NONE);
			}
			return t;
		}
		finishRenderPass(e) {
			let t = this._renderTargetSystem.getGpuRenderTarget(e);
			if (!t.msaa || e.colorAttachments.length === 0) return;
			let n = this._renderer.gl;
			n.bindFramebuffer(n.FRAMEBUFFER, t.resolveTargetFramebuffer), n.bindFramebuffer(n.READ_FRAMEBUFFER, t.framebuffer);
			let r = e.colorAttachments.length;
			if (r === 1) n.blitFramebuffer(0, 0, t.width, t.height, 0, 0, t.width, t.height, n.COLOR_BUFFER_BIT, n.NEAREST);
			else {
				for (let e = 0; e < r; e++) n.readBuffer(n.COLOR_ATTACHMENT0 + e), n.drawBuffers(this._getDrawBuffers(1 << e)), n.blitFramebuffer(0, 0, t.width, t.height, 0, 0, t.width, t.height, n.COLOR_BUFFER_BIT, n.NEAREST);
				n.readBuffer(n.COLOR_ATTACHMENT0), n.drawBuffers(this._getDrawBuffers(1));
			}
			n.bindFramebuffer(n.FRAMEBUFFER, t.framebuffer), this._boundFramebuffer = t.framebuffer;
		}
		initGpuRenderTarget(e) {
			let t = this._renderer.gl, n = new O_();
			n._attachedMipLevel = 0, n._attachedLayer = 0;
			let r = e.colorTexture;
			return r instanceof ka ? (this._renderer.context.ensureCanvasSize(r.resource), n.framebuffer = null, n) : (n.width = e.pixelWidth, n.height = e.pixelHeight, e.colorAttachments.length === 0 ? this._initDepth(e, n) : this._initColor(e, n), e.depthStencilAttachment && !n.msaa && this._attachDepthStencilTexture(e, 0, 0), t.bindFramebuffer(t.FRAMEBUFFER, null), this._boundFramebuffer = null, n);
		}
		destroyGpuRenderTarget(e) {
			let t = this._renderer.gl;
			e.framebuffer &&= (t.deleteFramebuffer(e.framebuffer), null), e.resolveTargetFramebuffer &&= (t.deleteFramebuffer(e.resolveTargetFramebuffer), null), e.depthStencilRenderBuffer &&= (t.deleteRenderbuffer(e.depthStencilRenderBuffer), null);
		}
		clear(e, t, n, r, i = 0, a = 0) {
			if (a !== 0) throw Error("[RenderTargetSystem] Clearing array layers is not supported in WebGL renderer.");
			typeof t == "boolean" && (t = t ? $l.ALL : $l.NONE);
			let o = e.colorAttachments, s = 0;
			if (t & $l.COLOR) for (let e = 0; e < o.length; e++) o[e].loadOp !== "load" && (s |= 1 << e);
			if (s || (t &= ~$l.COLOR), !t) return;
			let c = this._renderer.gl, l = !!(t & $l.DEPTH) && !this._renderer.state.depthMaskEnabled;
			if (l && c.depthMask(!0), t & $l.COLOR) {
				let r = this._renderTargetSystem.getGpuRenderTarget(e);
				if (this._renderer.context.webGLVersion === 2 && (o.length > 1 || In(o[0].texture.format)) && r.framebuffer === this._boundFramebuffer) {
					let i = r._drawBuffersMask;
					this._setDrawBuffers(e, (1 << o.length) - 1), this._clearEachAttachment(e, s, n), i !== -1 && this._setDrawBuffers(e, i), t &= ~$l.COLOR;
				} else {
					let e = o[0].clearValue ?? n ?? this._renderTargetSystem.defaultClearColor, t = this._clearColorCache;
					(t[0] !== e[0] || t[1] !== e[1] || t[2] !== e[2] || t[3] !== e[3]) && (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], c.clearColor(e[0], e[1], e[2], e[3]));
				}
			}
			t && c.clear(t), l && c.depthMask(!1);
		}
		_clearEachAttachment(e, t, n) {
			let r = this._renderer.gl, i = e.colorAttachments, a = n ?? this._renderTargetSystem.defaultClearColor;
			for (let e = 0; e < i.length; e++) {
				if (!(t & 1 << e)) continue;
				let n = i[e].texture.format, o = i[e].clearValue ?? a;
				n.endsWith("uint") ? (this._clearUint.set(o), r.clearBufferuiv(r.COLOR, e, this._clearUint)) : n.endsWith("sint") ? (this._clearInt.set(o), r.clearBufferiv(r.COLOR, e, this._clearInt)) : r.clearBufferfv(r.COLOR, e, o);
			}
		}
		resizeGpuRenderTarget(e) {
			if (e.isRoot) return;
			let t = this._renderTargetSystem.getGpuRenderTarget(e);
			t.width = e.pixelWidth, t.height = e.pixelHeight, e.colorAttachments.length > 0 && this._resizeColor(e, t), t.depthStencilRenderBuffer && this._resizeStencil(t), this._boundFramebuffer = void 0;
		}
		_initColor(e, t) {
			let n = this._renderer, r = n.gl, i = r.createFramebuffer();
			t.resolveTargetFramebuffer = i, r.bindFramebuffer(r.FRAMEBUFFER, i), e.colorAttachments.forEach((e, i) => {
				let a = e.texture;
				a.antialias && (n.context.supports.msaa ? t.msaa = !0 : I("[RenderTexture] Antialiasing on textures is not supported in WebGL1")), n.texture.bindSource(a, 0);
				let o = n.texture.getGlSource(a), s = o.texture;
				if (o.target === r.TEXTURE_2D) r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0 + i, r.TEXTURE_2D, s, 0);
				else if (o.target === r.TEXTURE_2D_ARRAY || o.target === r.TEXTURE_3D) r.framebufferTextureLayer(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0 + i, s, 0, 0);
				else if (o.target === r.TEXTURE_CUBE_MAP) r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0 + i, r.TEXTURE_CUBE_MAP_POSITIVE_X, s, 0);
				else throw Error("[RenderTargetSystem] Unsupported texture target for framebuffer attachment.");
			}), t.framebuffer = t.msaa ? r.createFramebuffer() : i, this._resizeColor(e, t);
		}
		_initDepth(e, t) {
			let n = this._renderer;
			if (n.context.webGLVersion < 2) throw Error("[RenderTargetSystem] Depth-only render targets require WebGL2.");
			let r = n.gl, i = r.createFramebuffer();
			t.resolveTargetFramebuffer = i, t.framebuffer = i, r.bindFramebuffer(r.FRAMEBUFFER, i), r.drawBuffers([r.NONE]), r.readBuffer(r.NONE);
		}
		_resizeColor(e, t) {
			let n = e.colorAttachments[0].texture;
			if (t._attachedMipLevel = 0, t._attachedLayer = 0, e.colorAttachments.forEach((e, t) => {
				t !== 0 && e.texture.resize(n.width, n.height, n._resolution);
			}), t.msaa) {
				let n = this._renderer, r = n.gl;
				r.bindFramebuffer(r.FRAMEBUFFER, t.framebuffer), e.colorAttachments.forEach((e, t) => {
					r.framebufferRenderbuffer(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0 + t, r.RENDERBUFFER, n.texture.getMsaaRenderBuffer(e.texture));
				});
			}
		}
		_attachMsaaDepthStencil(e, t) {
			let n = this._renderer.gl, r = this._renderer.texture, i = e.depthStencilAttachment.texture, a = t.depthStencilRenderBuffer;
			if (a) {
				let e = r.getGlSource(i);
				!e.msaaRenderBuffer && e.internalFormat === n.DEPTH24_STENCIL8 ? (e.msaaRenderBuffer = a, e.msaaWidth = t.width, e.msaaHeight = t.height, t._attachedDepthStencilRenderBuffer = a) : n.deleteRenderbuffer(a), t.depthStencilRenderBuffer = null;
			}
			let o = r.getMsaaRenderBuffer(i);
			t._attachedDepthStencilRenderBuffer !== o && (t._attachedDepthStencilRenderBuffer = o, n.framebufferRenderbuffer(n.FRAMEBUFFER, this._getDepthStencilAttachmentPoint(e), n.RENDERBUFFER, o));
		}
		_attachDepthStencilTexture(e, t, n) {
			let r = this._renderer, i = r.gl, a = e.depthStencilAttachment.texture, o = r.texture.getGlSource(a), s = o.texture, c = this._getDepthStencilAttachmentPoint(e);
			o.target === i.TEXTURE_2D ? i.framebufferTexture2D(i.FRAMEBUFFER, c, i.TEXTURE_2D, s, t) : o.target === i.TEXTURE_2D_ARRAY || o.target === i.TEXTURE_3D ? i.framebufferTextureLayer(i.FRAMEBUFFER, c, s, t, n) : o.target === i.TEXTURE_CUBE_MAP && i.framebufferTexture2D(i.FRAMEBUFFER, c, i.TEXTURE_CUBE_MAP_POSITIVE_X + n, s, t);
		}
		_getDepthStencilAttachmentPoint(e) {
			let t = this._renderer.gl, n = e.depthStencilAttachment.texture.format;
			return n === "depth24plus-stencil8" || n === "depth32float-stencil8" ? t.DEPTH_STENCIL_ATTACHMENT : n === "stencil8" ? t.STENCIL_ATTACHMENT : t.DEPTH_ATTACHMENT;
		}
		_initStencil(e) {
			if (e.framebuffer === null) return;
			let t = this._renderer.gl, n = t.createRenderbuffer();
			e.depthStencilRenderBuffer = n, t.bindRenderbuffer(t.RENDERBUFFER, n), t.framebufferRenderbuffer(t.FRAMEBUFFER, t.DEPTH_STENCIL_ATTACHMENT, t.RENDERBUFFER, n), this._resizeStencil(e);
		}
		_resizeStencil(e) {
			let t = this._renderer.gl;
			t.bindRenderbuffer(t.RENDERBUFFER, e.depthStencilRenderBuffer), e.msaa ? t.renderbufferStorageMultisample(t.RENDERBUFFER, 4, t.DEPTH24_STENCIL8, e.width, e.height) : t.renderbufferStorage(t.RENDERBUFFER, this._renderer.context.webGLVersion === 2 ? t.DEPTH24_STENCIL8 : t.DEPTH_STENCIL, e.width, e.height);
		}
		prerender(e) {
			if (e.colorAttachments.length === 0) return;
			let t = e.colorAttachments[0].texture.resource;
			this._renderer.context.multiView && ka.test(t) && this._renderer.context.ensureCanvasSize(t);
		}
		postrender(e) {
			if (!this._renderer.context.multiView || e.colorAttachments.length === 0) return;
			let t = e.colorAttachments[0].texture;
			if (ka.test(t.resource)) {
				let e = this._renderer.context.canvas, n = t;
				n.context2D.drawImage(e, 0, n.pixelHeight - e.height);
			}
		}
		resetState() {
			this._boundFramebuffer = void 0, this._viewPortCache = new R(), this._clearColorCache = [
				0,
				0,
				0,
				0
			];
		}
		bindFramebuffer(e) {
			this._boundFramebuffer !== e && (this._boundFramebuffer = e, this._renderer.gl.bindFramebuffer(this._renderer.gl.FRAMEBUFFER, e));
		}
	};
})), M_, N_ = o((() => {
	h(), Dh(), j_(), M_ = class extends Eh {
		constructor(e) {
			super(e), this.adaptor = new A_(), this.adaptor.init(e, this);
		}
		resetState() {
			this.adaptor.resetState();
		}
	}, M_.extension = {
		type: [d.WebGLSystem],
		name: "renderTarget"
	};
})), P_, F_ = o((() => {
	y(), We(), P_ = class extends v {
		constructor(e, t) {
			super(), this._resourceType = "textureView", this._resourceId = N("resource"), this.source = e, this.viewDescriptor = t, this._onChange = this._onChange.bind(this), this._onDestroy = this._onDestroy.bind(this), this.source.on("change", this._onChange), this.source.on("destroy", this._onDestroy);
		}
		_onChange() {
			this.emit("change", this);
		}
		_onDestroy() {
			this.destroy();
		}
		get destroyed() {
			return this.source.destroyed;
		}
		destroy() {
			this.source && (this.source.off("change", this._onChange), this.source.off("destroy", this._onDestroy)), this.emit("destroy", this), this.removeAllListeners();
		}
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/gl/shader/GenerateShaderSyncCode.mjs
function I_(e) {
	let t = {};
	for (let n in e) t[e[n]] = n;
	return t;
}
function L_(e, t) {
	let n = [], r = ["\n        var g = s.groups;\n        var sS = r.shader;\n        var p = s.glProgram;\n        var ugS = r.uniformGroup;\n        var resources;\n    "], i = !1, a = 0, o = t._getProgramData(e.glProgram);
	for (let s in e.groups) {
		let c = e.groups[s], l = c.layout ? I_(c.layout) : e._uniformBindMap[s];
		n.push(`
            resources = g[${s}].resources;
        `);
		for (let s in c.resources) {
			let u = c.resources[s];
			if (u instanceof ec && !u.ubo) n.push(`
                    ugS.updateUniformGroup(resources[${s}], p, sD);
                `);
			else if (u instanceof ec || u instanceof Zm) {
				let t = l[Number(s)];
				e.glProgram._uniformBlockData[t] && n.push(`
                        sS.bindUniformBlock(
                            resources[${s}],
                            '${t}'
                        );
                    `);
			} else if (u instanceof Cn || u instanceof P_) {
				let e = l[Number(s)], c = o.uniformData[e];
				c && (i || (i = !0, r.push("\n                        var tS = r.texture;\n                        ")), t._gl.uniform1i(c.location, a), n.push(`
                        tS.bind(resources[${s}], ${a});
                    `), a++);
			}
		}
	}
	let s = [...r, ...n].join("\n");
	return Function("r", "s", "sD", s);
}
var R_ = o((() => {
	Qm(), tc(), wn(), F_();
})), z_, B_ = o((() => {
	z_ = class {
		constructor(e, t) {
			this.program = e, this.uniformData = t, this.uniformGroups = {}, this.uniformDirtyGroups = {};
		}
		destroy() {
			this.uniformData = null, this.uniformGroups = null, this.uniformDirtyGroups = null, this.program = null;
		}
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/gl/shader/program/compileShader.mjs
function V_(e, t, n) {
	let r = e.createShader(t);
	return e.shaderSource(r, n), e.compileShader(r), r;
}
var H_ = o((() => {}));
// node_modules/pixi.js/lib/rendering/renderers/gl/shader/program/defaultValue.mjs
function U_(e) {
	let t = Array(e);
	for (let e = 0; e < t.length; e++) t[e] = !1;
	return t;
}
function W_(e, t) {
	switch (e) {
		case "float": return 0;
		case "vec2": return new Float32Array(2 * t);
		case "vec3": return new Float32Array(3 * t);
		case "vec4": return new Float32Array(4 * t);
		case "int":
		case "uint":
		case "sampler2D":
		case "sampler2DArray":
		case "sampler3D": return 0;
		case "ivec2": return new Int32Array(2 * t);
		case "ivec3": return new Int32Array(3 * t);
		case "ivec4": return new Int32Array(4 * t);
		case "uvec2": return new Uint32Array(2 * t);
		case "uvec3": return new Uint32Array(3 * t);
		case "uvec4": return new Uint32Array(4 * t);
		case "bool": return !1;
		case "bvec2": return U_(2 * t);
		case "bvec3": return U_(3 * t);
		case "bvec4": return U_(4 * t);
		case "mat2": return new Float32Array([
			1,
			0,
			0,
			1
		]);
		case "mat3": return new Float32Array([
			1,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			1
		]);
		case "mat4": return new Float32Array([
			1,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			1
		]);
	}
	return null;
}
var G_ = o((() => {}));
// node_modules/pixi.js/lib/rendering/renderers/gl/shader/program/mapType.mjs
function K_(e, t) {
	if (!J_) {
		let t = Object.keys(Y_);
		J_ = {};
		for (let n = 0; n < t.length; ++n) {
			let r = t[n];
			J_[e[r]] = Y_[r];
		}
	}
	return J_[t];
}
function q_(e, t) {
	let n = K_(e, t);
	return X_[n] || "float32";
}
var J_, Y_, X_, Z_ = o((() => {
	J_ = null, Y_ = {
		FLOAT: "float",
		FLOAT_VEC2: "vec2",
		FLOAT_VEC3: "vec3",
		FLOAT_VEC4: "vec4",
		INT: "int",
		INT_VEC2: "ivec2",
		INT_VEC3: "ivec3",
		INT_VEC4: "ivec4",
		UNSIGNED_INT: "uint",
		UNSIGNED_INT_VEC2: "uvec2",
		UNSIGNED_INT_VEC3: "uvec3",
		UNSIGNED_INT_VEC4: "uvec4",
		BOOL: "bool",
		BOOL_VEC2: "bvec2",
		BOOL_VEC3: "bvec3",
		BOOL_VEC4: "bvec4",
		FLOAT_MAT2: "mat2",
		FLOAT_MAT3: "mat3",
		FLOAT_MAT4: "mat4",
		SAMPLER_2D: "sampler2D",
		INT_SAMPLER_2D: "sampler2D",
		UNSIGNED_INT_SAMPLER_2D: "sampler2D",
		SAMPLER_2D_SHADOW: "sampler2DShadow",
		SAMPLER_CUBE: "samplerCube",
		INT_SAMPLER_CUBE: "samplerCube",
		UNSIGNED_INT_SAMPLER_CUBE: "samplerCube",
		SAMPLER_CUBE_SHADOW: "samplerCubeShadow",
		SAMPLER_2D_ARRAY: "sampler2DArray",
		INT_SAMPLER_2D_ARRAY: "sampler2DArray",
		UNSIGNED_INT_SAMPLER_2D_ARRAY: "sampler2DArray",
		SAMPLER_2D_ARRAY_SHADOW: "sampler2DArrayShadow",
		SAMPLER_3D: "sampler3D",
		INT_SAMPLER_3D: "sampler3D",
		UNSIGNED_INT_SAMPLER_3D: "sampler3D"
	}, X_ = {
		float: "float32",
		vec2: "float32x2",
		vec3: "float32x3",
		vec4: "float32x4",
		int: "sint32",
		ivec2: "sint32x2",
		ivec3: "sint32x3",
		ivec4: "sint32x4",
		uint: "uint32",
		uvec2: "uint32x2",
		uvec3: "uint32x3",
		uvec4: "uint32x4",
		bool: "uint32",
		bvec2: "uint32x2",
		bvec3: "uint32x3",
		bvec4: "uint32x4"
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/gl/shader/program/extractAttributesFromGlProgram.mjs
function Q_(e, t, n = !1) {
	let r = {}, i = t.getProgramParameter(e, t.ACTIVE_ATTRIBUTES);
	for (let n = 0; n < i; n++) {
		let i = t.getActiveAttrib(e, n);
		if (i.name.startsWith("gl_")) continue;
		let a = q_(t, i.type);
		r[i.name] = {
			location: 0,
			format: a,
			stride: ms(a).stride,
			offset: 0,
			instance: !1,
			start: 0
		};
	}
	let a = Object.keys(r);
	if (n) {
		a.sort((e, t) => e > t ? 1 : -1);
		for (let n = 0; n < a.length; n++) r[a[n]].location = n, t.bindAttribLocation(e, n, a[n]);
		t.linkProgram(e);
	} else for (let n = 0; n < a.length; n++) r[a[n]].location = t.getAttribLocation(e, a[n]);
	return r;
}
var $_ = o((() => {
	gs(), Z_();
}));
// node_modules/pixi.js/lib/rendering/renderers/gl/shader/program/getUboData.mjs
function ev(e, t, n = 0) {
	if (!t.ACTIVE_UNIFORM_BLOCKS) return {};
	let r = {}, i = t.getProgramParameter(e, t.ACTIVE_UNIFORM_BLOCKS);
	for (let a = 0; a < i; a++) {
		let i = t.getActiveUniformBlockName(e, a), o = t.getUniformBlockIndex(e, i), s = t.getActiveUniformBlockParameter(e, a, t.UNIFORM_BLOCK_DATA_SIZE);
		r[i] = {
			name: i,
			index: o,
			binding: o + n,
			size: s
		};
	}
	return r;
}
var tv = o((() => {}));
// node_modules/pixi.js/lib/rendering/renderers/gl/shader/program/getUniformData.mjs
function nv(e, t) {
	let n = {}, r = t.getProgramParameter(e, t.ACTIVE_UNIFORMS);
	for (let i = 0; i < r; i++) {
		let r = t.getActiveUniform(e, i), a = r.name.replace(/\[.*?\]$/, ""), o = !!r.name.match(/\[.*?\]$/), s = K_(t, r.type);
		n[a] = {
			name: a,
			index: i,
			type: s,
			size: r.size,
			isArray: o,
			value: W_(s, r.size)
		};
	}
	return n;
}
var rv = o((() => {
	G_(), Z_();
}));
// node_modules/pixi.js/lib/rendering/renderers/gl/shader/program/logProgramError.mjs
function iv(e, t) {
	let n = e.getShaderSource(t);
	if (n === null) {
		console.error("PixiJS Error: Could not retrieve shader source (WebGL context may be lost).");
		return;
	}
	let r = n.split("\n").map((e, t) => `${t}: ${e}`), i = e.getShaderInfoLog(t) ?? "", a = i.split("\n"), o = {}, s = a.map((e) => parseFloat(e.replace(/^ERROR\: 0\:([\d]+)\:.*$/, "$1"))).filter((e) => e && !o[e] ? (o[e] = !0, !0) : !1), c = [""];
	s.forEach((e) => {
		r[e - 1] = `%c${r[e - 1]}%c`, c.push("background: #FF0000; color:#FFFFFF; font-size: 10px", "font-size: 10px");
	}), c[0] = r.join("\n"), console.error(i), console.groupCollapsed("click to view full shader code"), console.warn(...c), console.groupEnd();
}
function av(e, t, n, r) {
	e.getProgramParameter(t, e.LINK_STATUS) || (e.getShaderParameter(n, e.COMPILE_STATUS) || iv(e, n), e.getShaderParameter(r, e.COMPILE_STATUS) || iv(e, r), console.error("PixiJS Error: Could not initialize shader."), e.getProgramInfoLog(t) !== "" && console.warn("PixiJS Warning: gl.getProgramInfoLog()", e.getProgramInfoLog(t)));
}
var ov = o((() => {}));
// node_modules/pixi.js/lib/rendering/renderers/gl/shader/program/generateProgram.mjs
function sv(e, t) {
	let n = V_(e, e.VERTEX_SHADER, t.vertex), r = V_(e, e.FRAGMENT_SHADER, t.fragment), i = e.createProgram();
	e.attachShader(i, n), e.attachShader(i, r);
	let a = t.transformFeedbackVaryings;
	a && (typeof e.transformFeedbackVaryings == "function" ? e.transformFeedbackVaryings(i, a.names, a.bufferMode === "separate" ? e.SEPARATE_ATTRIBS : e.INTERLEAVED_ATTRIBS) : I("TransformFeedback is not supported but TransformFeedbackVaryings are given.")), e.linkProgram(i), e.getProgramParameter(i, e.LINK_STATUS) || av(e, i, n, r), t._attributeData = Q_(i, e, !/^[ \t]*#[ \t]*version[ \t]+300[ \t]+es[ \t]*$/m.test(t.vertex)), t._uniformData = nv(i, e), t._uniformBlockData = ev(i, e, +!!a);
	for (let n in t._uniformBlockData) {
		let { index: r, binding: a } = t._uniformBlockData[n];
		e.uniformBlockBinding(i, r, a);
	}
	e.deleteShader(n), e.deleteShader(r);
	let o = {};
	for (let n in t._uniformData) {
		let r = t._uniformData[n];
		o[n] = {
			location: e.getUniformLocation(i, n),
			value: W_(r.type, r.size)
		};
	}
	return new z_(i, o);
}
var cv = o((() => {
	L(), B_(), H_(), G_(), $_(), tv(), rv(), ov();
})), lv, uv, dv = o((() => {
	h(), L(), R_(), cv(), lv = { textureCount: 0 }, uv = class {
		constructor(e) {
			this._activeProgram = null, this._programDataHash = /* @__PURE__ */ Object.create(null), this._shaderSyncFunctions = /* @__PURE__ */ Object.create(null), this._renderer = e;
		}
		contextChange(e) {
			this._gl = e, this._programDataHash = /* @__PURE__ */ Object.create(null), this._shaderSyncFunctions = /* @__PURE__ */ Object.create(null), this._activeProgram = null;
		}
		bind(e, t) {
			if (this._setProgram(e.glProgram), t) return;
			lv.textureCount = 0;
			let n = this._shaderSyncFunctions[e.glProgram._key];
			n ||= this._shaderSyncFunctions[e.glProgram._key] = this._generateShaderSync(e, this), n(this._renderer, e, lv);
		}
		updateUniformGroup(e) {
			this._renderer.uniformGroup.updateUniformGroup(e, this._activeProgram, lv);
		}
		bindUniformBlock(e, t) {
			let n = this._renderer.buffer, { binding: r } = this._activeProgram._uniformBlockData[t], i = e._bufferResource;
			i || this._renderer.ubo.updateUniformGroup(e);
			let a = n.updateBuffer(e.buffer);
			if (!i) {
				n.bindBufferBase(a, r);
				return;
			}
			let { offset: o, size: s } = e;
			if (o === 0 && (s === void 0 || s === a.byteLength)) {
				n.bindBufferBase(a, r);
				return;
			}
			let c = this._renderer.limits.minUniformBufferOffsetAlignment;
			o % c !== 0 && I(`[GlShaderSystem] uniform block "${t}" has a BufferResource offset of ${o}, which is not a multiple of renderer.limits.minUniformBufferOffsetAlignment (${c}). WebGL will not bind it.`), n.bindBufferRange(a, r, o, s);
		}
		_setProgram(e) {
			if (this._activeProgram === e) return;
			this._activeProgram = e;
			let t = this._getProgramData(e);
			this._gl.useProgram(t.program), this._renderer.renderTarget.adaptor.setFragmentOutputs(e);
		}
		_getProgramData(e) {
			return this._programDataHash[e._key] || this._createProgramData(e);
		}
		_createProgramData(e) {
			let t = e._key;
			return this._programDataHash[t] = sv(this._gl, e), this._programDataHash[t];
		}
		destroy() {
			for (let e of Object.keys(this._programDataHash)) this._programDataHash[e].destroy();
			this._programDataHash = null, this._shaderSyncFunctions = null, this._activeProgram = null, this._renderer = null, this._gl = null;
		}
		_generateShaderSync(e, t) {
			return L_(e, t);
		}
		resetState() {
			this._activeProgram = null;
		}
	}, uv.extension = {
		type: [d.WebGLSystem],
		name: "shader"
	};
})), fv, pv, mv = o((() => {
	fv = {
		f32: "if (cv !== v) {\n            cu.value = v;\n            gl.uniform1f(location, v);\n        }",
		"vec2<f32>": "if (cv[0] !== v[0] || cv[1] !== v[1]) {\n            cv[0] = v[0];\n            cv[1] = v[1];\n            gl.uniform2f(location, v[0], v[1]);\n        }",
		"vec3<f32>": "if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2]) {\n            cv[0] = v[0];\n            cv[1] = v[1];\n            cv[2] = v[2];\n            gl.uniform3f(location, v[0], v[1], v[2]);\n        }",
		"vec4<f32>": "if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3]) {\n            cv[0] = v[0];\n            cv[1] = v[1];\n            cv[2] = v[2];\n            cv[3] = v[3];\n            gl.uniform4f(location, v[0], v[1], v[2], v[3]);\n        }",
		i32: "if (cv !== v) {\n            cu.value = v;\n            gl.uniform1i(location, v);\n        }",
		"vec2<i32>": "if (cv[0] !== v[0] || cv[1] !== v[1]) {\n            cv[0] = v[0];\n            cv[1] = v[1];\n            gl.uniform2i(location, v[0], v[1]);\n        }",
		"vec3<i32>": "if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2]) {\n            cv[0] = v[0];\n            cv[1] = v[1];\n            cv[2] = v[2];\n            gl.uniform3i(location, v[0], v[1], v[2]);\n        }",
		"vec4<i32>": "if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3]) {\n            cv[0] = v[0];\n            cv[1] = v[1];\n            cv[2] = v[2];\n            cv[3] = v[3];\n            gl.uniform4i(location, v[0], v[1], v[2], v[3]);\n        }",
		u32: "if (cv !== v) {\n            cu.value = v;\n            gl.uniform1ui(location, v);\n        }",
		"vec2<u32>": "if (cv[0] !== v[0] || cv[1] !== v[1]) {\n            cv[0] = v[0];\n            cv[1] = v[1];\n            gl.uniform2ui(location, v[0], v[1]);\n        }",
		"vec3<u32>": "if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2]) {\n            cv[0] = v[0];\n            cv[1] = v[1];\n            cv[2] = v[2];\n            gl.uniform3ui(location, v[0], v[1], v[2]);\n        }",
		"vec4<u32>": "if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3]) {\n            cv[0] = v[0];\n            cv[1] = v[1];\n            cv[2] = v[2];\n            cv[3] = v[3];\n            gl.uniform4ui(location, v[0], v[1], v[2], v[3]);\n        }",
		bool: "if (cv !== v) {\n            cu.value = v;\n            gl.uniform1i(location, v);\n        }",
		"vec2<bool>": "if (cv[0] !== v[0] || cv[1] !== v[1]) {\n            cv[0] = v[0];\n            cv[1] = v[1];\n            gl.uniform2i(location, v[0], v[1]);\n        }",
		"vec3<bool>": "if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2]) {\n            cv[0] = v[0];\n            cv[1] = v[1];\n            cv[2] = v[2];\n            gl.uniform3i(location, v[0], v[1], v[2]);\n        }",
		"vec4<bool>": "if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3]) {\n            cv[0] = v[0];\n            cv[1] = v[1];\n            cv[2] = v[2];\n            cv[3] = v[3];\n            gl.uniform4i(location, v[0], v[1], v[2], v[3]);\n        }",
		"mat2x2<f32>": "gl.uniformMatrix2fv(location, false, v);",
		"mat3x3<f32>": "gl.uniformMatrix3fv(location, false, v);",
		"mat4x4<f32>": "gl.uniformMatrix4fv(location, false, v);"
	}, pv = {
		f32: "gl.uniform1fv(location, v);",
		"vec2<f32>": "gl.uniform2fv(location, v);",
		"vec3<f32>": "gl.uniform3fv(location, v);",
		"vec4<f32>": "gl.uniform4fv(location, v);",
		"mat2x2<f32>": "gl.uniformMatrix2fv(location, false, v);",
		"mat3x3<f32>": "gl.uniformMatrix3fv(location, false, v);",
		"mat4x4<f32>": "gl.uniformMatrix4fv(location, false, v);",
		i32: "gl.uniform1iv(location, v);",
		"vec2<i32>": "gl.uniform2iv(location, v);",
		"vec3<i32>": "gl.uniform3iv(location, v);",
		"vec4<i32>": "gl.uniform4iv(location, v);",
		u32: "gl.uniform1iv(location, v);",
		"vec2<u32>": "gl.uniform2iv(location, v);",
		"vec3<u32>": "gl.uniform3iv(location, v);",
		"vec4<u32>": "gl.uniform4iv(location, v);",
		bool: "gl.uniform1iv(location, v);",
		"vec2<bool>": "gl.uniform2iv(location, v);",
		"vec3<bool>": "gl.uniform3iv(location, v);",
		"vec4<bool>": "gl.uniform4iv(location, v);"
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/gl/shader/utils/generateUniformsSync.mjs
function hv(e, t) {
	let n = ["\n        var v = null;\n        var cv = null;\n        var cu = null;\n        var t = 0;\n        var gl = renderer.gl;\n        var name = null;\n    "];
	for (let r in e.uniforms) {
		if (!t[r]) {
			e.uniforms[r] instanceof ec ? e.uniforms[r].ubo ? n.push(`
                        renderer.shader.bindUniformBlock(uv.${r}, "${r}");
                    `) : n.push(`
                        renderer.shader.updateUniformGroup(uv.${r});
                    `) : e.uniforms[r] instanceof Zm && n.push(`
                        renderer.shader.bindBufferResource(uv.${r}, "${r}");
                    `);
			continue;
		}
		let i = e.uniformStructures[r], a = !1;
		for (let e = 0; e < Lm.length; e++) {
			let t = Lm[e];
			if (i.type === t.type && t.test(i)) {
				n.push(`name = "${r}";`, Lm[e].uniform), a = !0;
				break;
			}
		}
		if (!a) {
			let e = (i.size === 1 ? fv : pv)[i.type].replace("location", `ud["${r}"].location`);
			n.push(`
            cu = ud["${r}"];
            cv = cu.value;
            v = uv["${r}"];
            ${e};`);
		}
	}
	return Function("ud", "uv", "renderer", "syncData", n.join("\n"));
}
var gv = o((() => {
	Qm(), tc(), Rm(), mv();
})), _v, vv = o((() => {
	h(), gv(), _v = class {
		constructor(e) {
			this._cache = {}, this._uniformGroupSyncHash = {}, this._renderer = e, this.gl = null, this._cache = {};
		}
		contextChange(e) {
			this.gl = e;
		}
		updateUniformGroup(e, t, n) {
			let r = this._renderer.shader._getProgramData(t);
			e.isStatic && e._dirtyId === r.uniformDirtyGroups[e.uid] || (r.uniformDirtyGroups[e.uid] = e._dirtyId, this._getUniformSyncFunction(e, t)(r.uniformData, e.uniforms, this._renderer, n));
		}
		_getUniformSyncFunction(e, t) {
			return this._uniformGroupSyncHash[e._signature]?.[t._key] || this._createUniformSyncFunction(e, t);
		}
		_createUniformSyncFunction(e, t) {
			let n = this._uniformGroupSyncHash[e._signature] || (this._uniformGroupSyncHash[e._signature] = {}), r = this._getSignature(e, t._uniformData, "u");
			return this._cache[r] || (this._cache[r] = this._generateUniformsSync(e, t._uniformData)), n[t._key] = this._cache[r], n[t._key];
		}
		_generateUniformsSync(e, t) {
			return hv(e, t);
		}
		_getSignature(e, t, n) {
			let r = e.uniforms, i = [`${n}-`];
			for (let e in r) i.push(e), t[e] && i.push(t[e].type);
			return i.join("-");
		}
		destroy() {
			this._renderer = null, this._cache = null;
		}
	}, _v.extension = {
		type: [d.WebGLSystem],
		name: "uniformGroup"
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/gl/state/mapWebGLBlendModesToPixi.mjs
function yv(e) {
	let t = {};
	if (t.normal = [e.ONE, e.ONE_MINUS_SRC_ALPHA], t.add = [e.ONE, e.ONE], t.multiply = [
		e.DST_COLOR,
		e.ONE_MINUS_SRC_ALPHA,
		e.ONE,
		e.ONE_MINUS_SRC_ALPHA
	], t.screen = [
		e.ONE,
		e.ONE_MINUS_SRC_COLOR,
		e.ONE,
		e.ONE_MINUS_SRC_ALPHA
	], t.none = [0, 0], t["normal-npm"] = [
		e.SRC_ALPHA,
		e.ONE_MINUS_SRC_ALPHA,
		e.ONE,
		e.ONE_MINUS_SRC_ALPHA
	], t["add-npm"] = [
		e.SRC_ALPHA,
		e.ONE,
		e.ONE,
		e.ONE
	], t["screen-npm"] = [
		e.SRC_ALPHA,
		e.ONE_MINUS_SRC_COLOR,
		e.ONE,
		e.ONE_MINUS_SRC_ALPHA
	], t.erase = [e.ZERO, e.ONE_MINUS_SRC_ALPHA], !(e instanceof U.get().getWebGLRenderingContext())) t.min = [
		e.ONE,
		e.ONE,
		e.ONE,
		e.ONE,
		e.MIN,
		e.MIN
	], t.max = [
		e.ONE,
		e.ONE,
		e.ONE,
		e.ONE,
		e.MAX,
		e.MAX
	];
	else {
		let n = e.getExtension("EXT_blend_minmax");
		n && (t.min = [
			e.ONE,
			e.ONE,
			e.ONE,
			e.ONE,
			n.MIN_EXT,
			n.MIN_EXT
		], t.max = [
			e.ONE,
			e.ONE,
			e.ONE,
			e.ONE,
			n.MAX_EXT,
			n.MAX_EXT
		]);
	}
	return t;
}
var bv = o((() => {
	W();
})), xv, Sv, Cv, wv, Tv, Ev, Dv, Ov, kv = o((() => {
	h(), mc(), bv(), {BLEND: xv, OFFSET: Sv, CULLING: Cv, DEPTH_TEST: wv, WINDING: Tv, DEPTH_MASK: Ev} = ac, Dv = class e {
		constructor(e) {
			this._invertFrontFace = !1, this._renderer = e, this.gl = null, this.stateId = 0, this.polygonOffset = 0, this.blendMode = "none", this._blendEq = !1, this.map = [], this.map[xv] = this.setBlend, this.map[Sv] = this.setOffset, this.map[Cv] = this.setCullFace, this.map[wv] = this.setDepthTest, this.map[Tv] = this.setFrontFace, this.map[Ev] = this.setDepthMask, this.checks = [], this.defaultState = pc.for2d(), e.renderTarget.onRenderTargetChange.add(this);
		}
		onRenderTargetChange(e) {
			this._invertFrontFace = this._renderer.renderTarget.isFrontFaceInverted(e, e.flipY), this._cullFace ? this.setFrontFace(this._frontFace) : this._frontFaceDirty = !0;
		}
		contextChange(e) {
			this.gl = e, this.blendModesMap = yv(e), this.resetState();
		}
		set(e) {
			if (e ||= this.defaultState, this.stateId !== e.data) {
				let t = this.stateId ^ e.data, n = 0;
				for (; t;) t & 1 && this.map[n].call(this, !!(e.data & 1 << n)), t >>= 1, n++;
				this.stateId = e.data;
			}
			for (let t = 0; t < this.checks.length; t++) this.checks[t](this, e);
		}
		forceState(e) {
			e ||= this.defaultState;
			for (let t = 0; t < this.map.length; t++) this.map[t].call(this, !!(e.data & 1 << t));
			for (let t = 0; t < this.checks.length; t++) this.checks[t](this, e);
			this.stateId = e.data;
		}
		setBlend(t) {
			this._updateCheck(e._checkBlendMode, t), this.gl[t ? "enable" : "disable"](this.gl.BLEND);
		}
		setOffset(t) {
			this._updateCheck(e._checkPolygonOffset, t), this.gl[t ? "enable" : "disable"](this.gl.POLYGON_OFFSET_FILL);
		}
		setDepthTest(e) {
			this.gl[e ? "enable" : "disable"](this.gl.DEPTH_TEST);
		}
		setDepthMask(e) {
			this.gl.depthMask(e);
		}
		get depthMaskEnabled() {
			return !!(this.stateId & 1 << Ev);
		}
		setCullFace(e) {
			this._cullFace = e, this.gl[e ? "enable" : "disable"](this.gl.CULL_FACE), this._cullFace && this._frontFaceDirty && this.setFrontFace(this._frontFace);
		}
		setFrontFace(e) {
			this._frontFace = e, this._frontFaceDirty = !1;
			let t = this._invertFrontFace ? !e : e;
			this._glFrontFace !== t && (this._glFrontFace = t, this.gl.frontFace(this.gl[t ? "CW" : "CCW"]));
		}
		setBlendMode(e) {
			if (this.blendModesMap[e] || (e = "normal"), e === this.blendMode) return;
			this.blendMode = e;
			let t = this.blendModesMap[e], n = this.gl;
			t.length === 2 ? n.blendFunc(t[0], t[1]) : n.blendFuncSeparate(t[0], t[1], t[2], t[3]), t.length === 6 ? (this._blendEq = !0, n.blendEquationSeparate(t[4], t[5])) : this._blendEq && (this._blendEq = !1, n.blendEquationSeparate(n.FUNC_ADD, n.FUNC_ADD));
		}
		setPolygonOffset(e, t) {
			this.gl.polygonOffset(e, t);
		}
		resetState() {
			this._glFrontFace = !1, this._frontFace = !1, this._cullFace = !1, this._frontFaceDirty = !1, this._invertFrontFace = !1, this.gl.frontFace(this.gl.CCW), this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, !1), this.forceState(this.defaultState), this._blendEq = !0, this.blendMode = "", this.setBlendMode("normal");
		}
		_updateCheck(e, t) {
			let n = this.checks.indexOf(e);
			t && n === -1 ? this.checks.push(e) : !t && n !== -1 && this.checks.splice(n, 1);
		}
		static _checkBlendMode(e, t) {
			e.setBlendMode(t.blendMode);
		}
		static _checkPolygonOffset(e, t) {
			e.setPolygonOffset(1, t.polygonOffset);
		}
		destroy() {
			this.gl = null, this.checks.length = 0, this._renderer = null;
		}
	}, Dv.extension = {
		type: [d.WebGLSystem],
		name: "state"
	}, Ov = Dv;
})), Av, jv = o((() => {
	$g(), Av = class {
		constructor(e) {
			this.target = Qg.TEXTURE_2D, this._layerInitMask = 0, this.msaaRenderBuffer = null, this.msaaWidth = -1, this.msaaHeight = -1, this.texture = e, this.width = -1, this.height = -1, this.type = K.UNSIGNED_BYTE, this.internalFormat = Zg.RGBA, this.format = Zg.RGBA, this.samplerType = 0;
		}
		destroy() {}
	};
})), Mv, Nv, Pv = o((() => {
	wt(), Yh(), $g(), Mv = [
		new R(),
		new R(),
		new R()
	], Nv = {
		id: "buffer",
		upload(e, t, n, r, i, a = !1) {
			let o = i || t.target, s = e.resource;
			if (o === Qg.TEXTURE_3D || o === Qg.TEXTURE_2D_ARRAY) {
				a || t.width !== e.width || t.height !== e.height ? n.texImage3D(o, 0, t.internalFormat, e.width, e.height, e.depthOrArrayLayers, 0, t.format, t.type, s) : n.texSubImage3D(o, 0, 0, 0, 0, e.width, e.height, e.depthOrArrayLayers, t.format, t.type, s), t.width = e.width, t.height = e.height;
				return;
			}
			let c = e.width * e.height, l = a || t.width !== e.width || t.height !== e.height, u = e._updateStart > 0 || e._updateEnd < c;
			if (l) n.texImage2D(o, 0, t.internalFormat, e.width, e.height, 0, t.format, t.type, s);
			else if (u) {
				let r = s.length / c, i = Jh(e._updateStart, e._updateEnd, e.width, e.height, Mv);
				for (let a = 0; a < i; a++) {
					let i = Mv[a], c = (i.y * e.width + i.x) * r;
					n.texSubImage2D(o, 0, i.x, i.y, i.width, i.height, t.format, t.type, s.subarray(c, c + i.width * i.height * r));
				}
			} else n.texSubImage2D(o, 0, 0, 0, e.width, e.height, t.format, t.type, s);
			t.width = e.width, t.height = e.height;
		}
	};
})), Fv, Iv, Lv = o((() => {
	Fv = {
		"bc1-rgba-unorm": !0,
		"bc1-rgba-unorm-srgb": !0,
		"bc2-rgba-unorm": !0,
		"bc2-rgba-unorm-srgb": !0,
		"bc3-rgba-unorm": !0,
		"bc3-rgba-unorm-srgb": !0,
		"bc4-r-unorm": !0,
		"bc4-r-snorm": !0,
		"bc5-rg-unorm": !0,
		"bc5-rg-snorm": !0,
		"bc6h-rgb-ufloat": !0,
		"bc6h-rgb-float": !0,
		"bc7-rgba-unorm": !0,
		"bc7-rgba-unorm-srgb": !0,
		"etc2-rgb8unorm": !0,
		"etc2-rgb8unorm-srgb": !0,
		"etc2-rgb8a1unorm": !0,
		"etc2-rgb8a1unorm-srgb": !0,
		"etc2-rgba8unorm": !0,
		"etc2-rgba8unorm-srgb": !0,
		"eac-r11unorm": !0,
		"eac-r11snorm": !0,
		"eac-rg11unorm": !0,
		"eac-rg11snorm": !0,
		"astc-4x4-unorm": !0,
		"astc-4x4-unorm-srgb": !0,
		"astc-5x4-unorm": !0,
		"astc-5x4-unorm-srgb": !0,
		"astc-5x5-unorm": !0,
		"astc-5x5-unorm-srgb": !0,
		"astc-6x5-unorm": !0,
		"astc-6x5-unorm-srgb": !0,
		"astc-6x6-unorm": !0,
		"astc-6x6-unorm-srgb": !0,
		"astc-8x5-unorm": !0,
		"astc-8x5-unorm-srgb": !0,
		"astc-8x6-unorm": !0,
		"astc-8x6-unorm-srgb": !0,
		"astc-8x8-unorm": !0,
		"astc-8x8-unorm-srgb": !0,
		"astc-10x5-unorm": !0,
		"astc-10x5-unorm-srgb": !0,
		"astc-10x6-unorm": !0,
		"astc-10x6-unorm-srgb": !0,
		"astc-10x8-unorm": !0,
		"astc-10x8-unorm-srgb": !0,
		"astc-10x10-unorm": !0,
		"astc-10x10-unorm-srgb": !0,
		"astc-12x10-unorm": !0,
		"astc-12x10-unorm-srgb": !0,
		"astc-12x12-unorm": !0,
		"astc-12x12-unorm-srgb": !0
	}, Iv = {
		id: "compressed",
		upload(e, t, n, r, i, a) {
			let o = i ?? t.target;
			n.pixelStorei(n.UNPACK_ALIGNMENT, 4);
			let s = e.pixelWidth, c = e.pixelHeight, l = !!Fv[e.format];
			for (let r = 0; r < e.resource.length; r++) {
				let i = e.resource[r];
				l ? n.compressedTexImage2D(o, r, t.internalFormat, s, c, 0, i) : n.texImage2D(o, r, t.internalFormat, s, c, 0, t.format, t.type, i), s = Math.max(s >> 1, 1), c = Math.max(c >> 1, 1);
			}
		}
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/gl/texture/uploaders/glUploadCubeTextureResource.mjs
function Rv(e) {
	return {
		id: "cube",
		upload(t, n, r, i) {
			let a = t.faces;
			for (let t = 0; t < zv.length; t++) {
				let o = a[zv[t]];
				o.resource && ((e[o.uploadMethodId] || e.image).upload(o, n, r, i, Qg.TEXTURE_CUBE_MAP_POSITIVE_X + t, !(n._layerInitMask & 1 << t)), n._layerInitMask |= 1 << t);
			}
			n.width = t.pixelWidth, n.height = t.pixelHeight;
		}
	};
}
var zv, Bv = o((() => {
	$g(), zv = [
		"right",
		"left",
		"top",
		"bottom",
		"front",
		"back"
	];
}));
// node_modules/pixi.js/lib/rendering/renderers/gl/texture/uploaders/glUploadImageResource.mjs
function Vv(e, t, n, r, i, a, o, s, c, l) {
	l ? c ? e.texImage2D(t, 0, n.internalFormat, r, i, 0, n.format, n.type, s) : e.texSubImage2D(t, 0, 0, 0, n.format, n.type, s) : (c && e.texImage2D(t, 0, n.internalFormat, r, i, 0, n.format, n.type, null), e.texSubImage2D(t, 0, 0, 0, a, o, n.format, n.type, s));
}
function Hv(e, t, n, r, i, a, o, s, c, l) {
	l ? c ? e.texImage2D(t, 0, n.internalFormat, n.format, n.type, s) : e.texSubImage2D(t, 0, 0, 0, n.format, n.type, s) : (c && e.texImage2D(t, 0, n.internalFormat, r, i, 0, n.format, n.type, null), e.texSubImage2D(t, 0, 0, 0, n.format, n.type, s));
}
var Uv, Wv = o((() => {
	Uv = {
		id: "image",
		upload(e, t, n, r, i, a = !1) {
			let o = i || t.target, s = e.pixelWidth, c = e.pixelHeight, l = e.resourceWidth, u = e.resourceHeight, d = r === 2, f = a || t.width !== s || t.height !== c, p = l >= s && u >= c, m = e.resource;
			(d ? Vv : Hv)(n, o, t, s, c, l, u, m, f, p), t.width = s, t.height = c;
		}
	};
}));
// node_modules/pixi.js/lib/utils/browser/isSafari.mjs
function Gv() {
	let { userAgent: e } = U.get().getNavigator();
	return /^((?!chrome|android).)*safari/i.test(e);
}
var Kv = o((() => {
	W();
})), qv, Jv, Yv = o((() => {
	Kv(), Wv(), qv = Gv(), Jv = {
		id: "video",
		upload(e, t, n, r, i, a = qv) {
			if (e.isValid) Uv.upload(e, t, n, r, i, a);
			else {
				let e = i ?? t.target;
				n.texImage2D(e, 0, t.internalFormat, 1, 1, 0, t.format, t.type, null);
			}
		}
	};
})), Xv, Zv, Qv, $v, ey = o((() => {
	Xv = {
		linear: 9729,
		nearest: 9728
	}, Zv = {
		linear: {
			linear: 9987,
			nearest: 9985
		},
		nearest: {
			linear: 9986,
			nearest: 9984
		}
	}, Qv = {
		"clamp-to-edge": 33071,
		repeat: 10497,
		"mirror-repeat": 33648
	}, $v = {
		never: 512,
		less: 513,
		equal: 514,
		"less-equal": 515,
		greater: 516,
		"not-equal": 517,
		"greater-equal": 518,
		always: 519
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/gl/texture/utils/applyStyleParams.mjs
function ty(e, t, n, r, i, a, o, s) {
	let c = a;
	if (!s || e.addressModeU !== "repeat" || e.addressModeV !== "repeat" || e.addressModeW !== "repeat") {
		let n = Qv[o ? "clamp-to-edge" : e.addressModeU], r = Qv[o ? "clamp-to-edge" : e.addressModeV], a = Qv[o ? "clamp-to-edge" : e.addressModeW];
		t[i](c, t.TEXTURE_WRAP_S, n), t[i](c, t.TEXTURE_WRAP_T, r), t.TEXTURE_WRAP_R && t[i](c, t.TEXTURE_WRAP_R, a);
	}
	if (s && e.magFilter === "linear" || t[i](c, t.TEXTURE_MAG_FILTER, Xv[e.magFilter]), n) {
		if (!s || e.mipmapFilter !== "linear") {
			let n = Zv[e.minFilter][e.mipmapFilter];
			t[i](c, t.TEXTURE_MIN_FILTER, n);
		}
	} else t[i](c, t.TEXTURE_MIN_FILTER, Xv[e.minFilter]);
	if (r && e.maxAnisotropy > 1) {
		let n = Math.min(e.maxAnisotropy, t.getParameter(r.MAX_TEXTURE_MAX_ANISOTROPY_EXT));
		t[i](c, r.TEXTURE_MAX_ANISOTROPY_EXT, n);
	}
	e.compare ? (t[i](c, t.TEXTURE_COMPARE_FUNC, $v[e.compare]), t[i](c, t.TEXTURE_COMPARE_MODE, t.COMPARE_REF_TO_TEXTURE)) : !s && t.TEXTURE_COMPARE_MODE && t[i](c, t.TEXTURE_COMPARE_MODE, t.NONE);
}
var ny = o((() => {
	ey();
}));
// node_modules/pixi.js/lib/rendering/renderers/gl/texture/utils/mapFormatToGlFormat.mjs
function ry(e) {
	return {
		r8unorm: e.RED,
		r8snorm: e.RED,
		r8uint: e.RED_INTEGER,
		r8sint: e.RED_INTEGER,
		r16uint: e.RED_INTEGER,
		r16sint: e.RED_INTEGER,
		r16float: e.RED,
		rg8unorm: e.RG,
		rg8snorm: e.RG,
		rg8uint: e.RG_INTEGER,
		rg8sint: e.RG_INTEGER,
		r32uint: e.RED_INTEGER,
		r32sint: e.RED_INTEGER,
		r32float: e.RED,
		rg16uint: e.RG_INTEGER,
		rg16sint: e.RG_INTEGER,
		rg16float: e.RG,
		rgba8unorm: e.RGBA,
		"rgba8unorm-srgb": e.RGBA,
		rgba8snorm: e.RGBA,
		rgba8uint: e.RGBA_INTEGER,
		rgba8sint: e.RGBA_INTEGER,
		bgra8unorm: e.RGBA,
		"bgra8unorm-srgb": e.RGBA,
		rgb9e5ufloat: e.RGB,
		rgb10a2unorm: e.RGBA,
		rg11b10ufloat: e.RGB,
		rg32uint: e.RG_INTEGER,
		rg32sint: e.RG_INTEGER,
		rg32float: e.RG,
		rgba16uint: e.RGBA_INTEGER,
		rgba16sint: e.RGBA_INTEGER,
		rgba16float: e.RGBA,
		rgba32uint: e.RGBA_INTEGER,
		rgba32sint: e.RGBA_INTEGER,
		rgba32float: e.RGBA,
		stencil8: e.STENCIL_INDEX8,
		depth16unorm: e.DEPTH_COMPONENT,
		depth24plus: e.DEPTH_COMPONENT,
		"depth24plus-stencil8": e.DEPTH_STENCIL,
		depth32float: e.DEPTH_COMPONENT,
		"depth32float-stencil8": e.DEPTH_STENCIL
	};
}
var iy = o((() => {}));
// node_modules/pixi.js/lib/rendering/renderers/gl/texture/utils/mapFormatToGlInternalFormat.mjs
function ay(e, t) {
	let n = {}, r = e.RGBA;
	return e instanceof U.get().getWebGLRenderingContext() ? t.srgb && (n = {
		"rgba8unorm-srgb": t.srgb.SRGB8_ALPHA8_EXT,
		"bgra8unorm-srgb": t.srgb.SRGB8_ALPHA8_EXT
	}) : (n = {
		"rgba8unorm-srgb": e.SRGB8_ALPHA8,
		"bgra8unorm-srgb": e.SRGB8_ALPHA8
	}, r = e.RGBA8), {
		r8unorm: e.R8,
		r8snorm: e.R8_SNORM,
		r8uint: e.R8UI,
		r8sint: e.R8I,
		r16uint: e.R16UI,
		r16sint: e.R16I,
		r16float: e.R16F,
		rg8unorm: e.RG8,
		rg8snorm: e.RG8_SNORM,
		rg8uint: e.RG8UI,
		rg8sint: e.RG8I,
		r32uint: e.R32UI,
		r32sint: e.R32I,
		r32float: e.R32F,
		rg16uint: e.RG16UI,
		rg16sint: e.RG16I,
		rg16float: e.RG16F,
		rgba8unorm: e.RGBA,
		...n,
		rgba8snorm: e.RGBA8_SNORM,
		rgba8uint: e.RGBA8UI,
		rgba8sint: e.RGBA8I,
		bgra8unorm: r,
		rgb9e5ufloat: e.RGB9_E5,
		rgb10a2unorm: e.RGB10_A2,
		rg11b10ufloat: e.R11F_G11F_B10F,
		rg32uint: e.RG32UI,
		rg32sint: e.RG32I,
		rg32float: e.RG32F,
		rgba16uint: e.RGBA16UI,
		rgba16sint: e.RGBA16I,
		rgba16float: e.RGBA16F,
		rgba32uint: e.RGBA32UI,
		rgba32sint: e.RGBA32I,
		rgba32float: e.RGBA32F,
		stencil8: e.STENCIL_INDEX8,
		depth16unorm: e.DEPTH_COMPONENT16,
		depth24plus: e.DEPTH_COMPONENT24,
		"depth24plus-stencil8": e.DEPTH24_STENCIL8,
		depth32float: e.DEPTH_COMPONENT32F,
		"depth32float-stencil8": e.DEPTH32F_STENCIL8,
		...t.s3tc ? {
			"bc1-rgba-unorm": t.s3tc.COMPRESSED_RGBA_S3TC_DXT1_EXT,
			"bc2-rgba-unorm": t.s3tc.COMPRESSED_RGBA_S3TC_DXT3_EXT,
			"bc3-rgba-unorm": t.s3tc.COMPRESSED_RGBA_S3TC_DXT5_EXT
		} : {},
		...t.s3tc_sRGB ? {
			"bc1-rgba-unorm-srgb": t.s3tc_sRGB.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT,
			"bc2-rgba-unorm-srgb": t.s3tc_sRGB.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT,
			"bc3-rgba-unorm-srgb": t.s3tc_sRGB.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT
		} : {},
		...t.rgtc ? {
			"bc4-r-unorm": t.rgtc.COMPRESSED_RED_RGTC1_EXT,
			"bc4-r-snorm": t.rgtc.COMPRESSED_SIGNED_RED_RGTC1_EXT,
			"bc5-rg-unorm": t.rgtc.COMPRESSED_RED_GREEN_RGTC2_EXT,
			"bc5-rg-snorm": t.rgtc.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT
		} : {},
		...t.bptc ? {
			"bc6h-rgb-float": t.bptc.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT,
			"bc6h-rgb-ufloat": t.bptc.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT,
			"bc7-rgba-unorm": t.bptc.COMPRESSED_RGBA_BPTC_UNORM_EXT,
			"bc7-rgba-unorm-srgb": t.bptc.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT
		} : {},
		...t.etc ? {
			"etc2-rgb8unorm": t.etc.COMPRESSED_RGB8_ETC2,
			"etc2-rgb8unorm-srgb": t.etc.COMPRESSED_SRGB8_ETC2,
			"etc2-rgb8a1unorm": t.etc.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2,
			"etc2-rgb8a1unorm-srgb": t.etc.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2,
			"etc2-rgba8unorm": t.etc.COMPRESSED_RGBA8_ETC2_EAC,
			"etc2-rgba8unorm-srgb": t.etc.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC,
			"eac-r11unorm": t.etc.COMPRESSED_R11_EAC,
			"eac-rg11unorm": t.etc.COMPRESSED_SIGNED_RG11_EAC
		} : {},
		...t.astc ? {
			"astc-4x4-unorm": t.astc.COMPRESSED_RGBA_ASTC_4x4_KHR,
			"astc-4x4-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR,
			"astc-5x4-unorm": t.astc.COMPRESSED_RGBA_ASTC_5x4_KHR,
			"astc-5x4-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR,
			"astc-5x5-unorm": t.astc.COMPRESSED_RGBA_ASTC_5x5_KHR,
			"astc-5x5-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR,
			"astc-6x5-unorm": t.astc.COMPRESSED_RGBA_ASTC_6x5_KHR,
			"astc-6x5-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR,
			"astc-6x6-unorm": t.astc.COMPRESSED_RGBA_ASTC_6x6_KHR,
			"astc-6x6-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR,
			"astc-8x5-unorm": t.astc.COMPRESSED_RGBA_ASTC_8x5_KHR,
			"astc-8x5-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR,
			"astc-8x6-unorm": t.astc.COMPRESSED_RGBA_ASTC_8x6_KHR,
			"astc-8x6-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR,
			"astc-8x8-unorm": t.astc.COMPRESSED_RGBA_ASTC_8x8_KHR,
			"astc-8x8-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR,
			"astc-10x5-unorm": t.astc.COMPRESSED_RGBA_ASTC_10x5_KHR,
			"astc-10x5-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR,
			"astc-10x6-unorm": t.astc.COMPRESSED_RGBA_ASTC_10x6_KHR,
			"astc-10x6-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR,
			"astc-10x8-unorm": t.astc.COMPRESSED_RGBA_ASTC_10x8_KHR,
			"astc-10x8-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR,
			"astc-10x10-unorm": t.astc.COMPRESSED_RGBA_ASTC_10x10_KHR,
			"astc-10x10-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR,
			"astc-12x10-unorm": t.astc.COMPRESSED_RGBA_ASTC_12x10_KHR,
			"astc-12x10-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR,
			"astc-12x12-unorm": t.astc.COMPRESSED_RGBA_ASTC_12x12_KHR,
			"astc-12x12-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR
		} : {}
	};
}
var oy = o((() => {
	W();
}));
// node_modules/pixi.js/lib/rendering/renderers/gl/texture/utils/mapFormatToGlType.mjs
function sy(e) {
	return {
		r8unorm: e.UNSIGNED_BYTE,
		r8snorm: e.BYTE,
		r8uint: e.UNSIGNED_BYTE,
		r8sint: e.BYTE,
		r16uint: e.UNSIGNED_SHORT,
		r16sint: e.SHORT,
		r16float: e.HALF_FLOAT,
		rg8unorm: e.UNSIGNED_BYTE,
		rg8snorm: e.BYTE,
		rg8uint: e.UNSIGNED_BYTE,
		rg8sint: e.BYTE,
		r32uint: e.UNSIGNED_INT,
		r32sint: e.INT,
		r32float: e.FLOAT,
		rg16uint: e.UNSIGNED_SHORT,
		rg16sint: e.SHORT,
		rg16float: e.HALF_FLOAT,
		rgba8unorm: e.UNSIGNED_BYTE,
		"rgba8unorm-srgb": e.UNSIGNED_BYTE,
		rgba8snorm: e.BYTE,
		rgba8uint: e.UNSIGNED_BYTE,
		rgba8sint: e.BYTE,
		bgra8unorm: e.UNSIGNED_BYTE,
		"bgra8unorm-srgb": e.UNSIGNED_BYTE,
		rgb9e5ufloat: e.UNSIGNED_INT_5_9_9_9_REV,
		rgb10a2unorm: e.UNSIGNED_INT_2_10_10_10_REV,
		rg11b10ufloat: e.UNSIGNED_INT_10F_11F_11F_REV,
		rg32uint: e.UNSIGNED_INT,
		rg32sint: e.INT,
		rg32float: e.FLOAT,
		rgba16uint: e.UNSIGNED_SHORT,
		rgba16sint: e.SHORT,
		rgba16float: e.HALF_FLOAT,
		rgba32uint: e.UNSIGNED_INT,
		rgba32sint: e.INT,
		rgba32float: e.FLOAT,
		stencil8: e.UNSIGNED_BYTE,
		depth16unorm: e.UNSIGNED_SHORT,
		depth24plus: e.UNSIGNED_INT,
		"depth24plus-stencil8": e.UNSIGNED_INT_24_8,
		depth32float: e.FLOAT,
		"depth32float-stencil8": e.FLOAT_32_UNSIGNED_INT_24_8_REV
	};
}
var cy = o((() => {}));
// node_modules/pixi.js/lib/rendering/renderers/gl/texture/utils/mapViewDimensionToGlTarget.mjs
function ly(e) {
	return {
		"2d": e.TEXTURE_2D,
		cube: e.TEXTURE_CUBE_MAP,
		"1d": null,
		"3d": e?.TEXTURE_3D || null,
		"2d-array": e?.TEXTURE_2D_ARRAY || null,
		"cube-array": e?.TEXTURE_CUBE_MAP_ARRAY || null
	};
}
var uy = o((() => {})), dy, fy, py, my = o((() => {
	W(), h(), fm(), V(), Ln(), jv(), Pv(), Lv(), Bv(), Wv(), Yv(), ny(), iy(), oy(), cy(), uy(), dy = 4, fy = class e {
		constructor(t) {
			this._glSamplers = /* @__PURE__ */ Object.create(null), this._boundTextures = [], this._integerUnits = 0, this._activeTextureLocation = -1, this._boundSamplers = /* @__PURE__ */ Object.create(null), this._premultiplyAlpha = !1, this._useSeparateSamplers = !1, this._renderer = t, this._managedTextures = new dm({
				renderer: t,
				type: "resource",
				onUnload: this.onSourceUnload.bind(this),
				name: "glTexture"
			});
			let n = {
				image: Uv,
				buffer: Nv,
				video: Jv,
				compressed: Iv,
				...e.uploadExtensions
			};
			this._uploads = {
				...n,
				cube: Rv(n)
			};
		}
		get managedTextures() {
			return Object.values(this._managedTextures.items);
		}
		contextChange(e) {
			this._gl = e, this._mapFormatToInternalFormat || (this._mapFormatToInternalFormat = ay(e, this._renderer.context.extensions), this._mapFormatToType = sy(e), this._mapFormatToFormat = ry(e), this._mapViewDimensionToGlTarget = ly(e)), this._managedTextures.removeAll(!0), this._glSamplers = /* @__PURE__ */ Object.create(null), this._boundSamplers = /* @__PURE__ */ Object.create(null), this._premultiplyAlpha = !1;
			for (let e = 0; e < 16; e++) this.bind(B.EMPTY, e);
		}
		initSource(e) {
			this.bind(e);
		}
		bind(e, t = 0) {
			let n = e.source;
			e ? (this.bindSource(n, t), this._useSeparateSamplers && this._bindSampler(n.style, t)) : (this.bindSource(null, t), this._useSeparateSamplers && this._bindSampler(null, t));
		}
		bindSource(e, t = 0) {
			let n = this._gl;
			if (e._gcLastUsed = this._renderer.gc.now, this._boundTextures[t] !== e) {
				this._setBoundTexture(t, e), this._activateLocation(t), e ||= B.EMPTY.source;
				let r = this.getGlSource(e);
				n.bindTexture(r.target, r.texture);
			}
		}
		unbindIntegerTextures(e) {
			if (e >= 32) return;
			let t = this._integerUnits >>> e << e;
			for (; t;) {
				let e = 31 - Math.clz32(t);
				t &= ~(1 << e), this.bind(B.EMPTY, e);
			}
		}
		_setBoundTexture(e, t) {
			this._boundTextures[e] = t, e < 0 || e > 31 || t && t.viewDimension === "2d" && (In(t.format) ? this._integerUnits |= 1 << e : this._integerUnits &= ~(1 << e));
		}
		_bindSampler(e, t = 0) {
			let n = this._gl;
			if (!e) {
				this._boundSamplers[t] = null, n.bindSampler(t, null);
				return;
			}
			let r = this._getGlSampler(e);
			this._boundSamplers[t] !== r && (this._boundSamplers[t] = r, n.bindSampler(t, r));
		}
		unbind(e) {
			let t = e.source, n = this._boundTextures, r = this._gl;
			for (let e = 0; e < n.length; e++) if (n[e] === t) {
				this._activateLocation(e);
				let n = this.getGlSource(t);
				r.bindTexture(n.target, null), this._setBoundTexture(e, null);
			}
		}
		_activateLocation(e) {
			this._activeTextureLocation !== e && (this._activeTextureLocation = e, this._gl.activeTexture(this._gl.TEXTURE0 + e));
		}
		_initSource(e) {
			let t = this._gl, n = new Av(t.createTexture());
			if (n.type = this._mapFormatToType[e.format], n.internalFormat = this._mapFormatToInternalFormat[e.format], n.format = this._mapFormatToFormat[e.format], n.target = this._mapViewDimensionToGlTarget[e.viewDimension], n.target === null) throw Error(`Unsupported view dimension: ${e.viewDimension} with this webgl version: ${this._renderer.context.webGLVersion}`);
			if (e.autoGenerateMipmaps && (this._renderer.context.supports.nonPowOf2mipmaps || e.isPowerOfTwo)) {
				let t = Math.max(e.width, e.height, e.depth);
				e.mipLevelCount = Math.floor(Math.log2(t)) + 1;
			}
			return e._gpuData[this._renderer.uid] = n, this._managedTextures.add(e) && (e.on("update", this.onSourceUpdate, this), e.on("resize", this.onSourceUpdate, this), e.on("styleChange", this.onStyleChange, this), e.on("updateMipmaps", this.onUpdateMipmaps, this)), this.onSourceUpdate(e), this.updateStyle(e, !1), n;
		}
		onStyleChange(e) {
			this.updateStyle(e, !1);
		}
		updateStyle(e, t) {
			let n = this._gl, r = this.getGlSource(e);
			n.bindTexture(r.target, r.texture), this._setBoundTexture(this._activeTextureLocation, e), ty(e.style, n, e.mipLevelCount > 1, this._renderer.context.extensions.anisotropicFiltering, "texParameteri", r.target, !this._renderer.context.supports.nonPowOf2wrapping && !e.isPowerOfTwo, t);
		}
		onSourceUnload(e, t = !1) {
			let n = e._gpuData[this._renderer.uid];
			n && (t || (this.unbind(e), this._gl.deleteTexture(n.texture), n.msaaRenderBuffer && this._gl.deleteRenderbuffer(n.msaaRenderBuffer)), e.off("update", this.onSourceUpdate, this), e.off("resize", this.onSourceUpdate, this), e.off("styleChange", this.onStyleChange, this), e.off("updateMipmaps", this.onUpdateMipmaps, this));
		}
		onSourceUpdate(e) {
			let t = this._gl, n = this.getGlSource(e);
			t.bindTexture(n.target, n.texture), this._setBoundTexture(this._activeTextureLocation, e);
			let r = e.alphaMode === "premultiply-alpha-on-upload" && !In(e.format) && n.target !== t.TEXTURE_3D && n.target !== t.TEXTURE_2D_ARRAY;
			if (this._premultiplyAlpha !== r && (this._premultiplyAlpha = r, t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, r)), this._uploads[e.uploadMethodId]) this._uploads[e.uploadMethodId].upload(e, n, t, this._renderer.context.webGLVersion);
			else if (n.target === t.TEXTURE_2D) this._initEmptyTexture2D(n, e);
			else if (n.target === t.TEXTURE_2D_ARRAY || n.target === t.TEXTURE_3D) this._initEmptyTexture3D(n, e);
			else if (n.target === t.TEXTURE_CUBE_MAP) this._initEmptyTextureCube(n, e);
			else throw Error("[GlTextureSystem] Unsupported texture target for empty allocation.");
			this._applyMipRange(n, e), e.autoGenerateMipmaps && e.mipLevelCount > 1 && this.onUpdateMipmaps(e, !1);
		}
		onUpdateMipmaps(e, t = !0) {
			t && this.bindSource(e, 0);
			let n = this.getGlSource(e);
			this._gl.generateMipmap(n.target);
		}
		_initEmptyTexture2D(e, t) {
			let n = this._gl;
			n.texImage2D(n.TEXTURE_2D, 0, e.internalFormat, t.pixelWidth, t.pixelHeight, 0, e.format, e.type, null);
			let r = Math.max(t.pixelWidth >> 1, 1), i = Math.max(t.pixelHeight >> 1, 1);
			for (let a = 1; a < t.mipLevelCount; a++) n.texImage2D(n.TEXTURE_2D, a, e.internalFormat, r, i, 0, e.format, e.type, null), r = Math.max(r >> 1, 1), i = Math.max(i >> 1, 1);
		}
		_initEmptyTexture3D(e, t) {
			let n = this._gl, r = e.target === n.TEXTURE_3D, i = t.pixelWidth, a = t.pixelHeight, o = t.depthOrArrayLayers;
			for (let s = 0; s < t.mipLevelCount; s++) n.texImage3D(e.target, s, e.internalFormat, i, a, o, 0, e.format, e.type, null), i = Math.max(i >> 1, 1), a = Math.max(a >> 1, 1), r && (o = Math.max(o >> 1, 1));
		}
		_initEmptyTextureCube(e, t) {
			let n = this._gl;
			for (let r = 0; r < 6; r++) n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X + r, 0, e.internalFormat, t.pixelWidth, t.pixelHeight, 0, e.format, e.type, null);
			let r = Math.max(t.pixelWidth >> 1, 1), i = Math.max(t.pixelHeight >> 1, 1);
			for (let a = 1; a < t.mipLevelCount; a++) {
				for (let t = 0; t < 6; t++) n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X + t, a, e.internalFormat, r, i, 0, e.format, e.type, null);
				r = Math.max(r >> 1, 1), i = Math.max(i >> 1, 1);
			}
		}
		_applyMipRange(e, t) {
			if (this._renderer.context.webGLVersion !== 2 || t.mipLevelCount <= 1) return;
			let n = this._gl, r = Math.max((t.mipLevelCount | 0) - 1, 0);
			n.texParameteri(e.target, n.TEXTURE_BASE_LEVEL, 0), n.texParameteri(e.target, n.TEXTURE_MAX_LEVEL, r);
		}
		_initSampler(e) {
			let t = this._gl, n = this._gl.createSampler();
			return this._glSamplers[e._resourceId] = n, ty(e, t, this._boundTextures[this._activeTextureLocation].mipLevelCount > 1, this._renderer.context.extensions.anisotropicFiltering, "samplerParameteri", n, !1, !0), this._glSamplers[e._resourceId];
		}
		_getGlSampler(e) {
			return this._glSamplers[e._resourceId] || this._initSampler(e);
		}
		getGlSource(e) {
			return e._gcLastUsed = this._renderer.gc.now, e._gpuData[this._renderer.uid] || this._initSource(e);
		}
		getMsaaRenderBuffer(e) {
			let t = this._gl, n = this.getGlSource(e);
			return n.msaaRenderBuffer ??= t.createRenderbuffer(), (n.msaaWidth !== e.pixelWidth || n.msaaHeight !== e.pixelHeight) && (n.msaaWidth = e.pixelWidth, n.msaaHeight = e.pixelHeight, t.bindRenderbuffer(t.RENDERBUFFER, n.msaaRenderBuffer), t.renderbufferStorageMultisample(t.RENDERBUFFER, 4, n.internalFormat, e.pixelWidth, e.pixelHeight)), n.msaaRenderBuffer;
		}
		generateCanvas(e) {
			let { pixels: t, width: n, height: r } = this.getPixels(e), i = U.get().createCanvas();
			i.width = n, i.height = r;
			let a = i.getContext("2d");
			if (a) {
				let e = a.createImageData(n, r);
				e.data.set(t), a.putImageData(e, 0, 0);
			}
			return i;
		}
		getPixels(e) {
			let t = e.source.resolution, n = e.frame, r = Math.max(Math.round(n.width * t), 1), i = Math.max(Math.round(n.height * t), 1), a = new Uint8Array(dy * r * i), o = this._renderer, s = o.renderTarget.getRenderTarget(e), c = o.renderTarget.getGpuRenderTarget(s), l = o.gl;
			return o.renderTarget.adaptor.bindFramebuffer(c.resolveTargetFramebuffer), l.readPixels(Math.round(n.x * t), Math.round(n.y * t), r, i, l.RGBA, l.UNSIGNED_BYTE, a), {
				pixels: new Uint8ClampedArray(a.buffer),
				width: r,
				height: i
			};
		}
		destroy() {
			this._managedTextures.destroy(), this._glSamplers = null, this._boundTextures = null, this._boundSamplers = null, this._mapFormatToInternalFormat = null, this._mapFormatToType = null, this._mapFormatToFormat = null, this._uploads = null, this._renderer = null;
		}
		resetState() {
			let e = this._renderer.limits.maxTextures;
			this._activeTextureLocation = -1, this._boundTextures.fill(null), this._integerUnits = e >= 32 ? -1 : (1 << e) - 1, this._boundSamplers = /* @__PURE__ */ Object.create(null);
			let t = this._gl;
			this._premultiplyAlpha = !1, t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this._premultiplyAlpha);
		}
	}, fy.extension = {
		type: [d.WebGLSystem],
		name: "texture"
	}, fy.uploadExtensions = /* @__PURE__ */ Object.create(null), py = fy, m.handleByMap(d.TextureUploaderWebGL, py.uploadExtensions);
})), hy = /* @__PURE__ */ c({ WebGLRenderer: () => Cy }), gy, _y, vy, yy, by, xy, Sy, Cy, wy = o((() => {
	h(), Lg(), zg(), Vg(), ou(), om(), Gs(), qg(), Xg(), o_(), u_(), f_(), m_(), g_(), v_(), D_(), N_(), dv(), vv(), kv(), my(), gy = [
		...im,
		E_,
		l_,
		Yg,
		h_,
		Kg,
		py,
		M_,
		a_,
		_v,
		uv,
		p_,
		Ov,
		__,
		d_
	], _y = [...am], vy = [
		Bg,
		Rg,
		Ig
	], yy = [], by = [], xy = [], Sy = [], m.handleByNamedList(d.WebGLSystem, yy), m.handleByNamedList(d.WebGLPipes, by), m.handleByNamedList(d.WebGLPipesAdaptor, xy), m.handleByNamedList(d.WebGLLoader, Sy), m.add(...gy, ..._y, ...vy), Cy = class extends au {
		constructor() {
			let e = {
				name: "webgl",
				type: Ws.WEBGL,
				systems: yy,
				renderPipes: by,
				renderPipeAdaptors: xy,
				loaders: Sy
			};
			super(e);
		}
	};
})), Ty, Ey, Dy = o((() => {
	Ty = 1e-4, Ey = 1e-4;
}));
// node_modules/pixi.js/lib/scene/graphics/shared/buildCommands/buildLine.mjs
function Oy(e, t, n, r, i, a, o, s) {
	let c = e - n * i, l = t - r * i, u = e + n * a, d = t + r * a, f, p;
	o ? (f = r, p = -n) : (f = -r, p = n);
	let m = c + f, h = l + p, g = u + f, _ = d + p;
	return s.push(m, h), s.push(g, _), 2;
}
function ky(e, t, n, r, i, a, o, s) {
	let c = n - e, l = r - t, u = Math.atan2(c, l), d = Math.atan2(i - e, a - t);
	s && u < d ? u += Math.PI * 2 : !s && u > d && (d += Math.PI * 2);
	let f = u, p = d - u, m = Math.abs(p), h = Math.sqrt(c * c + l * l), g = (15 * m * Math.sqrt(h) / Math.PI | 0) + 1, _ = p / g;
	if (f += _, s) {
		o.push(e, t), o.push(n, r);
		for (let n = 1, r = f; n < g; n++, r += _) o.push(e, t), o.push(e + Math.sin(r) * h, t + Math.cos(r) * h);
		o.push(e, t), o.push(i, a);
	} else {
		o.push(n, r), o.push(e, t);
		for (let n = 1, r = f; n < g; n++, r += _) o.push(e + Math.sin(r) * h, t + Math.cos(r) * h), o.push(e, t);
		o.push(i, a), o.push(e, t);
	}
	return g * 2;
}
function Ay(e, t, n, r, i, a) {
	let o = Ty;
	if (e.length === 0) return;
	let s = t, c = s.alignment;
	if (t.alignment !== .5) {
		let t = io(e);
		n && (t *= -1), c = (c - .5) * t + .5;
	}
	let l = new Ie(e[0], e[1]), u = new Ie(e[e.length - 2], e[e.length - 1]), d = r, f = Math.abs(l.x - u.x) < o && Math.abs(l.y - u.y) < o;
	if (d) {
		e = e.slice(), f && (e.pop(), e.pop(), u.set(e[e.length - 2], e[e.length - 1]));
		let t = (l.x + u.x) * .5, n = (u.y + l.y) * .5;
		e.unshift(t, n), e.push(t, n);
	}
	let p = i, m = e.length / 2, h = e.length, g = p.length / 2, _ = s.width / 2, v = _ * _, y = s.miterLimit * s.miterLimit, b = e[0], x = e[1], S = e[2], C = e[3], w = 0, ee = 0, T = -(x - C), E = b - S, te = 0, ne = 0, re = Math.sqrt(T * T + E * E);
	T /= re, E /= re, T *= _, E *= _;
	let ie = c, D = (1 - ie) * 2, O = ie * 2;
	d || (s.cap === "round" ? h += ky(b - T * (D - O) * .5, x - E * (D - O) * .5, b - T * D, x - E * D, b + T * O, x + E * O, p, !0) + 2 : s.cap === "square" && (h += Oy(b, x, T, E, D, O, !0, p))), p.push(b - T * D, x - E * D), p.push(b + T * O, x + E * O);
	for (let t = 1; t < m - 1; ++t) {
		b = e[(t - 1) * 2], x = e[(t - 1) * 2 + 1], S = e[t * 2], C = e[t * 2 + 1], w = e[(t + 1) * 2], ee = e[(t + 1) * 2 + 1], T = -(x - C), E = b - S, re = Math.sqrt(T * T + E * E), T /= re, E /= re, T *= _, E *= _, te = -(C - ee), ne = S - w, re = Math.sqrt(te * te + ne * ne), te /= re, ne /= re, te *= _, ne *= _;
		let n = S - b, r = x - C, i = S - w, a = ee - C, o = n * i + r * a, c = r * i - a * n, l = c < 0;
		if (Math.abs(c) < .001 * Math.abs(o)) {
			p.push(S - T * D, C - E * D), p.push(S + T * O, C + E * O), o >= 0 && (s.join === "round" ? h += ky(S, C, S - T * D, C - E * D, S - te * D, C - ne * D, p, !1) + 4 : h += 2, p.push(S - te * O, C - ne * O), p.push(S + te * D, C + ne * D));
			continue;
		}
		let u = (-T + b) * (-E + C) - (-T + S) * (-E + x), d = (-te + w) * (-ne + C) - (-te + S) * (-ne + ee), f = (n * d - i * u) / c, m = (a * u - r * d) / c, g = (f - S) * (f - S) + (m - C) * (m - C), ie = S + (f - S) * D, ae = C + (m - C) * D, oe = S - (f - S) * O, se = C - (m - C) * O, ce = Math.min(n * n + r * r, i * i + a * a), le = l ? D : O;
		g <= ce + le * le * v ? s.join === "bevel" || g / v > y ? (l ? (p.push(ie, ae), p.push(S + T * O, C + E * O), p.push(ie, ae), p.push(S + te * O, C + ne * O)) : (p.push(S - T * D, C - E * D), p.push(oe, se), p.push(S - te * D, C - ne * D), p.push(oe, se)), h += 2) : s.join === "round" ? l ? (p.push(ie, ae), p.push(S + T * O, C + E * O), h += ky(S, C, S + T * O, C + E * O, S + te * O, C + ne * O, p, !0) + 4, p.push(ie, ae), p.push(S + te * O, C + ne * O)) : (p.push(S - T * D, C - E * D), p.push(oe, se), h += ky(S, C, S - T * D, C - E * D, S - te * D, C - ne * D, p, !1) + 4, p.push(S - te * D, C - ne * D), p.push(oe, se)) : (p.push(ie, ae), p.push(oe, se)) : (p.push(S - T * D, C - E * D), p.push(S + T * O, C + E * O), s.join === "round" ? h += l ? ky(S, C, S + T * O, C + E * O, S + te * O, C + ne * O, p, !0) + 2 : ky(S, C, S - T * D, C - E * D, S - te * D, C - ne * D, p, !1) + 2 : s.join === "miter" && g / v <= y && (l ? (p.push(oe, se), p.push(oe, se)) : (p.push(ie, ae), p.push(ie, ae)), h += 2), p.push(S - te * D, C - ne * D), p.push(S + te * O, C + ne * O), h += 2);
	}
	b = e[(m - 2) * 2], x = e[(m - 2) * 2 + 1], S = e[(m - 1) * 2], C = e[(m - 1) * 2 + 1], T = -(x - C), E = b - S, re = Math.sqrt(T * T + E * E), T /= re, E /= re, T *= _, E *= _, p.push(S - T * D, C - E * D), p.push(S + T * O, C + E * O), d || (s.cap === "round" ? h += ky(S - T * (D - O) * .5, C - E * (D - O) * .5, S - T * D, C - E * D, S + T * O, C + E * O, p, !1) + 2 : s.cap === "square" && (h += Oy(S, C, T, E, D, O, !1, p)));
	let ae = Ey * Ey;
	for (let e = g; e < h + g - 2; ++e) b = p[e * 2], x = p[e * 2 + 1], S = p[(e + 1) * 2], C = p[(e + 1) * 2 + 1], w = p[(e + 2) * 2], ee = p[(e + 2) * 2 + 1], Math.abs(b * (C - ee) + S * (ee - x) + w * (x - C)) < ae || a.push(e, e + 1, e + 2);
}
var jy = o((() => {
	ao(), Re(), Dy();
}));
// node_modules/pixi.js/lib/scene/graphics/shared/fill/FillGradient.mjs
function My(e, t) {
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		e.addColorStop(r.offset, r.color);
	}
}
function Ny(e, t) {
	let n = U.get().createCanvas(e, t);
	return {
		canvas: n,
		context: n.getContext("2d")
	};
}
function Py(e) {
	let t = e[0] ?? {};
	return (typeof t == "number" || e[1]) && (F("8.5.2", "use options object instead"), t = {
		type: "linear",
		start: {
			x: e[0],
			y: e[1]
		},
		end: {
			x: e[2],
			y: e[3]
		},
		textureSpace: e[4],
		textureSize: e[5] ?? Ly.defaultLinearOptions.textureSize
	}), t;
}
var Fy, Iy, Ly, Ry = o((() => {
	ke(), W(), M(), Ma(), V(), We(), Xe(), mn(), Fy = [{
		offset: 0,
		color: "white"
	}, {
		offset: 1,
		color: "black"
	}], Iy = class e {
		constructor(...t) {
			this.uid = N("fillGradient"), this._tick = 0, this.type = "linear", this.colorStops = [];
			let n = Py(t);
			n = {
				...n.type === "radial" ? e.defaultRadialOptions : e.defaultLinearOptions,
				...pn(n)
			}, this._textureSize = n.textureSize, this._wrapMode = n.wrapMode, n.type === "radial" ? (this.center = n.center, this.outerCenter = n.outerCenter ?? this.center, this.innerRadius = n.innerRadius, this.outerRadius = n.outerRadius, this.scale = n.scale, this.rotation = n.rotation) : (this.start = n.start, this.end = n.end), this.textureSpace = n.textureSpace, this.type = n.type, n.colorStops.forEach((e) => {
				this.addColorStop(e.offset, e.color);
			});
		}
		addColorStop(e, t) {
			return this.colorStops.push({
				offset: e,
				color: A.shared.setValue(t).toHexa()
			}), this;
		}
		buildLinearGradient() {
			if (this.texture) return;
			let { x: e, y: t } = this.start, { x: n, y: r } = this.end, i = n - e, a = r - t, o = i < 0 || a < 0;
			if (this._wrapMode === "clamp-to-edge") {
				if (i < 0) {
					let t = e;
					e = n, n = t, i *= -1;
				}
				if (a < 0) {
					let e = t;
					t = r, r = e, a *= -1;
				}
			}
			let s = this.colorStops.length ? this.colorStops : Fy, c = this._textureSize, { canvas: l, context: u } = Ny(c, 1), d = o ? u.createLinearGradient(this._textureSize, 0, 0, 0) : u.createLinearGradient(0, 0, this._textureSize, 0);
			My(d, s), u.fillStyle = d, u.fillRect(0, 0, c, 1), this.texture = new B({ source: new ja({
				resource: l,
				addressMode: this._wrapMode
			}) });
			let f = Math.sqrt(i * i + a * a), p = Math.atan2(a, i), m = new j();
			m.scale(f / c, 1), m.rotate(p), m.translate(e, t), this.textureSpace === "local" && m.scale(c, c), this.transform = m;
		}
		buildGradient() {
			this.texture || this._tick++, this.type === "linear" ? this.buildLinearGradient() : this.buildRadialGradient();
		}
		buildRadialGradient() {
			if (this.texture) return;
			let e = this.colorStops.length ? this.colorStops : Fy, t = this._textureSize, { canvas: n, context: r } = Ny(t, t), { x: i, y: a } = this.center, { x: o, y: s } = this.outerCenter, c = this.innerRadius, l = this.outerRadius, u = o - l, d = s - l, f = t / (l * 2), p = (i - u) * f, m = (a - d) * f, h = r.createRadialGradient(p, m, c * f, (o - u) * f, (s - d) * f, l * f);
			My(h, e), r.fillStyle = e[e.length - 1].color, r.fillRect(0, 0, t, t), r.fillStyle = h, r.translate(p, m), r.rotate(this.rotation), r.scale(1, this.scale), r.translate(-p, -m), r.fillRect(0, 0, t, t), this.texture = new B({ source: new ja({
				resource: n,
				addressMode: this._wrapMode
			}) });
			let g = new j();
			this.textureSpace === "local" ? g.scale(2 * l, 2 * l) : g.scale(1 / f, 1 / f), g.translate(u, d), this.transform = g;
		}
		destroy() {
			this.texture?.destroy(!0), this.texture = null, this.transform = null, this.colorStops = [], this.start = null, this.end = null, this.center = null, this.outerCenter = null;
		}
		get styleKey() {
			return `fill-gradient-${this.uid}-${this._tick}`;
		}
	}, Iy.defaultLinearOptions = {
		start: {
			x: 0,
			y: 0
		},
		end: {
			x: 0,
			y: 1
		},
		colorStops: [],
		textureSpace: "local",
		type: "linear",
		textureSize: 256,
		wrapMode: "clamp-to-edge"
	}, Iy.defaultRadialOptions = {
		center: {
			x: .5,
			y: .5
		},
		innerRadius: 0,
		outerRadius: .5,
		colorStops: [],
		scale: 1,
		rotation: 0,
		textureSpace: "local",
		type: "radial",
		textureSize: 256,
		wrapMode: "clamp-to-edge"
	}, Ly = Iy;
}));
// node_modules/pixi.js/lib/scene/graphics/shared/fill/FillPattern.mjs
function zy(e) {
	return e.texture !== void 0;
}
var By, Vy, Hy = o((() => {
	M(), We(), By = {
		repeat: {
			addressModeU: "repeat",
			addressModeV: "repeat"
		},
		"repeat-x": {
			addressModeU: "repeat",
			addressModeV: "clamp-to-edge"
		},
		"repeat-y": {
			addressModeU: "clamp-to-edge",
			addressModeV: "repeat"
		},
		"no-repeat": {
			addressModeU: "clamp-to-edge",
			addressModeV: "clamp-to-edge"
		}
	}, Vy = class {
		constructor(e, t) {
			this.uid = N("fillPattern"), this._tick = 0, this.transform = new j();
			let n = zy(e) ? e : {
				texture: e,
				repetition: t
			};
			this.texture = n.texture, this.textureSpace = n.textureSpace ?? "global";
			let r = n.repetition;
			r && (this.texture.source.style.addressModeU = By[r].addressModeU, this.texture.source.style.addressModeV = By[r].addressModeV);
		}
		setTransform(e) {
			if (e) {
				if (this.transform.equals(e)) return;
				this.transform.copyFrom(e);
			} else {
				if (this.transform.isIdentity()) return;
				this.transform.identity();
			}
			this._tick++;
		}
		get texture() {
			return this._texture;
		}
		set texture(e) {
			this._texture !== e && (this._texture = e, this._tick++);
		}
		get styleKey() {
			return `fill-pattern-${this.uid}-${this._tick}`;
		}
		destroy() {
			this.texture.destroy(!0), this.texture = null;
		}
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/shared/geometry/utils/buildUvs.mjs
function Uy(e, t, n, r, i, a, o, s = null) {
	let c = 0;
	n *= t, i *= a;
	let l = s.a, u = s.b, d = s.c, f = s.d, p = s.tx, m = s.ty;
	for (; c < o;) {
		let o = e[n], s = e[n + 1];
		r[i] = l * o + d * s + p, r[i + 1] = u * o + f * s + m, i += a, n += t, c++;
	}
}
function Wy(e, t, n, r) {
	let i = 0;
	for (t *= n; i < r;) e[t] = 0, e[t + 1] = 0, t += n, i++;
}
var Gy = o((() => {}));
// node_modules/pixi.js/lib/rendering/renderers/shared/geometry/utils/transformVertices.mjs
function Ky(e, t, n, r, i) {
	let a = t.a, o = t.b, s = t.c, c = t.d, l = t.tx, u = t.ty;
	n ||= 0, r ||= 2, i ||= e.length / r - n;
	let d = n * r;
	for (let t = 0; t < i; t++) {
		let t = e[d], n = e[d + 1];
		e[d] = a * t + s * n + l, e[d + 1] = o * t + c * n + u, d += r;
	}
}
var qy = o((() => {})), Jy, Yy, Xy = o((() => {
	M(), zt(), Jy = new j(), Yy = class {
		constructor() {
			this.packAsQuad = !1, this.topology = "triangle-list", this.applyTransform = !0, this.roundPixels = 0, this._batcher = null, this._batch = null;
		}
		get blendMode() {
			return this.renderable && this.applyTransform ? this.renderable.groupBlendMode : "normal";
		}
		get color() {
			let e = this.baseColor, t = e >> 16 | e & 65280 | (e & 255) << 16, n = this.renderable;
			return n ? Rt(t, n.groupColor) + (this.alpha * n.groupAlpha * 255 << 24) : t + (this.alpha * 255 << 24);
		}
		get transform() {
			return this.renderable?.groupTransform || Jy;
		}
		reset() {
			this.applyTransform = !0, this.renderable = null, this.topology = "triangle-list";
		}
		destroy() {
			this.renderable = null, this.texture = null, this._batcher = null, this._batch = null;
		}
	};
})), Zy, Qy = o((() => {
	Xy(), Zy = class extends Yy {
		constructor() {
			super(...arguments), this.batcherName = "default";
		}
		get uvs() {
			return this.geometryData.uvs;
		}
		get positions() {
			return this.geometryData.vertices;
		}
		get indices() {
			return this.geometryData.indices;
		}
		copyTo(e) {
			e.indexOffset = this.indexOffset, e.indexSize = this.indexSize, e.attributeOffset = this.attributeOffset, e.attributeSize = this.attributeSize, e.baseColor = this.baseColor, e.alpha = this.alpha, e.texture = this.texture, e.geometryData = this.geometryData, e.topology = this.topology;
		}
		destroy() {
			super.destroy(), this.geometryData = null;
		}
	};
})), $y, eb, tb, nb = o((() => {
	h(), $y = {
		extension: {
			type: d.ShapeBuilder,
			name: "circle"
		},
		build(e, t) {
			let n, r, i, a, o, s;
			if (e.type === "circle") {
				let t = e;
				if (o = s = t.radius, o <= 0) return !1;
				n = t.x, r = t.y, i = a = 0;
			} else if (e.type === "ellipse") {
				let t = e;
				if (o = t.halfWidth, s = t.halfHeight, o <= 0 || s <= 0) return !1;
				n = t.x, r = t.y, i = a = 0;
			} else {
				let t = e, c = t.width / 2, l = t.height / 2;
				n = t.x + c, r = t.y + l, o = s = Math.max(0, Math.min(t.radius, Math.min(c, l))), i = c - o, a = l - s;
			}
			if (i < 0 || a < 0) return !1;
			let c = Math.ceil(2.3 * Math.sqrt(o + s)), l = c * 8 + (i ? 4 : 0) + (a ? 4 : 0);
			if (l === 0) return !1;
			if (c === 0) return t[0] = t[6] = n + i, t[1] = t[3] = r + a, t[2] = t[4] = n - i, t[5] = t[7] = r - a, !0;
			let u = 0, d = c * 4 + (i ? 2 : 0) + 2, f = d, p = l, m = i + o, h = a, g = n + m, _ = n - m, v = r + h;
			if (t[u++] = g, t[u++] = v, t[--d] = v, t[--d] = _, a) {
				let e = r - h;
				t[f++] = _, t[f++] = e, t[--p] = e, t[--p] = g;
			}
			for (let e = 1; e < c; e++) {
				let l = Math.PI / 2 * (e / c), m = i + Math.cos(l) * o, h = a + Math.sin(l) * s, g = n + m, _ = n - m, v = r + h, y = r - h;
				t[u++] = g, t[u++] = v, t[--d] = v, t[--d] = _, t[f++] = _, t[f++] = y, t[--p] = y, t[--p] = g;
			}
			m = i, h = a + s, g = n + m, _ = n - m, v = r + h;
			let y = r - h;
			return t[u++] = g, t[u++] = v, t[--p] = y, t[--p] = g, i && (t[u++] = _, t[u++] = v, t[--p] = y, t[--p] = _), !0;
		},
		triangulate(e, t, n, r, i, a) {
			if (e.length === 0) return;
			let o = 0, s = 0;
			for (let t = 0; t < e.length; t += 2) o += e[t], s += e[t + 1];
			o /= e.length / 2, s /= e.length / 2;
			let c = r;
			t[c * n] = o, t[c * n + 1] = s;
			let l = c++;
			for (let r = 0; r < e.length; r += 2) t[c * n] = e[r], t[c * n + 1] = e[r + 1], r > 0 && (i[a++] = c, i[a++] = l, i[a++] = c - 1), c++;
			i[a++] = l + 1, i[a++] = l, i[a++] = c - 1;
		}
	}, eb = {
		...$y,
		extension: {
			...$y.extension,
			name: "ellipse"
		}
	}, tb = {
		...$y,
		extension: {
			...$y.extension,
			name: "roundedRectangle"
		}
	};
}));
// node_modules/pixi.js/lib/scene/graphics/shared/buildCommands/buildPixelLine.mjs
function rb(e, t, n, r) {
	let i = Ty;
	if (e.length === 0) return;
	let a = e[0], o = e[1], s = e[e.length - 2], c = e[e.length - 1], l = t || Math.abs(a - s) < i && Math.abs(o - c) < i, u = n, d = e.length / 2, f = u.length / 2;
	for (let t = 0; t < d; t++) u.push(e[t * 2]), u.push(e[t * 2 + 1]);
	for (let e = 0; e < d - 1; e++) r.push(f + e, f + e + 1);
	l && r.push(f + d - 1, f);
}
var ib = o((() => {
	Dy();
}));
// node_modules/pixi.js/lib/scene/graphics/shared/utils/triangulateWithHoles.mjs
function ab(e, t, n, r, i, a, o) {
	let s = Zl(e, t, 2);
	if (!s) return;
	for (let e = 0; e < s.length; e += 3) a[o++] = s[e] + i, a[o++] = s[e + 1] + i, a[o++] = s[e + 2] + i;
	let c = i * r;
	for (let t = 0; t < e.length; t += 2) n[c] = e[t], n[c + 1] = e[t + 1], c += r;
}
var ob = o((() => {
	Ql();
})), sb, cb, lb = o((() => {
	h(), ob(), sb = [], cb = {
		extension: {
			type: d.ShapeBuilder,
			name: "polygon"
		},
		build(e, t) {
			for (let n = 0; n < e.points.length; n++) t[n] = e.points[n];
			return !0;
		},
		triangulate(e, t, n, r, i, a) {
			ab(e, sb, t, n, r, i, a);
		}
	};
})), ub, db = o((() => {
	h(), ub = {
		extension: {
			type: d.ShapeBuilder,
			name: "rectangle"
		},
		build(e, t) {
			let n = e, r = n.x, i = n.y, a = n.width, o = n.height;
			return a > 0 && o > 0 && (t[0] = r, t[1] = i, t[2] = r + a, t[3] = i, t[4] = r + a, t[5] = i + o, t[6] = r, t[7] = i + o, !0);
		},
		triangulate(e, t, n, r, i, a) {
			let o = 0;
			r *= n, t[r + o] = e[0], t[r + o + 1] = e[1], o += n, t[r + o] = e[2], t[r + o + 1] = e[3], o += n, t[r + o] = e[6], t[r + o + 1] = e[7], o += n, t[r + o] = e[4], t[r + o + 1] = e[5], o += n;
			let s = r / n;
			i[a++] = s, i[a++] = s + 1, i[a++] = s + 2, i[a++] = s + 1, i[a++] = s + 3, i[a++] = s + 2;
		}
	};
})), fb, pb = o((() => {
	h(), fb = {
		extension: {
			type: d.ShapeBuilder,
			name: "triangle"
		},
		build(e, t) {
			return t[0] = e.x, t[1] = e.y, t[2] = e.x2, t[3] = e.y2, t[4] = e.x3, t[5] = e.y3, !0;
		},
		triangulate(e, t, n, r, i, a) {
			let o = 0;
			r *= n, t[r + o] = e[0], t[r + o + 1] = e[1], o += n, t[r + o] = e[2], t[r + o + 1] = e[3], o += n, t[r + o] = e[4], t[r + o + 1] = e[5];
			let s = r / n;
			i[a++] = s, i[a++] = s + 1, i[a++] = s + 2;
		}
	};
}));
// node_modules/pixi.js/lib/scene/graphics/shared/utils/generateTextureFillMatrix.mjs
function mb(e, t, n, r) {
	let i = t.matrix ? e.copyFrom(t.matrix).invert() : e.identity();
	if (t.textureSpace === "local") {
		let e = n.getBounds(gb);
		t.width && e.pad(t.width);
		let { x: r, y: a } = e, o = 1 / e.width, s = 1 / e.height, c = -r * o, l = -a * s, u = i.a, d = i.b, f = i.c, p = i.d;
		i.a *= o, i.b *= o, i.c *= s, i.d *= s, i.tx = c * u + l * f + i.tx, i.ty = c * d + l * p + i.ty;
	} else if (t.texture.rotate) {
		let { uvs: e, orig: n } = t.texture;
		i.scale(1 / n.width, 1 / n.height), i.prepend(_b.set(e.x1 - e.x0, e.y1 - e.y0, e.x3 - e.x0, e.y3 - e.y0, e.x0, e.y0));
	} else i.translate(t.texture.frame.x, t.texture.frame.y), i.scale(1 / t.texture.source.width, 1 / t.texture.source.height);
	let a = t.texture.source.style;
	return !(t.fill instanceof Ly) && a.addressMode === "clamp-to-edge" && (a.addressMode = "repeat", a.update()), r && i.append(hb.copyFrom(r).invert()), i;
}
var hb, gb, _b, vb = o((() => {
	M(), wt(), Ry(), hb = new j(), gb = new R(), _b = new j();
}));
// node_modules/pixi.js/lib/scene/graphics/shared/utils/buildContextBatches.mjs
function yb(e, t) {
	let { geometryData: n, batches: r } = t;
	r.length = 0, n.indices.length = 0, n.vertices.length = 0, n.uvs.length = 0;
	for (let t = 0; t < e.instructions.length; t++) {
		let i = e.instructions[t];
		if (i.action === "texture") bb(i.data, r, n);
		else if (i.action === "fill" || i.action === "stroke") {
			let e = i.action === "stroke", t = i.data.path.shapePath, a = i.data.style, o = i.data.hole;
			e && o && xb(o.shapePath, a, !0, r, n), o && (t.shapePrimitives[t.shapePrimitives.length - 1].holes = o.shapePath.shapePrimitives), xb(t, a, e, r, n);
		}
	}
}
function bb(e, t, n) {
	let r = [], i = Cb.rectangle, a = wb;
	a.x = e.dx, a.y = e.dy, a.width = e.dw, a.height = e.dh;
	let o = e.transform;
	if (!i.build(a, r)) return;
	let { vertices: s, uvs: c, indices: l } = n, u = l.length, d = s.length / 2;
	o && Ky(r, o), i.triangulate(r, s, 2, d, l, u);
	let f = e.image, p = f.uvs;
	c.push(p.x0, p.y0, p.x1, p.y1, p.x3, p.y3, p.x2, p.y2);
	let m = it.get(Zy);
	m.indexOffset = u, m.indexSize = l.length - u, m.attributeOffset = d, m.attributeSize = s.length / 2 - d, m.baseColor = e.style, m.alpha = e.alpha, m.texture = f, m.geometryData = n, t.push(m);
}
function xb(e, t, n, r, i) {
	let { vertices: a, uvs: o, indices: s } = i;
	e.shapePrimitives.forEach(({ shape: e, transform: c, holes: l }) => {
		let u = [], d = Cb[e.type];
		if (!d.build(e, u)) return;
		let f = s.length, p = a.length / 2, m = "triangle-list";
		if (c && Ky(u, c), n) {
			let n = e.closePath ?? !0, r = t;
			r.pixelLine ? (rb(u, n, a, s), m = "line-list") : Ay(u, r, !1, n, a, s);
		} else if (l) {
			let e = [], t = u.slice();
			Sb(l).forEach((n) => {
				e.push(t.length / 2), t.push(...n);
			}), ab(t, e, a, 2, p, s, f);
		} else d.triangulate(u, a, 2, p, s, f);
		let h = o.length / 2, g = t.texture;
		if (g !== B.WHITE) {
			let n = mb(Tb, t, e, c);
			Uy(a, 2, p, o, h, 2, a.length / 2 - p, n);
		} else Wy(o, h, 2, a.length / 2 - p);
		let _ = it.get(Zy);
		_.indexOffset = f, _.indexSize = s.length - f, _.attributeOffset = p, _.attributeSize = a.length / 2 - p, _.baseColor = t.color, _.alpha = t.alpha, _.texture = g, _.geometryData = i, _.topology = m, r.push(_);
	});
}
function Sb(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) {
		let r = e[n].shape, i = [];
		Cb[r.type].build(r, i) && t.push(i);
	}
	return t;
}
var Cb, wb, Tb, Eb = o((() => {
	h(), M(), wt(), Gy(), qy(), V(), at(), Qy(), nb(), jy(), ib(), lb(), db(), pb(), vb(), ob(), Cb = {}, m.handleByMap(d.ShapeBuilder, Cb), m.add(ub, cb, fb, $y, eb, tb), wb = new R(), Tb = new j();
}));
// node_modules/pixi.js/lib/scene/graphics/canvas/CanvasGraphicsAdaptor.mjs
function Db(e, t, n) {
	e.beginPath();
	for (let r = 0; r < n.length; r += 3) {
		let i = n[r] * 2, a = n[r + 1] * 2, o = n[r + 2] * 2;
		e.moveTo(t[i], t[i + 1]), e.lineTo(t[a], t[a + 1]), e.lineTo(t[o], t[o + 1]), e.closePath();
	}
	e.fill();
}
function Ob(e) {
	return `#${(e & 16777215).toString(16).padStart(6, "0")}`;
}
function kb(e, t, n, r, i, a) {
	a = Math.max(0, Math.min(a, Math.min(r, i) / 2)), e.moveTo(t + a, n), e.lineTo(t + r - a, n), e.quadraticCurveTo(t + r, n, t + r, n + a), e.lineTo(t + r, n + i - a), e.quadraticCurveTo(t + r, n + i, t + r - a, n + i), e.lineTo(t + a, n + i), e.quadraticCurveTo(t, n + i, t, n + i - a), e.lineTo(t, n + a), e.quadraticCurveTo(t, n, t + a, n);
}
function Ab(e, t) {
	switch (t.type) {
		case "rectangle": {
			let n = t;
			e.rect(n.x, n.y, n.width, n.height);
			break;
		}
		case "roundedRectangle": {
			let n = t;
			kb(e, n.x, n.y, n.width, n.height, n.radius);
			break;
		}
		case "circle": {
			let n = t;
			e.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
			break;
		}
		case "ellipse": {
			let n = t;
			e.ellipse ? e.ellipse(n.x, n.y, n.halfWidth, n.halfHeight, 0, 0, Math.PI * 2) : (e.save(), e.translate(n.x, n.y), e.scale(n.halfWidth, n.halfHeight), e.arc(0, 0, 1, 0, Math.PI * 2), e.restore());
			break;
		}
		case "triangle": {
			let n = t;
			e.moveTo(n.x, n.y), e.lineTo(n.x2, n.y2), e.lineTo(n.x3, n.y3), e.closePath();
			break;
		}
		default: {
			let n = t, r = n.points;
			if (!r?.length) break;
			e.moveTo(r[0], r[1]);
			for (let t = 2; t < r.length; t += 2) e.lineTo(r[t], r[t + 1]);
			n.closePath && e.closePath();
			break;
		}
	}
}
function jb(e, t) {
	if (!t?.length) return !1;
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		if (!r?.shape) continue;
		let i = r.transform, a = i && !i.isIdentity();
		a && (e.save(), e.transform(i.a, i.b, i.c, i.d, i.tx, i.ty)), Ab(e, r.shape), a && e.restore();
	}
	return !0;
}
function Mb(e, t, n, r) {
	let i = e.fill;
	if (i instanceof Ly) {
		i.buildGradient();
		let a = i.texture;
		if (a) {
			let o = G.getTintedPattern(a, t), s = n ? Lb.copyFrom(n).scale(a.source.pixelWidth, a.source.pixelHeight) : Lb.copyFrom(i.transform);
			return r && !e.textureSpace && s.append(r), G.applyPatternTransform(o, s), o;
		}
	}
	if (i instanceof Vy) {
		let e = G.getTintedPattern(i.texture, t);
		return G.applyPatternTransform(e, i.transform, !1), e;
	}
	let a = e.texture;
	if (a && a !== B.WHITE) {
		if (!a.source.resource) return Nb;
		let r = G.getTintedPattern(a, t), i = e.matrix;
		if (n) {
			let { resolution: e } = a.source;
			if (i = Lb.copyFrom(n), a.rotate) {
				let { uvs: t, orig: n } = a;
				i.prepend(Rb.set(t.x1 - t.x0, t.y1 - t.y0, t.x3 - t.x0, t.y3 - t.y0, t.x0, t.y0).invert()).scale(n.width * e, n.height * e);
			} else i.scale(a.source.pixelWidth, a.source.pixelHeight).translate(-a.frame.x * e, -a.frame.y * e);
		}
		return G.applyPatternTransform(r, i), r;
	}
	return Ob(t);
}
var Nb, Pb, Fb, Ib, Lb, Rb, zb, Bb = o((() => {
	h(), Nn(), M(), Qa(), V(), Gt(), zt(), jy(), Ry(), Hy(), Eb(), vb(), Nb = "#808080", Pb = new j(), Fb = new j(), Ib = new j(), Lb = new j(), Rb = new j(), zb = class {
		constructor() {
			this.shader = null;
		}
		contextChange(e) {}
		execute(e, t) {
			let n = e.renderer, r = n.canvasContext, i = r.activeContext, a = t.groupTransform, o = n.globalUniforms.globalUniformData?.worldColor ?? 4294967295, s = t.groupColorAlpha, c = (o >>> 24 & 255) / 255, l = (s >>> 24 & 255) / 255, u = n.filter?.alphaMultiplier ?? 1, d = c * l * u;
			if (d <= 0) return;
			let f = o & 16777215, p = Ut(Rt(s & 16777215, f)), m = n._roundPixels | t._roundPixels;
			i.save(), r.setContextTransform(a, m === 1), r.setBlendMode(t.groupBlendMode);
			let h = t.context.instructions;
			for (let e = 0; e < h.length; e++) {
				let t = h[e];
				if (t.action === "texture") {
					let e = t.data, n = e.image, o = n ? G.getCanvasSource(n) : null;
					if (!o) continue;
					let s = e.alpha * d;
					if (s <= 0) continue;
					let c = Rt(e.style, p);
					i.globalAlpha = s;
					let l = o;
					c !== 16777215 && (l = G.getTintedCanvas({ texture: n }, c));
					let u = n.frame, f = n.source._resolution ?? n.source.resolution ?? 1, h = u.x * f, g = u.y * f, _ = u.width * f, v = u.height * f;
					l !== o && (h = 0, g = 0);
					let y = e.transform, b = y && !y.isIdentity(), x = n.rotate;
					b || x ? (Pb.copyFrom(a), b && Pb.append(y), x && z.matrixAppendRotationInv(Pb, x, e.dx, e.dy, e.dw, e.dh), r.setContextTransform(Pb, m === 1)) : r.setContextTransform(a, m === 1), i.drawImage(l, h, g, l === o ? _ : l.width, l === o ? v : l.height, x ? 0 : e.dx, x ? 0 : e.dy, e.dw, e.dh), (b || x) && r.setContextTransform(a, m === 1);
					continue;
				}
				let n = t.data, o = n?.path?.shapePath;
				if (!o?.shapePrimitives?.length) continue;
				let s = n.style, c = Rt(s.color, p), l = s.alpha * d;
				if (l <= 0) continue;
				let u = t.action === "stroke";
				if (i.globalAlpha = l, u) {
					let e = s;
					i.lineWidth = e.width, i.lineCap = e.cap, i.lineJoin = e.join, i.miterLimit = e.miterLimit;
				}
				let f = o.shapePrimitives;
				if (!u && n.hole?.shapePath?.shapePrimitives?.length) {
					let e = f[f.length - 1];
					e.holes = n.hole.shapePath.shapePrimitives;
				}
				for (let e = 0; e < f.length; e++) {
					let t = f[e];
					if (!t?.shape) continue;
					let n = t.transform, r = n && !n.isIdentity(), o = s.texture && s.texture !== B.WHITE, l = s.textureSpace === "global" ? n : null, d = Mb(s, c, o ? mb(Fb, s, t.shape, l) : null, r ? Ib.copyFrom(a).append(n) : a);
					if (r && (i.save(), i.transform(n.a, n.b, n.c, n.d, n.tx, n.ty)), u) {
						let e = s;
						if (e.alignment !== .5 && !e.pixelLine) {
							let n = [], r = [], a = [];
							Cb[t.shape.type]?.build(t.shape, n) ? (Ay(n, e, !1, t.shape.closePath ?? !0, r, a), i.fillStyle = d, Db(i, r, a)) : (i.strokeStyle = d, i.beginPath(), Ab(i, t.shape), i.stroke());
						} else i.strokeStyle = d, i.beginPath(), Ab(i, t.shape), i.stroke();
					} else i.fillStyle = d, i.beginPath(), Ab(i, t.shape), jb(i, t.holes) ? i.fill("evenodd") : i.fill();
					r && i.restore();
				}
			}
			i.restore();
		}
		destroy() {
			this.shader = null;
		}
	}, zb.extension = {
		type: [d.CanvasPipesAdaptor],
		name: "graphics"
	};
})), Vb, Hb, Ub = o((() => {
	h(), Nn(), M(), Gt(), zt(), Qa(), Vb = class e {
		static _getPatternRepeat(e, t) {
			let n = e && e !== "clamp-to-edge", r = t && t !== "clamp-to-edge";
			return n && r ? "repeat" : n ? "repeat-x" : r ? "repeat-y" : "no-repeat";
		}
		start(e, t, n) {}
		execute(t, n) {
			let r = n.elements;
			if (!r || !r.length) return;
			let i = t.renderer, a = i.canvasContext, o = a.activeContext;
			for (let t = 0; t < r.length; t++) {
				let s = r[t];
				if (!s.packAsQuad) continue;
				let c = s, l = c.texture, u = l ? G.getCanvasSource(l) : null;
				if (!u) continue;
				let d = l.source.style, f = a.smoothProperty, p = d.scaleMode !== "nearest";
				o[f] !== p && (o[f] = p), a.setBlendMode(n.blendMode);
				let m = i.globalUniforms.globalUniformData?.worldColor ?? 4294967295, h = c.color, g = (m >>> 24 & 255) / 255, _ = (h >>> 24 & 255) / 255, v = i.filter?.alphaMultiplier ?? 1, y = g * _ * v;
				if (y <= 0) continue;
				o.globalAlpha = y;
				let b = m & 16777215, x = Ut(Rt(h & 16777215, b)), S = l.frame, C = d.addressModeU ?? d.addressMode, w = d.addressModeV ?? d.addressMode, ee = e._getPatternRepeat(C, w), T = l.source._resolution ?? l.source.resolution ?? 1, E = c.renderable?.renderGroup?.isCachedAsTexture, te = S.x * T, ne = S.y * T, re = S.width * T, ie = S.height * T, D = c.bounds, O = i.renderTarget.renderTarget.isRoot, ae = D.minX, oe = D.minY, se = D.maxX - D.minX, ce = D.maxY - D.minY, le = l.rotate, k = l.uvs, ue = Math.min(k.x0, k.x1, k.x2, k.x3, k.y0, k.y1, k.y2, k.y3), de = Math.max(k.x0, k.x1, k.x2, k.x3, k.y0, k.y1, k.y2, k.y3), fe = ee !== "no-repeat" && (ue < 0 || de > 1), pe = le && (!!fe || x === 16777215 && !le);
				pe ? (e._tempPatternMatrix.copyFrom(c.transform), z.matrixAppendRotationInv(e._tempPatternMatrix, le, ae, oe, se, ce), a.setContextTransform(e._tempPatternMatrix, c.roundPixels === 1, void 0, E && O)) : a.setContextTransform(c.transform, c.roundPixels === 1, void 0, E && O);
				let me = se, he = ce, ge = pe ? 0 : ae, _e = pe ? 0 : oe;
				if (!pe && c.roundPixels === 1 && (ge |= 0, _e |= 0), fe) {
					let t = u, n = x !== 16777215 && !le, r = S.width <= l.source.width && S.height <= l.source.height;
					n && r && (t = G.getTintedCanvas({ texture: l }, x));
					let i = o.createPattern(t, ee);
					if (!i) continue;
					let a = me, s = he;
					if (a === 0 || s === 0) continue;
					let c = 1 / a, d = 1 / s, f = (k.x1 - k.x0) * c, p = (k.y1 - k.y0) * c, m = (k.x3 - k.x0) * d, h = (k.y3 - k.y0) * d, g = k.x0 - f * ge - m * _e, _ = k.y0 - p * ge - h * _e, v = l.source.pixelWidth, y = l.source.pixelHeight;
					e._tempPatternMatrix.set(f * v, p * y, m * v, h * y, g * v, _ * y), G.applyPatternTransform(i, e._tempPatternMatrix), o.fillStyle = i, o.fillRect(ge, _e, me, he);
				} else {
					let e = x !== 16777215 || le ? G.getTintedCanvas({ texture: l }, x) : u, t = e !== u;
					o.drawImage(e, t ? 0 : te, t ? 0 : ne, t ? e.width : re, t ? e.height : ie, ge, _e, me, he);
				}
			}
		}
	}, Vb._tempPatternMatrix = new j(), Vb.extension = {
		type: [d.CanvasPipesAdaptor],
		name: "batch"
	}, Hb = Vb;
})), Wb, Gb = o((() => {
	h(), Wb = class {
		constructor(e) {
			this._colorStack = [], this._colorStackIndex = 0, this._currentColor = 0, this._renderer = e;
		}
		buildStart() {
			this._colorStack[0] = 15, this._colorStackIndex = 1, this._currentColor = 15;
		}
		push(e, t, n) {
			this._renderer.renderPipes.batch.break(n);
			let r = this._colorStack;
			r[this._colorStackIndex] = r[this._colorStackIndex - 1] & e.mask;
			let i = this._colorStack[this._colorStackIndex];
			i !== this._currentColor && (this._currentColor = i, n.add({
				renderPipeId: "colorMask",
				colorMask: i,
				canBundle: !1
			})), this._colorStackIndex++;
		}
		pop(e, t, n) {
			this._renderer.renderPipes.batch.break(n);
			let r = this._colorStack;
			this._colorStackIndex--;
			let i = r[this._colorStackIndex - 1];
			i !== this._currentColor && (this._currentColor = i, n.add({
				renderPipeId: "colorMask",
				colorMask: i,
				canBundle: !1
			}));
		}
		execute(e) {}
		destroy() {
			this._renderer = null, this._colorStack = null;
		}
	}, Wb.extension = {
		type: [d.CanvasPipes],
		name: "colorMask"
	};
}));
// node_modules/parse-svg-path/dist/index.mjs
function Kb(e) {
	let t = [];
	return e.replace(Yb, (e, n, r) => {
		let i = n.toLowerCase(), a = n, o = qb(r);
		for (i === "m" && o.length > 2 && (t.push([a, ...o.splice(0, 2)]), i = "l", a = a === "m" ? "l" : "L");;) {
			if (o.length === Jb[i]) return t.push([a, ...o]), "";
			if (o.length < Jb[i]) throw Error("malformed path data");
			t.push([a, ...o.splice(0, Jb[i])]);
		}
	}), t;
}
function qb(e) {
	let t = e.match(Xb);
	return t ? t.map(Number) : [];
}
var Jb, Yb, Xb, Zb = o((() => {
	Jb = {
		a: 7,
		c: 6,
		h: 1,
		l: 2,
		m: 2,
		q: 4,
		s: 4,
		t: 2,
		v: 1,
		z: 0
	}, Yb = /([astvzqmhlc])([^astvzqmhlc]*)/gi, Xb = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi;
}));
// node_modules/pixi.js/lib/scene/graphics/shared/svg/parseSVGPath.mjs
function Qb(e, t) {
	let n = Kb(e), r = [], i = null, a = 0, o = 0;
	for (let e = 0; e < n.length; e++) {
		let s = n[e], c = s[0], l = s;
		switch (c) {
			case "M":
				a = l[1], o = l[2], t.moveTo(a, o);
				break;
			case "m":
				a += l[1], o += l[2], t.moveTo(a, o);
				break;
			case "H":
				a = l[1], t.lineTo(a, o);
				break;
			case "h":
				a += l[1], t.lineTo(a, o);
				break;
			case "V":
				o = l[1], t.lineTo(a, o);
				break;
			case "v":
				o += l[1], t.lineTo(a, o);
				break;
			case "L":
				a = l[1], o = l[2], t.lineTo(a, o);
				break;
			case "l":
				a += l[1], o += l[2], t.lineTo(a, o);
				break;
			case "C":
				a = l[5], o = l[6], t.bezierCurveTo(l[1], l[2], l[3], l[4], a, o);
				break;
			case "c":
				t.bezierCurveTo(a + l[1], o + l[2], a + l[3], o + l[4], a + l[5], o + l[6]), a += l[5], o += l[6];
				break;
			case "S":
				a = l[3], o = l[4], t.bezierCurveToShort(l[1], l[2], a, o);
				break;
			case "s":
				t.bezierCurveToShort(a + l[1], o + l[2], a + l[3], o + l[4]), a += l[3], o += l[4];
				break;
			case "Q":
				a = l[3], o = l[4], t.quadraticCurveTo(l[1], l[2], a, o);
				break;
			case "q":
				t.quadraticCurveTo(a + l[1], o + l[2], a + l[3], o + l[4]), a += l[3], o += l[4];
				break;
			case "T":
				a = l[1], o = l[2], t.quadraticCurveToShort(a, o);
				break;
			case "t":
				a += l[1], o += l[2], t.quadraticCurveToShort(a, o);
				break;
			case "A":
				a = l[6], o = l[7], t.arcToSvg(l[1], l[2], l[3], l[4], l[5], a, o);
				break;
			case "a":
				a += l[6], o += l[7], t.arcToSvg(l[1], l[2], l[3], l[4], l[5], a, o);
				break;
			case "Z":
			case "z":
				t.closePath(), r.length > 0 && (i = r.pop(), i ? (a = i.startX, o = i.startY) : (a = 0, o = 0)), i = null;
				break;
			default: I(`Unknown SVG path command: ${c}`);
		}
		c !== "Z" && c !== "z" && i === null && (i = {
			startX: a,
			startY: o
		}, r.push(i));
	}
	return t;
}
var $b = o((() => {
	Zb(), L();
})), ex, tx, nx, rx = o((() => {
	pd(), ln(), fm(), at(), ex = class {
		constructor() {
			this.instructions = new cn();
		}
		init(e) {
			let t = e.maxTextures;
			this.batcher ? this.batcher._updateMaxTextures(t) : this.batcher = this._createBatcher(t), this.instructions.reset();
		}
		destroy() {
			this.batcher.destroy(), this.instructions.destroy(), this.batcher = null, this.instructions = null;
		}
	}, tx = class {
		constructor() {
			this.batches = [];
		}
		reset() {
			this.batches && this.batches.forEach((e) => {
				it.return(e);
			}), this.graphicsData && it.return(this.graphicsData), this.isBatchable = !1, this.context = null, this.batches.length = 0, this.graphicsData = null;
		}
		destroy() {
			this.reset(), this.batches = null;
		}
	}, nx = class {
		constructor(e, t) {
			this._renderer = e, this._managedContexts = new dm({
				renderer: e,
				type: "resource",
				name: t
			});
		}
		getContextRenderData(e) {
			return this._getGpuData(e).graphicsData || this._initContextRenderData(e);
		}
		updateGpuContext(e) {
			let t = !!this._getGpuData(e), n = this._getGpuData(e) || this._initContext(e);
			if (e.dirty || !t) {
				t && (n.reset(), n.context = e), this._buildContextData(e, n);
				let r = e.batchMode;
				n.isBatchable = e.customShader || r === "no-batch" ? !1 : r !== "auto" || this._getGeometrySize(n).attributes < 400, e.dirty = !1;
			}
			return n;
		}
		getGpuContext(e) {
			return this._getGpuData(e) || this._initContext(e);
		}
		_getGpuData(e) {
			return e._gpuData[this._renderer.uid];
		}
		_initContextRenderData(e) {
			let t = this._renderer.limits.maxBatchableTextures, n = this._getGpuData(e), r = this._getRenderData(t, n), { batches: i } = n;
			n.graphicsData = r;
			let { attributes: a, indices: o } = this._getGeometrySize(n);
			for (let e = 0; e < i.length; e++) i[e].applyTransform = !1;
			let s = r.batcher;
			s.ensureAttributeBuffer(a), s.ensureIndexBuffer(o), s.begin();
			for (let e = 0; e < i.length; e++) s.add(i[e]);
			s.finish(r.instructions);
			let c = s.geometry;
			c.indexBuffer.setDataWithSize(s.indexBuffer, s.indexSize, !0), c.buffers[0].setDataWithSize(s.attributeBuffer.float32View, s.attributeSize, !0);
			let l = s.batches;
			for (let e = 0; e < s.batchIndex; e++) {
				let n = l[e];
				n.bindGroup = ud(n.textures.textures, n.textures.count, t);
			}
			return r;
		}
		_initContext(e) {
			let t = this._createGpuContext();
			return t.context = e, e._gpuData[this._renderer.uid] = t, this._managedContexts.add(e), t;
		}
		destroy() {
			this._managedContexts.destroy(), this._renderer = null;
		}
	};
})), ix, ax, ox, sx, cx = o((() => {
	h(), Vf(), Xe(), at(), rx(), Eb(), ix = class extends tx {
		constructor() {
			super(...arguments), this.geometryData = {
				vertices: [],
				uvs: [],
				indices: []
			};
		}
		reset() {
			super.reset(), this.geometryData.indices.length = 0, this.geometryData.vertices.length = 0, this.geometryData.uvs.length = 0;
		}
		destroy() {
			super.destroy(), this.geometryData = null;
		}
	}, ax = class extends ex {
		get geometry() {
			return F(Ke, "GraphicsContextRenderData#geometry is deprecated, please use batcher.geometry instead."), this.batcher.geometry;
		}
		_createBatcher(e) {
			return new Bf({ maxTextures: e });
		}
	}, ox = class e extends nx {
		constructor(e) {
			super(e, "graphicsContext");
		}
		init(t) {
			e.defaultOptions.bezierSmoothness = t?.bezierSmoothness ?? e.defaultOptions.bezierSmoothness;
		}
		_createGpuContext() {
			return new ix();
		}
		_buildContextData(e, t) {
			yb(e, t);
		}
		_getGeometrySize(e) {
			let { vertices: t, indices: n } = e.geometryData;
			return {
				attributes: t.length,
				indices: n.length
			};
		}
		_getRenderData(e) {
			return it.get(ax, { maxTextures: e });
		}
	}, ox.extension = {
		type: [d.WebGLSystem, d.WebGPUSystem],
		name: "graphicsContext"
	}, ox.defaultOptions = { bezierSmoothness: .5 }, sx = ox;
}));
// node_modules/pixi.js/lib/scene/graphics/shared/buildCommands/buildAdaptiveBezier.mjs
function lx(e, t, n, r, i, a, o, s, c, l) {
	let u = Math.min(.99, Math.max(0, l ?? sx.defaultOptions.bezierSmoothness)), d = (mx - u) / 1;
	return d *= d, ux(t, n, r, i, a, o, s, c, e, d), e;
}
function ux(e, t, n, r, i, a, o, s, c, l) {
	dx(e, t, n, r, i, a, o, s, c, l, 0), c.push(o, s);
}
function dx(e, t, n, r, i, a, o, s, c, l, u) {
	if (u > fx) return;
	let d = (e + n) / 2, f = (t + r) / 2, p = (n + i) / 2, m = (r + a) / 2, h = (i + o) / 2, g = (a + s) / 2, _ = (d + p) / 2, v = (f + m) / 2, y = (p + h) / 2, b = (m + g) / 2, x = (_ + y) / 2, S = (v + b) / 2;
	if (u > 0) {
		let u = o - e, d = s - t, f = Math.abs((n - o) * d - (r - s) * u), p = Math.abs((i - o) * d - (a - s) * u);
		if (f > px && p > px) {
			if ((f + p) * (f + p) <= l * (u * u + d * d)) {
				c.push(x, S);
				return;
			}
		} else if (f > px) {
			if (f * f <= l * (u * u + d * d)) {
				c.push(x, S);
				return;
			}
		} else if (p > px) {
			if (p * p <= l * (u * u + d * d)) {
				c.push(x, S);
				return;
			}
		} else if (u = x - (e + o) / 2, d = S - (t + s) / 2, u * u + d * d <= l) {
			c.push(x, S);
			return;
		}
	}
	dx(e, t, d, f, _, v, x, S, c, l, u + 1), dx(x, S, y, b, h, g, o, s, c, l, u + 1);
}
var fx, px, mx, hx = o((() => {
	cx(), fx = 8, px = 1.1920929e-7, mx = 1;
}));
// node_modules/pixi.js/lib/scene/graphics/shared/buildCommands/buildAdaptiveQuadratic.mjs
function gx(e, t, n, r, i, a, o, s) {
	let c = Math.min(.99, Math.max(0, s ?? sx.defaultOptions.bezierSmoothness)), l = (xx - c) / 1;
	return l *= l, _x(t, n, r, i, a, o, e, l), e;
}
function _x(e, t, n, r, i, a, o, s) {
	vx(o, e, t, n, r, i, a, s, 0), o.push(i, a);
}
function vx(e, t, n, r, i, a, o, s, c) {
	if (c > yx) return;
	let l = (t + r) / 2, u = (n + i) / 2, d = (r + a) / 2, f = (i + o) / 2, p = (l + d) / 2, m = (u + f) / 2, h = a - t, g = o - n, _ = Math.abs((r - a) * g - (i - o) * h);
	if (_ > bx) {
		if (_ * _ <= s * (h * h + g * g)) {
			e.push(p, m);
			return;
		}
	} else if (h = p - (t + a) / 2, g = m - (n + o) / 2, h * h + g * g <= s) {
		e.push(p, m);
		return;
	}
	vx(e, t, n, l, u, p, m, s, c + 1), vx(e, p, m, d, f, a, o, s, c + 1);
}
var yx, bx, xx, Sx = o((() => {
	cx(), yx = 8, bx = 1.1920929e-7, xx = 1;
}));
// node_modules/pixi.js/lib/scene/graphics/shared/buildCommands/buildArc.mjs
function Cx(e, t, n, r, i, a, o, s) {
	let c = Math.abs(i - a);
	(!o && i > a || o && a > i) && (c = 2 * Math.PI - c), s ||= Math.max(6, Math.floor(6 * r ** (1 / 3) * (c / Math.PI))), s = Math.max(s, 3);
	let l = c / s, u = i;
	l *= o ? -1 : 1;
	for (let i = 0; i < s + 1; i++) {
		let i = Math.cos(u), a = Math.sin(u), o = t + i * r, s = n + a * r;
		e.push(o, s), u += l;
	}
}
var wx = o((() => {}));
// node_modules/pixi.js/lib/scene/graphics/shared/buildCommands/buildArcTo.mjs
function Tx(e, t, n, r, i, a) {
	let o = e[e.length - 2], s = e[e.length - 1] - n, c = o - t, l = i - n, u = r - t, d = Math.abs(s * u - c * l);
	if (d < 1e-8 || a === 0) {
		(e[e.length - 2] !== t || e[e.length - 1] !== n) && e.push(t, n);
		return;
	}
	let f = s * s + c * c, p = l * l + u * u, m = s * l + c * u, h = a * Math.sqrt(f) / d, g = a * Math.sqrt(p) / d, _ = h * m / f, v = g * m / p, y = h * u + g * c, b = h * l + g * s, x = c * (g + _), S = s * (g + _), C = u * (h + v), w = l * (h + v), ee = Math.atan2(S - b, x - y), T = Math.atan2(w - b, C - y);
	Cx(e, y + t, b + n, a, ee, T, c * l > u * s);
}
var Ex = o((() => {
	wx();
}));
// node_modules/pixi.js/lib/scene/graphics/shared/buildCommands/buildArcToSvg.mjs
function Dx(e, t) {
	let n = t === -1.5707963267948966 ? -.551915024494 : 4 / 3 * Math.tan(t / 4), r = t === 1.5707963267948966 ? .551915024494 : n, i = Math.cos(e), a = Math.sin(e), o = Math.cos(e + t), s = Math.sin(e + t);
	return [
		{
			x: i - a * r,
			y: a + i * r
		},
		{
			x: o + s * r,
			y: s - o * r
		},
		{
			x: o,
			y: s
		}
	];
}
function Ox(e, t, n, r, i, a, o, s = 0, c = 0, l = 0) {
	if (a === 0 || o === 0) return;
	let u = Math.sin(s * kx / 360), d = Math.cos(s * kx / 360), f = d * (t - r) / 2 + u * (n - i) / 2, p = -u * (t - r) / 2 + d * (n - i) / 2;
	if (f === 0 && p === 0) return;
	a = Math.abs(a), o = Math.abs(o);
	let m = f ** 2 / a ** 2 + p ** 2 / o ** 2;
	m > 1 && (a *= Math.sqrt(m), o *= Math.sqrt(m)), Nx(t, n, r, i, a, o, c, l, u, d, f, p, Ax);
	let { ang1: h, ang2: g } = Ax, { centerX: _, centerY: v } = Ax, y = Math.abs(g) / (kx / 4);
	Math.abs(1 - y) < 1e-7 && (y = 1);
	let b = Math.max(Math.ceil(y), 1);
	g /= b;
	let x = e[e.length - 2], S = e[e.length - 1], C = {
		x: 0,
		y: 0
	};
	for (let t = 0; t < b; t++) {
		let t = Dx(h, g), { x: n, y: r } = jx(t[0], a, o, d, u, _, v, C), { x: i, y: s } = jx(t[1], a, o, d, u, _, v, C), { x: c, y: l } = jx(t[2], a, o, d, u, _, v, C);
		lx(e, x, S, n, r, i, s, c, l), x = c, S = l, h += g;
	}
}
var kx, Ax, jx, Mx, Nx, Px = o((() => {
	hx(), kx = Math.PI * 2, Ax = {
		centerX: 0,
		centerY: 0,
		ang1: 0,
		ang2: 0
	}, jx = ({ x: e, y: t }, n, r, i, a, o, s, c) => {
		e *= n, t *= r;
		let l = i * e - a * t, u = a * e + i * t;
		return c.x = l + o, c.y = u + s, c;
	}, Mx = (e, t, n, r) => {
		let i = e * r - t * n < 0 ? -1 : 1, a = e * n + t * r;
		return a > 1 && (a = 1), a < -1 && (a = -1), i * Math.acos(a);
	}, Nx = (e, t, n, r, i, a, o, s, c, l, u, d, f) => {
		let p = i ** 2, m = a ** 2, h = u ** 2, g = d ** 2, _ = p * m - p * g - m * h;
		_ < 0 && (_ = 0), _ /= p * g + m * h, _ = Math.sqrt(_) * (o === s ? -1 : 1);
		let v = _ * i / a * d, y = _ * -a / i * u, b = l * v - c * y + (e + n) / 2, x = c * v + l * y + (t + r) / 2, S = (u - v) / i, C = (d - y) / a, w = (-u - v) / i, ee = (-d - y) / a, T = Mx(1, 0, S, C), E = Mx(S, C, w, ee);
		s === 0 && E > 0 && (E -= kx), s === 1 && E < 0 && (E += kx), f.centerX = b, f.centerY = x, f.ang1 = T, f.ang2 = E;
	};
}));
// node_modules/pixi.js/lib/scene/graphics/shared/path/roundShape.mjs
function Fx(e, t, n) {
	let r = (e, t) => {
		let n = t.x - e.x, r = t.y - e.y, i = Math.sqrt(n * n + r * r);
		return {
			len: i,
			nx: n / i,
			ny: r / i
		};
	}, i = (t, n) => {
		t === 0 ? e.moveTo(n.x, n.y) : e.lineTo(n.x, n.y);
	}, a = t[t.length - 1];
	for (let o = 0; o < t.length; o++) {
		let s = t[o % t.length], c = s.radius ?? n;
		if (c <= 0) {
			i(o, s), a = s;
			continue;
		}
		let l = t[(o + 1) % t.length], u = r(s, a), d = r(s, l);
		if (u.len < 1e-4 || d.len < 1e-4) {
			i(o, s), a = s;
			continue;
		}
		let f = Math.asin(u.nx * d.ny - u.ny * d.nx), p = 1, m = !1;
		u.nx * d.nx - u.ny * -d.ny < 0 ? f < 0 ? f = Math.PI + f : (f = Math.PI - f, p = -1, m = !0) : f > 0 && (p = -1, m = !0);
		let h = f / 2, g, _ = Math.abs(Math.cos(h) * c / Math.sin(h));
		_ > Math.min(u.len / 2, d.len / 2) ? (_ = Math.min(u.len / 2, d.len / 2), g = Math.abs(_ * Math.sin(h) / Math.cos(h))) : g = c;
		let v = s.x + d.nx * _ + -d.ny * g * p, y = s.y + d.ny * _ + d.nx * g * p, b = Math.atan2(u.ny, u.nx) + Math.PI / 2 * p, x = Math.atan2(d.ny, d.nx) - Math.PI / 2 * p;
		o === 0 && e.moveTo(v + Math.cos(b) * g, y + Math.sin(b) * g), e.arc(v, y, g, b, x, m), a = s;
	}
}
function Ix(e, t, n, r) {
	let i = (e, t) => Math.sqrt((e.x - t.x) ** 2 + (e.y - t.y) ** 2), a = (e, t, n) => ({
		x: e.x + (t.x - e.x) * n,
		y: e.y + (t.y - e.y) * n
	}), o = t.length;
	for (let s = 0; s < o; s++) {
		let c = t[(s + 1) % o], l = c.radius ?? n;
		if (l <= 0) {
			s === 0 ? e.moveTo(c.x, c.y) : e.lineTo(c.x, c.y);
			continue;
		}
		let u = t[s], d = t[(s + 2) % o], f = i(u, c), p;
		p = f < 1e-4 ? c : a(c, u, Math.min(f / 2, l) / f);
		let m = i(d, c), h;
		h = m < 1e-4 ? c : a(c, d, Math.min(m / 2, l) / m), s === 0 ? e.moveTo(p.x, p.y) : e.lineTo(p.x, p.y), e.quadraticCurveTo(c.x, c.y, h.x, h.y, r);
	}
}
var Lx = o((() => {})), Rx, zx, Bx = o((() => {
	lo(), fo(), go(), wt(), yo(), Dt(), hx(), Sx(), wx(), Ex(), Px(), Lx(), Rx = new R(), zx = class {
		constructor(e) {
			this.shapePrimitives = [], this._currentPoly = null, this._bounds = new Et(), this._graphicsPath2D = e, this.signed = e.checkForHoles;
		}
		moveTo(e, t) {
			return this.startPoly(e, t), this;
		}
		lineTo(e, t) {
			this._ensurePoly();
			let n = this._currentPoly.points, r = n[n.length - 2], i = n[n.length - 1];
			return (r !== e || i !== t) && n.push(e, t), this;
		}
		arc(e, t, n, r, i, a) {
			this._ensurePoly(!1);
			let o = this._currentPoly.points;
			return Cx(o, e, t, n, r, i, a), this;
		}
		arcTo(e, t, n, r, i) {
			this._ensurePoly();
			let a = this._currentPoly.points;
			return Tx(a, e, t, n, r, i), this;
		}
		arcToSvg(e, t, n, r, i, a, o) {
			let s = this._currentPoly.points;
			return Ox(s, this._currentPoly.lastX, this._currentPoly.lastY, a, o, e, t, n, r, i), this;
		}
		bezierCurveTo(e, t, n, r, i, a, o) {
			this._ensurePoly();
			let s = this._currentPoly;
			return lx(this._currentPoly.points, s.lastX, s.lastY, e, t, n, r, i, a, o), this;
		}
		quadraticCurveTo(e, t, n, r, i) {
			this._ensurePoly();
			let a = this._currentPoly;
			return gx(this._currentPoly.points, a.lastX, a.lastY, e, t, n, r, i), this;
		}
		closePath() {
			return this.endPoly(!0), this;
		}
		addPath(e, t) {
			this.endPoly(), t && !t.isIdentity() && (e = e.clone(!0), e.transform(t));
			let n = this.shapePrimitives, r = n.length;
			for (let t = 0; t < e.instructions.length; t++) {
				let n = e.instructions[t];
				this[n.action](...n.data);
			}
			if (e.checkForHoles && n.length - r > 1) {
				let e = null;
				for (let t = r; t < n.length; t++) {
					let r = n[t];
					if (r.shape.type === "polygon") {
						let i = r.shape, a = e?.shape;
						a && a.containsPolygon(i) ? (e.holes || (e.holes = []), e.holes.push(r), n.copyWithin(t, t + 1), n.length--, t--) : e = r;
					}
				}
			}
			return this;
		}
		finish(e = !1) {
			this.endPoly(e);
		}
		rect(e, t, n, r, i) {
			return this.drawShape(new R(e, t, n, r), i), this;
		}
		circle(e, t, n, r) {
			return this.drawShape(new co(e, t, n), r), this;
		}
		poly(e, t, n) {
			let r = new ho(e);
			return r.closePath = t, this.drawShape(r, n), this;
		}
		regularPoly(e, t, n, r, i = 0, a) {
			r = Math.max(r | 0, 3);
			let o = -1 * Math.PI / 2 + i, s = Math.PI * 2 / r, c = [];
			for (let i = 0; i < r; i++) {
				let r = o - i * s;
				c.push(e + n * Math.cos(r), t + n * Math.sin(r));
			}
			return this.poly(c, !0, a), this;
		}
		roundPoly(e, t, n, r, i, a = 0, o) {
			if (r = Math.max(r | 0, 3), i <= 0) return this.regularPoly(e, t, n, r, a);
			let s = n * Math.sin(Math.PI / r) - .001;
			i = Math.min(i, s);
			let c = -1 * Math.PI / 2 + a, l = Math.PI * 2 / r, u = (r - 2) * Math.PI / r / 2;
			for (let a = 0; a < r; a++) {
				let r = a * l + c, s = e + n * Math.cos(r), d = t + n * Math.sin(r), f = r + Math.PI + u, p = r - Math.PI - u, m = s + i * Math.cos(f), h = d + i * Math.sin(f), g = s + i * Math.cos(p), _ = d + i * Math.sin(p);
				a === 0 ? this.moveTo(m, h) : this.lineTo(m, h), this.quadraticCurveTo(s, d, g, _, o);
			}
			return this.closePath();
		}
		roundShape(e, t, n = !1, r) {
			return e.length < 3 ? this : (n ? Ix(this, e, t, r) : Fx(this, e, t), this.closePath());
		}
		filletRect(e, t, n, r, i) {
			if (i === 0) return this.rect(e, t, n, r);
			let a = Math.min(n, r) / 2, o = Math.min(a, Math.max(-a, i)), s = e + n, c = t + r, l = o < 0 ? -o : 0, u = Math.abs(o);
			return this.moveTo(e, t + u).arcTo(e + l, t + l, e + u, t, u).lineTo(s - u, t).arcTo(s - l, t + l, s, t + u, u).lineTo(s, c - u).arcTo(s - l, c - l, e + n - u, c, u).lineTo(e + u, c).arcTo(e + l, c - l, e, c - u, u).closePath();
		}
		chamferRect(e, t, n, r, i, a) {
			if (i <= 0) return this.rect(e, t, n, r);
			let o = Math.min(i, Math.min(n, r) / 2), s = e + n, c = t + r, l = [
				e + o,
				t,
				s - o,
				t,
				s,
				t + o,
				s,
				c - o,
				s - o,
				c,
				e + o,
				c,
				e,
				c - o,
				e,
				t + o
			];
			for (let e = l.length - 1; e >= 2; e -= 2) l[e] === l[e - 2] && l[e - 1] === l[e - 3] && l.splice(e - 1, 2);
			return this.poly(l, !0, a);
		}
		ellipse(e, t, n, r, i) {
			return this.drawShape(new uo(e, t, n, r), i), this;
		}
		roundRect(e, t, n, r, i, a) {
			return this.drawShape(new vo(e, t, n, r, i), a), this;
		}
		drawShape(e, t) {
			return this.endPoly(), this.shapePrimitives.push({
				shape: e,
				transform: t
			}), this;
		}
		startPoly(e, t) {
			let n = this._currentPoly;
			return n && this.endPoly(), n = new ho(), n.points.push(e, t), this._currentPoly = n, this;
		}
		endPoly(e = !1) {
			let t = this._currentPoly;
			return t && t.points.length > 2 && (t.closePath = e, this.shapePrimitives.push({ shape: t })), this._currentPoly = null, this;
		}
		_ensurePoly(e = !0) {
			if (!this._currentPoly && (this._currentPoly = new ho(), e)) {
				let e = this.shapePrimitives[this.shapePrimitives.length - 1];
				if (e) {
					let t = e.shape.x, n = e.shape.y;
					if (e.transform && !e.transform.isIdentity()) {
						let r = e.transform, i = t;
						t = r.a * t + r.c * n + r.tx, n = r.b * i + r.d * n + r.ty;
					}
					this._currentPoly.points.push(t, n);
				} else this._currentPoly.points.push(0, 0);
			}
		}
		buildPath() {
			let e = this._graphicsPath2D;
			this.shapePrimitives.length = 0, this._currentPoly = null;
			for (let t = 0; t < e.instructions.length; t++) {
				let n = e.instructions[t];
				this[n.action](...n.data);
			}
			this.finish();
		}
		get bounds() {
			let e = this._bounds;
			e.clear();
			let t = this.shapePrimitives;
			for (let n = 0; n < t.length; n++) {
				let r = t[n], i = r.shape.getBounds(Rx);
				r.transform ? e.addRect(i, r.transform) : e.addRect(i);
			}
			return e;
		}
	};
}));
// node_modules/pixi.js/lib/scene/graphics/shared/path/GraphicsPath.mjs
function Vx(e, t) {
	return e ? e.prepend(t) : t.clone();
}
var Hx, Ux = o((() => {
	Re(), We(), L(), $b(), Bx(), Hx = class e {
		constructor(e, t = !1) {
			this.instructions = [], this.uid = N("graphicsPath"), this._dirty = !0, this.checkForHoles = t, typeof e == "string" ? Qb(e, this) : this.instructions = e?.slice() ?? [];
		}
		get shapePath() {
			return this._shapePath ||= new zx(this), this._dirty && (this._dirty = !1, this._shapePath.buildPath()), this._shapePath;
		}
		addPath(e, t) {
			return e = e.clone(), this.instructions.push({
				action: "addPath",
				data: [e, t]
			}), this._dirty = !0, this;
		}
		arc(...e) {
			return this.instructions.push({
				action: "arc",
				data: e
			}), this._dirty = !0, this;
		}
		arcTo(...e) {
			return this.instructions.push({
				action: "arcTo",
				data: e
			}), this._dirty = !0, this;
		}
		arcToSvg(...e) {
			return this.instructions.push({
				action: "arcToSvg",
				data: e
			}), this._dirty = !0, this;
		}
		bezierCurveTo(...e) {
			return this.instructions.push({
				action: "bezierCurveTo",
				data: e
			}), this._dirty = !0, this;
		}
		bezierCurveToShort(e, t, n, r, i) {
			let a = this.instructions[this.instructions.length - 1], o = this.getLastPoint(Ie.shared), s = 0, c = 0;
			if (!a || a.action !== "bezierCurveTo") s = o.x, c = o.y;
			else {
				s = a.data[2], c = a.data[3];
				let e = o.x, t = o.y;
				s = e + (e - s), c = t + (t - c);
			}
			return this.instructions.push({
				action: "bezierCurveTo",
				data: [
					s,
					c,
					e,
					t,
					n,
					r,
					i
				]
			}), this._dirty = !0, this;
		}
		closePath() {
			return this.instructions.push({
				action: "closePath",
				data: []
			}), this._dirty = !0, this;
		}
		ellipse(...e) {
			return this.instructions.push({
				action: "ellipse",
				data: e
			}), this._dirty = !0, this;
		}
		lineTo(...e) {
			return this.instructions.push({
				action: "lineTo",
				data: e
			}), this._dirty = !0, this;
		}
		moveTo(...e) {
			return this.instructions.push({
				action: "moveTo",
				data: e
			}), this;
		}
		quadraticCurveTo(...e) {
			return this.instructions.push({
				action: "quadraticCurveTo",
				data: e
			}), this._dirty = !0, this;
		}
		quadraticCurveToShort(e, t, n) {
			let r = this.instructions[this.instructions.length - 1], i = this.getLastPoint(Ie.shared), a = 0, o = 0;
			if (!r || r.action !== "quadraticCurveTo") a = i.x, o = i.y;
			else {
				a = r.data[0], o = r.data[1];
				let e = i.x, t = i.y;
				a = e + (e - a), o = t + (t - o);
			}
			return this.instructions.push({
				action: "quadraticCurveTo",
				data: [
					a,
					o,
					e,
					t,
					n
				]
			}), this._dirty = !0, this;
		}
		rect(e, t, n, r, i) {
			return this.instructions.push({
				action: "rect",
				data: [
					e,
					t,
					n,
					r,
					i
				]
			}), this._dirty = !0, this;
		}
		circle(e, t, n, r) {
			return this.instructions.push({
				action: "circle",
				data: [
					e,
					t,
					n,
					r
				]
			}), this._dirty = !0, this;
		}
		roundRect(...e) {
			return this.instructions.push({
				action: "roundRect",
				data: e
			}), this._dirty = !0, this;
		}
		poly(...e) {
			return this.instructions.push({
				action: "poly",
				data: e
			}), this._dirty = !0, this;
		}
		regularPoly(...e) {
			return this.instructions.push({
				action: "regularPoly",
				data: e
			}), this._dirty = !0, this;
		}
		roundPoly(...e) {
			return this.instructions.push({
				action: "roundPoly",
				data: e
			}), this._dirty = !0, this;
		}
		roundShape(...e) {
			return this.instructions.push({
				action: "roundShape",
				data: e
			}), this._dirty = !0, this;
		}
		filletRect(...e) {
			return this.instructions.push({
				action: "filletRect",
				data: e
			}), this._dirty = !0, this;
		}
		chamferRect(...e) {
			return this.instructions.push({
				action: "chamferRect",
				data: e
			}), this._dirty = !0, this;
		}
		star(e, t, n, r, i, a, o) {
			i ||= r / 2;
			let s = -1 * Math.PI / 2 + a, c = n * 2, l = Math.PI * 2 / c, u = [];
			for (let n = 0; n < c; n++) {
				let a = n % 2 ? i : r, o = n * l + s;
				u.push(e + a * Math.cos(o), t + a * Math.sin(o));
			}
			return this.poly(u, !0, o), this;
		}
		clone(t = !1) {
			let n = new e();
			if (n.checkForHoles = this.checkForHoles, !t) n.instructions = this.instructions.slice();
			else for (let e = 0; e < this.instructions.length; e++) {
				let t = this.instructions[e];
				n.instructions.push({
					action: t.action,
					data: t.data.slice()
				});
			}
			return n;
		}
		clear() {
			return this.instructions.length = 0, this._dirty = !0, this;
		}
		transform(e) {
			if (e.isIdentity()) return this;
			let t = e.a, n = e.b, r = e.c, i = e.d, a = e.tx, o = e.ty, s = 0, c = 0, l = 0, u = 0, d = 0, f = 0, p = 0, m = 0;
			for (let h = 0; h < this.instructions.length; h++) {
				let g = this.instructions[h], _ = g.data;
				switch (g.action) {
					case "moveTo":
					case "lineTo":
						s = _[0], c = _[1], _[0] = t * s + r * c + a, _[1] = n * s + i * c + o;
						break;
					case "bezierCurveTo":
						l = _[0], u = _[1], d = _[2], f = _[3], s = _[4], c = _[5], _[0] = t * l + r * u + a, _[1] = n * l + i * u + o, _[2] = t * d + r * f + a, _[3] = n * d + i * f + o, _[4] = t * s + r * c + a, _[5] = n * s + i * c + o;
						break;
					case "quadraticCurveTo":
						l = _[0], u = _[1], s = _[2], c = _[3], _[0] = t * l + r * u + a, _[1] = n * l + i * u + o, _[2] = t * s + r * c + a, _[3] = n * s + i * c + o;
						break;
					case "arcToSvg":
						s = _[5], c = _[6], p = _[0], m = _[1], _[0] = t * p + r * m, _[1] = n * p + i * m, _[5] = t * s + r * c + a, _[6] = n * s + i * c + o;
						break;
					case "circle":
						_[4] = Vx(_[3], e);
						break;
					case "rect":
						_[4] = Vx(_[4], e);
						break;
					case "ellipse":
						_[8] = Vx(_[8], e);
						break;
					case "roundRect":
						_[5] = Vx(_[5], e);
						break;
					case "addPath":
						_[0].transform(e);
						break;
					case "poly":
						_[2] = Vx(_[2], e);
						break;
					case "regularPoly":
					case "chamferRect":
						_[5] = Vx(_[5], e);
						break;
					case "closePath": break;
					default: I("unknown transform action", g.action);
				}
			}
			return this._dirty = !0, this;
		}
		get bounds() {
			return this.shapePath.bounds;
		}
		getLastPoint(e) {
			let t = this.instructions.length - 1, n = this.instructions[t];
			if (!n) return e.x = 0, e.y = 0, e;
			for (; n.action === "closePath";) {
				if (t--, t < 0) return e.x = 0, e.y = 0, e;
				n = this.instructions[t];
			}
			switch (n.action) {
				case "moveTo":
				case "lineTo":
					e.x = n.data[0], e.y = n.data[1];
					break;
				case "quadraticCurveTo":
					e.x = n.data[2], e.y = n.data[3];
					break;
				case "bezierCurveTo":
					e.x = n.data[4], e.y = n.data[5];
					break;
				case "arc":
				case "arcToSvg":
					e.x = n.data[5], e.y = n.data[6];
					break;
				case "addPath": n.data[0].getLastPoint(e);
			}
			return e;
		}
	};
}));
// node_modules/pixi.js/lib/scene/graphics/shared/svg/parseSVGFloatAttribute.mjs
function Wx(e, t, n) {
	let r = e.getAttribute(t);
	return r ? Number(r) : n;
}
var Gx = o((() => {}));
// node_modules/pixi.js/lib/scene/graphics/shared/svg/parseSVGDefinitions.mjs
function Kx(e, t) {
	let n = e.querySelectorAll("defs");
	for (let e = 0; e < n.length; e++) {
		let r = n[e];
		for (let e = 0; e < r.children.length; e++) {
			let n = r.children[e];
			switch (n.nodeName.toLowerCase()) {
				case "lineargradient":
					t.defs[n.id] = Xx(n);
					break;
				case "radialgradient": t.defs[n.id] = Zx(n);
			}
		}
	}
}
function qx(e, t, n) {
	let r = e.getAttribute(t);
	if (r?.trim().endsWith("%")) {
		let e = Number(r.trim().slice(0, -1));
		return Number.isNaN(e) ? n : e / 100;
	}
	return Wx(e, t, n);
}
function Jx(e) {
	return (e.getAttribute("gradientUnits") || "objectBoundingBox") === "objectBoundingBox" ? "local" : "global";
}
function Yx(e) {
	let t = [];
	for (let n = 0; n < e.children.length; n++) {
		let r = e.children[n], i = qx(r, "offset", 0), a = A.shared.setValue(r.getAttribute("stop-color")).toNumber();
		t.push({
			offset: i,
			color: a
		});
	}
	return t;
}
function Xx(e) {
	let t = qx(e, "x1", 0), n = qx(e, "y1", 0), r = qx(e, "x2", 1), i = qx(e, "y2", 0);
	return new Ly({
		type: "linear",
		start: {
			x: t,
			y: n
		},
		end: {
			x: r,
			y: i
		},
		textureSpace: Jx(e),
		colorStops: Yx(e)
	});
}
function Zx(e) {
	let t = qx(e, "cx", .5), n = qx(e, "cy", .5), r = qx(e, "r", .5), i = qx(e, "fx", t), a = qx(e, "fy", n), o = qx(e, "fr", 0);
	return new Ly({
		type: "radial",
		center: {
			x: i,
			y: a
		},
		innerRadius: o,
		outerCenter: {
			x: t,
			y: n
		},
		outerRadius: r,
		textureSpace: Jx(e),
		colorStops: Yx(e)
	});
}
var Qx = o((() => {
	ke(), Ry(), Gx();
}));
// node_modules/pixi.js/lib/scene/graphics/shared/svg/utils/extractSvgUrlId.mjs
function $x(e) {
	let t = e.match(/url\s*\(\s*['"]?\s*#([^'"\s)]+)\s*['"]?\s*\)/i);
	return t ? t[1] : "";
}
var eS = o((() => {}));
// node_modules/pixi.js/lib/scene/graphics/shared/svg/parseSVGStyle.mjs
function tS(e, t) {
	let n = e.getAttribute("style"), r = {}, i = {}, a = {
		strokeStyle: r,
		fillStyle: i,
		useFill: !1,
		useStroke: !1
	};
	for (let n in rS) {
		let r = e.getAttribute(n);
		r && nS(t, a, n, r.trim());
	}
	if (n) {
		let e = n.split(";");
		for (let n = 0; n < e.length; n++) {
			let [r, i] = e[n].trim().split(":");
			rS[r] && nS(t, a, r, i.trim());
		}
	}
	return {
		strokeStyle: a.useStroke ? r : null,
		fillStyle: a.useFill ? i : null,
		useFill: a.useFill,
		useStroke: a.useStroke
	};
}
function nS(e, t, n, r) {
	switch (n) {
		case "stroke":
			if (r !== "none") {
				if (r.startsWith("url(")) {
					let n = $x(r);
					t.strokeStyle.fill = e.defs[n];
				} else t.strokeStyle.color = A.shared.setValue(r).toNumber();
				t.useStroke = !0;
			}
			break;
		case "stroke-width":
			t.strokeStyle.width = Number(r);
			break;
		case "fill":
			if (r !== "none") {
				if (r.startsWith("url(")) {
					let n = $x(r);
					t.fillStyle.fill = e.defs[n];
				} else t.fillStyle.color = A.shared.setValue(r).toNumber();
				t.useFill = !0;
			}
			break;
		case "fill-opacity":
			t.fillStyle.alpha = Number(r);
			break;
		case "stroke-opacity":
			t.strokeStyle.alpha = Number(r);
			break;
		case "opacity": t.fillStyle.alpha = Number(r), t.strokeStyle.alpha = Number(r);
	}
}
var rS, iS = o((() => {
	ke(), eS(), rS = {
		fill: {
			type: "paint",
			default: 0
		},
		"fill-opacity": {
			type: "number",
			default: 1
		},
		stroke: {
			type: "paint",
			default: 0
		},
		"stroke-width": {
			type: "number",
			default: 1
		},
		"stroke-opacity": {
			type: "number",
			default: 1
		},
		"stroke-linecap": {
			type: "string",
			default: "butt"
		},
		"stroke-linejoin": {
			type: "string",
			default: "miter"
		},
		"stroke-miterlimit": {
			type: "number",
			default: 10
		},
		"stroke-dasharray": {
			type: "string",
			default: "none"
		},
		"stroke-dashoffset": {
			type: "number",
			default: 0
		},
		opacity: {
			type: "number",
			default: 1
		}
	};
}));
// node_modules/pixi.js/lib/scene/graphics/shared/svg/utils/fillOperations.mjs
function aS(e) {
	if (e.length <= 2) return !0;
	let t = e.map((e) => e.area).sort((e, t) => t - e), [n, r] = t, i = t[t.length - 1], a = n / r, o = r / i;
	return !(a > 3 && o < 2);
}
var oS = o((() => {}));
// node_modules/pixi.js/lib/scene/graphics/shared/svg/utils/pathOperations.mjs
function sS(e) {
	return e.split(/(?=[Mm])/).filter((e) => e.trim().length > 0);
}
function cS(e) {
	let t = e.match(/[-+]?[0-9]*\.?[0-9]+/g);
	if (!t || t.length < 4) return 0;
	let n = t.map(Number), r = [], i = [];
	for (let e = 0; e < n.length; e += 2) e + 1 < n.length && (r.push(n[e]), i.push(n[e + 1]));
	if (r.length === 0 || i.length === 0) return 0;
	let a = Math.min(...r), o = Math.max(...r), s = Math.min(...i), c = Math.max(...i);
	return (o - a) * (c - s);
}
function lS(e, t) {
	let n = new Hx(e, !1);
	for (let e of n.instructions) t.instructions.push(e);
}
var uS = o((() => {
	Ux();
}));
// node_modules/pixi.js/lib/scene/graphics/shared/svg/SVGParser.mjs
function dS(e, t) {
	if (typeof e == "string") {
		let t = document.createElement("div");
		t.innerHTML = e.trim(), e = t.querySelector("svg");
	}
	let n = {
		context: t,
		defs: {},
		path: new Hx()
	};
	Kx(e, n);
	let r = e.children, { fillStyle: i, strokeStyle: a } = tS(e, n);
	for (let e = 0; e < r.length; e++) {
		let t = r[e];
		t.nodeName.toLowerCase() !== "defs" && fS(t, n, i, a);
	}
	return t;
}
function fS(e, t, n, r) {
	let i = e.children, { fillStyle: a, strokeStyle: o } = tS(e, t);
	a && n ? n = {
		...n,
		...a
	} : a && (n = a), o && r ? r = {
		...r,
		...o
	} : o && (r = o);
	let s = !n && !r;
	s && (n = { color: 0 });
	let c, l, u, d, f, p, m, h, g, _, v, y, b, x, S, C, w;
	switch (e.nodeName.toLowerCase()) {
		case "path": {
			x = e.getAttribute("d");
			let i = e.getAttribute("fill-rule"), a = sS(x), o = i === "evenodd", s = a.length > 1;
			if (o && s) {
				let e = a.map((e) => ({
					path: e,
					area: cS(e)
				}));
				if (e.sort((e, t) => t.area - e.area), a.length > 3 || !aS(e)) for (let i = 0; i < e.length; i++) {
					let a = e[i], o = i === 0;
					t.context.beginPath();
					let s = new Hx(void 0, !0);
					lS(a.path, s), t.context.path(s), o ? (n && t.context.fill(n), r && t.context.stroke(r)) : t.context.cut();
				}
				else for (let i = 0; i < e.length; i++) {
					let a = e[i], o = i % 2 == 1;
					t.context.beginPath();
					let s = new Hx(void 0, !0);
					lS(a.path, s), t.context.path(s), o ? t.context.cut() : (n && t.context.fill(n), r && t.context.stroke(r));
				}
			} else S = new Hx(x, !i || i === "evenodd"), t.context.path(S), n && t.context.fill(n), r && t.context.stroke(r);
			break;
		}
		case "circle":
			m = Wx(e, "cx", 0), h = Wx(e, "cy", 0), g = Wx(e, "r", 0), t.context.ellipse(m, h, g, g), n && t.context.fill(n), r && t.context.stroke(r);
			break;
		case "rect":
			c = Wx(e, "x", 0), l = Wx(e, "y", 0), C = Wx(e, "width", 0), w = Wx(e, "height", 0), _ = Wx(e, "rx", 0), v = Wx(e, "ry", 0), _ || v ? t.context.roundRect(c, l, C, w, _ || v) : t.context.rect(c, l, C, w), n && t.context.fill(n), r && t.context.stroke(r);
			break;
		case "ellipse":
			m = Wx(e, "cx", 0), h = Wx(e, "cy", 0), _ = Wx(e, "rx", 0), v = Wx(e, "ry", 0), t.context.beginPath(), t.context.ellipse(m, h, _, v), n && t.context.fill(n), r && t.context.stroke(r);
			break;
		case "line":
			u = Wx(e, "x1", 0), d = Wx(e, "y1", 0), f = Wx(e, "x2", 0), p = Wx(e, "y2", 0), t.context.beginPath(), t.context.moveTo(u, d), t.context.lineTo(f, p), r && t.context.stroke(r);
			break;
		case "polygon":
			b = e.getAttribute("points"), y = b.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi).map(Number), t.context.poly(y, !0), n && t.context.fill(n), r && t.context.stroke(r);
			break;
		case "polyline":
			b = e.getAttribute("points"), y = b.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi).map(Number), t.context.poly(y, !1), r && t.context.stroke(r);
			break;
		case "g":
		case "svg": break;
		default: I(`[SVG parser] <${e.nodeName}> elements unsupported`);
	}
	s && (n = null);
	for (let e = 0; e < i.length; e++) fS(i[e], t, n, r);
}
var pS = o((() => {
	L(), Ux(), Qx(), Gx(), iS(), oS(), uS();
}));
// node_modules/pixi.js/lib/scene/graphics/shared/utils/convertFillInputToFillStyle.mjs
function mS(e) {
	return A.isColorLike(e);
}
function hS(e) {
	return e instanceof Vy;
}
function gS(e) {
	return e instanceof Ly;
}
function _S(e) {
	return e instanceof B;
}
function vS(e, t, n) {
	let r = A.shared.setValue(t ?? 0);
	return e.color = r.toNumber(), e.alpha = r.alpha === 1 ? n.alpha : r.alpha, e.texture = B.WHITE, {
		...n,
		...e
	};
}
function yS(e, t, n) {
	return e.texture = t, {
		...n,
		...e
	};
}
function bS(e, t, n) {
	return e.fill = t, e.color = 16777215, e.texture = t.texture, e.matrix = t.transform, e.textureSpace = t.textureSpace, {
		...n,
		...e
	};
}
function xS(e, t, n) {
	return t.buildGradient(), e.fill = t, e.color = 16777215, e.texture = t.texture, e.matrix = t.transform, e.textureSpace = t.textureSpace, {
		...n,
		...e
	};
}
function SS(e, t) {
	let n = {
		...t,
		...e
	}, r = A.shared.setValue(n.color);
	return n.alpha *= r.alpha, n.color = r.toNumber(), n;
}
function CS(e, t) {
	if (e == null) return null;
	let n = {}, r = e;
	return mS(e) ? vS(n, e, t) : _S(e) ? yS(n, e, t) : hS(e) ? bS(n, e, t) : gS(e) ? xS(n, e, t) : r.fill && hS(r.fill) ? bS(r, r.fill, t) : r.fill && gS(r.fill) ? xS(r, r.fill, t) : SS(r, t);
}
function wS(e, t) {
	let { width: n, alignment: r, miterLimit: i, cap: a, join: o, pixelLine: s, ...c } = t, l = CS(e, c);
	return l ? {
		width: n,
		alignment: r,
		miterLimit: i,
		cap: a,
		join: o,
		pixelLine: s,
		...l
	} : null;
}
var TS = o((() => {
	ke(), V(), Ry(), Hy();
}));
// node_modules/pixi.js/lib/scene/graphics/shared/utils/getMaxMiterRatio.mjs
function ES(e, t) {
	let n = 1, r = e.shapePath.shapePrimitives;
	for (let e = 0; e < r.length; e++) {
		let i = r[e].shape;
		if (i.type !== "polygon") continue;
		let a = i.points, o = a.length;
		if (o < 6) continue;
		let s = i.closePath;
		for (let e = 0; e < o; e += 2) {
			if (!s && (e === 0 || e === o - 2)) continue;
			let r = (e - 2 + o) % o, i = (e + 2) % o, c = a[r], l = a[r + 1], u = a[e], d = a[e + 1], f = a[i], p = a[i + 1], m = c - u, h = l - d, g = f - u, _ = p - d, v = m * m + h * h, y = g * g + _ * _;
			if (v < 1e-12 || y < 1e-12) continue;
			let b = (m * g + h * _) / Math.sqrt(v * y);
			b < -1 ? b = -1 : b > 1 && (b = 1);
			let x = Math.sqrt((1 - b) * .5);
			if (x < 1e-6) continue;
			let S = Math.min(1 / x, t);
			S > n && (n = S);
		}
	}
	return n;
}
var DS = o((() => {})), OS, kS, AS, jS, MS = o((() => {
	y(), ke(), M(), Re(), V(), We(), Xe(), Dt(), Ux(), pS(), TS(), DS(), OS = new Ie(), kS = new j(), AS = class e extends v {
		constructor() {
			super(...arguments), this._gpuData = /* @__PURE__ */ Object.create(null), this.autoGarbageCollect = !0, this._gcLastUsed = -1, this.uid = N("graphicsContext"), this.dirty = !0, this.batchMode = "auto", this.instructions = [], this.destroyed = !1, this._activePath = new Hx(), this._transform = new j(), this._fillStyle = { ...e.defaultFillStyle }, this._strokeStyle = { ...e.defaultStrokeStyle }, this._stateStack = [], this._tick = 0, this._bounds = new Et(), this._boundsDirty = !0;
		}
		clone() {
			let t = new e();
			return t.batchMode = this.batchMode, t.instructions = this.instructions.slice(), t._activePath = this._activePath.clone(), t._transform = this._transform.clone(), t._fillStyle = { ...this._fillStyle }, t._strokeStyle = { ...this._strokeStyle }, t._stateStack = this._stateStack.slice(), t._bounds = this._bounds.clone(), t._boundsDirty = !0, t;
		}
		get fillStyle() {
			return this._fillStyle;
		}
		set fillStyle(t) {
			this._fillStyle = CS(t, e.defaultFillStyle);
		}
		get strokeStyle() {
			return this._strokeStyle;
		}
		set strokeStyle(t) {
			this._strokeStyle = wS(t, e.defaultStrokeStyle);
		}
		setFillStyle(t) {
			return this._fillStyle = CS(t, e.defaultFillStyle), this;
		}
		setStrokeStyle(t) {
			return this._strokeStyle = CS(t, e.defaultStrokeStyle), this;
		}
		texture(e, t, n, r, i, a) {
			return this.instructions.push({
				action: "texture",
				data: {
					image: e,
					dx: n || 0,
					dy: r || 0,
					dw: i || e.frame.width,
					dh: a || e.frame.height,
					transform: this._transform.clone(),
					alpha: this._fillStyle.alpha,
					style: t || t === 0 ? A.shared.setValue(t).toNumber() : 16777215
				}
			}), this.onUpdate(), this;
		}
		beginPath() {
			return this._activePath = new Hx(), this;
		}
		fill(t, n) {
			let r, i = this.instructions[this.instructions.length - 1];
			return r = this._tick === 0 && i?.action === "stroke" ? i.data.path : this._activePath.clone(), r && (t != null && (n !== void 0 && typeof t == "number" && (F(P, "GraphicsContext.fill(color, alpha) is deprecated, use GraphicsContext.fill({ color, alpha }) instead"), t = {
				color: t,
				alpha: n
			}), this._fillStyle = CS(t, e.defaultFillStyle)), this.instructions.push({
				action: "fill",
				data: {
					style: this.fillStyle,
					path: r
				}
			}), this.onUpdate(), this._initNextPathLocation(), this._tick = 0), this;
		}
		_initNextPathLocation() {
			let { x: e, y: t } = this._activePath.getLastPoint(Ie.shared);
			this._activePath.clear(), this._activePath.moveTo(e, t);
		}
		stroke(t) {
			let n, r = this.instructions[this.instructions.length - 1];
			return n = this._tick === 0 && r?.action === "fill" ? r.data.path : this._activePath.clone(), n && (t != null && (this._strokeStyle = wS(t, e.defaultStrokeStyle)), this.instructions.push({
				action: "stroke",
				data: {
					style: this.strokeStyle,
					path: n
				}
			}), this.onUpdate(), this._initNextPathLocation(), this._tick = 0), this;
		}
		cut() {
			for (let e = 0; e < 2; e++) {
				let t = this.instructions[this.instructions.length - 1 - e], n = this._activePath.clone();
				if (t && (t.action === "stroke" || t.action === "fill")) {
					if (t.data.hole) t.data.hole.addPath(n);
					else {
						t.data.hole = n;
						break;
					}
				}
			}
			return this._initNextPathLocation(), this;
		}
		arc(e, t, n, r, i, a) {
			this._tick++;
			let o = this._transform;
			return this._activePath.arc(o.a * e + o.c * t + o.tx, o.b * e + o.d * t + o.ty, n, r, i, a), this;
		}
		arcTo(e, t, n, r, i) {
			this._tick++;
			let a = this._transform;
			return this._activePath.arcTo(a.a * e + a.c * t + a.tx, a.b * e + a.d * t + a.ty, a.a * n + a.c * r + a.tx, a.b * n + a.d * r + a.ty, i), this;
		}
		arcToSvg(e, t, n, r, i, a, o) {
			this._tick++;
			let s = this._transform;
			return this._activePath.arcToSvg(e, t, n, r, i, s.a * a + s.c * o + s.tx, s.b * a + s.d * o + s.ty), this;
		}
		bezierCurveTo(e, t, n, r, i, a, o) {
			this._tick++;
			let s = this._transform;
			return this._activePath.bezierCurveTo(s.a * e + s.c * t + s.tx, s.b * e + s.d * t + s.ty, s.a * n + s.c * r + s.tx, s.b * n + s.d * r + s.ty, s.a * i + s.c * a + s.tx, s.b * i + s.d * a + s.ty, o), this;
		}
		closePath() {
			return this._tick++, this._activePath?.closePath(), this;
		}
		ellipse(e, t, n, r) {
			return this._tick++, this._activePath.ellipse(e, t, n, r, this._transform.clone()), this;
		}
		circle(e, t, n) {
			return this._tick++, this._activePath.circle(e, t, n, this._transform.clone()), this;
		}
		path(e) {
			return this._tick++, this._activePath.addPath(e, this._transform.clone()), this;
		}
		lineTo(e, t) {
			this._tick++;
			let n = this._transform;
			return this._activePath.lineTo(n.a * e + n.c * t + n.tx, n.b * e + n.d * t + n.ty), this;
		}
		moveTo(e, t) {
			this._tick++;
			let n = this._transform, r = this._activePath.instructions, i = n.a * e + n.c * t + n.tx, a = n.b * e + n.d * t + n.ty;
			return r.length === 1 && r[0].action === "moveTo" ? (r[0].data[0] = i, r[0].data[1] = a, this) : (this._activePath.moveTo(i, a), this);
		}
		quadraticCurveTo(e, t, n, r, i) {
			this._tick++;
			let a = this._transform;
			return this._activePath.quadraticCurveTo(a.a * e + a.c * t + a.tx, a.b * e + a.d * t + a.ty, a.a * n + a.c * r + a.tx, a.b * n + a.d * r + a.ty, i), this;
		}
		rect(e, t, n, r) {
			return this._tick++, this._activePath.rect(e, t, n, r, this._transform.clone()), this;
		}
		roundRect(e, t, n, r, i) {
			return this._tick++, this._activePath.roundRect(e, t, n, r, i, this._transform.clone()), this;
		}
		poly(e, t) {
			return this._tick++, this._activePath.poly(e, t, this._transform.clone()), this;
		}
		regularPoly(e, t, n, r, i = 0, a) {
			return this._tick++, this._activePath.regularPoly(e, t, n, r, i, a), this;
		}
		roundPoly(e, t, n, r, i, a) {
			return this._tick++, this._activePath.roundPoly(e, t, n, r, i, a), this;
		}
		roundShape(e, t, n, r) {
			return this._tick++, this._activePath.roundShape(e, t, n, r), this;
		}
		filletRect(e, t, n, r, i) {
			return this._tick++, this._activePath.filletRect(e, t, n, r, i), this;
		}
		chamferRect(e, t, n, r, i, a) {
			return this._tick++, this._activePath.chamferRect(e, t, n, r, i, a), this;
		}
		star(e, t, n, r, i = 0, a = 0) {
			return this._tick++, this._activePath.star(e, t, n, r, i, a, this._transform.clone()), this;
		}
		svg(e) {
			return this._tick++, dS(e, this), this;
		}
		restore() {
			let e = this._stateStack.pop();
			return e && (this._transform = e.transform, this._fillStyle = e.fillStyle, this._strokeStyle = e.strokeStyle), this;
		}
		save() {
			return this._stateStack.push({
				transform: this._transform.clone(),
				fillStyle: { ...this._fillStyle },
				strokeStyle: { ...this._strokeStyle }
			}), this;
		}
		getTransform() {
			return this._transform;
		}
		resetTransform() {
			return this._transform.identity(), this;
		}
		rotate(e) {
			return this._transform.rotate(e), this;
		}
		scale(e, t = e) {
			return this._transform.scale(e, t), this;
		}
		setTransform(e, t, n, r, i, a) {
			return e instanceof j ? (this._transform.set(e.a, e.b, e.c, e.d, e.tx, e.ty), this) : (this._transform.set(e, t, n, r, i, a), this);
		}
		transform(e, t, n, r, i, a) {
			return e instanceof j ? (this._transform.append(e), this) : (kS.set(e, t, n, r, i, a), this._transform.append(kS), this);
		}
		translate(e, t = e) {
			return this._transform.translate(e, t), this;
		}
		clear() {
			return this._activePath.clear(), this.instructions.length = 0, this.resetTransform(), this.onUpdate(), this;
		}
		onUpdate() {
			this._boundsDirty = !0, this.dirty = !0, this.emit("update", this, 16);
		}
		get bounds() {
			if (!this._boundsDirty) return this._bounds;
			this._boundsDirty = !1;
			let e = this._bounds;
			e.clear();
			for (let t = 0; t < this.instructions.length; t++) {
				let n = this.instructions[t], r = n.action;
				if (r === "fill") {
					let t = n.data;
					e.addBounds(t.path.bounds);
				} else if (r === "texture") {
					let t = n.data;
					e.addFrame(t.dx, t.dy, t.dx + t.dw, t.dy + t.dh, t.transform);
				}
				if (r === "stroke") {
					let t = n.data, r = t.style.alignment, i = t.style.width * (1 - r);
					t.style.join === "miter" && (i *= ES(t.path, t.style.miterLimit));
					let a = t.path.bounds;
					e.addFrame(a.minX - i, a.minY - i, a.maxX + i, a.maxY + i);
				}
			}
			return e.isValid || e.set(0, 0, 0, 0), e;
		}
		containsPoint(e) {
			if (!this.bounds.containsPoint(e.x, e.y)) return !1;
			let t = this.instructions, n = !1;
			for (let r = 0; r < t.length; r++) {
				let i = t[r], a = i.data, o = a.path;
				if (!i.action || !o) continue;
				let s = a.style, c = o.shapePath.shapePrimitives;
				for (let t = 0; t < c.length; t++) {
					let r = c[t].shape;
					if (!s || !r) continue;
					let o = c[t].transform, l = o ? o.applyInverse(e, OS) : e;
					if (i.action === "fill") n = r.contains(l.x, l.y);
					else {
						let e = s;
						n = r.strokeContains(l.x, l.y, e.width, e.alignment);
					}
					let u = a.hole;
					if (u) {
						let e = u.shapePath?.shapePrimitives;
						if (e) for (let t = 0; t < e.length; t++) e[t].shape.contains(l.x, l.y) && (n = !1);
					}
					if (n) return !0;
				}
			}
			return n;
		}
		unload() {
			this.emit("unload", this);
			for (let e in this._gpuData) this._gpuData[e]?.destroy();
			this._gpuData = /* @__PURE__ */ Object.create(null);
		}
		destroy(e = !1) {
			if (!this.destroyed) {
				if (this.destroyed = !0, this._stateStack.length = 0, this._transform = null, this.unload(), this.emit("destroy", this), this.removeAllListeners(), typeof e == "boolean" ? e : e?.texture) {
					let t = typeof e == "boolean" ? e : e?.textureSource;
					this._fillStyle.texture && (this._fillStyle.fill && "uid" in this._fillStyle.fill ? this._fillStyle.fill.destroy() : this._fillStyle.texture.destroy(t)), this._strokeStyle.texture && (this._strokeStyle.fill && "uid" in this._strokeStyle.fill ? this._strokeStyle.fill.destroy() : this._strokeStyle.texture.destroy(t));
				}
				this._fillStyle = null, this._strokeStyle = null, this.instructions = null, this._activePath = null, this._bounds = null, this._stateStack = null, this.customShader = null, this._transform = null;
			}
		}
	}, AS.defaultFillStyle = {
		color: 16777215,
		alpha: 1,
		texture: B.WHITE,
		matrix: null,
		fill: null,
		textureSpace: "local"
	}, AS.defaultStrokeStyle = {
		width: 1,
		color: 16777215,
		alpha: 1,
		alignment: .5,
		miterLimit: 10,
		cap: "butt",
		join: "miter",
		texture: B.WHITE,
		matrix: null,
		fill: null,
		textureSpace: "local",
		pixelLine: !1
	}, jS = AS;
})), NS, PS, FS, IS, LS = o((() => {
	h(), ln(), fm(), NS = class {
		constructor() {
			this.isBatchable = !1;
		}
		reset() {
			this.isBatchable = !1, this.context = null, this.graphicsData &&= (this.graphicsData.destroy(), null);
		}
		destroy() {
			this.reset();
		}
	}, PS = class {
		constructor() {
			this.instructions = new cn();
		}
		init() {
			this.instructions.reset();
		}
		destroy() {
			this.instructions.destroy(), this.instructions = null;
		}
	}, FS = class e {
		constructor(e) {
			this._renderer = e, this._managedContexts = new dm({
				renderer: e,
				type: "resource",
				name: "graphicsContext"
			});
		}
		init(t) {
			e.defaultOptions.bezierSmoothness = t?.bezierSmoothness ?? e.defaultOptions.bezierSmoothness;
		}
		getContextRenderData(e) {
			return this.getGpuContext(e).graphicsData || this._initContextRenderData(e);
		}
		updateGpuContext(e) {
			let t = e._gpuData, n = !!t[this._renderer.uid], r = t[this._renderer.uid] || this._initContext(e);
			return (e.dirty || !n) && (n && r.reset(), r.isBatchable = !1, e.dirty = !1), r;
		}
		getGpuContext(e) {
			return e._gpuData[this._renderer.uid] || this._initContext(e);
		}
		_initContextRenderData(e) {
			let t = new PS(), n = this.getGpuContext(e);
			return n.graphicsData = t, t.init(), t;
		}
		_initContext(e) {
			let t = new NS();
			return t.context = e, e._gpuData[this._renderer.uid] = t, this._managedContexts.add(e), t;
		}
		destroy() {
			this._managedContexts.destroy(), this._renderer = null;
		}
	}, FS.extension = {
		type: [d.CanvasSystem],
		name: "graphicsContext"
	}, FS.defaultOptions = { bezierSmoothness: .5 }, IS = FS;
})), RS, zS = o((() => {
	h(), mc(), fm(), RS = class {
		constructor(e, t) {
			this.state = pc.for2d(), this.renderer = e, this._adaptor = t, this.renderer.runners.contextChange.add(this), this._managedGraphics = new dm({
				renderer: e,
				type: "renderable",
				priority: -1,
				name: "graphics"
			});
		}
		contextChange() {
			this._adaptor.contextChange(this.renderer);
		}
		validateRenderable(e) {
			return !1;
		}
		addRenderable(e, t) {
			this._managedGraphics.add(e), this.renderer.renderPipes.batch.break(t), t.add(e);
		}
		updateRenderable(e) {}
		execute(e) {
			e.isRenderable && this._adaptor.execute(this, e);
		}
		destroy() {
			this._managedGraphics.destroy(), this.renderer = null, this._adaptor.destroy(), this._adaptor = null;
		}
	}, RS.extension = {
		type: [d.CanvasPipes],
		name: "graphics"
	};
})), BS, VS, HS = o((() => {
	mc(), fm(), at(), Mp(), BS = class {
		constructor() {
			this.batches = [], this.batched = !1;
		}
		destroy() {
			this.batches.forEach((e) => {
				it.return(e);
			}), this.batches.length = 0;
		}
	}, VS = class {
		constructor(e, t, n) {
			this.state = pc.for2d(), this.renderer = e, this._adaptor = t, this.renderer.runners.contextChange.add(this), this._managedGraphics = new dm({
				renderer: e,
				type: "renderable",
				priority: -1,
				name: n
			});
		}
		contextChange() {
			this._adaptor.contextChange(this.renderer);
		}
		validateRenderable(e) {
			let t = e.context, n = !!e._gpuData, r = this._contextSystem.updateGpuContext(t);
			return !!(r.isBatchable || n !== r.isBatchable);
		}
		addRenderable(e, t) {
			let n = this._contextSystem.updateGpuContext(e.context);
			(e.didViewUpdate || !e._gpuData[this.renderer.uid]) && this._rebuild(e), n.isBatchable ? this._addToBatcher(e, t) : (this.renderer.renderPipes.batch.break(t), t.add(e));
		}
		updateRenderable(e) {
			let t = this._getGpuDataForRenderable(e).batches;
			for (let e = 0; e < t.length; e++) {
				let n = t[e];
				n._batcher.updateElement(n);
			}
		}
		execute(e) {
			if (!e.isRenderable) return;
			let t = this.renderer, n = e.context;
			if (!this._contextSystem.getGpuContext(n).batches.length) return;
			let r = n.customShader || this._adaptor.shader;
			this.state.blendMode = e.groupBlendMode;
			let i = r.resources.localUniforms.uniforms;
			i.uTransformMatrix = e.groupTransform, i.uRound = t._roundPixels | e._roundPixels, jp(e.groupColorAlpha, i.uColor, 0), this._adaptor.execute(this, e);
		}
		_rebuild(e) {
			let t = this._getGpuDataForRenderable(e), n = this._contextSystem.updateGpuContext(e.context);
			t.destroy(), n.isBatchable && this._updateBatchesForRenderable(e, t);
		}
		_addToBatcher(e, t) {
			let n = this.renderer.renderPipes.batch, r = this._getGpuDataForRenderable(e).batches;
			for (let e = 0; e < r.length; e++) {
				let i = r[e];
				n.addToBatch(i, t);
			}
		}
		_getGpuDataForRenderable(e) {
			return e._gpuData[this.renderer.uid] || this._initGpuDataForRenderable(e);
		}
		_initGpuDataForRenderable(e) {
			let t = new BS();
			return e._gpuData[this.renderer.uid] = t, this._managedGraphics.add(e), t;
		}
		_updateBatchesForRenderable(e, t) {
			let n = this._contextSystem.getGpuContext(e.context), r = this.renderer._roundPixels | e._roundPixels;
			t.batches = n.batches.map((t) => {
				let n = it.get(this._batchableClass);
				return t.copyTo(n), n.renderable = e, n.roundPixels = r, n;
			});
		}
		destroy() {
			this._managedGraphics.destroy(), this.renderer = null, this._adaptor.destroy(), this._adaptor = null, this.state = null;
		}
	};
})), US, WS = o((() => {
	h(), HS(), Qy(), US = class extends VS {
		constructor(e, t) {
			super(e, t, "graphics"), this._batchableClass = Zy;
		}
		get _contextSystem() {
			return this.renderer.graphicsContext;
		}
	}, US.extension = {
		type: [d.WebGLPipes, d.WebGPUPipes],
		name: "graphics"
	};
})), GS = o((() => {
	h(), LS(), zS(), cx(), WS(), m.add(RS), m.add(US), m.add(IS), m.add(sx);
})), KS, qS = o((() => {
	Xe(), li(), MS(), GS(), KS = class e extends ci {
		constructor(e) {
			e instanceof jS && (e = { context: e });
			let { context: t, roundPixels: n, ...r } = e || {};
			super({
				label: "Graphics",
				...r
			}), this.renderPipeId = "graphics", t ? this.context = t : (this.context = this._ownedContext = new jS(), this.context.autoGarbageCollect = this.autoGarbageCollect), this.didViewUpdate = !0, this.allowChildren = !1, this.roundPixels = n ?? !1;
		}
		set context(e) {
			e !== this._context && (this._context && (this._context.off("update", this.onViewUpdate, this), this._context.off("unload", this.unload, this)), this._context = e, this._context.on("update", this.onViewUpdate, this), this._context.on("unload", this.unload, this), this.onViewUpdate());
		}
		get context() {
			return this._context;
		}
		get bounds() {
			return this._context.bounds;
		}
		updateBounds() {}
		containsPoint(e) {
			return this._context.containsPoint(e);
		}
		destroy(e) {
			this._ownedContext && !e ? this._ownedContext.destroy(e) : (e === !0 || e?.context === !0) && this._context.destroy(e), this._context?.off("update", this.onViewUpdate, this), this._context?.off("unload", this.unload, this), this._ownedContext = null, this._context = null, super.destroy(e);
		}
		_onTouch(e) {
			this._gcLastUsed = e, this._context._gcLastUsed = e;
		}
		_callContextMethod(e, t) {
			return this.context[e](...t), this;
		}
		setFillStyle(...e) {
			return this._callContextMethod("setFillStyle", e);
		}
		setStrokeStyle(...e) {
			return this._callContextMethod("setStrokeStyle", e);
		}
		fill(...e) {
			return this._callContextMethod("fill", e);
		}
		stroke(...e) {
			return this._callContextMethod("stroke", e);
		}
		texture(...e) {
			return this._callContextMethod("texture", e);
		}
		beginPath() {
			return this._callContextMethod("beginPath", []);
		}
		cut() {
			return this._callContextMethod("cut", []);
		}
		arc(...e) {
			return this._callContextMethod("arc", e);
		}
		arcTo(...e) {
			return this._callContextMethod("arcTo", e);
		}
		arcToSvg(...e) {
			return this._callContextMethod("arcToSvg", e);
		}
		bezierCurveTo(...e) {
			return this._callContextMethod("bezierCurveTo", e);
		}
		closePath() {
			return this._callContextMethod("closePath", []);
		}
		ellipse(...e) {
			return this._callContextMethod("ellipse", e);
		}
		circle(...e) {
			return this._callContextMethod("circle", e);
		}
		path(...e) {
			return this._callContextMethod("path", e);
		}
		lineTo(...e) {
			return this._callContextMethod("lineTo", e);
		}
		moveTo(...e) {
			return this._callContextMethod("moveTo", e);
		}
		quadraticCurveTo(...e) {
			return this._callContextMethod("quadraticCurveTo", e);
		}
		rect(...e) {
			return this._callContextMethod("rect", e);
		}
		roundRect(...e) {
			return this._callContextMethod("roundRect", e);
		}
		poly(...e) {
			return this._callContextMethod("poly", e);
		}
		regularPoly(...e) {
			return this._callContextMethod("regularPoly", e);
		}
		roundPoly(...e) {
			return this._callContextMethod("roundPoly", e);
		}
		roundShape(...e) {
			return this._callContextMethod("roundShape", e);
		}
		filletRect(...e) {
			return this._callContextMethod("filletRect", e);
		}
		chamferRect(...e) {
			return this._callContextMethod("chamferRect", e);
		}
		star(...e) {
			return this._callContextMethod("star", e);
		}
		svg(...e) {
			return this._callContextMethod("svg", e);
		}
		restore(...e) {
			return this._callContextMethod("restore", e);
		}
		save() {
			return this._callContextMethod("save", []);
		}
		getTransform() {
			return this.context.getTransform();
		}
		resetTransform() {
			return this._callContextMethod("resetTransform", []);
		}
		rotateTransform(...e) {
			return this._callContextMethod("rotate", e);
		}
		scaleTransform(...e) {
			return this._callContextMethod("scale", e);
		}
		setTransform(...e) {
			return this._callContextMethod("setTransform", e);
		}
		transform(...e) {
			return this._callContextMethod("transform", e);
		}
		translateTransform(...e) {
			return this._callContextMethod("translate", e);
		}
		clear() {
			return this._callContextMethod("clear", []);
		}
		get fillStyle() {
			return this._context.fillStyle;
		}
		set fillStyle(e) {
			this._context.fillStyle = e;
		}
		get strokeStyle() {
			return this._context.strokeStyle;
		}
		set strokeStyle(e) {
			this._context.strokeStyle = e;
		}
		clone(t = !1) {
			return t ? new e(this._context.clone()) : (this._ownedContext = null, new e(this._context));
		}
		lineStyle(e, t, n) {
			F(P, "Graphics#lineStyle is no longer needed. Use Graphics#setStrokeStyle to set the stroke style.");
			let r = {};
			return e && (r.width = e), t && (r.color = t), n && (r.alpha = n), this.context.strokeStyle = r, this;
		}
		beginFill(e, t) {
			F(P, "Graphics#beginFill is no longer needed. Use Graphics#fill to fill the shape with the desired style.");
			let n = {};
			return e !== void 0 && (n.color = e), t !== void 0 && (n.alpha = t), this.context.fillStyle = n, this;
		}
		endFill() {
			F(P, "Graphics#endFill is no longer needed. Use Graphics#fill to fill the shape with the desired style."), this.context.fill();
			let e = this.context.strokeStyle;
			return (e.width !== jS.defaultStrokeStyle.width || e.color !== jS.defaultStrokeStyle.color || e.alpha !== jS.defaultStrokeStyle.alpha) && this.context.stroke(), this;
		}
		drawCircle(...e) {
			return F(P, "Graphics#drawCircle has been renamed to Graphics#circle"), this._callContextMethod("circle", e);
		}
		drawEllipse(...e) {
			return F(P, "Graphics#drawEllipse has been renamed to Graphics#ellipse"), this._callContextMethod("ellipse", e);
		}
		drawPolygon(...e) {
			return F(P, "Graphics#drawPolygon has been renamed to Graphics#poly"), this._callContextMethod("poly", e);
		}
		drawRect(...e) {
			return F(P, "Graphics#drawRect has been renamed to Graphics#rect"), this._callContextMethod("rect", e);
		}
		drawRoundedRect(...e) {
			return F(P, "Graphics#drawRoundedRect has been renamed to Graphics#roundRect"), this._callContextMethod("roundRect", e);
		}
		drawStar(...e) {
			return F(P, "Graphics#drawStar has been renamed to Graphics#star"), this._callContextMethod("star", e);
		}
	};
}));
// node_modules/pixi.js/lib/rendering/mask/stencil/CanvasStencilMaskPipe.mjs
function JS(e, t, n, r, i, a) {
	a = Math.max(0, Math.min(a, Math.min(r, i) / 2)), e.moveTo(t + a, n), e.lineTo(t + r - a, n), e.quadraticCurveTo(t + r, n, t + r, n + a), e.lineTo(t + r, n + i - a), e.quadraticCurveTo(t + r, n + i, t + r - a, n + i), e.lineTo(t + a, n + i), e.quadraticCurveTo(t, n + i, t, n + i - a), e.lineTo(t, n + a), e.quadraticCurveTo(t, n, t + a, n);
}
function YS(e, t) {
	switch (t.type) {
		case "rectangle": {
			let n = t;
			e.rect(n.x, n.y, n.width, n.height);
			break;
		}
		case "roundedRectangle": {
			let n = t;
			JS(e, n.x, n.y, n.width, n.height, n.radius);
			break;
		}
		case "circle": {
			let n = t;
			e.moveTo(n.x + n.radius, n.y), e.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
			break;
		}
		case "ellipse": {
			let n = t;
			e.ellipse ? (e.moveTo(n.x + n.halfWidth, n.y), e.ellipse(n.x, n.y, n.halfWidth, n.halfHeight, 0, 0, Math.PI * 2)) : (e.save(), e.translate(n.x, n.y), e.scale(n.halfWidth, n.halfHeight), e.moveTo(1, 0), e.arc(0, 0, 1, 0, Math.PI * 2), e.restore());
			break;
		}
		case "triangle": {
			let n = t;
			e.moveTo(n.x, n.y), e.lineTo(n.x2, n.y2), e.lineTo(n.x3, n.y3), e.closePath();
			break;
		}
		default: {
			let n = t, r = n.points;
			if (!r?.length) break;
			e.moveTo(r[0], r[1]);
			for (let t = 2; t < r.length; t += 2) e.lineTo(r[t], r[t + 1]);
			n.closePath && e.closePath();
			break;
		}
	}
}
function XS(e, t, n) {
	let r = [], i = [], a = [];
	if (!Cb[t.type]?.build(t, r)) return !1;
	Ay(r, n, !1, t.closePath ?? !0, i, a);
	for (let t = 0; t < a.length; t += 3) {
		let n = a[t] * 2, r = a[t + 1] * 2, o = a[t + 2] * 2;
		e.moveTo(i[n], i[n + 1]), e.lineTo(i[r], i[r + 1]), e.lineTo(i[o], i[o + 1]), e.closePath();
	}
	return !0;
}
function ZS(e, t) {
	if (!t?.length) return !1;
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		if (!r?.shape) continue;
		let i = r.transform, a = i && !i.isIdentity();
		a && (e.save(), e.transform(i.a, i.b, i.c, i.d, i.tx, i.ty)), YS(e, r.shape), a && e.restore();
	}
	return !0;
}
var QS, $S = o((() => {
	h(), jy(), qS(), Eb(), L(), QS = class {
		constructor(e) {
			this._warnedMaskTypes = /* @__PURE__ */ new Set(), this._canvasMaskStack = [], this._renderer = e;
		}
		push(e, t, n) {
			this._renderer.renderPipes.batch.break(n), n.add({
				renderPipeId: "stencilMask",
				action: "pushMaskBegin",
				mask: e,
				inverse: t._maskOptions.inverse,
				canBundle: !1
			});
		}
		pop(e, t, n) {
			this._renderer.renderPipes.batch.break(n), n.add({
				renderPipeId: "stencilMask",
				action: "popMaskEnd",
				mask: e,
				inverse: t._maskOptions.inverse,
				canBundle: !1
			});
		}
		execute(e) {
			if (e.action !== "pushMaskBegin" && e.action !== "popMaskEnd") return;
			let t = this._renderer, n = t.canvasContext, r = n?.activeContext;
			if (!r) return;
			if (e.action === "popMaskEnd") {
				this._canvasMaskStack.pop() && r.restore();
				return;
			}
			e.inverse && this._warnOnce("inverse", "CanvasRenderer: inverse masks are not supported on Canvas2D; ignoring inverse flag.");
			let i = e.mask.mask;
			if (!(i instanceof KS)) {
				this._warnOnce("nonGraphics", "CanvasRenderer: only Graphics masks are supported in Canvas2D; skipping mask."), this._canvasMaskStack.push(!1);
				return;
			}
			let a = i, o = a.context?.instructions;
			if (!o?.length) {
				this._canvasMaskStack.push(!1);
				return;
			}
			r.save(), n.setContextTransform(a.groupTransform, (t._roundPixels | a._roundPixels) === 1), r.beginPath();
			let s = !1, c = !1;
			for (let e = 0; e < o.length; e++) {
				let t = o[e], n = t.action;
				if (n !== "fill" && n !== "stroke") continue;
				let i = t.data, a = i?.path?.shapePath;
				if (!a?.shapePrimitives?.length) continue;
				let l = n === "stroke", u = a.shapePrimitives;
				for (let e = 0; e < u.length; e++) {
					let t = u[e];
					if (!t?.shape) continue;
					let n = t.transform, a = n && !n.isIdentity();
					a && (r.save(), r.transform(n.a, n.b, n.c, n.d, n.tx, n.ty)), l && i.style ? s = XS(r, t.shape, i.style) || s : (YS(r, t.shape), c = ZS(r, t.holes) || c, s = !0), a && r.restore();
				}
			}
			s ? (c ? r.clip("evenodd") : r.clip(), this._canvasMaskStack.push(!0)) : (r.restore(), this._canvasMaskStack.push(!1));
		}
		destroy() {
			this._renderer = null, this._warnedMaskTypes = null, this._canvasMaskStack = null;
		}
		_warnOnce(e, t) {
			this._warnedMaskTypes.has(e) || (this._warnedMaskTypes.add(e), I(t));
		}
	}, QS.extension = {
		type: [d.CanvasPipes],
		name: "stencilMask"
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/canvas/utils/mapCanvasBlendModesToPixi.mjs
function eC() {
	let e = Ya(), t = /* @__PURE__ */ Object.create(null);
	return t.inherit = tC, t.none = tC, t.normal = "source-over", t.add = "lighter", t.multiply = e ? "multiply" : tC, t.screen = e ? "screen" : tC, t.overlay = e ? "overlay" : tC, t.darken = e ? "darken" : tC, t.lighten = e ? "lighten" : tC, t["color-dodge"] = e ? "color-dodge" : tC, t["color-burn"] = e ? "color-burn" : tC, t["hard-light"] = e ? "hard-light" : tC, t["soft-light"] = e ? "soft-light" : tC, t.difference = e ? "difference" : tC, t.exclusion = e ? "exclusion" : tC, t.saturation = e ? "saturation" : tC, t.color = e ? "color" : tC, t.luminosity = e ? "luminosity" : tC, t["linear-burn"] = e ? "color-burn" : tC, t["linear-dodge"] = e ? "color-dodge" : tC, t["linear-light"] = e ? "hard-light" : tC, t["pin-light"] = e ? "hard-light" : tC, t["vivid-light"] = e ? "hard-light" : tC, t["hard-mix"] = tC, t.negation = e ? "difference" : tC, t["normal-npm"] = t.normal, t["add-npm"] = t.add, t["screen-npm"] = t.screen, t.erase = "destination-out", t.subtract = tC, t.divide = tC, t.min = tC, t.max = tC, t;
}
var tC, nC = o((() => {
	Za(), tC = "source-over";
})), rC, iC, aC = o((() => {
	ke(), h(), M(), nC(), rC = new j(), iC = class {
		constructor(e) {
			this.activeResolution = 1, this.smoothProperty = "imageSmoothingEnabled", this.blendModes = eC(), this._activeBlendMode = "normal", this._projTransform = null, this._outerBlend = !1, this._warnedBlendModes = /* @__PURE__ */ new Set(), this._renderer = e;
		}
		resolutionChange(e) {
			this.activeResolution = e;
		}
		init() {
			let e = this._renderer.background.alpha < 1;
			if (this.rootContext = this._renderer.canvas.getContext("2d", { alpha: e }), this.activeContext = this.rootContext, this.activeResolution = this._renderer.resolution, !this.rootContext.imageSmoothingEnabled) {
				let e = this.rootContext;
				e.webkitImageSmoothingEnabled ? this.smoothProperty = "webkitImageSmoothingEnabled" : e.mozImageSmoothingEnabled ? this.smoothProperty = "mozImageSmoothingEnabled" : e.oImageSmoothingEnabled ? this.smoothProperty = "oImageSmoothingEnabled" : e.msImageSmoothingEnabled && (this.smoothProperty = "msImageSmoothingEnabled");
			}
		}
		setContextTransform(e, t, n, r) {
			let i = r ? j.IDENTITY : this._renderer.globalUniforms.globalUniformData?.worldTransformMatrix || j.IDENTITY, a = rC;
			a.copyFrom(i), a.append(e);
			let o = this._projTransform, s = this.activeResolution;
			if (n ||= s, o) {
				let e = j.shared;
				e.copyFrom(a), e.prepend(o), a = e;
			}
			t ? this.activeContext.setTransform(a.a * n, a.b * n, a.c * n, a.d * n, a.tx * s | 0, a.ty * s | 0) : this.activeContext.setTransform(a.a * n, a.b * n, a.c * n, a.d * n, a.tx * s, a.ty * s);
		}
		clear(e, t) {
			let n = this.activeContext, r = this._renderer;
			if (n.clearRect(0, 0, r.width, r.height), e) {
				let i = A.shared.setValue(e);
				n.globalAlpha = t ?? i.alpha, n.fillStyle = i.toHex(), n.fillRect(0, 0, r.width, r.height), n.globalAlpha = 1;
			}
		}
		setBlendMode(e) {
			if (this._activeBlendMode === e) return;
			this._activeBlendMode = e, this._outerBlend = !1;
			let t = this.blendModes[e];
			t ? this.activeContext.globalCompositeOperation = t : (this._warnedBlendModes.has(e) || (console.warn(`CanvasRenderer: blend mode "${e}" is not supported in Canvas2D; falling back to "source-over".`), this._warnedBlendModes.add(e)), this.activeContext.globalCompositeOperation = "source-over");
		}
		destroy() {
			this.rootContext = null, this.activeContext = null, this._warnedBlendModes.clear();
		}
	}, iC.extension = {
		type: [d.CanvasSystem],
		name: "canvasContext"
	};
})), oC, sC = o((() => {
	h(), oC = class {
		constructor() {
			this.maxTextures = 16, this.maxBatchableTextures = 16, this.maxUniformBindings = 0, this.minUniformBufferOffsetAlignment = 0;
		}
		init() {}
	}, oC.extension = {
		type: [d.CanvasSystem],
		name: "limits"
	};
})), cC, lC = o((() => {
	ke(), W(), L(), Aa(), cC = class {
		init(e, t) {
			this._renderer = e, this._renderTargetSystem = t;
		}
		initGpuRenderTarget(e) {
			let t = e.colorTexture, { canvas: n, context: r } = this._ensureCanvas(t);
			return {
				canvas: n,
				context: r,
				width: n.width,
				height: n.height
			};
		}
		resizeGpuRenderTarget(e) {
			let t = e.colorTexture, { canvas: n } = this._ensureCanvas(t);
			n.width = e.pixelWidth, n.height = e.pixelHeight;
		}
		startRenderPass(e, t, n, r) {
			let i = this._renderTargetSystem.getGpuRenderTarget(e);
			this._renderer.canvasContext.activeContext = i.context, this._renderer.canvasContext.activeResolution = e.resolution, t && this.clear(e, t, n, r);
		}
		clear(e, t, n, r) {
			let i = this._renderTargetSystem.getGpuRenderTarget(e).context, a = r || {
				x: 0,
				y: 0,
				width: e.pixelWidth,
				height: e.pixelHeight
			};
			if (i.setTransform(1, 0, 0, 1, 0, 0), i.clearRect(a.x, a.y, a.width, a.height), n) {
				let e = A.shared.setValue(n);
				e.alpha > 0 && (i.globalAlpha = e.alpha, i.fillStyle = e.toHex(), i.fillRect(a.x, a.y, a.width, a.height), i.globalAlpha = 1);
			}
		}
		finishRenderPass() {}
		copyToTexture(e, t, n, r, i) {
			let a = this._renderTargetSystem.getGpuRenderTarget(e).canvas, o = t.source, { context: s } = this._ensureCanvas(o), c = i?.x ?? 0, l = i?.y ?? 0;
			return s.drawImage(a, n.x, n.y, r.width, r.height, c, l, r.width, r.height), o.update(), t;
		}
		copyDepthTexture(e, t, n, r, i) {
			I("[CanvasRenderTargetAdaptor] copyDepthTexture is not supported in the canvas renderer");
		}
		destroyGpuRenderTarget(e) {}
		_ensureCanvas(e) {
			let t = e.resource;
			t && ka.test(t) || (t = U.get().createCanvas(e.pixelWidth, e.pixelHeight), e.resource = t), (t.width !== e.pixelWidth || t.height !== e.pixelHeight) && (t.width = e.pixelWidth, t.height = e.pixelHeight);
			let n = t.getContext("2d");
			return {
				canvas: t,
				context: n
			};
		}
	};
})), uC, dC = o((() => {
	h(), Dh(), lC(), uC = class extends Eh {
		constructor(e) {
			super(e), this.adaptor = new cC(), this.adaptor.init(e, this);
		}
	}, uC.extension = {
		type: [d.CanvasSystem],
		name: "renderTarget"
	};
})), fC, pC = o((() => {
	W(), h(), Qa(), fC = class {
		constructor(e) {}
		init() {}
		initSource(e) {}
		generateCanvas(e) {
			let t = U.get().createCanvas(), n = t.getContext("2d"), r = G.getCanvasSource(e);
			if (!r) return t;
			let i = e.frame, a = e.source._resolution ?? e.source.resolution ?? 1, o = i.x * a, s = i.y * a, c = i.width * a, l = i.height * a;
			return t.width = Math.ceil(c), t.height = Math.ceil(l), n.drawImage(r, o, s, c, l, 0, 0, c, l), t;
		}
		getPixels(e) {
			let t = this.generateCanvas(e);
			return {
				pixels: t.getContext("2d", { willReadFrequently: !0 }).getImageData(0, 0, t.width, t.height).data,
				width: t.width,
				height: t.height
			};
		}
		destroy() {}
	}, fC.extension = {
		type: [d.CanvasSystem],
		name: "texture"
	};
})), mC = /* @__PURE__ */ c({ CanvasRenderer: () => SC }), hC, gC, _C, vC, yC, bC, xC, SC, CC = o((() => {
	h(), Dd(), Nd(), Bb(), Yd(), Ub(), Wf(), np(), Gb(), $S(), fp(), ou(), om(), Gs(), aC(), sC(), dC(), pC(), hC = [
		...im,
		iC,
		oC,
		fC,
		uC
	], gC = [
		dp,
		Uf,
		Jd,
		Md,
		tp,
		QS,
		Wb,
		Ed
	], _C = [Hb, zb], vC = [], yC = [], bC = [], xC = [], m.handleByNamedList(d.CanvasSystem, vC), m.handleByNamedList(d.CanvasPipes, yC), m.handleByNamedList(d.CanvasPipesAdaptor, bC), m.handleByNamedList(d.CanvasLoader, xC), m.add(...hC, ...gC, ..._C), SC = class extends au {
		constructor() {
			let e = {
				name: "canvas",
				type: Ws.CANVAS,
				systems: vC,
				renderPipes: yC,
				renderPipeAdaptors: bC,
				loaders: xC
			};
			super(e);
		}
	};
}));
// node_modules/pixi.js/lib/rendering/renderers/autoDetectRenderer.mjs
ou();
var wC = [
	"webgl",
	"webgpu",
	"canvas"
];
async function TC(e) {
	let t = [];
	e.preference ? Array.isArray(e.preference) ? t = e.preference.slice() : (t.push(e.preference), wC.forEach((n) => {
		n !== e.preference && t.push(n);
	})) : t = wC.slice();
	let n, r = {};
	for (let i = 0; i < t.length; i++) {
		let a = t[i];
		if (a === "webgpu" && await uu()) {
			let { WebGPURenderer: t } = await Promise.resolve().then(() => (Ng(), wg));
			n = t, r = {
				...e,
				...e.webgpu
			};
			break;
		}
		if (a === "webgl" && cu(e.failIfMajorPerformanceCaveat ?? au.defaultOptions.failIfMajorPerformanceCaveat)) {
			let { WebGLRenderer: t } = await Promise.resolve().then(() => (wy(), hy));
			n = t, r = {
				...e,
				...e.webgl
			};
			break;
		}
		if (a === "canvas") {
			let { CanvasRenderer: t } = await Promise.resolve().then(() => (CC(), mC));
			n = t, r = {
				...e,
				...e.canvasOptions
			};
			break;
		}
	}
	if (delete r.webgpu, delete r.webgl, delete r.canvasOptions, !n) throw Error("No available renderer for the current environment");
	let i = new n();
	return await i.init(r), i;
}
// node_modules/pixi.js/lib/app/ResizePlugin.mjs
h();
var EC = class {
	static init(e) {
		Object.defineProperty(this, "resizeTo", {
			configurable: !0,
			set(e) {
				globalThis.removeEventListener("resize", this.queueResize), this._resizeTo = e, e && (globalThis.addEventListener("resize", this.queueResize), this.resize());
			},
			get() {
				return this._resizeTo;
			}
		}), this.queueResize = () => {
			this._resizeTo && (this._cancelResize(), this._resizeId = requestAnimationFrame(() => this.resize()));
		}, this._cancelResize = () => {
			this._resizeId &&= (cancelAnimationFrame(this._resizeId), null);
		}, this.resize = () => {
			if (!this._resizeTo) return;
			this._cancelResize();
			let e, t;
			if (this._resizeTo === globalThis.window) e = globalThis.innerWidth, t = globalThis.innerHeight;
			else {
				let { clientWidth: n, clientHeight: r } = this._resizeTo;
				e = n, t = r;
			}
			this.renderer.resize(e, t), this.render();
		}, this._resizeId = null, this._resizeTo = null, this.resizeTo = e.resizeTo || null;
	}
	static destroy() {
		globalThis.removeEventListener("resize", this.queueResize), this._cancelResize(), this._cancelResize = null, this.queueResize = null, this.resizeTo = null, this.resize = null;
	}
};
EC.extension = d.Application, h(), pr(), vr();
var DC = class {
	static init(e) {
		e = Object.assign({
			autoStart: !0,
			sharedTicker: !1
		}, e), Object.defineProperty(this, "ticker", {
			configurable: !0,
			set(e) {
				this._ticker && this._ticker.remove(this.render, this), this._ticker = e, e && e.add(this.render, this, fr.LOW);
			},
			get() {
				return this._ticker;
			}
		}), this.stop = () => {
			this._ticker.stop();
		}, this.start = () => {
			this._ticker.start();
		}, this._ticker = null, this.ticker = e.sharedTicker ? _r.shared : new _r(), e.autoStart && this.start();
	}
	static destroy() {
		if (this._ticker) {
			let e = this._ticker;
			this.ticker = null, e.destroy();
		}
	}
};
DC.extension = d.Application, h(), m.add(EC), m.add(DC), h(), dr(), ef(), Xe();
var OC = class e {
	constructor(...e) {
		this.stage = new H(), e[0] !== void 0 && F(P, "Application constructor options are deprecated, please use Application.init() instead.");
	}
	async init(t) {
		t = { ...t }, this.stage ||= new H(), this.renderer = await TC(t), e._plugins.forEach((e) => {
			e.init.call(this, t);
		});
	}
	render() {
		this.renderer.render({ container: this.stage });
	}
	get canvas() {
		return this.renderer.canvas;
	}
	get view() {
		return F(P, "Application.view is deprecated, please use Application.canvas instead."), this.renderer.canvas;
	}
	get screen() {
		return this.renderer.screen;
	}
	get domContainerRoot() {
		return this.renderer.renderPipes.dom?._domElement;
	}
	destroy(t = !1, n = !1) {
		let r = e._plugins.slice(0);
		r.reverse(), r.forEach((e) => {
			e.destroy.call(this);
		}), this.stage.destroy(n), this.stage = null, this.renderer.destroy(t), this.renderer = null;
	}
};
OC._plugins = [];
var kC = OC;
m.handleByList(d.Application, kC._plugins), m.add(Qd);
// node_modules/pixi.js/lib/scene/text-bitmap/asset/bitmapFontTextParser.mjs
var AC = {
	test(e) {
		return typeof e == "string" && e.startsWith("info face=");
	},
	parse(e) {
		let t = e.match(/^[a-z]+\s+.+$/gm), n = {
			info: [],
			common: [],
			page: [],
			char: [],
			chars: [],
			kerning: [],
			kernings: [],
			distanceField: []
		};
		for (let e in t) {
			let r = t[e].match(/^[a-z]+/gm)[0], i = t[e].match(/[a-zA-Z]+=([^\s"']+|"([^"]*)")/gm), a = {};
			for (let e in i) {
				let t = i[e].split("="), n = t[0], r = t[1].replace(/"/gm, ""), o = parseFloat(r);
				a[n] = isNaN(o) ? r : o;
			}
			n[r].push(a);
		}
		let r = {
			chars: {},
			pages: [],
			lineHeight: 0,
			fontSize: 0,
			fontFamily: "",
			distanceField: null,
			baseLineOffset: 0
		}, [i] = n.info, [a] = n.common, [o] = n.distanceField ?? [];
		o && (r.distanceField = {
			range: parseInt(o.distanceRange, 10),
			type: o.fieldType
		}), r.fontSize = parseInt(i.size, 10), r.fontFamily = i.face, r.lineHeight = parseInt(a.lineHeight, 10);
		let s = n.page;
		for (let e = 0; e < s.length; e++) r.pages.push({
			id: parseInt(s[e].id, 10) || 0,
			file: s[e].file
		});
		let c = {};
		r.baseLineOffset = a.base === void 0 ? 0 : r.lineHeight - parseInt(a.base, 10);
		let l = n.char;
		for (let e = 0; e < l.length; e++) {
			let t = l[e], n = parseInt(t.id, 10), i = t.letter ?? t.char ?? String.fromCharCode(n);
			i === "space" && (i = " "), c[n] = i, r.chars[i] = {
				id: n,
				page: parseInt(t.page, 10) || 0,
				x: parseInt(t.x, 10),
				y: parseInt(t.y, 10),
				width: parseInt(t.width, 10),
				height: parseInt(t.height, 10),
				xOffset: parseInt(t.xoffset, 10),
				yOffset: parseInt(t.yoffset, 10),
				xAdvance: parseInt(t.xadvance, 10),
				kerning: {}
			};
		}
		let u = n.kerning || [];
		for (let e = 0; e < u.length; e++) {
			let t = parseInt(u[e].first, 10), n = parseInt(u[e].second, 10), i = parseInt(u[e].amount, 10);
			r.chars[c[n]] && (r.chars[c[n]].kerning[c[t]] = i);
		}
		return r;
	}
}, jC = {
	test(e) {
		let t = e;
		return typeof t != "string" && "getElementsByTagName" in t && t.getElementsByTagName("page").length && t.getElementsByTagName("info")[0].getAttribute("face") !== null;
	},
	parse(e) {
		let t = {
			chars: {},
			pages: [],
			lineHeight: 0,
			fontSize: 0,
			fontFamily: "",
			distanceField: null,
			baseLineOffset: 0
		}, n = e.getElementsByTagName("info")[0], r = e.getElementsByTagName("common")[0], i = e.getElementsByTagName("distanceField")[0];
		i && (t.distanceField = {
			type: i.getAttribute("fieldType"),
			range: parseInt(i.getAttribute("distanceRange"), 10)
		});
		let a = e.getElementsByTagName("page"), o = e.getElementsByTagName("char"), s = e.getElementsByTagName("kerning");
		t.fontSize = parseInt(n.getAttribute("size"), 10), t.fontFamily = n.getAttribute("face"), t.lineHeight = parseInt(r.getAttribute("lineHeight"), 10);
		for (let e = 0; e < a.length; e++) t.pages.push({
			id: parseInt(a[e].getAttribute("id"), 10) || 0,
			file: a[e].getAttribute("file")
		});
		let c = {}, l = r.getAttribute("base");
		t.baseLineOffset = l === null ? 0 : t.lineHeight - parseInt(l, 10);
		for (let e = 0; e < o.length; e++) {
			let n = o[e], r = parseInt(n.getAttribute("id"), 10), i = n.getAttribute("letter") ?? n.getAttribute("char") ?? String.fromCharCode(r);
			i === "space" && (i = " "), c[r] = i, t.chars[i] = {
				id: r,
				page: parseInt(n.getAttribute("page"), 10) || 0,
				x: parseInt(n.getAttribute("x"), 10),
				y: parseInt(n.getAttribute("y"), 10),
				width: parseInt(n.getAttribute("width"), 10),
				height: parseInt(n.getAttribute("height"), 10),
				xOffset: parseInt(n.getAttribute("xoffset"), 10),
				yOffset: parseInt(n.getAttribute("yoffset"), 10),
				xAdvance: parseInt(n.getAttribute("xadvance"), 10),
				kerning: {}
			};
		}
		for (let e = 0; e < s.length; e++) {
			let n = parseInt(s[e].getAttribute("first"), 10), r = parseInt(s[e].getAttribute("second"), 10), i = parseInt(s[e].getAttribute("amount"), 10);
			t.chars[c[r]] && (t.chars[c[r]].kerning[c[n]] = i);
		}
		return t;
	}
};
// node_modules/pixi.js/lib/scene/text-bitmap/asset/bitmapFontXMLStringParser.mjs
W();
var MC = {
	test(e) {
		return typeof e == "string" && e.match(/<font(\s|>)/) ? jC.test(U.get().parseXML(e)) : !1;
	},
	parse(e) {
		return jC.parse(U.get().parseXML(e));
	}
}, NC, PC = o((() => {
	y(), Xe(), NC = class extends v {
		constructor() {
			super(...arguments), this.chars = /* @__PURE__ */ Object.create(null), this.lineHeight = 0, this.fontFamily = "", this.fontMetrics = {
				fontSize: 0,
				ascent: 0,
				descent: 0
			}, this.baseLineOffset = 0, this.distanceField = {
				type: "none",
				range: 0
			}, this.pages = [], this.applyFillAsTint = !0, this.baseMeasurementFontSize = 100, this.baseRenderedFontSize = 100;
		}
		get font() {
			return F(P, "BitmapFont.font is deprecated, please use BitmapFont.fontFamily instead."), this.fontFamily;
		}
		get pageTextures() {
			return F(P, "BitmapFont.pageTextures is deprecated, please use BitmapFont.pages instead."), this.pages;
		}
		get size() {
			return F(P, "BitmapFont.size is deprecated, please use BitmapFont.fontMetrics.fontSize instead."), this.fontMetrics.fontSize;
		}
		get distanceFieldRange() {
			return F(P, "BitmapFont.distanceFieldRange is deprecated, please use BitmapFont.distanceField.range instead."), this.distanceField.range;
		}
		get distanceFieldType() {
			return F(P, "BitmapFont.distanceFieldType is deprecated, please use BitmapFont.distanceField.type instead."), this.distanceField.type;
		}
		destroy(e = !1) {
			this.emit("destroy", this), this.removeAllListeners();
			for (let e in this.chars) this.chars[e].texture?.destroy();
			this.chars = null, e && (this.pages.forEach((e) => e.texture.destroy(!0)), this.pages = null);
		}
	};
}));
// node_modules/tiny-lru/dist/tiny-lru.js
function FC(e = 1e3, t = 0, n = !1) {
	if (isNaN(e) || e < 0) throw TypeError("Invalid max value");
	if (isNaN(t) || t < 0) throw TypeError("Invalid ttl value");
	if (typeof n != "boolean") throw TypeError("Invalid resetTtl value");
	return new IC(e, t, n);
}
var IC, LC = o((() => {
	IC = class {
		constructor(e = 0, t = 0, n = !1) {
			this.first = null, this.items = Object.create(null), this.last = null, this.max = e, this.resetTtl = n, this.size = 0, this.ttl = t;
		}
		clear() {
			return this.first = null, this.items = Object.create(null), this.last = null, this.size = 0, this;
		}
		delete(e) {
			if (this.has(e)) {
				let t = this.items[e];
				delete this.items[e], this.size--, t.prev !== null && (t.prev.next = t.next), t.next !== null && (t.next.prev = t.prev), this.first === t && (this.first = t.next), this.last === t && (this.last = t.prev);
			}
			return this;
		}
		entries(e = this.keys()) {
			let t = Array(e.length);
			for (let n = 0; n < e.length; n++) {
				let r = e[n];
				t[n] = [r, this.get(r)];
			}
			return t;
		}
		evict(e = !1) {
			if (e || this.size > 0) {
				let e = this.first;
				delete this.items[e.key], --this.size === 0 ? (this.first = null, this.last = null) : (this.first = e.next, this.first.prev = null);
			}
			return this;
		}
		expiresAt(e) {
			let t;
			return this.has(e) && (t = this.items[e].expiry), t;
		}
		get(e) {
			let t = this.items[e];
			if (t !== void 0) {
				if (this.ttl > 0 && t.expiry <= Date.now()) {
					this.delete(e);
					return;
				}
				return this.moveToEnd(t), t.value;
			}
		}
		has(e) {
			return e in this.items;
		}
		moveToEnd(e) {
			this.last !== e && (e.prev !== null && (e.prev.next = e.next), e.next !== null && (e.next.prev = e.prev), this.first === e && (this.first = e.next), e.prev = this.last, e.next = null, this.last !== null && (this.last.next = e), this.last = e, this.first === null && (this.first = e));
		}
		keys() {
			let e = Array(this.size), t = this.first, n = 0;
			for (; t !== null;) e[n++] = t.key, t = t.next;
			return e;
		}
		setWithEvicted(e, t, n = this.resetTtl) {
			let r = null;
			if (this.has(e)) this.set(e, t, !0, n);
			else {
				this.max > 0 && this.size === this.max && (r = { ...this.first }, this.evict(!0));
				let n = this.items[e] = {
					expiry: this.ttl > 0 ? Date.now() + this.ttl : this.ttl,
					key: e,
					prev: this.last,
					next: null,
					value: t
				};
				++this.size === 1 ? this.first = n : this.last.next = n, this.last = n;
			}
			return r;
		}
		set(e, t, n = !1, r = this.resetTtl) {
			let i = this.items[e];
			return n || i !== void 0 ? (i.value = t, n === !1 && r && (i.expiry = this.ttl > 0 ? Date.now() + this.ttl : this.ttl), this.moveToEnd(i)) : (this.max > 0 && this.size === this.max && this.evict(!0), i = this.items[e] = {
				expiry: this.ttl > 0 ? Date.now() + this.ttl : this.ttl,
				key: e,
				prev: this.last,
				next: null,
				value: t
			}, ++this.size === 1 ? this.first = i : this.last.next = i, this.last = i), this;
		}
		values(e = this.keys()) {
			let t = Array(e.length);
			for (let n = 0; n < e.length; n++) t[n] = this.get(e[n]);
			return t;
		}
	};
}));
// node_modules/pixi.js/lib/scene/text/canvas/utils/parseTaggedText.mjs
function RC(e) {
	return !!e.tagStyles && Object.keys(e.tagStyles).length > 0;
}
function zC(e) {
	return e.includes("<");
}
function BC(e, t) {
	return e.clone().assign(t);
}
function VC(e, t) {
	let n = [], r = t.tagStyles;
	if (!RC(t) || !zC(e)) return n.push({
		text: e,
		style: t
	}), n;
	let i = [t], a = [], o = "", s = 0;
	for (; s < e.length;) {
		let t = e[s];
		if (t === "<") {
			let c = e.indexOf(">", s);
			if (c === -1) {
				o += t, s++;
				continue;
			}
			let l = e.indexOf("<", s + 1);
			if (l !== -1 && l < c) {
				o += t, s++;
				continue;
			}
			let u = e.slice(s + 1, c);
			if (u.startsWith("/")) {
				let t = u.slice(1).trim();
				if (a.length > 0 && a[a.length - 1] === t) {
					o.length > 0 && (n.push({
						text: o,
						style: i[i.length - 1]
					}), o = ""), i.pop(), a.pop(), s = c + 1;
					continue;
				}
				o += e.slice(s, c + 1), s = c + 1;
				continue;
			}
			{
				let t = u.trim();
				if (r[t]) {
					o.length > 0 && (n.push({
						text: o,
						style: i[i.length - 1]
					}), o = "");
					let e = i[i.length - 1], l = BC(e, r[t]);
					i.push(l), a.push(t), s = c + 1;
					continue;
				}
				o += e.slice(s, c + 1), s = c + 1;
				continue;
			}
		}
		o += t, s++;
	}
	return o.length > 0 && n.push({
		text: o,
		style: i[i.length - 1]
	}), n;
}
var HC = o((() => {}));
// node_modules/pixi.js/lib/scene/text/canvas/utils/textTokenization.mjs
function UC(e) {
	return typeof e == "string" && $C.has(e.charCodeAt(0));
}
function WC(e, t) {
	return typeof e == "string" && tw.has(e.charCodeAt(0));
}
function GC(e) {
	return typeof e == "string" && rw.has(e.charCodeAt(0));
}
function KC(e) {
	return typeof e == "string" && aw.has(e.charCodeAt(0));
}
function qC(e) {
	return e === "normal" || e === "pre-line";
}
function JC(e) {
	return e === "normal";
}
function YC(e) {
	if (typeof e != "string") return "";
	let t = e.length - 1;
	for (; t >= 0 && WC(e[t]);) t--;
	return t < e.length - 1 ? e.slice(0, t + 1) : e;
}
function XC(e) {
	let t = [], n = [];
	if (typeof e != "string") return t;
	for (let r = 0; r < e.length; r++) {
		let i = e[r], a = e[r + 1];
		WC(i, a) || UC(i) ? (n.length > 0 && (t.push(n.join("")), n.length = 0), i === "\r" && a === "\n" ? (t.push("\r\n"), r++) : t.push(i)) : (n.push(i), KC(i) && a && !WC(a) && !UC(a) && (t.push(n.join("")), n.length = 0));
	}
	return n.length > 0 && t.push(n.join("")), t;
}
function ZC(e, t, n, r) {
	let i = n(e), a = [];
	for (let n = 0; n < i.length; n++) {
		let o = i[n], s = o, c = 1;
		for (; i[n + c];) {
			let a = i[n + c];
			if (!r(s, a, e, n, t)) o += a, s = a, c++;
			else break;
		}
		n += c - 1, a.push(o);
	}
	return a;
}
var QC, $C, ew, tw, nw, rw, iw, aw, ow, sw, cw = o((() => {
	QC = [10, 13], $C = new Set(QC), ew = [
		9,
		32,
		8192,
		8193,
		8194,
		8195,
		8196,
		8197,
		8198,
		8200,
		8201,
		8202,
		8287,
		12288
	], tw = new Set(ew), nw = [9, 32], rw = new Set(nw), iw = [
		45,
		8208,
		8211,
		8212,
		173
	], aw = new Set(iw), ow = /(\r\n|\r|\n)/, sw = /(?:\r\n|\r|\n)/;
}));
// node_modules/pixi.js/lib/scene/text/canvas/utils/measureTaggedText.mjs
function lw(e, t, n, r, i, a, o, s, c) {
	let l = VC(e, t);
	if (JC(t.whiteSpace)) for (let e = 0; e < l.length; e++) {
		let t = l[e];
		l[e] = {
			text: t.text.replace(fw, " "),
			style: t.style
		};
	}
	let u = [], d = [];
	for (let e of l) {
		let t = e.text.split(ow);
		for (let n = 0; n < t.length; n++) {
			let r = t[n];
			r === "\r\n" || r === "\r" || r === "\n" ? (u.push(d), d = []) : r.length > 0 && d.push({
				text: r,
				style: e.style
			});
		}
	}
	(d.length > 0 || u.length === 0) && u.push(d);
	let f = n ? uw(u, t, r, a, s, c) : u, p = [], m = [], h = [], g = [], _ = [], v = 0, y = t._fontString, b = o(y);
	b.fontSize === 0 && (b.fontSize = t.fontSize, b.ascent = t.fontSize);
	let x = "", S = !!t.dropShadow, C = t._stroke?.width || 0;
	for (let e of f) {
		let n = 0, a = b.ascent, s = b.descent, c = "";
		for (let t of e) {
			let e = t.style._fontString, l = o(e);
			e !== x && (r.font = e, x = e);
			let u = i(t.text, t.style.letterSpacing, r);
			n += u, a = Math.max(a, l.ascent), s = Math.max(s, l.descent), c += t.text;
			let d = t.style._stroke?.width || 0;
			d > C && (C = d), !S && t.style.dropShadow && (S = !0);
		}
		e.length === 0 && (a = b.ascent, s = b.descent), p.push(n), m.push(a), h.push(s), _.push(c);
		let l = t.lineHeight || a + s;
		g.push(l + t.leading), v = Math.max(v, n);
	}
	let w = C, ee = v + w + (t.dropShadow ? t.dropShadow.distance : 0), T = 0;
	for (let e = 0; e < g.length; e++) T += g[e];
	return T = Math.max(T, g[0] + w), {
		width: ee,
		height: T + (t.dropShadow ? t.dropShadow.distance : 0),
		lines: _,
		lineWidths: p,
		lineHeight: (t.lineHeight || b.fontSize) + t.leading,
		maxLineWidth: v,
		fontProperties: b,
		runsByLine: f,
		lineAscents: m,
		lineDescents: h,
		lineHeights: g,
		hasDropShadow: S
	};
}
function uw(e, t, n, r, i, a) {
	let { letterSpacing: o, whiteSpace: s, wordWrapWidth: c, breakWords: l } = t, u = qC(s), d = c + o, f = {}, p = "", m = (e, t) => {
		let i = `${e}|${t.styleKey}`, a = f[i];
		if (a === void 0) {
			let o = t._fontString;
			o !== p && (n.font = o, p = o), a = r(e, t.letterSpacing, n) + t.letterSpacing, f[i] = a;
		}
		return a;
	}, h = [];
	for (let t of e) {
		let e = dw(t), n = h.length, r = (t) => {
			let n = 0, r = t;
			do {
				let { token: t, style: i } = e[r];
				n += m(t, i), r++;
			} while (r < e.length && e[r].continuesFromPrevious);
			return n;
		}, o = (t) => {
			let n = [], r = t;
			do
				n.push({
					token: e[r].token,
					style: e[r].style
				}), r++;
			while (r < e.length && e[r].continuesFromPrevious);
			return n;
		}, s = [], c = 0, f = !u, p = null, g = () => {
			p && p.text.length > 0 && s.push(p), p = null;
		}, _ = () => {
			if (g(), s.length > 0) {
				let e = s[s.length - 1];
				e.text = YC(e.text), e.text.length === 0 && s.pop();
			}
			h.push(s), s = [], c = 0, f = !1;
		};
		for (let t = 0; t < e.length; t++) {
			let { token: n, style: v, continuesFromPrevious: y } = e[t], b = m(n, v);
			if (u) {
				let e = WC(n), t = p?.text[p.text.length - 1] ?? s[s.length - 1]?.text.slice(-1) ?? "", r = t ? WC(t) : !1;
				if (e && r) continue;
			}
			let x = !y, S = x ? r(t) : b;
			if (S > d && x) {
				if (c > 0 && _(), l) {
					let e = o(t);
					for (let t = 0; t < e.length; t++) {
						let n = e[t].token, r = e[t].style, o = ZC(n, l, a, i);
						for (let e of o) {
							let t = m(e, r);
							t + c > d && _(), !p || p.style !== r ? (g(), p = {
								text: e,
								style: r
							}) : p.text += e, c += t;
						}
					}
					t += e.length - 1;
				} else {
					let e = o(t);
					g(), h.push(e.map((e) => ({
						text: e.token,
						style: e.style
					}))), f = !1, t += e.length - 1;
				}
			} else if (S + c > d && x) {
				if (WC(n)) {
					f = !1;
					continue;
				}
				_(), p = {
					text: n,
					style: v
				}, c = b;
			} else if (y && !l) !p || p.style !== v ? (g(), p = {
				text: n,
				style: v
			}) : p.text += n, c += b;
			else {
				let e = WC(n);
				if (c === 0 && e && !f) continue;
				!p || p.style !== v ? (g(), p = {
					text: n,
					style: v
				}) : p.text += n, c += b;
			}
		}
		if (g(), s.length > 0) {
			let e = s[s.length - 1];
			e.text = YC(e.text), e.text.length === 0 && s.pop();
		}
		(s.length > 0 || h.length === n) && h.push(s);
	}
	return h;
}
function dw(e) {
	let t = [], n = !1;
	for (let r of e) {
		let e = XC(r.text), i = !0;
		for (let a of e) {
			let e = WC(a) || UC(a), o = i && n && !e;
			t.push({
				token: a,
				style: r.style,
				continuesFromPrevious: o
			}), n = !e, i = !1;
		}
	}
	return t;
}
var fw, pw = o((() => {
	HC(), cw(), fw = /\r\n|\r|\n/g;
}));
// node_modules/pixi.js/lib/scene/text/canvas/utils/wordWrap.mjs
function mw(e, t, n, r, i) {
	let a = n[e];
	return typeof a != "number" && (a = i(e, t, r) + t, n[e] = a), a;
}
function hw(e, t, n, r, i, a, o) {
	let s = n.getContext("2d", gw);
	s.font = t._fontString;
	let c = 0, l = "", u = [], d = /* @__PURE__ */ Object.create(null), { letterSpacing: f, whiteSpace: p } = t, m = qC(p), h = JC(p), g = !m, _ = t.wordWrapWidth + f, v = XC(e);
	for (let e = 0; e < v.length; e++) {
		let n = v[e];
		if (UC(n)) {
			if (!h) {
				u.push(YC(l)), g = !m, l = "", c = 0;
				continue;
			}
			n = " ";
		}
		if (m) {
			let e = WC(n), t = WC(l[l.length - 1]);
			if (e && t) continue;
		}
		let p = mw(n, f, d, s, r);
		if (p > _) {
			if (l !== "" && (u.push(YC(l)), l = "", c = 0), i(n, t.breakWords)) {
				let e = ZC(n, t.breakWords, o, a);
				for (let t of e) {
					let e = mw(t, f, d, s, r);
					e + c > _ && (u.push(YC(l)), g = !1, l = "", c = 0), l += t, c += e;
				}
			} else l.length > 0 && (u.push(YC(l)), l = "", c = 0), u.push(YC(n)), g = !1, l = "", c = 0;
		} else p + c > _ && (g = !1, u.push(YC(l)), l = "", c = 0), (l.length > 0 || !WC(n) || g) && (l += n, c += p);
	}
	let y = YC(l);
	return y.length > 0 && u.push(y), u.join("\n");
}
var gw, _w = o((() => {
	cw(), gw = { willReadFrequently: !0 };
})), vw, yw, bw, xw = o((() => {
	LC(), W(), pw(), HC(), cw(), _w(), vw = { willReadFrequently: !0 }, yw = class e {
		static get experimentalLetterSpacingSupported() {
			let t = e._experimentalLetterSpacingSupported;
			if (t === void 0) {
				let n = U.get().getCanvasRenderingContext2D().prototype;
				t = e._experimentalLetterSpacingSupported = "letterSpacing" in n || "textLetterSpacing" in n;
			}
			return t;
		}
		constructor(e, t, n, r, i, a, o, s, c, l) {
			this.text = e, this.style = t, this.width = n, this.height = r, this.lines = i, this.lineWidths = a, this.lineHeight = o, this.maxLineWidth = s, this.fontProperties = c, l && (this.runsByLine = l.runsByLine, this.lineAscents = l.lineAscents, this.lineDescents = l.lineDescents, this.lineHeights = l.lineHeights, this.hasDropShadow = l.hasDropShadow);
		}
		static measureText(t = " ", n, r = e._canvas, i = n.wordWrap) {
			let a = `${t}-${n.styleKey}-wordWrap-${i}`;
			if (e._measurementCache.has(a)) return e._measurementCache.get(a);
			if (RC(n) && zC(t)) {
				let r = lw(t, n, i, e._context, e._measureText, e._measureTextAdvance, e.measureFont, e.canBreakChars, e.wordWrapSplit), o = new e(t, n, r.width, r.height, r.lines, r.lineWidths, r.lineHeight, r.maxLineWidth, r.fontProperties, {
					runsByLine: r.runsByLine,
					lineAscents: r.lineAscents,
					lineDescents: r.lineDescents,
					lineHeights: r.lineHeights,
					hasDropShadow: r.hasDropShadow
				});
				return e._measurementCache.set(a, o), o;
			}
			let o = n._fontString, s = e.measureFont(o);
			s.fontSize === 0 && (s.fontSize = n.fontSize, s.ascent = n.fontSize, s.descent = 0);
			let c = e._context;
			c.font = o;
			let l = (i ? e._wordWrap(t, n, r) : t).split(sw), u = Array(l.length), d = 0;
			for (let t = 0; t < l.length; t++) {
				let r = e._measureText(l[t], n.letterSpacing, c);
				u[t] = r, d = Math.max(d, r);
			}
			let f = n._stroke?.width ?? 0, p = n.lineHeight || s.fontSize, m = e._adjustWidthForStyle(d, n), h = Math.max(p, s.fontSize + f) + (l.length - 1) * (p + n.leading), g = e._adjustHeightForStyle(h, n), _ = new e(t, n, m, g, l, u, p + n.leading, d, s);
			return e._measurementCache.set(a, _), _;
		}
		static _adjustWidthForStyle(e, t) {
			let n = e + (t._stroke?.width || 0);
			return t.dropShadow && (n += t.dropShadow.distance), n;
		}
		static _adjustHeightForStyle(e, t) {
			let n = e;
			return t.dropShadow && (n += t.dropShadow.distance), n;
		}
		static _measureText(t, n, r) {
			let { metricWidth: i, metrics: a, letterSpacingVal: o } = e._measureTextCore(t, n, r), s = -(a.actualBoundingBoxLeft ?? 0), c = (a.actualBoundingBoxRight ?? 0) - s;
			return a.width > 0 && (c += o), Math.max(i, c);
		}
		static _measureTextAdvance(t, n, r) {
			return e._measureTextCore(t, n, r).metricWidth;
		}
		static _measureTextCore(t, n, r) {
			let i = !1;
			e.experimentalLetterSpacingSupported && (e.experimentalLetterSpacing ? (r.letterSpacing = `${n}px`, r.textLetterSpacing = `${n}px`, i = !0) : (r.letterSpacing = "0px", r.textLetterSpacing = "0px"));
			let a = r.measureText(t), o = a.width, s = 0;
			return o > 0 && (s = i ? -n : (e.graphemeSegmenter(t).length - 1) * n, o += s), {
				metricWidth: o,
				metrics: a,
				letterSpacingVal: s
			};
		}
		static _wordWrap(t, n, r = e._canvas) {
			return hw(t, n, r, e._measureTextAdvance, e.canBreakWords, e.canBreakChars, e.wordWrapSplit);
		}
		static isBreakingSpace(e, t) {
			return WC(e, t);
		}
		static canBreakWords(e, t) {
			return t;
		}
		static canBreakChars(e, t, n, r, i) {
			return !0;
		}
		static wordWrapSplit(t) {
			return e.graphemeSegmenter(t);
		}
		static measureFont(t) {
			if (e._fonts[t]) return e._fonts[t];
			let n = e._context;
			n.font = t;
			let r = n.measureText(e.METRICS_STRING + e.BASELINE_SYMBOL), i = r.actualBoundingBoxAscent ?? 0, a = r.actualBoundingBoxDescent ?? 0, o = {
				ascent: i,
				descent: a,
				fontSize: i + a
			};
			return e._fonts[t] = o, o;
		}
		static clearMetrics(t = "") {
			t ? delete e._fonts[t] : e._fonts = {};
		}
		static get _canvas() {
			if (!e.__canvas) {
				let t;
				try {
					let n = new OffscreenCanvas(0, 0);
					if (n.getContext("2d", vw)?.measureText) return e.__canvas = n, n;
					t = U.get().createCanvas();
				} catch {
					t = U.get().createCanvas();
				}
				t.width = t.height = 10, e.__canvas = t;
			}
			return e.__canvas;
		}
		static get _context() {
			return e.__context ||= e._canvas.getContext("2d", vw), e.__context;
		}
	}, yw.METRICS_STRING = "|ÉqÅ", yw.BASELINE_SYMBOL = "M", yw.BASELINE_MULTIPLIER = 1.4, yw.HEIGHT_MULTIPLIER = 2, yw.graphemeSegmenter = (() => {
		if (typeof Intl?.Segmenter == "function") {
			let e = new Intl.Segmenter();
			return (t) => {
				let n = e.segment(t), r = [], i = 0;
				for (let e of n) r[i++] = e.segment;
				return r;
			};
		}
		return (e) => [...e];
	})(), yw.experimentalLetterSpacing = !1, yw._fonts = {}, yw._measurementCache = FC(1e3), bw = yw;
}));
// node_modules/pixi.js/lib/scene/text/canvas/utils/fontStringFromTextStyle.mjs
function Sw(e) {
	let t = typeof e.fontSize == "number" ? `${e.fontSize}px` : e.fontSize, n = e.fontFamily;
	Array.isArray(e.fontFamily) || (n = e.fontFamily.split(","));
	for (let e = n.length - 1; e >= 0; e--) {
		let t = n[e].trim();
		!/([\"\'])[^\'\"]+\1/.test(t) && !Cw.includes(t) && (t = `"${t}"`), n[e] = t;
	}
	return `${e.fontStyle} ${e.fontVariant} ${e.fontWeight} ${t} ${n.join(",")}`;
}
var Cw, ww = o((() => {
	Cw = [
		"serif",
		"sans-serif",
		"monospace",
		"cursive",
		"fantasy",
		"system-ui"
	];
}));
// node_modules/pixi.js/lib/scene/text/TextStyle.mjs
function Tw(e) {
	let t = e;
	if (typeof t.dropShadow == "boolean" && t.dropShadow) {
		let n = Dw.defaultDropShadow;
		e.dropShadow = {
			alpha: t.dropShadowAlpha ?? n.alpha,
			angle: t.dropShadowAngle ?? n.angle,
			blur: t.dropShadowBlur ?? n.blur,
			color: t.dropShadowColor ?? n.color,
			distance: t.dropShadowDistance ?? n.distance
		};
	}
	if (t.strokeThickness !== void 0) {
		F(P, "strokeThickness is now a part of stroke");
		let n = t.stroke, r = {};
		if (A.isColorLike(n)) r.color = n;
		else if (n instanceof Ly || n instanceof Vy) r.fill = n;
		else if (Object.hasOwnProperty.call(n, "color") || Object.hasOwnProperty.call(n, "fill")) r = n;
		else throw Error("Invalid stroke value.");
		e.stroke = {
			...r,
			width: t.strokeThickness
		};
	}
	if (Array.isArray(t.fillGradientStops)) {
		if (F(P, "gradient fill is now a fill pattern: `new FillGradient(...)`"), !Array.isArray(t.fill) || t.fill.length === 0) throw Error("Invalid fill value. Expected an array of colors for gradient fill.");
		t.fill.length !== t.fillGradientStops.length && I("The number of fill colors must match the number of fill gradient stops.");
		let n = new Ly({
			start: {
				x: 0,
				y: 0
			},
			end: {
				x: 0,
				y: 1
			},
			textureSpace: "local"
		}), r = t.fillGradientStops.slice(), i = t.fill.map((e) => A.shared.setValue(e).toNumber());
		r.forEach((e, t) => {
			n.addColorStop(e, i[t]);
		}), e.fill = { fill: n };
	}
}
var Ew, Dw, Ow = o((() => {
	y(), ke(), We(), Xe(), L(), Ry(), Hy(), MS(), TS(), ww(), Ew = class e extends v {
		constructor(t = {}) {
			super(), this.uid = N("textStyle"), this._tick = 0, this._cachedFontString = null, Tw(t), t instanceof e && (t = t._toObject());
			let n = {
				...e.defaultTextStyle,
				...t
			};
			for (let e in n) {
				let t = e;
				this[t] = n[e];
			}
			this._tagStyles = t.tagStyles ?? void 0, this.update(), this._tick = 0;
		}
		get align() {
			return this._align;
		}
		set align(e) {
			this._align !== e && (this._align = e, this.update());
		}
		get breakWords() {
			return this._breakWords;
		}
		set breakWords(e) {
			this._breakWords !== e && (this._breakWords = e, this.update());
		}
		get dropShadow() {
			return this._dropShadow;
		}
		set dropShadow(t) {
			this._dropShadow !== t && (this._dropShadow = typeof t == "object" && t ? this._createProxy({
				...e.defaultDropShadow,
				...t
			}) : t ? this._createProxy({ ...e.defaultDropShadow }) : null, this.update());
		}
		get fontFamily() {
			return this._fontFamily;
		}
		set fontFamily(e) {
			this._fontFamily !== e && (this._fontFamily = e, this.update());
		}
		get fontSize() {
			return this._fontSize;
		}
		set fontSize(e) {
			this._fontSize !== e && (this._fontSize = typeof e == "string" ? parseInt(e, 10) : e, this.update());
		}
		get fontStyle() {
			return this._fontStyle;
		}
		set fontStyle(e) {
			this._fontStyle !== e && (this._fontStyle = e.toLowerCase(), this.update());
		}
		get fontVariant() {
			return this._fontVariant;
		}
		set fontVariant(e) {
			this._fontVariant !== e && (this._fontVariant = e, this.update());
		}
		get fontWeight() {
			return this._fontWeight;
		}
		set fontWeight(e) {
			this._fontWeight !== e && (this._fontWeight = e, this.update());
		}
		get leading() {
			return this._leading;
		}
		set leading(e) {
			this._leading !== e && (this._leading = e, this.update());
		}
		get letterSpacing() {
			return this._letterSpacing;
		}
		set letterSpacing(e) {
			this._letterSpacing !== e && (this._letterSpacing = e, this.update());
		}
		get lineHeight() {
			return this._lineHeight;
		}
		set lineHeight(e) {
			this._lineHeight !== e && (this._lineHeight = e, this.update());
		}
		get padding() {
			return this._padding;
		}
		set padding(e) {
			this._padding !== e && (this._padding = e, this.update());
		}
		get filters() {
			return this._filters;
		}
		set filters(e) {
			this._filters !== e && (this._filters = Object.freeze(e), this.update());
		}
		get trim() {
			return this._trim;
		}
		set trim(e) {
			this._trim !== e && (this._trim = e, this.update());
		}
		get textBaseline() {
			return this._textBaseline;
		}
		set textBaseline(e) {
			this._textBaseline !== e && (this._textBaseline = e, this.update());
		}
		get whiteSpace() {
			return this._whiteSpace;
		}
		set whiteSpace(e) {
			this._whiteSpace !== e && (this._whiteSpace = e, this.update());
		}
		get wordWrap() {
			return this._wordWrap;
		}
		set wordWrap(e) {
			this._wordWrap !== e && (this._wordWrap = e, this.update());
		}
		get wordWrapWidth() {
			return this._wordWrapWidth;
		}
		set wordWrapWidth(e) {
			this._wordWrapWidth !== e && (this._wordWrapWidth = e, this.update());
		}
		get fill() {
			return this._originalFill;
		}
		set fill(e) {
			e !== this._originalFill && (this._originalFill = e, this._isFillStyle(e) && (this._originalFill = this._createProxy({
				...jS.defaultFillStyle,
				...e
			}, () => {
				this._fill = CS({ ...this._originalFill }, jS.defaultFillStyle);
			})), this._fill = CS(e === 0 ? "black" : e, jS.defaultFillStyle), this.update());
		}
		get stroke() {
			return this._originalStroke;
		}
		set stroke(e) {
			e !== this._originalStroke && (this._originalStroke = e, this._isFillStyle(e) && (this._originalStroke = this._createProxy({
				...jS.defaultStrokeStyle,
				...e
			}, () => {
				this._stroke = wS({ ...this._originalStroke }, jS.defaultStrokeStyle);
			})), this._stroke = wS(e, jS.defaultStrokeStyle), this.update());
		}
		get tagStyles() {
			return this._tagStyles;
		}
		set tagStyles(e) {
			this._tagStyles !== e && (this._tagStyles = e ?? void 0, this.update());
		}
		update() {
			this._tick++, this._cachedFontString = null, this.emit("update", this);
		}
		reset() {
			let t = e.defaultTextStyle;
			for (let e in t) this[e] = t[e];
		}
		assign(e) {
			for (let t in e) {
				let n = t;
				this[n] = e[t];
			}
			return this;
		}
		get styleKey() {
			return `${this.uid}-${this._tick}`;
		}
		get _fontString() {
			return this._cachedFontString === null && (this._cachedFontString = Sw(this)), this._cachedFontString;
		}
		_toObject() {
			return {
				align: this.align,
				breakWords: this.breakWords,
				dropShadow: this._dropShadow ? { ...this._dropShadow } : null,
				fill: this._fill ? { ...this._fill } : void 0,
				fontFamily: this.fontFamily,
				fontSize: this.fontSize,
				fontStyle: this.fontStyle,
				fontVariant: this.fontVariant,
				fontWeight: this.fontWeight,
				leading: this.leading,
				letterSpacing: this.letterSpacing,
				lineHeight: this.lineHeight,
				padding: this.padding,
				stroke: this._stroke ? { ...this._stroke } : void 0,
				textBaseline: this.textBaseline,
				trim: this.trim,
				whiteSpace: this.whiteSpace,
				wordWrap: this.wordWrap,
				wordWrapWidth: this.wordWrapWidth,
				filters: this._filters ? [...this._filters] : void 0,
				tagStyles: this._tagStyles ? { ...this._tagStyles } : void 0
			};
		}
		clone() {
			return new e(this._toObject());
		}
		_getFinalPadding() {
			let e = 0;
			if (this._filters) for (let t = 0; t < this._filters.length; t++) e += this._filters[t].padding;
			return Math.max(this._padding, e);
		}
		destroy(e = !1) {
			if (this.removeAllListeners(), typeof e == "boolean" ? e : e?.texture) {
				let t = typeof e == "boolean" ? e : e?.textureSource;
				this._fill?.texture && this._fill.texture.destroy(t), this._originalFill?.texture && this._originalFill.texture.destroy(t), this._stroke?.texture && this._stroke.texture.destroy(t), this._originalStroke?.texture && this._originalStroke.texture.destroy(t);
			}
			this._fill = null, this._stroke = null, this.dropShadow = null, this._originalStroke = null, this._originalFill = null;
		}
		_createProxy(e, t) {
			return new Proxy(e, { set: (e, n, r) => (e[n] === r || (e[n] = r, t?.(n, r), this.update()), !0) });
		}
		_isFillStyle(e) {
			return (e ?? null) !== null && !(A.isColorLike(e) || e instanceof Ly || e instanceof Vy);
		}
	}, Ew.defaultDropShadow = {
		alpha: 1,
		angle: Math.PI / 6,
		blur: 0,
		color: "black",
		distance: 5
	}, Ew.defaultTextStyle = {
		align: "left",
		breakWords: !1,
		dropShadow: null,
		fill: "black",
		fontFamily: "Arial",
		fontSize: 26,
		fontStyle: "normal",
		fontVariant: "normal",
		fontWeight: "normal",
		leading: 0,
		letterSpacing: 0,
		lineHeight: 0,
		padding: 0,
		stroke: null,
		textBaseline: "alphabetic",
		trim: !1,
		whiteSpace: "pre",
		wordWrap: !1,
		wordWrapWidth: 100
	}, Dw = Ew;
}));
// node_modules/pixi.js/lib/scene/text/canvas/utils/getCanvasFillStyle.mjs
function kw(e, t, n, r = 0, i = 0, a = 0) {
	if (e.texture === B.WHITE && !e.fill) return A.shared.setValue(e.color).setAlpha(e.alpha ?? 1).toHexa();
	if (!e.fill) {
		let n = t.createPattern(e.texture.source.resource, "repeat"), r = e.matrix.copyTo(j.shared);
		return r.scale(e.texture.source.pixelWidth, e.texture.source.pixelHeight), n.setTransform(r), n;
	}
	if (e.fill instanceof Vy) {
		let n = e.fill, r = t.createPattern(n.texture.source.resource, "repeat");
		return G.applyPatternTransform(r, n.transform, !1), r;
	}
	if (e.fill instanceof Ly) {
		let o = e.fill, s = o.type === "linear", c = o.textureSpace === "local", l = 1, u = 1;
		c && n && (l = n.width + r, u = n.height + r);
		let d, f = !1;
		if (s) {
			let { start: e, end: n } = o;
			d = t.createLinearGradient(e.x * l + i, e.y * u + a, n.x * l + i, n.y * u + a), f = Math.abs(n.x - e.x) < Math.abs((n.y - e.y) * .1);
		} else {
			let { center: e, innerRadius: n, outerCenter: r, outerRadius: s } = o;
			d = t.createRadialGradient(e.x * l + i, e.y * u + a, n * l, r.x * l + i, r.y * u + a, s * l);
		}
		if (f && c && n) {
			let e = n.lineHeight / u;
			for (let t = 0; t < n.lines.length; t++) {
				let i = (t * n.lineHeight + r / 2) / u;
				o.colorStops.forEach((t) => {
					let n = i + t.offset * e;
					n = Math.max(0, Math.min(1, n)), d.addColorStop(Math.floor(n * Aw) / Aw, A.shared.setValue(t.color).toHex());
				});
			}
		} else o.colorStops.forEach((e) => {
			d.addColorStop(e.offset, A.shared.setValue(e.color).toHex());
		});
		return d;
	}
	return I("FillStyle not recognised", e), "red";
}
var Aw, jw = o((() => {
	ke(), M(), Qa(), V(), L(), Ry(), Hy(), Aw = 1e5;
})), Mw, Nw, Pw = o((() => {
	ke(), wt(), ro(), Ma(), V(), yn(), Xe(), xw(), ww(), jw(), Ow(), PC(), Mw = class e extends NC {
		constructor(t) {
			super(), this.resolution = 1, this.pages = [], this._padding = 0, this._measureCache = /* @__PURE__ */ Object.create(null), this._currentChars = [], this._currentX = 0, this._currentY = 0, this._currentMaxCharHeight = 0, this._currentPageIndex = -1, this._skipKerning = !1;
			let n = {
				...e.defaultOptions,
				...t
			};
			this._textureSize = n.textureSize, this._mipmap = n.mipmap;
			let r = n.style.clone();
			n.overrideFill && (r._fill.color = 16777215, r._fill.alpha = 1, r._fill.texture = B.WHITE, r._fill.fill = null), this.applyFillAsTint = n.overrideFill;
			let i = r.fontSize;
			r.fontSize = this.baseMeasurementFontSize;
			let a = Sw(r);
			n.overrideSize ? (r._stroke && (r._stroke.width *= this.baseRenderedFontSize / i), r.dropShadow && (r.dropShadow.blur *= this.baseRenderedFontSize / i, r.dropShadow.distance *= this.baseRenderedFontSize / i)) : r.fontSize = this.baseRenderedFontSize = i, this._style = r, this._skipKerning = n.skipKerning ?? !1, this.resolution = n.resolution ?? 1, this._padding = n.padding ?? 4, n.textureStyle && (this._textureStyle = n.textureStyle instanceof vn ? n.textureStyle : new vn(n.textureStyle)), this.fontMetrics = bw.measureFont(a), this.lineHeight = r.lineHeight || this.fontMetrics.fontSize || r.fontSize;
		}
		ensureCharacters(e) {
			let t = bw.graphemeSegmenter(e).filter((e) => !this._currentChars.includes(e)).filter((e, t, n) => n.indexOf(e) === t);
			if (!t.length) return;
			this._currentChars = [...this._currentChars, ...t];
			let n;
			n = this._currentPageIndex === -1 ? this._nextPage() : this.pages[this._currentPageIndex];
			let { canvas: r, context: i } = n.canvasAndContext, a = n.texture.source, o = this._style, s = this._currentX, c = this._currentY, l = this._currentMaxCharHeight, u = this.baseRenderedFontSize / this.baseMeasurementFontSize, d = (o.dropShadow?.distance ?? 0) + (o._stroke?.width ?? 0), f = this._padding + d, p = !1, m = r.width / this.resolution, h = r.height / this.resolution;
			for (let e = 0; e < t.length; e++) {
				let n = t[e], d = bw.measureText(n, o, r, !1);
				d.lineHeight = d.height;
				let g = d.width * u, _ = Math.ceil((o.fontStyle === "italic" ? 2 : 1) * g), v = d.height * u, y = _ + f * 2, b = v + f * 2;
				if (p = !1, n !== "\n" && n !== "\r" && n !== "	" && n !== " " && (p = !0, l = Math.ceil(Math.max(b, l))), s + y > m && (c += l, l = b, s = 0, c + l > h)) {
					a.update();
					let e = this._nextPage();
					r = e.canvasAndContext.canvas, i = e.canvasAndContext.context, a = e.texture.source, s = 0, c = 0, l = 0;
				}
				let x = i.measureText(n).width / u;
				if (this.chars[n] = {
					id: n.codePointAt(0),
					xOffset: -(f / u),
					yOffset: -(f / u),
					xAdvance: x,
					kerning: {}
				}, p) {
					this._drawGlyph(i, d, s + f, c + f, u, o);
					let e = a.width * u, t = a.height * u, r = new R(s / e * a.width, c / t * a.height, y / e * a.width, b / t * a.height);
					this.chars[n].texture = new B({
						source: a,
						frame: r
					}), s += Math.ceil(y);
				}
			}
			a.update(), this._currentX = s, this._currentY = c, this._currentMaxCharHeight = l, this._skipKerning || this._applyKerning(t, i, u);
		}
		get pageTextures() {
			return F(P, "BitmapFont.pageTextures is deprecated, please use BitmapFont.pages instead."), this.pages;
		}
		_applyKerning(e, t, n) {
			let r = this._measureCache;
			for (let i = 0; i < e.length; i++) {
				let a = e[i];
				for (let e = 0; e < this._currentChars.length; e++) {
					let i = this._currentChars[e], o = r[a];
					o ||= r[a] = t.measureText(a).width;
					let s = r[i];
					s ||= r[i] = t.measureText(i).width;
					let c = t.measureText(a + i).width, l = c - (o + s);
					l && this.chars[a] && (this.chars[a].kerning[i] = l / n), c = t.measureText(a + i).width, l = c - (o + s), l && this.chars[i] && (this.chars[i].kerning[a] = l / n);
				}
			}
		}
		_nextPage() {
			this._currentPageIndex++;
			let e = this.resolution, t = no.getOptimalCanvasAndContext(this._textureSize, this._textureSize, e);
			this._setupContext(t.context, this._style, e);
			let n = e * (this.baseRenderedFontSize / this.baseMeasurementFontSize), r = new B({ source: new ja({
				resource: t.canvas,
				resolution: n,
				alphaMode: "premultiply-alpha-on-upload",
				autoGenerateMipmaps: this._mipmap
			}) });
			this._textureStyle && (r.source.style = this._textureStyle);
			let i = {
				canvasAndContext: t,
				texture: r
			};
			return this.pages[this._currentPageIndex] = i, i;
		}
		_setupContext(e, t, n) {
			t.fontSize = this.baseRenderedFontSize, e.scale(n, n), e.font = Sw(t), t.fontSize = this.baseMeasurementFontSize, e.textBaseline = t.textBaseline;
			let r = t._stroke, i = r?.width ?? 0;
			if (r && (e.lineWidth = i, e.lineJoin = r.join, e.miterLimit = r.miterLimit, e.strokeStyle = kw(r, e)), t._fill && (e.fillStyle = kw(t._fill, e)), t.dropShadow) {
				let r = t.dropShadow, i = A.shared.setValue(r.color).toArray(), a = r.blur * n, o = r.distance * n;
				e.shadowColor = `rgba(${i[0] * 255},${i[1] * 255},${i[2] * 255},${r.alpha})`, e.shadowBlur = a, e.shadowOffsetX = Math.cos(r.angle) * o, e.shadowOffsetY = Math.sin(r.angle) * o;
			} else e.shadowColor = "black", e.shadowBlur = 0, e.shadowOffsetX = 0, e.shadowOffsetY = 0;
		}
		_drawGlyph(e, t, n, r, i, a) {
			let o = t.text, s = t.fontProperties, c = (a._stroke?.width ?? 0) * i, l = n + c / 2, u = r - c / 2, d = s.descent * i, f = t.lineHeight * i, p = !1;
			a.stroke && c && (p = !0, e.strokeText(o, l, u + f - d));
			let { shadowBlur: m, shadowOffsetX: h, shadowOffsetY: g } = e;
			a._fill && (p && (e.shadowBlur = 0, e.shadowOffsetX = 0, e.shadowOffsetY = 0), e.fillText(o, l, u + f - d)), p && (e.shadowBlur = m, e.shadowOffsetX = h, e.shadowOffsetY = g);
		}
		destroy() {
			super.destroy();
			for (let e = 0; e < this.pages.length; e++) {
				let { canvasAndContext: t, texture: n } = this.pages[e];
				no.returnCanvasAndContext(t), n.destroy(!0);
			}
			this.pages = null;
		}
	}, Mw.defaultOptions = {
		textureSize: 512,
		style: new Dw(),
		mipmap: !0
	}, Nw = Mw;
}));
// node_modules/pixi.js/lib/scene/text-bitmap/utils/getBitmapTextLayout.mjs
function Fw(e, t, n, r) {
	let i = {
		width: 0,
		height: 0,
		offsetY: 0,
		scale: t.fontSize / n.baseMeasurementFontSize,
		lines: [{
			width: 0,
			charPositions: [],
			spaceWidth: 0,
			spacesIndex: [],
			chars: []
		}]
	};
	i.offsetY = n.baseLineOffset;
	let a = i.lines[0], o = null, s = !0, c = {
		spaceWord: !1,
		width: 0,
		start: 0,
		index: 0,
		positions: [],
		chars: []
	}, l = n.baseMeasurementFontSize / t.fontSize, u = t.letterSpacing * l, d = t.wordWrapWidth * l, f = t.lineHeight ? t.lineHeight * l : n.lineHeight, p = t.wordWrap && t.breakWords, m = qC(t.whiteSpace), h = JC(t.whiteSpace);
	if (m || h) {
		let t = [], n = m;
		for (let r = 0; r < e.length; r++) {
			let i = e[r];
			if (i === "\r" || i === "\n") {
				if (h) i === "\r" && e[r + 1] === "\n" && r++, i = " ";
				else {
					m && (n = !0), t.push(i);
					continue;
				}
			}
			if (WC(i)) {
				if (m && GC(i)) {
					if (n) continue;
					n = !0, t.push(" ");
				} else n = !1, t.push(i);
			} else n = !1, t.push(i);
		}
		e = t;
	}
	let g = (e) => {
		let t = a.width;
		for (let n = 0; n < c.index; n++) {
			let r = e.positions[n];
			a.chars.push(e.chars[n]), a.charPositions.push(r + t);
		}
		a.width += e.width, (c.index > 0 || !m) && (s = !1), c.width = 0, c.index = 0, c.chars.length = 0;
	}, _ = () => {
		let e = a.chars.length - 1;
		if (r) {
			let t = a.chars[e];
			for (; GC(t);) a.width -= n.chars[t].xAdvance, a.spacesIndex.pop(), t = a.chars[--e];
		}
		i.width = Math.max(i.width, a.width), a = {
			width: 0,
			charPositions: [],
			chars: [],
			spaceWidth: 0,
			spacesIndex: []
		}, s = !0, i.lines.push(a), i.height += f;
	}, v = (e) => e - u > d;
	for (let r = 0; r < e.length + 1; r++) {
		let i, l = r === e.length;
		l || (i = e[r]);
		let d = n.chars[i];
		if (/(?:\s)/.test(i) || i === "\r" || i === "\n" || l) {
			if (!s && t.wordWrap && v(a.width + c.width) ? (_(), g(c), !l && d && a.charPositions.push(0)) : (c.start = a.width, g(c), !l && d && a.charPositions.push(0)), i === "\r" || i === "\n") _();
			else if (!l && d) {
				let e = d.xAdvance + (d.kerning?.[o] || 0) + u;
				a.width += e, a.spaceWidth = e, a.spacesIndex.push(a.charPositions.length), a.chars.push(i);
			}
		} else if (d) {
			let e = d.kerning?.[o] || 0, n = d.xAdvance + e + u;
			p && v(c.width + n) && (s || _(), g(c), _()), c.positions[c.index++] = c.width + e, c.chars.push(i), c.width += n, KC(i) && (!s && t.wordWrap && v(a.width + c.width) && _(), g(c));
		}
		o = i;
	}
	return _(), t.align === "center" ? Iw(i) : t.align === "right" ? Lw(i) : t.align === "justify" && Rw(i), i;
}
function Iw(e) {
	for (let t = 0; t < e.lines.length; t++) {
		let n = e.lines[t], r = e.width / 2 - n.width / 2;
		for (let e = 0; e < n.charPositions.length; e++) n.charPositions[e] += r;
	}
}
function Lw(e) {
	for (let t = 0; t < e.lines.length; t++) {
		let n = e.lines[t], r = e.width - n.width;
		for (let e = 0; e < n.charPositions.length; e++) n.charPositions[e] += r;
	}
}
function Rw(e) {
	let t = e.width;
	for (let n = 0; n < e.lines.length - 2; n++) {
		let r = e.lines[n], i = 0, a = r.spacesIndex[i++], o = 0, s = r.spacesIndex.length, c = (t - r.width) / s;
		for (let e = 0; e < r.charPositions.length; e++) e === a && (a = r.spacesIndex[i++], o += c), r.charPositions[e] += o;
	}
}
var zw = o((() => {
	cw();
}));
// node_modules/pixi.js/lib/scene/text-bitmap/utils/resolveCharacters.mjs
function Bw(e) {
	if (e === "") return [];
	typeof e == "string" && (e = [e]);
	let t = [];
	for (let n = 0, r = e.length; n < r; n++) {
		let r = e[n];
		if (Array.isArray(r)) {
			if (r.length !== 2) throw Error(`[BitmapFont]: Invalid character range length, expecting 2 got ${r.length}.`);
			if (r[0].length === 0 || r[1].length === 0) throw Error("[BitmapFont]: Invalid character delimiter.");
			let e = r[0].charCodeAt(0), n = r[1].charCodeAt(0);
			if (n < e) throw Error("[BitmapFont]: Invalid character range.");
			for (let r = e, i = n; r <= i; r++) t.push(String.fromCharCode(r));
		} else t.push(...Array.from(r));
	}
	if (t.length === 0) throw Error("[BitmapFont]: Empty set when resolving characters.");
	return t;
}
var Vw = o((() => {})), Hw, Uw, Ww, Gw = o((() => {
	LC(), Va(), Xe(), L(), xw(), Ow(), Pw(), zw(), Vw(), Hw = 0, Uw = class {
		constructor() {
			this.ALPHA = [
				["a", "z"],
				["A", "Z"],
				" "
			], this.NUMERIC = [["0", "9"]], this.ALPHANUMERIC = [
				["a", "z"],
				["A", "Z"],
				["0", "9"],
				" "
			], this.ASCII = [[" ", "~"]], this.defaultOptions = {
				chars: this.ALPHANUMERIC,
				resolution: 1,
				padding: 4,
				skipKerning: !1,
				textureStyle: null
			}, this.measureCache = FC(1e3);
		}
		getFont(e, t) {
			let n = `${t.fontFamily}-bitmap`, r = !0;
			if (Ba.has(n)) {
				let t = Ba.get(n);
				return t.ensureCharacters?.(e), t;
			}
			if (t._fill.fill && !t._stroke ? (n += t._fill.fill.styleKey, r = !1) : (t._stroke || t.dropShadow) && (n = `${t.styleKey}-bitmap`, r = !1), n += `-${t.fontStyle}`, n += `-${t.fontVariant}`, n += `-${t.fontWeight}`, !Ba.has(n)) {
				let e = Object.create(t);
				e._lineHeight = 0;
				let i = new Nw({
					style: e,
					overrideFill: r,
					overrideSize: !0,
					...this.defaultOptions
				});
				Hw++, Hw > 50 && I("BitmapText", `You have dynamically created ${Hw} bitmap fonts, this can be inefficient. Try pre installing your font styles using \`BitmapFont.install({name:"style1", style})\``), i.once("destroy", () => {
					Hw--, Ba.remove(n);
				}), Ba.set(n, i);
			}
			let i = Ba.get(n);
			return i.ensureCharacters?.(e), i;
		}
		getLayout(e, t, n = !0) {
			let r = this.getFont(e, t), i = `${e}-${t.styleKey}-${n}`;
			if (this.measureCache.has(i)) return this.measureCache.get(i);
			let a = Fw(bw.graphemeSegmenter(e), t, r, n);
			return this.measureCache.set(i, a), a;
		}
		measureText(e, t, n = !0) {
			return this.getLayout(e, t, n);
		}
		install(...e) {
			let t = e[0];
			typeof t == "string" && (t = {
				name: t,
				style: e[1],
				chars: e[2]?.chars,
				resolution: e[2]?.resolution,
				padding: e[2]?.padding,
				skipKerning: e[2]?.skipKerning
			}, F(P, "BitmapFontManager.install(name, style, options) is deprecated, use BitmapFontManager.install({name, style, ...options})"));
			let n = t?.name;
			if (!n) throw Error("[BitmapFontManager] Property `name` is required.");
			t = {
				...this.defaultOptions,
				...t
			};
			let r = t.style, i = r instanceof Dw ? r : new Dw(r), a = t.dynamicFill ?? this._canUseTintForStyle(i), o = new Nw({
				style: i,
				overrideFill: a,
				skipKerning: t.skipKerning,
				padding: t.padding,
				resolution: t.resolution,
				overrideSize: !1,
				textureStyle: t.textureStyle
			}), s = Bw(t.chars);
			return o.ensureCharacters(s.join("")), Ba.set(`${n}-bitmap`, o), o.once("destroy", () => Ba.remove(`${n}-bitmap`)), o;
		}
		uninstall(e) {
			let t = `${e}-bitmap`, n = Ba.get(t);
			n && n.destroy();
		}
		_canUseTintForStyle(e) {
			return !e._stroke && (!e.dropShadow || e.dropShadow.color === 0) && !e._fill.fill && e._fill.color === 16777215;
		}
	}, Ww = new Uw();
})), Kw = /* @__PURE__ */ c({ BitmapFont: () => qw }), qw, Jw = o((() => {
	Nn(), wt(), V(), PC(), Gw(), qw = class extends NC {
		constructor(e, t) {
			super();
			let { textures: n, data: r } = e;
			Object.keys(r.pages).forEach((e) => {
				let t = r.pages[parseInt(e, 10)], i = n[t.id];
				this.pages.push({ texture: i });
			}), Object.keys(r.chars).forEach((e) => {
				let t = r.chars[e], { frame: i, source: a, rotate: o } = n[t.page], s = z.transformRectCoords(t, i, o, new R()), c = new B({
					frame: s,
					orig: new R(0, 0, t.width, t.height),
					source: a,
					rotate: o
				});
				this.chars[e] = {
					id: e.codePointAt(0),
					xOffset: t.xOffset,
					yOffset: t.yOffset,
					xAdvance: t.xAdvance,
					kerning: t.kerning ?? {},
					texture: c
				};
			}), this.baseRenderedFontSize = r.fontSize, this.baseMeasurementFontSize = r.fontSize, this.fontMetrics = {
				ascent: 0,
				descent: 0,
				fontSize: r.fontSize
			}, this.baseLineOffset = r.baseLineOffset, this.lineHeight = r.lineHeight, this.fontFamily = r.fontFamily, this.distanceField = r.distanceField ?? {
				type: "none",
				range: 0
			}, this.url = t;
		}
		destroy() {
			super.destroy();
			for (let e = 0; e < this.pages.length; e++) {
				let { texture: t } = this.pages[e];
				t.destroy(!0);
			}
			this.pages = null;
		}
		static install(e) {
			Ww.install(e);
		}
		static uninstall(e) {
			Ww.uninstall(e);
		}
	};
}));
Ii(), ia(), W(), h(), Ki();
var Yw = [".xml", ".fnt"], Xw = {
	extension: {
		type: d.CacheParser,
		name: "cacheBitmapFont"
	},
	test: (e) => !!e?.pages && !!e?.chars && typeof e?.fontFamily == "string" && e.fontFamily !== "",
	getCacheableAssets(e, t) {
		let n = {};
		return e.forEach((e) => {
			n[e] = t, n[`${e}-bitmap`] = t;
		}), n[`${t.fontFamily}-bitmap`] = t, n;
	}
}, Zw = {
	extension: {
		type: d.LoadParser,
		priority: Fi.Normal
	},
	name: "loadBitmapFont",
	id: "bitmap-font",
	test(e) {
		return Yw.includes(Gi.extname(e).toLowerCase());
	},
	async testParse(e) {
		return AC.test(e) || MC.test(e);
	},
	async parse(e, t, n) {
		let r = AC.test(e) ? AC.parse(e) : MC.parse(e), { src: i } = t, { pages: a } = r, o = [], s = r.distanceField ? {
			scaleMode: "linear",
			alphaMode: "premultiply-alpha-on-upload",
			autoGenerateMipmaps: !1,
			resolution: 1
		} : {};
		for (let e = 0; e < a.length; ++e) {
			let t = a[e].file, n = Gi.join(Gi.dirname(i), t);
			n = ra(n, i), o.push({
				src: n,
				data: s
			});
		}
		let [c, { BitmapFont: l }] = await Promise.all([n.load(o), Promise.resolve().then(() => (Jw(), Kw))]);
		return new l({
			data: r,
			textures: o.map((e) => c[e.src])
		}, i);
	},
	async load(e, t) {
		return await (await U.get().fetch(e)).text();
	},
	async unload(e, t, n) {
		await Promise.all(e.pages.map((e) => n.unload(e.texture.source._sourceOrigin))), e.destroy();
	}
}, Qw = class {
	constructor(e, t = !1) {
		this._loader = e, this._assetList = [], this._isLoading = !1, this._maxConcurrent = 1, this.verbose = t;
	}
	add(e) {
		e.forEach((e) => {
			this._assetList.push(e);
		}), this.verbose && console.log("[BackgroundLoader] assets: ", this._assetList), this._isActive && !this._isLoading && this._next();
	}
	async _next() {
		if (this._assetList.length && this._isActive) {
			this._isLoading = !0;
			let e = [], t = Math.min(this._assetList.length, this._maxConcurrent);
			for (let n = 0; n < t; n++) e.push(this._assetList.pop());
			await this._loader.load(e), this._isLoading = !1, this._next();
		}
	}
	get active() {
		return this._isActive;
	}
	set active(e) {
		this._isActive !== e && (this._isActive = e, e && !this._isLoading && this._next());
	}
};
h(), V();
var $w = {
	extension: {
		type: d.CacheParser,
		name: "cacheTextureArray"
	},
	test: (e) => Array.isArray(e) && e.every((e) => e instanceof B),
	getCacheableAssets: (e, t) => {
		let n = {};
		return e.forEach((e) => {
			t.forEach((t, r) => {
				n[e + (r === 0 ? "" : r + 1)] = t;
			});
		}), n;
	}
};
// node_modules/pixi.js/lib/assets/detections/utils/testImageFormat.mjs
async function eT(e) {
	if ("Image" in globalThis) return new Promise((t) => {
		let n = new Image();
		n.onload = () => {
			t(!0);
		}, n.onerror = () => {
			t(!1);
		}, n.src = e;
	});
	if ("createImageBitmap" in globalThis && "fetch" in globalThis) {
		try {
			let t = await (await fetch(e)).blob();
			await createImageBitmap(t);
		} catch {
			return !1;
		}
		return !0;
	}
	return !1;
}
// node_modules/pixi.js/lib/assets/detections/parsers/detectAvif.mjs
h();
var tT = {
	extension: {
		type: d.DetectionParser,
		priority: 1
	},
	test: async () => eT("data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A="),
	add: async (e) => [...e, "avif"],
	remove: async (e) => e.filter((e) => e !== "avif")
};
// node_modules/pixi.js/lib/assets/detections/parsers/detectDefaults.mjs
h();
var nT = [
	"png",
	"jpg",
	"jpeg"
], rT = {
	extension: {
		type: d.DetectionParser,
		priority: -1
	},
	test: () => Promise.resolve(!0),
	add: async (e) => [...e, ...nT],
	remove: async (e) => e.filter((e) => !nT.includes(e))
}, iT = "WorkerGlobalScope" in globalThis && globalThis instanceof globalThis.WorkerGlobalScope;
function aT(e) {
	return !iT && document.createElement("video").canPlayType(e) !== "";
}
// node_modules/pixi.js/lib/assets/detections/parsers/detectMp4.mjs
h();
var oT = {
	extension: {
		type: d.DetectionParser,
		priority: 0
	},
	test: async () => aT("video/mp4"),
	add: async (e) => [
		...e,
		"mp4",
		"m4v"
	],
	remove: async (e) => e.filter((e) => e !== "mp4" && e !== "m4v")
};
// node_modules/pixi.js/lib/assets/detections/parsers/detectOgv.mjs
h();
var sT = {
	extension: {
		type: d.DetectionParser,
		priority: 0
	},
	test: async () => aT("video/ogg"),
	add: async (e) => [...e, "ogv"],
	remove: async (e) => e.filter((e) => e !== "ogv")
};
// node_modules/pixi.js/lib/assets/detections/parsers/detectWebm.mjs
h();
var cT = {
	extension: {
		type: d.DetectionParser,
		priority: 0
	},
	test: async () => aT("video/webm"),
	add: async (e) => [...e, "webm"],
	remove: async (e) => e.filter((e) => e !== "webm")
};
// node_modules/pixi.js/lib/assets/detections/parsers/detectWebp.mjs
h();
var lT = {
	extension: {
		type: d.DetectionParser,
		priority: 0
	},
	test: async () => eT("data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA="),
	add: async (e) => [...e, "webp"],
	remove: async (e) => e.filter((e) => e !== "webp")
};
L(), Ki(), Ji(), $i();
var uT = class e {
	constructor() {
		this.loadOptions = { ...e.defaultOptions }, this._parsers = [], this._parsersValidated = !1, this.parsers = new Proxy(this._parsers, { set: (e, t, n) => (this._parsersValidated = !1, e[t] = n, !0) }), this.promiseCache = {};
	}
	reset() {
		this._parsersValidated = !1, this.promiseCache = {};
	}
	_getLoadPromiseAndParser(e, t) {
		let n = {
			promise: null,
			parser: null
		};
		return n.promise = (async () => {
			let r = null, i = null;
			if ((t.parser || t.loadParser) && (i = this._parserHash[t.parser || t.loadParser], t.loadParser && I(`[Assets] "loadParser" is deprecated, use "parser" instead for ${e}`), i || I(`[Assets] specified load parser "${t.parser || t.loadParser}" not found while loading ${e}`)), !i) {
				for (let n = 0; n < this.parsers.length; n++) {
					let r = this.parsers[n];
					if (r.load && r.test?.(e, t, this)) {
						i = r;
						break;
					}
				}
				if (!i) return I(`[Assets] ${e} could not be loaded as we don't know how to parse it, ensure the correct parser has been added`), null;
			}
			r = await i.load(e, t, this), n.parser = i;
			for (let e = 0; e < this.parsers.length; e++) {
				let i = this.parsers[e];
				i.parse && i.parse && await i.testParse?.(r, t, this) && (r = await i.parse(r, t, this) || r, n.parser = i);
			}
			return r;
		})(), n;
	}
	async load(t, n) {
		this._parsersValidated || this._validateParsers();
		let { onProgress: r, onError: i, strategy: a, retryCount: o, retryDelay: s } = typeof n == "function" ? {
			...e.defaultOptions,
			...this.loadOptions,
			onProgress: n
		} : {
			...e.defaultOptions,
			...this.loadOptions,
			...n || {}
		}, c = 0, l = {}, u = Qi(t), d = qi(t, (e) => ({
			alias: [e],
			src: e,
			data: {}
		})), f = d.reduce((e, t) => e + (t.progressSize || 1), 0), p = d.map(async (e) => {
			let t = Gi.toAbsolute(e.src);
			l[e.src] || (await this._loadAssetWithRetry(t, e, {
				onProgress: r,
				onError: i,
				strategy: a,
				retryCount: o,
				retryDelay: s
			}, l), c += e.progressSize || 1, r && r(c / f));
		});
		return await Promise.all(p), u ? l[d[0].src] : l;
	}
	async unload(e) {
		let t = qi(e, (e) => ({
			alias: [e],
			src: e
		})).map(async (e) => {
			let t = Gi.toAbsolute(e.src), n = this.promiseCache[t];
			if (n) {
				let r = await n.promise;
				delete this.promiseCache[t], await n.parser?.unload?.(r, e, this);
			}
		});
		await Promise.all(t);
	}
	_validateParsers() {
		this._parsersValidated = !0, this._parserHash = this._parsers.filter((e) => e.name || e.id).reduce((e, t) => (!t.name && !t.id ? I("[Assets] parser should have an id") : (e[t.name] || e[t.id]) && I(`[Assets] parser id conflict "${t.id}"`), e[t.name] = t, t.id && (e[t.id] = t), e), {});
	}
	async _loadAssetWithRetry(e, t, n, r) {
		let i = 0, { onError: a, strategy: o, retryCount: s, retryDelay: c } = n, l = (e) => new Promise((t) => setTimeout(t, e));
		for (;;) try {
			this.promiseCache[e] || (this.promiseCache[e] = this._getLoadPromiseAndParser(e, t)), r[t.src] = await this.promiseCache[e].promise;
			return;
		} catch (n) {
			if (delete this.promiseCache[e], delete r[t.src], i++, o === "retry" && !(o !== "retry" || i > s)) {
				a && a(n, t), await l(c);
				continue;
			}
			if (o === "skip") {
				a && a(n, t);
				return;
			}
			a && a(n, t);
			let u = /* @__PURE__ */ Error(`[Loader.load] Failed to load ${e}.
${n}`);
			throw n instanceof Error && n.stack && (u.stack = n.stack), u;
		}
	}
};
uT.defaultOptions = {
	onProgress: void 0,
	onError: void 0,
	strategy: "throw",
	retryCount: 3,
	retryDelay: 250
};
var dT = uT;
// node_modules/pixi.js/lib/assets/utils/checkDataUrl.mjs
function fT(e, t) {
	if (Array.isArray(t)) {
		for (let n of t) if (e.startsWith(`data:${n}`)) return !0;
		return !1;
	}
	return e.startsWith(`data:${t}`);
}
// node_modules/pixi.js/lib/assets/utils/checkExtension.mjs
Ki();
function pT(e, t) {
	let n = e.split("?")[0], r = Gi.extname(n).toLowerCase();
	return Array.isArray(t) ? t.includes(r) : r === t;
}
W(), h(), Ii();
var mT = ".json", hT = "application/json", gT = {
	extension: {
		type: d.LoadParser,
		priority: Fi.Low
	},
	name: "loadJson",
	id: "json",
	test(e) {
		return fT(e, hT) || pT(e, mT);
	},
	async load(e) {
		return await (await U.get().fetch(e)).json();
	}
};
W(), h(), Ii();
var _T = ".txt", vT = "text/plain", yT = {
	name: "loadTxt",
	id: "text",
	extension: {
		type: d.LoadParser,
		priority: Fi.Low,
		name: "loadTxt"
	},
	test(e) {
		return fT(e, vT) || pT(e, _T);
	},
	async load(e) {
		return await (await U.get().fetch(e)).text();
	}
};
W(), h(), L(), Ki(), Va(), Ii();
var bT = [
	"normal",
	"bold",
	"100",
	"200",
	"300",
	"400",
	"500",
	"600",
	"700",
	"800",
	"900"
], xT = [
	".ttf",
	".otf",
	".woff",
	".woff2"
], ST = [
	"font/ttf",
	"font/otf",
	"font/woff",
	"font/woff2"
], CT = /^(--|-?[A-Z_])[0-9A-Z_-]*$/i;
function wT(e) {
	let t = Gi.extname(e), n = Gi.basename(e, t).replace(/(-|_)/g, " ").toLowerCase().split(" ").map((e) => e.charAt(0).toUpperCase() + e.slice(1)), r = n.length > 0;
	for (let e of n) if (!e.match(CT)) {
		r = !1;
		break;
	}
	let i = n.join(" ");
	return r || (i = `"${i.replace(/[\\"]/g, "\\$&")}"`), i;
}
var TT = /^[0-9A-Za-z%:/?#\[\]@!\$&'()\*\+,;=\-._~]*$/;
function ET(e) {
	return TT.test(e) ? e : encodeURI(e);
}
var DT = {
	extension: {
		type: d.LoadParser,
		priority: Fi.Low
	},
	name: "loadWebFont",
	id: "web-font",
	test(e) {
		return fT(e, ST) || pT(e, xT);
	},
	async load(e, t) {
		let n = U.get().getFontFaceSet();
		if (n) {
			let r = [], i = t.data?.family ?? wT(e), a = t.data?.weights?.filter((e) => bT.includes(e)) ?? ["normal"], o = t.data ?? {};
			for (let t = 0; t < a.length; t++) {
				let s = a[t], c = new FontFace(i, `url('${ET(e)}')`, {
					...o,
					weight: s
				});
				await c.load(), n.add(c), r.push(c);
			}
			return Ba.has(`${i}-and-url`) ? Ba.get(`${i}-and-url`).entries.push({
				url: e,
				faces: r
			}) : Ba.set(`${i}-and-url`, { entries: [{
				url: e,
				faces: r
			}] }), r.length === 1 ? r[0] : r;
		}
		return I("[loadWebFont] FontFace API is not supported. Skipping loading font"), null;
	},
	unload(e) {
		let t = Array.isArray(e) ? e : [e], n = t[0].family, r = Ba.get(`${n}-and-url`), i = r.entries.find((e) => e.faces.some((e) => t.indexOf(e) !== -1));
		i.faces = i.faces.filter((e) => t.indexOf(e) === -1), i.faces.length === 0 && (r.entries = r.entries.filter((e) => e !== i)), t.forEach((e) => {
			U.get().getFontFaceSet().delete(e);
		}), r.entries.length === 0 && Ba.remove(`${n}-and-url`);
	}
};
// node_modules/pixi.js/lib/utils/network/getResolutionOfUrl.mjs
na();
function OT(e, t = 1) {
	let n = ta.RETINA_PREFIX?.exec(e);
	return n ? parseFloat(n[1]) : t;
}
V(), L(), Va();
function kT(e, t, n) {
	e.label = n, e._sourceOrigin = n;
	let r = new B({
		source: e,
		label: n
	}), i = () => {
		delete t.promiseCache[n], Ba.has(n) && Ba.remove(n);
	};
	return r.source.once("destroy", () => {
		t.promiseCache[n] && (I("[Assets] A TextureSource managed by Assets was destroyed instead of unloaded! Use Assets.unload() instead of destroying the TextureSource."), i());
	}), r.once("destroy", () => {
		e.destroyed || (I("[Assets] A Texture managed by Assets was destroyed instead of unloaded! Use Assets.unload() instead of destroying the Texture."), i());
	}), r;
}
W(), h(), Ma(), MS(), Ii();
var AT = ".svg", jT = "image/svg+xml", MT = {
	extension: {
		type: d.LoadParser,
		priority: Fi.Low,
		name: "loadSVG"
	},
	name: "loadSVG",
	id: "svg",
	config: {
		crossOrigin: "anonymous",
		parseAsGraphicsContext: !1
	},
	test(e) {
		return fT(e, jT) || pT(e, AT);
	},
	async load(e, t, n) {
		return t.data?.parseAsGraphicsContext ?? this.config.parseAsGraphicsContext ? PT(e) : NT(e, t, n, this.config.crossOrigin);
	},
	unload(e) {
		e.destroy(!0);
	}
};
async function NT(e, t, n, r) {
	let i = await U.get().fetch(e), a = U.get().createImage();
	a.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(await i.text())}`, a.crossOrigin = r, await a.decode();
	let o = t.data?.width ?? a.width, s = t.data?.height ?? a.height, c = t.data?.resolution || OT(e), l = Math.ceil(o * c), u = Math.ceil(s * c), d = U.get().createCanvas(l, u), f = d.getContext("2d");
	f.imageSmoothingEnabled = !0, f.imageSmoothingQuality = "high", f.drawImage(a, 0, 0, o * c, s * c);
	let { parseAsGraphicsContext: p, ...m } = t.data ?? {};
	return kT(new ja({
		resource: d,
		alphaMode: "premultiply-alpha-on-upload",
		resolution: c,
		...m
	}), n, e);
}
async function PT(e) {
	let t = await (await U.get().fetch(e)).text(), n = new jS();
	return n.svg(t), n;
}
// node_modules/pixi.js/lib/_virtual/checkImageBitmap.worker.mjs
var FT = "(function () {\n    'use strict';\n\n    const WHITE_PNG = \"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=\";\n    async function checkImageBitmap() {\n      try {\n        if (typeof createImageBitmap !== \"function\") return false;\n        const response = await fetch(WHITE_PNG);\n        const imageBlob = await response.blob();\n        const imageBitmap = await createImageBitmap(imageBlob);\n        return imageBitmap.width === 1 && imageBitmap.height === 1;\n      } catch (_e) {\n        return false;\n      }\n    }\n    void checkImageBitmap().then((result) => {\n      self.postMessage(result);\n    });\n\n})();\n", IT = null, LT = class {
	constructor() {
		IT ||= URL.createObjectURL(new Blob([FT], { type: "application/javascript" })), this.worker = new Worker(IT);
	}
};
LT.revokeObjectURL = function() {
	IT &&= (URL.revokeObjectURL(IT), null);
};
// node_modules/pixi.js/lib/_virtual/loadImageBitmap.worker.mjs
var RT = "(function () {\n    'use strict';\n\n    async function loadImageBitmap(url, alphaMode) {\n      const response = await fetch(url);\n      if (!response.ok) {\n        throw new Error(`[WorkerManager.loadImageBitmap] Failed to fetch ${url}: ${response.status} ${response.statusText}`);\n      }\n      const imageBlob = await response.blob();\n      return alphaMode === \"premultiplied-alpha\" ? createImageBitmap(imageBlob, { premultiplyAlpha: \"none\" }) : createImageBitmap(imageBlob);\n    }\n    self.onmessage = async (event) => {\n      try {\n        const imageBitmap = await loadImageBitmap(event.data.data[0], event.data.data[1]);\n        self.postMessage({\n          data: imageBitmap,\n          uuid: event.data.uuid,\n          id: event.data.id\n        }, [imageBitmap]);\n      } catch (e) {\n        self.postMessage({\n          error: e,\n          uuid: event.data.uuid,\n          id: event.data.id\n        });\n      }\n    };\n\n})();\n", zT = null, BT = class {
	constructor() {
		zT ||= URL.createObjectURL(new Blob([RT], { type: "application/javascript" })), this.worker = new Worker(zT);
	}
};
BT.revokeObjectURL = function() {
	zT &&= (URL.revokeObjectURL(zT), null);
};
// node_modules/pixi.js/lib/assets/loader/workers/WorkerManager.mjs
var VT = 0, HT, UT = new class {
	constructor() {
		this._initialized = !1, this._createdWorkers = 0, this._workerPool = [], this._queue = [], this._resolveHash = {};
	}
	isImageBitmapSupported() {
		return this._isImageBitmapSupported === void 0 && (this._isImageBitmapSupported = new Promise((e) => {
			let { worker: t } = new LT();
			t.addEventListener("message", (n) => {
				t.terminate(), LT.revokeObjectURL(), e(n.data);
			});
		})), this._isImageBitmapSupported;
	}
	loadImageBitmap(e, t) {
		return this._run("loadImageBitmap", [e, t?.data?.alphaMode]);
	}
	async _initWorkers() {
		this._initialized ||= !0;
	}
	_getWorker() {
		HT === void 0 && (HT = navigator.hardwareConcurrency || 4);
		let e = this._workerPool.pop();
		return !e && this._createdWorkers < HT && (this._createdWorkers++, e = new BT().worker, e.addEventListener("message", (e) => {
			this._complete(e.data), this._returnWorker(e.target), this._next();
		})), e;
	}
	_returnWorker(e) {
		this._workerPool.push(e);
	}
	_complete(e) {
		this._resolveHash[e.uuid] && (e.error === void 0 ? this._resolveHash[e.uuid].resolve(e.data) : this._resolveHash[e.uuid].reject(e.error), delete this._resolveHash[e.uuid]);
	}
	async _run(e, t) {
		await this._initWorkers();
		let n = new Promise((n, r) => {
			this._queue.push({
				id: e,
				arguments: t,
				resolve: n,
				reject: r
			});
		});
		return this._next(), n;
	}
	_next() {
		if (!this._queue.length) return;
		let e = this._getWorker();
		if (!e) return;
		let t = this._queue.pop(), n = t.id;
		this._resolveHash[VT] = {
			resolve: t.resolve,
			reject: t.reject
		}, e.postMessage({
			data: t.arguments,
			uuid: VT++,
			id: n
		});
	}
	reset() {
		this._workerPool.forEach((e) => e.terminate()), this._workerPool.length = 0, Object.values(this._resolveHash).forEach(({ reject: e }) => {
			e?.(/* @__PURE__ */ Error("WorkerManager has been reset before completion"));
		}), this._resolveHash = {}, this._queue.length = 0, this._initialized = !1, this._createdWorkers = 0;
	}
}();
W(), h(), Ma(), Ii();
var WT = [
	".jpeg",
	".jpg",
	".png",
	".webp",
	".avif"
], GT = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/avif"
];
async function KT(e, t) {
	let n = await U.get().fetch(e);
	if (!n.ok) throw Error(`[loadImageBitmap] Failed to fetch ${e}: ${n.status} ${n.statusText}`);
	let r = await n.blob();
	return t?.data?.alphaMode === "premultiplied-alpha" ? createImageBitmap(r, { premultiplyAlpha: "none" }) : createImageBitmap(r);
}
var qT = {
	name: "loadTextures",
	id: "texture",
	extension: {
		type: d.LoadParser,
		priority: Fi.High,
		name: "loadTextures"
	},
	config: {
		preferWorkers: !0,
		preferCreateImageBitmap: !0,
		crossOrigin: "anonymous"
	},
	test(e) {
		return fT(e, GT) || pT(e, WT);
	},
	async load(e, t, n) {
		let r = null;
		return r = globalThis.createImageBitmap && this.config.preferCreateImageBitmap ? this.config.preferWorkers && await UT.isImageBitmapSupported() ? await UT.loadImageBitmap(e, t) : await KT(e, t) : await new Promise((t, n) => {
			r = U.get().createImage(), r.crossOrigin = this.config.crossOrigin, r.src = e, r.complete ? t(r) : (r.onload = () => {
				t(r);
			}, r.onerror = n);
		}), kT(new ja({
			resource: r,
			alphaMode: "premultiply-alpha-on-upload",
			resolution: t.data?.resolution || OT(e),
			...t.data
		}), n, e);
	},
	unload(e) {
		e.destroy(!0);
	}
};
h(), Ra(), Fa();
var JT = [
	".mp4",
	".m4v",
	".webm",
	".ogg",
	".ogv",
	".h264",
	".avi",
	".mov"
], YT, XT;
function ZT(e, t, n) {
	n === void 0 && !t.startsWith("data:") ? e.crossOrigin = $T(t) : n !== !1 && (e.crossOrigin = typeof n == "string" ? n : "anonymous");
}
function QT(e) {
	return new Promise((t, n) => {
		e.addEventListener("canplaythrough", r), e.addEventListener("error", i), e.load();
		function r() {
			a(), t();
		}
		function i(e) {
			a(), n(e);
		}
		function a() {
			e.removeEventListener("canplaythrough", r), e.removeEventListener("error", i);
		}
	});
}
function $T(e, t = globalThis.location) {
	if (e.startsWith("data:")) return "";
	t ||= globalThis.location;
	let n = new URL(e, document.baseURI);
	return n.hostname !== t.hostname || n.port !== t.port || n.protocol !== t.protocol ? "anonymous" : "";
}
function eE() {
	let e = [], t = [];
	for (let n of JT) {
		let r = La.MIME_TYPES[n.substring(1)] || `video/${n.substring(1)}`;
		aT(r) && (e.push(n), t.includes(r) || t.push(r));
	}
	return {
		validVideoExtensions: e,
		validVideoMime: t
	};
}
var tE = {
	name: "loadVideo",
	id: "video",
	extension: {
		type: d.LoadParser,
		name: "loadVideo"
	},
	test(e) {
		if (!YT || !XT) {
			let { validVideoExtensions: e, validVideoMime: t } = eE();
			YT = e, XT = t;
		}
		let t = fT(e, XT), n = pT(e, YT);
		return t || n;
	},
	async load(e, t, n) {
		let r = {
			...La.defaultOptions,
			resolution: t.data?.resolution || OT(e),
			alphaMode: t.data?.alphaMode || await Na(),
			...t.data
		}, i = document.createElement("video"), a = {
			preload: r.autoLoad === !1 ? void 0 : "auto",
			"webkit-playsinline": r.playsinline === !1 ? void 0 : "",
			playsinline: r.playsinline === !1 ? void 0 : "",
			muted: r.muted === !0 ? "" : void 0,
			loop: r.loop === !0 ? "" : void 0,
			autoplay: r.autoPlay === !1 ? void 0 : ""
		};
		Object.keys(a).forEach((e) => {
			let t = a[e];
			t !== void 0 && i.setAttribute(e, t);
		}), r.muted === !0 && (i.muted = !0), ZT(i, e, r.crossorigin);
		let o = document.createElement("source"), s;
		if (r.mime) s = r.mime;
		else if (e.startsWith("data:")) s = e.slice(5, e.indexOf(";"));
		else if (!e.startsWith("blob:")) {
			let t = e.split("?")[0].slice(e.lastIndexOf(".") + 1).toLowerCase();
			s = La.MIME_TYPES[t] || `video/${t}`;
		}
		return o.src = e, s && (o.type = s), new Promise((a, s) => {
			r.preload && !r.autoPlay && i.load(), i.addEventListener("canplay", c), i.addEventListener("error", l), o.addEventListener("error", l), i.appendChild(o);
			async function c() {
				let o = new La({
					...r,
					resource: i
				});
				u(), t.data.preload && await QT(i), a(kT(o, n, e));
			}
			function l(e) {
				u(), s(e);
			}
			function u() {
				i.removeEventListener("canplay", c), i.removeEventListener("error", l), o.removeEventListener("error", l);
			}
		});
	},
	unload(e) {
		e.destroy(!0);
	}
};
h(), na();
var nE = {
	extension: {
		type: d.ResolveParser,
		name: "resolveTexture"
	},
	test: qT.test,
	parse: (e) => ({
		resolution: parseFloat(ta.RETINA_PREFIX.exec(e)?.[1] ?? "1"),
		format: e.split(".").pop(),
		src: e
	})
};
h(), na();
var rE = {
	extension: {
		type: d.ResolveParser,
		priority: -2,
		name: "resolveJson"
	},
	test: (e) => ta.RETINA_PREFIX.test(e) && e.endsWith(".json"),
	parse: nE.parse
};
h(), L(), Va(), na(), Ji(), $i();
var iE = new class {
	constructor() {
		this._detections = [], this._initialized = !1, this.resolver = new ta(), this.loader = new dT(), this.cache = Ba, this._backgroundLoader = new Qw(this.loader), this._backgroundLoader.active = !0, this.reset();
	}
	async init(e = {}) {
		if (this._initialized) {
			I("[Assets]AssetManager already initialized, did you load before calling this Assets.init()?");
			return;
		}
		if (this._initialized = !0, e.defaultSearchParams && this.resolver.setDefaultSearchParams(e.defaultSearchParams), e.basePath && (this.resolver.basePath = e.basePath), e.bundleIdentifier && this.resolver.setBundleIdentifier(e.bundleIdentifier), e.manifest) {
			let t = e.manifest;
			typeof t == "string" && (t = await this.load(t)), this.resolver.addManifest(t);
		}
		let t = e.texturePreference?.resolution ?? 1, n = typeof t == "number" ? [t] : t, r = await this._detectFormats({
			preferredFormats: e.texturePreference?.format,
			skipDetections: e.skipDetections,
			detections: this._detections
		});
		this.resolver.prefer({ params: {
			format: r,
			resolution: n
		} }), e.preferences && this.setPreferences(e.preferences), e.loadOptions && (this.loader.loadOptions = {
			...this.loader.loadOptions,
			...e.loadOptions
		});
	}
	add(e) {
		this.resolver.add(e);
	}
	async load(e, t) {
		this._initialized || await this.init();
		let n = Qi(e), r = qi(e).map((e) => {
			if (typeof e != "string") {
				let t = this.resolver.getAlias(e);
				return t.some((e) => !this.resolver.hasKey(e)) && this.add(e), Array.isArray(t) ? t[0] : t;
			}
			return this.resolver.hasKey(e) || this.add({
				alias: e,
				src: e
			}), e;
		}), i = this.resolver.resolve(r), a = await this._mapLoadToResolve(i, t);
		return n ? a[r[0]] : a;
	}
	addBundle(e, t) {
		this.resolver.addBundle(e, t);
	}
	async loadBundle(e, t) {
		this._initialized || await this.init();
		let n = !1;
		typeof e == "string" && (n = !0, e = [e]);
		let r = this.resolver.resolveBundle(e), i = {}, a = Object.keys(r), o = 0, s = [], c = () => {
			t?.(s.reduce((e, t) => e + t, 0) / o);
		}, l = a.map((e, t) => {
			let n = r[e], a = Object.values(n), l = [...new Set(a.flat())].reduce((e, t) => e + (t.progressSize || 1), 0);
			return s.push(0), o += l, this._mapLoadToResolve(n, (e) => {
				s[t] = e * l, c();
			}).then((t) => {
				i[e] = t;
			});
		});
		return await Promise.all(l), n ? i[e[0]] : i;
	}
	async backgroundLoad(e) {
		this._initialized || await this.init(), typeof e == "string" && (e = [e]);
		let t = this.resolver.resolve(e);
		this._backgroundLoader.add(Object.values(t));
	}
	async backgroundLoadBundle(e) {
		this._initialized || await this.init(), typeof e == "string" && (e = [e]);
		let t = this.resolver.resolveBundle(e);
		Object.values(t).forEach((e) => {
			this._backgroundLoader.add(Object.values(e));
		});
	}
	reset() {
		this.resolver.reset(), this.loader.reset(), this.cache.reset(), this._initialized = !1;
	}
	get(e) {
		if (typeof e == "string") return Ba.get(e);
		let t = {};
		for (let n = 0; n < e.length; n++) t[n] = Ba.get(e[n]);
		return t;
	}
	async _mapLoadToResolve(e, t) {
		let n = [...new Set(Object.values(e))];
		this._backgroundLoader.active = !1;
		let r = await this.loader.load(n, t);
		this._backgroundLoader.active = !0;
		let i = {};
		return n.forEach((e) => {
			let t = r[e.src], n = [e.src];
			e.alias && n.push(...e.alias), n.forEach((e) => {
				i[e] = t;
			}), Ba.set(n, t);
		}), i;
	}
	async unload(e) {
		this._initialized || await this.init();
		let t = qi(e).map((e) => typeof e == "string" ? e : e.src), n = this.resolver.resolve(t);
		await this._unloadFromResolved(n);
	}
	async unloadBundle(e) {
		this._initialized || await this.init(), e = qi(e);
		let t = this.resolver.resolveBundle(e), n = Object.keys(t).map((e) => this._unloadFromResolved(t[e]));
		await Promise.all(n);
	}
	async _unloadFromResolved(e) {
		let t = Object.values(e);
		t.forEach((e) => {
			Ba.remove(e.src);
		}), await this.loader.unload(t);
	}
	async _detectFormats(e) {
		let t = [];
		e.preferredFormats && (t = Array.isArray(e.preferredFormats) ? e.preferredFormats : [e.preferredFormats]);
		for (let n of e.detections) e.skipDetections || await n.test() ? t = await n.add(t) : e.skipDetections || (t = await n.remove(t));
		return t = t.filter((e, n) => t.indexOf(e) === n), t;
	}
	get detections() {
		return this._detections;
	}
	setPreferences(e) {
		this.loader.parsers.forEach((t) => {
			t.config && Object.keys(t.config).filter((t) => t in e).forEach((n) => {
				t.config[n] = e[n];
			});
		});
	}
}();
m.handleByList(d.LoadParser, iE.loader.parsers).handleByList(d.ResolveParser, iE.resolver.parsers).handleByList(d.CacheParser, iE.cache.parsers).handleByList(d.DetectionParser, iE.detections), m.add($w, rT, tT, lT, oT, sT, cT, gT, yT, DT, MT, qT, tE, Zw, Xw, nE, rE);
var aE = {
	loader: d.LoadParser,
	resolver: d.ResolveParser,
	cache: d.CacheParser,
	detection: d.DetectionParser
};
m.handle(d.Asset, (e) => {
	let t = e.ref;
	Object.entries(aE).filter(([e]) => !!t[e]).forEach(([e, n]) => m.add(Object.assign(t[e], { extension: t[e].extension ?? n })));
}, (e) => {
	let t = e.ref;
	Object.keys(aE).filter((e) => !!t[e]).forEach((e) => m.remove(t[e]));
}), V(), pr(), vr(), ga();
var oE = class e extends ha {
	constructor(...e) {
		let t = e[0];
		Array.isArray(e[0]) && (t = {
			textures: e[0],
			autoUpdate: e[1]
		});
		let { animationSpeed: n = 1, autoPlay: r = !1, autoUpdate: i = !0, loop: a = !0, onComplete: o = null, onFrameChange: s = null, onLoop: c = null, textures: l, updateAnchor: u = !1, ...d } = t, [f] = l;
		super({
			...d,
			texture: f instanceof B ? f : f.texture
		}), this._textures = null, this._durations = null, this._autoUpdate = i, this._isConnectedToTicker = !1, this.animationSpeed = n, this.loop = a, this.updateAnchor = u, this.onComplete = o, this.onFrameChange = s, this.onLoop = c, this._currentTime = 0, this._playing = !1, this._previousFrame = null, this.textures = l, r && this.play();
	}
	stop() {
		this._playing && (this._playing = !1, this._autoUpdate && this._isConnectedToTicker && (_r.shared.remove(this.update, this), this._isConnectedToTicker = !1));
	}
	play() {
		this._playing || (this._playing = !0, this._autoUpdate && !this._isConnectedToTicker && (_r.shared.add(this.update, this, fr.HIGH), this._isConnectedToTicker = !0));
	}
	gotoAndStop(e) {
		this.stop(), this.currentFrame = e;
	}
	gotoAndPlay(e) {
		this.currentFrame = e, this.play();
	}
	update(e) {
		if (!this._playing) return;
		let t = e.deltaTime, n = this.animationSpeed * t, r = this.currentFrame;
		if (this._durations !== null) {
			let e = this._currentTime % 1 * this._durations[this.currentFrame];
			for (e += n / 60 * 1e3; e < 0;) this._currentTime--, e += this._durations[this.currentFrame];
			let r = Math.sign(this.animationSpeed * t);
			for (this._currentTime = Math.floor(this._currentTime); e >= this._durations[this.currentFrame];) e -= this._durations[this.currentFrame] * r, this._currentTime += r;
			this._currentTime += e / this._durations[this.currentFrame];
		} else this._currentTime += n;
		this._currentTime < 0 && !this.loop ? (this.gotoAndStop(0), this.onComplete && this.onComplete()) : this._currentTime >= this._textures.length && !this.loop ? (this.gotoAndStop(this._textures.length - 1), this.onComplete && this.onComplete()) : r !== this.currentFrame && (this.loop && this.onLoop && (this.animationSpeed > 0 && this.currentFrame < r || this.animationSpeed < 0 && this.currentFrame > r) && this.onLoop(), this._updateTexture());
	}
	_updateTexture() {
		let e = this.currentFrame;
		this._previousFrame !== e && (this._previousFrame = e, this.texture = this._textures[e], this.updateAnchor && this.texture.defaultAnchor && this.anchor.copyFrom(this.texture.defaultAnchor), this.onFrameChange && this.onFrameChange(this.currentFrame));
	}
	destroy(e = !1) {
		if (typeof e == "boolean" ? e : e?.texture) {
			let t = typeof e == "boolean" ? e : e?.textureSource;
			this._textures.forEach((e) => {
				this.texture !== e && e.destroy(t);
			});
		}
		this._textures = [], this._durations = null, this.stop(), super.destroy(e), this.onComplete = null, this.onFrameChange = null, this.onLoop = null;
	}
	static fromFrames(t) {
		let n = [];
		for (let e = 0; e < t.length; ++e) n.push(B.from(t[e]));
		return new e(n);
	}
	static fromImages(t) {
		let n = [];
		for (let e = 0; e < t.length; ++e) n.push(B.from(t[e]));
		return new e(n);
	}
	get totalFrames() {
		return this._textures.length;
	}
	get textures() {
		return this._textures;
	}
	set textures(e) {
		if (e[0] instanceof B) this._textures = e, this._durations = null;
		else {
			this._textures = [], this._durations = [];
			for (let t = 0; t < e.length; t++) this._textures.push(e[t].texture), this._durations.push(e[t].time);
		}
		this._previousFrame = null, this.gotoAndStop(0), this._updateTexture();
	}
	get currentFrame() {
		let e = Math.floor(this._currentTime) % this._textures.length;
		return e < 0 && (e += this._textures.length), e;
	}
	set currentFrame(e) {
		if (e < 0 || e > this.totalFrames - 1) throw Error(`[AnimatedSprite]: Invalid frame index value ${e}, expected to be between 0 and totalFrames ${this.totalFrames}.`);
		let t = this.currentFrame;
		this._currentTime = e, t !== this.currentFrame && this._updateTexture();
	}
	get playing() {
		return this._playing;
	}
	get autoUpdate() {
		return this._autoUpdate;
	}
	set autoUpdate(e) {
		e !== this._autoUpdate && (this._autoUpdate = e, !this._autoUpdate && this._isConnectedToTicker ? (_r.shared.remove(this.update, this), this._isConnectedToTicker = !1) : this._autoUpdate && !this._isConnectedToTicker && this._playing && (_r.shared.add(this.update, this), this._isConnectedToTicker = !0));
	}
};
He(), Xe(), li();
var sE = class extends ci {
	constructor(e, t) {
		let { text: n, resolution: r, style: i, anchor: a, width: o, height: s, roundPixels: c, ...l } = e;
		super({ ...l }), this.batched = !0, this._resolution = null, this._autoResolution = !0, this._didTextUpdate = !0, this._styleClass = t, this.text = n ?? "", this.style = i, this.resolution = r ?? null, this.allowChildren = !1, this._anchor = new Ve({ _onUpdate: () => {
			this.onViewUpdate();
		} }), a && (this.anchor = a), this.roundPixels = c ?? !1, o !== void 0 && (this.width = o), s !== void 0 && (this.height = s);
	}
	get anchor() {
		return this._anchor;
	}
	set anchor(e) {
		typeof e == "number" ? this._anchor.set(e) : this._anchor.copyFrom(e);
	}
	set text(e) {
		e = e.toString(), this._text !== e && (this._text = e, this.onViewUpdate());
	}
	get text() {
		return this._text;
	}
	set resolution(e) {
		this._autoResolution = e === null, this._resolution = e, this.onViewUpdate();
	}
	get resolution() {
		return this._resolution;
	}
	get style() {
		return this._style;
	}
	set style(e) {
		e ||= {}, this._style?.off("update", this.onViewUpdate, this), this._style = e instanceof this._styleClass ? e : new this._styleClass(e), this._style.on("update", this.onViewUpdate, this), this.onViewUpdate();
	}
	get width() {
		return Math.abs(this.scale.x) * this.bounds.width;
	}
	set width(e) {
		this._setWidth(e, this.bounds.width);
	}
	get height() {
		return Math.abs(this.scale.y) * this.bounds.height;
	}
	set height(e) {
		this._setHeight(e, this.bounds.height);
	}
	getSize(e) {
		return e ||= {}, e.width = Math.abs(this.scale.x) * this.bounds.width, e.height = Math.abs(this.scale.y) * this.bounds.height, e;
	}
	setSize(e, t) {
		typeof e == "object" ? (t = e.height ?? e.width, e = e.width) : t ??= e, e !== void 0 && this._setWidth(e, this.bounds.width), t !== void 0 && this._setHeight(t, this.bounds.height);
	}
	containsPoint(e) {
		let t = this.bounds.width, n = this.bounds.height, r = -t * this.anchor.x, i = 0;
		return e.x >= r && e.x <= r + t && (i = -n * this.anchor.y, e.y >= i && e.y <= i + n);
	}
	onViewUpdate() {
		this.didViewUpdate || (this._didTextUpdate = !0), super.onViewUpdate();
	}
	destroy(e = !1) {
		this._style?.off("update", this.onViewUpdate, this), super.destroy(e), this.owner = null, this._bounds = null, this._anchor = null, (typeof e == "boolean" ? e : e?.style) && this._style.destroy(e), this._style = null, this._text = null;
	}
	get styleKey() {
		return `${this._text}:${this._style.styleKey}:${this._resolution}`;
	}
};
function cE(e, t) {
	let n = e[0] ?? {};
	return (typeof n == "string" || e[1]) && (F(P, `use new ${t}({ text: "hi!", style }) instead`), n = {
		text: n,
		style: e[1]
	}), n;
}
W(), fn(), wt();
var lE = null, uE = null;
function dE(e, t) {
	lE || (lE = U.get().createCanvas(256, 128), uE = lE.getContext("2d", { willReadFrequently: !0 }), uE.globalCompositeOperation = "copy", uE.globalAlpha = 1), (lE.width < e || lE.height < t) && (lE.width = un(e), lE.height = un(t));
}
function fE(e, t, n) {
	for (let r = 0, i = 4 * n * t; r < t; ++r, i += 4) if (e[i + 3] !== 0) return !1;
	return !0;
}
function pE(e, t, n, r, i) {
	let a = 4 * t;
	for (let t = r, o = r * a + 4 * n; t <= i; ++t, o += a) if (e[o + 3] !== 0) return !1;
	return !0;
}
function mE(...e) {
	let t = e[0];
	t.canvas || (t = {
		canvas: e[0],
		resolution: e[1]
	});
	let { canvas: n } = t, r = Math.min(t.resolution ?? 1, 1), i = t.width ?? n.width, a = t.height ?? n.height, o = t.output;
	if (dE(i, a), !uE) throw TypeError("Failed to get canvas 2D context");
	uE.drawImage(n, 0, 0, i, a, 0, 0, i * r, a * r);
	let s = uE.getImageData(0, 0, i, a).data, c = 0, l = 0, u = i - 1, d = a - 1;
	for (; l < a && fE(s, i, l);) ++l;
	if (l === a) return R.EMPTY;
	for (; fE(s, i, d);) --d;
	for (; pE(s, i, c, l, d);) ++c;
	for (; pE(s, i, u, l, d);) --u;
	return ++u, ++d, uE.globalCompositeOperation = "source-over", uE.strokeRect(c, l, u - c, d - l), uE.globalCompositeOperation = "copy", o ??= new R(), o.set(c / r, l / r, (u - c) / r, (d - l) / r), o;
}
ke(), wt(), ro(), xw(), ww(), jw();
var hE = new R();
function gE(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e.charCodeAt(n) === 32 && t++;
	return t;
}
var _E = new class {
	getCanvasAndContext(e) {
		let { text: t, style: n, resolution: r = 1 } = e, i = n._getFinalPadding(), a = bw.measureText(t || " ", n), o = Math.ceil(Math.ceil(Math.max(1, a.width) + i * 2) * r), s = Math.ceil(Math.ceil(Math.max(1, a.height) + i * 2) * r), c = no.getOptimalCanvasAndContext(o, s);
		return this._renderTextToCanvas(n, i, r, c, a), {
			canvasAndContext: c,
			frame: n.trim ? mE({
				canvas: c.canvas,
				width: o,
				height: s,
				resolution: 1,
				output: hE
			}) : hE.set(0, 0, o, s)
		};
	}
	returnCanvasAndContext(e) {
		no.returnCanvasAndContext(e);
	}
	_renderTextToCanvas(e, t, n, r, i) {
		if (i.runsByLine && i.runsByLine.length > 0) {
			this._renderTaggedTextToCanvas(i, e, t, n, r);
			return;
		}
		let { canvas: a, context: o } = r, s = Sw(e), c = i.lines, l = i.lineHeight, u = i.lineWidths, d = i.maxLineWidth, f = i.fontProperties, p = a.height;
		if (o.resetTransform(), o.scale(n, n), o.textBaseline = e.textBaseline, e._stroke?.width) {
			let t = e._stroke;
			o.lineWidth = t.width, o.miterLimit = t.miterLimit, o.lineJoin = t.join, o.lineCap = t.cap;
		}
		o.font = s;
		let m, h, g = e.dropShadow ? 2 : 1, _ = (e._stroke?.width ?? 0) / 2, v = (l - f.fontSize) / 2;
		l - f.fontSize < 0 && (v = 0);
		for (let a = 0; a < g; ++a) {
			let s = e.dropShadow && a === 0, g = s ? Math.ceil(Math.max(1, p, p / n) + t * 2) : 0, y = g * n;
			if (s) this._setupDropShadow(o, e, n, y);
			else {
				let n = e._gradientBounds, r = e._gradientOffset;
				if (n) {
					let a = {
						width: n.width,
						height: n.height,
						lineHeight: n.height,
						lines: i.lines
					};
					this._setFillAndStrokeStyles(o, e, a, t, _, r?.x ?? 0, r?.y ?? 0);
				} else r ? this._setFillAndStrokeStyles(o, e, i, t, _, r.x, r.y) : this._setFillAndStrokeStyles(o, e, i, t, _);
				o.shadowColor = "rgba(0,0,0,0)";
			}
			for (let n = 0; n < c.length; n++) {
				m = _, h = _ + n * l + f.ascent + v, m += this._getAlignmentOffset(u[n], d, e.align);
				let i = 0;
				if (e.align === "justify" && e.wordWrap && n < c.length - 1) {
					let e = gE(c[n]);
					e > 0 && (i = (d - u[n]) / e);
				}
				e._stroke?.width && this._drawLetterSpacing(c[n], e, r, m + t, h + t - g, !0, i), e._fill !== void 0 && this._drawLetterSpacing(c[n], e, r, m + t, h + t - g, !1, i);
			}
		}
	}
	_renderTaggedTextToCanvas(e, t, n, r, i) {
		let { canvas: a, context: o } = i, { runsByLine: s, lineWidths: c, maxLineWidth: l, lineAscents: u, lineHeights: d, hasDropShadow: f } = e, p = a.height;
		o.resetTransform(), o.scale(r, r), o.textBaseline = t.textBaseline;
		let m = f ? 2 : 1, h = t._stroke?.width ?? 0;
		for (let e of s) for (let t of e) {
			let e = t.style._stroke?.width ?? 0;
			e > h && (h = e);
		}
		let g = h / 2, _ = [];
		for (let e = 0; e < s.length; e++) {
			let t = s[e], n = [];
			for (let e of t) {
				let t = Sw(e.style);
				o.font = t, n.push({
					width: bw._measureText(e.text, e.style.letterSpacing, o),
					font: t
				});
			}
			_.push(n);
		}
		for (let e = 0; e < m; ++e) {
			let a = f && e === 0, m = a ? Math.ceil(Math.max(1, p, p / r) + n * 2) : 0, h = m * r;
			a || (o.shadowColor = "rgba(0,0,0,0)");
			let v = g;
			for (let e = 0; e < s.length; e++) {
				let f = s[e], p = c[e], y = u[e], b = d[e], x = _[e], S = g;
				S += this._getAlignmentOffset(p, l, t.align);
				let C = 0;
				if (t.align === "justify" && t.wordWrap && e < s.length - 1) {
					let e = 0;
					for (let t of f) e += gE(t.text);
					e > 0 && (C = (l - p) / e);
				}
				let w = v + y, ee = S + n;
				for (let e = 0; e < f.length; e++) {
					let t = f[e], { width: s, font: c } = x[e];
					if (o.font = c, o.textBaseline = t.style.textBaseline, t.style._stroke?.width) {
						let e = t.style._stroke;
						if (o.lineWidth = e.width, o.miterLimit = e.miterLimit, o.lineJoin = e.join, o.lineCap = e.cap, a) {
							if (t.style.dropShadow) this._setupDropShadow(o, t.style, r, h);
							else {
								let e = gE(t.text);
								ee += s + e * C;
								continue;
							}
						} else {
							let r = bw.measureFont(c), i = t.style.lineHeight || r.fontSize;
							o.strokeStyle = kw(e, o, {
								width: s,
								height: i,
								lineHeight: i,
								lines: [t.text]
							}, n * 2, ee - n, v);
						}
						this._drawLetterSpacing(t.text, t.style, i, ee, w + n - m, !0, C);
					}
					let l = gE(t.text);
					ee += s + l * C;
				}
				ee = S + n;
				for (let e = 0; e < f.length; e++) {
					let t = f[e], { width: s, font: c } = x[e];
					if (o.font = c, o.textBaseline = t.style.textBaseline, t.style._fill !== void 0) {
						if (a) {
							if (t.style.dropShadow) this._setupDropShadow(o, t.style, r, h);
							else {
								let e = gE(t.text);
								ee += s + e * C;
								continue;
							}
						} else {
							let e = bw.measureFont(c), r = t.style.lineHeight || e.fontSize, i = {
								width: s,
								height: r,
								lineHeight: r,
								lines: [t.text]
							};
							o.fillStyle = kw(t.style._fill, o, i, n * 2, ee - n, v);
						}
						this._drawLetterSpacing(t.text, t.style, i, ee, w + n - m, !1, C);
					}
					let l = gE(t.text);
					ee += s + l * C;
				}
				v += b;
			}
		}
	}
	_setFillAndStrokeStyles(e, t, n, r, i, a = 0, o = 0) {
		if (e.fillStyle = t._fill ? kw(t._fill, e, n, r * 2, a, o) : null, t._stroke?.width) {
			let s = i + r * 2;
			e.strokeStyle = kw(t._stroke, e, n, s, a, o);
		}
	}
	_setupDropShadow(e, t, n, r) {
		e.fillStyle = "black", e.strokeStyle = "black";
		let i = t.dropShadow, a = i.color, o = i.alpha;
		e.shadowColor = A.shared.setValue(a).setAlpha(o).toRgbaString();
		let s = i.blur * n, c = i.distance * n;
		e.shadowBlur = s, e.shadowOffsetX = Math.cos(i.angle) * c, e.shadowOffsetY = Math.sin(i.angle) * c + r;
	}
	_getAlignmentOffset(e, t, n) {
		return n === "right" ? t - e : n === "center" ? (t - e) / 2 : 0;
	}
	_drawLetterSpacing(e, t, n, r, i, a = !1, o = 0) {
		let { context: s } = n, c = t.letterSpacing, l = !1;
		if (bw.experimentalLetterSpacingSupported && (bw.experimentalLetterSpacing ? (s.letterSpacing = `${c}px`, s.textLetterSpacing = `${c}px`, l = !0) : (s.letterSpacing = "0px", s.textLetterSpacing = "0px")), (c === 0 || l) && o === 0) {
			a ? s.strokeText(e, r, i) : s.fillText(e, r, i);
			return;
		}
		if (o !== 0 && (c === 0 || l)) {
			let t = e.split(" "), n = r, c = s.measureText(" ").width;
			for (let e = 0; e < t.length; e++) a ? s.strokeText(t[e], n, i) : s.fillText(t[e], n, i), n += s.measureText(t[e]).width + c + o;
			return;
		}
		let u = r, d = bw.graphemeSegmenter(e), f = s.measureText(e).width, p = 0;
		for (let e = 0; e < d.length; ++e) {
			let t = d[e];
			a ? s.strokeText(t, u, i) : s.fillText(t, u, i);
			let n = "";
			for (let t = e + 1; t < d.length; ++t) n += d[t];
			p = s.measureText(n).width, u += f - p + c, t === " " && (u += o), f = p;
		}
	}
}();
yn(), L();
var vE = !1;
function yE(e) {
	if (vE) return;
	let t = new vn({ scaleMode: e.scaleMode });
	e._resourceId !== t._resourceId && (vE = !0, I("Text textureStyle: only scaleMode is applied to a text texture, the other fields are ignored"));
}
// node_modules/pixi.js/lib/scene/text/utils/updateTextBounds.mjs
ma();
function bE(e, t) {
	let { texture: n, bounds: r } = e, i = t._style._getFinalPadding();
	pa(r, t._anchor, n);
	let a = t._anchor._x * i * 2, o = t._anchor._y * i * 2;
	r.minX -= i - a, r.minY -= i - o, r.maxX -= i - a, r.maxY -= i - o;
}
// node_modules/pixi.js/lib/scene/text/canvas/BatchableText.mjs
kd();
var xE = class extends Od {};
h(), fm();
var SE = class {
	constructor(e) {
		this._renderer = e, e.runners.resolutionChange.add(this), e.runners.contextChange.add(this), this._managedTexts = new dm({
			renderer: e,
			type: "renderable",
			onUnload: this.onTextUnload.bind(this),
			name: "canvasText"
		});
	}
	resolutionChange() {
		for (let e in this._managedTexts.items) {
			let t = this._managedTexts.items[e];
			t?._autoResolution && t.onViewUpdate();
		}
	}
	contextChange() {
		for (let e in this._managedTexts.items) this._managedTexts.items[e]?.unload();
	}
	validateRenderable(e) {
		let t = this._getGpuText(e), n = e.styleKey;
		return t.currentKey !== n || e._didTextUpdate;
	}
	addRenderable(e, t) {
		let n = this._getGpuText(e);
		if (e._didTextUpdate || n.currentKey !== e.styleKey) {
			let t = e._autoResolution ? this._renderer.resolution : e.resolution;
			(n.currentKey !== e.styleKey || e._resolution !== t) && this._updateGpuText(e), e._didTextUpdate = !1, bE(n, e);
		}
		this._renderer.renderPipes.batch.addToBatch(n, t);
	}
	updateRenderable(e) {
		let t = this._getGpuText(e);
		t._batcher.updateElement(t);
	}
	_updateGpuText(e) {
		let t = this._getGpuText(e);
		t.texture && this._renderer.canvasText.decreaseReferenceCount(t.currentKey), e._resolution = e._autoResolution ? this._renderer.resolution : e.resolution, t.texture = this._renderer.canvasText.getManagedTexture(e), t.currentKey = e.styleKey;
	}
	_getGpuText(e) {
		return e._gpuData[this._renderer.uid] || this.initGpuText(e);
	}
	initGpuText(e) {
		let t = new xE();
		return t.currentKey = "--", t.renderable = e, t.transform = e.groupTransform, t.bounds = {
			minX: 0,
			maxX: 1,
			minY: 0,
			maxY: 0
		}, t.roundPixels = this._renderer._roundPixels | e._roundPixels, e._gpuData[this._renderer.uid] = t, this._managedTexts.add(e), t;
	}
	onTextUnload(e) {
		let t = e._gpuData[this._renderer.uid];
		if (!t) return;
		let { canvasText: n } = this._renderer;
		n.getReferenceCount(t.currentKey) > 0 ? n.decreaseReferenceCount(t.currentKey) : t.texture && n.returnTexture(t.texture);
	}
	destroy() {
		this._managedTexts.destroy(), this._renderer = null;
	}
};
SE.extension = {
	type: [
		d.WebGLPipes,
		d.WebGPUPipes,
		d.CanvasPipes
	],
	name: "text"
}, nr(), Xe(), Ow(), To();
var CE = class {
	constructor(e, t) {
		this._activeTextures = {}, this._renderer = e, this._retainCanvasContext = t;
	}
	getTexture(e, t, n, r) {
		typeof e == "string" && (F("8.0.0", "CanvasTextSystem.getTexture: Use object TextOptions instead of separate arguments"), e = {
			text: e,
			style: n,
			resolution: t
		}), e.style instanceof Dw || (e.style = new Dw(e.style)), typeof e.text != "string" && (e.text = e.text.toString());
		let { text: i, style: a, textureStyle: o, autoGenerateMipmaps: s } = e, c = e.resolution ?? this._renderer.resolution, { frame: l, canvasAndContext: u } = _E.getCanvasAndContext({
			text: i,
			style: a,
			resolution: c
		}), d = Co(u.canvas, l.width, l.height, c, s, o?.scaleMode);
		if (a.trim && (l.pad(a.padding), d.frame.copyFrom(l), d.frame.scale(1 / c), d.updateUvs()), a.filters) {
			let e = this._applyFilters(d, a.filters);
			return this.returnTexture(d), _E.returnCanvasAndContext(u), e;
		}
		return this._renderer.texture.initSource(d._source), this._retainCanvasContext || _E.returnCanvasAndContext(u), d;
	}
	returnTexture(e) {
		let t = e.source, n = t.resource;
		if (this._retainCanvasContext && n?.getContext) {
			let e = n.getContext("2d");
			e && _E.returnCanvasAndContext({
				canvas: n,
				context: e
			});
		}
		t.resource = null, t.uploadMethodId = "unknown", t.alphaMode = "no-premultiply-alpha", tr.returnTexture(e);
	}
	renderTextToCanvas() {
		F("8.10.0", "CanvasTextSystem.renderTextToCanvas: no longer supported, use CanvasTextSystem.getTexture instead");
	}
	getManagedTexture(e) {
		e._resolution = e._autoResolution ? this._renderer.resolution : e.resolution;
		let t = e.styleKey;
		if (this._activeTextures[t]) return this._increaseReferenceCount(t), this._activeTextures[t].texture;
		let n = this.getTexture({
			text: e.text,
			style: e.style,
			resolution: e._resolution,
			textureStyle: e.textureStyle,
			autoGenerateMipmaps: e.autoGenerateMipmaps
		});
		return this._activeTextures[t] = {
			texture: n,
			usageCount: 1
		}, n;
	}
	decreaseReferenceCount(e) {
		let t = this._activeTextures[e];
		t && (t.usageCount--, t.usageCount === 0 && (this.returnTexture(t.texture), this._activeTextures[e] = null));
	}
	getReferenceCount(e) {
		return this._activeTextures[e]?.usageCount ?? 0;
	}
	_increaseReferenceCount(e) {
		this._activeTextures[e].usageCount++;
	}
	_applyFilters(e, t) {
		let n = this._renderer.renderTarget.renderTarget, r = this._renderer.filter.generateFilteredTexture({
			texture: e,
			filters: t
		});
		return this._renderer.renderTarget.bind({
			target: n,
			clear: !1
		}), r;
	}
	destroy() {
		this._renderer = null;
		for (let e in this._activeTextures) this._activeTextures[e] && this.returnTexture(this._activeTextures[e].texture);
		this._activeTextures = null;
	}
};
// node_modules/pixi.js/lib/scene/text/canvas/CanvasTextSystem.mjs
h();
var wE = class extends CE {
	constructor(e) {
		super(e, !0);
	}
};
// node_modules/pixi.js/lib/scene/text/shared/GpuTextSystem.mjs
wE.extension = {
	type: [d.CanvasSystem],
	name: "canvasText"
}, h();
var TE = class extends CE {
	constructor(e) {
		super(e, !1);
	}
};
TE.extension = {
	type: [d.WebGLSystem, d.WebGPUSystem],
	name: "canvasText"
}, h(), m.add(wE), m.add(TE), m.add(SE), wn(), yn(), xw(), Ow();
var EE = class extends sE {
	constructor(...e) {
		let t = cE(e, "Text");
		super(t, Dw), this.renderPipeId = "text", t.textureStyle && (this.textureStyle = t.textureStyle instanceof vn ? t.textureStyle : new vn(t.textureStyle), yE(this.textureStyle)), this.autoGenerateMipmaps = t.autoGenerateMipmaps ?? Cn.defaultOptions.autoGenerateMipmaps;
	}
	updateBounds() {
		let e = this._bounds, t = this._anchor, n = 0, r = 0;
		if (this._style.trim) {
			let { frame: e, canvasAndContext: t } = _E.getCanvasAndContext({
				text: this.text,
				style: this._style,
				resolution: 1
			});
			_E.returnCanvasAndContext(t), n = e.width, r = e.height;
		} else {
			let e = bw.measureText(this._text, this._style);
			n = e.width, r = e.height;
		}
		e.minX = -t._x * n, e.maxX = e.minX + n, e.minY = -t._y * r, e.maxY = e.minY + r;
	}
};
h(), qa(), fa(), wt(), V(), Ka(), dr(), Ry(), qS(), ga(), y(), m.add(Wc, qc);
// shared/fx-tester.ts
function DE() {
	try {
		return new URLSearchParams(location.search).has("fx");
	} catch {
		return !1;
	}
}
function OE(e, t = "#2fd0ff") {
	if (!DE() || document.getElementById("fx-panel")) return;
	let n = document.createElement("style");
	n.textContent = `
#fx-panel { position: fixed; left: 10px; top: 10px; z-index: 2147483000; font: 600 13px/1.3 system-ui, -apple-system, sans-serif; }
#fx-toggle { font: inherit; font-weight: 700; cursor: pointer; background: rgba(8,12,30,.92); color: ${t};
  border: 2px solid ${t}; border-radius: 8px; padding: 6px 12px; }
#fx-list { display: none; flex-direction: column; gap: 4px; margin-top: 6px; max-height: 72vh; overflow-y: auto;
  background: rgba(6,10,26,.95); border: 1px solid ${t}; border-radius: 8px; padding: 6px; }
#fx-list.open { display: flex; }
#fx-list button { font: inherit; cursor: pointer; text-align: left; white-space: nowrap;
  background: rgba(255,255,255,.07); color: #e8f1ff; border: 1px solid rgba(255,255,255,.18);
  border-radius: 6px; padding: 5px 10px; }
#fx-list button:hover { background: rgba(255,255,255,.17); }
#fx-panel button:focus-visible { outline: 2px solid #ffd54a; outline-offset: 2px; }`, document.head.appendChild(n);
	let r = document.createElement("div");
	r.id = "fx-panel";
	let i = document.createElement("button");
	i.type = "button", i.id = "fx-toggle", i.textContent = "FX";
	let a = document.createElement("div");
	a.id = "fx-list", r.append(i, a), document.body.appendChild(r);
	let o = !1;
	i.onclick = () => {
		if (!o) {
			let t = kE(e);
			if (o = t.length > 0, a.textContent = "", !o) {
				let e = document.createElement("div");
				e.style.cssText = "max-width:220px;white-space:normal;padding:4px 6px;color:#9fb0cc;font-weight:500", e.textContent = "The game has not finished starting. Some games need a lobby (open with ?brand=). Reopen this panel once it has.", a.appendChild(e);
			}
			for (let e of t) {
				let t = document.createElement("button");
				t.type = "button", t.textContent = e.label, t.onclick = () => {
					try {
						Promise.resolve(e.run()).catch((t) => console.error("[fx]", e.label, t));
					} catch (t) {
						console.error("[fx]", e.label, t);
					}
				}, a.appendChild(t);
			}
		}
		a.classList.toggle("open");
	};
}
function kE(e) {
	try {
		return e();
	} catch (e) {
		return console.error("[fx] building the case list failed", e), [];
	}
}
var AE = {
	_doc: "Art slots the game reads. Each slot lists asset names in priority order: the first is the final asset the art process ships (packed spritesheet or plate, by manifest id); later names are rendered stand-ins already on disk. A slot that resolves to nothing is left empty (never drawn with programmer shapes). scripts/sync_assets.py reports waiting slots.",
	slots: {
		ball: [
			"ball",
			"BALL",
			"M2"
		],
		pin: [
			"pin",
			"PIN_CAP",
			"PIN"
		],
		starlift: ["starlift", "STL"],
		funnel: ["FUN"],
		hatchFrame: ["HATF"],
		lcdBezel: ["lcd_bezel", "LCD"],
		halo: ["halo", "HALO"],
		dock: ["dock", "DOCK"],
		dial: ["power_dial", "DIAL"],
		push: ["push_button", "PUSH"],
		crown: ["CRN"],
		nova: ["mascot_nova", "NOVA"],
		lyra: ["pilot_lyra", "LYRA"],
		orbi: ["orbi", "ORBI"],
		satellite: ["satellite", "SAT"],
		gyro: ["gyro", "GYRO"],
		pillar: ["PIL"],
		beacon: ["BEACON"],
		asteroid: ["asteroid", "AST"],
		drone: ["drone", "DRONE"],
		sy0: ["sym_planet", "SY_PLANET"],
		sy1: ["sym_rocket", "SY_ROCKET"],
		sy2: ["sym_comet", "SY_COMET"],
		sy3: ["sym_sat", "SY_SAT"],
		sy4: ["sym_ufo", "SY_UFO"],
		sy5: ["sym_crystal", "SY_CRYSTAL"],
		sy6: ["sym_helmet", "SY_HELMET"],
		sy7: ["sym_star", "SY_STAR"],
		sy8: ["sym_bolt", "SY_BOLT"],
		capsule: [
			"capsule",
			"CAPSULE",
			"H15",
			"AST"
		],
		lamp: [
			"pending_lamp",
			"LAMP",
			"M24",
			"BEACON"
		],
		gauge: [
			"thrust_gauge",
			"GAUGE",
			"M25",
			"DIAL"
		],
		plateReach: ["UI31"],
		platePush: ["UI32"],
		plateLiftoff: ["UI33"],
		plateRound: ["UI34"],
		reelCard: ["reel_card", "UI35"],
		plateReady: ["UI36"],
		numerals: [
			"num_cyan",
			"NUMERALS",
			"PLx"
		],
		bgField: ["backplate_normal", "BG_FIELD"],
		bgFever: ["backplate_fever", "BG_FEVER"],
		lcdIdle: ["bg_idle", "LCD_IDLE"],
		lcdReel: ["bg_reel", "LCD_REEL"],
		lcdReachA: ["bg_reach_magenta", "LCD_REACH_A"],
		lcdReachB: ["bg_reach_b", "LCD_REACH_B"],
		lcdFever: ["bg_fever", "LCD_FEVER"],
		lcdGet: ["bg_get", "LCD_GET"],
		lcdEnd: ["bg_end", "LCD_END"],
		cutBg: ["bg_cutin", "CUT_BG"],
		lobby: ["lobby_p", "LOBBY_P"],
		lobbyWide: ["lobby_l", "LOBBY_L"],
		tile: ["tile", "TILE_BG"],
		hatch: ["hatch"],
		lcdReachQuick: ["bg_reach_blue", "LCD_REACH_A"],
		lcdReachStep: ["bg_reach_green", "LCD_REACH_A"],
		vfxSpark: ["spark_impact"],
		vfxShock: ["gate_shockwave"],
		vfxPocket: ["pocket_burst"],
		vfxReachGlow: ["reach_glow"],
		vfxFeverBurst: ["fever_explosion"],
		vfxShower: ["light_shower"],
		vfxConfetti: ["confetti_stars"],
		reachBanner: ["reach_banner"],
		vfxBolt: ["escalation_bolt"],
		vfxExhaust: ["gauge_exhaust"],
		vfxTrail: ["lifter_trail"],
		vfxLiftoff: ["liftoff_burst"],
		vfxWipe: ["round_wipe"],
		pinHead: ["pin_head", "PIN_HEAD"],
		btnPlay: ["btn_play"],
		btnPlayDown: ["btn_play_down"],
		btnGhost: ["btn_ghost"],
		btnGhostDown: ["btn_ghost_down"],
		btnAlt: ["btn_alt"],
		btnAltDown: ["btn_alt_down"],
		btnRound: ["btn_round"],
		cardLiftoff: ["liftoff_card"],
		cardGet: ["get_plate"],
		cardReady: ["ready_plate"],
		cardPush: ["push_prompt"],
		ledStrip: ["led_strip"],
		numFever: ["num_fever"],
		roundCard: ["round_plate"],
		titleLogo: ["title_logo"],
		cardMission: ["mission_complete"],
		hatchDoor: ["HATD"]
	},
	audio: /* @__PURE__ */ "mus_lobby.mus_normal.mus_reach_1.mus_reach_2.mus_reach_3.mus_fever.sfx_ball_roll.sfx_clatter_heavy.sfx_clatter_light.sfx_crack_creak.sfx_crack_shatter.sfx_drain.sfx_end_stinger.sfx_fever_siren.sfx_gate_close.sfx_gate_open.sfx_get_tick.sfx_get_total.sfx_gyro_whoosh.sfx_lifter_hum.sfx_lifter_surge.sfx_liftoff_fanfare.sfx_mash_rev.sfx_mash_tap.sfx_pocket_chime.sfx_push_click.sfx_reach_alert.sfx_reach_miss.sfx_reel_spin.sfx_round_fanfare.sfx_round_slam.sfx_satellite_ping.sfx_stepup_whoosh.sfx_thrust_burst.sfx_ui_back.sfx_ui_click.sfx_ui_error.sfx_ui_hover.sfx_pin_01.sfx_pin_02.sfx_pin_03.sfx_pin_04.sfx_pin_05.sfx_pin_06.sfx_pin_07.sfx_pin_08.sfx_pin_09.sfx_pin_10.sfx_pin_11.sfx_pin_12.sfx_launch_1.sfx_launch_2.sfx_launch_3.sfx_reel_stop_1.sfx_reel_stop_2.sfx_reel_stop_3.sfx_hatch_entry_1.sfx_hatch_entry_2.sfx_hatch_entry_3.sfx_hatch_entry_4.sfx_hatch_entry_5.sfx_reach_sting_1.sfx_reach_sting_2.sfx_reach_sting_3".split(".")
}, jE = class {
	resolved = /* @__PURE__ */ new Map();
	urls = /* @__PURE__ */ new Map();
	async load(e = () => void 0) {
		let t = { slots: {} };
		try {
			t = await (await fetch("art/index.json")).json();
		} catch {}
		let n = Object.entries(AE.slots), r = 0;
		await Promise.all(n.map(async ([i, a]) => {
			let o = a.find((e) => t.slots[e]);
			if (o) {
				let e = t.slots[o];
				this.urls.set(i, e.thumb ?? e.url);
				try {
					if (e.kind === "sheet") {
						let t = await iE.load(e.url), n = {}, r = { ...t.textures };
						for (let e of t.linkedSheets ?? []) Object.assign(r, e.textures);
						let a = t.data.animations ?? {};
						for (let [e, t] of Object.entries(a)) n[e] = t.map((e) => r[e]).filter((e) => !!e);
						let s = Object.values(r);
						this.resolved.set(i, {
							name: o,
							source: e.source,
							frames: s,
							anims: n
						});
					} else {
						let t = await iE.load(e.url);
						t.source.scaleMode = "linear", this.resolved.set(i, {
							name: o,
							source: e.source,
							frames: [t],
							anims: {}
						});
					}
				} catch {}
			}
			r++, e(r / n.length);
		}));
	}
	has(e) {
		return this.resolved.has(e);
	}
	tex(e, t) {
		let n = this.resolved.get(e);
		return n ? t && n.anims[t]?.length ? n.anims[t][0] : Object.values(n.anims)[0]?.[0] ?? n.frames[0] ?? B.EMPTY : B.EMPTY;
	}
	frames(e, t) {
		let n = this.resolved.get(e);
		return n ? t && n.anims[t] ? n.anims[t] : Object.values(n.anims)[0] ?? n.frames : [];
	}
	url(e) {
		return this.urls.get(e);
	}
	crop(e, t, n, r, i) {
		let a = this.tex(e);
		if (a === B.EMPTY) return a;
		let o = a.frame;
		return new B({
			source: a.source,
			frame: new R(o.x + o.width * t, o.y + o.height * n, o.width * r, o.height * i)
		});
	}
	report() {
		let e = {};
		for (let t of Object.keys(AE.slots)) {
			let n = this.resolved.get(t);
			e[t] = {
				using: n?.name,
				source: n?.source,
				final: n?.source === "final"
			};
		}
		return e;
	}
}, ME = (/* @__PURE__ */ s(((e) => {
	(function() {
		var t = function() {
			this.init();
		};
		t.prototype = {
			init: function() {
				var e = this || n;
				return e._counter = 1e3, e._html5AudioPool = [], e.html5PoolSize = 10, e._codecs = {}, e._howls = [], e._muted = !1, e._volume = 1, e._canPlayEvent = "canplaythrough", e._navigator = typeof window < "u" && window.navigator ? window.navigator : null, e.masterGain = null, e.noAudio = !1, e.usingWebAudio = !0, e.autoSuspend = !0, e.ctx = null, e.autoUnlock = !0, e._setup(), e;
			},
			volume: function(e) {
				var t = this || n;
				if (e = parseFloat(e), t.ctx || u(), e !== void 0 && e >= 0 && e <= 1) {
					if (t._volume = e, t._muted) return t;
					t.usingWebAudio && t.masterGain.gain.setValueAtTime(e, n.ctx.currentTime);
					for (var r = 0; r < t._howls.length; r++) if (!t._howls[r]._webAudio) for (var i = t._howls[r]._getSoundIds(), a = 0; a < i.length; a++) {
						var o = t._howls[r]._soundById(i[a]);
						o && o._node && (o._node.volume = o._volume * e);
					}
					return t;
				}
				return t._volume;
			},
			mute: function(e) {
				var t = this || n;
				t.ctx || u(), t._muted = e, t.usingWebAudio && t.masterGain.gain.setValueAtTime(e ? 0 : t._volume, n.ctx.currentTime);
				for (var r = 0; r < t._howls.length; r++) if (!t._howls[r]._webAudio) for (var i = t._howls[r]._getSoundIds(), a = 0; a < i.length; a++) {
					var o = t._howls[r]._soundById(i[a]);
					o && o._node && (o._node.muted = e ? !0 : o._muted);
				}
				return t;
			},
			stop: function() {
				for (var e = this || n, t = 0; t < e._howls.length; t++) e._howls[t].stop();
				return e;
			},
			unload: function() {
				for (var e = this || n, t = e._howls.length - 1; t >= 0; t--) e._howls[t].unload();
				return e.usingWebAudio && e.ctx && e.ctx.close !== void 0 && (e.ctx.close(), e.ctx = null, u()), e;
			},
			codecs: function(e) {
				return (this || n)._codecs[e.replace(/^x-/, "")];
			},
			_setup: function() {
				var e = this || n;
				if (e.state = e.ctx && e.ctx.state || "suspended", e._autoSuspend(), !e.usingWebAudio) {
					if (typeof Audio < "u") try {
						var t = new Audio();
						t.oncanplaythrough === void 0 && (e._canPlayEvent = "canplay");
					} catch {
						e.noAudio = !0;
					}
					else e.noAudio = !0;
				}
				try {
					var t = new Audio();
					t.muted && (e.noAudio = !0);
				} catch {}
				return e.noAudio || e._setupCodecs(), e;
			},
			_setupCodecs: function() {
				var e = this || n, t = null;
				try {
					t = typeof Audio < "u" ? new Audio() : null;
				} catch {
					return e;
				}
				if (!t || typeof t.canPlayType != "function") return e;
				var r = t.canPlayType("audio/mpeg;").replace(/^no$/, ""), i = e._navigator ? e._navigator.userAgent : "", a = i.match(/OPR\/(\d+)/g), o = a && parseInt(a[0].split("/")[1], 10) < 33, s = i.indexOf("Safari") !== -1 && i.indexOf("Chrome") === -1, c = i.match(/Version\/(.*?) /), l = s && c && parseInt(c[1], 10) < 15;
				return e._codecs = {
					mp3: !(o || !r && !t.canPlayType("audio/mp3;").replace(/^no$/, "")),
					mpeg: !!r,
					opus: !!t.canPlayType("audio/ogg; codecs=\"opus\"").replace(/^no$/, ""),
					ogg: !!t.canPlayType("audio/ogg; codecs=\"vorbis\"").replace(/^no$/, ""),
					oga: !!t.canPlayType("audio/ogg; codecs=\"vorbis\"").replace(/^no$/, ""),
					wav: !!(t.canPlayType("audio/wav; codecs=\"1\"") || t.canPlayType("audio/wav")).replace(/^no$/, ""),
					aac: !!t.canPlayType("audio/aac;").replace(/^no$/, ""),
					caf: !!t.canPlayType("audio/x-caf;").replace(/^no$/, ""),
					m4a: !!(t.canPlayType("audio/x-m4a;") || t.canPlayType("audio/m4a;") || t.canPlayType("audio/aac;")).replace(/^no$/, ""),
					m4b: !!(t.canPlayType("audio/x-m4b;") || t.canPlayType("audio/m4b;") || t.canPlayType("audio/aac;")).replace(/^no$/, ""),
					mp4: !!(t.canPlayType("audio/x-mp4;") || t.canPlayType("audio/mp4;") || t.canPlayType("audio/aac;")).replace(/^no$/, ""),
					weba: !(l || !t.canPlayType("audio/webm; codecs=\"vorbis\"").replace(/^no$/, "")),
					webm: !(l || !t.canPlayType("audio/webm; codecs=\"vorbis\"").replace(/^no$/, "")),
					dolby: !!t.canPlayType("audio/mp4; codecs=\"ec-3\"").replace(/^no$/, ""),
					flac: !!(t.canPlayType("audio/x-flac;") || t.canPlayType("audio/flac;")).replace(/^no$/, "")
				}, e;
			},
			_unlockAudio: function() {
				var e = this || n;
				if (!e._audioUnlocked && e.ctx) {
					e._audioUnlocked = !1, e.autoUnlock = !1, !e._mobileUnloaded && e.ctx.sampleRate !== 44100 && (e._mobileUnloaded = !0, e.unload()), e._scratchBuffer = e.ctx.createBuffer(1, 1, 22050);
					var t = function(n) {
						for (; e._html5AudioPool.length < e.html5PoolSize;) try {
							var r = new Audio();
							r._unlocked = !0, e._releaseHtml5Audio(r);
						} catch {
							e.noAudio = !0;
							break;
						}
						for (var i = 0; i < e._howls.length; i++) if (!e._howls[i]._webAudio) for (var a = e._howls[i]._getSoundIds(), o = 0; o < a.length; o++) {
							var s = e._howls[i]._soundById(a[o]);
							s && s._node && !s._node._unlocked && (s._node._unlocked = !0, s._node.load());
						}
						e._autoResume();
						var c = e.ctx.createBufferSource();
						c.buffer = e._scratchBuffer, c.connect(e.ctx.destination), c.start === void 0 ? c.noteOn(0) : c.start(0), typeof e.ctx.resume == "function" && e.ctx.resume(), c.onended = function() {
							c.disconnect(0), e._audioUnlocked = !0, document.removeEventListener("touchstart", t, !0), document.removeEventListener("touchend", t, !0), document.removeEventListener("click", t, !0), document.removeEventListener("keydown", t, !0);
							for (var n = 0; n < e._howls.length; n++) e._howls[n]._emit("unlock");
						};
					};
					return document.addEventListener("touchstart", t, !0), document.addEventListener("touchend", t, !0), document.addEventListener("click", t, !0), document.addEventListener("keydown", t, !0), e;
				}
			},
			_obtainHtml5Audio: function() {
				var e = this || n;
				if (e._html5AudioPool.length) return e._html5AudioPool.pop();
				var t = new Audio().play();
				return t && typeof Promise < "u" && (t instanceof Promise || typeof t.then == "function") && t.catch(function() {
					console.warn("HTML5 Audio pool exhausted, returning potentially locked audio object.");
				}), new Audio();
			},
			_releaseHtml5Audio: function(e) {
				var t = this || n;
				return e._unlocked && t._html5AudioPool.push(e), t;
			},
			_autoSuspend: function() {
				var e = this;
				if (e.autoSuspend && e.ctx && e.ctx.suspend !== void 0 && n.usingWebAudio) {
					for (var t = 0; t < e._howls.length; t++) if (e._howls[t]._webAudio) {
						for (var r = 0; r < e._howls[t]._sounds.length; r++) if (!e._howls[t]._sounds[r]._paused) return e;
					}
					return e._suspendTimer && clearTimeout(e._suspendTimer), e._suspendTimer = setTimeout(function() {
						if (e.autoSuspend) {
							e._suspendTimer = null, e.state = "suspending";
							var t = function() {
								e.state = "suspended", e._resumeAfterSuspend && (delete e._resumeAfterSuspend, e._autoResume());
							};
							e.ctx.suspend().then(t, t);
						}
					}, 3e4), e;
				}
			},
			_autoResume: function() {
				var e = this;
				if (e.ctx && e.ctx.resume !== void 0 && n.usingWebAudio) return e.state === "running" && e.ctx.state !== "interrupted" && e._suspendTimer ? (clearTimeout(e._suspendTimer), e._suspendTimer = null) : e.state === "suspended" || e.state === "running" && e.ctx.state === "interrupted" ? (e.ctx.resume().then(function() {
					e.state = "running";
					for (var t = 0; t < e._howls.length; t++) e._howls[t]._emit("resume");
				}), e._suspendTimer &&= (clearTimeout(e._suspendTimer), null)) : e.state === "suspending" && (e._resumeAfterSuspend = !0), e;
			}
		};
		var n = new t(), r = function(e) {
			var t = this;
			!e.src || e.src.length === 0 ? console.error("An array of source files must be passed with any new Howl.") : t.init(e);
		};
		r.prototype = {
			init: function(e) {
				var t = this;
				return n.ctx || u(), t._autoplay = e.autoplay || !1, t._format = typeof e.format == "string" ? [e.format] : e.format, t._html5 = e.html5 || !1, t._muted = e.mute || !1, t._loop = e.loop || !1, t._pool = e.pool || 5, t._preload = typeof e.preload == "boolean" || e.preload === "metadata" ? e.preload : !0, t._rate = e.rate || 1, t._sprite = e.sprite || {}, t._src = typeof e.src == "string" ? [e.src] : e.src, t._volume = e.volume === void 0 ? 1 : e.volume, t._xhr = {
					method: e.xhr && e.xhr.method ? e.xhr.method : "GET",
					headers: e.xhr && e.xhr.headers ? e.xhr.headers : null,
					withCredentials: e.xhr && e.xhr.withCredentials ? e.xhr.withCredentials : !1
				}, t._duration = 0, t._state = "unloaded", t._sounds = [], t._endTimers = {}, t._queue = [], t._playLock = !1, t._onend = e.onend ? [{ fn: e.onend }] : [], t._onfade = e.onfade ? [{ fn: e.onfade }] : [], t._onload = e.onload ? [{ fn: e.onload }] : [], t._onloaderror = e.onloaderror ? [{ fn: e.onloaderror }] : [], t._onplayerror = e.onplayerror ? [{ fn: e.onplayerror }] : [], t._onpause = e.onpause ? [{ fn: e.onpause }] : [], t._onplay = e.onplay ? [{ fn: e.onplay }] : [], t._onstop = e.onstop ? [{ fn: e.onstop }] : [], t._onmute = e.onmute ? [{ fn: e.onmute }] : [], t._onvolume = e.onvolume ? [{ fn: e.onvolume }] : [], t._onrate = e.onrate ? [{ fn: e.onrate }] : [], t._onseek = e.onseek ? [{ fn: e.onseek }] : [], t._onunlock = e.onunlock ? [{ fn: e.onunlock }] : [], t._onresume = [], t._webAudio = n.usingWebAudio && !t._html5, n.ctx !== void 0 && n.ctx && n.autoUnlock && n._unlockAudio(), n._howls.push(t), t._autoplay && t._queue.push({
					event: "play",
					action: function() {
						t.play();
					}
				}), t._preload && t._preload !== "none" && t.load(), t;
			},
			load: function() {
				var e = this, t = null;
				if (n.noAudio) e._emit("loaderror", null, "No audio support.");
				else {
					typeof e._src == "string" && (e._src = [e._src]);
					for (var r = 0; r < e._src.length; r++) {
						var a, s;
						if (e._format && e._format[r]) a = e._format[r];
						else {
							if (s = e._src[r], typeof s != "string") {
								e._emit("loaderror", null, "Non-string found in selected audio sources - ignoring.");
								continue;
							}
							a = /^data:audio\/([^;,]+);/i.exec(s), a ||= /\.([^.]+)$/.exec(s.split("?", 1)[0]), a &&= a[1].toLowerCase();
						}
						if (a || console.warn("No file extension was found. Consider using the \"format\" property or specify an extension."), a && n.codecs(a)) {
							t = e._src[r];
							break;
						}
					}
					if (!t) e._emit("loaderror", null, "No codec support for selected audio sources.");
					else return e._src = t, e._state = "loading", window.location.protocol === "https:" && t.slice(0, 5) === "http:" && (e._html5 = !0, e._webAudio = !1), new i(e), e._webAudio && o(e), e;
				}
			},
			play: function(e, t) {
				var r = this, i = null;
				if (typeof e == "number") i = e, e = null;
				else if (typeof e == "string" && r._state === "loaded" && !r._sprite[e]) return null;
				else if (e === void 0 && (e = "__default", !r._playLock)) {
					for (var a = 0, o = 0; o < r._sounds.length; o++) r._sounds[o]._paused && !r._sounds[o]._ended && (a++, i = r._sounds[o]._id);
					a === 1 ? e = null : i = null;
				}
				var s = i ? r._soundById(i) : r._inactiveSound();
				if (!s) return null;
				if (i && !e && (e = s._sprite || "__default"), r._state !== "loaded") {
					s._sprite = e, s._ended = !1;
					var c = s._id;
					return r._queue.push({
						event: "play",
						action: function() {
							r.play(c);
						}
					}), c;
				}
				if (i && !s._paused) return t || r._loadQueue("play"), s._id;
				r._webAudio && n._autoResume();
				var l = Math.max(0, s._seek > 0 ? s._seek : r._sprite[e][0] / 1e3), u = Math.max(0, (r._sprite[e][0] + r._sprite[e][1]) / 1e3 - l), d = u * 1e3 / Math.abs(s._rate), f = r._sprite[e][0] / 1e3, p = (r._sprite[e][0] + r._sprite[e][1]) / 1e3;
				s._sprite = e, s._ended = !1;
				var m = function() {
					s._paused = !1, s._seek = l, s._start = f, s._stop = p, s._loop = !!(s._loop || r._sprite[e][2]);
				};
				if (l >= p) r._ended(s);
				else {
					var h = s._node;
					if (r._webAudio) {
						var g = function() {
							r._playLock = !1, m(), r._refreshBuffer(s);
							var e = s._muted || r._muted ? 0 : s._volume;
							h.gain.setValueAtTime(e, n.ctx.currentTime), s._playStart = n.ctx.currentTime, h.bufferSource.start === void 0 ? s._loop ? h.bufferSource.noteGrainOn(0, l, 86400) : h.bufferSource.noteGrainOn(0, l, u) : s._loop ? h.bufferSource.start(0, l, 86400) : h.bufferSource.start(0, l, u), d !== Infinity && (r._endTimers[s._id] = setTimeout(r._ended.bind(r, s), d)), t || setTimeout(function() {
								r._emit("play", s._id), r._loadQueue();
							}, 0);
						};
						n.state === "running" && n.ctx.state !== "interrupted" ? g() : (r._playLock = !0, r.once("resume", g), r._clearTimer(s._id));
					} else {
						var _ = function() {
							h.currentTime = l, h.muted = s._muted || r._muted || n._muted || h.muted, h.volume = s._volume * n.volume(), h.playbackRate = s._rate;
							try {
								var i = h.play();
								if (i && typeof Promise < "u" && (i instanceof Promise || typeof i.then == "function") ? (r._playLock = !0, m(), i.then(function() {
									r._playLock = !1, h._unlocked = !0, t ? r._loadQueue() : r._emit("play", s._id);
								}).catch(function() {
									r._playLock = !1, r._emit("playerror", s._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction."), s._ended = !0, s._paused = !0;
								})) : t || (r._playLock = !1, m(), r._emit("play", s._id)), h.playbackRate = s._rate, h.paused) {
									r._emit("playerror", s._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
									return;
								}
								e !== "__default" || s._loop ? r._endTimers[s._id] = setTimeout(r._ended.bind(r, s), d) : (r._endTimers[s._id] = function() {
									r._ended(s), h.removeEventListener("ended", r._endTimers[s._id], !1);
								}, h.addEventListener("ended", r._endTimers[s._id], !1));
							} catch (e) {
								r._emit("playerror", s._id, e);
							}
						};
						h.src === "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA" && (h.src = r._src, h.load());
						var v = window && window.ejecta || !h.readyState && n._navigator.isCocoonJS;
						if (h.readyState >= 3 || v) _();
						else {
							r._playLock = !0, r._state = "loading";
							var y = function() {
								r._state = "loaded", _(), h.removeEventListener(n._canPlayEvent, y, !1);
							};
							h.addEventListener(n._canPlayEvent, y, !1), r._clearTimer(s._id);
						}
					}
					return s._id;
				}
			},
			pause: function(e) {
				var t = this;
				if (t._state !== "loaded" || t._playLock) return t._queue.push({
					event: "pause",
					action: function() {
						t.pause(e);
					}
				}), t;
				for (var n = t._getSoundIds(e), r = 0; r < n.length; r++) {
					t._clearTimer(n[r]);
					var i = t._soundById(n[r]);
					if (i && !i._paused && (i._seek = t.seek(n[r]), i._rateSeek = 0, i._paused = !0, t._stopFade(n[r]), i._node)) {
						if (t._webAudio) {
							if (!i._node.bufferSource) continue;
							i._node.bufferSource.stop === void 0 ? i._node.bufferSource.noteOff(0) : i._node.bufferSource.stop(0), t._cleanBuffer(i._node);
						} else isNaN(i._node.duration) && i._node.duration !== Infinity || i._node.pause();
					}
					arguments[1] || t._emit("pause", i ? i._id : null);
				}
				return t;
			},
			stop: function(e, t) {
				var n = this;
				if (n._state !== "loaded" || n._playLock) return n._queue.push({
					event: "stop",
					action: function() {
						n.stop(e);
					}
				}), n;
				for (var r = n._getSoundIds(e), i = 0; i < r.length; i++) {
					n._clearTimer(r[i]);
					var a = n._soundById(r[i]);
					a && (a._seek = a._start || 0, a._rateSeek = 0, a._paused = !0, a._ended = !0, n._stopFade(r[i]), a._node && (n._webAudio ? a._node.bufferSource && (a._node.bufferSource.stop === void 0 ? a._node.bufferSource.noteOff(0) : a._node.bufferSource.stop(0), n._cleanBuffer(a._node)) : isNaN(a._node.duration) && a._node.duration !== Infinity || (a._node.currentTime = a._start || 0, a._node.pause(), a._node.duration === Infinity && n._clearSound(a._node))), t || n._emit("stop", a._id));
				}
				return n;
			},
			mute: function(e, t) {
				var r = this;
				if (r._state !== "loaded" || r._playLock) return r._queue.push({
					event: "mute",
					action: function() {
						r.mute(e, t);
					}
				}), r;
				if (t === void 0) {
					if (typeof e == "boolean") r._muted = e;
					else return r._muted;
				}
				for (var i = r._getSoundIds(t), a = 0; a < i.length; a++) {
					var o = r._soundById(i[a]);
					o && (o._muted = e, o._interval && r._stopFade(o._id), r._webAudio && o._node ? o._node.gain.setValueAtTime(e ? 0 : o._volume, n.ctx.currentTime) : o._node && (o._node.muted = n._muted ? !0 : e), r._emit("mute", o._id));
				}
				return r;
			},
			volume: function() {
				var e = this, t = arguments, r, i;
				if (t.length === 0) return e._volume;
				t.length === 1 || t.length === 2 && t[1] === void 0 ? e._getSoundIds().indexOf(t[0]) >= 0 ? i = parseInt(t[0], 10) : r = parseFloat(t[0]) : t.length >= 2 && (r = parseFloat(t[0]), i = parseInt(t[1], 10));
				var a;
				if (r !== void 0 && r >= 0 && r <= 1) {
					if (e._state !== "loaded" || e._playLock) return e._queue.push({
						event: "volume",
						action: function() {
							e.volume.apply(e, t);
						}
					}), e;
					i === void 0 && (e._volume = r), i = e._getSoundIds(i);
					for (var o = 0; o < i.length; o++) a = e._soundById(i[o]), a && (a._volume = r, t[2] || e._stopFade(i[o]), e._webAudio && a._node && !a._muted ? a._node.gain.setValueAtTime(r, n.ctx.currentTime) : a._node && !a._muted && (a._node.volume = r * n.volume()), e._emit("volume", a._id));
				} else return a = i ? e._soundById(i) : e._sounds[0], a ? a._volume : 0;
				return e;
			},
			fade: function(e, t, r, i) {
				var a = this;
				if (a._state !== "loaded" || a._playLock) return a._queue.push({
					event: "fade",
					action: function() {
						a.fade(e, t, r, i);
					}
				}), a;
				e = Math.min(Math.max(0, parseFloat(e)), 1), t = Math.min(Math.max(0, parseFloat(t)), 1), r = parseFloat(r), a.volume(e, i);
				for (var o = a._getSoundIds(i), s = 0; s < o.length; s++) {
					var c = a._soundById(o[s]);
					if (c) {
						if (i || a._stopFade(o[s]), a._webAudio && !c._muted) {
							var l = n.ctx.currentTime, u = l + r / 1e3;
							c._volume = e, c._node.gain.setValueAtTime(e, l), c._node.gain.linearRampToValueAtTime(t, u);
						}
						a._startFadeInterval(c, e, t, r, o[s], i === void 0);
					}
				}
				return a;
			},
			_startFadeInterval: function(e, t, n, r, i, a) {
				var o = this, s = t, c = n - t, l = Math.abs(c / .01), u = Math.max(4, l > 0 ? r / l : r), d = Date.now();
				e._fadeTo = n, e._interval = setInterval(function() {
					var i = (Date.now() - d) / r;
					d = Date.now(), s += c * i, s = Math.round(s * 100) / 100, s = c < 0 ? Math.max(n, s) : Math.min(n, s), o._webAudio ? e._volume = s : o.volume(s, e._id, !0), a && (o._volume = s), (n < t && s <= n || n > t && s >= n) && (clearInterval(e._interval), e._interval = null, e._fadeTo = null, o.volume(n, e._id), o._emit("fade", e._id));
				}, u);
			},
			_stopFade: function(e) {
				var t = this, r = t._soundById(e);
				return r && r._interval && (t._webAudio && r._node.gain.cancelScheduledValues(n.ctx.currentTime), clearInterval(r._interval), r._interval = null, t.volume(r._fadeTo, e), r._fadeTo = null, t._emit("fade", e)), t;
			},
			loop: function() {
				var e = this, t = arguments, n, r, i;
				if (t.length === 0) return e._loop;
				if (t.length === 1) {
					if (typeof t[0] == "boolean") n = t[0], e._loop = n;
					else return i = e._soundById(parseInt(t[0], 10)), i ? i._loop : !1;
				} else t.length === 2 && (n = t[0], r = parseInt(t[1], 10));
				for (var a = e._getSoundIds(r), o = 0; o < a.length; o++) i = e._soundById(a[o]), i && (i._loop = n, e._webAudio && i._node && i._node.bufferSource && (i._node.bufferSource.loop = n, n && (i._node.bufferSource.loopStart = i._start || 0, i._node.bufferSource.loopEnd = i._stop, e.playing(a[o]) && (e.pause(a[o], !0), e.play(a[o], !0)))));
				return e;
			},
			rate: function() {
				var e = this, t = arguments, r, i;
				t.length === 0 ? i = e._sounds[0]._id : t.length === 1 ? e._getSoundIds().indexOf(t[0]) >= 0 ? i = parseInt(t[0], 10) : r = parseFloat(t[0]) : t.length === 2 && (r = parseFloat(t[0]), i = parseInt(t[1], 10));
				var a;
				if (typeof r == "number") {
					if (e._state !== "loaded" || e._playLock) return e._queue.push({
						event: "rate",
						action: function() {
							e.rate.apply(e, t);
						}
					}), e;
					i === void 0 && (e._rate = r), i = e._getSoundIds(i);
					for (var o = 0; o < i.length; o++) if (a = e._soundById(i[o]), a) {
						e.playing(i[o]) && (a._rateSeek = e.seek(i[o]), a._playStart = e._webAudio ? n.ctx.currentTime : a._playStart), a._rate = r, e._webAudio && a._node && a._node.bufferSource ? a._node.bufferSource.playbackRate.setValueAtTime(r, n.ctx.currentTime) : a._node && (a._node.playbackRate = r);
						var s = e.seek(i[o]), c = ((e._sprite[a._sprite][0] + e._sprite[a._sprite][1]) / 1e3 - s) * 1e3 / Math.abs(a._rate);
						(e._endTimers[i[o]] || !a._paused) && (e._clearTimer(i[o]), e._endTimers[i[o]] = setTimeout(e._ended.bind(e, a), c)), e._emit("rate", a._id);
					}
				} else return a = e._soundById(i), a ? a._rate : e._rate;
				return e;
			},
			seek: function() {
				var e = this, t = arguments, r, i;
				if (t.length === 0 ? e._sounds.length && (i = e._sounds[0]._id) : t.length === 1 ? e._getSoundIds().indexOf(t[0]) >= 0 ? i = parseInt(t[0], 10) : e._sounds.length && (i = e._sounds[0]._id, r = parseFloat(t[0])) : t.length === 2 && (r = parseFloat(t[0]), i = parseInt(t[1], 10)), i === void 0) return 0;
				if (typeof r == "number" && (e._state !== "loaded" || e._playLock)) return e._queue.push({
					event: "seek",
					action: function() {
						e.seek.apply(e, t);
					}
				}), e;
				var a = e._soundById(i);
				if (a) {
					if (typeof r == "number" && r >= 0) {
						var o = e.playing(i);
						o && e.pause(i, !0), a._seek = r, a._ended = !1, e._clearTimer(i), !e._webAudio && a._node && !isNaN(a._node.duration) && (a._node.currentTime = r);
						var s = function() {
							o && e.play(i, !0), e._emit("seek", i);
						};
						if (o && !e._webAudio) {
							var c = function() {
								e._playLock ? setTimeout(c, 0) : s();
							};
							setTimeout(c, 0);
						} else s();
					} else if (e._webAudio) {
						var l = e.playing(i) ? n.ctx.currentTime - a._playStart : 0, u = a._rateSeek ? a._rateSeek - a._seek : 0;
						return a._seek + (u + l * Math.abs(a._rate));
					} else return a._node.currentTime;
				}
				return e;
			},
			playing: function(e) {
				var t = this;
				if (typeof e == "number") {
					var n = t._soundById(e);
					return n ? !n._paused : !1;
				}
				for (var r = 0; r < t._sounds.length; r++) if (!t._sounds[r]._paused) return !0;
				return !1;
			},
			duration: function(e) {
				var t = this, n = t._duration, r = t._soundById(e);
				return r && (n = t._sprite[r._sprite][1] / 1e3), n;
			},
			state: function() {
				return this._state;
			},
			unload: function() {
				for (var e = this, t = e._sounds, r = 0; r < t.length; r++) t[r]._paused || e.stop(t[r]._id), e._webAudio || (e._clearSound(t[r]._node), t[r]._node.removeEventListener("error", t[r]._errorFn, !1), t[r]._node.removeEventListener(n._canPlayEvent, t[r]._loadFn, !1), t[r]._node.removeEventListener("ended", t[r]._endFn, !1), n._releaseHtml5Audio(t[r]._node)), delete t[r]._node, e._clearTimer(t[r]._id);
				var i = n._howls.indexOf(e);
				i >= 0 && n._howls.splice(i, 1);
				var o = !0;
				for (r = 0; r < n._howls.length; r++) if (n._howls[r]._src === e._src || e._src.indexOf(n._howls[r]._src) >= 0) {
					o = !1;
					break;
				}
				return a && o && delete a[e._src], n.noAudio = !1, e._state = "unloaded", e._sounds = [], e = null, null;
			},
			on: function(e, t, n, r) {
				var i = this, a = i["_on" + e];
				return typeof t == "function" && a.push(r ? {
					id: n,
					fn: t,
					once: r
				} : {
					id: n,
					fn: t
				}), i;
			},
			off: function(e, t, n) {
				var r = this, i = r["_on" + e], a = 0;
				if (typeof t == "number" && (n = t, t = null), t || n) for (a = 0; a < i.length; a++) {
					var o = n === i[a].id;
					if (t === i[a].fn && o || !t && o) {
						i.splice(a, 1);
						break;
					}
				}
				else if (e) r["_on" + e] = [];
				else {
					var s = Object.keys(r);
					for (a = 0; a < s.length; a++) s[a].indexOf("_on") === 0 && Array.isArray(r[s[a]]) && (r[s[a]] = []);
				}
				return r;
			},
			once: function(e, t, n) {
				var r = this;
				return r.on(e, t, n, 1), r;
			},
			_emit: function(e, t, n) {
				for (var r = this, i = r["_on" + e], a = i.length - 1; a >= 0; a--) i[a].id && i[a].id !== t && e !== "load" || (setTimeout(function(e) {
					e.call(this, t, n);
				}.bind(r, i[a].fn), 0), i[a].once && r.off(e, i[a].fn, i[a].id));
				return r._loadQueue(e), r;
			},
			_loadQueue: function(e) {
				var t = this;
				if (t._queue.length > 0) {
					var n = t._queue[0];
					n.event === e && (t._queue.shift(), t._loadQueue()), e || n.action();
				}
				return t;
			},
			_ended: function(e) {
				var t = this, r = e._sprite;
				if (!t._webAudio && e._node && !e._node.paused && !e._node.ended && e._node.currentTime < e._stop) return setTimeout(t._ended.bind(t, e), 100), t;
				var i = !!(e._loop || t._sprite[r][2]);
				if (t._emit("end", e._id), !t._webAudio && i && t.stop(e._id, !0).play(e._id), t._webAudio && i) {
					t._emit("play", e._id), e._seek = e._start || 0, e._rateSeek = 0, e._playStart = n.ctx.currentTime;
					var a = (e._stop - e._start) * 1e3 / Math.abs(e._rate);
					t._endTimers[e._id] = setTimeout(t._ended.bind(t, e), a);
				}
				return t._webAudio && !i && (e._paused = !0, e._ended = !0, e._seek = e._start || 0, e._rateSeek = 0, t._clearTimer(e._id), t._cleanBuffer(e._node), n._autoSuspend()), !t._webAudio && !i && t.stop(e._id, !0), t;
			},
			_clearTimer: function(e) {
				var t = this;
				if (t._endTimers[e]) {
					if (typeof t._endTimers[e] != "function") clearTimeout(t._endTimers[e]);
					else {
						var n = t._soundById(e);
						n && n._node && n._node.removeEventListener("ended", t._endTimers[e], !1);
					}
					delete t._endTimers[e];
				}
				return t;
			},
			_soundById: function(e) {
				for (var t = this, n = 0; n < t._sounds.length; n++) if (e === t._sounds[n]._id) return t._sounds[n];
				return null;
			},
			_inactiveSound: function() {
				var e = this;
				e._drain();
				for (var t = 0; t < e._sounds.length; t++) if (e._sounds[t]._ended) return e._sounds[t].reset();
				return new i(e);
			},
			_drain: function() {
				var e = this, t = e._pool, n = 0, r = 0;
				if (!(e._sounds.length < t)) {
					for (r = 0; r < e._sounds.length; r++) e._sounds[r]._ended && n++;
					for (r = e._sounds.length - 1; r >= 0; r--) {
						if (n <= t) return;
						e._sounds[r]._ended && (e._webAudio && e._sounds[r]._node && e._sounds[r]._node.disconnect(0), e._sounds.splice(r, 1), n--);
					}
				}
			},
			_getSoundIds: function(e) {
				var t = this;
				if (e === void 0) {
					for (var n = [], r = 0; r < t._sounds.length; r++) n.push(t._sounds[r]._id);
					return n;
				}
				return [e];
			},
			_refreshBuffer: function(e) {
				var t = this;
				return e._node.bufferSource = n.ctx.createBufferSource(), e._node.bufferSource.buffer = a[t._src], e._panner ? e._node.bufferSource.connect(e._panner) : e._node.bufferSource.connect(e._node), e._node.bufferSource.loop = e._loop, e._loop && (e._node.bufferSource.loopStart = e._start || 0, e._node.bufferSource.loopEnd = e._stop || 0), e._node.bufferSource.playbackRate.setValueAtTime(e._rate, n.ctx.currentTime), t;
			},
			_cleanBuffer: function(e) {
				var t = this, r = n._navigator && n._navigator.vendor.indexOf("Apple") >= 0;
				if (!e.bufferSource) return t;
				if (n._scratchBuffer && e.bufferSource && (e.bufferSource.onended = null, e.bufferSource.disconnect(0), r)) try {
					e.bufferSource.buffer = n._scratchBuffer;
				} catch {}
				return e.bufferSource = null, t;
			},
			_clearSound: function(e) {
				/MSIE |Trident\//.test(n._navigator && n._navigator.userAgent) || (e.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
			}
		};
		var i = function(e) {
			this._parent = e, this.init();
		};
		i.prototype = {
			init: function() {
				var e = this, t = e._parent;
				return e._muted = t._muted, e._loop = t._loop, e._volume = t._volume, e._rate = t._rate, e._seek = 0, e._paused = !0, e._ended = !0, e._sprite = "__default", e._id = ++n._counter, t._sounds.push(e), e.create(), e;
			},
			create: function() {
				var e = this, t = e._parent, r = n._muted || e._muted || e._parent._muted ? 0 : e._volume;
				return t._webAudio ? (e._node = n.ctx.createGain === void 0 ? n.ctx.createGainNode() : n.ctx.createGain(), e._node.gain.setValueAtTime(r, n.ctx.currentTime), e._node.paused = !0, e._node.connect(n.masterGain)) : n.noAudio || (e._node = n._obtainHtml5Audio(), e._errorFn = e._errorListener.bind(e), e._node.addEventListener("error", e._errorFn, !1), e._loadFn = e._loadListener.bind(e), e._node.addEventListener(n._canPlayEvent, e._loadFn, !1), e._endFn = e._endListener.bind(e), e._node.addEventListener("ended", e._endFn, !1), e._node.src = t._src, e._node.preload = t._preload === !0 ? "auto" : t._preload, e._node.volume = r * n.volume(), e._node.load()), e;
			},
			reset: function() {
				var e = this, t = e._parent;
				return e._muted = t._muted, e._loop = t._loop, e._volume = t._volume, e._rate = t._rate, e._seek = 0, e._rateSeek = 0, e._paused = !0, e._ended = !0, e._sprite = "__default", e._id = ++n._counter, e;
			},
			_errorListener: function() {
				var e = this;
				e._parent._emit("loaderror", e._id, e._node.error ? e._node.error.code : 0), e._node.removeEventListener("error", e._errorFn, !1);
			},
			_loadListener: function() {
				var e = this, t = e._parent;
				t._duration = Math.ceil(e._node.duration * 10) / 10, Object.keys(t._sprite).length === 0 && (t._sprite = { __default: [0, t._duration * 1e3] }), t._state !== "loaded" && (t._state = "loaded", t._emit("load"), t._loadQueue()), e._node.removeEventListener(n._canPlayEvent, e._loadFn, !1);
			},
			_endListener: function() {
				var e = this, t = e._parent;
				t._duration === Infinity && (t._duration = Math.ceil(e._node.duration * 10) / 10, t._sprite.__default[1] === Infinity && (t._sprite.__default[1] = t._duration * 1e3), t._ended(e)), e._node.removeEventListener("ended", e._endFn, !1);
			}
		};
		var a = {}, o = function(e) {
			var t = e._src;
			if (a[t]) e._duration = a[t].duration, l(e);
			else if (/^data:[^;]+;base64,/.test(t)) {
				for (var n = atob(t.split(",")[1]), r = new Uint8Array(n.length), i = 0; i < n.length; ++i) r[i] = n.charCodeAt(i);
				c(r.buffer, e);
			} else {
				var o = new XMLHttpRequest();
				o.open(e._xhr.method, t, !0), o.withCredentials = e._xhr.withCredentials, o.responseType = "arraybuffer", e._xhr.headers && Object.keys(e._xhr.headers).forEach(function(t) {
					o.setRequestHeader(t, e._xhr.headers[t]);
				}), o.onload = function() {
					var t = (o.status + "")[0];
					t !== "0" && t !== "2" && t !== "3" ? e._emit("loaderror", null, "Failed loading audio file with status: " + o.status + ".") : c(o.response, e);
				}, o.onerror = function() {
					e._webAudio && (e._html5 = !0, e._webAudio = !1, e._sounds = [], delete a[t], e.load());
				}, s(o);
			}
		}, s = function(e) {
			try {
				e.send();
			} catch {
				e.onerror();
			}
		}, c = function(e, t) {
			var r = function() {
				t._emit("loaderror", null, "Decoding audio data failed.");
			}, i = function(e) {
				e && t._sounds.length > 0 ? (a[t._src] = e, l(t, e)) : r();
			};
			typeof Promise < "u" && n.ctx.decodeAudioData.length === 1 ? n.ctx.decodeAudioData(e).then(i).catch(r) : n.ctx.decodeAudioData(e, i, r);
		}, l = function(e, t) {
			t && !e._duration && (e._duration = t.duration), Object.keys(e._sprite).length === 0 && (e._sprite = { __default: [0, e._duration * 1e3] }), e._state !== "loaded" && (e._state = "loaded", e._emit("load"), e._loadQueue());
		}, u = function() {
			if (n.usingWebAudio) {
				try {
					typeof AudioContext < "u" ? n.ctx = new AudioContext() : typeof webkitAudioContext < "u" ? n.ctx = new webkitAudioContext() : n.usingWebAudio = !1;
				} catch {
					n.usingWebAudio = !1;
				}
				n.ctx || (n.usingWebAudio = !1);
				var e = /iP(hone|od|ad)/.test(n._navigator && n._navigator.platform), t = n._navigator && n._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/), r = t ? parseInt(t[1], 10) : null;
				if (e && r && r < 9) {
					var i = /safari/.test(n._navigator && n._navigator.userAgent.toLowerCase());
					n._navigator && !i && (n.usingWebAudio = !1);
				}
				n.usingWebAudio && (n.masterGain = n.ctx.createGain === void 0 ? n.ctx.createGainNode() : n.ctx.createGain(), n.masterGain.gain.setValueAtTime(n._muted ? 0 : n._volume, n.ctx.currentTime), n.masterGain.connect(n.ctx.destination)), n._setup();
			}
		};
		typeof define == "function" && define.amd && define([], function() {
			return {
				Howler: n,
				Howl: r
			};
		}), e !== void 0 && (e.Howler = n, e.Howl = r), typeof global < "u" ? (global.HowlerGlobal = t, global.Howler = n, global.Howl = r, global.Sound = i) : typeof window < "u" && (window.HowlerGlobal = t, window.Howler = n, window.Howl = r, window.Sound = i);
	})(), (function() {
		HowlerGlobal.prototype._pos = [
			0,
			0,
			0
		], HowlerGlobal.prototype._orientation = [
			0,
			0,
			-1,
			0,
			1,
			0
		], HowlerGlobal.prototype.stereo = function(e) {
			var t = this;
			if (!t.ctx || !t.ctx.listener) return t;
			for (var n = t._howls.length - 1; n >= 0; n--) t._howls[n].stereo(e);
			return t;
		}, HowlerGlobal.prototype.pos = function(e, t, n) {
			var r = this;
			if (!r.ctx || !r.ctx.listener) return r;
			if (t = typeof t == "number" ? t : r._pos[1], n = typeof n == "number" ? n : r._pos[2], typeof e == "number") r._pos = [
				e,
				t,
				n
			], r.ctx.listener.positionX === void 0 ? r.ctx.listener.setPosition(r._pos[0], r._pos[1], r._pos[2]) : (r.ctx.listener.positionX.setTargetAtTime(r._pos[0], Howler.ctx.currentTime, .1), r.ctx.listener.positionY.setTargetAtTime(r._pos[1], Howler.ctx.currentTime, .1), r.ctx.listener.positionZ.setTargetAtTime(r._pos[2], Howler.ctx.currentTime, .1));
			else return r._pos;
			return r;
		}, HowlerGlobal.prototype.orientation = function(e, t, n, r, i, a) {
			var o = this;
			if (!o.ctx || !o.ctx.listener) return o;
			var s = o._orientation;
			if (t = typeof t == "number" ? t : s[1], n = typeof n == "number" ? n : s[2], r = typeof r == "number" ? r : s[3], i = typeof i == "number" ? i : s[4], a = typeof a == "number" ? a : s[5], typeof e == "number") o._orientation = [
				e,
				t,
				n,
				r,
				i,
				a
			], o.ctx.listener.forwardX === void 0 ? o.ctx.listener.setOrientation(e, t, n, r, i, a) : (o.ctx.listener.forwardX.setTargetAtTime(e, Howler.ctx.currentTime, .1), o.ctx.listener.forwardY.setTargetAtTime(t, Howler.ctx.currentTime, .1), o.ctx.listener.forwardZ.setTargetAtTime(n, Howler.ctx.currentTime, .1), o.ctx.listener.upX.setTargetAtTime(r, Howler.ctx.currentTime, .1), o.ctx.listener.upY.setTargetAtTime(i, Howler.ctx.currentTime, .1), o.ctx.listener.upZ.setTargetAtTime(a, Howler.ctx.currentTime, .1));
			else return s;
			return o;
		}, Howl.prototype.init = (function(e) {
			return function(t) {
				var n = this;
				return n._orientation = t.orientation || [
					1,
					0,
					0
				], n._stereo = t.stereo || null, n._pos = t.pos || null, n._pannerAttr = {
					coneInnerAngle: t.coneInnerAngle === void 0 ? 360 : t.coneInnerAngle,
					coneOuterAngle: t.coneOuterAngle === void 0 ? 360 : t.coneOuterAngle,
					coneOuterGain: t.coneOuterGain === void 0 ? 0 : t.coneOuterGain,
					distanceModel: t.distanceModel === void 0 ? "inverse" : t.distanceModel,
					maxDistance: t.maxDistance === void 0 ? 1e4 : t.maxDistance,
					panningModel: t.panningModel === void 0 ? "HRTF" : t.panningModel,
					refDistance: t.refDistance === void 0 ? 1 : t.refDistance,
					rolloffFactor: t.rolloffFactor === void 0 ? 1 : t.rolloffFactor
				}, n._onstereo = t.onstereo ? [{ fn: t.onstereo }] : [], n._onpos = t.onpos ? [{ fn: t.onpos }] : [], n._onorientation = t.onorientation ? [{ fn: t.onorientation }] : [], e.call(this, t);
			};
		})(Howl.prototype.init), Howl.prototype.stereo = function(t, n) {
			var r = this;
			if (!r._webAudio) return r;
			if (r._state !== "loaded") return r._queue.push({
				event: "stereo",
				action: function() {
					r.stereo(t, n);
				}
			}), r;
			var i = Howler.ctx.createStereoPanner === void 0 ? "spatial" : "stereo";
			if (n === void 0) {
				if (typeof t == "number") r._stereo = t, r._pos = [
					t,
					0,
					0
				];
				else return r._stereo;
			}
			for (var a = r._getSoundIds(n), o = 0; o < a.length; o++) {
				var s = r._soundById(a[o]);
				if (s) {
					if (typeof t == "number") s._stereo = t, s._pos = [
						t,
						0,
						0
					], s._node && (s._pannerAttr.panningModel = "equalpower", s._panner && s._panner.pan || e(s, i), i === "spatial" ? s._panner.positionX === void 0 ? s._panner.setPosition(t, 0, 0) : (s._panner.positionX.setValueAtTime(t, Howler.ctx.currentTime), s._panner.positionY.setValueAtTime(0, Howler.ctx.currentTime), s._panner.positionZ.setValueAtTime(0, Howler.ctx.currentTime)) : s._panner.pan.setValueAtTime(t, Howler.ctx.currentTime)), r._emit("stereo", s._id);
					else return s._stereo;
				}
			}
			return r;
		}, Howl.prototype.pos = function(t, n, r, i) {
			var a = this;
			if (!a._webAudio) return a;
			if (a._state !== "loaded") return a._queue.push({
				event: "pos",
				action: function() {
					a.pos(t, n, r, i);
				}
			}), a;
			if (n = typeof n == "number" ? n : 0, r = typeof r == "number" ? r : -.5, i === void 0) {
				if (typeof t == "number") a._pos = [
					t,
					n,
					r
				];
				else return a._pos;
			}
			for (var o = a._getSoundIds(i), s = 0; s < o.length; s++) {
				var c = a._soundById(o[s]);
				if (c) {
					if (typeof t == "number") c._pos = [
						t,
						n,
						r
					], c._node && ((!c._panner || c._panner.pan) && e(c, "spatial"), c._panner.positionX === void 0 ? c._panner.setPosition(t, n, r) : (c._panner.positionX.setValueAtTime(t, Howler.ctx.currentTime), c._panner.positionY.setValueAtTime(n, Howler.ctx.currentTime), c._panner.positionZ.setValueAtTime(r, Howler.ctx.currentTime))), a._emit("pos", c._id);
					else return c._pos;
				}
			}
			return a;
		}, Howl.prototype.orientation = function(t, n, r, i) {
			var a = this;
			if (!a._webAudio) return a;
			if (a._state !== "loaded") return a._queue.push({
				event: "orientation",
				action: function() {
					a.orientation(t, n, r, i);
				}
			}), a;
			if (n = typeof n == "number" ? n : a._orientation[1], r = typeof r == "number" ? r : a._orientation[2], i === void 0) {
				if (typeof t == "number") a._orientation = [
					t,
					n,
					r
				];
				else return a._orientation;
			}
			for (var o = a._getSoundIds(i), s = 0; s < o.length; s++) {
				var c = a._soundById(o[s]);
				if (c) {
					if (typeof t == "number") c._orientation = [
						t,
						n,
						r
					], c._node && (c._panner || (c._pos ||= a._pos || [
						0,
						0,
						-.5
					], e(c, "spatial")), c._panner.orientationX === void 0 ? c._panner.setOrientation(t, n, r) : (c._panner.orientationX.setValueAtTime(t, Howler.ctx.currentTime), c._panner.orientationY.setValueAtTime(n, Howler.ctx.currentTime), c._panner.orientationZ.setValueAtTime(r, Howler.ctx.currentTime))), a._emit("orientation", c._id);
					else return c._orientation;
				}
			}
			return a;
		}, Howl.prototype.pannerAttr = function() {
			var t = this, n = arguments, r, i, a;
			if (!t._webAudio) return t;
			if (n.length === 0) return t._pannerAttr;
			if (n.length === 1) {
				if (typeof n[0] == "object") r = n[0], i === void 0 && (r.pannerAttr || (r.pannerAttr = {
					coneInnerAngle: r.coneInnerAngle,
					coneOuterAngle: r.coneOuterAngle,
					coneOuterGain: r.coneOuterGain,
					distanceModel: r.distanceModel,
					maxDistance: r.maxDistance,
					refDistance: r.refDistance,
					rolloffFactor: r.rolloffFactor,
					panningModel: r.panningModel
				}), t._pannerAttr = {
					coneInnerAngle: r.pannerAttr.coneInnerAngle === void 0 ? t._coneInnerAngle : r.pannerAttr.coneInnerAngle,
					coneOuterAngle: r.pannerAttr.coneOuterAngle === void 0 ? t._coneOuterAngle : r.pannerAttr.coneOuterAngle,
					coneOuterGain: r.pannerAttr.coneOuterGain === void 0 ? t._coneOuterGain : r.pannerAttr.coneOuterGain,
					distanceModel: r.pannerAttr.distanceModel === void 0 ? t._distanceModel : r.pannerAttr.distanceModel,
					maxDistance: r.pannerAttr.maxDistance === void 0 ? t._maxDistance : r.pannerAttr.maxDistance,
					refDistance: r.pannerAttr.refDistance === void 0 ? t._refDistance : r.pannerAttr.refDistance,
					rolloffFactor: r.pannerAttr.rolloffFactor === void 0 ? t._rolloffFactor : r.pannerAttr.rolloffFactor,
					panningModel: r.pannerAttr.panningModel === void 0 ? t._panningModel : r.pannerAttr.panningModel
				});
				else return a = t._soundById(parseInt(n[0], 10)), a ? a._pannerAttr : t._pannerAttr;
			} else n.length === 2 && (r = n[0], i = parseInt(n[1], 10));
			for (var o = t._getSoundIds(i), s = 0; s < o.length; s++) if (a = t._soundById(o[s]), a) {
				var c = a._pannerAttr;
				c = {
					coneInnerAngle: r.coneInnerAngle === void 0 ? c.coneInnerAngle : r.coneInnerAngle,
					coneOuterAngle: r.coneOuterAngle === void 0 ? c.coneOuterAngle : r.coneOuterAngle,
					coneOuterGain: r.coneOuterGain === void 0 ? c.coneOuterGain : r.coneOuterGain,
					distanceModel: r.distanceModel === void 0 ? c.distanceModel : r.distanceModel,
					maxDistance: r.maxDistance === void 0 ? c.maxDistance : r.maxDistance,
					refDistance: r.refDistance === void 0 ? c.refDistance : r.refDistance,
					rolloffFactor: r.rolloffFactor === void 0 ? c.rolloffFactor : r.rolloffFactor,
					panningModel: r.panningModel === void 0 ? c.panningModel : r.panningModel
				};
				var l = a._panner;
				l ||= (a._pos || (a._pos = t._pos || [
					0,
					0,
					-.5
				]), e(a, "spatial"), a._panner), l.coneInnerAngle = c.coneInnerAngle, l.coneOuterAngle = c.coneOuterAngle, l.coneOuterGain = c.coneOuterGain, l.distanceModel = c.distanceModel, l.maxDistance = c.maxDistance, l.refDistance = c.refDistance, l.rolloffFactor = c.rolloffFactor, l.panningModel = c.panningModel;
			}
			return t;
		}, Sound.prototype.init = (function(e) {
			return function() {
				var t = this, n = t._parent;
				t._orientation = n._orientation, t._stereo = n._stereo, t._pos = n._pos, t._pannerAttr = n._pannerAttr, e.call(this), t._stereo ? n.stereo(t._stereo) : t._pos && n.pos(t._pos[0], t._pos[1], t._pos[2], t._id);
			};
		})(Sound.prototype.init), Sound.prototype.reset = (function(e) {
			return function() {
				var t = this, n = t._parent;
				return t._orientation = n._orientation, t._stereo = n._stereo, t._pos = n._pos, t._pannerAttr = n._pannerAttr, t._stereo ? n.stereo(t._stereo) : t._pos ? n.pos(t._pos[0], t._pos[1], t._pos[2], t._id) : t._panner && (t._panner.disconnect(0), t._panner = void 0, n._refreshBuffer(t)), e.call(this);
			};
		})(Sound.prototype.reset);
		var e = function(e, t) {
			t ||= "spatial", t === "spatial" ? (e._panner = Howler.ctx.createPanner(), e._panner.coneInnerAngle = e._pannerAttr.coneInnerAngle, e._panner.coneOuterAngle = e._pannerAttr.coneOuterAngle, e._panner.coneOuterGain = e._pannerAttr.coneOuterGain, e._panner.distanceModel = e._pannerAttr.distanceModel, e._panner.maxDistance = e._pannerAttr.maxDistance, e._panner.refDistance = e._pannerAttr.refDistance, e._panner.rolloffFactor = e._pannerAttr.rolloffFactor, e._panner.panningModel = e._pannerAttr.panningModel, e._panner.positionX === void 0 ? e._panner.setPosition(e._pos[0], e._pos[1], e._pos[2]) : (e._panner.positionX.setValueAtTime(e._pos[0], Howler.ctx.currentTime), e._panner.positionY.setValueAtTime(e._pos[1], Howler.ctx.currentTime), e._panner.positionZ.setValueAtTime(e._pos[2], Howler.ctx.currentTime)), e._panner.orientationX === void 0 ? e._panner.setOrientation(e._orientation[0], e._orientation[1], e._orientation[2]) : (e._panner.orientationX.setValueAtTime(e._orientation[0], Howler.ctx.currentTime), e._panner.orientationY.setValueAtTime(e._orientation[1], Howler.ctx.currentTime), e._panner.orientationZ.setValueAtTime(e._orientation[2], Howler.ctx.currentTime))) : (e._panner = Howler.ctx.createStereoPanner(), e._panner.pan.setValueAtTime(e._stereo, Howler.ctx.currentTime)), e._panner.connect(e._node), e._paused || e._parent.pause(e._id, !0).play(e._id, !0);
		};
	})();
})))(), NE = {
	lobby: "mus_lobby",
	normal: "mus_normal",
	reach1: "mus_reach_1",
	reach2: "mus_reach_2",
	reach3: "mus_reach_3",
	fever: "mus_fever"
}, PE = new class {
	howls = /* @__PURE__ */ new Map();
	meta = /* @__PURE__ */ new Map();
	voices = /* @__PURE__ */ new Map();
	music = "none";
	musicId;
	beds = /* @__PURE__ */ new Map();
	musicVol = .7;
	sfxVol = .9;
	muted = !1;
	unlocked = !1;
	async load() {
		let e = {};
		try {
			e = (await (await fetch("audio/index.json")).json()).slots;
		} catch {
			return;
		}
		try {
			let e = await (await fetch("audio/audio_manifest.json")).json();
			for (let [t, n] of Object.entries(e.sounds)) this.meta.set(t, n);
		} catch {}
		for (let [t, n] of Object.entries(e)) {
			let e = this.meta.get(t) ?? {}, r = t.startsWith("mus_");
			this.howls.set(t, new ME.Howl({
				src: n,
				loop: !!e.loop || r,
				preload: !0,
				html5: !1,
				volume: e.volume ?? 1
			}));
		}
	}
	unlock() {
		if (this.unlocked) return;
		this.unlocked = !0;
		let e = ME.Howler.ctx;
		e && e.state === "suspended" && e.resume();
	}
	setMuted(e) {
		this.muted = e, ME.Howler.mute(e);
	}
	setVolumes(e, t) {
		this.musicVol = e, this.sfxVol = t, this.musicId && this.howls.get(this.musicId.name)?.volume(this.base(this.musicId.name) * e, this.musicId.id);
		for (let [e, n] of this.beds) this.howls.get(e)?.volume(this.base(e) * n.level * t, n.id);
	}
	base(e) {
		return this.meta.get(e)?.volume ?? 1;
	}
	play(e, t = {}) {
		let n = this.howls.get(e);
		if (!n) return;
		let r = t.max ?? 4, i = this.voices.get(e) ?? 0;
		if (i >= r) return;
		let a = n.play();
		n.volume(this.base(e) * (t.vol ?? 1) * this.sfxVol, a), t.rate && n.rate(t.rate, a), this.voices.set(e, i + 1), n.once("end", () => this.voices.set(e, Math.max(0, (this.voices.get(e) ?? 1) - 1)), a);
	}
	bank(e, t, n = {}) {
		let r = 1 + Math.floor(Math.random() * t), i = n.pad ? String(r).padStart(n.pad, "0") : String(r);
		this.play(`${e}_${i}`, {
			max: n.max ?? 3,
			...n
		});
	}
	setMusic(e, t = 700) {
		if (e === this.music) return;
		this.music = e;
		let n = this.musicId;
		if (n) {
			let e = this.howls.get(n.name);
			e && (e.fade(e.volume(n.id), 0, t, n.id), window.setTimeout(() => e.stop(n.id), t + 30)), this.musicId = void 0;
		}
		if (e === "none") return;
		let r = NE[e], i = this.howls.get(r);
		if (!i) return;
		let a = i.play();
		i.volume(0, a), i.fade(0, this.base(r) * this.musicVol, t, a), this.musicId = {
			name: r,
			id: a
		};
	}
	cutMusic() {
		this.musicId && this.howls.get(this.musicId.name)?.stop(this.musicId.id), this.musicId = void 0, this.music = "none";
	}
	debug() {
		let e = {};
		for (let [t, n] of this.beds) e[t] = Math.round(n.level * 100) / 100;
		let t = 0;
		for (let e of this.howls.values()) e.playing() && t++;
		return {
			ctx: ME.Howler.ctx?.state ?? "none",
			music: this.musicId?.name,
			beds: e,
			playing: t
		};
	}
	bed(e, t) {
		let n = this.howls.get(e);
		if (!n) return;
		let r = this.beds.get(e);
		if (!r && t > .001) {
			let t = n.play();
			n.loop(!0, t), n.volume(0, t), r = {
				id: t,
				level: 0
			}, this.beds.set(e, r);
		}
		if (!r) return;
		let i = Math.max(0, Math.min(1, t));
		Math.abs(i - r.level) < .02 || (r.level += (i - r.level) * .25, n.volume(this.base(e) * r.level * this.sfxVol, r.id));
	}
}(), FE = (e) => e, IE = (e) => 1 - (1 - e) * (1 - e), LE = (e) => e * e, RE = (e) => 1 - (1 - e) ** 3, zE = (e) => 1 + 2.70158 * (e - 1) ** 3 + 1.70158 * (e - 1) ** 2, q = new class {
	list = [];
	now = 0;
	speed = 1;
	reduced = !1;
	ms(e) {
		return this.reduced ? 0 : this.speed === 1 ? e : Math.max(60, e * this.speed);
	}
	update(e) {
		this.now += e;
		for (let e of this.list) {
			if (e.done) continue;
			let t = e.dur <= 0 ? 1 : Math.min(1, (this.now - e.start) / e.dur), n = e.ease(t);
			for (let t of Object.keys(e.to)) e.target[t] = e.from[t] + (e.to[t] - e.from[t]) * n;
			e.onUpdate?.(n), t >= 1 && (e.done = !0, e.resolve());
		}
		this.list = this.list.filter((e) => !e.done);
	}
	to(e, t, n, r = IE, i) {
		let a = e, o = {};
		for (let e of Object.keys(t)) o[e] = a[e];
		return new Promise((e) => {
			this.list.push({
				from: o,
				to: t,
				target: a,
				start: this.now,
				dur: this.ms(n),
				ease: r,
				onUpdate: i,
				resolve: e,
				done: !1
			});
		});
	}
	run(e, t, n = FE) {
		return this.to({ v: 0 }, { v: 1 }, e, n, t);
	}
	wait(e) {
		return this.to({ v: 0 }, { v: 1 }, e, FE);
	}
}(), BE = (e) => e >= 1 ? 1 : 1 - 2 ** (-10 * e), VE = (e) => 2.70158 * e * e * e - 1.70158 * e * e, HE = (e) => e <= 0 ? 0 : e >= 1 ? 1 : 2 ** (-10 * e) * Math.sin((e * 10 - .75) * (2 * Math.PI / 3)) + 1, UE = (e) => -(Math.cos(Math.PI * e) - 1) / 2, WE = {
	demoStartBalls: 1e3,
	fireRatePerMin: 100,
	feverFireRatePerMin: 200,
	maxLiveBalls: 300,
	pendingCap: 4,
	portAward: 3,
	satelliteAward: 5,
	hatchAwardPerBall: 15,
	feverRounds: 8,
	hatchOpenMs: 25e3,
	hatchBallCap: 10,
	intervalMs: 4500,
	feverIntroMs: 3e3,
	roundSlamMs: 1400,
	gaugeRound: 4,
	gaugeMs: 5e3,
	gaugeBonusBalls: 50,
	reach: {
		quickMs: 7e3,
		stepUpMs: 18e3,
		missionMs: 4e4
	},
	odds: {
		hit: .06,
		reachOnMiss: .22,
		missTierWeights: [
			.62,
			.28,
			.1
		],
		hitTierWeights: [
			.12,
			.3,
			.58
		],
		surgeOnHit: .25,
		surgeOnMiss: .02,
		pushOnMissionMiss: .35,
		stepUpFakeOut: .6
	},
	demoSeed: 0
};
function GE(e, t = WE) {
	let n = structuredClone(t);
	if (!e) return n;
	for (let [t, r] of Object.entries(e)) {
		let e = n[t];
		r !== void 0 && t in n && (Array.isArray(e) ? Array.isArray(r) && r.length === e.length && r.every((e) => typeof e == "number") && (n[t] = [...r]) : e && typeof e == "object" ? n[t] = GE(r, e) : typeof r == typeof e && (n[t] = r));
	}
	return n;
}
async function KE(e = "config/tune.json") {
	try {
		let t = await fetch(e);
		return t.ok ? GE(await t.json()) : WE;
	} catch {
		return WE;
	}
}
// src/game/board.ts
var qE = 1080, JE = 1920, YE = {
	cx: 515,
	cy: 700,
	r: 450
}, XE = YE.r - 13, ZE = 1560, QE = 1.1, J = {
	x: 185,
	y: 422,
	w: 660,
	h: 495
}, $E = {
	x: J.x - 12,
	y: J.y - 12,
	w: J.w + 24,
	h: J.h + 24,
	chamfer: 78,
	chamferTL: 112
}, eD = Math.round(($E.chamferTL - 6) / QE), Y = {
	x: 515,
	y: 1082,
	w: 38,
	depth: 28
}, tD = [{
	x: 245,
	y: 1236,
	w: 42,
	depth: 26
}, {
	x: 785,
	y: 1236,
	w: 42,
	depth: 26
}], X = {
	x: 515,
	y: 1446,
	w: 236
}, nD = {
	x: 150,
	y: 958,
	r: 30
}, rD = [{
	x: nD.x,
	y: nD.y,
	r: nD.r,
	spin: 1
}, {
	x: 880,
	y: 975,
	r: 24,
	spin: -1
}], iD = [{
	x0: $E.x - 17,
	x1: $E.x - 11,
	y0: 640,
	y1: 740,
	side: -1
}, {
	x0: $E.x + $E.w + 11,
	x1: $E.x + $E.w + 17,
	y0: 640,
	y1: 740,
	side: 1
}], aD = {
	x: 515,
	y: $E.y + $E.h + 14
}, oD = {
	ax: 950,
	ay: 1338,
	bx: X.x + X.w / 2 + 8,
	by: 1428
}, sD = (e) => e * Math.PI / 180;
function cD(e, t = XE) {
	return {
		x: YE.cx + t * Math.cos(sD(e)),
		y: YE.cy + t * Math.sin(sD(e))
	};
}
function lD(e, t, n) {
	let r = [];
	for (let i = 0; i < e.length - 1; i++) (e[i][0] !== e[i + 1][0] || e[i][1] !== e[i + 1][1]) && r.push({
		ax: e[i][0],
		ay: e[i][1],
		bx: e[i + 1][0],
		by: e[i + 1][1],
		e: t,
		tag: n
	});
	return r;
}
function uD(e, t, n, r) {
	let i = e - n / 2 - 3, a = e + n / 2 + 3;
	return [...lD([
		[i - 7, t - 6],
		[i, t],
		[i, t + r],
		[a, t + r],
		[a, t],
		[a + 7, t - 6]
	], .3, "cup")];
}
function dD() {
	let e = [], t = [];
	for (let e = 180; e <= 360; e += 4) {
		let n = cD(e, YE.r);
		t.push([n.x, n.y]);
	}
	e.push(...lD(t, .3, "wall")), e.push(...lD([[965, YE.cy], [965, 1622]], .3, "wall"));
	let n = [[97, 1622], [97, YE.cy]];
	for (let e = 180; e <= 214; e += 4) {
		let t = cD(e, YE.cx - 97);
		n.push([t.x, t.y]);
	}
	e.push(...lD(n, .3, "rail"));
	let r = $E, i = r.chamfer;
	e.push(...lD([
		[r.x, r.y + r.chamferTL],
		[r.x + r.chamferTL, r.y],
		[r.x + r.w / 2, r.y - 30],
		[r.x + r.w - i, r.y],
		[r.x + r.w, r.y + i],
		[r.x + r.w, r.y + r.h - i],
		[r.x + r.w - i, r.y + r.h],
		[r.x + i, r.y + r.h],
		[r.x, r.y + r.h - i],
		[r.x, r.y + r.chamferTL]
	], .35, "frame")), e.push(...uD(Y.x, Y.y, Y.w, Y.depth));
	for (let t of tD) e.push(...uD(t.x, t.y, t.w, t.depth));
	let a = X.x - X.w / 2, o = X.x + X.w / 2;
	e.push(...lD([[a, X.y + 1], [a, X.y + 30]], .3, "cup")), e.push(...lD([[o, X.y + 1], [o, X.y + 30]], .3, "cup")), e.push({
		ax: a,
		ay: X.y,
		bx: X.x,
		by: X.y - 12,
		e: .25,
		tag: "flap"
	}), e.push({
		ax: X.x,
		ay: X.y - 12,
		bx: o,
		by: X.y,
		e: .25,
		tag: "flap"
	});
	let s = oD;
	e.push({
		ax: s.ax,
		ay: s.ay,
		bx: s.bx,
		by: s.by,
		e: .2,
		tag: "rail"
	}), e.push({
		ax: 965,
		ay: s.ay - 20,
		bx: s.ax,
		by: s.ay,
		e: .2,
		tag: "rail"
	});
	for (let [t, n, r, i] of pD) e.push({
		ax: t,
		ay: n,
		bx: r,
		by: i,
		e: .2,
		tag: "rail"
	});
	return e;
}
function fD() {
	let e = [], t = (t, n, r) => {
		if (hD(t, n, 16) || Math.hypot(t - YE.cx, n - YE.cy) > YE.r - 26 - 6 && n < YE.cy + 40 || t < 127 || t > 935) return !1;
		for (let e of rD) if (Math.hypot(t - e.x, n - e.y) < e.r + 26 + 6) return !1;
		for (let e of iD) if (t > e.x0 - 30 && t < e.x1 + 30 && n > e.y0 - 20 && n < e.y1 + 20) return !1;
		if (Math.abs(t - Y.x) < 40 && n > Y.y - 20 && n < Y.y + 60 || tD.some((e) => Math.abs(t - e.x) < 50 && n > e.y - 40 && n < e.y + 44) || Math.abs(t - X.x) < X.w / 2 + 26 && n > X.y - 46 || n > 1492) return !1;
		for (let [e, r, i, a] of pD) if (mD(t, n, e, r, i, a) < 37) return !1;
		if (t > 640 && n > gD(t) - 30) return !1;
		for (let i of e) if (Math.hypot(i.x - t, i.y - n) < (r && i.line ? 18 : 38)) return !1;
		return !0;
	}, n = (n, r, i = !1) => {
		n = Math.round(n), r = Math.round(r), t(n, r, i) && e.push({
			x: n,
			y: r,
			line: i
		});
	}, r = (e, t, r, i, a, o = 22) => {
		let s = Math.hypot(r - e, i - t), c = Math.max(2, Math.round(s / o)), l = -(i - t) / s, u = (r - e) / s;
		for (let o = 0; o <= c; o++) {
			let s = o / c, d = Math.sin(s * Math.PI) * a;
			n(e + (r - e) * s + l * d, t + (i - t) * s + u * d, !0);
		}
	}, i = $E, a = i.y + i.h;
	for (let [t, n] of [
		[-30, -30],
		[30, -30],
		[-50, -66],
		[50, -66]
	]) e.push({
		x: Y.x + t,
		y: Y.y + n,
		line: !0
	});
	r(Y.x - 70, Y.y - 104, Y.x - 54, Y.y - 72, 0, 16), r(Y.x + 70, Y.y - 104, Y.x + 54, Y.y - 72, 0, 16);
	for (let e = 222; e <= 318; e += 4.2) {
		if (e > 258 && e < 282) continue;
		let t = cD(e, YE.r - 44);
		n(t.x, t.y, !0);
	}
	r(i.x - 40, 560, i.x - 40, 760, 0, 26), r(i.x + i.w + 44, 520, i.x + i.w + 44, 800, 0, 26), r(i.x + 64, a + 36, Y.x - 104, Y.y - 92, -12, 21), r(i.x + i.w - 64, a + 36, Y.x + 104, Y.y - 92, 12, 21), r(i.x + 72, a + 54, Y.x - 112, Y.y - 74, -12, 21), r(i.x + i.w - 72, a + 54, Y.x + 112, Y.y - 74, 12, 21);
	for (let e = 226; e <= 314; e += 4.6) {
		if (e > 256 && e < 284) continue;
		let t = cD(e, YE.r - 66);
		n(t.x, t.y, !0);
	}
	r(133, 1300, 207, 1380, 0, 21), r(929, 1200, 869, 1262, 0, 21), r(137, 1090, tD[0].x - 60, tD[0].y - 60, -18, 24), r(925, 1090, tD[1].x + 96, tD[1].y - 70, 14, 24), r(X.x - X.w / 2 - 70, X.y - 110, X.x - X.w / 2 - 34, X.y - 50, 0, 22);
	for (let e = 0; e < 46; e++) {
		let t = 466 + e * 33, r = e % 2 ? 21 : 0;
		for (let e = 118 + r; e < 960; e += 42) n(e, t);
	}
	for (let t of [
		1060,
		1150,
		1240
	]) e.push({
		x: 948,
		y: t
	});
	return e.push({
		x: 905,
		y: 1312
	}), e.map(({ x: e, y: t }) => ({
		x: e,
		y: t
	}));
}
var pD = [[
	97,
	1500,
	330,
	1572
], [
	965,
	1500,
	700,
	1572
]];
function mD(e, t, n, r, i, a) {
	let o = i - n, s = a - r, c = Math.max(0, Math.min(1, ((e - n) * o + (t - r) * s) / (o * o + s * s)));
	return Math.hypot(e - n - o * c, t - r - s * c);
}
function hD(e, t, n = 0) {
	let r = $E, i = r.chamfer;
	if (e < r.x - n || e > r.x + r.w + n || t < r.y - 34 - n || t > r.y + r.h + n) return !1;
	let a = e - (r.x - n), o = r.x + r.w + n - e, s = t - (r.y - n), c = r.y + r.h + n - t;
	return !(a + s < r.chamferTL || o + s < i || a + c < i || o + c < i);
}
function gD(e) {
	let t = oD;
	return t.ay + (e - t.ax) * (t.by - t.ay) / (t.bx - t.ax);
}
function _D() {
	let e = [{
		kind: "dock",
		index: 0,
		x0: Y.x - Y.w / 2,
		x1: Y.x + Y.w / 2,
		y0: Y.y + 4,
		y1: Y.y + Y.depth + 4
	}];
	return tD.forEach((t, n) => e.push({
		kind: "satellite",
		index: n,
		x0: t.x - t.w / 2,
		x1: t.x + t.w / 2,
		y0: t.y + 4,
		y1: t.y + t.depth + 4
	})), e.push({
		kind: "hatch",
		index: 0,
		x0: X.x - X.w / 2 + 2,
		x1: X.x + X.w / 2 - 2,
		y0: X.y - 2,
		y1: X.y + 30
	}), e;
}
// src/core/fx.ts
function vD(e, t, n, r, i = 2.2) {
	for (let a = n; a >= 1; a--) {
		let o = a / n;
		e.circle(t, t, t * o).fill({
			color: r,
			alpha: (1 - o) ** i * .35 + .012
		});
	}
}
function yD(e) {
	let t = new KS();
	vD(t, 64, 32, 16777215, 1.6);
	let n = new KS();
	vD(n, 16, 12, 16777215, 1.1), n.circle(16, 16, 3).fill({
		color: 16777215,
		alpha: 1
	});
	let r = new KS();
	for (let e = 0; e < 16; e++) {
		let t = e / 16;
		r.ellipse(64, 8, 64 * (1 - t), 8 * (1 - t) + .5).fill({
			color: 16777215,
			alpha: .06 + t * .06
		});
	}
	let i = new KS();
	vD(i, 32, 10, 16777215, 1.4);
	for (let [e, t] of [[32, 2.2], [2.2, 32]]) for (let n = 0; n < 6; n++) i.ellipse(32, 32, e * (1 - n / 7), t * (1 - n / 7) + .4).fill({
		color: 16777215,
		alpha: .18
	});
	let a = new KS();
	for (let e = 0; e < 6; e++) a.circle(64, 64, 58 - e * .6).stroke({
		width: 2 + e * 1.6,
		color: 16777215,
		alpha: .09
	});
	a.circle(64, 64, 58).stroke({
		width: 2.5,
		color: 16777215,
		alpha: .9
	});
	let o = new KS();
	vD(o, 24, 8, 16777215, 1.5);
	let s = [];
	for (let e = 0; e < 10; e++) {
		let t = -Math.PI / 2 + e * Math.PI / 5, n = e % 2 ? 7 : 16;
		s.push(24 + Math.cos(t) * n, 24 + Math.sin(t) * n);
	}
	o.poly(s).fill({
		color: 16777215,
		alpha: 1
	});
	let c = (t) => {
		let n = e.generateTexture({
			target: t,
			resolution: 1,
			antialias: !0
		});
		return t.destroy(), n;
	};
	return {
		glow: c(t),
		spark: c(n),
		streak: c(r),
		star: c(i),
		ring: c(a),
		chip: c(o)
	};
}
var bD = class {
	cap;
	root = new H();
	pool = [];
	live = [];
	constructor(e = 900) {
		this.cap = e;
	}
	emit(e) {
		let t = e.n ?? 10;
		for (let n = 0; n < t; n++) {
			if (this.live.length >= this.cap) return;
			let t = this.pool.pop() ?? this.make(), n = xD(e.angle ?? [0, Math.PI * 2]), r = xD(e.speed ?? [80, 260]);
			t.s.texture = e.tex, t.s.position.set(e.x + (Math.random() - .5) * (e.spread ?? 0), e.y + (Math.random() - .5) * (e.spread ?? 0)), t.vx = Math.cos(n) * r, t.vy = Math.sin(n) * r, t.g = e.gravity ?? 0, t.max = t.life = xD(e.life ?? [.4, .9]), t.s0 = xD(e.scale ?? [.3, .6]), t.s1 = t.s0 * (e.endScale ?? .2), t.a0 = e.alpha ?? 1, t.spin = (Math.random() - .5) * (e.spin ?? 0), t.drag = e.drag ?? 0;
			let i = e.tint;
			t.s.tint = Array.isArray(i) ? i[Math.random() * i.length | 0] : i ?? 16777215, t.s.rotation = Math.random() * Math.PI * 2 * !!e.spin, t.s.visible = !0, t.active = !0, this.live.push(t);
		}
	}
	make() {
		let e = new ha();
		return e.anchor.set(.5), e.blendMode = "add", this.root.addChild(e), {
			s: e,
			vx: 0,
			vy: 0,
			g: 0,
			life: 0,
			max: 1,
			s0: 1,
			s1: 1,
			a0: 1,
			spin: 0,
			drag: 0,
			active: !1
		};
	}
	update(e) {
		for (let t of this.live) {
			if (t.life -= e, t.life <= 0) {
				t.active = !1, t.s.visible = !1, this.pool.push(t);
				continue;
			}
			let n = 1 - t.life / t.max;
			if (t.vy += t.g * e, t.drag) {
				let n = Math.max(0, 1 - t.drag * e);
				t.vx *= n, t.vy *= n;
			}
			t.s.x += t.vx * e, t.s.y += t.vy * e, t.s.rotation += t.spin * e, t.s.scale.set(t.s0 + (t.s1 - t.s0) * n), t.s.alpha = t.a0 * (n < .15 ? n / .15 : 1 - (n - .15) / .85);
		}
		this.live = this.live.filter((e) => e.active);
	}
	get count() {
		return this.live.length;
	}
};
function xD([e, t]) {
	return e + Math.random() * (t - e);
}
var SD = class {
	trauma = 0;
	enabled = !0;
	t = 0;
	add(e) {
		this.enabled && (this.trauma = Math.min(1, this.trauma + e));
	}
	update(e, t, n = 0, r = 0) {
		this.t += e, this.trauma = Math.max(0, this.trauma - e * 1.6);
		let i = this.trauma * this.trauma;
		t.x = n + i * 26 * (Math.sin(this.t * 71) + Math.sin(this.t * 37) * .5), t.y = r + i * 26 * (Math.cos(this.t * 63) + Math.sin(this.t * 29) * .5), t.rotation = i * .012 * Math.sin(this.t * 47);
	}
};
// src/core/sprite.ts
function Z(e, t = .5, n = .5) {
	let r = new ha(e);
	return r.anchor.set(t, n), r;
}
function CD(e, t, n) {
	let r = e.texture.width || 1, i = e.texture.height || 1;
	return e.scale.set(Math.max(t / r, n / i)), e;
}
function wD(e, t, n) {
	let r = e.texture.width || 1, i = e.texture.height || 1;
	return e.scale.set(Math.min(t / r, n / i)), e;
}
function TD(e, t, n, r, i = {}) {
	if (!t.length) return;
	let a = new oE(t);
	return a.anchor.set(.5), a.position.set(n, r), a.scale.set(i.sx ?? i.scale ?? 1, i.sy ?? i.scale ?? 1), i.rotation && (a.rotation = i.rotation), i.tint !== void 0 && (a.tint = i.tint), i.add !== !1 && (a.blendMode = "add"), a.animationSpeed = (i.fps ?? 30) / 60, a.loop = !1, a.onComplete = () => a.destroy(), e.addChild(a), a.play(), a;
}
function ED(e, t = 24) {
	let n = new oE(e.length ? e : [B.EMPTY]);
	return n.anchor.set(.5), n.animationSpeed = t / 60, n.loop = !0, n.play(), n;
}
// src/outcome/types.ts
var DD = class extends Error {
	code;
	constructor(e, t) {
		super(e), this.code = t;
	}
}, OD = "Orbitron, Exo 2, sans-serif", kD = "Exo 2, sans-serif", AD = "Rajdhani, Orbitron, sans-serif", Q = {
	navy: 461598,
	cyan: 3076863,
	magenta: 16727499,
	violet: 9067775,
	white: 16777215,
	amber: 16757575
};
function jD(e, t = Q.cyan, n) {
	return {
		fontFamily: OD,
		fontWeight: "900",
		fontSize: e,
		fill: new Ly({
			type: "linear",
			start: {
				x: 0,
				y: 0
			},
			end: {
				x: 0,
				y: 1
			},
			textureSpace: "local",
			colorStops: (n ?? [
				[0, "#ffffff"],
				[.45, "#c9fbff"],
				[.55, "#2ef2ff"],
				[1, "#8a5cff"]
			]).map(([e, t]) => ({
				offset: e,
				color: t
			}))
		}),
		stroke: {
			color: 656932,
			width: Math.max(3, e * .07),
			join: "round"
		},
		dropShadow: {
			color: t,
			blur: e * .22,
			distance: 0,
			alpha: .95,
			angle: 0
		},
		letterSpacing: e * .04,
		padding: e * .4
	};
}
var MD = [
	[0, "#ffffff"],
	[.4, "#ffd0f4"],
	[.56, "#ff3dcb"],
	[1, "#8a2cff"]
], ND = [
	[0, "#ffffff"],
	[.5, "#fff6cf"],
	[.62, "#ffcf5a"],
	[1, "#ff7a2e"]
];
function PD(e, t, n = 15267583, r = "700", i = kD) {
	let a = new EE({
		text: e,
		style: {
			fontFamily: i,
			fontWeight: r,
			fontSize: t,
			fill: n,
			stroke: {
				color: 329242,
				width: Math.max(2, t * .12),
				join: "round"
			},
			dropShadow: {
				color: 0,
				blur: 6,
				distance: 2,
				alpha: .6,
				angle: Math.PI / 2
			},
			letterSpacing: t * .03,
			padding: 8
		}
	});
	return a.anchor.set(.5), a;
}
function FD(e, t, n = Q.cyan, r) {
	let i = new EE({
		text: e,
		style: jD(t, n, r)
	});
	return i.anchor.set(.5), i;
}
var ID = 172, LD = [
	110,
	300,
	490
], RD = 236, zD = 15, BD = [
	"sy0",
	"sy1",
	"sy2",
	"sy3",
	"sy4",
	"sy5",
	"sy6",
	"sy7",
	"sy8"
], VD = class {
	art;
	root = new H();
	frame;
	icon;
	num;
	numArt;
	sym = -1;
	constructor(e) {
		this.art = e, this.frame = Z(e.tex("reelCard")), e.has("reelCard") && wD(this.frame, 176, 168), this.icon = Z(B.EMPTY), this.num = FD("1", 74, Q.magenta), this.num.position.set(40, 44), this.numArt = Z(B.EMPTY), this.numArt.position.set(28, 48), this.numArt.tint = Q.magenta, this.num.visible = !e.has("numerals"), this.root.addChild(this.frame, this.icon, this.num, this.numArt);
	}
	set(e) {
		e !== this.sym && (this.sym = e, this.icon.texture = this.art.tex(BD[e]), wD(this.icon, 112, 112), this.icon.y = -8, this.num.text = String(e + 1), this.art.has("numerals") && (this.numArt.texture = this.art.tex("numerals", String(e + 1)), wD(this.numArt, 50, 62)));
	}
}, HD = class {
	x;
	root = new H();
	cards = [];
	pos = 0;
	spinning = !1;
	speed = zD;
	blur = 0;
	glow = 0;
	constructor(e, t) {
		this.x = t;
		for (let t = 0; t < 4; t++) {
			let t = new VD(e);
			this.cards.push(t), this.root.addChild(t.root);
		}
		this.root.x = t, this.layout();
	}
	get symbol() {
		return (Math.round(this.pos) % 9 + 9) % 9;
	}
	update(e) {
		this.spinning && (this.pos += this.speed * e), this.layout();
	}
	layout() {
		let e = Math.floor(this.pos), t = this.pos - e;
		for (let n = 0; n < this.cards.length; n++) {
			let r = e - 1 + n, i = this.cards[n];
			i.set((r % 9 + 9) % 9), i.root.y = RD + (t - (n - 1)) * ID;
			let a = Math.abs(i.root.y - RD) / ID;
			i.root.alpha = Math.max(0, 1 - a * .55), i.root.scale.set(1 - Math.min(.25, a * .12), (1 - Math.min(.25, a * .12)) * (1 + this.blur * .35)), i.icon.alpha = 1 - this.blur * .35;
		}
	}
	target(e, t) {
		let n = Math.ceil(this.pos + t);
		for (; (n % 9 + 9) % 9 !== e;) n++;
		return n;
	}
	async stop(e, t, n, r = 5) {
		this.spinning = !1;
		let i = this.target(t, r), a = this.pos;
		await e.run(n, (e) => {
			this.pos = a + (i - a) * e, this.blur = Math.max(0, 1 - e * 1.4);
		}, zE), this.pos = i, this.blur = 0;
	}
	async crawl(e, t, n, r = 6) {
		this.spinning = !1;
		let i = this.target(t, r), a = this.pos;
		await e.run(n, (e) => {
			this.pos = a + (i - a) * e, this.blur = Math.max(0, .6 - e);
		}, RE), this.pos = i, this.blur = 0;
	}
	spin() {
		this.spinning = !0, this.speed = zD, this.blur = 1;
	}
}, UD = class {
	art;
	tw;
	root = new H();
	backdrop = new H();
	reelLayer = new H();
	overlay = new H();
	reels;
	bgA;
	bgB;
	scan;
	current = "lcdIdle";
	constructor(e, t) {
		this.art = e, this.tw = t, this.root.position.set(J.x, J.y), this.root.scale.set(QE), this.bgA = this.plate("lcdIdle"), this.bgB = this.plate("lcdIdle"), this.bgB.alpha = 0, this.backdrop.addChild(this.bgA, this.bgB), this.reels = LD.map((t) => new HD(e, t));
		for (let e of this.reels) this.reelLayer.addChild(e.root);
		this.scan = new KS();
		for (let e = 0; e < 450; e += 4) this.scan.rect(0, e, 600, 1).fill({
			color: 16777215,
			alpha: .025
		});
		this.scan.blendMode = "add";
		let n = new KS().poly([
			0,
			eD,
			eD,
			0,
			600,
			0,
			600,
			450,
			0,
			450
		]).fill(16777215);
		this.root.addChild(this.backdrop, this.reelLayer, this.overlay, this.scan, n), this.root.mask = n;
	}
	plate(e) {
		let t = Z(this.art.tex(e));
		return t.position.set(300, 225), CD(t, 600, 450), t;
	}
	async setBackdrop(e, t = 450) {
		e !== this.current && (this.current = e, this.bgB.texture = this.art.tex(e), CD(this.bgB, 600, 450), this.bgB.alpha = 0, await this.tw.to(this.bgB, { alpha: 1 }, t), this.bgA.texture = this.bgB.texture, CD(this.bgA, 600, 450), this.bgB.alpha = 0);
	}
	update(e, t) {
		for (let t of this.reels) t.update(e);
		this.bgA.x = 300 + Math.sin(t * .15) * 6, this.bgA.scale.set(this.bgA.scale.x);
	}
	showReels(e) {
		return this.tw.to(this.reelLayer, { alpha: +!!e }, 260);
	}
	set reelsDim(e) {
		this.reelLayer.alpha = e;
	}
	toBoard(e, t) {
		return {
			x: this.root.x + e * QE,
			y: this.root.y + t * QE
		};
	}
	get reelX() {
		return LD;
	}
	get centerY() {
		return RD;
	}
}, WD = class extends Error {}, GD = {
	quick: 1,
	stepup: 2,
	mission: 3
}, KD = class {
	tune;
	mode = "title";
	lcd = "idle";
	pending = [];
	current;
	fever;
	lastFever;
	bestTier;
	led = "normal";
	listeners = [];
	constructor(e) {
		this.tune = e;
	}
	on(e) {
		return this.listeners.push(e), () => {
			this.listeners = this.listeners.filter((t) => t !== e);
		};
	}
	emit(e) {
		for (let t of [...this.listeners]) t(e);
	}
	setMode(e) {
		let t = this.mode;
		t !== e && (this.mode = e, this.emit({
			type: "mode",
			mode: e,
			from: t
		}), this.setLed(e === "fever" ? "fever" : this.lcd === "reach" || this.lcd === "celebrate" ? "reach" : "normal"));
	}
	setLed(e) {
		this.led !== e && (this.led = e, this.emit({
			type: "led",
			level: e
		}));
	}
	get ledLevel() {
		return this.led;
	}
	get pendingCount() {
		return this.pending.length;
	}
	get hatchOpen() {
		return this.mode === "fever" && this.fever?.stage === "open";
	}
	start() {
		if (this.mode !== "title") throw new WD(`start from ${this.mode}`);
		this.setMode("normal"), this.maybeSpin();
	}
	toTitle() {
		if (this.mode === "fever" || this.lcd !== "idle") throw new WD("cannot leave during a show or fever");
		this.setMode("title");
	}
	queueSpin(e) {
		return this.pending.length >= this.tune.pendingCap ? !1 : (this.pending.push(e), this.emit({
			type: "pending",
			count: this.pending.length
		}), this.maybeSpin(), !0);
	}
	maybeSpin() {
		if (this.mode !== "normal" || this.lcd !== "idle" || !this.pending.length) return;
		let e = this.pending.shift();
		return this.current = e, this.lcd = "spinning", this.emit({
			type: "pending",
			count: this.pending.length
		}), this.emit({
			type: "spin-start",
			spin: e
		}), e;
	}
	reachStarted() {
		let e = this.current;
		if (this.lcd !== "spinning" || !e) throw new WD(`reach from ${this.lcd}`);
		if (e.kind === "miss") throw new WD("a miss has no reach");
		this.lcd = "reach", e.tier && (!this.bestTier || GD[e.tier] > GD[this.bestTier]) && (this.bestTier = e.tier), this.setLed("reach");
	}
	spinFinished() {
		let e = this.current;
		if (!e || this.lcd !== "spinning" && this.lcd !== "reach") throw new WD(`spin end from ${this.lcd}`);
		if (e.kind !== "miss" && this.lcd !== "reach") throw new WD("a reach must be shown before it ends");
		this.emit({
			type: "spin-end",
			spin: e
		}), e.kind === "hit" ? this.lcd = "celebrate" : (this.lcd = "idle", this.current = void 0, this.setLed("normal"), this.maybeSpin());
	}
	hitShown() {
		let e = this.current;
		if (this.lcd !== "celebrate" || !e?.fever) throw new WD(`fever from ${this.lcd}`);
		this.fever = {
			plan: e.fever,
			round: 0,
			stage: "intro",
			t: 0,
			entries: 0,
			won: Array(e.fever.rounds).fill(0),
			gaugeFired: !1
		}, this.current = void 0, this.lcd = "idle", this.setMode("fever"), this.emit({
			type: "fever-stage",
			stage: "intro",
			round: 0
		});
	}
	hatchEntry() {
		let e = this.fever;
		return !e || this.mode !== "fever" || e.stage !== "open" || e.entries >= e.plan.ballCap ? -1 : e.entries++;
	}
	credit(e, t = this.fever?.round ?? 0) {
		let n = this.fever;
		!n || t < 1 || t > n.won.length || e <= 0 || (n.won[t - 1] += e);
	}
	tick(e) {
		let t = this.fever;
		if (t && this.mode === "fever") switch (t.t += e, t.stage) {
			case "intro":
				t.t >= this.tune.feverIntroMs && this.enterRound(1);
				break;
			case "slam":
				t.t >= this.tune.roundSlamMs && (t.stage = "open", t.t = 0, t.entries = 0, this.emit({
					type: "fever-stage",
					stage: "open",
					round: t.round
				}), this.emit({
					type: "hatch",
					open: !0,
					round: t.round
				}));
				break;
			case "open":
				!t.gaugeFired && t.round === t.plan.gaugeRound && t.t >= t.plan.openMs * .35 && (t.gaugeFired = !0, this.emit({
					type: "gauge-due",
					round: t.round
				})), (t.t >= t.plan.openMs || t.entries >= t.plan.ballCap) && (t.stage = "interval", t.t = 0, this.emit({
					type: "hatch",
					open: !1,
					round: t.round
				}), this.emit({
					type: "round-closed",
					round: t.round,
					won: t.won[t.round - 1],
					entries: t.entries
				}), this.emit({
					type: "fever-stage",
					stage: "interval",
					round: t.round
				}));
				break;
			case "interval": t.t >= this.tune.intervalMs && (t.round < t.plan.rounds ? this.enterRound(t.round + 1) : (this.lastFever = t, this.fever = void 0, this.setMode("endcard")));
		}
	}
	enterRound(e) {
		let t = this.fever;
		t.round = e, t.stage = "slam", t.t = 0, this.emit({
			type: "fever-stage",
			stage: "slam",
			round: e
		});
	}
	endcardDone() {
		if (this.mode !== "endcard") throw new WD(`results from ${this.mode}`);
		this.setMode("results");
	}
	resultsDone() {
		if (this.mode !== "results") throw new WD(`normal from ${this.mode}`);
		this.setMode("normal"), this.maybeSpin();
	}
}, qD = 1500, JD = 1 / 240, YD = 2400, XD = 48, ZD = .35, QD = .4, $D = 1880, eO = class {
	pins = fD();
	segs = dD();
	pockets = _D();
	balls = [];
	hatchOpen = !1;
	gyroAngle = 0;
	gyroSpin = 5;
	acc = 0;
	nextId = 1;
	time = 0;
	pinGrid = /* @__PURE__ */ new Map();
	segGrid = /* @__PURE__ */ new Map();
	ballGrid = /* @__PURE__ */ new Map();
	listeners = [];
	rng;
	constructor(e = Math.random) {
		this.rng = e;
		for (let e of this.pins) this.cellPush(this.pinGrid, e.x, e.y, e);
		for (let e of this.segs) {
			let t = Math.floor((Math.min(e.ax, e.bx) - 13) / XD), n = Math.floor((Math.max(e.ax, e.bx) + 13) / XD), r = Math.floor((Math.min(e.ay, e.by) - 13) / XD), i = Math.floor((Math.max(e.ay, e.by) + 13) / XD);
			for (let a = t; a <= n; a++) for (let t = r; t <= i; t++) {
				let n = tO(a, t), r = this.segGrid.get(n);
				r ? r.push(e) : this.segGrid.set(n, [e]);
			}
		}
	}
	on(e) {
		this.listeners.push(e);
	}
	emit(e) {
		for (let t of this.listeners) t(e);
	}
	cellPush(e, t, n, r) {
		let i = tO(Math.floor(t / XD), Math.floor(n / XD)), a = e.get(i);
		a ? a.push(r) : e.set(i, [r]);
	}
	get live() {
		return this.balls.length;
	}
	launch(e) {
		let t = $D + 900 * Math.min(1, Math.max(0, e)) + (this.rng() - .5) * 36, n = {
			id: this.nextId++,
			x: 81,
			y: ZE,
			vx: 0,
			vy: -t,
			phase: "rail-up",
			v: t,
			deg: 180,
			alive: !0,
			spin: 0,
			bornAt: this.time
		};
		return this.balls.push(n), n;
	}
	step(e) {
		for (this.acc += Math.min(e, .05); this.acc >= JD;) this.acc -= JD, this.time += JD, this.substep(JD);
		this.balls = this.balls.filter((e) => e.alive);
	}
	get alpha() {
		return this.acc / JD;
	}
	substep(e) {
		this.gyroAngle += this.gyroSpin * e, this.ballGrid.clear();
		for (let e of this.balls) e.alive && e.phase === "free" && this.cellPush(this.ballGrid, e.x, e.y, e);
		for (let t of this.balls) t.alive && (t.phase === "rail-up" ? this.railUp(t, e) : t.phase === "rail-arc" ? this.railArc(t, e) : t.phase === "foul" ? this.foul(t, e) : t.phase === "warp" ? this.warp(t, e) : this.free(t, e));
	}
	railUp(e, t) {
		e.v -= (qD + ZD * e.v) * t, e.y -= e.v * t, e.spin += e.v * t / 13, e.v <= 0 ? e.phase = "foul" : e.y <= YE.cy && (e.phase = "rail-arc", e.deg = 180, e.y = YE.cy);
	}
	railArc(e, t) {
		let n = e.deg * Math.PI / 180;
		e.v += (qD * Math.cos(n) - ZD * e.v) * t, e.deg += e.v * t / XE * (180 / Math.PI);
		let r = e.deg * Math.PI / 180;
		if (e.x = YE.cx + XE * Math.cos(r), e.y = YE.cy + XE * Math.sin(r), e.spin += e.v * t / 13, e.v <= 0) {
			e.deg < 214 ? (e.phase = "foul", e.x = YE.cx - XE | 0) : this.release(e);
			return;
		}
		let i = e.v * e.v + qD * XE * Math.sin(r) >= 0;
		(e.deg > 214 && !i || e.deg >= 354) && this.release(e);
	}
	release(e) {
		let t = e.deg * Math.PI / 180;
		e.vx = -Math.sin(t) * e.v, e.vy = Math.cos(t) * e.v, e.x = YE.cx + (XE - 1.5) * Math.cos(t), e.y = YE.cy + (XE - 1.5) * Math.sin(t), e.phase = "free";
	}
	warp(e, t) {
		let n = e.warpSide ?? -1;
		e.warpT = (e.warpT ?? 0) + t / .9;
		let r = Math.min(1, e.warpT), i = $E, a = n < 0 ? i.x - 7 : i.x + i.w + 7, o = n < 0 ? i.x + 97 : i.x + i.w - 97, s = i.y + i.h + 3, c = 1 - r;
		e.x = c * c * a + 2 * c * r * o + r * r * aD.x, e.y = c * c * 700 + 2 * c * r * s + r * r * aD.y, e.spin += t * 20 * -n, r >= 1 && (e.phase = "free", e.x = aD.x + (this.rng() - .5) * 30, e.y = aD.y, e.vx = (this.rng() - .5) * 90, e.vy = 40, this.emit({
			type: "stage-drop",
			ball: e
		}));
	}
	foul(e, t) {
		e.y < YE.cy && e.x < 82 && (e.x = 81), e.vy = Math.min(YD, (e.vy > 0 ? e.vy : 0) + qD * t), e.y < YE.cy && (e.x = 81), e.y += e.vy * t, e.y >= 1560 && (e.alive = !1, this.emit({
			type: "foul",
			ball: e
		}));
	}
	free(e, t) {
		e.vy += qD * t;
		let n = Math.hypot(e.vx, e.vy);
		if (n > YD && (e.vx *= YD / n, e.vy *= YD / n), e.x += e.vx * t, e.y += e.vy * t, e.spin += e.vx * t / 13, Math.abs(e.vx) + Math.abs(e.vy) < 30) {
			if (e.still = (e.still ?? 0) + t, e.still > 1.2 && (e.vx = (this.rng() < .5 ? -1 : 1) * (80 + this.rng() * 80), e.vy = -60, e.still > 4)) {
				e.alive = !1, this.emit({
					type: "drain",
					ball: e
				});
				return;
			}
		} else e.still &&= Math.max(0, e.still - t * .5);
		let r = Math.floor(e.x / XD), i = Math.floor(e.y / XD);
		for (let t = -1; t <= 1; t++) for (let n = -1; n <= 1; n++) {
			let a = tO(r + t, i + n), o = this.pinGrid.get(a);
			if (o) for (let t of o) this.hitCircle(e, t.x, t.y, 5, .48, !0);
			let s = this.ballGrid.get(a);
			if (s) for (let t of s) t !== e && t.id > e.id && this.hitBall(e, t);
		}
		let a = this.segGrid.get(tO(r, i));
		if (a) for (let t of a) t.tag === "flap" && this.hatchOpen || this.hitSeg(e, t);
		for (let t of rD) {
			let n = e.x - t.x, r = e.y - t.y, i = Math.hypot(n, r);
			if (i < t.r + 13 && this.hitCircle(e, t.x, t.y, t.r, .4, !1)) {
				let a = -r / i, o = n / i;
				e.vx += a * this.gyroSpin * t.spin * t.r * .5, e.vy += o * this.gyroSpin * t.spin * t.r * .5, this.emit({
					type: "gyro",
					x: e.x,
					y: e.y
				});
			}
		}
		for (let t of iD) if (e.x > t.x0 && e.x < t.x1 && e.y > t.y0 && e.y < t.y1) {
			if (e.warpTried || (e.warpTried = !0, this.rng() > QD)) continue;
			e.phase = "warp", e.warpT = 0, e.warpSide = t.side, this.emit({
				type: "warp",
				ball: e,
				side: t.side
			});
			return;
		}
		for (let t of this.pockets) if ((t.kind !== "hatch" || this.hatchOpen) && e.x > t.x0 && e.x < t.x1 && e.y > t.y0 && e.y < t.y1 && e.vy > -50) {
			e.alive = !1, this.emit({
				type: "pocket",
				pocket: t,
				ball: e
			});
			return;
		}
		e.y > 1592 && (e.alive = !1, this.emit({
			type: "drain",
			ball: e
		})), (e.x < 40 || e.x > 1e3 || e.y < 200) && (e.y < 200 || e.x < 40 || e.x > 1e3) && (e.alive = !1, this.emit({
			type: "drain",
			ball: e
		}));
	}
	hitCircle(e, t, n, r, i, a) {
		let o = e.x - t, s = e.y - n, c = r + 13, l = o * o + s * s;
		if (l >= c * c || l === 0) return !1;
		let u = Math.sqrt(l), d = o / u, f = s / u;
		e.x = t + d * c, e.y = n + f * c;
		let p = e.vx * d + e.vy * f;
		if (p < 0) {
			let r = (this.rng() - .5) * 18;
			e.vx -= (1 + i) * p * d, e.vy -= (1 + i) * p * f;
			let o = -p > 40 ? .985 : 1;
			e.vx = e.vx * o + -f * r, e.vy = e.vy * o + d * r, a && -p > 120 && this.emit({
				type: "pin",
				x: t,
				y: n,
				speed: -p
			});
		}
		return !0;
	}
	hitSeg(e, t) {
		let n = t.bx - t.ax, r = t.by - t.ay, i = n * n + r * r, a = ((e.x - t.ax) * n + (e.y - t.ay) * r) / i;
		a = a < 0 ? 0 : a > 1 ? 1 : a;
		let o = t.ax + n * a, s = t.ay + r * a, c = e.x - o, l = e.y - s, u = c * c + l * l;
		if (u >= 169) return;
		let d = Math.sqrt(u), f, p;
		if (d < 1e-6) {
			f = -r, p = n;
			let e = Math.hypot(f, p);
			f /= e, p /= e, d = 0;
		} else f = c / d, p = l / d;
		e.x = o + f * 13, e.y = s + p * 13;
		let m = e.vx * f + e.vy * p;
		m < 0 && (e.vx -= (1 + t.e) * m * f, e.vy -= (1 + t.e) * m * p, -m > 40 && (e.vx *= .99, e.vy *= .99), -m > 260 && this.emit({
			type: "wall",
			x: o,
			y: s,
			speed: -m
		}));
	}
	hitBall(e, t) {
		let n = t.x - e.x, r = t.y - e.y, i = n * n + r * r;
		if (i >= 676 || i === 0) return;
		let a = Math.sqrt(i), o = n / a, s = r / a, c = (26 - a) / 2;
		e.x -= o * c, e.y -= s * c, t.x += o * c, t.y += s * c;
		let l = (t.vx - e.vx) * o + (t.vy - e.vy) * s;
		if (l < 0) {
			let n = -1.5 * l / 2;
			e.vx -= n * o, e.vy -= n * s, t.vx += n * o, t.vy += n * s;
		}
	}
};
function tO(e, t) {
	return (e + 64) * 4096 + (t + 64);
}
// src/game/shows.ts
var nO = (e, t) => e.tw.wait(t);
function rO(e, t, n, r = {}) {
	let i = e.lcd.toBoard(t, n);
	e.fx.emit({
		...r,
		tex: e.fxt[r.tex ?? "spark"],
		x: i.x,
		y: i.y
	});
}
function iO(e, t, n, r) {
	if (e.art.has(t)) return wD(Z(e.art.tex(t)), n, r);
}
async function aO(e) {
	e.audio.play("sfx_reach_alert");
	let t = new H();
	t.position.set(300, 92);
	let n = iO(e, "plateReach", 520, 140);
	n && t.addChild(n);
	let r = Z(e.fxt.streak);
	r.tint = Q.magenta, r.blendMode = "add", r.scale.set(5.5, 5);
	let i = e.art.has("reachBanner"), a = (t) => {
		if (!i) return t === Q.cyan ? FD("REACH", 104, Q.cyan) : FD("REACH", 104, Q.magenta, MD);
		let n = ED(e.art.frames("reachBanner", "pulse"), 16);
		return n.anchor.set(.5), n.scale.set(.9), t !== void 0 && (n.tint = t), n;
	}, o = a(Q.magenta), s = a(Q.cyan);
	o.alpha = s.alpha = i ? .3 : .6, o.blendMode = s.blendMode = "add";
	let c = a();
	t.addChild(r, o, s, c), e.lcd.overlay.addChild(t), t.scale.set(3.2), t.alpha = 0, e.hooks.flash(Q.magenta, .35, 220), await e.tw.to(t, { alpha: 1 }, 90), await e.tw.to(t.scale, {
		x: 1,
		y: 1
	}, 260, zE), e.shake.add(.35), rO(e, 300, 92, {
		n: 36,
		speed: [200, 620],
		life: [.3, .7],
		tint: [
			Q.magenta,
			Q.white,
			Q.violet
		],
		scale: [.4, .9]
	}), await e.tw.run(420, (e) => {
		o.x = -14 * (1 - e), s.x = 14 * (1 - e), i && (o.alpha = s.alpha = .3 * (1 - e));
	}, RE), await nO(e, 700), e.tw.to(t, {
		alpha: 0,
		y: 70
	}, 380).then(() => t.destroy({ children: !0 }));
}
function oO(e, t) {
	let n = [];
	for (let r of t) {
		let t = Z(e.fxt.glow);
		t.tint = Q.magenta, t.blendMode = "add", t.scale.set(2.4, 2.6), t.position.set(e.lcd.reelX[r], e.lcd.centerY), t.alpha = 0, e.lcd.reelLayer.addChildAt(t, 0), e.tw.to(t, { alpha: .65 }, 300), n.push(t);
	}
	return n;
}
async function sO(e, t) {
	let [n, r, i] = t.reels, a = e.lcd.reels;
	await e.lcd.setBackdrop("lcdReel", 300), e.audio.play("sfx_reel_spin", {
		vol: .7,
		max: 1
	});
	for (let e of a) e.spin();
	if (t.surge && e.hooks.surge(!0), await nO(e, 1100), e.audio.play("sfx_reel_stop_1"), await a[0].stop(e.tw, n, 380), rO(e, e.lcd.reelX[0], e.lcd.centerY, {
		n: 8,
		speed: [60, 200],
		tint: Q.cyan,
		life: [.2, .4]
	}), await nO(e, 260), e.audio.play("sfx_reel_stop_2"), await a[2].stop(e.tw, i, 380), rO(e, e.lcd.reelX[2], e.lcd.centerY, {
		n: 8,
		speed: [60, 200],
		tint: Q.cyan,
		life: [.2, .4]
	}), t.kind === "miss") {
		await nO(e, 420), e.audio.play("sfx_reel_stop_3"), await a[1].stop(e.tw, r, 420), e.hooks.surge(!1), await nO(e, 650);
		return;
	}
	e.onReach();
	let o = t.tier ?? "quick";
	e.hooks.reachMusic(o), e.hooks.halo("reach"), a[1].speed = 9;
	let s = oO(e, [0, 2]), c = e.art.frames("vfxReachGlow", "loop"), l;
	c.length && (l = ED(c, 20), l.blendMode = "add", l.tint = o === "quick" ? Q.cyan : o === "stepup" ? 6160282 : Q.magenta, l.position.set(300, 225), l.width = 630, l.height = 472.5, e.lcd.overlay.addChildAt(l, 0)), o === "quick" && e.lcd.setBackdrop("lcdReachQuick", 400), await aO(e), o === "quick" ? await cO(e, t) : o === "stepup" ? await uO(e, t) : await gO(e, t);
	for (let t of s) e.tw.to(t, { alpha: 0 }, 300).then(() => t.destroy());
	if (l) {
		let t = l;
		e.tw.to(t, { alpha: 0 }, 300).then(() => t.destroy());
	}
	e.hooks.surge(!1), t.kind !== "hit" && (e.audio.play("sfx_reach_miss"), e.hooks.reachMusic("none"), e.hooks.halo("idle"), await e.tw.to(e.lcd.reelLayer, { alpha: .55 }, 260), await nO(e, 600), await e.tw.to(e.lcd.reelLayer, { alpha: 1 }, 300), await e.lcd.setBackdrop("lcdReel", 400));
}
async function cO(e, t) {
	let n = Math.max(2400, e.tune.reach.quickMs - 2600);
	e.audio.play("sfx_reach_sting_1"), await e.lcd.reels[1].crawl(e.tw, t.reels[1], n, 7), e.audio.play("sfx_reel_stop_3"), await nO(e, 400);
}
async function lO(e, t = 520) {
	e.audio.play("sfx_stepup_whoosh");
	let n = e.art.tex(e.lcd.current), r = [];
	for (let t = 0; t < 9; t++) {
		let i = CD(Z(n, .5, .5), 600, 450);
		i.position.set(300, 225);
		let a = new KS().rect(0, t * 450 / 9, 600, 51).fill(16777215);
		i.mask = a, i.tint = t % 2 ? Q.cyan : Q.magenta, i.blendMode = "add", i.alpha = .7, e.lcd.overlay.addChild(a, i), r.push(i);
	}
	e.hooks.flash(Q.cyan, .4, 160), e.shake.add(.3), await e.tw.run(t, (t) => {
		for (let [e, n] of r.entries()) n.x = 300 + Math.sin(t * 40 + e * 2.1) * 40 * (1 - t), n.alpha = .7 * (1 - t);
		e.lcd.reels[1].root.x = e.lcd.reelX[1] + Math.sin(t * 60) * 10 * (1 - t);
	}), e.lcd.reels[1].root.x = e.lcd.reelX[1];
	for (let e of r) e.mask.destroy(), e.destroy();
}
async function uO(e, t) {
	e.audio.play("sfx_reach_sting_2"), await e.lcd.setBackdrop("lcdReachStep", 500);
	let n = e.tune.reach.stepUpMs, r = t.stepUpFirst ?? t.reels[1];
	if (await e.lcd.reels[1].crawl(e.tw, r, Math.max(3e3, n * .4), 8), e.audio.play("sfx_reel_stop_3"), await nO(e, 700), !t.stepUpRespin) return;
	await lO(e);
	let i = PD("RE-SPIN!", 46, Q.cyan, "900");
	i.position.set(300, 400), e.lcd.overlay.addChild(i), i.scale.set(.2), e.tw.to(i.scale, {
		x: 1,
		y: 1
	}, 300, zE), e.lcd.reels[1].spin(), e.lcd.reels[1].speed = 20, await nO(e, Math.max(1200, n * .15)), e.shake.add(.2), await e.lcd.reels[1].crawl(e.tw, t.reels[1], Math.max(2400, n * .25), 6), e.audio.play("sfx_reel_stop_3"), e.tw.to(i, { alpha: 0 }, 300).then(() => i.destroy()), await nO(e, 500);
}
async function dO(e, t, n, r, i = Q.cyan) {
	let a = new H(), o = CD(Z(e.art.tex("cutBg")), 720, 240);
	o.position.set(300, 0);
	let s = new KS().poly([
		-600,
		-96,
		1200,
		-140,
		1200,
		110,
		-600,
		140
	]).fill(16777215);
	a.addChild(s, o), o.mask = s;
	let c = e.art.frames(t, "cutin"), l = c.length > 1 ? new oE(c) : Z(e.art.tex(t, "point"));
	l.anchor.set(.5, .62), l instanceof oE && (l.loop = !1, l.animationSpeed = .4, l.play()), wD(l, 330, 330), l.position.set(t === "nova" ? 150 : 450, 10);
	let u = FD(n, n.length > 10 ? 54 : 62, i, t === "lyra" ? MD : void 0), d = u.width > 360 ? 360 / u.width : 1;
	u.scale.set(d), u.position.set(t === "nova" ? 384 : 216, 4), a.addChild(l, u), a.position.set(0, 225), a.x = t === "nova" ? -600 : 600, e.lcd.overlay.addChild(a), e.hooks.flash(Q.white, .5, 140), e.audio.play("sfx_thrust_burst", { vol: .8 }), await e.tw.to(a, { x: 0 }, 300, BE), e.shake.add(.25), await e.tw.run(Math.max(600, r - 600), (e) => {
		l.x += t === "nova" ? .35 : -.35, u.scale.set(d * (1 + .04 * Math.sin(e * 20)));
	}), await e.tw.to(a, {
		x: t === "nova" ? 600 : -600,
		alpha: .4
	}, 300, VE), a.destroy({ children: !0 });
}
async function fO(e, t) {
	let n = new KS();
	n.blendMode = "add", e.lcd.overlay.addChild(n);
	let r = 0, i = 0;
	await e.tw.run(t, (t) => {
		if (r++, r < i) return;
		i = r + 3 + Math.floor(Math.random() * 4), n.clear();
		let a = 1 + Math.floor(Math.random() * 2);
		for (let e = 0; e < a; e++) {
			let e = Math.random() * 600, r = -10, i = [e, r];
			for (; r < 450;) e += (Math.random() - .5) * 70, r += 20 + Math.random() * 40, i.push(e, r);
			let a = Math.random() < .5 ? Q.cyan : Q.violet;
			n.poly(i, !1).stroke({
				width: 14,
				color: a,
				alpha: .18 * (1 - t * .3)
			}), n.poly(i, !1).stroke({
				width: 5,
				color: a,
				alpha: .5
			}), n.poly(i, !1).stroke({
				width: 2,
				color: 16777215,
				alpha: .95
			});
		}
		Math.random() < .3 && TD(e.lcd.overlay, e.art.frames("vfxBolt", "loop"), Math.random() * 600, Math.random() * 450, {
			scale: .9 + Math.random() * .6,
			rotation: (Math.random() - .5) * 2.4,
			fps: 30
		}), Math.random() < .35 && (e.audio.play("sfx_crack_creak", {
			vol: .35,
			max: 2
		}), e.shake.add(.12));
	}), n.destroy();
}
function pO(e, t) {
	for (let n = 0; n < 5; n++) {
		let r = n % 2 ? "drone" : "asteroid", i = wD(Z(e.art.tex(r)), 90 + Math.random() * 60, 90 + Math.random() * 60), a = 60 + Math.random() * 330;
		i.position.set(-120, a), i.alpha = .95, e.lcd.backdrop.addChild(i);
		let o = n * t / 6;
		e.tw.wait(o).then(() => e.tw.to(i, {
			x: 740,
			y: a + (Math.random() - .5) * 120,
			rotation: (Math.random() - .5) * 4
		}, t * .5, UE).then(() => i.destroy()));
	}
}
async function mO(e, t, n, r, i) {
	let a = new oE(e.art.frames("capsule", "intact"));
	a.anchor.set(.5), a.scale.set(1.05), a.animationSpeed = 12 / 60, a.play(), r.addChild(i, a), r.scale.set(.2), r.alpha = 0, e.lcd.overlay.addChild(r), await e.lcd.showReels(!1), e.tw.to(r, { alpha: 1 }, 250), await e.tw.to(r.scale, {
		x: 1,
		y: 1
	}, 600, HE), e.tw.to(i, { alpha: .8 }, 800);
	let o = e.art.frames("capsule", "crack");
	a.stop(), a.textures = o;
	for (let n = 0; n < 6; n++) {
		let s = Math.round((n + 1) / 6 * (o.length - 1));
		a.gotoAndStop(s), e.audio.play("sfx_crack_creak", { vol: .8 }), e.shake.add(.18), r.x = 300 + (Math.random() - .5) * 12, i.alpha = .6 + n / 6 * .4, await nO(e, t * .55 / 6);
	}
	r.x = 300, n && await e.hooks.waitPush(3e3), e.audio.play("sfx_crack_shatter"), e.hooks.flash(Q.white, .85, 260), e.shake.add(.6), a.textures = e.art.frames("capsule", "shatter"), a.loop = !1, a.animationSpeed = 30 / 60, a.gotoAndPlay(0), rO(e, 300, 225, {
		tex: "chip",
		n: 50,
		speed: [250, 700],
		life: [.5, 1.1],
		tint: [
			Q.cyan,
			Q.white,
			Q.violet,
			Q.magenta
		],
		scale: [.4, .9],
		gravity: 300,
		spin: 8
	}), rO(e, 300, 225, {
		tex: "ring",
		n: 1,
		speed: [0, 0],
		life: [.5, .5],
		scale: [.3, .3],
		endScale: 14,
		tint: Q.white
	}), await nO(e, 420), await e.lcd.showReels(!0), e.tw.to(r, { alpha: 0 }, 400).then(() => r.destroy({ children: !0 }));
}
async function hO(e, t, n) {
	let r = new H();
	r.position.set(300, 233);
	let i = Z(e.fxt.glow);
	if (i.tint = Q.violet, i.blendMode = "add", i.scale.set(4), i.alpha = 0, e.art.frames("capsule", "crack").length > 0) return mO(e, t, n, r, i);
	let a = wD(Z(e.art.tex("capsule")), 230, 230), o = new KS();
	o.blendMode = "add", r.addChild(i, a, o), r.scale.set(.2), r.alpha = 0, e.lcd.overlay.addChild(r), await e.lcd.showReels(!1), e.tw.to(r, { alpha: 1 }, 250), await e.tw.to(r.scale, {
		x: 1,
		y: 1
	}, 600, HE), e.tw.to(i, { alpha: .8 }, 800);
	let s = [];
	for (let n = 0; n < 6; n++) {
		let n = Math.random() * Math.PI * 2, i = 0, a = 0, c = [i, a];
		for (let e = 0; e < 5; e++) i += Math.cos(n + (Math.random() - .5) * 1.2) * 22, a += Math.sin(n + (Math.random() - .5) * 1.2) * 22, c.push(i, a);
		s.push(c), o.clear();
		for (let e of s) o.poly(e, !1).stroke({
			width: 9,
			color: Q.cyan,
			alpha: .25
		}), o.poly(e, !1).stroke({
			width: 2.5,
			color: 16777215,
			alpha: 1
		});
		e.audio.play("sfx_crack_creak", { vol: .8 }), e.shake.add(.18), r.x = 300 + (Math.random() - .5) * 12, await nO(e, t * .55 / 6);
	}
	r.x = 300, n && await e.hooks.waitPush(3e3), e.audio.play("sfx_crack_shatter"), e.hooks.flash(Q.white, .85, 260), e.shake.add(.6);
	let c = a.texture, l = [];
	for (let t = 0; t < 4; t++) {
		let n = Z(c);
		n.scale.copyFrom(a.scale);
		let i = c.width * a.scale.x, o = c.height * a.scale.y, s = new KS().rect(t % 2 ? 0 : -i / 2, t < 2 ? -o / 2 : 0, i / 2, o / 2).fill(16777215);
		n.mask = s;
		let u = new H();
		u.addChild(s, n), r.addChild(u), l.push(n);
		let d = t % 2 ? 1 : -1, f = t < 2 ? -1 : 1;
		e.tw.to(u, {
			x: d * 320,
			y: f * 260,
			rotation: d * 1.6,
			alpha: 0
		}, 700, RE);
	}
	a.visible = !1, o.visible = !1, rO(e, 300, 225, {
		tex: "chip",
		n: 50,
		speed: [250, 700],
		life: [.5, 1.1],
		tint: [
			Q.cyan,
			Q.white,
			Q.violet,
			Q.magenta
		],
		scale: [.4, .9],
		gravity: 300,
		spin: 8
	}), rO(e, 300, 225, {
		tex: "ring",
		n: 1,
		speed: [0, 0],
		life: [.5, .5],
		scale: [.3, .3],
		endScale: 14,
		tint: Q.white
	}), await e.lcd.showReels(!0), e.tw.to(i, { alpha: 0 }, 500).then(() => r.destroy({ children: !0 }));
}
async function gO(e, t) {
	let n = e.tune.reach.missionMs / 4e4, r = (e) => Math.max(300, e * n);
	e.audio.play("sfx_reach_sting_3"), e.hooks.flash(Q.white, .9, 320), await e.lcd.setBackdrop("lcdReachA", 300);
	let i = wD(Z(e.art.tex("halo")), 300, 300);
	i.position.set(300, 225), i.blendMode = "add", i.alpha = 0, e.lcd.overlay.addChild(i), await e.tw.to(i, { alpha: 1 }, 200), e.tw.to(i.scale, {
		x: i.scale.x * 1.8,
		y: i.scale.y * 1.8
	}, r(1600), RE), await e.tw.to(i, {
		alpha: 0,
		rotation: 1
	}, r(1600)), i.destroy(), e.lcd.reels[1].speed = 6, await dO(e, "nova", "LOCKING ON!", r(3200)), await e.lcd.setBackdrop("lcdReachB", 500), pO(e, r(7e3)), e.lcd.reels[1].speed = 4, await fO(e, r(5200)), e.shake.add(.5), await dO(e, "lyra", "ORBIT STRIKE", r(3600), Q.magenta), e.shake.add(.7), e.hooks.flash(Q.magenta, .55, 260), e.lcd.reels[1].spinning = !1, e.lcd.reels[1].pos = e.lcd.reels[1].target(t.reels[1], 0), e.lcd.reels[1].blur = 0;
	let a = fO(e, r(9e3));
	await hO(e, r(12e3), t.pushPrompt), await a, e.audio.play("sfx_reel_stop_3"), await nO(e, 600);
}
async function _O(e, t) {
	let n = String(t.reels[0] + 1);
	e.audio.play("sfx_reach_sting_3"), e.hooks.halo("hot"), e.hooks.flash(Q.white, .9, 400), e.shake.add(.6), await e.lcd.showReels(!1);
	let r = [];
	for (let t = 0; t < 3; t++) {
		let i = FD(n, 190, Q.cyan, ND);
		i.position.set(e.lcd.reelX[t], e.lcd.centerY), i.scale.set(3), i.alpha = 0, e.lcd.overlay.addChild(i), r.push(i);
	}
	for (let [t, n] of r.entries()) e.tw.to(n, { alpha: 1 }, 80), await e.tw.to(n.scale, {
		x: 1,
		y: 1
	}, 260, zE), e.audio.play("sfx_round_slam", { vol: .6 }), e.shake.add(.3), rO(e, e.lcd.reelX[t], e.lcd.centerY, {
		tex: "star",
		n: 14,
		speed: [160, 480],
		tint: [
			Q.white,
			16764762,
			Q.cyan
		],
		scale: [.4, .9]
	});
	let i = Z(e.fxt.streak);
	i.blendMode = "add", i.scale.set(2.4, 14), i.rotation = .35, i.position.set(-150, e.lcd.centerY), e.lcd.overlay.addChild(i), await e.tw.to(i, { x: 750 }, 700, UE), i.destroy(), await nO(e, 600);
	for (let t of r) e.tw.to(t, { alpha: 0 }, 300).then(() => t.destroy());
	await vO(e);
}
async function vO(e) {
	e.audio.play("sfx_liftoff_fanfare"), e.audio.play("sfx_lifter_surge");
	let t = new H();
	t.position.set(300, 225);
	let n = new H();
	for (let t = 0; t < 14; t++) {
		let r = Z(e.fxt.streak, 0, .5);
		r.tint = t % 2 ? Q.magenta : 16764762, r.blendMode = "add", r.scale.set(4.5, 2.6), r.rotation = t / 14 * Math.PI * 2, r.alpha = .55, n.addChild(r);
	}
	let r = e.art.has("cardLiftoff"), i = r ? void 0 : iO(e, "plateLiftoff", 560, 260), a;
	if (r) {
		let t = e.art.frames("cardLiftoff", "burst"), n = ED(t.length ? t : e.art.frames("cardLiftoff"), 16);
		n.anchor.set(.5), n.scale.set(560 / (n.texture.width || 560)), a = n;
	} else a = FD("LIFT-OFF!", 112, Q.magenta, ND);
	let o = PD("STARLIFT FEVER", 34, Q.cyan, "900");
	o.y = 88, t.addChild(n), i && t.addChild(i), t.addChild(a, o), t.scale.set(.1), e.lcd.overlay.addChild(t), e.hooks.flash(16764762, .8, 380), e.shake.add(.8), TD(e.lcd.overlay, e.art.frames("vfxFeverBurst", "burst"), 300, 225, { scale: 1.3 });
	for (let t of [108, 600 * .82]) TD(e.lcd.overlay, e.art.frames("vfxLiftoff", "launch"), t, 205, {
		scale: 1.15,
		fps: 24
	});
	await e.tw.to(t.scale, {
		x: 1,
		y: 1
	}, 420, zE), rO(e, 300, 285, {
		tex: "glow",
		n: 30,
		speed: [100, 400],
		angle: [Math.PI * .35, Math.PI * .65],
		life: [.6, 1.2],
		tint: [
			16764762,
			Q.magenta,
			Q.white
		],
		scale: [.3, .7],
		gravity: 500
	}), rO(e, 300, 225, {
		tex: "chip",
		n: 70,
		speed: [300, 800],
		life: [.8, 1.6],
		tint: [
			Q.cyan,
			Q.white,
			16764762,
			Q.magenta
		],
		scale: [.35, .8],
		gravity: 600,
		spin: 10
	}), await e.tw.run(2200, (e) => {
		n.rotation = e * 1.2, a.scale.set(1 + .05 * Math.sin(e * 30));
	}), await e.tw.to(t, { alpha: 0 }, 350), t.destroy({ children: !0 }), await e.lcd.showReels(!0);
}
async function yO(e) {
	e.audio.play("sfx_fever_siren"), await e.lcd.setBackdrop("lcdFever", 300), TD(e.lcd.overlay, e.art.frames("vfxFeverBurst", "burst"), 300, 225, { scale: 1.2 }), await e.lcd.showReels(!1);
	let t = e.tune.feverIntroMs, n = setInterval(() => rO(e, 300, 225, {
		tex: "streak",
		n: 6,
		speed: [700, 1300],
		life: [.3, .5],
		scale: [.3, .6],
		endScale: 2,
		tint: [
			Q.cyan,
			Q.white,
			Q.magenta
		]
	}), 50), r = wD(Z(e.art.tex("lyra", "salute"), .5, .6), 320, 320);
	r.position.set(300, 650), e.lcd.overlay.addChild(r);
	let i = FD("STARLIFT FEVER", 64, Q.magenta, MD);
	i.position.set(300, 70), i.alpha = 0, e.lcd.overlay.addChild(i), e.tw.to(r, { y: 285 }, 700, zE), e.tw.to(i, { alpha: 1 }, 300), await e.tw.run(Math.max(600, t - 500), (e) => {
		i.alpha = .6 + .4 * Math.abs(Math.sin(e * 18));
	}), clearInterval(n), e.tw.to(r, { alpha: 0 }, 300).then(() => r.destroy()), await e.tw.to(i, { alpha: 0 }, 250), i.destroy();
}
async function bO(e, t) {
	e.audio.play("sfx_round_slam"), e.audio.play("sfx_round_fanfare", { vol: .7 }), TD(e.lcd.overlay, e.art.frames("vfxWipe", "wipe"), 300, 225, {
		scale: .5390625,
		fps: 40
	});
	let n = new H();
	n.position.set(300, 225);
	let r = e.art.frames("numFever", `${t}_shine`).length > 0, i;
	if (e.art.has("roundCard")) {
		let t = Z(e.art.tex("roundCard"));
		t.anchor.set(.5), t.scale.set(220 / (t.texture.width || 220)), i = t;
	} else i = PD("ROUND", 46, Q.cyan, "900");
	i.y = r ? -150 : -96;
	let a = (n) => {
		if (!r) return n === Q.cyan ? FD(String(t), 220, Q.cyan) : FD(String(t), 220, Q.magenta, n === Q.magenta ? MD : ND);
		let i = ED(n === void 0 ? e.art.frames("numFever", `${t}_shine`) : e.art.frames("numFever", String(t)), 14);
		return i.anchor.set(.5), i.scale.set(260 / (i.texture.height || 260)), n !== void 0 && (i.tint = n), i;
	}, o = a(), s = a(Q.magenta), c = a(Q.cyan);
	s.alpha = c.alpha = .55, s.blendMode = c.blendMode = "add", n.addChild(s, c, o, i), n.scale.set(4), n.alpha = 0, e.lcd.overlay.addChild(n), e.tw.to(n, { alpha: 1 }, 80), await e.tw.to(n.scale, {
		x: 1,
		y: 1
	}, 240, LE), e.shake.add(.65), e.hooks.flash(Q.white, .6, 200), e.hooks.halo("fever"), rO(e, 300, 225, {
		tex: "ring",
		n: 1,
		speed: [0, 0],
		life: [.6, .6],
		scale: [.4, .4],
		endScale: 12,
		tint: Q.cyan
	}), rO(e, 300, 225, {
		tex: "star",
		n: 30,
		speed: [300, 800],
		tint: [
			Q.white,
			Q.magenta,
			Q.cyan
		],
		scale: [.4, .9],
		life: [.4, .8]
	}), await e.tw.run(500, (e) => {
		s.x = -18 * (1 - e), c.x = 18 * (1 - e);
	}, RE), await nO(e, Math.max(200, e.tune.roundSlamMs - 900)), await e.tw.to(n, {
		alpha: 0,
		y: 195
	}, 200), n.destroy({ children: !0 });
}
async function xO(e, t, n, r) {
	await e.lcd.setBackdrop("lcdGet", 300);
	let i = new H();
	i.position.set(300, 225);
	let a;
	if (e.art.has("cardGet")) {
		let t = e.art.frames("cardGet", "shine"), n = ED(t.length ? t : e.art.frames("cardGet"), 16);
		n.anchor.set(.5), n.scale.set(400 / (n.texture.width || 400)), a = n;
	} else a = FD("GET", 120, Q.cyan);
	a.y = -100;
	let o = FD("0", 130, Q.magenta, ND);
	o.y = 30;
	let s = PD(`TOTAL ${n - t}`, 36, 14678271, "800");
	s.y = 150, i.addChild(a, o, s), i.alpha = 0, e.lcd.overlay.addChild(i), await e.tw.to(i, { alpha: 1 }, 200);
	let c = -1;
	await e.tw.run(Math.min(1400, r * .4), (n) => {
		let r = Math.round(t * n);
		r !== c && (c = r, o.text = String(r), r % 3 == 0 && e.audio.play("sfx_get_tick", {
			vol: .5,
			max: 2
		}));
	}, RE), o.text = String(t), s.text = `TOTAL ${n}`, e.audio.play("sfx_get_total"), rO(e, 300, 255, {
		tex: "chip",
		n: 40,
		speed: [200, 600],
		angle: [-Math.PI * .85, -Math.PI * .15],
		gravity: 900,
		life: [.7, 1.3],
		tint: [
			Q.cyan,
			Q.white,
			Q.violet
		],
		scale: [.35, .75],
		spin: 8
	}), e.tw.to(o.scale, {
		x: 1.15,
		y: 1.15
	}, 120).then(() => e.tw.to(o.scale, {
		x: 1,
		y: 1
	}, 260, zE)), await nO(e, Math.max(300, r * .6 - 700)), await e.tw.to(i, { alpha: 0 }, 250), i.destroy({ children: !0 }), await e.lcd.setBackdrop("lcdFever", 300);
}
async function SO(e, t) {
	e.audio.cutMusic(), e.audio.play("sfx_end_stinger"), e.lcd.showReels(!1), await e.lcd.setBackdrop("lcdEnd", 300);
	let n = new H();
	n.position.set(300, 225);
	let r = new H();
	for (let t = 0; t < 12; t++) {
		let n = Z(e.fxt.streak, 0, .5);
		n.tint = t % 2 ? Q.cyan : Q.violet, n.blendMode = "add", n.scale.set(4.5, 2), n.rotation = t / 12 * Math.PI * 2, n.alpha = .4, r.addChild(n);
	}
	let i = FD("MISSION", 72, Q.cyan);
	i.y = -86;
	let a = FD("COMPLETE", 72, Q.magenta, MD);
	a.width > 540 && a.scale.set(540 / a.width), a.y = 4;
	let o = PD(`${t} BALLS`, 46, 16777215, "900");
	if (o.y = 110, e.art.has("cardMission")) {
		let t = e.art.frames("cardMission", "shine"), i = ED(t.length ? t : e.art.frames("cardMission"), 12);
		i.anchor.set(.5), i.scale.set(540 / (i.texture.width || 540)), i.y = -40, n.addChild(r, i, o);
	} else n.addChild(r, i, a, o);
	n.scale.set(.3), e.lcd.overlay.addChild(n), e.hooks.flash(Q.white, .8, 300), e.shake.add(.5), await e.tw.to(n.scale, {
		x: 1,
		y: 1
	}, 500, zE);
	let s = e.art.frames("vfxConfetti", "rain");
	if (s.length) for (let t of [150, 450]) TD(e.lcd.overlay, s, t, 225, {
		scale: 1.2,
		add: !1,
		fps: 24
	});
	let c = setInterval(() => rO(e, Math.random() * 600, -10, {
		tex: Math.random() < .5 ? "chip" : "star",
		n: 2,
		speed: [40, 120],
		angle: [Math.PI * .4, Math.PI * .6],
		gravity: 260,
		life: [1.4, 2.2],
		tint: [
			Q.cyan,
			Q.magenta,
			Q.white,
			Q.violet
		],
		scale: [.3, .6],
		spin: 6
	}), 60);
	await e.tw.run(3e3, (e) => {
		r.rotation = e * .8;
	}), clearInterval(c), await e.tw.to(n, { alpha: 0 }, 500), n.destroy({ children: !0 }), await e.lcd.setBackdrop("lcdIdle", 800), await e.lcd.showReels(!0);
}
async function CO(e, t, n, r) {
	let i = new H();
	i.position.set(300, 235);
	let a = wD(Z(e.art.tex("gauge")), 270, 270), o = new KS();
	o.blendMode = "add";
	let s = Z(e.fxt.streak, .1, .5);
	s.scale.set(1, 1.3), s.tint = Q.magenta, s.blendMode = "add";
	let c = e.art.has("cardReady"), l = c ? void 0 : iO(e, "plateReady", 420, 110), u = FD("READY...", 70, Q.cyan);
	u.y = -170, l && (l.y = -170, i.addChild(l));
	let d;
	if (c) {
		let t = e.art.frames("cardReady", "pulse"), n = ED(t.length ? t : e.art.frames("cardReady"), 16);
		n.anchor.set(.5), n.scale.set(420 / (n.texture.width || 420)), n.y = -170, d = n, u.visible = !1, i.addChild(n);
	}
	let f = e.art.frames("gauge", "fill"), p = f.length > 1;
	p && (a.texture = f[0], wD(a, 300, 300), o.visible = s.visible = !1), i.addChild(a, o, s, u), i.alpha = 0, e.lcd.overlay.addChild(i), await e.lcd.showReels(!1), await e.tw.to(i, { alpha: 1 }, 250), e.audio.play("sfx_push_click"), await nO(e, 900), u.text = "PUSH!", u.style = FD("PUSH!", 84, Q.magenta, MD).style, u.visible = !0, d && (d.visible = !1), e.audio.play("sfx_reach_alert", { vol: .6 });
	let m = n.count, h = 0;
	e.audio.bed("sfx_mash_rev", .8), await e.tw.run(t, (e) => {
		let t = n.count - m, r = Math.min(1, Math.max(e * .95, t / 22 + e * .4));
		h += (r - h) * .12;
		let i = Math.PI * .75, c = i + h * Math.PI * 1.5;
		o.clear(), o.arc(0, 0, 104, i, c).stroke({
			width: 22,
			color: h > .85 ? Q.magenta : Q.cyan,
			alpha: .3
		}), o.arc(0, 0, 104, i, c).stroke({
			width: 8,
			color: 16777215,
			alpha: .9
		}), s.rotation = c, p && (a.texture = f[Math.min(f.length - 1, Math.round(h * (f.length - 1)))]), u.scale.set(1 + .06 * Math.sin(e * 60));
	}), e.audio.bed("sfx_mash_rev", 0), e.audio.play("sfx_thrust_burst"), TD(e.lcd.overlay, e.art.frames("vfxExhaust", "loop"), 300, 415, {
		scale: 1.4,
		fps: 30
	}), e.hooks.flash(Q.magenta, .7, 300), e.shake.add(.7), rO(e, 300, 345, {
		tex: "glow",
		n: 60,
		speed: [200, 700],
		angle: [Math.PI * .3, Math.PI * .7],
		gravity: 400,
		life: [.4, 1],
		tint: [
			16764762,
			Q.magenta,
			Q.white
		],
		scale: [.4, .8]
	}), await e.tw.to(i, {
		y: -300,
		alpha: 0
	}, 600, VE), i.destroy({ children: !0 });
	let g = FD(`BONUS +${await r()}`, 76, Q.cyan, ND);
	g.position.set(300, 225), g.scale.set(.2), e.lcd.overlay.addChild(g), e.audio.play("sfx_get_total"), await e.tw.to(g.scale, {
		x: 1,
		y: 1
	}, 380, zE), rO(e, 300, 225, {
		tex: "chip",
		n: 40,
		speed: [200, 600],
		gravity: 700,
		tint: [
			Q.cyan,
			Q.white,
			16764762
		],
		scale: [.35, .7],
		spin: 8
	}), await nO(e, 1300), await e.tw.to(g, { alpha: 0 }, 300), g.destroy(), await e.lcd.showReels(!0);
}
// src/game/table.ts
var wO = 1022, TO = 268, EO = 1612, DO = 50, OO = 1344 / DO;
function kO(e) {
	return e <= .6 ? .24 + e / .6 * .16 : e <= .75 ? .4 + (e - .6) / .15 * .4 : .8 + (e - .75) / .25 * .2;
}
var AO = .76, jO = class {
	art;
	tune;
	provider;
	audio;
	ui;
	root = new H();
	world = new H();
	machine;
	physics;
	fx = new bD(1100);
	shake = new SD();
	fxt;
	lcd;
	ctx;
	balance = 0;
	power = .35;
	firing = !1;
	locked = !1;
	paused = !1;
	timeScale = 1;
	fireAcc = 0;
	time = 0;
	ballLayer = new H();
	pinLayer = new H();
	pinSprites = [];
	dockS;
	satS = [];
	hatchAnim;
	ballSprites = /* @__PURE__ */ new Map();
	ballPool = [];
	liftBalls = [];
	liftOffset = 0;
	liftGlows = [];
	stl;
	stlSurge = !1;
	ledStrips = [];
	stripLevel = "idle";
	pushDown = !1;
	liftPulse = 0;
	liftGlow;
	surgeOn = !1;
	leds = [];
	ledLevel = "normal";
	haloGlow;
	ringBloom;
	ringLight;
	ringDots = [];
	wingLamps = [];
	haloMode = "idle";
	halo;
	gyros = [];
	door;
	doorGlow;
	lamps = [];
	flashS;
	bg;
	bgFever;
	roundTag = new H();
	roundText;
	hatchCount;
	timerText;
	shootRight;
	dial;
	dialArc = [];
	push;
	pushGlow;
	pushPrompt;
	ballsText;
	liveText;
	lockText;
	inflightPort = 0;
	mash = { count: 0 };
	feverTotal = 0;
	lastPinSound = 0;
	sparkBudget = 0;
	constructor(e, t, n, r, i, a) {
		this.art = t, this.tune = n, this.provider = r, this.audio = i, this.ui = a, this.fxt = yD(e.renderer), this.machine = new KD(n), this.physics = new eO(), this.lcd = new UD(t, q), this.root.addChild(this.world), this.bg = CD(Z(t.tex("bgField")), qE, JE), this.bg.position.set(qE / 2, JE / 2), this.bgFever = CD(Z(t.tex("bgFever")), qE, JE), this.bgFever.position.set(qE / 2, JE / 2), this.bgFever.alpha = 0, this.world.addChild(this.bg, this.bgFever);
		let o = Z(t.tex("pillar"));
		o.height = 1500, o.width = 64, o.position.set(32, 940), this.world.addChild(o), this.liftGlow = Z(this.fxt.glow), this.liftGlow.blendMode = "add", this.liftGlow.tint = Q.cyan, this.liftGlow.scale.set(1.3, 12), this.liftGlow.position.set(wO, 940), this.liftGlow.alpha = .35, this.world.addChild(this.liftGlow);
		let s = t.frames("starlift", "loop"), c = s.length > 1 ? ED(s, 20) : Z(t.tex("starlift"));
		c.anchor.set(.5), this.stl = c, c.height = 1464, c.width = s.length > 1 ? 150 : 104, c.position.set(wO, 940), c.alpha = .92, this.world.addChild(c);
		for (let e = 0; e < DO; e++) {
			let e = Z(this.fxt.glow);
			e.blendMode = "add", e.width = e.height = 52, e.alpha = 0;
			let n = Z(t.tex("ball", "roll"));
			n.width = n.height = 28.6, this.liftGlows.push(e), this.liftBalls.push(n), this.world.addChild(e, n);
		}
		let l = t.frames("vfxTrail", "loop");
		if (l.length) {
			let e = 384 * 1.1;
			for (let t = EO; t > TO - e / 2; t -= e) {
				let n = ED(l, 24);
				n.anchor.set(.5), n.scale.set(.9, 1.1), n.position.set(wO, t - e / 2), n.alpha = .75, n.blendMode = "add", n.gotoAndPlay(Math.floor(Math.random() * l.length)), this.world.addChild(n);
			}
		}
		for (let e = 182, t = 0; e <= 358; e += 5, t++) {
			let n = cD(e, YE.r + 8);
			this.addLed(n.x, n.y, t, 0);
		}
		let u = t.frames("ledStrip", "idle");
		if (u.length > 1) for (let e of [58, 975]) {
			let t = ED(u, 16);
			t.anchor.set(.5), t.height = 1560 - YE.cy, t.width = 34, t.position.set(e, (YE.cy + 1560) / 2), this.world.addChild(t), this.ledStrips.push(t);
		}
		else for (let e = YE.cy + 30, t = 0; e < 1560; e += 34, t++) this.addLed(56, e, t, -1), this.addLed(974, e, t, 1);
		let d = wD(Z(t.tex("crown")), 600, 200);
		d.position.set(515, 128), this.haloGlow = Z(this.fxt.glow), this.haloGlow.blendMode = "add", this.haloGlow.scale.set(2.4), this.haloGlow.position.set(515, 128);
		let f = t.frames("halo", "pulse");
		this.halo = f.length > 1 ? ED(f, 16) : Z(t.tex("halo")), this.halo.anchor.set(.5), wD(this.halo, 196, 196), this.halo.position.set(515, 128), this.world.addChild(d, this.haloGlow, this.halo);
		for (let [e, t, n] of [
			[
				352,
				112,
				-1
			],
			[
				678,
				112,
				1
			],
			[
				240,
				190,
				-1
			],
			[
				790,
				190,
				1
			]
		]) {
			let r = Z(this.fxt.glow);
			r.blendMode = "add", r.width = 230, r.height = 120, r.rotation = n * .35, r.position.set(e, t), r.alpha = 0, this.world.addChild(r), this.wingLamps.push(r);
		}
		let p = t.frames("lcdBezel", "pulse"), m = p.length > 1 ? ED(p, 12) : Z(t.tex("lcdBezel"));
		m.anchor.set(.5), m.width = J.w + 200, m.height = J.h + 176, m.position.set(J.x + J.w / 2, J.y + J.h / 2);
		let h = J.x + J.w / 2, g = J.y + J.h / 2;
		this.ringBloom = Z(this.fxt.glow), this.ringBloom.blendMode = "add", this.ringBloom.width = J.w + 420, this.ringBloom.height = J.h + 400, this.ringBloom.position.set(h, g), this.ringLight = Z(this.fxt.ring), this.ringLight.blendMode = "add", this.ringLight.width = J.w + 150, this.ringLight.height = J.h + 140, this.ringLight.position.set(h, g), this.world.addChild(this.ringBloom, m, this.ringLight);
		for (let e = 0; e < 44; e++) {
			let t = e / 44 * Math.PI * 2, n = Z(this.fxt.glow);
			n.blendMode = "add", n.width = n.height = 30, n.position.set(h + Math.cos(t) * (J.w / 2 + 62), g + Math.sin(t) * (J.h / 2 + 58)), this.world.addChild(n), this.ringDots.push(n);
		}
		this.world.addChild(this.lcd.root), this.roundTag.position.set(J.x + J.w - 70, J.y + 34), t.has("plateRound") && this.roundTag.addChild(wD(Z(t.tex("plateRound")), 150, 60)), this.roundText = FD("× 01", 34, Q.magenta), this.roundTag.addChild(this.roundText), this.roundTag.visible = !1, this.world.addChild(this.roundTag);
		for (let e = 0; e < 4; e++) {
			let n = Z(this.fxt.glow);
			n.blendMode = "add", n.tint = Q.cyan, n.scale.set(.55), n.alpha = 0;
			let r = t.frames("lamp", "on").length > 0, i = wD(Z(t.tex("lamp", "off")), r ? 40 : 34, r ? 40 : 34), a = 449 + e * 44;
			i.position.set(a, J.y + J.h + 2), n.position.copyFrom(i.position), i.alpha = r ? 1 : .35, r || (i.tint = 6715289), this.world.addChild(n, i), this.lamps.push({
				s: i,
				glow: n,
				on: !1
			});
		}
		let _ = t.has("pinHead"), v = _ ? t.tex("pinHead") : t.tex("pin", "static"), y = !_ && v.height > v.width * 1.6;
		for (let e of this.physics.pins) {
			if (_) {
				let t = Z(this.fxt.glow);
				t.tint = 0, t.alpha = .55, t.width = t.height = 25, t.position.set(e.x + 3, e.y + 5), this.pinLayer.addChild(t);
			}
			let t = Z(v, .5, y ? .16 : .5);
			y ? t.scale.set(30 / (v.height || 1)) : wD(t, _ ? 16.5 : 17, _ ? 16.5 : 17), t.position.set(e.x, e.y), this.pinLayer.addChild(t), this.pinSprites.push(t);
		}
		this.world.addChild(this.pinLayer), this.dockS = wD(Z(t.tex("dock", "idle")), 130, 130), this.dockS.position.set(Y.x, Y.y + 10), this.world.addChild(this.dockS);
		for (let [e, n] of tD.entries()) {
			let r = wD(Z(t.tex("satellite", "idle")), 112, 112);
			r.position.set(n.x, n.y + 10), e === 1 && t.frames("satellite", "hit").length && (r.scale.x *= -1), this.world.addChild(r), this.satS.push(r);
		}
		this.gyros = rD.map((e) => {
			let n = wD(Z(t.tex("gyro")), e.r * 2.7, e.r * 2.7);
			return n.position.set(e.x, e.y), e.spin < 0 && (n.scale.x *= -1), this.world.addChild(n), n;
		});
		let b = Z(t.tex("hatchFrame"));
		b.width = X.w + 70, b.height = 92, b.position.set(X.x, X.y + 10), this.doorGlow = Z(this.fxt.glow), this.doorGlow.blendMode = "add", this.doorGlow.tint = Q.magenta, this.doorGlow.scale.set(2.6, .7), this.doorGlow.position.set(X.x, X.y + 10), this.doorGlow.alpha = 0, this.door = Z(t.tex("hatchDoor")), this.door.width = X.w + 6, this.door.height = 50, this.door.position.set(X.x, X.y + 8), this.world.addChild(this.doorGlow), t.has("hatch") ? (this.hatchAnim = new oE(t.frames("hatch", "idle").length ? t.frames("hatch", "idle") : [t.tex("hatch")]), this.hatchAnim.anchor.set(.5), this.hatchAnim.scale.set((X.w + 96) / 420), this.hatchAnim.position.set(X.x, X.y + 14), this.hatchAnim.animationSpeed = .4, this.hatchAnim.play(), this.world.addChild(this.hatchAnim)) : this.world.addChild(b, this.door), this.hatchCount = FD("0/10", 40, Q.magenta), this.hatchCount.position.set(X.x, X.y + 66), this.hatchCount.visible = !1, this.timerText = PD("", 26, Q.cyan, "800"), this.timerText.position.set(X.x, X.y - 42), this.timerText.visible = !1, this.world.addChild(this.hatchCount, this.timerText);
		let x = Z(t.tex("funnel"));
		x.width = 890, x.height = 120, x.position.set(530, 1640), this.world.addChild(x), this.world.addChild(this.ballLayer, this.fx.root), this.shootRight = FD("SHOOT RIGHT ▶", 44, Q.magenta), this.shootRight.position.set(700, 300), this.shootRight.visible = !1, this.world.addChild(this.shootRight);
		let S = new H();
		this.world.addChild(S);
		let C = PD("BALLS", 24, Q.cyan, "800");
		C.position.set(150, 1712), this.ballsText = FD("0", 60, Q.cyan), this.ballsText.style.fontFamily = AD, this.ballsText.position.set(150, 1772), this.liveText = PD("IN PLAY 0", 22, 12577279, "700"), this.liveText.position.set(150, 1836);
		let w = PD("DEMO PLAY · NO MONEY", 18, 10467030, "700");
		w.position.set(150, 1878), S.addChild(C, this.ballsText, this.liveText, w), this.pushGlow = Z(this.fxt.glow), this.pushGlow.blendMode = "add", this.pushGlow.tint = Q.magenta, this.pushGlow.scale.set(2.2), this.pushGlow.alpha = .25, this.pushGlow.position.set(540, 1790), this.push = wD(Z(t.tex("push")), 176, 176), this.push.position.set(540, 1790), this.push.eventMode = "static", this.push.cursor = "pointer", this.push.on("pointerdown", () => this.pressPush());
		let ee = PD("PUSH", 26, 16777215, "900");
		ee.position.set(540, 1898), S.addChild(this.pushGlow, this.push, ee);
		for (let e = 0; e < 24; e++) {
			let e = Z(this.fxt.spark);
			e.blendMode = "add", e.scale.set(.7), this.dialArc.push(e), S.addChild(e);
		}
		this.dial = wD(Z(t.tex("dial")), 190, 190), this.dial.position.set(905, 1782), this.dial.eventMode = "static", this.dial.cursor = "grab", S.addChild(this.dial);
		let T = PD("HOLD TO FIRE", 20, 14677759, "800");
		T.position.set(905, 1898), this.lockText = PD("LOCK ○", 22, 12577279, "800"), this.lockText.position.set(745, 1880), this.lockText.eventMode = "static", this.lockText.cursor = "pointer", this.lockText.on("pointerdown", () => this.toggleLock()), S.addChild(T, this.lockText), this.bindDial(), this.flashS = new ha(B.WHITE), this.flashS.width = qE, this.flashS.height = JE, this.flashS.alpha = 0, this.flashS.blendMode = "add", this.root.addChild(this.flashS), this.ctx = {
			tw: q,
			art: t,
			audio: i,
			fx: this.fx,
			fxt: this.fxt,
			shake: this.shake,
			tune: n,
			lcd: this.lcd,
			onReach: () => this.machine.reachStarted(),
			hooks: {
				flash: (e, t, n) => this.flash(e, t, n),
				halo: (e) => this.haloMode = e,
				surge: (e) => this.surgeOn = e,
				waitPush: (e) => this.waitPush(e),
				reachMusic: (e) => this.reachMusic(e)
			}
		}, this.machine.on((e) => this.onMachine(e)), this.physics.on((e) => this.onPhysics(e));
	}
	addLed(e, t, n, r) {
		let i = Z(this.fxt.spark);
		i.blendMode = "add", i.position.set(e, t), i.scale.set(.9), this.leds.push({
			s: i,
			i: n,
			side: r
		}), this.world.addChild(i);
	}
	async start() {
		let e = await this.provider.connect();
		this.setBalance(e.balance);
	}
	enter() {
		this.machine.mode === "title" && this.machine.start(), this.audio.setMusic("normal"), this.audio.unlock();
	}
	setBalance(e) {
		this.balance = e, this.ballsText.text = e.toLocaleString("en-US"), this.ui.balance(e);
	}
	bindDial() {
		let e = (e) => {
			let t = this.world.toLocal(e.global), n = (Math.atan2(t.y - this.dial.y, t.x - this.dial.x) - Math.PI * .75) / (Math.PI * 1.5);
			n = (n % (4 / 3) + 4 / 3) % (4 / 3), n > 1 && (n = n > 1.17 ? 0 : 1), this.power = n;
		}, t = !1;
		this.dial.on("pointerdown", (n) => {
			this.audio.unlock(), t = !0, this.firing = !0, e(n);
		}), this.dial.on("globalpointermove", (n) => {
			t && e(n);
		});
		let n = () => {
			t = !1, this.firing = !1;
		};
		this.dial.on("pointerup", n), this.dial.on("pointerupoutside", n);
	}
	key(e, t) {
		if (this.machine.mode === "title") return !1;
		switch (e.code) {
			case "Space": return this.firing = t, !0;
			case "ArrowUp":
			case "ArrowRight": return t && (this.power = Math.min(1, this.power + .03)), !0;
			case "ArrowDown":
			case "ArrowLeft": return t && (this.power = Math.max(0, this.power - .03)), !0;
			case "KeyP": return t && !e.repeat && this.pressPush(), !0;
			case "KeyL": return t && !e.repeat && this.toggleLock(), !0;
		}
		return !1;
	}
	wheel(e) {
		this.power = Math.max(0, Math.min(1, this.power - Math.sign(e) * .02));
	}
	toggleLock() {
		this.locked = !this.locked, this.lockText.text = this.locked ? "LOCK ●" : "LOCK ○", this.lockText.style.fill = this.locked ? Q.cyan : 12577279, this.audio.play("sfx_ui_click");
	}
	pressPush() {
		let e = this.art.frames("push", "pressed");
		if (e.length && (this.pushDown = !0, this.push.texture = e[e.length - 1], window.setTimeout(() => this.pushDown = !1, 140)), this.audio.unlock(), this.audio.play("sfx_push_click"), this.mash.count++, q.to(this.push.scale, {
			x: this.push.scale.x * .9,
			y: this.push.scale.y * .9
		}, 60).then(() => q.to(this.push.scale, {
			x: this.push.scale.x / .9,
			y: this.push.scale.y / .9
		}, 160, zE)), this.fx.emit({
			tex: this.fxt.glow,
			x: 540,
			y: 1790,
			n: 12,
			speed: [200, 500],
			life: [.25, .5],
			tint: [Q.magenta, Q.white],
			scale: [.2, .5]
		}), this.fx.emit({
			tex: this.fxt.ring,
			x: 540,
			y: 1790,
			n: 1,
			speed: [0, 0],
			life: [.4, .4],
			scale: [.5, .5],
			endScale: 4,
			tint: Q.magenta
		}), this.liftGlow.alpha = 1, this.shake.add(this.machine.mode === "fever" ? .22 : .1), this.machine.mode === "fever" && (this.audio.play("sfx_mash_tap", {
			vol: .8,
			max: 3
		}), this.fx.emit({
			tex: this.fxt.glow,
			x: X.x,
			y: X.y + 30,
			n: 10,
			speed: [100, 300],
			angle: [Math.PI * 1.1, Math.PI * 1.9],
			tint: [Q.magenta, 16764762],
			scale: [.2, .4]
		})), this.pushPrompt) {
			let e = this.pushPrompt;
			this.pushPrompt = void 0, e.resolve(!0);
		}
	}
	flash(e, t, n) {
		q.reduced || (this.flashS.tint = e, this.flashS.alpha = t, q.to(this.flashS, { alpha: 0 }, n, RE));
	}
	reachMusic(e) {
		this.machine.mode === "normal" && this.audio.setMusic(e === "none" ? "normal" : e === "quick" ? "reach1" : e === "stepup" ? "reach2" : "reach3", 300);
	}
	waitPush(e) {
		return new Promise((t) => {
			let n = this.art.has("cardPush"), r = n ? ED(this.art.frames("cardPush", "pulse").length ? this.art.frames("cardPush", "pulse") : this.art.frames("cardPush"), 16) : wD(Z(this.art.tex(this.art.has("platePush") ? "platePush" : "push")), 170, 170);
			n && (r.anchor.set(.5), r.scale.set(300 / (r.texture.height || 300))), r.position.set(J.x + J.w / 2, J.y + J.h / 2);
			let i = Z(this.fxt.ring);
			i.blendMode = "add", i.tint = Q.magenta, i.position.copyFrom(r.position);
			let a = FD("PUSH!", 70, Q.magenta);
			a.position.set(r.x, r.y + 120), a.visible = !n, this.world.addChild(i, r, a), this.audio.play("sfx_reach_alert", { vol: .7 }), r.eventMode = "static", r.on("pointerdown", () => this.pressPush()), this.pushPrompt = {
				resolve: (e) => {
					this.fx.emit({
						tex: this.fxt.star,
						x: r.x,
						y: r.y,
						n: 30,
						speed: [200, 700],
						tint: [Q.magenta, Q.white],
						scale: [.4, .9]
					}), i.destroy(), r.destroy(), a.destroy(), t(e);
				},
				t: 0,
				ms: e,
				ring: i,
				word: a,
				btn: r
			};
		});
	}
	onPhysics(e) {
		switch (e.type) {
			case "pin": {
				if (this.sparkBudget > 0) {
					if (this.sparkBudget--, e.speed > 500 && this.art.has("vfxSpark") && Math.random() < .35) {
						let t = [
							"a",
							"b",
							"c"
						][Math.floor(Math.random() * 3)];
						TD(this.fx.root, this.art.frames("vfxSpark", t), e.x, e.y, { scale: .35 });
					} else this.fx.emit({
						tex: this.fxt.star,
						x: e.x,
						y: e.y,
						n: 1,
						speed: [0, 0],
						life: [.12, .22],
						scale: [.25, .4],
						tint: [Q.white, Q.cyan]
					});
				}
				let t = this.physics.live;
				this.time - this.lastPinSound > Math.max(.012, .045 - t * .0012) && (this.lastPinSound = this.time, this.audio.bank("sfx_pin", 12, {
					pad: 2,
					vol: Math.min(1, e.speed / 900) * .8,
					max: Math.min(12, 4 + Math.floor(t / 3)),
					rate: .9 + Math.random() * .25
				}));
				break;
			}
			case "pocket":
				e.pocket.kind === "dock" ? this.onDock(e.ball) : e.pocket.kind === "satellite" ? this.onSatellite(e.ball) : this.onHatch(e.ball), this.liftPulse = Math.min(1.6, this.liftPulse + (e.pocket.kind === "hatch" ? .9 : .5));
				break;
			case "drain":
				Math.random() < .3 && this.audio.play("sfx_drain", {
					vol: .3,
					max: 2
				}), this.fx.emit({
					tex: this.fxt.glow,
					x: e.ball.x,
					y: 1600,
					n: 2,
					speed: [10, 40],
					life: [.2, .4],
					scale: [.12, .2],
					tint: Q.cyan
				});
				break;
			case "warp":
				this.audio.play("sfx_gyro_whoosh", {
					vol: .35,
					max: 2
				});
				break;
			case "stage-drop":
				this.fx.emit({
					tex: this.fxt.spark,
					x: e.ball.x,
					y: e.ball.y,
					n: 6,
					speed: [40, 120],
					life: [.2, .4],
					tint: [Q.cyan, Q.white]
				});
				break;
			case "gyro": Math.random() < .2 && this.audio.play("sfx_gyro_whoosh", {
				vol: .25,
				max: 1
			});
		}
	}
	popup(e, t, n, r = Q.cyan) {
		let i = FD(n, 36, r);
		i.position.set(e, t), i.scale.set(.4), this.world.addChild(i), q.to(i.scale, {
			x: 1,
			y: 1
		}, 220, zE), q.to(i, {
			y: t - 70,
			alpha: 0
		}, 900, RE).then(() => i.destroy());
	}
	playAnim(e, t, n, r) {
		let i = this.art.frames(t, n);
		if (i.length < 2) return;
		let a = 0, o = () => {
			e.destroyed || (e.texture = i[a++], a < i.length ? window.setTimeout(o, 33) : e.texture = this.art.tex(t, r));
		};
		o();
	}
	onDock(e) {
		this.audio.play("sfx_pocket_chime"), this.playAnim(this.dockS, "dock", "entry", "idle"), TD(this.fx.root, this.art.frames("vfxPocket", "burst"), Y.x, Y.y + 8, { scale: .6 }), this.fx.emit({
			tex: this.fxt.ring,
			x: Y.x,
			y: Y.y + 14,
			n: 1,
			speed: [0, 0],
			life: [.4, .4],
			scale: [.2, .2],
			endScale: 6,
			tint: Q.cyan
		}), this.fx.emit({
			tex: this.fxt.spark,
			x: e.x,
			y: e.y,
			n: 16,
			speed: [80, 260],
			tint: [Q.cyan, Q.white],
			life: [.3, .6]
		});
		let t = this.machine.pendingCount + this.inflightPort;
		this.inflightPort++, this.provider.portEntry(Math.min(t, this.tune.pendingCap)).then((e) => {
			this.setBalance(e.balance), e.award && this.popup(Y.x, Y.y - 20, `+${e.award}`), e.spin && this.machine.queueSpin(e.spin);
		}).catch((e) => this.refused(e)).finally(() => this.inflightPort--);
	}
	onSatellite(e) {
		this.audio.play("sfx_satellite_ping");
		let t = e.x < 515 ? 0 : 1;
		this.playAnim(this.satS[t], "satellite", "hit", "idle"), this.fx.emit({
			tex: this.fxt.star,
			x: e.x,
			y: e.y,
			n: 14,
			speed: [80, 260],
			tint: [
				Q.violet,
				Q.white,
				Q.cyan
			],
			life: [.3, .6]
		}), this.provider.satelliteEntry().then((t) => {
			this.setBalance(t.balance), t.award && this.popup(e.x, e.y - 30, `+${t.award}`, Q.violet);
		}).catch((e) => this.refused(e));
	}
	onHatch(e) {
		let t = this.machine.fever, n = this.machine.hatchEntry();
		if (!t || n < 0) return;
		let r = t.round;
		TD(this.fx.root, this.art.frames("vfxPocket", "burst"), e.x, X.y + 6, {
			scale: .5,
			tint: Q.magenta
		}), this.audio.play(`sfx_hatch_entry_${Math.min(5, 1 + Math.floor(n * 5 / t.plan.ballCap))}`, { max: 4 }), this.fx.emit({
			tex: this.fxt.glow,
			x: e.x,
			y: X.y + 10,
			n: 8,
			speed: [60, 220],
			angle: [Math.PI * 1.1, Math.PI * 1.9],
			tint: [Q.magenta, Q.white],
			scale: [.2, .4]
		}), this.hatchCount.text = `${n + 1}/${t.plan.ballCap}`, this.hatchCount.scale.set(1.3), q.to(this.hatchCount.scale, {
			x: 1,
			y: 1
		}, 200, zE), this.provider.hatchEntry(t.plan.feverId, r, n).then((t) => {
			this.setBalance(t.balance), this.machine.credit(t.award, r), this.feverTotal += t.award, t.award && this.popup(e.x, X.y - 30, `+${t.award}`, Q.magenta);
		}).catch((e) => this.refused(e));
	}
	refused(e) {
		e instanceof DD ? (this.firing = !1, this.locked && this.toggleLock(), this.audio.play("sfx_ui_error"), this.ui.toast(e.message)) : console.error(e);
	}
	onMachine(e) {
		switch (e.type) {
			case "pending":
				this.setLamps(e.count);
				break;
			case "spin-start":
				this.runSpin(e.spin);
				break;
			case "led":
				this.ledLevel = e.level;
				break;
			case "mode":
				this.onMode(e.mode);
				break;
			case "fever-stage":
				this.onFeverStage(e.stage, e.round);
				break;
			case "hatch":
				this.setHatch(e.open);
				break;
			case "gauge-due": this.runGauge();
		}
	}
	async runSpin(e) {
		await sO(this.ctx, e), this.machine.spinFinished(), e.kind === "hit" && (await _O(this.ctx, e), this.machine.hitShown());
	}
	async onMode(e) {
		if (e === "fever") this.feverTotal = 0, this.startShower(), this.audio.setMusic("fever", 400), q.to(this.bgFever, { alpha: 1 }, 900), this.roundTag.visible = !0;
		else if (e === "endcard") {
			this.stopShower(), this.roundTag.visible = !1, this.hatchCount.visible = !1, this.timerText.visible = !1, this.shootRight.visible = !1;
			let e = this.machine.lastFever, t = e ? await this.provider.endFever(e.plan.feverId) : {
				total: 0,
				perRound: [],
				balance: this.balance,
				feverId: ""
			};
			this.setBalance(t.balance), await SO(this.ctx, t.total), this.haloMode = "idle", q.to(this.bgFever, { alpha: 0 }, 1200), this.machine.endcardDone(), this.ui.results({
				total: t.total,
				perRound: t.perRound,
				rounds: e?.plan.rounds ?? 0,
				best: this.machine.bestTier,
				balance: this.balance
			}, () => this.machine.resultsDone());
		} else e === "normal" && (this.audio.setMusic("normal", 900), this.lcd.setBackdrop("lcdIdle", 600));
	}
	shower = [];
	startShower() {
		let e = this.art.frames("vfxShower", "loop");
		if (e.length) for (let t of [300, 730]) {
			let n = ED(e, 24);
			n.blendMode = "add", n.position.set(t, 900), n.scale.set(1.6, 2.6), n.alpha = 0, this.world.addChildAt(n, 3), q.to(n, { alpha: .55 }, 900), this.shower.push(n);
		}
	}
	stopShower() {
		for (let e of this.shower) q.to(e, { alpha: 0 }, 800).then(() => e.destroy());
		this.shower = [];
	}
	async onFeverStage(e, t) {
		let n = this.machine.fever;
		if (e === "intro") await yO(this.ctx);
		else if (e === "slam") this.roundText.text = `× ${String(t).padStart(2, "0")}`, this.roundTag.scale.set(1.5), q.to(this.roundTag.scale, {
			x: 1,
			y: 1
		}, 300, zE), await bO(this.ctx, t);
		else if (e === "open" && n) this.hatchCount.text = `0/${n.plan.ballCap}`, this.hatchCount.visible = !0, this.timerText.visible = !0;
		else if (e === "interval" && n) {
			this.timerText.visible = !1;
			let e = n.won[t - 1];
			await xO(this.ctx, e, n.won.reduce((e, t) => e + t, 0), this.tune.intervalMs);
		}
	}
	async runGauge() {
		let e = this.machine.fever;
		if (!e) return;
		let t = e.round;
		await CO(this.ctx, this.tune.gaugeMs, this.mash, async () => {
			let n = await this.provider.gaugeReveal(e.plan.feverId);
			return this.setBalance(n.balance), this.machine.credit(n.award, t), n.award;
		});
	}
	setHatch(e) {
		if (this.physics.hatchOpen = e, this.audio.play(e ? "sfx_gate_open" : "sfx_gate_close"), this.hatchAnim) {
			let t = this.hatchAnim, n = this.art.frames("hatch", e ? "open" : "close");
			n.length && (t.textures = n, t.loop = !1, t.animationSpeed = .5, t.onComplete = () => {
				let n = this.art.frames("hatch", e ? "lit" : "idle");
				n.length && (t.textures = n, t.loop = !0, t.animationSpeed = .4, t.play());
			}, t.gotoAndPlay(0)), e && TD(this.world, this.art.frames("vfxShock", "open"), X.x, X.y + 10, {
				sx: 1.1,
				sy: .6
			});
		}
		q.to(this.door, {
			alpha: e ? .35 : 1,
			y: X.y + (e ? -4 : 8)
		}, 260, RE), q.to(this.door.scale, { y: this.door.scale.y * (e ? .25 : 4) }, 260, RE), q.to(this.doorGlow, { alpha: +!!e }, 260), e && (this.shake.add(.2), this.fx.emit({
			tex: this.fxt.glow,
			x: X.x,
			y: X.y,
			n: 24,
			speed: [60, 260],
			angle: [Math.PI, Math.PI * 2],
			tint: [
				Q.magenta,
				16764762,
				Q.white
			],
			scale: [.2, .5],
			spread: X.w * .8
		}));
	}
	setLamps(e) {
		this.lamps.forEach((t, n) => {
			let r = n < e;
			if (r === t.on) return;
			t.on = r;
			let i = this.art.frames("lamp", "on");
			if (r) {
				this.audio.play("sfx_ui_hover", { vol: .6 }), t.s.tint = 16777215, t.s.alpha = 1, i.length && (t.s.texture = i[i.length - 1]);
				let e = t.s.scale.x;
				t.s.scale.set(e * 1.6), q.to(t.s.scale, {
					x: e,
					y: e
				}, 260, zE), q.to(t.glow, { alpha: .9 }, 160);
			} else q.to(t.glow, { alpha: 0 }, 300), i.length ? t.s.texture = this.art.tex("lamp", "off") : (t.s.tint = 6715289, q.to(t.s, { alpha: .35 }, 300));
		});
	}
	update(e) {
		let t = e * this.timeScale, n = t / 1e3;
		if (this.time += n, this.sparkBudget = Math.min(40, this.sparkBudget + n * 60), q.update(t), !this.paused) {
			this.machine.tick(t);
			let e = Math.min(n, .05);
			this.fire(e), this.physics.step(e);
		}
		this.fx.update(n), this.lcd.update(n, this.time), this.drawBalls(), this.drawLift(n), this.drawLights(n);
		let r = this.art.frames("gyro", "spin");
		if (r.length > 1) {
			let e = this.physics.gyroAngle / (Math.PI / 3) % 1;
			for (let t of this.gyros) t.texture = r[Math.floor(e * r.length) % r.length];
		} else for (let e of this.gyros) e.rotation = this.physics.gyroAngle;
		this.shake.update(n, this.world);
		let i = this.machine.fever;
		i && i.stage === "open" ? (this.timerText.text = `${Math.max(0, (i.plan.openMs - i.t) / 1e3).toFixed(1)}s`, this.shootRight.visible = this.power < AO, this.shootRight.alpha = .55 + .45 * Math.abs(Math.sin(this.time * 5))) : this.shootRight.visible = !1, this.liveText.text = `IN PLAY ${this.physics.live}`;
		let a = this.art.frames("dial", "angle");
		a.length > 1 ? this.dial.texture = a[Math.round(this.power * (a.length - 1))] : this.dial.rotation = -2.2 + this.power * 4.4;
		let o = this.art.frames("push", "glow");
		this.pushPrompt && o.length > 1 && !this.pushDown ? this.push.texture = o[Math.floor(this.time * 12) % o.length] : !this.pushDown && this.art.frames("push", "idle").length && (this.push.texture = this.art.frames("push", "idle")[0]);
		let s = Math.round(this.power * this.dialArc.length);
		if (this.dialArc.forEach((e, t) => {
			let n = Math.PI * .75 + t / (this.dialArc.length - 1) * Math.PI * 1.5;
			e.position.set(this.dial.x + Math.cos(n) * 112, this.dial.y + Math.sin(n) * 112), e.tint = t < s ? t / this.dialArc.length > .68 ? Q.magenta : Q.cyan : 3359846, e.alpha = t < s ? .95 : .35;
		}), this.pushGlow.alpha = this.pushPrompt ? .6 + .4 * Math.sin(this.time * 14) : .25 + .1 * Math.sin(this.time * 2), this.pushPrompt) {
			let e = this.pushPrompt;
			e.t += t, e.ring.scale.set(1 + this.time * 2 % 1 * 1.5), e.ring.alpha = 1 - this.time * 2 % 1, e.btn.scale.set(e.btn.scale.x), e.word.alpha = .6 + .4 * Math.abs(Math.sin(this.time * 8)), e.t >= q.ms(e.ms) && (this.pushPrompt = void 0, e.resolve(!1));
		}
		let c = this.machine.mode === "fever";
		this.audio.bed("sfx_lifter_hum", this.balance > 0 ? .6 : 0);
		let l = this.physics.live;
		this.audio.bed("sfx_clatter_light", Math.min(1, l / 6) * (c ? .8 : 1)), this.audio.bed("sfx_clatter_heavy", Math.max(0, Math.min(1, (l - (c ? 4 : 10)) / 18))), this.audio.bed("sfx_ball_roll", Math.min(.7, l / 20));
	}
	fire(e) {
		let t = this.machine.mode;
		if (!(this.firing || this.locked) || t !== "normal" && t !== "fever") {
			this.fireAcc = Math.min(this.fireAcc, 0);
			return;
		}
		let n = 60 / (t === "fever" ? this.tune.feverFireRatePerMin ?? this.tune.fireRatePerMin : this.tune.fireRatePerMin);
		for (this.fireAcc += e; this.fireAcc >= n;) {
			if (this.fireAcc -= n, this.balance <= 0) {
				this.firing = !1, this.locked && this.toggleLock(), this.ui.toast("Out of demo balls.");
				return;
			}
			if (this.physics.live >= this.tune.maxLiveBalls) return;
			this.physics.launch(kO(this.power)), this.setBalance(this.balance - 1), this.audio.bank("sfx_launch", 3, {
				vol: .5,
				max: 2
			}), this.provider.launch(1).then((e) => this.setBalance(e.balance)).catch((e) => this.refused(e));
		}
	}
	drawBalls() {
		let e = /* @__PURE__ */ new Set(), t = this.machine.mode === "fever";
		for (let n of this.physics.balls) {
			e.add(n.id);
			let r = this.ballSprites.get(n.id);
			r || (r = this.ballPool.pop() ?? this.newBall(), r.c.visible = !0, this.ballSprites.set(n.id, r)), r.c.position.set(n.x, n.y);
			let i = r.body, a = t && this.ballFever.length ? this.ballFever : this.ballRoll;
			a.length > 1 ? i.texture = a[Math.floor((n.spin / (Math.PI * 2) % 1 + 1) % 1 * a.length) % a.length] : i.rotation = n.spin, r.c.alpha = n.phase === "warp" ? .55 : 1;
			let o = Math.hypot(n.vx, n.vy), s = n.phase === "free" && o > 260;
			r.streak.visible = s, s && (r.streak.rotation = Math.atan2(n.vy, n.vx) + Math.PI, r.streak.width = 24 + Math.min(130, o * .075), r.streak.height = 19.5, r.streak.alpha = Math.min(.85, o / 1800), r.streak.tint = t ? Q.magenta : Q.cyan), r.glow.alpha = t ? .6 : .48, r.glow.tint = t ? 16766708 : 14219519;
		}
		for (let [t, n] of this.ballSprites) e.has(t) || (n.c.visible = !1, this.ballPool.push(n), this.ballSprites.delete(t));
	}
	get ballRoll() {
		return this.art.frames("ball", "roll");
	}
	get ballFever() {
		return this.art.frames("ball", "fever");
	}
	newBall() {
		let e = new H(), t = Z(this.fxt.streak, .92, .5);
		t.blendMode = "add", t.width = 120, t.height = 19.5;
		let n = Z(this.fxt.glow);
		n.blendMode = "add", n.width = n.height = 54.6;
		let r = Z(this.art.tex("ball", "roll"));
		return r.width = r.height = 31.2, e.addChild(t, n, r), this.ballLayer.addChild(e), {
			c: e,
			body: r,
			glow: n,
			streak: t
		};
	}
	drawLift(e) {
		let t = this.machine.mode === "fever", n = this.firing || this.locked || t, r = t ? 760 : n ? 420 : 110;
		this.liftOffset = (this.liftOffset + r * e) % OO, this.liftPulse = Math.max(0, this.liftPulse - e * .8);
		let i = this.balance > 0 ? this.liftBalls.length : 0, a = 1344, o = EO - this.time * r % a;
		this.liftBalls.forEach((e, r) => {
			let s = EO - (r * OO + this.liftOffset) % a;
			e.visible = r < i, e.position.set(wO + Math.sin(r * 1.7 + this.time * 3) * 2.2, s), e.alpha = s < 308 ? (s - TO) / 40 : 1, e.rotation = -s / 13;
			let c = this.liftGlows[r];
			c.visible = e.visible, c.position.copyFrom(e.position);
			let l = Math.max(0, 1 - Math.abs(s - o) / 220);
			c.alpha = e.alpha * (t ? .35 : n ? .18 : .06) + l * Math.min(1, this.liftPulse) * .8, c.tint = t ? r % 2 ? Q.magenta : 16777215 : Q.cyan;
		});
		let s = this.surgeOn || this.machine.mode === "fever";
		this.liftGlow.tint = this.surgeOn ? 16773572 : s ? Q.magenta : Q.cyan;
		let c = this.art.frames("starlift", "surge");
		if (this.stl instanceof oE && c.length > 1 && s !== this.stlSurge) {
			this.stlSurge = s;
			let e = this.stl.width, t = this.stl.height;
			this.stl.textures = s ? c : this.art.frames("starlift", "loop"), this.stl.width = e, this.stl.height = t, this.stl.play();
		}
		let l = this.surgeOn ? .95 : n ? .55 : .3;
		this.liftGlow.alpha += (l - this.liftGlow.alpha) * Math.min(1, e * 4), Math.random() < (n ? .6 : .15) && this.fx.emit({
			tex: this.fxt.glow,
			x: wO + (Math.random() - .5) * 30,
			y: EO,
			n: 1,
			speed: [500, 800],
			angle: [-Math.PI / 2, -Math.PI / 2],
			life: [1.2, 2],
			scale: [.08, .14],
			endScale: 1,
			tint: this.surgeOn ? 16773572 : Q.cyan,
			alpha: .6
		});
	}
	drawLights(e) {
		let t = this.time, n = this.ledLevel, r = t * 155 / 60;
		for (let e of this.leds) {
			let i, a;
			if (n === "normal") {
				let n = Math.sin(t * 1.6 - e.i * .35);
				i = .45 + .35 * Math.max(0, n), a = e.side === 0 || e.side < 0 ? Q.cyan : Q.violet;
			} else if (n === "reach") {
				let n = (e.i - t * 26) % 6;
				i = (n < 0 ? n + 6 : n) < 2 ? 1 : .15, a = Math.floor(t * 8) % 2 ? Q.magenta : Q.violet;
			} else i = .35 + .65 * (1 - r % 1) ** 2, a = Math.floor(r) % 2 ? Q.magenta : 16777215;
			e.s.alpha = i, e.s.tint = a;
		}
		let i, a;
		this.haloMode === "hot" ? (i = .7, a = 16773572) : this.haloMode === "reach" || n === "reach" ? (i = Math.floor(t * 10) % 2 ? 1 : .3, a = Q.magenta) : this.haloMode === "fever" || n === "fever" ? (i = .4 + .6 * (1 - r % 1) ** 2, a = Math.floor(r) % 2 ? Q.magenta : Q.cyan) : (i = .45 + .2 * Math.sin(t * 1.4), a = Q.cyan), this.haloGlow.alpha += (i - this.haloGlow.alpha) * Math.min(1, e * 20), this.haloGlow.tint = a;
		let o = this.haloMode === "fever" || n === "fever", s = this.haloMode === "reach" || n === "reach", c = o ? (1 - r % 1) ** 3 : 0;
		this.ringLight.tint = a, this.ringLight.alpha = Math.min(1, .35 + this.haloGlow.alpha * .75), this.ringBloom.tint = a, this.ringBloom.alpha = (o ? .22 + .4 * c : s ? .15 + .25 * (Math.floor(t * 10) % 2) : .08 + .06 * Math.sin(t * 1.4)) * 1;
		let l = o ? "fever" : s ? "reach" : "idle";
		if (this.ledStrips.length && l !== this.stripLevel) {
			let e = this.art.frames("ledStrip", l);
			if (e.length) {
				this.stripLevel = l;
				for (let t of this.ledStrips) {
					let n = t.width, r = t.height;
					t.textures = e, t.width = n, t.height = r, t.play();
				}
			}
		}
		let u = [
			Q.magenta,
			Q.cyan,
			16777215
		];
		this.wingLamps.forEach((e, n) => {
			if (o) {
				let t = Math.floor(r * 2) + n;
				e.tint = u[t % 3], e.alpha = .25 + .75 * (1 - r * 2 % 1) ** 2;
			} else s ? (e.tint = n % 2 ? Q.magenta : Q.violet, e.alpha = Math.floor(t * 12 + n) % 2 ? .9 : .1) : (e.tint = Q.cyan, e.alpha = .12 + .1 * Math.sin(t * 1.2 + n));
		});
		let d = this.ringDots.length, f = t * (o ? 30 : s ? 44 : 9) % d;
		this.ringDots.forEach((e, t) => {
			let n = (t - f + d) % d, r = n < 8 ? 1 - n / 8 : 0;
			e.alpha = o ? .25 + .75 * Math.max(r, c) : s ? .15 + .85 * r : .12 + .6 * r, e.tint = o ? t % 2 ? Q.magenta : 16777215 : s ? t % 3 ? Q.magenta : Q.violet : Q.cyan;
		}), this.halo.rotation = Math.sin(t * .3) * .05;
	}
	preview(e) {
		let t = (e, t) => ({
			spinId: "fx",
			kind: e,
			reels: e === "hit" ? [
				6,
				6,
				6
			] : [
				6,
				7,
				6
			],
			tier: t,
			stepUpFirst: 5,
			stepUpRespin: !0,
			pushPrompt: t === "mission",
			surge: !1
		}), n = {
			...this.ctx,
			onReach: () => this.ledLevel = "reach"
		}, r = () => {
			this.ledLevel = this.machine.ledLevel, this.haloMode = "idle";
		};
		e === "quick" || e === "stepup" || e === "mission" ? sO(n, t("reach", e)).then(r) : e === "hit" ? sO(n, t("hit", "mission")).then(() => _O(n, t("hit", "mission"))).then(r) : e === "liftoff" ? _O(n, t("hit", "quick")).then(r) : e === "intro" ? yO(this.ctx) : e === "round" ? bO(this.ctx, 3) : e === "get" ? xO(this.ctx, 150, 600, 4500) : e === "end" ? SO(this.ctx, 1250) : e === "gauge" ? CO(this.ctx, 5e3, this.mash, async () => this.tune.gaugeBonusBalls) : e === "surge" && (this.surgeOn = !0, window.setTimeout(() => this.surgeOn = !1, 3e3));
	}
	previewLed(e) {
		this.ledLevel = e, window.setTimeout(() => this.ledLevel = this.machine.ledLevel, 4e3);
	}
};
// src/core/rng.ts
function MO(e) {
	let t = e >>> 0 || 2654435769;
	return () => {
		t = t + 1831565813 >>> 0;
		let e = t;
		return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
function NO(e, t, n) {
	let r = n.reduce((e, t) => e + Math.max(0, t), 0), i = e() * r;
	for (let e = 0; e < t.length; e++) if (i -= Math.max(0, n[e]), i < 0) return t[e];
	return t[t.length - 1];
}
// src/outcome/demo.ts
var PO = [
	"quick",
	"stepup",
	"mission"
], FO = class {
	tune;
	mode = "demo";
	balance;
	rng;
	seq = 0;
	fevers = /* @__PURE__ */ new Map();
	forceNext;
	constructor(e, t = e.demoSeed || Date.now()) {
		this.tune = e, this.balance = e.demoStartBalls, this.rng = MO(t);
	}
	async connect() {
		return {
			balance: this.balance,
			mode: "demo",
			unit: "demo balls"
		};
	}
	async launch(e) {
		if (!Number.isInteger(e) || e < 1) throw new DD("bad launch count", "refused");
		if (this.balance < e) throw new DD("Out of demo balls. Refill from the menu.", "insufficient_balance");
		return this.balance -= e, {
			award: 0,
			balance: this.balance
		};
	}
	refill() {
		return this.balance = this.tune.demoStartBalls, this.balance;
	}
	async portEntry(e) {
		let t = this.tune.portAward;
		return this.balance += t, e >= this.tune.pendingCap ? {
			award: t,
			balance: this.balance
		} : {
			award: t,
			balance: this.balance,
			spin: this.drawSpin()
		};
	}
	async satelliteEntry() {
		return this.balance += this.tune.satelliteAward, {
			award: this.tune.satelliteAward,
			balance: this.balance
		};
	}
	async hatchEntry(e, t, n) {
		let r = this.fevers.get(e);
		if (!r || r.ended || t < 1 || t > r.plan.rounds || n < 0 || n >= r.plan.ballCap) return {
			award: 0,
			balance: this.balance
		};
		let i = this.tune.hatchAwardPerBall;
		return r.perRound[t - 1] += i, this.balance += i, {
			award: i,
			balance: this.balance
		};
	}
	async gaugeReveal(e) {
		let t = this.fevers.get(e);
		if (!t || t.gaugePaid || t.ended) return {
			award: 0,
			balance: this.balance
		};
		t.gaugePaid = !0;
		let n = t.plan.gaugeBonusBalls;
		return t.perRound[t.plan.gaugeRound - 1] += n, this.balance += n, {
			award: n,
			balance: this.balance
		};
	}
	async endFever(e) {
		let t = this.fevers.get(e);
		return t ? (t.ended = !0, {
			feverId: e,
			total: t.perRound.reduce((e, t) => e + t, 0),
			perRound: [...t.perRound],
			balance: this.balance
		}) : {
			feverId: e,
			total: 0,
			perRound: [],
			balance: this.balance
		};
	}
	sym() {
		return Math.floor(this.rng() * 9);
	}
	other(e, t) {
		if (t !== void 0) return ((e + t) % 9 + 9) % 9;
		let n = this.sym();
		for (; n === e;) n = this.sym();
		return n;
	}
	drawSpin() {
		let e = this.tune.odds, t = `demo-${++this.seq}`, n = this.forceNext;
		this.forceNext = void 0;
		let r = this.rng(), i = n?.kind ?? (r < e.hit ? "hit" : this.rng() < e.reachOnMiss ? "reach" : "miss");
		if (i === "miss") {
			let e = this.sym(), n = this.other(e);
			return {
				spinId: t,
				kind: i,
				reels: [
					e,
					this.sym(),
					n
				],
				pushPrompt: !1,
				surge: !1
			};
		}
		let a = n?.tier ?? NO(this.rng, PO, i === "hit" ? e.hitTierWeights : e.missTierWeights), o = this.sym(), s = this.rng() < (i === "hit" ? e.surgeOnHit : e.surgeOnMiss), c = a === "mission" && (i === "hit" || this.rng() < e.pushOnMissionMiss);
		if (i === "hit") {
			let e = {
				spinId: t,
				kind: i,
				reels: [
					o,
					o,
					o
				],
				tier: a,
				pushPrompt: c,
				surge: s,
				fever: this.planFever(t)
			};
			return a === "stepup" && (e.stepUpFirst = this.other(o, this.rng() < .5 ? -1 : 1), e.stepUpRespin = !0), e;
		}
		let l = this.other(o, this.rng() < .5 ? -1 : 1), u = {
			spinId: t,
			kind: i,
			reels: [
				o,
				l,
				o
			],
			tier: a,
			pushPrompt: c,
			surge: s
		};
		return a === "stepup" && (u.stepUpRespin = this.rng() < e.stepUpFakeOut, u.stepUpFirst = u.stepUpRespin ? this.other(o, l === this.other(o, 1) ? -1 : 1) : l), u;
	}
	planFever(e) {
		let t = this.tune, n = {
			feverId: `fever-${e}`,
			rounds: t.feverRounds,
			openMs: t.hatchOpenMs,
			ballCap: t.hatchBallCap,
			gaugeRound: Math.min(Math.max(1, t.gaugeRound), t.feverRounds),
			gaugeBonusBalls: t.gaugeBonusBalls
		};
		return this.fevers.set(n.feverId, {
			plan: n,
			perRound: Array(n.rounds).fill(0),
			gaugePaid: !1,
			ended: !1
		}), n;
	}
};
// src/outcome/index.ts
function IO(e) {
	return new FO(e);
}
// shared/api-base.ts
var LO = new URLSearchParams(location.search);
(location.hostname === "localhost" || location.hostname === "127.0.0.1") && (LO.get("api") || "").replace(/\/$/, ""), LO.get("geo");
var RO = LO.get("brand") || "";
function zO(e) {
	return window.parent !== window && (window.parent.postMessage({
		source: "biab-game",
		...e
	}, location.origin), !0);
}
// src/bridge.ts
function BO(e) {
	zO({ type: "close" }) || (RO ? location.assign(`/b/${encodeURIComponent(RO)}`) : e());
}
// src/ui/dom.ts
var VO = () => document.getElementById("ui");
function $(e, t = "", n = "") {
	let r = document.createElement(e);
	return t && (r.className = t), n && (r.innerHTML = n), r;
}
var HO = "starlift-fever-settings";
function UO() {
	let e = {
		music: .7,
		sfx: .9,
		muted: !1,
		reduced: !1,
		turbo: !1
	};
	try {
		return {
			...e,
			...JSON.parse(localStorage.getItem(HO) || "{}")
		};
	} catch {
		return e;
	}
}
function WO(e) {
	try {
		localStorage.setItem(HO, JSON.stringify(e));
	} catch {}
}
var GO;
function KO() {
	let e = GO;
	e && (GO = void 0, e.classList.remove("show"), window.setTimeout(() => e.remove(), 240));
}
function qO() {
	return !!GO;
}
function JO(e, t, n, r) {
	KO();
	let i = $("div", "sf-overlay");
	i.id = r;
	let a = $("div", "sf-panel");
	a.setAttribute("role", "dialog"), a.setAttribute("aria-label", e), a.append($("h2", "", e), t);
	let o = $("div", "sf-btns");
	for (let e of n) {
		let t = $("button", `sf-btn ${e.cls ?? ""}`, e.label);
		t.type = "button", t.onclick = () => e.run(), o.appendChild(t);
	}
	return a.appendChild(o), i.appendChild(a), i.addEventListener("pointerdown", (e) => {
		e.target === i && KO();
	}), VO().appendChild(i), requestAnimationFrame(() => i.classList.add("show")), GO = i, o.querySelector("button")?.focus(), i;
}
function YO(e, t, n = []) {
	let r = $("div"), i = (n, r) => {
		let i = $("div", "sf-row"), a = $("input");
		return a.type = "range", a.min = "0", a.max = "1", a.step = "0.05", a.value = String(e[r]), a.setAttribute("aria-label", n), a.oninput = () => {
			e[r] = Number(a.value), t(e);
		}, i.append($("label", "", n), a), i;
	}, a = (n, r) => {
		let i = $("div", "sf-row"), a = $("input", "sf-toggle");
		return a.type = "checkbox", a.checked = e[r], a.setAttribute("aria-label", n), a.onchange = () => {
			e[r] = a.checked, t(e);
		}, i.append($("label", "", n), a), i;
	};
	r.append(i("Music", "music"), i("Sound effects", "sfx"), a("Mute all", "muted"), a("Turbo (shorter shows)", "turbo"), a("Reduced motion", "reduced")), r.appendChild($("div", "sf-note", "Keys: Space fire (hold) · ←/→ power · L lock · P push · M mute · Esc menu")), JO("SETTINGS", r, [...n, {
		label: "DONE",
		run: () => KO()
	}], "sf-settings");
}
function XO(e) {
	let t = $("div", "sf-rules"), n = (e, t, n) => {
		let r = $("div", "sf-rule"), i = $("img");
		e && (i.src = e), i.alt = "";
		let a = $("div");
		return a.append($("b", "", t), $("p", "", n)), r.append(i, a), r;
	};
	t.append(n(e.url("dial"), "LAUNCH", "Hold the power dial (or Space) to fire a steady stream. Turn it to set power. LOCK keeps it firing hands-free. The Starlift carries balls back up, so there is no tray to empty."), n(e.url("dock"), "DOCKING PORT", "A ball in the Docking Port spins the Star Reel and lights a Docking Light. Up to four spins wait in line. Satellite catchers pay a few balls too."), n(e.url("sy7"), "STAR REEL", "Reels stop left, right, then centre. Left and right matching is a REACH: Quick, Step-Up or the long Mission Reach. Three of a kind is LIFT-OFF!"), n(e.url("hatchFrame"), "STARLIFT FEVER", "Each fever round opens the Dock Hatch until the timer runs out or ten balls drop in. Shoot right to reach it. A GET tally follows every round."), n(e.url("push"), "PUSH", "PUSH always fires a booster pulse. When a prompt appears, press it, and mash it to fill the Thrust Gauge. It never changes a result: every outcome is decided before the show starts.")), t.appendChild($("div", "sf-note", "Demo play: balls are play credits only. No money, no wallet.")), JO("HOW TO PLAY", t, [{
		label: "GOT IT",
		run: () => KO()
	}], "sf-rules");
}
function ZO(e, t, n) {
	let r = $("div", "sf-results"), i = (e, t) => {
		let n = $("div", "sf-stat");
		return n.append($("span", "", e), $("span", "", t)), n;
	}, a = e.best === "mission" ? "Mission Reach" : e.best === "stepup" ? "Step-Up Re-spin" : e.best === "quick" ? "Quick Reach" : "None";
	r.append(i("Rounds cleared", String(e.rounds)), i("Fever total", `${e.total} balls`), i("Best reach", a), i("Session balls", e.balance.toLocaleString("en-US")));
	let o = $("div", "sf-bars"), s = Math.max(1, ...e.perRound);
	e.perRound.forEach((e, t) => {
		let n = $("div", "sf-bar");
		n.style.height = `${Math.max(6, e / s * 100)}%`, n.style.animationDelay = `${t * 70}ms`, n.title = `Round ${t + 1}: ${e}`, n.appendChild($("i", "", String(t + 1))), o.appendChild(n);
	}), r.appendChild(o), JO("RESULTS", r, [{
		label: "PLAY AGAIN",
		run: () => (KO(), t())
	}, {
		label: "LOBBY",
		cls: "ghost",
		run: () => (KO(), t(), n())
	}], "sf-results");
}
var QO = 0;
function $O(e, t) {
	document.getElementById("sf-toast")?.remove();
	let n = $("div", "sf-error");
	if (n.id = "sf-toast", n.textContent = e, t) {
		let e = $("button", "sf-btn", t.label);
		e.style.marginLeft = "14px", e.style.padding = "10px 22px", e.onclick = () => {
			t.run(), n.remove();
		}, n.appendChild(e);
	}
	VO().appendChild(n), window.clearTimeout(QO), QO = window.setTimeout(() => n.remove(), 4200);
}
var ek = {
	menu: "<svg viewBox=\"0 0 24 24\" width=\"26\" height=\"26\"><path d=\"M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm8.6 4.9-1.9-.3a6.9 6.9 0 0 1-.7 1.7l1.1 1.6-1.6 1.6-1.6-1.1c-.5.3-1.1.6-1.7.7l-.3 1.9h-2.2l-.3-1.9a6.9 6.9 0 0 1-1.7-.7l-1.6 1.1-1.6-1.6 1.1-1.6a6.9 6.9 0 0 1-.7-1.7l-1.9-.3v-2.2l1.9-.3c.1-.6.4-1.2.7-1.7L4.6 6.9l1.6-1.6 1.6 1.1c.5-.3 1.1-.6 1.7-.7l.3-1.9h2.2l.3 1.9c.6.1 1.2.4 1.7.7l1.6-1.1 1.6 1.6-1.1 1.6c.3.5.6 1.1.7 1.7l1.9.3v2.2Z\" fill=\"currentColor\"/></svg>",
	help: "<svg viewBox=\"0 0 24 24\" width=\"26\" height=\"26\"><path d=\"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 16h-2v-2h2v2Zm2.1-7.7-.9.9c-.7.7-1.2 1.3-1.2 2.8h-2v-.5c0-1.1.5-2.1 1.2-2.8l1.2-1.3a1.9 1.9 0 0 0-1.4-3.2c-1.1 0-2 .9-2 2H8a4 4 0 1 1 7.1 2.1Z\" fill=\"currentColor\"/></svg>",
	sound: "<svg viewBox=\"0 0 24 24\" width=\"26\" height=\"26\"><path d=\"M3 10v4h4l5 5V5L7 10H3Zm13.5 2A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4ZM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6Z\" fill=\"currentColor\"/></svg>",
	mute: "<svg viewBox=\"0 0 24 24\" width=\"26\" height=\"26\"><path d=\"M3 10v4h4l5 5V5L7 10H3Zm16.6 2 2.1-2.1-1.4-1.4-2.1 2.1-2.1-2.1-1.4 1.4 2.1 2.1-2.1 2.1 1.4 1.4 2.1-2.1 2.1 2.1 1.4-1.4L19.6 12Z\" fill=\"currentColor\"/></svg>",
	lobby: "<svg viewBox=\"0 0 24 24\" width=\"26\" height=\"26\"><path d=\"M10 19v-5h4v5h5v-7h3L12 3 2 12h3v7z\" fill=\"currentColor\"/></svg>"
};
function tk(e) {
	let t = $("div");
	t.id = "sf-top", t.style.cssText = "position:absolute;left:12px;right:12px;top:12px;display:flex;gap:10px;pointer-events:none";
	let n = (e, n, r) => {
		let i = $("button", "sf-btn icon", e);
		return i.type = "button", i.setAttribute("aria-label", n), i.title = n, i.style.pointerEvents = "auto", i.onclick = () => r(i), t.appendChild(i), i;
	};
	n(ek.lobby, "Lobby", () => e.lobby()), n(ek.help, "How to play", () => e.rules());
	let r = $("div");
	r.style.flex = "1", t.appendChild(r);
	let i = n(ek.sound, "Mute", (t) => t.innerHTML = e.mute() ? ek.mute : ek.sound);
	return i.dataset.role = "mute", n(ek.menu, "Settings", () => e.settings()), VO().appendChild(t), t;
}
function nk(e) {
	let t = document.querySelector("#sf-top [data-role=\"mute\"]");
	t && (t.innerHTML = e ? ek.mute : ek.sound);
}
// src/ui/title.ts
var rk = class {
	fxt;
	fx;
	root = new H();
	bg;
	beam;
	beam2;
	nova;
	orbi;
	words;
	t = 0;
	dom;
	constructor(e, t, n) {
		this.fxt = t, this.fx = n, this.bg = CD(Z(e.tex("lobby")), qE, JE), this.bg.position.set(qE / 2, JE / 2), this.beam = Z(t.streak), this.beam.rotation = -Math.PI / 2, this.beam.blendMode = "add", this.beam.tint = Q.cyan, this.beam.scale.set(16, 5), this.beam.position.set(qE / 2, JE * .48), this.beam2 = Z(t.streak), this.beam2.rotation = -Math.PI / 2, this.beam2.blendMode = "add", this.beam2.scale.set(16, 1.4), this.beam2.position.copyFrom(this.beam.position), this.words = new H(), this.words.position.set(qE / 2, 430);
		let r = FD("STARLIFT", 150, Q.cyan);
		r.y = -90;
		let i = FD("FEVER", 190, Q.magenta, MD);
		i.y = 90;
		let a = PD("A NEON ORBITAL PACHINKO", 34, 14678271, "800");
		if (a.y = 230, e.frames("titleLogo", "shine").length > 1) {
			let t = ED(e.frames("titleLogo", "shine"), 12);
			t.anchor.set(.5), t.scale.set(900 / (t.texture.width || 900)), t.y = -10, a.y = 250, this.words.addChild(t, a);
		} else this.words.addChild(r, i, a);
		this.nova = wD(Z(e.tex("nova")), 380, 380), this.nova.position.set(qE / 2 - 120, 1250);
		let o = e.frames("orbi", "float");
		this.orbi = o.length > 1 ? ED(o, 16) : Z(e.tex("orbi")), wD(this.orbi, 190, 190), this.orbi.position.set(qE / 2 + 230, 1150), this.root.addChild(this.bg, this.beam, this.beam2, this.words, this.nova, this.orbi);
	}
	show(e) {
		this.root.visible = !0, this.root.alpha = 0, q.to(this.root, { alpha: 1 }, 500), this.words.scale.set(.6), q.to(this.words.scale, {
			x: 1,
			y: 1
		}, 700, zE), this.nova.alpha = 0, q.to(this.nova, { alpha: 1 }, 800, RE);
		let t = document.createElement("div");
		t.id = "sf-title", t.style.cssText = "position:absolute;left:0;right:0;bottom:7%;display:flex;flex-direction:column;align-items:center;gap:14px;pointer-events:auto";
		let n = document.createElement("button");
		n.className = "sf-btn", n.textContent = "PLAY", n.style.cssText = "font-size:32px;width:340px;height:100px;padding:0", n.onclick = () => e.play();
		let r = document.createElement("div");
		r.style.cssText = "display:flex;gap:12px";
		let i = document.createElement("button");
		i.className = "sf-btn ghost", i.textContent = "HOW TO PLAY", i.style.cssText = "width:220px;height:66px;padding:0;font-size:16px", i.onclick = () => e.rules();
		let a = document.createElement("button");
		a.className = "sf-btn ghost", a.style.cssText = "width:200px;height:66px;padding:0;font-size:16px";
		let o = (e) => e ? "SOUND: OFF" : "SOUND: ON";
		a.textContent = o(!1), a.onclick = () => a.textContent = o(e.sound()), r.append(i, a);
		let s = document.createElement("div");
		s.className = "sf-note", s.style.cssText = "opacity:.85;font:600 16px 'Exo 2';text-shadow:0 1px 4px #000", s.textContent = `${e.balance.toLocaleString("en-US")} demo balls · play credits only, no money`, t.append(n, r, s), document.getElementById("ui").appendChild(t), this.dom = t, n.focus();
	}
	async hide() {
		this.dom?.remove(), this.dom = void 0, await q.to(this.root, { alpha: 0 }, 400), this.root.visible = !1;
	}
	update(e) {
		this.root.visible && (this.t += e, this.bg.rotation = Math.sin(this.t * .05) * .015, this.bg.scale.set(this.bg.scale.x), this.beam.alpha = .5 + .2 * Math.sin(this.t * 3), this.beam2.alpha = .8 + .2 * Math.sin(this.t * 7), this.nova.y = 1250 + Math.sin(this.t * 1.4) * 18, this.nova.rotation = Math.sin(this.t * .9) * .05, this.orbi.y = 1150 + Math.sin(this.t * 2.1 + 1) * 24, this.words.y = 430 + Math.sin(this.t * .8) * 6, Math.random() < .5 && this.fx.emit({
			tex: this.fxt.glow,
			x: qE / 2 + (Math.random() - .5) * 50,
			y: JE * .95,
			n: 1,
			speed: [600, 1e3],
			angle: [-Math.PI / 2, -Math.PI / 2],
			life: [1.2, 1.8],
			scale: [.1, .22],
			endScale: 1,
			tint: [Q.cyan, Q.white],
			alpha: .7
		}));
	}
}, ik;
OE(() => {
	let e = ik;
	return e ? [
		{
			label: "Quick Reach",
			run: () => e.preview("quick")
		},
		{
			label: "Step-Up Re-spin",
			run: () => e.preview("stepup")
		},
		{
			label: "Mission Reach (capsule reveal)",
			run: () => e.preview("mission")
		},
		{
			label: "Hit + triple numerals + LIFT-OFF!",
			run: () => e.preview("hit")
		},
		{
			label: "LIFT-OFF! card",
			run: () => e.preview("liftoff")
		},
		{
			label: "Fever intro",
			run: () => e.preview("intro")
		},
		{
			label: "Round slam",
			run: () => e.preview("round")
		},
		{
			label: "GET tally",
			run: () => e.preview("get")
		},
		{
			label: "Thrust Gauge",
			run: () => e.preview("gauge")
		},
		{
			label: "MISSION COMPLETE",
			run: () => e.preview("end")
		},
		{
			label: "Starlift Surge",
			run: () => e.preview("surge")
		},
		{
			label: "PUSH pulse",
			run: () => e.pressPush()
		},
		{
			label: "LEDs: normal",
			run: () => e.previewLed("normal")
		},
		{
			label: "LEDs: reach",
			run: () => e.previewLed("reach")
		},
		{
			label: "LEDs: fever",
			run: () => e.previewLed("fever")
		}
	] : [];
}, "#2ef2ff");
function ak(e) {
	let t = window.innerWidth, n = window.innerHeight, r = Math.min(t / qE, n / JE), i = e.canvas;
	i.style.position = "absolute", i.style.width = `${qE * r}px`, i.style.height = `${JE * r}px`, i.style.left = `${(t - qE * r) / 2}px`, i.style.top = `${(n - JE * r) / 2}px`;
	let a = document.getElementById("ui");
	a.style.left = i.style.left, a.style.top = i.style.top, a.style.width = i.style.width, a.style.height = i.style.height, a.style.fontSize = `${Math.max(10, 16 * r * 1.6)}px`;
}
async function ok() {
	let e = new kC(), t = Math.min(2, window.devicePixelRatio || 1), n = Math.min(window.innerWidth / qE, window.innerHeight / JE) * t;
	await e.init({
		width: qE,
		height: JE,
		background: Q.navy,
		antialias: !0,
		resolution: Math.min(1, Math.max(.5, n)),
		autoDensity: !1,
		preference: "webgl"
	}), document.getElementById("game").appendChild(e.canvas), ak(e), window.addEventListener("resize", () => ak(e)), await Promise.all([
		document.fonts.load("900 64px \"Orbitron\""),
		document.fonts.load("700 28px \"Exo 2\""),
		document.fonts.load("700 28px \"Rajdhani\"")
	]).catch(() => void 0);
	let r = FD("STARLIFT FEVER", 76, Q.cyan);
	r.position.set(qE / 2, JE / 2 - 40);
	let i = PD("LOADING 0%", 30, 12577279);
	i.position.set(qE / 2, JE / 2 + 60), e.stage.addChild(r, i);
	let a = new jE(), [o] = await Promise.all([
		KE(),
		a.load((e) => i.text = `LOADING ${Math.round(e * 100)}%`),
		PE.load()
	]);
	for (let [e, t] of [
		["btnPlay", "--btn-play"],
		["btnPlayDown", "--btn-play-down"],
		["btnGhost", "--btn-ghost"],
		["btnGhostDown", "--btn-ghost-down"],
		["btnAlt", "--btn-alt"],
		["btnAltDown", "--btn-alt-down"],
		["btnRound", "--btn-round"]
	]) {
		let n = a.url(e);
		n && document.documentElement.style.setProperty(t, `url("${new URL(n, document.baseURI).href}")`);
	}
	r.destroy(), i.destroy();
	let s = new URLSearchParams(location.search), c = s.has("test") && s.get("tune") ? GE(JSON.parse(s.get("tune")), o) : o, l = UO(), u = (e) => {
		PE.setVolumes(e.music, e.sfx), PE.setMuted(e.muted), nk(e.muted), q.speed = e.turbo ? .5 : 1, q.reduced = e.reduced, ik && (ik.shake.enabled = !e.reduced), WO(e);
	}, d = IO(c), f = new jO(e, a, c, d, PE, {
		toast: (e, t) => $O(e, t),
		results: (e, t) => ZO(e, t, () => b()),
		balance: () => void 0
	});
	ik = f, await f.start(), u(l);
	let p = new rk(a, f.fxt, f.fx), m = new H();
	m.addChild(f.root, p.root), e.stage.addChild(m);
	let h = () => {
		if (d.refill) {
			let e = d.refill();
			f.setBalance(e), $O("Demo balls refilled.");
		}
	}, g = () => YO(l, u, d.refill ? [{
		label: "REFILL DEMO BALLS",
		cls: "ghost",
		run: () => h()
	}] : []), _ = () => (l.muted = !l.muted, u(l), l.muted), v, y = async () => {
		PE.unlock(), PE.play("sfx_ui_click"), await p.hide(), p.root.parent?.removeChild(f.fx.root), f.root.addChildAt(f.fx.root, f.root.children.length), f.world.addChild(f.fx.root), f.enter(), v ??= tk({
			settings: g,
			rules: () => XO(a),
			mute: _,
			lobby: () => BO(b)
		}), v.style.display = "flex";
	}, b = () => {
		f.machine.mode === "fever" || f.machine.lcd !== "idle" ? $O("Finish the current show first.") : (f.machine.mode !== "title" && f.machine.toTitle(), f.firing = !1, f.locked && f.toggleLock(), v && (v.style.display = "none"), p.root.addChild(f.fx.root), PE.setMusic("lobby"), p.show({
			play: () => void y(),
			rules: () => XO(a),
			sound: _,
			balance: f.balance
		}));
	};
	p.root.addChild(f.fx.root), p.show({
		play: () => void y(),
		rules: () => XO(a),
		sound: _,
		balance: f.balance
	}), PE.setMusic("lobby"), e.ticker.add((e) => {
		let t = Math.min(50, e.deltaMS);
		p.root.visible ? (p.update(t * f.timeScale / 1e3), q.update(t), f.fx.update(t / 1e3)) : f.update(t);
	}), window.addEventListener("keydown", (e) => {
		PE.unlock(), e.code === "Escape" ? (qO() ? KO() : p.root.visible || g(), e.preventDefault()) : e.code === "KeyM" && !e.repeat ? _() : !qO() && !p.root.visible && f.key(e, !0) && e.preventDefault();
	}), window.addEventListener("keyup", (e) => {
		p.root.visible || f.key(e, !1);
	}), window.addEventListener("wheel", (e) => !p.root.visible && f.wheel(e.deltaY), { passive: !0 }), window.addEventListener("pointerdown", () => PE.unlock(), { once: !0 }), (new URLSearchParams(location.search).has("test") || DE()) && (window.__sf = {
		game: f,
		play: () => y(),
		force: (e, t) => {
			"forceNext" in d && (d.forceNext = {
				kind: e,
				tier: t
			});
		},
		speed: (e) => f.timeScale = e,
		state: () => ({
			mode: f.machine.mode,
			lcd: f.machine.lcd,
			pending: f.machine.pendingCount,
			fever: f.machine.fever ? {
				round: f.machine.fever.round,
				stage: f.machine.fever.stage
			} : null,
			balance: f.balance,
			live: f.physics.live,
			fps: Math.round(e.ticker.FPS)
		}),
		art: () => a.report(),
		audio: () => PE.debug()
	}), window.__sfReady = !0;
}
ok().catch((e) => {
	console.error(e);
	let t = document.createElement("pre");
	t.style.cssText = "position:fixed;left:16px;top:16px;color:#ffd6f5;font:16px sans-serif;white-space:pre-wrap", t.textContent = e instanceof Error ? e.message : String(e), document.body.appendChild(t);
});
