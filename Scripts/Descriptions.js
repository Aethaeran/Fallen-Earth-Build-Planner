function showdescription(i) {
	display_character();
	
	if (i < CHARI) return;

	if (i <= WILLP) {
		display_attribute(i);
		last_attribute_clicked = i;
		saveStatsToCookie();
		return;
	}

	if (i <= CRAFT) {
		display_skill(i);
		last_skill_clicked = i;
		saveStatsToCookie();
		return;
	}

	if (i <= TH_CO) {
		display_mutation(i);
		last_mutation_clicked = i;
		saveStatsToCookie();
		return;
	}
}

function getUrlParameter(name) {
    var searchString = location.search.substring(1).split('&');
 
    for (var i = 0; i < searchString.length; i++) {
        var parameter = searchString[i].split('=');
        if(name == parameter[0])    return parameter[1];
    }
    return false;
}

function addBookmark(title, url) {
	if (window.sidebar) {
		window.sidebar.addPanel(title, url,"");
    } 
	else if(document.all) {
		window.external.AddFavorite( url, title);
    }
	else if(window.opera && window.print){
        var elem = document.createElement('a');
        elem.setAttribute('href',url);
        elem.setAttribute('title',title);
        elem.setAttribute('rel','sidebar');
        elem.click();
	}
}
	
function display_character() {
	Gamma 	= 0;
	Stamina = 0;
	Health 	= st_stats[LEVEL] * 3;
	Weight 	= (st_stats[STREN] * 0.5) + 40;

	var Block 	= document.getElementById('Character');
	var Hash 	= window.location.href.split('#')[1];
	var Pseudo 	= getUrlParameter('toon');
	var Texte 	= '';
	
	if(!Pseudo) {Pseudo = 'Character Name';}
	else {Pseudo = Pseudo.replace("%20", " ");}
	
	Texte += '<form method=post action="Modules/Save.php"><table cellspacing="0" id="Pseudo"><tr><td colspan="2"><input type="text" name="Pseudo" style="position: relative; left:-7px;" value="'+ Pseudo +'"/></td></tr>';
	Texte += '<tr style="height: 1px;"></tr><tr>';
	
	Texte += '<td class="Button"><input type="Submit" value="Save" onclick="javascript:addBookmark(\''+ Pseudo +'\',\''+ document.URL +'\')"/><input type="hidden" name="Hash" value="'+ Hash +'"/></td>';
	Texte += '<td class="Button2"><input type="Button" value="Reset" onclick="self.location.href=\'http://aethaeran.github.io/Fallen-Earth-Build-Planner\'" /></td></tr></table></form>';
	
	Texte += '<table cellspacing="0" id="Stats"><tr><td class="Icon"><img src="Graphics/Icons/Total.png"/></td><td>Total</td>';		
	Texte += '<td class="DescV"><strong>'+ ap_avail +'</strong></td></tr>';
	
	Texte += '<tr><td class="Icon"><img src="Graphics/Icons/Spent.png"/></td><td>Spent</td>';		
	Texte += '<td class="DescV"><strong>'+ ap_spent +'</strong></td></tr>';
	
	Texte += '<tr><td class="Icon"><img src="Graphics/Icons/Available.png"/></td><td>Available</td>';
	Texte += '<td class="DescV"><strong>'+ (ap_avail - ap_spent) +'</strong></td></tr>';
	
	Texte+= '<tr style="height: 24px;"></tr>';
  
	for (i = 0; i < 8; i++) {
		switch (attribute_details[i][0]) {
			case GAMMA:
				Gamma += attribute_details[i][1] * st_stats[i + 2];
				break;
			case STAMI:
				Stamina += attribute_details[i][1] * st_stats[i + 2];
				break;
			case HEALT:
				Health += attribute_details[i][1] * st_stats[i + 2];
				break;
			default:
				break;
		}
	}
	
	Texte += '<tr><td class="Icon"><img src="Graphics/Icons/Health.png"/></td><td>Health</td>';
	Texte += '<td class="DescV"><strong>'+ Health +'</strong></td></tr>';
	
	Texte += '<tr><td class="Icon"><img src="Graphics/Icons/Stamina.png"/></td><td>Stamina</td>';
	Texte += '<td class="DescV"><strong>'+ Stamina +'</strong></td></tr>';
	
	Texte += '<tr><td class="Icon"><img src="Graphics/Icons/Gamma.png"/></td><td>Gamma</td>';
	Texte += '<td class="DescV"><strong>'+ Gamma +'</strong></td></tr>';
	
	Texte += '<tr><td class="Icon"><img src="Graphics/Icons/Weight.png"/></td><td>Weight</td>';
	Texte += '<td class="DescV"><strong>'+ Weight +'</strong></td></tr>';
	
	Block.innerHTML = Texte;
}

