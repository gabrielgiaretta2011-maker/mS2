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

// 2. DATA E AUDIO
const dataInicio = new Date(2024, 8, 18, 20, 20, 0); 
const audio = document.getElementById("romanticAudio");

// 3. SUA HISTÓRIA FIXA
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

// 4. FUNÇÃO PARA DESENHAR A TIMELINE (HISTÓRIA + FOTOS)
function atualizarTimeline(fotosFirebase = []) {
    const timelineContainer = document.getElementById("main-timeline");
    if (!timelineContainer) return;

    // Limpa e coloca o título
    timelineContainer.innerHTML = '<h2 class="section-title">Nossa Linha do Tempo</h2>';

    // Adiciona os momentos fixos da 'historia'
    historia.forEach(item => {
        const div = document.createElement("div");
        div.className = "timeline-item";
        div.innerHTML = `
            <div class="timeline-date">${item.data}</div>
            <div class="timeline-content"><p>${item.texto}</p></div>
        `;
        timelineContainer.appendChild(div);
    });

    // Adiciona as fotos do Firebase logo abaixo
    fotosFirebase.forEach(foto => {
        const dataFoto = new Date(foto.timestamp).toLocaleDateString('pt-BR');
        const div = document.createElement("div");
        div.className = "timeline-item";
        div.innerHTML = `
            <div class="timeline-date">${dataFoto}</div>
            <div class="timeline-content">
                <img src="${foto.image}" style="width:100%; border-radius:10px; margin-top:10px;">
                <p>Novo momento adicionado! ✨</p>
            </div>
        `;
        timelineContainer.appendChild(div);
    });
}

// 5. CARREGAR DADOS INICIAIS
// Chama a timeline assim que o script carregar para garantir que a história apareça
atualizarTimeline();

// Escuta o Firebase para as fotos
database.ref('galeria').on('value', (snapshot) => {
    const galleryGrid = document.getElementById("galleryGrid");
    if (galleryGrid) galleryGrid.innerHTML = '';
    
    const fotos = [];
    snapshot.forEach((child) => {
        const data = child.val();
        fotos.push({ key: child.key, ...data });

        // Preenche a galeria
        if (galleryGrid) {
            const card = document.createElement("div");
            card.className = "photo-card";
            card.innerHTML = `
                <img src="${data.image}">
                <button style="position:absolute;top:5px;right:5px;background:red;color:white;border:none;border-radius:50%;width:25px;height:25px;cursor:pointer;" onclick="deletePhoto('${child.key}')">✕</button>
            `;
            galleryGrid.appendChild(card);
        }
    });

    // Re-desenha a timeline com as fotos novas
    atualizarTimeline(fotos);
});

// 6. OUTRAS FUNÇÕES
document.getElementById("start-btn").onclick = () => {
    document.getElementById("intro-overlay").style.opacity = "0";
    if (audio) {
        audio.play().catch(e => console.log("Play bloqueado pelo navegador"));
    }
    setTimeout(() => {
        document.getElementById("intro-overlay").remove();
        // Surpresa preta após 50s
        setTimeout(() => {
            const special = document.getElementById("special-transition");
            if (special) {
                special.classList.add("active");
                setTimeout(() => special.classList.add("show-text"), 500);
                setTimeout(() => {
                    special.classList.remove("active");
                    document.getElementById("final-action-container").style.display = "block";
                }, 7000);
            }
        }, 50000);
    }, 1000);
};

// Timer
setInterval(() => {
    const agora = new Date();
    const dif = agora - dataInicio;
    const d = Math.floor(dif / 86400000);
    const h = Math.floor((dif % 86400000) / 3600000);
    const m = Math.floor((dif % 3600000) / 60000);
    const s = Math.floor((dif % 60000) / 1000);
    document.getElementById("days").innerText = d < 10 ? "0"+d : d;
    document.getElementById("hours").innerText = h < 10 ? "0"+h : h;
    document.getElementById("minutes").innerText = m < 10 ? "0"+m : m;
    document.getElementById("seconds").innerText = s < 10 ? "0"+s : s;
}, 1000);

// Envelope
document.getElementById("envelope").onclick = function() {
    this.classList.toggle("open");
    if(this.classList.contains("open")) {
        document.getElementById("typewriter-text").innerText = "Não importa a distância ou o tempo, meu coração sempre soube o caminho de volta para você. ❤️";
    }
};

// Galeria Upload
document.getElementById("imageInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            database.ref('galeria').push({ image: ev.target.result, timestamp: Date.now() });
        };
        reader.readAsDataURL(file);
    }
});

window.deletePhoto = (key) => { if(confirm("Apagar?")) database.ref('galeria/' + key).remove(); };

// Player Botão
document.getElementById("music-btn").onclick = () => {
    if (audio.paused) { audio.play(); document.getElementById("music-btn").innerText = "⏸️ Pausar"; }
    else { audio.pause(); document.getElementById("music-btn").innerText = "▶️ Tocar"; }
};

// Final e Tema
document.getElementById("final-surprise-btn").onclick = () => document.getElementById("proposal-modal").classList.add("show");
document.getElementById("btn-no").onclick = () => document.getElementById("error-msg").style.display = "block";
document.getElementById("btn-yes").onclick = () => { alert("EU TE AMO! ❤️"); document.getElementById("proposal-modal").classList.remove("show"); };
document.getElementById("theme-toggle").onclick = () => {
    document.body.classList.toggle("light-mode");
    document.getElementById("theme-toggle").innerText = document.body.classList.contains("light-mode") ? "🌙" : "☀️";
};
