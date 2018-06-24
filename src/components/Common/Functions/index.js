import React from "react";
import { toast } from "react-toastify";
import { css } from "glamor";

const Notify = (msg, type) => {
  switch (type) {
    case "success":
      toast.success(
        <div>
          <span>{msg}</span>
        </div>,
        {
          className: css({
            minHeight: "66px",
            backgroundColor: " #39D36A",
            textAlign: "center"
          })
        }
      );
      break;
    case "info":
      toast.info(
        <div>
          <span>{msg}</span>
        </div>,
        {
          className: css({
            minHeight: "66px",
            backgroundColor: " #3FBBF8",
            textAlign: "center"
          })
        }
      );
      break;
    case "warn":
      toast.warn(
        <div>
          <span>{msg}</span>
        </div>,
        {
          className: css({
            minHeight: "66px",
            backgroundColor: " #FFC42C",
            textAlign: "center"
          })
        }
      );
      break;
    case "error":
      toast.error(
        <div>
          <span>{msg}</span>
        </div>,
        {
          className: css({
            minHeight: "66px",
            backgroundColor: " #F95455",
            textAlign: "center"
          })
        }
      );
      break;
    default:
      toast(
        <div>
          <span>{msg}</span>
        </div>,
        {
          className: css({
            minHeight: "66px",
            textAlign: "center"
          })
        }
      );
      break;
  }
};


function Snowy() {

  var c = document.getElementById('canv'),
    $ = c.getContext("2d");
  var w = c.width = window.innerWidth,
    h = c.height = window.innerHeight;


  var snow, arr = [];
  var num = 20,
    tsc = 1,
    sp = 1;
  var sc = 1.3,
    t = 0,
    mv = 20,
    min = 1;
  for (var i = 0; i < num; ++i) {
    snow = new Flake();
    snow.y = Math.random() * (h + 20);
    snow.x = Math.random() * w;
    snow.t = Math.random() * (Math.PI * 2);
    snow.sz = (100 / (10 + (Math.random() * 100))) * sc;
    snow.sp = (Math.pow(snow.sz * .8, 2) * .15) * sp;
    snow.sp = snow.sp < min ? min : snow.sp;
    arr.push(snow);
  }
  go();

  function go() {
    window.requestAnimationFrame(go);
    $.clearRect(0, 0, w, h);
    $.fillStyle = 'hsla(242, 95%, 3%, 0)';
    $.fillRect(0, 0, w, h);
    $.fill();
    for (var i = 0; i < arr.length; ++i) {
      var f = arr[i];
      f.t += .05;
      f.t = f.t >= Math.PI * 2 ? 0 : f.t;
      f.y += f.sp;
      f.x += Math.sin(f.t * tsc) * (f.sz * .3);
      if (f.y > h + 50)
        f.y = -10 - Math.random() * mv;
      if (f.x > w + mv)
        f.x = -mv;
      if (f.x < -mv)
        f.x = w + mv;
      f.draw();
    }
  }

  function Flake() {
    this.draw = function () {
      this.g = $.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.sz);
      this.g.addColorStop(0, 'hsla(255,255%,255%,1)');
      this.g.addColorStop(1, 'hsla(255,255%,255%,0)');
      $.moveTo(this.x, this.y);
      $.fillStyle = this.g;
      $.beginPath();
      $.arc(this.x, this.y, this.sz, 0, Math.PI * 2, true);
      $.fill();
    }
  }
}

export { Notify, Snowy };
