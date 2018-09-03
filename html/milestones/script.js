domain.milestones = () => {

  domain.milestones.init();

}

domain.milestones.init = () => {

  var request = $.ajax({
    url: "https://api.braytech.org/?request=milestones",
    method: "get",
    cache: false,
    dataType: "json",
    headers: {
      "X-Api-Key": apiKey.braytech
    }
  }).then();

  $.when(request).then(function(request) {

    var milestones = request.response.data;
    var skip = [4109359897, 3245985898, 534869653, 4253138191, 3109354204];
    var powerfulRewards = [2171429505, 202035466, 463010297, 3660836525, 3603098564, 3109354207];

    console.log(milestones);

    var faction_rally = false;
    Object.keys(milestones).forEach(key => {
      if (milestones[key].milestoneHash == 1718587363) {
        faction_rally = milestones[key];
        return;
      }
    });

    var iron_banner = false;
    Object.keys(milestones).forEach(key => {
      if (milestones[key].milestoneHash == 449068913) {
        iron_banner = milestones[key];
        return;
      }
    });

    var flashpoint = false;
    Object.keys(milestones).forEach(key => {
      if (milestones[key].milestoneHash == 463010297) {
        flashpoint = milestones[key];
        return;
      }
    });

    var nightfall = false;
    Object.keys(milestones).forEach(key => {
      if (milestones[key].milestoneHash == 2171429505) {
        nightfall = milestones[key];
        return;
      }
    });
    
    var leviathan = false;
    Object.keys(milestones).forEach(key => {
      if (milestones[key].milestoneHash == 3660836525) {
        leviathan = milestones[key];
        return;
      }
    });

    var xur = false;
    Object.keys(milestones).forEach(key => {
      if (milestones[key].milestoneHash == 534869653) {
        xur = milestones[key];
        return;
      }
    });

    var trials = false;
    Object.keys(milestones).forEach(key => {
      if (milestones[key].milestoneHash == 3551755444) {
        trials = milestones[key];
        return;
      }
    });

    var image = "";
    var h2 = "";
    var p = "";
    var data = "";

    if (faction_rally) {

      image = "/milestones/faction_rally.jpg";
      h2 = "Faction Rally";
      p = "Great things can come out of the competitive spirit. Once, we competed to design the most accurate simulations of the local multiverse. I foresaw a bloody battle which came to pass in one. That was the beginning.";
      data = "faction_rally";

    }
    else if (iron_banner) {

      image = "/milestones/iron_banner.jpg";
      h2 = "Iron Banana";
      p = "The burden of the Iron Lords have been lifted, and the Guardians can once again march under a familiar Light. An Iron Banner.";
      data = "iron_banner";

    }
    else if (trials) {

      image = "/milestones/trials.jpg";
      h2 = "Trials of the Nine";
      p = "Enter the Trials of the Nine to face your fellow Guardians. Prepare to be judged.";
      data = "trials";

    }
    else {

      image = "https://bungie.net" + nightfall.activity.def.pgcrImage;
      h2 = nightfall.activity.def.displayProperties.name.replace(/Nightfall: /g, '');
      p = nightfall.activity.def.displayProperties.description;
      data = "nightfall";

    }

    if (xur) {

      var request = $.ajax({
        url: "https://braytech.org/api/?key=5afbd2ad6cb41&request=history&for=xur",
        method: "get",
        cache: true,
        dataType: "json"
      }).then();
    
      $.when(request).then(function(request) {

        var items = "";
        request.response.data.items.forEach(item => {
          if (item.hash == 759381183 || item.hash == 4285666432) {
            return;
          }
          items = items + `<li><div class="image" data-1x="https://bungie.net${ item.displayProperties.icon }" data-2x="https://bungie.net${ item.displayProperties.icon }"></div> ${ item.displayProperties.name }</li>`
        });

        $(".summary > ul").prepend(`<li>
          <ul>
            <li><span class="icon-faction_xur"></span></li>
            <li>
              <p><strong>Xûr, Agent of The Nine</strong></p>
              <p>View his wares before he disappears again...</p>
              <p>Find him in ${ request.response.data.location.region } on ${ request.response.data.location.world }</p>
              <ul class="items">${ items }</ul>
            </li>
          </ul>
        </li>`);

        domain.sentinel();

      });
    }

    // trials milestone
    if (trials) {
      $(".summary > ul").append(`<li>
        <ul>
          <li><span class="icon-faction_thenine"></span></li>
          <li>
            <p><strong>Trials of the Nine</strong></p>
            <p>Enter the Trials of the Nine to face your fellow Guardians. Prepare to be judged.</p>
            <div class="reward${ powerfulRewards.includes(trials.milestoneHash) ? ` powerful_engram` : `` }">
              <div class="image" data-1x="${ powerfulRewards.includes(trials.milestoneHash) ? `/assets/powerful_engram.png` : (trials.quests[0].rewardDef ? `https://bungie.net${ trials.quests[0].rewardDef.displayProperties.icon }` : ``) }" data-2x="${ powerfulRewards.includes(trials.milestoneHash) ? `/assets/powerful_engram.png` : (trials.quests[0].rewardDef ? `https://bungie.net${ trials.quests[0].rewardDef.displayProperties.icon }` : ``) }"></div> Spire Access
            </div>
          </li>
        </ul>
      </li>`);
    }

    // flashpoint milestone
    $(".summary > ul").append(`<li>
      <ul>
        <li><span class="icon-flashpoint"></span></li>
        <li>
          <p><strong>${ flashpoint.displayProperties.name }</strong></p>
          <p>${ flashpoint.displayProperties.description }</p>
          <div class="reward${ powerfulRewards.includes(flashpoint.milestoneHash) ? ` powerful_engram` : `` }">
            <div class="image" data-1x="${ powerfulRewards.includes(flashpoint.milestoneHash) ? `/assets/powerful_engram.png` : (flashpoint.quests[0].rewardDef ? `https://bungie.net${ flashpoint.quests[0].rewardDef.displayProperties.icon }` : ``) }" data-2x="${ powerfulRewards.includes(flashpoint.milestoneHash) ? `/assets/powerful_engram.png` : (flashpoint.quests[0].rewardDef ? `https://bungie.net${ flashpoint.quests[0].rewardDef.displayProperties.icon }` : ``) }"></div> Powerful engram
          </div>
        </li>
      </ul>
    </li>`);

    // nightfall milestone
    var challengesNightfall = "";
    nightfall.activity.def.challenges.forEach(challenge => {
      challengesNightfall = challengesNightfall + `<li><p>${ challenge.def.displayProperties.name }</p><p>${ challenge.def.displayProperties.description }</p></li>`
    });
    //if (faction_rally || iron_banner) {
      $(".summary > ul").append(`<li>
        <ul>
          <li><span class="icon-strike"></span></li>
          <li>
            <p><strong>${ nightfall.activity.def.displayProperties.name }</strong></p>
            <p>${ nightfall.activity.def.displayProperties.description }</p>
            <ul class="challenges">${ challengesNightfall }</ul>
            <div class="reward${ powerfulRewards.includes(nightfall.milestoneHash) ? ` powerful_engram` : `` }">
              <div class="image" data-1x="${ powerfulRewards.includes(nightfall.milestoneHash) ? `/assets/powerful_engram.png` : (nightfall.quests[0].rewardDef ? `https://bungie.net${ nightfall.quests[0].rewardDef.displayProperties.icon }` : ``) }" data-2x="${ powerfulRewards.includes(nightfall.milestoneHash) ? `/assets/powerful_engram.png` : (nightfall.quests[0].rewardDef ? `https://bungie.net${ nightfall.quests[0].rewardDef.displayProperties.icon }` : ``) }"></div> Powerful engram
            </div>
          </li>
        </ul>
      </li>`);
    //}

    $(".featured").attr("data-kind",data).html(`<div class="image" data-1x="${ image }" data-2x="${ image }"></div>
    <div class="text">
      <h2>${ h2 }</h2>
      <p>${ p }</p>
      ${ !faction_rally && !iron_banner && !trials ? `<!-- <ul class="challenges">${ challengesNightfall }</ul> -->` : `` }
    </div>`);

    // leviathan milestone
    var activityOrder = {
      417231112: [ "Pleasure Gardens", "The Gauntlet", "Royal Pools", "Throne" ],
      757116822: [ "The Gauntlet", "Royal Pools", "Pleasure Gardens", "Throne" ],
      1685065161: [ "The Gauntlet", "Pleasure Gardens", "Royal Pools", "Throne" ],
      2449714930: [ "Royal Pools", "The Gauntlet", "Pleasure Gardens", "Throne" ],
      2693136600: [ "Royal Pools", "The Gauntlet", "Pleasure Gardens", "Throne" ],
      2693136601: [ "Royal Pools", "Pleasure Gardens", "The Gauntlet", "Throne" ],
      2693136602: [ "Pleasure Gardens", "The Gauntlet", "Royal Pools", "Throne" ],
      2693136603: [ "Pleasure Gardens", "Royal Pools", "The Gauntlet", "Throne" ],
      2693136604: [ "The Gauntlet", "Royal Pools", "Pleasure Gardens", "Throne" ],
      2693136605: [ "The Gauntlet", "Pleasure Gardens", "Royal Pools", "Throne" ],
      3446541099: [ "Pleasure Gardens", "Royal Pools", "The Gauntlet", "Throne" ],
      3879860661: [ "Royal Pools", "Pleasure Gardens", "The Gauntlet", "Throne" ]
    }

    var challengesLeviathan = "";
    var skipChallenges = [3130639820, 1307301810, 1929618273, 4151037225];
    leviathan.activity.def.challenges.forEach(challenge => {
      if (skipChallenges.includes(challenge.objectiveHash)) {
        return;
      }
      challengesLeviathan = challengesLeviathan + `<li><p>${ challenge.def.displayProperties.name }</p><p>${ challenge.def.displayProperties.description }</p></li>`
    });
    var order = "";
    activityOrder[leviathan.activity.activityHash].forEach(activity => {
      order = order + `<li><p>${ activity }</p></li>`
    });

    $(".summary > ul").append(`<li>
      <ul>
        <li><span class="icon-raid"></span></li>
        <li>
          <p><strong>${ leviathan.activity.def.displayProperties.name }</strong></p>
          <p>${ leviathan.activity.def.displayProperties.description }</p>
          <!-- <ul class="challenges">${ challengesLeviathan }</ul> -->
          <ol class="order">${ order }</ol>
          <div class="reward${ powerfulRewards.includes(leviathan.milestoneHash) ? ` powerful_engram` : `` }">
            <div class="image" data-1x="${ powerfulRewards.includes(leviathan.milestoneHash) ? `/assets/powerful_engram.png` : (leviathan.quests[0].rewardDef ? `https://bungie.net${ leviathan.quests[0].rewardDef.displayProperties.icon }` : ``) }" data-2x="${ powerfulRewards.includes(leviathan.milestoneHash) ? `/assets/powerful_engram.png` : (leviathan.quests[0].rewardDef ? `https://bungie.net${ leviathan.quests[0].rewardDef.displayProperties.icon }` : ``) }"></div> Powerful engram
          </div>
        </li>
      </ul>
    </li>`);

    $(".summary > ul").append(`<li>
      <ul>
        <li><span class="icon-forsaken"></span></li>
        <li>
          <p><strong>Forsaken</strong></p>
          <p>Avenge our hunter Vanguard.</p>
          <p>${ Math.ceil(moment.duration(moment.tz("2018-09-04T09:00:00Z", "Europe/London").add(8, 'hours').diff(moment())).asWeeks()) } resets to go</p>
        </li>
      </ul>
    </li>`);

    domain.sentinel();

  });
  
}