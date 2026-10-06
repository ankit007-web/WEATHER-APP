const USERS_KEY = "skycast_users";
const SESSION_KEY = "skycast_session";
const FAV_KEY = "skycast_favorites";

const $ = id => document.getElementById(id);
let currentWeather = null;
let worldMapLoaded = false;
let worldMapLoading = false;
let worldCountryData = [];
let worldMapLastUpdated = null;
let airQualityData = null;

const defaultUsers = [
  {id: "admin-1", name: "Administrator", email: "admin@skypulse.com", password: "admin123", role: "admin"}
];

// Country/territory representative coordinates used to paint the global heat map.
const WORLD_COUNTRIES = [{"name":"Afghanistan","iso":"AFG","lat":33.0,"lon":65.0},{"name":"Albania","iso":"ALB","lat":41.0,"lon":20.0},{"name":"Algeria","iso":"DZA","lat":28.0,"lon":3.0},{"name":"American Samoa","iso":"ASM","lat":-14.33333333,"lon":-170.0},{"name":"Angola","iso":"AGO","lat":-12.5,"lon":18.5},{"name":"Anguilla","iso":"AIA","lat":18.25,"lon":-63.16666666},{"name":"Antigua and Barbuda","iso":"ATG","lat":17.05,"lon":-61.8},{"name":"Argentina","iso":"ARG","lat":-34.0,"lon":-64.0},{"name":"Armenia","iso":"ARM","lat":40.0,"lon":45.0},{"name":"Aruba","iso":"ABW","lat":12.5,"lon":-69.96666666},{"name":"Australia","iso":"AUS","lat":-27.0,"lon":133.0},{"name":"Austria","iso":"AUT","lat":47.33333333,"lon":13.33333333},{"name":"Azerbaijan","iso":"AZE","lat":40.5,"lon":47.5},{"name":"The Bahamas","iso":"BHS","lat":24.25,"lon":-76.0},{"name":"Bahrain","iso":"BHR","lat":26.0,"lon":50.55},{"name":"Bangladesh","iso":"BGD","lat":24.0,"lon":90.0},{"name":"Barbados","iso":"BRB","lat":13.16666666,"lon":-59.53333333},{"name":"Belarus","iso":"BLR","lat":53.0,"lon":28.0},{"name":"Belgium","iso":"BEL","lat":50.83333333,"lon":4.0},{"name":"Belize","iso":"BLZ","lat":17.25,"lon":-88.75},{"name":"Benin","iso":"BEN","lat":9.5,"lon":2.25},{"name":"Bermuda","iso":"BMU","lat":32.33333333,"lon":-64.75},{"name":"Bhutan","iso":"BTN","lat":27.5,"lon":90.5},{"name":"Bolivia","iso":"BOL","lat":-17.0,"lon":-65.0},{"name":"Bosnia and Herzegovina","iso":"BIH","lat":44.0,"lon":18.0},{"name":"Botswana","iso":"BWA","lat":-22.0,"lon":24.0},{"name":"Brazil","iso":"BRA","lat":-10.0,"lon":-55.0},{"name":"British Indian Ocean Territory","iso":"IOT","lat":-6.0,"lon":71.5},{"name":"Brunei","iso":"BRN","lat":4.5,"lon":114.66666666},{"name":"Bulgaria","iso":"BGR","lat":43.0,"lon":25.0},{"name":"Burkina Faso","iso":"BFA","lat":13.0,"lon":-2.0},{"name":"Burundi","iso":"BDI","lat":-3.5,"lon":30.0},{"name":"Cambodia","iso":"KHM","lat":13.0,"lon":105.0},{"name":"Cameroon","iso":"CMR","lat":6.0,"lon":12.0},{"name":"Canada","iso":"CAN","lat":60.0,"lon":-95.0},{"name":"Cape Verde","iso":"CPV","lat":16.0,"lon":-24.0},{"name":"Cayman Islands","iso":"CYM","lat":19.5,"lon":-80.5},{"name":"Central African Republic","iso":"CAF","lat":7.0,"lon":21.0},{"name":"Chad","iso":"TCD","lat":15.0,"lon":19.0},{"name":"Chile","iso":"CHL","lat":-30.0,"lon":-71.0},{"name":"China","iso":"CHN","lat":35.0,"lon":105.0},{"name":"Christmas Island","iso":"CXR","lat":-10.5,"lon":105.66666666},{"name":"Cocos (Keeling) Islands","iso":"CCK","lat":-12.5,"lon":96.83333333},{"name":"Colombia","iso":"COL","lat":4.0,"lon":-72.0},{"name":"Comoros","iso":"COM","lat":-12.16666666,"lon":44.25},{"name":"Republic of the Congo","iso":"COG","lat":-1.0,"lon":15.0},{"name":"Democratic Republic of the Congo","iso":"COD","lat":0.0,"lon":25.0},{"name":"Cook Islands","iso":"COK","lat":-21.23333333,"lon":-159.76666666},{"name":"Costa Rica","iso":"CRI","lat":10.0,"lon":-84.0},{"name":"Ivory Coast","iso":"CIV","lat":8.0,"lon":-5.0},{"name":"Croatia","iso":"HRV","lat":45.16666666,"lon":15.5},{"name":"Cuba","iso":"CUB","lat":21.5,"lon":-80.0},{"name":"Cyprus","iso":"CYP","lat":35.0,"lon":33.0},{"name":"Czech Republic","iso":"CZE","lat":49.75,"lon":15.5},{"name":"Denmark","iso":"DNK","lat":56.0,"lon":10.0},{"name":"Djibouti","iso":"DJI","lat":11.5,"lon":43.0},{"name":"Dominica","iso":"DMA","lat":15.41666666,"lon":-61.33333333},{"name":"Dominican Republic","iso":"DOM","lat":19.0,"lon":-70.66666666},{"name":"Ecuador","iso":"ECU","lat":-2.0,"lon":-77.5},{"name":"Egypt","iso":"EGY","lat":27.0,"lon":30.0},{"name":"El Salvador","iso":"SLV","lat":13.83333333,"lon":-88.91666666},{"name":"Equatorial Guinea","iso":"GNQ","lat":2.0,"lon":10.0},{"name":"Eritrea","iso":"ERI","lat":15.0,"lon":39.0},{"name":"Estonia","iso":"EST","lat":59.0,"lon":26.0},{"name":"Ethiopia","iso":"ETH","lat":8.0,"lon":38.0},{"name":"Falkland Islands","iso":"FLK","lat":-51.75,"lon":-59.0},{"name":"Faroe Islands","iso":"FRO","lat":62.0,"lon":-7.0},{"name":"Fiji","iso":"FJI","lat":-18.0,"lon":175.0},{"name":"Finland","iso":"FIN","lat":64.0,"lon":26.0},{"name":"France","iso":"FRA","lat":46.0,"lon":2.0},{"name":"French Guiana","iso":"GUF","lat":4.0,"lon":-53.0},{"name":"French Polynesia","iso":"PYF","lat":-15.0,"lon":-140.0},{"name":"French Southern and Antarctic Lands","iso":"ATF","lat":-49.25,"lon":69.167},{"name":"Gabon","iso":"GAB","lat":-1.0,"lon":11.75},{"name":"The Gambia","iso":"GMB","lat":13.46666666,"lon":-16.56666666},{"name":"Georgia","iso":"GEO","lat":42.0,"lon":43.5},{"name":"Germany","iso":"DEU","lat":51.0,"lon":9.0},{"name":"Ghana","iso":"GHA","lat":8.0,"lon":-2.0},{"name":"Gibraltar","iso":"GIB","lat":36.13333333,"lon":-5.35},{"name":"Greece","iso":"GRC","lat":39.0,"lon":22.0},{"name":"Greenland","iso":"GRL","lat":72.0,"lon":-40.0},{"name":"Grenada","iso":"GRD","lat":12.11666666,"lon":-61.66666666},{"name":"Guadeloupe","iso":"GLP","lat":16.25,"lon":-61.583333},{"name":"Guam","iso":"GUM","lat":13.46666666,"lon":144.78333333},{"name":"Guatemala","iso":"GTM","lat":15.5,"lon":-90.25},{"name":"Guernsey","iso":"GGY","lat":49.46666666,"lon":-2.58333333},{"name":"Guinea","iso":"GIN","lat":11.0,"lon":-10.0},{"name":"Guinea-Bissau","iso":"GNB","lat":12.0,"lon":-15.0},{"name":"Guyana","iso":"GUY","lat":5.0,"lon":-59.0},{"name":"Haiti","iso":"HTI","lat":19.0,"lon":-72.41666666},{"name":"Heard Island and McDonald Islands","iso":"HMD","lat":-53.1,"lon":72.51666666},{"name":"Honduras","iso":"HND","lat":15.0,"lon":-86.5},{"name":"Hong Kong","iso":"HKG","lat":22.25,"lon":114.16666666},{"name":"Hungary","iso":"HUN","lat":47.0,"lon":20.0},{"name":"Iceland","iso":"ISL","lat":65.0,"lon":-18.0},{"name":"India","iso":"IND","lat":20.0,"lon":77.0},{"name":"Indonesia","iso":"IDN","lat":-5.0,"lon":120.0},{"name":"Iran","iso":"IRN","lat":32.0,"lon":53.0},{"name":"Iraq","iso":"IRQ","lat":33.0,"lon":44.0},{"name":"Ireland","iso":"IRL","lat":53.0,"lon":-8.0},{"name":"Israel","iso":"ISR","lat":31.5,"lon":34.75},{"name":"Italy","iso":"ITA","lat":42.83333333,"lon":12.83333333},{"name":"Jamaica","iso":"JAM","lat":18.25,"lon":-77.5},{"name":"Japan","iso":"JPN","lat":36.0,"lon":138.0},{"name":"Jersey","iso":"JEY","lat":49.25,"lon":-2.16666666},{"name":"Jordan","iso":"JOR","lat":31.0,"lon":36.0},{"name":"Kazakhstan","iso":"KAZ","lat":48.0,"lon":68.0},{"name":"Kenya","iso":"KEN","lat":1.0,"lon":38.0},{"name":"Kiribati","iso":"KIR","lat":1.41666666,"lon":173.0},{"name":"North Korea","iso":"PRK","lat":40.0,"lon":127.0},{"name":"South Korea","iso":"KOR","lat":37.0,"lon":127.5},{"name":"Kuwait","iso":"KWT","lat":29.5,"lon":45.75},{"name":"Kyrgyzstan","iso":"KGZ","lat":41.0,"lon":75.0},{"name":"Laos","iso":"LAO","lat":18.0,"lon":105.0},{"name":"Latvia","iso":"LVA","lat":57.0,"lon":25.0},{"name":"Lebanon","iso":"LBN","lat":33.83333333,"lon":35.83333333},{"name":"Lesotho","iso":"LSO","lat":-29.5,"lon":28.5},{"name":"Liberia","iso":"LBR","lat":6.5,"lon":-9.5},{"name":"Libya","iso":"LBY","lat":25.0,"lon":17.0},{"name":"Liechtenstein","iso":"LIE","lat":47.26666666,"lon":9.53333333},{"name":"Lithuania","iso":"LTU","lat":56.0,"lon":24.0},{"name":"Luxembourg","iso":"LUX","lat":49.75,"lon":6.16666666},{"name":"Macau","iso":"MAC","lat":22.16666666,"lon":113.55},{"name":"Republic of Macedonia","iso":"MKD","lat":41.83333333,"lon":22.0},{"name":"Madagascar","iso":"MDG","lat":-20.0,"lon":47.0},{"name":"Malawi","iso":"MWI","lat":-13.5,"lon":34.0},{"name":"Malaysia","iso":"MYS","lat":2.5,"lon":112.5},{"name":"Maldives","iso":"MDV","lat":3.25,"lon":73.0},{"name":"Mali","iso":"MLI","lat":17.0,"lon":-4.0},{"name":"Malta","iso":"MLT","lat":35.83333333,"lon":14.58333333},{"name":"Isle of Man","iso":"IMN","lat":54.25,"lon":-4.5},{"name":"Marshall Islands","iso":"MHL","lat":9.0,"lon":168.0},{"name":"Martinique","iso":"MTQ","lat":14.666667,"lon":-61.0},{"name":"Mauritania","iso":"MRT","lat":20.0,"lon":-12.0},{"name":"Mauritius","iso":"MUS","lat":-20.28333333,"lon":57.55},{"name":"Mayotte","iso":"MYT","lat":-12.83333333,"lon":45.16666666},{"name":"Mexico","iso":"MEX","lat":23.0,"lon":-102.0},{"name":"Federated States of Micronesia","iso":"FSM","lat":6.91666666,"lon":158.25},{"name":"Moldova","iso":"MDA","lat":47.0,"lon":29.0},{"name":"Monaco","iso":"MCO","lat":43.73333333,"lon":7.4},{"name":"Mongolia","iso":"MNG","lat":46.0,"lon":105.0},{"name":"Montserrat","iso":"MSR","lat":16.75,"lon":-62.2},{"name":"Morocco","iso":"MAR","lat":32.0,"lon":-5.0},{"name":"Mozambique","iso":"MOZ","lat":-18.25,"lon":35.0},{"name":"Namibia","iso":"NAM","lat":-22.0,"lon":17.0},{"name":"Nauru","iso":"NRU","lat":-0.53333333,"lon":166.91666666},{"name":"Nepal","iso":"NPL","lat":28.0,"lon":84.0},{"name":"Netherlands","iso":"NLD","lat":52.5,"lon":5.75},{"name":"New Caledonia","iso":"NCL","lat":-21.5,"lon":165.5},{"name":"New Zealand","iso":"NZL","lat":-41.0,"lon":174.0},{"name":"Nicaragua","iso":"NIC","lat":13.0,"lon":-85.0},{"name":"Niger","iso":"NER","lat":16.0,"lon":8.0},{"name":"Nigeria","iso":"NGA","lat":10.0,"lon":8.0},{"name":"Niue","iso":"NIU","lat":-19.03333333,"lon":-169.86666666},{"name":"Norfolk Island","iso":"NFK","lat":-29.03333333,"lon":167.95},{"name":"Northern Mariana Islands","iso":"MNP","lat":15.2,"lon":145.75},{"name":"Norway","iso":"NOR","lat":62.0,"lon":10.0},{"name":"Oman","iso":"OMN","lat":21.0,"lon":57.0},{"name":"Pakistan","iso":"PAK","lat":30.0,"lon":70.0},{"name":"Palau","iso":"PLW","lat":7.5,"lon":134.5},{"name":"Panama","iso":"PAN","lat":9.0,"lon":-80.0},{"name":"Papua New Guinea","iso":"PNG","lat":-6.0,"lon":147.0},{"name":"Paraguay","iso":"PRY","lat":-23.0,"lon":-58.0},{"name":"Peru","iso":"PER","lat":-10.0,"lon":-76.0},{"name":"Philippines","iso":"PHL","lat":13.0,"lon":122.0},{"name":"Pitcairn Islands","iso":"PCN","lat":-25.06666666,"lon":-130.1},{"name":"Poland","iso":"POL","lat":52.0,"lon":20.0},{"name":"Portugal","iso":"PRT","lat":39.5,"lon":-8.0},{"name":"Puerto Rico","iso":"PRI","lat":18.25,"lon":-66.5},{"name":"Qatar","iso":"QAT","lat":25.5,"lon":51.25},{"name":"R\u00e9union","iso":"REU","lat":-21.15,"lon":55.5},{"name":"Romania","iso":"ROU","lat":46.0,"lon":25.0},{"name":"Russia","iso":"RUS","lat":60.0,"lon":100.0},{"name":"Rwanda","iso":"RWA","lat":-2.0,"lon":30.0},{"name":"Saint Helena","iso":"SHN","lat":-15.95,"lon":-5.7},{"name":"Saint Kitts and Nevis","iso":"KNA","lat":17.33333333,"lon":-62.75},{"name":"Saint Lucia","iso":"LCA","lat":13.88333333,"lon":-60.96666666},{"name":"Saint Pierre and Miquelon","iso":"SPM","lat":46.83333333,"lon":-56.33333333},{"name":"Saint Vincent and the Grenadines","iso":"VCT","lat":13.25,"lon":-61.2},{"name":"Samoa","iso":"WSM","lat":-13.58333333,"lon":-172.33333333},{"name":"San Marino","iso":"SMR","lat":43.76666666,"lon":12.41666666},{"name":"S\u00e3o Tom\u00e9 and Pr\u00edncipe","iso":"STP","lat":1.0,"lon":7.0},{"name":"Saudi Arabia","iso":"SAU","lat":25.0,"lon":45.0},{"name":"Senegal","iso":"SEN","lat":14.0,"lon":-14.0},{"name":"Serbia","iso":"SRB","lat":44.1305021,"lon":16.4284181},{"name":"Seychelles","iso":"SYC","lat":-4.58333333,"lon":55.66666666},{"name":"Sierra Leone","iso":"SLE","lat":8.5,"lon":-11.5},{"name":"Singapore","iso":"SGP","lat":1.36666666,"lon":103.8},{"name":"Slovakia","iso":"SVK","lat":48.66666666,"lon":19.5},{"name":"Slovenia","iso":"SVN","lat":46.11666666,"lon":14.81666666},{"name":"Solomon Islands","iso":"SLB","lat":-8.0,"lon":159.0},{"name":"Somalia","iso":"SOM","lat":10.0,"lon":49.0},{"name":"South Africa","iso":"ZAF","lat":-29.0,"lon":24.0},{"name":"South Georgia","iso":"SGS","lat":-54.5,"lon":-37.0},{"name":"South Sudan","iso":"SSD","lat":7.0,"lon":30.0},{"name":"Spain","iso":"ESP","lat":40.0,"lon":-4.0},{"name":"Sri Lanka","iso":"LKA","lat":7.0,"lon":81.0},{"name":"Sudan","iso":"SDN","lat":15.0,"lon":30.0},{"name":"Suriname","iso":"SUR","lat":4.0,"lon":-56.0},{"name":"Svalbard and Jan Mayen","iso":"SJM","lat":78.0,"lon":20.0},{"name":"Swaziland","iso":"SWZ","lat":-26.5,"lon":31.5},{"name":"Sweden","iso":"SWE","lat":62.0,"lon":15.0},{"name":"Switzerland","iso":"CHE","lat":47.0,"lon":8.0},{"name":"Syria","iso":"SYR","lat":35.0,"lon":38.0},{"name":"Taiwan","iso":"TWN","lat":23.5,"lon":121.0},{"name":"Tajikistan","iso":"TJK","lat":39.0,"lon":71.0},{"name":"Tanzania","iso":"TZA","lat":-6.0,"lon":35.0},{"name":"Thailand","iso":"THA","lat":15.0,"lon":100.0},{"name":"East Timor","iso":"TLS","lat":-8.83333333,"lon":125.91666666},{"name":"Togo","iso":"TGO","lat":8.0,"lon":1.16666666},{"name":"Tokelau","iso":"TKL","lat":-9.0,"lon":-172.0},{"name":"Tonga","iso":"TON","lat":-20.0,"lon":-175.0},{"name":"Trinidad and Tobago","iso":"TTO","lat":11.0,"lon":-61.0},{"name":"Tunisia","iso":"TUN","lat":34.0,"lon":9.0},{"name":"Turkey","iso":"TUR","lat":39.0,"lon":35.0},{"name":"Turkmenistan","iso":"TKM","lat":40.0,"lon":60.0},{"name":"Tuvalu","iso":"TUV","lat":-8.0,"lon":178.0},{"name":"Uganda","iso":"UGA","lat":1.0,"lon":32.0},{"name":"Ukraine","iso":"UKR","lat":49.0,"lon":32.0},{"name":"United Arab Emirates","iso":"ARE","lat":24.0,"lon":54.0},{"name":"United Kingdom","iso":"GBR","lat":54.0,"lon":-2.0},{"name":"United States","iso":"USA","lat":38.0,"lon":-97.0},{"name":"Uruguay","iso":"URY","lat":-33.0,"lon":-56.0},{"name":"Uzbekistan","iso":"UZB","lat":41.0,"lon":64.0},{"name":"Vanuatu","iso":"VUT","lat":-16.0,"lon":167.0},{"name":"Venezuela","iso":"VEN","lat":8.0,"lon":-66.0},{"name":"Vietnam","iso":"VNM","lat":16.16666666,"lon":107.83333333},{"name":"Wallis and Futuna","iso":"WLF","lat":-13.3,"lon":-176.2},{"name":"Western Sahara","iso":"ESH","lat":24.5,"lon":-13.0},{"name":"Yemen","iso":"YEM","lat":15.0,"lon":48.0},{"name":"Zambia","iso":"ZMB","lat":-15.0,"lon":30.0},{"name":"Zimbabwe","iso":"ZWE","lat":-20.0,"lon":30.0}];

