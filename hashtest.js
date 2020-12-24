
const crypto = require('crypto')
const data = 'https://en.wikipedia.org/w/load.php?debug=false&lang=en&modules=skins.minerva.base.reset%7Cskins.minerva.content.styles%7Cext.cite.style%7Csite.styles%7Cmobile.app.pagestyles.android%7Cmediawiki.page.gallery.styles%7Cmediawiki.skinning.content.parsoid&only=styles&skin=vector&version=&*';

const hash = crypto.createHash("sha1").update(data).digest("hex");
console.log(hash.toString());