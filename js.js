data = {"email":{"thomas":{"before":"thomas", "after": "@bunke.consulting"}}}

unveilMailAddress = function(){
    $("#my-email").hover(function(){
      $(this).parent().attr('href', function(){
        var mail = data["email"]["thomas"]
        return 'mailto:' + mail["before"] + mail["after"]
      })
    })
  }
