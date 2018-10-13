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

    // var DestinyPresentationNodeDefinition = $.ajax({
    //   url: "https://api.braytech.org/?request=manifest&table=DestinyPresentationNodeDefinition&hash=1246912440",
    //   method: "get",
    //   cache: true,
    //   dataType: "json",
    //   headers: {
    //     "X-Api-Key": apiKey.braytech
    //   }
    // }).then();
    
    var DestinyChecklistDefinition = $.ajax({
      url: "https://api.braytech.org/?request=manifest&table=DestinyChecklistDefinition&hash=365218222,1697465175,3142056444,4178338182,2360931290,2448912219,2955980198",
      method: "get",
      cache: true,
      dataType: "json",
      headers: {
        "X-Api-Key": apiKey.braytech
      }
    }).then();
    
    var DestinyDefinitionTables = $.ajax({
      url: "https://api.braytech.org/?request=manifest&table=DestinyDestinationDefinition,DestinyPlaceDefinition,DestinyPresentationNodeDefinition,DestinyRecordDefinition,DestinyProgressionDefinition,DestinyCollectibleDefinition",
      method: "get",
      cache: true,
      dataType: "json",
      headers: {
        "X-Api-Key": apiKey.braytech
      }
    }).then();

    $.when(DestinyChecklistDefinition, DestinyDefinitionTables).then((api2, api3) => {

      domain.progression.ManifestResponse = {};

      domain.progression.ManifestResponse = api3[0].response.data;
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

      $("#character .header .sections button").on("click", (e) => {
        var a = $(e.currentTarget).data("activates");
        $("#character .header .sections button").removeClass("active");
        $(e.currentTarget).addClass("active");
        $("#character .section").removeClass("active");
        $("#" + a).addClass("active");
      });

      $("#root .frame").addClass("hasManifest");

      domain.progression();
      domain.progression.renderer();

    }); 

  }
  
}



domain.progression.renderer = () => {

  //#region render
  scene = new THREE.Scene();
  group = new THREE.Group();
  group.rotation.set((10 * Math.PI / 180), (30 * Math.PI / 180), 0);
  scene.add(group);
  var width = $(".canvas").width();
  var height = $(".canvas").height();

  // renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = THREE.PCFShadowMap;
  
  camera = new THREE.PerspectiveCamera(35, width / height, 1, 10000);
  camera.position.set(0, 0, 13.43);

  domain.progression.renderer.lights = [];

  domain.progression.renderer.lights[1] = new THREE.PointLight(0xffffff, 1);
  domain.progression.renderer.lights[1].position.set(1, 10, -0.5);
  // domain.progression.renderer.lights[1].castShadow = true;
  // domain.progression.renderer.lights[1].shadow.bias = 0.0001;
  // domain.progression.renderer.lights[1].shadow.mapSize.width = 2048;
  // domain.progression.renderer.lights[1].shadow.mapSize.height = 2048;
  // domain.progression.renderer.lights[1].shadow.camera.near = 0.5;
  // domain.progression.renderer.lights[1].shadow.camera.far = 100;
  scene.add(domain.progression.renderer.lights[1]);

  domain.progression.renderer.lights[2] = new THREE.PointLight(0xffffff, 0.8);
  domain.progression.renderer.lights[2].position.set(20, 0, 20);
  scene.add(domain.progression.renderer.lights[2]);

  domain.progression.renderer.lights[3] = new THREE.PointLight(0xffffff, 0.8);
  domain.progression.renderer.lights[3].position.set(-20, 0, 20);
  scene.add(domain.progression.renderer.lights[3]);
  
  //renderer in core.js
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  $(".canvas").append(renderer.domElement);

  THREE.TGXLoader.APIKey = '4895831b87ad48b091cc56f25337a3e6';
  THREE.TGXLoader.APIBasepath = "https://www.bungie.net/Platform/Destiny2"; // The basepath for making API requests
  THREE.TGXLoader.Basepath = "https://www.bungie.net"; // The basepath to load gear assets from
  THREE.TGXLoader.Platform = "mobile"; // Whether to use "web" or "mobile" gear assets (note the latter requires extra setup to use.
  THREE.TGXLoader.ManifestPath2 = "/api/tgx/?id=$itemHash"; // The url for server-side manifest querying. Must include $itemHash
  THREE.TGXLoader.NoCache = false; // Whether to force assets to ignore caching.
  THREE.TGXLoader.Game = 'destiny2';

  //var controls = new THREE.OrbitControls(camera, renderer.domElement);
  //controls.maxPolarAngle = Math.PI / 2;
  // controls.enableDamping = true;
  // controls.enablePan = true;
  // controls.enableZoom = true;
  // controls.dampingFactor = 0.25;
  //controls.autoRotate = true;
  //controls.autoRotateSpeed = -2;

  var render = function() {
    
    //group.rotation.x += -0.005;

    ////controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);

  };

  render();

  var toRadian = Math.PI / 180;

  var camera_timeline = anime.timeline({
    loop: true
  });
  
  camera_timeline
  .add({
    targets: group.position,
    y: [-0.1, 0.1],
    easing: 'easeInOutQuad',
    duration: 3000,
    offset: 0,
    run: function() {
      
    }
  })
  .add({
    targets: group.position,
    y: [0.1, -0.1],
    easing: 'easeInOutQuad',
    duration: 3000,
    offset: 3000
  })

  //#endregion render

}

