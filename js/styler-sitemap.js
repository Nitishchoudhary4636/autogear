console.log("Styler Sitemap — TVS Motors Resilient v07");

(function () {
  if (typeof SalesforceInteractions === "undefined") {
    console.warn("SalesforceInteractions SDK not loaded — sitemap skipped. Add your Evergage/beacon script before styler-sitemap.js");
    return;
  }

  const DEFAULT_WAIT_TIMEOUT = 5000;
  const DEFAULT_WAIT_INTERVAL = 80;

  function getDataLayerValue(path) {
    if (!Array.isArray(window.dataLayer)) return null;
    for (var i = window.dataLayer.length - 1; i >= 0; i--) {
      var obj = window.dataLayer[i];
      var current = obj;
      for (var j = 0; j < path.length; j++) {
        if (current && current[path[j]] !== undefined) {
          current = current[path[j]];
        } else {
          current = null;
          break;
        }
      }
      if (current !== null && current !== undefined) return current;
    }
    return null;
  }

  function getCartItems() {
    const items = getDataLayerValue(["MCP", "items"]) || [];
    const currency = getDataLayerValue(["MCP", "currency"]) || "INR";
    return items.map(function (it) {
      return {
        catalogObjectType: "Product",
        catalogObjectId: it.item_id || it.id || null,
        price: parseFloat(it.price) || 0,
        quantity: parseInt(it.quantity, 10) || 0,
        attributes: {
          sku: it.item_sku || it.id,
          name: it.item_name || it.name || "",
          currency: currency
        }
      };
    }).filter(function (i) { return !!i.catalogObjectId; });
  }

  function waitForElement(selector, timeout, interval) {
    timeout = timeout || DEFAULT_WAIT_TIMEOUT;
    interval = interval || DEFAULT_WAIT_INTERVAL;
    return new Promise(function (resolve, reject) {
      var start = Date.now();
      function check() {
        try {
          var el = document.querySelector(selector);
          if (el) return resolve(el);
        } catch (e) {}
        if (Date.now() - start >= timeout) {
          return reject(new Error("Timeout waiting for element: " + selector));
        }
        setTimeout(check, interval);
      }
      check();
    });
  }

  function resolveSelectorWithFallback(selectors, timeout) {
    if (!selectors) return Promise.reject(new Error("No selector provided"));
    var list = Array.isArray(selectors) ? selectors : [selectors];
    timeout = timeout || DEFAULT_WAIT_TIMEOUT;
    return new Promise(function (resolve, reject) {
      var start = Date.now();
      function tryNext(index) {
        if (index >= list.length) {
          var fallback = list[0];
          waitForElement(fallback, Math.max(0, timeout - (Date.now() - start)))
            .then(function () { resolve(fallback); })
            .catch(function () { reject(new Error("None of the selectors appeared: " + JSON.stringify(list))); });
          return;
        }
        var sel = list[index];
        try {
          if (document.querySelector(sel)) return resolve(sel);
        } catch (e) {}
        if (Date.now() - start >= timeout) {
          waitForElement(list[0], 0).then(function () { resolve(list[0]); }).catch(function () {
            reject(new Error("Timeout trying fallback selectors: " + JSON.stringify(list)));
          });
          return;
        }
        setTimeout(function () { tryNext(index + 1); }, 60);
      }
      tryNext(0);
    });
  }

  function waitForDataLayerValue(path, timeout, interval) {
    timeout = timeout || 3000;
    interval = interval || 80;
    return new Promise(function (resolve, reject) {
      var start = Date.now();
      function check() {
        var value = getDataLayerValue(path);
        if (value !== null && value !== undefined) resolve(value);
        else if (Date.now() - start >= timeout) reject(new Error("Timeout waiting datalayer: " + path.join(".")));
        else setTimeout(check, interval);
      }
      check();
    });
  }

  SalesforceInteractions.init({
    cookieDomain: window.location.hostname
  }).then(function () {

    var sitemapConfig = {
      global: {
        contentZones: [
          { name: "global_survey_feedback" },
          { name: "global_header", selector: [".ag-header", "header.site-header", "#header"] },
          { name: "global_footer", selector: ["footer.site", ".site footer", "#footer"] },
          { name: "global_Product_recommendation", selector: ["#product-recommendation", ".global-product-recommendation", ".ag-cart-upsell"] },
          { name: "global_welcome" },
          { name: "global_exit_intent" }
        ]
      },

      pageTypeDefault: {
        name: "default",
        interaction: { name: "Default Page" }
      },

      pageTypes: [
        {
          name: "home",
          isMatch: function () {
            return waitForDataLayerValue(["MCP", "pageName"], 2000, 80)
              .then(function (pt) { return pt === "Home"; })
              .catch(function () { return false; });
          },
          interaction: { name: "Home Page" },
          contentZones: [
            { name: "home_recommendation", selector: [".featured-products", "#topSellers", ".acc-section"] },
            { name: "home_banner", selector: ["#hero", ".hero", ".acc-hero"] }
          ]
        },

        {
          name: "category",
          isMatch: function () {
            return waitForDataLayerValue(["MCP", "itemListId"], 2000, 80)
              .then(function (listId) { return listId !== null && listId !== undefined; })
              .catch(function () { return false; });
          },
          interaction: {
            name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
            catalogObject: {
              type: "Category",
              id: function () { return getDataLayerValue(["MCP", "itemListId"]) || "unknown_category"; },
              attributes: {
                name: function () { return getDataLayerValue(["MCP", "itemListName"]) || null; },
                url: SalesforceInteractions.resolvers.fromHref()
              }
            }
          },
          contentZones: [
            {
              name: "plp_recommendation",
              selector: function () {
                return resolveSelectorWithFallback([
                  ".acc-catalog",
                  ".acc-catalog-grid",
                  ".cat-grid",
                  ".products-section",
                  ".plp-products",
                  "#catalogGrid",
                  "#modelGrid"
                ], 4000);
              }
            }
          ]
        },

        {
          name: "pdp",
          isMatch: function () {
            return waitForDataLayerValue(["MCP", "pageType"], 2000, 80)
              .then(function (pt) { return pt === "Product"; })
              .catch(function () { return false; });
          },
          interaction: {
            name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
            catalogObject: {
              type: "Product",
              id: function () { return getDataLayerValue(["MCP", "Item", "id"]); },
              attributes: {
                sku: { id: function () { return getDataLayerValue(["MCP", "Item", "id"]); } },
                name: function () { return getDataLayerValue(["MCP", "Item", "name"]); },
                description: function () { return getDataLayerValue(["MCP", "Item", "description"]); },
                imageUrl: function () {
                  var img = getDataLayerValue(["MCP", "Item", "imageUrl"]);
                  if (!img) return window.location.origin + "/images/p1.jpg";
                  if (img.indexOf("http") === 0) return img;
                  return window.location.origin + (img.charAt(0) === "/" ? img : "/" + img);
                },
                url: function () { return getDataLayerValue(["MCP", "Item", "url"]); },
                currency: function () { return getDataLayerValue(["MCP", "currency"]) || "INR"; },
                inventoryCount: 1,
                price: function () { return getDataLayerValue(["MCP", "Item", "price"]) || 0; },
                availability: function () { return getDataLayerValue(["MCP", "Item", "availability"]) || "InStock"; }
              },
              relatedCatalogObjects: {
                Category: function () {
                  var cat = getDataLayerValue(["MCP", "Item", "category"]);
                  return cat ? [cat] : [];
                }
              }
            }
          },
          contentZones: [
            { name: "pdp_recommendation", selector: ["#pdp_recommendation", ".tvs-fbt", ".tvs-section"] }
          ],
          listeners: [
            SalesforceInteractions.listener("click", ".tvs-add-cart, .col-add-btn, .btn-add-cart", function () {
              var id = getDataLayerValue(["MCP", "Item", "id"]);
              var price = getDataLayerValue(["MCP", "Item", "price"]) || 0;
              var name = getDataLayerValue(["MCP", "Item", "name"]);
              if (!id) {
                console.warn("AddToCart — MCP.Item.id missing");
                return;
              }
              SalesforceInteractions.sendEvent({
                interaction: {
                  name: SalesforceInteractions.CartInteractionName.AddToCart,
                  lineItem: {
                    catalogObjectType: "Product",
                    catalogObjectId: id,
                    quantity: 1,
                    price: price,
                    attributes: { name: name, sku: { id: id } }
                  }
                }
              });
            })
          ]
        },

        {
          name: "Cart page",
          isMatch: function () {
            return waitForDataLayerValue(["MCP", "pageType"], 2000, 80)
              .then(function (pt) { return pt === "Cart"; })
              .catch(function () { return false; });
          },
          interaction: {
            name: SalesforceInteractions.CartInteractionName.ReplaceCart,
            lineItem: function () { return getCartItems(); }
          },
          contentZones: [
            { name: "cart_recommendation", selector: ["#cartDrawerUpsell", ".ag-cart-upsell", "#cartDrawerBody"] }
          ]
        },

        {
          name: "checkout",
          isMatch: function () {
            return waitForDataLayerValue(["MCP", "pageType"], 5000, 50)
              .then(function (pt) { return pt === "view_checkout"; })
              .catch(function () { return false; });
          },
          interaction: {
            name: "Checkout",
            lineItem: function () { return getCartItems(); }
          },
          listeners: [
            SalesforceInteractions.listener("click", "#checkoutContinueBtn, .ag-co-continue", function () {
              if (typeof checkoutStep !== "undefined" && checkoutStep !== "payment") return;
              var firstName = SalesforceInteractions.cashDom("#coName").val();
              var phone = SalesforceInteractions.cashDom("#coPhone").val();
              var address = SalesforceInteractions.cashDom("#coAddress1").val();
              var city = SalesforceInteractions.cashDom("#coCity").val();
              var state = SalesforceInteractions.cashDom("#coState").val();
              var pincode = SalesforceInteractions.cashDom("#coPincode").val();
              SalesforceInteractions.sendEvent({
                interaction: { name: "Payment Initiated" },
                user: {
                  attributes: {
                    firstName: firstName,
                    phone: phone,
                    addressLine1: address,
                    city: city,
                    stateProvince: state,
                    postalCode: pincode
                  }
                }
              });
            })
          ]
        },

        {
          name: "login",
          isMatch: function () {
            return waitForDataLayerValue(["MCP", "pageType"], 2000, 80)
              .then(function (pt) { return pt === "login"; })
              .catch(function () { return false; });
          },
          interaction: { name: "Login Page" },
          listeners: [
            SalesforceInteractions.listener("submit", "#emailForm, #loginForm, #registerForm", function () {
              var email = SalesforceInteractions.cashDom("#email").val();
              if (email) email = email.trim().toLowerCase();
              var firstName = SalesforceInteractions.cashDom("#name").val();
              if (firstName) firstName = firstName.trim();
              var marketingOptIn = SalesforceInteractions.cashDom("#newsletter").is(":checked");
              if (email) {
                SalesforceInteractions.sendEvent({
                  interaction: { name: "Register/Login User" },
                  user: {
                    identities: { emailAddress: email },
                    attributes: {
                      firstName: firstName || "",
                      marketingOptIn: marketingOptIn
                    }
                  }
                });
              }
            })
          ]
        },

        {
          name: "contact",
          isMatch: function () {
            return waitForDataLayerValue(["MCP", "pageType"], 2000, 80)
              .then(function (pt) { return pt === "Contact"; })
              .catch(function () { return false; });
          },
          interaction: { name: "Viewed Contact Us Page" },
          contentZones: [
            {
              name: "contact_us",
              selector: function () {
                return resolveSelectorWithFallback([".contact-form", "#cform", ".contact-form-section"], 4000);
              }
            }
          ],
          listeners: [
            SalesforceInteractions.listener("submit", "#cform", function () {
              var inputs = SalesforceInteractions.cashDom("#cform input");
              var email = "";
              var firstName = "";
              inputs.each(function () {
                var type = (this.type || "").toLowerCase();
                var val = SalesforceInteractions.cashDom(this).val();
                if (type === "email") email = val.trim();
                if (type === "text" && !firstName) firstName = val.trim();
              });
              if (email) {
                SalesforceInteractions.sendEvent({
                  interaction: { name: "Contact Form Submit" },
                  user: {
                    identities: { emailAddress: email },
                    attributes: { firstName: firstName }
                  }
                });
              }
            })
          ]
        },

        {
          name: "purchase",
          isMatch: function () {
            return waitForDataLayerValue(["MCP", "pageType"], 2000, 80)
              .then(function (pt) { return pt === "Purchase"; })
              .catch(function () { return false; });
          },
          interaction: {
            name: "Purchase Confirmation",
            lineItem: function () { return getCartItems(); }
          }
        }
      ]
    };

    SalesforceInteractions.initSitemap(sitemapConfig);
  });
})();
