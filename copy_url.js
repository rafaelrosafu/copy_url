// Copy bookmarklet URL to clipboard (--no-copyright => remove leading comments)
// (echo -n "javascript:"; uglifyjs --no-copyright copy_url.js ; echo) | pbcopy
// or just use http://marijnhaverbeke.nl/uglifyjs

(function() {
    // Change to following to your liking
    var hostEntries = [
        [ "www.2ality.com", {
            func: function (data) {
                data.ttitle = '“'+data.ttitle+'” by @rauschma #2ality';
                data.thref = data.thref+" ^ar"
            }
          }
        ],
        [ "451research.com"                 , { twit: "@451Research"    , source: "451 Research" } ],
        [ "addyosmani.com"                  , { twit: "@addyosmani"     , source: "addyosmani" } ],
        [ "angel.co"                        , { twit: "@angellist"      , source: "AngelList" } ],
        [ "www.allthingsdistributed.com"    , { twit: "@werner"         , source: "Werner Voguel's Blog" } ],
        [ "arstechnica.com"                 , { twit: "@arstechnica"    , source: "Ars Technica" } ],
        [ "aws.typepad.com"                 , { twit: "@awscloud"       , source: "AWS Blog" } ],
        [ "badassjs.com"                    , { twit: "@badass_js"      , source: "Badass JS" } ],
        [ "blog.chromium.org"               , { twit: "@ChromiumDev"    , source: "Chromium Blog" } ],
        [ "blog.gardeviance.org"            , { twit: "@swardley"       , source: "Simon Wardley's Blog" } ],
        [ "blog.mozilla.com"                , { twit: "@firefox"        , source: "Mozilla Blog" } ],
        [ "blog.nodejs.org"                 , { twit: "@nodejs"         , source: "Node JS Blog" } ],
        [ "www.cloudscaling.com"            , { twit: "@cloudscaling"   , source: "Cloudscaling" } ],
        [ "www.crunchbase.com"              , { twit: "@techcrunch"     , source: "Crunchbase" } ],
        [ "dailyjs.com"                     , { twit: "@dailyjs"        , source: "Daily JS" } ],
        [ "daringfireball.net"              , { twit: "@daringfireball" , source: "Daring Fireball" } ],
        [ "developer.palm.com"              , { twit: "@hpnews"         , source: "Palm" } ],
        [ "developers.google.com"           , { twit: "@googledevs"     , source: "Google Developers" } ],
        [ "www.digitalocean.com"            , { twit: "@digitalocean"   , source: "DigitalOcean" } ],
        [ "functionsource.com"              , { twit: "@functionsource" , source: "FunctionSource" } ],
        [ "gigaom.com"                      , { twit: "@gigaom"         , source: "GigaOm" } ],
        [ "googlecloudplatform.blogspot.ca" , { twit: "@googlecloud"    , source: "Google Cloud Platform blog" } ],
        [ "hacks.mozilla.org"               , { twit: "@mozhacks"       , source: "Mozilla Hacks" } ],
        [ "www.html5rocks.com"              , { twit: "@ChromiumDev"    , source: "HTML5 Rocks" } ],
        [ "www.macrumors.com"               , { twit: "@MacRumors"      , source: "MacRumors" } ],
        [ "www.marco.org"                   , { twit: "@marcoarment"    , source: "Marco Arment's Blog" } ],
        [ "mashable.com"                    , { twit: "@mashable"       , source: "Mashable" } ],
        [ "www.nczonline.net"               , { twit: "@slicknet"       , source: "NCZ Online" } ],
        [ /^.*nytimes.com$/                 , { twit: "@nytimes"        , source: "NY Times" } ],
        [ "pandodaily.com"                  , { twit: "@PandoDaily"     , source: "PandoDaily" } ],
        [ "ovh.com"                         , { twit: "@ovh"            , source: "OVH" } ],
        [ "rackspace.com"                   , { twit: "@rackspace"      , source: "Rackspace" } ],
        [ "www.remotesynthesis.com"         , { twit: "@remotesynth"    , source: "Remote Synthesis" } ],
        [ /^.*smashingmagazine.com$/        , { twit: "@smashingmag"    , source: "Smashing Magazine" } ],
        [ "spinoff.comicbookresources.com"  , { twit: "@SpinoffOnline"  , source: "Spinoff Online" } ],
        [ "structureresearch.net"           , { twit: "@StructureRes"   , source: "Structure Research" } ],
        [ "tagneto.blogspot.ca"             , { twit: "@jrburke"        , source: "Tagneto's Blog" } ],
        [ "techcrunch.com"                  , { twit: "@techcrunch"     , source: "Techcrunch" } ],
        [ "thenextweb.com"                  , { twit: "@TheNextWeb"     , source: "The Next Web" } ],
        [ "www.theregister.co.uk"           , { twit: "@theregister"    , source: "The Register" } ],
        [ "thewhir.com"                     , { twit: "@thewhir"        , source: "The WHIR" } ],
        [ "www.theverge.com"                , { twit: "@verge"          , source: "The Verge" } ],
        [ "unscriptable.com"                , { twit: "@unscriptable"   , source: "Unscriptable" } ],
    ];

    //----- Step 1: collect the input from the current page
    
    var data = {};
    var sel = (window.getSelection ? String(window.getSelection()) : "");

    data.title = document.title.replace(/(\s*[—•|].*)$/g,'');
    data.href = document.location.href;
    
    var hostDesc;
    hostEntries.some(function(hostEntry) {
        var key = hostEntry[0];
        if (key instanceof RegExp) {
            if (key.test(document.location.host)) {
                hostDesc = hostEntry[1];
                return true; // break
            }
        } else {
            if (key === document.location.host) {
                hostDesc = hostEntry[1];
                return true; // break
            }
        }
    });
    if (hostDesc) {
        if (hostDesc.func) {
            hostDesc.func(data);
        } else {
            if (hostDesc.twit) {
                data.twit = hostDesc.twit;
                data.source = hostDesc.source;
            }
        }
    }

    //----- Step 2: write the output to a new page

    var htmlProlog = tmpl(data,
        '<html><head><title>Copy link: {title}</title></head><body>'
        + '<textarea id="text" cols="80" rows="20">'
    );
    var text = '';

    // Plain text/Twitter
    if (data.twit === undefined) {
        htmlTemplate = '{title}\n{href}';
    }
    else {
        htmlTemplate = '“{title}” by {twit}\n{href}';
    }
    text += tmpl(data, htmlTemplate);
    
    // HTML link
    text += '\n\n';  // don’t include in selection
    text += tmpl(data, '<a href="{href}">{title}</a>');

    // Tab-separated, to be pasted into a spreadsheet
    // Trailing tab, so that one more column can easily be added
    text += tmpl(data, '\n\n{href}\t{title}\t');

    // Markdown link
    var mdTemplate = '';
    if (data.twit === undefined) {
        mdTemplate = '["{title}" on ]({href})';
    }
    else {
        mdTemplate = '["{title}" on {source}]({href})';
    }
    text += '\n\n';  // don’t include in selection
    var selectionStart = text.length;
    text += tmpl(data, mdTemplate);
    var selectionEnd = text.length;

    // Optionally: selected text
    if (sel) {
        text += "\n\n" + sel;
    }
    var htmlEpilog = tmpl(data,
        '</textarea>'
        + '</body></html>'
    );

    var doc = window.open().document;
    doc.write(htmlProlog + htmlEscape(text) + htmlEpilog);
    doc.close(); // finish writing the HTML

    var area = doc.getElementById("text");
    area.focus();
    area.selectionStart = selectionStart;
    area.selectionEnd = selectionEnd;

    function htmlEscape(text) {
        return text.replace("<", "&lt;");
    }

    // Poor man's templating
    function tmpl(data, text) {
        return text.replace(/{([a-z]+)}/g, function(g0,g1){return data[g1]});
    }
}())