function getUsers(){ return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
function saveUsers(users){ localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
function getSession(){ return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); }
function getFavs(){ return JSON.parse(localStorage.getItem(FAV_KEY) || "{}"); }
function saveFavs(f){ localStorage.setItem(FAV_KEY, JSON.stringify(f)); }

if(!localStorage.getItem(USERS_KEY)) saveUsers(defaultUsers);

function showToast(msg){
  $("toast").textContent = msg;
  $("toast").classList.add("show");
  setTimeout(() => $("toast").classList.remove("show"), 2200);
}
function initials(name){ return (name || "U").trim().split(/\s+/).map(x=>x[0]).join("").slice(0,2).toUpperCase(); }

function switchAuth(mode){
  $("loginTab").classList.toggle("active", mode === "login");
  $("signupTab").classList.toggle("active", mode === "signup");
  $("loginForm").classList.toggle("hidden", mode !== "login");
  $("signupForm").classList.toggle("hidden", mode !== "signup");
}
$("loginTab").onclick = () => switchAuth("login");
$("signupTab").onclick = () => switchAuth("signup");

$("signupForm").onsubmit = e => {
  e.preventDefault();
  const name = $("signupName").value.trim();
  const email = $("signupEmail").value.trim().toLowerCase();
  const password = $("signupPassword").value;
  const users = getUsers();
  if(users.some(u => u.email === email)) return showToast("Email already registered.");
  users.push({id: crypto.randomUUID(), name, email, password, role:"user"});
  saveUsers(users);
  showToast("Account created. Please login.");
  $("signupForm").reset();
  switchAuth("login");
  $("loginEmail").value = email;
};

$("loginForm").onsubmit = e => {
  e.preventDefault();
  const email = $("loginEmail").value.trim().toLowerCase();
  const password = $("loginPassword").value;
  const user = getUsers().find(u => u.email === email && u.password === password);
  if(!user) return showToast("Invalid email or password.");
  localStorage.setItem(SESSION_KEY, JSON.stringify({id:user.id}));
  showApp(user);
};

$("logoutBtn").onclick = () => {
  localStorage.removeItem(SESSION_KEY);
  $("appView").classList.add("hidden");
  $("authView").classList.remove("hidden");
  switchAuth("login");
};

function showApp(user){
  $("authView").classList.add("hidden");
  $("appView").classList.remove("hidden");
  $("userName").textContent = user.name;
  $("userAvatar").textContent = initials(user.name);
  $("welcomeTitle").textContent = `Hello, ${user.name.split(" ")[0]}!`;
  $("todayText").textContent = new Date().toLocaleDateString(undefined,{weekday:"long",year:"numeric",month:"long",day:"numeric"});
  $("adminNav").classList.toggle("hidden", user.role !== "admin");
  updateProfile(user);
  renderFavorites();
  if(user.role === "admin") renderAdmin();
  if(!$("cityName").dataset.loaded) loadWeather("Vijayawada");
}
function getCurrentUser(){ const s=getSession(); return getUsers().find(u=>u.id===s?.id); }

function updateProfile(user){
  $("profileName").textContent = user.name;
  $("profileEmail").textContent = user.email;
  $("profileRole").textContent = user.role === "admin" ? "Administrator" : "User";
  $("profileAvatar").textContent = initials(user.name);
  const favs=getFavs()[user.id] || [];
  $("profileFavCount").textContent = favs.length;
}

document.querySelectorAll(".nav-btn").forEach(btn => btn.onclick = () => {
  document.querySelectorAll(".nav-btn").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".content-section").forEach(x=>x.classList.add("hidden"));
  $(btn.dataset.section + "Section").classList.remove("hidden");
  if(btn.dataset.section === "favorites") renderFavorites();
  if(btn.dataset.section === "admin") renderAdmin();
  if(btn.dataset.section === "worldMap") loadWorldMap();
  if(btn.dataset.section === "airQuality") loadAirQuality();
  if(btn.dataset.section === "insights") renderInsights();
  if(btn.dataset.section === "analytics") renderAnalytics();
  if(btn.dataset.section === "settings") loadSettingsUI();
});

