//-----------------------------------------------------------------------------    
function loadStatsFromCookie( ) 
{
  var i;
  
  st_stats[LEVEL]   = parseInt(cookiejar.fetch("stat0",  1), 10);
  st_stats[BONUSAP] = parseInt(cookiejar.fetch("stat1", 0), 10);

  for (i = CHARI; i <= WILLP; i++)
  {
    st_stats[i] = parseInt(cookiejar.fetch("stat" + i, 11), 10);
  } // for i

  for (i = AR_US; i <= CRAFT; i++)
  {
    st_stats[i] = parseInt(cookiejar.fetch("stat" + i, 1), 10);
  } // for i

  for (i = ALPHA; i <= TH_CO; i++)
  {
    st_stats[i] = parseInt(cookiejar.fetch("stat" + i, 1), 10);
  } // for i
  
  ap_avail = parseInt(cookiejar.fetch("apavail", 0), 10);
  ap_spent = parseInt(cookiejar.fetch("apspent", 0), 10);
  
  last_attribute_clicked = parseInt(cookiejar.fetch("last_attribute_clicked", -1), 10);
  last_skill_clicked     = parseInt(cookiejar.fetch("last_skill_clicked", -1), 10);
  last_mutation_clicked  = parseInt(cookiejar.fetch("last_mutation_clicked", -1), 10);
}
//-----------------------------------------------------------------------------    
function saveStatsToCookie( ) 
{
  var i;
  
  for (i = LEVEL; i <= TH_CO; i++)
  {
    cookiejar.bake("stat" + i, st_stats[i], 365);
  } // for i

  cookiejar.bake("apavail", ap_avail, 365);
  cookiejar.bake("apspent", ap_spent, 365);
  
  cookiejar.bake("last_attribute_clicked", last_attribute_clicked, 365);
  cookiejar.bake("last_skill_clicked", last_skill_clicked, 365);
  cookiejar.bake("last_mutation_clicked", last_mutation_clicked, 365);
}
//-----------------------------------------------------------------------------    
function areCookiesEnabled( )
{
  cookiejar.bake("cookies_enabled", 1, 365);
  
  if (cookiejar.fetch("cookies_enabled", 0) == 1)
  {
    return true;
  }
  else
  {
    return false;
  }
}
//-----------------------------------------------------------------------------    
var cookiejar = {
	/* set a cookie */
	bake: function(cookieName, cookieValue, days, path)
  {
		var expires = '';
		if (days)
		{
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toGMTString();
		} 
		var thePath = '; path=/';
		if (path)
    { 
      thePath = '; path=' + path;
    }
		document.cookie = cookieName + '=' + escape(cookieValue) + expires + thePath;
	},
	/* get a cookie value */
	fetch: function(cookieName, val)
  {
		var nameEQ = cookieName + '=';
		var ca = document.cookie.split(';');
    var i;
		for (i = 0; i < ca.length; i++)
		{
			var c = ca[i];
			while (c.charAt(0) == ' ') 
      {
        c = c.substring(1, c.length);
			}
      if (c.indexOf(nameEQ) == 0) 
      {
        return unescape(c.substring(nameEQ.length, c.length));
      }
		} // for i
		return val;
	},
	/* delete a cookie */
	crumble: function(cookieName)
  {
		cookiejar.bake(cookieName, '', -1);
	}
};
//-----------------------------------------------------------------------------    
/* circumventing browser restrictions on the number of cookies one can use */
var subcookiejar = 
{
	nameValueSeparator: '$$:$$',
	subcookieSeparator: '$$/$$',
	/* set a cookie. subcookieObj is a collection of cookies to be. Every member of subcookieObj is the name of the cookie, its value
	 * the cookie value
	 */
	bake: function(cookieName, subcookieObj, days, path)
  {
		var cookieValue = '';
    var i;
		for (i in subcookieObj)
		{
			cookieValue += i + subcookiejar.nameValueSeparator;
			cookieValue += subcookieObj[i];
			cookieValue += subcookiejar.subcookieSeparator;
		} // for i
		/* remove trailing subcookieSeparator */
		cookieValue = cookieValue.substring(0, cookieValue.length-subcookiejar.subcookieSeparator.length);
		cookiejar.bake(cookieName, cookieValue, days, path);
	},
	/* get a subcookie */
	fetch: function(cookieName,subcookieName)
  {
		var cookieValue = cookiejar.fetch(cookieName);
		var subcookies = cookieValue.split(subcookiejar.subcookieSeparator);
    var i;
		for (i = 0; i < subcookies.length; i++)
		{
			var sc = subcookies[i].split(subcookiejar.nameValueSeparator);
			if (sc[0] == subcookieName) 
      {
        return sc[1];
      }
		} // for i
		return null;
	},
	/* delete a subcookie */
	crumble: function(cookieName, subcookieName, days, path)
	{
    var i;
		var cookieValue = cookiejar.fetch(cookieName);
		var newCookieObj = {};
		var subcookies = cookieValue.split(subcookiejar.subcookieSeparator);
		for (i = 0; i < subcookies.length; i++)
		{
			var sc = subcookies[i].split(subcookiejar.nameValueSeparator);
			if (sc[0] != subcookieName) 
      {
        newCookieObj[sc[0]] = sc[1];
      }
		} // for i
		subcookiejar.bake(cookieName, newCookieObj, days,path);
	}
};
//-----------------------------------------------------------------------------    
