// embed-flag
if (typeof window !== "undefined" && window.top !== window.self) {
  document.documentElement.classList.add("embedded");
  document.addEventListener("DOMContentLoaded", () => document.body.classList.add("embedded"));
}

// SPDX-License-Identifier: Apache-2.0
//
// ============================================================================
// calc15.js — OxyNorm & OxyContin Counting Helper (No-0, Compact, No Scroll)
// ============================================================================

// === 1. CONSTANTS ===
const TABLETS_PER_TRAY = 14;
const MAX_98_BOXES = 5;
const MAX_28_BOXES = 7;
const MAX_TRAYS = 6;
const MAX_EXTRA_TABLETS = 15;

// === 2. DOM ELEMENT REFERENCES ===
const box98Container = document.getElementById("box98-buttons");
const box28Container = document.getElementById("box28-buttons");
const trayContainer = document.getElementById("tray-buttons");
const extraTabletsContainer = document.getElementById("tray-tablet-buttons");

const resultDiv = document.getElementById("result");
const calculationHeader = document.getElementById("calculation-header");
const calculationBody = document.getElementById("calculation-body");
const resultBox = document.querySelector(".result");
const resultDivider = document.querySelector(".result-divider");
const clearContainer = document.getElementById("clear-container");
const calcHeadingEl = document.getElementById("calc-heading");
const appbarTitle = document.getElementById("appbar-title");
const labelBox98 = document.getElementById("label-box98");
const labelBox28 = document.getElementById("label-box28");
const labelTray = document.getElementById("label-tray");
const labelExtra = document.getElementById("label-extra");
const resultsTitleEl = document.getElementById("results-title");
const resetButton = document.getElementById("reset-button");
const settingsPanel = document.getElementById("settings-panel");
const settingsTitle = document.getElementById("settings-title");
const settingsDescription = document.getElementById("settings-description");
const settingsLegend = document.getElementById("settings-language-legend");
const settingsClose = document.getElementById("settings-close");
const settingsGear = document.getElementById("settings-gear");
const shareButton = document.getElementById("share-button");
const languageRadios = document.querySelectorAll("input[name='calc15-language']");
const updateNoticeEl = document.getElementById("update-notice");
const shareOverlay = document.getElementById("share-overlay");
const shareOverlayText = document.getElementById("share-overlay-text");
const shareOverlayShare = document.getElementById("share-overlay-share");
const shareOverlayCancel = document.getElementById("share-overlay-cancel");
const RELOAD_BANNER_PAUSE_MS = 1000; // 1s visual confirmation before reload

// === 2.1 LANGUAGE SUPPORT ===
const LANGUAGE_KEY_15 = 'calc15.language';
const DEFAULT_LANGUAGE_15 = 'en-GB';
const SHARE_INSTRUCTION_PLACEHOLDER = '{instructions}';
const DEFAULT_SHARE_MESSAGE = 'Use Share to send this helper to friends. To save it on your device: {instructions}';
const ADD_TO_HOME_INSTRUCTIONS = {
  'en-GB': {
    ios: "Tap Safari's share icon (square with arrow) and choose 'Add to Home Screen'.",
    android: "Open your browser menu (⋮) and choose 'Add to Home screen', then confirm."
  },
  'nb-NO': {
    ios: "Trykk på Safari sin Del-knapp (firkant med pil) og velg «Legg til på Hjem-skjerm».",
    android: "Åpne nettleserens meny (⋮) og velg «Legg til på hjemskjermen», bekreft deretter."
  },
  'nn-NO': {
    ios: "Trykk på Safari sin Del-knapp (firkant med pil) og velg «Legg til på heimskjermen».",
    android: "Opna nettlesaren sin meny (⋮) og vel «Legg til på heimskjermen», stadfest deretter."
  },
  'sv-SE': {
    ios: "Tryck på Safaris Dela-ikon (fyrkant med pil) och välj 'Lägg till på hemskärmen'.",
    android: "Öppna webbläsarens meny (⋮) och välj 'Lägg till på startskärmen', bekräfta sedan."
  },
  'da-DK': {
    ios: "Tryk på Safaris Del-ikon (firkant med pil) og vælg 'Føj til hjemmeskærm'.",
    android: "Åbn browserens menu (⋮) og vælg 'Tilføj til startskærm', bekræft derefter."
  },
  'fi-FI': {
    ios: "Napauta Safarin Jaa-kuvaketta (neliö nuolella) ja valitse 'Lisää aloitusnäytölle'.",
    android: "Avaa selaimen valikko (⋮) ja valitse 'Lisää aloitusnäytölle', vahvista sitten."
  },
  'es-ES': {
    ios: "Pulsa el icono Compartir de Safari (cuadrado con flecha) y elige 'Añadir a pantalla de inicio'.",
    android: "Abre el menú del navegador (⋮) y elige 'Añadir a pantalla de inicio', confirma después."
  },
  'fr-FR': {
    ios: "Appuyez sur l'icône Partager de Safari (carré avec flèche) et choisissez « Ajouter à l'écran d'accueil ». ",
    android: "Ouvrez le menu du navigateur (⋮) et choisissez « Ajouter à l'écran d'accueil », puis confirmez."
  },
  'it-IT': {
    ios: "Tocca l'icona Condividi di Safari (quadrato con freccia) e scegli 'Aggiungi a Home'.",
    android: "Apri il menu del browser (⋮) e scegli 'Aggiungi a schermata Home', poi conferma."
  },
  'de-DE': {
    ios: "Tippen Sie auf das Teilen-Symbol von Safari (Quadrat mit Pfeil) und wählen Sie 'Zum Home-Bildschirm'.",
    android: "Öffnen Sie das Browser-Menü (⋮) und wählen Sie 'Zum Startbildschirm', bestätigen Sie danach."
  }
};

