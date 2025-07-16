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
      mobileMenu.classList.remove("translate-x-full");
      mobileMenuContent.classList.remove("translate-x-full");
    });

    isMenuOpen = true;
  }

  // Fonction pour fermer le menu
  function closeMenu() {
    if (!isMenuOpen) return;

    // Ajouter les classes pour l'animation
    mobileMenu.classList.add("translate-x-full");
    mobileMenuContent.classList.add("translate-x-full");

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
