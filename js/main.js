/* =============================================================================
   Yamina Nardin — comportements d'interface

   Sans dépendance, sans traceur, sans cookie. Trois modules seulement.
   Le site est entièrement consultable si ce fichier ne se charge pas.
   ========================================================================== */
(function () {
  'use strict';

  var COUPURE = '(min-width: 940px)';   // doit rester aligné sur style.css

  /* --- Tiroir de navigation (petits écrans) ---------------------------- */
  function tiroir() {
    var bouton = document.querySelector('[data-ouvrir]');
    var panneau = document.getElementById('tiroir');
    if (!bouton || !panneau) return;

    var precedent = null;

    function ouvrir() {
      precedent = document.activeElement;
      panneau.classList.add('est-ouvert');
      bouton.setAttribute('aria-expanded', 'true');
      document.body.classList.add('est-bloque');
      // Le panneau part de visibility:hidden : on attend le recalcul de
      // style, sinon le focus est refusé.
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          var premier = panneau.querySelector('a[href]');
          if (premier) premier.focus();
        });
      });
    }

    function fermer(rendreFocus) {
      panneau.classList.remove('est-ouvert');
      bouton.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('est-bloque');
      if (rendreFocus && precedent) precedent.focus();
    }

    bouton.addEventListener('click', function () {
      if (bouton.getAttribute('aria-expanded') === 'true') fermer(true);
      else ouvrir();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panneau.classList.contains('est-ouvert')) fermer(true);
    });

    panneau.addEventListener('click', function (e) {
      if (e.target.closest('a')) fermer(false);
    });

    var large = window.matchMedia(COUPURE);
    var surChangement = function (e) { if (e.matches) fermer(false); };
    if (large.addEventListener) large.addEventListener('change', surChangement);
    else if (large.addListener) large.addListener(surChangement);

    // Le panneau couvre l'écran : la tabulation y reste enfermée.
    panneau.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var cibles = panneau.querySelectorAll('a[href], button:not([disabled])');
      if (!cibles.length) return;
      var premier = cibles[0];
      var dernier = cibles[cibles.length - 1];
      if (e.shiftKey && document.activeElement === premier) {
        e.preventDefault(); dernier.focus();
      } else if (!e.shiftKey && document.activeElement === dernier) {
        e.preventDefault(); premier.focus();
      }
    });
  }

  /* --- Filet de l'en-tête au défilement -------------------------------- */
  function entete() {
    var el = document.querySelector('[data-entete]');
    if (!el) return;
    var attente = false;
    function maj() {
      el.classList.toggle('est-defile', window.scrollY > 8);
      attente = false;
    }
    window.addEventListener('scroll', function () {
      if (!attente) { window.requestAnimationFrame(maj); attente = true; }
    }, { passive: true });
    maj();
  }

  /* --- Apparition : un fondu de huit pixels, une seule fois ------------ */
  function pose() {
    var blocs = document.querySelectorAll('.pose');
    if (!blocs.length) return;

    var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduit || !('IntersectionObserver' in window)) {
      for (var i = 0; i < blocs.length; i++) blocs[i].classList.add('est-vu');
      return;
    }

    var oeil = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('est-vu');
          oeil.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });

    blocs.forEach(function (b) { oeil.observe(b); });
  }

  /* --- Formulaire de contact ------------------------------------------- */
  /* Validation côté client seulement : messages lisibles, annoncés aux
     lecteurs d'écran. Aucune donnée n'est envoyée ailleurs que vers
     l'action déclarée dans le HTML.                                       */
  function formulaire() {
    var form = document.querySelector('[data-form]');
    if (!form) return;
    var etat = form.querySelector('[data-etat]');

    function signaler(champ, message) {
      var bloc = champ.closest('.champ');
      if (!bloc) return;
      var slot = bloc.querySelector('.err');
      if (!slot) return;
      slot.textContent = message || '';
      champ.setAttribute('aria-invalid', message ? 'true' : 'false');
    }

    function verifier() {
      var ok = true;
      var premierDefaut = null;

      form.querySelectorAll('[required]').forEach(function (champ) {
        var valeur = (champ.value || '').trim();
        var message = '';

        if (champ.type === 'checkbox') {
          if (!champ.checked) message = 'Merci de cocher cette case pour envoyer votre message.';
        } else if (!valeur) {
          message = 'Ce champ m’est nécessaire pour vous répondre.';
        } else if (champ.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valeur)) {
          message = 'Cette adresse semble incomplète.';
        }

        signaler(champ, message);
        if (message) { ok = false; if (!premierDefaut) premierDefaut = champ; }
      });

      if (!ok && premierDefaut) premierDefaut.focus();
      return ok;
    }

    form.addEventListener('submit', function (e) {
      if (!verifier()) {
        e.preventDefault();
        if (etat) etat.textContent = 'Votre message n’a pas été envoyé : un champ reste à compléter.';
      }
    });

    form.addEventListener('input', function (e) {
      if (e.target.getAttribute('aria-invalid') === 'true') signaler(e.target, '');
    });
  }

  function demarrer() {
    document.documentElement.classList.remove('no-js');
    tiroir();
    entete();
    pose();
    formulaire();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', demarrer);
  } else {
    demarrer();
  }
})();
