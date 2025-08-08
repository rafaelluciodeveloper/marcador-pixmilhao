let meusNumeros = [];
let sorteios = {
    1: null,
    2: null,
    3: null
};

$(document).ready(function() {
    inicializarAplicacao();
});

function inicializarAplicacao() {
    configurarDragAndDrop();
    configurarInputArquivo();
    configurarInputsSorteio();
    configurarBotaoVerificacao();
    carregarDadosSalvos();
    atualizarProximosSorteios();
}

function configurarDragAndDrop() {
    const uploadArea = $('#fileUploadArea');
    const fileInput = $('#fileInput');
    
    uploadArea.on('dragover dragenter', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).addClass('dragover');
    });
    
    uploadArea.on('dragleave dragend drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass('dragover');
    });
    
    uploadArea.on('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const files = e.originalEvent.dataTransfer.files;
        if (files.length > 0) {
            processarArquivo(files[0]);
        }
    });
}

function configurarInputArquivo() {
    $('#fileInput').on('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            processarArquivo(file);
        }
    });
}

function configurarInputsSorteio() {
    $('.sorteio-input').on('input', function() {
        const maxLength = parseInt($(this).attr('maxlength'));
        const currentLength = $(this).val().length;
        
        if (currentLength >= maxLength) {
            const nextInput = $(this).next('.sorteio-input');
            if (nextInput.length > 0) {
                nextInput.focus();
            }
        }
    });
    
    $('.sorteio-input').on('keypress', function(e) {
        if (e.which < 48 || e.which > 57) {
            e.preventDefault();
        }
    });
    
    $('.sorteio-input').on('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            const prevInput = $(this).prev('.sorteio-input');
            if (prevInput.length > 0) {
                prevInput.focus();
            }
        } else if (e.key === 'ArrowRight') {
            const nextInput = $(this).next('.sorteio-input');
            if (nextInput.length > 0) {
                nextInput.focus();
            }
        }
    });
}

function configurarBotaoVerificacao() {
    $('#verificarBtn').on('click', function() {
        verificarSorteio();
    });
    
    $('#limparBtn').on('click', function() {
        if (meusNumeros.length > 0) {
            if (confirm('Tem certeza que deseja limpar todos os números?')) {
                limparNumeros();
            }
        } else {
            mostrarAlerta('Não há números para limpar.', 'info');
        }
    });
}

function processarArquivo(file) {
    if (file.type !== 'text/plain' && !file.name.endsWith('.txt') && !file.name.endsWith('.rtf')) {
        mostrarAlerta('Por favor, selecione um arquivo TXT ou RTF válido.', 'warning');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        let conteudo = e.target.result;
        
        if (file.name.endsWith('.rtf')) {
            conteudo = conteudo.replace(/\\[a-z]+\d*\s?/g, '');
            conteudo = conteudo.replace(/\{[^}]*\}/g, '');
            conteudo = conteudo.replace(/\\/g, '');
            conteudo = conteudo.replace(/\s+/g, ' ');
            conteudo = conteudo.replace(/^\s+|\s+$/g, '');
            conteudo = conteudo.replace(/\}+$/g, '');
        }
        
        conteudo = conteudo.replace(/\r\n/g, '').replace(/\n/g, '').replace(/\r/g, '');
        conteudo = conteudo.trim();
        
        const numeros = conteudo.split(';')
            .map(num => num.trim())
            .filter(num => num.length === 7 && /^\d{7}$/.test(num));
        
        if (numeros.length === 0) {
            mostrarAlerta('Nenhum número válido encontrado no arquivo. Verifique se os números estão separados por ponto e vírgula (;) e têm 7 dígitos.', 'warning');
            return;
        }
        
        meusNumeros = numeros;
        exibirNumeros();
        salvarDados();
        mostrarAlerta(`Importados ${numeros.length} números com sucesso!`, 'success');
    };
    
    reader.readAsText(file);
}

function exibirNumeros() {
    const container = $('#numbersContainer');
    container.empty();
    
    meusNumeros.forEach((numero, index) => {
        const numeroCard = $(`
            <div class="col-md-4 col-sm-6">
                <div class="card number-card h-100" data-numero="${numero}">
                    <div class="card-body text-center p-2">
                        <h6 class="mb-0">${numero}</h6>
                        <small class="text-muted">#${index + 1}</small>
                    </div>
                </div>
            </div>
        `);
        container.append(numeroCard);
    });
    
    $('#numberCount').text(meusNumeros.length);
}

function verificarSorteio() {
    const inputs = $('.sorteio-input');
    let numeroSorteado = '';
    
    inputs.each(function() {
        const valor = $(this).val();
        if (valor === '') {
            mostrarAlerta('Por favor, preencha todos os 7 dígitos do sorteio.', 'warning');
            $(this).focus();
            return false;
        }
        numeroSorteado += valor;
    });
    
    if (numeroSorteado.length !== 7) {
        return;
    }
    
    const ganhadores = meusNumeros.filter(numero => numero === numeroSorteado);
    
    $('.number-card').removeClass('winner');
    
    if (ganhadores.length > 0) {
        ganhadores.forEach(numero => {
            $(`.number-card[data-numero="${numero}"]`).addClass('winner');
        });
        
        $('#ganhadoresContainer').removeClass('d-none');
        $('#resultadoContainer').addClass('d-none');
        $('#ganhadoresTexto').html(`
            <p class="mb-2"><strong>Parabéns! Você ganhou!</strong></p>
            <p class="mb-0">Número ganhador: <strong>${numeroSorteado}</strong></p>
        `);
    } else {
        $('#resultadoContainer').removeClass('d-none');
        $('#ganhadoresContainer').addClass('d-none');
        $('#resultadoTexto').html(`
            <p class="mb-2">Nenhum número ganhador encontrado.</p>
            <p class="mb-0">Número sorteado: <strong>${numeroSorteado}</strong></p>
        `);
    }
}

