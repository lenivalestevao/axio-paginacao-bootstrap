/**
 * axio-paginacao-bootstrap v2
 * Paginação de tabelas para Bootstrap 5.3+ — JavaScript puro, sem jQuery.
 *
 * @author Lenival Estevão
 * @since 24/03/2015 (v1) · reescrito para Bootstrap 5
 *
 * Uso:
 *   <table id="minha-tabela" class="table">...</table>
 *   <nav id="paginacao"></nav>
 *
 *   const pag = new AxioPaginacao('#minha-tabela', {
 *     pagerSelector: '#paginacao',
 *     perPage: 10
 *   });
 *
 * Opções:
 *   pagerSelector  seletor ou elemento onde a paginação é desenhada (obrigatório)
 *   perPage        linhas por página (padrão 10)
 *   maxButtons     máximo de botões numéricos visíveis (padrão 7)
 *   startPage      página inicial (padrão 1)
 *   size           '' | 'sm' | 'lg'  (tamanho do Bootstrap)
 *   align          '' | 'center' | 'end'
 *   labels         textos: { first, prev, next, last, nav }
 *   onChange       function (page, totalPages) chamada a cada troca de página
 *
 * Métodos:
 *   goTo(n), next(), prev(), refresh(), setPerPage(n), destroy()
 *
 * Também funciona como plugin jQuery, se o jQuery estiver na página:
 *   $('.table').paginacao({ pagerSelector: '.pagination', perPage: 10 });
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AxioPaginacao = factory();
    if (root.jQuery) {
      root.jQuery.fn.paginacao = function (opts) {
        return this.each(function () {
          const old = root.jQuery.data(this, 'axioPaginacao');
          if (old) old.destroy();
          root.jQuery.data(this, 'axioPaginacao', new root.AxioPaginacao(this, opts));
        });
      };
    }
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const DEFAULTS = {
    pagerSelector: null,
    perPage: 10,
    maxButtons: 7,
    startPage: 1,
    size: '',
    align: '',
    labels: {
      first: '«',
      prev: '‹',
      next: '›',
      last: '»',
      nav: 'Paginação da tabela'
    },
    onChange: null
  };

  const toEl = (target, ctx) =>
    typeof target === 'string' ? (ctx || document).querySelector(target) : target;

  class AxioPaginacao {
    constructor(table, opts = {}) {
      this.table = toEl(table);
      if (!this.table) throw new Error('AxioPaginacao: tabela não encontrada.');

      this.opts = Object.assign({}, DEFAULTS, opts, {
        labels: Object.assign({}, DEFAULTS.labels, opts.labels)
      });

      this.pager = toEl(this.opts.pagerSelector);
      if (!this.pager) throw new Error('AxioPaginacao: pagerSelector não encontrado.');

      this.perPage = Math.max(1, parseInt(this.opts.perPage, 10) || 10);
      this.page = Math.max(1, parseInt(this.opts.startPage, 10) || 1);

      this._onClick = this._onClick.bind(this);
      this.pager.addEventListener('click', this._onClick);

      this.refresh();
    }

    /** Linhas do corpo da tabela (relê o DOM, então reflete linhas novas). */
    get rows() {
      const body = this.table.tBodies[0] || this.table;
      return Array.from(body.rows);
    }

    get totalPages() {
      return Math.max(1, Math.ceil(this.rows.length / this.perPage));
    }

    /** Releia as linhas e redesenhe — chame depois de adicionar/remover linhas. */
    refresh() {
      this.page = Math.min(this.page, this.totalPages);
      this._render();
    }

    goTo(n) {
      const page = Math.min(Math.max(1, parseInt(n, 10) || 1), this.totalPages);
      if (page === this.page && this._rendered) return;
      this.page = page;
      this._render();
      if (typeof this.opts.onChange === 'function') {
        this.opts.onChange(this.page, this.totalPages);
      }
    }

    next() { this.goTo(this.page + 1); }
    prev() { this.goTo(this.page - 1); }

    setPerPage(n) {
      this.perPage = Math.max(1, parseInt(n, 10) || this.perPage);
      this.page = 1;
      this._render();
    }

    destroy() {
      this.pager.removeEventListener('click', this._onClick);
      this.pager.innerHTML = '';
      this.rows.forEach((tr) => { tr.hidden = false; });
    }

    // ---------- interno ----------

    _onClick(ev) {
      const btn = ev.target.closest('[data-axio-page]');
      if (!btn || !this.pager.contains(btn)) return;
      ev.preventDefault();
      if (btn.closest('.disabled')) return;
      this.goTo(btn.dataset.axioPage);
    }

    _render() {
      const rows = this.rows;
      const start = (this.page - 1) * this.perPage;
      const end = start + this.perPage;
      rows.forEach((tr, i) => { tr.hidden = i < start || i >= end; });

      this._renderPager();
      this._rendered = true;
    }

    /** Janela de páginas: 1 … 4 5 [6] 7 8 … 20 */
    _pageWindow() {
      const total = this.totalPages;
      const max = Math.max(5, this.opts.maxButtons);
      if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);

      const side = Math.floor((max - 3) / 2); // vizinhos de cada lado da atual
      let from = Math.max(2, this.page - side);
      let to = Math.min(total - 1, this.page + side);

      // mantém a largura constante perto das pontas
      const span = max - 2;
      if (to - from + 1 < span - 2) {
        if (this.page <= side + 2) to = Math.min(total - 1, span - 1);
        else from = Math.max(2, total - span + 2);
      }

      const out = [1];
      if (from > 2) out.push('…');
      for (let p = from; p <= to; p++) out.push(p);
      if (to < total - 1) out.push('…');
      out.push(total);
      return out;
    }

    _item(label, page, { disabled = false, active = false, aria = '' } = {}) {
      const li = document.createElement('li');
      li.className = 'page-item' + (disabled ? ' disabled' : '') + (active ? ' active' : '');
      if (active) li.setAttribute('aria-current', 'page');

      const el = document.createElement(page == null ? 'span' : 'button');
      el.className = 'page-link';
      el.textContent = label;
      if (aria) el.setAttribute('aria-label', aria);
      if (page != null) {
        el.type = 'button';
        el.dataset.axioPage = page;
        if (disabled) el.disabled = true;
      }
      li.appendChild(el);
      return li;
    }

    _renderPager() {
      const { labels, size, align } = this.opts;
      const total = this.totalPages;
      const atStart = this.page === 1;
      const atEnd = this.page === total;

      const ul = document.createElement('ul');
      ul.className =
        'pagination' +
        (size ? ' pagination-' + size : '') +
        (align ? ' justify-content-' + align : '');

      ul.appendChild(this._item(labels.first, 1, { disabled: atStart, aria: 'Primeira página' }));
      ul.appendChild(this._item(labels.prev, this.page - 1, { disabled: atStart, aria: 'Página anterior' }));

      this._pageWindow().forEach((p) => {
        if (p === '…') {
          ul.appendChild(this._item('…', null, { disabled: true }));
        } else {
          ul.appendChild(this._item(String(p), p, { active: p === this.page, aria: 'Página ' + p }));
        }
      });

      ul.appendChild(this._item(labels.next, this.page + 1, { disabled: atEnd, aria: 'Próxima página' }));
      ul.appendChild(this._item(labels.last, total, { disabled: atEnd, aria: 'Última página' }));

      // se o container já é um <ul class="pagination">, preenche-o; senão cria <nav>
      if (this.pager.matches('ul')) {
        this.pager.className = ul.className;
        this.pager.replaceChildren(...ul.childNodes);
      } else {
        this.pager.setAttribute('aria-label', labels.nav);
        this.pager.replaceChildren(ul);
      }
    }
  }

  return AxioPaginacao;
});
