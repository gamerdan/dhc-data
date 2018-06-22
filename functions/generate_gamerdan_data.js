require("dotenv").load();
const inputPath = process.env.INPUT_PATH;

// Imports
const fs = require("fs");
const parse = require("./parse/parse_raw");
const loadUnitData = require("./load/load_data_files");

const rawData = loadUnitData(inputPath);

function multi_replace( find, replace, text ){
    var i = 0;
    find.forEach( f => {
        text = text.split(f).join(replace[i]);
        i++;
    } );
    return text;
}

function indexLanguage(language) {
    var lang = {};
    language.forEach(item => {
        lang[item.Id] = item.Text;
    });
    return lang;
}

var combatEquations = parse ( rawData.rawCombatData.CombatEquations );
var buffDebuffs = parse ( rawData.rawCombatData.Buffs );
var champions = parse ( rawData.rawUnitData.Heroes );
var skills = parse ( rawData.rawSkillData.Skills );
var characterSkills = rawData.rawSkillMapData.CharacterSkills;
championLang = indexLanguage( rawData.localization.unit.en );
championInfoLang = indexLanguage( rawData.localization.unitInfo.en );
gearLang = indexLanguage( rawData.localization.gear.en );
skillLang = indexLanguage( rawData.localization.skills.en );
skillupsLang = indexLanguage( rawData.localization.skillUps.en );
leaderSkillsLang = indexLanguage( rawData.localization.leaderSkills.en );
buffDebuffLang = indexLanguage( rawData.localization.buffs.en );

var combatEquationIndex = {};

combatEquations.forEach(ce => {
    combatEquationIndex[ce.Name] = ce;
});

var skillsIndex = {};

skills.forEach(skill => {
    var skillID = skill.SkillID;
    if ( !skillsIndex[ skillID ] ) skillsIndex[ skillID ] = [];

    if( skill.IconPath ) skill.IconPath = 'skills/' + skill.IconPath.split('/').pop();

    skill.Skillups = parse ( rawData.rawSkillData[ skill.SkillUpTable ] );

    if( combatEquationIndex[ skillID ] ){
        //skill.CombatEquations = combatEquationIndex[ skillID ];
        skill.Modifier = combatEquationIndex[ skillID ].Equation1;

        if (skill.Modifier) {
            skill.Modifier = skill.Modifier.split('{').join("<span class='menu_highlight_white'>");
            skill.Modifier = skill.Modifier.split('}').join("</span>");
        } else {
            skill.Modifier = 'Unknown';
        }
    }

    skill.Skillups.forEach(skillup => {
        skillup.Description = 'No Description';

        if ( skillup.StringID ) {
            var locID = skillup.StringID.replace('skillups.','');
            skillup.Description = skillupsLang[ locID ];

            skillup.Description = skillup.Description.replace('{%BonusValue_flat}', (skillup.BonusValue_flat * 100) + '%');
            skillup.Description = skillup.Description.replace('{BonusValue_flat}', skillup.BonusValue_flat);
            skillup.Description = skillup.Description.replace('{+%BonusValue_flat}', (skillup.BonusValue_flat * 100) + '%');
            skillup.Description = skillup.Description.replace('{%BonusValue_percent}', (skillup.BonusValue_percent * 100) + '%');
        }

        delete skillup.StringID;
    });

    skill.SkillupsText = [];

    skill.Skillups.forEach(skillup => {
        skill.SkillupsText.push(skillup.Description);
    });

    skill.SkillupsText = "<ul class='skillups'><li>" + skill.SkillupsText.join('</li><li>') + '</li></ul>';

    skill.Title = skillLang[ skillID + '_name' ];

    var skillDescription1 = skillLang[ skillID + '_desc' ]
    var skillDescription2 = skillLang[ skillID + '_desc2' ]
    var skillDescription = [ skillDescription1 ];
    if ( skillDescription2 ) skillDescription.push( skillDescription2 );

    skill.Description = '<p>' + skillDescription.join('</p><p>') + '</p>';
    skill.Description = skill.Description.split("<font color='{").join("<span class='");
    skill.Description = skill.Description.split("}'>").join("'>");
    skill.Description = skill.Description.split("</font>").join("</span>");
    skill.Description = skill.Description.split("{icon.").join("<i class='icon-");
    skill.Description = skill.Description.split("}&nbsp;").join("'></i>&nbsp;");


    delete skill.LoreLocID;
    delete skill.LocId;
    delete skill.SkillUpTable;
    delete skill.DescriptionLocId;
    skillsIndex[ skillID ] = skill;
});

