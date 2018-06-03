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

    [GR_TA, SUP, AUR, BUF, TEA, "Combat Endurance", "This Group Tactics ability increases the melee defense and range defense of all teammates within 30 meters by (10/20/30/40/50/60). You may only run one aura ability at a time.", [42, 72, 102, 132, 162, 192] ], 
    [GR_TA, SUP, AUR, BDB, TEA, "Offensive Coordination", "This Group Tactics ability increases the precision of all teammates within 30 meters by (10/20/30/40/50/60) and their stamina regeneration by (1/2/3/4/5/6). You may only run one aura ability at a time.", [30, 60, 90, 120, 150, 180] ], 
    [GR_TA, SUP, AUR, BUF, TEA, "Give 'em Hell", "This Group Tactics ability increases the power of all teammates within 30 meters by (30/45/60/75/90). You may only run one aura ability at a time.", [60, 90, 120, 150, 180] ], 
    [GR_TA, OFF, ASK, DEB, ENE, "Overwhelm", "This Group Tactics ability marks your target, as well as reducing their ranged and melee defense by (10/20/30/40/50) and their Primary Armor by (143/283/434/594/765) for 15 seconds. Costs (17/25/32/40/47) stamina and has a 45 second cooldown.", [69, 99, 129, 159, 189] ], 

    [HE_WE, OFF, ASK, DEB, ENA, "Caltrops", "This Heavy Weapons ability slows anyone within 5 meters of your target by 35% for 5 seconds. Costs 115 Stamina and has a 1 minute cooldown. Resist-Reflex.", [195] ], 
    [HE_WE, OFF, ASK, DEB, ENA, "Soften'em Up", "This Heavy Weapons ability affects anyone within 5 meters of your target, lowering their Piercing and Slashing resists by (466/583), Fire resist by (666/833), and Acid resist by (666/1083) also their Reflex saves by 30 for 10 seconds. Costs (83/100) Stamina and has a 1 minute cooldown. Resist- Body.", [150, 180] ], 
    [HE_WE, OFF, STA, BUF, SEL, "Suppressive Fire", "This Heavy Weapons stance increases your heavy weapons damage by (5/10)%. Also effects grenades, mutations, but does not effect damage over time effects. Only one stance may be used at a time.", [165, 195] ], 

    [MELEE, OFF, ASK, BUF, SEL, "Charge", "This Melee ability increases your speed by (10/15/20/25/30)%. It will last 8 seconds or until your next attack. Costs (33/50/66/83/100) stamina and has a 40 second cooldown.", [60, 90, 120, 150, 180] ], 
    [MELEE, OFF, ASK, BDB, ENE, "Provoke", "This Melee ability increases your target's aggression toward you and reduces their ranged and melee defense by (5/10/15/20/25/30/35/40/45/50/55) for 10 seconds. Removes and blocks the Charge ability up to rank (0/0/1/1/2/2/3/3/4/4/5). Costs (11/15/19/22/26/30/34/37/41/45/49) stamina and has a 30 second cooldown.", [45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195] ], 
    [MELEE, OFF, STA, BUF, SEL, "Bloodlust", "This Melee ability increases your melee skill by (15/25/37). Only one stance may be used at a time.", [60, 105, 150] ], 

    [PISTO, OFF, PAT, DOT, WEA, "Incendiary Strike", "This Pistol ability causes your next attack to also inflict (7/11/15/20/24) fire damage per second for 15 seconds. Costs (33/50/67/83/100) stamina and has a 45 second cooldown. Resist-Mind.", [60, 90, 120, 150, 180] ], 
    [PISTO, OFF, ASK, BUF, SEL, "Perfect Timing", "This Pistol ability increases your precision by (20/40/60/80/100). It will last 6 seconds. Costs (35/52/69/85/102) stamina and has a 30 second cooldown.", [63, 93, 123, 153, 183] ], 
    [PISTO, OFF, STA, BUF, SEL, "Desperado", "This Pistol ability increases your pistol skill by (15/25/37). Only one stance may be used at a time.", [60, 105, 150] ], 

    [POWER, OFF, STA, BDB, SEL, "Attack Posture", "This Power ability increases your power by (25/50/75/100/125) but reduces your precision by (10/20/30/40/50). Only one stance may be used at a time.", [63, 93, 123, 153, 183] ], 
    [POWER, OFF, PAT, DEB, WEA, "Dent Armor", "This Power ability causes your next attack to reduce your target's armor by (225/308/391/474/557) for 10 seconds. This will also stun NPC targets for 2 seconds. Costs (20/32/45/57/70) stamina and has a 30 second cooldown. Resist-Reflex.", [51, 81, 111, 141, 171] ], 

    [PRECI, OFF, ASK, BUF, SEL, "Precise Hit", "This Precision ability adds (35/40/45/50/60)% physical damage to your next attack within the next 6 seconds. This will also slow NPC targets by (15/17/19/21/23)% for 7 seconds. Costs (40/48/56/64/80) stamina and has a 20 second cooldown. Resist-Reflex.", [51, 81, 111, 141, 171] ], 
    [PRECI, OFF, STA, BDB, SEL, "Concentration", "This Precision ability increases your precision and weapon skills by (15/25/37/48) but decreases your Power by (25/50/75/100). Only one stance may be used at a time.", [60, 105, 150, 195] ], 

    [RIFLE, OFF, PAT, DEB, WEA, "Agonizing Wound", "This Rifle ability causes your next attack to slow your target by (17/19/21/23/25)% for 10 seconds. Costs (30/46/63/80/96) stamina and has a 30 second cooldown. Resist-Reflex.", [54, 84, 114, 144, 174] ], 
    [RIFLE, OFF, ASK, BUF, SEL, "Bull's Eye", "This Rifle ability adds (35/45/45/50/60)% physical damage to your next attack within the next 6 seconds. Costs (40/48/56/64/80) stamina and has a 15 second cooldown.", [60, 90, 120, 150, 180] ], 
    [RIFLE, OFF, STA, BUF, SEL, "Marksman", "This Rifle ability increases your rifle skill by (15/25/37). Only one stance may be used at a time.", [60, 105, 150] ], 

    [SOCIA, DEF, ASK, BDB, FRI, "Diplomatic Immunity", "This Social ability increases your Primary, Secondary, and Tertiary armor by (100/200/400/600/800), (200/400/600/800/1000), and (250/500/750/1000/1250), and your melee and ranged defense by (12/24/36/48/64) for 15 seconds. If casted on self effects are reduced by 50%. Costs (25/37/50/62/75) stamina and has a 1 minute cooldown.", [60, 90, 120, 150, 180] ], 
    [SOCIA, SUP, AUR, BUF, TEA, "Motivational Speaker", "This Social ability increases the effectiveness of heals on your team by (3/6/9/12/15)%. You may only run one aura at a time.", [70, 100, 130, 160, 190] ], 
    [SOCIA, DEF, ASK, DEB, ENE, "Inconspicuous", "This Social ability reduces the aggression your target has toward you. Costs (11/19/26/34/41/45) Stamina and has a 30 second cooldown.", [45, 75, 105, 135, 165, 195] ], 

