
exports.getDate = function (){
    var today = new Date();

    var options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      
    };
    
    var day = today.toLocaleDateString("hi-IN", options);
    return day;
}
