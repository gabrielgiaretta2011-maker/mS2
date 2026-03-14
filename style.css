:root {
    --bg-color: #0f172a;
    --card-bg: rgba(30, 41, 59, 0.7);
    --text-color: #f1f5f9;
    --accent-purple: #a78bfa;
    --accent-blue: #38bdf8;
    --glass-border: rgba(255, 255, 255, 0.1);
}

body.light-mode {
    --bg-color: #f8fafc;
    --card-bg: rgba(255, 255, 255, 0.8);
    --text-color: #1e293b;
    --accent-purple: #7c3aed;
    --accent-blue: #0ea5e9;
    --glass-border: rgba(0, 0, 0, 0.1);
}

body { margin: 0; font-family: 'Poppins', sans-serif; background-color: var(--bg-color); color: var(--text-color); overflow-x: hidden; transition: 0.5s; }

/* Intro */
#intro-overlay { position: fixed; inset: 0; background: radial-gradient(circle, #1e293b 0%, #0f172a 100%); display: flex; justify-content: center; align-items: center; z-index: 9999; }
.intro-card { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(15px); padding: 40px; border-radius: 30px; text-align: center; border: 1px solid rgba(255,255,255,0.2); }
#start-btn { background: var(--accent-purple); color: white; border: none; padding: 12px 25px; border-radius: 50px; cursor: pointer; font-weight: bold; margin-top: 20px; }

#particles-container { position: fixed; inset: 0; pointer-events: none; z-index: -1; }

.container { width: 95%; max-width: 800px; margin: 20px auto; background: var(--card-bg); backdrop-filter: blur(15px); border-radius: 20px; padding: 30px; border: 1px solid var(--glass-border); }
.title { font-family: 'Dancing Script', cursive; font-size: 4rem; color: var(--accent-purple); text-align: center; margin-bottom: 0; }
.section-title { font-family: 'Dancing Script', cursive; font-size: 2.5rem; text-align: center; margin: 40px 0 20px; }

/* Timer */
#timer { display: flex; justify-content: center; gap: 15px; margin-bottom: 30px; }
.time-block { border: 1px solid var(--accent-purple); padding: 10px; border-radius: 12px; text-align: center; min-width: 70px; background: rgba(167,139,250,0.1); }
.time-block span { display: block; font-size: 1.8rem; font-weight: bold; color: var(--accent-purple); }

/* Envelope */
.envelope-wrapper { height: 180px; margin-bottom: 100px; display: flex; justify-content: center; position: relative; }
#envelope { position: relative; width: 280px; height: 180px; background: #7c3aed; border-radius: 0 0 5px 5px; cursor: pointer; }
.flap { position: absolute; top: 0; border-left: 140px solid transparent; border-right: 140px solid transparent; border-top: 110px solid #7c3aed; transform-origin: top; transition: 0.4s; z-index: 3; }
.pocket { position: absolute; bottom: 0; border-left: 140px solid #a78bfa; border-right: 140px solid #a78bfa; border-bottom: 90px solid #6d28d9; border-top: 90px solid transparent; z-index: 4; }
.letter { position: absolute; background: #fff; width: 90%; height: 80%; left: 5%; top: 10%; transition: 0.6s; z-index: 2; opacity: 0; padding: 20px; box-sizing: border-box; overflow-y: auto; }
#envelope.open .flap { transform: rotateX(180deg); z-index: 1; }
#envelope.open .letter { transform: translateY(-160px); width: 400px; height: 450px; left: -60px; opacity: 1; z-index: 10; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
.letter-text { color: #333; font-style: italic; line-height: 1.5; }

/* Timeline Animada */
.timeline { position: relative; padding: 20px 0; }
.timeline::before { content: ''; position: absolute; left: 50%; width: 2px; height: 100%; background: var(--accent-purple); opacity: 0.3; }
.timeline-item { width: 100%; display: flex; justify-content: center; margin-bottom: 30px; position: relative; opacity: 0; transform: translateY(30px); transition: 0.8s; }
.timeline-item.show-timeline { opacity: 1; transform: translateY(0); }
.timeline-content { width: 42%; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 15px; border: 1px solid var(--glass-border); }
.timeline-item:nth-child(even) { justify-content: flex-end; }
.timeline-item:nth-child(odd) { justify-content: flex-start; }
.timeline-dot { position: absolute; left: 50%; width: 12px; height: 12px; background: var(--accent-purple); border-radius: 50%; transform: translateX(-50%); top: 20px; }

/* Galeria */
.gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; margin-top: 20px; }
.photo-card { position: relative; border-radius: 12px; overflow: hidden; aspect-ratio: 1; border: 1px solid var(--glass-border); }
.photo-card img { width: 100%; height: 100%; object-fit: cover; }
.delete-btn { position: absolute; top: 5px; right: 5px; background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer; backdrop-filter: blur(5px); }
.upload-btn { border: 2px dashed var(--accent-purple); color: var(--accent-purple); padding: 10px 20px; border-radius: 15px; cursor: pointer; transition: 0.3s; }

/* Surpresa e Modal */
#special-transition { position: fixed; inset: 0; background: black; z-index: 10001; display: flex; justify-content: center; align-items: center; opacity: 0; pointer-events: none; transition: 1.5s; }
#special-transition.active { opacity: 1; pointer-events: auto; }
.special-name { color: white; font-family: 'Dancing Script'; font-size: 5rem; opacity: 0; transform: translateY(20px); transition: 2s; }
#special-transition.active .special-name { opacity: 1; transform: translateY(0); }

#proposal-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.9); display: none; justify-content: center; align-items: center; z-index: 10002; }
#proposal-modal.show { display: flex; }
.proposal-card { background: white; padding: 40px; border-radius: 25px; text-align: center; color: #333; max-width: 320px; }
.proposal-card button { padding: 10px 25px; margin: 10px; border-radius: 50px; border: none; font-weight: bold; cursor: pointer; }
#btn-yes { background: var(--accent-purple); color: white; }

/* UI Fixes */
.music-player { position: fixed; bottom: 20px; left: 20px; background: var(--card-bg); padding: 12px; border-radius: 15px; border: 1px solid var(--glass-border); backdrop-filter: blur(10px); z-index: 1000; }
#theme-toggle { position: fixed; bottom: 20px; right: 20px; width: 45px; height: 45px; border-radius: 50%; background: var(--accent-purple); color: white; border: none; cursor: pointer; z-index: 1000; }

@keyframes floatUp { to { transform: translateY(-110vh) rotate(360deg); opacity: 0; } }

@media (max-width: 600px) {
    .timeline::before { left: 20px; }
    .timeline-item { justify-content: flex-start !important; padding-left: 45px; }
    .timeline-content { width: 85%; }
    .timeline-dot { left: 20px !important; }
    #envelope.open .letter { width: 320px; left: -20px; }
}
