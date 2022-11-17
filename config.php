<?php

// Place all app configs here
date_default_timezone_set('UTC');

define('APP_NAME', getenv('APP_NAME'));

// Content file server (Use CDN here if you have one) - used for serving images, css, js files
define('CDN_DOMAIN', getenv('APP_DOMAIN'));

// EVE SDE table name
define('EVE_DUMP', 'eve_carnyx');

// Enable Tripwire API?
define('TRIPWIRE_API', getenv('API_ENABLED'));

// EVE API userAgent
define('USER_AGENT', 'Tripwire Server - adminEmail@example.com');

// EVE SSO info
define('EVE_SSO_CLIENT', getenv('EVE_SSO_CLIENT'));
define('EVE_SSO_SECRET', getenv('EVE_SSO_SECRET'));
define('EVE_SSO_REDIRECT', getenv('EVE_SSO_CALLBACK'));

// As of 2022-07-12, searching via the ESI API uses an endpoint that requires an
// authentication token. In order to use the new search functionality, you will
// need to add the `esi-search.search_structures.v1` scope to your application
// in the `developers.eveonline.com` portal. Once you have done that, this
// value can be changed from 'false' to 'true'.
define('ENABLE_SEARCH_SCOPE', true);

// Discord integration
/*define('DISCORD_WEB_HOOK', array(
	'maskID' => 'https://discord.com/api/webhooks/[discord web hook url]'
));*/
