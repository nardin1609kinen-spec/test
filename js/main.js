/* =============================================================================
   YAMINA NARDIN — comportements de l'interface
   Aucune dépendance, aucun traceur. Le site reste entièrement utilisable
   si ce fichier ne se charge pas : le HTML et le CSS suffisent.
   ============================================================================= */
(function () {
  "use strict";

  var doc = document;
  var racine = doc.documentElement;

  /* Le CSS n'affiche les apparitions que si JavaScript répond présent. */
  racine.classList.remove("no-js");

  var mouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------------------------------------------------------------------------
     1. En-tête : il se pose sur le papier dès que la page défile.
     --------------------------------------------------------------------------- */
  (function entete() {
    var barre = doc.querySelector("[data-entete]");
    if (!barre) return;

    var pose = false;
    var enAttente = false;

    function majuscule() {
      var doitPoser = window.scrollY > 12;
      if (doitPoser !== pose) {
        pose = doitPoser;
        barre.classList.toggle("entete--pose", pose);
      }
      enAttente = false;
    }

    function auDefilement() {
      if (enAttente) return;
      enAttente = true;
      window.requestAnimationFrame(majuscule);
    }

    majuscule();
    window.addEventListener("scroll", auDefilement, { passive: true });
  })();

  /* ---------------------------------------------------------------------------
     2. Tiroir mobile : une page à part entière, pas un menu rétréci.
        Piège de tabulation, fermeture par Échap, retour du focus au bouton.
     --------------------------------------------------------------------------- */
  (function tiroir() {
    var bouton = doc.querySelector("[data-ouvrir]");
    var panneau = doc.getElementById("tiroir");
    if (!bouton || !panneau) return;

    var ouvert = false;
    var focusables = 'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])';

    function basculer(vers) {
      ouvert = vers;
      panneau.classList.toggle("tiroir--ouvert", ouvert);
      doc.body.classList.toggle("fige", ouvert);
      bouton.setAttribute("aria-expanded", String(ouvert));
      bouton.querySelector(".vh").textContent = ouvert ? "Fermer le menu" : "Ouvrir le menu";
      panneau.setAttribute("aria-hidden", String(!ouvert));

      if (ouvert) {
        /* Le tiroir sort de `visibility: hidden` : tant que le style n'a pas
           été recalculé, rien n'y est focusable. On attend donc la trame
           suivante avant d'y porter le focus. */
        window.requestAnimationFrame(function () {
          var premier = panneau.querySelector(focusables);
          if (premier) premier.focus();
        });
      } else {
        bouton.focus();
      }
    }

    bouton.addEventListener("click", function () { basculer(!ouvert); });

    /* Toute navigation depuis le tiroir le referme. */
    panneau.addEventListener("click", function (e) {
      if (e.target.closest("a")) basculer(false);
    });

    doc.addEventListener("keydown", function (e) {
      if (!ouvert) return;

      if (e.key === "Escape") { basculer(false); return; }

      if (e.key === "Tab") {
        var liste = Array.prototype.filter.call(
          panneau.querySelectorAll(focusables),
          function (el) { return el.offsetParent !== null; }
        );
        if (!liste.length) return;

        var premier = liste[0];
        var dernier = liste[liste.length - 1];

        if (e.shiftKey && doc.activeElement === premier) {
          e.preventDefault(); dernier.focus();
        } else if (!e.shiftKey && doc.activeElement === dernier) {
          e.preventDefault(); premier.focus();
        }
      }
    });

    /* En repassant au-dessus du seuil mobile, le tiroir n'a plus lieu d'être. */
    var large = window.matchMedia("(min-width: 55.01em)");
    var surChangement = function (e) { if (e.matches && ouvert) basculer(false); };
    if (large.addEventListener) large.addEventListener("change", surChangement);
    else if (large.addListener) large.addListener(surChangement);
  })();

  /* ---------------------------------------------------------------------------
     3. Apparitions au défilement.
        Si l'API manque ou si le mouvement est réduit, tout est simplement
        visible : aucun contenu ne dépend de l'animation pour exister.
     --------------------------------------------------------------------------- */
  (function apparitions() {
    /* Signale au filet de sécurité posé dans le <head> que ce script tourne. */
    racine.setAttribute("data-anime", "1");

    var cibles = doc.querySelectorAll(".rev");
    if (!cibles.length) return;

    function toutMontrer() {
      Array.prototype.forEach.call(cibles, function (el) { el.classList.add("rev--vu"); });
    }

    if (mouvementReduit.matches || !("IntersectionObserver" in window)) {
      toutMontrer();
      return;
    }

    var observateur = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        if (!entree.isIntersecting) return;
        entree.target.classList.add("rev--vu");
        observateur.unobserve(entree.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });

    Array.prototype.forEach.call(cibles, function (el) { observateur.observe(el); });

    /* Si le visiteur active le mouvement réduit en cours de route. */
    var surChangement = function (e) { if (e.matches) { observateur.disconnect(); toutMontrer(); } };
    if (mouvementReduit.addEventListener) mouvementReduit.addEventListener("change", surChangement);
    else if (mouvementReduit.addListener) mouvementReduit.addListener(surChangement);
  })();

  /* ---------------------------------------------------------------------------
     4. Formulaire de rendez-vous.
        Validation en français, annoncée aux lecteurs d'écran. Tant que
        l'attribut `action` n'a pas été renseigné par l'hébergeur, le
        formulaire ne prétend pas envoyer : il renvoie vers le téléphone.
     --------------------------------------------------------------------------- */
  (function formulaire() {
    var form = doc.querySelector("[data-form]");
    if (!form) return;

    var etat = form.querySelector("[data-etat]");
    var relie = (form.getAttribute("action") || "").trim() !== "";

    function messageErreur(champ) {
      var v = champ.validity;
      if (v.valueMissing) {
        if (champ.type === "checkbox") return "Merci de cocher cette case pour envoyer votre message.";
        return "Ce champ est nécessaire pour vous répondre.";
      }
      if (v.typeMismatch && champ.type === "email") return "Cette adresse e-mail semble incomplète.";
      return "Merci de vérifier cette information.";
    }

    function verifier(champ) {
      var bloc = champ.closest(".champ");
      if (!bloc) return champ.checkValidity();

      var sortie = bloc.querySelector(".err");
      var valide = champ.checkValidity();

      bloc.classList.toggle("champ--erreur", !valide);
      champ.setAttribute("aria-invalid", valide ? "false" : "true");
      if (sortie) sortie.textContent = valide ? "" : messageErreur(champ);

      return valide;
    }

    var champs = form.querySelectorAll("input, textarea");

    Array.prototype.forEach.call(champs, function (champ) {
      champ.addEventListener("blur", function () { verifier(champ); });
      champ.addEventListener("input", function () {
        if (champ.closest(".champ") && champ.closest(".champ").classList.contains("champ--erreur")) {
          verifier(champ);
        }
      });
    });

    form.addEventListener("submit", function (e) {
      var premierFautif = null;

      Array.prototype.forEach.call(champs, function (champ) {
        if (!verifier(champ) && !premierFautif) premierFautif = champ;
      });

      if (premierFautif) {
        e.preventDefault();
        if (etat) {
          etat.className = "etat etat--ko";
          etat.textContent = "Le message n’a pas été envoyé : merci de compléter les champs signalés.";
        }
        premierFautif.focus();
        return;
      }

      if (!relie) {
        e.preventDefault();
        if (etat) {
          etat.className = "etat etat--ko";
          etat.textContent =
            "L’envoi par formulaire n’est pas encore activé sur ce site. " +
            "Vous pouvez appeler le 07 88 69 71 51 et laisser un message : votre appel sera rappelé.";
        }
      }
    });
  })();
})();