const LANGUAGE_DATA_15 = {
  'en-GB': {
    locale: 'en-GB',
    htmlLang: 'en',
    strings: {
      pageTitle: 'Oxy... 14-tray Counting Helper',
      heading: 'Oxy— Audit Helper',
      resultsTitle: 'Results',
      howCalculatedTitle: "How it's Calculated",
      labels: {
        box98: 'Box 98',
        box28: 'Box 28',
        tray: 'Tray 14',
        extra: 'Singles'
      },
      aria: {
        box98: 'Boxes of 98',
        box28: 'Boxes of 28',
        tray: 'Tray 14',
        extra: 'Singles'
      },
      totalLabel: 'Total',
      totalUnits: 'tablets or capsules',
      calculationHeading: 'Calculation:',
      clearButton: 'Clear',
      clearAria: 'Clear all counts',
      updateNotice: '🔄 NurseCalc is being updated...',
      shareNotification: {
        message: 'Use Share to send this helper to friends. To save it on your device: {instructions}',
        shareButton: 'Share...',
        cancelButton: 'Cancel'
      },
      settings: {
        title: 'Settings',
        description: 'Choose your preferred language for this calculator.',
        languageLegend: 'Language',
        options: {
          'en-GB': 'English (UK)',
          'nb-NO': 'Norsk (Bokmål)',
          'nn-NO': 'Norsk (Nynorsk)',
          'sv-SE': 'Svenska',
          'da-DK': 'Dansk',
          'fi-FI': 'Suomi',
          'es-ES': 'Español',
          'fr-FR': 'Français',
          'it-IT': 'Italiano',
          'de-DE': 'Deutsch'
        },
        closeAria: 'Close Settings',
        gearLabel: 'Settings'
      },
      footer: {
        disclaimerHtml: `<strong>Disclaimer</strong><br />This site is not CE-marked and not a medical device.<br />The calculators have not been validated and may contain errors.<br />They must not be used for patient-specific decisions — they are for educational and general guidance only.<br />Always check results yourself and confirm against official guidelines, product information, and clinical judgement.<br />Use entirely at your own risk.<br />`,
        copyrightHtml: '&copy; 2025 Andrew S. Louka'
      }
    }
  },
  'nb-NO': {
    locale: 'nb-NO',
    htmlLang: 'nb',
    strings: {
      pageTitle: 'Oxy... 14-brett teller',
      heading: 'Oxy— tellehjelp',
      resultsTitle: 'Resultater',
      howCalculatedTitle: 'Slik beregnes det',
      labels: {
        box98: 'Eske 98',
        box28: 'Eske 28',
        tray: 'Brett 14',
        extra: 'Enkelt-tabletter'
      },
      aria: {
        box98: 'Antall esker à 98',
        box28: 'Antall esker à 28',
        tray: 'Antall brett à 14',
        extra: 'Antall enkelt-tabletter'
      },
      totalLabel: 'Totalt',
      totalUnits: 'tabletter eller kapsler',
      calculationHeading: 'Beregning:',
      clearButton: 'Nullstill',
      clearAria: 'Nullstill alle tellinger',
      updateNotice: '🔄 NurseCalc oppdateres...',
      shareNotification: {
        message: 'Bruk Del for å sende dette verktøyet til venner. For å lagre det på enheten: {instructions}',
        shareButton: 'Del',
        cancelButton: 'Avbryt'
      },
      settings: {
        title: 'Innstillinger',
        description: 'Velg ønsket språk for denne kalkulatoren.',
        languageLegend: 'Språk',
        options: {
          'en-GB': 'English (UK)',
          'nb-NO': 'Norsk (Bokmål)',
          'nn-NO': 'Norsk (Nynorsk)',
          'sv-SE': 'Svenska',
          'da-DK': 'Dansk',
          'fi-FI': 'Suomi',
          'es-ES': 'Español',
          'fr-FR': 'Français',
          'it-IT': 'Italiano',
          'de-DE': 'Deutsch'
        },
        closeAria: 'Lukk innstillinger',
        gearLabel: 'Innstillinger'
      },
      footer: {
        disclaimerHtml: `<strong>Ansvarsfraskrivelse</strong><br />Dette nettstedet er ikke CE-merket og er ikke et medisinsk utstyr.<br />Kalkulatorene er ikke validert og kan inneholde feil.<br />De må ikke brukes til pasientspesifikke beslutninger — de er kun for opplæring og generell veiledning.<br />Kontroller alltid resultatene selv og bekreft mot offisielle retningslinjer, produktinformasjon og klinisk skjønn.<br />Bruk skjer fullt og helt på eget ansvar.<br />`,
        copyrightHtml: '&copy; 2025 Andrew S. Louka'
      }
    }
  },
  'nn-NO': {
    locale: 'nn-NO',
    htmlLang: 'nn',
    strings: {
      pageTitle: 'Oxy... 14-brett teljehjelp',
      heading: 'Oxy— teljehjelp',
      resultsTitle: 'Resultat',
      howCalculatedTitle: 'Slik blir det rekna ut',
      labels: {
        box98: 'Eske 98',
        box28: 'Eske 28',
        tray: 'Brett 14',
        extra: 'Enkelt-tablettar'
      },
      aria: {
        box98: 'Talet på esker à 98',
        box28: 'Talet på esker à 28',
        tray: 'Talet på brett à 14',
        extra: 'Talet på enkelt-tablettar'
      },
      totalLabel: 'Totalt',
      totalUnits: 'tablettar eller kapslar',
      calculationHeading: 'Utrekning:',
      clearButton: 'Nullstill',
      clearAria: 'Nullstill alle teljingane',
      updateNotice: '🔄 NurseCalc blir oppdatert...',
      shareNotification: {
        message: 'Bruk Del for å sende dette verktøyet til venner. For å lagre det på enheten: {instructions}',
        shareButton: 'Del',
        cancelButton: 'Avbryt'
      },
      settings: {
        title: 'Innstillingar',
        description: 'Vel språket du vil bruke for denne kalkulatoren.',
        languageLegend: 'Språk',
        options: {
          'en-GB': 'English (UK)',
          'nb-NO': 'Norsk (Bokmål)',
          'nn-NO': 'Norsk (Nynorsk)',
          'sv-SE': 'Svenska',
          'da-DK': 'Dansk',
          'fi-FI': 'Suomi',
          'es-ES': 'Español',
          'fr-FR': 'Français',
          'it-IT': 'Italiano',
          'de-DE': 'Deutsch'
        },
        closeAria: 'Lukk innstillingar',
        gearLabel: 'Innstillingar'
      },
      footer: {
        disclaimerHtml: `<strong>Ansvarsfråskriving</strong><br />Denne nettstaden er ikkje CE-merkt og er ikkje eit medisinsk produkt.<br />Kalkulatorane er ikkje validerte og kan innehalde feil.<br />Dei skal ikkje brukast til pasientspesifikke avgjerder — dei er berre for opplæring og generell rettleiing.<br />Kontroller alltid resultata sjølv og stadfest mot offisielle retningsliner, produktinformasjon og klinisk skjønn.<br />Du bruker tenesta heilt på eige ansvar.<br />`,
        copyrightHtml: '&copy; 2025 Andrew S. Louka'
      }
    }
  },
  'sv-SE': {
    locale: 'sv-SE',
    htmlLang: 'sv',
    strings: {
      pageTitle: 'Oxy... 14-bricka räknehjälp',
      heading: 'Oxy— räknehjälp',
      resultsTitle: 'Resultat',
      howCalculatedTitle: 'Så beräknas det',
      labels: {
        box98: 'Ask 98',
        box28: 'Ask 28',
        tray: 'Bricka 14',
        extra: 'Enstaka tabletter'
      },
      aria: {
        box98: 'Antal askar à 98',
        box28: 'Antal askar à 28',
        tray: 'Antal brickor à 14',
        extra: 'Antal enstaka tabletter'
      },
      totalLabel: 'Totalt',
      totalUnits: 'tabletter eller kapslar',
      calculationHeading: 'Beräkning:',
      clearButton: 'Nollställ',
      clearAria: 'Nollställ alla räkningar',
      updateNotice: '🔄 NurseCalc uppdateras...',
      shareNotification: {
        message: 'Använd Dela för att skicka det här verktyget till vänner. För att spara det: {instructions}',
        shareButton: 'Dela',
        cancelButton: 'Avbryt'
      },
      settings: {
        title: 'Inställningar',
        description: 'Välj vilket språk du vill använda för den här kalkylatorn.',
        languageLegend: 'Språk',
        options: {
          'en-GB': 'English (UK)',
          'nb-NO': 'Norsk (Bokmål)',
          'nn-NO': 'Norsk (Nynorsk)',
          'sv-SE': 'Svenska',
          'da-DK': 'Dansk',
          'fi-FI': 'Suomi',
          'es-ES': 'Español',
          'fr-FR': 'Français',
          'it-IT': 'Italiano',
          'de-DE': 'Deutsch'
        },
        closeAria: 'Stäng inställningar',
        gearLabel: 'Inställningar'
      },
      footer: {
        disclaimerHtml: `<strong>Ansvarsfriskrivning</strong><br />Den här webbplatsen är inte CE-märkt och är inte en medicinteknisk produkt.<br />Kalkylatorerna är inte validerade och kan innehålla fel.<br />De får inte användas för patientanpassade beslut — de är endast för utbildning och allmän vägledning.<br />Kontrollera alltid resultaten själv och jämför med officiella riktlinjer, produktinformation och kliniskt omdöme.<br />Användningen sker helt på egen risk.<br />`,
        copyrightHtml: '&copy; 2025 Andrew S. Louka'
      }
    }
  },
  'da-DK': {
    locale: 'da-DK',
    htmlLang: 'da',
    strings: {
      pageTitle: 'Oxy... 14-bakke optællingshjælp',
      heading: 'Oxy— optællingshjælp',
      resultsTitle: 'Resultater',
      howCalculatedTitle: 'Sådan beregnes det',
      labels: {
        box98: 'Æske 98',
        box28: 'Æske 28',
        tray: 'Bakke 14',
        extra: 'Enkelttabletter'
      },
      aria: {
        box98: 'Antal æsker à 98',
        box28: 'Antal æsker à 28',
        tray: 'Antal bakker à 14',
        extra: 'Antal enkelttabletter'
      },
      totalLabel: 'I alt',
      totalUnits: 'tabletter eller kapsler',
      calculationHeading: 'Beregning:',
      clearButton: 'Nulstil',
      clearAria: 'Nulstil alle optællinger',
      updateNotice: '🔄 NurseCalc opdateres...',
      shareNotification: {
        message: 'Brug Del for at sende dette værktøj til venner. For at gemme det: {instructions}',
        shareButton: 'Del',
        cancelButton: 'Annuller'
      },
      settings: {
        title: 'Indstillinger',
        description: 'Vælg dit foretrukne sprog til denne beregner.',
        languageLegend: 'Sprog',
        options: {
          'en-GB': 'English (UK)',
          'nb-NO': 'Norsk (Bokmål)',
          'nn-NO': 'Norsk (Nynorsk)',
          'sv-SE': 'Svenska',
          'da-DK': 'Dansk',
          'fi-FI': 'Suomi',
          'es-ES': 'Español',
          'fr-FR': 'Français',
          'it-IT': 'Italiano',
          'de-DE': 'Deutsch'
        },
        closeAria: 'Luk indstillinger',
        gearLabel: 'Indstillinger'
      },
      footer: {
        disclaimerHtml: `<strong>Ansvarsfraskrivelse</strong><br />Dette websted er ikke CE-mærket og er ikke et medicinsk udstyr.<br />Kalkulatorerne er ikke valideret og kan indeholde fejl.<br />De må ikke bruges til patient-specifikke beslutninger — de er kun til uddannelse og generel vejledning.<br />Kontroller altid resultaterne selv og bekræft dem mod officielle retningslinjer, produktinformation og klinisk skøn.<br />Brug sker helt på eget ansvar.<br />`,
        copyrightHtml: '&copy; 2025 Andrew S. Louka'
      }
    }
  },
  'fi-FI': {
    locale: 'fi-FI',
    htmlLang: 'fi',
    strings: {
      pageTitle: 'Oxy... 14-alustan laskenta-apu',
      heading: 'Oxy— laskenta-apu',
      resultsTitle: 'Tulokset',
      howCalculatedTitle: 'Näin se lasketaan',
      labels: {
        box98: 'Laatikko 98',
        box28: 'Laatikko 28',
        tray: 'Tarjotin 14',
        extra: 'Yksittäiset tabletit'
      },
      aria: {
        box98: '98-tablettisten laatikoiden määrä',
        box28: '28-tablettisten laatikoiden määrä',
        tray: '14-tablettisten tarjottimien määrä',
        extra: 'Yksittäisten tablettien määrä'
      },
      totalLabel: 'Yhteensä',
      totalUnits: 'tabletit tai kapselit',
      calculationHeading: 'Laskenta:',
      clearButton: 'Tyhjennä',
      clearAria: 'Tyhjennä kaikki valinnat',
      updateNotice: '🔄 NurseCalc päivittyy...',
      shareNotification: {
        message: 'Käytä Jaa-toimintoa lähettääksesi tämän työkalun ystäville. Tallentaaksesi sen: {instructions}',
        shareButton: 'Jaa',
        cancelButton: 'Peruuta'
      },
      settings: {
        title: 'Asetukset',
        description: 'Valitse tämän laskurin käyttämä kieli.',
        languageLegend: 'Kieli',
        options: {
          'en-GB': 'English (UK)',
          'nb-NO': 'Norsk (Bokmål)',
          'nn-NO': 'Norsk (Nynorsk)',
          'sv-SE': 'Svenska',
          'da-DK': 'Dansk',
          'fi-FI': 'Suomi',
          'es-ES': 'Español',
          'fr-FR': 'Français',
          'it-IT': 'Italiano',
          'de-DE': 'Deutsch'
        },
        closeAria: 'Sulje asetukset',
        gearLabel: 'Asetukset'
      },
      footer: {
        disclaimerHtml: `<strong>Vastuuvapauslauseke</strong><br />Tämä sivusto ei ole CE-merkitty eikä se ole lääkinnällinen laite.<br />Laskurit eivät ole validoituja ja niissä voi olla virheitä.<br />Niitä ei saa käyttää potilaskohtaisiin päätöksiin — ne on tarkoitettu vain koulutukseen ja yleiseen ohjaukseen.<br />Tarkista tulokset aina itse ja varmista ne virallisten ohjeiden, valmisteyhteenvedon ja kliinisen harkinnan avulla.<br />Käytät palvelua täysin omalla vastuullasi.<br />`,
        copyrightHtml: '&copy; 2025 Andrew S. Louka'
      }
    }
  },
  'es-ES': {
    locale: 'es-ES',
    htmlLang: 'es',
    strings: {
      pageTitle: 'Oxy... asistente de conteo de bandejas de 14',
      heading: 'Oxy— asistente de conteo',
      resultsTitle: 'Resultados',
      howCalculatedTitle: 'Cómo se calcula',
      labels: {
        box98: 'Caja 98',
        box28: 'Caja 28',
        tray: 'Bandeja 14',
        extra: 'Tabletas sueltas'
      },
      aria: {
        box98: 'Número de cajas de 98',
        box28: 'Número de cajas de 28',
        tray: 'Número de bandejas de 14',
        extra: 'Número de tabletas sueltas'
      },
      totalLabel: 'Total',
      totalUnits: 'tabletas o cápsulas',
      calculationHeading: 'Cálculo:',
      clearButton: 'Restablecer',
      clearAria: 'Restablecer todos los conteos',
      updateNotice: '🔄 NurseCalc se está actualizando...',
      shareNotification: {
        message: 'Usa Compartir para enviar esta herramienta a tus amigos. Para guardarla: {instructions}',
        shareButton: 'Compartir',
        cancelButton: 'Cancelar'
      },
      settings: {
        title: 'Configuración',
        description: 'Elige el idioma que quieres usar en esta calculadora.',
        languageLegend: 'Idioma',
        options: {
          'en-GB': 'English (UK)',
          'nb-NO': 'Norsk (Bokmål)',
          'nn-NO': 'Norsk (Nynorsk)',
          'sv-SE': 'Svenska',
          'da-DK': 'Dansk',
          'fi-FI': 'Suomi',
          'es-ES': 'Español',
          'fr-FR': 'Français',
          'it-IT': 'Italiano',
          'de-DE': 'Deutsch'
        },
        closeAria: 'Cerrar configuración',
        gearLabel: 'Configuración'
      },
      footer: {
        disclaimerHtml: `<strong>Aviso legal</strong><br />Este sitio no tiene marcado CE y no es un dispositivo médico.<br />Las calculadoras no están validadas y pueden contener errores.<br />No deben utilizarse para decisiones específicas de pacientes — son solo para formación y orientación general.<br />Comprueba siempre los resultados por tu cuenta y contrástalos con las guías oficiales, la información del producto y tu juicio clínico.<br />Usas este servicio bajo tu propia responsabilidad.<br />`,
        copyrightHtml: '&copy; 2025 Andrew S. Louka'
      }
    }
  },
  'fr-FR': {
    locale: 'fr-FR',
    htmlLang: 'fr',
    strings: {
      pageTitle: 'Oxy... aide au comptage de plateaux de 14',
      heading: 'Oxy— aide au comptage',
      resultsTitle: 'Résultats',
      howCalculatedTitle: 'Comment c\'est calculé',
      labels: {
        box98: 'Boîte 98',
        box28: 'Boîte 28',
        tray: 'Plateau 14',
        extra: 'Comprimés unitaires'
      },
      aria: {
        box98: 'Nombre de boîtes de 98',
        box28: 'Nombre de boîtes de 28',
        tray: 'Nombre de plateaux de 14',
        extra: 'Nombre de comprimés unitaires'
      },
      totalLabel: 'Total',
      totalUnits: 'comprimés ou gélules',
      calculationHeading: 'Calcul :',
      clearButton: 'Réinitialiser',
      clearAria: 'Réinitialiser tous les comptages',
      updateNotice: '🔄 NurseCalc est en cours de mise à jour...',
      shareNotification: {
        message: 'Utilisez Partager pour envoyer cet outil à vos amis. Pour l\'enregistrer : {instructions}',
        shareButton: 'Partager',
        cancelButton: 'Annuler'
      },
      settings: {
        title: 'Paramètres',
        description: 'Choisissez la langue à utiliser pour cette calculatrice.',
        languageLegend: 'Langue',
        options: {
          'en-GB': 'English (UK)',
          'nb-NO': 'Norsk (Bokmål)',
          'nn-NO': 'Norsk (Nynorsk)',
          'sv-SE': 'Svenska',
          'da-DK': 'Dansk',
          'fi-FI': 'Suomi',
          'es-ES': 'Español',
          'fr-FR': 'Français',
          'it-IT': 'Italiano',
          'de-DE': 'Deutsch'
        },
        closeAria: 'Fermer les paramètres',
        gearLabel: 'Paramètres'
      },
      footer: {
        disclaimerHtml: `<strong>Avertissement</strong><br />Ce site n'est pas marqué CE et n'est pas un dispositif médical.<br />Les calculateurs ne sont pas validés et peuvent contenir des erreurs.<br />Ils ne doivent pas être utilisés pour des décisions propres à un patient — ils sont uniquement destinés à la formation et à l'orientation générale.<br />Vérifiez toujours les résultats vous-même et confirmez-les avec les recommandations officielles, les informations produit et votre jugement clinique.<br />Vous utilisez ce service entièrement à vos risques et périls.<br />`,
        copyrightHtml: '&copy; 2025 Andrew S. Louka'
      }
    }
  },
  'it-IT': {
    locale: 'it-IT',
    htmlLang: 'it',
    strings: {
      pageTitle: 'Oxy... assistente conteggio vassoi da 14',
      heading: 'Oxy— assistente al conteggio',
      resultsTitle: 'Risultati',
      howCalculatedTitle: 'Come viene calcolato',
      labels: {
        box98: 'Scatola 98',
        box28: 'Scatola 28',
        tray: 'Vassoio 14',
        extra: 'Compresse singole'
      },
      aria: {
        box98: 'Numero di scatole da 98',
        box28: 'Numero di scatole da 28',
        tray: 'Numero di vassoi da 14',
        extra: 'Numero di compresse singole'
      },
      totalLabel: 'Totale',
      totalUnits: 'compresse o capsule',
      calculationHeading: 'Calcolo:',
      clearButton: 'Azzera',
      clearAria: 'Azzera tutti i conteggi',
      updateNotice: '🔄 NurseCalc è in aggiornamento...',
      shareNotification: {
        message: 'Usa Condividi per inviare questo strumento agli amici. Per salvarlo: {instructions}',
        shareButton: 'Condividi',
        cancelButton: 'Annulla'
      },
      settings: {
        title: 'Impostazioni',
        description: 'Scegli la lingua da usare per questa calcolatrice.',
        languageLegend: 'Lingua',
        options: {
          'en-GB': 'English (UK)',
          'nb-NO': 'Norsk (Bokmål)',
          'nn-NO': 'Norsk (Nynorsk)',
          'sv-SE': 'Svenska',
          'da-DK': 'Dansk',
          'fi-FI': 'Suomi',
          'es-ES': 'Español',
          'fr-FR': 'Français',
          'it-IT': 'Italiano',
          'de-DE': 'Deutsch'
        },
        closeAria: 'Chiudi impostazioni',
        gearLabel: 'Impostazioni'
      },
      footer: {
        disclaimerHtml: `<strong>Avvertenza</strong><br />Questo sito non ha marcatura CE e non è un dispositivo medico.<br />Le calcolatrici non sono validate e possono contenere errori.<br />Non devono essere utilizzate per decisioni specifiche sui pazienti — sono solo per formazione e orientamento generale.<br />Controlla sempre personalmente i risultati e confermali con le linee guida ufficiali, le informazioni sul prodotto e il giudizio clinico.<br />L'uso del servizio avviene interamente a tuo rischio.<br />`,
        copyrightHtml: '&copy; 2025 Andrew S. Louka'
      }
    }
  },
  'de-DE': {
    locale: 'de-DE',
    htmlLang: 'de',
    strings: {
      pageTitle: 'Oxy... 14er-Tablettenzählhilfe',
      heading: 'Oxy— Zählhilfe',
      resultsTitle: 'Ergebnisse',
      howCalculatedTitle: 'So wird gerechnet',
      labels: {
        box98: 'Packung 98',
        box28: 'Packung 28',
        tray: 'Blister 14',
        extra: 'Einzeltabletten'
      },
      aria: {
        box98: 'Anzahl der Packungen à 98',
        box28: 'Anzahl der Packungen à 28',
        tray: 'Anzahl der Blister à 14',
        extra: 'Anzahl der Einzeltabletten'
      },
      totalLabel: 'Gesamt',
      totalUnits: 'Tabletten oder Kapseln',
      calculationHeading: 'Berechnung:',
      clearButton: 'Zurücksetzen',
      clearAria: 'Alle Zählungen zurücksetzen',
      updateNotice: '🔄 NurseCalc wird aktualisiert...',
      shareNotification: {
        message: 'Verwenden Sie Teilen, um dieses Tool an Freunde zu senden. Um es zu speichern: {instructions}',
        shareButton: 'Teilen',
        cancelButton: 'Abbrechen'
      },
      settings: {
        title: 'Einstellungen',
        description: 'Wähle die Sprache für diesen Rechner.',
        languageLegend: 'Sprache',
        options: {
          'en-GB': 'English (UK)',
          'nb-NO': 'Norsk (Bokmål)',
          'nn-NO': 'Norsk (Nynorsk)',
          'sv-SE': 'Svenska',
          'da-DK': 'Dansk',
          'fi-FI': 'Suomi',
          'es-ES': 'Español',
          'fr-FR': 'Français',
          'it-IT': 'Italiano',
          'de-DE': 'Deutsch'
        },
        closeAria: 'Einstellungen schließen',
        gearLabel: 'Einstellungen'
      },
      footer: {
        disclaimerHtml: `<strong>Haftungsausschluss</strong><br />Diese Website ist nicht CE-gekennzeichnet und kein Medizinprodukt.<br />Die Rechner sind nicht validiert und können Fehler enthalten.<br />Sie dürfen nicht für patientenspezifische Entscheidungen verwendet werden — sie dienen nur zu Schulungszwecken und als allgemeine Orientierung.<br />Prüfe die Ergebnisse stets selbst und vergleiche sie mit offiziellen Richtlinien, Produktinformationen und deinem klinischen Urteil.<br />Die Nutzung erfolgt vollständig auf eigenes Risiko.<br />`,
        copyrightHtml: '&copy; 2025 Andrew S. Louka'
      }
    }
  }
};

