import { readdirSync, writeFileSync } from "node:fs";
const A = "C:/Users/juan.cuellar.BECALL/Documents/dev/me/jotis/regula/packages/icons/assets/flags".replaceAll("\\", "/");
const files = readdirSync(A).filter((f) => f.endsWith("-circle.svg")).map((f) => f.replace("-circle.svg", ""));
const flagged = "bahamas bhutan bonaire brunei christmas-island comoros cuba czech-republic democratic-republic-of-congo djibouti east-timor equatorial-guinea eritrea grenada guyana jordan kuwait mozambique namibia palestine papua-new-guinea puerto-rico republic-of-the-congo sahrawi-arab-democratic-republic saint-kitts-and-nevis sao-tome-and-principe sint-maarten solomon-islands south-africa south-sudan sudan tanzania trinidad-and-tobago vanuatu".split(" ");
const random = files.filter((_, i) => i % 13 === 0);
const pick = [...flagged, ...random];
const cell = (n) => '<div class=c>' + ["circle", "square", "rectangle"].map((s) => '<img src="file:///' + A + "/" + n + "-" + s + '.svg" height=64>').join("") + "<span>" + n + "</span></div>";
writeFileSync("/c/Users/JUANCU~1.BEC/AppData/Local/Temp/claude/131a5ebabe696d41/09e4a167-9cd7-452a-b9bb-97ab3371be20/scratchpad/icons/flags-sheet.html", '<style>body{font:10px sans-serif;margin:8px;background:#fff;width:1500px}.g{display:flex;flex-wrap:wrap}.c{width:240px;margin:4px}img{margin-right:6px;background:#ddd}span{display:block}</style><div class=g>' + pick.map(cell).join("") + "</div>");
console.log(pick.length);
