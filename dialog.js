/* Kotak konfirmasi dan pemberitahuan bersama (pengganti kotak bawaan browser confirm/prompt/alert).
   Dipakai Pantau dan Terima. Tampil di tengah layar (laptop) atau naik dari bawah (HP), mengikuti warna tema aplikasi
   dan mode gelap. Semua fungsi mengembalikan Promise karena kotak ini tidak menghentikan program seperti kotak bawaan.
     tanya(pesan, {ok, judul, bahaya})        -> true bila memilih tombol utama, false bila Batal/Esc
     isi(pesan, {label, nilai, min, ok, rahasia, banyak, kecil}) -> teks yang diisi, atau null bila Batal
     pilih(pesan, [daftar], {ok})              -> nomor pilihan (0, 1, ...) atau -1 bila Batal
     info(pesan, {judul})                       -> menunggu sampai ditutup
   Pesan boleh memakai gaya lama (satu kalimat tanya, atau beberapa baris); judul, isi, dan label tombol disusun otomatis. */
(function () {
  if (window.Dlg) return;
  var CSS = '' +
    '.dlgov{position:fixed;left:0;right:0;top:0;bottom:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;background:rgba(12,22,17,.52);-webkit-tap-highlight-color:transparent;animation:dlgf .14s ease-out}' +
    '.dlgov *{box-sizing:border-box}' +
    '.dlg{--dp:var(--pri,#1f5d46);--dbg:#fff;--dfg:#16231c;--dmu:#4a5a51;--dln:#b9c5be;--dbad:#b3261e;--dsoft:#f1f4f2;--dic:#e3f1ea;' +
    'width:100%;max-width:400px;max-height:calc(100vh - 32px);overflow:auto;background:var(--dbg);color:var(--dfg);border-radius:16px;padding:22px 22px 18px;box-shadow:0 14px 40px rgba(10,25,18,.32);font:14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;animation:dlgu .16s ease-out}' +
    ':root[data-theme=dark] .dlg{--dbg:#222a26;--dfg:#eef3f0;--dmu:#b4c0b9;--dln:#4a5851;--dbad:#d9463d;--dsoft:#2c3631;--dic:#2a3a33}' +
    '@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .dlg{--dbg:#222a26;--dfg:#eef3f0;--dmu:#b4c0b9;--dln:#4a5851;--dbad:#d9463d;--dsoft:#2c3631;--dic:#2a3a33}}' +
    '.dlg .dic{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:12px;background:var(--dic);color:var(--dp)}' +
    '.dlg.bhy .dic{background:rgba(179,38,30,.13);color:var(--dbad)}' +
    '.dlg h2{margin:0 0 6px;font-size:17px;line-height:1.3;font-weight:700;color:var(--dfg)}' +
    '.dlg .dbd{margin:0;color:var(--dmu);white-space:pre-line;overflow-wrap:anywhere}' +
    '.dlg .dlb{display:block;margin:14px 0 6px;font-size:13px;font-weight:600;color:var(--dfg)}' +
    '.dlg .din{width:100%;font:inherit;font-size:15px;padding:10px 12px;min-height:44px;border:1px solid var(--dln);border-radius:10px;background:var(--dbg);color:var(--dfg)}' +
    '.dlg textarea.din{min-height:84px;resize:vertical}' +
    '.dlg .din:focus{outline:2px solid var(--dp);outline-offset:1px}' +
    '.dlg .der{min-height:18px;margin:6px 0 0;font-size:13px;color:var(--dbad)}' +
    '.dlg .dls{margin:12px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px;max-height:46vh;overflow:auto}' +
    '.dlg .dls button{width:100%;text-align:left;font:inherit;padding:10px 12px;min-height:44px;border:1px solid var(--dln);border-radius:10px;background:var(--dbg);color:var(--dfg);cursor:pointer}' +
    '.dlg .dls button:hover,.dlg .dls button:focus{border-color:var(--dp);outline:none;box-shadow:0 0 0 2px var(--dp) inset}' +
    '.dlg .drw{display:flex;justify-content:flex-end;gap:8px;margin-top:18px}' +
    '.dlg .dbt{font:inherit;font-size:14px;font-weight:600;border-radius:10px;padding:0 18px;min-height:44px;cursor:pointer;border:1px solid var(--dln);background:var(--dbg);color:var(--dfg)}' +
    '.dlg .dbt.dok{background:var(--dp);border-color:var(--dp);color:#fff}' +
    '.dlg.bhy .dbt.dok{background:var(--dbad);border-color:var(--dbad)}' +
    '.dlg .dbt:focus-visible{outline:2px solid var(--dp);outline-offset:2px}' +
    '.dlg .dbt:disabled{opacity:.5;cursor:default}' +
    '@media (max-width:560px){.dlgov{align-items:flex-end;padding:0}' +
    '.dlg{max-width:none;border-radius:22px 22px 0 0;padding:14px 20px calc(22px + env(safe-area-inset-bottom,0px));animation:dlgs .2s ease-out}' +
    '.dlg::before{content:"";display:block;width:40px;height:4px;border-radius:2px;background:var(--dln);margin:0 auto 14px}' +
    '.dlg .drw{flex-direction:column-reverse}.dlg .dbt{width:100%;min-height:48px;font-size:15px}}' +
    '@keyframes dlgf{from{opacity:0}to{opacity:1}}@keyframes dlgu{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}' +
    '@keyframes dlgs{from{transform:translateY(40px);opacity:.6}to{transform:none;opacity:1}}' +
    '@media (prefers-reduced-motion:reduce){.dlgov,.dlg{animation:none}}';

  var ANTRI = [], BUKA = false;
  function gaya() {
    if (document.getElementById('dlgcss')) return;
    var s = document.createElement('style'); s.id = 'dlgcss'; s.textContent = CSS; (document.head || document.documentElement).appendChild(s);
  }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  var IKON = {
    n: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>',
    b: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>',
    k: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>'
  };

  /* menyusun judul dan isi dari pesan gaya lama */
  function pecah(msg) {
    var t = String(msg == null ? '' : msg).replace(/\r/g, '').trim(), judul = t, isi = '';
    if (t.indexOf('\n') >= 0) {
      var i = t.indexOf('\n'); judul = t.slice(0, i).replace(/:\s*$/, ''); isi = t.slice(i).replace(/^\s+/, '');
    } else {
      var k = t.replace(/([.?!])\s+/g, '$1\u0001').split('\u0001');
      if (k.length > 1) {
        var ak = k[k.length - 1], aw = k[0];
        if (/\?$/.test(ak) && ak.length <= 48) { judul = ak; isi = k.slice(0, -1).join(' '); }
        else if (/\?$/.test(aw)) { judul = aw; isi = k.slice(1).join(' '); }
        else if (k.length === 2 && aw.length <= 90) { judul = aw; isi = k[1]; }
      }
    }
    return { judul: judul, isi: isi };
  }
  var KATA_OK = { hapus: 'Hapus', nonaktifkan: 'Nonaktifkan', aktifkan: 'Aktifkan', keluar: 'Keluar', pulihkan: 'Pulihkan', simpan: 'Simpan', buat: 'Buat', tandai: 'Tandai', samakan: 'Samakan', pakai: 'Pakai', selesaikan: 'Selesaikan', batalkan: 'Batalkan', ubah: 'Ubah', catat: 'Catat', konfirmasi: 'Lanjutkan', kosongkan: 'Kosongkan', kirim: 'Kirim', tetap: 'Tetap simpan' };
  function labelOk(msg) {
    var m = /^\s*([A-Za-zÀ-ÿ]+)/.exec(msg); var w = m ? m[1].toLowerCase() : '';
    return KATA_OK[w] || 'Lanjutkan';
  }
  function bahayaOtomatis(msg) {
    return /^\s*(hapus|nonaktifkan|kosongkan|batalkan|pulihkan|selesaikan dan kunci)/i.test(msg) || /tidak (dapat|bisa) (dibatalkan|diubah lagi)|dihapus|berhenti berlaku|diganti\b/i.test(msg);
  }

  function jalan() {
    if (BUKA || !ANTRI.length) return;
    BUKA = true; var q = ANTRI.shift(); tampil(q);
  }
  function tampil(q) {
    gaya();
    var asal = document.activeElement, ov = el('div', 'dlgov'), d = el('div', 'dlg' + (q.bahaya ? ' bhy' : ''));
    d.setAttribute('role', q.bahaya ? 'alertdialog' : 'dialog'); d.setAttribute('aria-modal', 'true');
    var id = 'dlg' + Date.now();
    var ic = el('div', 'dic'); ic.innerHTML = q.bahaya ? IKON.b : (q.ikon === 'k' ? IKON.k : IKON.n); d.appendChild(ic);
    var h = el('h2', null, q.judul); h.id = id + 't'; d.appendChild(h); d.setAttribute('aria-labelledby', h.id);
    if (q.isi) { var p = el('p', 'dbd', q.isi); p.id = id + 'd'; d.appendChild(p); d.setAttribute('aria-describedby', p.id); }
    var inp = null, er = null, daftar = null;
    if (q.jenis === 'isi') {
      var lb = el('label', 'dlb', q.label || 'Isian'); lb.htmlFor = id + 'i'; d.appendChild(lb);
      inp = q.banyak ? el('textarea', 'din') : el('input', 'din'); inp.id = id + 'i';
      if (!q.banyak) inp.type = q.rahasia ? 'password' : 'text';
      inp.value = q.nilai || ''; if (q.kecil) inp.placeholder = q.kecil;
      if (q.rahasia) inp.autocomplete = 'new-password'; else inp.autocomplete = 'off';
      d.appendChild(inp); er = el('p', 'der'); er.setAttribute('role', 'alert'); d.appendChild(er);
    }
    var tut = false;
    function selesai(v) {
      if (tut) return; tut = true;
      document.removeEventListener('keydown', tek, true);
      if (ov.parentNode) ov.parentNode.removeChild(ov);
      try { if (asal && asal.focus && document.contains(asal)) asal.focus(); } catch (x) {}
      BUKA = false; q.sel(v); jalan();
    }
    function kirim() {
      if (q.jenis === 'isi') {
        var v = inp.value; if (!q.banyak && !q.rahasia) v = v.trim(); else if (q.banyak) v = v.trim();
        if (q.min && v.length < q.min) { er.textContent = q.min === 1 ? 'Isian ini wajib diisi.' : 'Tulis minimal ' + q.min + ' karakter.'; inp.focus(); return; }
        selesai(v);
      } else selesai(true);
    }
    function batal() { selesai(q.jenis === 'isi' ? null : (q.jenis === 'pilih' ? -1 : false)); }
    var rw = el('div', 'drw'), bb = null, bo = null;
    if (q.jenis === 'pilih') {
      var ul = el('ul', 'dls'); q.daftar.forEach(function (t, i) {
        var li = el('li'), b = el('button', null, t); b.type = 'button'; b.addEventListener('click', function () { selesai(i); }); li.appendChild(b); ul.appendChild(li);
      }); d.appendChild(ul);
      bb = el('button', 'dbt', 'Batal'); bb.type = 'button'; bb.addEventListener('click', batal); rw.appendChild(bb);
    } else if (q.jenis === 'info') {
      bo = el('button', 'dbt dok', q.ok || 'Mengerti'); bo.type = 'button'; bo.addEventListener('click', kirim); rw.appendChild(bo);
    } else {
      bb = el('button', 'dbt', 'Batal'); bb.type = 'button'; bb.addEventListener('click', batal);
      bo = el('button', 'dbt dok', q.ok); bo.type = 'button'; bo.addEventListener('click', kirim);
      rw.appendChild(bb); rw.appendChild(bo);
    }
    d.appendChild(rw); ov.appendChild(d);
    function tek(e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); if (q.jenis === 'info') kirim(); else batal(); return; }
      if (e.key === 'Enter' && !(e.target && (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON'))) {
        if (q.jenis === 'pilih') return; e.preventDefault(); e.stopPropagation(); kirim(); return;
      }
      if (e.key === 'Tab') {
        var f = Array.prototype.filter.call(d.querySelectorAll('button,input,textarea'), function (x) { return !x.disabled && x.offsetParent !== null; });
        if (!f.length) return; var a = document.activeElement, i = f.indexOf(a);
        if (e.shiftKey && (i <= 0)) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && (i === f.length - 1 || i < 0)) { e.preventDefault(); f[0].focus(); }
      }
    }
    document.addEventListener('keydown', tek, true);
    document.body.appendChild(ov);
    /* fokus awal: isian bila ada; tindakan berbahaya mulai dari Batal supaya Enter tidak langsung menghapus */
    try { (inp || (q.bahaya && bb) || bo || bb || d.querySelector('button')).focus(); if (inp && inp.select && inp.value) inp.select(); } catch (x) {}
  }
  function antri(q) { return new Promise(function (ok) { q.sel = ok; ANTRI.push(q); jalan(); }); }

  window.Dlg = {
    tanya: function (msg, o) {
      o = o || {}; var t = o.judul ? { judul: o.judul, isi: String(msg || '') } : pecah(msg);
      var bhy = o.bahaya != null ? !!o.bahaya : bahayaOtomatis(String(msg || ''));
      return antri({ jenis: 'tanya', judul: t.judul, isi: t.isi, ok: o.ok || labelOk(String(msg || '')), bahaya: bhy, ikon: /^\s*keluar/i.test(String(msg || '')) ? 'k' : 'n' });
    },
    isi: function (msg, o) {
      o = o || {}; var t = pecah(msg);
      return antri({ jenis: 'isi', judul: o.judul || t.judul, isi: o.judul ? String(msg || '') : t.isi, label: o.label, nilai: o.nilai, min: o.min == null ? 0 : o.min, ok: o.ok || 'Simpan', rahasia: !!o.rahasia, banyak: !!o.banyak, kecil: o.kecil, bahaya: !!o.bahaya });
    },
    pilih: function (msg, daftar, o) {
      o = o || {}; var t = pecah(msg);
      return antri({ jenis: 'pilih', judul: o.judul || t.judul, isi: o.judul ? String(msg || '') : t.isi, daftar: daftar || [] });
    },
    info: function (msg, o) {
      o = o || {}; var t = o.judul ? { judul: o.judul, isi: String(msg || '') } : pecah(msg);
      return antri({ jenis: 'info', judul: t.judul, isi: t.isi, ok: o.ok, bahaya: !!o.bahaya });
    }
  };
  window.tanya = window.Dlg.tanya; window.isi = window.Dlg.isi; window.pilih = window.Dlg.pilih;
  /* alert() lama: tidak menghentikan program, jadi cukup tampil sebagai pemberitahuan */
  window.alert = function (m) { window.Dlg.info(m, /gagal|tidak bisa|salah|ditolak|diblokir|error/i.test(String(m)) ? { bahaya: true } : {}); };
})();