let currentLanguage15 = DEFAULT_LANGUAGE_15;
let integerFormatter15 = new Intl.NumberFormat(LANGUAGE_DATA_15[DEFAULT_LANGUAGE_15].locale, { maximumFractionDigits: 0 });
let shareOverlayOpenedAt = 0;

async function tryHostShare(payload) {
  if (!window.top || window.top === window) return false;
  const topNavigator = window.top.navigator;
  if (topNavigator && typeof topNavigator.share === 'function') {
    try {
      await topNavigator.share(payload);
      return true;
    } catch (err) {
      if (err && (err.name === 'AbortError' || err.name === 'NotAllowedError')) {
        return true;
      }
      console.warn('Oxyaudit host navigator.share failed:', err);
    }
  }
  try {
    window.top.postMessage({ type: 'oxy-share-request', payload }, '*');
    return true;
  } catch (err) {
    console.warn('Oxyaudit unable to postMessage host for sharing:', err);
  }
  return false;
}

// Mark as embedded when shown inside index.html's iframe
if (window.top !== window.self) {
  document.documentElement.classList.add('embedded');
  document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('embedded');
  });
}



// FUNCTIONS START HERE
function getLangData15() {
  return LANGUAGE_DATA_15[currentLanguage15] || LANGUAGE_DATA_15[DEFAULT_LANGUAGE_15];
}

