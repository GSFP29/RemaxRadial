// Aplica o tema guardado antes da primeira pintura, para não haver flash
// de claro→escuro. Não é dado de negócio — só preferência de UI — por
// isso localStorage está bem aqui (ver CLAUDE.md secção 12).
const SCRIPT = `
(function () {
  try {
    var tema = localStorage.getItem("radial-tema");
    if (tema === "dark") {
      document.documentElement.dataset.theme = "dark";
    }
  } catch (e) {}
})();
`;

export function TemaScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