domain.progression.renderer.item = (hash, requestedOrnamentHash) => {

  //requestedOrnamentHash = requestedOrnamentHash == "default" ? "0" : requestedOrnamentHash;

  // var item;
  // Object.keys(domain.database.json.response.data.items).forEach(function(key) {
  //   if (domain.database.json.response.data.items[key].hash == hash) {
  //     item = domain.database.json.response.data.items[key];
  //     return;
  //   }
  // });

  function renderHash(hash, ornamentHash, scale) {

    $(".canvas").removeClass("error").addClass("loading");
      
    if (group.children.length > 0) {
      //if (group.children[0].name != hash) {
        for (var i = group.children.length - 1; i >= 0; i--) {
          group.remove(group.children[i]);
        }
      //}
      //else {
      //  return;
      //}
    }

    
    THREE.DefaultLoadingManager = new THREE.LoadingManager();
    var manager = THREE.DefaultLoadingManager;
    manager.onProgress = function(url, count, total) {
      //console.log('Progress', url, count, total, count==total);
      // if (count == total) {
      //   $(".three.loader-icon", x).removeClass("visible");
      // }
    };

    var options = {
      itemHash: hash,
      ornamentHash: ornamentHash,
      manifestPath: "https://api.braytech.org/tgx/?id=$itemHash"
    };
    var mesh;
    var loader = new THREE.TGXLoader();
    
    loader.load(options, function(geometry, materials) {
      
      mesh = new THREE.Mesh(geometry, materials);
      mesh.name = hash;
      mesh.geometry.center(); 
      var toRadian = Math.PI / 180;
      mesh.scale.set(scale, scale, scale);
      mesh.position.set(3, -0.5, 1);
      mesh.rotation.x = -90 * toRadian;
      mesh.rotation.z = 180 * toRadian;

      // mesh.castShadow = true;
      // mesh.receiveShadow = true;
      
      group.add(mesh);

      $(".canvas").removeClass("loading");

    },
    function(xhr) {
      //console.log(xhr.loaded, xhr.total, xhr);
    },
    function(err) {
      //console.error('An error happened', err);
      $(".canvas").removeClass("loading").addClass("error");
    });
  }

  var scale = 14;

  // switch (item.inventory.bucketTypeHash) {
  //   case 3448274439: //helmet
  //     scale = 10;
  //     break;
  //   case 14239492: //chest
  //     scale = 3;
  //     break;
  //   case 3551918588: //gauntlets
  //     scale = 7;
  //     break;
  //   case 20886954: //legs
  //     scale = 4;
  //     break;
  //   case 4023194814: //ghost
  //     scale = 27;
  //     break;
  //   case 2025709351: //sparrow
  //     scale = 2;
  //     break;
  //   case 284967655: //ship
  //     scale = 0.33;
  //     break;
  // }

  var ornamentHash = requestedOrnamentHash == "default" || requestedOrnamentHash == undefined ? 0 : requestedOrnamentHash;

  // switch (item.hash) {
  //   case 3844694310:
  //     scale = 8;
  //     break;
  //   case 3437746471:
  //     scale = 14.8;
  //     break;
  //   case 3628991659:
  //     scale = 7.5;
  //     break;
  //   case 1345867570:
  //     scale = 7.5;
  //     break;
  //   case 1331482397:
  //     scale = 12;
  //     break;
  //   case 2362471601:
  //     scale = 18;
  //     break;
  //   case 19024058:
  //     scale = 9;
  //     break;
  //   case 3089417789:
  //     scale = 11;
  //     break;
  //   case 3628991658:
  //     scale = 10;
  //     break;
  //   case 4124984448:
  //     scale = 10;
  //     break;
  //   case 1345867571:
  //     scale = 9;
  //     break;
  //   case 3899270607:
  //     scale = 10;
  //     break;
  //   case 3141979347:
  //     scale = 7;
  //     break;
  //   case 4190156464:
  //     scale = 11;
  //     break;
  //   case 1508896098:
  //     scale = 10;
  //     break;
  //   case 3141979346:
  //     scale = 6;
  //     break;
  //   case 3580904580:
  //     scale = 9;
  //     break;
  //   case 3549153979:
  //     scale = 10;
  //     break;
  //   case 1864563948:
  //     scale = 4;
  //     break;
  //   case 4036115577:
  //     scale = 8;
  //     break;
  //   case 2856683562:
  //     scale = 11;
  //     break;
  //   case 2286143274:
  //     scale = 13;
  //     break;
  //   case 3413074534:
  //     scale = 10;
  //     break;
  //   case 2907129556:
  //     scale = 13.8;
  //     break;
  //   case 3413074534:
  //     scale = 8;
  //     break;
  //   case 4255268456:
  //     scale = 11;
  //     break;
  //   case 2208405142:
  //     scale = 12;
  //     break;
  //   case 3141979347:
  //     scale = 6;
  //     break;
  //   case 3580904581:
  //     scale = 13;
  //     break;
  //   case 3549153979:
  //     scale = 9;
  //     break;
  //   case 3580904580:
  //     scale = 8;
  //     break;

  //   // helmets
  //   case 1643575148:
  //     scale = 15;
  //     break;
  //   case 3897389303:
  //     scale = 20;
  //     break;
  //   case 2897117448:
  //     scale = 18;
  //     break;
  //   case 2600992433:
  //     scale = 20;
  //     break;
  //   case 3008550972:
  //     scale = 8;
  //     break;
  //   case 3926392527:
  //     scale = 20;
  //     break;
  //   case 1667080810:
  //     scale = 20;
  //     break;
  //   case 2523259394:
  //     scale = 20;
  //     break;
  //   case 197761152:
  //     scale = 8;
  //     break;
  //   case 2523259392:
  //     scale = 18;
  //     break;
  //   case 1667080811:
  //     scale = 20;
  //     break;
  //   case 197761153:
  //     scale = 18;
  //     break;
  //   case 1667080809:
  //     scale = 18;
  //     break;

  //   // chest
  //   case 3392742912:
  //     scale = 7;
  //     break;
  //   case 2829609851:
  //     scale = 9;
  //     break;
  //   case 2422973183:
  //     scale = 3.4;
  //     break;
  //   case 1799380614:
  //     scale = 3.3;
  //     break;
  //   case 419976111:
  //     scale = 7;
  //     break;
  //   case 458095280:
  //     scale = 9;
  //     break;
  //   case 458095281:
  //     scale = 9;
  //     break;
  //   case 419976110:
  //     scale = 7;
  //     break;
  //   case 458095282:
  //     scale = 9;
  //     break;
  // }

  //if (item.inventory.bucketTypeHash != 3054419239) {
    renderHash(hash, ornamentHash, scale);
  //}

}