function createNumberFormatters15(locale) {
  integerFormatter15 = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
}

function formatInt15(value) {
  return integerFormatter15.format(value).replace(/[\u00A0\u202F]/g, ' ');
}

function applyFooterText15(langData) {
  const footerStrings = langData.strings.footer;
  if (!footerStrings) return;
  const disclaimer = document.getElementById('footer-disclaimer');
  if (disclaimer && footerStrings.disclaimerHtml) {
    disclaimer.innerHTML = footerStrings.disclaimerHtml;
  }
  const copyright = document.getElementById('footer-copyright');
  if (copyright && footerStrings.copyrightHtml) {
    copyright.innerHTML = footerStrings.copyrightHtml;
  }
}

function showShareOverlay() {
  if (!shareOverlay) return;
  shareOverlay.classList.add('visible');
  shareOverlay.removeAttribute('aria-hidden');
  shareOverlayShare?.focus();
  document.body.classList.add('share-overlay-visible');
  shareOverlayOpenedAt = Date.now();
}

function hideShareOverlay() {
  if (!shareOverlay) return;
  shareOverlay.classList.remove('visible');
  shareOverlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('share-overlay-visible');
  shareButton?.focus();
}

function isIOSPlatform() {
  const ua = navigator.userAgent || navigator.vendor || window.opera || '';
  const platform = navigator.platform || '';
  const isIOSDevice = /iPad|iPhone|iPod/.test(ua);
  const isMacTouch = platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return isIOSDevice || isMacTouch;
}

