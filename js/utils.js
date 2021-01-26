function arriveTurnDesc(turnType) {
    if (turnType === 'sharp right') {
        return '右后方';
    } else  if (turnType === 'right') {
        return '右侧';
    } else  if (turnType === 'slight right') {
        return '右前方';
    } else  if (turnType === 'straight') {
        return '前方';
    } else  if (turnType === 'slight left') {
        return '左前方';
    } else  if (turnType === 'left') {
        return '左侧';
    } else  if (turnType === 'sharp left') {
        return '左后方';
    } else  if (turnType === 'uturn') {
        return '后方';
    }
}
function directionDesc(angle) {
    if (angle > 120 && angle < 180)
        return '西南';
    if (angle > 40 && angle <= 120)
        return '西';
    if (angle > 20 && angle <= 40)
        return '西北';
    if (angle >= 0 && angle <= 20 || angle >= 340 && angle <= 360)
        return '北';
    if (angle > 320 && angle < 340)
        return '东北';
    if (angle > 240 && angle <= 320)
        return '东';
    if (angle > 180 && angle <= 240)
        return '东南';
    return "南";
}

function distanceDesc2(length) {
    length = Math.round(length);
    return length < 1000 ?  length + '米' : fixNumber(length / 1000, 1) + '公里';
}
function distanceDesc(length) {
    if (length <= 15)
        return "马上";
    else if (length <= 150)
        return Math.round(length / 10) * 10 + '米';
    else if (length <= 250)
        return '200米';
    else if (length <= 350)
        return '300米';
    else if (length <= 450)
        return '400米';
    else if (length <= 550)
        return '500米';
    else if (length <= 650)
        return '600米';
    else if (length <= 750)
        return '700米';
    else if (length <= 850)
        return '800米';
    else if (length <= 950)
        return '900米';
    else if (length <= 1050)
        return '1公里';
    else {
        return fixNumber(length / 1000, 1) + '公里';
    }
}
function turnToIcon(turnType) {
    return 'icon-' + String(turnType).replace(' ', '-');
}

function turnDesc(turnType) {
    if (turnType === 'sharp right') {
        return '右后方转弯';
    } else  if (turnType === 'right') {
        return '右转';
    } else  if (turnType === 'slight right') {
        return '右前方转弯';
    } else  if (turnType === 'straight') {
        return '直行';
    } else  if (turnType === 'slight left') {
        return '左前方转弯';
    } else  if (turnType === 'left') {
        return '左转';
    } else  if (turnType === 'sharp left') {
        return '左后方转弯';
    } else  if (turnType === 'uturn') {
        return '调头';
    }
}
function fixNumber(value, length) {
    let result = value.toFixed(length);
    while (result.charAt(result.length - 1) === '0') {
        result = result.substring(0, result.length - 1);
    }
    return result.charAt(result.length - 1) === '.' ? result.substring(0, result.length - 1): result;
}
function durationDesc(duration) {

    if (duration <= 65)
        return "1分钟";

    const durationMin = duration / 60;
    if (durationMin < 60)
        return Math.round(durationMin) + "分钟";

    const durationHours = durationMin / 60;
    return fixNumber(durationHours, 1) + "小时";

}

function getRoadName(name) {
    return name || '无名道路';

}