function mostrarAlerta(mensagem, tipo) {
    const alerta = $(`
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            <i class="bi bi-${tipo === 'success' ? 'check-circle' : tipo === 'warning' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `);
    
    $('.container-fluid').prepend(alerta);
    
    setTimeout(() => {
        alerta.alert('close');
    }, 5000);
}

function salvarDados() {
    const dados = {
        numeros: meusNumeros,
        sorteios: sorteios
    };
    localStorage.setItem('marcadorSorteios', JSON.stringify(dados));
}

function limparNumeros() {
    meusNumeros = [];
    $('#numbersContainer').empty();
    $('#numberCount').text('0');
    $('#resultadoContainer').addClass('d-none');
    $('#ganhadoresContainer').addClass('d-none');
    $('.sorteio-input').val('');
    salvarDados();
    mostrarAlerta('Números limpos com sucesso!', 'success');
}

function carregarDadosSalvos() {
    const dadosSalvos = localStorage.getItem('marcadorSorteios');
    if (dadosSalvos) {
        try {
            const dados = JSON.parse(dadosSalvos);
            meusNumeros = dados.numeros || [];
            sorteios = dados.sorteios || {1: null, 2: null, 3: null};
            
            if (meusNumeros.length > 0) {
                exibirNumeros();
            }
        } catch (e) {
            console.error('Erro ao carregar dados salvos:', e);
        }
    }
}

function limparDados() {
    meusNumeros = [];
    sorteios = {1: null, 2: null, 3: null};
    localStorage.removeItem('marcadorSorteios');
    $('#numbersContainer').empty();
    $('#numberCount').text('0');
    $('#resultadoContainer').addClass('d-none');
    $('#ganhadoresContainer').addClass('d-none');
    $('.sorteio-input').val('');
}

function gerarNumerosExemplo() {
    const numerosExemplo = [
        '1234567',
        '7654321',
        '1111111',
        '9999999',
        '5555555',
        '7777777',
        '8888888',
        '4444444',
        '6666666',
        '2222222'
    ].join(';');
    
    const blob = new Blob([numerosExemplo], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'numeros_exemplo.txt';
    a.click();
    URL.revokeObjectURL(url);
}

function calcularEdicaoAtual() {
    const hoje = new Date();
    const edicao60Segunda = new Date(2025, 7, 4);
    const semanasPassadas = Math.floor((hoje - edicao60Segunda) / (7 * 24 * 60 * 60 * 1000));
    return 60 + semanasPassadas;
}

function atualizarProximosSorteios() {
    const hoje = new Date();
    const diaSemana = hoje.getDay();
    
    const edicaoAtual = calcularEdicaoAtual();
    
    const sorteios = [
        { numero: 1, dia: 1, nome: 'Segunda-feira' },
        { numero: 2, dia: 3, nome: 'Quarta-feira' },
        { numero: 3, dia: 5, nome: 'Sexta-feira' }
    ];
    
    let html = `<div class="mb-2"><strong>Edição ${edicaoAtual}</strong></div>`;
    
    const edicao60Segunda = new Date(2025, 7, 4);
    const semanasPassadas = Math.floor((hoje - edicao60Segunda) / (7 * 24 * 60 * 60 * 1000));
    const segundaAtual = new Date(edicao60Segunda);
    segundaAtual.setDate(edicao60Segunda.getDate() + (semanasPassadas * 7));
    
    const datasEdicaoAtual = [
        new Date(segundaAtual), // Segunda
        new Date(segundaAtual.getTime() + 2 * 24 * 60 * 60 * 1000), // Quarta (+2 dias)
        new Date(segundaAtual.getTime() + 4 * 24 * 60 * 60 * 1000)  // Sexta (+4 dias)
    ];
    
    hoje.setHours(0, 0, 0, 0);
    
    datasEdicaoAtual.forEach((dataSorteio, index) => {
        dataSorteio.setHours(0, 0, 0, 0);
        const diasAteSorteio = Math.floor((dataSorteio - hoje) / (24 * 60 * 60 * 1000));
        
        const dataFormatada = dataSorteio.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        let status = '';
        if (diasAteSorteio === 0) {
            status = '<span class="badge bg-success">Hoje!</span>';
        } else if (diasAteSorteio < 0) {
            status = '<span class="badge bg-secondary">Já aconteceu</span>';
        } else {
            status = `<span class="badge bg-primary">${diasAteSorteio} dia${diasAteSorteio > 1 ? 's' : ''}</span>`;
        }
        
        const nomesSorteio = ['Segunda-feira', 'Quarta-feira', 'Sexta-feira'];
        
        html += `
            <div class="d-flex justify-content-between align-items-center mb-1">
                <span>Sorteio ${index + 1} (${nomesSorteio[index]})</span>
                ${status}
            </div>
            <small class="text-muted">${dataFormatada}</small>
            ${diasAteSorteio <= 0 ? '<hr class="my-2">' : ''}
        `;
    });
    
    $('#proximosSorteios').html(html);
}



window.limparDados = limparDados;
window.gerarNumerosExemplo = gerarNumerosExemplo; 