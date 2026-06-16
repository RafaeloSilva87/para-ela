// Surpresas
const surpresas = [
    "Você é a melhor decisão que já tomei!",
    "Cada dia com você é um presente!",
    "Seu sorriso vale mais que tudo!",
    "Eu quero envelhecer ao seu lado!",
    "Você é meu lugar favorito!",
    "Te amo mais do que palavras podem dizer!"
];

// Embaralha as mensagens uma vez para não repetir
const surpresasEmbaralhadas = [...surpresas].sort(() => Math.random() - 0.5);

// Monta cada raspadinha: texto escondido por baixo de uma camada raspável
function criarRaspadinhas() {
    const container = document.getElementById('raspadinhas');

    surpresasEmbaralhadas.forEach((texto, i) => {
        const card = document.createElement('div');
        card.className = 'raspadinha';
        card.innerHTML = `
            <div class="raspadinha-texto">${texto}</div>
            <canvas width="170" height="170"></canvas>
            <span class="raspadinha-dica">raspe aqui</span>
        `;
        container.appendChild(card);

        const canvas = card.querySelector('canvas');
        const dica = card.querySelector('.raspadinha-dica');
        const ctx = canvas.getContext('2d');

        const cores = ['#ffd3e2', '#fff1c2', '#cdeede'];
        ctx.fillStyle = cores[i % cores.length];
        ctx.beginPath();
        ctx.arc(85, 85, 85, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#4a2e44';
        ctx.font = '700 16px Quicksand';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('♥', 85, 85);

        let raspando = false;
        let revelado = false;

        function raspar(x, y) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 16, 0, Math.PI * 2);
            ctx.fill();
        }

        function posicaoRelativa(evento) {
            const rect = canvas.getBoundingClientRect();
            return {
                x: ((evento.clientX - rect.left) / rect.width) * canvas.width,
                y: ((evento.clientY - rect.top) / rect.height) * canvas.height
            };
        }

        function verificarRevelado() {
            if (revelado) return;
            const dados = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let transparentes = 0;
            for (let p = 3; p < dados.length; p += 4) {
                if (dados[p] === 0) transparentes++;
            }
            const proporcao = transparentes / (canvas.width * canvas.height);
            if (proporcao > 0.5) {
                revelado = true;
                canvas.style.transition = 'opacity 0.4s ease';
                canvas.style.opacity = '0';
                dica.style.display = 'none';
                setTimeout(() => canvas.remove(), 400);
            }
        }

        canvas.addEventListener('pointerdown', (e) => {
            raspando = true;
            dica.style.display = 'none';
            const { x, y } = posicaoRelativa(e);
            raspar(x, y);
        });

        canvas.addEventListener('pointermove', (e) => {
            if (!raspando) return;
            const { x, y } = posicaoRelativa(e);
            raspar(x, y);
            verificarRevelado();
        });

        canvas.addEventListener('pointerup', () => {
            raspando = false;
            verificarRevelado();
        });

        canvas.addEventListener('pointerleave', () => {
            raspando = false;
        });
    });
}

criarRaspadinhas();

// Lightbox - abrir foto em tela cheia
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');

document.querySelectorAll('.foto').forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        const caption = this.querySelector('p').textContent;

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = caption;
        lightbox.classList.add('active');
        history.pushState({ lightboxAberto: true }, '');
    });
});

function fecharLightbox() {
    lightbox.classList.remove('active');
    if (history.state && history.state.lightboxAberto) {
        history.back();
    }
}

// No celular, o botão "voltar" só fecha a foto em vez de sair do site
window.addEventListener('popstate', function() {
    lightbox.classList.remove('active');
});

lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
        fecharLightbox();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        fecharLightbox();
    }
});

// Música de fundo
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const musicHint = document.getElementById('music-hint');

function esconderAvisoMusica() {
    musicHint.classList.add('escondido');
}

function atualizarBotaoMusica() {
    if (bgMusic.paused) {
        musicToggle.classList.remove('playing');
        musicToggle.classList.add('paused');
    } else {
        musicToggle.classList.remove('paused');
        musicToggle.classList.add('playing');
        esconderAvisoMusica();
    }
}

function tentarTocarMusica() {
    bgMusic.play().then(atualizarBotaoMusica).catch(() => {
        atualizarBotaoMusica();
    });
}

tentarTocarMusica();

// Some o aviso depois de um tempo, mesmo que ela não toque a música ainda
setTimeout(esconderAvisoMusica, 7000);

document.addEventListener('click', function iniciarNoPrimeiroClique() {
    esconderAvisoMusica();
    if (bgMusic.paused) {
        bgMusic.play().then(atualizarBotaoMusica).catch(() => {});
    }
    document.removeEventListener('click', iniciarNoPrimeiroClique);
}, { once: true });

musicToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    esconderAvisoMusica();
    if (bgMusic.paused) {
        bgMusic.play().then(atualizarBotaoMusica).catch(() => {});
    } else {
        bgMusic.pause();
        atualizarBotaoMusica();
    }
});
