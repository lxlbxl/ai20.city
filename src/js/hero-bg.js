/*
 * hero-bg.js — ambient generative background for hero sections.
 *
 * A hand-written WebGL fragment shader (no Three.js — the library would add
 * ~150KB gzipped for something a single shader does in a few KB, and this site
 * is already carrying a large icon bundle).
 *
 * Design intent: the brand is austere and editorial, so this is deliberately
 * near-invisible — a slow domain-warped noise field that varies the alabaster
 * by only a few percent of luminance, with a faint #ff3300 bloom that eases
 * toward the pointer. It should read as living paper, not as an effect.
 *
 * Progressive enhancement throughout:
 *   - no WebGL / no canvas support  -> nothing happens, flat background stays
 *   - prefers-reduced-motion        -> renders a single static frame, no loop
 *   - tab hidden or hero off-screen -> loop paused (battery)
 *   - pointer/touch listeners are passive, so scrolling is never hijacked
 *
 * Usage: add `data-hero-bg` to any positioned section. The canvas is injected
 * as the first child; see style.css for the stacking rules.
 */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_pointer;   // eased, normalised 0..1
uniform float u_energy;    // 0..1, rises while the pointer moves

// --- value noise + fbm -----------------------------------------------------
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
        u.y
    );
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p *= 2.02;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_res.xy;
    vec2 p  = uv;
    p.x *= u_res.x / u_res.y;          // aspect-correct

    float t = u_time * 0.028;          // slow

    // Domain warp — this is what gives it the fluid, "alive" quality.
    vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3 - t)));
    vec2 r = vec2(
        fbm(p + 3.0 * q + vec2(1.7, 9.2) + 0.15 * t),
        fbm(p + 3.0 * q + vec2(8.3, 2.8) - 0.12 * t)
    );
    float f = fbm(p + 2.4 * r);

    // Pointer influence: a soft, wide falloff that pulls the field toward the
    // cursor and blooms slightly. Aspect-corrected so it stays circular.
    vec2 ptr = u_pointer;
    ptr.x *= u_res.x / u_res.y;
    float d = distance(p, ptr);
    float halo = smoothstep(0.62, 0.0, d);

    // --- palette (must stay on-brand) --------------------------------------
    vec3 alabaster = vec3(0.957, 0.945, 0.918);   // #f4f1ea
    vec3 shade     = vec3(0.898, 0.878, 0.831);   // a touch deeper/warmer
    vec3 orange    = vec3(1.000, 0.200, 0.000);   // #ff3300

    // Base variation is intentionally tiny — a few percent of luminance.
    float band = f + 0.10 * halo;
    vec3 col = mix(alabaster, shade, smoothstep(0.35, 0.85, band) * 0.55);

    // Thin contour lines echo the hairline rules used across the site.
    float line = abs(fract(band * 5.0) - 0.5);
    col = mix(col, shade, (1.0 - smoothstep(0.0, 0.045, line)) * 0.16);

    // Whisper of accent, strongest near the pointer and while it is moving.
    float bloom = halo * (0.020 + 0.045 * u_energy);
    col = mix(col, orange, bloom * smoothstep(0.30, 0.95, band));

    // Fine grain so gradients never band on wide screens.
    col += (hash(gl_FragCoord.xy + u_time) - 0.5) * 0.012;

    gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl, type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        gl.deleteShader(sh);
        return null;
    }
    return sh;
}