function wrap_details(pre, Texte, val) {
	return pre + ' <span class="details">' + Texte + '</span> (' + val + ')';
}

function wrap_skill(pre, Texte, val) {
	return '<img src="Graphics/Icons/' + Texte + '.png" />';
}

function wrap_mutation(pre, Texte, val) {
	return pre + ' <span class="mutations">' + Texte + '</span> (' + val + ')';
}

function display_attribute(index) {
	var Block = document.getElementById("panel_attributedescription");
	var head = document.getElementById("AttributesDesc");
	var attribute = index - 2;
	var title = '<span style="position:relative;top:7px;left: 10px;"><img src="Graphics/Icons/' + attribute_details[attribute][2] + '.png"/></span> &nbsp;&nbsp;&nbsp;' + attribute_details[attribute][2];
	var Texte = '<span style="position:relative;top:-10px;left:-20px;"><img src="Graphics/Separator.png"/></span>';
	
	Texte += '<table style="position:relative;top:-4px;left:-13px;"><tr><td class="Icon">';
	
	for (i = 0; i < COUNT_SKILLS; i++) {
		if (skill_details[i][0] == (attribute + 2))
			Texte += '<img src="Graphics/Icons/' + skill_details[i][4] + '.png" /> ';
		if (skill_details[i][2] == (attribute + 2))
			Texte += '<img src="Graphics/Icons/' + skill_details[i][4] + '.png" /> ';
	}
	
	for (i = 0; i < COUNT_MUTATIONS; i++) {
		if ((i == 0) && (attribute == 7)) // Willpower & Alpha Mutation
			Texte += '<img src="Graphics/Icons/Alpha Mutations.png" /> ';
		else {
			if (mutation_details[i][0] == (attribute + 2))  
				Texte += '<img src="Graphics/Icons/' + mutation_details[i][4] + '.png" /> ';
			if (mutation_details[i][2] == (attribute + 2))  
				Texte += '<img src="Graphics/Icons/' + mutation_details[i][4] + '.png" /> ';
		}
	}
	
	Texte += '</td></tr></table><table style="position:relative;left:-21px;top:22px;"><tr><td>Effects for 5 APs :</td></tr><tr style="height:8px;"></tr><tr><td>';
  
	switch (attribute_details[attribute][0]){
		case GAMMA:
			Texte += '- Gamma <strong>+ ' + attribute_details[attribute][1] + '</strong>';
			break;
		case STAMI:
			Texte += '- Stamina <strong>+ ' + attribute_details[attribute][1] + '</strong>';
			break;
		case HEALT:
			Texte += '- Health <strong>+ ' + attribute_details[attribute][1] + '</strong>';
			break;
		default:
			Texte += "";
			break;
	}

	if (attribute == (STREN - 2)) {
		Texte += ' <span style="position:relative;top:-1px;font-size:13px;">|</span> Health Regeneration <strong>+ 0.1</strong>';
		Texte += ' <br/><span style="position:relative;top:14px;">- Body Save <strong>+ 0.5</strong></span>';
		Texte += ' <br/><span style="position:relative;top:28px;">- Weight <strong>+ 0.5</strong></span>';
	}
	if (attribute == (CHARI - 2)) {
		Texte += ' <span style="position:relative;top:-1px;font-size:13px;">|</span> Gamma Regeneration <strong>+ 0.1</strong>';
	}
	if (attribute == (COORD - 2)) {
		Texte += ' <span style="position:relative;top:-1px;font-size:13px;">|</span> Stamina Regeneration <strong>+ 0.1</strong>';
	}
	if (attribute == (DEXTE - 2)) {
		Texte += ' <span style="position:relative;top:-1px;font-size:13px;">|</span> Stamina Regeneration <strong>+ 0.1</strong>';
		Texte += ' <br/><span style="position:relative;top:14px;">- Reflexes Save <strong>+ 0.75</strong></span>';
	}
	if (attribute == (ENDUR - 2)) {
		Texte += ' <span style="position:relative;top:-1px;font-size:13px;">|</span> Health Regeneration <strong>+ 0.1</strong>';
		Texte += ' <br/><span style="position:relative;top:14px;">- Body Save <strong>+ 0.5</strong></span>';
	}
	if (attribute == (INTEL - 2)) {
		Texte += ' <span style="position:relative;top:-1px;font-size:13px;">|</span> Gamma Regeneration <strong>+ 0.1</strong>';
		Texte += ' <br/><span style="position:relative;top:14px;">- Mind Save <strong>+ 0.25</strong></span>';
	}
	if (attribute == (PERCE - 2)) {
		Texte += '- Reflexes Save <strong>+ 0.25</strong>';
		Texte += ' <br/><span style="position:relative;top:14px;">- Players detection in PvP Zones <strong></strong></span>';
	}
	if (attribute == (WILLP - 2)) {
		Texte += '- Mind Save <strong>+ 0.75</strong>';
	}
	
	Texte += '</td></tr></table>';

	head.innerHTML = title;
	Block.innerHTML = Texte;
}
  
