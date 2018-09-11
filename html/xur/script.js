domain.xur = () => {
  
  if (!domain.xur.HistoryResponse) {

    domain.xur.init();

  }

}

domain.xur.HistoryResponse = false;

domain.xur.init = () => {

  if (!domain.xur.HistoryResponse) {
  
    var HistoryResponse = $.ajax({
      url: "https://api.braytech.org/?request=xur&get=history&everything",
      method: "get",
      cache: false,
      dataType: "json",
      headers: {
        "X-Api-Key": apiKey.braytech
      }
    }).then();

    $.when(HistoryResponse).then((api1) => {

      domain.xur.HistoryResponse = {};

      domain.xur.HistoryResponse = api1.response.data;

      domain.xur.render();

      $(".frame").addClass("hasHistory");

    }); 

  }
  
}

domain.xur.render = () => {

  for (let index = Object.keys(domain.xur.HistoryResponse).length - 1; index > -1; index--) {
    const season = Object.keys(domain.xur.HistoryResponse)[index];

    $(".history").append(`<div class="season season-${ season }">
      <h3>Season ${ season }</h3>
      <div class="weeks"></div>
    </div>`);

  }

  for (let index = Object.keys(domain.xur.HistoryResponse).length - 1; index > -1; index--) {
    const obj = Object.values(domain.xur.HistoryResponse)[index];

    console.log(obj);

    for (let index = obj.length - 1; index > -1; index--) {
      week = obj[index];

      var items = ``;
      week.items.forEach(item => {

        if (item.hash == 759381183 || item.hash == 4285666432) {
          return;
        }

        items = items + `<div class="item">
          <div class="image" data-1x="https://www.bungie.net${ item.displayProperties.icon }" data-2x="https://www.bungie.net${ item.displayProperties.icon }"></div>
        </div>`;
      });

      $(`.history .season-${ week.season } .weeks`).append(`<div class="week" data-week="${ week.week }">
        <div class="items">${ items }</div>
      </div>`);

    }

  }

  domain.sentinel();


}
