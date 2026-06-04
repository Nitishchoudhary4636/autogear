/* ═══════════════════════════════════════════════════════════════
   mcp-model-deeplink.js
   ─────────────────────────────────────────────────────────────
   DROP THIS FILE in /js/ folder of accessories site
   and add this line at END of shop-by-model.html before </body>:

     <script src="js/mcp-model-deeplink.js" defer></script>

   WHAT IT DOES:
   1. Reads  ?model=raider  from URL → auto-selects that model
      in the <select id="vehicleSelect"> dropdown
   2. Reads  ?item=BoxKit   from URL → scrolls to + highlights
      that specific product card in the grid
   3. Works silently on all other pages (no ?model param = no-op)
   ═══════════════════════════════════════════════════════════════ */

(function () {

  // ── Read URL params ──────────────────────────────────────────
  var params    = new URLSearchParams(window.location.search);
  var modelParam = params.get('model');
  var itemParam  = params.get('item');
  if (typeof normalizeModelId === 'function') modelParam = normalizeModelId(modelParam);

  // Nothing to do if no model param
  if (!modelParam) return;

  // ── Wait for vehicleSelect + page render to finish ───────────
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {

    var select = document.getElementById('vehicleSelect');
    if (!select) return;

    // ── 1. Auto-select the model ─────────────────────────────
    // Check if the option value exists in the dropdown
    var matchedOption = Array.from(select.options).find(function (opt) {
      return opt.value.toLowerCase() === modelParam.toLowerCase();
    });

    if (!matchedOption) return; // model not found in dropdown, bail

    // Set dropdown value
    select.value = matchedOption.value;

    // Fire change event so site's existing onModelChange() runs
    // This re-renders the product grid for the selected model
    select.dispatchEvent(new Event('change', { bubbles: true }));

    // ── 2. Scroll to + highlight specific item (if ?item= given) ─
    if (!itemParam) return;

    // Product grid re-renders async after model change
    // Poll for the card to appear (max 3 seconds)
    var attempts = 0;
    var maxAttempts = 30; // 30 × 100ms = 3s

    var interval = setInterval(function () {
      attempts++;

      // Find card whose data-evg-item-id or pdp link contains itemParam
      // Matches: href="pdp.html?id=BoxKit" OR any card with matching text
      var cards = document.querySelectorAll('#modelGrid .col-card, #recommendedTrack .col-card');
      var targetCard = null;

      cards.forEach(function (card) {
        var link = card.querySelector('a[href*="' + itemParam + '"]');
        var slug = card.getAttribute('data-accessory-slug');
        var pid = card.getAttribute('data-product-id');
        var nameEl = card.querySelector('.col-card-body h3');
        var nameMatch = nameEl && nameEl.textContent.toLowerCase()
                          .indexOf(itemParam.toLowerCase()) > -1;
        var slugMatch = slug && slug.toLowerCase() === itemParam.toLowerCase();
        var idMatch = pid && String(pid) === String(itemParam);

        if (link || nameMatch || slugMatch || idMatch) {
          targetCard = card;
        }
      });

      if (targetCard) {
        clearInterval(interval);

        // Scroll card into view smoothly
        setTimeout(function () {
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

          // Highlight pulse animation
          targetCard.style.transition = 'box-shadow 0.3s, outline 0.3s';
          targetCard.style.outline    = '2.5px solid #f97316';
          targetCard.style.boxShadow  = '0 0 0 6px rgba(249,115,22,0.18)';

          // Remove highlight after 2.5s
          setTimeout(function () {
            targetCard.style.outline   = '';
            targetCard.style.boxShadow = '';
          }, 2500);
        }, 200);

        return;
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        // Item not found — model is still selected correctly, just no highlight
      }

    }, 100);

  });

})();
