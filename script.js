// --- 1. CONFIGURAÇÃO FIREBASE (PROJETO MARIAS2) ---
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

// --- 2. TODAS AS 10 DATAS DA HISTÓRIA ---
const historia = [
    { data: "18/09/2024", texto: "Nosso primeiro beijo. Onde tudo realmente começou... " },
    { data: "18/10/2024", texto: "O início oficial de tudo. a partir desse dia começamos a namorar. ✨" },
    { data: "18/11/2024", texto: "Nosso primeiro mês. Mas foi quando tivemos que nos separar... foram 2 meses dificeis.💔" },
    { data: "20/02/2025", texto: "Eu voltei para você! Para finalmente ficarmos juntos de novo. 🏠❤️" },
    { data: "13/07/2025", texto: "Quando finalmente falei com tua mãe e nos assumimos." },
    { data: "13/09/2025", texto: "O dia que fui na sua casa e fomos à igreja juntos. ✨" },
    { data: "17/09/2025", texto: "Começamos a estudar juntos finalmente!" },
    { data: "12/12/2025", texto: "A despedida difícil, mas necessária para o nosso futuro. ✈️" },
    { data: "18/02/2026", texto: "Minha volta definitiva para os seus braços." },
    { data: "Hoje", texto: "Construindo nosso futuro um bit de cada vez. 💻❤️" }
];

// Gerar Timeline na Tela
const timelineContainer = document.getElementById("main-timeline");
historia.forEach(item => {
    const div = document.createElement("div");
    div.className = "timeline-item";
    div.style.opacity = "1";
    div.innerHTML = `<div class="timeline-dot"></div><div class="timeline-content"><strong style="color:#a78bfa;">${item.data}</strong><p style="font-size:0.85rem;margin-top:5px;color:white;">${item.texto}</p></div>`;
    timelineContainer.appendChild(div);
});

// --- 3. CRONÔMETRO ---
const dataInicio = new Date(2024, 9, 18, 20, 20, 0); 
function atualizarContador() {
    const dif = new Date() - dataInicio;
    document.getElementById("days").innerText = Math.floor(dif / 86400000).toString().padStart(2, '0');
    document.getElementById("hours").innerText = Math.floor((dif % 86400000) / 3600000).toString().padStart(2, '0');
    document.getElementById("minutes").innerText = Math.floor((dif % 3600000) / 60000).toString().padStart(2, '0');
    document.getElementById("seconds").innerText = Math.floor((dif % 60000) / 1000).toString().padStart(2, '0');
}
setInterval(atualizarContador, 1000);
atualizarContador();

// --- 4. CARTA COM EFEITO TYPEWRITER ---
const textoCarta = "Não importa a distância ou o tempo, meu coração sempre soube o caminho de volta para você. Você é minha melhor escolha todos os dias. Eu te amo muito! ❤️";
const envelope = document.getElementById("envelope");
const typewriterText = document.getElementById("typewriter-text");
envelope.onclick = () => {
    const isOpen = envelope.classList.toggle("open");
    typewriterText.innerHTML = "";
    if (isOpen) {
        let i = 0;
        function type() {
            if (i < textoCarta.length) { typewriterText.innerHTML += textoCarta.charAt(i++); setTimeout(type, 50); }
        }
        setTimeout(type, 800);
    }
};

// --- 5. CORAÇÕES FLUTUANTES ---
function createHeart() {
    const container = document.getElementById("particles-container");
    if (!container) return;
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.innerHTML = ['💜', '💙', '✨', '❤️'][Math.floor(Math.random() * 4)];
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.position = "fixed";
    heart.style.bottom = "-20px";
    heart.style.zIndex = "100";
    heart.style.animation = `floatUp ${Math.random() * 3 + 3}s linear forwards`;
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 5000);
}
setInterval(createHeart, 400);

// --- 6. GALERIA FIREBASE ---
const imageInput = document.getElementById("imageInput");
const galleryGrid = document.getElementById("galleryGrid");
imageInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file || file.size > 1000000) { alert("Escolha uma foto menor que 1MB!"); return; }
    const reader = new FileReader();
    const btn = document.querySelector(".upload-btn");
    btn.innerText = "Salvando... ❤️";
    reader.onload = async (ev) => {
        await database.ref('galeria').push({ url: ev.target.result });
        btn.innerText = "✨ Adicionar Foto";
    };
    reader.readAsDataURL(file);
};
database.ref('galeria').on('child_added', (snap) => {
    const div = document.createElement("div");
    div.className = "photo-card";
    div.innerHTML = `<img src="${snap.val().url}" style="width:100%; border-radius:10px;">`;
    galleryGrid.appendChild(div);
});

// --- 7. SURPRESA APÓS 50 SEGUNDOS ---
function dispararSurpresa() {
    const trans = document.getElementById("special-transition");
    trans.classList.add("active");
    setTimeout(() => trans.classList.add("show-text"), 1000);
    setTimeout(() => {
        trans.classList.remove("active");
        document.getElementById("final-action-container").style.display = "block";
    }, 8000);
}

document.getElementById("start-btn").onclick = () => {
    document.getElementById("intro-overlay").style.display = "none";
    document.getElementById("romanticAudio").play().catch(() => {});
    setTimeout(dispararSurpresa, 50000); 
};

// --- 8. PERGUNTA FINAL E INTERAÇÕES ---
document.getElementById("final-surprise-btn").onclick = () => document.getElementById("proposal-modal").classList.add("show");
document.getElementById("btn-no").onclick = () => document.getElementById("error-msg").style.display = "block";
document.getElementById("btn-yes").onclick = () => {
    document.querySelector(".proposal-card").innerHTML = "<h2>Sabia que diria sim! ❤️</h2><p>Te amo para sempre!</p>";
};

document.getElementById("theme-toggle").onclick = () => document.body.classList.toggle("light-mode");
const audio = document.getElementById("romanticAudio");
document.getElementById("music-btn").onclick = () => {
    if (audio.paused) { audio.play(); document.getElementById("music-btn").innerText = "⏸️ Pausar"; }
    else { audio.pause(); document.getElementById("music-btn").innerText = "▶️ Tocar"; }
};
