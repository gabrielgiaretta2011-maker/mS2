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

// 3. SUA HISTÓRIA (FIXA)
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

// 4. FUNÇÃO PARA DESENHAR A TIMELINE
function renderizarTimeline(fotosFirebase = []) {
    const timelineContainer = document.getElementById("main-timeline");
    if(!timelineContainer) return;

    timelineContainer.innerHTML = '<h2 class="section-title">Nossa Linha do Tempo</h2>';

    // Adiciona os itens fixos da 'const historia'
    historia.forEach(item => {
        const div = document.createElement("div");
        div.className = "timeline-item";
        div.innerHTML = `
            <div class="timeline-date">${item.data}</div>
            <div class="timeline-content"><p>${item.texto}</p></div>
        `;
        timelineContainer.appendChild(div);
    });

    // Adiciona as fotos que vierem do Firebase abaixo da história
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

// 5. ESCUTAR O FIREBASE E ATUALIZAR TUDO
database.ref('galeria').on('value', (snapshot) => {
    const galleryGrid = document.getElementById("galleryGrid");
    galleryGrid.innerHTML = '';
    
    const fotos = [];
    snapshot.forEach((child) => {
        const data = child.val();
        fotos.push({ key: child.key, ...data });

        // Preencher a galeria de fotos
        const card = document.createElement("div");
        card.className = "photo-card";
        card.innerHTML = `
            <img src="${data.image}">
            <button style="position:absolute;top:5px;right:5px;background:red;color:white;border:none;border-radius:50%;width:25px;height:25px;cursor:pointer;" onclick="deletePhoto('${child.key}')">✕</button>
        `;
        galleryGrid.appendChild(card);
    });

    // Chama a função de desenhar a timeline passando as fotos novas
    renderizarTimeline(fotos);
});

// 6. RESTANTE DAS FUNÇÕES (START, TIMER, ETC)
document.getElementById("start-btn").onclick = () => {
    document.getElementById("intro-overlay").style.opacity = "0";
    audio.play().catch(() => {});
    setTimeout(() => document.getElementById("intro-overlay").remove(), 1000);
};

// Timer funcional
setInterval(() => {
    const agora = new Date();
    const dif = agora - dataInicio;
    document.getElementById("days").innerText = Math.floor(dif / 86400000);
    document.getElementById("hours").innerText = Math.floor((dif % 86400000) / 3600000);
    document.getElementById("minutes").innerText = Math.floor((dif % 3600000) / 60000);
    document.getElementById("seconds").innerText = Math.floor((dif % 60000) / 1000);
}, 1000);

window.deletePhoto = (key) => { if(confirm("Apagar?")) database.ref('galeria/' + key).remove(); };

document.getElementById("music-btn").onclick = () => {
    if (audio.paused) { audio.play(); document.getElementById("music-btn").innerText = "⏸️ Pausar"; }
    else { audio.pause(); document.getElementById("music-btn").innerText = "▶️ Tocar"; }
};
