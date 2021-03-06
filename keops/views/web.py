from django.conf import settings
from django.utils.translation import gettext as _
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden

from keops.contrib.base.models.ui import Menu
from keops.api import site


@login_required
def index(request, current_menu=None, context=None):
    groups = None
    if request.user.is_superuser:
        menu = Menu.objects.filter(parent_id=None)
    else:
        groups = [obj.pk for obj in request.user.groups.all()]
        menu = Menu.objects.filter(parent_id=None, groups__in=groups)
    if current_menu is None:
        current_menu = menu.first()
    else:
        if request.user.is_superuser:
            m = Menu.objects
        else:
            m = Menu.objects.filter(groups__in=groups)
        current_menu = m.get(pk=current_menu)

    if not current_menu:
        return HttpResponseForbidden('You do not have menu permissions!')

    ctx = {
        '_': _,
        'request': request,
        'user': request.user,
        'groups': groups,
        'menu': menu,
        'settings': settings,
        'current_menu': current_menu,
    }

    if context:
        ctx.update(context)

    return render(request, '/keops/web/index.html', ctx)


@login_required
def action(request, service, action_id):
    if service is None:
        from keops.contrib.base.models import Action
        action = get_object_or_404(Action, pk=action_id)
        act_cls = Action.ACTIONS[action.action_type]
        action_id = get_object_or_404(act_cls, pk=action_id)
        return action_id.dispatch_action(request)
    svc = site.services[service]
    return svc(request).dispatch_action(action_id)
