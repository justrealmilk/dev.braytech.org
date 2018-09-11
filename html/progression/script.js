domain.progression = () => {
  
  if (!domain.progression.ManifestResponse) {

    domain.progression.init();

  }
  else {

    var stateSearch = decodeURIComponent(document.location.pathname).match(/\/progression\/([-0-9]+)\/(.+)\/([0-9]+)?/);
    var stateProfile = document.location.pathname.match(/\/progression\/([-0-9]+)\/([0-9]+)\/([0-9]+)?/);

    if (stateProfile) {
      domain.progression.GetProfile(stateProfile[1], stateProfile[2], stateProfile[3]);
    }
    else if (stateSearch) {
      domain.progression.SearchDestinyPlayer(stateSearch[1], encodeURIComponent(stateSearch[2]));
    }
    else {

    }

  }

}

domain.progression.ManifestResponse = false;

domain.progression.init = () => {

  if (!domain.progression.ManifestResponse) {
  
    domain.sentinel();

    var DestinyPresentationNodeDefinition = $.ajax({
      url: "https://api.braytech.org/?request=manifest&table=DestinyPresentationNodeDefinition&hash=1246912440",
      method: "get",
      cache: true,
      dataType: "json",
      headers: {
        "X-Api-Key": apiKey.braytech
      }
    }).then();
    
    var DestinyChecklistDefinition = $.ajax({
      url: "https://api.braytech.org/?request=manifest&table=DestinyChecklistDefinition&hash=365218222,1697465175,3142056444,4178338182",
      method: "get",
      cache: true,
      dataType: "json",
      headers: {
        "X-Api-Key": apiKey.braytech
      }
    }).then();
    
    var DestinyDefinitionTables = $.ajax({
      url: "https://api.braytech.org/?request=manifest&table=DestinyDestinationDefinition,DestinyPlaceDefinition,DestinyActivityTypeDefinition,DestinyActivityDefinition",
      method: "get",
      cache: true,
      dataType: "json",
      headers: {
        "X-Api-Key": apiKey.braytech
      }
    }).then();

    $.when(DestinyPresentationNodeDefinition, DestinyChecklistDefinition, DestinyDefinitionTables).then((api1, api2, api3) => {

      domain.progression.ManifestResponse = {};

      domain.progression.ManifestResponse = api3[0].response.data;
      domain.progression.ManifestResponse.DestinyPresentationNodeDefinition = api1[0].response.data;
      domain.progression.ManifestResponse.DestinyChecklistDefinition = api2[0].response.data;

      var inputTimeout;
      $("#players .form input").off("input").on("input", (e) => {
        //console.log(e);

        clearTimeout(inputTimeout);
        inputTimeout = setTimeout(() => {
          //console.log("requested");
          history.pushState(null, null, `/progression/-1/${ encodeURIComponent($("#players .form input").val()) }/`);
          domain.progression();
          ga('set', 'page', document.location.pathname);
			    ga('send', 'pageview');
          
        }, 1000);

      });

      $(".frame").addClass("hasManifest");

      domain.progression();

    }); 

  }
  
}

domain.progression.utils = {};

domain.progression.utils.membershipTypeToString = (membershipType) => {

  var string;

  switch (membershipType) {
    case 1: string = "Xbox"; break;
    case 2: string = "PlayStation"; break;
    case 4: string = "PC"; break;
  }

  return string;
}

domain.progression.utils.classTypeToString = (classType) => {

  var string;

  switch (classType) {
    case 0: string = "Titan"; break;
    case 1: string = "Hunter"; break;
    case 2: string = "Warlock"; break;
  }

  return string;
}

domain.progression.SearchDestinyPlayer = (membershipType = -1, displayName = "justrealmilk") => {

  $("#players .form input").val(decodeURIComponent(displayName));

  if (domain.progression.SearchDestinyPlayer.request) {
    domain.progression.SearchDestinyPlayer.request.abort();
  }

  domain.progression.SearchDestinyPlayer.request = $.ajax({
    url: `https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/${ membershipType }/${ displayName }/`,
    method: "get",
    cache: false,
    dataType: "json",
    headers: {
      "X-Api-Key": apiKey.bungie
    }
  });

  $.when(domain.progression.SearchDestinyPlayer.request).then((api) => {

    $("#players .results ul").empty();

    console.log(api);

    api.Response.forEach(result => {
      $("#players .results ul").append(`<li class="${ domain.progression.utils.membershipTypeToString(result.membershipType).toLowerCase() }" data-membershipType="${ result.membershipType }" data-membershipId="${ result.membershipId }">${ result.displayName }</li>`);
    });

    $("#players .results ul li").on("click", (e) => {

      var a = $(e.currentTarget).data("membershiptype");
      var b = $(e.currentTarget).data("membershipid");

      history.pushState(null, null, `/progression/${ a }/${ b }/`);
      domain.progression();
      ga('set', 'page', document.location.pathname);
			ga('send', 'pageview');

    });

  });
  
}