function display_skill(index) {
	var Block = document.getElementById("panel_skilldescription");
	var head = document.getElementById("SkillsDesc");
	var Texte = "", desc = "";
	var skill = index - 10;
	
	Texte += '<span style="position:relative;top:-34px;left:-20px;"><img src="Graphics/Separator.png"/></span>';
	Texte += '<span style="position:relative;top:-26px;left:-11px;"><img src="Graphics/Icons/' + skill_details[skill][4] + '.png"/>&nbsp;&nbsp;<span style="position:relative;top:-7px;">' + skill_details[skill][4] + '</span></span>'; 
	Texte += '<span style="position:relative;top:-29px;left:-20px;"><img src="Graphics/Separator.png"/></span>';
  
	for (i = 0; i < COUNT_ATTRIBUBTES; i++) {
		if (skill_details[skill][0] == (i + 2))
			desc += wrap_skill("", attribute_details[i][2], skill_details[skill][1] + "%");
		if (skill_details[skill][2] == (i + 2))
			desc += wrap_skill("", attribute_details[i][2], skill_details[skill][3] + "%");
	}
	
	Texte += '<table id="Abilities">';
	
	for (i = 0; i < COUNT_ABILITIES; i++) {
		if (ability_details[i][0] == index) // found a matching ability to this mutation
		{
			var rank_array = ability_details[i].slice(7); 
			Texte += display_ability('<tr><td class="Icon"><img src="Graphics/Abilities/' + ability_details[i][5] + '.png"/></td><td>' + ability_details[i][5],
				ability_details[i][6], 
				st_stats[index],
				rank_array);
		}
	} 
	
	Texte += '</td></tr></table>';
	
	if (index == CRAFT) Texte += '';
  
	Block.innerHTML = Texte;
}

function display_ability(name, description, cur_pts, ranks) {
	ranks = ranks + "";
	var rank_array = ranks.split(',');
	var cur_rank = 0;
	var i;
	var total_ranks = rank_array.length;
	var Texte;
  
	for (i = 0; i < total_ranks; i++) {
		if (cur_pts >= rank_array[i])
			cur_rank = i + 1;  
	}
  
	if (cur_rank == 0)
		Texte = '<span class="abilitynamenot">' + name + ' ' + cur_rank + ' </span><span class="abilitydesc">' + description + '</span><br />';
	else
		Texte = '<span class="abilitynamegot">' + name + ' ' + cur_rank + ' </span><span class="abilitydesc">' + description + '</span><br />';

	for (i = 0; i < total_ranks; i++) {
		if (cur_pts >= rank_array[i])
			Texte = Texte + '<span class="abilityrankgot">&nbsp;&nbsp;&nbsp;' + rank_array[i] + '</span>';
		else
			Texte = Texte + '<span class="abilityranknot">&nbsp;&nbsp;&nbsp;' + rank_array[i] + '</span>';
	}
  
	return Texte + '<br />';
}

function display_mutation(index) {
	var Block = document.getElementById("panel_mutationdescription");
	var head = document.getElementById("MutationsDesc");
	var Texte = "", desc = "";
	var mutation = index - 24;
	var i;
 
	Texte += '<span style="position:relative;top:-34px;left:-20px;"><img src="Graphics/Separator.png"/></span>';
	Texte += '<span style="position:relative;top:-26px;left:-11px;"><img src="Graphics/Icons/' + mutation_details[mutation][4] + '.png"/>&nbsp;&nbsp;<span style="position:relative;top:-7px;">' + mutation_details[mutation][4] + '</span></span>'; 
	Texte += '<span style="position:relative;top:-29px;left:-20px;"><img src="Graphics/Separator.png"/></span>';
	
	for (i = 0; i < COUNT_ATTRIBUBTES; i++) {
		if (mutation_details[mutation][0] == (i + 2))
			desc += wrap_skill("", attribute_details[i][2], mutation_details[mutation][1] + "%");
		if (mutation_details[mutation][2] == (i + 2))
			desc += wrap_skill("", attribute_details[i][2], mutation_details[mutation][3] + "%");
	}
  

  
	Texte += '<table id="Mutations">';
	
	for (i = 0; i < COUNT_ABILITIES; i++) {
		if (ability_details[i][0] == index) // found a matching ability to this mutation
		{
			var rank_array = ability_details[i].slice(7); 
			Texte += display_ability('<tr><td class="Icon"><img src="Graphics/Abilities/' + ability_details[i][5] + '.png"/></td><td>' + ability_details[i][5],
				ability_details[i][6], 
				st_stats[index],
				rank_array);
		}
	} 
	
	Texte += '</td></tr></table>';  
  
	Block.innerHTML = Texte;
}  
