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

if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const database = firebase.database();

// 2. DADOS INICIAIS
const dataInicio = new Date(2024, 8, 18, 20, 20, 0); 
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

// 3. FUNÇÃO PARA CRIAR ITENS DA TIMELINE (Com animação)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add("visible"); });
}, { threshold: 0.1 });

function renderizarLinhaDoTempo(fotosFirebase = []) {
    const container = document.getElementById("main-timeline");
    if (!container) return;

    container.innerHTML = '<h2 class="section-title">Nossa Linha do Tempo</h2>';

    // Parte 1: História Fixa
    historia.forEach(item => {
        const div = document.createElement("div");
        div.className = "timeline-item"; // Importante: seu CSS usa isso para animar
        div.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <strong>${item.data}</strong>
                <p>${item.texto}</p>
            </div>
        `;
        container.appendChild(div);
        observer.observe(div);
    });

    // Parte 2: Fotos do Firebase
    fotosFirebase.forEach(foto => {
        const dataFormatada = new Date(foto.timestamp).toLocaleDateString('pt-BR');
        const div = document.createElement("div");
        div.className = "timeline-item";
        div.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <strong>${dataFormatada}</strong>
                <img src="${foto.image}" style="width:100%; border-radius:10px; margin-top:10px;">
                <p>Mais um capítulo... ✨</p>
            </div>
        `;
        container.appendChild(div);
        observer.observe(div);
    });
}

// 4. INICIALIZAÇÃO E FIREBASE
renderizarLinhaDoTempo(); // Desenha a história fixa imediatamente

database.ref('galeria').on('value', (snapshot) => {
    const galleryGrid = document.getElementById("galleryGrid");
    if (galleryGrid) galleryGrid.innerHTML = '';
    
    const fotos = [];
    snapshot.forEach((child) => {
        const data = child.val();
        fotos.push({ key: child.key, ...data });

        if (galleryGrid) {
            const card = document.createElement("div");
            card.className = "photo-card";
            card.id = child.key;
            card.innerHTML = `
                <img src="${data.image}">
                <button class="delete-photo" onclick="deletePhoto('${child.key}')">✕</button>
            `;
            galleryGrid.appendChild(card);
        }
    });
    renderizarLinhaDoTempo(fotos); // Atualiza a timeline com as fotos novas
});

// 5. FUNÇÕES DE SUPORTE (Timer, Envelope, etc.)
setInterval(() => {
    const dif = new Date() - dataInicio;
    document.getElementById("days").innerText = Math.floor(dif / 86400000).toString().padStart(2,'0');
    document.getElementById("hours").innerText = Math.floor((dif % 86400000) / 3600000).toString().padStart(2,'0');
    document.getElementById("minutes").innerText = Math.floor((dif % 3600000) / 60000).toString().padStart(2,'0');
    document.getElementById("seconds").innerText = Math.floor((dif % 60000) / 1000).toString().padStart(2,'0');
}, 1000);

document.getElementById("start-btn").onclick = () => {
    const intro = document.getElementById("intro-overlay");
    intro.style.opacity = "0";
    const audio = document.getElementById("romanticAudio");
    if(audio) audio.play().catch(() => {});
    
    setTimeout(() => {
        intro.remove();
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
};

document.getElementById("envelope").onclick = function() {
    this.classList.toggle("open");
    const target = document.getElementById("typewriter-text");
    if(this.classList.contains("open")) {
        target.innerText = "Não importa a distância, meu coração sempre soube o caminho de volta para você. ❤️";
    }
};

document.getElementById("imageInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => database.ref('galeria').push({ image: ev.target.result, timestamp: Date.now() });
        reader.readAsDataURL(file);
    }
});

window.deletePhoto = (key) => { if(confirm("Apagar?")) database.ref('galeria/' + key).remove(); };

document.getElementById("music-btn").onclick = () => {
    const audio = document.getElementById("romanticAudio");
    if (audio.paused) { audio.play(); document.getElementById("music-btn").innerText = "⏸️ Pausar"; }
    else { audio.pause(); document.getElementById("music-btn").innerText = "▶️ Tocar"; }
};

document.getElementById("final-surprise-btn").onclick = () => document.getElementById("proposal-modal").classList.add("show");
document.getElementById("btn-yes").onclick = () => alert("EU TE AMO! ❤️");
document.getElementById("theme-toggle").onclick = () => document.body.classList.toggle("light-mode");
