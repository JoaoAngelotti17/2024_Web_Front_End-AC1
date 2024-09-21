function ola() {
    return 'Olá, mundo!';
}
function exercicio01(nome) {
    return `Olá, ${nome}`;
}
function divisao(numero1, numero2) {
    if(numero2 == 0) {
        return 'Não é possível dividir por zero';
    }
    else {
        return numero1 / numero2;
    }
}

module.exports = {ola, exercicio01, divisao};