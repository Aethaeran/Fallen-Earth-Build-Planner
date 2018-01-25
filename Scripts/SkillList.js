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

var MAX_LEVEL = 55;
var NONE = -1, 	UNKNOWN = -2;
var LEVEL = 0, 	BONUSAP = 1;
var GAMMA = 0, 	STAMI = 1, 	HEALT = 2, 	WEIGH = 3;
var CHARI = 2, 	COORD = 3, 	DEXTE = 4, 	ENDUR = 5, 	INTEL = 6, 	PERCE = 7, 	STREN = 8, 	WILLP = 9;
var AR_US = 10, DI_TR = 11, DODGE = 12, ES_AR = 13, FI_AI = 14, GR_TA = 15, HE_WE = 16, MELEE = 17, PISTO = 18, POWER = 19, PRECI = 20, RIFLE = 21, SOCIA = 22, CRAFT = 23;
var ALPHA = 24, EMPAT = 25, ENHAN = 26, ILLUM = 27, NA_MA = 28, PA_TR = 29, PRIMA = 30, SONIC = 31, SUPPR = 32, TELEK = 33, TH_CO = 34;

var COUNT_ATTRIBUBTES = 8;   
var attribute_details = [
    [GAMMA, 2, 'Charisma'], 
    [STAMI, 2, 'Coordination'], 
    [STAMI, 3, 'Dexterity'], 
    [HEALT, 4, 'Endurance'], 
    [GAMMA, 3, 'Intelligence'], 
    [NONE,  0, 'Perception'], 
    [HEALT, 3, 'Strength'],
    [NONE,  0, 'Willpower']
];

var COUNT_SKILLS = 14;   
var skill_details = [
    [ENDUR, 75, COORD, 25, "Armor Use"], 
    [DEXTE, 50, PERCE, 50, "Dirty Tricks"], 
    [COORD, 50, PERCE, 50, "Dodge"], 
    [DEXTE, 50, COORD, 50, "Escape Artist"], 
    [INTEL, 75, PERCE, 25, "First Aid"], 
    [INTEL, 75, COORD, 25, "Group Tactics"], 
    [STREN, 50, PERCE, 50, "Heavy Weapons"], 
    [STREN, 50, COORD, 50, "Melee"], 
    [DEXTE, 50, PERCE, 50, "Pistol"], 
    [STREN, 50, WILLP, 50, "Power"], 
    [DEXTE, 50, INTEL, 50, "Precision"], 
    [DEXTE, 50, PERCE, 50, "Rifle"], 
    [CHARI, 75, PERCE, 25, "Social"], 
    [INTEL, 75, PERCE, 25, "Tradeskills"]
];

