function calc_score(result) {
    const score = { "similar": null, "male": null, "female": null };

    /////////////////////////////  similar score start  /////////////////////////////
    const cohesion_point = parseInt(result.cohesion * 100);
    let age_point = 0;
    let emotion_point = 0;

    const age_gap = Math.abs(result.info.male.age - result.info.female.age);
    if (age_gap < 5) {
        age_point = 7;
    } else if (age_gap < 10) {
        age_point = 4;
    }


    if (result.info.male.emotion.first.emotion == result.info.female.emotion.first.emotion) {
        if (result.info.male.emotion.second.emotion == result.info.female.emotion.second.emotion) {
            emotion_point = 4
        } else {
            emotion_point = 2
        }
    }

    score.similar = 40 + cohesion_point + age_point + emotion_point;
    /////////////////////////////  similar score end  /////////////////////////////



    /////////////////////////////  male/female score start  /////////////////////////////
    score.male = Math.round((100 + result.info.male.faceCount * 5 + result.info.male.smile * 5 -
        result.info.male.age * 1.5 - result.info.male.bald * 20)*100)/100;

    score.female = Math.round((100 + result.info.female.faceCount * 5 + result.info.female.smile * 5 -
        result.info.female.age * 1.5 - result.info.female.bald * 20)*100)/100;
    /////////////////////////////  male/female score end  /////////////////////////////


    return score;
}

module.exports = calc_score