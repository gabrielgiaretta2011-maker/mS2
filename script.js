// CONFIGURAÇÃO FIREBASE
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

// DATAS DA TIMELINE (NUNCA MAIS ALTERADAS)
const historia = [
    { data: "18/09/2024", texto: "Nosso primeiro beijo. Onde tudo realmente começou... " },
    { data: "18/10/2024", texto: "O início oficial de tudo. ✨" },
    { data: "18/11/2024", texto: "Nosso primeiro mês. Enfrentamos a distância. 💔" },
    { data: "20/02/2025", texto: "Eu voltei para você! Finalmente juntos de novo. 🏠❤️" },
    { data: "Hoje", texto: "Construindo nosso futuro um bit de cada vez. 💻❤️" }
];

// GERAR TIMELINE COM DATAS EM ROXO
const tlContainer = document.getElementById("main-timeline");
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add("visible"); });
}, { threshold: 0.1 });

historia.forEach(item => {
    const div = document.createElement("div");
    div.className = "timeline-item";
    div.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-content">
            <strong style="color: var(--accent-purple); display: block; margin-bottom: 5px;">${item.data}</strong>
            <p style="margin: 0; font-size: 0.95rem;">${item.texto}</p>
        </div>`;
    tlContainer.appendChild(div);
    observer.observe(div);
});

// CRONÔMETRO
const dataInicio = new Date(2024, 9, 18, 20, 20, 0); 
setInterval(() => {
    const dif = new Date() - dataInicio;
    document.getElementById("days").innerText = Math.floor(dif / 86400000).toString().padStart(2, '0');
    document.getElementById("hours").innerText = Math.floor((dif % 86400000) / 3600000).toString().padStart(2, '0');
    document.getElementById("minutes").innerText = Math.floor((dif % 3600000) / 60000).toString().padStart(2, '0');
    document.getElementById("seconds").innerText = Math.floor((dif % 60000) / 1000).toString().padStart(2, '0');
}, 1000);

// LÓGICA DO INÍCIO E SURPRESA 50s
document.getElementById("start-btn").onclick = () => {
    document.getElementById("intro-overlay").style.opacity = "0";
    setTimeout(() => document.getElementById("intro-overlay").remove(), 1000);
    const audio = document.getElementById("romanticAudio");
    audio.play().catch(() => {});

    // Surpresa após 50 segundos
    setTimeout(() => {
        const trans = document.getElementById("special-transition");
        trans.classList.add("active");
        setTimeout(() => trans.classList.add("show-text"), 500);
        
        setTimeout(() => {
            trans.classList.remove("active");
            document.getElementById("final-action-container").style.display = "block";
            document.getElementById("final-action-container").scrollIntoView({behavior: 'smooth'});
        }, 7000);
    }, 50000); 
};

// GALERIA FIREBASE
document.getElementById("imageInput").onchange = (e) => {
    const reader = new FileReader();
    reader.onload = (ev) => database.ref('galeria').push({ url: ev.target.result });
    reader.readAsDataURL(e.target.files[0]);
};

database.ref('galeria').on('child_added', (snap) => {
    const div = document.createElement("div");
    div.className = "photo-card"; div.id = snap.key;
    div.innerHTML = `<img src="${snap.val().url}"><button class="delete-photo" onclick="database.ref('galeria/${snap.key}').remove()">✕</button>`;
    document.getElementById("galleryGrid").appendChild(div);
});
database.ref('galeria').on('child_removed', (snap) => document.getElementById(snap.key).remove());

// MÚSICA FIX
document.getElementById("musicInput").onchange = (e) => {
    const file = e.target.files[0];
    if(file) {
        document.getElementById("romanticAudio").src = URL.createObjectURL(file);
        document.getElementById("music-name").innerText = file.name;
        document.getElementById("romanticAudio").play();
    }
};

document.getElementById("music-btn").onclick = () => {
    const a = document.getElementById("romanticAudio");
    if(a.paused) { a.play(); document.getElementById("music-btn").innerText = "⏸️ Pausar"; }
    else { a.pause(); document.getElementById("music-btn").innerText = "▶️ Tocar"; }
};

// PEDIDO FINAL
document.getElementById("final-surprise-btn").onclick = () => document.getElementById("proposal-modal").classList.add("show");
document.getElementById("btn-no").onclick = () => document.getElementById("error-msg").style.display = "block";
document.getElementById("btn-yes").onclick = () => {
    document.querySelector(".proposal-card").innerHTML = "<h2 style='color:#a78bfa'>Eba! ❤️ Sabia que diria sim!</h2>";
};

// CORAÇÕES
setInterval(() => {
    const h = document.createElement("div");
    h.className = "floating-heart"; h.innerHTML = "💜";
    h.style.left = Math.random() * 100 + "vw";
    h.style.fontSize = Math.random() * 20 + 15 + "px";
    h.style.animationDuration = Math.random() * 3 + 2 + "s";
    document.getElementById("particles-container").appendChild(h);
    setTimeout(() => h.remove(), 5000);
}, 400);
