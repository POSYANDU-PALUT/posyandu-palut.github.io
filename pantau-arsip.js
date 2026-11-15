/* Arsip SIPD (Pantau, Honor): menyimpan hasil "Gabung PDF untuk SIPD" di dalam Chrome komputer ini (IndexedDB),
   menyalin ke folder pilihan (Chrome/Edge di komputer) dan ke flashdisk, serta menampilkan daftarnya.
   Menghapus arsip Pantau meminta kata sandi admin utama. Berkas tidak pernah dikirim ke internet. */
(function () {
  'use strict';
  if (window.ARSIP) return;
  var DBN = 'pantau-arsip', TB = 'berkas', TP = 'pengaturan';
  var BLN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  function e(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function mb(b) { return b >= 1073741824 ? (b / 1073741824).toFixed(1).replace('.', ',') + ' GB' : b >= 1048576 ? (b / 1048576).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }
  function tgl(t) { var d = new Date(t); return d.getDate() + ' ' + BLN[d.getMonth()] + ' ' + d.getFullYear(); }
  function pesanGalat(er) {
    var n = er && er.name;
    if (n === 'QuotaExceededError') return 'Ruang penyimpanan Chrome penuh. Hapus arsip lama atau kosongkan ruang di komputer.';
    return (er && er.message) || String(er);
  }

  /* ---------- IndexedDB ---------- */
  function buka() {
    return new Promise(function (res, rej) {
      if (!window.indexedDB) return rej(new Error('Browser ini tidak mendukung penyimpanan arsip.'));
      var r;
      try { r = indexedDB.open(DBN, 1); } catch (x) { return rej(new Error('Penyimpanan arsip tidak bisa dibuka (mode penyamaran?).')); }
      r.onupgradeneeded = function () { var d = r.result; if (!d.objectStoreNames.contains(TB)) d.createObjectStore(TB, { keyPath: 'id' }); if (!d.objectStoreNames.contains(TP)) d.createObjectStore(TP, { keyPath: 'k' }); };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error || new Error('Penyimpanan arsip tidak bisa dibuka.')); };
    });
  }
  function jalan(toko, mode, fn) {
    return buka().then(function (db) {
      return new Promise(function (res, rej) {
        var t = db.transaction(toko, mode), s = t.objectStore(toko), out;
        var rq = fn(s); if (rq) rq.onsuccess = function () { out = rq.result; };
        t.oncomplete = function () { db.close(); res(out); };
        t.onabort = t.onerror = function () { db.close(); rej(t.error || new Error('Penyimpanan arsip gagal.')); };
      });
    });
  }
  function semua() { return jalan(TB, 'readonly', function (s) { return s.getAll(); }).then(function (a) { return (a || []).sort(function (x, y) { return y.dibuat - x.dibuat; }); }); }
  function ambil(id) { return jalan(TB, 'readonly', function (s) { return s.get(id); }); }
  function taruh(rec) { return jalan(TB, 'readwrite', function (s) { return s.put(rec); }); }
  function kabar() { try { window.dispatchEvent(new Event('arsip-berubah')); } catch (x) {} }
  function hapus(id) { return jalan(TB, 'readwrite', function (s) { return s.delete(id); }).then(function (r) { kabar(); return r; }); }
  function perbarui(id, patch) { return ambil(id).then(function (r) { if (!r) return; for (var k in patch) r[k] = patch[k]; return taruh(r); }); }
  function jumlah() { return jalan(TB, 'readonly', function (s) { return s.count(); }); }
  function simpanSet(k, v) { return jalan(TP, 'readwrite', function (s) { return s.put({ k: k, v: v }); }); }
  function bacaSet(k) { return jalan(TP, 'readonly', function (s) { return s.get(k); }).then(function (r) { return r ? r.v : null; }); }

  /* ---------- folder ---------- */
  var dukungFolder = typeof window.showDirectoryPicker === 'function' && !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
  function folderTersimpan() { return dukungFolder ? bacaSet('folder').catch(function () { return null; }) : Promise.resolve(null); }
  async function pilihFolder() {
    var h;
    try { h = await window.showDirectoryPicker({ mode: 'readwrite', id: 'arsip-sipd' }); }
    catch (er) { if (er && er.name === 'AbortError') return null; throw er; }
    try { await simpanSet('folder', h); } catch (x) {}
    return h;
  }
  async function izinFolder(h, minta) {
    if (!h) return false;
    var o = { mode: 'readwrite' };
    try {
      if ((await h.queryPermission(o)) === 'granted') return true;
      if (minta && (await h.requestPermission(o)) === 'granted') return true;
    } catch (x) {}
    return false;
  }
  async function namaBebas(h, nama) {
    var dasar = nama.replace(/\.pdf$/i, ''), n = 0, cand = nama;
    for (;;) {
      try { await h.getFileHandle(cand); n++; cand = dasar + ' (' + n + ').pdf'; if (n > 99) return cand; }
      catch (er) { if (er && er.name === 'NotFoundError') return cand; throw er; }
    }
  }
  async function tulisFolder(h, nama, blob) {
    var n = await namaBebas(h, nama), fh = await h.getFileHandle(n, { create: true }), w = await fh.createWritable();
    try { await w.write(blob); await w.close(); } catch (er) { try { await w.abort(); } catch (x) {} throw er; }
    return n;
  }

  /* ---------- ruang ---------- */
  async function ruang() {
    var o = { pakai: 0, kuota: 0, tetap: false };
    try { if (navigator.storage && navigator.storage.estimate) { var s = await navigator.storage.estimate(); o.pakai = s.usage || 0; o.kuota = s.quota || 0; } } catch (x) {}
    try { if (navigator.storage && navigator.storage.persisted) o.tetap = await navigator.storage.persisted(); } catch (x) {}
    return o;
  }
  async function mintaTetap() { try { if (navigator.storage && navigator.storage.persist) return await navigator.storage.persist(); } catch (x) {} return false; }

  /* ---------- simpan ---------- */
  async function simpan(per, label, nama, blob, folderOk) {
    var rec = { id: 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), per: per || '', label: label || '', nama: nama, blob: blob, ukuran: blob.size, dibuat: Date.now(), folder: !!folderOk, flash: false };
    await taruh(rec); mintaTetap(); kabar();
    return rec.id;
  }

  /* ---------- kata sandi admin ---------- */
  async function cekSandi(s) {
    if (!window.CRED || typeof window.jsonp !== 'function') throw new Error('Belum masuk ke Pantau.');
    var r = await window.jsonp({ aksi: 'profil', u: window.CRED.u, p: s }, 30000);
    return !!(r && r.ok && r.peran === 'utama');
  }

  /* ---------- dialog daftar arsip ---------- */
  function unduhBlob(blob, nama) {
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nama; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 8000);
  }
  async function dialog() {
    var PX = window.PX, w = document.createElement('div'); w.className = 'v2m arsip';
    PX.bukaModal('Arsip SIPD', w);
    var h = null, daftar = [];
    async function gambar() {
      daftar = await semua(); h = await folderTersimpan();
      var rg = await ruang(), izin = h ? await izinFolder(h, false) : false, total = daftar.reduce(function (a, x) { return a + x.ukuran; }, 0);
      var warn = rg.kuota && rg.kuota - rg.pakai < 1073741824;
      var fl = !dukungFolder ? '<span class="mu sm">Salinan ke folder hanya bisa dari Chrome/Edge di komputer.</span>'
        : h ? '<span class="arf"><b>Folder:</b> ' + e(h.name) + (izin ? ' <span class="pl g">siap</span>' : ' <span class="pl a">perlu izin</span>') + '</span><button class="bt out sm" type="button" data-ar="folder">Ganti folder</button>'
        : '<span class="arf mu">Belum ada folder salinan.</span><button class="bt out sm" type="button" data-ar="folder">Pilih folder</button>';
      w.innerHTML = '<p class="mu sm">Hasil “Gabung PDF untuk SIPD” yang disimpan di Chrome komputer ini. Menghapus arsip meminta kata sandi admin.</p>' +
        '<div class="arbar">' + fl + (dukungFolder && daftar.length ? '<button class="bt out sm" type="button" data-ar="flash">Salin semua ke flashdisk</button>' : '') + '</div>' +
        (daftar.length ? '<div class="arl">' + daftar.map(function (x) {
          return '<div class="ari" data-id="' + e(x.id) + '"><div class="arn"><b>' + e(x.label || x.nama) + '</b><small>Dibuat ' + tgl(x.dibuat) + ' · ' + mb(x.ukuran) + '</small>' +
            '<span class="art">' + (x.folder ? '<span class="pl g">Folder ✓</span>' : '<span class="pl a">Belum ke folder</span>') + (x.flash ? '<span class="pl g">Flashdisk ✓</span>' : '') + '</span></div>' +
            '<div class="ara"><button class="bt out sm" type="button" data-ar="buka">Buka</button><button class="bt out sm" type="button" data-ar="unduh">Unduh</button>' +
            (!x.folder && h ? '<button class="bt out sm" type="button" data-ar="kefolder">Salin ke folder</button>' : '') +
            '<button class="bt out sm" type="button" data-ar="hapus" aria-label="Hapus (butuh kata sandi)">🔒 Hapus</button></div></div>';
        }).join('') + '</div>' : '<p class="aro">Belum ada arsip. Arsip muncul di sini setelah Anda memakai “Gabung PDF untuk SIPD” dengan pilihan Arsip Pantau.</p>') +
        '<p class="mu sm arst">Terpakai di Pantau: <b>' + mb(total) + '</b>' + (rg.kuota ? ' · sisa ruang Chrome sekitar ' + mb(Math.max(0, rg.kuota - rg.pakai)) : '') + (rg.tetap ? ' · dilindungi dari pembersihan otomatis' : '') + '</p>' +
        (warn ? '<div class="warnb">Ruang penyimpanan hampir habis. Salin arsip lama ke folder atau flashdisk, lalu hapus dari Pantau.</div>' : '') +
        '<div class="mf"><div class="sp"></div><button class="bt pri" type="button" data-ar="tutup">Tutup</button></div>';
    }
    async function aksi(b) {
      var d = b.dataset.ar, it = b.closest('.ari'), id = it && it.dataset.id, rec = id && daftar.filter(function (x) { return x.id === id; })[0];
      if (d === 'tutup') return PX.tutupModal();
      if (d === 'folder') { var nh = await pilihFolder(); if (nh) { await izinFolder(nh, true); PX.toast('Folder salinan: ' + nh.name); } return gambar(); }
      if (d === 'buka' || d === 'unduh') {
        var r = await ambil(id); if (!r) throw new Error('Arsip tidak ditemukan.');
        if (d === 'unduh') return unduhBlob(r.blob, r.nama);
        var u = URL.createObjectURL(r.blob), win = window.open(u, '_blank'); if (!win) unduhBlob(r.blob, r.nama); setTimeout(function () { URL.revokeObjectURL(u); }, 120000); return;
      }
      if (d === 'kefolder') {
        if (!(await izinFolder(h, true))) throw new Error('Izin ke folder belum diberikan. Klik “Ganti folder” lalu pilih folder lagi.');
        var r2 = await ambil(id), nm = await tulisFolder(h, r2.nama, r2.blob); await perbarui(id, { folder: true }); PX.toast('Tersalin ke folder: ' + nm); return gambar();
      }
      if (d === 'flash') {
        var fh; try { fh = await window.showDirectoryPicker({ mode: 'readwrite', id: 'arsip-flash' }); } catch (er) { if (er && er.name === 'AbortError') return; throw er; }
        var dl = window.Dlg.sibuk('Menyalin ke flashdisk…', { lama: true }), n = 0;
        try {
          for (var i = 0; i < daftar.length; i++) {
            dl.info((i + 1) + ' dari ' + daftar.length + ': ' + daftar[i].nama); dl.persen(i / daftar.length * 100);
            var rr = await ambil(daftar[i].id); await tulisFolder(fh, rr.nama, rr.blob); await perbarui(daftar[i].id, { flash: true }); n++;
          }
        } finally { dl(); }
        PX.toast(n + ' arsip tersalin ke ' + fh.name + '.'); return gambar();
      }
      if (d === 'hapus') {
        var s = await window.Dlg.isi('Hapus arsip ' + (rec.label || rec.nama) + ' dari Pantau?\nSalinan di folder atau flashdisk tidak ikut terhapus. Masukkan kata sandi admin untuk melanjutkan.', { label: 'Kata sandi admin', ok: 'Hapus arsip', rahasia: true, min: 1 });
        if (s == null) return;
        var ok = false; try { ok = await cekSandi(s); } catch (er) { throw new Error('Tidak bisa memeriksa kata sandi: ' + er.message); }
        if (!ok) throw new Error('Kata sandi salah. Arsip tidak dihapus.');
        await hapus(id); PX.toast('Arsip dihapus dari Pantau.'); return gambar();
      }
    }
    w.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-ar]'); if (!b || b.disabled) return; b.disabled = true;
      aksi(b).catch(function (er) { window.Dlg.info(pesanGalat(er), { bahaya: true }); }).then(function () { b.disabled = false; });
    });
    try { await gambar(); } catch (er) { w.innerHTML = '<p class="warnb">' + e(pesanGalat(er)) + '</p>'; }
  }

  window.ARSIP = { dukungFolder: dukungFolder, folderTersimpan: folderTersimpan, pilihFolder: pilihFolder, izinFolder: izinFolder, tulisFolder: tulisFolder, simpan: simpan, semua: semua, jumlah: jumlah, ruang: ruang, dialog: dialog, cekSandi: cekSandi, mb: mb, pesanGalat: pesanGalat, unduhBlob: unduhBlob };
})();
