/* ==========================================================================
   script.js  -  everything the portfolio does
   --------------------------------------------------------------------------
   1. Link buttons      (LinkedIn / GitHub / ArtStation; the addresses are in links.js)
   2. CV reader         (the pop-up that shows your CV pages)
   3. Book animation, navigation, video pop-up and phone layout
   ========================================================================== */

/* ---------- 1. Link buttons ---------- */
document.querySelectorAll("a[data-link]").forEach(function (a) {
  var u = (window.LINKS || {})[a.getAttribute("data-link")];
  if (u) {
    a.href = u;
    a.target = "_blank";
    a.rel = "noopener";
  }
  else {
    a.classList.add("soon");
    a.setAttribute("aria-disabled", "true");
    a.title = "Link coming soon";
    a.addEventListener("click", function (e) {
      e.preventDefault();
    });
  }
});
if (Object.keys(window.LINKS || {}).some(function (k) {
  return window.LINKS[k];
}))
  document.querySelectorAll("p,span,div").forEach(function (n) {
    if (n.children.length === 0 && n.textContent.trim() === "Links will be added here.")
      n.style.display = "none";
  });

/* ---------- 2. CV reader pop-up ---------- */
(function () {
  var cvm = document.getElementById("cvm"), last = null;
  function openCv(from) {
    last = from || document.activeElement;
    cvm.hidden = false;
    requestAnimationFrame(function () {
      cvm.classList.add("on");
    });
    document.documentElement.style.overflow = "hidden";
    cvm.querySelector(".cvpages").scrollTop = 0;
    cvm.querySelector(".cvx").focus();
  }
  function closeCv() {
    cvm.classList.remove("on");
    document.documentElement.style.overflow = "";
    setTimeout(function () {
      cvm.hidden = true;
    }, 250);
    if (last && last.focus)
      last.focus();
  }
  document.querySelectorAll(".mdoc").forEach(function (d) {
    d.addEventListener("click", function () {
      openCv(d);
    });
    d.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openCv(d);
      }
    });
  });
  cvm.addEventListener("click", function (e) {
    if (e.target === cvm)
      closeCv();
  });
  cvm.querySelector(".cvx").addEventListener("click", closeCv);
  addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !cvm.hidden)
      closeCv();
  });
})();