function initOne(host) {
    const canvas = document.createElement('canvas');
    canvas.className = 'hero-bg-canvas';
    canvas.setAttribute('aria-hidden', 'true');

    const gl =
        canvas.getContext('webgl', { antialias: false, depth: false, alpha: false }) ||
        canvas.getContext('experimental-webgl');
    if (!gl) return; // no WebGL — leave the flat background alone

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    // Fullscreen triangle pair.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uPtr = gl.getUniformLocation(prog, 'u_pointer');
    const uEnergy = gl.getUniformLocation(prog, 'u_energy');

    host.insertBefore(canvas, host.firstChild);

    // Cap DPR — the effect is low-frequency, so extra pixels buy nothing.
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);

    function resize() {
        // Measure the rendered box. clientWidth can still be 0/unsettled when
        // this runs during module init, which silently produced a wrongly
        // sized drawing buffer.
        const r = host.getBoundingClientRect();
        const w = Math.max(1, Math.round(r.width || host.clientWidth));
        const h = Math.max(1, Math.round(r.height || host.clientHeight));
        const cw = Math.floor(w * DPR);
        const ch = Math.floor(h * DPR);
        if (cw === canvas.width && ch === canvas.height) return false;
        canvas.width = cw;
        canvas.height = ch;
        gl.viewport(0, 0, cw, ch);
        gl.uniform2f(uRes, cw, ch);
        return true;
    }

    // Pointer state, eased so motion feels weighted rather than twitchy.
    let tx = 0.5, ty = 0.55;   // target
    let cx = 0.5, cy = 0.55;   // current
    let energy = 0;

    function point(clientX, clientY) {
        const b = host.getBoundingClientRect();
        tx = (clientX - b.left) / Math.max(b.width, 1);
        ty = 1 - (clientY - b.top) / Math.max(b.height, 1); // GL origin is bottom-left
        energy = 1;
    }

    const onMouse = (e) => point(e.clientX, e.clientY);
    const onTouch = (e) => {
        if (e.touches && e.touches.length) point(e.touches[0].clientX, e.touches[0].clientY);
    };

    // Passive listeners — must never block scrolling on mobile.
    host.addEventListener('mousemove', onMouse, { passive: true });
    host.addEventListener('touchstart', onTouch, { passive: true });
    host.addEventListener('touchmove', onTouch, { passive: true });

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    let raf = 0;
    let visible = true;
    const start = performance.now();

    function frame(now) {
        raf = 0;
        const t = (now - start) / 1000;

        // Ease toward the pointer; bleed off energy when it stops moving.
        cx += (tx - cx) * 0.045;
        cy += (ty - cy) * 0.045;
        energy *= 0.94;

        gl.uniform1f(uTime, t);
        gl.uniform2f(uPtr, cx, cy);
        gl.uniform1f(uEnergy, energy);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        if (visible && !reduced.matches) raf = requestAnimationFrame(frame);
    }

    function play() {
        if (!raf && visible && !reduced.matches) raf = requestAnimationFrame(frame);
    }
    function stop() {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
    }

    // Pause when the hero scrolls away or the tab is hidden.
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(
            (entries) => {
                visible = entries[0].isIntersecting;
                visible ? play() : stop();
            },
            { threshold: 0 }
        ).observe(host);
    }
    document.addEventListener('visibilitychange', () => {
        visible = !document.hidden;
        visible ? play() : stop();
    });

    let rt = 0;
    window.addEventListener('resize', () => {
        clearTimeout(rt);
        rt = setTimeout(() => {
            resize();
            frame(performance.now()); // repaint immediately at the new size
        }, 150);
    });

    // Keep the drawing buffer in step with the element for the life of the page.
    if ('ResizeObserver' in window) {
        new ResizeObserver(() => {
            if (resize()) frame(performance.now());
        }).observe(host);
    }

    function startup() {
        resize();
        frame(performance.now());   // always paint at least one frame

        // Reveal synchronously. Deferring this to rAF meant the canvas stayed
        // invisible wherever rAF is throttled (background tab, non-compositing
        // renderer). Forcing a reflow first lets the CSS transition still run.
        void canvas.offsetWidth;
        canvas.style.opacity = '1';
        canvas.classList.add('is-ready');

        play();                     // animate unless motion is reduced
    }

    // Fonts/layout can shift the hero height after first paint.
    startup();
    window.addEventListener('load', () => {
        if (resize()) frame(performance.now());
    });

    // If the visitor changes their motion preference mid-session, respect it.
    if (reduced.addEventListener) {
        reduced.addEventListener('change', () => (reduced.matches ? stop() : play()));
    }
}

export function initHeroBackgrounds() {
    const hosts = document.querySelectorAll('[data-hero-bg]');
    if (!hosts.length) return;
    hosts.forEach((h) => {
        try {
            initOne(h);
        } catch (e) {
            /* never let a decorative effect break the page */
        }
    });
}
