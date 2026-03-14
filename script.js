// --- CONFIG FIREBASE (NÃO MEXER) ---
const firebaseConfig = {
    apiKey: "AIzaSyAHIBRXgI7LZZO-9kUEPnFMJUsH8Jkd21w",
    authDomain: "marias2.firebaseapp.com",
    projectId: "marias2",
    storageBucket: "marias2.firebasestorage.app",
    messagingSenderId: "724433124966",
    appId: "1:724433124966:web:3dcb67d58e8a68f52277a7",
    databaseURL: "https://marias2-default-rtdb.firebaseio.com" 
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// --- CRONÔMETRO ---
const dataInicio = new Date(2024, 9, 18, 20, 20, 0); 
setInterval(() => {
    const dif = new Date() - dataInicio;
    document.getElementById("days").innerText = Math.floor(dif / 86400000).toString().padStart(2, '0');
    document.getElementById("hours").innerText = Math.floor((dif % 86400000) / 3600000).toString().padStart(2, '0');
    document.getElementById("minutes").innerText = Math.floor((dif % 3600000) / 60000).toString().padStart(2, '0');
    document.getElementById("seconds").innerText = Math.floor((dif % 60000) / 1000).toString().padStart(2, '0');
}, 1000);

// --- TIMELINE COM ANIMAÇÃO ---
const historia = [
    { data: "18/09/2024", texto: "Nosso primeiro beijo. Onde tudo realmente começou... " },
    { data: "18/10/2024", texto: "O início oficial de tudo. Começamos a namorar. ✨" },
    { data: "18/11/2024", texto: "Nosso primeiro mês. A separação difícil de 2 meses.💔" },
    { data: "20/02/2025", texto: "Eu voltei para você! Para finalmente ficarmos juntos. 🏠❤️" },
    { data: "Hoje", texto: "Construindo nosso futuro um bit de cada vez. 💻❤️" }
];
const tlContainer = document.getElementById("main-timeline");
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('show-timeline'); });
}, { threshold: 0.1 });

historia.forEach(item => {
    const div = document.createElement("div");
    div.className = "timeline-item";
    div.innerHTML = `<div class="timeline-dot"></div><div class="timeline-content"><strong>${item.data}</strong><p>${item.texto}</p></div>`;
    tlContainer.appendChild(div);
    observer.observe(div);
});

// --- CARTA (TYPEWRITER) ---
const textoCarta = "Não importa a distância ou o tempo, meu coração sempre soube o caminho de volta para você. Você é minha melhor escolha todos os dias. Eu te amo muito! ❤️";
document.getElementById("envelope").onclick = function() {
    this.classList.toggle("open");
    const txt = document.getElementById("typewriter-text");
    if (this.classList.contains("open")) {
        txt.innerHTML = ""; let i = 0;
        const type = () => { if(i < textoCarta.length) { txt.innerHTML += textoCarta.charAt(i++); setTimeout(type, 50); } };
        setTimeout(type, 800);
    }
};

// --- SURPRESA 50 SEG ---
document.getElementById("start-btn").onclick = () => {
    document.getElementById("intro-overlay").style.opacity = "0";
    setTimeout(() => document.getElementById("intro-overlay").style.display = "none", 1000);
    const audio = document.getElementById("romanticAudio");
    audio.play(); document.getElementById("music-status").innerText = "Tocando agora...";

    setTimeout(() => {
        const trans = document.getElementById("special-transition");
        trans.classList.add("active");
        setTimeout(() => {
            trans.classList.remove("active");
            document.getElementById("proposal-modal").classList.add("show");
        }, 7000);
    }, 50000); // 50 segundos
};

// --- GALERIA FIREBASE ---
const imgInput = document.getElementById("imageInput");
imgInput.onchange = (e) => {
    const reader = new FileReader();
    reader.onload = (ev) => database.ref('galeria').push({ url: ev.target.result });
    reader.readAsDataURL(e.target.files[0]);
};
database.ref('galeria').on('child_added', (snap) => {
    const div = document.createElement("div");
    div.className = "photo-card"; div.id = snap.key;
    div.innerHTML = `<img src="${snap.val().url}"><button class="delete-btn" onclick="apagar('${snap.key}')">✕</button>`;
    document.getElementById("galleryGrid").appendChild(div);
});
window.apagar = (key) => database.ref('galeria').child(key).remove();
database.ref('galeria').on('child_removed', (snap) => document.getElementById(snap.key).remove());

// --- MÚSICA ---
document.getElementById("music-btn").onclick = function() {
    const a = document.getElementById("romanticAudio");
    if(a.paused) { a.play(); this.innerText = "⏸️"; } else { a.pause(); this.innerText = "▶️"; }
};

document.getElementById("btn-yes").onclick = () => {
    document.querySelector(".proposal-card").innerHTML = "<h2>Sabia que diria sim! ❤️</h2>";
};

// --- CORAÇÕES ---
setInterval(() => {
    const h = document.createElement("div");
    h.style.cssText = `position:fixed; bottom:-20px; left:${Math.random()*100}vw; animation:floatUp 4s linear forwards; z-index:-1;`;
    h.innerHTML = "💜"; document.getElementById("particles-container").appendChild(h);
    setTimeout(() => h.remove(), 4000);
}, 600);