/* ---------- 3. Book animation, navigation, videos, phone layout ---------- */
(function () {
  // ANIMATION DATA. One entry per layer; each matches the element with data-k="name" in index.html.
  //   n = fixed size (or null), z = z-index for each state,
  //   s = one row per state: [a, b, c, d, x, y, width, height, opacity]
  //       (a-d = rotation/scale, x/y = position inside the 1440x800 frame).
  // The four states are: 0 closed book, 1 zoom in, 2 open book (Gallery), 3 Highlights (scrolled).
  var D = {
    "bg": {
      "n": null,
      "z": [1, 1, 5, 1],
      "s": [
        [1, 0, 0, 1, -51, -37, 1584, 907, 1],
        [1, 0, 0, 1, -226.51, -149, 1935, 1108, 1],
        [1, 0, 0, 1, -51, -37, 1584, 907, 1],
        [1, 0, 0, 1, -51, -37, 1584, 907, 1]
      ]
    },
    "gingham": {
      "n": null,
      "z": [10, 10, 10, 10],
      "s": [
        [1, 0, 0, 1, 2083, 269, 1338, 960, 1],
        [1, 0, 0, 1, 1645, 269, 1338, 960, 1],
        [1, 0, 0, 1, 986, 269, 1338, 960, 1],
        [1, 0, 0, 1, 1721, 269, 1338, 960, 1]
      ]
    },
    "big": {
      "n": null,
      "z": [3, 3, 3, 3],
      "s": [
        [-1, 0, 0, 1, 1235.62, 697, 474.24, 287.34, 0],
        [-1, 0, 0, 1, 1235.62, 697, 474.24, 287.34, 0],
        [-1, 0, 0, 1, 1235.62, 697, 474.24, 287.34, 1],
        [1, 0, 0, 1, 614, 300, 758, 479.27, 1]
      ]
    },
    "med": {
      "n": null,
      "z": [3, 3, 3, 3],
      "s": [
        [-1, 0, 0, 1, 1221.23, 848.69, 245.81, 142.16, 0],
        [-1, 0, 0, 1, 1221.23, 848.69, 245.81, 142.16, 0],
        [-1, 0, 0, 1, 1221.23, 848.69, 245.81, 142.16, 1],
        [1, 0, 0, 1, 950, 580, 375, 237.1, 1]
      ]
    },
    "small": {
      "n": null,
      "z": [3, 3, 3, 3],
      "s": [
        [-1, 0, 0, 1, 1066.55, 900.85, 241.62, 142.16, 0],
        [-1, 0, 0, 1, 1066.55, 900.85, 241.62, 142.16, 0],
        [-1, 0, 0, 1, 1066.55, 900.85, 241.62, 142.16, 1],
        [1, 0, 0, 1, 692, 678, 375, 237.1, 1]
      ]
    },
    "card1": {
      "n": null,
      "z": [11, 11, 11, 11],
      "s": [
        [0.5, 0.87, -0.87, 0.5, 1033.52, -1059, 443.23, 515.59, 0],
        [0.5, 0.87, -0.87, 0.5, 1033.52, -1059, 443.23, 515.59, 1],
        [0.5, 0.87, -0.87, 0.5, 1033.52, -127, 443.23, 515.59, 1],
        [0.5, 0.87, -0.87, 0.5, 1033.52, -981, 443.23, 515.59, 1]
      ]
    },
    "strip": {
      "n": null,
      "z": [12, 12, 12, 12],
      "s": [
        [0.99, 0.17, -0.17, 0.99, 512.5, 135.47, 158.65, 613.46, 0],
        [0.99, 0.17, -0.17, 0.99, 512.5, 135.47, 158.65, 613.46, 1],
        [0.99, 0.17, -0.17, 0.99, 512.5, 143.09, 158.65, 613.46, 1],
        [0.99, 0.17, -0.17, 0.99, 512.5, 1213, 158.65, 613.46, 1]
      ]
    },
    "head": {
      "n": [420.28, 95.11],
      "z": [40, 40, 13, 13],
      "s": [
        [0.99, -0.11, 0.11, 0.99, 576.28, 400.36, 263.45, 60.02, 1],
        [0.99, 0.17, -0.17, 0.99, 515.68, 358.05, 420.28, 95.11, 1],
        [0.99, 0.17, -0.17, 0.99, 515.68, 365.66, 420.28, 95.11, 0],
        [0.99, 0.17, -0.17, 0.99, 179.68, 365.66, 420.28, 95.11, 0]
      ]
    },
    "vec": {
      "n": null,
      "z": [20, 20, 20, 20],
      "s": [
        [0.72, -0.69, 0.69, 0.72, 549.9, 391.87, 334.4, 248.89, 1],
        [0.94, -0.33, 0.33, 0.94, 1087.15, 334.57, 830.3, 617.99, 1],
        [0.94, -0.33, 0.33, 0.94, 732.56, 345.28, 533.45, 397.05, 1],
        [0.94, -0.33, 0.33, 0.94, 732.68, 1385.67, 533.45, 397.05, 1]
      ]
    },
    "cov": {
      "n": null,
      "z": [21, 21, 21, 21],
      "s": [
        [0.97, -0.25, 0.25, 0.97, 500.9, 273.1, 365.67, 384.55, 1],
        [0.99, 0.17, -0.17, 0.99, 214.77, -124.77, 1840.5, 954.82, 1],
        [0.99, 0.17, -0.17, 0.99, 172.07, 50.17, 1182.49, 613.46, 1],
        [0.99, 0.17, -0.17, 0.99, 172.07, 1090.55, 1182.49, 613.46, 1]
      ]
    },
    "menu": {
      "n": [468.02, 141.75],
      "z": [22, 22, 22, 22],
      "s": [
        [0.97, -0.25, 0.25, 0.97, 483.92, 439.25, 293.38, 88.86, 0],
        [0.99, 0.17, -0.17, 0.99, 596.11, -191, 728.45, 220.64, 1],
        [0.99, 0.17, -0.17, 0.99, 417.08, 7.61, 468.02, 141.75, 1],
        [0.99, 0.17, -0.17, 0.99, 417.17, 1048, 468.02, 141.75, 1]
      ]
    },
    "lp4": {
      "n": null,
      "z": [23, 23, 23, 23],
      "s": [
        [1, -0.08, 0.18, 0.98, 721.26, 216.92, 169.9, 343.01, 1],
        [-1, -0.05, -0.05, 1, 727.88, 20.37, 638.15, 854.97, 1],
        [-1, -0.05, -0.05, 1, 501.74, 143.41, 410, 549.3, 1],
        [-1, -0.05, -0.05, 1, 501.74, 1183.8, 410, 549.3, 1]
      ]
    },
    "lp1": {
      "n": null,
      "z": [24, 24, 24, 24],
      "s": [
        [-0.97, 0.25, -0.25, -0.97, 977.62, 529.01, 323, 371.76, 1],
        [0.99, 0.17, 0.17, -0.99, -53.05, 812.9, 1224.01, 923.09, 1],
        [0.99, 0.17, 0.17, -0.99, 0, 652.6, 786.41, 593.07, 1],
        [0.99, 0.17, 0.17, -0.99, 0, 1692.99, 786.41, 593.07, 1]
      ]
    },
    "lring": {
      "n": null,
      "z": [27, 27, 27, 27],
      "s": [
        [-0.97, 0.25, 0.25, 0.97, 594.78, 282.48, 6.95, 248.63, 1],
        [0.99, 0.17, -0.17, 0.99, 1234.4, 184.42, 26.34, 617.34, 1],
        [0.99, 0.17, -0.17, 0.99, 827.16, 248.81, 16.92, 396.63, 1],
        [0.99, 0.17, -0.17, 0.99, 827.16, 1289.2, 16.92, 396.63, 1]
      ]
    },
    "rp3": {
      "n": null,
      "z": [23, 23, 23, 23],
      "s": [
        [-0.85, 0.53, 0.49, 0.87, 739.55, 170.78, 271.9, 377.32, 1],
        [0.97, 0.25, -0.25, 0.97, 1411.01, 43.41, 728.65, 941.37, 1],
        [0.97, 0.25, -0.25, 0.97, 940.63, 158.22, 468.15, 604.81, 1],
        [0.97, 0.25, -0.25, 0.97, 940.75, 1198.61, 468.15, 604.81, 1]
      ]
    },
    "rp2": {
      "n": null,
      "z": [24, 24, 24, 24],
      "s": [
        [-0.9, 0.45, 0.42, 0.91, 707.12, 209.02, 263.23, 376.62, 1],
        [0.99, 0.17, -0.17, 0.99, 1349.77, 66.07, 707.61, 937.11, 1],
        [0.99, 0.17, -0.17, 0.99, 901.28, 172.77, 454.63, 602.08, 1],
        [0.99, 0.17, -0.17, 0.99, 901.4, 1213.16, 454.63, 602.08, 1]
      ]
    },
    "ru": {
      "n": null,
      "z": [26, 26, 26, 26],
      "s": [
        [-0.9, 0.45, 0.42, 0.91, 521.03, 282, 43.6, 68.87, 1],
        [0.99, 0.17, -0.17, 0.99, 1801.63, 89.38, 114.76, 170.98, 1],
        [0.99, 0.17, -0.17, 0.99, 1191.59, 187.75, 73.73, 109.85, 1],
        [0.99, 0.17, -0.17, 0.99, 1191.71, 1228.14, 73.73, 109.85, 1]
      ]
    },
    "rring": {
      "n": null,
      "z": [27, 27, 27, 27],
      "s": [
        [-0.9, 0.45, 0.42, 0.91, 737.44, 215.74, 9.8, 248.11, 1],
        [0.99, 0.17, -0.17, 0.99, 1368.71, 161.48, 26.34, 617.34, 1],
        [0.99, 0.17, -0.17, 0.99, 913.45, 234.08, 16.92, 396.63, 1],
        [0.99, 0.17, -0.17, 0.99, 913.57, 1274.46, 16.92, 396.63, 1]
      ]
    },
    "chip": {
      "n": null,
      "z": [60, 60, 60, 60],
      "s": [
        [1, 0, 0, 1, 24, 24, 206.04, 66.23, 1],
        [1, 0, 0, 1, 24, 24, 206.04, 66.23, 1],
        [1, 0, 0, 1, 24, 24, 206.04, 66.23, 1],
        [1, 0, 0, 1, 24, 24, 206.04, 66.23, 1]
      ]
    },
    "main": {
      "n": [731.85, 636.46],
      "z": [30, 30, 30, 30],
      "s": [
        [1, 0, 0, 1, 375, 1276, 731.85, 636.46, 1],
        [1, 0, 0, 1, 733, -26, 1000.92, 870.46, 1],
        [1, 0, 0, 1, 375, 137, 731.85, 636.46, 1],
        [1, 0, 0, 1, 375, 137, 731.85, 636.46, 1]
      ]
    },
    "tree": {
      "n": [196, 116],
      "z": [31, 31, 31, 31],
      "s": [
        [1, 0.01, -0.01, 1, 673.63, 351.94, 123, 72, 0],
        [0.99, 0.16, -0.16, 0.99, 299.29, 161, 394, 232, 1],
        [0.99, 0.16, -0.16, 0.99, 170.15, 173, 196, 116, 1],
        [0.98, -0.22, 0.22, 0.98, -900, 173.78, 310, 182, 1]
      ]
    },
    "ux": {
      "n": [138, 28],
      "z": [32, 32, 32, 32],
      "s": [
        [1, 0.01, -0.01, 1, 699.6, 433.68, 87, 17, 0],
        [0.99, 0.16, -0.16, 0.99, 344.03, 432.62, 277, 55, 1],
        [0.99, 0.16, -0.16, 0.99, 192.38, 308, 138, 28, 1],
        [0.98, -0.22, 0.22, 0.98, -900, 359.27, 218, 44, 1]
      ]
    },
    "wb": {
      "n": null,
      "z": [33, 33, 33, 33],
      "s": [
        [1, 0, 0, 1, 1067.6, 927.15, 191.8, 128.16, 0],
        [1, 0, 0, 1, 1067.6, 927.15, 191.8, 128.16, 1],
        [1, 0, 0, 1, 720, 726, 123.23, 82.34, 1],
        [1, 0, 0, 1, 720, 1766, 123.23, 82.34, 1]
      ]
    },
    "wl": {
      "n": null,
      "z": [34, 34, 34, 34],
      "s": [
        [0.87, -0.5, 0.5, 0.87, 717.22, 414.31, 134.77, 90.05, 0],
        [1, 0, 0, 1, -72, 462, 334.64, 223.6, 1],
        [1, 0, 0, 1, 0, 395, 215, 143.66, 1],
        [1, 0, 0, 1, 0, 1435, 215, 143.66, 1]
      ]
    },
    "pj": {
      "n": [255.21, 320.32],
      "z": [35, 35, 35, 35],
      "s": [
        [0.97, -0.23, 0.23, 0.97, 1002, 2059.16, 255.21, 320.32, 1],
        [0.97, -0.23, 0.23, 0.97, 6420, 405.16, 255.21, 320.32, 1],
        [0.97, -0.23, 0.23, 0.97, 1002, 239.16, 255.21, 320.32, 1],
        [0.97, -0.23, 0.23, 0.97, 1002, 1278.16, 255.21, 320.32, 1]
      ]
    },
    "note": {
      "n": [514, 467.5],
      "z": [36, 36, 36, 36],
      "s": [
        [1, 0, 0, 1, 1042, -942, 514, 467.5, 1],
        [1, 0, 0, 1, 1042, -942, 514, 467.5, 1],
        [1, 0, 0, 1, 1042, -122, 514, 467.5, 1],
        [1, 0, 0, 1, 1042, -942, 514, 467.5, 0]
      ]
    },
    "wf": {
      "n": [324.7, 301.83],
      "z": [37, 37, 37, 37],
      "s": [
        [0.99, 0.15, -0.15, 0.99, 970.24, 2285, 324.7, 301.83, 1],
        [0.99, 0.15, -0.15, 0.99, 7496.24, 461, 324.7, 301.83, 1],
        [0.99, 0.15, -0.15, 0.99, 970.24, 465, 324.7, 301.83, 1],
        [0.99, 0.15, -0.15, 0.99, 970.24, 1505, 324.7, 301.83, 1]
      ]
    },
    "card2": {
      "n": null,
      "z": [38, 38, 38, 38],
      "s": [
        [-0.72, -0.69, -0.69, 0.72, 283.72, 1585.53, 443.23, 515.59, 1],
        [-0.72, -0.69, -0.69, 0.72, 283.72, 1896.53, 443.23, 515.59, 1],
        [-0.72, -0.69, -0.69, 0.72, 283.72, 675.53, 443.23, 515.59, 1],
        [-0.72, -0.69, -0.69, 0.72, 283.72, 1715.53, 443.23, 515.59, 1]
      ]
    },
    "filter": {
      "n": [400.86, 55],
      "z": [39, 39, 39, 39],
      "s": [
        [1, 0, 0, 1, 210.98, 1002, 400.86, 55, 0],
        [0.99, 0.17, -0.17, 0.99, 286.83, 834.15, 623.93, 85.6, 1],
        [0.99, 0.17, -0.17, 0.99, 218.37, 666.25, 400.86, 55, 1],
        [0.99, 0.17, -0.17, 0.99, 218.37, 1706, 400.86, 55, 1]
      ]
    },
    "h2": {
      "n": [489.37, 122.24],
      "z": [15, 15, 15, 15],
      "s": [
        [1, 0, 0, 1, 752.38, 989, 489.37, 122.24, 1],
        [1, 0, 0, 1, 752.38, 989, 489.37, 122.24, 1],
        [1, 0, 0, 1, 752.38, 989, 489.37, 122.24, 1],
        [1, 0, 0, 1, 752.38, 70, 489.37, 122.24, 1]
      ]
    },
    "lorem": {
      "n": [430, 94],
      "z": [15, 15, 15, 15],
      "s": [
        [1, 0, 0, 1, 783, 1111, 430, 94, 1],
        [1, 0, 0, 1, 783, 1111, 430, 94, 1],
        [1, 0, 0, 1, 783, 1111, 430, 94, 1],
        [1, 0, 0, 1, 783, 192, 430, 94, 1]
      ]
    },
    "cov0": {
      "n": null,
      "z": [39, 39, 39, 39],
      "s": [
        [0.97, -0.25, 0.25, 0.97, 500.9, 273.1, 365.67, 384.55, 1],
        [0.99, 0.17, -0.17, 0.99, 214.77, -124.77, 1840.5, 954.82, 0],
        [0.99, 0.17, -0.17, 0.99, 214.77, -124.77, 1840.5, 954.82, 0],
        [0.99, 0.17, -0.17, 0.99, 214.77, -124.77, 1840.5, 954.82, 0]
      ]
    }
  };
  // Page elements used by the animation.
  var hero = document.getElementById("hero"), stage = document.getElementById("stage"), fr = document.getElementById("frame"), hint = document.getElementById("hint");
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches, els = [], S;
  // Turns a data row into position, rotation and scale so layers can blend smoothly between states.
  function norm(s, w, h) {
    var a = s[0], b = s[1], c = s[2], d = s[3], x = s[4], y = s[5];
    if (a * d - b * c < 0) {
      x += c * h;
      y += d * h;
      c = -c;
      d = -d;
    }
    if (Math.abs(Math.atan2(b, a)) > Math.PI / 2) {
      x += a * w + c * h;
      y += b * w + d * h;
      a = -a;
      b = -b;
      c = -c;
      d = -d;
    }
    return { x: x, y: y, r: Math.atan2(b, a), sx: Math.hypot(a, b), sy: Math.hypot(c, d), w: w, h: h, o: s[8] };
  }
  Object.keys(D).forEach(function (k) {
    var e = document.querySelector('[data-k="' + k + '"]'), L = D[k];
    L.st = L.s.map(function (s) {
      return norm(s, s[6], s[7]);
    });
    if (L.n) {
      e.style.width = L.n[0] + "px";
      e.style.height = L.n[1] + "px";
    }
    L.e = e;
    L.k = k;
    els.push(L);
  });
  // Offsets used when you switch tabs (Gallery / About / Contact): layers slide by [x, y] to make room.
  var G = {
    main: [-420, 260],
    tree: [-520, 0],
    ux: [-520, 0],
    pj: [620, 60],
    note: [0, -420],
    wf: [420, 420],
    wb: [0, 420],
    wl: [-420, 40],
    card1: [0, -420],
    card2: [-420, 420],
    filter: [-420, 420]
  }, view = "work", ta = 0;
  els.forEach(function (L) {
    L.v = 1;
    L.ox = 0;
    L.oy = 0;
  });
  // Switches the open book between its Gallery, About and Contact views.
  function go(v) {
    view = v;
    document.querySelectorAll(".tab").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-view") === v);
    });
    ["about", "contact"].forEach(function (n) {
      document.getElementById("v-" + n).classList.toggle("on", v === n);
    });
    if (scrollY > 0 && v !== "work")
      scrollTo({ top: 0, behavior: "smooth" });
  }
  document.querySelectorAll(".tab").forEach(function (b) {
    b.addEventListener("click", function () {
      if (ta < 2)
        return;
      var v = b.getAttribute("data-view");
      if (narrow) {
        var id = { work: "gallery", about: "about", contact: "resume" }[v];
        if (id)
          document.getElementById(id).scrollIntoView({ behavior: "smooth" });
        return;
      }
      go(v);
    });
  });
  // Easing curves: a springy one for the book opening, and two smooth ones for the later steps.
  function spring(u) {
    var w = 10, z = .75, wd = w * Math.sqrt(1 - z * z), t = Math.min(1, u) * 1.15;
    return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + z * w / wd * Math.sin(wd * t));
  }
  function bez(x1, y1, x2, y2) {
    return function (x) {
      var lo = 0, hi = 1, t = x;
      for (var i = 0; i < 18; i++) {
        t = (lo + hi) / 2;
        var cx = 3 * x1 * t * (1 - t) * (1 - t) + 3 * x2 * t * t * (1 - t) + t * t * t;
        if (cx < x)
          lo = t;
        else
          hi = t;
      }
      return 3 * y1 * t * (1 - t) * (1 - t) + 3 * y2 * t * t * (1 - t) + t * t * t;
    };
  }
  var EA = [spring, bez(.33, 0, .2, 1), bez(.45, 0, .2, 1)];
  // Draws the whole animation for time t (0 closed, 1 zoom in, 2 open book, 3 Highlights):
  // places every layer, fades the portrait and stamp images, and updates the hint text.
  function render(t) {
    var i = Math.min(2, Math.floor(t)), u = t - i;
    if (t >= 3) {
      i = 2;
      u = 1;
    }
    var k = EA[i](u), zi = Math.round(t >= 2 ? 2 + k : t);
    els.forEach(function (L) {
      var a = L.st[i], b = L.st[i + 1], e = L.e;
      function m(p) {
        return a[p] + (b[p] - a[p]) * k;
      }
      var dr = b.r - a.r;
      if (dr > Math.PI)
        dr -= 2 * Math.PI;
      if (dr < -Math.PI)
        dr += 2 * Math.PI;
      var w = m("w"), sc = L.n ? w / L.n[0] : 1, r = a.r + dr * k;
      if (!L.n) {
        e.style.width = w + "px";
        e.style.height = m("h") + "px";
      }
      e.style.transform = "translate(" + (m("x") + L.ox) + "px," + (m("y") + L.oy) + "px) rotate(" + r + "rad) scale(" + (m("sx") * sc) + "," + (m("sy") * sc) + ")";
      e.style.opacity = (L.k === "head" ? (t < 1 ? Math.max(0, 1 - t * 3.2) : 0) : (L.k === "chip" ? (started ? 0 : 1) : m("o"))) * L.v;
      e.style.zIndex = L.z[Math.min(3, Math.round(i + (i === 2 && k < .1 ? 0 : k)))];
    });
    stage.classList.toggle("s3", t >= 2.5);
    hint.textContent = started ? "scroll down" : (touch ? "tap the portfolio to open" : "click the portfolio to open");
    curT = t;
    if (narrow)
      place();
    if (!swEls)
      swEls = [].slice.call(document.querySelectorAll(".sw"));
    var kk = Math.min(1, Math.max(0, (t - 1.3) / .6));
    for (var q = 0; q < swEls.length; q++)
      swEls[q].style.opacity = kk;
    hint.classList.toggle("on", !started || (t >= 2 && scrollY < 40));
  }
  var swEls, narrow = false, fs = 1, cxo = 560, cx2 = 1000, curT = 0, touch = matchMedia("(pointer:coarse)").matches;
  var sw = 720, lw = 0, lh = 0, chipL = null;
  // PHONE / TABLET: pans the frame so the part of the book that matters stays on screen.
  function place() {
    var cx = 720;
    if (narrow) {
      var u = Math.min(1, Math.max(0, curT)), v = Math.min(1, Math.max(0, curT - 2));
      cx = 690 + (cxo - 690) * u + (cx2 - cxo) * v;
    }
    fr.style.transform = "translate(" + (-cx * fs) + "px," + (-400 * fs) + "px) scale(" + fs + ")";
    if (!chipL)
      chipL = els.filter(function (L) {
        return L.k === "chip";
      })[0];
    if (chipL)
      chipL.ox = narrow ? (cx - sw / (2 * fs) - 10) : 0;
  }
  // Scales the 1440x800 frame to the screen. On phones and tall tablets it switches to a narrower crop.
  function fit() {
    var w = stage.clientWidth, h0 = innerHeight;
    if (lw && w === lw && Math.abs(h0 - lh) < 130)
      return;
    lw = w;
    lh = h0;
    var nr = w < 760 || h0 > w * 1.15, cw = w < 760 ? 760 : 900;
    if (nr) {
      var sh = Math.round(800 * w / cw), T = Math.max(0, Math.round((h0 - sh) / 2));
      stage.style.height = sh + "px";
      stage.style.top = T + "px";
      hero.style.height = Math.round(sh + T + h0 * 1.05) + "px";
    }
    else {
      stage.style.height = "";
      stage.style.top = "";
      hero.style.height = "";
    }
    var h = stage.clientHeight;
    narrow = nr;
    sw = w;
    cxo = w < 760 ? 560 : 610;
    cx2 = w < 760 ? 1000 : 960;
    fs = nr ? Math.min(w / cw, h / 800) : Math.min(w / 1440, h / 800);
    document.documentElement.classList.toggle("narrow", nr);
    fr.classList.toggle("clip", !nr && h / fs > 830);
    place();
  }
  var t0 = null, started = false, dur = [1533, 900];
  // How far down the intro the page is scrolled (0 to 1).
  function sc() {
    var vh = innerHeight, p = Math.min(1, Math.max(0, scrollY / (vh * .95)));
    return p;
  }
  // Runs every screen refresh: advances the opening animation, then follows the scroll position.
  function frame(now) {
    var el = started ? now - t0 : -1;
    if (reduce)
      ta = started ? 2 : 0;
    else if (el < 0)
      ta = 0;
    else if (el < dur[0])
      ta = el / dur[0];
    else if (el < dur[0] + dur[1])
      ta = 1 + (el - dur[0]) / dur[1];
    else
      ta = 2;
    els.forEach(function (L) {
      var g = G[L.k];
      if (!g)
        return;
      var tg = view === "work" ? 1 : 0;
      L.v += (tg - L.v) * .1;
      if (Math.abs(tg - L.v) < .003)
        L.v = tg;
      L.ox = (1 - L.v) * g[0];
      L.oy = (1 - L.v) * g[1];
    });
    render(view !== "work" ? 2 : (ta < 2 ? ta : 2 + sc()));
    requestAnimationFrame(frame);
  }
  var ob = document.getElementById("openbtn"), nav = document.getElementById("topnav");
  // Starts the animation when the closed book is clicked or tapped.
  function openBook() {
    if (started)
      return;
    started = true;
    document.documentElement.classList.remove("locked");
    t0 = performance.now();
    fr.classList.remove("pop");
    fr.classList.add("opening");
    ob.style.display = "none";
  }
  ob.addEventListener("mouseenter", function () {
    fr.classList.add("pop");
  });
  ob.addEventListener("mouseleave", function () {
    fr.classList.remove("pop");
  });
  ob.addEventListener("focus", function () {
    fr.classList.add("pop");
  });
  ob.addEventListener("blur", function () {
    fr.classList.remove("pop");
  });
  ob.addEventListener("click", openBook);
  nav.querySelectorAll("button").forEach(function (b) {
    b.addEventListener("click", function () {
      var t = b.getAttribute("data-go");
      if (!started)
        return;
      if (narrow && (t === "about" || t === "contact")) {
        document.getElementById(t === "about" ? "about" : "resume").scrollIntoView({ behavior: "smooth" });
        return;
      }
      if (t === "gallery" || t === "videos")
        document.getElementById(t).scrollIntoView({ behavior: "smooth" });
      else {
        go(t);
        scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
  addEventListener("scroll", function () {
    nav.classList.toggle("on", started && scrollY > 60);
  }, { passive: true });
  var modal = document.getElementById("modal"), mcap = document.getElementById("mcap"), lastBtn = null;
  var mv = modal.querySelector(".mvideo"), mvDefault = mv.innerHTML;
  // VIDEO POP-UP: opens a video card in the player (TikTok, YouTube, Instagram or a file).
  function openM(btn) {
    lastBtn = btn;
    var tt = btn.getAttribute("data-tt"), yt = btn.getAttribute("data-yt"), vid = btn.getAttribute("data-vid"), ig = btn.getAttribute("data-ig"), ttl = btn.getAttribute("data-title") || "";
    modal.classList.toggle("vert", !!(tt || vid || ig));
    modal.classList.toggle("ig", !!ig);
    if (tt) {
      mv.innerHTML = '<iframe src="https://www.tiktok.com/player/v1/' + tt + '?rel=0&description=0&music_info=0" allow="fullscreen; autoplay; encrypted-media" allowfullscreen title="' + ttl.replace(/"/g, "") + '"></iframe>';
      mcap.innerHTML = "";
      mcap.appendChild(document.createTextNode(ttl + " · "));
      var a = document.createElement("a");
      a.href = btn.getAttribute("data-url");
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = "Open on TikTok";
      mcap.appendChild(a);
    }
    else if (vid) {
      mv.innerHTML = '<video src="' + vid + '" poster="' + (btn.getAttribute("data-poster") || "") + '" controls autoplay playsinline></video>';
      mcap.textContent = ttl;
    }
    else if (ig) {
      mv.innerHTML = '<iframe src="https://www.instagram.com/reel/' + ig + '/embed/" allow="autoplay; encrypted-media; fullscreen" allowfullscreen title="' + ttl.replace(/"/g, "") + '"></iframe>';
      mcap.innerHTML = "";
      mcap.appendChild(document.createTextNode(ttl + " · "));
      var a3 = document.createElement("a");
      a3.href = btn.getAttribute("data-url");
      a3.target = "_blank";
      a3.rel = "noopener";
      a3.textContent = "Open on Instagram";
      mcap.appendChild(a3);
    }
    else if (yt) {
      mv.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + yt + '?rel=0&autoplay=1" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen title="' + ttl.replace(/"/g, "") + '"></iframe>';
      mcap.innerHTML = "";
      mcap.appendChild(document.createTextNode(ttl + " · "));
      var a2 = document.createElement("a");
      a2.href = btn.getAttribute("data-url");
      a2.target = "_blank";
      a2.rel = "noopener";
      a2.textContent = "Open on YouTube";
      mcap.appendChild(a2);
    }
    else {
      mv.innerHTML = mvDefault;
      mcap.textContent = ttl;
    }
    modal.hidden = false;
    requestAnimationFrame(function () {
      modal.classList.add("on");
    });
    document.body.style.overflow = "hidden";
    modal.querySelector(".mclose").focus();
  }
  // Closes the video pop-up and stops the video.
  function closeM() {
    modal.classList.remove("on");
    setTimeout(function () {
      modal.hidden = true;
      mv.innerHTML = mvDefault;
    }, 300);
    document.body.style.overflow = "";
    if (lastBtn)
      lastBtn.focus();
  }
  document.querySelectorAll(".vcard").forEach(function (b) {
    b.addEventListener("click", function () {
      openM(b);
    });
  });
  try {
    document.querySelectorAll(".vcard[data-tt]").forEach(function (b) {
      var t = b.querySelector(".vthumb");
      if (t.querySelector("img"))
        return;
      fetch("https://www.tiktok.com/oembed?url=" + encodeURIComponent(b.getAttribute("data-url"))).then(function (r) {
        return r.json();
      }).then(function (j) {
        if (!j || !j.thumbnail_url)
          return;
        var i = new Image();
        i.onload = function () {
          var ph = t.querySelector(".vph");
          if (ph)
            ph.remove();
          i.alt = "";
          t.insertBefore(i, t.firstChild);
        };
        i.src = j.thumbnail_url;
      }).catch(function () {
      });
    });
  }
  catch (e) {
  }
  modal.addEventListener("click", function (e) {
    if (e.target === modal || e.target.closest(".mclose"))
      closeM();
  });
  addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden)
      closeM();
  });
  // The page cannot be scrolled until the book has been opened.
  function stopScroll(e) {
    if (!started)
      e.preventDefault();
  }
  addEventListener("wheel", stopScroll, { passive: false });
  addEventListener("touchmove", stopScroll, { passive: false });
  addEventListener("keydown", function (e) {
    if (!started && document.activeElement !== ob && [" ", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "End", "Home"].indexOf(e.key) > -1)
      e.preventDefault();
  });
  if ("scrollRestoration" in history)
    history.scrollRestoration = "manual";
  scrollTo(0, 0);
  fit();
  addEventListener("resize", fit);
  requestAnimationFrame(frame);
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("on");
        io.unobserve(e.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll(".rv").forEach(function (e, i) {
    e.style.transitionDelay = (i % 4) * 70 + "ms";
    io.observe(e);
  });
})();