function getAddToHomeInstructions(locale) {
  const key = locale && ADD_TO_HOME_INSTRUCTIONS[locale] ? locale : 'en-GB';
  const entry = ADD_TO_HOME_INSTRUCTIONS[key] || ADD_TO_HOME_INSTRUCTIONS['en-GB'];
  const channel = isIOSPlatform() ? 'ios' : 'android';
  return entry[channel] || entry.ios || entry.android || '';
}

function formatShareMessage(message, instructions) {
  const base = message || DEFAULT_SHARE_MESSAGE;
  if (base.includes(SHARE_INSTRUCTION_PLACEHOLDER)) {
    return base.replace(SHARE_INSTRUCTION_PLACEHOLDER, instructions || '');
  }
  if (instructions) {
    return `${base} ${instructions}`;
  }
  return base;
}

function buildSharePayload() {
  const langData = getLangData15();
  return {
    title: document.title || (langData?.strings?.heading) || 'Oxyaudit',
    text: 'OxyAudit Helper App',
    url: getShareUrl()
  };
}

function getShareUrl() {
  try {
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = '';
    let path = url.pathname || '/';
    path = path.replace(/calc15\.html?\/?$/i, '/');
    path = path.replace(/\.html?\/?$/i, '/');
    path = path.replace(/\/+/g, '/');
    if (!path.endsWith('/')) {
      path += '/';
    }
    if (path === '//') {
      path = '/';
    }
    url.pathname = path;
    return url.toString();
  } catch (_) {
    return 'https://louka.net/oxyaudit/';
  }
}

