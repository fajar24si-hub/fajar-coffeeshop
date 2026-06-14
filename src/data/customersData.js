// src/data/customersData.js
// 200 dummy customer data untuk Brewista Coffee Shop

const firstNames = [
  "Siti","Budi","Aulia","Rizky","Mega","Dimas","Nadia","Fajar","Indah","Hendra",
  "Ratna","Andi","Dewi","Bagas","Fika","Gilang","Hani","Irfan","Joko","Karina",
  "Lutfi","Maya","Niko","Opik","Putri","Qori","Reza","Sari","Taufik","Ulfa",
  "Vina","Wahyu","Xena","Yanti","Zaki","Adi","Bella","Citra","Deni","Eka",
  "Fatma","Galih","Hendra","Isna","Jaya","Kiki","Lina","Miko","Nina","Oscar",
  "Pita","Rafi","Siska","Tito","Umar","Vera","Winda","Yogi","Zara","Agus",
  "Bina","Cahya","Dodi","Elsa","Fani","Gani","Hana","Ivan","Jeni","Koko",
  "Laras","Mela","Nanda","Omar","Peni","Rian","Sena","Tari","Ucok","Vira",
  "Wahid","Yudi","Ziana","Arif","Bunga","Cici","Damar","Erma","Fuad","Gita",
  "Haris","Ica","Juna","Kemal","Luki","Mira","Nurul","Oky","Pandu","Qila",
  "Rini","Surya","Tina","Umi","Vandi","Wati","Yara","Zahra","Aldi","Brenda",
  "Candra","Dinda","Eko","Feby","Guntur","Helmi","Icha","Johan","Krisna","Lela",
  "Marno","Nabila","Oki","Putro","Qanita","Rudi","Silvi","Teguh","Ulil","Vivian",
  "Wawan","Yola","Zulfi","Amar","Beni","Celin","Desta","Efri","Firda","Ganda",
  "Hilda","Iqbal","Jihan","Khoir","Liana","Mufid","Novita","Okta","Puja","Ridwan",
  "Sinta","Teddy","Ummu","Vanesa","Wisnu","Yasmin","Zenny","Anis","Bayu","Carla",
  "Danu","Endah","Febrian","Ganda","Hendra","Ilham","Jasmin","Kevin","Lusi","Manda",
  "Nabil","Okky","Prita","Rahma","Sheila","Tama","Uray","Virna","Wulan","Yusuf",
  "Zaki","Agung","Bonita","Caca","Darmaji","Elmi","Fachri","Gisel","Hamid","Intan",
  "Jaki","Karin","Lilis","Mukhlis","Neni","Ova","Permata","Qonita","Rendra","Shesha",
];

const lastNames = [
  "Rahma","Santoso","Fitri","Ardiansyah","Pratiwi","Kurniawan","Husna","Hidayat",
  "Wulandari","Setiawan","Wahyuni","Firmansyah","Cahyani","Nugroho","Ramadhan",
  "Purnomo","Saputra","Dewi","Kusuma","Rahayu","Lestari","Hardianto","Sari",
  "Wijaya","Utama","Handayani","Mulyono","Ningsih","Susanto","Pertiwi",
  "Riyanto","Soekarna","Tanaka","Gunawan","Halim","Iskandar","Jamaludin",
  "Koswara","Lukman","Mariyana","Nasution","Oktaviani","Perdana","Qomariah",
  "Rustam","Sadikin","Tampubolon","Utami","Valentina","Wibowo","Yuliana","Zainudin",
  "Adiputra","Basuki","Cahyono","Darmawan","Erwansyah","Fauziah","Ginanjar",
  "Hermawan","Irawati","Junaedi","Kuncoro","Larasati","Muhajir","Nufus",
  "Octavia","Prayitno","Qodir","Rivai","Simbolon","Taufiqurrahman","Ulhaq",
  "Verdiansyah","Widodo","Yolanda","Zaenuri","Abdurrahman","Budiarto","Caniago",
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start, end) {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString().split("T")[0];
}

function generatePhone() {
  const prefixes = ["0812","0813","0821","0822","0851","0852","0853","0856","0857","0858","0878","0831","0832"];
  const prefix = randFrom(prefixes);
  const mid = String(randInt(1000, 9999));
  const end = String(randInt(1000, 9999));
  return `${prefix}-${mid}-${end}`;
}

// Seed untuk konsistensi - generate sekali
const seed = 42;
let _r = seed;
function seededRand() {
  _r = (_r * 1664525 + 1013904223) & 0xffffffff;
  return ((_r >>> 0) / 4294967296);
}

export const CUSTOMERS = (() => {
  const customers = [];
  const usedNames = new Set();
  const usedEmails = new Set();

  const tiers = ["Bronze", "Silver", "Gold"];
  const tierWeights = [0.5, 0.3, 0.2]; // 50% Bronze, 30% Silver, 20% Gold

  for (let i = 1; i <= 200; i++) {
    // Generate unique name
    let name, attempts = 0;
    do {
      const fn = firstNames[(i * 7 + attempts) % firstNames.length];
      const ln = lastNames[(i * 3 + attempts) % lastNames.length];
      name = `${fn} ${ln}`;
      attempts++;
    } while (usedNames.has(name) && attempts < 20);
    usedNames.add(name);

    // Generate tier based on weights
    const rand = (i * 0.137) % 1;
    let tier;
    if (rand < tierWeights[2]) tier = "Gold";
    else if (rand < tierWeights[2] + tierWeights[1]) tier = "Silver";
    else tier = "Bronze";

    // Generate stats based on tier
    let visits, spent, points;
    if (tier === "Gold") {
      visits = randInt(60, 150);
      spent = randInt(2_500_000, 8_000_000);
      points = randInt(2_500, 6_000);
    } else if (tier === "Silver") {
      visits = randInt(25, 65);
      spent = randInt(900_000, 2_600_000);
      points = randInt(1_000, 2_600);
    } else {
      visits = randInt(3, 28);
      spent = randInt(100_000, 1_000_000);
      points = randInt(80, 1_050);
    }

    const joined = randomDate(new Date("2022-01-01"), new Date("2025-06-01"));
    const lastVisit = randomDate(new Date(joined), new Date("2026-06-10"));

    const firstNamePart = name.split(" ")[0].toLowerCase().replace(/[^a-z]/g, "");
    const lastNamePart = name.split(" ")[1]?.toLowerCase().replace(/[^a-z]/g, "") || "user";
    let email = `${firstNamePart}.${lastNamePart}@email.com`;
    let emailAttempt = 0;
    while (usedEmails.has(email)) {
      emailAttempt++;
      email = `${firstNamePart}.${lastNamePart}${emailAttempt}@email.com`;
    }
    usedEmails.add(email);

    customers.push({
      id: i,
      name,
      email,
      phone: generatePhone(),
      joined,
      visits,
      spent,
      tier,
      points,
      lastVisit,
    });
  }

  return customers;
})();

export const CUSTOMER_MAP = Object.fromEntries(CUSTOMERS.map(c => [c.id, c]));
