domain.challenges = () => {

  domain.challenges.init();

}

domain.challenges.init = () => {

  var request = $.ajax({
    url: "https://api.braytech.org/?request=challenges",
    method: "get",
    cache: false,
    dataType: "json",
    headers: {
      "X-Api-Key": apiKey.braytech
    }
  }).then();

  $.when(request).then(function(request) {

    var challenges = request.response.data;

    console.log(challenges);

    //#region flashpoint

    var flashpoint = false;
    Object.keys(challenges).forEach(key => {
      if (challenges[key].type == "flashpoint") {
        flashpoint = challenges[key];
        return;
      }
    });

    var now = moment();
    var startDate = moment(flashpoint.startDate);
    var endDate = moment(flashpoint.endDate);
    var percent = Math.round(((now - startDate) / (endDate - startDate) * 100) * 100) / 100;
   
    $(".frame").append(`<div class="image bg" data-1x="/challenges/images/${ flashpoint.slug }.jpg" data-2x="/challenges/images/${ flashpoint.slug }.jpg"></div>
    <div class="flashpoint">
      <div class="name">${ flashpoint.name }</div>
      <div class="description">
        <p>${ flashpoint.description }</p>
      </div>
      <div class="bar">
        <div class="dumbbell" style="width: ${ percent }%"></div>
      </div>
      <div class="timeRemaining">${ moment().to(moment.tz(flashpoint.endDate, "Europe/London").add(8, 'hours').tz(moment.tz.guess()), true).replace(/^\w/, c => c.toUpperCase()) } remaining</div>
    </div>`);

    //#endregion

    //#region xur

    var xur = false;
    Object.keys(challenges).forEach(key => {
      if (challenges[key].type == "vendor" && challenges[key].hash == 2190858386) {
        xur = challenges[key];
        return;
      }
    });

    if (xur) {

      var now = moment();
      var startDate = moment(xur.startDate);
      var endDate = moment(xur.endDate);
      var percent = Math.round(((now - startDate) / (endDate - startDate) * 100) * 100) / 100;

      var request = $.ajax({
        url: "https://api.braytech.org/?request=xur&get=history",
        method: "get",
        cache: false,
        dataType: "json",
        headers: {
          "X-Api-Key": apiKey.braytech
        }
      }).then();

      $.when(request).then(function(request) {

        var items = "";
        request.response.data.items.forEach(item => {
          if (item.hash == 759381183 || item.hash == 4285666432) {
            return;
          }
          items = items + `<li>
            <div class="image" data-1x="https://bungie.net${ item.displayProperties.icon }" data-2x="https://bungie.net${ item.displayProperties.icon }"></div> ${ item.displayProperties.name }
          </li>`;
        });
    
        $(".frame").append(`<div class="vendor xur">
          <div class="name">${ xur.name }</div>
          <div class="description">
            <p>His will is not his own. He has a clear purpose but cannot explain it—forgive him</p>
          </div>
          <ul class="items">
            ${ items }
          </ul>
          <div class="bar">
            <div class="dumbbell" style="width: ${ percent }%"></div>
          </div>
          <div class="timeRemaining">${ moment().to(moment.tz(flashpoint.endDate, "Europe/London").add(8, 'hours').tz(moment.tz.guess()), true).replace(/^\w/, c => c.toUpperCase()) } remaining</div>
        </div>`);

        domain.sentinel();

      });

    }

    //#endregion

    domain.sentinel();

  });
  
}