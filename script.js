// --- CONFIGURAÇÃO FIREBASE ---
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

// --- DADOS DA TIMELINE ---
const historia = [
    { data: "18/09/2024", texto: "Nosso primeiro beijo. Onde tudo realmente começou... " },
    { data: "18/10/2024", texto: "O início oficial de tudo. Começamos a namorar. ✨" },
    { data: "18/11/2024", texto: "Nosso primeiro mês. A separação difícil de 2 meses.💔" },
    { data: "20/02/2025", texto: "Eu voltei para você! Para finalmente ficarmos juntos. 🏠❤️" },
    { data: "13/07/2025", texto: "Falei com tua mãe e nos assumimos oficialmente." },
    { data: "13/09/2025", texto: "Fomos à igreja juntos pela primeira vez. ✨" },
    { data: "17/09/2025", texto: "Começamos a estudar juntos finalmente!" },
    { data: "12/12/2025", texto: "A despedida necessária para o nosso futuro. ✈️" },
    { data: "18/02/2026", texto: "Minha volta definitiva para os seus braços." },
    { data: "Hoje", texto: "Construindo nosso futuro um bit de cada vez. 💻❤️" }
];

// --- GERADOR DA TIMELINE COM ANIMAÇÃO ---
const timelineContainer = document.getElementById("main-timeline");
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('show-timeline');
    });
}, { threshold: 0.2 });

historia.forEach(item => {
    const div = document.createElement("div");
    div.className = "timeline-item";
    div.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-content">
            <strong style="color:var(--accent-purple)">${item.data}</strong>
            <p>${item.texto}</p>
        </div>`;
    timelineContainer.appendChild(div);
    observer.observe(div);
});

// --- CRONÔMETRO ---
const dataInicio = new Date(2024, 9, 18, 20, 20, 0); 
setInterval(() => {
    const dif = new Date() - dataInicio;
    document.getElementById("days").innerText = Math.floor(dif / 86400000).toString().padStart(2, '0');
    document.getElementById("hours").innerText = Math.floor((dif % 86400000) / 3600000).toString().padStart(2, '0');
    document.getElementById("minutes").innerText = Math.floor((dif % 3600000) / 60000).toString().padStart(2, '0');
    document.getElementById("seconds").innerText = Math.floor((dif % 60000) / 1000).toString().padStart(2, '0');
}, 1000);

// --- GALERIA (FIREBASE) ---
const imageInput = document.getElementById("imageInput");
const galleryGrid = document.getElementById("galleryGrid");

imageInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
        await database.ref('galeria').push({ url: ev.target.result });
    };
    reader.readAsDataURL(file);
};

database.ref('galeria').on('child_added', (snap) => {
    const div = document.createElement("div");
    div.className = "photo-card";
    div.id = snap.key;
    div.innerHTML = `
        <img src="${snap.val().url}">
        <button class="delete-btn" onclick="apagarFoto('${snap.key}')">✕</button>
    `;
    galleryGrid.appendChild(div);
});

database.ref('galeria').on('child_removed', (snap) => {
    document.getElementById(snap.key)?.remove();
});

window.apagarFoto = (key) => {
    if(confirm("Deseja apagar esse momento? ❤️")) database.ref('galeria').child(key).remove();
};

// --- EFEITOS (CORAÇÕES) ---
setInterval(() => {
    const heart = document.createElement("div");
    heart.style.cssText = `position:fixed; bottom:-20px; left:${Math.random()*100}vw; animation:floatUp 4s linear forwards; z-index:-1; font-size:20px;`;
    heart.innerHTML = ['💜', '✨', '❤️', '💙'][Math.floor(Math.random() * 4)];
    document.getElementById("particles-container").appendChild(heart);
    setTimeout(() => heart.remove(), 4000);
}, 500);

// --- CARTA (TYPEWRITER) ---
const textoCarta = "Não importa a distância ou o tempo, meu coração sempre soube o caminho de volta para você. Você é minha melhor escolha todos os dias. Eu te amo muito! ❤️";
document.getElementById("envelope").onclick = function() {
    this.classList.toggle("open");
    const txt = document.getElementById("typewriter-text");
    txt.innerHTML = "";
    if (this.classList.contains("open")) {
        let i = 0;
        const type = () => { if (i < textoCarta.length) { txt.innerHTML += textoCarta.charAt(i++); setTimeout(type, 50); } };
        setTimeout(type, 800);
    }
};

// --- INÍCIO, MÚSICA E SURPRESA DE 50 SEG ---
document.getElementById("start-btn").onclick = () => {
    document.getElementById("intro-overlay").style.display = "none";
    const audio = document.getElementById("romanticAudio");
    audio.play().catch(e => console.log("Erro áudio:", e));

    // Lógica da Surpresa: Após 50 segundos
    setTimeout(() => {
        const trans = document.getElementById("special-transition");
        trans.classList.add("active");
        
        // Depois de 7 segundos na tela preta, mostra o pedido
        setTimeout(() => {
            trans.classList.remove("active");
            document.getElementById("proposal-modal").classList.add("show");
        }, 7000);
    }, 50000);
};

document.getElementById("music-btn").onclick = function() {
    const a = document.getElementById("romanticAudio");
    if (a.paused) { a.play(); this.innerText = "⏸️"; }
    else { a.pause(); this.innerText = "▶️"; }
};

document.getElementById("btn-yes").onclick = () => {
    document.querySelector(".proposal-card").innerHTML = "<h2>Sabia que diria sim! ❤️</h2><p>Te amo!</p>";
};

document.getElementById("btn-no").onclick = () => alert("Tente novamente... ❤️");

document.getElementById("theme-toggle").onclick = () => document.body.classList.toggle("light-mode");
