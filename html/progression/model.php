<div id="root">
  <div class="bg"></div>
  <div class="frame">
    <div class="controls">
      <div id="players">
        <h4>Search for player</h4>
        <div class="form">
          <div class="field">
            <input type="text" placeholder="justrealmilk" spellcheck="false">
          </div>
        </div>
        <div class="results">
          <ul></ul>
        </div>
      </div>
      <div id="characters">
        <h4>Select character</h4>
        <div class="results">
          <ul></ul>
        </div>
      </div>
    </div>
    <div id="character">
      <div class="header flex">
        <div class="c-1-2 summary flex"></div>
        <div class="c-1-2 sections flex">
          <button data-activates="checklists" class="active">Checklists</button>
          <button data-activates="ranks">Ranks (preview)</button>
          <button data-activates="triumphSeals">Triumph Seals</button>
          <button data-activates="exotics">Exotics</button>
        </div>
      </div>
      <div class="section active" id="checklists"></div>
      <div class="section" id="ranks"></div>
      <div class="section" id="triumphSeals"></div>
      <div class="section" id="exotics"></div>
    </div>
  </div>
</div>
<div id="loreBook">
  <div class="border">
    <div class="frame"></div>
  </div>
</div>
<div id="itemInspect">
  <div class="canvas"></div>  
  <div class="frame"></div>
</div>