$("searchBtn").onclick = () => {
  const city=$("cityInput").value.trim();
  if(city) loadWeather(city);
};
$("cityInput").addEventListener("keydown", e => { if(e.key==="Enter") $("searchBtn").click(); });

// Voice search: supported by Chromium-based browsers (Chrome/Edge).
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if(SpeechRecognition){
  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onstart = () => {
    $("voiceSearchBtn").classList.add("listening");
    $("voiceSearchBtn").textContent = "🔴";
    $("searchMessage").textContent = "Listening… say a city name";
  };
  recognition.onresult = event => {
    const transcript = event.results[0][0].transcript.trim();
    $("cityInput").value = transcript;
    loadWeather(transcript);
  };
  recognition.onerror = event => {
    $("searchMessage").textContent = event.error === "not-allowed"
      ? "Microphone permission was denied. Allow microphone access to use voice search."
      : "Voice search could not hear you. Please try again.";
  };
  recognition.onend = () => {
    $("voiceSearchBtn").classList.remove("listening");
    $("voiceSearchBtn").textContent = "🎙️";
  };
  $("voiceSearchBtn").onclick = () => {
    try { recognition.start(); } catch(e) {}
  };
}else{
  $("voiceSearchBtn").onclick = () => showToast("Voice search is supported in Chrome or Edge.");
}

