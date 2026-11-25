# axio-paginacao-bootstrap

Paginação para tabelas HTML com **Bootstrap 5.3+**. JavaScript puro, sem jQuery, cerca de 4 KB minificado.

**Demo online:** https://lenivalestevao.github.io/axio-paginacao-bootstrap/

## Instalação

Baixe `axio.paginacao.min.js` e inclua depois do Bootstrap, ou use direto pelo CDN:

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/gh/lenivalestevao/axio-paginacao-bootstrap@master/axio.paginacao.min.js"></script>
```

Só o CSS do Bootstrap é necessário; o script não depende do JS do Bootstrap nem de jQuery.

## Uso

```html
<table id="minha-tabela" class="table">
  <thead>…</thead>
  <tbody>…</tbody>
</table>

<nav id="paginacao"></nav>

<script>
  const pag = new AxioPaginacao('#minha-tabela', {
    pagerSelector: '#paginacao',
    perPage: 10
  });
</script>
```

O contêiner da paginação pode ser um `<nav>` (o script cria o `<ul class="pagination">` dentro dele) ou um `<ul class="pagination">` já existente.

Se o jQuery estiver na página, o formato antigo continua funcionando:

```js
$('.table').paginacao({ pagerSelector: '.pagination', perPage: 10 });
```

Veja também `exemplo.html` (uso mínimo) e `docs/index.html` (demo completa).

## Opções

| Opção | Padrão | Descrição |
|---|---|---|
| `pagerSelector` | — | Seletor CSS ou elemento onde a paginação é desenhada (obrigatório) |
| `perPage` | `10` | Linhas por página |
| `maxButtons` | `7` | Máximo de botões numéricos; acima disso aparecem reticências (`1 … 5 6 7 … 20`) |
| `startPage` | `1` | Página inicial |
| `size` | `''` | Tamanho do Bootstrap: `'sm'` ou `'lg'` |
| `align` | `''` | Alinhamento: `'center'` ou `'end'` |
| `labels` | `« ‹ › »` | Textos dos botões (`first`, `prev`, `next`, `last`) e o `aria-label` do `nav` (`nav`) |
| `onChange` | — | `function (page, totalPages)`, chamada a cada troca de página |

## Métodos e propriedades

| Item | Descrição |
|---|---|
| `goTo(n)` | Vai para a página `n` |
| `next()` / `prev()` | Próxima / página anterior |
| `setPerPage(n)` | Muda as linhas por página e volta para a página 1 |
| `refresh()` | Relê a tabela e redesenha; chame depois de adicionar ou remover linhas |
| `destroy()` | Remove a paginação e mostra todas as linhas de novo |
| `page` | Página atual |
| `totalPages` | Total de páginas |

```js
const tbody = document.querySelector('#minha-tabela tbody');
tbody.insertAdjacentHTML('beforeend', '<tr><td>Nova linha</td></tr>');
pag.refresh();
```

## Acessibilidade

- Botões reais (`<button>`) com `aria-label` em português.
- Página atual marcada com `aria-current="page"`.
- Botões de início e fim desativados nas extremidades.

## Migrando da v1

| v1 | v2 |
|---|---|
| Bootstrap 3 + jQuery | Bootstrap 5.3, sem jQuery |
| `$('.table').paginacao({...})` | `new AxioPaginacao('.table', {...})` (o formato antigo ainda funciona com jQuery) |
| `total` obrigatório | Removido: o total vem das linhas da tabela |
| Classes `pg_N` / `pag_N` nas linhas | Atributo `hidden` nas linhas |
| Várias tabelas na mesma página conflitavam | Cada instância é independente |
| Criava uma página vazia quando o total era múltiplo de `perPage` | Corrigido |

## Contato

lenivalestevaojr@gmail.com
