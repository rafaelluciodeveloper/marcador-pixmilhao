# Marcador de Sorteios - PIX do Milhão

Uma aplicação web simples para gerenciar seus números de sorteio e verificar se você ganhou!

## 🌐 **Aplicação Online**

**Acesse a aplicação em:** [https://rafaelluciodeveloper.github.io/marcador-pixmilhao/](https://rafaelluciodeveloper.github.io/marcador-pixmilhao/)

---

## 🚀 Como Usar

### 1. Abrir a Aplicação
- Acesse a aplicação online: [https://rafaelluciodeveloper.github.io/marcador-pixmilhao/](https://rafaelluciodeveloper.github.io/marcador-pixmilhao/)
- Ou abra o arquivo `index.html` em qualquer navegador moderno
- A aplicação funciona completamente offline

### 2. Importar Seus Números
- **Formatos aceitos**: Arquivo `.txt` ou `.rtf` com seus números separados por ponto e vírgula (;)
- **Exemplo**: `1234567;7654321;1111111;9999999`
- **Importar**: Arraste o arquivo para a área de upload ou clique em "Selecionar Arquivo"

### 3. Verificar Sorteios
- **Calendário da semana**: Mostra os sorteios da semana atual
- **Digite os números**: 7 dígitos do número sorteado
- **Clique em "Verificar Se Ganhei"**: Compara seus números com o sorteado
- **Resultado**: Mostra se você ganhou ou não

## ✨ Funcionalidades

- **Importação de números** via arquivo TXT ou RTF
- **Drag and drop** para facilitar o upload
- **Verificação automática** de números ganhadores
- **Destaque visual** dos números ganhadores
- **Salvamento automático** dos dados no navegador
- **Interface responsiva** que funciona em celular e computador
- **Calendário da semana** com sorteios atuais
- **Verificação simplificada** sem seleção de sorteio

## 📱 Interface

### Lado Esquerdo
- **Importação de números**: Área para arrastar ou selecionar arquivo
- **Lista de números**: Visualização de todos os seus números importados

### Lado Direito
- **Calendário da semana**: Mostra sorteios da semana atual
- **Input de números**: 7 campos para digitar os números sorteados
- **Resultado**: Mostra se você ganhou ou não

## 🎯 Exemplo de Arquivo

Crie um arquivo chamado `meus_numeros.txt` ou `meus_numeros.rtf` com o seguinte conteúdo:

```
1234567;7654321;1111111;9999999;5555555;7777777;8888888;4444444;6666666;2222222
```

## 💡 Dicas

- Os números devem ter exatamente 7 dígitos
- Use apenas números (0-9)
- Separe os números por ponto e vírgula (;)
- A aplicação salva automaticamente seus dados no navegador
- Use o botão "Limpar Números" para remover todos os números
- Você pode usar as setas do teclado para navegar entre os campos

## 🔧 Funções de Debug

Para desenvolvedores, algumas funções estão disponíveis no console:

- `gerarNumerosExemplo()`: Gera um arquivo de exemplo
- `limparDados()`: Remove todos os dados salvos

## 🛠️ Tecnologias

- **HTML5**: Estrutura da página
- **CSS3**: Estilização com Bootstrap 5
- **JavaScript**: Lógica da aplicação
- **jQuery**: Manipulação do DOM
- **Bootstrap**: Framework CSS para interface responsiva

## 📄 Licença

Este projeto é de uso livre para fins pessoais. 