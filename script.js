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

// --- SEGURANÇA: Sessão temporária e Logout no F5 ---
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
window.addEventListener('beforeunload', () => { firebase.auth().signOut(); });

// --- FUNÇÃO PARA MOSTRAR/ESCONDER TUDO QUE É ADMIN ---
function gerenciarVisibilidadeAdmin(user) {
    const deleteButtons = document.querySelectorAll('.delete-photo');
    const painelUpload = document.querySelector('.admin-controls');
    
    if (user) {
        // Se logado: mostra botões de lixeira e painel de upload
        deleteButtons.forEach(btn => btn.style.display = 'block');
        if(painelUpload) painelUpload.style.display = 'block';
        console.log("Admin logado: " + user.email);
    } else {
        // Se deslogado: esconde tudo
        deleteButtons.forEach(btn => btn.style.display = 'none');
        if(painelUpload) painelUpload.style.display = 'none';
    }
}

// Escuta mudanças de login (Firebase faz isso automaticamente)
firebase.auth().onAuthStateChanged((user) => {
    gerenciarVisibilidadeAdmin(user);
});

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

// --- LÓGICA DAS PARTÍCULAS E CLIQUES ---
let heartInterval;
function createHeart(isFast = false) {
    const container = document.getElementById("particles-container");
    if (!container) return;
    const h = document.createElement("div");
    h.className = "floating-heart";
    const emojis = ['💜', '💙', '✨'];
    h.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
    h.style.left = Math.random() * 100 + "vw";
    h.style.fontSize = (Math.random() * 15 + 10) + "px";
    const duration = isFast ? (Math.random() * 1 + 0.8) : (Math.random() * 3 + 4);
    h.style.animationDuration = duration + "s";
    container.style.zIndex = isFast ? "20000" : "-1";
    container.appendChild(h);
    setTimeout(() => h.remove(), 5000);
}

document.addEventListener('mousedown', (e) => {
    const h = document.createElement("div");
    h.className = "click-heart";
    h.innerHTML = ['💜', '💙', '✨'][Math.floor(Math.random() * 3)];
    h.style.left = e.clientX + "px";
    h.style.top = e.clientY + "px";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 800);
});

heartInterval = setInterval(() => createHeart(false), 600);

// --- AUXILIARES: IMAGEM E LIGHTBOX ---
function compressImage(file, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1200; 
            let width = img.width;
            let height = img.height;
            if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            callback(canvas.toDataURL('image/jpeg', 0.7));
        };
    };
}

function openLightbox(src, caption) {
    const lb = document.getElementById("lightbox");
    document.getElementById("lightbox-img").src = src;
    document.getElementById("lightbox-caption").innerText = caption || "";
    lb.style.display = "flex";
}
function closeLightbox() { document.getElementById("lightbox").style.display = "none"; }

// --- RENDERIZAÇÃO ---
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
        div.innerHTML = item.isImage 
            ? `<div class="timeline-dot"></div><div class="timeline-content"><strong>${item.data}</strong><img src="${item.imageUrl}" style="width:100%; border-radius:10px; margin-top:10px; cursor:zoom-in;" onclick="openLightbox('${item.imageUrl}', '${item.texto}')"><p>${item.texto}</p></div>`
            : `<div class="timeline-dot"></div><div class="timeline-content"><strong>${item.data}</strong><p>${item.texto}</p></div>`;
        container.appendChild(div);
        observer.observe(div);
    });
}

// Escuta Galeria
database.ref('galeria').on('value', (snapshot) => {
    const galleryGrid = document.getElementById("galleryGrid");
    if (galleryGrid) galleryGrid.innerHTML = '';
    const fotos = [];
    const isAdmin = firebase.auth().currentUser; 

    snapshot.forEach((child) => {
        const data = child.val();
        fotos.push({ key: child.key, ...data });
        if (galleryGrid) {
            const card = document.createElement("div");
            card.className = "photo-card";
            card.innerHTML = `
                <img src="${data.image}" onclick="openLightbox('${data.image}', '${data.legenda}')">
                <button class="delete-photo" style="display: ${isAdmin ? 'block' : 'none'};" onclick="event.stopPropagation(); deletePhoto('${child.key}')">✕</button>
            `;
            galleryGrid.appendChild(card);
        }
    });
    renderizarLinhaDoTempo(fotos);
});

