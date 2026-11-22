(function () {
  var fx = document.getElementById('fx');
  var heartsList = ['❤️', '🤍', '🖤', '💖', '❤', '🤍'];

  function rand(a, b) { return Math.random() * (b - a) + a; }

  function spawnHeart() {
    var el = document.createElement('span');
    el.className = 'fx-heart';
    el.textContent = heartsList[Math.floor(Math.random() * heartsList.length)];
    el.style.left = rand(0, 100) + 'vw';
    el.style.fontSize = rand(16, 38) + 'px';
    el.style.setProperty('--sway', rand(-60, 60) + 'px');
    var d = rand(6, 11);
    el.style.animationDuration = d + 's';
    fx.appendChild(el);
    setTimeout(function () { el.remove(); }, d * 1000);
  }

  function spawnPetal() {
    var el = document.createElement('span');
    var r = Math.random();
    el.className = 'fx-petal' + (r < 0.2 ? ' white' : r < 0.3 ? ' dark' : '');
    el.style.left = rand(0, 100) + 'vw';
    var s = rand(0.7, 1.7);
    el.style.width = 14 * s + 'px';
    el.style.height = 18 * s + 'px';
    el.style.setProperty('--sway', rand(-120, 120) + 'px');
    var d = rand(7, 14);
    el.style.animationDuration = d + 's';
    fx.appendChild(el);
    setTimeout(function () { el.remove(); }, d * 1000);
  }

  var running = false;
  function start() {
    if (running) return;
    running = true;
    setInterval(spawnHeart, 600);
    setInterval(spawnPetal, 380);
    for (var i = 0; i < 10; i++) { setTimeout(spawnPetal, i * 150); setTimeout(spawnHeart, i * 200); }
  }
  start(); // تشتغل حتى في شاشة الافتتاح

  // قلوب عند اللمس / الضغط
  function popAt(x, y) {
    for (var i = 0; i < 5; i++) {
      var p = document.createElement('span');
      p.className = 'pop-heart';
      p.textContent = heartsList[Math.floor(Math.random() * heartsList.length)];
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      p.style.setProperty('--dx', rand(-70, 70) + 'px');
      document.body.appendChild(p);
      setTimeout(function (e) { e.remove(); }, 1200, p);
    }
  }
  document.addEventListener('pointerdown', function (e) { popAt(e.clientX, e.clientY); });

  function burst() {
    for (var i = 0; i < 40; i++) {
      setTimeout(spawnHeart, i * 50);
      setTimeout(spawnPetal, i * 40);
    }
  }

  // فتح الهدية
  var intro = document.getElementById('intro');
  var site = document.getElementById('site');
  // كلمة السر (مخزنة بشكل مشفّر بسيط Base64 وليست مكتوبة صريحة)
  var SECRET = 'MDU0Njk5MjkxMg==';
  var passInput = document.getElementById('pass');
  var passErr = document.getElementById('passErr');

  function normalize(v) {
    // يقبل الأرقام العربية/الهندية والمسافات
    return v.replace(/[\u0660-\u0669]/g, function (d) { return d.charCodeAt(0) - 0x0660; })
            .replace(/[\u06F0-\u06F9]/g, function (d) { return d.charCodeAt(0) - 0x06F0; })
            .replace(/[\s\-]/g, '');
  }

  function unlock() {
    intro.classList.add('gone');
    site.classList.remove('hidden');
    window.scrollTo(0, 0);
    burst();
    setTimeout(function () { intro.style.display = 'none'; }, 1000);
  }

  document.getElementById('lockForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var v = normalize(passInput.value);
    if (v && btoa(v) === SECRET) {
      passErr.textContent = '';
      unlock();
    } else {
      passErr.textContent = 'الرقم غلط 🙈 انتظري مشعل يعطيك إياه في ميلادك ❤️';
      passInput.classList.remove('shake');
      void passInput.offsetWidth;
      passInput.classList.add('shake');
      passInput.select();
    }
  });

  document.getElementById('burstBtn').addEventListener('click', burst);

  // العد التنازلي: 24 ديسمبر
  var cdLabel = document.getElementById('cdLabel');
  var cdEl = document.getElementById('countdown');
  var introCd = document.getElementById('introCd');
  var introCap = document.getElementById('introCap');
  var cdHTML = cdEl.innerHTML;
  var birthdayShown = false;
  function setNum(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  }
  function tick() {
    var now = new Date();
    var y = now.getFullYear();
    var target = new Date(y, 11, 24, 0, 0, 0);
    var endOfDay = new Date(y, 11, 25, 0, 0, 0);
    if (now >= target && now < endOfDay) {
      cdLabel.textContent = 'اليوم ميلادك!';
      cdEl.innerHTML = '<div class="birthday-now">🎉 كل عام وإنتي بخير يا Marshmallow 🎂❤️</div>';
      introCd.style.display = 'none';
      introCap.textContent = '🎉 اليوم ميلادك! 🎂';
      birthdayShown = true;
      return;
    }
    if (birthdayShown) { // انتهى اليوم: رجّع العداد
      cdEl.innerHTML = cdHTML;
      cdLabel.textContent = 'باقي على ميلادك';
      introCd.style.display = '';
      introCap.textContent = 'باقي على ميلادك ٢٤ ديسمبر 🎂';
      birthdayShown = false;
    }
    if (now >= endOfDay) target = new Date(y + 1, 11, 24, 0, 0, 0);
    var diff = target - now;
    var d = Math.floor(diff / 864e5);
    var h = Math.floor(diff / 36e5) % 24;
    var m = Math.floor(diff / 6e4) % 60;
    var s = Math.floor(diff / 1e3) % 60;
    setNum('cdD', d); setNum('cdH', h); setNum('cdM', m); setNum('cdS', s);
    setNum('icD', d); setNum('icH', h); setNum('icM', m); setNum('icS', s);
  }
  tick();
  setInterval(tick, 1000);

  // كلام حلو
  var sweets = [
    'ضحكتك تسوى الدنيا كلها 🤍',
    'يا Marshmallow، إنتي أنعم وأحلى شي صار لي ❤️',
    'أحلى وقت في يومي لما أسمع صوتك في الكول 🎧',
    'لو الدنيا فالو، فإنتي دايم الـ MVP عندي 🎮🔥',
    'حتى ليو يحبك أكثر مني... بس عادي، أنا أحاول 😼',
    'إنتي مو بس عيد ميلادك اليوم، إنتي عيد لقلبي كل يوم 🎂',
    'وإحنا نايمين في الكول، أحس إني أحسن واحد في العالم 😴🤍',
    'ابتسمي، لأن ابتسامتك تضوي المكان ✨',
    'تستاهلين كل الفرح والحب والكيك في هالدنيا 🍰',
    'قلبي مثل المارشميلو من إنتي... ذايب فيك 🤍☁️',
    'كل سنة وإنتي أجمل وأقرب لقلبي ❤️',
    'اليوم ممنوع تزعلين، قانون من مشعل 😤❤️'
  ];
  var sweetText = document.getElementById('sweetText');
  var last = -1;
  document.getElementById('sweetBtn').addEventListener('click', function () {
    var i;
    do { i = Math.floor(Math.random() * sweets.length); } while (i === last);
    last = i;
    sweetText.classList.remove('swap');
    void sweetText.offsetWidth;
    sweetText.textContent = sweets[i];
    sweetText.classList.add('swap');
    for (var k = 0; k < 8; k++) setTimeout(spawnHeart, k * 80);
  });

  // الشمعة
  var cake = document.getElementById('cake');
  var flame = document.getElementById('flame');
  var hint = document.getElementById('cakeHint');
  function blow() {
    var off = flame.classList.toggle('off');
    if (off) {
      hint.textContent = 'تمنيتي؟ إن شاء الله تتحقق كل أمنياتك 🤍❤️';
      burst();
    } else {
      hint.textContent = 'رجعت الشمعة! اطلبي أمنية ثانية 😄';
    }
  }
  cake.addEventListener('click', blow);
  cake.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); blow(); }
  });
})();
