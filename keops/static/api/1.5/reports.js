// Generated by CoffeeScript 1.10.0
(function() {
  var Param, Params, Report, Reports, _counter;

  _counter = 0;

  Reports = (function() {
    function Reports() {}

    Reports.preview = function(format) {
      var fields, grouping, params, sorting, totals;
      params = {
        data: [],
        file: $('#id-report-file').val()
      };
      $('[data-param]').each(function() {
        var param, pt, scope;
        scope = angular.element(this).scope();
        param = scope.param;
        pt = $(this).data('param');
        param.name = pt.name;
        param.type = pt.type;
        return params.data.push(param);
      });
      fields = $('#report-id-fields').val();
      params['fields'] = fields;
      totals = $('#report-id-totals').val();
      params['totals'] = totals;
      sorting = $('#report-id-sorting').val();
      params['sorting'] = sorting;
      grouping = $('#report-id-grouping').val();
      params['grouping'] = grouping;
      params['format'] = format;
      $.ajax({
        type: 'POST',
        url: $('#report-form').attr('action'),
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        data: JSON.stringify(params)
      }).then(function(res) {
        if (res.open) {
          return window.open(res.open);
        }
      });
      return false;
    };

    Reports["export"] = function(format) {
      return this.preview(format);
    };

    Reports.get = function(repName) {};

    return Reports;

  })();

  Report = (function() {
    function Report(info, scope1) {
      this.info = info;
      this.scope = scope1;
      this.name = this.info.name;
      this.id = ++_counter;
      this.values = {};
      this.params = [];
      this.groupables = [];
      this.sortables = [];
      this.totals = [];
      this.load();
    }

    Report.prototype.load = function() {
      var i, len, p, ref, results;
      ref = this.info.fields;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        p = ref[i];
        if (p.groupable) {
          this.groupables.push(p);
        }
        if (p.sortable) {
          this.sortables.push(p);
        }
        if (p.total) {
          this.totals.push(p);
        }
        if (p.param != null) {
          p = new Param(p, this);
          results.push(this.params.push(p));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Report.prototype.getValues = function() {};

    Report.prototype["export"] = function(format) {
      if (format == null) {
        format = 'pdf';
      }
      return this.preview(format);
    };

    Report.prototype.preview = function() {
      return console.log('Report preview');
    };

    Report.prototype.renderFields = function() {
      var aggs, el, flds, p, sel;
      el = $('<div></div>');
      flds = ((function() {
        var i, len, ref, results;
        ref = this.info.fields;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          p = ref[i];
          results.push("<option value=\"" + p.name + "\">" + p.label + "</option>");
        }
        return results;
      }).call(this)).join('');
      aggs = ((function() {
        var i, len, ref, results;
        ref = this.info.fields;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          p = ref[i];
          if (p.total) {
            results.push("<option value=\"" + p.name + "\">" + p.label + "</option>");
          }
        }
        return results;
      }).call(this)).join('');
      el = $('#report-params');
      sel = el.find('#report-id-fields');
      sel.append($(flds)).select2().select2("container").find("ul.select2-choices").sortable({
        containment: 'parent',
        start: function() {
          return sel.select2("onSortStart");
        },
        update: function() {
          return sel.select2("onSortEnd");
        }
      });
      sel = el.find('#report-id-totals');
      sel.append(aggs).select2().select2("container").find("ul.select2-choices").sortable({
        containment: 'parent',
        start: function() {
          return sel.select2("onSortStart");
        },
        update: function() {
          return sel.select2("onSortEnd");
        }
      });
      return el;
    };

    Report.prototype.renderParams = function(container) {
      var el, i, len, p, ref;
      el = $('<div></div>');
      ref = this.params;
      for (i = 0, len = ref.length; i < len; i++) {
        p = ref[i];
        if (p["static"]) {
          $(p.render(el));
        }
      }
      return container.find('#params-params').append(el);
    };

    Report.prototype.renderGrouping = function(container) {
      var el, opts, p, sel;
      opts = ((function() {
        var i, len, ref, results;
        ref = this.groupables;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          p = ref[i];
          results.push("<option value=\"" + p.name + "\">" + p.label + "</option>");
        }
        return results;
      }).call(this)).join('');
      el = container.find("#params-grouping");
      sel = el.find('select').select2();
      return sel.append(opts).select2("container").find("ul.select2-choices").sortable({
        containment: 'parent',
        start: function() {
          return sel.select2("onSortStart");
        },
        update: function() {
          return sel.select2("onSortEnd");
        }
      });
    };

    Report.prototype.renderSorting = function(container) {
      var el, opts, p, sel;
      opts = ((function() {
        var i, len, ref, results;
        ref = this.sortables;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          p = ref[i];
          if (p.sortable) {
            results.push("<option value=\"" + p.name + "\">" + p.label + "</option>");
          }
        }
        return results;
      }).call(this)).join('');
      el = container.find("#params-sorting");
      sel = el.find('select').select2();
      return sel.append(opts).select2("container").find("ul.select2-choices").sortable({
        containment: 'parent',
        start: function() {
          return sel.select2("onSortStart");
        },
        update: function() {
          return sel.select2("onSortEnd");
        }
      });
    };

    Report.prototype.render = function(container) {
      var el;
      el = this.renderFields();
      if (this.sortables.length) {
        el = this.renderSorting(container);
      }
      if (this.groupables.length) {
        el = this.renderGrouping(container);
      }
      return el = this.renderParams(container);
    };

    return Report;

  })();

  Params = (function() {
    function Params() {}

    Params.Operations = {
      equals: 'equals',
      "in": 'in',
      contains: 'contains',
      startsWith: 'startsWith',
      endsWith: 'endsWith',
      greaterThan: 'greaterThan',
      lessThan: 'lessThan',
      between: 'between'
    };

    Params.Labels = {
      equals: Katrid.i18n.gettext('É igual'),
      "in": Katrid.i18n.gettext('Seleção'),
      contains: Katrid.i18n.gettext('Contendo'),
      startsWith: Katrid.i18n.gettext('Começando com'),
      endsWith: Katrid.i18n.gettext('Terminando com'),
      greaterThan: Katrid.i18n.gettext('Maior que'),
      lessThan: Katrid.i18n.gettext('Menor que'),
      between: Katrid.i18n.gettext('Entre')
    };

    Params.DefaultOperations = {
      str: Params.Operations.equals,
      int: Params.Operations.equals,
      datetime: Params.Operations.between,
      float: Params.Operations.between,
      decimal: Params.Operations.between,
      sqlchoices: Params.Operations.equals
    };

    Params.TypeOperations = {
      str: [Params.Operations.equals, Params.Operations["in"], Params.Operations.contains, Params.Operations.startsWith, Params.Operations.endsWith],
      int: [Params.Operations.equals, Params.Operations["in"], Params.Operations.greaterThan, Params.Operations.lessThan, Params.Operations.between],
      float: [Params.Operations.equals, Params.Operations["in"], Params.Operations.greaterThan, Params.Operations.lessThan, Params.Operations.between],
      decimal: [Params.Operations.equals, Params.Operations["in"], Params.Operations.greaterThan, Params.Operations.lessThan, Params.Operations.between],
      datetime: [Params.Operations.equals, Params.Operations["in"], Params.Operations.greaterThan, Params.Operations.lessThan, Params.Operations.between],
      sqlchoices: [Params.Operations.equals, Params.Operations["in"]]
    };

    Params.Widgets = {
      str: function(param) {
        return "<div class=\"col-sm-8\"><label class=\"control-label\">&nbsp;</label><input id=\"rep-param-id-" + param.id + "\" ng-model=\"param.value1\" type=\"text\" class=\"form-control\"></div>";
      },
      int: function(param) {
        if (param.operation === 'between') {
          return "<div class=\"col-sm-4\"><label class=\"control-label\">&nbsp;</label><input id=\"rep-param-id-" + param.id + "\" ng-model=\"param.value1\" type=\"text\" class=\"form-control\"></div>\n<div class=\"col-sm-4\"><label class=\"control-label\">&nbsp;</label><input id=\"rep-param-id-" + param.id + "-2\" ng-model=\"param.value2\" type=\"text\" class=\"form-control\"></div>";
        } else {
          return "<div class=\"col-sm-4\"><label class=\"control-label\">&nbsp;</label><input id=\"rep-param-id-" + param.id + "\" type=\"number\" ng-model=\"param.value1\" class=\"form-control\"></div>";
        }
      },
      decimal: function(param) {
        if (param.operation === 'between') {
          return "<div class=\"col-sm-4\"><label class=\"control-label\">&nbsp;</label><input id=\"rep-param-id-" + param.id + "\" ng-model=\"param.value1\" type=\"text\" class=\"form-control\"></div>\n<div class=\"col-sm-4\"><label class=\"control-label\">&nbsp;</label><input id=\"rep-param-id-" + param.id + "-2\" ng-model=\"param.value2\" type=\"text\" class=\"form-control\"></div>";
        } else {
          return "<div class=\"col-sm-4\"><label class=\"control-label\">&nbsp;</label><input id=\"rep-param-id-" + param.id + "\" type=\"number\" ng-model=\"param.value1\" class=\"form-control\"></div>";
        }
      },
      datetime: function(param) {
        if (param.operation === 'between') {
          return "<div class=\"col-sm-4\"><label class=\"control-label\">&nbsp;</label><input id=\"rep-param-id-" + param.id + "\" datepicker ng-model=\"param.value1\" class=\"form-control\"></div>\n<div class=\"col-sm-4\"><label class=\"control-label\">&nbsp;</label><input id=\"rep-param-id-" + param.id + "-2\" datepicker ng-model=\"param.value2\" class=\"form-control\"></div>";
        } else {
          return "<div class=\"col-sm-4\"><label class=\"control-label\">&nbsp;</label><input id=\"rep-param-id-" + param.id + "\" datepicker ng-model=\"param.value1\" class=\"form-control\"></div>";
        }
      },
      sqlchoices: function(param) {
        return "<div class=\"col-sm-8\"><label class=\"control-label\">&nbsp;</label><input id=\"rep-param-id-" + param.id + "\" report-file=\"" + param.params.info.file + "\" ajax-choices=\"/api/reports/choices/\" sql-choices=\"" + param.name + "\" ng-model=\"param.value1\"></div>";
      }
    };

    return Params;

  })();

  Param = (function() {
    function Param(info, params1) {
      this.info = info;
      this.params = params1;
      this.name = this.info.name;
      this.label = this.info.label;
      this["static"] = this.info.param === 'static';
      this.type = this.info.type || 'str';
      if (this.info.sql_choices) {
        this.type = 'sqlchoices';
      }
      this.defaultOperation = this.info.default_operation || Params.DefaultOperations[this.type];
      this.operation = this.defaultOperation;
      this.operations = this.info.operations || Params.TypeOperations[this.type];
      this.exclude = this.info.exclude;
      this.id = ++_counter;
    }

    Param.prototype.defaultValue = function() {
      return null;
    };

    Param.prototype.change = function() {
      var op, ops;
      ops = this.el.find("#param-op-" + this.id);
      op = ops.val();
      this.operation = op;
      return this.createControls(this.el.scope());
    };

    Param.prototype.createControls = function(scope) {
      var el, widget;
      el = this.el.find("#param-widget-" + this.id);
      el.empty();
      widget = Params.Widgets[this.type](this);
      widget = this.params.scope.compile(widget)(scope);
      return el.append(widget);
    };

    Param.prototype.getOperations = function() {
      var i, label, len, op, operations, opts;
      operations = Params.TypeOperations[this.type];
      opts = '';
      for (i = 0, len = operations.length; i < len; i++) {
        op = operations[i];
        label = Params.Labels[op];
        opts += "<option value=\"" + op + "\">" + label + "</option>";
      }
      return opts;
    };

    Param.prototype.operationTemplate = function() {
      var opts;
      opts = this.getOperations();
      return "<div class=\"col-sm-4\"><label class=\"control-label\">" + this.label + "</label><select id=\"param-op-" + this.id + "\" ng-model=\"param.operation\" ng-init=\"param.operation='" + this.defaultOperation + "'\" class=\"form-control\" onchange=\"$('#param-" + this.id + "').data('param').change();$('#rep-param-id-" + this.id + "')[0].focus()\">\n" + opts + "\n</select></div>";
    };

    Param.prototype.template = function() {
      var operation;
      operation = this.operationTemplate();
      return "<div id=\"param-" + this.id + "\" class=\"row form-group\" data-param=\"" + this.name + "\" ng-controller=\"ParamController\"><div class=\"col-sm-12\">" + operation + "<div id=\"param-widget-" + this.id + "\"></div></div></div>";
    };

    Param.prototype.render = function(container) {
      this.el = this.params.scope.compile(this.template())(this.params.scope);
      this.el.data('param', this);
      console.log(this.el.scope());
      this.createControls(this.el.scope());
      return container.append(this.el);
    };

    return Param;

  })();

  Katrid.uiKatrid.controller('ParamController', function($scope, $element, $compile) {
    return $scope.param = {};
  });

  this.Katrid.Reports = {
    Reports: Reports,
    Report: Report,
    Param: Param
  };

}).call(this);

//# sourceMappingURL=reports.js.map
