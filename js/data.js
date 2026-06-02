// AutoGear product catalog
const PRODUCTS = [
  { id:1, name:"Premium Leather Seat Cover Set", category:"Interior", price:129.99, old:179.99, img:"images/p1.jpg", rating:4.7, reviews:184, tag:"BESTSELLER",
    desc:"Hand-stitched genuine leather seat covers designed for premium comfort and a luxury cabin look. Universal fit for most sedans and SUVs.",
    specs:{Material:"Genuine Leather",Fit:"Universal",Color:"Jet Black",Warranty:"2 Years",Pieces:"9-Piece Set"}},
  { id:2, name:"Forged Alloy Wheel 18\" - Chrome", category:"Wheels", price:289.00, old:349.00, img:"images/p2.jpg", rating:4.8, reviews:96, tag:"NEW",
    desc:"Lightweight forged alloy wheel with multi-spoke chrome finish. Built for performance, balanced, and corrosion resistant.",
    specs:{Diameter:"18 inch",Material:"Forged Aluminium",Finish:"Polished Chrome",Bolt:"5x114.3",Weight:"8.4 kg"}},
  { id:3, name:"LED Headlight Bulbs H4 Pair", category:"Lighting", price:49.99, old:69.99, img:"images/p3.jpg", rating:4.6, reviews:412, tag:"-30%",
    desc:"Ultra-bright 12000 lumen LED headlight bulbs with IP68 waterproof rating. Plug-and-play install in under 10 minutes.",
    specs:{Brightness:"12000 LM",Color:"6500K White",Lifespan:"50000 hrs",Voltage:"9-32V",Warranty:"3 Years"}},
  { id:4, name:"Android 10\" Touchscreen Stereo", category:"Electronics", price:219.00, old:289.00, img:"images/p4.jpg", rating:4.5, reviews:227,
    desc:"Android 13 powered car stereo with CarPlay, Android Auto, GPS navigation, Bluetooth 5.0 and a 10\" capacitive HD touchscreen.",
    specs:{Screen:"10 inch IPS",OS:"Android 13",RAM:"4GB",Storage:"64GB",Connectivity:"WiFi, BT 5.0, GPS"}},
  { id:5, name:"4K Dashcam with Night Vision", category:"Electronics", price:99.99, old:139.99, img:"images/p5.jpg", rating:4.7, reviews:531, tag:"HOT",
    desc:"4K Ultra HD front dashcam with built-in WiFi, Sony Starvis sensor for night vision, G-sensor and 24-hour parking mode.",
    specs:{Resolution:"4K @ 30fps",Sensor:"Sony IMX415",Storage:"Up to 256GB",Features:"WiFi, GPS, Parking Mode",Display:"3 inch IPS"}},
  { id:6, name:"Sport Steering Wheel Cover - Leather", category:"Interior", price:24.99, old:34.99, img:"images/p6.jpg", rating:4.4, reviews:803,
    desc:"Anti-slip perforated leather steering cover with reinforced grip zones. Fits all standard 38cm steering wheels.",
    specs:{Material:"Microfiber Leather",Diameter:"37-38 cm",Fit:"Universal",Color:"Black",Style:"Sport Grip"}},
  { id:7, name:"Roof Cargo Carrier Box 500L", category:"Exterior", price:399.00, old:499.00, img:"images/p7.jpg", rating:4.8, reviews:64, tag:"NEW",
    desc:"500L aerodynamic roof box with dual-side opening and quick-mount clamps. Lockable and waterproof.",
    specs:{Capacity:"500 Liters",Material:"ABS Plastic",Lock:"Yes - 2 Keys",Mount:"Universal Rail",Dimensions:"205 x 84 x 45 cm"}},
  { id:8, name:"All-Weather TPE Floor Mats", category:"Interior", price:79.99, old:99.99, img:"images/p8.jpg", rating:4.9, reviews:1208, tag:"TOP RATED",
    desc:"Custom-fit all-weather TPE floor mats with raised edges to trap dirt, water and snow. Easy to clean.",
    specs:{Material:"TPE Rubber",Fit:"Universal/Custom",Pieces:"4-Piece Set",Color:"Black",Warranty:"Lifetime"}}
];

const CATEGORIES = [
  {name:"Interior",icon:"🛋️",count:42},
  {name:"Exterior",icon:"🚗",count:38},
  {name:"Lighting",icon:"💡",count:54},
  {name:"Electronics",icon:"📱",count:67},
  {name:"Wheels",icon:"⚙️",count:29},
  {name:"Performance",icon:"⚡",count:33},
  {name:"Safety",icon:"🛡️",count:21},
  {name:"Tools",icon:"🔧",count:48}
];
