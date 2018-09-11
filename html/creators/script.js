domain.creators = () => {
  
  domain.creators.init();

}

domain.creators.init = () => {

  var entities = [
    {
      "entity": "e908",
      "name": "Kinetic"
    },
    {
      "entity": "e905",
      "name": "Solar"
    },
    {
      "entity": "e907",
      "name": "Arc"
    },
    {
      "entity": "e98c",
      "name": "Void"
    },
    {
      "entity": "e90a",
      "name": "Titan"
    },
    {
      "entity": "e90b",
      "name": "Hunter"
    },
    {
      "entity": "e90c",
      "name": "Warlock"
    },
    {
      "entity": "e973",
      "name": "Power"
    },
    {
      "entity": "e90d",
      "name": "Ishtar"
    },
    {
      "entity": "e915",
      "name": "Crucible"
    },
    {
      "entity": "e996",
      "name": "Strikes"
    },
    {
      "entity": "e903",
      "name": "Crimson Days"
    },
    {
      "entity": "e902",
      "name": "The Dawning"
    },
    {
      "entity": "e995",
      "name": "Raid"
    },
    {
      "entity": "e95f",
      "name": "Raid alternate"
    },
    {
      "entity": "e919",
      "name": "Cryptarch"
    },
    {
      "entity": "e970",
      "name": "Lost Prophecies"
    },
    {
      "entity": "e96f",
      "name": "Osiris"
    },
    {
      "entity": "e918",
      "name": "Warmind"
    },
    {
      "entity": "e96e",
      "name": "The Nine"
    },
    {
      "entity": "e979",
      "name": "Red Legion"
    },
    {
      "entity": "e914",
      "name": "Queens Wrath"
    },
    {
      "entity": "e913",
      "name": "House of Judgement"
    },
    {
      "entity": "e912",
      "name": "House of Wolves"
    },
    {
      "entity": "e911",
      "name": "House of Kings"
    },
    {
      "entity": "e910",
      "name": "House of Devils"
    },
    {
      "entity": "e90f",
      "name": "House of Winter"
    },
    {
      "entity": "e96d",
      "name": "House of Dusk"
    },
    {
      "entity": "e90e",
      "name": "Spawn of Crota"
    },
    {
      "entity": "e99f",
      "name": "Spider"
    },
    {
      "entity": "e989",
      "name": "Future War Cult"
    },
    {
      "entity": "e98a",
      "name": "New Monarchy"
    },
    {
      "entity": "e960",
      "name": "Dead Orbit"
    },
    {
      "entity": "e993",
      "name": "Iron Banner"
    },
    {
      "entity": "e906",
      "name": "Xûr"
    },
    {
      "entity": "e900",
      "name": "Quest"
    },
    {
      "entity": "e992",
      "name": "Adventure"
    },
    {
      "entity": "e981",
      "name": "Region Chest"
    },
    {
      "entity": "e980",
      "name": "Lost Sector"
    },
    {
      "entity": "e904",
      "name": "Latent Memories"
    },
    {
      "entity": "e99a",
      "name": "Sleeper Node"
    },
    {
      "entity": "e97e",
      "name": "Flashpoint"
    },
    {
      "entity": "e97d",
      "name": "Meditations"
    },
    {
      "entity": "e97f",
      "name": "Clan"
    },
    {
      "entity": "e997",
      "name": "Gambit"
    },
    {
      "entity": "e99d",
      "name": "Forsaken"
    },
    {
      "entity": "e901",
      "name": "Vault"
    },
    {
      "entity": "e97a",
      "name": "Pleasure Gardens"
    },
    {
      "entity": "e97b",
      "name": "Royal Pools"
    },
    {
      "entity": "e96c",
      "name": "The Gauntlet"
    },
    {
      "entity": "e97c",
      "name": "Throne"
    },
    {
      "entity": "e96a",
      "name": "Clovis Bray"
    },
    {
      "entity": "e96b",
      "name": "Clovis Bray device"
    },
    {
      "entity": "e969",
      "name": "Vanguard"
    }
  ];

  entities.forEach(symbol => {
    $(".icons-font .entities").append(`<div class="symbol">
      <div class="entity">&#x${ symbol.entity }</div>
      <div class="name">${ symbol.name }</div>
    </div>`);
  });

  $(".frame code").each(function(i, block) {
    hljs.highlightBlock(block);
  });

  $(".api .form .header button").on("click", function(e) {
    e.preventDefault();

    $(".api .form").addClass("active");

  });

  $(".api .form .request button").on("click", function(e) {
    e.preventDefault();

    $(".api .form .request button, .api .form .request input").prop("disabled",true);

    var get_key = $.ajax({
      url: "https://api.braytech.org/?request=key",
      method: "post",
      cache: false,
      dataType: "json",
      headers: {
        "X-Api-Key": apiKey.braytech
      },
      data: {
        "origin": "",
        "url": $(".key form input[name='url']").val(),
        "comment": $(".key form input[name='comment']").val()
      }
    }).then();
    $.when(get_key).then(function(new_key) {
      
      $(".api .form .request").html(`<p>Use me responsively and call justrealmilk for help on Twitter, Xbox, or Discord.</p><code>${ new_key.response.data.key ? new_key.response.data.key : `Ruh roh!` }</code>`);

    });

  });
  
}