var championLore = {};

rawData.localization.lore.en.forEach(item => {
    var family = item.Id.split('_')[0];
    if ( !championLore[ family ] ) championLore[ family ] = [];
    championLore[ family ].push( item.Text );
});

var championIndex = {};

champions.forEach(champion => {
    championIndex[champion.HeroID] = champion;
});

champions.forEach(champion => {
    champion.Stats = parse( rawData.rawUnitData[champion.StatsTable] );
    champion.Title = championLang['name_' + champion.HeroID];
    champion.Moba = false;
    champion.IconPath = 'champions/' + champion.HeroID + '.png';

    var familySkills = characterSkills[champion.Family];
    var sharedSkills = familySkills['Family'];
    var elementSkills = familySkills[champion.Element.toLowerCase()];
    var elementSkillsAwakened = familySkills[champion.Element.toLowerCase() + '_awk'];
    var combinedSkills = {...sharedSkills, ...elementSkills, ...elementSkillsAwakened};

    //Add awakened skills


    var skills = [];
    var find = [];
    var replace = [];

    Object.keys( combinedSkills ).forEach( key => {
        var skill = skillsIndex[ combinedSkills[ key ] ];
        find.push('{' + key + '.name}');
        replace.push("<span class='menu_highlight_white skillref'>" + skill.Title + "</span>");
        combinedSkills[ key ] = skill;
    } );

    //Process the descriptions
    Object.values( combinedSkills ).forEach( skill => {
        skill.Description = multi_replace( find, replace, skill.Description );
    } );


    // Order the skills
    if ( combinedSkills.AutoAttackSkill ) skills.push( combinedSkills.AutoAttackSkill );
    if ( combinedSkills.FirstSkill ) skills.push( combinedSkills.FirstSkill );
    if ( combinedSkills.SecondSkill ) skills.push( combinedSkills.SecondSkill );
    if ( combinedSkills.ThirdSkill ) skills.push( combinedSkills.ThirdSkill );
    if ( combinedSkills.FourthSkill ) skills.push( combinedSkills.FourthSkill );
    if ( combinedSkills.FifthSkill ) skills.push( combinedSkills.FifthSkill );

    // TODO Get the leader skill
    var awakenedChampion = championIndex[champion.HeroID + '_awk'];

    if ( champion.LeaderTraitStat || (awakenedChampion && awakenedChampion.LeaderTraitStat) ){
        var awakenedSkill = (awakenedChampion && !champion.LeaderTraitStat && awakenedChampion.LeaderTraitStat) ? true : false;
        var champ = awakenedSkill ? awakenedChampion : champion;
        var skillID = 'leader_' + champ.LeaderTraitCondition.toLowerCase() + '_' + champ.LeaderTraitStat.toLowerCase();
        var skillIDDesc = 'leader_' + champ.LeaderTraitCondition.toLowerCase() + '_desc';
        var IconPath = 'skills/leader_trait_attack_' + champ.Element.toLowerCase() + '.png';
        var Name = leaderSkillsLang[ skillID + '_name' ];
        var skill = {
            SkillID: skillID,
            IconPath: IconPath,
            Title: 'Synergy Trait ' + Name,
            Description: leaderSkillsLang[ skillIDDesc ],
            Skillups: [],
            SkillupsText: '',
            IsLeaderSkill: true,
            AwakenedSkill: awakenedSkill
        };

        if ( skill.Description ) {
            skill.Description = skill.Description.replace('{+%statPercentageBoost}', '+' + (champ.LeaderTraitPercentageBoost * 100) + '%');
            skill.Description = skill.Description.replace('{%statPercentageBoost}', (champ.LeaderTraitPercentageBoost * 100) + '%' );
            skill.Description = skill.Description.replace('{statName}', Name);
            skill.Description = skill.Description.split("<font color='{").join("<span class='");
            skill.Description = skill.Description.split("}'>").join("'>");
            skill.Description = skill.Description.split("</font>").join("</span>");
            skill.Description = skill.Description.split("{icon.").join("<i class='icon-");
            skill.Description = skill.Description.split("}&nbsp;").join("'></i>&nbsp;");
        }


        skills.push(skill);
    }

    champion.Skills = skills.map(skill => {
        var newSkill = Object.assign({}, skill);
        if ( newSkill.IsTinted ) newSkill.IconPath = newSkill.IconPath.replace('.png', '_' + champion.Element.toLowerCase() + '.png');
        delete newSkill.IsTinted;
        return  newSkill;
    });

    champion.Lore = championLore[ champion.Family.toLowerCase() ];

    if ( Array.isArray(champion.Lore) ) champion.Lore = '<p>' + champion.Lore.join('</p><p>') + '</p>';

    champion.Strength.forEach(strength => {
        if ( strength.tag === 'Moba' ) champion.Moba = true;

        if ( strength.tag ) strength.description = championInfoLang['strength_' + strength.tag.toLowerCase() + '_desc'];
        else strength.description = '';

        if ( strength.tag ) strength.title = championInfoLang['strength_' + strength.tag.toLowerCase() + '_tag'];
        else strength.title = '';
    });

    var awk = 0;
    var Awaken = {
        Title : championLang['name_' + champion.HeroID + '_awk'],
        IconPath : 'champions/' + champion.HeroID + '_awk.png',
        Bonus : champion.AwakeningBonus,
        Essences : [],
        Stats : null
    };

    champion.AwakeningEssenceIDs.forEach(id => {
        if ( id ) {
            var name = id.replace(/([A-Z])/g, ' $1').trim()
            Awaken.Essences.push({ id : id, name : name,  qty : parseInt( champion.AwakeningEssenceAmounts[awk] ) });
        }
        awk++;
    });

    champion.Awaken = Awaken;
    champion.Awakened = (champion.Awakened === "true");


    champion.RecGear = champion.RecGear.map(item => {
        var lang = gearLang["gear_set_" + item];
        if ( lang ) return lang;
        return null;
    });

    delete champion.StatsTable;
    delete champion.AwakeningBonus;
    delete champion.AwakeningEssenceIDs;
    delete champion.AwakeningEssenceAmounts;
});

