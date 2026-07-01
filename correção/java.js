alert("JS carregou");

console.log("JS iniciado");

var fundoBase = document.getElementById('bg-base');
var fundotinta = document.getElementById('bg-ripple');
var barra = document.querySelector('.barra-navegacao');

console.log(fundoBase);
console.log(fundoTinta);
console.log(barra);
// Estado padrão da página (código 501, cinza)
var padrao = {
    id: '501',
    cor: '#9E9E9E',
    msg: 'Hm... essa função ainda não existe'
};

// Elementos do HTML
var fundoBase = document.getElementById('bg-base');
var fundotinta = document.getElementById('bg-ripple');
var barra = document.querySelector('.barra-navegacao');

// Controle interno
var corAtual = padrao.cor;
var timerVolta = null;
var aoFim = null;

// Fixa a cor visível quando a animação é interrompida
function fixarCor() {
    if (!aoFim) return;

    fundotinta.removeEventListener('transitionend', aoFim);
    aoFim = null;
    corAtual = fundotinta.style.backgroundColor;
    fundoBase.style.backgroundColor = corAtual;
    fundotinta.className = 'tinta-parada';
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
        fundotinta.removeEventListener('transitionend', terminar);
        aoFim = null;
        fundotinta.className = 'tinta-parada';
        corAtual = cor;

        if (!voltar) {
            fundoBase.style.backgroundColor = cor;
        }

        if (callback) callback();
    }

    aoFim = terminar;
    fundotinta.addEventListener('transitionend', terminar);

    if (voltar) {
        fundoBase.style.backgroundColor = cor;
        fundotinta.style.backgroundColor = corAtual;
        fundotinta.className = 'tinta-cheia';

        requestAnimationFrame(function () {
            fundotinta.className = 'tinta-fecha';
        });

        return;
    }

    fundotinta.style.backgroundColor = cor;
    fundotinta.className = 'tinta-parada';

    requestAnimationFrame(function () {
        fundotinta.className = 'tinta-abre';
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

