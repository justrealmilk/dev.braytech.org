domain.braytech = () => {

  if (!domain.braytech.requests) {
  
    domain.braytech.init();

  }

}

domain.braytech.requests = false;

domain.braytech.init = () => {

  // var challenges = $.ajax({
  //   url: "https://api.braytech.org/?request=challenges",
  //   method: "get",
  //   cache: false,
  //   dataType: "json",
  //   headers: {
  //     "X-Api-Key": apiKey.braytech
  //   }
  // }).then();

  // var spider = $.ajax({
  //   url: "https://api.braytech.org/?request=vendor&hash=863940356,672118013",
  //   method: "get",
  //   cache: false,
  //   dataType: "json",
  //   headers: {
  //     "X-Api-Key": apiKey.braytech
  //   }
  // }).then();

  // $.when(challenges, spider).then((api1, api2) => {

  //   domain.now.requests = {};

  //   domain.now.requests.challenges = api1[0].response.data;
  //   domain.now.requests.spider = api2[0].response.data[863940356];
  //   domain.now.requests.gunsmith = api2[0].response.data[672118013];

  //   console.log(domain.now.requests);

  //   domain.now.render();

  // });
  
}