async function tryNativeShare() {
  const payload = buildSharePayload();
  if (await tryHostShare(payload)) {
    return true;
  }
  if (!navigator.share || typeof navigator.share !== 'function') {
    return false;
  }
  try {
    await navigator.share(payload);
    return true;
  } catch (err) {
    if (err && (err.name === 'AbortError' || err.name === 'NotAllowedError')) {
      return true;
    }
    console.warn('Oxyaudit share failed:', err);
    return false;
  }
}

function updateSupplementaryHeadings15(langData) {
  const how = document.querySelector('.how-title');
  if (how) how.textContent = langData.strings.howCalculatedTitle;
}

function applySettingsText15(langData) {
  const strings = langData.strings.settings;
  if (settingsTitle) settingsTitle.textContent = strings.title;
  if (settingsDescription) settingsDescription.textContent = strings.description;
  if (settingsLegend) settingsLegend.textContent = strings.languageLegend;
  if (settingsClose) {
    settingsClose.setAttribute('aria-label', strings.closeAria);
    settingsClose.setAttribute('title', strings.closeAria);
  }
  document.querySelectorAll('[data-language-option]').forEach((el) => {
    const key = el.getAttribute('data-language-option');
    if (key && strings.options[key]) {
      el.textContent = strings.options[key];
    }
  });
  if (settingsGear) {
    settingsGear.title = strings.gearLabel;
    settingsGear.setAttribute('aria-label', strings.gearLabel);
  }
}

function applyStaticText15(langData) {
  const strings = langData.strings;
  document.title = strings.pageTitle;
  document.documentElement.setAttribute('lang', langData.htmlLang);
  if (calcHeadingEl) calcHeadingEl.textContent = strings.heading;
  if (appbarTitle) appbarTitle.textContent = strings.heading;
  if (resultsTitleEl) resultsTitleEl.textContent = strings.resultsTitle;
  if (labelBox98) labelBox98.textContent = strings.labels.box98;
  if (labelBox28) labelBox28.textContent = strings.labels.box28;
  if (labelTray) labelTray.textContent = strings.labels.tray;
  if (labelExtra) labelExtra.textContent = strings.labels.extra;
  if (resetButton) {
    resetButton.textContent = strings.clearButton;
    resetButton.setAttribute('aria-label', strings.clearAria);
  }
  if (updateNoticeEl && strings.updateNotice) {
    updateNoticeEl.textContent = strings.updateNotice;
  }
  const shareStrings = strings.shareNotification || {};
  const shareMessage = formatShareMessage(shareStrings.message || DEFAULT_SHARE_MESSAGE, getAddToHomeInstructions(langData.locale));
  if (shareOverlayText) {
    shareOverlayText.textContent = shareMessage;
  }
  if (shareOverlayShare) {
    const shareLabel = shareStrings.shareButton || 'Share...';
    shareOverlayShare.textContent = shareLabel;
    shareOverlayShare.setAttribute('aria-label', shareLabel);
  }
  if (shareOverlayCancel) {
    const cancelLabel = shareStrings.cancelButton || 'Cancel';
    shareOverlayCancel.textContent = cancelLabel;
    shareOverlayCancel.setAttribute('aria-label', cancelLabel);
  }

  document.querySelectorAll('[data-aria-key]').forEach((el) => {
    const key = el.getAttribute('data-aria-key');
    if (key && strings.aria[key]) {
      el.setAttribute('aria-label', strings.aria[key]);
    }
  });

  updateSupplementaryHeadings15(langData);
  applyFooterText15(langData);
}

function syncLanguageRadios15() {
  languageRadios.forEach((radio) => {
    radio.checked = radio.value === currentLanguage15;
  });
}

function openSettings15() {
  document.body.classList.add('showing-settings');
  settingsPanel?.style.setProperty('display', 'block', 'important');
  calcHeadingEl?.style.setProperty('display', 'none', 'important');
}

function closeSettings15() {
  document.body.classList.remove('showing-settings');
  settingsPanel?.style.removeProperty('display');
  calcHeadingEl?.style.removeProperty('display');
}

