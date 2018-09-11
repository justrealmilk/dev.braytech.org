domain.now = () => {

  if (!domain.now.requests) {
  
    domain.now.init();

  }

}

domain.now.requests = false;

domain.now.init = () => {

  var challenges = $.ajax({
    url: "https://api.braytech.org/?request=challenges",
    method: "get",
    cache: true,
    dataType: "json",
    headers: {
      "X-Api-Key": apiKey.braytech
    }
  }).then();

  var spider = $.ajax({
    url: "https://api.braytech.org/?request=vendor&hash=863940356,672118013",
    method: "get",
    cache: true,
    dataType: "json",
    headers: {
      "X-Api-Key": apiKey.braytech
    }
  }).then();

  $.when(challenges, spider).then((api1, api2) => {

    domain.now.requests = {};

    domain.now.requests.challenges = api1[0].response.data;
    domain.now.requests.spider = api2[0].response.data[863940356];
    domain.now.requests.gunsmith = api2[0].response.data[672118013];

    console.log(domain.now.requests);

    domain.now.render();

  });
  
}

domain.now.utils = {}

domain.now.utils.classTypeToString = (classType) => {

  var string;

  switch (classType) {
    case 0: string = "Titan"; break;
    case 1: string = "Hunter"; break;
    case 2: string = "Warlock"; break;
  }

  return string;
}