// --- MÚSICA ---
const audio = document.getElementById("romanticAudio");
const musicBtn = document.getElementById("music-btn");
const musicInput = document.getElementById("musicInput");
const musicNameLabel = document.getElementById("music-name");

database.ref('musica_tema').on('value', (snapshot) => {
    const musicData = snapshot.val();
    if (musicData) { audio.src = musicData.file; musicNameLabel.innerText = musicData.name; }
});

musicInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        musicNameLabel.innerText = "Enviando música...";
        const reader = new FileReader();
        reader.onload = (ev) => {
            database.ref('musica_tema').set({ file: ev.target.result, name: file.name })
            .then(() => musicNameLabel.innerText = file.name);
        };
        reader.readAsDataURL(file);
    }
});

musicBtn.onclick = () => {
    if (audio.paused) {
        audio.play().then(() => { musicBtn.innerText = "⏸️ Pausar"; }).catch(() => alert("Erro ao tocar música."));
    } else {
        audio.pause(); musicBtn.innerText = "▶️ Tocar";
    }
};

// --- CONTADOR ---
setInterval(() => {
    const dif = new Date() - dataInicio;
    ['days','hours','minutes','seconds'].forEach((id, idx) => {
        const values = [86400000, 3600000, 60000, 1000];
        const el = document.getElementById(id);
        if(el) el.innerText = Math.floor((idx === 0 ? dif : dif % values[idx-1]) / values[idx]).toString().padStart(2,'0');
    });
}, 1000);

// --- START OVERLAY (Ajustado para a saudação funcionar) ---
document.getElementById("start-btn").onclick = () => {
    const intro = document.getElementById("intro-overlay");
    const subtext = document.querySelector(".intro-subtext");
    
    // 1. Define a saudação primeiro
    const hora = new Date().getHours();
    let saudacao = "";
    if (hora >= 5 && hora < 12) {
        saudacao = "Bom dia, meu bem! ✨";
    } else if (hora >= 12 && hora < 18) {
        saudacao = "Boa tarde amor! 💜";
    } else {
        saudacao = "Boa noite princesa... 🌙";
    }

    // 2. Aplica a saudação no texto da tela de entrada
    if (subtext) {
        subtext.innerText = saudacao;
    }

    // 3. Espera um pouquinho para a pessoa ler e depois inicia o sumiço
    setTimeout(() => {
        intro.style.opacity = "0";
        
        setTimeout(() => {
            intro.remove();
            
            // Inicia o contador para a surpresa (180 segundos conforme seu código)
            setTimeout(() => {
                const special = document.getElementById("special-transition");
                if (special) {
                    special.classList.add("active");
                    clearInterval(heartInterval);
                    heartInterval = setInterval(() => createHeart(true), 100);
                    setTimeout(() => special.classList.add("show-text"), 500);
                    
                    setTimeout(() => {
                        special.classList.remove("active");
                        const finalContainer = document.getElementById("final-action-container");
                        if (finalContainer) finalContainer.style.display = "block";
                        clearInterval(heartInterval);
                        heartInterval = setInterval(() => createHeart(false), 600);
                    }, 7000);
                }
            }, 180000);
        }, 1000);
    }, 5000); // Tempo para ela ler o "Bom dia" antes de sumir
};

// Envelope
document.getElementById("envelope").onclick = function() {
    this.classList.toggle("open");
    const target = document.getElementById("typewriter-text");
    if(this.classList.contains("open")) {
        target.innerText = "Não importa a distância ou o tempo longe... Você é minha melhor escolha todos os dias. A cada dia me apaixono mais e mais, e nunca vou te deixar, Eu te amo. ❤️";
    }
};

