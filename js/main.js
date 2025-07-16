document.addEventListener("DOMContentLoaded", function () {
  // Sélection des éléments
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const closeBtn = document.getElementById("closeBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuContent = document.getElementById("mobileMenuContent");

  // Vérification que tous les éléments nécessaires sont présents
  if (!hamburgerBtn || !closeBtn || !mobileMenu || !mobileMenuContent) {
    console.error("Éléments du menu mobile non trouvés");
    return;
  }

  // État du menu
  let isMenuOpen = false;

  // Fonction pour ouvrir le menu
  function openMenu() {
    if (isMenuOpen) return;

    // Empêcher le défilement du body
    document.body.style.overflow = "hidden";

    // Afficher le menu
    mobileMenu.style.display = "block";

    // Forcer un reflow pour que l'animation fonctionne
    mobileMenu.offsetHeight;

    // Retirer les classes pour l'animation
    requestAnimationFrame(() => {
      mobileMenu.classList.remove("-translate-x-full");
      mobileMenuContent.classList.remove("-translate-x-full");
    });

    isMenuOpen = true;
    // Attacher les handlers à chaque ouverture
    const mobileNavBtns = mobileMenuContent.querySelectorAll("[data-tab]");
    mobileNavBtns.forEach((btn) => {
      btn.onclick = () => {
        closeMenu();
      };
    });
  }

  // Fonction pour fermer le menu
  function closeMenu() {
    if (!isMenuOpen) return;

    // Ajouter les classes pour l'animation
    mobileMenu.classList.add("-translate-x-full");
    mobileMenuContent.classList.add("-translate-x-full");

    // Attendre la fin de l'animation
    setTimeout(() => {
      mobileMenu.style.display = "none";
      // Réactiver le défilement du body
      document.body.style.overflow = "";
    }, 800);

    isMenuOpen = false;
  }

  // Gestionnaires d'événements
  hamburgerBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    openMenu();
  });

  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeMenu();
  });

  // Fermer le menu si on clique sur un lien
  const mobileLinks = mobileMenu.querySelectorAll("a");
  mobileLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.stopPropagation();
      closeMenu();
    });
  });

  // Fermer le menu si on clique en dehors
  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) {
      closeMenu();
    }
  });

  // Fermer le menu avec la touche Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isMenuOpen) {
      closeMenu();
    }
  });

  // Empêcher la propagation des clics dans le contenu du menu
  mobileMenuContent.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Gestion du formulaire d'inscription
  const inscriptionForm = document.getElementById("inscription-form");

  // Initialisation avec la nouvelle syntaxe
  (function () {
    emailjs.init("dd_LEw4vCllGurNy_");
  })();

  if (inscriptionForm) {
    // Gestionnaire pour le formulaire d'email
    inscriptionForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitBtn = document.getElementById("emailSubmitBtn");
      submitBtn.disabled = true;

      // Afficher le loading
      Swal.fire({
        title: "Envoi en cours...",
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
      });

      const formData = new FormData(inscriptionForm);
      const data = Object.fromEntries(formData.entries());

      const templateParams = {
        nom: data.nom,
        date_naissance: data.date_naissance,
        genre: data.genre,
        email: data.email,
        telephone: data.telephone,
        adresse: data.adresse,
        formation: data.formation,
        niveau_etude: data.niveau_etude,
        experience: data.experience,
        message: data.message,
      };

      try {
        console.log(
          "Tentative d'envoi d'email avec les paramètres:",
          templateParams
        );

        // Envoi par email
        const result = await emailjs.send(
          "service_9e17taa",
          "template_ocy34i8",
          templateParams
        );

        console.log("Résultat de l'envoi d'email:", result);

        if (result.status === 200) {
          await Swal.fire({
            icon: "success",
            title: "Inscription par email réussie!",
            text: "Votre inscription a été envoyée avec succès par email.",
            confirmButtonColor: "#0878c2",
          });
          inscriptionForm.reset();
        } else {
          throw new Error("L'envoi de l'email a échoué");
        }
      } catch (error) {
        console.error("Erreur détaillée lors de l'envoi:", error);
        await Swal.fire({
          icon: "error",
          title: "Erreur d'envoi email!",
          text: "Une erreur est survenue lors de l'envoi de l'inscription par email. Veuillez réessayer.",
          confirmButtonColor: "#0878c2",
        });
      } finally {
        submitBtn.disabled = false;
      }
    });

    // Gestionnaire pour le bouton WhatsApp
    const whatsappBtn = document.getElementById("whatsappBtn");
    if (whatsappBtn) {
      whatsappBtn.addEventListener("click", async function (e) {
        e.preventDefault();

        const submitBtn = this;
        submitBtn.disabled = true;

        const formData = new FormData(inscriptionForm);
        const data = Object.fromEntries(formData.entries());

        // Vérification du numéro de téléphone
        if (!data.telephone || data.telephone.length < 10) {
          await Swal.fire({
            icon: "error",
            title: "Erreur!",
            text: "Veuillez entrer un numéro de téléphone valide",
            confirmButtonColor: "#0878c2",
          });
          submitBtn.disabled = false;
          return;
        }

        // Construction du message WhatsApp
        const whatsappMessage = `
Bonjour, je souhaite m'inscrire à une formation :

Nom : ${data.nom}
Formation souhaitée : ${data.formation}
Téléphone : ${data.telephone}
Email : ${data.email}
Date de naissance : ${data.date_naissance}
Genre : ${data.genre}
Adresse : ${data.adresse}
Niveau d'étude : ${data.niveau_etude}
Expérience : ${data.experience}

${data.message ? `Message : ${data.message}` : ""}
        `;

        // Encodage du message pour l'URL
        const encodedMessage = encodeURIComponent(whatsappMessage.trim());

        // Numéro WhatsApp de l'entreprise
        const whatsappNumber = "243850102058";

        // Construction de l'URL WhatsApp
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        // Afficher le message de confirmation
        await Swal.fire({
          icon: "info",
          title: "Redirection vers WhatsApp",
          text: "Vous allez être redirigé vers WhatsApp pour envoyer votre inscription.",
          confirmButtonColor: "#0878c2",
        });

        // Redirection vers WhatsApp
        window.location.href = whatsappUrl;
        submitBtn.disabled = false;
      });
    }
  }

  // Gestion du formulaire de paiement hors forfait
  const horsforfaitForm = document.getElementById("horsforfait-paiement-form");
  const horsforfaitSuccess = document.getElementById(
    "horsforfait-paiement-success"
  );
  if (horsforfaitForm && horsforfaitSuccess) {
    horsforfaitForm.addEventListener("submit", function (e) {
      e.preventDefault();
      horsforfaitSuccess.classList.remove("hidden");
      setTimeout(() => {
        horsforfaitSuccess.classList.add("hidden");
        horsforfaitForm.reset();
      }, 2500);
    });
  }

  // Fermer le menu si on clique sur un lien ou un bouton de navigation dans le menu mobile
  const mobileNavBtns = mobileMenuContent.querySelectorAll("[data-tab]");
  mobileNavBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      closeMenu();
    });
  });
});

