/* Pilihan ukuran kertas (A4 atau F4) untuk semua unduhan PDF di Pantau.
   Kertas.pilih(teksTombol) -> Promise: 'A4' | 'F4' | null (dibatalkan).
   Kertas.ukuran(kode, mendatar) -> [lebar, tinggi] dalam poin. Pilihan terakhir diingat di perangkat ini saja. */
(function () {
  var U = {
    A4: { mm: '210 × 297 mm', w: 595.28, h: 841.89 },
    F4: { mm: '215 × 330 mm', w: 609.45, h: 935.43 }
  };
  var KUNCI = 'pantau.kertas', BUKA = false;
  function baca() { try { var v = localStorage.getItem(KUNCI); return v === 'A4' || v === 'F4' ? v : null; } catch (e) { return null; } }
  function simpan(v) { try { localStorage.setItem(KUNCI, v); } catch (e) { } }
  function el(t, c, x) { var n = document.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; }

  function css() {
    if (document.getElementById('kertasCss')) return;
    var s = document.createElement('style'); s.id = 'kertasCss';
    s.textContent =
      '.ktov{position:fixed;inset:0;z-index:2147483000;background:rgba(18,26,47,.45);display:flex;align-items:center;justify-content:center;padding:16px;font-family:inherit}' +
      '.ktb{--kp:var(--pri,#1f5d46);--kbg:#fff;--kfg:#16231c;--kmu:#5b665f;--kln:#d3dad6;--ksoft:#f4f7f5;background:var(--kbg);color:var(--kfg);border-radius:16px;box-shadow:0 18px 50px rgba(10,16,30,.35);width:100%;max-width:440px;padding:22px 22px 18px;box-sizing:border-box}' +
      ':root[data-theme=dark] .ktb{--kbg:#222a26;--kfg:#eef3f0;--kmu:#b4c0b9;--kln:#4a5851;--ksoft:#2c3631}' +
      '@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .ktb{--kbg:#222a26;--kfg:#eef3f0;--kmu:#b4c0b9;--kln:#4a5851;--ksoft:#2c3631}}' +
      '.ktb h3{margin:0 0 4px;font-size:17px;line-height:1.3}.ktb p{margin:0 0 14px;font-size:13px;color:var(--kmu);line-height:1.45}' +
      '.ktop{display:flex;gap:12px}.ktk{flex:1;border:2px solid var(--kln);border-radius:12px;background:transparent;color:inherit;padding:12px 8px 10px;text-align:center;font:inherit;cursor:pointer}' +
      '.ktk[aria-checked=true]{border-color:var(--kp);background:var(--ksoft)}.ktk:focus-visible{outline:3px solid var(--kp);outline-offset:2px}' +
      '.ktk b{display:block;font-size:15px;margin-top:8px}.ktk small{color:var(--kmu);font-size:12px}' +
      '.ktv{margin:0 auto;border:1px solid #9aa59f;background:#fff;position:relative;border-radius:2px}.ktv i{position:absolute;left:10%;right:10%;height:3px;border-radius:2px;background:#cfd6d2;display:block}' +
      '.ktin{display:flex;gap:9px;align-items:center;margin:14px 0 4px;font-size:13px;color:var(--kmu);cursor:pointer}.ktin input{width:17px;height:17px;accent-color:var(--kp)}' +
      '.ktop2{align-items:flex-start;margin:10px 0 0;color:var(--kfg)}.ktop2 input{margin-top:2px}.ktop2 small{color:var(--kmu);font-size:12px}\n' +
      '.ktrw{display:flex;gap:10px;justify-content:flex-end;margin-top:14px}.ktbt{border:1px solid var(--kln);background:transparent;color:inherit;border-radius:10px;padding:10px 18px;font:inherit;font-size:14px;cursor:pointer}' +
      '.ktbt.ok{background:var(--kp);border-color:var(--kp);color:#fff;font-weight:700}.ktbt:focus-visible{outline:3px solid var(--kp);outline-offset:2px}' +
      '@media (max-width:760px){.ktov{align-items:flex-end;padding:0}.ktb{max-width:none;border-radius:18px 18px 0 0;padding:14px 18px calc(18px + env(safe-area-inset-bottom,0px))}' +
      '.ktb:before{content:"";display:block;width:40px;height:4px;border-radius:2px;background:var(--kln);margin:0 auto 12px}.ktrw{flex-direction:column-reverse}.ktbt{width:100%;padding:13px}}';
    document.head.appendChild(s);
  }

  function kertasGambar(tinggi, garis) {
    var v = el('div', 'ktv'); v.style.width = Math.round(tinggi * 0.7) + 'px'; v.style.height = tinggi + 'px';
    for (var i = 0; i < garis; i++) { var g = el('i'); g.style.top = (12 + i * 8) + 'px'; v.appendChild(g); }
    return v;
  }

  function pilih(teks, opsi) {
    css();
    return new Promise(function (selesai) {
      if (BUKA) { selesai(null); return; }
      BUKA = true;
      var asal = document.activeElement, pil = baca() || 'F4', ov = el('div', 'ktov'), b = el('div', 'ktb');
      b.setAttribute('role', 'dialog'); b.setAttribute('aria-modal', 'true'); b.setAttribute('aria-label', 'Pilih ukuran kertas');
      b.appendChild(el('h3', null, 'Pilih ukuran kertas'));
      b.appendChild(el('p', null, 'Isi PDF menyesuaikan kertas yang dipilih. ' + (teks ? teks : '')));
      var op = el('div', 'ktop'), tom = {};
      op.setAttribute('role', 'radiogroup');
      ['A4', 'F4'].forEach(function (k) {
        var t = el('button', 'ktk'); t.type = 'button'; t.setAttribute('role', 'radio');
        t.appendChild(kertasGambar(k === 'A4' ? 79 : 88, k === 'A4' ? 5 : 7));
        t.appendChild(el('b', null, k)); t.appendChild(el('small', null, U[k].mm));
        t.addEventListener('click', function () { pil = k; tampil(); });
        tom[k] = t; op.appendChild(t);
      });
      b.appendChild(op);
      var ops = {};
      (opsi || []).forEach(function (o) {
        var l2 = el('label', 'ktin ktop2'), c2 = el('input'); c2.type = 'checkbox'; c2.checked = !!o.nilai; ops[o.id] = c2;
        var t2 = el('span'); t2.appendChild(document.createTextNode(o.label));
        if (o.ket) { var sm = el('small', null, o.ket); sm.style.display = 'block'; t2.appendChild(sm); }
        l2.appendChild(c2); l2.appendChild(t2); b.appendChild(l2);
      });
      var lb = el('label', 'ktin'), cb = el('input'); cb.type = 'checkbox'; cb.checked = true;
      lb.appendChild(cb); lb.appendChild(el('span', null, 'Ingat pilihan ini di perangkat ini')); b.appendChild(lb);
      var rw = el('div', 'ktrw'), bb = el('button', 'ktbt', 'Batal'), bo = el('button', 'ktbt ok'); bb.type = bo.type = 'button';
      rw.appendChild(bb); rw.appendChild(bo); b.appendChild(rw); ov.appendChild(b);
      function tampil() {
        ['A4', 'F4'].forEach(function (k) { tom[k].setAttribute('aria-checked', k === pil ? 'true' : 'false'); tom[k].tabIndex = k === pil ? 0 : -1; });
        bo.textContent = 'Unduh PDF ' + pil;
      }
      var tut = false;
      function tutup(v) {
        if (tut) return; tut = true;
        document.removeEventListener('keydown', tek, true);
        if (ov.parentNode) ov.parentNode.removeChild(ov);
        try { if (asal && asal.focus && document.contains(asal)) asal.focus(); } catch (x) { }
        BUKA = false;
        if (v && cb.checked) simpan(v);
        if (v && opsi) { var hs = {}; Object.keys(ops).forEach(function (i) { hs[i] = ops[i].checked; }); selesai({ k: v, o: hs }); return; }
        selesai(v);
      }
      function tek(e) {
        if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); tutup(null); return; }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); pil = pil === 'A4' ? 'F4' : 'A4'; tampil(); tom[pil].focus(); return; }
        if (e.key === 'Enter' && !(e.target && e.target.tagName === 'BUTTON' && e.target !== bo)) { e.preventDefault(); e.stopPropagation(); tutup(pil); }
      }
      bb.addEventListener('click', function () { tutup(null); });
      bo.addEventListener('click', function () { tutup(pil); });
      ov.addEventListener('mousedown', function (e) { if (e.target === ov) tutup(null); });
      document.addEventListener('keydown', tek, true);
      document.body.appendChild(ov); tampil(); bo.focus();
    });
  }

  window.Kertas = {
    pilih: pilih,
    ukuran: function (k, mendatar) { var u = U[k] || U.A4; return mendatar ? [u.h, u.w] : [u.w, u.h]; },
    terakhir: function () { return baca() || 'F4'; }
  };
})();