domain.progression.ProfileResponse = {};

domain.progression.GetProfile = (membershipType = 1, membershipId = "4611686018449662397", characterId = undefined) => {

  if (domain.progression.ProfileResponse.profile) {
    if (domain.progression.ProfileResponse.profile.data.userInfo.membershipId == membershipId) {
      domain.progression.displayCharacterSummary(characterId);
      return;
    }
  }

  if (domain.progression.GetProfile.request) {
    domain.progression.GetProfile.request.abort();
  }

  var request = $.ajax({
    url: `https://www.bungie.net/Platform/Destiny2/${ membershipType }/Profile/${ membershipId }/?components=100,104,200,202,204,205,800,900`,
    method: "get",
    cache: false,
    dataType: "json",
    headers: {
      "X-Api-Key": apiKey.bungie
    }
  });

  $.when(request).then((api) => {

    if (api.ErrorCode != 1) {
      alert(api.Message);
      return;
    }

    domain.progression.ProfileResponse = api.Response;

    domain.progression.ProfileResponse.characters.data = Object.values(domain.progression.ProfileResponse.characters.data).sort(function(a, b) { return parseInt(b.minutesPlayedTotal) - parseInt(a.minutesPlayedTotal) });

    console.log(domain.progression.ProfileResponse);

    domain.progression.displayCharacters();
    domain.progression.displayAccountSummary();

    domain.progression.displayCharacterSummary(characterId);

    $(".frame").addClass("hasProfile");
    
  });
  
}

domain.progression.displayCharacters = () => {

  $("#characters .results ul").empty();

  domain.progression.ProfileResponse.characters.data.forEach(character => {

    var capped = domain.progression.ProfileResponse.characterProgressions.data[character.characterId].progressions[1716568313].level == domain.progression.ProfileResponse.characterProgressions.data[character.characterId].progressions[1716568313].levelCap ? true : false;
    var progress = capped ? domain.progression.ProfileResponse.characterProgressions.data[character.characterId].progressions[2030054750].progressToNextLevel / domain.progression.ProfileResponse.characterProgressions.data[character.characterId].progressions[2030054750].nextLevelAt : domain.progression.ProfileResponse.characterProgressions.data[character.characterId].progressions[1716568313].progressToNextLevel / domain.progression.ProfileResponse.characterProgressions.data[character.characterId].progressions[1716568313].nextLevelAt;
    
    $("#characters .results ul").append(`<li data-characterId="${ character.characterId }">
      <div class="image emblem${ character.emblemBackgroundPath ? `` : ` missing` }" data-1x="https://www.bungie.net${ character.emblemBackgroundPath ? character.emblemBackgroundPath : `/img/misc/missing_icon_d2.png` }" data-2x="https://www.bungie.net${ character.emblemBackgroundPath ? character.emblemBackgroundPath : `/img/misc/missing_icon_d2.png` }"></div>
      <div class="displayName">${ domain.progression.ProfileResponse.profile.data.userInfo.displayName }</div>
      <div class="class">${ domain.progression.utils.classTypeToString(character.classType) }</div>
      <div class="light">${ character.light }</div>
      <div class="level">Level ${ character.baseCharacterLevel }</div>
      <div class="progress">
        <div class="bar${ capped ? ` capped` : `` }" style="width: ${ progress * 100 }%"></div>
      </div>
    </li>`);
  });

  domain.sentinel();

  $("#characters .results ul li").on("click", (e) => {

    var c = $(e.currentTarget).data("characterid");

    $("#characters .results ul li").removeClass("active");
    $(e.currentTarget).addClass("active");

    history.pushState(null, null, `/progression/${ domain.progression.ProfileResponse.profile.data.userInfo.membershipType }/${ domain.progression.ProfileResponse.profile.data.userInfo.membershipId }/${ c }/`);
    ga('set', 'page', document.location.pathname);
    ga('send', 'pageview');

    domain.progression.displayCharacterSummary(c);

  });

}