domain.progression.utils = {};

domain.progression.utils.flagEnum = (state, value) => !!(state & value);

domain.progression.utils.enumerateCollectibleState = state => ({
  none: domain.progression.utils.flagEnum(state, 0),
  notAcquired: domain.progression.utils.flagEnum(state, 1),
  obscured: domain.progression.utils.flagEnum(state, 2),
  invisible: domain.progression.utils.flagEnum(state, 4),
  cannotAffordMaterialRequirements: domain.progression.utils.flagEnum(state, 8),
  inventorySpaceUnavailable: domain.progression.utils.flagEnum(state, 16),
  uniquenessViolation: domain.progression.utils.flagEnum(state, 32),
  purchaseDisabled: domain.progression.utils.flagEnum(state, 64)
});

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

    //console.log(api);

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
domain.progression.activeCharacterId = undefined;

domain.progression.GetProfile = (membershipType = 1, membershipId = "4611686018449662397", characterId) => {

  if (domain.progression.ProfileResponse.profile) {
    if (domain.progression.ProfileResponse.profile.data.userInfo.membershipId == membershipId) {
      domain.progression.activeCharacterId = characterId ? characterId : domain.progression.ProfileResponse.characters.data[0].characterId;
      domain.progression.displayCollectibles(domain.progression.activeCharacterId);
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
    
    domain.progression.activeCharacterId = characterId ? characterId : domain.progression.ProfileResponse.characters.data[0].characterId;

    domain.progression.displayCharacters();
    domain.progression.displayAccountSummary();
    domain.progression.displayRanks();
    domain.progression.displayExotics();
    $("#triumphSeals").empty();
    $("#triumphSeals").append(`<h4>Triumph Seals</h4>`);
    domain.progression.displayTriumphSummary(2588182977);
    domain.progression.displayTriumphSummary(2693736750);
    domain.progression.displayTriumphSummary(147928983);
    domain.progression.displayTriumphSummary(3481101973);
    domain.progression.displayTriumphSummary(2516503814);
    //domain.progression.displayTriumphSummary(1162218545);
    domain.sentinel();

    domain.progression.displayCollectibles(characterId);

    $("#root .frame").addClass("hasProfile");

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


    history.pushState(null, null, `/progression/${ domain.progression.ProfileResponse.profile.data.userInfo.membershipType }/${ domain.progression.ProfileResponse.profile.data.userInfo.membershipId }/${ c }/`);
    ga('set', 'page', document.location.pathname);
    ga('send', 'pageview');

    domain.progression.activeCharacterId = c;

    domain.progression.displayCollectibles(domain.progression.activeCharacterId);

  });

}

domain.progression.displayAccountSummary = () => {

  $("#players .form input").attr("placeholder",domain.progression.ProfileResponse.profile.data.userInfo.displayName);

  $("#character .header .summary").html(`<div class="c-1-2">
    <h4>Total score</h4>
    <div class="triumphsScore">${ domain.progression.ProfileResponse.profileRecords.data.score }</div>
  </div>
  <div class="c-1-2">
    <h4>Total days playtime</h4>
    <div class="timePlayed">${ Math.floor(Object.keys(domain.progression.ProfileResponse.characters.data).reduce((sum, key) => { return sum + parseInt( domain.progression.ProfileResponse.characters.data[key].minutesPlayedTotal); }, 0 ) / 1440) }</div>
  </div>`);

  

}

