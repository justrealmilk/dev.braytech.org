domain.clan = () => {
  
  if (!domain.clan.ManifestResponse) {

    domain.clan.init();

  }
  else {

    var stateSearch = decodeURIComponent(document.location.pathname).match(/\/clan\/([-0-9]+)\/(.+)\/([0-9]+)?/);
    var stateGroup = document.location.pathname.match(/\/clan\/view\/([0-9]+)?/);

    if (stateGroup) {
      domain.clan.GetGroup(stateGroup[1]);
    }
    else if (stateSearch) {
      domain.clan.SearchDestinyPlayer(stateSearch[1], encodeURIComponent(stateSearch[2]));
    }
    else {
      $(".view").removeClass("active");
      $(".view#search").addClass("active");
    }

  }

}

domain.clan.ManifestResponse = false;

domain.clan.init = () => {

  if (!domain.clan.ManifestResponse) {
    
    var DestinyDefinitionTables = $.ajax({
      url: "https://api.braytech.org/?request=manifest&table=DestinyActivityDefinition,DestinyActivityModeDefinition",
      method: "get",
      cache: true,
      dataType: "json",
      headers: {
        "X-Api-Key": apiKey.braytech
      }
    }).then();

    $.when(DestinyDefinitionTables).then((api3) => {

      domain.clan.ManifestResponse = {};
      domain.clan.ManifestResponse = api3.response.data;

      var inputTimeout;
      $("#search .player .form input").off("input").on("input", (e) => {
        //console.log(e);

        clearTimeout(inputTimeout);
        inputTimeout = setTimeout(() => {
          //console.log("requested");
          history.pushState(null, null, `/clan/-1/${ encodeURIComponent($("#search .form input").val()) }/`);
          domain.clan();
          ga('set', 'page', document.location.pathname);
			    ga('send', 'pageview');
          
        }, 1000);

      });

      $("#root").addClass("hasManifest");

      domain.clan();

    }); 

  }
  
}

domain.clan.utils = {};

domain.clan.utils.flagEnum = (state, value) => !!(state & value);

domain.clan.utils.enumerateCollectibleState = state => ({
  none: domain.clan.utils.flagEnum(state, 0),
  notAcquired: domain.clan.utils.flagEnum(state, 1),
  obscured: domain.clan.utils.flagEnum(state, 2),
  invisible: domain.clan.utils.flagEnum(state, 4),
  cannotAffordMaterialRequirements: domain.clan.utils.flagEnum(state, 8),
  inventorySpaceUnavailable: domain.clan.utils.flagEnum(state, 16),
  uniquenessViolation: domain.clan.utils.flagEnum(state, 32),
  purchaseDisabled: domain.clan.utils.flagEnum(state, 64)
});

domain.clan.utils.membershipTypeToString = (membershipType) => {

  var string;

  switch (membershipType) {
    case 1: string = "Xbox"; break;
    case 2: string = "PlayStation"; break;
    case 4: string = "PC"; break;
  }

  return string;
}

domain.clan.utils.classTypeToString = (classType) => {

  var string;

  switch (classType) {
    case 0: string = "Titan"; break;
    case 1: string = "Hunter"; break;
    case 2: string = "Warlock"; break;
  }

  return string;
}

domain.clan.SearchDestinyPlayer = (membershipType = -1, displayName = "justrealmilk") => {

  $("#search .player .form input").val(decodeURIComponent(displayName));

  if (domain.clan.SearchDestinyPlayer.request) {
    domain.clan.SearchDestinyPlayer.request.abort();
  }

  domain.clan.SearchDestinyPlayer.request = $.ajax({
    url: `https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/${ membershipType }/${ displayName }/`,
    method: "get",
    cache: false,
    dataType: "json",
    headers: {
      "X-Api-Key": apiKey.bungie
    }
  });

  $.when(domain.clan.SearchDestinyPlayer.request).then((api) => {

    $("#search .player .results ul").empty();

    //console.log(api);

    api.Response.forEach(result => {
      $("#search .player .results ul").append(`<li class="${ domain.clan.utils.membershipTypeToString(result.membershipType).toLowerCase() }" data-membershipType="${ result.membershipType }" data-membershipId="${ result.membershipId }">${ result.displayName }</li>`);
    });

    $("#search .player .results ul li").on("click", (e) => {

      var a = $(e.currentTarget).data("membershiptype");
      var b = $(e.currentTarget).data("membershipid");

      domain.clan.SearchGroupsByMember(a, b);

    });

  });
  
}

