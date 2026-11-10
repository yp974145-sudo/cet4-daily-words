'use strict';

const $ = id => document.getElementById(id);
const byId = new Map(WORDS.map(word => [word[0], word]));
const storageKey = 'cet4-daily-words-v1';
const intervals = [1, 3, 7, 14, 30, 60];
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
  const fresh = {goal:20, records:{}, stars:{}, day:null, session:null};
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
let revealed = false;
let playback = null;

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(state)); }
  catch { $('storage-note').hidden = false; }
}
function ensureDay() {
  if (state.day?.key === today()) return;
  state.day = {key:today(), newCount:0, extra:0, answered:{}};
  state.session = null;
  revealed = false;
  save();
}
function dueIds() {
  const now = Date.now();
  return Object.entries(state.records)
    .filter(([id, record]) => byId.has(Number(id)) && record.due <= now)
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
  state.session = {mode, queue:ids, total:ids.length, misses:{}, rated:null};
  revealed = false;
  save();
}
function startDaily() {
  makeSession([...dueIds(), ...freshIds()]);
}
function refreshDaily() {
  ensureDay();
  const session = state.session;
  if (!session || (session.mode === 'daily' && !session.rated && !session.queue.length && (dueIds().length || newLeft()))) {
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
  $('undo').disabled = !session.undo;
  $('study-goal').textContent = '新词量 ' + state.goal + ' 个／天 · 修改';
  $('card').hidden = !id;
  $('round').hidden = !id;
  $('choices').hidden = !id || !!rated;
  $('advance').hidden = !rated;
  $('complete').hidden = !!id;
  if (!id) {
    const isDaily = session.mode === 'daily';
    $('complete-title').textContent = isDaily ? '今日计划完成' : '这组练完了';
    const pending = Object.values(state.records).filter(r => r.hard && r.due > Date.now() && r.due <= Date.now() + 600000).length;
    $('complete-description').textContent = pending
      ? '有 ' + pending + ' 个生词将在 10 分钟内到期，可以过一会儿回来练。'
      : '今日已练 ' + Object.keys(state.day.answered).length + ' 个词。';
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
  const retry = rated && session.undo ? session.undo.misses : session.misses[id];
  $('word-kind').textContent = retry ? '再练一次' : (state.records[id] && !rated?.isNew) ? '复习词' : '新词';
  $('word-level').textContent = level;
  $('word').textContent = word;
  $('word-ipa').textContent = WORD_IPA[id];
  $('word-meta').textContent = '真题句频 #' + id + ' · 出现于 ' + count + ' 个句子';
  $('favorite').setAttribute('aria-pressed', Boolean(state.stars[id]));
  $('answer').hidden = !shown;
  $('peek').hidden = shown;
  const verdicts = {known:'认识 · 核对释义', fuzzy:'模糊 · 再确认一下', again:'不认识 · 记一下'};
  $('verdict').textContent = rated ? verdicts[rated.rating ?? (rated.known ? 'known' : 'again')] : '中文释义';
  $('meaning').textContent = meaning;
  renderMemory(word, meaning, 'memory-text');
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
function reviewDate(days) {
  const due = new Date();
  due.setDate(due.getDate() + days);
  due.setHours(0, 0, 0, 0);
  return due.getTime();
}
function rate(rating) {
  const session = state.session;
  if (!session || session.rated || !session.queue.length) return;
  const id = session.queue[0];
  const previous = state.records[id];
  const isNew = !previous;
  session.undo = {id, previous:previous ?? null, queue:session.queue.slice(),
    total:session.total, misses:session.misses[id] ?? null, answered:!!state.day.answered[id],
    newCount:state.day.newCount, goal:state.goal, revealed};
  session.queue.shift();
  let note;
  if (rating === 'known') {
    const stage = Math.min((previous?.stage ?? -1) + 1, intervals.length - 1);
    const days = intervals[stage];
    state.records[id] = {stage, due:reviewDate(days), hard:false};
    note = days + ' 天后复习';
  } else {
    const fuzzy = rating === 'fuzzy';
    const misses = (session.misses[id] ?? 0) + 1;
    session.misses[id] = misses;
    const stage = fuzzy ? Math.max(-1, (previous?.stage ?? -1) - 1) : -1;
    state.records[id] = {stage, due:fuzzy ? reviewDate(1) : Date.now() + 600000, hard:true};
    if (misses === 1) {
      session.queue.splice(fuzzy ? 6 : 3, 0, id);
      note = '这个词稍后会在本轮再出现一次';
    } else {
      note = fuzzy ? '明天再复习' : '10 分钟后重新进入复习';
    }
  }
  if (isNew) state.day.newCount++;
  state.day.answered[id] = true;
  session.rated = {id, rating, isNew, note};
  save();
  renderStudy();
  if ($('next').getBoundingClientRect().bottom > window.innerHeight - 64) {
    $('next').scrollIntoView({block:'end'});
  }
}
function undoRating() {
  const session = state.session;
  const undo = session?.undo;
  if (!undo) return;
  stopAudio();
  const {id} = undo;
  if (undo.previous) state.records[id] = undo.previous;
  else delete state.records[id];
  if (undo.answered) state.day.answered[id] = true;
  else delete state.day.answered[id];
  state.day.newCount = undo.newCount;
  if (undo.misses === null) delete session.misses[id];
  else session.misses[id] = undo.misses;
  session.queue = undo.queue;
  session.total = undo.total;
  session.rated = null;
  session.undo = null;
  if (state.goal !== undo.goal) resizeDailyQueue(id);
  revealed = undo.revealed && currentId() === id;
  save();
  renderStudy();
  window.scrollTo(0, 0);
}
function stopAudio() {
  if (playback) {
    playback.audio.pause();
    delete playback.button.dataset.playing;
    playback = null;
  }
  $('audio-note').hidden = true;
  $('detail-audio-note').hidden = true;
}
function play(id, button, message) {
  stopAudio();
  if (!id) return;
  const audio = new Audio('audio/' + id + '.mp3');
  const request = {audio, button};
  playback = request;
  button.dataset.playing = 'true';
  audio.addEventListener('ended', () => { if (playback === request) stopAudio(); }, {once:true});
  audio.play().catch(() => {
    if (playback !== request) return;
    stopAudio();
    message.textContent = '音频暂时无法播放，点一下重试。';
    message.hidden = false;
  });
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
  detailId = id;
  $('detail-meta').textContent = level + ' · 真题出现 ' + count + ' 句';
  $('detail-word').textContent = word;
  $('detail-ipa').textContent = WORD_IPA[id];
  $('detail-meaning').textContent = meaning;
  $('detail-source').href = source(id);
  renderMemory(word, meaning, 'detail-memory-text');
  renderDetailStar();
  $('details').showModal();
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

$('peek').onclick = () => { revealed = true; renderStudy(); };
$('known').onclick = () => rate('known');
$('again').onclick = () => rate('again');
$('fuzzy').onclick = () => rate('fuzzy');
$('undo').onclick = undoRating;
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
    revealed = false;
    show(page, false);
  }
});
setInterval(() => { if (!document.hidden && page === 'study') show(page, false); }, 15000);
show('study', false);