domain.progression.displayAccountSummary = () => {

  $("#character .accountSummary").empty();

  var moments = ``;
  domain.progression.ManifestResponse.DestinyPresentationNodeDefinition[1246912440].children.records.forEach(manifest => {

    var skip = [1245880241, 1444407971];
    if (skip.includes(manifest.hash)) {
      return;
    }

    var complete = false;

    if (domain.progression.ProfileResponse.profileRecords.data.records[manifest.hash]) {

      domain.progression.ProfileResponse.profileRecords.data.records[manifest.hash].objectives.forEach(objective => {
        if (objective.objectiveHash == manifest.objectiveHashes[0]) {
          complete = objective.complete;
          return;
        }
      });

      moments = moments + `<li>
        <div class="completed${ complete ? ` true` : `` }"></div>
        <div class="text">
          <p>${ manifest.displayProperties.name }</p>
          <p>${ manifest.displayProperties.description }</p>
        </div>
      </li>`;

    }

  });

  $("#players .form input").attr("placeholder",domain.progression.ProfileResponse.profile.data.userInfo.displayName);

  $("#character .accountSummary").html(`<div class="c-1-2 totals">
    <div class="intScore">${ domain.progression.ProfileResponse.profileRecords.data.score }</div>
    <div class="textScore">TOTAL SCORE</div>
    <div class="textTime"><strong>${ Math.floor(Object.keys(domain.progression.ProfileResponse.characters.data).reduce(( sum, key ) => { return sum + parseInt( domain.progression.ProfileResponse.characters.data[key].minutesPlayedTotal); }, 0 ) / 1440) } days</strong> of combined play time in Destiny 2</div>
  </div>
  <div class="c-1-2 seals">
    <div class="seal">
      <div class="title">Chronicler</div>
      <div class="fraction">${ domain.progression.ProfileResponse.profileRecords.data.records[1754983323].objectives[0].progress }/${ domain.progression.ProfileResponse.profileRecords.data.records[1754983323].objectives[0].completionValue }</div>
      <div class="progress">
        <div class="bar" style="width: ${ domain.progression.ProfileResponse.profileRecords.data.records[1754983323].objectives[0].progress / domain.progression.ProfileResponse.profileRecords.data.records[1754983323].objectives[0].completionValue * 100 }%"></div>
      </div>
    </div>
    <div class="seal">
      <div class="title">Unbroken</div>
      <div class="fraction">${ domain.progression.ProfileResponse.profileRecords.data.records[3369119720].objectives[0].progress }/${ domain.progression.ProfileResponse.profileRecords.data.records[3369119720].objectives[0].completionValue }</div>
      <div class="progress">
        <div class="bar" style="width: ${ domain.progression.ProfileResponse.profileRecords.data.records[3369119720].objectives[0].progress / domain.progression.ProfileResponse.profileRecords.data.records[3369119720].objectives[0].completionValue * 100 }%"></div>
      </div>
    </div>
    <div class="seal">
      <div class="title">Dredgen</div>
      <div class="fraction">${ domain.progression.ProfileResponse.profileRecords.data.records[3798931976].objectives[0].progress }/${ domain.progression.ProfileResponse.profileRecords.data.records[3798931976].objectives[0].completionValue }</div>
      <div class="progress">
        <div class="bar" style="width: ${ domain.progression.ProfileResponse.profileRecords.data.records[3798931976].objectives[0].progress / domain.progression.ProfileResponse.profileRecords.data.records[3798931976].objectives[0].completionValue * 100 }%"></div>
      </div>
    </div>
    <div class="seal">
      <div class="title">Wayfarer</div>
      <div class="fraction">${ domain.progression.ProfileResponse.profileRecords.data.records[2757681677].objectives[0].progress }/${ domain.progression.ProfileResponse.profileRecords.data.records[2757681677].objectives[0].completionValue }</div>
      <div class="progress">
        <div class="bar" style="width: ${ domain.progression.ProfileResponse.profileRecords.data.records[2757681677].objectives[0].progress / domain.progression.ProfileResponse.profileRecords.data.records[2757681677].objectives[0].completionValue * 100 }%"></div>
      </div>
    </div>
    <div class="seal">
      <div class="title">Cursebreaker</div>
      <div class="fraction">${ domain.progression.ProfileResponse.profileRecords.data.records[1693645129].objectives[0].progress }/${ domain.progression.ProfileResponse.profileRecords.data.records[1693645129].objectives[0].completionValue }</div>
      <div class="progress">
        <div class="bar" style="width: ${ domain.progression.ProfileResponse.profileRecords.data.records[1693645129].objectives[0].progress / domain.progression.ProfileResponse.profileRecords.data.records[1693645129].objectives[0].completionValue * 100 }%"></div>
      </div>
    </div>
    <div class="seal">
      <div class="title">Rivensbane</div>
      <div class="fraction">&ndash;</div>
      <div class="progress">
        <div class="bar" style="width: 0%"></div>
      </div>
    </div>
  </div>`);

  

}

