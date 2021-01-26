 navigationListener = {
    startNavigation: (event) => {
      console.log("startNavigation", event);
      // 添加运行marker
      if (this.runMarker) {
        this.runMarker.remove();
      }

      var el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = "url(../assets/image/arrow.png)";
      el.style.backgroundSize = "20px 20px";
      el.style.width = "20px";
      el.style.height = "20px";
      this.runMarker = new smartmapx.Marker(el)
        .setLngLat(event.target.geometry.geometry.coordinates[0])
        .addTo(this.map);
    },

    locationUpdate: (event) => {
      // 更新地图上的点
      console.log(
        `剩余里程:${distanceDesc2(
          event.toDestinationDistance
        )}; 剩余时间:${durationDesc(event.toDestinationTime)}`
      );
      const location = event.location;
      const track = event.track;
      if (track) {
        this.map.getSource("track").setData(track);
      }
      const lngLat = [location.longitude, location.latitude];
      const heading = location.heading ? location.heading : 0;
      this.runMarker.setLngLat(lngLat);
      this.runMarker.setRotate(heading);
      this.map.easeTo({
        center: lngLat,
        bearing: heading,
        pitch: 30,
        offset: [0, 100],
      });
      // map.setBearing(location.heading);
      // map.setCenter(lngLat);
    },
    showTurn: (event) => {
      // 更新导航引导信息
      const step = event.target.step;
      let html;
      if (step.maneuver.type === "arrive") {
        const modifier = "straight";
        html =
          '<div><span class="' +
          turnToIcon(modifier) +
          '"></span>' +
          distanceDesc2(event.distance) +
          "抵达</div><div>目的地</div>";
      } else {
        html =
          '<div><span class="' +
          turnToIcon(step.maneuver.modifier) +
          '"></span>' +
          distanceDesc2(event.distance) +
          driveRoadPretText(step) +
          "</div><div>" +
          getRoadName(step.name) +
          "</div>";
      }

      this.navigationControl.setHTML(html);
      //console.log("showTurn", event);
    },

    voiceTurn: (event) => {
      const voiceTurnGuidanceArray = event.target;
      const firstVoiceTurnGuidance = voiceTurnGuidanceArray[0];
      let content = "";
      if (firstVoiceTurnGuidance.step.maneuver.type === "depart") {
        content =
          "向" +
          directionDesc(firstVoiceTurnGuidance.step.maneuver.modifier) +
          "出发，行驶" +
          distanceDesc(firstVoiceTurnGuidance.nextStep);
      } else if (
        firstVoiceTurnGuidance.toTurnDistance <= 100 &&
        firstVoiceTurnGuidance.step.maneuver.type === "arrive"
      ) {
        // 即将抵达有专门事件，不播报
        return;
      } else {
        // 大于400米播报继续行驶
        if (firstVoiceTurnGuidance.toTurnDistance > 400) {
          content = "请";
          if (firstVoiceTurnGuidance.currentStep.name) {
            content += "沿" + firstVoiceTurnGuidance.currentStep.name;
          }
          content +=
            "继续行驶" + distanceDesc(firstVoiceTurnGuidance.toTurnDistance);
        } else {
          // 否则播报转弯
          content =
            "前方" + distanceDesc(firstVoiceTurnGuidance.toTurnDistance);
          if (firstVoiceTurnGuidance.step.maneuver.type !== "arrive") {
            content += turnDesc(firstVoiceTurnGuidance.step.maneuver.modifier);
            if (firstVoiceTurnGuidance.step.name)
              content +=
                "，" +
                driveRoadPretText(firstVoiceTurnGuidance.step) +
                firstVoiceTurnGuidance.step.name;
          }
        }
      }

      // 连续事件
      for (let i = 1; i < voiceTurnGuidanceArray.length; i++) {
        const voiceTurnGuidance = voiceTurnGuidanceArray[i];
        content +=
          "，随后" + turnDesc(voiceTurnGuidance.step.maneuver.modifier);
        if (voiceTurnGuidance.step.name)
          content +=
            "，" +
            driveRoadPretText(voiceTurnGuidance.step) +
            voiceTurnGuidance.step.name;
      }

      // 抵达事件
      if (
        firstVoiceTurnGuidance.toTurnDistance > 100 &&
        firstVoiceTurnGuidance.step.maneuver.type === "arrive"
      ) {
        content += "抵达目的地";
      }
      this.playVoice(content, true);
      console.log("voiceTurn", content, event);
    },

    overSpeed: (event) => {
      const content =
        "您已超速，车速" +
        event.drivingSpeed +
        "，当前路段限速" +
        event.limitSpeed;
      console.log(content);
      this.playVoice(content,false);
    },

    willEnterLastRoad: (event) => {
      console.log("willEnterLastRoad", event);
      const step = event.target.step;
      const name = step.name ? "目的地入口" : step.name + "入口";
      this.playVoice("前方" + distanceDesc2(event.distance) + "进入" + name,false);
    },

    endNavigation: (event) => {
      this.playVoice("您已到达目的地，本次导航结束",false);
      this.navigationControl.setHTML("<div>您已到达目的地，本次导航结束</div>");
      console.log("endNavigation", event);
    },

    willEndNavigation: (event) => {
      console.log("即将抵达目的地！");
      this.playVoice("即将抵达目的地！",false);
    },
  };