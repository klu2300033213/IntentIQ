package com.nexora.config;

import com.nexora.model.Product;
import com.nexora.model.User;
import com.nexora.repository.ProductRepository;
import com.nexora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final List<long[]> EMBED_DIMS = new ArrayList<>();

    @Override
    public void run(String... args) throws Exception {
        // Force re-seed if old generic products exist (name starts with "Pro" or "Ultra" pattern)
        if (productRepository.count() > 0) {
            Product first = productRepository.findAll().stream().findFirst().orElse(null);
            boolean isOldData = first != null && (
                    first.getName().startsWith("Pro ") || first.getName().startsWith("Ultra ") ||
                    first.getName().startsWith("Smart ") || first.getName().startsWith("Ergonomic ") ||
                    first.getName().startsWith("Compact ")
            );
            if (!isOldData) {
                log.info("Database already has real products ({} items). Skipping re-seed.", productRepository.count());
                seedDemoUser();
                return;
            }
            log.info("Detected old generic product data. Clearing and re-seeding with real branded products...");
            productRepository.deleteAll();
        }

        log.info("Seeding Nexora database with 100 real branded products...");
        List<Product> products = buildProducts();
        productRepository.saveAll(products);
        log.info("Successfully seeded {} real branded products!", products.size());
        seedDemoUser();
    }

    private void seedDemoUser() {
        if (userRepository.findByEmailIgnoreCase("aarav.sharma@example.com").isEmpty()) {
            User demo = User.builder()
                    .name("Aarav Sharma")
                    .email("aarav.sharma@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .tasteProfile("{\"Tech enthusiast\":88,\"Active lifestyle\":72,\"Minimal style\":65}")
                    .consentDpdp(true)
                    .build();
            userRepository.save(demo);
            log.info("Demo user created: aarav.sharma@example.com / password123");
        }
    }

    private List<Product> buildProducts() {
        // Image URLs by category
        String IMG_IPHONE    = "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80";
        String IMG_SAMSUNG   = "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80";
        String IMG_HEADPHONE = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80";
        String IMG_EARBUDS   = "https://images.unsplash.com/photo-1590658165737-15a047b7f8f9?auto=format&fit=crop&w=800&q=80";
        String IMG_LAPTOP    = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80";
        String IMG_SPEAKER   = "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80";
        String IMG_CAMERA    = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80";
        String IMG_TV        = "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80";
        String IMG_TABLET    = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80";
        String IMG_SMARTWATCH= "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80";
        String IMG_VACUUM    = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80";
        String IMG_AIRFRYER  = "https://images.unsplash.com/photo-1648195699348-38dc3e4d3a01?auto=format&fit=crop&w=800&q=80";
        String IMG_NIKE      = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80";
        String IMG_WHITE_SN  = "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80";
        String IMG_ADIDAS    = "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=800&q=80";
        String IMG_FORMAL    = "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80";
        String IMG_RUNNING   = "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80";
        String IMG_TSHIRT    = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80";
        String IMG_JEANS     = "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80";
        String IMG_DRESS     = "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80";
        String IMG_HOODIE    = "https://images.unsplash.com/photo-1556821840-3a63f15732ce?auto=format&fit=crop&w=800&q=80";
        String IMG_SHIRT     = "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80";
        String IMG_KURTA     = "https://images.unsplash.com/photo-1583391733956-62e7b69eff35?auto=format&fit=crop&w=800&q=80";
        String IMG_BLAZER    = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80";
        String IMG_WATCH     = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";
        String IMG_WATCHLUX  = "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80";
        String IMG_WATCHG    = "https://images.unsplash.com/photo-1548171915-e79a6a2f3d96?auto=format&fit=crop&w=800&q=80";
        String IMG_SKINCARE  = "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=800&q=80";
        String IMG_MOISTURE  = "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80";
        String IMG_LIPSTICK  = "https://images.unsplash.com/photo-1586495777744-4e6232bf2e17?auto=format&fit=crop&w=800&q=80";
        String IMG_SHAMPOO   = "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80";
        String IMG_PERFUME   = "https://images.unsplash.com/photo-1541643600914-78b084683702?auto=format&fit=crop&w=800&q=80";
        String IMG_SUNSCREEN = "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80";
        String IMG_YOGAMAT   = "https://images.unsplash.com/photo-1601925228548-bf9c2a77e5ef?auto=format&fit=crop&w=800&q=80";
        String IMG_DUMBBELL  = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80";
        String IMG_SUNGLASS  = "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80";
        String IMG_BACKPACK  = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80";
        String IMG_WALLET    = "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80";
        String IMG_SLINGBAG  = "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80";
        String IMG_COOKWARE  = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80";
        String IMG_OVEN      = "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80";
        String IMG_BOOK1     = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80";
        String IMG_BOOK2     = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80";
        String IMG_BOOK3     = "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80";

        List<Product> list = new ArrayList<>();

        // ── Electronics (20) ──
        list.add(p(1,  "Apple iPhone 15 Pro", "Apple", "Electronics", 134900, 139900, 4,  4.8, 8240,  99, IMG_IPHONE,   "Apple iPhone 15 Pro — 48MP Main Camera, A17 Pro Chip, Titanium Design, Action Button, USB-C with USB 3.", "Free delivery by tomorrow"));
        list.add(p(2,  "Samsung Galaxy S24 Ultra", "Samsung", "Electronics", 124999, 134999, 7, 4.7, 6120, 98, IMG_SAMSUNG, "Samsung Galaxy S24 Ultra — 200MP Camera, S Pen, Snapdragon 8 Gen 3, 12GB RAM, 5000mAh battery.", "Free delivery by tomorrow"));
        list.add(p(3,  "OnePlus 12 5G", "OnePlus", "Electronics", 64999, 69999, 7, 4.6, 4830, 96, IMG_SAMSUNG, "OnePlus 12 — Snapdragon 8 Gen 3, 50MP Hasselblad camera, 100W SUPERVOOC charging, 5400mAh.", "Free Express delivery in 24hrs"));
        list.add(p(4,  "Realme GT 6 5G", "Realme", "Electronics", 39999, 44999, 11, 4.5, 3210, 94, IMG_SAMSUNG, "Realme GT 6 — Snapdragon 8s Gen 3, 6.78 AMOLED 120Hz, 5500mAh + 120W charging, IP65.", "Free delivery by tomorrow"));
        list.add(p(5,  "Sony WH-1000XM5 Headphones", "Sony", "Electronics", 24990, 34990, 29, 4.8, 12890, 99, IMG_HEADPHONE, "Industry-leading noise cancellation, 30H battery, multipoint connection, hands-free calling.", "Free delivery by tomorrow"));
        list.add(p(6,  "boAt Airdopes 141 TWS Earbuds", "boAt", "Electronics", 1299, 2990, 57, 4.1, 45210, 88, IMG_EARBUDS, "boAt Airdopes 141 — ENx Technology, 42H Playback, Beast Mode low latency, IPX4 water resistance.", "Free delivery by tomorrow"));
        list.add(p(7,  "JBL Flip 6 Bluetooth Speaker", "JBL", "Electronics", 8999, 11999, 25, 4.6, 9870, 95, IMG_SPEAKER, "JBL Flip 6 — Stereo sound with 2 JBL drivers, IP67 waterproof, 12H battery, PartyBoost.", "Free delivery by tomorrow"));
        list.add(p(8,  "Apple MacBook Air M2", "Apple", "Electronics", 114900, 119900, 4, 4.9, 5640, 99, IMG_LAPTOP, "MacBook Air M2 — 13.6 Liquid Retina, 8-core CPU, 10-core GPU, 18-hour battery.", "Free delivery by tomorrow"));
        list.add(p(9,  "Dell Inspiron 15 Laptop", "Dell", "Electronics", 52990, 62990, 16, 4.3, 3140, 91, IMG_LAPTOP, "Dell Inspiron 15 — Intel Core i5-1335U, 16GB RAM, 512GB SSD, 15.6 FHD, Windows 11 Home.", "Free Express delivery in 24hrs"));
        list.add(p(10, "Sony Alpha ZV-E10 Camera", "Sony", "Electronics", 61490, 72990, 16, 4.7, 2890, 96, IMG_CAMERA, "Sony ZV-E10 Mirrorless — APS-C sensor, 4K video, detachable 16-50mm lens, creator-friendly.", "Free delivery by tomorrow"));
        list.add(p(11, "Samsung 55 4K QLED Smart TV", "Samsung", "Electronics", 89990, 109990, 18, 4.6, 4230, 95, IMG_TV, "Samsung QLED TV — Quantum HDR, Tizen OS, built-in Alexa, Game Mode, Auto Low Latency.", "Free delivery in 3-4 days"));
        list.add(p(12, "Apple iPad Pro M2 11-inch", "Apple", "Electronics", 99900, 109900, 9, 4.8, 3890, 98, IMG_TABLET, "iPad Pro M2 — Liquid Retina XDR, ProMotion 120Hz, Thunderbolt/USB 4, Apple Pencil 2.", "Free delivery by tomorrow"));
        list.add(p(13, "Samsung Galaxy Tab S9 FE", "Samsung", "Electronics", 39999, 45999, 13, 4.5, 2140, 93, IMG_TABLET, "Galaxy Tab S9 FE — Exynos 1380, 10.9 LCD, S Pen included, IP68, 8000mAh battery.", "Free Express delivery in 24hrs"));
        list.add(p(14, "Dyson V12 Detect Slim Vacuum", "Dyson", "Electronics", 44900, 52900, 15, 4.6, 1890, 94, IMG_VACUUM, "Dyson V12 Detect Slim — Laser Detect reveals invisible dust, HEPA filtration, 60-min battery.", "Free delivery in 3-4 days"));
        list.add(p(15, "Philips XXL Air Fryer HD9860", "Philips", "Electronics", 12999, 17999, 28, 4.5, 8970, 92, IMG_AIRFRYER, "Philips XXL Air Fryer — Rapid Air Technology, 7L capacity, 12 presets, 90% less fat.", "Free delivery by tomorrow"));
        list.add(p(16, "Noise ColorFit Pro 5 Smartwatch", "Noise", "Electronics", 3999, 7999, 50, 4.2, 21450, 89, IMG_SMARTWATCH, "Noise ColorFit Pro 5 — 1.46 AMOLED, BT Calling, 100+ sports, SpO2, Heart Rate, 7-day battery.", "Free delivery by tomorrow"));
        list.add(p(17, "boAt Wave Flex Connect Smartwatch", "boAt", "Electronics", 1799, 3999, 55, 4.0, 32100, 86, IMG_SMARTWATCH, "boAt Wave Flex — 1.83 HD Display, BT v5.3, Multiple Watch Faces, Health Suite, 7-day battery.", "Free delivery by tomorrow"));
        list.add(p(18, "Canon EOS M50 Mark II", "Canon", "Electronics", 64995, 74995, 13, 4.7, 1780, 95, IMG_CAMERA, "Canon EOS M50 Mark II — 24.1MP APS-C CMOS, 4K video, Eye Detection AF, Live Streaming.", "Free delivery in 3-4 days"));
        list.add(p(19, "LG 43 Full HD Smart WebOS TV", "LG", "Electronics", 29990, 37990, 21, 4.4, 5680, 91, IMG_TV, "LG Full HD Smart TV — webOS 6.0, ThinQ AI, built-in Alexa, Magic Remote, Filmmaker Mode.", "Free delivery in 3-4 days"));
        list.add(p(20, "Xiaomi 14 Ultra 5G", "Xiaomi", "Electronics", 89999, 99999, 10, 4.6, 2340, 96, IMG_IPHONE, "Xiaomi 14 Ultra — Snapdragon 8 Gen 3, Leica Quad Camera, 90W HyperCharge, IP68.", "Free delivery by tomorrow"));

        // ── Footwear (12) ──
        list.add(p(21, "Nike Air Max 270",          "Nike",          "Footwear", 9995,  12995, 23, 4.6, 14320, 96, IMG_NIKE,    "Nike Air Max 270 — Max Air unit in heel for unrivaled comfort, lightweight mesh upper.", "Free delivery by tomorrow"));
        list.add(p(22, "Adidas Ultraboost 23",       "Adidas",        "Footwear", 12999, 17999, 28, 4.7, 9870,  97, IMG_ADIDAS,  "Adidas Ultraboost 23 — BOOST midsole, Primeknit upper, Continental rubber outsole.", "Free delivery by tomorrow"));
        list.add(p(23, "Puma RS-X Puzzle Sneakers",  "Puma",          "Footwear", 6499,  8999,  28, 4.4, 5430,  92, IMG_WHITE_SN,"Puma RS-X — Chunky sole, mesh upper with leather overlays, retro running style.", "Free delivery by tomorrow"));
        list.add(p(24, "Nike Air Force 1 07",        "Nike",          "Footwear", 7495,  8495,  12, 4.8, 23450, 98, IMG_WHITE_SN,"Nike Air Force 1 — Classic low cut, durable leather, Nike Air cushioning, iconic silhouette.", "Free Express delivery in 24hrs"));
        list.add(p(25, "Adidas Samba OG",            "Adidas",        "Footwear", 9999,  11999, 17, 4.7, 12100, 97, IMG_ADIDAS,  "Adidas Samba OG — Heritage indoor soccer, suede upper, gum rubber outsole, T-toe overlay.", "Free delivery by tomorrow"));
        list.add(p(26, "New Balance 574 Classic",    "New Balance",   "Footwear", 7999,  9999,  20, 4.6, 7890,  94, IMG_WHITE_SN,"New Balance 574 — ENCAP midsole, suede/mesh upper, heritage running inspired design.", "Free delivery by tomorrow"));
        list.add(p(27, "Reebok Classic Leather",     "Reebok",        "Footwear", 5999,  7999,  25, 4.5, 6540,  93, IMG_WHITE_SN,"Reebok Classic Leather — Vintage running design, full-grain leather upper, memory foam.", "Free delivery by tomorrow"));
        list.add(p(28, "Nike React Infinity Run 4",  "Nike",          "Footwear", 10995, 13995, 21, 4.7, 4320,  96, IMG_RUNNING, "Nike React Infinity Run 4 — Reduce injury risk. React foam + wider base for stability.", "Free delivery by tomorrow"));
        list.add(p(29, "Adidas Gazelle Indoor",      "Adidas",        "Footwear", 8999,  10999, 18, 4.6, 8760,  95, IMG_ADIDAS,  "Adidas Gazelle Indoor — Suede upper, T-toe overlay, gum rubber outsole, gold details.", "Free delivery by tomorrow"));
        list.add(p(30, "Woodland Trekking Shoes",    "Woodland",      "Footwear", 3799,  5499,  31, 4.3, 11200, 88, IMG_FORMAL,  "Woodland Trekking Shoes — Full-grain waterproof leather, dual-density rubber outsole.", "Free Express delivery in 24hrs"));
        list.add(p(31, "Crocs Classic Clogs",        "Crocs",         "Footwear", 3995,  4995,  20, 4.3, 28900, 87, IMG_WHITE_SN,"Crocs Classic Clogs — Lightweight Croslite foam, ventilation ports, easy to clean.", "Free delivery by tomorrow"));
        list.add(p(32, "Under Armour HOVR Phantom 3","Under Armour",  "Footwear", 11999, 14999, 20, 4.5, 3210,  93, IMG_RUNNING, "UA HOVR Phantom 3 — HOVR foam, connected MapMyRun app, engineered mesh upper.", "Free delivery by tomorrow"));

        // ── Fashion (15) ──
        list.add(p(33, "Levis 511 Slim Fit Jeans",      "Levis",         "Fashion", 2999,  4299,  30, 4.5, 34500, 94, IMG_JEANS,   "Levi's 511 Slim — Sits at waist, tapers hip to ankle, Flex Denim for comfort.", "Free delivery by tomorrow"));
        list.add(p(34, "HnM Oversized Fleece Hoodie",   "H&M",           "Fashion", 1999,  2999,  33, 4.2, 12300, 88, IMG_HOODIE,  "H&M Oversized Hoodie — Soft fleece, kangaroo pocket, dropped shoulders, ribbed cuffs.", "Free delivery by tomorrow"));
        list.add(p(35, "Zara Floral Midi Dress",         "Zara",          "Fashion", 3990,  5990,  33, 4.4, 8910,  92, IMG_DRESS,   "Zara Floral Midi Dress — V-neckline, puff sleeves, floral print, A-line cut, viscose.", "Free Express delivery in 24hrs"));
        list.add(p(36, "Tommy Hilfiger Polo T-Shirt",    "Tommy Hilfiger","Fashion", 2499,  3499,  29, 4.5, 19870, 93, IMG_TSHIRT,  "Tommy Hilfiger Classic Polo — 100% pique cotton, ribbed collar, signature flag logo.", "Free delivery by tomorrow"));
        list.add(p(37, "Van Heusen Formal Shirt",        "Van Heusen",    "Fashion", 1599,  2499,  36, 4.3, 22100, 90, IMG_SHIRT,   "Van Heusen Flex Formal — Stretchable fabric, regular fit, chest pocket, full placket.", "Free delivery by tomorrow"));
        list.add(p(38, "ONLY Womens Blazer",             "ONLY",          "Fashion", 2999,  4499,  33, 4.4, 7320,  91, IMG_BLAZER,  "ONLY Slim Blazer — Notched lapels, two-button, dual vent, welt pockets, fully lined.", "Free Express delivery in 24hrs"));
        list.add(p(39, "US Polo Classic T-Shirt",        "US Polo",       "Fashion", 999,   1499,  33, 4.2, 41200, 87, IMG_TSHIRT,  "U.S. Polo Assn. Tee — 100% Cotton, crew neck, regular fit, embroidered pony logo.", "Free delivery by tomorrow"));
        list.add(p(40, "W Womens Kurta Set",             "W",             "Fashion", 1799,  2699,  33, 4.5, 15670, 92, IMG_KURTA,   "W Cotton Kurta Set — A-line kurta with palazzo pants, printed dupatta, comfortable cotton.", "Free delivery by tomorrow"));
        list.add(p(41, "Biba Embroidered Salwar Suit",   "Biba",          "Fashion", 2499,  3799,  34, 4.6, 18900, 93, IMG_KURTA,   "Biba Cotton Anarkali Suit — Embroidered detailing, flared silhouette, dupatta included.", "Free delivery by tomorrow"));
        list.add(p(42, "FabIndia Handwoven Linen Kurta", "FabIndia",      "Fashion", 1899,  2799,  32, 4.5, 9870,  91, IMG_KURTA,   "FabIndia Linen Kurta — Handwoven pure linen, pintuck detailing, mandarin collar.", "Free delivery by tomorrow"));
        list.add(p(43, "Nike Dri-FIT Training T-Shirt",  "Nike",          "Fashion", 1495,  1995,  25, 4.4, 28700, 93, IMG_TSHIRT,  "Nike Dri-FIT Tee — Sweat-wicking, breathable mesh, regular fit, graphic print.", "Free delivery by tomorrow"));
        list.add(p(44, "Puma ESS Logo Hoodie",           "Puma",          "Fashion", 2995,  4195,  29, 4.3, 12300, 90, IMG_HOODIE,  "Puma ESS Logo Hoodie — Cotton blend fleece, kangaroo pocket, embossed PUMA Cat logo.", "Free delivery by tomorrow"));
        list.add(p(45, "Mango Satin Blouse",             "Mango",         "Fashion", 2790,  3990,  30, 4.3, 6780,  89, IMG_SHIRT,   "Mango Satin Blouse — V-neckline, balloon sleeves, straight cut, buttoned back closure.", "Free Express delivery in 24hrs"));
        list.add(p(46, "Roadster Slim Fit Joggers",      "Roadster",      "Fashion", 1199,  1799,  33, 4.1, 19800, 86, IMG_JEANS,   "Roadster Slim Joggers — Cotton blend, elasticised waistband with drawstring, side pockets.", "Free delivery by tomorrow"));
        list.add(p(47, "Raymond Complete Suit Set",      "Raymond",       "Fashion", 12999, 19999, 35, 4.7, 5670,  95, IMG_BLAZER,  "Raymond Suit — Pure wool blend, notch lapel, twin-vent jacket, flat-front trousers.", "Free delivery in 3-4 days"));

        // ── Watches (8) ──
        list.add(p(48, "Titan Raga Diamond Watch",      "Titan",   "Watches", 6995,  9995,  30, 4.6, 8920,  93, IMG_WATCH,     "Titan Raga — Premium quartz, mineral glass, sapphire coating, water resistant 30m.", "Free delivery by tomorrow"));
        list.add(p(49, "Fossil Gen 6 Smartwatch 44mm",  "Fossil",  "Watches", 17995, 22995, 22, 4.5, 4230,  93, IMG_SMARTWATCH,"Fossil Gen 6 — Wear OS, Snapdragon Wear 4100+, heart rate, SpO2, GPS, 24H battery.", "Free delivery by tomorrow"));
        list.add(p(50, "Casio G-Shock GA-2100",         "Casio",   "Watches", 9995,  12995, 23, 4.7, 11200, 95, IMG_WATCHG,    "Casio G-Shock GA-2100 — Carbon Core Guard, Shock Resistant, 200m water resistance.", "Free Express delivery in 24hrs"));
        list.add(p(51, "Fastrack Analog Watch",         "Fastrack", "Watches", 1995,  2995,  33, 4.2, 23400, 87, IMG_WATCH,     "Fastrack Analog — Stainless steel case, genuine leather strap, 30m water resistance.", "Free delivery by tomorrow"));
        list.add(p(52, "Apple Watch SE 2 44mm",         "Apple",   "Watches", 29900, 32900, 9,  4.7, 7890,  97, IMG_SMARTWATCH,"Apple Watch SE 2 — Crash Detection, Emergency SOS, Heart Rate, 50m water resistant.", "Free delivery by tomorrow"));
        list.add(p(53, "Samsung Galaxy Watch 6 44mm",   "Samsung", "Watches", 26999, 31999, 16, 4.6, 5670,  95, IMG_SMARTWATCH,"Samsung Galaxy Watch 6 — BioActive Sensor, Body Composition, BP, ECG, Sleep Coaching.", "Free delivery by tomorrow"));
        list.add(p(54, "Garmin Venu 2 Plus Smartwatch", "Garmin",  "Watches", 34990, 39990, 13, 4.7, 2340,  96, IMG_SMARTWATCH,"Garmin Venu 2 Plus — AMOLED, BT calls, animated workouts, 9-day battery.", "Free delivery in 3-4 days"));
        list.add(p(55, "Timex Expedition Scout Watch",  "Timex",   "Watches", 3995,  5995,  33, 4.4, 13400, 89, IMG_WATCH,     "Timex Expedition — INDIGLO night-light, fabric strap, date display, 50m water resistance.", "Free delivery by tomorrow"));

        // ── Beauty & Care (12) ──
        list.add(p(56, "LOreal Revitalift Serum",        "LOreal",         "Beauty & Care", 899,  1299, 31, 4.4, 32100, 91, IMG_MOISTURE,"L'Oreal Revitalift 1.5% Hyaluronic Acid Serum — Plumps skin, reduces wrinkles.", "Free delivery by tomorrow"));
        list.add(p(57, "Nivea Soft Moisturizing Cream",  "Nivea",          "Beauty & Care", 259,  399,  35, 4.5, 78900, 89, IMG_MOISTURE,"Nivea Soft — Jojoba oil, Vitamin E, instantly absorbs, leaves skin soft and fresh.", "Free delivery by tomorrow"));
        list.add(p(58, "The Body Shop Tea Tree Toner",   "The Body Shop",  "Beauty & Care", 1695, 2395, 29, 4.5, 12300, 92, IMG_SKINCARE,"TBS Tea Tree Toner — 100% natural, purifies oily skin, minimizes pores, vegan.", "Free delivery by tomorrow"));
        list.add(p(59, "Maybelline Fit Me Foundation",   "Maybelline",     "Beauty & Care", 449,  649,  31, 4.3, 45670, 90, IMG_LIPSTICK,"Maybelline Fit Me Matte+Poreless — 30 shades, pore-blurring, normal to oily skin.", "Free delivery by tomorrow"));
        list.add(p(60, "MAC Matte Lipstick",             "MAC",            "Beauty & Care", 1900, 2400, 21, 4.6, 19870, 94, IMG_LIPSTICK,"M.A.C Matte Lipstick — Amplified pigment, creamy formula, hyaluronic acid, 90+ shades.", "Free Express delivery in 24hrs"));
        list.add(p(61, "Dove Nutritive Therapy Shampoo", "Dove",           "Beauty & Care", 399,  545,  27, 4.4, 56700, 88, IMG_SHAMPOO, "Dove Hair Therapy — Keratin Tri-Silk Serum, repairs 10 layers deep, sulfate-free.", "Free delivery by tomorrow"));
        list.add(p(62, "Forest Essentials Face Wash",    "Forest Essentials","Beauty & Care",595, 795,  25, 4.6, 8760,  92, IMG_SKINCARE,"Forest Essentials Kashmiri Saffron Face Wash — Pure Ayurvedic, brightening, gentle.", "Free delivery by tomorrow"));
        list.add(p(63, "Plum Vitamin C Sunscreen SPF50", "Plum",           "Beauty & Care", 549,  799,  31, 4.5, 23400, 91, IMG_SUNSCREEN,"Plum Vitamin C Sunscreen SPF 50 PA++++ — No white cast, 3% Niacinamide, vegan.", "Free delivery by tomorrow"));
        list.add(p(64, "Lakme Absolute Kajal",           "Lakme",          "Beauty & Care", 349,  499,  30, 4.3, 67800, 87, IMG_LIPSTICK,"Lakme Absolute Kajal — Super Black, 16hrs long-lasting, smudge-proof, ophthalmologist tested.", "Free delivery by tomorrow"));
        list.add(p(65, "Biotique Bio Walnut Scrub",       "Biotique",       "Beauty & Care", 199,  299,  33, 4.2, 34500, 85, IMG_SKINCARE,"Biotique Bio Walnut Scrub — Natural walnut shells, deep exfoliation, reveals healthy glow.", "Free delivery by tomorrow"));
        list.add(p(66, "Himalaya Neem Face Pack",         "Himalaya",       "Beauty & Care", 135,  199,  32, 4.3, 89200, 84, IMG_SKINCARE,"Himalaya Neem Face Pack — Purifies oily skin, reduces pimples, Neem + Turmeric blend.", "Free delivery by tomorrow"));
        list.add(p(67, "Engage Femme Perfume 150ml",      "Engage",         "Beauty & Care", 249,  399,  38, 4.2, 43200, 86, IMG_PERFUME, "Engage Femme — Floral & fruity fragrance, long-lasting 8hrs, suitable for daily use.", "Free delivery by tomorrow"));

        // ── Sports (8) ──
        list.add(p(68, "Decathlon Trocellen Yoga Mat",       "Decathlon", "Sports", 1499, 1999, 25, 4.4, 23400, 90, IMG_YOGAMAT,  "Decathlon Trocellen Yoga Mat 10mm — Extra thick, non-slip surface, eco-friendly EVA foam.", "Free delivery by tomorrow"));
        list.add(p(69, "Strauss Adjustable Dumbbell 10kg",   "Strauss",   "Sports", 1299, 1899, 32, 4.3, 12100, 88, IMG_DUMBBELL, "Strauss Adjustable Dumbbell — Steel construction, vinyl coated, anti-roll flat edges.", "Free delivery by tomorrow"));
        list.add(p(70, "Yonex Muscle Power 3 Badminton",     "Yonex",     "Sports", 1990, 2990, 33, 4.5, 9870,  91, IMG_DUMBBELL, "Yonex MP-3 — Isometric head shape, aluminum alloy frame, full cover included.", "Free delivery by tomorrow"));
        list.add(p(71, "Cosco Rapid Cricket Bat English Willow", "Cosco", "Sports", 1299, 1999, 35, 4.2, 7650, 87, IMG_DUMBBELL, "Cosco Rapid Bat — English Willow, full size, cane handle, string grip, leather ball.", "Free delivery by tomorrow"));
        list.add(p(72, "Boldfit Gym Gloves Pro",             "Boldfit",   "Sports", 499,  999,  50, 4.2, 34500, 85, IMG_DUMBBELL, "Boldfit Gym Gloves — Anti-slip palm, wrist support, neoprene padding, breathable mesh.", "Free delivery by tomorrow"));
        list.add(p(73, "Nivia Storm Football Size 5",        "Nivia",     "Sports", 899,  1299, 31, 4.3, 18900, 87, IMG_DUMBBELL, "Nivia Storm Football — 32-panel design, machine-stitched, butyl bladder, all weather.", "Free delivery by tomorrow"));
        list.add(p(74, "Adidas Core 18 Training Bag",        "Adidas",    "Sports", 2499, 3499, 29, 4.5, 8760,  92, IMG_BACKPACK, "Adidas Core 18 Bag — 26L capacity, padded shoulder straps, side mesh pockets.", "Free delivery by tomorrow"));
        list.add(p(75, "Nike Metcon 8 Training Shoes",       "Nike",      "Sports", 11495,13995, 18, 4.6, 4320,  95, IMG_RUNNING,  "Nike Metcon 8 — Flat wide heel for heavy lifts, Hyperlift plate, flexible forefoot.", "Free delivery by tomorrow"));

        // ── Accessories (10) ──
        list.add(p(76, "Ray-Ban Aviator Classic RB3025", "Ray-Ban",           "Accessories", 6990, 9990,  30, 4.7, 23400, 96, IMG_SUNGLASS,"Ray-Ban Aviator Classic — Crystal lenses, gold metal frame, G-15 UV400 protection.", "Free delivery by tomorrow"));
        list.add(p(77, "Fastrack Polarized Sunglasses",  "Fastrack",          "Accessories", 1495, 2295,  35, 4.3, 18700, 88, IMG_SUNGLASS,"Fastrack Polarized — UV400, anti-reflective coating, lightweight polycarbonate frame.", "Free delivery by tomorrow"));
        list.add(p(78, "Wildcraft Trailblazer Rucksack", "Wildcraft",         "Accessories", 2999, 4499,  33, 4.4, 12100, 91, IMG_BACKPACK,"Wildcraft Rucksack 45L — Padded shoulder straps, laptop compartment, rain cover.", "Free delivery by tomorrow"));
        list.add(p(79, "American Tourister 30L Backpack","American Tourister", "Accessories", 1999, 2999,  33, 4.3, 23400, 90, IMG_BACKPACK,"American Tourister NXT — 30L, laptop sleeve, USB port, organised compartments.", "Free Express delivery in 24hrs"));
        list.add(p(80, "Hidesign Genuine Leather Wallet","Hidesign",          "Accessories", 1895, 2695,  30, 4.6, 9870,  93, IMG_WALLET, "Hidesign Slim Wallet — Full-grain vegetable-tanned leather, 4 card slots, coin pocket.", "Free delivery by tomorrow"));
        list.add(p(81, "Baggit Womens Sling Bag",        "Baggit",            "Accessories", 1599, 2399,  33, 4.4, 12300, 91, IMG_SLINGBAG,"Baggit Sling Bag — Vegan leather, structured silhouette, 2 compartments, gold hardware.", "Free delivery by tomorrow"));
        list.add(p(82, "Milton Thermosteel Flask 1L",    "Milton",            "Accessories", 699,  1199,  42, 4.5, 45600, 89, IMG_WALLET, "Milton Thermosteel Flask — 1L, keeps hot 24hrs / cold 18hrs, leak-proof, SS interior.", "Free delivery by tomorrow"));
        list.add(p(83, "Fossil Leather Card Holder",     "Fossil",            "Accessories", 2495, 3495,  29, 4.5, 7890,  92, IMG_WALLET, "Fossil Card Holder — Genuine Leather, 8 card slots, slim profile, RFID blocking.", "Free delivery by tomorrow"));
        list.add(p(84, "Portronics Wireless Charging Pad","Portronics",       "Accessories", 999,  1799,  44, 4.2, 14300, 87, IMG_TABLET, "Portronics 15W Wireless Pad — Supports all Qi devices, LED indicator, anti-slip base.", "Free delivery by tomorrow"));
        list.add(p(85, "Skybags Brat Trolley 55cm",      "Skybags",           "Accessories", 3499, 5999,  42, 4.4, 9870,  90, IMG_BACKPACK,"Skybags Brat Cabin Trolley — TSA lock, 360 spinner wheels, USB port, expandable.", "Free delivery in 3-4 days"));

        // ── Kitchen (8) ──
        list.add(p(86, "Prestige Omega Deluxe Kadai 3L",   "Prestige",    "Kitchen", 1299, 1999, 35, 4.5, 34500, 90, IMG_COOKWARE,"Prestige Omega Kadai — Induction-friendly, non-stick coating, cool-touch handles, glass lid.", "Free delivery by tomorrow"));
        list.add(p(87, "Hawkins Contura Pressure Cooker 3L","Hawkins",     "Kitchen", 2295, 2995, 23, 4.7, 23400, 93, IMG_COOKWARE,"Hawkins Contura — Hard anodised aluminum, superior sealing, meticulously tested safety.", "Free delivery by tomorrow"));
        list.add(p(88, "Borosil Vision Classic Casserole", "Borosil",     "Kitchen", 699,  1099, 36, 4.4, 18900, 89, IMG_COOKWARE,"Borosil Vision Glass Casserole — Borosilicate glass, microwave safe, dishwasher safe.", "Free delivery by tomorrow"));
        list.add(p(89, "Inalsa Nutri-Blend Blender",        "Inalsa",     "Kitchen", 3499, 4999, 30, 4.3, 12100, 88, IMG_OVEN,    "Inalsa Nutri-Blend — 600W motor, 4 blade, 2 BPA-free jars, nutrient extraction.", "Free delivery by tomorrow"));
        list.add(p(90, "Wonderchef Granite Cookware Set",   "Wonderchef", "Kitchen", 3799, 5999, 37, 4.5, 9870,  91, IMG_COOKWARE,"Wonderchef Granite 3-Piece — PFOA-free granite coating, induction compatible.", "Free delivery in 3-4 days"));
        list.add(p(91, "Morphy Richards 52L OTG Oven",      "Morphy Richards","Kitchen",5999,8999,33, 4.4, 7650,  90, IMG_OVEN,    "Morphy Richards OTG — 52L, 3 heating elements, motorised rotisserie, convection mode.", "Free delivery in 3-4 days"));
        list.add(p(92, "Pigeon Induction Cooktop 1800W",    "Pigeon",     "Kitchen", 1799, 2799, 36, 4.3, 45600, 87, IMG_OVEN,    "Pigeon Induction Cooktop — 1800W, 7 preset menus, auto shutoff, child safety lock.", "Free delivery by tomorrow"));
        list.add(p(93, "Cello Stainless Steel Dinner Set",  "Cello",      "Kitchen", 1999, 3499, 43, 4.4, 23400, 88, IMG_COOKWARE,"Cello SS Dinner Set — 18 pieces, food-grade SS, mirror finish, rust-proof, dishwasher safe.", "Free delivery by tomorrow"));

        // ── Books (7) ──
        list.add(p(94,  "Atomic Habits by James Clear",       "Penguin",         "Books", 399, 599, 33, 4.9, 234000, 99, IMG_BOOK1,"Atomic Habits — Easy & Proven way to Build Good Habits & Break Bad Ones. #1 NYT bestseller.", "Free delivery by tomorrow"));
        list.add(p(95,  "Rich Dad Poor Dad by Kiyosaki",      "Warner Books",    "Books", 299, 449, 33, 4.7, 189000, 97, IMG_BOOK2,"Rich Dad Poor Dad — What the Rich Teach Their Kids About Money. International bestseller.", "Free delivery by tomorrow"));
        list.add(p(96,  "The Alchemist by Paulo Coelho",      "HarperCollins",   "Books", 199, 299, 33, 4.8, 312000, 98, IMG_BOOK3,"The Alchemist — Magical story about following your dreams. 65 million copies sold.", "Free delivery by tomorrow"));
        list.add(p(97,  "Sapiens by Yuval Noah Harari",       "Harper Perennial","Books", 499, 799, 38, 4.8, 156000, 98, IMG_BOOK1,"Sapiens: A Brief History of Humankind — Stone Age to the 21st century. International bestseller.", "Free delivery by tomorrow"));
        list.add(p(98,  "Zero to One by Peter Thiel",         "Crown Business",  "Books", 349, 549, 36, 4.6, 78900,  95, IMG_BOOK2,"Zero to One — Notes on Startups, How to Build the Future. Peter Thiel's Stanford class.", "Free delivery by tomorrow"));
        list.add(p(99,  "The Psychology of Money by Housel",  "Jaico",           "Books", 449, 699, 36, 4.8, 98700,  97, IMG_BOOK3,"The Psychology of Money — Timeless lessons on wealth, greed, and happiness.", "Free delivery by tomorrow"));
        list.add(p(100, "Think and Grow Rich by Napoleon Hill","Fingerprint",     "Books", 249, 399, 38, 4.6, 123000, 95, IMG_BOOK1,"Think and Grow Rich — Landmark bestseller on success and wealth, updated for 21st century.", "Free delivery by tomorrow"));

        return list;
    }

    private Product p(long id, String name, String brand, String category,
                      double price, double oldPrice, int discount,
                      double rating, int reviews, int aiScore,
                      String image, String description, String delivery) {
        int idx = (int)(id - 1);
        List<Double> embedding = List.of(
                Math.round(((double)(idx % 15) / 15.0) * 100.0) / 100.0,
                Math.round((price / 150000.0) * 100.0) / 100.0,
                Math.round((rating / 5.0) * 100.0) / 100.0,
                Math.round((aiScore / 100.0) * 100.0) / 100.0,
                Math.round((0.3 + (idx % 7) * 0.1) * 100.0) / 100.0
        );
        return Product.builder()
                .id(id)
                .name(name)
                .brand(brand)
                .description(description)
                .category(category)
                .price(price)
                .oldPrice(oldPrice)
                .discount(discount)
                .rating(rating)
                .reviews(reviews)
                .stock(idx % 8 == 0 ? "Only 3 left" : idx % 5 == 0 ? "Limited stock" : "In stock")
                .delivery(delivery)
                .image(image)
                .images(List.of(image, image, image, image))
                .aiScore(aiScore)
                .tags(List.of(
                        idx % 2 == 0 ? "Trending" : "New launch",
                        idx % 3 == 0 ? "Eco conscious" : "Premium",
                        category
                ))
                .embedding(embedding)
                .build();
    }
}
