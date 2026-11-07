/* ===== Pantau Laporan Posyandu - tampilan baru (v2), November 2026 =====
   Hanya lapisan tampilan. Semua data, hitungan, dan panggilan server tetap memakai
   fungsi lama di pantau.html dan pantau-ext.js (lewat window.PX). */
(function () {
'use strict';
var $ = function (id) { return document.getElementById(id); };
var I = {
 home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
 chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
 pos: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
 gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
 bell: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
 sync: '<path d="M21 12a9 9 0 0 1-15.5 6.3M3 12A9 9 0 0 1 18.5 5.7M19 2v4h-4M5 22v-4h4"/>',
 down: '<path d="m6 9 6 6 6-6"/>', right: '<path d="m9 18 6-6-6-6"/>', left: '<path d="m15 18-6-6 6-6"/>',
 search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
 dl: '<path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14"/>',
 file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
 wa: '<path d="M21 11.5a8.4 8.4 0 0 1-12.6 7.3L3 21l2.3-5.2A8.4 8.4 0 1 1 21 11.5z"/>',
 dots: '<circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/>',
 check: '<path d="M20 6 9 17l-5-5"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>',
 clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
 box: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
 alert: '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
 plus: '<path d="M12 5v14M5 12h14"/>', share: '<path d="M4 12v8h16v-8M16 6l-4-4-4 4M12 2v13"/>',
 user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
 cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
 shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
 db: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
 out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
 moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
 menu: '<path d="M3 6h18M3 12h18M3 18h18"/>', edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
 qr: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>',
 lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
 eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'
};
function ic(n, c) { return '<svg class="i ' + (c || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + (I[n] || '') + '</svg>'; }
function e(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function B3(i) { return BULAN[i].slice(0, 3); }

/* ---------- keadaan tampilan ---------- */
var S = { pg: 'b', per: null, tab: 'semua', q: '', kel: '', jn: '', pil: {}, hal: 1, laci: null, ps: 'j', rkJ: 'b', dq: '', dk: '', dj: '', ds: 'a', menu: null, modal: null, simpan: {} };
var root = null, jadwalT = 0;
var PER_HAL = 12;

function px() { return window.PX; }
function per() { return S.per || PX.periodeAktif(new Date()); }
function op() { return PX.isOp(); }
function utama() { return PX.utama(); }
function hp() { return window.matchMedia && matchMedia('(max-width:760px)').matches; }

/* ---------- data per baris ---------- */
function data(pr) {
  var h = PX.hitung(pr.th, pr.bl), k = PX.perKey(pr), M = PX.SETOR[k], V = PX.SETOR_VIA[k] || {}, peralihan = PX.fisikSaja();
  var rows = h.rows.map(function (r) {
    var tg = M ? M[r.p.id] : '', st;
    if (op()) st = r.d ? (tg ? 'lengkap' : 'mfisik') : (tg ? 'fsaja' : 'belum');
    else if (tg && r.d) st = 'lengkap';
    else if (tg) st = peralihan ? 'fsaja' : 'mdig';
    else if (r.d) st = 'mfisik';
    else st = 'belum';
    return { r: r, p: r.p, d: r.d, tg: tg || '', via: V[r.p.id] || '', st: st, telat: (r.st === 'lewat' || r.st === 'telat') && st !== 'lengkap' && st !== 'fsaja', resmi: op() ? !!r.d : PX.fisikOK(r, pr) };
  });
  return { h: h, rows: rows, M: M, ada: !!M || op(), k: k };
}
var URUT = { mfisik: 0, fsaja: 1, mdig: 2, belum: 3, lengkap: 4 };
function urut(a, b) { return URUT[a.st] - URUT[b.st] || KEL.indexOf(a.p.kel) - KEL.indexOf(b.p.kel) || a.p.jenis.localeCompare(b.p.jenis) || a.p.nama.localeCompare(b.p.nama); }
function jn(p) { return p.jenis === 'Posyandu Lansia' ? 'Lansia' : 'Balita'; }
function tglD(d) {
  var m = /^(\d\d)\/(\d\d)\/(\d{4})(?: (\d\d):(\d\d))?/.exec((d && d.tk) || ''); if (!m) return 'Terkirim';
  return (+m[1]) + ' ' + B3(+m[2] - 1) + (m[4] ? ', ' + m[4] + '.' + m[5] : '');
}
function tglF(s) { var p = String(s || '').split('-'); return p.length === 3 ? (+p[2]) + ' ' + B3(+p[1] - 1) : s; }
function bar(v, n, c) { return '<div class="bar"><i class="' + c + '" style="width:' + (n ? Math.round(v * 1000 / n) / 10 : 0) + '%"></i></div>'; }
function pill(st) {
  return { lengkap: '<span class="pl g">' + (op() ? 'Sudah kirim' : 'Lengkap') + '</span>', mfisik: '<span class="pl a">' + (op() ? 'Siap diantar' : 'Menunggu berkas fisik') + '</span>',
    fsaja: '<span class="pl b">Fisik diterima · digital menyusul</span>', mdig: '<span class="pl b">Fisik diterima · menunggu digital</span>', belum: '<span class="pl n">Belum masuk</span>' }[st];
}
function pillHp(st) { return pill(st).replace('Menunggu berkas fisik', 'Tunggu fisik').replace('Fisik diterima · digital menyusul', 'Fisik saja').replace('Fisik diterima · menunggu digital', 'Tunggu digital'); }

/* ---------- kerangka ---------- */
function navItems() {
  return op() ? [['b', 'home', 'Beranda'], ['r', 'chart', 'Rekap'], ['a', 'user', 'Akun saya']]
    : [['b', 'home', 'Beranda'], ['r', 'chart', 'Rekap'], ['d', 'pos', 'Posyandu'], ['p', 'gear', 'Pengaturan']];
}
function navHp() {
  return op() ? [['b', 'home', 'Beranda'], ['r', 'chart', 'Rekap'], ['a', 'user', 'Akun']]
    : [['b', 'home', 'Beranda'], ['r', 'chart', 'Rekap'], ['d', 'pos', 'Posyandu'], ['m', 'menu', 'Lainnya']];
}
function nama() { return (window.PROFIL && PROFIL.nama) || 'Admin Posyandu'; }
function peranTeks() { return op() ? 'Operator Kel. ' + PX.KELSAYA : (utama() ? 'Admin kecamatan' : 'Petugas kecamatan'); }
function inisial() { return (nama().trim().charAt(0) || 'A').toUpperCase(); }
function avatar(c) { var f = window.PROFIL && PROFIL.foto; return '<span class="av ' + (c || '') + '">' + (f ? '<img src="' + e(f) + '" alt="">' : e(inisial())) + '</span>'; }
var JUDUL = { b: ['Beranda', 'Kondisi laporan Posyandu Kecamatan Palu Utara'], r: ['Rekap', 'Rekapitulasi bulanan dan angka kegiatan'], d: ['Posyandu', 'Data Posyandu, kader, dan SK'], p: ['Pengaturan', 'Hanya admin kecamatan'], a: ['Akun saya', 'Profil dan kata sandi'], m: ['Lainnya', ''] };
function judul() {
  var j = JUDUL[S.pg] || JUDUL.b;
  if (S.pg === 'b' && op()) return ['Beranda', 'Kelurahan ' + PX.KELSAYA];
  return j;
}
function pilihanPeriode() {
  var now = new Date(), out = [], m = now.getMonth(), y = now.getFullYear();
  for (var i = 0; i < 14; i++) { var mm = m - i, yy = y; while (mm < 0) { mm += 12; yy--; } out.push({ bl: BULAN[mm], th: String(yy) }); }
  var pa = per(); if (!out.some(function (o) { return o.bl === pa.bl && o.th === pa.th; })) out.push(pa);
  return out;
}
function selPer(full) {
  var pa = per(), o = pilihanPeriode().map(function (x) { var v = x.bl + '|' + x.th; return '<option value="' + v + '"' + (x.bl === pa.bl && x.th === pa.th ? ' selected' : '') + '>' + x.bl + ' ' + x.th + '</option>'; }).join('');
  return '<label class="sel per' + (full ? ' full' : '') + '">' + ic('cal') + '<select data-per aria-label="Periode laporan">' + o + '</select><b>' + pa.bl + ' ' + pa.th + '</b>' + ic('down') + '</label>';
}
function jamMuat() { var t = document.querySelector('.lastt'); var s = t ? t.textContent.trim() : ''; return s && s !== '-' ? s.replace(/\s*WITA/, '') : ''; }
function kerangka() {
  var j = judul(), it = navItems(), ih = navHp();
  var sb = '<aside class="sb"><div class="brand"><img src="logo.png" alt=""><div><b>Pantau Posyandu</b><small>Kecamatan Palu Utara</small></div></div><nav>' +
    it.map(function (x) { return '<a href="#" data-go="' + x[0] + '" class="' + (x[0] === S.pg || (S.pg === 'm' && x[0] === 'p') ? 'on' : '') + '" title="' + x[2] + '">' + ic(x[1]) + '<span>' + x[2] + '</span></a>'; }).join('') +
    '</nav><div class="sbf"><button class="me" type="button" data-akun>' + avatar() + '<div><b>' + e(nama()) + '</b><small>' + e(peranTeks()) + '</small></div></button></div></aside>';
  var adaPer = (S.pg === 'b' || S.pg === 'r');
  var tb = '<header class="tb"><div class="tbt"><h1>' + e(j[0]) + '</h1>' + (j[1] ? '<p>' + e(j[1]) + '</p>' : '') + '</div><div class="sp"></div>' + (adaPer ? selPer() : '') +
    '<button class="upd" type="button" data-muat title="Muat ulang data">' + ic('sync') + '<span>' + (jamMuat() ? 'Diperbarui ' + e(jamMuat()) : 'Muat ulang') + '</span></button>' +
    '<button class="ib" type="button" data-tema aria-label="Ganti tampilan terang atau gelap">' + ic('moon') + '</button>' +
    '<button class="ib" type="button" data-bel aria-label="Laporan terbaru">' + ic('bell') + (titikBel() ? '<i class="dt"></i>' : '') + '</button></header>';
  var hj = S.pg === 'b' ? (op() ? ['Kel. ' + PX.KELSAYA, 'Operator kelurahan'] : ['Pantau Posyandu', 'Kecamatan Palu Utara']) : S.pg === 'r' ? ['Rekap', per().bl + ' ' + per().th] : [j[0], S.pg === 'd' ? 'Data Posyandu dan SK' : ''];
  var htb = '<header class="htb"><img src="logo.png" alt=""><div class="ht"><b>' + e(hj[0]) + '</b>' + (hj[1] ? '<small>' + e(hj[1]) + '</small>' : '') + '</div><div class="sp"></div>' +
    '<button class="ib" type="button" data-bel aria-label="Laporan terbaru">' + ic('bell') + (titikBel() ? '<i class="dt"></i>' : '') + '</button><button class="avb" type="button" data-akun aria-label="Akun">' + avatar('sm') + '</button></header>';
  var hn = '<nav class="hnav" style="grid-template-columns:repeat(' + ih.length + ',1fr)">' + ih.map(function (x) {
    var on = x[0] === S.pg || (x[0] === 'm' && S.pg === 'p'); return '<a href="#" data-go="' + x[0] + '" class="' + (on ? 'on' : '') + '">' + ic(x[1]) + '<span>' + x[2] + '</span></a>'; }).join('') + '</nav>';
  return sb + '<main class="mn">' + tb + htb + '<div class="ct" id="v2ct"></div></main>' + hn;
}
function titikBel() { var s = 0; try { s = parseInt(localStorage.getItem('pantau-seen') || '0', 10) || 0; } catch (x) { } return DATA.length > s; }

/* ---------- komponen Beranda ---------- */
function tenggat(pr) {
  var bt = PX.batasTgl(pr.th, pr.bl), m = BULAN.indexOf(pr.bl), ny = +pr.th + (m === 11 ? 1 : 0), nm = (m + 1) % 12;
  var awal = new Date(ny, nm, 1), b1 = new Date(bt.getFullYear(), bt.getMonth(), bt.getDate()), b2 = new Date(ny, nm, Math.min(PX.batasKelHari(), new Date(ny, nm + 1, 0).getDate())), h0 = new Date(); h0.setHours(0, 0, 0, 0);
  var tot = Math.max(1, (b2 - awal) / 864e5), now = Math.min(100, Math.max(0, (h0 - awal) / 864e5 * 100 / tot)), pk = Math.min(100, Math.max(0, (b1 - awal) / 864e5 * 100 / tot));
  var hk = Math.round((b1 - h0) / 864e5), hf = Math.round((b2 - h0) / 864e5), cnt;
  if (hk > 0) cnt = ['' + hk, 'hari lagi<br>batas kader'];
  else if (hk === 0) cnt = ['0', 'hari ini<br>batas kader'];
  else if (hf >= 0) cnt = ['' + hf, hf ? 'hari lagi<br>batas fisik' : 'hari ini<br>batas fisik'];
  else cnt = ['✓', 'periode<br>sudah ditutup'];
  var tk = PX.teksBatas(pr.th, pr.bl), tf = PX.teksBatasKel(pr.th, pr.bl);
  var d = '<section class="dl"><div class="dli"><b>Periode laporan ' + pr.bl + ' ' + pr.th + '</b><span>Kader mengirim paling lambat <em>' + tk + '</em> · kelurahan mengantar berkas fisik paling lambat <em>' + tf + '</em></span></div>' +
    '<div class="tl"><div class="tlb"><i style="width:' + now + '%"></i><u style="left:' + pk + '%"></u><u style="left:100%"></u><s style="left:' + now + '%"></s></div><div class="tlm"><span style="left:0">1 ' + B3(nm) + '</span><span style="left:' + pk + '%" class="m1">' + b1.getDate() + ' ' + B3(b1.getMonth()) + ' · batas kader</span><span style="left:100%" class="m2">' + b2.getDate() + ' ' + B3(b2.getMonth()) + ' · batas fisik</span></div></div>' +
    '<div class="cnt' + (hk < 0 ? ' f' : '') + '"><b>' + cnt[0] + '</b><span>' + cnt[1] + '</span></div></section>';
  var hdl = '<div class="hdl"><div><b>' + (hk > 0 ? hk + ' hari lagi' : hk === 0 ? 'Hari ini' : hf >= 0 ? (hf ? hf + ' hari lagi' : 'Hari ini') : 'Periode ditutup') + '</b><span>batas kader ' + b1.getDate() + ' ' + B3(b1.getMonth()) + ' · fisik ' + b2.getDate() + ' ' + B3(b2.getMonth()) + '</span></div>' +
    '<div class="tlb"><i style="width:' + now + '%"></i></div></div>';
  return d + hdl;
}
function tahap(D, kel) {
  var rs = D.rows.filter(function (x) { return !kel || x.p.kel === kel; }), n = rs.length;
  var dg = rs.filter(function (x) { return x.d; }).length, fs = rs.filter(function (x) { return x.tg; }).length;
  var bj = function (j, f) { return rs.filter(function (x) { return jn(x.p) === j && f(x); }).length; }, nb = bj('Balita', function () { return 1; }), nl = n - nb;
  var mf = rs.filter(function (x) { return x.st === 'mfisik'; }).length, bl = rs.filter(function (x) { return x.st === 'belum' || x.st === 'mdig'; }).length, tl = rs.filter(function (x) { return x.telat; }).length;
  var A = D.ada, q = function (v) { return A ? v : '…'; }, pc = function (v) { return n ? Math.round(v * 100 / n) : 0; };
  var c1 = '<div class="cd st1"><div class="ch"><span class="step">1</span><div><b>Laporan digital terkirim</b><small>Dikirim kader lewat aplikasi</small></div></div>' +
    '<div class="big"><b>' + dg + '</b><span>/ ' + n + ' Posyandu</span><em>' + pc(dg) + '%</em></div>' + bar(dg, n, 'g1') +
    '<div class="split"><span>Balita <b>' + bj('Balita', function (x) { return x.d; }) + '/' + nb + '</b></span><span>Lansia <b>' + bj('Lansia', function (x) { return x.d; }) + '/' + nl + '</b></span></div></div>';
  var c2 = '<div class="cd st2"><div class="ch"><span class="step">2</span><div><b>Berkas fisik diterima kecamatan</b><small>Dihitung sebagai laporan resmi masuk</small></div></div>' +
    '<div class="big"><b>' + q(fs) + '</b><span>/ ' + n + ' Posyandu</span><em>' + (A ? pc(fs) + '%' : '') + '</em></div>' + bar(A ? fs : 0, n, 'g2') +
    '<div class="split"><span>Balita <b>' + q(bj('Balita', function (x) { return x.tg; })) + '/' + nb + '</b></span><span>Lansia <b>' + q(bj('Lansia', function (x) { return x.tg; })) + '/' + nl + '</b></span></div></div>';
  var todo = '<div class="cd todo"><div class="ch"><span class="step w">' + ic('alert') + '</span><div><b>Perlu tindakan</b><small>Klik untuk menyaring daftar</small></div></div>' +
    '<a href="#" class="ti a" data-tab="mfisik"><i></i><span>' + (op() ? 'Sudah dikirim kader, belum diterima kecamatan' : 'Digital sudah ada, berkas fisik belum diterima') + '</span><b>' + q(mf) + '</b>' + ic('right') + '</a>' +
    '<a href="#" class="ti n" data-tab="belum"><i></i><span>Belum mengirim laporan apa pun</span><b>' + q(bl) + '</b>' + ic('right') + '</a>' +
    '<a href="#" class="ti r" data-tab="telat"><i></i><span>Terlambat (lewat batas kader)</span><b>' + q(tl) + '</b>' + ic('right') + '</a></div>';
  var hst = '<div class="hst"><div class="cd"><small><span class="step">1</span>Digital terkirim</small><div class="big"><b>' + dg + '</b><span>/' + n + '</span></div>' + bar(dg, n, 'g1') + '</div>' +
    '<div class="cd"><small><span class="step">2</span>Fisik diterima</small><div class="big"><b>' + q(fs) + '</b><span>/' + n + '</span></div>' + bar(A ? fs : 0, n, 'g2') + '</div></div>' +
    '<div class="cd htodo"><a href="#" class="ti a" data-tab="mfisik"><i></i><span>Menunggu berkas fisik</span><b>' + q(mf) + '</b>' + ic('right') + '</a><a href="#" class="ti n" data-tab="belum"><i></i><span>Belum mengirim apa pun</span><b>' + q(bl) + '</b>' + ic('right') + '</a></div>';
  return '<section class="stages">' + c1 + c2 + todo + '</section>' + hst;
}
function tabelKel(D) {
  var rows = KEL.map(function (k) {
    var rs = D.rows.filter(function (x) { return x.p.kel === k; }), n = rs.length; if (!n) return '';
    var dg = rs.filter(function (x) { return x.d; }).length, fs = rs.filter(function (x) { return x.tg; }).length, bl = rs.filter(function (x) { return !x.resmi; }).length;
    return '<tr class="klik" tabindex="0" data-kel="' + e(k) + '"><td><b>' + e(k) + '</b></td><td class="c">' + n + '</td><td><div class="pb">' + bar(dg, n, 'g1') + '<span>' + dg + '/' + n + '</span></div></td>' +
      '<td><div class="pb">' + bar(D.ada ? fs : 0, n, 'g2') + '<span>' + (D.ada ? fs : '…') + '/' + n + '</span></div></td><td class="c">' + (!D.ada ? '<span class="pl n">…</span>' : bl ? '<span class="pl n">' + bl + ' belum</span>' : '<span class="pl g">Semua masuk</span>') + '</td><td class="c"><span class="mu">' + ic('right') + '</span></td></tr>';
  }).join('');
  return '<details class="cd kelc"' + (hp() ? '' : ' open') + '><summary><b>Per kelurahan</b>' + ic('down') + '</summary><div class="hd"><h2>Per kelurahan</h2><span class="mu sm">Klik baris untuk melihat Posyandu kelurahan itu</span></div>' +
    '<div class="tw"><table class="tbl kt"><thead><tr><th>Kelurahan</th><th class="c">Posyandu</th><th>Laporan digital</th><th>Berkas fisik diterima</th><th class="c">Belum masuk</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div></details>';
}
function saring(D) {
  var q = S.q.trim().toLowerCase();
  return D.rows.filter(function (x) {
    var t = S.tab;
    if (t === 'mfisik' && x.st !== 'mfisik') return false;
    if (t === 'belum' && !(x.st === 'belum' || x.st === 'mdig')) return false;
    if (t === 'lengkap' && !(x.st === 'lengkap' || x.st === 'fsaja')) return false;
    if (t === 'telat' && !x.telat) return false;
    if (S.kel && x.p.kel !== S.kel) return false;
    if (S.jn && jn(x.p) !== S.jn) return false;
    return !q || (x.p.nama + ' ' + x.p.kel + ' ' + (x.p.ketua || '')).toLowerCase().indexOf(q) >= 0;
  }).sort(urut);
}
function selek(name, opts, val, lbl) {
  return '<label class="sel">' + '<select data-f="' + name + '" aria-label="' + lbl + '">' + opts.map(function (o) { return '<option value="' + e(o[0]) + '"' + (o[0] === val ? ' selected' : '') + '>' + e(o[1]) + '</option>'; }).join('') + '</select><b>' + e((opts.filter(function (o) { return o[0] === val; })[0] || opts[0])[1]) + '</b>' + ic('down') + '</label>';
}
function tabelUtama(D) {
  var all = D.rows, cnt = { semua: all.length, mfisik: 0, belum: 0, lengkap: 0, telat: 0 };
  all.forEach(function (x) { if (x.st === 'mfisik') cnt.mfisik++; if (x.st === 'belum' || x.st === 'mdig') cnt.belum++; if (x.st === 'lengkap' || x.st === 'fsaja') cnt.lengkap++; if (x.telat) cnt.telat++; });
  var tabs = [['semua', 'Semua'], ['mfisik', op() ? 'Siap diantar' : 'Menunggu berkas fisik'], ['belum', 'Belum masuk'], ['lengkap', op() ? 'Sudah kirim' : 'Lengkap']];
  if (S.tab === 'telat') tabs.push(['telat', 'Terlambat']);
  var tb = tabs.map(function (t) { return '<a href="#" role="tab" data-tab="' + t[0] + '" class="' + (S.tab === t[0] ? 'on' : '') + '">' + t[1] + ' <b>' + (D.ada || t[0] === 'semua' ? cnt[t[0]] : '…') + '</b></a>'; }).join('');
  var hc = '<div class="hchips">' + tabs.map(function (t) { return '<a href="#" data-tab="' + t[0] + '" class="' + (S.tab === t[0] ? 'on' : '') + '">' + t[1].replace('Menunggu berkas fisik', 'Tunggu fisik').replace('Belum masuk', 'Belum') + ' ' + (D.ada || t[0] === 'semua' ? cnt[t[0]] : '…') + '</a>'; }).join('') + '</div>';
  var judul = op() ? 'Laporan Posyandu Kelurahan ' + PX.KELSAYA : 'Laporan Posyandu';
  var aksi = '<div class="dd"><button class="bt sm out" type="button" data-menu="bagi">' + ic('share') + ' Bagikan daftar belum ' + ic('down') + '</button>' + (S.menu === 'bagi' ? '<div class="ddm"><button type="button" data-aksi="posterpdf">' + ic('file') + 'PDF untuk dicetak</button><button type="button" data-aksi="posterpng">' + ic('wa') + 'Gambar untuk WhatsApp</button></div>' : '') + '</div>' +
    '<div class="dd"><button class="bt sm out" type="button" data-menu="unduh">' + ic('dl') + ' Unduh ' + ic('down') + '</button>' + (S.menu === 'unduh' ? '<div class="ddm r"><button type="button" data-aksi="xlsx">' + ic('dl') + 'Data laporan (Excel)</button><button type="button" data-aksi="csv">' + ic('dl') + 'Data laporan (CSV)</button></div>' : '') + '</div>';
  if (op()) aksi = aksi.replace(/<div class="dd"><button class="bt sm out" type="button" data-menu="bagi">[\s\S]*?<\/div>(?=<div class="dd">)/, '');
  var flt = '<div class="flt"><label class="srch">' + ic('search') + '<input id="v2q" type="search" placeholder="Cari Posyandu atau ketua…" aria-label="Cari Posyandu" value="' + e(S.q) + '" autocomplete="off"></label>' +
    (op() ? '' : selek('kel', [['', 'Semua kelurahan']].concat(KEL.map(function (k) { return [k, k]; })), S.kel, 'Kelurahan')) +
    selek('jn', [['', 'Semua jenis'], ['Balita', 'Balita'], ['Lansia', 'Lansia']], S.jn, 'Jenis') + '</div>';
  return '<section class="cd tblc" id="v2tabel"><div class="hd"><h2>' + e(judul) + '</h2><div class="sp"></div>' + aksi + '</div><div class="tabs" role="tablist">' + tb + '</div>' + hc + flt + '<div id="v2isi"></div></section>';
}
function isiTabel(D) {
  var box = $('v2isi'); if (!box) return;
  var l = saring(D), hal = Math.max(1, Math.ceil(l.length / PER_HAL)); if (S.hal > hal) S.hal = hal;
  var vis = l.slice((S.hal - 1) * PER_HAL, S.hal * PER_HAL), pil = Object.keys(S.pil).filter(function (k) { return S.pil[k]; });
  var bulk = (!op() && pil.length) ? '<div class="bulk"><b>' + pil.length + ' dipilih</b><button class="bt pri sm" type="button" data-aksi="tandaipilih">' + ic('check') + ' Tandai berkas fisik diterima</button><button class="bt sm ghost" type="button" data-aksi="batalpilih">Batal</button></div>' : '';
  var semua = vis.length && vis.every(function (x) { return S.pil[x.p.id]; });
  var body = vis.map(function (x) {
    var p = x.p, s = !!S.pil[p.id], a = '';
    if (x.d && x.d.pdf) a += '<button class="ib s" type="button" data-pdf="' + e(p.id) + '" title="Unduh PDF laporan" aria-label="Unduh PDF laporan ' + e(p.nama) + '">' + ic('file') + '</button>';
    if (!x.d && p.hp) a += '<a class="ib s" target="_blank" rel="noopener" href="https://wa.me/' + PX.nomorWA(p.hp) + '?text=' + encodeURIComponent(PX.pesanWA(p, per(), x.r.st === 'lewat')) + '" title="Ingatkan lewat WhatsApp" aria-label="Ingatkan ' + e(p.nama) + ' lewat WhatsApp">' + ic('wa') + '</a>';
    a += '<button class="ib s" type="button" data-laci="' + e(p.id) + '" aria-label="Rincian ' + e(p.nama) + '">' + ic('dots') + '</button>';
    var dg = x.d ? '<span class="ok">' + ic('check') + ' ' + tglD(x.d) + '</span>' + ((+x.d.ver || 1) > 1 ? '<small class="rv">revisi ke-' + x.d.ver + '</small>' : '') : '<span class="no">Belum dikirim</span>';
    var fs = x.tg ? '<span class="ok">' + ic('check') + ' Diterima ' + tglF(x.tg) + '</span>' : (x.d && !op() && utama() ? '<button class="bt sm out" type="button" data-tandai="' + e(p.id) + '">Tandai diterima</button>' : '<span class="no">—</span>');
    var ms = '<div class="ms"><span class="m ' + (x.d ? 'y' : 'n') + '">' + ic(x.d ? 'check' : 'clock') + ' Digital</span><span class="m ' + (x.tg ? 'y' : 'n') + '">' + ic(x.tg ? 'check' : 'clock') + ' Fisik</span></div>';
    return '<tr class="' + (s ? 'selr' : '') + '" data-baris="' + e(p.id) + '">' + (op() ? '' : '<td class="cb"><input type="checkbox" class="ck" data-pil="' + e(p.id) + '"' + (s ? ' checked' : '') + ' aria-label="Pilih ' + e(p.nama) + '"></td>') +
      '<td class="nmc"><b class="nm">' + e(p.nama) + '</b><small>' + (op() ? jn(p) + (p.ketua ? ' · Ketua ' + e(p.ketua) : '') : 'Kel. ' + e(p.kel) + (p.ketua ? ' · Ketua ' + e(p.ketua) : '')) + '</small><small class="hpo">' + e(p.kel) + ' · ' + jn(p) + '</small>' + ms + '</td>' +
      '<td class="jnc"><span class="jn ' + jn(p).toLowerCase() + '">' + jn(p) + '</span></td><td class="dgc">' + dg + '</td><td class="fsc">' + fs + '</td><td class="stc">' + pill(x.st) + '<span class="hpo">' + pillHp(x.st) + '</span></td><td class="ac">' + a + ic('right', 'chev') + '</td></tr>';
  }).join('');
  var th = '<thead><tr>' + (op() ? '' : '<th class="cb"><input type="checkbox" class="ck" data-pilsemua' + (semua ? ' checked' : '') + ' aria-label="Pilih semua di halaman ini"></th>') + '<th>Posyandu</th><th>Jenis</th><th>Laporan digital</th><th>Berkas fisik</th><th>Status</th><th></th></tr></thead>';
  var pg = '';
  if (hal > 1) { pg = '<div class="pg">'; for (var i = 1; i <= hal; i++) pg += '<a href="#" data-hal="' + i + '" class="' + (i === S.hal ? 'on' : '') + '">' + i + '</a>'; pg += (S.hal < hal ? '<a href="#" data-hal="' + (S.hal + 1) + '" aria-label="Berikutnya">' + ic('right') + '</a>' : '') + '</div>'; }
  box.innerHTML = bulk + (l.length ? '<div class="tw"><table class="tbl mt">' + th + '<tbody>' + body + '</tbody></table></div>' : '<div class="kosong">Tidak ada Posyandu yang cocok.</div>') +
    '<div class="tf"><span>Menampilkan ' + vis.length + ' dari ' + l.length + '</span>' + pg + '</div>';
}
function kartuAntarCd(D) {
  var siap = D.rows.filter(function (x) { return x.st === 'mfisik'; }).length;
  var tf = PX.teksBatasKel(per().th, per().bl);
  return '<section class="cd antar"><div class="ai">' + ic('box') + '</div><div><h2>Antar berkas fisik ke kecamatan</h2><p class="mu sm">' + siap + ' laporan ' + e(PX.KELSAYA) + ' sudah terkirim digital dan siap diantar. Batas antar: <b>' + tf + '</b>.</p></div><div class="sp"></div>' +
    '<button class="bt out" type="button" data-aksi="antar">Pilih yang diantar</button><button class="bt pri" type="button" data-aksi="antar">' + ic('file') + ' Buat lembar pengantar (PDF)</button></section>' +
    '<div class="cd antar hp"><b>' + ic('box') + ' Siap diantar ke kecamatan</b><span class="mu sm">' + siap + ' laporan · batas ' + tf + '</span><button class="bt pri wide" type="button" data-aksi="antar">Buat lembar pengantar (PDF)</button></div>';
}
function hlmBeranda(ct) {
  var pr = per(), D = data(pr); PX.muatSetor(pr);
  var h = '<div class="hpper">' + selPer(true) + '</div>' + tenggat(pr) + tahap(D) + (op() ? kartuAntarCd(D) : tabelKel(D));
  if (D.h.asing.length) h += '<div class="info w">' + ic('alert') + D.h.asing.length + ' laporan memakai nama Posyandu yang belum cocok dengan Data Posyandu, sehingga tidak dihitung. ' + (utama() ? 'Periksa ejaan di menu Posyandu.' : '') + '</div>';
  if (op() && PX.PENGUMUMAN) h = '<div class="info">' + e(PX.PENGUMUMAN) + '</div>' + h;
  h += tabelUtama(D);
  ct.innerHTML = h; isiTabel(D);
  if (S.laci) laci();
}

/* ---------- panel rincian (laci) ---------- */
function cariBaris(id) { var D = data(per()); return D.rows.filter(function (x) { return x.p.id === id; })[0]; }
function laci() {
  var old = $('v2laci'); if (old) old.remove(); var sc = $('v2scrim'); if (sc) sc.remove();
  if (!S.laci) { document.body.classList.remove('v2kunci'); return; }
  var x = cariBaris(S.laci); if (!x) { S.laci = null; return; }
  var p = x.p, d = x.d, pr = per(), v = d ? (PX.angkaLap(d) || {}) : {}, fm = function (t) { return (t === '' || t == null) ? '-' : t; };
  var via = x.via && typeof x.via === 'object' ? (x.via.oleh || x.via.nama || '') : x.via;
  var mini = '<div class="two"><div class="mini"><small>Laporan digital</small>' + (d ? '<b class="okt">' + ic('check') + ' Terkirim</b><span>' + tglD(d) + ((+d.ver || 1) > 1 ? ' · revisi ke-' + d.ver : '') + '</span>' : '<b class="wt">Belum dikirim</b><span>batas ' + PX.teksBatas(pr.th, pr.bl) + '</span>') + '</div>' +
    '<div class="mini"><small>Berkas fisik</small>' + (x.tg ? '<b class="okt">' + ic('check') + ' Diterima</b><span>' + tglF(x.tg) + (via ? ' · oleh ' + e(via) : '') + '</span>' : '<b class="wt">Belum diterima</b><span>batas ' + PX.teksBatasKel(pr.th, pr.bl) + '</span>') + '</div></div>';
  var rw = '';
  if (x.tg) rw += '<li class="g"><b>Berkas fisik diterima kecamatan</b><span>' + tglF(x.tg) + ' ' + pr.th + (via ? ' · oleh ' + e(via) : '') + '</span></li>';
  if (d) rw += '<li class="g"><b>Laporan digital dikirim</b><span>' + tglD(d) + ' · Nomor ' + e(d.n) + (d.pdf ? ' · PDF tersimpan' : '') + '</span></li>';
  rw += '<li' + (d ? ' class="g"' : '') + '><b>Kegiatan Posyandu</b><span>' + (d && d.tgl ? e(d.tgl) : 'Belum ada laporan ' + pr.bl + ' ' + pr.th) + '</span></li>';
  var ang;
  if (jn(p) === 'Balita') ang = [['Sasaran (S)', v['Sasaran Bayi Balita (S)']], ['Kunjungan (D)', v['Kunjungan (D)']], ['BB naik (N)', v['BB Naik (N)']], ['BB tidak naik', v['BB Tidak Naik (T)']], ['BGM', v['BGM']], ['Stunting', v['Stunting']]];
  else { var sl = v['Sasaran lansia'], kl = v['Kunjungan lansia']; ang = [['Sasaran lansia', sl], ['Kunjungan', kl], ['Belum berkunjung', (sl !== '' && sl != null && kl !== '' && kl != null) ? Math.max(0, sl - kl) : '']]; }
  var kontak = '<div class="kvl"><span>Ketua</span><b>' + e(p.ketua || '-') + '</b></div><div class="kvl"><span>Nomor HP</span><b' + (p.hp ? '' : ' class="mu"') + '>' + (p.hp ? e(p.hp) + (p.hpJenis === 'perwakilan' && p.hpNama ? ' · ' + e(p.hpNama) : '') : 'Belum diisi') + ((utama() || op()) ? ' · <a href="#" data-aksi="nomor">' + (p.hp ? 'ubah' : 'tambah') + '</a>' : '') + '</b></div><div class="kvl"><span>Kader aktif</span><b>' + PX.aktifKader(p).length + ' orang</b></div>';
  var kunci = op() && PX.LEMB[PX.perKey(pr)] && PX.LEMB[PX.perKey(pr)].kunci && PX.LEMB[PX.perKey(pr)].kunci[p.id];
  var ft = '';
  if (!op() && utama() && !x.tg) ft += '<button class="bt pri" type="button" data-aksi="tandai1">' + ic('check') + ' Tandai berkas fisik diterima</button>';
  if (d && d.pdf) ft += '<button class="bt ' + (ft ? 'out' : 'pri') + '" type="button" data-aksi="pdf1">' + ic('file') + ' Unduh PDF laporan</button>';
  if (!d && p.hp) ft += '<a class="bt out" target="_blank" rel="noopener" href="https://wa.me/' + PX.nomorWA(p.hp) + '?text=' + encodeURIComponent(PX.pesanWA(p, pr, x.r.st === 'lewat')) + '">' + ic('wa') + ' Ingatkan lewat WhatsApp</a>';
  if (!op() && utama() && x.tg) ft += '<button class="bt out" type="button" data-aksi="batal1">Batalkan tanda fisik</button>';
  if (kunci) ft += '<button class="bt ghost" type="button" data-aksi="antar">Buka kembali laporan</button>';
  var h = '<div class="scrim" id="v2scrim" data-tutup></div><aside class="drawer" id="v2laci" role="dialog" aria-modal="true" aria-label="Rincian ' + e(p.nama) + '"><i class="grab"></i>' +
    '<div class="dh"><div><small>Posyandu ' + jn(p) + ' · Kel. ' + e(p.kel) + '</small><h2>' + e(p.nama) + '</h2><div class="dpl">' + pill(x.st) + '</div></div><button class="ib" type="button" data-tutup aria-label="Tutup">' + ic('x') + '</button></div>' +
    '<div class="dbody"><div class="dsec">' + mini + '</div><div class="dsec">' + '<h3>Riwayat</h3><ol class="tln">' + rw + '</ol></div>' +
    '<div class="dsec"><h3>Angka kegiatan</h3>' + (d ? '<div class="kv3">' + ang.map(function (a) { return '<div><small>' + a[0] + '</small><b>' + fm(a[1]) + '</b></div>'; }).join('') + '</div>' : '<p class="mu sm">Muncul setelah laporan digital dikirim.</p>') + '</div>' +
    '<div class="dsec"><h3>Kontak</h3>' + kontak + '</div></div><div class="dfoot">' + ft + '</div></aside>';
  root.insertAdjacentHTML('beforeend', h); document.body.classList.add('v2kunci');
}

/* ---------- Rekap ---------- */
function hlmRekap(ct) {
  var pr = per(), D = data(pr), th = pr.th, bmax = (+th < new Date().getFullYear()) ? 11 : (+th > new Date().getFullYear() ? -1 : new Date().getMonth());
  for (var i = 0; i <= Math.min(11, bmax); i++) PX.muatSetor({ bl: BULAN[i], th: th });
  var g = '', ringkas = '';
  BULAN.forEach(function (b, i) {
    var fut = i > bmax, x = fut ? null : data({ bl: b, th: th }), n = x ? x.rows.length : 0;
    var dg = x ? x.rows.filter(function (r) { return r.d; }).length : 0, fs = x && x.ada ? x.rows.filter(function (r) { return r.resmi; }).length : 0;
    var pd = n ? Math.round(dg * 100 / n) : 0, pf = n ? Math.round(fs * 100 / n) : 0;
    g += '<div class="cg' + (fut ? ' fut' : '') + (b === pr.bl ? ' on' : '') + '" title="' + b + ': digital ' + pd + '%, fisik ' + pf + '%"><div class="cbs"><i class="g1" style="height:' + pd + '%"></i><i class="g2" style="height:' + pf + '%"></i></div><span>' + B3(i) + '</span></div>';
  });
  var n = D.rows.length, pd0 = n ? Math.round(D.rows.filter(function (r) { return r.d; }).length * 100 / n) : 0, pf0 = n ? Math.round(D.rows.filter(function (r) { return r.resmi; }).length * 100 / n) : 0;
  var bi = BULAN.indexOf(pr.bl), cat = pr.bl + (bi === bmax ? ' baru berjalan: ' : ': ') + pd0 + '% digital, ' + (D.ada ? pf0 + '% resmi masuk' : '…') + '.';
  if (bi > 0) { var y = data({ bl: BULAN[bi - 1], th: th }), m = y.rows.length; if (m) cat += ' ' + BULAN[bi - 1] + ' ditutup ' + Math.round(y.rows.filter(function (r) { return r.d; }).length * 100 / m) + '% digital' + (y.ada ? ', ' + Math.round(y.rows.filter(function (r) { return r.resmi; }).length * 100 / m) + '% resmi masuk' : '') + '.'; }
  var tot = [0, 0, 0, 0, 0, 0], kr = '', hk = '';
  KEL.forEach(function (k) {
    var rs = D.rows.filter(function (r) { return r.p.kel === k; }); if (!rs.length) return;
    var v = [rs.filter(function (r) { return jn(r.p) === 'Balita'; }).length, rs.filter(function (r) { return jn(r.p) === 'Balita' && r.d; }).length, rs.filter(function (r) { return jn(r.p) === 'Lansia'; }).length, rs.filter(function (r) { return jn(r.p) === 'Lansia' && r.d; }).length, rs.filter(function (r) { return r.resmi; }).length, rs.length];
    tot = tot.map(function (a, i) { return a + v[i]; });
    kr += '<tr><td><b>' + e(k) + '</b></td><td class="c">' + v[1] + '/' + v[0] + '</td><td class="c">' + v[3] + '/' + v[2] + '</td><td class="c"><b>' + (v[1] + v[3]) + '/' + v[5] + '</b></td><td class="c">' + (D.ada ? v[4] : '…') + '/' + v[5] + '</td><td><div class="pb">' + bar(D.ada ? v[4] : 0, v[5], 'g2') + '<span>' + (D.ada ? Math.round(v[4] * 100 / v[5]) + '%' : '…') + '</span></div></td></tr>';
    var dg = v[1] + v[3];
    hk += '<div class="hk"><b>' + e(k) + '</b><div class="pb2"><span>Digital</span>' + bar(dg, v[5], 'g1') + '<em>' + dg + '/' + v[5] + '</em></div><div class="pb2"><span>Fisik</span>' + bar(D.ada ? v[4] : 0, v[5], 'g2') + '<em>' + (D.ada ? v[4] : '…') + '/' + v[5] + '</em></div></div>';
  });
  if (KEL.length > 1 && tot[5]) kr += '<tr class="sum"><td>Jumlah</td><td class="c">' + tot[1] + '/' + tot[0] + '</td><td class="c">' + tot[3] + '/' + tot[2] + '</td><td class="c">' + (tot[1] + tot[3]) + '/' + tot[5] + '</td><td class="c">' + (D.ada ? tot[4] : '…') + '/' + tot[5] + '</td><td><div class="pb">' + bar(D.ada ? tot[4] : 0, tot[5], 'g2') + '<span>' + (D.ada ? Math.round(tot[4] * 100 / tot[5]) + '%' : '…') + '</span></div></td></tr>';
  /* angka kegiatan per kelurahan */
  var bal = S.rkJ === 'b', pakai = D.rows.filter(function (r) { return r.d && (op() || r.tg) && jn(r.p) === (bal ? 'Balita' : 'Lansia'); });
  var F = bal ? [['Sasaran (S)', 'Sasaran Bayi Balita (S)'], ['Kunjungan (D)', 'Kunjungan (D)'], ['BB naik (N)', 'BB Naik (N)'], ['BB tidak naik (T)', 'BB Tidak Naik (T)'], ['BGM', 'BGM'], ['Stunting', 'Stunting']] : [['Sasaran lansia', 'Sasaran lansia'], ['Kunjungan', 'Kunjungan lansia']];
  var jm = F.map(function () { return 0; }), ak = '';
  KEL.forEach(function (k) {
    if (!D.rows.some(function (r) { return r.p.kel === k; })) return;
    var t = F.map(function () { return 0; }), ada = 0;
    pakai.filter(function (r) { return r.p.kel === k; }).forEach(function (r) { ada++; ambil(r.d).forEach(function (o) { F.forEach(function (f, i) { if (o.v[f[1]] !== '' && o.v[f[1]] != null) t[i] += o.v[f[1]]; }); }); });
    t.forEach(function (v, i) { jm[i] += v; });
    ak += '<tr><td><b>' + e(k) + '</b> <span class="mu sm">' + ada + ' laporan</span></td>' + t.map(function (v) { return '<td class="c">' + v + '</td>'; }).join('') + (bal ? '' : '<td class="c">' + Math.max(0, t[0] - t[1]) + '</td><td class="c">' + (t[0] ? Math.round(t[1] * 100 / t[0]) + '%' : '-') + '</td>') + '</tr>';
  });
  if (KEL.length > 1) ak += '<tr class="sum"><td>Jumlah</td>' + jm.map(function (v) { return '<td class="c">' + v + '</td>'; }).join('') + (bal ? '' : '<td class="c">' + Math.max(0, jm[0] - jm[1]) + '</td><td class="c">' + (jm[0] ? Math.round(jm[1] * 100 / jm[0]) + '%' : '-') + '</td>') + '</tr>';
  var akh = '<th>Kelurahan</th>' + F.map(function (f) { return '<th class="c">' + f[0] + '</th>'; }).join('') + (bal ? '' : '<th class="c">Belum berkunjung</th><th class="c">Capaian</th>');
  var tl = D.rows.filter(function (r) { return r.telat || r.r.st === 'telat'; }).sort(urut);
  var tlh = tl.length ? '<div class="tw"><table class="tbl"><thead><tr><th>Posyandu</th><th>Kelurahan</th><th>Jenis</th><th>Keterangan</th></tr></thead><tbody>' + tl.map(function (r) { return '<tr><td><b>' + e(r.p.nama) + '</b></td><td>' + e(r.p.kel) + '</td><td><span class="jn ' + jn(r.p).toLowerCase() + '">' + jn(r.p) + '</span></td><td>' + (r.r.st === 'telat' ? '<span class="pl a">Dikirim ' + tglD(r.d) + '</span>' : '<span class="pl r">Belum mengirim</span>') + '</td></tr>'; }).join('') + '</tbody></table></div>' : '';
  var cap = 'Semua angka mengikuti periode di kanan atas. Cetak dan unduh berisi seluruh isi halaman ini.';
  ct.innerHTML = '<div class="hpper">' + selPer(true) + '</div><section class="rh"><p class="mu" style="margin:0">' + cap + '</p><div class="sp"></div><button class="bt out" type="button" data-aksi="cetakrekap">' + ic('file') + ' Cetak rekap (PDF)</button><button class="bt pri" type="button" data-aksi="xlsrekap">' + ic('dl') + ' Unduh Excel</button></section>' +
    '<div class="g2c"><section class="cd"><div class="hd"><h2>Capaian per bulan · ' + th + '</h2><div class="lg"><span><i class="g1"></i>Digital terkirim</span><span><i class="g2"></i>' + (op() ? 'Fisik diterima' : 'Resmi masuk') + '</span></div></div>' +
    '<div class="chart"><div class="ax"><span>100%</span><span>50%</span><span>0%</span></div><div class="cgs">' + g + '</div></div><div class="note">' + ic('alert') + e(cat) + '</div></section>' +
    '<section class="cd rkkel"><div class="hd"><h2>Per kelurahan · ' + pr.bl + ' ' + th + '</h2></div><div class="tw"><table class="tbl"><thead><tr><th>Kelurahan</th><th class="c">Balita</th><th class="c">Lansia</th><th class="c">Digital</th><th class="c">Fisik</th><th>Capaian resmi</th></tr></thead><tbody>' + kr + '</tbody></table></div>' +
    '<div class="hkl">' + hk + '</div><p class="mu sm" style="margin:12px 2px 0">Capaian resmi = ' + (op() ? 'laporan digital terkirim.' : 'berkas fisik diterima kecamatan' + (PX.fisikSaja() ? ' (masa peralihan: berkas fisik tanpa digital ikut dihitung)' : ' dan laporan digital sudah ada') + ', sama seperti di Beranda.') + '</p></section></div>' +
    '<section class="cd"><div class="hd"><div><h2>Angka kegiatan Posyandu ' + (bal ? 'Balita' : 'Lansia') + ' · ' + pr.bl + ' ' + th + '</h2><p class="mu sm">' + (op() ? 'Dari semua laporan digital kelurahan Anda.' : 'Hanya dari laporan yang berkas fisiknya sudah diterima kecamatan.') + '</p></div><div class="sp"></div>' +
    '<div class="tabs pill2 sm"><a href="#" data-rkj="b" class="' + (bal ? 'on' : '') + '">Balita</a><a href="#" data-rkj="l" class="' + (bal ? '' : 'on') + '">Lansia</a></div><button class="bt sm out" type="button" data-aksi="xlsangka">' + ic('dl') + ' Excel</button></div>' +
    '<div class="tw"><table class="tbl"><thead><tr>' + akh + '</tr></thead><tbody>' + ak + '</tbody></table></div></section>' +
    '<section class="cd"><div class="hd"><div><h2>Keterlambatan · ' + pr.bl + ' ' + th + '</h2><p class="mu sm">Posyandu yang belum mengirim setelah ' + PX.teksBatas(th, pr.bl) + ', atau mengirim setelah batas.</p></div><div class="sp"></div>' + (tl.length ? '<span class="pl r">' + tl.length + ' Posyandu</span>' : '<span class="pl g">Tidak ada yang terlambat</span>') + '</div>' + tlh + '</section>' +
    '<div class="two btm"><button class="bt out" type="button" data-aksi="cetakrekap">' + ic('file') + ' Cetak PDF</button><button class="bt pri" type="button" data-aksi="xlsrekap">' + ic('dl') + ' Excel</button></div>';
}

/* ---------- Posyandu ---------- */
function hlmPosyandu(ct) {
  PX.dpSiap();
  var all = PX.dasarPos(), ak = all.filter(function (p) { return p.aktif !== false; }), SK = PX.SK || {}, ub = utama() && PX.POS.length;
  var kd = ak.reduce(function (n, p) { return n + PX.aktifKader(p).length; }, 0);
  var h = '<section class="rh"><div class="sum4"><span><b>' + ak.length + '</b> Posyandu aktif</span><span><b>' + ak.filter(function (p) { return jn(p) === 'Balita'; }).length + '</b> Balita</span><span><b>' + ak.filter(function (p) { return jn(p) === 'Lansia'; }).length + '</b> Lansia</span><span><b>' + kd + '</b> kader</span></div><div class="sp"></div>';
  if (utama() && !PX.POS.length) h += '<button class="bt pri" type="button" data-aksi="darisk">Simpan daftar dari SK</button>';
  if (ub) h += '<button class="bt out" type="button" data-aksi="impor">' + ic('dl') + ' Impor dari Excel</button>';
  h += '<button class="bt out" type="button" data-aksi="ekspor">' + ic('dl') + ' Unduh</button>';
  if (ub) h += '<button class="bt pri" type="button" data-aksi="tambahpos">' + ic('plus') + ' Tambah Posyandu</button>';
  h += '</section><div id="v2ubah"></div>';
  h += '<div class="skrow">' + [['Balita', 'SK Kader Posyandu Balita'], ['Lansia', 'SK Kader Posyandu Lansia']].map(function (x) {
    var s = SK[x[0]];
    return '<div class="sk"><span class="pdf">PDF</span><div><b>' + x[1] + '</b><small' + (s ? '' : ' class="warn"') + ' id="v2sk' + x[0] + '">' + (s ? 'Diunggah ' + e(s.tgl) + (s.ukuran ? ' · ' + (s.ukuran / 1048576).toFixed(1).replace('.', ',') + ' MB' : '') : 'Belum diunggah') + '</small></div>' +
      (s ? '<button class="bt sm ghost" type="button" data-sklihat="' + x[0] + '">Lihat</button>' : '') + (utama() ? '<label class="bt sm ' + (s ? 'out' : 'pri') + '">' + (s ? 'Ganti' : 'Unggah') + '<input type="file" accept="application/pdf" data-skunggah="' + x[0] + '" hidden></label>' : '') + '</div>';
  }).join('') + '</div>';
  var q = S.dq.toLowerCase();
  var fl = all.filter(function (p) {
    if (S.dk && p.kel !== S.dk) return false; if (S.dj && jn(p) !== S.dj) return false;
    if (S.ds === 'a' && p.aktif === false) return false; if (S.ds === 'n' && p.aktif !== false) return false;
    return !q || (p.nama + ' ' + (p.ketua || '') + ' ' + (p.kader || []).map(function (k) { return k.nama; }).join(' ')).toLowerCase().indexOf(q) >= 0;
  });
  var rows = '';
  KEL.forEach(function (k) {
    var g = fl.filter(function (p) { return p.kel === k; }).sort(function (a, b) { return a.jenis.localeCompare(b.jenis) || a.nama.localeCompare(b.nama); }); if (!g.length) return;
    rows += '<tr class="grp"><td colspan="6">' + e(k) + ' <span>' + g.length + ' Posyandu</span></td></tr>';
    g.forEach(function (p) {
      rows += '<tr class="klik" data-posd="' + e(p.id) + '"' + (p.aktif === false ? ' style="opacity:.6"' : '') + '><td class="nmc"><b class="nm">' + e(p.nama) + '</b>' + (p.aktif === false ? '<small>Nonaktif</small>' : '') + '<small class="hpo">' + jn(p) + ' · ' + e(p.ketua || '-') + ' · ' + PX.aktifKader(p).length + ' kader</small></td><td class="jnc"><span class="jn ' + jn(p).toLowerCase() + '">' + jn(p) + '</span></td><td class="kc">' + e(p.ketua || '-') + '</td><td class="c kc">' + PX.aktifKader(p).length + '</td><td class="kc' + (p.hp ? '' : ' mu') + '">' + (p.hp ? e(p.hp) : 'Belum diisi') + '</td><td class="ac">' + ((ub || op()) ? '<button class="ib s" type="button" data-posedit="' + e(p.id) + '" aria-label="Ubah ' + e(p.nama) + '">' + ic('edit') + '</button>' : '') + ic('right', 'chev') + '</td></tr>';
    });
  });
  h += '<section class="cd tblc"><div class="flt"><label class="srch">' + ic('search') + '<input id="v2dq" type="search" placeholder="Cari Posyandu, ketua, atau kader…" aria-label="Cari Posyandu" value="' + e(S.dq) + '" autocomplete="off"></label>' +
    (op() ? '' : selek('dk', [['', 'Semua kelurahan']].concat(KEL.map(function (k) { return [k, k]; })), S.dk, 'Kelurahan')) + selek('dj', [['', 'Semua jenis'], ['Balita', 'Balita'], ['Lansia', 'Lansia']], S.dj, 'Jenis') + selek('ds', [['a', 'Aktif'], ['n', 'Nonaktif'], ['', 'Semua status']], S.ds, 'Status') + '</div>' +
    (fl.length ? '<div class="tw"><table class="tbl mt pt"><thead><tr><th>Nama Posyandu</th><th>Jenis</th><th>Ketua / penanggung jawab</th><th class="c">Kader</th><th>Nomor HP ketua</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>' : '<div class="kosong">Tidak ada Posyandu yang cocok.</div>') + '</section>' +
    '<div id="v2peng"></div>';
  ct.innerHTML = h;
  var ub2 = $('dpUbah'); if (ub2 && ub2.childNodes.length) $('v2ubah').appendChild(ub2);
  var pg = $('pengBox'); if (pg && pg.textContent.trim()) $('v2peng').appendChild(pg);
}
function rincianPos(id) {
  var p = PX.dasarPos().filter(function (x) { return x.id === id; })[0]; if (!p) return;
  var w = document.createElement('div'); w.className = 'v2m';
  var kd = (p.kader || []).map(function (k, i) { return '<tr><td class="c">' + (i + 1) + '</td><td>' + e(k.nama) + '</td><td>' + e(k.jabatan || '-') + '</td><td>' + (k.aktif === false ? '<span class="pl n">Nonaktif</span>' : '<span class="pl g">Aktif</span>') + '</td></tr>'; }).join('');
  w.innerHTML = '<div class="kvl"><span>Kelurahan</span><b>' + e(p.kel) + '</b></div><div class="kvl"><span>Jenis</span><b>' + e(p.jenis) + '</b></div><div class="kvl"><span>Ketua / PJ</span><b>' + e(p.ketua || '-') + '</b></div><div class="kvl"><span>Nomor HP</span><b>' + e(p.hp || 'Belum diisi') + '</b></div>' +
    (p.alamat ? '<div class="kvl"><span>Alamat</span><b>' + e(p.alamat) + '</b></div>' : '') + (p.jadwal ? '<div class="kvl"><span>Jadwal</span><b>' + e(p.jadwal) + '</b></div>' : '') + '<div class="kvl"><span>Status</span><b>' + (p.aktif === false ? 'Nonaktif' : 'Aktif') + '</b></div>' +
    (kd ? '<div class="tw" style="margin-top:10px"><table class="tbl"><thead><tr><th class="c">No</th><th>Nama kader</th><th>Jabatan</th><th>Status</th></tr></thead><tbody>' + kd + '</tbody></table></div>' : '<p class="mu">Belum ada nama kader.</p>');
  var f = document.createElement('div'); f.className = 'mf';
  if (utama() && PX.POS.length) {
    f.innerHTML = '<button class="bt dz" type="button" data-x="akt">' + (p.aktif === false ? 'Aktifkan' : 'Nonaktifkan') + '</button><div class="sp"></div><button class="bt pri" type="button" data-x="ubah">' + ic('edit') + ' Ubah data</button>';
    f.querySelector('[data-x=ubah]').onclick = function () { PX.formPos(p); };
    f.querySelector('[data-x=akt]').onclick = function () { if (!confirm((p.aktif === false ? 'Aktifkan ' : 'Nonaktifkan ') + p.nama + '?')) return; PX.tutupModal(); PX.simpanDaftar(PX.POS.map(function (x) { return x.id === p.id ? Object.assign({}, x, { aktif: x.aktif === false }) : x; }), 'Status Posyandu diperbarui.'); };
  } else if (op() && PX.POS.length) {
    f.innerHTML = '<div class="sp"></div><button class="bt pri" type="button">' + (p.hp ? 'Ubah nomor ketua/perwakilan' : 'Isi nomor ketua/perwakilan') + '</button>';
    f.querySelector('button').onclick = function () { PX.formNomor(p); };
  }
  w.appendChild(f);
  PX.bukaModal('Posyandu ' + p.nama, w);
}

/* ---------- Pengaturan ---------- */
var PSUB = [['j', 'cal', 'Jadwal dan pengumuman'], ['u', 'pos', 'Pengguna dan penerima'], ['s', 'db', 'Data dan cadangan'], ['t', 'shield', 'Sistem'], ['a', 'user', 'Akun saya']];
function fld(lbl, inner, hint) { return '<div class="fl"><label>' + lbl + '</label>' + inner + (hint ? '<p class="hint">' + hint + '</p>' : '') + '</div>'; }
function hlmPengaturan(ct) {
  if (!utama()) S.ps = 'a';
  var sub = utama() ? PSUB : PSUB.filter(function (x) { return x[0] === 'a'; });
  var nav = '<nav class="psub">' + sub.map(function (x) { return '<a href="#" data-ps="' + x[0] + '" class="' + (S.ps === x[0] ? 'on' : '') + '">' + ic(x[1]) + x[2] + '</a>'; }).join('') + '</nav>';
  var back = '<a href="#" class="back" data-go="m">' + ic('left') + 'Lainnya</a>';
  ct.innerHTML = '<div class="pset">' + nav + '<div class="pcol" id="v2pcol">' + back + '</div></div>';
  var c = $('v2pcol');
  ({ j: psJadwal, u: psPengguna, s: psData, t: psSistem, a: psAkun }[S.ps] || psAkun)(c);
}
function psJadwal(c) {
  var v = S.simpan, bk = v.batas != null ? v.batas : PX.BATAS, bf = v.batasKel != null ? v.batasKel : PX.batasKelHari(), pg = v.pengumuman != null ? v.pengumuman : PX.PENGUMUMAN, wa = v.wa != null ? v.wa : (PX.WABANTU ? '+' + PX.WABANTU : '');
  var n = Object.keys(v).length, on = PX.fisikSaja();
  c.insertAdjacentHTML('beforeend', '<section class="cd form"><h2>Batas waktu</h2><p class="mu sm">Dipakai untuk hitung mundur dan penanda terlambat. Berlaku setiap bulan.</p><div class="row2">' +
    fld('Batas kader mengirim laporan (tanggal)', '<input class="in" style="max-width:120px" type="number" min="1" max="31" inputmode="numeric" data-set="batas" value="' + e(bk) + '">', 'Contoh: laporan Oktober paling lambat ' + bk + ' November.') +
    fld('Batas kelurahan mengantar berkas fisik (tanggal)', '<input class="in" style="max-width:120px" type="number" min="1" max="31" inputmode="numeric" data-set="batasKel" value="' + e(bf) + '">', 'Contoh: laporan Oktober paling lambat ' + bf + ' November.') + '</div></section>' +
    '<section class="cd form"><h2>Untuk kader di aplikasi laporan</h2>' +
    fld('Pengumuman (tampil di halaman awal aplikasi kader)', '<textarea class="in ta" maxlength="300" rows="3" data-set="pengumuman" placeholder="Contoh: Laporan bulan ini paling lambat tanggal 8.">' + e(pg) + '</textarea>', 'Maksimal 300 huruf. Kosongkan untuk menghapus.') +
    fld('Nomor WhatsApp bantuan', '<input class="in" style="max-width:280px" type="tel" inputmode="tel" maxlength="20" data-set="wa" value="' + e(wa) + '" placeholder="Contoh: 08123456789">', 'Tombol WhatsApp muncul di aplikasi kader. Awalan 0 otomatis menjadi 62.') + '</section>' +
    '<section class="cd form"><h2>Masa peralihan</h2><div class="sw"><button type="button" class="tg' + (on ? ' on' : '') + '" role="switch" aria-checked="' + on + '" data-aksi="peralihan" aria-label="Masa peralihan"><i></i></button><div><b>' + (on ? 'Hidup' : 'Mati') + '</b><p class="mu sm">' + (on ? 'Berkas fisik tanpa laporan digital tetap dihitung masuk. Matikan bila semua Posyandu sudah memakai aplikasi.' : 'Laporan dihitung masuk bila digital dan berkas fisik sudah ada. Hidupkan lagi bila masih ada laporan kertas tanpa aplikasi.') + ' Perubahan meminta kata sandi Anda.</p></div></div></section>' +
    (n ? '<div class="savebar"><span class="mu">Ada ' + n + ' perubahan belum disimpan</span><div class="sp"></div><button class="bt ghost" type="button" data-aksi="batalset">Batalkan</button><button class="bt pri" type="button" data-aksi="simpanset">Simpan perubahan</button></div>' : ''));
}
function simpanSet(b) {
  var v = S.simpan, kerja = [];
  if (v.batas != null) { var x = parseInt(v.batas, 10); if (!(x >= 1 && x <= 31)) return alert('Batas kader: isi tanggal 1 sampai 31.'); kerja.push(kirimAtur({ batas: x }).then(function () { PX.setBatas(x); })); }
  if (v.batasKel != null) { var y = parseInt(v.batasKel, 10); if (!(y >= 1 && y <= 31)) return alert('Batas kelurahan: isi tanggal 1 sampai 31.'); kerja.push(kirimAtur({ batasKel: y }).then(function () { PX.setBatasKel(y); })); }
  if (v.pengumuman != null) { var p = String(v.pengumuman).replace(/\s+/g, ' ').trim(); kerja.push(kirimAtur({ pengumuman: p }).then(function () { PX.setPengumuman(p); })); }
  if (v.wa != null) { var w = String(v.wa).trim(); kerja.push(kirimAtur({ wa: w }).then(function () { var n = w.replace(/[^0-9]/g, ''); if (n.indexOf('0') === 0) n = '62' + n.slice(1); PX.setWA(n); })); }
  b.disabled = true; b.textContent = 'Menyimpan…';
  Promise.all(kerja).then(function () { S.simpan = {}; PX.toast('Perubahan tersimpan.'); PX.pasangSetelan(); PX.renderBeranda(); }).catch(function (er) { alert('Gagal menyimpan: ' + er.message); b.disabled = false; b.textContent = 'Simpan perubahan'; });
}
function psPengguna(c) {
  var A = window.ADM || [];
  var tr = A.map(function (a) {
    var st = a.kunci ? (a.kunci.permanen ? '<span class="pl r">Terkunci</span>' : '<span class="pl a">Terkunci sementara</span>') : '<span class="pl g">Aktif</span>';
    return '<tr><td><b>' + e(a.u) + '</b></td><td>' + e(a.nama || '-') + '</td><td>' + e(a.kel || 'Belum dipilih') + '</td><td>' + st + '</td><td class="mu">' + e(a.nip ? 'NIP ' + a.nip : '-') + '</td><td class="ac"><button class="bt sm ghost" type="button" data-opubah="' + e(a.u) + '">Ubah</button></td></tr>';
  }).join('');
  c.insertAdjacentHTML('beforeend', '<section class="cd"><div class="hd"><div><h2>Operator kelurahan</h2><p class="mu sm">Melihat dan mengantar laporan kelurahannya saja. Tidak bisa mengubah data Posyandu atau pengaturan.</p></div><div class="sp"></div><button class="bt pri sm" type="button" data-aksi="optambah"' + (A.length >= 5 ? ' disabled' : '') + '>' + ic('plus') + ' Tambah operator</button></div>' +
    (A.length ? '<div class="tw"><table class="tbl"><thead><tr><th>Nama pengguna</th><th>Nama</th><th>Kelurahan</th><th>Status</th><th>NIP</th><th></th></tr></thead><tbody>' + tr + '</tbody></table></div>' : '<p class="mu">Belum ada operator.</p>') +
    '<p class="mu sm" style="margin:10px 2px 0">' + A.length + ' dari 5 akun terpakai.</p></section><div id="v2trm"></div>');
  var t = $('cardTrm'); if (t) { $('v2trm').appendChild(t); t.style.display = ''; }
}
function modalOp(a) {
  var w = document.createElement('div'); w.className = 'v2m';
  var kelOpt = '<option value="">Pilih kelurahan…</option>' + (window.KEL_SEMUA || KEL).map(function (k) { return '<option' + (a && a.kel === k ? ' selected' : '') + '>' + e(k) + '</option>'; }).join('');
  if (a) {
    w.innerHTML = (a.kunci ? '<div class="alertb">' + ic('lock') + ' Akun ' + (a.kunci.permanen ? 'terkunci' : 'terkunci sementara') + ' karena terlalu sering salah kata sandi. <a href="#" data-x="buka">Buka kunci</a></div>' : '') +
      fld('Nama pengguna', '<div class="in mu">' + e(a.u) + '</div>') + fld('Nama', '<div class="in' + (a.nama ? '' : ' mu') + '">' + e(a.nama || 'Tidak diisi') + '</div>') +
      fld('Kelurahan', '<select class="in" data-x="kel">' + kelOpt + '</select>') +
      fld('Kata sandi', '<div class="row1"><input class="in" type="password" data-x="pw" autocomplete="new-password" placeholder="Kata sandi baru (minimal 6)"></div>', 'Kosongkan bila tidak diganti.') +
      '<div class="st" data-x="st"></div><div class="mf"><button class="bt dz" type="button" data-x="hapus">Hapus akun</button><div class="sp"></div><button class="bt ghost" type="button" data-x="batal">Batal</button><button class="bt pri" type="button" data-x="simpan">Simpan</button></div>';
  } else {
    w.innerHTML = fld('Nama pengguna', '<input class="in" data-x="u" maxlength="20" autocomplete="off" autocapitalize="none" placeholder="huruf kecil atau angka, 3-20">') + fld('Nama (boleh dikosongkan)', '<input class="in" data-x="n" maxlength="40" autocomplete="off">') +
      fld('Kelurahan', '<select class="in" data-x="kel">' + kelOpt + '</select>', 'Operator hanya melihat data kelurahan ini.') + fld('Kata sandi', '<input class="in" type="password" data-x="pw" autocomplete="new-password" placeholder="Minimal 6 karakter">') +
      '<div class="st" data-x="st"></div><div class="mf"><div class="sp"></div><button class="bt ghost" type="button" data-x="batal">Batal</button><button class="bt pri" type="button" data-x="simpan">Tambah operator</button></div>';
  }
  var q = function (k) { return w.querySelector('[data-x="' + k + '"]'); }, st = q('st');
  function jalan(f, ok) { st.textContent = 'Menyimpan…'; st.className = 'st'; return kelolaAdm(f, ok).then(function (r) { if (r) { PX.tutupModal(); PX.toast(ok); render(); } else { st.textContent = ($('stAdm') || {}).textContent || 'Gagal menyimpan'; st.className = 'st bad'; } return r; }); }
  q('batal').onclick = function () { PX.tutupModal(); };
  if (a) {
    if (q('buka')) q('buka').onclick = function (ev) { ev.preventDefault(); jalan({ op: 'buka', nu: a.u }, 'Kunci akun ' + a.u + ' dibuka.'); };
    q('hapus').onclick = function () { if (confirm('Hapus operator ' + a.u + '?')) jalan({ op: 'hapus', nu: a.u }, 'Operator ' + a.u + ' dihapus.'); };
    q('simpan').onclick = function () {
      var k = q('kel').value, pw = q('pw').value, ch = Promise.resolve(true);
      if (pw && pw.length < 6) { st.textContent = 'Kata sandi minimal 6 karakter'; st.className = 'st bad'; return; }
      if (k && k !== a.kel) ch = ch.then(function () { return kelolaAdm({ op: 'kel', nu: a.u, kel: k }, ''); });
      if (pw) ch = ch.then(function (r) { return r && kelolaAdm({ op: 'sandi', nu: a.u, ns: pw }, ''); });
      st.textContent = 'Menyimpan…'; st.className = 'st';
      ch.then(function (r) { if (r) { PX.tutupModal(); PX.toast('Akun ' + a.u + ' diperbarui.'); render(); } else { st.textContent = ($('stAdm') || {}).textContent || 'Gagal menyimpan'; st.className = 'st bad'; } });
    };
  } else q('simpan').onclick = function () {
    var u = q('u').value.trim().toLowerCase(), pw = q('pw').value, k = q('kel').value;
    if (!/^[a-z0-9]{3,20}$/.test(u)) { st.textContent = 'Nama pengguna 3-20 huruf kecil atau angka'; st.className = 'st bad'; return; }
    if (pw.length < 6) { st.textContent = 'Kata sandi minimal 6 karakter'; st.className = 'st bad'; return; }
    if (!k) { st.textContent = 'Pilih kelurahan operator'; st.className = 'st bad'; return; }
    jalan({ op: 'tambah', nu: u, ns: pw, kel: k, nama: q('n').value.trim() }, 'Operator ' + u + ' ditambahkan.');
  };
  PX.bukaModal(a ? 'Ubah akun ' + a.u : 'Tambah operator kelurahan', w);
}
function psData(c) {
  var R = PX.RUANG, CAD = PX.CAD;
  var ru;
  if (!R) ru = '<p class="mu sm">Lihat berapa ruang Drive yang terpakai oleh PDF laporan dan cadangan, serta perkiraan sampai kapan ruangnya cukup.</p><button class="bt pri sm" type="button" data-aksi="ruang">Hitung sekarang</button><p class="hint" id="v2rket"></p>';
  else {
    var pk = +R.pakai || 0, bt = +R.batas || 0, pct = bt > 0 ? Math.min(100, pk * 100 / bt) : 0, app = (+R.pdf || 0) + (+R.sk || 0) + (+R.cadangan || 0) + (+R.lain || 0);
    var lbl = bt <= 0 ? ['g', 'Tanpa batas'] : pct < 60 ? ['g', 'Aman'] : pct < 85 ? ['a', 'Perlu diperhatikan'] : ['r', 'Hampir penuh'];
    var aktif = PX.posAktif().length, rata = R.nPdf > 0 ? R.pdf / R.nPdf : 0, bln = aktif * rata, cukup = (rata > 0 && bt > 0) ? (bt - pk) / bln : null;
    var tx = cukup == null ? '' : cukup > 120 ? 'cukup untuk lebih dari 10 tahun' : cukup >= 12 ? 'cukup sekitar ' + (Math.round(cukup / 12 * 10) / 10).toString().replace('.', ',') + ' tahun' : 'cukup sekitar ' + Math.max(0, Math.floor(cukup)) + ' bulan';
    var w = function (x) { return bt > 0 ? (x * 100 / bt) : 0; };
    ru = '<div class="drv"><div class="dbar"><i style="width:' + w(Math.max(0, pk - app)) + '%;background:#9aa3b5" title="Layanan Google lain"></i><i style="width:' + w(R.pdf) + '%;background:#2f8f5b" title="PDF laporan"></i><i style="width:' + w(R.sk) + '%;background:#d9a21b" title="SK"></i><i style="width:' + w(R.cadangan) + '%;background:#3b5bb5" title="Cadangan"></i></div>' +
      '<div class="dl3"><span><b>' + PX.fmtB(pk) + '</b>' + (bt > 0 ? ' dari ' + PX.fmtB(bt) + ' terpakai · sisa ' + PX.fmtB(Math.max(0, bt - pk)) : ' terpakai') + '</span><span class="mu">Aplikasi ini memakai ' + PX.fmtB(app) + (tx ? ' · ' + tx : '') + '</span></div>' +
      '<div class="leg3"><span><i style="background:#2f8f5b"></i>PDF laporan ' + PX.fmtB(R.pdf) + '</span><span><i style="background:#d9a21b"></i>SK ' + PX.fmtB(R.sk) + '</span><span><i style="background:#3b5bb5"></i>Cadangan ' + PX.fmtB(R.cadangan) + '</span><span><i style="background:#9aa3b5"></i>Lainnya</span></div></div>' +
      '<p class="hint">Diperbarui ' + PX.fmtWaktu(R.tgl) + '. Kuota akun Google dipakai bersama layanan Google lain. <a href="#" data-aksi="ruang">Perbarui</a></p><p class="hint" id="v2rket"></p>';
    ru = '<div class="hd" style="margin:-4px 0 12px"><span class="pl ' + lbl[0] + '">' + lbl[1] + '</span></div>' + ru;
  }
  var cad;
  if (CAD === null) { PX.muatCadangan(); cad = '<p class="mu">Memuat daftar cadangan…</p>'; }
  else {
    var last = CAD[0], tua = last ? (Date.now() - new Date(last.tgl + 'T00:00:00').getTime()) / 864e5 : 999;
    cad = (!last ? '<div class="info w">' + ic('alert') + 'Belum ada cadangan. Jalankan fungsi aktifkanCadangan sekali di Apps Script, atau tekan Cadangkan sekarang.</div>' : tua > 9 ? '<div class="info w">' + ic('alert') + 'Cadangan terakhir sudah ' + Math.floor(tua) + ' hari. Cadangan otomatis mungkin belum aktif.</div>' : '') +
      (CAD.length ? '<div class="tw"><table class="tbl"><tbody>' + CAD.map(function (x, i) { var p = String(x.tgl || '').split('-'); return '<tr><td><b>' + (p.length === 3 ? (+p[2]) + ' ' + B3(+p[1] - 1) + ' ' + p[0] : e(x.tgl)) + '</b> <span class="mu">· ' + (i === 0 ? 'terbaru' : 'otomatis') + '</span></td><td class="mu">' + PX.fmtB(x.ukuran) + '</td><td class="ac"><button class="bt sm ghost" type="button" data-pulih="' + e(x.id) + '" data-tgl="' + e(x.tgl) + '">Pulihkan</button></td></tr>'; }).join('') + '</tbody></table></div>' : '');
  }
  c.insertAdjacentHTML('beforeend', '<section class="cd"><div class="hd"><h2>Ruang Google Drive</h2></div>' + ru + '</section>' +
    '<section class="cd"><div class="hd"><div><h2>Cadangan</h2><p class="mu sm">Otomatis setiap Minggu dini hari. Berisi data Posyandu, kader, pengaturan, dan akun operator.</p></div><div class="sp"></div><button class="bt pri sm" type="button" data-aksi="cadang">Cadangkan sekarang</button></div>' + cad +
    '<p class="mu sm" style="margin:10px 2px 0"><a href="#" data-aksi="unduhjson">Unduh cadangan ke komputer</a> · <label class="lnk">Pulihkan dari berkas cadangan di komputer<input type="file" accept=".json,application/json" data-pulihjson hidden></label></p></section>' +
    '<section class="cd"><div class="hd"><div><h2>Catatan perubahan</h2><p class="mu sm">300 perubahan terakhir pada data Posyandu, SK, operator, dan pengaturan.</p></div><div class="sp"></div><button class="bt out sm" type="button" data-aksi="log">' + (LOG ? 'Muat ulang' : 'Lihat semua') + '</button></div><div id="v2log">' + logHtml() + '</div></section>');
}
var LOG = null, LOGN = 3;
function logHtml() {
  if (!LOG) return '<p class="mu sm">Tekan "Lihat semua" untuk memuat catatan.</p>';
  if (!LOG.length) return '<p class="mu sm">Belum ada catatan.</p>';
  return '<ul class="log">' + LOG.slice(0, LOGN).map(function (x) { return '<li><span class="lt"><b>' + e(x.u) + '</b> ' + e(x.a) + '</span><span>' + e(x.t) + '</span></li>'; }).join('') + '</ul>' + (LOG.length > LOGN ? '<p class="mu sm" style="margin:8px 2px 0"><a href="#" data-aksi="logmore">Tampilkan lebih banyak</a></p>' : '');
}
function psSistem(c) {
  c.insertAdjacentHTML('beforeend', '<div id="v2pm"></div><section class="cd"><div class="hd"><div><h2>Tentang aplikasi</h2></div></div><div class="kvl"><span>Versi</span><b>v11 · tampilan baru</b></div><div class="kvl"><span>Jenis Posyandu</span><b>Balita, Lansia</b></div><div class="kvl"><span>Kelurahan</span><b>' + e(KEL.join(', ')) + '</b></div><div class="kvl"><span>Pengembang</span><b>Max Juniar Ratowo</b></div></section>');
  var pm = $('cardPm'); if (pm) { $('v2pm').appendChild(pm); pm.style.display = ''; }
  var ts = $('cardTes'); if (ts && ts.style.display !== 'none') $('v2pm').appendChild(ts);
}
function psAkun(c) {
  c.insertAdjacentHTML('beforeend', '<section class="cd prof2"><div class="prof">' + avatar('lg') + '<div><b>' + e(nama()) + '</b><small>' + e(peranTeks()) + ' · ' + e((window.CRED && (CRED.as || CRED.u)) || '') + '</small></div></div></section><div id="v2akun"></div>' +
    '<section class="cd"><div class="ml"><a href="./" target="_blank" rel="noopener">' + ic('send') + '<span>Buka aplikasi laporan kader</span>' + ic('right', 'chev') + '</a>' +
    (utama() || (window.CRED && CRED.as) ? '<a href="#" data-aksi="sebagai">' + ic('eye') + '<span>' + (window.CRED && CRED.as ? 'Kembali sebagai admin' : 'Lihat sebagai operator') + '</span>' + ic('right', 'chev') + '</a>' : '') +
    '<a href="#" data-muat>' + ic('sync') + '<span>Muat ulang data</span>' + ic('right', 'chev') + '</a><a href="#" data-aksi="keluar" class="dz">' + ic('out') + '<span>Keluar</span>' + ic('right', 'chev') + '</a></div></section>');
  var box = $('v2akun');
  ['cardProf', 'cardPw'].forEach(function (id) { var x = $(id); if (x) { box.appendChild(x); x.style.display = ''; } });
}

/* ---------- Lainnya (HP) ---------- */
function hlmLainnya(ct) {
  var dark = document.documentElement.getAttribute('data-theme') === 'dark' || (document.documentElement.getAttribute('data-theme') !== 'light' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  var grp = utama() ? [['Pengaturan', PSUB.slice(0, 4)]] : [];
  var h = '<a href="#" class="cd prof" data-ps="a">' + avatar('lg') + '<div><b>' + e(nama()) + '</b><small>' + e(peranTeks()) + (window.PROFIL && PROFIL.nip ? ' · NIP ' + e(PROFIL.nip) : '') + '</small></div>' + ic('right', 'chev') + '</a>';
  grp.forEach(function (g) { h += '<h3 class="hh sm">' + g[0] + '</h3><div class="cd ml">' + g[1].map(function (x) { return '<a href="#" data-ps="' + x[0] + '">' + ic(x[1]) + '<span>' + x[2] + '</span>' + ic('right', 'chev') + '</a>'; }).join('') + '</div>'; });
  h += '<h3 class="hh sm">Tampilan</h3><div class="cd ml"><a href="#" data-tema>' + ic('moon') + '<span>Mode gelap</span><span class="tg' + (dark ? ' on' : '') + '"><i></i></span></a></div>';
  h += '<div class="cd ml"><a href="./" target="_blank" rel="noopener">' + ic('send') + '<span>Buka aplikasi laporan kader</span>' + ic('right', 'chev') + '</a><a href="#" data-aksi="keluar" class="dz">' + ic('out') + '<span>Keluar</span>' + ic('right', 'chev') + '</a></div>';
  h += '<p class="ver">Pantau Laporan Posyandu v11 · © 2026 Kecamatan Palu Utara</p>';
  ct.innerHTML = h;
}

/* ---------- lonceng ---------- */
function bel() {
  var w = document.createElement('div'); w.className = 'v2m';
  var l = DATA.slice().sort(function (a, b) { return b.n < a.n ? -1 : b.n > a.n ? 1 : 0; }).slice(0, 8);
  w.innerHTML = l.length ? '<ul class="log">' + l.map(function (d) { return '<li><span class="lt"><b>' + e(d.pos) + '</b> · ' + e(d.kel) + ' · ' + e(d.jenis.replace('Posyandu ', '')) + ' · ' + e(d.bln) + '</span><span>' + e(d.tk || '-') + '</span></li>'; }).join('') + '</ul>' : '<p class="mu">Belum ada laporan masuk.</p>';
  try { localStorage.setItem('pantau-seen', String(DATA.length)); } catch (x) { }
  PX.bukaModal('Laporan terbaru', w); render();
}

/* ---------- operator: antar berkas ---------- */
function bukaAntar() {
  var pr = per(), h = PX.hitung(pr.th, pr.bl), w = document.createElement('div'); w.className = 'v2m antarm'; w.id = 'v2antar';
  PX.kartuAntar(w, h, pr, true);
  PX.bukaModal('Antar berkas fisik · ' + pr.bl + ' ' + pr.th, w, false);
}

/* ---------- halaman masuk ---------- */
function rapikanLogin() {
  var lg = $('login'); if (!lg || lg.getAttribute('data-v2')) return; lg.setAttribute('data-v2', '1');
  var side = document.createElement('div'); side.className = 'v2lside';
  side.innerHTML = '<div class="lq"><b>Dua tahap, satu layar.</b><span>Laporan digital dari kader dan berkas fisik yang diterima kecamatan dipantau bersama setiap bulan.</span></div>';
  lg.appendChild(side);
  var lf = lg.querySelector('.lf'); if (lf && !lf.querySelector('.v2lh')) lf.insertAdjacentHTML('afterbegin', '<div class="v2lh"><div class="lbrand"><img src="logo.png" alt=""><div><b>Pantau Laporan Posyandu</b><small>Kecamatan Palu Utara · Kota Palu</small></div></div><h2>Masuk</h2><p class="mu">Gunakan akun yang diberikan admin kecamatan.</p></div>');
  if (lf && !lf.querySelector('.v2lf')) lf.insertAdjacentHTML('beforeend', '<p class="v2lf">© 2026 Kecamatan Palu Utara · Dikembangkan oleh Max Juniar Ratowo</p>');
}

/* ---------- gambar ulang ---------- */
function aktif() { var a = $('app'); return !!(a && !a.classList.contains('hidden') && window.PX && window.CRED); }
var fokus = null;
function render() {
  jadwalT = 0;
  if (!root) { root = document.createElement('div'); root.id = 'v2'; document.body.appendChild(root); pasangKlik(); }
  rapikanLogin();
  if (!aktif()) { document.body.classList.remove('v2on'); root.innerHTML = ''; return; }
  document.body.classList.add('v2on');
  if (op() && (S.pg === 'd' || S.pg === 'p' || S.pg === 'm')) S.pg = 'b';
  if (!op() && S.pg === 'a') { S.pg = 'p'; S.ps = 'a'; }
  root.className = 'pg-' + S.pg + (op() ? ' isop' : '');
  var ae = document.activeElement, fid = ae && ae.id && root.contains(ae) ? ae.id : null, ss = fid && ae.selectionStart != null ? [ae.selectionStart, ae.selectionEnd] : null;
  var lacin = S.laci; S.laci = null; laci(); S.laci = lacin;
  /* kembalikan kartu lama ke tempat asal sebelum isi diganti, supaya tidak ikut terhapus */
  pulangkan();
  root.innerHTML = kerangka();
  var ct = $('v2ct');
  try {
    if (S.pg === 'b') hlmBeranda(ct);
    else if (S.pg === 'r') hlmRekap(ct);
    else if (S.pg === 'd') hlmPosyandu(ct);
    else if (S.pg === 'p') hlmPengaturan(ct);
    else if (S.pg === 'a') { ct.innerHTML = '<div class="pcol" id="v2pcol"></div>'; psAkun($('v2pcol')); }
    else if (S.pg === 'm') { if (!hp()) { S.pg = 'p'; return render(); } hlmLainnya(ct); }
  } catch (er) { ct.innerHTML = '<div class="info w">' + ic('alert') + 'Halaman gagal ditampilkan: ' + e(er.message) + '</div>'; if (window.console) console.error(er); }
  if (fid && $(fid)) { var f = $(fid); f.focus(); if (ss) try { f.setSelectionRange(ss[0], ss[1]); } catch (x) { } }
}
var ASAL = [['cardProf', 'secP'], ['cardPw', 'secP'], ['cardTrm', 'secP'], ['cardPm', 'secP'], ['cardTes', 'secP'], ['dpUbah', 'dpBox'], ['pengBox', null]];
function pulangkan() {
  ASAL.forEach(function (a) {
    var x = $(a[0]); if (!x || !root.contains(x)) return;
    if (a[0] === 'pengBox') { var m = document.querySelector('#app .mainc'); if (m) m.appendChild(x); return; }
    if (a[0] === 'dpUbah') { var l = $('dpList'); if (l && l.parentNode) l.parentNode.insertBefore(x, l); return; }
    var p = $(a[1]); if (p) p.appendChild(x);
  });
}
function segar() { if (jadwalT) return; jadwalT = setTimeout(render, 40); }
function go(pg) {
  S.pg = pg; S.menu = null; S.laci = null;
  var lama = { b: 'b', r: 'r', d: 'd', p: 'p', a: 'p', m: 'p' }[pg];
  try { if (typeof tampilView === 'function') tampilView(lama); } catch (x) { }
  if (pg === 'r') PX.rkSiap();
  if (pg === 'd') PX.dpSiap();
  render(); window.scrollTo(0, 0);
}

/* ---------- klik dan isian ---------- */
function pasangKlik() {
  root.addEventListener('click', function (ev) {
    var t = ev.target.closest('a,button,tr[data-baris],tr[data-kel],tr[data-posd],label,[data-tutup],input'); if (!t || !root.contains(t)) { if (S.menu) { S.menu = null; render(); } return; }
    var d = t.dataset;
    if (t.tagName === 'INPUT' || (t.tagName === 'LABEL' && !d.tab)) { if (t.tagName === 'INPUT' && t.type === 'checkbox') return; return; }
    if (d.go) { ev.preventDefault(); return go(d.go); }
    if (d.ps) { ev.preventDefault(); S.ps = d.ps; S.pg = 'p'; S.simpan = {}; return render(); }
    if (d.tutup !== undefined) { ev.preventDefault(); S.laci = null; return laci(); }
    if (d.tab) { ev.preventDefault(); S.tab = d.tab; S.hal = 1; if (S.pg !== 'b') S.pg = 'b'; render(); var tb = $('v2tabel'); if (tb && t.closest('.todo,.htodo')) tb.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (d.hal) { ev.preventDefault(); S.hal = +d.hal; return isiTabel(data(per())); }
    if (d.kel !== undefined && t.tagName === 'TR') { S.kel = d.kel; S.tab = 'semua'; S.hal = 1; render(); var tb2 = $('v2tabel'); if (tb2) tb2.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (d.menu) { ev.preventDefault(); ev.stopPropagation(); S.menu = S.menu === d.menu ? null : d.menu; return render(); }
    if (d.laci) { S.laci = d.laci; return laci(); }
    if (d.pdf) { var x = cariBaris(d.pdf); if (x && x.d) PX.unduhPdf(x.d, t); return; }
    if (d.tandai) { PX.simpanSetor(per(), [d.tandai], PX.hariIni()); return; }
    if (d.rkj) { ev.preventDefault(); S.rkJ = d.rkj; return render(); }
    if (d.posedit) { ev.stopPropagation(); var p = PX.dasarPos().filter(function (z) { return z.id === d.posedit; })[0]; if (p) (op() ? PX.formNomor(p) : PX.formPos(p)); return; }
    if (d.posd) return rincianPos(d.posd);
    if (d.sklihat) { var s = (PX.SK || {})[d.sklihat]; if (s) PX.lihatSK('SK Kader Posyandu ' + d.sklihat, s.id); return; }
    if (d.opubah) { var a = (window.ADM || []).filter(function (z) { return z.u === d.opubah; })[0]; if (a) modalOp(a); return; }
    if (d.pulih) { if (!confirm('Pulihkan daftar Posyandu dari cadangan ' + d.tgl + '? Keadaan sekarang disimpan dulu sebagai cadangan baru.')) return; t.disabled = true; t.textContent = 'Memulihkan…'; kirimAtur({ aksi: 'pulih', berkas: d.pulih }).then(function (r) { PX.setPOS(r.list || PX.POS); PX.setCAD(r.cadangan || PX.CAD); PX.renderData(); PX.renderBeranda(); PX.toast('Data Posyandu dipulihkan.'); }).catch(function (er) { alert(er.message); render(); }); return; }
    if (d.muat !== undefined) { ev.preventDefault(); if (typeof muat === 'function') muat(); PX.toast('Memuat ulang data…'); return; }
    if (d.tema !== undefined) { ev.preventDefault(); var tm = $('tema'); if (tm) tm.click(); setTimeout(render, 50); return; }
    if (d.bel !== undefined) return bel();
    if (d.akun !== undefined) { if (hp()) { return go(op() ? 'a' : 'm'); } S.ps = 'a'; return go(op() ? 'a' : 'p'); }
    if (d.aksi) { ev.preventDefault(); return aksi(d.aksi, t); }
  });
  root.addEventListener('change', function (ev) {
    var t = ev.target, d = t.dataset;
    if (d.per !== undefined) { var v = t.value.split('|'); S.per = { bl: v[0], th: v[1] }; S.pil = {}; S.hal = 1; var pa = PX.periodeAktif(new Date()); if (S.per.bl === pa.bl && S.per.th === pa.th) S.per = null; return render(); }
    if (d.f) { var k = d.f; if (k === 'kel' || k === 'jn') { S[k] = t.value; S.hal = 1; return render(); } if (k === 'dk' || k === 'dj' || k === 'ds') { S[k] = t.value; return render(); } }
    if (d.pil) { S.pil[d.pil] = t.checked; return isiTabel(data(per())); }
    if (d.pilsemua !== undefined) { var D = data(per()), l = saring(D).slice((S.hal - 1) * PER_HAL, S.hal * PER_HAL); l.forEach(function (x) { S.pil[x.p.id] = t.checked; }); return isiTabel(D); }
    if (d.skunggah) { var f = t.files[0]; t.value = ''; if (!f) return; var info = $('v2sk' + d.skunggah); var fake = { lastChild: info || document.createElement('small') }; PX.unggahSK(d.skunggah, f, fake); return; }
    if (d.pulihjson !== undefined) { var f2 = t.files[0]; t.value = ''; if (!f2) return; var rd = new FileReader(); rd.onload = function () { try { var o = JSON.parse(rd.result); if (!Array.isArray(o.posyandu)) throw new Error('Berkas cadangan tidak dikenali'); if (!confirm('Pulihkan ' + o.posyandu.length + ' Posyandu dari cadangan? Data Posyandu sekarang akan diganti.')) return; PX.simpanDaftar(o.posyandu, 'Data Posyandu dipulihkan.'); } catch (er) { alert(er.message); } }; rd.readAsText(f2); return; }
  });
  root.addEventListener('input', function (ev) {
    var t = ev.target, d = t.dataset;
    if (t.id === 'v2q') { S.q = t.value; S.hal = 1; return isiTabel(data(per())); }
    if (t.id === 'v2dq') { S.dq = t.value; clearTimeout(t._t); t._t = setTimeout(render, 250); return; }
    if (d.set) {
      var asli = { batas: String(PX.BATAS), batasKel: String(PX.batasKelHari()), pengumuman: PX.PENGUMUMAN, wa: PX.WABANTU ? '+' + PX.WABANTU : '' }[d.set];
      if (String(t.value) === String(asli)) delete S.simpan[d.set]; else S.simpan[d.set] = t.value;
      var sb = root.querySelector('.savebar'), n = Object.keys(S.simpan).length;
      if (!!sb !== !!n) render(); else if (sb) sb.querySelector('span').textContent = 'Ada ' + n + ' perubahan belum disimpan';
    }
  });
  root.addEventListener('keydown', function (ev) {
    if (ev.key === 'Enter') { var t = ev.target; if (t.tagName === 'TR' && (t.dataset.kel !== undefined || t.dataset.posd)) { t.click(); } }
  });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && S.laci && !document.getElementById('modalExt')) { S.laci = null; laci(); } });
  /* klik baris tabel (di luar tombol) membuka rincian */
  root.addEventListener('click', function (ev) {
    var tr = ev.target.closest('tr[data-baris]'); if (!tr || ev.target.closest('button,a,input,label')) return;
    S.laci = tr.dataset.baris; laci();
  });
  document.addEventListener('click', function (ev) {
    if (!root || !root.contains(ev.target)) return;
    var t = ev.target.closest('#v2laci [data-aksi],#v2laci [data-tutup]'); if (!t) return;
  });
}
function aksi(a, t) {
  var pr = per(), x;
  switch (a) {
    case 'posterpdf': case 'posterpng': S.menu = null; render(); PX.unduhPoster(PX.hitung(pr.th, pr.bl), pr, a === 'posterpdf' ? 'pdf' : 'png', null); PX.toast('Menyiapkan berkas…'); return;
    case 'xlsx': case 'csv':
      S.menu = null; render();
      try { $('fb').value = pr.bl; $('ft').value = pr.th; $('fj').value = ''; $('fk').value = ''; $('fq').value = ''; if (typeof tampil === 'function') tampil(); } catch (er) { }
      return unduh(a === 'xlsx' ? 'xlsx' : 'csv');
    case 'tandaipilih': var ids = Object.keys(S.pil).filter(function (k) { return S.pil[k]; }), M = PX.SETOR[PX.perKey(pr)] || {}; ids = ids.filter(function (k) { return !M[k]; }); S.pil = {}; if (ids.length) PX.simpanSetor(pr, ids, PX.hariIni()); else render(); return;
    case 'batalpilih': S.pil = {}; return isiTabel(data(pr));
    case 'tandai1': PX.simpanSetor(pr, [S.laci], PX.hariIni()); return;
    case 'batal1': if (confirm('Batalkan tanda berkas fisik diterima?')) PX.simpanSetor(pr, [S.laci], ''); return;
    case 'pdf1': x = cariBaris(S.laci); if (x && x.d) PX.unduhPdf(x.d, t); return;
    case 'nomor': x = cariBaris(S.laci); if (x) (utama() ? PX.formPos(x.p) : PX.formNomor(x.p)); return;
    case 'antar': S.laci = null; laci(); return bukaAntar();
    case 'cetakrekap': case 'xlsrekap':
      PX.rkSiap(); try { $('rb').value = pr.bl; $('rt').value = pr.th; } catch (er) { }
      return a === 'cetakrekap' ? PX.cetakRekap() : PX.unduhRekap();
    case 'xlsangka': PX.setAng({ bl: pr.bl, th: pr.th, j: S.rkJ === 'b' ? 'Posyandu Balita' : 'Posyandu Lansia', k: '' }); return PX.unduhAngka();
    case 'darisk': return PX.simpanDariSK();
    case 'impor': PX.bukaUbah('excel'); render(); setTimeout(function () { var u = $('v2ubah'); if (u) u.scrollIntoView({ behavior: 'smooth' }); }, 60); return;
    case 'ekspor': return PX.ekspor();
    case 'tambahpos': return PX.formPos(null);
    case 'peralihan': return PX.dialogPeralihan(!PX.fisikSaja(), function () { render(); });
    case 'batalset': S.simpan = {}; return render();
    case 'simpanset': return simpanSet(t);
    case 'optambah': return modalOp(null);
    case 'ruang': var k = $('v2rket'); var b = t.tagName === 'BUTTON' ? t : document.createElement('button'); PX.hitungRuangKlien(b, k || document.createElement('p')); return;
    case 'cadang': t.disabled = true; t.textContent = 'Membuat cadangan…'; kirimAtur({ aksi: 'cadang' }).then(function (r) { PX.setCAD(r.cadangan || []); PX.toast('Cadangan tersimpan.'); render(); }).catch(function (er) { alert(er.message); render(); }); return;
    case 'unduhjson':
      var blob = new Blob([JSON.stringify({ versi: 1, tanggal: new Date().toISOString(), batas: PX.BATAS, posyandu: PX.POS }, null, 1)], { type: 'application/json' }), aa = document.createElement('a');
      aa.href = URL.createObjectURL(blob); aa.download = 'cadangan-pantau-' + new Date().toISOString().slice(0, 10) + '.json'; document.body.appendChild(aa); aa.click(); setTimeout(function () { URL.revokeObjectURL(aa.href); aa.remove(); }, 1000); return;
    case 'log': t.disabled = true; jsonp({ aksi: 'log', u: CRED.u, p: CRED.p }).then(function (r) { if (!r || !r.ok) throw new Error((r && r.pesan) || 'Gagal memuat'); LOG = r.log || []; LOGN = 10; render(); }).catch(function (er) { alert(er.message); t.disabled = false; }); return;
    case 'logmore': LOGN += 30; var lb = $('v2log'); if (lb) lb.innerHTML = logHtml(); return;
    case 'sebagai': if (window.CRED && CRED.as) return PX.gantiAs(''); return PX.pilihOperator();
    case 'keluar': if (confirm('Keluar dari Pantau?')) { var o = $('out'); if (o) o.click(); else if (typeof keluar === 'function') keluar(); } return;
  }
}

/* ---------- mulai ---------- */
window.V2 = { segar: segar, render: render, go: go };
function mulai() {
  render();
  var app = $('app');
  if (app && window.MutationObserver) new MutationObserver(segar).observe(app, { attributes: true, attributeFilter: ['class'] });
  var lt = document.querySelector('.lastt'); if (lt && window.MutationObserver) new MutationObserver(segar).observe(lt, { childList: true, characterData: true, subtree: true });
  window.addEventListener('resize', function () { clearTimeout(mulai._r); mulai._r = setTimeout(function () { if (aktif()) render(); }, 150); });
  /* modal lama: tutup lewat tombol "Tutup" tetap bekerja; segarkan setelah modal ditutup */
  new MutationObserver(function (m) { m.forEach(function (r) { Array.prototype.forEach.call(r.removedNodes, function (n) { if (n.id === 'modalExt') segar(); }); }); }).observe(document.body, { childList: true });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(mulai, 0); }); else setTimeout(mulai, 0);
})();
