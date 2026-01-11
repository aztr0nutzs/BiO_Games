(() => {
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d', { alpha: true });

  let w = 0, h = 0, dpr = 1;

  function resize(){
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const rect = canvas.getBoundingClientRect();
    w = Math.max(1, Math.floor(rect.width * dpr));
    h = Math.max(1, Math.floor(rect.height * dpr));
    canvas.width = w;
    canvas.height = h;
    ctx.setTransform(1,0,0,1,0,0);
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  // Utility
  const rand = (a,b) => a + Math.random()*(b-a);

  // Generate a lightning polyline from (x0,y0) to (x1,y1)
  function bolt(x0,y0,x1,y1, steps){
    const pts = [];
    const dx = (x1-x0)/steps;
    const dy = (y1-y0)/steps;
    const perpX = -dy;
    const perpY = dx;
    const norm = Math.hypot(perpX, perpY) || 1;
    const px = perpX / norm;
    const py = perpY / norm;

    for(let i=0;i<=steps;i++){
      const t = i/steps;
      const jitter = (1 - Math.abs(0.5 - t)*2) ** 0.7; // strongest in middle
      const amp = rand(6, 22) * jitter * dpr;
      const off = rand(-amp, amp);
      pts.push([
        x0 + dx*i + px*off,
        y0 + dy*i + py*off
      ]);
    }
    return pts;
  }

  // Sparks emitters along bottom edge
  const emitters = Array.from({length: 4}, (_,i) => ({
    x: (i+0.5)/4,
    phase: rand(0, Math.PI*2),
    rate: rand(0.7, 1.4),
    life: 0
  }));

  function drawBolt(pts, alpha, width, hueShift){
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = alpha;

    // Tight neon lines, no foggy fills.
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Two-stroke for crispness: faint outer + sharp core
    const baseHue = 185 + hueShift; // cyan/teal region
    const magHue  = 295 + hueShift*0.35; // faint magenta accent

    // Outer
    ctx.strokeStyle = `hsla(${baseHue}, 100%, 70%, 0.25)`;
    ctx.lineWidth = width*2.6;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();

    // Core
    ctx.strokeStyle = `hsla(${baseHue}, 100%, 78%, 0.75)`;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();

    // Tiny magenta flicker accent (very subtle)
    if (Math.random() < 0.35){
      ctx.strokeStyle = `hsla(${magHue}, 100%, 70%, 0.22)`;
      ctx.lineWidth = width*0.85;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for(let i=1;i<pts.length;i+=2) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.stroke();
    }

    ctx.restore();
  }

  let t0 = performance.now();

  function frame(now){
    const dt = Math.min(33, now - t0);
    t0 = now;

    ctx.clearRect(0,0,w,h);

    // Slight vignette-ish darkening WITHOUT color wash (keeps it clean)
    ctx.save();
    ctx.globalAlpha = 0.18;
    const g = ctx.createRadialGradient(w*0.5,h*0.65, 10, w*0.5,h*0.65, Math.max(w,h)*0.75);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);
    ctx.restore();

    // Create bolts
    const yBase = h*0.70;
    const yTop = h*0.18;

    for (const e of emitters){
      e.phase += dt * 0.0016 * e.rate;
      e.life -= dt;

      if (e.life <= 0){
        e.life = rand(120, 260); // ms between bursts
        const x0 = (e.x + 0.03*Math.sin(e.phase)) * w;
        const x1 = (e.x + rand(-0.18,0.18)) * w;
        const pts = bolt(x0, yBase + rand(0, h*0.12), x1, yTop + rand(0, h*0.22), Math.floor(rand(12, 22)));
        e._pts = pts;
        e._age = 0;
        e._ttl = rand(120, 210);
        e._w = rand(1.2, 2.2) * dpr;
        e._hs = rand(-10, 10);
      }

      if (e._pts){
        e._age += dt;
        const a = 1 - (e._age / e._ttl);
        if (a <= 0){
          e._pts = null;
        } else {
          // micro-jitter for living electricity
          const pts = e._pts.map(([x,y],i)=>[
            x + Math.sin(now*0.012 + i)*0.35*dpr,
            y + Math.cos(now*0.010 + i)*0.25*dpr
          ]);
          drawBolt(pts, Math.min(0.85, a*0.95), e._w, e._hs);
        }
      }
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