domain.clan.SearchGroupsByMember = (membershipType = 1, membershipId = "4611686018449662397") => {

  if (domain.clan.SearchGroupsByMember.request) {
    domain.clan.SearchGroupsByMember.request.abort();
  }

  domain.clan.SearchGroupsByMember.request = $.ajax({
    url: `https://www.bungie.net/Platform/GroupV2/User/${ membershipType }/${ membershipId }/0/1/`,
    method: "get",
    cache: false,
    dataType: "json",
    headers: {
      "X-Api-Key": apiKey.bungie
    }
  });

  $.when(domain.clan.SearchGroupsByMember.request).then((api) => {

    $("#search .group .results ul").empty();

    console.log(api);

    var result = api.Response.results.length > 0 ? api.Response.results[0] : false;

    if (result) {

      $("#search .group .results ul").append(`<li data-groupId="${ result.group.groupId }">
        <div class="header" data-members="${ result.group.memberCount }/${ result.group.features.maximumMembers }">
          <p>${ result.group.name }</p>
          <p>${ result.group.motto }</p>
        </div>
        <div class="about">
          ${ showdown.makeHtml(result.group.about) }
        </div>
      </li>`);
      
      $("#search .group .results ul li").on("click", (e) => {
  
        var a = $(e.currentTarget).data("groupid");
  
        history.pushState(null, null, `/clan/view/${ a }/`);
        domain.clan();
        ga('set', 'page', document.location.pathname);
        ga('send', 'pageview');
  
      });

    }

  });
  
}

domain.clan.GetGroup = (groupId = "3104516") => {

  var GetGroup = $.ajax({
    url: `https://www.bungie.net/Platform/GroupV2/${ groupId }/`,
    method: "get",
    cache: false,
    dataType: "json",
    headers: {
      "X-Api-Key": apiKey.bungie
    }
  });

  var GetMembersOfGroup = $.ajax({
    url: `https://www.bungie.net/Platform/GroupV2/${ groupId }/Members/`,
    method: "get",
    cache: false,
    dataType: "json",
    headers: {
      "X-Api-Key": apiKey.bungie
    }
  });

  $.when(GetGroup, GetMembersOfGroup).then((api1, api2) => {

    domain.clan.GetGroup.Response = {};

    domain.clan.GetGroup.Response.group = api1[0];
    domain.clan.GetGroup.Response.members = api2[0];
    // console.log(domain.clan.GetGroup.Response.group, domain.clan.GetGroup.Response.members);

    $("#clan .roster").empty().append(`<div class="header item" data-activity="99999999999999">
      <div class="col">Gamertag</div>
      <div class="col">Date joined</div>
      <div class="col">Current light</div>
      <div class="col">Class</div>
      <div class="col">Triumph score</div>
      <div class="col">Current activity</div>
    </div>`);

    var platforms = {
      1: 0,
      2: 0,
      4: 0
    }

    domain.clan.GetGroup.Response.members.Response.results.forEach(member => {

      platforms[member.destinyUserInfo.membershipType]++;

      $("#clan .roster").append(`<div class="member${ member.isOnline ? ` online` : `` } item" data-activity="${ member.isOnline ? `80` : `40` }" data-membershipId="${ member.destinyUserInfo.membershipId }" data-membershipType="${ member.destinyUserInfo.membershipType }">
        <div class="col">${ member.destinyUserInfo.displayName }</div>
        <div class="col">${ moment().from(moment.tz(member.joinDate, "Europe/London").tz(moment.tz.guess()), true) } ago</div>
      </div>`);

    });

    var commonPlatform = Object.keys(platforms).reduce((a, b) => platforms[a] > platforms[b] ? a : b);

    $("#clan .group").html(`<h2>${ domain.clan.GetGroup.Response.group.Response.detail.name }</h2>
    <div class="motto">${ domain.clan.GetGroup.Response.group.Response.detail.motto }</div>
    <div class="flex">
      <div class="c-1-3 about">
        <h4>About</h4>
        ${ showdown.makeHtml(domain.clan.GetGroup.Response.group.Response.detail.about) }
      </div>
      <div class="c-1-6 big">
        <h4>Founded</h4>
        ${ moment().from(moment.tz(domain.clan.GetGroup.Response.group.Response.detail.creationDate, "Europe/London").tz(moment.tz.guess()), true) } ago
      </div>
      <div class="c-1-6 big">
        <h4>Members</h4>
        ${ domain.clan.GetGroup.Response.group.Response.detail.memberCount }/${ domain.clan.GetGroup.Response.group.Response.detail.features.maximumMembers }
      </div>
      <div class="c-1-6 big">
        <h4>Platform</h4>
        ${ Math.ceil(platforms[commonPlatform] / Object.values(platforms).reduce( (accumulator, currentValue) => accumulator + currentValue) * 100) }% ${ domain.clan.utils.membershipTypeToString(parseInt(commonPlatform)) }
      </div>
    </div>`);

    var opts = {
      valueNames: [
        { data: ['activity'] }
      ]
    };
    lists.clan = new List('clan', opts);    
    lists.clan.sort('activity', { order: "desc", alphabet: "0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvXxYyZzÅåÄäÖö" });

    $(".view").removeClass("active");
    $(".view#clan").addClass("active");

    domain.clan.GetProfiles();

  });
  
}