window.onscroll = function () {
  changeNavbarTheme();
};

function changeNavbarTheme() {
  const navBar = document.getElementById("navBar");
  if (window.scrollY > 200) {
    navBar.classList.remove("bg-transparent");
    navBar.classList.add("bg-blue-50", "shadow-lg");
  } else {
    navBar.classList.remove("bg-blue-50", "shadow-lg");
    navBar.classList.add("bg-transparent");
  }

  const menuBtn = document.getElementById("menuBtn");
  if (window.scrollY > 200) {
    menuBtn.classList.remove("text-white");
    menuBtn.classList.add("text-blue-600");
  } else {
    menuBtn.classList.remove("text-blue-600");
    menuBtn.classList.add("text-white");
  }

  const ctaBtn = document.getElementById("ctaBtn");
  if (window.scrollY > 200) {
    ctaBtn.classList.remove("bg-white", "text-blue-600");
    ctaBtn.classList.add("bg-btn", "text-white");
  } else {
    ctaBtn.classList.remove("bg-btn", "text-white");
    ctaBtn.classList.add("bg-white", "text-blue-600");
  }

  const items = document.querySelectorAll(".nav-item");
  if (window.scrollY > 200) {
    items.forEach((item) => {
      item.classList.remove("text-white");
      item.classList.add("text-blue-500");
    });
  } else {
    items.forEach((item) => {
      item.classList.remove("text-blue-500");
      item.classList.add("text-white");
    });
  }
}

// Navbar background change on scroll
window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 40) {
    navbar.classList.remove("bg-transparent");
    navbar.classList.add("bg-white");
  } else {
    navbar.classList.add("bg-transparent");
    navbar.classList.remove("bg-white");
  }
});

// Mobile menu open/close
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const closeMenu = document.getElementById("close-menu");
if (menuBtn && mobileMenu && closeMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.remove("hidden");
    mobileMenu.classList.add("animate-slide-down");
    mobileMenu.classList.remove("animate-slide-up");
  });
  closeMenu.addEventListener("click", () => {
    mobileMenu.classList.remove("animate-slide-down");
    mobileMenu.classList.add("animate-slide-up");
    setTimeout(() => {
      mobileMenu.classList.add("hidden");
      mobileMenu.classList.remove("animate-slide-up");
    }, 500);
  });
  // Fermer le menu mobile au clic sur un lien
  document.querySelectorAll("#mobile-menu .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("animate-slide-down");
      mobileMenu.classList.add("animate-slide-up");
      setTimeout(() => {
        mobileMenu.classList.add("hidden");
        mobileMenu.classList.remove("animate-slide-up");
      }, 500);
    });
  });
}
// Scroll smooth pour tous les liens nav-link
if (typeof window !== "undefined") {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 70,
            behavior: "smooth",
          });
        }
      }
    });
  });
}

// Ajout dynamique de l'année dans le footer
const yearSpan = document.getElementById("footer-year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Inversion dynamique des couleurs des liens de la navbar desktop
function updateNavbarLinkColors() {
  const navbar = document.getElementById("navbar");
  const links = document.querySelectorAll(".nav-desktop-link");
  if (!navbar || !links.length) return;
  if (navbar.classList.contains("bg-white")) {
    links.forEach((link) => {
      link.classList.remove("text-white", "hover:text-blue-600");
      link.classList.add("text-blue-700", "hover:text-blue-400");
    });
  } else {
    links.forEach((link) => {
      link.classList.remove("text-blue-700", "hover:text-white");
      link.classList.add("text-white", "hover:text-blue-600");
    });
  }
}
window.addEventListener("scroll", function () {
  updateNavbarLinkColors();
});
document.addEventListener("DOMContentLoaded", function () {
  updateNavbarLinkColors();
});