domain.progression.displayRanks = () => {

  let infamyDefinition = domain.progression.ManifestResponse.DestinyProgressionDefinition[2772425241];
  let infamyProgression = domain.progression.ProfileResponse.characterProgressions.data[domain.progression.activeCharacterId].progressions[2772425241];

  let infamyProgressTotal = Object.keys(infamyDefinition.steps).reduce((sum, key) => { return sum +  infamyDefinition.steps[key].progressTotal }, 0 );

  var infamySteps = ``;
  Object.keys(infamyDefinition.steps).forEach(key => {
    let step = infamyDefinition.steps[key];
    infamySteps = infamySteps + `<div class="step index${ key }" data-stepName="${ step.stepName.replace(/ .*/, "") }" style="flex-basis: ${ step.progressTotal / infamyProgressTotal * 100 }%"></div>`;
  });

  let valorDefinition = domain.progression.ManifestResponse.DestinyProgressionDefinition[3882308435];
  let valorProgression = domain.progression.ProfileResponse.characterProgressions.data[domain.progression.activeCharacterId].progressions[3882308435];

  let valorProgressTotal = Object.keys(valorDefinition.steps).reduce((sum, key) => { return sum +  valorDefinition.steps[key].progressTotal }, 0 );

  var valorSteps = ``;
  Object.keys(valorDefinition.steps).forEach(key => {
    let step = valorDefinition.steps[key];
    valorSteps = valorSteps + `<div class="step index${ key }" data-stepName="${ step.stepName.replace(/ .*/, "") }" style="flex-basis: ${ step.progressTotal / valorProgressTotal * 100 }%"></div>`;
  });

  let gloryDefinition = domain.progression.ManifestResponse.DestinyProgressionDefinition[2679551909];
  let gloryProgression = domain.progression.ProfileResponse.characterProgressions.data[domain.progression.activeCharacterId].progressions[2679551909];

  let gloryProgressTotal = Object.keys(gloryDefinition.steps).reduce((sum, key) => { return sum +  gloryDefinition.steps[key].progressTotal }, 0 );

  var glorySteps = ``;
  Object.keys(gloryDefinition.steps).forEach(key => {
    let step = gloryDefinition.steps[key];
    glorySteps = glorySteps + `<div class="step index${ key }" data-stepName="${ step.stepName.replace(/ .*/, "") }" style="flex-basis: ${ step.progressTotal / gloryProgressTotal * 100 }%"></div>`;
  });

  $("#ranks").html(`<h4>Ranks (Preview)</h4>
  <div class="gambit">
    <div class="kind">Infamy</div>
    <div class="friendly">Gambit</div>
    <div class="steps">
      ${ infamySteps }
      <div class="progress">
        <div class="bar" data-xp="${ infamyProgression.currentProgress }" style="width: ${ infamyProgression.currentProgress / infamyProgressTotal * 100 }%"></div>
      </div>
    </div>
  </div>
  <div class="valor">
    <div class="kind">Valor</div>
    <div class="friendly">Quickplay playlists</div>
    <div class="steps">
      ${ valorSteps }
      <div class="progress">
        <div class="bar" data-xp="${ valorProgression.currentProgress }" style="width: ${ valorProgression.currentProgress / valorProgressTotal * 100 }%"></div>
      </div>
    </div>
  </div>
  <div class="glory">
    <div class="kind">Glory</div>
    <div class="friendly">Competitive playlists</div>
    <div class="steps">
      ${ glorySteps }
      <div class="progress">
        <div class="bar" data-xp="${ gloryProgression.currentProgress }" style="width: ${ gloryProgression.currentProgress / gloryProgressTotal * 100 }%"></div>
      </div>
    </div>
  </div>`);
  

}

domain.progression.displayExotics = () => {

  var nodes = [2969886327, 3919988882, 1139971093, 1573256543, 2598675734, 2765771634];

  $("#exotics").empty().append(`<h4>Exotics</h4>`);

  nodes.forEach(hash => {

    let node = domain.progression.ManifestResponse.DestinyPresentationNodeDefinition[hash];

    var items = ``;
    var discovered = 0;
    node.children.collectibles.forEach(item => {

      let collectible = domain.progression.ManifestResponse.DestinyCollectibleDefinition[item.collectibleHash];
      let state = domain.progression.ProfileResponse.profileCollectibles.data.collectibles[collectible.hash] ? domain.progression.ProfileResponse.profileCollectibles.data.collectibles[collectible.hash].state : domain.progression.ProfileResponse.characterCollectibles.data[domain.progression.activeCharacterId].collectibles[collectible.hash].state;
  
      if (!domain.progression.utils.enumerateCollectibleState(state).notAcquired) {
        discovered++;
      }

      items = items + `<div class="item link${ !domain.progression.utils.enumerateCollectibleState(state).notAcquired ? ` discovered` : `` }" data-itemHash="${ collectible.itemHash }">
        <div class="icon">  
          <div class="image" data-1x="https://www.bungie.net${ collectible.displayProperties.icon }" data-2x="https://www.bungie.net${ collectible.displayProperties.icon }"></div>
        </div>
        <div class="text">
          <div class="name">${ collectible.displayProperties.name }</div>
        </div>
      </div>`;
    });
  
    $("#exotics").append(`<div class="kind flex" id="${ node.hash }">
      <div class="c-1-4">
        <div class="header">
          <div class="name">${ node.displayProperties.name }</div>
        </div>
        <div class="bottom">
          <div class="progress">
            <div class="title">Items discovered</div>
            <div class="fraction">${ discovered }/${ node.children.collectibles.length }</div>
            <div class="bar" style="width: ${ discovered / node.children.collectibles.length * 100 }%"></div>
          </div>
        </div>
      </div>
      <div class="c-3-4 items">
        ${ items }
      </div>
    </div>`);
    
  });

  $(".item.link").on("click", (e) => {

    var c = $(e.currentTarget).data("itemhash");

    if (c) {
      domain.progression.displayItem(c);
    }

  });
  

}

domain.progression.ManifestItemResponse = {};