function setLanguage15(lang, { persist = true, recalc = true } = {}) {
  if (!LANGUAGE_DATA_15[lang]) lang = DEFAULT_LANGUAGE_15;
  const changed = lang !== currentLanguage15;
  currentLanguage15 = lang;
  const langData = getLangData15();
  createNumberFormatters15(langData.locale);
  if (persist) {
    try {
      localStorage.setItem(LANGUAGE_KEY_15, currentLanguage15);
    } catch (err) {
      // ignore
    }
  }
  applyStaticText15(langData);
  applySettingsText15(langData);
  syncLanguageRadios15();
  if (changed || recalc) {
    if (selected98 || selected28 || selectedTrays || selectedExtra) {
      calculateTotalTablets();
    }
  }
}

// === 3. STATE TRACKERS ===
let selected98 = 0;
let selected28 = 0;
let selectedTrays = 0;
let selectedExtra = 0;

// === 3.5 SCROLL FUNCTION ===
// Define scroll target with "id"
function scrollCalculatorIntoView() {
  // no-op: keep viewport stable after interactions
}

// === 4. BUTTON GROUP HANDLER ===
function createToggleButtons(container, range, groupName, callback) {
  container.classList.add("compact-grid"); // apply tighter layout

  for (let i = 0; i <= range; i++) {  // set to 1 if first button should be 1
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "toggle-button";
    btn.textContent = i;
    btn.dataset.value = i;
    btn.addEventListener("click", () => {
      container
        .querySelectorAll(".toggle-button")
        .forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      callback(i);
    });
    container.appendChild(btn);
  }
}

// === 5. RESULT CALCULATION ===
function calculateTotalTablets() {
  const strings = getLangData15().strings;
  const total =
    selected98 * 98 +
    selected28 * 28 +
    selectedTrays * TABLETS_PER_TRAY +
    selectedExtra;

  const totalText = formatInt15(total);

  resultDiv.innerHTML = `
    <div class="result-text">
      <small>${strings.totalLabel}</small><br>
      <strong>${totalText}</strong>
      <br><small>${strings.totalUnits}</small>
    </div>
  `;

  calculationBody.innerHTML = `
    <p>${strings.calculationHeading}</p>
    <p>
      (${selected98} × 98) + (${selected28} × 28)<br>
      + (${selectedTrays} × ${TABLETS_PER_TRAY}) + ${selectedExtra}<br>
      = <strong>${totalText}</strong>
    </p>
  `;

  // Always-visible calculations: hide header, show body with results
  calculationHeader.style.display = "none";
  calculationBody.style.display = "block";
  resultBox.style.display = "block";
  if (resultDivider) resultDivider.style.display = "none";
  if (clearContainer) clearContainer.style.display = "flex";
}

// === 6. RESET FUNCTIONALITY ===
// --- Oxyaudit: show the yellow update banner immediately (no dependencies) ---
function oxyShowReloadBannerNow() {
  try {
    // Prefer the updater's banner if present
    if (window.__oxyUpdate && typeof window.__oxyUpdate._forceShow === 'function') {
      window.__oxyUpdate._forceShow();
      return;
    }

    // Fallback: paint our own banner, same ID and look
    var n = document.getElementById('update-notice');
    if (!n) {
      n = document.createElement('div');
      n.id = 'update-notice';
      document.body.appendChild(n);
    }
    const msg = (getLangData15()?.strings?.updateNotice) || '🔄 App is being updated...';
    n.textContent = msg;

    // Ensure it's visible even if any CSS tries to hide it
    n.classList.add('visible');
    n.style.display = 'block';
    n.style.position = 'fixed';
    n.style.left = '0';
    n.style.right = '0';
    n.style.top = 'calc(env(safe-area-inset-top, 0px) + var(--appbar-height, 56px) + .5rem)';
    n.style.margin = '0 auto';
    n.style.width = 'min(700px, calc(100% - 1.5rem))';
    n.style.zIndex = '99999';
    n.style.cursor = 'pointer';
    n.style.transform = 'none';

    // Basic visual safety if CSS sheet failed to load
    n.style.background = n.style.background || '#ffcc33';
    n.style.color = n.style.color || '#333';
    n.style.fontWeight = n.style.fontWeight || '600';
    n.style.textAlign = n.style.textAlign || 'center';
    n.style.padding = n.style.padding || '0.8rem 1rem';
    n.style.border = n.style.border || '0.5px solid #f0c000';
    n.style.borderRadius = n.style.borderRadius || '8px';
    n.style.boxShadow = n.style.boxShadow || '0 4px 10px rgba(0,0,0,.25)';
  } catch (_) { /* ignore */ }
}

// Make available to console and other scripts
window.oxyShowReloadBannerNow = oxyShowReloadBannerNow;


function resetAll() {
  selected98 = 0;
  selected28 = 0;
  selectedTrays = 0;
  selectedExtra = 0;

  document
    .querySelectorAll(".toggle-button")
    .forEach((btn) => btn.classList.remove("selected"));

  resultDiv.innerHTML = "";
  calculationBody.innerHTML = "";
  calculationHeader.style.display = "none";
  calculationBody.style.display = "none";
  resultBox.style.display = "none";
  if (resultDivider) resultDivider.style.display = "none";
  if (clearContainer) clearContainer.style.display = "none";
  if (window.innerWidth < 500) {
    scrollCalculatorIntoView();
  }
}

// === 7. INIT ===
createToggleButtons(box98Container, MAX_98_BOXES, "box98", (val) => {
  selected98 = parseInt(val);
  calculateTotalTablets();
});

createToggleButtons(box28Container, MAX_28_BOXES, "box28", (val) => {
  selected28 = parseInt(val);
  calculateTotalTablets();
});

createToggleButtons(trayContainer, MAX_TRAYS, "trays", (val) => {
  selectedTrays = parseInt(val);
  calculateTotalTablets();
});

createToggleButtons(extraTabletsContainer, MAX_EXTRA_TABLETS, "extra", (val) => {
  selectedExtra = parseInt(val);
  calculateTotalTablets();
});

// Reset button support
resetButton?.addEventListener("click", resetAll);

