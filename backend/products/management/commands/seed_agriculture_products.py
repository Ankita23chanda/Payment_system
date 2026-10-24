import json
from decimal import Decimal
from django.core.management.base import BaseCommand
from products.models import Category, Product


class Command(BaseCommand):
    help = 'Seeds initial agriculture categories and comprehensive agronomic product catalog'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.NOTICE("Seeding Agricultural Catalog..."))

        categories_data = [
            {
                "name": "Pesticides",
                "slug": "pesticides",
                "icon": "shield-alert",
                "description": "Broad-spectrum chemical formulations targeting crop pathogens, rodents, and destructive pests.",
                "display_order": 1,
            },
            {
                "name": "Insecticides",
                "slug": "insecticides",
                "icon": "bug",
                "description": "Targeted crop protectors engineered to control sucking pests, borers, bollworms, and leaf-miners.",
                "display_order": 2,
            },
            {
                "name": "Herbicides",
                "slug": "herbicides",
                "icon": "scissors",
                "description": "Selective and non-selective weed control solutions protecting crop yield and soil nutrition.",
                "display_order": 3,
            },
            {
                "name": "Fungicides",
                "slug": "fungicides",
                "icon": "cloud-rain",
                "description": "Systemic and contact fungicides preventing powdery mildew, rust, leaf spots, and blight.",
                "display_order": 4,
            },
            {
                "name": "Fertilizers",
                "slug": "fertilizers",
                "icon": "sparkles",
                "description": "High-efficiency macro, secondary, and micronutrient blends optimizing soil fertility and crop vigor.",
                "display_order": 5,
            },
            {
                "name": "Seeds",
                "slug": "seeds",
                "icon": "seedling",
                "description": "Certified high-yielding hybrid and open-pollinated seeds bred for disease resistance and high germination.",
                "display_order": 6,
            },
            {
                "name": "Plant-growth products",
                "slug": "plant-growth-products",
                "icon": "trending-up",
                "description": "Bio-stimulants, gibberellic acids, cytokinins, and micro-nutrients accelerating flowering and fruit set.",
                "display_order": 7,
            },
            {
                "name": "Agricultural tools",
                "slug": "agricultural-tools",
                "icon": "wrench",
                "description": "Ergonomic manual implements, pruning shears, soil samplers, and precision grafting knives.",
                "display_order": 8,
            },
            {
                "name": "Agricultural equipment",
                "slug": "agricultural-equipment",
                "icon": "cpu",
                "description": "Battery knapsack sprayers, drip irrigation controllers, solar aerators, and moisture meters.",
                "display_order": 9,
            },
            {
                "name": "Organic farming products",
                "slug": "organic-farming-products",
                "icon": "leaf",
                "description": "Eco-friendly bio-fertilizers, neem oil extract, vermicompost, and OMRI-certified inputs.",
                "display_order": 10,
            },
        ]

        cat_map = {}
        for cdata in categories_data:
            cat, _ = Category.objects.update_or_create(
                slug=cdata["slug"],
                defaults={
                    "name": cdata["name"],
                    "icon": cdata["icon"],
                    "description": cdata["description"],
                    "display_order": cdata["display_order"],
                    "is_active": True,
                }
            )
            cat_map[cdata["slug"]] = cat

        products_data = [
            # 1. Pesticides
            {
                "category": "pesticides",
                "name": "AgriShield Broad Spectrum Systemic Pesticide",
                "slug": "agrishield-broad-spectrum-systemic-pesticide",
                "brand": "Bayer CropScience",
                "price": Decimal("850.00"),
                "discount_price": Decimal("720.00"),
                "stock": 45,
                "image": "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=800&auto=format&fit=crop&q=80",
                "description": "Next-generation systemic pesticide targeting complex pest infestation across paddy, cotton, chili, and tomato crops.",
                "specifications": {
                    "Technical Name": "Chlorantraniliprole 18.5% SC",
                    "Target Crops": "Paddy, Cotton, Tomato, Sugarcane",
                    "Target Pests": "Stem borer, Leaf folder, Fruit borer",
                    "Dosage per Acre": "60 ml in 200 Litres of water",
                    "Packaging Size": "100 ml bottle",
                    "Formulation": "Suspension Concentrate (SC)"
                },
                "safety_information": "CAUTION (Blue Triangle). Wear chemical-resistant gloves, eye goggles, and a face shield during tank mixing. Keep away from water bodies and domestic livestock.",
                "usage_instructions": "Shake well before mixing. Dilute prescribed dosage in clean neutral-pH water. Spray evenly during early morning or late afternoon to prevent evaporation."
            },
            {
                "category": "pesticides",
                "name": "PhosGuard Soil Drenching Pesticide",
                "slug": "phosguard-soil-drenching-pesticide",
                "brand": "UPL Agro",
                "price": Decimal("620.00"),
                "discount_price": Decimal("540.00"),
                "stock": 30,
                "image": "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&auto=format&fit=crop&q=80",
                "description": "Specialized soil drenching formulation eliminating soil-borne white grubs, root aphids, and subterranean termites.",
                "specifications": {
                    "Technical Name": "Chlorpyrifos 20% EC",
                    "Target Crops": "Wheat, Sugarcane, Potato, Gram",
                    "Target Pests": "Termites, Root Grubs, Cutworms",
                    "Dosage per Acre": "1.2 Litres per Acre with irrigation water",
                    "Packaging Size": "1 Litre bottle",
                    "Formulation": "Emulsifiable Concentrate (EC)"
                },
                "safety_information": "WARNING (Yellow Triangle). Highly toxic to aquatic fauna. Do not graze livestock on treated fields for at least 15 days.",
                "usage_instructions": "Apply directly through flood irrigation or drench root zones thoroughly using a nozzle spray without deflector."
            },

            # 2. Insecticides
            {
                "category": "insecticides",
                "name": "Confidor Ultra Sucking Pest Specialist",
                "slug": "confidor-ultra-sucking-pest-specialist",
                "brand": "Bayer CropScience",
                "price": Decimal("980.00"),
                "discount_price": Decimal("849.00"),
                "stock": 60,
                "image": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80",
                "description": "Industry benchmark systemic neonicotinoid insecticide delivering long-lasting translaminar protection against aphids and whiteflies.",
                "specifications": {
                    "Technical Name": "Imidacloprid 17.8% SL",
                    "Target Crops": "Cotton, Paddy, Chili, Okra, Citrus",
                    "Target Pests": "Aphids, Jassids, Thrips, Whiteflies, Brown Plant Hopper",
                    "Dosage per Acre": "50-75 ml in 150-200 L water",
                    "Packaging Size": "250 ml bottle",
                    "Formulation": "Soluble Liquid (SL)"
                },
                "safety_information": "Moderately hazardous (Blue Band). Do not spray during peak honeybee foraging hours. Pre-harvest interval (PHI) is 21 days.",
                "usage_instructions": "Ensure full canopy coverage. Ideal for foliar spray when initial pest counts cross economic threshold level (ETL)."
            },
            {
                "category": "insecticides",
                "name": "Coragen Quick-Action Lepidoptera Defense",
                "slug": "coragen-quick-action-lepidoptera-defense",
                "brand": "FMC India",
                "price": Decimal("1850.00"),
                "discount_price": Decimal("1650.00"),
                "stock": 25,
                "image": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=800&auto=format&fit=crop&q=80",
                "description": "Revolutionary ryanodine receptor activator stopping pest feeding within 7 minutes of ingestion with rainfast resilience.",
                "specifications": {
                    "Technical Name": "Chlorantraniliprole 18.5% w/w",
                    "Target Crops": "Paddy, Corn, Cotton, Sugarcane, Soybean",
                    "Target Pests": "Spodoptera frugiperda (Fall Armyworm), Helicoverpa, Diamondback moth",
                    "Dosage per Acre": "60 ml per acre",
                    "Packaging Size": "150 ml bottle",
                    "Formulation": "Flowable Suspension"
                },
                "safety_information": "Green Band (Low mammalian toxicity). Safe for beneficial predatory insects like ladybird beetles and spiders.",
                "usage_instructions": "Rainfast within 2 hours. Spray upon spotting first egg clutches or early instar larvae."
            },

            # 3. Herbicides
            {
                "category": "herbicides",
                "name": "RoundUp Quick Non-Selective Herbicide",
                "slug": "roundup-quick-non-selective-herbicide",
                "brand": "Bayer Environmental",
                "price": Decimal("520.00"),
                "discount_price": Decimal("460.00"),
                "stock": 50,
                "image": "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800&auto=format&fit=crop&q=80",
                "description": "Systemic post-emergence translocated herbicide controlling perennial and annual monocot/dicot weeds with zero soil residual activity.",
                "specifications": {
                    "Technical Name": "Glyphosate 41% SL",
                    "Target Weeds": "Cynodon dactylon, Cyperus rotundus, Parthenium hysterophorus",
                    "Target Areas": "Bunds, tea plantations, fallow agricultural land, pre-sowing",
                    "Dosage per Acre": "800 ml - 1.2 L in 200 L water",
                    "Packaging Size": "1 Litre canister",
                    "Formulation": "Soluble Liquid"
                },
                "safety_information": "Blue Band. Non-selective herbicide: Avoid drift onto standing agricultural crops. Use spray hood attachment.",
                "usage_instructions": "Apply when weeds are actively photosynthesizing and 4-6 inches tall. Do not disturb soil for 7 days post application."
            },
            {
                "category": "herbicides",
                "name": "Nominee Gold Paddy Weed Eradicator",
                "slug": "nominee-gold-paddy-weed-eradicator",
                "brand": "PI Industries",
                "price": Decimal("1120.00"),
                "discount_price": Decimal("990.00"),
                "stock": 35,
                "image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",
                "description": "Selective post-emergence herbicide providing unmatched safety to rice crops while wiping out barnyard grass and sedges.",
                "specifications": {
                    "Technical Name": "Bispyribac Sodium 10% SC",
                    "Target Crops": "Direct Seeded Rice (DSR) & Transplanted Rice",
                    "Target Weeds": "Echinochloa crus-galli, Ischaemum rugosum, Cyperus difformis",
                    "Dosage per Acre": "80-100 ml per acre",
                    "Packaging Size": "100 ml bottle",
                    "Formulation": "Suspension Concentrate"
                },
                "safety_information": "Green Triangle. Safe for paddy seedlings older than 12 days. Drain standing water 24 hours before spraying.",
                "usage_instructions": "Re-flood field with water 48 hours after herbicide application and retain water for 5-7 days."
            },

            # 4. Fungicides
            {
                "category": "fungicides",
                "name": "Amistar Top Dual Systemic Fungicide",
                "slug": "amistar-top-dual-systemic-fungicide",
                "brand": "Syngenta",
                "price": Decimal("1450.00"),
                "discount_price": Decimal("1299.00"),
                "stock": 40,
                "image": "https://images.unsplash.com/photo-1598512752271-33f913a5af13?w=800&auto=format&fit=crop&q=80",
                "description": "Powerful strobilurin + triazole combination delivering prophylactic and curative control with physiological greening benefits.",
                "specifications": {
                    "Technical Name": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
                    "Target Crops": "Paddy, Tomato, Chili, Apple, Grapes, Maize",
                    "Target Pathogens": "Sheath blight, Blast, Powdery Mildew, Anthracnose, Alternaria",
                    "Dosage per Acre": "200 ml in 200 Litres water",
                    "Packaging Size": "200 ml pack",
                    "Formulation": "Suspension Concentrate"
                },
                "safety_information": "Blue Band. Prolongs grain filling stage and prevents premature leaf senescence. Do not apply near water canals.",
                "usage_instructions": "Apply at the first appearance of fungal lesions or prophylactically before humid weather fronts."
            },
            {
                "category": "fungicides",
                "name": "Saaf Dual Action Contact & Systemic Fungicide",
                "slug": "saaf-dual-action-contact-systemic-fungicide",
                "brand": "UPL Agro",
                "price": Decimal("380.00"),
                "discount_price": Decimal("320.00"),
                "stock": 80,
                "image": "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&auto=format&fit=crop&q=80",
                "description": "Proven multi-site preventive and curative fungicide blend ideal for seed treatment, rhizome dip, and foliar spray.",
                "specifications": {
                    "Technical Name": "Carbendazim 12% + Mancozeb 63% WP",
                    "Target Crops": "Groundnut, Paddy, Potato, Tea, Chili",
                    "Target Pathogens": "Tikka disease, Blast, Collar rot, Late blight",
                    "Dosage per Acre": "300-400 grams per acre or 2.5g/kg seed",
                    "Packaging Size": "500 gram pouch",
                    "Formulation": "Wettable Powder (WP)"
                },
                "safety_information": "Yellow Band. Avoid inhalation of wettable powder dust. Wash hands thoroughly with soap after handling.",
                "usage_instructions": "For seed treatment, mix 2.5g per kg seed with a little water until coated. For foliar, mix 2g per liter."
            },

            # 5. Fertilizers
            {
                "category": "fertilizers",
                "name": "IFFCO 100% Water Soluble NPK 19-19-19",
                "slug": "iffco-water-soluble-npk-19-19-19",
                "brand": "IFFCO",
                "price": Decimal("240.00"),
                "discount_price": Decimal("195.00"),
                "stock": 120,
                "image": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=800&auto=format&fit=crop&q=80",
                "description": "Fully water-soluble balanced vegetative fertilizer enriched with chelated trace elements for fertigation and foliar feeding.",
                "specifications": {
                    "Total Nitrogen (N)": "19.0% minimum",
                    "Water Soluble Phosphate (P2O5)": "19.0% minimum",
                    "Water Soluble Potash (K2O)": "19.0% minimum",
                    "Solubility": "100% instantly soluble in water",
                    "Application Method": "Drip Irrigation / Foliar Spray",
                    "Packaging Size": "1 kg foil pouch"
                },
                "safety_information": "Store in a dry, moisture-proof warehouse. Keep bag sealed after opening to prevent moisture absorption.",
                "usage_instructions": "Foliar spray: 5-7 grams per liter of water during active tillering or branching stage. Drip: 2-3 kg per acre."
            },
            {
                "category": "fertilizers",
                "name": "Coromandel Gromor DAP Plus (Di-Ammonium Phosphate)",
                "slug": "coromandel-gromor-dap-plus",
                "brand": "Coromandel International",
                "price": Decimal("1350.00"),
                "discount_price": Decimal("1350.00"),
                "stock": 90,
                "image": "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80",
                "description": "Essential basal fertilizer supplying high concentration phosphorus for robust root elongation and early seedling vigor.",
                "specifications": {
                    "Ammoniacal Nitrogen": "18.0% minimum",
                    "Neutral Ammonium Citrate Soluble Phosphate": "46.0% minimum",
                    "Water Soluble Phosphate": "39.5% minimum",
                    "Granular Size": "1 to 4 mm hard round granules",
                    "Packaging Size": "50 kg HDPE Bag"
                },
                "safety_information": "Non-flammable agricultural nutrient. Keep protected from excessive humidity and direct rainfall.",
                "usage_instructions": "Apply as basal placement 5 cm below seed level during land preparation or sowing."
            },

            # 6. Seeds
            {
                "category": "seeds",
                "name": "Mahyco Pioneer Hybrid Corn Seeds (P3396)",
                "slug": "mahyco-pioneer-hybrid-corn-seeds-p3396",
                "brand": "Corteva Pioneer",
                "price": Decimal("2200.00"),
                "discount_price": Decimal("1980.00"),
                "stock": 70,
                "image": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80",
                "description": "Champion high-yielding hybrid corn with exceptional drought tolerance, strong stay-green stalks, and dense orange-yellow grain fill.",
                "specifications": {
                    "Maturity Duration": "105 - 115 days",
                    "Plant Height": "Medium tall with low cob placement",
                    "Germination Rate": "92% certified minimum",
                    "Genetic Purity": "98% minimum",
                    "Recommended Season": "Kharif & Rabi",
                    "Packaging Size": "4 kg bag"
                },
                "safety_information": "Seeds treated with Thiram/Metalaxyl fungicide. Do not use for human consumption, animal feed, or oil extraction.",
                "usage_instructions": "Maintain spacing of 60 cm row-to-row and 20 cm plant-to-plant. Seed rate: 7.5 - 8 kg per acre."
            },
            {
                "category": "seeds",
                "name": "Syngenta Saaho F1 Hybrid Tomato Seeds (TO-3251)",
                "slug": "syngenta-saaho-f1-hybrid-tomato-seeds",
                "brand": "Syngenta Seeds",
                "price": Decimal("890.00"),
                "discount_price": Decimal("799.00"),
                "stock": 55,
                "image": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80",
                "description": "High market acceptance determinate hybrid tomato yielding firm, glossy square-round fruits with superior transportability.",
                "specifications": {
                    "Fruit Weight": "80 - 100 grams average",
                    "Maturity": "First harvest at 60-65 days after transplanting",
                    "Disease Resistance": "High tolerance to Tomato Leaf Curl Virus (ToLCV)",
                    "Harvest Duration": "Continuous picking up to 90 days",
                    "Packaging Size": "10 gram pouch (approx 3,000 seeds)"
                },
                "safety_information": "Fungicide treated seed. Handle with gloves. Store in cool and dry environment under 20°C.",
                "usage_instructions": "Raise seedlings in raised nursery beds or pro-trays with coco peat. Transplant sturdy 25-day seedlings into field."
            },

            # 7. Plant-growth products
            {
                "category": "plant-growth-products",
                "name": "Biozyme Crop+ Advanced Bio-Stimulant",
                "slug": "biozyme-crop-plus-bio-stimulant",
                "brand": "Biostadt India",
                "price": Decimal("750.00"),
                "discount_price": Decimal("640.00"),
                "stock": 40,
                "image": "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&auto=format&fit=crop&q=80",
                "description": "Naturally derived Ascophyllum nodosum marine seaweed extract loaded with natural auxins, cytokinins, and enzymes to trigger flowering.",
                "specifications": {
                    "Active Ingredient": "Cold water marine algae extract 19.2%",
                    "Secondary Nutrients": "Magnesium, Sulfur, Boron, Zinc",
                    "Benefits": "Boosts cell division, reduces flower drop, increases fruit retention",
                    "Dosage per Acre": "250 ml in 200 Litres water",
                    "Packaging Size": "500 ml container"
                },
                "safety_information": "100% non-toxic biological origin. Compatible with all commonly used fertilizers and crop protection sprays.",
                "usage_instructions": "First spray at active vegetative flush, second spray at 10% flowering, third spray at fruit marble stage."
            },
            {
                "category": "plant-growth-products",
                "name": "MaxiGrow Gibberellic Acid 0.001% L",
                "slug": "maxigrow-gibberellic-acid-liquid",
                "brand": "Rallis India",
                "price": Decimal("320.00"),
                "discount_price": Decimal("275.00"),
                "stock": 65,
                "image": "https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?w=800&auto=format&fit=crop&q=80",
                "description": "High-purity Gibberellic acid (GA3) plant growth promoter overcoming genetic dwarfism and increasing berry elongation in vineyards.",
                "specifications": {
                    "Technical Name": "Gibberellic Acid 0.001% L",
                    "Target Crops": "Grapes, Sugarcane, Cotton, Paddy, Vegetables",
                    "Mode of Action": "Internodal elongation and rapid cell expansion",
                    "Packaging Size": "1 Litre bottle"
                },
                "safety_information": "Green label. Eco-friendly organic acid formulation. Safe to bees and aquatic organisms.",
                "usage_instructions": "Dilute 1 ml per liter of water. Spray during cool morning hours when relative humidity is above 60%."
            },

            # 8. Agricultural tools
            {
                "category": "agricultural-tools",
                "name": "Falcon Premium Bypass Pruning Secateur (F-88)",
                "slug": "falcon-premium-bypass-pruning-secateur",
                "brand": "Falcon Garden Tools",
                "price": Decimal("950.00"),
                "discount_price": Decimal("820.00"),
                "stock": 35,
                "image": "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=800&auto=format&fit=crop&q=80",
                "description": "Heavy-duty forged high carbon steel bypass pruner engineered for smooth pruning of orchards, vineyard canes, and horticulture plants.",
                "specifications": {
                    "Blade Material": "SK-5 Hardened High Carbon Steel with Teflon coating",
                    "Cutting Capacity": "Up to 25 mm diameter fresh branches",
                    "Handle Material": "Ergonomic non-slip rubberized aluminum alloy",
                    "Safety Lock": "Thumb-operated brass safety latch",
                    "Total Length": "215 mm"
                },
                "safety_information": "Sharp cutting edges. Keep out of reach of children. Wipe blade clean and oil hinge after each day's pruning.",
                "usage_instructions": "Cut branches at a 45-degree angle approximately 6 mm above a viable bud to prevent fungal rot."
            },
            {
                "category": "agricultural-tools",
                "name": "AgriPro Heavy Duty Stainless Steel Soil Sampler Core Probe",
                "slug": "agripro-soil-sampler-core-probe",
                "brand": "AgriPro Tools",
                "price": Decimal("1450.00"),
                "discount_price": Decimal("1250.00"),
                "stock": 20,
                "image": "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=800&auto=format&fit=crop&q=80",
                "description": "Calibrated tubular stainless steel soil corer designed for collecting uniform soil sample cores for agronomic lab testing.",
                "specifications": {
                    "Material": "Grade 304 Seamless Stainless Steel",
                    "Sampling Depth": "Up to 30 cm (12 inches) with laser etched markings",
                    "Core Diameter": "20 mm",
                    "Handle": "Welded T-Bar with cushioned grip handles"
                },
                "safety_information": "Avoid driving probe into underground electrical conduit or irrigation pipelines.",
                "usage_instructions": "Push probe vertically into moist soil, rotate 90 degrees, and pull up to extract undisturbed root zone soil core."
            },

            # 9. Agricultural equipment
            {
                "category": "agricultural-equipment",
                "name": "Neptune 16-Litre 12V Dual-Motor Battery Knapsack Sprayer",
                "slug": "neptune-16-litre-battery-knapsack-sprayer",
                "brand": "Neptune Farming Solutions",
                "price": Decimal("3800.00"),
                "discount_price": Decimal("3290.00"),
                "stock": 18,
                "image": "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80",
                "description": "High-pressure dual motor agricultural battery sprayer equipped with telescopic stainless lance and 4 interchangeable nozzles.",
                "specifications": {
                    "Tank Capacity": "16 Litres heavy grade UV-resistant Virgin Polypropylene",
                    "Battery": "12V 12Ah Rechargeable Lead-Acid / Lithium compatible",
                    "Discharge Rate": "3.6 - 4.5 Litres per minute",
                    "Operating Pressure": "0.2 - 0.45 MPa (Pressure Regulator Dial)",
                    "Spraying Time": "Up to 6-8 continuous hours per charge"
                },
                "safety_information": "Clean chemical tank with clean water after each spray session. Do not run motor dry without fluid.",
                "usage_instructions": "Charge battery fully for 6 hours before initial field operation. Select mist nozzle for foliar fungicides and fan nozzle for herbicides."
            },
            {
                "category": "agricultural-equipment",
                "name": "AgriPrecision Digital Soil Moisture, pH & Sunlight 3-in-1 Meter",
                "slug": "agriprecision-digital-soil-moisture-ph-meter",
                "brand": "FieldTech Agronomics",
                "price": Decimal("1850.00"),
                "discount_price": Decimal("1490.00"),
                "stock": 28,
                "image": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
                "description": "Precision probe instrument providing instant digital readings for soil pH level, root moisture index, and ambient light intensity.",
                "specifications": {
                    "pH Range": "3.5 to 9.0 pH (0.5 resolution)",
                    "Moisture Range": "1 to 10 scale (Dry / Normal / Wet)",
                    "Probe Length": "200 mm dual electrode probe",
                    "Power Source": "Battery-free photo-chemical sensing"
                },
                "safety_information": "Do not leave probe immersed in soil for more than 1 hour. Clean and polish probe tips before and after measurement.",
                "usage_instructions": "Insert probe 2/3 depth into moist root zone soil. Toggle switch to measure Moisture, Light, or pH."
            },

            # 10. Organic farming products
            {
                "category": "organic-farming-products",
                "name": "NeemCare Cold-Pressed 10,000 PPM Azadirachtin Organic Bio-Pesticide",
                "slug": "neemcare-cold-pressed-organic-bio-pesticide",
                "brand": "NatureGreen Organics",
                "price": Decimal("680.00"),
                "discount_price": Decimal("575.00"),
                "stock": 45,
                "image": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
                "description": "100% organic cold-pressed pure neem seed kernel extract providing anti-feedant, repellent, and oviposition deterrent properties.",
                "specifications": {
                    "Active Ingredient": "Azadirachtin 1% (10,000 PPM)",
                    "Certification": "NPOP / OMRI Certified Organic Input",
                    "Target Pests": "Whiteflies, Caterpillars, Leaf miners, Mealybugs, Thrips",
                    "Dosage per Acre": "300 - 400 ml in 200 Litres water",
                    "Packaging Size": "1 Litre bottle"
                },
                "safety_information": "Completely non-hazardous to mammals, earthworms, and honeybees. Zero chemical residues, safe up to harvest day.",
                "usage_instructions": "Mix with a few drops of organic surfactant or mild soap for uniform foliar spread. Spray every 10-14 days."
            },
            {
                "category": "organic-farming-products",
                "name": "EarthBio Organic Enriched Vermicompost (Macro & Micro Nutrients)",
                "slug": "earthbio-organic-enriched-vermicompost",
                "brand": "SoilHeal Organics",
                "price": Decimal("490.00"),
                "discount_price": Decimal("420.00"),
                "stock": 85,
                "image": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80",
                "description": "Eisenia fetida worm castings enriched with beneficial mycorrhizal fungi, azotobacter, and humic substances for soil carbon regeneration.",
                "specifications": {
                    "Organic Carbon": "16.5% minimum",
                    "Moisture Content": "18 - 22% balanced",
                    "Total Nitrogen": "1.8%",
                    "Total Phosphorus": "1.2%",
                    "Total Potassium": "1.5%",
                    "Beneficial Microbes": "> 10^7 CFU/g",
                    "Packaging Size": "25 kg Bag"
                },
                "safety_information": "Safe, odorless, weed-seed-free, and heavy metal-free. Safe for handling without special protective equipment.",
                "usage_instructions": "Apply 500g to 1 kg per fruit tree around canopy drip line, or 250 kg per acre during field bed preparation."
            },

            # Additional High-Demand Products
            {
                "category": "pesticides",
                "name": "Tata Rallis Takumi Systemic Insecticide & Larvicide",
                "slug": "tata-rallis-takumi-larvicide",
                "brand": "Tata Rallis",
                "price": Decimal("1320.00"),
                "discount_price": Decimal("1180.00"),
                "stock": 40,
                "image": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80",
                "description": "Flubendiamide 39.35% SC formulation targeting resistant lepidopteran larvae in cotton, rice, and cabbage.",
                "specifications": {
                    "Technical Name": "Flubendiamide 39.35% SC",
                    "Target Crops": "Cotton, Paddy, Cabbage, Tomato",
                    "Target Pests": "Spodoptera, Diamondback Moth, Bollworms",
                    "Dosage per Acre": "40-50 ml in 200 Litres of water",
                    "Packaging Size": "100 ml bottle"
                },
                "safety_information": "Green Triangle. Safe for honeybees when used according to guidelines. Wear rubber gloves during handling.",
                "usage_instructions": "Apply at the first appearance of young larvae. Good coverage of foliage is essential."
            },
            {
                "category": "herbicides",
                "name": "Syngenta Dual Gold Pre-Emergence Herbicide",
                "slug": "syngenta-dual-gold-herbicide",
                "brand": "Syngenta",
                "price": Decimal("890.00"),
                "discount_price": Decimal("799.00"),
                "stock": 35,
                "image": "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800&auto=format&fit=crop&q=80",
                "description": "S-Metolachlor 960 g/L selective pre-emergence herbicide providing long-lasting broadleaf weed control in maize and soybeans.",
                "specifications": {
                    "Technical Name": "S-Metolachlor 960 g/L EC",
                    "Target Crops": "Maize, Cotton, Soybean, Sunflower",
                    "Target Pests": "Annual grasses and broadleaf weeds",
                    "Dosage per Acre": "500 - 700 ml per acre",
                    "Packaging Size": "500 ml bottle"
                },
                "safety_information": "Blue Triangle. Avoid contact with eyes and skin. Do not apply when heavy rain is forecast within 24 hours.",
                "usage_instructions": "Spray onto moist soil within 2 days after planting before weed seeds emerge."
            },
            {
                "category": "fungicides",
                "name": "Bavistin Contact & Systemic Carbendazim Fungicide",
                "slug": "bavistin-systemic-fungicide",
                "brand": "Crystal Crop Protection",
                "price": Decimal("380.00"),
                "discount_price": Decimal("330.00"),
                "stock": 70,
                "image": "https://images.unsplash.com/photo-1598512752271-33f913a5af13?w=800&auto=format&fit=crop&q=80",
                "description": "Time-tested broad-spectrum systemic fungicide effective against seed-borne and soil-borne fungal pathogens.",
                "specifications": {
                    "Technical Name": "Carbendazim 50% WP",
                    "Target Crops": "Paddy, Wheat, Groundnut, Cotton, Apples",
                    "Target Diseases": "Blast, Stem rot, Tikka disease, Scab",
                    "Dosage per Acre": "250g in 200 Litres water or 2g/kg seed",
                    "Packaging Size": "500g Pack"
                },
                "safety_information": "Yellow band. Wash skin immediately if exposed. Store away from grain and food supplies.",
                "usage_instructions": "Can be used as foliar spray, seed treatment, or root dip before seedling transplant."
            },
            {
                "category": "fungicides",
                "name": "Indofil M-45 Contact Protective Mancozeb Fungicide",
                "slug": "indofil-m45-mancozeb-fungicide",
                "brand": "Indofil Industries",
                "price": Decimal("460.00"),
                "discount_price": Decimal("410.00"),
                "stock": 90,
                "image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",
                "description": "Dithiocarbamate protective fungicide offering broad disease coverage with vital manganese and zinc micronutrient benefits.",
                "specifications": {
                    "Technical Name": "Mancozeb 75% WP",
                    "Target Crops": "Potato, Tomato, Grapes, Chili, Wheat",
                    "Target Diseases": "Early & Late Blight, Downy Mildew, Rust",
                    "Dosage per Acre": "600 - 800g in 200 Litres water",
                    "Packaging Size": "1 kg Pack"
                },
                "safety_information": "Green Triangle. Low hazard profile. Use standard mask and goggles during preparation.",
                "usage_instructions": "Spray prophylactically when weather conditions favor disease initiation. Repeat at 7-10 day intervals."
            },
            {
                "category": "fertilizers",
                "name": "YaraMila Complex Prilled Balanced NPK Fertilizer",
                "slug": "yaramila-complex-npk-fertilizer",
                "brand": "Yara International",
                "price": Decimal("1850.00"),
                "discount_price": Decimal("1680.00"),
                "stock": 50,
                "image": "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=800&auto=format&fit=crop&q=80",
                "description": "Premium prilled compound fertilizer containing Nitrogen, Phosphorus, Potassium, Sulphur, and Magnesium in every single granule.",
                "specifications": {
                    "Nutrient Ratio": "NPK 12-11-18 + 20% SO3 + 2.7% MgO + Micronutrients",
                    "Granule Type": "Uniform prilled, chlorine-free SOP based",
                    "Target Crops": "Horticultural crops, Vegetables, Fruit trees, Tea",
                    "Dosage per Acre": "50 - 100 kg per acre as basal/top dressing",
                    "Packaging Size": "25 kg Bag"
                },
                "safety_information": "Store in a dry cool warehouse. Non-combustible. Protect from extreme heat and moisture.",
                "usage_instructions": "Spread evenly around plant rhizosphere followed by immediate irrigation."
            },
            {
                "category": "fertilizers",
                "name": "Coromandel Gromor 28-28-0 High Nitrogen-Phosphate Complex",
                "slug": "coromandel-gromor-28-28-0",
                "brand": "Coromandel International",
                "price": Decimal("1420.00"),
                "discount_price": Decimal("1290.00"),
                "stock": 65,
                "image": "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&auto=format&fit=crop&q=80",
                "description": "Concentrated ammonium phosphate fertilizer engineered for early root vigor and vegetative shoot multiplication.",
                "specifications": {
                    "Nutrient Grade": "NP 28-28-0 Complex Granular",
                    "Target Crops": "Paddy, Sugarcane, Wheat, Cotton, Maize",
                    "Dosage per Acre": "50 kg per acre",
                    "Packaging Size": "50 kg Bag"
                },
                "safety_information": "Safe non-toxic agricultural grade fertilizer. Avoid inhalation of fine dust.",
                "usage_instructions": "Incorporate into top 5-8 cm of soil during final seedbed tillage or planting."
            },
            {
                "category": "seeds",
                "name": "Rasi 659 BG-II High-Yield Bollgard Hybrid Cotton Seeds",
                "slug": "rasi-659-bg-ii-hybrid-cotton-seeds",
                "brand": "Rasi Seeds",
                "price": Decimal("864.00"),
                "discount_price": Decimal("853.00"),
                "stock": 55,
                "image": "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&auto=format&fit=crop&q=80",
                "description": "Leading Bollgard II transgenic cotton seed with high boll retention, tolerance to sucking pests, and exceptional staple length.",
                "specifications": {
                    "Trait": "Bollgard II (Cry1Ac + Cry2Ab genes)",
                    "Maturity": "150 - 160 days",
                    "Boll Weight": "5.0 - 5.5 grams",
                    "Germination": "> 75% certified",
                    "Packaging Size": "475g packet (450g BG-II + 25g non-Bt refuge)"
                },
                "safety_information": "Follow mandatory refuge planting guidelines. Treated with chemical fungicide for seed-borne rot.",
                "usage_instructions": "Plant at 90 x 60 cm spacing under irrigated conditions. Maintain refuge rows along perimeter."
            },
            {
                "category": "seeds",
                "name": "Mahyco F1 Hybrid Ridge Gourd Ganga Seeds",
                "slug": "mahyco-f1-ridge-gourd-ganga",
                "brand": "Mahyco",
                "price": Decimal("320.00"),
                "discount_price": Decimal("285.00"),
                "stock": 80,
                "image": "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&auto=format&fit=crop&q=80",
                "description": "Prolific bearing hybrid ridge gourd producing dark green, tender, uniform ribbed fruits with high market acceptance.",
                "specifications": {
                    "Fruit Length": "35 - 45 cm",
                    "First Picking": "45 - 50 days from sowing",
                    "Fruit Color": "Lush dark green with sharp ribs",
                    "Packaging Size": "50g pouch"
                },
                "safety_information": "Seeds treated with Thiram/Captan. Do not use for human or animal consumption.",
                "usage_instructions": "Sow in raised beds with trellising support at 1.5m row-to-row spacing."
            },
            {
                "category": "plant-growth-products",
                "name": "PI Industries Biovita Seaweed Extract Plant Booster",
                "slug": "pi-biovita-seaweed-plant-booster",
                "brand": "PI Industries",
                "price": Decimal("650.00"),
                "discount_price": Decimal("575.00"),
                "stock": 70,
                "image": "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=800&auto=format&fit=crop&q=80",
                "description": "100% natural Ascophyllum nodosum cold-extracted Norwegian seaweed delivering natural cytokinins, auxins, and enzymes.",
                "specifications": {
                    "Active Ingredient": "Ascophyllum nodosum marine seaweed extract 20%",
                    "Target Crops": "Grapes, Citrus, Tomato, Cotton, Tea",
                    "Dosage per Acre": "250 - 300 ml in 200 Litres water",
                    "Packaging Size": "500 ml bottle"
                },
                "safety_information": "Completely eco-friendly and non-toxic. Compatible with most common agrochemical sprays.",
                "usage_instructions": "Spray during vegetative flush, pre-flowering, and fruit expansion stages."
            },
            {
                "category": "plant-growth-products",
                "name": "Tata Rallis Ralligold Mycorrhizal Bio-Stimulant Granules",
                "slug": "tata-rallis-ralligold-granules",
                "brand": "Tata Rallis",
                "price": Decimal("480.00"),
                "discount_price": Decimal("425.00"),
                "stock": 60,
                "image": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80",
                "description": "Endo-mycorrhizae granules that dramatically extend effective root surface area, enhancing phosphorus and water uptake.",
                "specifications": {
                    "Active Agent": "VAM (Vesicular Arbuscular Mycorrhizae) 100 IP/g",
                    "Carrier": "Bentonite granules",
                    "Dosage per Acre": "4 kg per acre",
                    "Packaging Size": "4 kg Bag"
                },
                "safety_information": "Environmentally safe biological input. Safe for earthworms and soil flora.",
                "usage_instructions": "Broadcast near root zone with basal fertilizers at sowing or transplanting time."
            },
            {
                "category": "agricultural-tools",
                "name": "Wolf-Garten Multi-Star Ergonomic Dutch Weeding Hoe",
                "slug": "wolf-garten-dutch-hoe",
                "brand": "Wolf-Garten",
                "price": Decimal("1150.00"),
                "discount_price": Decimal("990.00"),
                "stock": 25,
                "image": "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80",
                "description": "Hardened high-tensile carbon steel blade designed to slice through surface weed roots smoothly in a push-pull motion.",
                "specifications": {
                    "Blade Width": "15 cm",
                    "Blade Material": "Cold-rolled zinc-coated carbon steel",
                    "Connection": "Multi-star click lock quick attach system",
                    "Weight": "420 grams"
                },
                "safety_information": "Sharp blade edges. Keep out of reach of children. Clean and oil blade after use.",
                "usage_instructions": "Push and pull just beneath soil crust between crop rows to sever weeds cleanly."
            },
            {
                "category": "agricultural-tools",
                "name": "Tata Agrico Premium Heavy Duty Forged Bill Hook",
                "slug": "tata-agrico-forged-bill-hook",
                "brand": "Tata Agrico",
                "price": Decimal("520.00"),
                "discount_price": Decimal("460.00"),
                "stock": 45,
                "image": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80",
                "description": "Drop-forged carbon steel curved bill hook engineered for clearing thick brushwood, sugar cane harvesting, and pruning thick branches.",
                "specifications": {
                    "Blade Length": "10 inches",
                    "Steel Grade": "Forged High Carbon EN-9 Steel",
                    "Handle": "Reinforced seasoned hardwood ergonomic grip",
                    "Hardness": "48 - 52 HRC"
                },
                "safety_information": "Wear heavy work gloves. Always chop away from body and feet.",
                "usage_instructions": "Use swift downward angled strokes to slice through tough stalks and canes cleanly."
            },
            {
                "category": "agricultural-equipment",
                "name": "Jain Precision 1-Acre Drip Irrigation Complete Starter Kit",
                "slug": "jain-precision-1-acre-drip-irrigation-kit",
                "brand": "Jain Irrigation",
                "price": Decimal("14800.00"),
                "discount_price": Decimal("12999.00"),
                "stock": 12,
                "image": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&auto=format&fit=crop&q=80",
                "description": "Comprehensive water-saving drip kit including screen filter, venturi fertigation injector, 16mm inline lateral pipes, and fittings.",
                "specifications": {
                    "Coverage Area": "1 Acre (approx. 4,000 sq.m)",
                    "Lateral Line": "16mm Class-2 Inline Drip Tube with 40cm emitter spacing",
                    "Emitter Flow Rate": "2.0 Litres per Hour (LPH)",
                    "Filtration": "2-inch Disc/Screen Filter (120 mesh)",
                    "Fertigation": "Venturi Injector with suction tube"
                },
                "safety_information": "Operate within recommended pressure limits (1.0 - 2.5 kg/cm2). Flush laterals periodically.",
                "usage_instructions": "Assemble main lines, screen filter, and laterals according to the included schematic layout guide."
            },
            {
                "category": "organic-farming-products",
                "name": "KisanKraft Trichoderma Viride Bio-Fungicide Powder",
                "slug": "kisankraft-trichoderma-viride-bio-fungicide",
                "brand": "KisanKraft",
                "price": Decimal("340.00"),
                "discount_price": Decimal("295.00"),
                "stock": 65,
                "image": "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=800&auto=format&fit=crop&q=80",
                "description": "Antagonistic beneficial fungal culture effectively hyperparasitizing Fusarium, Rhizoctonia, Pythium, and Sclerotium pathogens.",
                "specifications": {
                    "CFU Count": "2 x 10^6 CFU/gm minimum",
                    "Target Diseases": "Root rot, Collar rot, Damping off, Wilt",
                    "Formulation": "Wettable Powder with talc carrier",
                    "Packaging Size": "1 kg Pouch"
                },
                "safety_information": "Non-toxic biological agent. Do not mix with chemical fungicides or bactericides.",
                "usage_instructions": "Mix with farm yard manure (FYM) or vermicompost 7 days before application to multiply spores."
            }
        ]

        created_count = 0
        for pdata in products_data:
            cat = cat_map.get(pdata["category"])
            if not cat:
                continue

            product, created = Product.objects.update_or_create(
                slug=pdata["slug"],
                defaults={
                    "category": cat,
                    "name": pdata["name"],
                    "brand": pdata["brand"],
                    "price": pdata["price"],
                    "discount_price": pdata["discount_price"],
                    "stock": pdata["stock"],
                    "image": pdata["image"],
                    "description": pdata["description"],
                    "specifications": pdata["specifications"],
                    "safety_information": pdata["safety_information"],
                    "usage_instructions": pdata["usage_instructions"],
                    "is_active": True,
                }
            )
            if created:
                created_count += 1

        self.stdout.write(self.style.SUCCESS(
            f"Successfully seeded {len(categories_data)} categories and {len(products_data)} agricultural products ({created_count} newly created)."
        ))
