/* Gaya tampilan Pantau: pilihan disimpan di server per akun, salinan di perangkat agar tidak berkedip. */
(function () {
  var GAYA = [
    { id: 'klasik', nm: 'Klasik', ket: 'Tampilan yang sekarang dipakai.', ada: true },
    { id: 'baru', nm: 'Tampilan baru', ket: 'Panel kemajuan besar, kolom Digital dan Fisik terpisah.', ada: true },
    { id: 'ceria', nm: 'Gaya ceria', ket: 'Krem hangat dengan satu aksen emas.', ada: true },
    { id: 'ios', nm: 'iPhone (dua kaca)', ket: 'Bersih ala iPhone, bilah bawah dan pil bulan berkaca.', ada: true },
    { id: 'kaca', nm: 'iPhone (kaca penuh)', ket: 'Seluruh kartu berkaca di atas foto buram.', ada: true }
  ];
  function sah(id) { return GAYA.some(function (g) { return g.id === id && g.ada; }); }
  function lokal() { var v = ''; try { v = localStorage.getItem('pantau-gaya') || ''; } catch (x) { } return sah(v) ? v : 'klasik'; }
  function pasang(id) {
    if (!sah(id)) id = 'klasik';
    document.documentElement.setAttribute('data-gaya', id);
    try { localStorage.setItem('pantau-gaya', id); } catch (x) { }
  }
  window.GAYA_DAFTAR = GAYA;
  window.gayaAktif = function () { return document.documentElement.getAttribute('data-gaya') || lokal(); };
  window.setGaya = function (id) {
    if (!sah(id)) return;
    pasang(id);
    try { if (window.kirimAtur) kirimAtur({ gaya: id }, { latar: true }); } catch (x) { }
  };
  /* dipanggil setelah profil dari server diterima; '' berarti akun ini belum pernah memilih */
  window.terimaGaya = function (r) {
    if (!r || r.gaya === undefined) return;
    var baru = r.gaya && sah(r.gaya) ? r.gaya : (r.gaya ? 'klasik' : lokal());
    if (baru !== window.gayaAktif()) { pasang(baru); if (window.render) try { render(); } catch (x) { } } else pasang(baru);
  };
  window.kartuGaya = function () {
    var cur = window.gayaAktif();
    return '<section class="cd form"><h2>Gaya tampilan</h2><p class="mu sm">Pilih satu. Pilihan ini tersimpan di akun Anda dan ikut ke perangkat lain.</p><div class="gyl">' +
      GAYA.map(function (g) {
        return '<button type="button" class="gyb' + (g.id === cur ? ' on' : '') + '"' + (g.ada ? ' data-gaya="' + g.id + '" aria-pressed="' + (g.id === cur) + '"' : ' disabled') + '>' +
          '<b>' + g.nm + '</b><span>' + g.ket + '</span>' + (g.ada ? '' : '<em>Segera hadir</em>') + '</button>';
      }).join('') + '</div></section>';
  };
  pasang(lokal());
})();
