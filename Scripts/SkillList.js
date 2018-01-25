var st_stats = [];
var ap_avail = 0;
var ap_spent = 0;
var last_attribute_clicked = -1;
var last_skill_clicked = -1;
var last_mutation_clicked = -1;
var max_weight = 0;
var health = 0;
var stamina = 0;
var gamma = 0;
var base_ap_avail = 0;
//-----------------------------------------------------------------------------
var MAX_LEVEL = 55;
// Javascript doesn't have ENUMs :(
var NONE = -1, UNKNOWN = -2;
// Character Details   
var LEVEL = 0, BONUSAP = 1;
// Derived Stats - Gamma, Stamina, Health, Weight
var GAMMA = 0, STAMI = 1, HEALT = 2, WEIGH = 3;
// Attributes
var CHARI = 2, COORD = 3, DEXTE = 4, ENDUR = 5, INTEL = 6, PERCE = 7, STREN = 8, WILLP = 9;
// Skills
var AR_US = 10, DI_TR = 11, DODGE = 12, ES_AR = 13, FI_AI = 14, GR_TA = 15, HE_WE = 16, MELEE = 17, PISTO = 18, POWER = 19, PRECI = 20, RIFLE = 21, SOCIA = 22, CRAFT = 23;
// Mutations
var ALPHA = 24, EMPAT = 25, ENHAN = 26, ILLUM = 27, NA_MA = 28, PA_TR = 29, PRIMA = 30, SONIC = 31, SUPPR = 32, TELEK = 33, TH_CO = 34;
//-----------------------------------------------------------------------------
// Derived Attribute, Modifier, Attribute Name
var COUNT_ATTRIBUBTES = 8;   
var attribute_details = [
    [GAMMA, 2, "Charisma"], 
    [STAMI, 2, "Coordination"], 
    [STAMI, 3, "Dexterity"], 
    [HEALT, 4, "Endurance"], 
    [GAMMA, 3, "Intelligence"], 
    [NONE,  0, "Perception"], 
    [HEALT, 3, "Strength"], // Max Weight = .5 lbs per point
    [NONE,  0, "Willpower"]
];
//-----------------------------------------------------------------------------   
// Base Stat 1, %, Base Stat 2, %, Skill Name
var COUNT_SKILLS = 14;   
var skill_details = [
    [ENDUR, 75, COORD, 25, "Armor Use"], 
    [DEXTE, 50, COORD, 50, "Dirty Tricks"], 
    [COORD, 50, PERCE, 50, "Dodge"], 
    [DEXTE, 50, COORD, 50, "Escape Artist"], 
    [INTEL, 75, PERCE, 25, "First Aid"], 
    [INTEL, 75, COORD, 25, "Group Tactics"], 
    [STREN, 50, PERCE, 50, "Heavy Weapons"], 
    [STREN, 50, COORD, 50, "Melee"], 
    [DEXTE, 50, PERCE, 50, "Pistol"], 
    [STREN, 50, ENDUR, 50, "Power"], 
    [DEXTE, 50, INTEL, 50, "Precision"], 
    [DEXTE, 50, PERCE, 50, "Rifle"], 
    [CHARI, 75, PERCE, 25, "Social"], 
    [INTEL, 75, PERCE, 25, "Tradeskills"]
];
//-----------------------------------------------------------------------------   
// Base Stat 1, %, Base Stat 2, %, Skill Name
var COUNT_MUTATIONS = 11;
var mutation_details = [
    [WILLP, 50, WILLP, 50, "Alpha"], // 100% Will Power
    [CHARI, 75, WILLP, 25, "Empathic"], 
    [CHARI, 75, WILLP, 25, "Enhancement"], 
    [COORD, 75, WILLP, 25, "Illumination"], 
    [INTEL, 75, WILLP, 25, "Nano-Manipulation"], 
    [ENDUR, 75, WILLP, 25, "Patho-Transmission"], 
    [STREN, 75, WILLP, 25, "Primal"], 
    [DEXTE, 75, WILLP, 25, "Sonic Influence"], 
    [PERCE, 75, WILLP, 25, "Suppression"], 
    [COORD, 75, WILLP, 25, "Telekinesis"], 
    [INTEL, 75, WILLP, 25, "Thermal Control"]
];
//-----------------------------------------------------------------------------   
// Categories - Defensive, Offensive, Support
var cat_types = [ "Defensive", "Offensive", "Support" ];
var DEF = 0, OFF = 1, SUP = 2;
// Slot - Aura, Active Skill, Prepared Attack, Stance, Toggle, Aimed
var slot_types = [ "Aura", "Active", "Prepared Attack", "Stance", "Toggle", "Aimed" ];
var AUR = 0, ASK = 1, PAT = 2, STA = 3, TOG = 4, AIM = 5;
// Type - Buff, Cure, Debuff, Direct Damage, Damage over time, Heal, Resurrect, Buff/Debuff, Debuff/DoT
var type_types = [ "Buff", "Cure", "Debuff", "Direct Damage", "DOT", "Heal", "Resurrect", "Buff/Debuff", "Debuff/DoT" ];
var BUF = 0, CUR = 1, DEB = 2, DDA = 3, DOT = 4, HEA = 5, RES = 6, BDB = 7, DDO = 8;
// Target - Area of Effect, Enemy, Friend, Self, Team, Weapon, Self/Friend, Enemy AoE, Enemy Cone, Team Cone
var target_types = [ "Area of Effect", "Enemy", "Friend", "Self", "Team", "Weapon", "Self/Friend", "Enemy (AoE)", "Enemy (Cone)", "Team (Cone)" ];
var AOE = 0, ENE = 1, FRI = 2, SEL = 3, TEA = 4, WEA = 5, SFR = 6, ENA = 7, ECO = 8, TCO = 9;
//-----------------------------------------------------------------------------   
// Skill/Mutation, Category, Slot, Type, Target, Name, Effects, Ranks (variable number) 
var COUNT_ABILITIES = 74;
var ability_details = [
// Skill Abilities
    [AR_US, DEF, STA, BDB, SEL, "Dreadnaught", "This Armor Use ability increases your Primary Armor values by (75/116/158/200/242/283/325/366/408/450), but lowers your speed (10/9/9/8/8/7/7/6/6/5)%. Only one stance may be used at a time.", [54, 69, 84, 99, 114, 129, 144, 159, 174, 189] ], 
    [AR_US, DEF, STA, BDB, SEL, "Soak Elements", "This Armor Use ability increases your Secondary and Tertiary Armor Values by (186/245/303/361/420/478/536/595/653) and (266/350/433/516/600/683/766/850/933), but lowers your Primary Armor values by (125/166/208/250/291/333/375/416/458). Only one stance may be used at a time.", [75, 90, 105, 120, 135, 150, 165, 180, 195] ], 

    [DI_TR, OFF, PAT, DOT, WEA, "Dirty Steel", "This Dirty Tricks ability causes your next attack to inflict (6/8/12/16/20/24) poison damage per second for 10 seconds. Costs (17/25/37/48/60/60) stamina and has a 30 second cooldown. Resist- Body.", [33, 63, 93, 123, 153, 183] ], 
    [DI_TR, OFF, PAT, DEB, WEA, "Kneecap", "This Dirty Tricks ability causes your next attack to also slow your target by (21/24/27/30/33/36)% for 7 seconds. Costs (18/29/41/53/64/76) stamina and has a 45 second cooldown. Resist- Reflex.", [45, 75, 105, 135, 165, 195] ], 
    [DI_TR, OFF, PAT, DEB, WEA, "Sabotage", "This Dirty Trick ability causes your next attack to also lower your target's primary armor by (236/434/646/872/1113) for 15 seconds. NPC's effected by this ability have their physical damage reduced by (15/20/25/30/40)% for the duration. Costs (27/39/51/62/74) Stamina and has a 1 minute cooldown. Resist-Body.", [70, 100, 130, 160, 190] ], 

    [DODGE, DEF, STA, BDB, SEL, "Duck and Weave", "This Dodge ability reduces 5% of incoming damage, while reserving (50/45/40/35/20)% Stamina. Only one stance may be used at a time.", [57, 87, 117, 147, 177] ], 

    [ES_AR, DEF, ASK, BDB, SEL, "Dash", "This Escape Artist ability increases your speed by (25/35)% for 6 seconds, but decreases your combat abilities by 50%. Costs 25% stamina and has a (2 minute/90 seconds) cooldown.", [57, 132] ], 
    [ES_AR, SUP, ASK, BUF, SEL, "Save Yourself", "This Escape Artist ability temporarily grants you 20% additional max hp. The health is lost when this effect expires. 2.5 minute cooldown.", [84, 114, 144, 174] ], 
    [ES_AR, DEF, ASK, BUF, SEL, "Misdirection", "This Escape Artist ability increases your primary armor by (283/449/616/783) and your secondary and tertiary armor by (339/539/739/939) for 10 seconds. Costs (24/30/36/42) stamina and has a 60 second cooldown.", [105, 135, 165, 195] ], 
    [ES_AR, DEF, ASK, CUR, SEL, "Shake It Off", "This Escape Artist ability removes negative status effect counters and effect level (3/5/7/9/11/13) or lower level snares from yourself. Multiple applications may be needed for serious conditions. Costs (10/23/35/47/59/71) stamina and has a 30 seconds cooldown.", [30, 60, 90, 120, 150, 180] ], 

    [FI_AI, SUP, ASK, HEA, SFR, "Stanch Wound", "This First Aid ability heals your target for (16/31/76/121/166/211/256) and increases their health regeneration by (1/2/4/6/8/10/12) for the next hour. Costs (8/15/27/40/52/65/77) stamina and has a 6 second cooldown. Requires a (ragged/ragged/tattered/tattered/average/average/superior) bandage or equivalent item.", [1, 36, 66, 96, 126, 156, 186] ], 
    [FI_AI, SUP, ASK, CUR, SFR, "Suck It Up", "This First Aid ability removes negative status effect counters from your target. Multiple applications may be needed for serious conditions. Costs (2/7/12/17/22/27/32) stamina and has a (0.5/0.5/0.5/0.5/0.5/0.5/1.5) second cooldown.", [12, 42, 72, 102, 132, 162, 192] ], 
    [FI_AI, SUP, ASK, CUR, SFR, "Renew", "This First Aid ability removes negative status effect counters and effect level (5/7/9/11) or lower snares from your target. Multiple applications may be needed for serious conditions. Costs (35/47/60/72) stamina and has a 40 second cooldown.", [84, 114, 144, 174] ], 
    [FI_AI, SUP, ASK, RES, FRI, "Resuscitation", "This First Aid ability revives a very close target with (52/97/142) health and then increases their health regeneration by (14/26/38) for 1 minute. Costs (16/40/64) stamina and has a 15 second cooldown.", [39, 99, 159] ], 

    [GR_TA, SUP, AUR, BUF, TEA, "Combat Endurance", "+Dodge (10-60)", [42, 72, 102, 132, 162, 192] ], 
    [GR_TA, SUP, AUR, BDB, TEA, "Offensive Coordination", "+Stamina Regen +Precision (10-60) -Dodge", [30, 60, 90, 120, 150, 180] ], 
    [GR_TA, SUP, AUR, BUF, TEA, "Give em Hell", "+Power 30-45-60-75-90", [60, 90, 120, 150, 180] ], 
    [GR_TA, OFF, ASK, DEB, ENE, "Overwhelm", "-Armor -Defense", [69, 99, 129, 159, 189] ], 

    [HE_WE, OFF, ASK, DEB, ENA, "Caltrops", "+Snare", [195] ], 
    [HE_WE, OFF, ASK, DEB, ENA, "Soften em Up", "-Resist Slashing/Piercing/Fire/Acid 10 sec", [150, 180] ], 
    [HE_WE, OFF, STA, BUF, SEL, "Suppressive Fire", "+Damage: HW, Grenade, Mutation 5% / 10%", [165, 195] ], 

    [MELEE, OFF, ASK, BUF, SEL, "Charge", "+Speed", [60, 90, 120, 150, 180] ], 
    [MELEE, OFF, ASK, BDB, ENE, "Provoke", "+Threat -Defence, Remove/Block PVP Charge", [45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195] ], 
    [MELEE, OFF, STA, BUF, SEL, "Bloodlust", "+Melee skill (15/25/37)", [60, 105, 150] ], 

    [PISTO, OFF, PAT, DOT, WEA, "Incendiary Strike", "+DoT Fire", [60, 90, 120, 150, 180] ], 
    [PISTO, OFF, ASK, BUF, SEL, "Perfect Timing", "+Precision (20-40-60-80-100) for all shots within 6 sec", [63, 93, 123, 153, 183] ], 
    [PISTO, OFF, STA, BUF, SEL, "Desperado", "+Pistol skill (15/25/37)", [60, 105, 150] ], 

    [POWER, OFF, STA, BDB, SEL, "Attack Posture", "+Power (25-125) -Precision (10-50)", [63, 93, 123, 153, 183] ], 
    [POWER, OFF, PAT, DEB, WEA, "Dent Armor", "-Armor +Stun", [51, 81, 111, 141, 171] ], 

    [PRECI, OFF, ASK, BUF, SEL, "Precise Hit", "+Damage (35-40-45-50-60%) 1 shot within 6 sec", [51, 81, 111, 141, 171] ], 
    [PRECI, OFF, STA, BDB, SEL, "Concentration", "+Precision & All Weapon Skill -Power (25-100)", [60, 105, 150, 195] ], 

    [RIFLE, OFF, PAT, DEB, WEA, "Agonizing Wound", "+Snare", [54, 84, 114, 144, 174] ], 
    [RIFLE, OFF, ASK, BUF, SEL, "Bull's Eye", "+Damage (35-40-45-50-60%) 1 shot within 6 sec", [60, 90, 120, 150, 180] ], 
    [RIFLE, OFF, STA, BUF, SEL, "Marksman", "+Rifle skill (15/25/37)", [60, 105, 150] ], 

    [SOCIA, DEF, ASK, BDB, FRI, "Diplomatic Immunity", " +All Armor & Defence 12sec", [60, 90, 120, 150, 180] ], 
    [SOCIA, SUP, AUR, BUF, TEA, "Motivational Speaker", "+3-6-9-12-15% to all heals", [70, 100, 130, 160, 190] ], 
    [SOCIA, DEF, ASK, DEB, ENE, "Inconspicuous", "-Threat", [45, 75, 105, 135, 165, 195] ], 

// Mutation Abilities
    [ALPHA, OFF, TOG, BUF, SEL, "Bolster", "+Max Stamina +Power", [9, 30, 51, 72] ], 
    [ALPHA, OFF, PAT, DEB, WEA, "Disrupt", "-Defense - Saves", [9, 30, 51, 72] ], 
    [ALPHA, DEF, TOG, BUF, SEL, "Gird", "+Max Health", [9, 30, 51, 72] ], 
    [ALPHA, DEF, ASK, HEA, SEL, "Patch", "+Health -Effect", [9, 30, 51, 72] ], 

    [EMPAT, SUP, ASK, HEA, SFR, "Benevolence", "+Health", [45, 63, 81, 99, 117, 135, 153, 171, 189] ], 
    [EMPAT, SUP, ASK, CUR, SFR, "Preservation", "-DoT", [54, 72, 90, 108, 126, 144, 162, 180] ], 
    [EMPAT, SUP, ASK, HEA, SFR, "Restoration", "+HoT", [75, 93, 111, 129, 147, 165, 183] ], 
    [EMPAT, SUP, ASK, RES, FRI, "Share Life", "+Raise Dead (target) -Health (self)", [48, 66, 84, 102, 120, 138, 156, 174, 192] ], 

    [ENHAN, DEF, STA, BUF, SEL, "Ablate", "+Armor -Power/Precision", [72, 90, 108, 126, 144, 162, 180] ], 
    [ENHAN, SUP, AUR, BUF, TEA, "Calibration", "+Armor (Primary Resists)", [48, 66, 84, 102, 120, 138, 156, 174, 192] ], 
    [ENHAN, SUP, AUR, BUF, TEA, "Resilience", "+Secondary & Tertiary Resists", [60, 78, 96, 114, 132, 150, 168, 186] ], 

    [ILLUM, SUP, ASK, BUF, TEA, "Endless Reserves", "Recharge Team (not user) Stamina & Gamma", [60, 78, 96, 114, 132, 150, 168, 186] ], 
    [ILLUM, SUP, AUR, BUF, TEA, "Meditation", "+Regen Stamina & Gamma (3-19) +Mutation/HW/Grenade damage", [48, 66, 84, 102, 121, 138, 156, 174, 192] ], 
    [ILLUM, SUP, AUR, BUF, TEA, "Enlighten", "+Maximum Stamina & Gamma (15-20-25-30-35-40-45-50)", [54, 72, 90, 108, 126, 144, 162, 180] ], 

    [NA_MA, SUP, AIM, HEA, FRI, "Filtration", "+Health -Effect, Allow fire 2 pistols by LMB", [57, 75, 93, 111, 129, 147, 164, 183] ], 
    [NA_MA, SUP, ASK, RES, TCO, "Reconstruction", "Mass Cone Raise Dead", [48, 66, 84, 102, 120, 138, 156, 174, 192] ], 
    [NA_MA, SUP, ASK, BUF, TEA, "Revitalize", "+Regen Health", [72, 90, 108, 126, 144, 162, 180] ], 
    [NA_MA, SUP, ASK, HEA, TEA, "Vital Osmosis", "+Health to all Team in Raid", [45, 63, 81, 99, 117, 135, 153, 171, 189] ], 

    [PA_TR, OFF, ASK, DEB, ENE, "Thwarted Intention", "-Healing Effects to target (-10-50%)", [60, 78, 96, 114, 132, 150, 168, 186] ], 
    [PA_TR, OFF, ASK, DEB, ENA, "Sapping Sickness", "+Snare (12-30% 10 sec)", [72, 90, 108, 126, 144, 162, 180] ], 
    [PA_TR, OFF, ASK, DEB, ENE, "Wracking Pains", "-Regen (-9-33)", [48, 66, 84, 102, 120, 138, 156, 174, 192] ], 

    [PRIMA, OFF, ASK, BUF, SEL, "Beast Might", "+Damage (35-60%) 1 shot within 6 sec -Health(Self)", [72, 90, 108, 126, 144, 162, 180] ], 
    [PRIMA, OFF, TOG, BUF, SEL, "Primal Vigor", " +Max Health -50% Gamma", [48, 66, 84, 102, 120, 138, 156, 174, 192] ], 
    [PRIMA, OFF, ASK, BDB, SEL, "Rampage", "+Power/Precision/Armor 15 sec -same 15 sec", [60, 78, 96, 114, 132, 150, 168, 186] ], 

    [SONIC, OFF, ASK, DEB, ENE, "Catastrophic Dissonance", "+Snare (18-34%)", [60, 78, 96, 114, 132, 150, 168, 174] ], 
    [SONIC, OFF, AIM, DOT, ECO, "Rending Vibration", "+DoT (Sonic)", [72, 90, 108, 126, 144, 162, 180] ], 
    [SONIC, OFF, ASK, DDA, ENE, "Sonic Lance", "+Damage (Sonic)", [48, 66, 84, 102, 120, 138, 156, 174, 192] ], 

    [SUPPR, OFF, ASK, DEB, ENE, "Denial", "-Stamina -Gamma", [48, 66, 84, 102, 120, 138, 156, 174, 192] ], 
    [SUPPR, SUP, ASK, BDB, ENE, "Sap Stamina", "-Stamina(Enemy) +Stamina(Team)", [72, 90, 108, 126, 144, 162, 180] ], 
    [SUPPR, SUP, ASK, BDB, ENE, "Siphon Energy", "-Gamma(Enemy) +Gamma(Team)", [60, 78, 96, 114, 132, 150, 168, 186] ], 

    [TELEK, OFF, ASK, DOT, ENE, "Always Armed", "+DoT (Piercing)", [48, 66, 84, 102, 120, 138, 156, 174, 192] ], 
    [TELEK, OFF, ASK, DEB, ENE, "Bend Metal", "-Armor, Allow fire 2 pistols by LMB", [72, 90, 108, 126, 144, 162, 180] ], 
    [TELEK, OFF, ASK, DDA, ENE, "Propel", "+Damage (Crushing)", [60, 78, 96, 114, 132, 150, 168, 186] ], 

    [TH_CO, OFF, ASK, DDA, ENE, "Cold Snap", "+Damage (Cold)", [45, 63, 81, 99, 117, 135, 153, 171, 189] ], 
    [TH_CO, OFF, ASK, DOT, ENE, "Hypothermia", "+DoT (Cold)", [48, 66, 84, 102, 120, 138, 156, 174, 192] ], 
    [TH_CO, OFF, ASK, DDA, ENE, "Molotov Cocktail", "+Damage (Fire)", [72, 90, 108, 126, 144, 162, 180] ], 
    [TH_CO, OFF, ASK, DOT, ENE, "Napalm", "+DoT (Fire)", [57, 75, 93, 111, 129, 147, 165, 183] ]
];