$("locationBtn").onclick = () => {
  if(!navigator.geolocation) return showToast("Geolocation is not supported.");
  $("searchMessage").textContent="Getting your location...";
  navigator.geolocation.getCurrentPosition(async pos => {
    const {latitude,longitude}=pos.coords;
    await loadWeatherByCoords(latitude,longitude);
  }, () => {
    $("searchMessage").textContent="Location permission denied. Search for a city instead.";
  });
};

function weatherInfo(code){
  const map = {
    0:["Clear sky","☀️"],1:["Mainly clear","🌤️"],2:["Partly cloudy","⛅"],3:["Overcast","☁️"],
    45:["Fog","🌫️"],48:["Depositing rime fog","🌫️"],51:["Light drizzle","🌦️"],53:["Drizzle","🌦️"],55:["Heavy drizzle","🌧️"],
    61:["Light rain","🌦️"],63:["Rain","🌧️"],65:["Heavy rain","🌧️"],71:["Light snow","🌨️"],73:["Snow","❄️"],75:["Heavy snow","❄️"],
    80:["Rain showers","🌦️"],81:["Rain showers","🌧️"],82:["Heavy rain showers","⛈️"],95:["Thunderstorm","⛈️"],96:["Thunderstorm + hail","⛈️"],99:["Thunderstorm + hail","⛈️"]
  };
  return map[code] || ["Unknown","🌤️"];
}
function formatDay(date){ return new Date(date).toLocaleDateString(undefined,{weekday:"short"}); }