// --- LOGICA DE UPLOAD ---
document.getElementById("imageInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    const dataEscolhida = document.getElementById("eventDate").value;
    const legenda = document.getElementById("imageCaption").value;
    if (!dataEscolhida) { alert("Selecione a data!"); e.target.value = ""; return; }
    if (file) {
        compressImage(file, (compressedBase64) => {
            database.ref('galeria').push({ 
                image: compressedBase64, timestamp: Date.now(),
                dataEscolhida: dataEscolhida, legenda: legenda || "Mais um capítulo... ✨"
            }).then(() => alert("Foto adicionada! ✨")).catch(() => alert("Acesso Negado."));
        });
    }
});

// --- COMANDO SECRETO E LOGIN ---
let inputBuffer = "";
const secretCode = "amor"; 

document.addEventListener('keydown', (e) => {
    inputBuffer += e.key.toLowerCase();
    if (inputBuffer.length > secretCode.length) {
        inputBuffer = inputBuffer.substring(inputBuffer.length - secretCode.length);
    }
    if (inputBuffer === secretCode) {
        document.getElementById('admin-login-modal').style.display = 'flex';
        inputBuffer = ""; 
    }
});

document.getElementById("btn-login-confirm").onclick = () => {
    const email = document.getElementById("admin-email").value;
    const password = document.getElementById("admin-password").value;
    const errorMsg = document.getElementById("login-error");

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            document.getElementById("admin-login-modal").style.display = "none";
            alert("Acesso Admin liberado! ✨");
            // Nota: O onAuthStateChanged vai cuidar de mostrar os botões automaticamente
        })
        .catch(() => errorMsg.style.display = "block");
};

document.getElementById("btn-login-close").onclick = () => {
    document.getElementById("admin-login-modal").style.display = "none";
};

// --- OUTRAS FUNÇÕES ---
window.deletePhoto = (key) => { if(confirm("Apagar?")) database.ref('galeria/' + key).remove(); };

document.getElementById("final-surprise-btn").onclick = () => {
    document.getElementById("proposal-modal").classList.add("show");
};

const btnNo = document.getElementById("btn-no");
const moverBotao = () => {
    const card = document.getElementById("card-pergunta");
    btnNo.style.position = "absolute";
    btnNo.style.left = Math.max(10, Math.random() * (card.clientWidth - 80)) + "px";
    btnNo.style.top = Math.max(10, Math.random() * (card.clientHeight - 40)) + "px";
};
btnNo.addEventListener("mouseover", moverBotao);
btnNo.onclick = () => { document.getElementById("error-msg").style.display = "block"; };

document.getElementById("btn-yes").onclick = () => {
    document.getElementById("card-pergunta").style.display = "none";
    document.getElementById("card-eba").style.display = "block";
    for(let i=0; i<15; i++) { setTimeout(() => createHeart(true), i * 150); }
};

document.getElementById("btn-close-final").onclick = () => {
    document.getElementById("proposal-modal").classList.remove("show");
};

document.getElementById("theme-toggle").onclick = () => document.body.classList.toggle("light-mode");

const btnSaudade = document.getElementById("saudade-btn");
if(btnSaudade) {
    btnSaudade.onclick = () => {
        const msgs = ["Você é meu lugar favorito. 💜", "A distância só existe no mapa.", "Meu coração é seu."];
        document.getElementById("saudade-msg").innerText = msgs[Math.floor(Math.random() * msgs.length)];
    };
}

function verificarCartaFuturo() {
    const hoje = new Date();
    if (hoje >= new Date(2026, 9, 18)) {
        document.getElementById("future-content").innerHTML = `<p>"Sobrevivemos! Te amo cada dia mais."</p>`;
    }
}
verificarCartaFuturo();

// BLOQUEIOS FINAIS
document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = function(e) {
    if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && e.keyCode == 73)) return false;
};
