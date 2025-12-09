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
        let val = Number(inp.value);
        if (inp.value !== "" && val >= 1 && val <= 1000) numerosSorteados.push(val);
    });

    if (numerosSorteados.length !== 9) {
        alert("Você precisa preencher exatamente 9 números entre 1 e 1000!");
        return;
    }

    atualizarPainelNumeros();
    alert("Números salvos! Agora você pode jogar.");
};

// Função para riscar os números já utilizados
function atualizarPainelNumeros() {
    // Coletar todos os resultados já usados nas equações
    let usados = [];
    for (let i = 0; i < operadores.length; i++) {
        let eqDiv = document.getElementById(`eq${i}`);
        if (eqDiv && eqDiv.innerText.trim() !== "") {
            let eqText = eqDiv.innerText;
            let partes = eqText.split("=");
            if (partes.length === 2) {
                let valor = Number(partes[1].trim());
                usados.push(valor);
            }
        }
    }
    let html = '<b>Números Inseridos:</b> ' + numerosSorteados.map(n => usados.includes(n) ? `<span style="text-decoration:line-through;color:#888">${n}</span>` : n).join(' | ');
    painel.innerHTML = html;
}

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

// Modal de Regras
const modalRegras = document.getElementById("modalRegras");
const btnRegras = document.getElementById("btnRegras");
const fecharRegras = document.getElementById("fecharRegras");
const okRegras = document.getElementById("ok-regras");

// Abrir modal de regras ao clicar no botão
btnRegras.onclick = () => {
    modalRegras.style.display = "block";
};

// Fechar modal de regras
fecharRegras.onclick = () => {
    modalRegras.style.display = "none";
};

okRegras.onclick = () => {
    modalRegras.style.display = "none";
};

// Fechar modal de regras se clicar fora do conteúdo
modalRegras.onclick = (e) => {
    if (e.target === modalRegras) {
        modalRegras.style.display = "none";
    }
};

// Mostrar modal de regras ao carregar a página
window.addEventListener("load", () => {
    modalRegras.style.display = "block";
});

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
    
    // Validar se são números inteiros
    if (!Number.isInteger(n1) || !Number.isInteger(n2)) {
        alert("Não são permitidos números com vírgula!");
        return;
    }
    
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

    // Verifica se já existe esse resultado em outra célula
    let repetido = false;
    for (let i = 0; i < operadores.length; i++) {
        if (i !== casaSelecionada) {
            let eqDiv = document.getElementById(`eq${i}`);
            if (eqDiv && eqDiv.innerText.trim() !== "") {
                let eqText = eqDiv.innerText;
                let partes = eqText.split("=");
                if (partes.length === 2) {
                    let valor = Number(partes[1].trim());
                    if (valor === resultado) {
                        repetido = true;
                        break;
                    }
                }
            }
        }
    }
    if (repetido) {
        alert("Já existe uma célula com esse resultado. Escolha outra operação!");
        return;
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

    atualizarPainelNumeros();
    modal.style.display = "none";
};
