<div class="bg"></div>
<div class="frame">
  <div class="icons-font">
    <div class="about">
      <h3>Icons</h3>
      <p>Building Destiny&ndash;related web stuff often means using icons of some sort from the game. Unfortunately, the icons available through the manifest provided by the API are low in resolution.</p>
      <p>So, I've taken it upon myself to do some tracing, cleaning up, and in rare cases, completely original creation from 0 to finish i.e. the Power icon.</p>
      <p><strong>Download coming soon</strong></p>
    </div>
    <div class="entities"></div>
  </div>
  <div class="api">
    <div class="about">
      <h3>API</h3>
      <p>In an effort to make the Destiny API more malleable for my own use, I've built out some of my own mini-api endpoints that power my websites, experiments, and other things.</p>
      <p>At the moment, I power a few Discord bots and widgets, which is cool. Feel free to use my data.</p>
    </div>
    <div class="form">
      <div class="header">
        <div class="text">Generate an API key</div>
        <div class="field">
          <button>Start</button>
        </div>
      </div>
      <div class="request">
        <p>Project URL, if any</p>
        <div class="field">
          <input type="text" name="url" placeholder="https://mycooldestinysite.com"></label>
        </div>
        <p>Leave me a cute message ❤️</p>
        <div class="field">
          <input type="text" name="comment" placeholder="My site for cool Destiny">
        </div>
        <div class="field">
          <button>Request</button>
        </div>
      </div>
    </div>
    <div class="key-use">
      <p>Use the key in the same manner you would for Bungie's API.</p>
      <p>Send it with your headers as the value to X-Api-Key.</p>
      <pre><code>Request headers:
Host: api.braytech.org
Accept: application/json, text/javascript, */*; q=0.01
Accept-Encoding: gzip, deflate, br
X-Api-Key: 5afbd2ad6cb41
      </code></pre>
    </div>
    <div class="endpoint">
      <div class="method">GET</div>
      <div class="absolute">https://api.braytech.org/?request=xur&amp;get=history</div>
      <div class="description">
        <p>Get Xûr's history by season and week. Includes summaries of item definitions, possible source data, and originating season.</p>
      </div>
      <div class="parameters">
        <ul>
          <li data-key="season">[1-4]</li>
          <li data-key="week">[1-22]</li>
        </ul>
      </div>
      <div class="response">
        <div class="note">This response is abridged for brevity.</div>
        <pre><code>{
    "response": {
        "status": 200,
        "message": "Success",
        "data": {
            "location": {
                "world": "Earth",
                "region": "Tower Hangar",
                "map": {
                    "x": "0.61",
                    "y": "0.31"
                },
                "description": "Beside an emergency stairwell, behind Arach Jalaal of Dead Orbit."
            },
            "retrieved": "2018-09-07 10:05:05",
            "season": 4,
            "week": 1,
            "items": [
                {
                    "season": 2,
                    "source": null,
                    "sales": 6,
                    "hash": 19024058,
                    "displayProperties": {
                        "description": "\"Cryptarchs made a crystal that starts fires? Get me one. I don't care how you do it. Go!\" —Cayde-6",
                        "name": "Prometheus Lens",
                        "icon": "/common/destiny2_content/icons/b61299ff11d37d5b637d716e8ef3be72.jpg",
                        "hasIcon": true
                    },
                    "classType": 3,
                    "itemTypeDisplayName": "Trace Rifle",
                    "equippable": true,
                    "equippingBlock": {
                        "uniqueLabel": "exotic_weapon",
                        "uniqueLabelHash": 4017842899,
                        "equipmentSlotTypeHash": 2465295065,
                        "attributes": 0,
                        "equippingSoundHash": 0,
                        "hornSoundHash": 0,
                        "ammoType": 2,
                        "displayStrings": [
                            ""
                        ]
                    },
                    "screenshot": "/common/destiny2_content/screenshots/19024058.jpg",
                    "cost": {
                        "quantity": 29,
                        "icon": "/common/destiny2_content/icons/10d4740564176a830923d226368e44c8.png"
                    }
                }
            ]
        },
        "refresh": "2018-09-14T09:00:00Z"
    }
}</code></pre>
      </div>
    </div>
    <div class="endpoint">
      <div class="method">GET</div>
      <div class="absolute">https://api.braytech.org/?request=xur&amp;get=history&summary</div>
      <div class="description">
        <p>Get a summary of available data i.e. season, weeks, locations for Xûr's history endpoint</p>
      </div>
      <div class="response">
        <div class="note">This response is abridged for brevity.</div>
        <pre><code>{
    "response": {
        "status": 200,
        "message": "Success",
        "data": {
            "1": [ ... ],
            "4": [
                {
                    "location": {
                        "world": "Earth",
                        "region": "Tower Hangar",
                        "map": {
                            "x": 0.61,
                            "y": 0.31
                        },
                        "description": "Beside an emergency stairwell, behind Arach Jalaal of Dead Orbit."
                    },
                    "retrieved": "2018-09-07 10:05:05",
                    "season": "4",
                    "week": "1"
                }
            ]
        }
    }
}</code></pre>
      </div>
    </div>
    <div class="endpoint">
      <div class="method">GET</div>
      <div class="absolute">https://api.braytech.org/?request=challenges</div>
      <div class="description">
        <p>Weekly and 4 day challenges, as curated by me, for easy consumption.</p>
      </div>
      <div class="response">
        <div class="note">Preliminary: As Forsaken matures and it becomes clearer what data users need most, I may add to the response.</div>
        <pre><code>{
    "response": {
        "status": 200,
        "message": "Package for Warlock. Stop floating. Bad package.",
        "data": [
            {
                "type": "flashpoint",
                "startDate": "2018-09-04T17:00:01Z",
                "endDate": "2018-09-11T17:00:01Z",
                "slug": "edz",
                "name": "FLASHPOINT: EDZ",
                "description": "Complete various activities around the current Flashpoint, including public events, Lost Sectors, and Heroic adventures."
            },
            {
                "type": "vendor",
                "startDate": "2018-09-07T17:00:01Z",
                "endDate": "2018-09-11T17:00:01Z",
                "slug": "xur",
                "name": "Xûr",
                "hash": 2190858386,
                "description": "View his wares before he disappears again..."
            }
        ]
    }
}</code></pre>
      </div>
    </div>
  </div>
</div>