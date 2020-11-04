#!/bin/tclsh

load tclrega.so

catch {
  set input $env(QUERY_STRING)
  set pairs [split $input &]
  foreach pair $pairs {
    if {0 != [regexp "^(\[^=]*)=(.*)$" $pair dummy varname val]} {
      set $varname $val
    }
  }
}

proc check_session sid {
  if {[regexp {@([0-9a-zA-Z]{10})@} $sid all sidnr]} {
    set res [lindex [rega_script "Write(system.GetSessionVarStr('$sidnr'));"] 1]
    if {$res != ""} {
      return 1
    }
  }
  return 0
}

proc toString { str } {
  set map {
    "\"" "\\\""
    "\\" "\\\\"
    "\{" "\\\{"
    "\[" "\\\["
    "/"  "\\/" 
    "\b"  "\\b" 
    "\f"  "\\f" 
    "\n"  "\\n" 
    "\r"  "\\r" 
    "\ä"  "\%E4"
    "\ö"  "\%F6"
    "\ü"  "\%FC"
    "\Ä"  "\%C4"
    "\Ö"  "\%D6"
    "\Ü"  "\%DC"
    "\ß"  "\%DF"
  }
  return "\"[string map $map $str]\""
}

puts "Content-Type: text/plain; charset=iso-8859-1"
puts ""

if {[file exists /etc/config/addons/www/script/NoSessionCheck] ||
    [info exists sid] && [check_session $sid]} {
  if { [catch {
    set content [read stdin]
    array set script_result [rega_script $content]
  
    set first 1
    set result "\{\n"
    foreach name [array names script_result] {
      if { 1 != $first } { append result ",\n" } { set first 0 }
      set value $script_result($name)
      append result "  [toString $name]: [toString $value]"
    }
    append result "\n\}"
  
    puts $result
    
  } errorMessage] } {
    puts $errorMessage
  }
} else {
  puts "{error: no valid session}"
}
