// 1. CONFIGURAÇÃO FIREBASE
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

// 2. DADOS E CRONÔMETRO
const dataInicio = new Date(2024, 9, 18, 20, 20, 0); 
const textoCarta = "Não importa a distância ou o tempo, meu coração sempre soube o caminho de volta para você. Você é minha melhor escolha todos os dias. Eu te amo muito! ❤️";

function atualizarContador() {
    const dif = new Date() - dataInicio;
    document.getElementById("days").innerText = Math.floor(dif / 86400000).toString().padStart(2, '0');
    document.getElementById("hours").innerText = Math.floor((dif % 86400000) / 3600000).toString().padStart(2, '0');
    document.getElementById("minutes").innerText = Math.floor((dif % 3600000) / 60000).toString().padStart(2, '0');
    document.getElementById("seconds").innerText = Math.floor((dif % 60000) / 1000).toString().padStart(2, '0');
}
setInterval(atualizarContador, 1000);

// 3. TIMELINE
const historia = [
    { data: "18/09/2024", texto: "Nosso primeiro beijo. ❤️" },
    { data: "18/10/2024", texto: "O pedido oficial. ✨" },
    { data: "20/02/2025", texto: "O reencontro mais esperado. 🏠" },
    { data: "Hoje", texto: "Amando você cada dia mais. 💻❤️" }
];

const tlContainer = document.getElementById("main-timeline");
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add("visible"); });
}, { threshold: 0.1 });

historia.forEach(item => {
    const div = document.createElement("div");
    div.className = "timeline-item";
    div.innerHTML = `<div class="timeline-dot"></div><div class="timeline-content"><strong>${item.data}</strong><p>${item.texto}</p></div>`;
    tlContainer.appendChild(div);
    observer.observe(div);
});

// 4. CARTINHA
const envelope = document.getElementById("envelope");
envelope.addEventListener("click", () => {
    const isOpen = envelope.classList.toggle("open");
    const target = document.getElementById("typewriter-text");
    target.innerHTML = "";
    if (isOpen) {
        let i = 0;
        const type = () => {
            if (i < textoCarta.length) {
                target.innerHTML += textoCarta.charAt(i++);
                setTimeout(type, 50);
            }
        };
        setTimeout(type, 800);
    }
});

// 5. MÚSICA (FIX)
const audio = document.getElementById("romanticAudio");
document.getElementById("musicInput").onchange = (e) => {
    const file = e.target.files[0];
    if(file){
        audio.src = URL.createObjectURL(file);
        document.getElementById("music-name").innerText = file.name;
        audio.play();
        document.getElementById("music-btn").innerText = "⏸️ Pausar";
    }
};

document.getElementById("music-btn").onclick = () => {
    if (audio.paused) { audio.play(); document.getElementById("music-btn").innerText = "⏸️ Pausar"; }
    else { audio.pause(); document.getElementById("music-btn").innerText = "▶️ Tocar"; }
};

// 6. GALERIA FIREBASE
document.getElementById("imageInput").onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (ev) => database.ref('galeria').push({ url: ev.target.result });
    reader.readAsDataURL(file);
};

database.ref('galeria').on('child_added', (snap) => {
    const div = document.createElement("div");
    div.className = "photo-card"; div.id = snap.key;
    div.innerHTML = `<img src="${snap.val().url}"><button class="delete-photo" onclick="database.ref('galeria/${snap.key}').remove()">✕</button>`;
    document.getElementById("galleryGrid").appendChild(div);
});
database.ref('galeria').on('child_removed', (snap) => document.getElementById(snap.key).remove());

// 7. INÍCIO E SURPRESA
document.getElementById("start-btn").onclick = () => {
    document.getElementById("intro-overlay").style.opacity = "0";
    setTimeout(() => document.getElementById("intro-overlay").remove(), 1000);
    audio.play().catch(() => {});
    
    // Timer 50 seg para a transição preta
    setTimeout(() => {
        const trans = document.getElementById("special-transition");
        trans.classList.add("active");
        setTimeout(() => trans.classList.add("show-text"), 500);
        
        setTimeout(() => {
            trans.classList.remove("active");
            document.getElementById("final-action-container").style.display = "block";
        }, 6000);
    }, 50000); 
};

// 8. PEDIDO FINAL
document.getElementById("final-surprise-btn").onclick = () => document.getElementById("proposal-modal").classList.add("show");
document.getElementById("btn-no").onclick = () => document.getElementById("error-msg").style.display = "block";
document.getElementById("btn-yes").onclick = () => {
    document.querySelector(".proposal-card").innerHTML = "<h2>Sabia que diria sim! ❤️</h2>";
};

// 9. CORAÇÕES
setInterval(() => {
    const h = document.createElement("div");
    h.className = "floating-heart"; h.innerHTML = "💜";
    h.style.left = Math.random() * 100 + "vw";
    document.getElementById("particles-container").appendChild(h);
    setTimeout(() => h.remove(), 4000);
}, 500);
