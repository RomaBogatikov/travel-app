$( () => {
  const KEY = 'lZkaliDxvBgp9v4kmuW5qDMEqPeZICMZ'

  $.ajax({
    url: "http://open.mapquestapi.com/geocoding/v1/address?key=KEY&location=Milford",
    type: "GET",
    success: function(result) {
      console.log(result)
    },
    error: function(error) {
      console.log(`Error ${error}`)
    }
  })


});