domain.now.render = () => {

  var challenges = domain.now.requests.challenges;
  
  //#region flashpoint

  var flashpoint = false;
  Object.keys(challenges).forEach(key => {
    if (challenges[key].type == "flashpoint") {
      flashpoint = challenges[key];
      return;
    }
  });

  var now = moment();
  var weeklyStartDate = moment.tz(flashpoint.startDate, "Europe/London").tz(moment.tz.guess());
  var weeklyEndDate = moment.tz(flashpoint.endDate, "Europe/London").tz(moment.tz.guess());
  var weeklyPercent = Math.round(((now - weeklyStartDate) / (weeklyEndDate - weeklyStartDate) * 100) * 100) / 100;

  var flashpointRemaining = moment().to(moment.tz(flashpoint.endDate, "Europe/London").tz(moment.tz.guess()), true).replace(/^\w/, c => c.toUpperCase());

  // var dailyStartDate;
  // var dailyEndDate;
  // var dailyRemaining;
  // var dailyReset;
  // var dailyYesterday;
  // var dailyPercent;
  // if (moment(moment()).isSameOrAfter(moment.tz(moment().startOf('day').hours(17).minutes(0).seconds(0).milliseconds(0), "Europe/London").tz(moment.tz.guess()))) {
  //   dailyReset = moment.tz(moment().startOf('day').hours(17).minutes(0).seconds(0).milliseconds(0).add(1,'day'), "Europe/London").tz(moment.tz.guess());
  //   dailyYesterday = dailyReset.clone().subtract(1,'day');
  //   dailyRemaining = moment().to(dailyReset, true).replace(/^\w/, c => c.toUpperCase());
  //   dailyPercent = Math.round(((now - dailyYesterday) / (dailyReset - dailyYesterday) * 100) * 100) / 100;
  // }
  // else {
  //   dailyReset = moment.tz(moment().startOf('day').hours(17).minutes(0).seconds(0).milliseconds(0), "Europe/London").tz(moment.tz.guess());
  //   dailyYesterday = dailyReset.clone().subtract(1,'day');
  //   dailyRemaining = moment().to(dailyReset, true).replace(/^\w/, c => c.toUpperCase());
  //   dailyPercent = Math.round(((now - dailyYesterday) / (dailyReset - dailyYesterday) * 100) * 100) / 100;
  // }

  var dailyStartDate = moment.tz(domain.now.requests.gunsmith.vendor.nextRefreshDate, "Europe/London").tz(moment.tz.guess()).subtract(1,'day');
  var dailyEndDate = moment.tz(domain.now.requests.gunsmith.vendor.nextRefreshDate, "Europe/London").tz(moment.tz.guess());
  var dailyRemaining = moment().to(dailyEndDate, true).replace(/^\w/, c => c.toUpperCase());
  var dailyPercent = Math.round(((now - dailyStartDate) / (dailyEndDate - dailyStartDate) * 100) * 100) / 100;

  switch (flashpoint.slug) {
    case "edz": var themeColor = "#909442"; break;
    case "mars": var themeColor = "#ea603e"; break;
    case "titan": var themeColor = "#256f68"; break;
    case "io": var themeColor = "#cdc36a"; break;
    default: var themeColor = "#929292"; break;
  }
  
  $(".frame").css("background-color",themeColor).addClass("hasChallenges");
  $(".frame .hotspot").html(`
    <div class="name">${ flashpoint.name }</div>
    <div class="description">
      <p>${ flashpoint.description }</p>
    </div>
    <div class="bar">
      <div class="dumbbell" style="width: ${ weeklyPercent }%"></div>
    </div>
    <div class="timeRemaining">${ moment().to(moment.tz(flashpoint.endDate, "Europe/London").tz(moment.tz.guess()), true).replace(/^\w/, c => c.toUpperCase()) } remaining</div>
  `);

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

    var request = $.ajax({
      url: "https://api.braytech.org/?request=xur&get=history",
      method: "get",
      cache: true,
      dataType: "json",
      headers: {
        "X-Api-Key": apiKey.braytech
      }
    }).then();

    $.when(request).then((response) => {

      var items = "";
      response.response.data.items.forEach(item => {
        if (item.hash == 759381183 || item.hash == 4285666432) {
          return;
        }
        items = items + `<div class="item">
          <div class="icon">
            <div class="image" data-1x="https://bungie.net${ item.displayProperties.icon }" data-2x="https://bungie.net${ item.displayProperties.icon }"></div>
          </div>
          <div class="text">
            <p>${ item.displayProperties.name }</p>
            <p>${ item.classType != 3 ? `${ domain.now.utils.classTypeToString(item.classType) } ` : `` }${ item.itemTypeDisplayName }</p></div>
        </div>`;
      });
  
      $(".frame .vendors").append(`<div class="vendor xur">
        <div class="name">${ xur.name }</div>
        <div class="description">
          <p>His will is not his own. He has a clear purpose but cannot explain it—forgive him</p>
        </div>
        <div class="items">
          ${ items }
        </div>
        <div class="bar">
          <div class="dumbbell" style="width: ${ weeklyPercent }%"></div>
        </div>
        <div class="timeRemaining">${ flashpointRemaining } remaining</div>
      </div>`);

      domain.sentinel();

    });

  }

  //#endregion

  //#region spider

  var spider = domain.now.requests.spider;

  var exchangeCat = false;
  Object.keys(spider.categories).forEach(key => {
    if (spider.categories[key].displayCategoryIndex == 1) {
      exchangeCat = spider.categories[key];
      return;
    }
  });

  var wantedCat = false;
  Object.keys(spider.categories).forEach(key => {
    if (spider.categories[key].displayCategoryIndex == 4) {
      wantedCat = spider.categories[key];
      return;
    }
  });

  var exchange = "";
  spider.sales.forEach(sale => {
    if (exchangeCat.itemIndexes.includes(sale.vendorItemIndex)) {
      
      let item = sale.item;
      exchange = exchange + `<div class="item">
        <div class="icon">
          <div class="image" data-1x="https://bungie.net${ item.displayProperties.icon }" data-2x="https://bungie.net${ item.displayProperties.icon }"></div>
        </div>
        <div class="cost">
          <div class="image" data-1x="https://bungie.net${ sale.costs[0].displayProperties.icon }" data-2x="https://bungie.net${ sale.costs[0].displayProperties.icon }"></div>
          ${ sale.costs[0].quantity }
        </div>
        <div class="text">
          <p>${ item.displayProperties.name }</p>
          <p>${ item.displayProperties.description }</p>
        </div>
      </div>`;
    }

  });

  var bounties = "";
  spider.sales.forEach(sale => {
    if (wantedCat.itemIndexes.includes(sale.vendorItemIndex)) {
      
      if (sale.costs[0].hash == 4114204995 && sale.costs[0].quantity == 5) {

        let item = sale.item;
        bounties = bounties + `<div class="item">
          <div class="icon">
            <div class="image" data-1x="https://bungie.net${ item.displayProperties.icon }" data-2x="https://bungie.net${ item.displayProperties.icon }"></div>
          </div>
          <div class="text">
            <p>${ item.displayProperties.name }</p>
            <p>${ item.displayProperties.description }</p>
          </div>
        </div>`;
      }
    }

  });

  $(".frame .vendors").append(`<div class="vendor spider">
    <div class="name">Spider</div>
    <div class="description">
      <p>Unlike his Fallen brethren, the clever Spider prefers to negotiate instead of fight.</p>
    </div>
    <div class="items exchange">
      ${ exchange }
    </div>
    <div class="bar exchange">
      <div class="dumbbell" style="width: ${ dailyPercent }%"></div>
    </div>
    <div class="timeRemaining exchange">${ dailyRemaining } remaining</div>
    <div class="items bounties">
      ${ bounties }
    </div>
    <div class="bar bounties">
      <div class="dumbbell" style="width: ${ weeklyPercent }%"></div>
    </div>
    <div class="timeRemaining bounties">${ flashpointRemaining } remaining</div>
  </div>`);

  //#endregion

  //#region gunsmith

  var gunsmith = domain.now.requests.gunsmith;

  var modCat = false;
  Object.keys(gunsmith.categories).forEach(key => {
    if (gunsmith.categories[key].displayCategoryIndex == 4) {
      modCat = gunsmith.categories[key];
      return;
    }
  });

  var mods = "";
  gunsmith.sales.forEach(sale => {
    if (modCat.itemIndexes.includes(sale.vendorItemIndex)) {
      
      let item = sale.item;
      mods = mods + `<div class="item">
        <div class="icon">
          <div class="image" data-1x="https://bungie.net${ item.displayProperties.icon }" data-2x="https://bungie.net${ item.displayProperties.icon }"></div>
        </div>
        <div class="text">
          <p>${ item.displayProperties.name }</p>
          <p>${ item.perks[0].displayProperties.description }</p>
        </div>
      </div>`;
    }

  });

  $(".frame .vendors").append(`<div class="vendor gunsmith">
    <div class="name">Banshee&ndash;44</div>
    <div class="description">
      <p>Banshee-44 has lived many lives. As master weaponsmith for the Tower, he supplies Guardians with only the best.</p>
    </div>
    <div class="items mods">
      ${ mods }
    </div>
    <div class="bar mods">
      <div class="dumbbell" style="width: ${ dailyPercent }%"></div>
    </div>
    <div class="timeRemaining mods">${ dailyRemaining } remaining</div>
  </div>`);

  domain.sentinel();


  //#endregion













  domain.sentinel();

}