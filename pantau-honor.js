/* ===== Pantau: modul Administrasi Honor Kader (hanya admin kecamatan) =====
 * Data di server (Code.gs, aksi "honor"). Dokumen PDF dibuat di peramban dengan pdf-lib, Excel dengan SheetJS.
 * Nomor rekening dan NIK hanya diambil setelah login admin kecamatan dan disamarkan di layar. */
(function () {
'use strict';
var JENIS = ['Balita', 'Lansia', 'Poskesdes'];
var JN_PANJANG = { Balita: 'Posyandu Balita', Lansia: 'Posyandu Lansia', Poskesdes: 'Poskesdes' };
var KEL_H = ['Mamboro', 'Mamboro Barat', 'Taipa', 'Kayumalue Pajeko', 'Kayumalue Ngapa'];
var BLN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
var TABS = [['r', 'Ringkasan'], ['db', 'Daftar Bayar'], ['rk', 'Rekap'], ['kw', 'Kwitansi'], ['bk', 'Berkas Pengajuan'], ['pt', 'Potongan'], ['tf', 'Daftar Transfer'], ['rek', 'Rekening Kader'], ['rw', 'Riwayat']];
var IK = {
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  check: '<path d="M20 6 9 17l-5-5"/>', plus: '<path d="M12 5v14M5 12h14"/>', dl: '<path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', alert: '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
  cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>', gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>', edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>', sync: '<path d="M21 12a9 9 0 0 1-15.5 6.3M3 12A9 9 0 0 1 18.5 5.7M19 2v4h-4M5 22v-4h4"/>', list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'
};
function ic(n) { return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true">' + (IK[n] || '') + '</svg>'; }
function e(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function rp(n) { return 'Rp' + (Math.round(+n || 0)).toLocaleString('id-ID'); }
function ang(n) { return (Math.round(+n || 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
function samar(no) { no = String(no || ''); return no ? no.slice(0, 4) + ' •••• ' + no.slice(-4) : ''; }
function tglId(d) { d = d || new Date(); return d.getDate() + ' ' + BLN[d.getMonth()] + ' ' + d.getFullYear(); }
function blnLabel(ym) { var p = String(ym).split('-'); return BLN[(+p[1]) - 1] + ' ' + p[0]; }
function $(i) { return document.getElementById(i); }
function px() { return window.PX; }
function toast(t) { if (px()) PX.toast(t); }

/* ---------- terbilang ---------- */
var SATUAN = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];
function tb(n) {
  n = Math.floor(n);
  if (n < 12) return SATUAN[n];
  if (n < 20) return tb(n - 10) + ' belas';
  if (n < 100) return tb(Math.floor(n / 10)) + ' puluh' + (n % 10 ? ' ' + tb(n % 10) : '');
  if (n < 200) return 'seratus' + (n - 100 ? ' ' + tb(n - 100) : '');
  if (n < 1000) return tb(Math.floor(n / 100)) + ' ratus' + (n % 100 ? ' ' + tb(n % 100) : '');
  if (n < 2000) return 'seribu' + (n - 1000 ? ' ' + tb(n - 1000) : '');
  if (n < 1e6) return tb(Math.floor(n / 1000)) + ' ribu' + (n % 1000 ? ' ' + tb(n % 1000) : '');
  if (n < 1e9) return tb(Math.floor(n / 1e6)) + ' juta' + (n % 1e6 ? ' ' + tb(n % 1e6) : '');
  if (n < 1e12) return tb(Math.floor(n / 1e9)) + ' miliar' + (n % 1e9 ? ' ' + tb(n % 1e9) : '');
  return tb(Math.floor(n / 1e12)) + ' triliun' + (n % 1e12 ? ' ' + tb(n % 1e12) : '');
}
function terbilang(n) { n = Math.round(+n || 0); var s = n === 0 ? 'nol' : tb(n); return (s + ' rupiah').replace(/\s+/g, ' ').replace(/(^|\s)\S/g, function (c) { return c.toUpperCase(); }); }
window.HONOR_TERBILANG = terbilang;

/* ---------- keadaan ---------- */
var H = { d: null, per: null, tab: 'r', jn: 'Balita', q: '', rq: '', rf: 'semua', rw: null, rwPer: null, view: '', muat: false, err: '', ct: null, lihat: {} };
function utama() { return px() && PX.utama(); }
function st() { return (H.per && H.per.st) || {}; }
function kunci() { return !!st().selesai; }
function calon() { return (H.d && H.d.calon) || []; }
function db() { return (H.d && H.d.rek) || {}; }
function bayar() { return H.per ? H.per.penerima.filter(function (r) { return r.bayar !== false; }) : []; }
function bruto(r) { return r.bayar === false ? 0 : r.nominal * r.bulan; }
function potOf(k) { return ((H.per && H.per.potongan) || []).filter(function (p) { return p.k === k; }); }
function potSum(k) { return potOf(k).reduce(function (s, p) { return s + p.nom; }, 0); }
function rekOf(r) { if (st().ttd && r && Object.prototype.hasOwnProperty.call(r, 'rek')) return r.rek || null; var x = db()[r.k]; return x || null; }
function total() {
  var t = { n: 0, bruto: 0, pot: 0, j: {} }; JENIS.forEach(function (j) { t.j[j] = { n: 0, bruto: 0, pot: 0 }; });
  bayar().forEach(function (r) { var b = bruto(r), p = potSum(r.k), g = t.j[r.jenis]; t.n++; t.bruto += b; t.pot += p; g.n++; g.bruto += b; g.pot += p; });
  return t;
}
function kurangRek() { return bayar().filter(function (r) { var x = rekOf(r); return !x || !x.no || !x.nik; }); }

/* ---------- server ---------- */
function ambil(op, extra) {
  var q = { aksi: 'honor', op: op, u: CRED.u, p: CRED.p }; for (var k in extra) if (extra[k] != null) q[k] = extra[k];
  return jsonp(q, 60000).then(function (r) { if (!r || r.ok === false) throw new Error((r && r.pesan) || 'Gagal memuat'); return r; });
}
function muat(perId) {
  H.muat = true; H.err = ''; gambar();
  return ambil('muat', { per: perId }).then(function (r) { if (!r.cfg) throw new Error('Server belum diperbarui untuk modul honor. Tempel Code.gs terbaru di Apps Script lalu Terapkan versi baru.'); H.d = r; H.per = r.per || null; H.muat = false; gambar(); })
    .catch(function (er) { H.muat = false; H.err = er.message; gambar(); });
}
/* Data honor diambil lebih dulu di latar (dipanggil Pantau sesudah masuk). Bila menu Honor dibuka saat masih berjalan, tampilan menunggu hasil yang sama (tidak minta dua kali). */
function pra() {
  if (!utama() || H.d || H.muat || H.err || H.praJalan) return;
  H.praJalan = true; H.muat = true;
  ambil('muat', {}).then(function (r) {
    H.praJalan = false; H.muat = false;
    if (r.cfg) { if (!H.d) { H.d = r; H.per = r.per || null; H.praT = Date.now(); } gambar(); }
    else if (H.ct && document.body.contains(H.ct)) muat();
  }).catch(function () { H.praJalan = false; H.muat = false; if (H.ct && document.body.contains(H.ct)) muat(); });
}
/* Data hasil pengambilan awal sudah lebih dari 30 detik: tampil dulu, diperbarui di latar (tombol redup sampai selesai). */
function segarkan() {
  H.segar = true; tandaSibuk();
  ambil('muat', { per: H.per && H.per.id }).then(function (r) {
    H.segar = false;
    if (r.cfg && !adaAntre()) { H.d = r; H.per = r.per || H.per; H.praT = Date.now(); H.rw = null; }
    tandaSibuk(); gambar();
  }).catch(function () { H.segar = false; tandaSibuk(); });
}
var SIBUK = false;
/* Tandai langkah: tampilan langsung berubah, simpan berjalan di latar (antrean berurutan). Gagal = dikembalikan ke data server terakhir. */
var LATAR_L = { dbt: '"Daftar bayar dibuat"', cetak: '"Daftar bayar dicetak"', ttd: '"Sudah ditandatangani"', rekap: '"Rekap selesai"', kw: 'kwitansi', berkas: '"Berkas lengkap"',
  setor: '"Sudah disetor"', dana: '"Dana masuk"', pot: '"Potongan selesai"', serah: '"Diserahkan ke bendahara"' };
var ANTRE = [], ANTRE_JALAN = false, PER_SERVER = null;
function adaAntre() { return ANTRE_JALAN || ANTRE.length > 0; }
function tandaSibuk() { if (H.ct) H.ct.classList.toggle('h-tunggu', adaAntre() || !!H.segar); }
function terapLokal(per, f) {
  var s = per.st = per.st || {}, l = f.l;
  if (l === 'cetak') s.cetakN = (s.cetakN || 0) + 1;
  if (l === 'kw' && f.kw) per.kw = f.kw;
  if (l === 'berkas' && f.cek) per.cek = f.cek;
  if (l === 'setor') s.setorTgl = f.tgl;
  if (l === 'dana') { s.danaJml = f.jumlah; s.danaTgl = f.tgl; }
  if (l === 'serah') s.serahTgl = f.tgl;
  if (l === 'ttd') per.ulang = [];
  s[l] = Date.now();
}
function kirimLatar(f) {
  f.aksi = 'honor'; f.per = H.per.id;
  if (!adaAntre()) PER_SERVER = JSON.parse(JSON.stringify(H.per));
  terapLokal(H.per, f); ANTRE.push(f); tandaSibuk(); gambar();
  jalankanAntre();
  return Promise.resolve({ ok: true, per: H.per });
}
async function jalankanAntre() {
  if (ANTRE_JALAN) return; ANTRE_JALAN = true;
  var pt = null;
  while (ANTRE.length) {
    var f = ANTRE[0]; pt = window.Dlg && Dlg.simpan ? Dlg.simpan(LATAR_L[f.l]) : null;
    try {
      var r = await kirimAtur(f, { latar: true }); ANTRE.shift();
      if (r.daftar && H.d) H.d.daftar = r.daftar;
      if (r.per) PER_SERVER = r.per;
    } catch (er) {
      var fg = ANTRE[0]; ANTRE = []; ANTRE_JALAN = false;
      if (H.per && PER_SERVER && H.per.id === PER_SERVER.id) { H.per = PER_SERVER; var tb = { dbt: 'db', cetak: 'db', ttd: 'db', rekap: 'rk', kw: 'kw', berkas: 'bk', setor: 'bk', dana: 'bk', pot: 'pt', serah: 'tf' }[fg.l]; if (tb && !terbuka(H.tab)) H.tab = tb; }
      tandaSibuk(); H.rw = null; gambar();
      var msg = 'Gagal menyimpan ' + LATAR_L[fg.l] + '. Status dikembalikan.' + (er && er.message ? ' (' + er.message + ')' : '');
      if (pt) pt.gagal(msg, function () { if (H.per && H.per.id === fg.per) kirim(fg); }); else alert(msg);
      return;
    }
  }
  ANTRE_JALAN = false;
  if (H.per && PER_SERVER && H.per.id === PER_SERVER.id) H.per = PER_SERVER;
  tandaSibuk(); H.rw = null; gambar(); if (pt) pt.ok();
}
window.addEventListener('beforeunload', function (ev) { if (adaAntre()) { ev.preventDefault(); ev.returnValue = ''; } });
function kirim(f, ok) {
  if (f.op === 'langkah' && LATAR_L[f.l] && H.per && !kunci() && !SIBUK) return kirimLatar(f);
  if (adaAntre()) return Promise.reject(new Error('Tunggu sampai perubahan sebelumnya tersimpan'));
  if (SIBUK) return Promise.reject(new Error('Masih menyimpan, tunggu sebentar'));
  SIBUK = true;
  f.aksi = 'honor'; if (H.per && !f.per && f.op !== 'buat' && f.op !== 'pengaturan' && f.op !== 'rek' && f.op !== 'rekimpor') f.per = H.per.id;
  return kirimAtur(f).then(function (r) {
    SIBUK = false;
    if (r.per) H.per = r.per;
    if (r.daftar && H.d) H.d.daftar = r.daftar;
    if (r.cfg && H.d) H.d.cfg = r.cfg;
    if (r.rek1 && H.d) H.d.rek[r.k] = r.rek1;
    if (ok) toast(ok);
    H.rw = null; gambar(); return r;
  }).catch(function (er) { SIBUK = false; throw er; });
}
function gagal(er) { alert(er.message || er); gambar(); }

/* ---------- tahapan ---------- */
function langkah13() {
  var s = st();
  return [
    { g: 0, t: 'Persiapan data honor', ok: !!H.per },
    { g: 0, t: 'Daftar bayar dibuat', ok: !!s.dbt },
    { g: 0, t: 'Daftar bayar dicetak', ok: !!s.cetak },
    { g: 0, t: 'Menunggu tanda tangan kader', ok: !!s.ttd },
    { g: 0, t: 'Daftar bayar sudah ditandatangani', ok: !!s.ttd },
    { g: 1, t: 'Rekapitulasi dibuat', ok: !!s.rekap },
    { g: 1, t: 'Kwitansi dibuat', ok: !!s.kw },
    { g: 1, t: 'Berkas pengajuan lengkap', ok: !!s.berkas },
    { g: 1, t: 'Disetor ke DPPKAD', ok: !!s.setor },
    { g: 2, t: 'Dana masuk rekening kantor', ok: !!s.dana },
    { g: 3, t: 'Potongan dicatat', ok: !!s.pot },
    { g: 3, t: 'Daftar transfer diserahkan ke bendahara', ok: !!s.serah },
    { g: 3, t: 'Administrasi honor selesai', ok: !!s.selesai }
  ];
}
function terbuka(tab) {
  var s = st();
  if (tab === 'rk') return !!s.ttd; if (tab === 'kw') return !!s.rekap; if (tab === 'bk') return !!s.kw;
  if (tab === 'pt' || tab === 'tf') return !!s.dana; return true;
}
function syaratTab(tab) {
  return { rk: 'Rekap terbuka setelah daftar bayar ditandai sudah ditandatangani.', kw: 'Kwitansi terbuka setelah rekap ditandai selesai.', bk: 'Berkas pengajuan terbuka setelah kwitansi disimpan.',
    pt: 'Potongan terbuka setelah dana masuk ke rekening kantor dicatat.', tf: 'Daftar transfer terbuka setelah dana masuk ke rekening kantor dicatat.' }[tab] || '';
}

/* ---------- kerangka modul ---------- */
function render(ct) {
  H.ct = ct;
  if (!utama()) { ct.innerHTML = '<div class="info w">' + ic('alert') + 'Modul honor hanya untuk admin kecamatan.</div>'; return; }
  if (!H.d && !H.muat && !H.err) { muat(); }
  else if (H.d && H.praT && !H.segar && !H.muat && !adaAntre() && Date.now() - H.praT > 30000) segarkan();
  gambar();
  tandaSibuk();
}
function gambar() {
  var ct = H.ct; if (!ct || !document.body.contains(ct)) return;
  if (H.muat && !H.d) { ct.innerHTML = '<div class="hn"><section class="cd"><p class="mu">Memuat data honor…</p></section></div>'; return; }
  if (H.err && !H.d) { ct.innerHTML = '<div class="hn"><div class="info w">' + ic('alert') + e(H.err) + '</div><div><button class="bt pri" type="button" data-hx="muatulang">Coba lagi</button></div></div>'; pasang(ct); return; }
  if (!H.d) return;
  var h = '<div class="hn">' + bar();
  if (H.view === 'semua') h += vSemua();
  else if (!H.per) h += vKosong();
  else {
    h += tabs();
    if (H.d.calonPesan) h += '<div class="info w">' + ic('alert') + e(H.d.calonPesan) + '</div>';
    if (kunci()) h += '<div class="next ok"><div class="nt"><b>Periode Honor ' + e(H.per.label) + ' sudah selesai dan terkunci</b><small>Semua dokumen tetap bisa diunduh. Untuk mengubah data, buka kunci lewat Semua periode.</small></div></div>';
    if (H.per.ulang && H.per.ulang.length && !kunci()) h += '<div class="ulang"><b>Ada perubahan setelah ditandatangani.</b> Buat ulang: ' + e(H.per.ulang.join(', ')) + '.</div>';
    if (!terbuka(H.tab) && H.tab !== 'rek' && H.tab !== 'rw') h += '<section class="cd"><div class="kunci">' + ic('lock') + '<b>' + e(TABS.filter(function (t) { return t[0] === H.tab; })[0][1]) + ' belum terbuka</b><span>' + syaratTab(H.tab) + '</span></div></section>';
    else h += ({ r: vRingkasan, db: vDaftar, rk: vRekap, kw: vKwitansi, bk: vBerkas, pt: vPotongan, tf: vTransfer, rek: vRekening, rw: vRiwayat }[H.tab] || vRingkasan)();
  }
  ct.innerHTML = h + '</div>';
  pasang(ct); tempelMenu();
  if (H.tab === 'rw' && H.rw === null && H.per) muatRiwayat();
}
function bar() {
  var dl = H.d.daftar || [];
  var opt = dl.map(function (x) { return '<option value="' + e(x.id) + '"' + (H.per && H.per.id === x.id ? ' selected' : '') + '>Honor ' + e(x.label) + '</option>'; }).join('');
  return '<div class="hbar">' + (dl.length ? '<label class="sel">' + ic('cal') + '<select data-hp aria-label="Periode honor">' + opt + '</select><b>' + (H.per ? 'Honor ' + e(H.per.label) : 'Pilih periode') + '</b></label>' : '') +
    '<div class="sp"></div><button class="bt out sm" type="button" data-hx="semua">' + ic('list') + ' Semua periode</button><button class="bt out sm" type="button" data-hx="atur">' + ic('gear') + ' Pengaturan honor</button>' +
    '<button class="bt pri sm" type="button" data-hx="baru">' + ic('plus') + ' Periode baru</button></div>';
}
function tabs() {
  return '<nav class="htabs" aria-label="Bagian honor">' + (H.per ? '<span class="hpl">' + e(H.per.label) + '</span>' : '') + TABS.map(function (t) {
    var lk = !terbuka(t[0]);
    return '<button type="button" data-ht="' + t[0] + '" class="' + (H.tab === t[0] ? 'on' : '') + '">' + t[1] + (lk ? ic('lock') : '') + '</button>';
  }).join('') + '</nav>';
}
function vKosong() {
  return '<section class="cd"><div class="kunci">' + ic('file') + '<b>Belum ada periode honor</b><span>Buat periode pertama, misalnya Honor ' + blnLabel(new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0')) + '. Penerima diambil dari SK di Data Posyandu dan daftar kader Poskesdes.</span>' +
    '<button class="bt pri" type="button" data-hx="baru">' + ic('plus') + ' Buat periode honor</button>' + (H.d.cfg.poskesdes.length ? '' : '<span class="sm">Daftar kader Poskesdes masih kosong. Isi dulu di <a href="#" data-hx="atur">Pengaturan honor</a>.</span>') + '</div></section>';
}

/* ---------- Ringkasan ---------- */
function langkahBerikut() {
  var L = langkah13(), i = 0; while (i < L.length && L[i].ok) i++;
  var s = st();
  if (i >= L.length) return null;
  var m = [
    null,
    ['Buat daftar bayar', 'Periksa nama dan nominal, lalu unduh PDF daftar bayar.', 'Buka Daftar Bayar', 'tab:db'],
    ['Kumpulkan tanda tangan kader', 'Cetak daftar bayar, lalu setelah semua tanda tangan terkumpul, tandai sudah ditandatangani.', 'Tandai sudah ditandatangani', 'ttd'],
    ['Kumpulkan tanda tangan kader', 'Daftar bayar dicetak ' + (s.cetak ? tglId(new Date(s.cetak)) : '') + '. Setelah semua tanda tangan terkumpul, tandai sudah ditandatangani.', 'Tandai sudah ditandatangani', 'ttd'],
    ['Kumpulkan tanda tangan kader', '', 'Tandai sudah ditandatangani', 'ttd'],
    ['Buat rekapitulasi honor', 'Rekap dihitung otomatis dari daftar bayar.', 'Buka Rekap', 'tab:rk'],
    ['Buat kwitansi', 'Nominal kwitansi diambil dari total rekap.', 'Buka Kwitansi', 'tab:kw'],
    ['Periksa kelengkapan berkas pengajuan', 'Urutan: Kwitansi, Rekap, Daftar Bayar bertanda tangan, SK.', 'Buka Berkas', 'tab:bk'],
    ['Setor berkas ke DPPKAD', 'Setelah berkas disetor, tandai di sini.', 'Tandai sudah disetor', 'setor'],
    ['Tunggu dana masuk ke rekening kantor', 'Setelah pengajuan disetujui dan dana masuk, catat jumlahnya.', 'Catat dana masuk', 'dana'],
    ['Catat potongan honor (jika ada)', 'Bila tidak ada potongan, langsung tandai potongan selesai.', 'Buka Potongan', 'tab:pt'],
    ['Serahkan daftar transfer ke bendahara', 'Unduh daftar transfer, bawa ke bendahara, lalu tandai sudah diserahkan.', 'Buka Daftar Transfer', 'tab:tf'],
    ['Selesaikan periode', 'Periode dikunci menjadi arsip. Dokumen tetap bisa diunduh.', 'Selesaikan dan kunci', 'selesai']
  ][i];
  return m;
}
function vRingkasan() {
  var t = total(), L = langkah13(), nOk = L.filter(function (x) { return x.ok; }).length, nb = langkahBerikut(), kr = kurangRek().length, s = st(), h = '';
  if (nb && !kunci()) h += '<div class="next"><div class="nt"><b>Langkah berikutnya: ' + e(nb[0]) + '</b>' + (nb[1] ? '<small>' + e(nb[1]) + '</small>' : '') + '</div><button class="bt pri" type="button" data-hx="' + e(nb[3]) + '">' + e(nb[2]) + '</button></div>';
  h += '<div class="kp4"><div class="kp"><span>Kader penerima</span><b>' + t.n + '</b><small>Balita ' + t.j.Balita.n + ' · Lansia ' + t.j.Lansia.n + ' · Poskesdes ' + t.j.Poskesdes.n + '</small></div>' +
    '<div class="kp"><span>Total honor (bruto)</span><b>' + rp(t.bruto) + '</b><small>' + H.per.n + ' bulan · ' + e(H.per.label) + '</small></div>' +
    '<div class="kp"><span>Rekening / NIK belum lengkap</span><b class="' + (kr ? 'r' : '') + '">' + kr + '</b><small><a href="#" data-ht="rek">Lengkapi di Rekening Kader</a></small></div>' +
    '<div class="kp"><span>Potongan · ditransfer ke kader</span><b>' + rp(t.pot) + '</b><small>Bersih ' + rp(t.bruto - t.pot) + (s.dana ? '' : ' · potongan dibuka setelah dana masuk') + '</small></div></div>';
  var G = [['A · Daftar bayar', 0], ['B · Pengajuan ke DPPKAD', 1], ['C · Dana masuk', 2], ['D · Ke bendahara', 3]], cur = -1;
  L.forEach(function (x, i) { if (cur < 0 && !x.ok) cur = i; });
  h += '<section class="cd"><div class="hd"><h2>Tahapan administrasi</h2><span class="pl ' + (nOk === 13 ? 'g' : 'a') + '">' + nOk + ' dari 13 selesai</span><div class="sp"></div>' +
    (!kunci() && nOk > 1 ? '<button class="bt ghost sm" type="button" data-hx="mundur">Mundurkan tahap terakhir</button>' : '') + '</div><div class="thp">' + G.map(function (g) {
      var it = L.map(function (x, i) { x.i = i; return x; }).filter(function (x) { return x.g === g[1]; }), ok = it.filter(function (x) { return x.ok; }).length;
      return '<div><h4>' + g[0] + '</h4><div class="hpb"><i style="width:' + Math.round(ok * 100 / it.length) + '%"></i></div>' + it.map(function (x) {
        return '<div class="stp ' + (x.ok ? 'ok' : (x.i === cur ? 'now' : '')) + '"><span class="d">' + (x.ok ? ic('check') : '') + '</span>' + (x.i + 1) + '. ' + e(x.t) + '</div>';
      }).join('') + '</div>';
    }).join('') + '</div><p class="hint">Setiap tahap hanya berubah lewat tombol konfirmasi Anda. Dana masuk dan penyerahan ke bendahara tidak pernah dianggap selesai otomatis.</p></section>';
  h += '<div class="g2"><section class="cd tblc"><div class="hd"><h2>Rincian honor</h2><span class="mu sm">dihitung otomatis dari daftar bayar</span></div><div class="tw"><table class="tbl"><thead><tr><th>Jenis</th><th class="n">Kader</th><th class="n">Bulan</th><th class="n">Per bulan</th><th class="n">Jumlah</th></tr></thead><tbody>' +
    grupRekap().map(function (g) { return '<tr><td>' + e(JN_PANJANG[g.j]) + '</td><td class="n">' + g.n + '</td><td class="n">' + g.bulan + '</td><td class="n">' + rp(g.nom) + '</td><td class="n">' + rp(g.jml) + '</td></tr>'; }).join('') +
    '<tr class="hjml"><td>Jumlah</td><td class="n">' + t.n + '</td><td></td><td></td><td class="n">' + rp(t.bruto) + '</td></tr></tbody></table></div></section>' +
    '<section class="cd"><div class="hd"><h2>Periode honor</h2></div>' + (H.d.daftar || []).slice(0, 5).map(function (x) {
      return '<div class="kvl"><span><a href="#" data-hper="' + e(x.id) + '">Honor ' + e(x.label) + '</a></span>' + pilTahap(x) + '</div>';
    }).join('') + '<p class="hint">Periode lama tetap bisa dibuka dan diunduh. Datanya tidak ikut berubah walaupun SK berganti.</p></section></div>';
  return h;
}
function pilTahap(x) {
  if (x.kunci) return '<span class="pl g">Selesai · terkunci</span>';
  var t = x.tahap, n = ['', 'Persiapan', 'Daftar bayar dibuat', 'Menunggu tanda tangan', 'Ditandatangani', 'Rekap dibuat', 'Kwitansi dibuat', 'Berkas lengkap', 'Disetor ke DPPKAD', 'Dana masuk', 'Potongan dicatat', 'Diserahkan ke bendahara', 'Selesai'][t] || '';
  return '<span class="pl ' + (t >= 9 ? 'b' : 'a') + '">' + n + '</span>';
}
function grupRekap() {
  var m = {}, urut = ['Lansia', 'Balita', 'Poskesdes'];
  bayar().forEach(function (r) { var k = r.jenis + '|' + r.nominal + '|' + r.bulan; if (!m[k]) m[k] = { j: r.jenis, nom: r.nominal, bulan: r.bulan, n: 0, jml: 0 }; m[k].n++; m[k].jml += bruto(r); });
  return Object.keys(m).map(function (k) { return m[k]; }).sort(function (a, b) { return urut.indexOf(a.j) - urut.indexOf(b.j) || b.n - a.n; });
}

/* ---------- Daftar Bayar ---------- */
function vDaftar() {
  var s = st(), kr = kurangRek(), h = '';
  /* Tiga langkah: unduh (otomatis dianggap dicetak), tanda tangan, sudah ditandatangani. Hanya tanda tangan yang ditandai manual. */
  var o1 = !!(s.dbt || s.cetak), o2 = !!s.ttd, tUnduh = s.cetak || s.dbt;
  var langkahBox = function (no, judul, ket, ok, now) { return '<div class="sp3' + (ok ? ' ok' : now ? ' now' : '') + '"><span class="stn">' + (ok ? '&#10003;' : no) + '</span><div><b>' + judul + '</b>' + (ket ? '<small>' + ket + '</small>' : '') + '</div></div>'; };
  h += '<section class="cd"><div class="hd"><h2>Status daftar bayar</h2><div class="sp"></div><span class="mu sm">' + (o2 ? 'Ditandatangani ' + tglId(new Date(s.ttd)) : o1 ? 'Diunduh ' + tglId(new Date(tUnduh)) : 'Belum diunduh') + '</span></div>' +
    '<div class="sbx3">' + langkahBox(1, 'Unduh dan cetak', o1 ? tglId(new Date(tUnduh)) : 'Belum diunduh', o1, !o1) + '<span class="ln' + (o1 ? ' ok' : '') + '"></span>' +
    langkahBox(2, 'Tanda tangan', o2 ? tglId(new Date(s.ttd)) : o1 ? 'Menunggu' : '', o2, o1 && !o2) + '<span class="ln' + (o2 ? ' ok' : '') + '"></span>' +
    langkahBox(3, 'Sudah ditandatangani', o2 ? 'Nama dan nominal dikunci' : '', o2, false) + '</div>';
  if (!kunci()) {
    h += '<div class="acts" style="margin-top:14px"><span class="mu sm" style="flex:1">' + (o2 ? 'Nama dan nominal dikunci. Perubahan perlu konfirmasi dan tercatat di Riwayat.' : o1 ? 'Setelah semua tanda tangan di kertas lengkap dan sudah Anda periksa, tandai di sini.' : 'Unduh PDF daftar bayar, lalu cetak untuk ditandatangani.') + '</span>' +
      (!o2 && !o1 ? '<button class="bt pri sm" type="button" data-hx="pdfdb">' + ic('dl') + ' Unduh PDF daftar bayar</button>' : '') +
      (!o2 && o1 ? '<button class="bt out sm" type="button" data-hx="pdfdb">' + ic('dl') + ' Unduh ulang PDF</button><button class="bt pri sm" type="button" data-hx="ttd">Tandai sudah ditandatangani…</button>' : '') + '</div>';
  }
  h += '</section>';
  if (kr.length) h += '<div class="info w">' + ic('alert') + '<span style="flex:1"><b>' + kr.length + ' kader</b> belum punya nomor rekening atau NIK. Kolomnya kosong (abu-abu) di daftar bayar.</span><a href="#" data-ht="rek">Lengkapi di Rekening Kader</a></div>';
  var t = total(), rows = H.per.penerima.filter(function (r) { return r.jenis === H.jn; }), q = H.q.toLowerCase();
  if (q) rows = rows.filter(function (r) { return (r.nama + ' ' + r.pos + ' ' + r.kel).toLowerCase().indexOf(q) >= 0; });
  var no = 0;
  h += '<section class="cd tblc"><div class="flt" style="flex-wrap:wrap"><div class="seg" role="tablist">' + JENIS.map(function (j) { return '<button type="button" data-hj="' + j + '" class="' + (H.jn === j ? 'on' : '') + '">' + j + ' ' + t.j[j].n + '</button>'; }).join('') + '</div>' +
    '<label class="srch">' + ic('search') + '<input id="hq" type="search" placeholder="Cari nama atau Posyandu…" value="' + e(H.q) + '" autocomplete="off" aria-label="Cari kader"></label><div class="sp"></div>' +
    (!kunci() && !s.setor ? '<button class="bt out sm" type="button" data-hx="tambah">' + ic('plus') + ' Tambah kader</button>' : '') +
    (!s.ttd && !kunci() ? '<button class="bt out sm" type="button" data-hx="segarkan" title="Samakan dengan SK terbaru">' + ic('sync') + ' Samakan dengan SK</button>' : '') +
    '<button class="bt out sm" type="button" data-hx="pdfdb">' + ic('eye') + ' Unduh PDF</button>' +
    '<button class="bt out sm" type="button" data-hx="xlsdb">' + ic('dl') + ' Excel</button></div>' +
    '<div class="tw"><table class="tbl"><thead><tr><th class="c">No</th><th>Nama (sesuai SK)</th><th>Posyandu</th><th>Kelurahan</th><th>No. rekening</th><th>NIK</th><th class="n">Bulan</th><th class="n">Jumlah</th><th>Dibayar</th><th></th></tr></thead><tbody>' +
    rows.map(function (r) {
      var x = rekOf(r), ok = r.bayar !== false; if (ok) no++;
      return '<tr class="' + (ok ? '' : 'off') + '"><td class="c">' + (ok ? no : '–') + '</td><td><b>' + e(r.nama) + '</b>' + (r.tambahan ? ' <span class="pl b">tambahan</span>' : '') + (!ok && r.alasan ? '<br><small class="mu">' + e(r.alasan) + '</small>' : '') + '</td><td>' + e(r.pos) + '</td><td>' + e(r.kel) + '</td>' +
        '<td>' + (x && x.no ? '<span class="mono">' + e(samar(x.no)) + '</span>' : '<span class="pl r">Belum ada</span>') + '</td><td>' + (x && x.nik ? '<span class="mono">' + e(samar(x.nik)) + '</span>' : '<span class="pl r">Belum ada</span>') + '</td>' +
        '<td class="n">' + r.bulan + '</td><td class="n">' + rp(bruto(r) || r.nominal * r.bulan) + '</td><td>' + (kunci() || s.setor ? (ok ? 'Ya' : 'Tidak') : '<button type="button" class="tog' + (ok ? '' : ' off') + '" role="switch" aria-checked="' + ok + '" aria-label="Dibayar ' + e(r.nama) + '" data-hbayar="' + e(r.k) + '"></button>') + '</td>' +
        '<td class="ac">' + (kunci() || s.setor ? '' : '<button class="ib s" type="button" data-hubah="' + e(r.k) + '" aria-label="Ubah ' + e(r.nama) + '">' + ic('edit') + '</button>') + '</td></tr>';
    }).join('') + '<tr class="hjml"><td colspan="7">Total ' + JN_PANJANG[H.jn] + ' · ' + t.j[H.jn].n + ' kader</td><td class="n">' + rp(t.j[H.jn].bruto) + '</td><td colspan="2"></td></tr></tbody></table></div>' +
    '<div class="hcards">' + (function () { var n2 = 0; return rows.map(function (r) { var x = rekOf(r), ok = r.bayar !== false; if (ok) n2++;
      return '<div class="hcard' + (ok ? '' : ' off') + '"><span class="hno">' + (ok ? n2 : '–') + '</span><div class="hci"><b>' + e(r.nama) + '</b><small>' + e(r.pos + ' · ' + r.kel) + '</small>' + (x && x.no ? '<small class="mono">Rek. ' + e(samar(x.no)) + '</small>' : '<span class="pl r">Rekening belum ada</span>') + (!ok && r.alasan ? '<small>Tidak dibayar: ' + e(r.alasan) + '</small>' : '') + '</div><div class="hcn"><b>' + rp(r.nominal * r.bulan) + '</b><small>' + r.bulan + ' bulan</small>' +
        (kunci() || s.setor ? '' : '<span class="hca"><button type="button" class="tog' + (ok ? '' : ' off') + '" role="switch" aria-checked="' + ok + '" aria-label="Dibayar ' + e(r.nama) + '" data-hbayar="' + e(r.k) + '"></button><button class="ib s" type="button" data-hubah="' + e(r.k) + '" aria-label="Ubah ' + e(r.nama) + '">' + ic('edit') + '</button></span>') + '</div></div>'; }).join(''); })() +
    '<div class="hcard hjc"><b>Total ' + t.j[H.jn].n + ' kader</b><b>' + rp(t.j[H.jn].bruto) + '</b></div></div>' +
    '<p class="hint" style="padding:0 4px">Rekening dan NIK disamarkan di layar; di PDF ditulis lengkap. Mematikan “Dibayar” mengeluarkan kader dari periode ini (alasan wajib, tercatat di Riwayat).</p></section>';
  return h;
}

/* ---------- Rekap ---------- */
function perKel() {
  var m = {}; KEL_H.forEach(function (k) { m[k] = { Balita: 0, Lansia: 0, Poskesdes: 0, n: 0, jml: 0 }; });
  bayar().forEach(function (r) { var x = m[r.kel] || (m[r.kel] = { Balita: 0, Lansia: 0, Poskesdes: 0, n: 0, jml: 0 }); x[r.jenis]++; x.n++; x.jml += bruto(r); });
  return m;
}
function vRekap() {
  var t = total(), s = st(), pk = perKel(), h = '';
  h += '<div class="info">' + ic('check') + 'Dihitung otomatis dari daftar bayar yang ditandatangani ' + (s.ttd ? tglId(new Date(s.ttd)) : '') + '. Angka tidak bisa diketik manual; ubah di Daftar Bayar bila perlu.</div>';
  h += '<div class="kp3"><div class="kp"><span>Kader penerima</span><b>' + t.n + '</b><small>Balita ' + t.j.Balita.n + ' · Lansia ' + t.j.Lansia.n + ' · Poskesdes ' + t.j.Poskesdes.n + '</small></div>' +
    '<div class="kp"><span>Jumlah bulan</span><b>' + H.per.n + ' bulan</b><small>' + e(H.per.label) + '</small></div>' +
    '<div class="kp"><span>Total honor</span><b>' + rp(t.bruto) + '</b><small>sama dengan total daftar bayar ✓</small></div></div>';
  h += '<section class="cd tblc rkw"><div class="hd"><h2>Rekap per jenis</h2><div class="sp"></div><button class="bt out sm" type="button" data-hx="pdfrk">' + ic('eye') + ' Unduh PDF</button><button class="bt out sm" type="button" data-hx="xlsrk">' + ic('dl') + ' Excel</button></div><div class="tw"><table class="tbl"><thead><tr><th style="width:44px">No</th><th>Posyandu &amp; Poskesdes</th><th class="n" style="width:90px">Kader</th><th class="n" style="width:70px">Bulan</th><th class="n" style="width:140px">Per bulan</th><th class="n" style="width:160px">Diterima</th></tr></thead><tbody>' +
    grupRekap().map(function (g, i) { return '<tr><td>' + (i + 1) + '</td><td>' + e(JN_PANJANG[g.j]) + '</td><td class="n">' + g.n + '</td><td class="n">' + g.bulan + '</td><td class="n">' + rp(g.nom) + '</td><td class="n">' + rp(g.jml) + '</td></tr>'; }).join('') +
    '<tr class="hjml"><td></td><td>Jumlah</td><td class="n">' + t.n + '</td><td></td><td></td><td class="n">' + rp(t.bruto) + '</td></tr></tbody></table></div></section>';
  h += '<section class="cd tblc rkw"><div class="hd"><div><h2>Rincian per kelurahan</h2><p class="mu sm">Untuk pemeriksaan Anda; ikut di Excel sebagai lembar kedua.</p></div></div><div class="tw"><table class="tbl"><thead><tr><th>Kelurahan</th><th class="n" style="width:90px">Balita</th><th class="n" style="width:70px">Lansia</th><th class="n" style="width:90px">Poskesdes</th><th class="n" style="width:90px">Penerima</th><th class="n" style="width:160px">Total honor</th></tr></thead><tbody>' +
    Object.keys(pk).map(function (k) { var x = pk[k]; return '<tr><td>' + e(k) + '</td><td class="n">' + x.Balita + '</td><td class="n">' + x.Lansia + '</td><td class="n">' + x.Poskesdes + '</td><td class="n">' + x.n + '</td><td class="n">' + rp(x.jml) + '</td></tr>'; }).join('') +
    '<tr class="hjml"><td>Jumlah</td><td class="n">' + t.j.Balita.n + '</td><td class="n">' + t.j.Lansia.n + '</td><td class="n">' + t.j.Poskesdes.n + '</td><td class="n">' + t.n + '</td><td class="n">' + rp(t.bruto) + '</td></tr></tbody></table></div></section>';
  if (!kunci()) h += '<div class="acts"><span class="mu sm" style="flex:1">Pemeriksaan otomatis: total rekap = total daftar bayar (' + rp(t.bruto) + ') ✓</span>' + (s.rekap ? '<span class="pl g">Rekap selesai ' + tglId(new Date(s.rekap)) + '</span>' : '<button class="bt pri" type="button" data-hx="rekapok">' + ic('check') + ' Tandai rekap selesai</button>') + '</div>';
  return h;
}

/* ---------- Kwitansi ---------- */
function kwData() {
  var c = H.d.cfg.kw, k = Object.assign({}, H.per.kw || {}), f = $('kwTgl') ? kwDariForm() : null, bl = H.per.bulan, th = String(H.per.bulan[0]).slice(0, 4);
  if (f) Object.keys(f).forEach(function (x) { if (f[x]) k[x] = f[x]; });
  var blTeks = bl.length === 1 ? 'Bulan ' + BLN[+bl[0].slice(5) - 1] : 'Bulan ' + BLN[+bl[0].slice(5) - 1] + ' s.d. ' + BLN[+bl[bl.length - 1].slice(5) - 1];
  return {
    tgl: k.tgl || tglId(), nomor: k.nomor || '', dari: k.dari || c.dari, penerima: k.penerima || c.penerima, sumber: k.sumber || c.sumber, tahun: k.tahun || c.tahunAnggaran || th,
    untuk: k.untuk || ('Belanja Jasa Kader Posyandu Balita, Posyandu Lansia, dan Kader Poskesdes di 5 (Lima) Kelurahan se-Kecamatan Palu Utara ' + blTeks + ' T.A ' + th + '.')
  };
}
function vKwitansi() {
  var k = kwData(), t = total(), s = st(), ro = kunci() ? ' readonly' : '';
  var fl = function (id, lbl, val, hint, ta) { return '<div class="fl"><label for="' + id + '">' + lbl + '</label>' + (ta ? '<textarea class="in" id="' + id + '"' + ro + '>' + e(val) + '</textarea>' : '<input class="in" id="' + id + '" value="' + e(val) + '"' + ro + '>') + (hint ? '<p class="hint">' + hint + '</p>' : '') + '</div>'; };
  return '<div class="g2"><section class="cd"><div class="hd"><h2>Isian kwitansi</h2></div>' +
    '<div class="fl"><label>Jumlah uang (dari rekap)</label><div class="in" style="background:var(--navys);color:var(--navyt);font-weight:700">' + ic('lock') + '&nbsp;' + rp(t.bruto) + '</div><p class="hint">' + e(terbilang(t.bruto)) + '. Tidak bisa diketik beda dari rekap.</p></div>' +
    '<div class="g2f" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">' + fl('kwTgl', 'Tanggal', k.tgl) + fl('kwNo', 'Nomor kwitansi (boleh kosong)', k.nomor) + '</div>' +
    fl('kwDari', 'Sudah terima dari', k.dari) + fl('kwUntuk', 'Untuk pembayaran', k.untuk, 'Nama bulan diisi otomatis dari periode.', true) +
    '<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px">' + fl('kwTerima', 'Yang menerima', k.penerima) + fl('kwSumber', 'Sumber dana', k.sumber) + fl('kwTahun', 'Tahun', k.tahun) + '</div>' +
    '<p class="hint">Kode rekening, program, kegiatan, sub kegiatan, dan penandatangan diambil dari <a href="#" data-hx="atur">Pengaturan honor</a>.</p>' +
    '<div class="acts" style="margin-top:12px"><button class="bt out sm" type="button" data-hx="pdfkw">' + ic('eye') + ' Unduh PDF</button>' + (kunci() ? '' : '<button class="bt pri sm" type="button" data-hx="kwok">' + ic('check') + (s.kw ? ' Simpan perubahan' : ' Simpan kwitansi') + '</button>') + (s.kw ? '<span class="pl g">Tersimpan ' + tglId(new Date(s.kw)) + '</span>' : '') + '</div></section>' +
    '<section class="cd"><div class="hd"><h2>Ringkas</h2></div><div class="kvl"><span>Sudah terima dari</span><b>' + e(k.dari) + '</b></div><div class="kvl"><span>Uang sebesar</span><b>' + rp(t.bruto) + '</b></div><div class="kvl"><span>Terbilang</span><b>' + e(terbilang(t.bruto)) + '</b></div><div class="kvl"><span>Periode</span><b>' + e(H.per.label) + '</b></div>' +
    '<div class="kvl"><span>PPTK</span><b>' + e(H.d.cfg.ttd.pptk.nama || '— isi di Pengaturan honor') + '</b></div><div class="kvl"><span>Bendahara</span><b>' + e(H.d.cfg.ttd.bendahara.nama || '— isi di Pengaturan honor') + '</b></div><div class="kvl"><span>Camat</span><b>' + e(H.d.cfg.ttd.camat.nama || '— isi di Pengaturan honor') + '</b></div></section></div>';
}
function kwDariForm() {
  var v = function (id) { var x = $(id); return x ? x.value.trim() : ''; };
  return { tgl: v('kwTgl'), nomor: v('kwNo'), dari: v('kwDari'), untuk: v('kwUntuk'), penerima: v('kwTerima'), sumber: v('kwSumber'), tahun: v('kwTahun') };
}

/* ---------- Berkas ---------- */
function vBerkas() {
  var s = st(), t = total(), sk = H.d.sk || {}, c = H.per.cek || {}, h = '';
  var adaJ = JENIS.filter(function (j) { return t.j[j].n; });
  var skTeks = adaJ.map(function (j) { return (sk[j] ? '✓ ' : '✗ ') + 'SK ' + JN_PANJANG[j]; }).join(' · ');
  var item = function (no, judul, ket, kc, aksi) {
    return '<div class="bk"><span class="no">' + no + '</span><div class="tx"><b>' + judul + '</b><small>' + ket + '</small></div>' + aksi + (s.berkas || kunci() ? '' : '<label class="ck"><input type="checkbox" data-hcek="' + kc + '"' + (c[kc] ? ' checked' : '') + '>Sudah</label>') + '</div>';
  };
  h += '<section class="cd"><div class="hd"><h2>Urutan berkas pengajuan</h2><div class="sp"></div>' + (s.berkas ? '<span class="pl g">Lengkap ' + tglId(new Date(s.berkas)) + '</span>' : '<span class="pl a">Centang setiap berkas yang sudah siap</span>') + '</div>' +
    item(1, 'Kwitansi', 'Dibuat ' + (s.kw ? tglId(new Date(s.kw)) : '') + ' · ' + rp(t.bruto), 'kwitansi', '<button class="bt out sm" type="button" data-hx="pdfkw">PDF</button>') +
    item(2, 'Rekapitulasi honor', 'Total ' + rp(t.bruto) + ' · sama dengan kwitansi ✓', 'rekap', '<button class="bt out sm" type="button" data-hx="pdfrk">PDF</button>') +
    item(3, 'Daftar bayar yang sudah ditandatangani', 'Kertas asli bertanda tangan ' + t.n + ' kader (tidak perlu scan). Tanda tangan dikonfirmasi ' + (s.ttd ? tglId(new Date(s.ttd)) : '') + '.', 'daftar', '') +
    item(4, 'SK sebagai dasar acuan', skTeks + '. Isi SK tidak diubah.', 'sk', adaJ.filter(function (j) { return !sk[j]; }).map(function (j) { return '<label class="bt out sm">Unggah SK ' + j + '<input type="file" accept="application/pdf" data-hsk="' + j + '" hidden></label>'; }).join(''));
  h += '<div class="acts" style="margin-top:14px"><span class="mu sm" style="flex:1">Berkas gabungan berisi Kwitansi → Rekap → halaman penanda “sisipkan Daftar Bayar bertanda tangan di sini” → SK.</span><button class="bt out sm" type="button" data-hx="pdfberkas">' + ic('dl') + ' Unduh berkas gabungan (PDF)</button><button class="bt ' + (s.berkas ? 'pri' : 'out') + ' sm" type="button" data-hx="gabung">Gabung PDF untuk SIPD</button>' +
    (!s.berkas && !kunci() ? '<button class="bt pri sm" type="button" data-hx="berkasok">' + ic('check') + ' Tandai berkas lengkap</button>' : '') + '</div></section>';
  h += '<div class="g2"><section class="cd"><div class="hd"><h2>Setor ke DPPKAD</h2></div>' + (s.setor ? '<p><span class="pl g">Disetor ' + e(s.setorTgl || tglId(new Date(s.setor))) + '</span></p>' : '<p class="mu sm">Tandai setelah berkas Anda bawa dan setor ke DPPKAD.</p>' + (s.berkas && !kunci() ? '<button class="bt pri sm" type="button" data-hx="setor">Tandai sudah disetor…</button>' : '')) + '</section>' +
    '<section class="cd"><div class="hd"><h2>Dana masuk rekening kantor</h2></div>' + (s.dana ? '<p><span class="pl g">' + rp(s.danaJml) + ' · ' + e(s.danaTgl || tglId(new Date(s.dana))) + '</span></p>' + (s.danaJml !== t.bruto ? '<div class="info w">' + ic('alert') + 'Berbeda dari pengajuan ' + rp(t.bruto) + '.</div>' : '') : '<p class="mu sm">Setelah pengajuan disetujui dan dana masuk, catat jumlah dan tanggalnya.</p>' + (s.setor && !kunci() ? '<button class="bt pri sm" type="button" data-hx="dana">Catat dana masuk…</button>' : '')) + '</section></div>';
  return h;
}

/* ---------- Potongan ---------- */
function vPotongan() {
  var P = H.per.potongan || [], t = total(), s = st(), kd = {}, h = '';
  P.forEach(function (p) { kd[p.k] = 1; });
  h += '<div class="kp4"><div class="kp"><span>Kader dengan potongan</span><b>' + Object.keys(kd).length + '</b><small>' + (t.n - Object.keys(kd).length) + ' kader tanpa potongan</small></div><div class="kp"><span>Total potongan</span><b>' + rp(t.pot) + '</b><small>' + P.length + ' potongan</small></div><div class="kp"><span>Honor bersih ke kader</span><b>' + rp(t.bruto - t.pot) + '</b><small>' + ang(t.bruto) + ' − ' + ang(t.pot) + '</small></div><div class="kp"><span>Dana masuk</span><b>' + rp(s.danaJml) + '</b><small>' + e(s.danaTgl || '') + '</small></div></div>';
  var bisa = !kunci() && !s.pot && !s.serah;
  h += '<section class="cd tblc"><div class="hd"><h2>Daftar potongan</h2><div class="sp"></div>' + (bisa ? '<button class="bt pri sm" type="button" data-hx="potbaru">' + ic('plus') + ' Tambah potongan</button>' : '') + '</div>' +
    (P.length ? '<div class="tw"><table class="tbl"><thead><tr><th>Kader</th><th>Jenis</th><th>Keterangan</th><th>Tujuan</th><th class="n">Nominal</th><th class="n">Honor bersih</th><th></th></tr></thead><tbody>' + P.map(function (p) {
      var r = H.per.penerima.filter(function (x) { return x.k === p.k; })[0] || {};
      return '<tr><td><b>' + e(p.nama) + '</b><br><small class="mu">' + e((r.pos || '') + ' · ' + (r.jenis || '')) + '</small></td><td>' + e(p.jenis) + '</td><td>' + e(p.ket) + '</td><td>' + (p.tujuan === 'tunai' ? 'Tunai ke ' + e(p.ke.nama) : 'Transfer ke ' + e(p.ke.nama) + '<br><small class="mu">' + e(p.ke.bank) + ' · ' + e(p.ke.no) + '</small>') + '</td><td class="n">' + rp(p.nom) + '</td><td class="n">' + rp(bruto(r) - potSum(p.k)) + '</td><td class="ac">' + (bisa ? '<button class="ib s" type="button" data-hpot="' + e(p.id) + '" aria-label="Ubah potongan">' + ic('edit') + '</button>' : '') + '</td></tr>';
    }).join('') + '</tbody></table></div>' : '<div class="kosong">Belum ada potongan. Bila memang tidak ada, langsung tandai potongan selesai.</div>') +
    '<p class="hint" style="padding:0 4px">Potongan hanya dibuat oleh Anda satu per satu, wajib ada keterangan dan tujuan. Total potongan satu kader tidak boleh melebihi honornya. Setiap perubahan tercatat di Riwayat.</p></section>';
  if (!kunci()) h += '<div class="acts"><span class="mu sm" style="flex:1">Potongan ikut tertulis lengkap di Daftar Transfer untuk bendahara.</span>' + (s.pot ? '<span class="pl g">Potongan selesai dicatat</span>' : '<button class="bt pri" type="button" data-hx="potok">' + ic('check') + (P.length ? ' Tandai potongan selesai' : ' Tidak ada potongan — tandai selesai') + '</button>') + '</div>';
  return h;
}

/* ---------- Daftar Transfer ---------- */
function vTransfer() {
  var t = total(), s = st(), kr = kurangRek(), h = '';
  h += '<div class="kp4"><div class="kp"><span>Honor bruto</span><b>' + rp(t.bruto) + '</b></div><div class="kp"><span>Ditransfer ke kader</span><b>' + rp(t.bruto - t.pot) + '</b></div><div class="kp"><span>Potongan diteruskan</span><b>' + rp(t.pot) + '</b></div><div class="kp"><span>Total dana</span><b>' + rp(t.bruto) + '</b><small>' + (s.danaJml === t.bruto ? '= dana masuk ✓' : 'dana masuk ' + rp(s.danaJml)) + '</small></div></div>';
  if (kr.length) h += '<div class="info w">' + ic('alert') + kr.length + ' kader belum punya nomor rekening; di daftar ditandai “rekening belum ada” supaya bendahara tahu.</div>';
  var beda = st().ttd ? bayar().filter(function (r) { var a = r.rek || {}, b = db()[r.k] || {}; return (a.no || '') !== (b.no || ''); }).length : 0;
  if (beda && !s.serah && !kunci()) h += '<div class="info">' + ic('sync') + '<span style="flex:1">' + beda + ' rekening berubah sejak daftar bayar ditandatangani. Daftar transfer memakai rekening saat tanda tangan.</span><button class="bt out sm" type="button" data-hx="ambilrek">Pakai rekening terbaru</button></div>';
  h += '<section class="cd tblc"><div class="hd"><div><h2>Daftar Transfer Honor untuk Bendahara</h2><p class="mu sm">Satu dokumen: Posyandu Balita, Posyandu Lansia, dan Poskesdes. Potongan tertulis di baris kadernya.</p></div><div class="sp"></div><button class="bt out sm" type="button" data-hx="pdftf">' + ic('eye') + ' Unduh PDF</button><button class="bt out sm" type="button" data-hx="xlstf">' + ic('dl') + ' Excel</button></div>' +
    '<div class="tw"><table class="tbl"><thead><tr><th>Jenis</th><th class="n">Kader</th><th class="n">Honor</th><th class="n">Potongan</th><th class="n">Ditransfer ke kader</th></tr></thead><tbody>' +
    JENIS.filter(function (j) { return t.j[j].n; }).map(function (j) { var g = t.j[j]; return '<tr><td>' + JN_PANJANG[j] + '</td><td class="n">' + g.n + '</td><td class="n">' + rp(g.bruto) + '</td><td class="n">' + rp(g.pot) + '</td><td class="n">' + rp(g.bruto - g.pot) + '</td></tr>'; }).join('') +
    '<tr class="hjml"><td>Jumlah</td><td class="n">' + t.n + '</td><td class="n">' + rp(t.bruto) + '</td><td class="n">' + rp(t.pot) + '</td><td class="n">' + rp(t.bruto - t.pot) + '</td></tr></tbody></table></div></section>';
  if (!kunci()) {
    h += '<div class="acts"><span class="mu sm" style="flex:1">' + (s.serah ? 'Diserahkan ke bendahara ' + e(s.serahTgl || tglId(new Date(s.serah))) + '.' : s.pot ? 'Bawa daftar ini ke bendahara. Transfer dilakukan oleh bendahara.' : 'Tandai potongan selesai dulu di tab Potongan.') + '</span>' +
      (s.pot && !s.serah ? '<button class="bt pri" type="button" data-hx="serah">' + ic('check') + ' Tandai sudah diserahkan ke bendahara</button>' : '') +
      (s.serah ? '<button class="bt pri" type="button" data-hx="selesai">' + ic('lock') + ' Selesaikan dan kunci periode</button>' : '') + '</div>';
  }
  return h;
}

/* ---------- Rekening Kader ---------- */
function daftarRek() {
  var D = db(), seen = {}, out = [];
  calon().forEach(function (c) { seen[c.k] = 1; out.push({ k: c.k, nama: c.nama, pos: c.pos, kel: c.kel, jenis: c.jenis, x: D[c.k] || null }); });
  if (H.per) H.per.penerima.forEach(function (r) { if (!seen[r.k]) { seen[r.k] = 1; out.push({ k: r.k, nama: r.nama, pos: r.pos, kel: r.kel, jenis: r.jenis, x: D[r.k] || null }); } });
  return out;
}
function vRekening() {
  var L = daftarRek(), q = H.rq.toLowerCase(), belum = L.filter(function (r) { return !r.x || !r.x.no || !r.x.nik; }), h = '';
  var F = H.rf === 'belum' ? belum : L;
  if (q) F = F.filter(function (r) { return (r.nama + ' ' + r.pos + ' ' + r.kel).toLowerCase().indexOf(q) >= 0; });
  h += '<section class="cd tblc"><div class="flt" style="flex-wrap:wrap"><div class="seg"><button type="button" data-hrf="semua" class="' + (H.rf !== 'belum' ? 'on' : '') + '">Semua ' + L.length + '</button><button type="button" data-hrf="belum" class="' + (H.rf === 'belum' ? 'on' : '') + '">Belum lengkap ' + belum.length + '</button></div>' +
    '<label class="srch">' + ic('search') + '<input id="hrq" type="search" placeholder="Cari nama…" value="' + e(H.rq) + '" autocomplete="off" aria-label="Cari kader"></label><div class="sp"></div>' +
    '<label class="bt out sm">' + ic('dl') + ' Impor dari Excel<input type="file" accept=".xlsx,.xls" data-himpor hidden></label><button class="bt out sm" type="button" data-hx="xlsrek">' + ic('dl') + ' Unduh Excel (isi lalu impor)</button></div>' +
    '<div class="tw"><table class="tbl"><thead><tr><th>Nama</th><th>Posyandu</th><th>Bank</th><th>No. rekening</th><th>Pemilik rekening</th><th>NIK</th><th>Status</th><th></th></tr></thead><tbody>' +
    F.map(function (r) {
      var x = r.x || {}, lih = H.lihat[r.k];
      return '<tr><td><b>' + e(r.nama) + '</b></td><td>' + e(r.pos) + '<br><small class="mu">' + e(r.jenis + ' · ' + r.kel) + '</small></td><td>' + e(x.bank || '—') + '</td><td>' + (x.no ? '<span class="mono">' + e(lih ? x.no : samar(x.no)) + '</span>' : '<span class="pl r">Belum ada</span>') + '</td><td>' + e(x.pemilik || '—') + '</td><td>' + (x.nik ? '<span class="mono">' + e(lih ? x.nik : samar(x.nik)) + '</span>' : '<span class="pl r">Belum ada</span>') + '</td>' +
        '<td>' + (r.x ? (x.aktif === false ? '<span class="pl n">Tidak aktif</span>' : '<span class="pl g">Aktif</span>') : '<span class="pl n">—</span>') + '</td><td class="ac">' + (x.no || x.nik ? '<button class="ib s" type="button" data-hlihat="' + e(r.k) + '" aria-label="Lihat nomor lengkap">' + ic('eye') + '</button>' : '') + '<button class="ib s" type="button" data-hrek="' + e(r.k) + '" aria-label="Ubah rekening ' + e(r.nama) + '">' + ic('edit') + '</button></td></tr>';
    }).join('') + '</tbody></table></div><p class="hint" style="padding:0 4px">Data rekening dipakai ulang di setiap periode, disimpan privat di Drive (tidak pernah di GitHub), dan hanya terlihat oleh admin kecamatan. Setiap perubahan nomor tercatat di Riwayat.</p></section>';
  return h;
}

/* ---------- Riwayat ---------- */
function muatRiwayat() {
  H.rw = false;
  ambil('riwayat', { per: H.per ? H.per.id : '' }).then(function (r) { H.rw = r.riwayat || []; gambar(); }).catch(function (er) { H.rw = []; H.err2 = er.message; gambar(); });
}
function vRiwayat() {
  if (!H.rw) return '<section class="cd"><p class="mu">Memuat riwayat…</p></section>';
  return '<section class="cd"><div class="hd"><h2>Riwayat perubahan</h2><span class="mu sm">Honor ' + e(H.per.label) + ' dan data rekening</span><div class="sp"></div><button class="bt out sm" type="button" data-hx="xlsrw">' + ic('dl') + ' Excel</button></div>' +
    (H.rw.length ? '<ul class="rw">' + H.rw.map(function (x) {
      return '<li><small>' + e(x.w) + '<br>' + e(x.u) + '</small><div>' + e(x.a) + ((x.l || x.b) ? '<br><small>' + (x.l ? '<span class="lama">' + e(x.l) + '</span> ' : '') + (x.b ? '→ <span class="baru">' + e(x.b) + '</span>' : '') + '</small>' : '') + '</div></li>';
    }).join('') + '</ul>' : '<div class="kosong">Belum ada riwayat.</div>') + '<p class="hint">Riwayat tidak bisa dihapus atau diubah dari aplikasi.</p></section>';
}

/* ---------- Semua periode ---------- */
function vSemua() {
  var L = H.d.daftar || [];
  return '<section class="cd tblc"><div class="hd"><h2>Semua periode honor</h2><div class="sp"></div><button class="bt ghost sm" type="button" data-hx="tutupsemua">Kembali</button></div>' +
    (L.length ? '<div class="tw"><table class="tbl"><thead><tr><th>Periode</th><th class="n">Bulan</th><th class="n">Kader</th><th class="n">Total bruto</th><th class="n">Potongan</th><th>Status</th><th></th></tr></thead><tbody>' + L.map(function (x) {
      return '<tr><td><b>Honor ' + e(x.label) + '</b></td><td class="n">' + x.n + (x.n > 1 ? ' (rapel)' : '') + '</td><td class="n">' + x.kader + '</td><td class="n">' + rp(x.bruto) + '</td><td class="n">' + rp(x.pot) + '</td><td>' + pilTahap(x) + '</td><td class="ac"><button class="bt out sm" type="button" data-hper="' + e(x.id) + '">Buka</button>' +
        (x.kunci ? '<button class="bt ghost sm" type="button" data-hbuka="' + e(x.id) + '" data-label="' + e(x.label) + '">Buka kunci</button>' : '') + (x.tahap < 5 && !x.kunci ? '<button class="bt ghost sm" type="button" data-hhapus="' + e(x.id) + '" data-label="' + e(x.label) + '">Hapus</button>' : '<button class="bt ghost sm" type="button" data-hperm="' + e(x.id) + '" data-label="' + e(x.label) + '" style="color:var(--r)">Hapus permanen</button>') + '</td></tr>';
    }).join('') + '</tbody></table></div>' : '<div class="kosong">Belum ada periode.</div>') + '<p class="hint" style="padding:0 4px">Periode yang sudah ditandatangani hanya bisa dihapus lewat "Hapus permanen" (harus mengetik konfirmasi).</p></section>';
}

/* ---------- modal ---------- */
function modal(judul, html, tombol, fn) {
  var w = document.createElement('div'); w.className = 'v2m'; w.innerHTML = html + '<p class="st" data-mst></p><div class="mf"><div class="sp"></div><button class="bt ghost" type="button" data-mx="batal">Batal</button><button class="bt pri" type="button" data-mx="ok">' + e(tombol) + '</button></div>';
  PX.bukaModal(judul, w);
  var st0 = w.querySelector('[data-mst]'), ok = w.querySelector('[data-mx=ok]');
  w.querySelector('[data-mx=batal]').onclick = function () { PX.tutupModal(); };
  ok.onclick = function () {
    st0.className = 'st'; st0.textContent = ''; ok.disabled = true;
    Promise.resolve().then(function () { return fn(w); }).then(function (tutup) { if (tutup !== false) PX.tutupModal(); else { ok.disabled = false; st0.textContent = ''; } })
      .catch(function (er) { ok.disabled = false; st0.className = 'st bad'; st0.textContent = er.message || String(er); });
  };
  return w;
}
function nilai(w, sel) { var x = w.querySelector(sel); return x ? (x.type === 'checkbox' ? x.checked : x.value.trim()) : ''; }
function angkaDari(s) { return parseInt(String(s || '').replace(/[^\d]/g, ''), 10); }

function mBaru() {
  var c = H.d.cfg, now = new Date(), opt = '';
  for (var i = -3; i <= 14; i++) { var d = new Date(now.getFullYear(), now.getMonth() - i, 1), v = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); opt += '<option value="' + v + '"' + (i === 1 ? ' selected' : '') + '>' + blnLabel(v) + '</option>'; }
  var nPos = calon().filter(function (x) { return x.jenis !== 'Poskesdes'; }).length, nPk = calon().filter(function (x) { return x.jenis === 'Poskesdes'; }).length;
  var w = modal('Buat periode honor', '<div class="g2f"><div class="fl"><label for="mbMulai">Bulan mulai</label><select class="in" id="mbMulai">' + opt + '</select></div><div class="fl"><label for="mbN">Jumlah bulan</label><select class="in" id="mbN">' + [1, 2, 3, 4, 5, 6].map(function (n) { return '<option value="' + n + '">' + n + ' bulan' + (n > 1 ? ' (rapel)' : '') + '</option>'; }).join('') + '</select></div></div>' +
    '<label style="display:block;font-size:13px;font-weight:550;margin-bottom:6px">Nominal per kader per bulan</label><div class="g3f">' + JENIS.map(function (j) { return '<div class="fl"><label for="mbNom' + j + '" style="font-weight:400" class="mu">' + JN_PANJANG[j] + '</label><input class="in" id="mbNom' + j + '" inputmode="numeric" value="' + ang(c.nominal[j]).replace(/,/g, '.') + '"></div>'; }).join('') + '</div>' +
    '<div class="kvl"><span>Penerima</span><b>Kader sesuai SK: ' + nPos + ' Balita/Lansia + ' + nPk + ' Poskesdes</b></div><p class="hint">Nama disalin persis seperti di SK ke periode ini. Bulan yang sudah pernah dibayar ditolak (mencegah bayar ganda).</p><div class="calc" data-hit></div>', 'Buat periode', function (w) {
      var nom = {}; JENIS.forEach(function (j) { nom[j] = angkaDari(nilai(w, '#mbNom' + j)); if (!(nom[j] >= 0)) throw new Error('Nominal ' + j + ' tidak valid'); });
      return kirim({ op: 'buat', mulai: nilai(w, '#mbMulai'), n: +nilai(w, '#mbN'), nominal: nom }, 'Periode dibuat.').then(function () { H.tab = 'db'; H.view = ''; gambar(); });
    });
  function hitung() {
    var n = +nilai(w, '#mbN') || 1, m = nilai(w, '#mbMulai'), tot = 0, cnt = 0;
    calon().forEach(function (x) { tot += (angkaDari(nilai(w, '#mbNom' + x.jenis)) || 0) * n; cnt++; });
    var p = m.split('-'), akhir = new Date(+p[0], +p[1] - 1 + n - 1, 1), lbl = n === 1 ? blnLabel(m) : BLN[+p[1] - 1] + ' s.d. ' + BLN[akhir.getMonth()] + ' ' + akhir.getFullYear();
    var bentrok = []; (H.d.daftar || []).forEach(function (x) { (x.bulan || []).forEach(function (b) { for (var i = 0; i < n; i++) { var d = new Date(+p[0], +p[1] - 1 + i, 1); if (b === d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')) bentrok.push(blnLabel(b) + ' sudah dibayar di Honor ' + x.label); } }); });
    w.querySelector('[data-hit]').innerHTML = bentrok.length ? '<div style="color:var(--r)"><b>' + e(bentrok[0]) + '.</b> Periode tidak bisa dibuat.</div>' : '<div><span><b>Honor ' + e(lbl) + '</b> · ' + cnt + ' kader</span><b>' + rp(tot) + '</b></div>';
  }
  w.addEventListener('input', hitung); w.addEventListener('change', hitung); hitung();
}
function mUbah(k) {
  var r = H.per.penerima.filter(function (x) { return x.k === k; })[0]; if (!r) return;
  var s = st();
  modal('Ubah ' + r.nama, (s.ttd ? '<div class="warnb"><b>Daftar bayar sudah ditandatangani.</b> Bila disimpan, Daftar Bayar harus dicetak dan ditandatangani ulang, lalu Rekap dan Kwitansi dibuat ulang.</div>' : '') +
    '<div class="fl"><label for="muNama">Nama (sesuai SK)</label><input class="in" id="muNama" value="' + e(r.nama) + '"></div><div class="g2f"><div class="fl"><label for="muNom">Nominal per bulan</label><input class="in" id="muNom" inputmode="numeric" value="' + ang(r.nominal).replace(/,/g, '.') + '"></div>' +
    '<div class="fl"><label for="muBln">Jumlah bulan</label><select class="in" id="muBln">' + Array.apply(null, { length: H.per.n }).map(function (_, i) { return '<option' + (i + 1 === r.bulan ? ' selected' : '') + '>' + (i + 1) + '</option>'; }).join('') + '</select></div></div>' +
    '<div class="fl"><label for="muAlasan">Alasan perubahan' + (s.ttd ? ' (wajib)' : '') + '</label><input class="in" id="muAlasan"></div>' + (s.ttd ? '<label class="ck"><input type="checkbox" id="muYakin">Saya yakin mengubah data yang sudah ditandatangani</label>' : ''), 'Simpan', async function (w) {
      var u = { nama: nilai(w, '#muNama'), nominal: angkaDari(nilai(w, '#muNom')), bulan: +nilai(w, '#muBln') };
      if (u.nominal !== r.nominal && !(await tanya('Ubah nominal ' + r.nama + ' dari ' + rp(r.nominal) + ' menjadi ' + rp(u.nominal) + ' per bulan?'))) return false;
      if (s.ttd && !nilai(w, '#muYakin')) throw new Error('Centang konfirmasi dulu');
      return kirim({ op: 'baris', k: k, ubah: u, alasan: nilai(w, '#muAlasan'), yakin: !!nilai(w, '#muYakin') }, 'Perubahan disimpan.');
    });
}
function mBayar(k) {
  var r = H.per.penerima.filter(function (x) { return x.k === k; })[0]; if (!r) return;
  var s = st(), jadi = r.bayar === false;
  modal(jadi ? 'Masukkan kembali ' + r.nama + '?' : 'Keluarkan ' + r.nama + ' dari periode ini?', (s.ttd ? '<div class="warnb"><b>Daftar bayar sudah ditandatangani.</b> Dokumen harus dibuat ulang setelah ini.</div>' : '') +
    '<p>' + (jadi ? 'Kader ini akan kembali menerima honor ' + rp(r.nominal * r.bulan) + '.' : 'Kader ini tidak menerima honor pada Honor ' + e(H.per.label) + '. Namanya tetap di SK.') + '</p><div class="fl"><label for="mbAlasan">Alasan (wajib)</label><input class="in" id="mbAlasan"></div>' + (s.ttd ? '<label class="ck"><input type="checkbox" id="mbYakin">Saya yakin</label>' : ''), jadi ? 'Masukkan' : 'Keluarkan', function (w) {
      var a = nilai(w, '#mbAlasan'); if (!a) throw new Error('Tulis alasannya');
      if (s.ttd && !nilai(w, '#mbYakin')) throw new Error('Centang konfirmasi dulu');
      return kirim({ op: 'baris', k: k, ubah: { bayar: jadi, alasan: a }, alasan: a, yakin: !!nilai(w, '#mbYakin') }, 'Disimpan.');
    });
}
function mTambah() {
  var s = st(), pos = {}; calon().forEach(function (c) { pos[c.jenis + '|' + c.pos + '|' + c.kel] = c; });
  modal('Tambah kader ke periode ini', (s.ttd ? '<div class="warnb"><b>Daftar bayar sudah ditandatangani.</b> Dokumen harus dibuat ulang setelah ini.</div>' : '') +
    '<p class="hint" style="margin-top:0">Untuk kader yang belum ada di SK (misalnya SK susulan). Kader yang sudah ada di daftar tidak bisa ditambah dua kali.</p>' +
    '<div class="fl"><label for="mtNama">Nama</label><input class="in" id="mtNama"></div><div class="g2f"><div class="fl"><label for="mtJ">Jenis</label><select class="in" id="mtJ">' + JENIS.map(function (j) { return '<option value="' + j + '"' + (j === H.jn ? ' selected' : '') + '>' + JN_PANJANG[j] + '</option>'; }).join('') + '</select></div>' +
    '<div class="fl"><label for="mtNom">Nominal per bulan</label><input class="in" id="mtNom" inputmode="numeric" value="' + ang(H.per.nominal[H.jn]).replace(/,/g, '.') + '"></div></div>' +
    '<div class="fl"><label for="mtPos">Posyandu / Poskesdes</label><input class="in" id="mtPos" list="mtPosL"><datalist id="mtPosL">' + Object.keys(pos).map(function (k) { var c = pos[k]; return '<option value="' + e(c.pos) + '">' + e(c.jenis + ' · ' + c.kel) + '</option>'; }).join('') + '</datalist></div>' +
    '<div class="fl"><label for="mtKel">Kelurahan</label><select class="in" id="mtKel">' + KEL_H.map(function (k) { return '<option>' + k + '</option>'; }).join('') + '</select></div><div class="fl"><label for="mtAl">Alasan</label><input class="in" id="mtAl"></div>' + (s.ttd ? '<label class="ck"><input type="checkbox" id="mtYakin">Saya yakin</label>' : ''), 'Tambah', function (w) {
      return kirim({ op: 'tambah', nama: nilai(w, '#mtNama'), jenis: nilai(w, '#mtJ'), nominal: angkaDari(nilai(w, '#mtNom')), pos: nilai(w, '#mtPos'), kel: nilai(w, '#mtKel'), alasan: nilai(w, '#mtAl'), yakin: !!nilai(w, '#mtYakin') }, 'Kader ditambahkan.');
    });
}
function mTtd() {
  var t = total(), adaJ = JENIS.filter(function (j) { return t.j[j].n; });
  var w = modal('Tandai daftar bayar sudah ditandatangani?', '<p>Setelah ini <b>Rekap</b>, <b>Kwitansi</b>, dan <b>Berkas Pengajuan</b> terbuka. Nama dan nominal di periode ini dikunci; nomor rekening yang tercetak disimpan sebagai arsip periode.</p>' +
    adaJ.map(function (j) { return '<label class="ck"><input type="checkbox" data-cj="' + j + '">Saya sudah memeriksa tanda tangan <b>&nbsp;' + t.j[j].n + '&nbsp;</b> kader ' + JN_PANJANG[j] + '</label>'; }).join('') +
    '<p class="hint">Tombol baru bisa dipakai setelah semua centang terisi.</p>', 'Ya, sudah ditandatangani', function (w) {
      var cek = {}; adaJ.forEach(function (j) { cek[j] = w.querySelector('[data-cj=' + j + ']').checked; });
      if (adaJ.some(function (j) { return !cek[j]; })) throw new Error('Centang semua pemeriksaan dulu');
      return (st().cetak ? Promise.resolve() : kirim({ op: 'langkah', l: 'cetak' })).then(function () { return kirim({ op: 'langkah', l: 'ttd', cek: cek }, 'Daftar bayar ditandai sudah ditandatangani.'); }).then(function () { H.tab = 'rk'; gambar(); });
    });
  var ok = w.querySelector('[data-mx=ok]'); function cek() { ok.disabled = adaJ.some(function (j) { return !w.querySelector('[data-cj=' + j + ']').checked; }); }
  w.addEventListener('change', cek); cek();
}
function mTgl(judul, isi, tombol, f, ok) {
  modal(judul, isi + '<div class="fl"><label for="mtTgl">Tanggal</label><input class="in" id="mtTgl" value="' + e(tglId()) + '"></div>', tombol, function (w) { f.tgl = nilai(w, '#mtTgl'); return kirim(f, ok); });
}
function mDana() {
  var t = total();
  var w = modal('Catat dana masuk rekening kantor', '<p>Isi jumlah yang benar-benar masuk setelah pengajuan disetujui.</p><div class="g2f"><div class="fl"><label for="mdJml">Jumlah masuk</label><input class="in" id="mdJml" inputmode="numeric" value="' + ang(t.bruto).replace(/,/g, '.') + '"></div><div class="fl"><label for="mdTgl">Tanggal</label><input class="in" id="mdTgl" value="' + e(tglId()) + '"></div></div><div class="calc" data-cd></div>', 'Simpan', async function (w) {
    var j = angkaDari(nilai(w, '#mdJml')); if (!(j >= 0)) throw new Error('Isi jumlah');
    if (j !== t.bruto && !(await tanya('Jumlah ' + rp(j) + ' berbeda dari pengajuan ' + rp(t.bruto) + '. Tetap simpan?'))) return false;
    return kirim({ op: 'langkah', l: 'dana', jumlah: j, tgl: nilai(w, '#mdTgl') }, 'Dana masuk dicatat.').then(function () { H.tab = 'pt'; gambar(); });
  });
  function cek() { var j = angkaDari(nilai(w, '#mdJml')); w.querySelector('[data-cd]').innerHTML = '<div><span>Pengajuan</span><b>' + rp(t.bruto) + '</b></div><div><span>Masuk</span><b style="color:' + (j === t.bruto ? 'var(--g)' : 'var(--r)') + '">' + rp(j) + (j === t.bruto ? ' ✓' : ' (berbeda)') + '</b></div>'; }
  w.addEventListener('input', cek); cek();
}
function mPot(id) {
  var P = H.per.potongan || [], p = id ? P.filter(function (x) { return x.id === id; })[0] : null, tj = H.d.tujuan || [];
  var opt = bayar().map(function (r) { return '<option value="' + e(r.k) + '"' + (p && p.k === r.k ? ' selected' : '') + '>' + e(r.nama + ' — ' + r.pos + ' (' + r.jenis + ', ' + r.kel + ')') + '</option>'; }).join('');
  var w = modal(p ? 'Ubah potongan' : 'Tambah potongan', '<div class="fl"><label for="mpK">Kader</label><select class="in" id="mpK">' + (p ? '' : '<option value="">Pilih kader…</option>') + opt + '</select></div>' +
    '<div class="g2f"><div class="fl"><label for="mpJ">Jenis potongan</label><input class="in" id="mpJ" value="' + e(p ? p.jenis : '') + '" placeholder="Ketik bebas"></div><div class="fl"><label for="mpN">Nominal</label><input class="in" id="mpN" inputmode="numeric" value="' + (p ? ang(p.nom).replace(/,/g, '.') : '') + '"></div></div>' +
    '<div class="fl"><label for="mpKet">Keterangan (wajib)</label><input class="in" id="mpKet" value="' + e(p ? p.ket : '') + '" placeholder="Siapa yang meminta, untuk apa"></div>' +
    '<div class="fl"><label>Tujuan</label><label class="ck"><input type="radio" name="mpT" value="transfer"' + (!p || p.tujuan !== 'tunai' ? ' checked' : '') + '>Diteruskan lewat transfer</label><label class="ck"><input type="radio" name="mpT" value="tunai"' + (p && p.tujuan === 'tunai' ? ' checked' : '') + '>Diserahkan tunai</label></div>' +
    (tj.length ? '<div class="fl" data-tfr><label for="mpTj">Tujuan tersimpan</label><select class="in" id="mpTj"><option value="">— pilih atau isi baru di bawah —</option>' + tj.map(function (x, i) { return '<option value="' + i + '">' + e(x.nama + ' · ' + x.bank + ' ' + x.no) + '</option>'; }).join('') + '</select></div>' : '') +
    '<div class="fl"><label for="mpKe">Nama penerima / instansi</label><input class="in" id="mpKe" value="' + e(p ? p.ke.nama : '') + '"></div><div class="g2f" data-tfr><div class="fl"><label for="mpB">Bank tujuan</label><input class="in" id="mpB" value="' + e(p ? p.ke.bank : '') + '"></div><div class="fl"><label for="mpNo">Nomor rekening tujuan</label><input class="in" id="mpNo" inputmode="numeric" value="' + e(p ? p.ke.no : '') + '"></div></div>' +
    '<div class="calc" data-cp></div>' + (p ? '<p style="margin:10px 0 0"><a href="#" data-hapuspot style="color:var(--r)">Hapus potongan ini</a></p>' : ''), p ? 'Simpan' : 'Simpan potongan', function (w) {
      var tuj = (w.querySelector('input[name=mpT]:checked') || {}).value || 'transfer';
      var pt = { k: nilai(w, '#mpK'), jenis: nilai(w, '#mpJ'), ket: nilai(w, '#mpKet'), nom: angkaDari(nilai(w, '#mpN')), tujuan: tuj, ke: { nama: nilai(w, '#mpKe'), bank: nilai(w, '#mpB'), no: nilai(w, '#mpNo') } };
      if (!pt.k) throw new Error('Pilih kader');
      return kirim({ op: 'pot', sub: p ? 'ubah' : 'tambah', pid: p ? p.id : '', pt: pt }, 'Potongan disimpan.');
    });
  function hitung() {
    var k = nilai(w, '#mpK'), r = H.per.penerima.filter(function (x) { return x.k === k; })[0], n = angkaDari(nilai(w, '#mpN')) || 0;
    var tuj = (w.querySelector('input[name=mpT]:checked') || {}).value;
    Array.prototype.forEach.call(w.querySelectorAll('[data-tfr]'), function (x) { x.style.display = tuj === 'tunai' ? 'none' : ''; });
    if (!r) { w.querySelector('[data-cp]').innerHTML = '<div class="mu">Pilih kader untuk melihat perhitungan.</div>'; return; }
    var lain = potOf(k).filter(function (x) { return !p || x.id !== p.id; }), b = bruto(r), sisa = b - lain.reduce(function (s, x) { return s + x.nom; }, 0) - n;
    w.querySelector('[data-cp]').innerHTML = '<div><span>Honor bruto</span><b>' + rp(b) + '</b></div>' + lain.map(function (x) { return '<div class="mu"><span>' + e(x.jenis) + '</span><span>− ' + rp(x.nom) + '</span></div>'; }).join('') + '<div class="mu"><span>' + (p ? 'Potongan ini' : 'Potongan baru') + '</span><span>− ' + rp(n) + '</span></div><div style="border-top:1px solid var(--line);margin-top:4px;padding-top:6px"><span>Honor bersih</span><b style="color:' + (sisa < 0 ? 'var(--r)' : 'var(--g)') + '">' + rp(sisa) + (sisa < 0 ? ' (melebihi honor)' : '') + '</b></div>';
  }
  w.addEventListener('input', hitung); w.addEventListener('change', function (ev) {
    if (ev.target.id === 'mpTj' && ev.target.value !== '') { var x = tj[+ev.target.value]; w.querySelector('#mpKe').value = x.nama; w.querySelector('#mpB').value = x.bank; w.querySelector('#mpNo').value = x.no; }
    hitung();
  });
  var hp = w.querySelector('[data-hapuspot]'); if (hp) hp.onclick = async function (ev) { ev.preventDefault(); if (!(await tanya('Hapus potongan ' + p.jenis + ' ' + rp(p.nom) + ' dari ' + p.nama + '?'))) return; PX.tutupModal(); kirim({ op: 'pot', sub: 'hapus', pid: p.id }, 'Potongan dihapus.').catch(gagal); };
  hitung();
}
function mRek(k) {
  var r = daftarRek().filter(function (x) { return x.k === k; })[0]; if (!r) return;
  var x = r.x || {};
  var w = modal('Rekening — ' + r.nama, '<p class="mu sm" style="margin-top:0">' + e(r.pos + ' · ' + r.jenis + ' · ' + r.kel) + '</p>' +
    '<div class="g2f"><div class="fl"><label for="mrB">Nama bank</label><input class="in" id="mrB" value="' + e(x.bank || '') + '" placeholder="Nama bank"></div><div class="fl"><label for="mrNo">Nomor rekening</label><input class="in" id="mrNo" inputmode="numeric" value="' + e(x.no || '') + '"></div></div>' +
    '<div class="fl"><label for="mrP">Nama pemilik rekening</label><input class="in" id="mrP" value="' + e(x.pemilik || r.nama.toUpperCase()) + '"></div><div class="fl"><label for="mrNik">NIK</label><input class="in" id="mrNik" inputmode="numeric" maxlength="16" value="' + e(x.nik || '') + '"></div>' +
    '<label class="ck"><input type="checkbox" id="mrA"' + (x.aktif === false ? '' : ' checked') + '>Rekening aktif</label><div class="calc" data-cr style="margin-top:8px"></div>' +
    (x.h && x.h.length ? '<p class="hint"><b>Riwayat rekening:</b> ' + x.h.slice(0, 5).map(function (y) { return e((y.bank || '') + ' ' + samar(y.no)); }).join(', ') + '</p>' : ''), 'Periksa & simpan', async function (w) {
      var d = { bank: nilai(w, '#mrB'), no: nilai(w, '#mrNo').replace(/[\s.\-]/g, ''), pemilik: nilai(w, '#mrP'), nik: nilai(w, '#mrNik').replace(/\s/g, ''), aktif: nilai(w, '#mrA'), nama: r.nama };
      if (d.no && !/^\d{6,20}$/.test(d.no)) throw new Error('Nomor rekening harus 6–20 angka');
      if (d.nik && !/^\d{16}$/.test(d.nik)) throw new Error('NIK harus 16 angka');
      var yakin = false;
      if (x.no && (d.no !== x.no || d.nik !== (x.nik || '') || d.bank !== (x.bank || ''))) {
        if (!(await tanya('Konfirmasi perubahan rekening ' + r.nama + ':\n\nLama: ' + (x.bank || '') + ' ' + x.no + (x.nik ? '\nNIK lama: ' + x.nik : '') + '\nBaru: ' + d.bank + ' ' + d.no + (d.nik ? '\nNIK baru: ' + d.nik : '') + '\n\nSimpan?'))) return false;
        yakin = true;
      }
      return kirim({ op: 'rek', k: k, data: d, yakin: yakin }, 'Rekening disimpan.');
    });
  function cek() {
    var no = nilai(w, '#mrNo').replace(/[\s.\-]/g, ''), nik = nilai(w, '#mrNik').replace(/\s/g, ''), m = [];
    m.push(no ? (/^\d{6,20}$/.test(no) ? '<div style="color:var(--g)">✓ Nomor rekening ' + no.length + ' angka</div>' : '<div style="color:var(--r)">Nomor rekening harus 6–20 angka</div>') : '<div class="mu">Nomor rekening belum diisi</div>');
    m.push(nik ? (/^\d{16}$/.test(nik) ? '<div style="color:var(--g)">✓ NIK 16 angka</div>' : '<div style="color:var(--r)">NIK harus 16 angka (sekarang ' + nik.length + ')</div>') : '<div class="mu">NIK belum diisi</div>');
    var dup = no && Object.keys(db()).filter(function (kk) { return kk !== k && db()[kk].no === no; })[0];
    if (dup) m.push('<div style="color:var(--a)">Nomor ini juga dipakai ' + e(db()[dup].nama || 'kader lain') + '</div>');
    w.querySelector('[data-cr]').innerHTML = m.join('');
  }
  w.addEventListener('input', cek); cek();
}
function mAtur() {
  var c = H.d.cfg, pk = c.poskesdes.slice();
  var t = c.ttd, k = c.kw;
  var fl = function (id, lbl, val) { return '<div class="fl"><label for="' + id + '">' + lbl + '</label><input class="in" id="' + id + '" value="' + e(val || '') + '"></div>'; };
  var w = modal('Pengaturan honor', '<h4 style="margin:0 0 8px">Nominal bawaan per bulan</h4><div class="g3f">' + JENIS.map(function (j) { return fl('maN' + j, JN_PANJANG[j], ang(c.nominal[j]).replace(/,/g, '.')); }).join('') + '</div>' +
    '<h4 style="margin:6px 0 8px">Penandatangan</h4><div class="g2f">' + fl('maPN', 'PPTK — nama', t.pptk.nama) + fl('maPI', 'PPTK — NIP', t.pptk.nip) + fl('maBN', 'Bendahara Pengeluaran — nama', t.bendahara.nama) + fl('maBI', 'Bendahara — NIP', t.bendahara.nip) + fl('maCN', 'Camat / Pengguna Anggaran — nama', t.camat.nama) + fl('maCI', 'Camat — NIP', t.camat.nip) + '</div>' +
    '<h4 style="margin:6px 0 8px">Kwitansi</h4>' + fl('maKR', 'Kode rekening', k.kodeRek) + fl('maPr', 'Program', k.program) + fl('maKg', 'Kegiatan', k.kegiatan) + fl('maSK', 'Sub kegiatan', k.subKegiatan) +
    '<div class="g2f">' + fl('maBl', 'Belanja', k.belanja) + fl('maSD', 'Sumber dana', k.sumber) + fl('maDr', 'Sudah terima dari', k.dari) + fl('maTr', 'Yang menerima', k.penerima) + '</div>' +
    '<h4 style="margin:6px 0 4px">Kader Poskesdes</h4><p class="hint" style="margin-top:0">Kader Poskesdes belum ada di Data Posyandu, jadi daftarnya diatur di sini.</p><div class="tw"><table class="tbl pk"><thead><tr><th>Nama</th><th>Poskesdes</th><th>Kelurahan</th><th></th></tr></thead><tbody data-pk></tbody></table></div><button class="bt ghost" type="button" data-pkt>+ Tambah kader Poskesdes</button>', 'Simpan pengaturan', async function (w) {
      var nom = {}; JENIS.forEach(function (j) { nom[j] = angkaDari(nilai(w, '#maN' + j)); });
      var baca = function () { return Array.prototype.map.call(w.querySelectorAll('[data-pk] tr'), function (tr) { return { id: tr.dataset.id, nama: tr.querySelector('[data-f=n]').value.trim(), pos: tr.querySelector('[data-f=p]').value.trim(), kel: tr.querySelector('[data-f=k]').value, aktif: true }; }).filter(function (x) { return x.nama; }); };
      var beda = JENIS.filter(function (j) { return nom[j] !== c.nominal[j]; });
      if (beda.length && !(await tanya('Ubah nominal bawaan ' + beda.map(function (j) { return j + ' ' + rp(c.nominal[j]) + ' → ' + rp(nom[j]); }).join(', ') + '?\nPeriode yang sudah dibuat tidak ikut berubah.'))) return false;
      return kirim({ op: 'pengaturan', cfg: { nominal: nom, ttd: { pptk: { nama: nilai(w, '#maPN'), nip: nilai(w, '#maPI') }, bendahara: { nama: nilai(w, '#maBN'), nip: nilai(w, '#maBI') }, camat: { nama: nilai(w, '#maCN'), nip: nilai(w, '#maCI') } },
        kw: { kodeRek: nilai(w, '#maKR'), program: nilai(w, '#maPr'), kegiatan: nilai(w, '#maKg'), subKegiatan: nilai(w, '#maSK'), belanja: nilai(w, '#maBl'), sumber: nilai(w, '#maSD'), dari: nilai(w, '#maDr'), penerima: nilai(w, '#maTr') }, poskesdes: baca() } }, 'Pengaturan honor disimpan.').then(function () { return muat(H.per && H.per.id); });
    });
  var tb0 = w.querySelector('[data-pk]');
  function baris(x) {
    var tr = document.createElement('tr'); tr.dataset.id = x.id || '';
    tr.innerHTML = '<td><input class="in" data-f="n" aria-label="Nama" value="' + e(x.nama || '') + '"></td><td><input class="in" data-f="p" aria-label="Poskesdes" value="' + e(x.pos || '') + '"></td><td><select class="in" data-f="k" aria-label="Kelurahan">' + KEL_H.map(function (k) { return '<option' + (k === x.kel ? ' selected' : '') + '>' + k + '</option>'; }).join('') + '</select></td><td><button class="bt ghost sm" type="button" data-pkh aria-label="Hapus">×</button></td>';
    tb0.appendChild(tr);
  }
  pk.forEach(baris);
  w.addEventListener('click', function (ev) {
    if (ev.target.closest('[data-pkt]')) { var last = tb0.lastElementChild; baris({ pos: last ? last.querySelector('[data-f=p]').value : '', kel: last ? last.querySelector('[data-f=k]').value : 'Mamboro' }); }
    var hx = ev.target.closest('[data-pkh]'); if (hx) hx.closest('tr').remove();
  });
}
function mMundur() {
  var akhir = null; langkah13().forEach(function (x, i) { if (x.ok && i > 0) akhir = x; });
  modal('Mundurkan tahap terakhir?', '<p>Tahap <b>' + e(akhir ? akhir.t : '') + '</b> akan dibuka lagi. Gunakan bila ada yang harus diperbaiki.</p><div class="fl"><label for="mmA">Alasan (wajib)</label><input class="in" id="mmA"></div>', 'Mundurkan', function (w) {
    return kirim({ op: 'mundur', alasan: nilai(w, '#mmA') }, 'Tahap dimundurkan.');
  });
}
function mBukaKunci(id, label) {
  modal('Buka kunci Honor ' + label + '?', '<p>Untuk koreksi setelah selesai. Ketik <b>BUKA ' + e(String(label).toUpperCase()) + '</b> lalu tulis alasannya. Semua perubahan tetap tercatat di Riwayat.</p><div class="fl"><label for="mkK">Ketik konfirmasi</label><input class="in" id="mkK" autocomplete="off"></div><div class="fl"><label for="mkA">Alasan</label><input class="in" id="mkA"></div>', 'Buka kunci', function (w) {
    return kirim({ op: 'bukakunci', per: id, ketik: nilai(w, '#mkK'), alasan: nilai(w, '#mkA') }, 'Kunci periode dibuka.').then(function () { H.view = ''; gambar(); });
  });
}

function mHapusPerm(id, label) {
  modal('Hapus permanen Honor ' + label + '?', '<p>Seluruh isi periode ini (daftar bayar, potongan, status) akan <b>hilang dan tidak bisa dikembalikan</b>. Hanya jejak penghapusan yang tersisa di Riwayat. Ketik <b>HAPUS ' + e(String(label).toUpperCase()) + '</b> lalu tulis alasannya.</p><div class="fl"><label for="mhK">Ketik konfirmasi</label><input class="in" id="mhK" autocomplete="off"></div><div class="fl"><label for="mhA">Alasan</label><input class="in" id="mhA"></div>', 'Hapus permanen', function (w) {
    return kirim({ op: 'hapuspermanen', per: id, ketik: nilai(w, '#mhK'), alasan: nilai(w, '#mhA') }, 'Periode dihapus permanen.').then(function () { H.view = 'semua'; return muat(); });
  });
}

/* ---------- impor rekening dari Excel ---------- */
function imporRek(file) {
  if (!window.XLSX) { var _ar = arguments; return window.denganXlsx(function () { imporRek.apply(null, _ar); }); }
  if (!window.XLSX) { alert('Alat Excel belum termuat. Periksa internet lalu coba lagi.'); return; }
  var rd = new FileReader();
  rd.onload = function () {
    try {
      var wb = XLSX.read(new Uint8Array(rd.result), { type: 'array' }), ws = wb.Sheets[wb.SheetNames[0]], A = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
      var hi = -1, kol = {};
      for (var i = 0; i < Math.min(A.length, 10); i++) { var row = A[i].map(function (x) { return String(x).toLowerCase(); }); if (row.some(function (x) { return /nama/.test(x); }) && row.some(function (x) { return /rekening/.test(x); })) { hi = i; row.forEach(function (x, j) { if (/kunci/.test(x)) kol.k = j; else if (/pemilik/.test(x)) kol.p = j; else if (/nomor rekening|no\.? rek/.test(x)) kol.no = j; else if (/^nik/.test(x)) kol.nik = j; else if (/bank/.test(x)) kol.b = j; else if (/posyandu|poskesdes/.test(x) && kol.pos == null) kol.pos = j; else if (/^nama/.test(x) && kol.n == null) kol.n = j; }); break; } }
      if (hi < 0 || kol.no == null) throw new Error('Kolom "Nama" dan "Nomor Rekening" tidak ditemukan. Pakai berkas dari tombol Unduh Excel.');
      var L = daftarRek(), rows = [], salah = [], ganti = 0, tak = [];
      A.slice(hi + 1).forEach(function (r, i) {
        var nm = String(r[kol.n] || '').trim(); if (!nm) return;
        var no = String(r[kol.no] || '').replace(/[\s.\-']/g, ''), nik = kol.nik != null ? String(r[kol.nik] || '').replace(/[\s']/g, '') : '';
        if (!no && !nik) return;
        var k = kol.k != null ? String(r[kol.k] || '').trim() : '', c = L.filter(function (x) { return x.k === k; })[0];
        if (!c) { var pos = kol.pos != null ? String(r[kol.pos] || '').toLowerCase() : ''; var cc = L.filter(function (x) { return x.nama.toLowerCase() === nm.toLowerCase() && (!pos || x.pos.toLowerCase() === pos); }); c = cc.length === 1 ? cc[0] : null; }
        if (!c) { tak.push(nm); return; }
        if (no && !/^\d{6,20}$/.test(no)) { salah.push(nm + ' (rekening)'); return; }
        if (nik && !/^\d{16}$/.test(nik)) { salah.push(nm + ' (NIK)'); return; }
        var x = c.x || {};
        if (x.no && no && x.no !== no) ganti++;
        rows.push({ k: c.k, nama: c.nama, no: no || x.no || '', nik: nik || x.nik || '', bank: (kol.b != null ? String(r[kol.b] || '').trim() : '') || x.bank || '', pemilik: (kol.p != null ? String(r[kol.p] || '').trim() : '') || x.pemilik || '' });
      });
      modal('Impor rekening dari Excel', '<div class="kvl"><span>Siap diimpor</span><b>' + rows.length + ' kader</b></div>' + (ganti ? '<div class="kvl"><span>Mengganti nomor lama</span><b style="color:var(--a)">' + ganti + ' kader</b></div>' : '') +
        (salah.length ? '<div class="warnb">Dilewati karena format salah: ' + e(salah.slice(0, 10).join(', ')) + (salah.length > 10 ? ' dan ' + (salah.length - 10) + ' lainnya' : '') + '</div>' : '') +
        (tak.length ? '<div class="warnb">Nama tidak dikenali (tidak ada di SK): ' + e(tak.slice(0, 10).join(', ')) + (tak.length > 10 ? ' dan ' + (tak.length - 10) + ' lainnya' : '') + '</div>' : '') +
        (ganti ? '<label class="ck"><input type="checkbox" id="miY">Ganti juga ' + ganti + ' nomor rekening lama dengan nomor dari Excel</label>' : ''), 'Impor', function (w) {
          if (!rows.length) throw new Error('Tidak ada baris yang bisa diimpor');
          return kirim({ op: 'rekimpor', rows: rows, yakin: !!nilai(w, '#miY') }, 'Rekening diimpor.').then(function () { return muat(H.per && H.per.id); });
        });
    } catch (er) { alert(er.message); }
  };
  rd.readAsArrayBuffer(file);
}

/* ---------- Excel ---------- */
function unduhXls(nama, sheets) {
  if (!window.XLSX) { var _ar = arguments; return window.denganXlsx(function () { unduhXls.apply(null, _ar); }); }
  if (!window.XLSX) { alert('Alat Excel belum termuat. Periksa internet lalu coba lagi.'); return; }
  var wb = XLSX.utils.book_new();
  sheets.forEach(function (s) { var ws = XLSX.utils.aoa_to_sheet(s.rows); if (s.cols) ws['!cols'] = s.cols.map(function (w) { return { wch: w }; }); XLSX.utils.book_append_sheet(wb, ws, s.nama); });
  XLSX.writeFile(wb, nama);
}
function nmBerkas(s) { return s + ' ' + H.per.label.replace(/[^\w ]+/g, '').replace(/\s+/g, ' ') + '.xlsx'; }
function xlsDaftar() {
  var sh = JENIS.filter(function (j) { return total().j[j].n; }).map(function (j) {
    var no = 0, rows = [['No', 'Nomor Rekening', 'NIK', 'Nama', j === 'Poskesdes' ? 'Nama Poskesdes' : 'Nama Posyandu', 'Kelurahan', 'Bulan', 'Jumlah']];
    bayar().filter(function (r) { return r.jenis === j; }).forEach(function (r) { var x = rekOf(r) || {}; rows.push([++no, x.no || '', x.nik || '', r.nama.toUpperCase(), r.pos.toUpperCase(), 'KEL. ' + r.kel.toUpperCase(), r.bulan, bruto(r)]); });
    rows.push(['', '', '', 'TOTAL', '', '', '', total().j[j].bruto]);
    return { nama: j, rows: rows, cols: [5, 18, 20, 28, 18, 22, 7, 12] };
  });
  unduhXls(nmBerkas('Daftar Bayar Honor'), sh);
}
function xlsRekap() {
  var t = total(), r1 = [['No', 'Kecamatan', 'Posyandu & Poskesdes', 'Jumlah Kader', 'Jumlah Bulan', 'Insentif per Bulan', 'Jumlah Uang Diterima', 'Ket']];
  grupRekap().forEach(function (g, i) { r1.push([i + 1, 'PALU UTARA', JN_PANJANG[g.j].toUpperCase(), g.n, g.bulan, g.nom, g.jml, '']); });
  r1.push(['', '', 'JUMLAH', t.n, '', '', t.bruto, '']);
  var pk = perKel(), r2 = [['Kelurahan', 'Balita', 'Lansia', 'Poskesdes', 'Penerima', 'Total honor']];
  Object.keys(pk).forEach(function (k) { var x = pk[k]; r2.push([k, x.Balita, x.Lansia, x.Poskesdes, x.n, x.jml]); });
  r2.push(['Jumlah', t.j.Balita.n, t.j.Lansia.n, t.j.Poskesdes.n, t.n, t.bruto]);
  unduhXls(nmBerkas('Rekap Honor'), [{ nama: 'Rekap', rows: r1, cols: [5, 14, 22, 12, 12, 16, 20, 10] }, { nama: 'Per kelurahan', rows: r2, cols: [20, 8, 8, 10, 10, 16] }]);
}
function ketPot(k) { return potOf(k).map(function (p) { return p.jenis + ' Rp' + ang(p.nom).replace(/,/g, '.') + ' - ' + p.ket + ', ' + (p.tujuan === 'tunai' ? 'tunai ke ' + p.ke.nama : 'diteruskan ke ' + p.ke.nama + ' (' + p.ke.bank + ' ' + p.ke.no + ')'); }).join('; '); }
function xlsTransfer() {
  var rows = [['No', 'Jenis', 'Nomor Rekening', 'Bank', 'Nama', 'Nama Posyandu', 'Kelurahan', 'Bulan', 'Honor', 'Potongan', 'Keterangan Potongan', 'Jumlah Ditransfer ke Kader']];
  JENIS.forEach(function (j) { var no = 0; bayar().filter(function (r) { return r.jenis === j; }).forEach(function (r) { var x = rekOf(r) || {}; rows.push([++no, JN_PANJANG[j], x.no || 'rekening belum ada', x.bank || '', r.nama.toUpperCase(), r.pos.toUpperCase(), r.kel.toUpperCase(), r.bulan, bruto(r), potSum(r.k), ketPot(r.k), bruto(r) - potSum(r.k)]); }); });
  var t = total(); rows.push(['', 'JUMLAH', '', '', '', '', '', '', t.bruto, t.pot, '', t.bruto - t.pot]);
  unduhXls(nmBerkas('Daftar Transfer Honor'), [{ nama: 'Daftar transfer', rows: rows, cols: [5, 16, 18, 12, 26, 18, 18, 6, 11, 10, 50, 14] }]);
}
function xlsRek() {
  if (!window.XLSX) { var _ar = arguments; return window.denganXlsx(function () { xlsRek.apply(null, _ar); }); }
  var rows = [['Kunci (jangan diubah)', 'Nama', 'Posyandu / Poskesdes', 'Jenis', 'Kelurahan', 'Nama Bank', 'Nomor Rekening', 'Nama Pemilik Rekening', 'NIK']];
  daftarRek().forEach(function (r) { var x = r.x || {}; rows.push([r.k, r.nama, r.pos, r.jenis, r.kel, x.bank || '', x.no || '', x.pemilik || '', x.nik || '']); });
  if (!window.XLSX) { alert('Alat Excel belum termuat.'); return; }
  var ws = XLSX.utils.aoa_to_sheet(rows);
  for (var i = 2; i <= rows.length; i++) ['G', 'I'].forEach(function (c) { var a = ws[c + i]; if (a) { a.t = 's'; a.v = String(a.v); a.z = '@'; } });
  ws['!cols'] = [20, 26, 18, 10, 18, 14, 20, 26, 20].map(function (w) { return { wch: w }; });
  var wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Rekening'); XLSX.writeFile(wb, 'Rekening Kader Posyandu.xlsx');
}
function xlsRiwayat() { unduhXls(nmBerkas('Riwayat Honor'), [{ nama: 'Riwayat', rows: [['Waktu', 'Oleh', 'Periode', 'Perubahan', 'Nilai lama', 'Nilai baru']].concat((H.rw || []).map(function (x) { return [x.w, x.u, x.per, x.a, x.l, x.b]; })), cols: [17, 10, 9, 70, 20, 20] }]); }

/* ---------- PDF (pdf-lib) ---------- */
var PDFP = null;
function pdfLib() {
  if (window.PDFLib) return Promise.resolve(window.PDFLib);
  if (PDFP) return PDFP;
  PDFP = new Promise(function (res, rej) { var s = document.createElement('script'); s.src = 'pdf-lib.min.js?v=1171'; s.onload = function () { window.PDFLib ? res(window.PDFLib) : (PDFP = null, rej(new Error('Alat PDF tidak termuat'))); }; s.onerror = function () { PDFP = null; rej(new Error('Alat PDF belum bisa dimuat. Periksa internet.')); }; document.head.appendChild(s); });
  return PDFP;
}
function win(t) { return String(t == null ? '' : t).replace(/[–—]/g, '-').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/•/g, '*').replace(/[^\x20-\x7E\xA0-\xFF]/g, '?'); }
/* Alat gambar halaman sederhana: teks dengan potong baris, kotak, dan tabel. */
function Kanvas(L, doc, F, ukuran) {
  var K = { doc: doc, F: F, W: ukuran[0], Hh: ukuran[1], pg: null, y: 0 };
  K.baru = function () { K.pg = doc.addPage(ukuran); K.y = K.Hh - 40; return K.pg; };
  K.lebar = function (t, f, s) { return f.widthOfTextAtSize(win(t), s); };
  K.teks = function (t, x, y, o) { o = o || {}; var f = o.b ? F.b : (o.f || F.r), s = o.s || 9, tt = win(t), w = f.widthOfTextAtSize(tt, s); var xx = o.al === 'c' ? x - w / 2 : o.al === 'r' ? x - w : x; K.pg.drawText(tt, { x: xx, y: y, size: s, font: f, color: L.rgb(0, 0, 0) }); if (o.u) K.pg.drawLine({ start: { x: xx, y: y - 1.5 }, end: { x: xx + w, y: y - 1.5 }, thickness: .6, color: L.rgb(0, 0, 0) }); return w; };
  K.potong = function (t, f, s, maks) {
    var kata = win(t).split(/\s+/), out = [], b = '';
    kata.forEach(function (k) { var c = b ? b + ' ' + k : k; if (f.widthOfTextAtSize(c, s) <= maks || !b) b = c; else { out.push(b); b = k; } while (f.widthOfTextAtSize(b, s) > maks && b.length > 1) { var i = b.length; while (i > 1 && f.widthOfTextAtSize(b.slice(0, i), s) > maks) i--; out.push(b.slice(0, i)); b = b.slice(i); } });
    if (b) out.push(b); return out.length ? out : [''];
  };
  K.kotak = function (x, y, w, h, o) { o = o || {}; K.pg.drawRectangle({ x: x, y: y, width: w, height: h, borderColor: o.garis === false ? undefined : L.rgb(0, 0, 0), borderWidth: o.garis === false ? 0 : .6, color: o.isi ? L.rgb(o.isi[0], o.isi[1], o.isi[2]) : undefined }); };
  return K;
}
function ttdBlok(K, x, y, judul, nama, nip, o) {
  o = o || {}; var s = o.s || 9.5, l = judul.split('\n');
  l.forEach(function (t, i) { K.teks(t, x, y - i * 12, { al: 'c', s: s }); });
  var yn = y - l.length * 12 - (o.ruang || 46);
  K.teks(nama || '....................................', x, yn, { al: 'c', s: s, b: true, u: !!nama });
  if (nip !== null) K.teks(nip ? 'NIP. ' + nip : 'NIP. ....................................', x, yn - 12, { al: 'c', s: s });
  return yn - 12;
}
function bulanJudul() { var b = H.per.bulan; return b.length === 1 ? BLN[+b[0].slice(5) - 1].toUpperCase() : (BLN[+b[0].slice(5) - 1] + ' S.D. ' + BLN[+b[b.length - 1].slice(5) - 1]).toUpperCase(); }
function tahunPer() { return String(H.per.bulan[H.per.bulan.length - 1]).slice(0, 4); }
/* Mengunduh PDF daftar bayar otomatis dicatat sebagai "dibuat" dan "dicetak" (tidak ada lagi tombol tandai dicetak). */
function tandaiDibuat() {
  if (!H.per || kunci() || st().cetak) return;
  (st().dbt ? Promise.resolve() : kirim({ op: 'langkah', l: 'dbt' })).then(function () { return kirim({ op: 'langkah', l: 'cetak' }); }).catch(function () { });
}

/* Ukuran kertas yang dipilih (A4 atau F4). Semua isi PDF dihitung dari ukuran ini: lebar ikut sx, tinggi ikut sy. */
var KRT = 'A4';
function kp() { return window.Kertas ? Kertas.ukuran(KRT, false) : [595.28, 841.89]; }
function kl() { return window.Kertas ? Kertas.ukuran(KRT, true) : [841.89, 595.28]; }
function pdfDaftarBayar(doc, L, F) {
  var c = H.d.cfg.ttd, A4 = kp(), sx = A4[0] / 595.28, sy = A4[1] / 841.89, K = Kanvas(L, doc, F, A4), M = 30 * sx;
  var kol = [['NO', 20], ['NOMOR\nREKENING', 66], ['NIK', 74], ['NAMA', 92], ['NAMA\nPOSYANDU', 62], ['ALAMAT', 66], ['', 12], ['', 24], ['', 49], ['TANDA TANGAN', 70.28]];
  kol.forEach(function (k) { k[1] *= sx; });
  var X = [M]; kol.forEach(function (k) { X.push(X[X.length - 1] + k[1]); });
  JENIS.forEach(function (j) {
    var rows = bayar().filter(function (r) { return r.jenis === j; }); if (!rows.length) return;
    var judul = j === 'Poskesdes' ? 'KADER POSKESDES' : 'KADER ' + JN_PANJANG[j].toUpperCase();
    var kepala = function (pertama) {
      K.baru();
      if (pertama) { K.teks(judul, A4[0] / 2, K.y, { al: 'c', b: true, s: 11 }); K.teks('KECAMATAN PALU UTARA TAHUN ' + tahunPer(), A4[0] / 2, K.y - 14, { al: 'c', b: true, s: 11 }); K.y -= 36; K.teks('BULAN', M + 22, K.y, { b: true, s: 9 }); K.teks(': ' + bulanJudul(), M + 70, K.y, { s: 9 }); K.y -= 8; }
      var hh = 26, y0 = K.y - hh;
      for (var i = 0; i < kol.length; i++) K.kotak(X[i], y0, kol[i][1], hh, { isi: [.9, .9, .9] });
      K.kotak(X[6], y0, X[9] - X[6], hh, { isi: [.9, .9, .9] });
      kol.forEach(function (k, i) { if (i >= 6 && i <= 8) return; var ls = (j === 'Poskesdes' && i === 4 ? 'NAMA\nPOSKESDES' : k[0]).split('\n'); ls.forEach(function (t, q) { K.teks(t, X[i] + k[1] / 2, y0 + hh / 2 + (ls.length - 1) * 4.5 - q * 9 - 3, { al: 'c', b: true, s: 7.5 }); }); });
      K.teks('JUMLAH YANG', (X[6] + X[9]) / 2, y0 + hh / 2 + 1.5, { al: 'c', b: true, s: 7.5 }); K.teks('DITERIMA', (X[6] + X[9]) / 2, y0 + hh / 2 - 7.5, { al: 'c', b: true, s: 7.5 });
      K.y = y0;
    };
    kepala(true);
    var rh = 21 * sy, grupAwal = 0, no = 0;
    var tutupGrup = function (dari, sampai, r) { if (!r || dari - sampai < 1) return; var yA = dari, yB = sampai; K.kotak(X[4], yB, kol[4][1], yA - yB); K.kotak(X[5], yB, kol[5][1], yA - yB);
      var ym = (yA + yB) / 2, l1 = K.potong(r.pos.toUpperCase(), F.b, 7.5, kol[4][1] - 4), l2 = K.potong((j === 'Poskesdes' ? 'KELURAHAN ' : 'KEL. ') + r.kel.toUpperCase(), F.r, 7.5, kol[5][1] - 4);
      l1.forEach(function (t, i) { K.teks(t, X[4] + kol[4][1] / 2, ym + (l1.length - 1) * 4.5 - i * 9 - 3, { al: 'c', b: true, s: 7.5 }); });
      l2.forEach(function (t, i) { K.teks(t, X[5] + kol[5][1] / 2, ym + (l2.length - 1) * 4.5 - i * 9 - 3, { al: 'c', s: 7.5 }); }); };
    var gA = K.y, gR = null;
    rows.forEach(function (r) {
      if (K.y - rh < 150 && K.y - rh < 60 + 0) { }
      if (K.y - rh < 46 * sy) { tutupGrup(gA, K.y, gR); kepala(false); gA = K.y; }
      if (gR && (gR.pos !== r.pos || gR.kel !== r.kel)) { tutupGrup(gA, K.y, gR); gA = K.y; }
      gR = r; no++;
      var y = K.y - rh, x = rekOf(r) || {};
      [0, 1, 2, 3, 6, 7, 8, 9].forEach(function (i) { K.kotak(X[i], y, kol[i][1], rh, (i === 1 && !x.no) || (i === 2 && !x.nik) ? { isi: [.75, .75, .75] } : null); });
      var ty = y + rh / 2 - 3;
      K.teks(String(no), X[0] + 10, ty, { al: 'c', s: 7.5 }); if (x.no) K.teks(x.no, X[1] + 3, ty, { s: 7.5 }); if (x.nik) K.teks(x.nik, X[2] + 3, ty, { s: 7.5 });
      var nl = K.potong(r.nama.toUpperCase(), F.r, 7.5, kol[3][1] - 5); nl.slice(0, 2).forEach(function (t, i) { K.teks(t, X[3] + 3, ty + (Math.min(nl.length, 2) - 1) * 4 - i * 8, { s: 7.5 }); });
      K.teks(String(r.bulan), X[6] + 6, ty, { al: 'c', s: 7.5 }); K.teks('Bulan', X[7] + 2, ty, { s: 7.5 }); K.teks(ang(bruto(r)), X[9] - 3, ty, { al: 'r', s: 7.5 });
      K.teks(String(no), no % 2 ? X[9] + 3 : X[10] - 3, ty, { al: no % 2 ? 'l' : 'r', s: 7 });
      K.y = y;
    });
    tutupGrup(gA, K.y, gR);
    var yt = K.y - 16; K.kotak(X[0], yt, X[8] - X[0], 16); K.kotak(X[8], yt, kol[8][1], 16); K.kotak(X[9], yt, kol[9][1], 16);
    K.teks('TOTAL', (X[0] + X[8]) / 2, yt + 5, { al: 'c', b: true, s: 8 }); K.teks(ang(total().j[j].bruto), X[9] - 3, yt + 5, { al: 'r', b: true, s: 8 });
    K.y = yt;
    if (K.y < 230 * sy) { K.baru(); }
    var yb = K.y - 30;
    ttdBlok(K, 160 * sx, yb, 'Pejabat Pelaksana Teknis Kegiatan\nPPTK', c.pptk.nama, c.pptk.nip);
    ttdBlok(K, 435 * sx, yb, 'Bendahara Pengeluaran\n ', c.bendahara.nama, c.bendahara.nip);
    ttdBlok(K, A4[0] / 2, yb - 100 * sy, 'Mengetahui\nCAMAT PALU UTARA', c.camat.nama, c.camat.nip);
  });
}
function pdfRekap(doc, L, F) {
  var c = H.d.cfg.ttd, A4 = kp(), sx = A4[0] / 595.28, sy = A4[1] / 841.89, K = Kanvas(L, doc, F, A4), t = total(); K.baru();
  ['REKAPITULASI PEMBAYARAN INSENTIF KADER POSYANDU & KADER POSKESDES', 'DI 5 KELURAHAN KECAMATAN PALU UTARA KOTA PALU', 'BULAN ' + bulanJudul() + ' ' + tahunPer()].forEach(function (s, i) { K.teks(s, A4[0] / 2, K.y - 10 - i * 14, { al: 'c', b: true, s: 10.5 }); });
  var M = 40 * sx, kol = [22, 62, 110, 52, 52, 60, 88, 69.28].map(function (w) { return w * sx; }), X = [M]; kol.forEach(function (w) { X.push(X[X.length - 1] + w); });
  var y = K.y - 70, h1 = 14, h2 = 30;
  [[0, 'NO'], [1, 'KECAMATAN'], [2, 'POSYANDU &\nPOSKESDES'], [6, 'JUMLAH UANG\nDITERIMA'], [7, 'KET']].forEach(function (a) { K.kotak(X[a[0]], y - h1 - h2, kol[a[0]], h1 + h2, { isi: [.9, .9, .9] }); var ls = a[1].split('\n'); ls.forEach(function (s, q) { K.teks(s, X[a[0]] + kol[a[0]] / 2, y - (h1 + h2) / 2 + (ls.length - 1) * 4.5 - q * 9 - 3, { al: 'c', b: true, s: 7.5 }); }); });
  K.kotak(X[3], y - h1, X[6] - X[3], h1, { isi: [.9, .9, .9] }); K.teks('JUMLAH', (X[3] + X[6]) / 2, y - h1 + 4, { al: 'c', b: true, s: 7.5 });
  [[3, 'JUMLAH\nKADER'], [4, 'JUMLAH\nBULAN'], [5, 'INSENTIF\nPER BULAN']].forEach(function (a) { K.kotak(X[a[0]], y - h1 - h2, kol[a[0]], h2, { isi: [.9, .9, .9] }); var ls = a[1].split('\n'); ls.forEach(function (s, q) { K.teks(s, X[a[0]] + kol[a[0]] / 2, y - h1 - h2 / 2 + 4.5 - q * 9 - 3, { al: 'c', b: true, s: 7.5 }); }); });
  y -= h1 + h2;
  var G = grupRekap(), rh = 14 * sy, tb = 4 * sy, yA = y;
  G.forEach(function (g, i) {
    var yy = y - rh; [0, 2, 3, 4, 5, 6, 7].forEach(function (q) { K.kotak(X[q], yy, kol[q], rh); });
    K.teks(String(i + 1), X[0] + 11, yy + tb, { al: 'c', s: 8 }); K.teks(JN_PANJANG[g.j].toUpperCase(), X[2] + 3, yy + tb, { s: 8 }); K.teks(String(g.n), X[3] + kol[3] / 2, yy + tb, { al: 'c', s: 8 });
    K.teks(String(g.bulan), X[4] + kol[4] / 2, yy + tb, { al: 'c', s: 8 }); K.teks(ang(g.nom), X[6] - 3, yy + tb, { al: 'r', s: 8 }); K.teks(ang(g.jml), X[7] - 3, yy + tb, { al: 'r', s: 8 });
    y = yy;
  });
  K.kotak(X[1], y, kol[1], yA - y); K.teks('PALU UTARA', X[1] + kol[1] / 2, (yA + y) / 2 - 3, { al: 'c', s: 8 });
  var yj = y - rh; [0, 1, 2, 3, 4, 5, 6, 7].forEach(function (q) { K.kotak(X[q], yj, kol[q], rh); });
  K.teks('JUMLAH', X[2] + kol[2] / 2, yj + tb, { al: 'c', b: true, s: 8 }); K.teks(String(t.n), X[3] + kol[3] / 2, yj + tb, { al: 'c', b: true, s: 8 }); K.teks(ang(t.bruto), X[7] - 3, yj + tb, { al: 'r', b: true, s: 8 });
  var yb = yj - 50 * sy, tgl = st().rekap ? tglId(new Date(st().rekap)) : tglId();
  ttdBlok(K, 160 * sx, yb - 12, 'Lunas Bayar\nBendahara Pengeluaran', c.bendahara.nama, c.bendahara.nip);
  K.teks('Palu, ' + tgl, 430 * sx, yb, { al: 'c', s: 9.5 });
  ttdBlok(K, 430 * sx, yb - 12, 'Setuju Bayar\nPengguna Anggaran', c.camat.nama, c.camat.nip);
}
function pdfKwitansi(doc, L, F) {
  var c = H.d.cfg, k = kwData(), t = total(), A4 = kp(), sx = A4[0] / 595.28, sy = A4[1] / 841.89, K = Kanvas(L, doc, { r: F.tr, b: F.tb }, A4), M = 60 * sx, x1 = M + 118 * sx, x2 = x1 + 10, wv = A4[0] - M - x2; K.baru();
  var y = K.y - 20;
  var kv = function (lbl, val, o) { o = o || {}; K.teks(lbl, M, y, { s: 11 }); K.teks(':', x1, y, { s: 11 }); var ls = K.potong(val, o.b ? F.tb : F.tr, 11, o.w || wv); ls.forEach(function (s, i) { K.teks(s, x2, y - i * 15, { s: 11, b: o.b }); }); y -= ls.length * 15 + (o.sp || 4 * sy); };
  K.teks('Tahun', M, y, { s: 11 }); K.teks(':', x1, y, { s: 11 }); K.teks(k.tahun, x2, y, { s: 11 }); K.teks('Sumber Dana: ' + k.sumber, A4[0] - M, y, { al: 'r', s: 11 }); y -= 19;
  kv('Kode Rekening', c.kw.kodeRek); kv('Program', c.kw.program); kv('Kegiatan', c.kw.kegiatan); kv('Sub Kegiatan', c.kw.subKegiatan); kv('Belanja', c.kw.belanja);
  y -= 26 * sy; K.teks('KWITANSI PENERIMAAN', A4[0] / 2, y, { al: 'c', b: true, s: 12.5, u: true }); y -= 14;
  if (k.nomor) { K.teks('Nomor: ' + k.nomor, A4[0] / 2, y, { al: 'c', s: 10.5 }); } y -= 26 * sy;
  kv('Sudah Terima Dari', k.dari, { sp: 10 * sy }); kv('Uang Sebesar', terbilang(t.bruto), { sp: 10 * sy }); kv('Untuk Pembayaran', k.untuk, { sp: 10 * sy }); kv('Terbilang', 'Rp. ' + ang(t.bruto).replace(/,/g, '.') + ',-', { b: true });
  var yb = y - 50 * sy;
  ttdBlok(K, 135 * sx, yb, 'Pejabat Pelaksana Teknis Kegiatan\nPPTK', c.ttd.pptk.nama, c.ttd.pptk.nip, { s: 10 });
  ttdBlok(K, 300 * sx, yb, 'Lunas Bayar\nBendahara Pengeluaran', c.ttd.bendahara.nama, c.ttd.bendahara.nip, { s: 10 });
  K.teks('Palu, ' + k.tgl, 465 * sx, yb + 12, { al: 'c', s: 10 }); K.teks('Yang Menerima', 465 * sx, yb, { al: 'c', s: 10 });
  K.kotak(445 * sx, yb - 48, 40, 30, { isi: null }); K.teks('materai', 465 * sx, yb - 36, { al: 'c', s: 7 });
  K.teks(k.penerima || '....................', 465 * sx, yb - 70, { al: 'c', s: 10, b: true });
  ttdBlok(K, A4[0] / 2, yb - 120 * sy, 'Mengetahui\nCAMAT PALU UTARA', c.ttd.camat.nama, c.ttd.camat.nip, { s: 10 });
}
function pdfTransfer(doc, L, F) {
  var A4 = kl(), sx = A4[0] / 841.89, sy = A4[1] / 595.28, K = Kanvas(L, doc, F, A4), M = 28 * sx, t = total();
  var kol = [['NO', 22], ['NOMOR REKENING', 78], ['NAMA', 110], ['NAMA POSYANDU', 80], ['KELURAHAN', 76], ['BLN', 24], ['HONOR', 48], ['POTONGAN', 50], ['KETERANGAN POTONGAN\n(jenis, alasan, diteruskan ke)', 214], ['JUMLAH DITRANSFER\nKE KADER', 83.89]];
  kol.forEach(function (k) { k[1] *= sx; });
  var X = [M]; kol.forEach(function (k) { X.push(X[X.length - 1] + k[1]); });
  var hal = 0;
  var kepala = function (pertama) {
    K.baru(); hal++;
    if (pertama) { K.teks('DAFTAR TRANSFER HONOR KADER POSYANDU BALITA, POSYANDU LANSIA DAN KADER POSKESDES', A4[0] / 2, K.y, { al: 'c', b: true, s: 11 }); K.teks('5 KELURAHAN KECAMATAN PALU UTARA - BULAN ' + bulanJudul() + ' ' + tahunPer(), A4[0] / 2, K.y - 14, { al: 'c', b: true, s: 11 });
      K.teks('Untuk Bendahara Pengeluaran - dana masuk rekening kantor: Rp' + ang(st().danaJml || t.bruto).replace(/,/g, '.'), M, K.y - 32, { s: 8.5 }); K.y -= 40; }
    var hh = 24, y0 = K.y - hh; kol.forEach(function (k, i) { K.kotak(X[i], y0, k[1], hh, { isi: [.9, .9, .9] }); var ls = k[0].split('\n'); ls.forEach(function (s, q) { K.teks(s, X[i] + k[1] / 2, y0 + hh / 2 + (ls.length - 1) * 4.5 - q * 9 - 3, { al: 'c', b: true, s: 7 }); }); });
    K.y = y0; K.teks('Hal. ' + hal, A4[0] - M, 18, { al: 'r', s: 7.5 });
  };
  kepala(true);
  var baris = function (sel, o) {
    o = o || {}; var ket = o.ket ? K.potong(o.ket, F.r, 6.8, kol[8][1] - 6) : [''], rh = Math.max(14 * sy, ket.length * 8 + 6);
    if (K.y - rh < 30) kepala(false);
    var y = K.y - rh;
    if (o.grp) { K.kotak(X[0], y, X[10] - X[0], rh, { isi: [.94, .94, .94] }); K.teks(o.grp, X[0] + 4, y + 4, { b: true, s: 7.5 }); K.y = y; return; }
    kol.forEach(function (k, i) { K.kotak(X[i], y, k[1], rh, (i === 1 && o.abu) ? { isi: [.75, .75, .75] } : (o.kuning ? { isi: [1, .97, .86] } : null)); });
    var ty = y + rh - 10;
    sel.forEach(function (v, i) { if (v === '' || v == null || i === 8) return; var al = (i >= 6 && i !== 8) || i === 9 ? 'r' : (i === 0 || i === 5 ? 'c' : 'l'); K.teks(String(v), al === 'r' ? X[i + 1] - 3 : al === 'c' ? X[i] + kol[i][1] / 2 : X[i] + 3, ty, { al: al, s: 7, b: o.b }); });
    ket.forEach(function (s, q) { K.teks(s, X[8] + 3, ty - q * 8, { s: 6.8 }); });
    K.y = y;
  };
  var hur = { Balita: 'A', Lansia: 'B', Poskesdes: 'C' }, tanpa = 0;
  JENIS.forEach(function (j) {
    var rows = bayar().filter(function (r) { return r.jenis === j; }); if (!rows.length) return;
    baris(null, { grp: hur[j] + '. ' + (j === 'Poskesdes' ? 'KADER POSKESDES' : JN_PANJANG[j].toUpperCase()) });
    rows.forEach(function (r, i) {
      var x = rekOf(r) || {}, p = potSum(r.k), b = bruto(r); if (!x.no) tanpa++;
      baris([i + 1, x.no || '', r.nama.toUpperCase(), r.pos.toUpperCase(), r.kel.toUpperCase(), r.bulan, ang(b), p ? ang(p) : '-', '', ang(b - p)], { ket: x.no ? ketPot(r.k) : ('rekening belum ada' + (p ? '; ' + ketPot(r.k) : '')), abu: !x.no, kuning: !!p });
    });
    var g = t.j[j]; baris(['', '', 'Jumlah ' + JN_PANJANG[j] + ' (' + g.n + ' kader)', '', '', '', ang(g.bruto), ang(g.pot), '', ang(g.bruto - g.pot)], { b: true });
  });
  if (K.y < 190 * sy) kepala(false);
  var y = K.y - 24, w = [190, 80, 80, 96].map(function (v) { return v * sx; }), XX = [M]; w.forEach(function (v) { XX.push(XX[XX.length - 1] + v); });
  var rr = [['RINGKASAN', '', '', ''], ['Jenis', 'Honor', 'Potongan', 'Ditransfer ke kader']];
  JENIS.forEach(function (j) { var g = t.j[j]; if (g.n) rr.push([JN_PANJANG[j] + ' (' + g.n + ')', ang(g.bruto), ang(g.pot), ang(g.bruto - g.pot)]); });
  rr.push(['JUMLAH (' + t.n + ' kader)', ang(t.bruto), ang(t.pot), ang(t.bruto - t.pot)], ['Potongan yang diteruskan sesuai keterangan', '', '', ang(t.pot)], ['TOTAL DANA (= dana masuk rekening kantor)', '', '', ang(t.bruto)]);
  rr.forEach(function (r, i) {
    var yy = y - 14, tebal = i === 0 || i === 1 || i >= rr.length - 3 && i !== rr.length - 2;
    if (i === 0) { K.kotak(XX[0], yy, XX[4] - XX[0], 14, { isi: [.94, .94, .94] }); K.teks(r[0], XX[0] + 3, yy + 4, { b: true, s: 7.5 }); }
    else if (i >= rr.length - 2) { K.kotak(XX[0], yy, XX[3] - XX[0], 14); K.kotak(XX[3], yy, w[3], 14); K.teks(r[0], XX[0] + 3, yy + 4, { s: 7.5, b: i === rr.length - 1 }); K.teks(r[3], XX[4] - 3, yy + 4, { al: 'r', s: 7.5, b: i === rr.length - 1 }); }
    else r.forEach(function (v, q) { K.kotak(XX[q], yy, w[q], 14, i === 1 ? { isi: [.9, .9, .9] } : null); K.teks(v, q ? XX[q + 1] - 3 : XX[q] + 3, yy + 4, { al: q ? 'r' : 'l', s: 7.5, b: tebal && i !== 1 ? i === rr.length - 3 : i === 1 }); });
    y = yy;
  });
  K.teks('Kader tanpa nomor rekening: ' + tanpa + ' orang (baris abu-abu) - mohon arahan bendahara.', M, y - 16, { s: 8 });
  K.teks('Palu, ' + tglId(), M, y - 30, { s: 8 });
}
function pdfPenanda(doc, L, F, judul, isi) {
  var A4 = kp(), sx = A4[0] / 595.28, sy = A4[1] / 841.89, K = Kanvas(L, doc, F, A4); K.baru();
  K.kotak(60 * sx, 300 * sy, A4[0] - 120 * sx, 260 * sy, { isi: [.97, .97, .97] });
  K.teks(judul, A4[0] / 2, 520 * sy, { al: 'c', b: true, s: 15 });
  isi.forEach(function (s, i) { K.teks(s, A4[0] / 2, 480 * sy - i * 18, { al: 'c', s: 11 }); });
}
function buatPdf(jenis) {
  var t0 = performance.now(), sb = window.sibukTombol ? window.sibukTombol('Menyiapkan PDF…') : function () { }, dl = window.Dlg ? Dlg.sibuk('Menyusun PDF…') : function () { };
  return buatPdf0(jenis).then(function (r) { if (window.perfCatat) perfCatat('Susun PDF honor: ' + jenis, t0, true); sb(); dl(); return r; }, function (er) { sb(); dl(); throw er; });
}
function buatPdf0(jenis) {
  return pdfLib().then(function (L) {
    return L.PDFDocument.create().then(function (doc) {
      return Promise.all([doc.embedFont(L.StandardFonts.Helvetica), doc.embedFont(L.StandardFonts.HelveticaBold), doc.embedFont(L.StandardFonts.TimesRoman), doc.embedFont(L.StandardFonts.TimesRomanBold)]).then(function (f) {
        var F = { r: f[0], b: f[1], tr: f[2], tb: f[3] }, nama;
        doc.setTitle(win('Honor ' + H.per.label)); doc.setCreator('Pantau Posyandu Kecamatan Palu Utara');
        if (jenis === 'db') { pdfDaftarBayar(doc, L, F); nama = 'Daftar Bayar Honor'; }
        if (jenis === 'rk') { pdfRekap(doc, L, F); nama = 'Rekapitulasi Honor'; }
        if (jenis === 'kw') { pdfKwitansi(doc, L, F); nama = 'Kwitansi Honor'; }
        if (jenis === 'tf') { pdfTransfer(doc, L, F); nama = 'Daftar Transfer Honor'; }
        if (jenis !== 'berkas') return doc.save().then(function (b) { return { b: b, nama: nama }; });
        pdfKwitansi(doc, L, F); pdfRekap(doc, L, F);
        var t = total();
        pdfPenanda(doc, L, F, 'DAFTAR BAYAR YANG SUDAH DITANDATANGANI', ['Sisipkan di sini daftar bayar asli bertanda tangan:'].concat(JENIS.filter(function (j) { return t.j[j].n; }).map(function (j) { return JN_PANJANG[j] + ' - ' + t.j[j].n + ' kader - Rp' + ang(t.j[j].bruto).replace(/,/g, '.'); })).concat(['Honor ' + H.per.label]));
        var sk = H.d.sk || {}, adaJ = JENIS.filter(function (j) { return t.j[j].n; });
        return adaJ.reduce(function (pr, j) {
          return pr.then(function () {
            if (!sk[j]) { pdfPenanda(doc, L, F, 'SK ' + JN_PANJANG[j].toUpperCase(), ['SK belum diunggah di aplikasi.', 'Sisipkan SK cetak di sini.']); return; }
            toast('Mengambil SK ' + j + '…');
            return ambil('sk', { jenis: j }).then(function (r) {
              var bin = atob(r.b64), u = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
              return L.PDFDocument.load(u, { ignoreEncryption: true }).then(function (s) { return doc.copyPages(s, s.getPageIndices()).then(function (pp) { pp.forEach(function (p) { doc.addPage(p); }); }); });
            }).catch(function (er) { pdfPenanda(doc, L, F, 'SK ' + JN_PANJANG[j].toUpperCase(), ['SK tidak bisa diambil: ' + er.message, 'Sisipkan SK cetak di sini.']); });
          });
        }, Promise.resolve()).then(function () { return doc.save(); }).then(function (b) { return { b: b, nama: 'Berkas Pengajuan Honor' }; });
      });
    });
  });
}
function unduhPdf(jenis, tombol) {
  if (!window.Kertas) return unduhPdf0(jenis, tombol);
  var ket = { db: 'Daftar bayar.', rk: 'Rekapitulasi.', kw: 'Kwitansi.', tf: 'Daftar transfer (mendatar).', berkas: 'Halaman SK dan daftar bayar bertanda tangan tetap ukuran aslinya.' }[jenis] || '';
  return Kertas.pilih(ket).then(function (k) { if (!k) return; KRT = k; return unduhPdf0(jenis, tombol); });
}
function unduhPdf0(jenis, tombol) {
  if (tombol) { tombol.disabled = true; var lama = tombol.innerHTML; tombol.textContent = 'Menyiapkan…'; }
  return buatPdf(jenis).then(function (o) {
    var blob = new Blob([o.b], { type: 'application/pdf' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = o.nama + ' ' + H.per.label + '.pdf'; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
    if (jenis === 'db') tandaiDibuat();
    if (tombol) { tombol.disabled = false; tombol.innerHTML = lama; }
    window.HONOR_PDF_TERAKHIR = o;
  }).catch(function (er) { if (tombol) { tombol.disabled = false; tombol.innerHTML = lama; } alert('PDF gagal dibuat: ' + er.message); });
}

/* ---------- Gabung PDF untuk SIPD: scan berkas pengajuan bertanda tangan + scan laporan Posyandu, digabung di perangkat ---------- */
function mbSize(b) { return b >= 1048576 ? (b / 1048576).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }
function tik() { return new Promise(function (r) { setTimeout(r, 0); }); }
function detikTeks(d) { d = Math.max(1, Math.round(d)); return d < 60 ? d + ' detik' : Math.floor(d / 60) + ' menit ' + (d % 60) + ' detik'; }
async function mGabung() {
  var L; try { L = await pdfLib(); } catch (er) { alert(er.message); return; }
  var G = { A: [], B: [] }, uid = 0;
  var w = modal('Gabung PDF untuk SIPD',
    '<p class="mu sm">Berkas digabung di komputer Anda dan tidak diunggah ke mana pun. Hasilnya: berkas pengajuan bertanda tangan, lalu laporan Posyandu.</p>' +
    '<div class="gbs"><div class="gbh"><span class="gbn">1</span><b>Berkas pengajuan bertanda tangan</b></div><p class="mu sm">Hasil scan setelah ditandatangani Camat dan PPTK (sudah berisi SPM-LS, kwitansi, rekap, daftar bayar, dan SK).</p><div data-gl="A"></div>' +
    '<label class="bt out sm gbadd">+ Tambah berkas<input type="file" multiple hidden accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" data-gf="A"></label><span class="mu sm"> PDF, atau foto JPG/PNG bila scan terbagi beberapa berkas</span></div>' +
    '<div class="gbs"><div class="gbh"><span class="gbn">2</span><b>Laporan Posyandu</b></div><p class="mu sm">Satu berkas gabungan Balita, Lansia, dan Poskesdes. Dipasang sesudah berkas pengajuan.</p><div data-gl="B"></div>' +
    '<label class="bt out sm gbadd">+ Tambah berkas<input type="file" multiple hidden accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" data-gf="B"></label></div>' +
    '<div class="gbt" data-gt></div>', 'Gabung dan unduh untuk SIPD', async function () {
    if (!G.A.length) throw new Error('Pilih dulu berkas pengajuan bertanda tangan (bagian 1).');
    if (!G.B.length) throw new Error('Pilih dulu laporan Posyandu (bagian 2).');
    var urut = G.A.concat(G.B), bad = urut.filter(function (x) { return x.err; });
    if (bad.length) throw new Error('Ada berkas yang tidak bisa dibaca: ' + bad[0].nama + '. Hapus dari daftar atau ganti.');
    var N = urut.reduce(function (a, x) { return a + x.hal; }, 0), dl = Dlg.sibuk('Menggabungkan PDF…', { lama: true }), t0 = Date.now(), selesaiHal = 0, jam = null;
    try {
      dl.persen(0, 'Menyiapkan berkas');
      var out = await L.PDFDocument.create();
      for (var i = 0; i < urut.length; i++) {
        var x = urut[i];
        if (x.doc) {
          var idx = x.doc.getPageIndices();
          for (var k = 0; k < idx.length; k += 10) {
            var pgs = await out.copyPages(x.doc, idx.slice(k, k + 10)); pgs.forEach(function (p) { out.addPage(p); });
            selesaiHal += pgs.length;
            var el = (Date.now() - t0) / 1000, sisa = el / selesaiHal * (N - selesaiHal) + el / selesaiHal * N * 0.25;
            dl.persen(selesaiHal / N * 85, 'Menyatukan halaman ' + selesaiHal + ' dari ' + N + (el > 2 ? ' · sekitar ' + detikTeks(sisa) + ' lagi' : ''));
            await tik();
          }
        } else {
          var img = x.jpg ? await out.embedJpg(x.bytes) : await out.embedPng(x.bytes), sk = Math.min(1, 595 / img.width), pg = out.addPage([img.width * sk, img.height * sk]);
          pg.drawImage(img, { x: 0, y: 0, width: img.width * sk, height: img.height * sk }); selesaiHal++;
          dl.persen(selesaiHal / N * 85, 'Menyatukan halaman ' + selesaiHal + ' dari ' + N); await tik();
        }
      }
      var tS = Date.now(), perk = Math.max(2000, (tS - t0) * 0.3);
      dl.persen(86, 'Menyimpan hasil, mohon tunggu');
      jam = setInterval(function () { var f = Math.min(0.97, (Date.now() - tS) / perk); dl.persen(86 + f * 12, 'Menyimpan hasil, mohon tunggu'); }, 300);
      await tik();
      var bytes = await out.save({ useObjectStreams: false }); clearInterval(jam); jam = null;
      dl.persen(100, 'Selesai'); await tik();
      var blob = new Blob([bytes], { type: 'application/pdf' }), a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = 'Berkas Pengajuan dan Laporan ' + H.per.label + '.pdf'; document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 8000);
      window.GABUNG_TERAKHIR = { hal: N, bytes: bytes.length, detik: (Date.now() - t0) / 1000 };
      G.A = []; G.B = [];
      setTimeout(function () { alert('Selesai. ' + N + ' halaman, ' + mbSize(bytes.length) + '. Berkas sudah diunduh.'); }, 600);
    } catch (er) {
      throw new Error('Penggabungan gagal: ' + (er && er.message || er) + '. Berkas asli Anda tidak berubah. Coba tutup tab lain lalu ulangi.');
    } finally { if (jam) clearInterval(jam); dl(); }
  });
  var tot = w.querySelector('[data-gt]'), okb = w.querySelector('[data-mx=ok]');
  function gambar() {
    ['A', 'B'].forEach(function (g) {
      w.querySelector('[data-gl=' + g + ']').innerHTML = G[g].map(function (x, i) {
        return '<div class="gbf' + (x.err ? ' bad' : '') + '"><span class="gnm" title="' + e(x.nama) + '">' + e(x.nama) + '</span><span class="gmt">' + (x.err ? e(x.err) : x.hal + ' hal · ' + mbSize(x.ukuran)) + '</span>' +
          (G[g].length > 1 ? '<button class="gib" type="button" data-gb="atas" data-g="' + g + '" data-i="' + i + '" aria-label="Naikkan"' + (i ? '' : ' disabled') + '>↑</button><button class="gib" type="button" data-gb="bawah" data-g="' + g + '" data-i="' + i + '" aria-label="Turunkan"' + (i < G[g].length - 1 ? '' : ' disabled') + '>↓</button>' : '') +
          '<button class="gib" type="button" data-gb="hapus" data-g="' + g + '" data-i="' + i + '" aria-label="Hapus">✕</button></div>';
      }).join('');
    });
    var semua = G.A.concat(G.B), ok = semua.filter(function (x) { return !x.err; }), hal = ok.reduce(function (a, x) { return a + x.hal; }, 0), byt = ok.reduce(function (a, x) { return a + x.ukuran; }, 0);
    tot.innerHTML = semua.length ? '<b>Perkiraan hasil: ' + hal + ' halaman · ' + mbSize(byt) + '</b>' + (byt > 314572800 ? '<div class="warnb">Berkas sangat besar (di atas 300 MB). Tutup tab lain dulu supaya komputer tidak kehabisan memori.</div>' : '') : '<span class="mu sm">Belum ada berkas dipilih.</span>';
    okb.disabled = !G.A.length || !G.B.length;
  }
  async function baca(g, files) {
    var dl = Dlg.sibuk('Membaca berkas…', { lama: true });
    try {
      for (var i = 0; i < files.length; i++) {
        var f = files[i], x = { id: ++uid, nama: f.name, ukuran: f.size, hal: 0 };
        dl.info((files.length > 1 ? 'Berkas ' + (i + 1) + ' dari ' + files.length + ': ' : '') + f.name); if (files.length > 1) dl.persen(i / files.length * 100);
        await tik();
        try {
          var isImg = /\.(jpe?g|png)$/i.test(f.name) || /^image\/(jpeg|png)$/.test(f.type);
          if (isImg) { x.bytes = new Uint8Array(await f.arrayBuffer()); x.jpg = /jpe?g/i.test(f.name) || f.type === 'image/jpeg'; x.hal = 1; }
          else { x.doc = await L.PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true, updateMetadata: false }); x.hal = x.doc.getPageCount(); }
        } catch (er) { x.err = 'Tidak bisa dibaca (rusak, terkunci, atau bukan PDF/JPG/PNG)'; x.doc = null; x.bytes = null; }
        G[g].push(x);
      }
    } finally { dl(); }
    gambar();
  }
  w.addEventListener('change', function (ev) { var i = ev.target.closest('[data-gf]'); if (!i || !i.files.length) return; var fs = Array.prototype.slice.call(i.files); i.value = ''; baca(i.dataset.gf, fs); });
  w.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-gb]'); if (!b) return; var g = b.dataset.g, i = +b.dataset.i, d = b.dataset.gb;
    if (d === 'hapus') G[g].splice(i, 1);
    else { var j = d === 'atas' ? i - 1 : i + 1; if (j < 0 || j >= G[g].length) return; var tmp = G[g][i]; G[g][i] = G[g][j]; G[g][j] = tmp; }
    gambar();
  });
  gambar();
}

/* ---------- menu bagian honor menempel di atas saat halaman digulir ---------- */
function tinggiAtas() {
  var a = document.querySelector('#v2 .tb'), b = document.querySelector('#v2 .htb'), el = a && a.offsetHeight ? a : (b && b.offsetHeight ? b : null);
  return el ? el.offsetHeight : 0;
}
function navTempel() { var n = document.querySelector('#v2 .hn .htabs'); return n && n.getBoundingClientRect().top <= tinggiAtas() + 1 && window.scrollY > 0 ? n : null; }
var TEMPEL_PASANG = false;
function tempelMenu() {
  var r = document.documentElement; r.style.setProperty('--hst', tinggiAtas() + 'px');
  if (!TEMPEL_PASANG) {
    TEMPEL_PASANG = true;
    var f = function () {
      var n = document.querySelector('#v2 .hn .htabs'); if (!n) return;
      document.documentElement.style.setProperty('--hst', tinggiAtas() + 'px');
      n.classList.toggle('st', !!navTempel());
    };
    window.addEventListener('scroll', f, { passive: true }); window.addEventListener('resize', f);
  }
  var n = document.querySelector('#v2 .hn .htabs'); if (n) n.classList.toggle('st', !!navTempel());
}
function keAwalBagian(dulu) {
  /* bila menu sedang menempel, setelah pindah bagian halaman kembali ke awal bagian itu (tepat di bawah menu) */
  if (!dulu) return;
  var n = document.querySelector('#v2 .hn .htabs'); if (!n) return;
  window.scrollTo(0, Math.max(0, n.getBoundingClientRect().top + window.scrollY - tinggiAtas())); tempelMenu();
}
/* ---------- klik ---------- */
function pasang(ct) {
  if (ct._hn) return; ct._hn = true;
  ct.addEventListener('click', async function (ev) {
    var t = ev.target.closest('[data-hx],[data-ht],[data-hj],[data-hper],[data-hubah],[data-hbayar],[data-hrek],[data-hlihat],[data-hpot],[data-hrf],[data-hbuka],[data-hhapus],[data-hperm]'); if (!t || !ct.contains(t)) return;
    var d = t.dataset; ev.preventDefault(); ev.stopPropagation();
    try {
      if (d.ht) { var tmp = !!navTempel(); H.tab = d.ht; H.view = ''; if (d.ht === 'rw') H.rw = null; gambar(); keAwalBagian(tmp); return; }
      if (d.hj) { H.jn = d.hj; return gambar(); }
      if (d.hrf) { H.rf = d.hrf; return gambar(); }
      if (d.hper) { H.view = ''; H.tab = 'r'; return muat(d.hper); }
      if (d.hubah) return mUbah(d.hubah);
      if (d.hbayar) return mBayar(d.hbayar);
      if (d.hrek) return mRek(d.hrek);
      if (d.hlihat) { H.lihat[d.hlihat] = !H.lihat[d.hlihat]; return gambar(); }
      if (d.hpot) return mPot(d.hpot);
      if (d.hbuka) return mBukaKunci(d.hbuka, d.label);
      if (d.hperm) return mHapusPerm(d.hperm, d.label);
      if (d.hhapus) { if ((await tanya('Hapus periode Honor ' + d.label + '? Hanya bisa sebelum daftar bayar ditandatangani.'))) kirim({ op: 'hapus', per: d.hhapus }, 'Periode dihapus.').then(function () { return muat(); }).catch(gagal); return; }
      var x = d.hx;
      if (x.indexOf('tab:') === 0) { H.tab = x.slice(4); return gambar(); }
      switch (x) {
        case 'muatulang': H.err = ''; return muat(H.per && H.per.id);
        case 'semua': H.view = 'semua'; return gambar();
        case 'tutupsemua': H.view = ''; return gambar();
        case 'baru': return mBaru();
        case 'atur': return mAtur();
        case 'tambah': return mTambah();
        case 'segarkan': if ((await tanya('Samakan daftar penerima dengan SK terbaru di Data Posyandu? Ubahan nominal yang sudah ada tetap dipakai.'))) kirim({ op: 'segarkan' }, 'Daftar disamakan dengan SK.').catch(gagal); return;
        case 'cetak': if ((await tanya(st().cetak ? 'Catat cetak ulang daftar bayar?' : 'Tandai daftar bayar sudah dicetak?'))) kirim({ op: 'langkah', l: 'cetak' }, 'Dicatat sudah dicetak.').catch(gagal); return;
        case 'ttd': return mTtd();
        case 'rekapok': if ((await tanya('Tandai rekap selesai? Total ' + rp(total().bruto) + '.'))) kirim({ op: 'langkah', l: 'rekap' }, 'Rekap selesai.').then(function () { H.tab = 'kw'; gambar(); }).catch(gagal); return;
        case 'kwok': var kw = kwDariForm(); if (!kw.tgl) { alert('Isi tanggal kwitansi'); return; } kirim({ op: 'langkah', l: 'kw', kw: kw }, 'Kwitansi disimpan.').then(function () { if (!st().berkas) { H.tab = 'bk'; gambar(); } }).catch(gagal); return;
        case 'berkasok': var cek = {}; Array.prototype.forEach.call(ct.querySelectorAll('[data-hcek]'), function (c) { cek[c.dataset.hcek] = c.checked; }); if (['kwitansi', 'rekap', 'daftar', 'sk'].some(function (k) { return !cek[k]; })) { alert('Centang keempat berkas dulu.'); return; } kirim({ op: 'langkah', l: 'berkas', cek: cek }, 'Berkas pengajuan lengkap.').catch(gagal); return;
        case 'setor': return mTgl('Tandai berkas sudah disetor ke DPPKAD?', '<p>Berkas pengajuan Honor ' + e(H.per.label) + ' (' + rp(total().bruto) + ') sudah Anda setor ke DPPKAD.</p>', 'Ya, sudah disetor', { op: 'langkah', l: 'setor' }, 'Dicatat sudah disetor.');
        case 'dana': return mDana();
        case 'potbaru': return mPot(null);
        case 'potok': if ((await tanya((H.per.potongan || []).length ? 'Tandai potongan selesai dicatat? Daftar transfer memakai potongan ini.' : 'Tidak ada potongan pada periode ini?'))) kirim({ op: 'langkah', l: 'pot' }, 'Potongan selesai.').then(function () { H.tab = 'tf'; gambar(); }).catch(gagal); return;
        case 'serah': return mTgl('Tandai daftar transfer sudah diserahkan ke bendahara?', '<p>Daftar transfer Honor ' + e(H.per.label) + ' sudah Anda bawa ke bendahara. Transfer dilakukan oleh bendahara.</p>', 'Ya, sudah diserahkan', { op: 'langkah', l: 'serah' }, 'Dicatat sudah diserahkan.');
        case 'selesai': if ((await tanya('Selesaikan dan kunci periode Honor ' + H.per.label + '? Data tidak bisa diubah lagi kecuali kuncinya dibuka.'))) kirim({ op: 'langkah', l: 'selesai' }, 'Periode selesai dan terkunci.').then(function () { H.tab = 'r'; gambar(); }).catch(gagal); return;
        case 'mundur': return mMundur();
        case 'ambilrek': if ((await tanya('Pakai rekening terbaru dari Rekening Kader untuk daftar transfer periode ini?'))) kirim({ op: 'ambilrek' }, 'Rekening diperbarui.').catch(gagal); return;
        case 'pdfdb': return unduhPdf('db', t);
        case 'pdfrk': return unduhPdf('rk', t);
        case 'pdfkw': return unduhPdf('kw', t);
        case 'pdftf': return unduhPdf('tf', t);
        case 'pdfberkas': return unduhPdf('berkas', t);
        case 'gabung': return mGabung();
        case 'xlsdb': return xlsDaftar();
        case 'xlsrk': return xlsRekap();
        case 'xlstf': return xlsTransfer();
        case 'xlsrek': return xlsRek();
        case 'xlsrw': return xlsRiwayat();
      }
    } catch (er) { alert(er.message); }
  });
  ct.addEventListener('change', function (ev) {
    var t = ev.target, d = t.dataset;
    if (d.hp !== undefined) { ev.stopPropagation(); H.tab = 'r'; return muat(t.value); }
    if (d.himpor !== undefined) { var f = t.files[0]; t.value = ''; if (f) imporRek(f); return; }
    if (d.hsk) { var f2 = t.files[0]; t.value = ''; if (!f2) return; var inf = { lastChild: document.createElement('span') }; toast('Mengunggah SK ' + d.hsk + '…'); Promise.resolve(PX.unggahSK(d.hsk, f2, inf)).then(function () { return muat(H.per && H.per.id); }); return; }
  });
  ct.addEventListener('input', function (ev) {
    var t = ev.target;
    if (t.id === 'hq') { H.q = t.value; clearTimeout(t._t); t._t = setTimeout(function () { gambar(); var q = $('hq'); if (q) { q.focus(); q.setSelectionRange(q.value.length, q.value.length); } }, 250); }
    if (t.id === 'hrq') { H.rq = t.value; clearTimeout(t._t); t._t = setTimeout(function () { gambar(); var q = $('hrq'); if (q) { q.focus(); q.setSelectionRange(q.value.length, q.value.length); } }, 250); }
  });
}

window.HONOR = { render: render, terbilang: terbilang, _H: H, buatPdf: buatPdf, pra: pra };
})();