domain.progression.displayItem = (itemHash) => {

  //var itemHash = "2044500762";

  var item = $.ajax({
    url: "https://api.braytech.org/?request=manifest&table=DestinyInventoryItemDefinition&hash=" + itemHash,
    method: "get",
    cache: false,
    dataType: "json",
    headers: {
      "X-Api-Key": apiKey.braytech
    }
  }).then();

  $.when(item).then((api1) => {

    domain.progression.ManifestItemResponse = api1.response.data;

    var item = domain.progression.ManifestItemResponse.items[0];
    console.log(item);

    var socketIndexes;
    Object.keys(item.sockets.socketCategories).forEach(key => {
      if (item.sockets.socketCategories[key].socketCategoryHash == 4241085061) {
        socketIndexes = item.sockets.socketCategories[key].socketIndexes;
        return;
      }
    });
    
    var modIndexes;
    Object.keys(item.sockets.socketCategories).forEach(key => {
      if (item.sockets.socketCategories[key].socketCategoryHash == 2685412949) {
        modIndexes = item.sockets.socketCategories[key].socketIndexes;
        return;
      }
    });

    var perks = ``;
    Object.values(socketIndexes).forEach(key => {
      var socket = item.sockets.socketEntries[key];
      
      if (socket.socketTypeHash == 1282012138) {
        return;
      }

      var plugs = ``;
      socket.reusablePlugItems.forEach((plug) => {
        plugs = plugs + `<div class="plug${ socket.singleInitialItemHash == plug.hash ? ` selected` : `` }${ plug.itemCategoryHashes.includes(2237038328) ? ` intrinsic` : `` }">
          <div class="icon">
            <div class="image" data-1x="https://www.bungie.net${ plug.displayProperties.icon }" data-2x="https://www.bungie.net${ plug.displayProperties.icon }"></div>
          </div>
        </div>`;
      });

      perks = perks + `<div class="socket">${ plugs }</div>`;
    });

    var mods = ``;
    var modsInteger = 0;
    Object.values(modIndexes).forEach(key => {
      var mod = item.sockets.socketEntries[key];
      
      if (mod.socketTypeHash == 3969713706) {
        return;
      }

      modsInteger++;

      var plugs = ``;
      mod.reusablePlugItems.forEach((plug) => {
        plugs = plugs + `<div class="plug${ mod.singleInitialItemHash == plug.hash ? ` selected` : `` }">
          <div class="icon">
            <div class="image" data-1x="https://www.bungie.net${ plug.displayProperties.icon }" data-2x="https://www.bungie.net${ plug.displayProperties.icon }"></div>
          </div>
        </div>`;
      });

      mods = mods + `<div class="socket">${ plugs }</div>`;
    });



    $("#itemInspect .frame").html(`<div class="rarity"></div>
    <div class="alpha">
      <div class="header flex">
        <div class="image icon" data-1x="https://www.bungie.net${ item.displayProperties.icon }" data-2x="https://www.bungie.net${ item.displayProperties.icon }"></div>
        <div class="text">
          <div class="name">${ item.displayProperties.name }</div>
          <div class="type">${ item.itemTypeDisplayName }</div>
        </div>
      </div>
      <div class="description">${ item.displayProperties.description }</div>
      <h3>Weapon perks</h3>
      <div class="perks sockets flex">${ perks }</div>
      ${ modsInteger > 0 ? `<h3>Weapon mods</h3>
      <div class="mods sockets flex">${ mods }</div>` : `` }
    </div>
    <div class="beta"></div>`);



    $("#itemInspect").addClass("open");

    domain.sentinel();

    domain.progression.renderer.item(item.hash);

  });

}

domain.progression.ManifestLoreResponse = {};

domain.progression.displayLoreBook = (bookHash) => {

  var book = domain.progression.ManifestResponse.DestinyPresentationNodeDefinition[bookHash];
  var loreHashes = {};

  book.children.records.forEach(record => {
    let lookup = domain.progression.ManifestResponse.DestinyRecordDefinition[record.recordHash];
    if (lookup.loreHash) {
      loreHashes[record.recordHash] = lookup.loreHash;
    }
  });

  console.log(domain.progression.activeCharacterId);

  var lore = $.ajax({
    url: "https://api.braytech.org/?request=manifest&table=DestinyLoreDefinition&hash=" + Object.values(loreHashes).join(","),
    method: "get",
    cache: false,
    dataType: "json",
    headers: {
      "X-Api-Key": apiKey.braytech
    }
  }).then();

  $.when(lore).then((api1) => {

    domain.progression.ManifestLoreResponse = api1.response.data;
    console.log(domain.progression.ManifestLoreResponse);

    var chapters = ``;
    Object.values(domain.progression.ManifestLoreResponse).forEach(chapter => {
      var recordHash = false;
      Object.keys(loreHashes).forEach(key => {
        if (loreHashes[key] == chapter.hash) {
          recordHash = key;
          return;
        }
      });
      chapters = chapters + `<button data-hash="${ chapter.hash }"${ recordHash ? (domain.progression.ProfileResponse.profileRecords.data.records[recordHash].objectives[0].complete ? ` class="discovered"` : ``) : `` }>${ chapter.displayProperties.name }</button>`;
    });

    $("#loreBook .frame").html(`<div class="chapterTitle">chapterTitle</div>
    <div class="book">
      <div class="bookCover">
        <div class="image" data-1x="/assets/images/lore-books/${ bookHash }.png" data-2x="/assets/images/lore-books/${ bookHash }.png"></div>
      </div>
      <div class="bookTitle">${ book.displayProperties.name }</div>
      <div class="hr"></div>
    </div>
    <div class="return">
      <button>Contents</button>
    </div>
    <div class="close">
      <button>Close book</button>
    </div>
    <div class="chapters">${ chapters }</div>
    <div class="chapter"></div>`);

    domain.sentinel();

    $("#loreBook .return button").on("click", (e) => {

      $("#loreBook").removeClass("entry");

    });

    $("#loreBook .close button").on("click", (e) => {

      $("#loreBook").removeClass("open");

    });

    $("#loreBook .chapters button").on("click", (e) => {

      var c = $(e.currentTarget).data("hash");

      $("#loreBook .chapterTitle").html(domain.progression.ManifestLoreResponse[c].displayProperties.name);
      $("#loreBook .chapter").html(showdown.makeHtml(domain.progression.ManifestLoreResponse[c].displayProperties.description));
      $("#loreBook").addClass("entry");

    });

    $("#loreBook").addClass("open");

  });

}

