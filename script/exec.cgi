#!/bin/tclsh

load tclrega.so

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

puts "Content-Type: text/plain; charset=windows-1252"
puts ""

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
