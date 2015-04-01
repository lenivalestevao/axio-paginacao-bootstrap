# axio-paginacao-bootstrap
Criação de paginação em uma tabela usando jquery e bootstrap by www.axio.com.br

Modo de usar
<div class="row">
    <table class="table">
      <thead>
          <tr>
              <td>Estado</td>
              <td>Sigla</td>
          </tr>
      </thead>
      <tbody>
          <tr>
              <td>Paraná</td>
              <td>PR</td>
          </tr>
          <tr>
              <td>Rio Grande do Sul</td>
              <td>RS</td>
          </tr>
          <tr>
              <td>Santa Catarina</td>
              <td>SC</td>
          </tr>
      </tbody>
    </table>
</div>
<div class="row">
    <ul class="pagination"></ul>
</div>

<script>
  $(function(){
      $('.table').paginacao({pagerSelector: '.pagination', perPage: 10, total: 300});
  });
</script>