domain.clan.GetProfiles = () => {

  domain.clan.GetGroup.Response.members.Response.results.forEach(member => {

    var request = $.ajax({
      url: `https://www.bungie.net/Platform/Destiny2/${ member.destinyUserInfo.membershipType }/Profile/${ member.destinyUserInfo.membershipId }/?components=100,200,204,900`,
      method: "get",
      cache: false,
      dataType: "json",
      headers: {
        "X-Api-Key": apiKey.bungie
      }
    });

    $.when(request).then((api) => {

      if (api.ErrorCode != 1) {
        console.warn(member.destinyUserInfo.membershipType + "/" + member.destinyUserInfo.membershipId + " - " + api.Message);
        return;
      }

      var response = api.Response;
      response.characters.data = Object.values(response.characters.data).sort(function(a, b) { return parseInt(b.minutesPlayedTotal) - parseInt(a.minutesPlayedTotal) });

      var activity = response.profile.data.dateLastPlayed;

      var currentActivity = ``;
      if (member.isOnline) {
        
        var activeCharacter = false;
        Object.keys(response.characterActivities.data).forEach(key => {
          if (response.characterActivities.data[key].currentActivityHash != 0) {
            activeCharacter = response.characterActivities.data[key];
            return;
          }
        });
        
        // console.log(response, activeCharacter, domain.clan.ManifestResponse.DestinyActivityModeDefinition[activeCharacter.currentActivityModeHash], domain.clan.ManifestResponse.DestinyActivityDefinition[activeCharacter.currentActivityHash]);

        var modeDefinition = domain.clan.ManifestResponse.DestinyActivityModeDefinition[activeCharacter.currentActivityModeHash];
        var activityDefinition = domain.clan.ManifestResponse.DestinyActivityDefinition[activeCharacter.currentActivityHash];


        var activity = activityDefinition ? (activityDefinition.displayProperties.name ? activityDefinition.displayProperties.name : false) : false;
        activity = activity ? activity : activityDefinition ? (activityDefinition.placeHash == 2961497387 ? `Orbit` : false) : false;

        var mode = activity == "Orbit" ? false : modeDefinition ? modeDefinition.displayProperties.name : false;

        currentActivity = `${ mode ? mode : `` }${ mode ? `: ` : `` }${ activity ? activity : `Ghosting` }`;
        activity = activeCharacter.dateActivityStarted;

      }


      $(`#clan .roster .member[data-membershipid="${ member.destinyUserInfo.membershipId }"`).attr("data-activity",moment(activity).unix()).append(`<div class="col">${ response.characters.data[0].light }</div>
      <div class="col">${ domain.clan.utils.classTypeToString(response.characters.data[0].classType) }</div>
      <div class="col">${ response.profileRecords.data.score }</div>
      <div class="col">${ member.isOnline ? currentActivity : `Last played ${ moment().from(moment.tz(response.profile.data.dateLastPlayed, "Europe/London").tz(moment.tz.guess()), true) } ago` }</div>`);

      lists.clan.reIndex();
      lists.clan.sort('activity', { order: "desc", alphabet: "0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvXxYyZzÅåÄäÖö" });

    });
      
  });
  
}