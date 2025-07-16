// Onglets dynamiques synchronisés sidebar/nav
const tabButtons = document.querySelectorAll("[data-tab]:not(.sidebar-btn)");
const sidebarBtns = document.querySelectorAll(".sidebar-btn");
const tabContents = document.querySelectorAll(".tab-content");
const tabAccueilStatus = document.getElementById("tab-accueil-status");
function showTab(tab) {
  tabContents.forEach((c) => c.classList.add("hidden"));
  tabButtons.forEach((b) => b.classList.remove("tab-active"));
  sidebarBtns.forEach((b) => b.classList.remove("active"));
  document.getElementById("tab-" + tab).classList.remove("hidden");
  document
    .getElementById("tab-" + tab)
    .scrollIntoView({ behavior: "smooth", block: "start" });
  // Activer le bouton nav du haut
  const navBtn = document.querySelector(
    '[data-tab="' + tab + '"]:not(.sidebar-btn)'
  );
  if (navBtn) navBtn.classList.add("tab-active");
  // Activer le bouton sidebar
  const sideBtn = document.querySelector(
    '.sidebar-btn[data-tab="' + tab + '"]'
  );
  if (sideBtn) sideBtn.classList.add("active");
  // Statut financier (barre) n'est visible que sur Accueil
  if (tab === "accueil") tabAccueilStatus?.classList.remove("hidden");
  else tabAccueilStatus?.classList.add("hidden");
}
// Nav du haut
tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => showTab(btn.getAttribute("data-tab")));
});
// Sidebar
sidebarBtns.forEach((btn) => {
  btn.addEventListener("click", () => showTab(btn.getAttribute("data-tab")));
});
// Afficher Accueil par défaut
showTab("accueil");

// Paiements fictifs pour la démo
const paiements = [
  {
    date: "2024-03-10",
    montant: 2000,
    mode: "Mobile Money",
    duree: "Journalier",
    statut: "Validé",
  },
  {
    date: "2024-03-09",
    montant: 6000,
    mode: "Banque",
    duree: "Mensuel",
    statut: "Validé",
  },
  {
    date: "2024-02-15",
    montant: 2000,
    mode: "Mobile Money",
    duree: "Journalier",
    statut: "Validé",
  },
  {
    date: "2023-12-01",
    montant: 6000,
    mode: "Banque",
    duree: "Mensuel",
    statut: "Validé",
  },
  {
    date: "2023-12-01",
    montant: 2000,
    mode: "Mobile Money",
    duree: "Journalier",
    statut: "Validé",
  },
];
function updatePaiementTable() {
  const year = document.getElementById("filter-year")?.value;
  const month = document.getElementById("filter-month")?.value;
  const day = document.getElementById("filter-day")?.value;
  let filtered = paiements;
  if (year) filtered = filtered.filter((p) => p.date.startsWith(year));
  if (month) filtered = filtered.filter((p) => p.date.slice(5, 7) === month);
  if (day)
    filtered = filtered.filter(
      (p) => p.date.slice(8, 10) === day.padStart(2, "0")
    );
  const tbody = document.getElementById("paiement-table-body");
  if (!tbody) return;
  tbody.innerHTML =
    filtered
      .map(
        (p) => `
      <tr>
        <td>${p.date.split("-").reverse().join("/")}</td>
        <td class="font-bold text-green-700">${p.montant.toLocaleString()} FC</td>
        <td>${p.mode}</td>
        <td>${p.duree}</td>
        <td><span class="bg-green-100 text-green-700 px-2 py-1 rounded">${
          p.statut
        }</span></td>
      </tr>
    `
      )
      .join("") ||
    '<tr><td colspan="5" class="text-center text-gray-400">Aucun paiement trouvé</td></tr>';
}
// Remplir les jours dynamiquement selon le mois sélectionné
const filterMonth = document.getElementById("filter-month");
if (filterMonth) {
  filterMonth.addEventListener("change", function () {
    const month = this.value;
    const year =
      document.getElementById("filter-year")?.value || new Date().getFullYear();
    const daySelect = document.getElementById("filter-day");
    if (!daySelect) return;
    daySelect.innerHTML = '<option value="">Jour</option>';
    if (month) {
      const days = new Date(year, month, 0).getDate();
      for (let d = 1; d <= days; d++) {
        daySelect.innerHTML += `<option value="${d
          .toString()
          .padStart(2, "0")}">${d}</option>`;
      }
    }
    updatePaiementTable();
  });
}
const filterYear = document.getElementById("filter-year");
if (filterYear) {
  filterYear.addEventListener("change", function () {
    document.getElementById("filter-month")?.dispatchEvent(new Event("change"));
    updatePaiementTable();
  });
}
const filterDay = document.getElementById("filter-day");
if (filterDay) {
  filterDay.addEventListener("change", updatePaiementTable);
}
updatePaiementTable();

// === HÔPITAUX PARTENAIRES : cards dynamiques ===
const hopitaux = [
  {
    nom: "Hôpital du Cinquantenaire",
    adresse: "Avenue des Hôpitaux, Kinshasa",
    contact: "+243 123 456 789",
    specialites: "Urgences, Pédiatrie, Chirurgie",
    image: "images/Hopital Cinquantenaire.jpeg",
  },
  {
    nom: "Clinique Ngaliema",
    adresse: "Boulevard du 30 Juin, Kinshasa",
    contact: "+243 987 654 321",
    specialites: "Cardiologie, Gynécologie, Imagerie",
    image: "images/medecinfemme.jpg",
  },
  {
    nom: "Centre Médical Diamant",
    adresse: "Avenue Diamant, Gombe",
    contact: "+243 555 666 777",
    specialites: "Médecine générale, Laboratoire",
    image: "images/consultation.jpg",
  },
  // ... Ajoute d'autres hôpitaux ici
];

function renderHopitauxCards() {
  const container = document.getElementById("hopitaux-list");
  if (!container) return;
  container.innerHTML = hopitaux
    .map(
      (h) => `
    <div class="bg-white rounded-xl shadow flex flex-col items-center gap-1 border border-cyan-100 hover:shadow-lg transition-shadow duration-300 w-full h-full p-[4vw] min-w-0" style="max-width:100%; min-width:0; box-sizing:border-box;">
      <div class="w-[20vw] h-[20vw] max-w-[80px] max-h-[80px] mb-1 rounded-full overflow-hidden border-2 border-cyan-200 shadow">
        <img src="${h.image}" alt="Logo ${h.nom}" class="object-cover w-full h-full" />
      </div>
      <h3 class="text-base font-bold text-cyan-800 text-center w-full break-words">${h.nom}</h3>
      <p class="text-xs text-gray-600 text-center w-full break-words">${h.adresse}</p>
      <p class="text-xs text-gray-500 text-center w-full break-words">${h.contact}</p>
      <p class="text-xs text-cyan-600 text-center w-full break-words">Spécialités : ${h.specialites}</p>
      <button class="mt-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full px-3 py-1 text-xs shadow hover:scale-105 transition-transform w-full">Voir plus</button>
    </div>
  `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", renderHopitauxCards);