// Auto-scroll on mobile after initial render
window.addEventListener("load", () => {
  setTimeout(() => {
    scrollCalculatorIntoView();
  }, 200);
});

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('has-settings');

  let saved = null;
  try {
    saved = localStorage.getItem(LANGUAGE_KEY_15);
  } catch (err) {
    saved = null;
  }

  const browserLang = (navigator.language || '').toLowerCase();
  let initialLang = DEFAULT_LANGUAGE_15;
  if (saved && LANGUAGE_DATA_15[saved]) {
    initialLang = saved;
  } else if (browserLang.startsWith('nn') && LANGUAGE_DATA_15['nn-NO']) {
    initialLang = 'nn-NO';
  } else if (browserLang.startsWith('nb') && LANGUAGE_DATA_15['nb-NO']) {
    initialLang = 'nb-NO';
  } else if (browserLang.startsWith('sv') && LANGUAGE_DATA_15['sv-SE']) {
    initialLang = 'sv-SE';
  } else if (browserLang.startsWith('da') && LANGUAGE_DATA_15['da-DK']) {
    initialLang = 'da-DK';
  } else if (browserLang.startsWith('es') && LANGUAGE_DATA_15['es-ES']) {
    initialLang = 'es-ES';
  } else if (browserLang.startsWith('fr') && LANGUAGE_DATA_15['fr-FR']) {
    initialLang = 'fr-FR';
  } else if (browserLang.startsWith('it') && LANGUAGE_DATA_15['it-IT']) {
    initialLang = 'it-IT';
  } else if (browserLang.startsWith('de') && LANGUAGE_DATA_15['de-DE']) {
    initialLang = 'de-DE';
  } else if (browserLang.startsWith('fi') && LANGUAGE_DATA_15['fi-FI']) {
    initialLang = 'fi-FI';
  }
  setLanguage15(initialLang, { persist: !saved, recalc: false });
  syncLanguageRadios15();

  languageRadios.forEach((radio) => {
    radio.addEventListener('change', (event) => {
      if (event.target.checked) {
        setLanguage15(event.target.value);
      }
    });
  });

  settingsGear?.addEventListener('click', openSettings15);
  settingsClose?.addEventListener('click', closeSettings15);
  settingsPanel?.addEventListener('click', (event) => {
    if (event.target === settingsPanel) {
      closeSettings15();
    }
  });

  const shareOverlayHandler = (event) => {
    event.preventDefault();
    showShareOverlay();
  };
  shareButton?.addEventListener('click', shareOverlayHandler);
  shareButton?.addEventListener('touchend', shareOverlayHandler, { passive: false });
  shareButton?.addEventListener('touchstart', shareOverlayHandler, { passive: false });

  shareOverlayCancel?.addEventListener('click', (event) => {
    event.preventDefault();
    hideShareOverlay();
  });

  shareOverlayShare?.addEventListener('click', async (event) => {
    event.preventDefault();
    const shared = await tryNativeShare();
    if (!shared) {
      window.alert('Sharing is not available on this browser. Use your browser menu to share or add to your home screen.');
    }
    hideShareOverlay();
  });

  shareOverlay?.addEventListener('click', (event) => {
    if (event.target === shareOverlay) {
      if (Date.now() - shareOverlayOpenedAt < 250) return;
      hideShareOverlay();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('showing-settings')) {
      closeSettings15();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && shareOverlay?.classList.contains('visible')) {
      hideShareOverlay();
    }
  });

  const footerHolder = document.getElementById('footer-placeholder');
  if (footerHolder) {
    const observer = new MutationObserver(() => {
      applyFooterText15(getLangData15());
      observer.disconnect();
    });
    observer.observe(footerHolder, { childList: true, subtree: true });
  }
});

// === App Reset (force fresh load on settings close) =========================
(function () {
  const KEY = 'calc15.reloadOnClose';  // same key used by the toggle

  function getFlag() {
    try { return localStorage.getItem(KEY) === 'true'; } catch (_) { return false; }
  }
  function setFlag(v) {
    const on = !!v;
    try { localStorage.setItem(KEY, String(on)); } catch (_) { }
    const cb = document.getElementById('reload-on-close');
    if (cb) cb.checked = on;
  }

  // Hard reset routine: unregister SW, wipe caches, then hard reload
  async function hardReset() {
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister().catch(() => { })));
      }
      if (window.caches && caches.keys) {
        const names = await caches.keys();
        await Promise.all(names.map(n => caches.delete(n).catch(() => { })));
      }
    } catch (_) { /* ignore */ }
    const u = new URL(window.location.href);
    u.searchParams.set('reset', Date.now().toString());
    window.location.replace(u.toString());
  }

  function showBannerNow() {
    // Prefer the updater's own banner if available
    if (window.__oxyUpdate && typeof window.__oxyUpdate._forceShow === 'function') {
      window.__oxyUpdate._forceShow();
      return;
    }
    // Fallback to calc15’s helper if present
    if (typeof window.oxyShowReloadBannerNow === 'function') {
      window.oxyShowReloadBannerNow();
      return;
    }
    // Last-ditch: inline create + show
    var n = document.getElementById('update-notice');
    if (!n) { n = document.createElement('div'); n.id = 'update-notice'; document.body.appendChild(n); }
    const msg = (getLangData15()?.strings?.updateNotice) || '🔄 App is being updated...';
    n.textContent = msg;
    n.classList.add('visible');
    Object.assign(n.style, {
      display: 'block',
      position: 'fixed',
      left: '0', right: '0',
      top: 'calc(env(safe-area-inset-top, 0px) + var(--appbar-height, 56px) + .5rem)',
      margin: '0 auto',
      width: 'min(700px, calc(100% - 1.5rem))',
      zIndex: '99999',
      cursor: 'pointer',
      transform: 'none',
      background: '#ffcc33',
      color: '#333',
      fontWeight: '600',
      textAlign: 'center',
      padding: '0.8rem 1rem',
      border: '0.5px solid #f0c000',
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(0,0,0,.25)'
    });
  }

  function onCloseClick(e) {
    if (!getFlag()) return;          // slider OFF → do nothing
    e.preventDefault();
    e.stopImmediatePropagation();

    // Close the sheet
    if (typeof window.closeSettings15 === 'function') {
      window.closeSettings15();
    }

    // Ensure slider is OFF for next time
    setFlag(false);

    // Show confirmation banner, allow a paint, then reload once
    showBannerNow();
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setTimeout(hardResetReload, RELOAD_BANNER_PAUSE_MS);
      })
    );
  }

  function wire() {
    // Keep the checkbox state in sync with localStorage
    const cb = document.getElementById('reload-on-close');
    if (cb) {
      try { cb.checked = getFlag(); } catch (_) { }
      cb.addEventListener('change', function () {
        setFlag(!!this.checked);
      });
    }

    // Single authoritative handler on the close “X” button
    const closeEl = document.getElementById('settings-close');
    if (!closeEl) return;
    // Use capture to run before any legacy handlers
    closeEl.addEventListener('click', onCloseClick, { capture: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire, { once: true });
  } else {
    wire();
  }
})();