domain.progression.displayTriumphSummary = (nodeHash) => {

  var node = domain.progression.ManifestResponse.DestinyPresentationNodeDefinition[nodeHash];

  switch (nodeHash) {
    case 3481101973: var sealTitle = "Dredgen"; break;
    case 147928983: var sealTitle = "Unbroken"; break;
    case 2693736750: var sealTitle = "Chronicler"; break;
    case 1162218545: var sealTitle = "Rivensbane"; break;
    case 2516503814: var sealTitle = "Cursebreaker"; break;
    case 2588182977: var sealTitle = "Wayfarer"; break;
    default: var sealTitle = "I'm broken :'(";
  }
  
  var records = ``;
  node.children.records.forEach(record => {
    let hash = record.recordHash;
    let def = domain.progression.ManifestResponse.DestinyRecordDefinition[hash];
    if (def.redacted) { return; }
    let objective = domain.progression.ProfileResponse.profileRecords.data.records[hash].objectives[0];
    records = records + `<div class="record${ objective.progress >= objective.completionValue ? ` complete` : `` }${ nodeHash == 2693736750 ? ` link` : `` }"${ nodeHash == 2693736750 ? ` data-bookHash="${ def.presentationInfo.parentPresentationNodeHashes[def.presentationInfo.parentPresentationNodeHashes.length - 1] }"` : `` }>
      <div class="icon">  
        <div class="image" data-1x="https://www.bungie.net${ def.displayProperties.icon }" data-2x="https://www.bungie.net${ def.displayProperties.icon }"></div>
      </div>
      <div class="text">
        <div class="name">${ def.displayProperties.name }</div>
        <div class="description">${ def.displayProperties.description }</div>
      </div>
      <div class="progress" data-fraction="${ objective.progress }/${ objective.completionValue }">
        <div class="bar" style="width: ${ objective.progress / objective.completionValue > 1 ? `100` : (objective.progress / objective.completionValue) * 100 }%"></div>
      </div>
    </div>`
  });

  $("#triumphSeals").append(`<div class="summary" id="${ nodeHash }">
    <div class="c-1-4 triumphsOverall">
      <div class="header">
        <div class="icon">
          <div class="corners t"></div>
          <div class="image" data-1x="https://www.bungie.net${ node.rootViewIcon }" data-2x="https://www.bungie.net${ node.rootViewIcon }"></div>
          <div class="corners b"></div>
        </div>
        <div class="text">
          <div class="name">${ node.displayProperties.name }</div>
          <div class="description">${ node.displayProperties.description }</div>
        </div>
      </div>
      <div class="bottom">
        <h4>Seal progress</h4>
        <div class="seal">
          <div class="title">${ sealTitle }</div>
          <div class="fraction">${ domain.progression.ProfileResponse.profileRecords.data.records[node.completionRecordHash].objectives[0].progress }/${ domain.progression.ProfileResponse.profileRecords.data.records[node.completionRecordHash].objectives[0].completionValue }</div>
          <div class="progress">
            <div class="bar" style="width: ${ domain.progression.ProfileResponse.profileRecords.data.records[node.completionRecordHash].objectives[0].progress / domain.progression.ProfileResponse.profileRecords.data.records[node.completionRecordHash].objectives[0].completionValue * 100 }%"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="c-3-4 triumphs">
      ${ records }
    </div>
  </div>`);

  $(".triumphs .record").on("click", (e) => {

    var c = $(e.currentTarget).data("bookhash");

    if (c) {
      domain.progression.displayLoreBook(c);
    }

  });

}

