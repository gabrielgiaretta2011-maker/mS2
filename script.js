// 0. CONFIGURAÇÃO FIREBASE (Conexão com o banco)
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

// 1. DADOS ORIGINAIS RESTAURADOS
const dataInicio = new Date(2024, 9, 18, 20, 20, 0); 
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
const textoCarta = "Não importa a distância ou o tempo que ficarmos longe, meu coração sempre soube o caminho de volta para você. Você é minha melhor escolha todos os dias. Depois de todo esse tempo juntos, eu ainda continuo me apaixonando mais e mais por você a cada dia. Obrigado por ser meu lar. ❤️";

// 2. GERAR TIMELINE (Original)
const timelineContainer = document.getElementById("main-timeline");
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add("visible"); });
}, { threshold: 0.1 });

historia.forEach(item => {
    const div = document.createElement("div");
    div.className = "timeline-item";
    div.innerHTML = `<div class="timeline-dot"></div><div class="timeline-content"><strong>${item.data}</strong><p>${item.texto}</p></div>`;
    timelineContainer.appendChild(div);
    observer.observe(div);
});

// 3. TIMER
function atualizarContador() {
    const dif = new Date() - dataInicio;
    document.getElementById("days").innerText = Math.floor(dif / 86400000).toString().padStart(2,'0');
    document.getElementById("hours").innerText = Math.floor((dif % 86400000) / 3600000).toString().padStart(2,'0');
    document.getElementById("minutes").innerText = Math.floor((dif % 3600000) / 60000).toString().padStart(2,'0');
    document.getElementById("seconds").innerText = Math.floor((dif % 60000) / 1000).toString().padStart(2,'0');
}
setInterval(atualizarContador, 1000);

// 4. ENVELOPE (Lógica original de digitação)
let typingTimeout;
const envelope = document.getElementById("envelope");
const target = document.getElementById("typewriter-text");
envelope.addEventListener("click", () => {
    const isOpen = envelope.classList.toggle("open");
    clearTimeout(typingTimeout);
    if (isOpen) {
        target.innerHTML = "";
        let i = 0;
        function type() {
            if (i < textoCarta.length) {
                target.innerHTML += textoCarta.charAt(i); i++;
                typingTimeout = setTimeout(type, 50);
            }
        }
        setTimeout(type, 800);
    } else { target.innerHTML = ""; }
});

// 5. LÓGICA DA GALERIA COM FIREBASE (SALVAMENTO REAL)
const imageInput = document.getElementById("imageInput");
const galleryGrid = document.getElementById("galleryGrid");

// Quando escolher uma foto, envia para o Firebase
imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            database.ref('galeria').push({
                image: event.target.result,
                timestamp: Date.now()
            });
        };
        reader.readAsDataURL(file);
    }
});

// Escuta o banco de dados e mostra as fotos na tela automaticamente
database.ref('galeria').on('child_added', (snapshot) => {
    const data = snapshot.val();
    const key = snapshot.key;
    
    const card = document.createElement("div");
    card.className = "photo-card";
    card.id = key;
    card.innerHTML = `
        <img src="${data.image}">
        <button class="delete-photo" onclick="removerFoto('${key}')">✕</button>
    `;
    galleryGrid.appendChild(card);
});

// Função para apagar do banco
window.removerFoto = (key) => {
    if(confirm("Deseja apagar essa foto da nossa história?")) {
        database.ref('galeria/' + key).remove();
    }
};

database.ref('galeria').on('child_removed', (snapshot) => {
    const el = document.getElementById(snapshot.key);
    if(el) el.remove();
});

// 6. OUTROS CONTROLES (Início, Som, Temas)
document.getElementById("start-btn").addEventListener("click", () => {
    const intro = document.getElementById("intro-overlay");
    intro.style.opacity = "0";
    setTimeout(() => {
        intro.remove();
        // Lógica da surpresa de 50 segundos (original)
        setTimeout(() => {
            const special = document.getElementById("special-transition");
            special.classList.add("active");
            setTimeout(() => special.classList.add("show-text"), 500);
            setTimeout(() => {
                special.classList.remove("active");
                document.getElementById("final-action-container").style.display = "block";
            }, 7000);
        }, 50000);
    }, 1000);
});

const audio = document.getElementById("romanticAudio");
const musicBtn = document.getElementById("music-btn");
musicBtn.addEventListener("click", () => {
    if (audio.paused) { audio.play(); musicBtn.innerText = "⏸️ Pausar"; }
    else { audio.pause(); musicBtn.innerText = "▶️ Tocar"; }
});

document.getElementById("musicInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        audio.src = URL.createObjectURL(file);
        document.getElementById("music-name").innerText = file.name;
        audio.play(); musicBtn.innerText = "⏸️ Pausar";
    }
});

document.getElementById("theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
});

// PARTÍCULAS LEVES DO FUNDO
setInterval(() => {
    const c = document.getElementById("particles-container");
    const h = document.createElement("div");
    h.className = "floating-heart";
    h.innerHTML = ['💜', '💙', '✨'][Math.floor(Math.random() * 3)];
    h.style.left = Math.random() * 100 + "vw";
    h.style.fontSize = (Math.random() * 15 + 10) + "px";
    h.style.animationDuration = (Math.random() * 3 + 4) + "s";
    c.appendChild(h);
    setTimeout(() => h.remove(), 5000);
}, 600);
