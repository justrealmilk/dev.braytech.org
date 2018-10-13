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

    var NeverStockedResponse = $.ajax({
      url: "https://api.braytech.org/?request=xur&get=neverstocked",
      method: "get",
      cache: false,
      dataType: "json",
      headers: {
        "X-Api-Key": apiKey.braytech
      }
    }).then();

    $.when(HistoryResponse, NeverStockedResponse).then((api1, api2) => {

      domain.xur.HistoryResponse = {};
      domain.xur.NeverStocked = {};
      domain.xur.HistoryResponse = api1[0].response.data;
      domain.xur.NeverStocked = api2[0].response.data;

      domain.xur.render();

      $(".frame").addClass("hasHistory");

    }); 

  }

  domain.xur.renderer();
  
}

domain.xur.render = () => {

  for (let index = Object.keys(domain.xur.HistoryResponse).length - 1; index > -1; index--) {
    const season = Object.keys(domain.xur.HistoryResponse)[index];

    $(".history").append(`<div class="season season-${ season }">
      <h4>Season ${ season }</h4>
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

        items = items + `<div class="item" data-hash="${ item.hash }">
          <div class="image" data-1x="https://www.bungie.net${ item.displayProperties.icon }" data-2x="https://www.bungie.net${ item.displayProperties.icon }"></div>
        </div>`;
      });

      $(`.history .season-${ week.season } .weeks`).append(`<div class="week">
        <div class="this">Week ${ week.week }</div>
        <div class="items">${ items }</div>
        <div class="location">
          <div>${ week.location.region }</div>
          <div>${ week.location.world }</div>
        </div>
      </div>`);

    }

  }

  domain.xur.NeverStocked.forEach(item => {
    $(".neverstocked .items").append(`<div class="item${ item.sourceHash != "1563875874" ? ` nonWorldDrop` : `` }" data-hash="${ item.hash }">
      <div class="image" data-1x="https://www.bungie.net${ item.displayProperties.icon }" data-2x="https://www.bungie.net${ item.displayProperties.icon }"></div>
    </div>`);
  });

  domain.sentinel();

  $(".items .item").on({
    mouseenter: (e) => {
      domain.inspector.mouseover = true;
      domain.inspector($(e.currentTarget).data("hash"));
    },
    mouseleave: (e) => {
      domain.inspector.mouseover = false;
      $("#inspector").removeClass("active");
      if (domain.inspector.request) {
        if (domain.inspector.request.readyState > 0 && domain.inspector.request.readyState < 4) {
          domain.inspector.request.abort();
        }
      }
    }
  });

  domain.xur.latest();


}

domain.xur.latest = () => {

  var season = Object.keys(domain.xur.HistoryResponse).length;
  var week = domain.xur.HistoryResponse[season].length - 1;

  var latest = domain.xur.HistoryResponse[season][week];

  var highlight = false;
  latest.items.forEach(item => {
    if (item.classType == 3) {
      highlight = item;
      return;
    }
  });

  $(".latest .highlight .item").html(`<div>${ highlight.displayProperties.name }</div>
  <div>${ highlight.itemTypeDisplayName }</div>`);
  
  domain.xur.renderer.item(highlight.hash);

}

domain.utils.classTypeToString = (classType) => {

  var string;

  switch (classType) {
    case 0: string = "Titan"; break;
    case 1: string = "Hunter"; break;
    case 2: string = "Warlock"; break;
  }

  return string;
}

domain.utils.damageTypeToString = (damageType) => {

  var string;

  switch (damageType) {
    case 3373582085: string = "Kinetic"; break;
    case 1847026933: string = "Solar"; break;
    case 2303181850: string = "Arc"; break;
    case 3454344768: string = "Void"; break;
  }

  return string;
}

domain.utils.ammoTypeToString = (ammoType) => {

  var string;

  switch (ammoType) {
    case 1: string = "Primary"; break;
    case 2: string = "Special"; break;
    case 3: string = "Heavy"; break;
  }

  return string;
}

domain.inspector = (hash) => {
  if (domain.inspector.request) {
    if (domain.inspector.request.readyState > 0 && domain.inspector.request.readyState < 4) {
      domain.inspector.request.abort();
    }
  }
  domain.inspector.request = $.ajax({
    url: "https://api.braytech.org/?request=manifest&table=DestinyInventoryItemDefinition&hash=" + hash,
    method: "get",
    cache: true,
    dataType: "json",
    headers: {
      "X-Api-Key": apiKey.braytech
    }
  }).then();

  $.when(domain.inspector.request).then((response) => {

    var item = response.response.data.items[0];
    console.log(item);

    var weaponsDefinition = [
      {
        "hash": "2837207746",
        "name": "Swing Speed",
        "type": "bar"
      },
      {
        "hash": "3614673599",
        "name": "Blast Radius",
        "type": "bar"
      },
      {
        "hash": "2523465841",
        "name": "Velocity",
        "type": "bar"
      },
      {
        "hash": "4043523819",
        "name": "Impact",
        "type": "bar"
      },
      {
        "hash": "1240592695",
        "name": "Range",
        "type": "bar"
      },
      {
        "hash": "2762071195",
        "name": "Efficiency",
        "type": "bar"
      },
      {
        "hash": "209426660",
        "name": "Defence",
        "type": "bar"
      },
      {
        "hash": "155624089",
        "name": "Stability",
        "type": "bar"
      },
      {
        "hash": "943549884",
        "name": "Handling",
        "type": "bar"
      },
      {
        "hash": "4188031367",
        "name": "Reload Speed",
        "type": "bar"
      },
      {
        "hash": "925767036",
        "name": "Ammo Capacity",
        "type": "int"
      },
      {
        "hash": "4284893193",
        "name": "Rounds Per Minute",
        "type": "int"
      },
      {
        "hash": "2961396640",
        "name": "Charge Time",
        "type": "int"
      },
      {
        "hash": "3871231066",
        "name": "Magazine",
        "type": "int"
      }
    ];

    var armorDefinition = [ 
      {
        "hash": "2996146975",
        "name": "Mobility",
        "type": "bar"
      },
      {
        "hash": "392767087",
        "name": "Resilience",
        "type": "bar"
      },
      {
        "hash": "1943323491",
        "name": "Recovery",
        "type": "bar"
      }
    ]

    var armorModifiers = {
      "2996146975": 0,
      "392767087": 0,
      "1943323491": 0
    }

    var weaponStats = "";
    weaponsDefinition.forEach(stat => {
      if (Object.keys(item.stats.stats).includes(stat.hash)) {
        weaponStats = weaponStats + `<div class="stat">
          <div class="name">${ stat.name }</div>
          <div class="value ${ stat.type }">
            ${ stat.type == "bar" ? `<div class="bar" data-value="${ item.stats.stats[stat.hash].value }" style="width:${ item.stats.stats[stat.hash].value }%;"></div>` : item.stats.stats[stat.hash].value }
          </div>
        </div>`;
      }
    });

    var armorStats = "";
    if (item.itemType == 2) {
      item.sockets.socketEntries.forEach(socket => {
        if (socket.socketTypeHash == 4076485920) {
          socket.reusablePlugItems.forEach(plug => {
            if (plug.hash == socket.singleInitialItemHash) {
              plug.investmentStats.forEach(investmentStat => {
                armorModifiers[investmentStat.statTypeHash]++;
              });
            }
          });
        }
      });
      armorDefinition.forEach(stat => {
        armorStats = armorStats + `<div class="stat">
          <div class="name">${ stat.name }</div>
          <div class="value ${ stat.type }">
            ${ stat.type == "bar" ? `<div class="bar" data-value="${ (item.stats.stats[stat.hash] ? item.stats.stats[stat.hash].value : 0) + (Object.keys(armorModifiers).includes(stat.hash) ? armorModifiers[stat.hash] : 0) }" style="width:${ ((item.stats.stats[stat.hash] ? item.stats.stats[stat.hash].value : 0) + (Object.keys(armorModifiers).includes(stat.hash) ? armorModifiers[stat.hash] : 0)) / 3 * 100 }%;"></div>` : (item.stats.stats[stat.hash] ? item.stats.stats[stat.hash].value : 0) }
          </div>
        </div>`;
      });
    }

    var socketIndexes;
    Object.keys(item.sockets.socketCategories).forEach(key => {
      if (item.sockets.socketCategories[key].socketCategoryHash == 4241085061 || item.sockets.socketCategories[key].socketCategoryHash == 2518356196) {
        socketIndexes = item.sockets.socketCategories[key].socketIndexes;
        return;
      }
    });

    var intrinsic = false;
    var traits = false;
    Object.values(socketIndexes).forEach(key => {
      var socket = item.sockets.socketEntries[key];
      if (socket.socketTypeHash == 1282012138) {
        return;
      }
      var plugs = ``;
      socket.reusablePlugItems.forEach((plug) => {
        if (plug.itemCategoryHashes.includes(2237038328)) {
          intrinsic = plug.perks[0].perkDef;
        }
      });
      if (socket.socketTypeHash == 2614797986) {
        if (item.itemType == 3) {
          if (!traits) {
            traits = "";
          }
          socket.reusablePlugItems.forEach((plug) => {
            if (socket.singleInitialItemHash == plug.hash) {
              traits = traits + `<div class="plug trait">
                <div class="icon image" data-1x="https://www.bungie.net${ plug.displayProperties.icon }" data-2x="https://www.bungie.net${ plug.displayProperties.icon }"></div>
                <div class="text">
                  <div class="name">${ plug.displayProperties.name }</div>
                  <div class="description">${ plug.displayProperties.description }</div>
                </div>
              </div>`;
            }
          });
        }
      }
    });
    
    $("#inspector").html(`<div class="acrylic"></div>
    <div class="frame">
      <div class="header ${ item.inventory.tierTypeName.toLowerCase() }">
        <div class="name">${ item.displayProperties.name }</div>
        <div>
          <div class="kind">${ item.itemTypeDisplayName }</div>
          <div class="rarity">${ item.inventory.tierTypeName }</div>
        </div>
      </div>
      <div class="black">
        ${ item.itemType == 3 ? `<div class="damage weapon">
          <div class="power ${ domain.utils.damageTypeToString(item.damageTypeHashes[0]).toLowerCase() }">
            <div class="icon destiny-damage_${ domain.utils.damageTypeToString(item.damageTypeHashes[0]).toLowerCase() }"></div>
            <div class="text">600</div>
          </div>
          <div class="slot">
            <div class="icon destiny-ammo_${ domain.utils.ammoTypeToString(item.equippingBlock.ammoType).toLowerCase() }"></div>
            <div class="text">${ domain.utils.ammoTypeToString(item.equippingBlock.ammoType) }</div>
          </div>
        </div>` : `<div class="damage armor">
          <div class="power">
            <div class="text">600</div>
            <div class="text">Defense</div>
          </div>
        </div>` }
        ${ item.sourceHash ? `<div class="source">
          <p>${ item.sourceString }</p>
        </div>` : `` }
        <div class="stats">
          ${ item.itemType == 3 ? weaponStats : armorStats }
        </div>
        <div class="sockets${ traits ? ` hasTraits` : `` }">
          ${ intrinsic ? `<div class="plug intrinsic">
            <div class="icon image" data-1x="https://www.bungie.net${ intrinsic.displayProperties.icon }" data-2x="https://www.bungie.net${ intrinsic.displayProperties.icon }"></div>
            <div class="text">
              <div class="name">${ intrinsic.displayProperties.name }</div>
              <div class="description">${ intrinsic.displayProperties.description }</div>
            </div>
          </div>` : `` }
          ${ traits ? traits : `` }
        </div>
      </div>
    </div>`);
    
    if (domain.inspector.mouseover) {
      $("#inspector").addClass("active");
    }

    domain.sentinel("#inspector");

  });
}

domain.inspector.init = () => {

  $("body").append(`<div id="inspector"></div>`);

  $(window).on("mousemove.inspector", function(e) {

    var x = 0;
		var y = 0;

		if (e.type == "mousemove") {
			x = e.clientX;
			y = e.clientY;
		}
		
		$("#inspector").css({
			"top": `${ y + 16 }px`,
			"left": `${ x + 16 }px`
    });
    
	});

}

domain.inspector.init();

domain.xur.renderer = () => {

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

  domain.xur.renderer.lights = [];

  domain.xur.renderer.lights[1] = new THREE.PointLight(0xffffff, 1);
  domain.xur.renderer.lights[1].position.set(1, 10, -0.5);
  // domain.xur.renderer.lights[1].castShadow = true;
  // domain.xur.renderer.lights[1].shadow.bias = 0.0001;
  // domain.xur.renderer.lights[1].shadow.mapSize.width = 2048;
  // domain.xur.renderer.lights[1].shadow.mapSize.height = 2048;
  // domain.xur.renderer.lights[1].shadow.camera.near = 0.5;
  // domain.xur.renderer.lights[1].shadow.camera.far = 100;
  scene.add(domain.xur.renderer.lights[1]);

  domain.xur.renderer.lights[2] = new THREE.PointLight(0xffffff, 0.8);
  domain.xur.renderer.lights[2].position.set(20, 0, 20);
  scene.add(domain.xur.renderer.lights[2]);

  domain.xur.renderer.lights[3] = new THREE.PointLight(0xffffff, 0.8);
  domain.xur.renderer.lights[3].position.set(-20, 0, 20);
  scene.add(domain.xur.renderer.lights[3]);
  
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

domain.xur.renderer.item = (hash, requestedOrnamentHash) => {

  // requestedOrnamentHash = requestedOrnamentHash == "default" ? "0" : requestedOrnamentHash;

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
      // if (group.children[0].name != hash) {
        for (var i = group.children.length - 1; i >= 0; i--) {
          group.remove(group.children[i]);
        }
      // }
      // else {
      //   return;
      // }
    }

    
    THREE.DefaultLoadingManager = new THREE.LoadingManager();
    var manager = THREE.DefaultLoadingManager;
    manager.onProgress = function(url, count, total) {
      // console.log('Progress', url, count, total, count==total);
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
      mesh.position.set(0, 0, 1);
      mesh.rotation.x = -90 * toRadian;
      mesh.rotation.z = 180 * toRadian;
      
      group.add(mesh);

      $(".canvas").removeClass("loading");

    },
    function(xhr) {
      // console.log(xhr.loaded, xhr.total, xhr);
    },
    function(err) {
      console.error('An error happened', err);
    });
  }

  var scale = 14;

  var ornamentHash = requestedOrnamentHash == "default" || requestedOrnamentHash == undefined ? 0 : requestedOrnamentHash;

  renderHash(hash, ornamentHash, scale);

}