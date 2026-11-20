const $ = (selector) => document.querySelector(selector);

const quotes = [
  "Sanar no significa que el dolor nunca haya existido, sino que ya no tiene el control de tu vida. Dar el primer paso hacia la terapia es regalarte la oportunidad de reencontrar tu paz y transformar lo que duele en fortaleza.",
  "No tienes que cargar con todo a solas. Venir a terapia es un acto de valentía y un espacio seguro donde tus emociones son escuchadas, comprendidas y sanadas paso a paso.",
  "El bienestar emocional no es un lujo, es una necesidad. Permítete sanar las heridas del pasado para construir un presente con mayor calma, claridad y esperanza.",
  "Todo gran cambio interior comienza con la decisión de ser escuchado sin juicios. Aquí encontrarás el acompañamiento profesional que necesitas para sanar desde la raíz y recuperar tu bienestar."
];

let q = 0;
let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
let timer;
const quote = $('#quoteText');
const count = $('#quoteCount');

function showQuote(index) {
  q = (index + quotes.length) % quotes.length;
  quote.style.opacity = 0;
  setTimeout(() => {
    quote.textContent = '“' + quotes[q] + '”';
    count.innerHTML = quotes.map((_, i) => '<i data-on="' + (i === q ? '1' : '0') + '"></i>').join('');
    quote.style.opacity = 1;
  }, 250);
}

function loop() {
  clearInterval(timer);
  if (!paused) timer = setInterval(() => showQuote(q + 1), 10000);
}

showQuote(0);
loop();
$('#nextQuote').onclick = () => { showQuote(q + 1); loop(); };
$('#prevQuote').onclick = () => { showQuote(q - 1); loop(); };
$('#pauseQuotes').onclick = (event) => {
  paused = !paused;
  event.target.textContent = paused ? 'Reanudar' : 'Pausar';
  loop();
};

const audio = $('#ambientMusic');
const sound = $('#soundToggle');
audio.volume = .25;
function setSound(on) {
  if (on) {
    audio.play().then(() => {
      sound.querySelector('span').textContent = 'Apagar sonido';
      sound.setAttribute('aria-pressed', 'true');
    }).catch(() => sound.querySelector('span').textContent = 'Activar sonido');
  } else {
    audio.pause();
    sound.querySelector('span').textContent = 'Activar sonido';
    sound.setAttribute('aria-pressed', 'false');
  }
}
sound.onclick = () => setSound(audio.paused);
setSound(true);

const services = {
  'Terapia psicológica': {
    title: 'Terapia Psicológica',
    what: 'Espacio de acompañamiento clínico enfocado en comprender, procesar y superar dificultades emocionales, conductuales o relacionales mediante herramientas basadas en la evidencia.',
    mission: 'Brindar un soporte profesional y seguro para sanar heridas emocionales, reducir el malestar y promover herramientas prácticas que mejoren la estabilidad mental y la calidad de vida.'
  },
  'Terapia holística': {
    title: 'Terapia Holística',
    what: 'Enfoque integrador que contempla a la persona en todas sus dimensiones —cuerpo, mente, emoción y energía— para restablecer el equilibrio interno y el bienestar global.',
    mission: 'Armonizar los distintos planos del ser humano a través de técnicas complementarias, liberando bloqueos profundos y facilitando una reconexión genuina con la paz interior.'
  },
  'Gestión emocional': {
    title: 'Gestión Emocional',
    what: 'Proceso de autoconocimiento y entrenamiento para identificar, comprender y canalizar de forma saludable las emociones cotidianas sin reprimirlas ni desbordarse.',
    mission: 'Dotar a la persona de recursos de inteligencia emocional para afrontar el estrés, los cambios y los retos diarios con mayor resiliencia, claridad y equilibrio.'
  },
  'Crecimiento personal': {
    title: 'Crecimiento Personal',
    what: 'Camino de desarrollo interior orientado a potenciar fortalezas, redefinir metas vitales y trascender limitaciones para alcanzar el máximo potencial humano.',
    mission: 'Guiar y empoderar a cada individuo en su proceso de autodescubrimiento y evolución continua, impulsando una vida con mayor propósito, autonomía y plenitud.'
  }
};

const serviceDialog = $('#serviceDialog');
let activeServiceButton = null;
document.querySelectorAll('[data-service]').forEach((button) => {
  button.setAttribute('aria-haspopup', 'dialog');
  button.setAttribute('aria-controls', 'serviceDialog');
  button.setAttribute('aria-expanded', 'false');
  button.onclick = () => {
    const content = services[button.dataset.service];
    if (!content) return;
    if (activeServiceButton) activeServiceButton.setAttribute('aria-expanded', 'false');
    activeServiceButton = button;
    button.setAttribute('aria-expanded', 'true');
    $('#serviceTitle').textContent = content.title;
    $('#serviceWhat').textContent = content.what;
    $('#serviceMission').textContent = content.mission;
    serviceDialog.showModal();
  };
});

function closeServiceDialog() {
  if (!serviceDialog.open || serviceDialog.classList.contains('is-closing')) return;
  serviceDialog.classList.add('is-closing');
  setTimeout(() => {
    serviceDialog.close();
    serviceDialog.classList.remove('is-closing');
  }, 240);
}

serviceDialog.addEventListener('close', () => {
  if (activeServiceButton) {
    activeServiceButton.setAttribute('aria-expanded', 'false');
    activeServiceButton.focus();
    activeServiceButton = null;
  }
});
serviceDialog.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeServiceDialog();
});
serviceDialog.addEventListener('click', (event) => {
  if (event.target === serviceDialog) closeServiceDialog();
});

const experienceDialog = $('#experienceDialog');
$('#experienceOpen').onclick = () => experienceDialog.showModal();
document.querySelectorAll('.close').forEach((button) => {
  button.onclick = () => {
    const dialog = button.closest('dialog');
    if (dialog === serviceDialog) closeServiceDialog();
    else dialog.close();
  };
});
$('#experienceForm').onsubmit = (event) => {
  event.preventDefault();
  $('#formMessage').textContent = 'Gracias por compartir tu experiencia. Será revisada antes de cualquier publicación.';
  event.target.reset();
};
$('.menu-toggle').onclick = (event) => {
  const nav = $('#main-nav');
  nav.classList.toggle('open');
  event.currentTarget.setAttribute('aria-expanded', nav.classList.contains('open'));
};
$('#year').textContent = new Date().getFullYear();