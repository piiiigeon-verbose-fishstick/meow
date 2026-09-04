/* Andy's Class: add <script src="andys-class.js"></script> to any HTML page. */
(function () {
  "use strict";

  function init() {

  var previous = window.AndyClass;
  if (previous && previous.destroy) previous.destroy();

  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  var style = document.createElement("style");
  var elementsStyle = document.createElement("style");
  var running = true;
  var destroying = false;
  var elementsVFXEnabled = true;
  var frame = 0;
  var destroyTimer = 0;
  var width = 0;
  var height = 0;
  var pixelRatio = 1;
  var stars = [];
  var fragments = [];
  var titleEffects = [];
  var pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

  style.textContent =
    "#andys-class-canvas{position:fixed;inset:0;z-index:2147483646;width:100vw;height:100vh;display:block;background:#03040b;cursor:crosshair}" +
    "body.andys-class-active{overflow:hidden!important}";
  elementsStyle.textContent =
    "h1#itsandysclass.andys-class-vfx-on,h1.andys-class-vfx-title.andys-class-vfx-on{position:relative;z-index:2147483647;isolation:isolate;color:#f5ffff!important;text-shadow:0 0 6px #75f8ff,0 0 18px #43dfff,0 0 42px #cf54ff;animation:andys-class-title 1.8s ease-in-out infinite alternate}" +
    "h1#itsandysclass.andys-class-vfx-on::before,h1#itsandysclass.andys-class-vfx-on::after,h1.andys-class-vfx-title.andys-class-vfx-on::before,h1.andys-class-vfx-title.andys-class-vfx-on::after{content:'';position:absolute;inset:-0.08em -0.18em;z-index:-1;pointer-events:none}" +
    "h1#itsandysclass.andys-class-vfx-on::before,h1.andys-class-vfx-title.andys-class-vfx-on::before{background:linear-gradient(100deg,transparent 15%,rgba(86,244,255,.76) 46%,rgba(255,170,253,.82) 54%,transparent 85%);filter:blur(12px);mix-blend-mode:screen;animation:andys-class-scan 2.4s linear infinite}" +
    "h1#itsandysclass.andys-class-vfx-on::after,h1.andys-class-vfx-title.andys-class-vfx-on::after{border-top:1px solid rgba(123,248,255,.8);border-bottom:1px solid rgba(244,113,255,.74);transform:scaleX(.2);opacity:.3;animation:andys-class-frame 1.8s ease-out infinite}" +
    "@keyframes andys-class-title{from{filter:hue-rotate(0deg);transform:translateY(0) scale(1)}to{filter:hue-rotate(18deg);transform:translateY(-.035em) scale(1.025)}}" +
    "@keyframes andys-class-scan{from{transform:translateX(-125%)}to{transform:translateX(125%)}}" +
    "@keyframes andys-class-frame{0%{transform:scaleX(.2);opacity:0}45%{opacity:.8}100%{transform:scaleX(1.15);opacity:0}}";
  canvas.id = "andys-class-canvas";
  canvas.setAttribute("aria-label", "你看到了安迪课");
  document.head.appendChild(style);
  document.head.appendChild(elementsStyle);
  document.body.appendChild(canvas);
  document.body.classList.add("andys-class-active");

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function buildScene() {
    stars = [];
    fragments = [];
    var starCount = Math.min(230, Math.round((width * height) / 6500));
    var fragmentCount = Math.min(85, Math.round((width * height) / 18000));
    for (var i = 0; i < starCount; i += 1) {
      stars.push({ x: Math.random(), y: Math.random(), z: random(0.1, 1), speed: random(0.12, 0.85) });
    }
    for (var j = 0; j < fragmentCount; j += 1) {
      fragments.push({
        x: Math.random(),
        y: Math.random(),
        size: random(1, 4),
        spin: random(-0.04, 0.04),
        angle: random(0, Math.PI * 2),
        speed: random(0.08, 0.34),
        hue: Math.random() > 0.55 ? 190 : 320
      });
    }
  }

  function replacePlaceholders() {
    var placeholders = document.querySelectorAll(".andysclazz, .andysnotclass");
    for (var i = 0; i < placeholders.length; i += 1) {
      var source = placeholders[i];
      var title = document.createElement("h1");
      title.className = "andys-class-vfx-title";
      title.textContent = source.classList.contains("andysnotclass") ? "CCAANDYS" : "安迪课";
      source.parentNode.replaceChild(title, source);
    }
  }

  function transformTitles() {
    var titles = document.querySelectorAll("h1#itsandysclass");
    var generatedTitles = document.querySelectorAll("h1.andys-class-vfx-title");
    titleEffects = [];
    for (var i = 0; i < titles.length; i += 1) {
      var title = titles[i];
      title.classList.add("andys-class-vfx-on");
      titleEffects.push({ element: title, phase: random(0, Math.PI * 2) });
    }
    for (var j = 0; j < generatedTitles.length; j += 1) {
      generatedTitles[j].classList.add("andys-class-vfx-on");
      titleEffects.push({ element: generatedTitles[j], phase: random(0, Math.PI * 2) });
    }
  }

  function drawTitleBursts(time) {
    if (!elementsVFXEnabled) return;
    for (var i = 0; i < titleEffects.length; i += 1) {
      var effect = titleEffects[i];
      var rect = effect.element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0 || rect.bottom < 0 || rect.top > height) continue;
      var pulse = 0.5 + Math.sin(time * 0.004 + effect.phase) * 0.5;
      var x = rect.left + rect.width / 2;
      var y = rect.top + rect.height / 2;
      context.save();
      context.globalCompositeOperation = "lighter";
      context.strokeStyle = "rgba(104,245,255," + (0.12 + pulse * 0.22) + ")";
      context.shadowColor = "#78f6ff";
      context.shadowBlur = 16;
      context.lineWidth = 1;
      context.beginPath();
      context.ellipse(x, y, rect.width * (0.56 + pulse * 0.05), rect.height * (0.78 + pulse * 0.18), 0, 0, Math.PI * 2);
      context.stroke();
      for (var spark = 0; spark < 8; spark += 1) {
        var angle = effect.phase + spark * Math.PI / 4 + time * 0.001;
        var distance = Math.max(rect.width, rect.height) * (0.52 + pulse * 0.28);
        context.fillStyle = spark % 2 ? "#79f8ff" : "#f596ff";
        context.fillRect(x + Math.cos(angle) * distance, y + Math.sin(angle) * distance, 2, 2);
      }
      context.restore();
    }
  }

  function resize() {
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    buildScene();
  }

  function drawGrid(time) {
    var horizon = height * 0.62;
    var centerX = width * (0.5 + (pointer.x - 0.5) * 0.055);
    var glow = context.createLinearGradient(0, horizon - 60, 0, height);
    glow.addColorStop(0, "rgba(61, 245, 255, 0)");
    glow.addColorStop(1, "rgba(181, 46, 255, 0.19)");
    context.fillStyle = glow;
    context.fillRect(0, horizon, width, height - horizon);
    context.save();
    context.lineWidth = 1;
    context.strokeStyle = "rgba(74, 236, 255, 0.25)";
    for (var x = -9; x <= 9; x += 1) {
      context.beginPath();
      context.moveTo(centerX + x * width * 0.035, horizon);
      context.lineTo(centerX + x * width * 0.19, height);
      context.stroke();
    }
    for (var y = 0; y < 18; y += 1) {
      var progress = (y + ((time * 0.00035) % 1)) / 18;
      var curve = progress * progress;
      var gridY = horizon + curve * (height - horizon);
      context.globalAlpha = Math.max(0, 0.38 - progress * 0.24);
      context.beginPath();
      context.moveTo(0, gridY);
      context.lineTo(width, gridY);
      context.stroke();
    }
    context.restore();
  }

  function drawWord(time) {
    var fontSize = Math.min(width * 0.13, height * 0.24, 180);
    if (width < 560) fontSize = Math.min(width * 0.19, 92);
    var x = width / 2 + (pointer.x - 0.5) * 25;
    var y = height * 0.49 + Math.sin(time * 0.0014) * 7;
    var text = "你看到了安迪课";
    context.save();
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "900 " + fontSize + "px Arial, 'Microsoft YaHei', sans-serif";
    context.lineJoin = "round";
    context.shadowBlur = 48;
    context.shadowColor = "rgba(56, 233, 255, 0.95)";
    context.strokeStyle = "rgba(39, 232, 255, 0.88)";
    context.lineWidth = Math.max(1.5, fontSize * 0.013);
    context.strokeText(text, x, y);
    var fill = context.createLinearGradient(x - width * 0.36, y - fontSize, x + width * 0.36, y + fontSize);
    fill.addColorStop(0, "#e9ffff");
    fill.addColorStop(0.32, "#6ff8ff");
    fill.addColorStop(0.66, "#ed78ff");
    fill.addColorStop(1, "#ffffff");
    context.shadowBlur = 16;
    context.fillStyle = fill;
    context.fillText(text, x, y);
    context.globalCompositeOperation = "source-atop";
    context.fillStyle = "rgba(255,255,255," + (0.08 + Math.sin(time * 0.004) * 0.05) + ")";
    context.fillRect(x - width * 0.45, y - fontSize, width * 0.9, fontSize * 2);
    context.restore();
  }

  function render(time) {
    if (!running) return;
    pointer.x += (pointer.tx - pointer.x) * 0.045;
    pointer.y += (pointer.ty - pointer.y) * 0.045;
    context.clearRect(0, 0, width, height);
    var sky = context.createRadialGradient(width * pointer.x, height * pointer.y, 0, width * 0.5, height * 0.5, Math.max(width, height) * 0.72);
    sky.addColorStop(0, "#16204a");
    sky.addColorStop(0.42, "#090c22");
    sky.addColorStop(1, "#020308");
    context.fillStyle = sky;
    context.fillRect(0, 0, width, height);

    for (var i = 0; i < stars.length; i += 1) {
      var star = stars[i];
      var sx = star.x * width + (pointer.x - 0.5) * star.z * 44;
      var sy = star.y * height + (pointer.y - 0.5) * star.z * 28;
      var radius = star.z * 1.55;
      context.fillStyle = "rgba(200,244,255," + (0.25 + star.z * 0.65) + ")";
      context.beginPath();
      context.arc(sx, sy, radius, 0, Math.PI * 2);
      context.fill();
      star.y += (0.00008 + star.speed * 0.00022);
      if (star.y > 1.04) { star.y = -0.04; star.x = Math.random(); }
    }

    drawGrid(time);
    for (var j = 0; j < fragments.length; j += 1) {
      var fragment = fragments[j];
      var fx = fragment.x * width + Math.sin(time * 0.0005 + j) * 18;
      var fy = fragment.y * height;
      context.save();
      context.translate(fx, fy);
      context.rotate(fragment.angle + time * fragment.spin);
      context.fillStyle = "hsla(" + fragment.hue + ",100%,70%,0.62)";
      context.shadowColor = "hsla(" + fragment.hue + ",100%,70%,0.85)";
      context.shadowBlur = 10;
      context.fillRect(-fragment.size / 2, -fragment.size * 2, fragment.size, fragment.size * 4);
      context.restore();
      fragment.y += fragment.speed * 0.00032;
      if (fragment.y > 1.05) { fragment.y = -0.05; fragment.x = Math.random(); }
    }

    var lineY = height * 0.49 + Math.sin(time * 0.0014) * 7;
    var sweepX = ((time * 0.26) % (width + 380)) - 190;
    var beam = context.createLinearGradient(sweepX - 70, 0, sweepX + 70, 0);
    beam.addColorStop(0, "rgba(255,255,255,0)");
    beam.addColorStop(0.5, "rgba(255,255,255,0.24)");
    beam.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = beam;
    context.fillRect(sweepX - 70, lineY - 100, 140, 200);
    drawTitleBursts(time);
    drawWord(time);
    frame = window.requestAnimationFrame(render);
  }

  function drawOutro(time, startedAt) {
    var progress = Math.min((time - startedAt) / 1350, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    var centerX = width / 2;
    var centerY = height * 0.49;
    context.clearRect(0, 0, width, height);
    context.fillStyle = "rgba(2,3,8," + (0.2 + eased * 0.8) + ")";
    context.fillRect(0, 0, width, height);

    var radius = Math.max(width, height) * (0.08 + eased * 0.9);
    var flash = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    flash.addColorStop(0, "rgba(255,255,255," + (0.8 * (1 - eased)) + ")");
    flash.addColorStop(0.12, "rgba(90,245,255," + (0.42 * (1 - eased)) + ")");
    flash.addColorStop(1, "rgba(130,35,255,0)");
    context.fillStyle = flash;
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(centerX, centerY);
    context.scale(1 + eased * 1.65, 1 + eased * 1.65);
    context.rotate(eased * 0.08);
    context.globalAlpha = 1 - eased;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "900 " + Math.min(width * 0.13, height * 0.24, 180) + "px Arial, 'Microsoft YaHei', sans-serif";
    context.shadowBlur = 34;
    context.shadowColor = "#56efff";
    context.strokeStyle = "#77f7ff";
    context.lineWidth = 3;
    context.strokeText("你看到了安迪课", 0, 0);
    context.fillStyle = "#f29cff";
    context.fillText("你看到了安迪课", 0, 0);
    context.restore();

    context.save();
    context.globalCompositeOperation = "lighter";
    for (var i = 0; i < fragments.length; i += 1) {
      var fragment = fragments[i];
      var angle = fragment.angle;
      var distance = eased * Math.max(width, height) * (0.3 + fragment.speed * 1.8);
      var fx = centerX + Math.cos(angle) * distance;
      var fy = centerY + Math.sin(angle) * distance;
      context.globalAlpha = (1 - progress) * 0.85;
      context.fillStyle = "hsl(" + fragment.hue + ",100%,70%)";
      context.shadowColor = context.fillStyle;
      context.shadowBlur = 14;
      context.fillRect(fx, fy, fragment.size * 2, fragment.size * 2);
    }
    context.restore();

    if (progress < 1) frame = window.requestAnimationFrame(function (nextTime) {
      drawOutro(nextTime, startedAt);
    });
    else finishDestroy();
  }

  function finishDestroy() {
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    if (style.parentNode) style.parentNode.removeChild(style);
    document.body.classList.remove("andys-class-active");
  }

  function toggleElementsVFX(enabled) {
    elementsVFXEnabled = enabled === undefined ? !elementsVFXEnabled : Boolean(enabled);
    for (var i = 0; i < titleEffects.length; i += 1) {
      titleEffects[i].element.classList.toggle("andys-class-vfx-on", elementsVFXEnabled);
    }
    return elementsVFXEnabled;
  }

  function move(event) {
    pointer.tx = event.clientX / width;
    pointer.ty = event.clientY / height;
  }

  function destroy() {
    if (destroying) return;
    destroying = true;
    running = false;
    window.clearTimeout(destroyTimer);
    window.cancelAnimationFrame(frame);
    window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", move);
    var startedAt = window.performance.now();
    drawOutro(startedAt, startedAt);
  }

  window.AndyClass = { destroy: destroy, toggleElementsVFX: toggleElementsVFX };
  window.toggleElementsVFX = toggleElementsVFX;
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", move);
  resize();
  replacePlaceholders();
  transformTitles();
  render(0);
  destroyTimer = window.setTimeout(destroy, 5000);
  }

  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init, { once: true });
}());
