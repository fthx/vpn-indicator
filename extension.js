//    VPN Indicator
//    GNOME Shell extension
//    @fthx 2026


import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';
import St from 'gi://St';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as Util from 'resource:///org/gnome/shell/misc/util.js';


class VPNIndicator extends PanelMenu.Button {
    static {
        GObject.registerClass(this);
    }

    constructor() {
        super();

        this._quickSettings = Main.panel.statusArea.quickSettings;

        this._label = new St.Label({ y_align: Clutter.ActorAlign.CENTER });
        this.add_child(this._label);

        Main.panel.addToStatusArea('VPNIndicatorButton', this);

        this._setLabel();
        this._quickSettings?._indicators?.connectObject('notify::allocation', () => this._setLabel(), this);

        if (this._clickGesture)
            this.remove_action(this._clickGesture);
        this._clickGesture = new Clutter.ClickGesture();
        this._clickGesture.connect('recognize', () => Util.trySpawnCommandLine('gnome-control-center network'));
        this.add_action(this._clickGesture);
    }

    _setLabel() {
        if (this._toggle)
            return;

        this._toggle = this._quickSettings?._network?._vpnToggle;

        this._toggle?.bind_property('subtitle', this._label, 'text', GObject.BindingFlags.SYNC_CREATE);
        this._toggle?.bind_property('checked', this, 'visible', GObject.BindingFlags.SYNC_CREATE);
    }

    destroy() {
        this._quickSettings?._indicators?.disconnectObject(this);

        super.destroy();
    }
}

export default class VPNIndicatorExtension {
    enable() {
        this._vpnIndicator = new VPNIndicator();
    }

    disable() {
        this._vpnIndicator?.destroy();
        this._vpnIndicator = null;
    }
}
