// Operadores fixos da cartela
const operadores = [
    "×", "+", "÷",
    "÷", "-", "×",
    "+", "×", "-"
];

let numerosSorteados = [];
const painel = document.getElementById("numerosSorteados");

// Salvar números digitados pelo jogador
document.getElementById("salvarNumeros").onclick = () => {
    const entradas = document.querySelectorAll(".numEntrada");

    numerosSorteados = [];
    entradas.forEach(inp => {
        if (inp.value !== "") numerosSorteados.push(Number(inp.value));
    });

    if (numerosSorteados.length !== 9) {
        alert("Você precisa preencher exatamente 9 números!");
        return;
    }

    painel.innerHTML = "<b>Números Inseridos:</b> " + numerosSorteados.join(" | ");

    alert("Números salvos! Agora você pode jogar.");
};

// Monta a cartela
const cartela = document.getElementById("cartela");
operadores.forEach((op, i) => {
    let div = document.createElement("div");
    div.className = "casa";
    div.dataset.op = op;

    // operador em cima + espaço para equação
    div.innerHTML = `
        <div class="operador">${op}</div>
        <div class="equacao" id="eq${i}"></div>
    `;

    div.onclick = () => abrirModal(i, op);
    cartela.appendChild(div);
});

// Modal para digitar o valor da equação
const modal = document.getElementById("modal");
const valor1 = document.getElementById("valor1");
const valor2 = document.getElementById("valor2");
const opSimbolo = document.getElementById("opSimbolo");

let casaSelecionada = null;

//Autoexplicativo, mas é para abrir o modal
function abrirModal(indice, operador) {
    if (numerosSorteados.length !== 9) {
        alert("Digite e salve os 9 números sorteados antes de jogar.");
        return;
    }

    casaSelecionada = indice;

    document.getElementById("operadorEscolhido").innerText =
        "Operador escolhido: " + operador;

    opSimbolo.innerText = operador;

    valor1.value = "";
    valor2.value = "";

    modal.style.display = "block";
}

document.getElementById("fechar").onclick = () => {
    modal.style.display = "none";
};

// Confirmar equação
document.getElementById("confirmar").onclick = () => {
    let n1 = Number(valor1.value);
    let n2 = Number(valor2.value);
    let op = operadores[casaSelecionada];

    let resultado;

    switch (op) {
        case "+": resultado = n1 + n2; break;
        case "-": resultado = n1 - n2; break;
        case "×": resultado = n1 * n2; break;
        case "÷":
            if (n2 === 0) { 
                alert("Divisão por zero não é válida!"); 
                return; 
            }
            resultado = n1 / n2;
            break;
    }

    // exibe equação dentro da célula
    let eqTexto = `${n1} ${op} ${n2} = ${resultado}`;
    document.getElementById(`eq${casaSelecionada}`).innerText = eqTexto;

    let casa = document.getElementsByClassName("casa")[casaSelecionada];

    if (numerosSorteados.includes(resultado)) {
        casa.classList.add("ok");
    } else {
        casa.classList.remove("ok");
        alert("❌ Resultado NÃO está entre os números inseridos.");
    }

    modal.style.display = "none";
};
