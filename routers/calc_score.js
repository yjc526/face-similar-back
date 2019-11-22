function calc_score(result) {
    const score = { "similar": null, "male": null, "female": null };

    /////////////////////////////  similar score start  /////////////////////////////
    const cohesion_point = parseInt(result.cohesion * 100);
    let age_point = 0;
    let emotion_point = 0;
    console.log(result);
    console.log(result.male.info);

    const age_gap = Math.abs(result.male.info.age - result.female.info.age);
    if (age_gap < 5) {
        age_point = 7;
    } else if (age_gap < 10) {
        age_point = 4;
    }


    if (result.male.info.emotion.first.emotion == result.female.info.emotion.first.emotion) {
        if (result.male.info.emotion.second.emotion == result.female.info.emotion.second.emotion) {
            emotion_point = 4
        } else {
            emotion_point = 2
        }
    }

    score.similar = cohesion_point + age_point + emotion_point;
    /////////////////////////////  similar score end  /////////////////////////////



    /////////////////////////////  male/female score start  /////////////////////////////
    score.male = 20 + result.male.faceCount * 2 + result.male.info.smile * 10 -
        result.male.info.age - result.male.info.bald * 10

    score.female = 20 + result.female.faceCount * 2 + result.female.info.smile * 10 -
        result.female.info.age - result.female.info.bald * 10
    /////////////////////////////  male/female score end  /////////////////////////////

    
    return score;
}

module.exports = calc_score