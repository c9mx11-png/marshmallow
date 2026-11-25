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
    'اليوم ممنوع تزعلين، قانون من مشعل 😤❤️',
    'ازعجيني متى ما تبين، أنا أحب إزعاجك وأموت عليه 🤍',
    'فدا عيونك يا قلبي، والله ما أبدّلك بأحد ❤️',
    'يا عمري، حتى لو نمت بالكول، صوتك آخر شي أسمعه وأحلى شي أصحى عليه 🎧',
    'نقطة منك بس، وأعرف إنك تبيني. وأنا دايم هنا 🤍',
    'نتستنا بعض نصحى، وهذا أحلى انتظار في يومي ☀️',
    'صح النوم يا روحي، يومي ما يبدأ إلا بك 🤍',
    'كل شوي أطمن عليك، لأن راحتي إنك ترتاحين وتنامين 🌙🤍',
    'قلتي ما أقدر أعيش بدونك، وصدقتي والله 😌❤️',
    'جيتي وقلتي «جايه»، وأحلى كلمة سمعتها ذاك اليوم 💜',
    'ضحكتك وإنتي تقولين «استمر في تحسين» أحلى من أي مدح 😂🎮',
    'حتى لو أنا ألعب أسوأ لعب، يكفي إنك معي 🎮🤍'
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
  // عدّادات الأرقام
  var counted = false;
  function runCounts() {
    if (counted) return;
    counted = true;
    document.querySelectorAll('.count').forEach(function (el) {
      var to = +el.getAttribute('data-to'), n = 0, step = Math.max(1, Math.ceil(to / 50));
      var t = setInterval(function () {
        n = Math.min(to, n + step);
        el.textContent = n;
        if (n >= to) clearInterval(t);
      }, 30);
    });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es, ob) {
      if (es[0].isIntersecting) { runCounts(); ob.disconnect(); }
    }).observe(document.getElementById('stats'));
  } else { runCounts(); }

  // كلام بيننا
  var talks = [
    ['.', 'كل ما تبعثين نقطة، أعرف إنك تبيني. وأنا دايم هنا 🤍'],
    ['صاحي؟', 'صاحي لك دايم، حتى لو نص نايم 😴'],
    ['تعال فالو', 'جاهز! إنتي الـ Carry وأنا أدعمك 😌🎮'],
    ['فك لي شير', 'من عيوني، أفتح لك الشير والدنيا معه 🖥️❤️'],
    ['ميشو', 'لبيه 🤍 أحلى اسم لما تقولينه إنتي'],
    ['ايش تسوي', 'أفكر فيك… وإنتي؟ 🤍'],
    ['صحيت؟', 'نتستنا بعض نصحى، وهذا أحلى انتظار ☀️😴'],
    ['مشتاقتلك', 'وأنا أكثر، والمسافة ما تفرق، الكول بيننا 🎧🤍'],
    ['المايك عدله', 'أمرك 🎙️ عشان ما يفوتك شي من صوتي 😂'],
    ['نمتي؟', 'كل شوي أطمن عليك، ما أرتاح إلا لما تنامين 🌙🤍'],
    ['تعالي', 'جاي لك قبل ما تكملينها 😌💜'],
    ['اجيك؟', 'قولي بس «تعالي»، وأنا أنتظرك دايم 🤍'],
    ['استمر في تحسين', 'والله أتحسن عشانك، وإنتي أحسن مدربة 😂🎮'],
    ['💜', '💜 وهذا القلب من الفجر لين الفجر، دايم لك 🤍']
  ];
  var chips = document.getElementById('chips');
  var chipText = document.getElementById('chipText');
  talks.forEach(function (t) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = t[0];
    b.addEventListener('click', function () {
      chipText.classList.remove('swap');
      void chipText.offsetWidth;
      chipText.textContent = t[1];
      chipText.classList.add('swap');
      for (var k = 0; k < 5; k++) setTimeout(spawnHeart, k * 80);
    });
    chips.appendChild(b);
  });

  // مين يحب أكثر
  var moreN = 0;
  var replies = ['وأنا أكثر 🤍', 'لا أنا أكثر 😤❤️', 'وأنا أكثر منك بمرة 😌🤍', 'خلاص نتعادل… بس أنا أكثر 😏❤️'];
  var moreText = document.getElementById('moreText');
  var moreCount = document.getElementById('moreCount');
  document.getElementById('moreBtn').addEventListener('click', function () {
    moreText.classList.remove('swap');
    void moreText.offsetWidth;
    moreText.textContent = replies[moreN % replies.length];
    moreText.classList.add('swap');
    moreN++;
    moreCount.textContent = 'الجولة ' + moreN + '، وما حد فاز للحين 😂';
    for (var k = 0; k < 6; k++) setTimeout(spawnHeart, k * 80);
  });

  // افتحي لما...
  var envData = [
    { e: '💔', t: 'لما تزعلين', h: 'لما تزعلين', m: 'أول شي، تعالي حضن كبير من بعيد 🫂 مهما كان اللي مزعلك، هو أصغر منك ومن قلبك الكبير. خذي نفس وقولي لي، أنا أسمعك وما أقاطعك. وإنتي ما خليتي أحد زعل إلا وانتي تسامحينه، فسامحي نفسك كمان 🤍' },
    { e: '🌙', t: 'لما ما تقدرين تنامين', h: 'لما ما تقدرين تنامين', m: 'ترى أنا صاحي معك. افتحي الكول وخلينا نسولف عن أي شي، وإذا غفيتي أنا ما أسكر، وأنتظر أسمع صوتك لين الصبح 🎧😴 وكل شوي أطمن عليك نمتي؟ 😂' },
    { e: '🥺', t: 'لما تشتاقين لي', h: 'لما تشتاقين لي', m: 'الحين إنتي ما تدرين، بس أنا أشتاق لك أكثر 😌 ابعثي لي نقطة «.» وأنا أعرف كل شي، والباقي أقوله أنا. وكل مسافة بيننا يقصرها الكول 🤍' },
    { e: '😂', t: 'لما تبين تضحكين', h: 'لما تبين تضحكين', m: 'تذكري يوم قلتي لي «استمر في تحسين» وأنا ألعب أسوأ لعب في حياتي 😂🎮 وتذكري «معلش بالغلط» اللي صارت بداية كل شي. وإذا ما ضحكتي لحد الحين، أنا جاهز أسوي أي شي عشان ضحكتك 🤣' },
    { e: '🎮', t: 'لما تخسرين في فالو', h: 'لما تخسرين في فالو', m: 'اللي خسّرك مو أنتي، الفريق 😤 وإنتي دايم الـ MVP عندي. نعيدها مرة ثانية ونفوز، وإذا ما فزنا، عادي، يكفي إنك معي 🤍🔥' },
    { e: '☀️', t: 'لما تصحين الصبح', h: 'لما تصحين الصبح', m: 'صباح الخير يا أحلى شي بصبحي ☀️ أتمنى يومك خفيف وكله خير، ولا تنسين تاكلين وتشربين موية وتبتسمين، وعدّلي مزاجك وأنا معك طول اليوم 🤍' }
  ];
  var envs = document.getElementById('envs');
  var envLetter = document.getElementById('envLetter');
  var envBtns = [];
  envData.forEach(function (d, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'env';
    b.setAttribute('aria-pressed', 'false');
    var ei = document.createElement('span');
    ei.className = 'ei';
    ei.setAttribute('aria-hidden', 'true');
    ei.textContent = d.e;
    b.appendChild(ei);
    b.appendChild(document.createTextNode('افتحي ' + d.t));
    b.addEventListener('click', function () {
      envBtns.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
      envLetter.innerHTML = '';
      var h = document.createElement('h3'); h.textContent = '💌 ' + d.h;
      var p = document.createElement('p'); p.textContent = d.m;
      var s = document.createElement('p'); s.className = 'sign'; s.textContent = '— مشعل ❤️';
      envLetter.appendChild(h); envLetter.appendChild(p); envLetter.appendChild(s);
      envLetter.classList.remove('swap');
      void envLetter.offsetWidth;
      envLetter.classList.add('swap');
      for (var k = 0; k < 6; k++) setTimeout(spawnHeart, k * 80);
    });
    envs.appendChild(b);
    envBtns.push(b);
  });

  // قسايم هدايا
  var coupons = [
    { e: '🎮', t: 'ساعتين فالو', d: 'نلعب فالو سوا ساعتين وأنا أدعمك، وإنتي القائدة ما حد يعارضك 😌' },
    { e: '🎬', t: 'ليلة فيلم', d: 'إنتي تختارين الفيلم، حتى لو كان Knives Out للمرة العاشرة 🔪' },
    { e: '🎧', t: 'كول لين تنامين', d: 'أسهر معك في الكول وأنتظرك لين تغفين، وأطمن عليك بعد 😴🤍' },
    { e: '🗣️', t: 'إزعاج بلا حدود', d: 'تزعجيني متى ما تبين ومن غير ما أتضايق، أنا أحب إزعاجك 😂' },
    { e: '🎨', t: 'رسمة منك', d: 'ارسمي لي لوحة صغيرة، وأعلقها عندي وأفتخر فيها قدام الكل 🖌️' },
    { e: '👂', t: 'أسمعك لين تخلصين', d: 'تفضفضين وأنا أسمع، من غير ما أقاطعك ومن غير أحكام 🤍' }
  ];
  var cl = document.getElementById('couponList');
  coupons.forEach(function (c, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'coupon';
    b.setAttribute('aria-pressed', 'false');
    var tag = document.createElement('span'); tag.className = 'cp-tag'; tag.textContent = 'قسيمة ' + (i + 1) + ' · صالحة دايم';
    var ti = document.createElement('span'); ti.className = 'cp-title'; ti.textContent = c.e + ' ' + c.t;
    var de = document.createElement('span'); de.className = 'cp-desc'; de.textContent = c.d;
    var st = document.createElement('span'); st.className = 'cp-state'; st.textContent = 'اضغطي للاستخدام 🎁';
    b.appendChild(tag); b.appendChild(ti); b.appendChild(de); b.appendChild(st);
    b.addEventListener('click', function () {
      var used = b.classList.toggle('used');
      b.setAttribute('aria-pressed', used ? 'true' : 'false');
      st.textContent = used ? 'تم الاستخدام ✅ قولي لي متى تبينها 🤍' : 'اضغطي للاستخدام 🎁';
      if (used) {
        var r = b.getBoundingClientRect();
        popAt(r.left + r.width / 2, r.top + r.height / 2);
        for (var k = 0; k < 8; k++) setTimeout(spawnHeart, k * 70);
      }
    });
    cl.appendChild(b);
  });

  // أسباب أحبك
  var reasons = [
    'ضحكتك، تغيّر يومي كله 🤍',
    'قلبك الطيب، وتسامحك اللي يعجز عنه كثير ❤️',
    'لأنك تخافين علي وإنتي تقولين «لا تسهر وانتبه لنفسك» 🥹',
    'لأن صوتك آخر شي أسمعه وأول شي أبيه 🎧',
    'لأنك تخليني أضحك حتى وأنا تعبان 😂',
    'لأنك صادقة ووفية، وهذا أجمل شي فيك ✨',
    'لأن حبك لليو يطلع حنانك الحلو 🐱',
    'لأنك تحبين الرسم وفيك موهبة تستاهل تبان 🎨',
    'لأنك تقولين «جايه» وتجين، وأحس إني مهم عندك 💜',
    'لأنك تدعميني في الفالو حتى لو ألعب مو زين 😂🎮',
    'لأنك تسمعيني من غير ما تملين 🤍',
    'لأن حتى «معلش بالغلط» منك صارت أحلى بداية 😌',
    'لأنك تخليني أبي أكون أحسن كل يوم ❤️',
    'لأنك Marshmallow، ناعمة وحلوة وتذوّبين القلب ☁️🤍'
  ];
  var reasonText = document.getElementById('reasonText');
  var reasonNo = document.getElementById('reasonNo');
  var rN = 0;
  document.getElementById('reasonBtn').addEventListener('click', function () {
    var idx = rN % reasons.length;
    reasonNo.textContent = 'السبب رقم ' + (idx + 1) + ' من ' + reasons.length + ' ❤️';
    reasonText.classList.remove('swap');
    void reasonText.offsetWidth;
    reasonText.textContent = reasons[idx];
    reasonText.classList.add('swap');
    rN++;
    if (rN === reasons.length) { setTimeout(function () { reasonNo.textContent = 'وبعد في أسباب أكثر، ما تخلص 🤍'; }, 2500); }
    for (var k = 0; k < 6; k++) setTimeout(spawnHeart, k * 80);
  });

  // ظهور ناعم للأقسام عند النزول
  if ('IntersectionObserver' in window) {
    document.body.classList.add('js-reveal');
    var revealEls = document.querySelectorAll('.section');
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    revealEls.forEach(function (el) { el.classList.add('reveal'); ro.observe(el); });
  }

  cake.addEventListener('click', blow);
  cake.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); blow(); }
  });
})();