async function geocode(city){
  const url=`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const res=await fetch(url); if(!res.ok) throw new Error("Geocoding failed");
  const data=await res.json(); if(!data.results?.length) throw new Error("City not found");
  return data.results[0];
}
async function fetchWeather(lat,lon){
  const hourlyVars = [
    "temperature_2m", "apparent_temperature", "relative_humidity_2m",
    "precipitation_probability", "precipitation", "weather_code",
    "wind_speed_10m", "wind_direction_10m", "uv_index", "is_day"
  ].join(",");
  const dailyVars = ["weather_code","temperature_2m_max","temperature_2m_min","precipitation_probability_max"].join(",");
  const url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&hourly=${hourlyVars}&daily=${dailyVars}&timezone=auto&forecast_days=7`;
  const res=await fetch(url); if(!res.ok) throw new Error("Weather service failed");
  return res.json();
}
async function loadWeather(city){
  try{
    $("searchMessage").textContent="Loading weather...";
    const place=await geocode(city);
    await displayWeather(place.name, place.latitude, place.longitude, place.country);
  }catch(err){ $("searchMessage").textContent=err.message || "Unable to load weather."; }
}
async function loadWeatherByCoords(lat,lon){
  try{
    const rev=await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`);
    const place=await rev.json();
    const p=place.results?.[0];
    await displayWeather(p?.name || "My Location",lat,lon,p?.country || "");
  }catch(err){$("searchMessage").textContent="Unable to load location weather.";}
}
function getSettings(){ return JSON.parse(localStorage.getItem("skypulse_settings") || '{"unit":"C","theme":"light","autoRefresh":true}'); }
function saveSettingsData(v){ localStorage.setItem("skypulse_settings", JSON.stringify(v)); }
function convertTemp(c){ const s=getSettings(); return s.unit === "F" ? (c*9/5)+32 : c; }
function tempText(c, decimals=0){ if(!Number.isFinite(Number(c))) return "--"; const v=convertTemp(Number(c)); return `${decimals ? v.toFixed(decimals) : Math.round(v)}°${getSettings().unit}`; }
function applyTheme(){ document.body.classList.toggle("dark-mode", getSettings().theme === "dark"); }
function loadSettingsUI(){ const s=getSettings(); $("themeSelect").value=s.theme; $("unitSelect").value=s.unit; $("autoRefreshToggle").checked=s.autoRefresh!==false; }
function aqiLabel(v){ if(v<=50)return ["Good","Air quality is satisfactory."]; if(v<=100)return ["Moderate","Sensitive people may want to reduce prolonged outdoor exposure."]; if(v<=150)return ["Unhealthy for Sensitive Groups","Consider reducing long or intense outdoor activity."]; if(v<=200)return ["Unhealthy","Consider limiting prolonged outdoor activity."]; if(v<=300)return ["Very Unhealthy","Avoid prolonged outdoor exertion when possible."]; return ["Hazardous","Avoid outdoor exposure and follow local health guidance."]; }
function renderInsights(){
  const h=currentWeather?.data?.hourly; if(!h){ $("insightHeadline").textContent="Search a location to get insights"; $("insightSummary").textContent="Your personalized weather summary will appear here."; $("insightCards").innerHTML=""; return; }
  const temps=h.temperature_2m||[], rain=h.precipitation_probability||[], uv=h.uv_index||[], wind=h.wind_speed_10m||[];
  const max=Math.max(...temps), min=Math.min(...temps), rainMax=Math.max(...rain), uvMax=Math.max(...uv), windMax=Math.max(...wind);
  let headline="Comfortable weather ahead", summary=`${currentWeather.name} is currently ${tempText(currentWeather.data.current.temperature_2m)}. The next seven days range from ${tempText(min)} to ${tempText(max)}.`;
  if(rainMax>=70){headline="Rain is likely this week";summary=`Rain probability reaches ${Math.round(rainMax)}%. Keep an umbrella handy and plan outdoor activities around the wetter hours.`;} else if(uvMax>=8){headline="High UV is expected";summary=`UV index may reach ${uvMax.toFixed(1)}. Prefer early morning or evening for longer outdoor activities and use sun protection.`;} else if(max-min>=12){headline="Large temperature swing";summary=`Temperatures vary by about ${Math.round(max-min)}°. Dress in layers if you will be outside for long periods.`;}
  $("insightHeadline").textContent=headline; $("insightSummary").textContent=summary;
  const cards=[
    ["☂️","Rain Watch",rainMax>=60?`Peak rain chance ${Math.round(rainMax)}%`:`Peak rain chance ${Math.round(rainMax)}%`,rainMax>=60?"Carry an umbrella":"Low rain risk"],
    ["☀️","UV Protection",`Peak UV ${uvMax.toFixed(1)}`,uvMax>=8?"High — protect your skin":"Generally manageable"],
    ["💨","Wind Conditions",`Peak ${Math.round(windMax)} km/h`,windMax>=35?"Strong winds possible":"Mostly comfortable"],
    ["🌡️","Temperature Range",`${tempText(min)} – ${tempText(max)}`,`${Math.round(max-min)}° range across the forecast`]
  ];
  $("insightCards").innerHTML=cards.map(c=>`<div class="insight-card"><div class="insight-icon">${c[0]}</div><div><h3>${c[1]}</h3><b>${c[2]}</b><p>${c[3]}</p></div></div>`).join("");
}
function renderAnalytics(){
  const h=currentWeather?.data?.hourly; if(!h){ $("analyticsLocation").textContent="No location selected"; return; }
  const temps=h.temperature_2m||[], rain=h.precipitation_probability||[]; const avg=temps.reduce((a,b)=>a+b,0)/Math.max(temps.length,1);
  $("avgTemp").textContent=tempText(avg,1); $("maxTemp").textContent=tempText(Math.max(...temps)); $("minTemp").textContent=tempText(Math.min(...temps)); $("rainyHours").textContent=`${rain.filter(v=>Number(v)>=50).length} hrs`; $("analyticsLocation").textContent=currentWeather.name;
  const days=[]; for(let d=0;d<7;d++){const vals=temps.slice(d*24,(d+1)*24); if(!vals.length)continue; days.push({label:new Date((h.time[d*24]||"").replace("T"," ")).toLocaleDateString(undefined,{weekday:"short"}),avg:vals.reduce((a,b)=>a+b,0)/vals.length});}
  const maxAvg=Math.max(...days.map(x=>x.avg),1); $("temperatureChart").innerHTML=days.map(x=>`<div class="chart-bar-wrap"><span>${tempText(x.avg)}</span><div class="chart-bar" style="height:${Math.max(12,(x.avg/maxAvg)*150)}px"></div><small>${x.label}</small></div>`).join("");
}
async function loadAirQuality(){
  if(!currentWeather){showToast("Search a city first to view air quality."); return;}
  try{
    $("aqiLabel").textContent="Loading…";
    const url=`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${currentWeather.lat}&longitude=${currentWeather.lon}&current=us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide&timezone=auto`;
    const res=await fetch(url); if(!res.ok) throw new Error(); const d=await res.json(); airQualityData=d.current;
    const aqi=Number(d.current.us_aqi); const label=aqiLabel(aqi);
    $("aqiNumber").textContent=Number.isFinite(aqi)?Math.round(aqi):"--"; $("aqiGaugeValue").textContent=Number.isFinite(aqi)?Math.round(aqi):"--"; $("aqiLabel").textContent=label[0]; $("aqiLocation").textContent=currentWeather.name;
    $("pm25").textContent=`${Number(d.current.pm2_5||0).toFixed(1)} µg/m³`; $("pm10").textContent=`${Number(d.current.pm10||0).toFixed(1)} µg/m³`; $("ozone").textContent=`${Number(d.current.ozone||0).toFixed(1)} µg/m³`; $("no2").textContent=`${Number(d.current.nitrogen_dioxide||0).toFixed(1)} µg/m³`; $("aqAdvice").textContent=label[1];
  }catch(e){$("aqiLabel").textContent="Air quality unavailable"; $("aqAdvice").textContent="The air-quality service could not be reached. Please try again.";}
}

async function displayWeather(name,lat,lon,country){
  const data=await fetchWeather(lat,lon);
  currentWeather={name,lat,lon,country,data};
  $("searchMessage").textContent="";
  $("cityName").textContent=`${name}${country ? ", "+country : ""}`;
  $("cityName").dataset.loaded="1";
  const cur=data.current, info=weatherInfo(cur.weather_code);
  $("temperature").textContent=tempText(cur.temperature_2m).replace(`°${getSettings().unit}`,"");
  $("condition").textContent=info[0];
  $("weatherIcon").textContent=info[1];
  $("humidity").textContent=`${cur.relative_humidity_2m}%`;
  $("wind").textContent=`${Math.round(cur.wind_speed_10m)} km/h`;
  $("feels").textContent=tempText(cur.apparent_temperature);
  $("uv").textContent=(data.hourly?.uv_index?.[0] ?? "--");
  const favs=getFavs()[getCurrentUser().id] || [];
  $("favoriteBtn").textContent=favs.some(f=>f.name.toLowerCase()===name.toLowerCase())?"★":"☆";
  renderHourlyForecast(data);
}

function renderHourlyForecast(data){
  const h=data.hourly;
  if(!h?.time?.length){ $("hourlyForecast").innerHTML="<p class='message'>Hourly forecast unavailable.</p>"; return; }
  const groups={};
  h.time.forEach((iso,i)=>{
    const dayKey=iso.slice(0,10);
    (groups[dayKey] ||= []).push(i);
  });
  const days=Object.entries(groups).slice(0,7);
  $("hourlyForecast").innerHTML=days.map(([day,indices],dayIndex)=>{
    const label=new Date(day+"T12:00:00").toLocaleDateString(undefined,{weekday:"long",month:"short",day:"numeric"});
    const rows=indices.map(i=>{
      const dt=new Date(h.time[i]);
      const time=dt.toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"});
      const inf=weatherInfo(h.weather_code[i]);
      const rain=h.precipitation_probability[i] ?? 0;
      const precip=h.precipitation[i] ?? 0;
      const temp=tempText(h.temperature_2m[i]);
      const feels=tempText(h.apparent_temperature[i]);
      const wind=Math.round(h.wind_speed_10m[i]);
      const humidity=h.relative_humidity_2m[i] ?? "--";
      const uv=h.uv_index[i] ?? "--";
      return `<div class="hour-row"><div class="hour-time">${time}</div><div class="hour-condition"><span class="hour-icon">${inf[1]}</span><span>${inf[0]}</span></div><strong>${temp}</strong><span>Feels ${feels}</span><span>💧 ${humidity}%</span><span>☔ ${rain}% · ${Number(precip).toFixed(1)} mm</span><span>💨 ${wind} km/h</span><span>☀️ UV ${typeof uv==='number'?uv.toFixed(1):uv}</span></div>`;
    }).join("");
    return `<details class="hour-day" ${dayIndex===0?"open":""}><summary><span>${dayIndex===0?"Today · ":""}${label}</span><span class="day-range">${data.daily ? `${tempText(data.daily.temperature_2m_min[dayIndex])} / ${tempText(data.daily.temperature_2m_max[dayIndex])}` : ""}</span></summary><div class="hour-table">${rows}</div></details>`;
  }).join("");
}

function temperatureClass(temp){
  if(temp <= -20) return "freezing";
  if(temp <= -5) return "very-cold";
  if(temp <= 5) return "cold";
  if(temp <= 15) return "cool";
  if(temp <= 25) return "mild";
  if(temp <= 32) return "warm";
  if(temp <= 40) return "hot";
  return "extreme";
}

function projectWorldPoint(lat, lon){
  const x = ((lon + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return {x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y))};
}

function escapeAttr(s){
  return String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

async function fetchWorldTemperatures(){
  const lats = WORLD_COUNTRIES.map(c=>c.lat).join(",");
  const lons = WORLD_COUNTRIES.map(c=>c.lon).join(",");
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,weather_code&timezone=auto`;
  const res = await fetch(url);
  if(!res.ok) throw new Error("Global weather service failed");
  const data = await res.json();
  const results = Array.isArray(data) ? data : [data];
  return WORLD_COUNTRIES.map((country,i)=>({
    ...country,
    temperature: Number(results[i]?.current?.temperature_2m),
    weatherCode: results[i]?.current?.weather_code
  })).filter(c=>Number.isFinite(c.temperature));
}

function renderWorldMap(){
  const layer=$("countryHeatLayer");
  if(!worldCountryData.length){
    $("worldMapEmpty").classList.remove("hidden");
    $("worldMapStatus").textContent="No global temperature data available";
    return;
  }
  $("worldMapEmpty").classList.add("hidden");
  layer.innerHTML=worldCountryData.map(c=>{
    const p=projectWorldPoint(c.lat,c.lon);
    const inf=weatherInfo(c.weatherCode);
    return `<button class="country-temp-marker ${temperatureClass(c.temperature)}" style="left:${p.x}%;top:${p.y}%" title="${escapeAttr(c.name)}: ${Math.round(c.temperature)}°C · ${escapeAttr(inf[0])}" aria-label="${escapeAttr(c.name)} ${Math.round(c.temperature)} degrees Celsius"><span>${Math.round(c.temperature)}°</span></button>`;
  }).join("");

  $("countryTemperatureGrid").innerHTML=[...worldCountryData].sort((a,b)=>b.temperature-a.temperature).map(c=>{
    const inf=weatherInfo(c.weatherCode);
    return `<button class="country-temp-card" data-country="${escapeAttr(c.name)}"><span class="country-temp-icon">${inf[1]}</span><span class="country-temp-name">${escapeAttr(c.name)}</span><strong class="${temperatureClass(c.temperature)}">${Math.round(c.temperature)}°C</strong></button>`;
  }).join("");
  $("countryCount").textContent=`${worldCountryData.length} locations`;
  $("worldMapStatus").textContent=`Live temperatures · ${worldCountryData.length} countries & territories`;
  $("worldMapUpdated").textContent=`Updated ${worldMapLastUpdated.toLocaleTimeString([], {hour:"numeric",minute:"2-digit"})}`;
}

async function loadWorldMap(force=false){
  if(worldMapLoading) return;
  if(worldMapLoaded && !force) return;
  worldMapLoading=true;
  $("worldMapStatus").textContent="Loading live temperatures for the world…";
  $("worldMapEmpty").classList.add("hidden");
  try{
    worldCountryData=await fetchWorldTemperatures();
    worldMapLastUpdated=new Date();
    worldMapLoaded=true;
    renderWorldMap();
  }catch(err){
    $("worldMapStatus").textContent="Could not load global temperatures";
    $("worldMapEmpty").classList.remove("hidden");
    showToast("World map weather could not be loaded.");
  }finally{
    worldMapLoading=false;
  }
}

$("refreshWorldMap").onclick=()=>loadWorldMap(true);

$("favoriteBtn").onclick=()=>{
  if(!currentWeather) return;
  const user=getCurrentUser(); const favs=getFavs(); favs[user.id]=favs[user.id]||[];
  const existing=favs[user.id].findIndex(f=>f.name.toLowerCase()===currentWeather.name.toLowerCase());
  if(existing>=0){favs[user.id].splice(existing,1);$("favoriteBtn").textContent="☆";showToast("Removed from favorites.");}
  else{favs[user.id].push({name:currentWeather.name,lat:currentWeather.lat,lon:currentWeather.lon});$("favoriteBtn").textContent="★";showToast("Added to favorites.");}
  saveFavs(favs); updateProfile(user); renderFavorites(); renderAdmin();
};

function renderFavorites(){
  const user=getCurrentUser(); if(!user)return;
  const favs=getFavs()[user.id] || [];
  $("favoritesGrid").innerHTML=favs.length ? favs.map((f,i)=>`<div class="favorite-card"><h3>⭐ ${f.name}</h3><p>Saved city</p><button onclick="openFavorite(${i})">View Weather</button></div>`).join("") : `<div class="favorite-card"><h3>No favorites yet</h3><p>Search a city and press ☆ to save it.</p></div>`;
}
window.openFavorite=async i=>{
  const user=getCurrentUser(), f=(getFavs()[user.id]||[])[i];
  if(f){document.querySelector('[data-section="dashboard"]').click();await displayWeather(f.name,f.lat,f.lon,"");}
};

function renderAdmin(){
  const user=getCurrentUser(); if(!user || user.role!=="admin") return;
  const users=getUsers(), favs=getFavs();
  $("userCount").textContent=users.length;
  $("favoriteCount").textContent=Object.values(favs).reduce((a,b)=>a+(b?.length||0),0);
  $("usersTable").innerHTML=users.map(u=>`<tr><td>${escapeHtml(u.name)}</td><td>${escapeHtml(u.email)}</td><td>${u.role}</td><td>${(favs[u.id]||[]).length}</td><td>${u.role==="admin"?"—":`<button onclick="deleteUser('${u.id}')">Delete</button>`}</td></tr>`).join("");
}
window.deleteUser=id=>{
  const user=getCurrentUser(); if(user?.role!=="admin") return;
  const users=getUsers().filter(u=>u.id!==id); saveUsers(users);
  const favs=getFavs(); delete favs[id]; saveFavs(favs);
  renderAdmin(); showToast("User deleted.");
};
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}

$("refreshAirQuality").onclick=loadAirQuality;
$("refreshInsights").onclick=renderInsights;
$("saveSettings").onclick=()=>{
  saveSettingsData({theme:$("themeSelect").value,unit:$("unitSelect").value,autoRefresh:$("autoRefreshToggle").checked}); applyTheme();
  if(currentWeather){displayWeather(currentWeather.name,currentWeather.lat,currentWeather.lon,currentWeather.country);}
  showToast("Preferences saved.");
};
applyTheme();

const session=getSession();
if(session){const user=getCurrentUser(); if(user) showApp(user); else localStorage.removeItem(SESSION_KEY);}
