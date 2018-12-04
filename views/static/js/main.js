const socket = io();
const section = $("#main-session");
const aiIcon = "static/images/anata.png";
const humanIcon = "static/images/watashi.png";

socket.on("connect", () => {
  socket.headbeatTimeOut = 1000;
  console.log("Connected!");
  sleep(500).done(() => {
    socket.emit("ask");
  })
  socket.on("ai message", (data) => {
    aiMessage(data.msg, "static/images/anata.png");
    $("html,body").animate({
      scrollTop: $("#main-session")[0].scrollHeight
    }, "slow");
  });
  $("form").submit(() => {
    socket.emit("human message", $("#m").val());
    humanMessage($("#m").val(), humanIcon);
    $("#m").val("");
    $("html,body").animate({
      scrollTop: $("#main-session")[0].scrollHeight
    }, "slow");
    return false;
  })
});



function sleep(msec) {
  const def = new $.Deferred;
  setTimeout(() => {
    def.resolve(msec);
  }, msec);
  return def.promise();
}

function aiMessage(mes, icon) {
  $(`\
  <li>
    <div class = "ai-mes" >\
      <figure class = "ai-icon" >\
        <img src = "${icon}" / >\
      </figure>\
      <div class = "ai-text" >\
        ${mes}\
      </div >\
    </div>\
  </li>\  
    `).appendTo("#main-session");
}

function humanMessage(mes, icon) {
  $(`\
  <li>
    <div class = "human-mes" >\
      <figure class = "human-icon" >\
        <img src = "${icon}" / >\
      </figure>\
      <div class = "human-text" >\
        ${mes}\
      </div >\
    </div>\
  </li>\  
    `).appendTo("#main-session");
}