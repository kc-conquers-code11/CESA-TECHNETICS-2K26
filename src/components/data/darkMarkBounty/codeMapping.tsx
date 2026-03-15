import { ENVELOPE_CODES, type EnvelopeCode } from "./envelopeCodes";

/**
 * MAPPING: Physical Envelope Code -> Internal Game ID (DMXXX)
 * 
 * Users will type these external codes (e.g. SKY_WIZARD_88) 
 * which will map to the internal DM codes defined in envelopeCodes.ts.
 */
export const CODE_MAPPING: Record<string, EnvelopeCode> = {
    // Yellow (Easy) Mappings
    "PEARL_99": "DM101",
    "ONYX_42": "DM102",
    "JADE_17": "DM103",
    "AMBER_56": "DM104",
    "RUBY_23": "DM105",
    "SAPPHIRE_81": "DM106",
    "TOPAZ_09": "DM107",
    "QUARTZ_34": "DM108",
    "BERYL_77": "DM109",
    "GARNET_12": "DM110",
    "OPAL_65": "DM111",
    "ZIRCON_90": "DM112",
    "CITRINE_21": "DM113",
    "AGATE_48": "DM114",
    "PYRITE_03": "DM115",

    // Orange (Medium) Mappings
    "PHOENIX_RISE": "DM201",
    "DRAGON_FIRE": "DM202",
    "GRIFFIN_CLAW": "DM203",
    "SPHINX_RIDDLE": "DM204",
    "BASILISK_EYE": "DM205",
    "CHIMERA_TAIL": "DM206",
    "HYDRA_HEAD": "DM207",
    "KRAKEN_TENT": "DM208",
    "MANTICORE_STING": "DM209",
    "PEGASUS_WING": "DM210",
    "CENTAUR_BOW": "DM211",
    "UNICORN_HORN": "DM212",
    "GOLEM_CORE": "DM213",
    "BANSHEE_WAIL": "DM214",
    "PIXIE_DUST": "DM215",

    // Red (Hard) Mappings
    "ELDER_WAND_99": "DM301",
    "SORCERER_STONE": "DM302",
    "CLOAK_INVIS": "DM303",
    "RESURRECT_STONE": "DM304",
    "MARAUDER_MAP": "DM305",
    "GOBLET_FIRE": "DM306",
    "SWORD_GRYFF": "DM307",
    "DIADEM_RAVEN": "DM308",
    "LOCKET_SLYTH": "DM309",
    "CUP_HUFFP": "DM310",
};

export const getInternalCode = (input: string): EnvelopeCode | null => {
    const normalized = input.trim().toUpperCase();
    // 1. Try to find in the mapping
    if (CODE_MAPPING[normalized]) return CODE_MAPPING[normalized];

    // 2. Fallback: Check if it's already a valid internal ID (DMXXX)
    if (normalized in ENVELOPE_CODES) return normalized as EnvelopeCode;

    return null;
};