// Estado padrão da página (código 501, cinza))

var padrao = {
    id: '501',
    cor: '#9E9E9E',
    msg: 'Hm... essa função ainda não existe'
};

// Elementos do HTML
var fundoBase = document.getElementById('bg-base');
var fundoTinta = document.getElementById('bg-ripple');
var barra = document.querySelector('.barra-navegacao');

// Controle interno
var corAtual = padrao.cor;
var timerVolta = null;
var aoFim = null;

// Fixa a cor visível quando a animação é interrompida
function fixarCor() {
    if (!aoFim) return;

    fundoTinta.removeEventListener('transitionend', aoFim);
    aoFim = null;
    corAtual = fundoTinta.style.backgroundColor;
    fundoBase.style.backgroundColor = corAtual;
    fundoTinta.className = 'tinta-parada';
}

// Anima o fundo
function pintarFundo(cor, voltar, callback) {
    if (cor === corAtual && !aoFim) {
        if (callback) callback();
        return;
    }

    fixarCor();

    if (cor === corAtual) {
        if (callback) callback();
        return;
    }

    function terminar() {
        fundoTinta.removeEventListener('transitionend', terminar);
        aoFim = null;
        fundoTinta.className = 'tinta-parada';
        corAtual = cor;

        if (!voltar) {
            fundoBase.style.backgroundColor = cor;
        }

        if (callback) callback();
    }

    aoFim = terminar;
    fundoTinta.addEventListener('transitionend', terminar);

    if (voltar) {
        fundoBase.style.backgroundColor = cor;
        fundoTinta.style.backgroundColor = corAtual;
        fundoTinta.className = 'tinta-cheia';

        requestAnimationFrame(function () {
            fundoTinta.className = 'tinta-fecha';
        });

        return;
    }

    fundoTinta.style.backgroundColor = cor;
    fundoTinta.className = 'tinta-parada';

    requestAnimationFrame(function () {
        fundoTinta.className = 'tinta-abre';
    });
}

// Troca código, mensagem e imagem do erro
function trocarConteudo(id, msg) {
    var img = document.getElementById('imagem');

    img.classList.add('trocando');
    document.getElementById('codigo').textContent = id;
    document.getElementById('mensagem').textContent = msg;

    img.src = 'assets/' + id + '.svg';

    img.onload = function () {
        img.classList.remove('trocando');
    };
}

// Volta ao padrão
function voltarPadrao() {
    pintarFundo(padrao.cor, true, function () {
        trocarConteudo(padrao.id, padrao.msg);
    });
}

// Cancela o timer
function cancelarVolta() {
    clearTimeout(timerVolta);
    timerVolta = null;
}

// Agenda voltar ao padrão após 2 segundos
function agendarVolta() {
    cancelarVolta();
    timerVolta = setTimeout(voltarPadrao, 2000);
}

// Início da página
fundoBase.style.backgroundColor = padrao.cor;
trocarConteudo(padrao.id, padrao.msg);

// Hover nos botões
document.querySelectorAll('.btn-hover').forEach(function (btn) {
    btn.addEventListener('mouseenter', function () {
        cancelarVolta();
        trocarConteudo(btn.dataset.id, btn.dataset.message);
        pintarFundo(btn.dataset.color);
    });
});

barra.addEventListener('mouseenter', cancelarVolta);
barra.addEventListener('mouseleave', agendarVolta);
