$(function() {
 
    var increment = Math.PI / 256;
    var TWO_PI = Math.PI * 2;

    var elem = document.getElementById('draw-shapes');
    var type = 'svg';
    var two = new Two({
      type: Two.Types[type],
      fullscreen: false,
      width: 285, height: 200
    }).appendTo(elem);

    var background = two.makeGroup();
    var middleground = two.makeGroup();
    var foreground = two.makeGroup();

    var sun = makeSun(two);
    sun.translation.set(two.width / 2, two.height / 2);

    middleground.add(sun);

    var isBackground = false;
    var earth = two.makeCircle(two.width * 0.33, two.height * 0.66, two.height / 12);
    earth.stroke = 'rgba(28, 117, 188, 0.66)';
    earth.linewidth = 4;
    earth.fill = 'rgb(0, 200, 255)';

    two
      .bind('resize', function() {

        sun.translation.x = two.width / 2;
        sun.translation.y = two.height / 2;
        path.translation.copy(sun.translation);

      })
      .bind('update', function(frameCount) {

        var osc = Math.sin(- frameCount / (Math.PI * 8));

        if (osc >= 0.9 && isBackground) {
          foreground.add(earth);
          isBackground = false;
        }
        if (osc <= - 0.9 && !isBackground) {
          background.add(earth);
          isBackground = true;
        }

        earth.translation.x = osc * two.width / 4 + two.width / 2;
        earth.translation.y = - osc * two.height / 4 + two.height / 2;

        if (sun.rotation >= TWO_PI - 0.0625) {
          sun.rotation = 0;
        }

        sun.rotation += (TWO_PI - sun.rotation) * 0.0091;

      })
      .play();

  });

  function makeSun(two) {

    var color = 'rgba(255, 128, 0, 0.66)';
    var sun = two.makeGroup();
    var radius = two.height / 4;
    var gutter = two.height / 20;

    var core = two.makeCircle(0, 0, radius);
    core.noStroke();
    core.fill = color;

    sun.core = core;

    var coronas = [];
    var corona_amount = 16;
    for (var i = 0; i < corona_amount; i++) {
      var pct = (i + 1) / corona_amount;
      var theta = pct * Math.PI * 2;
      var x = (radius + gutter) * Math.cos(theta);
      var y = (radius + gutter) * Math.sin(theta);
      var corona = makeTriangle(two, gutter);
      corona.noStroke();
      corona.fill = color;
      corona.translation.set(x, y);
      corona.rotation = Math.atan2(-y, -x) + Math.PI / 2;
      coronas.push(corona);
    }

    sun.add(core).add(coronas);

    return sun;

  }

  function makeTriangle(two, size) {
    var tri = two.makePath(- size / 2, 0, size / 2, 0, 0, size);
    return tri;
  }