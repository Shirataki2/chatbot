const socket = io();
const section = $("#main-session");
const aiIcon = "static/images/anata.png";
const humanIcon = "static/images/watashi.png";
let initalState = true;
let state = [0, 0]
$(window).on("beforeunload", (e) => {
  socket.disconnect();
})
$(document).ready(() => {
  socket.emit("initialize", `##INITIAL_STATE##`);
  initalState = false;
  $("#s").prop("disabled", true);
  $("#s").css({"background": "#cccccc"});
  $("#m").on("input propertychange", ()=>{
    if($("#m").val().length === 0){
      $("#s").prop("disabled", true);
      $("#s").css({"background": "#cccccc"});
    }else{
      $("#s").prop("disabled", false);
      $("#s").css({"background": "#0000ff"});  
    }
  })
  
})

socket.on("connect", () => {
  socket.headbeatTimeOut = 1000;
  console.log("Connected!");
  sleep(1000).done(() => {
    socket.emit("ask");
  })
  socket.on("ai message", (data) => {
    const msg = data.msg.split('@');
    console.log(msg);
    if (msg.length >= 2) {
      sleep(100).done(() => {
        aiMessage(msg[0], "static/images/anata.png");
      });
      const status = JSON.parse(`{${msg[1]}}`);
      if (status.dog !== undefined) {
        state[0] += status.dog;
        if (state[0] >= 1) {
          $('#point').css('color', '#00ff0065');
        }
        $('#point').html(`${state[0]}`)
      }
      if (status.cat !== undefined) {
        state[1] += status.cat;
        if (state[1] >= 1) {
          $('#point').css('color', '#ff000065');
        }
        $('#point').html(`${state[1]}`)
      }
    } else if (msg.length === 1) {
      aiMessage(msg, "static/images/anata.png");
    }
    $("html,body").animate({
      scrollTop: $("#main-session")[0].scrollHeight
    }, "slow");

  });
  $("form").submit(() => {     
      socket.emit("human message", `${$("#m").val()}`);
    humanMessage($("#m").val(), humanIcon);
    $("#m").val("");
    $("html,body").animate({
      scrollTop: $("#main-session")[0].scrollHeight
    }, "slow");
    return false;
  })
});

$(".b").change(() => {
  const btn = $(".b").get(1);
  const txt = $(".b").get(0);
  if (txt.getAttribute("value") === "") {
    btn.setAttribute("disabled", true);
  } else {
    btn.setAttribute("disabled", false);
  }
})

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