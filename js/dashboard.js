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
  if (tab === "accueil") tabAccueilStatus.classList.remove("hidden");
  else tabAccueilStatus.classList.add("hidden");
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
  const year = document.getElementById("filter-year").value;
  const month = document.getElementById("filter-month").value;
  const day = document.getElementById("filter-day").value;
  let filtered = paiements;
  if (year) filtered = filtered.filter((p) => p.date.startsWith(year));
  if (month) filtered = filtered.filter((p) => p.date.slice(5, 7) === month);
  if (day)
    filtered = filtered.filter(
      (p) => p.date.slice(8, 10) === day.padStart(2, "0")
    );
  const tbody = document.getElementById("paiement-table-body");
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
document.getElementById("filter-month").addEventListener("change", function () {
  const month = this.value;
  const year =
    document.getElementById("filter-year").value || new Date().getFullYear();
  const daySelect = document.getElementById("filter-day");
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
document.getElementById("filter-year").addEventListener("change", function () {
  document.getElementById("filter-month").dispatchEvent(new Event("change"));
  updatePaiementTable();
});
document
  .getElementById("filter-day")
  .addEventListener("change", updatePaiementTable);
updatePaiementTable();
