textOutput = "";
mode = "json";

$ = function(id)
{
  return document.getElementById(id);
};

xhr =
    {

      create: function()
      {
        xhr.create = xhr._create();
        return xhr.create();
      },

      _create: function()
      {
        var fn =
            [
              function() { return new XMLHttpRequest(); },
              function() { return new ActiveXObject("Microsoft.XMLHTTP"); },
              function() { return new ActiveXObject("Msxml2.XMLHTTP"); }
            ];

        for (var i = 0, len = fn.length; i < len; i ++)
        {
          try
          {
            fn[i]();
            console.log(i);
            return fn[i];
          }
          catch (ex) { }
        }

        throw new Error("XMLHttpRequest not supported");

      }

    };

runScript = function(script)
{
  var req = xhr.create();
  req.open("POST", "exec.cgi", true);
  req.setRequestHeader('X-Test', 'two');
  //req.setRequestHeader('Content-Type', 'text/plain; charset=windows-1252');
  req.onload = xhrOnload;
  if (!script)
    req.send($("input").value);
  else
    req.send(script);
};

xhrOnload = function (e) {
  if (e.currentTarget.readyState === 4) {
    if (e.currentTarget.status === 200) {
      textOutput = e.currentTarget.responseText;
      /*console.log("1: " + encodeURIComponent(textOutput));
      console.log("2: " + unescape(textOutput));
      console.log("3: " + escape(textOutput));
      console.log("4: " + decodeURIComponent(escape(textOutput)));*/
      textOutput = unescape(textOutput);
      updateView();
    } else {
      console.error(e.currentTarget.statusText);
    }
  }
};

updateView = function()
{
  if (mode == "stdout") {
    $("output").value = getStdout(textOutput);
  }
  else {
    $("output").value = textOutput;
  }
};

showCachedPages = function() {
  runScript("WriteLine(system.CacheInfo());");
};

clearCache = function() {
  runScript("WriteLine(system.ClearCache());\nWriteLine(system.CacheInfo());");
};

disableCache = function() {
  runScript("WriteLine(system.CacheMode(0));");
};

enableCache = function() {
  runScript("WriteLine(system.CacheMode(1));");
};

getVariables = function() {
  runScript('string s_sysVarID;\nobject o_sysVar;\nstring s_nameSysVar = "";\nforeach (s_sysVarID, dom.GetObject(ID_SYSTEM_VARIABLES).EnumUsedIDs()) {\no_sysVar = dom.GetObject(s_sysVarID);\nWriteLine(o_sysVar.ID() # "\t" # o_sysVar.Name() # "\t" # o_sysVar.State());\n}');
};

getPrograms = function() {
  runScript('string s_sysVarID;\nobject o_sysVar;\nstring s_nameSysVar = "";\nforeach (s_sysVarID, dom.GetObject(ID_PROGRAMS).EnumUsedIDs()) {\no_sysVar = dom.GetObject(s_sysVarID);\nWriteLine(o_sysVar.ID() # "\t" # o_sysVar.Name());\n}');
};

getDevicesChannelsDPs = function() {
  runScript('string s_device; object o_device; integer i_devices = 0;  string s_channel; object o_channel; integer i_channels = 0;  string s_dp; object o_dp; integer i_dps = 0;  string s_typelist = "";  string s_temp;  foreach(s_device, dom.GetObject(ID_DEVICES).EnumUsedIDs()) {   var o_device = dom.GetObject(s_device);   if ((o_device.Address() != "BidCoS-Wir") && (o_device.Address() != "BidCoS-RF")) {     i_devices = i_devices + 1;     s_temp = i_devices.ToString();     if (i_devices < 10) { s_temp = " " # s_temp; }     if (i_devices < 100) { s_temp = " " # s_temp; }     WriteLine (s_temp # " " # o_device.Address () # " " # o_device.HssType () # " (" # o_device.Name() # ")");     s_typelist = s_typelist # o_device.HssType () # "\t";     integer int_channels = 0;     foreach(s_channel, o_device.Channels().EnumUsedIDs()) {       i_channels = i_channels + 1; int_channels = int_channels + 1;       o_channel = dom.GetObject(s_channel);       s_temp = "               :" # o_channel.Address().StrValueByIndex(":",1);       WriteLine(s_temp # " " # o_channel.Name());       if (int_channels < 100) { s_temp = "                   "; }       if (int_channels < 10) { s_temp = "                  "; }       foreach(s_dp, o_channel.DPs().EnumUsedIDs()) {         i_dps = i_dps + 1;         o_dp = dom.GetObject(s_dp);         WriteLine(s_temp # o_dp.Name() );       }     }   } }  WriteLine("--------------------------------------------");  WriteLine(i_channels # " Kan%E4le und " # i_dps # " Datenpunkte in " # i_devices # " Ger%E4ten:");  string s_typeidx; string s_typeidx2; string s_typechecked = ""; integer i_subcount; foreach (s_typeidx, s_typelist) {   if (s_typechecked.Find(s_typeidx) == -1) {   i_subcount = 0;   foreach (s_typeidx2, s_typelist) {     if (s_typeidx2 == s_typeidx) {        i_subcount = i_subcount + 1; }     }     if (s_typechecked == "") {        s_typechecked = i_subcount # "x " # s_typeidx;      } else {        s_typechecked = s_typechecked # ", " # i_subcount # "x " # s_typeidx;      }   } }  WriteLine (s_typechecked);  WriteLine("--------------------------------------------");');
};

getStdout = function()
{
  var result = "";

  try
  {
    var obj = eval("(" + textOutput + ")");
    return obj["STDOUT"];
  }
  catch (ex)
  {
    result = "INVALID JSON";
  }

  return result;
};

showJson = function()
{
  mode = "json";
  updateView();
};

showStdout = function()
{
  mode = "stdout";
  updateView();
};

startup = function()
{
  textOutput = "";
  mode = "stdout";
  $("input").value = "WriteLine(\"Hallo Welt!\");";
  $("output").value = "";
};

window.onload = startup;