var COUNT_MUTATIONS = 11;
var mutation_details = [
    [WILLP, 50, WILLP, 50, "Alpha Mutations"],
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

var cat_types = [ "", "", "" ];
var DEF = 0, OFF = 1, SUP = 2;

var slot_types = [ "", " ", " ", "", "", "" ];
var AUR = 0, ASK = 1, PAT = 2, STA = 3, TOG = 4, AIM = 5;

var type_types = [ "", "", "", "", "", "", "", "", "" ];
var BUF = 0, CUR = 1, DEB = 2, DDA = 3, DOT = 4, HEA = 5, RES = 6, BDB = 7, DDO = 8;

var target_types = [ "", "", "", "", "", "", "", "", "", "" ];
var AOE = 0, ENE = 1, FRI = 2, SEL = 3, TEA = 4, WEA = 5, SFR = 6, ENA = 7, ECO = 8, TCO = 9;

var COUNT_ABILITIES = 69;
var ability_details = [
    [AR_US, DEF, STA, BDB, SEL, "Dreadnaught", "", 				[54, 69, 84, 99, 114, 129, 144, 159, 174, 189] ], 
    [AR_US, DEF, STA, BDB, SEL, "Soak Elements", "", 			[75, 90, 105, 120, 135, 150, 165, 180, 195] ], 

    [DI_TR, OFF, PAT, DDO, WEA, "Dirty Steel", "", 				[33, 63, 93, 123, 153, 183] ], 
    [DI_TR, OFF, PAT, DEB, WEA, "Kneecap", "", 					[45, 75, 105, 135, 165, 195] ], 
    [DI_TR, OFF, PAT, DEB, WEA, "Sabotage", "", 				[70, 90, 130, 160, 190] ], 

    [DODGE, DEF, STA, BDB, SEL, "Duck and Weave", "", 			[57, 87, 117, 147, 177] ], 

    [ES_AR, DEF, STA, BDB, SEL, "Dash", "", 					[57, 132] ], 
    [ES_AR, DEF, ASK, BUF, SEL, "Lucky Break", "", 				[69, 99, 129, 159, 189] ], 
    [ES_AR, DEF, ASK, BUF, SEL, "Misdirection", "", 			[81, 111, 141, 171] ], 
    [ES_AR, DEF, ASK, CUR, SEL, "Shake It Off", "", 			[30, 60, 90, 120, 150, 180] ], 

    [FI_AI, SUP, ASK, CUR, SFR, "Renew", "", 					[84, 114, 144, 174] ], 
    [FI_AI, SUP, ASK, RES, FRI, "Resuscitation", "", 			[39, 99, 159] ], 
    [FI_AI, SUP, ASK, HEA, SFR, "Stanch Wound", "", 			[1, 36, 66, 96, 126, 156, 186] ], 
    [FI_AI, SUP, ASK, CUR, SFR, "Suck It Up", "", 				[12, 42, 72, 102, 132, 162, 192] ], 

    [GR_TA, SUP, AUR, BUF, TEA, "Combat Endurance", "", 		[42, 72, 102, 132, 162, 192] ], 
    [GR_TA, SUP, AUR, BUF, TEA, "Give 'Em Hell", "", 			[60, 90, 120, 150, 180] ], 
    [GR_TA, SUP, AUR, BDB, TEA, "Offensive Coordination", "", 	[30, 60, 90, 120, 150, 180] ], 
    [GR_TA, OFF, ASK, DEB, ENE, "Overwhelm", "", 				[69, 99, 129, 159, 189] ], 

    [HE_WE, OFF, ASK, DEB, ENA, "Caltrops", "", 				[195] ], 
    [HE_WE, OFF, ASK, DEB, ENA, "Soften'Em Up", "", 			[150, 180] ], 

    [MELEE, OFF, ASK, BUF, SEL, "Charge", "", 					[60, 90, 120, 150, 180] ], 
    [MELEE, OFF, ASK, BDB, ENE, "Provoke", "", 					[45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195] ], 

    [PISTO, OFF, STA, BDB, SEL, "Concentration", "", 			[60, 105, 150, 195] ], 
    [PISTO, OFF, PAT, DOT, WEA, "Incendiary Strike", "", 		[60, 90, 120, 150, 180] ], 

    [POWER, OFF, STA, BUF, SEL, "Attack Posture", "", 			[63, 93, 123, 153, 183] ], 
    [POWER, OFF, PAT, DEB, WEA, "Dent Armor", "", 				[51, 81, 111, 141, 171] ], 

    [PRECI, OFF, ASK, BUF, SEL, "Perfect Timing", "", 			[63, 93, 123, 153, 183] ], 
    [PRECI, OFF, PAT, DDA, WEA, "Precise Hit", "", 				[51, 81, 111, 141, 171] ], 

    [RIFLE, OFF, PAT, DEB, WEA, "Agonizing Wound", "", 			[54, 84, 114, 144, 174] ], 
    [RIFLE, OFF, PAT, DDA, WEA, "Bull's Eye", "", 				[60, 90, 120, 150, 180] ], 

    [SOCIA, DEF, ASK, BDB, SEL, "Diplomatic Immunity", "", 		[60, 90, 120, 150, 180] ], 
    [SOCIA, DEF, STA, BUF, SEL, "Flag of Truce", "", 			[165] ], 
    [SOCIA, DEF, ASK, DEB, ENE, "Inconspicuous", "", 			[45, 75, 105, 135, 165, 195] ], 

	// Mutations -------------------------------------------------------------------------------------------------------------
	
    [ALPHA, OFF, TOG, BUF, SEL, "Bolster", "", 					[9, 30, 51, 72] ], 
    [ALPHA, OFF, PAT, DEB, WEA, "Disrupt", "", 					[9, 30, 51, 72] ], 
    [ALPHA, DEF, TOG, BUF, SEL, "Gird", "", 					[9, 30, 51, 72] ], 
    [ALPHA, DEF, ASK, HEA, SEL, "Patch", "", 					[9, 30, 51, 72] ], 

    [EMPAT, SUP, ASK, HEA, SFR, "Benevolence", "", 				[45, 63, 81, 99, 117, 135, 153, 171, 189] ], 
    [EMPAT, SUP, ASK, CUR, SFR, "Preservation", "", 			[54, 72, 90, 108, 126, 144, 162, 180] ], 
    [EMPAT, SUP, ASK, HEA, SFR, "Restoration", "", 				[75, 93, 111, 129, 147, 165, 183] ], 
    [EMPAT, SUP, ASK, RES, FRI, "Share Life", "", 				[48, 66, 84, 102, 120, 138, 156, 174, 192] ], 

    [ENHAN, DEF, STA, BUF, SEL, "Ablate", "", 					[72, 90, 108, 126, 144, 162, 180] ], 
    [ENHAN, SUP, AUR, BUF, TEA, "Calibration", "", 				[48, 66, 84, 102, 120, 138, 156, 174, 192] ], 
    [ENHAN, SUP, AUR, BUF, TEA, "Resilience", "", 				[60, 78, 96, 114, 132, 150, 168, 186] ], 

    [ILLUM, OFF, TOG, BDB, SEL, "Endless Reserves", "", 		[60, 78, 96, 114, 132, 150, 168, 186] ], 
    [ILLUM, SUP, AUR, BUF, TEA, "Meditation", "", 				[51, 69, 87, 105, 123, 141, 159, 177, 195] ], 

    [NA_MA, SUP, AIM, HEA, FRI, "Filtration", "", 				[57, 75, 93, 111, 129, 147, 164, 183] ], 
    [NA_MA, SUP, ASK, RES, TCO, "Reconstruction", "", 			[48, 66, 84, 102, 120, 138, 156, 174, 192] ], 
    [NA_MA, SUP, ASK, BUF, TEA, "Revitalize", "", 				[72, 90, 108, 126, 144, 162, 180] ], 
    [NA_MA, SUP, ASK, HEA, TCO, "Vital Osmosis", "", 			[45, 63, 81, 99, 117, 135, 153, 171, 189] ], 

    [PA_TR, OFF, ASK, DEB, ENA, "Debilitating Weakness", "", 	[60, 78, 96, 114, 132, 150, 168, 186] ], 
    [PA_TR, OFF, ASK, DEB, ENA, "Sapping Sickness", "", 		[72, 90, 108, 126, 144, 162, 180] ], 
    [PA_TR, OFF, ASK, DEB, ENE, "Wracking Pains", "", 			[48, 66, 84, 102, 120, 138, 156, 174, 192] ], 

    [PRIMA, OFF, PAT, DDA, WEA, "Beast Might", "", 				[72, 90, 108, 126, 144, 162, 180] ], 
    [PRIMA, OFF, TOG, BUF, SEL, "Primal Vigor", "", 			[48, 66, 84, 102, 120, 138, 156, 174, 192] ], 
    [PRIMA, OFF, ASK, BDB, SEL, "Rampage", "", 					[60, 78, 96, 114, 132, 150, 168, 186] ], 

    [SONIC, OFF, ASK, DDA, AOE, "Catastrophic Dissonance", "", 	[60, 78, 96, 114, 132, 150, 168, 174] ], 
    [SONIC, OFF, AIM, DOT, ECO, "Rending Vibration", "", 		[72, 90, 108, 126, 144, 162, 180] ], 
    [SONIC, OFF, AIM, DDA, ENE, "Sonic Lance", "", 				[48, 66, 84, 102, 120, 138, 156, 174, 192] ], 

    [SUPPR, OFF, ASK, DEB, ENE, "Denial", "", 					[48, 66, 84, 102, 120, 138, 156, 174, 192] ], 
    [SUPPR, SUP, ASK, BDB, ENE, "Sap Stamina", "", 				[72, 90, 108, 126, 144, 162, 180] ], 
    [SUPPR, SUP, ASK, BDB, ENE, "Siphon Energy", "", 			[60, 78, 96, 114, 132, 150, 168, 186] ], 

    [TELEK, OFF, AIM, DDA, ENE, "Always Armed", "", 			[48, 66, 84, 102, 120, 138, 156, 174, 192] ], 
    [TELEK, OFF, ASK, DEB, ENE, "Bend Metal", "", 				[72, 90, 108, 126, 144, 162, 180] ], 
    [TELEK, OFF, AIM, DDA, ENE, "Propel", "", 					[60, 78, 96, 114, 132, 150, 168, 186] ], 

    [TH_CO, OFF, ASK, DDA, ENE, "Cold Snap", "", 				[45, 63, 81, 99, 117, 135, 153, 171, 189] ], 
    [TH_CO, OFF, ASK, DOT, ENE, "Hypothermia", "", 				[48, 66, 84, 102, 120, 138, 156, 174, 192] ], 
    [TH_CO, OFF, ASK, DDA, ENE, "Molotov Cocktail", "", 		[72, 90, 108, 126, 144, 162, 180] ], 
    [TH_CO, OFF, ASK, DOT, ENE, "Napalm", "", 					[57, 75, 93, 111, 129, 147, 165, 183] ]
]; 
