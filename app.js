/* ts-fsrs 5.2.3 (FSRS-6)
MIT License

Copyright (c) 2025 Open Spaced Repetition

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.FSRS = {}));
})(this, (function (exports) { 'use strict';

  var State = /* @__PURE__ */ ((State2) => {
    State2[State2["New"] = 0] = "New";
    State2[State2["Learning"] = 1] = "Learning";
    State2[State2["Review"] = 2] = "Review";
    State2[State2["Relearning"] = 3] = "Relearning";
    return State2;
  })(State || {});
  var Rating = /* @__PURE__ */ ((Rating2) => {
    Rating2[Rating2["Manual"] = 0] = "Manual";
    Rating2[Rating2["Again"] = 1] = "Again";
    Rating2[Rating2["Hard"] = 2] = "Hard";
    Rating2[Rating2["Good"] = 3] = "Good";
    Rating2[Rating2["Easy"] = 4] = "Easy";
    return Rating2;
  })(Rating || {});

  var __defProp$6 = Object.defineProperty;
  var __defProps$2 = Object.defineProperties;
  var __getOwnPropDescs$2 = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
  var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
  var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
  var __defNormalProp$6 = (obj, key, value) => key in obj ? __defProp$6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues$2 = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp$2.call(b, prop))
        __defNormalProp$6(a, prop, b[prop]);
    if (__getOwnPropSymbols$2)
      for (var prop of __getOwnPropSymbols$2(b)) {
        if (__propIsEnum$2.call(b, prop))
          __defNormalProp$6(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps$2 = (a, b) => __defProps$2(a, __getOwnPropDescs$2(b));
  class TypeConvert {
    static card(card) {
      return __spreadProps$2(__spreadValues$2({}, card), {
        state: TypeConvert.state(card.state),
        due: TypeConvert.time(card.due),
        last_review: card.last_review ? TypeConvert.time(card.last_review) : void 0
      });
    }
    static rating(value) {
      if (typeof value === "string") {
        const firstLetter = value.charAt(0).toUpperCase();
        const restOfString = value.slice(1).toLowerCase();
        const ret = Rating[`${firstLetter}${restOfString}`];
        if (ret === void 0) {
          throw new Error(`Invalid rating:[${value}]`);
        }
        return ret;
      } else if (typeof value === "number") {
        return value;
      }
      throw new Error(`Invalid rating:[${value}]`);
    }
    static state(value) {
      if (typeof value === "string") {
        const firstLetter = value.charAt(0).toUpperCase();
        const restOfString = value.slice(1).toLowerCase();
        const ret = State[`${firstLetter}${restOfString}`];
        if (ret === void 0) {
          throw new Error(`Invalid state:[${value}]`);
        }
        return ret;
      } else if (typeof value === "number") {
        return value;
      }
      throw new Error(`Invalid state:[${value}]`);
    }
    static time(value) {
      const date = new Date(value);
      if (typeof value === "object" && value !== null && !Number.isNaN(Date.parse(value) || +date)) {
        return date;
      } else if (typeof value === "string") {
        const timestamp = Date.parse(value);
        if (!Number.isNaN(timestamp)) {
          return new Date(timestamp);
        } else {
          throw new Error(`Invalid date:[${value}]`);
        }
      } else if (typeof value === "number") {
        return new Date(value);
      }
      throw new Error(`Invalid date:[${value}]`);
    }
    static review_log(log) {
      return __spreadProps$2(__spreadValues$2({}, log), {
        due: TypeConvert.time(log.due),
        rating: TypeConvert.rating(log.rating),
        state: TypeConvert.state(log.state),
        review: TypeConvert.time(log.review)
      });
    }
  }

  Date.prototype.scheduler = function(t, isDay) {
    return date_scheduler(this, t, isDay);
  };
  Date.prototype.diff = function(pre, unit) {
    return date_diff(this, pre, unit);
  };
  Date.prototype.format = function() {
    return formatDate(this);
  };
  Date.prototype.dueFormat = function(last_review, unit, timeUnit) {
    return show_diff_message(this, last_review, unit, timeUnit);
  };
  function date_scheduler(now, t, isDay) {
    return new Date(
      isDay ? TypeConvert.time(now).getTime() + t * 24 * 60 * 60 * 1e3 : TypeConvert.time(now).getTime() + t * 60 * 1e3
    );
  }
  function date_diff(now, pre, unit) {
    if (!now || !pre) {
      throw new Error("Invalid date");
    }
    const diff = TypeConvert.time(now).getTime() - TypeConvert.time(pre).getTime();
    let r = 0;
    switch (unit) {
      case "days":
        r = Math.floor(diff / (24 * 60 * 60 * 1e3));
        break;
      case "minutes":
        r = Math.floor(diff / (60 * 1e3));
        break;
    }
    return r;
  }
  function formatDate(dateInput) {
    const date = TypeConvert.time(dateInput);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${year}-${padZero(month)}-${padZero(day)} ${padZero(hours)}:${padZero(
    minutes
  )}:${padZero(seconds)}`;
  }
  function padZero(num) {
    return num < 10 ? `0${num}` : `${num}`;
  }
  const TIMEUNIT = [60, 60, 24, 31, 12];
  const TIMEUNITFORMAT = ["second", "min", "hour", "day", "month", "year"];
  function show_diff_message(due, last_review, unit, timeUnit = TIMEUNITFORMAT) {
    due = TypeConvert.time(due);
    last_review = TypeConvert.time(last_review);
    if (timeUnit.length !== TIMEUNITFORMAT.length) {
      timeUnit = TIMEUNITFORMAT;
    }
    let diff = due.getTime() - last_review.getTime();
    let i = 0;
    diff /= 1e3;
    for (i = 0; i < TIMEUNIT.length; i++) {
      if (diff < TIMEUNIT[i]) {
        break;
      } else {
        diff /= TIMEUNIT[i];
      }
    }
    return `${Math.floor(diff)}${unit ? timeUnit[i] : ""}`;
  }
  function fixDate(value) {
    return TypeConvert.time(value);
  }
  function fixState(value) {
    return TypeConvert.state(value);
  }
  function fixRating(value) {
    return TypeConvert.rating(value);
  }
  const Grades = Object.freeze([
    Rating.Again,
    Rating.Hard,
    Rating.Good,
    Rating.Easy
  ]);
  const FUZZ_RANGES = [
    {
      start: 2.5,
      end: 7,
      factor: 0.15
    },
    {
      start: 7,
      end: 20,
      factor: 0.1
    },
    {
      start: 20,
      end: Infinity,
      factor: 0.05
    }
  ];
  function get_fuzz_range(interval, elapsed_days, maximum_interval) {
    let delta = 1;
    for (const range of FUZZ_RANGES) {
      delta += range.factor * Math.max(Math.min(interval, range.end) - range.start, 0);
    }
    interval = Math.min(interval, maximum_interval);
    let min_ivl = Math.max(2, Math.round(interval - delta));
    const max_ivl = Math.min(Math.round(interval + delta), maximum_interval);
    if (interval > elapsed_days) {
      min_ivl = Math.max(min_ivl, elapsed_days + 1);
    }
    min_ivl = Math.min(min_ivl, max_ivl);
    return { min_ivl, max_ivl };
  }
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
  function dateDiffInDays(last, cur) {
    const utc1 = Date.UTC(
      last.getUTCFullYear(),
      last.getUTCMonth(),
      last.getUTCDate()
    );
    const utc2 = Date.UTC(
      cur.getUTCFullYear(),
      cur.getUTCMonth(),
      cur.getUTCDate()
    );
    return Math.floor(
      (utc2 - utc1) / 864e5
      /** 1000 * 60 * 60 * 24*/
    );
  }

  const ConvertStepUnitToMinutes = (step) => {
    const unit = step.slice(-1);
    const value = parseInt(step.slice(0, -1), 10);
    if (Number.isNaN(value) || !Number.isFinite(value) || value < 0) {
      throw new Error(`Invalid step value: ${step}`);
    }
    switch (unit) {
      case "m":
        return value;
      case "h":
        return value * 60;
      case "d":
        return value * 1440;
      default:
        throw new Error(`Invalid step unit: ${step}, expected m/h/d`);
    }
  };
  const BasicLearningStepsStrategy = (params, state, cur_step) => {
    const learning_steps = state === State.Relearning || state === State.Review ? params.relearning_steps : params.learning_steps;
    const steps_length = learning_steps.length;
    if (steps_length === 0 || cur_step >= steps_length) return {};
    const firstStep = learning_steps[0];
    const toMinutes = ConvertStepUnitToMinutes;
    const getAgainInterval = () => {
      return toMinutes(firstStep);
    };
    const getHardInterval = () => {
      if (steps_length === 1) return Math.round(toMinutes(firstStep) * 1.5);
      const nextStep = learning_steps[1];
      return Math.round((toMinutes(firstStep) + toMinutes(nextStep)) / 2);
    };
    const getStepInfo = (index) => {
      if (index < 0 || index >= steps_length) {
        return null;
      } else {
        return learning_steps[index];
      }
    };
    const getGoodMinutes = (step) => {
      return toMinutes(step);
    };
    const result = {};
    const step_info = getStepInfo(Math.max(0, cur_step));
    if (state === State.Review) {
      result[Rating.Again] = {
        scheduled_minutes: toMinutes(step_info),
        next_step: 0
      };
      return result;
    } else {
      result[Rating.Again] = {
        scheduled_minutes: getAgainInterval(),
        next_step: 0
      };
      result[Rating.Hard] = {
        scheduled_minutes: getHardInterval(),
        next_step: cur_step
      };
      const next_info = getStepInfo(cur_step + 1);
      if (next_info) {
        const nextMin = getGoodMinutes(next_info);
        if (nextMin) {
          result[Rating.Good] = {
            scheduled_minutes: Math.round(nextMin),
            next_step: cur_step + 1
          };
        }
      }
    }
    return result;
  };

  function DefaultInitSeedStrategy() {
    const time = this.review_time.getTime();
    const reps = this.current.reps;
    const mul = this.current.difficulty * this.current.stability;
    return `${time}_${reps}_${mul}`;
  }
  function GenSeedStrategyWithCardId(card_id_field) {
    return function() {
      var _a;
      const card_id = (_a = Reflect.get(this.current, card_id_field)) != null ? _a : 0;
      const reps = this.current.reps;
      return String(card_id + reps || 0);
    };
  }

  var StrategyMode = /* @__PURE__ */ ((StrategyMode2) => {
    StrategyMode2["SCHEDULER"] = "Scheduler";
    StrategyMode2["LEARNING_STEPS"] = "LearningSteps";
    StrategyMode2["SEED"] = "Seed";
    return StrategyMode2;
  })(StrategyMode || {});

  var __defProp$5 = Object.defineProperty;
  var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$5 = (obj, key, value) => __defNormalProp$5(obj, typeof key !== "symbol" ? key + "" : key, value);
  class AbstractScheduler {
    // init
    constructor(card, now, algorithm, strategies) {
      __publicField$5(this, "last");
      __publicField$5(this, "current");
      __publicField$5(this, "review_time");
      __publicField$5(this, "next", /* @__PURE__ */ new Map());
      __publicField$5(this, "algorithm");
      __publicField$5(this, "strategies");
      __publicField$5(this, "elapsed_days", 0);
      this.algorithm = algorithm;
      this.last = TypeConvert.card(card);
      this.current = TypeConvert.card(card);
      this.review_time = TypeConvert.time(now);
      this.strategies = strategies;
      this.init();
    }
    checkGrade(grade) {
      if (!Number.isFinite(grade) || grade < 0 || grade > 4) {
        throw new Error(`Invalid grade "${grade}",expected 1-4`);
      }
    }
    init() {
      const { state, last_review } = this.current;
      let interval = 0;
      if (state !== State.New && last_review) {
        interval = dateDiffInDays(last_review, this.review_time);
      }
      this.current.last_review = this.review_time;
      this.elapsed_days = interval;
      this.current.elapsed_days = interval;
      this.current.reps += 1;
      let seed_strategy = DefaultInitSeedStrategy;
      if (this.strategies) {
        const custom_strategy = this.strategies.get(StrategyMode.SEED);
        if (custom_strategy) {
          seed_strategy = custom_strategy;
        }
      }
      this.algorithm.seed = seed_strategy.call(this);
    }
    preview() {
      return {
        [Rating.Again]: this.review(Rating.Again),
        [Rating.Hard]: this.review(Rating.Hard),
        [Rating.Good]: this.review(Rating.Good),
        [Rating.Easy]: this.review(Rating.Easy),
        [Symbol.iterator]: this.previewIterator.bind(this)
      };
    }
    *previewIterator() {
      for (const grade of Grades) {
        yield this.review(grade);
      }
    }
    review(grade) {
      const { state } = this.last;
      let item;
      this.checkGrade(grade);
      switch (state) {
        case State.New:
          item = this.newState(grade);
          break;
        case State.Learning:
        case State.Relearning:
          item = this.learningState(grade);
          break;
        case State.Review:
          item = this.reviewState(grade);
          break;
      }
      return item;
    }
    buildLog(rating) {
      const { last_review, due, elapsed_days } = this.last;
      return {
        rating,
        state: this.current.state,
        due: last_review || due,
        stability: this.current.stability,
        difficulty: this.current.difficulty,
        elapsed_days: this.elapsed_days,
        last_elapsed_days: elapsed_days,
        scheduled_days: this.current.scheduled_days,
        learning_steps: this.current.learning_steps,
        review: this.review_time
      };
    }
  }

  var __defProp$4 = Object.defineProperty;
  var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$4 = (obj, key, value) => __defNormalProp$4(obj, typeof key !== "symbol" ? key + "" : key, value);
  class Alea {
    constructor(seed) {
      __publicField$4(this, "c");
      __publicField$4(this, "s0");
      __publicField$4(this, "s1");
      __publicField$4(this, "s2");
      const mash = Mash();
      this.c = 1;
      this.s0 = mash(" ");
      this.s1 = mash(" ");
      this.s2 = mash(" ");
      if (seed == null) seed = Date.now();
      this.s0 -= mash(seed);
      if (this.s0 < 0) this.s0 += 1;
      this.s1 -= mash(seed);
      if (this.s1 < 0) this.s1 += 1;
      this.s2 -= mash(seed);
      if (this.s2 < 0) this.s2 += 1;
    }
    next() {
      const t = 2091639 * this.s0 + this.c * 23283064365386963e-26;
      this.s0 = this.s1;
      this.s1 = this.s2;
      this.c = t | 0;
      this.s2 = t - this.c;
      return this.s2;
    }
    set state(state) {
      this.c = state.c;
      this.s0 = state.s0;
      this.s1 = state.s1;
      this.s2 = state.s2;
    }
    get state() {
      return {
        c: this.c,
        s0: this.s0,
        s1: this.s1,
        s2: this.s2
      };
    }
  }
  function Mash() {
    let n = 4022871197;
    return function mash(data) {
      data = String(data);
      for (let i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        let h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 4294967296;
      }
      return (n >>> 0) * 23283064365386963e-26;
    };
  }
  function alea(seed) {
    const xg = new Alea(seed);
    const prng = () => xg.next();
    prng.int32 = () => xg.next() * 4294967296 | 0;
    prng.double = () => prng() + (prng() * 2097152 | 0) * 11102230246251565e-32;
    prng.state = () => xg.state;
    prng.importState = (state) => {
      xg.state = state;
      return prng;
    };
    return prng;
  }

  const version="5.2.3";

  const default_request_retention = 0.9;
  const default_maximum_interval = 36500;
  const default_enable_fuzz = false;
  const default_enable_short_term = true;
  const default_learning_steps = Object.freeze([
    "1m",
    "10m"
  ]);
  const default_relearning_steps = Object.freeze([
    "10m"
  ]);
  const FSRSVersion = `v${version} using FSRS-6.0`;
  const S_MIN = 1e-3;
  const S_MAX = 36500;
  const INIT_S_MAX = 100;
  const FSRS5_DEFAULT_DECAY = 0.5;
  const FSRS6_DEFAULT_DECAY = 0.1542;
  const default_w = Object.freeze([
    0.212,
    1.2931,
    2.3065,
    8.2956,
    6.4133,
    0.8334,
    3.0194,
    1e-3,
    1.8722,
    0.1666,
    0.796,
    1.4835,
    0.0614,
    0.2629,
    1.6483,
    0.6014,
    1.8729,
    0.5425,
    0.0912,
    0.0658,
    FSRS6_DEFAULT_DECAY
  ]);
  const W17_W18_Ceiling = 2;
  const CLAMP_PARAMETERS = (w17_w18_ceiling, enable_short_term = default_enable_short_term) => [
    [S_MIN, INIT_S_MAX],
    [S_MIN, INIT_S_MAX],
    [S_MIN, INIT_S_MAX],
    [S_MIN, INIT_S_MAX],
    [1, 10],
    [1e-3, 4],
    [1e-3, 4],
    [1e-3, 0.75],
    [0, 4.5],
    [0, 0.8],
    [1e-3, 3.5],
    [1e-3, 5],
    [1e-3, 0.25],
    [1e-3, 0.9],
    [0, 4],
    [0, 1],
    [1, 6],
    [0, w17_w18_ceiling],
    [0, w17_w18_ceiling],
    [
      enable_short_term ? 0.01 : 0,
      0.8
    ],
    [0.1, 0.8]
  ];

  const clipParameters = (parameters, numRelearningSteps, enableShortTerm = default_enable_short_term) => {
    let w17_w18_ceiling = W17_W18_Ceiling;
    if (Math.max(0, numRelearningSteps) > 1) {
      const value = -(Math.log(parameters[11]) + Math.log(Math.pow(2, parameters[13]) - 1) + parameters[14] * 0.3) / numRelearningSteps;
      w17_w18_ceiling = clamp(+value.toFixed(8), 0.01, 2);
    }
    const clip = CLAMP_PARAMETERS(w17_w18_ceiling, enableShortTerm).slice(
      0,
      parameters.length
    );
    return clip.map(
      ([min, max], index) => clamp(parameters[index] || 0, min, max)
    );
  };
  const checkParameters = (parameters) => {
    const invalid = parameters.find(
      (param) => !Number.isFinite(param) && !Number.isNaN(param)
    );
    if (invalid !== void 0) {
      throw Error(`Non-finite or NaN value in parameters ${parameters}`);
    } else if (![17, 19, 21].includes(parameters.length)) {
      throw Error(
        `Invalid parameter length: ${parameters.length}. Must be 17, 19 or 21 for FSRSv4, 5 and 6 respectively.`
      );
    }
    return parameters;
  };
  const migrateParameters = (parameters, numRelearningSteps = 0, enableShortTerm = default_enable_short_term) => {
    if (parameters === void 0) {
      return [...default_w];
    }
    switch (parameters.length) {
      case 21:
        return clipParameters(
          Array.from(parameters),
          numRelearningSteps,
          enableShortTerm
        );
      case 19:
        console.debug("[FSRS-6]auto fill w from 19 to 21 length");
        return clipParameters(
          Array.from(parameters),
          numRelearningSteps,
          enableShortTerm
        ).concat([0, FSRS5_DEFAULT_DECAY]);
      case 17: {
        const w = clipParameters(
          Array.from(parameters),
          numRelearningSteps,
          enableShortTerm
        );
        w[4] = +(w[5] * 2 + w[4]).toFixed(8);
        w[5] = +(Math.log(w[5] * 3 + 1) / 3).toFixed(8);
        w[6] = +(w[6] + 0.5).toFixed(8);
        console.debug("[FSRS-6]auto fill w from 17 to 21 length");
        return w.concat([0, 0, 0, FSRS5_DEFAULT_DECAY]);
      }
      default:
        console.warn("[FSRS]Invalid parameters length, using default parameters");
        return [...default_w];
    }
  };
  const generatorParameters = (props) => {
    var _a, _b;
    const learning_steps = Array.isArray(props == null ? void 0 : props.learning_steps) ? props.learning_steps : default_learning_steps;
    const relearning_steps = Array.isArray(props == null ? void 0 : props.relearning_steps) ? props.relearning_steps : default_relearning_steps;
    const enable_short_term = (_a = props == null ? void 0 : props.enable_short_term) != null ? _a : default_enable_short_term;
    const w = migrateParameters(
      props == null ? void 0 : props.w,
      relearning_steps.length,
      enable_short_term
    );
    return {
      request_retention: (props == null ? void 0 : props.request_retention) || default_request_retention,
      maximum_interval: (props == null ? void 0 : props.maximum_interval) || default_maximum_interval,
      w,
      enable_fuzz: (_b = props == null ? void 0 : props.enable_fuzz) != null ? _b : default_enable_fuzz,
      enable_short_term,
      learning_steps,
      relearning_steps
    };
  };
  function createEmptyCard(now, afterHandler) {
    const emptyCard = {
      due: now ? TypeConvert.time(now) : /* @__PURE__ */ new Date(),
      stability: 0,
      difficulty: 0,
      elapsed_days: 0,
      scheduled_days: 0,
      reps: 0,
      lapses: 0,
      learning_steps: 0,
      state: State.New,
      last_review: void 0
    };
    if (afterHandler && typeof afterHandler === "function") {
      return afterHandler(emptyCard);
    } else {
      return emptyCard;
    }
  }

  var __defProp$3 = Object.defineProperty;
  var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$3 = (obj, key, value) => __defNormalProp$3(obj, typeof key !== "symbol" ? key + "" : key, value);
  const computeDecayFactor = (decayOrParams) => {
    const decay = typeof decayOrParams === "number" ? -decayOrParams : -decayOrParams[20];
    const factor = Math.exp(Math.pow(decay, -1) * Math.log(0.9)) - 1;
    return { decay, factor: +factor.toFixed(8) };
  };
  function forgetting_curve(decayOrParams, elapsed_days, stability) {
    const { decay, factor } = computeDecayFactor(decayOrParams);
    return +Math.pow(1 + factor * elapsed_days / stability, decay).toFixed(8);
  }
  class FSRSAlgorithm {
    constructor(params) {
      __publicField$3(this, "param");
      __publicField$3(this, "intervalModifier");
      __publicField$3(this, "_seed");
      /**
       * The formula used is :
       * $$R(t,S) = (1 + \text{FACTOR} \times \frac{t}{9 \cdot S})^{\text{DECAY}}$$
       * @param {number} elapsed_days t days since the last review
       * @param {number} stability Stability (interval when R=90%)
       * @return {number} r Retrievability (probability of recall)
       */
      __publicField$3(this, "forgetting_curve");
      this.param = new Proxy(
        generatorParameters(params),
        this.params_handler_proxy()
      );
      this.intervalModifier = this.calculate_interval_modifier(
        this.param.request_retention
      );
      this.forgetting_curve = forgetting_curve.bind(this, this.param.w);
    }
    get interval_modifier() {
      return this.intervalModifier;
    }
    set seed(seed) {
      this._seed = seed;
    }
    /**
     * @see https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm#fsrs-5
     *
     * The formula used is: $$I(r,s) = (r^{\frac{1}{DECAY}} - 1) / FACTOR \times s$$
     * @param request_retention 0<request_retention<=1,Requested retention rate
     * @throws {Error} Requested retention rate should be in the range (0,1]
     */
    calculate_interval_modifier(request_retention) {
      if (request_retention <= 0 || request_retention > 1) {
        throw new Error("Requested retention rate should be in the range (0,1]");
      }
      const { decay, factor } = computeDecayFactor(this.param.w);
      return +((Math.pow(request_retention, 1 / decay) - 1) / factor).toFixed(8);
    }
    /**
     * Get the parameters of the algorithm.
     */
    get parameters() {
      return this.param;
    }
    /**
     * Set the parameters of the algorithm.
     * @param params Partial<FSRSParameters>
     */
    set parameters(params) {
      this.update_parameters(params);
    }
    params_handler_proxy() {
      const _this = this;
      return {
        set: function(target, prop, value) {
          if (prop === "request_retention" && Number.isFinite(value)) {
            _this.intervalModifier = _this.calculate_interval_modifier(
              Number(value)
            );
          } else if (prop === "w") {
            value = migrateParameters(
              value,
              target.relearning_steps.length,
              target.enable_short_term
            );
            _this.forgetting_curve = forgetting_curve.bind(this, value);
            _this.intervalModifier = _this.calculate_interval_modifier(
              Number(target.request_retention)
            );
          }
          Reflect.set(target, prop, value);
          return true;
        }
      };
    }
    update_parameters(params) {
      const _params = generatorParameters(params);
      for (const key in _params) {
        const paramKey = key;
        this.param[paramKey] = _params[paramKey];
      }
    }
    /**
       * The formula used is :
       * $$ S_0(G) = w_{G-1}$$
       * $$S_0 = \max \lbrace S_0,0.1\rbrace $$
    
       * @param g Grade (rating at Anki) [1.again,2.hard,3.good,4.easy]
       * @return Stability (interval when R=90%)
       */
    init_stability(g) {
      return Math.max(this.param.w[g - 1], 0.1);
    }
    /**
     * The formula used is :
     * $$D_0(G) = w_4 - e^{(G-1) \cdot w_5} + 1 $$
     * $$D_0 = \min \lbrace \max \lbrace D_0(G),1 \rbrace,10 \rbrace$$
     * where the $$D_0(1)=w_4$$ when the first rating is good.
     *
     * @param {Grade} g Grade (rating at Anki) [1.again,2.hard,3.good,4.easy]
     * @return {number} Difficulty $$D \in [1,10]$$
     */
    init_difficulty(g) {
      const d = this.param.w[4] - Math.exp((g - 1) * this.param.w[5]) + 1;
      return +d.toFixed(8);
    }
    /**
     * If fuzzing is disabled or ivl is less than 2.5, it returns the original interval.
     * @param {number} ivl - The interval to be fuzzed.
     * @param {number} elapsed_days t days since the last review
     * @return {number} - The fuzzed interval.
     **/
    apply_fuzz(ivl, elapsed_days) {
      if (!this.param.enable_fuzz || ivl < 2.5) return Math.round(ivl);
      const generator = alea(this._seed);
      const fuzz_factor = generator();
      const { min_ivl, max_ivl } = get_fuzz_range(
        ivl,
        elapsed_days,
        this.param.maximum_interval
      );
      return Math.floor(fuzz_factor * (max_ivl - min_ivl + 1) + min_ivl);
    }
    /**
     *   @see The formula used is : {@link FSRSAlgorithm.calculate_interval_modifier}
     *   @param {number} s - Stability (interval when R=90%)
     *   @param {number} elapsed_days t days since the last review
     */
    next_interval(s, elapsed_days) {
      const newInterval = Math.min(
        Math.max(1, Math.round(s * this.intervalModifier)),
        this.param.maximum_interval
      );
      return this.apply_fuzz(newInterval, elapsed_days);
    }
    /**
     * @see https://github.com/open-spaced-repetition/fsrs4anki/issues/697
     */
    linear_damping(delta_d, old_d) {
      return +(delta_d * (10 - old_d) / 9).toFixed(8);
    }
    /**
     * The formula used is :
     * $$\text{delta}_d = -w_6 \cdot (g - 3)$$
     * $$\text{next}_d = D + \text{linear damping}(\text{delta}_d , D)$$
     * $$D^\prime(D,R) = w_7 \cdot D_0(4) +(1 - w_7) \cdot \text{next}_d$$
     * @param {number} d Difficulty $$D \in [1,10]$$
     * @param {Grade} g Grade (rating at Anki) [1.again,2.hard,3.good,4.easy]
     * @return {number} $$\text{next}_D$$
     */
    next_difficulty(d, g) {
      const delta_d = -this.param.w[6] * (g - 3);
      const next_d = d + this.linear_damping(delta_d, d);
      return clamp(
        this.mean_reversion(this.init_difficulty(Rating.Easy), next_d),
        1,
        10
      );
    }
    /**
     * The formula used is :
     * $$w_7 \cdot \text{init} +(1 - w_7) \cdot \text{current}$$
     * @param {number} init $$w_2 : D_0(3) = w_2 + (R-2) \cdot w_3= w_2$$
     * @param {number} current $$D - w_6 \cdot (R - 2)$$
     * @return {number} difficulty
     */
    mean_reversion(init, current) {
      return +(this.param.w[7] * init + (1 - this.param.w[7]) * current).toFixed(
        8
      );
    }
    /**
     * The formula used is :
     * $$S^\prime_r(D,S,R,G) = S\cdot(e^{w_8}\cdot (11-D)\cdot S^{-w_9}\cdot(e^{w_{10}\cdot(1-R)}-1)\cdot w_{15}(\text{if} G=2) \cdot w_{16}(\text{if} G=4)+1)$$
     * @param {number} d Difficulty D \in [1,10]
     * @param {number} s Stability (interval when R=90%)
     * @param {number} r Retrievability (probability of recall)
     * @param {Grade} g Grade (Rating[0.again,1.hard,2.good,3.easy])
     * @return {number} S^\prime_r new stability after recall
     */
    next_recall_stability(d, s, r, g) {
      const hard_penalty = Rating.Hard === g ? this.param.w[15] : 1;
      const easy_bound = Rating.Easy === g ? this.param.w[16] : 1;
      return +clamp(
        s * (1 + Math.exp(this.param.w[8]) * (11 - d) * Math.pow(s, -this.param.w[9]) * (Math.exp((1 - r) * this.param.w[10]) - 1) * hard_penalty * easy_bound),
        S_MIN,
        36500
      ).toFixed(8);
    }
    /**
     * The formula used is :
     * $$S^\prime_f(D,S,R) = w_{11}\cdot D^{-w_{12}}\cdot ((S+1)^{w_{13}}-1) \cdot e^{w_{14}\cdot(1-R)}$$
     * enable_short_term = true : $$S^\prime_f \in \min \lbrace \max \lbrace S^\prime_f,0.01\rbrace, \frac{S}{e^{w_{17} \cdot w_{18}}} \rbrace$$
     * enable_short_term = false : $$S^\prime_f \in \min \lbrace \max \lbrace S^\prime_f,0.01\rbrace, S \rbrace$$
     * @param {number} d Difficulty D \in [1,10]
     * @param {number} s Stability (interval when R=90%)
     * @param {number} r Retrievability (probability of recall)
     * @return {number} S^\prime_f new stability after forgetting
     */
    next_forget_stability(d, s, r) {
      return +clamp(
        this.param.w[11] * Math.pow(d, -this.param.w[12]) * (Math.pow(s + 1, this.param.w[13]) - 1) * Math.exp((1 - r) * this.param.w[14]),
        S_MIN,
        36500
      ).toFixed(8);
    }
    /**
     * The formula used is :
     * $$S^\prime_s(S,G) = S \cdot e^{w_{17} \cdot (G-3+w_{18})}$$
     * @param {number} s Stability (interval when R=90%)
     * @param {Grade} g Grade (Rating[0.again,1.hard,2.good,3.easy])
     */
    next_short_term_stability(s, g) {
      const sinc = Math.pow(s, -this.param.w[19]) * Math.exp(this.param.w[17] * (g - 3 + this.param.w[18]));
      const maskedSinc = g >= 3 ? Math.max(sinc, 1) : sinc;
      return +clamp(s * maskedSinc, S_MIN, 36500).toFixed(8);
    }
    /**
     * Calculates the next state of memory based on the current state, time elapsed, and grade.
     *
     * @param memory_state - The current state of memory, which can be null.
     * @param t - The time elapsed since the last review.
     * @param {Rating} g Grade (Rating[0.Manual,1.Again,2.Hard,3.Good,4.Easy])
     * @returns The next state of memory with updated difficulty and stability.
     */
    next_state(memory_state, t, g) {
      const { difficulty: d, stability: s } = memory_state != null ? memory_state : {
        difficulty: 0,
        stability: 0
      };
      if (t < 0) {
        throw new Error(`Invalid delta_t "${t}"`);
      }
      if (g < 0 || g > 4) {
        throw new Error(`Invalid grade "${g}"`);
      }
      if (d === 0 && s === 0) {
        return {
          difficulty: clamp(this.init_difficulty(g), 1, 10),
          stability: this.init_stability(g)
        };
      }
      if (g === 0) {
        return {
          difficulty: d,
          stability: s
        };
      }
      if (d < 1 || s < S_MIN) {
        throw new Error(
          `Invalid memory state { difficulty: ${d}, stability: ${s} }`
        );
      }
      const r = this.forgetting_curve(t, s);
      const s_after_success = this.next_recall_stability(d, s, r, g);
      const s_after_fail = this.next_forget_stability(d, s, r);
      const s_after_short_term = this.next_short_term_stability(s, g);
      let new_s = s_after_success;
      if (g === 1) {
        let [w_17, w_18] = [0, 0];
        if (this.param.enable_short_term) {
          w_17 = this.param.w[17];
          w_18 = this.param.w[18];
        }
        const next_s_min = s / Math.exp(w_17 * w_18);
        new_s = clamp(+next_s_min.toFixed(8), S_MIN, s_after_fail);
      }
      if (t === 0 && this.param.enable_short_term) {
        new_s = s_after_short_term;
      }
      const new_d = this.next_difficulty(d, g);
      return { difficulty: new_d, stability: new_s };
    }
  }

  var __defProp$2 = Object.defineProperty;
  var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField$2 = (obj, key, value) => __defNormalProp$2(obj, key + "" , value);
  class BasicScheduler extends AbstractScheduler {
    constructor(card, now, algorithm, strategies) {
      super(card, now, algorithm, strategies);
      __publicField$2(this, "learningStepsStrategy");
      let learningStepStrategy = BasicLearningStepsStrategy;
      if (this.strategies) {
        const custom_strategy = this.strategies.get(StrategyMode.LEARNING_STEPS);
        if (custom_strategy) {
          learningStepStrategy = custom_strategy;
        }
      }
      this.learningStepsStrategy = learningStepStrategy;
    }
    getLearningInfo(card, grade) {
      var _a, _b, _c, _d;
      const parameters = this.algorithm.parameters;
      card.learning_steps = card.learning_steps || 0;
      const steps_strategy = this.learningStepsStrategy(
        parameters,
        card.state,
        // In the original learning steps setup (Again = 5m, Hard = 10m, Good = FSRS),
        // not adding 1 can cause slight variations in the memory state’s ds.
        this.current.state === State.Learning && grade !== Rating.Again && grade !== Rating.Hard ? card.learning_steps + 1 : card.learning_steps
      );
      const scheduled_minutes = Math.max(
        0,
        (_b = (_a = steps_strategy[grade]) == null ? void 0 : _a.scheduled_minutes) != null ? _b : 0
      );
      const next_steps = Math.max(0, (_d = (_c = steps_strategy[grade]) == null ? void 0 : _c.next_step) != null ? _d : 0);
      return {
        scheduled_minutes,
        next_steps
      };
    }
    /**
     * @description This function applies the learning steps based on the current card's state and grade.
     */
    applyLearningSteps(nextCard, grade, to_state) {
      const { scheduled_minutes, next_steps } = this.getLearningInfo(
        this.current,
        grade
      );
      if (scheduled_minutes > 0 && scheduled_minutes < 1440) {
        nextCard.learning_steps = next_steps;
        nextCard.scheduled_days = 0;
        nextCard.state = to_state;
        nextCard.due = date_scheduler(
          this.review_time,
          Math.round(scheduled_minutes),
          false
          /** true:days false: minute */
        );
      } else {
        nextCard.state = State.Review;
        if (scheduled_minutes >= 1440) {
          nextCard.learning_steps = next_steps;
          nextCard.due = date_scheduler(
            this.review_time,
            Math.round(scheduled_minutes),
            false
            /** true:days false: minute */
          );
          nextCard.scheduled_days = Math.floor(scheduled_minutes / 1440);
        } else {
          nextCard.learning_steps = 0;
          const interval = this.algorithm.next_interval(
            nextCard.stability,
            this.elapsed_days
          );
          nextCard.scheduled_days = interval;
          nextCard.due = date_scheduler(this.review_time, interval, true);
        }
      }
    }
    newState(grade) {
      const exist = this.next.get(grade);
      if (exist) {
        return exist;
      }
      const next = TypeConvert.card(this.current);
      next.difficulty = clamp(this.algorithm.init_difficulty(grade), 1, 10);
      next.stability = this.algorithm.init_stability(grade);
      this.applyLearningSteps(next, grade, State.Learning);
      const item = {
        card: next,
        log: this.buildLog(grade)
      };
      this.next.set(grade, item);
      return item;
    }
    learningState(grade) {
      const exist = this.next.get(grade);
      if (exist) {
        return exist;
      }
      const { state, difficulty, stability } = this.last;
      const next = TypeConvert.card(this.current);
      next.difficulty = this.algorithm.next_difficulty(difficulty, grade);
      next.stability = this.algorithm.next_short_term_stability(stability, grade);
      this.applyLearningSteps(
        next,
        grade,
        state
        /** Learning or Relearning */
      );
      const item = {
        card: next,
        log: this.buildLog(grade)
      };
      this.next.set(grade, item);
      return item;
    }
    reviewState(grade) {
      const exist = this.next.get(grade);
      if (exist) {
        return exist;
      }
      const interval = this.elapsed_days;
      const { difficulty, stability } = this.last;
      const retrievability = this.algorithm.forgetting_curve(interval, stability);
      const next_again = TypeConvert.card(this.current);
      const next_hard = TypeConvert.card(this.current);
      const next_good = TypeConvert.card(this.current);
      const next_easy = TypeConvert.card(this.current);
      this.next_ds(
        next_again,
        next_hard,
        next_good,
        next_easy,
        difficulty,
        stability,
        retrievability
      );
      this.next_interval(next_hard, next_good, next_easy, interval);
      this.next_state(next_hard, next_good, next_easy);
      this.applyLearningSteps(next_again, Rating.Again, State.Relearning);
      next_again.lapses += 1;
      const item_again = {
        card: next_again,
        log: this.buildLog(Rating.Again)
      };
      const item_hard = {
        card: next_hard,
        log: super.buildLog(Rating.Hard)
      };
      const item_good = {
        card: next_good,
        log: super.buildLog(Rating.Good)
      };
      const item_easy = {
        card: next_easy,
        log: super.buildLog(Rating.Easy)
      };
      this.next.set(Rating.Again, item_again);
      this.next.set(Rating.Hard, item_hard);
      this.next.set(Rating.Good, item_good);
      this.next.set(Rating.Easy, item_easy);
      return this.next.get(grade);
    }
    /**
     * Review next_ds
     */
    next_ds(next_again, next_hard, next_good, next_easy, difficulty, stability, retrievability) {
      next_again.difficulty = this.algorithm.next_difficulty(
        difficulty,
        Rating.Again
      );
      const nextSMin = stability / Math.exp(
        this.algorithm.parameters.w[17] * this.algorithm.parameters.w[18]
      );
      const s_after_fail = this.algorithm.next_forget_stability(
        difficulty,
        stability,
        retrievability
      );
      next_again.stability = clamp(+nextSMin.toFixed(8), S_MIN, s_after_fail);
      next_hard.difficulty = this.algorithm.next_difficulty(
        difficulty,
        Rating.Hard
      );
      next_hard.stability = this.algorithm.next_recall_stability(
        difficulty,
        stability,
        retrievability,
        Rating.Hard
      );
      next_good.difficulty = this.algorithm.next_difficulty(
        difficulty,
        Rating.Good
      );
      next_good.stability = this.algorithm.next_recall_stability(
        difficulty,
        stability,
        retrievability,
        Rating.Good
      );
      next_easy.difficulty = this.algorithm.next_difficulty(
        difficulty,
        Rating.Easy
      );
      next_easy.stability = this.algorithm.next_recall_stability(
        difficulty,
        stability,
        retrievability,
        Rating.Easy
      );
    }
    /**
     * Review next_interval
     */
    next_interval(next_hard, next_good, next_easy, interval) {
      let hard_interval, good_interval;
      hard_interval = this.algorithm.next_interval(next_hard.stability, interval);
      good_interval = this.algorithm.next_interval(next_good.stability, interval);
      hard_interval = Math.min(hard_interval, good_interval);
      good_interval = Math.max(good_interval, hard_interval + 1);
      const easy_interval = Math.max(
        this.algorithm.next_interval(next_easy.stability, interval),
        good_interval + 1
      );
      next_hard.scheduled_days = hard_interval;
      next_hard.due = date_scheduler(this.review_time, hard_interval, true);
      next_good.scheduled_days = good_interval;
      next_good.due = date_scheduler(this.review_time, good_interval, true);
      next_easy.scheduled_days = easy_interval;
      next_easy.due = date_scheduler(this.review_time, easy_interval, true);
    }
    /**
     * Review next_state
     */
    next_state(next_hard, next_good, next_easy) {
      next_hard.state = State.Review;
      next_hard.learning_steps = 0;
      next_good.state = State.Review;
      next_good.learning_steps = 0;
      next_easy.state = State.Review;
      next_easy.learning_steps = 0;
    }
  }

  class LongTermScheduler extends AbstractScheduler {
    newState(grade) {
      const exist = this.next.get(grade);
      if (exist) {
        return exist;
      }
      this.current.scheduled_days = 0;
      this.current.elapsed_days = 0;
      const next_again = TypeConvert.card(this.current);
      const next_hard = TypeConvert.card(this.current);
      const next_good = TypeConvert.card(this.current);
      const next_easy = TypeConvert.card(this.current);
      this.init_ds(next_again, next_hard, next_good, next_easy);
      const first_interval = 0;
      this.next_interval(
        next_again,
        next_hard,
        next_good,
        next_easy,
        first_interval
      );
      this.next_state(next_again, next_hard, next_good, next_easy);
      this.update_next(next_again, next_hard, next_good, next_easy);
      return this.next.get(grade);
    }
    init_ds(next_again, next_hard, next_good, next_easy) {
      next_again.difficulty = clamp(
        this.algorithm.init_difficulty(Rating.Again),
        1,
        10
      );
      next_again.stability = this.algorithm.init_stability(Rating.Again);
      next_hard.difficulty = clamp(
        this.algorithm.init_difficulty(Rating.Hard),
        1,
        10
      );
      next_hard.stability = this.algorithm.init_stability(Rating.Hard);
      next_good.difficulty = clamp(
        this.algorithm.init_difficulty(Rating.Good),
        1,
        10
      );
      next_good.stability = this.algorithm.init_stability(Rating.Good);
      next_easy.difficulty = clamp(
        this.algorithm.init_difficulty(Rating.Easy),
        1,
        10
      );
      next_easy.stability = this.algorithm.init_stability(Rating.Easy);
    }
    /**
     * @see https://github.com/open-spaced-repetition/ts-fsrs/issues/98#issuecomment-2241923194
     */
    learningState(grade) {
      return this.reviewState(grade);
    }
    reviewState(grade) {
      const exist = this.next.get(grade);
      if (exist) {
        return exist;
      }
      const interval = this.elapsed_days;
      const { difficulty, stability } = this.last;
      const retrievability = this.algorithm.forgetting_curve(interval, stability);
      const next_again = TypeConvert.card(this.current);
      const next_hard = TypeConvert.card(this.current);
      const next_good = TypeConvert.card(this.current);
      const next_easy = TypeConvert.card(this.current);
      this.next_ds(
        next_again,
        next_hard,
        next_good,
        next_easy,
        difficulty,
        stability,
        retrievability
      );
      this.next_interval(next_again, next_hard, next_good, next_easy, interval);
      this.next_state(next_again, next_hard, next_good, next_easy);
      next_again.lapses += 1;
      this.update_next(next_again, next_hard, next_good, next_easy);
      return this.next.get(grade);
    }
    /**
     * Review next_ds
     */
    next_ds(next_again, next_hard, next_good, next_easy, difficulty, stability, retrievability) {
      next_again.difficulty = this.algorithm.next_difficulty(
        difficulty,
        Rating.Again
      );
      const s_after_fail = this.algorithm.next_forget_stability(
        difficulty,
        stability,
        retrievability
      );
      next_again.stability = clamp(stability, S_MIN, s_after_fail);
      next_hard.difficulty = this.algorithm.next_difficulty(
        difficulty,
        Rating.Hard
      );
      next_hard.stability = this.algorithm.next_recall_stability(
        difficulty,
        stability,
        retrievability,
        Rating.Hard
      );
      next_good.difficulty = this.algorithm.next_difficulty(
        difficulty,
        Rating.Good
      );
      next_good.stability = this.algorithm.next_recall_stability(
        difficulty,
        stability,
        retrievability,
        Rating.Good
      );
      next_easy.difficulty = this.algorithm.next_difficulty(
        difficulty,
        Rating.Easy
      );
      next_easy.stability = this.algorithm.next_recall_stability(
        difficulty,
        stability,
        retrievability,
        Rating.Easy
      );
    }
    /**
     * Review/New next_interval
     */
    next_interval(next_again, next_hard, next_good, next_easy, interval) {
      let again_interval, hard_interval, good_interval, easy_interval;
      again_interval = this.algorithm.next_interval(
        next_again.stability,
        interval
      );
      hard_interval = this.algorithm.next_interval(next_hard.stability, interval);
      good_interval = this.algorithm.next_interval(next_good.stability, interval);
      easy_interval = this.algorithm.next_interval(next_easy.stability, interval);
      again_interval = Math.min(again_interval, hard_interval);
      hard_interval = Math.max(hard_interval, again_interval + 1);
      good_interval = Math.max(good_interval, hard_interval + 1);
      easy_interval = Math.max(easy_interval, good_interval + 1);
      next_again.scheduled_days = again_interval;
      next_again.due = date_scheduler(this.review_time, again_interval, true);
      next_hard.scheduled_days = hard_interval;
      next_hard.due = date_scheduler(this.review_time, hard_interval, true);
      next_good.scheduled_days = good_interval;
      next_good.due = date_scheduler(this.review_time, good_interval, true);
      next_easy.scheduled_days = easy_interval;
      next_easy.due = date_scheduler(this.review_time, easy_interval, true);
    }
    /**
     * Review/New next_state
     */
    next_state(next_again, next_hard, next_good, next_easy) {
      next_again.state = State.Review;
      next_again.learning_steps = 0;
      next_hard.state = State.Review;
      next_hard.learning_steps = 0;
      next_good.state = State.Review;
      next_good.learning_steps = 0;
      next_easy.state = State.Review;
      next_easy.learning_steps = 0;
    }
    update_next(next_again, next_hard, next_good, next_easy) {
      const item_again = {
        card: next_again,
        log: this.buildLog(Rating.Again)
      };
      const item_hard = {
        card: next_hard,
        log: super.buildLog(Rating.Hard)
      };
      const item_good = {
        card: next_good,
        log: super.buildLog(Rating.Good)
      };
      const item_easy = {
        card: next_easy,
        log: super.buildLog(Rating.Easy)
      };
      this.next.set(Rating.Again, item_again);
      this.next.set(Rating.Hard, item_hard);
      this.next.set(Rating.Good, item_good);
      this.next.set(Rating.Easy, item_easy);
    }
  }

  var __defProp$1 = Object.defineProperty;
  var __defProps$1 = Object.defineProperties;
  var __getOwnPropDescs$1 = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
  var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
  var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
  var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues$1 = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp$1.call(b, prop))
        __defNormalProp$1(a, prop, b[prop]);
    if (__getOwnPropSymbols$1)
      for (var prop of __getOwnPropSymbols$1(b)) {
        if (__propIsEnum$1.call(b, prop))
          __defNormalProp$1(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps$1 = (a, b) => __defProps$1(a, __getOwnPropDescs$1(b));
  var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, key + "" , value);
  class Reschedule {
    /**
     * Creates an instance of the `Reschedule` class.
     * @param fsrs - An instance of the FSRS class used for scheduling.
     */
    constructor(fsrs) {
      __publicField$1(this, "fsrs");
      this.fsrs = fsrs;
    }
    /**
     * Replays a review for a card and determines the next review date based on the given rating.
     * @param card - The card being reviewed.
     * @param reviewed - The date the card was reviewed.
     * @param rating - The grade given to the card during the review.
     * @returns A `RecordLogItem` containing the updated card and review log.
     */
    replay(card, reviewed, rating) {
      return this.fsrs.next(card, reviewed, rating);
    }
    /**
     * Processes a manual review for a card, allowing for custom state, stability, difficulty, and due date.
     * @param card - The card being reviewed.
     * @param state - The state of the card after the review.
     * @param reviewed - The date the card was reviewed.
     * @param elapsed_days - The number of days since the last review.
     * @param stability - (Optional) The stability of the card.
     * @param difficulty - (Optional) The difficulty of the card.
     * @param due - (Optional) The due date for the next review.
     * @returns A `RecordLogItem` containing the updated card and review log.
     * @throws Will throw an error if the state or due date is not provided when required.
     */
    handleManualRating(card, state, reviewed, elapsed_days, stability, difficulty, due) {
      if (typeof state === "undefined") {
        throw new Error("reschedule: state is required for manual rating");
      }
      let log;
      let next_card;
      if (state === State.New) {
        log = {
          rating: Rating.Manual,
          state,
          due: due != null ? due : reviewed,
          stability: card.stability,
          difficulty: card.difficulty,
          elapsed_days,
          last_elapsed_days: card.elapsed_days,
          scheduled_days: card.scheduled_days,
          learning_steps: card.learning_steps,
          review: reviewed
        };
        next_card = createEmptyCard(reviewed);
        next_card.last_review = reviewed;
      } else {
        if (typeof due === "undefined") {
          throw new Error("reschedule: due is required for manual rating");
        }
        const scheduled_days = date_diff(due, reviewed, "days");
        log = {
          rating: Rating.Manual,
          state: card.state,
          due: card.last_review || card.due,
          stability: card.stability,
          difficulty: card.difficulty,
          elapsed_days,
          last_elapsed_days: card.elapsed_days,
          scheduled_days: card.scheduled_days,
          learning_steps: card.learning_steps,
          review: reviewed
        };
        next_card = __spreadProps$1(__spreadValues$1({}, card), {
          state,
          due,
          last_review: reviewed,
          stability: stability || card.stability,
          difficulty: difficulty || card.difficulty,
          elapsed_days,
          scheduled_days,
          reps: card.reps + 1
        });
      }
      return { card: next_card, log };
    }
    /**
     * Reschedules a card based on its review history.
     *
     * @param current_card - The card to be rescheduled.
     * @param reviews - An array of review history objects.
     * @returns An array of record log items representing the rescheduling process.
     */
    reschedule(current_card, reviews) {
      const collections = [];
      let cur_card = createEmptyCard(current_card.due);
      for (const review of reviews) {
        let item;
        review.review = TypeConvert.time(review.review);
        if (review.rating === Rating.Manual) {
          let interval = 0;
          if (cur_card.state !== State.New && cur_card.last_review) {
            interval = date_diff(review.review, cur_card.last_review, "days");
          }
          item = this.handleManualRating(
            cur_card,
            review.state,
            review.review,
            interval,
            review.stability,
            review.difficulty,
            review.due ? TypeConvert.time(review.due) : void 0
          );
        } else {
          item = this.replay(cur_card, review.review, review.rating);
        }
        collections.push(item);
        cur_card = item.card;
      }
      return collections;
    }
    calculateManualRecord(current_card, now, record_log_item, update_memory) {
      if (!record_log_item) {
        return null;
      }
      const { card: reschedule_card, log } = record_log_item;
      const cur_card = TypeConvert.card(current_card);
      if (cur_card.due.getTime() === reschedule_card.due.getTime()) {
        return null;
      }
      cur_card.scheduled_days = date_diff(
        reschedule_card.due,
        cur_card.due,
        "days"
      );
      return this.handleManualRating(
        cur_card,
        reschedule_card.state,
        TypeConvert.time(now),
        log.elapsed_days,
        update_memory ? reschedule_card.stability : void 0,
        update_memory ? reschedule_card.difficulty : void 0,
        reschedule_card.due
      );
    }
  }

  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  class FSRS extends FSRSAlgorithm {
    constructor(param) {
      super(param);
      __publicField(this, "strategyHandler", /* @__PURE__ */ new Map());
      __publicField(this, "Scheduler");
      const { enable_short_term } = this.parameters;
      this.Scheduler = enable_short_term ? BasicScheduler : LongTermScheduler;
    }
    params_handler_proxy() {
      const _this = this;
      return {
        set: function(target, prop, value) {
          if (prop === "request_retention" && Number.isFinite(value)) {
            _this.intervalModifier = _this.calculate_interval_modifier(
              Number(value)
            );
          } else if (prop === "enable_short_term") {
            _this.Scheduler = value === true ? BasicScheduler : LongTermScheduler;
          } else if (prop === "w") {
            value = migrateParameters(
              value,
              target.relearning_steps.length,
              target.enable_short_term
            );
            _this.forgetting_curve = forgetting_curve.bind(this, value);
            _this.intervalModifier = _this.calculate_interval_modifier(
              Number(target.request_retention)
            );
          }
          Reflect.set(target, prop, value);
          return true;
        }
      };
    }
    useStrategy(mode, handler) {
      this.strategyHandler.set(mode, handler);
      return this;
    }
    clearStrategy(mode) {
      if (mode) {
        this.strategyHandler.delete(mode);
      } else {
        this.strategyHandler.clear();
      }
      return this;
    }
    getScheduler(card, now) {
      const schedulerStrategy = this.strategyHandler.get(
        StrategyMode.SCHEDULER
      );
      const Scheduler = schedulerStrategy || this.Scheduler;
      const instance = new Scheduler(card, now, this, this.strategyHandler);
      return instance;
    }
    /**
     * Display the collection of cards and logs for the four scenarios after scheduling the card at the current time.
     * @param card Card to be processed
     * @param now Current time or scheduled time
     * @param afterHandler Convert the result to another type. (Optional)
     * @example
     * ```typescript
     * const card: Card = createEmptyCard(new Date());
     * const f = fsrs();
     * const recordLog = f.repeat(card, new Date());
     * ```
     * @example
     * ```typescript
     * interface RevLogUnchecked
     *   extends Omit<ReviewLog, "due" | "review" | "state" | "rating"> {
     *   cid: string;
     *   due: Date | number;
     *   state: StateType;
     *   review: Date | number;
     *   rating: RatingType;
     * }
     *
     * interface RepeatRecordLog {
     *   card: CardUnChecked; //see method: createEmptyCard
     *   log: RevLogUnchecked;
     * }
     *
     * function repeatAfterHandler(recordLog: RecordLog) {
     *     const record: { [key in Grade]: RepeatRecordLog } = {} as {
     *       [key in Grade]: RepeatRecordLog;
     *     };
     *     for (const grade of Grades) {
     *       record[grade] = {
     *         card: {
     *           ...(recordLog[grade].card as Card & { cid: string }),
     *           due: recordLog[grade].card.due.getTime(),
     *           state: State[recordLog[grade].card.state] as StateType,
     *           last_review: recordLog[grade].card.last_review
     *             ? recordLog[grade].card.last_review!.getTime()
     *             : null,
     *         },
     *         log: {
     *           ...recordLog[grade].log,
     *           cid: (recordLog[grade].card as Card & { cid: string }).cid,
     *           due: recordLog[grade].log.due.getTime(),
     *           review: recordLog[grade].log.review.getTime(),
     *           state: State[recordLog[grade].log.state] as StateType,
     *           rating: Rating[recordLog[grade].log.rating] as RatingType,
     *         },
     *       };
     *     }
     *     return record;
     * }
     * const card: Card = createEmptyCard(new Date(), cardAfterHandler); //see method:  createEmptyCard
     * const f = fsrs();
     * const recordLog = f.repeat(card, new Date(), repeatAfterHandler);
     * ```
     */
    repeat(card, now, afterHandler) {
      const instance = this.getScheduler(card, now);
      const recordLog = instance.preview();
      if (afterHandler && typeof afterHandler === "function") {
        return afterHandler(recordLog);
      } else {
        return recordLog;
      }
    }
    /**
     * Display the collection of cards and logs for the card scheduled at the current time, after applying a specific grade rating.
     * @param card Card to be processed
     * @param now Current time or scheduled time
     * @param grade Rating of the review (Again, Hard, Good, Easy)
     * @param afterHandler Convert the result to another type. (Optional)
     * @example
     * ```typescript
     * const card: Card = createEmptyCard(new Date());
     * const f = fsrs();
     * const recordLogItem = f.next(card, new Date(), Rating.Again);
     * ```
     * @example
     * ```typescript
     * interface RevLogUnchecked
     *   extends Omit<ReviewLog, "due" | "review" | "state" | "rating"> {
     *   cid: string;
     *   due: Date | number;
     *   state: StateType;
     *   review: Date | number;
     *   rating: RatingType;
     * }
     *
     * interface NextRecordLog {
     *   card: CardUnChecked; //see method: createEmptyCard
     *   log: RevLogUnchecked;
     * }
     *
    function nextAfterHandler(recordLogItem: RecordLogItem) {
      const recordItem = {
        card: {
          ...(recordLogItem.card as Card & { cid: string }),
          due: recordLogItem.card.due.getTime(),
          state: State[recordLogItem.card.state] as StateType,
          last_review: recordLogItem.card.last_review
            ? recordLogItem.card.last_review!.getTime()
            : null,
        },
        log: {
          ...recordLogItem.log,
          cid: (recordLogItem.card as Card & { cid: string }).cid,
          due: recordLogItem.log.due.getTime(),
          review: recordLogItem.log.review.getTime(),
          state: State[recordLogItem.log.state] as StateType,
          rating: Rating[recordLogItem.log.rating] as RatingType,
        },
      };
      return recordItem
    }
     * const card: Card = createEmptyCard(new Date(), cardAfterHandler); //see method:  createEmptyCard
     * const f = fsrs();
     * const recordLogItem = f.repeat(card, new Date(), Rating.Again, nextAfterHandler);
     * ```
     */
    next(card, now, grade, afterHandler) {
      const instance = this.getScheduler(card, now);
      const g = TypeConvert.rating(grade);
      if (g === Rating.Manual) {
        throw new Error("Cannot review a manual rating");
      }
      const recordLogItem = instance.review(g);
      if (afterHandler && typeof afterHandler === "function") {
        return afterHandler(recordLogItem);
      } else {
        return recordLogItem;
      }
    }
    /**
     * Get the retrievability of the card
     * @param card  Card to be processed
     * @param now  Current time or scheduled time
     * @param format  default:true , Convert the result to another type. (Optional)
     * @returns  The retrievability of the card,if format is true, the result is a string, otherwise it is a number
     */
    get_retrievability(card, now, format = true) {
      const processedCard = TypeConvert.card(card);
      now = now ? TypeConvert.time(now) : /* @__PURE__ */ new Date();
      const t = processedCard.state !== State.New ? Math.max(date_diff(now, processedCard.last_review, "days"), 0) : 0;
      const r = processedCard.state !== State.New ? this.forgetting_curve(t, +processedCard.stability.toFixed(8)) : 0;
      return format ? `${(r * 100).toFixed(2)}%` : r;
    }
    /**
     *
     * @param card Card to be processed
     * @param log last review log
     * @param afterHandler Convert the result to another type. (Optional)
     * @example
     * ```typescript
     * const now = new Date();
     * const f = fsrs();
     * const emptyCardFormAfterHandler = createEmptyCard(now);
     * const repeatFormAfterHandler = f.repeat(emptyCardFormAfterHandler, now);
     * const { card, log } = repeatFormAfterHandler[Rating.Hard];
     * const rollbackFromAfterHandler = f.rollback(card, log);
     * ```
     *
     * @example
     * ```typescript
     * const now = new Date();
     * const f = fsrs();
     * const emptyCardFormAfterHandler = createEmptyCard(now, cardAfterHandler);  //see method: createEmptyCard
     * const repeatFormAfterHandler = f.repeat(emptyCardFormAfterHandler, now, repeatAfterHandler); //see method: fsrs.repeat()
     * const { card, log } = repeatFormAfterHandler[Rating.Hard];
     * const rollbackFromAfterHandler = f.rollback(card, log, cardAfterHandler);
     * ```
     */
    rollback(card, log, afterHandler) {
      const processedCard = TypeConvert.card(card);
      const processedLog = TypeConvert.review_log(log);
      if (processedLog.rating === Rating.Manual) {
        throw new Error("Cannot rollback a manual rating");
      }
      let last_due;
      let last_review;
      let last_lapses;
      switch (processedLog.state) {
        case State.New:
          last_due = processedLog.due;
          last_review = void 0;
          last_lapses = 0;
          break;
        case State.Learning:
        case State.Relearning:
        case State.Review:
          last_due = processedLog.review;
          last_review = processedLog.due;
          last_lapses = processedCard.lapses - (processedLog.rating === Rating.Again && processedLog.state === State.Review ? 1 : 0);
          break;
      }
      const prevCard = __spreadProps(__spreadValues({}, processedCard), {
        due: last_due,
        stability: processedLog.stability,
        difficulty: processedLog.difficulty,
        elapsed_days: processedLog.last_elapsed_days,
        scheduled_days: processedLog.scheduled_days,
        reps: Math.max(0, processedCard.reps - 1),
        lapses: Math.max(0, last_lapses),
        learning_steps: processedLog.learning_steps,
        state: processedLog.state,
        last_review
      });
      if (afterHandler && typeof afterHandler === "function") {
        return afterHandler(prevCard);
      } else {
        return prevCard;
      }
    }
    /**
     *
     * @param card Card to be processed
     * @param now Current time or scheduled time
     * @param reset_count Should the review count information(reps,lapses) be reset. (Optional)
     * @param afterHandler Convert the result to another type. (Optional)
     * @example
     * ```typescript
     * const now = new Date();
     * const f = fsrs();
     * const emptyCard = createEmptyCard(now);
     * const scheduling_cards = f.repeat(emptyCard, now);
     * const { card, log } = scheduling_cards[Rating.Hard];
     * const forgetCard = f.forget(card, new Date(), true);
     * ```
     *
     * @example
     * ```typescript
     * interface RepeatRecordLog {
     *   card: CardUnChecked; //see method: createEmptyCard
     *   log: RevLogUnchecked; //see method: fsrs.repeat()
     * }
     *
     * function forgetAfterHandler(recordLogItem: RecordLogItem): RepeatRecordLog {
     *     return {
     *       card: {
     *         ...(recordLogItem.card as Card & { cid: string }),
     *         due: recordLogItem.card.due.getTime(),
     *         state: State[recordLogItem.card.state] as StateType,
     *         last_review: recordLogItem.card.last_review
     *           ? recordLogItem.card.last_review!.getTime()
     *           : null,
     *       },
     *       log: {
     *         ...recordLogItem.log,
     *         cid: (recordLogItem.card as Card & { cid: string }).cid,
     *         due: recordLogItem.log.due.getTime(),
     *         review: recordLogItem.log.review.getTime(),
     *         state: State[recordLogItem.log.state] as StateType,
     *         rating: Rating[recordLogItem.log.rating] as RatingType,
     *       },
     *     };
     * }
     * const now = new Date();
     * const f = fsrs();
     * const emptyCardFormAfterHandler = createEmptyCard(now, cardAfterHandler); //see method:  createEmptyCard
     * const repeatFormAfterHandler = f.repeat(emptyCardFormAfterHandler, now, repeatAfterHandler); //see method: fsrs.repeat()
     * const { card } = repeatFormAfterHandler[Rating.Hard];
     * const forgetFromAfterHandler = f.forget(card, date_scheduler(now, 1, true), false, forgetAfterHandler);
     * ```
     */
    forget(card, now, reset_count = false, afterHandler) {
      const processedCard = TypeConvert.card(card);
      now = TypeConvert.time(now);
      const scheduled_days = processedCard.state === State.New ? 0 : date_diff(now, processedCard.due, "days");
      const forget_log = {
        rating: Rating.Manual,
        state: processedCard.state,
        due: processedCard.due,
        stability: processedCard.stability,
        difficulty: processedCard.difficulty,
        elapsed_days: 0,
        last_elapsed_days: processedCard.elapsed_days,
        scheduled_days,
        learning_steps: processedCard.learning_steps,
        review: now
      };
      const forget_card = __spreadProps(__spreadValues({}, processedCard), {
        due: now,
        stability: 0,
        difficulty: 0,
        elapsed_days: 0,
        scheduled_days: 0,
        reps: reset_count ? 0 : processedCard.reps,
        lapses: reset_count ? 0 : processedCard.lapses,
        learning_steps: 0,
        state: State.New,
        last_review: processedCard.last_review
      });
      const recordLogItem = { card: forget_card, log: forget_log };
      if (afterHandler && typeof afterHandler === "function") {
        return afterHandler(recordLogItem);
      } else {
        return recordLogItem;
      }
    }
    /**
     * Reschedules the current card and returns the rescheduled collections and reschedule item.
     *
     * @template T - The type of the record log item.
     * @param {CardInput | Card} current_card - The current card to be rescheduled.
     * @param {Array<FSRSHistory>} reviews - The array of FSRSHistory objects representing the reviews.
     * @param {Partial<RescheduleOptions<T>>} options - The optional reschedule options.
     * @returns {IReschedule<T>} - The rescheduled collections and reschedule item.
     *
     * @example
     * ```typescript
     * const f = fsrs()
     * const grades: Grade[] = [Rating.Good, Rating.Good, Rating.Good, Rating.Good]
     * const reviews_at = [
     *   new Date(2024, 8, 13),
     *   new Date(2024, 8, 13),
     *   new Date(2024, 8, 17),
     *   new Date(2024, 8, 28),
     * ]
     *
     * const reviews: FSRSHistory[] = []
     * for (let i = 0; i < grades.length; i++) {
     *   reviews.push({
     *     rating: grades[i],
     *     review: reviews_at[i],
     *   })
     * }
     *
     * const results_short = scheduler.reschedule(
     *   createEmptyCard(),
     *   reviews,
     *   {
     *     skipManual: false,
     *   }
     * )
     * console.log(results_short)
     * ```
     */
    reschedule(current_card, reviews = [], options = {}) {
      const {
        recordLogHandler,
        reviewsOrderBy,
        skipManual = true,
        now = /* @__PURE__ */ new Date(),
        update_memory_state: updateMemoryState = false
      } = options;
      if (reviewsOrderBy && typeof reviewsOrderBy === "function") {
        reviews.sort(reviewsOrderBy);
      }
      if (skipManual) {
        reviews = reviews.filter((review) => review.rating !== Rating.Manual);
      }
      const rescheduleSvc = new Reschedule(this);
      const collections = rescheduleSvc.reschedule(
        options.first_card || createEmptyCard(),
        reviews
      );
      const len = collections.length;
      const cur_card = TypeConvert.card(current_card);
      const manual_item = rescheduleSvc.calculateManualRecord(
        cur_card,
        now,
        len ? collections[len - 1] : void 0,
        updateMemoryState
      );
      if (recordLogHandler && typeof recordLogHandler === "function") {
        return {
          collections: collections.map(recordLogHandler),
          reschedule_item: manual_item ? recordLogHandler(manual_item) : null
        };
      }
      return {
        collections,
        reschedule_item: manual_item
      };
    }
  }
  const fsrs = (params) => {
    return new FSRS(params || {});
  };

  exports.AbstractScheduler = AbstractScheduler;
  exports.BasicLearningStepsStrategy = BasicLearningStepsStrategy;
  exports.CLAMP_PARAMETERS = CLAMP_PARAMETERS;
  exports.ConvertStepUnitToMinutes = ConvertStepUnitToMinutes;
  exports.DefaultInitSeedStrategy = DefaultInitSeedStrategy;
  exports.FSRS = FSRS;
  exports.FSRS5_DEFAULT_DECAY = FSRS5_DEFAULT_DECAY;
  exports.FSRS6_DEFAULT_DECAY = FSRS6_DEFAULT_DECAY;
  exports.FSRSAlgorithm = FSRSAlgorithm;
  exports.FSRSVersion = FSRSVersion;
  exports.GenSeedStrategyWithCardId = GenSeedStrategyWithCardId;
  exports.Grades = Grades;
  exports.INIT_S_MAX = INIT_S_MAX;
  exports.Rating = Rating;
  exports.S_MAX = S_MAX;
  exports.S_MIN = S_MIN;
  exports.State = State;
  exports.StrategyMode = StrategyMode;
  exports.TypeConvert = TypeConvert;
  exports.W17_W18_Ceiling = W17_W18_Ceiling;
  exports.checkParameters = checkParameters;
  exports.clamp = clamp;
  exports.clipParameters = clipParameters;
  exports.computeDecayFactor = computeDecayFactor;
  exports.createEmptyCard = createEmptyCard;
  exports.dateDiffInDays = dateDiffInDays;
  exports.date_diff = date_diff;
  exports.date_scheduler = date_scheduler;
  exports.default_enable_fuzz = default_enable_fuzz;
  exports.default_enable_short_term = default_enable_short_term;
  exports.default_learning_steps = default_learning_steps;
  exports.default_maximum_interval = default_maximum_interval;
  exports.default_relearning_steps = default_relearning_steps;
  exports.default_request_retention = default_request_retention;
  exports.default_w = default_w;
  exports.fixDate = fixDate;
  exports.fixRating = fixRating;
  exports.fixState = fixState;
  exports.forgetting_curve = forgetting_curve;
  exports.formatDate = formatDate;
  exports.fsrs = fsrs;
  exports.generatorParameters = generatorParameters;
  exports.get_fuzz_range = get_fuzz_range;
  exports.migrateParameters = migrateParameters;
  exports.show_diff_message = show_diff_message;

}));


'use strict';

const $ = id => document.getElementById(id);
const byId = new Map(WORDS.map(word => [word[0], word]));
const storageKey = 'cet4-daily-words-v1';
// FSRS-6 via ts-fsrs 5.2.3; daily reinforcement is a separate application policy.
const scheduler = FSRS.fsrs({request_retention:0.9, maximum_interval:365,
  enable_fuzz:false, enable_short_term:false});
const memoryTips = {
  would:'would like to do = 想做某事。I would like to join. 我想加入。',
  author:'the author of the book = 这本书的作者。阅读题里的 the author 通常指文章作者。',
  researcher:'research（研究）+ -er（做这件事的人）→ 研究人员。',
  less:'less time = 更少的时间。less than ten minutes = 不到十分钟。',
  likely:'be likely to do = 很可能做某事。She is likely to agree. 她很可能同意。',
  employee:'employee 是雇员，employer 是雇主，employ 是雇用。',
  accord:'in accord with = 与……一致。an international accord = 一项国际协议。',
  benefit:'benefit from = 从……受益。Students benefit from practice. 学生从练习中受益。',
  system:'the education system = 教育体系。把 system 理解成相互配合的一整套东西。',
  effect:'have an effect on = 对……有影响。effect 常作名词，affect 常作动词。',
  local:'local people = 当地人。local news = 本地新闻。',
  actually:'句首 Actually, 常用来纠正前面的说法，可以记成「其实……」。',
  online:'study online = 在网上学习。an online course = 一门线上课。',
  better:'better 是 good 和 well 的比较级。had better do = 最好做某事。',
  tend:'tend to do = 往往会做某事。People tend to forget. 人们往往会忘记。',
  design:'design a plan = 设计方案。by design = 有意地。',
  product:'produce（生产）→ product（产品）→ production（生产、产量）。',
  customer:'a regular customer = 常客。customer service = 客户服务。',
  learning:'a learning process = 一个学习过程。lifelong learning = 终身学习。',
  career:'choose a career = 选择职业。a career in medicine = 医学方面的职业生涯。',
  million:'two million = 两百万。millions of = 数百万的。',
  reduce:'reduce costs = 降低成本。reduce stress = 减轻压力。',
  support:'support a claim = 支持一个主张。阅读里也常指证据「佐证」某个观点。',
  participant:'participate in = 参与。participant = 参与者。',
  lack:'a lack of sleep = 睡眠不足。lack experience = 缺乏经验。',
  research:'do research on = 对……做研究。research 通常是不可数名词。',
  evidence:'provide evidence for = 为……提供证据。evidence 通常是不可数名词。',
  approach:'an approach to solving the problem = 一种解决问题的方法。这里的 to 后接动名词。',
  improve:'improve skills = 提高技能。improvement = 改进、改善。'
};

function today() {
  const d = new Date();
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-');
}
function readState() {
  const fresh = {goal:20, records:{}, stars:{}, day:null, session:null, history:[]};
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    return stored && typeof stored === 'object' ? {...fresh, ...stored} : fresh;
  } catch {
    return fresh;
  }
}
let state = readState();
let page = 'study';
let filter = 'all';
let limit = 35;
let detailId = null;
let revealed = !!state.session?.revealed;
let playback = null;

function save() {
  if (state.session) state.session.revealed = revealed;
  try { localStorage.setItem(storageKey, JSON.stringify(state)); $('storage-note').hidden = true; }
  catch { $('storage-note').hidden = false; }
}
function ensureDay() {
  if (state.day?.key === today()) {
    if (!state.day.retry) {
      // Recover pending cards from the previous queue and its short-delay records.
      state.day.retry = Object.fromEntries(Object.keys(state.day.answered)
        .filter(id => state.session?.queue.includes(Number(id)) ||
          (state.records[id]?.hard && state.records[id].due < reviewDate(1)))
        .map(id => [id, true]));
      save();
    }
    return;
  }
  const pending = state.session && (state.session.rated || state.session.queue.length);
  const retry = pending ? {...state.day?.retry} : {};
  state.day = {key:today(), newCount:0, extra:0, answered:{}, retry};
  if (!pending) { state.session = null; revealed = false; }
  save();
}
function dueIds() {
  const now = Date.now();
  return Object.entries(state.records)
    .filter(([id, record]) => byId.has(Number(id)) && !state.day.answered[id] && record.due <= now)
    .sort((a, b) => a[1].due - b[1].due || Number(a[0]) - Number(b[0]))
    .map(([id]) => Number(id));
}
function newLeft() {
  return Math.min(WORDS.length - Object.keys(state.records).length,
    Math.max(0, state.goal + state.day.extra - state.day.newCount));
}
function freshIds() {
  return WORDS.filter(([id]) => !state.records[id]).slice(0, newLeft()).map(([id]) => id);
}
function makeSession(ids, mode = 'daily') {
  state.session = {mode, queue:ids, total:ids.length, rated:null};
  revealed = false;
  save();
}
function startDaily() {
  const retry = Object.keys(state.day.retry).map(Number);
  makeSession([...retry, ...dueIds(), ...freshIds()]);
}
function refreshDaily() {
  ensureDay();
  const session = state.session;
  if (!session || (session.mode === 'daily' && !session.rated && !session.queue.length &&
      (Object.keys(state.day.retry).length || dueIds().length || newLeft()))) {
    startDaily();
  }
}
function currentId() {
  return state.session?.rated?.id ?? state.session?.queue[0];
}
function source(id) {
  return 'https://english-exam.lazynote.cn/cet4/words/' + encodeURIComponent(byId.get(id)[1]) + '/';
}
function renderMemory(word, meaning, text) {
  const gloss = meaning.split(/[；;|…]/)[0].replace(/^[a-z./ ]+\s/i, '').trim();
  $(text).textContent = memoryTips[word] || EXTRA_MEMORY_TIPS[word] ||
    ('先听一遍，再用「' + gloss + '」给自己设个中文提示。遮住释义，看着 ' + word + ' 回想一遍。');
}
function renderSynonyms(word, sectionId) {
  const section = $(sectionId);
  const pairs = CET4_SYNONYMS.get(word) ?? [];
  const list = section.querySelector('ul');
  list.replaceChildren(...pairs.map(({sense, original, replacement}) => {
    const item = document.createElement('li');
    const phrases = document.createElement('span');
    phrases.lang = 'en';
    phrases.textContent = original + ' ↔ ' + replacement;
    const meaning = document.createElement('small');
    meaning.textContent = sense;
    item.append(phrases, meaning);
    return item;
  }));
  section.hidden = pairs.length === 0;
}
function renderStats() {
  $('today-count').textContent = Object.keys(state.day.answered).length;
  $('due-count').textContent = dueIds().length;
  $('new-count').textContent = newLeft();
}
function renderStudy() {
  renderStats();
  const session = state.session;
  const id = currentId();
  const rated = session.rated;
  const shown = !!rated || revealed;
  $('undo').disabled = !previousEntries().length;
  $('undo').textContent = '← 查看上一词';
  $('save-status').textContent = session.rated || session.queue.length
    ? '自动保存学习位置 · 下次打开接着学' : '本轮进度已保存';
  $('study-goal').textContent = '新词量 ' + state.goal + ' 个／天 · 修改';
  $('card').hidden = !id;
  $('round').hidden = !id;
  $('choices').hidden = !id || !!rated;
  $('advance').hidden = !rated;
  $('complete').hidden = !!id;
  if (!id) {
    const isDaily = session.mode === 'daily';
    $('complete-title').textContent = isDaily ? '今日计划完成' : '这组练完了';
    $('complete-description').textContent = '今日已练 ' + Object.keys(state.day.answered).length + ' 个词。';
    $('resume').hidden = isDaily;
    $('extra').hidden = !isDaily || Object.keys(state.records).length >= WORDS.length;
    return;
  }
  const [, word, level, meaning, count] = byId.get(id);
  const finished = session.total - session.queue.length;
  $('mode-label').textContent = session.mode === 'daily' ? '今日计划' : '生词练习';
  $('round-count').textContent = '已完成 ' + finished + ' / ' + session.total;
  $('round-progress').max = Math.max(1, session.total);
  $('round-progress').value = finished;
  const retry = rated ? session.undo?.answered : state.day.answered[id];
  $('word-kind').textContent = retry ? '当日再记' : (state.records[id] && !rated?.isNew) ? '复习词' : '新词';
  $('word-level').textContent = level;
  $('word').textContent = word;
  $('word-ipa').textContent = WORD_IPA[id];
  $('word-meta').textContent = '真题句频 #' + id + ' · 出现于 ' + count + ' 个句子' +
    (state.day.attempts?.[id] ? ' · 今日已作答 ' + state.day.attempts[id].count + ' 次' : '');
  $('favorite').setAttribute('aria-pressed', Boolean(state.stars[id]));
  $('answer').hidden = !shown;
  $('peek').hidden = shown;
  const verdicts = {known:'认识 · 核对释义', fuzzy:'模糊 · 再确认一下', again:'忘记 · 记一下'};
  $('verdict').textContent = rated ? verdicts[rated.rating ?? (rated.known ? 'known' : 'again')] : '中文释义';
  $('meaning').textContent = meaning;
  renderMemory(word, meaning, 'memory-text');
  renderSynonyms(word, 'word-synonyms');
  $('source-word').href = source(id);
  if (rated) $('schedule-note').textContent = rated.note;
}
function advance() {
  if (!state.session?.rated) return;
  stopAudio();
  state.session.rated = null;
  revealed = false;
  save();
  refreshDaily();
  renderStudy();
  window.scrollTo(0, 0);
}
function reviewDate(days, at = Date.now()) {
  const due = new Date(at);
  due.setDate(due.getDate() + days);
  due.setHours(0, 0, 0, 0);
  return due.getTime();
}
function firstReview(previous, rating, now = new Date()) {
  // Legacy due dates remain untouched until the next real review.
  // Missing historical feedback is never fabricated.
  const card = previous?.fsrs ? {...previous.fsrs,
    due:new Date(previous.fsrs.due),
    last_review:previous.fsrs.last_review ? new Date(previous.fsrs.last_review) : undefined
  } : FSRS.createEmptyCard(now);
  const grade = {again:FSRS.Rating.Again, fuzzy:FSRS.Rating.Hard, known:FSRS.Rating.Good}[rating];
  const result = scheduler.next(card, now, grade);
  const days = Math.max(1, result.card.scheduled_days);
  return {days, card:result.card, log:result.log};
}
function reviewIntervalLabel(days) {
  return days === 1 ? '明天复习' : days + ' 天后复习';
}
function rate(rating) {
  ensureDay();
  const session = state.session;
  if (!session || session.rated || !session.queue.length) return;
  const peeked = revealed;
  // Looking up the answer is not successful unaided retrieval.
  if (peeked) rating = 'again';
  const id = session.queue[0];
  const previous = state.records[id];
  const beforeRecord = previous ? JSON.parse(JSON.stringify(previous)) : null;
  const isNew = !previous;
  const answered = !!state.day.answered[id];
  session.undo = {id, previous:previous ?? null, queue:session.queue.slice(),
    total:session.total, retry:!!state.day.retry[id], answered,
    newCount:state.day.newCount, goal:state.goal, revealed};
  session.queue.shift();
  let days = null;
  let reviewLog = null;
  if (!answered || !previous) {
    const next = firstReview(previous, rating);
    days = next.days;
    reviewLog = next.log;
    state.records[id] = {...previous, stage:rating === 'known' ? 0 : -1,
      due:reviewDate(days), hard:rating !== 'known', fsrs:next.card,
      algorithm:'FSRS-6', firstRating:rating, scheduledDays:days};
  }
  let note = days ? reviewIntervalLabel(days) : '本轮已回忆出来，仍会安排日后复习';
  state.day.attempts ??= {};
  const attempts = state.day.attempts[id] ?? {count:0, misses:0};
  attempts.count++;
  if (rating === 'again') attempts.misses++;
  state.day.attempts[id] = attempts;
  if (rating === 'known') {
    state.records[id].hard = false;
    delete state.day.retry[id];
  } else {
    state.records[id].hard = true;
    // App policy, not a claim about MaiMemo's private intra-day scheduler:
    // repeated failures return sooner; Hard gets a wider retrieval gap.
    const targetGap = rating === 'fuzzy' ? 6 : Math.max(1, 4 - attempts.misses);
    const gap = Math.min(session.queue.length, targetGap);
    session.queue.splice(gap, 0, id);
    state.day.retry[id] = true;
    note = gap ? '过 ' + gap + ' 张卡再试一次' : '本组只剩这张卡，记一下再试';
    if (days) note += ' · ' + reviewIntervalLabel(days);
  }
  if (!days) note += ' · 长期计划保持不变';
  if (peeked) note = '先看了释义，本次按「忘记」记录 · ' + note;
  if (attempts.misses >= 3) note += ' · 这个词较难，先读音标和助记，再休息一下继续';
  if (isNew) state.day.newCount++;
  state.day.answered[id] = true;
  session.rated = {id, rating, isNew, note};
  state.records[id].lastRating = rating;
  state.records[id].lastRatedAt = Date.now();
  state.history ??= [];
  state.history.push({id, rating, note, at:Date.now(), firstOfDay:!answered, peeked, reviewLog, beforeRecord});
  state.history = state.history.slice(-2000);
  save();
  renderStudy();
  if ($('next').getBoundingClientRect().bottom > window.innerHeight - 64) {
    $('next').scrollIntoView({block:'end'});
  }
}
let historyEntries = [];
let historyIndex = -1;
const ratingLabels = {known:'认识', fuzzy:'模糊', again:'忘记'};
function previousEntries() {
  const entries = (state.history || []).filter(entry => byId.has(entry.id));
  // A rated card is still on screen until Next is pressed.
  if (state.session?.rated && entries.at(-1)?.id === currentId()) return entries.slice(0, -1);
  return entries;
}
function viewPrevious() {
  historyEntries = previousEntries();
  if (!historyEntries.length) return;
  historyIndex = historyEntries.length - 1;
  showHistory();
}
function showHistory() {
  const entry = historyEntries[historyIndex];
  openDetail(entry.id);
  $('detail-meta').textContent = '学习记录 ' + (historyIndex + 1) + ' / ' + historyEntries.length;
  $('detail-rating').textContent = '当时选择：' + ratingLabels[entry.rating] +
    ' · ' + new Date(entry.at).toLocaleString('zh-CN') + '。' + entry.note;
  $('history-controls').hidden = false;
  $('history-edit').hidden = false;
  for (const rating of ['again','fuzzy','known']) {
    $('edit-' + rating).setAttribute('aria-pressed', entry.rating === rating);
    $('edit-' + rating).disabled = entry.rating === rating;
  }
  $('history-older').disabled = historyIndex === 0;
  $('history-newer').disabled = historyIndex === historyEntries.length - 1;
}

// Corrections replace feedback; they are not additional study attempts.
function editHistoryRating(rating) {
  const entry = historyEntries[historyIndex];
  if (!entry || !['again','fuzzy','known'].includes(rating) ||
      !state.history.includes(entry) || entry.rating === rating) return;
  ensureDay();
  const oldRating = entry.rating;
  const entries = state.history.filter(e => e.id === entry.id);
  const start = entries.indexOf(entry);
  const record = state.records[entry.id];
  if (!record) return;
  // Restore the model immediately before this review, then replay later
  // first-of-day reviews with their original timestamps and corrected grades.
  if (entry.firstOfDay && entry.reviewLog) {
    let previous = entry.beforeRecord;
    if (previous === undefined) {
      const log = entry.reviewLog;
      previous = log.state === FSRS.State.New ? null : {fsrs:{
        ...FSRS.createEmptyCard(new Date(entry.at)),
        state:log.state, stability:log.stability, difficulty:log.difficulty,
        due:new Date(log.due), last_review:new Date(entry.at - log.elapsed_days * 86400000),
        scheduled_days:log.scheduled_days, elapsed_days:log.elapsed_days
      }};
    }
    for (const e of entries.slice(start)) {
      if (!e.firstOfDay || !e.reviewLog) continue;
      e.beforeRecord = previous ? JSON.parse(JSON.stringify(previous)) : null;
      const next = firstReview(previous, e === entry ? rating : e.rating, new Date(e.at));
      previous = {fsrs:next.card, due:reviewDate(next.days,e.at),
        scheduledDays:next.days, firstRating:e === entry ? rating : e.rating};
      e.reviewLog = next.log;
      e.note = '长期安排已重算 · ' + reviewIntervalLabel(next.days);
    }
    Object.assign(record,previous);
  }
  entry.originalRating ??= oldRating;
  entry.rating = rating;
  entry.editedAt = Date.now();
  entry.note = '已修改为「' + ratingLabels[rating] + '」 · ' +
    (entry.firstOfDay && entry.reviewLog
      ? '已同步重算后续复习'
      : '此次非长期调度记录，长期计划保持不变');
  const latest = entries.at(-1);
  record.lastRating = latest.rating;
  record.lastRatedAt = latest.at;
  record.hard = latest.rating !== 'known';
  record.stage = record.hard ? -1 : 0;
  const dateKey = at => { const d = new Date(at); return [d.getFullYear(),d.getMonth()+1,d.getDate()].join('-'); };
  if (dateKey(entry.at) === today()) {
    const todays = entries.filter(e => dateKey(e.at) === today());
    state.day.attempts ??= {};
    state.day.attempts[entry.id] = {count:todays.length,misses:todays.filter(e => e.rating === 'again').length};
    // Later feedback takes precedence over a correction to an earlier attempt.
    if (latest === entry) {
      const session = state.session;
      const completed = Math.max(0, session.total - session.queue.length);
      const keepCurrent = !session.rated && session.queue[0] === entry.id;
      session.queue = session.queue.filter((id,i) => id !== entry.id || (i === 0 && keepCurrent));
      if (rating === 'known') delete state.day.retry[entry.id];
      else {
        state.day.retry[entry.id] = true;
        if (!keepCurrent) {
          const gap = rating === 'fuzzy' ? 6 : Math.max(1,4-state.day.attempts[entry.id].misses);
          // Preserve the card currently being studied.
          session.queue.splice(Math.min(session.queue.length,Math.max(1,gap)),0,entry.id);
        }
      }
      session.total = completed + session.queue.length;
      if (session.rated?.id === entry.id) {
        session.rated.rating = rating;
        session.rated.note = entry.note;
      }
    }
  }
  save();
  renderStudy();
  showHistory();
}

function stopAudio() {
  if (playback) {
    playback.audio.pause();
    if (playback.objectUrl) URL.revokeObjectURL(playback.objectUrl);
    delete playback.button.dataset.playing;
    playback = null;
  }
  $('audio-note').hidden = true;
  $('detail-audio-note').hidden = true;
}
async function play(id, button, message) {
  stopAudio();
  if (!id) return;
  const audio = new Audio();
  const request = {audio, button};
  playback = request;
  button.dataset.playing = 'true';
  audio.addEventListener('ended', () => { if (playback === request) stopAudio(); }, {once:true});
  try {
    if (window.readPackedAudio) {
      const clip = await window.readPackedAudio(id);
      if (playback !== request) return;
      request.objectUrl = URL.createObjectURL(clip);
      audio.src = request.objectUrl;
    } else {
      audio.src = 'audio/' + id + '.mp3';
    }
    await audio.play();
  } catch {
    if (playback !== request) return;
    stopAudio();
    message.textContent = '音频暂时无法播放，点一下重试。';
    message.hidden = false;
  }
}
function favorite(id) {
  if (!id) return;
  if (state.stars[id]) delete state.stars[id];
  else state.stars[id] = true;
  save();
}
function matches() {
  const query = $('search').value.trim().toLowerCase();
  return WORDS.filter(([id, word, , meaning]) =>
    (filter !== 'hard' || state.records[id]?.hard) &&
    (filter !== 'star' || state.stars[id]) &&
    (!query || word.toLowerCase().includes(query) || meaning.toLowerCase().includes(query)));
}
function renderLibrary() {
  const found = matches();
  $('results').textContent = found.length ? '共 ' + found.length.toLocaleString('zh-CN') + ' 个词' : '没有找到单词';
  $('practice-hard').hidden = filter !== 'hard' || !found.length;
  $('more').hidden = found.length <= limit;
  const fragment = document.createDocumentFragment();
  for (const [id, word, level, meaning] of found.slice(0, limit)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'word-row';
    button.dataset.id = id;
    const main = document.createElement('span');
    const label = document.createElement('strong');
    label.lang = 'en';
    label.textContent = word;
    const gloss = document.createElement('small');
    gloss.textContent = meaning.split('|')[0].split('；')[0];
    const badge = document.createElement('span');
    badge.textContent = (state.stars[id] ? '★ ' : '') + level + ' ›';
    main.append(label, gloss);
    button.append(main, badge);
    fragment.append(button);
  }
  $('word-list').replaceChildren(fragment);
}
function renderDetailStar() {
  $('detail-star').textContent = state.stars[detailId] ? '已收藏' : '收藏';
  $('detail-star').setAttribute('aria-pressed', Boolean(state.stars[detailId]));
}
function openDetail(id) {
  const [, word, level, meaning, count] = byId.get(id);
  stopAudio();
  detailId = id;
  $('history-controls').hidden = true;
  $('history-edit').hidden = true;
  const record = state.records[id];
  $('detail-rating').textContent = record?.lastRating
    ? '上次选择：' + ratingLabels[record.lastRating] + ' · ' + new Date(record.lastRatedAt).toLocaleString('zh-CN')
    : '暂无选择记录';
  $('detail-meta').textContent = level + ' · 真题出现 ' + count + ' 句';
  $('detail-word').textContent = word;
  $('detail-ipa').textContent = WORD_IPA[id];
  $('detail-meaning').textContent = meaning;
  $('detail-source').href = source(id);
  renderMemory(word, meaning, 'detail-memory-text');
  renderSynonyms(word, 'detail-synonyms');
  renderDetailStar();
  if (!$('details').open) $('details').showModal();
}
function renderProgress() {
  const values = Object.values(state.records);
  $('coverage').textContent = values.length.toLocaleString('zh-CN') + ' / 1,612';
  $('coverage-bar').value = values.length;
  const stats = [
    ['记牢中', values.filter(record => !record.hard && record.stage >= 0).length],
    ['生词', values.filter(record => record.hard).length],
    ['已收藏', Object.keys(state.stars).length]
  ];
  $('progress-grid').replaceChildren(...stats.map(([label, value]) => {
    const box = document.createElement('div');
    const number = document.createElement('strong');
    const caption = document.createElement('span');
    number.textContent = value;
    caption.textContent = label;
    box.append(number, caption);
    return box;
  }));
  document.querySelectorAll('[data-goal]').forEach(button =>
    button.setAttribute('aria-pressed', Number(button.dataset.goal) === state.goal));
  $('custom-goal').value = state.goal;
}
function resizeDailyQueue(keepId) {
  const session = state.session;
  if (session?.mode !== 'daily') return;
  const done = session.total - session.queue.length;
  const fresh = new Set(freshIds());
  // Keep the card restored by Undo available even if the target was lowered meanwhile.
  if (keepId && !state.records[keepId] && !fresh.has(keepId)) {
    if (fresh.size) fresh.delete([...fresh].at(-1));
    fresh.add(keepId);
  }
  session.queue = session.queue.filter(id => state.records[id] || fresh.delete(id)).concat([...fresh]);
  session.total = done + session.queue.length;
}
function setGoal(goal) {
  state.goal = goal;
  state.day.extra = 0;
  const previous = currentId();
  resizeDailyQueue();
  if (currentId() !== previous) revealed = false;
  save();
  renderProgress();
  $('goal-note').textContent = goal ? '已保存，每天安排 ' + goal + ' 个新词。' : '已保存，今天只复习。';
}
function show(nextPage, scroll = true) {
  ensureDay();
  if (nextPage !== page) stopAudio();
  page = nextPage;
  for (const section of document.querySelectorAll('.page')) section.hidden = section.id !== page;
  for (const button of document.querySelectorAll('[data-page]')) {
    if (button.dataset.page === page) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  }
  $('date').textContent = new Intl.DateTimeFormat('zh-CN',{month:'long',day:'numeric',weekday:'short'}).format(new Date());
  if (page === 'study') { refreshDaily(); renderStudy(); }
  if (page === 'library') renderLibrary();
  if (page === 'progress') renderProgress();
  if (scroll) window.scrollTo(0, 0);
}

// Additive UI keeps compatibility with an already cached HTML page.
const saveStatus = document.createElement('p');
saveStatus.id = 'save-status';
saveStatus.className = 'hint';
$('study-goal').parentElement.after(saveStatus);
const detailRating = document.createElement('p');
detailRating.id = 'detail-rating';
detailRating.className = 'hint';
$('detail-meaning').before(detailRating);
const historyEdit = document.createElement('div');
historyEdit.id = 'history-edit';
historyEdit.hidden = true;
historyEdit.innerHTML = '<p class="hint">刚才选错了？修改当时的选择（不会增加学习次数）</p><div class="actions"><button type="button" id="edit-again" class="button secondary">忘记</button><button type="button" id="edit-fuzzy" class="button fuzzy">模糊</button><button type="button" id="edit-known" class="button primary">认识</button></div>';
$('detail-rating').after(historyEdit);
for (const rating of ['again','fuzzy','known']) $('edit-' + rating).onclick = () => editHistoryRating(rating);
const historyControls = document.createElement('div');
historyControls.id = 'history-controls';
historyControls.className = 'detail-actions';
historyControls.style.flexWrap = 'wrap';
historyControls.hidden = true;
historyControls.innerHTML = '<button type="button" id="history-older" class="button secondary">← 更早一词</button><button type="button" id="history-newer" class="button secondary">后一词 →</button><button type="button" id="history-close" class="button primary">继续学习</button>';
$('details').append(historyControls);
$('history-older').onclick = () => { if (historyIndex > 0) { historyIndex--; showHistory(); } };
$('history-newer').onclick = () => { if (historyIndex < historyEntries.length - 1) { historyIndex++; showHistory(); } };
$('history-close').onclick = () => $('details').close();
// Recover the one previous answer available from older app versions.
if (!Array.isArray(state.history)) state.history = [];
if (!state.history.length && state.session?.rated) {
  const r = state.session.rated;
  state.history.push({id:r.id, rating:r.rating || (r.known ? 'known' : 'again'), note:r.note || '', at:Date.now()});
}

$('peek').onclick = () => { revealed = true; save(); renderStudy(); };
$('peek').textContent = '想不起来，先看释义（按忘记记录）';
$('known').onclick = () => rate('known');
$('again').onclick = () => rate('again');
$('fuzzy').onclick = () => rate('fuzzy');
$('undo').onclick = viewPrevious;
$('study-goal').onclick = () => {
  show('progress', false);
  $('custom-goal').focus({preventScroll:true});
  $('goal-form').scrollIntoView({block:'center'});
};
$('next').onclick = advance;
$('listen').onclick = () => play(currentId(), $('listen'), $('audio-note'));
$('favorite').onclick = () => { favorite(currentId()); renderStudy(); };
$('resume').onclick = () => { startDaily(); show('study'); };
$('extra').onclick = () => { state.day.extra += 10; startDaily(); show('study'); };
$('search').oninput = () => { limit = 35; renderLibrary(); };
$('more').onclick = () => { limit += 35; renderLibrary(); };
$('practice-hard').onclick = () => { makeSession(matches().map(([id]) => id), 'hard'); show('study'); };
$('word-list').onclick = event => {
  const button = event.target.closest('[data-id]');
  if (button) openDetail(Number(button.dataset.id));
};
$('details').addEventListener('close', () => {
  stopAudio();
  detailId = null;
  if (filter === 'star') renderLibrary();
});
$('detail-audio').onclick = () => play(detailId, $('detail-audio'), $('detail-audio-note'));
$('detail-star').onclick = () => { favorite(detailId); renderDetailStar(); };
document.querySelectorAll('[data-page]').forEach(button => button.onclick = () => show(button.dataset.page));
document.querySelectorAll('[data-filter]').forEach(button => button.onclick = () => {
  filter = button.dataset.filter;
  limit = 35;
  document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', b === button));
  renderLibrary();
});
document.querySelectorAll('[data-goal]').forEach(button => button.onclick = () => setGoal(Number(button.dataset.goal)));
$('goal-form').onsubmit = event => {
  event.preventDefault();
  const goal = $('custom-goal').valueAsNumber;
  if (Number.isInteger(goal) && goal >= 0 && goal <= WORDS.length) setGoal(goal);
};
document.addEventListener('visibilitychange', () => { if (!document.hidden) show(page, false); });
window.addEventListener('storage', event => {
  if (event.key === storageKey || event.key === null) {
    state = readState();
    revealed = !!state.session?.revealed;
    show(page, false);
  }
});
setInterval(() => { if (!document.hidden && page === 'study') show(page, false); }, 15000);
show('study', false);
