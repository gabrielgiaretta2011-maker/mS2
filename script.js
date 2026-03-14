// --- FIREBASE ---
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

// --- TIMELINE ---
const historia = [
    { data: "18/09/2024", texto: "Nosso primeiro beijo. Onde tudo realmente começou..." },
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

const timelineContainer = document.getElementById("main-timeline");
if(timelineContainer) {
    historia.forEach(item => {
        const div = document.createElement("div");
        div.className = "timeline-item";
        div.innerHTML = `<div class="timeline-dot"></div><div class="timeline-content"><strong style="color:var(--accent-purple);">${item.data}</strong><p style="margin-top:5px;">${item.texto}</p></div>`;
        timelineContainer.appendChild(div);
    });
}

// --- CRONÔMETRO ---
const dataInicio = new Date(2024, 9, 18, 20, 20, 0); 
setInterval(() => {
    const dif = new Date() - dataInicio;
    const d = document.getElementById("days");
    if(d) {
        d.innerText = Math.floor(dif / 86400000).toString().padStart(2, '0');
        document.getElementById("hours").innerText = Math.floor((dif % 86400000) / 3600000).toString().padStart(2, '0');
        document.getElementById("minutes").innerText = Math.floor((dif % 3600000) / 60000).toString().padStart(2, '0');
        document.getElementById("seconds").innerText = Math.floor((dif % 60000) / 1000).toString().padStart(2, '0');
    }
}, 1000);

// --- GALERIA E APAGAR FOTO ---
const imageInput = document.getElementById("imageInput");
const galleryGrid = document.getElementById("galleryGrid");

if(imageInput) {
    imageInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (ev) => {
            await database.ref('galeria').push({ url: ev.target.result });
        };
        reader.readAsDataURL(file);
    };
}

database.ref('galeria').on('child_added', (snap) => {
    const div = document.createElement("div");
    div.className = "photo-card";
    div.id = snap.key;
    div.innerHTML = `
        <img src="${snap.val().url}">
        <button class="delete-btn" onclick="apagarFoto('${snap.key}')">X</button>
    `;
    galleryGrid.appendChild(div);
});

database.ref('galeria').on('child_removed', (snap) => {
    const el = document.getElementById(snap.key);
    if (el) el.remove();
});

window.apagarFoto = (key) => {
    if(confirm("Tem certeza que deseja apagar essa foto?")) {
        database.ref('galeria').child(key).remove();
    }
};

// --- CORAÇÕES FLUTUANTES ---
setInterval(() => {
    const heart = document.createElement("div");
    heart.style.position = "absolute";
    heart.innerHTML = ['💜', '✨', '❤️', '💙'][Math.floor(Math.random() * 4)];
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.bottom = "-20px";
    heart.style.animation = "floatUp 4s linear forwards";
    heart.style.zIndex = "-1";
    document.getElementById("particles-container").appendChild(heart);
    setTimeout(() => heart.remove(), 4000);
}, 400);

// --- CARTA ---
const textoCarta = "Não importa a distância ou o tempo, meu coração sempre soube o caminho de volta para você. Você é minha melhor escolha todos os dias. Eu te amo muito! ❤️";
const envelope = document.getElementById("envelope");
if(envelope) {
    envelope.onclick = () => {
        const isOpen = envelope.classList.toggle("open");
        const txt = document.getElementById("typewriter-text");
        txt.innerHTML = "";
        if (isOpen) {
            let i = 0;
            const type = () => { if (i < textoCarta.length) { txt.innerHTML += textoCarta.charAt(i++); setTimeout(type, 50); } };
            setTimeout(type, 800);
        }
    };
}

// --- BOTÃO ENTRAR, MÚSICA E SURPRESA DE 50s ---
const startBtn = document.getElementById("start-btn");
if(startBtn) {
    startBtn.onclick = () => {
        document.getElementById("intro-overlay").style.display = "none";
        document.getElementById("romanticAudio").play().catch(() => {});
        
        // Contagem exata de 50 segundos para a surpresa
        setTimeout(() => {
            const trans = document.getElementById("special-transition");
            trans.classList.add("active");
            
            setTimeout(() => trans.classList.add("show-text"), 1000);
            
            // Depois de 8 segundos na tela preta, mostra o pedido
            setTimeout(() => {
                trans.classList.remove("active");
                document.getElementById("proposal-modal").classList.add("show");
            }, 8000);
            
        }, 50000); // 50000 = 50 segundos
    };
}

// --- PEDIDO FINAL (BOTÕES SIM E NÃO) ---
const btnYes = document.getElementById("btn-yes");
const btnNo = document.getElementById("btn-no");

if(btnYes) {
    btnYes.onclick = () => {
        document.querySelector(".proposal-card").innerHTML = "<h2>Sabia que diria sim! ❤️</h2><p>Te amo para sempre!</p>";
    };
}
if(btnNo) {
    btnNo.onclick = () => {
        alert("Resposta incorreta! Tente novamente. ❤️");
    };
}

// --- TEMA (MODO CLARO/ESCURO) ---
const themeToggle = document.getElementById("theme-toggle");
if(themeToggle) {
    themeToggle.onclick = () => document.body.classList.toggle("light-mode");
}
