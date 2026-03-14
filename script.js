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

const historiaFixa = [
    { realDate: new Date(2024, 8, 18), data: "18/09/2024", texto: "Nosso primeiro beijo. Onde tudo realmente começou... " },
    { realDate: new Date(2024, 9, 18), data: "18/10/2024", texto: "O início oficial de tudo. a partir desse dia começamos a namorar. ✨" },
    { realDate: new Date(2024, 10, 18), data: "18/11/2024", texto: "Nosso primeiro mês. Mas foi quando tivemos que nos separar... foram 2 meses dificeis.💔" },
    { realDate: new Date(2025, 1, 20), data: "20/02/2025", texto: "Eu voltei para você! Para finalmente ficarmos juntos de novo. 🏠❤️" },
    { realDate: new Date(2025, 6, 13), data: "13/07/2025", texto: "Quando finalmente falei com tua mãe e nos assumimos." },
    { realDate: new Date(2025, 8, 13), data: "13/09/2025", texto: "O dia que fui na sua casa e fomos à igreja juntos. ✨" },
    { realDate: new Date(2025, 8, 17), data: "17/09/2025", texto: "Começamos a estudar juntos finalmente!" },
    { realDate: new Date(2025, 11, 12), data: "12/12/2025", texto: "A despedida difícil, mas necessária para o nosso futuro. ✈️" },
    { realDate: new Date(2026, 1, 18), data: "18/02/2026", texto: "Minha volta definitiva para os seus braços." },
    { realDate: new Date(2099, 0, 1), data: "Hoje", texto: "Construindo nosso futuro um bit de cada vez. 💻❤️" }
];

// 3. FUNÇÃO PARA CRIAR ITENS DA TIMELINE
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add("visible"); });
}, { threshold: 0.1 });

function renderizarLinhaDoTempo(fotosFirebase = []) {
    const container = document.getElementById("main-timeline");
    if (!container) return;
    container.innerHTML = '<h2 class="section-title">Nossa Linha do Tempo</h2>';
    let todosEventos = [...historiaFixa];
    fotosFirebase.forEach(foto => {
        todosEventos.push({
            realDate: new Date(foto.dataEscolhida + "T00:00:00"),
            data: foto.dataEscolhida.split('-').reverse().join('/'),
            texto: foto.legenda || "Mais um capítulo... ✨",
            isImage: true,
            imageUrl: foto.image
        });
    });
    todosEventos.sort((a, b) => a.realDate - b.realDate);
    todosEventos.forEach(item => {
        const div = document.createElement("div");
        div.className = "timeline-item";
        if(item.isImage) {
            div.innerHTML = `<div class="timeline-dot"></div><div class="timeline-content"><strong>${item.data}</strong><img src="${item.imageUrl}" style="width:100%; border-radius:10px; margin-top:10px;"><p>${item.texto}</p></div>`;
        } else {
            div.innerHTML = `<div class="timeline-dot"></div><div class="timeline-content"><strong>${item.data}</strong><p>${item.texto}</p></div>`;
        }
        container.appendChild(div);
        observer.observe(div);
    });
}

// 4. INICIALIZAÇÃO E FIREBASE (GALERIA)
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
            card.innerHTML = `<img src="${data.image}"><button class="delete-photo" onclick="deletePhoto('${child.key}')">✕</button>`;
            galleryGrid.appendChild(card);
        }
    });
    renderizarLinhaDoTempo(fotos);
});

// --- LÓGICA DA MÚSICA (AJUSTADA: SOMENTE NO CLIQUE) ---
const audio = document.getElementById("romanticAudio");
const musicBtn = document.getElementById("music-btn");
const musicInput = document.getElementById("musicInput");
const musicNameLabel = document.getElementById("music-name");

database.ref('musica_tema').on('value', (snapshot) => {
    const musicData = snapshot.val();
    if (musicData) {
        audio.src = musicData.file;
        musicNameLabel.innerText = musicData.name;
    }
});

musicInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        musicNameLabel.innerText = "Enviando música...";
        const reader = new FileReader();
        reader.onload = (ev) => {
            database.ref('musica_tema').set({
                file: ev.target.result,
                name: file.name
            }).then(() => musicNameLabel.innerText = file.name);
        };
        reader.readAsDataURL(file);
    }
});

musicBtn.onclick = () => {
    if (audio.paused) {
        audio.play().then(() => { 
            musicBtn.innerText = "⏸️ Pausar"; 
        }).catch(() => {
            alert("Erro ao tocar música. Tente novamente.");
        });
    } else {
        audio.pause();
        musicBtn.innerText = "▶️ Tocar";
    }
};

// 5. FUNÇÕES DE SUPORTE
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
    // MÚSICA REMOVIDA DAQUI PARA EVITAR O ERRO
    
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
        target.innerText = "Não importa a distância ou o tempo que ficarmos longe, meu coração sempre soube o caminho de volta para você. Você é minha melhor escolha todos os dias. Depois de todo esse tempo juntos, eu ainda continuo me apaixonando mais e mais por você a cada dia. Obrigado por ser meu lar. ❤️";
    }
};

document.getElementById("imageInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    const dataEscolhida = document.getElementById("eventDate").value;
    const legenda = document.getElementById("imageCaption").value;
    if (!dataEscolhida) { alert("Por favor, selecione a data do momento!"); return; }
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            database.ref('galeria').push({ 
                image: ev.target.result, 
                timestamp: Date.now(),
                dataEscolhida: dataEscolhida,
                legenda: legenda || "Mais um capítulo... ✨"
            });
        };
        reader.readAsDataURL(file);
    }
});

window.deletePhoto = (key) => { if(confirm("Apagar?")) database.ref('galeria/' + key).remove(); };

document.getElementById("final-surprise-btn").onclick = () => document.getElementById("proposal-modal").classList.add("show");
document.getElementById("btn-yes").onclick = () => alert("EU TE AMO! ❤️");
document.getElementById("theme-toggle").onclick = () => document.body.classList.toggle("light-mode");
