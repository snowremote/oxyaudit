// SPDX-License-Identifier: Apache-2.0
// File: js/footer-loader.js
// Purpose: Inject a single local footer and localise it based on the calculator's language setting.
// Behaviour:
//  - Loads ./footer.html into #footer-placeholder
//  - Removes any other <footer> elements to avoid duplicate/legacy footers
//  - Replaces the disclaimer/copyright text with a translated version
//  - Listens for language radio changes (name="calc15-language") and updates live

(function () {
  'use strict';

  var TARGET_ID = 'footer-placeholder';
  var FOOTER_URL = './footer.html';
  var ver = (typeof window.APP_VERSION === 'string' && window.APP_VERSION) ? window.APP_VERSION : Date.now().toString();
  var fetchUrl = FOOTER_URL + (FOOTER_URL.includes('?') ? '&' : '?') + 'v=' + encodeURIComponent(ver);

  // --- Language map (keys must match your radio values) -----------------------
  // Compact, plain HTML with <br /> breaks to match your original layout.
  var I18N = {
    'en-GB': {
      disclaimer:
        '<strong>Disclaimer</strong><br />' +
        'Oxyaudit is an audit aid for counting packaged tablets. Intended for healthcare professionals. It is not CE-marked and is not a medical device.<br />' +
        'Results may contain errors and have not been validated. Do not use for patient-specific decisions, prescribing or dosing.<br />' +
        'Always verify counts manually against physical stock, pack sizes and labels, and follow local policies and official product information.<br />' +
        'Use entirely at your own risk.'
    },
    'nb-NO': {
      disclaimer:
        '<strong>Ansvarsfraskrivelse</strong><br />' +
        'Oxyaudit er et hjelpemiddel for revisjon til å telle pakkede tabletter. Beregnet for helsepersonell. Det er ikke CE-merket og er ikke medisinsk utstyr.<br />' +
        'Resultater kan inneholde feil og er ikke validert. Må ikke brukes til pasientspesifikke beslutninger, forskrivning eller dosering.<br />' +
        'Kontroller alltid tellinger manuelt mot fysisk lager, pakkestørrelser og etiketter, og følg lokale prosedyrer og offisiell preparatomtale.<br />' +
        'Bruk skjer på eget ansvar.'
    },
    'nn-NO': {
      disclaimer:
        '<strong>Fråsegn om ansvar</strong><br />' +
        'Oxyaudit er eit revisjonshjelpemiddel for å telje pakka tablettar. For helsepersonell. Det er ikkje CE-merkt og er ikkje medisinsk utstyr.<br />' +
        'Resultat kan innehalde feil og er ikkje validerte. Ikkje bruk til pasientspesifikke avgjerder, forskriving eller dosering.<br />' +
        'Kontroller alltid manuelt mot fysisk lager, pakkestorleikar og etikettar, og følg lokale retningslinjer og offisiell preparatomtale.<br />' +
        'Bruk på eige ansvar.'
    },
    'sv-SE': {
      disclaimer:
        '<strong>Ansvarsfriskrivning</strong><br />' +
        'Oxyaudit är ett granskningsstöd för att räkna förpackade tabletter. Avsett för hälso- och sjukvårdspersonal. Det är inte CE-märkt och inte en medicinteknisk produkt.<br />' +
        'Resultat kan innehålla fel och är inte validerade. Får inte användas för patient-specifika beslut, ordination eller dosering.<br />' +
        'Verifiera alltid manuellt mot fysiskt lager, förpackningsstorlekar och etiketter, och följ lokala riktlinjer samt officiell produktinformation.<br />' +
        'Användning sker helt på egen risk.'
    },
    'da-DK': {
      disclaimer:
        '<strong>Ansvarsfraskrivelse</strong><br />' +
        'Oxyaudit er et revisionsværktøj til optælling af pakkede tabletter. Tiltænkt sundhedspersonale. Det er ikke CE-mærket og er ikke medicinsk udstyr.<br />' +
        'Resultater kan indeholde fejl og er ikke valideret. Må ikke bruges til patient-specifikke beslutninger, ordination eller dosering.<br />' +
        'Verificér altid manuelt mod fysisk lager, pakkestørrelser og etiketter, og følg lokale retningslinjer og officiel produktinformation.<br />' +
        'Brug sker helt på eget ansvar.'
    },
    'fi-FI': {
      disclaimer:
        '<strong>Vastuuvapauslauseke</strong><br />' +
        'Oxyaudit on auditointiapu pakattujen tablettien laskemiseen. Tarkoitettu terveydenhuollon ammattilaisille. Se ei ole CE-merkitty eikä lääkinnällinen laite.<br />' +
        'Tulokset voivat sisältää virheitä eikä niitä ole validoitu. Älä käytä potilaskohtaisiin päätöksiin, määräämiseen tai annosteluun.<br />' +
        'Varmenna laskelmat aina manuaalisesti fyysisen varaston, pakkauskokojen ja etikettien perusteella, ja noudata paikallisia ohjeita sekä virallista valmisteyhteenvetoa.<br />' +
        'Käyttö omalla vastuulla.'
    },
    'es-ES': {
      disclaimer:
        '<strong>Aviso legal</strong><br />' +
        'Oxyaudit es una ayuda de auditoría para contar comprimidos envasados. Destinada a profesionales sanitarios. No está marcado CE y no es un producto sanitario.<br />' +
        'Los resultados pueden contener errores y no han sido validados. No debe utilizarse para decisiones específicas de pacientes, prescripción ni dosificación.<br />' +
        'Verifique siempre los recuentos manualmente con el stock físico, tamaños de envase y etiquetas, y siga las políticas locales y la información oficial del producto.<br />' +
        'Uso bajo su exclusiva responsabilidad.'
    },
    'fr-FR': {
      disclaimer:
        '<strong>Clause de non-responsabilité</strong><br />' +
        'Oxyaudit est un outil d’audit pour compter des comprimés conditionnés. Destiné aux professionnels de santé. Il n’est pas marqué CE et n’est pas un dispositif médical.<br />' +
        'Les résultats peuvent comporter des erreurs et n’ont pas été validés. Ne pas utiliser pour des décisions propres à un patient, une prescription ou un dosage.<br />' +
        'Vérifiez toujours les comptages manuellement avec le stock physique, les formats d’emballage et les étiquettes, et suivez les politiques locales et l’information officielle du produit.<br />' +
        'Utilisation entièrement à vos risques.'
    },
    'it-IT': {
      disclaimer:
        '<strong>Esclusione di responsabilità</strong><br />' +
        'Oxyaudit è un ausilio di audit per contare compresse confezionate. Destinato ai professionisti sanitari. Non è marcato CE e non è un dispositivo medico.<br />' +
        'I risultati possono contenere errori e non sono stati convalidati. Non utilizzare per decisioni specifiche del paziente, prescrizione o dosaggio.<br />' +
        'Verificare sempre manualmente i conteggi rispetto allo stock fisico, ai formati di confezione e alle etichette, e seguire le politiche locali e le informazioni ufficiali sul prodotto.<br />' +
        'Uso a proprio rischio.'
    },
    'de-DE': {
      disclaimer:
        '<strong>Haftungsausschluss</strong><br />' +
        'Oxyaudit ist eine Audithilfe zum Zählen verpackter Tabletten. Für Angehörige der Gesundheitsberufe bestimmt. Es ist nicht CE-gekennzeichnet und kein Medizinprodukt.<br />' +
        'Ergebnisse können Fehler enthalten und sind nicht validiert. Nicht für patientenspezifische Entscheidungen, Verordnung oder Dosierung verwenden.<br />' +
        'Zählen Sie stets manuell nach und vergleichen Sie mit physischem Bestand, Packungsgrößen und Etiketten, und befolgen Sie lokale Richtlinien und die offizielle Produktinformation.<br />' +
        'Verwendung auf eigenes Risiko.'
    }
  };

  // --- helpers ---------------------------------------------------------------
  function getLang() {
    // Prefer the selected radio; fallback to <html lang>, then en-GB
    var checked = document.querySelector('input[name="calc15-language"]:checked');
    if (checked && checked.value) return checked.value;
    var htmlLang = (document.documentElement.getAttribute('lang') || '').trim();
    if (htmlLang) return htmlLang;
    return 'en-GB';
  }

  function removeLegacyFooters(exceptContainer) {
    // Remove any <footer> NOT inside our host container to prevent duplicates
    var footers = document.querySelectorAll('footer');
    footers.forEach(function (f) {
      if (!exceptContainer || !exceptContainer.contains(f)) {
        f.parentNode && f.parentNode.removeChild(f);
      }
    });
  }

  function localiseFooter(container) {
    if (!container) return;
    var lang = getLang();
    var strings = I18N[lang] || I18N['en-GB'];

    var disc = container.querySelector('#footer-disclaimer');
    if (disc && strings.disclaimer) {
      disc.innerHTML = strings.disclaimer;
    }

    // Copyright line: keep your existing format if present
    var year = String(new Date().getFullYear());
    var copy = container.querySelector('#footer-copyright');
    if (copy) {
      // Normalise to "© YEAR Andrew S. Louka"
      copy.textContent = '© ' + year + ' Andrew S. Louka';
    }

    // Optional: show version if you want
    var vEl = container.querySelector('#footer-version');
    if (vEl && typeof window.APP_VERSION === 'string' && window.APP_VERSION) {
      vEl.textContent = '· v' + window.APP_VERSION;
    }
  }

  function onLanguageChange(container) {
    // Re-localise whenever the language radio changes
    var radios = document.querySelectorAll('input[name="calc15-language"]');
    radios.forEach(function (r) {
      r.addEventListener('change', function () {
        localiseFooter(container);
      });
    });
  }

  function executeInlineScripts(container) {
    var scripts = container.querySelectorAll('script');
    scripts.forEach(function (oldScript) {
      var s = document.createElement('script');
      for (var i = 0; i < oldScript.attributes.length; i++) {
        var attr = oldScript.attributes[i];
        s.setAttribute(attr.name, attr.value);
      }
      if (oldScript.textContent) s.textContent = oldScript.textContent;
      oldScript.parentNode.replaceChild(s, oldScript);
    });
  }

  // --- main flow -------------------------------------------------------------
  function inject(html) {
    var host = document.getElementById(TARGET_ID);
    if (!host) return;

    // Remove any legacy footers first
    removeLegacyFooters(host);

    // Inject our footer fragment
    host.innerHTML = html;

    // Localise and wire up language changes
    localiseFooter(host);
    onLanguageChange(host);

    // Execute any scripts that may be present in the fragment
    executeInlineScripts(host);
  }

  function fallback() {
    var host = document.getElementById(TARGET_ID);
    if (!host) return;
    var html = [
      '<footer role="contentinfo">',
      '  <div class="footer-inner">',
      '    <p id="footer-disclaimer"></p>',
      '    <p id="footer-copyright"></p>',
      '  </div>',
      '</footer>'
    ].join('\n');
    inject(html);
  }

  function load() {
    fetch(fetchUrl, { credentials: 'same-origin' })
      .then(function (res) { return res.ok ? res.text() : Promise.reject(new Error('HTTP ' + res.status)); })
      .then(inject)
      .catch(function (err) {
        console.warn('footer-loader: failed to fetch footer.html:', err);
        fallback();
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load, { once: true });
  } else {
    load();
  }
})();