champions.forEach(champion => {
    if ( !champion.Awakened ) {
        var awakenedChampion = championIndex[champion.HeroID + '_awk'];
        if ( awakenedChampion ) champion.Awaken.Stats = awakenedChampion.Stats;
    }
});

champions = champions.filter(champion => {
    return champion.DebugHero === false && champion.Awakened === false;
});

//Buff Debuffs
// buffDebuffLang
// buffDebuffs
var bdf = [];

buffDebuffs.forEach( item => {
    if (item.DisplayLocId && !item.CharacterSpecific) {

        var newItem = {};
        var lang = item.DisplayLocId.replace('buffs.','');
        newItem.Title = buffDebuffLang[ lang ]
        newItem.Description = buffDebuffLang[ 'description_' + lang ];

        if (newItem.Description) {
            newItem.Description = newItem.Description.split("<font color='{").join("<span class='");
            newItem.Description = newItem.Description.split("}'>").join("'>");
        }
        newItem.Duration = item.DefaultDuration;
        newItem.Affects = item.AffectedCharacterTypeFlag.split(', ');
        newItem.Type = item.Type;
        newItem.IconPath = item.Icon.replace('.png','_big.png');
        newItem.ExternalID = item.Id;

        if( newItem.Type != 'Buff' && newItem.Type != 'Debuff' ) return;
        if( !newItem.Title ) return;

        bdf.push( newItem );
    }
} );


//Save the final file
require("./helpers/ensure_directory")("./gamerdan_output/");
fs.writeFileSync('./gamerdan_output/champions.json', JSON.stringify(champions, null, 4));

fs.writeFileSync('./gamerdan_output/buff_debuff.json', JSON.stringify(bdf, null, 4));
fs.writeFileSync('./gamerdan_output/buff_debuff_raw.json', JSON.stringify(buffDebuffs, null, 4));