// Mutation Abilities
    [ALPHA, OFF, TOG, BUF, SEL, "Bolster", "This Alpha mutation raises your power by (3/6/9/12) and your maximum stamina by (3/6/9/12) This ability reserves 10% of your gamma and lasts until toggled off. Only one Alpha Mutation toggle can be used at a time.", [9, 30, 51, 72] ], 
    [ALPHA, OFF, PAT, DEB, WEA, "Disrupt", "This Alpha mutation causes your next attack to also reduce your target's save values by (3/6/9/12) and their melee and ranged defense by (2/3/4/6) for 5 seconds. This will also stun the NPC for 2.5 seconds. Costs (6/17/29/40) gamma and has a 15 second cooldown. Resist-Mind.", [9, 30, 51, 72] ], 
    [ALPHA, DEF, TOG, BUF, SEL, "Gird", "This Alpha mutation raises your maximum health by (7/12/20/30). This ability reserves 15% of your gamma and lasts until toggled off. Only one Alpha Mutation toggle can be used at a time.", [9, 30, 51, 72] ], 
    [ALPHA, DEF, ASK, HEA, SEL, "Patch", "This Alpha mutation restores your target's health by (11/23/46/74) and removes negative status effect counters. Costs (7/14/21/30) gamma and has a 2 minute cooldown.", [9, 30, 51, 72] ], 

    [EMPAT, SUP, ASK, HEA, SFR, "Benevolence", "This Empathic mutation restores (30/39/53/68/82/97/112/126/141) health to yourself or (60/78/107/136/165/195/224/253/282) to another target. Costs (22/26/34/41/49/56/64/71/79) gamma and has a 6 second cooldown.", [45, 63, 81, 99, 117, 135, 153, 171, 189] ], 
    [EMPAT, SUP, ASK, CUR, SFR, "Preservation", "This Empathic mutation removes negative status effect counters from your target. Multiple applications may be needed for serious conditions. Costs (17/24/29/36/41/48/53/60) gamma and has a 2 second cooldown.", [54, 72, 90, 108, 126, 144, 162, 180] ], 
    [EMPAT, SUP, ASK, HEA, SFR, "Restoration", "This Empathic mutation restores (9/12/15/18/21/24/27) health per second to yourself or (19/25/31/37/42/48/54) to another target for five seconds. Costs (42/52/62/72/82/92/102) gamma and has a 2 second cooldown.", [75, 93, 111, 129, 147, 165, 183] ], 
    [EMPAT, SUP, ASK, RES, FRI, "Share Life", "This Empathic mutation restores (44/68/92/116/140/164/188/212/236) health to a dead target. Costs 60% of your own health and has a 1 minute cooldown.", [48, 66, 84, 102, 120, 138, 156, 174, 192] ], 

    [ENHAN, DEF, STA, BUF, SEL, "Ablate", "This Enhancement mutation increases your Primary, Secondary, and Tertiary armor values by (116/166/216/266/316/366/416), (163/233/303/373/443/513/583), and (223/333/433/533/633/733/833), but decreases your Power and Precision by (20/28/34/40/44/48/50). Only one stance may be used at a time.", [72, 90, 108, 126, 144, 162, 180] ], 
    [ENHAN, SUP, AUR, BUF, TEA, "Calibration", "This Enhancement mutation increases the Primary Armor of all teammates within 30 meters by (99/139/209/279/349/419/489/559/629). You may only run one aura ability at a time.", [48, 66, 84, 102, 120, 138, 156, 174, 192] ], 
    [ENHAN, SUP, AUR, BUF, TEA, "Resilience", "This Enhancement mutation increases your team's secondary and tertiary armor by (75/115/155/195/235/275/315/355) and (175/215/255/295/335/375/415/455). You may only use one aura ability at a time.", [60, 78, 96, 114, 132, 150, 168, 186] ], 

    [ILLUM, SUP, ASK, BUF, TEA, "Endless Reserves", "This Illumination mutation invigorates teammates within 30 meters of you, restoring (20/30/40/50/60/80/100/140) gamma and stamina. Costs (10/15/20/25/30/40/50/70) gamma and stamina, and has a 2 minute cooldown. Does not effect user.", [60, 78, 96, 114, 132, 150, 168, 186] ], 
    [ILLUM, SUP, AUR, BUF, TEA, "Meditation", "This Illumination mutation increases your team's Stamina and Gamma Regeneration by (3/5/7/9/11/13/15/17/19), and increases damage dealt by mutations by (5/5/15/10/10/10/15/15/15)%. You may only run one aura ability at a time.", [48, 66, 84, 102, 121, 138, 156, 174, 192] ], 
    [ILLUM, SUP, AUR, BUF, TEA, "Enlighten", "This Illumination mutation increases your team's Stamina and Gamma by (15/20/25/30/35/40/45/50). You may only use one aura ability at a time.", [54, 72, 90, 108, 126, 144, 162, 180] ], 

    [NA_MA, SUP, AIM, HEA, FRI, "Filtration", "This Nano-Manipulation mutation removes negative status effect counters and heals your target for (82/112/141/170/200/229/258/288) health each time you successfully hit. Costs (19/26/34/41/49/56/64/71) gamma and has a 5 second cooldown.", [57, 75, 93, 111, 129, 147, 165, 183] ], 
    [NA_MA, SUP, ASK, RES, TCO, "Reconstruction", "This Nano-Manipulation mutation revives all dead teammates in a cone shaped area in front of you, restoring (33/51/69/87/105/123/141/159/177) health. Costs (20/27/35/42/50/57/65/72/80) gamma and has a 10 minute cooldown.", [48, 66, 84, 102, 120, 138, 156, 174, 192] ], 
    [NA_MA, SUP, ASK, BUF, TEA, "Revitalize", "This Nano-Manipulation mutation increases the health regeneration of all teammates within 30 meters by (8/12/16/20/24/28/32) for 30 seconds. Costs (30/37/45/52/60/67/75) gamma and has a 45 second cooldown.", [72, 90, 108, 126, 144, 162, 180] ], 
    [NA_MA, SUP, ASK, HEA, TEA, "Vital Osmosis", "This Nano-Manipulation mutation heals all teammates within 30 meters of you, restoring (30/50/75/100/125/150/200/250/275) health. Costs (30/40/50/60/70/80/90/100/110) gamma and has a 1 minute cooldown.", [45, 63, 81, 99, 117, 135, 153, 171, 189] ], 

    [PA_TR, OFF, ASK, DEB, ENE, "Thwarted Intention", "This Patho-Transmission mutation reduces healing done to the target by (10/15/20/25/30/35/40/50)% for 8 seconds. Cost (30/45/60/75/90/105/120/135) gamma and has a 1 minute cooldown. Resist- Mind.", [60, 78, 96, 114, 132, 150, 168, 186] ], 
    [PA_TR, OFF, ASK, DEB, ENA, "Sapping Sickness", "This Patho-Transmission mutation reduces the speed of everyone close to your target by (12/15/18/21/24/27/30)% for 10 seconds. Costs (33/44/55/66/77/88/99) gamma and has a 2 minute cooldown. Resist- Reflex.", [72, 90, 108, 126, 144, 162, 180] ], 
    [PA_TR, OFF, ASK, DEB, ENE, "Wracking Pains", "This Patho-Transmission mutation reduces your target's regeneration rates by (9/12/15/18/21/24/27/30/33) for 20 seconds. Costs (22/27/35/42/50/57/65/72/80) gamma and has a 1 minute cooldown. Resist- Mind.", [48, 66, 84, 102, 120, 138, 156, 174, 192] ], 

    [PRIMA, OFF, ASK, BUF, SEL, "Beast Might", "This Primal mutation adds (30/35/40/45/50/55/60)% physical damage to your next attack within the next 6 seconds. Costs (50/62/75/87/100/112/125) health and has a 15 second cooldown.", [72, 90, 108, 126, 144, 162, 180] ], 
    [PRIMA, OFF, TOG, BUF, SEL, "Primal Vigor", "This Primal mutation increases your maximum health by (65/85/105/120/145/165/185/205/225). This ability reserves 50% of your gamma and lasts until toggled off.", [48, 66, 84, 102, 120, 138, 156, 174, 192] ], 
    [PRIMA, OFF, ASK, BDB, SEL, "Rampage", "This Primal mutation increases your power and precision by (40/52/64/76/88/100/112/124) and your armor by (166/266/366/466/566/666/766/866) for 15 seconds, but decreases them by the same amount afterwards for 15 seconds. This ability has a 1 minute cooldown.", [60, 78, 96, 114, 132, 150, 168, 186] ], 

    [SONIC, OFF, ASK, DEB, ENE, "Catastrophic Dissonance", "This Sonic Influence mutation slows your target by (16/18/20/22/24/26/28/34)% for 10 seconds. Costs (43/53/63/73/83/93/103/113) gamma and has a 60 second cooldown. Resist- Mind.", [60, 78, 96, 114, 132, 150, 168, 174] ], 
    [SONIC, OFF, AIM, DOT, ECO, "Rending Vibration", "This Sonic Influence mutation does (8/12/16/20/24/28/32) damage per second for 15 seconds to all targets in a cone shaped area in front of you. Costs (36/46/56/66/77/87/96) gamma and has a 45 second cooldown. Resist- Mind.", [72, 90, 108, 126, 144, 162, 180] ], 
    [SONIC, OFF, ASK, DDA, ENE, "Sonic Lance", "This Sonic Influence mutation does (32/47/63/78/94/109/124/140/156) sonic damage to your target and reduces their melee and range defence by (10/15/20/25/30/35/40/45/60) for 10 seconds. Costs 106 gamma and has a 20 second cooldown. Resist- Reflex.", [48, 66, 84, 102, 120, 138, 156, 174, 192] ], 

    [SUPPR, OFF, ASK, DEB, ENE, "Denial", "This Suppression mutation reduces your target's gamma and stamina by (30/40/50/60/70/80/100/120/150). Costs (15/20/25/30/35/40/50/60/70) stamina and (15/20/25/30/35/40/50/60/70) gamma, and has a 1 minute cooldown. Resist- Mind.", [48, 66, 84, 102, 120, 138, 156, 174, 192] ], 
    [SUPPR, SUP, ASK, BDB, ENE, "Sap Stamina", "This Suppression mutation reduces your targets Stamina by (60/74/94/104/120/134/150) and increases your teammates stamina by (74/37/47/52/60/67/75). Costs (25/45/65/85/105/125/150) gamma and has a 1 minute cooldown. Resist- Reflex.", [72, 90, 108, 126, 144, 162, 180] ], 
    [SUPPR, SUP, ASK, BDB, ENE, "Siphon Energy", "This Suppression mutation reduces your target's gamma by (50/64/80/94/110/124/140/154) and increases your teammates' gamma by (12/32/40/47/55/62/70/77). Costs (50/64/80/94/110/124/140/154) gamma and has a 1 minute cooldown. Resist- Reflex.", [60, 78, 96, 114, 132, 150, 168, 186] ], 

    [TELEK, OFF, ASK, DOT, ENE, "Always Armed", "This Telekinesis mutation does (6/9/12/15/18/21/24/27/36) damage per second to your target for 5 seconds. Costs (10/15/20/25/30/35/40/45/50) gamma and has a 5 second cooldown. Resist- Body.", [48, 66, 84, 102, 120, 138, 156, 174, 192] ], 
    [TELEK, OFF, ASK, DEB, ENE, "Bend Metal", "This Telekinesis mutation reduces target armor by (164/340/515/696/883/1076/1300) for 10 seconds. Costs (30/37/45/52/60/67/75) gamma and has a 1 minute cooldown. Resist- Reflex.", [72, 90, 108, 126, 144, 162, 180] ], 
    [TELEK, OFF, ASK, DDA, ENE, "Propel", "This Telekinesis mutation does (64/87/110/133/156/179/202/225) crushing damage to your target. Costs (20/30/40/50/60/70/80/90) gamma and has a 20 second cooldown. Resist- Reflex.", [60, 78, 96, 114, 132, 150, 168, 186] ], 

    [TH_CO, OFF, ASK, DDA, ENE, "Cold Snap", "This Thermal Control mutation does (12/14/20/25/31/36/42/47/53) cold damage to your target. Costs (12/16/20/25/29/34/38/43/47) gamma and has a 2 second cooldown. Resist- Mind.", [45, 63, 81, 99, 117, 135, 153, 171, 189] ], 
    [TH_CO, OFF, ASK, DOT, ENE, "Hypothermia", "This Thermal Control mutation does (4/6/8/10/12/14/16/18/20) damage per second to your target for 15 seconds. Costs (20/27/35/42/50/57/65/72/80) gamma and has a 5 second cooldown. Resist- Mind.", [48, 66, 84, 102, 120, 138, 156, 174, 192] ], 
    [TH_CO, OFF, ASK, DDA, ENE, "Molotov Cocktail", "This Thermal Control mutation does (70/90/111/131/151/172/192) damage to your target. Costs (48/60/72/84/96/108/120) gamma and has a 20 second cooldown. Resist- Reflex.", [72, 90, 108, 126, 144, 162, 180] ], 
    [TH_CO, OFF, ASK, DOT, ENE, "Napalm", "This Thermal Control mutation does (9/13/17/20/24/28/32/35) damage per second to your target for 5 seconds. Costs (28/36/45/54/63/71/80/89) gamma and has a 15 second cooldown. Resist- Body.", [57, 75, 93, 111, 129, 147, 165, 183] ]
];
