// 1. DADOS
const dataInicio = new Date(2024, 9, 18, 20, 20, 0); 
const textoCarta = "Não importa a distância ou o tempo, meu coração sempre soube o caminho de volta para você. Você é minha melhor escolha todos os dias. Obrigado por ser meu lar e minha paz. Eu te amo muito! ❤️";

const historia = [
    { data: "18/09/2024", texto: "Nosso primeiro beijo. Onde tudo realmente começou... " },
    { data: "18/10/2024", texto: "O início oficial de tudo. ✨" },
    { data: "18/11/2024", texto: "Nosso primeiro mês. Enfrentamos a distância. 💔" },
    { data: "20/02/2025", texto: "Eu voltei para você! Finalmente juntos de novo. 🏠❤️" },
    { data: "Hoje", texto: "Construindo nosso futuro um bit de cada vez. 💻❤️" }
];

// 2. TIMELINE COM ANIMAÇÃO
const timelineContainer = document.getElementById("main-timeline");
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
    });
}, { threshold: 0.1 });

historia.forEach(item => {
    const div = document.createElement("div");
    div.className = "timeline-item";
    div.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-content">
            <strong style="color: var(--accent-purple);">${item.data}</strong>
            <p style="margin-top: 5px; font-size: 0.9rem;">${item.texto}</p>
        </div>
    `;
    timelineContainer.appendChild(div);
    observer.observe(div);
});

// 3. CRONÔMETRO
function atualizarContador() {
    const dif = new Date() - dataInicio;
    document.getElementById("days").innerText = Math.floor(dif / 86400000).toString().padStart(2, '0');
    document.getElementById("hours").innerText = Math.floor((dif % 86400000) / 3600000).toString().padStart(2, '0');
    document.getElementById("minutes").innerText = Math.floor((dif % 3600000) / 60000).toString().padStart(2, '0');
    document.getElementById("seconds").innerText = Math.floor((dif % 60000) / 1000).toString().padStart(2, '0');
}
setInterval(atualizarContador, 1000);
atualizarContador();

// 4. LÓGICA DA CARTINHA
const envelope = document.getElementById("envelope");
const target = document.getElementById("typewriter-text");
let typingTimeout;

envelope.addEventListener("click", () => {
    const isOpen = envelope.classList.toggle("open");
    clearTimeout(typingTimeout);
    target.innerHTML = "";
    if (isOpen) {
        let i = 0;
        const type = () => {
            if (i < textoCarta.length) {
                target.innerHTML += textoCarta.charAt(i++);
                typingTimeout = setTimeout(type, 50);
            }
        };
        setTimeout(type, 800);
    }
});

// 5. CORAÇÕES FLUTUANTES (EFEITO VISUAL MANTIDO)
function createHeart() {
    const container = document.getElementById("particles-container");
    if (!container) return;
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.innerHTML = ['💜', '💙', '✨', '❤️'][Math.floor(Math.random() * 4)];
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (Math.random() * 20 + 15) + "px";
    heart.style.animationDuration = (Math.random() * 3 + 3) + "s"; // entre 3 e 6 segundos
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 6000); // remove do HTML depois que sobe
}
setInterval(createHeart, 400); // Cria um coração novo a cada 400ms

// 6. GALERIA DE FOTOS (FUNCIONANDO)
document.getElementById("imageInput").onchange = (e) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
        const card = document.createElement("div");
        card.className = "photo-card";
        card.innerHTML = `<button class="delete-photo">&times;</button><img src="${ev.target.result}">`;
        
        // Botão de deletar foto
        card.querySelector(".delete-photo").onclick = () => card.remove();
        
        document.getElementById("galleryGrid").appendChild(card);
    };
    if(e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
    }
};

// 7. SURPRESA DOS 50 SEGUNDOS E INÍCIO
function dispararSurpresaEspecial() {
    const transitionOverlay = document.getElementById("special-transition");
    const finalContainer = document.getElementById("final-action-container");

    transitionOverlay.classList.add("active");

    setTimeout(() => {
        transitionOverlay.classList.add("show-text");
    }, 1000);

    setTimeout(() => {
        transitionOverlay.classList.remove("active");
        transitionOverlay.classList.remove("show-text");
        
        // Revela o botão da última pergunta
        finalContainer.style.display = "block";
        finalContainer.scrollIntoView({ behavior: 'smooth' });
    }, 8000);
}

document.getElementById("start-btn").onclick = () => {
    // Remove tela inicial
    const intro = document.getElementById("intro-overlay");
    intro.style.opacity = "0";
    setTimeout(() => intro.remove(), 1000);

    // Tenta tocar a música se houver
    const audio = document.getElementById("romanticAudio");
    audio.play().catch(() => console.log("Música aguardando interação."));
    document.getElementById("music-btn").innerText = "⏸️ Pausar";

    // Inicia a contagem para a surpresa (50 segundos)
    setTimeout(dispararSurpresaEspecial, 50000); 
};

// 8. PEDIDO FINAL (MODAL E BOTÕES)
const modal = document.getElementById("proposal-modal");
const btnNo = document.getElementById("btn-no");
const btnYes = document.getElementById("btn-yes");

document.getElementById("final-surprise-btn").onclick = () => modal.classList.add("show");

btnNo.onclick = () => {
    document.getElementById("error-msg").style.display = "block";
    btnNo.style.animation = "shake 0.3s ease";
    setTimeout(() => btnNo.style.animation = "", 300);
};

btnYes.onclick = () => {
    document.querySelector(".proposal-card").innerHTML = `
        <h2 style="color: #22c55e;">Eba! ❤️</h2>
        <p style="color: #333; font-weight: 600;">Sabia que você diria sim! Prometo te fazer a pessoa mais feliz do mundo.</p>
        <div style="font-size: 3rem; margin-top: 15px;">🥰✨</div>
    `;
    // Explode mais corações na tela
    for(let i=0; i<40; i++) setTimeout(createHeart, i*50);
};

// 9. MÚSICA E TEMA
const audio = document.getElementById("romanticAudio");
document.getElementById("music-btn").onclick = () => {
    if (audio.paused) {
        audio.play();
        document.getElementById("music-btn").innerText = "⏸️ Pausar";
    } else {
        audio.pause();
        document.getElementById("music-btn").innerText = "▶️ Tocar";
    }
};

document.getElementById("musicInput").onchange = (e) => {
    if(e.target.files[0]){
        audio.src = URL.createObjectURL(e.target.files[0]);
        document.getElementById("music-name").innerText = e.target.files[0].name;
        audio.play();
        document.getElementById("music-btn").innerText = "⏸️ Pausar";
    }
};

document.getElementById("theme-toggle").onclick = () => {
    const isLight = document.body.classList.toggle("light-mode");
    document.getElementById("theme-toggle").innerText = isLight ? "☀️" : "🌙";
};