domain.progression.displayCollectibles = (characterId = domain.progression.activeCharacterId) => {

  $("#characters .results ul li").removeClass("active");
  $(`#characters .results ul li[data-characterId="${ characterId }"]`).addClass("active");

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
          <p>${ regionchest ? regionchest.displayProperties.name : `???` }</p>
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
  
  var adventures = ``;
  if (domain.progression.ProfileResponse.characterProgressions.data[characterId].checklists[4178338182]) {
    Object.entries(domain.progression.ProfileResponse.characterProgressions.data[characterId].checklists[4178338182]).forEach(([key, value]) => {
      var hash = key;
      var completed = value;
      var item = false;
      Object.entries(domain.progression.ManifestResponse.DestinyChecklistDefinition[4178338182].entries).forEach(([pear, peach]) => {
        if (domain.progression.ManifestResponse.DestinyChecklistDefinition[4178338182].entries[pear].checklistHash == hash) {
          item = domain.progression.ManifestResponse.DestinyChecklistDefinition[4178338182].entries[pear];
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

      var adventure = false;
      Object.keys(destination.bubbles).forEach(subKey => {
        if (destination.bubbles[subKey].hash == item.bubbleHash) {
          adventure = destination.bubbles[subKey];
          return;
        }
      });
      
      adventures = adventures + `<li class="item" data-state="${ completed ? `complete` : `incomplete` }" data-name="${ item.activityDef.displayProperties.name }">
      <div class="completed${ completed ? ` true` : `` }"></div>
        <div class="text">
          <p>${ item.activityDef.displayProperties.name }</p>
          <p>${ adventure.displayProperties.name }, ${ place.displayProperties.name }</p>
        </div>
      </li>`;
    });
  }

  var ghostLore = ``;
  if (domain.progression.ProfileResponse.profileProgression.data.checklists[2360931290]) {
    Object.entries(domain.progression.ProfileResponse.profileProgression.data.checklists[2360931290]).forEach(([key, value]) => {
      var hash = key;
      var completed = value;
      var item = false;
      Object.entries(domain.progression.ManifestResponse.DestinyChecklistDefinition[2360931290].entries).forEach(([pear, peach]) => {
        if (domain.progression.ManifestResponse.DestinyChecklistDefinition[2360931290].entries[pear].checklistHash == hash) {
          item = domain.progression.ManifestResponse.DestinyChecklistDefinition[2360931290].entries[pear];
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
  
      var scan = false;
      Object.keys(destination.bubbles).forEach(subKey => {
        if (destination.bubbles[subKey].hash == item.bubbleHash) {
          scan = destination.bubbles[subKey];
          return;
        }
      });
      
      ghostLore = ghostLore + `<li class="item" data-state="${ completed ? `complete` : `incomplete` }" data-name="${ place.displayProperties.name }">
      <div class="completed${ completed ? ` true` : `` }"></div>
        <div class="text">
          <p>${ scan ? scan.displayProperties.name : `???` }</p>
          <p>${ place.displayProperties.name }</p>
        </div>
      </li>`;
    });
  }

  var latentMemories = ``;
  if (domain.progression.ProfileResponse.profileProgression.data.checklists[2955980198]) {
    Object.entries(domain.progression.ProfileResponse.profileProgression.data.checklists[2955980198]).forEach(([key, value]) => {
      var hash = key;
      var completed = value;
      var item = false;
      Object.entries(domain.progression.ManifestResponse.DestinyChecklistDefinition[2955980198].entries).forEach(([pear, peach]) => {
        if (domain.progression.ManifestResponse.DestinyChecklistDefinition[2955980198].entries[pear].checklistHash == hash) {
          item = domain.progression.ManifestResponse.DestinyChecklistDefinition[2955980198].entries[pear];
          return;
        }
      });
      
      latentMemories = latentMemories + `<li class="item" data-state="${ completed ? `complete` : `incomplete` }" data-name="${ item.displayProperties.name }">
      <div class="completed${ completed ? ` true` : `` }"></div>
        <div class="text">
          <p>${ item.displayProperties.name }</p>
        </div>
      </li>`;
    });
  }

  var caydesJournals = ``;
  if (domain.progression.ProfileResponse.profileProgression.data.checklists[2448912219]) {
    Object.entries(domain.progression.ProfileResponse.profileProgression.data.checklists[2448912219]).forEach(([key, value]) => {
      var hash = key;

      var actual = ["78905203", "1394016600", "1399126202", "4195138678"];
      if (actual.includes(hash)) {

        var completed = value;
        var item = false;
        Object.entries(domain.progression.ManifestResponse.DestinyChecklistDefinition[2448912219].entries).forEach(([pear, peach]) => {
          if (domain.progression.ManifestResponse.DestinyChecklistDefinition[2448912219].entries[pear].checklistHash == hash) {
            item = domain.progression.ManifestResponse.DestinyChecklistDefinition[2448912219].entries[pear];
            return;
          }
        });
        
        caydesJournals = caydesJournals + `<li class="item" data-state="${ completed ? `complete` : `incomplete` }" data-name="${ item.hash }">
        <div class="completed${ completed ? ` true` : `` }"></div>
          <div class="text">
            ${ showdown.makeHtml(item.displayProperties.description) }
          </div>
        </li>`;
      }
    });
  }

  $("#checklists").html(`
  <h4>Checklists</h4>
  <div class="pages">
    <button class="square active" data-activates="page-1">1</button>  
    <button class="square" data-activates="page-2">2</button>
  </div>
  <div class="toggle mobileOnly">
    <button class="square" data-activates="list-region_chests"><i class="destiny-region_chests"></i></button><button class="square" data-activates="list-lost_sectors"><i class="destiny-lost_sectors"></i></button><button class="square" data-activates="list-adventures"><i class="destiny-adventure"></i></button><button class="square active" data-activates="list-sleeper_nodes"><i class="destiny-sleeper_nodes"></i></button><button class="square" data-activates="list-ghost_lore"><i class="destiny-ghost"></i></button><button class="square" data-activates="list-latent_memories"><i class="destiny-lost_memory_fragments"></i></button><button class="square" data-activates="list-caydes_journals"><i class="destiny-ace_of_spades"></i></button>
  </div>
  <div class="page-1 active">
    <div class="flex">
      <div class="c-1-4 checklists" id="list-region_chests">
        <div class="header">
          <div class="icon">
            <i class="destiny-region_chests"></i>
          </div>
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
      <div class="c-1-4 checklists" id="list-lost_sectors">
        <div class="header">
          <div class="icon">
            <i class="destiny-lost_sectors"></i>
          </div>
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
      </div>
      <div class="c-1-4 checklists" id="list-adventures">
        <div class="header">
          <div class="icon">
            <i class="destiny-adventure"></i>
          </div>
          <div class="description">Heroes are needed all over our solar system. Will you rise to the challenge?</div>
        </div>
        <div class="progress">
          <div class="title">Adventures completed</div>
          <div class="fraction">${ Object.values(domain.progression.ProfileResponse.characterProgressions.data[characterId].checklists[4178338182]).filter(value => value === true).length }/${ Object.keys(domain.progression.ProfileResponse.characterProgressions.data[characterId].checklists[4178338182]).length }</div>
          <div class="bar" style="width: ${ Object.values(domain.progression.ProfileResponse.characterProgressions.data[characterId].checklists[4178338182]).filter(value => value === true).length / Object.keys(domain.progression.ProfileResponse.characterProgressions.data[characterId].checklists[4178338182]).length * 100 }%"></div>
        </div>
        <ul class="checks list">
          ${ adventures }
        </ul>
      </div>
      <div class="c-1-4 checklists active" id="list-sleeper_nodes">
        <div class="header">
          <div class="icon">
            <i class="destiny-sleeper_nodes"></i>
          </div>
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
    </div>
  </div>
  <div class="page-2">
    <div class="flex">
      <div class="c-1-4 checklists" id="list-ghost_lore">
        <div class="header">
          <div class="icon">
            <i class="destiny-ghost"></i>
          </div>
          <div class="description">Found scattered across the solar system.</div>
        </div>
        <div class="progress">
          <div class="title">Scans made</div>
          <div class="fraction">${ Object.values(domain.progression.ProfileResponse.profileProgression.data.checklists[2360931290]).filter(value => value === true).length }/${ Object.keys(domain.progression.ProfileResponse.profileProgression.data.checklists[2360931290]).length }</div>
          <div class="bar" style="width: ${ Object.values(domain.progression.ProfileResponse.profileProgression.data.checklists[2360931290]).filter(value => value === true).length / Object.keys(domain.progression.ProfileResponse.profileProgression.data.checklists[2360931290]).length * 100 }%"></div>
        </div>
        <ul class="checks list">
          ${ ghostLore }
        </ul>
      </div>
      <div class="c-1-4 checklists" id="list-latent_memories">
        <div class="header">
          <div class="icon">
            <i class="destiny-lost_memory_fragments"></i>
          </div>
          <div class="description">Unlock memories of the past.</div>
        </div>
        <div class="progress">
          <div class="title">Memories resolved</div>
          <div class="fraction">${ Object.values(domain.progression.ProfileResponse.profileProgression.data.checklists[2955980198]).filter(value => value === true).length }/${ Object.keys(domain.progression.ProfileResponse.profileProgression.data.checklists[2955980198]).length }</div>
          <div class="bar" style="width: ${ Object.values(domain.progression.ProfileResponse.profileProgression.data.checklists[2955980198]).filter(value => value === true).length / Object.keys(domain.progression.ProfileResponse.profileProgression.data.checklists[2955980198]).length * 100 }%"></div>
        </div>
        <ul class="checks single-line list">
          ${ latentMemories }
        </ul>
      </div>
      <div class="c-1-4 checklists" id="list-caydes_journals">
        <div class="header">
          <div class="icon">
            <i class="destiny-ace_of_spades"></i>
          </div>
          <div class="description">Learn more about your favorite Hunter's past.</div>
        </div>
        <div class="progress">
          <div class="title">Journals recovered</div>
          <div class="fraction">${ Object.values(domain.progression.ProfileResponse.profileProgression.data.checklists[2448912219]).filter(value => value === true).length }/4</div>
          <div class="bar" style="width: ${ Object.values(domain.progression.ProfileResponse.profileProgression.data.checklists[2448912219]).filter(value => value === true).length / 4 * 100 }%"></div>
        </div>
        <ul class="checks list">
          ${ caydesJournals }
        </ul>
      </div>
    </div>
  </div>`);

  domain.sentinel();

  $("#checklists .toggle button").on("click", (e) => {
    var a = $(e.currentTarget).data("activates");
    $("#checklists .toggle button").removeClass("active");
    $(e.currentTarget).addClass("active");
    $("#checklists .checklists").removeClass("active");
    $("#" + a).addClass("active");
  });

  $("#checklists .pages button").on("click", (e) => {
    var a = $(e.currentTarget).data("activates");
    $("#checklists .pages button").removeClass("active");
    $(e.currentTarget).addClass("active");
    $("#checklists .page-1, #checklists .page-2").removeClass("active");
    $("#checklists ." + a).addClass("active");
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

  var opts = {
    valueNames: [
      { data: ['name'] },
      { data: ['state'] }
    ]
  };
  lists.adventures = new List('list-adventures', opts);
  lists.adventures.sort('name', { order: "asc" });

  var opts = {
    valueNames: [
      { data: ['name'] },
      { data: ['state'] }
    ]
  };
  lists.ghostLore = new List('list-ghost_lore', opts);
  lists.ghostLore.sort('name', { order: "asc" });

  var opts = {
    valueNames: [
      { data: ['name'] },
      { data: ['state'] }
    ]
  };
  lists.latentMemories = new List('list-latent_memories', opts);
  lists.latentMemories.sort('name', { order: "asc" });

  var opts = {
    valueNames: [
      { data: ['name'] },
      { data: ['state'] }
    ]
  };
  lists.caydesJournals = new List('list-caydes_journals', opts);
  lists.caydesJournals.sort('name', { order: "asc" });

}