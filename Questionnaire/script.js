console.log("JS chargé !");

function showQuestion(id) {
  document.querySelectorAll('.question').forEach(q => q.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}