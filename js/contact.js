document.addEventListener("DOMContentLoaded", function () {
  // Initialisation avec votre clé publique
  emailjs.init("dd_LEw4vCllGurNy_");

  const form = document.getElementById("contact-form");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;

      // Récupération du texte complet du sujet sélectionné
      const select = form.querySelector('select[name="subject"]');
      const selectedOption = select.options[select.selectedIndex];
      const subjectText = selectedOption.text;

      const templateParams = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        subject: subjectText, // Utilisation du texte complet
        message: form.message.value,
      };

      try {
        // Loading alert
        Swal.fire({
          title: "Envoi en cours...",
          didOpen: () => {
            Swal.showLoading();
          },
          allowOutsideClick: false,
        });

        await emailjs.send(
          "service_9e17taa",
          "template_owa4gn8",
          templateParams
        );

        await Swal.fire({
          icon: "success",
          title: "Message envoyé!",
          text: `Votre ${subjectText.toLowerCase()} a été envoyée avec succès.`,
          confirmButtonColor: "#0878c2",
        });

        form.reset();
      } catch (error) {
        console.error("Erreur:", error);
        await Swal.fire({
          icon: "error",
          title: "Erreur!",
          text: "Une erreur est survenue lors de l'envoi du message.",
          confirmButtonColor: "#0878c2",
        });
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
});
