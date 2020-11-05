(function (d) {
  'use strict';

  var docklinEecToGa4 = d.docklinEecToGa4

  function processQueue(args) {
    var params = [].slice.call(args),
      method = params.shift();

    if (docklinEecToGa4[method]) {
      docklinEecToGa4[method].apply(docklinEecToGa4, params);
    } else {
      console.log('docklinEecToGa4 does not have a ' + method + ' function');
    }
  }

  docklinEecToGa4.init = function (id, key) {
    console.log('init called', id, key);
  };

  docklinEecToGa4.send = function (data) {
    console.log('send called', data);
  };

  docklinEecToGa4.trackGa4Ecommerce = function (data) {
    var ecommerce = data['ecomm'] || "";
    var settings = data['settings'] || []
    var ga4o = {}
    var possibleActions = []
    for (var key in docklinEecToGa4.lookUp) {
      if (ecommerce.hasOwnProperty(key)) {
        possibleActions.push(docklinEecToGa4.lookUp[key])
      }
    }



    if (possibleActions || possibleActions.length) {
      for (var i = 0; i < possibleActions.length; i++) {
        ga4o = docklinEecToGa4.internalMap[possibleActions[i]](ecommerce, settings)
        if (!ga4o.push) {
          console.warn(ga4o.data)
          continue
        }
        ga4o.data.event = possibleActions[i]
        dataLayer.push({
          'event': 'ga4Ecommerce',
          'ga4Ecomm': ga4o.data,
          _clear: true
        })

      }
    }

  }
  docklinEecToGa4.lookUp = {
    'impressions': 'view_item_list',
    'click': 'select_item',
    'detail': 'view_item',
    'add': 'add_to_cart',
    'remove': 'remove_from_cart',
    'promoView': 'view_promotion',
    'promoClick': 'select_promotion',
    'checkout': 'begin_checkout',
    'purchase': 'purchase'
  }
  docklinEecToGa4.internalMap = {
    'view_item': function (ec, settings) {
      var mappingList;
      var items = []
      var value = 0;
      for (var i = 0; i < ec.detail.products.length; i++) {
        var item = {}
        for (var v in ec.detail.actionField) {
          if (!docklinEecToGa4.utils['testPropertyActionField'](v)) { continue }
          mappingList = docklinEecToGa4.ecommParamMapping['actionField'][v](ec.detail.actionField[v], settings);
          for (var j = 0; j < mappingList.length; j++) {
            item[mappingList[j].key] = mappingList[j].value
          }
        }

        for (var key in ec.detail.products[i]) {
          if (!docklinEecToGa4.utils['testProperty'](key)) { continue }

          mappingList = docklinEecToGa4.ecommParamMapping[key](ec.detail.products[i][key], settings)
          for (var j = 0; j < mappingList.length; j++) {
            item[mappingList[j].key] = mappingList[j].value
          }

        }
        i
        items.push(item)
      }
      return {
        0: {
          'key': 'currency',
          'value': settings.currency
        },
        1: {
          'key': 'items',
          'value': items
        },
        2: {
          'key': 'value',
          'value': items.reduce(function (a, b) {
            if (b.hasOwnProperty('price')) {
              return a + parseFloat(b['price']);
            }
            return a

          }, 0)
        }
      }
    },
    'add_to_cart': function (ec, settings) {
      var mappingList;
      var ecObj = {};
      var items = []
      for (var i = 0; i < ec.add.products.length; i++) {
        var item = {}
        for (var v in ec.add.actionField) {
          if (!docklinEecToGa4.utils['testPropertyActionField'](v)) { continue }
          mappingList = docklinEecToGa4.ecommParamMapping['actionField'][v](ec.add.actionField[v], settings);
          for (var j = 0; j < mappingList.length; j++) {
            item[mappingList[j].key] = mappingList[j].value
          }
        }
        for (var key in ec.add.products[i]) {
          if (!docklinEecToGa4.utils['testProperty'](key)) { continue }
          mappingList = docklinEecToGa4.ecommParamMapping[key](ec.add.products[i][key], settings)
          for (var j = 0; j < mappingList.length; j++) {
            item[mappingList[j].key] = mappingList[j].value
          }
        }
        items.push(item)
      }
      return {
        'push': true,
        'data': {
          0: {
            'key': 'currency',
            'value': settings.currency
          },
          1: {
            'key': 'items',
            'value': items
          },
          2: {
            'key': 'value',
            'value': items.reduce(function (a, b) {
              if (b.hasOwnProperty('price')) {
                return a + parseFloat(b['price']);
              }
              return a

            }, 0)
          }
        }
      }
    },
    'remove_from_cart': function (ec, settings) {
      var mappingList;
      var ecObj = {}
      var items = []
      for (var i = 0; i < ec.remove.products.length; i++) {
        var item = {}
        for (var v in ec.remove.actionField) {
          if (!docklinEecToGa4.utils['testPropertyActionField'](v)) { continue }
          mappingList = docklinEecToGa4.ecommParamMapping['actionField'][v](ec.remove.actionField[v], settings);
          for (var j = 0; j < mappingList.length; j++) {
            item[mappingList[j].key] = mappingList[j].value
          }
        }
        for (var key in ec.remove.products[i]) {
          if (!docklinEecToGa4.utils['testProperty'](key)) { continue }
          mappingList = docklinEecToGa4.ecommParamMapping[key](ec.remove.products[i][key], settings)
          for (var j = 0; j < mappingList.length; j++) {
            item[mappingList[j].key] = mappingList[j].value
          }
        }
        items.push(item)
      }

      return {
        'push': true,
        'data': {
          0: {
            'key': 'currency',
            'value': settings.currency
          },
          1: {
            'key': 'items',
            'value': items
          },
          2: {
            'key': 'value',
            'value': items.reduce(function (a, b) {
              if (b.hasOwnProperty('price')) {
                return a + parseFloat(b['price']);
              }
              return a

            }, 0)
          }
        }
      }
    },
    'view_item_list': function (ec, settings) {
      var mappingList;
      var items = []
      for (var i = 0; i < ec.impressions.length; i++) {
        var item = {}
        for (var v in ec.impressions.actionField) {
          if (!docklinEecToGa4.utils['testPropertyActionField'](v)) { continue }
          mappingList = docklinEecToGa4.ecommParamMapping['actionField'][v](ec.impressions.actionField[v], settings);
          for (var j = 0; j < mappingList.length; j++) {
            item[mappingList[j].key] = mappingList[j].value
          }
        }
        for (var key in ec.impressions[i]) {
          if (!docklinEecToGa4.utils['testProperty'](key)) { continue }
          mappingList = docklinEecToGa4.ecommParamMapping[key](ec.impressions[i][key], settings)
          for (var j = 0; j < mappingList.length; j++) {
            item[mappingList[j].key] = mappingList[j].value
          }
        }
        item['quantity'] = 1
        items.push(item)
      }
      return {
        'push': true,
        'data': {
          0: {
            'key': 'items',
            'value': items
          },
          1: {
            'key': 'item_list_name',
            'value': items.find(a => a.hasOwnProperty('item_list_name')).item_list_name
          },
          2: {
            'key': 'item_list_id',
            'value': items.find(a => a.hasOwnProperty('item_list_id')).item_list_name
          }
        }
      }
    },
    'select_item': function (ec, settings) {
      var mappingList;
      var items = []
      for (var i = 0; i < ec.click.products.length; i++) {
        var item = {}

        for (var v in ec.click.actionField) {
          if (!docklinEecToGa4.utils['testPropertyActionField'](v)) { continue }
          mappingList = docklinEecToGa4.ecommParamMapping['actionField'][v](ec.click.actionField[v], settings);
          for (var j = 0; j < mappingList.length; j++) {
            item[mappingList[j].key] = mappingList[j].value
          }
        }
        for (var key in ec.click.products[i]) {
          if (!docklinEecToGa4.utils['testProperty'](key)) { continue }
          mappingList = docklinEecToGa4.ecommParamMapping[key](ec.click.products[i][key], settings)
          for (var j = 0; j < mappingList.length; j++) {
            item[mappingList[j].key] = mappingList[j].value
          }
        }

        items.push(item)
      }
      return {
        'push': true,
        'data': {
          0: {
            'key': 'items',
            'value': items
          },
          1: {
            'key': 'item_list_name',
            'value': items.find(a => a.hasOwnProperty('item_list_name')).item_list_name
          },
          2: {
            'key': 'item_list_id',
            'value': items.find(a => a.hasOwnProperty('item_list_id')).item_list_name
          }
        }
      }
    },
    'view_promotion': function (ec, settings) {
      return {
        'push': false,
        'data': {
          'status': 'error',
          'message': 'currently no support for view_promotion'
        }
      }
    },
    'select_promotion': function (ec, settings) {
      return {
        'push': false,
        'data': {
          'status': 'error',
          'message': 'currently no support for select_promotion'
        }
      }
    },
    'begin_checkout': function (ec, settings) {
      var mappingList;
      var items = []
      for (var i = 0; i < ec.checkout.products.length; i++) {
        var item = {}
        item['index'] = (i + 1)
        for (var key in ec.checkout.products[i]) {
          if (!docklinEecToGa4.utils['testProperty'](key)) { continue }
          mappingList = docklinEecToGa4.ecommParamMapping[key](ec.checkout.products[i][key], settings)
          for (var j = 0; j < mappingList.length; j++) {
            item[mappingList[j].key] = mappingList[j].value
          }
        }
        items.push(item)
      }
      var coupon = items.find(a => a.hasOwnProperty('coupon'))
      if (coupon != undefined) {
        coupon = coupon.coupon
      }
      else {
        coupon = undefined
      }
      return {
        'push': true,
        'data': {
          0: {
            'key': 'currency',
            'value': settings.currency
          },
          1: {
            'key': 'items',
            'value': items
          },
          2: {
            'key': 'value',
            'value': items.reduce(function (a, b) {
              if (b.hasOwnProperty('price')) {
                return a + parseFloat(b['price']);
              }
              return a

            }, 0)
          },
          3: {
            'key': 'coupon',
            'value': coupon
          }
        }
      }
    },
    'purchase': function (ec, settings) {
      var mappingList;
      var transaction = {}
      transaction.purchase = {}
      for (var v in ec.purchase.actionField) {
        if (!docklinEecToGa4.utils['testPropertyActionField'](v)) { continue }
        mappingList = docklinEecToGa4.ecommParamMapping['actionField'][v](ec.purchase.actionField[v], settings);
        for (var j = 0; j < mappingList.length; j++) {
          transaction.purchase[mappingList[j].key] = mappingList[j].value
        }
      }
      transaction.items = []
      for (var i = 0; i < ec.purchase.products.length; i++) {
        var item = {}
        for (var key in ec.purchase.products[i]) {
          if (!docklinEecToGa4.utils['testProperty'](key)) { continue }
          mappingList = docklinEecToGa4.ecommParamMapping[key](ec.purchase.products[i][key], settings)
          for (var j = 0; j < mappingList.length; j++) {
            item[mappingList[j].key] = mappingList[j].value
          }
        }

        transaction.items.push(item)
      }
      return {
        'push': true,
        'data': {
          0: {
            'key': 'affiliation',
            'value': transaction.purchase.affiliation
          },
          1: {
            'key': 'coupon',
            'value': transaction.purchase.coupon || undefined
          },
          2: {
            'key': 'currency',
            'value': settings.currency
          },
          3: {
            'key': 'items',
            'value': transaction.items
          },
          4: {
            'key': 'transaction_id',
            'value': transaction.purchase.transaction_id
          },
          5: {
            'key': 'shipping',
            'value': transaction.purchase.shipping
          },
          6: {
            'key': 'tax',
            'value': transaction.purchase.tax
          },
          7: {
            'key': 'value',
            'value': transaction.purchase.value
          }
        }
      }
    }


  }

  docklinEecToGa4.utils = {
    'testProperty': function (p) {
      return p in docklinEecToGa4.ecommParamMapping;
    },
    'testPropertyActionField': function (p) {
      return p in docklinEecToGa4.ecommParamMapping['actionField']
    }
  }
  // MAPPING FOR ECOM ITEM ATTRIBUTES
  // @key – contains all EEC object keys for products and actionfields. Return GA4 keys with corresponding values, but trimmed. For category. Categories can be split to match              new GA4 item object structure.
  docklinEecToGa4.ecommParamMapping = {
    'name': function (v, settings) {
      return [{
        'key': 'item_name',
        'value': v.trim()
      }]
    },
    'id': function (v, settings) {
      return [{
        'key': 'item_id',
        'value': v.trim()
      }]
    },
    'price': function (v, settings) {
      return [{
        'key': 'price',
        'value': parseFloat(v)
      }]
    },
    'brand': function (v, settings) {
      return [{
        'key': 'item_brand',
        'value': v.trim()
      }]
    },
    'category': function (v, settings) {
      var list = [];
      v.split(settings['categoryLevelSeparator']).forEach(function (item, index, arr) {
        var key = "item_category";
        var catItem = {};
        if (index > 0) {
          key += "_" + index;
        }
        if (index > 4) { }
        if (index == 4) {
          catItem['key'] = key;
          catItem['value'] = v.split(settings['categoryLevelSeparator']).slice(index, arr.length).join(settings['categoryLevelSeparator'])
          list.push(catItem)

        }
        if (index < 4) {
          catItem['key'] = key;
          catItem['value'] = item.trim()
          list.push(catItem)
        }

      })
      if (list.length == 0) {
        list.push({
          'key': 'item_category',
          'value': v.trim()
        })
      }
      return list
    },
    'variant': function (v, settings) {
      return [{
        'key': 'item_variant',
        'value': v.trim()
      }]
    },
    'quantity': function (v, settings) {
      return [{
        'key': 'quantity',
        'value': parseInt(v)
      }]
    },
    'list': function (v, settings) {
      return [
        {
          'key': 'item_list_name',
          'value': v.trim()
        },
        {
          'key': 'item_list_id',
          'value': v.trim()
        }
      ]
    },
    'position': function (v, settings) {
      return [{
        'key': 'index',
        'value': parseInt(v)
      }]
    },
    'coupon': function (v, settings) {
      return [{
        'key': 'item_coupon',
        'value': v.trim()
      }]
    },
    'promotions': {
      'id': function (v, settings) {
        return [{
          'key': 'promotion_id',
          'value': v.trim()
        }]
      },
      'name': function (v, settings) {
        return [{
          'key': 'promotion_name',
          'value': v.trim()
        }]
      },
      'creative': function (v, settings) {
        return [{
          'key': 'creative_name',
          'value': v.trim()
        }]
      },
      'position': function (v, settings) {
        return [{
          'key': 'creative_slot',
          'value': v.trim()
        }]
      }

    },
    'actionField': {
      'list': function (v, settings) {
        return [
          {
            'key': 'item_list_name',
            'value': v.trim()
          },
          {
            'key': 'item_list_id',
            'value': v.trim()
          },
          {
            'key': 'index',
            'value': 1
          }
        ]

      },
      'step': function (v, settings) {
        return []
      },
      'option': function (v, settings) {
        return []
      },
      'id': function (v, settings) {
        return [{
          'key': 'transaction_id',
          'value': v.trim()
        }]
      },
      'affiliation': function (v, settings) {
        return [{
          'key': 'affiliation',
          'value': v.trim()
        }]
      },
      'revenue': function (v, settings) {
        return [{
          'key': 'value',
          'value': parseFloat(v)
        }]
      },
      'tax': function (v, settings) {
        return [{
          'key': 'tax',
          'value': parseFloat(v)
        }]
      },
      'shipping': function (v, settings) {
        return [{
          'key': 'shipping',
          'value': parseFloat(v)
        }]
      },
      'currency': function (v, settings) {
        return [{
          'key': 'currency',
          'value': v.trim()
        }]
      },
      'coupon': function (v, settings) {
        return [{
          'key': 'coupon',
          'value': v.trim()
        }]
      }
    }
  }

  for (var i in docklinEecToGa4.q || []) {
    processQueue(docklinEecToGa4.q[i]);
  }

  // swap original function with just loaded one
  d.docklinEecToGa4 = function () {
    processQueue(arguments);
  };

}(window));
