// FIREBASE
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

// DADOS (DATAS NUNCA MUDAM)
const dataInicio = new Date(2024, 9, 18, 20, 20, 0); 
const historia = [
    { data: "18/09/2024", texto: "Nosso primeiro beijo. Onde tudo realmente começou..." },
    { data: "18/10/2024", texto: "O início oficial de tudo. ✨" },
    { data: "18/11/2024", texto: "Nosso primeiro mês. Enfrentamos a distância. 💔" },
    { data: "20/02/2025", texto: "Eu voltei para você! Finalmente juntos de novo. 🏠❤️" },
    { data: "Hoje", texto: "Construindo nosso futuro um bit de cada vez. 💻❤️" }
];

// GERAR TIMELINE
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
            <strong style="color: var(--accent-purple);">${item.data}</strong>
            <p style="margin-top: 5px;">${item.texto}</p>
        </div>`;
    tlContainer.appendChild(div);
    observer.observe(div);
});

// CRONÔMETRO
setInterval(() => {
    const dif = new Date() - dataInicio;
    document.getElementById("days").innerText = Math.floor(dif / 86400000).toString().padStart(2, '0');
    document.getElementById("hours").innerText = Math.floor((dif % 86400000) / 3600000).toString().padStart(2, '0');
    document.getElementById("minutes").innerText = Math.floor((dif % 3600000) / 60000).toString().padStart(2, '0');
    document.getElementById("seconds").innerText = Math.floor((dif % 60000) / 1000).toString().padStart(2, '0');
}, 1000);

// CARTA
const textoCarta = "Não importa a distância ou o tempo, meu coração sempre soube o caminho de volta para você. Você é minha melhor escolha todos os dias. Eu te amo muito! ❤️";
document.getElementById("envelope").onclick = function() {
    this.classList.toggle("open");
    const target = document.getElementById("typewriter-text");
    if(this.classList.contains("open")) {
        target.innerHTML = ""; let i = 0;
        const type = () => { if(i < textoCarta.length) { target.innerHTML += textoCarta.charAt(i++); setTimeout(type, 50); } };
        setTimeout(type, 800);
    }
};

// MÚSICA (FIX)
const audio = document.getElementById("romanticAudio");
document.getElementById("musicInput").onchange = (e) => {
    const file = e.target.files[0];
    if(file) {
        audio.src = URL.createObjectURL(file);
        document.getElementById("music-name").innerText = file.name;
        audio.play();
        document.getElementById("music-btn").innerText = "⏸️ Pausar";
    }
};
document.getElementById("music-btn").onclick = () => {
    if(audio.paused) { audio.play(); document.getElementById("music-btn").innerText = "⏸️ Pausar"; }
    else { audio.pause(); document.getElementById("music-btn").innerText = "▶️ Tocar"; }
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
    div.style.cssText = "position:relative; border-radius:10px; overflow:hidden; border:1px solid var(--accent-purple); height:150px;";
    div.innerHTML = `<img src="${snap.val().url}" style="width:100%; height:100%; object-fit:cover;">
                     <button onclick="database.ref('galeria/${snap.key}').remove()" style="position:absolute; top:5px; right:5px; background:rgba(0,0,0,0.5); color:white; border:none; border-radius:50%; cursor:pointer;">✕</button>`;
    document.getElementById("galleryGrid").appendChild(div);
});
database.ref('galeria').on('child_removed', (snap) => document.getElementById(snap.key).remove());

// INÍCIO E SURPRESA (50s)
document.getElementById("start-btn").onclick = () => {
    const intro = document.getElementById("intro-overlay");
    intro.style.opacity = "0";
    setTimeout(() => intro.remove(), 1000);
    audio.play().catch(() => {});

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

// MODAL
document.getElementById("final-surprise-btn").onclick = () => document.getElementById("proposal-modal").classList.add("show");
document.getElementById("btn-no").onclick = () => document.getElementById("error-msg").style.display = "block";
document.getElementById("btn-yes").onclick = () => {
    document.querySelector(".proposal-card").innerHTML = "<h2>Sabia que diria sim! ❤️</h2>";
};

// CORAÇÕES
setInterval(() => {
    const h = document.createElement("div");
    h.className = "floating-heart"; h.innerHTML = "💜";
    h.style.cssText = `position:fixed; bottom:-20px; left:${Math.random()*100}vw; animation:floatUp 4s linear forwards; pointer-events:none; z-index:-1;`;
    document.getElementById("particles-container").appendChild(h);
    setTimeout(() => h.remove(), 4000);
}, 400);