domain.progression.ManifestCharacterResponse = {};

domain.progression.displayCharacterSummary = (characterId = domain.progression.ProfileResponse.characters.data[0].characterId) => {

  $(`#characters .results ul li[data-characterId="${ characterId }"]`).addClass("active");

  var items = [];

  var emblem = 4274335291;
  Object.keys(domain.progression.ProfileResponse.characterEquipment.data[characterId].items).forEach(key => {
    if (domain.progression.ProfileResponse.characterEquipment.data[characterId].items[key].bucketHash == emblem) {
      emblem = domain.progression.ProfileResponse.characterEquipment.data[characterId].items[key];
      items.push(emblem.itemHash);
      return;
    }
  });

  var inventory = $.ajax({
    url: "https://api.braytech.org/?request=manifest&table=DestinyInventoryItemDefinition&mode=summary&hash=" + items.join(","),
    method: "get",
    cache: false,
    dataType: "json",
    headers: {
      "X-Api-Key": apiKey.braytech
    }
  }).then();

  $.when(inventory).then((api1) => {

    domain.progression.ManifestCharacterResponse.items = api1.response.data.items;
    console.log(domain.progression.ManifestCharacterResponse);


    $("#character .activity").empty();

    if (characterId == "2305843009260574394") {
    //domain.progression.ManifestResponse.DestinyActivityTypeDefinition[domain.progression.ProfileResponse.characterActivities.data[characterId].activityTypeHash].displayProperties.name } on ${ domain.progression.ManifestResponse.DestinyActivityDefinition[domain.progression.ProfileResponse.characterActivities.data[characterId].currentActivityHash].displayProperties.name
    console.log(domain.progression.ProfileResponse.characterActivities.data, domain.progression.ManifestResponse.DestinyActivityDefinition[domain.progression.ProfileResponse.characterActivities.data["2305843009260574394"].currentActivityHash].displayProperties.name);
    console.log(domain.progression.ManifestResponse.DestinyActivityTypeDefinition);
    $("#character .activity").html(`<h3>Activity</h3>
    <p>${ domain.progression.ManifestResponse.DestinyActivityTypeDefinition[domain.progression.ProfileResponse.characterActivities.data["2305843009260574394"].currentActivityModeHash].displayProperties.name } on ${ domain.progression.ManifestResponse.DestinyActivityDefinition[domain.progression.ProfileResponse.characterActivities.data["2305843009260574394"].currentActivityHash].displayProperties.name }</p>
    `);

    }

    

    var emblem = false;
    Object.entries(domain.progression.ManifestCharacterResponse.items).forEach(([key, value]) => {
      if (domain.progression.ManifestCharacterResponse.items[key].inventory.bucketTypeHash == 4274335291) {
        emblem = domain.progression.ManifestCharacterResponse.items[key];
        return;
      }
    });

    var sleeperNodes = ``;
    if (domain.progression.ProfileResponse.profileProgression.data.checklists[365218222]) {
      Object.entries(domain.progression.ProfileResponse.profileProgression.data.checklists[365218222]).forEach(([key, value]) => {
        var hash = key;
        var completed = value;
        var item = false;
        Object.entries(domain.progression.ManifestResponse.DestinyChecklistDefinition[365218222].entries).forEach(([pear, peach]) => {
          if (domain.progression.ManifestResponse.DestinyChecklistDefinition[365218222].entries[pear].checklistHash == hash) {
            item = domain.progression.ManifestResponse.DestinyChecklistDefinition[365218222].entries[pear];
            return;
          }
        });
        sleeperNodes = sleeperNodes + `<li class="item" data-state="${ completed ? `complete` : `incomplete` }" data-name="${ item.displayProperties.description.toString().replace("CB.NAV/RUN.()","").match(/.*?(?=\.)/)[0] }">
        <div class="completed${ completed ? ` true` : `` }"></div>
          <div class="text">
            <p>${ item.displayProperties.description.toString().replace("CB.NAV/RUN.()","") }</p>
          </div>
        </li>`;
      });
    }

    var regionChests = ``;
    if (domain.progression.ProfileResponse.characterProgressions.data[characterId].checklists[1697465175]) {
      Object.entries(domain.progression.ProfileResponse.characterProgressions.data[characterId].checklists[1697465175]).forEach(([key, value]) => {
        var hash = key;
        var completed = value;
        var item = false;
        Object.entries(domain.progression.ManifestResponse.DestinyChecklistDefinition[1697465175].entries).forEach(([pear, peach]) => {
          if (domain.progression.ManifestResponse.DestinyChecklistDefinition[1697465175].entries[pear].checklistHash == hash) {
            item = domain.progression.ManifestResponse.DestinyChecklistDefinition[1697465175].entries[pear];
            return;
          }
        });

        var destination = false;
        Object.keys(domain.progression.ManifestResponse.DestinyDestinationDefinition).forEach(subKey => {
          if (domain.progression.ManifestResponse.DestinyDestinationDefinition[subKey].hash == item.destinationHash) {
            destination = domain.progression.ManifestResponse.DestinyDestinationDefinition[subKey];
            return;
          }
        });
    
        var place = false;
        Object.keys(domain.progression.ManifestResponse.DestinyPlaceDefinition).forEach(subKey => {
          if (domain.progression.ManifestResponse.DestinyPlaceDefinition[subKey].hash == destination.placeHash) {
            place = domain.progression.ManifestResponse.DestinyPlaceDefinition[subKey];
            return;
          }
        });
    
        var regionchest = false;
        Object.keys(destination.bubbles).forEach(subKey => {
          if (destination.bubbles[subKey].hash == item.bubbleHash) {
            regionchest = destination.bubbles[subKey];
            return;
          }
        });
        
        regionChests = regionChests + `<li class="item" data-state="${ completed ? `complete` : `incomplete` }" data-name="${ place.displayProperties.name }">
        <div class="completed${ completed ? ` true` : `` }"></div>
          <div class="text">
            <p>${ regionchest.displayProperties.name }</p>
            <p>${ place.displayProperties.name }</p>
          </div>
        </li>`;
      });
    }
    
    var lostSectors = ``;
    if (domain.progression.ProfileResponse.characterProgressions.data[characterId].checklists[3142056444]) {
      Object.entries(domain.progression.ProfileResponse.characterProgressions.data[characterId].checklists[3142056444]).forEach(([key, value]) => {
        var hash = key;
        var completed = value;
        var item = false;
        Object.entries(domain.progression.ManifestResponse.DestinyChecklistDefinition[3142056444].entries).forEach(([pear, peach]) => {
          if (domain.progression.ManifestResponse.DestinyChecklistDefinition[3142056444].entries[pear].checklistHash == hash) {
            item = domain.progression.ManifestResponse.DestinyChecklistDefinition[3142056444].entries[pear];
            return;
          }
        });

        var destination = false;
        Object.keys(domain.progression.ManifestResponse.DestinyDestinationDefinition).forEach(subKey => {
          if (domain.progression.ManifestResponse.DestinyDestinationDefinition[subKey].hash == item.destinationHash) {
            destination = domain.progression.ManifestResponse.DestinyDestinationDefinition[subKey];
            return;
          }
        });
    
        var place = false;
        Object.keys(domain.progression.ManifestResponse.DestinyPlaceDefinition).forEach(subKey => {
          if (domain.progression.ManifestResponse.DestinyPlaceDefinition[subKey].hash == destination.placeHash) {
            place = domain.progression.ManifestResponse.DestinyPlaceDefinition[subKey];
            return;
          }
        });

        var lostsector = false;
        Object.keys(destination.bubbles).forEach(subKey => {
          if (destination.bubbles[subKey].hash == item.bubbleHash) {
            lostsector = destination.bubbles[subKey];
            return;
          }
        });
        
        lostSectors = lostSectors + `<li class="item" data-state="${ completed ? `complete` : `incomplete` }" data-name="${ place.displayProperties.name }">
        <div class="completed${ completed ? ` true` : `` }"></div>
          <div class="text">
            <p>${ lostsector.displayProperties.name }</p>
            <p>${ place.displayProperties.name }</p>
          </div>
        </li>`;
      });
    }

    $("#character .characterSummary").html(`
    <div class="c-1-1 checklistsToggle mobileOnly">
      <button class="square active" data-activates="list-sleeper_nodes"><i class="destiny-sleeper_nodes"></i></button><button class="square" data-activates="list-region_chests"><i class="destiny-region_chests"></i></button><button class="square" data-activates="list-lost_sectors"><i class="destiny-lost_sectors"></i></button>
    </div>
    <div class="c-1-3 checklists active" id="list-sleeper_nodes">
      <div class="header">
        <div class="icon">
          <i class="destiny-sleeper_nodes"></i>
        </div>
        <div class="title">Sleeping Beauty</div>
        <div class="description">Override the lock frequencies of Rasputin's Sleeper Nodes.</div>
      </div>
      <div class="progress">
        <div class="title">Nodes hacked</div>
        <div class="fraction">${ Object.values(domain.progression.ProfileResponse.profileProgression.data.checklists[365218222]).filter(value => value === true).length }/${ Object.keys(domain.progression.ProfileResponse.profileProgression.data.checklists[365218222]).length }</div>
        <div class="bar" style="width: ${ Object.values(domain.progression.ProfileResponse.profileProgression.data.checklists[365218222]).filter(value => value === true).length / Object.keys(domain.progression.ProfileResponse.profileProgression.data.checklists[365218222]).length * 100 }%"></div>
      </div>
      <ul class="checks single-line list">
        ${ sleeperNodes }
      </ul>
    </div>
    <div class="c-1-3 checklists" id="list-region_chests">
      <div class="header">
        <div class="icon">
          <i class="destiny-region_chests"></i>
        </div>
        <div class="title">Region Chests</div>
        <div class="description">Find the secret treasures hidden all around you.</div>
      </div>
      <div class="progress">
        <div class="title">Region chests looted</div>
        <div class="fraction">${ Object.values(domain.progression.ProfileResponse.characterProgressions.data[characterId].checklists[1697465175]).filter(value => value === true).length }/${ Object.keys(domain.progression.ProfileResponse.characterProgressions.data[characterId].checklists[1697465175]).length }</div>
        <div class="bar" style="width: ${ Object.values(domain.progression.ProfileResponse.characterProgressions.data[characterId].checklists[1697465175]).filter(value => value === true).length / Object.keys(domain.progression.ProfileResponse.characterProgressions.data[characterId].checklists[1697465175]).length * 100 }%"></div>
      </div>
      <ul class="checks list">
        ${ regionChests }
      </ul>
    </div>
    <div class="c-1-3 checklists" id="list-lost_sectors">
      <div class="header">
        <div class="icon">
          <i class="destiny-lost_sectors"></i>
        </div>
        <div class="title">Lost Sectors</div>
        <div class="description">Discover all Lost Sectors.</div>
      </div>
      <div class="progress">
        <div class="title">Lost Sectors discovered</div>
        <div class="fraction">${ Object.values(domain.progression.ProfileResponse.characterProgressions.data[characterId].checklists[3142056444]).filter(value => value === true).length }/${ Object.keys(domain.progression.ProfileResponse.characterProgressions.data[characterId].checklists[3142056444]).length }</div>
        <div class="bar" style="width: ${ Object.values(domain.progression.ProfileResponse.characterProgressions.data[characterId].checklists[3142056444]).filter(value => value === true).length / Object.keys(domain.progression.ProfileResponse.characterProgressions.data[characterId].checklists[3142056444]).length * 100 }%"></div>
      </div>
      <ul class="checks list">
        ${ lostSectors }
      </ul>
    </div>`);

    domain.sentinel();

    $("#character .characterSummary .checklistsToggle button").on("click", (e) => {
      var a = $(e.currentTarget).data("activates");
      $("#character .characterSummary .checklistsToggle button").removeClass("active");
      $(e.currentTarget).addClass("active");
      $("#character .characterSummary .checklists").removeClass("active");
      $("#" + a).addClass("active");
    });

    var opts = {
      valueNames: [
        { data: ['name'] },
        { data: ['state'] }
      ]
    };
    lists.sleeperNodes = new List('list-sleeper_nodes', opts);
    lists.sleeperNodes.sort('name', { order: "asc" });

    var opts = {
      valueNames: [
        { data: ['name'] },
        { data: ['state'] }
      ]
    };
    lists.regionChests = new List('list-region_chests', opts);
    lists.regionChests.sort('name', { order: "asc" });

    var opts = {
      valueNames: [
        { data: ['name'] },
        { data: ['state'] }
      ]
    };
    lists.lostSectors = new List('list-lost_sectors', opts);
    lists.lostSectors.sort('name', { order: "asc" });

  });

}