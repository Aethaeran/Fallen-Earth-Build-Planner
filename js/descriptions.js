




/*
     FILE ARCHIVED ON 8:38:11 Mar 22, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 0:36:57 Aug 2, 2016.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
//-----------------------------------------------------------------------------   
function showdescription(i)
{
  display_character();
  
  if (i < CHARI)
  {
    return;
  }

  if (i <= WILLP)
  {
    display_attribute(i);
    last_attribute_clicked = i;
    saveStatsToCookie();
    return;
  }
  if (i <= CRAFT)
  {
    display_skill(i);
    last_skill_clicked = i;
    saveStatsToCookie();
    return;
  }
  if (i <= TH_CO)
  {
    display_mutation(i);
    last_mutation_clicked = i;
    saveStatsToCookie();
    return;
  }
}
//-----------------------------------------------------------------------------
function display_character()
{
  max_weight = (st_stats[STREN] * 0.5) + 40; // Max weight = 40 base + strength / 2			
  health = st_stats[LEVEL] * 3;
  stamina = 0;
  gamma = 0;
  var balance = ap_avail - ap_spent;
  var i;
  var pan = document.getElementById("panel_characterdescription");
  var txt = wrap_text("Total AP Available ", "sm");
  txt += wrap_text(ap_avail, "lg");
  txt += wrap_text(". You've allocated ", "sm");
  txt += wrap_text(ap_spent, "lg");
  txt += wrap_text(" so far, leaving ", "sm");
  
  if (balance < 0)
  {
    txt += wrap_text('<span style="color: #FF0000; text-shadow: #800000 1px 1px 1px;">' + (ap_avail - ap_spent) + " AP</span>", "lg");
  }
  else
  {
    txt += wrap_text('<span style="color: #00FF00; text-shadow: #008000 1px 1px 1px;">' + (ap_avail - ap_spent) + " AP</span>", "lg");
  }

  txt += wrap_text(" left to spend.", "sm");
  txt += '<div class="hr-div"></div>';
  
  for (i = 0; i < 8; i++)
  {
    switch (attribute_details[i][0])
    {
      case GAMMA:
        gamma += attribute_details[i][1] * st_stats[i + 2];
        break;
      case STAMI:
        stamina += attribute_details[i][1] * st_stats[i + 2];
        break;
      case HEALT:
        health += attribute_details[i][1] * st_stats[i + 2];
        break;
      default:
        break;
    } // switch
  } // for i
  
  txt += wrap_text("Health: ", "sm");
  txt += wrap_text(health, "lg");
  txt += wrap_text("  Stamina: ", "sm");
  txt += wrap_text(stamina, "lg");
  txt += wrap_text("  Gamma: ", "sm");
  txt += wrap_text(gamma, "lg");
  txt += wrap_text("  Max Weight: ", "sm");
  txt += wrap_text(max_weight, "lg");
  
  pan.innerHTML = txt;
}
//-----------------------------------------------------------------------------   
function wrap_text(txt, cla)
{
  return '<span class="' + cla + '">' + txt + '</span>';
}
//-----------------------------------------------------------------------------   
function wrap_details(pre, txt, val)
{
  return pre + ' <span class="details">' + txt + '</span> (' + val + ')';
}
//-----------------------------------------------------------------------------   
function wrap_skill(pre, txt, val)
{
  return pre + ' <span class="skills">' + txt + '</span> (' + val + ')';
}
//-----------------------------------------------------------------------------   
function wrap_mutation(pre, txt, val)
{
  return pre + ' <span class="mutations">' + txt + '</span> (' + val + ')';
}
//-----------------------------------------------------------------------------   
function display_attribute(index)
{
  var pan = document.getElementById("panel_attributedescription");
  var head = document.getElementById("header_attributedescription");
  var attribute = index - 2;
  var i;
  var title = "Attribute Description: " + attribute_details[attribute][2];
  var txt = '<div class="hr-div"></div><span class="detailsheader">Base Effects: </span>';
  
  switch (attribute_details[attribute][0])
  {
    case GAMMA:
      txt += wrap_details("", "Gamma Levels", attribute_details[attribute][1] + " Gamma for each point of " + attribute_details[attribute][2]);
      break;
    case STAMI:
      txt += wrap_details("", "Stamina Levels", attribute_details[attribute][1] + " Stamina for each point of " + attribute_details[attribute][2]);
      break;
    case HEALT:
      txt += wrap_details("", "Health Levels", attribute_details[attribute][1] + " Health for each point of " + attribute_details[attribute][2]);
      break;
    default:
      txt += "None";
      break;
  } // switch

  if (attribute == (STREN - 2))
  {
    txt += wrap_details("", "Max Weight", ".5 lbs for each point of Strength");
  } // else no extra details
  
  txt += '<br /><span class="detailsheader">Skills Affected: </span>';
  for (i = 0; i < COUNT_SKILLS; i++)
  {
    if (skill_details[i][0] == (attribute + 2))  
    {
      txt += wrap_skill("", skill_details[i][4], skill_details[i][1] + "%");
    }
    if (skill_details[i][2] == (attribute + 2))  
    {
      txt += wrap_skill("", skill_details[i][4], skill_details[i][3] + "%");
    }
  } // for i

  txt += '<br /><span class="detailsheader">Mutations Affected: </span>';
  for (i = 0; i < COUNT_MUTATIONS; i++)
  {
    if ((i == 0) && (attribute == 7)) // Willpower & Alpha Mutation
    {
      txt = txt + ' <span class="skills">Alpha</span> (100%)';
    }
    else
    {
      if (mutation_details[i][0] == (attribute + 2))  
      {
        txt += wrap_skill("", mutation_details[i][4], mutation_details[i][1] + "%");
      }
      if (mutation_details[i][2] == (attribute + 2))  
      {
        txt += wrap_skill("", mutation_details[i][4], mutation_details[i][3] + "%");
      }
    }
  } // for i  

  head.innerHTML = title;
  pan.innerHTML = txt;
}
//-----------------------------------------------------------------------------   
function display_skill(index)
{
  var pan = document.getElementById("panel_skilldescription");
  var head = document.getElementById("header_skilldescription");
  var txt = "", desc = "";
  var skill = index - 10;
  var i;
  var title = "Skill Description: " + skill_details[skill][4];
  
  for (i = 0; i < COUNT_ATTRIBUBTES; i++)
  {
    if (skill_details[skill][0] == (i + 2))
    {
      desc += wrap_skill("", attribute_details[i][2], skill_details[skill][1] + "%");
    }
    if (skill_details[skill][2] == (i + 2))
    {
      desc += wrap_skill("", attribute_details[i][2], skill_details[skill][3] + "%");
    }
  } // for i

  for (i = 0; i < COUNT_ABILITIES; i++)
  {
    if (ability_details[i][0] == index) // found a matching ability to this mutation
    {
      var rank_array = ability_details[i].slice(7); 
      txt += display_ability(ability_details[i][5], // Ability Name
                             cat_types[ability_details[i][1]] + " " + // Category
                                 slot_types[ability_details[i][2]] + " " + // Slot
                                 type_types[ability_details[i][3]] + " " + // Type
                                 target_types[ability_details[i][4]] + ": " + // Target
                             ability_details[i][6], // Effects
                             st_stats[index], // Base Attribute
                             rank_array // Rank Array
                             );
    } // else no match
  } // for i  
  if (index == CRAFT) // Crafting
  {
    txt += '<span style="font-size: 12px;">';
    txt += "Crafting skills are not raised with AP, and do not grant any extra skills/abilities.<br />";
    txt += "Instead, crafting skills are raised by actually cratfing items.<br />";
    txt += "Crafting items will also yield XP if they are not coloured 'grey'. ie Low level compared to your crafting skill.<br />";
    txt += "Each crafting skill needs to be levelled independantly of the others<br />";
    txt += '<br /><a href="javascript:open_sub_window(\'craftingbox\')">Crafting/Tradeskills Guide</a>';
    txt += '</span>';
  }
  
  head.innerHTML = title;
  pan.innerHTML = '<span style="font-size: 14px">Base Attributes: ' + desc + "</span>" + '<div class="hr-div"></div>' + txt;
}
//-----------------------------------------------------------------------------   
function display_ability(name, description, cur_pts, ranks)
{
  ranks = ranks + ""; // ensure string
  var rank_array = ranks.split(',');
  var i;
  var cur_rank = 0;
  var total_ranks = rank_array.length;
  var txt;
  
  for (i = 0; i < total_ranks; i++)
  {
    if (cur_pts >= rank_array[i])
    {
      cur_rank = i + 1;  
    }
  } // for i
  
  if (cur_rank == 0)
  {
    txt = '<span class="abilitynamenot">' + name + ' ' + cur_rank + ' </span><span class="abilitydesc">' + description + '</span><br />';
  }
  else
  {
    txt = '<span class="abilitynamegot">' + name + ' ' + cur_rank + ' </span><span class="abilitydesc">' + description + '</span><br />';
  }
  
  for (i = 0; i < total_ranks; i++)
  {
    if (cur_pts >= rank_array[i])
    {
      txt = txt + '<span class="abilityrankgot">&nbsp;&nbsp;&nbsp;&nbsp;' + rank_array[i] + '</span>';
    }
    else
    {
      txt = txt + '<span class="abilityranknot">&nbsp;&nbsp;&nbsp;&nbsp;' + rank_array[i] + '</span>';
    }
  } // for i
  
  return txt + '<br />';
}
//-----------------------------------------------------------------------------
function display_mutation(index)
{
  var pan = document.getElementById("panel_mutationdescription");
  var head = document.getElementById("header_mutationdescription");
  var txt = "", desc = "";
  var i;
  var mutation = index - 24;
  var title = "Mutation Description: " + mutation_details[mutation][4];
   
  for (i = 0; i < COUNT_ATTRIBUBTES; i++)
  {
    if (mutation_details[mutation][0] == (i + 2))
    {
      desc += wrap_skill("", attribute_details[i][2], mutation_details[mutation][1] + "%");
    }
    if (mutation_details[mutation][2] == (i + 2))
    {
      desc += wrap_skill("", attribute_details[i][2], mutation_details[mutation][3] + "%");
    }
  } // for i
  if (mutation == 0) // Alpha
  {
    desc = "100% Willpower - Automatically Maxed for No AP";
  }
  
  for (i = 0; i < COUNT_ABILITIES; i++)
  {
    if (ability_details[i][0] == index) // found a matching ability to this mutation
    {
      var rank_array = ability_details[i].slice(7); 
      txt += display_ability(ability_details[i][5], // Ability Name
                             cat_types[ability_details[i][1]] + " " + // Category
                                 slot_types[ability_details[i][2]] + " " + // Slot
                                 type_types[ability_details[i][3]] + " " + // Type
                                 target_types[ability_details[i][4]] + ": " + // Target
                             ability_details[i][6], // Effects
                             st_stats[index], // Base Attribute
                             rank_array // Rank Array
                             );
    } // else no match
  } // for i  
  
  head.innerHTML = title;
  pan.innerHTML = '<span style="font-size: 14px">Base Attributes: ' + desc + "</span>" + '<div class="hr-div"></div>' + txt;
}
//-----------------------------------------------------------------------------   
