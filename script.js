// --- CONFIGURAÇÃO FIREBASE (SEU PROJETO MARIAS2) ---
const firebaseConfig = {
    apiKey: "AIzaSyAHIBRXgI7LZZO-9kUEPnFMJUsH8Jkd21w",
    authDomain: "marias2.firebaseapp.com",
    projectId: "marias2",
    storageBucket: "marias2.firebasestorage.app",
    messagingSenderId: "724433124966",
    appId: "1:724433124966:web:3dcb67d58e8a68f52277a7",
    databaseURL: "https://marias2-default-rtdb.firebaseio.com" 
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// --- DADOS DO CASAL ---
const dataInicio = new Date(2024, 9, 18, 20, 20, 0); 
const textoCarta = "Não importa a distância ou o tempo, meu coração sempre soube o caminho de volta para você. Você é minha melhor escolha todos os dias. Eu te amo muito! ❤️";

// TODAS AS DATAS RESTAURADAS E COMPLETAS
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

// --- GERAR TIMELINE ---
const timelineContainer = document.getElementById("main-timeline");
timelineContainer.innerHTML = ""; // Limpa para garantir que não duplique
historia.forEach(item => {
    const div = document.createElement("div");
    div.className = "timeline-item";
    div.style.opacity = "1";
    div.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-content">
            <strong style="color: var(--accent-purple);">${item.data}</strong>
            <p style="font-size: 0.9rem; margin-top: 5px;">${item.texto}</p>
        </div>
    `;
    timelineContainer.appendChild(div);
});

// --- CRONÔMETRO ---
function atualizarContador() {
    const dif = new Date() - dataInicio;
    document.getElementById("days").innerText = Math.floor(dif / 86400000).toString().padStart(2, '0');
    document.getElementById("hours").innerText = Math.floor((dif % 86400000) / 3600000).toString().padStart(2, '0');
    document.getElementById("minutes").innerText = Math.floor((dif % 3600000) / 60000).toString().padStart(2, '0');
    document.getElementById("seconds").innerText = Math.floor((dif % 60000) / 1000).toString().padStart(2, '0');
}
setInterval(atualizarContador, 1000);
atualizarContador();

// --- LÓGICA DA CARTA ---
const envelope = document.getElementById("envelope");
const typewriterText = document.getElementById("typewriter-text");
envelope.onclick = () => {
    const isOpen = envelope.classList.toggle("open");
    typewriterText.innerHTML = "";
    if (isOpen) {
        let i = 0;
        function type() {
            if (i < textoCarta.length) {
                typewriterText.innerHTML += textoCarta.charAt(i++);
                setTimeout(type, 50);
            }
        }
        setTimeout(type, 800);
    }
};

// --- CORAÇÕES FLUTUANTES ---
function createHeart() {
    const container = document.getElementById("particles-container");
    if (!container) return;
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.innerHTML = ['💜', '💙', '✨', '❤️'][Math.floor(Math.random() * 4)];
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (Math.random() * 20 + 15) + "px";
    heart.style.position = "fixed";
    heart.style.bottom = "-20px";
    heart.style.zIndex = "-1";
    heart.style.animation = `floatUp ${Math.random() * 3 + 3}s linear forwards`;
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
}
setInterval(createHeart, 400);

// --- GALERIA COM FIREBASE ---
const imageInput = document.getElementById("imageInput");
const galleryGrid = document.getElementById("galleryGrid");

imageInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1048576) {
        alert("Escolha uma foto um pouco menor (até 1MB) para carregar rapidinho! ✨");
        return;
    }

    const reader = new FileReader();
    const btnLabel = document.querySelector(".upload-btn");
    btnLabel.innerText = "Salvando... ❤️";

    reader.onload = async (event) => {
        const base64Image = event.target.result; 
        try {
            await database.ref('galeria').push({ url: base64Image });
            btnLabel.innerText = "✨ Adicionar Foto";
        } catch (error) {
            alert("Erro ao salvar! Verifique as Regras no Firebase.");
            btnLabel.innerText = "✨ Adicionar Foto";
        }
    };
    reader.readAsDataURL(file);
};

database.ref('galeria').on('child_added', (snapshot) => {
    const foto = snapshot.val();
    const div = document.createElement("div");
    div.className = "photo-card";
    div.innerHTML = `<img src="${foto.url}">`;
    galleryGrid.appendChild(div);
});

// --- SURPRESA 50 SEGUNDOS ---
function dispararSurpresa() {
    const transition = document.getElementById("special-transition");
    transition.classList.add("active");
    setTimeout(() => transition.classList.add("show-text"), 1000);
    setTimeout(() => {
        transition.classList.remove("active");
        transition.classList.remove("show-text");
        document.getElementById("final-action-container").style.display = "block";
    }, 8000);
}

document.getElementById("start-btn").onclick = () => {
    document.getElementById("intro-overlay").style.display = "none";
    document.getElementById("romanticAudio").play().catch(() => {});
    setTimeout(dispararSurpresa, 50000); 
};

// --- PEDIDO FINAL ---
document.getElementById("final-surprise-btn").onclick = () => {
    document.getElementById("proposal-modal").classList.add("show");
};

document.getElementById("btn-no").onclick = () => {
    document.getElementById("error-msg").style.display = "block";
};

document.getElementById("btn-yes").onclick = () => {
    document.querySelector(".proposal-card").innerHTML = "<h2>Sabia que diria sim! ❤️</h2><p>Te amo para sempre!</p>";
};

// --- TEMA ---
document.getElementById("theme-toggle").onclick = () => {
    document.body.classList.toggle("light-mode");
};
